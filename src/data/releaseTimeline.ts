import type { Component } from "./catalog.ts";

/** A chronological reference, not a claim about the exact retail variant.
 * Only the precision actually known is stored. Dataset acquisition/update dates
 * and catalogue insertion order must never be used as product release dates.
 * Historical year mappings and their limits are documented in CHRONOLOGIE.md.
 */
export interface ReleaseInfo {
  year: number;
  month?: number;
  day?: number;
  basis: "model" | "generation" | "series";
  label: string;
  sourceUrl?: string;
  sourceName?: string;
  note?: string;
}

function historical(year: number, basis: ReleaseInfo["basis"], subject: string, note?: string): ReleaseInfo {
  return {
    year, basis, label: subject,
    sourceName: `Repère historique éditorial : ${subject}`,
    note: note ?? (basis === "model"
      ? "Année de commercialisation du modèle ; jour et mois non renseignés."
      : "Année de lancement de la gamme, pas nécessairement celle de cette capacité, couleur ou révision."),
  };
}

const cpuYears: Record<string, number> = {
  "5500": 2022, "5600": 2022, "5600X": 2020, "5700X": 2022,
  "5700X3D": 2024, "5800X3D": 2022, "5900X": 2020, "5950X": 2020,
  "7500F": 2023, "7600": 2023, "7600X": 2022, "7700": 2023,
  "7700X": 2022, "7800X3D": 2023, "7900": 2023, "7900X": 2022,
  "7950X": 2022, "9600X": 2024, "9700X": 2024, "9800X3D": 2024,
  "12400F": 2022, "12600KF": 2021, "13600KF": 2022,
  "13700KF": 2022, "14600KF": 2023, "14700KF": 2023,
};
const cpuMonths: Record<string, number> = {
  "5500": 4, "5600": 4, "5600X": 11, "5700X": 4, "5700X3D": 1,
  "5800X3D": 4, "5900X": 11, "5950X": 11, "7500F": 7, "7600": 1,
  "7600X": 9, "7700": 1, "7700X": 9, "7800X3D": 4, "7900": 1,
  "7900X": 9, "7950X": 9, "9600X": 8, "9700X": 8, "9800X3D": 11,
  "12400F": 1, "12600KF": 11, "13600KF": 10, "13700KF": 10,
  "14600KF": 10, "14700KF": 10,
};

