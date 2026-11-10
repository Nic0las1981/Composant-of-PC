/** Offline visual review: npx tsx scripts/render-product-art-review.ts [output-dir].
 * Render each sheet in one React root so useId paint servers stay unique.
 * Open the generated HTML directly in a browser to inspect or capture it. */
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import ProductArt from '../src/components/ProductArt.tsx';
import {catalog,getComponent} from '../src/data/catalog.ts';
import {getVisualProfile} from '../src/data/visualProfiles.ts';

const output=resolve(process.argv[2]??'release/icon-review');
mkdirSync(output,{recursive:true});
const samples={
 cpu:['cpu-7600','cpu-5800x3d','cpu-14600kf'],
 motherboard:['mb-b650','mb-a620i','import-mb-fd057324a4a8'],
 gpu:['gpu-4060','gpu-4080s','import-gpu-a682aa002297'],
 ram:['ram-ddr5-32','import-ram-8b162aa67690','oem-ram-samsung-m378a2k43eb1-cwe'],
 storage:['ssd-990pro-2','import-ssd-8a91162ac077',catalog.find(c=>{const p=getVisualProfile(c);return p?.category==='storage'&&p.hasHeatsink})!.id],
 cooler:['cooler-nhd15','cooler-l9a','cooler-lfiii360'],
 psu:['psu-sf750','import-psu-3f7709be66e0',catalog.find(c=>c.category==='psu'&&/Câbles fixes/.test(c.name))!.id],
 case:['case-h6','case-north','case-terra'],
};
const style=`body{margin:0;background:#101715;color:#e7eeea;font:14px Arial;padding:20px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}article{background:linear-gradient(145deg,#222b28,#17201c);border:1px solid #39443f;padding:14px 18px;border-radius:12px;min-height:235px}svg{width:100%;height:205px}h2{font-size:13px;line-height:1.4;font-weight:400;margin:5px 0}small{font-size:9px;color:#b8c9be;letter-spacing:1.1px}`;
let sheet=0;
for(const group of [Object.entries(samples).slice(0,4),Object.entries(samples).slice(4)]){
 const cards=group.flatMap(([category,ids])=>ids.map(id=>{
  const c=getComponent(id);if(!c)throw new Error(`Missing review sample: ${id}`);
  const p=getVisualProfile(c);
  return createElement('article',{key:id},
   createElement('small',{},`${category.toUpperCase()} · ${p?.fidelity==='schematic'?'SCHÉMATIQUE':'RECONSTRUCTION'}`),
   createElement(ProductArt,{component:c,category,detailed:true}),
   createElement('h2',{},c.name));
 }));
 writeFileSync(resolve(output,`contact-${++sheet}.html`),`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Contrôle des icônes — ${sheet}</title><style>${style}</style></head><body>${renderToStaticMarkup(createElement('main',{className:'grid'},cards))}</body></html>`);
}
writeFileSync(resolve(output,'review.json'),JSON.stringify({
 renderer:'physical-v2',catalogueCount:catalog.length,sampleCount:Object.values(samples).flat().length,samples,
 categories:Object.fromEntries(Object.keys(samples).map(category=>[category,catalog.filter(c=>c.category===category).length])),
 limits:[
  'Le rendu conserve la fidélité de chaque profil : un schéma reste un schéma, même avec des matières et des ombres améliorées.',
  'Les composants sans photos propres à la référence utilisent leur typologie et leurs proportions documentées. Implantation des composants, rainures, vis et pales restent illustratives.',
  'Les dimensions illustratives ne sont jamais écrites dans les caractéristiques matérielles ni utilisées pour garantir une compatibilité physique.',
  'Ces planches échantillonnent 24 références ; le test productArtCoverage valide séparément le rendu SVG des 10 564 références.',
 ],
},null,2)+'\n');
console.log(output);
