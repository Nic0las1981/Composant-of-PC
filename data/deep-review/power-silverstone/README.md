# Revue SilverStone

94 entrées examinées individuellement ; 64 enrichies à partir de références fabricant, avec 1 358 lignes techniques. 147 documents primaires ont été extraits et 120 tables de produit ont été lues. `review.json` conserve la décision pour chaque ID, les modèles concurrents et les conflits connus. `products.json` alimente `deepPowerSilverstoneCatalog.ts` / `deepPowerSilverstoneProducts`.

Les URL du comparatif officiel, de l’index des modèles retirés et de recherches ciblées servent à découvrir les pages. Les modèles ne sont acceptés que sur leur table publiée : Product No., puissance continue, finition et variante. Le site répond 403 en HTTP natif ; les réponses Exa complètes, datées et hachées, restent dans `fetch-*.json` / `documents.json`. Les manuels PDF sont conservés comme preuves supplémentaires. Aucune valeur d’un résultat de recherche isolé, aucun prix étranger ni prix supposé n’est ajouté.

Reproduire : `python scripts/deep-power-silverstone.py`. Tests : `python tests/deep-power-flower-silverstone.test.py` et `npx tsx --test tests/deepPowerFlowerSilverstone.test.ts`.

## Garde-fous

- Les anciens et nouveaux modèles sont comparés ensemble : le nom générique Strider 500 W Bronze ne permet pas de choisir ST50F-P ou ST50F-PB. Une page absente du comparatif actuel n’est pas supprimée des candidats historiques.
- HELA 850R PM (150 mm / ventilateur 135 mm) et PMA (140 mm / 120 mm) restent deux références ; l’archive non discriminante reste bloquée.
- Les tableaux qui publient des dimensions V1 et V2 n’injectent pas automatiquement les premières valeurs dans la compatibilité. Les versions explicites ne deviennent pas des alias de noms non versionnés.
- Les codes blancs WWW / WBW sont choisis uniquement avec une finition blanche publiée. Les codes de certification de sécurité ne sont pas des MPN commerciaux.
- La puissance continue reste distincte de la crête. Les dimensions ne sont reprises que si leurs axes W/H/D sont explicites. Les alimentations passives ont zéro ventilateur.
- La certification Cybenetics publiée remplace une mention d’archive 80 PLUS non corroborée dans le résumé des fiches concernées.

Les 30 entrées restantes incluent 13 ambiguïtés de modèle/révision et 17 cas sans table primaire unique suffisante. Elles restent explicitement incomplètes. Les URL visuelles de `visual-references.json` sont des pages de référence, **pas** une validation visuelle ou des modèles 3D certifiés.
