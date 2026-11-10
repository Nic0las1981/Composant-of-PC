# Revue Super Flower

71 entrées examinées individuellement ; 41 enrichies (28 MPN publiés, 13 désignations complètes de modèle sans faux MPN), 764 lignes techniques. `review.json` conserve une décision pour chacun des 71 ID. `products.json` alimente `deepPowerFlowerCatalog.ts` / `deepPowerFlowerProducts`.

## Preuves et reproduction

Le collecteur `scripts/deep-power-fetch.py` conserve URL, date, statut, SHA-256, tableaux, liens et texte des pages publiques. Les réponses Exa `fetch-*.json` et `search-*.json` sont datées ; les recherches servent à découvrir les pages, jamais à fournir seules leurs caractéristiques. `documents.json` contient les documents effectivement extraits et leur empreinte. Les HTML bruts compressés sont un cache de travail, pas une dépendance des tests. Les URL d’images sont des pistes **non inspectées**, distinctes des caractéristiques techniques.

Le lot exploite les 143 sources Super Flower de `power-chassis`, les matrices HTML actuelles (colonnes masquées incluses), les archives du distributeur japonais Dirac et l’ancien catalogue constructeur hébergé chez e-goodnews. Des fiches marchands exactes Alza, PC Case Gear, WIND NET, TerabyteShop, MDComputers, Amazon et eTechBuy complètent les modèles retirés. Aucun prix étranger, montant nul ou ancienne offre hors stock n’est importé comme offre française.

Reproduire : `python scripts/deep-power-flower.py`. Tests : `python tests/deep-power-flower-silverstone.test.py` et `npx tsx --test tests/deepPowerFlowerSilverstone.test.ts`.

## Restrictions conservées

- Les éditions originales HG et les nouvelles GE « Gold UP » restent séparées. Le raccord UP → GE est prouvé pour chaque puissance intégrée ; le 650 W reste sans alias primaire individuel suffisant.
- Les VII XG / Platinum PRO et Zillion FG ne reçoivent pas les données d’une nouvelle édition ATX 3.1 lorsqu’une révision d’origine ne peut pas être identifiée. Des MPN XG ont été réutilisés entre générations.
- Les V Gold PRO V2 ne sont pas attribuées aux noms non versionnés. Aucun coloris blanc ne reçoit la fiche noire après suppression d’un token de couleur.
- Dirac publie des axes inhabituels W180 × D150 pour les Platinum SE 1000/1200 W : ces dimensions ne deviennent pas des champs de compatibilité. Une autre fiche constructeur originale confirme séparément L180 × W150 × H86 pour la SE 1200 W noire, qui peut donc recevoir ces valeurs.
- Les quantités de câbles, connecteurs et puissances combinées des rails sont distinctes. Les cellules HTML fusionnées sont dépliées avec leur portée. Les valeurs entre parenthèses chez Dirac désignent les câbles.
- La fiche 650R14HE annonce explicitement 130 mm sur Amazon ; les 120 mm des autres puissances Bronze Pro ne lui sont pas transférés. Le résumé de connectique MDComputers 1600HP contredit sa table détaillée : le résumé est exclu, et la divergence reste signalée.
- Les codes JAN et garanties japonaises restent régionaux. Les fiches qui ne publient qu’un modèle conservent `identityKind: manufacturer-model` et un MPN vide.

Les 30 entrées restantes n’ont pas de rapprochement primaire unique suffisamment établi : révisions VII/XG/Zillion/V Gold, finitions MP blanches, anciens Gold, Amazon et Golden Green HX 450 notamment. Les candidats et motifs connus restent dans l’audit ; le statut ne prétend pas qu’une preuve future serait impossible.
