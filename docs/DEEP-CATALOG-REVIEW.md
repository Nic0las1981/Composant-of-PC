# Revue approfondie du catalogue, des images et de la 3D

État généré le **2026-11-10T16:21:45.485Z**, depuis les données réellement intégrées au site.

Le catalogue conserve **10 564 variantes**, regroupées en **9 237 fiches de sélection**. Le contrôle d’intégrité et le suivi des recherches couvrent chaque identifiant. **7 316 variantes possèdent une fiche reliée à des sources traçables**, dont **7 156** avec une source constructeur ; **3 248 identités restent à confirmer**. Une recherche sans résultat ou une page inaccessible ne valide pas une référence.

## Caractéristiques réellement disponibles

Les fiches intègrent **152 956 lignes techniques sourcées**. La recherche dans une fiche filtre aussi les valeurs et les unités. Les caractéristiques non publiées ou contradictoires restent signalées.

| Catégorie | Variantes | Fiche sourcée | Liste technique complète | Lignes techniques | Offre FR admissible |
| --- | ---: | ---: | ---: | ---: | ---: |
| Processeurs | 26 | 26 | 6 | 1 197 | 21 |
| Cartes mères | 1 503 | 1 485 | 1 170 | 35 171 | 26 |
| Cartes graphiques | 2 474 | 1 747 | 11 | 38 824 | 132 |
| Mémoire | 3 864 | 2 088 | 306 | 32 006 | 337 |
| SSD | 832 | 750 | 245 | 11 965 | 195 |
| Refroidissements | 25 | 25 | 18 | 839 | 14 |
| Alimentations | 1 820 | 1 175 | 80 | 32 450 | 80 |
| Boîtiers | 20 | 20 | 19 | 504 | 6 |

« Liste technique complète » signifie que chaque champ de la liste définie dans `src/lib/catalogCompletion.ts` possède une preuve. Ce compteur ne signifie ni prix actuel garanti, ni modèle CAD exact, ni présence de toutes les informations possibles d’un manuel. Les restrictions PCIe, BIOS, radiateurs, rails et câbles restent dans les tableaux détaillés.

**3 998 références commerciales** sont documentées. **3 318 modèles constructeur** sont identifiés sans MPN de vente unique : leur MPN demeure vide et aucune offre n’est attribuée à une révision au hasard. Lorsque plusieurs révisions répondent à la même désignation exacte, seuls leurs faits communs explicitement documentés peuvent être conservés ; les différences restent inconnues ou contradictoires.

Les corrections de capacité SSD et de puissance continue des alimentations sont reliées à l’identifiant, à l’ancienne valeur, à la nouvelle valeur et à une source constructeur enregistrée. Les archives d’origine sont conservées. Une erreur de référence ancienne est mise en quarantaine par MPN afin de ne pas supprimer une nouvelle correspondance correctement prouvée.

## Prix et disponibilité

**1 252 observations d’offres** sont intégrées ; **811 variantes** ont une offre directe admissible à l’heure de cet audit. La collecte utilise PcComponentes, Fnac, LDLC et Amazon.fr. Les refus d’accès, les absences de correspondance et les produits indisponibles sont consignés séparément. Amazon n’est pas une preuve de prix lorsque sa page n’est pas lisible.

Le budget n’utilise une offre directe que si le MPN exact correspond, le produit est neuf, disponible, en EUR pour le marché français, avec une vérification datant de moins de 24 heures. Les vendeurs marketplace, l’état, l’heure du relevé et les frais connus restent visibles. Un prix minimal agrégé, une occasion, une devise convertie ou un résultat de recherche ne remplace pas une offre produit. Les frais inconnus ne valent pas zéro et le total reste hors livraison.

Les offres sont des relevés intégrés au déploiement. Le navigateur ne consulte pas les marchands en temps réel ; les prix peuvent changer après la vérification et expirent automatiquement du budget. Une fiche technique documentée n’obtient pas de prix estimé de remplacement.

## Images et représentation 3D

**2 122 références** disposent d’une image produit liée au fabricant. **581 images** ont en plus été inspectées visuellement ; les autres sont identifiées par la page ou le catalogue constructeur, sans prétendre à cette inspection. La photo n’est affichée qu’après chargement. Une image distante bloquée laisse une illustration locale utilisable.

Les huit catégories disposent de représentations enrichies : géométrie adaptée aux dimensions connues, circuits et contacts, dissipateurs et ailettes, pales, connectique, châssis et façades, pompes AIO et détails propres aux familles. Les SSD à simple film thermique restent distincts des versions à dissipateur épais. Les icônes et l’assemblage utilisent les caractéristiques de la variante sélectionnée.

Quatre modèles de ventilateurs proviennent des fichiers CAD officiels Noctua et équipent cinq refroidissements du catalogue. Les fichiers ont été simplifiés pour le navigateur ; l’avis de provenance et d’utilisation accompagne les GLB dans `public/models/noctua/README-Noctua.txt`. Les autres pièces restent des reconstitutions : tolérances, câblage fin, connecteurs et collisions ne constituent pas une maquette industrielle certifiée.

## Vérification et reproduction

Le rapport individuel est dans `data/deep-review/release-audit.json`. Les sous-dossiers par lot conservent les URL, dates, empreintes, faits extraits, candidats rejetés et motifs d’ambiguïté. Les fichiers bruts volumineux récupérables restent hors archive source ; les extraits nécessaires aux générateurs sont conservés.

```sh
python3 scripts/build-catalog-quarantine.py
python3 scripts/build-deep-price-catalog.py
python3 scripts/build-product-image-assets.py
python3 scripts/check-entire-catalog.py --current
npm run audit:completion
npx tsx scripts/audit-deep-release.ts
python3 scripts/write-deep-review-report.py
npm test
npm run build
```

Les contrôles navigateur couvrent les fiches et leur recherche, les modèles sans MPN, le chargement et l’échec d’une photo, les vues assemblées et éclatées, ainsi que les formats ordinateur et mobile. Les captures et limites de performance figurent dans `release/final-deep-review/README.md` de l’espace de travail. La vérification de publication compare l’HTML, les bundles et les fichiers CAD servis publiquement aux octets du build local (`scripts/verify-published-site.py`).
