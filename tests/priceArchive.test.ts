import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { catalog, getComponent, type Component, type Selection } from "../src/data/catalog.ts";
import { catalogPriceArchive, PRICE_ARCHIVE_SOURCE, type ArchivedPriceEntry } from "../src/data/catalogPriceArchive.ts";
import { getPriceArchive, formatArchivePrice, formatArchiveDate, type HistoricalPrice } from "../src/lib/priceArchive.ts";
import { getCatalogGroups } from "../src/lib/catalogVariants.ts";
import { analyzeBuild } from "../src/lib/compatibility.ts";
import { withMemoryQuantity } from "../src/lib/memory.ts";
import { getPricingInfo, getReferencePrice, formatComponentPrice } from "../src/data/pricing.ts";
import { getMarketObservation } from "../src/lib/marketObservations.ts";
import { getVerifiedProduct } from "../src/lib/verifiedOffers.ts";

interface SourceRow {
  id: string;
  sourceType: string;
  sourceIndex: number;
  recordHash: string;
  record: { price: number | null };
}
const snapshot = JSON.parse(readFileSync(new URL("../data/catalog-source.json", import.meta.url), "utf8")) as { records: SourceRow[] };
const sourceRows = new Map(snapshot.records.map(row => [row.id, row]));
const pricedComponent = catalog.find(component => getPriceArchive(component))!;
const blankSelection = (): Selection => ({ cpu: null, motherboard: null, gpu: null, ram: null, storage: null, cooler: null, psu: null, case: null });

test("the archive contains only exact positive USD amounts from the frozen source rows", () => {
  const positiveRows = snapshot.records.filter(row => typeof row.record.price === "number" && Number.isFinite(row.record.price) && row.record.price > 0);
  assert.equal(positiveRows.length, 3265);
  assert.equal(Object.keys(catalogPriceArchive).length, positiveRows.length);
  for (const row of positiveRows) {
    const component = getComponent(row.id)!;
    assert.ok(component, row.id);
    const quote = getPriceArchive(component);
    assert.ok(quote, row.id);
    assert.equal(quote.amount, row.record.price, row.id);
    assert.equal(quote.currency, "USD");
    assert.equal(quote.market, "US");
    assert.equal(quote.kind, "catalog-archive");
    assert.equal(quote.snapshotDate, "2025-07-23");
    assert.equal(quote.observedAt, null);
    assert.equal(quote.sourceName, "docyx/pc-part-dataset");
    assert.equal(quote.recordId, `${row.sourceType}:${row.sourceIndex}-${row.recordHash.slice(0, 12)}`);
    assert.equal(quote.sourceUrl, `https://github.com/docyx/pc-part-dataset/blob/${PRICE_ARCHIVE_SOURCE.snapshot}/data/json/${row.sourceType}.json`);
  }
  for (const row of snapshot.records.filter(row => row.record.price === null || row.record.price <= 0)) {
    assert.equal(getPriceArchive(getComponent(row.id)!), null, row.id);
  }
});

test("a changed source snapshot, row, date, category or URL invalidates a quote instead of reusing it", () => {
  const source = pricedComponent.source!;
  assert.ok(getPriceArchive(pricedComponent));
  const mismatches: Array<Partial<NonNullable<Component["source"]>>> = [
    { snapshot: "0".repeat(40) }, { rowId: `${source.rowId}-other` },
    { date: "2026-11-09" }, { dataset: "Another dataset" },
    { url: source.url.replace("/blob/", "/tree/") },
  ];
  for (const patch of mismatches) {
    assert.equal(getPriceArchive({ ...pricedComponent, source: { ...source, ...patch } }), null);
  }
  assert.equal(getPriceArchive({ ...pricedComponent, source: undefined }), null);
  assert.equal(getPriceArchive({ ...pricedComponent, category: "cpu" }), null);
  assert.equal(getPriceArchive({ ...pricedComponent, id: "__proto__" }), null);
  assert.equal(getPriceArchive({ ...pricedComponent, id: "toString" }), null);
  assert.equal(getPriceArchive(getComponent("cpu-7600")!), null);
  assert.equal(getPriceArchive(getComponent("oem-ram-samsung-m378a2k43eb1-cwe")!), null);
});

