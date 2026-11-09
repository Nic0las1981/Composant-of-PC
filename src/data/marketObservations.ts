import snapshot from "../../data/market-observations.json";

/** Price facts reported by a third party, not independently checked offers. */
export type ReportedAvailability = "in_stock" | "shortly" | "unavailable" | "unknown";

export interface MarketMapping {
  readonly component: Readonly<{
    id: string;
    category: string;
    brand: string;
    name: string;
    finishName: string | null;
    manufacturerPartNumber: string | null;
  }>;
  readonly sourcePart: Readonly<{
    id: string;
    category: string;
    name: string;
    geizhalsSlug: string;
    /** Reference in the source product URL, not a manufacturer verification. */
    manufacturerPartNumber: string | null;
  }>;
  readonly exactVariantNote: string;
}

export interface MarketObservation {
  readonly amount: number;
  readonly currency: "EUR";
  readonly market: "DE";
  readonly merchant: string;
  /** Immutable for the bundled snapshot; a branch URL identifies a refreshed feed. */
  readonly sourceURL: string;
  /** Comparator page, not a checkout link or an individually checked offer. */
  readonly productURL: string;
  /** Global source file update; it does not date a check of this product. */
  readonly sourceUpdatedAt: string;
  /** Start of the unchanged price according to the source's state history. */
  readonly priceSince: string;
  readonly checkedAt: null;
  readonly availabilityReported: ReportedAvailability;
  readonly sourceName: string;
  readonly sourcePartId: string;
  readonly sourceProductName: string;
  /** Null when a branch refresh cannot be tied to a verified commit. */
  readonly sourceCommit: string | null;
  readonly retrievedAt: string;
  readonly exactVariantNote: string;
  readonly conditionReported: null;
  readonly shippingCostEUR: null;
  readonly deliveryToFrance: null;
}

export const MARKET_SOURCE = Object.freeze({ ...snapshot.source });

/** Audited, explicit identities. No fuzzy match, family match or finish fallback. */
export const MARKET_MAPPINGS: readonly MarketMapping[] = Object.freeze(
  snapshot.records.map(record => Object.freeze({
    component: Object.freeze({ ...record.component }),
    sourcePart: Object.freeze({ ...record.sourcePart }),
    exactVariantNote: record.exactVariantNote,
  })),
);

const availabilityValues: ReadonlySet<string> = new Set<ReportedAvailability>([
  "in_stock", "shortly", "unavailable", "unknown",
]);

function normalizeRecord(record: (typeof snapshot.records)[number]): MarketObservation | null {
  const { current, sourcePart } = record;
  const sourceTime = Date.parse(MARKET_SOURCE.sourceUpdatedAt);
  const retrievalTime = Date.parse(MARKET_SOURCE.retrievedAt);
  const priceTime = Date.parse(current.since);
  if (
    !Number.isFinite(current.price) || current.price <= 0 ||
    current.source !== "geizhals" || !availabilityValues.has(current.availability) ||
    !current.merchant.trim() ||
    current.url !== `https://geizhals.de/${sourcePart.geizhalsSlug}.html?hloc=de` ||
    ![sourceTime, retrievalTime, priceTime].every(Number.isFinite) ||
    priceTime > sourceTime || sourceTime > retrievalTime
  ) return null;

  return Object.freeze({
    amount: current.price,
    currency: "EUR",
    market: "DE",
    merchant: current.merchant,
    sourceURL: MARKET_SOURCE.sourceURL,
    productURL: current.url,
    sourceUpdatedAt: MARKET_SOURCE.sourceUpdatedAt,
    priceSince: current.since,
    checkedAt: null,
    availabilityReported: current.availability as ReportedAvailability,
    sourceName: MARKET_SOURCE.sourceName,
    sourcePartId: sourcePart.id,
    sourceProductName: sourcePart.name,
    sourceCommit: MARKET_SOURCE.commit,
    retrievedAt: MARKET_SOURCE.retrievedAt,
    exactVariantNote: record.exactVariantNote,
    conditionReported: null,
    shippingCostEUR: null,
    deliveryToFrance: null,
  });
}

const entries = snapshot.records.flatMap(record => {
  const observation = normalizeRecord(record);
  return observation ? [[record.component.id, observation] as const] : [];
});

export const marketObservations: Readonly<Record<string, MarketObservation>> =
  Object.freeze(Object.fromEntries(entries));
