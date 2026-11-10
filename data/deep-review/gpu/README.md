# Revue approfondie des 2 474 cartes graphiques

`review.json` contient exactement une ligne par identifiant de catalogue, son archive d'origine, l'état de rapprochement et les champs de compatibilité encore absents. `parser-summary.json` donne les compteurs courants. Les modèles ambigus restent dans le catalogue comme références à confirmer ; ils ne deviennent pas des références vérifiées par ressemblance.

## Preuves et identité

- `sources/*.json` : URL demandée/finale, date réelle de collecte, statut HTTP, SHA-256 de la réponse, texte extrait et liens observés. Les réponses HTML/PDF brutes `*.html.gz` restent dans l'espace de travail et sont exclues de la livraison Git/ZIP ; elles sont récupérables à partir des URL enregistrées. Une réponse HTTP 200 générique ou bloquée ne constitue pas une fiche technique.
- `indexes/` : sitemaps, catalogues, API publiques et tâches de collecte. Les captures Exa indiquent les URL fabricant originales. La consultation d'un index sert à découvrir les pages et ne prouve pas une variante à elle seule.
- `accepted.json` : règle de rapprochement de chaque fiche acceptée, URL technique et empreinte. OC, SUPER, Ti, XT, GS, EVO, GDDR6/GDDR6X, finition et révision restent des discriminants. Les descriptions commerciales PNY « Dual/Triple Fan » et VERTO ne sont simplifiées que si le reste du nom, la capacité, la longueur et la fréquence boost concordent. Plusieurs SKU correspondant au nom archivé bloquent le rapprochement.
- `products.json` et `src/data/deepGpuCatalog.ts` : caractéristiques explicitement publiées, groupes détaillés, provenance de chaque champ numérique ajouté, notes et offres admissibles. Les unités sont conservées dans les lignes sources ; les conversions de centimètres/pouces sont explicites. Un nombre de slots ne devient jamais une épaisseur en millimètres.
- `identityKind: manufacturer-model` indique un modèle complet constructeur confirmé sans SKU commercial. `mpn` reste vide, `manufacturerModel` porte le nom et aucune offre n'est attachée. Les codes ASRock courts restent des codes de modèle ; les références commerciales 90-GA… déjà prouvées sont conservées. Les références historiques mises en quarantaine ne sont pas réintroduites par ce mode.
- `quarantine.json` documente le mauvais rapprochement historique Phantom/Phantom GS. Les finitions contradictoires d'un même MPN sont consignées séparément dans `finish-collisions.json` et les nouvelles associations ambiguës sont rejetées.
- `visual-references.json` fournit des URL d'images constructeur (métadonnées ou API produit exacte). `visuallyInspected: false` signifie qu'une URL extraite n'est pas une inspection de la photo. Ni le nombre de ventilateurs ni leurs dimensions ne sont déduits d'un nom comme X3.

## Valeurs électriques et prix

La puissance électrique de carte n'est renseignée que lorsqu'elle est explicitement publiée comme telle. Une alimentation système recommandée, un TDP thermique ou une valeur du GPU de référence ne devient pas une consommation de la carte partenaire. C'est notamment le cas des ASRock Steel Legend RX 9060 XT et des tableaux PNY où le TDP reste dans son propre champ.

`offer-proofs.json` récupère uniquement les offres principales individuelles EUR pour la France, neuves, en stock, à MPN strictement identique, dans les captures PcComponentes déjà réalisées. La date de capture et l'empreinte sont conservées ; l'extraction ne renouvelle pas artificiellement le prix. Les minima `AggregateOffer`, occasions, prix étrangers, conditions inconnues et références proches sont exclus. Les offres historiques déjà vérifiées gardent leur état et peuvent être indisponibles ; le site décide de leur admissibilité à l'affichage.

## Reproduction

Les collectes se lancent avec `python scripts/deep-gpu-catalog.py fetch --tasks <fichier JSON de indexes/>`. Elles limitent la concurrence par hôte et conservent les échecs. Ne pas relancer `seed` sans l'export runtime `/tmp/deep-gpu-current.json` : l'entrée gelée est déjà dans `input.json.gz`.

Après la collecte :

```sh
python scripts/deep-gpu-zotac.py
python scripts/deep-gpu-reference.py
python scripts/deep-gpu-powercolor.py
python scripts/deep-gpu-extract.py
python scripts/deep-gpu-offers.py
python scripts/deep-gpu-extract.py
python tests/deep-gpu-extraction.test.py
npx tsx --test tests/deepGpuCatalog.test.ts
```

Les tests des tableaux NVIDIA utilisent deux petites tables HTML originales dans `tests/fixtures/deep-gpu`, avec leur URL et l'empreinte du document d'origine. Ils vérifient les commentaires HTML obsolètes, les colonnes de modèles et les variantes de mémoire non attribuables. Les tests du catalogue contrôlent toutes les identités produites et les régressions de SKU/prix/puissance identifiées pendant la revue.
