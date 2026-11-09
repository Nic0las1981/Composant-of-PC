import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowDownUp, ArrowRight, Box, Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, CircuitBoard, Info, MemoryStick, Plus, Search, SlidersHorizontal, Trash2, X } from "lucide-react";
import { catalog, getComponent } from "../data/catalog";
import type { Component, Selection } from "../data/catalog";
import { getRamProfile } from "../data/visualProfiles";
import { arrangeMemorySlots, getMemoryAnalysis, resetMemoryToKit, withMemoryQuantity, withMemorySlot } from "../lib/memory";
import "./memory-configurator.css";

export interface MemoryConfiguratorProps {
  selection: Selection;
  onChange: (selection: Selection) => void;
  onBrowseMemory: () => void;
}

const euro = (value: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
const capacity = (value: number) => `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value)} Go`;
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const PAGE_SIZE = 20;

function moduleCapacity(component: Component) {
  const sticks = component.memorySticks;
  return sticks && component.capacityGB ? component.capacityGB / sticks : null;
}
function kitSummary(component: Component) {
  const perModule = moduleCapacity(component);
  return `${component.memorySticks || "?"} × ${perModule ? capacity(perModule) : "capacité inconnue"}${component.memoryType ? ` · ${component.memoryType}` : ""}`;
}
function estimatedPrice(component: Component) {
  return component.priceStatus === "unknown" || !Number.isFinite(component.price) || component.price <= 0 ? "Prix non renseigné" : `${euro(component.price)} le kit`;
}

export default function MemoryConfigurator({ selection, onChange, onBrowseMemory }: MemoryConfiguratorProps) {
  const headingId = useId();
  const searchId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [advanced, setAdvanced] = useState(false);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");
  const [sameGeneration, setSameGeneration] = useState(true);
  const [page, setPage] = useState(0);
  const [checksOpen, setChecksOpen] = useState(false);
  const memory = useMemo(() => getMemoryAnalysis(selection), [selection]);
  const motherboard = getComponent(selection.motherboard);
  const selectedReference = getComponent(selection.ram);
  const primary = selectedReference?.category === "ram" ? selectedReference : memory.purchases[0]?.component;
  const mixed = memory.purchases.length > 1;
  const outOfBounds = memory.slots.filter((slot) => slot.componentId && !slot.supported).length;
  const errorCount = memory.warnings.filter((warning) => warning.severity === "error").length;
  const maxQuantity = Math.min(8, Math.max(1, memory.availableSlots));
  const selectedSlot = memory.slots.find((slot) => slot.index === pickerIndex);
  const ramCatalog = useMemo(() => catalog.filter((component) => component.category === "ram"), []);
  const brands = useMemo(() => [...new Set(ramCatalog.map((component) => component.brand))].sort((a, b) => a.localeCompare(b, "fr")), [ramCatalog]);
  const candidates = useMemo(() => {
    const words = normalize(search).trim().split(/\s+/).filter(Boolean);
    return ramCatalog.filter((component) => {
      if (brand !== "all" && component.brand !== brand) return false;
      if (sameGeneration && motherboard?.memoryType && component.memoryType !== motherboard.memoryType) return false;
      const haystack = normalize(`${component.brand} ${component.name} ${component.specs.join(" ")}`);
      return words.every((word) => haystack.includes(word));
    }).sort((a, b) => Number(b.id === primary?.id) - Number(a.id === primary?.id) || a.brand.localeCompare(b.brand, "fr") || a.name.localeCompare(b.name, "fr"));
  }, [ramCatalog, brand, sameGeneration, motherboard?.memoryType, search, primary?.id]);
  const pageCount = Math.max(1, Math.ceil(candidates.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleCandidates = candidates.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const shownSlots = memory.slots.filter((slot) => slot.index < Math.max(memory.availableSlots, 1) || slot.componentId);
  const hasKnownPurchase = memory.purchases.some((purchase) => purchase.price !== null);
  const budget = memory.priceKnown ? euro(memory.totalPrice) : hasKnownPurchase ? `${euro(memory.totalPrice)} + prix à compléter` : "Prix à renseigner";

  useEffect(() => {
    if (mixed || outOfBounds > 0) setAdvanced(true);
  }, [mixed, outOfBounds]);
  useEffect(() => {
    if (errorCount > 0) setChecksOpen(true);
  }, [errorCount]);
  useEffect(() => {
    setPage(0);
  }, [search, brand, sameGeneration, motherboard?.memoryType]);
  useEffect(() => {
    if (pickerIndex !== null) searchRef.current?.focus();
  }, [pickerIndex]);
  useEffect(() => {
    if (pickerIndex !== null && !memory.slots.some((slot) => slot.index === pickerIndex && slot.supported)) setPickerIndex(null);
  }, [memory.slots, pickerIndex]);

  function focusSlot(index: number) {
    requestAnimationFrame(() => {
      const target = panelRef.current?.querySelector<HTMLButtonElement>(`[data-memory-slot="${index}"]:not(:disabled)`)
        ?? panelRef.current?.querySelector<HTMLButtonElement>(".mc-slot-select:not(:disabled)");
      target?.focus({ preventScroll: true });
    });
  }
  function openSlot(index: number) {
    setAdvanced(true);
    setPickerIndex(index);
    setSearch("");
    setBrand("all");
    setPage(0);
  }
  function closePicker() {
    const index = pickerIndex;
    setPickerIndex(null);
    if (index !== null) focusSlot(index);
  }
  function chooseForSlot(component: Component) {
    if (pickerIndex === null) return;
    const index = pickerIndex;
    onChange(withMemorySlot(selection, index, component.id));
    setPickerIndex(null);
    focusSlot(index);
  }
  function removeSlot(index: number) {
    onChange(withMemorySlot(selection, index, null));
    if (pickerIndex === index) setPickerIndex(null);
    focusSlot(index);
  }
  function changePage(nextPage: number) {
    setPage(nextPage);
    requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>(".mc-picker-heading")?.scrollIntoView({ block: "start", behavior: "instant" });
      searchRef.current?.focus({ preventScroll: true });
    });
  }

  return <section className="memory-configurator" aria-labelledby={headingId} ref={panelRef} data-installed-count={memory.installedCount} data-memory-slots={memory.availableSlots}>
    <div className="mc-heading">
      <div className="mc-heading-copy"><span className="mc-eyebrow"><MemoryStick size={14} />LE BON NOMBRE, AU BON ENDROIT</span><h3 id={headingId}>Votre mémoire, barrette par barrette.</h3><p>Choisissez la quantité, puis affinez chaque emplacement si besoin.</p></div>
      <button type="button" className="mc-button mc-secondary mc-browse" onClick={onBrowseMemory}>{primary ? "Choisir une autre mémoire" : "Catalogue RAM"}<ArrowRight size={15} /></button>
    </div>

    <div className="mc-board-summary">
      <CircuitBoard size={19} aria-hidden="true" />
      <div><strong>{motherboard ? `${motherboard.brand} ${motherboard.name}` : "Choisissez une carte mère pour confirmer les emplacements"}</strong><span>{memory.slotsKnown ? `${memory.availableSlots} emplacement${memory.availableSlots > 1 ? "s" : ""} DIMM` : "Nombre d’emplacements à confirmer"}{motherboard?.memoryType ? ` · ${motherboard.memoryType}` : ""}{motherboard?.maxMemoryGB ? ` · ${capacity(motherboard.maxMemoryGB)} au maximum` : ""}</span></div>
      <span className={`mc-count-badge ${outOfBounds || errorCount ? "mc-count-warning" : ""}`}>{memory.installedCount} / {memory.slotsKnown ? memory.availableSlots : "?"}<small>barrettes</small></span>
    </div>

    {primary ? <div className="mc-quantity-block">
      <div className="mc-reference"><span>Référence en cours</span><strong>{primary.brand} {primary.name}</strong><small>{kitSummary(primary)} par kit</small></div>
      <div className="mc-quantity"><span id={`${headingId}-quantity`}>Combien de barrettes identiques ?</span><div className="mc-quantity-buttons" role="group" aria-labelledby={`${headingId}-quantity`}>
        {Array.from({ length: maxQuantity }, (_, index) => index + 1).map((count) => <button key={count} type="button" aria-label={`Installer ${count} barrette${count > 1 ? "s" : ""}`} aria-pressed={!mixed && memory.installedCount === count} disabled={mixed} title={mixed ? "Modifiez les emplacements pour conserver les références mélangées" : `${count} barrette${count > 1 ? "s" : ""} de la référence en cours`} className={!mixed && memory.installedCount === count ? "mc-active" : ""} onClick={() => { onChange(withMemoryQuantity(selection, count, primary.id)); setPickerIndex(null); }}>{count}</button>)}
      </div></div>
      {mixed && <p className="mc-inline-note"><Info size={14} />Plusieurs références sont installées. Modifiez les emplacements ci-dessous pour conserver votre mélange.</p>}
      {!memory.slotsKnown && <p className="mc-inline-note"><Info size={14} />Placement provisoire : le nombre d’emplacements doit être confirmé dans le manuel de la carte mère.</p>}
    </div> : <div className="mc-empty"><MemoryStick size={28} /><div><strong>Aucune barrette sélectionnée</strong><p>Choisissez une référence dans le catalogue ou ajoutez-la directement dans un emplacement.</p></div><button type="button" className="mc-button mc-primary" onClick={onBrowseMemory}>Choisir ma mémoire<Plus size={15} /></button></div>}

    <div className="mc-slots-heading"><span><strong>Les emplacements</strong><small>Le marquage du manuel reste la référence pour le montage.</small></span><button type="button" className="mc-text-button" disabled={memory.installedCount === 0} onClick={() => { onChange(arrangeMemorySlots(selection)); setPickerIndex(null); }}><ArrowDownUp size={14} />Placement conseillé</button></div>
    <div className="mc-slots" style={{ "--mc-slot-columns": Math.min(4, Math.max(2, shownSlots.length)) } as CSSProperties}>
      {shownSlots.map((slot) => {
        const profile = slot.component ? getRamProfile(slot.component) : undefined;
        const filled = Boolean(slot.componentId);
        return <div className={`mc-slot ${filled ? "mc-filled" : ""} ${!slot.supported ? "mc-slot-overflow" : ""} ${pickerIndex === slot.index ? "mc-slot-editing" : ""}`} key={slot.index} data-memory-channel={slot.channel}>
          <button type="button" className="mc-slot-select" data-memory-slot={slot.index} disabled={!slot.supported} aria-label={`Emplacement ${slot.label} : ${slot.component ? `${slot.component.name}, ${slot.capacityGB === null ? "capacité inconnue" : capacity(slot.capacityGB)}` : slot.componentId ? "référence indisponible" : "vide"}. ${filled ? "Modifier" : "Ajouter une barrette"}`} aria-pressed={pickerIndex === slot.index} onClick={() => openSlot(slot.index)}>
            <span className="mc-slot-top"><strong>{slot.label}</strong><small>{!slot.supported ? "Hors limite" : slot.channel ? `Canal ${slot.channel}` : "DIMM"}</small></span>
            <span className={`mc-dimm ${filled ? "mc-dimm-filled" : ""} ${profile?.rgb ? "mc-dimm-rgb" : ""}`} style={{ "--mc-module-color": profile?.heatspreaderColor ?? slot.component?.color ?? "#3b4546" } as CSSProperties} aria-hidden="true"><span className="mc-dimm-light" /><span className="mc-dimm-body">{filled ? <MemoryStick size={27} strokeWidth={1.3} /> : <Plus size={22} />}</span><span className="mc-dimm-pins" /></span>
            <span className="mc-slot-capacity">{filled ? slot.capacityGB === null ? "Capacité inconnue" : capacity(slot.capacityGB) : "Libre"}</span>
            <span className="mc-slot-name" title={slot.component ? `${slot.component.brand} ${slot.component.name}` : undefined}>{slot.component?.name ?? (slot.componentId ? "Référence indisponible" : "Ajouter une barrette")}</span>
          </button>
          {filled && <button type="button" className="mc-slot-remove" aria-label={`Retirer la barrette ${slot.label}`} onClick={() => removeSlot(slot.index)}><Trash2 size={12} />Retirer</button>}
        </div>;
      })}
    </div>
    {outOfBounds > 0 && <p className="mc-overflow-note" role="status"><CircleAlert size={16} /><span>{outOfBounds} barrette{outOfBounds > 1 ? "s sont placées" : " est placée"} hors des emplacements de cette carte mère. {memory.installedCount <= memory.availableSlots ? "Utilisez « Placement conseillé » pour les replacer dans les emplacements disponibles." : "Retirez le surplus ou choisissez une carte offrant davantage d’emplacements."}</span></p>}

    <div className="mc-customize-row"><button type="button" className="mc-text-button" aria-expanded={advanced} onClick={() => { setAdvanced(!advanced); setPickerIndex(null); }}><SlidersHorizontal size={15} />Personnaliser les emplacements<ChevronDown size={14} className={advanced ? "mc-rotated" : ""} /></button>{advanced && memory.installedCount > 0 && <button type="button" className="mc-text-button mc-clear" onClick={() => { onChange(resetMemoryToKit(selection, null)); setPickerIndex(null); focusSlot(0); }}><Trash2 size={13} />Vider les emplacements</button>}</div>
    {advanced && pickerIndex === null && <p className="mc-customize-help">Cliquez sur un emplacement pour choisir sa barrette. Vous pouvez mélanger des références ; le type de mémoire, les capacités et les points de vigilance seront recalculés.</p>}

    {advanced && pickerIndex !== null && selectedSlot && <section className="mc-picker" aria-label={`Choisir la barrette de l’emplacement ${selectedSlot.label}`} onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); closePicker(); } }}>
      <div className="mc-picker-heading"><div><span className="mc-eyebrow">EMPLACEMENT {selectedSlot.label}</span><h4>Quelle barrette souhaitez-vous installer ?</h4><p>Une seule barrette est placée ici. Le budget compte les kits complets nécessaires.</p></div><button type="button" className="mc-icon-button" aria-label="Fermer le choix de barrette" onClick={closePicker}><X size={19} /></button></div>
      <div className="mc-search-row"><label className="mc-search" htmlFor={searchId}><Search size={16} /><input id={searchId} ref={searchRef} type="search" aria-label={`Rechercher une barrette pour ${selectedSlot.label}`} placeholder="Marque, capacité, fréquence, CL…" value={search} onChange={(event) => setSearch(event.target.value)} /></label><select aria-label="Marque de la barrette" value={brand} onChange={(event) => setBrand(event.target.value)}><option value="all">Toutes les marques</option>{brands.map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
      <div className="mc-picker-filters"><label><input type="checkbox" checked={sameGeneration} disabled={!motherboard?.memoryType} onChange={(event) => setSameGeneration(event.target.checked)} />{motherboard?.memoryType ? `Même génération : ${motherboard.memoryType}` : "Génération de la carte mère non renseignée"}</label><span role="status">{candidates.length} référence{candidates.length > 1 ? "s" : ""}</span></div>
      <div className="mc-picker-results">
        {visibleCandidates.map((component) => <button type="button" key={component.id} className={`mc-picker-result ${component.id === selectedSlot.componentId ? "mc-result-current" : ""}`} onClick={() => chooseForSlot(component)} aria-label={`Installer une barrette ${component.brand} ${component.name} en ${selectedSlot.label}`}><span className="mc-result-brand">{component.brand}{component.id === selectedSlot.componentId && <span><Check size={12} />Votre choix</span>}</span><strong>{component.name}</strong><span className="mc-result-specs">{moduleCapacity(component) ? `${capacity(moduleCapacity(component)!)} par barrette` : "Capacité par barrette à confirmer"} · {component.memoryType ?? "Type non renseigné"}</span><small>{kitSummary(component)} par kit{component.memorySpeedMTs ? ` · ${new Intl.NumberFormat("fr-FR").format(component.memorySpeedMTs)} MT/s` : ""}{component.casLatency ? ` · CL${component.casLatency}` : ""}</small><span className="mc-result-bottom"><span>{estimatedPrice(component)}</span><span>Installer<Plus size={13} /></span></span></button>)}
      </div>
      {candidates.length === 0 && <div className="mc-picker-empty"><Search size={24} /><strong>Aucune référence trouvée</strong><p>Essayez un nom plus court ou une autre marque.</p><button type="button" className="mc-button mc-secondary" onClick={() => { setSearch(""); setBrand("all"); setSameGeneration(false); }}>Réinitialiser la recherche</button></div>}
      {pageCount > 1 && <nav className="mc-pagination" aria-label="Pages des barrettes mémoire"><button type="button" className="mc-button mc-secondary" disabled={currentPage === 0} onClick={() => changePage(currentPage - 1)}><ChevronLeft size={14} />Précédent</button><span aria-live="polite">Page {currentPage + 1} / {pageCount}</span><button type="button" className="mc-button mc-secondary" disabled={currentPage >= pageCount - 1} onClick={() => changePage(currentPage + 1)}>Suivant<ChevronRight size={14} /></button></nav>}
    </section>}

    {memory.installedCount > 0 && <>
      <div className="mc-installed-summary" role="status"><div><span>Mémoire installée</span><strong>{memory.capacityKnown ? capacity(memory.totalCapacityGB) : `${capacity(memory.totalCapacityGB)} connus`}</strong><small>{memory.installedCount} barrette{memory.installedCount > 1 ? "s" : ""}{mixed ? ` · ${memory.purchases.length} références` : ""}</small></div><div><span>Budget mémoire indicatif</span><strong className={!memory.priceKnown ? "mc-price-incomplete" : ""}>{budget}</strong><small>Prix de kits entiers, hors livraison</small></div></div>
      <div className="mc-operating-info"><div><span>Canaux mémoire</span><p>{memory.channelSummary}</p></div><div><span>Vitesse de fonctionnement</span><p>{memory.speedSummary}</p></div></div>
      <div className="mc-purchases"><h4><Box size={15} />Les kits nécessaires</h4>{memory.purchases.map((purchase) => <div className="mc-purchase" key={purchase.component.id}><span className="mc-kit-count">{purchase.kits} <small>kit{purchase.kits > 1 ? "s" : ""}</small></span><div><strong>{purchase.component.brand} {purchase.component.name}</strong><span>{purchase.modulesPerKit} × {purchase.capacityPerModuleGB === null ? "capacité inconnue" : capacity(purchase.capacityPerModuleGB)} par kit · {purchase.installedModules} barrette{purchase.installedModules > 1 ? "s" : ""} montée{purchase.installedModules > 1 ? "s" : ""}{purchase.spareModules > 0 ? ` · ${purchase.spareModules} restante${purchase.spareModules > 1 ? "s" : ""}` : ""}</span></div><strong className={purchase.price === null ? "mc-purchase-unknown" : ""}>{purchase.price === null ? "Prix non renseigné" : euro(purchase.price)}</strong></div>)}<p className="mc-purchase-note"><Info size={13} />Un kit est vendu entier. Les barrettes restantes sont comptées dans le budget, mais ne sont pas montées dans le PC.</p></div>
    </>}

    {memory.warnings.length > 0 && <div className={`mc-checks ${errorCount > 0 ? "mc-has-errors" : ""}`}><button type="button" aria-expanded={checksOpen} className="mc-checks-toggle" onClick={() => setChecksOpen(!checksOpen)}><span>{errorCount > 0 ? <CircleAlert size={16} /> : <Info size={16} />}Conseils et vérifications<span className="mc-check-count">{memory.warnings.length}</span></span><ChevronDown size={16} className={checksOpen ? "mc-rotated" : ""} /></button>{checksOpen && <div className="mc-warning-list">{memory.warnings.map((warning) => <div key={warning.id} className={`mc-warning mc-warning-${warning.severity}`}>{warning.severity === "error" ? <CircleAlert size={16} /> : <Info size={16} />}<div><strong>{warning.title}</strong><p>{warning.description}</p></div></div>)}</div>}</div>}
  </section>;
}
