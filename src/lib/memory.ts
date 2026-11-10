import { getComponent, type Component, type Selection } from "../data/catalog.ts";
import { getReferencePrice } from "../data/pricing.ts";
import { getVariantGroupId } from "./catalogVariants.ts";

export const MAX_MEMORY_SLOTS = 16;
export interface MemoryWarning {
  id: string;
  severity: "error" | "warning" | "info";
  title: string;
  description: string;
  category: "ram";
}
export interface MemorySlot {
  index: number;
  label: string;
  componentId: string | null;
  component?: Component;
  capacityGB: number | null;
  supported: boolean;
  channel: string | null;
}
export interface MemoryPurchase {
  component: Component;
  kits: number;
  installedModules: number;
  spareModules: number;
  modulesPerKit: number;
  capacityPerModuleGB: number | null;
  /** Total for whole kits, never a fraction of a kit's catalogue price. */
  price: number | null;
}
export interface MemoryAnalysis {
  slots: MemorySlot[];
  availableSlots: number;
  slotsKnown: boolean;
  installedCount: number;
  totalCapacityGB: number;
  capacityKnown: boolean;
  purchases: MemoryPurchase[];
  priceKnown: boolean;
  totalPrice: number;
  warnings: MemoryWarning[];
  channelCount: number;
  channelCapacitiesGB: number[];
  channelMode: "empty" | "single" | "dual" | "multi" | "asymmetric" | "unknown";
  channelSummary: string;
  speedSummary: string;
  commonSpeedMTs: number | null;
  aggregate?: Component;
}

const validCount = (value: unknown): value is number => typeof value === "number" && Number.isInteger(value) && value > 0 && value <= MAX_MEMORY_SLOTS;
const positive = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value > 0;
const round = (value: number) => Math.round(value * 100) / 100;
const numberFormat = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
const format = (value: number) => numberFormat.format(value);
type ComponentLookup = typeof getComponent;
function boardFor(selection: Selection, lookup: ComponentLookup = getComponent) {
  const component = lookup(selection.motherboard);
  return component?.category === "motherboard" ? component : undefined;
}
function ramFor(id: string | null | undefined, lookup: ComponentLookup = getComponent) {
  const component = lookup(id);
  return component?.category === "ram" ? component : undefined;
}
function boardLayout(selection: Selection, lookup: ComponentLookup = getComponent) {
  const board = boardFor(selection, lookup);
  const slotsKnown = validCount(board?.memorySlots);
  const availableSlots = slotsKnown ? board!.memorySlots! : 4;
  // The supported mainstream AM4 / AM5 / LGA1700 controllers have two channels.
  // More physical DIMM slots alone never imply three or four channels.
  const channelCount = validCount(board?.memoryChannels)
    ? Math.min(board!.memoryChannels!, availableSlots)
    : 2;
  return { board, slotsKnown, availableSlots, channelCount };
}
function channelFor(index: number, count: number, channels: number): string | null {
  if (index >= count) return null;
  return String.fromCharCode(65 + Math.min(channels - 1, Math.floor(index / Math.ceil(count / channels))));
}
function slotLabel(index: number, count: number, channels: number) {
  const channel = channelFor(index, count, channels);
  return channel ? `${channel}${index % Math.ceil(count / channels) + 1}` : `Hors carte ${index + 1}`;
}
function preferredOrder(count: number, channels: number): number[] {
  const perChannel = Math.ceil(count / channels);
  const order: number[] = [];
  // Consumer four-slot boards normally populate A2/B2 first. Exact manuals/QVL
  // remain authoritative; one slot per channel is preferable to two in A only.
  const rank = perChannel > 1 ? [1, 0, ...Array.from({ length: Math.max(0, perChannel - 2) }, (_, i) => i + 2)] : [0];
  for (const position of rank)
    for (let channel = 0; channel < channels; channel++) {
      const index = channel * perChannel + position;
      if (index < count) order.push(index);
    }
  return order;
}
function distribute(selection: Selection, ids: string[], lookup: ComponentLookup = getComponent): Array<string | null> {
  const { availableSlots, channelCount } = boardLayout(selection, lookup);
  const slots: Array<string | null> = Array(Math.max(availableSlots, ids.length)).fill(null);
  const order = [...preferredOrder(availableSlots, channelCount), ...Array.from({ length: Math.max(0, ids.length - availableSlots) }, (_, i) => availableSlots + i)];
  ids.forEach((id, index) => { slots[order[index]] = id; });
  return slots;
}
function sourceSlots(selection: Selection, lookup: ComponentLookup = getComponent): Array<string | null> {
  if (Array.isArray(selection.memory?.slots)) return selection.memory.slots.slice(0, MAX_MEMORY_SLOTS).map(id => typeof id === "string" && id ? id : null);
  const component = ramFor(selection.ram, lookup);
  if (!component) return distribute(selection, [], lookup);
  const count = validCount(component.memorySticks) ? component.memorySticks : 1;
  return distribute(selection, Array(count).fill(component.id), lookup);
}

