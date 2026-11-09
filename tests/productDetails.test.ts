import test from "node:test";
import assert from "node:assert/strict";
import { catalog, getComponent, type Component } from "../src/data/catalog.ts";
import { getProductDetails, getComparisonRows } from "../src/lib/productDetails.ts";

const rowsFor = (component: Component) =>
  Object.fromEntries(getProductDetails(component).groups.flatMap((group) => group.rows).map((row) => [row.label, row.value]));

const sparse = (category: Component["category"]): Component => ({
  id: `unknown-${category}`, category, brand: "Test", name: "Modèle sans fiche technique",
  price: 100, description: "Données à compléter", specs: [],
});

test("AIO radiator dimensions and pump height are distinct from an air cooler clearance", () => {
  const aio = rowsFor(getComponent("cooler-kraken240")!);
  assert.equal(aio["Type"], "Watercooling AIO");
  assert.equal(aio["Radiateur : format nominal"], "240 mm");
  assert.equal(aio["Radiateur : dimensions (L × l)"], "275 × 123 mm");
  assert.equal(aio["Radiateur : épaisseur"], "30 mm hors ventilateurs");
  assert.equal(aio["Hauteur du bloc pompe"], "55 mm");
  assert.equal(aio["Habillage de la pompe"], "Écran LCD");
  assert.equal(aio["Ventilateurs"], "2 × 120 mm");
  assert.ok(!Object.hasOwn(aio, "Hauteur du ventirad"));
  assert.ok(!Object.hasOwn(aio, "Caloducs"));

  const air = rowsFor(getComponent("cooler-phantom")!);
  assert.equal(air["Hauteur du ventirad"], "154 mm");
  assert.equal(air["Caloducs"], "7");
  assert.ok(!Object.hasOwn(air, "Hauteur du bloc pompe"));
  assert.ok(!Object.keys(air).some((key) => key.startsWith("Radiateur")));
});

test("missing product metadata does not imply a socket, physical size or cooling type", () => {
  for (const category of ["cpu", "gpu", "motherboard", "ram", "storage", "cooler", "psu", "case"] as const) {
    const product = sparse(category);
    const details = getProductDetails(product);
    assert.deepEqual(details.groups, [], category);
    assert.deepEqual(details.highlights, [], category);
  }

  const unrecognizedCooler = rowsFor({ ...sparse("cooler"), heightMm: 60 });
  assert.ok(!Object.hasOwn(unrecognizedCooler, "Hauteur du ventirad"));
  assert.ok(!Object.hasOwn(unrecognizedCooler, "Hauteur du bloc pompe"));
  const wrongCategoryId = rowsFor({ ...sparse("gpu"), id: "cpu-7800x3d" });
  assert.deepEqual(wrongCategoryId, {});
});

test("comparison aligns each product with its own values and keeps unknown fields explicit", () => {
  const left = getComponent("gpu-4070s")!;
  const right = { ...sparse("gpu"), powerW: 150, lengthMm: 240 };
  const rows = getComparisonRows([left, right]);
  assert.deepEqual(rows.find((row) => row.label === "Longueur")?.values, ["267 mm", "240 mm"]);
  assert.deepEqual(rows.find((row) => row.label === "Puissance retenue pour l’estimation")?.values, ["220 W", "150 W"]);
  assert.deepEqual(rows.find((row) => row.label === "Mémoire vidéo")?.values, ["12 Go GDDR6X", "Non renseigné"]);
  assert.ok(rows.every((row) => row.values.length === 2));
  assert.ok(!rows.some((row) => /Socket|DIMM|Radiateur|Caloducs/.test(row.label)));
  assert.deepEqual(getComparisonRows([left, getComponent("cpu-7600")!]), []);
  assert.deepEqual(getComparisonRows([]), []);
});

test("radiator support distinguishes unavailable mounts from unknown information", () => {
  const h6 = rowsFor(getComponent("case-h6")!);
  assert.equal(h6["Dimensions (l × H × P)"], "287 × 435 × 415 mm");
  assert.equal(h6["Radiateur : dessus"], "120 / 240 / 280 / 360 mm");
  assert.equal(h6["Radiateur : façade"], "Aucun");
  assert.equal(h6["Radiateur : côté"], "Aucun");
  assert.equal(h6["Ventilateurs fournis"], "3 × 120 mm");
  const terra = getProductDetails(getComponent("case-terra")!);
  assert.ok(terra.advice.some((value) => value.includes("partagés")));
  assert.ok(terra.advice.some((value) => value.includes("Aucun emplacement de radiateur")));
  assert.equal(rowsFor(getComponent("case-terra")!)["Ventilateurs fournis"], "Aucun");
  const comparison = getComparisonRows([getComponent("case-terra")!, sparse("case")]);
  assert.deepEqual(comparison.find((row) => row.label === "Radiateur : dessus")?.values, ["Aucun", "Non renseigné"]);

  const partial = rowsFor({ ...sparse("case"), radiatorSupport: { top: [240], front: [] } });
  assert.equal(partial["Radiateur : dessus"], "240 mm");
  assert.equal(partial["Radiateur : façade"], "Aucun");
  assert.ok(!Object.hasOwn(partial, "Radiateur : côté"));
});

