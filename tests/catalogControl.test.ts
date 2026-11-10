import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {catalog} from '../src/data/catalog.ts';
import {catalogControlSummary,catalogControlOutcomes} from '../src/data/catalogControl.ts';
import {verifiedBulk} from '../src/data/verifiedBulk.ts';
import {verifiedProducts} from '../src/data/verifiedCatalog.ts';
import {getPricingInfo,getReferencePrice} from '../src/data/pricing.ts';
import {getVerifiedOffer} from '../src/lib/verifiedOffers.ts';

test('every variant has an individual, completed review outcome without claiming every reference is confirmed',()=>{
  assert.equal(catalogControlSummary.total,catalog.length);
  assert.equal(catalogControlSummary.searched,catalog.length);
  assert.equal(catalogControlSummary.pending,0);
  assert.equal(Object.keys(catalogControlOutcomes).length,catalog.length);
  for(const c of catalog){
    const outcome=catalogControlOutcomes[c.id];
    assert.ok(outcome,c.id);
    assert.notEqual(outcome.status,'pending',c.id);
    assert.ok(Number.isFinite(Date.parse(outcome.checkedAt!)),c.id);
    if(outcome.status!=='primary_match')assert.equal(verifiedBulk[c.id],undefined,c.id);
  }
  assert.ok(catalogControlSummary.statuses.no_exact_match>0);
});

test('new direct prices retain their own EUR primary provenance independently of the USD archive',t=>{
  const checked=Math.max(...Object.values(verifiedProducts).flatMap(p=>p.offers.map(o=>Date.parse(o.checkedAt))))+1000;
  t.mock.method(Date,'now',()=>checked);
  let tested=0;
  for(const c of catalog.filter(c=>c.source && verifiedBulk[c.id])){
    const offer=getVerifiedOffer(c);
    if(!offer)continue;
    const info=getPricingInfo(c);
    assert.equal(info.status,'verified',c.id);
    assert.equal(getReferencePrice(c),offer.amount,c.id);
    assert.equal(info.source?.url,offer.url,c.id);
    assert.equal(info.checkedAt,offer.checkedAt,c.id);
    assert.equal(info.currency,'EUR');
    tested++;
  }
  assert.ok(tested>0);
});

test('Amazon reference reads never introduce a price without confirmed French offer conditions',()=>{
  const rows=JSON.parse(readFileSync(new URL('../data/full-review/amazon-outcomes.json',import.meta.url),'utf8'));
  assert.equal(rows.length,60);
  assert.ok(rows.some((r:{status:string})=>r.status==='mpn_observed'));
  assert.ok(rows.every((r:{offerStatus:string})=>r.offerStatus==='not_confirmed_for_delivery_in_france'));
  assert.equal(catalogControlSummary.amazon.confirmedFrenchOffers,0);
});

test('published source archives match their evidence checksums',()=>{
  const checksums=JSON.parse(readFileSync(new URL('../data/full-review/evidence-checksums.json',import.meta.url),'utf8'));
  for(const [name,record] of Object.entries(checksums) as Array<[string,{sha256:string}]>){
    const bytes=readFileSync(new URL('../data/full-review/'+name,import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256,name);
  }
});

test('the integrated catalogue retains valid units, source capacities and kit identities for every variant',()=>{
  const report=JSON.parse(readFileSync(new URL('../data/full-review/integrity.json',import.meta.url),'utf8'));
  assert.equal(report.inputScope,'integrated_catalog');
  assert.equal(report.total,catalog.length);
  assert.equal(report.invalid,0);
  assert.deepEqual(new Set(report.checks.map((r:{id:string})=>r.id)),new Set(catalog.map(c=>c.id)));
  assert.ok(report.checks.every((r:{errors:string[]})=>r.errors.length===0));
  assert.ok(report.incompleteCompatibility>0);
});
