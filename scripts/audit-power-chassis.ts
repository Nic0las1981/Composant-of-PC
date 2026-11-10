import fs from 'node:fs';
import {catalog} from '../src/data/catalog.ts';
import {verifiedProducts} from '../src/data/verifiedCatalog.ts';
import {comprehensivePowerChassisRecords} from '../src/data/comprehensivePowerChassis.ts';
import {getMissingCompatibilityFields} from '../src/lib/componentCoverage.ts';
const bad:Record<string,string>={
'import-psu-9767fc1c34d6':'La correspondance SGX 650 concerne un bloc SFX-L ; le catalogue indique FOCUS Plus 650 Gold ATX. Référence et génération à identifier, offre écartée.',
'import-psu-2be5c9ba113a':'MPG A1000G sans mention PCIE5 a été relié au MPN du modèle PCIE5 ; la révision exacte doit être confirmée avant réutilisation des offres et dimensions.',
};
const ids=new Set(['cpu','psu','cooler','case']);
const products=catalog.filter(c=>ids.has(c.category)).map(base=>{
 const verified=comprehensivePowerChassisRecords[base.id]??verifiedProducts[base.id];
 const c={...base,...verified?.patch};
 const missing=getMissingCompatibilityFields(c).map(x=>x.key as string);
 const extra:Record<string,string[]>={cpu:[],psu:['fanSizeMm'],cooler:c.coolingType==='aio'?['radiatorLengthMm','radiatorWidthMm','fanCount','fanSizeMm']:['widthMm','depthMm','fanCount','fanSizeMm'],case:['widthMm','heightMm','depthMm','fanCount']};
 const missingPhysical=(extra[c.category]??[]).filter(k=>(c as any)[k]==null);
 const identity=Boolean(verified?.mpn&&verified.sources.length&&!bad[c.id]);
 const offers=(verified?.offers??[]).filter(o=>o.market==='FR'&&o.currency==='EUR'&&o.condition==='new'&&o.availability==='in_stock'&&o.priceKind==='current'&&o.mpn===verified?.mpn);
 const status=!identity?'missing_identity':missing.length?'missing_specifications':!offers.length?'specifications_ready_price_missing':'READY';
 const reason=!identity?(bad[c.id]??`Aucun rapprochement primaire exact avec un MPN/une révision et une région commerciale pour « ${c.brand} ${c.name} ». La ligne d’archive ne constitue pas une offre française ni une fiche fabricant.`):missing.length?'Les sources exactes sont identifiées, mais les champs de compatibilité indiqués restent absents.':!offers.length?'Fiche exacte identifiée ; aucun prix neuf en stock français, individuel et daté, accepté pour cette référence.':'Identité et champs nécessaires aux contrôles de compatibilité documentés ; au moins une offre exacte neuve en stock en France. Les champs physiques supplémentaires éventuels restent explicitement listés.';
 return {id:c.id,category:c.category,brand:c.brand,name:c.name,status,manufacturerPartNumber:identity?verified!.mpn:null,reason,missingIdentityFields:identity?[]:['manufacturerPartNumber','exactRevision','primaryProductSource'],missingCompatibilityFields:missing,missingAdditionalPhysicalFields:missingPhysical,priceStatus:offers.length?'verified_new_in_stock':'missing_current_exact_offer',verifiedOffers:offers.map(o=>({retailer:o.retailer,seller:o.seller,amount:o.amount,currency:o.currency,checkedAt:o.checkedAt,url:o.url})),sources:verified?.sources??[],archive:base.source??null};
});
const counts:Record<string,number>={};for(const p of products)counts[p.status]=(counts[p.status]??0)+1;
fs.writeFileSync(new URL('../data/comprehensive-review/power-chassis.json',import.meta.url),JSON.stringify({generatedAt:new Date().toISOString(),scope:['cpu','psu','cooler','case'],definition:'READY signifie identité, champs requis par les contrôles de compatibilité et prix primaire neuf en stock FR. Cela ne certifie pas un montage ni tous les détails physiques du fabricant. Les mesures du rendu 3D ne servent jamais de preuve.',summary:{total:products.length,...counts},products},null,2));
console.log({total:products.length,...counts});
