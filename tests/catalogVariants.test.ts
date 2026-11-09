import test from "node:test";
import assert from "node:assert/strict";
import { catalog, defaultSelection, getComponent, type Component } from "../src/data/catalog.ts";
import { legacyVariantMetadata } from "../src/data/legacyVariants.ts";
import { getCatalogGroups, getDefaultVariant, getVariantGroup, getVariantGroupId, getVariantLabel, groupVariants } from "../src/lib/catalogVariants.ts";

const finish = (id: string, label: string, price: number): Component => ({
  ...getComponent("case-4000d")!, id, price, finishName: label,
  variantGroupId: "test-4000d", variantGroupName: "4000D Airflow",
});

test("only explicit variant metadata collapses colours; similar names remain separate", () => {
  const black = finish("test-black", "Noir", 100);
  const white = finish("test-white", "Blanc", 120);
  const unrelated = { ...black, id: "test-ungrouped", variantGroupId: undefined, variantGroupName: undefined };
  const groups = groupVariants([black, white, unrelated, black]);
  assert.equal(groups.length, 2);
  assert.equal(groups[0].name, "4000D Airflow");
  assert.deepEqual(groups[0].variants, [black, white]);
  assert.equal(groups[0].variants[0], black);
  assert.equal(groups[1].variants[0], unrelated);
  assert.notEqual(getVariantGroupId(black), getVariantGroupId({ ...black, category: "ram" }));
  const undeclaredBase = { ...unrelated, id: "test-4000d" };
  assert.equal(groupVariants([black, undeclaredBase]).length, 2, "A group key must not capture an unannotated component with the same raw ID");
});

test("filtering variants before grouping does not reintroduce an excluded finish or its price", () => {
  const black = finish("test-black", "Noir", 100);
  const white = finish("test-white", "Blanc", 120);
  const affordable = groupVariants([black, white].filter(component => component.price <= 110));
  assert.equal(affordable.length, 1);
  assert.deepEqual(affordable[0].variants, [black]);
  assert.equal(getDefaultVariant(affordable[0], white.id).id, black.id);
  assert.equal(white.price, 120);
});

test("the actual chosen retail ID survives defaults, saves and independent finish prices", () => {
  const black = finish("test-black", "Noir", 120);
  const white = finish("test-white", "Blanc", 100);
  const group = groupVariants([black, white])[0];
  assert.equal(getDefaultVariant(group), black);
  assert.equal(getDefaultVariant(group, white.id), white);
  const selection = { ...defaultSelection, case: white.id };
  const saved = JSON.stringify(selection);
  assert.equal(getDefaultVariant(group, selection), white);
  assert.equal(JSON.stringify(selection), saved);
  assert.throws(() => getDefaultVariant({ ...group, variants: [] }), /au moins une référence/);
});

test("an illustrative black colour does not become a claimed retail colour", () => {
  const component = { ...finish("test-unknown", "", 100), color: "#000000", finishName: undefined };
  assert.equal(getVariantLabel(component), "Coloris non renseigné");
  assert.equal(getVariantLabel({ ...component, finishName: "  Blanc / Argent  " }), "Blanc / Argent");
});

test("legacy colour pairs preserve identical chassis limits and never merge the ARGB cooler", () => {
  const groups = groupVariants(Object.keys(legacyVariantMetadata).map(id => ({ ...getComponent(id)!, ...legacyVariantMetadata[id] })));
  assert.equal(groups.length, 2);
  for (const group of groups) {
    assert.equal(group.variants.length, 2);
    const [left, right] = group.variants;
    for (const field of ["supportedFormFactors", "maxGpuLengthMm", "maxCoolerHeightMm", "supportedPsuFormats", "radiatorSupport", "widthMm", "heightMm", "depthMm", "rgb"] as const) {
      assert.deepEqual(left[field], right[field], `${group.name}: ${field}`);
    }
  }
  assert.equal(legacyVariantMetadata["cooler-lfiii360"], undefined);
  assert.equal(legacyVariantMetadata["cooler-lfiii360-argb-white"], undefined);
  assert.equal(legacyVariantMetadata["ram-ddr5-32-white"], undefined);
  assert.equal(getVariantGroup("case-4000d"), getVariantGroup("case-4000d-white"));
  assert.equal(getVariantGroup("case-north"), getVariantGroup("case-north-white"));
  assert.notEqual(getVariantGroup("cooler-lfiii360"), getVariantGroup("cooler-lfiii360-argb-white"));
  assert.notEqual(getVariantGroup("ram-ddr5-32"), getVariantGroup("ram-ddr5-32-white"));
});

test("all saved component IDs round-trip through groups without orphaned or duplicated variants", () => {
  const groups = getCatalogGroups();
  assert.equal(groups.reduce((sum, group) => sum + group.variants.length, 0), catalog.length);
  assert.equal(new Set(groups.map(group => group.id)).size, groups.length);
  for (const component of catalog) {
    const group = getVariantGroup(component.id);
    assert.ok(group, component.id);
    assert.equal(getVariantGroup(component), group);
    assert.equal(getVariantGroup(group.id), group);
    assert.equal(group.category, component.category);
    assert.ok(group.variants.includes(component));
    assert.equal(getDefaultVariant(group, component.id), component);
  }
  assert.equal(getVariantGroup("missing-reference"), undefined);
  assert.equal(getVariantGroup(null), undefined);
  assert.ok(getCatalogGroups("ram").every(group => group.category === "ram"));
});

test("declared finish groups never combine conflicting known capacity or compatibility characteristics", () => {
  const fields: Array<keyof Component> = [
    "brand", "socket", "memoryType", "supportedMemory", "formFactor", "supportedFormFactors",
    "capacityGB", "memorySticks", "memorySpeedMTs", "casLatency", "memoryModuleFormat",
    "memoryRegistered", "memoryEcc", "memoryProfile", "memoryRankCount", "memoryDeviceWidthBits",
    "memoryVoltageV", "memoryModuleKind", "memoryHeatspreader", "maxMemoryGB", "memorySlots",
    "lengthMm", "widthMm", "heightMm", "depthMm", "thicknessMm", "fanCount", "fanSizeMm",
    "powerW", "wattage", "psuFormat", "rgb", "coolingType", "radiatorSizeMm", "radiatorThicknessMm",
  ];
  for (const group of getCatalogGroups().filter(group => group.variants.length > 1)) {
    for (const field of fields) {
      const known = new Set(group.variants.map(variant => variant[field]).filter(value => value !== undefined).map(value => JSON.stringify(value)));
      assert.ok(known.size <= 1, `${group.id} combines conflicting ${field}`);
    }
  }
});
