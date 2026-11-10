# Revue individuelle et fidélité visuelle — 10 novembre 2026

Bilan antérieur à la [refonte globale du catalogue](COMPREHENSIVE-REVIEW.md). Les chiffres de cette étape restent conservés pour la traçabilité.

Cette révision approfondit 27 fiches, avec 37 relevés de prix, et corrige le moteur de compatibilité. Le catalogue complet de 10 564 variantes n'est pas encore vérifié individuellement. `data/individual-review/progress.json` conserve le résultat et les champs manquants de chaque identifiant ; une recherche automatique ne compte pas comme une fiche terminée.

## Fiches approfondies

- ASRock B850 Steel Legend WiFi ; RX 9060 XT Steel Legend OC 8 et 16 Go.
- Gigabyte B650 GAMING X AX V2 et X870 AORUS ELITE WIFI7 noire ; MSI MAG X870E TOMAHAWK WIFI.
- Crucial Pro Overclocking : cinq références exactes, en distinguant kits, modules unitaires, capacités et couleurs.
- Samsung 9100 PRO : huit variantes, 1/2/4/8 To, nues et avec dissipateur.
- be quiet! Power Zone 2 : 750/850/1000 W ; Pure Power 13 M : 550/650/750/850/1000 W, références européennes.

Les dossiers sont dans `src/data/individualBoardGpu.ts`, `individualRamStorage.ts` et `individualPsu.ts`. Ils priment sur les anciennes correspondances. Chaque offre conserve MPN, vendeur, état, stock, frais et date réelle de lecture. Les PDF et extraits primaires sont archivés dans `data/individual-review/`.

Pour les composants de la capture : quatre M.2 et 256 Go maximum sont confirmés pour la B850 ; les profils EXPO/XMP et le caractère non-ECC système du kit Crucial blanc sont établis ; les dimensions du Samsung et de l'alimentation sont corrigées. L'offre RX 9060 XT 8 Go trouvée est en rupture ou sur commande avec stock zéro, donc hors budget. Le prix de la 16 Go ne lui est jamais attribué. ASRock ne publiant pas le TBP exact de ces cartes OC, leur consommation reste inconnue. La puissance minimale d'alimentation de 550 W n'est pas une consommation de GPU.

## Données effectivement utilisées

287 champs supplémentaires sont intégrés à partir des lignes techniques déjà sourcées de 120 références : dimensions, ports M.2, profils et tensions mémoire, puissances explicitement libellées. L'extracteur ne remplit que les valeurs absentes, exige le même MPN et conserve les contradictions dans le rapport. Il n'utilise ni emballages, ni carrousels, ni TDP CPU comme mesure électrique. Treize références présentent des divergences à revoir ; leurs valeurs existantes ne sont pas écrasées automatiquement.

L'alerte générique « fiches techniques partielles » utilise désormais les champs réellement manquants au lieu de conserver une ancienne étiquette opaque. Les alertes de dégagement du radiateur et les inconnues électriques restent présentes lorsqu'elles sont justifiées. La complétude des champs ne certifie pas le montage physique d'une configuration.

## Corrections des associations automatiques

La revue a repéré des faux rejets (Overclocking/OC, capacité Go/To, certification d'alimentation confondue avec un suffixe) mais aussi d'anciennes associations trop larges entre familles PSU et nouvelles révisions. **36 anciens dossiers automatiques sont retirés** ; 237 restent admissibles selon les règles renforcées. **34 nouveaux candidats sont mis en attente de revue individuelle**, sans prix importé. `matching-rules-audit.json` conserve les identités et motifs.

`existing-bulk-ids.json` fixe les anciens identifiants autorisés à être réévalués ; il ne constitue pas une validation fabricant. Les nouvelles fiches nécessitent les dossiers individuels. Le nouveau bilan global est de 425 références avec pages primaires, dont 53 avec fabricant, 458 observations et 316 références avec offre admissible au relevé. Ces nombres évoluent avec les corrections et l'expiration des offres ; le nombre le plus élevé n'est pas un objectif de validation.

## Icônes et 3D

Les cinq familles de la capture disposent de dessins et détails 3D spécifiques : PCB/VRM/M.2 de la B850, trois ventilateurs et carénage Steel Legend, dissipateurs Crucial facettés sans RGB, étiquette/contrôleur Samsung, grille carrée et panneau modulaire Power Zone 2. Les variantes partageant des dimensions confirmées sont couvertes explicitement.

Les dimensions matérielles confirmées alimentent aussi les profils visuels génériques. Les valeurs graphiques ne retournent jamais dans le moteur de compatibilité. Les photos et dimensions sources sont listées dans `visual-references.json`. Les épaisseurs/hauteurs RAM et diamètres des ventilateurs GPU non publiés restent des approximations de dessin, sans statut de caractéristique fabricant. Les modèles sont des reconstructions photographiques, pas des fichiers CAD.

## Reproduire

```sh
python3 scripts/import-full-review.py
npm run import:verified
npx tsx scripts/audit-individual.ts
python3 scripts/check-entire-catalog.py --current
npm run audit:catalog
python3 tests/catalog-review.test.py
npm test
npm run build
node tests/individual-scene-smoke.cjs
```

Les imports réutilisent les preuves datées et ne réactualisent pas les prix. Les générateurs PSU et RAM/SSD disposent de leurs scripts séparés. Le module cartes mères/GPU conserve les décisions individuelles et leurs sources explicitement.

Validation : 173 tests applicatifs et 19 tests Python réussis. Les cinq fiches de la capture passent les parcours à 1 440 et 390 pixels, avec les bons MPN, icônes spécifiques et exclusion du GPU indisponible. La scène assemblée et éclatée est contrôlée sans erreur de page.
