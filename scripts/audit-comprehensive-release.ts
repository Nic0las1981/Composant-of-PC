import {writeFileSync} from 'node:fs';
import {catalog} from '../src/data/catalog.ts';
import {verifiedProducts} from '../src/data/verifiedCatalog.ts';
import {comprehensiveProducts} from '../src/data/comprehensiveCatalog.ts';
import {catalogQuarantine} from '../src/data/catalogQuarantine.ts';
import {getVerifiedOffer} from '../src/lib/verifiedOffers.ts';
import {getCatalogGroups} from '../src/lib/catalogVariants.ts';

const products=Object.values(verifiedProducts);
const reviewed=catalog.filter(c=>comprehensiveProducts[c.id]);
const report={
 checkedAt:new Date().toISOString(),variants:catalog.length,models:getCatalogGroups().length,
 comprehensive:reviewed.length,
 byCategory:Object.fromEntries([...new Set(reviewed.map(c=>c.category))].map(category=>[category,reviewed.filter(c=>c.category===category).length])),
 primary:products.length,manufacturer:products.filter(p=>p.sources.some(s=>s.kind==='manufacturer')).length,
 observations:products.flatMap(p=>p.offers).length,eligible:catalog.filter(c=>getVerifiedOffer(c)).length,
 quarantined:Object.keys(catalogQuarantine).length,blocked:Object.keys(catalogQuarantine).filter(id=>!verifiedProducts[id]).length,
};
writeFileSync(new URL('../data/comprehensive-review/release-summary.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