export function resetMemoryToKit(selection: Selection, componentId: string | null): Selection {
  const component = ramFor(componentId);
  if (componentId !== null && !component) throw new Error("Référence mémoire inconnue");
  const count = component && validCount(component.memorySticks) ? component.memorySticks : component ? 1 : 0;
  return { ...selection, ram: component?.id ?? null, memory: { slots: distribute(selection, component ? Array(count).fill(component.id) : []) } };
}
/** Selecting a finish changes only modules of the current primary reference.
 * Explicit groups certify equivalent kit specifications; similar names alone
 * must never preserve a layout when the user is really choosing another kit.
 */
export function chooseMemoryComponent(selection: Selection, componentId: string | null): Selection {
  const current = ramFor(selection.ram);
  const next = ramFor(componentId);
  const sameChoice = current && next && (current.id === next.id
    || (current.variantGroupId?.trim() && next.variantGroupId?.trim()
      && getVariantGroupId(current) === getVariantGroupId(next)));
  if (!sameChoice || !current || !next) return resetMemoryToKit(selection, componentId);
  // Preserve explicit positions, mixed references, and any overflow unchanged.
  const slots = Array.isArray(selection.memory?.slots) ? selection.memory.slots : sourceSlots(selection);
  return { ...selection, ram: next.id, memory: { slots: slots.map(id => id === current.id ? next.id : id) } };
}

/** Quick quantity control intentionally uses one reference. Mixed layouts remain editable per slot. */
export function withMemoryQuantity(selection: Selection, count: number, componentId?: string): Selection {
  if (!Number.isInteger(count) || count < 0 || count > MAX_MEMORY_SLOTS) throw new RangeError(`Nombre de barrettes attendu : 0 à ${MAX_MEMORY_SLOTS}`);
  const id = componentId ?? sourceSlots(selection).find((id): id is string => !!ramFor(id)) ?? selection.ram;
  const component = ramFor(id);
  if (count > 0 && !component) throw new Error("Choisissez une référence mémoire avant d’ajouter des barrettes");
  return { ...selection, ram: count ? component!.id : null, memory: { slots: distribute(selection, count ? Array(count).fill(component!.id) : []) } };
}
export function withMemorySlot(selection: Selection, index: number, componentId: string | null): Selection {
  if (!Number.isInteger(index) || index < 0 || index >= MAX_MEMORY_SLOTS) throw new RangeError("Emplacement mémoire invalide");
  if (componentId !== null && !ramFor(componentId)) throw new Error("Référence mémoire inconnue");
  const slots = sourceSlots(selection);
  while (slots.length <= index) slots.push(null);
  slots[index] = componentId;
  const primary = selection.ram && slots.includes(selection.ram) ? selection.ram : slots.find(id => id !== null) ?? null;
  return { ...selection, ram: primary, memory: { slots } };
}
/** Rearrange without replacing, dropping, or inventing any installed module. */
export function arrangeMemorySlots(selection: Selection): Selection {
  const ids = sourceSlots(selection).filter((id): id is string => !!id);
  return { ...selection, ram: ids.includes(selection.ram ?? "") ? selection.ram : ids[0] ?? null, memory: { slots: distribute(selection, ids) } };
}
export function memorySpeed(component: Component): number | null {
  if (positive(component.memorySpeedMTs)) return component.memorySpeedMTs;
  const text = component.specs.join(" · ");
  const match = text.match(/DDR[45][\s-]+([\d ]{4,6})/i) ?? text.match(/([\d ]{4,6})\s*MT\/s/i);
  const speed = match ? Number(match[1].replace(/\s/g, "")) : NaN;
  return positive(speed) ? speed : null;
}
function moduleFormat(component: Component): string | undefined {
  if (component.memoryModuleFormat) return component.memoryModuleFormat;
  if (/SO[ -]?DIMM/i.test(`${component.name} ${component.specs.join(" ")}`)) return "SO-DIMM";
  return undefined;
}
function profileFor(component: Component) {
  return component.memoryProfile ?? component.specs.find(spec => /EXPO|XMP/i.test(spec));
}

