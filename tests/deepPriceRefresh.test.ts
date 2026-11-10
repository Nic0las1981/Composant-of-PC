import test from 'node:test';
import assert from 'node:assert/strict';
import type {VerifiedProduct,VerifiedOffer} from '../src/data/verifiedTypes.ts';
import {deepPriceRecords} from '../src/data/deepPriceCatalog.ts';
import {applyDeepPrices} from '../src/data/applyDeepPrices.ts';

test('a fresh exact-product observation removes an older quote even when no new admissible offer remains',()=>{
  const id='test-refresh-removal';
  const old:VerifiedOffer={retailer:'LDLC',seller:'LDLC',url:'https://www.ldlc.com/fiche/PB00000001.html',productName:'Exact 4 TB',mpn:'EXACT-4TB',amount:200,currency:'EUR',market:'FR',condition:'new',availability:'in_stock',priceKind:'current',shipping:null,shippingNote:'Unknown',checkedAt:'2026-11-10T10:00:00Z'};
  const product:VerifiedProduct={mpn:'EXACT-4TB',identityNote:'',groups:[],patch:{},offers:[old],notes:[],sources:[]};
  deepPriceRecords[id]=[{mpn:'EXACT-4TB',checkedURLs:[old.url],offers:[],sources:[{name:'LDLC',kind:'retailer',url:old.url,checkedAt:'2026-11-10T11:00:00Z'}]}];
  try {
    assert.deepEqual(applyDeepPrices(id,product).offers,[]);
    assert.equal(applyDeepPrices(id,{...product,mpn:'EXACT-2TB'}).offers[0],old);
    assert.deepEqual(applyDeepPrices(id,{...product,identityKind:'manufacturer-model',manufacturerModel:'Exact 4 TB',mpn:'',offers:[]}).offers,[]);
  } finally {delete deepPriceRecords[id];}
});
