# Révision individuelle des 147 SSD

Périmètre : Western Digital, WD_BLACK, SanDisk, Seagate, SK hynix, Solidigm,
KIOXIA, Micron et Transcend présents dans le catalogue. Aucun SSD Intel dans
l’entrée figée. Chaque ID possède une entrée dans `per-id-review.json` et un
produit dans `products.json` / `src/data/deepStorageWestCatalog.ts`.

Résultat de cette passe : 147 identités rapprochées (121 MPN publiés, 26 modèles
constructeur sans code de commande inventé), 1 860 preuves de champ sur 1 911
attendues. 112 fiches ont 13/13 champs ; 35 restent partielles. `missing` indique
les lacunes exactes par ID. La complétude technique ne garantit ni un prix
actuel ni une inspection photographique.

## Méthode et preuves

- Les PDF et tableaux fabricant sont lus par capacité, format et révision.
  Les codes OEM incomplets ne reçoivent pas de suffixe commercial inventé.
- `sources/<clé>.json` conserve l’URL, la date et l’extraction ; le PDF original
  et sa transcription sont conservés lorsqu’accessibles. Les extractions Exa
  sont identifiées dans les fichiers de preuve. Les recherches servent à la
  découverte, jamais à générer automatiquement une spécification.
- Les compléments LDLC correspondent à une capacité et à un code de modèle
  précis. Les performances maximales d’une gamme ne sont pas propagées aux
  autres capacités. La NAND non publiée reste inconnue.
- Le catalogue officiel Solidigm fournit les codes de commande via son API
  publique ; le format 2280 et la capacité sont filtrés avant attribution.
  Le champ `ProductGroup` erroné de l’API P44 n’est pas réutilisé.
- Le tableau Transcend du site international présente des colonnes inversées
  dans l’extraction. La boutique officielle taiwanaise donne les paires
  capacité/vitesse explicitement ; elle confirme notamment 5200 Mo/s en
  écriture pour le MTE255S 1 To, contre 6500 pour le 2 To.
- Les MTE240S, 245S, 250S et 255S portent un film graphène ; `storageHeatsink`
  est vrai, avec hauteur totale exacte de 2,42 ou 3,77 mm. Le 250H possède un
  dissipateur à ailettes de 9,2 mm. Les données de compatibilité ne proviennent
  jamais de mesures de dessin.

## Corrections et divergences

`corrections.json` trace 11 corrections de capacité et les nouveaux noms.
Cela inclut P41 Plus 500 → 512 Go, SN740 et BG5 1000 → 1024 Go, EXCERIA avec
dissipateur 1000/2000/4000 → 1024/2048/4096 Go, et Micron 3400 1000 → 1024 Go.

- SanDisk Extreme interne : références SDSSDX3N rétablies. Les anciennes
  fiches USB portables ne fournissent ni caractéristiques ni offres.
- SN850X nu 4/8 To : hauteur fabricant actuelle 3,88 mm ; les anciennes
  dimensions 2,38 mm d’un revendeur ne sont pas conservées.
- FireCuda 530R nu : manuel mécanique 207963200 à 80,15 mm, contre 80,85 mm
  dans la fiche commerciale. Le manuel mécanique est retenu et la divergence
  apparaît dans chaque fiche concernée.
- Beskar : tableau spécifique DS2095 à 24,2 × 9,84 mm, contre 22,9 × 18,25 mm
  dans le guide d’installation générique. Les cotes par MPN du tableau sont
  retenues ; la longueur 80,15 mm est explicitement publiée dans le guide.
- Game Drive 1/2 To : l’archive ne distingue pas GP304001 de GP300001. Seuls
  capacité, interface, format, NAND, garantie et présence du dissipateur sont
  communs et renseignés. MPN, cotes, débits et endurance restent inconnus.
- Micron 7400 PRO : le document public fabricant hébergé chez Mouser donne
  800 To d’écriture aléatoire 4K et 3800 To séquentielle 128K pour le 480 Go.
  La première valeur est utilisée et la distinction apparaît dans la fiche.

## Prix et vérification

Aucun prix ni disponibilité n’est extrapolé. Sept offres antérieures sont
conservées uniquement pour un MPN strictement identique, avec date et statut
d’origine ; aucune offre n’est ajoutée aux identités sans MPN.

Reproduction : `python scripts/build-deep-storage-west.py`.
Vérification : `npx tsx --test tests/deepStorageWest.test.ts` (5 tests réussis),
et `npx tsc -b --pretty false` (réussi). Les tests vérifient les 147 ID avec le
véritable calcul de complétude, les sources de chaque champ, les corrections
de capacité, les dissipateurs, les révisions et l’absence de prix inventé.
