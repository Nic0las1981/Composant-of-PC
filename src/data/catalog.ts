export type CategoryId =
  | "cpu"
  | "motherboard"
  | "gpu"
  | "ram"
  | "storage"
  | "cooler"
  | "psu"
  | "case";
export type Selection = Record<CategoryId, string | null>;
export type Socket = "AM4" | "AM5" | "LGA1700";
export type MemoryType = "DDR4" | "DDR5";
export type FormFactor = "ATX" | "Micro-ATX" | "Mini-ITX";

/** Catalogue de démonstration : prix indicatifs, sans connexion à un marchand.
 * Les scores internes servent uniquement à comparer des classes de matériel.
 * Ils ne sont pas des mesures de performances ou des résultats de benchmarks.
 */
export interface Component {
  id: string;
  category: CategoryId;
  brand: string;
  name: string;
  price: number;
  description: string;
  specs: string[];
  socket?: Socket;
  memoryType?: MemoryType;
  supportedMemory?: MemoryType[];
  formFactor?: FormFactor;
  supportedFormFactors?: FormFactor[];
  powerW?: number;
  gamingScore?: number;
  creationScore?: number;
  capacityGB?: number;
  maxMemoryGB?: number;
  memorySticks?: number;
  memorySlots?: number;
  lengthMm?: number;
  maxGpuLengthMm?: number;
  heightMm?: number;
  maxCoolerHeightMm?: number;
  supportedSockets?: Socket[];
  recommendedCpuPowerW?: number;
  wattage?: number;
  recommendedPsuW?: number;
  psuFormat?: "ATX" | "SFX";
  supportedPsuFormats?: ("ATX" | "SFX")[];
  storageInterface?: "M.2 NVMe";
  m2Slots?: number;
  accent?: string;
}

export const categories: {
  id: CategoryId;
  label: string;
  shortLabel: string;
}[] = [
  { id: "cpu", label: "Processeur", shortLabel: "CPU" },
  { id: "motherboard", label: "Carte mère", shortLabel: "Carte mère" },
  { id: "gpu", label: "Carte graphique", shortLabel: "GPU" },
  { id: "ram", label: "Mémoire vive", shortLabel: "RAM" },
  { id: "storage", label: "Stockage", shortLabel: "SSD" },
  { id: "cooler", label: "Refroidissement", shortLabel: "Ventirad" },
  { id: "psu", label: "Alimentation", shortLabel: "Alimentation" },
  { id: "case", label: "Boîtier", shortLabel: "Boîtier" },
];

