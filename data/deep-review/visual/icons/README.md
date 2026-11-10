# Inspection des icônes — 10 novembre 2026

Cette passe distingue la photographie, l'identité commerciale et la reconstruction. Une URL d'image issue d'un catalogue constructeur ne vaut pas une inspection visuelle. Aucun de ces contrôles ne modifie les caractéristiques techniques ou la compatibilité.

## Couverture

- Les 20 boîtiers et les 25 refroidisseurs ont chacun une entrée dans `inspected-products.json`, ainsi qu'une apparence par ID dans `src/data/hardwareAppearance.ts`.
- 43 images de ces 45 produits ont été inspectées, dont plusieurs ne montrent que la famille ou une partie du produit. 38 conviennent comme photo principale de la référence exacte. L'image EK Nucleus et celle du Montech AIR 903 BASE n'ont pas pu être obtenues ; leurs illustrations restent explicitement reconstruites.
- Les 26 pages constructeur des processeurs ont été lues. Les 13 photographies récupérées montrent l'emballage. Les autres actifs sont des logos ou des fonds génériques. Aucun de ces actifs ne remplace l'illustration du processeur nu. `cpu/photo-candidates.json` conserve les exclusions, dont les boîtes 7900X/5900X réutilisées par les pages 7950X/5950X.
- Les six planches `release/core-icon-review/sheet-1.png` à `sheet-6.png` montrent les 71 illustrations de repli et ont été inspectées. `scripts/render-core-icon-review.ts` les régénère sans requête d'image externe.
- `tests/productArtCoverage.test.ts` contrôle le rendu SVG de tous les 10 564 IDs : non vide, sans coordonnées non finies, définitions de matières résolues, comptes de pièces documentés et absence de mutation des données.

## Références exclues comme photo principale

- North Charcoal TG : la galerie redirigée montre une variante blanche mesh.
- AP201 blanc : le visuel présente ensemble plusieurs couleurs.
- H7 Flow 2022 : le visuel présente plusieurs modèles et finitions.
- Kraken 240/360 : l'image inspectée ne montre que la pompe commune, pas la taille du radiateur.
- EK Nucleus CR360 et AIR 903 BASE : pas de photographie accessible pendant cette passe.

Le premier actif Corsair 3000D montrait un kit de ventilateurs : il a été écarté puis remplacé par une photo du boîtier exact. La référence Terra FD-C-TER1N-01 est Graphite, ce qui a corrigé l'ancien profil Jade.

## Registre des photographies

`scripts/build-product-image-assets.py` reconstruit `src/data/manufacturerImageAssets.ts` à partir des photos exactes inspectées, des vignettes Inno3D associées à un MPN unique et des photos Gigabyte sans ambiguïté de révision. Il refuse les listes Open Graph génériques et les correspondances approximatives. Les totaux actuels sont dans `primary-photo-summary.json`.

Le champ `inspection` vaut `visually-inspected` seulement pour les photos du manifeste inspectées et éligibles. `manufacturer-catalogue` indique une association de référence dans la source officielle, sans inspection de chaque photographie. La fidélité des reconstructions conserve son statut antérieur.

`ProductArt` n'affiche la photographie qu'après son chargement réussi. En cas d'échec réseau, l'illustration reste visible. `tests/productPhotos-smoke.cjs` vérifie le chargement dans Chromium et un échec réseau volontaire, séparément de la scène 3D. Le composant accepte `preferIllustration` pour contrôler le rendu reconstruit même lorsqu'une photo existe.

Les silhouettes, les finitions, les nombres de pales observés, les capots, les formes de pompe et les motifs de façade sont des contrôles d'apparence. Les vis, les perforations et certains détails de surface restent illustratifs ; ils ne représentent pas des mesures CAD.
