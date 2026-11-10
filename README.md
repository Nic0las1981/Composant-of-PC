# FORGE — Configurateur PC 3D

Application en français pour composer un PC, vérifier les compatibilités matérielles et estimer son équilibre selon l’usage et la résolution.

Site public : https://nic0las1981.github.io/Composant-of-PC/

## Mettre le site en ligne sans installation

Le livrable `release/forge-site.zip` contient le site déjà compilé : décompressez-le et déposez **son contenu** chez votre hébergeur statique. Il fonctionne à la racine comme dans un sous-dossier. Aucune clé API, base de données ou commande n’est nécessaire côté hébergement. Voir `MISE-EN-LIGNE.txt`.

Pour recréer les archives depuis le code (Node.js et Python 3) :

```sh
npm ci
npm run package:site
```

Cette commande produit `release/forge-site.zip`, `release/forge-sources.zip` et les empreintes SHA-256. L’archive source sert aux modifications futures ; seule l’archive site doit être déployée.

## Démarrer

Node.js 22.12+ (validé avec Node 24) et npm sont nécessaires.

```sh
npm ci
npm run dev
```

Dans l’environnement cloud, le cache npm peut être dirigé vers un emplacement accessible :

```sh
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
```

## Vérifier et compiler

```sh
npm test
npm run build
npm run preview -- --port 4173
```

## Fonctionnalités

- Tour 3D adaptée aux références sélectionnées : dimensions, formes, finitions, couleurs, ventilateurs et éclairages. Survol avec noms réels, sélection au clic, zoom, vues face/profil/3-4, panneau latéral et vue éclatée. Aperçu de secours sans WebGL.
- Rotation automatique douce en vue 3/4, suspendue au survol et pendant la manipulation, avec reprise après 6,5 secondes. Ventilateurs animés (rotor mobile, cadre fixe), RGB multicolore uniquement sur les zones renseignées et surbrillance progressive des surfaces au survol. Commande de pause globale et prise en compte du mouvement réduit.
- Détails de montage et matériaux enrichis : GPU et radiateurs AIO ouverts avec ailettes visibles, backplates découpées, circuits/contacts/VRM, PCB RAM encochés, raccords et tressage en relief, câbles des alimentations fixes, verre épais, rebords, vis et filtres. Peinture, métal brossé, plastique et PCB utilisent quatre textures procédurales partagées ; éclairage studio et reflets sans fichier distant.
- 9 221 modèles hors coloris répartis en huit catégories : 26 CPU, 1 496 cartes mères, 2 353 GPU, 2 723 références RAM, 832 SSD, 25 refroidissements, 1 748 alimentations et 18 boîtiers. Ils représentent 10 564 variantes sélectionnables, dont 10 359 issues de références réelles archivées et cinq modules Samsung OEM documentés. Le catalogue n’est pas exhaustif ; voir [sa provenance et ses limites](docs/CATALOGUE.md).
- Recherche, pagination de 36 modèles et filtres par marque, famille, budget, DDR, capacité du kit ou **capacité par barrette**, barrettes par kit, débit, type de module, organisation des puces, socket, emplacements mémoire et compatibilité. Les rangs et tensions inconnus restent non renseignés. Les Samsung incluent une vraie référence **16 Go 2Rx8 UDIMM DDR4-3200**, avec [preuves SPD](docs/OEM-MEMORY.md).
- Coloris regroupés sur une même fiche lorsqu’ils sont documentés : l’aperçu, les caractéristiques et le prix suivent la finition choisie. La configuration ne change qu’après « Choisir ». Les anciens identifiants restent valides et changer la finition d’une RAM de la même fiche conserve les emplacements et les autres barrettes.
- Catalogue classé par défaut du plus récent au plus ancien, avec tri inverse et filtre par famille : génération CPU/GPU, chipset ou gamme commerciale. Les fiches et comparaisons distinguent le modèle, la génération et la gamme ; les références sans repère restent en dernier dans les deux sens. Le choix d’une barrette par emplacement suit le même classement. Voir [la précision des repères chronologiques](docs/CHRONOLOGIE.md).
- Mémoire configurée par quantité ou emplacement : 1, 2, 3 ou 4 barrettes selon la carte mère, références mélangées, capacité par module et totale, schéma A1/A2/B1/B2 et placement conseillé. Le moteur distingue kits achetés et modules installés, calcule les kits entiers et les barrettes restantes, conserve les dépassements après changement de carte mère et explique canaux, débit commun et risques de mélange. Chaque barrette apparaît séparément en 3D avec son modèle, sa couleur, son RGB et son étiquette au survol.
- 14 watercoolings AIO de 240/280/360/420 mm, avec pompe, tuyaux tressés, radiateur, ventilateurs, RGB ou écran selon la référence. Contrôle du socket et des positions de radiateur du boîtier ; avertissements sur les dégagements non garantis.
- Descriptions de 10 359 variantes enrichies à partir des faits disponibles : capacités, modules, débit, CAS, horloges GPU déclarées, longueur, format, alimentation et câblage. Les fiches exposent aussi les caches SSD et les paramètres techniques sourcés, avec les anomalies à confirmer.
- Prix : 162 références contrôlées sur des pages marchands et fabricants le 10 novembre 2026, avec 183 relevés d’offres ou derniers prix, MPN exact, vendeur, état, disponibilité et date. Les offres neuves disponibles entrent dans le budget pendant 24 h, hors livraison ; les derniers prix historiques et reconditionnés restent hors budget. Voir [le bilan de vérification](docs/VERIFICATION-2026-11-10.md).
- Prix : 10 correspondances EUR issues d’un suivi public de comparateur, actualisables au chargement sans clé ni backend, avec pays et dates distincts ; 3 265 archives USD liées aux variantes, affichées et triées séparément du budget. Voir [PRIX.md](PRIX.md).
- Fiches techniques regroupées par thème : sockets, dimensions, mémoire, ventilation, radiateurs, alimentation et conseils de montage. Comparaison de trois modèles de la même catégorie, avec option pour afficher seulement les différences et filtres conservés au retour.
- Illustrations SVG détaillées selon le modèle, agrandies dans les fiches : circuits, contacts, étiquettes, variantes blanches et mémoire OEM à puces apparentes. Le rendu 3D des modules OEM montre leur circuit vert sans dissipateur ni RGB inventé. Accès direct aux détails des pièces choisies et raccourcis vers la 3D, les composants, l’analyse et le catalogue.
- Vérifications du socket, de la mémoire, des dimensions, du format du boîtier, du refroidissement et de l’alimentation ; avertissements BIOS et montage.
- Recommandations contextuelles et estimation de l’équilibre CPU/GPU pour le gaming, la création ou un usage polyvalent, en 1080p, 1440p et 4K.
- Sauvegarde automatique du travail, configurations nommées dans `localStorage`, export texte et réinitialisation.
- Interface responsive, navigation clavier, dialogues fermables avec Échap et polices hébergées localement.

