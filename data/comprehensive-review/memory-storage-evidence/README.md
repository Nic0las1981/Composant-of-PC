# RAM et stockage : preuves et reconstruction

`python scripts/build-comprehensive-memory-storage.py` reconstruit le module TypeScript et l’audit exhaustif à partir du snapshot `input.json.gz`, des pages primaires déjà conservées dans `data/full-review/reviews.jsonl.gz`, et des extractions de PDF Kingston. Le snapshot garde l’état avant ce nouvel enrichissement et évite une réimportation circulaire du module produit.

Chaque PDF porte son MPN exact ; les textes extraits sont conservés avec URL, date d’extraction et SHA-256 du texte. Les cinq extractions Firecrawl comportent des tableaux de dessin mal reconnus : leurs nombres sans légende sont expressément exclus. Seules les cotes lisibles sont normalisées. Les tensions du profil JEDEC et celles du profil overclocké restent distinctes.

`recovered-retailer-tables.json` conserve les lignes récupérées dans des tableaux PcComponentes dont les cellules avaient été fusionnées lors de l’extraction. Chaque projection inclut MPN, URL, date d’observation et SHA-256 de la page originale. Aucune ligne de FAQ n’est utilisée par ce nouveau parseur. Les anciennes offres sont reprises sans modifier leur montant ni leur date.

L’audit couvre 4 696 identifiants, y compris ceux sans MPN. Un état `blocked` indique les champs encore absents ou les conflits ; `ready` exige tous les champs essentiels énumérés dans le rapport et une offre neuve disponible en EUR/France observée depuis moins de 24 heures. Il ne certifie pas une représentation 3D photoréaliste.

Les appariements de mauvaise capacité, de variante, de génération PCIe ou de format physique figurent dans `../memory-storage-quarantine.json`. Ils sont exclus du module d’enrichissement ; l’archive d’origine n’est jamais remplacée par le produit marchand incompatible.
