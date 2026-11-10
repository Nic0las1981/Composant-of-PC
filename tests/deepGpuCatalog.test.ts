import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { deepGpuProducts } from '../src/data/deepGpuCatalog.ts'
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

test('every GPU has an explicit audit outcome and every published record has primary evidence', () => {
  const audit = JSON.parse(readFileSync(new URL('../data/deep-review/gpu/review.json', import.meta.url), 'utf8'))
  assert.equal(audit.length, 2474)
  assert.equal(new Set(audit.map((r: { id: string }) => r.id)).size, 2474)
  assert.deepEqual(new Set(audit.filter((r: { state: string }) => r.state === 'primary_specs_enriched').map((r: { id: string }) => r.id)), new Set(Object.keys(deepGpuProducts)))
  for (const [id, record] of Object.entries(deepGpuProducts)) {
    assert.ok(record.sources.some(s => s.kind === 'manufacturer' && /^https?:\/\//.test(s.url)), id)
    assert.ok(record.patch.description?.startsWith('Carte graphique '), id)
    assert.ok(record.groups.some(g => g.rows.length >= 5), id)
    if (record.identityKind === 'manufacturer-model') {
      assert.equal(record.mpn, '', id)
      assert.equal(record.patch.manufacturerPartNumber, undefined, id)
      assert.equal(record.patch.manufacturerModel, record.manufacturerModel, id)
      assert.deepEqual(record.offers, [], id)
    } else {
      assert.ok(record.mpn, id)
      for (const offer of record.offers) assert.equal(norm(offer.mpn), norm(record.mpn), `${id}: offer variant`)
    }
  }
})

test('Gainward Phantom and Phantom GS keep distinct SKUs and prices', () => {
  const standard = deepGpuProducts['import-gpu-cad23268683d']
  const gs = deepGpuProducts['import-gpu-e2fbd9598349']
  assert.equal(standard.mpn, 'NE75090019R5-GB2020P')
  assert.equal(gs.mpn, 'NE75090S19R5-GB2020P')
  assert.equal(standard.patch.lengthMm, 331.9)
  assert.ok(standard.offers.every(o => !o.url.includes('phantom-gs')))
})

test('ambiguous VRAM editions stay unresolved and PSU recommendations do not become GPU consumption', () => {
  assert.equal(deepGpuProducts['import-gpu-5a55cf09062f'], undefined)
  for (const id of ['import-gpu-a682aa002297', 'import-gpu-a12582346528']) {
    const card = deepGpuProducts[id]
    assert.ok(card.mpn.startsWith('90-'))
    assert.equal(card.patch.powerW, undefined)
    assert.equal(card.patch.recommendedPsuW, 550)
    assert.equal(card.patch.lengthMm, 298)
  }
  const pny = Object.values(deepGpuProducts).find(r => r.mpn === 'VCG407012TFXXPB1')
  assert.ok(pny)
  assert.equal(pny.patch.powerW, undefined)
  assert.ok(pny.groups.flatMap(g => g.rows).some(r => r.label === 'TDP' && r.value === '200 W'))
})

test('reference-card dimensions cite the correct physical document and PCB variants stay unknown', () => {
  const intel = deepGpuProducts['import-gpu-6778137361f8']
  assert.equal(intel.patch.lengthMm, 279.9)
  assert.equal(intel.patch.thicknessMm, 42)
  assert.match(intel.fieldEvidence!.lengthMm.sourceURL, /000092554/)
  assert.equal(intel.patch.powerW, 225)
  assert.equal(intel.identityKind, 'manufacturer-model')
  const revisions = deepGpuProducts['import-gpu-28623e30d7d6']
  assert.equal(revisions.patch.lengthMm, undefined)
  assert.equal(revisions.patch.heightMm, undefined)
  assert.equal(revisions.patch.thicknessMm, undefined)
  assert.ok(revisions.sources.some(s => /rev-10/.test(s.url)))
  assert.ok(revisions.sources.some(s => /rev-20/.test(s.url)))
  const hellhound = deepGpuProducts['import-gpu-7b72fe78ceb5']
  assert.equal(hellhound.patch.lengthMm, 340)
  assert.notEqual(hellhound.patch.fanCount, 2, 'two outer fans are a subset of the cooling system')
})
