import {catalog} from '../src/data/catalog.ts';
import {verifiedProducts} from '../src/data/verifiedCatalog.ts';
import {writeFileSync, mkdirSync, existsSync, readFileSync} from 'node:fs';
const paths = process.argv.slice(2);
const products = {...verifiedProducts};
for (const path of paths) {
  if (!existsSync(path)) throw new Error(`Missing product input ${path}`);
  Object.assign(products, JSON.parse(readFileSync(path,'utf8')));
}
mkdirSync('data/deep-review/prices', {recursive:true});
const input=catalog.flatMap(c => {
  const p=products[c.id];
  return p?.mpn && p.identityKind !== 'manufacturer-model' ? [{id:c.id,category:c.category,brand:c.brand,name:c.name,mpn:p.mpn,sources:p.sources,offers:p.offers}] : [];
});
writeFileSync('data/deep-review/prices/input.json',JSON.stringify(input,null,2));
console.log(`${input.length} identités pour recherche de prix exacts`);
