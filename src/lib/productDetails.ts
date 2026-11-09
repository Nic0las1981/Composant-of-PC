import { categories, type Component } from "../data/catalog.ts";
import { getVisualProfile } from "../data/visualProfiles.ts";
import { getCatalogFamily } from "./catalogFamilies.ts";
import { getReleaseInfo } from "../data/releaseTimeline.ts";
import { releaseDateLabel } from "./catalogOrdering.ts";
import { getMemoryDetails } from "./memoryDetails.ts";

export interface ProductDetailRow {
  label: string;
  value: string;
}

export interface ProductDetails {
  categoryLabel: string;
  groups: Array<{ title: string; rows: ProductDetailRow[] }>;
  highlights: string[];
  advice: string[];
}

const number = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
const known = (value: number | undefined): value is number =>
  value !== undefined && Number.isFinite(value) && value >= 0;
const amount = (value: number | undefined, unit: string) =>
  known(value) ? `${number.format(value)} ${unit}` : undefined;
const dimensions = (...values: Array<number | undefined>) =>
  values.every((value) => known(value) && value > 0)
    ? `${values.map((value) => number.format(value!)).join(" × ")} mm`
    : undefined;
const list = (values?: readonly string[]) => values?.length ? values.join(" · ") : undefined;
const fans = (count?: number, size?: number) => {
  if (!known(count)) return undefined;
  if (count === 0) return "Aucun";
  return known(size) ? `${count} × ${number.format(size)} mm` : `${count} ventilateur${count > 1 ? "s" : ""}`;
};

/** Only explicit catalogue data and documented product profiles are used.
 * Schematic render dimensions never become product specifications.
 * Missing details stay absent; the comparison helper supplies the empty-state text.
 * Prices are deliberately left to the product header, where their indicative nature is shown.
 */
