// Optional integration checks for the richer catalog and simplified navigation.
// Requires Playwright, Chromium, and a running Vite or static production server.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const baseUrl = process.env.FORGE_TEST_URL || 'http://127.0.0.1:5173';
const output = process.env.FORGE_TEST_OUTPUT || '/tmp/forge-catalog-validation';

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const results = [];
  const errors = [];
  let activePage;
  const test = async (name, run) => {
    if (process.env.FORGE_CATALOG_TEST_MATCH && !new RegExp(process.env.FORGE_CATALOG_TEST_MATCH).test(name)) return;
    try {
      await run();
      results.push({ name, result: 'PASS' });
      console.log('PASS', name);
    } catch (error) {
      results.push({ name, result: 'FAIL', error: error.message });
      console.error('FAIL', name, error.message);
      if (activePage && !activePage.isClosed()) {
        await activePage.screenshot({ timeout: 60000, path: path.join(output, `catalog-failure-${results.length}.png`), fullPage: true }).catch(() => {});
        await activePage.keyboard.press('Escape').catch(() => {});
        const componentsTab = activePage.getByRole('button', { name: /^Les composants/ });
        if (await componentsTab.isVisible().catch(() => false)) await componentsTab.click().catch(() => {});
      }
    }
  };
  const watch = page => {
    activePage = page;
    page.setDefaultTimeout(20000);
    page.on('pageerror', error => errors.push(error.message));
  };
  const open = async (page, label) => {
    await page.getByRole('button', { name: `Choisir ${label}`, exact: true }).click();
    await page.getByRole('dialog').locator('.catalog-product').first().waitFor();
    return page.getByRole('dialog');
  };
  const product = (page, name) => page.getByRole('dialog').locator('.catalog-product').filter({ has: page.getByRole('heading', { name, exact: true }) });
  const assertFits = async (page, width) => {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, 'Page must not overflow horizontally');
    const bounds = await page.getByRole('dialog').boundingBox();
    assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width + 1, 'Catalog dialog must stay within the viewport');
  };
  try {
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    const page = await desktop.newPage();
    watch(page);
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Votre PC. Vos règles.' }).waitFor();

    // Tests below exercise public controls instead of reading React state.
    await test('Section shortcuts open analysis and return to components', async () => {
      const navigation = page.getByRole('navigation', { name: 'Parcourir la configuration', exact: true });
      await navigation.getByRole('button', { name: /^Analyse/ }).click();
      await page.locator('.analysis-details').waitFor();
      await page.waitForFunction(() => document.querySelector('#components').getBoundingClientRect().top < innerHeight * 0.8);
      await navigation.getByRole('button', { name: /^Composants/ }).click();
      await page.locator('.parts-grid').waitFor();
      assert.equal(await page.locator('.part-card').count(), 8);
      await navigation.getByRole('button', { name: 'Aperçu 3D', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('#studio').getBoundingClientRect().top < 180);
    });

    await test('Selected component opens its own technical sheet without changing the build', async () => {
      const before = await page.locator('.part-card').first().textContent();
      await page.locator('.part-card').first().getByRole('button', { name: 'Détails de Ryzen 7 7800X3D', exact: true }).click();
      const sheet = page.getByRole('dialog');
      await sheet.getByRole('heading', { name: 'Ryzen 7 7800X3D', exact: true }).waitFor();
      assert.match(await sheet.textContent(), /Socket/);
      assert.match(await sheet.textContent(), /AM5/);
      assert.match(await sheet.textContent(), /DDR5/);
      assert.match(await sheet.textContent(), /Cœurs et threads/);
      await page.screenshot({ timeout: 60000, path: path.join(output, 'desktop-cpu-details.png'), fullPage: true });
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.part-card').first().textContent(), before);
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Détails de Ryzen 7 7800X3D');
    });

    await test('Technical sheet keeps search and brand filters when returning to results', async () => {
      const modal = await open(page, 'Processeur');
      await modal.getByRole('combobox', { name: 'Filtrer par marque', exact: true }).selectOption('AMD');
      await modal.getByPlaceholder('Rechercher un composant…').fill('Ryzen 5');
      const count = await modal.locator('.catalog-product').count();
      assert.ok(count >= 2);
      await product(page, 'Ryzen 5 7600').getByRole('button', { name: 'Détails de Ryzen 5 7600', exact: true }).click();
      await modal.locator('.cp-detail-specs').waitFor();
      assert.match(await modal.locator('.cp-detail-specs').textContent(), /AM5/);
      assert.match(await modal.locator('.cp-price-delta').textContent(), /160,00/);
      assert.match(await modal.locator('.cp-detail-compatibility').textContent(), /Équilibre CPU/);
      await modal.getByRole('button', { name: 'Retour aux composants', exact: true }).click();
      assert.equal(await modal.getByRole('combobox', { name: 'Filtrer par marque', exact: true }).inputValue(), 'AMD');
      assert.equal(await modal.getByPlaceholder('Rechercher un composant…').inputValue(), 'Ryzen 5');
      assert.equal(await modal.locator('.catalog-product').count(), count);
      await modal.getByRole('button', { name: 'Effacer la recherche', exact: true }).click();
      await page.keyboard.press('Escape');
    });

    await test('Three-way comparison shows actual differences and can choose a product', async () => {
      const modal = await open(page, 'Processeur');
      for (const name of ['Ryzen 5 7600', 'Ryzen 7 7700X', 'Ryzen 7 7800X3D']) {
        const toggle = product(page, name).getByRole('button', { name: `Comparer ${name}`, exact: true });
        await toggle.click();
        assert.equal(await toggle.getAttribute('aria-pressed'), 'true');
      }
      await modal.getByPlaceholder('Rechercher un composant…').fill('Core i5-14600KF');
      assert.equal(await product(page, 'Core i5-14600KF').getByRole('button', { name: 'Comparer Core i5-14600KF', exact: true }).isDisabled(), true);
      await modal.getByRole('button', { name: 'Comparer la sélection', exact: true }).click();
      const table = modal.getByRole('table');
      await table.waitFor();
      assert.equal(await table.locator('thead th').count(), 4);
      assert.match(await table.textContent(), /Ryzen 5 7600/);
      assert.match(await table.textContent(), /Ryzen 7 7700X/);
      const allRows = await table.locator('tbody tr').count();
      await modal.getByRole('checkbox', { name: 'Afficher les différences uniquement', exact: true }).check();
      const differentRows = await table.locator('tbody tr').count();
      assert.ok(differentRows > 1 && differentRows < allRows, 'Identical rows should disappear while true differences remain');
      assert.equal(await table.locator('tbody tr:not(.cp-comparison-compatibility):not(.cp-row-different)').count(), 0);
      await page.screenshot({ timeout: 60000, path: path.join(output, 'desktop-comparison.png'), fullPage: true });
      const firstProduct = table.locator('thead th').filter({ has: page.getByRole('heading', { name: 'Ryzen 5 7600', exact: true }) });
      await firstProduct.getByRole('button', { name: 'Choisir', exact: true }).click();
      await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
      assert.match(await page.locator('.part-card').first().textContent(), /Ryzen 5 7600/);
    });

    await test('Budget filters real prices and category changes reset category-specific state', async () => {
      const modal = await open(page, 'Processeur');
      const allCount = await modal.locator('.catalog-product').count();
      await modal.getByRole('combobox', { name: 'Budget maximum par composant', exact: true }).selectOption('200');
      await modal.getByRole('combobox', { name: 'Trier les composants', exact: true }).selectOption('price-up');
      const costs = (await modal.locator('.cp-card-price > strong').allTextContents()).map(text => Number(text.replace(/[^0-9,]/g, '').replace(',', '.')));
      assert.ok(costs.length > 1 && costs.length < allCount);
      assert.ok(costs.every(price => price <= 200));
      assert.deepEqual(costs, [...costs].sort((a, b) => a - b));
      await product(page, 'Ryzen 5 7600').getByRole('button', { name: 'Comparer Ryzen 5 7600', exact: true }).click();
      await modal.getByRole('navigation', { name: 'Catégories de composants', exact: true }).getByRole('button', { name: /^GPU/ }).click();
      await page.waitForFunction(() => document.querySelector('[aria-label="Budget maximum par composant"]')?.value === 'all');
      assert.equal(await modal.getByRole('combobox', { name: 'Budget maximum par composant', exact: true }).inputValue(), 'all');
      assert.equal(await modal.locator('.cp-compare-tray').count(), 0);
      assert.ok(await modal.locator('.catalog-product').count() >= 16);
      await page.keyboard.press('Escape');
    });

    await test('Watercooling details distinguish nominal size, actual radiator dimensions and pump', async () => {
      const modal = await open(page, 'Refroidissement');
      await modal.getByRole('button', { name: 'Watercooling', exact: true }).click();
      for (const tags of await modal.locator('.catalog-product .cp-spec-tags').allTextContents()) assert.match(tags, /Watercooling AIO/);
      await product(page, 'iCUE H100i ELITE CAPELLIX XT').getByRole('button', { name: 'Détails de iCUE H100i ELITE CAPELLIX XT', exact: true }).click();
      const specs = modal.locator('.cp-detail-specs');
      assert.match(await specs.textContent(), /Radiateur : format nominal240 mm/);
      assert.match(await specs.textContent(), /Radiateur : dimensions/);
      assert.match(await specs.textContent(), /hors ventilateurs/);
      assert.match(await specs.textContent(), /Hauteur du bloc pompe/);
      assert.match(await modal.locator('.cp-advice').textContent(), /tuyaux/);
      await page.screenshot({ timeout: 60000, path: path.join(output, 'desktop-watercooling-details.png'), fullPage: true });
      await page.keyboard.press('Escape');
    });

    await desktop.close();
    await test('Mobile navigation, detail sheets and comparison fit 390px and 360px', async () => {
      for (const width of [390, 360]) {
        const mobileContext = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
        try {
          const mobile = await mobileContext.newPage();
          watch(mobile);
          await mobile.goto(baseUrl, { waitUntil: 'domcontentloaded' });
          await mobile.getByRole('heading', { name: 'Votre PC. Vos règles.' }).waitFor();
          const navigation = mobile.getByRole('navigation', { name: 'Parcourir la configuration', exact: true });
          await navigation.getByRole('button', { name: /^Analyse/ }).click();
          await mobile.locator('.analysis-details').waitFor();
          await mobile.locator('.mobile-build-summary').getByRole('button', { name: 'Composants', exact: true }).click();
          await mobile.locator('.parts-grid').waitFor();
          const modal = await open(mobile, 'Processeur');
          await assertFits(mobile, width);
          await product(mobile, 'Ryzen 5 7600').getByRole('button', { name: 'Détails de Ryzen 5 7600', exact: true }).click();
          await modal.locator('.cp-detail-specs').waitFor();
          await assertFits(mobile, width);
          await mobile.screenshot({ timeout: 60000, path: path.join(output, `mobile-details-${width}.png`), fullPage: false });
          await modal.getByRole('button', { name: 'Retour aux composants', exact: true }).click();
          for (const name of ['Ryzen 5 7600', 'Ryzen 7 7700X']) {
            await product(mobile, name).getByRole('button', { name: `Comparer ${name}`, exact: true }).click();
          }
          await modal.getByRole('button', { name: 'Comparer la sélection', exact: true }).click();
          await modal.getByRole('table').waitFor();
          await assertFits(mobile, width);
          const region = modal.getByRole('region', { name: 'Tableau comparatif des composants', exact: true });
          assert.ok(await region.evaluate(node => node.scrollWidth > node.clientWidth), 'Comparison should scroll inside its own region on mobile');
          await region.evaluate(node => { node.scrollLeft = node.scrollWidth; });
          assert.ok(await region.evaluate(node => node.scrollLeft) > 0);
          await mobile.screenshot({ timeout: 60000, path: path.join(output, `mobile-comparison-${width}.png`), fullPage: false });
          await modal.getByRole('button', { name: 'Fermer le catalogue', exact: true }).click();
          assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth), width);
        } finally { await mobileContext.close(); }
      }
    });
    await test('No uncaught browser runtime errors in catalog flows', async () => assert.deepEqual(errors, []));
    await fs.writeFile(path.join(output, 'catalog-results.json'), JSON.stringify({ baseUrl, results, errors }, null, 2));
    if (results.some(result => result.result === 'FAIL')) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
