import test from 'node:test';
import assert from 'node:assert/strict';
import {deepStorageNicheProducts as products} from '../src/data/deepStorageNicheCatalog.ts';

test('Helix-L exact 512 GB keeps its identity while correcting the archived PCIe generation',()=>{
  const p=products['import-ssd-95436576acb9'];
  assert.equal(p.mpn,'MKNSSDHL512GB-D8');
  assert.equal(p.patch.capacityGB,512);
  assert.match(p.patch.name!,/PCIe 3\.0/);
  assert.equal(p.sources[0].kind,'retailer');
  assert.equal(p.offers.length,0);
});
test('GOODRAM only accepts capacities explicitly published for PX700',()=>{
  assert.equal(products['import-ssd-c75f6cec4fcf'],undefined);
  assert.equal(products['import-ssd-2b8e5572f024'].mpn,'SSDPR-PX700-01T-80');
  assert.equal(products['import-ssd-2b8e5572f024'].patch.capacityGB,1024);
});
test('Apacer heatsink variants and capacity-specific performance remain distinct',()=>{
  const q4=products['import-ssd-ca7f0d0cb1d1'],q4u=products['import-ssd-ecc3f1e15532'];
  assert.equal(q4.mpn,'AP500GAS2280Q4-1');
  assert.equal(q4u.mpn,'AP512GAS2280Q4U-1');
  assert.equal(q4.patch.heightMm,undefined);
  assert.equal(q4u.patch.heightMm,undefined);
  assert.ok(q4.groups[0].rows.some(r=>r.label==='Lecture séquentielle'&&r.value.startsWith('4500')));
  assert.ok(q4u.groups[0].rows.some(r=>r.label==='Lecture séquentielle'&&r.value.startsWith('7000')));
});
test('contradictory Mushkin endurance is not promoted to a validated technical row',()=>{
  const p=products['import-ssd-22096485fe97'];
  assert.match(p.notes.join(' '),/Endurance contradictoire/);
  assert.ok(!p.groups.flatMap(g=>g.rows).some(r=>r.label==='Endurance TBW'));
});
