import test from 'node:test';
import assert from 'node:assert/strict';
import type {Component} from '../src/data/catalog.ts';
import type {VerifiedProduct} from '../src/data/verifiedTypes.ts';
import {extractVerifiedCompatibility} from '../src/lib/verifiedCompatibility.ts';

const component=(category:Component['category'],patch:Partial<Component>={}):Component=>({id:'test',category,brand:'Test',name:'Exact',manufacturerPartNumber:'EXACT',price:0,priceStatus:'unknown',description:'',specs:[],...patch});
const product=(rows:Array<[string,string]>):VerifiedProduct=>({mpn:'EXACT',identityNote:'',sources:[{name:'Primary',url:'https://example.test/exact',checkedAt:'2026-11-10T10:00:00Z',kind:'retailer'}],groups:[{title:'Primary exact model',rows:rows.map(([label,value])=>({label,value}))}],offers:[],notes:[],patch:{}});

test('explicit product identity and category gate each technical field',()=>{
 const p=product([['Nombre de slot(s) M.2','4'],['Mémoire interne maximale','256 Go']]);
 assert.deepEqual(extractVerifiedCompatibility(component('motherboard'),p).patch,{m2Slots:4,maxMemoryGB:256});
 assert.deepEqual(extractVerifiedCompatibility(component('gpu'),p).patch,{});
 assert.deepEqual(extractVerifiedCompatibility(component('motherboard',{manufacturerPartNumber:'OTHER'}),p).patch,{});
});
test('only missing values are filled and contradictory source values remain unresolved',()=>{
 const p=product([['Nombre de slot(s) M.2','3'],["Nombre d'emplacements M.2 (M)",'4']]);
 const r=extractVerifiedCompatibility(component('motherboard'),p);
 assert.equal(r.patch.m2Slots,undefined);assert.equal(r.conflicts[0].field,'m2Slots');
 const existing=extractVerifiedCompatibility(component('motherboard',{m2Slots:2}),product([['Nombre de slot(s) M.2','3']]));
 assert.equal(existing.patch.m2Slots,undefined);assert.equal(existing.conflicts[0].existing,2);
});
test('CPU TDP, GPU system requirements and packaging never become board power or dimensions',()=>{
 const p=product([['Enveloppe thermique (TDP, Thermal Design Power)','120 W'],['Alimentation minimale du système','750 W'],['Hauteur du colis','300 mm'],['Largeur du colis','400 mm'],['Profondeur du colis','500 mm']]);
 assert.deepEqual(extractVerifiedCompatibility(component('cpu'),p).patch,{});
 assert.deepEqual(extractVerifiedCompatibility(component('gpu'),p).patch,{recommendedPsuW:750});
});
test('explicit GPU board consumption is distinguished from the recommended system PSU',()=>{
 const r=extractVerifiedCompatibility(component('gpu'),product([['Puissance carte (TBP)','220 W'],['Alimentation minimale','650 W']]));
 assert.deepEqual(r.patch,{powerW:220,recommendedPsuW:650});assert.equal(r.evidence.length,2);
});
test('RAM tested voltage and explicit profile support exclude SPD, VPP and on-die ECC',()=>{
 const r=extractVerifiedCompatibility(component('ram'),product([['Tension testée','1,35 V'],['Tension SPD','1,1 V'],['Tension de programmation (VPP)','1,8 V'],['On-Die ECC','Oui'],["Profil de mémoire Intel® Extreme (XMP)",'Oui'],["AMD EXPO (profils étendus pour l’overclocking)",'Oui']]));
 assert.deepEqual(r.patch,{memoryVoltageV:1.35,memoryProfile:'EXPO/XMP'});
 const invalid=extractVerifiedCompatibility(component('ram'),product([['Tension mémoire','1,1,1,4 V'],['Tension SPD','1,1 V'],['ECC sur matrice','Oui']]));
 assert.deepEqual(invalid.patch,{});
});
test('an explicitly denied memory profile conflicts with a positive source claim',()=>{
 const p=product([["Module XMP d'Intel®",'Oui'],["Profil de mémoire Intel® Extreme (XMP)",'Non']]);
 const r=extractVerifiedCompatibility(component('ram'),p);
 assert.equal(r.patch.memoryProfile,undefined);assert.equal(r.conflicts[0].field,'memoryProfile');
});
test('rotated GPU dimensions require three axes and a matching known board length',()=>{
 const p=product([['Largeur','300 mm'],['Hauteur','50 mm'],['Profondeur','130 mm']]);
 assert.deepEqual(extractVerifiedCompatibility(component('gpu',{lengthMm:300}),p).patch,{thicknessMm:50,heightMm:130});
 assert.deepEqual(extractVerifiedCompatibility(component('gpu',{lengthMm:320}),p).patch,{});
});
test('PSU dimensions are normalized only when their source values establish the chassis orientation',()=>{
 const p=product([['Largeur','86 mm'],['Hauteur','150 mm'],['Profondeur','160 mm']]);
 assert.deepEqual(extractVerifiedCompatibility(component('psu',{psuFormat:'ATX'}),p).patch,{heightMm:86,widthMm:150,depthMm:160});
 assert.deepEqual(extractVerifiedCompatibility(component('psu',{psuFormat:'SFX'}),p).patch,{});
});
