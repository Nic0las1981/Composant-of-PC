import test from "node:test";
import assert from "node:assert/strict";
import { catalog, categories, getComponent, type Component } from "../src/data/catalog.ts";
import { getCatalogFamily } from "../src/lib/catalogFamilies.ts";
import { getCatalogGroups } from "../src/lib/catalogVariants.ts";

const product = (category: Component["category"], brand: string, name: string, extra: Partial<Component> = {}): Component => ({
  id: "test", category, brand, name, price: 100, description: "", specs: [], ...extra,
});

test("CPU families follow the model generation rather than its Ryzen/Core performance tier", () => {
  assert.equal(getCatalogFamily(product("cpu", "AMD", "Ryzen 7 9800X3D")).label, "AMD Ryzen 9000");
  assert.equal(getCatalogFamily(product("cpu", "AMD", "Ryzen 9 7950X")).label, "AMD Ryzen 7000");
  assert.equal(getCatalogFamily(product("cpu", "Intel", "Core i7-14700KF")).label, "Intel Core 14e génération");
  assert.equal(getCatalogFamily(product("cpu", "Intel", "Core i5-12400F")).label, "Intel Core 12e génération");
  assert.equal(getCatalogFamily(product("cpu", "Intel", "Core Ultra 9 285K")).label, "Intel Core Ultra 200");
});

test("GPU families use the GPU series across board partners and compact RX model names", () => {
  const zotac = product("gpu", "Zotac", "GAMING SOLID RTX 5080");
  const asus = product("gpu", "ASUS", "TUF GAMING OC", { specs: ["GeForce RTX 5070 Ti", "16 Go"] });
  assert.deepEqual(getCatalogFamily(zotac), getCatalogFamily(asus));
  assert.equal(getCatalogFamily(zotac).label, "NVIDIA GeForce RTX 50");
  assert.equal(getCatalogFamily(product("gpu", "PowerColor", "RX7800XT 16G-P")).label, "AMD Radeon RX 7000");
  assert.equal(getCatalogFamily(product("gpu", "MSI", "GTX 1660 SUPER")).label, "NVIDIA GeForce GTX 16");
  assert.equal(getCatalogFamily(product("gpu", "Sparkle", "TITAN OC", { specs: ["Arc B580"] })).label, "Intel Arc B");
  assert.equal(getCatalogFamily(product("gpu", "NVIDIA", "RTX 5000 Ada Generation")).label, "NVIDIA RTX Ada professionnelle");
  assert.notEqual(getCatalogFamily(product("gpu", "NVIDIA", "RTX 5000 Ada Generation")).id, getCatalogFamily(zotac).id);
  assert.equal(getCatalogFamily(product("gpu", "PNY", "Quadro RTX 4000")).label, "NVIDIA Quadro RTX");
});

test("motherboard chipsets retain E suffixes and require the matching platform", () => {
  assert.equal(getCatalogFamily(product("motherboard", "ASUS", "ROG STRIX B650E-I GAMING", { socket: "AM5" })).label, "AMD B650E");
  assert.equal(getCatalogFamily(product("motherboard", "MSI", "B650M GAMING", { socket: "AM5" })).label, "AMD B650");
  assert.equal(getCatalogFamily(product("motherboard", "ASUS", "Z790D5 GAMING", { socket: "LGA1700" })).label, "Intel Z790");
  assert.equal(getCatalogFamily(product("motherboard", "Gigabyte", "GA-AB350-GAMING 3", { socket: "AM4" })).label, "AMD B350");
  assert.equal(getCatalogFamily(product("motherboard", "ASUS", "Pro Q670M-C-CSM", { socket: "LGA1700" })).label, "Intel Q670");
  for (const part of [
    product("motherboard", "Test", "B650", { socket: "LGA1700" }),
    product("motherboard", "Test", "B760", { socket: "AM5" }),
    product("motherboard", "Test", "B6500", { socket: "AM5" }),
    product("motherboard", "NZXT", "N7-Z69XT-B1", { socket: "LGA1700" }),
  ]) assert.equal(getCatalogFamily(part).label, "Autres modèles", part.name);
});

test("Samsung OEM desktop memory requires explicit UDIMM type or a recognized module part number", () => {
  const ram = product("ram", "Samsung", "8 Go DDR4", { memoryModuleKind: "UDIMM" });
  assert.equal(getCatalogFamily(ram).label, "Samsung UDIMM OEM");
  assert.deepEqual(getCatalogFamily(ram), getCatalogFamily({ ...ram, memoryModuleKind: undefined, manufacturerPartNumber: "M378A1K43CB2-CTD" }));
  assert.deepEqual(getCatalogFamily(ram), getCatalogFamily({ ...ram, memoryModuleKind: undefined, manufacturerPartNumber: "M323R1GB4BB0-CQK" }));
  for (const extra of [
    { memoryModuleKind: undefined },
    { memoryModuleKind: "RDIMM" as const, manufacturerPartNumber: "M378A1K43CB2-CTD" },
    { memoryModuleFormat: "SO-DIMM" as const },
    { memoryRegistered: true },
    { brand: "Autre" },
  ]) assert.equal(getCatalogFamily({ ...ram, ...extra }).known, false);
});

