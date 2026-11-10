# Refonte des huit catégories et vérification des fiches

Le travail porte sur les 10 564 variantes du catalogue. Toutes utilisent les nouveaux dessins et modèles des huit catégories ; cela ne signifie pas qu’elles disposent toutes d’une reconstruction photographique ou d’une fiche technique complète. Le registre `data/comprehensive-review/identity-audit.json` conserve séparément, pour chaque ID, l’identité, les preuves techniques, les offres et les références visuelles.

Bilan du 10 novembre 2026, à 11:47 UTC : **973 fiches reprises** dans cette révision (données techniques, identités ou descriptions). Ce nombre inclut les corrections rédactionnelles de dossiers déjà sourcés ; il ne désigne pas autant de nouvelles recherches, ni autant de fiches intégralement terminées.

| Catégorie | Fiches reprises |
|---|---:|
| Processeurs | 26 |
| Cartes mères | 464 |
| Cartes graphiques | 156 |
| Mémoire | 142 |
| SSD | 83 |
| Refroidissements | 25 |
| Alimentations | 57 |
| Boîtiers | 20 |

Le registre intégré contient **1 057 références avec pages primaires**, dont **762 avec au moins une source fabricant**, **437 observations de prix** et **295 références avec une offre admissible** à cette date. **47 associations erronées ou non établies** sont exclues : 32 IDs restent sans nouveau rattachement ; les autres disposent d'une correction prouvée avec une référence différente.

La checklist technique finie est remplie pour **100 fiches**. Il reste **957 fiches techniques incomplètes**, **9 502 identités non établies** et **5 références sans dossier primaire correspondant** (modules OEM documentés par des échantillons SPD publics). **7 fiches** réunissent la checklist, une offre actuelle et une référence photographique inspectée. La demande de finalisation exacte de chaque composant n'est donc pas entièrement satisfaite ; les inconnus sont conservés explicitement. L'audit ne compte plus de collision MPN restante.


## Visuels

Les icônes ont été reprises avec volumes, perspectives, matériaux, ombres, circuits, contacts et connecteurs. La géométrie 3D ajoute les pales vrillées, les contacts CPU, les encoches et composants des SSD, les grilles et coques ouvertes, les fixations et les reliefs. Le cadrage éclaté des petits boîtiers a été corrigé. Les dimensions et traits réellement documentés — dissipateur, éclairage, nombre de ventilateurs, type de panneau — remplacent les anciens gabarits lorsqu’ils sont connus.

Les détails non documentés restent représentatifs. Un nouveau matériau, une géométrie plus détaillée ou une planche de contrôle ne valent pas inspection d’une photo du modèle exact. Les dix références disposant de preuves photographiques sont suivies séparément ; les autres profils ne sont pas artificiellement promus. Aucune dimension choisie pour dessiner une pièce ne retourne dans sa fiche technique ou dans les contrôles de compatibilité.

## Données et identités

Les nouveaux dossiers sont regroupés dans `src/data/comprehensiveCatalog.ts`, avec les sources, dates, extraits techniques, corrections et limites. Les offres conservent leur date d’origine : importer des caractéristiques ne rafraîchit pas les prix.

La revue a notamment séparé les GPU MSI blancs et noirs, A520M PRO et A520M-A PRO, les SSD de capacités différentes, les modules M.2 2230 et 2280, les disques externes et internes, les générations de SSD et d’alimentations et AK620 standard/Zero Dark. `catalogQuarantine.ts` exclut les mauvaises associations par ID et référence ; une correction prouvée avec un autre MPN reste possible. Les identifiants des sauvegardes sont conservés.

Les tableaux des cartes mères incluent les restrictions PCIe/M.2, les connecteurs, le réseau et l’audio. Le nombre M.2 utilisé par la compatibilité désigne les ports de stockage PCIe/NVMe : un port SATA seul ou Wi-Fi Key E n’est pas compté comme un port NVMe. Les anciennes limites de mémoire par barrette devenues incohérentes ont été retirées sans calcul arbitraire à partir de la capacité totale.

