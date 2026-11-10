import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {getComponent} from '../src/data/catalog.ts';
import {getVisualProfile} from '../src/data/visualProfiles.ts';
import ProductArt from '../src/components/ProductArt.tsx';

const draw=(id:string,patch={})=>{const component={...getComponent(id)!,...patch};return renderToStaticMarkup(createElement(ProductArt,{component,category:component.category,detailed:true}));};

test('individually reconstructed profiles are selected by exact catalogue ID rather than a similar family name',()=>{
 const profiles=[['import-mb-fd057324a4a8','steel-legend-b850'],['import-gpu-a682aa002297','steel-legend-rx9060xt'],['import-ram-8b162aa67690','crucial-pro-overclocking'],['import-ssd-8a91162ac077','samsung-9100-pro'],['import-psu-3f7709be66e0','power-zone-2']];
 for(const [id,design] of profiles){assert.equal(getVisualProfile(id)?.design,design);assert.ok(draw(id).includes(`data-model-art="${design}"`));}
 assert.equal(getVisualProfile('import-ram-58c3e94a3f4e')?.design,undefined,'A white kit reconstruction must not paint the black kit white');
 assert.equal(getVisualProfile('import-ssd-75da0010ebfd')?.design,undefined,'The heatsink model must not acquire the bare drive artwork');
});

test('Crucial artwork preserves installed module count and does not add RGB to the white non-RGB kit',()=>{
 const id='import-ram-8b162aa67690';
 assert.equal((draw(id).match(/data-memory-module=/g)||[]).length,2);
 const three=draw(id,{memorySticks:3});
 assert.equal((three.match(/data-memory-module=/g)||[]).length,3);
 assert.doesNotMatch(three,/data-rgb-zone=/);
});

test('Steel Legend has three translucent ARGB fans while Power Zone 2 retains a mesh-covered non-RGB shell',()=>{
 const gpu=draw('import-gpu-a682aa002297');
 assert.equal((gpu.match(/data-model-fan="translucent-argb"/g)||[]).length,3);
 assert.match(gpu,/STEEL LEGEND/);
 const psu=draw('import-psu-3f7709be66e0');
 assert.match(psu,/POWER ZONE 2/);assert.doesNotMatch(psu,/data-rgb-zone=/);
});
