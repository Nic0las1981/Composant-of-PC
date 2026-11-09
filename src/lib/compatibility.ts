import { catalog, categories, getComponent } from "../data/catalog.ts";
import type { CategoryId, Component, Selection } from "../data/catalog.ts";
import { getReferencePrice } from "../data/pricing.ts";
import { arrangeMemorySlots, chooseMemoryComponent, getMemoryAnalysis, type MemoryAnalysis } from "./memory.ts";

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
  totalKnown: number;
  unpricedCount: number;
  memory: MemoryAnalysis;
  selectedCount: number;
  status: "compatible" | "warning" | "incompatible" | "incomplete";
  warnings: CompatibilityWarning[];
  power: {
    complete: boolean;
    estimated: number;
    recommended: number;
    capacity: number;
    headroom: number;
  };
  balance: {
    available: boolean;
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
  return analyzeBuildInternal(selection, resolution, usage, true);
}

function analyzeBuildInternal(
  selection: Selection,
  resolution: Resolution,
  usage: Usage,
  includeRecommendations: boolean,
): BuildAnalysis {
  const selected = Object.fromEntries(
    categories.map(({ id }) => {
      const component = getComponent(selection[id]);
      return [id, component?.category === id ? component : undefined];
    }),
  ) as Record<CategoryId, Component | undefined>;
  const memory = getMemoryAnalysis(selection);
  selected.ram = memory.aggregate;
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
  const warnings: CompatibilityWarning[] = [...memory.warnings];
  const recommendations: Recommendation[] = [];
  const add = (warning: CompatibilityWarning) => warnings.push(warning);
  const isSuitable = (component: Component) => {
    const candidate = analyzeBuildInternal(
      candidateSelection(selection, component), resolution, usage, false,
    );
    return !candidate.warnings.some(warning =>
      issueInvolvesCategory(warning, component.category)
      && (warning.severity === "error" || warning.id === "cooler-power" || warning.id === "psu-headroom"),
    );
  };
  const findSuitable = (category: CategoryId, predicate: (component: Component) => boolean = () => true) =>
    includeRecommendations ? catalog.find(component => component.category === category && predicate(component) && isSuitable(component)) : undefined;
  const suggest = (
    id: string,
    title: string,
    description: string,
    category: CategoryId,
    componentId?: string,
  ) => {
    if (!includeRecommendations) return;
    // Keep general advice even when no single replacement resolves the known
    // constraints. Never attach a directly recommended incompatible product.
    const candidate = getComponent(componentId);
    const safeComponentId = candidate && isSuitable(candidate) ? candidate.id : undefined;
    if (!recommendations.some((r) => r.category === category))
      recommendations.push({ id, title, description, category, componentId: safeComponentId });
  };

  const partial = Object.values(selected).filter(component => component?.detailLevel === "partial");
  if (partial.length) add({
    id: "catalog-partial", severity: "warning", title: "Fiches techniques partielles",
    description: `Certaines caractéristiques de ${partial.map(component => component!.name).join(", ")} ne sont pas renseignées. Les contrôles portent sur les données disponibles ; vérifiez les modèles exacts avant achat.`,
  });
  if (cpu && motherboard && (!cpu.socket || !motherboard.socket)) add({
    id: "socket-unknown", severity: "warning", title: "Socket à vérifier",
    description: "Le socket du processeur ou de la carte mère n’est pas renseigné.", category: "motherboard",
  });
  if (cpu && motherboard && cpu.socket && motherboard.socket && cpu.socket !== motherboard.socket) {
    add({
      id: "socket",
      severity: "error",
      title: "Sockets incompatibles",
      description: `${cpu.name} utilise le socket ${cpu.socket}, alors que la carte mère utilise ${motherboard.socket}.`,
      category: "motherboard",
    });
    const match = findSuitable("motherboard",
      (c) =>
        c.category === "motherboard" &&
        c.socket === cpu.socket &&
        (!ram || c.memoryType === ram.memoryType) &&
        (!pcCase || !!pcCase.supportedFormFactors?.includes(c.formFactor!)),
    );
    suggest(
      "match-board",
      `Une carte mère ${cpu.socket}`,
      "Choisissez une carte mère qui accepte le socket de votre processeur.",
      "motherboard",
      match?.id,
    );
  }
  if (motherboard && memory.warnings.some(warning => warning.id === "memory-type")) {
    const match = findSuitable("ram", component => component.memoryType === motherboard.memoryType && (component.capacityGB ?? 0) >= 32);
    suggest("match-ram", `Passez à la ${motherboard.memoryType}`,
      "Le type de mémoire doit correspondre à celui de la carte mère.", "ram", match?.id);
  }
  if (cpu && cooler && (!cpu.socket || !cooler.supportedSockets)) add({
    id: "cooler-socket-unknown", severity: "warning", title: "Fixation du refroidissement à vérifier",
    description: "La liste des fixations ou le socket n’est pas renseigné. Consultez le kit de montage du modèle exact.", category: "cooler",
  });
  if (cpu?.socket && cooler?.supportedSockets && !cooler.supportedSockets.includes(cpu.socket)) {
    add({
      id: "cooler-socket",
      severity: "error",
      title: "Fixation du refroidissement incompatible",
      description: `${cooler.name} ne propose pas de fixation ${cpu.socket} dans ce catalogue.`,
      category: "cooler",
    });
    suggest(
      "match-cooler",
      "Un refroidissement adapté au socket",
      "Vérifiez le socket, le kit de montage et l’espace disponible dans votre boîtier.",
      "cooler",
      findSuitable("cooler")?.id,
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
        "Ce refroidissement peut limiter les performances en charge prolongée. Vérifiez les recommandations thermiques du fabricant et les limites de puissance du CPU.",
      category: "cooler",
    });
    suggest(
      "stronger-cooler",
      "Plus de marge thermique",
      "Un refroidissement plus performant peut aider ce processeur en charge soutenue, selon les recommandations du fabricant.",
      "cooler",
      findSuitable("cooler")?.id,
    );
  }
  if (motherboard && pcCase && (!motherboard.formFactor || !pcCase.supportedFormFactors)) add({
    id: "board-size-unknown", severity: "warning", title: "Format de carte mère à vérifier",
    description: "Le format ou la liste des cartes mères acceptées par le boîtier n’est pas renseigné.", category: "case",
  });
  if (gpu && pcCase && (!isPositive(gpu.lengthMm) || !isPositive(pcCase.maxGpuLengthMm))) add({
    id: "gpu-length-unknown", severity: "warning", title: "Dégagement GPU à vérifier",
    description: "La longueur du GPU ou le dégagement du boîtier manque. Vérifiez également son épaisseur, sa largeur et la place des câbles.", category: "case",
  });
  if (cooler && cooler.coolingType !== "aio" && pcCase && (!isPositive(cooler.heightMm) || !isPositive(pcCase.maxCoolerHeightMm))) add({
    id: "cooler-height-unknown", severity: "warning", title: "Hauteur du ventirad à vérifier",
    description: "La hauteur du refroidissement ou le dégagement du boîtier n’est pas renseigné.", category: "cooler",
  });
  if (
    motherboard &&
    pcCase &&
    motherboard.formFactor && pcCase.supportedFormFactors &&
    !pcCase.supportedFormFactors.includes(motherboard.formFactor)
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
      "Choisissez un boîtier qui accepte la carte mère et laisse assez de place au GPU et au refroidissement.",
      "case",
      findSuitable("case")?.id,
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
      "Prévoyez le dégagement nécessaire au GPU, en tenant compte d’un éventuel radiateur en façade.",
      "case",
      findSuitable("case")?.id,
    );
  }
  if (
    cooler &&
    cooler.coolingType !== "aio" &&
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
    const match = findSuitable("cooler");
    suggest(
      "shorter-cooler",
      "Respectez le dégagement du boîtier",
      "Choisissez un refroidissement adapté aux dégagements et aux emplacements du boîtier.",
      "cooler",
      match?.id,
    );
  }
  if (cooler?.coolingType === "aio" && pcCase) {
    const positions = radiatorPositions(cooler, pcCase);
    if (!cooler.radiatorSizeMm || !pcCase.radiatorSupport) {
      add({ id: "radiator-fit-unknown", severity: "warning", title: "Emplacements de radiateur à vérifier",
        description: "La taille du radiateur ou les emplacements pris en charge ne sont pas renseignés. L’absence de donnée ne signifie pas l’absence d’emplacement.", category: "cooler" });
    } else if (!positions.length) {
      add({
        id: "radiator-fit",
        severity: "error",
        title: "Radiateur incompatible avec le boîtier",
        description: `${pcCase.name} ne dispose d’aucun emplacement renseigné pour un radiateur de ${cooler.radiatorSizeMm} mm. La hauteur de la pompe ne suffit pas à établir la compatibilité.`,
        category: "cooler",
      });
      suggest(
        "radiator-fit", "Un refroidissement adapté au boîtier",
        "Choisissez une taille de radiateur prise en charge ou un ventirad compatible avec les dégagements disponibles.",
        "cooler", findSuitable("cooler")?.id,
      );
    } else {
      const positionNames = { top: "haut", front: "façade", side: "côté" };
      const thick = (cooler.radiatorThicknessMm ?? 27) >= 35;
      if (thick) {
        add({
          id: "radiator-thickness",
          severity: "warning",
          title: "Épaisseur du radiateur à vérifier",
          description: `Le radiateur mesure ${cooler.radiatorThicknessMm} mm d’épaisseur, auxquels s’ajoutent les ventilateurs (environ 25 à 27 mm selon le modèle). Emplacement possible : ${positions.map(position => positionNames[position]).join(" / ")}. Vérifiez le dégagement avec la carte mère et la RAM en haut, ou avec le GPU en façade ; la longueur seule ne garantit pas le montage.`,
          category: "cooler",
        });
      } else {
        add({
          id: "radiator-clearance",
          severity: "info",
          title: "Emplacement de radiateur disponible",
          description: `Le format ${cooler.radiatorSizeMm} mm est accepté en ${positions.map(position => positionNames[position]).join(" / ")}. Vérifiez l’épaisseur radiateur + ventilateurs, le dégagement de la RAM et des dissipateurs ainsi que le passage des tuyaux avant achat.`,
          category: "cooler",
        });
      }
      if (positions.every(position => position === "front") && gpu) {
        add({
          id: "radiator-gpu-clearance",
          severity: "warning",
          title: "Dégagement GPU avec radiateur en façade",
          description: "Le radiateur doit être monté en façade. Sa présence et celle des ventilateurs peuvent réduire la longueur disponible pour la carte graphique ; vérifiez la combinaison exacte sur la fiche du boîtier.",
          category: "case",
        });
      }
    }
  }
  if (psu && pcCase && (!psu.psuFormat || !pcCase.supportedPsuFormats)) add({
    id: "psu-format-unknown", severity: "warning", title: "Format d’alimentation à vérifier",
    description: "Le format d’alimentation ou les formats acceptés par le boîtier ne sont pas renseignés.", category: "psu",
  });
  if (psu?.psuFormat && pcCase?.supportedPsuFormats && !pcCase.supportedPsuFormats.includes(psu.psuFormat)) {
    add({
      id: "psu-format",
      severity: "error",
      title: "Format d’alimentation incompatible",
      description: `${pcCase.name} utilise une alimentation ${pcCase.supportedPsuFormats?.join(" ou ")} ; votre modèle est au format ${psu.psuFormat}. Un adaptateur éventuel n’est pas pris en compte.`,
      category: "psu",
    });
    const match = findSuitable("psu",
      (c) =>
        c.category === "psu" &&
        !!pcCase.supportedPsuFormats?.includes(c.psuFormat!) &&
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
  if (storage?.storageInterface === "M.2 NVMe" && motherboard && motherboard.m2Slots === undefined) add({
    id: "storage-slot-unknown", severity: "warning", title: "Emplacement M.2 à vérifier",
    description: "Le nombre d’emplacements M.2 NVMe de cette carte mère n’est pas renseigné. Consultez son manuel avant de choisir ce SSD.", category: "storage",
  });
  if (storage?.storageInterface === "M.2 NVMe" && motherboard && motherboard.m2Slots !== undefined && motherboard.m2Slots < 1) {
    add({
      id: "storage-slot",
      severity: "error",
      title: "Emplacement M.2 manquant",
      description: "Ce SSD nécessite un emplacement M.2 NVMe compatible.",
      category: "storage",
    });
  }

  const completePower = !!cpu && !!gpu && isPositive(cpu.powerW) && isPositive(gpu.powerW);
  const basePower = selectedCount(selected) > 0 ? 65 : 0;
  const estimated = Math.ceil(
    (cpu?.powerW ?? 0) +
      (gpu?.powerW ?? 0) +
      basePower +
      memory.installedCount * 5 +
      (storage ? 8 : 0),
  );
  const recommended = completePower && estimated
    ? Math.max(
        Math.ceil((estimated * 1.25) / 50) * 50,
        gpu?.recommendedPsuW ?? 0,
      )
    : 0;
  const capacity = psu?.wattage ?? 0;
  const headroom = completePower && capacity ? capacity - estimated : 0;
  if ((cpu && !isPositive(cpu.powerW)) || (gpu && !isPositive(gpu.powerW))) add({
    id: "power-unknown", severity: "warning", title: "Estimation électrique incomplète",
    description: "La consommation du CPU ou du GPU n’est pas renseignée. Le total additionne les valeurs connues et les auxiliaires estimés ; la marge de l’alimentation et la puissance conseillée ne peuvent pas être confirmées.", category: "psu",
  });
  if (psu && !isPositive(psu.wattage)) add({
    id: "psu-capacity-unknown", severity: "warning", title: "Puissance d’alimentation à vérifier",
    description: "La puissance nominale de cette alimentation n’est pas renseignée.", category: "psu",
  });
  if (psu && isPositive(capacity) && capacity < estimated) {
    add({
      id: "psu-insufficient",
      severity: "error",
      title: "Puissance d’alimentation insuffisante",
      description: completePower ? `La charge estimée atteint ${estimated} W pour une alimentation de ${capacity} W. Visez au moins ${recommended} W.` : `Les valeurs connues et auxiliaires estimés atteignent déjà ${estimated} W pour une alimentation de ${capacity} W ; la consommation totale reste à vérifier.`,
      category: "psu",
    });
  } else if (completePower && psu && isPositive(capacity) && capacity < recommended) {
    add({
      id: "psu-headroom",
      severity: "warning",
      title: "Marge d’alimentation limitée",
      description: `${recommended} W recommandés pour absorber les pointes de consommation et respecter la recommandation GPU. Votre alimentation fournit ${capacity} W.`,
      category: "psu",
    });
  }
  if (completePower && psu && isPositive(capacity) && capacity < recommended) {
    const match = findSuitable("psu",
      (c) =>
        c.category === "psu" &&
        (c.wattage ?? 0) >= recommended &&
        (!pcCase || !!pcCase.supportedPsuFormats?.includes(c.psuFormat!)),
    );
    suggest(
      "more-power",
      `Visez ${recommended} W ou plus`,
      "Une réserve de puissance favorise la stabilité et laisse une marge d’évolution.",
      "psu",
      match?.id,
    );
  }
  const intelNeedsBios = cpu && motherboard?.socket === "LGA1700"
    && (/\b14\d{3}/.test(cpu.name)
      || (/\b13\d{3}/.test(cpu.name) && /\b[BHZ]6\d{2}/i.test(motherboard.name)));
  if (intelNeedsBios) {
    add({
      id: "intel-bios",
      severity: "warning",
      title: "Version du BIOS à vérifier",
      description:
        "Selon sa révision et le BIOS installé, cette carte mère peut nécessiter une mise à jour pour ce processeur Intel. Vérifiez le modèle exact et la version minimale dans la liste CPU du fabricant.",
      category: "motherboard",
    });
  }
  if (cpu?.socket === "AM5" && motherboard?.socket === "AM5"
    && /\b9\d{3}/.test(cpu.name) && /\b(?:A620|B650|X670)/i.test(motherboard.name)) {
    add({
      id: "amd-bios", severity: "warning", title: "BIOS AM5 à mettre à jour si nécessaire",
      description: "Les cartes AM5 de série 600 peuvent nécessiter un BIOS plus récent pour les Ryzen 9000. Vérifiez la version minimale du modèle exact avant le montage.",
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
    available: false,
    score: 0,
    cpu: 0,
    gpu: 0,
    label: "Analyse en attente",
    limiter: "unknown",
    description:
      "Ajoutez un processeur et une carte graphique pour estimer l’équilibre.",
  };
  const cpuBase = usage === "creation" ? cpu?.creationScore : cpu?.gamingScore;
  const gpuBase = usage === "creation" ? gpu?.creationScore : gpu?.gamingScore;
  if (cpu && gpu && (!isPositive(cpuBase) || !isPositive(gpuBase))) {
    balance.label = "Équilibre non calculable";
    balance.description = "Le catalogue ne renseigne pas les indices de performances nécessaires pour ce CPU ou ce GPU. Aucun pourcentage de bridage ne peut être déduit de ces données manquantes.";
  }
  if (cpu && gpu && isPositive(cpuBase) && isPositive(gpuBase)) {
    balance.available = true;
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
      const match = includeRecommendations ? catalog
        .filter(
          (c) =>
            c.category === "cpu" &&
            (!motherboard || c.socket === motherboard.socket) &&
            (c.gamingScore ?? 0) > (cpu.gamingScore ?? 0),
        )
        .sort((a, b) => (b.gamingScore ?? 0) - (a.gamingScore ?? 0))[0] : undefined;
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
      const match = includeRecommendations ? catalog
        .filter(
          (c) =>
            c.category === "gpu" &&
            (c.gamingScore ?? 0) > (gpu.gamingScore ?? 0) &&
            (!pcCase ||
              (c.lengthMm ?? Infinity) <= (pcCase.maxGpuLengthMm ?? 0)) &&
            (!psu || (c.recommendedPsuW ?? Infinity) <= (psu.wattage ?? 0)),
        )
        .sort((a, b) => (getReferencePrice(a) ?? Infinity) - (getReferencePrice(b) ?? Infinity))[0] : undefined;
      suggest(
        "balance-gpu",
        "Priorité à la carte graphique",
        "Pour gagner en qualité graphique ou monter en définition, concentrez votre prochain budget sur le GPU.",
        "gpu",
        match?.id,
      );
    }
  }
  if (includeRecommendations && ram && memory.capacityKnown && memory.totalCapacityGB < (usage === "creation" ? 64 : 32)) {
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
  if (!recommendations.length && cpu && gpu && balance.available && !warnings.some(warning => warning.severity !== "info")) {
    suggest(
      "balanced",
      "Une base cohérente",
      "Vos composants forment un ensemble cohérent. Gardez votre budget pour un futur besoin réel.",
      "gpu",
    );
  }

  if (includeRecommendations && !recommendations.length && cpu && gpu) suggest(
    "verify-build", "Vérifiez les caractéristiques du montage",
    "Complétez les données manquantes et consultez les listes CPU/RAM ainsi que les dimensions du fabricant avant achat.", "motherboard",
  );
  const pricedComponents = Object.values(selected).filter((component): component is Component => !!component && component.category !== "ram");
  const totalKnown = Math.round((pricedComponents.reduce((sum, component) => sum + (getReferencePrice(component) ?? 0), 0) + memory.totalPrice) * 100) / 100;
  const unpricedCount = pricedComponents.filter(component => getReferencePrice(component) === null).length
    + memory.purchases.filter(purchase => purchase.price === null).length
    + new Set(memory.slots.filter(slot => slot.componentId && !slot.component).map(slot => slot.componentId)).size;
  const count = selectedCount(selected);
  const hasError = warnings.some((w) => w.severity === "error");
  const hasWarning = warnings.some((w) => w.severity === "warning");
  return {
    selected,
    total: totalKnown,
    totalKnown,
    unpricedCount,
    memory,
    selectedCount: count,
    status: hasError
      ? "incompatible"
      : count < categories.length
        ? "incomplete"
        : hasWarning
          ? "warning"
          : "compatible",
    warnings,
    power: { complete: completePower, estimated, recommended, capacity, headroom },
    balance,
    recommendations,
  };
}

function isPositive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function candidateSelection(selection: Selection, component: Component): Selection {
  if (component.category === "ram") return chooseMemoryComponent(selection, component.id);
  const next = { ...selection, [component.category]: component.id };
  return component.category === "motherboard" ? arrangeMemorySlots(next) : next;
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
  "memory-module-capacity": ["ram", "motherboard"],
  "memory-module-format": ["ram", "motherboard"],
  "memory-registered": ["ram", "motherboard"],
  "cooler-socket": ["cpu", "cooler"],
  "cooler-power": ["cpu", "cooler"],
  "board-size": ["motherboard", "case"],
  "gpu-length": ["gpu", "case"],
  "cooler-height": ["cooler", "case"],
  "radiator-fit": ["cooler", "case"],
  "psu-format": ["psu", "case"],
  "storage-slot": ["storage", "motherboard"],
  "psu-insufficient": ["psu", "cpu", "gpu", "ram", "storage"],
  "psu-headroom": ["psu", "cpu", "gpu", "ram", "storage"],
};

function issueInvolvesCategory(warning: CompatibilityWarning, category: CategoryId) {
  return issueCategories[warning.id]?.includes(category) ?? warning.category === category;
}

function radiatorPositions(cooler: Component, pcCase: Component): ("top" | "front" | "side")[] {
  if (!cooler.radiatorSizeMm || !pcCase.radiatorSupport) return [];
  return (["top", "front", "side"] as const).filter(position =>
    pcCase.radiatorSupport?.[position]?.includes(cooler.radiatorSizeMm!),
  );
}

/** Current installed-state errors, without replacing an aggregate RAM selection by its source kit. */
export function getBuildIssues(analysis: BuildAnalysis, category: CategoryId): CompatibilityWarning[] {
  return analysis.warnings.filter(warning => warning.severity === "error" && issueInvolvesCategory(warning, category));
}

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
  const result = analyzeBuildInternal(
    candidateSelection(selection, component),
    resolution,
    usage,
    false,
  );
  return result.warnings.filter(
    (warning) =>
      warning.severity === "error" &&
      issueInvolvesCategory(warning, component.category),
  );
}
