// Public-control helpers for a catalog that groups real finish variants.
// The oracle resolves a requested model name to its stable variant and group;
// choosing still goes through search, the detail sheet and the finish buttons.
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const assert = require('node:assert/strict');
const rows = JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', `
  import { catalog } from './src/data/catalog.ts';
  import { getVariantGroupId, getVariantLabel } from './src/lib/catalogVariants.ts';
  console.log(JSON.stringify(catalog.map(c=>({id:c.id,name:c.name,category:c.category,group:getVariantGroupId(c),groupName:c.variantGroupName||c.name,finish:getVariantLabel(c)}))));
`], { cwd: path.resolve(__dirname, '..'), encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }));

async function openCatalogProductDetail(page, name) {
  const target = rows.find(row => row.name === name);
  assert.ok(target, `Catalog must retain the real variant ${name}`);
  const dialog = page.getByRole('dialog');
  await dialog.getByPlaceholder('Rechercher un composant…').fill(target.groupName);
  const card = dialog.locator(`[data-group-id=${JSON.stringify(target.group)}]`);
  await card.waitFor();
  assert.equal(await card.count(), 1, `One card per model: ${target.groupName}`);
  await card.getByRole('button', { name: /^Détails de / }).click();
  const finishes = dialog.getByRole('group', { name: 'Coloris disponibles', exact: true });
  if (await finishes.count()) await finishes.getByRole('button', { name: `Coloris ${target.finish}`, exact: true }).click();
  await dialog.getByRole('heading', { name: target.name, exact: true }).waitFor();
  assert.equal(await dialog.locator('.cp-detail-art svg').getAttribute('data-component-id'), target.id);
  return { dialog, target };
}

async function chooseOpenCatalogProduct(page, name) {
  const { dialog } = await openCatalogProductDetail(page, name);
  await dialog.locator('.cp-detail-actions').getByRole('button', { name: /^(Choisir|Sélectionné)$/ }).click();
  await dialog.waitFor({ state: 'hidden' });
}

module.exports = { openCatalogProductDetail, chooseOpenCatalogProduct };
