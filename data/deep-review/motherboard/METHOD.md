# Revue individuelle des 1 503 cartes mères

`identity-and-field-coverage.json` couvre tous les identifiants de l’archive. Une identité de modèle constructeur ne constitue ni un MPN commercial, ni une offre actuelle, ni une garantie de compatibilité. Le tableau de couverture indique chaque caractéristique encore absente ou contradictoire. `unresolved.json` inclut aussi les identités confirmées dont le tableau technique reste incomplet.

Les données intégrées sont exportées par `src/data/deepMotherboardCatalog.ts`. Les modèles sans référence commerciale démontrée utilisent `identityKind: manufacturer-model`, un MPN vide et aucune offre. Les offres antérieures ne sont conservées que pour leur référence marchande déjà documentée ; cette collecte ne rafraîchit pas leur date et ne fabrique aucun prix.

Les 18 archives sans modèle primaire concordant restent exclues. Exemples : les manuels A520M-HDV/HVS actuellement publiés nomment R2.0 ; deux pages MAXSUN nomment V3 ; X870 NOVA ne correspond pas à X870E NOVA ; les pages A620AM WiFi trouvées décrivent le modèle sans WiFi. Les suffixes DDR4/DDR5, WiFi, CSM, DASH et les révisions restent significatifs. Pro H610M-C-CSM possède une page exacte mais seulement trois champs publiés : sa fiche est volontairement partielle.

## Sources et extraction

- ASUS : sitemaps publics Global/ROG, pages techniques natives, puis tableaux des manuels PDF officiels pour les fiches anciennes. L’identité du modèle est vérifiée dans la page ou sur la couverture du manuel. Les tableaux PDF conservent leurs colonnes et les réserves du fabricant.
- MSI : toutes les variantes sont vérifiées dans les pages techniques exactes, y compris les variantes CEC et les pages régionales. Les générations DDR et les suffixes restent distincts.
- Gigabyte : toutes les pages de révision retrouvées sont conservées séparément. Les champs différents entre révisions non précisées dans l’archive ne sont pas projetés comme valeurs uniques. Voir `gigabyte/METHOD.md`.
- ASRock : introduction nominative et sections complètes des manuels ; pages techniques primaires pour les modèles dont le manuel est indisponible. Les pages fabricants actuelles explicitement vérifiées peuvent remplacer une ancienne limite de mémoire.
- Biostar : catalogue public et tables techniques accessibles par la même route que l’interface du constructeur ; révisions séparées et métadonnées communes seulement.
- NZXT : API publique du centre de documentation, référence exacte par couleur, ports et restrictions CPU/BIOS conservés.
- Colorful : route publique de spécifications appelée par sa page produit ; le champ `Model` doit correspondre exactement, y compris les suffixes de révision. Les groupes de variante restent distincts.
- MAXSUN : nom exact et grille technique officielle ; une révision ajoutée dans la page constitue une discordance avec une archive sans cette révision.
- ECS et EVGA : fiches primaires et manuel officiel. Le M.2 SATA du B450AM4-M et les sockets WLAN/Key-E ne sont pas comptés comme NVMe.

`official-photos.json` contient les URL d’images effectivement liées aux modèles dans leurs catalogues fabricants. Ces images n’ont pas été inspectées visuellement dans cette collecte. Le fichier ne déclare aucune reconstruction 3D fidèle ; les révisions Gigabyte restent indiquées.

Les preuves compactes par identifiant contiennent URL, date, empreinte lorsqu’un document natif a été téléchargé, extraits ou groupes techniques et raisons de rejet. Les caches HTML/PDF bruts sont conservés localement mais exclus de la publication. Les recherches Exa servent à découvrir des candidats ; seule une identité vérifiée dans la source primaire autorise l’intégration.

## Reproduction et contrôles

Les collecteurs sont `scripts/{asus,msi,asrock,biostar,nzxt,gigabyte}-motherboard-deep.py`, `scripts/asus-manuals-deep.py`, `scripts/asus-partial-motherboard-deep.py`, `scripts/other-motherboards-deep.py` et `scripts/ecs-evga-motherboards-deep.py`. Ils relisent le même inventaire initial `input.json.gz`. Les scripts de collecte natifs enregistrent ou réutilisent leurs preuves ; les réponses de découverte et d’extraction Exa restent enregistrées séparément.

Le noyau `scripts/deep-motherboard-core.py` n’infère pas de capacité par DIMM en divisant la capacité totale. Il ne somme pas des descriptions M.2 répétées par processeur. Les sockets de stockage PCIe/NVMe doivent être explicitement identifiés ; WiFi/Key-E et SATA seuls sont exclus.

Commandes de contrôle :

```sh
python tests/deep-motherboard-extraction.test.py
npx tsx --test tests/deepMotherboards.test.ts
npx tsx scripts/audit-deep-motherboards.ts
npx tsc -b --pretty false
```

Le contrôle TypeScript vérifie tous les enregistrements intégrés, l’enregistrement des sources de preuve, la séparation modèle/MPN/offre et les cas de variantes techniques connus. Les tests Python couvrent les erreurs de comptage de sockets, les descriptions conditionnelles et les limites mémoire.
