import type {VerifiedProduct} from './verifiedTypes.ts';
import {deepPriceRecords} from './deepPriceCatalog.ts';

const normalize=(s:string)=>s.trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
/** A fresher primary observation replaces the previous quote for that URL,
 * including when the exact product no longer exposes an admissible offer.
 * Model names without a commercial MPN never receive these offers.
 */
export function applyDeepPrices(id:string,product:VerifiedProduct):VerifiedProduct {
  if (!product.mpn || product.identityKind==='manufacturer-model') return product;
  const records=(deepPriceRecords[id]??[]).filter(r=>normalize(r.mpn)===normalize(product.mpn));
  if (!records.length) return product;
  const urls=new Set(records.flatMap(r=>r.checkedURLs));
  const latestCheck=new Map<string,number>();
  for (const source of records.flatMap(r=>r.sources)) latestCheck.set(source.url,Math.max(latestCheck.get(source.url)??0,Date.parse(source.checkedAt)));
  const quotes=new Map<string,VerifiedProduct['offers'][number]>();
  for (const quote of records.flatMap(r=>r.offers)) {
    if (Date.parse(quote.checkedAt)<(latestCheck.get(quote.url)??0)) continue;
    const previous=quotes.get(quote.url);
    if (!previous || Date.parse(previous.checkedAt)<=Date.parse(quote.checkedAt)) quotes.set(quote.url,{...quote,mpn:product.mpn});
  }
  const offers=[...product.offers.filter(o=>!urls.has(o.url)),...quotes.values()];
  // Retain older technical source timestamps; a price refresh does not redate
  // the technical evidence previously extracted from that page.
  const sources=[...product.sources,...records.flatMap(r=>r.sources).filter(s=>!product.sources.some(old=>old.url===s.url&&old.checkedAt===s.checkedAt))];
  return {...product,offers,sources};
}
