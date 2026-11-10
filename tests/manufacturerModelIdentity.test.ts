import test from 'node:test';
import assert from 'node:assert/strict';
import type {Component} from '../src/data/catalog.ts';
import {verifiedProducts} from '../src/data/verifiedCatalog.ts';
import {matchesProductIdentity, type VerifiedProduct} from '../src/data/verifiedTypes.ts';
import {extractVerifiedCompatibility} from '../src/lib/verifiedCompatibility.ts';
import {getVerifiedOffer,getVerifiedProduct} from '../src/lib/verifiedOffers.ts';
import {getCatalogCompletion} from '../src/lib/catalogCompletion.ts';
import {getProductDetails} from '../src/lib/productDetails.ts';

test('a uniquely documented manufacturer model exposes facts without inventing a sales MPN or admitting a price',()=>{
  const component:Component={id:'test-manufacturer-model',category:'gpu',brand:'Example',name:'Exact OC 16GB White',manufacturerModel:'Exact OC 16GB White',price:0,description:'',specs:[]};
  const record:VerifiedProduct={identityKind:'manufacturer-model',manufacturerModel:component.manufacturerModel,mpn:'',identityNote:'Exact model; commercial MPN not published.',
    sources:[{name:'Manufacturer',kind:'manufacturer',url:'https://example.com/exact-oc-16gb-white',checkedAt:'2026-11-10T12:00:00Z'}],
    groups:[{title:'Electrical',rows:[{label:'Consommation',value:'300 W'}]}],patch:{},notes:[],
    offers:[{retailer:'Example',seller:'Example',url:'https://example.com/offer',productName:component.name,mpn:'',amount:100,currency:'EUR',market:'FR',condition:'new',availability:'in_stock',priceKind:'current',shipping:null,shippingNote:'',checkedAt:'2026-11-10T12:00:00Z'}]};
  assert.equal(matchesProductIdentity(component,record),true);
  assert.equal(matchesProductIdentity({...component,manufacturerModel:'Exact OC 8GB White'},record),false);
  assert.equal(matchesProductIdentity({...component,manufacturerModel:undefined,manufacturerPartNumber:component.manufacturerModel},record),false);
  assert.equal(extractVerifiedCompatibility(component,record).patch.powerW,300);
  verifiedProducts[component.id]=record;
  try {
    assert.equal(getVerifiedProduct(component),record);
    assert.equal(getVerifiedOffer(component,Date.parse('2026-11-10T13:00:00Z')),undefined);
    const details=getProductDetails(component).groups.flatMap(g=>g.rows);
    assert.ok(details.some(r=>r.label==='Désignation exacte du modèle'&&r.value===component.manufacturerModel));
    assert.ok(!details.some(r=>r.label==='Référence fabricant (MPN)'));
    const completion=getCatalogCompletion(component,record,{now:Date.parse('2026-11-10T13:00:00Z')});
    assert.equal(completion.status,'technical_missing');
    assert.equal(completion.identity.kind,'manufacturer-model');
    assert.equal(completion.identity.mpn,null);
    assert.equal(completion.identity.manufacturerSource,true);
    assert.equal(completion.pricing.eligibleOffers,0);
    assert.equal(completion.completeForUserRequest,false);
  } finally { delete verifiedProducts[component.id]; }
});
