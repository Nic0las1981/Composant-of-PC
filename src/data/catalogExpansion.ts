import type { Component } from "./catalog.ts";

/** Additional named retail references. Prices are illustrative, not live offers.
 * Frequencies and SSD speeds are advertised maxima, not measured benchmarks.
 * Physical profiles describe envelopes and appearance, not manufacturer CAD.
 */
export const catalogExpansion: Component[] = [
  {
    "id": "cpu-5500",
    "category": "cpu",
    "brand": "AMD",
    "name": "Ryzen 5 5500",
    "price": 89.9,
    "description": "6 cœurs et 12 threads sur AM4. PCIe 3.0 · sans circuit graphique.",
    "specs": [
      "6 cœurs · 12 threads",
      "3.6 – 4.2 GHz",
      "Socket AM4",
      "65 W de base · budget maximal 88 W",
      "PCIe 3.0 · sans circuit graphique"
    ],
    "socket": "AM4",
    "supportedMemory": [
      "DDR4"
    ],
    "powerW": 88,
    "gamingScore": 50,
    "creationScore": 44,
    "color": "#bdc6cd",
    "accent": "#c78656",
    "rgb": false
  },
  {
    "id": "cpu-5600x",
    "category": "cpu",
    "brand": "AMD",
    "name": "Ryzen 5 5600X",
    "price": 129.9,
    "description": "6 cœurs et 12 threads sur AM4. PCIe 4.0 · sans circuit graphique.",
    "specs": [
      "6 cœurs · 12 threads",
      "3.7 – 4.6 GHz",
      "Socket AM4",
      "65 W de base · budget maximal 88 W",
      "PCIe 4.0 · sans circuit graphique"
    ],
    "socket": "AM4",
    "supportedMemory": [
      "DDR4"
    ],
    "powerW": 88,
    "gamingScore": 58,
    "creationScore": 52,
    "color": "#bdc6cd",
    "accent": "#c78656",
    "rgb": false
  },
  {
    "id": "cpu-5700x3d",
    "category": "cpu",
    "brand": "AMD",
    "name": "Ryzen 7 5700X3D",
    "price": 229.9,
    "description": "8 cœurs et 16 threads sur AM4. 96 Mo de cache L3 · sans circuit graphique.",
    "specs": [
      "8 cœurs · 16 threads",
      "3 – 4.1 GHz",
      "Socket AM4",
      "105 W de base · budget maximal 142 W",
      "96 Mo de cache L3 · sans circuit graphique"
    ],
    "socket": "AM4",
    "supportedMemory": [
      "DDR4"
    ],
    "powerW": 142,
    "gamingScore": 80,
    "creationScore": 67,
    "color": "#bdc6cd",
    "accent": "#c78656",
    "rgb": false
  },
  {
    "id": "cpu-5950x",
    "category": "cpu",
    "brand": "AMD",
    "name": "Ryzen 9 5950X",
    "price": 349.9,
    "description": "16 cœurs et 32 threads sur AM4. 64 Mo de cache L3 · sans circuit graphique.",
    "specs": [
      "16 cœurs · 32 threads",
      "3.4 – 4.9 GHz",
      "Socket AM4",
      "105 W de base · budget maximal 142 W",
      "64 Mo de cache L3 · sans circuit graphique"
    ],
    "socket": "AM4",
    "supportedMemory": [
      "DDR4"
    ],
    "powerW": 142,
    "gamingScore": 72,
    "creationScore": 136,
    "color": "#bdc6cd",
    "accent": "#c78656",
    "rgb": false
  },
  {
    "id": "cpu-7500f",
    "category": "cpu",
    "brand": "AMD",
    "name": "Ryzen 5 7500F",
    "price": 159.9,
    "description": "6 cœurs et 12 threads sur AM5. PCIe 5.0 · sans circuit graphique.",
    "specs": [
      "6 cœurs · 12 threads",
      "3.7 – 5 GHz",
      "Socket AM5",
      "65 W de base · budget maximal 88 W",
      "PCIe 5.0 · sans circuit graphique"
    ],
    "socket": "AM5",
    "supportedMemory": [
      "DDR5"
    ],
    "powerW": 88,
    "gamingScore": 75,
    "creationScore": 63,
    "color": "#bdc6cd",
    "accent": "#c78656",
    "rgb": false
  },
  {
    "id": "cpu-7600x",
    "category": "cpu",
    "brand": "AMD",
    "name": "Ryzen 5 7600X",
    "price": 199.9,
    "description": "6 cœurs et 12 threads sur AM5. 32 Mo de cache L3 · Radeon intégré.",
    "specs": [
      "6 cœurs · 12 threads",
      "4.7 – 5.3 GHz",
      "Socket AM5",
      "105 W de base · budget maximal 142 W",
      "32 Mo de cache L3 · Radeon intégré"
    ],
    "socket": "AM5",
    "supportedMemory": [
      "DDR5"
    ],
    "powerW": 142,
    "gamingScore": 80,
    "creationScore": 69,
    "color": "#bdc6cd",
    "accent": "#c78656",
    "rgb": false
  },
  {
    "id": "cpu-7700",
    "category": "cpu",
    "brand": "AMD",
    "name": "Ryzen 7 7700",
    "price": 269.9,
    "description": "8 cœurs et 16 threads sur AM5. 32 Mo de cache L3 · Radeon intégré.",
    "specs": [
      "8 cœurs · 16 threads",
      "3.8 – 5.3 GHz",
      "Socket AM5",
      "65 W de base · budget maximal 88 W",
      "32 Mo de cache L3 · Radeon intégré"
    ],
    "socket": "AM5",
    "supportedMemory": [
      "DDR5"
    ],
    "powerW": 88,
    "gamingScore": 83,
    "creationScore": 88,
    "color": "#bdc6cd",
    "accent": "#c78656",
    "rgb": false
  },
  {
    "id": "cpu-7900",
    "category": "cpu",
    "brand": "AMD",
    "name": "Ryzen 9 7900",
    "price": 359.9,
    "description": "12 cœurs et 24 threads sur AM5. 64 Mo de cache L3 · Radeon intégré.",
    "specs": [
      "12 cœurs · 24 threads",
      "3.7 – 5.4 GHz",
      "Socket AM5",
      "65 W de base · budget maximal 88 W",
      "64 Mo de cache L3 · Radeon intégré"
    ],
    "socket": "AM5",
    "supportedMemory": [
      "DDR5"
    ],
    "powerW": 88,
    "gamingScore": 86,
    "creationScore": 119,
    "color": "#bdc6cd",
    "accent": "#c78656",
    "rgb": false
  },
  {
    "id": "cpu-9600x",
    "category": "cpu",
    "brand": "AMD",
    "name": "Ryzen 5 9600X",
    "price": 229.9,
    "description": "6 cœurs et 12 threads sur AM5. Zen 5 · Radeon intégré.",
    "specs": [
      "6 cœurs · 12 threads",
      "3.9 – 5.4 GHz",
      "Socket AM5",
      "65 W de base · budget maximal 88 W",
      "Zen 5 · Radeon intégré"
    ],
    "socket": "AM5",
    "supportedMemory": [
      "DDR5"
    ],
    "powerW": 88,
    "gamingScore": 86,
    "creationScore": 80,
    "color": "#bdc6cd",
    "accent": "#c78656",
    "rgb": false
  },
  {
    "id": "cpu-9700x",
    "category": "cpu",
    "brand": "AMD",
    "name": "Ryzen 7 9700X",
    "price": 319.9,
    "description": "8 cœurs et 16 threads sur AM5. Zen 5 · Radeon intégré.",
    "specs": [
      "8 cœurs · 16 threads",
      "3.8 – 5.5 GHz",
      "Socket AM5",
      "65 W de base · budget maximal 88 W",
      "Zen 5 · Radeon intégré"
    ],
    "socket": "AM5",
    "supportedMemory": [
      "DDR5"
    ],
    "powerW": 88,
    "gamingScore": 92,
    "creationScore": 105,
    "color": "#bdc6cd",
    "accent": "#c78656",
    "rgb": false
  },
  {
    "id": "cpu-12600kf",
    "category": "cpu",
    "brand": "Intel",
    "name": "Core i5-12600KF",
    "price": 169.9,
    "description": "10 cœurs et 16 threads sur LGA1700. 6 P-cores + 4 E-cores · sans circuit graphique.",
    "specs": [
      "10 cœurs · 16 threads",
      "3.7 – 4.9 GHz",
      "Socket LGA1700",
      "125 W de base · budget maximal 150 W",
      "6 P-cores + 4 E-cores · sans circuit graphique"
    ],
    "socket": "LGA1700",
    "supportedMemory": [
      "DDR4",
      "DDR5"
    ],
    "powerW": 150,
    "gamingScore": 70,
    "creationScore": 80,
    "color": "#bdc6cd",
    "accent": "#5996cb",
    "rgb": false
  },
  {
    "id": "cpu-13700kf",
    "category": "cpu",
    "brand": "Intel",
    "name": "Core i7-13700KF",
    "price": 309.9,
    "description": "16 cœurs et 24 threads sur LGA1700. 8 P-cores + 8 E-cores · sans circuit graphique.",
    "specs": [
      "16 cœurs · 24 threads",
      "3.4 – 5.4 GHz",
      "Socket LGA1700",
      "125 W de base · budget maximal 253 W",
      "8 P-cores + 8 E-cores · sans circuit graphique"
    ],
    "socket": "LGA1700",
    "supportedMemory": [
      "DDR4",
      "DDR5"
    ],
    "powerW": 253,
    "gamingScore": 90,
    "creationScore": 130,
    "color": "#bdc6cd",
    "accent": "#5996cb",
    "rgb": false
  },
  {
    "id": "mb-b550-tomahawk",
    "category": "motherboard",
    "brand": "MSI",
    "name": "MAG B550 TOMAHAWK",
    "price": 139.9,
    "description": "Carte mère ATX pour AM4, avec 4 emplacements DDR4 et 2 ports M.2. Ethernet 2,5 Gb/s + 1 Gb/s.",
    "specs": [
      "Socket AM4",
      "DDR4 · 4 emplacements · 128 Go max.",
      "Format ATX · 305 × 244 mm",
      "2 ports M.2",
      "Ethernet 2,5 Gb/s + 1 Gb/s"
    ],
    "socket": "AM4",
    "memoryType": "DDR4",
    "formFactor": "ATX",
    "maxMemoryGB": 128,
    "memorySlots": 4,
    "m2Slots": 2,
    "rgb": true,
    "color": "#252a30",
    "accent": "#3a4149"
  },
  {
    "id": "mb-b550-strix-f",
    "category": "motherboard",
    "brand": "ASUS",
    "name": "ROG STRIX B550-F GAMING",
    "price": 149.9,
    "description": "Carte mère ATX pour AM4, avec 4 emplacements DDR4 et 2 ports M.2. Ethernet 2,5 Gb/s · SupremeFX.",
    "specs": [
      "Socket AM4",
      "DDR4 · 4 emplacements · 128 Go max.",
      "Format ATX · 305 × 244 mm",
      "2 ports M.2",
      "Ethernet 2,5 Gb/s · SupremeFX"
    ],
    "socket": "AM4",
    "memoryType": "DDR4",
    "formFactor": "ATX",
    "maxMemoryGB": 128,
    "memorySlots": 4,
    "m2Slots": 2,
    "rgb": true,
    "color": "#252a30",
    "accent": "#272b33"
  },
  {
    "id": "mb-b550m-pro4",
    "category": "motherboard",
    "brand": "ASRock",
    "name": "B550M Pro4",
    "price": 99.9,
    "description": "Carte mère Micro-ATX pour AM4, avec 4 emplacements DDR4 et 2 ports M.2. Ethernet 1 Gb/s · HDMI et DisplayPort.",
    "specs": [
      "Socket AM4",
      "DDR4 · 4 emplacements · 128 Go max.",
      "Format Micro-ATX · 244 × 244 mm",
      "2 ports M.2",
      "Ethernet 1 Gb/s · HDMI et DisplayPort"
    ],
    "socket": "AM4",
    "memoryType": "DDR4",
    "formFactor": "Micro-ATX",
    "maxMemoryGB": 128,
    "memorySlots": 4,
    "m2Slots": 2,
    "rgb": false,
    "color": "#252a30",
    "accent": "#c1c5c9"
  },
  {
    "id": "mb-b550-aorus-elite-v2",
    "category": "motherboard",
    "brand": "Gigabyte",
    "name": "B550 AORUS ELITE V2",
    "price": 129.9,
    "description": "Carte mère ATX pour AM4, avec 4 emplacements DDR4 et 2 ports M.2. Ethernet 2,5 Gb/s · Q-Flash Plus.",
    "specs": [
      "Socket AM4",
      "DDR4 · 4 emplacements · 128 Go max.",
      "Format ATX · 305 × 244 mm",
      "2 ports M.2",
      "Ethernet 2,5 Gb/s · Q-Flash Plus"
    ],
    "socket": "AM4",
    "memoryType": "DDR4",
    "formFactor": "ATX",
    "maxMemoryGB": 128,
    "memorySlots": 4,
    "m2Slots": 2,
    "rgb": true,
    "color": "#252a30",
    "accent": "#454b53"
  },
  {
    "id": "mb-b650-aorus-elite-ax",
    "category": "motherboard",
    "brand": "Gigabyte",
    "name": "B650 AORUS ELITE AX",
    "price": 219.9,
    "description": "Carte mère ATX pour AM5, avec 4 emplacements DDR5 et 3 ports M.2. Wi-Fi 6E · Ethernet 2,5 Gb/s.",
    "specs": [
      "Socket AM5",
      "DDR5 · 4 emplacements · 128 Go max.",
      "Format ATX · 305 × 244 mm",
      "3 ports M.2",
      "Wi-Fi 6E · Ethernet 2,5 Gb/s"
    ],
    "socket": "AM5",
    "memoryType": "DDR5",
    "formFactor": "ATX",
    "maxMemoryGB": 128,
    "memorySlots": 4,
    "m2Slots": 3,
    "rgb": true,
    "color": "#252a30",
    "accent": "#515862"
  },
  {
    "id": "mb-b650e-strix-f",
    "category": "motherboard",
    "brand": "ASUS",
    "name": "ROG STRIX B650E-F GAMING WIFI",
    "price": 259.9,
    "description": "Carte mère ATX pour AM5, avec 4 emplacements DDR5 et 3 ports M.2. PCIe 5.0 x16 · Wi-Fi 6E.",
    "specs": [
      "Socket AM5",
      "DDR5 · 4 emplacements · 128 Go max.",
      "Format ATX · 305 × 244 mm",
      "3 ports M.2",
      "PCIe 5.0 x16 · Wi-Fi 6E"
    ],
    "socket": "AM5",
    "memoryType": "DDR5",
    "formFactor": "ATX",
    "maxMemoryGB": 128,
    "memorySlots": 4,
    "m2Slots": 3,
    "rgb": true,
    "color": "#252a30",
    "accent": "#272b33"
  },
  {
    "id": "mb-b650e-steel-legend",
    "category": "motherboard",
    "brand": "ASRock",
    "name": "B650E Steel Legend WiFi",
    "price": 249.9,
    "description": "Carte mère ATX pour AM5, avec 4 emplacements DDR5 et 3 ports M.2. PCIe 5.0 x16 · Wi-Fi 6E.",
    "specs": [
      "Socket AM5",
      "DDR5 · 4 emplacements · 128 Go max.",
      "Format ATX · 305 × 244 mm",
      "3 ports M.2",
      "PCIe 5.0 x16 · Wi-Fi 6E"
    ],
    "socket": "AM5",
    "memoryType": "DDR5",
    "formFactor": "ATX",
    "maxMemoryGB": 128,
    "memorySlots": 4,
    "m2Slots": 3,
    "rgb": true,
    "color": "#252a30",
    "accent": "#d1d4d9"
  },
  {
    "id": "mb-b650i-edge",
    "category": "motherboard",
    "brand": "MSI",
    "name": "MPG B650I EDGE WIFI",
    "price": 249.9,
    "description": "Carte mère Mini-ITX pour AM5, avec 2 emplacements DDR5 et 2 ports M.2. Wi-Fi 6E · Ethernet 2,5 Gb/s.",
    "specs": [
      "Socket AM5",
      "DDR5 · 2 emplacements · 96 Go max.",
      "Format Mini-ITX · 170 × 170 mm",
      "2 ports M.2",
      "Wi-Fi 6E · Ethernet 2,5 Gb/s"
    ],
    "socket": "AM5",
    "memoryType": "DDR5",
    "formFactor": "Mini-ITX",
    "maxMemoryGB": 96,
    "memorySlots": 2,
    "m2Slots": 2,
    "rgb": false,
    "color": "#252a30",
    "accent": "#c3c8d0"
  },
  {
    "id": "mb-b650e-strix-i",
    "category": "motherboard",
    "brand": "ASUS",
    "name": "ROG STRIX B650E-I GAMING WIFI",
    "price": 299.9,
    "description": "Carte mère Mini-ITX pour AM5, avec 2 emplacements DDR5 et 2 ports M.2. PCIe 5.0 x16 · Wi-Fi 6E.",
    "specs": [
      "Socket AM5",
      "DDR5 · 2 emplacements · 96 Go max.",
      "Format Mini-ITX · 170 × 170 mm",
      "2 ports M.2",
      "PCIe 5.0 x16 · Wi-Fi 6E"
    ],
    "socket": "AM5",
    "memoryType": "DDR5",
    "formFactor": "Mini-ITX",
    "maxMemoryGB": 96,
    "memorySlots": 2,
    "m2Slots": 2,
    "rgb": false,
    "color": "#252a30",
    "accent": "#343944"
  },
  {
    "id": "mb-b760-ds3h-ddr4",
    "category": "motherboard",
    "brand": "Gigabyte",
    "name": "B760 DS3H DDR4",
    "price": 119.9,
    "description": "Carte mère ATX pour LGA1700, avec 4 emplacements DDR4 et 2 ports M.2. Ethernet 2,5 Gb/s · Q-Flash Plus.",
    "specs": [
      "Socket LGA1700",
      "DDR4 · 4 emplacements · 128 Go max.",
      "Format ATX · 305 × 244 mm",
      "2 ports M.2",
      "Ethernet 2,5 Gb/s · Q-Flash Plus"
    ],
    "socket": "LGA1700",
    "memoryType": "DDR4",
    "formFactor": "ATX",
    "maxMemoryGB": 128,
    "memorySlots": 4,
    "m2Slots": 2,
    "rgb": false,
    "color": "#252a30",
    "accent": "#444b53"
  },
  {
    "id": "mb-z690-pro-a-ddr4",
    "category": "motherboard",
    "brand": "MSI",
    "name": "PRO Z690-A DDR4",
    "price": 169.9,
    "description": "Carte mère ATX pour LGA1700, avec 4 emplacements DDR4 et 4 ports M.2. PCIe 5.0 x16 · Ethernet 2,5 Gb/s.",
    "specs": [
      "Socket LGA1700",
      "DDR4 · 4 emplacements · 128 Go max.",
      "Format ATX · 305 × 244 mm",
      "4 ports M.2",
      "PCIe 5.0 x16 · Ethernet 2,5 Gb/s"
    ],
    "socket": "LGA1700",
    "memoryType": "DDR4",
    "formFactor": "ATX",
    "maxMemoryGB": 128,
    "memorySlots": 4,
    "m2Slots": 4,
    "rgb": false,
    "color": "#252a30",
    "accent": "#464b50"
  },
  {
    "id": "mb-z790-strix-a",
    "category": "motherboard",
    "brand": "ASUS",
    "name": "ROG STRIX Z790-A GAMING WIFI",
    "price": 329.9,
    "description": "Carte mère ATX pour LGA1700, avec 4 emplacements DDR5 et 4 ports M.2. Wi-Fi 6E · Ethernet 2,5 Gb/s.",
    "specs": [
      "Socket LGA1700",
      "DDR5 · 4 emplacements · 192 Go max.",
      "Format ATX · 305 × 244 mm",
      "4 ports M.2",
      "Wi-Fi 6E · Ethernet 2,5 Gb/s"
    ],
    "socket": "LGA1700",
    "memoryType": "DDR5",
    "formFactor": "ATX",
    "maxMemoryGB": 192,
    "memorySlots": 4,
    "m2Slots": 4,
    "rgb": true,
    "color": "#252a30",
    "accent": "#d5d9de"
  },
  {
    "id": "gpu-4060-asus-dual",
    "category": "gpu",
    "brand": "ASUS",
    "name": "Dual GeForce RTX 4060 OC Edition",
    "price": 299.9,
    "description": "8 Go de mémoire vidéo, 2 ventilateurs et une enveloppe de 115 W. Dimensions de cette version constructeur ; vérifier le dégagement avec un radiateur en façade.",
    "specs": [
      "8 Go GDDR6",
      "115 W · alimentation conseillée 550 W",
      "227.2 × 123.24 × 49.6 mm",
      "2 ventilateurs",
      "Sans éclairage RGB"
    ],
    "capacityGB": 8,
    "powerW": 115,
    "gamingScore": 50,
    "creationScore": 48,
    "lengthMm": 227.2,
    "heightMm": 123.24,
    "thicknessMm": 49.6,
    "fanCount": 2,
    "fanSizeMm": 90,
    "recommendedPsuW": 550,
    "color": "#353a40",
    "rgb": false,
    "accent": "#779ca7"
  },
  {
    "id": "gpu-4070-asus-dual",
    "category": "gpu",
    "brand": "ASUS",
    "name": "Dual GeForce RTX 4070 OC Edition",
    "price": 549.9,
    "description": "12 Go de mémoire vidéo, 2 ventilateurs et une enveloppe de 200 W. Dimensions de cette version constructeur ; vérifier le dégagement avec un radiateur en façade.",
    "specs": [
      "12 Go GDDR6X",
      "200 W · alimentation conseillée 650 W",
      "267.01 × 133.94 × 51.13 mm",
      "2 ventilateurs",
      "Sans éclairage RGB"
    ],
    "capacityGB": 12,
    "powerW": 200,
    "gamingScore": 78,
    "creationScore": 80,
    "lengthMm": 267.01,
    "heightMm": 133.94,
    "thicknessMm": 51.13,
    "fanCount": 2,
    "fanSizeMm": 100,
    "recommendedPsuW": 650,
    "color": "#41464e",
    "rgb": false,
    "accent": "#779ca7"
  },
  {
    "id": "gpu-4070-fe",
    "category": "gpu",
    "brand": "NVIDIA",
    "name": "GeForce RTX 4070 Founders Edition",
    "price": 549.9,
    "description": "12 Go de mémoire vidéo, 2 ventilateurs et une enveloppe de 200 W. Dimensions de cette version constructeur ; vérifier le dégagement avec un radiateur en façade.",
    "specs": [
      "12 Go GDDR6X",
      "200 W · alimentation conseillée 650 W",
      "244 × 112 × 40 mm",
      "2 ventilateurs",
      "Sans éclairage RGB"
    ],
    "capacityGB": 12,
    "powerW": 200,
    "gamingScore": 78,
    "creationScore": 80,
    "lengthMm": 244,
    "heightMm": 112,
    "thicknessMm": 40,
    "fanCount": 2,
    "fanSizeMm": 90,
    "recommendedPsuW": 650,
    "color": "#acaeab",
    "rgb": false,
    "accent": "#779ca7"
  },
  {
    "id": "gpu-3070-fe",
    "category": "gpu",
    "brand": "NVIDIA",
    "name": "GeForce RTX 3070 Founders Edition",
    "price": 349.9,
    "description": "8 Go de mémoire vidéo, 2 ventilateurs et une enveloppe de 220 W. Dimensions de cette version constructeur ; vérifier le dégagement avec un radiateur en façade.",
    "specs": [
      "8 Go GDDR6",
      "220 W · alimentation conseillée 650 W",
      "242 × 112 × 40 mm",
      "2 ventilateurs",
      "Sans éclairage RGB"
    ],
    "capacityGB": 8,
    "powerW": 220,
    "gamingScore": 64,
    "creationScore": 62,
    "lengthMm": 242,
    "heightMm": 112,
    "thicknessMm": 40,
    "fanCount": 2,
    "fanSizeMm": 85,
    "recommendedPsuW": 650,
    "color": "#a7aaa8",
    "rgb": false,
    "accent": "#779ca7"
  },
  {
    "id": "gpu-3080-fe",
    "category": "gpu",
    "brand": "NVIDIA",
    "name": "GeForce RTX 3080 Founders Edition 10 Go",
    "price": 449.9,
    "description": "10 Go de mémoire vidéo, 2 ventilateurs et une enveloppe de 320 W. Dimensions de cette version constructeur ; vérifier le dégagement avec un radiateur en façade.",
    "specs": [
      "10 Go GDDR6X",
      "320 W · alimentation conseillée 750 W",
      "285 × 112 × 40 mm",
      "2 ventilateurs",
      "Sans éclairage RGB"
    ],
    "capacityGB": 10,
    "powerW": 320,
    "gamingScore": 84,
    "creationScore": 82,
    "lengthMm": 285,
    "heightMm": 112,
    "thicknessMm": 40,
    "fanCount": 2,
    "fanSizeMm": 90,
    "recommendedPsuW": 750,
    "color": "#9da29f",
    "rgb": false,
    "accent": "#779ca7"
  },
  {
    "id": "gpu-rx6800-ref",
    "category": "gpu",
    "brand": "AMD",
    "name": "Radeon RX 6800",
    "price": 369.9,
    "description": "16 Go de mémoire vidéo, 3 ventilateurs et une enveloppe de 250 W. Dimensions de cette version constructeur ; vérifier le dégagement avec un radiateur en façade.",
    "specs": [
      "16 Go GDDR6",
      "250 W · alimentation conseillée 650 W",
      "267 × 120 × 40 mm",
      "3 ventilateurs",
      "Sans éclairage RGB"
    ],
    "capacityGB": 16,
    "powerW": 250,
    "gamingScore": 72,
    "creationScore": 57,
    "lengthMm": 267,
    "heightMm": 120,
    "thicknessMm": 40,
    "fanCount": 3,
    "fanSizeMm": 80,
    "recommendedPsuW": 650,
    "color": "#aab0b4",
    "rgb": false,
    "accent": "#e45b5b"
  },
  {
    "id": "gpu-rx6800xt-ref",
    "category": "gpu",
    "brand": "AMD",
    "name": "Radeon RX 6800 XT",
    "price": 429.9,
    "description": "16 Go de mémoire vidéo, 3 ventilateurs et une enveloppe de 300 W. Dimensions de cette version constructeur ; vérifier le dégagement avec un radiateur en façade.",
    "specs": [
      "16 Go GDDR6",
      "300 W · alimentation conseillée 750 W",
      "267 × 120 × 50 mm",
      "3 ventilateurs",
      "Sans éclairage RGB"
    ],
    "capacityGB": 16,
    "powerW": 300,
    "gamingScore": 84,
    "creationScore": 68,
    "lengthMm": 267,
    "heightMm": 120,
    "thicknessMm": 50,
    "fanCount": 3,
    "fanSizeMm": 80,
    "recommendedPsuW": 750,
    "color": "#aab0b4",
    "rgb": false,
    "accent": "#e45b5b"
  },
  {
    "id": "gpu-rx6950xt-ref",
    "category": "gpu",
    "brand": "AMD",
    "name": "Radeon RX 6950 XT",
    "price": 499.9,
    "description": "16 Go de mémoire vidéo, 3 ventilateurs et une enveloppe de 335 W. Dimensions de cette version constructeur ; vérifier le dégagement avec un radiateur en façade.",
    "specs": [
      "16 Go GDDR6",
      "335 W · alimentation conseillée 850 W",
      "267 × 120 × 50 mm",
      "3 ventilateurs",
      "Éclairage RGB"
    ],
    "capacityGB": 16,
    "powerW": 335,
    "gamingScore": 96,
    "creationScore": 76,
    "lengthMm": 267,
    "heightMm": 120,
    "thicknessMm": 50,
    "fanCount": 3,
    "fanSizeMm": 80,
    "recommendedPsuW": 850,
    "color": "#31363d",
    "rgb": true,
    "accent": "#e45b5b"
  },
  {
    "id": "gpu-rx7900xt-ref",
    "category": "gpu",
    "brand": "AMD",
    "name": "Radeon RX 7900 XT",
    "price": 649.9,
    "description": "20 Go de mémoire vidéo, 3 ventilateurs et une enveloppe de 315 W. Dimensions de cette version constructeur ; vérifier le dégagement avec un radiateur en façade.",
    "specs": [
      "20 Go GDDR6",
      "315 W · alimentation conseillée 750 W",
      "276 × 110 × 51 mm",
      "3 ventilateurs",
      "Sans éclairage RGB"
    ],
    "capacityGB": 20,
    "powerW": 315,
    "gamingScore": 108,
    "creationScore": 85,
    "lengthMm": 276,
    "heightMm": 110,
    "thicknessMm": 51,
    "fanCount": 3,
    "fanSizeMm": 80,
    "recommendedPsuW": 750,
    "color": "#30353c",
    "rgb": false,
    "accent": "#e45b5b"
  },
  {
    "id": "gpu-6650xt-pulse",
    "category": "gpu",
    "brand": "Sapphire",
    "name": "PULSE Radeon RX 6650 XT",
    "price": 229.9,
    "description": "8 Go de mémoire vidéo, 2 ventilateurs et une enveloppe de 180 W. Dimensions de cette version constructeur ; vérifier le dégagement avec un radiateur en façade.",
    "specs": [
      "8 Go GDDR6",
      "180 W · alimentation conseillée 500 W",
      "240 × 119.85 × 44.75 mm",
      "2 ventilateurs",
      "Sans éclairage RGB"
    ],
    "capacityGB": 8,
    "powerW": 180,
    "gamingScore": 48,
    "creationScore": 38,
    "lengthMm": 240,
    "heightMm": 119.85,
    "thicknessMm": 44.75,
    "fanCount": 2,
    "fanSizeMm": 95,
    "recommendedPsuW": 500,
    "color": "#363c43",
    "rgb": false,
    "accent": "#e45b5b"
  },
  {
    "id": "gpu-6750xt-pulse",
    "category": "gpu",
    "brand": "Sapphire",
    "name": "PULSE Radeon RX 6750 XT",
    "price": 299.9,
    "description": "12 Go de mémoire vidéo, 2 ventilateurs et une enveloppe de 250 W. Dimensions de cette version constructeur ; vérifier le dégagement avec un radiateur en façade.",
    "specs": [
      "12 Go GDDR6",
      "250 W · alimentation conseillée 650 W",
      "280 × 120.25 × 49 mm",
      "2 ventilateurs",
      "Sans éclairage RGB"
    ],
    "capacityGB": 12,
    "powerW": 250,
    "gamingScore": 62,
    "creationScore": 48,
    "lengthMm": 280,
    "heightMm": 120.25,
    "thicknessMm": 49,
    "fanCount": 2,
    "fanSizeMm": 95,
    "recommendedPsuW": 650,
    "color": "#343a41",
    "rgb": false,
    "accent": "#e45b5b"
  },
  {
    "id": "gpu-7900gre-pulse",
    "category": "gpu",
    "brand": "Sapphire",
    "name": "PULSE Radeon RX 7900 GRE",
    "price": 549.9,
    "description": "16 Go de mémoire vidéo, 3 ventilateurs et une enveloppe de 268 W. Dimensions de cette version constructeur ; vérifier le dégagement avec un radiateur en façade.",
    "specs": [
      "16 Go GDDR6",
      "268 W · alimentation conseillée 700 W",
      "320 × 128.75 × 52.57 mm",
      "3 ventilateurs",
      "Sans éclairage RGB"
    ],
    "capacityGB": 16,
    "powerW": 268,
    "gamingScore": 95,
    "creationScore": 73,
    "lengthMm": 320,
    "heightMm": 128.75,
    "thicknessMm": 52.57,
    "fanCount": 3,
    "fanSizeMm": 95,
    "recommendedPsuW": 700,
    "color": "#343a41",
    "rgb": false,
    "accent": "#e45b5b"
  },
  {
    "id": "gpu-7600xt-pulse",
    "category": "gpu",
    "brand": "Sapphire",
    "name": "PULSE Radeon RX 7600 XT",
    "price": 319.9,
    "description": "16 Go de mémoire vidéo, 2 ventilateurs et une enveloppe de 192 W. Dimensions de cette version constructeur ; vérifier le dégagement avec un radiateur en façade.",
    "specs": [
      "16 Go GDDR6",
      "192 W · alimentation conseillée 600 W",
      "250 × 129.25 × 44.56 mm",
      "2 ventilateurs",
      "Sans éclairage RGB"
    ],
    "capacityGB": 16,
    "powerW": 192,
    "gamingScore": 53,
    "creationScore": 41,
    "lengthMm": 250,
    "heightMm": 129.25,
    "thicknessMm": 44.56,
    "fanCount": 2,
    "fanSizeMm": 95,
    "recommendedPsuW": 600,
    "color": "#343a41",
    "rgb": false,
    "accent": "#e45b5b"
  },
  {
    "id": "gpu-a770-le",
    "category": "gpu",
    "brand": "Intel",
    "name": "Arc A770 Limited Edition 16 Go",
    "price": 299.9,
    "description": "16 Go de mémoire vidéo, 2 ventilateurs et une enveloppe de 225 W. Resizable BAR recommandé pour profiter des performances de cette carte.",
    "specs": [
      "16 Go GDDR6",
      "225 W · alimentation conseillée 600 W",
      "280 × 115 × 42 mm",
      "2 ventilateurs",
      "Éclairage RGB"
    ],
    "capacityGB": 16,
    "powerW": 225,
    "gamingScore": 52,
    "creationScore": 55,
    "lengthMm": 280,
    "heightMm": 115,
    "thicknessMm": 42,
    "fanCount": 2,
    "fanSizeMm": 90,
    "recommendedPsuW": 600,
    "color": "#2a2e36",
    "rgb": true,
    "accent": "#779ca7"
  },
  {
    "id": "ram-fury-ddr5-32-6000",
    "category": "ram",
    "brand": "Kingston",
    "name": "FURY Beast 32 Go DDR5-6000 EXPO",
    "price": 109.9,
    "description": "Kit de deux barrettes de 16 Go, hauteur 34.9 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "32 Go · 2 × 16 Go",
      "DDR5-6000 · CL36",
      "Hauteur 34.9 mm",
      "KF560C36BBEK2-32"
    ],
    "memoryType": "DDR5",
    "capacityGB": 32,
    "memorySticks": 2,
    "heightMm": 34.9,
    "lengthMm": 133.35,
    "thicknessMm": 6.62,
    "rgb": false,
    "color": "#292e35",
    "accent": "#8da6b4"
  },
  {
    "id": "ram-fury-ddr5-16-5200",
    "category": "ram",
    "brand": "Kingston",
    "name": "FURY Beast 16 Go DDR5-5200",
    "price": 64.9,
    "description": "Kit de deux barrettes de 8 Go, hauteur 34.9 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "16 Go · 2 × 8 Go",
      "DDR5-5200 · CL40",
      "Hauteur 34.9 mm",
      "KF552C40BBK2-16"
    ],
    "memoryType": "DDR5",
    "capacityGB": 16,
    "memorySticks": 2,
    "heightMm": 34.9,
    "lengthMm": 133.35,
    "thicknessMm": 6.62,
    "rgb": false,
    "color": "#292e35",
    "accent": "#8da6b4"
  },
  {
    "id": "ram-fury-ddr5-64-6000",
    "category": "ram",
    "brand": "Kingston",
    "name": "FURY Beast 64 Go DDR5-6000 EXPO",
    "price": 199.9,
    "description": "Kit de deux barrettes de 32 Go, hauteur 34.9 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "64 Go · 2 × 32 Go",
      "DDR5-6000 · CL36",
      "Hauteur 34.9 mm",
      "KF560C36BBEK2-64"
    ],
    "memoryType": "DDR5",
    "capacityGB": 64,
    "memorySticks": 2,
    "heightMm": 34.9,
    "lengthMm": 133.35,
    "thicknessMm": 6.62,
    "rgb": false,
    "color": "#292e35",
    "accent": "#8da6b4"
  },
  {
    "id": "ram-vengeance-ddr5-64-5600",
    "category": "ram",
    "brand": "Corsair",
    "name": "Vengeance 64 Go DDR5-5600",
    "price": 179.9,
    "description": "Kit de deux barrettes de 32 Go, hauteur 35 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "64 Go · 2 × 32 Go",
      "DDR5-5600 · CL40",
      "Hauteur 35 mm",
      "CMK64GX5M2B5600C40"
    ],
    "memoryType": "DDR5",
    "capacityGB": 64,
    "memorySticks": 2,
    "heightMm": 35,
    "lengthMm": 135,
    "thicknessMm": 7,
    "rgb": false,
    "color": "#31363e",
    "accent": "#8da6b4"
  },
  {
    "id": "ram-dominator-titanium-32",
    "category": "ram",
    "brand": "Corsair",
    "name": "Dominator Titanium RGB 32 Go DDR5-6000",
    "price": 179.9,
    "description": "Kit de deux barrettes de 16 Go, hauteur 57 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "32 Go · 2 × 16 Go",
      "DDR5-6000 · CL30",
      "Hauteur 57 mm",
      "CMP32GX5M2B6000C30"
    ],
    "memoryType": "DDR5",
    "capacityGB": 32,
    "memorySticks": 2,
    "heightMm": 57,
    "lengthMm": 133,
    "thicknessMm": 7,
    "rgb": true,
    "color": "#343941",
    "accent": "#8da6b4"
  },
  {
    "id": "ram-delta-ddr5-32",
    "category": "ram",
    "brand": "TeamGroup",
    "name": "T-FORCE DELTA RGB 32 Go DDR5-6000",
    "price": 119.9,
    "description": "Kit de deux barrettes de 16 Go, hauteur 46.1 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "32 Go · 2 × 16 Go",
      "DDR5-6000 · CL30",
      "Hauteur 46.1 mm",
      "FF3D532G6000HC30DC01"
    ],
    "memoryType": "DDR5",
    "capacityGB": 32,
    "memorySticks": 2,
    "heightMm": 46.1,
    "lengthMm": 144.2,
    "thicknessMm": 7,
    "rgb": true,
    "color": "#343a43",
    "accent": "#8da6b4"
  },
  {
    "id": "ram-trident-neo-64",
    "category": "ram",
    "brand": "G.Skill",
    "name": "Trident Z5 Neo RGB 64 Go DDR5-6000",
    "price": 229.9,
    "description": "Kit de deux barrettes de 32 Go, hauteur 44 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "64 Go · 2 × 32 Go",
      "DDR5-6000 · CL30",
      "Hauteur 44 mm",
      "F5-6000J3040G32GX2-TZ5NR"
    ],
    "memoryType": "DDR5",
    "capacityGB": 64,
    "memorySticks": 2,
    "heightMm": 44,
    "lengthMm": 133.35,
    "thicknessMm": 8.4,
    "rgb": true,
    "color": "#353a42",
    "accent": "#8da6b4"
  },
  {
    "id": "ram-trident-ddr4-32",
    "category": "ram",
    "brand": "G.Skill",
    "name": "Trident Z RGB 32 Go DDR4-3600",
    "price": 89.9,
    "description": "Kit de deux barrettes de 16 Go, hauteur 44 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "32 Go · 2 × 16 Go",
      "DDR4-3600 · CL18",
      "Hauteur 44 mm",
      "F4-3600C18D-32GTZR"
    ],
    "memoryType": "DDR4",
    "capacityGB": 32,
    "memorySticks": 2,
    "heightMm": 44,
    "lengthMm": 133.35,
    "thicknessMm": 8.5,
    "rgb": true,
    "color": "#444b53",
    "accent": "#8da6b4"
  },
  {
    "id": "ram-vengeance-rgb-pro-32",
    "category": "ram",
    "brand": "Corsair",
    "name": "Vengeance RGB PRO 32 Go DDR4-3600",
    "price": 89.9,
    "description": "Kit de deux barrettes de 16 Go, hauteur 51 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "32 Go · 2 × 16 Go",
      "DDR4-3600 · CL18",
      "Hauteur 51 mm",
      "CMW32GX4M2D3600C18"
    ],
    "memoryType": "DDR4",
    "capacityGB": 32,
    "memorySticks": 2,
    "heightMm": 51,
    "lengthMm": 138.3,
    "thicknessMm": 7.5,
    "rgb": true,
    "color": "#2b3037",
    "accent": "#8da6b4"
  },
  {
    "id": "ram-lpx-ddr4-16-3200",
    "category": "ram",
    "brand": "Corsair",
    "name": "Vengeance LPX 16 Go DDR4-3200",
    "price": 39.9,
    "description": "Kit de deux barrettes de 8 Go, hauteur 34 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "16 Go · 2 × 8 Go",
      "DDR4-3200 · CL16",
      "Hauteur 34 mm",
      "CMK16GX4M2B3200C16"
    ],
    "memoryType": "DDR4",
    "capacityGB": 16,
    "memorySticks": 2,
    "heightMm": 34,
    "lengthMm": 135,
    "thicknessMm": 7,
    "rgb": false,
    "color": "#30353c",
    "accent": "#8da6b4"
  },
  {
    "id": "ram-fury-ddr4-32-3600",
    "category": "ram",
    "brand": "Kingston",
    "name": "FURY Beast 32 Go DDR4-3600",
    "price": 69.9,
    "description": "Kit de deux barrettes de 16 Go, hauteur 34.1 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "32 Go · 2 × 16 Go",
      "DDR4-3600 · CL18",
      "Hauteur 34.1 mm",
      "KF436C18BBK2/32"
    ],
    "memoryType": "DDR4",
    "capacityGB": 32,
    "memorySticks": 2,
    "heightMm": 34.1,
    "lengthMm": 133.35,
    "thicknessMm": 7.2,
    "rgb": false,
    "color": "#30353c",
    "accent": "#8da6b4"
  },
  {
    "id": "ram-ripjaws-ddr4-16-3600",
    "category": "ram",
    "brand": "G.Skill",
    "name": "Ripjaws V 16 Go DDR4-3600",
    "price": 44.9,
    "description": "Kit de deux barrettes de 8 Go, hauteur 42 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "16 Go · 2 × 8 Go",
      "DDR4-3600 · CL18",
      "Hauteur 42 mm",
      "F4-3600C18D-16GVK"
    ],
    "memoryType": "DDR4",
    "capacityGB": 16,
    "memorySticks": 2,
    "heightMm": 42,
    "lengthMm": 133.35,
    "thicknessMm": 8,
    "rgb": false,
    "color": "#30353c",
    "accent": "#8da6b4"
  },
  {
    "id": "ram-vulcan-ddr4-32",
    "category": "ram",
    "brand": "TeamGroup",
    "name": "T-FORCE VULCAN Z 32 Go DDR4-3200",
    "price": 59.9,
    "description": "Kit de deux barrettes de 16 Go, hauteur 32 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "32 Go · 2 × 16 Go",
      "DDR4-3200 · CL16",
      "Hauteur 32 mm",
      "TLZGD432G3200HC16FDC01"
    ],
    "memoryType": "DDR4",
    "capacityGB": 32,
    "memorySticks": 2,
    "heightMm": 32,
    "lengthMm": 140,
    "thicknessMm": 7,
    "rgb": false,
    "color": "#686f77",
    "accent": "#8da6b4"
  },
  {
    "id": "ram-lpx-ddr4-64-3200",
    "category": "ram",
    "brand": "Corsair",
    "name": "Vengeance LPX 64 Go DDR4-3200",
    "price": 129.9,
    "description": "Kit de deux barrettes de 32 Go, hauteur 34 mm. La fréquence annoncée dépend du profil mémoire et de la plateforme.",
    "specs": [
      "64 Go · 2 × 32 Go",
      "DDR4-3200 · CL16",
      "Hauteur 34 mm",
      "CMK64GX4M2E3200C16"
    ],
    "memoryType": "DDR4",
    "capacityGB": 64,
    "memorySticks": 2,
    "heightMm": 34,
    "lengthMm": 135,
    "thicknessMm": 7,
    "rgb": false,
    "color": "#30353c",
    "accent": "#8da6b4"
  },
  {
    "id": "ssd-970evo-1",
    "category": "storage",
    "brand": "Samsung",
    "name": "970 EVO Plus 1 To",
    "price": 79.9,
    "description": "SSD M.2 2280 NVMe PCIe 3.0 x4. Version sans dissipateur massif, compatible avec le cache M.2 de la carte mère.",
    "specs": [
      "1 To · M.2 2280",
      "NVMe PCIe 3.0 x4",
      "Lecture jusqu’à 3500 Mo/s · écriture jusqu’à 3300 Mo/s",
      "Sans dissipateur massif"
    ],
    "capacityGB": 1000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 22,
    "lengthMm": 80,
    "heightMm": 2.38,
    "color": "#293039",
    "accent": "#383e43",
    "rgb": false
  },
  {
    "id": "ssd-970evo-2",
    "category": "storage",
    "brand": "Samsung",
    "name": "970 EVO Plus 2 To",
    "price": 139.9,
    "description": "SSD M.2 2280 NVMe PCIe 3.0 x4. Version sans dissipateur massif, compatible avec le cache M.2 de la carte mère.",
    "specs": [
      "2 To · M.2 2280",
      "NVMe PCIe 3.0 x4",
      "Lecture jusqu’à 3500 Mo/s · écriture jusqu’à 3300 Mo/s",
      "Sans dissipateur massif"
    ],
    "capacityGB": 2000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 22,
    "lengthMm": 80,
    "heightMm": 2.38,
    "color": "#293039",
    "accent": "#383e43",
    "rgb": false
  },
  {
    "id": "ssd-980-1",
    "category": "storage",
    "brand": "Samsung",
    "name": "980 1 To",
    "price": 69.9,
    "description": "SSD M.2 2280 NVMe PCIe 3.0 x4. Version sans dissipateur massif, compatible avec le cache M.2 de la carte mère.",
    "specs": [
      "1 To · M.2 2280",
      "NVMe PCIe 3.0 x4",
      "Lecture jusqu’à 3500 Mo/s · écriture jusqu’à 3000 Mo/s",
      "Sans dissipateur massif"
    ],
    "capacityGB": 1000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 22,
    "lengthMm": 80,
    "heightMm": 2.38,
    "color": "#293039",
    "accent": "#383e43",
    "rgb": false
  },
  {
    "id": "ssd-sn570-1",
    "category": "storage",
    "brand": "Western Digital",
    "name": "WD Blue SN570 1 To",
    "price": 64.9,
    "description": "SSD M.2 2280 NVMe PCIe 3.0 x4. Version sans dissipateur massif, compatible avec le cache M.2 de la carte mère.",
    "specs": [
      "1 To · M.2 2280",
      "NVMe PCIe 3.0 x4",
      "Lecture jusqu’à 3500 Mo/s · écriture jusqu’à 3000 Mo/s",
      "Sans dissipateur massif"
    ],
    "capacityGB": 1000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 22,
    "lengthMm": 80,
    "heightMm": 2.38,
    "color": "#293039",
    "accent": "#386b98",
    "rgb": false
  },
  {
    "id": "ssd-sn580-2",
    "category": "storage",
    "brand": "Western Digital",
    "name": "WD Blue SN580 2 To",
    "price": 109.9,
    "description": "SSD M.2 2280 NVMe PCIe 4.0 x4. Version sans dissipateur massif, compatible avec le cache M.2 de la carte mère.",
    "specs": [
      "2 To · M.2 2280",
      "NVMe PCIe 4.0 x4",
      "Lecture jusqu’à 4150 Mo/s · écriture jusqu’à 4150 Mo/s",
      "Sans dissipateur massif"
    ],
    "capacityGB": 2000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 22,
    "lengthMm": 80,
    "heightMm": 2.38,
    "color": "#293039",
    "accent": "#477ca4",
    "rgb": false
  },
  {
    "id": "ssd-sn850x-1",
    "category": "storage",
    "brand": "Western Digital",
    "name": "WD BLACK SN850X 1 To",
    "price": 89.9,
    "description": "SSD M.2 2280 NVMe PCIe 4.0 x4. Version sans dissipateur massif, compatible avec le cache M.2 de la carte mère.",
    "specs": [
      "1 To · M.2 2280",
      "NVMe PCIe 4.0 x4",
      "Lecture jusqu’à 7300 Mo/s · écriture jusqu’à 6300 Mo/s",
      "Sans dissipateur massif"
    ],
    "capacityGB": 1000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 22,
    "lengthMm": 80,
    "heightMm": 2.38,
    "color": "#293039",
    "accent": "#383d44",
    "rgb": false
  },
  {
    "id": "ssd-sn850x-4",
    "category": "storage",
    "brand": "Western Digital",
    "name": "WD BLACK SN850X 4 To",
    "price": 289.9,
    "description": "SSD M.2 2280 NVMe PCIe 4.0 x4. Version sans dissipateur massif, compatible avec le cache M.2 de la carte mère.",
    "specs": [
      "4 To · M.2 2280",
      "NVMe PCIe 4.0 x4",
      "Lecture jusqu’à 7300 Mo/s · écriture jusqu’à 6600 Mo/s",
      "Sans dissipateur massif"
    ],
    "capacityGB": 4000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 22,
    "lengthMm": 80,
    "heightMm": 2.38,
    "color": "#293039",
    "accent": "#383d44",
    "rgb": false
  },
  {
    "id": "ssd-t500-1",
    "category": "storage",
    "brand": "Crucial",
    "name": "T500 1 To",
    "price": 89.9,
    "description": "SSD M.2 2280 NVMe PCIe 4.0 x4. Version sans dissipateur massif, compatible avec le cache M.2 de la carte mère.",
    "specs": [
      "1 To · M.2 2280",
      "NVMe PCIe 4.0 x4",
      "Lecture jusqu’à 7300 Mo/s · écriture jusqu’à 6800 Mo/s",
      "Sans dissipateur massif"
    ],
    "capacityGB": 1000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 22,
    "lengthMm": 80,
    "heightMm": 2.3,
    "color": "#293039",
    "accent": "#d0d7dc",
    "rgb": false
  },
  {
    "id": "ssd-p5plus-2",
    "category": "storage",
    "brand": "Crucial",
    "name": "P5 Plus 2 To",
    "price": 139.9,
    "description": "SSD M.2 2280 NVMe PCIe 4.0 x4. Version sans dissipateur massif, compatible avec le cache M.2 de la carte mère.",
    "specs": [
      "2 To · M.2 2280",
      "NVMe PCIe 4.0 x4",
      "Lecture jusqu’à 6600 Mo/s · écriture jusqu’à 5000 Mo/s",
      "Sans dissipateur massif"
    ],
    "capacityGB": 2000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 22,
    "lengthMm": 80,
    "heightMm": 2.4,
    "color": "#293039",
    "accent": "#cbd3db",
    "rgb": false
  },
  {
    "id": "ssd-kc3000-1",
    "category": "storage",
    "brand": "Kingston",
    "name": "KC3000 1 To",
    "price": 84.9,
    "description": "SSD M.2 2280 NVMe PCIe 4.0 x4. Version sans dissipateur massif, compatible avec le cache M.2 de la carte mère.",
    "specs": [
      "1 To · M.2 2280",
      "NVMe PCIe 4.0 x4",
      "Lecture jusqu’à 7000 Mo/s · écriture jusqu’à 6000 Mo/s",
      "Sans dissipateur massif"
    ],
    "capacityGB": 1000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 22,
    "lengthMm": 80,
    "heightMm": 2.21,
    "color": "#293039",
    "accent": "#666c74",
    "rgb": false
  },
  {
    "id": "ssd-fury-renegade-2",
    "category": "storage",
    "brand": "Kingston",
    "name": "FURY Renegade 2 To",
    "price": 149.9,
    "description": "SSD M.2 2280 NVMe PCIe 4.0 x4. Version sans dissipateur massif, compatible avec le cache M.2 de la carte mère.",
    "specs": [
      "2 To · M.2 2280",
      "NVMe PCIe 4.0 x4",
      "Lecture jusqu’à 7300 Mo/s · écriture jusqu’à 7000 Mo/s",
      "Sans dissipateur massif"
    ],
    "capacityGB": 2000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 22,
    "lengthMm": 80,
    "heightMm": 3.5,
    "color": "#293039",
    "accent": "#424950",
    "rgb": false
  },
  {
    "id": "ssd-firecuda530-2",
    "category": "storage",
    "brand": "Seagate",
    "name": "FireCuda 530 2 To",
    "price": 159.9,
    "description": "SSD M.2 2280 NVMe PCIe 4.0 x4. Version sans dissipateur massif, compatible avec le cache M.2 de la carte mère.",
    "specs": [
      "2 To · M.2 2280",
      "NVMe PCIe 4.0 x4",
      "Lecture jusqu’à 7300 Mo/s · écriture jusqu’à 6900 Mo/s",
      "Sans dissipateur massif"
    ],
    "capacityGB": 2000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 22,
    "lengthMm": 80,
    "heightMm": 3.58,
    "color": "#293039",
    "accent": "#5b5650",
    "rgb": false
  },
  {
    "id": "ssd-mp600-lpx-2",
    "category": "storage",
    "brand": "Corsair",
    "name": "MP600 PRO LPX 2 To",
    "price": 149.9,
    "description": "SSD M.2 2280 NVMe PCIe 4.0 x4. Dissipateur aluminium fourni : vérifier le dégagement sous celui de la carte mère.",
    "specs": [
      "2 To · M.2 2280",
      "NVMe PCIe 4.0 x4",
      "Lecture jusqu’à 7100 Mo/s · écriture jusqu’à 6800 Mo/s",
      "Dissipateur inclus"
    ],
    "capacityGB": 2000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 23,
    "lengthMm": 80,
    "heightMm": 11,
    "color": "#293039",
    "accent": "#353a40",
    "rgb": false
  },
  {
    "id": "ssd-980pro-2",
    "category": "storage",
    "brand": "Samsung",
    "name": "980 PRO 2 To",
    "price": 149.9,
    "description": "SSD M.2 2280 NVMe PCIe 4.0 x4. Version sans dissipateur massif, compatible avec le cache M.2 de la carte mère.",
    "specs": [
      "2 To · M.2 2280",
      "NVMe PCIe 4.0 x4",
      "Lecture jusqu’à 7000 Mo/s · écriture jusqu’à 5100 Mo/s",
      "Sans dissipateur massif"
    ],
    "capacityGB": 2000,
    "storageInterface": "M.2 NVMe",
    "widthMm": 22,
    "lengthMm": 80,
    "heightMm": 2.38,
    "color": "#293039",
    "accent": "#3a3f46",
    "rgb": false
  },
  {
    "id": "cooler-nhd15-g2",
    "category": "cooler",
    "brand": "Noctua",
    "name": "NH-D15 G2",
    "price": 149.9,
    "description": "Refroidissement à air de 168 mm de haut. 8 caloducs · ventilateurs NF-A14x25r G2. Vérifiez aussi le dégagement au-dessus des barrettes.",
    "specs": [
      "Hauteur 168 mm",
      "2 ventilateurs",
      "8 caloducs",
      "AM4 · AM5 · LGA1700",
      "8 caloducs · ventilateurs NF-A14x25r G2"
    ],
    "supportedSockets": [
      "AM4",
      "AM5",
      "LGA1700"
    ],
    "heightMm": 168,
    "widthMm": 150,
    "depthMm": 152,
    "fanCount": 2,
    "fanSizeMm": 140,
    "recommendedCpuPowerW": 230,
    "coolingType": "air",
    "rgb": false,
    "color": "#c0c4c6",
    "accent": "#a5adb4"
  },
  {
    "id": "cooler-nhd12l",
    "category": "cooler",
    "brand": "Noctua",
    "name": "NH-D12L",
    "price": 89.9,
    "description": "Refroidissement à air de 145 mm de haut. Deux tours asymétriques · ventilateur NF-A12x25r. Vérifiez aussi le dégagement au-dessus des barrettes.",
    "specs": [
      "Hauteur 145 mm",
      "1 ventilateur",
      "5 caloducs",
      "AM4 · AM5 · LGA1700",
      "Deux tours asymétriques · ventilateur NF-A12x25r"
    ],
    "supportedSockets": [
      "AM4",
      "AM5",
      "LGA1700"
    ],
    "heightMm": 145,
    "widthMm": 125,
    "depthMm": 113,
    "fanCount": 1,
    "fanSizeMm": 120,
    "recommendedCpuPowerW": 170,
    "coolingType": "air",
    "rgb": false,
    "color": "#c0c4c6",
    "accent": "#a5adb4"
  },
  {
    "id": "cooler-l9i-17xx",
    "category": "cooler",
    "brand": "Noctua",
    "name": "NH-L9i-17xx chromax.black",
    "price": 59.9,
    "description": "Refroidissement à air de 37 mm de haut. Intel LGA1700 uniquement · ventilateur extra-plat. Vérifiez aussi le dégagement au-dessus des barrettes.",
    "specs": [
      "Hauteur 37 mm",
      "1 ventilateur",
      "2 caloducs",
      "LGA1700",
      "Intel LGA1700 uniquement · ventilateur extra-plat"
    ],
    "supportedSockets": [
      "LGA1700"
    ],
    "heightMm": 37,
    "widthMm": 95,
    "depthMm": 95,
    "fanCount": 1,
    "fanSizeMm": 92,
    "recommendedCpuPowerW": 75,
    "coolingType": "air",
    "rgb": false,
    "color": "#343941",
    "accent": "#a5adb4"
  },
  {
    "id": "cooler-ak620-digital",
    "category": "cooler",
    "brand": "DeepCool",
    "name": "AK620 DIGITAL",
    "price": 79.9,
    "description": "Refroidissement à air de 162 mm de haut. Écran de température · éclairage ARGB sur le capot. Vérifiez aussi le dégagement au-dessus des barrettes.",
    "specs": [
      "Hauteur 162 mm",
      "2 ventilateurs",
      "6 caloducs",
      "AM4 · AM5 · LGA1700",
      "Écran de température · éclairage ARGB sur le capot"
    ],
    "supportedSockets": [
      "AM4",
      "AM5",
      "LGA1700"
    ],
    "heightMm": 162,
    "widthMm": 129,
    "depthMm": 138,
    "fanCount": 2,
    "fanSizeMm": 120,
    "recommendedCpuPowerW": 220,
    "coolingType": "air",
    "rgb": true,
    "color": "#454b53",
    "accent": "#a5adb4"
  },
  {
    "id": "cooler-ak620-zero-dark",
    "category": "cooler",
    "brand": "DeepCool",
    "name": "AK620 ZERO DARK",
    "price": 74.9,
    "description": "Refroidissement à air de 160 mm de haut. Finition intégralement noire · 2 ventilateurs FK120. Vérifiez aussi le dégagement au-dessus des barrettes.",
    "specs": [
      "Hauteur 160 mm",
      "2 ventilateurs",
      "6 caloducs",
      "AM4 · AM5 · LGA1700",
      "Finition intégralement noire · 2 ventilateurs FK120"
    ],
    "supportedSockets": [
      "AM4",
      "AM5",
      "LGA1700"
    ],
    "heightMm": 160,
    "widthMm": 129,
    "depthMm": 138,
    "fanCount": 2,
    "fanSizeMm": 120,
    "recommendedCpuPowerW": 220,
    "coolingType": "air",
    "rgb": false,
    "color": "#31373e",
    "accent": "#a5adb4"
  },
  {
    "id": "cooler-lfiii420",
    "category": "cooler",
    "brand": "ARCTIC",
    "name": "Liquid Freezer III 420",
    "price": 119.9,
    "description": "Watercooling AIO prérempli de 420 mm avec 3 ventilateurs, pompe et tuyaux gainés. Vérifiez la longueur réelle et l’épaisseur avec les ventilateurs.",
    "specs": [
      "Radiateur 420 mm · 458 × 138 × 38 mm",
      "3 × 140 mm",
      "Ventilateurs sans RGB",
      "AM4 · AM5 · LGA1700",
      "Circuit fermé prérempli"
    ],
    "coolingType": "aio",
    "radiatorSizeMm": 420,
    "radiatorThicknessMm": 38,
    "supportedSockets": [
      "AM4",
      "AM5",
      "LGA1700"
    ],
    "heightMm": 68.5,
    "widthMm": 108.5,
    "depthMm": 91,
    "fanCount": 3,
    "fanSizeMm": 140,
    "color": "#30353c",
    "rgb": false,
    "accent": "#a7bbc8"
  },
  {
    "id": "cooler-lfiii360-argb-white",
    "category": "cooler",
    "brand": "ARCTIC",
    "name": "Liquid Freezer III 360 A-RGB White",
    "price": 109.9,
    "description": "Watercooling AIO prérempli de 360 mm avec 3 ventilateurs, pompe et tuyaux gainés. Vérifiez la longueur réelle et l’épaisseur avec les ventilateurs.",
    "specs": [
      "Radiateur 360 mm · 398 × 120 × 38 mm",
      "3 × 120 mm",
      "Ventilateurs ARGB",
      "AM4 · AM5 · LGA1700",
      "Circuit fermé prérempli"
    ],
    "coolingType": "aio",
    "radiatorSizeMm": 360,
    "radiatorThicknessMm": 38,
    "supportedSockets": [
      "AM4",
      "AM5",
      "LGA1700"
    ],
    "heightMm": 68.5,
    "widthMm": 108.5,
    "depthMm": 91,
    "fanCount": 3,
    "fanSizeMm": 120,
    "color": "#e4e7e9",
    "rgb": true,
    "accent": "#a7bbc8"
  },
  {
    "id": "cooler-h170i-lcd-420",
    "category": "cooler",
    "brand": "Corsair",
    "name": "iCUE H170i ELITE LCD XT",
    "price": 299.9,
    "description": "Watercooling AIO prérempli de 420 mm avec 3 ventilateurs, pompe et tuyaux gainés. Écran LCD sur la pompe.",
    "specs": [
      "Radiateur 420 mm · 457 × 140 × 27 mm",
      "3 × 140 mm",
      "Ventilateurs ARGB",
      "AM4 · AM5 · LGA1700",
      "Écran LCD"
    ],
    "coolingType": "aio",
    "radiatorSizeMm": 420,
    "radiatorThicknessMm": 27,
    "supportedSockets": [
      "AM4",
      "AM5",
      "LGA1700"
    ],
    "heightMm": 56,
    "widthMm": 65,
    "depthMm": 65,
    "fanCount": 3,
    "fanSizeMm": 140,
    "color": "#30353c",
    "rgb": true,
    "accent": "#a7bbc8"
  },
  {
    "id": "cooler-ek-nucleus360",
    "category": "cooler",
    "brand": "EK",
    "name": "Nucleus AIO CR360 Lux D-RGB",
    "price": 169.9,
    "description": "Watercooling AIO prérempli de 360 mm avec 3 ventilateurs, pompe et tuyaux gainés. Vérifiez la longueur réelle et l’épaisseur avec les ventilateurs.",
    "specs": [
      "Radiateur 360 mm · 400 × 124 × 27 mm",
      "3 × 120 mm",
      "Ventilateurs ARGB",
      "AM4 · AM5 · LGA1700",
      "Circuit fermé prérempli"
    ],
    "coolingType": "aio",
    "radiatorSizeMm": 360,
    "radiatorThicknessMm": 27,
    "supportedSockets": [
      "AM4",
      "AM5",
      "LGA1700"
    ],
    "heightMm": 61.6,
    "widthMm": 82.3,
    "depthMm": 69.2,
    "fanCount": 3,
    "fanSizeMm": 120,
    "color": "#30353c",
    "rgb": true,
    "accent": "#a7bbc8"
  },
  {
    "id": "cooler-silentloop2-360",
    "category": "cooler",
    "brand": "be quiet!",
    "name": "Silent Loop 2 360 mm",
    "price": 149.9,
    "description": "Watercooling AIO prérempli de 360 mm avec 3 ventilateurs, pompe et tuyaux gainés. Vérifiez la longueur réelle et l’épaisseur avec les ventilateurs.",
    "specs": [
      "Radiateur 360 mm · 394 × 120 × 27 mm",
      "3 × 120 mm",
      "Ventilateurs sans RGB",
      "AM4 · AM5 · LGA1700",
      "Circuit fermé prérempli"
    ],
    "coolingType": "aio",
    "radiatorSizeMm": 360,
    "radiatorThicknessMm": 27,
    "supportedSockets": [
      "AM4",
      "AM5",
      "LGA1700"
    ],
    "heightMm": 55,
    "widthMm": 80,
    "depthMm": 80,
    "fanCount": 3,
    "fanSizeMm": 120,
    "color": "#30353c",
    "rgb": true,
    "accent": "#a7bbc8"
  },
  {
    "id": "psu-rm650x-2021",
    "category": "psu",
    "brand": "Corsair",
    "name": "RM650x (2021)",
    "price": 99.9,
    "description": "Alimentation ATX 650 W, certification 80 PLUS Gold, profondeur 160 mm. Les câbles modulaires doivent rester ceux du fabricant pour ce modèle.",
    "specs": [
      "650 W · 80 PLUS Gold",
      "ATX · 150 × 86 × 160 mm",
      "Ventilateur 135 mm",
      "Câblage entièrement modulaire"
    ],
    "wattage": 650,
    "psuFormat": "ATX",
    "widthMm": 150,
    "heightMm": 86,
    "depthMm": 160,
    "fanSizeMm": 135,
    "color": "#292e35",
    "accent": "#9ba8b2",
    "rgb": false
  },
  {
    "id": "psu-rm750x-2021",
    "category": "psu",
    "brand": "Corsair",
    "name": "RM750x (2021)",
    "price": 119.9,
    "description": "Alimentation ATX 750 W, certification 80 PLUS Gold, profondeur 160 mm. Les câbles modulaires doivent rester ceux du fabricant pour ce modèle.",
    "specs": [
      "750 W · 80 PLUS Gold",
      "ATX · 150 × 86 × 160 mm",
      "Ventilateur 135 mm",
      "Câblage entièrement modulaire"
    ],
    "wattage": 750,
    "psuFormat": "ATX",
    "widthMm": 150,
    "heightMm": 86,
    "depthMm": 160,
    "fanSizeMm": 135,
    "color": "#292e35",
    "accent": "#9ba8b2",
    "rgb": false
  },
  {
    "id": "psu-rm850x-2021",
    "category": "psu",
    "brand": "Corsair",
    "name": "RM850x (2021)",
    "price": 139.9,
    "description": "Alimentation ATX 850 W, certification 80 PLUS Gold, profondeur 160 mm. Les câbles modulaires doivent rester ceux du fabricant pour ce modèle.",
    "specs": [
      "850 W · 80 PLUS Gold",
      "ATX · 150 × 86 × 160 mm",
      "Ventilateur 135 mm",
      "Câblage entièrement modulaire"
    ],
    "wattage": 850,
    "psuFormat": "ATX",
    "widthMm": 150,
    "heightMm": 86,
    "depthMm": 160,
    "fanSizeMm": 135,
    "color": "#292e35",
    "accent": "#9ba8b2",
    "rgb": false
  },
  {
    "id": "psu-rm1000x-2021",
    "category": "psu",
    "brand": "Corsair",
    "name": "RM1000x (2021)",
    "price": 169.9,
    "description": "Alimentation ATX 1000 W, certification 80 PLUS Gold, profondeur 180 mm. Les câbles modulaires doivent rester ceux du fabricant pour ce modèle.",
    "specs": [
      "1000 W · 80 PLUS Gold",
      "ATX · 150 × 86 × 180 mm",
      "Ventilateur 135 mm",
      "Câblage entièrement modulaire"
    ],
    "wattage": 1000,
    "psuFormat": "ATX",
    "widthMm": 150,
    "heightMm": 86,
    "depthMm": 180,
    "fanSizeMm": 135,
    "color": "#292e35",
    "accent": "#9ba8b2",
    "rgb": false
  },
  {
    "id": "psu-focus-gx650",
    "category": "psu",
    "brand": "Seasonic",
    "name": "FOCUS GX-650",
    "price": 109.9,
    "description": "Alimentation ATX 650 W, certification 80 PLUS Gold, profondeur 140 mm. Les câbles modulaires doivent rester ceux du fabricant pour ce modèle.",
    "specs": [
      "650 W · 80 PLUS Gold",
      "ATX · 150 × 86 × 140 mm",
      "Ventilateur 120 mm",
      "Câblage entièrement modulaire"
    ],
    "wattage": 650,
    "psuFormat": "ATX",
    "widthMm": 150,
    "heightMm": 86,
    "depthMm": 140,
    "fanSizeMm": 120,
    "color": "#292e35",
    "accent": "#9ba8b2",
    "rgb": false
  },
  {
    "id": "psu-focus-gx750",
    "category": "psu",
    "brand": "Seasonic",
    "name": "FOCUS GX-750",
    "price": 119.9,
    "description": "Alimentation ATX 750 W, certification 80 PLUS Gold, profondeur 140 mm. Les câbles modulaires doivent rester ceux du fabricant pour ce modèle.",
    "specs": [
      "750 W · 80 PLUS Gold",
      "ATX · 150 × 86 × 140 mm",
      "Ventilateur 120 mm",
      "Câblage entièrement modulaire"
    ],
    "wattage": 750,
    "psuFormat": "ATX",
    "widthMm": 150,
    "heightMm": 86,
    "depthMm": 140,
    "fanSizeMm": 120,
    "color": "#292e35",
    "accent": "#9ba8b2",
    "rgb": false
  },
  {
    "id": "psu-prime-tx1000",
    "category": "psu",
    "brand": "Seasonic",
    "name": "PRIME TX-1000",
    "price": 289.9,
    "description": "Alimentation ATX 1000 W, certification 80 PLUS Titanium, profondeur 170 mm. Les câbles modulaires doivent rester ceux du fabricant pour ce modèle.",
    "specs": [
      "1000 W · 80 PLUS Titanium",
      "ATX · 150 × 86 × 170 mm",
      "Ventilateur 135 mm",
      "Câblage entièrement modulaire"
    ],
    "wattage": 1000,
    "psuFormat": "ATX",
    "widthMm": 150,
    "heightMm": 86,
    "depthMm": 170,
    "fanSizeMm": 135,
    "color": "#292e35",
    "accent": "#9ba8b2",
    "rgb": false
  },
  {
    "id": "psu-mag-a750gl",
    "category": "psu",
    "brand": "MSI",
    "name": "MAG A750GL PCIE5",
    "price": 99.9,
    "description": "Alimentation ATX 750 W, certification 80 PLUS Gold, profondeur 140 mm. Les câbles modulaires doivent rester ceux du fabricant pour ce modèle.",
    "specs": [
      "750 W · 80 PLUS Gold",
      "ATX · 150 × 86 × 140 mm",
      "Ventilateur 120 mm",
      "ATX 3.0 · connecteur 12VHPWR"
    ],
    "wattage": 750,
    "psuFormat": "ATX",
    "widthMm": 150,
    "heightMm": 86,
    "depthMm": 140,
    "fanSizeMm": 120,
    "color": "#292e35",
    "accent": "#9ba8b2",
    "rgb": false
  },
  {
    "id": "psu-mag-a850gl",
    "category": "psu",
    "brand": "MSI",
    "name": "MAG A850GL PCIE5",
    "price": 109.9,
    "description": "Alimentation ATX 850 W, certification 80 PLUS Gold, profondeur 140 mm. Les câbles modulaires doivent rester ceux du fabricant pour ce modèle.",
    "specs": [
      "850 W · 80 PLUS Gold",
      "ATX · 150 × 86 × 140 mm",
      "Ventilateur 120 mm",
      "ATX 3.0 · connecteur 12VHPWR"
    ],
    "wattage": 850,
    "psuFormat": "ATX",
    "widthMm": 150,
    "heightMm": 86,
    "depthMm": 140,
    "fanSizeMm": 120,
    "color": "#292e35",
    "accent": "#9ba8b2",
    "rgb": false
  },
  {
    "id": "psu-straight-power12-1000",
    "category": "psu",
    "brand": "be quiet!",
    "name": "Straight Power 12 1000W",
    "price": 199.9,
    "description": "Alimentation ATX 1000 W, certification 80 PLUS Platinum, profondeur 180 mm. Les câbles modulaires doivent rester ceux du fabricant pour ce modèle.",
    "specs": [
      "1000 W · 80 PLUS Platinum",
      "ATX · 150 × 86 × 180 mm",
      "Ventilateur 135 mm",
      "ATX 3.0 · connecteur 12VHPWR"
    ],
    "wattage": 1000,
    "psuFormat": "ATX",
    "widthMm": 150,
    "heightMm": 86,
    "depthMm": 180,
    "fanSizeMm": 135,
    "color": "#292e35",
    "accent": "#9ba8b2",
    "rgb": false
  },
  {
    "id": "case-meshify2",
    "category": "case",
    "brand": "Fractal Design",
    "name": "Meshify 2 Black TG Light Tint",
    "price": 169.9,
    "description": "Façade mesh facettée · 2 ventilateurs avant et 1 arrière. Les dégagements GPU annoncés supposent l’absence de radiateur en façade et de cage de stockage gênante.",
    "specs": [
      "ATX · Micro-ATX · Mini-ITX",
      "240 × 474 × 542 mm",
      "GPU jusqu’à 491 mm · ventirad 185 mm",
      "3 ventilateurs de 140 mm inclus",
      "Façade mesh facettée · 2 ventilateurs avant et 1 arrière"
    ],
    "supportedFormFactors": [
      "ATX",
      "Micro-ATX",
      "Mini-ITX"
    ],
    "maxGpuLengthMm": 491,
    "maxCoolerHeightMm": 185,
    "supportedPsuFormats": [
      "ATX"
    ],
    "radiatorSupport": {
      "top": [
        120,
        240,
        280,
        360,
        420
      ],
      "front": [
        120,
        240,
        280,
        360
      ],
      "side": []
    },
    "widthMm": 240,
    "heightMm": 474,
    "depthMm": 542,
    "fanCount": 3,
    "fanSizeMm": 140,
    "color": "#24292f",
    "accent": "#939fa9",
    "rgb": false
  },
  {
    "id": "case-pop-air-rgb",
    "category": "case",
    "brand": "Fractal Design",
    "name": "Pop Air RGB Black TG",
    "price": 99.9,
    "description": "Façade mesh · 3 ventilateurs Aspect 12 RGB. Les dégagements GPU annoncés supposent l’absence de radiateur en façade et de cage de stockage gênante.",
    "specs": [
      "ATX · Micro-ATX · Mini-ITX",
      "215 × 473.5 × 454 mm",
      "GPU jusqu’à 405 mm · ventirad 170 mm",
      "3 ventilateurs de 120 mm inclus",
      "Façade mesh · 3 ventilateurs Aspect 12 RGB"
    ],
    "supportedFormFactors": [
      "ATX",
      "Micro-ATX",
      "Mini-ITX"
    ],
    "maxGpuLengthMm": 405,
    "maxCoolerHeightMm": 170,
    "supportedPsuFormats": [
      "ATX"
    ],
    "radiatorSupport": {
      "top": [
        120,
        240
      ],
      "front": [
        120,
        240,
        280
      ],
      "side": []
    },
    "widthMm": 215,
    "heightMm": 473.5,
    "depthMm": 454,
    "fanCount": 3,
    "fanSizeMm": 120,
    "color": "#24292f",
    "accent": "#939fa9",
    "rgb": true
  },
  {
    "id": "case-lancool3",
    "category": "case",
    "brand": "Lian Li",
    "name": "LANCOOL III Black",
    "price": 149.9,
    "description": "Panneaux latéraux vitrés à charnières · 4 ventilateurs 140 mm. Les dégagements GPU annoncés supposent l’absence de radiateur en façade et de cage de stockage gênante.",
    "specs": [
      "ATX · Micro-ATX · Mini-ITX",
      "238 × 523 × 526 mm",
      "GPU jusqu’à 435 mm · ventirad 187 mm",
      "4 ventilateurs de 140 mm inclus",
      "Panneaux latéraux vitrés à charnières · 4 ventilateurs 140 mm"
    ],
    "supportedFormFactors": [
      "ATX",
      "Micro-ATX",
      "Mini-ITX"
    ],
    "maxGpuLengthMm": 435,
    "maxCoolerHeightMm": 187,
    "supportedPsuFormats": [
      "ATX"
    ],
    "radiatorSupport": {
      "top": [
        120,
        240,
        280,
        360,
        420
      ],
      "front": [
        120,
        240,
        280,
        360,
        420
      ],
      "side": []
    },
    "widthMm": 238,
    "heightMm": 523,
    "depthMm": 526,
    "fanCount": 4,
    "fanSizeMm": 140,
    "color": "#24292f",
    "accent": "#939fa9",
    "rgb": false
  },
  {
    "id": "case-3000d",
    "category": "case",
    "brand": "Corsair",
    "name": "3000D AIRFLOW Black",
    "price": 79.9,
    "description": "Façade perforée · 2 ventilateurs SP120 ELITE. Les dégagements GPU annoncés supposent l’absence de radiateur en façade et de cage de stockage gênante.",
    "specs": [
      "ATX · Micro-ATX · Mini-ITX",
      "230 × 466 × 462 mm",
      "GPU jusqu’à 360 mm · ventirad 170 mm",
      "2 ventilateurs de 120 mm inclus",
      "Façade perforée · 2 ventilateurs SP120 ELITE"
    ],
    "supportedFormFactors": [
      "ATX",
      "Micro-ATX",
      "Mini-ITX"
    ],
    "maxGpuLengthMm": 360,
    "maxCoolerHeightMm": 170,
    "supportedPsuFormats": [
      "ATX"
    ],
    "radiatorSupport": {
      "top": [
        120,
        240,
        280
      ],
      "front": [
        120,
        240,
        280,
        360
      ],
      "side": []
    },
    "widthMm": 230,
    "heightMm": 466,
    "depthMm": 462,
    "fanCount": 2,
    "fanSizeMm": 120,
    "color": "#24292f",
    "accent": "#939fa9",
    "rgb": false
  },
  {
    "id": "case-7000d",
    "category": "case",
    "brand": "Corsair",
    "name": "7000D AIRFLOW Black",
    "price": 249.9,
    "description": "Grand tour · 3 ventilateurs AirGuide de 140 mm. Les dégagements GPU annoncés supposent l’absence de radiateur en façade et de cage de stockage gênante.",
    "specs": [
      "ATX · Micro-ATX · Mini-ITX",
      "248 × 600 × 550 mm",
      "GPU jusqu’à 450 mm · ventirad 190 mm",
      "3 ventilateurs de 140 mm inclus",
      "Grand tour · 3 ventilateurs AirGuide de 140 mm"
    ],
    "supportedFormFactors": [
      "ATX",
      "Micro-ATX",
      "Mini-ITX"
    ],
    "maxGpuLengthMm": 450,
    "maxCoolerHeightMm": 190,
    "supportedPsuFormats": [
      "ATX"
    ],
    "radiatorSupport": {
      "top": [
        120,
        240,
        280,
        360,
        420
      ],
      "front": [
        120,
        240,
        280,
        360,
        420,
        480
      ],
      "side": [
        120,
        240,
        360,
        480
      ]
    },
    "widthMm": 248,
    "heightMm": 600,
    "depthMm": 550,
    "fanCount": 3,
    "fanSizeMm": 140,
    "color": "#24292f",
    "accent": "#939fa9",
    "rgb": false
  },
  {
    "id": "case-xt-pro-ultra",
    "category": "case",
    "brand": "Phanteks",
    "name": "XT Pro Ultra Black",
    "price": 89.9,
    "description": "4 ventilateurs M25-140 D-RGB · façade mesh. Les dégagements GPU annoncés supposent l’absence de radiateur en façade et de cage de stockage gênante.",
    "specs": [
      "ATX · Micro-ATX · Mini-ITX",
      "230 × 500 × 450 mm",
      "GPU jusqu’à 415 mm · ventirad 184 mm",
      "4 ventilateurs de 140 mm inclus",
      "4 ventilateurs M25-140 D-RGB · façade mesh"
    ],
    "supportedFormFactors": [
      "ATX",
      "Micro-ATX",
      "Mini-ITX"
    ],
    "maxGpuLengthMm": 415,
    "maxCoolerHeightMm": 184,
    "supportedPsuFormats": [
      "ATX"
    ],
    "radiatorSupport": {
      "top": [
        120,
        240,
        360
      ],
      "front": [],
      "side": []
    },
    "widthMm": 230,
    "heightMm": 500,
    "depthMm": 450,
    "fanCount": 4,
    "fanSizeMm": 140,
    "color": "#24292f",
    "accent": "#939fa9",
    "rgb": true
  },
  {
    "id": "case-p400a-digital",
    "category": "case",
    "brand": "Phanteks",
    "name": "Eclipse P400A Digital Black",
    "price": 99.9,
    "description": "3 ventilateurs D-RGB avant · façade en maille métallique. Les dégagements GPU annoncés supposent l’absence de radiateur en façade et de cage de stockage gênante.",
    "specs": [
      "ATX · Micro-ATX · Mini-ITX",
      "210 × 465 × 470 mm",
      "GPU jusqu’à 420 mm · ventirad 160 mm",
      "3 ventilateurs de 120 mm inclus",
      "3 ventilateurs D-RGB avant · façade en maille métallique"
    ],
    "supportedFormFactors": [
      "ATX",
      "Micro-ATX",
      "Mini-ITX"
    ],
    "maxGpuLengthMm": 420,
    "maxCoolerHeightMm": 160,
    "supportedPsuFormats": [
      "ATX"
    ],
    "radiatorSupport": {
      "top": [],
      "front": [
        120,
        240,
        280,
        360
      ],
      "side": []
    },
    "widthMm": 210,
    "heightMm": 465,
    "depthMm": 470,
    "fanCount": 3,
    "fanSizeMm": 120,
    "color": "#24292f",
    "accent": "#939fa9",
    "rgb": true
  },
  {
    "id": "case-air903-base",
    "category": "case",
    "brand": "Montech",
    "name": "AIR 903 BASE Black",
    "price": 74.9,
    "description": "3 ventilateurs PWM de 140 mm · façade mesh. Les dégagements GPU annoncés supposent l’absence de radiateur en façade et de cage de stockage gênante.",
    "specs": [
      "ATX · Micro-ATX · Mini-ITX",
      "230 × 493 × 478 mm",
      "GPU jusqu’à 400 mm · ventirad 180 mm",
      "3 ventilateurs de 140 mm inclus",
      "3 ventilateurs PWM de 140 mm · façade mesh"
    ],
    "supportedFormFactors": [
      "ATX",
      "Micro-ATX",
      "Mini-ITX"
    ],
    "maxGpuLengthMm": 400,
    "maxCoolerHeightMm": 180,
    "supportedPsuFormats": [
      "ATX"
    ],
    "radiatorSupport": {
      "top": [
        120,
        240,
        280,
        360
      ],
      "front": [
        120,
        240,
        280,
        360
      ],
      "side": []
    },
    "widthMm": 230,
    "heightMm": 493,
    "depthMm": 478,
    "fanCount": 3,
    "fanSizeMm": 140,
    "color": "#24292f",
    "accent": "#939fa9",
    "rgb": false
  }
];
