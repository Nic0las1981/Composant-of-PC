import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {deepPowerFollowupProducts as products} from '../src/data/deepPowerFollowupCatalog.ts';
import {getComponent} from '../src/data/catalog.ts';
import {getCatalogCompletion} from '../src/lib/catalogCompletion.ts';

test('follow-up rows have exact-model provenance without invented regional offers',()=>{
 const provenance=JSON.parse(readFileSync(new URL('../data/deep-review/power-followup/fact-provenance.json',import.meta.url),'utf8'));
 for(const [id,p] of Object.entries(products)){
  assert.equal(p.identityKind,'manufacturer-model',id);
  assert.equal(p.mpn,'',id);assert.equal(p.offers.length,0,id);
  assert.ok(p.sources.some(s=>s.kind==='manufacturer'),id);
  assert.equal(p.patch.manufacturerModel,p.manufacturerModel,id);
  assert.ok(provenance.some((r:{id:string;facts:unknown[]})=>r.id===id&&r.facts.length===p.groups[0].rows.length),id);
  for(const proof of Object.values(p.fieldEvidence??{}))assert.ok(p.sources.some(s=>s.url===proof.sourceURL),id);
 }
});
test('manufacturer contradictions stay unresolved in the actual completion checklist',()=>{
 for(const [id,keys] of [
  ['import-psu-0ba178dea730',['fan']],
  ['import-psu-df55b3d86f94',['fan']],
  ['import-psu-7aac927c4e34',['fan']],
  ['import-psu-dc2ade159acd',['depth','fan','warranty']],
  ['import-psu-8e31c7e8c0d6',['depth','fan','warranty']],
 ] as const){
  const p=products[id],c={...getComponent(id)!,...p.patch};
  const completion=getCatalogCompletion(c,p);
  for(const key of keys)assert.equal(completion.technical.fields.find(f=>f.key===key)?.state,'conflicting',`${id}: ${key}`);
  assert.equal(p.patch.fanSizeMm,undefined,id);
 }
});
test('Seasonic 1300W gets its own PDF rail table, not the duplicated 1600W web table',()=>{
 const p=products['import-psu-b86b2b01b644'];
 assert.equal(p.patch.wattage,1300);
 assert.ok(p.groups[0].rows.some(r=>r.label==='Puissance du rail +12 V'&&r.value==='1296 W'));
 assert.ok(p.groups[0].rows.some(r=>r.label==='Courant maximal +12 V'&&r.value==='108 A'));
 assert.ok(p.groups[0].rows.some(r=>r.label==='Connecteurs'&&r.value.includes('12V-2x6 : 1')));
 const noctua=products['import-psu-b3055b03c103'];
 assert.equal(noctua.patch.fanSizeMm,120);
 assert.equal(products['import-psu-2ad0213cf3d9'].patch.fanSizeMm,135);
});
test('peak capacity, uncertified regional identities and unresolved generations remain separate',()=>{
 const p=products['import-psu-622b6e416594'];
 assert.equal(p.patch.wattage,1200);
 assert.ok(p.groups[0].rows.some(r=>r.label==='Puissance de crête (distincte du continu)'&&r.value==='1320W'));
 assert.equal(products['psu-sf750'],undefined);
 assert.equal(products['import-psu-8caaaacd6b57'],undefined);
 assert.equal(products['import-psu-f5ace90ff6c8'],undefined);
 assert.equal(products['import-psu-1d23af9c6a57'],undefined);
 const tx=products['import-psu-62d5db17afa1'];
 assert.equal(tx.mpn,'');assert.ok(tx.groups[0].rows.some(r=>r.value==='CMPSU-650TXV2EU'));
});
test('power-specific connector inventories distinguish CX-M 2021 wattages and RMi models',()=>{
 const cx550=products['import-psu-069bc31fb3e0'],cx750=products['import-psu-624d0d558c50'];
 assert.ok(cx550.groups[0].rows.some(r=>r.label==='Connecteurs'&&r.value.includes('SATA : 6')));
 assert.ok(cx750.groups[0].rows.some(r=>r.label==='Connecteurs'&&r.value.includes('SATA : 4')));
 assert.equal(products['import-psu-6c0d9910ad5f'].patch.depthMm,160);
 assert.equal(products['import-psu-d516d688b89a'].patch.depthMm,180);
 assert.equal(products['import-psu-97655e646272'].patch.heightMm,63.5);
});
