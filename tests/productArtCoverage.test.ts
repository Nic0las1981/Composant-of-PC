import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {catalog,getComponent,type Component} from '../src/data/catalog.ts';
import {getVisualProfile} from '../src/data/visualProfiles.ts';
import ProductArt from '../src/components/ProductArt.tsx';

const render=(c:Component,detailed=false)=>renderToStaticMarkup(createElement(ProductArt,{component:c,category:c.category,detailed}));
function inspect(svg:string,id:string){
 assert.ok(svg.includes(`data-component-id="${id}"`),id);
 assert.match(svg,/data-art-material="physical-v2"/);
 assert.match(svg,/data-art-part="hardware"/);
 assert.doesNotMatch(svg,/(?:="|[, (])(?:NaN|Infinity|-Infinity)(?:[" ,)]|$)/,id);
 assert.doesNotMatch(svg,/(?:width|height|r|rx|ry)="-\d/,id);
 const definitions=[...svg.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(definitions).size,definitions.length,`Duplicate paint IDs in ${id}`);
 for(const m of svg.matchAll(/url\(#([^\)]+)\)/g))assert.ok(definitions.includes(m[1]),`Missing paint ${m[1]} for ${id}`);
 const memorySilhouette=svg.match(/data-memory-design="[^"]+"[^>]*>\s*<path d="([^"]+)"/);
 if(memorySilhouette){
  // A traced heatspreader is one filled polygon rather than fifteen generic
  // rectangles. Check its actual nonzero projected area instead of element count.
  assert.ok(memorySilhouette[1].endsWith('Z'),`Open memory silhouette in ${id}`);
  const points=[...memorySilhouette[1].matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map(m=>[+m[1],+m[2]]);
  assert.ok(points.length>=5,`Missing memory outline in ${id}`);
  const area=Math.abs(points.reduce((sum,[x,y],i)=>{const next=points[(i+1)%points.length];return sum+x*next[1]-next[0]*y;},0))/2;
  assert.ok(area>100,`Empty memory silhouette in ${id}`);
 }else assert.ok((svg.match(/<(?:path|rect|circle|ellipse)\b/g)||[]).length>=15,`Empty hardware in ${id}`);
}

test('every catalogue variant renders a finite, nonempty material-aware icon with resolved paint definitions',()=>{
 assert.equal(catalog.length,10564);
 const counts=new Map<string,number>();
 for(const c of catalog){
  const svg=render(c);inspect(svg,c.id);
  assert.ok(svg.includes(`data-art-family="${c.category}"`),c.id);
  assert.ok(svg.includes(`data-art-fidelity="${getVisualProfile(c)?.fidelity??'reconstructed'}"`),c.id);
  counts.set(c.category,(counts.get(c.category)??0)+1);
 }
 assert.equal(counts.size,8);
});

test('detailed previews remain valid for dimensional extrema and every individually reconstructed reference',()=>{
 const chosen=new Map<string,Component>();
 for(const category of new Set(catalog.map(c=>c.category))){
  const rows=catalog.filter(c=>c.category===category);
  for(const field of ['lengthMm','heightMm','widthMm','thicknessMm','fanCount','memorySticks'] as const){
   const candidates=rows.filter(c=>c[field]!==undefined).sort((a,b)=>(a[field]??0)-(b[field]??0));
   if(candidates.length){chosen.set(candidates[0].id,candidates[0]);chosen.set(candidates.at(-1)!.id,candidates.at(-1)!);}
  }
 }
 for(const c of catalog.filter(c=>getVisualProfile(c)?.design))chosen.set(c.id,c);
 for(const c of chosen.values())inspect(render(c,true),c.id);
});

test('known passive cooling and absence of M.2 slots do not receive fallback fans or a fictitious M.2 shield',()=>{
 const gpu={...getComponent('gpu-4060')!,fanCount:0};
 const air={...getComponent('cooler-nhd15')!,fanCount:0};
 const psu={...getComponent('psu-rm750e')!,fanCount:0};
 for(const component of [gpu,air,psu])assert.doesNotMatch(render(component),/data-art-part="fan"/,component.id);
 const board={...getComponent('mb-b650')!,m2Slots:0};assert.doesNotMatch(render(board),/data-art-part="m2-mount"/);
 const rgbUnknown={...getComponent('gpu-4060')!,rgb:undefined};assert.doesNotMatch(render(rgbUnknown),/data-rgb-zone=/);
});

test('multiple icons in the same React tree retain separate materials and unchanged hardware',()=>{
 const chosen=['gpu-4060','gpu-4080s','ram-ddr5-32','case-h6','import-ram-8b162aa67690'].map(id=>getComponent(id)!);
 const before=chosen.map(c=>JSON.stringify(c));
 const output=renderToStaticMarkup(createElement('div',{},chosen.map(c=>createElement(ProductArt,{key:c.id,component:c,category:c.category,detailed:true}))));
 const definitions=[...output.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(definitions).size,definitions.length);
 assert.deepEqual(chosen.map(c=>JSON.stringify(c)),before);
});

test('all eight families retain physical landmarks and explicit visible part counts',()=>{
 const examples=[['cpu-7600','heat-spreader'],['gpu-4060','fin-stack'],['mb-b650','socket'],['ssd-990pro-2','storage-module'],['cooler-nhd15','cooling-fins'],['cooler-lfiii360','radiator'],['psu-rm750e','psu-enclosure'],['case-terra','case-panel']];
 for(const [id,part] of examples)assert.ok(render(getComponent(id)!).includes(`data-art-part="${part}"`),`${id}: ${part}`);
 for(const count of [1,2,4]){
  const ram={...getComponent('ram-ddr5-32')!,memorySticks:count};
  assert.equal((render(ram).match(/data-memory-module=/g)||[]).length,count);
  const board={...getComponent('mb-b650')!,memorySlots:count};
  assert.equal((render(board).match(/data-art-part="dimm-slot"/g)||[]).length,count);
 }
 for(const count of [0,1,2,3]){
  const gpu={...getComponent('gpu-4060')!,fanCount:count};
  assert.equal((render(gpu).match(/data-art-part="fan"/g)||[]).length,count);
 }
 const shortSsd={...getComponent('ssd-990pro-2')!,lengthMm:42,specs:['M.2 2242 NVMe']};
 const shortArt=render(shortSsd);
 assert.match(shortArt,/M\.2 2242/);assert.doesNotMatch(shortArt,/M\.2 2280/);
 assert.notEqual(shortArt,render({...shortSsd,lengthMm:80}),'known module length changes the illustrated silhouette');
});