test("finishes retain their own archived amounts and an unpriced finish never borrows from its sibling", () => {
  const pricedPair = getCatalogGroups().find(group => {
    const prices = group.variants.map(getPriceArchive).filter((price): price is HistoricalPrice => price !== null);
    return prices.length >= 2 && new Set(prices.map(price => price.amount)).size >= 2;
  });
  assert.ok(pricedPair, "The source must provide a real group with different finish prices");
  for (const variant of pricedPair.variants) {
    const row = sourceRows.get(variant.id)!;
    assert.equal(getPriceArchive(variant)?.amount ?? null, row.record.price);
  }
  const mixedGroup = getCatalogGroups().find(group => group.variants.some(variant => getPriceArchive(variant)) && group.variants.some(variant => !getPriceArchive(variant)));
  assert.ok(mixedGroup, "The source must provide a priced finish beside a missing price");
  const missing = mixedGroup.variants.find(variant => !getPriceArchive(variant))!;
  assert.equal(sourceRows.get(missing.id)!.record.price, null);
  assert.equal(getPriceArchive(missing), null);
});

test("zero, negative and non-finite archive values cannot become free or valid offers", () => {
  // Fault injection is confined to this process and restored after every case.
  const mutable = catalogPriceArchive as Record<string, ArchivedPriceEntry>;
  const original = mutable[pricedComponent.id];
  try {
    for (const amount of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      mutable[pricedComponent.id] = { ...original, amount };
      assert.equal(getPriceArchive(pricedComponent), null);
    }
  } finally {
    mutable[pricedComponent.id] = original;
  }
  assert.ok(getPriceArchive(pricedComponent));
});

test("archive amounts never enter EUR component prices, total budgets or RAM kit purchases", () => {
  for (const component of catalog.filter(component => getPriceArchive(component) && !getMarketObservation(component) && !getVerifiedProduct(component))) {
    assert.equal(getReferencePrice(component), null, component.id);
    assert.equal(formatComponentPrice(component), "Prix non renseigné", component.id);
    const info = getPricingInfo(component);
    assert.equal(info.currency, "EUR");
    assert.equal(info.market, "FR");
    assert.equal(info.checkedAt, null);
    assert.equal(info.source, null);
    assert.equal(info.status, "unknown");
  }
  const gpu = catalog.find(component => component.category === "gpu" && getPriceArchive(component) && !getMarketObservation(component) && !getVerifiedProduct(component))!;
  const gpuBuild = analyzeBuild({ ...blankSelection(), gpu: gpu.id });
  assert.equal(gpuBuild.totalKnown, 0);
  assert.equal(gpuBuild.unpricedCount, 1);
  const ram = catalog.find(component => component.category === "ram" && component.memorySticks === 2 && getPriceArchive(component) && !getVerifiedProduct(component))!;
  const ramBuild = analyzeBuild(withMemoryQuantity({ ...blankSelection(), ram: ram.id }, 3));
  assert.equal(ramBuild.memory.purchases[0].kits, 2);
  assert.equal(ramBuild.memory.purchases[0].price, null);
  assert.equal(ramBuild.memory.priceKnown, false);
  assert.equal(ramBuild.totalKnown, 0);
  assert.equal(ramBuild.unpricedCount, 1);
});

test("French formatting keeps USD explicit and labels the archive date without inventing an observation", () => {
  const quote = getPriceArchive(pricedComponent)!;
  assert.equal(formatArchivePrice({ ...quote, amount: 94.99 }).replace(/\s/g, " "), "94,99 USD");
  assert.equal(formatArchivePrice({ ...quote, amount: 1_299 }).replace(/\s/g, " "), "1 299,00 USD");
  assert.equal(formatArchivePrice({ ...quote, amount: 0.001 }).replace(/\s/g, " "), "< 0,01 USD");
  assert.equal(formatArchiveDate(quote), "23 juillet 2025");
  assert.equal(quote.observedAt, null);
  assert.throws(() => formatArchivePrice({ ...quote, amount: 0 }), RangeError);
  assert.throws(() => formatArchivePrice({ ...quote, amount: Number.NaN }), RangeError);
  assert.throws(() => formatArchivePrice({ ...quote, currency: "EUR" } as unknown as HistoricalPrice), RangeError);
  assert.throws(() => formatArchiveDate({ ...quote, observedAt: "2025-07-23" } as unknown as HistoricalPrice), RangeError);
  assert.throws(() => formatArchiveDate({ ...quote, snapshotDate: "2026-11-09" } as unknown as HistoricalPrice), RangeError);
});