export function getMemoryAnalysis(selection: Selection, lookup: ComponentLookup = getComponent): MemoryAnalysis {
  const { board, availableSlots, slotsKnown, channelCount } = boardLayout(selection, lookup);
  const cpu = lookup(selection.cpu);
  const ids = sourceSlots(selection, lookup);
  const warnings: MemoryWarning[] = [];
  const add = (id: string, severity: MemoryWarning["severity"], title: string, description: string) => {
    if (!warnings.some(warning => warning.id === id)) warnings.push({ id, severity, title, description, category: "ram" });
  };
  if (selection.memory && (!Array.isArray(selection.memory.slots) || selection.memory.slots.length > MAX_MEMORY_SLOTS))
    add("memory-layout-invalid", "error", "Disposition mémoire invalide", `Le configurateur gère au plus ${MAX_MEMORY_SLOTS} emplacements explicites. La disposition sauvegardée doit être corrigée.`);
  const slots: MemorySlot[] = Array.from({ length: Math.max(availableSlots, ids.length) }, (_, index) => {
    const componentId = ids[index] ?? null;
    const component = ramFor(componentId, lookup);
    const capacityGB = component && positive(component.capacityGB) && validCount(component.memorySticks) ? component.capacityGB / component.memorySticks : null;
    return { index, label: slotLabel(index, availableSlots, channelCount), componentId, component, capacityGB, supported: index < availableSlots, channel: channelFor(index, availableSlots, channelCount) };
  });
  const occupied = slots.filter(slot => slot.componentId !== null);
  const installedCount = occupied.length;
  const components = [...new Map(occupied.filter(slot => slot.component).map(slot => [slot.component!.id, slot.component!])).values()];
  const totalCapacityGB = round(occupied.reduce((sum, slot) => sum + (slot.capacityGB ?? 0), 0));
  const capacityKnown = occupied.every(slot => slot.capacityGB !== null);
  const purchases: MemoryPurchase[] = components.map(component => {
    const installedModules = occupied.filter(slot => slot.component?.id === component.id).length;
    const kitKnown = validCount(component.memorySticks);
    const modulesPerKit = kitKnown ? component.memorySticks! : 1;
    const kits = Math.ceil(installedModules / modulesPerKit);
    const capacityPerModuleGB = positive(component.capacityGB) && kitKnown ? component.capacityGB / modulesPerKit : null;
    const referencePrice = getReferencePrice(component);
    return { component, kits, installedModules, spareModules: kits * modulesPerKit - installedModules, modulesPerKit, capacityPerModuleGB, price: referencePrice !== null && kitKnown ? round(kits * referencePrice) : null };
  });
  const totalPrice = round(purchases.reduce((sum, purchase) => sum + (purchase.price ?? 0), 0));
  const priceKnown = purchases.every(purchase => purchase.price !== null) && occupied.every(slot => !!slot.component);
  const types = [...new Set(components.map(component => component.memoryType).filter(Boolean))];
  const occupiedValid = occupied.filter(slot => slot.component);
  if (installedCount) {
    if (occupiedValid.length !== installedCount) add("memory-reference", "error", "Référence mémoire introuvable", "Au moins un emplacement contient une référence absente du catalogue. Remplacez ou retirez cette barrette.");
    if (!board) add("memory-board-missing", "info", "Carte mère à choisir", "La disposition sur quatre emplacements est provisoire. La carte mère déterminera le nombre réel d’emplacements et la mémoire prise en charge.");
    else {
      if (!slotsKnown) add("memory-slots-unknown", "warning", "Nombre d’emplacements à vérifier", "Le nombre d’emplacements n’est pas renseigné pour cette carte mère ; le schéma provisoire ne garantit pas le montage.");
      if (!positive(board.maxMemoryGB)) add("memory-capacity-unknown", "warning", "Capacité maximale non renseignée", "Vérifiez la capacité totale et la capacité par barrette dans le manuel et les listes de mémoire prises en charge par cette carte mère.");
      if (!board.memoryType || components.some(component => !component.memoryType)) add("memory-type-unknown", "warning", "Type de mémoire à vérifier", "Le type DDR de la carte mère ou d’une référence est incomplet dans le catalogue.");
      if (board.memoryType && components.some(component => component.memoryType && component.memoryType !== board.memoryType))
        add("memory-type", "error", "Mémoire incompatible", `Cette carte mère accepte la ${board.memoryType}. La sélection comprend ${types.join(" et ")} : leurs connecteurs ne sont pas interchangeables.`);
      if (positive(board.maxMemoryGB) && totalCapacityGB > board.maxMemoryGB)
        add("memory-capacity", "error", "Capacité mémoire dépassée", `${format(totalCapacityGB)} Go sélectionnés pour un maximum renseigné de ${format(board.maxMemoryGB)} Go.`);
      if (positive(board.maxMemoryPerSlotGB) && occupied.some(slot => (slot.capacityGB ?? 0) > board.maxMemoryPerSlotGB!))
        add("memory-module-capacity", "error", "Capacité par barrette dépassée", `Cette carte mère indique au plus ${format(board.maxMemoryPerSlotGB)} Go par emplacement. Une barrette sélectionnée dépasse cette limite.`);
      if (slotsKnown && (installedCount > availableSlots || occupied.some(slot => !slot.supported)))
        add("memory-slots", "error", installedCount > availableSlots ? "Trop de barrettes mémoire" : "Barrette hors des emplacements disponibles", `${installedCount} barrette${installedCount > 1 ? "s" : ""} sélectionnée${installedCount > 1 ? "s" : ""} pour ${availableSlots} emplacements. ${occupied.filter(slot => !slot.supported).length} barrette(s) reste(nt) hors carte : réorganisez les emplacements ou retirez le surplus.`);
      const boardFormat = moduleFormat(board);
      if (boardFormat && components.some(component => moduleFormat(component) && moduleFormat(component) !== boardFormat))
        add("memory-module-format", "error", "Format de barrette incompatible", `La carte mère utilise des ${boardFormat}. Les barrettes DIMM et SO-DIMM n’ont pas le même format physique.`);
      else if (components.some(component => moduleFormat(component) === "SO-DIMM") && !boardFormat)
        add("memory-module-format-unknown", "warning", "Format SO-DIMM à confirmer", "Cette référence est une SO-DIMM. Son acceptation par la carte mère n’est pas renseignée ; consultez son manuel.");
      if (components.some(component => component.memoryRegistered === true)) {
        if (board.memoryRegistered === false || ["AM4", "AM5", "LGA1700"].includes(board.socket ?? ""))
          add("memory-registered", "error", "Mémoire enregistrée non prise en charge", "Cette plateforme de bureau utilise de la mémoire non enregistrée. Les RDIMM/LRDIMM ne se substituent pas aux UDIMM.");
        else if (board.memoryRegistered === undefined) add("memory-registered-unknown", "warning", "Mémoire enregistrée à vérifier", "La prise en charge des RDIMM/LRDIMM n’est pas renseignée pour cette carte mère.");
      }
      if (components.some(component => component.memoryEcc === true) && board.memoryEcc !== true)
        add("memory-ecc", "warning", "Fonction ECC à vérifier", "L’ECC exige un processeur, une carte mère et un BIOS compatibles. Une barrette ECC ne suffit pas à garantir la correction d’erreurs active.");
    }
    const formats = new Set(components.map(moduleFormat).filter(Boolean));
    if (formats.size > 1) add("memory-mixed-format", "error", "Formats de barrettes mélangés", "Une même disposition mémoire ne peut pas associer des DIMM et des SO-DIMM : leurs dimensions et connecteurs diffèrent.");
    const registeredTypes = new Set(components.map(component => component.memoryRegistered).filter(value => value !== undefined));
    if (registeredTypes.size > 1) add("memory-mixed-buffering", "error", "Mémoire enregistrée et non enregistrée mélangée", "Les RDIMM et UDIMM ne peuvent pas être utilisées ensemble. Choisissez le type pris en charge par la plateforme.");
    if (types.length > 1) add("memory-mixed-generation", "error", "Générations de mémoire mélangées", "DDR4 et DDR5 ne peuvent pas fonctionner ensemble dans cette configuration.");
    if (cpu?.category === "cpu" && cpu.supportedMemory && components.some(component => component.memoryType && !cpu.supportedMemory!.includes(component.memoryType)))
      add("cpu-memory", "error", "Mémoire non prise en charge par le CPU", `${cpu.name} prend en charge ${cpu.supportedMemory.join(" ou ")}, pas toutes les générations présentes dans les emplacements.`);
    if (!capacityKnown) add("memory-capacity-data", "warning", "Capacité installée partiellement connue", "La capacité par barrette ne peut pas être calculée pour toutes les références. Le total affiché additionne uniquement les capacités connues.");
    if (components.some(component => !validCount(component.memorySticks))) add("memory-kit-data", "warning", "Composition du kit à vérifier", "Le nombre de barrettes par kit n’est pas renseigné pour une référence ; son prix d’achat complet ne peut pas être calculé.");
    if (components.length > 1) add("memory-mixed-kits", "warning", "Références mémoire mélangées", "Même avec la même génération DDR, des capacités, puces, tensions ou réglages différents peuvent empêcher le démarrage ou demander un réglage manuel. Privilégiez un kit validé ensemble et consultez la QVL.");
    else if (purchases.some(purchase => purchase.kits > 1)) add("memory-separate-kits", "warning", "Plusieurs kits à valider ensemble", "Deux kits de même référence peuvent utiliser des puces ou révisions différentes. Le profil XMP/EXPO n’est pas garanti avec tous leurs modules installés ensemble.");
    if (installedCount > channelCount) add("memory-dpc", "warning", "Plusieurs barrettes par canal", `Avec ${installedCount} barrettes et ${channelCount} canaux, plusieurs modules partagent un canal et sollicitent davantage le contrôleur mémoire. Le débit stable peut être inférieur au profil annoncé ; vérifiez le manuel, la QVL et le BIOS.`);
    const preferred = preferredOrder(availableSlots, channelCount).slice(0, Math.min(installedCount, availableSlots)).sort((a, b) => a - b);
    const occupiedIndices = occupied.map(slot => slot.index).sort((a, b) => a - b);
    if (slotsKnown && installedCount <= availableSlots && occupiedIndices.some((index, i) => index !== preferred[i]))
      add("memory-placement", "info", "Placement recommandé à vérifier", `Pour ${installedCount} barrette(s), le schéma conseillé est ${preferred.map(index => slotLabel(index, availableSlots, channelCount)).join(" + ")}. Le manuel du modèle exact reste prioritaire.`);
  }

  const speeds = components.map(memorySpeed);
  const speedKnown = components.length > 0 && speeds.every(speed => speed !== null);
  const commonSpeedMTs = speedKnown ? Math.min(...speeds as number[]) : null;
  const hasProfile = components.some(component => !!profileFor(component) && !/JEDEC/i.test(profileFor(component)!));
  const speedSummary = !installedCount ? "Aucune barrette installée" : commonSpeedMTs
    ? `Référence commune : ${format(commonSpeedMTs)} MT/s au plus selon les fiches. ${hasProfile ? "XMP/EXPO, " : ""}CPU, BIOS et nombre de barrettes peuvent imposer un débit inférieur ; ce n’est pas une vitesse garantie.`
    : "Débit commun non calculable : une ou plusieurs références ne renseignent pas leur débit. Vérifiez les réglages dans le BIOS.";
  const channelCapacitiesGB = Array(channelCount).fill(0) as number[];
  occupied.forEach(slot => { if (slot.supported && slot.channel) channelCapacitiesGB[slot.channel.charCodeAt(0) - 65] += slot.capacityGB ?? 0; });
  const activeChannels = channelCapacitiesGB.filter(capacity => capacity > 0);
  let channelMode: MemoryAnalysis["channelMode"] = "unknown";
  let channelSummary = "Répartition des canaux à vérifier avec la carte mère et le contrôleur mémoire.";
  if (!installedCount) { channelMode = "empty"; channelSummary = "Aucune barrette installée"; }
  else if (capacityKnown && types.length <= 1 && occupied.every(slot => slot.supported) && slotsKnown && !warnings.some(warning => warning.severity === "error")) {
    if (activeChannels.length === 1) { channelMode = "single"; channelSummary = "Un seul canal occupé : la bande passante peut être inférieure à celle d’une paire répartie sur deux canaux."; }
    else if (activeChannels.length === channelCount && new Set(channelCapacitiesGB).size === 1) {
      channelMode = channelCount === 2 ? "dual" : "multi";
      channelSummary = `${channelCount === 2 ? "Double canal" : `${channelCount} canaux`} : ${format(totalCapacityGB)} Go répartis à parts égales. Le fonctionnement dépend du contrôleur et du BIOS.`;
    } else if (activeChannels.length > 1) {
      channelMode = "asymmetric";
      const balanced = Math.min(...channelCapacitiesGB) * channelCount;
      channelSummary = `Répartition asymétrique : ${format(balanced)} Go équilibrés entre les canaux et ${format(totalCapacityGB - balanced)} Go supplémentaires. Un mode flexible peut être possible selon le contrôleur et le BIOS ; trois barrettes ne créent pas un troisième canal.`;
    }
  }
  const primary = components.find(component => component.id === selection.ram) ?? components[0];
  const aggregate: Component | undefined = primary ? {
    ...primary,
    detailLevel: components.some(component => component.detailLevel === "partial") ? "partial" : primary.detailLevel,
    name: components.length === 1 ? `${primary.name} · ${installedCount} barrette${installedCount > 1 ? "s" : ""} installée${installedCount > 1 ? "s" : ""}` : `Mémoire personnalisée · ${installedCount} barrettes · ${format(totalCapacityGB)} Go`,
    brand: components.length === 1 ? primary.brand : "Mémoire mixte",
    description: `${installedCount} barrette(s) installée(s), ${format(totalCapacityGB)} Go ${capacityKnown ? "au total" : "connus"}. ${purchases.reduce((sum, purchase) => sum + purchase.kits, 0)} kit(s) complet(s) compté(s) au budget.`,
    specs: [`${format(totalCapacityGB)} Go installés`, `${installedCount} barrette${installedCount > 1 ? "s" : ""}`, types.join(" / "), commonSpeedMTs ? `${format(commonSpeedMTs)} MT/s annoncés au plus` : "Débit à vérifier"].filter(Boolean),
    capacityGB: totalCapacityGB,
    memorySticks: installedCount,
    memoryType: types.length === 1 ? types[0] : undefined,
    price: totalPrice,
    priceBasis: 'installed-memory-purchases',
    priceStatus: priceKnown ? "estimate" : "unknown",
  } : undefined;
  return { slots, availableSlots, slotsKnown, installedCount, totalCapacityGB, capacityKnown, purchases, priceKnown, totalPrice, warnings, channelCount, channelCapacitiesGB, channelMode, channelSummary, speedSummary, commonSpeedMTs, aggregate };
}
