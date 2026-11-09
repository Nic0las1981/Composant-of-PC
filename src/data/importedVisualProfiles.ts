import { catalogImported } from "./catalogImported.ts";
import { catalogOemMemory } from "./catalogOemMemory.ts";
import type { Component, FormFactor } from "./catalog.ts";
import type {
  BoardVisualProfile,
  GpuVisualProfile,
  PsuVisualProfile,
  RamVisualProfile,
  StorageVisualProfile,
  VisualProfile,
} from "./visualProfiles.ts";

/**
 * The public dataset documents real retail references, but not their CAD,
 * complete dimensions or connector layout. These lightweight templates keep
 * each imported reference visible without turning an unknown measurement into
 * a compatibility fact. Every derived profile is explicitly schematic.
 *
 * Never copy a fallback from this module back into Component. Specifications
 * and compatibility must read the catalogue; a schematic profile is artwork.
 */
const positive = (value: number | undefined, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;

function finish(component: Component, fallback = "#32383c") {
  if (component.color && /^#[\da-f]{6}$/i.test(component.color)) return component.color;
  // Only explicit colour variants change the generic finish. A model called
  // "Red Devil", for example, is not evidence for an entirely red shroud.
  if (/\bwhite\b|\bblanc(?:he)?\b/i.test(component.name)) return "#d9dde0";
  if (component.category === "ram" && /\bgold\b|\bdor[ée]/i.test(component.name)) return "#b5a16c";
  if (/\bsilver\b|\bargent\b/i.test(component.name)) return "#a7aeb3";
  return fallback;
}

function base(component: Component) {
  const name = component.name.toLocaleLowerCase("fr").startsWith(component.brand.toLocaleLowerCase("fr"))
    ? component.name : `${component.brand} ${component.name}`;
  return {
    id: component.id,
    name,
    category: component.category,
    color: finish(component),
    accent: component.accent || "#b4c2cb",
    // Missing RGB documentation is not treated as a physical claim that LEDs
    // do not exist; the conservative schematic simply adds no invented light.
    rgb: component.rgb === true,
    fidelity: "schematic" as const,
  };
}

const boardDimensions: Record<FormFactor, readonly [number, number]> = {
  ATX: [305, 244],
  "Micro-ATX": [244, 244],
  "Mini-ITX": [170, 170],
};

/** Make a display envelope for a supported imported category, without mutation. */
export function createImportedVisualProfile(component: Component): VisualProfile | undefined {
  const common = base(component);
  switch (component.category) {
    case "ram": {
      const low = /\blpx\b|\bvalue(?:ram)?\b|\bpremier\b/i.test(component.name);
      const rgb = component.rgb === true;
      const bare = component.memoryHeatspreader === false;
      const heightMm = positive(component.heightMm, bare ? 31.25 : rgb ? 44 : low ? 32 : 37);
      const profile: RamVisualProfile = {
        ...common,
        category: "ram",
        heightMm,
        lengthMm: positive(component.lengthMm, component.memoryModuleFormat === "SO-DIMM" ? 69.6 : 133.35),
        thicknessMm: positive(component.thicknessMm, bare ? 3.8 : 7),
        sticks: positive(component.memorySticks, 1),
        heatspreaderColor: finish(component, "#353c40"),
        hasHeatspreader: component.memoryHeatspreader,
        pcbColor: bare ? finish(component, "#2d684d") : "#253b31",
      };
      return profile;
    }
    case "motherboard": {
      const formFactor = component.formFactor || "ATX";
      const [height, width] = boardDimensions[formFactor];
      const profile: BoardVisualProfile = {
        ...common,
        category: "motherboard",
        formFactor,
        heightMm: positive(component.heightMm, height),
        widthMm: positive(component.widthMm, width),
        slots: positive(component.memorySlots, formFactor === "Mini-ITX" ? 2 : 4),
        pcbColor: "#25312e",
        heatsinkColor: finish(component, "#4d565c"),
      };
      return profile;
    }
    case "gpu": {
      const lengthMm = positive(component.lengthMm, 270);
      const fans = positive(component.fanCount, /\btrio\b|\btriple\b|\b3x\b/i.test(component.name)
        ? 3 : /\bdual\b|\btwin\b|\b2x\b/i.test(component.name) ? 2 : lengthMm >= 295 ? 3 : lengthMm >= 215 ? 2 : 1);
      const flowThrough = /founders edition/i.test(component.name) && /RTX\s*(?:30|40|50)\d{2}/i.test(component.name);
      const profile: GpuVisualProfile = {
        ...common,
        category: "gpu",
        lengthMm,
        heightMm: positive(component.heightMm, 128),
        thicknessMm: positive(component.thicknessMm, 48),
        fanCount: fans,
        fanSizeMm: positive(component.fanSizeMm, Math.min(100, Math.max(65, (lengthMm - 24) / fans))),
        shroudColor: finish(component),
        backplateColor: finish(component, "#4b5358"),
        fanLayout: flowThrough ? "flow-through" : "inline",
        // An RGB word in a card name does not document illuminated fan rings.
        fanRgb: false,
      };
      return profile;
    }
    case "storage": {
      const hasHeatsink = /\bheat[\s-]?sink\b|\bdissipateur\b/i.test(component.name);
      const profile: StorageVisualProfile = {
        ...common,
        category: "storage",
        widthMm: positive(component.widthMm, 22),
        lengthMm: positive(component.lengthMm, 80),
        heightMm: positive(component.heightMm, hasHeatsink ? 10 : 2.5),
        labelColor: finish(component, "#36434b"),
        hasHeatsink,
      };
      return profile;
    }
    case "psu": {
      const format = component.psuFormat || "ATX";
      const sfx = format === "SFX";
      const profile: PsuVisualProfile = {
        ...common,
        category: "psu",
        widthMm: positive(component.widthMm, sfx ? 125 : 150),
        heightMm: positive(component.heightMm, sfx ? 63.5 : 86),
        depthMm: positive(component.depthMm, sfx ? 100 : 140),
        fanSizeMm: positive(component.fanSizeMm, sfx ? 92 : 120),
        format,
      };
      return profile;
    }
    default:
      return undefined;
  }
}

export const importedVisualProfiles: Record<string, VisualProfile> = Object.fromEntries(
  [...catalogImported, ...catalogOemMemory].map((component) => {
    const profile = createImportedVisualProfile(component);
    if (!profile) throw new Error(`Unsupported imported visual category: ${component.category} (${component.id})`);
    return [component.id, profile];
  }),
);

function profilesOf<T extends VisualProfile>(category: T["category"]): Record<string, T> {
  return Object.fromEntries(Object.entries(importedVisualProfiles).filter(([, profile]) => profile.category === category)) as Record<string, T>;
}

export const importedRamProfiles = profilesOf<RamVisualProfile>("ram");
export const importedBoardProfiles = profilesOf<BoardVisualProfile>("motherboard");
export const importedGpuProfiles = profilesOf<GpuVisualProfile>("gpu");
export const importedStorageProfiles = profilesOf<StorageVisualProfile>("storage");
export const importedPsuProfiles = profilesOf<PsuVisualProfile>("psu");