## Limites des données

Les 200 prix initiaux sont des estimations. Les relevés directs de 162 références passent désormais en priorité ; un produit contrôlé dont les offres sont indisponibles, historiques ou expirées ne reprend pas son ancienne estimation. 10 402 variantes restent sans contrôle individuel auprès des sources demandées ; elles ne sont pas présentées comme vérifiées. Un signalement EUR correspondant exactement au modèle et à la finition peut les remplacer comme repère indicatif si sa source est récente et rapporte du stock ; le pays Allemagne et les limites restent visibles. Les dates du fichier et du dernier changement ne certifient pas un contrôle de l’offre. Les archives USD restent hors budget EUR. Les autres prix demeurent inconnus et rendent le budget partiel. Le navigateur lit un registre public GitHub et les relevés marchands intégrés au dernier déploiement. Il ne consulte pas les boutiques en temps réel. Aucun prix ni stock n’est garanti au paiement. Voir [PRIX.md](PRIX.md), [les correspondances](docs/MARKET-SOURCES.md) et [l’actualisation](docs/MARKET-FEED.md).

Les indices de performance sont des heuristiques relatives documentées dans le moteur : ce ne sont ni des benchmarks ni des mesures du pourcentage réel de bridage. Les résultats réels varient selon jeux, logiciels et réglages. Les 200 modèles 3D initiaux reconstituent les volumes, les styles et les principaux détails des références. Les ajouts disposent d’aperçus schématiques : leurs dimensions absentes, connecteurs ou performances ne sont pas inventés pour la compatibilité. Les contrôles incomplets sont signalés et l’indice CPU/GPU est indisponible lorsque les scores manquent. Ce ne sont pas des fichiers CAD fournis par les fabricants : les connecteurs, tolérances, câbles et collisions fines restent approximatifs. La compatibilité repose sur les caractéristiques du catalogue, indépendamment du rendu. La vitesse des ventilateurs et les écrans illustrent une configuration en fonctionnement ; aucune télémétrie matérielle réelle n’est collectée.

