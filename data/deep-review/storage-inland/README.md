# Inland : vingt modèles du catalogue contrôlés

Les captures Exa `fetch-*.json` contiennent les pages primaires de Micro Center, avec la date de collecte. Les résultats de recherche servent à découvrir des URL ; seuls les tableaux de pages lues alimentent les caractéristiques. Quatre pages initiales viennent de `storage-niche/exa-fetch-1.json`, dont le chemin et la date sont consignés dans `documents.json`.

`documents.json` conserve les 24 tableaux techniques exacts, l’URL, le Mfr Part#, la capacité, l’empreinte du texte extrait et les lignes sources. `review.json` couvre les vingt identifiants sans doublon. `products.json` et `src/data/deepStorageInlandCatalog.ts` publient les 17 références uniques confirmées.

Les trois modèles Performance Plus 1 To, Performance Plus 2 To et Performance 2 To ont plusieurs Mfr Part# différents sous le même nom/capacité. Ils restent à identifier précisément : les versions avec ou sans dissipateur ne sont pas choisies par supposition. Les candidats sont tous conservés dans la revue.

Les unités TB sont converties en Go décimaux pour le champ du catalogue. Les consommations par état restent dans leurs lignes propres ; une valeur unique de lecture/écriture peut alimenter la puissance publiée, sans être présentée comme une mesure indépendante. Le format nominal M.2 2280 et les dimensions de la boîte ne servent jamais à fabriquer une hauteur de SSD. Aucun prix USD ou offre américaine ne devient un prix EUR en France. Les garanties sont explicitement celles du marché américain.

Deux valeurs numériques manifestement ambiguës sont conservées dans les preuves mais exclues des mesures affichées : « Up to 950,00 IOPS » pour Performance Plus 4 To et « Up to 5,5000MBps » pour Gaming Performance Plus 1 To. Elles ne sont pas corrigées arbitrairement.

Reproduction : `python scripts/deep-storage-inland.py`, puis `npx tsx --test tests/deepStorageInland.test.ts`.
