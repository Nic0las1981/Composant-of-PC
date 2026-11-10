import {readFileSync,writeFileSync} from 'node:fs';
import {deepFspProducts as products} from '../src/data/deepFspCatalog';
import {getCatalogCompletion} from '../src/lib/catalogCompletion';
import type {Component} from '../src/data/catalog';
const base='data/deep-review/power-fsp/';
const inputs=JSON.parse(readFileSync(base+'input.json','utf8')) as Component[];
const reviews=JSON.parse(readFileSync(base+'per-id-review.json','utf8')) as Array<{id:string;state:string;blocker:string|null;blockerDetail:string|null;sourceKeys:string[]}>;
const photos=JSON.parse(readFileSync(base+'official-photos.json','utf8')) as Array<{id:string;images:string[]}>;
const rows=inputs.map(c=>{
 const p=products[c.id],review=reviews.find(r=>r.id===c.id)!;
 const completion=getCatalogCompletion({...c,...p?.patch},p);
 return {id:c.id,name:c.name,admitted:!!p,evidenceState:review.state,status:completion.status,
  identity:completion.identity,fields:completion.technical.fields.map(f=>({...f,reason:f.state==='conflicting'?'contradictory_or_revision_dependent':f.state==='documented'?'published_source_evidence':p?'not_published_unambiguously_in_reviewed_sources':'identity_unresolved'})),
  documented:completion.technical.documented,required:completion.technical.total,
  sourceURLs:p?.sources.map(s=>s.url)||[],sourceKeys:review.sourceKeys,
  imageURLs:photos.find(r=>r.id===c.id)?.images||[],imageStatus:'manufacturer_reference_uninspected',
  blocker:review.blocker,blockerDetail:review.blockerDetail,
  revisionAmbiguity:review.state==='shared_revision_intersection',
  pricing:completion.pricing,
 };
});
const summary={total:rows.length,admitted:rows.filter(r=>r.admitted).length,manufacturer:rows.filter(r=>r.identity.manufacturerSource).length,retailerOnly:rows.filter(r=>r.admitted&&!r.identity.manufacturerSource).length,ready:rows.filter(r=>r.status==='ready').length,technicalMissing:rows.filter(r=>r.status==='technical_missing').length,identityMissing:rows.filter(r=>r.status==='identity_missing').length,mpn:rows.filter(r=>r.identity.mpn).length,offers:Object.values(products).reduce((a,p)=>a+p.offers.length,0),images:rows.filter(r=>r.imageURLs.length).length,visuallyInspected:0,revisionAmbiguous:rows.filter(r=>r.revisionAmbiguity).length,unresolvedIdentity:rows.filter(r=>!r.admitted).map(r=>r.id)};
writeFileSync(base+'completion.json',JSON.stringify({summary,rows},null,2)+'\n');
console.log(JSON.stringify(summary));
console.log(JSON.stringify(rows.filter(r=>r.admitted).map(r=>({id:r.id,missing:r.fields.filter(f=>f.state!=='documented').map(f=>[f.key,f.state])}))));
