// Browser checks for chronological discovery and commercial-family filters.
// Requires Playwright, Chromium and a compiled site served at FORGE_TEST_URL.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const baseUrl = process.env.FORGE_TEST_URL || 'http://127.0.0.1:5173';
const output = process.env.FORGE_TEST_OUTPUT || '/tmp/forge-order-validation';
const root = path.resolve(__dirname, '..');
// Read the reference metadata independently of the DOM. Never treat a rendered
// year attribute as proof that a component actually belongs to that year.
const oracle = JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', `
  import { catalog, defaultSelection } from './src/data/catalog.ts';
  import { getReleaseInfo } from './src/data/releaseTimeline.ts';
  import { getCatalogFamily } from './src/lib/catalogFamilies.ts';
  import { getCatalogGroups, getVariantGroupId, getVariantLabel } from './src/lib/catalogVariants.ts';
  import { getMemoryDetails } from './src/lib/memoryDetails.ts';
  console.log(JSON.stringify({ defaultSelection, components:catalog.map(c => ({ id:c.id, name:c.name, brand:c.brand,
    category:c.category, memoryType:c.memoryType, family:getCatalogFamily(c), release:getReleaseInfo(c),
    groupId:getVariantGroupId(c), groupName:c.variantGroupName || c.name, finish:getVariantLabel(c),
    price:c.price, color:c.color, sourceUrl:c.source?.url, memory:getMemoryDetails(c) })),
    groups:getCatalogGroups().map(g=>({id:g.id,name:g.name,category:g.category,variants:g.variants.map(c=>c.id)})) }));
`], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }));
const reference = oracle.components;
const byId = new Map(reference.map(component => [component.id, component]));
const groupsById = new Map(oracle.groups.map(group => [group.id, group]));
const groupCount = rows => new Set(rows.map(row => row.groupId)).size;
const categoryLabels = { cpu: 'Processeur', gpu: 'Carte graphique', motherboard: 'Carte mère', ram: 'Mémoire vive', storage: 'Stockage', cooler: 'Refroidissement', psu: 'Alimentation', case: 'Boîtier' };

// Business ordering: known releases first, then year/month/day in the chosen
// direction. Unknown precision follows precise dates within the same period.
function chronology(left, right, direction) {
  const a = left.release, b = right.release;
  if (!a || !b) return a ? -1 : b ? 1 : 0;
  for (const field of ['year', 'month', 'day']) {
    if (a[field] == null || b[field] == null) return a[field] == null ? b[field] == null ? 0 : 1 : -1;
    if (a[field] !== b[field]) return (direction === 'newest' ? -1 : 1) * (a[field] - b[field]);
  }
  return 0;
}
function assertOrder(rows, candidates, direction) {
  assert.ok(rows.length > 0, 'Results must contain components');
  const eligible = new Set(candidates.map(component => component.id));
  assert.ok(rows.every(row => eligible.has(row.id)), 'Displayed references must belong to the expected category and filters');
  assert.equal(groupCount(rows), rows.length, 'Each model must have one card regardless of its color variants');
  for (let index = 1; index < rows.length; index++) {
    assert.ok(chronology(rows[index - 1], rows[index], direction) <= 0,
      `${rows[index - 1].name} must not precede ${rows[index].name} in ${direction} order`);
  }
  const visible = new Set(rows.map(row => row.groupId));
  const unseen = candidates.filter(component => !visible.has(component.groupId));
  assert.ok(unseen.every(component => chronology(rows.at(-1), component, direction) <= 0), 'Pagination must not hide a more recent/older result ahead of its displayed page');
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  await fs.writeFile(path.join(output, 'reference-metadata.json'), JSON.stringify(oracle, null, 2));
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
    if (process.env.FORGE_ORDER_TEST_MATCH && !new RegExp(process.env.FORGE_ORDER_TEST_MATCH).test(name)) return;
    try { await run(); results.push({ name, result: 'PASS' }); console.log('PASS', name); }
    catch (error) {
      results.push({ name, result: 'FAIL', error: error.message }); console.error('FAIL', name, error.message);
      if (page && !page.isClosed()) await page.screenshot({ timeout: 60000, path: path.join(output, `order-failure-${results.length}.png`) }).catch(() => {});
      await page?.keyboard.press('Escape').catch(() => {});
    }
  };
  const modal = () => page.getByRole('dialog');
  const cards = () => modal().locator('.catalog-product');
  const sort = () => modal().getByRole('combobox', { name: 'Trier les composants', exact: true });
  const family = () => modal().getByRole('combobox', { name: 'Filtrer par famille de composants', exact: true });
  const search = () => modal().getByPlaceholder('Rechercher un composant…');
  const count = async () => parseInt(await modal().locator('.cp-results-summary [role="status"]').textContent(), 10);
  const currentRows = async () => {
    const rendered = await cards().evaluateAll(nodes => nodes.map(node => ({ id: node.dataset.componentId, group: node.dataset.groupId, name: node.querySelector('h3')?.textContent, year: node.dataset.releaseYear, family: node.dataset.family, badge: node.querySelector('.cp-release-badge')?.textContent?.trim() })));
    const rows = rendered.map(item => byId.get(item.id));
    assert.ok(rows.every(Boolean), 'Every displayed card must resolve to an actual catalog reference');
    for (const [index, row] of rows.entries()) {
      assert.equal(rendered[index].year, row.release ? String(row.release.year) : '');
      assert.equal(rendered[index].family, row.family.id);
      assert.equal(rendered[index].group, row.groupId);
      assert.equal(rendered[index].name, groupsById.get(row.groupId).name);
      assert.equal(rendered[index].badge, row.release ? `${{ model: 'Modèle', generation: 'Génération', series: 'Gamme' }[row.release.basis]} · ${row.release.month ? new Intl.DateTimeFormat('fr-FR', {year:'numeric',month:'long',...(row.release.day ? {day:'numeric'} : {}),timeZone:'UTC'}).format(new Date(Date.UTC(row.release.year,row.release.month-1,row.release.day||1))) : row.release.year}` : 'Année non renseignée');
    }
    return rows;
  };
  const open = async category => {
    const close = page.getByRole('button', { name: 'Fermer le catalogue', exact: true });
    if (await close.isVisible().catch(() => false)) await close.click();
    await page.getByRole('button', { name: `Choisir ${categoryLabels[category]}`, exact: true }).click();
    await cards().first().waitFor();
    await page.waitForFunction(() => document.querySelector('[aria-label="Trier les composants"]')?.value === 'newest'
      && document.querySelector('[aria-label="Filtrer par famille de composants"]')?.value === 'all');
  };
  const selectSort = async value => {
    await sort().selectOption(value);
    await page.waitForFunction(() => document.querySelectorAll('.catalog-product').length <= 36);
  };
  const loadAll = async () => {
    while (await modal().getByRole('button', { name: /^Afficher \d+ composants de plus$/ }).count()) {
      const before = await cards().count();
      await modal().getByRole('button', { name: /^Afficher \d+ composants de plus$/ }).click();
      await page.waitForFunction(before => document.querySelectorAll('.catalog-product').length > before, before);
    }
  };
  const assertFits = async width => {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    const bounds = await modal().boundingBox();
    assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width + 1);
  };
  let desktop;
  try {
    desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    watch(await desktop.newPage());
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Votre PC. Vos règles.' }).waitFor();

    await test('The public catalog includes at least five thousand distinct models beyond color variants', async () => {
      assert.ok(oracle.groups.length >= 5000);
      assert.ok(reference.length > oracle.groups.length, 'Real finishes must be preserved as separately selectable references');
      assert.equal(new Set(oracle.groups.map(group => group.id)).size, oracle.groups.length);
      assert.equal(Number((await page.locator('.nav-count').textContent()).replace(/\D/g, '')), oracle.groups.length);
      for (const group of oracle.groups) assert.ok(group.variants.length > 0);
    });

    await test('CPU and GPU categories open with the most recent real references first', async () => {
      for (const category of ['cpu', 'gpu']) {
        await open(category);
        assert.equal(await sort().inputValue(), 'newest');
        const rows = await currentRows();
        assertOrder(rows, reference.filter(component => component.category === category), 'newest');
        assert.equal(await count(), groupCount(reference.filter(component => component.category === category)));
        assert.match(await modal().locator('.cp-chronology-note').textContent(), /génération.*gamme/);
        if (category === 'cpu') {
          const ids = rows.map(row => row.id);
          assert.ok(ids.indexOf('cpu-9800x3d') < ids.indexOf('cpu-5700x3d'), 'November 2024 9800X3D must precede January 2024 5700X3D');
          assert.ok(ids.indexOf('cpu-5700x3d') < ids.indexOf('cpu-7800x3d'), 'A newer Ryzen 5000 model must precede an older Ryzen 7000 model');
        }
      }
      await page.screenshot({ timeout: 60000, path: path.join(output, 'desktop-newest-gpu.png') });
    });

    await test('Oldest-first reverses known chronology and sorting or family selection resets pagination', async () => {
      await open('gpu');
      const newest = (await currentRows())[0];
      assert.equal(await cards().count(), 36);
      await modal().getByRole('button', { name: 'Afficher 36 composants de plus', exact: true }).click();
      await page.waitForFunction(() => document.querySelectorAll('.catalog-product').length === 72);
      await selectSort('oldest');
      assert.equal(await cards().count(), 36);
      const oldestRows = await currentRows();
      assertOrder(oldestRows, reference.filter(component => component.category === 'gpu'), 'oldest');
      assert.ok(oldestRows[0].release.year < newest.release.year);
      await modal().getByRole('button', { name: 'Afficher 36 composants de plus', exact: true }).click();
      await page.waitForFunction(() => document.querySelectorAll('.catalog-product').length === 72);
      const target = reference.find(component => component.category === 'gpu' && /RTX 40/.test(component.family.label)).family;
      await family().selectOption(target.id);
      await page.waitForFunction(() => document.querySelectorAll('.catalog-product').length <= 36);
      const expected = reference.filter(component => component.category === 'gpu' && component.family.id === target.id);
      assert.equal(await count(), groupCount(expected));
      const rows = await currentRows();
      assert.equal(rows.length, Math.min(36, groupCount(expected)));
      assert.ok(rows.every(row => row.family.id === target.id));
      assertOrder(rows, expected, 'oldest');
    });

    await test('References with unknown release years stay last in both chronological directions', async () => {
      const category = Object.keys(categoryLabels).filter(category => {
        const candidates = reference.filter(component => component.category === category);
        return candidates.some(component => component.release) && candidates.some(component => !component.release);
      }).sort((a, b) => reference.filter(component => component.category === a).length - reference.filter(component => component.category === b).length)[0];
      assert.ok(category, 'A category must exercise both known and unknown release metadata');
      const expected = reference.filter(component => component.category === category);
      await open(category);
      for (const direction of ['newest', 'oldest']) {
        await selectSort(direction);
        await loadAll();
        const rows = await currentRows();
        assert.equal(rows.length, groupCount(expected));
        assertOrder(rows, expected, direction);
        assert.equal(rows.at(-1).release, null);
        assert.match(await cards().last().locator('.cp-release-badge').textContent(), /non renseignée/);
      }
      await cards().last().getByRole('button', { name: /^Détails de / }).click();
      const chronology = modal().getByRole('region', { name: 'Classement chronologique', exact: true });
      assert.match(await chronology.textContent(), /date de sortie n’est pas renseignée/);
      await modal().getByRole('button', { name: 'Retour aux composants', exact: true }).click();
      assert.equal(await sort().inputValue(), 'oldest');
    });

    await test('Family combines with brand and search, and survives sheet and comparison navigation', async () => {
      await open('gpu');
      const target = reference.find(component => component.category === 'gpu' && /RTX 40/.test(component.family.label)).family;
      await family().selectOption(target.id);
      await modal().getByRole('combobox', { name: 'Filtrer par marque', exact: true }).selectOption('MSI');
      await search().fill('4060');
      const expected = reference.filter(component => component.category === 'gpu' && component.family.id === target.id && component.brand === 'MSI' && /4060/.test(component.name));
      assert.ok(expected.length >= 2);
      assert.equal(await count(), groupCount(expected));
      const ids = (await currentRows()).map(row => row.id);
      assert.deepEqual((await currentRows()).map(row => row.groupId).sort(), [...new Set(expected.map(row => row.groupId))].sort());
      assertOrder(await currentRows(), expected, 'newest');
      await cards().first().getByRole('button', { name: /^Détails de / }).click();
      await modal().locator('.cp-detail-specs').waitFor();
      assert.match(await modal().locator('.cp-detail-specs').textContent(), /Famille et chronologie/);
      await modal().getByRole('button', { name: 'Retour aux composants', exact: true }).click();
      assert.equal(await family().inputValue(), target.id);
      assert.equal(await search().inputValue(), '4060');
      assert.equal(await modal().getByRole('combobox', { name: 'Filtrer par marque', exact: true }).inputValue(), 'MSI');
      assert.deepEqual((await currentRows()).map(row => row.id), ids);
      for (const id of ids.slice(0, 2)) await modal().locator(`[data-component-id="${id}"]`).getByRole('button', { name: /^Comparer / }).click();
      await modal().getByRole('button', { name: 'Comparer la sélection', exact: true }).click();
      await modal().getByRole('table').waitFor();
      assert.match(await modal().getByRole('table').textContent(), /Famille/);
      await modal().getByRole('button', { name: 'Retour aux composants', exact: true }).click();
      assert.equal(await family().inputValue(), target.id);
      assert.equal(await search().inputValue(), '4060');
      assert.deepEqual((await currentRows()).map(row => row.id), ids);
    });

    await test('Switching category clears the former family and restores newest-first', async () => {
      await open('gpu');
      const target = reference.find(component => component.category === 'gpu' && /RTX 40/.test(component.family.label)).family;
      await family().selectOption(target.id);
      await selectSort('oldest');
      await cards().first().getByRole('button', { name: /^Comparer / }).click();
      await modal().getByRole('navigation', { name: 'Catégories de composants', exact: true }).getByRole('button', { name: /^RAM/ }).click();
      await page.waitForFunction(() => document.querySelector('[aria-label="Trier les composants"]')?.value === 'newest'
        && document.querySelector('[aria-label="Filtrer par famille de composants"]')?.value === 'all');
      assert.equal(await count(), groupCount(reference.filter(component => component.category === 'ram')));
      assert.equal(await modal().locator('.cp-compare-tray').count(), 0);
      assertOrder(await currentRows(), reference.filter(component => component.category === 'ram'), 'newest');
    });

    await test('The per-slot RAM picker uses the same newest-first metadata and keeps DDR filtering', async () => {
      const close = page.getByRole('button', { name: 'Fermer le catalogue', exact: true });
      if (await close.isVisible().catch(() => false)) await close.click();
      const memory = page.locator('.memory-configurator');
      await memory.locator('[data-memory-slot="0"]').click();
      const picker = memory.locator('.mc-picker');
      await picker.waitFor();
      const expected = reference.filter(component => component.category === 'ram' && component.memoryType === 'DDR5');
      const names = await picker.locator('.mc-picker-install').evaluateAll(nodes => nodes.map(node => node.getAttribute('aria-label')));
      const rows = names.map(name => expected.find(component => name === `Installer une barrette ${component.brand} ${component.name} en A1`));
      assert.ok(rows.every(Boolean), 'The slot picker must resolve to genuine DDR5 references');
      assert.equal(rows.length, 20);
      assertOrder(rows, expected, 'newest');
      assert.match(await picker.locator('.mc-picker-heading').textContent(), /plus récentes aux plus anciennes/);
      assert.equal(await picker.locator('.mc-result-chronology').count(), 20);
      await page.keyboard.press('Escape');
      await picker.waitFor({ state: 'hidden' });
    });

    await desktop.close(); desktop = undefined;
    await test('At 360px family filters, chronology badges and detail navigation fit the screen', async () => {
      const mobile = await browser.newContext({ viewport: { width: 360, height: 844 }, deviceScaleFactor: 1, isMobile: true, reducedMotion: 'reduce' });
      try {
        watch(await mobile.newPage());
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await page.getByRole('heading', { name: 'Votre PC. Vos règles.' }).waitFor();
        await open('ram');
        await assertFits(360);
        const target = reference.find(component => component.category === 'ram' && component.family.label === 'Corsair Vengeance').family;
        await family().selectOption(target.id);
        await selectSort('oldest');
        assertOrder(await currentRows(), reference.filter(component => component.category === 'ram' && component.family.id === target.id), 'oldest');
        await modal().locator('.cp-family-filter').scrollIntoViewIfNeeded();
        await page.screenshot({ timeout: 60000, path: path.join(output, 'mobile-family-filter-360.png') });
        await cards().first().scrollIntoViewIfNeeded();
        const cardBounds = await cards().first().boundingBox();
        const badgeBounds = await cards().first().locator('.cp-classification').boundingBox();
        assert.ok(badgeBounds.x >= cardBounds.x && badgeBounds.x + badgeBounds.width <= cardBounds.x + cardBounds.width + 1);
        await page.screenshot({ timeout: 60000, path: path.join(output, 'mobile-chronology-cards-360.png') });
        await cards().first().getByRole('button', { name: /^Détails de / }).click();
        await modal().locator('.cp-release-detail').waitFor();
        await assertFits(360);
        await modal().getByRole('button', { name: 'Retour aux composants', exact: true }).click();
        assert.equal(await family().inputValue(), target.id);
        assert.equal(await sort().inputValue(), 'oldest');
        await assertFits(360);
      } finally { await mobile.close(); }
    });

    await test('No uncaught browser errors in chronological catalog flows', async () => assert.deepEqual(errors, []));
    await fs.writeFile(path.join(output, 'order-results.json'), JSON.stringify({ baseUrl, results, errors }, null, 2));
    if (results.some(result => result.result === 'FAIL')) process.exitCode = 1;
  } finally {
    if (desktop) await desktop.close();
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
