/** Render all 71 core models offline; screenshots can be captured from these sheets. */
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import ProductArt from '../src/components/ProductArt.tsx';
import {catalog} from '../src/data/catalog.ts';

const output=resolve(process.argv[2]??'release/core-icon-review');mkdirSync(output,{recursive:true});
const rows=['case','cooler','cpu'].flatMap(category=>catalog.filter(c=>c.category===category));
const css='body{margin:0;background:#101715;color:#e7eeea;font:14px Arial;padding:20px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}article{background:linear-gradient(145deg,#222b28,#17201c);border:1px solid #39443f;padding:12px 16px;border-radius:12px}svg{width:100%;height:205px}h2{font-size:13px;line-height:1.35;font-weight:400;margin:4px 0}small{font-size:9px;color:#b8c9be;letter-spacing:.6px}';
for(let offset=0;offset<rows.length;offset+=12){
 const sheet=rows.slice(offset,offset+12);
 const content=renderToStaticMarkup(createElement('main',{className:'grid'},sheet.map(c=>createElement('article',{key:c.id},
  createElement('small',{},`${c.category.toUpperCase()} · ILLUSTRATION`),
  createElement(ProductArt,{component:c,category:c.category,detailed:true,preferIllustration:true}),
  createElement('h2',{},c.name)))));
 writeFileSync(resolve(output,`sheet-${offset/12+1}.html`),`<!doctype html><html lang="fr"><meta charset="utf-8"><style>${css}</style><body>${content}</body></html>`);
}
writeFileSync(resolve(output,'coverage.json'),JSON.stringify({count:rows.length,ids:rows.map(c=>c.id),mode:'illustration-fallback',photoInspectionIsSeparate:true},null,2)+'\n');
console.log(output);
