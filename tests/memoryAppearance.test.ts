import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {catalog} from '../src/data/catalog.ts';
import {getMemoryAppearance,getMemoryAppearanceColor,memoryShapes} from '../src/data/memoryAppearance.ts';
import {memoryAppearanceAssignments} from '../src/data/memoryAppearanceAssignments.ts';
import ProductArt from '../src/components/ProductArt.tsx';
import MemoryHeatspreaderArt from '../src/components/MemoryHeatspreaderArt.tsx';

test('an appearance requires its exact reviewed MPN; names and model-only identities cannot select a shell',()=>{
  const component=catalog.find(c=>getMemoryAppearance(c)==='trident-z5');
  assert.ok(component);
  assert.equal(getMemoryAppearance({...component,manufacturerPartNumber:undefined}),undefined);
  assert.equal(getMemoryAppearanceColor({...component,manufacturerPartNumber:undefined}),undefined);
  assert.equal(getMemoryAppearance({...component,manufacturerPartNumber:component.manufacturerPartNumber+'-OTHER'}),undefined);
  assert.equal(getMemoryAppearance({...component,category:'storage'}),undefined);
  assert.equal(getMemoryAppearance({...component,memoryHeatspreader:false}),undefined);
  assert.equal(getMemoryAppearance({...component,manufacturerPartNumber:' '+component.manufacturerPartNumber?.toLowerCase()+' '}),'trident-z5');
});

test('photograph-specific shell colours override the order of archived finish labels',()=>{
  const silver=catalog.find(c=>c.manufacturerPartNumber==='F5-6400J3239G32GX2-TZ5RS');
  const twoTone=catalog.find(c=>c.manufacturerPartNumber==='KF436C16RB12K2/32');
  assert.ok(silver&&twoTone);
  assert.equal(getMemoryAppearanceColor(silver),'#bfc5c8');
  assert.equal(getMemoryAppearanceColor(twoTone),'#242528');
});

test('all reconstructed MPNs trace to an independently linked and inspected manufacturer photo',()=>{
  const evidence=JSON.parse(readFileSync(new URL('../data/deep-review/visual/memory-silhouettes/inspected-shapes.json',import.meta.url),'utf8'));
  let count=0;
  for(const [design,mpns] of Object.entries(memoryAppearanceAssignments)){
    for(const mpn of mpns){
      const proof=evidence.proofs.find((p:{design:string;linkedMPNs:string[]})=>p.design===design&&p.linkedMPNs.includes(mpn));
      assert.ok(proof,`${mpn}: missing appearance proof`);
      const review=JSON.parse(readFileSync(new URL('../'+proof.sourceReview,import.meta.url),'utf8'));
      const original=review.find((p:{sha256:string})=>p.sha256===proof.imageSHA256);
      assert.ok(original?.visuallyInspected&&original.linkedMPNs.includes(mpn),`${mpn}: photograph identity mismatch`);
      count++;
    }
  }
  assert.equal(count,evidence.referenceCount);
  assert.equal(new Set(Object.values(memoryAppearanceAssignments).flat()).size,count);
});

test('the same family keeps RGB and unlit variants distinct in the icon fallback',()=>{
  const group=catalog.filter(c=>getMemoryAppearance(c)==='trident-z5');
  const lit=group.find(c=>c.rgb===true),unlit=group.find(c=>c.rgb===false);
  assert.ok(lit&&unlit);
  const render=(component:typeof lit)=>renderToStaticMarkup(createElement(ProductArt,{component,category:'ram',preferIllustration:true,detailed:true}));
  assert.match(render(lit),/data-rgb-zone="ram-diffuser"/);
  assert.doesNotMatch(render(unlit),/data-rgb-zone="ram-diffuser"/);
  for(const component of [lit,unlit]) assert.match(render(component),/data-memory-design="trident-z5"/);
});

test('white bodies keep legible labels and segmented RGB windows stay separate',()=>{
  const common={height:23,body:'#f0f0ed',bodyColor:'#f0f0ed',ink:'#31433f',rgb:true,rainbow:'#80bdff',brushed:'#aaa'};
  for(const design of ['dominator-platinum-rgb','fury-beast-ddr5'] as const){
    const svg=renderToStaticMarkup(createElement(MemoryHeatspreaderArt,{...common,design}));
    assert.match(svg,new RegExp(`fill="#31433f">${memoryShapes[design].label}`));
  }
  const dominator=renderToStaticMarkup(createElement(MemoryHeatspreaderArt,{...common,design:'dominator-platinum-rgb'}));
  assert.equal((dominator.match(/data-rgb-zone="ram-diffuser"/g)||[]).length,12);
  const lpx=renderToStaticMarkup(createElement(MemoryHeatspreaderArt,{...common,design:'vengeance-lpx'}));
  assert.doesNotMatch(lpx,/data-rgb-zone/);
});
