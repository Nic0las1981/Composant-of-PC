import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {deepStorageFollowupProducts as products} from '../src/data/deepStorageFollowupCatalog.ts';
import {getCatalogCompletion} from '../src/lib/catalogCompletion.ts';
import type {Component} from '../src/data/catalog.ts';
import type {VerifiedProduct} from '../src/data/verifiedTypes.ts';

const baseline=JSON.parse(gunzipSync(readFileSync('data/deep-review/storage-followup/baseline.json.gz')).toString()) as Array<{component:Component;product:VerifiedProduct|null}>;

test('SSD followup keeps exact identity and valid evidence for all admitted IDs',()=>{
  assert.equal(Object.keys(products).length,106);
  for(const [id,p] of Object.entries(products)){
    const before=baseline.find(b=>b.component.id===id)!;
    assert.ok(before,id);
    const result=getCatalogCompletion({...before.component,...p.patch},p);
    assert.ok(result.identity.matchedPrimaryRecord,id);
    assert.notEqual(result.status,'identity_missing',id);
    assert.ok(p.groups.flatMap(g=>g.rows).length>=7,id);
    for(const proof of Object.values(p.fieldEvidence??{})){
      assert.ok(p.sources.some(s=>s.url===proof.sourceURL),id+' '+proof.sourceURL);
      assert.ok(Number.isFinite(Date.parse(proof.checkedAt)),id);
    }
    assert.equal(p.patch.price,undefined,id);
    if(!before.product)assert.deepEqual(p.offers,[],id+' no foreign price accepted');
  }
});

test('existing TeamGroup records retain all source rows offers and patches',()=>{
  const enriched=Object.entries(products).filter(([id])=>baseline.find(b=>b.component.id===id)?.product);
  assert.equal(enriched.length,37);
  for(const [id,p] of enriched){
    const before=baseline.find(b=>b.component.id===id)!.product!;
    assert.deepEqual(p.offers,before.offers,id);
    assert.deepEqual(p.groups.slice(0,before.groups.length),before.groups,id);
    for(const s of before.sources)assert.ok(p.sources.some(now=>JSON.stringify(now)===JSON.stringify(s)),id);
    for(const [key,value] of Object.entries(before.patch)){
      if(key!=='storageHeatsink')assert.deepEqual(p.patch[key as keyof Component],value,id+' '+key);
    }
  }
});

test('graphene aluminum and AirFlow select distinct exact SKUs and mechanical envelopes',()=>{
  const graphene=products['import-ssd-a5cc5c3d6571'];
  const aluminum=products['import-ssd-d0619b3b4c53'];
  const airflow=products['import-ssd-5c17e3c47055'];
  assert.equal(graphene.mpn,'TM8FFH002T0C129');
  assert.equal(aluminum.mpn,'TM8FFH002T0C128');
  assert.equal(graphene.patch.heightMm,3.7);
  assert.equal(aluminum.patch.heightMm,8.7);
  assert.equal(airflow.mpn,'TM8FG3004T0C133');
  assert.equal(airflow.patch.heightMm,62.3);
  assert.equal(airflow.patch.widthMm,24.7);
  assert.equal(airflow.patch.lengthMm,undefined,'77 mm cooler body is not entire SSD length');
});

test('capacity-specific writes and renamed interfaces do not inherit neighbouring maxima',()=>{
  assert.match(String(products['import-ssd-71709db07089'].fieldEvidence?.write.value),/3000/);
  assert.match(String(products['import-ssd-97e83495331c'].fieldEvidence?.write.value),/4500/);
  assert.match(String(products['import-ssd-4b0d79c1fc74'].fieldEvidence?.read.value),/7200/);
  assert.match(String(products['import-ssd-ab2fb7f44091'].fieldEvidence?.read.value),/7300/);
  assert.equal(products['import-ssd-4b370adc4f5c'].mpn,'K01TBM2SP0-C7T');
  assert.match(products['import-ssd-4b370adc4f5c'].patch.name!,/PCIe 3\.0/);
  assert.match(products['import-ssd-4b370adc4f5c'].patch.specs!.join(' '),/PCIe 3\.0/);
  assert.doesNotMatch(products['import-ssd-4b370adc4f5c'].patch.specs!.join(' '),/PCIe 4\.0/);
  assert.match(String(products['import-ssd-59373d019360'].fieldEvidence?.randomRead.value),/1200000/);
  assert.match(String(products['import-ssd-e35ae4df739f'].fieldEvidence?.randomRead.value),/1600000/);
});

test('TeamGroup QLC variants retain explicitly documented cell type',()=>{
  const qlc=Object.entries(products).filter(([id])=>/MP44Q|Z44A7Q/i.test(baseline.find(b=>b.component.id===id)!.component.name));
  assert.equal(qlc.length,6);
  for(const [id,p] of qlc)assert.equal(p.fieldEvidence?.nand.value,'3D QLC',id);
});

test('unknown revisions and model-only identities cannot acquire fabricated commercial SKUs',()=>{
  for(const id of ['import-ssd-920781bf2686','import-ssd-83b4de1fe4f2','import-ssd-c75f6cec4fcf','import-ssd-d8546f98e015','import-ssd-dda2c0eb60e3','import-ssd-0155a8c426dd'])assert.equal(products[id],undefined,id);
  for(const id of ['import-ssd-ab2fb7f44091','import-ssd-4b0d79c1fc74']){
    assert.equal(products[id].mpn,'');
    assert.equal(products[id].identityKind,'manufacturer-model');
    assert.ok(products[id].manufacturerModel);
    assert.equal(products[id].patch.manufacturerPartNumber,undefined);
    assert.deepEqual(products[id].offers,[]);
  }
});
