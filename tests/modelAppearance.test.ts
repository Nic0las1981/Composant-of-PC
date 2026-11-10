import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {catalog,getComponent} from '../src/data/catalog.ts';
import {caseAppearances,coolerAppearances} from '../src/data/hardwareAppearance.ts';
import {getProductImage} from '../src/data/productImages.ts';
import {manufacturerImageAssets} from '../src/data/manufacturerImageAssets.ts';
import ProductArt from '../src/components/ProductArt.tsx';

type MemoryPhotoReview={mpn:string;imageURL:string;sourceURL:string;reviewedAt:string;sha256:string};
type MemoryHiresReview=MemoryPhotoReview&{oldImageURL:string;oldSHA256:string;checkedAt:string;width:number;height:number;visuallyInspected:boolean;sameAssetPath:boolean;inspectionRecord:string};
const memoryHiresReviews:MemoryHiresReview[]=JSON.parse(readFileSync(new URL('../data/deep-review/visual/memory-hires/overrides.json',import.meta.url),'utf8'));

const render=(id:string)=>{const c=getComponent(id)!;return renderToStaticMarkup(createElement(ProductArt,{component:c,category:c.category,preferIllustration:true}));};

test('all twenty cases and twenty-five coolers have explicit model appearance and inspection records',()=>{
 const reviews=JSON.parse(readFileSync(new URL('../data/deep-review/visual/icons/inspected-products.json',import.meta.url),'utf8'));
 for(const [category,map,total] of [['case',caseAppearances,20],['cooler',coolerAppearances,25]] as const){
  const rows=catalog.filter(c=>c.category===category);
  assert.equal(rows.length,total);assert.deepEqual(Object.keys(map).sort(),rows.map(c=>c.id).sort());
  for(const c of rows){
   const reference=reviews.find((r:{id:string})=>r.id===c.id);
   assert.ok(reference,c.id);assert.ok(reference.inspectionNote,c.id);
   assert.ok(reference.sourceURL||reference.visuallyInspected===false,c.id);
  }
 }
});

test('source-observed landmarks distinguish fan frames, pump shapes and case front constructions',()=>{
 assert.match(render('cooler-nhd15'),/data-fan-frame="round"/);
 assert.match(render('cooler-nhd12l'),/data-art-part="asymmetric-front-tower"/);
 assert.match(render('cooler-ak620'),/data-art-part="twin-grid-caps"/);
 assert.match(render('cooler-darkrockpro5'),/data-art-part="bridged-top-cover"/);
 for(const [id,pump] of [['cooler-kraken240','kraken-round'],['cooler-lfiii360','arctic-vrm'],['cooler-h100i240','capellix'],['cooler-h170i-lcd-420','corsair-lcd'],['cooler-ls720360','deepcool-infinity'],['cooler-silentloop2-360','silent-loop']])assert.ok(render(id).includes(`data-pump-shape="${pump}"`),id);
 for(const [id,pattern] of [['case-4000d','triangles'],['case-meshify2','faceted-mesh'],['case-pop-air-rgb','hexagons'],['case-q300l','geometric-filter'],['case-ap201','square-perforation']])assert.ok(render(id).includes(`data-front-pattern="${pattern}"`),id);
 assert.match(render('case-q300l'),/data-art-part="side-io"/);
 assert.match(render('case-pop-air-rgb'),/data-art-part="front-drive-cover"/);
 for(const c of catalog.filter(c=>c.category==='cpu'))assert.ok(render(c.id).includes(`data-package="${c.socket}"`),c.id);
});

