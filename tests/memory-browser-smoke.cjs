// Slot-by-slot RAM and large-catalog integration checks using public browser controls.
// Requires Playwright, Chromium and npm run dev (or FORGE_TEST_URL for a hosted build).
const { chromium } = require('playwright');
const { chooseOpenCatalogProduct, openCatalogProductDetail } = require('./catalog-test-helpers.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const baseUrl = process.env.FORGE_TEST_URL || 'http://127.0.0.1:5173';
const output = process.env.FORGE_TEST_OUTPUT || '/tmp/forge-memory-validation';

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true,
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const results = [], errors = [];
  let page;
  const watch = current => {
    page = current;
    page.setDefaultTimeout(20000);
    page.on('pageerror', error => errors.push(error.message));
  };
  const test = async (name, run) => {
    if (process.env.FORGE_MEMORY_TEST_MATCH && !new RegExp(process.env.FORGE_MEMORY_TEST_MATCH).test(name)) return;
    try { await run(); results.push({ name, result: 'PASS' }); console.log('PASS', name); }
    catch (error) {
      results.push({ name, result: 'FAIL', error: error.message }); console.error('FAIL', name, error.message);
      await page.screenshot({ timeout: 60000, path: path.join(output, `memory-failure-${results.length}.png`), fullPage: true }).catch(() => {});
      await page.keyboard.press('Escape').catch(() => {});
    }
  };
  const memory = () => page.locator('.memory-configurator');
  const scene = () => page.locator('.studio-visualizer .pc-scene');
  const numberOfModules = async count => {
    await memory().getByRole('button', { name: `Installer ${count} barrette${count > 1 ? 's' : ''}`, exact: true }).click();
    await page.waitForFunction(count => document.querySelector('.memory-configurator')?.dataset.installedCount === String(count), count);
  };
  const assertScene = async (count, slots, capacity) => {
    assert.equal(await scene().getAttribute('data-ram-count'), String(count));
    assert.equal(await scene().getAttribute('data-ram-slots'), slots);
    assert.equal(await scene().getAttribute('data-ram-capacity'), String(capacity));
  };
  const choose = async (category, name) => {
    await page.getByRole('button', { name: `Choisir ${category}`, exact: true }).click();
    await chooseOpenCatalogProduct(page, name);
  };
  const installPickerModule = async name => {
    const picker = memory().locator('.mc-picker');
    const target = picker.getByRole('button', { name, exact: true });
    // Newest-first and thousands of models can move an older exact match to
    // a later page even when every query word matches its technical sheet.
    while (await target.count() === 0) {
      const next = picker.getByRole('button', { name: 'Suivant', exact: true });
      assert.ok(await next.isEnabled(), `The paginated picker must contain ${name}`);
      const before = await picker.locator('.mc-pagination').textContent();
      await next.click();
      await page.waitForFunction(before => document.querySelector('.mc-picker .mc-pagination')?.textContent !== before, before);
    }
    await target.click();
  };
  const captureMemory = async filename => {
    await memory().scrollIntoViewIfNeeded();
    await memory().screenshot({ timeout: 60000, path: path.join(output, filename) });
  };
  const assertNoOverflow = async width => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, 'Page must fit its viewport');
  try {
    if (process.env.FORGE_MEMORY_MOBILE_ONLY !== '1') {
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    watch(await desktop.newPage());
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await memory().waitFor();
    await test('Default kit occupies A2/B2; catalog includes at least 5,000 distinct models', async () => {
      assert.ok(Number((await page.locator('.nav-count').textContent()).replace(/\D/g, '')) >= 5000);
      assert.equal(await memory().getAttribute('data-memory-slots'), '4');
      await assertScene(2, 'A2,B2', 32);
      await scene().locator('canvas').waitFor();
      assert.equal(await page.locator('.pc-fallback').count(), 0);
    });
    await test('One, two, three and four modules recalculate slots, capacity, whole kits and spares', async () => {
      for (const [count, labels, kits, price, spare] of [[1,'A2',1,'109,90',true],[2,'A2,B2',1,'109,90',false],[3,'A1,A2,B2',2,'219,80',true],[4,'A1,A2,B1,B2',2,'219,80',false]]) {
        await numberOfModules(count);
        await assertScene(count, labels, count * 16);
        assert.equal(await memory().locator('.mc-filled').count(), count);
        const purchase = await memory().locator('.mc-purchase').textContent();
        assert.match(purchase, new RegExp(`${kits}\\s*kit`));
        assert.match(purchase, new RegExp(price));
        assert.equal(/1 restante/.test(purchase), spare);
        assert.match(await memory().locator('.mc-installed-summary').textContent(), new RegExp(`${count * 16} Go`));
        if (count === 3 || count === 4) await captureMemory(`desktop-${count}-modules.png`);
      }
    });
    await test('Slot configuration persists through a real reload', async () => {
      await numberOfModules(3);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await memory().waitFor();
      assert.equal(await memory().getAttribute('data-installed-count'), '3');
      await assertScene(3, 'A1,A2,B2', 48);
      assert.match(await memory().locator('.mc-purchase').textContent(), /1 restante/);
    });
    await test('Switching to a two-slot board preserves overflow, then supports two correctly placed sticks', async () => {
      await numberOfModules(4);
      await choose('Carte mère', 'A620I Lightning WiFi');
      assert.equal(await memory().getAttribute('data-memory-slots'), '2');
      assert.equal(await memory().getAttribute('data-installed-count'), '4');
      assert.equal(await memory().locator('.mc-slot-overflow').count(), 2);
      assert.match(await memory().locator('.mc-overflow-note').textContent(), /2 barrettes/);
      await assertScene(2, 'A1,B1', 32);
      assert.equal(await memory().getByRole('button', { name: 'Installer 3 barrettes', exact: true }).count(), 0);
      await captureMemory('desktop-two-slot-overflow.png');
      await numberOfModules(2);
      assert.equal(await memory().locator('.mc-slot-overflow').count(), 0);
      await assertScene(2, 'A1,B1', 32);
      await memory().getByRole('button', { name: 'Placement conseillé', exact: true }).click();
      await assertScene(2, 'A1,B1', 32);
    });
    await test('A four-to-two-slot change places two sticks safely and preserves recommended placement', async () => {
      await choose('Carte mère', 'MAG B650 TOMAHAWK WIFI');
      await numberOfModules(2);
      await choose('Carte mère', 'A620I Lightning WiFi');
      assert.equal(await memory().getAttribute('data-installed-count'), '2');
      assert.equal(await memory().locator('.mc-slot-overflow').count(), 0);
      await assertScene(2, 'A1,B1', 32);
      await memory().getByRole('button', { name: 'Placement conseillé', exact: true }).click();
      await assertScene(2, 'A1,B1', 32);
      assert.equal(await memory().locator('.mc-slot-overflow').count(), 0);
    });
    await test('Per-slot picker paginates and restores focus when dismissed', async () => {
      await choose('Carte mère', 'MAG B650 TOMAHAWK WIFI');
      await numberOfModules(2);
      await memory().locator('[data-memory-slot="0"]').click();
      const picker = memory().locator('.mc-picker');
      assert.equal(await picker.locator('.mc-picker-result').count(), 20);
      const names = await picker.locator('.mc-picker-result strong').allTextContents();
      await picker.getByRole('button', { name: 'Suivant', exact: true }).click();
      assert.match(await picker.locator('.mc-pagination').textContent(), /Page 2/);
      assert.notDeepEqual(await picker.locator('.mc-picker-result strong').allTextContents(), names);
      await page.keyboard.press('Escape');
      assert.equal(await memory().locator('.mc-picker').count(), 0);
      await page.waitForFunction(() => document.activeElement?.getAttribute('data-memory-slot') === '0');
    });
    await test('Mixed DDR4/DDR5 slots preserve every model and report the incompatibility', async () => {
      await memory().locator('[data-memory-slot="0"]').click();
      let picker = memory().locator('.mc-picker');
      await picker.getByRole('checkbox').uncheck();
      await picker.getByRole('searchbox').fill('Vengeance LPX 32 Go DDR4');
      await installPickerModule('Installer une barrette Corsair Vengeance LPX 32 Go DDR4 en A1');
      await assertScene(3, 'A1,A2,B2', 48);
      assert.equal(await scene().getAttribute('data-ram-models'), 'ram-ddr4-32,ram-ddr5-32,ram-ddr5-32');
      assert.match(await memory().locator('.mc-warning-list').textContent(), /Générations de mémoire mélangées/);
      assert.equal(await memory().getByRole('button', { name: 'Installer 4 barrettes', exact: true }).isDisabled(), true);
      assert.equal(await memory().locator('.mc-purchase').count(), 2);
      assert.match(await memory().locator('.mc-installed-summary').textContent(), /174,80/);
      await captureMemory('desktop-mixed-ddr.png');
      await page.reload({ waitUntil: 'domcontentloaded' });
      await memory().waitFor();
      assert.equal(await scene().getAttribute('data-ram-models'), 'ram-ddr4-32,ram-ddr5-32,ram-ddr5-32');
      assert.match(await memory().locator('.mc-warning-list').textContent(), /Générations de mémoire mélangées/);
      await memory().getByRole('button', { name: 'Retirer la barrette A1', exact: true }).click();
      await assertScene(2, 'A2,B2', 32);
    });
    await test('Named save, reload and text export retain three modules, 48 Go and one spare', async () => {
      await numberOfModules(3);
      await page.getByRole('button', { name: /^Enregistrer↗?$/ }).click();
      const modal = page.getByRole('dialog');
      await modal.getByRole('textbox', { name: 'Nom de la configuration' }).fill('Mémoire trois barrettes');
      await modal.getByRole('button', { name: 'Enregistrer ma configuration', exact: true }).click();
      await page.reload({ waitUntil: 'domcontentloaded' });
      await memory().waitFor();
      await assertScene(3, 'A1,A2,B2', 48);
      assert.match(await page.locator('.build-title').textContent(), /Mémoire trois barrettes/);
      const downloaded = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Exporter ma configuration' }).click();
      const download = await downloaded;
      const exported = path.join(output, download.suggestedFilename());
      await download.saveAs(exported);
      const content = await fs.readFile(exported, 'utf8');
      assert.match(content, /Mémoire installée : 3 barrette\(s\) · 48 Go/);
      assert.match(content, /Achats RAM : 2 kit\(s\).*1 restante\(s\)/);
      for (const slot of ['A1', 'A2', 'B2']) assert.match(content, new RegExp(`${slot} : Corsair.*16 Go par barrette`));
    });
    await test('Real canvas hover identifies module A2, its source model and 16 Go capacity', async () => {
      await numberOfModules(2);
      await page.getByRole('button', { name: 'Vue de profil', exact: true }).click();
      const exploded = page.getByRole('button', { name: 'Vue éclatée', exact: true });
      if (await exploded.getAttribute('aria-pressed') !== 'true') await exploded.click();
      await scene().scrollIntoViewIfNeeded();
      await page.mouse.move(2, 2);
      await page.waitForTimeout(900);
      const bounds = await scene().locator('canvas').boundingBox();
      assert.ok(bounds && bounds.width > 300);
      await scene().screenshot({ timeout: 60000, path: path.join(output, 'desktop-ram-side-exploded.png') });
      let hit;
      const seen = new Set();
      const xs = Array.from({ length: 71 }, (_, index) => 0.28 + index * 0.006);
      for (const y of [0.35, 0.4, 0.3, 0.45, 0.25, 0.5]) {
        for (const x of xs) {
          const point = { x: bounds.x + bounds.width * x, y: bounds.y + bounds.height * y };
          await page.mouse.move(point.x, point.y);
          await page.waitForTimeout(25);
          const state = await scene().evaluate(element => ({ category: element.dataset.hoverCategory, slot: element.dataset.hoverSlot }));
          if (state.category) seen.add(`${state.category}:${state.slot}`);
          if (state.category === 'ram' && state.slot === 'A2') { hit = point; break; }
        }
        if (hit) break;
      }
      assert.ok(hit, `Actual canvas raycast must identify A2. Seen: ${[...seen].join(', ')}`);
      const tooltip = scene().locator('.pc-hover-card');
      assert.match(await tooltip.textContent(), /A2/);
      assert.match(await tooltip.textContent(), /Vengeance RGB 32 Go DDR5/);
      assert.match(await tooltip.textContent(), /16 Go par barrette/);
      await page.waitForFunction(() => Number(document.querySelector('.studio-visualizer .pc-scene')?.dataset.hoverStrength) > 0.5);
      await scene().screenshot({ timeout: 60000, path: path.join(output, 'desktop-ram-a2-hover.png') });
      await fs.writeFile(path.join(output, 'ram-a2-hover.json'), JSON.stringify({ ...hit, tooltip: await tooltip.textContent() }, null, 2));
      await page.mouse.click(hit.x, hit.y);
      assert.equal(await page.locator('.scene-part-shortcuts').getByRole('button', { name: 'RAM', exact: true }).getAttribute('aria-pressed'), 'true');
      await page.mouse.move(2, 2);
      await exploded.click();
    });
    await test('Large RAM catalog loads incrementally, combines filters, and excludes unknown prices from budgets', async () => {
      await page.getByRole('button', { name: 'Choisir Mémoire vive', exact: true }).click();
      const modal = page.getByRole('dialog');
      const total = parseInt(await modal.locator('.cp-results-summary [role="status"]').textContent(), 10);
      assert.ok(total >= 300);
      assert.equal(await modal.locator('.catalog-product').count(), 36);
      await modal.getByRole('button', { name: 'Afficher 36 composants de plus', exact: true }).click();
      assert.equal(await modal.locator('.catalog-product').count(), 72);
      await modal.getByRole('combobox', { name: 'Filtrer par génération mémoire', exact: true }).selectOption('DDR5');
      await modal.getByRole('combobox', { name: 'Filtrer par capacité', exact: true }).selectOption('32');
      await modal.getByRole('combobox', { name: 'Filtrer par nombre de barrettes', exact: true }).selectOption('2');
      await modal.getByRole('combobox', { name: 'Filtrer par débit mémoire', exact: true }).selectOption('6000');
      const filteredTotal = parseInt(await modal.locator('.cp-results-summary [role="status"]').textContent(), 10);
      assert.ok(filteredTotal > 20 && filteredTotal < total);
      assert.equal(await modal.locator('.catalog-product').count(), Math.min(filteredTotal, 36));
      for (const text of await modal.locator('.cp-spec-tags').allTextContents()) { assert.match(text, /DDR5/); assert.match(text, /32 Go|2 × 16 Go/); }
      assert.ok(await modal.locator('.cp-price-unknown').count() > 0);
      await modal.getByRole('combobox', { name: 'Budget maximum par composant', exact: true }).selectOption('200');
      assert.equal(await modal.locator('.cp-price-unknown').count(), 0);
      assert.ok(await modal.locator('.catalog-product').count() > 0);
      await modal.getByRole('combobox', { name: 'Budget maximum par composant', exact: true }).selectOption('all');
      await openCatalogProductDetail(page, 'Vengeance RGB 32 Go (2 × 16 Go) DDR5-6000 CL36 · Noir');
      assert.match(await modal.locator('.cp-detail-price').textContent(), /Prix non renseigné/);
      await modal.locator('.cp-detail-actions').getByRole('button', { name: 'Choisir', exact: true }).click();
      await modal.waitFor({ state: 'hidden' });
      assert.match(await memory().locator('.mc-installed-summary').textContent(), /Prix à renseigner/);
      assert.match(await memory().locator('.mc-purchase').textContent(), /Prix non renseigné/);
      assert.match(await page.locator('.total-card').textContent(), /Budget partiel|prix à renseigner/i);
      await assertScene(2, 'A2,B2', 32);
      await captureMemory('desktop-imported-memory.png');
    });
    await desktop.close();
    }
    await test('At 360px, memory quantities, slot picker and catalog fit the viewport', async () => {
      const mobile = await browser.newContext({ viewport: { width: 360, height: 844 }, isMobile: true, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      try {
        watch(await mobile.newPage());
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await memory().waitFor();
        await numberOfModules(3);
        await assertScene(3, 'A1,A2,B2', 48);
        await assertNoOverflow(360);
        await memory().scrollIntoViewIfNeeded();
        await page.screenshot({ timeout: 60000, path: path.join(output, 'mobile-memory-360.png'), fullPage: true });
        await memory().locator('[data-memory-slot="2"]').click();
        let picker = memory().locator('.mc-picker');
        await picker.scrollIntoViewIfNeeded();
        await assertNoOverflow(360);
        await picker.getByRole('searchbox').fill('Flare X5 64 Go DDR5');
        await installPickerModule('Installer une barrette G.Skill Flare X5 64 Go DDR5 en B1');
        assert.equal(await memory().getAttribute('data-installed-count'), '4');
        assert.equal(await scene().getAttribute('data-ram-capacity'), '80');
        await assertNoOverflow(360);
        await memory().locator('[data-memory-slot="0"]').click();
        picker = memory().locator('.mc-picker');
        await picker.scrollIntoViewIfNeeded();
        await page.screenshot({ timeout: 60000, path: path.join(output, 'mobile-slot-picker-360.png') });
        await page.keyboard.press('Escape');
        await page.getByRole('button', { name: 'Choisir Mémoire vive', exact: true }).click();
        const modal = page.getByRole('dialog');
        await modal.locator('.catalog-product').first().waitFor();
        await assertNoOverflow(360);
        const bounds = await modal.boundingBox();
        assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= 361);
        await modal.getByRole('combobox', { name: 'Filtrer par nombre de barrettes', exact: true }).selectOption('1');
        assert.ok(await modal.locator('.catalog-product').count() > 0);
        await assertNoOverflow(360);
        await modal.locator('.catalog-product').first().scrollIntoViewIfNeeded();
        assert.equal(await modal.locator('.cp-card-info > p').first().evaluate(element => getComputedStyle(element).webkitLineClamp), '3');
        await page.screenshot({ timeout: 60000, path: path.join(output, 'mobile-memory-catalog-360.png') });
      } finally { await mobile.close(); }
    });
    await test('No uncaught browser errors in memory and catalog flows', async () => assert.deepEqual(errors, []));
    await fs.writeFile(path.join(output, 'memory-results.json'), JSON.stringify({ baseUrl, results, errors }, null, 2));
    if (results.some(result => result.result === 'FAIL')) process.exitCode = 1;
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