// Most partner cards do not have their own release date in the source. The GPU
// chip's commercial introduction is therefore always labelled a generation.
const gpuYears: Record<string, number> = {
  "RTX 5090": 2025, "RTX 5080": 2025, "RTX 5070 TI": 2025,
  "RTX 5070": 2025, "RTX 5060 TI": 2025, "RTX 5060": 2025, "RTX 5050": 2025,
  "RTX 4090": 2022, "RTX 4080 SUPER": 2024, "RTX 4080": 2022,
  "RTX 4070 TI SUPER": 2024, "RTX 4070 TI": 2023, "RTX 4070 SUPER": 2024,
  "RTX 4070": 2023, "RTX 4060 TI": 2023, "RTX 4060": 2023,
  "RTX 3090 TI": 2022, "RTX 3090": 2020, "RTX 3080 TI": 2021,
  "RTX 3080": 2020, "RTX 3070 TI": 2021, "RTX 3070": 2020,
  "RTX 3060 TI": 2020, "RTX 3060": 2021, "RTX 3050": 2022,
  "RTX 2080 TI": 2018, "RTX 2080 SUPER": 2019, "RTX 2080": 2018,
  "RTX 2070 SUPER": 2019, "RTX 2070": 2018, "RTX 2060 SUPER": 2019,
  "RTX 2060": 2019, "GTX 1660 SUPER": 2019, "GTX 1660 TI": 2019,
  "GTX 1660": 2019, "GTX 1650 SUPER": 2019, "GTX 1650": 2019, "GTX 1630": 2022,
  "RX 9070 XT": 2025, "RX 9070": 2025, "RX 9060 XT": 2025,
  "RX 7900 XTX": 2022, "RX 7900 XT": 2022, "RX 7900 GRE": 2023,
  "RX 7800 XT": 2023, "RX 7700 XT": 2023, "RX 7600 XT": 2024,
  "RX 7600": 2023, "RX 6950 XT": 2022, "RX 6900 XT": 2020,
  "RX 6800 XT": 2020, "RX 6800": 2020, "RX 6750 XT": 2022,
  "RX 6700 XT": 2021, "RX 6700": 2022, "RX 6650 XT": 2022,
  "RX 6600 XT": 2021, "RX 6600": 2021, "RX 6500 XT": 2022,
  "RX 6400": 2022, "RX 5700 XT": 2019, "RX 5700": 2019, "RX 5600 XT": 2020,
  "RX 5500 XT": 2019, "ARC B580": 2024, "ARC B570": 2025,
  "ARC A770": 2022, "ARC A750": 2022, "ARC A580": 2023,
  "ARC A380": 2022, "ARC A310": 2022,
};
const gpuMonths: Record<string, number> = {
  "RTX 5090": 1, "RTX 5080": 1, "RTX 5070 TI": 2, "RTX 5070": 3,
  "RTX 5060 TI": 4, "RTX 5060": 5, "RTX 4090": 10, "RTX 4080 SUPER": 1,
  "RTX 4080": 11, "RTX 4070 TI SUPER": 1, "RTX 4070 TI": 1, "RTX 4070 SUPER": 1,
  "RTX 4070": 4, "RTX 4060 TI": 5, "RTX 4060": 6, "RTX 3090 TI": 3,
  "RTX 3090": 9, "RTX 3080 TI": 6, "RTX 3080": 9, "RTX 3070 TI": 6,
  "RTX 3070": 10, "RTX 3060 TI": 12, "RTX 3060": 2, "RTX 3050": 1,
  "RTX 2080 TI": 9, "RTX 2080 SUPER": 7, "RTX 2080": 9,
  "RTX 2070 SUPER": 7, "RTX 2070": 10, "RTX 2060 SUPER": 7, "RTX 2060": 1,
  "GTX 1660 SUPER": 10, "GTX 1660 TI": 2, "GTX 1660": 3,
  "GTX 1650 SUPER": 11, "GTX 1650": 4, "GTX 1630": 6, "RX 9070 XT": 3, "RX 9070": 3,
  "RX 9060 XT": 6, "RX 7900 XTX": 12, "RX 7900 XT": 12, "RX 7900 GRE": 7,
  "RX 7800 XT": 9, "RX 7700 XT": 9, "RX 7600 XT": 1, "RX 7600": 5,
  "RX 6950 XT": 5, "RX 6900 XT": 12, "RX 6800 XT": 11, "RX 6800": 11,
  "RX 6750 XT": 5, "RX 6700 XT": 3, "RX 6700": 6, "RX 6650 XT": 5,
  "RX 6600 XT": 8, "RX 6600": 10, "RX 6500 XT": 1,
  "RX 5700 XT": 7, "RX 5700": 7, "RX 5600 XT": 1, "RX 5500 XT": 12,
  "ARC B580": 12, "ARC B570": 1, "ARC A770": 10, "ARC A750": 10,
  "ARC A580": 10, "ARC A380": 6,
};
const chipsetYears: Record<string, number> = {
  A320: 2017, B350: 2017, X370: 2017, B450: 2018, X470: 2018,
  X570: 2019, B550: 2020, A520: 2020, B650: 2022, B650E: 2022,
  X670: 2022, X670E: 2022, A620: 2023, X870: 2024, X870E: 2024,
  B850: 2025, B840: 2025, Z690: 2021, B660: 2022, H610: 2022,
  H670: 2022, Z790: 2022, B760: 2023, H770: 2023,
};

