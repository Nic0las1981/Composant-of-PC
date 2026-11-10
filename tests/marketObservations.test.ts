import test from "node:test";
import assert from "node:assert/strict";
import snapshot from "../data/market-observations.json";
import { catalog, getComponent, type Component } from "../src/data/catalog.ts";
import { MARKET_MAPPINGS, MARKET_SOURCE, marketObservations } from "../src/data/marketObservations.ts";
import { getMarketObservation, matchesMarketMapping } from "../src/lib/marketObservations.ts";

test("ten archived identities preserve their source facts; changed current identities invalidate the mapping", () => {
  assert.equal(snapshot.records.length, 10);
  assert.equal(MARKET_MAPPINGS.length, 10);
  assert.equal(Object.keys(marketObservations).length, 10);
  assert.equal(new Set(MARKET_MAPPINGS.map(mapping => mapping.component.id)).size, 10);
  assert.equal(new Set(MARKET_MAPPINGS.map(mapping => mapping.sourcePart.id)).size, 10);
  assert.match(MARKET_SOURCE.pricesSha256, /^[0-9a-f]{64}$/);
  assert.match(MARKET_SOURCE.productsSha256, /^[0-9a-f]{64}$/);
  assert.equal(MARKET_SOURCE.commit, "936b9f68632e413dab3bed1ebe2f6a6b56382f3b");

  for (const record of snapshot.records) {
    const component = getComponent(record.component.id);
    assert.ok(component, record.component.id);
    const archivedIdentity:Component={...component,...record.component,finishName:record.component.finishName??undefined,manufacturerPartNumber:record.component.manufacturerPartNumber??undefined} as Component;
    const observation = getMarketObservation(archivedIdentity);
    if(!matchesMarketMapping(component,MARKET_MAPPINGS.find(m=>m.component.id===component.id)!))assert.equal(getMarketObservation(component),null,component.id);
    assert.ok(observation, record.component.id);
    assert.ok(Number.isFinite(observation.amount) && observation.amount > 0);
    assert.equal(observation.amount, record.current.price);
    assert.equal(observation.currency, "EUR");
    assert.equal(observation.market, "DE");
    assert.equal(observation.merchant, record.current.merchant);
    assert.equal(observation.availabilityReported, record.current.availability);
    assert.equal(observation.sourcePartId, record.sourcePart.id);
    assert.equal(observation.sourceProductName, record.sourcePart.name);
    assert.equal(observation.productURL, record.current.url);
    assert.equal(observation.productURL, `https://geizhals.de/${record.sourcePart.geizhalsSlug}.html?hloc=de`);
    assert.equal(observation.sourceURL, `https://github.com/xxderen/pc-build/blob/${MARKET_SOURCE.commit}/data/prices.json`);
    assert.equal(observation.sourceCommit, MARKET_SOURCE.commit);
    assert.equal(observation.exactVariantNote, record.exactVariantNote);
  }
});

test("a source update and an unchanged-price date never become a per-product check", () => {
  let distinctDates = 0;
  for (const record of snapshot.records) {
    const observation = marketObservations[record.component.id]!;
    assert.equal(observation.sourceUpdatedAt, snapshot.source.sourceUpdatedAt);
    assert.equal(observation.priceSince, record.current.since);
    assert.equal(observation.retrievedAt, snapshot.source.retrievedAt);
    assert.ok(Date.parse(observation.priceSince) <= Date.parse(observation.sourceUpdatedAt));
    assert.ok(Date.parse(observation.sourceUpdatedAt) <= Date.parse(observation.retrievedAt));
    assert.equal(observation.checkedAt, null);
    assert.equal(observation.shippingCostEUR, null);
    assert.equal(observation.conditionReported, null);
    assert.equal(observation.deliveryToFrance, null);
    if (observation.priceSince !== observation.sourceUpdatedAt) distinctDates += 1;
  }
  assert.ok(distinctDates >= 8);
});

test("prices never spread to siblings, another capacity, another partner or an unaudited ID", () => {
  const auditedIds = new Set(MARKET_MAPPINGS.map(mapping => mapping.component.id));
  for (const component of catalog) {
    if (!auditedIds.has(component.id)) assert.equal(getMarketObservation(component), null, component.id);
  }
  const excluded = [
    "import-gpu-0efecf8ce002", // White MSI GAMING TRIO without the OC designation.
    "import-ssd-2140adf7085e", // Lexar NM790 with a heatsink.
    "import-ssd-da2990c12745", // SN850X with a heatsink.
    "ssd-sn850-2", // Similar legacy entry is not an audited alias.
    "oem-ram-samsung-m378a2k43eb1-cwe",
  ];
  for (const id of excluded) {
    const component = getComponent(id);
    assert.ok(component, id);
    assert.equal(getMarketObservation(component), null, id);
  }
  assert.equal(getMarketObservation(null), null);
  assert.equal(getMarketObservation(undefined), null);
});

test("an ID reused for a different catalog identity invalidates the observation", () => {
  const mapping = MARKET_MAPPINGS.find(item => item.component.id === "import-gpu-2ba51b8960d7")!;
  const component = getComponent(mapping.component.id)!;
  assert.equal(matchesMarketMapping(component, mapping), true);
  const mismatches: Partial<Component>[] = [
    { id: "__proto__" }, { id: "toString" },
    { category: "cpu" }, { brand: "Another partner" },
    { name: component.name.replace("16 Go", "8 Go") },
    { name: component.name.replace("X3 OC", "X3") },
    { finishName: "Noir" }, { finishName: undefined },
    { manufacturerPartNumber: "unreviewed-part-number" },
  ];
  for (const patch of mismatches) {
    assert.equal(getMarketObservation({ ...component, ...patch }), null, JSON.stringify(patch));
  }
});

test("snapshot lookups are immutable and leave the catalog prices intact", () => {
  const component = getComponent("cpu-9800x3d")!;
  const before = structuredClone(component);
  const observation = getMarketObservation(component)!;
  assert.equal(observation.amount, 378);
  assert.deepEqual(component, before);
  assert.ok(Object.isFrozen(observation));
  assert.ok(Object.isFrozen(marketObservations));
  assert.ok(Object.isFrozen(MARKET_MAPPINGS));
  assert.ok(Object.isFrozen(MARKET_MAPPINGS[0].component));
  assert.ok(Object.isFrozen(MARKET_MAPPINGS[0].sourcePart));
  assert.throws(() => { (observation as { amount: number }).amount = 1; }, TypeError);
  assert.equal(getMarketObservation(component)?.amount, 378);
});
