# Catalogue et provenance des références

Le catalogue ajoute **1 300 références issues de données publiques** aux 200
références déjà présentes, soit **1 500 composants**. Les variantes retenues
correspondent chacune à une ligne existante de la source : aucune combinaison
artificielle de capacité, fréquence, modèle ou couleur n’a été créée.

| Catégorie importée | Références |
| --- | ---: |
| Mémoire DDR4 / DDR5 de bureau | 450 |
| SSD M.2 2280 PCIe 4.0 / 5.0 | 300 |
| Cartes graphiques | 300 |
| Cartes mères AM4 / AM5 / LGA1700 | 150 |
| Alimentations ATX / SFX | 100 |
| **Total ajouté** | **1 300** |

## Source figée et attribution

- Projet : [docyx/pc-part-dataset](https://github.com/docyx/pc-part-dataset).
- Révision immuable : [`c52a04ca9465c83997ed335f7767b09a2005dd26`](https://github.com/docyx/pc-part-dataset/tree/c52a04ca9465c83997ed335f7767b09a2005dd26).
- Date indiquée dans le README source : **23 juillet 2025**.
- Acquisition du snapshot : **9 novembre 2026**.
- Licence : MIT, **Copyright (c) 2021-2025 Doc Oliver**.
- Licence intégrale : [pc-part-dataset-MIT.txt](licenses/pc-part-dataset-MIT.txt),
  également distribuée avec le site dans `public/assets/catalog-license.txt`.

Cette base agrège des références de PCPartPicker. Elle ne fournit pas de SKU
constructeur ni d’URL de fiche produit pour chaque ligne. Une référence importée
désigne donc le modèle et les caractéristiques qui permettent de distinguer la
ligne source, et ne constitue pas une fiche constructeur complète ou une
garantie de disponibilité actuelle.

`data/catalog-source.json` conserve les 1 300 lignes originales sélectionnées,
leur index d’origine (base zéro), leur empreinte SHA256, une clé de déduplication
et l’empreinte de chacun des fichiers source complets. Les champs `source` de
chaque composant donnent le dépôt, le lien vers le fichier à la révision figée,
la date et l’identifiant de la ligne. Les index se rapportent aux tableaux JSON
de cette révision précise, pas à la branche `main` actuelle.

## Prix et niveau de précision

Les prix de la source sont des montants historiques en dollars américains. Ils
restent dans le snapshot d’archive pour pouvoir vérifier les lignes originales.
**Ils ne sont ni convertis en euros, ni utilisés par le site.** Chaque référence
importée porte `priceStatus: "unknown"` et un zéro technique ; l’interface affiche
« Prix non renseigné » et signale que le budget est incomplet.

Chaque référence importée porte `detailLevel: "partial"`. Les caractéristiques
non documentées restent absentes. Aucun score de performances, débit SSD,
consommation GPU, nombre de ventilateurs, dimension de dissipateur, nombre de
connecteurs ou nombre d’emplacements M.2 n’est déduit d’un nom commercial.

Les couleurs sont transcrites à partir des noms de couleur de la source. Leurs
valeurs hexadécimales et les géométries 3D sont des représentations schématiques,
pas des mesures. Le RGB est activé seulement si le nom source le mentionne.
L’absence de cette mention n’atteste pas que le produit réel n’a pas d’éclairage.

## Sélection et déduplication

Les lignes ont été réparties entre marques, plateformes, capacités et formats
pour proposer de la diversité. L’ordre source a été conservé à l’intérieur de
chaque groupe. Les clés ignorent les prix et les différences qui ne distinguent
pas clairement un produit, par exemple deux annonces du même GPU qui ne
diffèrent que par une fréquence renseignée.

- **RAM** : famille, génération DDR, vitesse, nombre de modules, capacité par
  module, CAS et couleur principale. Les familles DIMM de bureau connues sont
  retenues ; SO-DIMM, RDIMM, ECC explicite et CUDIMM sont exclus. Les familles
  Corsair Vengeance/Dominator, G.Skill Ripjaws/Trident/Flare/Aegis, Kingston FURY,
  TeamGroup T-Force/T-Create, Patriot Viper, Silicon Power, ADATA XPG et Crucial
  Pro/Ballistix fournissent les références. Les familles workstation Kingston
  FURY Renegade Pro et TeamGroup T-Create Master sont exclues même si leur nom
  n’indique pas RDIMM. Les familles ambiguës disponibles aussi en SO-DIMM
  (Vengeance simple, Ballistix simple/Sport/Sport LT, Viper Steel/4 simples et
  T-Create Classic) sont exclues lorsque la source ne permet pas de trancher.
  Les profils XMP/EXPO et la hauteur ne
  sont pas inventés lorsque la source ne les donne pas.
- **SSD** : famille et capacité, avec normalisation des noms WD/Western Digital.
  Seuls les SSD M.2 2280 PCIe 4.0/5.0 sont retenus pour éviter de présenter des
  anciens modèles PCIe AHCI comme NVMe. Les modèles à RGB explicite sont exclus.
- **GPU** : nom, puce, mémoire vidéo, couleur et longueur. La longueur source
  est utilisable pour la compatibilité ; la hauteur, l’épaisseur et la puissance
  requise demeurent inconnues.
- **Carte mère** : nom normalisé, avec équivalence des suffixes DDR4/D4 et DDR5/D5.
  Seules les plateformes prises en charge et les formats ATX, Micro-ATX et
  Mini-ITX sont retenus. Une anomalie source à un seul emplacement DIMM est
  exclue. AM4 implique DDR4 et AM5 DDR5. Sur LGA1700, le type DDR reste inconnu
  si le nom source ne l’indique pas explicitement.
- **Alimentation** : modèle, puissance, format et couleur. Les modèles à RGB
  explicite, les variantes SFX-L identifiables et les familles SFX ambiguës sont
  exclus. La longueur, la révision ATX et les connecteurs restent inconnus.

Une seconde exclusion compare ces clés aux 200 références initiales ; les
variantes qui représentent déjà une référence existante ne sont pas ajoutées.
Pour les GPU et alimentations, cette comparaison est volontairement
conservatrice : les suffixes d’édition mineurs ne servent pas à gonfler le total.
Pour comparer aux RAM historiques, la couleur est ignorée lorsque le reste de
la référence correspond : cela évite de réimporter un produit dont le coloris
historique était incomplet. Les coloris restent distincts entre nouvelles lignes
de la source, où ce champ est renseigné.

## Mémoire : kits et barrettes installées

Les 450 références de RAM comprennent des produits vendus en 1, 2 ou 4 modules.
`capacityGB` représente la capacité **totale du produit référencé** et
`memorySticks` son nombre de modules. La capacité d’une barrette est
`capacityGB / memorySticks`. `memorySpeedMTs` est le débit annoncé en MT/s,
`casLatency` le CAS déclaré, et `memoryModuleFormat` vaut `DIMM` pour les familles
de bureau sélectionnées.

La configuration des emplacements est distincte du conditionnement commercial :
installer trois barrettes ne crée pas une fausse référence de kit de trois.
L’interface et le moteur mémoire comptent les modules réellement installés et
vérifient les limites de la carte mère. Les cartes mères importées ont deux ou
quatre emplacements DIMM ; les plateformes de stations de travail à huit DIMM
ne sont pas ajoutées sans leurs processeurs et leurs règles de mémoire.

La vitesse maximale effective, le nombre de rangs, la tension, l’ECC, les QVL,
la capacité maximale par emplacement et les règles de population précises ne
figurent pas dans cette source. Le configurateur doit les présenter comme
inconnus et inviter à vérifier la documentation constructeur, sans affirmer
une compatibilité complète sur la seule base du type DDR.

## Régénérer et vérifier l’import

Le générateur fonctionne hors ligne à partir de la sélection archivée :

```sh
npx tsx scripts/import-catalog.ts
npx tsx scripts/import-catalog.ts --check
```

Il vérifie les empreintes des lignes, les identifiants uniques, les clés de
référence, les volumes par catégorie et les invariants des champs utilisés.
`--check` confirme aussi que `src/data/catalogImported.ts` correspond exactement
au snapshot et à la version actuelle du générateur.

Pour vérifier en plus chaque index et l’intégrité des fichiers source complets,
télécharger les cinq fichiers `memory.json`, `internal-hard-drive.json`,
`video-card.json`, `motherboard.json` et `power-supply.json` depuis les URL
immuables consignées dans `source.files`, puis lancer :

```sh
npx tsx scripts/import-catalog.ts --check --source-dir /chemin/vers/les/json
```

Le script ne contacte aucun marchand et ne met pas à jour les prix. Une nouvelle
révision du dataset exige une nouvelle sélection vérifiée et la mise à jour
explicite des métadonnées ; aucune actualisation implicite n’a lieu au chargement
du site.
