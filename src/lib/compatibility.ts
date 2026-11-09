import { catalog, categories, getComponent } from "../data/catalog.ts";
import type { CategoryId, Component, Selection } from "../data/catalog.ts";

export type Resolution = "1080p" | "1440p" | "4k";
export type Usage = "gaming" | "creation" | "general";
export interface CompatibilityWarning {
  id: string;
  severity: "error" | "warning" | "info";
  title: string;
  description: string;
  category?: CategoryId;
}
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  componentId?: string;
}
export interface BuildAnalysis {
  selected: Record<CategoryId, Component | undefined>;
  total: number;
  selectedCount: number;
  status: "compatible" | "warning" | "incompatible" | "incomplete";
  warnings: CompatibilityWarning[];
  power: {
    estimated: number;
    recommended: number;
    capacity: number;
    headroom: number;
  };
  balance: {
    score: number;
    cpu: number;
    gpu: number;
    label: string;
    limiter: "cpu" | "gpu" | "balanced" | "unknown";
    description: string;
  };
  recommendations: Recommendation[];
}

export function analyzeBuild(
  selection: Selection,
  resolution: Resolution = "1440p",
  usage: Usage = "gaming",
): BuildAnalysis {
  const selected = Object.fromEntries(
    categories.map(({ id }) => {
      const component = getComponent(selection[id]);
      return [id, component?.category === id ? component : undefined];
    }),
  ) as Record<CategoryId, Component | undefined>;
  const {
    cpu,
    motherboard,
    gpu,
    ram,
    storage,
    cooler,
    psu,
    case: pcCase,
  } = selected;
  const warnings: CompatibilityWarning[] = [];
  const recommendations: Recommendation[] = [];
  const add = (warning: CompatibilityWarning) => warnings.push(warning);
  const suggest = (
    id: string,
    title: string,
    description: string,
    category: CategoryId,
    componentId?: string,
  ) => {
    if (!recommendations.some((r) => r.category === category))
      recommendations.push({ id, title, description, category, componentId });
  };

  if (cpu && motherboard && cpu.socket !== motherboard.socket) {
    add({
      id: "socket",
      severity: "error",
      title: "Sockets incompatibles",
      description: `${cpu.name} utilise le socket ${cpu.socket}, alors que la carte mère utilise ${motherboard.socket}.`,
      category: "motherboard",
    });
    const match = catalog.find(
      (c) =>
        c.category === "motherboard" &&
        c.socket === cpu.socket &&
        (!ram || c.memoryType === ram.memoryType) &&
        (!pcCase || pcCase.supportedFormFactors?.includes(c.formFactor!)),
    );
    suggest(
      "match-board",
      `Une carte mère ${cpu.socket}`,
      "Choisissez une carte mère qui accepte le socket de votre processeur.",
      "motherboard",
      match?.id,
    );
  }
  if (ram && motherboard && ram.memoryType !== motherboard.memoryType) {
    add({
      id: "memory-type",
      severity: "error",
      title: "Mémoire incompatible",
      description: `Cette carte mère accepte la ${motherboard.memoryType}. Le kit sélectionné est en ${ram.memoryType} : les connecteurs sont différents.`,
      category: "ram",
    });
    const match = catalog.find(
      (c) =>
        c.category === "ram" &&
        c.memoryType === motherboard.memoryType &&
        (c.capacityGB ?? 0) >= 32,
    );
    suggest(
      "match-ram",
      `Passez à la ${motherboard.memoryType}`,
      "Le type de mémoire doit correspondre à celui de la carte mère.",
      "ram",
      match?.id,
    );
  }
  if (
    ram &&
    cpu &&
    cpu.supportedMemory &&
    !cpu.supportedMemory.includes(ram.memoryType!)
  ) {
    add({
      id: "cpu-memory",
      severity: "error",
      title: "Mémoire non prise en charge par le CPU",
      description: `${cpu.name} prend en charge ${cpu.supportedMemory.join(" ou ")}, pas la ${ram.memoryType}.`,
      category: "ram",
    });
  }
  if (
    ram &&
    motherboard &&
    (ram.capacityGB ?? 0) > (motherboard.maxMemoryGB ?? Infinity)
  ) {
    add({
      id: "memory-capacity",
      severity: "error",
      title: "Capacité mémoire dépassée",
      description: `${ram.capacityGB} Go sélectionnés pour un maximum renseigné de ${motherboard.maxMemoryGB} Go.`,
      category: "ram",
    });
  }
  if (
    ram &&
    motherboard &&
    (ram.memorySticks ?? 0) > (motherboard.memorySlots ?? Infinity)
  ) {
    add({
      id: "memory-slots",
      severity: "error",
      title: "Trop de barrettes mémoire",
      description: `Le kit contient ${ram.memorySticks} barrettes pour ${motherboard.memorySlots} emplacements.`,
      category: "ram",
    });
  }
  if (cpu && cooler && !cooler.supportedSockets?.includes(cpu.socket!)) {
    add({
      id: "cooler-socket",
      severity: "error",
      title: "Fixation du ventirad incompatible",
      description: `${cooler.name} ne propose pas de fixation ${cpu.socket} dans ce catalogue.`,
      category: "cooler",
    });
    suggest(
      "match-cooler",
      "Un refroidissement adapté au socket",
      "Le Phantom Spirit prend en charge AM4, AM5 et LGA1700.",
      "cooler",
      "cooler-phantom",
    );
  }
  if (
    cpu &&
    cooler &&
    (cpu.powerW ?? 0) > (cooler.recommendedCpuPowerW ?? Infinity)
  ) {
    add({
      id: "cooler-power",
      severity: "warning",
      title: "Refroidissement à surveiller",
      description:
        "Ce ventirad compact peut limiter les performances en charge prolongée. Vérifiez les recommandations thermiques du fabricant et les limites de puissance du CPU.",
      category: "cooler",
    });
    if (!pcCase || (pcCase.maxCoolerHeightMm ?? 0) >= 154)
      suggest(
        "stronger-cooler",
        "Plus de marge thermique",
        "Un ventirad double tour convient mieux à ce processeur en charge soutenue.",
        "cooler",
        "cooler-phantom",
      );
  }
  if (
    motherboard &&
    pcCase &&
    !pcCase.supportedFormFactors?.includes(motherboard.formFactor!)
  ) {
    add({
      id: "board-size",
      severity: "error",
      title: "Carte mère trop grande",
      description: `${pcCase.name} accepte ${pcCase.supportedFormFactors?.join(" et ")} ; la carte mère est au format ${motherboard.formFactor}.`,
      category: "case",
    });
    suggest(
      "larger-case",
      "Un boîtier adapté à votre carte mère",
      "Le 4000D Airflow accepte les cartes ATX, Micro-ATX et Mini-ITX.",
      "case",
      "case-4000d",
    );
  }
  if (
    gpu &&
    pcCase &&
    (gpu.lengthMm ?? 0) > (pcCase.maxGpuLengthMm ?? Infinity)
  ) {
    add({
      id: "gpu-length",
      severity: "error",
      title: "Carte graphique trop longue",
      description: `${gpu.lengthMm} mm nécessaires pour ${pcCase.maxGpuLengthMm} mm disponibles dans ce boîtier.`,
      category: "case",
    });
    suggest(
      "longer-case",
      "Plus de place pour votre GPU",
      "Le H6 Flow accepte les cartes graphiques jusqu’à 365 mm.",
      "case",
      "case-h6",
    );
  }
  if (
    cooler &&
    pcCase &&
    (cooler.heightMm ?? 0) > (pcCase.maxCoolerHeightMm ?? Infinity)
  ) {
    add({
      id: "cooler-height",
      severity: "error",
      title: "Ventirad trop haut",
      description: `${cooler.heightMm} mm nécessaires pour ${pcCase.maxCoolerHeightMm} mm de dégagement maximum.`,
      category: "cooler",
    });
    const match = catalog.find(
      (c) =>
        c.category === "cooler" &&
        (c.heightMm ?? Infinity) <= (pcCase.maxCoolerHeightMm ?? 0) &&
        (!cpu || c.supportedSockets?.includes(cpu.socket!)) &&
        (!cpu || (c.recommendedCpuPowerW ?? 0) >= (cpu.powerW ?? 0)),
    );
    suggest(
      "shorter-cooler",
      "Respectez le dégagement du boîtier",
      "Choisissez un ventirad plus bas ou un boîtier plus spacieux.",
      "cooler",
      match?.id,
    );
  }
  if (psu && pcCase && !pcCase.supportedPsuFormats?.includes(psu.psuFormat!)) {
    add({
      id: "psu-format",
      severity: "error",
      title: "Format d’alimentation incompatible",
      description: `${pcCase.name} utilise une alimentation ${pcCase.supportedPsuFormats?.join(" ou ")} ; votre modèle est au format ${psu.psuFormat}. Un adaptateur éventuel n’est pas pris en compte.`,
      category: "psu",
    });
    const match = catalog.find(
      (c) =>
        c.category === "psu" &&
        pcCase.supportedPsuFormats?.includes(c.psuFormat!) &&
        (c.wattage ?? 0) >= (gpu?.recommendedPsuW ?? 550),
    );
    suggest(
      "psu-format",
      "Une alimentation au bon format",
      "Vérifiez le format avant de choisir la puissance.",
      "psu",
      match?.id,
    );
  }
  if (storage && motherboard && (motherboard.m2Slots ?? 0) < 1) {
    add({
      id: "storage-slot",
      severity: "error",
      title: "Emplacement M.2 manquant",
      description: "Ce SSD nécessite un emplacement M.2 NVMe compatible.",
      category: "storage",
    });
  }

  const basePower = selectedCount(selected) > 0 ? 65 : 0;
  const estimated = Math.ceil(
    (cpu?.powerW ?? 0) +
      (gpu?.powerW ?? 0) +
      basePower +
      (ram ? 10 : 0) +
      (storage ? 8 : 0),
  );
  const recommended = estimated
    ? Math.max(
        Math.ceil((estimated * 1.25) / 50) * 50,
        gpu?.recommendedPsuW ?? 0,
      )
    : 0;
  const capacity = psu?.wattage ?? 0;
  const headroom = capacity ? capacity - estimated : 0;
  if (psu && capacity < estimated) {
    add({
      id: "psu-insufficient",
      severity: "error",
      title: "Puissance d’alimentation insuffisante",
      description: `La charge estimée atteint ${estimated} W pour une alimentation de ${capacity} W. Visez au moins ${recommended} W.`,
      category: "psu",
    });
  } else if (psu && capacity < recommended) {
    add({
      id: "psu-headroom",
      severity: "warning",
      title: "Marge d’alimentation limitée",
      description: `${recommended} W recommandés pour absorber les pointes de consommation et respecter la recommandation GPU. Votre alimentation fournit ${capacity} W.`,
      category: "psu",
    });
  }
  if (psu && capacity < recommended) {
    const match = catalog.find(
      (c) =>
        c.category === "psu" &&
        (c.wattage ?? 0) >= recommended &&
        (!pcCase || pcCase.supportedPsuFormats?.includes(c.psuFormat!)),
    );
    suggest(
      "more-power",
      `Visez ${recommended} W ou plus`,
      "Une réserve de puissance favorise la stabilité et laisse une marge d’évolution.",
      "psu",
      match?.id,
    );
  }
  if (cpu?.id === "cpu-14600kf" && motherboard?.socket === "LGA1700") {
    add({
      id: "intel-bios",
      severity: "warning",
      title: "Version du BIOS à vérifier",
      description:
        "Les cartes B760 peuvent nécessiter un BIOS récent pour les processeurs Intel de 14e génération. Vérifiez la liste CPU du fabricant.",
      category: "motherboard",
    });
  }
  if (pcCase?.id === "case-terra") {
    add({
      id: "terra-clearance",
      severity: "warning",
      title: "Dégagements partagés à vérifier",
      description:
        "Dans le Terra, la hauteur du ventirad disponible dépend de l’épaisseur du GPU et de la position de la cloison. Les maxima ne sont pas utilisables simultanément.",
      category: "case",
    });
  }
  if (cooler?.id === "cooler-nhd15") {
    add({
      id: "noctua-kit",
      severity: "info",
      title: "Kit et hauteur mémoire à vérifier",
      description:
        "Vérifiez la présence du kit de fixation correspondant à votre socket. Une RAM haute peut imposer de remonter le ventilateur et augmenter la hauteur totale.",
      category: "cooler",
    });
  }

  const balance: BuildAnalysis["balance"] = {
    score: 0,
    cpu: 0,
    gpu: 0,
    label: "Analyse en attente",
    limiter: "unknown",
    description:
      "Ajoutez un processeur et une carte graphique pour estimer l’équilibre.",
  };
  if (cpu && gpu) {
    const cpuBase =
      usage === "creation" ? (cpu.creationScore ?? 0) : (cpu.gamingScore ?? 0);
    const gpuBase =
      usage === "creation" ? (gpu.creationScore ?? 0) : (gpu.gamingScore ?? 0);
    const resolutionFactor =
      usage === "gaming"
        ? { "1080p": 0.78, "1440p": 1, "4k": 1.42 }[resolution]
        : 1;
    const cpuBudget = cpuBase * resolutionFactor;
    const gpuBudget = gpuBase;
    // Normalize only the visual indices. The comparison keeps the original
    // budgets, so a change of resolution still affects the potential limiter.
    // These are relative class indices, never utilization or lost FPS.
    const displayScale = Math.max(100, cpuBudget, gpuBudget);
    balance.cpu = Math.round((cpuBudget / displayScale) * 100);
    balance.gpu = Math.round((gpuBudget / displayScale) * 100);
    balance.score = Math.round(
      (Math.min(cpuBudget, gpuBudget) / Math.max(cpuBudget, gpuBudget)) * 100,
    );
    balance.limiter =
      balance.score >= 77 ? "balanced" : cpuBudget < gpuBudget ? "cpu" : "gpu";
    if (usage === "general") {
      balance.label = "Adaptée au quotidien";
      balance.limiter = "balanced";
      balance.description =
        "Ces composants conviennent à un usage quotidien. La mémoire et le SSD comptent davantage que l’équilibre CPU/GPU pour la bureautique.";
    } else if (balance.limiter === "balanced") {
      balance.label = "Configuration équilibrée";
      balance.description =
        usage === "gaming"
          ? `Les classes de performances du CPU et du GPU sont cohérentes pour le jeu en ${resolution === "4k" ? "4K" : resolution}. Les résultats varient selon les jeux et les réglages.`
          : "Les classes de performances CPU et GPU sont proches. En création, le logiciel, le moteur de rendu et les codecs déterminent le composant le plus sollicité.";
    } else if (balance.limiter === "cpu") {
      balance.label = "CPU potentiellement limitant";
      balance.description =
        usage === "gaming"
          ? "À cette définition, le processeur peut limiter les hauts débits d’images dans les jeux exigeants en calcul CPU. Un GPU plus puissant ne garantit pas plus de fluidité."
          : "Le CPU peut devenir le facteur limitant dans les tâches de calcul, compilation ou rendu CPU. Le rendu GPU dépend davantage de la carte graphique.";
      const match = catalog
        .filter(
          (c) =>
            c.category === "cpu" &&
            (!motherboard || c.socket === motherboard.socket) &&
            (c.gamingScore ?? 0) > (cpu.gamingScore ?? 0),
        )
        .sort((a, b) => (b.gamingScore ?? 0) - (a.gamingScore ?? 0))[0];
      suggest(
        "balance-cpu",
        "Renforcez le processeur",
        "Pour les tâches sensibles au CPU, envisagez un modèle plus performant compatible avec votre carte mère.",
        "cpu",
        match?.id,
      );
    } else {
      balance.label = "GPU sollicité en priorité";
      balance.description =
        usage === "gaming"
          ? "La carte graphique devrait être le principal facteur limitant, surtout avec des réglages élevés. C’est courant en haute définition et ce n’est pas une incompatibilité."
          : "Les tâches accélérées par GPU peuvent être limitées par la carte graphique. Les tâches de rendu CPU ou de compilation peuvent se comporter autrement.";
      const match = catalog
        .filter(
          (c) =>
            c.category === "gpu" &&
            (c.gamingScore ?? 0) > (gpu.gamingScore ?? 0) &&
            (!pcCase ||
              (c.lengthMm ?? Infinity) <= (pcCase.maxGpuLengthMm ?? 0)) &&
            (!psu || (c.recommendedPsuW ?? Infinity) <= (psu.wattage ?? 0)),
        )
        .sort((a, b) => a.price - b.price)[0];
      suggest(
        "balance-gpu",
        "Priorité à la carte graphique",
        "Pour gagner en qualité graphique ou monter en définition, concentrez votre prochain budget sur le GPU.",
        "gpu",
        match?.id,
      );
    }
  }
  if (ram && (ram.capacityGB ?? 0) < (usage === "creation" ? 64 : 32)) {
    const target = usage === "creation" ? 64 : 32;
    const match = catalog.find(
      (c) =>
        c.category === "ram" &&
        c.memoryType === (motherboard?.memoryType ?? ram.memoryType) &&
        (c.capacityGB ?? 0) >= target,
    );
    suggest(
      "ram-capacity",
      `${target} Go pour plus de confort`,
      usage === "creation"
        ? "Les projets lourds, les médias et les machines virtuelles profitent d’une réserve de mémoire."
        : "32 Go apportent de la marge pour les jeux récents et les applications en arrière-plan.",
      "ram",
      match?.id,
    );
  }
  if (storage && (storage.capacityGB ?? 0) < 2000 && usage !== "general") {
    suggest(
      "storage-space",
      "Plus d’espace pour vos projets",
      "Un SSD de 2 To permet de conserver davantage de jeux et de médias sans déplacer vos fichiers.",
      "storage",
      "ssd-sn850-2",
    );
  }
  if (!recommendations.length && cpu && gpu) {
    suggest(
      "balanced",
      "Une base cohérente",
      "Vos composants forment un ensemble cohérent. Gardez votre budget pour un futur besoin réel.",
      "gpu",
    );
  }

  const count = selectedCount(selected);
  const hasError = warnings.some((w) => w.severity === "error");
  const hasWarning = warnings.some((w) => w.severity === "warning");
  return {
    selected,
    total:
      Math.round(
        Object.values(selected).reduce(
          (sum, component) => sum + (component?.price ?? 0),
          0,
        ) * 100,
      ) / 100,
    selectedCount: count,
    status: hasError
      ? "incompatible"
      : count < categories.length
        ? "incomplete"
        : hasWarning
          ? "warning"
          : "compatible",
    warnings,
    power: { estimated, recommended, capacity, headroom },
    balance,
    recommendations,
  };
}

