# Prix EUR signalés par une source tierce

Le catalogue peut présenter dix correspondances explicites avec des prix EUR publiés par [xxderen/pc-build](https://github.com/xxderen/pc-build). Le libellé à conserver est **« Prix signalé (Allemagne), non revérifié »**. Il s’agit de faits rapportés par cette source tierce, pas de dix offres contrôlées directement auprès des marchands par FORGE PC.

Le jeu de données existant `docyx/pc-part-dataset` reste une source distincte : ses prix USD de juillet 2025 constituent une archive, sans conversion en EUR. Aucun montant du présent module ne provient d’une conversion monétaire ni d’une génération par IA.

## Provenance du snapshot

| Élément | Valeur |
| --- | --- |
| Dépôt / branche | `xxderen/pc-build` / `main` |
| Commit figé | `936b9f68632e413dab3bed1ebe2f6a6b56382f3b` |
| Prix | [data/prices.json au commit](https://github.com/xxderen/pc-build/blob/936b9f68632e413dab3bed1ebe2f6a6b56382f3b/data/prices.json) |
| Identités produits | [data/parts.json au commit](https://github.com/xxderen/pc-build/blob/936b9f68632e413dab3bed1ebe2f6a6b56382f3b/data/parts.json) |
| Modification globale publiée | `2026-11-09T19:00:10Z` |
| Récupération des deux fichiers et vérification des empreintes | `2026-11-09T21:05:21Z` |
| SHA-256 du fichier de prix complet | `9b72306a959e73064c7900763087739b65136fe44b03d8d5fbf0f27c10f05478` |
| SHA-256 du fichier produits complet | `5d114814e9402471b00bc9de637e910aea4fc516276b552fb96adf19cf68139f` |

Ces empreintes concernent les octets des fichiers originaux, avant toute transformation. Le fichier local `data/market-observations.json` ne contient que les dix enregistrements retenus, leur identité contrôlée et la provenance. Il ne contient ni les historiques complets, ni les photos, ni les textes éditoriaux du dépôt tiers. Aucune licence explicite n’a été trouvée dans ce dépôt lors de la consultation ; cette extraction limitée de faits et de références ne prétend pas accorder une licence sur son code ou sur le reste de sa base.

## Ce que les dates et les prix signifient

L’implémentation publiée du collecteur et de son état a été lue, sans être exécutée ni recopiée : [tracker/sources/geizhals.py](https://github.com/xxderen/pc-build/blob/936b9f68632e413dab3bed1ebe2f6a6b56382f3b/tracker/sources/geizhals.py) et [tracker/state.py](https://github.com/xxderen/pc-build/blob/936b9f68632e413dab3bed1ebe2f6a6b56382f3b/tracker/state.py).

- `sourceUpdatedAt` correspond à `prices.json.updated_at` : modification globale du fichier, qui ne prouve pas une vérification récente de chaque ligne. Un résultat ancien peut être conservé après un échec de collecte.
- `priceSince` correspond à `current.since` : début de la période où le prix est resté identique dans l’état du collecteur. Ce n’est ni une dernière vérification ni une date de validité.
- `retrievedAt` date notre lecture des JSON publiés. Cela ne constitue pas une consultation du marchand.
- `checkedAt` vaut toujours `null`. Le fichier de prix ne fournit pas de `lastChecked` par produit. La source réserve ses contrôles individuels à un autre fichier de statut de déploiement, non inclus dans ces données versionnées ; nous n’inventons donc aucun horodatage de contrôle.
- `availabilityReported` reprend `in_stock`, `shortly`, `unavailable` ou `unknown` selon la source. C’est un stock rapporté, non confirmé. `shortly` ne signifie pas « en stock ».
- `merchant` est le marchand nommé par la source ; `productURL` conduit à sa page de comparaison Geizhals, pas à un panier marchand ni nécessairement à l’offre encore disponible.
- Le marché est l’Allemagne (`DE`) et la devise l’euro. Frais de port, état neuf/occasion, livraison en France et montant final du panier ne sont pas fournis : `shippingCostEUR`, `conditionReported` et `deliveryToFrance` restent `null`.

La source privilégie les offres signalées disponibles ou prochainement disponibles, mais peut conserver une offre indisponible si aucune autre n’est trouvée. L’état est transmis explicitement, sans transformer ce choix en garantie. Les prix élevés ou anciens ne sont pas remplacés par une estimation plus attrayante.

Une [capture HTML de test du 9800X3D](https://github.com/xxderen/pc-build/blob/936b9f68632e413dab3bed1ebe2f6a6b56382f3b/tests/fixtures/heise_9800x3d.html) permet d’inspecter le format et la référence `100-100001084WOF` employés par le collecteur. Cette capture contient une offre historique du **1er octobre 2026 à 389 EUR**. Elle n’atteste ni le prix de 378 EUR signalé le 9 novembre ni le stock actuel. Aucune preuve primaire contemporaine n’est attachée aux dix prix retenus ; leur statut de signalement tiers reste visible.

## Correspondances retenues

Les IDs sont audités individuellement. La clé du catalogue, la marque, le nom, la catégorie, la finition et l’éventuelle référence constructeur doivent rester identiques. Les références ci-dessous sont extraites des liens produits de la source ; elles ne sont pas présentées comme une nouvelle vérification constructeur.

| ID catalogue | ID de la source | Variante retenue | Prix EUR signalé | Marchand | Prix identique depuis, UTC |
| --- | --- | --- | ---: | --- | --- |
| `cpu-9800x3d` | `cpu-9800x3d` | AMD Ryzen 7 9800X3D ; source boîte sans ventirad, `100-100001084WOF` | 378,00 | Mindfactory | 2026-11-09 19:00:10 |
| `import-mb-f5396b6fc639` | `board-b850-aorus-elite-wifi7-ice` | Gigabyte B850 AORUS ELITE WIFI7 ICE, ATX blanc/argent | 186,18 | voelkner.de | 2026-11-09 19:00:10 |
| `import-gpu-66e4b322eece` | `gpu-gigabyte-aero-oc` | AERO OC RTX 5070 Ti 16 Go, blanc/argent, 340 mm | 1 479,00 | Amazon.de | 2026-11-08 17:12:38 |
| `import-gpu-20aa8e7b85a7` | `gpu-gigabyte-eagle-oc-ice-sff` | EAGLE OC ICE SFF RTX 5070 Ti 16 Go, blanc/argent, 304 mm | 1 449,99 | x-kom | 2026-11-06 18:12:59 |
| `import-gpu-2ba51b8960d7` | `gpu-inno3d-x3-oc-white` | Inno3D X3 OC RTX 5070 Ti 16 Go White, 300 mm | 1 599,99 | pcspezi-kf | 2026-10-30 18:43:15 |
| `import-gpu-d6700a9c333d` | `gpu-msi-gaming-trio-oc-white` | MSI GAMING TRIO OC RTX 5070 Ti 16 Go White, 338 mm | 1 850,00 | plussafe-trading | 2026-11-07 16:05:45 |
| `import-ssd-e1b5f2393e07` | `ssd-lexar-nm790-2tb` | Lexar NM790 2 To standard, `LNM790X002T-RNNN` | 349,00 | Mindfactory | 2026-11-04 21:23:31 |
| `ssd-990evo-2` | `ssd-samsung-990-evo-plus-2tb` | Samsung 990 EVO Plus 2 To, `MZ-V9S2T0BW` / `MZ-V9S2T0B` | 339,89 | playox.de | 2026-11-03 11:36:48 |
| `import-ssd-fccc3b7b9ef6` | `ssd-wd-black-sn7100-2tb` | WD_BLACK SN7100 2 To, `WDS200T4X0E-00CJA0` | 318,89 | computeruniverse | 2026-11-07 23:48:00 |
| `import-ssd-fb11a79a58bd` | `ssd-wd-black-sn850x-2tb` | WD_BLACK SN850X 2 To standard, `WDS200T2X0E-00BCA0` | 369,00 | galaxus | 2026-10-21 20:17:19 |

Le catalogue CPU ne précise pas le conditionnement : la présentation doit donc conserver la précision « boîte sans ventirad » de la source. Le B850 ICE ne précise pas de révision PCB ; le prix ne documente pas une révision matérielle particulière. Le lien du Lexar contient la chaîne `nm690` ; il est conservé verbatim, car le nom de la source et la référence `LNM790X002T-RNNN` identifient le NM790. Le JSON local conserve cette réserve dans `exactVariantNote`.

Les déclinaisons noires, les GPU sans OC, les autres capacités, les SSD avec dissipateur et les doublons historiques ne reçoivent aucun prix par rapprochement automatique. Sont aussi exclus : RAM Corsair C30W/Z30W dont le profil XMP/EXPO et la référence ne sont pas suffisamment identifiés dans le catalogue ; Crucial T500 dont l’intitulé dissipateur et la référence sont ambigus ; Kingston KC3000 avec capacité 2000/2048 Go à clarifier ; PSU RM1000e White 2025 et AIO sans correspondance exacte. Les prix accessoires convertis USD→EUR par la source sont exclus.

## Modules et mise à jour

`src/data/marketObservations.ts` expose les observations figées, la provenance et `MARKET_MAPPINGS`. `src/lib/marketObservations.ts` expose `getMarketObservation(component)` et `matchesMarketMapping(component, mapping)`. Ces modules ne font aucune requête réseau, aucune conversion, aucune mutation des prix catalogue. Une identité modifiée renvoie `null` jusqu’à une nouvelle revue.

La couche facultative d’actualisation peut lire les deux JSON natifs de la branche `main`, en validant les mêmes identités exactes, les URL de produits, les montants et les dates. Une lecture de branche n’est pas assimilée au commit figé : `sourceCommit` reste alors `null`, `sourceURL` pointe vers la branche et `retrievedAt` date la lecture. Une telle actualisation ne transforme toujours pas un signalement tiers en prix vérifié.

Pour reproduire le snapshot : télécharger uniquement les deux JSON aux URL `raw.githubusercontent.com/xxderen/pc-build/<commit>/data/{prices,parts}.json`, vérifier leurs SHA-256, sélectionner les dix IDs source de la table, comparer les identités aux composants locaux, puis recopier les seuls champs factuels `current.price`, `merchant`, `url`, `source`, `availability`, `since` et les identifiants. Toute nouvelle référence exige sa propre revue de variante. Ne pas reprendre l’historique complet ni les descriptions éditoriales. Exécuter `npx tsx --test tests/marketObservations.test.ts` après une modification.

Un registre alternatif avec collecte déclarée par IA et état `candidate` a été écarté : il ne fournissait pas de preuves primaires suffisantes pour afficher ses nombres comme prix actuels. Les anciens tableaux de prix par puce GPU ont également été écartés, car ils ne distinguent pas les cartes partenaires, capacités et finitions.
