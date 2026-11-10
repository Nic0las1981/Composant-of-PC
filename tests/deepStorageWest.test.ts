import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { deepStorageWestProducts as products } from '../src/data/deepStorageWestCatalog';
import { getCatalogCompletion } from '../src/lib/catalogCompletion';
import type { Component } from '../src/data/catalog';

const inputs = JSON.parse(readFileSync('data/deep-review/storage-west/input.json','utf8')) as Array<{component:Component,verified?:{mpn:string,offers:unknown[]}}>;
const reviews = JSON.parse(readFileSync('data/deep-review/storage-west/per-id-review.json','utf8')) as Array<{id:string,documented:number,missing:string[]}>;

test('all 147 assigned SSDs have an individual sourced review and runtime-comparable evidence',()=>{
  assert.equal(inputs.length,147);
  assert.deepEqual(Object.keys(products).sort(),inputs.map(x=>x.component.id).sort());
  for(const {component} of inputs){
    const p=products[component.id];
    const review=reviews.find(r=>r.id===component.id)!;
    assert.ok(review);
    assert.ok(p.sources.length);
    assert.ok(p.groups.flatMap(g=>g.rows).length>=7);
    const evaluated=getCatalogCompletion({...component,...p.patch},p);
    assert.equal(evaluated.technical.documented,review.documented,component.id);
    assert.deepEqual(evaluated.technical.fields.filter(f=>f.state!=='documented').map(f=>f.key).sort(),review.missing.slice().sort(),component.id);
    assert.ok(evaluated.identity.matchedPrimaryRecord,component.id);
    assert.notEqual(evaluated.status,'identity_missing',component.id);
    for(const evidence of Object.values(p.fieldEvidence!)){
      assert.ok(p.sources.some(s=>s.url===evidence.sourceURL));
      assert.ok(Number.isFinite(Date.parse(evidence.checkedAt)));
    }
    for(const key of ['lengthMm','widthMm','heightMm'] as const){
      if(p.patch[key]!==undefined)assert.ok(Number.isFinite(p.patch[key])&&p.patch[key]!>0,component.id+' '+key);
    }
  }
});

test('capacity corrections update identity, visible text and machine-readable capacity together',()=>{
  const corrections=JSON.parse(readFileSync('data/deep-review/storage-west/corrections.json','utf8')) as Array<{id:string,newValue:number,oldValue:number}>;
  assert.equal(corrections.length,11);
  for(const c of corrections){
    const p=products[c.id];
    assert.equal(p.patch.capacityGB,c.newValue);
    assert.match(p.patch.name!,new RegExp(String(c.newValue)));
    assert.ok(p.patch.specs?.includes(c.newValue+' Go'));
    assert.ok(p.patch.description?.includes(c.newValue+' Go'));
    assert.equal(p.fieldEvidence?.capacity.value,c.newValue);
  }
  assert.equal(products['import-ssd-89e474c302d3'].patch.capacityGB,512);
  assert.equal(products['import-ssd-8dad44f1b98b'].patch.capacityGB,4096);
});

test('bare, heatsink, graphene and revision-specific SSDs retain different mechanical facts',()=>{
  assert.equal(products['ssd-sn850x-4'].patch.heightMm,3.88);
  assert.equal(products['import-ssd-e45a31ed1c23'].patch.heightMm,10.31);
  assert.equal(products['import-ssd-e45a31ed1c23'].patch.storageHeatsink,true);
  assert.equal(products['ssd-sn850x-4'].patch.storageHeatsink,false);
  assert.equal(products['import-ssd-750788872ce5'].patch.heightMm,2.42);
  assert.equal(products['import-ssd-750788872ce5'].fieldEvidence?.heatsink.value,'Film graphène');
  assert.equal(products['import-ssd-fa2c155af873'].patch.heightMm,9.2);
  assert.equal(products['import-ssd-398813e3babf'].fieldEvidence?.endurance.value,850);
  assert.equal(products['import-ssd-ed8facf42ea6'].fieldEvidence?.endurance.value,300);
  assert.equal(products['import-ssd-e139b9b85dc5'].patch.lengthMm,80.15);
  assert.equal(products['import-ssd-fb7ab87c53c3'].patch.lengthMm,80.85);
});

test('ambiguous Game Drive revisions and OEM unknowns do not acquire fabricated measurements or prices',()=>{
  for(const id of ['import-ssd-b97811d8a0ba','import-ssd-b5760a34b49c']){
    const p=products[id];assert.equal(p.mpn,'');assert.equal(p.identityKind,'manufacturer-model');
    for(const key of ['height','length','width','read','write','endurance'])assert.equal(p.fieldEvidence?.[key],undefined);
    assert.equal(p.patch.heightMm,undefined);assert.deepEqual(p.offers,[]);
  }
  for(const [id,p] of Object.entries(products)){
    assert.equal(p.patch.price,undefined,id);
    if(!p.mpn){assert.equal(p.identityKind,'manufacturer-model');assert.ok(p.manufacturerModel);assert.deepEqual(p.offers,[]);}
    for(const o of p.offers){assert.equal(o.mpn,p.mpn);assert.ok(inputs.find(x=>x.component.id===id)?.verified?.offers.some(old=>JSON.stringify(old)===JSON.stringify(o)));}
  }
  assert.match(products['import-ssd-01c097994185'].mpn,/^SDSSDX3N-/);
  assert.equal(products['import-ssd-01c097994185'].offers.length,0);
});

test('capacity-specific write rates and NAND never inherit the maximum of a sibling',()=>{
  assert.equal(products['import-ssd-c272d5db895f'].fieldEvidence?.write.value,5200);
  assert.equal(products['import-ssd-7b5a1ef50352'].fieldEvidence?.write.value,6500);
  assert.equal(products['import-ssd-e66e5c0fe653'].fieldEvidence?.write.value,6200);
  assert.equal(products['import-ssd-1b4e4e94425a'].fieldEvidence?.write.value,6500);
  assert.equal(products['import-ssd-7e882857585e'].fieldEvidence?.write.value,6700);
  assert.match(String(products['import-ssd-3819ecb84110'].fieldEvidence?.nand.value),/QLC/);
  assert.match(String(products['import-ssd-a511e58091d5'].fieldEvidence?.nand.value),/TLC/);
  assert.equal(products['import-ssd-a1d56d8b9c72'].fieldEvidence?.write.value,12900);
  assert.equal(products['import-ssd-a7ffcea238d9'].fieldEvidence?.write.value,13400);
});
