import {readFileSync,writeFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {catalog,type Component} from '../src/data/catalog.ts';
import {verifiedProducts} from '../src/data/verifiedCatalog.ts';
import {individualProducts} from '../src/data/individualCatalog.ts';
import {extractVerifiedCompatibility} from '../src/lib/verifiedCompatibility.ts';
import {getMissingCompatibilityFields} from '../src/lib/componentCoverage.ts';
import {getVerifiedOffer} from '../src/lib/verifiedOffers.ts';
const original=new Map((JSON.parse(gunzipSync(readFileSync(new URL('../data/full-review/input.json.gz',import.meta.url))).toString()) as Component[]).map(c=>[c.id,c]));
const rows=catalog.map(component=>{
  const product=verifiedProducts[component.id];
  const extraction=extractVerifiedCompatibility({...original.get(component.id)!,...product?.patch},product);
  return {id:component.id,category:component.category,name:component.name,status:individualProducts[component.id]?'individually_reviewed':extraction.evidence.length?'primary_metadata_integrated':'needs_individual_review',mpn:product?.mpn??null,missing:getMissingCompatibilityFields(component).map(f=>f.key),fieldsAdded:extraction.evidence,conflicts:extraction.conflicts,eligibleOffer:Boolean(getVerifiedOffer(component))};
});
const summary={generatedAt:new Date().toISOString(),total:catalog.length,individualReferences:Object.keys(individualProducts).length,individualOffers:Object.values(individualProducts).reduce((n,p)=>n+p.offers.length,0),metadataEnrichedReferences:rows.filter(r=>r.fieldsAdded.length).length,fieldsAdded:rows.reduce((n,r)=>n+new Set(r.fieldsAdded.map(f=>f.field)).size,0),referencesWithSourceConflicts:rows.filter(r=>r.conflicts.length).length,remainingIndividualReviews:rows.filter(r=>r.status!=='individually_reviewed').length};
writeFileSync(new URL('../data/individual-review/progress.json',import.meta.url),JSON.stringify({summary,components:rows},null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
