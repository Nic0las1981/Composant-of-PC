/** Rebuild the catalogue from the checked-in, immutable source selection.
 * Usage: npx tsx scripts/import-catalog.ts [--check] [--source-dir PATH]
 * --source-dir additionally verifies the full upstream file hashes and row indexes.
 * No merchant prices, inferred dimensions or benchmark scores are imported.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import type { Component, FormFactor, MemoryType, Socket } from "../src/data/catalog.ts";

type SourceType = "memory" | "internal-hard-drive" | "video-card" | "motherboard" | "power-supply";
type RawRecord = Record<string, string | number | number[] | boolean | null> & { name: string };
interface SourceRow {
  id: string;
  sourceType: SourceType;
  sourceIndex: number;
  recordKey: string;
  recordHash: string;
  record: RawRecord;
}
interface Snapshot {
  schemaVersion: number;
  source: {
    repository: string;
    commit: string;
    sourceUpdated: string;
    files: Record<string, { sha256: string; rows: number; url: string }>;
  };
  selection: { baselineCount: number; counts: Record<SourceType, number>; baselineIds: string[] };
  records: SourceRow[];
}

const root = fileURLToPath(new URL("../", import.meta.url));
const snapshot = JSON.parse(await readFile(resolve(root, "data/catalog-source.json"), "utf8")) as Snapshot;
const hash = (text: string | Buffer) => createHash("sha256").update(text).digest("hex");
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b, "en")).map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
const integer = (record: RawRecord, field: string) => {
  const value = record[field];
  assert(typeof value === "number" && Number.isInteger(value) && value > 0, `Invalid ${field}: ${record.name}`);
  return value;
};
const text = (record: RawRecord, field: string) => {
  assert(typeof record[field] === "string", `Missing ${field}: ${record.name}`);
  return record[field] as string;
};
const capacity = (gb: number) => gb >= 1000 && gb % 1000 === 0 ? `${gb / 1000} To` : `${gb} Go`;
const brands = ["Western Digital", "Silicon Power", "Cooler Master", "Super Flower", "be quiet!", "SK hynix", "G.Skill"];
const brandSpelling: Record<string, string> = { Asus: "ASUS", TEAMGROUP: "TeamGroup", SeaSonic: "Seasonic", Deepcool: "DeepCool" };
function manufacturer(name: string) {
  const original = brands.find((brand) => name.toLowerCase().startsWith(`${brand.toLowerCase()} `)) ?? name.split(" ")[0];
  return { brand: brandSpelling[original] ?? original, model: name.slice(original.length).trim() };
}
const colors: Record<string, { hex: string; label: string }> = {
  Black: { hex: "#22252c", label: "Noir" }, White: { hex: "#f0efeb", label: "Blanc" },
  Silver: { hex: "#aab1bb", label: "Argent" }, Gray: { hex: "#666a72", label: "Gris" },
  Grey: { hex: "#666a72", label: "Gris" }, Red: { hex: "#bd303b", label: "Rouge" },
  Blue: { hex: "#3679bc", label: "Bleu" }, Green: { hex: "#438a60", label: "Vert" },
  Gold: { hex: "#b69a5b", label: "Or" }, Yellow: { hex: "#e1bd36", label: "Jaune" },
  Pink: { hex: "#d985ac", label: "Rose" }, Purple: { hex: "#875db0", label: "Violet" },
  Orange: { hex: "#d97e34", label: "Orange" }, Brown: { hex: "#81624d", label: "Brun" },
};
function sourceColors(record: RawRecord): Pick<Component, "color" | "accent"> & { colorLabel?: string } {
  if (typeof record.color !== "string" || !record.color) return {};
  const parts = record.color.split(" / ");
  return {
    ...(colors[parts[0]] ? { color: colors[parts[0]].hex } : {}),
    ...(parts[1] && colors[parts[1]] ? { accent: colors[parts[1]].hex } : {}),
    colorLabel: parts.map((part) => colors[part]?.label ?? part).join(" / "),
  };
}

function convert(row: SourceRow): Component {
  const record = row.record;
  const { brand, model } = manufacturer(record.name);
  const { colorLabel, ...colorValues } = sourceColors(record);
  const colorSuffix = colorLabel ? ` · ${colorLabel}` : "";
  const common = {
    id: row.id, brand, price: 0, priceStatus: "unknown" as const, detailLevel: "partial" as const,
    source: {
      dataset: "docyx/pc-part-dataset",
      url: `${snapshot.source.repository}/blob/${snapshot.source.commit}/data/json/${row.sourceType}.json`,
      snapshot: snapshot.source.commit, date: snapshot.source.sourceUpdated,
      rowId: `${row.sourceType}:${row.sourceIndex}-${row.recordHash.slice(0, 12)}`,
    },
    ...colorValues,
    ...(/RGB/i.test(record.name) ? { rgb: true } : {}),
  };
  const colorSpecs = colorLabel ? [`Coloris : ${colorLabel}`] : [];
  if (row.sourceType === "memory") {
    assert(Array.isArray(record.speed) && Array.isArray(record.modules));
    const [generation, speed] = record.speed;
    const [sticks, moduleGB] = record.modules;
    assert([4, 5].includes(generation) && [1, 2, 4].includes(sticks));
    assert([4, 8, 16, 24, 32, 48, 64].includes(moduleGB) && speed >= 2000 && speed <= 7200);
    assert(/^(Corsair (Vengeance|Dominator)|G\.Skill (Ripjaws V|Ripjaws S5|Trident Z|Flare X|Aegis)|Kingston (FURY (Beast|Renegade)|HyperX (Fury|Predator))|TEAMGROUP (T-Force|T-Create)|Patriot Viper|Silicon Power (GAMING|XPOWER)|ADATA XPG|Crucial (Pro|Ballistix))/i.test(record.name));
    // Several workstation/laptop families omit RDIMM or SO-DIMM from their
    // dataset name. Exclude those ambiguous families instead of guessing DIMM.
    assert(!/SO.?DIMM|\bECC\b|Registered|RDIMM|CUDIMM|Impact|Renegade Pro|T-Create Master|T-Create Classic|^Corsair Vengeance \d|^Crucial Ballistix(?: Sport(?: LT)?)? \d|^Patriot Viper (?:Steel|4) \d/i.test(record.name));
    const cas = integer(record, "cas_latency");
    const memoryType = `DDR${generation}` as MemoryType;
    const totalGB = sticks * moduleGB;
    const family = model.replace(/\s+\d+(?:\.\d+)?\s*GB\b/gi, "").trim();
    return {
      ...common, category: "ram", name: `${family} ${totalGB} Go (${sticks} × ${moduleGB} Go) ${memoryType}-${speed} CL${cas}${colorSuffix}`,
      description: `Référence de mémoire de bureau : ${sticks} barrette${sticks > 1 ? "s" : ""} de ${moduleGB} Go. Vitesse annoncée ; fréquence effective et stabilité selon processeur, carte mère et réglages. Hauteur et profils mémoire non documentés dans cette source.`,
      specs: [`${totalGB} Go · ${sticks} × ${moduleGB} Go`, `${memoryType} · ${speed} MT/s`, `CAS CL${cas}`, "Format DIMM de bureau", ...colorSpecs, ...(common.rgb ? ["RGB mentionné dans la référence"] : [])],
      capacityGB: totalGB, memorySticks: sticks, memoryType, memorySpeedMTs: speed, casLatency: cas, memoryModuleFormat: "DIMM",
      ...(/EXPO/i.test(record.name) ? { memoryProfile: /XMP/i.test(record.name) ? "EXPO/XMP" as const : "EXPO" as const } : /XMP/i.test(record.name) ? { memoryProfile: "XMP" as const } : {}),
    };
  }
  if (row.sourceType === "internal-hard-drive") {
    assert(record.type === "SSD" && record.form_factor === "M.2-2280" && /PCIe [45]\.0/.test(text(record, "interface")));
    assert(!/RGB/i.test(record.name));
    const gb = integer(record, "capacity");
    const connection = text(record, "interface").replace(/^M\.2 /, "").replace(/X(\d)/, "×$1");
    return {
      ...common, category: "storage", name: `${model} ${capacity(gb)} · ${connection}`,
      description: "SSD au format M.2 2280 et interface PCIe. Débits, endurance, hauteur du dissipateur et compatibilité exacte avec les emplacements de la carte mère restent à vérifier sur la fiche constructeur.",
      specs: [capacity(gb), "M.2 2280 · NVMe", connection, ...(typeof record.cache === "number" ? [`Cache déclaré : ${record.cache} Mo`] : [])],
      capacityGB: gb, storageInterface: "M.2 NVMe",
    };
  }
  if (row.sourceType === "video-card") {
    const chipset = text(record, "chipset");
    const memory = integer(record, "memory");
    const length = integer(record, "length");
    const chipName = chipset.replace(/GeForce |Radeon |Intel /g, "").replace(/\s+\d+GB$/, "");
    const modelContainsChip = model.replace(/\s/g, "").toLowerCase().includes(chipName.replace(/\s/g, "").toLowerCase());
    return {
      ...common, category: "gpu", name: `${modelContainsChip ? model : `${model} ${chipName}`} · ${memory} Go${colorSuffix} · ${length} mm`,
      description: "Modèle et coloris référencés dans le catalogue source. La longueur est documentée ; épaisseur, hauteur, connecteurs, consommation et performances ne le sont pas. Aperçu 3D schématique.",
      specs: [chipset, `${memory} Go de mémoire vidéo`, `Longueur ${length} mm`, ...(typeof record.core_clock === "number" ? [`Fréquence de base : ${record.core_clock} MHz`] : []), ...(typeof record.boost_clock === "number" ? [`Boost déclaré : ${record.boost_clock} MHz`] : []), ...colorSpecs],
      capacityGB: memory, lengthMm: length,
    };
  }
  if (row.sourceType === "motherboard") {
    const socket = text(record, "socket") as Socket;
    assert(["AM4", "AM5", "LGA1700"].includes(socket));
    const formFactors: Record<string, FormFactor> = { ATX: "ATX", "Micro ATX": "Micro-ATX", "Mini ITX": "Mini-ITX" };
    const formFactor = formFactors[text(record, "form_factor")];
    assert(formFactor);
    const memorySlots = integer(record, "memory_slots");
    assert([2, 4].includes(memorySlots), `Unsupported or suspect slot count: ${record.name}`);
    const maxMemoryGB = integer(record, "max_memory");
    const memoryType: MemoryType | undefined = socket === "AM4" ? "DDR4" : socket === "AM5" ? "DDR5" : /\b(?:DDR4|D4)\b/i.test(record.name) ? "DDR4" : /\b(?:DDR5|D5)\b/i.test(record.name) ? "DDR5" : undefined;
    return {
      ...common, category: "motherboard", name: model,
      description: `Carte mère ${formFactor} pour socket ${socket}. Nombre de DIMM et capacité totale déclarés par la source ; vérifier la liste QVL et le BIOS pour chaque kit et processeur. ${memoryType ? "Emplacements M.2 et détails des connecteurs non documentés." : "Type DDR non renseigné : compatibilité mémoire à confirmer."}`,
      specs: [`Socket ${socket}`, formFactor, `${memorySlots} emplacements DIMM`, `Jusqu’à ${maxMemoryGB} Go selon BIOS et processeur`, memoryType ?? "Type DDR à confirmer", ...colorSpecs],
      socket, formFactor, memorySlots, maxMemoryGB, ...(memoryType ? { memoryType } : {}),
    };
  }
  assert(row.sourceType === "power-supply" && ["ATX", "SFX"].includes(text(record, "type")));
  assert(!/RGB/i.test(record.name));
  assert(!/SFX[ -]?L|SF\d+L|ROG LOKI/i.test(record.name));
  assert(!(record.type === "SFX" && (/^Silverstone/i.test(record.name) || /SGX|Dagger/i.test(record.name))));
  const watts = integer(record, "wattage");
  const psuFormat = record.type as "ATX" | "SFX";
  const modular = record.modular === "Full" ? "Entièrement modulaire" : record.modular === "Semi" ? "Semi-modulaire" : record.modular === false ? "Câbles fixes" : undefined;
  const efficiency = typeof record.efficiency === "string" ? record.efficiency === "plus" ? "80 PLUS" : `80 PLUS ${record.efficiency.charAt(0).toUpperCase() + record.efficiency.slice(1)}` : undefined;
  return {
    ...common, category: "psu", name: `${model} · ${watts} W · ${psuFormat}${colorSuffix}`,
    description: "Alimentation dont la puissance et le format sont renseignés. Dimensions exactes, connecteurs GPU, câblage et révision ATX doivent être vérifiés auprès du constructeur.",
    specs: [`${watts} W`, `Format ${psuFormat}`, ...(efficiency ? [`Certification déclarée : ${efficiency}`] : []), ...(modular ? [modular] : []), ...colorSpecs],
    wattage: watts, psuFormat,
  };
}

assert.equal(snapshot.schemaVersion, 1);
assert.match(snapshot.source.commit, /^[a-f0-9]{40}$/);
assert(snapshot.records.length >= 1000, "At least 1,000 additional references are required");
const ids = new Set<string>();
const keys = new Set<string>();
const counts: Record<string, number> = {};
for (const row of snapshot.records) {
  assert(!ids.has(row.id) && !snapshot.selection.baselineIds.includes(row.id), `Duplicate id: ${row.id}`);
  assert(!keys.has(`${row.sourceType}:${row.recordKey}`), `Duplicate reference: ${row.id}`);
  assert(row.id.endsWith(`-${hash(row.recordKey).slice(0, 12)}`), `Unstable reference id: ${row.id}`);
  assert.equal(hash(canonical(row.record)), row.recordHash, `Record checksum failed: ${row.id}`);
  assert(row.sourceIndex >= 0 && row.sourceIndex < snapshot.source.files[`${row.sourceType}.json`].rows);
  ids.add(row.id); keys.add(`${row.sourceType}:${row.recordKey}`);
  counts[row.sourceType] = (counts[row.sourceType] ?? 0) + 1;
}
assert.deepEqual(counts, snapshot.selection.counts);
const args = process.argv.slice(2);
const sourceDirIndex = args.indexOf("--source-dir");
if (sourceDirIndex !== -1) {
  const directory = args[sourceDirIndex + 1];
  assert(directory, "--source-dir requires a directory");
  for (const type of Object.keys(counts)) {
    const filename = `${type}.json`;
    const contents = await readFile(resolve(directory, filename));
    assert.equal(hash(contents), snapshot.source.files[filename].sha256, `Upstream file checksum failed: ${filename}`);
    const rows = JSON.parse(contents.toString("utf8")) as RawRecord[];
    for (const selected of snapshot.records.filter((row) => row.sourceType === type)) {
      assert.equal(hash(canonical(rows[selected.sourceIndex])), selected.recordHash, `Source row mismatch: ${selected.id}`);
    }
  }
}

const components = snapshot.records.map(convert);
// Small typed batches keep TypeScript's contextual union below its complexity limit.
const batches: string[] = [];
for (let start = 0; start < components.length; start += 100) {
  batches.push(`const batch${batches.length}: Component[] = [\n${components.slice(start, start + 100).map((component) => `  ${JSON.stringify(component)},`).join("\n")}\n];`);
}
const output = `// Generated by scripts/import-catalog.ts; edit the source selection or importer.\n// Source: docyx/pc-part-dataset, MIT, Copyright (c) 2021-2025 Doc Oliver.\n// Snapshot ${snapshot.source.commit} (${snapshot.source.sourceUpdated}).\n// Partial specifications; source USD prices are deliberately not imported.\nimport type { Component } from "./catalog.ts";\n\n${batches.join("\n\n")}\n\nexport const catalogImported: Component[] = [${batches.map((_, index) => `...batch${index}`).join(", ")}];\n`;
const destination = resolve(root, "src/data/catalogImported.ts");
if (args.includes("--check")) {
  assert.equal(await readFile(destination, "utf8"), output, "Generated catalogue is stale; run npx tsx scripts/import-catalog.ts");
} else {
  await writeFile(destination, output);
}
console.log(`${args.includes("--check") ? "Verified" : "Generated"} ${components.length} references: ${JSON.stringify(counts)}`);
