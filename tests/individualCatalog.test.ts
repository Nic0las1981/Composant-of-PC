import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,getComponent,defaultSelection} from '../src/data/catalog.ts';
import {individualProducts} from '../src/data/individualCatalog.ts';
import {verifiedProducts} from '../src/data/verifiedCatalog.ts';
import {getVerifiedOffer} from '../src/lib/verifiedOffers.ts';
import {analyzeBuild} from '../src/lib/compatibility.ts';
import {getMissingCompatibilityFields} from '../src/lib/componentCoverage.ts';

test('individual reviews retain exact identities and manufacturer evidence for each saved ID',()=>{
  assert.ok(Object.keys(individualProducts).length>=27);
  for(const [id,product] of Object.entries(individualProducts)){
    const c=getComponent(id)!;assert.ok(c,id);
    assert.equal(c.manufacturerPartNumber,product.mpn,id);
    assert.ok(product.sources.some(s=>s.kind==='manufacturer'),id);
    assert.equal(catalog.filter(v=>v.id===id).length,1);
    for(const offer of product.offers){assert.equal(offer.mpn,product.mpn,id);assert.ok(offer.seller);assert.ok(offer.amount>0);}
  }
});

test('the selected board and memory now inform compatibility while unpublished GPU board power stays unknown',()=>{
  const ids={motherboard:'import-mb-fd057324a4a8',gpu:'import-gpu-a682aa002297',ram:'import-ram-8b162aa67690',storage:'import-ssd-8a91162ac077',psu:'import-psu-3f7709be66e0'};
  assert.equal(getComponent(ids.motherboard)?.m2Slots,4);
  assert.equal(getComponent(ids.motherboard)?.maxMemoryGB,256);
  assert.equal(getComponent(ids.ram)?.memoryProfile,'EXPO/XMP');
  assert.equal(getComponent(ids.ram)?.memoryEcc,false);
  for(const key of ['motherboard','ram','storage','psu'] as const)assert.deepEqual(getMissingCompatibilityFields(getComponent(ids[key])!),[],key);
  assert.equal(getComponent(ids.gpu)?.powerW,undefined);
  const analysis=analyzeBuild({...defaultSelection,...ids});
  assert.ok(!analysis.warnings.some(w=>w.id==='storage-slot-unknown'));
  assert.ok(analysis.warnings.some(w=>w.id==='power-unknown'));
  const partial=analysis.warnings.find(w=>w.id==='catalog-partial')!;
  assert.match(partial.description,/puissance de référence/);
  assert.doesNotMatch(partial.description,/B850 Steel Legend|Pro Overclocking|9100 PRO|Power Zone/);
});

test('an out-of-stock 8 GB card never borrows the price of its available 16 GB sibling',t=>{
  const ids=['import-gpu-a682aa002297','import-gpu-a12582346528'];
  const saved=ids.map(id=>verifiedProducts[id]);
  for(const id of ids)verifiedProducts[id]=individualProducts[id];
  t.after(()=>ids.forEach((id,i)=>{verifiedProducts[id]=saved[i];}));
  const gpu=getComponent('import-gpu-a682aa002297')!;
  const checked=Math.max(...Object.values(individualProducts).flatMap(p=>p.offers.map(o=>Date.parse(o.checkedAt))))+1000;
  t.mock.method(Date,'now',()=>checked);
  assert.equal(getVerifiedOffer(gpu),undefined);
  assert.ok(getVerifiedOffer(getComponent('import-gpu-a12582346528')!));
});