test("new named series group their real capacity and power variants without guessing opaque codes", () => {
  assert.equal(getCatalogFamily(product("ram", "TeamGroup", "T-Force / Night Hawk 16 Go")).label, "TeamGroup T-Force Night Hawk");
  assert.equal(getCatalogFamily(product("ram", "TeamGroup", "T-Force XCalibur RGB 16 Go")).label, "TeamGroup T-Force XCalibur");
  assert.equal(getCatalogFamily(product("storage", "TeamGroup", "T-FORCE G70 PRO Graphene 2 To")).label, "TeamGroup T-Force G70");
  assert.equal(getCatalogFamily(product("storage", "Lexar", "NM990 4 To")).label, "Lexar NM990");
  assert.equal(getCatalogFamily(product("psu", "Cooler Master", "Elite NEX White W700")).label, "Cooler Master Elite");
  assert.equal(getCatalogFamily(product("psu", "Antec", "High Current Gamer Gold")).label, "Antec High Current Gamer");
  assert.equal(getCatalogFamily(product("psu", "Enermax", "REVOLUTION87+")).label, "Enermax REVOLUTION");
  assert.equal(getCatalogFamily(product("psu", "Enermax", "EMG900EWT")).known, false);
});

test("commercial memory families remain independent of DDR, RGB and kit quantity", () => {
  const ddr4 = product("ram", "Corsair", "Vengeance LPX 32 Go DDR4", { memoryType: "DDR4", memorySticks: 2 });
  const ddr5 = product("ram", "Corsair", "Vengeance RGB 64 Go DDR5", { memoryType: "DDR5", memorySticks: 4 });
  assert.deepEqual(getCatalogFamily(ddr4), getCatalogFamily(ddr5));
  assert.equal(getCatalogFamily(ddr4).label, "Corsair Vengeance");
  assert.notEqual(getCatalogFamily(product("ram", "G.Skill", "Trident Z5 Neo RGB 32 Go")).id, getCatalogFamily(product("ram", "G.Skill", "Trident Z Neo 32 Go")).id);
  assert.equal(getCatalogFamily(product("ram", "Crucial", "Pro Overclocking 48 Go")).label, "Crucial Pro");
  assert.equal(getCatalogFamily(product("ram", "Other", "Vengeance style 32 Go")).label, "Autres modèles");
});

test("storage families normalize WD aliases and keep different Samsung series distinct", () => {
  assert.deepEqual(
    getCatalogFamily(product("storage", "WD_BLACK", "SN850X 2 To")),
    getCatalogFamily(product("storage", "Western Digital", "WD_Black SN850X w/Heatsink 8 To")),
  );
  assert.deepEqual(
    getCatalogFamily(product("storage", "Samsung", "990 PRO 1 To")),
    getCatalogFamily(product("storage", "Samsung", "990 EVO Plus 4 To")),
  );
  assert.notEqual(getCatalogFamily(product("storage", "Samsung", "980 PRO 2 To")).id, getCatalogFamily(product("storage", "Samsung", "990 PRO 2 To")).id);
  assert.equal(getCatalogFamily(product("storage", "Crucial", "P310 2 To")).label, "Crucial P310");
  assert.equal(getCatalogFamily(product("storage", "Mushkin", "MKNSSDED4TB-D8 4 To")).label, "Autres modèles");
});

test("power, cooling and case groups ignore wattage, radiator length and colour variants", () => {
  assert.deepEqual(getCatalogFamily(product("psu", "Corsair", "RM750e · 750 W")), getCatalogFamily(product("psu", "Corsair", "RM1000x (2021)")));
  assert.equal(getCatalogFamily(product("psu", "Corsair", "RMTitanium Prototype")).label, "Autres modèles");
  assert.deepEqual(getCatalogFamily(product("cooler", "ARCTIC", "Liquid Freezer III 240")), getCatalogFamily(product("cooler", "ARCTIC", "Liquid Freezer III 360 A-RGB White")));
  assert.deepEqual(getCatalogFamily(product("case", "Fractal Design", "North · Chalk White")), getCatalogFamily(product("case", "Fractal Design", "North · Charcoal Black")));
  assert.notEqual(getCatalogFamily(product("ram", "Kingston", "FURY Renegade 32 Go")).id, getCatalogFamily(product("storage", "Kingston", "FURY Renegade 2 To")).id);
});

test("catalogue classification is complete, stable, descriptive and leaves unknown groups explicit", () => {
  const snapshot = JSON.stringify(catalog);
  const groups = getCatalogGroups();
  assert.ok(groups.length >= 5000, "The expanded catalogue keeps at least 5,000 real model groups");
  const labels = new Map<string, string>();
  for (const component of catalog) {
    const result = getCatalogFamily(component);
    assert.match(result.id, new RegExp(`^${component.category}-[a-z0-9-]+$`), component.id);
    assert.ok(result.label.trim(), component.id);
    assert.equal(result.known, !result.id.endsWith("-other"), component.id);
    if (labels.has(result.id)) assert.equal(result.label, labels.get(result.id), result.id);
    labels.set(result.id, result.label);
  }
  for (const { id } of categories) {
    const items = catalog.filter(component => component.category === id);
    assert.ok(items.some(component => getCatalogFamily(component).known), id);
    assert.equal(getCatalogFamily(product(id, "Inconnu", "Référence inconnue")).id, `${id}-other`);
    assert.equal(getCatalogFamily(product(id, "Inconnu", "Référence inconnue")).known, false);
  }
  for (const group of groups) {
    const familyIds = new Set(group.variants.map(component => getCatalogFamily(component).id));
    assert.equal(familyIds.size, 1, `Finishes of ${group.name} must stay in the same family`);
  }
  const ram = getComponent("ram-ddr5-32")!;
  assert.deepEqual(getCatalogFamily(ram), getCatalogFamily({ ...ram, price: 1, source: { dataset: "unknown", snapshot: "2026", date: "2026-11-09", rowId: "new", url: "https://example.com" } }));
  assert.equal(JSON.stringify(catalog), snapshot, "Classification must not mutate components");
});
