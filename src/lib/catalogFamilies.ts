import type { CategoryId, Component } from "../data/catalog.ts";

/** A navigation group, not a claim about release dates or compatibility. */
export interface CatalogFamily {
  id: string;
  label: string;
  known: boolean;
}

const normalized = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const slug = (value: string) => normalized(value).replace(/\+/g, " plus ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const family = (category: CategoryId, brand: string, series: string): CatalogFamily => ({
  id: `${category}-${slug(brand)}-${slug(series)}`,
  label: `${brand} ${series}`,
  known: true,
});
const other = (category: CategoryId): CatalogFamily => ({ id: `${category}-other`, label: "Autres modèles", known: false });
type Rule = readonly [RegExp, string];
type BrandRules = Readonly<Record<string, readonly Rule[]>>;

// These rules describe names already present in the catalogue. Capacity,
// colour, RGB, kit size and prices never create separate navigation families.
const ramRules: BrandRules = {
  corsair: [[/\bVengeance\b/i, "Vengeance"], [/\bDominator\b/i, "Dominator"]],
  "g.skill": [[/\bTrident Z5\b/i, "Trident Z5"], [/\bTrident Z\b/i, "Trident Z"], [/\bRipjaws\b/i, "Ripjaws"], [/\bFlare\b/i, "Flare"], [/\bAegis\b/i, "Aegis"]],
  kingston: [[/\bHyperX Fury\b/i, "HyperX Fury"], [/\bHyperX Predator\b/i, "HyperX Predator"], [/\bFURY Beast\b/i, "FURY Beast"], [/\bFURY Renegade\b/i, "FURY Renegade"]],
  crucial: [[/\bBallistix\b/i, "Ballistix"], [/^Pro\b/i, "Pro"]],
  teamgroup: [[/\bT[- ]Create\b/i, "T-Create"], [/\bT[- ]Force Delta\b/i, "T-Force Delta"], [/\bT[- ]Force Vulcan\b/i, "T-Force Vulcan"], [/\bT[- ]Force Xtreem\b/i, "T-Force Xtreem"], [/\bT[- ]Force Dark\b/i, "T-Force Dark"]],
  patriot: [[/\bViper Venom\b/i, "Viper Venom"], [/\bViper Elite\b/i, "Viper Elite"], [/\bViper Steel\b/i, "Viper Steel"], [/\bViper 4\b/i, "Viper 4"]],
  "silicon power": [[/\bXPOWER Zenith\b/i, "XPOWER Zenith"], [/\bXPOWER Pulse\b/i, "XPOWER Pulse"], [/\bXPOWER Turbine\b/i, "XPOWER Turbine"], [/\bXPOWER Storm\b/i, "XPOWER Storm"], [/\bXPOWER AirCool\b/i, "XPOWER AirCool"], [/^GAMING\b/i, "Gaming"]],
  adata: [[/\bXPG Lancer\b/i, "XPG Lancer"], [/\bXPG SPECTRIX\b/i, "XPG SPECTRIX"], [/\bXPG GAMMIX\b/i, "XPG GAMMIX"], [/\bXPG CASTER\b/i, "XPG CASTER"], [/\bXPG Z1\b/i, "XPG Z1"]],
};