test('primary photos are ID-specific and distinguish inspected photos from catalogue identity matches',()=>{
 const reviews=JSON.parse(readFileSync(new URL('../data/deep-review/visual/icons/inspected-products.json',import.meta.url),'utf8'));
 const gpuReviews=JSON.parse(readFileSync(new URL('../data/deep-review/gpu/inspected-finish-proofs.json',import.meta.url),'utf8'));
 const memoryReviews=JSON.parse(readFileSync(new URL('../data/deep-review/memory-storage/visual-finish-resolutions.json',import.meta.url),'utf8'));
 for(const [id,image] of Object.entries(manufacturerImageAssets)){
  assert.ok(getComponent(id),id);assert.ok(image.imageURL.startsWith('https://'));assert.ok(image.sourceURL.startsWith('https://'));
  if(image.inspection==='visually-inspected')assert.ok(
   reviews.some((r:{id:string;visuallyInspected:boolean;useAsPrimaryPhoto:boolean;imageURL:string})=>r.id===id&&r.visuallyInspected&&r.useAsPrimaryPhoto&&r.imageURL===image.imageURL)
   || gpuReviews.some((r:{visuallyInspected:boolean;imageURL:string;sourceURL:string})=>r.visuallyInspected&&r.imageURL===image.imageURL&&r.sourceURL===image.sourceURL)
   || memoryReviews.some((r:{mpn:string;imageURL:string;sourceURL:string;reviewedAt:string})=>'mpn' in image&&r.mpn===image.mpn&&r.imageURL===image.imageURL&&r.sourceURL===image.sourceURL&&Number.isFinite(Date.parse(r.reviewedAt)))
   || memoryHiresReviews.some(r=>'mpn' in image&&r.mpn===image.mpn&&r.imageURL===image.imageURL&&r.sourceURL===image.sourceURL&&r.visuallyInspected&&Number.isFinite(Date.parse(r.reviewedAt))),id);
 }
 assert.equal(getProductImage('unknown-model'),undefined);
 assert.equal(getProductImage('case-north'),undefined,'a white mesh photo must not represent Charcoal TG');
 for(const c of catalog.filter(c=>c.category==='cpu'))assert.equal(getProductImage(c),undefined,'a shared retail box is not a CPU package photo');
 const keyed=catalog.find(c=>getProductImage(c)?.mpn)!;
 assert.ok(keyed);assert.equal(getProductImage({...keyed,manufacturerPartNumber:'DIFFERENT-SKU'}),undefined);
 assert.equal(getProductImage({...keyed,manufacturerPartNumber:undefined}),undefined,'an unconfirmed identity cannot keep a previous SKU photo');
 const c=getComponent('cooler-nhd15')!;
 const svg=renderToStaticMarkup(createElement(ProductArt,{component:c,category:'cooler'}));
 assert.match(svg,/data-art-mode="illustration"/,'the illustration stays visible until the image really loads');
 assert.match(svg,/data-art-part="manufacturer-photo"/);assert.match(svg,/<image href="https:/);
 assert.doesNotMatch(render(c.id),/<image /,'offline illustration review does not request external images');
});

test('larger memory photos preserve the exact source asset and have a separate visual inspection',()=>{
 const originalReviews:MemoryPhotoReview[]=JSON.parse(readFileSync(new URL('../data/deep-review/memory-storage/visual-finish-resolutions.json',import.meta.url),'utf8'));
 for(const review of memoryHiresReviews){
  const old=originalReviews.find(r=>r.mpn===review.mpn&&r.sourceURL===review.sourceURL&&r.imageURL===review.oldImageURL);
  assert.ok(old,review.mpn+' must retain its own SKU source and exact previous URL');
  assert.equal(old.sha256,review.oldSHA256);
  assert.equal(review.imageURL,review.oldImageURL.replace('w_96/','w_1024/'));
  assert.equal(review.sameAssetPath,true);assert.equal(review.visuallyInspected,true);
  assert.ok(review.width>=768&&review.height>100);
  assert.match(review.sha256,/^[0-9a-f]{64}$/);assert.notEqual(review.sha256,review.oldSHA256);
  assert.ok(Date.parse(review.reviewedAt)>=Date.parse(review.checkedAt));
  assert.ok(Date.parse(review.reviewedAt)>Date.parse(old.reviewedAt),'a small-image inspection cannot authorise uninspected new bytes');
  const inspection=JSON.parse(readFileSync(new URL('../'+review.inspectionRecord,import.meta.url),'utf8'));
  assert.equal(inspection.status,200);assert.equal(inspection.visuallyInspected,true);
  assert.equal(inspection.sha256,review.sha256);assert.equal(inspection.width,review.width);assert.equal(inspection.height,review.height);
  assert.equal(inspection.imageURL,review.imageURL);assert.equal(inspection.oldImageURL,review.oldImageURL);
  assert.ok(inspection.linkedMPNs.includes(review.mpn));assert.ok(inspection.observation);
 }
 const upgraded=catalog.filter(c=>getProductImage(c)?.imageURL.includes('w_1024/'));
 assert.ok(upgraded.length>0);
 for(const component of upgraded){
  const image=getProductImage(component)!;
  assert.ok(memoryHiresReviews.some(r=>r.mpn===component.manufacturerPartNumber&&r.sourceURL===image.sourceURL&&r.imageURL===image.imageURL));
  assert.equal(getProductImage({...component,manufacturerPartNumber:undefined}),undefined);
  assert.equal(getProductImage({...component,manufacturerPartNumber:'DIFFERENT-SKU'}),undefined);
 }
});
