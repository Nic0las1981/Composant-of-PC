import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,type Component,getComponent} from '../src/data/catalog.ts';
import {getVisualProfile,getGpuProfile,getStorageProfile,getPsuProfile,getBoardProfile} from '../src/data/visualProfiles.ts';

const genericGpu=catalog.find(c=>c.category==='gpu'&&getVisualProfile(c.id)?.fidelity==='schematic')!;

test('newly documented GPU dimensions and fan count reach rendering without mutating the schematic template or hardware',()=>{
 const template=getGpuProfile(genericGpu.id)!;
 const before=JSON.stringify(template);
 const component:Component={...genericGpu,lengthMm:312,heightMm:124,thicknessMm:55,fanCount:3,fanSizeMm:95};
 const hardware=JSON.stringify(component);
 const rendered=getGpuProfile(component)!;
 assert.deepEqual([rendered.lengthMm,rendered.heightMm,rendered.thicknessMm,rendered.fanCount,rendered.fanSizeMm],[312,124,55,3,95]);
 assert.equal(rendered.fidelity,'schematic');
 assert.equal(rendered.rgb,template.rgb);assert.equal(rendered.fanRgb,template.fanRgb);
 assert.equal(JSON.stringify(getGpuProfile(genericGpu.id)),before);
 assert.equal(JSON.stringify(component),hardware);
});

test('missing, non-finite and invalid dimensions cannot replace an existing visual envelope',()=>{
 const template=getGpuProfile(genericGpu.id)!;
 const rendered=getGpuProfile({...genericGpu,lengthMm:undefined,heightMm:Number.NaN,thicknessMm:-1,fanCount:1.5,fanSizeMm:Number.POSITIVE_INFINITY})!;
 assert.deepEqual([rendered.lengthMm,rendered.heightMm,rendered.thicknessMm,rendered.fanCount,rendered.fanSizeMm],[template.lengthMm,template.heightMm,template.thicknessMm,template.fanCount,template.fanSizeMm]);
 assert.equal(getGpuProfile({...genericGpu,fanCount:0})?.fanCount,0,'An explicitly passive board must not receive a fallback fan');
});

test('unambiguous SSD, PSU and board axes follow the selected component metadata',()=>{
 const ssd=getComponent('import-ssd-8a91162ac077')!;
 const storage=getStorageProfile({...ssd,lengthMm:80.15,widthMm:22.15,heightMm:2.38})!;
 assert.deepEqual([storage.lengthMm,storage.widthMm,storage.heightMm],[80.15,22.15,2.38]);
 const psu=getComponent('import-psu-3f7709be66e0')!;
 const power=getPsuProfile({...psu,widthMm:150,heightMm:86,depthMm:160,fanSizeMm:140})!;
 assert.deepEqual([power.widthMm,power.heightMm,power.depthMm,power.fanSizeMm],[150,86,160,140]);
 const board=getComponent('import-mb-fd057324a4a8')!;
 const motherboard=getBoardProfile({...board,widthMm:244,heightMm:305,memorySlots:4})!;
 assert.deepEqual([motherboard.widthMm,motherboard.heightMm,motherboard.slots],[244,305,4]);
 assert.equal(getGpuProfile({...genericGpu,category:'storage'}),undefined);
});

test('documented sibling profiles keep independent identities and exclude heatsink and black-memory variants',()=>{
 for(const id of ['import-ssd-af0ab1572ccd','import-ssd-40f0be19dbba']){
  const profile=getStorageProfile(getComponent(id))!;assert.equal(profile.id,id);assert.equal(profile.design,'samsung-9100-pro');assert.equal(profile.hasHeatsink,false);
 }
 for(const id of ['import-psu-01e3e8ba588f','import-psu-a92896f7672c']){
  const profile=getPsuProfile(getComponent(id))!;assert.equal(profile.id,id);assert.equal(profile.design,'power-zone-2');assert.equal(profile.depthMm,160);
 }
 assert.notEqual(getVisualProfile('import-ram-58c3e94a3f4e')?.design,'crucial-pro-overclocking');
 assert.notEqual(getVisualProfile('import-ssd-75da0010ebfd')?.design,'samsung-9100-pro');
});
