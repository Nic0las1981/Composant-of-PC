import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { deepPowerAntecProducts } from '../src/data/deepPowerAntecCatalog';
import { deepPowerEnermaxProducts } from '../src/data/deepPowerEnermaxCatalog';
import { catalogTechnicalRequirements, getCatalogCompletion } from '../src/lib/catalogCompletion';
import type { Component } from '../src/data/catalog';

const products={...deepPowerAntecProducts,...deepPowerEnermaxProducts};
const directory='data/deep-review/power-antec-enermax/';
const inputs=JSON.parse(readFileSync(directory+'input.json','utf8')) as Array<{component:Component}>;
const reviews=JSON.parse(readFileSync(directory+'per-id-review.json','utf8')) as Array<{id:string,status:string,reason?:string,confirmedFields?:number,missingFields?:string[],searches:unknown[]}>;

test('all 201 Antec/Enermax references have an individual result and runtime-comparable evidence',()=>{
  assert.equal(inputs.length,201);
  assert.deepEqual(reviews.map(r=>r.id).sort(),inputs.map(r=>r.component.id).sort());
  assert.equal(Object.keys(products).length,175);
  const fields=catalogTechnicalRequirements.psu.map(f=>f.key);
  for(const {component} of inputs){
    const review=reviews.find(r=>r.id===component.id)!;
    const p=products[component.id];
    if(!p){assert.equal(review.status,'unresolved');assert.ok(review.reason&&review.reason.length>70);assert.ok(review.searches.length>0);continue;}
    assert.equal(review.status,'documented');
    const result=getCatalogCompletion({...component,...p.patch},p);
    assert.equal(result.technical.documented,review.confirmedFields,component.id);
    assert.deepEqual(result.technical.fields.filter(f=>f.state!=='documented').map(f=>f.key).sort(),review.missingFields?.slice().sort(),component.id);
    assert.ok(result.identity.matchedPrimaryRecord,component.id);
    for(const [key,evidence] of Object.entries(p.fieldEvidence!)){
      assert.ok(fields.includes(key),key);
      assert.ok(p.sources.some(s=>s.url===evidence.sourceURL));
      assert.ok(Number.isFinite(Date.parse(evidence.checkedAt)));
    }
    for(const key of ['heightMm','widthMm','depthMm'] as const){if(p.patch[key]!==undefined)assert.ok(p.patch[key]!>0&&Number.isFinite(p.patch[key]));}
  }
});

test('combined rail limits and fixed cables are not inferred from summed rails or archive labels',()=>{
  for(const id of ['import-psu-0522a5094f64','import-psu-66d8a69f1f5f']){
    assert.equal(products[id].fieldEvidence?.modularity.value,'Semi-modulaire');
    assert.match(String(products[id].fieldEvidence?.rail12v.value),/^1200 W combinés/);
  }
  assert.match(String(products['import-psu-70003312dac4'].fieldEvidence?.rail12v.value),/^780 W/);
  assert.equal(products['import-psu-13d8d86ec1a3'].fieldEvidence?.modularity.value,'Semi-modulaire');
  assert.equal(products['import-psu-13d8d86ec1a3'].fieldEvidence?.connectors,undefined);
  for(const id of ['import-psu-2485451226e3','import-psu-3baccb9b4ac2']){
    assert.equal(products[id].fieldEvidence?.modularity.value,'Semi-modulaire');
    assert.equal(products[id].fieldEvidence?.efficiency.value,'80 PLUS Gold');
  }
});

test('passive cooling and asymmetric dual fans retain their actual counts',()=>{
  assert.equal(products['import-psu-d300c62f0ba2'].patch.fanCount,0);
  assert.equal(products['import-psu-d300c62f0ba2'].patch.fanSizeMm,undefined);
  for(const id of ['import-psu-06ac35d457f0','import-psu-f5d9aa2795d5','import-psu-8fdec519f6d5']){
    const p=products[id];assert.equal(p.patch.fanCount,2);assert.equal(p.patch.fanSizeMm,100);
    assert.match(String(p.fieldEvidence?.fan.value),/100 mm/);assert.match(String(p.fieldEvidence?.fan.value),/80 mm/);
  }
});

test('ATX generations and optional adapters remain distinct',()=>{
  assert.equal(products['import-psu-0ed8f511ff24'].fieldEvidence?.atx.value,'ATX12V 3.0');
  assert.equal(products['import-psu-0ed8f511ff24'].patch.depthMm,undefined);
  for(const id of ['import-psu-368f4dd8bfe5','import-psu-0882ea009bf6','import-psu-d6d76fe434c4']){
    assert.equal(products[id].fieldEvidence?.atx.value,'ATX 3.0');
    assert.doesNotMatch(String(products[id].fieldEvidence?.connectors.value),/12VHPWR/);
    assert.ok(products[id].notes.some(n=>n.includes('optionnel')));
  }
  for(const id of ['import-psu-b44f04c7f558','import-psu-daa58498b348','import-psu-d1aae254fb99','import-psu-3413026181ac'])assert.equal(products[id],undefined);
});

test('unknown regional part numbers and prices are not fabricated',()=>{
  for(const [id,p] of Object.entries(products)){
    assert.equal(p.patch.price,undefined,id);
    assert.deepEqual(p.offers,[],id);
    if(!p.mpn){assert.equal(p.identityKind,'manufacturer-model');assert.ok(p.manufacturerModel);assert.equal(p.patch.manufacturerPartNumber,undefined);}
    assert.doesNotMatch(p.mpn,/^[XV][0-9]{4}/);
  }
  assert.match(String(products['import-psu-8c22fb9df452'].fieldEvidence?.efficiency.value),/70 %/);
  assert.doesNotMatch(String(products['import-psu-8c22fb9df452'].fieldEvidence?.efficiency.value),/80 PLUS Bronze/);
});
