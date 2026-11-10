// Individual manufacturer and exact-offer review. Evidence: data/individual-review/.
import type {VerifiedProduct} from "./verifiedTypes.ts";
export const individualBoardGpu: Record<string,VerifiedProduct> = {
  "import-mb-fd057324a4a8": {
    "mpn": "90-MXBQS0-A0UAYZ",
    "identityNote": "B850 Steel Legend WiFi ATX, référence 90-MXBQS0-A0UAYZ. La B850M Micro-ATX est une autre carte et n’est pas substituée.",
    "sources": [
      {
        "name": "ASRock — spécifications officielles",
        "url": "https://www.asrock.com/mb/AMD/B850%20Steel%20Legend%20WiFi/index.asp",
        "checkedAt": "2026-11-10T10:19:08.306Z",
        "kind": "manufacturer"
      },
      {
        "name": "ASRock — manuel B850 Steel Legend WiFi",
        "url": "https://download.asrock.com/Manual/B850%20Steel%20Legend%20WiFi.pdf",
        "checkedAt": "2026-11-10T10:18:16.302145+00:00",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes — B850 Steel Legend WiFi ATX",
        "url": "https://www.pccomponentes.fr/carte-mere-asrock-b850-amd-b850-am5-atx-steel-legend-wifi-ddr5-pcie-5-0-raid",
        "checkedAt": "2026-11-10T10:20:03.719474+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications fabricant ASRock",
        "rows": [
          {
            "label": "Socket et processeurs",
            "value": "AM5 · Ryzen 9000 / 8000 / 7000 · vérifier la version de BIOS requise par le CPU"
          },
          {
            "label": "Chipset",
            "value": "AMD B850"
          },
          {
            "label": "Format et dimensions",
            "value": "ATX · 305 × 244 mm · PCB 8 couches"
          },
          {
            "label": "Alimentation CPU",
            "value": "14+2+1 phases · Dr.MOS 80 A VCore + SOC · 2 × EPS 8 broches"
          },
          {
            "label": "Mémoire",
            "value": "4 × DIMM DDR5 UDIMM · double canal · 256 Go maximum · ECC / non-ECC non enregistrée"
          },
          {
            "label": "Profils mémoire",
            "value": "AMD EXPO et Intel XMP · jusqu’à DDR5-8000+ en overclocking selon CPU et QVL"
          },
          {
            "label": "Slots PCIe physiques",
            "value": "1 × PCIe 5.0 x16 (PCIE1) + 1 × PCIe 4.0 x16 câblé x4 (PCIE2)"
          },
          {
            "label": "Stockage M.2",
            "value": "4 × M.2 Key M pour SSD NVMe : M2_1 PCIe 5.0 x4, M2_2 / M2_3 / M2_4 PCIe 4.0 x4"
          },
          {
            "label": "Formats SSD",
            "value": "M2_1 : 2280 ; M2_2 / M2_4 : 2260 / 2280 ; M2_3 : 2230 / 2260 / 2280"
          },
          {
            "label": "Stockage SATA",
            "value": "4 × SATA 6 Gbit/s · contrôleur ASMedia ASM1061"
          },
          {
            "label": "Réseau filaire",
            "value": "2,5 GbE · Dragon RTL8125BG"
          },
          {
            "label": "Sans fil",
            "value": "Wi-Fi 7 2×2, canaux 160 MHz · Bluetooth 5.4 · pilote Wi-Fi 7 Windows 11"
          },
          {
            "label": "Audio",
            "value": "Realtek ALC4082 · 7.1 canaux · sortie S/PDIF optique"
          },
          {
            "label": "USB arrière",
            "value": "2 × USB-C 10 Gbit/s + 2 × USB-A 10 Gbit/s + 3 × USB-A 5 Gbit/s + 4 × USB 2.0"
          },
          {
            "label": "USB en façade",
            "value": "1 × connecteur USB-C 20 Gbit/s + 2 × connecteurs USB 5 Gbit/s (4 ports) + 2 × USB 2.0 (4 ports)"
          },
          {
            "label": "Refroidissement et éclairage",
            "value": "2 × CPU fan + 3 × chassis fan + 1 × AIO pump, tous 4 broches · 3 × ARGB 5 V + 1 × RGB 12 V"
          },
          {
            "label": "Sortie vidéo intégrée",
            "value": "HDMI 2.1 · dépend du GPU intégré au processeur"
          },
          {
            "label": "Maintenance",
            "value": "BIOS Flashback · dissipateurs M.2 sans outils"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "90-MXBQS0-A0UAYZ",
      "socket": "AM5",
      "memoryType": "DDR5",
      "formFactor": "ATX",
      "memorySlots": 4,
      "memoryChannels": 2,
      "maxMemoryGB": 256,
      "m2Slots": 4,
      "widthMm": 244,
      "heightMm": 305,
      "detailLevel": "documented",
      "rgb": true,
      "description": "Carte mère ASRock B850 Steel Legend WiFi ATX pour AM5. Quatre DIMM DDR5 jusqu’à 256 Go, quatre emplacements SSD M.2 dont un PCIe 5.0 x4, quatre SATA, Wi-Fi 7 et Ethernet 2,5 Gb/s. La topologie PCIe et M.2 varie selon le processeur ; M2_4 désactive le second slot PCIe.",
      "specs": [
        "AM5 · AMD B850",
        "ATX · 305 × 244 mm",
        "4 DIMM DDR5 · jusqu’à 256 Go",
        "4 M.2 NVMe · 4 SATA",
        "Wi-Fi 7 · Bluetooth 5.4 · LAN 2,5 Gb/s",
        "90-MXBQS0-A0UAYZ"
      ]
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "PcComponentes",
        "url": "https://www.pccomponentes.fr/carte-mere-asrock-b850-amd-b850-am5-atx-steel-legend-wifi-ddr5-pcie-5-0-raid",
        "productName": "Carte mère Asrock B850 AMD B850 AM5 ATX Steel Legend WiFi DDR5 PCIe 5.0 RAID",
        "mpn": "90-MXBQS0-A0UAYZ",
        "amount": 216.72,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Frais affichés : 0 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T10:20:03.719474+00:00"
      }
    ],
    "notes": [
      "M2_1 fonctionne en PCIe 5.0 x4 avec Ryzen 9000 / 7000 et PCIe 4.0 x4 avec Ryzen 8000. M2_2 tombe en PCIe 4.0 x2 avec Ryzen 8000 Phoenix 2.",
      "L’occupation de M2_4 désactive PCIE2 ; PCIE1 fonctionne en Gen5 x16 avec Ryzen 9000 / 7000, Gen4 x8 avec Ryzen 8000 Phoenix 1 et Gen4 x4 avec Phoenix 2.",
      "Les quatre emplacements SSD M.2 ne comptent pas le logement M.2 Key E réservé au module Wi-Fi. EXPO/XMP, vitesse mémoire et compatibilité CPU dépendent du BIOS et des listes QVL."
    ]
  },
  "import-gpu-a682aa002297": {
    "mpn": "90-GA5ZZZ-00UANF",
    "identityNote": "ASRock Radeon RX 9060 XT Steel Legend 8GB OC, modèle RX9060XT SL 8GO, référence commerciale 90-GA5ZZZ-00UANF. Les capacités 8 Go et 16 Go restent distinctes.",
    "sources": [
      {
        "name": "ASRock — RX9060XT SL 8GO",
        "url": "https://www.asrock.com/Graphics-Card/AMD/Radeon%20RX%209060%20XT%20Steel%20Legend%208GB%20OC/index.asp",
        "checkedAt": "2026-11-10T10:18:50.031Z",
        "kind": "manufacturer"
      },
      {
        "name": "TopBiz — référence 90-GA5ZZZ-00UANF",
        "url": "https://www.topbiz.fr/cartes-graphiques/380927-asrock-steel-legend-radeon-rx-9060--4711581491182.html",
        "checkedAt": "2026-11-10T10:22:23.349Z",
        "kind": "retailer"
      },
      {
        "name": "PC21 — RX9060XT SL 8GO",
        "url": "https://www.pc21.fr/fiche/rx9060xt-sl-8go-steel-legend-radeon-rx-9060-xt-oc-amd-8-gb-gddr6-i6210469.html",
        "checkedAt": "2026-11-10T10:21:46.763Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications fabricant ASRock",
        "rows": [
          {
            "label": "Référence fabricant",
            "value": "RX9060XT SL 8GO"
          },
          {
            "label": "Référence commerciale",
            "value": "90-GA5ZZZ-00UANF"
          },
          {
            "label": "GPU",
            "value": "AMD Radeon RX 9060 XT · RDNA 4 · 32 unités de calcul · 2 048 processeurs de flux"
          },
          {
            "label": "Mémoire vidéo",
            "value": "8 Go GDDR6 · bus 128 bits · 20 Gbit/s"
          },
          {
            "label": "Fréquence de jeu déclarée",
            "value": "2 780 MHz"
          },
          {
            "label": "Fréquence boost maximale déclarée",
            "value": "3 320 MHz"
          },
          {
            "label": "Interface",
            "value": "PCI Express 5.0 x16"
          },
          {
            "label": "Dimensions",
            "value": "298 × 131 × 51 mm · 2,55 slots"
          },
          {
            "label": "Poids net",
            "value": "967 g"
          },
          {
            "label": "Refroidissement",
            "value": "3 ventilateurs Striped Ring Fan · arrêt à faible charge 0 dB · caloducs et base cuivre nickelé"
          },
          {
            "label": "Éclairage",
            "value": "ARGB Polychrome Sync · interrupteur LED · connecteur ARGB"
          },
          {
            "label": "Connecteur d’alimentation",
            "value": "1 × PCIe 8 broches"
          },
          {
            "label": "Alimentation recommandée",
            "value": "550 W pour le système, selon ASRock"
          },
          {
            "label": "Sorties vidéo",
            "value": "2 × DisplayPort 2.1a + 1 × HDMI 2.1b · 3 écrans maximum"
          },
          {
            "label": "Définition maximale",
            "value": "7 680 × 4 320"
          },
          {
            "label": "Consommation de la carte",
            "value": "TBP du modèle OC non publié dans la fiche ASRock consultée ; la recommandation 550 W concerne le système."
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "90-GA5ZZZ-00UANF",
      "capacityGB": 8,
      "lengthMm": 298,
      "heightMm": 131,
      "thicknessMm": 51,
      "recommendedPsuW": 550,
      "fanCount": 3,
      "rgb": true,
      "detailLevel": "partial",
      "color": "#f0efeb",
      "accent": "#b9bec7",
      "description": "ASRock Radeon RX 9060 XT Steel Legend OC avec 8 Go GDDR6, bus 128 bits et trois ventilateurs ARGB. Dimensions fabricant 298 × 131 × 51 mm, alimentation via un connecteur 8 broches, bloc système conseillé de 550 W. La puissance exacte de cette carte OC reste non publiée.",
      "specs": [
        "8 Go GDDR6 · 128 bits · 20 Gbit/s",
        "298 × 131 × 51 mm · 2,55 slots",
        "3 ventilateurs ARGB · mode 0 dB",
        "Jeu 2 780 MHz · boost jusqu’à 3 320 MHz",
        "1 × 8 broches · alimentation conseillée 550 W",
        "90-GA5ZZZ-00UANF"
      ]
    },
    "offers": [
      {
        "retailer": "TopBiz",
        "seller": "TopBiz",
        "url": "https://www.topbiz.fr/cartes-graphiques/380927-asrock-steel-legend-radeon-rx-9060--4711581491182.html",
        "productName": "ASRock Steel Legend Radeon RX 9060 XT OC AMD 8 Go GDDR6",
        "mpn": "90-GA5ZZZ-00UANF",
        "amount": 361.99,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "out_of_stock",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Dernier prix pratiqué, rupture de stock sans date de retour ; livraison non confirmée.",
        "checkedAt": "2026-11-10T10:22:23.349Z"
      },
      {
        "retailer": "PC21",
        "seller": "PC21.FR",
        "url": "https://www.pc21.fr/fiche/rx9060xt-sl-8go-steel-legend-radeon-rx-9060-xt-oc-amd-8-gb-gddr6-i6210469.html",
        "productName": "ASRock Steel Legend Radeon RX 9060 XT OC 8 Go GDDR6",
        "mpn": "90-GA5ZZZ-00UANF",
        "retailerReference": "RX9060XT SL 8GO",
        "amount": 602.05,
        "currency": "EUR",
        "market": "FR",
        "condition": "unknown",
        "availability": "out_of_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Sur commande, stock indiqué à 0 pièce ; délai et livraison à confirmer.",
        "checkedAt": "2026-11-10T10:21:46.763Z"
      }
    ],
    "notes": [
      "ASRock ne publie pas de TBP pour ce modèle OC dans la fiche consultée. Aucun nombre de watts n’est donc ajouté à l’estimation de consommation de cette carte. Les 550 W sont une recommandation de bloc pour le système entier.",
      "Les fréquences de jeu et boost sont des valeurs déclarées par ASRock et non des performances mesurées. Le diamètre des ventilateurs n’est pas renseigné par le fabricant.",
      "Le prix TopBiz est explicitement un dernier prix pratiqué en rupture ; PC21 indique stock 0 et sur commande. Aucune de ces deux observations ne devient une offre disponible dans le budget."
    ]
  },
  "import-gpu-a12582346528": {
    "mpn": "90-GA5JZZ-00UANF",
    "identityNote": "ASRock Radeon RX 9060 XT Steel Legend 16GB OC, modèle RX9060XT SL 16GO, référence commerciale 90-GA5JZZ-00UANF. Les capacités 8 Go et 16 Go restent distinctes.",
    "sources": [
      {
        "name": "ASRock — RX9060XT SL 16GO",
        "url": "https://www.asrock.com/Graphics-Card/AMD/Radeon%20RX%209060%20XT%20Steel%20Legend%2016GB%20OC/index.asp",
        "checkedAt": "2026-11-10T10:19:08.839Z",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes — Steel Legend OC 16 Go",
        "url": "https://www.pccomponentes.fr/carte-graphique-tarjeta-graphique-asrock-radeon-rx-9060-xt-steel-legend-16gb-gddr6-pcie-5-0-oc",
        "checkedAt": "2026-11-10T10:20:04.533219+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications fabricant ASRock",
        "rows": [
          {
            "label": "Référence fabricant",
            "value": "RX9060XT SL 16GO"
          },
          {
            "label": "Référence commerciale",
            "value": "90-GA5JZZ-00UANF"
          },
          {
            "label": "GPU",
            "value": "AMD Radeon RX 9060 XT · RDNA 4 · 32 unités de calcul · 2 048 processeurs de flux"
          },
          {
            "label": "Mémoire vidéo",
            "value": "16 Go GDDR6 · bus 128 bits · 20 Gbit/s"
          },
          {
            "label": "Fréquence de jeu déclarée",
            "value": "2 780 MHz"
          },
          {
            "label": "Fréquence boost maximale déclarée",
            "value": "3 320 MHz"
          },
          {
            "label": "Interface",
            "value": "PCI Express 5.0 x16"
          },
          {
            "label": "Dimensions",
            "value": "298 × 131 × 51 mm · 2,55 slots"
          },
          {
            "label": "Poids net",
            "value": "967 g"
          },
          {
            "label": "Refroidissement",
            "value": "3 ventilateurs Striped Ring Fan · arrêt à faible charge 0 dB · caloducs et base cuivre nickelé"
          },
          {
            "label": "Éclairage",
            "value": "ARGB Polychrome Sync · interrupteur LED · connecteur ARGB"
          },
          {
            "label": "Connecteur d’alimentation",
            "value": "1 × PCIe 8 broches"
          },
          {
            "label": "Alimentation recommandée",
            "value": "550 W pour le système, selon ASRock"
          },
          {
            "label": "Sorties vidéo",
            "value": "2 × DisplayPort 2.1a + 1 × HDMI 2.1b · 3 écrans maximum"
          },
          {
            "label": "Définition maximale",
            "value": "7 680 × 4 320"
          },
          {
            "label": "Consommation de la carte",
            "value": "TBP du modèle OC non publié dans la fiche ASRock consultée ; la recommandation 550 W concerne le système."
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "90-GA5JZZ-00UANF",
      "capacityGB": 16,
      "lengthMm": 298,
      "heightMm": 131,
      "thicknessMm": 51,
      "recommendedPsuW": 550,
      "fanCount": 3,
      "rgb": true,
      "detailLevel": "partial",
      "color": "#f0efeb",
      "accent": "#b9bec7",
      "description": "ASRock Radeon RX 9060 XT Steel Legend OC avec 16 Go GDDR6, bus 128 bits et trois ventilateurs ARGB. Dimensions fabricant 298 × 131 × 51 mm, alimentation via un connecteur 8 broches, bloc système conseillé de 550 W. La puissance exacte de cette carte OC reste non publiée.",
      "specs": [
        "16 Go GDDR6 · 128 bits · 20 Gbit/s",
        "298 × 131 × 51 mm · 2,55 slots",
        "3 ventilateurs ARGB · mode 0 dB",
        "Jeu 2 780 MHz · boost jusqu’à 3 320 MHz",
        "1 × 8 broches · alimentation conseillée 550 W",
        "90-GA5JZZ-00UANF"
      ]
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "NOWBUY",
        "url": "https://www.pccomponentes.fr/carte-graphique-tarjeta-graphique-asrock-radeon-rx-9060-xt-steel-legend-16gb-gddr6-pcie-5-0-oc",
        "productName": "Tarjeta Graphique Asrock Radeon RX 9060 XT Steel Legend 16GB GDDR6 PCIe 5.0 OC",
        "mpn": "90-GA5JZZ-00UANF",
        "amount": 1062.91,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Frais affichés : 0 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T10:20:04.533219+00:00"
      }
    ],
    "notes": [
      "ASRock ne publie pas de TBP pour ce modèle OC dans la fiche consultée. Aucun nombre de watts n’est donc ajouté à l’estimation de consommation de cette carte. Les 550 W sont une recommandation de bloc pour le système entier.",
      "Les fréquences de jeu et boost sont des valeurs déclarées par ASRock et non des performances mesurées. Le diamètre des ventilateurs n’est pas renseigné par le fabricant."
    ]
  },
  "import-mb-f97d16ba7ec7": {
    "mpn": "B650 GAMING X AX V2",
    "identityNote": "Gigabyte B650 GAMING X AX V2 · modèle exact B650 GAMING X AX V2. Les variantes de chipset, finition et révision portant un autre nom sont exclues.",
    "sources": [
      {
        "name": "Fabricant — spécifications Gigabyte B650 GAMING X AX V2",
        "url": "https://www.gigabyte.com/Motherboard/B650-GAMING-X-AX-V2-rev-10-11-12/sp",
        "checkedAt": "2026-11-10T10:26:21.770Z",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes — Gigabyte B650 GAMING X AX V2",
        "url": "https://www.pccomponentes.fr/carte-mere-gigabyte-b650-gaming-x-ax-v2-amd-b650-am5-ddr5-atx-wifi-6e-pcie-5-0-raid-rgb",
        "checkedAt": "2026-11-10T10:26:28.420637+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications fabricant",
        "rows": [
          {
            "label": "Socket et chipset",
            "value": "AM5 · AMD B650 · Ryzen 7000 / 8000 / 9000 selon BIOS"
          },
          {
            "label": "Format",
            "value": "ATX · 305 × 244 mm"
          },
          {
            "label": "Mémoire",
            "value": "4 DIMM DDR5 UDIMM non-ECC · 256 Go maximum · 64 Go par module · double canal"
          },
          {
            "label": "Profils mémoire",
            "value": "AMD EXPO et Intel XMP · jusqu’à 8 000 MT/s OC selon processeur et QVL"
          },
          {
            "label": "PCIe graphique",
            "value": "PCIEX16 : PCIe 4.0 x16 avec Ryzen 7000/9000, x8 avec Phoenix 1, x4 avec Phoenix 2"
          },
          {
            "label": "Slots secondaires",
            "value": "2 slots PCIe x16 physiques, PCIe 3.0 x1 chacun"
          },
          {
            "label": "M.2 SSD",
            "value": "3 emplacements : M2A_CPU PCIe 5.0 x4 + M2B_CPU / M2C_SB PCIe 4.0 x4"
          },
          {
            "label": "Formats M.2",
            "value": "25110 / 22110 / 2580 / 2280"
          },
          {
            "label": "SATA",
            "value": "4 ports SATA 6 Gbit/s"
          },
          {
            "label": "Réseau filaire",
            "value": "Realtek 2,5 GbE"
          },
          {
            "label": "Wi-Fi et révision PCB",
            "value": "Wi-Fi 6E 160 MHz : Realtek RTL8852CE (rev.1.0), AMD RZ616 (rev.1.1), Intel AX210 (rev.1.2)"
          },
          {
            "label": "Bluetooth et révision PCB",
            "value": "5.3 en rev.1.0 / 1.2 ; 5.2 en rev.1.1"
          },
          {
            "label": "USB arrière",
            "value": "1 USB-C 10 Gbit/s + 1 USB-A 10 Gbit/s + 3 USB-A 5 Gbit/s + 3 USB 2.0"
          },
          {
            "label": "Façade",
            "value": "USB-C 20 Gbit/s · connecteurs pour 2 USB-A 5 Gbit/s et 4 USB 2.0"
          },
          {
            "label": "Vidéo et audio",
            "value": "DisplayPort 1.4 + HDMI 2.1 selon GPU intégré ; audio Realtek 7.1"
          },
          {
            "label": "Alimentation",
            "value": "ATX 24 broches + EPS 8 broches + EPS 4 broches"
          },
          {
            "label": "Maintenance",
            "value": "Q-Flash Plus · PCIe EZ-Latch"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "B650 GAMING X AX V2",
      "socket": "AM5",
      "formFactor": "ATX",
      "memoryType": "DDR5",
      "memorySlots": 4,
      "memoryChannels": 2,
      "maxMemoryGB": 256,
      "detailLevel": "documented",
      "m2Slots": 3,
      "maxMemoryPerSlotGB": 64,
      "heightMm": 305,
      "widthMm": 244,
      "description": "Gigabyte B650 GAMING X AX V2 ATX AM5 : 4 DIMM DDR5 jusqu’à 256 Go, 3 emplacements M.2 et 4 SATA. Le slot graphique est PCIe 4.0 ; le premier M.2 supporte PCIe 5.0 avec Ryzen 7000/9000. Le module sans fil dépend de la révision PCB.",
      "specs": [
        "AM5 · AMD B650 · ATX",
        "4 DIMM DDR5 · 256 Go · 64 Go/module",
        "3 M.2 · 4 SATA",
        "PCIe graphique 4.0 x16",
        "Wi-Fi 6E · LAN 2,5 Gb/s",
        "B650 GAMING X AX V2"
      ]
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "PcComponentes",
        "url": "https://www.pccomponentes.fr/carte-mere-gigabyte-b650-gaming-x-ax-v2-amd-b650-am5-ddr5-atx-wifi-6e-pcie-5-0-raid-rgb",
        "productName": "Carte mère Gigabyte B650 GAMING X AX V2 AMD B650 AM5 DDR5 ATX WiFi 6E PCIe 5.0 RAID RGB",
        "mpn": "B650 GAMING X AX V2",
        "amount": 132.99,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Frais affichés : 0 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T10:26:28.420637+00:00"
      }
    ],
    "notes": [
      "La fiche fabricant actuelle annonce 256 Go ; l’archive à 192 Go est corrigée. La révision PCB fournie par le marchand n’est pas précisée : les modules sans fil des révisions 1.0 / 1.1 / 1.2 restent distingués.",
      "Avec Ryzen 8000, M2A_CPU fonctionne en Gen4 ; M2B_CPU est limité à Gen4 x2 avec Phoenix 2. La mention PCIe 5.0 concerne le premier SSD M.2, pas le slot graphique."
    ]
  },
  "import-mb-f98c4e920c3e": {
    "mpn": "MAG X870E TOMAHAWK WIFI",
    "identityNote": "MSI MAG X870E TOMAHAWK WIFI · modèle exact MAG X870E TOMAHAWK WIFI. Les variantes de chipset, finition et révision portant un autre nom sont exclues.",
    "sources": [
      {
        "name": "Fabricant — spécifications MSI MAG X870E TOMAHAWK WIFI",
        "url": "https://www.msi.com/Motherboard/MAG-X870e-TOMAHAWK-WIFI/Specification",
        "checkedAt": "2026-11-10T10:26:18.488Z",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes — MSI MAG X870E TOMAHAWK WIFI",
        "url": "https://www.pccomponentes.fr/carte-mere-msi-mag-x870e-tomahawk-wifi-x870e-am5-ddr5-atx-wi-fi-7-5gbe-usb4-m-2-pcie-5-0",
        "checkedAt": "2026-11-10T10:26:28.705851+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications fabricant",
        "rows": [
          {
            "label": "Socket et chipset",
            "value": "AM5 · AMD X870E · Ryzen 9000 / 8000 / 7000 selon BIOS"
          },
          {
            "label": "Format",
            "value": "ATX · 304,8 × 243,84 mm"
          },
          {
            "label": "Mémoire",
            "value": "4 DDR5 UDIMM non-ECC non enregistrée · 256 Go maximum · double canal"
          },
          {
            "label": "Overclocking mémoire",
            "value": "AMD EXPO · jusqu’à 8 400+ MT/s selon CPU, rangs et nombre de DIMM ; CUDIMM uniquement en bypass du pilote d’horloge"
          },
          {
            "label": "Slots PCIe",
            "value": "3 x16 physiques : PCI_E1 Gen5 x16 CPU, PCI_E2 Gen3 x1 chipset, PCI_E3 Gen4 x4 chipset"
          },
          {
            "label": "Stockage",
            "value": "4 M.2 + 4 SATA 6 Gbit/s"
          },
          {
            "label": "M.2 CPU",
            "value": "M2_1 : Gen5 x4, 22110/2280 ; M2_2 : Gen5 x4, 2260/2280, avec partage USB4"
          },
          {
            "label": "M.2 chipset",
            "value": "M2_3 / M2_4 : Gen4 x4, 2260/2280"
          },
          {
            "label": "Réseau",
            "value": "Realtek 8126 5 GbE · Wi-Fi 7 320 MHz · Bluetooth 5.4 selon OS/pilote"
          },
          {
            "label": "USB arrière",
            "value": "2 USB4 Type-C 40 Gbit/s + 1 USB-C 10 Gbit/s + 2 USB-A 10 Gbit/s + 3 USB-A 5 Gbit/s + 4 USB 2.0"
          },
          {
            "label": "Façade USB",
            "value": "1 USB-C 20 Gbit/s + 4 USB-A 5 Gbit/s + 4 USB 2.0 via connecteurs internes"
          },
          {
            "label": "Audio",
            "value": "Realtek ALC4080 USB · 7.1 canaux · S/PDIF · jusqu’à 32 bits / 384 kHz en façade"
          },
          {
            "label": "Vidéo",
            "value": "HDMI 2.1 et DisplayPort via USB4 selon GPU intégré au processeur"
          },
          {
            "label": "Connecteurs alimentation",
            "value": "ATX 24 broches · 2 EPS CPU · alimentation PCIe auxiliaire 8 broches"
          },
          {
            "label": "Ventilation",
            "value": "1 CPU fan + 1 pompe/ventilateur combiné + 6 ventilateurs système"
          },
          {
            "label": "Diagnostic",
            "value": "EZ Debug LED · afficheur EZ Digit · Clear CMOS et Flash BIOS"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "MAG X870E TOMAHAWK WIFI",
      "socket": "AM5",
      "formFactor": "ATX",
      "memoryType": "DDR5",
      "memorySlots": 4,
      "memoryChannels": 2,
      "maxMemoryGB": 256,
      "detailLevel": "documented",
      "m2Slots": 4,
      "heightMm": 304.8,
      "widthMm": 243.84,
      "description": "MSI MAG X870E TOMAHAWK WIFI ATX AM5 : quatre DIMM DDR5 jusqu’à 256 Go, quatre M.2, quatre SATA, réseau 5 GbE et Wi-Fi 7. Les ports USB4 arrière et M2_2 partagent les lignes CPU ; leurs limites dépendent du processeur et du BIOS.",
      "specs": [
        "AM5 · AMD X870E · ATX",
        "4 DIMM DDR5 · 256 Go",
        "4 M.2 · 4 SATA",
        "USB4 40 Gbit/s · LAN 5 Gb/s",
        "Wi-Fi 7 · Bluetooth 5.4",
        "MAG X870E TOMAHAWK WIFI"
      ]
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "PcComponentes",
        "url": "https://www.pccomponentes.fr/carte-mere-msi-mag-x870e-tomahawk-wifi-x870e-am5-ddr5-atx-wi-fi-7-5gbe-usb4-m-2-pcie-5-0",
        "productName": "Carte mère MSI MAG X870E TOMAHAWK WIFI X870E AM5 DDR5 ATX Wi-Fi 7 5GbE USB4 M.2 PCIe 5.0",
        "mpn": "MAG X870E TOMAHAWK WIFI",
        "amount": 341.99,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Frais affichés : 0 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T10:26:28.705851+00:00"
      }
    ],
    "notes": [
      "M2_2 et les deux ports USB4 arrière partagent PCIe 5.0 x4 : ils fonctionnent chacun en x2 si M2_2 est occupé. Un réglage BIOS peut donner x4 à M2_2 en désactivant les ports USB4.",
      "M2_2 est indisponible avec Ryzen 8500 / 8300. Avec Ryzen 8000 compatible, les M.2 CPU sont limités au Gen4 ; le PCIe GPU est x8 (8700 / 8600 / 8400) ou x4 (8500 / 8300).",
      "Il s’agit du modèle MAG X870E TOMAHAWK WIFI à connecteurs standards, pas d’une version PZ à connecteurs au dos."
    ]
  },
  "import-mb-9aee885ce2d1": {
    "mpn": "X870 A ELITE WIFI7",
    "identityNote": "Gigabyte X870 AORUS ELITE WIFI7 · modèle exact X870 A ELITE WIFI7. Les variantes de chipset, finition et révision portant un autre nom sont exclues.",
    "sources": [
      {
        "name": "Fabricant — spécifications Gigabyte X870 AORUS ELITE WIFI7",
        "url": "https://www.gigabyte.com/us/Motherboard/X870-AORUS-ELITE-WIFI7-rev-10-11/sp",
        "checkedAt": "2026-11-10T10:26:26.515Z",
        "kind": "manufacturer"
      },
      {
        "name": "LDLC — Gigabyte X870 AORUS ELITE WIFI7",
        "url": "https://www.ldlc.com/fiche/PB00632047.html",
        "checkedAt": "2026-11-10T10:28:06.855081+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications fabricant",
        "rows": [
          {
            "label": "Socket et chipset",
            "value": "AM5 · AMD X870 · Ryzen 9000 / 8000 / 7000 selon BIOS"
          },
          {
            "label": "Variante",
            "value": "Noir · X870 AORUS ELITE WIFI7 · EAN 4719331864811 · différent des modèles ICE et X870E"
          },
          {
            "label": "Format",
            "value": "ATX · 305 × 244 mm"
          },
          {
            "label": "Mémoire",
            "value": "4 DIMM DDR5 UDIMM non-ECC · 256 Go maximum · 64 Go par module · double canal"
          },
          {
            "label": "Profils mémoire",
            "value": "AMD EXPO et Intel XMP · jusqu’à 8 200 MT/s OC selon CPU et QVL"
          },
          {
            "label": "PCIe principal",
            "value": "PCIEX16 Gen5 x16 ; limité à x8 lorsque M2B_CPU ou M2C_CPU est utilisé"
          },
          {
            "label": "Slots secondaires",
            "value": "PCIEX4 Gen4 x4 et PCIEX2 Gen3 x2, deux x16 physiques"
          },
          {
            "label": "M.2 SSD",
            "value": "4 emplacements : M2A_CPU / M2B_CPU / M2C_CPU Gen5 x4 et M2D_SB Gen4 x4"
          },
          {
            "label": "Formats SSD",
            "value": "M2A_CPU : 25110 / 22110 / 2580 / 2280 ; autres M.2 : 22110 / 2280"
          },
          {
            "label": "SATA",
            "value": "4 ports SATA 6 Gbit/s"
          },
          {
            "label": "Réseau",
            "value": "Realtek 2,5 GbE · Wi-Fi 7 160 MHz · Bluetooth 5.4"
          },
          {
            "label": "Révisions sans fil",
            "value": "MediaTek MT7925 en révision PCB 1.0 ; Realtek RTL8922AE en révision 1.1"
          },
          {
            "label": "USB arrière",
            "value": "2 USB4 Type-C + 2 USB-A 10 Gbit/s + 4 USB-A 5 Gbit/s + 4 USB 2.0"
          },
          {
            "label": "Façade USB",
            "value": "USB-C 20 Gbit/s · 2 USB-A 5 Gbit/s · 4 USB 2.0 via connecteurs internes"
          },
          {
            "label": "Audio",
            "value": "Realtek ALC1220 7.1 · sortie S/PDIF optique"
          },
          {
            "label": "Vidéo",
            "value": "HDMI arrière et DisplayPort via USB4 selon CPU ; connecteur HDMI interne pour écran de boîtier"
          },
          {
            "label": "Alimentation",
            "value": "ATX 24 broches + 2 EPS 8 broches"
          },
          {
            "label": "Maintenance",
            "value": "Q-Flash Plus · EZ-Latch Plus / Click · boutons et voyants de diagnostic"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "X870 A ELITE WIFI7",
      "socket": "AM5",
      "formFactor": "ATX",
      "memoryType": "DDR5",
      "memorySlots": 4,
      "memoryChannels": 2,
      "maxMemoryGB": 256,
      "detailLevel": "documented",
      "m2Slots": 4,
      "maxMemoryPerSlotGB": 64,
      "heightMm": 305,
      "widthMm": 244,
      "description": "Gigabyte X870 AORUS ELITE WIFI7 noire ATX AM5 : 4 DIMM DDR5 jusqu’à 256 Go, 4 M.2 dont 3 Gen5, 4 SATA, USB4 et Wi-Fi 7. Le partage des lignes M.2 réduit la largeur du slot graphique ; certains emplacements sont indisponibles avec Ryzen 8000.",
      "specs": [
        "AM5 · AMD X870 · ATX",
        "4 DIMM DDR5 · 256 Go · 64 Go/module",
        "4 M.2 dont 3 Gen5 · 4 SATA",
        "USB4 · Wi-Fi 7 · LAN 2,5 Gb/s",
        "Noir · version non-ICE",
        "X870 A ELITE WIFI7"
      ]
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00632047.html",
        "productName": "Gigabyte X870 AORUS ELITE WIFI7",
        "mpn": "X870 A ELITE WIFI7",
        "amount": 349.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non confirmés.",
        "checkedAt": "2026-11-10T10:28:06.855081+00:00"
      }
    ],
    "notes": [
      "M2B_CPU et M2C_CPU partagent les lignes avec le slot graphique : l’occupation de l’un réduit PCIEX16 à x8. Ces deux M.2 sont indisponibles avec Ryzen 8000 Phoenix 1 / 2.",
      "L’occupation de M2D_SB désactive le slot PCIEX4. Avec Ryzen 8000, PCIEX16 fonctionne en Gen4 x8 (Phoenix 1) ou Gen4 x4 (Phoenix 2), et M2A_CPU en Gen4.",
      "Le marchand ne précise pas la révision PCB livrée. Les caractéristiques communes des révisions 1.0 / 1.1 sont retenues ; leur module Wi-Fi est indiqué séparément. Les offres ICE blanches et X870E sont exclues."
    ]
  }
};