Les 26 processeurs disposent de tableaux provenant des modèles fabricant exacts. Les six Intel conservent séparément PBP et MTP. Les vingt AMD conservent leur TDP documenté ; les anciennes puissances électriques non sourcées ont été retirées. Le configurateur indique donc une estimation électrique incomplète quand le maximum électrique n’est pas établi. Un TDP n’est pas une preuve de PPT.

Les 25 refroidissements ont été vérifiés, dont les dimensions distinctes du radiateur et de la pompe des 14 AIO. Exemples corrigés : Kraken 2023 de 30 mm d’épaisseur, H170i de 457 × 140 × 27 mm, Silent Loop 2 360 de 394 × 120 × 27 mm. La contradiction documentaire Noctua 165/168 mm reste explicitée ; le calcul retient la valeur supérieure du tableau constructeur, sans affirmer une révision matérielle non prouvée.

Le contrôle des 832 SSD compare capacité, format, génération et lignes PCIe séparément. Le tableau fabricant du Silicon Power UD85 corrige les indications marchandes ×16 et 8 mm : PCIe 4.0 ×4, 80 × 22 × 3,5 mm. La tension du Kingston KF560C30BWE-32 est corrigée à 1,4 V avec son PDF exact, distinctement du profil JEDEC.

## Prix

Un relevé marchand n’entre dans le budget que pour la référence exacte, neuve, disponible, en EUR pour la France et dans les 24 heures suivant sa consultation. Les frais restent séparés. Une fiche documentée sans offre admissible ne reprend plus son ancienne estimation. Les relevés Fnac, LDLC et PcComponentes restent distincts des recherches Amazon dont les conditions de vente françaises n’ont pas été confirmées.

Le site reste statique : les dates de consultation sont visibles, et une offre expirée sort du budget. Il n’annonce pas une actualisation automatique auprès de toutes les boutiques.

## Limites et contrôles

La majorité des lignes d’archive ne conserve ni MPN, ni GTIN, ni révision, ni URL produit d’origine. Les noms parfois abrégés et les dimensions partielles ne suffisent pas à leur attribuer un SKU de vente. Les codes encore présents dans certains noms ont été recherchés : 23 confirmations sur 44 candidats cartes mères/GPU, 20 alimentations confirmées, un SSD WD confirmé ; le suffixe Crucial non établi reste exclu. Les autres entrées demeurent explicitement ouvertes, avec leur motif, plutôt que de recevoir les caractéristiques d’un modèle voisin. La [méthode de complétude](CATALOG-COMPLETION.md) distingue checklist technique, prix et fidélité visuelle.

Validation finale : **204 tests applicatifs et 19 tests Python réussis**, compilation TypeScript/Vite réussie. Les tests couvrent les icônes des 10 564 IDs, les références mises en quarantaine, les dimensions et les dégagements, les prix, les sauvegardes et les fiches à 1 440 et 390 pixels. Cinq configurations 3D ont été observées en vues assemblée et éclatée, dont Mini-ITX, Noctua et Kraken. Les trois configurations de mesure restent sous 500 appels de dessin et 150 000 triangles. Chromium utilise ici SwiftShader, très lent : ses temps de rendu ne prédisent pas les performances d’un GPU matériel.

```sh
python3 scripts/build-catalog-quarantine.py
npm run import:verified
python3 scripts/check-entire-catalog.py --current
python3 scripts/audit-storage-identities.py --current
npx tsx scripts/audit-cooler-radiators.ts
npm run audit:catalog
npm run audit:completion
npx tsx scripts/audit-comprehensive-release.ts
python3 tests/catalog-review.test.py
npm test
npm run build
```

Les scripts de génération CPU, mémoire/stockage et alimentations/refroidissement sont conservés dans `scripts/build-comprehensive-*.py`. Les preuves natives et PDF sont dans `data/comprehensive-review/`. Les règles de rejet empêchent leur import ultérieur de réintroduire une association déjà invalidée.
