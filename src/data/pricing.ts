import type { Component } from "./catalog.ts";
import { getLiveMarketObservation } from "../lib/marketFeed.ts";
import type { MarketObservation } from "./marketObservations.ts";
import { MARKET_REFERENCE_MAX_AGE_MS } from "./marketPolicy.ts";
import { getVerifiedOffer, getVerifiedProduct } from "../lib/verifiedOffers.ts";
export { MARKET_REFERENCE_MAX_AGE_MS } from "./marketPolicy.ts";

/**
 * Public reports are indicative references, never independently verified offers.
 * Currency, market, source update and price-change date stay distinct. Historical
 * USD quotes never enter the EUR budget. Direct merchant observations carry
 * their own checkedAt; public comparator reports keep checkedAt null.
 */
export interface PricingInfo {
  status: "estimate" | "reported" | "verified" | "unknown";
  label: string;
  description: string;
  market: "FR" | "DE";
  currency: "EUR";
  checkedAt: string | null;
  source: null | { name: string; url: string; independentlyVerified: boolean };
  observation: MarketObservation | null;
  comparisonUrl: string;
  searchLabel: string;
  searchQuery: string;
  searchLinks: Array<{ label: string; url: string }>;
}

export const pricingPolicy = {
  label: "Budget indicatif",
  description:
    "Budget indicatif : relevés marchands datés, signalements publics ou estimations selon la référence. Les relevés ne garantissent pas le prix au paiement. Livraison non incluse ; les montants sans source vérifiée restent signalés.",
  verificationLabel: "Prix marchand non vérifié",
  market: "FR",
  currency: "EUR",
} as const;

/** A recent source file permits an indicative budget reference, not a claim of
 * current stock. A source's global update does not certify a per-product check.
 */
export function getIndicativeMarketObservation(component: Component, now = Date.now()): MarketObservation | null {
  const observation = getLiveMarketObservation(component);
  if (!observation || observation.currency !== "EUR" || observation.availabilityReported !== "in_stock"
    || !Number.isFinite(observation.amount) || observation.amount <= 0) return null;
  const updated = Date.parse(observation.sourceUpdatedAt);
  if (!Number.isFinite(updated) || updated > now || now - updated > MARKET_REFERENCE_MAX_AGE_MS) return null;
  return observation;
}

/** Missing EUR prices are not zero-cost offers or historical USD conversions. */
export function getReferencePrice(component: Component): number | null {
  if (component.priceBasis === 'installed-memory-purchases') {
    return component.priceStatus === 'unknown' || !Number.isFinite(component.price) || component.price <= 0 ? null : component.price;
  }
  const verified = getVerifiedOffer(component);
  if (verified) return verified.amount;
  const reported = getIndicativeMarketObservation(component);
  if (reported) return reported.amount;
  if (getVerifiedProduct(component)?.offers.length) return null;
  return component.priceStatus === "unknown" || !Number.isFinite(component.price) || component.price <= 0
    ? null : component.price;
}

export function getPriceCaption(component: Component): string {
  if (component.priceBasis === 'installed-memory-purchases') return 'kits achetés · hors livraison';
  const offer = getVerifiedOffer(component);
  if (offer) return `relevé · ${offer.retailer} · hors livraison`;
  return getIndicativeMarketObservation(component) ? "signalé · Allemagne" : "indicatif";
}

export function formatComponentPrice(component: Component): string {
  const price = getReferencePrice(component);
  return price === null ? "Prix non renseigné" : new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(price);
}

function productSearchQuery(component: Component): string {
  const name = component.name.trim();
  const brand = component.brand.trim();
  const query = name.toLocaleLowerCase("fr").startsWith(brand.toLocaleLowerCase("fr"))
    ? name
    : `${brand} ${name}`;

  // Memory names do not always contain the transfer rate or CAS latency.
  // Include explicit kit specs to avoid comparing a cheaper, different kit.
  if (component.category === "ram") {
    const details = component.specs
      .flatMap((spec) => spec.split(/\s*·\s*/))
      .filter((spec) => /\bCL\d+|MT\/s|DDR[45][- ]\d{4,5}|\b(?:EXPO|XMP)\b/i.test(spec))
      .filter((spec) => !query.toLocaleLowerCase("fr").includes(spec.toLocaleLowerCase("fr")));
    return [query, ...new Set(details)].join(" ");
  }
  return query;
}

export function getPricingInfo(component: Component): PricingInfo {
  const verified = getVerifiedOffer(component);
  const known = getReferencePrice(component) !== null;
  const observation = getLiveMarketObservation(component);
  const reported = getIndicativeMarketObservation(component);
  const searchQuery = productSearchQuery(component);
  const comparisonUrl = new URL("https://www.idealo.fr/prix/MainSearchProductCategory.html");
  comparisonUrl.searchParams.set("q", searchQuery);
  const shoppingUrl = new URL("https://www.google.com/search");
  shoppingUrl.searchParams.set("tbm", "shop");
  shoppingUrl.searchParams.set("gl", "fr");
  shoppingUrl.searchParams.set("hl", "fr");
  shoppingUrl.searchParams.set("q", searchQuery);

  return {
    status: verified ? "verified" : reported ? "reported" : known ? "estimate" : "unknown",
    label: component.priceBasis === 'installed-memory-purchases' ? 'Budget des kits mémoire achetés' : verified ? `Prix relevé sur ${verified.retailer} · France` : reported ? "Prix signalé en Allemagne · à confirmer" : known ? pricingPolicy.verificationLabel : "Prix en euros non renseigné",
    description: component.priceBasis === 'installed-memory-purchases' ? 'Total des kits entiers nécessaires aux modules installés, hors livraison. Consultez chaque référence pour ses offres et leur date ; les prix manquants rendent le budget partiel.' : verified ? `Référence ${verified.mpn}, vendue par ${verified.seller}. Montant TTC relevé le ${new Intl.DateTimeFormat('fr-FR', {dateStyle:'short', timeStyle:'short', timeZone:'Europe/Paris'}).format(new Date(verified.checkedAt))}. Hors livraison ; prix et disponibilité à reconfirmer chez le vendeur. Le relevé entre dans le budget pendant 24 h.` : reported ? "Ce montant provient d’un suivi public de comparateur. Il sert de repère indicatif ; le stock rapporté n’est pas revérifié, et les frais, l’état, la fiscalité et la livraison en France restent à confirmer."
      : known ? pricingPolicy.description : "Aucun prix de référence en euros n’est renseigné pour cette variante. Les archives et signalements éventuels ci-dessous restent distincts du budget ; ce composant ne doit pas être considéré comme gratuit.",
    market: verified ? "FR" : reported ? "DE" : pricingPolicy.market,
    currency: pricingPolicy.currency,
    checkedAt: verified?.checkedAt ?? null,
    source: verified ? {name:verified.retailer,url:verified.url,independentlyVerified:true} : reported ? { name: reported.sourceName, url: reported.sourceURL, independentlyVerified: false } : null,
    observation,
    comparisonUrl: comparisonUrl.href,
    searchLabel: "Comparer les offres sur Idealo",
    searchQuery,
    searchLinks: [
      { label: "Rechercher sur Idealo", url: comparisonUrl.href },
      { label: "Rechercher sur Google Shopping", url: shoppingUrl.href },
    ],
  };
}