type SeriesRule = { brand: RegExp; name: RegExp; year: number; memoryType?: Component["memoryType"] };
const storageRules: SeriesRule[] = [
  { brand: /^Samsung$/i, name: /\b970 EVO Plus\b/i, year: 2019 },
  { brand: /^Samsung$/i, name: /\b980 PRO\b/i, year: 2020 },
  { brand: /^Samsung$/i, name: /\b980\b(?!\s*PRO)/i, year: 2021 },
  { brand: /^Samsung$/i, name: /\b990 PRO\b/i, year: 2022 },
  { brand: /^Samsung$/i, name: /\b990 EVO(?: Plus)?\b/i, year: 2024 },
  { brand: /^Samsung$/i, name: /\b9100 PRO\b/i, year: 2025 },
  { brand: /^(?:Western Digital|WD_BLACK)$/i, name: /\bSN570\b/i, year: 2021 },
  { brand: /^(?:Western Digital|WD_BLACK)$/i, name: /\bSN580\b/i, year: 2023 },
  { brand: /^(?:Western Digital|WD_BLACK)$/i, name: /\bSN770\b/i, year: 2022 },
  { brand: /^(?:Western Digital|WD_BLACK)$/i, name: /\bSN850X\b/i, year: 2022 },
  { brand: /^(?:Western Digital|WD_BLACK)$/i, name: /\bSN850\b/i, year: 2020 },
  { brand: /^(?:Western Digital|WD_BLACK)$/i, name: /\bSN8100\b/i, year: 2025 },
  { brand: /^Crucial$/i, name: /\bP3(?: Plus)?\b/i, year: 2022 },
  { brand: /^Crucial$/i, name: /\bP5 Plus\b/i, year: 2021 },
  { brand: /^Crucial$/i, name: /\bT(?:500|700)\b/i, year: 2023 },
  { brand: /^Crucial$/i, name: /\b(?:T705|P310)\b/i, year: 2024 },
  { brand: /^Kingston$/i, name: /\bKC3000\b/i, year: 2021 },
  { brand: /^Kingston$/i, name: /\bFURY Renegade\b(?!\s*G5)/i, year: 2021 },
  { brand: /^Kingston$/i, name: /\bNV2\b/i, year: 2022 },
  { brand: /^Kingston$/i, name: /\bNV3\b/i, year: 2024 },
  { brand: /^Seagate$/i, name: /\bFireCuda 530\b(?!R)/i, year: 2021 },
  { brand: /^Seagate$/i, name: /\bFireCuda 540\b/i, year: 2023 },
  { brand: /^Corsair$/i, name: /\bMP600 PRO LPX\b/i, year: 2022 },
  { brand: /^Corsair$/i, name: /\bMP600 PRO XT\b/i, year: 2021 },
  { brand: /^Corsair$/i, name: /\bMP700\b(?!\s*(?:PRO|Elite))/i, year: 2023 },
  { brand: /^SK hynix$/i, name: /\bPlatinum P41\b/i, year: 2022 },
  { brand: /^Lexar$/i, name: /\bNM790\b/i, year: 2023 },
  { brand: /^Solidigm$/i, name: /\bP(?:41 Plus|44 Pro)\b/i, year: 2022 },
];
const ramRules: SeriesRule[] = [
  { brand: /^Corsair$/i, name: /\bDominator Titanium(?: RGB)?\b/i, year: 2023, memoryType: "DDR5" },
  { brand: /^Corsair$/i, name: /\bDominator Platinum RGB\b/i, year: 2019, memoryType: "DDR4" },
  { brand: /^Corsair$/i, name: /\bDominator Platinum RGB\b/i, year: 2021, memoryType: "DDR5" },
  { brand: /^Corsair$/i, name: /\bVengeance RGB Pro SL\b/i, year: 2021, memoryType: "DDR4" },
  { brand: /^Corsair$/i, name: /\bVengeance RGB Pro\b(?!\s*SL)/i, year: 2018, memoryType: "DDR4" },
  { brand: /^Corsair$/i, name: /\bVengeance RGB\b(?!\s*Pro)/i, year: 2017, memoryType: "DDR4" },
  { brand: /^Corsair$/i, name: /\bVengeance RGB\b/i, year: 2022, memoryType: "DDR5" },
  { brand: /^Corsair$/i, name: /\bVengeance LPX\b/i, year: 2014, memoryType: "DDR4" },
  { brand: /^Corsair$/i, name: /\bVengeance LED\b/i, year: 2016, memoryType: "DDR4" },
  { brand: /^Corsair$/i, name: /^Vengeance\s+\d/i, year: 2021, memoryType: "DDR5" },
  { brand: /^G\.Skill$/i, name: /\bTrident Z5 Royal Neo(?: RGB)?\b/i, year: 2024, memoryType: "DDR5" },
  { brand: /^G\.Skill$/i, name: /\bTrident Z5 Royal\b/i, year: 2024, memoryType: "DDR5" },
  { brand: /^G\.Skill$/i, name: /\bTrident Z5 Neo(?: RGB)?\b/i, year: 2022, memoryType: "DDR5" },
  { brand: /^G\.Skill$/i, name: /\bTrident Z5 RGB\b/i, year: 2021, memoryType: "DDR5" },
  { brand: /^G\.Skill$/i, name: /\bFlare X5\b/i, year: 2022, memoryType: "DDR5" },
  { brand: /^G\.Skill$/i, name: /\bRipjaws S5\b/i, year: 2021, memoryType: "DDR5" },
  { brand: /^G\.Skill$/i, name: /\bRipjaws V\b/i, year: 2015, memoryType: "DDR4" },
  { brand: /^G\.Skill$/i, name: /\bTrident Z Neo\b/i, year: 2019, memoryType: "DDR4" },
  { brand: /^G\.Skill$/i, name: /\bTrident Z Royal\b/i, year: 2018, memoryType: "DDR4" },
  { brand: /^G\.Skill$/i, name: /\bTrident Z RGB\b/i, year: 2017, memoryType: "DDR4" },
  { brand: /^Kingston$/i, name: /\bFURY Beast RGB\b/i, year: 2022, memoryType: "DDR5" },
  { brand: /^Kingston$/i, name: /\bFURY Beast\b(?!\s*RGB)/i, year: 2021 },
  { brand: /^Kingston$/i, name: /\bFURY Beast RGB\b/i, year: 2021, memoryType: "DDR4" },
  { brand: /^Kingston$/i, name: /\bFURY Renegade(?: RGB)?\b/i, year: 2021, memoryType: "DDR4" },
  { brand: /^Kingston$/i, name: /\bFURY Renegade(?: RGB)?\b/i, year: 2022, memoryType: "DDR5" },
  { brand: /^Crucial$/i, name: /\bPro Overclocking\b/i, year: 2024, memoryType: "DDR5" },
  { brand: /^Crucial$/i, name: /^Pro\b(?!\s*Overclocking)/i, year: 2023 },
  { brand: /^Crucial$/i, name: /\bBallistix MAX(?: RGB)?\b/i, year: 2020, memoryType: "DDR4" },
  { brand: /^Crucial$/i, name: /\bBallistix RGB\b/i, year: 2020, memoryType: "DDR4" },
  { brand: /^Patriot$/i, name: /\bViper Venom(?: RGB)?\b/i, year: 2022, memoryType: "DDR5" },
  { brand: /^Patriot$/i, name: /\bViper 4 Blackout\b/i, year: 2019, memoryType: "DDR4" },
  { brand: /^TeamGroup$/i, name: /\bT-Force Delta RGB\b/i, year: 2021, memoryType: "DDR5" },
  { brand: /^TeamGroup$/i, name: /\bT-Force Delta RGB\b/i, year: 2017, memoryType: "DDR4" },
  { brand: /^TeamGroup$/i, name: /\bT-Force Vulcan Z\b/i, year: 2019, memoryType: "DDR4" },
];
const coolerYears: Record<string, number> = {
  "cooler-ak620": 2021, "cooler-nhd15": 2019, "cooler-l9a": 2023,
  "cooler-darkrockpro5": 2023, "cooler-h100i240": 2023, "cooler-h150i360": 2023,
  "cooler-lfiii240": 2024, "cooler-lfiii280": 2024, "cooler-lfiii360": 2024,
  "cooler-lfiii420": 2024, "cooler-lfiii360-argb-white": 2024,
  "cooler-kraken240": 2023, "cooler-kraken360": 2023,
  "cooler-ls520240": 2022, "cooler-ls720360": 2022,
  "cooler-nhd15-g2": 2024, "cooler-nhd12l": 2022, "cooler-l9i-17xx": 2021,
  "cooler-ak620-digital": 2023, "cooler-ak620-zero-dark": 2022,
  "cooler-h170i-lcd-420": 2023, "cooler-silentloop2-360": 2021,
};
const caseYears: Record<string, number> = {
  "case-h6": 2023, "case-4000d": 2020, "case-4000d-white": 2020,
  "case-q300l": 2018, "case-terra": 2023, "case-5000d": 2021,
  "case-h7": 2022, "case-north": 2022, "case-north-white": 2022,
  "case-o11": 2021, "case-h9": 2023, "case-ap201": 2022,
  "case-meshify2": 2020, "case-pop-air-rgb": 2022, "case-lancool3": 2022,
  "case-3000d": 2023, "case-7000d": 2021, "case-xt-pro-ultra": 2024,
  "case-p400a-digital": 2019, "case-air903-base": 2023,
};
const psuRules: SeriesRule[] = [
  { brand: /^be quiet!$/i, name: /\bPure Power 12 M\b/i, year: 2023 },
  { brand: /^be quiet!$/i, name: /\b(?:Dark Power(?: Pro)? 13|Straight Power 12)\b/i, year: 2023 },
  { brand: /^be quiet!$/i, name: /\bPower Zone 2\b/i, year: 2025 },
  { brand: /^Corsair$/i, name: /\bAX1600i\b/i, year: 2018 },
  { brand: /^Corsair$/i, name: /^SF(?:850|1000)\b/i, year: 2024 },
  { brand: /^MSI$/i, name: /\bMAG A(?:650|750|850)GL\b/i, year: 2023 },
];

