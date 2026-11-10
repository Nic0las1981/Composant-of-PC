# Contrôle complémentaire Gigabyte

Le contrôle porte sur les **102 GPU Gigabyte** dont l’identité restait non confirmée dans l’audit GPU initial. Il accepte **55 produits** : 21 codes fabricant exacts et 34 identités par modèle fabricant, dont 20 révisions nommées dans l’archive et 14 révisions restant non déterminées.

Les tables de 624 documents techniques Gigabyte archivés ont été analysées. Les 112 pages de présentation complémentaires ont toutes été lues avec succès HTTP 200 ; les réponses et contenus gzip sont conservés dans `sources/`. Les 33 photos officielles sont conservées sous forme d’aperçus WebP, avec URL et SHA-256 de l’image originale dans `images/inspection-index.json`. Leur inspection confirme 28 finitions blanches/argentées et révèle 5 produits noirs incompatibles avec les archives blanches.

## Champs publiés

- 338 faits typés accompagnés d’une source et d’une date : 55 capacités mémoire, 55 longueurs, 55 hauteurs, 55 épaisseurs, 55 recommandations de bloc d’alimentation, 32 nombres de ventilateurs et 31 diamètres uniformes.
- 1 230 lignes de caractéristiques constructeur ou compléments LDLC.
- Aucune consommation électrique de carte n’est déduite de la puissance de bloc recommandée.
- Aucune révision n’est choisie grâce à une longueur ou à une fréquence. Pour une archive sans révision, toutes les révisions liées par le fabricant sont comparées et seules les valeurs identiques sont conservées. Les fréquences différentes des AORUS RTX 2070 SUPER et RX 6900 XT sont donc omises. Aucune dimension typée des 55 produits retenus ne varie entre leurs révisions admissibles.
- Les 34 identités de modèle gardent `mpn: ""`, aucun prix, et doivent effacer `patch.manufacturerPartNumber` lors de l’intégration. Leur code GV partagé reste une simple ligne documentaire.

## Prix français

La fiche LDLC [PB00684438](https://www.ldlc.com/fiche/PB00684438.html) relie explicitement le MPN `GV-N5060EAGLEOC ICE-8GD` au modèle RTX 5060 EAGLE OC ICE 8G. Elle donne les dimensions 208 × 120 × 40 mm, deux ventilateurs et « Dernier prix 529€95 » avec « Muséericorde ». Le prix est conservé uniquement avec `priceKind: last_known` et `availability: discontinued`. Aucune offre actuelle n’a été validée. L’extrait Amazon montrant une livraison en avril est écarté ; les comparateurs ne constituent pas une preuve d’offre actuelle.

## Exclusions explicites

47 archives restent non confirmées : 24 collisions de finitions d’archive, 7 fréquences incompatibles avec tous les modèles exacts, 2 longueurs incompatibles, 1 finition contradictoire avec la photo fabricant, 7 suffixes LHR non confirmés pour les révisions admissibles et 6 noms/capacités/révisions exacts non retrouvés. En particulier la RTX 3060 Ti GAMING OC PRO révision 2.0 n’est pas convertie en révision 3.0 LHR et aucune EAGLE noire n’est remplacée par une ICE blanche.

## Reproduction et tests

```sh
python scripts/deep-gpu-followup-gigabyte.py collect
python scripts/deep-gpu-followup-gigabyte.py build
python tests/deep-gpu-followup-gigabyte.test.py
```

Les six tests contrôlent les champs variant par révision, les suffixes LHR, les preuves de finition, la ventilation à tailles mixtes, les 102 décisions individuelles et la qualification du prix historique LDLC.
