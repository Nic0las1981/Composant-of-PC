import test from "node:test";
import assert from "node:assert/strict";
import { catalog, getComponent, type Component } from "../src/data/catalog.ts";
import { getReleaseInfo } from "../src/data/releaseTimeline.ts";

const fixture = (category: Component["category"], name: string, extra: Partial<Component> = {}): Component => ({
  id: "chronology-fixture", category, name, brand: "Test", price: 0,
  description: "", specs: [], ...extra,
});
const period = (component: Component) => {
  const info = getReleaseInfo(component);
  return info ? [info.year, info.month ?? null] : null;
};

test("later CPU models are not dated from the first launch of their Ryzen family", () => {
  assert.deepEqual(period(getComponent("cpu-5700x3d")!), [2024, 1]);
  assert.deepEqual(period(getComponent("cpu-9800x3d")!), [2024, 11]);
  assert.deepEqual(period(getComponent("cpu-5600x")!), [2020, 11]);
  assert.deepEqual(period(getComponent("cpu-5600")!), [2022, 4]);
  assert.deepEqual(period(getComponent("cpu-7500f")!), [2023, 7]);
  assert.equal(getReleaseInfo(getComponent("cpu-9800x3d")!)?.basis, "model");
});

test("SUPER and XT GPU chips retain their later launch instead of matching their base models", () => {
  assert.deepEqual(period(fixture("gpu", "GeForce RTX 4070 SUPER")), [2024, 1]);
  assert.deepEqual(period(fixture("gpu", "GeForce RTX 4070")), [2023, 4]);
  assert.deepEqual(period(fixture("gpu", "GeForce RTX 4090")), [2022, 10]);
  assert.deepEqual(period(fixture("gpu", "Radeon RX 7600 XT")), [2024, 1]);
  assert.deepEqual(period(fixture("gpu", "Radeon RX 7600")), [2023, 5]);
  assert.deepEqual(period(fixture("gpu", "GeForce RTX 4070 Ti SUPER")), [2024, 1]);
  assert.equal(getReleaseInfo(fixture("gpu", "GeForce RTX 4090 SUPER")), null);
});

test("expanded GPU ranges distinguish original Quadro chips from newer Ada generations", () => {
  assert.deepEqual(period(fixture("gpu", "Radeon RX 5700")), [2019, 7]);
  assert.deepEqual(period(fixture("gpu", "GeForce GTX 1630")), [2022, 6]);
  assert.deepEqual(period(fixture("gpu", "Quadro RTX 4000")), [2018, null]);
  assert.deepEqual(period(fixture("gpu", "Quadro RTX 5000")), [2018, null]);
  assert.deepEqual(period(fixture("gpu", "RTX 4000 SFF Ada Generation")), [2023, null]);
  assert.deepEqual(period(fixture("gpu", "RTX 5000 Ada Generation")), [2023, null]);
  assert.equal(getReleaseInfo(fixture("gpu", "RTX 2000E Ada Generation")), null);
});

test("known GPU memory variants have their own introduction period", () => {
  for (const [name, capacityGB, year, month] of [
    ["GeForce RTX 3050", 6, 2024, 2], ["GeForce RTX 3050", 8, 2022, 1],
    ["GeForce RTX 3080", 12, 2022, 1], ["GeForce RTX 3080", 10, 2020, 9],
    ["GeForce RTX 4060 Ti", 16, 2023, 7], ["GeForce RTX 4060 Ti", 8, 2023, 5],
    ["GeForce RTX 3060", 8, 2022, 10], ["GeForce RTX 3060", 12, 2021, 2],
    ["GeForce RTX 2060", 12, 2021, 12], ["GeForce RTX 2060", 6, 2019, 1],
  ] as const) assert.deepEqual(period(fixture("gpu", name, { capacityGB })), [year, month], `${name} ${capacityGB} Go`);
});

test("partner GPU and chipset dates explicitly describe generations, not individual cards", () => {
  const gpu = getReleaseInfo(fixture("gpu", "TUF GeForce RTX 5080 OC White"))!;
  assert.equal(gpu.basis, "generation");
  assert.equal(gpu.year, 2025);
  assert.match(gpu.note!, /fabricant/);
  const board = getReleaseInfo(getComponent("mb-b650")!)!;
  assert.equal(board.basis, "generation");
  assert.equal(board.year, 2022);
  assert.equal(board.month, undefined);
  assert.match(board.note!, /révision peut être plus récent/);
  assert.equal(getReleaseInfo(fixture("motherboard", "Carte inconnue", { socket: "AM5" })), null);
});