function series(component: Component, rules: readonly SeriesRule[]): ReleaseInfo | null {
  const rule = rules.find((entry) => entry.brand.test(component.brand) && entry.name.test(component.name)
    && (!entry.memoryType || component.memoryType === entry.memoryType));
  return rule ? historical(rule.year, "series", `${component.brand} ${component.name}`) : null;
}

function withMonth(info: ReleaseInfo, month?: number): ReleaseInfo {
  if (!month) return info;
  return { ...info, month };
}

/** Does not mutate catalogue records or infer dates from prices, performance,
 * memory speed, capacity, snapshot date, source index or product ID ordering. */
export function getReleaseInfo(component: Component): ReleaseInfo | null {
  if (component.category === "cpu") {
    const sku = component.name.toUpperCase().match(/\b(?:RYZEN [3579] |CORE I[3579]-)(\d{4,5}[A-Z0-9]*)\b/)?.[1];
    const year = sku ? cpuYears[sku] : undefined;
    return year ? withMonth(historical(year, "model", `${component.brand} ${component.name}`, "Mois de commercialisation du modèle ; aucun jour précis n’est affirmé."), cpuMonths[sku!]) : null;
  }
  if (component.category === "gpu") {
    const text = `${component.name} ${component.specs.join(" ")}`.toUpperCase().replace(/\s+/g, " ");
    const nvidia = text.match(/\b(RTX|GTX)\s*(\d{4})(?:\s*(TI))?(?:\s*(SUPER))?\b/);
    const amd = text.match(/\b(RX)\s*(\d{4})(?:\s*(XTX|XT|GRE))?\b/);
    const intel = text.match(/\b(ARC)\s*([AB]\d{3})\b/);
    const chip = (nvidia ?? amd ?? intel)?.slice(1).filter(Boolean).join(" ");
    let year = chip ? gpuYears[chip] : undefined;
    let month = chip ? gpuMonths[chip] : undefined;
    let subject = chip;
    if (/\bQUADRO RTX (?:4000|5000)\b/.test(text)) { year = 2018; month = undefined; subject = `Quadro ${chip}`; }
    if (/\bRTX 4000(?: SFF)? ADA\b/.test(text)) { year = 2023; month = undefined; subject = /\bSFF\b/.test(text) ? "RTX 4000 SFF Ada" : "RTX 4000 Ada"; }
    if (/\bRTX (?:4500|5000) ADA\b/.test(text)) { year = 2023; month = undefined; subject = `${chip} Ada`; }
    if (/\bRTX 2000 ADA\b/.test(text)) { year = 2024; month = 2; subject = "RTX 2000 Ada"; }
    const hasMemory = (gb: number) => component.capacityGB === gb || new RegExp(`\\b${gb}\\s*(?:GB|GO|G)\\b`).test(text);
    if (chip === "RTX 3050" && hasMemory(6)) { year = 2024; month = 2; subject = `${chip} 6 Go`; }
    if (chip === "RTX 3080" && hasMemory(12)) { year = 2022; month = 1; subject = `${chip} 12 Go`; }
    if (chip === "RTX 4060 TI" && hasMemory(16)) { year = 2023; month = 7; subject = `${chip} 16 Go`; }
    if (chip === "RTX 3060" && hasMemory(8)) { year = 2022; month = 10; subject = `${chip} 8 Go`; }
    if (chip === "RTX 2060" && hasMemory(12)) { year = 2021; month = 12; subject = `${chip} 12 Go`; }
    return year ? withMonth(historical(year, "generation", subject ?? "puce graphique", "Introduction commerciale de la puce GPU, éventuellement dans un premier marché régional. La carte du fabricant, sa mémoire, son refroidissement ou une révision LHR peuvent être sortis plus tard."), month) : null;
  }
  if (component.category === "motherboard") {
    const chipset = component.name.toUpperCase().match(/\b([AXBHZ]\d{3}E?)(?=[A-Z-]|\b)/)?.[1];
    const year = chipset ? chipsetYears[chipset] : undefined;
    return year ? historical(year, "generation", `chipset ${chipset}`, "Année d’introduction du chipset. Ce modèle de carte mère ou sa révision peut être plus récent ; le socket seul ne fournit aucune date.") : null;
  }
  if (component.category === "ram") return series(component, ramRules);
  if (component.category === "storage") return series(component, storageRules);
  if (component.category === "cooler") {
    const year = coolerYears[component.id];
    return year ? historical(year, "series", `${component.brand} ${component.name}`) : null;
  }
  if (component.category === "case") {
    const year = caseYears[component.id];
    return year ? historical(year, "series", `${component.brand} ${component.name}`) : null;
  }
  if (component.category === "psu") {
    // RMe, SF750, FOCUS GX and other names can identify several generations.
    // Only an explicit revision year is accepted from these ambiguous records.
    const revision = component.name.match(/\((20\d{2})\)/)?.[1];
    if (revision) return {
      year: Number(revision), basis: "model", label: "Révision nommée du modèle",
      sourceName: "Millésime explicitement indiqué dans la référence du catalogue",
      ...(component.source ? { sourceUrl: component.source.url } : {}),
      note: "Année de la révision nommée dans le catalogue ; jour et mois de commercialisation non renseignés.",
    };
    return series(component, psuRules);
  }
  return null;
}
