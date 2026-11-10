import assert from 'node:assert/strict';
import test from 'node:test';
import {deepPowerChassisProducts as products} from '../src/data/deepPowerChassisCatalog.ts';

test('AMD maximum electrical power remains explicitly unknown after generation',()=>{
 const amd=Object.entries(products).filter(([id])=>/^cpu-(?:\d{4}x?3?d?|\d{4}f)$/.test(id)&&!id.endsWith('kf'));
 assert.equal(amd.length,20);
 for(const [id,p] of amd){assert.ok(Object.hasOwn(p.patch,'powerW'),id);assert.equal(p.patch.powerW,undefined,id);assert.equal(p.fieldEvidence?.electricalPower,undefined,id);}
});

test('model-only identities never masquerade as commercial MPNs or carry offers',()=>{
 for(const [id,p] of Object.entries(products)){
  if(p.identityKind==='manufacturer-model'){
   assert.equal(p.mpn,'',id);assert.ok(p.manufacturerModel,id);assert.equal(p.patch.manufacturerPartNumber,undefined,id);assert.equal(p.offers.length,0,id);
  }
  for(const [field,proof] of Object.entries(p.fieldEvidence??{})){
   assert.ok(p.sources.some(s=>s.url===proof.sourceURL),`${id}: ${field}`);
   assert.ok(Number.isFinite(Date.parse(proof.checkedAt)),`${id}: ${field}`);
  }
 }
});

test('white PSU finishes have their own exact manufacturer pages',()=>{
 const msi=products['import-psu-536f27135afe'];
 assert.match(msi.manufacturerModel??'',/WHITE/i);
 assert.ok(msi.sources.some(s=>/MPG-A750GF-WHITE/i.test(s.url)));
 for(const id of ['import-psu-28f99866c4a0','import-psu-735a38558da1','import-psu-be423f74e597','import-psu-5ce175916c0a','import-psu-a66e53ce62e5','import-psu-8f9f8b7b523f']){
  const p=products[id];assert.match(p.manufacturerModel??'',/White/);assert.ok(p.sources.some(s=>/white/.test(s.url)));
 }
});

test('radiator axes and pump heights retain the documented measurements',()=>{
 const h170=products['cooler-h170i-lcd-420'].patch;
 assert.equal(h170.radiatorLengthMm,457);assert.equal(h170.radiatorWidthMm,140);
 const silent=products['cooler-silentloop2-360'].patch;
 assert.equal(silent.radiatorLengthMm,394);assert.equal(silent.radiatorWidthMm,120);
 assert.equal(products['cooler-kraken240'].patch.heightMm,55.97);
 assert.equal(products['cooler-kraken360'].patch.radiatorWidthMm,121);
 assert.match(String(products['cooler-h150i360'].fieldEvidence?.noise.value),/par ventilateur/);
});

test('Cooler Master Peak names retain the lower continuous output for compatibility',()=>{
 for(const [id,watts] of [['import-psu-6a0c02dc2118',400],['import-psu-c7da5fe2dc33',500],['import-psu-9b2d872965a8',600],['import-psu-d03fb4aa08fe',700]] as const){
  const p=products[id];assert.equal(p.patch.wattage,watts,id);
  assert.ok(p.sources.some(s=>s.url.startsWith('https://coolermaster.egnyte.com/')),id);
  assert.match(p.patch.name??'',new RegExp(String(watts)+' W'),id);
 }
});
