import {readFileSync,writeFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {deepStorageFollowupProducts as products} from '../src/data/deepStorageFollowupCatalog.ts';
import {getCatalogCompletion} from '../src/lib/catalogCompletion.ts';
import type {Component} from '../src/data/catalog.ts';
import type {VerifiedProduct} from '../src/data/verifiedTypes.ts';

const folder='data/deep-review/storage-followup';
const baseline=JSON.parse(gunzipSync(readFileSync(`${folder}/baseline.json.gz`)).toString()) as Array<{component:Component;product:VerifiedProduct|null}>;
const reviews=JSON.parse(readFileSync(`${folder}/review.json`,'utf8')) as Array<{id:string;state:string}>;
const records=Object.entries(products).map(([id,p])=>{
 const before=baseline.find(b=>b.component.id===id)!;
 const c={...before.component,...p.patch};
 const result=getCatalogCompletion(c,p);
 return {id,name:c.name,mpn:p.mpn,identityKind:p.identityKind??'mpn',previouslyDocumented:!!before.product,status:result.status,identity:result.identity,documented:result.technical.documented,total:result.technical.total,fields:result.technical.fields.filter(f=>f.state!=='documented'),sources:p.sources.map(s=>s.url)};
});
const missing:Record<string,number>={};
for(const r of records)for(const f of r.fields)missing[f.key]=(missing[f.key]??0)+1;
const summary={generatedAt:new Date().toISOString(),scope:'Followup overlay against immutable 832-SSD baseline; price collection is separate.',baselineRecords:baseline.length,initialIdentityMissing:baseline.filter(b=>!b.product).length,products:records.length,newlyIdentified:records.filter(r=>!r.previouslyDocumented).length,newExactMPN:records.filter(r=>!r.previouslyDocumented&&r.identityKind==='mpn').length,newManufacturerModels:records.filter(r=>!r.previouslyDocumented&&r.identityKind==='manufacturer-model').length,existingRecordsEnriched:records.filter(r=>r.previouslyDocumented).length,remainingIdentityMissing:reviews.filter(r=>r.state==='research_open').length,technicallyComplete:records.filter(r=>r.documented===r.total).length,technicalRows:Object.values(products).reduce((n,p)=>n+p.groups.reduce((a,g)=>a+g.rows.length,0),0),missingTechnicalFields:missing,newOffers:Object.entries(products).filter(([id])=>!baseline.find(b=>b.component.id===id)!.product).reduce((n,[,p])=>n+p.offers.length,0),sourceURLs:new Set(records.flatMap(r=>r.sources)).size};
writeFileSync(`${folder}/technical-audit.json`,JSON.stringify(records,null,2)+'\n');
writeFileSync(`${folder}/summary.json`,JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