const storageRules: BrandRules = {
  samsung: [[/^9100\b/i, "9100"], [/^990\b/i, "990"], [/^980\b/i, "980"], [/^970\b/i, "970"]],
  "western digital": [[/\bSN850X?\b/i, "WD_BLACK SN850"], [/\bSN8100\b/i, "WD_BLACK SN8100"], [/\bSN770\b/i, "WD_BLACK SN770"], [/\bSN7100\b/i, "WD_BLACK SN7100"], [/\bSN580\b/i, "WD Blue SN580"], [/\bSN570\b/i, "WD Blue SN570"], [/\bSN5000\b/i, "WD Blue SN5000"], [/\bSN740\b/i, "PC SN740"]],
  crucial: [[/\bP3(?:\s|$)/i, "P3"], [/\bP5(?:\s|$)/i, "P5"], [/\bP310\b/i, "P310"], [/\bP510\b/i, "P510"], [/\bT500\b/i, "T500"], [/\bT705\b/i, "T705"]],
  kingston: [[/\bKC3000\b/i, "KC3000"], [/\bNV2\b/i, "NV2"], [/\bNV3\b/i, "NV3"], [/\bFURY Renegade\b/i, "FURY Renegade"]],
  seagate: [[/\bFireCuda\b/i, "FireCuda"], [/\bBarraCuda\b/i, "BarraCuda"], [/\bGame Drive\b/i, "Game Drive"]],
  corsair: [[/\bMP600\b/i, "MP600"], [/\bMP700\b/i, "MP700"]],
  "silicon power": [[/\bUD90\b/i, "UD90"], [/\bUD85\b/i, "UD85"], [/\bUS75\b/i, "US75"]],
  klevv: [[/\bCRAS\b/i, "CRAS"]],
  teamgroup: [[/\bMP44L?\b/i, "MP44"], [/\bT[- ]FORCE G50\b/i, "T-Force G50"], [/\bCardea\b/i, "T-Force Cardea"], [/\bGE PRO\b/i, "T-Force GE PRO"], [/\bA440\b/i, "A440"]],
  "sk hynix": [[/\bPlatinum P41\b/i, "Platinum P41"], [/\bPlatinum P51\b/i, "Platinum P51"]],
  sabrent: [[/\bRocket\b/i, "Rocket"]],
  lexar: [[/\bNM790\b/i, "NM790"], [/\bNM710\b/i, "NM710"], [/\bNQ790\b/i, "NQ790"], [/\bNQ710\b/i, "NQ710"], [/\bNM1090\b/i, "Professional NM1090"], [/\bNM800(?:PRO)?\b/i, "Professional NM800"], [/\bPLAY\b/i, "PLAY"]],
  msi: [[/\bSPATIUM\b/i, "SPATIUM"]],
  acer: [[/\bPredator\b/i, "Predator"], [/\bFA200\b/i, "FA200"]],
  patriot: [[/\bViper VP4300\b/i, "Viper VP4300"], [/\bP400\b/i, "P400"]],
  kioxia: [[/\bEXCERIA\b/i, "EXCERIA"], [/\bBG5\b/i, "BG5"]],
  pny: [[/\bCS\d{4}\b/i, "CS"]],
  gigabyte: [[/\bAORUS\b/i, "AORUS"], [/\b4000E\b/i, "4000E"]],
  mushkin: [[/\bVortex\b/i, "Vortex"], [/\bGamma\b/i, "Gamma"], [/\bHelix\b/i, "Helix"]],
  adata: [[/\bLegend\b/i, "LEGEND"], [/\bXPG GAMMIX\b/i, "XPG GAMMIX"], [/\bMARS\b/i, "MARS"]],
  inland: [[/\bPerformance\b/i, "Performance"], [/\bTN450\b/i, "TN450"], [/\bQN450\b/i, "QN450"]],
  asus: [[/\bROG Strix SQ7\b/i, "ROG Strix SQ7"]],
  solidigm: [[/\bP44\b/i, "P44"], [/\bP41\b/i, "P41"]],
  netac: [[/\bNV7000(?:\b|-)/i, "NV7000"], [/\bNV5000(?:\b|-)/i, "NV5000"]],
  sandisk: [[/\bExtreme\b/i, "Extreme"]],
  goodram: [[/\bPX700\b/i, "PX700"], [/\bIRDM\b/i, "IRDM"]],
  nextorage: [[/\bNEM-PA[BC]?\b/i, "NEM-PA"], [/\bG-Series\b/i, "G-Series"]],
  micron: [[/^3400\b/i, "3400"], [/^7400\b/i, "7400"]],
  hp: [[/\bFX700\b/i, "FX700"], [/\bFX900\b/i, "FX900"]],
  apacer: [[/\bAS2280Q4U?\b/i, "AS2280Q4"]],
  transcend: [[/\b(?:MTE)?250[SH]\b/i, "250"], [/\bMTE245S\b/i, "MTE245S"], [/\bMTE240S\b/i, "MTE240S"]],
  addlink: [[/\bG55H?\b/i, "G55"], [/\bA93\b/i, "A93"], [/\bA95\b/i, "A95"], [/\bD60\b/i, "D60"], [/\bS90\b/i, "S90"], [/\bS95\b/i, "S95"]],
};

