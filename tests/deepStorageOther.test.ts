import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { deepStorageOtherProducts as products } from '../src/data/deepStorageOtherCatalog.ts';

const brands = new Set(['Lexar', 'Sabrent', 'PNY', 'Addlink', 'Klevv', 'Nextorage', 'Netac']);
const input = JSON.parse(gunzipSync(readFileSync(new URL('../data/deep-review/memory-storage/input.json.gz', import.meta.url))).toString()) as { component: { id: string; category: string; brand: string; capacityGB: number }; verified?: { mpn: string } }[];
const scoped = input.filter(({ component: c }) => c.category === 'storage' && brands.has(c.brand));
const byMpn = (mpn: string) => {
  const record = Object.values(products).find(p => p.mpn === mpn);
  assert.ok(record, `Missing exact MPN ${mpn}`);
  return record;
};
const value = (mpn: string, key: string) => byMpn(mpn).fieldEvidence?.[key]?.value;

test('all 184 assigned SSD variants have a unique capacity-matched primary review', () => {
  assert.equal(scoped.length, 184);
  assert.deepEqual(Object.keys(products).sort(), scoped.map(r => r.component.id).sort());
  assert.equal(new Set(Object.values(products).map(p => p.mpn || p.manufacturerModel)).size, 184);
  for (const { component: c, verified } of scoped) {
    const p = products[c.id];
    assert.equal(p.patch.capacityGB, c.capacityGB, c.id);
    assert.equal(p.fieldEvidence?.capacity.value, c.capacityGB, c.id);
    assert.ok(p.sources.length > 0, c.id);
    assert.ok(p.sources.every(s => s.kind === 'manufacturer' || s.kind === 'retailer'), c.id);
    for (const field of Object.values(p.fieldEvidence ?? {})) {
      assert.ok(p.sources.some(s => s.url === field.sourceURL), `${c.id}: missing field citation`);
      assert.equal(field.checkedAt, '2026-11-10');
    }
    if (p.offers.length) assert.equal(p.mpn.toUpperCase(), verified?.mpn.toUpperCase(), 'Offers must not cross identities');
    if (p.identityKind === 'manufacturer-model') {
      assert.equal(p.mpn, '');
      assert.equal(p.patch.manufacturerModel, p.manufacturerModel);
    }
  }
});

test('capacity-specific speeds do not receive another capacity’s family maximum', () => {
  assert.equal(value('SB-RKT4L-1TB', 'write'), 6100);
  assert.equal(value('SB-RKT4L-2TB', 'write'), 6400);
  assert.equal(value('SB-RKT5-1TB', 'read'), 13000);
  assert.equal(value('SB-RKT5-4TB', 'read'), 14000);
  assert.equal(value('SB-RKTQ4-1TB', 'write'), 1800);
  assert.equal(value('SB-RKTQ4-4TB', 'write'), 3500);
  assert.equal(value('ad512GBS90LTM2P', 'write'), 2500);
  assert.equal(value('ad4TBS90LTM2P', 'write'), 4200);
  assert.equal(value('LNQ710X004T-RNNNG', 'read'), 4850);
  assert.equal(value('LNQ710X004T-RNNNG', 'endurance'), 1360);
});

test('old capacities, revisions and heatsink variants retain their distinct identities', () => {
  assert.equal(byMpn('LNQ790X500G-RNNNG').patch.capacityGB, 500);
  assert.equal(byMpn('LNM800P001T-RNNNG').patch.heightMm, 2.45);
  assert.equal(byMpn('LNM800P001T-RN8NG').patch.heightMm, 10);
  assert.equal(byMpn('M280CS3040-1TB-RB').patch.storageHeatsink, false);
  assert.equal(byMpn('M280CS3040HS-1TB-RB').patch.storageHeatsink, true);
  assert.equal(byMpn('SB-ROCKET-NVME4-HTSK-1TB').patch.storageHeatsink, true);
  assert.equal(byMpn('SB-ROCKET-NVME4-1TB').patch.storageHeatsink, false);
  assert.equal(value('K01TBM2SP0-C7T', 'interfaceGeneration'), 'PCIe 3.0 ×4');
  assert.equal(value('NN5PRO-1TB1BH', 'interfaceGeneration'), 'PCIe 5.0 ×4');
  assert.equal(value('NE5N1TB/FHHE SYM', 'read'), 9500);
  assert.equal(value('NN5PRO-1TB1BH', 'read'), 11700);
});

test('contradictory dimensions, family-only maxima and misprinted identifiers stay unresolved', () => {
  assert.equal(byMpn('M280CS3150HS-1TB-RB').patch.lengthMm, undefined);
  assert.equal(byMpn('ad1TBA92M2P').patch.widthMm, undefined);
  assert.equal(byMpn('NT01NV7000t-2T0-E4X').patch.heightMm, undefined);
  assert.equal(byMpn('SB-ROCKET-NVME4-HTSK-2TB').patch.heightMm, undefined);
  assert.equal(byMpn('M280CS3140-8TB-RB').fieldEvidence?.read, undefined);
  assert.ok(!Object.values(products).some(p => p.mpn === 'NT01NV3000-2T0-E4X'));
  const nv5000 = Object.values(products).find(p => p.manufacturerModel === 'Netac NV5000 2000 GB');
  assert.ok(nv5000);
  assert.equal(nv5000.identityKind, 'manufacturer-model');
  for (const p of Object.values(products).filter(p => /^Addlink G55H? /.test(p.manufacturerModel ?? ''))) {
    assert.equal(p.fieldEvidence?.read, undefined);
    assert.equal(p.fieldEvidence?.write, undefined);
  }
});

test('every field has retained textual evidence independent of raw PDF/image downloads', () => {
  const audit = JSON.parse(readFileSync(new URL('../data/deep-review/storage-other/coverage.json', import.meta.url), 'utf8')) as { records: { id: string; sourceKeys: string[] }[] };
  for (const record of audit.records) {
    const docs = record.sourceKeys.map(key => JSON.parse(readFileSync(new URL(`../data/deep-review/storage-other/proofs/${key}.json`, import.meta.url), 'utf8')) as { url: string; text: string });
    assert.ok(docs.every(d => d.text.length > 30 && d.url.startsWith('https://')), record.id);
    for (const field of Object.values(products[record.id].fieldEvidence ?? {})) {
      assert.ok(docs.some(d => d.url === field.sourceURL), `${record.id}: proof missing from audit`);
    }
  }
});
