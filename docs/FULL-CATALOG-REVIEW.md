# Contrôle de toutes les variantes — 10 novembre 2026

<!-- COUNTS:START -->
- **10 564 variantes recherchées sur 10 564**  aucune recherche en attente.
- **435 références documentées par des pages primaires** : 162 dossiers manuels conservés et 273 nouveaux dossiers marchands.
- **458 observations de prix**  dont 87 historiques. **328 références** avaient une offre neuve disponible admissible au bilan du 10 novembre à 10:03 UTC  hors livraison.
- **26 références avec source fabricant consultée**. Une fiche marchande acceptée ne devient pas une validation fabricant.
- **10 564 contrôles de cohérence réussis**  zéro erreur détectée ; **9 609 fiches** ont encore au moins une donnée utile à la compatibilité absente.
- **10 129 variantes sans page primaire acceptée** restent à confirmer. Les autres fiches peuvent également conserver des champs inconnus.
- Amazon.fr : 60 recherches  57 pages lisibles  36 MPN retrouvés dans les tableaux ; **aucun prix Amazon admis** sans conditions de vente et livraison françaises confirmées.

Résultats de la campagne PcComponentes  indépendamment des dossiers manuels déjà documentés :

| Résultat | Variantes |
| --- | ---: |
| Correspondance marchande retenue | 348 |
| Aucune correspondance exacte retenue | 10114 |
| Plusieurs MPN possibles | 14 |
| MPN commun à des variantes contradictoires | 13 |
| Recherche sans données exploitables | 74 |
| Accès échoué | 1 |
<!-- COUNTS:END -->

## Portée et limites

Toutes les variantes passent un contrôle de cohérence : identifiants, unités positives, composition des kits, capacités, puissance et correspondance avec la ligne archivée. Ce contrôle structurel ne prouve ni une caractéristique fabricant, ni une compatibilité complète. Le rapport `data/full-review/integrity.json` indique les champs encore absents pour chaque composant.

Chaque variante fait ensuite l’objet d’une recherche directe sur PcComponentes.fr. Au maximum deux pages produits candidates sont consultées par recherche. Le nom, la marque, les suffixes et révisions, le kit, la génération et le débit mémoire, la latence, la capacité, la puissance et la finition sont comparés lorsqu’ils sont renseignés. Une couleur citée pour un autre modèle, le SPD d’un kit ou une compatibilité rétroactive ne remplacent pas les valeurs de la variante sélectionnée. Les générations PCIe contradictoires et les MPN associés à des variantes incompatibles sont écartés.

Une recherche non concluante signifie « aucune correspondance retenue parmi les pages consultées », jamais « produit introuvable chez tous les vendeurs ». Une correspondance commerciale acceptée conserve le MPN indiqué par le marchand ; elle n’identifie pas rétrospectivement un MPN absent de l’archive avec la certitude d’une fiche fabricant. Les données encore absentes restent inconnues. Les valeurs techniques marchandes sont affichées avec leur provenance ; seule une tension RAM explicite et unique est transférée automatiquement aux métadonnées de compatibilité.

La première sélection manuelle auprès de PcComponentes, Fnac, LDLC et des fabricants est conservée et prioritaire sur les ajouts automatiques. Son [bilan détaillé](VERIFICATION-2026-11-10.md) explique les corrections fabricant.

## Amazon.fr

60 MPN répartis entre les catégories ont été recherchés. Les résultats de recherche servent uniquement à découvrir des liens. Les pages accessibles sont conservées dans `amazon-pages-live.json`, et les références des tableaux produits dans `amazon-outcomes.json`.

La présence d’un MPN dans un tableau ne certifie pas le vendeur, la variante sélectionnée, l’état ou une livraison en France. Les lots avec garantie prolongée ou pâte thermique, les pages de variantes différentes et les offres affichées pour une destination étrangère ne reçoivent pas un prix vérifié. Aucun prix de recommandation, de carrousel ou « autres vendeurs » n’est utilisé. Les MPN retrouvés peuvent apporter un lien source explicitement marqué « offre non confirmée ».

## Prix et traçabilité

Les prix supplémentaires proviennent exclusivement de l’objet `Offer` de la page produit principale : montant EUR positif, vendeur nommé, état et disponibilité conservés. Un minimum d’`AggregateOffer` ne suffit jamais. L’offre imbriquée doit elle-même être complète. Un état usagé ou reconditionné l’emporte sur une enveloppe de produit annoncée neuve. Les frais inconnus ne deviennent pas gratuits.

Les règles de budget restent : MPN correspondant, neuf, disponible et consultation datant d’au plus 24 heures, hors livraison. Les anciennes observations et offres exclues restent visibles. Les archives USD ne sont pas converties ni ajoutées au budget EUR. Voir [PRIX.md](../PRIX.md).

`outcomes.json` fournit le résultat de chaque identifiant ; `rejections.json` conserve les motifs de rejet. `reviews.jsonl.gz` contient les requêtes, URL, dates, statuts HTTP, projections du produit principal et empreintes des réponses ou préfixes lus. Les pages HTML intégrales du cache temporaire ne sont pas distribuées. L’empreinte documente le relevé effectué ; la projection conservée ne permet pas de reconstruire la réponse HTML complète.

`input.json.gz` fige les identités avant cet enrichissement pour empêcher une attribution automatique antérieure de valider son propre MPN à l’import suivant. Les identifiants et sauvegardes existants restent stables.

## Reproduire l’intégration et vérifier

```sh
npx tsx scripts/export-review-input.ts
python3 scripts/import-full-review.py
npm run import:verified
python3 scripts/check-entire-catalog.py --current
npm run audit:catalog
python3 scripts/archive-catalog-review.py
python3 tests/catalog-review.test.py
npm test
npm run build
node tests/verified-offers-browser-smoke.cjs
node tests/catalog-control-browser-smoke.cjs
```

Ces imports relisent les preuves figées, sans réactualiser les boutiques. Pour une nouvelle collecte réseau, installer `scripts/requirements-review.txt`, puis lancer `scripts/collect-catalog-review.py`. Le collecteur reprend les identifiants déjà enregistrés ; une nouvelle campagne nécessite d’archiver les résultats et le cache précédents. Les erreurs ou blocages restent des résultats non confirmés, sans contournement.

Validation de ce lot : 152 tests applicatifs et 14 tests Python passent. Les deux parcours navigateur passent à 1 440 et 390 pixels : sources et prix exclus, lien Amazon sans offre admise, persistance des sélections, fiches confirmées, non concluantes, ambiguës et contradictoires, sans débordement horizontal. Build de production et intégrité des archives ZIP vérifiés.
