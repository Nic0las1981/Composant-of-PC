# Complément RAM — 10 novembre 2026

Le module `src/data/deepMemoryFollowupCatalog.ts` exporte `deepMemoryFollowupProducts`. Il est conçu pour être ajouté après `deepMemoryStorageProducts` dans l’agrégation. Aucun fichier du catalogue précédent n’est modifié par les scripts de ce dossier.

## Résultat

- 1 176 fiches existantes enrichies : 674 G.Skill, 430 TEAMGROUP et 72 Silicon Power.
- 1 434 champs nouvellement documentés : 979 dissipateurs et 455 profils mémoire.
- 9 nouveaux MPN G.Skill exacts et 4 modèles Royal Neo avec révisions commerciales non départagées.
- 4 offres françaises neuves en stock, contrôlées sur les pages PC21 directes le 10 novembre 2026. Les cinq autres pages visitées ne prouvent pas une disponibilité immédiate et ne produisent aucune offre.
- Aucune nouvelle photographie. Aucune dimension ajoutée aux fiches existantes ; les 13 nouvelles fiches disposent de la hauteur de série officielle de 44 mm.

## Contrôles d’identité

Les nouveaux MPN correspondent simultanément à la génération, capacité totale, nombre de modules, débit, CAS et finition. Le fabricant nomme la série « Trident Z5 Royal Neo » et affirme explicitement son éclairage RGB sur sa page produit. Ce passage démontre la correspondance avec le libellé archivé « Trident Z5 Royal Neo RGB » ; aucun alias de finition n’est ajouté.

Les quatre modèles CL26 ont chacun deux révisions candidates. Ils gardent `mpn: ''`, `manufacturerPartNumber: undefined` et `memoryVoltageV: undefined` ; les tensions des révisions diffèrent. Ils ne reçoivent aucun prix. `model-intersections.json` conserve les preuves de chaque candidat et les champs exclus.

Pour les produits existants, le module part de l’objet TypeScript original et fusionne uniquement les ajouts. Toutes les identités, offres, notes, sources, groupes, preuves et valeurs explicitement `undefined` précédentes restent conservés. Une nouvelle preuve peut renseigner un ancien champ inconnu ; aucune valeur déjà documentée n’est écrasée.

## Portée des preuves

- G.Skill : les annonces officielles de série prouvent uniquement la présence de dissipateurs, après rattachement exact du MPN à sa série. Les profils JEDEC viennent du tableau individuel indiquant `OC Profile Support: None` et des paramètres testés SPD.
- TEAMGROUP : le MPN doit figurer littéralement dans le tableau de la page. Les dissipateurs sont documentés dans les caractéristiques et descriptions propres au produit. Les profils proviennent du bloc `FEATURE` ou de la règle de débit publiée : 8 200 MT/s et plus pour XMP, 8 000 MT/s et moins pour XMP/EXPO. Les prudences génériques sont exclues. Le paragraphe CLASSIC DDR5 qui nomme EXPERT est exclu.
- Silicon Power : seules les caractéristiques de l’introduction du produit sont retenues, avec présence du MPN dans son tableau P/N. Les conseils génériques de bas de page ne prouvent ni XMP ni EXPO.
- Les conflits de tension ADATA et Crucial restent inconnus.

## Prix

Les résultats Exa servent à découvrir les URLs. Les montants indexés sont écartés au profit du HTML marchand direct : concordance du MPN, montant visible TTC identique au prix structuré, monnaie EUR, `NewCondition`, `InStock`, mention visible « EN STOCK » et date de mise à jour du marchand. Les pages, horodatages et SHA-256 sont conservés dans `price-pages/` et `prices.json`.

| MPN exact | Prix PC21 TTC observé | Stock visible |
| --- | ---: | ---: |
| F5-6000J2836G16GX2-TR5NS | 1 705,82 € | 54 |
| F5-6400J3039G16GX2-TR5NS | 1 752,25 € | 28 |
| F5-6400J3039G16GX2-TR5NG | 2 237,06 € | 1 |
| F5-6000J2836G16GX2-TR5NG | 2 330,82 € | 1 |

Ces montants élevés sont les prix effectivement affichés, sans estimation d’un prix de marché. Les frais de livraison ne sont pas établis et restent inconnus.

## Reproduction et vérification

1. `python3 scripts/collect-deep-memory-followup.py` : collecte les liens de présentation G.Skill observés dans les pages déjà conservées.
2. `python3 scripts/build-deep-memory-followup.py` : construit les compléments techniques et identités.
3. `python3 scripts/collect-deep-memory-followup-prices.py` : vérifie les URLs PC21 découvertes par Exa et conserve les réponses natives.
4. `python3 scripts/build-deep-memory-followup.py` : intègre les offres éligibles.
5. `npx tsx --test tests/deep-memory-followup.test.ts tests/memoryDetails.test.ts` : contrôle les identités, intersections, preuves, montants, empreintes des pages et propriétés mémoire.

Les collecteurs réutilisent les captures déjà conservées pour assurer la reproductibilité ; leurs horodatages ne sont pas remplacés par la date d’une reconstruction.
