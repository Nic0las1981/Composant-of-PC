import test from 'node:test';
import assert from 'node:assert/strict';
import type {Component} from '../src/data/catalog.ts';
import type {VerifiedProduct} from '../src/data/verifiedTypes.ts';
import {catalogTechnicalRequirements,getCatalogCompletion,type FieldEvidence} from '../src/lib/catalogCompletion.ts';
import {catalogFieldEvidence} from '../src/data/catalogFieldEvidence.ts';
const c:Component={id:'exact',category:'ram',brand:'Vendor',name:'Specific kit',price:0,description:'',specs:[],capacityGB:32};
const source={name:'Manufacturer',url:'https://example.test/exact',checkedAt:'2026-11-10T10:00:00Z',kind:'manufacturer' as const};
const product:VerifiedProduct={mpn:'EXACT',identityNote:'',sources:[source],patch:{},groups:[],offers:[],notes:[]};
test('a generic model, an MPN without sources and an incomplete sheet have distinct states',()=>{
 assert.equal(getCatalogCompletion(c).status,'identity_missing');
 assert.equal(getCatalogCompletion({...c,manufacturerPartNumber:'EXACT'}).status,'source_missing');
 assert.equal(getCatalogCompletion({...c,manufacturerPartNumber:'EXACT'},product).status,'technical_missing');
});
test('present archive fields never become documented solely because a source record exists',()=>{
 const completion=getCatalogCompletion({...c,manufacturerPartNumber:'EXACT'},product);
 assert.equal(completion.technical.fields.find(f=>f.key==='capacity')?.state,'present_unverified');
 assert.equal(completion.identity.manufacturerSource,true);
});
test('conflicting technical rows remain unresolved and on-die ECC is not host ECC',()=>{
 const p={...product,groups:[{title:'Specifications',rows:[{label:'Tension testée',value:'1.35 V'},{label:'Tension testée',value:'1.4 V'},{label:'On-Die ECC',value:'Oui'}]}]};
 const completion=getCatalogCompletion({...c,manufacturerPartNumber:'EXACT'},p);
 assert.equal(completion.technical.fields.find(f=>f.key==='voltage')?.state,'conflicting');
 assert.equal(completion.technical.fields.find(f=>f.key==='hostEcc')?.state,'missing');
});
test('technical completeness does not imply a live price or visually reviewed reconstruction',()=>{
 const facts:Record<string,FieldEvidence>=Object.fromEntries(catalogTechnicalRequirements.ram.map(f=>[f.key,{value:'Explicitly documented test value',sourceURL:source.url,checkedAt:source.checkedAt}]));
 const completion=getCatalogCompletion({...c,manufacturerPartNumber:'EXACT'},product,{facts});
 assert.equal(completion.status,'ready');assert.equal(completion.pricing.status,'offer_missing');assert.equal(completion.visual.status,'reference_missing');assert.equal(completion.completeForUserRequest,false);
});
test('changing the MPN invalidates inherited facts and a missing photo does not validate fidelity',()=>{
 const completion=getCatalogCompletion({...c,manufacturerPartNumber:'OTHER'},product,{facts:{capacity:{value:32,sourceURL:source.url,checkedAt:source.checkedAt}},visual:{fidelity:'reconstructed'}});
 assert.equal(completion.status,'source_missing');assert.equal(completion.technical.fields.find(f=>f.key==='capacity')?.state,'present_unverified');assert.equal(completion.visual.status,'reference_missing');
});
test('an identity collision blocks technical and price completion without merging the records',()=>{
 const completion=getCatalogCompletion({...c,manufacturerPartNumber:'EXACT'},product,{identityConflict:true});
 assert.equal(completion.status,'identity_missing');assert.equal(completion.identity.conflict,true);assert.equal(completion.identity.matchedPrimaryRecord,false);assert.equal(completion.completeForUserRequest,false);
});
test('not-applicable facts require a source and an explicit explanation',()=>{
 const base={...c,manufacturerPartNumber:'EXACT'};
 assert.equal(getCatalogCompletion(base,product,{facts:{hostEcc:{value:null,sourceURL:source.url,checkedAt:source.checkedAt,notApplicable:true}}}).technical.fields.find(f=>f.key==='hostEcc')?.state,'missing');
 assert.equal(getCatalogCompletion(base,product,{facts:{hostEcc:{value:false,sourceURL:source.url,checkedAt:source.checkedAt}}}).technical.fields.find(f=>f.key==='hostEcc')?.state,'documented');
});
test('unpublished or unconfirmed text does not document a field',()=>{
 for(const value of ['Non publié par le fabricant','Non confirmé','À vérifier sur le modèle exact','Not specified by manufacturer','To be confirmed','N/A']){
  const p={...product,groups:[{title:'Specifications',rows:[{label:'Tension testée',value}]}]};
  assert.equal(getCatalogCompletion({...c,manufacturerPartNumber:'EXACT'},p).technical.fields.find(f=>f.key==='voltage')?.state,'missing',value);
 }
});
test('decimal capacity units coalesce while different capacities remain contradictory',()=>{
 const base:Component={...c,category:'storage',manufacturerPartNumber:'EXACT'};
 const p={...product,groups:[{title:'Specifications',rows:[{label:'Capacité',value:'2 To'},{label:'SSD Capacity',value:'2000 GB'}]}]};
 assert.equal(getCatalogCompletion(base,p).technical.fields.find(f=>f.key==='capacity')?.state,'documented');
 const conflicting={...p,groups:[...p.groups,{title:'Other',rows:[{label:'Capacité',value:'4 TB'}]}]};
 assert.equal(getCatalogCompletion(base,conflicting).technical.fields.find(f=>f.key==='capacity')?.state,'conflicting');
});
test('combined manufacturer rows prove only explicitly identifiable facts',()=>{
 const base:Component={...c,category:'gpu',manufacturerPartNumber:'EXACT',capacityGB:undefined};
 const p={...product,groups:[{title:'Manufacturer',rows:[{label:'Mémoire vidéo',value:'16GB GDDR7'},{label:'Fréquences constructeur',value:'Boost: 2482 MHz'}]}]};
 const fields=getCatalogCompletion(base,p).technical.fields;
 assert.equal(fields.find(f=>f.key==='vram')?.value,'16 GB');
 assert.equal(fields.find(f=>f.key==='vramType')?.value,'GDDR7');
 assert.equal(fields.find(f=>f.key==='memoryBus')?.state,'missing');
 assert.equal(fields.find(f=>f.key==='boostClock')?.state,'documented');
 const board:Component={...base,category:'motherboard'};
 const boardProduct={...product,groups:[{title:'Manufacturer',rows:[{label:'Mémoire',value:'4 × DDR5 · 256 Go maximum · EXPO'},{label:'Stockage',value:'3 × M.2 PCIe 4.0 · 6 × SATA'}]}]};
 const boardFields=getCatalogCompletion(board,boardProduct).technical.fields;
 for(const key of ['memoryType','memoryCapacity','memorySlots','m2'])assert.equal(boardFields.find(f=>f.key===key)?.state,'documented',key);
 assert.equal(boardFields.find(f=>f.key==='cpuSupport')?.state,'missing');
});
test('field source mapping is explicit and cannot introduce unregistered references',()=>{
 const p={...product,sources:[source,{...source,url:'https://retailer.test/exact',kind:'retailer' as const}],groups:[{title:'Manufacturer specifications',rows:[{label:'Tested Voltage',value:'1.4 V'}]}]};
 const base={...c,manufacturerPartNumber:'EXACT'};
 const unscoped=getCatalogCompletion(base,p).technical.fields.find(f=>f.key==='voltage');
 assert.equal(unscoped?.sourceScope,'record');
 const scoped=getCatalogCompletion(base,p,{sourceMap:{groups:{'Manufacturer specifications':[source.url,'https://unregistered.test']}}}).technical.fields.find(f=>f.key==='voltage');
 assert.equal(scoped?.sourceScope,'field');assert.deepEqual(scoped?.sourceURLs,[source.url]);
});
test('manufacturer part punctuation is preserved when matching evidence',()=>{
 const completion=getCatalogCompletion({...c,manufacturerPartNumber:'EX-ACT'},product);
 assert.equal(completion.status,'source_missing');assert.equal(completion.identity.matchedPrimaryRecord,false);
});
test('CPU labels and strictly equivalent units do not create false conflicts',()=>{
 const base:Component={...c,category:'cpu',manufacturerPartNumber:'EXACT'};
 const p={...product,groups:[{title:'Specifications',rows:[
  {label:'Socket',value:'AM5'},{label:'Support du processeur',value:'AMD AM5'},
  {label:'TDP',value:'120W'},{label:'Default TDP',value:'120 W'},
  {label:'Cache L3',value:'96 MB'},{label:'Mémoire cache du processeur',value:'96 Mo'},
  {label:'Max. Boost Clock',value:'Up to 5.0GHz'},{label:'Fréquence en mode Turbo',value:'5 GHz'},
  {label:'Nombre de core',value:'8'},{label:'Fréquence CPU',value:'4.2 GHz'},
  {label:'Type de contrôleur mémoire',value:'Dual Channel'},
 ]}]};
 const fields=getCatalogCompletion(base,p).technical.fields;
 for(const key of ['socket','thermalPower','cache','boostClock','cores','baseClock','memoryChannels'])assert.equal(fields.find(f=>f.key===key)?.state,'documented',key);
 assert.equal(fields.find(f=>f.key==='memory')?.state,'missing','channels do not establish DDR generation');
 const conflict={...p,groups:[...p.groups,{title:'Other',rows:[{label:'TDP',value:'125 W'},{label:'Socket',value:'AM4'},{label:'Cache L3',value:'96 KB'}]}]};
 const conflictFields=getCatalogCompletion(base,conflict).technical.fields;
 for(const key of ['socket','thermalPower','cache'])assert.equal(conflictFields.find(f=>f.key===key)?.state,'conflicting',key);
});
test('an empty CPU sheet remains technically incomplete',()=>{
 const completion=getCatalogCompletion({...c,category:'cpu',manufacturerPartNumber:'EXACT'},product);
 assert.equal(completion.status,'technical_missing');assert.equal(completion.technical.documented,0);
});
test('Intel processor base power and maximum turbo power document separate fields',()=>{
 const p={...product,groups:[{title:'Intel',rows:[{label:'Puissance de base du processeur (PBP)',value:'125 W'},{label:'Puissance électrique maximale Turbo (MTP)',value:'181 W'}]}]};
 const fields=getCatalogCompletion({...c,category:'cpu',manufacturerPartNumber:'EXACT'},p).technical.fields;
 assert.equal(fields.find(f=>f.key==='thermalPower')?.value,'125 W');
 assert.equal(fields.find(f=>f.key==='thermalPower')?.state,'documented');
 assert.equal(fields.find(f=>f.key==='electricalPower')?.value,'181 W');
 assert.equal(fields.find(f=>f.key==='electricalPower')?.state,'documented');
 const amd={...product,groups:[{title:'AMD',rows:[{label:'TDP nominal',value:'120 W'}]}]};
 assert.equal(getCatalogCompletion({...c,category:'cpu',manufacturerPartNumber:'EXACT'},amd).technical.fields.find(f=>f.key==='electricalPower')?.state,'missing');
});
test('combined SSD rows preserve read/write order, interface lanes and warranty conditions',()=>{
 const p={...product,groups:[{title:'Samsung',rows:[
  {label:'Format et interface',value:'M.2 2280 · PCIe 5.0 ×4 · NVMe 2.0'},
  {label:'Lecture / écriture séquentielle maximale',value:'14 700 / 13 400 Mo/s'},
  {label:'Mémoire flash',value:'Samsung V-NAND TLC'},
  {label:'Endurance et garantie limitée',value:'1 200 To écrits (TBW) ou 5 ans, première limite atteinte'},
  {label:'Refroidissement',value:'Module nu ; refroidissement M.2 de la carte mère'},
 ]}]};
 const fields=getCatalogCompletion({...c,category:'storage',manufacturerPartNumber:'EXACT'},p).technical.fields;
 assert.equal(fields.find(f=>f.key==='formFactor')?.value,'M.2 2280');
 assert.equal(fields.find(f=>f.key==='interfaceGeneration')?.value,'PCIe 5.0 x4');
 assert.equal(fields.find(f=>f.key==='read')?.value,'14 700 Mo/s');
 assert.equal(fields.find(f=>f.key==='write')?.value,'13 400 Mo/s');
 for(const key of ['nand','endurance','warranty','heatsink'])assert.equal(fields.find(f=>f.key===key)?.state,'documented',key);
 assert.match(String(fields.find(f=>f.key==='warranty')?.value),/première limite atteinte/);
});
test('a PSU connector group requires each explicit connector role',()=>{
 const rows=[{label:'Carte mère',value:'1 × ATX 20+4'},{label:'Processeur',value:'1 × EPS P8'},{label:'Carte graphique PCIe classique',value:'3 × 6+2 broches'},{label:'Périphériques',value:'7 × SATA · 1 × PATA'}];
 const base:Component={...c,category:'psu',manufacturerPartNumber:'EXACT'};
 const p={...product,groups:[{title:'Connecteurs et câbles',rows}]};
 assert.equal(getCatalogCompletion(base,p).technical.fields.find(f=>f.key==='connectors')?.state,'documented');
 const missing={...product,groups:[{title:'Connecteurs et câbles',rows:rows.filter(row=>row.label!=='Processeur')}]};
 assert.equal(getCatalogCompletion(base,missing).technical.fields.find(f=>f.key==='connectors')?.state,'missing');
});
test('the five reviewed B850 fields use the registered manual and its full restrictions',()=>{
 const id='import-mb-fd057324a4a8',review=catalogFieldEvidence[id],manual=Object.values(review.fields)[0];
 const base:Component={...c,id,category:'motherboard',manufacturerPartNumber:review.mpn};
 const p:VerifiedProduct={...product,mpn:review.mpn,sources:[{...source,url:manual.sourceURL,checkedAt:manual.checkedAt}],groups:[{title:'Résumé',rows:[{label:'Audio',value:'Realtek ALC4082 · 7.1'}]},{title:'Manuel',rows:[{label:'Audio',value:String(review.fields.audio.value)}]}]};
 const fields=getCatalogCompletion(base,p).technical.fields;
 for(const key of ['storagePorts','pcie','network','audio','cpuSupport']){
  const field=fields.find(field=>field.key===key);
  assert.equal(field?.state,'documented',key);assert.equal(field?.proof,'supplied_evidence');assert.equal(field?.sourceScope,'field');
  assert.deepEqual(field?.sourceURLs,[manual.sourceURL]);
 }
 assert.match(String(fields.find(field=>field.key==='pcie')?.value),/M2_4 is occupied, PCIE2 will be disabled/);
 const missingSource=getCatalogCompletion(base,{...p,sources:[source]}).technical.fields;
 assert.equal(missingSource.find(field=>field.key==='audio')?.state,'conflicting');
 const changedMPN=getCatalogCompletion({...base,manufacturerPartNumber:'OTHER'},{...p,mpn:'OTHER'}).technical.fields;
 assert.equal(changedMPN.find(field=>field.key==='audio')?.state,'conflicting');
});
