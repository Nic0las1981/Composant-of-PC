# Revue individuelle MSI / Gigabyte / ASUS / Acer / HP

93 IDs examinés ; 90 tables exactes admises dans le module gelé `deepStorageBoardsCatalog.ts`. La correction HP FX700 500→512 Go est séparée dans `deepStorageBoardsCorrections.ts` : 91 IDs documentables au total, sans code commercial présumé.

Les tables MSI, HP, Acer et Predator sont indexées par capacité exacte. Les cellules Acer séparées par virgules sont ventilées uniquement quand leur nombre correspond exactement aux colonnes. Aucun débit maximal d’une autre capacité n’est attribué. Les suffixes PRO, HS, PLAY, FROZR, Eco-Pack restent distincts. AORUS 500 Go et AORUS Gen4 500 Go ont des codes commerciaux différents ; M570 FROZR a été résolu par les deux références explicites de sa fiche originale.

La page 2 du PDF GM7000 mars 2026 a été inspectée visuellement et transcrite, avec URL/date/hash. Elle distingue 2,20 mm (512 Go/1 To) et 5,90 mm (2/4 To). Le PDF GM7000 Heatsink n’est pas appliqué au modèle standard. Les dimensions MSI avec/sans radiateur restent séparées ; la valeur « w/ heatsink » est seule affectée aux modèles HS.

La contradiction HP FX900 Pro 512 Go (lecture 7000 sur page actuelle /7400 sur PDF2023) est conservée sans arbitre automatique. NAND non spécifiée et dissipateur non documenté restent manquants. Les photos sont des URL fabricant non inspectées ; certaines représentent une famille de capacités. Aucun nouveau prix n’est créé ; 10 anciennes offres conservent leurs dates et preuves.

Deux références restent non admises après recherches : AI TOP UD (page primaire supprimée, 100E différent) et MSI M482 Eco-Pack (ancienne page supprimée, conditionnement non démontré par la page boîte actuelle). Les tentatives et motifs sont consignés par ID.

Reproduction : `collect-storage-boards.py`, `collect-storage-biwin.py`, `enrich-storage-boards.py`, `build-storage-boards.py`, puis `correct-storage-boards-capacity.py`. Audit technique : `npx tsx scripts/audit-storage-boards.ts` (module principal gelé, correction séparée). Tests : `python tests/deep-storage-boards.test.py`.
