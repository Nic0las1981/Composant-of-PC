# Antec et Enermax — examen de 201 alimentations

Les 112 références Antec et 89 Enermax du catalogue ont été examinées. Résultat : **175 références documentées**, dont **46 avec les 13 champs techniques requis**, 129 partielles et 26 non résolues. **1 903 champs sur 2 613** sont documentés. Aucune offre ni aucun prix nouveau n’est fabriqué.

Les modules livrés sont `src/data/deepPowerAntecCatalog.ts` et `src/data/deepPowerEnermaxCatalog.ts`. Leur intégration au registre central revient à l’agent principal. `antec-products.json` et `enermax-products.json` sont les versions JSON des mêmes enregistrements.

## Preuves et couverture

- `input.json` : état figé des 201 références avant cette passe.
- `per-id-review.json` : résultat de chaque ID, modèle, sources utilisées, champs confirmés/manquants et recherches individuelles lorsqu’elles ont été nécessaires.
- `unresolved-reasons.json` : motifs précis des 26 exclusions restantes. Les références ne sont pas remplacées par une série voisine.
- `sources/` : captures HTML, textes de PDF, fichiers PDF d’origine et OCR éventuel. `spec-panels/` conserve les extraits graphiques utilisés pour lire les tableaux et dessins cotés.
- `exa-*.json` et `.txt` : notices originales de constructeur, parfois préservées par ManualsLib, ManualsDir ou Manymanuals, et pages régionales officielles. Les notices sont attribuées à leur auteur constructeur ; leur URL indique le site d’archivage effectif.
- `id-search-*.json`, `per-id-search-index.json`, `search-*.json` : recherches par modèle, familles et variantes. Une page trouvée ou une couverture de notice seule ne vaut pas validation de ses caractéristiques.
- `corrections.json` : différences avec les caractéristiques machine lisibles de l’entrée figée.

La page NeoECO 620C de Links est celle du distributeur officiel japonais. Sa garantie de trois ans est explicitement limitée à ce marché. Aucun numéro de pièce régional n’est déduit d’un code-barres ou d’un code réglementaire.

## Distinctions contrôlées

- Anciens NeoECO Gold semi-modulaires, NeoECO Gold Modular, NE-GM ATX 3.0 et générations ATX 3.1 restent distincts.
- HCP Gold et Platinum, VP / VP-P / VP PLUS, Classic / Classic V2, NAXN AWT / AWT B, Triathlor / FC / ECO, MODU82+ / II et Revolution / D.F. / D.F. 2 / D.F. X ne sont pas fusionnés.
- Les limites combinées du rail +12 V proviennent du tableau du modèle. Elles ne sont pas obtenues en additionnant les limites des rails individuels.
- Les anciennes descriptions entièrement modulaires ont été corrigées lorsque les notices montrent des cordons carte mère/CPU fixes.
- DIGIFANLESS conserve zéro ventilateur ; REVOLUTION DUO en conserve deux, 100 mm en admission et 80 mm en extraction. Le rendu générique reste illustratif.
- L’adaptateur 12VHPWR optionnel du D.F. 2 est exclu du comptage des câbles fournis.
- La fiche originale Basiq 430 confirme un rendement minimum de 70 % à pleine charge, sans preuve de certification 80 PLUS. La certification de l’archive n’est donc pas répétée.
- Le résultat web annoncé EA-750 Platinum contient une notice EA-650 Platinum : il a été rejeté.

Les champs absents restent absents de `fieldEvidence`. Un rendement documenté peut être indiqué sans affirmer une certification non prouvée. Une garantie régionale n’est pas transformée en garantie européenne. Les dimensions sont celles du bloc, pas de son emballage ni des câbles.

## Reproduction et contrôles

```sh
python scripts/curate-power-historical.py
python scripts/build-power-antec-enermax.py
npx tsx --test tests/deepPowerAntecEnermax.test.ts
npx tsc -b --pretty false
```

Les cinq tests ciblés passent : couverture de tous les IDs, correspondance des champs avec l’audit d’exécution, rails et modularité, ventilateurs passifs/doubles, générations ATX et absence de faux prix/numéros de pièce. Le contrôle TypeScript passe également. Cette livraison ne publie pas le site.