test("memory ranges with similar names are distinguished by generation and suffix", () => {
  assert.equal(getReleaseInfo(fixture("ram", "Vengeance RGB 32 Go", { brand: "Corsair", memoryType: "DDR4" }))?.year, 2017);
  assert.equal(getReleaseInfo(fixture("ram", "Vengeance RGB 32 Go", { brand: "Corsair", memoryType: "DDR5" }))?.year, 2022);
  assert.equal(getReleaseInfo(fixture("ram", "Trident Z5 RGB 32 Go", { brand: "G.Skill", memoryType: "DDR5" }))?.year, 2021);
  assert.equal(getReleaseInfo(fixture("ram", "Trident Z5 Neo RGB 32 Go", { brand: "G.Skill", memoryType: "DDR5" }))?.year, 2022);
  assert.equal(getReleaseInfo(fixture("ram", "Ripjaws S5 32 Go", { brand: "G.Skill", memoryType: "DDR5" }))?.year, 2021);
  assert.equal(getReleaseInfo(fixture("ram", "Flare X5 32 Go", { brand: "G.Skill", memoryType: "DDR5" }))?.year, 2022);
});

test("SSD capacity and heatsink editions use a labelled series year without inventing exact SKU dates", () => {
  const info = getReleaseInfo(fixture("storage", "990 PRO 4 To with Heatsink", { brand: "Samsung" }))!;
  assert.equal(info.year, 2022);
  assert.equal(info.basis, "series");
  assert.equal(info.month, undefined);
  assert.match(info.note!, /capacité, couleur ou révision/);
  assert.equal(getReleaseInfo(fixture("storage", "FURY Renegade G5 2 To", { brand: "Kingston" })), null);
});

test("ambiguous PSU names remain undated while explicit revision years are retained", () => {
  assert.equal(getReleaseInfo(getComponent("psu-rm750e")!), null);
  assert.equal(getReleaseInfo(getComponent("psu-sf750")!), null);
  assert.equal(getReleaseInfo(getComponent("psu-focus850")!), null);
  const revision = getReleaseInfo(getComponent("psu-rm750x-2021")!)!;
  assert.equal(revision.year, 2021);
  assert.equal(revision.label, "Révision nommée du modèle");
  assert.match(revision.note!, /révision nommée/);
});

test("unknown models never inherit source snapshot dates, performance scores or dates from other categories", () => {
  const imported = catalog.find((component) => component.category === "storage" && component.source)!;
  const original = JSON.stringify(imported);
  assert.equal(getReleaseInfo({ ...imported, name: "Modèle non daté 9000", gamingScore: 100, capacityGB: 8000 }), null);
  assert.equal(getReleaseInfo(fixture("cpu", "Ryzen 7 9850X3D", { brand: "AMD" })), null);
  assert.equal(getReleaseInfo(fixture("ram", "990 PRO", { brand: "Samsung" })), null);
  assert.equal(JSON.stringify(imported), original);
});

test("OEM memory manufacture and SPD observation dates are not commercial release dates", () => {
  const oem = fixture("ram", "Samsung M393A4K40BB1-CRC · fabrication 2018 · relevé SPD 2024", {
    brand: "Samsung", memoryType: "DDR4", manufacturerPartNumber: "M393A4K40BB1-CRC",
    source: { dataset: "linuxhw/DDR4", url: "https://github.com/linuxhw/DDR4", snapshot: "a".repeat(40), date: "2024-12-31", rowId: "spd-observation" },
  });
  assert.equal(getReleaseInfo(oem), null);
  for (const component of catalog.filter((entry) => entry.category === "ram" && entry.brand === "Samsung" && entry.manufacturerPartNumber))
    assert.equal(getReleaseInfo(component), null, component.manufacturerPartNumber ?? component.id);
});

test("the catalogue chronology is bounded, transparent about precision and preserves source records", () => {
  const before = JSON.stringify(catalog);
  const known = catalog.map(getReleaseInfo).filter((info) => info !== null);
  assert.ok(known.length > 0);
  assert.ok(known.length < catalog.length, "Missing launch information must stay unknown");
  for (const info of known) {
    assert.ok(info.year >= 2014 && info.year <= 2025);
    assert.ok(info.month === undefined || Number.isInteger(info.month) && info.month >= 1 && info.month <= 12);
    assert.equal(info.day, undefined);
    assert.ok(info.label.length > 0);
    assert.ok(info.sourceName);
    assert.ok(info.note);
    if (info.sourceUrl) assert.match(info.sourceUrl, /^https:\/\/github\.com\/docyx\/pc-part-dataset\/blob\/[a-f0-9]{40}\//);
  }
  assert.equal(JSON.stringify(catalog), before);
});
