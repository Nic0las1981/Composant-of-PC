# SSD Mushkin, GOODRAM et Apacer

35 références examinées, 34 fiches documentées. Le PX700 512 Go reste non confirmé : la gamme constructeur et sa table logistique publient uniquement 1 024, 2 048 et 4 096 Go. Les 20 Inland du fichier d’entrée ont leur revue séparée dans `../storage-inland/`.

`scripts/build-deep-storage-niche.py` reconstruit le module depuis les pages entièrement extraites et les documents natifs. Les extraits de recherche ne servent qu’à découvrir les URLs. Les sources conservent texte, URL, date et empreinte ; les caches HTML/PDF bruts restent facultatifs et exclus du dépôt.

Corrections et limites :

- Helix-L 512 Go : PCIe 3.0 x4, référence exacte MKNSSDHL512GB-D8 publiée par Wootware ; le PCIe 4.0 d’archive est corrigé. Aucun prix étranger importé.
- MKNSSDED : série Endora identifiée individuellement par ses codes 500 Go/1/2/4 To.
- Vortex 4 To : code confirmé par l’index fabricant, mesures issues de sa fiche Newegg exacte. Garantie contradictoire laissée non validée.
- Plusieurs pages Mushkin divergent entre TBW du tableau et seuil de garantie. Ces valeurs ne deviennent pas une endurance validée.
- Delta 4 To : le titre et le MPN contredisent une cellule « 2TB ». La fiche affiche la contradiction et le champ de complétude reste conflictuel. Le type NAND de cette série est également laissé à recouper.
- AS2280Q4/Q4U : performances et endurance propres à chaque capacité. Les différentes épaisseurs de PCB et du dissipateur sont exposées ; une hauteur unique n’est pas attribuée lorsqu’aucun tableau ne rattache la capacité au PCB.

Les offres sont conservées uniquement si le MPN reste exactement identique ; aucune conversion ni estimation de prix n’est ajoutée.
