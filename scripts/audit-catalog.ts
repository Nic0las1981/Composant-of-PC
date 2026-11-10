import {writeFileSync} from 'node:fs';
import {catalog} from '../src/data/catalog.ts';
import {verifiedProducts} from '../src/data/verifiedCatalog.ts';
import {getVerifiedOffer} from '../src/lib/verifiedOffers.ts';

const products=Object.values(verifiedProducts);
const report={
  generatedAt:new Date().toISOString(),
  variants:catalog.length,
  reviewedReferences:products.length,
  datedOffers:products.flatMap(p=>p.offers).length,
  referencesWithEligibleOffer:catalog.filter(c=>getVerifiedOffer(c)).length,
  historicalOffers:products.flatMap(p=>p.offers).filter(o=>o.priceKind==='last_known').length,
  manufacturerCheckedReferences:products.filter(p=>p.sources.some(s=>s.kind==='manufacturer')).length,
  // Unknown and unreviewed are distinct from a verified missing offer.
  remaining:catalog.filter(c=>!verifiedProducts[c.id]).map(c=>({id:c.id,name:c.name,brand:c.brand,category:c.category,
    status:c.source?'archive_not_individually_reviewed':'no_exact_primary_page_accepted',originalSource:c.source?.url??null})),
};
writeFileSync(new URL('../data/catalog-verification-report.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,remaining:report.remaining.length},null,2));