function selectedCount(selected: Record<CategoryId, Component | undefined>) {
  return Object.values(selected).filter(Boolean).length;
}

const issueCategories: Record<string, CategoryId[]> = {
  socket: ["cpu", "motherboard"],
  "memory-type": ["ram", "motherboard"],
  "cpu-memory": ["cpu", "ram"],
  "memory-capacity": ["ram", "motherboard"],
  "memory-slots": ["ram", "motherboard"],
  "cooler-socket": ["cpu", "cooler"],
  "cooler-power": ["cpu", "cooler"],
  "board-size": ["motherboard", "case"],
  "gpu-length": ["gpu", "case"],
  "cooler-height": ["cooler", "case"],
  "psu-format": ["psu", "case"],
  "storage-slot": ["storage", "motherboard"],
  "psu-insufficient": ["psu", "cpu", "gpu", "ram", "storage"],
};

/** Blocking issues involving a candidate after it replaces its category.
 * Existing issues are intentionally retained when the candidate still causes
 * them. Unrelated conflicts do not make an otherwise fitting candidate fail.
 */
export function getCandidateIssues(
  selection: Selection,
  component: Component,
  resolution: Resolution = "1440p",
  usage: Usage = "gaming",
): CompatibilityWarning[] {
  const result = analyzeBuild(
    { ...selection, [component.category]: component.id },
    resolution,
    usage,
  );
  return result.warnings.filter(
    (warning) =>
      warning.severity === "error" &&
      (issueCategories[warning.id]?.includes(component.category) ??
        warning.category === component.category),
  );
}
