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
- 200 composants répartis en huit catégories : 26 CPU, 24 cartes mères, 30 GPU, 27 kits RAM, 26 SSD, 25 refroidissements, 22 alimentations et 20 boîtiers. Recherche, tri, filtres par marque, budget, type de refroidissement et compatibilité.
- 14 watercoolings AIO de 240/280/360/420 mm, avec pompe, tuyaux tressés, radiateur, ventilateurs, RGB ou écran selon la référence. Contrôle du socket et des positions de radiateur du boîtier ; avertissements sur les dégagements non garantis.
- Fiches techniques regroupées par thème : sockets, dimensions, mémoire, ventilation, radiateurs, alimentation et conseils de montage. Comparaison de trois modèles de la même catégorie, avec option pour afficher seulement les différences et filtres conservés au retour.
- Illustrations SVG détaillées selon le modèle, agrandies dans les fiches. Accès direct aux détails des pièces choisies et raccourcis vers la 3D, les composants, l’analyse et le catalogue.
- Vérifications du socket, de la mémoire, des dimensions, du format du boîtier, du refroidissement et de l’alimentation ; avertissements BIOS et montage.
- Recommandations contextuelles et estimation de l’équilibre CPU/GPU pour le gaming, la création ou un usage polyvalent, en 1080p, 1440p et 4K.
- Sauvegarde automatique du travail, configurations nommées dans `localStorage`, export texte et réinitialisation.
- Interface responsive, navigation clavier, dialogues fermables avec Échap et polices hébergées localement.

## Limites des données

Les prix sont indicatifs et le catalogue n’est connecté à aucun marchand. Les indices de performance sont des heuristiques relatives documentées dans le moteur : ce ne sont ni des benchmarks ni des mesures du pourcentage réel de bridage. Les résultats réels varient selon jeux, logiciels et réglages. Les modèles 3D reconstituent les volumes, les styles et les principaux détails de chaque référence. Ce ne sont pas des fichiers CAD fournis par les fabricants : les connecteurs, tolérances, câbles et collisions fines restent approximatifs. La compatibilité repose sur les caractéristiques du catalogue, indépendamment du rendu.

Avant achat, vérifier les fiches fabricants, les révisions BIOS, les connecteurs, les kits de montage et les dégagements combinés. Les sauvegardes restent dans le navigateur ; il n’y a ni compte utilisateur, ni backend, ni paiement.

## Organisation

- `src/data/catalog.ts` et `catalogExpansion.ts` : modèles, caractéristiques, prix et sélection initiale.
- `src/lib/compatibility.ts` : analyse, recommandations et compatibilité d’un candidat.
- `src/data/visualProfiles.ts` et `visualExpansion.ts` : enveloppes dimensionnelles et finitions propres aux 200 références.
- `src/components/PcScene.tsx` : assemblage, placement, caméra et survol.
- `src/components/scene/` : boîtiers, composants et watercooling, textures entièrement locales.
- `src/components/ProductArt.tsx` : illustrations SVG du catalogue.
- `src/components/CatalogPanel.tsx` : catalogue, filtres, fiches et comparateur.
- `src/lib/productDetails.ts` : caractéristiques et lignes de comparaison issues des données disponibles.
- `src/App.tsx` : parcours du configurateur et sauvegardes.
- `tests/compatibility.test.ts` : tests des règles et des estimations.
- `tests/visualProfiles.test.ts` : cohérence des modèles avec le catalogue.
- `tests/productDetails.test.ts` : données de fiche, valeurs manquantes et comparaisons.
- `tests/browser-smoke.cjs`, `tests/catalog-details-smoke.cjs` et `tests/scene-smoke.cjs` : parcours navigateur et contrôles de la 3D, avec Playwright/Chromium disponibles. `FORGE_TEST_URL` peut cibler une version de production servie dans un sous-dossier.

## Publication GitHub Pages

`npm run deploy:pages` compile puis publie les fichiers statiques sur la branche `gh-pages`, sans modifier le checkout de travail ni réécrire l’historique distant. GitHub Pages doit être activé pour cette branche, dossier `/` (racine). La publication effective et l’URL publique doivent être vérifiées après chaque déploiement.
