# FORGE — Configurateur PC 3D

Application en français pour composer un PC, vérifier les compatibilités matérielles et estimer son équilibre selon l’usage et la résolution.

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

- Tour 3D interactive avec rotation, sélection des composants et vue éclatée, construite avec Three.js et React Three Fiber. Aperçu de secours sans WebGL.
- 32 composants répartis en huit catégories, recherche, tri et filtre de compatibilité.
- Vérifications du socket, de la mémoire, des dimensions, du format du boîtier, du refroidissement et de l’alimentation ; avertissements BIOS et montage.
- Recommandations contextuelles et estimation de l’équilibre CPU/GPU pour le gaming, la création ou un usage polyvalent, en 1080p, 1440p et 4K.
- Sauvegarde automatique du travail, configurations nommées dans `localStorage`, export texte et réinitialisation.
- Interface responsive, navigation clavier, dialogues fermables avec Échap et polices hébergées localement.

## Limites des données

Les prix sont indicatifs et le catalogue n’est connecté à aucun marchand. Les indices de performance sont des heuristiques relatives documentées dans le moteur : ce ne sont ni des benchmarks ni des mesures du pourcentage réel de bridage. Les résultats réels varient selon jeux, logiciels et réglages. La vue 3D est une illustration de l’assemblage, pas un modèle exact de chaque référence.

Avant achat, vérifier les fiches fabricants, les révisions BIOS, les connecteurs, les kits de montage et les dégagements combinés. Les sauvegardes restent dans le navigateur ; il n’y a ni compte utilisateur, ni backend, ni paiement.

## Organisation

- `src/data/catalog.ts` : modèles, caractéristiques, prix et sélection initiale.
- `src/lib/compatibility.ts` : analyse, recommandations et compatibilité d’un candidat.
- `src/components/PcScene.tsx` : scène 3D entièrement locale.
- `src/components/ProductArt.tsx` : illustrations SVG du catalogue.
- `src/App.tsx` : parcours du configurateur et sauvegardes.
- `tests/compatibility.test.ts` : tests des règles et des estimations.
