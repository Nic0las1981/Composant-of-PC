import {readFileSync,writeFileSync} from 'node:fs';
import {deepStorageBoardsProducts as products} from '../src/data/deepStorageBoardsCatalog';
import {getCatalogCompletion} from '../src/lib/catalogCompletion';
import type {Component} from '../src/data/catalog';
const inputs=JSON.parse(readFileSync('data/deep-review/storage-boards/input.json','utf8')) as {component:Component}[];
const rows=inputs.map(({component:c})=>{const p=products[c.id],r=JSON.parse(readFileSync(`data/deep-review/storage-boards/records/${c.id}.json`,'utf8'));const completion=getCatalogCompletion({...c,...p?.patch},p);return {id:c.id,name:c.name,admitted:!!p,status:completion.status,mpn:p?.mpn||null,model:p?.manufacturerModel||null,documented:completion.technical.documented,required:completion.technical.total,missing:completion.technical.fields.filter(f=>f.state!=='documented'),sourceURLs:p?.sources.map(s=>s.url)||[],imageURLs:r.images||[],imageStatus:'uninspected_manufacturer_reference',blocker:r.blocker||null};});
writeFileSync('data/deep-review/storage-boards/per-id-review.json',JSON.stringify(rows,null,2)+'\n');
console.log(JSON.stringify({total:rows.length,admitted:rows.filter(r=>r.admitted).length,ready:rows.filter(r=>r.admitted&&r.status==='ready').length,mpn:rows.filter(r=>r.mpn).length,offers:Object.values(products).reduce((a,p)=>a+p.offers.length,0),images:rows.filter(r=>r.imageURLs.length).length}));
console.log(rows.filter(r=>r.admitted).map(r=>({name:r.name,missing:r.missing.map(f=>[f.key,f.state])})));
