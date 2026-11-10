# Vérification des références et relevés marchands — 10 novembre 2026

Le site conserve **10 564 variantes**. **162 références** ont des pages primaires acceptées, **183 offres ou derniers prix** sont documentés et **26 références** ont aussi une fiche fabricant consultée. Au bilan du 10 novembre, **61 références** disposent d’une offre neuve disponible admissible et **87 relevés** sont historiques. **10 402 variantes n’ont pas de vérification individuelle complète auprès des sources demandées**. Elles gardent leur provenance initiale et ne sont pas déclarées vérifiées.

Les pages ont été consultées via Firecrawl sans cache demandé (`maxAge: 0`), après recherche des références chez PcComponentes, Fnac, LDLC et les fabricants. Les extraits de recherche servent uniquement à découvrir les pages. Le manifeste retient les correspondances examinées ; les pages et dates sont conservées dans `data/evidence/`. Le bilan `data/catalog-verification-report.json` distingue les archives non contrôlées individuellement des références initiales sans correspondance exacte acceptée.

## Corrections et arbitrages

| Référence | Donnée retenue et preuve |
| --- | --- |
| AMD Ryzen 7 7800X3D | Boîte `100-100000910WOF`, AM5 et Zen 4 confirmés par AMD. Les champs Fnac AM4, Zen 2 et Matisse sont contradictoires et écartés. PcComponentes : 316,36 €, LDLC : 449,95 €, offre Darty sur Fnac : 349,99 €, aux dates conservées. Le « dès 309 € » marketplace n’est pas retenu sans vendeur et conditions établis. |
| AMD Ryzen 7 9800X3D | Boîte `100-100001084WOF`, 396,59 € chez PcComponentes et 499,95 € chez LDLC. Le signalement allemand reste distinct ; un relevé direct français admissible passe en priorité. |
| ASUS Dual RTX 4070 SUPER | `DUAL-RTX4070S-12G`, modèle non-OC. Dimensions fabricant : 267,01 × 133,94 × 51,13 mm ; alimentation recommandée 750 W. Les offres OC, EVO et blanches ne lui sont pas attribuées. |
| Sapphire PULSE RX 7600 / 7700 XT / 7600 XT | SKU numériques 11324-01-20G, 11335-04-20G et 11339-04-20G confirmés sur les fiches Sapphire, en conservant les libellés des marchands. Dimensions, TBP et puissance minimale d’alimentation corrigées selon ces fiches. |
| MSI MAG B650 TOMAHAWK WIFI | La fiche MSI actuelle annonce 256 Go DDR5, 4 DIMM et 3 M.2. La capacité réellement supportée dépend aussi du CPU, du BIOS et de la QVL. Partage des lignes M2_3/PCI_E2 conservé dans les données fabricant. |
| Corsair Vengeance RGB 32 Go DDR5 | `CMH32GX5M2B6000Z30K` : 2 × 16 Go, 6 000 MT/s CL30 à 1,40 V, EXPO et XMP ; SPD 4 800 MT/s CL40 à 1,10 V. La couleur fabricant est grise. Le dernier prix LDLC concerne une référence retirée de la vente et reste hors budget. |
| Corsair RM750e | Révision 2025 `CP-9020295-EU`, Cybenetics Gold, ATX 3.1 et PCIe 5.1 ; câble 12V-2x6. Le nom et les caractéristiques reflètent cette révision. |
| NZXT H6 Flow | Noir sans RGB `CC-H61FB-01`, 98,20 € chez PcComponentes lors du relevé. Les 98,50 € des sélecteurs de couleur ne remplacent pas le montant de l’offre principale. |
| Thermalright Phantom Spirit 120 SE | Dimensions et ventilateurs confirmés sur la fiche fabricant ; offre PcComponentes à 63,33 € vendue par Digital Universe FR, pas par PcComponentes. |

Les versions tray et boîte ne sont pas mélangées. Les offres reconditionnées, les ruptures, les anciens prix et les frais inconnus sont affichés comme tels. Les pages de RAM de mauvaise latence, capacité ou couleur ont été écartées. Les révisions ASRock B550M Pro4 R2.0 et Seasonic FOCUS GX-750 ATX 3.0 ne sont pas attribuées aux anciennes fiches non identifiées. Les rejets acceptés par l’import sont documentés dans `data/verification-rejections.json` ; les découvertes non retenues restent dans `data/retailer-discovery.json` et les preuves correspondantes.

## Import, budget et vérification

```sh
npm run import:verified
npm run audit:catalog
npm test
npm run build
node tests/verified-offers-browser-smoke.cjs
```

L’import est local et reproductible depuis les preuves enregistrées ; il n’effectue pas une nouvelle collecte. Les MPN sont vérifiés avant l’intégration d’une offre. Les identifiants des composants et sauvegardes restent stables. Les corrections des dimensions alimentent les contrôles et le visuel ; le TDP fabricant ne remplace pas la consommation estimée utilisée pour dimensionner l’alimentation.

Un relevé direct neuf disponible entre dans le budget pendant 24 h, hors livraison. Un relevé futur, expiré, reconditionné, historique ou indisponible reste hors budget. Le site ne reprend pas l’ancienne estimation d’un produit contrôlé en l’absence de prix admissible. Le signalement public allemand reste une autre provenance, avec sa propre fenêtre de 14 jours. Aucun prix n’est garanti au paiement. Les stocks boutiques ne deviennent pas un stock livrable en ligne.

Validation : 147 tests unitaires passent. Le parcours navigateur vérifie les trois marchands, le vendeur marketplace, les données fabricant, l’exclusion du dernier prix RAM, la persistance des sélections et l’absence de débordement horizontal à 1 440 et 390 pixels. Les tests couvrent aussi l’expiration à 24 h, les dates futures, les MPN de conditionnements distincts et le stock principal distinct des carrousels.