test("CPU thermal specification is not replaced by the power estimate", () => {
  const cpu = rowsFor(getComponent("cpu-7600")!);
  assert.equal(cpu["Puissance annoncée"], "65 W TDP");
  assert.equal(cpu["Puissance retenue pour l’estimation"], "88 W");
  assert.equal(cpu["Cœurs et threads"], "6 cœurs · 12 threads");
  assert.equal(cpu["Mémoire prise en charge"], "DDR5");
});

test("memory transfer rate and CAS latency come from explicit specs, without inventing a profile", () => {
  const ram = rowsFor(getComponent("ram-ddr5-32")!);
  assert.equal(ram["Capacité totale"], "32 Go");
  assert.equal(ram["Composition du kit"], "2 × 16 Go");
  assert.equal(ram["Débit mémoire annoncé"]?.replace(/\s/g, ""), "6000MT/s");
  assert.equal(ram["Latence CAS"], "CL30");
  assert.equal(ram["Profil mémoire"], "AMD EXPO");
  const noProfile = rowsFor({ ...sparse("ram"), memoryType: "DDR5", specs: ["DDR5-5600", "CL46"] });
  assert.ok(!Object.hasOwn(noProfile, "Profil mémoire"));
  assert.ok(!Object.hasOwn(noProfile, "Capacité totale"));
});

test("combined expansion specs keep each fact under the correct label", () => {
  const cpu = rowsFor(getComponent("cpu-5700x3d")!);
  assert.equal(cpu["Puissance annoncée"], "105 W de base");
  assert.equal(cpu["Puissance retenue pour l’estimation"], "142 W");
  assert.equal(cpu["Cache"], "96 Mo de cache L3");
  assert.equal(cpu["Circuit graphique"], "sans circuit graphique");
  assert.equal(cpu["Dimensions (l × L × ép.)"], "40 × 40 × 4,2 mm");
  const ram = rowsFor(getComponent("ram-fury-ddr5-32-6000")!);
  assert.equal(ram["Composition du kit"], "2 × 16 Go");
  assert.equal(ram["Latence CAS"], "CL36");
  const psu = rowsFor(getComponent("psu-mag-a750gl")!);
  assert.equal(psu["Certification annoncée"], "80 PLUS Gold");
  assert.equal(psu["Norme électrique annoncée"], "ATX 3.0");
  assert.equal(psu["Connecteur graphique annoncé"], "connecteur 12VHPWR");
  const board = rowsFor(getComponent("mb-b550m-pro4")!);
  assert.equal(board["Réseau annoncé"], "Ethernet 1 Gb/s");
  assert.equal(board["Autres équipements"], "HDMI et DisplayPort");
  const ssd = rowsFor(getComponent("ssd-970evo-1")!);
  assert.equal(ssd["Lecture annoncée"], "Lecture jusqu’à 3500 Mo/s");
  assert.equal(ssd["Écriture annoncée"], "écriture jusqu’à 3300 Mo/s");
  assert.ok(!Object.hasOwn(ssd, "Débit annoncé"));
});

test("a digital air cooler does not imply RGB fans or a watercooling pump", () => {
  const digital = rowsFor(getComponent("cooler-ak620-digital")!);
  assert.equal(digital["Type"], "Ventirad double tour");
  assert.equal(digital["Éclairage des ventilateurs"], "Sans RGB");
  assert.equal(digital["Affichage"], "Écran de température");
  assert.equal(digital["Habillage"], "éclairage ARGB sur le capot");
  assert.ok(!Object.hasOwn(digital, "Hauteur du bloc pompe"));
  assert.ok(!Object.hasOwn(digital, "Habillage de la pompe"));
});

test("catalogue details are grouped, unique and never leak internal performance scores", () => {
  for (const component of catalog) {
    const details = getProductDetails(component);
    const rows = details.groups.flatMap((group) => group.rows);
    assert.ok(rows.length > 0, component.id);
    assert.equal(rows.length, new Set(rows.map((row) => row.label)).size, component.id);
    assert.ok(rows.every((row) => row.label && row.value && !/undefined|NaN|Infinity/.test(row.value)), component.id);
    assert.ok(!rows.some((row) => /score|FPS|prix/i.test(row.label)), component.id);
    assert.ok(details.groups.every((group) => group.title && group.rows.length));
    assert.ok(details.highlights.length <= 4);
  }
});
