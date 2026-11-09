import type { Component } from "./catalog.ts";

/**
 * No merchant offer has been fetched or verified for the current catalogue.
 * Keep that absence explicit: a catalogue amount is a budget estimate, and a
 * search link is not a price source. Do not stamp a review date as checkedAt.
 */
export interface PricingInfo {
  status: "estimate";
  label: string;
  description: string;
  market: "FR";
  currency: "EUR";
  checkedAt: null;
  source: null;
  comparisonUrl: string;
  searchLabel: string;
  searchQuery: string;
  searchLinks: Array<{ label: string; url: string }>;
}

export const pricingPolicy = {
  label: "Budget indicatif",
  description:
    "Estimation en euros, hors livraison. Les prix et la disponibilité ne sont pas actualisés depuis les marchands.",
  verificationLabel: "Prix marchand non vérifié",
  market: "FR",
  currency: "EUR",
} as const;

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
  const searchQuery = productSearchQuery(component);
  const comparisonUrl = new URL("https://www.idealo.fr/prix/MainSearchProductCategory.html");
  comparisonUrl.searchParams.set("q", searchQuery);
  const shoppingUrl = new URL("https://www.google.com/search");
  shoppingUrl.searchParams.set("tbm", "shop");
  shoppingUrl.searchParams.set("gl", "fr");
  shoppingUrl.searchParams.set("hl", "fr");
  shoppingUrl.searchParams.set("q", searchQuery);

  return {
    status: "estimate",
    label: pricingPolicy.verificationLabel,
    description: pricingPolicy.description,
    market: pricingPolicy.market,
    currency: pricingPolicy.currency,
    checkedAt: null,
    source: null,
    comparisonUrl: comparisonUrl.href,
    searchLabel: "Comparer les offres sur Idealo",
    searchQuery,
    searchLinks: [
      { label: "Rechercher sur Idealo", url: comparisonUrl.href },
      { label: "Rechercher sur Google Shopping", url: shoppingUrl.href },
    ],
  };
}
