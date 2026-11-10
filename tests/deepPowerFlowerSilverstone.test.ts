import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { deepPowerFlowerProducts as flower } from '../src/data/deepPowerFlowerCatalog.ts';
import { deepPowerSilverstoneProducts as silver } from '../src/data/deepPowerSilverstoneCatalog.ts';

test('every researched PSU has one audit state and every canonical dimension has direct evidence', () => {
  for (const [folder, products] of [['power-flower', flower], ['power-silverstone', silver]] as const) {
    const base = new URL(`../data/deep-review/${folder}/`, import.meta.url);
    const input = JSON.parse(readFileSync(new URL('input.json', base), 'utf8'));
    const review = JSON.parse(readFileSync(new URL('review.json', base), 'utf8'));
    assert.equal(new Set(review.map((r: {id: string}) => r.id)).size, input.length);
    assert.equal(review.length, input.length);
    for (const [id, p] of Object.entries(products)) {
      assert.ok(p.sources.length, id);
      assert.ok(p.sources.every(s => s.url.startsWith('https://')), id);
      assert.equal(p.offers.length, 0, 'No foreign price may become a French offer');
      assert.equal(p.patch.powerW, undefined, id);
      for (const field of ['depthMm', 'widthMm', 'heightMm', 'fanSizeMm', 'fanCount', 'wattage'] as const) {
        if (p.patch[field] === undefined) continue;
        assert.equal(p.patch[field], p.fieldEvidence?.[field]?.value, `${id}: ${field}`);
        assert.ok(p.sources.some(s => s.url === p.fieldEvidence?.[field]?.sourceURL), id);
      }
    }
  }
});

test('color, generation and reused-code hazards cannot receive nearby PSU data', () => {
  assert.equal(flower['import-psu-29c261f6fd2a'], undefined, 'White 1200 MP cannot receive the black MP source');
  assert.equal(flower['import-psu-307a17729758'], undefined, 'Original VII XG cannot inherit ATX3.1 update');
  assert.equal(flower['import-psu-714f2bb9086b'].patch.depthMm, undefined, 'Ambiguous JP axes stay unknown');
  assert.equal(flower['import-psu-8ce26f417fc5'].patch.depthMm, 180, 'Original SE1200 axes are separately documented');
  assert.equal(silver['import-psu-c5e888b7db60'], undefined, 'HELA850 PM versus PMA remains ambiguous');
  assert.equal(silver['import-psu-5e51825e324c'], undefined, 'ST50F-P versus PB is not a proven alias');
});

test('white codes and fanless cooling remain exact', () => {
  assert.equal(silver['import-psu-71ed5bfaffca'].mpn, 'SST-DA750R-GMA-WWW');
  assert.equal(silver['import-psu-3dd670f97215'].mpn, 'SST-DA750R-GMA');
  assert.equal(flower['import-psu-0b3f9f60aeab'].patch.fanCount, 0);
  assert.equal(silver['import-psu-fbd2d4ca7b22'].patch.fanCount, 0);
});
