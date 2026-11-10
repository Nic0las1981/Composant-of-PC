# Revue SSD complémentaire — 10 novembre 2026

Le lot contient **106 objets VerifiedProduct complets** : **69 identités nouvelles** (67 MPN exacts, 2 modèles fabricant XS70 sans choix arbitraire de suffixe régional) et **37 fiches TeamGroup existantes enrichies**. Les 37 objets conservent leurs lignes techniques, preuves, sources, offres et propriétés précédentes. Le cliché initial couvre 832 SSD, dont 82 sans identité admise ; **13 restent ouverts** avec un motif par ID dans `unresolved-evidence.json` et `review.json`.

Le contrôle technique du lot trouve 65 fiches avec tous les champs obligatoires documentés, 2 141 lignes techniques et 54 URL distinctes. Ce compteur ne signifie pas que toutes les variantes de NAND, de contrôleur ou de révision matérielle sont connues : les cases publiées seulement « 3D NAND » conservent explicitement cette limite. Les champs encore absents sont détaillés par ID dans `technical-audit.json` et agrégés dans `summary.json`.

## Preuves et reproduction

- `baseline.json.gz` : cliché immuable de chaque composant, de son objet vérifié précédent et de sa checklist. Aucune modification des modules SSD antérieurs.
- Les fichiers de recherche Exa conservent `query`, `objective`, `checkedAt` et la réponse. `fetch-selected-1.json` et `fetch-selected-2.json` conservent les documents sélectionnés. Les erreurs 401 de deux tentatives restent archivées ; les recherches ultérieures réussies sont séparées.
- `manual-products.json` et `manual-field-proofs.json` : 24 dossiers relus, avec URL par champ. Les PDF hébergés par des distributeurs sont étiquetés `retailer`, même si leur contenu est une fiche fabricant originale.
- Les 45 autres identités nouvelles TeamGroup utilisent les tableaux de références exactes de `../memory-storage/teamgroup-catalog.json`, les pages HTML conservées dans `../memory-storage/teamgroup-family-pages/` et les tableaux PDF de `../memory-storage/teamgroup-datasheets.json`. Les codes de la page sont sélectionnés littéralement ; ils ne sont jamais construits à partir d’une capacité voisine.
- `products.json` correspond à `src/data/deepStorageFollowupCatalog.ts`. `review.json` relie chaque ID à ses sources ; `fieldEvidence` conserve la provenance de chaque ajout.

Depuis la racine du dépôt :

```sh
python3 scripts/curate-deep-storage-followup.py
python3 scripts/build-deep-storage-followup.py
npx tsx scripts/audit-storage-followup.ts
npx tsx --test tests/deepStorageFollowup.test.ts
npx tsc -b --pretty false
```

## Réconciliations importantes

- KLEVV C715 `K01TBM2SP0-C7T` : nom, spécifications courtes et preuve d’interface corrigés en PCIe 3.0 ×4 NVMe 1.3 à partir du PDF officiel v3. `quarantine-resolutions.json` décrit la levée spécifique intégrée par le responsable du catalogue.
- G70 PRO : Graphene `C129` et Aluminum `C128` sélectionnés par la correspondance capacité/dissipateur/MPN publiée dans la page. Hauteurs respectives 3,7 et 8,7 mm.
- GE PRO AirFlow : les 77 mm annoncés décrivent le refroidisseur, pas la longueur du PCB ni l’enveloppe totale. Largeur 24,7 mm et hauteur 62,3 mm documentées ; longueur totale laissée ouverte.
- Six MP44Q/Z44A7Q : NAND **3D QLC** explicitement publiée. A440 Lite/Z440 Lite : TLC confirmée dans leur propre page.
- XS70 4 To : lecture 7 200 Mo/s, distincte des 7 300 Mo/s du 2 To. Modèle fabricant admis, MPN régional non choisi.
- ADATA Premium 2 To : référence commerciale `APSFG-2T-CSUS` établie séparément ; performances issues exclusivement de la ligne 2 To du PDF, dont le tableau de commande répète le code 1 To par erreur.
- MSI M482 Eco-Pack : fiche marchande exacte `S78-440Q720-P83`, sans assimilation à une référence boîte ou Bulk.

## Photos et dimensions

`photos/` conserve dix JPEG originaux TeamGroup, inspectés visuellement, sans retouche. `visual-inspections.json` enregistre URL, empreinte SHA-256, observation et IDs concernés. `visual-sources.json` décrit 37 rattachements familiaux : **25 images de famille utilisables**, **8 rattachements G70 PRO à une composition de deux variantes**, **4 AirFlow exclus car l’image GE PRO représente Graphene**. Une photographie de famille ne prouve pas la capacité exacte.

Les observations détaillent les PCB noirs/bleus, étiquettes Graphene plates, dissipateur argenté T-CREATE Classic et étiquette blanche A440 Pro Special Series. Ces éléments sont fournis pour le rendu ; ce lot ne modifie aucun composant graphique partagé.

## Prix et limites

**Aucune nouvelle offre importée.** Les offres préexistantes des 37 fiches sont conservées intégralement ; la collecte française commune utilise les MPN exacts après intégration. Les prix étrangers rencontrés pendant la recherche ne sont ni convertis ni proposés comme prix français.

Les 13 identités ouvertes sont : Inland Performance Plus 1/2 To et Performance 2 To (dissipateur indéterminé), GOODRAM PX700 512 Go, Corsair MP600 500 Go (original/R2), Corsair `CSSD-F4000GBMP600PHX` (suffixe PHXT non substituable), ADATA LEGEND 800 GOLD 500 Go (tableaux contradictoires), LEGEND 840 2 To, Silicon Power XD85 500 Go/1/2/4 To, Gigabyte AI TOP UD 1 To (non interchangeable avec AI TOP 100E).

Les nouveaux objets n’ont pas besoin de propriétés `undefined` explicites : le cliché source ne portait pas de dimensions à retirer sur les variantes AirFlow/P5 Plus. Les propriétés absentes ne sont pas inventées. Toute intégration doit placer cet overlay après les anciens modules.
