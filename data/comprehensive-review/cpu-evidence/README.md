# Vérification des 26 processeurs

Reconstruction : `python scripts/build-comprehensive-cpu.py`.

Le snapshot d’entrée conserve les offres et références antérieures. Les 16 pages AMD utilisables déjà collectées restent dans `data/evidence`. Quatre modèles AMD dont l’ancienne page produit répondait 404 ont été retrouvés sur leurs pages officielles de support, qui publient aussi leurs caractéristiques. Six fiches Intel ont été consultées directement. Les dix nouvelles lectures natives sont conservées ici avec URL, date, texte et SHA-256 du HTML reçu.

`retailer-tables.json` garde les cellules techniques PcComponentes récupérées dans les pages primaires déjà conservées. Les FAQ et textes publicitaires ne sont pas utilisés pour reconstruire ces tableaux. Les prix et leurs dates ne sont jamais rafraîchis par le générateur.

Les six puissances maximales Turbo Intel (MTP) sont lues dans les fiches fabricant. Elles restent distinctes de Processor Base Power (PBP). Les vingt pages AMD publient le TDP mais pas de limite électrique PPT du modèle : le générateur émet explicitement `powerW: undefined` afin d’annuler les anciennes valeurs non sourcées lors de l’application du patch, et marque ces fiches `partial`. Aucun coefficient de conversion TDP/PPT n’est appliqué.

Les références de vente restent celles des offres : BOX, WOF et tray ne sont pas fusionnés. La page actuelle du 5800X3D mentionne un conditionnement POF ; ses caractéristiques du processeur sont utilisées, mais aucun accessoire POF n’est attribué au WOF du catalogue. Les accessoires d’un processeur boxed ne sont pas appliqués au 7500F tray.

L’audit `../cpu.json` identifie les sources par champ, les limites électriques conservées ou retirées, et les dates d’offres préservées. Il ne présente pas le TDP comme une consommation électrique maximale.
