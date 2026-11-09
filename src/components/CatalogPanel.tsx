import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Check, CheckCheck, ChevronRight, CircleAlert, CircuitBoard, Cpu, Fan, GitCompareArrows, Monitor, HardDrive, Info, MemoryStick, PcCase, PlugZap, Search, ShieldCheck, SlidersHorizontal, Trash2, X } from 'lucide-react';
import { catalog, categories, getComponent } from '../data/catalog';
import type { CategoryId, Component, Selection } from '../data/catalog';
import { analyzeBuild, getCandidateIssues } from '../lib/compatibility';
import type { Resolution, Usage } from '../lib/compatibility';
import { getComparisonRows, getProductDetails } from '../lib/productDetails';
import ProductArt from './ProductArt';
import './catalog-panel.css';

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
type Sort = 'recommended' | 'price-up' | 'price-down' | 'name';
const categoryIcons = { cpu: Cpu, motherboard: CircuitBoard, gpu: Monitor, ram: MemoryStick, storage: HardDrive, cooler: Fan, psu: PlugZap, case: PcCase };
const euro = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const productForCategory = (id: string | null | undefined, category: CategoryId) => {
  const product = getComponent(id ?? null);
  return product?.category === category ? product : undefined;
};

export default function CatalogPanel({ category, selection, resolution, usage, initialProductId, onCategoryChange, onChoose, onRemove, onClose }: CatalogPanelProps) {
  const initialProduct = productForCategory(initialProductId, category);
  const [view, setView] = useState<View>(initialProduct ? 'detail' : 'list');
  const [detailId, setDetailId] = useState<string | null>(initialProduct?.id ?? null);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('all');
  const [sort, setSort] = useState<Sort>('recommended');
  const [maxPrice, setMaxPrice] = useState('all');
  const [compatibleOnly, setCompatibleOnly] = useState(false);
  const [coolingType, setCoolingType] = useState('all');
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
    setSearch(''); setBrand('all'); setSort('recommended'); setMaxPrice('all'); setCompatibleOnly(false); setCoolingType('all');
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

  const candidates = useMemo(() => catalog.filter((component) => component.category === category).map((component) => ({
    component,
    issues: getCandidateIssues(selection, component, resolution, usage),
  })), [category, selection, resolution, usage]);
  const brands = useMemo(() => [...new Set(candidates.map(({ component }) => component.brand))].sort((a, b) => a.localeCompare(b, 'fr')), [candidates]);
  const results = useMemo(() => {
    const words = normalize(search).trim().split(/\s+/).filter(Boolean);
    const items = candidates.filter(({ component, issues }) => {
      const haystack = normalize(`${component.brand} ${component.name} ${component.description} ${component.specs.join(' ')}`);
      return words.every((word) => haystack.includes(word))
        && (brand === 'all' || component.brand === brand)
        && (maxPrice === 'all' || component.price <= Number(maxPrice))
        && (!compatibleOnly || issues.length === 0)
        && (coolingType === 'all' || component.coolingType === coolingType);
    });
    return items.sort((a, b) => {
      if (sort === 'price-up') return a.component.price - b.component.price;
      if (sort === 'price-down') return b.component.price - a.component.price;
      if (sort === 'name') return a.component.name.localeCompare(b.component.name, 'fr');
      return Number(a.issues.length > 0) - Number(b.issues.length > 0);
    });
  }, [candidates, search, brand, maxPrice, compatibleOnly, coolingType, sort]);
  const filterCount = [search.trim() !== '', brand !== 'all', maxPrice !== 'all', compatibleOnly, coolingType !== 'all'].filter(Boolean).length;
  const detail = productForCategory(detailId, category);
  const details = detail ? getProductDetails(detail) : undefined;
  const detailIssues = detail ? candidates.find((item) => item.component.id === detail.id)?.issues ?? [] : [];
  const detailAnalysis = useMemo(() => detail ? analyzeBuild({ ...selection, [category]: detail.id }, resolution, usage) : null, [detail, category, selection, resolution, usage]);
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
  function toggleComparison(component: Component) {
    setCompareIds((current) => current.includes(component.id) ? current.filter((id) => id !== component.id) : current.length < 3 ? [...current, component.id] : current);
  }
  function priceDelta(component: Component) {
    if (!selected || selected.id === component.id) return null;
    const delta = component.price - selected.price;
    return <span className={`cp-price-delta ${delta <= 0 ? 'cp-saving' : ''}`}>{delta > 0 ? '+' : delta < 0 ? '−' : ''}{euro(Math.abs(delta))} sur votre configuration</span>;
  }
  function chooseButton(component: Component, className = '') {
    const isSelected = selection[category] === component.id;
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
          <Icon size={17} aria-hidden="true" /><span>{item.shortLabel}</span><small>{catalog.filter((component) => component.category === item.id).length}</small>
          {selection[item.id] && <span className="cp-category-dot" aria-label="Composant choisi" />}
        </button>;
      })}
    </nav>

    {view === 'list' && <>
      <div className="cp-discovery">
        <div className="cp-search-row">
          <label className="cp-search"><Search size={18} aria-hidden="true" /><input aria-label="Rechercher un composant" placeholder="Rechercher un composant…" value={search} onChange={(event) => setSearch(event.target.value)} />{search && <button type="button" aria-label="Effacer la recherche" onClick={() => setSearch('')}><X size={16} /></button>}</label>
          <label className="cp-field cp-sort"><span>Trier par</span><select aria-label="Trier les composants" value={sort} onChange={(event) => setSort(event.target.value as Sort)}><option value="recommended">Compatibilité d’abord</option><option value="price-up">Prix croissant</option><option value="price-down">Prix décroissant</option><option value="name">Nom : A à Z</option></select></label>
        </div>
        <div className="cp-filters">
          <label className="cp-field"><span>Marque</span><select aria-label="Filtrer par marque" value={brand} onChange={(event) => setBrand(event.target.value)}><option value="all">Toutes les marques</option>{brands.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
          <label className="cp-field"><span>Budget maximum</span><select aria-label="Budget maximum par composant" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option value="all">Tous les prix</option>{[50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000].map((price) => <option key={price} value={price}>{euro(price)}</option>)}</select></label>
          <label className="toggle-label cp-compatible"><input type="checkbox" checked={compatibleOnly} onChange={(event) => setCompatibleOnly(event.target.checked)} /><span className="cp-switch" aria-hidden="true" /><span>Compatibles avec<br className="cp-desktop-break" /> mes composants</span></label>
          {filterCount > 0 && <button type="button" className="cp-reset" onClick={resetFilters}><X size={13} aria-hidden="true" />Réinitialiser les filtres <span>{filterCount}</span></button>}
        </div>
        {category === 'cooler' && <div className="cp-cooling" aria-label="Type de refroidissement">{[{ id: 'all', label: 'Tout' }, { id: 'air', label: 'Ventirads' }, { id: 'aio', label: 'Watercooling' }].map((type) => <button key={type.id} type="button" aria-pressed={coolingType === type.id} className={coolingType === type.id ? 'cp-active' : ''} onClick={() => setCoolingType(type.id)}>{type.label}</button>)}</div>}
      </div>

      <div className="cp-results-summary"><div><h3>{categoryLabel}</h3><span role="status">{results.length} composant{results.length > 1 ? 's' : ''}</span></div><span className="cp-compare-hint"><GitCompareArrows size={14} aria-hidden="true" />Comparez jusqu’à 3 modèles</span></div>
      <div className="cp-products">
        {results.map(({ component, issues }) => {
          const isSelected = selection[category] === component.id;
          const isCompared = compareIds.includes(component.id);
          return <article className={`catalog-product cp-product ${isSelected ? 'cp-is-selected' : ''}`} key={component.id}>
            <div className="cp-card-top"><span className="cp-brand">{component.brand}</span>{isSelected ? <span className="cp-selected-badge"><CheckCheck size={12} aria-hidden="true" />Votre choix</span> : <button type="button" className={`cp-compare-toggle ${isCompared ? 'cp-active' : ''}`} aria-label={`Comparer ${component.name}`} aria-pressed={isCompared} disabled={!isCompared && compareIds.length >= 3} onClick={() => toggleComparison(component)}>{isCompared ? <Check size={13} aria-hidden="true" /> : <GitCompareArrows size={13} aria-hidden="true" />}Comparer</button>}</div>
            <button type="button" className="cp-product-art" aria-label={`Voir les détails de ${component.name}`} onClick={() => openDetail(component)}><ProductArt category={component.category} brand={component.brand} component={component} detailed /><span className="cp-art-more">Explorer<ChevronRight size={12} aria-hidden="true" /></span></button>
            <div className="cp-card-info"><h3>{component.name}</h3><p>{component.description}</p><div className="cp-spec-tags">{getProductDetails(component).highlights.slice(0, 3).map((spec, index) => <span key={`${index}-${spec}`}>{spec}</span>)}</div></div>
            <div className={`cp-card-status ${issues.length ? 'cp-status-error' : ''}`}>{issues.length ? <CircleAlert size={13} aria-hidden="true" /> : <ShieldCheck size={13} aria-hidden="true" />}<span>{issues.length ? `${issues.length} conflit${issues.length > 1 ? 's' : ''} de compatibilité` : 'Aucun conflit détecté'}</span></div>
            <div className="cp-card-price"><strong>{euro(component.price)}</strong>{priceDelta(component)}</div>
            <div className="cp-card-actions"><button type="button" className="cp-button cp-secondary" aria-label={`Détails de ${component.name}`} data-cp-details={component.id} onClick={() => openDetail(component)}>Détails</button>{chooseButton(component)}</div>
            {isSelected && <button type="button" className={`cp-current-compare ${isCompared ? 'cp-active' : ''}`} aria-label={`Comparer ${component.name}`} aria-pressed={isCompared} disabled={!isCompared && compareIds.length >= 3} onClick={() => toggleComparison(component)}>{isCompared ? <Check size={13} aria-hidden="true" /> : <GitCompareArrows size={13} aria-hidden="true" />}Comparer votre choix</button>}
          </article>;
        })}
      </div>
      {results.length === 0 && <div className="cp-empty"><SlidersHorizontal size={30} aria-hidden="true" /><h3>Aucun composant trouvé</h3><p>Essayez une autre recherche ou élargissez vos filtres.</p><button type="button" className="cp-button cp-primary" onClick={resetFilters}>Réinitialiser les filtres</button></div>}
      <div className="cp-list-footer"><p><Info size={13} aria-hidden="true" />Prix indicatifs. Les illustrations s’adaptent aux caractéristiques renseignées.</p>{selected && <button type="button" className="cp-text-button" onClick={() => onRemove(category)}><Trash2 size={14} aria-hidden="true" />Retirer ce composant</button>}</div>
    </>}

    {view === 'detail' && detail && details && <>
      <button type="button" ref={backRef} className="cp-back" onClick={() => setView('list')}><ArrowLeft size={16} aria-hidden="true" />Retour aux composants</button>
      <section className="cp-detail-hero" aria-labelledby="cp-product-name">
        <div className="cp-detail-art"><span className="cp-detail-category">{details.categoryLabel}</span><ProductArt category={detail.category} brand={detail.brand} component={detail} detailed /><p>Visuel reconstitué. Vérifiez la fiche du fabricant et les dégagements avant achat.</p></div>
        <div className="cp-detail-intro"><span className="cp-brand">{detail.brand}</span><h3 id="cp-product-name">{detail.name}</h3><p>{detail.description}</p><div className="cp-detail-highlights">{details.highlights.map((item, index) => <span key={`${index}-${item}`}>{item}</span>)}</div><div className="cp-detail-price"><strong>{euro(detail.price)}</strong><span>Prix indicatif</span>{priceDelta(detail)}</div><div className="cp-detail-actions">{chooseButton(detail)}<button type="button" className={`cp-button cp-secondary ${compareIds.includes(detail.id) ? 'cp-active' : ''}`} aria-pressed={compareIds.includes(detail.id)} disabled={!compareIds.includes(detail.id) && compareIds.length >= 3} onClick={() => toggleComparison(detail)}>{compareIds.includes(detail.id) ? <Check size={15} aria-hidden="true" /> : <GitCompareArrows size={15} aria-hidden="true" />}Comparer</button></div></div>
      </section>
      <section className="cp-detail-compatibility" aria-labelledby="cp-compatibility-title"><h3 id="cp-compatibility-title"><ShieldCheck size={18} aria-hidden="true" />Dans votre configuration</h3>
        {detailIssues.length === 0 && <div className="cp-notice cp-notice-success"><Check size={16} aria-hidden="true" /><div><strong>Aucun conflit détecté avec vos composants</strong><p>Contrôle selon les caractéristiques renseignées. Les emplacements encore vides seront vérifiés après leur sélection.</p></div></div>}
        {detailIssues.map((issue) => <div className="cp-notice cp-notice-error" key={issue.id}><CircleAlert size={16} aria-hidden="true" /><div><strong>{issue.title}</strong><p>{issue.description}</p></div></div>)}
        {detailWarnings.map((warning) => <div className="cp-notice cp-notice-warning" key={warning.id}><Info size={16} aria-hidden="true" /><div><strong>{warning.title}</strong><p>{warning.description}</p></div></div>)}
        {(category === 'cpu' || category === 'gpu') && detailAnalysis?.selected.cpu && detailAnalysis?.selected.gpu && <div className="cp-notice"><GitCompareArrows size={16} aria-hidden="true" /><div><strong>Équilibre CPU / GPU · {resolution === '4k' ? '4K' : resolution}</strong><p>{detailAnalysis.balance.description}</p><small>Estimation indicative selon l’usage choisi, sans mesure de performances en jeu.</small></div></div>}
      </section>
      <div className="cp-detail-specs">{details.groups.map((group) => <section key={group.title}><h3>{group.title}</h3><dl>{group.rows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl></section>)}</div>
      {details.advice.length > 0 && <section className="cp-advice"><h3><Info size={17} aria-hidden="true" />Les détails à vérifier</h3><ul>{details.advice.map((advice, index) => <li key={index}>{advice}</li>)}</ul></section>}
    </>}

    {view === 'compare' && <>
      <button type="button" ref={backRef} className="cp-back" onClick={() => setView('list')}><ArrowLeft size={16} aria-hidden="true" />Retour aux composants</button>
      <div className="cp-comparison-heading"><div><h3>{compared.length} modèles, côte à côte.</h3><p>Comparez les caractéristiques qui comptent pour votre configuration.</p></div><label className="cp-differences"><input type="checkbox" checked={differencesOnly} onChange={(event) => setDifferencesOnly(event.target.checked)} />Afficher les différences uniquement</label></div>
      <p className="cp-scroll-hint">Faites glisser le tableau de côté pour voir les autres modèles.</p>
      <div className="cp-comparison-scroll" role="region" aria-label="Tableau comparatif des composants" tabIndex={0}><table className="cp-comparison-table"><caption className="cp-sr-only">Comparaison de {compared.map((component) => component.name).join(', ')}</caption><thead><tr><th scope="col"><span>{categoryLabel}</span><small>Prix indicatifs</small></th>{compared.map((component) => <th scope="col" key={component.id}><div className="cp-comparison-product"><ProductArt category={component.category} brand={component.brand} component={component} detailed /><span className="cp-brand">{component.brand}</span><h3>{component.name}</h3><strong>{euro(component.price)}</strong>{chooseButton(component)}<button type="button" className="cp-text-button" onClick={() => { setDetailId(component.id); setView('detail'); }}>Voir la fiche<ChevronRight size={12} aria-hidden="true" /></button></div></th>)}</tr></thead><tbody>
        <tr className="cp-comparison-compatibility"><th scope="row">Compatibilité actuelle</th>{compared.map((component) => { const issues = candidates.find((item) => item.component.id === component.id)?.issues ?? []; return <td key={component.id}><span className={issues.length ? 'cp-table-error' : 'cp-table-ok'}>{issues.length ? `${issues.length} conflit${issues.length > 1 ? 's' : ''}` : 'Aucun conflit détecté'}</span>{issues.map((issue) => <small key={issue.id}>{issue.title}</small>)}</td>; })}</tr>
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
