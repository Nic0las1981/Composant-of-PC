// Source-aware price UI checks. Most native public JSON responses are fixtures.
// One case relays actual responses read by curl using the inherited proxy/CA:
// Chromium does not trust this environment's proxy CA. No merchant is contacted.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { openCatalogProductDetail, chooseOpenCatalogProduct } = require('./catalog-test-helpers.cjs');
const baseUrl = process.env.FORGE_TEST_URL || 'http://127.0.0.1:5173';
const output = process.env.FORGE_TEST_OUTPUT || '/tmp/forge-price-sources-validation';
const root = path.resolve(__dirname, '..');
const oracle = JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', `
  import {catalog,getComponent,defaultSelection} from './src/data/catalog.ts';
  import {MARKET_MAPPINGS,MARKET_SOURCE,marketObservations} from './src/data/marketObservations.ts';
  import {getPriceArchive} from './src/lib/priceArchive.ts';
  import {getVariantGroupId,getVariantLabel} from './src/lib/catalogVariants.ts';
  const small=c=>({id:c.id,name:c.name,category:c.category,description:c.description,specs:c.specs,price:c.price,
    group:getVariantGroupId(c),finish:getVariantLabel(c),archive:getPriceArchive(c)});
  console.log(JSON.stringify({mappings:MARKET_MAPPINGS,source:MARKET_SOURCE,observations:marketObservations,
    cpu:small(getComponent('cpu-9800x3d')),ram:small(getComponent('import-ram-23d5bd7fb588')),
    whiteRam:small(getComponent('import-ram-d9d314ba116a')),defaultRam:small(getComponent(defaultSelection.ram)),
    gpu:small(catalog.find(c=>c.source&&c.category==='gpu'&&c.specs.some(s=>s.startsWith('Boost déclaré')))),
    ssd:small(catalog.find(c=>c.source&&c.category==='storage'&&c.specs.some(s=>s.startsWith('Cache déclaré')))),
    archived:catalog.flatMap(c=>{const q=getPriceArchive(c);return q?[{id:c.id,amount:q.amount}]:[]})}));
`], { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 }));
const archiveById = new Map(oracle.archived.map(row => [row.id, row.amount]));
const targetSourceId = oracle.mappings.find(mapping => mapping.component.id === oracle.cpu.id).sourcePart.id;
const native = 'https://raw.githubusercontent.com/xxderen/pc-build/main/data/';
const euro = amount => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
const compact = text => text.replace(/[\s\u00a0\u202f]+/g, ' ').trim();
const monetary = text => Number(text.replace(/[^\d,.-]/g, '').replace(',', '.'));

function fixture() {
  const updatedAt = new Date().toISOString();
  assert.ok(Date.parse(updatedAt) >= Date.parse(oracle.source.sourceUpdatedAt));
  return {
    parts: { schema: 1, parts: Object.fromEntries(oracle.mappings.map(mapping => [mapping.sourcePart.id, {
      id: mapping.sourcePart.id, category: mapping.sourcePart.category, name: mapping.sourcePart.name,
      sources: { geizhals: mapping.sourcePart.geizhalsSlug },
    }])) },
    prices: { schema: 1, updated_at: updatedAt, parts: Object.fromEntries(oracle.mappings.map(mapping => {
      const saved = oracle.observations[mapping.component.id];
      return [mapping.sourcePart.id, { current: { price: saved.amount, merchant: saved.merchant,
        url: saved.productURL, source: 'geizhals', availability: saved.availabilityReported, since: saved.priceSince } }];
    })) },
  };
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const inheritedProxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true,
    ...(inheritedProxy ? { proxy: { server: inheritedProxy, bypass: '127.0.0.1,localhost' } } : {}),
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  let context, page, source = fixture(), offline = false, nativeMode = false, nativeResult = null;
  const actualResponses = new Map();
  const results = [], errors = [], requests = [], nativeFailures = [];
  const dialog = () => page.getByRole('dialog');
  const report = () => dialog().getByRole('region', { name: 'Prix signalé par une source publique', exact: true });
  const selected = () => page.evaluate(() => JSON.parse(localStorage.getItem('forge-workbench-v1')).selection);
  const total = async () => monetary(await page.locator('.total-price').textContent());
  const test = async (name, run) => {
    if (process.env.FORGE_PRICE_TEST_MATCH && !new RegExp(process.env.FORGE_PRICE_TEST_MATCH).test(name)) return;
    try {
      const outcome = await run();
      if (outcome?.skip) { results.push({ name, result: 'SKIP', reason: outcome.skip }); console.log('SKIP', name, outcome.skip); }
      else { results.push({ name, result: 'PASS' }); console.log('PASS', name); }
    }
    catch (error) {
      results.push({ name, result: 'FAIL', error: error.message }); console.error('FAIL', name, error.message);
      if (page && !page.isClosed()) {
        await page.screenshot({ timeout: 60000, path: path.join(output, `price-failure-${results.length}.png`) }).catch(() => {});
        await page.keyboard.press('Escape').catch(() => {});
      }
    }
  };
  const load = async (width = 1440, initialOffline = false, realSource = false) => {
    if (context) await context.close();
    source = fixture(); offline = initialOffline; nativeMode = realSource;
    context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 1000 }, deviceScaleFactor: 1,
      isMobile: width < 600, reducedMotion: 'reduce' });
    await context.route(`${native}*`, async route => {
      const request = route.request(); const url = request.url();
      requests.push({ url, headers: request.headers(), offline, native: nativeMode });
      if (nativeMode) {
        const response = actualResponses.get(url);
        if (!response) return route.abort('failed');
        return route.fulfill(response);
      }
      if (offline) return route.abort('failed');
      assert.ok(url === `${native}parts.json` || url === `${native}prices.json`);
      await route.fulfill({ status: 200, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
        body: JSON.stringify(url.endsWith('/parts.json') ? source.parts : source.prices) });
    });
    page = await context.newPage(); page.setDefaultTimeout(25000); page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => { if (nativeMode && request.url().startsWith(native)) nativeFailures.push({ url: request.url(), error: request.failure()?.errorText }); });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Votre PC. Vos règles.', exact: true }).waitFor();
    await page.locator('.memory-configurator').waitFor();
  };
  const open = async category => {
    const close = page.getByRole('button', { name: 'Fermer le catalogue', exact: true });
    if (await close.isVisible().catch(() => false)) await close.click();
    await page.getByRole('button', { name: `Choisir ${category}`, exact: true }).click();
    await dialog().locator('.catalog-product').first().waitFor();
  };
  const detail = async component => {
    await open({ cpu: 'Processeur', ram: 'Mémoire vive', gpu: 'Carte graphique', storage: 'Stockage' }[component.category]);
    await openCatalogProductDetail(page, component.name);
  };
  const choose = async component => {
    await open({ cpu: 'Processeur', ram: 'Mémoire vive' }[component.category]);
    await chooseOpenCatalogProduct(page, component.name);
  };
  const refresh = async status => {
    const count = requests.length;
    await report().getByRole('button', { name: 'Actualiser les prix signalés', exact: true }).click();
    await report().getByRole('status').filter({ hasText: status }).waitFor();
    assert.equal(requests.length - count, 2, 'One refresh must read the two native JSON files once');
  };
  const screenshot = async (name, element) => {
    if (element) await element.scrollIntoViewIfNeeded();
    await page.screenshot({ timeout: 60000, path: path.join(output, name) });
  };
  try {
    await test('A precise public EUR report stays labelled Germany and refreshes the installed budget without changing the build', async () => {
      await load(); await choose(oracle.cpu); const before = await total(); const selection = await selected();
      await detail(oracle.cpu);
      assert.equal(await report().getAttribute('data-market'), 'DE');
      assert.equal(Number(await report().getAttribute('data-reported-amount')), oracle.observations[oracle.cpu.id].amount);
      const text = compact(await report().textContent());
      for (const part of ['Allemagne', 'Non revérifié auprès du marchand', 'Prix inchangé depuis', 'Fichier source mis à jour', 'livraison en France']) assert.ok(text.includes(part), part);
      assert.equal(await report().getByRole('link', { name: 'Voir le produit sur Geizhals', exact: true }).getAttribute('href'), oracle.observations[oracle.cpu.id].productURL);
      source.prices.parts[targetSourceId].current.price = 400;
      source.prices.parts[targetSourceId].current.since = source.prices.updated_at;
      await refresh('Source publique actualisée');
      assert.equal(await report().getAttribute('data-reported-amount'), '400');
      assert.equal(compact(await dialog().locator('.cp-detail-price > strong').textContent()), compact(euro(400)));
      assert.equal(await total(), Number((before + 400 - oracle.observations[oracle.cpu.id].amount).toFixed(2)));
      assert.deepEqual(await selected(), selection);
      assert.match(await report().getByRole('link', { name: 'Consulter le suivi public', exact: true }).getAttribute('href'), /\/blob\/main\/data\/prices\.json$/);
      assert.ok(requests.every(request => !request.headers.cookie && !request.headers.authorization && !request.headers.referer));
      await screenshot('desktop-reported-eur-refreshed.png', report());
    });
    await test('A partial refresh with a rejected identity preserves the last accepted unavailable price and date', async () => {
      await load(); await choose(oracle.cpu); await detail(oracle.cpu);
      source.prices.parts[targetSourceId].current.price = 365;
      source.prices.parts[targetSourceId].current.availability = 'unavailable';
      await refresh('Source publique actualisée');
      assert.equal(await report().getAttribute('data-reported-amount'), '365');
      const lastReport = compact(await report().locator('dl').textContent());
      const lastTotal = await total();
      source.parts.parts[targetSourceId].manufacturerPartNumber = '100-DIFFERENT-PRODUCT';
      source.prices.parts[targetSourceId].current.price = 1;
      await refresh('Source partiellement actualisée');
      assert.equal(await report().getAttribute('data-reported-amount'), '365');
      assert.equal(compact(await report().locator('dl').textContent()), lastReport);
      assert.equal(compact(await dialog().locator('.cp-detail-price > strong').textContent()), compact(euro(oracle.cpu.price)));
      assert.equal(await total(), lastTotal);
      delete source.parts.parts[targetSourceId].manufacturerPartNumber;
      source.prices.parts[targetSourceId].current = null;
      await refresh('Source partiellement actualisée');
      assert.equal(await report().getAttribute('data-reported-amount'), '365');
      assert.equal(await total(), lastTotal);
      await screenshot('desktop-rejected-price-identity.png', report());
    });
    await test('A non-stock report is shown separately while the budget falls back to its catalogue estimate', async () => {
      await load(); await choose(oracle.cpu); const before = await total(); await detail(oracle.cpu);
      source.prices.parts[targetSourceId].current.price = 400;
      source.prices.parts[targetSourceId].current.availability = 'shortly';
      await refresh('Source publique actualisée');
      assert.equal(await report().getAttribute('data-reported-amount'), '400');
      assert.match(await report().textContent(), /hors budget/);
      assert.equal(compact(await dialog().locator('.cp-detail-price > strong').textContent()), compact(euro(oracle.cpu.price)));
      assert.equal(await total(), Number((before + oracle.cpu.price - oracle.observations[oracle.cpu.id].amount).toFixed(2)));
    });
    await test('Network failure keeps the bundled report and preserves an accepted refresh instead of replacing prices with zero', async () => {
      await load(1440, true); await detail(oracle.cpu);
      await report().getByRole('status').filter({ hasText: 'Source inaccessible' }).waitFor();
      assert.equal(Number(await report().getAttribute('data-reported-amount')), oracle.observations[oracle.cpu.id].amount);
      offline = false; source.prices.parts[targetSourceId].current.price = 402;
      await refresh('Source publique actualisée');
      assert.equal(await report().getAttribute('data-reported-amount'), '402');
      offline = true; await refresh('Source inaccessible');
      assert.equal(await report().getAttribute('data-reported-amount'), '402');
      assert.equal(compact(await dialog().locator('.cp-detail-price > strong').textContent()), compact(euro(402)));
    });
    await test('Archived USD values belong to the exact RAM finish and never become euros in the budget', async () => {
      await load(); const before = await total(); await detail(oracle.ram);
      const archive = () => dialog().getByRole('region', { name: 'Prix archivé du composant', exact: true });
      assert.equal(oracle.ram.archive.amount, 94.99); assert.equal(oracle.whiteRam.archive, null);
      assert.match(await archive().textContent(), /94,99.*USD/s);
      assert.match(await archive().textContent(), /23 juillet 2025/);
      assert.match(await archive().textContent(), /n’est pas converti ni ajouté au budget en euros/);
      assert.equal(await archive().getByRole('link').getAttribute('href'), oracle.ram.archive.sourceUrl);
      assert.equal(await dialog().locator('.cp-detail-price > strong').textContent(), 'Prix non renseigné');
      await dialog().getByRole('button', { name: `Coloris ${oracle.whiteRam.finish}`, exact: true }).click();
      assert.equal(await archive().count(), 0, 'A black finish must not lend its archived price to white');
      await dialog().getByRole('button', { name: `Coloris ${oracle.ram.finish}`, exact: true }).click();
      assert.equal(await archive().count(), 1);
      await screenshot('desktop-archived-usd-exact-finish.png', archive());
      await dialog().locator('.cp-detail-actions').getByRole('button', { name: 'Choisir', exact: true }).click();
      await dialog().waitFor({ state: 'hidden' });
      assert.equal(await total(), Number((before - oracle.defaultRam.price).toFixed(2)));
      assert.match(await page.locator('.incomplete-budget-note').textContent(), /sans prix en euros/);
      assert.equal((await selected()).ram, oracle.ram.id);
    });
    await test('Archived-price sorting keeps USD explicitly labelled and independent from the EUR budget filter', async () => {
      await load(); await open('Mémoire vive');
      for (const direction of ['archive-up', 'archive-down']) {
        await dialog().getByRole('combobox', { name: 'Trier les composants', exact: true }).selectOption(direction);
        const cards = dialog().locator('.catalog-product');
        const ids = await cards.evaluateAll(nodes => nodes.map(node => node.dataset.componentId));
        const amounts = ids.map(id => archiveById.get(id));
        assert.ok(amounts.length > 10 && amounts.every(value => typeof value === 'number'));
        assert.ok(amounts.slice(1).every((value, index) => direction === 'archive-up' ? value >= amounts[index] : value <= amounts[index]));
        assert.equal(await cards.locator('[data-archive-currency="USD"]').count(), ids.length);
      }
      await dialog().getByPlaceholder('Rechercher un composant…').fill(oracle.ram.name.replace(/ · Noir$/, ''));
      await dialog().getByRole('combobox', { name: 'Budget maximum par composant', exact: true }).selectOption('50');
      assert.equal(await dialog().locator(`[data-group-id=${JSON.stringify(oracle.ram.group)}]`).count(), 0);
    });
    await test('Comparison keeps the USD archive separate from an indicative EUR price on the neighbouring model', async () => {
      await load(); await detail(oracle.ram);
      await dialog().locator('.cp-detail-actions').getByRole('button', { name: 'Comparer', exact: true }).click();
      await dialog().getByRole('button', { name: 'Retour aux composants', exact: true }).click();
      await openCatalogProductDetail(page, oracle.defaultRam.name);
      await dialog().locator('.cp-detail-actions').getByRole('button', { name: 'Comparer', exact: true }).click();
      await dialog().getByRole('button', { name: 'Comparer la sélection', exact: true }).click();
      const columns = dialog().locator('.cp-comparison-product');
      assert.equal(await columns.count(), 2);
      assert.equal(await columns.nth(0).locator('> strong').textContent(), 'Prix non renseigné');
      assert.match(await columns.nth(0).locator('.cp-archive-note').textContent(), /94,99.*USD/s);
      assert.equal(await columns.nth(1).locator('.cp-archive-note').count(), 0);
      assert.equal(compact(await columns.nth(1).locator('> strong').textContent()), compact(euro(oracle.defaultRam.price)));
      await screenshot('desktop-comparison-currencies.png', columns.first());
    });
    await test('GPU and SSD descriptions expose their sourced facts without inventing cache technology or benchmark results', async () => {
      await load(); await detail(oracle.gpu);
      assert.equal(await dialog().locator('.cp-detail-intro > p').textContent(), oracle.gpu.description);
      const gpuDetails = compact(await dialog().locator('.cp-detail-specs').textContent());
      for (const prefix of ['Fréquence déclarée par la source : ', 'Boost déclaré : ']) {
        const value = oracle.gpu.specs.find(spec => spec.startsWith(prefix)).slice(prefix.length);
        assert.ok(gpuDetails.includes(compact(value)), value);
      }
      assert.match(gpuDetails, /Fréquence déclarée par la source/);
      await screenshot('desktop-sourced-gpu-description.png', dialog().locator('.cp-detail-hero'));
      await detail(oracle.ssd);
      assert.equal(await dialog().locator('.cp-detail-intro > p').textContent(), oracle.ssd.description);
      const ssdDetails = compact(await dialog().locator('.cp-detail-specs').textContent());
      const cache = oracle.ssd.specs.find(spec => spec.startsWith('Cache déclaré : ')).slice('Cache déclaré : '.length);
      assert.ok(ssdDetails.includes(compact(cache)), cache);
      assert.match(await dialog().textContent(), /ne permet pas d’affirmer la présence de DRAM/);
      await screenshot('desktop-sourced-ssd-description.png', dialog().locator('.cp-detail-hero'));
    });
    await test('Mobile 360px keeps reported EUR and archived USD source panels readable without overflow', async () => {
      await load(360); await detail(oracle.cpu);
      await screenshot('mobile-reported-eur-360.png', report());
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 360);
      const refreshBounds = await report().getByRole('button', { name: 'Actualiser les prix signalés', exact: true }).boundingBox();
      assert.ok(refreshBounds && refreshBounds.x >= 0 && refreshBounds.x + refreshBounds.width <= 361);
      await detail(oracle.ram);
      const archive = dialog().getByRole('region', { name: 'Prix archivé du composant', exact: true });
      await screenshot('mobile-archived-usd-360.png', archive);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 360);
    });
    await test('Export preserves the reported country, merchant, source URL and both dates', async () => {
      await load(); await choose(oracle.cpu);
      const downloadEvent = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Exporter ma configuration', exact: true }).click();
      const download = await downloadEvent;
      await download.saveAs(path.join(output, 'reported-build-export.txt'));
      const exported = await fs.readFile(path.join(output, 'reported-build-export.txt'), 'utf8');
      for (const term of ['signalé en Allemagne', 'non revérifié auprès du marchand', oracle.observations[oracle.cpu.id].merchant,
        'https://github.com/xxderen/pc-build/blob/main/data/prices.json', source.prices.updated_at,
        source.prices.parts[targetSourceId].current.since]) assert.ok(exported.includes(term), term);
    });
    await test('A report older than fourteen days leaves the budget when the tab wakes, without refetching or losing selection', async () => {
      await load(); await choose(oracle.cpu); await detail(oracle.cpu);
      source.prices.parts[targetSourceId].current.price = 400;
      await refresh('Source publique actualisée');
      const selection = await selected(); const before = await total(); const count = requests.length;
      await page.clock.setSystemTime(new Date(Date.parse(source.prices.updated_at) + 14 * 86400000 + 1));
      await page.evaluate(() => {
        document.dispatchEvent(new Event('visibilitychange'));
        window.dispatchEvent(new Event('pageshow'));
      });
      await page.waitForFunction(price => document.querySelector('.cp-detail-price > strong')?.textContent === price, euro(oracle.cpu.price));
      assert.equal(await total(), Number((before + oracle.cpu.price - 400).toFixed(2)));
      assert.equal(await report().getAttribute('data-reported-amount'), '400');
      assert.match(await report().textContent(), /hors budget/);
      assert.deepEqual(await selected(), selection); assert.equal(requests.length, count);
      await screenshot('desktop-expired-report.png', report());
    });
    await test('Actual native GitHub JSON read through the inherited proxy and trusted CA refreshes the browser UI', async () => {
      if (!inheritedProxy) return { skip: 'No inherited proxy is available; no direct connection was attempted.' };
      for (const name of ['parts', 'prices']) {
        const url = `${native}${name}.json`;
        const headerPath = path.join(output, `native-${name}-headers.txt`);
        const body = execFileSync('curl', ['--fail', '--silent', '--show-error', '--max-time', '20', '--dump-header', headerPath, url], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
        const headers = await fs.readFile(headerPath, 'utf8');
        assert.match(headers, /access-control-allow-origin:\s*\*/i);
        assert.equal(JSON.parse(body).schema, 1);
        actualResponses.set(url, { status: 200, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }, body });
      }
      await load(1440, false, true); await detail(oracle.cpu);
      await page.waitForFunction(() => {
        const text = document.querySelector('.cp-market-refresh [role="status"]')?.textContent ?? '';
        return text.includes('actualisée') || text.includes('inaccessible');
      }, undefined, { timeout: 15000 });
      const status = await report().getByRole('status').textContent();
      nativeResult = { status, amount: await report().getAttribute('data-reported-amount'), failures: nativeFailures,
        transport: 'Actual responses read by curl through inherited proxy/CA and fulfilled at their original URLs. Direct Chromium TLS trust of the proxy CA is not validated.' };
      await screenshot('desktop-native-public-feed.png', report());
      if (/inaccessible/.test(status)) return { skip: `Native source could not be read in this browser: ${nativeFailures.map(failure => failure.error).join(', ') || status}` };
      assert.match(status, /Source (publique|partiellement) actualisée/);
      assert.equal(nativeFailures.length, 0);
    });
    await test('Public-source flows have no uncaught JavaScript errors', async () => assert.deepEqual(errors, []));
  } finally {
    if (context) await context.close(); await browser.close();
    await fs.writeFile(path.join(output, 'price-source-results.json'), JSON.stringify({ baseUrl, results, errors,
      nativeResult, nativeRequests: requests.map(({ url, offline, native }) => ({ url, offline, native })) }, null, 2));
    if (results.some(result => result.result === 'FAIL')) process.exitCode = 1;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
