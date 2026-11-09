// Optional browser smoke test: NODE_PATH must resolve Playwright, Chromium must be installed.
// Run: node tests/browser-smoke.cjs (expects npm run dev on http://127.0.0.1:5173).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const baseUrl = process.env.FORGE_TEST_URL || 'http://127.0.0.1:5173';

(async () => {
  const directory = process.env.FORGE_TEST_OUTPUT || '/tmp/forge-validation';
  await fs.mkdir(directory, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const results = [];
  const test = async (name, run) => {
    try { await run(); results.push({ name, result: 'PASS' }); console.log('PASS', name); }
    catch (error) { results.push({ name, result: 'FAIL', error: error.message }); console.error('FAIL', name, error.message); if (!page.isClosed()) { await page.screenshot({ path: path.join(directory, `failure-${results.length}.png`), fullPage: true }).catch(()=>{}); await page.keyboard.press('Escape').catch(()=>{}); } }
  };
  const dialog = () => page.getByRole('dialog');
  const choose = async (category, product) => {
    await page.getByRole('button', { name: `Choisir ${category}`, exact: true }).click();
    const card = dialog().locator('.catalog-product').filter({ has: page.getByRole('heading', { name: product, exact: true }) });
    await card.getByRole('button', { name: 'Choisir', exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('[role=dialog]'));
  };
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Votre PC. Vos règles.' }).waitFor();
  if (process.env.FORGE_MOBILE_ONLY !== '1') {
  await test('Default build has eight components, compatible status and live 3D canvas', async () => {
    assert.equal(await page.locator('.part-card').count(), 8);
    assert.equal(await page.locator('.compatibility-banner strong').textContent(), 'Tout est compatible');
    await page.locator('canvas').waitFor();
    assert.ok(Number((await page.locator('.gauge-number').textContent()).split('/')[0]) >= 70);
  });
  await test('Estimated prices remain explicit and merchant searches target the exact model safely', async () => {
    const total = page.locator('.total-card');
    assert.match(await total.locator('.total-price').textContent(), /estimés/);
    assert.doesNotMatch(await total.locator('.total-price').textContent(), /TTC/);
    assert.match(await total.locator('p').textContent(), /Prix indicatifs hors livraison, non vérifiés auprès des marchands/);
    const totalBefore = await total.locator('.total-price').textContent();
    await page.getByRole('button', { name: 'Détails de Ryzen 7 7800X3D', exact: true }).click();
    const offers = dialog().locator('.cp-offers');
    await offers.waitFor();
    assert.match(await offers.textContent(), /Prix marchand non vérifié/);
    assert.match(await offers.textContent(), /ne sont pas actualisés depuis les marchands/);
    for (const [label, host] of [['Rechercher sur Idealo', 'www.idealo.fr'], ['Rechercher sur Google Shopping', 'www.google.com']]) {
      const link = offers.getByRole('link', { name: label, exact: true });
      const destination = new URL(await link.getAttribute('href'));
      assert.equal(destination.protocol, 'https:');
      assert.equal(destination.hostname, host);
      assert.equal(destination.searchParams.get('q'), 'AMD Ryzen 7 7800X3D');
      assert.equal(await link.getAttribute('target'), '_blank');
      const relation = (await link.getAttribute('rel')).split(/\s+/);
      assert.ok(relation.includes('noopener') && relation.includes('noreferrer'));
      if (host === 'www.google.com') {
        assert.equal(destination.searchParams.get('tbm'), 'shop');
        assert.equal(destination.searchParams.get('gl'), 'fr');
      }
    }
    await dialog().locator('.cp-detail-actions').getByRole('button', { name: 'Comparer', exact: true }).focus();
    await page.keyboard.press('Tab');
    assert.equal(await offers.getByRole('link', { name: 'Rechercher sur Idealo', exact: true }).evaluate(node => node === document.activeElement), true);
    await page.keyboard.press('Tab');
    assert.equal(await offers.getByRole('link', { name: 'Rechercher sur Google Shopping', exact: true }).evaluate(node => node === document.activeElement), true);
    await page.keyboard.press('Tab');
    assert.equal(await dialog().getByRole('button', { name: 'Fermer le catalogue', exact: true }).evaluate(node => node === document.activeElement), true);
    // Check destinations without visiting a merchant or treating search links as verified offers.
    await page.screenshot({ path: path.join(directory, 'unverified-price-details.png'), animations: 'disabled' });
    await page.keyboard.press('Escape');
    assert.equal(await total.locator('.total-price').textContent(), totalBefore);
  });
  await test('Choosing Intel CPU reports socket incompatibility', async () => {
    await choose('Processeur', 'Core i5-14600KF');
    assert.match(await page.locator('.compatibility-banner strong').textContent(), /incompatibilité/);
    await page.getByRole('button', { name: 'Voir l’analyse' }).click();
    assert.match(await page.locator('.analysis-details').textContent(), /Socket|socket/);
    await page.getByRole('button', { name: /Les composants/ }).click();
  });
  await test('Expanded motherboard filter keeps compatible Intel DDR5 boards and DDR4 correction still works', async () => {
    await page.getByRole('button', { name: 'Choisir Carte mère', exact: true }).click();
    const motherboardCount = await dialog().locator('.catalog-product').count();
    assert.ok(motherboardCount >= 12, 'Expanded motherboard catalog must contain at least 12 options');
    assert.equal(parseInt(await dialog().locator('.cp-results-summary [role="status"]').textContent(), 10), motherboardCount);
    await dialog().locator('.toggle-label').click();
    assert.equal(await dialog().getByRole('checkbox').isChecked(), true);
    await dialog().locator('.catalog-product').first().waitFor();
    const compatibleCount = await dialog().locator('.catalog-product').count();
    assert.ok(compatibleCount > 0 && compatibleCount < motherboardCount, 'Intel/DDR5 must have fitting boards and exclude incompatible options');
    assert.equal(await dialog().locator('.cp-card-status.cp-status-error').count(), 0);
    assert.equal(parseInt(await dialog().locator('.cp-results-summary [role="status"]').textContent(), 10), compatibleCount);
    await dialog().locator('.toggle-label').click();
    assert.equal(await dialog().getByRole('checkbox').isChecked(), false);
    await dialog().locator('.catalog-product').filter({ has: page.getByRole('heading', { name: 'PRO B760M-A WIFI DDR4', exact: true }) }).getByRole('button', { name: 'Choisir', exact: true }).click();
    assert.match(await page.locator('.compatibility-banner strong').textContent(), /incompatibilité/);
    await choose('Mémoire vive', 'Vengeance LPX 32 Go DDR4');
    assert.doesNotMatch(await page.locator('.compatibility-banner strong').textContent(), /incompatibilité/);
  });
  await test('Usage and resolution selections update analysis', async () => {
    const previous = await page.locator('.balance-description').textContent();
    await page.getByRole('combobox', { name: 'Utilisation' }).selectOption('creation');
    await page.getByRole('button', { name: '4K', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: '4K', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.match(await page.locator('.estimated-note').textContent(), /création en 4K/);
    assert.notEqual(await page.locator('.balance-description').textContent(), previous);
  });
  await test('Named save persists selection, resolution and usage across reload', async () => {
    await page.getByRole('button', { name: /^Enregistrer↗?$/ }).click();
    await dialog().getByRole('textbox', { name: 'Nom de la configuration' }).fill('');
    await dialog().getByRole('textbox', { name: 'Nom de la configuration' }).pressSequentially('Test atelier Intel', { delay: 30 });
    assert.equal(await dialog().getByRole('textbox', { name: 'Nom de la configuration' }).inputValue(), 'Test atelier Intel');
    await dialog().getByRole('button', { name: 'Enregistrer ma configuration', exact: true }).click();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Votre PC. Vos règles.' }).waitFor();
    assert.match(await page.locator('.build-title').textContent(), /Test atelier Intel/);
    assert.match(await page.locator('.part-card').first().textContent(), /Core i5-14600KF/);
    assert.equal(await page.getByRole('combobox', { name: 'Utilisation' }).inputValue(), 'creation');
    assert.equal(await page.getByRole('button', { name: '4K', exact: true }).getAttribute('aria-pressed'), 'true');
  });
  await test('Export downloads a populated build summary', async () => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Exporter ma configuration' }).click();
    const download = await downloadPromise;
    assert.match(download.suggestedFilename(), /forge-test-atelier-intel\.txt$/);
    const exported = path.join(directory, download.suggestedFilename());
    await download.saveAs(exported);
    const content = await fs.readFile(exported, 'utf8');
    assert.match(content, /FORGE — Test atelier Intel/);
    assert.match(content, /Core i5-14600KF/);
    assert.match(content, /Total indicatif/);
    assert.match(content, /Résolution : 4k/);
  });
  await test('Removing component updates count and incomplete state', async () => {
    await page.getByRole('button', { name: 'Choisir Stockage', exact: true }).click();
    await dialog().getByRole('button', { name: 'Retirer ce composant', exact: true }).click();
    assert.equal(await page.locator('.compatibility-banner strong').textContent(), 'Configuration à compléter');
    assert.match(await page.locator('.progress-label').textContent(), /7 sur 8/);
  });
  await test('Saved list loads build and delete removes saved entry', async () => {
    await page.getByRole('button', { name: /Mes configurations/ }).first().click();
    assert.equal(await dialog().locator('.saved-build').count(), 1);
    await dialog().getByRole('button', { name: 'Charger', exact: true }).click();
    assert.match(await page.locator('.progress-label').textContent(), /8 sur 8/);
    await page.getByRole('button', { name: /Mes configurations/ }).first().click();
    await dialog().getByRole('button', { name: 'Supprimer Test atelier Intel', exact: true }).click();
    await dialog().getByRole('heading', { name: 'Chaque grand build commence ici.' }).waitFor();
    await page.keyboard.press('Escape');
  });
  await test('Reset confirmation restores default build and gaming 1440p', async () => {
    await page.getByRole('button', { name: 'Réinitialiser', exact: true }).click();
    await dialog().getByRole('button', { name: 'Garder mon build', exact: true }).click();
    assert.match(await page.locator('.build-title').textContent(), /Test atelier Intel/);
    await page.getByRole('button', { name: 'Réinitialiser', exact: true }).click();
    await dialog().getByRole('button', { name: 'Réinitialiser', exact: true }).click();
    assert.equal(await page.locator('.compatibility-banner strong').textContent(), 'Tout est compatible');
    assert.equal(await page.getByRole('combobox', { name: 'Utilisation' }).inputValue(), 'gaming');
    assert.equal(await page.getByRole('button', { name: '1440p', exact: true }).getAttribute('aria-pressed'), 'true');
  });
  await test('Guide opens and returns to builder', async () => {
    await page.getByRole('button', { name: 'Le guide du builder', exact: true }).click();
    assert.equal(await dialog().locator('.guide-item').count(), 4);
    assert.match(await dialog().textContent(), /pas une promesse de FPS/);
    await dialog().getByRole('button', { name: 'À moi de construire', exact: true }).click();
  });
  await test('Empty search and reset filters work', async () => {
    await page.getByRole('button', { name: 'Choisir Processeur', exact: true }).click();
    await dialog().getByPlaceholder('Rechercher un composant…').pressSequentially('xyz-no-such-product', { delay: 30 });
    assert.equal(await dialog().getByPlaceholder('Rechercher un composant…').inputValue(), 'xyz-no-such-product');
    await dialog().getByRole('heading', { name: 'Aucun composant trouvé' }).waitFor();
    await dialog().getByRole('button', { name: 'Réinitialiser les filtres', exact: true }).click();
    const cpuCount = await dialog().locator('.catalog-product').count();
    assert.ok(cpuCount >= 12, 'Expanded CPU catalog must contain at least 12 options');
    assert.equal(parseInt(await dialog().locator('.cp-results-summary [role="status"]').textContent(), 10), cpuCount);
    await page.keyboard.press('Escape');
  });
  await test('Exploded mode, expanded 3D viewer and reset respond', async () => {
    const exploded = page.getByRole('button', { name: 'Vue éclatée', exact: true });
    await exploded.click();
    assert.equal(await exploded.getAttribute('aria-pressed'), 'true');
    await page.getByRole('button', { name: 'Agrandir la vue 3D', exact: true }).click();
    await dialog().locator('canvas').waitFor();
    await dialog().getByRole('button', { name: 'Assembler', exact: true }).click();
    await dialog().getByRole('button', { name: 'Recentrer', exact: true }).click();
    await dialog().getByRole('button', { name: 'Fermer la vue agrandie', exact: true }).click();
    assert.equal(await exploded.getAttribute('aria-pressed'), 'false');
  });
  await page.screenshot({ path: path.join(directory, 'desktop-final.png'), fullPage: true });
  }
  await context.close();
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
  const mobile = await mobileContext.newPage();
  mobile.on('pageerror', error => errors.push(error.message));
  await mobile.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await mobile.getByRole('heading', { name: 'Votre PC. Vos règles.' }).waitFor();
  await mobile.locator('canvas').waitFor();
  await test('Mobile at 390px has no horizontal overflow and working navigation and catalog', async () => {
    assert.deepEqual(await mobile.evaluate(() => ({ width: window.innerWidth, scroll: document.documentElement.scrollWidth })), { width: 390, scroll: 390 });
    await mobile.getByRole('button', { name: 'Ouvrir le menu', exact: true }).click();
    await mobile.getByRole('button', { name: 'Le guide du builder', exact: true }).click();
    await mobile.getByRole('dialog').getByRole('button', { name: 'Fermer', exact: true }).click();
    await mobile.getByRole('button', { name: 'Choisir Processeur', exact: true }).click();
    const mobileCpuCount = await mobile.getByRole('dialog').locator('.catalog-product').count();
    assert.ok(mobileCpuCount >= 12);
    assert.equal(parseInt(await mobile.getByRole('dialog').locator('.cp-results-summary [role="status"]').textContent(), 10), mobileCpuCount);
    const bounds = await mobile.getByRole('dialog').boundingBox();
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390);
    await mobile.getByRole('button', { name: 'Fermer le catalogue', exact: true }).click();
    await mobile.evaluate(() => scrollTo(0,0));
    await mobile.screenshot({ path: path.join(directory, 'mobile.png'), fullPage: true });
  });
  await test('Mobile at 360px has no horizontal overflow', async () => {
    await mobile.setViewportSize({ width: 360, height: 800 });
    assert.deepEqual(await mobile.evaluate(() => ({ width: window.innerWidth, scroll: document.documentElement.scrollWidth })), { width: 360, scroll: 360 });
    await mobile.screenshot({ path: path.join(directory, 'mobile-360.png'), fullPage: true });
  });
  await test('No uncaught browser runtime errors', async () => { assert.deepEqual(errors, []); });
  await fs.writeFile(path.join(directory, 'browser-results.json'), JSON.stringify({ results, errors }, null, 2));
  if (results.some(r => r.result === 'FAIL')) process.exitCode = 1;
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
