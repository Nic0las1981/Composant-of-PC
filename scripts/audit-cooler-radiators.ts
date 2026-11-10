import assert from 'node:assert/strict';
import fs from 'node:fs';
import {catalog} from '../src/data/catalog.ts';
import {verifiedProducts} from '../src/data/verifiedCatalog.ts';
import {comprehensivePowerChassisRecords} from '../src/data/comprehensivePowerChassis.ts';
// Reviewed physical radiator length, width, bare thickness. These are not fan,
// pump or packaging dimensions. Retailer axis labels vary across products.
const expected:Record<string,[string,number,number,number,string]>={
 'cooler-h100i240':['CW-9060068-WW',277,120,27,'data/evidence/retailer-cooler-h100i240.json'],
 'cooler-h150i360':['CW-9060070-WW',397,120,27,'data/evidence/retailer-cooler-h150i360.json'],
 'cooler-ls520240':['R-LS520-BKAMNT-G-1',282,120,27,'data/evidence/retailer-cooler-ls520240.json'],
 'cooler-ls720360':['FC-DC-LS720-BK',402,120,27,'data/evidence/retailer-cooler-ls720360.json'],
 'cooler-h170i-lcd-420':['CW-9060076-WW',457,140,27,'data/evidence/retailer-cooler-h170i-lcd-420.json'],
 'cooler-lfiii240':['ACFRE00134A',277,120,38,'data/comprehensive-review/power-chassis-evidence/arctic-240.json'],
 'cooler-lfiii280':['ACFRE00135A',317,138,38,'data/comprehensive-review/power-chassis-evidence/arctic-280.json'],
 'cooler-lfiii360':['ACFRE00136A',398,120,38,'data/comprehensive-review/power-chassis-evidence/arctic-360.json'],
 'cooler-lfiii420':['ACFRE00137A',458,138,38,'data/comprehensive-review/power-chassis-evidence/arctic-420.json'],
 'cooler-lfiii360-argb-white':['ACFRE00152A',398,120,38,'data/comprehensive-review/power-chassis-evidence/arctic-360-white.json'],
 'cooler-kraken240':['RL-KN240-B1',275,123,30,'data/comprehensive-review/power-chassis-evidence/kraken2023.json'],
 'cooler-kraken360':['RL-KN360-B1',394,121,30,'data/comprehensive-review/power-chassis-evidence/kraken2023.json'],
 'cooler-silentloop2-360':['BW012',394,120,27,'data/comprehensive-review/power-chassis-evidence/bequiet-silentloop2-360.json'],
 'cooler-ek-nucleus360':['3831109851685',400,124,27,'data/comprehensive-review/power-chassis-evidence/ek-nucleus-cr360.json'],
};
const products=catalog.filter(c=>c.category==='cooler').map(base=>{
 const v=comprehensivePowerChassisRecords[base.id]??verifiedProducts[base.id];
 const c={...base,...v?.patch};
 if(c.coolingType!=='aio'){
  assert.equal(c.radiatorLengthMm,undefined,`${c.id}: air cooler must not inherit an AIO radiator`);
  assert.equal(c.radiatorWidthMm,undefined,`${c.id}: air cooler must not inherit an AIO radiator`);
  return {id:c.id,name:c.name,status:'not_applicable_air_cooler'};
 }
 const e=expected[c.id];assert.ok(e,`${c.id}: radiator needs its own exact source review`);
 const [mpn,...dimensions]=e;
 assert.equal(v.mpn,mpn,`${c.id}: model identity changed`);
 assert.deepEqual([c.radiatorLengthMm,c.radiatorWidthMm,c.radiatorThicknessMm],dimensions.slice(0,3),`${c.id}: radiator dimensions differ from the individual source review`);
 assert.ok(c.radiatorLengthMm!>c.radiatorSizeMm!,`${c.id}: nominal size used as physical length`);
 assert.ok(c.radiatorThicknessMm!<c.radiatorWidthMm!,`${c.id}: a radiator axis was used as thickness`);
 assert.ok(fs.existsSync(new URL('../'+e[4],import.meta.url)),`${c.id}: source evidence is missing`);
 return {id:c.id,name:c.name,mpn,status:'source_dimensions_confirmed',radiatorLengthMm:c.radiatorLengthMm,radiatorWidthMm:c.radiatorWidthMm,radiatorThicknessMm:c.radiatorThicknessMm,evidence:e[4]};
});
assert.equal(products.length,25);assert.equal(products.filter(c=>c.status==='source_dimensions_confirmed').length,14);
for(const id of ['cooler-kraken240','cooler-kraken360'])assert.equal(comprehensivePowerChassisRecords[id].patch.heightMm,55.97);
assert.equal(comprehensivePowerChassisRecords['cooler-silentloop2-360'].patch.heightMm,54);
assert.equal(comprehensivePowerChassisRecords['cooler-ek-nucleus360'].patch.heightMm,61.6);
fs.writeFileSync(new URL('../data/comprehensive-review/cooler-radiators.json',import.meta.url),JSON.stringify({checkedAt:new Date().toISOString(),reviewed:25,aio:14,air:11,products},null,2));
console.log('25 coolers checked: 14 exact radiator triples, 11 air coolers; pump dimensions kept separate.');
