import test from "node:test";
import assert from "node:assert/strict";
import { catalog, getComponent, type Component } from "../src/data/catalog.ts";
import { getPricingInfo, getReferencePrice, formatComponentPrice, getIndicativeMarketObservation, MARKET_REFERENCE_MAX_AGE_MS } from "../src/data/pricing.ts";
import { getMarketObservation } from "../src/lib/marketObservations.ts";
import { MARKET_SOURCE, MARKET_MAPPINGS } from "../src/data/marketObservations.ts";
import { getVerifiedProduct } from "../src/lib/verifiedOffers.ts";
import { analyzeBuild } from "../src/lib/compatibility.ts";
import { defaultSelection } from "../src/data/catalog.ts";

test("only explicitly matched public reports gain source provenance, never merchant verification", (t) => {
  t.mock.method(Date, "now", () => Date.parse(MARKET_SOURCE.sourceUpdatedAt) + 3600_000);
  for (const component of catalog) {
    const info = getPricingInfo(component);
    const report = getMarketObservation(component);
    if (report?.availabilityReported === "in_stock") {
      assert.equal(info.status, "reported", component.id);
      assert.equal(info.source?.url, report.sourceURL);
      assert.equal(info.source?.independentlyVerified, false);
      assert.equal(info.market, "DE");
      assert.equal(info.currency, "EUR");
      assert.equal(info.checkedAt, null);
      assert.equal(getReferencePrice(component), report.amount);
      assert.match(info.label, /signalé.*confirmer/i);
      continue;
    }
    const unknown = component.priceStatus === "unknown" || Boolean(getVerifiedProduct(component)?.offers.length);
    assert.equal(info.status, unknown ? "unknown" : "estimate", component.id);
    assert.equal(info.checkedAt, null, component.id);
    assert.equal(info.source, null, component.id);
    assert.equal(info.currency, "EUR");
    assert.equal(info.market, "FR");
    assert.match(info.label, unknown ? /non renseigné/i : /non vérifié/i);
  }
});

test("an import without an explicit EUR report stays unpriced rather than free or converted from dollars", () => {
  const imported = catalog.filter((component) => component.source && !getMarketObservation(component));
  assert.ok(imported.length >= 1000);
  for (const component of imported) {
    assert.equal(getReferencePrice(component), null, component.id);
    assert.equal(formatComponentPrice(component), "Prix non renseigné", component.id);
    assert.equal(getPricingInfo(component).checkedAt, null, component.id);
  }
});

test("old, future or not-in-stock reports are excluded from the indicative EUR reference", (t) => {
  const cpu = getComponent("cpu-9800x3d")!;
  const report = getMarketObservation(cpu)!;
  const updated = Date.parse(report.sourceUpdatedAt);
  assert.equal(getIndicativeMarketObservation(cpu, updated)?.amount, 378);
  assert.equal(getIndicativeMarketObservation(cpu, updated - 1), null);
  assert.equal(getIndicativeMarketObservation(cpu, updated + MARKET_REFERENCE_MAX_AGE_MS + 1), null);
  t.mock.method(Date, "now", () => updated + 1000);
  for (const mapping of MARKET_MAPPINGS) {
    const component = getComponent(mapping.component.id)!;
    const observation = getMarketObservation(component)!;
    if (observation.availabilityReported !== "in_stock") {
      assert.equal(getIndicativeMarketObservation(component), null);
      assert.equal(getReferencePrice(component), component.priceStatus === "unknown" ? null : component.price);
    }
  }
  const before = analyzeBuild({ ...defaultSelection, cpu: null });
  const after = analyzeBuild({ ...defaultSelection, cpu: cpu.id });
  assert.equal(Math.round((after.totalKnown - before.totalKnown) * 100), 37800);
  assert.equal(getPricingInfo(cpu).checkedAt, null);
});

test("price searches preserve the model and the explicit memory-kit variant", () => {
  const ram = getComponent("ram-ddr5-32")!;
  const info = getPricingInfo(ram);
  for (const link of info.searchLinks) {
    const url = new URL(link.url);
    assert.equal(url.protocol, "https:");
    assert.equal(url.searchParams.get("q"), info.searchQuery);
    assert.match(info.searchQuery, /Corsair Vengeance RGB 32 Go DDR5/);
    assert.match(info.searchQuery, /6000/);
    assert.match(info.searchQuery, /CL30/);
    assert.match(info.searchQuery, /EXPO/);
  }
  const existingBrand = { ...ram, name: `Corsair ${ram.name}` };
  assert.equal(getPricingInfo(existingBrand).searchQuery.match(/Corsair/g)?.length, 1);
});

test("product names cannot inject tracking or extra query parameters into search links", () => {
  const component: Component = {
    ...getComponent("cpu-7600")!,
    name: "Modèle + spécial &tag=affiliate #version",
  };
  for (const { url } of getPricingInfo(component).searchLinks) {
    const parsed = new URL(url);
    assert.equal(parsed.hash, "");
    assert.equal(parsed.searchParams.has("tag"), false);
    assert.ok(parsed.searchParams.get("q")?.includes(component.name));
  }
});
