import type { Component } from "../data/catalog.ts";
import { catalogPriceArchive, PRICE_ARCHIVE_SOURCE } from "../data/catalogPriceArchive.ts";

/** A dated catalogue reference, not a checked merchant offer. The archive
 * date describes the source; the observation date of each price is unknown.
 */
export interface HistoricalPrice {
  readonly amount: number;
  readonly currency: "USD";
  readonly snapshotDate: "2025-07-23";
  readonly observedAt: null;
  readonly sourceName: "docyx/pc-part-dataset";
  readonly sourceUrl: string;
  readonly recordId: string;
  readonly market: "US";
  readonly kind: "catalog-archive";
}

const sourceTypeByCategory = {
  ram: "memory", storage: "internal-hard-drive", gpu: "video-card",
  motherboard: "motherboard", psu: "power-supply",
} as const;
const dollars = new Intl.NumberFormat("fr-FR", {
  style: "currency", currency: "USD", currencyDisplay: "code",
  minimumFractionDigits: 2, maximumFractionDigits: 2,
});
const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" });
const positiveAmount = (amount: unknown): amount is number => typeof amount === "number" && Number.isFinite(amount) && amount > 0;

/** Resolves the exact variant and source row. No fallback to a group, family,
 * neighbouring capacity or another finish; absent quotes remain absent.
 * This helper deliberately does not import or call the EUR pricing module.
 */
export function getPriceArchive(component: Component): HistoricalPrice | null {
  if (!Object.hasOwn(catalogPriceArchive, component.id)) return null;
  const entry = catalogPriceArchive[component.id];
  const source = component.source;
  if (!entry || !source || !positiveAmount(entry.amount)) return null;
  const expectedType = component.category in sourceTypeByCategory
    ? sourceTypeByCategory[component.category as keyof typeof sourceTypeByCategory] : undefined;
  const sourceUrl = `${PRICE_ARCHIVE_SOURCE.repository}/blob/${PRICE_ARCHIVE_SOURCE.snapshot}/data/json/${entry.sourceType}.json`;
  if (entry.sourceType !== expectedType
    || source.dataset !== PRICE_ARCHIVE_SOURCE.name
    || source.snapshot !== PRICE_ARCHIVE_SOURCE.snapshot
    || source.date !== PRICE_ARCHIVE_SOURCE.snapshotDate
    || source.rowId !== entry.rowId
    || source.url !== sourceUrl) return null;
  return {
    amount: entry.amount,
    currency: "USD",
    snapshotDate: PRICE_ARCHIVE_SOURCE.snapshotDate,
    observedAt: null,
    sourceName: PRICE_ARCHIVE_SOURCE.name,
    sourceUrl,
    recordId: entry.rowId,
    market: "US",
    kind: "catalog-archive",
  };
}

export function formatArchivePrice(quote: HistoricalPrice): string {
  if (!positiveAmount(quote.amount) || quote.currency !== "USD") throw new RangeError("Montant d’archive USD positif attendu");
  if (quote.amount < 0.01) return `< ${dollars.format(0.01)}`;
  return dollars.format(quote.amount);
}

/** Only the archive's date is formatted, never a fabricated observation date. */
export function formatArchiveDate(quote: HistoricalPrice): string {
  if (quote.snapshotDate !== PRICE_ARCHIVE_SOURCE.snapshotDate || quote.observedAt !== null) throw new RangeError("Date de l’archive attendue, sans date d’observation du prix");
  return date.format(new Date(`${quote.snapshotDate}T00:00:00Z`));
}
