# Photos Corsair à plus grande résolution

60 visuels fabricant ont été récupérés et inspectés à 1 024 px de largeur. Chaque URL conserve le même hôte et le même chemin d’asset que la vignette officielle de 96 px ; seul le paramètre de redimensionnement passe de `w_96` à `w_1024`. Les pages source, horodatages, dimensions et empreintes SHA-256 des deux renditions sont conservés.

Les cinq planches de douze images ont été contrôlées visuellement : dissipateur, finition, décor d’édition spéciale, éclairage, cadrage et nombre d’objets représentés. Le nombre de barrettes visibles sur un visuel commercial ne constitue pas une preuve supplémentaire de composition du kit. Les 60 petites images avaient déjà été inspectées dans `memory-storage/visual-finish-reviews-corsair.json`.

103 associations exactes sont documentées ; **29 photos du catalogue intégré** utilisent effectivement la nouvelle résolution. Aucun nouvel identifiant ni aucune nouvelle identité commerciale ne sont ajoutés.

`overrides.json` contient seulement les associations où **MPN + URL de page source + ancienne URL d’image** correspondent exactement. Les mêmes pixels de vignette peuvent exister sous plusieurs chemins de SKU : ces chemins distincts ne sont jamais remplacés par le visuel d’un autre SKU. 134 autres URL de galerie restent donc inchangées dans ce lot.

Le générateur `scripts/build-product-image-assets.py` vérifie également le chemin d’asset conservé, les transformations autorisées, les dimensions, les empreintes et le statut d’inspection avant d’appliquer le remplacement. La garde MPN de `getProductImage` reste active ; aucun nouveau produit n’est déclaré identifié par cette amélioration.

Les fichiers `01.json` à `60.json` et `inspected-images.json` détaillent les observations. Les fichiers d’image et les planches de contrôle de cette session se trouvent dans `/tmp/forge-memory-hires/`. Ils sont récupérables depuis les URL consignées. Certains visuels constructeur contiennent de grandes marges ; elles sont préservées. La disponibilité ultérieure d’une image distante reste indépendante de cette inspection.
