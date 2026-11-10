// Generated from individual SilverStone primary specification tables.
import type { VerifiedProduct } from './verifiedTypes'

export const deepPowerSilverstoneProducts: Record<string, VerifiedProduct> = {
  "import-psu-9ce8a79434a7": {
    "identityKind": "mpn",
    "mpn": "SST-DA850R-GMA",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-DA850R-GMA"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0850MCGD-D"
          },
          {
            "label": "Color",
            "value": "White (lead-free paint) Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "850W"
          },
          {
            "label": "Power density",
            "value": "471W/L"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 70.8A | 3A | 0.3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | +5%-7% | ±5% | ±8% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 40mV | 40mV | 80mV | 40mV | 80mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "850W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "≥87% & <89%"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over Current Protection Over Power Protection Over Voltage Protection Short Circuit Protection Over Temperature Protection Under Voltage Protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 8 / 4-Pin EPS / ATX 12V connector 4 x 8 / 6-Pin PCIe connectors 1 x 12V-2x6 connector 8 x SATA connectors 4 x 4-Pin Peripheral connector ※ DA850R-GMA/ DA850R-GMA-WWW is not compatible with PP05-E and PP06 cables."
          },
          {
            "label": "Cooling System",
            "value": "Silent 120mm fan"
          },
          {
            "label": "Noise Level",
            "value": "0 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) × 86mm (H) × 140mm (D) 5.91\" (W) x 3.39\" (H) x 5.51\" (D)"
          },
          {
            "label": "Weight",
            "value": "2.13 kg | Describe | Version | File Size | Download | | --- | --- | --- | --- | | Describe DA850R Gold High resolution photos | Version | File Size 18.95 MB | Download | | Describe DA850R Gold Manual | Version | File Size 680.55 KB | Download | | Describe Restricted substance declaration | Version V1.0 | File Size 391.02 KB | Download | | Describe Multilanguage installation Manual | Version V1.0 | File Size 21.56 MB | Download | | Describe Warranty Information | Version | File Size | Download | | Describe DA850R Gold Product Sheet | Version | File Size 430.60 KB | Download | How to properly connect PCIe cables to high power consumption graphics cards? According to the power supply connector overuse definition from SilverStone warranty information. A single PCIe 8pin cable and connector’s maximum current rating is 12.5A, which is 150W (+12V x 12.5A). So SilverStone’s warranty will not cover damages or malfunction resulting from the use of a graphics card or expansion card with a single PCIe 8pin connector that exceeds standard 225W total power draw (150W from PCIe 8pin connector + 75W from PCIe motherboard slot). Similarly, a graphics card or expansion card with dual PCIe 8pin connectors that exceed 375W total power draw (300W from two PCIe 8pin connectors + 75W from PCIe motherboard slot) will also not be covered under warranty. 2. How to Jump Start your power supply (spare motherboard test) 3. How to Jump Start your power supply (Paper clip test) # DA750R Gold"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 850,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "850 W",
        "ATX (PS2)",
        "80 PLUS Gold",
        "Silent 120mm fan"
      ],
      "manufacturerPartNumber": "SST-DA850R-GMA",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone DA850R Gold de 850 W. Caractéristiques et connectique publiées pour la référence SST-DA850R-GMA ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires.",
      "La page fabricant publie côte à côte les finitions noire et blanche ; la référence suffixée WWW/WBW est conservée pour la finition blanche explicite."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 850,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      }
    }
  },
  "import-psu-3dd670f97215": {
    "identityKind": "mpn",
    "mpn": "SST-DA750R-GMA",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-DA750R-GMA"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0750MCGD-C"
          },
          {
            "label": "Color",
            "value": "White (lead-free paint) Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "750W"
          },
          {
            "label": "Power density",
            "value": "415W/L"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 62.5A | 3A | 0.3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | +5%-7% | ±5% | ±8% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 40mV | 40mV | 80mV | 40mV | 80mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "750W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "≥87% & <89%"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over Current Protection Over Power Protection Over Voltage Protection Short Circuit Protection Over Temperature Protection Under Voltage Protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 8 / 4-Pin EPS / ATX 12V connector 4 x 8 / 6-Pin PCIe connectors 1 x 12V-2x6 connector 8 x SATA connectors 4 x 4-Pin Peripheral connector ※ DA750R-GMA/DA750R-GMA-WWW are not compatible with PP05-E and PP06 cables."
          },
          {
            "label": "Cooling System",
            "value": "Silent 120mm fan"
          },
          {
            "label": "Noise Level",
            "value": "0 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) × 86mm (H) × 140mm (D) 5.91\" (W) x 3.39\" (H) x 5.51\" (D)"
          },
          {
            "label": "Weight",
            "value": "2.08kg | Describe | Version | File Size | Download | | --- | --- | --- | --- | | Describe DA750R Gold high resolution photos | Version | File Size 18.98 MB | Download | | Describe DA750R Gold manual | Version | File Size 680.55 KB | Download | | Describe Restricted substance declaration | Version | File Size 391.02 KB | Download | | Describe Multilanguage installation | Version | File Size 21.56 MB | Download | | Describe Warranty Information | Version | File Size | Download | | Describe DA750R Gold Product Sheet | Version | File Size 424.24 KB | Download | How to properly connect PCIe cables to high power consumption graphics cards? According to the power supply connector overuse definition from SilverStone warranty information. A single PCIe 8pin cable and connector’s maximum current rating is 12.5A, which is 150W (+12V x 12.5A). So SilverStone’s warranty will not cover damages or malfunction resulting from the use of a graphics card or expansion card with a single PCIe 8pin connector that exceeds standard 225W total power draw (150W from PCIe 8pin connector + 75W from PCIe motherboard slot). Similarly, a graphics card or expansion card with dual PCIe 8pin connectors that exceed 375W total power draw (300W from two PCIe 8pin connectors + 75W from PCIe motherboard slot) will also not be covered under warranty. 2. How to Jump Start your power supply (spare motherboard test) 3. How to Jump Start your power supply (Paper clip test) # ATTIS 650R Bronze"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 750,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "750 W",
        "ATX (PS2)",
        "80 PLUS Gold",
        "Silent 120mm fan"
      ],
      "manufacturerPartNumber": "SST-DA750R-GMA",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone DA750R Gold de 750 W. Caractéristiques et connectique publiées pour la référence SST-DA750R-GMA ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires.",
      "La page fabricant publie côte à côte les finitions noire et blanche ; la référence suffixée WWW/WBW est conservée pour la finition blanche explicite."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 750,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      }
    }
  },
  "import-psu-71ed5bfaffca": {
    "identityKind": "mpn",
    "mpn": "SST-DA750R-GMA-WWW",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-DA750R-GMA-WWW"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0750MCGD-C"
          },
          {
            "label": "Color",
            "value": "White (lead-free paint) Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "750W"
          },
          {
            "label": "Power density",
            "value": "415W/L"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 62.5A | 3A | 0.3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | +5%-7% | ±5% | ±8% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 40mV | 40mV | 80mV | 40mV | 80mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "750W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "≥87% & <89%"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over Current Protection Over Power Protection Over Voltage Protection Short Circuit Protection Over Temperature Protection Under Voltage Protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 8 / 4-Pin EPS / ATX 12V connector 4 x 8 / 6-Pin PCIe connectors 1 x 12V-2x6 connector 8 x SATA connectors 4 x 4-Pin Peripheral connector ※ DA750R-GMA/DA750R-GMA-WWW are not compatible with PP05-E and PP06 cables."
          },
          {
            "label": "Cooling System",
            "value": "Silent 120mm fan"
          },
          {
            "label": "Noise Level",
            "value": "0 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) × 86mm (H) × 140mm (D) 5.91\" (W) x 3.39\" (H) x 5.51\" (D)"
          },
          {
            "label": "Weight",
            "value": "2.08kg | Describe | Version | File Size | Download | | --- | --- | --- | --- | | Describe DA750R Gold high resolution photos | Version | File Size 18.98 MB | Download | | Describe DA750R Gold manual | Version | File Size 680.55 KB | Download | | Describe Restricted substance declaration | Version | File Size 391.02 KB | Download | | Describe Multilanguage installation | Version | File Size 21.56 MB | Download | | Describe Warranty Information | Version | File Size | Download | | Describe DA750R Gold Product Sheet | Version | File Size 424.24 KB | Download | How to properly connect PCIe cables to high power consumption graphics cards? According to the power supply connector overuse definition from SilverStone warranty information. A single PCIe 8pin cable and connector’s maximum current rating is 12.5A, which is 150W (+12V x 12.5A). So SilverStone’s warranty will not cover damages or malfunction resulting from the use of a graphics card or expansion card with a single PCIe 8pin connector that exceeds standard 225W total power draw (150W from PCIe 8pin connector + 75W from PCIe motherboard slot). Similarly, a graphics card or expansion card with dual PCIe 8pin connectors that exceed 375W total power draw (300W from two PCIe 8pin connectors + 75W from PCIe motherboard slot) will also not be covered under warranty. 2. How to Jump Start your power supply (spare motherboard test) 3. How to Jump Start your power supply (Paper clip test) # ATTIS 650R Bronze"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 750,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "750 W",
        "ATX (PS2)",
        "80 PLUS Gold",
        "Silent 120mm fan"
      ],
      "manufacturerPartNumber": "SST-DA750R-GMA-WWW",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone DA750R Gold de 750 W. Caractéristiques et connectique publiées pour la référence SST-DA750R-GMA-WWW ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires.",
      "La page fabricant publie côte à côte les finitions noire et blanche ; la référence suffixée WWW/WBW est conservée pour la finition blanche explicite."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 750,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      }
    }
  },
  "import-psu-f43bc8af4310": {
    "identityKind": "mpn",
    "mpn": "SST-HA1200R-PM",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1200r-pm/",
        "checkedAt": "2026-11-10T15:04:58.458Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-HA1200R-PM"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX1200MCPT-A"
          },
          {
            "label": "Color",
            "value": "Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "1200W"
          },
          {
            "label": "Power density",
            "value": "620W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 22A | 22A | 100A | 2.5A | 0.3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | +5/-7% | ±5% | ±5% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 30mV | 30mV | 70mV | 40mV | 40mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "1200W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "≥87% & <89% overall efficiency"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over Current Protection Over Power Protection Over Voltage Protection Short Circuit Protection Under Voltage Protection Over Temperature Protection No load operation"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 8 / 4-Pin EPS / ATX 12V connector 6 x 8 / 6-Pin PCIe connectors 1 x 12+4-Pin 12VHPWR connector 12 x SATA connectors 3 x 4-Pin Peripheral connector 1 x 4-Pin Floppy connector"
          },
          {
            "label": "Cooling System",
            "value": "Silent 135mm FDB fan"
          },
          {
            "label": "Noise Level",
            "value": "0 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "Cybenetics Platinum"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) × 86mm (H) × 150mm (D) 5.91\" (W) x 3.39\" (H) x 5.91\" (D)"
          },
          {
            "label": "Weight",
            "value": "2.9 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1200,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 150.0,
      "fanCount": 1,
      "fanSizeMm": 135,
      "psuFormat": "ATX",
      "specs": [
        "1200 W",
        "ATX (PS2)",
        "Cybenetics Platinum",
        "Silent 135mm FDB fan"
      ],
      "name": "HELA 1200R · 1200 W · ATX · Cybenetics Platinum · Entièrement modulaire · Noir",
      "manufacturerPartNumber": "SST-HA1200R-PM",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone HELA 1200R Platinum de 1200 W. Caractéristiques et connectique publiées pour la référence SST-HA1200R-PM ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1200,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1200r-pm/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1200r-pm/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1200r-pm/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "depthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1200r-pm/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1200r-pm/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanSizeMm": {
        "value": 135,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1200r-pm/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1200r-pm/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      }
    }
  },
  "import-psu-6ff1fd44501b": {
    "identityKind": "mpn",
    "mpn": "SST-DA850R-GMA-WWW",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-DA850R-GMA-WWW"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0850MCGD-D"
          },
          {
            "label": "Color",
            "value": "White (lead-free paint) Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "850W"
          },
          {
            "label": "Power density",
            "value": "471W/L"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 70.8A | 3A | 0.3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | +5%-7% | ±5% | ±8% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 40mV | 40mV | 80mV | 40mV | 80mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "850W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "≥87% & <89%"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over Current Protection Over Power Protection Over Voltage Protection Short Circuit Protection Over Temperature Protection Under Voltage Protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 8 / 4-Pin EPS / ATX 12V connector 4 x 8 / 6-Pin PCIe connectors 1 x 12V-2x6 connector 8 x SATA connectors 4 x 4-Pin Peripheral connector ※ DA850R-GMA/ DA850R-GMA-WWW is not compatible with PP05-E and PP06 cables."
          },
          {
            "label": "Cooling System",
            "value": "Silent 120mm fan"
          },
          {
            "label": "Noise Level",
            "value": "0 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) × 86mm (H) × 140mm (D) 5.91\" (W) x 3.39\" (H) x 5.51\" (D)"
          },
          {
            "label": "Weight",
            "value": "2.13 kg | Describe | Version | File Size | Download | | --- | --- | --- | --- | | Describe DA850R Gold High resolution photos | Version | File Size 18.95 MB | Download | | Describe DA850R Gold Manual | Version | File Size 680.55 KB | Download | | Describe Restricted substance declaration | Version V1.0 | File Size 391.02 KB | Download | | Describe Multilanguage installation Manual | Version V1.0 | File Size 21.56 MB | Download | | Describe Warranty Information | Version | File Size | Download | | Describe DA850R Gold Product Sheet | Version | File Size 430.60 KB | Download | How to properly connect PCIe cables to high power consumption graphics cards? According to the power supply connector overuse definition from SilverStone warranty information. A single PCIe 8pin cable and connector’s maximum current rating is 12.5A, which is 150W (+12V x 12.5A). So SilverStone’s warranty will not cover damages or malfunction resulting from the use of a graphics card or expansion card with a single PCIe 8pin connector that exceeds standard 225W total power draw (150W from PCIe 8pin connector + 75W from PCIe motherboard slot). Similarly, a graphics card or expansion card with dual PCIe 8pin connectors that exceed 375W total power draw (300W from two PCIe 8pin connectors + 75W from PCIe motherboard slot) will also not be covered under warranty. 2. How to Jump Start your power supply (spare motherboard test) 3. How to Jump Start your power supply (Paper clip test) # DA750R Gold"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 850,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "850 W",
        "ATX (PS2)",
        "80 PLUS Gold",
        "Silent 120mm fan"
      ],
      "manufacturerPartNumber": "SST-DA850R-GMA-WWW",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone DA850R Gold de 850 W. Caractéristiques et connectique publiées pour la référence SST-DA850R-GMA-WWW ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires.",
      "La page fabricant publie côte à côte les finitions noire et blanche ; la référence suffixée WWW/WBW est conservée pour la finition blanche explicite."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 850,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da850r_gma/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      }
    }
  },
  "import-psu-1c96e5c6ef16": {
    "identityKind": "mpn",
    "mpn": "SST-ET550-G",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ET550-G"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "550W"
          },
          {
            "label": "Power density",
            "value": "305W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 45A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | 3.0A | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "110W"
          },
          {
            "label": "Combined +12V",
            "value": "540W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "87% ~ 90% at 20% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "V1.1 1 x 24 / 20-Pin motherboard connector (500mm) 1 x 8 / 4-Pin EPS / ATX 12V connector (750mm) 2 x 8 / 6-Pin PCIe connector (500mm / 150mm) 8 x SATA connector (\"500mm / 150mm / 150mm\" x 2) 3 x 4-Pin Peripheral connector (500mm / 150mm / 150mm) 1 x 4-Pin Floppy connector (500mm / 150mm / 150mm / 150mm) V1.2 1 x 24 / 20-Pin motherboard connector (500mm) *1 x 8-Pin EPS and 1 x 4-Pin + 4-Pin ATX 12V connector (750mm / 150mm) 2 x 8 / 6-Pin PCIe connector (500mm / 150mm) 8 x SATA connector (\"500mm / 150mm / 150mm / 150mm\" x 2) 3 x 4-Pin Peripheral connector (500mm / 150mm / 150mm) 1 x 4-Pin Floppy connector (500mm / 150mm / 150mm / 150mm)"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.54 Kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 550,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "550 W",
        "ATX",
        "80 PLUS Gold",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ET550-G",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ET550-G de 550 W. Caractéristiques et connectique publiées pour la référence SST-ET550-G ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 550,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      }
    }
  },
  "import-psu-c8d3075aba4f": {
    "identityKind": "mpn",
    "mpn": "SST-AT750R-BF",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/at750r_bf/",
        "checkedAt": "2026-11-10T14:51:56.278Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-AT750R-BF"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0750FCBR-A"
          },
          {
            "label": "Color",
            "value": "Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "750W"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 62.5A | 3A | 0.3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | +5~-7% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 50mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "750W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "82% ~ 85% (at 20% ~ 100% loading)"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over Power Protection Over Voltage Protection Short Circuit Protection Under Voltage Protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 4-Pin + 4-Pin ATX 12V connector 4 x 8 / 6-Pin PCIe connector 6 x SATA connectors 3 x 4-Pin Peripheral connector"
          },
          {
            "label": "Cooling System",
            "value": "Silent 120mm fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) × 86mm (H) × 140mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.54 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 750,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "750 W",
        "ATX (PS2)",
        "80 PLUS Bronze",
        "Silent 120mm fan"
      ],
      "manufacturerPartNumber": "SST-AT750R-BF",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ATTIS 750R Bronze de 750 W. Caractéristiques et connectique publiées pour la référence SST-AT750R-BF ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 750,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at750r_bf/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at750r_bf/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at750r_bf/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at750r_bf/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at750r_bf/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at750r_bf/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at750r_bf/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      }
    }
  },
  "import-psu-8cf4699e64f9": {
    "identityKind": "mpn",
    "mpn": "SST-AT650R-BF",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-AT650R-BF"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0650FCBR-A"
          },
          {
            "label": "Color",
            "value": "SST-AT650R-BF: Black (lead-free paint) SST-AT650R-BF-WBW: White (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "650W"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 54.1A | 3A | 0.3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | +5~-7% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 50mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "649.2W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "82% ~ 85% (at 20% ~ 100% loading)"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over Power Protection Over Voltage Protection Short Circuit Protection Under Voltage Protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 4-Pin + 4-Pin ATX 12V connectors 4 x 8 / 6-Pin PCIe connectors 6 x SATA connectors 3 x 4-Pin Peripheral connector"
          },
          {
            "label": "Cooling System",
            "value": "Silent 120mm fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) × 86mm (H) × 140mm (D) 5.91\" (W) x 3.39\" (H) x 5.5\" (D)"
          },
          {
            "label": "Weight",
            "value": "1.52 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 650,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "650 W",
        "ATX (PS2)",
        "80 PLUS Bronze",
        "Silent 120mm fan"
      ],
      "manufacturerPartNumber": "SST-AT650R-BF",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ATTIS 650R Bronze de 650 W. Caractéristiques et connectique publiées pour la référence SST-AT650R-BF ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires.",
      "La page fabricant publie côte à côte les finitions noire et blanche ; la référence suffixée WWW/WBW est conservée pour la finition blanche explicite."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 650,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      }
    }
  },
  "import-psu-0e257a26b0d7": {
    "identityKind": "mpn",
    "mpn": "SST-DA650-G",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/DA650Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-DA650-G"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0650MCGD-A"
          },
          {
            "label": "Color",
            "value": "black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "650W"
          },
          {
            "label": "Power density",
            "value": "360W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 54A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | 3.0A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±3% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 30mV | 30mV | 40mV | 30mV | 40mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "648W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "87% ~ 90% (at 20% ~ 100% loading)"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector (600mm) 2 x 8 / 4-Pin EPS / ATX 12V connector (\"750mm\" x 2) 2 x 8 / 6-Pin PCIe connector (\"650mm\" x 2) 2 x 8 / 6-Pin PCIe connector (\"650mm / 150mm\") 8 x SATA connector (\"600mm / 150mm / 150mm / 150mm\" x 2) 3 x 4-Pin Peripheral connector + 1 x 4-Pin Floppy adapter connector (600mm / 150mm / 150mm / 150mm)"
          },
          {
            "label": "Cooling System",
            "value": "Silent 120mm FDB fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) x 86mm (H) x 140mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.42 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 650,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "650 W",
        "ATX (PS2)",
        "80 PLUS Gold",
        "Silent 120mm FDB fan"
      ],
      "manufacturerPartNumber": "SST-DA650-G",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone DA650 Gold de 650 W. Caractéristiques et connectique publiées pour la référence SST-DA650-G ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 650,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA650Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA650Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA650Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA650Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA650Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA650Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA650Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      }
    }
  },
  "import-psu-0e65c22421b3": {
    "identityKind": "mpn",
    "mpn": "SST-ST1300-TI",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1300-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST1300-TI"
          },
          {
            "label": "Color",
            "value": "Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "1300W (Peak 1400W)"
          },
          {
            "label": "Power density",
            "value": "560W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +12V2 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 25A | 22A | 108A | / | 3.0A | 0.3A | | Peak (Amps) | / | / | / | / | / | / | | Min.(Amps) | 0A | 0A | 0.15A | / | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | / | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | / | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | / | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "1296W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "90% ~ 94% at 10% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Under voltage protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector (550mm) 1 x 8 / 4-Pin EPS / ATX 12V connector (750mm) 1 x 8 / 4-Pin EPS / ATX 12V connector (550mm) 8 x 8 / 6-Pin PCIE connector (\"550mm\" x 8) 16 x SATA connector (\"600mm / 150mm / 150mm / 150mm\" x 4) 6 x 4-Pin Peripheral connector (\"600mm / 150mm / 150mm\" x 2) 1 x 4-Pin Floppy adapter connector (100mm)"
          },
          {
            "label": "Cooling System",
            "value": "Single 135mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "0 ~ 36 dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Titanium"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 180 mm (D)"
          },
          {
            "label": "Weight",
            "value": "3.96 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1300,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 180.0,
      "fanCount": 1,
      "fanSizeMm": 135,
      "psuFormat": "ATX",
      "specs": [
        "1300 W",
        "ATX",
        "80 PLUS Titanium",
        "Single 135mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST1300-TI",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST1300-TI de 1300 W. Caractéristiques et connectique publiées pour la référence SST-ST1300-TI ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1300,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1300-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1300-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1300-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "depthMm": {
        "value": 180.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1300-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1300-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "fanSizeMm": {
        "value": 135,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1300-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1300-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      }
    }
  },
  "import-psu-87247c1d1e75": {
    "identityKind": "mpn",
    "mpn": "SST-DA1000R-GM",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r-gm/",
        "checkedAt": "2026-11-10T15:15:43.747Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-DA1000R-GM"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX1000MCGD-A"
          },
          {
            "label": "Color",
            "value": "Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "1000W"
          },
          {
            "label": "Power density",
            "value": "517W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 22A | 22A | 83.5A | 3A | 0.3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | +5/-7% | ±5% | ±5% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 30mV | 30mV | 70mV | 40mV | 40mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "1000W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "≥87% & <89% overall efficiency"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over Current Protection Over Power Protection Over Voltage Protection Short Circuit Protection Under Voltage Protection Over Temperature Protection No load operation"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 8 / 4-Pin EPS / ATX 12V connector 6 x 8 / 6-Pin PCIe connectors 1 x 12+4-Pin 12VHPWR connector 12 x SATA connectors 3 x 4-Pin Peripheral connector 1 x 4-Pin Floppy connector"
          },
          {
            "label": "Cooling System",
            "value": "Silent 135mm FDB fan"
          },
          {
            "label": "Noise Level",
            "value": "0 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "Cybenetics Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) × 86mm (H) × 150mm (D) 5.91\" (W) x 3.39\" (H) x 5.91\" (D)"
          },
          {
            "label": "Weight",
            "value": "2.88 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1000,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 150.0,
      "fanCount": 1,
      "fanSizeMm": 135,
      "psuFormat": "ATX",
      "specs": [
        "1000 W",
        "ATX (PS2)",
        "Cybenetics Gold",
        "Silent 135mm FDB fan"
      ],
      "name": "DA1000R · 1000 W · ATX · Cybenetics Gold · Entièrement modulaire · Noir",
      "manufacturerPartNumber": "SST-DA1000R-GM",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone DA1000R Gold de 1000 W. Caractéristiques et connectique publiées pour la référence SST-DA1000R-GM ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1000,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r-gm/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r-gm/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r-gm/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "depthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r-gm/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r-gm/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "fanSizeMm": {
        "value": 135,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r-gm/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r-gm/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      }
    }
  },
  "import-psu-cb3f26d2013f": {
    "identityKind": "mpn",
    "mpn": "SST-AT650R-BF-WBW",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-AT650R-BF-WBW"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0650FCBR-A"
          },
          {
            "label": "Color",
            "value": "SST-AT650R-BF: Black (lead-free paint) SST-AT650R-BF-WBW: White (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "650W"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 54.1A | 3A | 0.3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | +5~-7% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 50mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "649.2W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "82% ~ 85% (at 20% ~ 100% loading)"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over Power Protection Over Voltage Protection Short Circuit Protection Under Voltage Protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 4-Pin + 4-Pin ATX 12V connectors 4 x 8 / 6-Pin PCIe connectors 6 x SATA connectors 3 x 4-Pin Peripheral connector"
          },
          {
            "label": "Cooling System",
            "value": "Silent 120mm fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) × 86mm (H) × 140mm (D) 5.91\" (W) x 3.39\" (H) x 5.5\" (D)"
          },
          {
            "label": "Weight",
            "value": "1.52 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 650,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "650 W",
        "ATX (PS2)",
        "80 PLUS Bronze",
        "Silent 120mm fan"
      ],
      "manufacturerPartNumber": "SST-AT650R-BF-WBW",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ATTIS 650R Bronze de 650 W. Caractéristiques et connectique publiées pour la référence SST-AT650R-BF-WBW ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires.",
      "La page fabricant publie côte à côte les finitions noire et blanche ; la référence suffixée WWW/WBW est conservée pour la finition blanche explicite."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 650,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/at650r_bf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      }
    }
  },
  "import-psu-906ae5bcf15a": {
    "identityKind": "mpn",
    "mpn": "SST-ET550-B",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ET550-B"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "550W"
          },
          {
            "label": "Power density",
            "value": "305W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 18A | 16A | 42A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | 3.0A | / | | Min.(Amps) | 0.3A | 0.5A | 1.0A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "110W"
          },
          {
            "label": "Combined +12V",
            "value": "504W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "82% ~ 85% @ 20% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "V1.1 1 x 24 / 20-Pin motherboard connector（500mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 2 x 8 / 6-Pin PCIE connector（500mm / 150mm） 6 x SATA connector（\"500mm / 150mm / 150mm\" x 2） 3 x 4-Pin Peripheral connector（500mm / 150mm / 150mm） 1 x 4-Pin Floppy connector（500mm / 150mm / 150mm / 150mm） V1.2 1 x 24 / 20-Pin motherboard connector（500mm） *1 x 8-Pin EPS and 1 x 4-Pin + 4-Pin ATX 12V connector (750mm / 150mm) 2 x 8 / 6-Pin PCIE connector（500mm / 150mm） 6 x SATA connector（\"500mm / 150mm / 150mm\" x 2） 3 x 4-Pin Peripheral connector（500mm / 150mm / 150mm） 1 x 4-Pin Floppy connector（500mm / 150mm / 150mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.49 Kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 550,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "550 W",
        "ATX",
        "80 PLUS Bronze",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ET550-B",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ET550-B de 550 W. Caractéristiques et connectique publiées pour la référence SST-ET550-B ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 550,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      }
    }
  },
  "import-psu-94bcd4304abf": {
    "identityKind": "mpn",
    "mpn": "SST-ST70F-PB",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-PB/",
        "checkedAt": "2026-11-10T14:54:35.599Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST70F-PB"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "700W (Peak 750W)"
          },
          {
            "label": "Power density",
            "value": "388W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 22A | 18A | 54A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0.1A | 0.2A | 0.5A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "130W"
          },
          {
            "label": "Combined +12V",
            "value": "648W"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz~63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "82%~85% at 20% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 4 x 8 / 6-Pin PCIE connector（\"550mm / 150mm\" x 2） 8 x SATA connector（\"600mm / 150mm / 150mm /150mm\" x 2） 3 x 4-Pin Peripheral connector （600mm / 150mm / 150mm） 1 x 4-Pin Floppy connector（600mm / 150mm / 150mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.0 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 700,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "700 W",
        "ATX",
        "80 PLUS Bronze",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST70F-PB",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST70F-PB de 700 W. Caractéristiques et connectique publiées pour la référence SST-ST70F-PB ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 700,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-PB/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-PB/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-PB/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-PB/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-PB/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-PB/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-PB/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      }
    }
  },
  "import-psu-a135fca27deb": {
    "identityKind": "mpn",
    "mpn": "SST-ST1200-PTS",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST1200-PTS"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "1200W"
          },
          {
            "label": "Power density",
            "value": "664W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 25A | 22A | 100A | 3A | 0.3A | | Min.(Amps) | 0A | 0A | 0.15A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "1200W"
          },
          {
            "label": "Input Voltage",
            "value": "100V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz~63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "89%~92% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over power protection Over current protection Over voltage protection Over Temperature protection Under voltage protection Short circuit protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（”600mm”） 1 x 8 / 4-Pin EPS / ATX 12V connector（”550mm”） 1 x 8 / 4-Pin EPS / ATX 12V connector（”750mm”） 8 x 8 / 6-Pin PCIE connector（”550mm/150mm” X4） 8 x SATA connector（\"600mm /150mm / 150mm / 150mm\" X2） 6 x 4-Pin Peripheral connector（”600mm / 150mm / 150mm” X2） 2 x 4-Pin Floppy connector（”150mm” X2）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm HYB fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1200,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "1200 W",
        "ATX",
        "80 PLUS Platinum",
        "Single 120mm HYB fan"
      ],
      "manufacturerPartNumber": "SST-ST1200-PTS",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST1200-PTS de 1200 W. Caractéristiques et connectique publiées pour la référence SST-ST1200-PTS ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1200,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      }
    }
  },
  "import-psu-e38f0716d681": {
    "identityKind": "mpn",
    "mpn": "SST-DA850-G",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/DA850Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-DA850-G"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0850MCGD-A"
          },
          {
            "label": "Color",
            "value": "black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "850W"
          },
          {
            "label": "Power density",
            "value": "471W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 70.5A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | 3.0A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±3% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 30mV | 30mV | 40mV | 30mV | 40mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "110W"
          },
          {
            "label": "Combined +12V",
            "value": "846W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "87% ~ 90% (at 20% ~ 100% loading)"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector (600mm) 2 x 8 / 4-Pin EPS / ATX 12V connector (\"750mm\" x 2) 2 x 8 / 6-Pin PCIe connector (\"650mm / 150mm\" x 3) 8 x SATA connector (\"600mm / 150mm / 150mm / 150mm\" x 2) 6 x 4-Pin Peripheral connector + 2 x 4-Pin Floppy adapter connector (\"600mm / 150mm / 150mm / 150mm\" x 2)"
          },
          {
            "label": "Cooling System",
            "value": "Silent 120mm FDB fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.46 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 850,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "850 W",
        "ATX (PS2)",
        "80 PLUS Gold",
        "Silent 120mm FDB fan"
      ],
      "manufacturerPartNumber": "SST-DA850-G",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone DA850 Gold de 850 W. Caractéristiques et connectique publiées pour la référence SST-DA850-G ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 850,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA850Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA850Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA850Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA850Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA850Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA850Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA850Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      }
    }
  },
  "import-psu-a07f97aba753": {
    "identityKind": "mpn",
    "mpn": "SST-ST65F-PT",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST65F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST65F-PT"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "650W"
          },
          {
            "label": "Power density",
            "value": "360W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 22A | 22A | 54.2A | 3.0A | 0.3A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "650W"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz~63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "89%~92% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Under voltage protection Over temperature protection Short circuit protection"
          },
          {
            "label": "Connectors",
            "value": "V1.0 1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 4 x 8 / 6-Pin PCIE connector（\"550mm / 150mm\"x2） 8 x SATA connector（\"600mm / 150mm / 150mm /150mm\"x2） 6 x 4-Pin Peripheral connector（\"600mm / 150mm / 150mm\"x2） 2 x 4-Pin Floppy connector（\"600mm / 150mm / 150mm / 150mm\"x2） V1.1 1 x 24 / 20-Pin motherboard connector（550mm） *1 x 8-Pin EPS and 1 x 4-Pin + 4-Pin ATX 12V connector (750mm / 150mm) 4 x 8 / 6-Pin PCIE connector（\"550mm / 150mm\"x2） 8 x SATA connector（\"600mm / 150mm / 150mm /150mm\"x2） 6 x 4-Pin Peripheral connector（\"600mm / 150mm / 150mm\"x2） 2 x 4-Pin Floppy connector（\"600mm / 150mm / 150mm / 150mm\"x2）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "0 ~ 28 dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.18 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 650,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "650 W",
        "ATX",
        "80 PLUS Platinum",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST65F-PT",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST65F-PT de 650 W. Caractéristiques et connectique publiées pour la référence SST-ST65F-PT ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 650,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST65F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST65F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST65F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST65F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST65F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST65F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST65F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      }
    }
  },
  "import-psu-3e2243ef13d0": {
    "identityKind": "mpn",
    "mpn": "SST-ST55F-PT",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST55F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST55F-PT"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "550W"
          },
          {
            "label": "Power density",
            "value": "305W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 45.9A | 3.0A | 0.3A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "105W"
          },
          {
            "label": "Combined +12V",
            "value": "550W"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz~63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "89%~92% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Under voltage protection Over temperature protection Short circuit protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 2 x 8 / 6-Pin PCIE connector（\"550mm\"x2） 8 x SATA connector（\"600mm / 150mm / 150mm /150mm\"x2） 6 x 4-Pin Peripheral connector（\"600mm / 150mm / 150mm\"x2） 2 x 4-Pin Floppy connector（\"600mm / 150mm / 150mm / 150mm\"x2）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "0 ~ 28 dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.15 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 550,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "550 W",
        "ATX",
        "80 PLUS Platinum",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST55F-PT",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST55F-PT de 550 W. Caractéristiques et connectique publiées pour la référence SST-ST55F-PT ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 550,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST55F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST55F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST55F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST55F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST55F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST55F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST55F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      }
    }
  },
  "import-psu-bb7094968cf5": {
    "identityKind": "mpn",
    "mpn": "SST-HA1300R-PM",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1300r-pm/",
        "checkedAt": "2026-11-10T14:51:56.278Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-HA1300R-PM"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX1300MCPT-A"
          },
          {
            "label": "Color",
            "value": "Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "1300W"
          },
          {
            "label": "Power density",
            "value": "720W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 24A | 24A | 108.3A | 3.0A | 0.5A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | +5/-7% | ±5% | ±5% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 40mV | 40mV | 80mV | 40mV | 80mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "1300W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "≥89% & <91% overall efficiency"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over Current Protection Over Power Protection Over Voltage Protection Over Temperature Protection Short Circuit Protection Under Voltage Protection No load operation"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 4-Pin + 4-Pin ATX 12V connector 1 x 12+4-Pin 12VHPWR connector 8 x 8 / 6-Pin PCIe connectors 8 x SATA connectors 6 x 4-Pin Peripheral connectors 2 x 4-Pin Floppy connectors"
          },
          {
            "label": "Cooling System",
            "value": "Silent 120mm FDB fan"
          },
          {
            "label": "Noise Level",
            "value": "0 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "Cybenetics Platinum"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) x 86mm (H) x 140mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.93 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1300,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "1300 W",
        "ATX (PS2)",
        "Cybenetics Platinum",
        "Silent 120mm FDB fan"
      ],
      "name": "HELA 1300R · 1300 W · ATX · Cybenetics Platinum · Entièrement modulaire · Noir",
      "manufacturerPartNumber": "SST-HA1300R-PM",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone HELA 1300R Platinum de 1300 W. Caractéristiques et connectique publiées pour la référence SST-HA1300R-PM ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1300,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1300r-pm/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1300r-pm/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1300r-pm/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1300r-pm/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1300r-pm/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1300r-pm/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ha1300r-pm/",
        "checkedAt": "2026-11-10T14:51:56.278Z"
      }
    }
  },
  "import-psu-3e028fbfe583": {
    "identityKind": "mpn",
    "mpn": "SST-ST1000-PTS",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST1000-PTS"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "1000W"
          },
          {
            "label": "Power density",
            "value": "554W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 25A | 22A | 83A | 3A | 0.3A | | Min.(Amps) | 0A | 0A | 0.15A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "996W"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz~63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "89%~92% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over power protection Over current protection Over voltage protection Over Temperature protection Under voltage protection Short circuit protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（”600mm”） 1 x 8 / 4-Pin EPS / ATX 12V connector（”550mm”） 1 x 8 / 4-Pin EPS / ATX 12V connector（”750mm”） 8 x 8 / 6-Pin PCIE connector（”550mm/150mm” X4） 8 x SATA connector（\"600mm /150mm / 150mm / 150mm\" X2） 6 x 4-Pin Peripheral connector（”600mm / 150mm / 150mm” X2） 2 x 4-Pin Floppy connector（”150mm” X2）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm HYB fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.98kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1000,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "1000 W",
        "ATX",
        "80 PLUS Platinum",
        "Single 120mm HYB fan"
      ],
      "manufacturerPartNumber": "SST-ST1000-PTS",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST1000-PTS de 1000 W. Caractéristiques et connectique publiées pour la référence SST-ST1000-PTS ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1000,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PTS/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      }
    }
  },
  "import-psu-270b332ce13f": {
    "identityKind": "mpn",
    "mpn": "SST-ET550-HG",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ET550-HG"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "550W"
          },
          {
            "label": "Power density",
            "value": "267W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 45A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | 3.0A | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "110W"
          },
          {
            "label": "Combined +12V",
            "value": "540W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "87% ~ 90% at 20% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection"
          },
          {
            "label": "Connectors",
            "value": "V1.1 1 x 24 / 20-Pin motherboard connector (500mm) 1 x 8 / 4-Pin EPS / ATX 12V connector (750mm) 2 x 8 / 6-Pin PCIe connector (500mm / 150mm) 8 x SATA connector (\"500mm / 150mm / 150mm\" x 2) 3 x 4-Pin Peripheral connector (500mm / 150mm / 150mm) 1 x 4-Pin Floppy connector (500mm / 150mm / 150mm / 150mm) V1.2 1 x 24 / 20-Pin motherboard connector (500mm) *1 x 8-Pin EPS and 1 x 4-Pin + 4-Pin ATX 12V connector (750mm / 150mm) 2 x 8 / 6-Pin PCIe connector (500mm / 150mm) 8 x SATA connector (\"500mm / 150mm / 150mm / 150mm\" x 2) 3 x 4-Pin Peripheral connector (500mm / 150mm / 150mm) 1 x 4-Pin Floppy connector (500mm / 150mm / 150mm / 150mm)"
          },
          {
            "label": "Cooling System",
            "value": "Single 140mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 160 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.93 Kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 550,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 160.0,
      "fanCount": 1,
      "fanSizeMm": 140,
      "psuFormat": "ATX",
      "specs": [
        "550 W",
        "ATX",
        "80 PLUS Gold",
        "Single 140mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ET550-HG",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ET550-HG de 550 W. Caractéristiques et connectique publiées pour la référence SST-ET550-HG ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 550,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "depthMm": {
        "value": 160.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "fanSizeMm": {
        "value": 140,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET550-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      }
    }
  },
  "import-psu-e2108c17ed1b": {
    "identityKind": "mpn",
    "mpn": "SST-TR850R-GF",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/tr850r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-TR850R-GF"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0850FCGD-A"
          },
          {
            "label": "Color",
            "value": "Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "850W"
          },
          {
            "label": "Power density",
            "value": "470.7 W/L"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 18A | 18A | 70.8A | 3.0A | 0.3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "850W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "87% ~ 89% overall efficiency"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over power protection Over current protection Over voltage protection Short circuit protection Under voltage protection Over Temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 8 / 4-Pin EPS / ATX 12V connector 1 x 12+4-Pin 12V-2x6 connector 5 x 8 / 6-Pin PCIe connector 6 x SATA connector 2 x 4-Pin Peripheral connector"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm ICB bearing fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA min."
          },
          {
            "label": "Certification",
            "value": "Cybenetics Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) x 86mm (H) x 140mm (D) 5.91\" (W) x 3.39\" (H) x 5.51\" (D)"
          },
          {
            "label": "Weight",
            "value": "1.56 kg | Describe | Version | File Size | Download | | --- | --- | --- | --- | | Describe Triton 850Rx High resolution photos | Version | File Size 3.56 MB | Download | | Describe Triton 850Rx Manual | Version | File Size 695.57 KB | Download | | Describe Restricted substance declaration | Version V1.0 | File Size 391.02 KB | Download | | Describe Multilanguage installation Manual | Version V1.0 | File Size 21.56 MB | Download | | Describe Warranty Information | Version | File Size | Download | | Describe Product Sheet | Version | File Size 833.26 KB | Download | # HELA 750R Platinum"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 850,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "850 W",
        "ATX (PS2)",
        "Cybenetics Gold",
        "Single 120mm ICB bearing fan"
      ],
      "manufacturerPartNumber": "SST-TR850R-GF",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone Triton 850Rx de 850 W. Caractéristiques et connectique publiées pour la référence SST-TR850R-GF ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 850,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr850r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr850r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr850r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr850r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr850r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr850r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr850r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      }
    }
  },
  "import-psu-f0fdc79ea33d": {
    "identityKind": "mpn",
    "mpn": "SST-ET750-HG",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ET750-HG"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "750W"
          },
          {
            "label": "Power density",
            "value": "363W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 22A | 22A | 62A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | 3.0A | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "744W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "87% ~ 90% at 20% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection"
          },
          {
            "label": "Connectors",
            "value": "V1.1 1 x 24 / 20-Pin motherboard connector (500mm) 1 x 8 / 4-Pin EPS / ATX 12V connector (750mm) 4 x 8 / 6-Pin PCIe connector (\"500mm / 150mm\" x 2) 9 x SATA connector (\"500mm / 150mm / 150mm\" x 3) 3 x 4-Pin Peripheral connector (500mm / 150mm / 150mm) 1 x 4-Pin Floppy connector (500mm / 150mm / 150mm / 150mm) V1.2 1 x 24 / 20-Pin motherboard connector (500mm) *1 x 8-Pin EPS and 1 x 4-Pin + 4-Pin ATX 12V connector (750mm / 150mm) 4 x 8 / 6-Pin PCIe connector (\"500mm / 150mm\" x 2) 9 x SATA connector (\"500mm / 150mm / 150mm\" x 3) 3 x 4-Pin Peripheral connector (500mm / 150mm / 150mm) 1 x 4-Pin Floppy connector (500mm / 150mm / 150mm / 150mm)"
          },
          {
            "label": "Cooling System",
            "value": "Single 140mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 160 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2 Kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 750,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 160.0,
      "fanCount": 1,
      "fanSizeMm": 140,
      "psuFormat": "ATX",
      "specs": [
        "750 W",
        "ATX",
        "80 PLUS Gold",
        "Single 140mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ET750-HG",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ET750-HG de 750 W. Caractéristiques et connectique publiées pour la référence SST-ET750-HG ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 750,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "depthMm": {
        "value": 160.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "fanSizeMm": {
        "value": 140,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      }
    }
  },
  "import-psu-2c57b4c1d06d": {
    "identityKind": "mpn",
    "mpn": "SST-ST1500",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500/",
        "checkedAt": "2026-11-10T14:54:35.599Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST1500"
          },
          {
            "label": "Color",
            "value": "Black （Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "1500W (Peak 1600W)"
          },
          {
            "label": "Power density",
            "value": "529W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +12V2 | +12V3 | +12V4 | +12V5 | +12V6 | +12V7 | +12V8 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 40A | 40A | 25A | 25A | 25A | 25A | 25A | 25A | 25A | 25A | 6.0A | 0.5A | | Peak (Amps) | / | / | 30A | 30A | 30A | 30A | 30A | 30A | 30A | 30A | 8.0A | / | | Min.(Amps) | 0.8A | 0.5A | 0.1A | 0.1A | 0.1A | 0.1A | 0.1A | 0.1A | 0.1A | 0.1A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±3% | ±3% | ±3% | ±3% | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 120m | 120m | 120m | 120m | 120m | 120m | 120m | 50mV | 120m |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "280W"
          },
          {
            "label": "Combined +12V",
            "value": "1320W/110A (Peak 120A)"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.95 at Full Load）"
          },
          {
            "label": "Efficiency",
            "value": "85%~88% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours at 25℃（at Full Load）"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Under voltage protection No Load Protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin Motherboard connector （550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector （750mm） 1 x 8-Pin EPS 12V connector （750mm） 4 x 8/6-Pin PCIE connector （550mm） 4 x 6-Pin PCIE connector （550mm / 150mm） 12 x SATA connector （500mm / 250mm / 250mm） 12 x 4-Pin Peripheral connector （500mm / 250mm / 250mm） 4 x 4-Pin Floppy connector （500mm / 250mm / 250mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Silent 135mm fan"
          },
          {
            "label": "Noise Level",
            "value": "19dBA-34dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Silver"
          },
          {
            "label": "Form factor",
            "value": "ATX PS/2"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 220 mm (D)"
          },
          {
            "label": "Weight",
            "value": "4.2Kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1500,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 220.0,
      "fanCount": 1,
      "fanSizeMm": 135,
      "psuFormat": "ATX",
      "specs": [
        "1500 W",
        "ATX PS/2",
        "80 PLUS Silver",
        "Silent 135mm fan"
      ],
      "manufacturerPartNumber": "SST-ST1500",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST1500 de 1500 W. Caractéristiques et connectique publiées pour la référence SST-ST1500 ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1500,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      },
      "depthMm": {
        "value": 220.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      },
      "fanSizeMm": {
        "value": 135,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500/",
        "checkedAt": "2026-11-10T14:54:35.599Z"
      }
    }
  },
  "import-psu-372b4ac08b9e": {
    "identityKind": "mpn",
    "mpn": "SST-TR1000R-GM",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-TR1000R-GM"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX1000MCGD-C"
          },
          {
            "label": "Color",
            "value": "Black (lead-free paint) White (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "1000W"
          },
          {
            "label": "Power density",
            "value": "553.7W/L"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 83.3A | 3.0A | 0.3A | | Peak (Amps) | / | / | / | / | 3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±3% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 30mV | 30mV | 40mV | 30mV | 50mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "110W"
          },
          {
            "label": "Combined +12V",
            "value": "1000W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "≥87% to <89% overall efficiency"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over power protection Over current protection Over voltage protection Short circuit protection Over Temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 8 / 4-Pin EPS / ATX 12V connector 1 x 12+4-Pin 12V-2x6 connector 4 x 8 / 6-Pin PCIe connector 8 x SATA connector 4 x 4-Pin Peripheral connector"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm FDB fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA min."
          },
          {
            "label": "Certification",
            "value": "Cybenetics Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) x 86mm (H) x 140mm (D) 5.91\" (W) x 3.39\" (H) x 5.51\" (D)"
          },
          {
            "label": "Weight",
            "value": "2.7 kg ● This PSU’s motherboard connector includes a 4pin sense wire that needs to be connected to the PSU’s modular interface as shown. Sense wire helps improve PSU’s regulation performance by around 1%-2%. | Describe | Version | File Size | Download | | --- | --- | --- | --- | | Describe Triton 1000Rz High resolution photos | Version | File Size 8.48 MB | Download | | Describe Triton 1000Rz Manual | Version | File Size 495.68 KB | Download | | Describe Restricted substance declaration | Version V1.0 | File Size 391.02 KB | Download | | Describe Multilanguage installation Manual | Version V1.0 | File Size 21.56 MB | Download | | Describe Warranty Information | Version | File Size | Download | | Describe Product Sheet | Version | File Size 1.06 MB | Download | # HELA 1200Rz Axis"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1000,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "1000 W",
        "ATX (PS2)",
        "Cybenetics Gold",
        "Single 120mm FDB fan"
      ],
      "manufacturerPartNumber": "SST-TR1000R-GM",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone Triton 1000Rz de 1000 W. Caractéristiques et connectique publiées pour la référence SST-TR1000R-GM ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires.",
      "La page fabricant publie côte à côte les finitions noire et blanche ; la référence suffixée WWW/WBW est conservée pour la finition blanche explicite."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1000,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      }
    }
  },
  "import-psu-1de0b3264eee": {
    "identityKind": "mpn",
    "mpn": "SST-DA750-G",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/DA750Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-DA750-G"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0750MCGD-A"
          },
          {
            "label": "Color",
            "value": "black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "750W"
          },
          {
            "label": "Power density",
            "value": "415W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 62A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | 3.0A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±3% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 30mV | 30mV | 40mV | 30mV | 40mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "110W"
          },
          {
            "label": "Combined +12V",
            "value": "744W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "87% ~ 90% (at 20% ~ 100% loading)"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector (600mm) 2 x 8 / 4-Pin EPS / ATX 12V connector (\"750mm\" x 2) 2 x 8 / 6-Pin PCIe connector (\"650mm\" x 2) 2 x 8 / 6-Pin PCIe connector (\"650mm / 150mm\") 8 x SATA connector (\"600mm / 150mm / 150mm / 150mm\" x 2) 6 x 4-Pin Peripheral connector + 2 x 4-Pin Floppy adapter connector (\"600mm / 150mm / 150mm / 150mm\" x 2)"
          },
          {
            "label": "Cooling System",
            "value": "Silent 120mm FDB fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) x 86mm (H) x 140mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.44 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 750,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "750 W",
        "ATX (PS2)",
        "80 PLUS Gold",
        "Silent 120mm FDB fan"
      ],
      "manufacturerPartNumber": "SST-DA750-G",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone DA750 Gold de 750 W. Caractéristiques et connectique publiées pour la référence SST-DA750-G ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 750,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA750Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA750Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA750Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA750Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA750Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA750Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA750Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      }
    }
  },
  "import-psu-96537065a044": {
    "identityKind": "mpn",
    "mpn": "SST-ET650-B",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ET650-B"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "650W"
          },
          {
            "label": "Power density",
            "value": "360W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 17A | 50A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | 3.0A | / | | Min.(Amps) | 0.1A | 0.2A | 0.5A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "600W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "82% ~ 85% @ 20% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "V1.1 1 x 24 / 20-Pin motherboard connector（500mm） 1 x 8 / 4-Pin EPS / ATX 12V connector (750mm) 4 x 8 / 6-Pin PCIE connector（\"500mm / 150mm\" x 2） 6 x SATA connector（\"500mm / 150mm / 150mm\" x 2） 3 x 4-Pin Peripheral connector（500mm / 150mm / 150mm） 1 x 4-Pin Floppy connector（500mm / 150mm / 150mm / 150mm） V1.4 1 x 24 / 20-Pin motherboard connector（500mm） *1 x 8-Pin EPS and 1 x 4-Pin + 4-Pin ATX 12V connector (750mm / 150mm) 4 x 8 / 6-Pin PCIE connector（\"500mm / 150mm\" x 2） 6 x SATA connector（\"500mm / 150mm / 150mm\" x 2） 3 x 4-Pin Peripheral connector（500mm / 150mm / 150mm） 1 x 4-Pin Floppy connector（500mm / 150mm / 150mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.59 Kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 650,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "650 W",
        "ATX",
        "80 PLUS Bronze",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ET650-B",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ET650-B de 650 W. Caractéristiques et connectique publiées pour la référence SST-ET650-B ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 650,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      }
    }
  },
  "import-psu-bc28032fc10e": {
    "identityKind": "mpn",
    "mpn": "SST-ST75F-PT",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST75F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST75F-PT"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "750W"
          },
          {
            "label": "Power density",
            "value": "415W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 22A | 22A | 62.5A | 3.0A | 0.3A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "750W"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz~63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "89%~92% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Under voltage protection Over temperature protection Short circuit protection"
          },
          {
            "label": "Connectors",
            "value": "V1.0 1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 4 x 8 / 6-Pin PCIE connector（\"550mm / 150mm\"x2） 8 x SATA connector（\"600mm / 150mm / 150mm /150mm\"x2） 6 x 4-Pin Peripheral connector（\"600mm / 150mm / 150mm\"x2） 2 x 4-Pin Floppy connector（\"600mm / 150mm / 150mm / 150mm\"x2） V1.1 1 x 24 / 20-Pin motherboard connector（550mm） *1 x 8-Pin EPS and 1 x 4-Pin + 4-Pin ATX 12V connector (750mm / 150mm) 4 x 8 / 6-Pin PCIE connector（\"550mm / 150mm\"x2） 8 x SATA connector（\"600mm / 150mm / 150mm /150mm\"x2） 6 x 4-Pin Peripheral connector（\"600mm / 150mm / 150mm\"x2） 2 x 4-Pin Floppy connector（\"600mm / 150mm / 150mm / 150mm\"x2）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "0 ~ 28 dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.25 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 750,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "750 W",
        "ATX",
        "80 PLUS Platinum",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST75F-PT",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST75F-PT de 750 W. Caractéristiques et connectique publiées pour la référence SST-ST75F-PT ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 750,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST75F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST75F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST75F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST75F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST75F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST75F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST75F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      }
    }
  },
  "import-psu-4883cb46cd8a": {
    "identityKind": "mpn",
    "mpn": "SST-ET750-G",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-G/",
        "checkedAt": "2026-11-10T14:54:35.488Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ET750-G"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "750W"
          },
          {
            "label": "Power density",
            "value": "415W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 22A | 22A | 62A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | 3.0A | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "744W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "87% ~ 90% at 20% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "V1.1 1 x 24 / 20-Pin motherboard connector (500mm) 1 x 8 / 4-Pin EPS / ATX 12V connector (750mm) 4 x 8 / 6-Pin PCIe connector (\"500mm / 150mm\" x 2) 8 x SATA connector (\"500mm / 150mm / 150mm / 150mm\" x 2) 3 x 4-Pin Peripheral connector (500mm / 150mm / 150mm) 1 x 4-Pin Floppy connector (500mm / 150mm / 150mm / 150mm) V1.2 1 x 24 / 20-Pin motherboard connector (500mm) *1 x 8-Pin EPS and 1 x 4-Pin + 4-Pin ATX 12V connector (750mm / 150mm) 4 x 8 / 6-Pin PCIe connector (\"500mm / 150mm\" x 2) 8 x SATA connector (\"500mm / 150mm / 150mm / 150mm\" x 2) 3 x 4-Pin Peripheral connector (500mm / 150mm / 150mm) 1 x 4-Pin Floppy connector (500mm / 150mm / 150mm / 150mm)"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.68 Kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 750,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "750 W",
        "ATX",
        "80 PLUS Gold",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ET750-G",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ET750-G de 750 W. Caractéristiques et connectique publiées pour la référence SST-ET750-G ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 750,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-G/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-G/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-G/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-G/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-G/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-G/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-G/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      }
    }
  },
  "import-psu-d881943c7ae0": {
    "identityKind": "mpn",
    "mpn": "SST-TR750R-GF",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/tr750r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-TR750R-GF"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0750FCGD-A"
          },
          {
            "label": "Color",
            "value": "Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "750W"
          },
          {
            "label": "Power density",
            "value": "415.3W/L"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 18A | 18A | 62.5A | 3.0A | 0.3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "750W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "87% ~ 89% overall efficiency"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over power protection Over current protection Over voltage protection Short circuit protection Under voltage protection Over Temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 8 / 4-Pin EPS / ATX 12V connector 1 x 12+4-Pin 12V-2x6 connector 3 x 8 / 6-Pin PCIe connector 6 x SATA connector 2 x 4-Pin Peripheral connector"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm ICB bearing fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA min."
          },
          {
            "label": "Certification",
            "value": "Cybenetics Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) x 86mm (H) x 140mm (D) 5.91\" (W) x 3.39\" (H) x 5.51\" (D)"
          },
          {
            "label": "Weight",
            "value": "1.56 kg | Describe | Version | File Size | Download | | --- | --- | --- | --- | | Describe Triton 750Rx High resolution photos | Version | File Size 3.56 MB | Download | | Describe Triton 750Rx Manual | Version | File Size 695.57 KB | Download | | Describe Restricted substance declaration | Version V1.0 | File Size 391.02 KB | Download | | Describe Multilanguage installation Manual | Version V1.0 | File Size 21.56 MB | Download | | Describe Warranty Information | Version | File Size | Download | | Describe Product Sheet | Version | File Size 832.08 KB | Download | # Triton 1000Rz"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 750,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "750 W",
        "ATX (PS2)",
        "Cybenetics Gold",
        "Single 120mm ICB bearing fan"
      ],
      "manufacturerPartNumber": "SST-TR750R-GF",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone Triton 750Rx de 750 W. Caractéristiques et connectique publiées pour la référence SST-TR750R-GF ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 750,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr750r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr750r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr750r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr750r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr750r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr750r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr750r_gf/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      }
    }
  },
  "import-psu-b88a85c279cd": {
    "identityKind": "mpn",
    "mpn": "SST-ST1100-TI",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1100-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST1100-TI"
          },
          {
            "label": "Color",
            "value": "Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "1100W (Peak 1200W)"
          },
          {
            "label": "Power density",
            "value": "474W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +12V2 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 25A | 22A | 92A | / | 3.0A | 0.3A | | Peak (Amps) | / | / | / | / | / | / | | Min.(Amps) | 0A | 0A | 0.15A | / | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | / | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | / | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | / | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "1100W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "90% ~ 94% at 10% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Under voltage protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector (550mm) 1 x 8 / 4-Pin EPS / ATX 12V connector (750mm) 1 x 8 / 4-Pin EPS / ATX 12V connector (550mm) 8 x 8 / 6-Pin PCIE connector (\"550mm\" x 8) 16 x SATA connector (\"600mm / 150mm / 150mm / 150mm\" x 4) 6 x 4-Pin Peripheral connector (\"600mm / 150mm / 150mm\" x 2) 1 x 4-Pin Floppy adapter connector (100mm)"
          },
          {
            "label": "Cooling System",
            "value": "Single 135mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "0 ~ 36 dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Titanium"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 180 mm (D)"
          },
          {
            "label": "Weight",
            "value": "3.96 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1100,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 180.0,
      "fanCount": 1,
      "fanSizeMm": 135,
      "psuFormat": "ATX",
      "specs": [
        "1100 W",
        "ATX",
        "80 PLUS Titanium",
        "Single 135mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST1100-TI",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST1100-TI de 1100 W. Caractéristiques et connectique publiées pour la référence SST-ST1100-TI ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1100,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1100-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1100-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1100-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "depthMm": {
        "value": 180.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1100-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1100-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "fanSizeMm": {
        "value": 135,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1100-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1100-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      }
    }
  },
  "import-psu-c2cc7c675492": {
    "identityKind": "mpn",
    "mpn": "SST-DA550-G",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/DA550Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-DA550-G"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0550MCGD-A"
          },
          {
            "label": "Color",
            "value": "black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "550W"
          },
          {
            "label": "Power density",
            "value": "305W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 45.5A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | 3.0A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±3% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 30mV | 30mV | 40mV | 30mV | 40mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "546W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "87% ~ 90% (at 20% ~ 100% loading)"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector (600mm) 2 x 8 / 4-Pin EPS / ATX 12V connector (\"750mm\" x 2) 2 x 8 / 6-Pin PCIe connector (\"650mm\" x 2) 8 x SATA connector (\"600mm / 150mm / 150mm / 150mm\" x 2) 3 x 4-Pin Peripheral connector + 1 x 4-Pin Floppy adapter connector (600mm / 150mm / 150mm / 150mm)"
          },
          {
            "label": "Cooling System",
            "value": "Silent 120mm FDB fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) x 86mm (H) x 140mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.37 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 550,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "550 W",
        "ATX (PS2)",
        "80 PLUS Gold",
        "Silent 120mm FDB fan"
      ],
      "manufacturerPartNumber": "SST-DA550-G",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone DA550 Gold de 550 W. Caractéristiques et connectique publiées pour la référence SST-DA550-G ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 550,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA550Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA550Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA550Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA550Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA550Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA550Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/DA550Gold/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      }
    }
  },
  "import-psu-e49f529b3cfd": {
    "identityKind": "mpn",
    "mpn": "SST-ST80F-TI",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST80F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST80F-TI"
          },
          {
            "label": "Color",
            "value": "black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "800W (Peak 850W)"
          },
          {
            "label": "Power density",
            "value": "413W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +12V2 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 22A | 22A | 66A | / | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | / | / | | Min.(Amps) | 0.1A | 0.2A | 0.15A | / | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | / | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | / | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | / | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "792W"
          },
          {
            "label": "Input Voltage",
            "value": "90V ~ 264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "90% ~ 94% at 10% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Under voltage protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（550mm） 4 x 8 / 6-Pin PCIE connector（\"550mm\" x 4） 12 x SATA connector（\"600mm / 150mm / 150mm / 150mm\" x 3） 3 x 4-Pin Peripheral connector（600mm / 150mm / 150mm） 1 x 4-Pin Floppy adapter connector （100mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Titanium"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 150 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.7 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 800,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 150.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "800 W",
        "ATX",
        "80 PLUS Titanium",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST80F-TI",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST80F-TI de 800 W. Caractéristiques et connectique publiées pour la référence SST-ST80F-TI ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 800,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST80F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST80F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST80F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      },
      "depthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST80F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST80F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST80F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST80F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      }
    }
  },
  "import-psu-b8a03037e91e": {
    "identityKind": "mpn",
    "mpn": "SST-ST70F-TI",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-TI/",
        "checkedAt": "2026-11-10T14:54:35.447Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST70F-TI"
          },
          {
            "label": "Color",
            "value": "black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "700W (Peak 750W)"
          },
          {
            "label": "Power density",
            "value": "362W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +12V2 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 22A | 22A | 58A | / | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | / | / | | Min.(Amps) | 0.1A | 0.2A | 0.15A | / | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | / | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | / | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | / | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "696W"
          },
          {
            "label": "Input Voltage",
            "value": "90V ~ 264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "90% ~ 94% at 10% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Under voltage protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（550mm） 4 x 8 / 6-Pin PCIE connector（\"550mm\" x 4） 12 x SATA connector（\"600mm / 150mm / 150mm / 150mm\" x 3） 3 x 4-Pin Peripheral connector（600mm / 150mm / 150mm） 1 x 4-Pin Floppy adapter connector （100mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Titanium"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 150 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.7 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 700,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 150.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "700 W",
        "ATX",
        "80 PLUS Titanium",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST70F-TI",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST70F-TI de 700 W. Caractéristiques et connectique publiées pour la référence SST-ST70F-TI ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 700,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-TI/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-TI/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-TI/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "depthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-TI/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-TI/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-TI/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST70F-TI/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      }
    }
  },
  "import-psu-9bb7ee1026b4": {
    "identityKind": "mpn",
    "mpn": "SST-NJ700",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/NJ700/",
        "checkedAt": "2026-11-10T14:54:36.556Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-NJ700"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-NJ700"
          },
          {
            "label": "Color",
            "value": "Silver （Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "700W"
          },
          {
            "label": "Power density",
            "value": "319W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 58A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±2% | ±2% | ±2% | ±2% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 35mV | 35mV | 40mV | 35mV | 60mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "696W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC （PF>0.95 at Full Load）"
          },
          {
            "label": "Efficiency",
            "value": "90%~94% @ 10% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 45°C"
          },
          {
            "label": "Protection",
            "value": "Over Current Protection Over Power Protection Over Voltage Protection Over Temperature Protection Short Circuit Protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（610mm） 2 x 8 / 4-Pin EPS / ATX 12V connector（\"650mm\" x 2） 4 x 8 / 6-Pin PCIE connector（\"750mm\" x 4 ） 12 x SATA connector（\"450mm / 120mm / 120mm / 120mm\" x 3） 6 x 4-Pin Peripheral connector （\"450mm / 120mm / 120mm\" x 2） 1 x 4-Pin Floppy connector（100mm） ※ N700 is not compatible with PP05-E and PP06 cables."
          },
          {
            "label": "Cooling System",
            "value": "Fan-less thermal solution"
          },
          {
            "label": "Noise Level",
            "value": "0 dBA"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 170 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.3 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 700,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 170.0,
      "fanCount": 0,
      "psuFormat": "ATX",
      "specs": [
        "700 W",
        "ATX",
        "Fan-less thermal solution"
      ],
      "manufacturerPartNumber": "SST-NJ700",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone NJ700 de 700 W. Caractéristiques et connectique publiées pour la référence SST-NJ700 ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 700,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/NJ700/",
        "checkedAt": "2026-11-10T14:54:36.556Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/NJ700/",
        "checkedAt": "2026-11-10T14:54:36.556Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/NJ700/",
        "checkedAt": "2026-11-10T14:54:36.556Z"
      },
      "depthMm": {
        "value": 170.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/NJ700/",
        "checkedAt": "2026-11-10T14:54:36.556Z"
      },
      "fanCount": {
        "value": 0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/NJ700/",
        "checkedAt": "2026-11-10T14:54:36.556Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/NJ700/",
        "checkedAt": "2026-11-10T14:54:36.556Z"
      }
    }
  },
  "import-psu-f926e96cee45": {
    "identityKind": "mpn",
    "mpn": "SST-DA1000R-GM-WWW",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r_gm_www/",
        "checkedAt": "2026-11-10T15:15:43.747Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-DA1000R-GM-WWW"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX1000MCGD-A"
          },
          {
            "label": "Color",
            "value": "White (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "1000W"
          },
          {
            "label": "Power density",
            "value": "517W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 22A | 22A | 83.5A | 3A | 0.3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | +5/-7% | ±5% | ±5% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 30mV | 30mV | 70mV | 40mV | 40mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "1000W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "≥87% & <89% overall efficiency"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over Current Protection Over Power Protection Over Voltage Protection Short Circuit Protection Under Voltage Protection Over Temperature Protection No load operation"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 8 / 4-Pin EPS / ATX 12V connector 6 x 8 / 6-Pin PCIe connectors 1 x 12+4-Pin 12V-2x6 connector 12 x SATA connectors 3 x 4-Pin Peripheral connector 1 x 4-Pin Floppy connector"
          },
          {
            "label": "Cooling System",
            "value": "Silent 135mm FDB fan"
          },
          {
            "label": "Noise Level",
            "value": "0 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "Cybenetics Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) × 86mm (H) × 150mm (D) 5.91\" (W) x 3.39\" (H) x 5.91\" (D)"
          },
          {
            "label": "Weight",
            "value": "2.88 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1000,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 150.0,
      "fanCount": 1,
      "fanSizeMm": 135,
      "psuFormat": "ATX",
      "specs": [
        "1000 W",
        "ATX (PS2)",
        "Cybenetics Gold",
        "Silent 135mm FDB fan"
      ],
      "name": "DA1000R · 1000 W · ATX · Cybenetics Gold · Entièrement modulaire · Blanc",
      "manufacturerPartNumber": "SST-DA1000R-GM-WWW",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone DA1000R Gold de 1000 W. Caractéristiques et connectique publiées pour la référence SST-DA1000R-GM-WWW ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1000,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r_gm_www/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r_gm_www/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r_gm_www/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "depthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r_gm_www/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r_gm_www/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "fanSizeMm": {
        "value": 135,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r_gm_www/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da1000r_gm_www/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      }
    }
  },
  "import-psu-6cf20a764608": {
    "identityKind": "mpn",
    "mpn": "SST-ST50F-ESB",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST50F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST50F-ESB"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "500W"
          },
          {
            "label": "Power density",
            "value": "277W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 18A | 16A | 38A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0.1A | 0.2A | 0.5A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "110W"
          },
          {
            "label": "Combined +12V",
            "value": "456W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at Full Load）"
          },
          {
            "label": "Efficiency",
            "value": "82%~85% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "V2.1 1 x 24 / 20-Pin motherboard connector（500mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 1 x 8 / 6-Pin PCIE connector（500mm） 1 x 6-Pin PCIE connector（500mm / 150mm） 6 x SATA connector（\"500mm / 150mm / 150mm\" x 2） 3 x 4-Pin Peripheral connector （500mm / 150mm / 150mm） 1 x 4-Pin Floppy connector（500mm / 150mm / 150mm / 150mm） V2.2 1 x 24 / 20-Pin motherboard connector（500mm） *2 x 8 / 4-Pin EPS / ATX 12V connector（\"750mm\" x 2） 1 x 8 / 6-Pin PCIE connector（500mm） 1 x 6-Pin PCIE connector（500mm / 150mm） 6 x SATA connector（\"500mm / 150mm / 150mm\" x 2） 3 x 4-Pin Peripheral connector （500mm / 150mm / 150mm） 1 x 4-Pin Floppy connector（500mm / 150mm / 150mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.99kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 500,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "500 W",
        "ATX",
        "80 PLUS Bronze",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST50F-ESB",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST50F-ESB de 500 W. Caractéristiques et connectique publiées pour la référence SST-ST50F-ESB ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 500,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST50F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST50F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST50F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST50F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST50F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST50F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST50F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      }
    }
  },
  "import-psu-a8d683481dcd": {
    "identityKind": "mpn",
    "mpn": "SST-ST60F-TI",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST60F-TI"
          },
          {
            "label": "Color",
            "value": "black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "600W (Peak 650W)"
          },
          {
            "label": "Power density",
            "value": "300W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +12V2 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 49A | / | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | / | / | | Min.(Amps) | 0.1A | 0.2A | 0.15A | / | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | / | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | / | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | / | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "588W"
          },
          {
            "label": "Input Voltage",
            "value": "90V ~ 264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "90% ~ 94% at 10% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Under voltage protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 2 x 8 / 6-Pin PCIE connector（\"550mm\" x 2） 2 x 6-Pin PCIE connector（\"550mm\" x 2） 8 x SATA connector（\"600mm / 150mm / 150mm / 150mm\" x 2） 3 x 4-Pin Peripheral connector（600mm / 150mm / 150mm） 1 x 4-Pin Floppy adapter connector（100mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Titanium"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 150 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.7 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 600,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 150.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "600 W",
        "ATX",
        "80 PLUS Titanium",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST60F-TI",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST60F-TI de 600 W. Caractéristiques et connectique publiées pour la référence SST-ST60F-TI ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 600,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      },
      "depthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-TI/",
        "checkedAt": "2026-11-10T14:53:27.240Z"
      }
    }
  },
  "import-psu-1adc44d7495f": {
    "identityKind": "mpn",
    "mpn": "SST-ST1200-PT",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST1200-PT"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "1200W (Peak 1250W)"
          },
          {
            "label": "Power density",
            "value": "517W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 25A | 22A | 100A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0.1A | 0.2A | 0.15A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "1200W"
          },
          {
            "label": "Input Voltage",
            "value": "105V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz~63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "89%~92% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Under voltage protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（550mm） 8 x 8 / 6-Pin PCIE connector（\"550mm\" x 8） 16 x SATA connector（\"600mm / 150mm / 150mm / 150mm\" x 4） 6 x 4-Pin Peripheral connector（\"600mm / 150mm / 150mm\" x 2） 2 x 4-Pin Floppy connector（\"600mm / 150mm / 150mm / 150mm\" x 2）"
          },
          {
            "label": "Cooling System",
            "value": "Single 139mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "0 ~ 36 dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 180 mm (D)"
          },
          {
            "label": "Weight",
            "value": "3.3 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1200,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 180.0,
      "fanCount": 1,
      "fanSizeMm": 139,
      "psuFormat": "ATX",
      "specs": [
        "1200 W",
        "ATX",
        "80 PLUS Platinum",
        "Single 139mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST1200-PT",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST1200-PT de 1200 W. Caractéristiques et connectique publiées pour la référence SST-ST1200-PT ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1200,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "depthMm": {
        "value": 180.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanSizeMm": {
        "value": 139,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1200-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      }
    }
  },
  "import-psu-21233017d941": {
    "identityKind": "mpn",
    "mpn": "SST-ST75F-P",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST75F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST75F-P"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "750W(Peak 800W)"
          },
          {
            "label": "Power density",
            "value": "363W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 25A | 60A | 3.5A | 0.3A | | Peak (Amps) | / | / | 66A | / | / | | Min.(Amps) | 0A | 0.5A | 0.1A | 0.1A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "150W"
          },
          {
            "label": "Combined +12V",
            "value": "720W/60A（Peak 66A）"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz~63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.95 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "85%~88%（20% to 100% loading）"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours at 25°C, full load"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Under voltage protection Over temperature protection Short circuit protection No load protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（550mm） 2 x 8/6-Pin PCIE connector（550mm） 2 x 6-Pin PCIE connector（550mm） 6 x SATA connector（500mm / 250mm / 250mm） 6 x 4-Pin Peripheral connector （500mm / 250mm / 250mm） 2 x 4-Pin Floppy connector（500mm / 250mm / 250mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Silent 135mm fan"
          },
          {
            "label": "Noise Level",
            "value": "19dBA-36dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Silver"
          },
          {
            "label": "Form factor",
            "value": "ATX PS/2"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 160 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.8 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 750,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 160.0,
      "fanCount": 1,
      "fanSizeMm": 135,
      "psuFormat": "ATX",
      "specs": [
        "750 W",
        "ATX PS/2",
        "80 PLUS Silver",
        "Silent 135mm fan"
      ],
      "manufacturerPartNumber": "SST-ST75F-P",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST75F-P de 750 W. Caractéristiques et connectique publiées pour la référence SST-ST75F-P ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 750,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST75F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST75F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST75F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "depthMm": {
        "value": 160.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST75F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST75F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "fanSizeMm": {
        "value": 135,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST75F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST75F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      }
    }
  },
  "import-psu-c1d1c6c26484": {
    "identityKind": "mpn",
    "mpn": "SST-NJ520",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ520/",
        "checkedAt": "2026-11-10T14:53:27.310Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-NJ520"
          },
          {
            "label": "Color",
            "value": "Silver"
          },
          {
            "label": "Max. DC Output",
            "value": "520W"
          },
          {
            "label": "Power density",
            "value": "252W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 43A | 2.5A | 0.5A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±2% | ±2% | ±2% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±2% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "516W"
          },
          {
            "label": "Input Voltage",
            "value": "90V ~ 264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.99 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "89%~92% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Over temperature protection Short circuit protection No Load Situation"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（600mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（650mm） 4 x 8 / 6-Pin PCIE connector（550mm / 100mm） 4 x SATA connector（400mm / 120mm / 120mm / 120mm） 2 x SATA connector（300mm / 120mm） 3 x 4-Pin Peripheral connector （400mm / 120mm / 120mm） 2 x 4-Pin Peripheral connector （300mm / 120mm） 1 x 4-Pin Floppy connector（100mm） ※ NJ520 is not compatible with PP05, PP05-E and PP06 cables."
          },
          {
            "label": "Cooling System",
            "value": "Fan Less thermal solution"
          },
          {
            "label": "Noise Level",
            "value": "0 dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 160 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.3 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 520,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 160.0,
      "fanCount": 0,
      "psuFormat": "ATX",
      "specs": [
        "520 W",
        "ATX",
        "80 PLUS Platinum",
        "Fan Less thermal solution"
      ],
      "manufacturerPartNumber": "SST-NJ520",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone NJ520 de 520 W. Caractéristiques et connectique publiées pour la référence SST-NJ520 ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 520,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ520/",
        "checkedAt": "2026-11-10T14:53:27.310Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ520/",
        "checkedAt": "2026-11-10T14:53:27.310Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ520/",
        "checkedAt": "2026-11-10T14:53:27.310Z"
      },
      "depthMm": {
        "value": 160.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ520/",
        "checkedAt": "2026-11-10T14:53:27.310Z"
      },
      "fanCount": {
        "value": 0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ520/",
        "checkedAt": "2026-11-10T14:53:27.310Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ520/",
        "checkedAt": "2026-11-10T14:53:27.310Z"
      }
    }
  },
  "import-psu-1e7a2ecda908": {
    "identityKind": "mpn",
    "mpn": "SST-ST1500-TI",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST1500-TI"
          },
          {
            "label": "Color",
            "value": "Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "1500W (Peak 1600W)"
          },
          {
            "label": "Power density",
            "value": "646W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +12V2 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 25A | 22A | 125A | / | 3.0A | 0.3A | | Peak (Amps) | / | / | / | / | / | / | | Min.(Amps) | 0A | 0A | 0.15A | / | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | / | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | / | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | / | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "1500W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.9 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "90% ~ 94% at 10% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Under voltage protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector (550mm) 1 x 8 / 4-Pin EPS / ATX 12V connector (750mm) 1 x 8 / 4-Pin EPS / ATX 12V connector (550mm) 8 x 8 / 6-Pin PCIE connector (\"550mm\" x 8) 16 x SATA connector (\"600mm / 150mm / 150mm / 150mm\" x 4) 6 x 4-Pin Peripheral connector (\"600mm / 150mm / 150mm\" x 2) 1 x 4-Pin Floppy adapter connector (100mm)"
          },
          {
            "label": "Cooling System",
            "value": "Single 135mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "0 ~ 36 dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Titanium"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 180 mm (D)"
          },
          {
            "label": "Weight",
            "value": "3.96 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1500,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 180.0,
      "fanCount": 1,
      "fanSizeMm": 135,
      "psuFormat": "ATX",
      "specs": [
        "1500 W",
        "ATX",
        "80 PLUS Titanium",
        "Single 135mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST1500-TI",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST1500-TI de 1500 W. Caractéristiques et connectique publiées pour la référence SST-ST1500-TI ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1500,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "depthMm": {
        "value": 180.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "fanSizeMm": {
        "value": 135,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-TI/",
        "checkedAt": "2026-11-10T14:54:36.970Z"
      }
    }
  },
  "import-psu-f8dfb718edf7": {
    "identityKind": "mpn",
    "mpn": "SST-ST40F-ESB",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST40F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST40F-ESB"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "400W"
          },
          {
            "label": "Power density",
            "value": "221W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 16A | 16A | 30A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0.1A | 0.2A | 0.5A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "360W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at Full Load）"
          },
          {
            "label": "Efficiency",
            "value": "82%~85% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（500mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 2 x 6-Pin PCIE connector（500mm / 150mm） 6 x SATA connector（\"500mm / 150mm / 150mm\" x 2） 3 x 4-Pin Peripheral connector （500mm / 150mm / 150mm） 1 x 4-Pin Floppy connector（500mm / 150mm / 150mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.99kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 400,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "400 W",
        "ATX",
        "80 PLUS Bronze",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST40F-ESB",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST40F-ESB de 400 W. Caractéristiques et connectique publiées pour la référence SST-ST40F-ESB ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 400,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST40F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST40F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST40F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST40F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST40F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST40F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST40F-ESB/",
        "checkedAt": "2026-11-10T14:54:36.338Z"
      }
    }
  },
  "import-psu-e1a0b45f1644": {
    "identityKind": "mpn",
    "mpn": "SST-ET650-G",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ET650-G"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "650W"
          },
          {
            "label": "Power density",
            "value": "360W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 53A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | 3.0A | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "110W"
          },
          {
            "label": "Combined +12V",
            "value": "636W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "87% ~ 90% at 20% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "V1.1 1 x 24 / 20-Pin motherboard connector (500mm) 1 x 8 / 4-Pin EPS / ATX 12V connector (750mm) 4 x 8 / 6-Pin PCIe connector (\"500mm / 150mm\" x 2) 8 x SATA connector (\"500mm / 150mm / 150mm / 150mm\" x 2) 3 x 4-Pin Peripheral connector (500mm / 150mm / 150mm) 1 x 4-Pin Floppy connector (500mm / 150mm / 150mm / 150mm) V1.2 1 x 24 / 20-Pin motherboard connector (500mm) *1 x 8-Pin EPS and 1 x 4-Pin + 4-Pin ATX 12V connector (750mm / 150mm) 4 x 8 / 6-Pin PCIe connector (\"500mm / 150mm\" x 2) 8 x SATA connector (\"500mm / 150mm / 150mm / 150mm\" x 2) 3 x 4-Pin Peripheral connector (500mm / 150mm / 150mm) 1 x 4-Pin Floppy connector (500mm / 150mm / 150mm / 150mm)"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.64 Kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 650,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "650 W",
        "ATX",
        "80 PLUS Gold",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ET650-G",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ET650-G de 650 W. Caractéristiques et connectique publiées pour la référence SST-ET650-G ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 650,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-G/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      }
    }
  },
  "import-psu-520e6f7e819f": {
    "identityKind": "mpn",
    "mpn": "SST-ET750-B",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ET750-B"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "750W"
          },
          {
            "label": "Power density",
            "value": "415W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 22A | 22A | 62A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | 3.0A | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "744W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.96 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "82% ~ 85% @ 20% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "V1.0 1 x 24 / 20-Pin motherboard connector（500mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 4 x 8 / 6-Pin PCIE connector（\"500mm / 150mm\" x 2） 6 x SATA connector（\"500mm / 150mm / 150mm\" x 2） 3 x 4-Pin Peripheral connector（500mm / 150mm / 150mm） 1 x 4-Pin Floppy connector（500mm / 150mm / 150mm / 150mm） V1.1 1 x 24 / 20-Pin motherboard connector（500mm） *1 x 8-Pin EPS and 1 x 4-Pin + 4-Pin ATX 12V connector (750mm / 150mm) 4 x 8 / 6-Pin PCIE connector（\"500mm / 150mm\" x 2） 6 x SATA connector（\"500mm / 150mm / 150mm\" x 2） 3 x 4-Pin Peripheral connector（500mm / 150mm / 150mm） 1 x 4-Pin Floppy connector（500mm / 150mm / 150mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.67 Kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 750,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "750 W",
        "ATX",
        "80 PLUS Bronze",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ET750-B",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ET750-B de 750 W. Caractéristiques et connectique publiées pour la référence SST-ET750-B ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 750,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET750-B/",
        "checkedAt": "2026-11-10T14:54:37.152Z"
      }
    }
  },
  "import-psu-5cfe83db1c49": {
    "identityKind": "mpn",
    "mpn": "SST-NJ600",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ600/",
        "checkedAt": "2026-11-10T14:53:26.125Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-NJ600"
          },
          {
            "label": "Color",
            "value": "Silver"
          },
          {
            "label": "Max. DC Output",
            "value": "600W"
          },
          {
            "label": "Power density",
            "value": "274W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 50A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±2% | ±2% | ±2% | ±3% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 40mV | 45mV | 60mV | 40mV | 60mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "600W"
          },
          {
            "label": "Input Voltage",
            "value": "90V ~ 264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.95 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "90%~94% @ 10% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Over temperature protection Short circuit protection Under voltage protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（610mm） 2 x 8 / 4-Pin EPS / ATX 12V connector（650mm x 2） 4 x 8 / 6-Pin PCIE connector（675mm / 75mm x 2） 4 x SATA connector（450mm /120mm / 120mm /120mm） 2 x SATA connector（350mm / 120mm） 3 x 4-Pin Peripheral connector （450mm / 120mm /120mm） 2 x 4-Pin Peripheral connector （350mm / 120mm） 1 x 4-Pin Floppy connector（100mm） ※ NJ600 is not compatible with PP05-E and PP06 cables."
          },
          {
            "label": "Cooling System",
            "value": "Fan Less thermal solution"
          },
          {
            "label": "Noise Level",
            "value": "0 dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Titanium"
          },
          {
            "label": "Form factor",
            "value": "ATX / PS2"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 170 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.78 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 600,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 170.0,
      "fanCount": 0,
      "psuFormat": "ATX",
      "specs": [
        "600 W",
        "ATX / PS2",
        "80 PLUS Titanium",
        "Fan Less thermal solution"
      ],
      "manufacturerPartNumber": "SST-NJ600",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone NJ600 de 600 W. Caractéristiques et connectique publiées pour la référence SST-NJ600 ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 600,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ600/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ600/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ600/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "depthMm": {
        "value": 170.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ600/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "fanCount": {
        "value": 0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ600/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/NJ600/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      }
    }
  },
  "import-psu-fbd2d4ca7b22": {
    "identityKind": "mpn",
    "mpn": "SST-ST40NF",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST40NF/",
        "checkedAt": "2026-11-10T15:14:53.385Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — manuel Nightjar ST40NF",
        "url": "https://www.silverstonetek.com/upload/downloads/Manual/power/EN-ST40NF-Manual.pdf",
        "checkedAt": "2026-11-10T15:14:53.385Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST40NF"
          },
          {
            "label": "Color",
            "value": "Silver"
          },
          {
            "label": "Max. DC Output",
            "value": "400W"
          },
          {
            "label": "Power density",
            "value": "194W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 14A | 27A | 2.5A | 0.5A | | Peak (Amps) | / | / | 31.5A | 3.5A | / | | Min.(Amps) | 0A | 0A | 0.2A | 0A | 0A | | Range (%) | +/-3% | +/-3% | +/-3% | +/-5% | +/-10% | | Line Reg.(%) | +/-1% | +/-1% | +/-1% | +/-1% | +/-1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "130W Max"
          },
          {
            "label": "Combined +12V",
            "value": "324W(27A)"
          },
          {
            "label": "Input Voltage",
            "value": "99V ~ 264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.99 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "82%~86% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours at 25°C (at full load)"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection, Over power protection, Over voltage protection, Short circuit protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin Motherboard connector.（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector.（550mm） 1 x 6-Pin PCIE connector.（500mm / 150mm） 1 x 8 / 6-Pin PCIE connector.（500mm） 6 x SATA connector.（500mm / 150mm / 150mm） 6 x 4-Pin Peripheral connector.（500mm / 250mm / 150mm） 2 x 4-Pin Floppy connector.（500mm / 250mm / 150mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Fan Less thermal solution"
          },
          {
            "label": "Noise Level",
            "value": "0 dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Bronze"
          },
          {
            "label": "Form factor",
            "value": "ATX PS/2"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 160 mm (D)"
          },
          {
            "label": "Weight",
            "value": "3.0 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 400,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 160.0,
      "fanCount": 0,
      "psuFormat": "ATX",
      "specs": [
        "400 W",
        "ATX PS/2",
        "80 PLUS Bronze",
        "Fan Less thermal solution"
      ],
      "manufacturerPartNumber": "SST-ST40NF",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST40NF de 400 W. Caractéristiques et connectique publiées pour la référence SST-ST40NF ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 400,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST40NF/",
        "checkedAt": "2026-11-10T15:14:53.385Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST40NF/",
        "checkedAt": "2026-11-10T15:14:53.385Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST40NF/",
        "checkedAt": "2026-11-10T15:14:53.385Z"
      },
      "depthMm": {
        "value": 160.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST40NF/",
        "checkedAt": "2026-11-10T15:14:53.385Z"
      },
      "fanCount": {
        "value": 0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST40NF/",
        "checkedAt": "2026-11-10T15:14:53.385Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST40NF/",
        "checkedAt": "2026-11-10T15:14:53.385Z"
      }
    }
  },
  "import-psu-ca8806a1b026": {
    "identityKind": "mpn",
    "mpn": "SST-ST85F-PT",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST85F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST85F-PT"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "850W"
          },
          {
            "label": "Power density",
            "value": "471W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 22A | 22A | 70.9A | 3.0A | 0.3A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "850W"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz~63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "89%~92% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Under voltage protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（550mm） 4 x 8 / 6-Pin PCIE connector（\"550mm\" x 4） 12 x SATA connector（\"600mm / 150mm / 150mm / 150mm\" x 3） 3 x 4-Pin Peripheral connector（600mm / 150mm / 150mm） 1 x 4-Pin Floppy connector（100mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "0 ~ 28 dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.54 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 850,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "850 W",
        "ATX",
        "80 PLUS Platinum",
        "Single 120mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST85F-PT",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST85F-PT de 850 W. Caractéristiques et connectique publiées pour la référence SST-ST85F-PT ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 850,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST85F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST85F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST85F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST85F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST85F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST85F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST85F-PT/",
        "checkedAt": "2026-11-10T14:54:35.447Z"
      }
    }
  },
  "import-psu-a518e0b2131b": {
    "identityKind": "mpn",
    "mpn": "SST-ST50F-ESG",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST50F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST50F-ESG"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "500W"
          },
          {
            "label": "Power density",
            "value": "277W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 24A | 20A | 39A | 3A | 0.3A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0.2A | 1A | 1A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±2% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "468W"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.95 at Full Load）"
          },
          {
            "label": "Efficiency",
            "value": "87%~90% @ 20% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over power protection Over current protection Over voltage protection Short circuit protection Under voltage protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24-Pin motherboard connector（500mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（600mm） 2x 8/6-Pin PCIE connector（500mm / 150mm） 1 x SATA connector（550mm） 4 x SATA connector（550mm / 50mm / 50mm / 50mm） 4 x SATA connector（550mm / 155mm / 155mm / 155mm） 3 x 4-Pin Peripheral connector （705mm / 155mm / 155mm） 1 x 4-Pin Floppy connector（705mm / 155mm / 155mm / 100mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm HYB fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.95kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 500,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "500 W",
        "ATX",
        "80 PLUS Gold",
        "Single 120mm HYB fan"
      ],
      "manufacturerPartNumber": "SST-ST50F-ESG",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST50F-ESG de 500 W. Caractéristiques et connectique publiées pour la référence SST-ST50F-ESG ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 500,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST50F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST50F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST50F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST50F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST50F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST50F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST50F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      }
    }
  },
  "import-psu-282946099c74": {
    "identityKind": "mpn",
    "mpn": "SST-ST1500-GS",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-GS/",
        "checkedAt": "2026-11-10T14:54:38.457Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST1500-GS"
          },
          {
            "label": "Color",
            "value": "Black (scratch resistant and lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "1500W (Peak 1600W)"
          },
          {
            "label": "Power density",
            "value": "646W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +12V2 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 25A | 25A | 70A | 70A | 3.5A | 0.3A | | Peak (Amps) | / | / | / | / | / | / | | Min.(Amps) | 0.2A | 0.2A | 0.2A | 0.2A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | ±2% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "150W"
          },
          {
            "label": "Combined +12V",
            "value": "1440W/120A"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.95 at Full Load）"
          },
          {
            "label": "Efficiency",
            "value": "87%~90%（at 20%~100% loading）"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Over temperature protection Under voltage protection Short circuit protection No load operation"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（550mm） 8 x 8 / 6-Pin PCIE connector（\"550mm / 150mm\" x4） 16 x SATA connector（”600mm / 150mm / 150mm / 150mm” x4） 6 x 4-Pin Peripheral connector （”600mm / 150mm / 150mm” x 2） 2 x 4-Pin Floppy connector（”600mm / 150mm / 150mm / 150mm” x 2）"
          },
          {
            "label": "Cooling System",
            "value": "Silent 135mm fan"
          },
          {
            "label": "Noise Level",
            "value": "18dBA-34dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX PS/2"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 180 mm (D)"
          },
          {
            "label": "Weight",
            "value": "3.2Kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1500,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 180.0,
      "fanCount": 1,
      "fanSizeMm": 135,
      "psuFormat": "ATX",
      "specs": [
        "1500 W",
        "ATX PS/2",
        "80 PLUS Gold",
        "Silent 135mm fan"
      ],
      "manufacturerPartNumber": "SST-ST1500-GS",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST1500-GS de 1500 W. Caractéristiques et connectique publiées pour la référence SST-ST1500-GS ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1500,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-GS/",
        "checkedAt": "2026-11-10T14:54:38.457Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-GS/",
        "checkedAt": "2026-11-10T14:54:38.457Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-GS/",
        "checkedAt": "2026-11-10T14:54:38.457Z"
      },
      "depthMm": {
        "value": 180.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-GS/",
        "checkedAt": "2026-11-10T14:54:38.457Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-GS/",
        "checkedAt": "2026-11-10T14:54:38.457Z"
      },
      "fanSizeMm": {
        "value": 135,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-GS/",
        "checkedAt": "2026-11-10T14:54:38.457Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1500-GS/",
        "checkedAt": "2026-11-10T14:54:38.457Z"
      }
    }
  },
  "import-psu-00dfca151531": {
    "identityKind": "mpn",
    "mpn": "SST-ST1000-P",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST1000-P"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "1000W(Peak 1100W)"
          },
          {
            "label": "Power density",
            "value": "431W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 30A | 30A | 80A | 3.5A | 0.3A | | Peak (Amps) | / | / | 85A | / | / | | Min.(Amps) | 0A | 0.5A | 0.1A | 0.1A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "180W"
          },
          {
            "label": "Combined +12V",
            "value": "960W/80A（Peak 85A）"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz~63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.95 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "85%~88%（20% to 100% loading）"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours at 25°C, full load"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Under voltage protection Over temperature protection Short circuit protection No load protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（550mm） 4 x 8/6-Pin PCIE connector（550mm） 2 x 6-Pin PCIE connector（550mm / 150mm） 6 x SATA connector（500mm / 250mm / 250mm） 6 x 4-Pin Peripheral connector （500mm / 250mm / 250mm） 2 x 4-Pin Floppy connector（500mm / 250mm / 250mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Silent 135mm fan"
          },
          {
            "label": "Noise Level",
            "value": "19dBA-36dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Silver"
          },
          {
            "label": "Form factor",
            "value": "ATX PS/2"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 160 mm (D)"
          },
          {
            "label": "Weight",
            "value": "3 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1000,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 160.0,
      "fanCount": 1,
      "fanSizeMm": 135,
      "psuFormat": "ATX",
      "specs": [
        "1000 W",
        "ATX PS/2",
        "80 PLUS Silver",
        "Silent 135mm fan"
      ],
      "manufacturerPartNumber": "SST-ST1000-P",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST1000-P de 1000 W. Caractéristiques et connectique publiées pour la référence SST-ST1000-P ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1000,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "depthMm": {
        "value": 160.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "fanSizeMm": {
        "value": 135,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      }
    }
  },
  "import-psu-c16241ce0597": {
    "identityKind": "mpn",
    "mpn": "SST-TR650R-GF",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/tr650r_gf/",
        "checkedAt": "2026-11-10T15:04:58.458Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-TR650R-GF"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX0650FCGD-A"
          },
          {
            "label": "Color",
            "value": "Black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "650W"
          },
          {
            "label": "Power density",
            "value": "359.9W/L"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 18A | 18A | 54.1A | 3.0A | 0.3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "100W"
          },
          {
            "label": "Combined +12V",
            "value": "649W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "87% ~ 89% overall efficiency"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over power protection Over current protection Over voltage protection Short circuit protection Under voltage protection Over Temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 8 / 4-Pin EPS / ATX 12V connector 1 x 12+4-Pin 12V-2x6 connector 2 x 8 / 6-Pin PCIe connectors 6 x SATA connector 2 x 4-Pin Peripheral connector"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm ICB bearing fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA min."
          },
          {
            "label": "Certification",
            "value": "Cybenetics Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) x 86mm (H) x 140mm (D) 5.91\" (W) x 3.39\" (H) x 5.51\" (D)"
          },
          {
            "label": "Weight",
            "value": "1.48 kg | Describe | Version | File Size | Download | | --- | --- | --- | --- | | Describe Triton 650Rx High resolution photos | Version | File Size 514.39 KB | Download | | Describe Triton 650Rx Manual | Version | File Size 695.57 KB | Download | | Describe Restricted substance declaration | Version V1.0 | File Size 391.02 KB | Download | | Describe Multilanguage installation Manual | Version V1.0 | File Size 21.56 MB | Download | | Describe Warranty Information | Version | File Size | Download | | Describe Product Sheet | Version | File Size 832.68 KB | Download | # DA550 Gold"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 650,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "650 W",
        "ATX (PS2)",
        "Cybenetics Gold",
        "Single 120mm ICB bearing fan"
      ],
      "manufacturerPartNumber": "SST-TR650R-GF",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone Triton 650Rx de 650 W. Caractéristiques et connectique publiées pour la référence SST-TR650R-GF ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 650,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr650r_gf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr650r_gf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr650r_gf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr650r_gf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr650r_gf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr650r_gf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr650r_gf/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      }
    }
  },
  "import-psu-cf8bc819be38": {
    "identityKind": "mpn",
    "mpn": "SST-ST1200-G",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1200-G/",
        "checkedAt": "2026-11-10T14:53:25.907Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST1200-G"
          },
          {
            "label": "Color",
            "value": "Black (scratch resistant and lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "1200W (Peak 1300W)"
          },
          {
            "label": "Power density",
            "value": "517W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 25A | 25A | 100A | 3.5A | 0.3A | | Min.(Amps) | 0.3A | 0.3A | 0.1A | 0.1A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "150W"
          },
          {
            "label": "Combined +12V",
            "value": "1200W / 100A"
          },
          {
            "label": "Input Voltage",
            "value": "103V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC.（PF>0.95 at Full Load）"
          },
          {
            "label": "Efficiency",
            "value": "87%~90% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours at 25°C（at Full Load）"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Over temperature protection Under voltage protection Short circuit protection No Load Protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin Motherboard connector （550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector （750mm） 1 x 8 / 4-Pin EPS / ATX 12V connector （550mm） 4 x 8/6-Pin PCIE connector （550mm） 4 x 6-Pin PCIE connector （550mm / 150mm） 16 x SATA connector （600mm / 150mm / 150mm/150mm） 6 x 4-Pin Peripheral connector （600mm / 150mm / 150mm） 2 x 4-Pin Floppy connector （600mm / 150mm / 150mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 135mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "19dBA-36dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 180 mm (D)"
          },
          {
            "label": "Weight",
            "value": "3.295 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1200,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 180.0,
      "fanCount": 1,
      "fanSizeMm": 135,
      "specs": [
        "1200 W",
        "80 PLUS Gold",
        "Single 135mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST1200-G",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST1200-G de 1200 W. Caractéristiques et connectique publiées pour la référence SST-ST1200-G ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1200,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1200-G/",
        "checkedAt": "2026-11-10T14:53:25.907Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1200-G/",
        "checkedAt": "2026-11-10T14:53:25.907Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1200-G/",
        "checkedAt": "2026-11-10T14:53:25.907Z"
      },
      "depthMm": {
        "value": 180.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1200-G/",
        "checkedAt": "2026-11-10T14:53:25.907Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1200-G/",
        "checkedAt": "2026-11-10T14:53:25.907Z"
      },
      "fanSizeMm": {
        "value": 135,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1200-G/",
        "checkedAt": "2026-11-10T14:53:25.907Z"
      }
    }
  },
  "import-psu-26baa1bb3ff6": {
    "identityKind": "mpn",
    "mpn": "SST-OP1000-E",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/OP1000-E/",
        "checkedAt": "2026-11-10T15:15:43.747Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-OP1000-E"
          },
          {
            "label": "Color",
            "value": "Black.（lead-free paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "1000W"
          },
          {
            "label": "Power density",
            "value": "517W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | -12V | +5VSB | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 28A | 30A | 80A | 0.5A | 4A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0A | 1.0A | 3A | 0A | 0.1A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±5% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 120mV | 50mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "180W"
          },
          {
            "label": "Combined +12V",
            "value": "80A / 960W"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.99 at full load)"
          },
          {
            "label": "Efficiency",
            "value": "80% (Typical Loading)"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours at 25°C , full load"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24/20-pin motherboard connector.（550mm） 1 x 8-pin EPS12V connector.（550mm） 1 x 4-pin ATX12V connector.（550mm） 2 x 8/6-pin PCI-E connector.（550mm） 4 x 6-pin PCI-E connector.（550mm） 2 x triple SATA connector.（500mm +250mm + 250mm） 3 x Dual 4-pin IDE & single floppy power connectors.（500mm + 250mm + 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm ball bearing fan"
          },
          {
            "label": "Noise Level",
            "value": "22 dBA- 38dBA"
          },
          {
            "label": "Certification",
            "value": "CrossFire"
          },
          {
            "label": "Form factor",
            "value": "ATX PS/2"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 150 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.7 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1000,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 150.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "1000 W",
        "ATX PS/2",
        "CrossFire",
        "Single 120mm ball bearing fan"
      ],
      "manufacturerPartNumber": "SST-OP1000-E",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone OP1000-E de 1000 W. Caractéristiques et connectique publiées pour la référence SST-OP1000-E ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1000,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/OP1000-E/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/OP1000-E/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/OP1000-E/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "depthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/OP1000-E/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/OP1000-E/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/OP1000-E/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/OP1000-E/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      }
    }
  },
  "import-psu-d021eed86642": {
    "identityKind": "mpn",
    "mpn": "SST-ET650-HG",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ET650-HG"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "650W"
          },
          {
            "label": "Power density",
            "value": "315W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 53A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | 3.0A | / | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±5% | ±5% | ±5% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "110W"
          },
          {
            "label": "Combined +12V",
            "value": "636W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "87% ~ 90% at 20% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection"
          },
          {
            "label": "Connectors",
            "value": "V1.1 1 x 24 / 20-Pin motherboard connector (500mm) 1 x 8 / 4-Pin EPS / ATX 12V connector (750mm) 4 x 8 / 6-Pin PCIe connector (\"500mm / 150mm\" x 2) 9 x SATA connector (\"500mm / 150mm / 150mm\" x 3) 3 x 4-Pin Peripheral connector (500mm / 150mm / 150mm) 1 x 4-Pin Floppy connector (500mm / 150mm / 150mm / 150mm) V1.2 1 x 24 / 20-Pin motherboard connector (500mm) *1 x 8-Pin EPS and 1 x 4-Pin + 4-Pin ATX 12V connector (750mm / 150mm) 4 x 8 / 6-Pin PCIe connector (\"500mm / 150mm\" x 2) 9 x SATA connector (\"500mm / 150mm / 150mm\" x 3) 3 x 4-Pin Peripheral connector (500mm / 150mm / 150mm) 1 x 4-Pin Floppy connector (500mm / 150mm / 150mm / 150mm)"
          },
          {
            "label": "Cooling System",
            "value": "Single 140mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "18dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 160 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.97 Kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 650,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 160.0,
      "fanCount": 1,
      "fanSizeMm": 140,
      "psuFormat": "ATX",
      "specs": [
        "650 W",
        "ATX",
        "80 PLUS Gold",
        "Single 140mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ET650-HG",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ET650-HG de 650 W. Caractéristiques et connectique publiées pour la référence SST-ET650-HG ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 650,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "depthMm": {
        "value": 160.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "fanSizeMm": {
        "value": 140,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ET650-HG/",
        "checkedAt": "2026-11-10T14:54:35.488Z"
      }
    }
  },
  "import-psu-9683b43417cd": {
    "identityKind": "mpn",
    "mpn": "SST-OP800",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/op800/",
        "checkedAt": "2026-11-10T15:14:53.385Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-OP800"
          },
          {
            "label": "Color",
            "value": "black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "800W"
          },
          {
            "label": "Power density",
            "value": "413W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 28A | 30A | 66A | 4.0A | 0.5A | | Min.(Amps) | 0A | 1A | 3A | 0.1A | 0A | | Range (%) | +/-3% | +/-3% | +/-3% | +/-5% | +/-10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "180W"
          },
          {
            "label": "Combined +12V",
            "value": "792W/ 66A"
          },
          {
            "label": "Input Voltage",
            "value": "90V ~ 264V ( Auto Range )"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.99 at full load)"
          },
          {
            "label": "Efficiency",
            "value": ">80%"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours at 25°C , full load"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection, Over power protection, Over voltage protection, Short circuit protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24-pin motherboard connector (550mm) 1 x 8-pin EPS12V connector (750mm) 1 x 4-pin ATX12V connector (550mm) 2 x 8-pin PCI-E connector (550mm) 2 x Dual 6-pin PCI-E connector (550mm) 2 x triple SATA connector (500mm +250mm + 250mm) 2 x triple 4-pin IDE & single floppy power connectors (500mm + 250mm + 250mm + 150mm)"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm ball bearing fan"
          },
          {
            "label": "Noise Level",
            "value": "22 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "CrossFire"
          },
          {
            "label": "Form factor",
            "value": "ATX PS/2"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 150 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.6 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 800,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 150.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "800 W",
        "ATX PS/2",
        "CrossFire",
        "Single 120mm ball bearing fan"
      ],
      "manufacturerPartNumber": "SST-OP800",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone op800 de 800 W. Caractéristiques et connectique publiées pour la référence SST-OP800 ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 800,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/op800/",
        "checkedAt": "2026-11-10T15:14:53.385Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/op800/",
        "checkedAt": "2026-11-10T15:14:53.385Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/op800/",
        "checkedAt": "2026-11-10T15:14:53.385Z"
      },
      "depthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/op800/",
        "checkedAt": "2026-11-10T15:14:53.385Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/op800/",
        "checkedAt": "2026-11-10T15:14:53.385Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/op800/",
        "checkedAt": "2026-11-10T15:14:53.385Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/op800/",
        "checkedAt": "2026-11-10T15:14:53.385Z"
      }
    }
  },
  "import-psu-e0cb5279d62a": {
    "identityKind": "mpn",
    "mpn": "SST-ST1000-PT",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PT/",
        "checkedAt": "2026-11-10T14:51:56.105Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST1000-PT"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "1000W (Peak 1050W)"
          },
          {
            "label": "Power density",
            "value": "431W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 25A | 22A | 83A | 2.5A | 0.3A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0.1A | 0.2A | 0.15A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "120W"
          },
          {
            "label": "Combined +12V",
            "value": "996W"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz~63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "89%~92% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Short circuit protection Under voltage protection Over temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（550mm） 6 x 8 / 6-Pin PCIE connector（\"550mm\" x 6） 16 x SATA connector（\"600mm / 150mm / 150mm / 150mm\" x 4） 6 x 4-Pin Peripheral connector（\"600mm / 150mm / 150mm\" x 2） 2 x 4-Pin Floppy connector（\"600mm / 150mm / 150mm / 150mm\" x 2）"
          },
          {
            "label": "Cooling System",
            "value": "Single 139mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "0 ~ 36 dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Platinum"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 180 mm (D)"
          },
          {
            "label": "Weight",
            "value": "3.3 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1000,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 180.0,
      "fanCount": 1,
      "fanSizeMm": 139,
      "psuFormat": "ATX",
      "specs": [
        "1000 W",
        "ATX",
        "80 PLUS Platinum",
        "Single 139mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST1000-PT",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST1000-PT de 1000 W. Caractéristiques et connectique publiées pour la référence SST-ST1000-PT ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1000,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PT/",
        "checkedAt": "2026-11-10T14:51:56.105Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PT/",
        "checkedAt": "2026-11-10T14:51:56.105Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PT/",
        "checkedAt": "2026-11-10T14:51:56.105Z"
      },
      "depthMm": {
        "value": 180.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PT/",
        "checkedAt": "2026-11-10T14:51:56.105Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PT/",
        "checkedAt": "2026-11-10T14:51:56.105Z"
      },
      "fanSizeMm": {
        "value": 139,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PT/",
        "checkedAt": "2026-11-10T14:51:56.105Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/ST1000-PT/",
        "checkedAt": "2026-11-10T14:51:56.105Z"
      }
    }
  },
  "import-psu-99a4e4b142ac": {
    "identityKind": "mpn",
    "mpn": "SST-DA750",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/da750/",
        "checkedAt": "2026-11-10T15:04:58.458Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-DA750"
          },
          {
            "label": "Color",
            "value": "black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "750W"
          },
          {
            "label": "Power density",
            "value": "323W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 28A | 30A | 60A | 4.0A | 0.5A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0A | 1A | 3A | 0.1A | 0A | | Range (%) | +/-3% | +/-3% | +/-3% | +/-5% | +/-10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "180W Max"
          },
          {
            "label": "Combined +12V",
            "value": "720W / 60A"
          },
          {
            "label": "Input Voltage",
            "value": "90V ~ 264V ( Auto Range )"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.99 at full load)"
          },
          {
            "label": "Efficiency",
            "value": ">80%"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours at 25°C , full load"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection, Over power protection, Over voltage protection, Short circuit protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24-pin motherboard connector (550mm) 1 x 8-pin EPS12V connector (550mm) 1 x 4-pin ATX12V connector (550mm) 1 x 8-pin PCI-E connector (550mm) 2 x Dual 6-pin PCI-E connector (550mm) 2 x triple SATA connector (500mm +250mm + 250mm) 2 x triple 4-pin IDE & single floppy power connectors (500mm + 250mm + 250mm + 150mm)"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm ball bearing fan"
          },
          {
            "label": "Noise Level",
            "value": "22 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "SLI"
          },
          {
            "label": "Form factor",
            "value": "ATX PS/2"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 180 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.6 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 750,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 180.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "750 W",
        "ATX PS/2",
        "SLI",
        "Single 120mm ball bearing fan"
      ],
      "manufacturerPartNumber": "SST-DA750",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone da750 de 750 W. Caractéristiques et connectique publiées pour la référence SST-DA750 ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 750,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "depthMm": {
        "value": 180.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/da750/",
        "checkedAt": "2026-11-10T15:04:58.458Z"
      }
    }
  },
  "import-psu-b2580edcb3e0": {
    "identityKind": "mpn",
    "mpn": "SST-ST85F-P",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST85F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST85F-P"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "850W(Peak 950W)"
          },
          {
            "label": "Power density",
            "value": "412W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 25A | 67A | 3.5A | 0.3A | | Peak (Amps) | / | / | 72A | / | / | | Min.(Amps) | 0A | 0.5A | 0.1A | 0.1A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "180W"
          },
          {
            "label": "Combined +12V",
            "value": "804W/67A（Peak 72A）"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz~63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF0.95 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "85%~88%（20% to 100% loading）"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours at 25°C, full load"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protectionOver power protectionOver voltage protectionUnder voltage protectionOver temperature protectionShort circuit protectionNo load protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（750mm）1 x 8 / 4-Pin EPS / ATX 12V connector（550mm）2 x 8/6-Pin PCIE connector（550mm）2 x 6-Pin PCIE connector（550mm） 6 x SATA connector（500mm / 250mm / 250mm） 6 x 4-Pin Peripheral connector （500mm / 250mm / 250mm） 2 x 4-Pin Floppy connector（500mm / 250mm / 250mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Silent 135mm fan"
          },
          {
            "label": "Noise Level",
            "value": "19dBA-36dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Silver"
          },
          {
            "label": "Form factor",
            "value": "ATX PS/2"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 160 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.9 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 850,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 160.0,
      "fanCount": 1,
      "fanSizeMm": 135,
      "psuFormat": "ATX",
      "specs": [
        "850 W",
        "ATX PS/2",
        "80 PLUS Silver",
        "Silent 135mm fan"
      ],
      "manufacturerPartNumber": "SST-ST85F-P",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST85F-P de 850 W. Caractéristiques et connectique publiées pour la référence SST-ST85F-P ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 850,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST85F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST85F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST85F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "depthMm": {
        "value": 160.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST85F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST85F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "fanSizeMm": {
        "value": 135,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST85F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST85F-P/",
        "checkedAt": "2026-11-10T14:53:26.857Z"
      }
    }
  },
  "import-psu-7200b115364f": {
    "identityKind": "mpn",
    "mpn": "SST-ST60F-ESG",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST60F-ESG"
          },
          {
            "label": "Color",
            "value": "Black（Lead-Free Paint）"
          },
          {
            "label": "Max. DC Output",
            "value": "600W"
          },
          {
            "label": "Power density",
            "value": "332W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 24A | 24A | 46A | 3A | 0.3A | | Peak (Amps) | / | / | / | / | / | | Min.(Amps) | 0.2A | 1A | 1A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±2% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "130W"
          },
          {
            "label": "Combined +12V",
            "value": "552W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.95 at Full Load）"
          },
          {
            "label": "Efficiency",
            "value": "87%~90% @ 20% ~ 100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over power protection Over current protection Over voltage protection Short circuit protection Under voltage protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24-Pin motherboard connector（500mm） 1 x 8 / 4-Pin EPS / ATX 12V connector（600mm） 4x 8/6-Pin PCIE connector（”500mm / 150mm” x 2） 1 x SATA connector（550mm） 4 x SATA connector（550mm / 50mm / 50mm / 50mm） 4 x SATA connector（550mm / 155mm / 155mm / 155mm） 3 x 4-Pin Peripheral connector （705mm / 155mm / 155mm） 1 x 4-Pin Floppy connector（705mm / 155mm / 155mm / 100mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm HYB fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 140 mm (D)"
          },
          {
            "label": "Weight",
            "value": "1.95kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 600,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "600 W",
        "ATX",
        "80 PLUS Gold",
        "Single 120mm HYB fan"
      ],
      "manufacturerPartNumber": "SST-ST60F-ESG",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST60F-ESG de 600 W. Caractéristiques et connectique publiées pour la référence SST-ST60F-ESG ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 600,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST60F-ESG/",
        "checkedAt": "2026-11-10T14:53:26.125Z"
      }
    }
  },
  "import-psu-43115a73ce9d": {
    "identityKind": "mpn",
    "mpn": "SST-TR1000R-GM-WWW",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-TR1000R-GM-WWW"
          },
          {
            "label": "Model (safety certification)",
            "value": "SST-AX1000MCGD-C"
          },
          {
            "label": "Color",
            "value": "Black (lead-free paint) White (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "1000W"
          },
          {
            "label": "Power density",
            "value": "553.7W/L"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 20A | 20A | 83.3A | 3.0A | 0.3A | | Peak (Amps) | / | / | / | / | 3A | | Min.(Amps) | 0A | 0A | 0A | 0A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±3% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 30mV | 30mV | 40mV | 30mV | 50mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "110W"
          },
          {
            "label": "Combined +12V",
            "value": "1000W"
          },
          {
            "label": "Input Voltage",
            "value": "90 ~ 264 Vrms"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC（PF>0.9 at full load）"
          },
          {
            "label": "Efficiency",
            "value": "≥87% to <89% overall efficiency"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over power protection Over current protection Over voltage protection Short circuit protection Over Temperature protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector 2 x 8 / 4-Pin EPS / ATX 12V connector 1 x 12+4-Pin 12V-2x6 connector 4 x 8 / 6-Pin PCIe connector 8 x SATA connector 4 x 4-Pin Peripheral connector"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm FDB fan"
          },
          {
            "label": "Noise Level",
            "value": "18 dBA min."
          },
          {
            "label": "Certification",
            "value": "Cybenetics Gold"
          },
          {
            "label": "Form factor",
            "value": "ATX (PS2)"
          },
          {
            "label": "Dimension",
            "value": "150mm (W) x 86mm (H) x 140mm (D) 5.91\" (W) x 3.39\" (H) x 5.51\" (D)"
          },
          {
            "label": "Weight",
            "value": "2.7 kg ● This PSU’s motherboard connector includes a 4pin sense wire that needs to be connected to the PSU’s modular interface as shown. Sense wire helps improve PSU’s regulation performance by around 1%-2%. | Describe | Version | File Size | Download | | --- | --- | --- | --- | | Describe Triton 1000Rz High resolution photos | Version | File Size 8.48 MB | Download | | Describe Triton 1000Rz Manual | Version | File Size 495.68 KB | Download | | Describe Restricted substance declaration | Version V1.0 | File Size 391.02 KB | Download | | Describe Multilanguage installation Manual | Version V1.0 | File Size 21.56 MB | Download | | Describe Warranty Information | Version | File Size | Download | | Describe Product Sheet | Version | File Size 1.06 MB | Download | # HELA 1200Rz Axis"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1000,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 140.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "1000 W",
        "ATX (PS2)",
        "Cybenetics Gold",
        "Single 120mm FDB fan"
      ],
      "manufacturerPartNumber": "SST-TR1000R-GM-WWW",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone Triton 1000Rz de 1000 W. Caractéristiques et connectique publiées pour la référence SST-TR1000R-GM-WWW ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires.",
      "La page fabricant publie côte à côte les finitions noire et blanche ; la référence suffixée WWW/WBW est conservée pour la finition blanche explicite."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1000,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "depthMm": {
        "value": 140.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/product/info/power-supplies/tr1000r_gm/",
        "checkedAt": "2026-11-10T14:51:55.850Z"
      }
    }
  },
  "import-psu-03f80aadd417": {
    "identityKind": "mpn",
    "mpn": "SST-ZM1350",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/product/info/coolers/ZM1350/",
        "checkedAt": "2026-11-10T15:15:43.747Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ZM1350"
          },
          {
            "label": "Color",
            "value": "Black (scratch resistant and lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "1350W (Peak 1500W)"
          },
          {
            "label": "Power density",
            "value": "455W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V1 | +12V2 | +12V3 | +12V4 | +12V5 | +12V6 | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 25A | 25A | 30A | 30A | 30A | 30A | 30A | 30A | 4A | 0.5A | | Peak (Amps) | / | / | / | / | / | / | / | / | / | / | | Min.(Amps) | 1.0A | 1.0A | 1.0A | 1.0A | 1.0A | 1.0A | 1.0A | 1.0A | 1.0A | 0A | | Range (%) | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 20mV | 20mV | 30mV | 30mV | 30mV | 30mV | 30mV | 30mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "170W"
          },
          {
            "label": "Combined +12V",
            "value": "1260W / 105A"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "50Hz ~ 60Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC.（PF>0.95 at Full Load）"
          },
          {
            "label": "Efficiency",
            "value": "85%~89%@20% to 100% loading (115Vac）88%~91%@20% to 100% loading (230Vac）"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours at 25°C（at Full Load）"
          },
          {
            "label": "Operating temperature",
            "value": "5°C ~ 50°C @1350W continuous60°C @1080W continuous"
          },
          {
            "label": "Protection",
            "value": "Over power protectionOver voltage protectionShort circuit protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin motherboard connector（500mm）1 x 8 / 4-Pin EPS / ATX 12V connector（700mm）1 x 8 / 4-Pin EPS / ATX 12V connector（500mm）6 x 8 / 6-Pin PCIE connector（500mm）2 x 8 / 6-Pin PCIE connector（500mm / 150mm）16 x SATA connector（500mm / 150mm / 150mm / 150mm）6 x 4-Pin Peripheral connector （500mm / 150mm / 150mm） 2 x 4-Pin Floppy connector（500mm / 150mm / 150mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single long life dual ball bearing 80mm fan"
          },
          {
            "label": "Noise Level",
            "value": "20dBA-40dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Silver"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 230 mm (D)"
          },
          {
            "label": "Weight",
            "value": "4.5kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1350,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 230.0,
      "fanCount": 1,
      "fanSizeMm": 80,
      "specs": [
        "1350 W",
        "80 PLUS Silver",
        "Single long life dual ball bearing 80mm fan"
      ],
      "manufacturerPartNumber": "SST-ZM1350",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ZM1350 de 1350 W. Caractéristiques et connectique publiées pour la référence SST-ZM1350 ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1350,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/coolers/ZM1350/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/coolers/ZM1350/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/coolers/ZM1350/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "depthMm": {
        "value": 230.0,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/coolers/ZM1350/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/coolers/ZM1350/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "fanSizeMm": {
        "value": 80,
        "sourceURL": "https://www.silverstonetek.com/en/product/info/coolers/ZM1350/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      }
    }
  },
  "import-psu-dc2cd724468f": {
    "identityKind": "mpn",
    "mpn": "SST-ST1000-G",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-G/",
        "checkedAt": "2026-11-10T14:53:27.310Z",
        "kind": "manufacturer"
      },
      {
        "name": "SilverStone — comparatif des séries et révisions",
        "url": "https://www.silverstonetek.com/en/page/PSU-comparison",
        "checkedAt": "2026-11-10T14:45:52.413Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-ST1000-G"
          },
          {
            "label": "Color",
            "value": "Black (scratch resistant and lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "1000W (Peak 1100W)"
          },
          {
            "label": "Power density",
            "value": "431W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 25A | 25A | 83A | 3.5A | 0.3A | | Min.(Amps) | 0.3A | 0.3A | 0.1A | 0.1A | 0A | | Range (%) | ±3% | ±3% | ±3% | ±5% | ±10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "150W"
          },
          {
            "label": "Combined +12V",
            "value": "996W / 83A"
          },
          {
            "label": "Input Voltage",
            "value": "90V~264V"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC.（PF>0.95 at Full Load）"
          },
          {
            "label": "Efficiency",
            "value": "87%~90% at 20%~100% loading"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours at 25°C（at Full Load）"
          },
          {
            "label": "Operating temperature",
            "value": "0°C ~ 40°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection Over power protection Over voltage protection Over temperature protection Under voltage protection Short circuit protection No Load Protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24 / 20-Pin Motherboard connector （550mm） 1 x 8 / 4-Pin EPS / ATX 12V connector （750mm） 1 x 8 / 4-Pin EPS / ATX 12V connector （550mm） 4 x 8/6-Pin PCIE connector （550mm） 2 x 6-Pin PCIE connector （550mm / 150mm） 8 x SATA connector （600mm / 150mm / 150mm/150mm） 6 x 4-Pin Peripheral connector （600mm / 150mm / 150mm） 2 x 4-Pin Floppy connector （600mm / 150mm / 150mm / 150mm）"
          },
          {
            "label": "Cooling System",
            "value": "Single 135mm silent fan"
          },
          {
            "label": "Noise Level",
            "value": "19dBA-36dBA"
          },
          {
            "label": "Certification",
            "value": "80 PLUS Gold"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 180 mm (D)"
          },
          {
            "label": "Weight",
            "value": "3.255 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 1000,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 180.0,
      "fanCount": 1,
      "fanSizeMm": 135,
      "specs": [
        "1000 W",
        "80 PLUS Gold",
        "Single 135mm silent fan"
      ],
      "manufacturerPartNumber": "SST-ST1000-G",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone ST1000-G de 1000 W. Caractéristiques et connectique publiées pour la référence SST-ST1000-G ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 1000,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-G/",
        "checkedAt": "2026-11-10T14:53:27.310Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-G/",
        "checkedAt": "2026-11-10T14:53:27.310Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-G/",
        "checkedAt": "2026-11-10T14:53:27.310Z"
      },
      "depthMm": {
        "value": 180.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-G/",
        "checkedAt": "2026-11-10T14:53:27.310Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-G/",
        "checkedAt": "2026-11-10T14:53:27.310Z"
      },
      "fanSizeMm": {
        "value": 135,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/ST1000-G/",
        "checkedAt": "2026-11-10T14:53:27.310Z"
      }
    }
  },
  "import-psu-ad5720d327d2": {
    "identityKind": "mpn",
    "mpn": "SST-DA700",
    "identityNote": "Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.",
    "sources": [
      {
        "name": "SilverStone — fiche technique du modèle",
        "url": "https://www.silverstonetek.com/en/legacy/info/power-supplies/da700/",
        "checkedAt": "2026-11-10T15:15:43.747Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "Spécifications constructeur SilverStone",
        "rows": [
          {
            "label": "Référence fabricant exacte",
            "value": "SST-DA700"
          },
          {
            "label": "Color",
            "value": "black (lead-free paint)"
          },
          {
            "label": "Max. DC Output",
            "value": "700W"
          },
          {
            "label": "Power density",
            "value": "301W per liter"
          },
          {
            "label": "Load Range",
            "value": "| Output | +3.3V | +5V | +12V | +5VSB | -12V | | --- | --- | --- | --- | --- | --- | | Max.(Amps) | 24A | 30A | 58A | 4.0A | 0.5A | | Min.(Amps) | 0A | 1A | 3A | 0.1A | 0A | | Range (%) | +/-3% | +/-3% | +/-3% | +/-5% | +/-10% | | Line Reg.(%) | ±1% | ±1% | ±1% | ±1% | ±1% | | Ripple(mVp-p) | 50mV | 50mV | 120mV | 50mV | 120mV |"
          },
          {
            "label": "Combined +3.3V & +5V",
            "value": "180W Max"
          },
          {
            "label": "Combined +12V",
            "value": "696W / 58A"
          },
          {
            "label": "Input Voltage",
            "value": "90V ~ 264V (Auto Range)"
          },
          {
            "label": "Input Frequency Range",
            "value": "47Hz ~ 63Hz"
          },
          {
            "label": "PFC",
            "value": "Active PFC (PF>0.99 at full load)"
          },
          {
            "label": "Efficiency",
            "value": ">80%"
          },
          {
            "label": "MTBF",
            "value": "100,000 hours at 25°C , full load"
          },
          {
            "label": "Operating temperature",
            "value": "0 ~ 50°C"
          },
          {
            "label": "Protection",
            "value": "Over current protection, Over power protection, Over voltage protection, Short circuit protection"
          },
          {
            "label": "Connectors",
            "value": "1 x 24-pin motherboard connector (550mm) 1 x 8-pin EPS12V connector (550mm) 1 x 4-pin ATX12V connector (550mm) 1 x 8-pin PCI-E connector (550mm) 2 x Dual 6-pin PCI-E connector (550mm) 2 x triple SATA connector (500mm +250mm + 250mm) 2 x triple 4-pin IDE & single floppy power connectors (500mm + 250mm + 250mm + 150mm)"
          },
          {
            "label": "Cooling System",
            "value": "Single 120mm ball bearing fan"
          },
          {
            "label": "Noise Level",
            "value": "22 dBA minimum"
          },
          {
            "label": "Certification",
            "value": "CrossFire"
          },
          {
            "label": "Form factor",
            "value": "ATX PS/2"
          },
          {
            "label": "Dimension",
            "value": "150 mm (W) x 86 mm (H) x 180 mm (D)"
          },
          {
            "label": "Weight",
            "value": "2.6 kg"
          }
        ]
      }
    ],
    "patch": {
      "wattage": 700,
      "widthMm": 150.0,
      "heightMm": 86.0,
      "depthMm": 180.0,
      "fanCount": 1,
      "fanSizeMm": 120,
      "psuFormat": "ATX",
      "specs": [
        "700 W",
        "ATX PS/2",
        "CrossFire",
        "Single 120mm ball bearing fan"
      ],
      "manufacturerPartNumber": "SST-DA700",
      "detailLevel": "partial",
      "description": "Alimentation SilverStone da700 de 700 W. Caractéristiques et connectique publiées pour la référence SST-DA700 ; les valeurs non renseignées restent à confirmer."
    },
    "offers": [],
    "notes": [
      "La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.",
      "Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires."
    ],
    "fieldEvidence": {
      "wattage": {
        "value": 700,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/da700/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "widthMm": {
        "value": 150.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/da700/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "heightMm": {
        "value": 86.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/da700/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "depthMm": {
        "value": 180.0,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/da700/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "fanCount": {
        "value": 1,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/da700/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "fanSizeMm": {
        "value": 120,
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/da700/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      },
      "psuFormat": {
        "value": "ATX",
        "sourceURL": "https://www.silverstonetek.com/en/legacy/info/power-supplies/da700/",
        "checkedAt": "2026-11-10T15:15:43.747Z"
      }
    }
  }
}
