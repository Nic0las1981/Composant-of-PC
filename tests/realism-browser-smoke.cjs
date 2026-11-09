// Visual regression checks for reconstructed hardware. All selections and
// raycasts use public controls. WebGL counters are injected only by this test.
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chooseOpenCatalogProduct } = require('./catalog-test-helpers.cjs');

const baseUrl = process.env.FORGE_TEST_URL || 'http://127.0.0.1:5173';
const output = process.env.FORGE_TEST_OUTPUT || '/tmp/forge-realism-v2-validation';
const requested = process.env.FORGE_REALISM_TEST_MATCH;

function observeWebGl() {
  const state = { frame: 0, current: { calls: 0, triangles: 0 }, frames: [], lost: 0 };
  window.__forgeObservedRender = state;
  const originalFrame = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = callback => originalFrame(time => {
    if (time !== state.frame) {
      if (state.current.calls) state.frames.push({ time: state.frame, ...state.current });
      if (state.frames.length > 240) state.frames.shift();
      state.frame = time;
      state.current = { calls: 0, triangles: 0 };
    }
    return callback(time);
  });
  const instrumented = new Set();
  for (const ctor of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
    if (!ctor) continue;
    for (const method of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
      const prototype = ctor.prototype;
      const original = prototype[method];
      if (!original || instrumented.has(original)) continue;
      const wrapped = function (...args) {
        const result = original.apply(this, args);
        const count = method.startsWith('drawArrays') ? args[2] : args[1];
        const instances = method.endsWith('Instanced') ? args[method.startsWith('drawArrays') ? 3 : 4] : 1;
        state.current.calls += 1;
        if (args[0] === 4) state.current.triangles += count / 3 * instances;
        else if (args[0] === 5 || args[0] === 6) state.current.triangles += Math.max(0, count - 2) * instances;
        return result;
      };
      instrumented.add(wrapped);
      prototype[method] = wrapped;
    }
  }
  document.addEventListener('webglcontextlost', () => state.lost++, true);
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const inheritedProxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true,
    ...(inheritedProxy ? { proxy: { server: inheritedProxy, bypass: '127.0.0.1,localhost' } } : {}),
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const results = [], errors = [], measurements = [], sourceTlsFailures = [];
  let context, page;
  const scene = () => page.locator('.studio-visualizer .pc-scene');
  const dialog = () => page.getByRole('dialog');
  const memory = () => page.locator('.memory-configurator');
  const test = async (name, run) => {
    if (requested && !new RegExp(requested).test(name)) return;
    try { await run(); results.push({ name, result: 'PASS' }); console.log('PASS', name); }
    catch (error) {
      results.push({ name, result: 'FAIL', error: error.message }); console.error('FAIL', name, error.message);
      if (page && !page.isClosed()) {
        await page.screenshot({ timeout: 60000, path: path.join(output, `realism-failure-${results.length}.png`) }).catch(() => {});
        await page.keyboard.press('Escape').catch(() => {});
      }
    }
  };
  const load = async (width = 1440) => {
    if (context) await context.close();
    context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 1000 }, deviceScaleFactor: 1, isMobile: width < 600, reducedMotion: 'reduce' });
    await context.addInitScript(observeWebGl);
    page = await context.newPage(); page.setDefaultTimeout(25000);
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() !== 'error') return;
      const url = message.location().url;
      if (message.text().includes('ERR_CERT_AUTHORITY_INVALID') && /^https:\/\/raw\.githubusercontent\.com\/xxderen\/pc-build\/main\/data\/(parts|prices)\.json$/.test(url)) {
        sourceTlsFailures.push({ url, message: message.text() });
      } else errors.push(`Console: ${message.text()} (${url})`);
    });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await scene().locator('canvas').waitFor();
    await page.waitForFunction(() => document.querySelector('.studio-visualizer .pc-scene')?.dataset.fanAngle !== undefined);
    await scene().scrollIntoViewIfNeeded(); await page.mouse.move(1, 1);
  };
  const choose = async (category, name) => {
    await page.getByRole('button', { name: `Choisir ${category}`, exact: true }).click();
    await chooseOpenCatalogProduct(page, name);
  };
  const reset = async () => {
    await page.getByRole('button', { name: 'Réinitialiser', exact: true }).click();
    await dialog().getByRole('button', { name: 'Réinitialiser', exact: true }).click();
    await dialog().waitFor({ state: 'hidden' });
    const exploded = page.getByRole('button', { name: 'Vue éclatée', exact: true });
    if (await exploded.getAttribute('aria-pressed') === 'true') await exploded.click();
    await page.getByRole('button', { name: 'Vue trois quarts', exact: true }).click();
    const interior = page.locator('.studio-view-toolbar .interior-toggle');
    if (await interior.getAttribute('aria-pressed') !== 'true') await interior.click();
  };
  const capture = async name => {
    await scene().evaluate(node => node.scrollIntoView({ block: 'center', inline: 'nearest' }));
    await page.mouse.move(1, 1); await page.waitForTimeout(700);
    await scene().screenshot({ timeout: 60000, path: path.join(output, `${name}.png`) });
  };
  const measure = async name => {
    await page.waitForFunction(() => (window.__forgeObservedRender?.frames.length ?? 0) >= 5);
    const sample = await page.evaluate(() => {
      const state = window.__forgeObservedRender;
      const frames = state.frames.slice(-20);
      const range = key => {
        const values = frames.map(frame => frame[key]).sort((a, b) => a - b);
        return { min: values[0], median: values[Math.floor(values.length / 2)], max: values.at(-1) };
      };
      return { frames: frames.length, calls: range('calls'), triangles: range('triangles'), contextLost: state.lost };
    });
    assert.equal(sample.contextLost, 0, 'The graphics context must remain usable');
    assert.ok(sample.calls.min > 0 && sample.triangles.min > 0, 'Real geometry must reach WebGL');
    measurements.push({ name, ...sample });
    // Hardware-independent counters are recorded for review. Software-renderer
    // frame rate is deliberately not presented as a user's GPU benchmark.
    await fs.writeFile(path.join(output, 'observed-render-cost.json'), JSON.stringify({ baseUrl, measurements }, null, 2));
  };
  const hitHardware = async (category, xs = [.54, .63, .45, .36, .72, .28], ys = [.48, .58, .38, .68, .28]) => {
    await scene().scrollIntoViewIfNeeded(); await page.mouse.move(1, 1); await page.waitForTimeout(350);
    const bounds = await scene().locator('canvas').boundingBox(); assert.ok(bounds && bounds.width > 100);
    const seen = new Set();
    for (const y of ys) for (const x of xs) {
      const point = { x: bounds.x + bounds.width * x, y: bounds.y + bounds.height * y };
      await page.mouse.move(point.x, point.y); await page.waitForTimeout(65);
      const found = await scene().getAttribute('data-hover-category'); if (found) seen.add(found);
      if (found === category) return { ...point, text: await scene().locator('.pc-hover-card').textContent() };
    }
    throw new Error(`A real pointer must identify ${category}; seen ${[...seen].join(', ')}`);
  };
  try {
    await load();
    await test('Default studio renders real GPU and air-cooler geometry with a healthy graphics context', async () => {
      assert.equal(await scene().getAttribute('data-case-id'), 'case-h6');
      assert.equal(await scene().getAttribute('data-cooler-model'), 'dual-tower');
      assert.equal(await scene().getAttribute('data-gpu-fans'), '2');
      const buffer = await scene().locator('canvas').screenshot({ timeout: 60000, path: path.join(output, 'default-canvas.png') });
      const png = PNG.sync.read(buffer), colors = new Set();
      for (let i = 0; i < png.data.length; i += 4 * 17) colors.add(`${png.data[i] >> 4},${png.data[i + 1] >> 4},${png.data[i + 2] >> 4}`);
      assert.ok(colors.size > 40, 'The canvas must contain rendered surfaces, not a flat fallback');
      await capture('default-air-studio'); await measure('default-air');
    });
    await test('Black and white finishes keep their distinct body and removable glass-panel rendering', async () => {
      await reset();
      await choose('Boîtier', '4000D Airflow');
      assert.equal(await scene().getAttribute('data-case-id'), 'case-4000d');
      await capture('case-4000d-black-open');
      await choose('Boîtier', '4000D Airflow · Blanc');
      assert.equal(await scene().getAttribute('data-case-id'), 'case-4000d-white');
      await capture('case-4000d-white-open');
      await measure('white-case-open');
      await page.locator('.studio-view-toolbar .interior-toggle').click();
      assert.equal(await page.locator('.studio-view-toolbar .interior-toggle').getAttribute('aria-pressed'), 'false');
      await capture('case-4000d-white-closed');
      await page.locator('.studio-view-toolbar .interior-toggle').click();
    });
    await test('A three-fan graphics card and AIO keep their radiator tubes and physical hover selection', async () => {
      await reset(); await choose('Boîtier', '4000D Airflow · Blanc');
      await choose('Carte graphique', 'GeForce RTX 4080 SUPER Gaming OC');
      await choose('Refroidissement', 'iCUE H100i ELITE CAPELLIX XT');
      assert.equal(await scene().getAttribute('data-gpu-fans'), '3');
      assert.equal(await scene().getAttribute('data-cooler-model'), 'aio');
      await capture('aio-gpu-three-quarter');
      await page.getByRole('button', { name: 'Vue de profil', exact: true }).click();
      await capture('aio-gpu-side'); await measure('aio-three-fan-gpu');
      const canvasBounds = await scene().locator('canvas').boundingBox();
      await page.mouse.move(canvasBounds.x + canvasBounds.width * .5, canvasBounds.y + canvasBounds.height * .5);
      await page.mouse.wheel(0, -260); await page.waitForTimeout(400);
      await capture('aio-gpu-closeup');
      await page.getByRole('button', { name: 'Recentrer la vue', exact: true }).click();
      const hit = await hitHardware('cooler');
      assert.match(hit.text, /H100i ELITE CAPELLIX XT/);
      await page.mouse.click(hit.x, hit.y);
      assert.match(await page.locator('.scene-selection-bar .selected-part-copy strong').textContent(), /H100i ELITE CAPELLIX XT/);
      await fs.writeFile(path.join(output, 'aio-hover.json'), JSON.stringify(hit, null, 2));
    });
    await test('Four bare OEM modules stay separately placed and identify their real 16 Go capacity on hover', async () => {
      await reset(); await choose('Processeur', 'Ryzen 5 5600'); await choose('Carte mère', 'B550-A PRO');
      await choose('Mémoire vive', 'M378A2K43EB1-CWE 16 Go (1 × 16 Go) DDR4-3200 2Rx8 UDIMM');
      await memory().getByRole('button', { name: 'Installer 4 barrettes', exact: true }).click();
      assert.equal(await scene().getAttribute('data-ram-count'), '4');
      assert.equal(await scene().getAttribute('data-ram-capacity'), '64');
      assert.equal(await scene().getAttribute('data-ram-slots'), 'A1,A2,B1,B2');
      await capture('four-bare-memory-assembled');
      await page.getByRole('button', { name: 'Vue de profil', exact: true }).click();
      await page.getByRole('button', { name: 'Vue éclatée', exact: true }).click();
      await capture('four-bare-memory-exploded');
      const xs = Array.from({ length: 71 }, (_, i) => .28 + i * .006);
      const hit = await hitHardware('ram', xs, [.35, .4, .3, .45, .25, .5]);
      assert.match(hit.text, /M378A2K43EB1-CWE/); assert.match(hit.text, /16 Go par barrette/); assert.match(hit.text, /2Rx8/);
      await fs.writeFile(path.join(output, 'four-memory-hover.json'), JSON.stringify(hit, null, 2));
      await scene().screenshot({ timeout: 60000, path: path.join(output, 'four-memory-hover.png') });
    });
    await test('Wooden and compact cases retain distinct geometry with a fitting compact assembly', async () => {
      await reset(); await choose('Boîtier', 'North · Charcoal Black');
      assert.equal(await scene().getAttribute('data-case-model'), 'wood-front');
      await capture('north-wood-case');
      await choose('Boîtier', 'Terra'); await choose('Processeur', 'Ryzen 5 7600');
      await choose('Carte mère', 'A620I Lightning WiFi'); await choose('Refroidissement', 'NH-L9a-AM5');
      await choose('Alimentation', 'SF750 · 750 W');
      assert.equal(await scene().getAttribute('data-case-model'), 'sandwich');
      assert.doesNotMatch(await page.locator('.compatibility-banner strong').textContent(), /incompatibilité/);
      await capture('terra-compact-case'); await measure('terra-compact');
    });
    await test('A 360mm radiator and fixed-cable power supply remain inspectable in the exploded view', async () => {
      await reset();
      await choose('Refroidissement', 'Liquid Freezer III 360');
      await choose('Alimentation', 'MAG A650BN · 650 W');
      assert.equal(await scene().getAttribute('data-cooler-model'), 'aio');
      assert.match(await page.locator('.scene-selection-bar .selected-part-copy strong').textContent(), /MAG A650BN/);
      await capture('aio-360-assembled');
      await page.getByRole('button', { name: 'Vue éclatée', exact: true }).click();
      await scene().scrollIntoViewIfNeeded();
      const bounds = await scene().locator('canvas').boundingBox();
      await page.mouse.move(bounds.x + bounds.width * .5, bounds.y + bounds.height * .5);
      await page.mouse.wheel(0, 160); await page.waitForTimeout(350);
      await capture('aio-360-fixed-cable-psu-exploded');
      await measure('aio-360-fixed-cable-psu');
      // The H6 power supply sits in its rear chamber. A real orbit reveals
      // the exploded supply; a front-only raycast must not pick through it.
      const orbit = await scene().locator('canvas').boundingBox();
      await page.mouse.move(orbit.x + 35, orbit.y + 35); await page.mouse.down();
      await page.mouse.move(orbit.x + 35 + orbit.height * .48, orbit.y + 35, { steps: 12 });
      await page.mouse.up(); await page.mouse.move(1, 1); await page.waitForTimeout(350);
      await capture('fixed-cable-psu-rear');
      const hit = await hitHardware('psu', [.4, .5, .3, .6, .35, .45, .55, .65, .25, .7, .75], [.8, .75, .85, .7, .9, .65]);
      assert.match(hit.text, /MAG A650BN/);
      await fs.writeFile(path.join(output, 'fixed-cable-psu-hover.json'), JSON.stringify(hit, null, 2));
      await scene().screenshot({ timeout: 60000, path: path.join(output, 'fixed-cable-psu-hover.png') });
    });
    await test('Mobile 360px keeps the enhanced scene and essential view controls within the viewport', async () => {
      await load(360);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 360);
      for (const button of [page.locator('.studio-view-toolbar .animation-toggle'), page.locator('.studio-view-toolbar .interior-toggle')]) {
        const bounds = await button.boundingBox(); assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= 361);
      }
      await capture('mobile-studio-360'); await measure('mobile-default');
    });
    await test('Enhanced reconstructed hardware has no uncaught browser exceptions', async () => assert.deepEqual(errors, []));
  } finally {
    if (context) await context.close(); await browser.close();
    await fs.writeFile(path.join(output, 'realism-results.json'), JSON.stringify({ baseUrl, results, errors, measurements, sourceTlsFailures }, null, 2));
    if (results.some(result => result.result === 'FAIL')) process.exitCode = 1;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
