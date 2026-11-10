import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { deepGpuProducts } from '../src/data/deepGpuCatalog.ts'
import { deepGpuFollowupProducts } from '../src/data/deepGpuFollowupCatalog.ts'

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

test('GPU followup only resolves previously unconfirmed IDs and retains all evidence', () => {
  const baseline = JSON.parse(readFileSync(new URL('../data/deep-review/gpu/review.json', import.meta.url), 'utf8')) as Array<{ id: string, state: string }>
  const states = new Map(baseline.map(r => [r.id, r.state]))
  const summary = JSON.parse(readFileSync(new URL('../data/deep-review/gpu-followup/summary.json', import.meta.url), 'utf8'))
  assert.equal(Object.keys(deepGpuFollowupProducts).length, summary.newProducts)
  for (const [id, record] of Object.entries(deepGpuFollowupProducts)) {
    assert.equal(states.get(id), 'exact_reference_unconfirmed', id)
    assert.equal(deepGpuProducts[id], undefined, `${id}: confirmed record must not be replaced`)
    assert.ok(record.sources.some(s => s.kind === 'manufacturer'), id)
    assert.ok(record.groups.some(g => g.rows.length >= 5), id)
    assert.ok(record.patch.description?.startsWith('Carte graphique '), id)
    for (const key of ['capacityGB', 'lengthMm', 'heightMm', 'thicknessMm', 'powerW', 'recommendedPsuW', 'fanCount', 'fanSizeMm']) {
      const value = (record.patch as Record<string, unknown>)[key]
      if (value !== undefined) {
        assert.equal(record.fieldEvidence?.[key]?.value, value, `${id}: ${key}`)
        assert.ok(record.sources.some(s => s.url === record.fieldEvidence![key].sourceURL), `${id}: ${key} exact source`)
      }
    }
    if (record.identityKind === 'manufacturer-model') {
      assert.equal(record.mpn, '', id)
      assert.equal(record.patch.manufacturerPartNumber, undefined, id)
      assert.equal(record.patch.manufacturerModel, record.manufacturerModel, id)
      assert.deepEqual(record.offers, [], id)
    }
    for (const offer of record.offers) assert.equal(norm(offer.mpn), norm(record.mpn), id)
  }
})

test('unknown GPU values explicitly clear any unverified values from imported archives', () => {
  const record = deepGpuFollowupProducts['import-gpu-72e143943502']
  const merged = { thicknessMm: 42, recommendedPsuW: 550, fanCount: 2, ...record.patch }
  assert.equal(record.mpn, 'VCNRTX2000ADA-PB')
  assert.equal(merged.lengthMm, 167.64)
  assert.equal(merged.heightMm, 68.58)
  assert.equal(merged.powerW, 70)
  assert.equal(merged.thicknessMm, undefined, 'two slots do not establish millimetres')
  assert.equal(merged.recommendedPsuW, undefined, 'board power does not establish system PSU')
  assert.equal(merged.fanCount, undefined, 'no invented cooling count')
})

test('revision-dependent clocks, mixed fan diameters, and ambiguous memory stay unclaimed', () => {
  const revision = deepGpuFollowupProducts['import-gpu-52e2aaa95b6b']
  assert.equal(revision.identityKind, 'manufacturer-model')
  assert.equal(revision.mpn, '')
  assert.ok(!revision.groups.flatMap(g => g.rows).some(r => r.label === 'Core Clock'))
  const mixed = deepGpuFollowupProducts['import-gpu-9cc835c8374c']
  assert.equal(mixed.patch.fanSizeMm, undefined)
  assert.notEqual(mixed.patch.fanCount, 2)
  assert.equal(deepGpuFollowupProducts['import-gpu-5a55cf09062f'], undefined)
  assert.equal(deepGpuFollowupProducts['import-gpu-f9e2f59cdd88'], undefined)
})

test('last LDLC price stays explicitly historical and discontinued', () => {
  const card = deepGpuFollowupProducts['import-gpu-f484f7fd45ed']
  assert.equal(card.mpn, 'GV-N5060EAGLEOC ICE-8GD')
  assert.equal(card.offers.length, 1)
  assert.equal(card.offers[0].amount, 529.95)
  assert.equal(card.offers[0].priceKind, 'last_known')
  assert.equal(card.offers[0].availability, 'discontinued')
})