const coolerRules: BrandRules = {
  thermalright: [[/\bPhantom Spirit\b/i, "Phantom Spirit"], [/\bPeerless Assassin\b/i, "Peerless Assassin"]],
  deepcool: [[/\bAK\d{3}\b/i, "AK"], [/\bLS\d{3}\b/i, "LS"]],
  noctua: [[/\bNH-D\d/i, "NH-D"], [/\bNH-L\d/i, "NH-L"]],
  "be quiet!": [[/\bDark Rock\b/i, "Dark Rock"], [/\bSilent Loop\b/i, "Silent Loop"]],
  corsair: [[/\bELITE CAPELLIX\b/i, "iCUE ELITE CAPELLIX"], [/\bELITE LCD\b/i, "iCUE ELITE LCD"]],
  arctic: [[/\bLiquid Freezer\b/i, "Liquid Freezer"]],
  nzxt: [[/\bKraken\b/i, "Kraken"]],
  ek: [[/\bNucleus\b/i, "Nucleus"]],
};

const psuRules: BrandRules = {
  corsair: [[/^RM\d+[ex]?\b/i, "RM"], [/^SF\d+\b/i, "SF"], [/^HX\d+i?\b/i, "HX"], [/^AX\d+i?\b/i, "AX"], [/^CX(?:\d+|\s|$)/i, "CX"], [/^CV\d+\b/i, "CV"]],
  msi: [[/\bMAG\b/i, "MAG"], [/\bMPG\b/i, "MPG"], [/\bMEG\b/i, "MEG"], [/^A\d+G\b/i, "MPG"]],
  "be quiet!": [[/\bPure Power\b/i, "Pure Power"], [/\bStraight Power\b/i, "Straight Power"], [/\bDark Power\b/i, "Dark Power"], [/\bPower Zone\b/i, "Power Zone"], [/\bSFX Power\b/i, "SFX Power"]],
  seasonic: [[/\bFOCUS\b/i, "FOCUS"], [/\bPRIME\b/i, "PRIME"], [/\bCORE\b/i, "CORE"], [/\bVERTEX\b/i, "VERTEX"]],
  "cooler master": [[/\bMWE\b/i, "MWE"], [/^V(?:\d+|\s)/i, "V"]],
  thermaltake: [[/\bToughpower\b/i, "Toughpower"], [/\bSmart\b/i, "Smart"]],
  montech: [[/\bCENTURY\b/i, "CENTURY"], [/\bAPX\b/i, "APX"]],
  asus: [[/\bROG THOR\b/i, "ROG THOR"], [/\bROG STRIX\b/i, "ROG STRIX"], [/\bTUF Gaming\b/i, "TUF Gaming"]],
  gigabyte: [[/\bAORUS\b/i, "AORUS"], [/^UD\d+GM\b/i, "UD"], [/^P\d+[A-Z]+\b/i, "P"]],
  nzxt: [[/^C\d+\b/i, "C"]],
  evga: [[/\bSuperNOVA\b/i, "SuperNOVA"], [/\bN1\b/i, "N1"], [/\bW1\b/i, "W1"], [/\bBR\b/i, "BR"]],
  adata: [[/\bXPG Core Reactor\b/i, "XPG Core Reactor"], [/\bXPG CYBERCORE\b/i, "XPG CYBERCORE"], [/\bXPG PYLON\b/i, "XPG PYLON"]],
  silverstone: [[/^DA\d+R-GMA\b/i, "DA"]],
  fsp: [[/\bHydro\b/i, "Hydro"], [/\bVITA[- ]/i, "VITA"]],
  deepcool: [[/^PN\d+M\b/i, "PN"], [/^PL\d+D\b/i, "PL"]],
  "super flower": [[/\bLeadex\b/i, "LEADEX"]],
};

const caseRules: BrandRules = {
  nzxt: [[/^H\d+\b/i, "H"]],
  corsair: [[/^3000D\b/i, "3000D"], [/^4000D\b/i, "4000D"], [/^5000D\b/i, "5000D"], [/^7000D\b/i, "7000D"]],
  "cooler master": [[/\bMasterBox\b/i, "MasterBox"]],
  "fractal design": [[/\bTerra\b/i, "Terra"], [/\bNorth\b/i, "North"], [/\bMeshify\b/i, "Meshify"], [/\bPop\b/i, "Pop"]],
  "lian li": [[/\bO11\b/i, "O11"], [/\bLANCOOL\b/i, "LANCOOL"]],
  asus: [[/\bPrime AP201\b/i, "Prime AP201"]],
  phanteks: [[/\bXT\b/i, "XT"], [/\bEclipse\b/i, "Eclipse"]],
  montech: [[/\bAIR 903\b/i, "AIR 903"]],
};

