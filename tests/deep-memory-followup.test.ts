import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { deepMemoryStorageProducts } from '../src/data/deepMemoryStorageCatalog.ts';
import { deepMemoryFollowupProducts } from '../src/data/deepMemoryFollowupCatalog.ts';

const folder = new URL('../data/deep-review/', import.meta.url);
const read = (relative: string) => JSON.parse(readFileSync(new URL(relative, folder), 'utf8'));
const inputs = JSON.parse(gunzipSync(readFileSync(new URL('memory-storage/input.json.gz', folder))).toString());
const components = new Map(inputs.map((row: any) => [row.component.id, row.component]));
const fieldAudit = read('memory-followup/field-audit.json');
const identities = read('memory-followup/identity-audit.json');
const intersections = read('memory-followup/model-intersections.json');
const identityKeys = ['memoryType', 'capacityGB', 'memorySticks', 'memorySpeedMTs', 'casLatency'];
const published = read('memory-storage/published-identity-index.json');

test('followup preserves existing identities, offers and explicitly unknown runtime fields', () => {
  let count = 0;
  for (const [id, product] of Object.entries(deepMemoryFollowupProducts)) {
    const original = deepMemoryStorageProducts[id];
    if (!original) continue;
    count++;
    assert.equal(product.mpn, original.mpn, id);
    assert.equal(product.identityKind, original.identityKind, id);
    assert.deepEqual(product.offers, original.offers, id);
    assert.deepEqual(product.notes, original.notes, id);
    for (const [key, value] of Object.entries(original.patch)) {
      // A previously unknown profile can become known only through new evidence.
      const addition = fieldAudit.find((row: any) => row.id === id && row.field === key);
      if (!addition) assert.deepEqual((product.patch as any)[key], value, `${id}: ${key}`);
      else assert.equal(value, undefined, `${id}: overwrite of an already known ${key}`);
    }
    assert.deepEqual(product.groups.slice(0, original.groups.length), original.groups, id);
    for (const source of original.sources) assert.ok(product.sources.some(s => s.url === source.url), id);
  }
  assert.ok(count > 1000);
});

test('all added fields have matching evidence for every candidate and use manufacturer sources', () => {
  for (const row of fieldAudit) {
    const product = deepMemoryFollowupProducts[row.id];
    assert.ok(product, row.id);
    assert.deepEqual((product.patch as any)[row.field], row.value, row.id);
    assert.deepEqual(product.fieldEvidence?.[row.field]?.value, row.value, row.id);
    assert.equal(row.proofs.length, row.candidateMPNs.length, row.id);
    for (const proof of row.proofs) {
      assert.deepEqual(proof.value, row.value, `${row.id}: candidate mismatch`);
      assert.ok(product.sources.some(s => s.url === proof.sourceURL && s.kind === 'manufacturer'), row.id);
      assert.ok(proof.checkedAt && proof.reason.includes('Passage fabricant'), row.id);
    }
  }
});

test('new Royal Neo identities require exact generation, kit, capacity, rate, CAS and finish', () => {
  assert.equal(identities.length, 13);
  for (const row of identities) {
    const component: any = components.get(row.id);
    const product = deepMemoryFollowupProducts[row.id];
    assert.ok(component.name.startsWith('Trident Z5 Royal Neo RGB '));
    assert.ok(row.aliasEvidence.quote.includes('customizable RGB lighting'));
    for (const offer of product.offers) assert.equal(offer.mpn, product.mpn, row.id);
    for (const mpn of row.candidateMPNs) {
      const candidate = published['G.Skill'].find((r: any) => r.mpn === mpn);
      assert.equal(candidate.family, 'Trident Z5 Royal Neo', mpn);
      assert.deepEqual(candidate.colors, [row.finish], mpn);
      for (const key of identityKeys) assert.equal(candidate.patch[key], component[key], `${mpn}: ${key}`);
    }
    if (product.mpn) assert.deepEqual(row.candidateMPNs, [product.mpn], row.id);
    else assert.ok(row.candidateMPNs.length > 1, row.id);
  }
});

test('new offers bind live TTC, EUR, new condition and stock to the identical MPN', () => {
  const priceRecords = read('memory-followup/prices.json');
  for (const product of Object.values(deepMemoryFollowupProducts)) {
    if (!identities.some((r: any) => r.mpn === product.mpn && product.mpn)) continue;
    for (const offer of product.offers) {
      const rec = priceRecords.find((r: any) => !r.error && r.offer?.mpn === offer.mpn && r.url === offer.url);
      assert.ok(rec, offer.mpn);
      assert.equal(offer.amount, rec.offer.amount);
      assert.equal(offer.checkedAt, rec.checkedAt);
      assert.equal(offer.currency, 'EUR');
      assert.equal(offer.market, 'FR');
      assert.equal(offer.condition, 'new');
      assert.equal(offer.availability, 'in_stock');
      assert.equal(rec.evidence.condition, 'http://schema.org/NewCondition');
      assert.equal(rec.evidence.availability, 'http://schema.org/InStock');
      assert.equal(rec.evidence.literalMPN, offer.mpn);
      assert.ok(rec.evidence.visibleTTC.includes('€'));
      assert.ok(rec.evidence.merchantUpdatedAtLocal);
      assert.equal(offer.shipping, null);
      const raw = gunzipSync(readFileSync(new URL('../' + rec.file, import.meta.url)));
      assert.equal(createHash('sha256').update(raw).digest('hex'), rec.sha256);
    }
  }
  for (const rec of priceRecords.filter((r: any) => r.error)) {
    const products = Object.values(deepMemoryFollowupProducts).filter(p => p.mpn === rec.mpn);
    assert.ok(products.every(p => p.offers.every(offer => offer.url !== rec.url)), rec.mpn);
  }
});

test('ambiguous revisions retain only their common facts and no price or sales MPN', () => {
  assert.equal(intersections.length, 4);
  for (const row of intersections) {
    const product = deepMemoryFollowupProducts[row.id];
    assert.equal(product.identityKind, 'manufacturer-model');
    assert.equal(product.mpn, '');
    assert.equal(product.patch.manufacturerPartNumber, undefined);
    assert.deepEqual(product.offers, []);
    for (const field of row.clearTypedFields) assert.equal((product.patch as any)[field], undefined, `${row.id}: ${field}`);
    for (const proofs of Object.values(row.candidateProofs) as any[][]) {
      assert.ok(proofs.length > 1);
      assert.ok(proofs.every(p => JSON.stringify(p.value) === JSON.stringify(proofs[0].value)));
    }
  }
});

test('generic caution text cannot promote DDR4 to EXPO; conditional DDR5 profiles honor the exact speed', () => {
  for (const row of fieldAudit.filter((r: any) => r.field === 'memoryProfile')) {
    const component: any = components.get(row.id);
    if (component.memoryType === 'DDR4') assert.ok(['XMP', 'JEDEC'].includes(row.value), row.id);
    for (const proof of row.proofs) {
      if (proof.reason.includes('tranche de débit')) {
        assert.ok(component.memorySpeedMTs <= 8000 || component.memorySpeedMTs >= 8200);
        assert.equal(row.value, component.memorySpeedMTs >= 8200 ? 'XMP' : 'EXPO/XMP', row.id);
      }
      if (row.value === 'JEDEC') assert.ok(proof.reason.includes('OC Profile Support: None; Tested Speed (SPD):'));
    }
  }
  for (const quarantine of read('memory-storage/quarantine.json')) {
    if (!deepMemoryStorageProducts[quarantine.id]) assert.equal(deepMemoryFollowupProducts[quarantine.id], undefined);
  }
});
