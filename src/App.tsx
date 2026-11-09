import { useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import {
  Box,
  Cpu,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Fan,
  Zap,
  Monitor,
  LayoutGrid,
  FolderOpen,
  ArrowUpRight,
  ArrowRight,
  Check,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  RefreshCw,
  Expand,
  RotateCcw,
  Layers3,
  MousePointer2,
  ShieldCheck,
  TriangleAlert,
  Info,
  Sparkles,
  Download,
  Save,
  SlidersHorizontal,
  CheckCheck,
  Trash2,
  BookOpen,
  Menu,
  Crosshair,
  Gauge,
  Play,
  Pause,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  catalog,
  categories,
  defaultSelection,
  type CategoryId,
  type Component,
} from "./data/catalog";
import {
  analyzeBuild,
  getCandidateIssues,
  type Resolution,
  type Usage,
} from "./lib/compatibility";
import ProductArt from "./components/ProductArt";
import CatalogPanel from "./components/CatalogPanel";
import type { CameraView } from "./components/PcScene";
import { getCaseProfile } from "./data/visualProfiles";
import { pricingPolicy } from "./data/pricing";
const PcScene = lazy(() => import("./components/PcScene"));

type Selection = Record<CategoryId, string | null>;
type SavedBuild = {
  id: string;
  name: string;
  selection: Selection;
  resolution: Resolution;
  usage: Usage;
  savedAt: string;
};
const icons: Record<CategoryId, LucideIcon> = {
  cpu: Cpu,
  motherboard: CircuitBoard,
  gpu: Monitor,
  ram: MemoryStick,
  storage: HardDrive,
  cooler: Fan,
  psu: Zap,
  case: Box,
};
const money = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
const SELECTION_KEY = "forge-workbench-v1";
const BUILDS_KEY = "forge-builds-v1";
function safeSelection(value: unknown): Selection | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const result = { ...defaultSelection };
  for (const c of categories) {
    if (input[c.id] === null) result[c.id] = null;
    else if (
      typeof input[c.id] === "string" &&
      catalog.some((p) => p.id === input[c.id] && p.category === c.id)
    )
      result[c.id] = input[c.id] as string;
    else return null;
  }
  return result;
}
function readWorkspace() {
  try {
    const data = JSON.parse(localStorage.getItem(SELECTION_KEY) || "null");
    return data && safeSelection(data.selection) ? data : null;
  } catch {
    return null;
  }
}
function readBuilds(): SavedBuild[] {
  try {
    const data = JSON.parse(localStorage.getItem(BUILDS_KEY) || "[]");
    return Array.isArray(data)
      ? data
          .filter(
            (b) =>
              b &&
              typeof b.name === "string" &&
              typeof b.id === "string" &&
              typeof b.savedAt === "string" &&
              safeSelection(b.selection),
          )
          .map((b) => ({
            ...b,
            resolution: ["1080p", "1440p", "4k"].includes(b.resolution)
              ? b.resolution
              : "1440p",
            usage: ["gaming", "creation", "general"].includes(b.usage)
              ? b.usage
              : "gaming",
          }))
      : [];
  } catch {
    return [];
  }
}

