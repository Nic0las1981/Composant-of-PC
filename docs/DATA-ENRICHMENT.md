# Descriptions et caractéristiques issues de données structurées

Les 10 359 variantes de l’import disposent maintenant d’une description
spécifique à leurs caractéristiques documentées. Ces textes sont composés en
français par `scripts/import-catalog.ts` à partir des lignes du snapshot
`data/catalog-source.json`. Ils ne sont ni des descriptions copiées chez un
marchand, ni une nouvelle vérification auprès de chaque fabricant.

La source reste [docyx/pc-part-dataset](https://github.com/docyx/pc-part-dataset),
révision immuable
[`c52a04ca9465c83997ed335f7767b09a2005dd26`](https://github.com/docyx/pc-part-dataset/tree/c52a04ca9465c83997ed335f7767b09a2005dd26),
datée du 23 juillet 2025. La provenance, les empreintes des lignes et la licence
MIT sont détaillées dans [CATALOGUE.md](CATALOGUE.md). La date de ce travail
d’enrichissement ne devient pas une date de validation des caractéristiques.

## Ce que les descriptions expliquent

| Catégorie | Informations reprises de la source |
| --- | --- |
| RAM | Génération DDR, capacité totale, nombre de barrettes, capacité par barrette, débit annoncé et CAS. XMP, EXPO ou RGB seulement s’ils sont explicitement mentionnés dans le nom de la référence. |
| SSD | Capacité, format M.2-2280, interface PCIe déclarée et quantité de cache lorsqu’elle existe. |
| GPU | Puce, mémoire vidéo, longueur, fréquence déclarée et boost lorsqu’ils existent. |
| Carte mère | Socket, format, nombre de DIMM et capacité mémoire maximale déclarée. La génération DDR suit les règles documentées de l’import ; elle reste inconnue pour une carte LGA1700 non identifiée. |
| Alimentation | Puissance nominale, format, certification déclarée et câblage fixe, semi-modulaire ou modulaire, y compris la mention de connecteurs latéraux. |

L’import sélectionné fournit notamment :

- 3 832 valeurs de latence CAS théorique en nanosecondes pour la RAM ;
- 66 quantités de cache SSD, sans en préciser la technologie ;
- 2 443 fréquences GPU déclarées et 2 206 valeurs de boost ;
- 1 722 certifications d’alimentation déclarées, sur 1 798 alimentations.

Ces données étaient déjà conservées dans les lignes techniques `specs`. Les
nouvelles descriptions les présentent avec le contexte de la référence choisie,
au lieu d’un texte général identique pour tous les composants d’une catégorie.
Les détails et limites restent accessibles sur la fiche complète, même lorsque
l’aperçu de la carte est raccourci.

## Précision et valeurs inconnues

- Le champ GPU `core_clock` est une **fréquence déclarée par la source**. Il
  n’est pas renommé arbitrairement « fréquence de base », car les enregistrements
  peuvent désigner une fréquence de base ou de jeu. Un boost annoncé n’est pas
  une fréquence garantie dans toutes les charges.
- La latence CAS théorique de la RAM correspond à `2000 × CL / débit en MT/s`.
  Les 3 832 valeurs concordent à 0,0011 ns près avec ce calcul, compte tenu des
  arrondis de la source. Ce n’est pas une mesure de latence mémoire complète ni
  un benchmark du PC.
- La quantité de cache d’un SSD ne permet pas de conclure qu’il s’agit de DRAM,
  de SLC, ou d’une autre technique. Une valeur absente ne signifie pas « sans
  cache » ou « sans DRAM ».
- Le format M.2-2280 correspond au **format nominal du circuit : 22 × 80 mm**.
  Cette indication ne devient pas une dimension totale du produit avec son
  dissipateur. Aucune hauteur, largeur de dissipateur ou collision n’est déduite.
- Une certification d’alimentation est rapportée telle que déclarée dans la
  source. Le texte n’affirme pas une vérification dans les bases de certification.
- Consommation GPU, connecteurs, révision ATX, rangs des barrettes, tension,
  hauteur, endurance SSD et performances mesurées restent absents quand ils ne
  sont pas documentés. Aucun champ de compatibilité n’est ajouté à partir du
  rendu 3D ou d’une description générée.

## Deux interfaces SSD à confirmer

Les lignes Nextorage NN5PRO de 1 To et 2 To indiquent dans la source
`M.2 PCIe 4.0 X8`. Ce nombre de lignes est inhabituel pour le format M.2. Les
identifiants `import-ssd-ff34b619ab04` et `import-ssd-fe60286e5d1e` restent valides
pour les sauvegardes, et la donnée originale est conservée. Le descriptif et les
spécifications signalent explicitement **« interface à confirmer »**. Le système
ne remplace pas cette valeur par PCIe 4.0 ×4 ou PCIe 5.0 ×4 sans nouvelle preuve.

## Reproduction

```sh
npx tsx scripts/import-catalog.ts
npx tsx scripts/import-catalog.ts --check --source-dir /chemin/vers/les/json
```

L’enrichissement ne modifie aucun identifiant, groupe de coloris, capacité,
dimension physique, socket, prix ni règle de compatibilité. Le catalogue garde
9 221 modèles hors coloris et 10 564 variantes, en incluant les références
historiques et les cinq modules Samsung OEM. Les contrôles de provenance du
générateur et les tests existants des fiches, des profils visuels et des variantes
vérifient que les données inconnues ne deviennent pas des caractéristiques
inventées.

## Repères de prix d’archive, séparés du budget

Une seconde extraction, `scripts/import-price-archive.ts`, conserve les
**3 265 montants positifs en USD** déjà présents dans ce même snapshot public.
Elle produit `src/data/catalogPriceArchive.ts` et n’écrit aucun prix en euros
dans le catalogue de compatibilité.

| Catégorie | Variantes avec montant USD archivé |
| --- | ---: |
| RAM | 1 092 |
| SSD | 447 |
| GPU | 827 |
| Carte mère | 562 |
| Alimentation | 337 |
| **Total** | **3 265** |

Ces montants sont des **repères historiques du marché américain**, et non des
offres marchandes actuelles. Le 23 juillet 2025 est la date de l’archive : aucune
date d’observation individuelle n’est disponible (`observedAt: null`). Le vendeur,
le stock, les taxes, la livraison et l’état du produit ne sont pas documentés.
L’affichage précise la devise `USD`, sans conversion ni remplacement du budget
EUR. Pour la RAM, le montant de la ligne concerne la référence du kit, pas une
barrette détachée vendue au prorata.

`getPriceArchive(component)` exige une concordance entre l’identifiant de la
variante, sa catégorie, le dépôt source, la révision figée, la date du snapshot,
l’identifiant de ligne et son URL immuable. Le montant doit être fini et
strictement positif. Une finition sans prix ne reprend jamais celui d’une autre
couleur ; une référence historique ou Samsung OEM sans ligne de prix reste sans
repère. Les champs de budget EUR, le calcul des kits entiers et le statut de
prix non vérifié restent inchangés.

```sh
npx tsx scripts/import-price-archive.ts
npx tsx scripts/import-price-archive.ts --check --source-dir /chemin/vers/les/json
node --import tsx --test tests/priceArchive.test.ts tests/pricing.test.ts
```

Le générateur vérifie les identifiants stables, les empreintes de toutes les
lignes du snapshot, les index source, les volumes et la conservation des anciens
identifiants. Avec `--source-dir`, il contrôle aussi les empreintes des fichiers
JSON complets et la correspondance des lignes d’origine. Il ne contacte aucun
marchand et n’exécute aucun code provenant des sources de données.
