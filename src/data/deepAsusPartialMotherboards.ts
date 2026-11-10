// Exact manufacturer identity, deliberately incomplete technical table.
import type {VerifiedProduct} from "./verifiedTypes.ts";
export const deepAsusPartialMotherboardProducts:Record<string,VerifiedProduct> = {
  "import-mb-50bd58b8a3d6": {
    "identityKind": "manufacturer-model",
    "manufacturerModel": "Pro H610M-C-CSM",
    "mpn": "",
    "identityNote": "La page ASUS nomme exactement Pro H610M-C-CSM. Le tableau actuel ne publie que le chipset, le résumé USB arrière et les dimensions ; CPU, DDR, mémoire et stockage restent non documentés par cette source.",
    "sources": [
      {
        "name": "ASUS — fiche technique officielle partiellement publiée",
        "url": "https://www.asus.com/motherboards-components/motherboards/csm/pro-h610m-c-csm/techspec/",
        "checkedAt": "2026-11-10T14:20:38.519Z",
        "kind": "manufacturer"
      }
    ],
    "groups": [
      {
        "title": "ASUS — seuls champs actuellement publiés",
        "rows": [
          {
            "label": "Chipset",
            "value": "H610"
          },
          {
            "label": "Connectique arrière — résumé USB",
            "value": "Total 4 ports USB"
          },
          {
            "label": "Dimensions physiques",
            "value": "24.4 cm × 22 cm"
          }
        ]
      }
    ],
    "patch": {
      "detailLevel": "partial",
      "manufacturerModel": "Pro H610M-C-CSM"
    },
    "offers": [],
    "notes": [
      "Cette fiche est explicitement partielle. Aucun composant voisin H610M-C, H610M-C D4 ou H610T n’est utilisé pour compléter les données manquantes."
    ],
    "fieldEvidence": {
      "chipset": {
        "value": "H610",
        "sourceURL": "https://www.asus.com/motherboards-components/motherboards/csm/pro-h610m-c-csm/techspec/",
        "checkedAt": "2026-11-10T14:20:38.519Z"
      },
      "boardDimensions": {
        "value": "24.4 cm × 22 cm",
        "sourceURL": "https://www.asus.com/motherboards-components/motherboards/csm/pro-h610m-c-csm/techspec/",
        "checkedAt": "2026-11-10T14:20:38.519Z"
      }
    }
  }
};