export const catalog: Component[] = [
  {
    id: "cpu-7800x3d",
    category: "cpu",
    brand: "AMD",
    name: "Ryzen 7 7800X3D",
    price: 349.9,
    description:
      "8 cœurs et un cache 3D généreux pour une machine pensée pour le jeu.",
    specs: ["8 cœurs · 16 threads", "4,2 – 5,0 GHz", "Socket AM5", "120 W TDP"],
    socket: "AM5",
    supportedMemory: ["DDR5"],
    powerW: 120,
    gamingScore: 100,
    creationScore: 84,
    accent: "#ff743f",
  },
  {
    id: "cpu-7600",
    category: "cpu",
    brand: "AMD",
    name: "Ryzen 5 7600",
    price: 189.9,
    description:
      "Une base AM5 accessible et polyvalente pour jouer et travailler.",
    specs: ["6 cœurs · 12 threads", "3,8 – 5,1 GHz", "Socket AM5", "65 W TDP"],
    socket: "AM5",
    supportedMemory: ["DDR5"],
    powerW: 88,
    gamingScore: 77,
    creationScore: 65,
    accent: "#ff743f",
  },
  {
    id: "cpu-5600",
    category: "cpu",
    brand: "AMD",
    name: "Ryzen 5 5600",
    price: 109.9,
    description:
      "Une option économique pour une plateforme AM4 avec mémoire DDR4.",
    specs: ["6 cœurs · 12 threads", "3,5 – 4,4 GHz", "Socket AM4", "65 W TDP"],
    socket: "AM4",
    supportedMemory: ["DDR4"],
    powerW: 88,
    gamingScore: 55,
    creationScore: 48,
    accent: "#ff743f",
  },
  {
    id: "cpu-14600kf",
    category: "cpu",
    brand: "Intel",
    name: "Core i5-14600KF",
    price: 249.9,
    description: "14 cœurs hybrides pour les jeux et les tâches multithreads.",
    specs: [
      "14 cœurs · 20 threads",
      "Jusqu’à 5,3 GHz",
      "Socket LGA1700",
      "181 W turbo max.",
    ],
    socket: "LGA1700",
    supportedMemory: ["DDR4", "DDR5"],
    powerW: 181,
    gamingScore: 87,
    creationScore: 110,
    accent: "#4d99ff",
  },

  {
    id: "mb-b650",
    category: "motherboard",
    brand: "MSI",
    name: "MAG B650 TOMAHAWK WIFI",
    price: 199.9,
    description:
      "Une plateforme AM5 complète, avec Wi-Fi 6E et trois emplacements M.2.",
    specs: ["Socket AM5", "DDR5 · 4 emplacements", "Format ATX", "Wi-Fi 6E"],
    socket: "AM5",
    memoryType: "DDR5",
    formFactor: "ATX",
    maxMemoryGB: 128,
    memorySlots: 4,
    m2Slots: 3,
  },
  {
    id: "mb-b550",
    category: "motherboard",
    brand: "MSI",
    name: "B550-A PRO",
    price: 109.9,
    description: "La base ATX éprouvée pour un processeur Ryzen AM4.",
    specs: ["Socket AM4", "DDR4 · 4 emplacements", "Format ATX", "2 ports M.2"],
    socket: "AM4",
    memoryType: "DDR4",
    formFactor: "ATX",
    maxMemoryGB: 128,
    memorySlots: 4,
    m2Slots: 2,
  },
  {
    id: "mb-b760",
    category: "motherboard",
    brand: "MSI",
    name: "PRO B760M-A WIFI DDR4",
    price: 139.9,
    description: "Une carte compacte Intel LGA1700 avec de la mémoire DDR4.",
    specs: [
      "Socket LGA1700",
      "DDR4 · 4 emplacements",
      "Format Micro-ATX",
      "Wi-Fi 6E",
    ],
    socket: "LGA1700",
    memoryType: "DDR4",
    formFactor: "Micro-ATX",
    maxMemoryGB: 128,
    memorySlots: 4,
    m2Slots: 2,
  },
  {
    id: "mb-a620i",
    category: "motherboard",
    brand: "ASRock",
    name: "A620I Lightning WiFi",
    price: 149.9,
    description: "L’essentiel de la plateforme AM5 au format Mini-ITX.",
    specs: [
      "Socket AM5",
      "DDR5 · 2 emplacements",
      "Format Mini-ITX",
      "Wi-Fi 6E",
    ],
    socket: "AM5",
    memoryType: "DDR5",
    formFactor: "Mini-ITX",
    maxMemoryGB: 96,
    memorySlots: 2,
    m2Slots: 2,
  },

  {
    id: "gpu-4070s",
    category: "gpu",
    brand: "ASUS",
    name: "GeForce RTX 4070 SUPER Dual",
    price: 629.9,
    description:
      "12 Go de mémoire vidéo et une belle réserve de puissance en 1440p.",
    specs: ["12 Go GDDR6X", "220 W", "Longueur 267 mm", "Ray tracing · DLSS 3"],
    powerW: 220,
    gamingScore: 88,
    creationScore: 90,
    lengthMm: 267,
    recommendedPsuW: 650,
    accent: "#a3e45a",
  },
  {
    id: "gpu-4060",
    category: "gpu",
    brand: "MSI",
    name: "GeForce RTX 4060 VENTUS 2X",
    price: 289.9,
    description: "Une carte compacte et sobre, adaptée au jeu en Full HD.",
    specs: ["8 Go GDDR6", "115 W", "Longueur 199 mm", "Ray tracing · DLSS 3"],
    powerW: 115,
    gamingScore: 48,
    creationScore: 48,
    lengthMm: 199,
    recommendedPsuW: 550,
    accent: "#a3e45a",
  },
  {
    id: "gpu-4080s",
    category: "gpu",
    brand: "Gigabyte",
    name: "GeForce RTX 4080 SUPER Gaming OC",
    price: 1099.9,
    description:
      "Une carte imposante pour les hautes définitions et la création 3D.",
    specs: ["16 Go GDDR6X", "320 W", "Longueur 342 mm", "Ray tracing · DLSS 3"],
    powerW: 320,
    gamingScore: 125,
    creationScore: 125,
    lengthMm: 342,
    recommendedPsuW: 850,
    accent: "#a3e45a",
  },
  {
    id: "gpu-7800xt",
    category: "gpu",
    brand: "Sapphire",
    name: "Radeon RX 7800 XT PULSE",
    price: 489.9,
    description: "16 Go de mémoire pour une configuration 1440p généreuse.",
    specs: ["16 Go GDDR6", "263 W", "Longueur 280 mm", "AMD FSR"],
    powerW: 263,
    gamingScore: 81,
    creationScore: 65,
    lengthMm: 280,
    recommendedPsuW: 700,
    accent: "#ec6275",
  },

  {
    id: "ram-ddr5-32",
    category: "ram",
    brand: "Corsair",
    name: "Vengeance RGB 32 Go DDR5",
    price: 109.9,
    description:
      "Un kit de 32 Go en double canal pour les jeux et le multitâche.",
    specs: ["2 × 16 Go", "DDR5-6000", "CL30", "AMD EXPO"],
    memoryType: "DDR5",
    capacityGB: 32,
    memorySticks: 2,
  },
  {
    id: "ram-ddr5-64",
    category: "ram",
    brand: "G.Skill",
    name: "Flare X5 64 Go DDR5",
    price: 189.9,
    description:
      "De la place pour les gros projets, la vidéo et les machines virtuelles.",
    specs: ["2 × 32 Go", "DDR5-6000", "CL30", "AMD EXPO"],
    memoryType: "DDR5",
    capacityGB: 64,
    memorySticks: 2,
  },
  {
    id: "ram-ddr4-16",
    category: "ram",
    brand: "Kingston",
    name: "FURY Beast 16 Go DDR4",
    price: 39.9,
    description: "Un kit DDR4 économique pour une configuration essentielle.",
    specs: ["2 × 8 Go", "DDR4-3200", "CL16", "Intel XMP"],
    memoryType: "DDR4",
    capacityGB: 16,
    memorySticks: 2,
  },
  {
    id: "ram-ddr4-32",
    category: "ram",
    brand: "Corsair",
    name: "Vengeance LPX 32 Go DDR4",
    price: 64.9,
    description: "32 Go de DDR4 au format compact pour un usage polyvalent.",
    specs: ["2 × 16 Go", "DDR4-3600", "CL18", "Intel XMP"],
    memoryType: "DDR4",
    capacityGB: 32,
    memorySticks: 2,
  },

  {
    id: "ssd-990-1",
    category: "storage",
    brand: "Samsung",
    name: "990 EVO Plus 1 To",
    price: 89.9,
    description:
      "Un SSD NVMe réactif pour le système, les jeux et les applications.",
    specs: [
      "1 To",
      "M.2 2280 NVMe",
      "PCIe 4.0 ×4 / 5.0 ×2",
      "Jusqu’à 7 150 Mo/s",
    ],
    capacityGB: 1000,
    storageInterface: "M.2 NVMe",
  },
  {
    id: "ssd-sn850-2",
    category: "storage",
    brand: "WD_BLACK",
    name: "SN850X 2 To",
    price: 149.9,
    description: "Un espace confortable pour une grande bibliothèque de jeux.",
    specs: ["2 To", "M.2 2280 NVMe", "PCIe 4.0 ×4", "Jusqu’à 7 300 Mo/s"],
    capacityGB: 2000,
    storageInterface: "M.2 NVMe",
  },
  {
    id: "ssd-p3-1",
    category: "storage",
    brand: "Crucial",
    name: "P3 Plus 1 To",
    price: 59.9,
    description: "Un SSD PCIe 4.0 accessible pour une utilisation quotidienne.",
    specs: ["1 To", "M.2 2280 NVMe", "PCIe 4.0 ×4", "Jusqu’à 5 000 Mo/s"],
    capacityGB: 1000,
    storageInterface: "M.2 NVMe",
  },
  {
    id: "ssd-990-4",
    category: "storage",
    brand: "Samsung",
    name: "990 PRO 4 To",
    price: 299.9,
    description:
      "Un grand espace de travail pour les médias et les projets volumineux.",
    specs: ["4 To", "M.2 2280 NVMe", "PCIe 4.0 ×4", "Jusqu’à 7 450 Mo/s"],
    capacityGB: 4000,
    storageInterface: "M.2 NVMe",
  },

  {
    id: "cooler-phantom",
    category: "cooler",
    brand: "Thermalright",
    name: "Phantom Spirit 120 SE",
    price: 44.9,
    description:
      "Un ventirad à double tour pour garder le processeur au frais.",
    specs: [
      "Double tour · 2 × 120 mm",
      "Hauteur 154 mm",
      "AM4 · AM5 · LGA1700",
      "7 caloducs",
    ],
    supportedSockets: ["AM4", "AM5", "LGA1700"],
    heightMm: 154,
    recommendedCpuPowerW: 200,
  },
  {
    id: "cooler-ak620",
    category: "cooler",
    brand: "DeepCool",
    name: "AK620",
    price: 64.9,
    description:
      "Un refroidissement à air robuste pour les processeurs exigeants.",
    specs: [
      "Double tour · 2 × 120 mm",
      "Hauteur 160 mm",
      "AM4 · AM5 · LGA1700",
      "6 caloducs",
    ],
    supportedSockets: ["AM4", "AM5", "LGA1700"],
    heightMm: 160,
    recommendedCpuPowerW: 220,
  },
  {
    id: "cooler-nhd15",
    category: "cooler",
    brand: "Noctua",
    name: "NH-D15 chromax.black",
    price: 119.9,
    description:
      "Un grand ventirad haut de gamme ; vérifiez les dégagements du boîtier.",
    specs: [
      "Double tour · 2 × 140 mm",
      "Hauteur 165 mm",
      "AM4 · AM5 · LGA1700*",
      "6 caloducs",
    ],
    supportedSockets: ["AM4", "AM5", "LGA1700"],
    heightMm: 165,
    recommendedCpuPowerW: 230,
  },
  {
    id: "cooler-l9a",
    category: "cooler",
    brand: "Noctua",
    name: "NH-L9a-AM5",
    price: 49.9,
    description:
      "Un ventirad très bas pour les PC AM5 compacts à puissance limitée.",
    specs: [
      "Ventilateur 92 mm",
      "Hauteur 37 mm",
      "Socket AM5 uniquement",
      "Format compact",
    ],
    supportedSockets: ["AM5"],
    heightMm: 37,
    recommendedCpuPowerW: 88,
  },

  {
    id: "psu-rm750e",
    category: "psu",
    brand: "Corsair",
    name: "RM750e · 750 W",
    price: 99.9,
    description:
      "Une alimentation modulaire avec une bonne marge pour évoluer.",
    specs: ["750 W", "80 PLUS Gold", "ATX 3.1", "Modulaire"],
    wattage: 750,
    psuFormat: "ATX",
  },
  {
    id: "psu-a550",
    category: "psu",
    brand: "MSI",
    name: "MAG A550BN · 550 W",
    price: 49.9,
    description:
      "Une alimentation de 550 W destinée aux configurations modestes.",
    specs: ["550 W", "80 PLUS Bronze", "Format ATX", "Non modulaire"],
    wattage: 550,
    psuFormat: "ATX",
  },
  {
    id: "psu-rm850e",
    category: "psu",
    brand: "Corsair",
    name: "RM850e · 850 W",
    price: 119.9,
    description:
      "850 W pour les cartes graphiques et processeurs haut de gamme.",
    specs: ["850 W", "80 PLUS Gold", "ATX 3.1", "Modulaire"],
    wattage: 850,
    psuFormat: "ATX",
  },
  {
    id: "psu-sf750",
    category: "psu",
    brand: "Corsair",
    name: "SF750 · 750 W",
    price: 169.9,
    description: "Une alimentation SFX compacte pour les petits boîtiers.",
    specs: ["750 W", "80 PLUS Platinum", "Format SFX", "Modulaire"],
    wattage: 750,
    psuFormat: "SFX",
  },

  {
    id: "case-h6",
    category: "case",
    brand: "NZXT",
    name: "H6 Flow",
    price: 119.9,
    description:
      "Un boîtier panoramique avec trois ventilateurs inclinés et un flux d’air généreux.",
    specs: [
      "ATX · Micro-ATX · Mini-ITX",
      "GPU jusqu’à 365 mm",
      "Ventirad jusqu’à 163 mm",
      "3 ventilateurs inclus",
    ],
    supportedFormFactors: ["ATX", "Micro-ATX", "Mini-ITX"],
    maxGpuLengthMm: 365,
    maxCoolerHeightMm: 163,
    supportedPsuFormats: ["ATX"],
  },
  {
    id: "case-4000d",
    category: "case",
    brand: "Corsair",
    name: "4000D Airflow",
    price: 89.9,
    description:
      "Une façade ajourée et un format classique pour une machine bien ventilée.",
    specs: [
      "ATX · Micro-ATX · Mini-ITX",
      "GPU jusqu’à 360 mm",
      "Ventirad jusqu’à 170 mm",
      "2 ventilateurs inclus",
    ],
    supportedFormFactors: ["ATX", "Micro-ATX", "Mini-ITX"],
    maxGpuLengthMm: 360,
    maxCoolerHeightMm: 170,
    supportedPsuFormats: ["ATX"],
  },
  {
    id: "case-q300l",
    category: "case",
    brand: "Cooler Master",
    name: "MasterBox Q300L",
    price: 49.9,
    description:
      "Un boîtier compact et économique pour une carte mère Micro-ATX ou Mini-ITX.",
    specs: [
      "Micro-ATX · Mini-ITX",
      "GPU jusqu’à 360 mm",
      "Ventirad jusqu’à 159 mm",
      "1 ventilateur inclus",
    ],
    supportedFormFactors: ["Micro-ATX", "Mini-ITX"],
    maxGpuLengthMm: 360,
    maxCoolerHeightMm: 159,
    supportedPsuFormats: ["ATX"],
  },
  {
    id: "case-terra",
    category: "case",
    brand: "Fractal Design",
    name: "Terra",
    price: 179.9,
    description:
      "Un boîtier Mini-ITX de 10,4 litres : le dégagement GPU et ventirad est partagé.",
    specs: [
      "Mini-ITX uniquement",
      "GPU jusqu’à 322 mm*",
      "Ventirad jusqu’à 77 mm*",
      "Alimentation SFX",
    ],
    supportedFormFactors: ["Mini-ITX"],
    maxGpuLengthMm: 322,
    maxCoolerHeightMm: 77,
    supportedPsuFormats: ["SFX"],
  },
];

export const defaultSelection: Selection = {
  cpu: "cpu-7800x3d",
  motherboard: "mb-b650",
  gpu: "gpu-4070s",
  ram: "ram-ddr5-32",
  storage: "ssd-990-1",
  cooler: "cooler-phantom",
  psu: "psu-rm750e",
  case: "case-h6",
};

export function getComponent(
  id: string | null | undefined,
): Component | undefined {
  return catalog.find((component) => component.id === id);
}
