import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import type { Component } from '../src/data/catalog.ts';
import { deepMotherboardProducts } from '../src/data/deepMotherboardCatalog.ts';
import { getCatalogCompletion } from '../src/lib/catalogCompletion.ts';

const dir=path.resolve('data/deep-review/motherboard');
const input=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(dir,'input.json.gz'))).toString()) as Array<{component:Component}>;
const gigabytePhotos=JSON.parse(fs.readFileSync(path.join(dir,'gigabyte/photos.json'),'utf8')) as Record<string,Array<Record<string,unknown>>>;
const reviews=new Map<string,Array<{file:string;state:string;attempts?:unknown}>>();
for(const folder of ['asus','asus-manuals','asus-partial','msi','asrock','biostar','nzxt','other','ecs-evga']) {
  const base=path.join(dir,folder); const files=fs.existsSync(path.join(base,'records'))?fs.readdirSync(path.join(base,'records')).filter(f=>f.endsWith('.json')).map(f=>path.join(base,'records',f)):fs.existsSync(path.join(base,'record.json'))?[path.join(base,'record.json')]:[];
  for(const file of files){const r=JSON.parse(fs.readFileSync(file,'utf8')).review;if(r?.id)reviews.set(r.id,[...(reviews.get(r.id)??[]),{file:path.relative(process.cwd(),file),state:r.state,attempts:r.attempts}]);}
}
const photos:Record<string,unknown>={};
const records=input.map(({component})=>{
  const product=deepMotherboardProducts[component.id];
  const updated={...component,...product?.patch} as Component;
  const completion=getCatalogCompletion(updated,product);
  const groupPhotos=product?.groups.flatMap(group=>group.title==='Références visuelles officielles'?group.rows.filter(row=>row.value.startsWith('https://')).map(row=>({url:row.value,model:product.manufacturerModel??component.name,sourceURLs:product.sources.filter(s=>s.kind==='manufacturer').map(s=>s.url),visuallyInspected:false})):[])??[];
  const refs=gigabytePhotos[component.id]??groupPhotos;
  if(refs.length)photos[component.id]={references:refs,inspection:'manufacturer-catalogue',fidelity:'uninspected',note:'Official catalogue URLs; no visual comparison or reconstructed-fidelity claim.'};
  return {id:component.id,brand:component.brand,name:component.name,finish:component.finishName??null,state:product?'manufacturer_identity_documented':'exact_identity_unconfirmed',commercialMPN:product?.mpn||null,manufacturerModel:product?.manufacturerModel??(product?component.name:null),technicalChecklist:{documented:completion.technical.documented,total:completion.technical.total,missing:completion.technical.fields.filter(f=>f.state!=='documented').map(f=>({key:f.key,label:f.label,state:f.state})),ready:completion.status==='ready'},sources:product?.sources??[],offerCount:product?.offers.length??0,photos:refs.length,photoInspection:false,evidenceFiles:reviews.get(component.id)??[]};
});
const summary={reviewedIds:records.length,manufacturerIdentityDocumented:records.filter(r=>r.state==='manufacturer_identity_documented').length,exactIdentityUnconfirmed:records.filter(r=>r.state==='exact_identity_unconfirmed').length,technicalChecklistReady:records.filter(r=>r.technicalChecklist.ready).length,commercialMPNs:records.filter(r=>r.commercialMPN).length,withOfficialPhotoURLs:Object.keys(photos).length,visuallyInspectedByThisCollector:0,byBrand:Object.fromEntries([...new Set(records.map(r=>r.brand))].map(brand=>[brand,{total:records.filter(r=>r.brand===brand).length,documented:records.filter(r=>r.brand===brand&&r.state==='manufacturer_identity_documented').length}]))};
fs.writeFileSync(path.join(dir,'identity-and-field-coverage.json'),JSON.stringify({checkedAt:new Date().toISOString(),scope:'All 1503 motherboard IDs individually considered. Documented identity is distinct from full technical coverage, commercial SKU, current price and visually reviewed reconstruction.',summary,records},null,2)+'\n');
fs.writeFileSync(path.join(dir,'official-photos.json'),JSON.stringify(photos,null,2)+'\n');
fs.writeFileSync(path.join(dir,'unresolved.json'),JSON.stringify(records.filter(r=>r.state==='exact_identity_unconfirmed'||!r.technicalChecklist.ready),null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