function extendRules(base: BrandRules, additions: BrandRules): BrandRules {
  return Object.fromEntries([...new Set([...Object.keys(base), ...Object.keys(additions)])]
    .map(brand => [brand, [...(base[brand] ?? []), ...(additions[brand] ?? [])]]));
}

// Additional literal series found in the larger source snapshot. Unfamiliar
// OEM/retail codes intentionally stay unknown instead of guessing a brand line.
const allRamRules = extendRules(ramRules, {
  teamgroup: [[/\bT[- ]Force(?:\s*\/)?\s+Night Hawk\b/i, "T-Force Night Hawk"], [/\bT[- ]Force XCalibur\b/i, "T-Force XCalibur"], [/\bT[- ]Force T1\b/i, "T-Force T1"]],
  patriot: [[/\bViper LED\b/i, "Viper LED"]],
  "silicon power": [[/\bXPOWER Gaming\b/i, "XPOWER Gaming"]],
});

const allStorageRules = extendRules(storageRules, {
  teamgroup: [[/\bMP44Q\b/i, "MP44"], [/\bT[- ]FORCE G70\b/i, "T-Force G70"], [/\bT[- ]FORCE GA PRO\b/i, "T-Force GA PRO"], [/\bT[- ]FORCE GC PRO\b/i, "T-Force GC PRO"], [/\bZ44A[57]Q?\b/i, "T-Force Z44A"], [/\bZ440\b/i, "Z440"], [/\bT[- ]Create\b/i, "T-Create"]],
  lexar: [[/\bEQ790\b/i, "EQ790"], [/\bNQ780\b/i, "NQ780"], [/\bNQ700\b/i, "NQ700"], [/\bNM990\b/i, "NM990"], [/\bNM760\b/i, "NM760"]],
  addlink: [[/\bS93\b/i, "S93"], [/\bS92\b/i, "S92"], [/\bA92\b/i, "A92"], [/\bA90\b/i, "A90"]],
  "western digital": [[/\bSN3000\b/i, "WD Green SN3000"], [/\bSN750\b/i, "WD_BLACK SN750"], [/\bSN850P\b/i, "WD_BLACK SN850"]],
  crucial: [[/\bT700\b/i, "T700"], [/\bT710\b/i, "T710"]],
  "silicon power": [[/\bXS70\b/i, "XS70"], [/\bUS70\b/i, "US70"], [/\bXD85\b/i, "XD85"]],
  mushkin: [[/\bDelta\b/i, "Delta"]],
  patriot: [[/\bViper PV553\b/i, "Viper PV553"], [/\bViper Gaming VP4100\b/i, "Viper VP4100"]],
  adata: [[/\bATOM 50\b/i, "ATOM 50"]],
  inland: [[/\bTN470\b/i, "TN470"], [/\bTD510\b/i, "TD510"]],
  nextorage: [[/\bNN5PRO\b/i, "NN5PRO"], [/\bNE5N\b/i, "NE5N"]],
  gigabyte: [[/\bAI TOP\b/i, "AI TOP"]],
  seagate: [[/\bIronWolf\b/i, "IronWolf"]],
  transcend: [[/\bMTE255S\b/i, "MTE255S"]],
});

