import {mkdirSync,writeFileSync} from 'node:fs';
import {catalog,categories} from '../src/data/catalog.ts';
import {deepProducts} from '../src/data/deepCatalog.ts';
import {getVerifiedProduct,getVerifiedOffer} from '../src/lib/verifiedOffers.ts';
import {getProductImage} from '../src/data/productImages.ts';
import {getMemoryAppearance} from '../src/data/memoryAppearance.ts';
import {getCatalogCompletion} from '../src/lib/catalogCompletion.ts';
import {getCatalogGroups} from '../src/lib/catalogVariants.ts';
const now=Date.now();
const records=catalog.map(component=>{
  const product=getVerifiedProduct(component),photo=getProductImage(component);
  const technical=getCatalogCompletion(component,product,{now}).technical;
  return {id:component.id,category:component.category,name:component.name,brand:component.brand,
    primaryRecord:!!product,deepPass:!!deepProducts[component.id],
    identity:!product?'unresolved':product.identityKind==='manufacturer-model'?'manufacturer-model':'mpn',
    mpn:product?.mpn||null,manufacturerModel:product?.manufacturerModel||null,
    manufacturerSource:product?.sources.some(source=>source.kind==='manufacturer')??false,
    technicalRows:product?.groups.reduce((n,g)=>n+g.rows.length,0)??0,
    checklist:{documented:technical.documented,required:technical.total,complete:technical.documented===technical.total,unresolved:technical.fields.filter(f=>f.state!=='documented').map(f=>({key:f.key,state:f.state}))},
    currentFrenchOffer:!!getVerifiedOffer(component,now),offerObservations:product?.offers.length??0,
    photo:photo?.inspection??null,sourceURLs:product?.sources.map(s=>s.url)??[]};
});
const summary={generatedAt:new Date(now).toISOString(),total:catalog.length,displayGroups:getCatalogGroups().length,
  documentedRecords:records.filter(r=>r.primaryRecord).length,manufacturerRecords:records.filter(r=>r.manufacturerSource).length,
  commercialMPNs:records.filter(r=>r.identity==='mpn').length,manufacturerModels:records.filter(r=>r.identity==='manufacturer-model').length,
  unresolvedIdentities:records.filter(r=>!r.primaryRecord).length,deepRecords:records.filter(r=>r.deepPass).length,
  sourceTechnicalRows:records.reduce((n,r)=>n+r.technicalRows,0),currentFrenchOffers:records.filter(r=>r.currentFrenchOffer).length,
  technicallyComplete:records.filter(r=>r.checklist.complete).length,
  offerObservations:records.reduce((n,r)=>n+r.offerObservations,0),
  photoAssets:records.filter(r=>r.photo).length,visuallyInspectedPhotoAssets:records.filter(r=>r.photo==='visually-inspected').length,
  manufacturerCadCoolers:5,
  individuallyReconstructedMemory:catalog.filter(component=>!!getMemoryAppearance(component)).length,
  byCategory:Object.fromEntries(categories.map(({id})=>{const subset=records.filter(r=>r.category===id);return [id,{total:subset.length,documented:subset.filter(r=>r.primaryRecord).length,deep:subset.filter(r=>r.deepPass).length,technicallyComplete:subset.filter(r=>r.checklist.complete).length,currentFrenchOffers:subset.filter(r=>r.currentFrenchOffer).length,technicalRows:subset.reduce((n,r)=>n+r.technicalRows,0)}]}))};
mkdirSync('data/deep-review',{recursive:true});
writeFileSync('data/deep-review/release-audit.json',JSON.stringify({summary,records},null,2)+'\n');
writeFileSync('data/deep-review/summary.json',JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
