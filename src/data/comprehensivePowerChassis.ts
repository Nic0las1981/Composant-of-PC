// Source-backed power, cooling and chassis projections.
import type {VerifiedProduct} from "./verifiedTypes.ts";
export const comprehensivePowerChassisRecords: Record<string, VerifiedProduct> = {
  "cooler-nhd15": {
    "mpn": "NOCTUA NH-D15 CH.BK",
    "identityNote": "Référence exacte : NOCTUA NH-D15 CH.BK. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00280162.html",
        "checkedAt": "2026-11-10T08:45:34.752Z",
        "kind": "retailer"
      },
      {
        "name": "Noctua — spécifications officielles",
        "url": "https://www.noctua.at/en/products/nh-d15-chromax-black/specifications",
        "checkedAt": "2026-11-10T11:01:25.920360+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "AMD AM4 · Intel 1150 · Intel 1151 · Intel 1155 · Intel 1156 · Intel 1200 · AMD AM5 · Intel 1700 · Intel 1851"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Lumineux",
            "value": "Non"
          },
          {
            "label": "Connecteur(s)",
            "value": "4 Pins Femelle"
          },
          {
            "label": "Roulement à billes",
            "value": "Non"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Oui"
          },
          {
            "label": "Type de refroidissement",
            "value": "Ventirad (actif)"
          },
          {
            "label": "Top Flow",
            "value": "Non"
          },
          {
            "label": "Double tour",
            "value": "Oui"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "140 mm"
          },
          {
            "label": "Niveau sonore maxi",
            "value": "24.6 dB"
          },
          {
            "label": "Vitesse de rotation mini",
            "value": "300 RPM"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "1500 RPM"
          },
          {
            "label": "Débit d'air mini",
            "value": "115.5 m³/h"
          },
          {
            "label": "Débit d'air maxi",
            "value": "140.2 m³/h"
          },
          {
            "label": "Matériau(x)",
            "value": "Aluminium · ABS (Plastique) · Cuivre"
          },
          {
            "label": "Utilisation",
            "value": "Gamer · Serveur"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "N/A"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "150 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "161 mm"
          },
          {
            "label": "Poids",
            "value": "1320 g"
          }
        ]
      },
      {
        "title": "Complément vérifié — Noctua — spécifications officielles",
        "rows": [
          {
            "label": "Encombrement avec ventilateurs",
            "value": "168 mm hauteur × 150 mm largeur × 161 mm profondeur"
          },
          {
            "label": "Caloducs",
            "value": "6 × 6 mm"
          },
          {
            "label": "Ventilateurs",
            "value": "2 × NF-A15 HS-PWM chromax.black · 140 × 150 × 25 mm"
          },
          {
            "label": "Masse avec ventilateurs",
            "value": "1320 g"
          },
          {
            "label": "Garantie",
            "value": "6 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "NOCTUA NH-D15 CH.BK",
      "heightMm": 168,
      "widthMm": 150,
      "depthMm": 161,
      "fanCount": 2,
      "fanSizeMm": 140,
      "heatpipeCount": 6,
      "fanRgb": false,
      "description": "Noctua NH-D15 chromax.black, ventirad double tour à six caloducs et deux ventilateurs NF-A15. Le tableau mécanique constructeur consulté indique 168 × 150 × 161 mm (hauteur × largeur × profondeur). La documentation fabricant présente une discordance avec un texte marketing à 165 mm ; aucune révision matérielle expliquant cet écart n’est confirmée.",
      "specs": [
        "Double tour · 6 caloducs",
        "2 × NF-A15 140 mm",
        "Hauteur 168 mm — tableau fabricant actuel",
        "Largeur 150 mm · profondeur 161 mm",
        "Sans éclairage RGB",
        "Garantie 6 ans"
      ]
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00280162.html",
        "productName": "Noctua NH-D15 Chromax Black",
        "mpn": "NOCTUA NH-D15 CH.BK",
        "amount": 149.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:34.752Z"
      }
    ],
    "notes": [
      "Le tableau mécanique constructeur actuel annonce 168 mm avec ventilateurs ; son texte marketing mentionne encore 165 mm et une fiche marchande 170 mm. La valeur de 168 mm du tableau constructeur est retenue. La fiche concerne bien NH-D15 chromax.black, EAN 9010018000184, six caloducs et ventilateurs NF-A15, pas NH-D15 G2. Aucune révision matérielle ou modification physique expliquant cet écart n’a été confirmée : il s’agit d’une discordance entre documents. Relever le ventilateur pour de la RAM haute augmente encore la hauteur."
    ]
  },
  "cooler-l9a": {
    "mpn": "NH-L9A-AM5",
    "identityNote": "Référence exacte : NH-L9A-AM5. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00540616.html",
        "checkedAt": "2026-11-10T08:45:33.864Z",
        "kind": "retailer"
      },
      {
        "name": "Amazon.fr — MPN relevé, offre non confirmée",
        "url": "https://www.amazon.fr/-/en/Noctua-NH-L9a-AM5-Low-Height-Ventirad-Performance/dp/B0BNL8ZM1T",
        "checkedAt": "2026-11-10T09:32:56.475Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "AMD AM5"
          },
          {
            "label": "Lumineux",
            "value": "Non"
          },
          {
            "label": "Connecteur(s)",
            "value": "4 Pins Femelle"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Oui"
          },
          {
            "label": "Type de refroidissement",
            "value": "Ventirad (actif)"
          },
          {
            "label": "Top Flow",
            "value": "Oui"
          },
          {
            "label": "Double tour",
            "value": "Non"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "92 mm"
          },
          {
            "label": "Niveau sonore maxi",
            "value": "23.6 dB"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "2500 RPM"
          },
          {
            "label": "Débit d'air maxi",
            "value": "57.5 m³/h"
          },
          {
            "label": "Pression",
            "value": "2.11 mm/H2O"
          },
          {
            "label": "Matériau(x)",
            "value": "Cuivre/Aluminium"
          },
          {
            "label": "Utilisation",
            "value": "Multimédia · Bureautique"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "N/A"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Low profile",
            "value": "Oui"
          },
          {
            "label": "Hauteur (ventilateur inclus)",
            "value": "37 mm"
          },
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "114 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "92 mm"
          },
          {
            "label": "Hauteur",
            "value": "23 mm"
          },
          {
            "label": "Largeur",
            "value": "114 mm"
          },
          {
            "label": "Profondeur",
            "value": "92 mm"
          },
          {
            "label": "Poids",
            "value": "495 g"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "NH-L9A-AM5",
      "heightMm": 37.0,
      "widthMm": 114.0,
      "depthMm": 92.0,
      "fanSizeMm": 92.0
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00540616.html",
        "productName": "Noctua NH-L9a-AM5",
        "mpn": "NH-L9A-AM5",
        "amount": 59.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:33.864Z"
      }
    ],
    "notes": [
      "Amazon.fr : référence constructeur relevée dans le tableau produit. Aucun prix intégré : variante sélectionnée, vendeur, état et livraison en France doivent être confirmés ensemble."
    ]
  },
  "cooler-peerless": {
    "mpn": "PA120SE",
    "identityNote": "Référence exacte : PA120SE. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00581740.html",
        "checkedAt": "2026-11-10T08:45:34.102Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "AMD AM4 · AMD AM5 · Intel 1150 · Intel 1151 · Intel 1155 · Intel 1156 · Intel 1200 · Intel 1700 · Intel 1851"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Lumineux",
            "value": "Non"
          },
          {
            "label": "Connecteur(s)",
            "value": "1 X 4 Pins Femelle"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Oui"
          },
          {
            "label": "Vitesse réglable",
            "value": "Non"
          },
          {
            "label": "Type de refroidissement",
            "value": "Ventirad (actif)"
          },
          {
            "label": "Top Flow",
            "value": "Non"
          },
          {
            "label": "Double tour",
            "value": "Oui"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Niveau sonore maxi",
            "value": "25.6 dB"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "1550 RPM"
          },
          {
            "label": "Débit d'air maxi",
            "value": "66.17 CFM"
          },
          {
            "label": "Pression",
            "value": "1.53 mm/H2O"
          },
          {
            "label": "Matériau(x)",
            "value": "Aluminium · Cuivre"
          },
          {
            "label": "Utilisation",
            "value": "Gamer · Multimédia"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "N/A"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Hauteur (ventilateur inclus)",
            "value": "155 mm"
          },
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "160 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "125 mm"
          },
          {
            "label": "Poids",
            "value": "730 g"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "PA120SE",
      "heightMm": 155.0,
      "widthMm": 160.0,
      "depthMm": 125.0,
      "fanSizeMm": 120.0
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00581740.html",
        "productName": "Thermalright Peerless Assassin 120 SE",
        "mpn": "PA120SE",
        "amount": 44.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:34.102Z"
      }
    ],
    "notes": []
  },
  "cooler-darkrockpro5": {
    "mpn": "BK036",
    "identityNote": "Référence exacte : BK036. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00576680.html",
        "checkedAt": "2026-11-10T08:45:36.755Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "AMD AM4 · AMD AM5 · Intel 1150 · Intel 1151 · Intel 1155 · Intel 1200 · Intel 1700 · Intel 1851"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Lumineux",
            "value": "Non"
          },
          {
            "label": "Connecteur(s)",
            "value": "4 Pins Femelle"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Oui"
          },
          {
            "label": "Type de refroidissement",
            "value": "Ventirad (actif)"
          },
          {
            "label": "Top Flow",
            "value": "Non"
          },
          {
            "label": "Double tour",
            "value": "Oui"
          },
          {
            "label": "TDP Max. CPU",
            "value": "270 W"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "135 mm"
          },
          {
            "label": "Niveau sonore mini",
            "value": "8.9 dB"
          },
          {
            "label": "Niveau sonore maxi",
            "value": "32.2 dB"
          },
          {
            "label": "Vitesse de rotation mini",
            "value": "1300 RPM"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "2000 RPM"
          },
          {
            "label": "Matériau(x)",
            "value": "Aluminium · Cuivre"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "N/A"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Hauteur (ventilateur inclus)",
            "value": "168 mm"
          },
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "136 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "145 mm"
          },
          {
            "label": "Poids",
            "value": "1292 g"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BK036",
      "heightMm": 168.0,
      "widthMm": 136.0,
      "depthMm": 145.0,
      "fanSizeMm": 135.0
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00576680.html",
        "productName": "be quiet! Dark Rock Pro 5",
        "mpn": "BK036",
        "amount": 84.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:36.755Z"
      }
    ],
    "notes": []
  },
  "cooler-h100i240": {
    "mpn": "CW-9060068-WW",
    "identityNote": "Référence exacte : CW-9060068-WW. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00545178.html",
        "checkedAt": "2026-11-10T08:45:38.582Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "AMD AM4 · AMD AM5 · AMD sTR4 · AMD sTRx4 · Intel 1150 · Intel 1151 · Intel 1155 · Intel 1156 · Intel 1200 · Intel 1700 · Intel 2011 · Intel 2066 · Intel 1851"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Lumineux",
            "value": "Oui"
          },
          {
            "label": "Couleur de LED",
            "value": "Multicolore"
          },
          {
            "label": "Connecteur(s)",
            "value": "3 Pins Femelle"
          },
          {
            "label": "Roulement à billes",
            "value": "Non"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Non"
          },
          {
            "label": "Vitesse réglable",
            "value": "Non"
          },
          {
            "label": "Type de refroidissement",
            "value": "Watercooling"
          },
          {
            "label": "Top Flow",
            "value": "Non"
          },
          {
            "label": "Double tour",
            "value": "Non"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Vitesse de rotation mini",
            "value": "550 RPM"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "2100 RPM"
          },
          {
            "label": "Débit d'air mini",
            "value": "13.8 CFM"
          },
          {
            "label": "Débit d'air maxi",
            "value": "65.57 CFM"
          },
          {
            "label": "Pression",
            "value": "2.68 mm/H2O"
          },
          {
            "label": "Matériau(x)",
            "value": "Aluminium · Cuivre"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 240 mm"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Hauteur (ventilateur inclus)",
            "value": "52 mm"
          },
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "277 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "120 mm"
          },
          {
            "label": "Hauteur",
            "value": "27 mm"
          },
          {
            "label": "Poids",
            "value": "910 g"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "CW-9060068-WW",
      "radiatorLengthMm": 277,
      "radiatorWidthMm": 120,
      "radiatorThicknessMm": 27,
      "fanSizeMm": 120.0
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00545178.html",
        "productName": "Corsair iCUE H100i ELITE CAPELLIX XT (Noir)",
        "mpn": "CW-9060068-WW",
        "amount": 109.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:38.582Z"
      }
    ],
    "notes": []
  },
  "cooler-h150i360": {
    "mpn": "CW-9060070-WW",
    "identityNote": "Référence exacte : CW-9060070-WW. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00542077.html",
        "checkedAt": "2026-11-10T08:45:36.223Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "AMD AM4 · AMD AM5 · AMD sTR4 · AMD sTRx4 · Intel 1150 · Intel 1151 · Intel 1155 · Intel 1156 · Intel 1200 · Intel 1700 · Intel 2011 · Intel 2066 · Intel 1851"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Lumineux",
            "value": "Oui"
          },
          {
            "label": "Couleur de LED",
            "value": "Multicolore"
          },
          {
            "label": "Connecteur(s)",
            "value": "3 Pins Femelle"
          },
          {
            "label": "Roulement à billes",
            "value": "Non"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Non"
          },
          {
            "label": "Vitesse réglable",
            "value": "Non"
          },
          {
            "label": "Type de refroidissement",
            "value": "Watercooling"
          },
          {
            "label": "Top Flow",
            "value": "Non"
          },
          {
            "label": "Double tour",
            "value": "Non"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Vitesse de rotation mini",
            "value": "550 RPM"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "2100 RPM"
          },
          {
            "label": "Débit d'air mini",
            "value": "13.8 CFM"
          },
          {
            "label": "Débit d'air maxi",
            "value": "65.57 CFM"
          },
          {
            "label": "Pression",
            "value": "2.68 mm/H2O"
          },
          {
            "label": "Matériau(x)",
            "value": "Aluminium · Cuivre"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 360 mm"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Hauteur (ventilateur inclus)",
            "value": "52 mm"
          },
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "397 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "120 mm"
          },
          {
            "label": "Hauteur",
            "value": "27 mm"
          },
          {
            "label": "Poids",
            "value": "1100 g"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "CW-9060070-WW",
      "radiatorLengthMm": 397,
      "radiatorWidthMm": 120,
      "radiatorThicknessMm": 27,
      "fanSizeMm": 120.0
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00542077.html",
        "productName": "Corsair iCUE H150i ELITE CAPELLIX XT (Noir)",
        "mpn": "CW-9060070-WW",
        "amount": 279.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:36.223Z"
      }
    ],
    "notes": []
  },
  "cooler-ls520240": {
    "mpn": "R-LS520-BKAMNT-G-1",
    "identityNote": "Référence exacte : R-LS520-BKAMNT-G-1. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00515836.html",
        "checkedAt": "2026-11-10T08:45:35.721Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "AMD AM4 · AMD AM5 · AMD sTR4 · AMD sTRx4 · Intel 1150 · Intel 1151 · Intel 1155 · Intel 1200 · Intel 1700 · Intel 2011 · Intel 2011-v3 · Intel 2066"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Lumineux",
            "value": "Oui"
          },
          {
            "label": "Couleur de LED",
            "value": "Multicolore"
          },
          {
            "label": "Connecteur(s)",
            "value": "1 X Connecteur(s) LED RGB adressable(s) · 1 X 3 Pins Femelle · 1 X 4 Pins Femelle"
          },
          {
            "label": "Roulement à billes",
            "value": "Non"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Non"
          },
          {
            "label": "Vitesse réglable",
            "value": "Non"
          },
          {
            "label": "Type de refroidissement",
            "value": "Watercooling"
          },
          {
            "label": "Top Flow",
            "value": "Non"
          },
          {
            "label": "Double tour",
            "value": "Non"
          },
          {
            "label": "TDP Max. CPU",
            "value": "280 W"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Niveau sonore maxi",
            "value": "32.9 dB"
          },
          {
            "label": "Vitesse de rotation mini",
            "value": "500 RPM"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "2250 RPM"
          },
          {
            "label": "Débit d'air maxi",
            "value": "85.85 CFM"
          },
          {
            "label": "Matériau(x)",
            "value": "Cuivre/Aluminium"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 240 mm"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Hauteur (ventilateur inclus)",
            "value": "57 mm"
          },
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "282 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "120 mm"
          },
          {
            "label": "Hauteur",
            "value": "27 mm"
          },
          {
            "label": "Poids",
            "value": "1305 g"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "R-LS520-BKAMNT-G-1",
      "radiatorLengthMm": 282,
      "radiatorWidthMm": 120,
      "radiatorThicknessMm": 27,
      "fanSizeMm": 120.0
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00515836.html",
        "productName": "DeepCool LS520 (Noir)",
        "mpn": "R-LS520-BKAMNT-G-1",
        "amount": 169.94,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:35.721Z"
      }
    ],
    "notes": []
  },
  "cooler-ls720360": {
    "mpn": "FC-DC-LS720-BK",
    "identityNote": "Référence exacte : FC-DC-LS720-BK. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00515840.html",
        "checkedAt": "2026-11-10T08:45:37.495Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "AMD AM4 · AMD AM5 · AMD sTR4 · AMD sTRx4 · Intel 1150 · Intel 1151 · Intel 1155 · Intel 1200 · Intel 1700 · Intel 2011 · Intel 2011-v3 · Intel 2066"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Lumineux",
            "value": "Oui"
          },
          {
            "label": "Couleur de LED",
            "value": "Multicolore"
          },
          {
            "label": "Connecteur(s)",
            "value": "1 X Connecteur(s) LED RGB adressable(s) · 1 X 3 Pins Femelle · 1 X 4 Pins Femelle"
          },
          {
            "label": "Roulement à billes",
            "value": "Non"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Non"
          },
          {
            "label": "Vitesse réglable",
            "value": "Non"
          },
          {
            "label": "Type de refroidissement",
            "value": "Watercooling"
          },
          {
            "label": "Top Flow",
            "value": "Non"
          },
          {
            "label": "Double tour",
            "value": "Non"
          },
          {
            "label": "TDP Max. CPU",
            "value": "300 W"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Niveau sonore maxi",
            "value": "32.9 dB"
          },
          {
            "label": "Vitesse de rotation mini",
            "value": "500 RPM"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "2250 RPM"
          },
          {
            "label": "Débit d'air maxi",
            "value": "85.85 CFM"
          },
          {
            "label": "Matériau(x)",
            "value": "Cuivre/Aluminium"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 360 mm"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Hauteur (ventilateur inclus)",
            "value": "57 mm"
          },
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "402 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "120 mm"
          },
          {
            "label": "Hauteur",
            "value": "27 mm"
          },
          {
            "label": "Poids",
            "value": "1607 g"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "FC-DC-LS720-BK",
      "radiatorLengthMm": 402,
      "radiatorWidthMm": 120,
      "radiatorThicknessMm": 27,
      "fanSizeMm": 120.0
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00515840.html",
        "productName": "DeepCool LS720 (Noir)",
        "mpn": "FC-DC-LS720-BK",
        "amount": 199.94,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:37.495Z"
      }
    ],
    "notes": []
  },
  "case-4000d": {
    "mpn": "CC-9011200-WW",
    "identityNote": "Référence exacte : CC-9011200-WW. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00377638.html",
        "checkedAt": "2026-11-10T08:45:33.046Z",
        "kind": "retailer"
      },
      {
        "name": "Amazon.fr — MPN relevé, offre non confirmée",
        "url": "https://www.amazon.fr/-/en/CORSAIR-4000D-AIRFLOW-Mid-Tower-Tempered/dp/B08C7BGV3D",
        "checkedAt": "2026-11-10T09:33:02.918Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "360 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "170 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "180 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Moyen Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Matériau",
            "value": "Plastique · Acier · Verre Trempé"
          },
          {
            "label": "Format de carte mère",
            "value": "ATX · Micro ATX · Mini ITX · E-ATX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Couleur du boîtier",
            "value": "Noir"
          },
          {
            "label": "Couleur de la facade",
            "value": "Noir"
          },
          {
            "label": "Filtres à poussiere",
            "value": "3"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Façade Mesh",
            "value": "Oui"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Verre trempé",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "LED ARGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "7"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slot-in slim 5,25''",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slim 5,25''",
            "value": "0"
          },
          {
            "label": "Descriptif baies",
            "value": "- 2 baies 2.5\" · - 2 baies 3.5\""
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "1 X USB 3.1 Type C · 1 X USB 3.0 · 1 X Jack 3,5mm Femelle Stéréo"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Oui"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "3 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "2 X 120 mm"
          },
          {
            "label": "Descriptif ventilation",
            "value": "- 3 emplacements façade (1 ventilateur fourni) · - 2 emplacements au-dessus · - 1 emplacement arrière (1 ventilateur fourni)"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "Radiateur 120 mm"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "230 mm"
          },
          {
            "label": "Hauteur",
            "value": "466 mm"
          },
          {
            "label": "Profondeur",
            "value": "453 mm"
          },
          {
            "label": "Poids",
            "value": "7.8 kg"
          },
          {
            "label": "Volume",
            "value": "48.55 l"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "CC-9011200-WW",
      "widthMm": 230.0,
      "depthMm": 453.0,
      "heightMm": 466.0,
      "fanCount": 2,
      "sidePanel": "glass"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00377638.html",
        "productName": "Corsair 4000D AIRFLOW Tempered Glass (Noir)",
        "mpn": "CC-9011200-WW",
        "amount": 99.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:33.046Z"
      }
    ],
    "notes": [
      "Amazon.fr : référence constructeur relevée dans le tableau produit. Aucun prix intégré : variante sélectionnée, vendeur, état et livraison en France doivent être confirmés ensemble."
    ]
  },
  "case-q300l": {
    "mpn": "MCB-Q300L-KANN-S00",
    "identityNote": "Référence exacte : MCB-Q300L-KANN-S00. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00246492.html",
        "checkedAt": "2026-11-10T08:45:34.222Z",
        "kind": "retailer"
      },
      {
        "name": "Amazon.fr — MPN relevé, offre non confirmée",
        "url": "https://www.amazon.fr/Cooler-Master-MasterBox-Micro-ATX-MCB-Q300L-KANN-S00/dp/B0785GRMPG",
        "checkedAt": "2026-11-10T09:33:06.012Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "360 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "157 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "160 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Mini Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer · Bureautique"
          },
          {
            "label": "Matériau",
            "value": "Acier · ABS (Plastique)"
          },
          {
            "label": "Format de carte mère",
            "value": "Micro ATX · Mini ITX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Non"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Noir"
          },
          {
            "label": "Couleur de la facade",
            "value": "Noir"
          },
          {
            "label": "Filtres à poussiere",
            "value": "1"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "4"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces invisibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slot-in slim 5,25''",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slim 5,25''",
            "value": "0"
          },
          {
            "label": "Descriptif baies",
            "value": "1 x 3.5\" · 2 x 2.5\""
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Coté"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "Micro (Jack 3.5mm Femelle) · 2 X USB 3.0 · Casque (Jack 3.5mm Femelle)"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Oui"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "2 X 120 ou 140 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "2 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) dessus fournie",
            "value": "0"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Avant : · 2 x 120 mm ou 140 mm ou watercooling 120 / 240 mm · Dessus : · 2 x 120 mm · Arrière : · 1 x 120 mm installé ou watercooling 120 mm · Bas : · 1 x 120 mm"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 240 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 120 mm · Radiateur 240 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "Radiateur 120 mm"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "230 mm"
          },
          {
            "label": "Hauteur",
            "value": "378 mm"
          },
          {
            "label": "Profondeur",
            "value": "378 mm"
          },
          {
            "label": "Poids",
            "value": "3.7 kg"
          },
          {
            "label": "Volume",
            "value": "33.65 l"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "MCB-Q300L-KANN-S00",
      "widthMm": 230.0,
      "depthMm": 378.0,
      "heightMm": 378.0,
      "fanCount": 1
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00246492.html",
        "productName": "Cooler Master MasterBox Q300L",
        "mpn": "MCB-Q300L-KANN-S00",
        "amount": 59.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:34.222Z"
      }
    ],
    "notes": [
      "Amazon.fr : référence constructeur relevée dans le tableau produit. Aucun prix intégré : variante sélectionnée, vendeur, état et livraison en France doivent être confirmés ensemble."
    ]
  },
  "case-terra": {
    "mpn": "FD-C-TER1N-01",
    "identityNote": "Référence exacte : FD-C-TER1N-01. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00556294.html",
        "checkedAt": "2026-11-10T08:45:33.341Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "322 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "77 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "130 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "SFX-L · SFX"
          },
          {
            "label": "Format du boitier",
            "value": "Mini Tour"
          },
          {
            "label": "Utilisation",
            "value": "Media Center · Bureautique · Gamer"
          },
          {
            "label": "Matériau",
            "value": "Noyer · Aluminium · Bois"
          },
          {
            "label": "Format de carte mère",
            "value": "Mini ITX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Oui"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Graphite"
          },
          {
            "label": "Couleur de la facade",
            "value": "Noyer · Graphite"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Façade Mesh",
            "value": "Non"
          },
          {
            "label": "Fenêtre",
            "value": "Non"
          },
          {
            "label": "Verre trempé",
            "value": "Non"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "LED ARGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "2"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slot-in slim 5,25''",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slim 5,25''",
            "value": "0"
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Façade"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "1 X USB 3.0 · 1 X USB 3.2 Type C"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Non"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "0"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessous",
            "value": "1 X 120 mm"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Dessous : 1 x 120 mm"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "N/A"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "N/A"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "N/A"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "153 mm"
          },
          {
            "label": "Hauteur",
            "value": "218 mm"
          },
          {
            "label": "Profondeur",
            "value": "343 mm"
          },
          {
            "label": "Poids",
            "value": "3.1 kg"
          },
          {
            "label": "Volume",
            "value": "10.4 l"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "FD-C-TER1N-01",
      "widthMm": 153.0,
      "depthMm": 343.0,
      "heightMm": 218.0,
      "fanCount": 0
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00556294.html",
        "productName": "Fractal Design Terra (Graphite)",
        "mpn": "FD-C-TER1N-01",
        "amount": 229.94,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:33.341Z"
      }
    ],
    "notes": []
  },
  "case-4000d-white": {
    "mpn": "CC-9011201-WW",
    "identityNote": "Référence exacte : CC-9011201-WW. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00377639.html",
        "checkedAt": "2026-11-10T08:45:36.486Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "360 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "170 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "180 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Moyen Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Matériau",
            "value": "Plastique · Acier · Verre Trempé"
          },
          {
            "label": "Format de carte mère",
            "value": "ATX · Micro ATX · Mini ITX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Couleur du boîtier",
            "value": "Blanc"
          },
          {
            "label": "Couleur de la facade",
            "value": "Blanc"
          },
          {
            "label": "Filtres à poussiere",
            "value": "3"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Façade Mesh",
            "value": "Oui"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Verre trempé",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "LED ARGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "7"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slot-in slim 5,25''",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slim 5,25''",
            "value": "0"
          },
          {
            "label": "Descriptif baies",
            "value": "- 2 baies 2.5\" · - 2 baies 3.5\""
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "1 X USB 3.1 Type C · 1 X USB 3.0 · 1 X Jack 3,5mm Femelle Stéréo"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Oui"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "3 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "2 X 120 mm"
          },
          {
            "label": "Descriptif ventilation",
            "value": "- 3 emplacements façade (1 ventilateur fourni) · - 2 emplacements au-dessus · - 1 emplacement arrière (1 ventilateur fourni)"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "Radiateur 120 mm"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "230 mm"
          },
          {
            "label": "Hauteur",
            "value": "466 mm"
          },
          {
            "label": "Profondeur",
            "value": "453 mm"
          },
          {
            "label": "Poids",
            "value": "7.8 kg"
          },
          {
            "label": "Volume",
            "value": "48.55 l"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "CC-9011201-WW",
      "widthMm": 230.0,
      "depthMm": 453.0,
      "heightMm": 466.0,
      "fanCount": 2,
      "sidePanel": "glass"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00377639.html",
        "productName": "Corsair 4000D AIRFLOW Tempered Glass (Blanc)",
        "mpn": "CC-9011201-WW",
        "amount": 99.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:36.486Z"
      }
    ],
    "notes": []
  },
  "case-5000d": {
    "mpn": "CC-9011210-WW",
    "identityNote": "Référence exacte : CC-9011210-WW. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00407891.html",
        "checkedAt": "2026-11-10T08:45:39.023Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "420 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "170 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "225 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Moyen Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Matériau",
            "value": "Plastique · Acier · Verre Trempé"
          },
          {
            "label": "Format de carte mère",
            "value": "Mini ITX · Micro ATX · E-ATX · ATX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Oui"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Noir"
          },
          {
            "label": "Couleur de la facade",
            "value": "Noir"
          },
          {
            "label": "Filtres à poussiere",
            "value": "2"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Façade Mesh",
            "value": "Oui"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Verre trempé",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "LED ARGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "7"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces visibles",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "4"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces invisibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slot-in slim 5,25''",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slim 5,25''",
            "value": "0"
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Dessus"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "1 X Jack 3,5mm Femelle Stéréo · 2 X USB 3.0 · 1 X USB 3.1 Type C"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Oui"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "2 X 120 ou 140 mm · 1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "2 X 120 ou 140 mm · 1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) dessus fournie",
            "value": "0"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Avant : 3x 120mm ou 2x 140mm (1 ventilateur 120 mm fourni) · Haut : 3x 120mm ou 2x 140mm (non fournis) · Arrière : 120mm (1 ventilateur 120 mm fourni)"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "Radiateur 120 mm"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "245 mm"
          },
          {
            "label": "Hauteur",
            "value": "520 mm"
          },
          {
            "label": "Profondeur",
            "value": "520 mm"
          },
          {
            "label": "Poids",
            "value": "13.84 kg"
          },
          {
            "label": "Volume",
            "value": "66.25 l"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "CC-9011210-WW",
      "widthMm": 245.0,
      "depthMm": 520.0,
      "heightMm": 520.0,
      "fanCount": 2,
      "sidePanel": "glass"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00407891.html",
        "productName": "Corsair 5000D Airflow (Noir)",
        "mpn": "CC-9011210-WW",
        "amount": 189.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:39.023Z"
      }
    ],
    "notes": []
  },
  "case-h7": {
    "mpn": "CM-H71FB-01",
    "identityNote": "Référence exacte : CM-H71FB-01. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00500884.html",
        "checkedAt": "2026-11-10T08:45:37.707Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "400 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "185 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Moyen Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer · Bureautique"
          },
          {
            "label": "Matériau",
            "value": "Acier · Verre Trempé"
          },
          {
            "label": "Format de carte mère",
            "value": "ATX · Micro ATX · E-ATX · Mini ITX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Couleur du boîtier",
            "value": "Noir"
          },
          {
            "label": "Couleur de la facade",
            "value": "Noir"
          },
          {
            "label": "Filtres à poussiere",
            "value": "3"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Façade Mesh",
            "value": "Oui"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Verre trempé",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "LED ARGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "7"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "4"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slot-in slim 5,25''",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slim 5,25''",
            "value": "0"
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Dessus"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "1 X Casque (Jack 3.5mm Femelle) · 2 X USB 3.0 · 1 X USB 3.1 Type C"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 ou 140 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "3 X 120 ou 140 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "2 X 140 mm · 3 X 120 mm"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Façade : 3 x 120/140 mm (1 ventilateur F120Q fourni) · Dessus : 3 x 120 mm ou 2 x 140 mm · Arrière : 1 x 120/140 mm (1 ventilateur F120Q fourni)"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm · Radiateur 140 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "Radiateur 140 mm · Radiateur 120 mm"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "230 mm"
          },
          {
            "label": "Hauteur",
            "value": "505 mm"
          },
          {
            "label": "Profondeur",
            "value": "480 mm"
          },
          {
            "label": "Poids",
            "value": "10.05 kg"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "CM-H71FB-01",
      "widthMm": 230.0,
      "depthMm": 480.0,
      "heightMm": 505.0,
      "fanCount": 2,
      "sidePanel": "glass"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00500884.html",
        "productName": "NZXT H7 Flow Noir",
        "mpn": "CM-H71FB-01",
        "amount": 139.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:37.707Z"
      }
    ],
    "notes": []
  },
  "case-north": {
    "mpn": "FD-C-NOR1C-02",
    "identityNote": "Référence exacte : FD-C-NOR1C-02. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00534746.html",
        "checkedAt": "2026-11-10T08:45:35.975Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "355 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "170 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "155 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Moyen Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Matériau",
            "value": "Plastique · Acier/Aluminium · Bois"
          },
          {
            "label": "Format de carte mère",
            "value": "Mini ITX · Micro ATX · ATX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Non"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Noir"
          },
          {
            "label": "Couleur de la facade",
            "value": "Noyer · Noir"
          },
          {
            "label": "Filtres à poussiere",
            "value": "2"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Verre trempé",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "LED ARGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "7"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "4"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slot-in slim 5,25''",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slim 5,25''",
            "value": "0"
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Dessus"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "Casque (Jack 3.5mm Femelle) · Micro (Jack 3.5mm Femelle) · 2 X USB 3.0 · 1 X USB 3.1 Type C"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Oui"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "2 X 140 mm · 3 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "2 X 120 ou 140 mm"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Façade : 3 x 120 ou 2 x 140 mm (2 x Aspect 140 mm PWM inclus) · Haut : 2 x 120 / 140 mm · Arrière : 1 x 120 mm"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm · Radiateur 140 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 120 mm · Radiateur 240 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "N/A"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "215 mm"
          },
          {
            "label": "Hauteur",
            "value": "469 mm"
          },
          {
            "label": "Profondeur",
            "value": "447 mm"
          },
          {
            "label": "Poids",
            "value": "7.7 kg"
          },
          {
            "label": "Volume",
            "value": "41.9 l"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "FD-C-NOR1C-02",
      "widthMm": 215.0,
      "depthMm": 447.0,
      "heightMm": 469.0,
      "fanCount": 2
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00534746.html",
        "productName": "Fractal Design North Charcoal Black TG Dark",
        "mpn": "FD-C-NOR1C-02",
        "amount": 139.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:35.975Z"
      }
    ],
    "notes": []
  },
  "case-north-white": {
    "mpn": "FD-C-NOR1C-04",
    "identityNote": "Référence exacte : FD-C-NOR1C-04. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00534743.html",
        "checkedAt": "2026-11-10T08:45:32.684Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "355 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "170 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "155 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Moyen Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Matériau",
            "value": "Plastique · Acier/Aluminium · Bois"
          },
          {
            "label": "Format de carte mère",
            "value": "Mini ITX · Micro ATX · ATX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Non"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Blanc"
          },
          {
            "label": "Couleur de la facade",
            "value": "Chêne · Noir"
          },
          {
            "label": "Filtres à poussiere",
            "value": "2"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Façade Mesh",
            "value": "Non"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Verre trempé",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "LED ARGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "7"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "4"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slot-in slim 5,25''",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slim 5,25''",
            "value": "0"
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Dessus"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "Casque (Jack 3.5mm Femelle) · Micro (Jack 3.5mm Femelle) · 2 X USB 3.0 · 1 X USB 3.1 Type C"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Oui"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "2 X 140 mm · 3 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "2 X 120 ou 140 mm"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Façade : 3 x 120 ou 2 x 140 mm (2 x Aspect 140 mm PWM inclus) · Haut : 2 x 120 / 140 mm · Arrière : 1 x 120 mm"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm · Radiateur 140 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 120 mm · Radiateur 240 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "N/A"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "215 mm"
          },
          {
            "label": "Hauteur",
            "value": "469 mm"
          },
          {
            "label": "Profondeur",
            "value": "447 mm"
          },
          {
            "label": "Poids",
            "value": "7.7 kg"
          },
          {
            "label": "Volume",
            "value": "41.9 l"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "FD-C-NOR1C-04",
      "widthMm": 215.0,
      "depthMm": 447.0,
      "heightMm": 469.0,
      "fanCount": 2
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00534743.html",
        "productName": "Fractal Design North Chalk White TG Clear",
        "mpn": "FD-C-NOR1C-04",
        "amount": 139.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "unknown",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:32.684Z"
      }
    ],
    "notes": []
  },
  "case-o11": {
    "mpn": "O11DEX",
    "identityNote": "Référence exacte : O11DEX. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00490885.html",
        "checkedAt": "2026-11-10T08:45:34.459Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "426 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "167 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "220 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Moyen Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Matériau",
            "value": "Verre Trempé · Acier · Aluminium"
          },
          {
            "label": "Format de carte mère",
            "value": "ATX · E-ATX · Micro ATX · Mini ITX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Oui"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Noir"
          },
          {
            "label": "Couleur de la facade",
            "value": "Noir"
          },
          {
            "label": "Filtres à poussiere",
            "value": "1"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Façade Mesh",
            "value": "Non"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Oui"
          },
          {
            "label": "LED RGB",
            "value": "Oui"
          },
          {
            "label": "LED ARGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "8"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "6"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces invisibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slot-in slim 5,25''",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slim 5,25''",
            "value": "0"
          },
          {
            "label": "Descriptif baies",
            "value": "Dessous : 4 x 2.5\" ou 2 x 3.5\" (à la place des ventilateurs) · Côté : 4 x 2.5\" ou 2 x 3.5\" · Cage de disques : 3 x 2.5\" ou 2 x 3.5\" + 1 x 2.5\" · Barre de cable management : 2 x 2.5\""
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Façade"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "1 X USB 3.1 Type C · 2 X USB 3.0 · 1 X Jack 3,5mm Femelle Stéréo"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "0"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) latéral",
            "value": "2 X 140 mm · 3 X 120 mm"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "2 X 140 mm · 3 X 120 mm"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessous",
            "value": "3 X 120 mm · 2 X 140 mm"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Dessus : 3 x 120 mm ou 2 x 140 mm · Côté : 3 x 120 mm ou 2 x 140 mm · Dessous : 3 x 120 mm ou 2 x 140 mm · Arrière : 1 x 120 mm · Cage de disques : 1 x 60 mm"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "285 mm"
          },
          {
            "label": "Hauteur",
            "value": "459 mm"
          },
          {
            "label": "Profondeur",
            "value": "465 mm"
          },
          {
            "label": "Poids",
            "value": "10.1 kg"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "O11DEX",
      "widthMm": 285.0,
      "depthMm": 465.0,
      "heightMm": 459.0,
      "fanCount": 0,
      "sidePanel": "glass"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00490885.html",
        "productName": "Lian Li O11 Dynamic EVO (Noir)",
        "mpn": "O11DEX",
        "amount": 179.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:34.459Z"
      }
    ],
    "notes": []
  },
  "case-h9": {
    "mpn": "CM-H91FW-01",
    "identityNote": "Référence exacte : CM-H91FW-01. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00538031.html",
        "checkedAt": "2026-11-10T08:45:32.658Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "435 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "165 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "200 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Moyen Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Matériau",
            "value": "Acier · Verre Trempé"
          },
          {
            "label": "Format de carte mère",
            "value": "Mini ITX · Micro ATX · ATX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Non"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Blanc"
          },
          {
            "label": "Couleur de la facade",
            "value": "Blanc"
          },
          {
            "label": "Filtres à poussiere",
            "value": "2"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Façade Mesh",
            "value": "Non"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Verre trempé",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Oui"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "LED ARGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "7"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "4"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slot-in slim 5,25''",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slim 5,25''",
            "value": "0"
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Dessus"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "1 X Casque (Jack 3.5mm Femelle) · 2 X USB 3.0 · 1 X USB 3.1 Type C"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Oui"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "3 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "3"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "2 X 140 mm · 3 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) dessus fournie",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessous",
            "value": "3 X 120 mm · 2 X 140 mm"
          },
          {
            "label": "Quantité de ventilateur(s) dessous fournie",
            "value": "0"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Façade de côté : 3 x 120 mm (3 ventilateurs F120Q 1200 RPM - 25.1 dBA fournis) · Haut : 3 x 120 mm ou 2 x 140 mm · Bas : 3 x 120 mm ou 2 x 140 mm · Arrière : 1 x 120 mm (1 ventilateur F120Q 1200 RPM - 25.1 dBA fourni)"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm · Radiateur 140 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 240 mm · Radiateur 360 mm · Radiateur 120 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm · Radiateur 120 mm · Radiateur 140 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "Radiateur 120 mm"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "290 mm"
          },
          {
            "label": "Hauteur",
            "value": "495 mm"
          },
          {
            "label": "Profondeur",
            "value": "466 mm"
          },
          {
            "label": "Poids",
            "value": "12.1 kg"
          },
          {
            "label": "Volume",
            "value": "67 l"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "CM-H91FW-01",
      "widthMm": 290.0,
      "depthMm": 466.0,
      "heightMm": 495.0,
      "fanCount": 4,
      "sidePanel": "glass"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00538031.html",
        "productName": "NZXT H9 Flow Blanc",
        "mpn": "CM-H91FW-01",
        "amount": 138.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:32.658Z"
      }
    ],
    "notes": []
  },
  "case-ap201": {
    "mpn": "90DC00G3-B39000",
    "identityNote": "Référence exacte : 90DC00G3-B39000. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00551241.html",
        "checkedAt": "2026-11-10T08:45:36.638Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "338 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "170 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "180 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Mini Tour"
          },
          {
            "label": "Utilisation",
            "value": "Media Center · Bureautique · Gamer"
          },
          {
            "label": "Format de carte mère",
            "value": "Micro ATX · Mini ITX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Oui"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Blanc"
          },
          {
            "label": "Couleur de la facade",
            "value": "Blanc"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Façade Mesh",
            "value": "Oui"
          },
          {
            "label": "Fenêtre",
            "value": "Non"
          },
          {
            "label": "Verre trempé",
            "value": "Non"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "LED ARGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "4"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "3"
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Façade"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "1 X USB 3.1 Type C · 2 X USB 3.0 · Micro (Jack 3.5mm Femelle) · Casque (Jack 3.5mm Femelle)"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "2 X 140 mm · 3 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) dessus fournie",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessous",
            "value": "2 X 120 mm"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "N/A"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "Radiateur 120 mm"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "205 mm"
          },
          {
            "label": "Hauteur",
            "value": "350 mm"
          },
          {
            "label": "Profondeur",
            "value": "460 mm"
          },
          {
            "label": "Poids",
            "value": "5.8 kg"
          },
          {
            "label": "Volume",
            "value": "33 l"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "90DC00G3-B39000",
      "widthMm": 205.0,
      "depthMm": 460.0,
      "heightMm": 350.0,
      "fanCount": 1
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00551241.html",
        "productName": "ASUS Prime AP201 - Blanc",
        "mpn": "90DC00G3-B39000",
        "amount": 99.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:36.638Z"
      }
    ],
    "notes": []
  },
  "cooler-nhd15-g2": {
    "mpn": "NH-D15 G2",
    "identityNote": "Référence exacte : NH-D15 G2. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00644070.html",
        "checkedAt": "2026-11-10T08:45:43.681Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "AMD AM4 · Intel 1150 · Intel 1151 · Intel 1155 · Intel 1156 · Intel 1200 · AMD AM5 · Intel 1700 · Intel 1851"
          },
          {
            "label": "Couleur",
            "value": "Cuivre"
          },
          {
            "label": "Lumineux",
            "value": "Non"
          },
          {
            "label": "Connecteur(s)",
            "value": "4 Pins Femelle"
          },
          {
            "label": "Roulement à billes",
            "value": "Non"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Oui"
          },
          {
            "label": "Type de refroidissement",
            "value": "Ventirad (actif)"
          },
          {
            "label": "Top Flow",
            "value": "Non"
          },
          {
            "label": "Double tour",
            "value": "Oui"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "140 mm"
          },
          {
            "label": "Niveau sonore maxi",
            "value": "24.8 dB"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "1500 RPM"
          },
          {
            "label": "Débit d'air maxi",
            "value": "91.6 CFM"
          },
          {
            "label": "Pression",
            "value": "2.56 mm/H2O"
          },
          {
            "label": "Matériau(x)",
            "value": "Aluminium · ABS (Plastique) · Cuivre"
          },
          {
            "label": "Utilisation",
            "value": "Gamer · Serveur"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "N/A"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Hauteur (ventilateur inclus)",
            "value": "168 mm"
          },
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "150 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "152 mm"
          },
          {
            "label": "Largeur",
            "value": "150 mm"
          },
          {
            "label": "Profondeur",
            "value": "127 mm"
          },
          {
            "label": "Poids",
            "value": "1525 g"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "NH-D15 G2",
      "heightMm": 168.0,
      "widthMm": 150.0,
      "depthMm": 152.0,
      "fanSizeMm": 140.0
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00644070.html",
        "productName": "Noctua NH-D15 G2",
        "mpn": "NH-D15 G2",
        "amount": 179.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:43.681Z"
      }
    ],
    "notes": []
  },
  "cooler-nhd12l": {
    "mpn": "NH-D12L",
    "identityNote": "Référence exacte : NH-D12L. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00503786.html",
        "checkedAt": "2026-11-10T08:45:34.849Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "AMD AM4 · AMD AM5 · Intel 1150 · Intel 1151 · Intel 1155 · Intel 1156 · Intel 1200 · Intel 1700 · Intel 1851"
          },
          {
            "label": "Lumineux",
            "value": "Non"
          },
          {
            "label": "Connecteur(s)",
            "value": "4 Pins Femelle"
          },
          {
            "label": "Roulement à billes",
            "value": "Non"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Oui"
          },
          {
            "label": "Type de refroidissement",
            "value": "Ventirad (actif)"
          },
          {
            "label": "Top Flow",
            "value": "Non"
          },
          {
            "label": "Double tour",
            "value": "Oui"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Niveau sonore maxi",
            "value": "22.6 dB"
          },
          {
            "label": "Vitesse de rotation mini",
            "value": "450 RPM"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "2000 RPM"
          },
          {
            "label": "Débit d'air maxi",
            "value": "102.1 m³/h"
          },
          {
            "label": "Pression",
            "value": "2.34 mm/H2O"
          },
          {
            "label": "Matériau(x)",
            "value": "Aluminium · Cuivre"
          },
          {
            "label": "Utilisation",
            "value": "Gamer · Multimédia"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "N/A"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Hauteur (ventilateur inclus)",
            "value": "145 mm"
          },
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "125 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "133 mm"
          },
          {
            "label": "Poids",
            "value": "890 g"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "NH-D12L",
      "heightMm": 145.0,
      "widthMm": 125.0,
      "depthMm": 133.0,
      "fanSizeMm": 120.0
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00503786.html",
        "productName": "Noctua NH-D12L",
        "mpn": "NH-D12L",
        "amount": 124.96,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:34.849Z"
      }
    ],
    "notes": []
  },
  "cooler-l9i-17xx": {
    "mpn": "NH-L9I-17XX CH.BK",
    "identityNote": "Référence exacte : NH-L9I-17XX CH.BK. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00468770.html",
        "checkedAt": "2026-11-10T08:45:32.769Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "Intel 1700 · Intel 1851"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Lumineux",
            "value": "Non"
          },
          {
            "label": "Connecteur(s)",
            "value": "4 Pins Femelle"
          },
          {
            "label": "Roulement à billes",
            "value": "Non"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Oui"
          },
          {
            "label": "Vitesse réglable",
            "value": "Oui"
          },
          {
            "label": "Type de refroidissement",
            "value": "Ventirad (actif)"
          },
          {
            "label": "Top Flow",
            "value": "Oui"
          },
          {
            "label": "Double tour",
            "value": "Non"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "92 mm"
          },
          {
            "label": "Niveau sonore mini",
            "value": "14.8 dB"
          },
          {
            "label": "Niveau sonore maxi",
            "value": "23.6 dB"
          },
          {
            "label": "Vitesse de rotation mini",
            "value": "600 RPM"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "2500 RPM"
          },
          {
            "label": "Débit d'air mini",
            "value": "24 CFM"
          },
          {
            "label": "Débit d'air maxi",
            "value": "33.8 CFM"
          },
          {
            "label": "Matériau(x)",
            "value": "Aluminium · ABS (Plastique) · Cuivre"
          },
          {
            "label": "Utilisation",
            "value": "Multimédia · Bureautique"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "N/A"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Low profile",
            "value": "Oui"
          },
          {
            "label": "Hauteur (ventilateur inclus)",
            "value": "37 mm"
          },
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "95 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "95 mm"
          },
          {
            "label": "Hauteur",
            "value": "23 mm"
          },
          {
            "label": "Largeur",
            "value": "95 mm"
          },
          {
            "label": "Profondeur",
            "value": "95 mm"
          },
          {
            "label": "Poids",
            "value": "385 g"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "NH-L9I-17XX CH.BK",
      "heightMm": 37.0,
      "widthMm": 95.0,
      "depthMm": 95.0,
      "fanSizeMm": 92.0
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00468770.html",
        "productName": "Noctua NH-L9i-17xx chromax.black",
        "mpn": "NH-L9I-17XX CH.BK",
        "amount": 74.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:32.769Z"
      }
    ],
    "notes": []
  },
  "cooler-ak620-digital": {
    "mpn": "R-AK620-BKADMN-G",
    "identityNote": "Référence exacte : R-AK620-BKADMN-G. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00564349.html",
        "checkedAt": "2026-11-10T08:45:37.053Z",
        "kind": "retailer"
      },
      {
        "name": "DeepCool — AK620 DIGITAL",
        "url": "https://www.deepcool.com/products/cooling/cpuaircoolers/ak620-digital-performance-cpu-cooler-with-status-display-1700-am5/2023/17202.shtml",
        "checkedAt": "2026-11-10T11:06:14.354944+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "AMD AM4 · Intel 1150 · Intel 1151 · Intel 1155 · Intel 1156 · Intel 1200 · Intel 1700 · Intel 2011 · Intel 2011-v3 · Intel 2066 · AMD AM5 · Intel 1851"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Lumineux",
            "value": "Oui"
          },
          {
            "label": "Couleur de LED",
            "value": "Multicolore"
          },
          {
            "label": "Connecteur(s)",
            "value": "1 X 4 Pins Femelle · 1 X Connecteur(s) LED RGB adressable(s) · 1 X USB 2.0 interne"
          },
          {
            "label": "Roulement à billes",
            "value": "Non"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Oui"
          },
          {
            "label": "Type de refroidissement",
            "value": "Ventirad (actif)"
          },
          {
            "label": "Top Flow",
            "value": "Non"
          },
          {
            "label": "Double tour",
            "value": "Oui"
          },
          {
            "label": "TDP Max. CPU",
            "value": "260 W"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Niveau sonore maxi",
            "value": "28 dB"
          },
          {
            "label": "Vitesse de rotation mini",
            "value": "500 RPM"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "1850 RPM"
          },
          {
            "label": "Débit d'air maxi",
            "value": "68.99 CFM"
          },
          {
            "label": "Pression",
            "value": "2.19 mm/H2O"
          },
          {
            "label": "Matériau(x)",
            "value": "Cuivre · Aluminium"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "N/A"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Hauteur (ventilateur inclus)",
            "value": "162 mm"
          },
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "129 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "138 mm"
          },
          {
            "label": "Poids",
            "value": "1486 g"
          }
        ]
      },
      {
        "title": "Complément vérifié — DeepCool — AK620 DIGITAL",
        "rows": [
          {
            "label": "Dimensions L × W × H",
            "value": "129 × 138 × 162 mm"
          },
          {
            "label": "Architecture",
            "value": "Double tour · 6 caloducs Ø6 mm"
          },
          {
            "label": "Ventilateurs",
            "value": "2 ×120 ×120 ×25 mm · PWM · FDB · 500–1850 tr/min ±10 %"
          },
          {
            "label": "Écran",
            "value": "Affichage numérique état CPU"
          },
          {
            "label": "Éclairage",
            "value": "Liserés ARGB sur le capot ; ventilateurs sans ARGB"
          },
          {
            "label": "EAN",
            "value": "6933412728221"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "R-AK620-BKADMN-G",
      "heightMm": 162,
      "lengthMm": 129,
      "depthMm": 129,
      "widthMm": 138,
      "fanCount": 2,
      "fanSizeMm": 120,
      "heatpipeCount": 6,
      "fanRgb": false,
      "rgb": true
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00564349.html",
        "productName": "DeepCool AK620 DIGITAL Noir",
        "mpn": "R-AK620-BKADMN-G",
        "amount": 79.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:37.053Z"
      }
    ],
    "notes": []
  },
  "cooler-ak620-zero-dark": {
    "mpn": "R-AK620-BKNNMT-G-1",
    "identityNote": "Référence exacte : R-AK620-BKNNMT-G-1. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00530873.html",
        "checkedAt": "2026-11-10T08:45:39.755Z",
        "kind": "retailer"
      },
      {
        "name": "DeepCool — fiche fabricant exacte",
        "url": "https://www.deepcool.com/products/Cooling/cpuaircoolers/AK620-ZERO-DARK-High-Performance-CPU-Cooler-1851-1700-AM5/2024/16124.shtml",
        "checkedAt": "2026-11-10T11:03:43.931441+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "Intel 1156 · Intel 1155 · Intel 2011 · Intel 1150 · Intel 2011-v3 · Intel 1151 · AMD AM4 · Intel 2066 · Intel 1200 · Intel 1700 · AMD AM5 · Intel 1851"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Lumineux",
            "value": "Non"
          },
          {
            "label": "Connecteur(s)",
            "value": "4 Pins Femelle"
          },
          {
            "label": "Roulement à billes",
            "value": "Non"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Oui"
          },
          {
            "label": "Type de refroidissement",
            "value": "Ventirad (actif)"
          },
          {
            "label": "Top Flow",
            "value": "Non"
          },
          {
            "label": "Double tour",
            "value": "Oui"
          },
          {
            "label": "TDP Max. CPU",
            "value": "260 W"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Niveau sonore maxi",
            "value": "28 dB"
          },
          {
            "label": "Vitesse de rotation mini",
            "value": "500 RPM"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "1850 RPM"
          },
          {
            "label": "Débit d'air maxi",
            "value": "68.99 CFM"
          },
          {
            "label": "Matériau(x)",
            "value": "Aluminium · Cuivre"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "N/A"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Hauteur (ventilateur inclus)",
            "value": "160 mm"
          },
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "129 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "138 mm"
          },
          {
            "label": "Hauteur",
            "value": "160 mm"
          },
          {
            "label": "Poids",
            "value": "1456 g"
          }
        ]
      },
      {
        "title": "Complément vérifié — DeepCool — fiche fabricant exacte",
        "rows": [
          {
            "label": "Dimensions L × W × H",
            "value": "129 × 138 × 160 mm"
          },
          {
            "label": "Caloducs",
            "value": "6 × 6 mm"
          },
          {
            "label": "Ventilateurs",
            "value": "2 × 120 × 120 × 25 mm · PWM · FDB"
          },
          {
            "label": "Vitesse",
            "value": "500–1850 tr/min ±10 %"
          },
          {
            "label": "EAN",
            "value": "6933412727842"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "R-AK620-BKNNMT-G-1",
      "heightMm": 160,
      "lengthMm": 129,
      "widthMm": 138,
      "depthMm": 129,
      "fanCount": 2,
      "fanSizeMm": 120,
      "heatpipeCount": 6,
      "fanRgb": false,
      "supportedSockets": [
        "AM4",
        "AM5",
        "LGA1700"
      ],
      "coolingType": "air"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00530873.html",
        "productName": "DeepCool AK620 Zero Dark",
        "mpn": "R-AK620-BKNNMT-G-1",
        "amount": 89.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:39.755Z"
      }
    ],
    "notes": [
      "AK620 standard et ZERO DARK ont des références distinctes. Les offres d’une autre finition ne sont pas réutilisées."
    ]
  },
  "cooler-h170i-lcd-420": {
    "mpn": "CW-9060076-WW",
    "identityNote": "Référence exacte : CW-9060076-WW. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00545877.html",
        "checkedAt": "2026-11-10T08:45:37.452Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "AMD AM4 · AMD AM5 · AMD sTR4 · AMD sTRx4 · Intel 1150 · Intel 1151 · Intel 1155 · Intel 1156 · Intel 1200 · Intel 1366 · Intel 1700 · Intel 2011 · Intel 2066 · Intel 1851"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Lumineux",
            "value": "Oui"
          },
          {
            "label": "Couleur de LED",
            "value": "Multicolore"
          },
          {
            "label": "Connecteur(s)",
            "value": "3 Pins Femelle"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Type de refroidissement",
            "value": "Watercooling"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "140 mm"
          },
          {
            "label": "Niveau sonore mini",
            "value": "5 dB"
          },
          {
            "label": "Niveau sonore maxi",
            "value": "33.8 dB"
          },
          {
            "label": "Vitesse de rotation mini",
            "value": "500 RPM"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "1700 RPM"
          },
          {
            "label": "Débit d'air mini",
            "value": "19.5 CFM"
          },
          {
            "label": "Débit d'air maxi",
            "value": "89 CFM"
          },
          {
            "label": "Pression",
            "value": "2 mm/H2O"
          },
          {
            "label": "Matériau(x)",
            "value": "Aluminium · Cuivre"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 420 mm"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Hauteur (ventilateur inclus)",
            "value": "52 mm"
          },
          {
            "label": "Largeur (ventilateur inclus)",
            "value": "140 mm"
          },
          {
            "label": "Profondeur (ventilateur inclus)",
            "value": "457 mm"
          },
          {
            "label": "Hauteur",
            "value": "27 mm"
          },
          {
            "label": "Poids",
            "value": "1.45 kg"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "CW-9060076-WW",
      "radiatorLengthMm": 457,
      "radiatorWidthMm": 140,
      "radiatorThicknessMm": 27,
      "fanSizeMm": 140.0
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00545877.html",
        "productName": "Corsair iCUE H170i ELITE LCD XT (Noir)",
        "mpn": "CW-9060076-WW",
        "amount": 409.94,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:37.452Z"
      }
    ],
    "notes": []
  },
  "cooler-silentloop2-360": {
    "mpn": "BW012",
    "identityNote": "Référence exacte : BW012. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00424269.html",
        "checkedAt": "2026-11-10T08:45:37.611Z",
        "kind": "retailer"
      },
      {
        "name": "be quiet! — Silent Loop 2 360 mm BW012",
        "url": "https://www.bequiet.com/en/watercooler/2260",
        "checkedAt": "2026-11-10T11:18:58.250Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications techniques",
        "rows": [
          {
            "label": "Utilisation",
            "value": "Processeur"
          },
          {
            "label": "Support du processeur",
            "value": "AMD AM4 · AMD AM5 · Intel 1150 · Intel 1151 · Intel 1155 · Intel 1200 · Intel 1700 · Intel 2011-v3 · Intel 2066 · Intel 1851"
          },
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "Lumineux",
            "value": "Oui"
          },
          {
            "label": "Couleur de LED",
            "value": "Multicolore"
          },
          {
            "label": "Connecteur(s)",
            "value": "1 X Connecteur(s) LED RGB adressable(s) · 1 X 3 Pins Femelle · 1 X 4 Pins Femelle"
          },
          {
            "label": "Roulement à billes",
            "value": "Non"
          },
          {
            "label": "PWM",
            "value": "Oui"
          },
          {
            "label": "Heat Pipe (Caloduc)",
            "value": "Non"
          },
          {
            "label": "Vitesse réglable",
            "value": "Non"
          },
          {
            "label": "Type de refroidissement",
            "value": "Watercooling"
          },
          {
            "label": "Top Flow",
            "value": "Non"
          },
          {
            "label": "Double tour",
            "value": "Non"
          },
          {
            "label": "Diamètre ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Niveau sonore mini",
            "value": "17.7 dB"
          },
          {
            "label": "Niveau sonore maxi",
            "value": "39.8 dB"
          },
          {
            "label": "Vitesse de rotation mini",
            "value": "650 RPM"
          },
          {
            "label": "Vitesse de rotation maxi",
            "value": "2200 RPM"
          },
          {
            "label": "Débit d'air mini",
            "value": "54.4 CFM"
          },
          {
            "label": "Débit d'air maxi",
            "value": "87 CFM"
          },
          {
            "label": "Matériau(x)",
            "value": "Aluminium · Cuivre"
          },
          {
            "label": "Utilisation",
            "value": "Gamer · Multimédia"
          },
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 360 mm"
          }
        ]
      },
      {
        "title": "Dimensions",
        "rows": [
          {
            "label": "Poids",
            "value": "1326 g"
          }
        ]
      },
      {
        "title": "Complément vérifié — be quiet! — Silent Loop 2 360 mm BW012",
        "rows": [
          {
            "label": "Radiateur hors ventilateurs",
            "value": "394 × 120 × 27 mm"
          },
          {
            "label": "Radiateur avec ventilateurs",
            "value": "394 × 120 × 52 mm"
          },
          {
            "label": "Bloc pompe",
            "value": "94,5 × 80 × 54 mm"
          },
          {
            "label": "Ventilateurs",
            "value": "3 × Silent Wings 3 PWM high-speed ·120 ×120 ×25 mm"
          },
          {
            "label": "Tuyaux",
            "value": "400 mm"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BW012",
      "radiatorLengthMm": 394,
      "radiatorWidthMm": 120,
      "radiatorThicknessMm": 27,
      "heightMm": 54,
      "widthMm": 80,
      "depthMm": 94.5,
      "fanCount": 3,
      "fanSizeMm": 120,
      "fanRgb": false,
      "description": "Silent Loop 2 360 mm BW012 : radiateur de 394 × 120 × 27 mm, ou 52 mm avec les trois ventilateurs Silent Wings 3 de 25 mm. Bloc pompe de 94,5 × 80 × 54 mm et éclairage ARGB.",
      "specs": [
        "Radiateur 360 mm · 394 × 120 × 27 mm",
        "52 mm avec ventilateurs",
        "3 × Silent Wings 3 120 × 120 × 25 mm",
        "Bloc pompe 94,5 × 80 × 54 mm",
        "AM4 · AM5 · LGA1700",
        "BW012"
      ]
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00424269.html",
        "productName": "be quiet! Silent Loop 2 360mm",
        "mpn": "BW012",
        "amount": 188.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:37.611Z"
      }
    ],
    "notes": [
      "Le tableau marchand comporte des axes incohérents et une longueur de 390 mm. Les dimensions distinctes du radiateur et du bloc pompe proviennent ici de la fiche fabricant actuelle BW012 : 394 × 120 × 27 mm et 94,5 × 80 × 54 mm."
    ]
  },
  "case-pop-air-rgb": {
    "mpn": "FD-C-POR1A-07",
    "identityNote": "Référence exacte : FD-C-POR1A-07. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00698786.html",
        "checkedAt": "2026-11-10T08:45:37.737Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "405 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "170 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "170 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Moyen Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer · Bureautique"
          },
          {
            "label": "Matériau",
            "value": "Acier · Plastique · Verre Trempé"
          },
          {
            "label": "Format de carte mère",
            "value": "Mini ITX · Micro ATX · ATX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Oui"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Noir"
          },
          {
            "label": "Couleur de la facade",
            "value": "Noir"
          },
          {
            "label": "Filtres à poussiere",
            "value": "1"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Verre trempé",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Oui"
          },
          {
            "label": "LED ARGB",
            "value": "Oui"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "7"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "2"
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Dessus"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "Casque (Jack 3.5mm Femelle) · Micro (Jack 3.5mm Femelle) · 2 X USB 3.0"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Oui"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "2 X 120 ou 140 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "2 X 120 ou 140 mm"
          },
          {
            "label": "Quantité de ventilateur(s) dessus fournie",
            "value": "0"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Façade : 2 emplacements pour ventilateur 120 ou 140 mm (2 ventilateurs 120 mm Aspect 12 RGB inclus) · Dessus : 2 emplacements pour ventilateur 120 ou 140 mm · Arrière : 1 emplacement pour ventilateur 120 mm (1 ventilateur 120 mm Aspect 12 RGB inclus)"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 140 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "Radiateur 120 mm"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "215 mm"
          },
          {
            "label": "Hauteur",
            "value": "454 mm"
          },
          {
            "label": "Profondeur",
            "value": "473.5 mm"
          },
          {
            "label": "Poids",
            "value": "7.2 kg"
          },
          {
            "label": "Volume",
            "value": "46.22 l"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "FD-C-POR1A-07",
      "widthMm": 215.0,
      "depthMm": 473.5,
      "heightMm": 454.0,
      "fanCount": 3,
      "sidePanel": "glass"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00698786.html",
        "productName": "Fractal Design Pop Air RGB TG (Noir)",
        "mpn": "FD-C-POR1A-07",
        "amount": 129.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:37.737Z"
      }
    ],
    "notes": []
  },
  "case-lancool3": {
    "mpn": "G99.LAN3X.00",
    "identityNote": "Référence exacte : G99.LAN3X.00. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00516226.html",
        "checkedAt": "2026-11-10T08:45:32.938Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "435 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "187 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "220 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Moyen Tour"
          },
          {
            "label": "Utilisation",
            "value": "Serveur · Gamer"
          },
          {
            "label": "Matériau",
            "value": "Aluminium · Verre Trempé"
          },
          {
            "label": "Format de carte mère",
            "value": "ATX · E-ATX · Micro ATX · Mini ITX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Oui"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Noir"
          },
          {
            "label": "Couleur de la facade",
            "value": "Noir"
          },
          {
            "label": "Filtres à poussiere",
            "value": "1"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Verre trempé",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "LED ARGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "8"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "8"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "4"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces invisibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slot-in slim 5,25''",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slim 5,25''",
            "value": "0"
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Dessus"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "1 X USB 3.1 Type C · 2 X USB 3.0 · Jack 3,5mm Femelle Stéréo"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Oui"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 ou 140 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "3 X 120 ou 140 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "3"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "3 X 120 ou 140 mm"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessous",
            "value": "3 X 120 mm"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Façade : 3 x 120/140 mm (3 x 140 mm inclus) · Arrière : 1 x 120/140 mm (1 x 140 inclus) · Dessus : 3 x 120/140 mm · Au-dessus du cache alimentation : 3 x 120 mm"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm · Radiateur 420 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm · Radiateur 420 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm · Radiateur 420 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "N/A"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "238 mm"
          },
          {
            "label": "Hauteur",
            "value": "523 mm"
          },
          {
            "label": "Profondeur",
            "value": "526 mm"
          },
          {
            "label": "Poids",
            "value": "10.1 kg"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "G99.LAN3X.00",
      "widthMm": 238.0,
      "depthMm": 526.0,
      "heightMm": 523.0,
      "fanCount": 4,
      "sidePanel": "glass"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00516226.html",
        "productName": "Lian Li LANCOOL III Noir",
        "mpn": "G99.LAN3X.00",
        "amount": 149.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:32.938Z"
      }
    ],
    "notes": []
  },
  "case-3000d": {
    "mpn": "CC-9011251-WW",
    "identityNote": "Référence exacte : CC-9011251-WW. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00562989.html",
        "checkedAt": "2026-11-10T08:45:38.385Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "360 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "170 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "220 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Moyen Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Matériau",
            "value": "Acier · Plastique · Verre Trempé"
          },
          {
            "label": "Format de carte mère",
            "value": "Mini ITX · ATX · Micro ATX · E-ATX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Oui"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Noir"
          },
          {
            "label": "Couleur de la facade",
            "value": "Noir"
          },
          {
            "label": "Filtres à poussiere",
            "value": "3"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Façade Mesh",
            "value": "Oui"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Verre trempé",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "LED ARGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "7"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slot-in slim 5,25''",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slim 5,25''",
            "value": "0"
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Dessus"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "1 X Jack 3,5mm Femelle Stéréo · 2 X USB 3.0"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Oui"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "2 X 120 ou 140 mm · 1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "2 X 120 ou 140 mm"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Avant : 3 x 120 mm ou 2 x 140 mm (1 x AF120 ELITE) · Haut : 2 x 120 mm ou 2 x 140 mm · Arrière : 1 x 120 mm (1 x AF120 ELITE)"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 280 mm · Radiateur 360 mm · Radiateur 240 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 280 mm · Radiateur 360 mm · Radiateur 240 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 280 mm · Radiateur 240 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "Radiateur 120 mm"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "230 mm"
          },
          {
            "label": "Hauteur",
            "value": "466 mm"
          },
          {
            "label": "Profondeur",
            "value": "462 mm"
          },
          {
            "label": "Poids",
            "value": "8.6 kg"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "CC-9011251-WW",
      "widthMm": 230.0,
      "depthMm": 462.0,
      "heightMm": 466.0,
      "fanCount": 2,
      "sidePanel": "glass"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00562989.html",
        "productName": "Corsair 3000D Airflow (Noir)",
        "mpn": "CC-9011251-WW",
        "amount": 79.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "out_of_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:38.385Z"
      }
    ],
    "notes": []
  },
  "case-7000d": {
    "mpn": "CC-9011218-WW",
    "identityNote": "Référence exacte : CC-9011218-WW. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00465722.html",
        "checkedAt": "2026-11-10T08:45:37.835Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "450 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "190 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "225 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Grand Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Matériau",
            "value": "Acier · Plastique · Verre Trempé"
          },
          {
            "label": "Format de carte mère",
            "value": "Mini ITX · E-ATX · ATX · Micro ATX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Oui"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Noir"
          },
          {
            "label": "Couleur de la facade",
            "value": "Noir"
          },
          {
            "label": "Filtres à poussiere",
            "value": "4"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Façade Mesh",
            "value": "Oui"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Verre trempé",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "LED ARGB",
            "value": "Non"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "8"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "4"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "6"
          },
          {
            "label": "Descriptif baies",
            "value": "3 x 2.5\" · 6 x 3.5\""
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Dessus"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "1 X Jack 3,5mm Femelle Stéréo · 4 X USB 3.0 · 1 X USB 3.1 Type C"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Oui"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 ou 140 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "3 X 120 ou 140 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "3 X 120 ou 140 mm"
          },
          {
            "label": "Quantité de ventilateur(s) dessus fournie",
            "value": "0"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Avant : 3x 120mm ou 3x 140mm (2 ventilateurs 140 mm fournis) · Haut : 3x 120mm ou 3x 140mm (non fournis) · Arrière : 1x 120mm ou 1x 140mm (1 ventilateur 140 mm inclus) · Plateau de carte mère : 4 x 120 mm (nécessite le retrait du cache du câble)"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 280 mm · Radiateur 360 mm · Radiateur 420 mm · Radiateur 480 mm · Radiateur 240 mm · Radiateur 140 mm · Radiateur 120 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm · Radiateur 420 mm · Radiateur 480 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm · Radiateur 360 mm · Radiateur 420 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "Radiateur 120 mm · Radiateur 140 mm"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "248 mm"
          },
          {
            "label": "Hauteur",
            "value": "600 mm"
          },
          {
            "label": "Profondeur",
            "value": "550 mm"
          },
          {
            "label": "Poids",
            "value": "18.7 kg"
          },
          {
            "label": "Volume",
            "value": "81.84 l"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "CC-9011218-WW",
      "widthMm": 248.0,
      "depthMm": 550.0,
      "heightMm": 600.0,
      "fanCount": 3,
      "sidePanel": "glass"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00465722.html",
        "productName": "Corsair 7000D Airflow (Noir)",
        "mpn": "CC-9011218-WW",
        "amount": 309.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:37.835Z"
      }
    ],
    "notes": []
  },
  "case-xt-pro-ultra": {
    "mpn": "PH-XT523P1_DBK01",
    "identityNote": "Référence exacte : PH-XT523P1_DBK01. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00607378.html",
        "checkedAt": "2026-11-10T08:45:36.302Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "415 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "184 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "270 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Moyen Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer"
          },
          {
            "label": "Matériau",
            "value": "Verre Trempé · Acier · ABS (Plastique)"
          },
          {
            "label": "Format de carte mère",
            "value": "Mini ITX · Micro ATX · E-ATX · ATX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Non"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Noir"
          },
          {
            "label": "Couleur de la facade",
            "value": "Noir"
          },
          {
            "label": "Filtres à poussiere",
            "value": "1"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Façade Mesh",
            "value": "Oui"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Verre trempé",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Oui"
          },
          {
            "label": "LED ARGB",
            "value": "Oui"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "7"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "3"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "1"
          },
          {
            "label": "Descriptif baies",
            "value": "1 x 3.5\" · 3 x 2.5\" · 1 x 3.5\" ou 2 x 2.5\""
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Dessus"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "1 X USB 3.0 · 1 X Jack 3,5mm Femelle Stéréo · 1 X USB 3.1 Type C"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Oui"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 ou 140 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "1"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "3 X 120 ou 140 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "3"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "1 X 120 mm · 2 X 120 ou 140 mm"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessous",
            "value": "3 X 120 mm"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Façade : 3 x 120/140 mm (3 ventilateurs 140 mm M25 D-RGB fournis) · Arrière : 1 x 120/140 mm (1 ventilateur 140 mm M25 D-RGB fourni) · Dessus : 3 x 120 ou 2 x 140 mm · Dessous : 3 x 120 mm"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 360 mm · Radiateur 240 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 120 mm · Radiateur 240 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 120 mm · Radiateur 240 mm · Radiateur 360 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "Radiateur 120 mm"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "230 mm"
          },
          {
            "label": "Hauteur",
            "value": "500 mm"
          },
          {
            "label": "Profondeur",
            "value": "440 mm"
          },
          {
            "label": "Poids",
            "value": "8.17 kg"
          },
          {
            "label": "Volume",
            "value": "50.6 l"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "PH-XT523P1_DBK01",
      "widthMm": 230.0,
      "depthMm": 440.0,
      "heightMm": 500.0,
      "fanCount": 4,
      "sidePanel": "glass"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00607378.html",
        "productName": "Phanteks XT PRO ULTRA (Noir)",
        "mpn": "PH-XT523P1_DBK01",
        "amount": 89.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:36.302Z"
      }
    ],
    "notes": []
  },
  "case-p400a-digital": {
    "mpn": "PH-EC400ATG_DBK01",
    "identityNote": "Référence exacte : PH-EC400ATG_DBK01. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00277571.html",
        "checkedAt": "2026-11-10T08:45:36.099Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Principales caractéristiques",
        "rows": [
          {
            "label": "Longueur max. carte graphique",
            "value": "420 mm"
          },
          {
            "label": "Hauteur max. ventilateur CPU",
            "value": "160 mm"
          },
          {
            "label": "Longueur max. alimentation",
            "value": "270 mm"
          },
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Format du boitier",
            "value": "Moyen Tour"
          },
          {
            "label": "Utilisation",
            "value": "Gamer · Bureautique"
          },
          {
            "label": "Matériau",
            "value": "ABS (Plastique) · Verre Trempé · Acier"
          },
          {
            "label": "Format de carte mère",
            "value": "Mini ITX · E-ATX · Micro ATX · ATX"
          },
          {
            "label": "Alimentation Fournie",
            "value": "Non"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Système de fixation sans vis",
            "value": "Oui"
          },
          {
            "label": "Couleur du boîtier",
            "value": "Noir"
          },
          {
            "label": "Couleur de la facade",
            "value": "Noir"
          },
          {
            "label": "Filtres à poussiere",
            "value": "2"
          },
          {
            "label": "Ecran intégré",
            "value": "Non"
          },
          {
            "label": "Fenêtre",
            "value": "Oui"
          },
          {
            "label": "Aquarium (vue panoramique)",
            "value": "Non"
          },
          {
            "label": "LED RGB",
            "value": "Oui"
          },
          {
            "label": "Compatible Watercooling",
            "value": "Oui"
          },
          {
            "label": "Emplacement des connecteurs carte mère",
            "value": "Connecteurs standards (sur la carte mère)"
          }
        ]
      },
      {
        "title": "Slots d'extension",
        "rows": [
          {
            "label": "Nombre de slots PCI",
            "value": "7"
          },
          {
            "label": "Low profile",
            "value": "Non"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 3,5 pouces invisibles",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"",
            "value": "2"
          },
          {
            "label": "Nombre d'emplacements 2,5\"/3,5\"",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces visibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements 5,25 pouces invisibles",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slot-in slim 5,25''",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements Slim 5,25''",
            "value": "0"
          },
          {
            "label": "Descriptif baies",
            "value": "2x 3.5\" (+ 4x 3.5\" optionnels) · 2x 2.5\""
          }
        ]
      },
      {
        "title": "Connectique en façade",
        "rows": [
          {
            "label": "Emplacement des ports d'extension",
            "value": "Dessus"
          },
          {
            "label": "Connecteur(s) disponible(s)",
            "value": "Casque (Jack 3.5mm Femelle) · Micro (Jack 3.5mm Femelle) · 2 X USB 3.0"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Ventilateur(s) inclus",
            "value": "Oui"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) arrière",
            "value": "1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) arrière fournie",
            "value": "0"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) en facade",
            "value": "2 X 120 ou 140 mm · 1 X 120 mm"
          },
          {
            "label": "Quantité de ventilateur(s) façade fournie",
            "value": "3"
          },
          {
            "label": "Nombre d'emplacements pour ventilateur(s) dessus",
            "value": "2 X 120 ou 140 mm"
          },
          {
            "label": "Descriptif ventilation",
            "value": "Façade : 3x 120 mm ou 2x 140 mm (3x 120 mm LED RGB inclus) · Arrière : 1x 120 mm · Dessus : 2x 120/140 mm"
          }
        ]
      },
      {
        "title": "Watercooling",
        "rows": [
          {
            "label": "Compatibilité radiateur AIO",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm"
          },
          {
            "label": "Emplacement(s) AIO façade",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm"
          },
          {
            "label": "Emplacement(s) AIO dessus",
            "value": "Radiateur 120 mm · Radiateur 140 mm · Radiateur 240 mm · Radiateur 280 mm"
          },
          {
            "label": "Emplacement(s) AIO arrière",
            "value": "Radiateur 120 mm"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Largeur",
            "value": "210 mm"
          },
          {
            "label": "Hauteur",
            "value": "465 mm"
          },
          {
            "label": "Profondeur",
            "value": "470 mm"
          },
          {
            "label": "Poids",
            "value": "7 kg"
          },
          {
            "label": "Volume",
            "value": "45.9 l"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "PH-EC400ATG_DBK01",
      "widthMm": 210.0,
      "depthMm": 470.0,
      "heightMm": 465.0,
      "fanCount": 3,
      "sidePanel": "glass"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00277571.html",
        "productName": "Phanteks Eclipse P400A RGB (Noir)",
        "mpn": "PH-EC400ATG_DBK01",
        "amount": 99.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:36.099Z"
      }
    ],
    "notes": []
  },
  "import-psu-30d0c61edddd": {
    "mpn": "306-7ZP7C11-CE0",
    "identityNote": "Correspondance marchande contrôlée par modèle, capacité, kit et finition lorsqu’ils sont renseignés. Le MPN est celui de la page produit consultée.",
    "sources": [
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-msi-mpg-a1000g-pcie5-unite-d-alimentation-d-energie-1000-w-20-plus-4-pin-atx-atx-noir",
        "checkedAt": "2026-11-10T09:32:33Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Caractéristiques PcComponentes",
        "rows": [
          {
            "label": "Puissance totale",
            "value": "1000 W"
          },
          {
            "label": "Tension d'entrée AC",
            "value": "100 - 240 V"
          },
          {
            "label": "Fréquence d'entrée AC",
            "value": "50/60 Hz"
          },
          {
            "label": "Type de Correcteur de Factueur de Puissance (CFP)",
            "value": "Actif"
          },
          {
            "label": "Puissance combinée (+3,3 V)",
            "value": "120 W"
          },
          {
            "label": "Puissance combinée (+12 V)",
            "value": "1000 W"
          },
          {
            "label": "Puissance combinée (+5V)",
            "value": "120 W"
          },
          {
            "label": "Puissance combinée (-12V)",
            "value": "3,6 W"
          },
          {
            "label": "Puissance combinée (+5Vsb)",
            "value": "15 W"
          },
          {
            "label": "Courant de sortie max (+3.3V)",
            "value": "22 A"
          },
          {
            "label": "Courant de sortie max (+12V)",
            "value": "83,5 A"
          },
          {
            "label": "Courant de sortie max (+5V)",
            "value": "22 A"
          },
          {
            "label": "Courant de sortie max (-12V)",
            "value": "0,3 A"
          },
          {
            "label": "Courant de sortie max (+5Vsb)",
            "value": "3 A"
          },
          {
            "label": "Dispositifs de protection électrique",
            "value": "Sur-courant, Sur-alimentation, Surtension, Surchauffe, Court-circuit, Sous-tension"
          },
          {
            "label": "Connecteur de la carte mère",
            "value": "20+4 pin ATX"
          },
          {
            "label": "Longueur de câble d'alimentation de carte-mère",
            "value": "60 cm"
          },
          {
            "label": "Nombre de câbles d'alimentation SATA",
            "value": "12"
          },
          {
            "label": "Longueur du câble d'alimentation SATA",
            "value": "500,650,700,850 mm"
          },
          {
            "label": "Connecteur Molex de périphérique (4-broches)",
            "value": "4"
          },
          {
            "label": "Longueur du câble d'alimentation du périphérique (Molex)",
            "value": "1100,500,650,700,850 mm"
          },
          {
            "label": "Connecteur électrique EPS (4+4 broches)",
            "value": "Oui"
          },
          {
            "label": "Connecteurs d'alimentation PCI Express (6 +2 pin)",
            "value": "6"
          },
          {
            "label": "Connecteurs d'alimentation PCI Express (16 broches)",
            "value": "1"
          },
          {
            "label": "Longueur du câble d'alimentation PCI Express",
            "value": "75 cm"
          },
          {
            "label": "Connecteur de lecteur de disquette",
            "value": "Oui"
          },
          {
            "label": "Type de câblage",
            "value": "Modulaire"
          },
          {
            "label": "Certification 80 PLUS",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Utilité",
            "value": "PC/serveur"
          },
          {
            "label": "Facteur de forme de l'unité d'alimentation",
            "value": "ATX"
          },
          {
            "label": "Version ATX",
            "value": "3.0"
          },
          {
            "label": "Technologie de roulement",
            "value": "FDB"
          },
          {
            "label": "Couleur du produit",
            "value": "Noir"
          },
          {
            "label": "Type de refroidissement",
            "value": "Actif"
          },
          {
            "label": "Diamètre du ventilateur",
            "value": "13,5 cm"
          },
          {
            "label": "Nombre de ventilateurs",
            "value": "1 ventilateur(s)"
          },
          {
            "label": "Largeur",
            "value": "150 mm"
          },
          {
            "label": "Profondeur",
            "value": "150 mm"
          },
          {
            "label": "Hauteur",
            "value": "86 mm"
          },
          {
            "label": "Longueur du câble EPS",
            "value": "70 cm"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "306-7ZP7C11-CE0",
      "widthMm": 150,
      "depthMm": 150,
      "heightMm": 86,
      "fanSizeMm": 135,
      "fanCount": 1
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "Topbiz",
        "url": "https://www.pccomponentes.fr/alimentation-pc-msi-mpg-a1000g-pcie5-unite-d-alimentation-d-energie-1000-w-20-plus-4-pin-atx-atx-noir",
        "productName": "MSI MPG A1000G PCIE5 unité d'alimentation d'énergie 1000 W 20+4 pin ATX ATX Noir",
        "mpn": "306-7ZP7C11-CE0",
        "amount": 145.31,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0,
        "shippingNote": "Frais affichés : 0 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T09:32:33Z"
      }
    ],
    "notes": [
      "Contrôle automatisé par caractéristiques discriminantes sur une page produit primaire. Les caractéristiques encore absentes restent à confirmer ; ce relevé ne constitue pas une validation complète de compatibilité."
    ]
  },
  "import-psu-96f28a7f2861": {
    "mpn": "306-7ZP9B11-CE0",
    "identityNote": "Correspondance marchande contrôlée par modèle, capacité, kit et finition lorsqu’ils sont renseignés. Le MPN est celui de la page produit consultée.",
    "sources": [
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-carte-mere-msi-mag-a1000gl-pcie5",
        "checkedAt": "2026-11-10T09:57:03Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Caractéristiques PcComponentes",
        "rows": [
          {
            "label": "Puissance totale",
            "value": "1000 W"
          },
          {
            "label": "Tension d'entrée AC",
            "value": "100 - 240 V"
          },
          {
            "label": "Fréquence d'entrée AC",
            "value": "50/60 Hz"
          },
          {
            "label": "Type de Correcteur de Factueur de Puissance (CFP)",
            "value": "Actif"
          },
          {
            "label": "Nombre de rail(s) +12V",
            "value": "1"
          },
          {
            "label": "Puissance combinée (+3,3 V)",
            "value": "120 W"
          },
          {
            "label": "Puissance combinée (+12 V)",
            "value": "999,6 W"
          },
          {
            "label": "Puissance combinée (+5V)",
            "value": "120 W"
          },
          {
            "label": "Puissance combinée (-12V)",
            "value": "3,6 W"
          },
          {
            "label": "Puissance combinée (+5Vsb)",
            "value": "15 W"
          },
          {
            "label": "Courant de sortie max (+3.3V)",
            "value": "22 A"
          },
          {
            "label": "Courant de sortie max (+12V)",
            "value": "83,3 A"
          },
          {
            "label": "Courant de sortie max (+5V)",
            "value": "22 A"
          },
          {
            "label": "Courant de sortie max (-12V)",
            "value": "0,3 A"
          },
          {
            "label": "Courant de sortie max (+5Vsb)",
            "value": "3 A"
          },
          {
            "label": "Efficacité",
            "value": "90%"
          },
          {
            "label": "Dispositifs de protection électrique",
            "value": "Sur-courant, Sur-alimentation, Surtension, Surchauffe, Court-circuit, Sous-tension"
          },
          {
            "label": "Connecteur de la carte mère",
            "value": "24-pin ATX"
          },
          {
            "label": "Longueur de câble d'alimentation de carte-mère",
            "value": "60 cm"
          },
          {
            "label": "Nombre de câbles d'alimentation SATA",
            "value": "12"
          },
          {
            "label": "Longueur du câble d'alimentation SATA",
            "value": "150,500 mm"
          },
          {
            "label": "Connecteur Molex de périphérique (4-broches)",
            "value": "1"
          },
          {
            "label": "Longueur du câble d'alimentation du périphérique (Molex)",
            "value": "450,500 mm"
          },
          {
            "label": "Connecteur EPS power (8-pin)",
            "value": "Non"
          },
          {
            "label": "Connecteur électrique EPS (4+4 broches)",
            "value": "Oui"
          },
          {
            "label": "Connecteurs d'alimentation PCI Express (6 +2 pin)",
            "value": "4"
          },
          {
            "label": "Connecteurs d'alimentation PCI Express (16 broches)",
            "value": "1"
          },
          {
            "label": "Type de câblage",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Certification 80 PLUS",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Utilité",
            "value": "PC"
          },
          {
            "label": "Facteur de forme de l'unité d'alimentation",
            "value": "ATX"
          },
          {
            "label": "Version ATX",
            "value": "3.1"
          },
          {
            "label": "Technologie de roulement",
            "value": "FDB"
          },
          {
            "label": "Couleur du produit",
            "value": "Noir"
          },
          {
            "label": "Type de refroidissement",
            "value": "Actif"
          },
          {
            "label": "Diamètre du ventilateur",
            "value": "13,5 cm"
          },
          {
            "label": "Nombre de ventilateurs",
            "value": "1 ventilateur(s)"
          },
          {
            "label": "Vitesse du ventilateur",
            "value": "500 - 1800 tr/min"
          },
          {
            "label": "Éclairage",
            "value": "Non"
          },
          {
            "label": "Bouton marche/arrêt intégré",
            "value": "Oui"
          },
          {
            "label": "Largeur",
            "value": "150 mm"
          },
          {
            "label": "Profondeur",
            "value": "150 mm"
          },
          {
            "label": "Hauteur",
            "value": "86 mm"
          },
          {
            "label": "Poids",
            "value": "169 g"
          },
          {
            "label": "Conformité à la durabilité",
            "value": "Oui"
          },
          {
            "label": "Temps moyen de ventilateur avant panne (MTTF)",
            "value": "150000 h"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "306-7ZP9B11-CE0",
      "widthMm": 150,
      "depthMm": 150,
      "heightMm": 86,
      "fanSizeMm": 135,
      "fanCount": 1
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "MEGA STORE",
        "url": "https://www.pccomponentes.fr/alimentation-pc-carte-mere-msi-mag-a1000gl-pcie5",
        "productName": "Carte mère MSI Mag A1000gl PCIe5",
        "mpn": "306-7ZP9B11-CE0",
        "amount": 231.15,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0,
        "shippingNote": "Frais affichés : 0 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T09:57:03Z"
      }
    ],
    "notes": [
      "Contrôle automatisé par caractéristiques discriminantes sur une page produit primaire. Les caractéristiques encore absentes restent à confirmer ; ce relevé ne constitue pas une validation complète de compatibilité."
    ]
  },
  "psu-rm750e": {
    "mpn": "CP-9020295-EU",
    "identityNote": "Référence exacte : CP-9020295-EU. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00663403.html",
        "checkedAt": "2026-11-10T08:42:58.877Z",
        "kind": "retailer"
      },
      {
        "name": "Corsair",
        "url": "https://www.corsair.com/eu/en/p/psu/cp-9020295-eu/rme-series-rm750e-fully-modular-low-noise-atx-power-supply-eu-cp-9020295-eu",
        "checkedAt": "2026-11-10T08:43:33.200Z",
        "kind": "manufacturer"
      },
      {
        "name": "Amazon.fr — MPN relevé, offre non confirmée",
        "url": "https://www.amazon.fr/-/en/CORSAIR-RM750e-Modular-Silent-Supply/dp/B0DMTMK2Q5",
        "checkedAt": "2026-11-10T09:32:57.137Z",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Données fabricant Corsair",
        "rows": [
          {
            "label": "Révision",
            "value": "2025 · noir · câble secteur EU"
          },
          {
            "label": "Puissance",
            "value": "750 W"
          },
          {
            "label": "Normes",
            "value": "ATX 3.1 · PCIe 5.1"
          },
          {
            "label": "Certification",
            "value": "Cybenetics Gold"
          },
          {
            "label": "Câblage",
            "value": "Entièrement modulaire · câble natif 12V-2x6 600 W"
          }
        ]
      },
      {
        "title": "Dimensions constructeur",
        "rows": [
          {
            "label": "Boîtier hors câbles",
            "value": "140 × 150 × 86 mm"
          },
          {
            "label": "Ventilateur",
            "value": "120 mm"
          }
        ]
      }
    ],
    "patch": {
      "name": "RM750e (2025) · 750 W",
      "specs": [
        "750 W",
        "Cybenetics Gold",
        "ATX 3.1 · PCIe 5.1",
        "Modulaire · 12V-2x6",
        "CP-9020295-EU"
      ],
      "manufacturerPartNumber": "CP-9020295-EU",
      "widthMm": 150,
      "depthMm": 140,
      "heightMm": 86,
      "fanSizeMm": 120,
      "fanCount": 1
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00663403.html",
        "productName": "Corsair RM750e (2025)",
        "mpn": "CP-9020295-EU",
        "amount": 119.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:42:58.877Z"
      }
    ],
    "notes": [
      "Amazon.fr : référence constructeur relevée dans le tableau produit. Aucun prix intégré : variante sélectionnée, vendeur, état et livraison en France doivent être confirmés ensemble."
    ]
  },
  "case-h6": {
    "mpn": "CC-H61FB-01",
    "identityNote": "Référence exacte : CC-H61FB-01. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00579918.html",
        "checkedAt": "2026-11-10T08:42:58.673Z",
        "kind": "retailer"
      },
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/nzxt-h6-flow-mid-tower-verre-trempe-usb-c-noir",
        "checkedAt": "2026-11-10T08:47:22.020Z",
        "kind": "retailer"
      },
      {
        "name": "NZXT",
        "url": "https://support.nzxt.com/hc/en-us/articles/40183529624347-H6-Flow-2023-Specs",
        "checkedAt": "2026-11-10T08:43:31.119Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Données fabricant NZXT",
        "rows": [
          {
            "label": "Finition",
            "value": "Noir · sans RGB"
          },
          {
            "label": "Dimensions",
            "value": "435 × 287 × 415 mm · 9,4 kg"
          },
          {
            "label": "Dégagement GPU",
            "value": "365 mm"
          },
          {
            "label": "Dégagement ventirad",
            "value": "163 mm"
          },
          {
            "label": "Ventilateurs inclus",
            "value": "3 × F120Q 120 mm"
          },
          {
            "label": "Radiateurs",
            "value": "Dessus jusqu’à 360 mm · arrière jusqu’à 120 mm"
          },
          {
            "label": "Épaisseur au-dessus",
            "value": "Radiateur 30 mm · radiateur + ventilateurs environ 60 mm maximum"
          }
        ]
      }
    ],
    "patch": {
      "fanCount": 3,
      "fanSizeMm": 120,
      "manufacturerPartNumber": "CC-H61FB-01",
      "heightMm": 435,
      "widthMm": 287,
      "depthMm": 415
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00579918.html",
        "productName": "NZXT H6 Flow Noir",
        "mpn": "CC-H61FB-01",
        "amount": 119.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "out_of_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:42:58.673Z"
      },
      {
        "retailer": "PcComponentes",
        "seller": "PcComponentes",
        "url": "https://www.pccomponentes.fr/nzxt-h6-flow-mid-tower-verre-trempe-usb-c-noir",
        "productName": "NZXT H6 Flow Mid Tower Verre Trempé USB-C Noir",
        "mpn": "CC-H61FB-01",
        "amount": 98.2,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0,
        "shippingNote": "Livraison gratuite annoncée sur la page.",
        "checkedAt": "2026-11-10T08:47:22.020Z"
      }
    ],
    "notes": [
      "Le dégagement du radiateur et des ventilateurs dépend des composants de la carte mère."
    ]
  },
  "cooler-phantom": {
    "mpn": "PHANTOM SPIRIT 120 SE",
    "identityNote": "Référence exacte : PHANTOM SPIRIT 120 SE. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/ventilateur-processeur-thermalright-phantom-spirit-120-se-processeur-refroidisseur-dair-12-cm-noir-1-pieces",
        "checkedAt": "2026-11-10T08:43:31.702Z",
        "kind": "retailer"
      },
      {
        "name": "Thermalright",
        "url": "https://www.thermalright.com/product/phantom-spirit-120-se/",
        "checkedAt": "2026-11-10T08:47:19.137Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Données fabricant Thermalright",
        "rows": [
          {
            "label": "Radiateur",
            "value": "110 × 125 × 154 mm · 765 g"
          },
          {
            "label": "Caloducs",
            "value": "7 × 6 mm"
          },
          {
            "label": "Ventilateurs",
            "value": "TL-C12B V2 · 120 × 120 × 25 mm · PWM 4 broches"
          },
          {
            "label": "Vitesse maximale",
            "value": "1 500 tr/min ±10 %"
          },
          {
            "label": "Débit maximal",
            "value": "66,17 CFM"
          },
          {
            "label": "Pression maximale",
            "value": "1,53 mm H₂O"
          },
          {
            "label": "Bruit annoncé",
            "value": "25,6 dBA"
          }
        ]
      }
    ],
    "patch": {
      "heightMm": 154,
      "widthMm": 125,
      "depthMm": 110,
      "fanCount": 2,
      "fanSizeMm": 120,
      "manufacturerPartNumber": "PHANTOM SPIRIT 120 SE",
      "heatpipeCount": 7
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "Digital Universe FR",
        "url": "https://www.pccomponentes.fr/ventilateur-processeur-thermalright-phantom-spirit-120-se-processeur-refroidisseur-dair-12-cm-noir-1-pieces",
        "productName": "Thermalright Phantom Spirit 120 SE Processeur Refroidisseur d'air 12 cm Noir 1 pièce(s)",
        "mpn": "PHANTOM SPIRIT 120 SE",
        "amount": 63.33,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0,
        "shippingNote": "Livraison gratuite annoncée sur la page.",
        "checkedAt": "2026-11-10T08:43:31.702Z"
      }
    ],
    "notes": []
  },
  "cooler-lfiii240": {
    "mpn": "ACFRE00134A",
    "identityNote": "Référence exacte ACFRE00134A identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "ARCTIC — fiche du modèle exact",
        "url": "https://www.arctic.de/en/Liquid-Freezer-III-240/ACFRE00134A",
        "checkedAt": "2026-11-10T11:00:47.611395+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — ARCTIC — fiche du modèle exact",
        "rows": [
          {
            "label": "Radiateur",
            "value": "277 × 120 × 38 mm"
          },
          {
            "label": "Ventilateurs radiateur",
            "value": "2 × P12 PWM"
          },
          {
            "label": "Pompe",
            "value": "800–2800 tr/min PWM"
          },
          {
            "label": "Ventilateur VRM",
            "value": "60 mm · 400–2500 tr/min PWM"
          },
          {
            "label": "Tuyaux",
            "value": "450 mm"
          },
          {
            "label": "Sockets natifs",
            "value": "Intel LGA1851/LGA1700 · AMD AM5/AM4"
          },
          {
            "label": "Garantie",
            "value": "6 ans"
          }
        ]
      }
    ],
    "patch": {
      "supportedSockets": [
        "AM4",
        "AM5",
        "LGA1700"
      ],
      "coolingType": "aio",
      "radiatorSizeMm": 240,
      "radiatorThicknessMm": 38,
      "radiatorLengthMm": 277,
      "radiatorWidthMm": 120,
      "fanCount": 2,
      "fanSizeMm": 120,
      "fanRgb": false,
      "rgb": false,
      "detailLevel": "documented",
      "manufacturerPartNumber": "ACFRE00134A"
    },
    "offers": [],
    "notes": [
      "LGA1200/115X nécessite un kit séparé. La puissance thermique maximale n’est pas déduite du format radiateur. Les ventilateurs s’ajoutent à ses 38 mm d’épaisseur."
    ]
  },
  "cooler-lfiii280": {
    "mpn": "ACFRE00135A",
    "identityNote": "Référence exacte ACFRE00135A identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "ARCTIC — fiche du modèle exact",
        "url": "https://www.arctic.de/en/Liquid-Freezer-III-280/ACFRE00135A",
        "checkedAt": "2026-11-10T11:00:47.600729+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — ARCTIC — fiche du modèle exact",
        "rows": [
          {
            "label": "Radiateur",
            "value": "317 × 138 × 38 mm"
          },
          {
            "label": "Ventilateurs radiateur",
            "value": "2 × P14 PWM"
          },
          {
            "label": "Pompe",
            "value": "800–2800 tr/min PWM"
          },
          {
            "label": "Ventilateur VRM",
            "value": "60 mm · 400–2500 tr/min PWM"
          },
          {
            "label": "Tuyaux",
            "value": "450 mm"
          },
          {
            "label": "Sockets natifs",
            "value": "Intel LGA1851/LGA1700 · AMD AM5/AM4"
          },
          {
            "label": "Garantie",
            "value": "6 ans"
          }
        ]
      }
    ],
    "patch": {
      "supportedSockets": [
        "AM4",
        "AM5",
        "LGA1700"
      ],
      "coolingType": "aio",
      "radiatorSizeMm": 280,
      "radiatorThicknessMm": 38,
      "radiatorLengthMm": 317,
      "radiatorWidthMm": 138,
      "fanCount": 2,
      "fanSizeMm": 140,
      "fanRgb": false,
      "rgb": false,
      "detailLevel": "documented",
      "manufacturerPartNumber": "ACFRE00135A"
    },
    "offers": [],
    "notes": [
      "LGA1200/115X nécessite un kit séparé. La puissance thermique maximale n’est pas déduite du format radiateur. Les ventilateurs s’ajoutent à ses 38 mm d’épaisseur."
    ]
  },
  "cooler-lfiii360": {
    "mpn": "ACFRE00136A",
    "identityNote": "Référence exacte ACFRE00136A identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "ARCTIC — fiche du modèle exact",
        "url": "https://www.arctic.de/en/Liquid-Freezer-III-360/ACFRE00136A",
        "checkedAt": "2026-11-10T11:00:47.652527+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — ARCTIC — fiche du modèle exact",
        "rows": [
          {
            "label": "Radiateur",
            "value": "398 × 120 × 38 mm"
          },
          {
            "label": "Ventilateurs radiateur",
            "value": "3 × P12 PWM"
          },
          {
            "label": "Pompe",
            "value": "800–2800 tr/min PWM"
          },
          {
            "label": "Ventilateur VRM",
            "value": "60 mm · 400–2500 tr/min PWM"
          },
          {
            "label": "Tuyaux",
            "value": "450 mm"
          },
          {
            "label": "Sockets natifs",
            "value": "Intel LGA1851/LGA1700 · AMD AM5/AM4"
          },
          {
            "label": "Garantie",
            "value": "6 ans"
          }
        ]
      }
    ],
    "patch": {
      "supportedSockets": [
        "AM4",
        "AM5",
        "LGA1700"
      ],
      "coolingType": "aio",
      "radiatorSizeMm": 360,
      "radiatorThicknessMm": 38,
      "radiatorLengthMm": 398,
      "radiatorWidthMm": 120,
      "fanCount": 3,
      "fanSizeMm": 120,
      "fanRgb": false,
      "rgb": false,
      "detailLevel": "documented",
      "manufacturerPartNumber": "ACFRE00136A"
    },
    "offers": [],
    "notes": [
      "LGA1200/115X nécessite un kit séparé. La puissance thermique maximale n’est pas déduite du format radiateur. Les ventilateurs s’ajoutent à ses 38 mm d’épaisseur."
    ]
  },
  "cooler-lfiii420": {
    "mpn": "ACFRE00137A",
    "identityNote": "Référence exacte ACFRE00137A identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "ARCTIC — fiche du modèle exact",
        "url": "https://www.arctic.de/en/Liquid-Freezer-III-420/ACFRE00137A",
        "checkedAt": "2026-11-10T11:00:47.621775+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — ARCTIC — fiche du modèle exact",
        "rows": [
          {
            "label": "Radiateur",
            "value": "458 × 138 × 38 mm"
          },
          {
            "label": "Ventilateurs radiateur",
            "value": "3 × P14 PWM"
          },
          {
            "label": "Pompe",
            "value": "800–2800 tr/min PWM"
          },
          {
            "label": "Ventilateur VRM",
            "value": "60 mm · 400–2500 tr/min PWM"
          },
          {
            "label": "Tuyaux",
            "value": "450 mm"
          },
          {
            "label": "Sockets natifs",
            "value": "Intel LGA1851/LGA1700 · AMD AM5/AM4"
          },
          {
            "label": "Garantie",
            "value": "6 ans"
          }
        ]
      }
    ],
    "patch": {
      "supportedSockets": [
        "AM4",
        "AM5",
        "LGA1700"
      ],
      "coolingType": "aio",
      "radiatorSizeMm": 420,
      "radiatorThicknessMm": 38,
      "radiatorLengthMm": 458,
      "radiatorWidthMm": 138,
      "fanCount": 3,
      "fanSizeMm": 140,
      "fanRgb": false,
      "rgb": false,
      "detailLevel": "documented",
      "manufacturerPartNumber": "ACFRE00137A"
    },
    "offers": [],
    "notes": [
      "LGA1200/115X nécessite un kit séparé. La puissance thermique maximale n’est pas déduite du format radiateur. Les ventilateurs s’ajoutent à ses 38 mm d’épaisseur."
    ]
  },
  "cooler-lfiii360-argb-white": {
    "mpn": "ACFRE00152A",
    "identityNote": "Référence exacte ACFRE00152A identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "ARCTIC — fiche du modèle exact",
        "url": "https://www.arctic.de/en/Liquid-Freezer-III-360-A-RGB-White/ACFRE00152A",
        "checkedAt": "2026-11-10T11:00:47.769421+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — ARCTIC — fiche du modèle exact",
        "rows": [
          {
            "label": "Radiateur",
            "value": "398 × 120 × 38 mm"
          },
          {
            "label": "Ventilateurs radiateur",
            "value": "3 × P12 PWM PST A-RGB"
          },
          {
            "label": "Pompe",
            "value": "800–2800 tr/min PWM"
          },
          {
            "label": "Ventilateur VRM",
            "value": "60 mm · 400–2500 tr/min PWM"
          },
          {
            "label": "Tuyaux",
            "value": "450 mm"
          },
          {
            "label": "Sockets natifs",
            "value": "Intel LGA1851/LGA1700 · AMD AM5/AM4"
          },
          {
            "label": "Garantie",
            "value": "6 ans"
          }
        ]
      }
    ],
    "patch": {
      "supportedSockets": [
        "AM4",
        "AM5",
        "LGA1700"
      ],
      "coolingType": "aio",
      "radiatorSizeMm": 360,
      "radiatorThicknessMm": 38,
      "radiatorLengthMm": 398,
      "radiatorWidthMm": 120,
      "fanCount": 3,
      "fanSizeMm": 120,
      "fanRgb": true,
      "rgb": true,
      "detailLevel": "documented",
      "manufacturerPartNumber": "ACFRE00152A"
    },
    "offers": [],
    "notes": [
      "LGA1200/115X nécessite un kit séparé. La puissance thermique maximale n’est pas déduite du format radiateur. Les ventilateurs s’ajoutent à ses 38 mm d’épaisseur."
    ]
  },
  "cooler-kraken240": {
    "mpn": "RL-KN240-B1",
    "identityNote": "Référence exacte RL-KN240-B1 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "NZXT — Kraken 2023 Specifications",
        "url": "https://support.nzxt.com/hc/en-us/articles/47207322896923-Kraken-2023-Specs",
        "checkedAt": "2026-11-10T11:01:25.133361+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — NZXT — Kraken 2023 Specifications",
        "rows": [
          {
            "label": "Radiateur",
            "value": "275 × 123 × 30 mm"
          },
          {
            "label": "Ventilateurs fournis",
            "value": "2 × F120P · 120 × 120 × 26 mm · 500–1800 tr/min ±300"
          },
          {
            "label": "Pompe",
            "value": "Asetek 7e génération · 800–2800 ±300 tr/min"
          },
          {
            "label": "Tête de pompe",
            "value": "Diamètre 74,7 mm · hauteur 55,97 mm"
          },
          {
            "label": "Écran",
            "value": "TFT LCD 1,54 pouce · 240 × 240 pixels"
          },
          {
            "label": "Tuyaux",
            "value": "400 mm"
          },
          {
            "label": "Sockets",
            "value": "LGA1851/1700/1200/115X · AM5/AM4 ; TR4/sTRX4 avec support séparé"
          },
          {
            "label": "Garantie",
            "value": "6 ans"
          }
        ]
      }
    ],
    "patch": {
      "name": "Kraken 240 (2023)",
      "supportedSockets": [
        "AM4",
        "AM5",
        "LGA1700"
      ],
      "coolingType": "aio",
      "radiatorSizeMm": 240,
      "radiatorThicknessMm": 30,
      "radiatorLengthMm": 275,
      "radiatorWidthMm": 123,
      "fanCount": 2,
      "fanSizeMm": 120,
      "fanRgb": false,
      "pumpDisplay": "lcd",
      "heightMm": 55.97,
      "widthMm": 74.7,
      "depthMm": 74.7,
      "detailLevel": "documented",
      "description": "NZXT Kraken 240, modèle 2023 RL-KN240-B1, avec écran TFT LCD de 1,54 pouce. Radiateur 275 × 123 × 30 mm et 2 ventilateurs F120P de 120 × 120 × 26 mm. Tête de pompe : diamètre 74,7 mm et hauteur 55,97 mm. Les dimensions du radiateur et de la tête de pompe sont distinctes.",
      "specs": [
        "Radiateur 240 mm",
        "275 × 123 × 30 mm",
        "2 × F120P 120 mm · épaisseur 26 mm",
        "Pompe Ø74,7 × 55,97 mm",
        "LCD TFT 1,54 pouce · 240 × 240",
        "AM4 / AM5 / LGA1700",
        "RL-KN240-B1"
      ],
      "manufacturerPartNumber": "RL-KN240-B1"
    },
    "offers": [],
    "notes": [
      "La fiche support constructeur actualisée en mars 2026 indique une épaisseur de radiateur de 30 mm. Une ancienne approximation de 27 mm ne doit pas être réutilisée."
    ]
  },
  "cooler-kraken360": {
    "mpn": "RL-KN360-B1",
    "identityNote": "Référence exacte RL-KN360-B1 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "NZXT — Kraken 2023 Specifications",
        "url": "https://support.nzxt.com/hc/en-us/articles/47207322896923-Kraken-2023-Specs",
        "checkedAt": "2026-11-10T11:01:25.133361+00:00",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/refrigeration-liquide-nzxt-kraken-360-394mm-3-ventilateurs-ecran-lcd",
        "checkedAt": "2026-11-10T11:02:31.184949+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — NZXT — Kraken 2023 Specifications",
        "rows": [
          {
            "label": "Radiateur",
            "value": "394 × 121 × 30 mm"
          },
          {
            "label": "Ventilateurs fournis",
            "value": "3 × F120P · 120 × 120 × 26 mm · 500–1800 tr/min ±300"
          },
          {
            "label": "Pompe",
            "value": "Asetek 7e génération · 800–2800 ±300 tr/min"
          },
          {
            "label": "Tête de pompe",
            "value": "Diamètre 74,7 mm · hauteur 55,97 mm"
          },
          {
            "label": "Écran",
            "value": "TFT LCD 1,54 pouce · 240 × 240 pixels"
          },
          {
            "label": "Tuyaux",
            "value": "400 mm"
          },
          {
            "label": "Sockets",
            "value": "LGA1851/1700/1200/115X · AM5/AM4 ; TR4/sTRX4 avec support séparé"
          },
          {
            "label": "Garantie",
            "value": "6 ans"
          }
        ]
      }
    ],
    "patch": {
      "name": "Kraken 360 (2023)",
      "supportedSockets": [
        "AM4",
        "AM5",
        "LGA1700"
      ],
      "coolingType": "aio",
      "radiatorSizeMm": 360,
      "radiatorThicknessMm": 30,
      "radiatorLengthMm": 394,
      "radiatorWidthMm": 121,
      "fanCount": 3,
      "fanSizeMm": 120,
      "fanRgb": false,
      "pumpDisplay": "lcd",
      "heightMm": 55.97,
      "widthMm": 74.7,
      "depthMm": 74.7,
      "detailLevel": "documented",
      "description": "NZXT Kraken 360, modèle 2023 RL-KN360-B1, avec écran TFT LCD de 1,54 pouce. Radiateur 394 × 121 × 30 mm et 3 ventilateurs F120P de 120 × 120 × 26 mm. Tête de pompe : diamètre 74,7 mm et hauteur 55,97 mm. Les dimensions du radiateur et de la tête de pompe sont distinctes.",
      "specs": [
        "Radiateur 360 mm",
        "394 × 121 × 30 mm",
        "3 × F120P 120 mm · épaisseur 26 mm",
        "Pompe Ø74,7 × 55,97 mm",
        "LCD TFT 1,54 pouce · 240 × 240",
        "AM4 / AM5 / LGA1700",
        "RL-KN360-B1"
      ],
      "manufacturerPartNumber": "RL-KN360-B1"
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "Tecno Out",
        "url": "https://www.pccomponentes.fr/refrigeration-liquide-nzxt-kraken-360-394mm-3-ventilateurs-ecran-lcd",
        "productName": "Refrigeration Liquide NZXT Kraken 360 394mm 3 Ventilateurs Écran LCD",
        "mpn": "RL-KN360-B1",
        "amount": 236.32,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Frais affichés : 0 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T11:02:31.184949+00:00"
      }
    ],
    "notes": [
      "La fiche support constructeur actualisée en mars 2026 indique une épaisseur de radiateur de 30 mm. Une ancienne approximation de 27 mm ne doit pas être réutilisée."
    ]
  },
  "cooler-ak620": {
    "mpn": "R-AK620-BKNNMT-G",
    "identityNote": "Référence exacte R-AK620-BKNNMT-G identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "DeepCool — fiche fabricant exacte",
        "url": "https://www.deepcool.com/products/Cooling/cpuaircoolers/AK620-High-Performance-CPU-Cooler-1851-1700-AM5/2024/13067.shtml",
        "checkedAt": "2026-11-10T11:03:44.401178+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — DeepCool — fiche fabricant exacte",
        "rows": [
          {
            "label": "Dimensions L × W × H",
            "value": "129 × 138 × 160 mm"
          },
          {
            "label": "Caloducs",
            "value": "6 × 6 mm"
          },
          {
            "label": "Ventilateurs",
            "value": "2 × 120 × 120 × 25 mm · PWM · FDB"
          },
          {
            "label": "Vitesse",
            "value": "500–1850 tr/min ±10 %"
          },
          {
            "label": "EAN",
            "value": "6933412727316"
          }
        ]
      }
    ],
    "patch": {
      "heightMm": 160,
      "lengthMm": 129,
      "widthMm": 138,
      "depthMm": 129,
      "fanCount": 2,
      "fanSizeMm": 120,
      "heatpipeCount": 6,
      "fanRgb": false,
      "supportedSockets": [
        "AM4",
        "AM5",
        "LGA1700"
      ],
      "coolingType": "air",
      "manufacturerPartNumber": "R-AK620-BKNNMT-G"
    },
    "offers": [],
    "notes": [
      "AK620 standard et ZERO DARK ont des références distinctes. Les offres d’une autre finition ne sont pas réutilisées."
    ]
  },
  "case-meshify2": {
    "mpn": "FD-C-MES2A-03",
    "identityNote": "Référence exacte FD-C-MES2A-03 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "Fractal Design — fiche PDF Meshify 2",
        "url": "https://assets.fractal-design.com/files/uxzbxy2o/production/1b5e72d86317371ecfa754c2f99957b7ae3ce173.pdf",
        "checkedAt": "2026-11-10T11:02:27.463248+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — Fractal Design — fiche PDF Meshify 2",
        "rows": [
          {
            "label": "Variante",
            "value": "Black TG Light Tint · FD-C-MES2A-03 · EAN7340172702443"
          },
          {
            "label": "Dimensions L × W × H",
            "value": "542 × 240 × 474 mm"
          },
          {
            "label": "GPU — disposition ouverte",
            "value": "467 mm avec ventilateur avant ; 491 mm sans"
          },
          {
            "label": "GPU — disposition stockage",
            "value": "315 mm"
          },
          {
            "label": "Ventirad maximal",
            "value": "185 mm"
          },
          {
            "label": "Alimentation",
            "value": "ATX · 250 mm avec cage HDD"
          },
          {
            "label": "Ventilateurs inclus",
            "value": "2 × Dynamic X2 GP-14 en façade + 1 à l’arrière"
          },
          {
            "label": "Radiateurs",
            "value": "Façade jusqu’à360/280 mm · haut360/420 mm · bas240/280 mm · arrière120 mm"
          }
        ]
      }
    ],
    "patch": {
      "supportedFormFactors": [
        "ATX",
        "Micro-ATX",
        "Mini-ITX"
      ],
      "supportedPsuFormats": [
        "ATX"
      ],
      "maxGpuLengthMm": 467,
      "maxCoolerHeightMm": 185,
      "depthMm": 542,
      "widthMm": 240,
      "heightMm": 474,
      "fanCount": 3,
      "fanSizeMm": 140,
      "fanRgb": false,
      "sidePanel": "glass",
      "radiatorSupport": {
        "top": [
          360,
          420
        ],
        "front": [
          280,
          360
        ]
      },
      "detailLevel": "documented",
      "manufacturerPartNumber": "FD-C-MES2A-03",
      "description": "Meshify 2 Black TG Light Tint FD-C-MES2A-03, avec trois ventilateurs de 140 mm. Dégagement GPU de 467 mm en disposition ouverte avec ventilateur avant, 491 mm sans ce ventilateur, et 315 mm en disposition stockage. Un radiateur en façade réduit encore ce dégagement.",
      "specs": [
        "ATX · Micro-ATX · Mini-ITX",
        "240 × 474 × 542 mm",
        "GPU 467 mm avec ventilateur avant · 315 mm en mode stockage",
        "Ventirad 185 mm",
        "3 × 140 mm inclus",
        "FD-C-MES2A-03"
      ]
    },
    "offers": [],
    "notes": [
      "Le dégagement GPU de 467 mm concerne la disposition ouverte avec ventilateur avant ; il descend à315 mm avec la disposition stockage. Un radiateur en façade réduit le dégagement."
    ]
  },
  "case-air903-base": {
    "mpn": "AIR 903 BASE Black",
    "identityNote": "Référence exacte AIR 903 BASE Black identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "MONTECH — fiche AIR 903 BASE",
        "url": "https://www.montechpc.com/air-903-base",
        "checkedAt": "2026-11-10T11:03:39.841Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — MONTECH — fiche AIR 903 BASE",
        "rows": [
          {
            "label": "Variante",
            "value": "AIR 903 BASE — Black ; fabricant liste aussi White, distinct de AIR 903 MAX"
          },
          {
            "label": "Dimensions L × W × H",
            "value": "478 × 230 × 493 mm"
          },
          {
            "label": "GPU maximal",
            "value": "400 mm longueur · 190 mm largeur"
          },
          {
            "label": "Ventirad maximal",
            "value": "180 mm"
          },
          {
            "label": "Alimentation",
            "value": "ATX · 240 mm"
          },
          {
            "label": "Ventilateurs inclus",
            "value": "2 ×140 mm PWM sans ARGB en façade +1 ×140 mm à l’arrière"
          },
          {
            "label": "Cartes mères",
            "value": "E-ATX / ATX / Micro-ATX / Mini-ITX"
          },
          {
            "label": "Radiateurs haut/façade",
            "value": "120 /140 /240 /280 /360 mm"
          }
        ]
      }
    ],
    "patch": {
      "supportedFormFactors": [
        "ATX",
        "Micro-ATX",
        "Mini-ITX"
      ],
      "supportedPsuFormats": [
        "ATX"
      ],
      "maxGpuLengthMm": 400,
      "maxCoolerHeightMm": 180,
      "depthMm": 478,
      "widthMm": 230,
      "heightMm": 493,
      "fanCount": 3,
      "fanSizeMm": 140,
      "fanRgb": false,
      "radiatorSupport": {
        "top": [
          120,
          140,
          240,
          280,
          360
        ],
        "front": [
          120,
          140,
          240,
          280,
          360
        ]
      },
      "detailLevel": "documented",
      "manufacturerPartNumber": "AIR 903 BASE Black"
    },
    "offers": [],
    "notes": [
      "Le fabricant désigne la référence par modèle et couleur, sans code MPN alphanumérique séparé. Pas de prix ajouté sans fiche marchande correspondant exactement au modèle BASE noir."
    ]
  },
  "psu-pp12-650": {
    "mpn": "BN342",
    "identityNote": "Référence exacte : BN342. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00540383.html",
        "checkedAt": "2026-11-10T08:45:38.230Z",
        "kind": "retailer"
      },
      {
        "name": "Amazon.fr — MPN relevé, offre non confirmée",
        "url": "https://www.amazon.fr/quiet-dAlimentation-Certification-Alimentation-enti%C3%A8rement/dp/B0BT33WJ38",
        "checkedAt": "2026-11-10T09:32:58.279Z",
        "kind": "retailer"
      },
      {
        "name": "be quiet! — Pure Power 12 M PDF EU V1/25",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=688a5a45714%40be-quiet.net&rand=e882cda1c350d6bd6127301c8f2dfd27&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:04:12.024150+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Puissance et Rendement",
        "rows": [
          {
            "label": "Puissance",
            "value": "650 W"
          },
          {
            "label": "Certification 80 PLUS",
            "value": "Oui"
          },
          {
            "label": "Norme(s) 80 PLUS / Cybenetics",
            "value": "80 PLUS Gold"
          }
        ]
      },
      {
        "title": "Connectique",
        "rows": [
          {
            "label": "Modulaire",
            "value": "Oui"
          },
          {
            "label": "Modularité",
            "value": "100% modulaire"
          },
          {
            "label": "Connecteur(s) alimentation",
            "value": "1 X +12V (Alimentation P4) · 1 X +12V (Alimentation P8 - 2 x P4) · 5 X Alimentation Serial ATA · 1 X ATX 20 + 4 Broches · 2 X Molex (4 broches) Femelle · 2 X PCI Express 6 + 2 Broches · 1 X PCI Express 16 Broches (12V-2x6)"
          }
        ]
      },
      {
        "title": "Configurateur",
        "rows": [
          {
            "label": "Compatibilité PSU-CM",
            "value": "+12V P4 · +12V P4 et +12V P4 · +12V P8 · +12V P8 et +12V P4"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Taille de ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Silencieux(se)",
            "value": "Oui"
          },
          {
            "label": "Type d'Alimentation (PC)",
            "value": "Active"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Norme alimentation",
            "value": "ATX12V · EPS12V"
          },
          {
            "label": "ATX 3.0",
            "value": "Oui"
          },
          {
            "label": "ATX 3.1",
            "value": "Oui"
          },
          {
            "label": "Multi-GPU",
            "value": "Aucun"
          },
          {
            "label": "Utilisation type",
            "value": "Ordinateur de bureau"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "Hauteur",
            "value": "86 mm"
          },
          {
            "label": "Largeur",
            "value": "150 mm"
          },
          {
            "label": "Longueur",
            "value": "160 mm"
          },
          {
            "label": "Poids",
            "value": "1.55 kg"
          }
        ]
      },
      {
        "title": "Complément vérifié — be quiet! — Pure Power 12 M PDF EU V1/25",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "650 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 ×150 ×86 mm"
          },
          {
            "label": "Normes document V1/25",
            "value": "ATX3.1 /EPS12V2.92 · PCIe5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Modularité",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Connecteur graphique",
            "value": "1 ×12VHPWR 450 W"
          },
          {
            "label": "PCIe6+2 broches",
            "value": "2"
          },
          {
            "label": "SATA /PATA",
            "value": "5 /2"
          },
          {
            "label": "Bruit à100 %",
            "value": "19.9 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN342",
      "wattage": 650,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "fanCount": 1,
      "fanSizeMm": 120,
      "detailLevel": "documented"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00540383.html",
        "productName": "be quiet! Pure Power 12 M 650W 80PLUS Gold",
        "mpn": "BN342",
        "amount": 121.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "out_of_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:38.230Z"
      }
    ],
    "notes": [
      "Amazon.fr : référence constructeur relevée dans le tableau produit. Aucun prix intégré : variante sélectionnée, vendeur, état et livraison en France doivent être confirmés ensemble.",
      "Document constructeur V1/25 : il mentionne ATX3.1 mais appelle le câble 12VHPWR. Ce libellé est conservé au lieu de prétendre qu’il est12V-2x6. La référence régionale EU est utilisée."
    ]
  },
  "psu-pp12-850": {
    "mpn": "BN344",
    "identityNote": "Référence exacte : BN344. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00540385.html",
        "checkedAt": "2026-11-10T08:45:34.393Z",
        "kind": "retailer"
      },
      {
        "name": "be quiet! — Pure Power 12 M PDF EU V1/25",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=688a5a45714%40be-quiet.net&rand=e882cda1c350d6bd6127301c8f2dfd27&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:04:12.024150+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Puissance et Rendement",
        "rows": [
          {
            "label": "Puissance",
            "value": "850 W"
          },
          {
            "label": "Certification 80 PLUS",
            "value": "Oui"
          },
          {
            "label": "Norme(s) 80 PLUS / Cybenetics",
            "value": "80 PLUS Gold"
          }
        ]
      },
      {
        "title": "Connectique",
        "rows": [
          {
            "label": "Modulaire",
            "value": "Oui"
          },
          {
            "label": "Modularité",
            "value": "100% modulaire"
          },
          {
            "label": "Connecteur(s) alimentation",
            "value": "1 X +12V (Alimentation P8 - 2 x P4) · 1 X +12V (Alimentation P8) · 6 X Alimentation Serial ATA · 1 X ATX 20 + 4 Broches · 2 X Molex (4 broches) Femelle · 4 X PCI Express 6 + 2 Broches · 1 X PCI Express 16 Broches (12V-2x6)"
          }
        ]
      },
      {
        "title": "Configurateur",
        "rows": [
          {
            "label": "Compatibilité PSU-CM",
            "value": "+12V P4 · +12V P4 et +12V P4 · +12V P8 · +12V P8 et +12V P4 · +12V P8 et +12V P8"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Taille de ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Silencieux(se)",
            "value": "Oui"
          },
          {
            "label": "Type d'Alimentation (PC)",
            "value": "Active"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Norme alimentation",
            "value": "ATX12V · EPS12V"
          },
          {
            "label": "ATX 3.0",
            "value": "Oui"
          },
          {
            "label": "ATX 3.1",
            "value": "Oui"
          },
          {
            "label": "Multi-GPU",
            "value": "Aucun"
          },
          {
            "label": "Utilisation type",
            "value": "Ordinateur de bureau"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "Hauteur",
            "value": "86 mm"
          },
          {
            "label": "Largeur",
            "value": "150 mm"
          },
          {
            "label": "Longueur",
            "value": "160 mm"
          },
          {
            "label": "Poids",
            "value": "1.85 kg"
          }
        ]
      },
      {
        "title": "Complément vérifié — be quiet! — Pure Power 12 M PDF EU V1/25",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 ×150 ×86 mm"
          },
          {
            "label": "Normes document V1/25",
            "value": "ATX3.1 /EPS12V2.92 · PCIe5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Modularité",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Connecteur graphique",
            "value": "1 ×12VHPWR 600 W"
          },
          {
            "label": "PCIe6+2 broches",
            "value": "4"
          },
          {
            "label": "SATA /PATA",
            "value": "6 /2"
          },
          {
            "label": "Bruit à100 %",
            "value": "25.7 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN344",
      "wattage": 850,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "fanCount": 1,
      "fanSizeMm": 120,
      "detailLevel": "documented"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00540385.html",
        "productName": "be quiet! Pure Power 12 M 850W 80PLUS Gold",
        "mpn": "BN344",
        "amount": 149.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:34.393Z"
      }
    ],
    "notes": [
      "Document constructeur V1/25 : il mentionne ATX3.1 mais appelle le câble 12VHPWR. Ce libellé est conservé au lieu de prétendre qu’il est12V-2x6. La référence régionale EU est utilisée."
    ]
  },
  "psu-pp12-1000": {
    "mpn": "BN345",
    "identityNote": "Référence exacte : BN345. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00540386.html",
        "checkedAt": "2026-11-10T08:45:34.822Z",
        "kind": "retailer"
      },
      {
        "name": "be quiet! — Pure Power 12 M PDF EU V1/25",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=688a5a45714%40be-quiet.net&rand=e882cda1c350d6bd6127301c8f2dfd27&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:04:12.024150+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Puissance et Rendement",
        "rows": [
          {
            "label": "Puissance",
            "value": "1000 W"
          },
          {
            "label": "Certification 80 PLUS",
            "value": "Oui"
          },
          {
            "label": "Norme(s) 80 PLUS / Cybenetics",
            "value": "80 PLUS Gold"
          }
        ]
      },
      {
        "title": "Connectique",
        "rows": [
          {
            "label": "Modulaire",
            "value": "Oui"
          },
          {
            "label": "Modularité",
            "value": "100% modulaire"
          },
          {
            "label": "Connecteur(s) alimentation",
            "value": "1 X +12V (Alimentation P8 - 2 x P4) · 1 X +12V (Alimentation P8) · 6 X Alimentation Serial ATA · 1 X ATX 20 + 4 Broches · 2 X Molex (4 broches) Femelle · 4 X PCI Express 6 + 2 Broches · 1 X PCI Express 16 Broches (12V-2x6)"
          }
        ]
      },
      {
        "title": "Configurateur",
        "rows": [
          {
            "label": "Compatibilité PSU-CM",
            "value": "+12V P4 · +12V P4 et +12V P4 · +12V P8 · +12V P8 et +12V P4 · +12V P8 et +12V P8"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Taille de ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Silencieux(se)",
            "value": "Oui"
          },
          {
            "label": "Type d'Alimentation (PC)",
            "value": "Active"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Norme alimentation",
            "value": "ATX12V · EPS12V"
          },
          {
            "label": "ATX 3.0",
            "value": "Oui"
          },
          {
            "label": "ATX 3.1",
            "value": "Oui"
          },
          {
            "label": "Multi-GPU",
            "value": "Aucun"
          },
          {
            "label": "Utilisation type",
            "value": "Ordinateur de bureau"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "Hauteur",
            "value": "86 mm"
          },
          {
            "label": "Largeur",
            "value": "150 mm"
          },
          {
            "label": "Longueur",
            "value": "160 mm"
          },
          {
            "label": "Poids",
            "value": "1.89 kg"
          }
        ]
      },
      {
        "title": "Complément vérifié — be quiet! — Pure Power 12 M PDF EU V1/25",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "1000 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 ×150 ×86 mm"
          },
          {
            "label": "Normes document V1/25",
            "value": "ATX3.1 /EPS12V2.92 · PCIe5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Modularité",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Connecteur graphique",
            "value": "1 ×12VHPWR 600 W"
          },
          {
            "label": "PCIe6+2 broches",
            "value": "4"
          },
          {
            "label": "SATA /PATA",
            "value": "6 /2"
          },
          {
            "label": "Bruit à100 %",
            "value": "31.7 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN345",
      "wattage": 1000,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "fanCount": 1,
      "fanSizeMm": 120,
      "detailLevel": "documented"
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00540386.html",
        "productName": "be quiet! Pure Power 12 M 1000W 80PLUS Gold",
        "mpn": "BN345",
        "amount": 199.95,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "out_of_stock",
        "priceKind": "current",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:34.822Z"
      }
    ],
    "notes": [
      "Document constructeur V1/25 : il mentionne ATX3.1 mais appelle le câble 12VHPWR. Ce libellé est conservé au lieu de prétendre qu’il est12V-2x6. La référence régionale EU est utilisée."
    ]
  },
  "import-psu-9afbb4d4bfb0": {
    "mpn": "BN343",
    "identityNote": "Référence exacte BN343 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — Pure Power 12 M PDF EU V1/25",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=688a5a45714%40be-quiet.net&rand=e882cda1c350d6bd6127301c8f2dfd27&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:04:12.024150+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — Pure Power 12 M PDF EU V1/25",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 ×150 ×86 mm"
          },
          {
            "label": "Normes document V1/25",
            "value": "ATX3.1 /EPS12V2.92 · PCIe5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Modularité",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Connecteur graphique",
            "value": "1 ×12VHPWR 600 W"
          },
          {
            "label": "PCIe6+2 broches",
            "value": "2"
          },
          {
            "label": "SATA /PATA",
            "value": "5 /2"
          },
          {
            "label": "Bruit à100 %",
            "value": "24 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN343",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "fanCount": 1,
      "fanSizeMm": 120,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "Document constructeur V1/25 : il mentionne ATX3.1 mais appelle le câble 12VHPWR. Ce libellé est conservé au lieu de prétendre qu’il est12V-2x6. La référence régionale EU est utilisée."
    ]
  },
  "import-psu-bd312e104b72": {
    "mpn": "BN341",
    "identityNote": "Référence exacte BN341 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — Pure Power 12 M PDF EU V1/25",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=688a5a45714%40be-quiet.net&rand=e882cda1c350d6bd6127301c8f2dfd27&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:04:12.024150+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — Pure Power 12 M PDF EU V1/25",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "550 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 ×150 ×86 mm"
          },
          {
            "label": "Normes document V1/25",
            "value": "ATX3.1 /EPS12V2.92 · PCIe5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Modularité",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Connecteur graphique",
            "value": "1 ×12VHPWR 300 W"
          },
          {
            "label": "PCIe6+2 broches",
            "value": "2"
          },
          {
            "label": "SATA /PATA",
            "value": "5 /2"
          },
          {
            "label": "Bruit à100 %",
            "value": "17.1 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN341",
      "wattage": 550,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "fanCount": 1,
      "fanSizeMm": 120,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "Document constructeur V1/25 : il mentionne ATX3.1 mais appelle le câble 12VHPWR. Ce libellé est conservé au lieu de prétendre qu’il est12V-2x6. La référence régionale EU est utilisée."
    ]
  },
  "import-psu-2d39d86b7d23": {
    "mpn": "BN346",
    "identityNote": "Référence exacte BN346 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — Pure Power 12 M PDF EU V1/25",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=688a5a45714%40be-quiet.net&rand=e882cda1c350d6bd6127301c8f2dfd27&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:04:12.024150+00:00",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/soyez-silencieux-pure-power-12-m-1200w-80-plus-gold-modulaire",
        "checkedAt": "2026-11-10T11:02:31.904404+00:00",
        "kind": "retailer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — Pure Power 12 M PDF EU V1/25",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "1200 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 ×150 ×86 mm"
          },
          {
            "label": "Normes document V1/25",
            "value": "ATX3.1 /EPS12V2.92 · PCIe5.1"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Modularité",
            "value": "Entièrement modulaire"
          },
          {
            "label": "Ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Connecteur graphique",
            "value": "1 ×12VHPWR 600 W"
          },
          {
            "label": "PCIe6+2 broches",
            "value": "4"
          },
          {
            "label": "SATA /PATA",
            "value": "6 /2"
          },
          {
            "label": "Bruit à100 %",
            "value": "34.3 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN346",
      "wattage": 1200,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "fanCount": 1,
      "fanSizeMm": 120,
      "detailLevel": "documented"
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "Digital Universe FR",
        "url": "https://www.pccomponentes.fr/soyez-silencieux-pure-power-12-m-1200w-80-plus-gold-modulaire",
        "productName": "Soyez silencieux! Pure Power 12 M 1200W 80 Plus Gold Modulaire",
        "mpn": "BN346",
        "amount": 178.2,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Frais affichés : 0 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T11:02:31.904404+00:00"
      }
    ],
    "notes": [
      "Document constructeur V1/25 : il mentionne ATX3.1 mais appelle le câble 12VHPWR. Ce libellé est conservé au lieu de prétendre qu’il est12V-2x6. La référence régionale EU est utilisée."
    ]
  },
  "import-psu-9abaf6d5d557": {
    "mpn": "BN332",
    "identityNote": "Référence exacte BN332 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN332"
          },
          {
            "label": "Puissance continue",
            "value": "1600 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "200 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Titanium"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.0"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "31.1 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN332",
      "wattage": 1600,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 200,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-480a1806ceb5": {
    "mpn": "BN331",
    "identityNote": "Référence exacte BN331 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN331"
          },
          {
            "label": "Puissance continue",
            "value": "1300 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "200 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Titanium"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.0"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "23.2 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN331",
      "wattage": 1300,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 200,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-9b023581f47a": {
    "mpn": "BN335",
    "identityNote": "Référence exacte BN335 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN335"
          },
          {
            "label": "Puissance continue",
            "value": "1000 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "175 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Titanium"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.0"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "25.8 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN335",
      "wattage": 1000,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 175,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-06f67730da67": {
    "mpn": "BN334",
    "identityNote": "Référence exacte BN334 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN334"
          },
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "175 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Titanium"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.0"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "19.8 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN334",
      "wattage": 850,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 175,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-58e24da5975f": {
    "mpn": "BN333",
    "identityNote": "Référence exacte BN333 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN333"
          },
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "175 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Titanium"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.0"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "18.8 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN333",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 175,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-3dd3694125c0": {
    "mpn": "BN340",
    "identityNote": "Référence exacte BN340 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN340"
          },
          {
            "label": "Puissance continue",
            "value": "1500 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "180 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.0"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "36.4 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN340",
      "wattage": 1500,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 180,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 135
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-5e5316efd23e": {
    "mpn": "BN339",
    "identityNote": "Référence exacte BN339 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN339"
          },
          {
            "label": "Puissance continue",
            "value": "1200 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "180 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.0"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "32.2 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN339",
      "wattage": 1200,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 180,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 135
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "psu-straight-power12-1000": {
    "mpn": "BN338",
    "identityNote": "Référence exacte : BN338. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.",
    "sources": [
      {
        "name": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00557980.html",
        "checkedAt": "2026-11-10T08:45:38.738Z",
        "kind": "retailer"
      },
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Puissance et Rendement",
        "rows": [
          {
            "label": "Puissance",
            "value": "1000 W"
          },
          {
            "label": "Certification 80 PLUS",
            "value": "Oui"
          },
          {
            "label": "Norme(s) 80 PLUS / Cybenetics",
            "value": "80 PLUS Platinum"
          }
        ]
      },
      {
        "title": "Connectique",
        "rows": [
          {
            "label": "Modulaire",
            "value": "Oui"
          },
          {
            "label": "Modularité",
            "value": "100% modulaire"
          },
          {
            "label": "Connecteur(s) alimentation",
            "value": "1 X +12V (Alimentation P8 - 2 x P4) · 1 X +12V (Alimentation P8) · 9 X Alimentation Serial ATA · 1 X ATX 20 + 4 Broches · 2 X Molex (4 broches) Femelle · 4 X PCI Express 6 + 2 Broches · 1 X PCI Express 16 Broches (12V-2x6)"
          }
        ]
      },
      {
        "title": "Configurateur",
        "rows": [
          {
            "label": "Compatibilité PSU-CM",
            "value": "+12V P4 · +12V P4 et +12V P4 · +12V P8 · +12V P8 et +12V P4 · +12V P8 et +12V P8"
          }
        ]
      },
      {
        "title": "Refroidissement",
        "rows": [
          {
            "label": "Taille de ventilateur",
            "value": "135 mm"
          },
          {
            "label": "Silencieux(se)",
            "value": "Oui"
          },
          {
            "label": "Type d'Alimentation (PC)",
            "value": "Active"
          }
        ]
      },
      {
        "title": "Conception",
        "rows": [
          {
            "label": "Format Alimentation",
            "value": "ATX/EPS"
          },
          {
            "label": "Norme alimentation",
            "value": "EPS12V · ATX12V"
          },
          {
            "label": "ATX 3.0",
            "value": "Oui"
          },
          {
            "label": "ATX 3.1",
            "value": "Oui"
          },
          {
            "label": "Multi-GPU",
            "value": "Aucun"
          },
          {
            "label": "Utilisation type",
            "value": "Ordinateur de bureau"
          }
        ]
      },
      {
        "title": "Caractéristiques physiques",
        "rows": [
          {
            "label": "Couleur",
            "value": "Noir"
          },
          {
            "label": "LED RGB",
            "value": "Non"
          },
          {
            "label": "Hauteur",
            "value": "86 mm"
          },
          {
            "label": "Largeur",
            "value": "150 mm"
          },
          {
            "label": "Longueur",
            "value": "160 mm"
          },
          {
            "label": "Poids",
            "value": "1.85 kg"
          }
        ]
      },
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN338"
          },
          {
            "label": "Puissance continue",
            "value": "1000 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.0"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "28.9 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN338",
      "wattage": 1000,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 135
    },
    "offers": [
      {
        "retailer": "LDLC",
        "seller": "LDLC",
        "url": "https://www.ldlc.com/fiche/PB00557980.html",
        "productName": "be quiet! Straight Power 12 1000W 80PLUS Platinum",
        "mpn": "BN338",
        "amount": 232.94,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "discontinued",
        "priceKind": "last_known",
        "shipping": null,
        "shippingNote": "Frais de livraison non renseignés ; total livré à confirmer.",
        "checkedAt": "2026-11-10T08:45:38.738Z"
      }
    ],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-961fb62ca949": {
    "mpn": "BN338",
    "identityNote": "Référence exacte BN338 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN338"
          },
          {
            "label": "Puissance continue",
            "value": "1000 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.0"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "28.9 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN338",
      "wattage": 1000,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 135
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-9c3fbaabceb8": {
    "mpn": "BN337",
    "identityNote": "Référence exacte BN337 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN337"
          },
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.0"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "22.1 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN337",
      "wattage": 850,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 135
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-b384f3f52f69": {
    "mpn": "BN336",
    "identityNote": "Référence exacte BN336 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN336"
          },
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.0"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "20.8 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN336",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 135
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-74dd9ebd0a8c": {
    "mpn": "BN285",
    "identityNote": "Référence exacte BN285 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN285"
          },
          {
            "label": "Puissance continue",
            "value": "1000 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "170 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "ATX — document comparatif",
            "value": "2.51"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "32.1 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "5 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN285",
      "wattage": 1000,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 170,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 135
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-5da18e417df8": {
    "mpn": "BN284",
    "identityNote": "Référence exacte BN284 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN284"
          },
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "170 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "ATX — document comparatif",
            "value": "2.51"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "25 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "5 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN284",
      "wattage": 850,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 170,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 135
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-dd118f9544da": {
    "mpn": "BN283",
    "identityNote": "Référence exacte BN283 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN283"
          },
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "170 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "ATX — document comparatif",
            "value": "2.51"
          },
          {
            "label": "Câblage",
            "value": "Modulaire"
          },
          {
            "label": "Bruit à100 %",
            "value": "21.2 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "5 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN283",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 170,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 135
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-5d9fb3db9206": {
    "mpn": "BP005EU",
    "identityNote": "Référence exacte BP005EU identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BP005EU"
          },
          {
            "label": "Puissance continue",
            "value": "1000 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.1"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "31.6 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BP005EU",
      "wattage": 1000,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 120
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-132d2e5af39e": {
    "mpn": "BP004EU",
    "identityNote": "Référence exacte BP004EU identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BP004EU"
          },
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.1"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "25.1 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BP004EU",
      "wattage": 850,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 120
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-97e2183271fb": {
    "mpn": "BP003EU",
    "identityNote": "Référence exacte BP003EU identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BP003EU"
          },
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.1"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "22.5 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BP003EU",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 120
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-a49714a69eec": {
    "mpn": "BP002EU",
    "identityNote": "Correspondance marchande contrôlée par modèle, capacité, kit et finition lorsqu’ils sont renseignés. Le MPN est celui de la page produit consultée.",
    "sources": [
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-be-quiet-pure-power-12-650w-unite-d-alimentation-d-energie-20-plus-4-pin-atx-noir",
        "checkedAt": "2026-11-10T09:32:38Z",
        "kind": "retailer"
      },
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Caractéristiques PcComponentes",
        "rows": [
          {
            "label": "Puissance totale",
            "value": "650 W"
          },
          {
            "label": "Puissance de crête",
            "value": "720 W"
          },
          {
            "label": "Tension d'entrée AC",
            "value": "100 - 240 V"
          },
          {
            "label": "Fréquence d'entrée AC",
            "value": "50/60 Hz"
          },
          {
            "label": "Courant d'entrée maximum (@110 V)",
            "value": "10 A"
          },
          {
            "label": "Courant d'entrée maximum (@220 V)",
            "value": "5 A"
          },
          {
            "label": "Facteur de puissance",
            "value": "0,98"
          },
          {
            "label": "Type de Correcteur de Factueur de Puissance (CFP)",
            "value": "Actif"
          },
          {
            "label": "Nombre de rail(s) +12V",
            "value": "1"
          },
          {
            "label": "Puissance combinée (+3,3 V)",
            "value": "120 W"
          },
          {
            "label": "Puissance combinée (+12 V)",
            "value": "650 W"
          },
          {
            "label": "Puissance combinée (+5V)",
            "value": "120 W"
          },
          {
            "label": "Puissance combinée (-12V)",
            "value": "3,6 W"
          },
          {
            "label": "Puissance combinée (+5Vsb)",
            "value": "15 W"
          },
          {
            "label": "Courant de sortie max (+3.3V)",
            "value": "20 A"
          },
          {
            "label": "Courant de sortie max (+12 V1)",
            "value": "54,1 A"
          },
          {
            "label": "Courant de sortie max (+5V)",
            "value": "20 A"
          },
          {
            "label": "Courant de sortie max (-12V)",
            "value": "0,3 A"
          },
          {
            "label": "Courant de sortie max (+5Vsb)",
            "value": "3 A"
          },
          {
            "label": "Temps de maintien",
            "value": "16,86 ms"
          },
          {
            "label": "Efficacité",
            "value": "91%"
          },
          {
            "label": "Dispositifs de protection électrique",
            "value": "Sur-courant, Sur-alimentation, Surtension, Surchauffe, Court-circuit, Surge & inrush protection (SIP), Sous-tension"
          },
          {
            "label": "Connecteur de la carte mère",
            "value": "20+4 pin ATX"
          },
          {
            "label": "Longueur de câble d'alimentation de carte-mère",
            "value": "55 cm"
          },
          {
            "label": "Nombre de câbles d'alimentation SATA",
            "value": "5"
          },
          {
            "label": "Longueur du câble d'alimentation SATA",
            "value": "500,650,800 mm"
          },
          {
            "label": "Connecteur Molex de périphérique (4-broches)",
            "value": "1"
          },
          {
            "label": "Longueur du câble d'alimentation du périphérique (Molex)",
            "value": "800 mm"
          },
          {
            "label": "Connecteurs d'alimentation PCI Express (6 +2 pin)",
            "value": "2"
          },
          {
            "label": "Connecteurs d'alimentation PCI Express (12 broches)",
            "value": "1"
          },
          {
            "label": "Longueur du câble d'alimentation PCI Express",
            "value": "60 cm"
          },
          {
            "label": "Connecteur CPU P4 (4-pin)",
            "value": "1"
          },
          {
            "label": "Connecteur CPU power (4+4 pin)",
            "value": "Oui"
          },
          {
            "label": "longueur du câble de puissance CPU",
            "value": "60 cm"
          },
          {
            "label": "Type de câblage",
            "value": "Non-modulaire"
          },
          {
            "label": "Certification 80 PLUS",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Utilité",
            "value": "PC"
          },
          {
            "label": "Facteur de forme de l'unité d'alimentation",
            "value": "ATX"
          },
          {
            "label": "Version ATX",
            "value": "3.1"
          },
          {
            "label": "Version EPS",
            "value": "2.92"
          },
          {
            "label": "Niveau sonore",
            "value": "18,2 dB"
          },
          {
            "label": "Technologie de roulement",
            "value": "Rifle"
          },
          {
            "label": "Temps moyen entre pannes",
            "value": "100000 h"
          },
          {
            "label": "Couleur du produit",
            "value": "Noir"
          },
          {
            "label": "Type de refroidissement",
            "value": "Actif"
          },
          {
            "label": "Diamètre du ventilateur",
            "value": "12 cm"
          },
          {
            "label": "Nombre de ventilateurs",
            "value": "1 ventilateur(s)"
          },
          {
            "label": "Bouton marche/arrêt intégré",
            "value": "Oui"
          },
          {
            "label": "Température d'opération",
            "value": "0 - 40 °C"
          },
          {
            "label": "Température hors fonctionnement",
            "value": "-20 - 70 °C"
          },
          {
            "label": "Humidité relative de fonctionnement (H-H)",
            "value": "0 - 90%"
          },
          {
            "label": "Taux d'humidité relative (stockage)",
            "value": "0 - 95%"
          },
          {
            "label": "Câbles inclus",
            "value": "Secteur"
          },
          {
            "label": "Serre-câbles inclus",
            "value": "Oui"
          },
          {
            "label": "Certificats de conformité",
            "value": "CB, CE, Federal Communications Commission (FCC), RoHS, UKCA, WEEE, cTUVus"
          },
          {
            "label": "Largeur",
            "value": "86 mm"
          },
          {
            "label": "Profondeur",
            "value": "160 mm"
          },
          {
            "label": "Hauteur",
            "value": "150 mm"
          },
          {
            "label": "Poids",
            "value": "2,4 kg"
          },
          {
            "label": "Largeur du colis",
            "value": "133 mm"
          },
          {
            "label": "Profondeur du colis",
            "value": "320 mm"
          },
          {
            "label": "Hauteur du colis",
            "value": "210 mm"
          },
          {
            "label": "Poids du paquet",
            "value": "2,8 kg"
          },
          {
            "label": "Certificats de durabilité",
            "value": "ENERGY STAR, ErP, Triman"
          },
          {
            "label": "Longueur du carton d'expédition",
            "value": "42 cm"
          },
          {
            "label": "Largeur du carton d'expédition",
            "value": "34,5 cm"
          },
          {
            "label": "Hauteur du carton d'expédition",
            "value": "41,3 cm"
          },
          {
            "label": "Poids net du colis d'expédition",
            "value": "18,1 kg"
          },
          {
            "label": "Produit par casier d’expédition (interne)",
            "value": "6 pièce(s)"
          },
          {
            "label": "Période de garantie",
            "value": "10 année(s)"
          },
          {
            "label": "Vis incluses",
            "value": "Oui"
          }
        ]
      },
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BP002EU"
          },
          {
            "label": "Puissance continue",
            "value": "650 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.1"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "18.2 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BP002EU",
      "wattage": 650,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 120
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-be-quiet-pure-power-12-650w-unite-d-alimentation-d-energie-20-plus-4-pin-atx-noir",
        "productName": "be quiet! PURE POWER 12 650W unité d'alimentation d'énergie 20+4 pin ATX Noir",
        "mpn": "BP002EU",
        "amount": 102.99,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0,
        "shippingNote": "Frais affichés : 0 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T09:32:38Z"
      }
    ],
    "notes": [
      "Contrôle automatisé par caractéristiques discriminantes sur une page produit primaire. Les caractéristiques encore absentes restent à confirmer ; ce relevé ne constitue pas une validation complète de compatibilité.",
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-d796345ad16f": {
    "mpn": "BP001EU",
    "identityNote": "Référence exacte BP001EU identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BP001EU"
          },
          {
            "label": "Puissance continue",
            "value": "550 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "ATX — document comparatif",
            "value": "3.1"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "14.6 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BP001EU",
      "wattage": 550,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented",
      "fanCount": 1,
      "fanSizeMm": 120
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-a0baf34cf82c": {
    "mpn": "BN330",
    "identityNote": "Référence exacte BN330 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN330"
          },
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "ATX — document comparatif",
            "value": "2.52"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "30.7 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "5 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN330",
      "wattage": 850,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-f2d4b035de65": {
    "mpn": "BN329",
    "identityNote": "Référence exacte BN329 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN329"
          },
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "140 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "ATX — document comparatif",
            "value": "2.52"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "34.7 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "5 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN329",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-b8d752094315": {
    "mpn": "BN328",
    "identityNote": "Référence exacte BN328 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN328"
          },
          {
            "label": "Puissance continue",
            "value": "650 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "140 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "ATX — document comparatif",
            "value": "2.52"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "30.7 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "5 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN328",
      "wattage": 650,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-6a1b9dc8414f": {
    "mpn": "BN327",
    "identityNote": "Référence exacte BN327 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN327"
          },
          {
            "label": "Puissance continue",
            "value": "550 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "140 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "ATX — document comparatif",
            "value": "2.52"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "25.7 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "5 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN327",
      "wattage": 550,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-fc0da76ac10f": {
    "mpn": "BN326",
    "identityNote": "Référence exacte BN326 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN326"
          },
          {
            "label": "Puissance continue",
            "value": "450 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "140 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "ATX — document comparatif",
            "value": "2.52"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "19.2 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "5 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN326",
      "wattage": 450,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles."
    ]
  },
  "import-psu-8495538b21fe": {
    "mpn": "BN989",
    "identityNote": "Référence exacte BN989 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN989"
          },
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "160 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "ATX — document comparatif",
            "value": "2.52"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "30.7 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "5 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN989",
      "wattage": 850,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles.",
      "Le fabricant indique explicitement que System Power 10 U n’est pas disponible en Europe ; aucune offre française n’est présumée."
    ]
  },
  "import-psu-1a3c54dc7b19": {
    "mpn": "BN988",
    "identityNote": "Référence exacte BN988 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN988"
          },
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "140 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "ATX — document comparatif",
            "value": "2.52"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "34.7 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "5 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN988",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles.",
      "Le fabricant indique explicitement que System Power 10 U n’est pas disponible en Europe ; aucune offre française n’est présumée."
    ]
  },
  "import-psu-7c6d6d3bc28c": {
    "mpn": "BN987",
    "identityNote": "Référence exacte BN987 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN987"
          },
          {
            "label": "Puissance continue",
            "value": "650 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "140 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "ATX — document comparatif",
            "value": "2.52"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "30.7 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "5 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN987",
      "wattage": 650,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles.",
      "Le fabricant indique explicitement que System Power 10 U n’est pas disponible en Europe ; aucune offre française n’est présumée."
    ]
  },
  "import-psu-56f16ce57873": {
    "mpn": "BN986",
    "identityNote": "Référence exacte BN986 identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.",
    "sources": [
      {
        "name": "be quiet! — tableau comparatif constructeur",
        "url": "https://www.bequiet.com/admin/ImageServer.php?ID=4259ba33626%40be-quiet.net&rand=acfad16488aa999336b2df2079464633&lang=2&force=true&download=true&omitPreview=true",
        "checkedAt": "2026-11-10T11:06:50.574915+00:00",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Complément vérifié — be quiet! — tableau comparatif constructeur",
        "rows": [
          {
            "label": "Référence de la colonne fabricant",
            "value": "BN986"
          },
          {
            "label": "Puissance continue",
            "value": "550 W"
          },
          {
            "label": "Dimensions hors câbles",
            "value": "140 mm profondeur ×150 mm largeur ×86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "ATX — document comparatif",
            "value": "2.52"
          },
          {
            "label": "Câblage",
            "value": "Fixe"
          },
          {
            "label": "Bruit à100 %",
            "value": "25.7 dB(A)"
          },
          {
            "label": "Garantie",
            "value": "5 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "BN986",
      "wattage": 550,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented"
    },
    "offers": [],
    "notes": [
      "La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles.",
      "Le fabricant indique explicitement que System Power 10 U n’est pas disponible en Europe ; aucune offre française n’est présumée."
    ]
  },
  "cooler-ek-nucleus360": {
    "mpn": "3831109851685",
    "identityNote": "Correspondance marchande contrôlée par modèle, capacité, kit et finition lorsqu’ils sont renseignés. Le MPN est celui de la page produit consultée.",
    "sources": [
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/refrigeration-liquide-ekwb-ek-nucleus-aio-cr360-lux-d-rgb-360mm-3-ventilateurs-rgb",
        "checkedAt": "2026-11-10T09:26:00Z",
        "kind": "retailer"
      },
      {
        "name": "EK — Nucleus AIO CR360 Lux D-RGB",
        "url": "https://www.ekwb.com/shop/ek-nucleus-aio-cr360-lux-d-rgb",
        "checkedAt": "2026-11-10T11:19:49.269Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Caractéristiques PcComponentes",
        "rows": [
          {
            "label": "Q1",
            "value": "Ce système est-il compatible avec tous les processeurs récents ?"
          },
          {
            "label": "Q2",
            "value": "Comment personnaliser l'éclairage RGB ?"
          },
          {
            "label": "Q3",
            "value": "Le système est-il facile à installer ?"
          },
          {
            "label": "Q4",
            "value": "Quelle est la durée de vie estimée de ce refroidisseur ?"
          }
        ]
      },
      {
        "title": "Complément vérifié — EK — Nucleus AIO CR360 Lux D-RGB",
        "rows": [
          {
            "label": "Radiateur hors ventilateurs",
            "value": "400 ×124 ×27 mm"
          },
          {
            "label": "Pompe",
            "value": "82,3 ×69,2 ×61,6 mm ·3100 tr/min ±10 %"
          },
          {
            "label": "Ventilateurs fournis",
            "value": "3 ×EK-FPT 120 D-RGB ·120 ×120 ×25 mm"
          },
          {
            "label": "Tuyaux",
            "value": "400 mm"
          },
          {
            "label": "Garantie",
            "value": "5 ans"
          }
        ]
      }
    ],
    "patch": {
      "manufacturerPartNumber": "3831109851685",
      "radiatorLengthMm": 400,
      "radiatorWidthMm": 124,
      "radiatorThicknessMm": 27,
      "heightMm": 61.6,
      "widthMm": 69.2,
      "depthMm": 82.3,
      "fanCount": 3,
      "fanSizeMm": 120,
      "fanRgb": true,
      "rgb": true,
      "description": "EK-Nucleus AIO CR360 Lux D-RGB, EAN 3831109851685 : radiateur de 400 × 124 × 27 mm, trois ventilateurs FPT 120 D-RGB de 120 × 120 × 25 mm, bloc pompe de 82,3 × 69,2 × 61,6 mm. La version Lux D-RGB est distincte des versions Dark, Vision et Direct Die.",
      "specs": [
        "Radiateur 360 mm · 400 × 124 × 27 mm",
        "3 × FPT 120 D-RGB · 120 × 120 × 25 mm",
        "Pompe 82,3 × 69,2 × 61,6 mm",
        "AM4 · AM5 · LGA1700",
        "Garantie 5 ans",
        "3831109851685"
      ]
    },
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "Digital Universe FR",
        "url": "https://www.pccomponentes.fr/refrigeration-liquide-ekwb-ek-nucleus-aio-cr360-lux-d-rgb-360mm-3-ventilateurs-rgb",
        "productName": "Refrigeration Liquide EKWB EK Nucleus AIO CR360 Lux D-RGB 360mm 3 Ventilateurs RGB",
        "mpn": "3831109851685",
        "amount": 248.05,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0,
        "shippingNote": "Frais affichés : 0 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T09:26:00Z"
      }
    ],
    "notes": [
      "Contrôle automatisé par caractéristiques discriminantes sur une page produit primaire. Les caractéristiques encore absentes restent à confirmer ; ce relevé ne constitue pas une validation complète de compatibilité.",
      "Dimensions issues de la fiche fabricant portant l’EAN 3831109851685. Aucun prix fabricant ajouté : ce modèle est indiqué hors stock et aucune offre française neuve disponible n’est supposée."
    ]
  },
  "import-psu-24420a88b286": {
    "mpn": "DP-GD-DQ750-M-V2L",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire DeepCool — fiche du modèle exact. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "DeepCool — fiche du modèle exact",
        "url": "https://global.deepcool.com/products/PowerSupplyUnits/powersupplyunits/DQ750-M-V2L-80-Plus-Gold-Power-Supply/2021/33.shtml",
        "checkedAt": "2026-11-10T11:23:02.254170+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "DP-GD-DQ750-M-V2L",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented",
      "fanSizeMm": 120,
      "fanCount": 1
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle",
            "value": "DQ750-M-V2L"
          },
          {
            "label": "P/N",
            "value": "DP-GD-DQ750-M-V2L"
          },
          {
            "label": "EAN",
            "value": "6933412798927"
          },
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Dimensions W × L × H",
            "value": "150 × 160 × 86 mm"
          },
          {
            "label": "Norme",
            "value": "ATX12V 2.31"
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
            "label": "Ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Protections",
            "value": "OVP / UVP / OCP / SCP / OPP / OTP"
          },
          {
            "label": "Température de fonctionnement",
            "value": "0–40 °C"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "V2L et V3L ont des références et profondeurs distinctes. La version blanche WH reste séparée de la version noire. Pour les V3L, le P/N européen est celui de la table fabricant."
    ]
  },
  "import-psu-37be52160373": {
    "mpn": "DP-GD-DQ650-M-V2L",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire DeepCool — fiche du modèle exact. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "DeepCool — fiche du modèle exact",
        "url": "https://global.deepcool.com/products/PowerSupplyUnits/powersupplyunits/DQ650-M-V2L-80-Plus-Gold-Power-Supply/2021/197.shtml",
        "checkedAt": "2026-11-10T11:24:26.321530+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "DP-GD-DQ650-M-V2L",
      "wattage": 650,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented",
      "fanSizeMm": 120,
      "fanCount": 1
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle",
            "value": "DQ650-M-V2L"
          },
          {
            "label": "P/N",
            "value": "DP-GD-DQ650-M-V2L"
          },
          {
            "label": "EAN",
            "value": "6933412798910"
          },
          {
            "label": "Puissance continue",
            "value": "650 W"
          },
          {
            "label": "Dimensions W × L × H",
            "value": "150 × 160 × 86 mm"
          },
          {
            "label": "Norme",
            "value": "ATX12V 2.31"
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
            "label": "Ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Protections",
            "value": "OVP / UVP / OCP / SCP / OPP / OTP"
          },
          {
            "label": "Température de fonctionnement",
            "value": "0–40 °C"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "V2L et V3L ont des références et profondeurs distinctes. La version blanche WH reste séparée de la version noire. Pour les V3L, le P/N européen est celui de la table fabricant."
    ]
  },
  "import-psu-0ca3daa93590": {
    "mpn": "DP-DQ750-M-V2L WH",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire DeepCool — fiche du modèle exact. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "DeepCool — fiche du modèle exact",
        "url": "https://www.deepcool.com/products/PowerSupplyUnits/powersupplyunits/2021/11377.shtml",
        "checkedAt": "2026-11-10T11:24:30.551907+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "DP-DQ750-M-V2L WH",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 160,
      "detailLevel": "documented",
      "fanSizeMm": 120,
      "fanCount": 1
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle",
            "value": "DQ750-M-V2L WH"
          },
          {
            "label": "P/N",
            "value": "DP-DQ750-M-V2L WH"
          },
          {
            "label": "EAN",
            "value": "6933412798941"
          },
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Dimensions W × L × H",
            "value": "150 × 160 × 86 mm"
          },
          {
            "label": "Norme",
            "value": "ATX12V 2.4"
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
            "label": "Ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Protections",
            "value": "OVP / UVP / OCP / SCP / OPP / OTP"
          },
          {
            "label": "Température de fonctionnement",
            "value": "0–40 °C"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "V2L et V3L ont des références et profondeurs distinctes. La version blanche WH reste séparée de la version noire. Pour les V3L, le P/N européen est celui de la table fabricant."
    ]
  },
  "import-psu-4e0e232469e8": {
    "mpn": "R-DQ750M-FB0B-EU",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire DeepCool — fiche du modèle exact. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "DeepCool — fiche du modèle exact",
        "url": "https://global.deepcool.com/products/PowerSupplyUnits/powersupplyunits/DQ750M-V3L-750W-80-PLUS-Gold-Full-Modular-Power-Supply/2022/15896.shtml",
        "checkedAt": "2026-11-10T11:23:02.259506+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "R-DQ750M-FB0B-EU",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented",
      "fanSizeMm": 120,
      "fanCount": 1
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle",
            "value": "DQ750M-V3L"
          },
          {
            "label": "P/N",
            "value": "R-DQ750M-FB0B-EU"
          },
          {
            "label": "EAN",
            "value": "6933412716273"
          },
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Dimensions W × L × H",
            "value": "150 × 140 × 86 mm"
          },
          {
            "label": "Norme",
            "value": "ATX12V 2.4"
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
            "label": "Ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Protections",
            "value": "OVP / UVP / OCP / SCP / OPP / OTP"
          },
          {
            "label": "Température de fonctionnement",
            "value": "0–40 °C"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "V2L et V3L ont des références et profondeurs distinctes. La version blanche WH reste séparée de la version noire. Pour les V3L, le P/N européen est celui de la table fabricant."
    ]
  },
  "import-psu-17cc337ee16d": {
    "mpn": "R-DQ850M-FB0B-EU",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire DeepCool — fiche du modèle exact. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "DeepCool — fiche du modèle exact",
        "url": "https://www.deepcool.com/products/PowerSupplyUnits/powersupplyunits/DQ850M-V3L-850W-80-PLUS-Gold-Full-Modular-Power-Supply/2022/15897.shtml",
        "checkedAt": "2026-11-10T11:24:29.777593+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "R-DQ850M-FB0B-EU",
      "wattage": 850,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented",
      "fanSizeMm": 120,
      "fanCount": 1
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle",
            "value": "DQ850M-V3L"
          },
          {
            "label": "P/N",
            "value": "R-DQ850M-FB0B-EU"
          },
          {
            "label": "EAN",
            "value": "6933412716419"
          },
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Dimensions W × L × H",
            "value": "150 × 140 × 86 mm"
          },
          {
            "label": "Norme",
            "value": "ATX12V 2.4"
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
            "label": "Ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Protections",
            "value": "OVP / UVP / OCP / SCP / OPP / OTP"
          },
          {
            "label": "Température de fonctionnement",
            "value": "0–40 °C"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "V2L et V3L ont des références et profondeurs distinctes. La version blanche WH reste séparée de la version noire. Pour les V3L, le P/N européen est celui de la table fabricant."
    ]
  },
  "import-psu-d8cbb8711f70": {
    "mpn": "R-DQA00M-FB0B-EU",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire DeepCool — fiche du modèle exact. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "DeepCool — fiche du modèle exact",
        "url": "https://global.deepcool.com/products/PowerSupplyUnits/powersupplyunits/DQ1000M-V3L-80-PLUS-Gold-Modular-Power-Supply/2022/15895.shtml",
        "checkedAt": "2026-11-10T11:24:25.564988+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "R-DQA00M-FB0B-EU",
      "wattage": 1000,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented",
      "fanSizeMm": 120,
      "fanCount": 1
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle",
            "value": "DQ1000M-V3L"
          },
          {
            "label": "P/N",
            "value": "R-DQA00M-FB0B-EU"
          },
          {
            "label": "EAN",
            "value": "6933412716556"
          },
          {
            "label": "Puissance continue",
            "value": "1000 W"
          },
          {
            "label": "Dimensions W × L × H",
            "value": "150 × 140 × 86 mm"
          },
          {
            "label": "Norme",
            "value": "ATX12V 2.4"
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
            "label": "Ventilateur",
            "value": "120 mm"
          },
          {
            "label": "Protections",
            "value": "OVP / UVP / OCP / SCP / OPP / OTP"
          },
          {
            "label": "Température de fonctionnement",
            "value": "0–40 °C"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "V2L et V3L ont des références et profondeurs distinctes. La version blanche WH reste séparée de la version noire. Pour les V3L, le P/N européen est celui de la table fabricant."
    ]
  },
  "import-psu-66e10a1481ba": {
    "mpn": "ATX3-FOCUS-GX-850-WHITE",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire Seasonic — FOCUS GX WHITE ATX 3.0, produits arrêtés. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "Seasonic — FOCUS GX WHITE ATX 3.0, produits arrêtés",
        "url": "https://seasonic.com/atx3-focus-gx-white",
        "checkedAt": "2026-11-10T11:23:21.075576+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "ATX3-FOCUS-GX-850-WHITE",
      "wattage": 850,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented",
      "fanSizeMm": 135,
      "fanCount": 1,
      "color": "#f0efeb"
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle commercial",
            "value": "ATX3-FOCUS-GX-850-WHITE"
          },
          {
            "label": "Génération",
            "value": "FOCUS GX WHITE ATX 3.0 · distinct de ATX 3.1"
          },
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Rail +12 V",
            "value": "840 W combinés"
          },
          {
            "label": "Dimensions",
            "value": "140 mm profondeur × 150 mm largeur × 86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Refroidissement",
            "value": "135 mm FDB · contrôle S3FC incluant mode sans ventilation"
          },
          {
            "label": "Câbles",
            "value": "Entièrement modulaires, individuels blancs à motif tressé"
          },
          {
            "label": "Connecteurs GPU",
            "value": "1 × 12VHPWR et 3 × PCIe 6+2"
          },
          {
            "label": "Connecteurs CPU",
            "value": "2 × EPS 4+4"
          },
          {
            "label": "Connecteurs SATA /Molex",
            "value": "10 SATA / 3 Molex"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Le code commercial présent dans l’archive est rapproché de la famille blanche ATX 3.0 et de la puissance exacte du tableau constructeur. La fiche est classée produits arrêtés. Aucune offre de la nouvelle génération ATX 3.1 ne lui est attribuée."
    ]
  },
  "import-psu-d9f321abf1b3": {
    "mpn": "ATX3-FOCUS-GX-1000-WHITE",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire Seasonic — FOCUS GX WHITE ATX 3.0, produits arrêtés. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "Seasonic — FOCUS GX WHITE ATX 3.0, produits arrêtés",
        "url": "https://seasonic.com/atx3-focus-gx-white",
        "checkedAt": "2026-11-10T11:23:21.075576+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "ATX3-FOCUS-GX-1000-WHITE",
      "wattage": 1000,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented",
      "fanSizeMm": 135,
      "fanCount": 1,
      "color": "#f0efeb"
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle commercial",
            "value": "ATX3-FOCUS-GX-1000-WHITE"
          },
          {
            "label": "Génération",
            "value": "FOCUS GX WHITE ATX 3.0 · distinct de ATX 3.1"
          },
          {
            "label": "Puissance continue",
            "value": "1000 W"
          },
          {
            "label": "Rail +12 V",
            "value": "996 W combinés"
          },
          {
            "label": "Dimensions",
            "value": "140 mm profondeur × 150 mm largeur × 86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Refroidissement",
            "value": "135 mm FDB · contrôle S3FC incluant mode sans ventilation"
          },
          {
            "label": "Câbles",
            "value": "Entièrement modulaires, individuels blancs à motif tressé"
          },
          {
            "label": "Connecteurs GPU",
            "value": "1 × 12VHPWR et 3 × PCIe 6+2"
          },
          {
            "label": "Connecteurs CPU",
            "value": "2 × EPS 4+4"
          },
          {
            "label": "Connecteurs SATA /Molex",
            "value": "10 SATA / 3 Molex"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Le code commercial présent dans l’archive est rapproché de la famille blanche ATX 3.0 et de la puissance exacte du tableau constructeur. La fiche est classée produits arrêtés. Aucune offre de la nouvelle génération ATX 3.1 ne lui est attribuée."
    ]
  },
  "import-psu-0c79bc40d570": {
    "mpn": "ATX3-FOCUS-GX-750-WHITE",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire Seasonic — FOCUS GX WHITE ATX 3.0, produits arrêtés. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "Seasonic — FOCUS GX WHITE ATX 3.0, produits arrêtés",
        "url": "https://seasonic.com/atx3-focus-gx-white",
        "checkedAt": "2026-11-10T11:23:21.075576+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "ATX3-FOCUS-GX-750-WHITE",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented",
      "fanSizeMm": 135,
      "fanCount": 1,
      "color": "#f0efeb"
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle commercial",
            "value": "ATX3-FOCUS-GX-750-WHITE"
          },
          {
            "label": "Génération",
            "value": "FOCUS GX WHITE ATX 3.0 · distinct de ATX 3.1"
          },
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Rail +12 V",
            "value": "744 W combinés"
          },
          {
            "label": "Dimensions",
            "value": "140 mm profondeur × 150 mm largeur × 86 mm hauteur"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Refroidissement",
            "value": "135 mm FDB · contrôle S3FC incluant mode sans ventilation"
          },
          {
            "label": "Câbles",
            "value": "Entièrement modulaires, individuels blancs à motif tressé"
          },
          {
            "label": "Connecteurs GPU",
            "value": "1 × 12VHPWR et 2 × PCIe 6+2"
          },
          {
            "label": "Connecteurs CPU",
            "value": "2 × EPS 4+4"
          },
          {
            "label": "Connecteurs SATA /Molex",
            "value": "10 SATA / 3 Molex"
          },
          {
            "label": "Garantie",
            "value": "10 ans"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Le code commercial présent dans l’archive est rapproché de la famille blanche ATX 3.0 et de la puissance exacte du tableau constructeur. La fiche est classée produits arrêtés. Aucune offre de la nouvelle génération ATX 3.1 ne lui est attribuée."
    ]
  },
  "import-psu-2892752863cd": {
    "mpn": "ETL450AWT-M",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire ENERMAX — Triathlor ECO fiche fabricant, février 2016. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "ENERMAX — Triathlor ECO fiche fabricant, février 2016",
        "url": "https://www.enermax.com/en/products/file/1/bsybopcD5j",
        "checkedAt": "2026-11-10T11:23:00.755585+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "ETL450AWT-M",
      "wattage": 450,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented"
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle",
            "value": "ETL450AWT-M"
          },
          {
            "label": "Puissance continue",
            "value": "450 W"
          },
          {
            "label": "Rail +12 V",
            "value": "408 W"
          },
          {
            "label": "Dimensions W × H × D",
            "value": "150 × 86 × 140 mm"
          },
          {
            "label": "Rendement",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "Câblage",
            "value": "Hybride semi-modulaire"
          },
          {
            "label": "PCIe 6+2",
            "value": "2"
          },
          {
            "label": "SATA /Molex /FDD",
            "value": "8 /4 /1"
          },
          {
            "label": "CPU",
            "value": "1 × 4+4 broches"
          },
          {
            "label": "Protections",
            "value": "OVP / UVP / OPP / SCP / SIP"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Le document fabricant est historique et ne confirme aucune disponibilité actuelle. Le diamètre du ventilateur n’est pas inventé à partir de la taille du boîtier."
    ]
  },
  "import-psu-a74fc3752b09": {
    "mpn": "ETL550AWT-M",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire ENERMAX — Triathlor ECO fiche fabricant, février 2016. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "ENERMAX — Triathlor ECO fiche fabricant, février 2016",
        "url": "https://www.enermax.com/en/products/file/1/bsybopcD5j",
        "checkedAt": "2026-11-10T11:23:00.755585+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "ETL550AWT-M",
      "wattage": 550,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented"
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle",
            "value": "ETL550AWT-M"
          },
          {
            "label": "Puissance continue",
            "value": "550 W"
          },
          {
            "label": "Rail +12 V",
            "value": "504 W"
          },
          {
            "label": "Dimensions W × H × D",
            "value": "150 × 86 × 140 mm"
          },
          {
            "label": "Rendement",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "Câblage",
            "value": "Hybride semi-modulaire"
          },
          {
            "label": "PCIe 6+2",
            "value": "2"
          },
          {
            "label": "SATA /Molex /FDD",
            "value": "8 /4 /1"
          },
          {
            "label": "CPU",
            "value": "1 × 4+4 broches"
          },
          {
            "label": "Protections",
            "value": "OVP / UVP / OPP / SCP / SIP"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Le document fabricant est historique et ne confirme aucune disponibilité actuelle. Le diamètre du ventilateur n’est pas inventé à partir de la taille du boîtier."
    ]
  },
  "import-psu-2f4aaf870250": {
    "mpn": "ETL650AWT-M",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire ENERMAX — Triathlor ECO fiche fabricant, février 2016. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "ENERMAX — Triathlor ECO fiche fabricant, février 2016",
        "url": "https://www.enermax.com/en/products/file/1/bsybopcD5j",
        "checkedAt": "2026-11-10T11:23:00.755585+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "ETL650AWT-M",
      "wattage": 650,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented"
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle",
            "value": "ETL650AWT-M"
          },
          {
            "label": "Puissance continue",
            "value": "650 W"
          },
          {
            "label": "Rail +12 V",
            "value": "600 W"
          },
          {
            "label": "Dimensions W × H × D",
            "value": "150 × 86 × 140 mm"
          },
          {
            "label": "Rendement",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "Câblage",
            "value": "Hybride semi-modulaire"
          },
          {
            "label": "PCIe 6+2",
            "value": "4"
          },
          {
            "label": "SATA /Molex /FDD",
            "value": "8 /4 /1"
          },
          {
            "label": "CPU",
            "value": "1 × 4+4 broches"
          },
          {
            "label": "Protections",
            "value": "OVP / UVP / OPP / SCP / SIP"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Le document fabricant est historique et ne confirme aucune disponibilité actuelle. Le diamètre du ventilateur n’est pas inventé à partir de la taille du boîtier."
    ]
  },
  "import-psu-dfda1cc04099": {
    "mpn": "FSP650-80EGN",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire FSP — fiche OEM 9PA6502502, hébergée par Rosch Computer. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "FSP — fiche OEM 9PA6502502, hébergée par Rosch Computer",
        "url": "https://www.rosch-computer.de/file.jsp?aid=5730&sku=FSP650-80EGN",
        "checkedAt": "2026-11-10T11:24:26.216994+00:00",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "FSP650-80EGN",
      "wattage": 650,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "detailLevel": "documented"
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle",
            "value": "FSP650-80EGN 90+"
          },
          {
            "label": "Référence OEM",
            "value": "9PA6502502"
          },
          {
            "label": "Puissance continue",
            "value": "650 W"
          },
          {
            "label": "Puissance de crête",
            "value": "700 W"
          },
          {
            "label": "Rail +12 V combiné",
            "value": "600 W · 4 rails"
          },
          {
            "label": "Dimensions profondeur × largeur × hauteur",
            "value": "140 × 150 × 86 mm"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Secteur",
            "value": "90–264 V ·47–63 Hz"
          },
          {
            "label": "Connectique",
            "value": "4 SATA ·4 Molex ·1 Floppy ·2 PCIe 6 et 2 PCIe 6+2"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "650 W continus confirmés par la fiche FSP originale et le rapport de certification CLEAResult, test du 1 juin 2011 ; 600 W correspond au total combiné des rails 12 V, pas à la puissance nominale du bloc. Aucun prix courant ajouté."
    ]
  },
  "import-psu-b2d35c8858bf": {
    "mpn": "ERV1000EWT-G",
    "identityNote": "Modèle, puissance, génération et finition rapprochés individuellement de la source primaire ENERMAX — REVOLUTION87+ fiche fabricant, hébergée par Kabelfreak. Aucun prix déduit du nom ou de la ligne d’archive.",
    "sources": [
      {
        "name": "ENERMAX — REVOLUTION87+ fiche fabricant, hébergée par Kabelfreak",
        "url": "https://www.kabelfreak.de/info/datenblaetter/15600150.pdf",
        "checkedAt": "2026-11-10T11:24:39.808946+00:00",
        "kind": "manufacturer"
      },
      {
        "name": "Scan — référence exacte ERV1000EWT-G arrêtée",
        "url": "https://www.scan.co.uk/products/1000w-enermax-revolution-87plus-hybrid-modular-80-plus-gold-94-eff-eps-12v-1-x-139mm-fan-atx-v23-psu",
        "checkedAt": "2026-11-10T11:23:19.040081+00:00",
        "kind": "retailer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "ERV1000EWT-G",
      "wattage": 1000,
      "psuFormat": "ATX",
      "fanSizeMm": 139,
      "fanCount": 1
    },
    "groups": [
      {
        "title": "Données de la référence exacte",
        "rows": [
          {
            "label": "Modèle",
            "value": "REVOLUTION87+ ERV1000EWT-G"
          },
          {
            "label": "Puissance continue",
            "value": "1000 W"
          },
          {
            "label": "Puissance de crête",
            "value": "1100 W, maximum 60 secondes"
          },
          {
            "label": "Rails +12 V",
            "value": "4 rails · 996 W combinés"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Secteur",
            "value": "115–240 V ·50–60 Hz"
          },
          {
            "label": "CPU",
            "value": "1 EPS 8 et 1 EPS 4+4"
          },
          {
            "label": "PCIe 6+2",
            "value": "2 fixes et 4 sur câbles modulaires"
          },
          {
            "label": "Câblage",
            "value": "Hybride semi-modulaire"
          },
          {
            "label": "Ventilateur",
            "value": "139 mm Twister Bearing, fiche Scan exacte"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "Les dimensions complètes ne figurent pas dans les sources primaires consultées et restent inconnues. Produit déclaré End of Life par Scan ; aucun prix actuel ajouté."
    ]
  },
  "import-psu-9ce8a79434a7": {
    "mpn": "SST-DA850R-GMA",
    "identityNote": "Le PDF constructeur distingue explicitement SST-DA850R-GMA (Noir) de la variante blanche avec suffixe -WWW. La puissance et la finition correspondent à la ligne originale du catalogue. Ne pas confondre DAxxxR-GMA et DAxxxR-GM.",
    "sources": [
      {
        "name": "SilverStone — fiche PDF du modèle exact",
        "url": "https://www.silverstonetek.com/upload/sstedm/da850r-gma/DA850R%20Gold%20Product%20Sheet-EN.pdf",
        "checkedAt": "2026-11-10T11:23:48.439Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — modèle, variantes et connecteurs",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T11:27:23.399Z",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "SST-DA850R-GMA",
      "detailLevel": "documented",
      "wattage": 850,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "fanCount": 1,
      "fanSizeMm": 120,
      "description": "SilverStone Decathlon DA850R-GMA noir, référence SST-DA850R-GMA. Bloc ATX entièrement modulaire de 850 W, certifié 80 PLUS Gold. La fiche fabricant annonce ATX 3.0 et PCIe 5.0 avec connecteur 12V-2x6. Boîtier de 140 mm de profondeur et ventilateur 120 mm semi-passif.",
      "specs": [
        "850 W",
        "80 PLUS Gold",
        "ATX 3.0 · PCIe 5.0",
        "Modulaire · 12V-2x6",
        "150 × 86 × 140 mm",
        "Ventilateur 120 mm",
        "SST-DA850R-GMA"
      ]
    },
    "groups": [
      {
        "title": "SilverStone — fiche du modèle et de sa finition",
        "rows": [
          {
            "label": "Référence fabricant",
            "value": "SST-DA850R-GMA"
          },
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Finition",
            "value": "Noir"
          },
          {
            "label": "Format",
            "value": "ATX (PS2)"
          },
          {
            "label": "Normes documentées",
            "value": "ATX 3.0 · PCIe 5.0"
          },
          {
            "label": "Rendement certifié",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Dimensions L × H × P",
            "value": "150 × 86 × 140 mm"
          },
          {
            "label": "Refroidissement",
            "value": "Ventilateur 120 mm · fonctionnement semi-passif"
          },
          {
            "label": "Poids fabricant",
            "value": "2,13 kg"
          },
          {
            "label": "Rail +12 V",
            "value": "850 W combinés déclarés"
          },
          {
            "label": "Rails +3,3 V / +5 V",
            "value": "100 W combinés"
          },
          {
            "label": "Entrée secteur",
            "value": "90–264 Vrms · 47–63 Hz"
          },
          {
            "label": "Température de fonctionnement",
            "value": "0–50 °C"
          },
          {
            "label": "Protections",
            "value": "OCP · OPP · OVP · SCP · OTP · UVP"
          }
        ]
      },
      {
        "title": "Connecteurs",
        "rows": [
          {
            "label": "Carte mère",
            "value": "1 × 24/20 broches"
          },
          {
            "label": "Processeur",
            "value": "2 × 8/4 broches EPS/ATX12V"
          },
          {
            "label": "Carte graphique",
            "value": "4 × 8/6 broches PCIe et 1 × 12V-2x6"
          },
          {
            "label": "Périphériques",
            "value": "8 × SATA et 4 × Molex 4 broches"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "La norme ATX 3.0 est celle du PDF constructeur lu. Certaines pages locales indexées annoncent aussi ATX 3.1 ; aucune évolution matérielle n’est déduite de ces différences de présentation.",
      "Aucun prix actuel français neuf en stock n’a été confirmé pour cette référence et cette finition.",
      "Le fabricant exclut les câbles modulaires PP05-E et PP06 pour les DA750R-GMA et DA850R-GMA, y compris les variantes blanches -WWW."
    ]
  },
  "import-psu-6ff1fd44501b": {
    "mpn": "SST-DA850R-GMA-WWW",
    "identityNote": "Le PDF constructeur distingue explicitement SST-DA850R-GMA-WWW (Blanc) de la variante noire sans suffixe. La puissance et la finition correspondent à la ligne originale du catalogue. Ne pas confondre DAxxxR-GMA et DAxxxR-GM.",
    "sources": [
      {
        "name": "SilverStone — fiche PDF du modèle exact",
        "url": "https://www.silverstonetek.com/upload/sstedm/da850r-gma/DA850R%20Gold%20Product%20Sheet-EN.pdf",
        "checkedAt": "2026-11-10T11:23:48.439Z",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-source-d-alimentation-silverstone-da850r-850w-80-plus-gold-modulaire-blanche",
        "checkedAt": "2026-11-10T11:24:41.579491+00:00",
        "kind": "retailer"
      },
      {
        "name": "SilverStone — modèle, variantes et connecteurs",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T11:27:23.399Z",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "SST-DA850R-GMA-WWW",
      "detailLevel": "documented",
      "wattage": 850,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "fanCount": 1,
      "fanSizeMm": 120,
      "description": "SilverStone Decathlon DA850R-GMA blanc, référence SST-DA850R-GMA-WWW. Bloc ATX entièrement modulaire de 850 W, certifié 80 PLUS Gold. La fiche fabricant annonce ATX 3.0 et PCIe 5.0 avec connecteur 12V-2x6. Boîtier de 140 mm de profondeur et ventilateur 120 mm semi-passif.",
      "specs": [
        "850 W",
        "80 PLUS Gold",
        "ATX 3.0 · PCIe 5.0",
        "Modulaire · 12V-2x6",
        "150 × 86 × 140 mm",
        "Ventilateur 120 mm",
        "SST-DA850R-GMA-WWW"
      ]
    },
    "groups": [
      {
        "title": "SilverStone — fiche du modèle et de sa finition",
        "rows": [
          {
            "label": "Référence fabricant",
            "value": "SST-DA850R-GMA-WWW"
          },
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Finition",
            "value": "Blanc"
          },
          {
            "label": "Format",
            "value": "ATX (PS2)"
          },
          {
            "label": "Normes documentées",
            "value": "ATX 3.0 · PCIe 5.0"
          },
          {
            "label": "Rendement certifié",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Dimensions L × H × P",
            "value": "150 × 86 × 140 mm"
          },
          {
            "label": "Refroidissement",
            "value": "Ventilateur 120 mm · fonctionnement semi-passif"
          },
          {
            "label": "Poids fabricant",
            "value": "2,13 kg"
          },
          {
            "label": "Rail +12 V",
            "value": "850 W combinés déclarés"
          },
          {
            "label": "Rails +3,3 V / +5 V",
            "value": "100 W combinés"
          },
          {
            "label": "Entrée secteur",
            "value": "90–264 Vrms · 47–63 Hz"
          },
          {
            "label": "Température de fonctionnement",
            "value": "0–50 °C"
          },
          {
            "label": "Protections",
            "value": "OCP · OPP · OVP · SCP · OTP · UVP"
          }
        ]
      },
      {
        "title": "Connecteurs",
        "rows": [
          {
            "label": "Carte mère",
            "value": "1 × 24/20 broches"
          },
          {
            "label": "Processeur",
            "value": "2 × 8/4 broches EPS/ATX12V"
          },
          {
            "label": "Carte graphique",
            "value": "4 × 8/6 broches PCIe et 1 × 12V-2x6"
          },
          {
            "label": "Périphériques",
            "value": "8 × SATA et 4 × Molex 4 broches"
          }
        ]
      }
    ],
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "Digital Universe FR",
        "url": "https://www.pccomponentes.fr/alimentation-pc-source-d-alimentation-silverstone-da850r-850w-80-plus-gold-modulaire-blanche",
        "productName": "Source d'alimentation SilverStone DA850R 850W 80 PLUS Gold modulaire blanche",
        "mpn": "SST-DA850R-GMA-WWW",
        "amount": 224.71,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Frais affichés : 0 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T11:24:41.579491+00:00"
      }
    ],
    "notes": [
      "La norme ATX 3.0 est celle du PDF constructeur lu. Certaines pages locales indexées annoncent aussi ATX 3.1 ; aucune évolution matérielle n’est déduite de ces différences de présentation.",
      "Le fabricant exclut les câbles modulaires PP05-E et PP06 pour les DA750R-GMA et DA850R-GMA, y compris les variantes blanches -WWW."
    ]
  },
  "import-psu-3dd670f97215": {
    "mpn": "SST-DA750R-GMA",
    "identityNote": "Le PDF constructeur distingue explicitement SST-DA750R-GMA (Noir) de la variante blanche avec suffixe -WWW. La puissance et la finition correspondent à la ligne originale du catalogue. Ne pas confondre DAxxxR-GMA et DAxxxR-GM.",
    "sources": [
      {
        "name": "SilverStone — fiche PDF du modèle exact",
        "url": "https://www.silverstonetek.com/upload/sstedm/da750r-gma/DA750R%20Gold%20Product%20Sheet-EN.pdf",
        "checkedAt": "2026-11-10T11:23:48.917Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — modèle, variantes et connecteurs",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T11:27:24.423Z",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "SST-DA750R-GMA",
      "detailLevel": "documented",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "fanCount": 1,
      "fanSizeMm": 120,
      "description": "SilverStone Decathlon DA750R-GMA noir, référence SST-DA750R-GMA. Bloc ATX entièrement modulaire de 750 W, certifié 80 PLUS Gold. La fiche fabricant annonce ATX 3.0 et PCIe 5.0 avec connecteur 12V-2x6. Boîtier de 140 mm de profondeur et ventilateur 120 mm semi-passif.",
      "specs": [
        "750 W",
        "80 PLUS Gold",
        "ATX 3.0 · PCIe 5.0",
        "Modulaire · 12V-2x6",
        "150 × 86 × 140 mm",
        "Ventilateur 120 mm",
        "SST-DA750R-GMA"
      ]
    },
    "groups": [
      {
        "title": "SilverStone — fiche du modèle et de sa finition",
        "rows": [
          {
            "label": "Référence fabricant",
            "value": "SST-DA750R-GMA"
          },
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Finition",
            "value": "Noir"
          },
          {
            "label": "Format",
            "value": "ATX (PS2)"
          },
          {
            "label": "Normes documentées",
            "value": "ATX 3.0 · PCIe 5.0"
          },
          {
            "label": "Rendement certifié",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Dimensions L × H × P",
            "value": "150 × 86 × 140 mm"
          },
          {
            "label": "Refroidissement",
            "value": "Ventilateur 120 mm · fonctionnement semi-passif"
          },
          {
            "label": "Poids fabricant",
            "value": "2,08 kg"
          },
          {
            "label": "Rail +12 V",
            "value": "750 W combinés déclarés"
          },
          {
            "label": "Rails +3,3 V / +5 V",
            "value": "100 W combinés"
          },
          {
            "label": "Entrée secteur",
            "value": "90–264 Vrms · 47–63 Hz"
          },
          {
            "label": "Température de fonctionnement",
            "value": "0–50 °C"
          },
          {
            "label": "Protections",
            "value": "OCP · OPP · OVP · SCP · OTP · UVP"
          }
        ]
      },
      {
        "title": "Connecteurs",
        "rows": [
          {
            "label": "Carte mère",
            "value": "1 × 24/20 broches"
          },
          {
            "label": "Processeur",
            "value": "2 × 8/4 broches EPS/ATX12V"
          },
          {
            "label": "Carte graphique",
            "value": "4 × 8/6 broches PCIe et 1 × 12V-2x6"
          },
          {
            "label": "Périphériques",
            "value": "8 × SATA et 4 × Molex 4 broches"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "La norme ATX 3.0 est celle du PDF constructeur lu. Certaines pages locales indexées annoncent aussi ATX 3.1 ; aucune évolution matérielle n’est déduite de ces différences de présentation.",
      "Aucun prix actuel français neuf en stock n’a été confirmé pour cette référence et cette finition.",
      "Le fabricant exclut les câbles modulaires PP05-E et PP06 pour les DA750R-GMA et DA850R-GMA, y compris les variantes blanches -WWW."
    ]
  },
  "import-psu-71ed5bfaffca": {
    "mpn": "SST-DA750R-GMA-WWW",
    "identityNote": "Le PDF constructeur distingue explicitement SST-DA750R-GMA-WWW (Blanc) de la variante noire sans suffixe. La puissance et la finition correspondent à la ligne originale du catalogue. Ne pas confondre DAxxxR-GMA et DAxxxR-GM.",
    "sources": [
      {
        "name": "SilverStone — fiche PDF du modèle exact",
        "url": "https://www.silverstonetek.com/upload/sstedm/da750r-gma/DA750R%20Gold%20Product%20Sheet-EN.pdf",
        "checkedAt": "2026-11-10T11:23:48.917Z",
        "kind": "manufacturer"
      },
      {
        "name": "PcComponentes",
        "url": "https://www.pccomponentes.fr/alimentation-pc-alimentation-silverstone-da750r-gold-750w-certifie-80-plus-gold-modulaire",
        "checkedAt": "2026-11-10T11:24:42.521569+00:00",
        "kind": "retailer"
      },
      {
        "name": "SilverStone — modèle, variantes et connecteurs",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T11:27:24.423Z",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "SST-DA750R-GMA-WWW",
      "detailLevel": "documented",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "fanCount": 1,
      "fanSizeMm": 120,
      "description": "SilverStone Decathlon DA750R-GMA blanc, référence SST-DA750R-GMA-WWW. Bloc ATX entièrement modulaire de 750 W, certifié 80 PLUS Gold. La fiche fabricant annonce ATX 3.0 et PCIe 5.0 avec connecteur 12V-2x6. Boîtier de 140 mm de profondeur et ventilateur 120 mm semi-passif.",
      "specs": [
        "750 W",
        "80 PLUS Gold",
        "ATX 3.0 · PCIe 5.0",
        "Modulaire · 12V-2x6",
        "150 × 86 × 140 mm",
        "Ventilateur 120 mm",
        "SST-DA750R-GMA-WWW"
      ]
    },
    "groups": [
      {
        "title": "SilverStone — fiche du modèle et de sa finition",
        "rows": [
          {
            "label": "Référence fabricant",
            "value": "SST-DA750R-GMA-WWW"
          },
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Finition",
            "value": "Blanc"
          },
          {
            "label": "Format",
            "value": "ATX (PS2)"
          },
          {
            "label": "Normes documentées",
            "value": "ATX 3.0 · PCIe 5.0"
          },
          {
            "label": "Rendement certifié",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Dimensions L × H × P",
            "value": "150 × 86 × 140 mm"
          },
          {
            "label": "Refroidissement",
            "value": "Ventilateur 120 mm · fonctionnement semi-passif"
          },
          {
            "label": "Poids fabricant",
            "value": "2,08 kg"
          },
          {
            "label": "Rail +12 V",
            "value": "750 W combinés déclarés"
          },
          {
            "label": "Rails +3,3 V / +5 V",
            "value": "100 W combinés"
          },
          {
            "label": "Entrée secteur",
            "value": "90–264 Vrms · 47–63 Hz"
          },
          {
            "label": "Température de fonctionnement",
            "value": "0–50 °C"
          },
          {
            "label": "Protections",
            "value": "OCP · OPP · OVP · SCP · OTP · UVP"
          }
        ]
      },
      {
        "title": "Connecteurs",
        "rows": [
          {
            "label": "Carte mère",
            "value": "1 × 24/20 broches"
          },
          {
            "label": "Processeur",
            "value": "2 × 8/4 broches EPS/ATX12V"
          },
          {
            "label": "Carte graphique",
            "value": "4 × 8/6 broches PCIe et 1 × 12V-2x6"
          },
          {
            "label": "Périphériques",
            "value": "8 × SATA et 4 × Molex 4 broches"
          }
        ]
      }
    ],
    "offers": [
      {
        "retailer": "PcComponentes",
        "seller": "ZOOMICI FR",
        "url": "https://www.pccomponentes.fr/alimentation-pc-alimentation-silverstone-da750r-gold-750w-certifie-80-plus-gold-modulaire",
        "productName": "Alimentation SilverStone DA750R Gold 750W Certifié 80 PLUS Gold modulaire",
        "mpn": "SST-DA750R-GMA-WWW",
        "amount": 150.56,
        "currency": "EUR",
        "market": "FR",
        "condition": "new",
        "availability": "in_stock",
        "priceKind": "current",
        "shipping": 0.0,
        "shippingNote": "Frais affichés : 0 € ; destination et conditions à confirmer.",
        "checkedAt": "2026-11-10T11:24:42.521569+00:00"
      }
    ],
    "notes": [
      "La norme ATX 3.0 est celle du PDF constructeur lu. Certaines pages locales indexées annoncent aussi ATX 3.1 ; aucune évolution matérielle n’est déduite de ces différences de présentation.",
      "Le fabricant exclut les câbles modulaires PP05-E et PP06 pour les DA750R-GMA et DA850R-GMA, y compris les variantes blanches -WWW."
    ]
  },
  "import-psu-639e323be26c": {
    "mpn": "ST75F-GS-V3",
    "identityNote": "ST75F-GS-V3 est explicitement nommé dans la garantie constructeur Europe. La page officielle propose le même manuel pour V3.0 / V3.1 ; le nom archivé V3 ne distingue pas ces deux révisions mineures. Seules les données communes explicitement documentées dans ce manuel sont retenues.",
    "sources": [
      {
        "name": "SilverStone — manuel Strider Gold S V3",
        "url": "https://www.silverstonetek.com/upload/downloads/Manual/power/en-st55f-gs-st65f-gs-st75f-gs-v3-manual.pdf",
        "checkedAt": "2026-11-10T11:24:38.467Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — garantie Europe et référence V3",
        "url": "https://www.silverstonetek.com/en/page/warranty",
        "checkedAt": "2026-11-10T11:24:39.002Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — correspondance du manuel aux révisions V3.0 / V3.1",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST75F-GS/",
        "checkedAt": "2026-11-10T11:27:23.914Z",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "ST75F-GS-V3",
      "detailLevel": "documented",
      "wattage": 750,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "fanSizeMm": 120,
      "fanCount": 1,
      "description": "SilverStone Strider Gold S ST75F-GS-V3, alimentation ATX de 750 W entièrement modulaire, certifiée 80 PLUS Gold. Manuel constructeur V3 : 150 × 86 × 140 mm, ventilateur 120 mm, rail +12 V 744 W et fonctionnement continu jusqu’à 40 °C.",
      "specs": [
        "750 W",
        "80 PLUS Gold",
        "Entièrement modulaire",
        "150 × 86 × 140 mm",
        "Ventilateur 120 mm",
        "Révision V3",
        "ST75F-GS-V3"
      ]
    },
    "groups": [
      {
        "title": "Données constructeur de la révision V3",
        "rows": [
          {
            "label": "Puissance continue",
            "value": "750 W"
          },
          {
            "label": "Format",
            "value": "ATX12V / EPS12V PS/2"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Câbles",
            "value": "100 % modulaires"
          },
          {
            "label": "Dimensions W × H × D",
            "value": "150 × 86 × 140 mm"
          },
          {
            "label": "Ventilateur",
            "value": "120 mm · bruit minimal 18 dBA"
          },
          {
            "label": "Puissance +12 V",
            "value": "744 W · 62 A"
          },
          {
            "label": "Rails +3,3 V / +5 V",
            "value": "100 W combinés"
          },
          {
            "label": "Entrée secteur",
            "value": "90–264 V AC · 47–63 Hz"
          },
          {
            "label": "Température en service",
            "value": "0–40 °C"
          },
          {
            "label": "Garantie Europe",
            "value": "5 ans pour les achats après le 1er mai 2020"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "V3.0 et V3.1 partagent le manuel officiel utilisé. La révision mineure de l’article archivé reste inconnue ; le nombre exact de connecteurs et la révision numérique ATX ne sont pas déduits de la fiche qui affiche les révisions les plus récentes.",
      "Le fabricant indique une incompatibilité des câbles ATX 24 broches PP05-E / PP06 avec V3.0.",
      "Aucun prix actuel français neuf en stock confirmé."
    ]
  },
  "import-psu-c80562043859": {
    "mpn": "ST85F-GS-V2",
    "identityNote": "La référence ST85F-GS-V2 est nommée dans la garantie constructeur Europe et dans le manuel officiel V2. La page ST85F-GS distingue explicitement V1 et V2 ; les dimensions, rails et connecteurs ci-dessous proviennent des lignes V2. La finition noire est celle du fabricant.",
    "sources": [
      {
        "name": "SilverStone — tableau distinct ST85F-GS V1 / V2",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST85F-GS/",
        "checkedAt": "2026-11-10T11:27:22.910Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — manuel ST85F-GS V2",
        "url": "https://www.silverstonetek.com/upload/downloads/Manual/power/en-st85f-gs-v2-manual.pdf",
        "checkedAt": "2026-11-10T11:26:27.125Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — garantie Europe et référence V2",
        "url": "https://www.silverstonetek.com/en/page/warranty",
        "checkedAt": "2026-11-10T11:24:39.002Z",
        "kind": "manufacturer"
      }
    ],
    "patch": {
      "manufacturerPartNumber": "ST85F-GS-V2",
      "detailLevel": "documented",
      "wattage": 850,
      "psuFormat": "ATX",
      "widthMm": 150,
      "heightMm": 86,
      "depthMm": 140,
      "fanSizeMm": 120,
      "fanCount": 1,
      "description": "SilverStone Strider Gold S ST85F-GS-V2, alimentation ATX noire de 850 W entièrement modulaire, certifiée 80 PLUS Gold. La révision V2 mesure 150 × 86 × 140 mm, avec un ventilateur de 120 mm, six prises PCIe 8/6 broches et deux prises EPS 8/4 broches.",
      "specs": [
        "850 W",
        "80 PLUS Gold",
        "Entièrement modulaire",
        "150 × 86 × 140 mm",
        "Ventilateur 120 mm",
        "Révision V2",
        "ST85F-GS-V2"
      ]
    },
    "groups": [
      {
        "title": "Données constructeur de la révision V2",
        "rows": [
          {
            "label": "Référence fabricant",
            "value": "ST85F-GS-V2"
          },
          {
            "label": "Puissance continue",
            "value": "850 W"
          },
          {
            "label": "Finition",
            "value": "Noir"
          },
          {
            "label": "Format",
            "value": "ATX"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Câbles",
            "value": "100 % modulaires"
          },
          {
            "label": "Dimensions L × H × P",
            "value": "150 × 86 × 140 mm"
          },
          {
            "label": "Poids",
            "value": "1,55 kg"
          },
          {
            "label": "Ventilateur",
            "value": "120 mm · bruit minimal 18 dBA"
          },
          {
            "label": "Puissance +12 V",
            "value": "850 W · 70,9 A maximum déclaré"
          },
          {
            "label": "Rails +3,3 V / +5 V",
            "value": "120 W combinés"
          },
          {
            "label": "Entrée secteur",
            "value": "90–264 V AC · 47–63 Hz"
          },
          {
            "label": "Température en service",
            "value": "0–40 °C"
          },
          {
            "label": "Protections",
            "value": "OCP · OPP · OVP · OTP · UVP · SCP"
          },
          {
            "label": "Garantie Europe",
            "value": "5 ans pour les achats après le 1er mai 2020"
          }
        ]
      },
      {
        "title": "Connecteurs de la révision V2",
        "rows": [
          {
            "label": "Carte mère",
            "value": "1 × 24/20 broches"
          },
          {
            "label": "Processeur",
            "value": "2 × 8/4 broches EPS/ATX12V"
          },
          {
            "label": "Carte graphique",
            "value": "6 × 8/6 broches PCIe"
          },
          {
            "label": "Périphériques",
            "value": "8 × SATA et 6 × Molex 4 broches"
          },
          {
            "label": "Lecteur de disquettes",
            "value": "2 × 4 broches"
          }
        ]
      }
    ],
    "offers": [],
    "notes": [
      "La profondeur de 150 mm, le poids de 2,5 kg et le rail +12 V de 840 W concernent V1 ; ils ne sont pas appliqués à cette référence V2.",
      "La révision numérique ATX et une prise 16 broches native ne sont pas supposées.",
      "Aucun prix actuel français neuf en stock confirmé."
    ]
  }
};