function Dialog({
  children,
  onClose,
  title,
  wide = false,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  wide?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const scroll = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const firstInput =
      container.current?.querySelector<HTMLInputElement>("input");
    if (firstInput) firstInput.focus();
    else container.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const nodes = container.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === container.current)
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === container.current)
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = scroll;
      window.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal ${wide ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={container}
      >
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [initial] = useState(readWorkspace);
  const [selection, setSelection] = useState<Selection>(
    initial?.selection || defaultSelection,
  );
  const [resolution, setResolution] = useState<Resolution>(
    ["1080p", "1440p", "4k"].includes(initial?.resolution)
      ? initial.resolution
      : "1440p",
  );
  const [usage, setUsage] = useState<Usage>(
    ["gaming", "creation", "general"].includes(initial?.usage)
      ? initial.usage
      : "gaming",
  );
  const [buildName, setBuildName] = useState<string>(
    typeof initial?.name === "string" ? initial.name : "Mon setup idéal",
  );
  const [activeCategory, setActiveCategory] = useState<CategoryId>("case");
  const [catalogCategory, setCatalogCategory] = useState<CategoryId | null>(
    null,
  );
  const [detailProductId, setDetailProductId] = useState<string | null>(null);
  const [exploded, setExploded] = useState(false);
  const [openSide, setOpenSide] = useState(true);
  const [cameraView, setCameraView] = useState<CameraView>("perspective");
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [animated, setAnimated] = useState<boolean>(
    () => !reducedMotion && (typeof initial?.animated === "boolean" ? initial.animated : true),
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) setAnimated(false);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const [resetKey, setResetKey] = useState(0);
  const [fullView, setFullView] = useState(false);
  const [dialog, setDialog] = useState<
    "save" | "builds" | "guide" | "reset" | null
  >(null);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>(readBuilds);
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState<"components" | "analysis">(
    "components",
  );
  const [mobileNav, setMobileNav] = useState(false);
  const analysis = useMemo(
    () => analyzeBuild(selection, resolution, usage),
    [selection, resolution, usage],
  );
  const errors = analysis.warnings.filter((w) => w.severity === "error");
  const displayBalance = errors.length ? 0 : analysis.balance.score;
  const warningCount = analysis.warnings.filter(
    (w) => w.severity === "warning",
  ).length;
  const activeComponent = analysis.selected[activeCategory];
  const selectedCaseProfile = getCaseProfile(analysis.selected.case);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  function notify(text: string) {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4200);
  }
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    try {
      localStorage.setItem(
        SELECTION_KEY,
        JSON.stringify({ selection, resolution, usage, name: buildName, animated }),
      );
    } catch {
      /* Export remains available when browser storage is blocked. */
    }
  }, [selection, resolution, usage, buildName, animated]);
  const openCatalog = (category: CategoryId) => {
    setActiveCategory(category);
    setCatalogCategory(category);
    setDetailProductId(null);
  };
  const openProductDetails = (component: Component) => {
    setActiveCategory(component.category);
    setDetailProductId(component.id);
    setCatalogCategory(component.category);
  };
  const jumpTo = (section: "studio" | "components" | "analysis") => {
    if (section !== "studio") setActiveTab(section);
    setMobileNav(false);
    requestAnimationFrame(() => {
      document.getElementById(section === "studio" ? "studio" : "components")
        ?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
  };
  const choose = (component: Component) => {
    setSelection((s) => ({ ...s, [component.category]: component.id }));
    setActiveCategory(component.category);
    setCatalogCategory(null);
    notify(`${component.name} ajouté à votre configuration`);
  };
  function saveBuild() {
    if (!buildName.trim()) return;
    const build: SavedBuild = {
      id:
        globalThis.crypto?.randomUUID?.() ??
        `build-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: buildName.trim(),
      selection: { ...selection },
      resolution,
      usage,
      savedAt: new Date().toISOString(),
    };
    const next = [build, ...savedBuilds];
    try {
      localStorage.setItem(BUILDS_KEY, JSON.stringify(next));
      setSavedBuilds(next);
      setDialog(null);
      notify("Configuration enregistrée dans ce navigateur");
    } catch {
      notify(
        "Enregistrement indisponible. Utilisez l’export pour conserver votre configuration.",
      );
    }
  }
  function removeSaved(id: string) {
    const next = savedBuilds.filter((b) => b.id !== id);
    try {
      localStorage.setItem(BUILDS_KEY, JSON.stringify(next));
      setSavedBuilds(next);
    } catch {
      notify("Impossible de modifier le stockage du navigateur.");
    }
  }
  function exportBuild() {
    const lines = [
      "FORGE — " + buildName,
      `Usage : ${usage} · Résolution : ${resolution}`,
      "",
      ...categories.map(
        (c) =>
          `${c.label} : ${analysis.selected[c.id]?.name || "Non sélectionné"}${analysis.selected[c.id] ? " — " + money(analysis.selected[c.id]!.price) : ""}`,
      ),
      "",
      `Total indicatif : ${money(analysis.total)}`,
      `Consommation estimée : ${analysis.power.estimated} W`,
      "",
      "Compatibilité : " + statusText,
      ...analysis.warnings.map((w) => `${w.title} : ${w.description}`),
      "",
      "Équilibre : " + analysis.balance.description,
      "",
      pricingPolicy.description,
      "Analyse basée sur les spécifications du catalogue et des estimations ; vérifier les fiches fabricants, versions BIOS et connecteurs avant achat.",
    ];
    const url = URL.createObjectURL(
      new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `forge-${buildName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "configuration"}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Récapitulatif de la configuration exporté");
  }
  const statusText = errors.length
    ? `${errors.length} incompatibilité${errors.length > 1 ? "s" : ""}`
    : analysis.selectedCount < 8
      ? "Configuration à compléter"
      : warningCount
        ? `${warningCount} point${warningCount > 1 ? "s" : ""} à vérifier`
        : "Tout est compatible";

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "nav-open" : ""}`}>
        <a
          className="brand"
          href="#"
          aria-label="FORGE accueil"
          onClick={(e) => {
            e.preventDefault();
            setDialog(null);
            setMobileNav(false);
          }}
        >
          <span className="brand-icon">
            <Box size={25} strokeWidth={2.2} />
          </span>
          <span>
            FORGE<span className="brand-dot">.</span>
          </span>
        </a>
        <div className="sidebar-caption">VOTRE ESPACE</div>
        <nav className="main-nav" aria-label="Navigation principale">
          <button
            className="nav-item selected"
            onClick={() => {
              setDialog(null);
              jumpTo("studio");
            }}
          >
            <LayoutGrid size={18} />
            Configurateur
            <span className="active-dot" />
          </button>
          <button
            className="nav-item"
            onClick={() => {
              openCatalog(activeCategory);
              setMobileNav(false);
            }}
          >
            <CircuitBoard size={18} />
            Catalogue
            <span className="nav-count">{catalog.length}</span>
          </button>
          <button
            className="nav-item"
            onClick={() => {
              setDialog("builds");
              setMobileNav(false);
            }}
          >
            <FolderOpen size={18} />
            Mes configurations
            {savedBuilds.length > 0 && (
              <span className="nav-count">{savedBuilds.length}</span>
            )}
          </button>
          <button
            className="nav-item"
            onClick={() => {
              setDialog("guide");
              setMobileNav(false);
            }}
          >
            <BookOpen size={18} />
            Le guide du builder
            <ArrowUpRight size={14} className="nav-arrow" />
          </button>
        </nav>
        <div className="sidebar-build">
          <span className="tiny-label">CONFIGURATION EN COURS</span>
          <div className="sidebar-build-name">
            <span className="small-status-dot" />
            {buildName}
          </div>
          <div className="progress-track">
            <span style={{ width: `${(analysis.selectedCount / 8) * 100}%` }} />
          </div>
          <div className="progress-label">
            <span>{analysis.selectedCount} sur 8 composants</span>
            <span>{Math.round((analysis.selectedCount / 8) * 100)} %</span>
          </div>
        </div>
        <div className="sidebar-bottom">
          <div className="help-box">
            <div className="help-icon">
              <Sparkles size={19} />
            </div>
            <h3>
              Un bon PC commence
              <br />
              par les bons choix.
            </h3>
            <p>
              Comprenez vos composants.
              <br />
              Construisez en confiance.
            </p>
            <button onClick={() => setDialog("guide")}>
              Quelques conseils <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="local-profile">
            <div className="avatar">N</div>
            <div>
              <strong>Mon espace</strong>
              <span>Sauvegarde locale</span>
            </div>
            <span className="online-dot" />
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu icon-button"
              aria-label="Ouvrir le menu"
              onClick={() => setMobileNav(!mobileNav)}
            >
              <Menu size={21} />
            </button>
            <span>Atelier</span>
            <ChevronRight size={13} />
            <strong>Configurateur PC</strong>
          </div>
          <div className="topbar-right">
            <span className="live-status">
              <span />
              Tous les détails font la différence.
            </span>
            <span className="version">STUDIO 3.1</span>
          </div>
        </header>
        <main>
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                <span />
                IMAGINEZ. ASSEMBLEZ. JOUEZ.
              </div>
              <h1>
                Votre PC. <span>Vos règles.</span>
              </h1>
              <p>Choisissez vos composants. Regardez votre PC prendre forme.</p>
            </div>
            <div className="heading-actions">
              <button
                className="button button-secondary"
                onClick={() => setDialog("builds")}
              >
                <FolderOpen size={16} />
                Mes configurations
              </button>
              <button
                className="button button-accent"
                onClick={() => setDialog("save")}
              >
                <Save size={16} />
                Enregistrer
                <ArrowUpRight size={15} className="button-key" />
              </button>
            </div>
          </section>
          <section className="build-toolbar">
            <div className="build-title">
              <span className="build-mark">
                <Box size={19} />
              </span>
              <div>
                <span className="tiny-label">VOTRE CONFIGURATION</span>
                <strong>{buildName}</strong>
              </div>
              <button
                className="icon-button edit-name"
                title="Renommer et enregistrer"
                aria-label="Renommer la configuration"
                onClick={() => setDialog("save")}
              >
                <SlidersHorizontal size={15} />
              </button>
            </div>
            <div className="build-context">
              <label>
                Utilisation
                <select
                  aria-label="Utilisation"
                  value={usage}
                  onChange={(e) => setUsage(e.target.value as Usage)}
                >
                  <option value="gaming">Gaming</option>
                  <option value="creation">Création</option>
                  <option value="general">Polyvalent</option>
                </select>
                <ChevronDown size={12} />
              </label>
              <span className="toolbar-divider" />
              <div className="resolution-switch" aria-label="Résolution cible">
                {(["1080p", "1440p", "4k"] as Resolution[]).map((r) => (
                  <button
                    key={r}
                    aria-pressed={resolution === r}
                    className={resolution === r ? "active" : ""}
                    onClick={() => setResolution(r)}
                  >
                    {r === "4k" ? "4K" : r}
                  </button>
                ))}
              </div>
            </div>
          </section>
          <nav className="builder-navigation" aria-label="Parcourir la configuration">
            <div className="builder-navigation-steps">
              <button onClick={() => jumpTo("studio")}><Box size={16} /><span>Aperçu 3D</span></button>
              <button onClick={() => jumpTo("components")}><Cpu size={16} /><span>Composants</span><small>{analysis.selectedCount}/8</small></button>
              <button onClick={() => jumpTo("analysis")}><ShieldCheck size={16} /><span>Analyse</span>{errors.length > 0 && <small className="navigation-alert">{errors.length}</small>}</button>
            </div>
            <button className="browse-catalog" onClick={() => openCatalog(activeCategory)}>
              <LayoutGrid size={16} /> Catalogue <span>{catalog.length} références</span><ArrowUpRight size={15} />
            </button>
          </nav>
          <div className="builder-layout">
            <section className="builder-main">
              <div className="studio-header" id="studio">
                <div>
                  <span className="studio-eyebrow">VOTRE ATELIER 3D</span>
                  <button
                    className="studio-case-title"
                    onClick={() => openCatalog("case")}
                  >
                    {analysis.selected.case?.name || "Choisir un boîtier"}
                    <ChevronDown size={15} />
                  </button>
                </div>
                <button
                  className="studio-change-case"
                  onClick={() => openCatalog("case")}
                >
                  <Box size={15} />
                  Changer de boîtier
                  <ArrowUpRight size={13} />
                </button>
              </div>
              <div className="visualizer studio-visualizer">
                <div className="studio-view-toolbar">
                  <div className="camera-presets" aria-label="Angle de vue">
                    {(
                      [
                        {
                          id: "perspective",
                          label: "3/4",
                          aria: "Vue trois quarts",
                        },
                        { id: "side", label: "Profil", aria: "Vue de profil" },
                        { id: "front", label: "Face", aria: "Vue de face" },
                      ] as const
                    ).map((view) => (
                      <button
                        key={view.id}
                        aria-label={view.aria}
                        aria-pressed={cameraView === view.id}
                        className={cameraView === view.id ? "active" : ""}
                        onClick={() => setCameraView(view.id)}
                      >
                        {view.label}
                      </button>
                    ))}
                  </div>
                  <button
                    className={`animation-toggle ${animated ? "active" : ""}`}
                    aria-label={reducedMotion ? "Animations désactivées : mouvement réduit" : animated ? "Mettre les animations en pause" : "Activer les animations"}
                    aria-pressed={animated}
                    disabled={reducedMotion}
                    title={reducedMotion ? "Le mouvement réduit est activé dans vos préférences système" : "Rotation automatique, ventilateurs et éclairages RGB"}
                    onClick={() => setAnimated(!animated)}
                  >
                    {animated ? <Pause size={14} /> : <Play size={14} />}
                    <span>{animated ? "Animations" : "En pause"}</span>
                  </button>
                  <button
                    className={`interior-toggle ${openSide ? "active" : ""}`}
                    aria-pressed={openSide}
                    onClick={() => setOpenSide(!openSide)}
                  >
                    <Layers3 size={14} />
                    {openSide ? "Intérieur visible" : "Voir l’intérieur"}
                  </button>
                </div>
                <div className="scene-wrap">
                  <Suspense
                    fallback={
                      <div className="scene-loading">
                        <Box size={36} />
                        <span>Votre configuration prend forme…</span>
                      </div>
                    }
                  >
                    <PcScene
                      components={analysis.selected}
                      paused={fullView || !!catalogCategory || !!dialog}
                      animated={animated}
                      exploded={exploded}
                      openSide={openSide}
                      cameraView={cameraView}
                      activeCategory={activeCategory}
                      onSelectCategory={setActiveCategory}
                      resetKey={resetKey}
                    />
                  </Suspense>
                </div>
                <div className="studio-model-meta">
                  <span className="small-status-dot" />
                  {selectedCaseProfile
                    ? `${selectedCaseProfile.widthMm} × ${selectedCaseProfile.heightMm} × ${selectedCaseProfile.depthMm} mm`
                    : "Assemblage libre"}
                  <span>Reconstitution 3D</span>
                </div>
                <div className="viewer-bottom">
                  <span className="rotate-hint">
                    <MousePointer2 size={14} />
                    <span>
                      Survolez pour identifier
                      <br />
                      <small>Glissez pour orienter · Molette pour zoomer</small>
                    </span>
                  </span>
                  <div className="viewer-controls">
                    <button
                      title="Recentrer la vue"
                      aria-label="Recentrer la vue"
                      onClick={() => setResetKey((k) => k + 1)}
                    >
                      <RotateCcw size={16} />
                    </button>
                    <span />
                    <button
                      className={exploded ? "active" : ""}
                      title="Vue éclatée"
                      aria-label="Vue éclatée"
                      aria-pressed={exploded}
                      onClick={() => setExploded(!exploded)}
                    >
                      <Layers3 size={16} />
                      <span>Vue éclatée</span>
                    </button>
                    <span />
                    <button
                      title="Agrandir la vue 3D"
                      aria-label="Agrandir la vue 3D"
                      onClick={() => setFullView(true)}
                    >
                      <Expand size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="scene-part-shortcuts"
                aria-label="Repérer un composant dans la tour"
              >
                {categories.map((category) => {
                  const Icon = icons[category.id];
                  return (
                    <button
                      key={category.id}
                      aria-pressed={activeCategory === category.id}
                      className={activeCategory === category.id ? "active" : ""}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <Icon size={14} />
                      {category.shortLabel}
                    </button>
                  );
                })}
              </div>
              <div className="scene-selection-bar">
                <div className="selected-part-art">
                  <ProductArt
                    category={activeCategory}
                    brand={activeComponent?.brand}
                    component={activeComponent}
                  />
                </div>
                <div className="selected-part-copy">
                  <span>
                    {categories.find((c) => c.id === activeCategory)?.label}
                  </span>
                  <strong>
                    {activeComponent?.name || "Emplacement disponible"}
                  </strong>
                  <small>
                    {activeComponent?.specs.slice(0, 2).join(" · ") ||
                      "Ajoutez ce composant à votre PC"}
                  </small>
                </div>
                <div className="selected-detail-actions">
                  {activeComponent && (
                    <button className="selected-detail-link" onClick={() => openProductDetails(activeComponent)}>
                      <Info size={14} /> Fiche détaillée
                    </button>
                  )}
                  <button className="button button-secondary" onClick={() => openCatalog(activeCategory)}>
                    {activeComponent ? "Modifier" : "Choisir"}<ArrowRight size={14} />
                  </button>
                </div>
              </div>
              <div
                className={`compatibility-banner ${errors.length ? "has-error" : warningCount ? "has-warning" : ""}`}
              >
                <div className="compatibility-icon">
                  {errors.length || warningCount ? (
                    <TriangleAlert size={19} />
                  ) : (
                    <ShieldCheck size={20} />
                  )}
                </div>
                <div>
                  <strong>{statusText}</strong>
                  <p>
                    {errors.length
                      ? "Certains composants ne peuvent pas fonctionner ensemble."
                      : warningCount
                        ? "Quelques vérifications vous aideront à finaliser ce build."
                        : analysis.selectedCount < 8
                          ? "Ajoutez les composants manquants pour terminer votre build."
                          : "Vos composants sont faits pour fonctionner ensemble."}
                  </p>
                </div>
                <button onClick={() => jumpTo("analysis")}>
                  Voir l’analyse <ArrowRight size={16} />
                </button>
              </div>
              <section className="parts-section" id="components">
                <div className="parts-header">
                  <div className="section-tabs">
                    <button
                      className={activeTab === "components" ? "active" : ""}
                      onClick={() => setActiveTab("components")}
                    >
                      Les composants <span>{analysis.selectedCount}</span>
                    </button>
                    <button
                      className={activeTab === "analysis" ? "active" : ""}
                      onClick={() => setActiveTab("analysis")}
                    >
                      Analyse détaillée
                      {errors.length > 0 && (
                        <span className="error-badge">{errors.length}</span>
                      )}
                    </button>
                  </div>
                  <button
                    className="text-button reset-button"
                    onClick={() => setDialog("reset")}
                  >
                    <RefreshCw size={13} />
                    Réinitialiser
                  </button>
                </div>
                {activeTab === "components" ? (
                  <div className="parts-grid">
                    {categories.map((category, index) => {
                      const component = analysis.selected[category.id];
                      const Icon = icons[category.id];
                      const issue = component
                        ? getCandidateIssues(
                            selection,
                            component,
                            resolution,
                            usage,
                          ).length > 0
                        : false;
                      return (
                        <article
                          className={`part-card ${activeCategory === category.id ? "part-active" : ""} ${issue ? "part-error" : ""}`}
                          key={category.id}
                        >
                          <div className="part-card-heading">
                            <span>
                              <Icon size={14} />
                              {category.label}
                            </span>
                            <span className="part-number">0{index + 1}</span>
                          </div>
                          <button
                            className="part-select"
                            onClick={() => openCatalog(category.id)}
                            aria-label={`Choisir ${category.label}`}
                          >
                            <div className="part-art">
                              <ProductArt
                                category={category.id}
                                brand={component?.brand}
                                component={component}
                              />
                            </div>
                            <div className="part-copy">
                              {component ? (
                                <>
                                  <span className="part-brand">
                                    {component.brand}
                                  </span>
                                  <h3>{component.name}</h3>
                                  <span className="part-spec">
                                    {component.specs.slice(0, 2).join(" · ")}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <h3>À vous de choisir</h3>
                                  <span className="part-spec">
                                    Ajouter un composant
                                  </span>
                                </>
                              )}
                            </div>
                          </button>
                          <div className="part-card-footer">
                            <span
                              className={issue ? "part-issue" : "part-check"}
                            >
                              {component ? (
                                issue ? (
                                  <>
                                    <TriangleAlert size={12} />
                                    Incompatible
                                  </>
                                ) : (
                                  <Check size={13} />
                                )
                              ) : (
                                <Plus size={13} />
                              )}
                            </span>
                            <strong>
                              {component ? money(component.price) : "—"}
                            </strong>
                            {component && (
                              <button
                                className="part-detail-button"
                                onClick={() => openProductDetails(component)}
                                aria-label={`Détails de ${component.name}`}
                                title="Voir la fiche technique"
                              >
                                <Info size={14} /><span>Détails</span>
                              </button>
                            )}
                            <button
                              className="part-change"
                              onClick={() => openCatalog(category.id)}
                              aria-label={`Modifier ${category.label}`}
                            >
                              <RefreshCw size={12} />
                              {component ? "Modifier" : "Choisir"}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="analysis-details">
                    <div className="detail-heading">
                      <ShieldCheck size={22} />
                      <div>
                        <h3>Une configuration qui tient la route.</h3>
                        <p>
                          Contrôles sur les spécifications des composants
                          sélectionnés.
                        </p>
                      </div>
                    </div>
                    {analysis.warnings.length ? (
                      analysis.warnings.map((w) => (
                        <div
                          key={w.id}
                          className={`analysis-issue ${w.severity}`}
                        >
                          <span>
                            {w.severity === "error" ? (
                              <X size={17} />
                            ) : w.severity === "warning" ? (
                              <TriangleAlert size={17} />
                            ) : (
                              <Info size={17} />
                            )}
                          </span>
                          <div>
                            <strong>{w.title}</strong>
                            <p>{w.description}</p>
                            {w.category && (
                              <button
                                className="text-button"
                                onClick={() => openCatalog(w.category!)}
                              >
                                Voir les alternatives <ArrowRight size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="analysis-issue success">
                        <CheckCheck size={20} />
                        <div>
                          <strong>Aucune incompatibilité détectée</strong>
                          <p>
                            Socket, mémoire, format, dimensions et puissance :
                            les spécifications vérifiées concordent.
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="detail-recommendations">
                      <h3>
                        <Sparkles size={17} />
                        Vos pistes d’amélioration
                      </h3>
                      {analysis.recommendations.map((recommendation) => (
                        <div
                          className="detail-recommendation"
                          key={recommendation.id}
                        >
                          <div>
                            <strong>{recommendation.title}</strong>
                            <p>{recommendation.description}</p>
                          </div>
                          <button
                            className="text-button"
                            onClick={() => openCatalog(recommendation.category)}
                          >
                            Explorer <ArrowUpRight size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="method-note">
                      <Info size={15} />
                      <p>
                        Vérifiez toujours la version du BIOS, les connecteurs,
                        le kit de montage et les fiches fabricants avant
                        l’achat. La tour 3D illustre l’assemblage et ne
                        reproduit pas les modèles exacts. Les dimensions sont
                        contrôlées selon notre catalogue ; les combinaisons de
                        radiateurs et de ventilateurs peuvent réduire l’espace
                        disponible.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </section>
            <aside className="insights-column">
              <section className="insight-card balance-card">
                <div className="card-heading">
                  <span>
                    <Gauge size={17} />
                    L’équilibre de votre PC
                  </span>
                  <button
                    className="icon-button"
                    aria-label="Comprendre l’analyse de performance"
                    onClick={() => setDialog("guide")}
                  >
                    <Info size={15} />
                  </button>
                </div>
                <div className="balance-visual">
                  <svg
                    viewBox="0 0 220 132"
                    role="img"
                    aria-label={
                      errors.length
                        ? "Analyse suspendue : composants incompatibles"
                        : `Indice d’équilibre estimé : ${displayBalance} sur 100`
                    }
                  >
                    <defs>
                      <linearGradient id="gauge-gradient">
                        <stop offset="0%" stopColor="#5d8151" />
                        <stop offset="100%" stopColor="#b3f472" />
                      </linearGradient>
                    </defs>
                    <path
                      className="gauge-bg"
                      d="M 24 112 A 86 86 0 0 1 196 112"
                      pathLength="100"
                    />
                    <path
                      className="gauge-value"
                      d="M 24 112 A 86 86 0 0 1 196 112"
                      pathLength="100"
                      strokeDasharray={`${displayBalance} 100`}
                    />
                    <text
                      x="110"
                      y="91"
                      textAnchor="middle"
                      className="gauge-number"
                    >
                      {errors.length ? "—" : displayBalance}
                      <tspan className="gauge-denominator">/100</tspan>
                    </text>
                    <text
                      x="110"
                      y="116"
                      textAnchor="middle"
                      className="gauge-label"
                    >
                      INDICE D’ÉQUILIBRE
                    </text>
                  </svg>
                  <span
                    className={`balance-badge ${errors.length || analysis.balance.limiter === "unknown" ? "neutral" : ""}`}
                  >
                    <span />
                    {errors.length
                      ? "Assemblage incompatible"
                      : analysis.balance.label}
                  </span>
                </div>
                <p className="balance-description">
                  {errors.length
                    ? "Corrigez les incompatibilités pour évaluer l’équilibre de votre PC. Cet assemblage ne peut pas fonctionner tel quel."
                    : analysis.balance.description}
                </p>
                <div className="balance-bars">
                  <div>
                    <span>
                      <Cpu size={13} />
                      Processeur
                    </span>
                    <b>
                      {analysis.balance.cpu}
                      <small> / 100</small>
                    </b>
                  </div>
                  <div className="mini-bar">
                    <span style={{ width: `${analysis.balance.cpu}%` }} />
                  </div>
                  <div>
                    <span>
                      <Monitor size={13} />
                      Carte graphique
                    </span>
                    <b>
                      {analysis.balance.gpu}
                      <small> / 100</small>
                    </b>
                  </div>
                  <div className="mini-bar gpu-bar">
                    <span style={{ width: `${analysis.balance.gpu}%` }} />
                  </div>
                </div>
                <div className="estimated-note">
                  <Info size={12} />
                  Estimation pour{" "}
                  {usage === "gaming"
                    ? "le gaming"
                    : usage === "creation"
                      ? "la création"
                      : "un usage polyvalent"}{" "}
                  en {resolution === "4k" ? "4K" : resolution}.<br />
                  Indice relatif, pas un benchmark.
                </div>
              </section>
              <section className="insight-card power-card">
                <div className="card-heading">
                  <span>
                    <Zap size={17} />
                    La puissance, maîtrisée
                  </span>
                </div>
                <div className="power-values">
                  <div>
                    <strong>
                      {analysis.power.estimated}
                      <span> W</span>
                    </strong>
                    <small>consommation estimée</small>
                  </div>
                  <span className="power-divider">/</span>
                  <div className="power-capacity">
                    <strong>
                      {analysis.power.capacity || "—"}
                      <span> W</span>
                    </strong>
                    <small>alimentation choisie</small>
                  </div>
                </div>
                <div
                  className={`power-track ${analysis.power.capacity < analysis.power.recommended ? "power-low" : ""}`}
                >
                  <span
                    style={{
                      width: `${Math.min(100, analysis.power.capacity ? (analysis.power.estimated / analysis.power.capacity) * 100 : 0)}%`,
                    }}
                  />
                </div>
                <div className="power-foot">
                  <span>
                    {analysis.power.capacity >= analysis.power.recommended ? (
                      <>
                        <Check size={12} />
                        Une marge confortable
                      </>
                    ) : (
                      <>
                        <TriangleAlert size={12} />
                        Puissance à vérifier
                      </>
                    )}
                  </span>
                  <b>{analysis.power.recommended} W conseillés</b>
                </div>
              </section>
              <section className="recommendation-card">
                <div className="card-heading">
                  <span>
                    <Sparkles size={17} />
                    Le conseil FORGE
                  </span>
                  <span className="ai-tag">POUR VOUS</span>
                </div>
                {analysis.recommendations.length ? (
                  <>
                    <h3>{analysis.recommendations[0].title}</h3>
                    <p>{analysis.recommendations[0].description}</p>
                    <button
                      onClick={() =>
                        openCatalog(analysis.recommendations[0].category)
                      }
                    >
                      Explorer les options <ArrowUpRight size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <h3>
                      {analysis.selectedCount < 8
                        ? "Votre prochain choix compte."
                        : "Un duo qui fait la différence."}
                    </h3>
                    <p>
                      {analysis.selectedCount < 8
                        ? "Complétez les emplacements libres pour obtenir une analyse de l’ensemble de votre configuration."
                        : "Votre processeur et votre carte graphique sont bien associés pour votre usage. Gardez cet équilibre pour vos prochaines évolutions."}
                    </p>
                    <button onClick={() => setDialog("guide")}>
                      Comprendre mon build <ArrowUpRight size={14} />
                    </button>
                  </>
                )}
              </section>
              <section className="total-card">
                <div className="total-label">
                  <span>Votre configuration</span>
                  <span>{analysis.selectedCount} composants</span>
                </div>
                <div className="total-price">
                  {money(analysis.total)}
                  <span>estimés*</span>
                </div>
                <div className="total-status">
                  {errors.length ? (
                    <TriangleAlert size={13} />
                  ) : (
                    <CheckCheck size={14} />
                  )}
                  <span>{statusText}</span>
                </div>
                <button
                  className="button button-accent export-button"
                  onClick={exportBuild}
                >
                  <Download size={16} />
                  Exporter ma configuration
                  <ArrowUpRight size={16} />
                </button>
                <p>
                  * Prix indicatifs hors livraison, non vérifiés auprès des marchands.
                  <br />
                  Aucun achat n’est effectué sur FORGE.
                </p>
              </section>
            </aside>
          </div>
          <footer className="page-footer">
            <span>
              <Box size={14} />
              Pensé pour les passionnés. Construit par vous.
            </span>
            <span>
              Votre prochaine aventure commence ici.
              <span className="footer-dot" />
            </span>
          </footer>
        </main>
      </div>
      <div className="mobile-build-summary">
        <div>
          <span>Total estimé</span>
          <strong>{money(analysis.total)}</strong>
        </div>
        <button
          className="button button-secondary"
          onClick={() => jumpTo("components")}
        >
          <LayoutGrid size={15} />
          Composants
        </button>
        <button
          className="button button-accent"
          aria-label="Enregistrer ce build"
          onClick={() => setDialog("save")}
        >
          <Save size={17} />
        </button>
      </div>
      {toast && (
        <div className="toast" role="status">
          <span>
            <Check size={16} />
          </span>
          {toast}
          <button
            aria-label="Fermer la notification"
            onClick={() => setToast("")}
          >
            <X size={14} />
          </button>
        </div>
      )}
      {catalogCategory && (
        <Dialog
          wide
          title={`Choisir ${categories.find((c) => c.id === catalogCategory)?.label}`}
          onClose={() => setCatalogCategory(null)}
        >
          <CatalogPanel
            category={catalogCategory}
            selection={selection}
            resolution={resolution}
            usage={usage}
            initialProductId={detailProductId}
            onCategoryChange={(category) => {
              setCatalogCategory(category);
              setDetailProductId(null);
            }}
            onChoose={choose}
            onRemove={(category) => {
              setSelection((current) => ({ ...current, [category]: null }));
              setCatalogCategory(null);
              notify("Composant retiré de votre configuration");
            }}
            onClose={() => setCatalogCategory(null)}
          />
        </Dialog>
      )}
      {dialog === "save" && (
        <Dialog
          title="Enregistrer la configuration"
          onClose={() => setDialog(null)}
        >
          <div className="modal-header">
            <div>
              <span className="eyebrow">GARDEZ VOS BONNES IDÉES</span>
              <h2>Un nom pour votre build.</h2>
            </div>
            <button
              className="icon-button close-button"
              aria-label="Fermer"
              onClick={() => setDialog(null)}
            >
              <X size={21} />
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveBuild();
            }}
          >
            <label className="form-label">
              Nom de la configuration
              <input
                autoFocus
                value={buildName}
                maxLength={50}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder="Mon setup idéal"
                required
              />
            </label>
            <div className="save-summary">
              <Box size={22} />
              <div>
                <strong>
                  {analysis.selectedCount} composants sélectionnés
                </strong>
                <span>
                  {money(analysis.total)} ·{" "}
                  {resolution === "4k" ? "4K" : resolution}
                </span>
              </div>
              <ShieldCheck size={19} />
            </div>
            <p className="storage-note">
              Cette configuration sera enregistrée dans ce navigateur.
              Exportez-la pour la conserver sur un autre appareil.
            </p>
            <button
              type="submit"
              className="button button-accent full-width"
              disabled={!buildName.trim()}
            >
              <Save size={16} />
              Enregistrer ma configuration
            </button>
          </form>
        </Dialog>
      )}
      {dialog === "builds" && (
        <Dialog title="Mes configurations" onClose={() => setDialog(null)}>
          <div className="modal-header">
            <div>
              <span className="eyebrow">VOTRE COLLECTION</span>
              <h2>
                Mes configurations
                <span className="title-count">{savedBuilds.length}</span>
              </h2>
              <p>Vos idées, prêtes à reprendre vie.</p>
            </div>
            <button
              className="icon-button close-button"
              aria-label="Fermer"
              onClick={() => setDialog(null)}
            >
              <X size={21} />
            </button>
          </div>
          {savedBuilds.length ? (
            <div className="saved-list">
              {savedBuilds.map((build) => (
                <div className="saved-build" key={build.id}>
                  <div className="saved-icon">
                    <Box size={24} />
                  </div>
                  <div className="saved-info">
                    <h3>{build.name}</h3>
                    <p>
                      {money(
                        analyzeBuild(
                          build.selection,
                          build.resolution,
                          build.usage,
                        ).total,
                      )}{" "}
                      · {new Date(build.savedAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <button
                    className="button button-secondary"
                    onClick={() => {
                      setSelection(build.selection);
                      setResolution(build.resolution);
                      setUsage(build.usage);
                      setBuildName(build.name);
                      setDialog(null);
                      notify("Configuration chargée");
                    }}
                  >
                    Charger
                  </button>
                  <button
                    className="icon-button delete-button"
                    aria-label={`Supprimer ${build.name}`}
                    onClick={() => removeSaved(build.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FolderOpen size={38} />
              <h3>Chaque grand build commence ici.</h3>
              <p>
                Enregistrez votre première configuration pour la retrouver plus
                tard.
              </p>
              <button
                className="button button-accent"
                onClick={() => setDialog("save")}
              >
                <Plus size={16} />
                Enregistrer mon build
              </button>
            </div>
          )}
          <p className="storage-note">
            Conservées uniquement dans ce navigateur, sans compte ni
            synchronisation.
          </p>
        </Dialog>
      )}
      {dialog === "guide" && (
        <Dialog title="Le guide du builder" onClose={() => setDialog(null)}>
          <div className="modal-header">
            <div>
              <span className="eyebrow">LE GUIDE DU BUILDER</span>
              <h2>
                Les bons choix.
                <br />
                Le bon équilibre.
              </h2>
            </div>
            <button
              className="icon-button close-button"
              aria-label="Fermer"
              onClick={() => setDialog(null)}
            >
              <X size={21} />
            </button>
          </div>
          <div className="guide-items">
            {[
              {
                icon: Cpu,
                title: "Commencez par votre utilisation.",
                text: "En gaming, le duo processeur–carte graphique est essentiel. Pour la création, privilégiez aussi les cœurs du processeur, la mémoire et les besoins de vos logiciels.",
              },
              {
                icon: CircuitBoard,
                title: "Une plateforme compatible.",
                text: "Le socket du processeur doit correspondre à la carte mère. Une carte DDR5 n’accepte pas de DDR4. Vérifiez aussi la version du BIOS nécessaire au processeur.",
              },
              {
                icon: Gauge,
                title: "Un équilibre, pas une promesse de FPS.",
                text: "Notre indice compare des niveaux de performance indicatifs. Il estime le composant le plus susceptible de limiter votre usage, sans mesurer un pourcentage réel de bridage. Un score élevé peut aussi concerner deux composants modestes. La 4K sollicite davantage la carte graphique ; les jeux compétitifs à très haut débit sollicitent le CPU.",
              },
              {
                icon: Zap,
                title: "De la place et de la puissance.",
                text: "Gardez une marge sur l’alimentation pour les pics de consommation. Comparez la longueur de la carte graphique, le format de la carte mère et la hauteur du ventirad avec votre boîtier.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div className="guide-item" key={title}>
                <span>
                  <Icon size={21} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="button button-accent full-width"
            onClick={() => setDialog(null)}
          >
            À moi de construire <ArrowRight size={16} />
          </button>
        </Dialog>
      )}
      {dialog === "reset" && (
        <Dialog
          title="Réinitialiser la configuration"
          onClose={() => setDialog(null)}
        >
          <div className="modal-header">
            <div>
              <span className="eyebrow">UN NOUVEAU DÉPART</span>
              <h2>On repart de zéro ?</h2>
            </div>
            <button
              className="icon-button close-button"
              aria-label="Fermer"
              onClick={() => setDialog(null)}
            >
              <X size={21} />
            </button>
          </div>
          <p className="dialog-text">
            Retrouvez notre configuration de départ, équilibrée pour le gaming
            en 1440p. Vos configurations enregistrées seront conservées.
          </p>
          <div className="dialog-actions">
            <button
              className="button button-secondary"
              onClick={() => setDialog(null)}
            >
              Garder mon build
            </button>
            <button
              className="button button-accent"
              onClick={() => {
                setSelection({ ...defaultSelection });
                setResolution("1440p");
                setUsage("gaming");
                setBuildName("Mon setup idéal");
                setDialog(null);
                notify("Configuration de départ restaurée");
              }}
            >
              <RefreshCw size={15} />
              Réinitialiser
            </button>
          </div>
        </Dialog>
      )}
      {fullView && (
        <Dialog wide title="Votre PC en 3D" onClose={() => setFullView(false)}>
          <div className="modal-header">
            <div>
              <span className="eyebrow">VOTRE BUILD EN 3D</span>
              <h2>{buildName}</h2>
            </div>
            <button
              className="icon-button close-button"
              aria-label="Fermer la vue agrandie"
              onClick={() => setFullView(false)}
            >
              <X size={21} />
            </button>
          </div>
          <div className="full-scene">
            <Suspense
              fallback={<div className="scene-loading">Chargement…</div>}
            >
              <PcScene
                exploded={exploded}
                animated={animated}
                components={analysis.selected}
                openSide={openSide}
                cameraView={cameraView}
                activeCategory={activeCategory}
                resetKey={resetKey}
                onSelectCategory={(id) => setActiveCategory(id as CategoryId)}
              />
            </Suspense>
          </div>
          <div className="full-scene-controls">
            <button
              className="button button-secondary"
              aria-label={reducedMotion ? "Animations désactivées : mouvement réduit" : animated ? "Mettre les animations en pause" : "Activer les animations"}
              aria-pressed={animated}
              disabled={reducedMotion}
              title={reducedMotion ? "Le mouvement réduit est activé dans vos préférences système" : undefined}
              onClick={() => setAnimated(!animated)}
            >
              {animated ? <Pause size={16} /> : <Play size={16} />}
              {animated ? "Mettre en pause" : "Animer la tour"}
            </button>
            <button
              className="button button-secondary"
              aria-pressed={openSide}
              onClick={() => setOpenSide(!openSide)}
            >
              <Layers3 size={16} />
              {openSide ? "Fermer le panneau" : "Voir l’intérieur"}
            </button>
            <button
              className="button button-secondary"
              onClick={() => setExploded(!exploded)}
            >
              <Layers3 size={16} />
              {exploded ? "Assembler" : "Vue éclatée"}
            </button>
            <button
              className="button button-secondary"
              onClick={() => setResetKey((k) => k + 1)}
            >
              <Crosshair size={16} />
              Recentrer
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
