import {hasPartialCompatibility} from '../lib/componentCoverage';
import {getVisualProfile} from '../data/visualProfiles';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, CheckCheck, ChevronRight, CircleAlert, CircuitBoard, Cpu, Fan, GitCompareArrows, Monitor, HardDrive, Info, MemoryStick, PcCase, PlugZap, Search, ShieldCheck, SlidersHorizontal, Trash2, X } from 'lucide-react';
import { catalog, categories, getComponent } from '../data/catalog';
import type { CategoryId, Component, Selection } from '../data/catalog';
import { analyzeBuild, getCandidateIssues } from '../lib/compatibility';
import type { Resolution, Usage } from '../lib/compatibility';
import { getComparisonRows, getProductDetails } from '../lib/productDetails';
import { getPricingInfo, getReferencePrice, formatComponentPrice, getPriceCaption, pricingPolicy } from "../data/pricing";
import { getMemoryAnalysis, memorySpeed as getMemorySpeed, chooseMemoryComponent } from "../lib/memory";
import ProductArt from './ProductArt';
import { getCatalogFamily } from '../lib/catalogFamilies';
import { getReleaseInfo } from '../data/releaseTimeline';
import { compareByRecency, releaseBadge, releaseDateLabel } from '../lib/catalogOrdering';
import { getMemoryDetails, getMemoryModuleCapacity } from '../lib/memoryDetails';
import { getCatalogGroups, getVariantGroup, getVariantGroupId, getVariantLabel, getDefaultVariant, groupVariants } from '../lib/catalogVariants';
import { getPriceArchive, formatArchivePrice, formatArchiveDate } from '../lib/priceArchive';
import { useMarketFeedRevision } from '../lib/useMarketFeed';
import { getMarketFeedState, refreshMarketFeed } from '../lib/marketFeed';
import './catalog-panel.css';
import VerifiedProductPanel from './VerifiedProductPanel';
import { verifiedProducts } from '../data/verifiedCatalog';
import {catalogControlSummary} from '../data/catalogControl';
import CatalogControlNotice from './CatalogControlNotice';

export interface CatalogPanelProps {
  category: CategoryId;
  selection: Selection;
  resolution: Resolution;
  usage: Usage;
  initialProductId?: string | null;
  onCategoryChange: (category: CategoryId) => void;
  onChoose: (component: Component) => void;
  onRemove: (category: CategoryId) => void;
  onClose: () => void;
}

type View = 'list' | 'detail' | 'compare';
type Sort = 'newest' | 'oldest' | 'recommended' | 'price-up' | 'price-down' | 'archive-up' | 'archive-down' | 'name';
const PAGE_SIZE = 36;
const categoryCounts = Object.fromEntries(categories.map(({ id }) => [id, getCatalogGroups(id).length]));
const categoryIcons = { cpu: Cpu, motherboard: CircuitBoard, gpu: Monitor, ram: MemoryStick, storage: HardDrive, cooler: Fan, psu: PlugZap, case: PcCase };
const sourceDate = (value: string) => new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(value)) + ' UTC';
const euro = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const productForCategory = (id: string | null | undefined, category: CategoryId) => {
  const product = getComponent(id ?? null);
  return product?.category === category ? product : undefined;
};

function ArchivePriceNote({ component }: { component: Component }) {
  const quote = getPriceArchive(component);
  return quote ? <span className="cp-archive-note" data-archive-currency={quote.currency}><span>Archive 2025 · <b>{formatArchivePrice(quote)}</b></span><small>Repère historique · hors budget EUR</small></span> : null;
}

