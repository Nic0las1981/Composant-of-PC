// Optional browser checks for real scene animation and pointer interaction.
// Uses angles and texture phases read from Three objects, plus canvas pixel differences.
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const baseUrl = process.env.FORGE_TEST_URL || 'http://127.0.0.1:5173';
const output = process.env.FORGE_TEST_OUTPUT || '/tmp/forge-motion-validation';

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true,
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const results = [], errors = [];
  let activePage;
  const watch = (page) => {
    activePage = page;
    page.setDefaultTimeout(25000);
    page.on('pageerror', error => errors.push(error.message));
  };
  const test = async (name, run) => {
    try { await run(); results.push({ name, result: 'PASS' }); console.log('PASS', name); }
    catch (error) {
      results.push({ name, result: 'FAIL', error: error.message }); console.error('FAIL', name, error.message);
      if (activePage && !activePage.isClosed()) {
        await activePage.mouse.up().catch(() => {});
        await activePage.screenshot({ path: path.join(output, `motion-failure-${results.length}.png`) }).catch(() => {});
        await activePage.keyboard.press('Escape').catch(() => {});
      }
    }
  };
  const scene = page => page.locator('.studio-visualizer .pc-scene');
  const toggle = page => page.locator('.studio-view-toolbar .animation-toggle');
  const read = async (page, attribute) => {
    const value = await scene(page).getAttribute(attribute);
    assert.ok(value !== null && value !== '' && Number.isFinite(Number(value)), `${attribute} must contain a measured numeric value`);
    return Number(value);
  };
  const changedPixels = (beforeBuffer, afterBuffer) => {
    const before = PNG.sync.read(beforeBuffer), after = PNG.sync.read(afterBuffer);
    assert.equal(before.width, after.width); assert.equal(before.height, after.height);
    let changed = 0;
    for (let i = 0; i < before.data.length; i += 4) {
      if (Math.abs(before.data[i] - after.data[i]) + Math.abs(before.data[i + 1] - after.data[i + 1]) + Math.abs(before.data[i + 2] - after.data[i + 2]) > 36) changed++;
    }
    return changed;
  };
  const hideTooltip = '.pc-hover-card { visibility: hidden !important; }';
  const waitState = async (page, state) => page.waitForFunction(expected => document.querySelector('.studio-visualizer .pc-scene')?.dataset.rotationState === expected, state);
  const waitDelta = async (page, attribute, before, minimum) => page.waitForFunction(({ attribute, before, minimum }) => {
    const value = document.querySelector('.studio-visualizer .pc-scene')?.getAttribute(attribute);
    return value !== null && value !== '' && Math.abs(Number(value) - before) > minimum;
  }, { attribute, before, minimum }, { timeout: 15000 });
  const ensureMotion = async (page, enabled) => {
    if ((await toggle(page).getAttribute('aria-pressed') === 'true') !== enabled) await toggle(page).click();
    await page.mouse.move(0, 0);
    await page.waitForFunction(expected => document.querySelector('.studio-visualizer .pc-scene')?.dataset.motionEnabled === String(expected), enabled);
  };
  const load = async page => {
    watch(page);
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await scene(page).locator('canvas').waitFor();
    await page.waitForFunction(() => document.querySelector('.studio-visualizer .pc-scene')?.dataset.fanAngle !== undefined);
  };
  const choose = async (page, category, name) => {
    await page.getByRole('button', { name: `Choisir ${category}`, exact: true }).click();
    const card = page.getByRole('dialog').locator('.catalog-product').filter({ has: page.getByRole('heading', { name, exact: true }) });
    await card.getByRole('button', { name: 'Choisir', exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
    await scene(page).scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
  };
  const findHardware = async page => {
    await scene(page).scrollIntoViewIfNeeded();
    const bounds = await scene(page).locator('canvas').boundingBox();
    let fallback;
    for (const y of [.48, .58, .68, .38, .78]) for (const x of [.54, .63, .45, .36, .72]) {
      const point = { x: bounds.x + bounds.width * x, y: bounds.y + bounds.height * y };
      await page.mouse.move(point.x, point.y);
      await page.waitForTimeout(110);
      const category = await scene(page).getAttribute('data-hover-category');
      if (category && category !== 'case') return { ...point, category };
      if (category) fallback = { ...point, category };
    }
    assert.ok(fallback, 'Pointer must identify a real part of the model');
    await page.mouse.move(fallback.x, fallback.y);
    return fallback;
  };
  try {
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    const page = await desktop.newPage();
    await load(page);
    await page.mouse.move(0, 0);
    await test('Default perspective rotates the camera, fan rotors and real RGB texture phases', async () => {
      await ensureMotion(page, true);
      await waitState(page, 'rotating');
      const before = await Promise.all(['data-camera-angle', 'data-fan-angle', 'data-rgb-phase'].map(attribute => read(page, attribute)));
      await waitDelta(page, 'data-camera-angle', before[0], .003);
      await waitDelta(page, 'data-fan-angle', before[1], .1);
      await waitDelta(page, 'data-rgb-phase', before[2], .001);
      const after = await Promise.all(['data-camera-angle', 'data-fan-angle', 'data-rgb-phase'].map(attribute => read(page, attribute)));
      await fs.writeFile(path.join(output, 'default-motion-deltas.json'), JSON.stringify({ before, after }, null, 2));
      assert.ok(Math.abs(after[0] - before[0]) > .003, 'Camera angle must advance without dragging');
      assert.ok(Math.abs(after[1] - before[1]) > .1, 'Fan rotor geometry must turn');
      assert.ok(Math.abs(after[2] - before[2]) > .001, 'The actual RGB gradient texture must advance');
    });
    await test('Pause stops camera, fan geometry and RGB; pointer highlighting changes rendered pixels', async () => {
      await ensureMotion(page, false);
      await page.waitForTimeout(1100);
      const before = await Promise.all(['data-camera-angle', 'data-fan-angle', 'data-rgb-phase'].map(attribute => read(page, attribute)));
      await page.waitForTimeout(700);
      const after = await Promise.all(['data-camera-angle', 'data-fan-angle', 'data-rgb-phase'].map(attribute => read(page, attribute)));
      await fs.writeFile(path.join(output, 'paused-motion-deltas.json'), JSON.stringify({ before, after }, null, 2));
      for (let i = 0; i < before.length; i++) assert.ok(Math.abs(after[i] - before[i]) < .001, `Paused motion ${i} must stay frozen (${before[i]} → ${after[i]})`);
      const hit = await findHardware(page);
      await page.mouse.move(0, 0);
      await page.waitForFunction(() => Number(document.querySelector('.studio-visualizer .pc-scene')?.dataset.hoverStrength) < .05);
      const canvas = scene(page).locator('canvas');
      const normalBuffer = await canvas.screenshot({ path: path.join(output, 'scene-normal.png'), style: hideTooltip });
      await page.mouse.move(hit.x, hit.y);
      await page.waitForFunction(() => Number(document.querySelector('.studio-visualizer .pc-scene')?.dataset.hoverStrength) > .9);
      const highlightedBuffer = await canvas.screenshot({ path: path.join(output, 'scene-highlight.png'), style: hideTooltip });
      const changed = changedPixels(normalBuffer, highlightedBuffer);
      assert.ok(changed > 150, `Hover must change real model pixels, not just tooltip text (changed ${changed})`);
      await page.mouse.move(0, 0);
      await page.waitForFunction(() => Number(document.querySelector('.studio-visualizer .pc-scene')?.dataset.hoverStrength) < .05);
      const restoredBuffer = await canvas.screenshot({ path: path.join(output, 'scene-restored.png'), style: hideTooltip });
      const remaining = changedPixels(normalBuffer, restoredBuffer);
      assert.ok(remaining < changed * .2 + 150, `Part materials must recover their original appearance after hover (${remaining} pixels remain changed)`);
      await fs.writeFile(path.join(output, 'hover-pixels.json'), JSON.stringify({ category: hit.category, changedPixels: changed, remainingPixelsAfterLeave: remaining }, null, 2));
      const bounds = await canvas.boundingBox();
      await page.mouse.move(bounds.x + 20, bounds.y + 20);
      const cameraBeforeDrag = await read(page, 'data-camera-angle');
      await page.mouse.down();
      await page.mouse.move(bounds.x + 55, bounds.y + 20, { steps: 6 });
      await page.mouse.up();
      await page.mouse.move(0, 0);
      await waitDelta(page, 'data-camera-angle', cameraBeforeDrag, .005);
      const cameraAfterDrag = await read(page, 'data-camera-angle');
      await page.waitForTimeout(600);
      assert.ok(Math.abs(await read(page, 'data-camera-angle') - cameraAfterDrag) < .001, 'Manual rotation while paused must stay at the angle chosen by the user');
      await ensureMotion(page, true);
    });
    await test('Hover pauses orbit; dragging takes priority while the fans keep turning and orbit resumes', async () => {
      await ensureMotion(page, true);
      await waitState(page, 'rotating');
      const hit = await findHardware(page);
      await waitState(page, 'hover');
      await page.waitForTimeout(1000);
      const hoverAngle = await read(page, 'data-camera-angle');
      await page.waitForTimeout(600);
      assert.ok(Math.abs(await read(page, 'data-camera-angle') - hoverAngle) < .003, 'Orbit must hold still while identifying a component');
      await page.mouse.down();
      await waitState(page, 'dragging');
      const fan = await read(page, 'data-fan-angle'), camera = await read(page, 'data-camera-angle');
      await page.mouse.move(hit.x + 95, hit.y + 12, { steps: 10 });
      await page.waitForTimeout(1100);
      assert.ok(Math.abs(await read(page, 'data-camera-angle') - camera) > .02, 'Manual dragging must turn the camera');
      assert.ok(Math.abs(await read(page, 'data-fan-angle') - fan) > .1, 'Dragging must not stop fan rotors');
      await page.mouse.up();
      await page.mouse.move(0, 0);
      await waitState(page, 'waiting');
      await waitState(page, 'rotating');
      const resumed = await read(page, 'data-camera-angle');
      await page.waitForTimeout(1100);
      assert.ok(Math.abs(await read(page, 'data-camera-angle') - resumed) > .002, 'Automatic orbit must resume after the manipulation delay');
    });
    await test('RGB meshes disappear for a non-RGB build and return only when an RGB AIO is selected', async () => {
      await ensureMotion(page, true);
      await choose(page, 'Mémoire vive', 'Flare X5 64 Go DDR5');
      await page.waitForFunction(() => document.querySelector('.studio-visualizer .pc-scene')?.dataset.rgbPhase === '');
      assert.equal(await scene(page).getAttribute('data-rgb-phase'), '');
      await choose(page, 'Refroidissement', 'iCUE H100i ELITE CAPELLIX XT');
      await page.waitForFunction(() => !!document.querySelector('.studio-visualizer .pc-scene')?.dataset.rgbPhase);
      const phase = await read(page, 'data-rgb-phase');
      await waitDelta(page, 'data-rgb-phase', phase, .001);
      assert.ok(Math.abs(await read(page, 'data-rgb-phase') - phase) > .001);
      await ensureMotion(page, false);
      await page.getByRole('button', { name: 'Vue de profil', exact: true }).click();
      await page.waitForTimeout(500);
      await page.mouse.move(0, 0);
      await scene(page).locator('canvas').screenshot({ path: path.join(output, 'rgb-aio-side.png') });
      await choose(page, 'Boîtier', 'Pop Air RGB Black TG');
      await choose(page, 'Carte graphique', 'GeForce RTX 4080 SUPER Gaming OC');
      await choose(page, 'Mémoire vive', 'Vengeance RGB 32 Go DDR5');
      await page.getByRole('button', { name: 'Vue trois quarts', exact: true }).click();
      await page.waitForTimeout(500);
      await page.mouse.move(0, 0);
      await scene(page).locator('canvas').screenshot({ path: path.join(output, 'rgb-showcase.png') });
    });
    await desktop.close();
    await test('Reduced-motion preference keeps all automatic motion stopped', async () => {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      try {
        const page = await context.newPage(); await load(page);
        await waitState(page, 'paused'); await page.waitForTimeout(500);
        const before = await Promise.all(['data-camera-angle', 'data-fan-angle', 'data-rgb-phase'].map(attribute => read(page, attribute)));
        await page.waitForTimeout(900);
        const after = await Promise.all(['data-camera-angle', 'data-fan-angle', 'data-rgb-phase'].map(attribute => read(page, attribute)));
        assert.deepEqual(after, before);
        assert.equal(await scene(page).getAttribute('data-motion-enabled'), 'false');
        assert.equal(await toggle(page).isDisabled(), true);
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.waitForFunction(() => !document.querySelector('.studio-view-toolbar .animation-toggle').disabled);
        await ensureMotion(page, true);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await waitState(page, 'paused');
        assert.equal(await toggle(page).isDisabled(), true);
        assert.equal(await toggle(page).getAttribute('aria-label'), 'Animations désactivées : mouvement réduit');
      } finally { await context.close(); }
    });
    await test('Animation controls fit mobile 390px and 360px and pause actual rotors', async () => {
      for (const width of [390, 360]) {
        const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
        try {
          const page = await context.newPage(); await load(page); await scene(page).scrollIntoViewIfNeeded();
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
          const rect = await toggle(page).boundingBox(); assert.ok(rect && rect.x >= 0 && rect.x + rect.width <= width);
          await ensureMotion(page, false); await page.waitForTimeout(500);
          const fan = await read(page, 'data-fan-angle'); await page.waitForTimeout(600);
          assert.equal(await read(page, 'data-fan-angle'), fan);
          await page.screenshot({ path: path.join(output, `motion-mobile-${width}.png`) });
          await ensureMotion(page, true);
          await page.waitForTimeout(700);
          assert.notEqual(await read(page, 'data-fan-angle'), fan);
        } finally { await context.close(); }
      }
    });
    await test('No uncaught JavaScript errors in motion, RGB and pointer flows', async () => assert.deepEqual(errors, []));
  } finally {
    await browser.close();
    await fs.writeFile(path.join(output, 'motion-results.json'), JSON.stringify({ baseUrl, results, errors }, null, 2));
    if (results.some(result => result.result === 'FAIL')) process.exitCode = 1;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
