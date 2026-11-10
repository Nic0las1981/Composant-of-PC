// Individually reviewed primary manufacturer and retailer records. Rebuild with scripts/build-individual-psu.py.
import type {VerifiedProduct} from "./verifiedTypes.ts";
export const individualPsuRecords: Record<string,VerifiedProduct> = {
  "import-psu-01e3e8ba588f": {
    "mpn": "BP006EU",
    "identityNote": "Power Zone 2 750 W noire, conditionnement européen BP006EU, confirmé sur la fiche fabricant et les deux pages marchandes. Les autres puissances et les références US sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — fiche constructeur EU",
        "url": "https://www.bequiet.com/fr/powersupply/5585",
        "checkedAt": "2026-11-10T10:19:31.289Z",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-be-quiet-power-zone-2-750w-80-plus-platinum-modulaire",
        "checkedAt": "2026-11-10T10:19:36.982849+00:00",
        "kind": "retailer"
      },
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00672613.html",
        "checkedAt": "2026-11-10T10:21:09.909042+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Alimentation — données constructeur",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Puissance de crête déclarée",
            "value": "820 W"
          },
          {
            "label": "Normes",
            "value": "ATX 3.1 · EPS 12V 2.92 · PCIe 5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum · Cybenetics Platinum"
          },
          {
            "label": "Câblage",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Topologie",
            "value": "LLC + SR + DC/DC"
          },
          {
            "label": "Rail +12 V",
            "value": "Mono-rail · 750 W combinés"
          },
          {
            "label": "Rails +3,3 V et +5 V",
            "value": "120 W combinés"
          },
          {
            "label": "Secteur",
            "value": "100–240 V AC · 50–60 Hz"
          },
          {
            "label": "Température maximale déclarée",
            "value": "40 °C"
          },
          {
            "label": "Rendement déclaré à 230 V et 50 % de charge",
            "value": "94.2 %"
          },
          {
            "label": "Protections",
            "value": "OTP · OCP · OPP · SCP · OVP · UVP · SIP"
          },
          {
            "label": "Garantie constructeur",
            "value": "10 ans"
          }
        ]
      },
      {
        "title": "Connecteurs et câbles",
        "rows": [
          {
            "label": "Carte mère",
            "value": "1 × ATX 20+4 broches"
          },
          {
            "label": "Processeur",
            "value": "1 × EPS P8 et 1 × EPS P4+4"
          },
          {
            "label": "Carte graphique PCIe 5.1",
            "value": "1 × 12V-2x6 · 600 W · connecteur coudé à 90°"
          },
          {
            "label": "Carte graphique PCIe classique",
            "value": "3 × 6+2 broches"
          },
          {
            "label": "Périphériques",
            "value": "6 × SATA · 1 × PATA/Molex"
          },
          {
            "label": "Longueur du câble GPU",
            "value": "60 cm"
          },
          {
            "label": "Nombre de câbles déclaré",
            "value": "8"
          }
        ]
      },
      {
        "title": "Dimensions et refroidissement",
        "rows": [
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur × 150 mm largeur × 86 mm hauteur"
          },
          {
            "label": "Poids",
            "value": "1.73 kg"
          },
          {
            "label": "Couleur",
            "value": "Noir · sans éclairage RGB"
          },
          {
            "label": "Ventilateur",
            "value": "1 × Pure Wings 3 · 140 mm · roulement Rifle"
          },
          {
            "label": "Régulation",
            "value": "Semi-passive ; arrêt à faible charge, temporisation de refroidissement 2 à 5 min"
          },
          {
            "label": "Vitesse maximale déclarée",
            "value": "1800 tr/min"
          },
          {
            "label": "Bruit déclaré à pleine charge",
            "value": "15.8 dB(A)"
          },
          {
            "label": "Finition",
            "value": "Grille mesh et désignations des connecteurs imprimées sur le boîtier"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BP006EU",
      "detailLevel": "documented",
      "wattage": 750,
      "psuFormat": "ATX",
      "lengthMm": 160,
      "depthMm": 160,
      "widthMm": 150,
      "heightMm": 86,
      "fanCount": 1,
      "fanSizeMm": 140,
      "color": "#22252c",
      "rgb": false,
      "description": "Alimentation be quiet! Power Zone 2 750 W, référence européenne BP006EU. ATX 3.1 et PCIe 5.1, certifications 80 PLUS Platinum et Cybenetics Platinum. Câblage entièrement modulaire, connecteur 12V-2x6 600 W coudé et ventilateur Pure Wings 3 de 140 mm semi-passif. Dimensions hors câbles : 160 × 150 × 86 mm.",
      "specs": [
        "750 W",
        "80 PLUS Platinum · Cybenetics Platinum",
        "ATX 3.1 · PCIe 5.1",
        "Modulaire · 12V-2x6 600 W",
        "160 × 150 × 86 mm",
        "Pure Wings 3 · 140 mm",
        "BP006EU"
      ]
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-be-quiet-power-zone-2-750w-80-plus-platinum-modulaire",
        "productName": "Be quiet Power Zone 2 750W 80 PLUS Platinum Modulaire",
        "mpn": "BP006EU",
        "amount": 128.99,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Livraison à 0 € indiquée pour la France, codes postaux 01000 à 95880 ; vérifier l’éligibilité de l’adresse au paiement.",
        "checkedAt": "2026-11-10T10:19:36.982849+00:00"
      },
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00672613.html",
        "productName": "be quiet! Power Zone 2 750W 80PLUS Platinum",
        "mpn": "BP006EU",
        "amount": 149.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non confirmés.",
        "checkedAt": "2026-11-10T10:21:09.909042+00:00"
      }
    ],
    "notes": [
      "Dimensions hors câbles : prévoir le dégagement nécessaire pour les connecteurs et leurs courbures. Les câbles modulaires doivent correspondre à cette alimentation.",
      "Le paragraphe promotionnel LDLC mentionne « Gold » ; sa fiche technique et le fabricant confirment 80 PLUS Platinum. La certification fabricant est retenue."
    ]
  },
  "import-psu-a92896f7672c": {
    "mpn": "BP007EU",
    "identityNote": "Power Zone 2 850 W noire, conditionnement européen BP007EU, confirmé sur la fiche fabricant et les deux pages marchandes. Les autres puissances et les références US sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — fiche constructeur EU",
        "url": "https://www.bequiet.com/fr/powersupply/5584",
        "checkedAt": "2026-11-10T10:19:30.783Z",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-be-quiet-power-zone-2-850w-80-plus-platinum-modulaire",
        "checkedAt": "2026-11-10T10:19:35.355125+00:00",
        "kind": "retailer"
      },
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00672614.html",
        "checkedAt": "2026-11-10T10:21:09.387059+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Alimentation — données constructeur",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Puissance de crête déclarée",
            "value": "920 W"
          },
          {
            "label": "Normes",
            "value": "ATX 3.1 · EPS 12V 2.92 · PCIe 5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum · Cybenetics Platinum"
          },
          {
            "label": "Câblage",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Topologie",
            "value": "LLC + SR + DC/DC"
          },
          {
            "label": "Rail +12 V",
            "value": "Mono-rail · 849.6 W combinés"
          },
          {
            "label": "Rails +3,3 V et +5 V",
            "value": "120 W combinés"
          },
          {
            "label": "Secteur",
            "value": "100–240 V AC · 50–60 Hz"
          },
          {
            "label": "Température maximale déclarée",
            "value": "40 °C"
          },
          {
            "label": "Rendement déclaré à 230 V et 50 % de charge",
            "value": "94.1 %"
          },
          {
            "label": "Protections",
            "value": "OTP · OCP · OPP · SCP · OVP · UVP · SIP"
          },
          {
            "label": "Garantie constructeur",
            "value": "10 ans"
          }
        ]
      },
      {
        "title": "Connecteurs et câbles",
        "rows": [
          {
            "label": "Carte mère",
            "value": "1 × ATX 20+4 broches"
          },
          {
            "label": "Processeur",
            "value": "1 × EPS P8 et 1 × EPS P4+4"
          },
          {
            "label": "Carte graphique PCIe 5.1",
            "value": "1 × 12V-2x6 · 600 W · connecteur coudé à 90°"
          },
          {
            "label": "Carte graphique PCIe classique",
            "value": "3 × 6+2 broches"
          },
          {
            "label": "Périphériques",
            "value": "7 × SATA · 1 × PATA/Molex"
          },
          {
            "label": "Longueur du câble GPU",
            "value": "60 cm"
          },
          {
            "label": "Nombre de câbles déclaré",
            "value": "8"
          }
        ]
      },
      {
        "title": "Dimensions et refroidissement",
        "rows": [
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur × 150 mm largeur × 86 mm hauteur"
          },
          {
            "label": "Poids",
            "value": "1.75 kg"
          },
          {
            "label": "Couleur",
            "value": "Noir · sans éclairage RGB"
          },
          {
            "label": "Ventilateur",
            "value": "1 × Pure Wings 3 · 140 mm · roulement Rifle"
          },
          {
            "label": "Régulation",
            "value": "Semi-passive ; arrêt à faible charge, temporisation de refroidissement 2 à 5 min"
          },
          {
            "label": "Vitesse maximale déclarée",
            "value": "2100 tr/min"
          },
          {
            "label": "Bruit déclaré à pleine charge",
            "value": "24.9 dB(A)"
          },
          {
            "label": "Finition",
            "value": "Grille mesh et désignations des connecteurs imprimées sur le boîtier"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BP007EU",
      "detailLevel": "documented",
      "wattage": 850,
      "psuFormat": "ATX",
      "lengthMm": 160,
      "depthMm": 160,
      "widthMm": 150,
      "heightMm": 86,
      "fanCount": 1,
      "fanSizeMm": 140,
      "color": "#22252c",
      "rgb": false,
      "description": "Alimentation be quiet! Power Zone 2 850 W, référence européenne BP007EU. ATX 3.1 et PCIe 5.1, certifications 80 PLUS Platinum et Cybenetics Platinum. Câblage entièrement modulaire, connecteur 12V-2x6 600 W coudé et ventilateur Pure Wings 3 de 140 mm semi-passif. Dimensions hors câbles : 160 × 150 × 86 mm.",
      "specs": [
        "850 W",
        "80 PLUS Platinum · Cybenetics Platinum",
        "ATX 3.1 · PCIe 5.1",
        "Modulaire · 12V-2x6 600 W",
        "160 × 150 × 86 mm",
        "Pure Wings 3 · 140 mm",
        "BP007EU"
      ]
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "1foDiscount-fr",
        "url": "https://www.pccomponentes.fr/alimentation-pc-be-quiet-power-zone-2-850w-80-plus-platinum-modulaire",
        "productName": "Be quiet Power Zone 2 850W 80 PLUS Platinum Modulaire",
        "mpn": "BP007EU",
        "amount": 161.41,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Livraison à 0 € indiquée pour la France, codes postaux 01000 à 95880 ; vérifier l’éligibilité de l’adresse au paiement.",
        "checkedAt": "2026-11-10T10:19:35.355125+00:00"
      },
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00672614.html",
        "productName": "be quiet! Power Zone 2 850W 80PLUS Platinum",
        "mpn": "BP007EU",
        "amount": 169.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non confirmés.",
        "checkedAt": "2026-11-10T10:21:09.387059+00:00"
      }
    ],
    "notes": [
      "Dimensions hors câbles : prévoir le dégagement nécessaire pour les connecteurs et leurs courbures. Les câbles modulaires doivent correspondre à cette alimentation.",
      "Le paragraphe promotionnel LDLC mentionne « Gold » ; sa fiche technique et le fabricant confirment 80 PLUS Platinum. La certification fabricant est retenue."
    ]
  },
  "import-psu-3f7709be66e0": {
    "mpn": "BP008EU",
    "identityNote": "Power Zone 2 1000 W noire, conditionnement européen BP008EU, confirmé sur la fiche fabricant et les deux pages marchandes. Les autres puissances et les références US sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — fiche constructeur EU",
        "url": "https://www.bequiet.com/fr/powersupply/5583",
        "checkedAt": "2026-11-10T10:19:04.427Z",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-be-quiet-power-zone-2-1000w-80-plus-platinum-modulaire",
        "checkedAt": "2026-11-10T10:19:33.534273+00:00",
        "kind": "retailer"
      },
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00672615.html",
        "checkedAt": "2026-11-10T10:21:08.852778+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Alimentation — données constructeur",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "1000 W"
          },
          {
            "label": "Puissance de crête déclarée",
            "value": "1070 W"
          },
          {
            "label": "Normes",
            "value": "ATX 3.1 · EPS 12V 2.92 · PCIe 5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum · Cybenetics Platinum"
          },
          {
            "label": "Câblage",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Topologie",
            "value": "LLC + SR + DC/DC"
          },
          {
            "label": "Rail +12 V",
            "value": "Mono-rail · 999.6 W combinés"
          },
          {
            "label": "Rails +3,3 V et +5 V",
            "value": "120 W combinés"
          },
          {
            "label": "Secteur",
            "value": "100–240 V AC · 50–60 Hz"
          },
          {
            "label": "Température maximale déclarée",
            "value": "40 °C"
          },
          {
            "label": "Rendement déclaré à 230 V et 50 % de charge",
            "value": "94.0 %"
          },
          {
            "label": "Protections",
            "value": "OTP · OCP · OPP · SCP · OVP · UVP · SIP"
          },
          {
            "label": "Garantie constructeur",
            "value": "10 ans"
          }
        ]
      },
      {
        "title": "Connecteurs et câbles",
        "rows": [
          {
            "label": "Carte mère",
            "value": "1 × ATX 20+4 broches"
          },
          {
            "label": "Processeur",
            "value": "1 × EPS P8 et 1 × EPS P4+4"
          },
          {
            "label": "Carte graphique PCIe 5.1",
            "value": "1 × 12V-2x6 · 600 W · connecteur coudé à 90°"
          },
          {
            "label": "Carte graphique PCIe classique",
            "value": "3 × 6+2 broches"
          },
          {
            "label": "Périphériques",
            "value": "7 × SATA · 1 × PATA/Molex"
          },
          {
            "label": "Longueur du câble GPU",
            "value": "60 cm"
          },
          {
            "label": "Nombre de câbles déclaré",
            "value": "8"
          }
        ]
      },
      {
        "title": "Dimensions et refroidissement",
        "rows": [
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur × 150 mm largeur × 86 mm hauteur"
          },
          {
            "label": "Poids",
            "value": "1.78 kg"
          },
          {
            "label": "Couleur",
            "value": "Noir · sans éclairage RGB"
          },
          {
            "label": "Ventilateur",
            "value": "1 × Pure Wings 3 · 140 mm · roulement Rifle"
          },
          {
            "label": "Régulation",
            "value": "Semi-passive ; arrêt à faible charge, temporisation de refroidissement 2 à 5 min"
          },
          {
            "label": "Vitesse maximale déclarée",
            "value": "2100 tr/min"
          },
          {
            "label": "Bruit déclaré à pleine charge",
            "value": "27.2 dB(A)"
          },
          {
            "label": "Finition",
            "value": "Grille mesh et désignations des connecteurs imprimées sur le boîtier"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BP008EU",
      "detailLevel": "documented",
      "wattage": 1000,
      "psuFormat": "ATX",
      "lengthMm": 160,
      "depthMm": 160,
      "widthMm": 150,
      "heightMm": 86,
      "fanCount": 1,
      "fanSizeMm": 140,
      "color": "#22252c",
      "rgb": false,
      "description": "Alimentation be quiet! Power Zone 2 1000 W, référence européenne BP008EU. ATX 3.1 et PCIe 5.1, certifications 80 PLUS Platinum et Cybenetics Platinum. Câblage entièrement modulaire, connecteur 12V-2x6 600 W coudé et ventilateur Pure Wings 3 de 140 mm semi-passif. Dimensions hors câbles : 160 × 150 × 86 mm.",
      "specs": [
        "1000 W",
        "80 PLUS Platinum · Cybenetics Platinum",
        "ATX 3.1 · PCIe 5.1",
        "Modulaire · 12V-2x6 600 W",
        "160 × 150 × 86 mm",
        "Pure Wings 3 · 140 mm",
        "BP008EU"
      ]
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "1foDiscount-fr",
        "url": "https://www.pccomponentes.fr/alimentation-pc-be-quiet-power-zone-2-1000w-80-plus-platinum-modulaire",
        "productName": "Be quiet Power Zone 2 1000W 80 PLUS Platinum Modulaire",
        "mpn": "BP008EU",
        "amount": 180.41,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Livraison à 0 € indiquée pour la France, codes postaux 01000 à 95880 ; vérifier l’éligibilité de l’adresse au paiement.",
        "checkedAt": "2026-11-10T10:19:33.534273+00:00"
      },
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00672615.html",
        "productName": "be quiet! Power Zone 2 1000W 80PLUS Platinum",
        "mpn": "BP008EU",
        "amount": 189.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non confirmés.",
        "checkedAt": "2026-11-10T10:21:08.852778+00:00"
      }
    ],
    "notes": [
      "Dimensions hors câbles : prévoir le dégagement nécessaire pour les connecteurs et leurs courbures. Les câbles modulaires doivent correspondre à cette alimentation.",
      "Le paragraphe promotionnel LDLC mentionne « Gold » ; sa fiche technique et le fabricant confirment 80 PLUS Platinum. La certification fabricant est retenue."
    ]
  },
  "import-psu-fbc7537b3ed1": {
    "mpn": "BP024EU",
    "identityNote": "Pure Power 13 M 550 W, référence européenne BP024EU identifiée dans le tableau logistique du fabricant et sur la page marchande. Ne pas confondre avec Pure Power 12 M ou un conditionnement US.",
    "sources": [
      {
        "name": "be quiet! — fiche technique Pure Power 13 M, références EU",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=a3039a65539%40be-quiet.net&rand=9642eea8ef75738e28da5a7f97654658&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T10:24:31.854Z",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-alimentation-be-quiet-pure-power-13-m-550w-80-plus-gold-active-cooling-noir",
        "checkedAt": "2026-11-10T10:24:41.881540+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Alimentation — fiche fabricant EU",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "550 W"
          },
          {
            "label": "Normes",
            "value": "ATX 3.1 · EPS 12V 2.92 · PCIe 5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Câblage",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Topologie",
            "value": "LLC"
          },
          {
            "label": "Rail +12 V",
            "value": "Mono-rail · 550 W combinés déclarés"
          },
          {
            "label": "Rails +3,3 V et +5 V",
            "value": "120 W combinés"
          },
          {
            "label": "Secteur",
            "value": "100–240 V AC · 50–60 Hz"
          },
          {
            "label": "Protections",
            "value": "OCP · OVP · UVP · SCP · OPP · OTP"
          },
          {
            "label": "Garantie constructeur",
            "value": "10 ans"
          }
        ]
      },
      {
        "title": "Connecteurs et dimensions",
        "rows": [
          {
            "label": "Carte mère",
            "value": "1 × ATX 20+4 broches"
          },
          {
            "label": "Processeur",
            "value": "1 × EPS P4+4"
          },
          {
            "label": "Carte graphique PCIe 5.1",
            "value": "1 × câble 12V-2x6"
          },
          {
            "label": "Carte graphique PCIe classique",
            "value": "2 × 6+2 broches"
          },
          {
            "label": "Périphériques",
            "value": "5 × SATA · 2 × PATA/Molex"
          },
          {
            "label": "Longueur du câble carte mère",
            "value": "55 cm"
          },
          {
            "label": "Longueur maximale des câbles",
            "value": "95 cm"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur × 150 mm largeur × 86 mm hauteur"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Refroidissement",
            "value": "Ventilateur be quiet! 120 mm thermorégulé · fonctionnement semi-passif"
          },
          {
            "label": "Bruit déclaré à pleine charge",
            "value": "14 dB(A)"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BP024EU",
      "detailLevel": "documented",
      "wattage": 550,
      "psuFormat": "ATX",
      "lengthMm": 160,
      "depthMm": 160,
      "widthMm": 150,
      "heightMm": 86,
      "fanCount": 1,
      "fanSizeMm": 120,
      "color": "#22252c",
      "rgb": false,
      "description": "Alimentation be quiet! Pure Power 13 M 550 W, conditionnement européen BP024EU. ATX 3.1 et PCIe 5.1, certification 80 PLUS Gold, câble 12V-2x6 et câblage entièrement modulaire. Refroidissement semi-passif par ventilateur de 120 mm. Dimensions hors câbles : 160 × 150 × 86 mm.",
      "specs": [
        "550 W",
        "80 PLUS Gold",
        "ATX 3.1 · PCIe 5.1",
        "Modulaire · 12V-2x6",
        "160 × 150 × 86 mm",
        "Ventilateur 120 mm semi-passif",
        "BP024EU"
      ]
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-alimentation-be-quiet-pure-power-13-m-550w-80-plus-gold-active-cooling-noir",
        "productName": "Alimentation be quiet! Pure Power 13 M 550W 80 PLUS Gold Active Cooling Noir",
        "mpn": "BP024EU",
        "amount": 92.63,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Livraison à 0 € affichée ; destination et conditions du vendeur à confirmer au paiement.",
        "checkedAt": "2026-11-10T10:24:41.881540+00:00"
      }
    ],
    "notes": [
      "La fiche technique constructeur donne les connecteurs par puissance ; ses valeurs priment sur les résumés marchands génériques. Les références EU et US restent distinctes.",
      "Prévoir de la place pour les câbles et respecter leur compatibilité avec cette alimentation."
    ]
  },
  "import-psu-a3469b3b7281": {
    "mpn": "BP025EU",
    "identityNote": "Pure Power 13 M 650 W, référence européenne BP025EU identifiée dans le tableau logistique du fabricant et sur la page marchande. Ne pas confondre avec Pure Power 12 M ou un conditionnement US.",
    "sources": [
      {
        "name": "be quiet! — fiche technique Pure Power 13 M, références EU",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=a3039a65539%40be-quiet.net&rand=9642eea8ef75738e28da5a7f97654658&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T10:24:31.854Z",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-alimentation-be-quiet-650w-certification-80-plus-gold-modele-pure-power-13-m",
        "checkedAt": "2026-11-10T10:24:40.188892+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Alimentation — fiche fabricant EU",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "650 W"
          },
          {
            "label": "Normes",
            "value": "ATX 3.1 · EPS 12V 2.92 · PCIe 5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Câblage",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Topologie",
            "value": "LLC"
          },
          {
            "label": "Rail +12 V",
            "value": "Mono-rail · 650 W combinés déclarés"
          },
          {
            "label": "Rails +3,3 V et +5 V",
            "value": "120 W combinés"
          },
          {
            "label": "Secteur",
            "value": "100–240 V AC · 50–60 Hz"
          },
          {
            "label": "Protections",
            "value": "OCP · OVP · UVP · SCP · OPP · OTP"
          },
          {
            "label": "Garantie constructeur",
            "value": "10 ans"
          }
        ]
      },
      {
        "title": "Connecteurs et dimensions",
        "rows": [
          {
            "label": "Carte mère",
            "value": "1 × ATX 20+4 broches"
          },
          {
            "label": "Processeur",
            "value": "1 × EPS P4+4 et 1 × P4"
          },
          {
            "label": "Carte graphique PCIe 5.1",
            "value": "1 × câble 12V-2x6"
          },
          {
            "label": "Carte graphique PCIe classique",
            "value": "2 × 6+2 broches"
          },
          {
            "label": "Périphériques",
            "value": "5 × SATA · 2 × PATA/Molex"
          },
          {
            "label": "Longueur du câble carte mère",
            "value": "55 cm"
          },
          {
            "label": "Longueur maximale des câbles",
            "value": "95 cm"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur × 150 mm largeur × 86 mm hauteur"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Refroidissement",
            "value": "Ventilateur be quiet! 120 mm thermorégulé · fonctionnement semi-passif"
          },
          {
            "label": "Bruit déclaré à pleine charge",
            "value": "15.9 dB(A)"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BP025EU",
      "detailLevel": "documented",
      "wattage": 650,
      "psuFormat": "ATX",
      "lengthMm": 160,
      "depthMm": 160,
      "widthMm": 150,
      "heightMm": 86,
      "fanCount": 1,
      "fanSizeMm": 120,
      "color": "#22252c",
      "rgb": false,
      "description": "Alimentation be quiet! Pure Power 13 M 650 W, conditionnement européen BP025EU. ATX 3.1 et PCIe 5.1, certification 80 PLUS Gold, câble 12V-2x6 et câblage entièrement modulaire. Refroidissement semi-passif par ventilateur de 120 mm. Dimensions hors câbles : 160 × 150 × 86 mm.",
      "specs": [
        "650 W",
        "80 PLUS Gold",
        "ATX 3.1 · PCIe 5.1",
        "Modulaire · 12V-2x6",
        "160 × 150 × 86 mm",
        "Ventilateur 120 mm semi-passif",
        "BP025EU"
      ]
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-alimentation-be-quiet-650w-certification-80-plus-gold-modele-pure-power-13-m",
        "productName": "Alimentation be quiet! 650W Certification 80+ Gold Modèle Pure Power 13 M",
        "mpn": "BP025EU",
        "amount": 121.99,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Livraison à 0 € affichée ; destination et conditions du vendeur à confirmer au paiement.",
        "checkedAt": "2026-11-10T10:24:40.188892+00:00"
      }
    ],
    "notes": [
      "La fiche technique constructeur donne les connecteurs par puissance ; ses valeurs priment sur les résumés marchands génériques. Les références EU et US restent distinctes.",
      "Prévoir de la place pour les câbles et respecter leur compatibilité avec cette alimentation."
    ]
  },
  "import-psu-6f42f2d8e160": {
    "mpn": "BP026EU",
    "identityNote": "Pure Power 13 M 750 W, référence européenne BP026EU identifiée dans le tableau logistique du fabricant et sur la page marchande. Ne pas confondre avec Pure Power 12 M ou un conditionnement US.",
    "sources": [
      {
        "name": "be quiet! — fiche technique Pure Power 13 M, références EU",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=a3039a65539%40be-quiet.net&rand=9642eea8ef75738e28da5a7f97654658&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T10:24:31.854Z",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-alimentation-be-quiet-pure-power-13-m-750w-80-plus-gold-atx-noir",
        "checkedAt": "2026-11-10T10:24:38.285564+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Alimentation — fiche fabricant EU",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Normes",
            "value": "ATX 3.1 · EPS 12V 2.92 · PCIe 5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Câblage",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Topologie",
            "value": "LLC"
          },
          {
            "label": "Rail +12 V",
            "value": "Mono-rail · 750 W combinés déclarés"
          },
          {
            "label": "Rails +3,3 V et +5 V",
            "value": "120 W combinés"
          },
          {
            "label": "Secteur",
            "value": "100–240 V AC · 50–60 Hz"
          },
          {
            "label": "Protections",
            "value": "OCP · OVP · UVP · SCP · OPP · OTP"
          },
          {
            "label": "Garantie constructeur",
            "value": "10 ans"
          }
        ]
      },
      {
        "title": "Connecteurs et dimensions",
        "rows": [
          {
            "label": "Carte mère",
            "value": "1 × ATX 20+4 broches"
          },
          {
            "label": "Processeur",
            "value": "1 × EPS P4+4 et 1 × P8"
          },
          {
            "label": "Carte graphique PCIe 5.1",
            "value": "1 × câble 12V-2x6"
          },
          {
            "label": "Carte graphique PCIe classique",
            "value": "4 × 6+2 broches"
          },
          {
            "label": "Périphériques",
            "value": "6 × SATA · 2 × PATA/Molex"
          },
          {
            "label": "Longueur du câble carte mère",
            "value": "55 cm"
          },
          {
            "label": "Longueur maximale des câbles",
            "value": "95 cm"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur × 150 mm largeur × 86 mm hauteur"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Refroidissement",
            "value": "Ventilateur be quiet! 120 mm thermorégulé · fonctionnement semi-passif"
          },
          {
            "label": "Bruit déclaré à pleine charge",
            "value": "16.5 dB(A)"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BP026EU",
      "detailLevel": "documented",
      "wattage": 750,
      "psuFormat": "ATX",
      "lengthMm": 160,
      "depthMm": 160,
      "widthMm": 150,
      "heightMm": 86,
      "fanCount": 1,
      "fanSizeMm": 120,
      "color": "#22252c",
      "rgb": false,
      "description": "Alimentation be quiet! Pure Power 13 M 750 W, conditionnement européen BP026EU. ATX 3.1 et PCIe 5.1, certification 80 PLUS Gold, câble 12V-2x6 et câblage entièrement modulaire. Refroidissement semi-passif par ventilateur de 120 mm. Dimensions hors câbles : 160 × 150 × 86 mm.",
      "specs": [
        "750 W",
        "80 PLUS Gold",
        "ATX 3.1 · PCIe 5.1",
        "Modulaire · 12V-2x6",
        "160 × 150 × 86 mm",
        "Ventilateur 120 mm semi-passif",
        "BP026EU"
      ]
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "Infopavon",
        "url": "https://www.pccomponentes.fr/alimentation-pc-alimentation-be-quiet-pure-power-13-m-750w-80-plus-gold-atx-noir",
        "productName": "Alimentation be quiet! Pure Power 13 M 750W 80 PLUS Gold ATX Noir",
        "mpn": "BP026EU",
        "amount": 119.87,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 9.95,
        "shippingNote": "Frais affichés : 9.95 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T10:24:38.285564+00:00"
      }
    ],
    "notes": [
      "La fiche technique constructeur donne les connecteurs par puissance ; ses valeurs priment sur les résumés marchands génériques. Les références EU et US restent distinctes.",
      "Prévoir de la place pour les câbles et respecter leur compatibilité avec cette alimentation."
    ]
  },
  "import-psu-f6b165c597a9": {
    "mpn": "BP027EU",
    "identityNote": "Pure Power 13 M 850 W, référence européenne BP027EU identifiée dans le tableau logistique du fabricant et sur la page marchande. Ne pas confondre avec Pure Power 12 M ou un conditionnement US.",
    "sources": [
      {
        "name": "be quiet! — fiche technique Pure Power 13 M, références EU",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=a3039a65539%40be-quiet.net&rand=9642eea8ef75738e28da5a7f97654658&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T10:24:31.854Z",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-alimentation-be-quiet-pure-power-13-m-850w-80-plus-gold-atx-active-cooling",
        "checkedAt": "2026-11-10T10:24:36.349599+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Alimentation — fiche fabricant EU",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Normes",
            "value": "ATX 3.1 · EPS 12V 2.92 · PCIe 5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Câblage",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Topologie",
            "value": "LLC"
          },
          {
            "label": "Rail +12 V",
            "value": "Mono-rail · 850 W combinés déclarés"
          },
          {
            "label": "Rails +3,3 V et +5 V",
            "value": "120 W combinés"
          },
          {
            "label": "Secteur",
            "value": "100–240 V AC · 50–60 Hz"
          },
          {
            "label": "Protections",
            "value": "OCP · OVP · UVP · SCP · OPP · OTP"
          },
          {
            "label": "Garantie constructeur",
            "value": "10 ans"
          }
        ]
      },
      {
        "title": "Connecteurs et dimensions",
        "rows": [
          {
            "label": "Carte mère",
            "value": "1 × ATX 20+4 broches"
          },
          {
            "label": "Processeur",
            "value": "1 × EPS P4+4 et 1 × P8"
          },
          {
            "label": "Carte graphique PCIe 5.1",
            "value": "1 × câble 12V-2x6"
          },
          {
            "label": "Carte graphique PCIe classique",
            "value": "4 × 6+2 broches"
          },
          {
            "label": "Périphériques",
            "value": "6 × SATA · 2 × PATA/Molex"
          },
          {
            "label": "Longueur du câble carte mère",
            "value": "55 cm"
          },
          {
            "label": "Longueur maximale des câbles",
            "value": "95 cm"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur × 150 mm largeur × 86 mm hauteur"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Refroidissement",
            "value": "Ventilateur be quiet! 120 mm thermorégulé · fonctionnement semi-passif"
          },
          {
            "label": "Bruit déclaré à pleine charge",
            "value": "17.6 dB(A)"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BP027EU",
      "detailLevel": "documented",
      "wattage": 850,
      "psuFormat": "ATX",
      "lengthMm": 160,
      "depthMm": 160,
      "widthMm": 150,
      "heightMm": 86,
      "fanCount": 1,
      "fanSizeMm": 120,
      "color": "#22252c",
      "rgb": false,
      "description": "Alimentation be quiet! Pure Power 13 M 850 W, conditionnement européen BP027EU. ATX 3.1 et PCIe 5.1, certification 80 PLUS Gold, câble 12V-2x6 et câblage entièrement modulaire. Refroidissement semi-passif par ventilateur de 120 mm. Dimensions hors câbles : 160 × 150 × 86 mm.",
      "specs": [
        "850 W",
        "80 PLUS Gold",
        "ATX 3.1 · PCIe 5.1",
        "Modulaire · 12V-2x6",
        "160 × 150 × 86 mm",
        "Ventilateur 120 mm semi-passif",
        "BP027EU"
      ]
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "Infopavon",
        "url": "https://www.pccomponentes.fr/alimentation-pc-alimentation-be-quiet-pure-power-13-m-850w-80-plus-gold-atx-active-cooling",
        "productName": "Alimentation be quiet! Pure Power 13 M 850W 80 PLUS Gold ATX Active Cooling",
        "mpn": "BP027EU",
        "amount": 138.36,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 9.95,
        "shippingNote": "Frais affichés : 9.95 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T10:24:36.349599+00:00"
      }
    ],
    "notes": [
      "La fiche technique constructeur donne les connecteurs par puissance ; ses valeurs priment sur les résumés marchands génériques. Les références EU et US restent distinctes.",
      "Prévoir de la place pour les câbles et respecter leur compatibilité avec cette alimentation."
    ]
  },
  "import-psu-bd748fa8d566": {
    "mpn": "BP028EU",
    "identityNote": "Pure Power 13 M 1000 W, référence européenne BP028EU identifiée dans le tableau logistique du fabricant et sur la page marchande. Ne pas confondre avec Pure Power 12 M ou un conditionnement US.",
    "sources": [
      {
        "name": "be quiet! — fiche technique Pure Power 13 M, références EU",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=a3039a65539%40be-quiet.net&rand=9642eea8ef75738e28da5a7f97654658&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T10:24:31.854Z",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-alimentation-be-quiet-pure-power-13-m-1000w-80-plus-gold-atx-modulaire",
        "checkedAt": "2026-11-10T10:24:34.417758+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Alimentation — fiche fabricant EU",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "1000 W"
          },
          {
            "label": "Normes",
            "value": "ATX 3.1 · EPS 12V 2.92 · PCIe 5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Câblage",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Topologie",
            "value": "LLC"
          },
          {
            "label": "Rail +12 V",
            "value": "Mono-rail · 1000 W combinés déclarés"
          },
          {
            "label": "Rails +3,3 V et +5 V",
            "value": "120 W combinés"
          },
          {
            "label": "Secteur",
            "value": "100–240 V AC · 50–60 Hz"
          },
          {
            "label": "Protections",
            "value": "OCP · OVP · UVP · SCP · OPP · OTP"
          },
          {
            "label": "Garantie constructeur",
            "value": "10 ans"
          }
        ]
      },
      {
        "title": "Connecteurs et dimensions",
        "rows": [
          {
            "label": "Carte mère",
            "value": "1 × ATX 20+4 broches"
          },
          {
            "label": "Processeur",
            "value": "1 × EPS P4+4 et 1 × P8"
          },
          {
            "label": "Carte graphique PCIe 5.1",
            "value": "1 × câble 12V-2x6"
          },
          {
            "label": "Carte graphique PCIe classique",
            "value": "4 × 6+2 broches"
          },
          {
            "label": "Périphériques",
            "value": "6 × SATA · 2 × PATA/Molex"
          },
          {
            "label": "Longueur du câble carte mère",
            "value": "55 cm"
          },
          {
            "label": "Longueur maximale des câbles",
            "value": "95 cm"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur × 150 mm largeur × 86 mm hauteur"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Refroidissement",
            "value": "Ventilateur be quiet! 120 mm thermorégulé · fonctionnement semi-passif"
          },
          {
            "label": "Bruit déclaré à pleine charge",
            "value": "19.5 dB(A)"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BP028EU",
      "detailLevel": "documented",
      "wattage": 1000,
      "psuFormat": "ATX",
      "lengthMm": 160,
      "depthMm": 160,
      "widthMm": 150,
      "heightMm": 86,
      "fanCount": 1,
      "fanSizeMm": 120,
      "color": "#22252c",
      "rgb": false,
      "description": "Alimentation be quiet! Pure Power 13 M 1000 W, conditionnement européen BP028EU. ATX 3.1 et PCIe 5.1, certification 80 PLUS Gold, câble 12V-2x6 et câblage entièrement modulaire. Refroidissement semi-passif par ventilateur de 120 mm. Dimensions hors câbles : 160 × 150 × 86 mm.",
      "specs": [
        "1000 W",
        "80 PLUS Gold",
        "ATX 3.1 · PCIe 5.1",
        "Modulaire · 12V-2x6",
        "160 × 150 × 86 mm",
        "Ventilateur 120 mm semi-passif",
        "BP028EU"
      ]
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-alimentation-be-quiet-pure-power-13-m-1000w-80-plus-gold-atx-modulaire",
        "productName": "Alimentation be quiet! Pure Power 13 M 1000W 80 Plus Gold ATX Modulaire",
        "mpn": "BP028EU",
        "amount": 165.99,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Livraison à 0 € affichée ; destination et conditions du vendeur à confirmer au paiement.",
        "checkedAt": "2026-11-10T10:24:34.417758+00:00"
      }
    ],
    "notes": [
      "La fiche technique constructeur donne les connecteurs par puissance ; ses valeurs priment sur les résumés marchands génériques. Les références EU et US restent distinctes.",
      "Prévoir de la place pour les câbles et respecter leur compatibilité avec cette alimentation."
    ]
  }
};