Avant achat, vérifier les fiches fabricants, les révisions BIOS, les connecteurs, les kits de montage et les dégagements combinés. Les sauvegardes restent dans le navigateur ; il n’y a ni compte utilisateur, ni backend, ni paiement.

## Organisation

- `src/data/catalog.ts`, `catalogExpansion.ts` et `catalogImported.ts` : références, caractéristiques, prix connus et sélection initiale.
- `src/data/catalogOemMemory.ts`, `src/lib/memoryDetails.ts` et `docs/OEM-MEMORY.md` : modules OEM, organisation mémoire et preuves des caractéristiques.
- `src/lib/catalogVariants.ts` et `src/data/legacyVariants.ts` : fiches regroupées et finitions, sans remplacer les identifiants des sauvegardes.
- `data/catalog-source.json`, `scripts/import-catalog.ts` et `docs/CATALOGUE.md` : lignes source, import reproductible, provenance et licence.
- `src/data/releaseTimeline.ts`, `src/lib/catalogFamilies.ts` et `catalogOrdering.ts` : repères de lancement, familles et tri chronologique indépendant des prix et dates d’import.
- `src/lib/memory.ts` et `src/components/MemoryConfigurator.tsx` : modules par emplacement, capacité, kits, canaux et interface mémoire.
- `src/lib/compatibility.ts` : analyse, recommandations et compatibilité d’un candidat.
- `src/data/visualProfiles.ts`, `visualExpansion.ts` et `importedVisualProfiles.ts` : reconstitutions des 200 références initiales et aperçus schématiques des imports.
- `src/components/PcScene.tsx` : assemblage, placement, caméra et survol.
- `src/components/scene/` : boîtiers, composants et watercooling, textures entièrement locales.
- `src/components/ProductArt.tsx` : illustrations SVG du catalogue.
- `src/components/CatalogPanel.tsx` : catalogue, filtres, fiches et comparateur.
- `data/evidence/`, `data/verified-source-manifest.json`, `scripts/import-verified-catalog.py` et `src/data/verifiedCatalog.ts` : preuves primaires, import reproductible, MPN, caractéristiques et relevés directs. `npm run audit:catalog` produit le bilan complet des références non contrôlées.
- `src/data/pricing.ts` : prix EUR de référence, provenance, expiration des signalements et recherches par variante.
- `data/market-observations.json`, `src/data/marketObservations.ts`, `src/lib/marketFeed.ts` : correspondances auditées, snapshot et actualisation bornée du registre public.
- `scripts/import-price-archive.ts`, `src/data/catalogPriceArchive.ts`, `src/lib/priceArchive.ts` : archives USD reproductibles, distinctes du budget.
- `src/components/scene/SurfaceTextures.ts` : textures procédurales partagées des matériaux.
- `src/components/scene/SceneAnimation.tsx` : commande commune des mouvements et prise en compte du mouvement réduit.
- `src/lib/productDetails.ts` : caractéristiques et lignes de comparaison issues des données disponibles.
- `src/App.tsx` : parcours du configurateur et sauvegardes.
- `tests/compatibility.test.ts` et `tests/memory.test.ts` : règles, estimations, configurations de mémoire et prix des kits.
- `tests/visualProfiles.test.ts` : cohérence des modèles avec le catalogue.
- `tests/productDetails.test.ts` : données de fiche, valeurs manquantes et comparaisons.
- `tests/browser-smoke.cjs`, `tests/catalog-details-smoke.cjs`, `tests/catalog-order-smoke.cjs`, `tests/catalog-variants-smoke.cjs`, `tests/realism-browser-smoke.cjs`, `tests/price-sources-browser-smoke.cjs`, `tests/motion-smoke.cjs`, `tests/memory-browser-smoke.cjs` et `tests/scene-smoke.cjs` : parcours navigateur et contrôles de la 3D, avec Playwright/Chromium disponibles (le contrôle des pixels dans `motion-smoke.cjs` utilise aussi `pngjs`). `FORGE_TEST_URL` peut cibler une version de production servie dans un sous-dossier.

## Publication GitHub Pages

`npm run deploy:pages` compile puis publie les fichiers statiques sur la branche `gh-pages`, sans modifier le checkout de travail ni réécrire l’historique distant. GitHub Pages doit être activé pour cette branche, dossier `/` (racine). La publication effective et l’URL publique doivent être vérifiées après chaque déploiement.
