"""Publish the measured catalogue audit without turning unknown fields into facts."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
summary = json.loads((ROOT / 'data/deep-review/summary.json').read_text())
labels = {'cpu': 'Processeurs', 'motherboard': 'Cartes mères', 'gpu': 'Cartes graphiques',
          'ram': 'Mémoire', 'storage': 'SSD', 'cooler': 'Refroidissements',
          'psu': 'Alimentations', 'case': 'Boîtiers'}
def number(value):
    return f'{value:,}'.replace(',', ' ')
rows = []
for key, values in summary['byCategory'].items():
    rows.append('| ' + ' | '.join([labels[key]] + [number(values[k]) for k in (
        'total', 'documented', 'technicallyComplete', 'technicalRows', 'currentFrenchOffers'
    )]) + ' |')
report = f'''# Revue approfondie du catalogue, des images et de la 3D

État généré le **{summary['generatedAt']}**, depuis les données réellement intégrées au site.

Le catalogue conserve **{number(summary['total'])} variantes**, regroupées en **{number(summary['displayGroups'])} fiches de sélection**. Le contrôle d’intégrité et le suivi des recherches couvrent chaque identifiant. **{number(summary['documentedRecords'])} variantes possèdent une fiche reliée à des sources traçables**, dont **{number(summary['manufacturerRecords'])}** avec une source constructeur ; **{number(summary['unresolvedIdentities'])} identités restent à confirmer**. Une recherche sans résultat ou une page inaccessible ne valide pas une référence.

## Caractéristiques réellement disponibles

Les fiches intègrent **{number(summary['sourceTechnicalRows'])} lignes techniques sourcées**. La recherche dans une fiche filtre aussi les valeurs et les unités. Les caractéristiques non publiées ou contradictoires restent signalées.

| Catégorie | Variantes | Fiche sourcée | Liste technique complète | Lignes techniques | Offre FR admissible |
| --- | ---: | ---: | ---: | ---: | ---: |
{chr(10).join(rows)}

« Liste technique complète » signifie que chaque champ de la liste définie dans `src/lib/catalogCompletion.ts` possède une preuve. Ce compteur ne signifie ni prix actuel garanti, ni modèle CAD exact, ni présence de toutes les informations possibles d’un manuel. Les restrictions PCIe, BIOS, radiateurs, rails et câbles restent dans les tableaux détaillés.

**{number(summary['commercialMPNs'])} références commerciales** sont documentées. **{number(summary['manufacturerModels'])} modèles constructeur** sont identifiés sans MPN de vente unique : leur MPN demeure vide et aucune offre n’est attribuée à une révision au hasard. Lorsque plusieurs révisions répondent à la même désignation exacte, seuls leurs faits communs explicitement documentés peuvent être conservés ; les différences restent inconnues ou contradictoires.

Les corrections de capacité SSD et de puissance continue des alimentations sont reliées à l’identifiant, à l’ancienne valeur, à la nouvelle valeur et à une source constructeur enregistrée. Les archives d’origine sont conservées. Une erreur de référence ancienne est mise en quarantaine par MPN afin de ne pas supprimer une nouvelle correspondance correctement prouvée.

## Prix et disponibilité

**{number(summary['offerObservations'])} observations d’offres** sont intégrées ; **{number(summary['currentFrenchOffers'])} variantes** ont une offre directe admissible à l’heure de cet audit. La collecte utilise PcComponentes, Fnac, LDLC et Amazon.fr. Les refus d’accès, les absences de correspondance et les produits indisponibles sont consignés séparément. Amazon n’est pas une preuve de prix lorsque sa page n’est pas lisible.

Le budget n’utilise une offre directe que si le MPN exact correspond, le produit est neuf, disponible, en EUR pour le marché français, avec une vérification datant de moins de 24 heures. Les vendeurs marketplace, l’état, l’heure du relevé et les frais connus restent visibles. Un prix minimal agrégé, une occasion, une devise convertie ou un résultat de recherche ne remplace pas une offre produit. Les frais inconnus ne valent pas zéro et le total reste hors livraison.

Les offres sont des relevés intégrés au déploiement. Le navigateur ne consulte pas les marchands en temps réel ; les prix peuvent changer après la vérification et expirent automatiquement du budget. Une fiche technique documentée n’obtient pas de prix estimé de remplacement.

## Images et représentation 3D

**{number(summary['photoAssets'])} références** disposent d’une image produit liée au fabricant. **{number(summary['visuallyInspectedPhotoAssets'])} images** ont en plus été inspectées visuellement ; les autres sont identifiées par la page ou le catalogue constructeur, sans prétendre à cette inspection. La photo n’est affichée qu’après chargement. Une image distante bloquée laisse une illustration locale utilisable.

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
'''
(ROOT / 'docs/DEEP-CATALOG-REVIEW.md').write_text(report)
for filename in ['README.md', 'PRIX.md']:
    path = ROOT / filename
    text = path.read_text()
    old = 'La [refonte globale des visuels et la vérification des fiches](docs/COMPREHENSIVE-REVIEW.md) couvre les huit catégories et recense les données encore manquantes pour chaque variante. Les comptes antérieurs ci-dessous sont des bilans datés.'
    new = ('La [revue approfondie du catalogue, des images et de la 3D](docs/DEEP-CATALOG-REVIEW.md) '
           'donne les chiffres actuels, les sources et les limites pour les huit catégories. '
           'Les comptes antérieurs ci-dessous sont des bilans datés.')
    path.write_text(text.replace(old, new))
print('docs/DEEP-CATALOG-REVIEW.md generated from the integrated audit')
