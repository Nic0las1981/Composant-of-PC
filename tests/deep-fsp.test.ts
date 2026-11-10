import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {deepFspProducts as products} from '../src/data/deepFspCatalog';
import {getCatalogCompletion} from '../src/lib/catalogCompletion';
import type {Component} from '../src/data/catalog';
const inputs=JSON.parse(readFileSync('data/deep-review/power-fsp/input.json','utf8')) as Component[];
test('FSP accounts for every archive ID and keeps mixed SAGA400R excluded',()=>{
 assert.equal(inputs.length,109);assert.equal(Object.keys(products).length,108);
 assert.equal(products['import-psu-d87341eb8d2a'],undefined);
 for(const [id,p] of Object.entries(products)){
  assert.ok(inputs.some(c=>c.id===id));assert.deepEqual(p.offers,[]);
  for(const f of Object.values(p.fieldEvidence??{}))assert.ok(p.sources.some(s=>s.url===f.sourceURL));
 }
});
test('FSP colspan rail totals are not multiplied or shifted onto the wrong rail',()=>{
 const hexa=products['import-psu-9c8ac38c8f6a'];
 assert.match(String(hexa.fieldEvidence?.rail12v.value),/450W/);
 assert.doesNotMatch(String(hexa.fieldEvidence?.rail12v.value),/85W/);
 const aurum=products['import-psu-56d83744d144'];
 assert.match(String(aurum.fieldEvidence?.rail12v.value),/540W/);
 assert.match(String(aurum.fieldEvidence?.rail12v.value),/12V4/);
});
test('Literal ATX12V V3.1 and cable/connector counts are preserved without swapping ambiguous axes',()=>{
 const vita=products['import-psu-d1df7db503fe'];
 assert.equal(vita.fieldEvidence?.atx.value,'ATX 3.1');
 assert.match(String(vita.fieldEvidence?.connectors.value),/PCIe 6\+2 PIN : 2 cables ; 4 connectors/);
 const hexa=products['import-psu-9c8ac38c8f6a'];
 assert.equal(hexa.patch.heightMm,86);assert.equal(hexa.patch.depthMm,undefined);assert.equal(hexa.patch.widthMm,undefined);
});
test('HEXA source part number corrects the erroneous archive850W to650W everywhere displayed',()=>{
 const p=products['import-psu-f745fcb4b5a0'];
 assert.equal(p.patch.wattage,650);assert.equal(p.fieldEvidence?.power.value,650);
 for(const v of [p.patch.name,p.patch.description,p.patch.variantGroupName,...p.patch.specs??[]])assert.doesNotMatch(v??'',/850/);
 assert.ok(p.sources.some(s=>s.url.endsWith('/HEXA85plus650W.html')));
});
test('Unresolved HydroGen5 revision retains only shared facts and explicit conflicts',()=>{
 for(const id of ['import-psu-0a718842abf5','import-psu-1ba05c1ad19d','import-psu-df20477a2b1b']){
  const p=products[id];assert.equal(p.identityKind,'manufacturer-model');assert.equal(p.mpn,'');
  assert.equal(p.patch.depthMm,130);assert.equal(p.fieldEvidence?.atx.conflicting,true);
  assert.equal(p.fieldEvidence?.warranty,undefined);
  assert.ok(p.sources.some(s=>s.url.includes('_GEN5')));assert.ok(p.sources.some(s=>s.url.includes('_12V2X6')));
  const c=inputs.find(c=>c.id===id)!;const completion=getCatalogCompletion({...c,...p.patch},p);
  assert.equal(completion.status,'technical_missing');assert.equal(completion.technical.fields.find(f=>f.key==='atx')?.state,'conflicting');
 }
});
test('Nominal, maximum, disputed and OEM powers remain distinct',()=>{
 for(const id of ['import-psu-8033bbbfd4e0','import-psu-18b8aa77c8fb']){
  const p=products[id];assert.ok(Object.hasOwn(p.patch,'wattage'));assert.equal(p.patch.wattage,undefined);assert.equal(p.fieldEvidence?.power,undefined);assert.ok(p.sources.every(s=>s.kind==='retailer'));
 }
 const oem=products['import-psu-dfda1cc04099'];assert.equal(oem.mpn,'9PA6502502');assert.equal(oem.patch.wattage,650);
 assert.equal(products['import-psu-080ab2c7872e'].fieldEvidence?.connectors.conflicting,true);
});