const allPsuRules = extendRules(psuRules, {
  "cooler master": [[/\bElite\b/i, "Elite"], [/\bMasterWatt\b/i, "MasterWatt"], [/\bGX(?:\b|II)/i, "GX"], [/\bXG\d+\b/i, "XG"], [/\bSilent Pro\b/i, "Silent Pro"], [/\bX Silent\b/i, "X Silent"], [/^G(?:\d+M?\b| Gold\b)/i, "G"], [/\bThunder\b/i, "Thunder"], [/\beXtreme\b/i, "eXtreme"]],
  antec: [[/\bGSK\b/i, "GSK"], [/\bCSK\b/i, "CSK"], [/^VP(?:\b|\d)/i, "VP"], [/\bHigh Current Gamer\b|\bHCG[- ]/i, "High Current Gamer"], [/\bHigh Current Pro\b/i, "High Current Pro"], [/\bNeoECO\b/i, "NeoECO"], [/^NE\d+G?\b/i, "NE"], [/\bEarthwatts\b/i, "Earthwatts"], [/\bSignature\b/i, "Signature"], [/\bTrue Power\b/i, "True Power"], [/\bBasiq\b/i, "Basiq"], [/\bEDGE\b/i, "EDGE"]],
  silverstone: [[/\bHELA\b/i, "HELA"], [/\bATTIS\b/i, "ATTIS"], [/\bStrider\b/i, "Strider"], [/\bEssential\b/i, "Essential"], [/^DA\d+[A-Z]?\b/i, "DA"]],
  enermax: [[/\bREVOLUTION(?:\b|\d)/i, "REVOLUTION"], [/\bPlatiGemini\b/i, "PlatiGemini"], [/\bPlatimax\b/i, "Platimax"], [/\bMAXREVO\b/i, "MAXREVO"], [/\bMAXPRO\b/i, "MAXPRO"], [/\bMaxTytan\b/i, "MaxTytan"], [/\bRevoBron\b/i, "RevoBron"], [/\bTRIATHLOR\b/i, "TRIATHLOR"], [/\bCYBERBRON\b/i, "CYBERBRON"], [/\bMarbleBron\b/i, "MarbleBron"], [/\bNAXN\b/i, "NAXN"], [/\bDIGIFANLESS\b/i, "DIGIFANLESS"]],
  seasonic: [[/\bS12(?:II|III|G)?\b/i, "S12"], [/\bM12II\b/i, "M12"], [/\bG12\b/i, "G12"], [/\bB12\b/i, "B12"], [/^Platinum\b/i, "Platinum"], [/\bSnow Silent\b/i, "Snow Silent"], [/^X\b/i, "X"], [/^G\b/i, "G"], [/^ECO\b/i, "ECO"]],
  deepcool: [[/^PF\d+\b/i, "PF"], [/^PK\d+D\b/i, "PK"], [/^PX\d+G\b/i, "PX"], [/^PM\d+D\b/i, "PM"], [/^PQ\d+M\b/i, "PQ"], [/^PN\d+D\b/i, "PN"], [/^DQ\d+[-A-Z]/i, "DQ"]],
  corsair: [[/^TX\d+M?\b/i, "TX"], [/^VS\d+\b/i, "VS"], [/^CS\d+M?\b/i, "CS"], [/^GS\d+\b/i, "GS"], [/^CXM\b/i, "CX"], [/^RM\d+i\b/i, "RM"], [/^Vengeance\b/i, "Vengeance"]],
  fsp: [[/\bHEXA(?:\b|\+)/i, "HEXA"], [/\bHV PRO\b/i, "HV PRO"], [/\bHYPER\b/i, "HYPER"], [/\bRaider\b/i, "Raider"], [/\bAURUM\b/i, "AURUM"]],
  evga: [[/\bGQ\b/i, "GQ"], [/\bBQ\b/i, "BQ"], [/\bGD\b/i, "GD"], [/\bB5\b/i, "B5"], [/\bB1\b/i, "B1"], [/\bW3\b/i, "W3"], [/\b\d+\s?BP\b/i, "BP"]],
  thermaltake: [[/\bTR2\b/i, "TR2"], [/\bLitepower\b/i, "Litepower"], [/\bGerman\b/i, "German"]],
  "be quiet!": [[/\bSystem Power\b/i, "System Power"]],
  nzxt: [[/^C\s*\(/i, "C"], [/^E\d+\b/i, "E"], [/\bHALE\s?82N?\b/i, "HALE82"], [/\bHALE\s?90\b/i, "HALE90"]],
  phanteks: [[/\bAMP\b/i, "AMP"], [/\bRevolt\b/i, "Revolt"]],
  "super flower": [[/\bZillion\b/i, "Zillion"], [/\bLegion\b/i, "Legion"], [/\bGolden Green\b/i, "Golden Green"], [/\bGolden Silent\b/i, "Golden Silent"], [/\bAmazon\b/i, "Amazon"]],
  gigabyte: [[/^UD[-\d]/i, "UD"], [/^P-B\b/i, "P"], [/\bGreenMax\b/i, "GreenMax"], [/\bOdin\b/i, "Odin"]],
});

function commercialFamily(component: Component, rules: BrandRules): CatalogFamily {
  // WD_BLACK and Western Digital are the same manufacturer in the two sources.
  const brand = normalized(component.brand) === "wd_black" ? "Western Digital" : component.brand;
  const brandKey = normalized(brand);
  const name = component.name.replace(new RegExp(`^${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`, "i"), "");
  const match = rules[brandKey]?.find(([pattern]) => pattern.test(name));
  return match ? family(component.category, brand, match[1]) : other(component.category);
}

export function getCatalogFamily(component: Component): CatalogFamily {
  const name = `${component.name} ${component.specs.join(" ")}`;
  switch (component.category) {
    case "cpu": {
      const ryzen = component.name.match(/\bRyzen\s+[3579]\s+(\d)\d{3}/i);
      if (normalized(component.brand) === "amd" && ryzen) return family("cpu", "AMD", `Ryzen ${ryzen[1]}000`);
      const core = component.name.match(/\bCore\s+i[3579][- ]+(1[0-9])\d{3}/i);
      if (normalized(component.brand) === "intel" && core) return family("cpu", "Intel", `Core ${core[1]}e génération`);
      const ultra = component.name.match(/\bCore\s+Ultra\s+[579]\s+(\d)\d{2}/i);
      if (normalized(component.brand) === "intel" && ultra) return family("cpu", "Intel", `Core Ultra ${ultra[1]}00`);
      return other(component.category);
    }
    case "gpu": {
      const rtx = name.match(/\b(?:GeForce\s+)?RTX\s*(20|30|40|50)[5-9]0(?=\b|Ti|SUPER)/i);
      if (rtx) return family("gpu", "NVIDIA", `GeForce RTX ${rtx[1]}`);
      const gtx = name.match(/\b(?:GeForce\s+)?GTX\s*(10|16)\d{2}\b/i);
      if (gtx) return family("gpu", "NVIDIA", `GeForce GTX ${gtx[1]}`);
      const rx = name.match(/\b(?:Radeon\s+)?RX\s*(5|6|7|9)\d{3}(?=\b|XT)/i);
      if (rx) return family("gpu", "AMD", `Radeon RX ${rx[1]}000`);
      const arc = name.match(/\bArc\s+([AB])\d{3}\b/i);
      if (arc) return family("gpu", "Intel", `Arc ${arc[1].toUpperCase()}`);
      if (/\bQuadro\s+RTX\b/i.test(name)) return family("gpu", "NVIDIA", "Quadro RTX");
      if (/\bRTX\s*\d{4}E?(?:\s+SFF)?\s+Ada\b/i.test(name)) return family("gpu", "NVIDIA", "RTX Ada professionnelle");
      return other(component.category);
    }
    case "motherboard": {
      // Socket is decisive: a short B/H/A code alone is not a vendor identity.
      if (component.socket === "AM4" || component.socket === "AM5") {
        const chipset = component.name.match(/\b(X870E|X870|X670E|X670|X570|X470|X370|B850|B840|B650E|B650|B550|B450|B350|A620|A520|A320)(?!\d)/i)?.[1]
          ?? component.name.match(/\bA(X370|B350)(?!\d)/i)?.[1];
        if (chipset) return family("motherboard", "AMD", chipset.toUpperCase());
      }
      if (component.socket === "LGA1700") {
        const chipset = component.name.match(/\b(Z790|Z690|B760|B660|H770|H670|H610|Q670)(?!\d)/i)?.[1];
        if (chipset) return family("motherboard", "Intel", chipset.toUpperCase());
      }
      return other(component.category);
    }
    case "ram": {
      const kind = component.memoryModuleKind;
      const samsungOem = normalized(component.brand) === "samsung"
        && component.memoryModuleFormat !== "SO-DIMM" && component.memoryRegistered !== true
        && (kind === "UDIMM" || (kind === undefined && /^M(?:378|323)[A-Z0-9-]+$/i.test(component.manufacturerPartNumber ?? "")));
      if (samsungOem) return family("ram", "Samsung", "UDIMM OEM");
      return commercialFamily(component, allRamRules);
    }
    case "storage": return commercialFamily(component, allStorageRules);
    case "cooler": return commercialFamily(component, coolerRules);
    case "psu": return commercialFamily(component, allPsuRules);
    case "case": return commercialFamily(component, caseRules);
  }
}