export default function CatalogPanel({ category, selection, resolution, usage, initialProductId, onCategoryChange, onChoose, onRemove, onClose }: CatalogPanelProps) {
  const priceRevision = useMarketFeedRevision();
  const feedState = getMarketFeedState();
  const initialProduct = productForCategory(initialProductId, category);
  const [view, setView] = useState<View>(initialProduct ? 'detail' : 'list');
  const [detailId, setDetailId] = useState<string | null>(initialProduct?.id ?? null);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('all');
  const [family, setFamily] = useState('all');
  const [sort, setSort] = useState<Sort>('newest');
  const [maxPrice, setMaxPrice] = useState('all');
  const [compatibleOnly, setCompatibleOnly] = useState(false);
  const [coolingType, setCoolingType] = useState('all');
  const [memoryType, setMemoryType] = useState('all');
  const [capacity, setCapacity] = useState('all');
  const [moduleCapacity, setModuleCapacity] = useState('all');
  const [moduleKind, setModuleKind] = useState('all');
  const [organization, setOrganization] = useState('all');
  const [modules, setModules] = useState('all');
  const [boardSlots, setBoardSlots] = useState('all');
  const [socket, setSocket] = useState('all');
  const [memorySpeed, setMemorySpeed] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [previewVariants, setPreviewVariants] = useState<Record<string, string>>({});
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const listScroll = useRef(0);
  const previousView = useRef<View>(view);
  const listFocus = useRef<string | null>(null);
  const selected = productForCategory(selection[category], category);
  const categoryLabel = categories.find((item) => item.id === category)?.label ?? '';

  function resetFilters() {
    setSearch(''); setBrand('all'); setFamily('all'); setSort('newest'); setMaxPrice('all'); setCompatibleOnly(false); setCoolingType('all');
    setMemoryType('all'); setCapacity('all'); setModuleCapacity('all'); setModuleKind('all'); setOrganization('all'); setModules('all'); setBoardSlots('all'); setSocket('all'); setMemorySpeed('all'); setVisibleCount(PAGE_SIZE); setPreviewVariants({});
  }

  useEffect(() => {
    const product = productForCategory(initialProductId, category);
    setDetailId(product?.id ?? null);
    setView(product ? 'detail' : 'list');
    setCompareIds([]);
    setDifferencesOnly(false);
    resetFilters();
    listScroll.current = 0;
    listFocus.current = null;
  }, [category, initialProductId]);

  useEffect(() => {
    if (previousView.current === view) return;
    const modal = panelRef.current?.closest('.modal');
    if (modal) modal.scrollTop = view === 'list' ? listScroll.current : 0;
    if (view !== 'list') backRef.current?.focus({ preventScroll: true });
    else {
      const target = listFocus.current === 'compare'
        ? panelRef.current?.querySelector<HTMLButtonElement>('[data-cp-compare-launch]')
        : listFocus.current
          ? panelRef.current?.querySelector<HTMLButtonElement>(`[data-cp-details="${CSS.escape(listFocus.current)}"]`)
          : panelRef.current?.querySelector<HTMLInputElement>('.cp-search input');
      (target ?? panelRef.current?.querySelector<HTMLInputElement>('.cp-search input'))?.focus({ preventScroll: true });
    }
    previousView.current = view;
  }, [view]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, brand, family, sort, maxPrice, compatibleOnly, coolingType, memoryType, capacity, moduleCapacity, moduleKind, organization, modules, boardSlots, socket, memorySpeed]);

  const candidates = useMemo(() => catalog.filter((component) => component.category === category).map((component) => ({
    component,
    issues: getCandidateIssues(selection, component, resolution, usage),
    memory: category === 'ram' ? getMemoryDetails(component) : null,
    family: getCatalogFamily(component),
    release: getReleaseInfo(component),
    searchable: normalize(`${component.brand} ${component.name} ${component.variantGroupName ?? ''} ${component.finishName ?? ''} ${component.manufacturerPartNumber ?? ''} ${component.memoryModuleKind ?? ''} ${getMemoryDetails(component).organization ?? ''} ${getCatalogFamily(component).label} ${getReleaseInfo(component)?.year ?? ''} ${component.description} ${component.specs.join(' ')}`),
  })), [category, selection, resolution, usage]);
  const families = useMemo(() => {
    const counts = new Map<string, { id: string; label: string; count: number }>();
    const seen = new Set<string>();
    candidates.forEach(({ family, component }) => {
      const key = getVariantGroupId(component);
      if (seen.has(key)) return;
      seen.add(key);
      const entry = counts.get(family.id);
      if (entry) entry.count++;
      else counts.set(family.id, { ...family, count: 1 });
    });
    return [...counts.values()].sort((a, b) => a.label.localeCompare(b.label, 'fr', { numeric: true }));
  }, [candidates]);
  const brands = useMemo(() => [...new Set(candidates.map(({ component }) => component.brand))].sort((a, b) => a.localeCompare(b, 'fr')), [candidates]);
  const capacities = useMemo(() => [...new Set(candidates.map(({ component }) => component.capacityGB).filter((value): value is number => typeof value === 'number' && value > 0))].sort((a, b) => a - b), [candidates]);
  const moduleCapacities = useMemo(() => [...new Set(candidates.map(({ component }) => getMemoryModuleCapacity(component)).filter((value): value is number => value !== null))].sort((a, b) => a - b), [candidates]);
  const moduleKinds = useMemo(() => [...new Set(candidates.map(({ memory }) => memory?.moduleKind).filter((value): value is NonNullable<typeof value> => !!value))].sort(), [candidates]);
  const organizations = useMemo(() => [...new Set(candidates.map(({ memory }) => memory?.organization).filter((value): value is string => !!value))].sort((a, b) => a.localeCompare(b, 'fr', { numeric: true })), [candidates]);
  const speeds = useMemo(() => [...new Set(candidates.map(({ component }) => getMemorySpeed(component)).filter((value): value is number => value !== null))].sort((a, b) => a - b), [candidates]);
  const moduleCounts = useMemo(() => [...new Set(candidates.map(({ component }) => component.memorySticks).filter((value): value is number => typeof value === 'number' && value > 0))].sort((a, b) => a - b), [candidates]);
  const slotCounts = useMemo(() => [...new Set(candidates.map(({ component }) => component.memorySlots).filter((value): value is number => typeof value === 'number' && value > 0))].sort((a, b) => a - b), [candidates]);
  const memoryAnalysis = useMemo(() => category === 'ram' ? getMemoryAnalysis(selection) : null, [category, selection, priceRevision]);
  const results = useMemo(() => {
    const words = normalize(search).trim().split(/\s+/).filter(Boolean);
    const items = candidates.filter(({ component, issues, searchable, family: componentFamily, memory }) => {
      const price = getReferencePrice(component);
      const speed = getMemorySpeed(component);
      return words.every((word) => searchable.includes(word))
        && (brand === 'all' || component.brand === brand)
        && (family === 'all' || componentFamily.id === family)
        && (maxPrice === 'all' || (price !== null && price <= Number(maxPrice)))
        && (memoryType === 'all' || component.memoryType === memoryType)
        && (capacity === 'all' || component.capacityGB === Number(capacity))
        && (moduleCapacity === 'all' || memory?.capacityPerModuleGB === Number(moduleCapacity))
        && (moduleKind === 'all' || (moduleKind === 'unknown' ? !memory?.moduleKind : memory?.moduleKind === moduleKind))
        && (organization === 'all' || (organization === 'unknown' ? !memory?.organization : memory?.organization === organization))
        && (modules === 'all' || component.memorySticks === Number(modules))
        && (boardSlots === 'all' || component.memorySlots === Number(boardSlots))
        && (socket === 'all' || component.socket === socket)
        && (memorySpeed === 'all' || speed === Number(memorySpeed))
        && (!compatibleOnly || issues.length === 0)
        && (coolingType === 'all' || component.coolingType === coolingType);
    });
    const byId = new Map(items.map((item) => [item.component.id, item]));
    const grouped = groupVariants(items.map(({ component }) => component)).map((group) => {
      const preview = group.variants.find((variant) => variant.id === previewVariants[group.id]);
      const component = preview ?? getDefaultVariant(group, selection);
      return { ...byId.get(component.id)!, group };
    });
    return grouped.sort((a, b) => {
      if (sort === 'newest' || sort === 'oldest') return compareByRecency(a.component, b.component, sort);
      if (sort === 'price-up' || sort === 'price-down') {
        const left = getReferencePrice(a.component), right = getReferencePrice(b.component);
        if (left === null || right === null) return left === null ? right === null ? 0 : 1 : -1;
        return sort === 'price-up' ? left - right : right - left;
      }
      if (sort === 'archive-up' || sort === 'archive-down') {
        const left = getPriceArchive(a.component)?.amount, right = getPriceArchive(b.component)?.amount;
        if (left === undefined || right === undefined) return left === undefined ? right === undefined ? 0 : 1 : -1;
        return sort === 'archive-up' ? left - right : right - left;
      }
      if (sort === 'name') return a.component.name.localeCompare(b.component.name, 'fr');
      return Number(a.issues.length > 0) - Number(b.issues.length > 0);
    });
  }, [candidates, search, brand, family, maxPrice, compatibleOnly, coolingType, sort, memoryType, capacity, moduleCapacity, moduleKind, organization, modules, boardSlots, socket, memorySpeed, previewVariants, selection, priceRevision]);
  const visibleResults = results.slice(0, visibleCount);
  const filterCount = [search.trim() !== '', brand !== 'all', family !== 'all', maxPrice !== 'all', compatibleOnly, coolingType !== 'all', memoryType !== 'all', capacity !== 'all', moduleCapacity !== 'all', moduleKind !== 'all', organization !== 'all', modules !== 'all', boardSlots !== 'all', socket !== 'all', memorySpeed !== 'all'].filter(Boolean).length;
  const detail = productForCategory(detailId, category);
  const details = detail ? getProductDetails(detail) : undefined;
  const detailRelease = detail ? getReleaseInfo(detail) : null;
  const detailGroup = getVariantGroup(detail);
  const pricing = detail ? getPricingInfo(detail) : undefined;
  const marketObservation = pricing?.observation;
  const availabilityLabels = { in_stock: 'En stock selon la source', shortly: 'Disponibilité annoncée prochainement', unavailable: 'Indisponible selon la source', unknown: 'Non renseigné' };
  const feedLabels = { snapshot: 'Relevé conservé', refreshing: 'Actualisation de la source…', refreshed: 'Source publique actualisée', partial: 'Source partiellement actualisée', unavailable: 'Source inaccessible · relevé conservé' };
  const priceArchive = detail ? getPriceArchive(detail) : null;
  const detailIssues = detail ? candidates.find((item) => item.component.id === detail.id)?.issues ?? [] : [];
  const detailAnalysis = useMemo(() => detail ? analyzeBuild(category === 'ram' ? chooseMemoryComponent(selection, detail.id) : { ...selection, [category]: detail.id }, resolution, usage) : null, [detail, category, selection, resolution, usage, priceRevision]);
  const detailWarnings = detailAnalysis?.warnings.filter((warning) => warning.severity !== 'error' && warning.category === category) ?? [];
  const compared = compareIds.map((id) => productForCategory(id, category)).filter((item): item is Component => Boolean(item));
  const comparisonRows = getComparisonRows(compared).filter((row) => !differencesOnly || new Set(row.values).size > 1);

  function openDetail(component: Component) {
    listFocus.current = component.id;
    listScroll.current = panelRef.current?.closest('.modal')?.scrollTop ?? 0;
    setDetailId(component.id);
    setView('detail');
  }
  function openComparison() {
    listFocus.current = 'compare';
    listScroll.current = panelRef.current?.closest('.modal')?.scrollTop ?? 0;
    setView('compare');
  }
  function returnToCategories() {
    panelRef.current?.closest('.modal')?.scrollTo({ top: 0, behavior: 'smooth' });
    panelRef.current?.querySelector<HTMLButtonElement>('.cp-categories [aria-current="page"]')?.focus({ preventScroll: true });
  }
  function isComparedComponent(component: Component) {
    return compareIds.some((id) => getVariantGroup(id)?.id === getVariantGroupId(component));
  }
  function toggleComparison(component: Component) {
    setCompareIds((current) => current.some((id) => getVariantGroup(id)?.id === getVariantGroupId(component))
      ? current.filter((id) => getVariantGroup(id)?.id !== getVariantGroupId(component))
      : current.length < 3 ? [...current, component.id] : current);
  }
  function previewVariant(component: Component, inDetail = false) {
    const groupId = getVariantGroupId(component);
    setPreviewVariants((current) => ({ ...current, [groupId]: component.id }));
    if (inDetail) setDetailId(component.id);
    setCompareIds((current) => current.map((id) => getVariantGroup(id)?.id === groupId ? component.id : id));
  }
  function priceDelta(component: Component) {
    if (!selected || (selected.id === component.id && !selection.memory)) return null;
    const candidateMemory = category === 'ram' ? getMemoryAnalysis(chooseMemoryComponent(selection, component.id)) : null;
    const candidatePrice = candidateMemory ? candidateMemory.priceKnown ? candidateMemory.totalPrice : null : getReferencePrice(component);
    const currentPrice = memoryAnalysis ? memoryAnalysis.priceKnown ? memoryAnalysis.totalPrice : null : getReferencePrice(selected);
    if (candidatePrice === null || currentPrice === null) return null;
    const delta = candidatePrice - currentPrice;
    if (delta === 0) return null;
    return <span className={`cp-price-delta ${delta <= 0 ? 'cp-saving' : ''}`}>{delta > 0 ? '+' : delta < 0 ? '−' : ''}{euro(Math.abs(delta))} sur votre configuration</span>;
  }
  function chooseButton(component: Component, className = '') {
    const isSelected = selection[category] === component.id && !(category === 'ram' && selection.memory);
    return <button type="button" className={`cp-button cp-primary ${isSelected ? 'cp-chosen' : ''} ${className}`} onClick={() => onChoose(component)}>
      {isSelected ? <Check size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}{isSelected ? 'Sélectionné' : 'Choisir'}
    </button>;
  }

  return <div className="catalog-panel" ref={panelRef}>
    <header className="cp-header">
      <div><span className="cp-eyebrow">LE BON COMPOSANT, AU BON ENDROIT</span><h2>{view === 'compare' ? 'Comparez les détails.' : view === 'detail' ? 'Chaque détail compte.' : 'Composez votre PC.'}</h2><p>{view === 'list' ? 'Explorez les composants, vérifiez leur compatibilité et faites votre choix.' : `${categoryLabel} · Votre configuration reste à portée de main.`}</p></div>
      <button type="button" className="cp-icon-button" aria-label="Fermer le catalogue" title="Fermer le catalogue" onClick={onClose}><X size={22} /></button>
    </header>

    <nav className="cp-categories" aria-label="Catégories de composants">
      {categories.map((item) => {
        const Icon = categoryIcons[item.id];
        return <button type="button" key={item.id} aria-current={category === item.id ? 'page' : undefined} className={category === item.id ? 'cp-active' : ''} onClick={() => { if (item.id !== category) onCategoryChange(item.id); }}>
          <Icon size={17} aria-hidden="true" /><span>{item.shortLabel}</span><small>{categoryCounts[item.id]}</small>
          {selection[item.id] && <span className="cp-category-dot" aria-label="Composant choisi" />}
        </button>;
      })}
    </nav>

    {view === 'list' && <>
      <div className="cp-discovery">
        <div className="cp-search-row">
          <label className="cp-search"><Search size={18} aria-hidden="true" /><input aria-label="Rechercher un composant" placeholder="Rechercher un composant…" value={search} onChange={(event) => setSearch(event.target.value)} />{search && <button type="button" aria-label="Effacer la recherche" onClick={() => setSearch('')}><X size={16} /></button>}</label>
          <label className="cp-field cp-sort"><span>Trier par</span><select aria-label="Trier les composants" value={sort} onChange={(event) => setSort(event.target.value as Sort)}><option value="newest">Plus récents d’abord</option><option value="oldest">Plus anciens d’abord</option><option value="recommended">Compatibilité d’abord</option><option value="price-up">Prix EUR croissant</option><option value="price-down">Prix EUR décroissant</option><option value="archive-up">Archive USD croissante</option><option value="archive-down">Archive USD décroissante</option><option value="name">Nom : A à Z</option></select></label>
        </div>
        <div className="cp-filters">
          <label className="cp-field"><span>Marque</span><select aria-label="Filtrer par marque" value={brand} onChange={(event) => setBrand(event.target.value)}><option value="all">Toutes les marques</option>{brands.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
          <label className="cp-field"><span>Budget maximum</span><select aria-label="Budget maximum par composant" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option value="all">Tous les prix</option>{[50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000].map((price) => <option key={price} value={price}>{euro(price)}</option>)}</select></label>
          <label className="toggle-label cp-compatible"><input type="checkbox" checked={compatibleOnly} onChange={(event) => setCompatibleOnly(event.target.checked)} /><span className="cp-switch" aria-hidden="true" /><span>Sans conflit connu<br className="cp-desktop-break" /> avec mes composants</span></label>
          {filterCount > 0 && <button type="button" className="cp-reset" onClick={resetFilters}><X size={13} aria-hidden="true" />Réinitialiser les filtres <span>{filterCount}</span></button>}
        </div>
        {(sort === 'archive-up' || sort === 'archive-down') && <p className="cp-budget-note">Tri des montants USD dans l’archive du 23 juillet 2025. Ce ne sont pas des offres actuelles ; les références sans montant archivé restent en dernier.</p>}
        {maxPrice !== 'all' && <p className="cp-budget-note">Le budget filtre les prix renseignés. Les références sans prix sont masquées.</p>}
        {category === 'cooler' && <div className="cp-cooling" aria-label="Type de refroidissement">{[{ id: 'all', label: 'Tout' }, { id: 'air', label: 'Ventirads' }, { id: 'aio', label: 'Watercooling' }].map((type) => <button key={type.id} type="button" aria-pressed={coolingType === type.id} className={coolingType === type.id ? 'cp-active' : ''} onClick={() => setCoolingType(type.id)}>{type.label}</button>)}</div>}
      </div>
      <div className="cp-family-filter">
        <label className="cp-field"><span>Famille de composants</span><select aria-label="Filtrer par famille de composants" value={family} onChange={(event) => setFamily(event.target.value)}><option value="all">Toutes les familles · {families.length}</option>{families.map((item) => <option key={item.id} value={item.id}>{item.label} · {item.count}</option>)}</select></label>
        {(sort === 'newest' || sort === 'oldest') && <p className="cp-chronology-note"><Info size={14} aria-hidden="true" /><span>Tri selon la sortie du modèle ou le lancement de sa génération / gamme. Une variante peut être plus récente. Les références sans année renseignée restent en dernier.</span></p>}
      </div>
      {(category === 'ram' || category === 'motherboard' || category === 'storage') && <div className="cp-specific-filters" aria-label="Caractéristiques du composant">
        {(category === 'ram' || category === 'motherboard') && <label className="cp-field"><span>Génération mémoire</span><select aria-label="Filtrer par génération mémoire" value={memoryType} onChange={(event) => setMemoryType(event.target.value)}><option value="all">Toutes les générations</option><option value="DDR4">DDR4</option><option value="DDR5">DDR5</option></select></label>}
        {category === 'ram' && <label className="cp-field"><span>Capacité par barrette</span><select aria-label="Filtrer par capacité par barrette" value={moduleCapacity} onChange={(event) => setModuleCapacity(event.target.value)}><option value="all">Toutes les capacités par barrette</option>{moduleCapacities.map((value) => <option key={value} value={value}>{value} Go par barrette</option>)}</select></label>}
        {(category === 'ram' || category === 'storage') && <label className="cp-field"><span>{category === 'ram' ? 'Capacité du kit' : 'Capacité'}</span><select aria-label="Filtrer par capacité" value={capacity} onChange={(event) => setCapacity(event.target.value)}><option value="all">Toutes les capacités</option>{capacities.map((value) => <option key={value} value={value}>{value >= 1000 && category === 'storage' ? `${value / 1000} To` : `${value} Go`}</option>)}</select></label>}
        {category === 'ram' && <><label className="cp-field"><span>Barrettes dans le kit</span><select aria-label="Filtrer par nombre de barrettes" value={modules} onChange={(event) => setModules(event.target.value)}><option value="all">Tous les kits</option>{moduleCounts.map((value) => <option key={value} value={value}>{value} barrette{value > 1 ? 's' : ''}</option>)}</select></label><label className="cp-field"><span>Débit annoncé</span><select aria-label="Filtrer par débit mémoire" value={memorySpeed} onChange={(event) => setMemorySpeed(event.target.value)}><option value="all">Tous les débits</option>{speeds.map((value) => <option key={value} value={value}>{value} MT/s</option>)}</select></label></>}
        {category === 'ram' && <><label className="cp-field"><span>Type de module</span><select aria-label="Filtrer par type de module mémoire" value={moduleKind} onChange={(event) => setModuleKind(event.target.value)}><option value="all">Tous les types</option>{moduleKinds.map((value) => <option key={value} value={value}>{value}</option>)}<option value="unknown">Type non renseigné</option></select></label><label className="cp-field"><span>Organisation des puces</span><select aria-label="Filtrer par organisation mémoire" value={organization} onChange={(event) => setOrganization(event.target.value)}><option value="all">Toutes les organisations</option>{organizations.map((value) => <option key={value} value={value}>{value}</option>)}<option value="unknown">Organisation non renseignée</option></select></label></>}
        {category === 'motherboard' && <><label className="cp-field"><span>Emplacements RAM</span><select aria-label="Filtrer par emplacements mémoire" value={boardSlots} onChange={(event) => setBoardSlots(event.target.value)}><option value="all">Tous les emplacements</option>{slotCounts.map((value) => <option key={value} value={value}>{value} emplacements</option>)}</select></label><label className="cp-field"><span>Socket processeur</span><select aria-label="Filtrer par socket" value={socket} onChange={(event) => setSocket(event.target.value)}><option value="all">Tous les sockets</option>{['AM4', 'AM5', 'LGA1700'].map((value) => <option key={value} value={value}>{value}</option>)}</select></label></>}
      </div>}
      {category === 'ram' && <p className="cp-kit-note">La capacité par barrette est distincte de celle du kit : un kit de 32 Go peut contenir 2 × 16 Go. 2Rx8 décrit les rangs et la largeur des puces, pas le nombre de barrettes. Le nombre installé se règle ensuite dans votre configuration.</p>}

      <div className="cp-results-summary"><div><h3>{categoryLabel}</h3><span role="status">{results.length} composant{results.length > 1 ? 's' : ''}</span></div><span className="cp-compare-hint"><GitCompareArrows size={14} aria-hidden="true" />Comparez jusqu’à 3 modèles</span></div>
      <div className="cp-products">
        {visibleResults.map(({ component, issues, family: componentFamily, release, group }) => {
          const isSelected = component.id === selection[category];
          const isCompared = isComparedComponent(component);
          return <article className={`catalog-product cp-product ${isSelected ? 'cp-is-selected' : ''}`} key={group.id} data-group-id={group.id} data-component-id={component.id} data-family={componentFamily.id} data-release-year={release?.year ?? ''}>
            <div className="cp-card-top"><span className="cp-brand">{component.brand}</span>{isSelected ? <span className="cp-selected-badge"><CheckCheck size={12} aria-hidden="true" />Votre choix</span> : <button type="button" className={`cp-compare-toggle ${isCompared ? 'cp-active' : ''}`} aria-label={`Comparer ${component.name}`} aria-pressed={isCompared} disabled={!isCompared && compareIds.length >= 3} onClick={() => toggleComparison(component)}>{isCompared ? <Check size={13} aria-hidden="true" /> : <GitCompareArrows size={13} aria-hidden="true" />}Comparer</button>}</div>
            <button type="button" className="cp-product-art" aria-label={`Voir les détails de ${component.name}`} onClick={() => openDetail(component)}><ProductArt category={component.category} brand={component.brand} component={component} detailed /><span className="cp-art-more">Explorer<ChevronRight size={12} aria-hidden="true" /></span></button>
            <div className="cp-classification"><span className="cp-family-badge">{componentFamily.label}</span><span className={`cp-release-badge ${release ? '' : 'cp-release-unknown'}`} title={release ? `${release.label} · ${releaseDateLabel(release)}${release.note ? ` — ${release.note}` : ''}` : 'Aucune année de sortie fiable renseignée pour cette référence'}>{releaseBadge(release)}</span></div>
            <div className="cp-card-info"><h3>{group.name}</h3><p>{component.description}</p><div className="cp-spec-tags">{getProductDetails(component).highlights.slice(0, 3).map((spec, index) => <span key={`${index}-${spec}`}>{spec}</span>)}</div></div>
            {group.variants.length > 1 ? <div className="cp-variant-picks" role="group" aria-label={`Coloris de ${group.name}`}>{group.variants.map((variant) => <button type="button" key={variant.id} aria-label={`Aperçu ${getVariantLabel(variant)}`} aria-pressed={component.id === variant.id} title={getVariantLabel(variant)} onClick={() => previewVariant(variant)}><span className="cp-color-dot" style={variant.color ? { background: variant.color } : undefined} /><span>{getVariantLabel(variant)}</span></button>)}</div> : component.finishName && <span className="cp-finish-label">Coloris : {getVariantLabel(component)}</span>}
            <div className={`cp-card-status ${issues.length ? 'cp-status-error' : hasPartialCompatibility(component) ? 'cp-status-partial' : ''}`}>{issues.length ? <CircleAlert size={13} aria-hidden="true" /> : hasPartialCompatibility(component) ? <Info size={13} aria-hidden="true" /> : <ShieldCheck size={13} aria-hidden="true" />}<span>{issues.length ? `${issues.length} conflit${issues.length > 1 ? 's' : ''} de compatibilité` : hasPartialCompatibility(component) ? 'À vérifier · données partielles' : 'Aucun conflit détecté'}</span></div>
            <div className="cp-card-price"><strong className={getReferencePrice(component) === null ? 'cp-price-unknown' : ''}>{formatComponentPrice(component)}{getReferencePrice(component) !== null && <small>{getPriceCaption(component)}</small>}</strong>{priceDelta(component)}<ArchivePriceNote component={component} /></div>
            <div className="cp-card-actions"><button type="button" className="cp-button cp-secondary" aria-label={`Détails de ${component.name}`} data-cp-details={component.id} onClick={() => openDetail(component)}>Détails</button>{chooseButton(component)}</div>
            {isSelected && <button type="button" className={`cp-current-compare ${isCompared ? 'cp-active' : ''}`} aria-label={`Comparer ${component.name}`} aria-pressed={isCompared} disabled={!isCompared && compareIds.length >= 3} onClick={() => toggleComparison(component)}>{isCompared ? <Check size={13} aria-hidden="true" /> : <GitCompareArrows size={13} aria-hidden="true" />}Comparer votre choix</button>}
          </article>;
        })}
      </div>
      {results.length > 0 && <div className="cp-pagination"><span>{visibleResults.length} sur {results.length} modèles affichés</span>{visibleCount < results.length && <button type="button" className="cp-button cp-secondary" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Afficher {Math.min(PAGE_SIZE, results.length - visibleCount)} composants de plus<ArrowRight size={14} /></button>}</div>}
      {results.length === 0 && <div className="cp-empty"><SlidersHorizontal size={30} aria-hidden="true" /><h3>Aucun composant trouvé</h3><p>Essayez une autre recherche ou élargissez vos filtres.</p><button type="button" className="cp-button cp-primary" onClick={resetFilters}>Réinitialiser les filtres</button></div>}
      <div className="cp-list-footer"><p><Info size={13} aria-hidden="true" />Contrôle individuel : {catalogControlSummary.searched} sur {catalogControlSummary.total} variantes recherchées. {Object.keys(verifiedProducts).length} références documentées par des pages primaires. Les correspondances ambiguës et recherches non concluantes sont signalées dans chaque fiche. {pricingPolicy.description}</p>{selected && <button type="button" className="cp-text-button" onClick={() => onRemove(category)}><Trash2 size={14} aria-hidden="true" />Retirer ce composant</button>}</div>
    </>}

    {view === 'detail' && detail && details && <>
      <button type="button" ref={backRef} className="cp-back" onClick={() => setView('list')}><ArrowLeft size={16} aria-hidden="true" />Retour aux composants</button>
      <section className="cp-detail-hero" aria-labelledby="cp-product-name">
        <div className="cp-detail-art"><span className="cp-detail-category">{details.categoryLabel}</span><ProductArt category={detail.category} brand={detail.brand} component={detail} detailed /><p>{getVisualProfile(detail)?.fidelity === 'schematic' ? 'Aperçu schématique : les volumes non renseignés sont illustratifs.' : 'Visuel reconstitué. Vérifiez la fiche du fabricant et les dégagements avant achat.'}</p></div>
        <div className="cp-detail-intro"><span className="cp-brand">{detail.brand}</span><h3 id="cp-product-name">{detail.name}</h3><p>{detail.description}</p><div className="cp-detail-highlights">{details.highlights.map((item, index) => <span key={`${index}-${item}`}>{item}</span>)}</div><div className="cp-detail-price"><strong className={getReferencePrice(detail) === null ? 'cp-price-unknown' : ''}>{formatComponentPrice(detail)}</strong>{getReferencePrice(detail) !== null && <span>Prix {getPriceCaption(detail)}</span>}{priceDelta(detail)}</div><div className="cp-detail-actions">{chooseButton(detail)}<button type="button" className={`cp-button cp-secondary ${isComparedComponent(detail) ? 'cp-active' : ''}`} aria-pressed={isComparedComponent(detail)} disabled={!isComparedComponent(detail) && compareIds.length >= 3} onClick={() => toggleComparison(detail)}>{isComparedComponent(detail) ? <Check size={15} aria-hidden="true" /> : <GitCompareArrows size={15} aria-hidden="true" />}Comparer</button></div></div>
      </section>
      <section className="cp-release-detail" aria-label="Classement chronologique"><Info size={17} aria-hidden="true" /><div><strong>{releaseBadge(detailRelease)}</strong><p>{detailRelease ? `${detailRelease.label} · ${releaseDateLabel(detailRelease)}. ${detailRelease.note ?? (detailRelease.basis === 'model' ? 'Repère de sortie du modèle.' : 'Le lancement de la génération ou de la gamme ne date pas chaque capacité, finition ou révision.')}` : 'La date de sortie n’est pas renseignée. Cette référence apparaît après les composants datés dans les tris chronologiques.'}</p>{detailRelease?.sourceUrl && <a href={detailRelease.sourceUrl} target="_blank" rel="noopener noreferrer">{detailRelease.sourceName ?? 'Consulter le repère historique'}<ArrowUpRight size={13} /></a>}</div></section>
      {detailGroup && detailGroup.variants.length > 1 && <section className="cp-variant-detail" aria-label="Coloris du composant"><div><strong>Finition / variante</strong><p>Le visuel, le prix et les caractéristiques affichés correspondent au coloris sélectionné.</p></div><div className="cp-variant-picks" role="group" aria-label="Coloris disponibles">{detailGroup.variants.map((variant) => <button type="button" key={variant.id} aria-label={`Coloris ${getVariantLabel(variant)}`} aria-pressed={variant.id === detail.id} onClick={() => previewVariant(variant, true)}><span className="cp-color-dot" style={variant.color ? { background: variant.color } : undefined} /><span>{getVariantLabel(variant)}</span>{variant.id === detail.id && <Check size={13} />}</button>)}</div></section>}
      {detail.source && <section className="cp-source" aria-label="Origine des caractéristiques"><div><strong><Info size={15} />Caractéristiques partielles</strong><p>Référence issue de {detail.source.dataset}, source datée du {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(detail.source.date))}. Les mesures absentes ne sont pas déduites du visuel. Les informations et la disponibilité peuvent avoir évolué.</p></div><a href={detail.source.url} target="_blank" rel="noopener noreferrer">Consulter la source<ArrowUpRight size={14} /></a></section>}
      {pricing && <section className="cp-offers" aria-label="Prix et offres du composant">
        <div><strong><Info size={15} />{pricing.label}</strong><p>{pricing.description} Comparez la même référence, capacité et finition.</p></div>
        <div className="cp-offer-links">{pricing.searchLinks.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" title={`${link.label} (nouvel onglet)`}>{link.label}<ArrowUpRight size={14} /></a>)}</div>
      </section>}
      <CatalogControlNotice component={detail} />
      <VerifiedProductPanel component={detail} />
      {marketObservation && <section className="cp-market-observation" aria-label="Prix signalé par une source publique" data-market="DE" data-reported-amount={marketObservation.amount}>
        <div className="cp-market-heading"><div><span>Signalement public · Allemagne</span><strong>{euro(marketObservation.amount)}</strong></div><span className="cp-market-unverified">Non revérifié auprès du marchand</span></div>
        <p className="cp-market-product">{marketObservation.sourceProductName}</p>
        <dl><div><dt>Marchand signalé</dt><dd>{marketObservation.merchant}</dd></div><div><dt>Stock déclaré</dt><dd>{availabilityLabels[marketObservation.availabilityReported]}</dd></div><div><dt>Prix inchangé depuis</dt><dd>{sourceDate(marketObservation.priceSince)}</dd></div><div><dt>Fichier source mis à jour</dt><dd>{sourceDate(marketObservation.sourceUpdatedAt)}</dd></div></dl>
        <p>La date du fichier ne prouve pas une vérification de cette offre. Le stock, l’état, les frais, la fiscalité et la livraison en France restent à confirmer. {pricing?.status === 'reported' ? 'Ce montant sert de repère indicatif dans votre budget.' : 'Ce signalement reste hors budget : la source est ancienne ou sa disponibilité n’est pas annoncée en stock.'}</p>
        <details><summary>Correspondance de la référence</summary><p>{marketObservation.exactVariantNote}</p></details>
        <div className="cp-market-links"><a href={marketObservation.productURL} target="_blank" rel="noopener noreferrer">Voir le produit sur Geizhals<ArrowUpRight size={14} /></a><a href={marketObservation.sourceURL} target="_blank" rel="noopener noreferrer">Consulter le suivi public<ArrowUpRight size={14} /></a></div>
        <div className="cp-market-refresh"><span role="status">{feedLabels[feedState.status]}</span><button type="button" className="cp-text-button" aria-label="Actualiser les prix signalés" disabled={feedState.status === 'refreshing'} onClick={() => { void refreshMarketFeed(); }}>Actualiser les relevés</button></div>
      </section>}
      {priceArchive && <section className="cp-price-archive" aria-label="Prix archivé du composant"><div className="cp-archive-heading"><span>Archive de catalogue · États-Unis</span><strong>{formatArchivePrice(priceArchive)}</strong></div><p>Archive du {formatArchiveDate(priceArchive)}, pour cette référence et cette finition. La date du relevé individuel, le marchand et les frais ne sont pas renseignés. Ce montant historique n’est pas une offre actuelle ; il n’est pas converti ni ajouté au budget en euros.</p><a href={priceArchive.sourceUrl} target="_blank" rel="noopener noreferrer">Consulter la source du prix<ArrowUpRight size={14} /></a></section>}
      <section className="cp-detail-compatibility" aria-labelledby="cp-compatibility-title"><h3 id="cp-compatibility-title"><ShieldCheck size={18} aria-hidden="true" />Dans votre configuration</h3>
        {detailIssues.length === 0 && <div className={`cp-notice ${hasPartialCompatibility(detail) ? 'cp-notice-warning' : 'cp-notice-success'}`}><Info size={16} aria-hidden="true" /><div><strong>{hasPartialCompatibility(detail) ? 'Aucun conflit connu · vérifications incomplètes' : 'Aucun conflit détecté avec vos composants'}</strong><p>Contrôle selon les caractéristiques renseignées. {hasPartialCompatibility(detail) ? 'Les dimensions et caractéristiques absentes doivent être vérifiées auprès du fabricant.' : 'Les emplacements encore vides seront vérifiés après leur sélection.'}</p></div></div>}
        {detailIssues.map((issue) => <div className="cp-notice cp-notice-error" key={issue.id}><CircleAlert size={16} aria-hidden="true" /><div><strong>{issue.title}</strong><p>{issue.description}</p></div></div>)}
        {detailWarnings.map((warning) => <div className="cp-notice cp-notice-warning" key={warning.id}><Info size={16} aria-hidden="true" /><div><strong>{warning.title}</strong><p>{warning.description}</p></div></div>)}
        {(category === 'cpu' || category === 'gpu') && detailAnalysis?.selected.cpu && detailAnalysis?.selected.gpu && <div className="cp-notice"><GitCompareArrows size={16} aria-hidden="true" /><div><strong>Équilibre CPU / GPU · {resolution === '4k' ? '4K' : resolution}</strong><p>{detailAnalysis.balance.description}</p>{detailAnalysis.balance.limiter !== 'unknown' && <small>Estimation indicative selon l’usage choisi, sans mesure de performances en jeu.</small>}</div></div>}
      </section>
      <div className="cp-detail-specs">{details.groups.map((group) => <section key={group.title}><h3>{group.title}</h3><dl>{group.rows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl></section>)}</div>
      {details.advice.length > 0 && <section className="cp-advice"><h3><Info size={17} aria-hidden="true" />Les détails à vérifier</h3><ul>{details.advice.map((advice, index) => <li key={index}>{advice}</li>)}</ul></section>}
    </>}

    {view === 'compare' && <>
      <button type="button" ref={backRef} className="cp-back" onClick={() => setView('list')}><ArrowLeft size={16} aria-hidden="true" />Retour aux composants</button>
      <div className="cp-comparison-heading"><div><h3>{compared.length} modèles, côte à côte.</h3><p>Comparez les caractéristiques qui comptent pour votre configuration.</p></div><label className="cp-differences"><input type="checkbox" checked={differencesOnly} onChange={(event) => setDifferencesOnly(event.target.checked)} />Afficher les différences uniquement</label></div>
      <p className="cp-scroll-hint">Faites glisser le tableau de côté pour voir les autres modèles.</p>
      <div className="cp-comparison-scroll" role="region" aria-label="Tableau comparatif des composants" tabIndex={0}><table className="cp-comparison-table"><caption className="cp-sr-only">Comparaison de {compared.map((component) => component.name).join(', ')}</caption><thead><tr><th scope="col"><span>{categoryLabel}</span><small>Prix indicatifs</small></th>{compared.map((component) => <th scope="col" key={component.id}><div className="cp-comparison-product"><ProductArt category={component.category} brand={component.brand} component={component} detailed /><span className="cp-brand">{component.brand}</span><h3>{component.name}</h3><strong className={getReferencePrice(component) === null ? 'cp-price-unknown' : ''}>{formatComponentPrice(component)}</strong>{getReferencePrice(component) !== null && <span className="cp-comparison-price-caption">Prix {getPriceCaption(component)}</span>}<ArchivePriceNote component={component} /><a className="cp-offer-link" href={getPricingInfo(component).comparisonUrl} target="_blank" rel="noopener noreferrer">Comparer les offres<ArrowUpRight size={12} /></a>{chooseButton(component)}<button type="button" className="cp-text-button" onClick={() => { setDetailId(component.id); setView('detail'); }}>Voir la fiche<ChevronRight size={12} aria-hidden="true" /></button></div></th>)}</tr></thead><tbody>
        <tr className="cp-comparison-compatibility"><th scope="row">Compatibilité actuelle</th>{compared.map((component) => { const issues = candidates.find((item) => item.component.id === component.id)?.issues ?? []; return <td key={component.id}><span className={issues.length ? 'cp-table-error' : hasPartialCompatibility(component) ? 'cp-table-partial' : 'cp-table-ok'}>{issues.length ? `${issues.length} conflit${issues.length > 1 ? 's' : ''}` : hasPartialCompatibility(component) ? 'Données partielles · à vérifier' : 'Aucun conflit détecté'}</span>{issues.map((issue) => <small key={issue.id}>{issue.title}</small>)}</td>; })}</tr>
        {comparisonRows.map((row) => <tr key={row.label} className={new Set(row.values).size > 1 ? 'cp-row-different' : ''}><th scope="row">{row.label}</th>{row.values.map((value, index) => <td key={index}>{value}</td>)}</tr>)}
      </tbody></table></div>
      {differencesOnly && comparisonRows.length === 0 && <p className="cp-no-differences">Aucune différence parmi les caractéristiques renseignées.</p>}
      <p className="cp-comparison-note">Les lignes mises en évidence diffèrent entre les modèles. Les caractéristiques non renseignées ne sont pas déduites.</p>
    </>}

    {(view === 'list' || compared.length > 0) && <div className="cp-bottom-tools">
      {view === 'list' && <div className="cp-catalog-shortcuts"><button type="button" onClick={returnToCategories}><ArrowUp size={14} aria-hidden="true" />Changer de catégorie</button><button type="button" aria-label="Fermer le sélecteur de composants" onClick={onClose}>Fermer<X size={15} aria-hidden="true" /></button></div>}
    {compared.length > 0 && <aside className="cp-compare-tray" aria-label="Composants à comparer"><div className="cp-tray-heading"><GitCompareArrows size={17} aria-hidden="true" /><span><strong>{compared.length} / 3</strong><small>à comparer</small></span></div><div className="cp-tray-products">{compared.map((component) => <div className="cp-tray-product" key={component.id}><ProductArt category={component.category} brand={component.brand} component={component} /><span title={component.name}>{component.name}</span><button type="button" aria-label={`Retirer ${component.name} de la comparaison`} onClick={() => { toggleComparison(component); if (view === 'compare' && compared.length <= 2) setView('list'); }}><X size={13} /></button></div>)}</div><div className="cp-tray-actions"><button type="button" className="cp-button cp-primary" disabled={compared.length < 2} aria-label="Comparer la sélection" data-cp-compare-launch onClick={openComparison}>Comparer<ArrowRight size={14} aria-hidden="true" /></button><button type="button" className="cp-text-button" onClick={() => { setCompareIds([]); if (view === 'compare') setView('list'); }}>Tout effacer</button></div>{compared.length === 1 && <p className="cp-tray-help">Ajoutez un deuxième modèle pour comparer.</p>}</aside>}
    </div>}
  </div>;
}
