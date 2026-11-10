import type { Component } from '../data/catalog.ts';
import { verifiedProducts } from '../data/verifiedCatalog.ts';
import type { VerifiedOffer } from '../data/verifiedTypes.ts';

// These are dated observations, never a promise of today's checkout price.
export const VERIFIED_OFFER_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function getVerifiedProduct(component: Component) {
  const product = verifiedProducts[component.id];
  return product && component.manufacturerPartNumber === product.mpn ? product : undefined;
}

export function isCurrentVerifiedOffer(offer: VerifiedOffer, now = Date.now()): boolean {
  const checked = Date.parse(offer.checkedAt);
  return offer.currency === 'EUR' && offer.market === 'FR' && offer.condition === 'new'
    && offer.availability === 'in_stock' && offer.priceKind === 'current'
    && Number.isFinite(offer.amount) && offer.amount > 0 && Number.isFinite(checked)
    && checked <= now && now - checked <= VERIFIED_OFFER_MAX_AGE_MS;
}

export function getVerifiedOffer(component: Component, now = Date.now()): VerifiedOffer | undefined {
  if (component.priceBasis === 'installed-memory-purchases') return undefined;
  return getVerifiedProduct(component)?.offers
    .filter(offer => offer.mpn === component.manufacturerPartNumber && isCurrentVerifiedOffer(offer, now))
    .sort((a, b) => a.amount - b.amount || a.url.localeCompare(b.url))[0];
}
