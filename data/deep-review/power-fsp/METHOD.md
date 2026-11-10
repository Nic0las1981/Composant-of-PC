# FSP : revue des 109 références du catalogue

Revue arrêtée le 10 novembre 2026. Le registre `deepFspCatalog.ts` contient 108 dossiers : 104 disposent d'une source fabricant, dont trois ne conservent que l'intersection de deux révisions, et quatre reposent uniquement sur des détaillants historiques. Ces quatre dossiers ne sont pas présentés comme des identités confirmées par FSP. SAGA+ 400R reste exclue.

`completion.json` détaille chaque ID et chaque champ requis. Dix-sept dossiers satisfont la liste technique ; 87 dossiers fabricant restent partiels. Les quatre dossiers détaillants et l'identité exclue restent `identity_missing` selon les règles du site. Aucun prix actuel n'a été ajouté. Deux numéros commerciaux sont explicitement publiés : 9PA6502502 dans le PDF FSP650-80EGN et PPA4001912 dans la présentation VITAL400 de FSP Group USA. Les autres dossiers utilisent une identité de modèle sans prétendre connaître un SKU régional.

## Sources réellement consultées

- 163 captures de l'index courant FSP dans le dossier partagé `../power-chassis/sources/extra-fsp-*.json`.
- Index historiques FSP global, États-Unis et Japon ; 119 liens uniques issus des index et 59 liens de variantes exactes. Les pages pertinentes et leurs reçus sont conservés dans `sources`, `raw` et `tables`.
- 43 recherches de familles puis recherches individuelles complémentaires, conservées dans `searches` et `followup-searches`. Les résultats de recherche servent à découvrir des pages ; les chiffres admis proviennent des fiches exactes ou des documents explicites cités.
- PDF FSP650-80EGN intégral consulté et inspecté visuellement ; fiche officielle ATX400-PNT ; présentation originale VITAL400 de FSP Group USA ; anciennes fiches Newegg SAGA450/500, ATXPowerSupplies ZEN400 et RootNet EVEREST85PLUS800. Les quatre dernières sont étiquetées `retailer`.

Les reçus JSON conservent URL, date et empreinte du contenu lorsqu'il a été capturé nativement. Les archives HTML gzip restent dans le workspace et sont ignorées dans la publication. Les tableaux développés et groupes techniques permettent de réexaminer les faits sans ces fichiers volumineux. Les captures Exa conservent leur réponse et leur date d'extraction distinctement.

## Choix explicites et limites

- Les puissances, finitions et suffixes PRO, M, Gen5, ATX3.0, ATX3.1 et White sont comparés séparément. Les pages de puissance voisine ne fournissent aucune valeur.
- `corrections.json` documente HEXA85+ 850→650W : la fiche originale BL22FT porte la pièce HEXA85+650W et la fiche FSP confirme HA650/650W. Le nom, les spécifications, la description et le nom de groupe ont été corrigés ensemble. HEXA85+PRO850W reste distincte.
- Trois Hydro PTM X PRO Gen5 noirs réutilisent le même code HPT3-xxxM,Gen5 en ATX3.0 et ATX3.1. Les valeurs communes sont documentées ; norme ATX et connecteurs sont explicitement en conflit. Aucune garantie d'une seule révision, photo exacte, référence commerciale ou offre n'est transférée.
- SAGA400R : la seule fiche détaillée retrouvée associe SAGA400R à FSP400-60GHN85 et juxtapose Bronze, Titanium et >70%. Son identité est contradictoire, pas simplement « non recherchée ». Voir `followup-searches/saga.json`, `sagarefs.json` et `saga400-exact.json`.
- SAGA450/500 publient une puissance **maximale**, sans preuve de puissance continue. Le champ nominal hérité est supprimé ; cette valeur n'alimente donc pas le calcul de puissance admissible.
- Les cellules fusionnées des rails sont développées avant extraction : une puissance combinée sur quatre rails n'est pas multipliée par quatre. Les nouveaux blocs de câbles conservent séparément nombres de câbles et nombres de prises.
- Certains tableaux FSP étiquettent `L×W×H` mais placent 150 en première position. Le triplet original reste visible ; largeur et profondeur ne sont pas projetées à l'intuition. Une autre édition officielle du modèle exact peut lever l'ambiguïté lorsqu'elle nomme explicitement `W×L×H`.
- Les champs absents sont libellés « non publiés sans ambiguïté dans les sources examinées » ; cela ne signifie pas que le fabricant ne les a jamais publiés ailleurs. Les informations non disponibles dans la génération exacte restent inconnues.
- `official-photos.json` associe des URL officielles à 98 références. Ces images ne sont pas inspectées et ne constituent pas une validation de ressemblance des icônes ou des modèles 3D.

## Reproduction

Les collecteurs réseau `collect-fsp-sources.py` et `capture-fsp-tables.py` utilisent un cache et enregistrent les reçus. Après les captures initiales, les commandes suivantes régénèrent les sorties :

```sh
python scripts/collect-fsp-review.py
python scripts/capture-fsp-tables.py
python scripts/build-fsp-supplements.py
python scripts/build-fsp-catalog.py
npx tsx scripts/audit-fsp-catalog.ts
npx tsx --test tests/deep-fsp.test.ts
npx tsc -b --pretty false
```

Les tests couvrent les cellules combinées, les nombres de câbles/prises, les axes non déduits, la correction de puissance, les intersections de révisions et la distinction nominal/maximal. La liste complète de 109 IDs figure dans `input.json` et `per-id-review.json`.
