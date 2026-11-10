import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {getComponent} from '../src/data/catalog.ts';
import {getVisualProfile,getStorageProfile,getCoolerProfile,getCaseProfile,getRamProfile,getGpuProfile} from '../src/data/visualProfiles.ts';
import ProductArt from '../src/components/ProductArt.tsx';

test('documented SSD heatsink presence and absence override stale visual templates in both renderers',()=>{
 const c=getComponent('import-ssd-6c1113df22d3')!;
 const before=JSON.stringify(c),template=JSON.stringify(getStorageProfile(c.id));
 assert.equal(c.storageHeatsink,true);
 assert.equal(getStorageProfile(c)?.hasHeatsink,true,'the shared 3D profile receives the documented MP600 PRO XT heatsink');
 assert.equal(getStorageProfile({...c,storageHeatsink:false})?.hasHeatsink,false);
 assert.equal(getStorageProfile({...c,storageHeatsink:undefined})?.hasHeatsink,getStorageProfile(c.id)?.hasHeatsink);
 for(const present of [true,false]){
  const svg=renderToStaticMarkup(createElement(ProductArt,{component:{...c,storageHeatsink:present},category:'storage'}));
  assert.equal(svg.includes('data-art-part="ssd-heatsink"'),present);
 }
 assert.equal(JSON.stringify(c),before);assert.equal(JSON.stringify(getStorageProfile(c.id)),template);
 assert.equal(getVisualProfile(c)?.fidelity,getVisualProfile(c.id)?.fidelity);
});

test('explicit lighting, construction and panel metadata reaches visual profiles without changing absent facts',()=>{
 const gpu=getComponent('gpu-4080s')!;
 assert.equal(getGpuProfile({...gpu,rgb:false,fanRgb:false})?.rgb,false);
 assert.equal(getGpuProfile({...gpu,rgb:false,fanRgb:false})?.fanRgb,false);
 assert.equal(getGpuProfile({...gpu,rgb:undefined,fanRgb:undefined})?.rgb,getGpuProfile(gpu.id)?.rgb);
 const ram=getComponent('ram-ddr5-32')!;
 assert.equal(getRamProfile({...ram,memoryHeatspreader:false})?.hasHeatspreader,false);
 assert.equal(getRamProfile({...ram,memoryHeatspreader:true})?.hasHeatspreader,true);
 const chassis=getComponent('case-h6')!;
 for(const sidePanel of ['glass','acrylic','vented'] as const){
  const p=getCaseProfile({...chassis,sidePanel})!;
  assert.equal(p.sidePanel,sidePanel);assert.equal(p.glass,sidePanel==='glass');
 }
});

test('radiator dimensions stay distinct from pump dimensions and invalid physical updates are ignored',()=>{
 const kraken=getComponent('cooler-kraken240')!;
 const p=getCoolerProfile(kraken)!;
 assert.deepEqual([p.radiatorLengthMm,p.radiatorWidthMm,p.radiatorThicknessMm],[275,123,30]);
 assert.deepEqual([p.heightMm,p.widthMm,p.depthMm],[55.97,74.7,74.7]);
 const changed=getCoolerProfile({...kraken,radiatorLengthMm:282,radiatorWidthMm:125,radiatorThicknessMm:32,pumpDisplay:'logo',fanRgb:true})!;
 assert.deepEqual([changed.radiatorLengthMm,changed.radiatorWidthMm,changed.radiatorThicknessMm,changed.pumpDisplay,changed.fanRgb],[282,125,32,'logo',true]);
 const invalid=getCoolerProfile({...kraken,radiatorLengthMm:Number.NaN,radiatorWidthMm:-1,radiatorThicknessMm:Infinity})!;
 const template=getCoolerProfile(kraken.id)!;
 assert.deepEqual([invalid.radiatorLengthMm,invalid.radiatorWidthMm,invalid.radiatorThicknessMm],[template.radiatorLengthMm,template.radiatorWidthMm,template.radiatorThicknessMm]);
 const air=getComponent('cooler-nhd15')!;
 assert.equal(getCoolerProfile({...air,heatpipeCount:8})?.heatpipes,8);
 assert.equal(getCoolerProfile({...air,heatpipeCount:0})?.heatpipes,0);
 assert.equal(getCoolerProfile({...air,heatpipeCount:1.5})?.heatpipes,getCoolerProfile(air.id)?.heatpipes);
});