export function getProductDetails(component: Component): ProductDetails {
  const rawProfile = getVisualProfile(component);
  const profile = rawProfile?.category === component.category && rawProfile.fidelity !== "schematic" ? rawProfile : undefined;
  const groups: ProductDetails["groups"] = [];
  const highlights: string[] = [];
  const advice: string[] = [];
  const spec = (pattern: RegExp) => component.specs.find((value) => pattern.test(value));
  const fragments = component.specs.flatMap((value) => value.split("·").map((part) => part.trim()));
  const part = (pattern: RegExp) => fragments.find((value) => pattern.test(value));
  const match = (pattern: RegExp) => component.specs.map((value) => value.match(pattern)).find(Boolean);
  const add = (title: string, label: string, value: string | undefined) => {
    if (!value) return;
    let group = groups.find((entry) => entry.title === title);
    if (!group) { group = { title, rows: [] }; groups.push(group); }
    group.rows.push({ label, value });
  };
  const highlight = (...values: Array<string | undefined>) => {
    highlights.push(...values.filter((value): value is string => Boolean(value)));
  };

  const family = getCatalogFamily(component);
  if (family.known) add("Famille et chronologie", "Famille", family.label);
  const release = getReleaseInfo(component);
  if (release) {
    add("Famille et chronologie", "Repère chronologique", releaseDateLabel(release));
    add("Famille et chronologie", "Base du classement", `${release.basis === "model" ? "Modèle" : release.basis === "generation" ? "Génération" : "Gamme"} : ${release.label}`);
  }

  switch (component.category) {
    case "cpu": {
      const cpu = profile?.category === "cpu" ? profile : undefined;
      const socket = component.socket ?? cpu?.socket;
      const cores = spec(/cœurs|coeurs|cores|threads/i);
      const clock = spec(/GHz/i);
      const thermal = part(/\bTDP\b|turbo max|\bW de base/i);
      const graphics = part(/circuit graphique|Radeon intégré|UHD|Iris|graphique intégré/i);
      add("Plateforme", "Socket", socket);
      add("Plateforme", "Mémoire prise en charge", list(component.supportedMemory));
      add("Processeur", "Cœurs et threads", cores);
      add("Processeur", "Fréquence annoncée", clock);
      add("Processeur", "Puissance annoncée", thermal);
      add("Processeur", "Puissance retenue pour l’estimation", amount(component.powerW, "W"));
      add("Processeur", "Cache", part(/cache/i));
      add("Processeur", "Architecture et extensions", part(/PCIe|Zen\s|P-cores|E-cores/i));
      add("Processeur", "Circuit graphique", graphics);
      // The visual CPU lies on the motherboard: heightMm is its package length,
      // while depthMm represents the thickness above the socket.
      add("Processeur", "Dimensions (l × L × ép.)", dimensions(cpu?.widthMm, cpu?.heightMm, cpu?.depthMm));
      highlight(socket, cores, clock);
      if (socket) advice.push(`Choisissez une carte mère ${socket} et vérifiez sa liste de processeurs pris en charge ainsi que la version du BIOS.`);
      if (component.supportedMemory?.length && component.supportedMemory.length > 1)
        advice.push("Le type de mémoire est fixé par la carte mère : DDR4 et DDR5 utilisent des emplacements différents.");
      if (known(component.powerW)) advice.push("La puissance retenue sert à estimer les besoins du PC. Elle ne représente pas une consommation constante ni nécessairement le TDP annoncé.");
      if (graphics && /sans circuit graphique/i.test(graphics)) advice.push("Ce processeur ne possède pas de circuit graphique intégré : prévoyez une carte graphique dédiée pour brancher votre écran.");
      break;
    }
    case "motherboard": {
      const board = profile?.category === "motherboard" ? profile : undefined;
      const format = component.formFactor ?? board?.formFactor;
      add("Plateforme", "Socket", component.socket);
      add("Plateforme", "Format", format);
      add("Plateforme", "Dimensions (H × l)", dimensions(component.heightMm ?? board?.heightMm, component.widthMm ?? board?.widthMm));
      add("Mémoire et stockage", "Type de mémoire", component.memoryType);
      add("Mémoire et stockage", "Emplacements mémoire", amount(component.memorySlots ?? board?.slots, "DIMM"));
      add("Mémoire et stockage", "Mémoire maximale", amount(component.maxMemoryGB, "Go"));
      add("Mémoire et stockage", "Maximum par emplacement", amount(component.maxMemoryPerSlotGB, "Go"));
      add("Mémoire et stockage", "Canaux mémoire", known(component.memoryChannels) ? String(component.memoryChannels) : undefined);
      add("Mémoire et stockage", "Emplacements M.2", known(component.m2Slots) ? String(component.m2Slots) : undefined);
      add("Connectivité", "Réseau annoncé", list(fragments.filter((value) => /Wi-?Fi|Ethernet|Bluetooth|\bLAN\b/i.test(value))));
      add("Connectivité", "Autres équipements", list(fragments.filter((value) => /PCIe|SupremeFX|HDMI|DisplayPort|Q-Flash|USB/i.test(value))));
      highlight(component.socket, format, component.memoryType, known(component.memorySlots) ? `${component.memorySlots} emplacements RAM` : undefined);
      advice.push("Vérifiez la version du BIOS et la liste de processeurs pris en charge avant de monter le processeur.");
      if (known(component.memorySlots)) advice.push("Le nombre d’emplacements ne correspond pas au nombre de canaux mémoire. Consultez le manuel pour répartir vos barrettes et la liste QVL pour les kits testés.");
      if (known(component.m2Slots)) advice.push("Consultez le manuel pour la génération PCIe de chaque port M.2 et les éventuels partages de lignes avec d’autres connecteurs.");
      break;
    }
    case "gpu": {
      const gpu = profile?.category === "gpu" ? profile : undefined;
      const memory = spec(/\d+\s*Go.*GDDR/i) ?? amount(component.capacityGB, "Go");
      const length = component.lengthMm ?? gpu?.lengthMm;
      const count = component.fanCount ?? gpu?.fanCount;
      add("Carte graphique", "Mémoire vidéo", memory);
      add("Carte graphique", "Puissance retenue pour l’estimation", amount(component.powerW, "W"));
      add("Carte graphique", "Alimentation recommandée", amount(component.recommendedPsuW, "W"));
      add("Encombrement et ventilation", "Longueur", amount(length, "mm"));
      add("Encombrement et ventilation", "Hauteur", amount(component.heightMm ?? gpu?.heightMm, "mm"));
      add("Encombrement et ventilation", "Épaisseur", amount(component.thicknessMm ?? gpu?.thicknessMm, "mm"));
      add("Encombrement et ventilation", "Ventilateurs", fans(count, component.fanSizeMm ?? gpu?.fanSizeMm));
      add("Encombrement et ventilation", "Éclairage", (component.rgb ?? gpu?.rgb) === undefined ? undefined : (component.rgb ?? gpu?.rgb) ? "RGB" : "Sans RGB");
      highlight(memory, amount(length, "mm de long"), known(count) ? `${count} ventilateurs` : undefined);
      if (known(length)) advice.push(`Réservez au moins ${number.format(length)} mm pour la carte, en tenant compte d’un éventuel radiateur en façade et du passage des câbles.`);
      advice.push("Vérifiez aussi l’épaisseur disponible, l’espace devant le connecteur d’alimentation et les câbles requis par cette version de la carte.");
      break;
    }
    case "ram": {
      const ram = profile?.category === "ram" ? profile : undefined;
      const memoryDetails = getMemoryDetails(component);
      const sticks = component.memorySticks ?? ram?.sticks;
      const parsedSpeed = match(/DDR[45][\s-]+([\d ]{4,})/i)?.[1]?.replace(/\s/g, "");
      const speed = component.memorySpeedMTs ?? (parsedSpeed ? Number(parsedSpeed) : undefined);
      const latency = component.casLatency ?? match(/\bCL\s*(\d+(?:[.,]\d+)?)/i)?.[1];
      const moduleCapacity = known(component.capacityGB) && known(sticks) && sticks > 0 ? component.capacityGB / sticks : undefined;
      const kit = part(/\d+\s*[×x]\s*\d+\s*Go/i);
      add("Kit mémoire", "Capacité totale", amount(component.capacityGB, "Go"));
      add("Kit mémoire", "Type de mémoire", component.memoryType);
      add("Kit mémoire", "Composition du kit", kit ?? (known(sticks) ? known(moduleCapacity) ? `${sticks} × ${number.format(moduleCapacity)} Go` : `${sticks} barrette${sticks > 1 ? "s" : ""}` : undefined));
      add("Kit mémoire", "Capacité par barrette", amount(moduleCapacity, "Go"));
      add("Kit mémoire", "Format des barrettes", component.memoryModuleFormat);
      add("Kit mémoire", "Type de module", memoryDetails.moduleKind ?? undefined);
      add("Kit mémoire", "Référence fabricant", memoryDetails.partNumber ?? undefined);
      add("Organisation mémoire", "Organisation des puces", memoryDetails.organization ?? undefined);
      add("Organisation mémoire", "Rangs par barrette", memoryDetails.rankCount ? String(memoryDetails.rankCount) : undefined);
      add("Organisation mémoire", "Largeur des puces", memoryDetails.deviceWidthBits ? `x${memoryDetails.deviceWidthBits}` : undefined);
      add("Kit mémoire", "Mémoire enregistrée", component.memoryRegistered === undefined ? undefined : component.memoryRegistered ? "Registered / RDIMM" : "Non enregistrée / unbuffered");
      add("Kit mémoire", "Correction ECC du module", component.memoryEcc === undefined ? undefined : component.memoryEcc ? "ECC" : "Non-ECC");
      add("Réglages et dimensions", "Débit mémoire annoncé", amount(speed, "MT/s"));
      add("Réglages et dimensions", "Horloge DDR théorique correspondante", amount(memoryDetails.clockMHz ?? undefined, "MHz"));
      add("Réglages et dimensions", "Tension renseignée", amount(memoryDetails.voltageV ?? undefined, "V"));
      add("Réglages et dimensions", "Dissipateur mémoire", memoryDetails.heatspreader === null ? undefined : memoryDetails.heatspreader ? "Présent" : "Sans dissipateur");
      add("Réglages et dimensions", "Latence CAS", latency ? `CL${latency}` : undefined);
      add("Réglages et dimensions", "Profil mémoire", spec(/EXPO|XMP/i) ?? component.memoryProfile);
      add("Réglages et dimensions", "Hauteur des barrettes", amount(component.heightMm ?? ram?.heightMm, "mm"));
      add("Réglages et dimensions", "Éclairage", (component.rgb ?? ram?.rgb) === undefined ? undefined : (component.rgb ?? ram?.rgb) ? "RGB" : "Sans RGB");
      highlight(amount(component.capacityGB, "Go"), component.memoryType, known(sticks) ? known(moduleCapacity) ? `${sticks} × ${number.format(moduleCapacity)} Go` : `${sticks} barrette${sticks > 1 ? "s" : ""}` : undefined, amount(speed, "MT/s"));
      if (speed) advice.push(component.memoryProfile === "JEDEC"
        ? "Le débit JEDEC renseigné ne nécessite pas de profil XMP ou EXPO. Le débit utilisé dépend des limites du processeur, de la carte mère, du BIOS et du nombre de barrettes."
        : "Le débit annoncé peut nécessiter l’activation d’EXPO ou XMP dans le BIOS. La fréquence stable dépend du processeur, de la carte mère et du nombre de barrettes.");
      if (memoryDetails.organization) advice.push(`${memoryDetails.organization} décrit les rangs et la largeur des puces d’une barrette. Ce n’est ni le nombre de barrettes, ni le nombre de canaux, ni une garantie du nombre de faces peuplées.`);
      if (memoryDetails.clockMHz) advice.push(`La DDR transfère deux fois par cycle : ${number.format(memoryDetails.transferRateMTs!)} MT/s correspond théoriquement à une horloge de ${number.format(memoryDetails.clockMHz)} MHz. Le débit réellement utilisé dépend du BIOS et du contrôleur mémoire.`);
      if (known(sticks)) {
        advice.push("La capacité indiquée est celle du kit complet. Le configurateur calcule séparément les barrettes installées, les kits à acheter et les éventuelles barrettes restantes.");
        advice.push("Installez les barrettes dans les emplacements recommandés par le manuel de la carte mère et vérifiez leur dégagement sous le ventirad. Un mélange de kits, même de même référence, ne garantit pas le débit annoncé.");
      }
      if (component.memoryType === "DDR5" && component.memoryEcc === false) advice.push("L’ECC interne aux puces DDR5 (on-die ECC) ne transforme pas une barrette non-ECC en mémoire ECC système.");
      break;
    }
    case "storage": {
      const storage = profile?.category === "storage" ? profile : undefined;
      const capacity = known(component.capacityGB) ? component.capacityGB >= 1000 ? amount(component.capacityGB / 1000, "To") : amount(component.capacityGB, "Go") : undefined;
      add("Stockage", "Capacité", capacity);
      add("Stockage", "Interface", component.storageInterface);
      add("Stockage", "Format", match(/M\.2\s+(\d{4})/i)?.[0]);
      add("Stockage", "Liaison PCIe", spec(/PCIe/i));
      const readSpeed = part(/lecture.*(?:Mo|Go|MB)\/s/i);
      const writeSpeed = part(/écriture.*(?:Mo|Go|MB)\/s/i);
      add("Installation", "Lecture annoncée", readSpeed);
      add("Installation", "Écriture annoncée", writeSpeed);
      if (!readSpeed && !writeSpeed) add("Installation", "Débit annoncé", spec(/Mo\/s|Go\/s|MB\/s/i));
      add("Installation", "Dimensions (L × l × H)", dimensions(component.lengthMm ?? storage?.lengthMm, component.widthMm ?? storage?.widthMm, component.heightMm ?? storage?.heightMm));
      add("Installation", "Dissipateur sur le modèle", storage ? storage.hasHeatsink ? "Présent" : "Sans dissipateur" : undefined);
      highlight(capacity, component.storageInterface, spec(/PCIe/i));
      advice.push("Vérifiez le format et la génération PCIe acceptés par le port M.2 choisi. Un port plus lent peut limiter le débit maximal annoncé.");
      if (storage) advice.push("Vérifiez le dégagement du dissipateur et retirez le film de protection des pads thermiques avant le montage.");
      break;
    }
    case "cooler": {
      const cooler = profile?.category === "cooler" ? profile : undefined;
      const kind = component.coolingType ?? (cooler ? cooler.kind === "aio" ? "aio" : "air" : undefined);
      const type = kind === "aio" ? "Watercooling AIO" : kind === "air" ? cooler?.kind === "low-profile" ? "Ventirad compact" : cooler?.kind === "dual-tower" ? "Ventirad double tour" : "Ventirad" : undefined;
      const radiatorSize = component.radiatorSizeMm ?? cooler?.radiatorSizeMm;
      const fanDescription = fans(component.fanCount ?? cooler?.fanCount, component.fanSizeMm ?? cooler?.fanSizeMm) ?? spec(/\d+\s*[×x]\s*\d+\s*mm/i);
      add("Refroidissement", "Type", type);
      add("Refroidissement", "Sockets pris en charge", list(component.supportedSockets));
      add("Refroidissement", "Ventilateurs", fanDescription);
      add("Refroidissement", "Éclairage des ventilateurs", cooler?.fanRgb === undefined ? undefined : cooler.fanRgb ? part(/ARGB/i) ? "ARGB" : "RGB" : "Sans RGB");
      if (kind === "aio") {
        add("Radiateur et pompe", "Radiateur : format nominal", amount(radiatorSize, "mm"));
        add("Radiateur et pompe", "Radiateur : dimensions (L × l)", dimensions(cooler?.radiatorLengthMm, cooler?.radiatorWidthMm));
        const thickness = amount(component.radiatorThicknessMm ?? cooler?.radiatorThicknessMm, "mm");
        add("Radiateur et pompe", "Radiateur : épaisseur", thickness ? `${thickness} hors ventilateurs` : undefined);
        add("Radiateur et pompe", "Hauteur du bloc pompe", amount(component.heightMm ?? cooler?.heightMm, "mm"));
        add("Radiateur et pompe", "Bloc pompe (l × P)", dimensions(component.widthMm ?? cooler?.widthMm, component.depthMm ?? cooler?.depthMm));
        const display = cooler?.pumpDisplay;
        add("Radiateur et pompe", "Habillage de la pompe", display === "lcd" ? "Écran LCD" : display === "rgb-ring" ? "Anneau RGB" : display === "logo" ? "Logo" : spec(/LCD/i));
        advice.push("Le format nominal du radiateur correspond à ses fixations : son encombrement réel est plus grand. Vérifiez la position autorisée dans le boîtier et l’espace pour le radiateur avec ses ventilateurs.");
        advice.push("Prévoyez le passage des tuyaux sans coude serré et vérifiez le dégagement autour de la RAM, des dissipateurs de la carte mère et de la carte graphique.");
      } else if (kind === "air") {
        add("Refroidissement", "Affichage", part(/écran de température/i));
        add("Refroidissement", "Habillage", part(/éclairage.*capot|Finition/i));
        add("Encombrement", "Hauteur du ventirad", amount(component.heightMm ?? cooler?.heightMm, "mm"));
        add("Encombrement", "Empreinte (l × P)", dimensions(component.widthMm ?? cooler?.widthMm, component.depthMm ?? cooler?.depthMm));
        add("Encombrement", "Caloducs", cooler && known(cooler.heatpipes) ? String(cooler.heatpipes) : match(/(\d+)\s*caloducs/i)?.[1]);
        add("Encombrement", "Puissance CPU conseillée (estimation)", amount(component.recommendedCpuPowerW, "W"));
        advice.push("Vérifiez la hauteur acceptée par le boîtier et le passage des barrettes sous le ventilateur. Relever ce ventilateur peut augmenter la hauteur totale.");
        if (known(component.recommendedCpuPowerW)) advice.push("La puissance CPU conseillée est une estimation du configurateur, pas une capacité thermique garantie : le résultat dépend du processeur et de la ventilation du boîtier.");
      }
      if (component.supportedSockets?.length) advice.push("Vérifiez que le kit de fixation correspondant à votre socket est inclus avec la révision achetée.");
      highlight(type, kind === "aio" ? amount(radiatorSize, "mm") : amount(component.heightMm ?? cooler?.heightMm, "mm de haut"), fanDescription);
      break;
    }
    case "psu": {
      const psu = profile?.category === "psu" ? profile : undefined;
      const format = component.psuFormat ?? psu?.format;
      const efficiency = part(/80\s*PLUS|Cybenetics/i);
      add("Alimentation", "Puissance nominale", amount(component.wattage, "W"));
      add("Alimentation", "Format", format);
      add("Alimentation", "Certification annoncée", efficiency);
      add("Alimentation", "Norme électrique annoncée", part(/ATX\s*\d/i));
      add("Installation", "Câblage", spec(/modulaire/i));
      add("Installation", "Connecteur graphique annoncé", part(/12VHPWR|12V-2x6/i));
      add("Installation", "Dimensions (l × H × P)", dimensions(component.widthMm ?? psu?.widthMm, component.heightMm ?? psu?.heightMm, component.depthMm ?? psu?.depthMm));
      add("Installation", "Diamètre du ventilateur", amount(component.fanSizeMm ?? psu?.fanSizeMm, "mm"));
      highlight(amount(component.wattage, "W"), format, efficiency);
      advice.push("Vérifiez le format accepté par le boîtier, la place pour les câbles et les connecteurs requis par la carte graphique et la carte mère.");
      if (efficiency) advice.push("La certification de rendement ne remplace pas le calcul de puissance nécessaire à l’ensemble du PC.");
      advice.push("Utilisez les câbles modulaires fournis ou explicitement compatibles avec cette alimentation.");
      break;
    }
    case "case": {
      const chassis = profile?.category === "case" ? profile : undefined;
      add("Châssis", "Dimensions (l × H × P)", dimensions(component.widthMm ?? chassis?.widthMm, component.heightMm ?? chassis?.heightMm, component.depthMm ?? chassis?.depthMm));
      add("Châssis", "Formats de carte mère", list(component.supportedFormFactors));
      add("Châssis", "Formats d’alimentation", list(component.supportedPsuFormats));
      add("Châssis", "Panneau latéral", chassis?.sidePanel === "glass" ? "Verre" : chassis?.sidePanel === "acrylic" ? "Acrylique" : chassis?.sidePanel === "vented" ? "Ajouré" : undefined);
      add("Dégagements et ventilation", "Longueur GPU maximale", amount(component.maxGpuLengthMm, "mm"));
      add("Dégagements et ventilation", "Hauteur ventirad maximale", amount(component.maxCoolerHeightMm, "mm"));
      const stockFans = fans(component.fanCount ?? chassis?.fanCount, component.fanSizeMm ?? chassis?.fanSizeMm) ?? spec(/ventilateurs? (inclus|fournis)/i);
      add("Dégagements et ventilation", "Ventilateurs fournis", stockFans);
      const radiatorSupport = component.radiatorSupport;
      const radiatorSizes = (sizes?: number[]) => sizes ? sizes.length ? `${sizes.map((size) => number.format(size)).join(" / ")} mm` : "Aucun" : undefined;
      add("Montage d’un radiateur", "Radiateur : dessus", radiatorSizes(radiatorSupport?.top));
      add("Montage d’un radiateur", "Radiateur : façade", radiatorSizes(radiatorSupport?.front));
      add("Montage d’un radiateur", "Radiateur : côté", radiatorSizes(radiatorSupport?.side));
      highlight(list(component.supportedFormFactors), amount(component.maxGpuLengthMm, "mm pour le GPU"), stockFans ? stockFans === "Aucun" ? "Sans ventilateur fourni" : `Ventilation : ${stockFans}` : undefined);
      if (chassis?.kind === "sandwich") advice.push("Dans ce châssis à compartiments, les dégagements du GPU et du ventirad sont partagés : leurs maxima ne sont pas forcément disponibles simultanément.");
      else if (known(component.maxGpuLengthMm) && radiatorSupport?.front.length) advice.push("La longueur disponible pour le GPU peut diminuer avec un radiateur en façade. Vérifiez le montage retenu dans le manuel du boîtier.");
      if (radiatorSupport) {
        if ([...radiatorSupport.top, ...radiatorSupport.front, ...(radiatorSupport.side ?? [])].length === 0)
          advice.push("Aucun emplacement de radiateur n’est pris en charge dans les données du catalogue pour ce boîtier.");
        else advice.push("Les tailles de radiateur indiquent les fixations prises en charge. Vérifiez aussi l’épaisseur avec ventilateurs et l’espace autour de la RAM et de la carte mère.");
      }
      if ((component.fanCount ?? chassis?.fanCount) === 0) advice.push("Aucun ventilateur de boîtier n’est fourni : prévoyez la ventilation selon les emplacements disponibles.");
      break;
    }
  }

  return {
    categoryLabel: categories.find((category) => category.id === component.category)?.label ?? component.category,
    groups,
    highlights: [...new Set(highlights)].slice(0, 4),
    advice,
  };
}

/** Columns retain the input order. Mixed categories do not form a meaningful comparison. */
export function getComparisonRows(components: Component[]): Array<{ label: string; values: string[] }> {
  if (!components.length || components.some((component) => component.category !== components[0].category)) return [];
  const details = components.map((component) => getProductDetails(component).groups.flatMap((group) => group.rows));
  const labels = [...new Set(details.flatMap((rows) => rows.map((row) => row.label)))];
  return labels.map((label) => ({
    label,
    values: details.map((rows) => rows.find((row) => row.label === label)?.value ?? "Non renseigné"),
  }));
}
