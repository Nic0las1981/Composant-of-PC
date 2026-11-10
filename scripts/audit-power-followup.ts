import {readFileSync,writeFileSync} from 'node:fs';
import {catalog} from '../src/data/catalog.ts';
import {deepPowerFollowupProducts as products} from '../src/data/deepPowerFollowupCatalog.ts';
import {getCatalogCompletion} from '../src/lib/catalogCompletion.ts';

const folder='data/deep-review/power-followup';
const baseline=JSON.parse(readFileSync(`${folder}/baseline-unknown.json`,'utf8')) as Array<{id:string;name:string;brand:string;checklist:{unresolved:unknown[]}}>;
const review=JSON.parse(readFileSync(`${folder}/review.json`,'utf8'));
const previous=new Map((JSON.parse(readFileSync('data/deep-review/power-chassis/exhaustive-audit.json','utf8')).products as Array<{id:string;researchState:string;reason:string}>).map(r=>[r.id,r]));
review.records=baseline.map(row=>{
 const p=products[row.id],component=catalog.find(c=>c.id===row.id)!;
 const completion=p?getCatalogCompletion({...component,...p.patch},p).technical:undefined;
 return {id:row.id,name:row.name,brand:row.brand,
  state:p?'new_exact_model_documented':'prior_audit_retained_not_individually_resolved_this_pass',
  previousState:previous.get(row.id)?.researchState,previousReason:previous.get(row.id)?.reason,
  previousAudit:'data/deep-review/power-chassis/exhaustive-audit.json',
  sourceURLs:p?.sources.map(s=>s.url)??[],technicalRows:p?.groups.reduce((n,g)=>n+g.rows.length,0)??0,
  technicalChecklist:completion?{documented:completion.documented,total:completion.total,complete:completion.documented===completion.total}:null,
  unresolvedTechnicalFields:completion?.fields.filter(f=>f.state!=='documented').map(f=>({key:f.key,state:f.state}))??row.checklist.unresolved};
});
review.summary.generatedAt=new Date().toISOString();
review.summary.technicalRows=Object.values(products).reduce((n,p)=>n+p.groups.reduce((n,g)=>n+g.rows.length,0),0);
review.summary.sources=new Set(Object.values(products).flatMap(p=>p.sources.map(s=>s.url))).size;
review.summary.newlyTechnicallyComplete=review.records.filter((r:{state:string;technicalChecklist?:{complete:boolean}})=>r.state==='new_exact_model_documented'&&r.technicalChecklist?.complete).length;
writeFileSync(`${folder}/review.json`,JSON.stringify(review,null,2)+'\n');
console.log(JSON.stringify(review.summary,null,2));
