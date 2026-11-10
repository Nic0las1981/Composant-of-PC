import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { deepStorageInlandProducts } from '../src/data/deepStorageInlandCatalog.ts'
const rows = (id: string) => Object.fromEntries(deepStorageInlandProducts[id].groups.flatMap(g => g.rows).map(r => [r.label, r.value]))

test('Inland references preserve ambiguous manufacturer part numbers without US prices', () => {
  const audit = JSON.parse(readFileSync(new URL('../data/deep-review/storage-inland/review.json', import.meta.url), 'utf8'))
  assert.equal(audit.length, 20)
  assert.equal(new Set(audit.map((r: { id: string }) => r.id)).size, 20)
  assert.equal(Object.keys(deepStorageInlandProducts).length, 17)
  for (const id of ['import-ssd-d8546f98e015', 'import-ssd-4df3b6c6b2ea', 'import-ssd-195af8da4a63']) assert.equal(deepStorageInlandProducts[id], undefined)
  for (const record of Object.values(deepStorageInlandProducts)) {
    assert.ok(record.mpn)
    assert.deepEqual(record.offers, [])
    assert.equal(record.patch.heightMm, undefined)
    assert.equal(record.patch.lengthMm, undefined)
    assert.ok(record.sources.every(s => s.url.startsWith('https://www.microcenter.com/')))
  }
})

test('Inland capacity-specific rates and malformed primary numbers are kept distinct', () => {
  const one = rows('import-ssd-78b79a537b8b'), two = rows('import-ssd-a9e8d9ce33e8')
  assert.equal(one['Écriture séquentielle maximale annoncée'], 'Up to 6,100MBps')
  assert.equal(two['Écriture séquentielle maximale annoncée'], 'Up to 6,400MBps')
  assert.equal(one.Endurance, '600 TBW')
  assert.equal(two.Endurance, '1,200 TBW')
  assert.equal(rows('import-ssd-e59b50a02686')['Écriture séquentielle maximale annoncée'], undefined)
  assert.equal(rows('import-ssd-3be5e55dc92c')['Écriture aléatoire 4K annoncée'], undefined)
  assert.equal(deepStorageInlandProducts['import-ssd-deb11aa6119e'].patch.storageHeatsink, true)
  assert.equal(deepStorageInlandProducts['import-ssd-3cf5c8638530'].patch.widthMm, undefined)
  assert.ok(rows('import-ssd-3cf5c8638530')['Dimensions de la boîte (L × P × H)'])
})
