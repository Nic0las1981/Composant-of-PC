import test from "node:test";
import assert from "node:assert/strict";
import { catalog, getComponent, type Component } from "../src/data/catalog.ts";
import { getPricingInfo, getReferencePrice, formatComponentPrice } from "../src/data/pricing.ts";

test("unobserved catalogue amounts never acquire merchant provenance from a search link", () => {
  for (const component of catalog) {
    const info = getPricingInfo(component);
    assert.equal(info.status, component.priceStatus === "unknown" ? "unknown" : "estimate", component.id);
    assert.equal(info.checkedAt, null, component.id);
    assert.equal(info.source, null, component.id);
    assert.equal(info.currency, "EUR");
    assert.equal(info.market, "FR");
    assert.match(info.label, component.priceStatus === "unknown" ? /non renseigné/i : /non vérifié/i);
  }
});

test("an imported price is missing rather than free or converted from historical dollars", () => {
  const imported = catalog.filter((component) => component.source);
  assert.ok(imported.length >= 1000);
  for (const component of imported) {
    assert.equal(getReferencePrice(component), null, component.id);
    assert.equal(formatComponentPrice(component), "Prix non renseigné", component.id);
    assert.equal(getPricingInfo(component).checkedAt, null, component.id);
  }
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
