"""Regenerate Samsung OEM enrichment from five exact, independently fetched pages.

Run collect-native.py manufacturer-urls.json and retailer-urls.json to refresh
the evidence first. A manufacturer redirect to a generic page is not proof.
No price or unspecified dimension is inferred from a family or another MPN.
"""
from pathlib import Path
import json, re

D = Path(__file__).resolve().parent
catalog = json.loads((D / 'catalog-input.json').read_text())
products, audit = {}, []

for item in catalog:
    c = item['component']
    report = {'id': c['id'], 'name': c['name'], 'category': c['category'],
              'quarantine': item['quarantine'], 'existingVerified': bool(item['verified'])}
    if c['category'] != 'ram':
        report.update(status='delegated-to-parent', reason='Samsung SSD manufacturer family tables handled by parent after OEM priority handoff; existing offers and quarantine preserved.')
        audit.append(report)
        continue
    mpn = c['manufacturerPartNumber']
    raw = json.loads((D / f'compuram-{mpn}.json').read_text())
    t = raw['text']
    assert f'Manufacturer Reference{mpn}\n' in t
    def field(label):
        match = re.search(r'^' + re.escape(label) + r'([^\n]+)', t, re.M)
        assert match, (mpn, label)
        return match.group(1).strip()
    capacity = int(re.fullmatch(r'(\d+)GB', field('Capacity')).group(1))
    ranks = int(field('Number of Ranks'))
    height = float(field('Type Height').removesuffix('mm').replace(',', '.'))
    voltage = float(re.sub(r'\s*(V|Volt)$', '', field('Voltage')).replace(',', '.'))
    assert capacity == c['capacityGB'] and ranks == c['memoryRankCount']
    assert field('Model') == 'UDIMM' and field('Extension') == 'unbuffered'
    assert field('Error Correction').lower() == 'non-ecc'
    assert field('Description') == 'DDR4 3200MHz'
    assert field('Standard') == 'JEDEC'
    assert field('Type') == '288Pin' and field('DRAM Organization').endswith('x8')
    source = {'name': 'CompuRAM — fiche du MPN exact', 'url': raw['url'],
              'checkedAt': raw['checkedAt'], 'kind': 'retailer'}
    patch = dict(manufacturerPartNumber=mpn, capacityGB=capacity, memorySticks=1,
                 memoryType='DDR4', memorySpeedMTs=3200, memoryModuleFormat='DIMM',
                 memoryModuleKind='UDIMM', memoryRegistered=False, memoryEcc=False,
                 memoryProfile='JEDEC', memoryRankCount=ranks, memoryDeviceWidthBits=8,
                 memoryVoltageV=voltage, heightMm=height, detailLevel='partial')
    patch['description'] = (f'Barrette OEM individuelle {mpn} de {capacity} Go, '
        f'DDR4-3200, organisation {ranks}Rx8, UDIMM non ECC non enregistrée à 1,2 V. '
        'Hauteur de 31,25 mm publiée par CompuRAM pour cette référence exacte. '
        'CL22 relevée dans l’échantillon SPD public existant ; la vitesse effective dépend de la plateforme.')
    rows = [
        ('Référence constructeur', mpn), ('Capacité du module', f'{capacity} Go'),
        ('Type et débit', 'DDR4-3200 · 3200 MT/s'), ('Format', 'DIMM UDIMM · 288 contacts'),
        ('Organisation du module', field('Organization')), ('Rangs', str(ranks)),
        ('Organisation', field('Short Form')), ('Mémoire enregistrée', 'Non · unbuffered'),
        ('Correction ECC', 'Non'), ('Organisation des puces', field('DRAM Organization')),
        ('Nombre de puces DRAM', field('Number of DRAM ')),
        ('Boîtier des puces', field('Construction Type of DRAM')),
        ('Profil', 'JEDEC'), ('Tension', '1,2 V'), ('Hauteur', '31,25 mm'),
    ]
    evidence = {k: {'value': v, 'sourceURL': raw['url'], 'checkedAt': raw['checkedAt']}
                for k, v in patch.items() if k not in ('description', 'detailLevel', 'memorySticks')}
    products[c['id']] = {
        'mpn': mpn,
        'identityNote': f'Barrette OEM individuelle {mpn}, {capacity} Go, {ranks}Rx8. Le code complet figure dans le tableau CompuRAM. Aucun kit commercial n’est déduit.',
        'sources': [source],
        'groups': [{'title': 'Caractéristiques CompuRAM — référence exacte',
                    'rows': [{'label': a, 'value': b} for a,b in rows]}],
        'patch': patch,
        'offers': item['verified']['offers'] if item['verified'] else [],
        'notes': [
            'La source CompuRAM est un revendeur, pas Samsung. Les pages Samsung historiques redirigent actuellement vers la page DDR générique sans ce code produit.',
            'La référence et les caractéristiques électriques concordent avec l’échantillon SPD public déjà associé à cette fiche. La hauteur vient de la fiche CompuRAM exacte.',
            'Aucun prix français disponible confirmé pour cette barrette. Aucune offre équivalente ni kit de plusieurs modules n’est transféré.',
            'Les dimensions longueur/épaisseur et une photographie fabricant de cette référence exacte restent sans preuve. Le nombre de rangs ne désigne pas le nombre de canaux ni le nombre de faces du PCB.',
        ],
        'fieldEvidence': evidence,
    }
    report.update(status='enriched-retailer-primary-unavailable', mpn=mpn,
                  evidenceFile=f'compuram-{mpn}.json', addedFields=['heightMm'],
                  confirmedFields=list(evidence),
                  unknown=['manufacturer-document-exact-mpn','lengthMm','thicknessMm','currentFrenchPrice','exactManufacturerPhoto'],
                  manufacturerAttempt=json.loads((D / f'{mpn}.json').read_text())['resolvedURL'])
    audit.append(report)

assert len(products) == 5 and len(audit) == 33
assert all(not r['quarantine'] for r in audit if r['id'] in products)
(D / 'products.json').write_text(json.dumps(products, ensure_ascii=False, indent=2) + '\n')
(D / 'audit.json').write_text(json.dumps({'records': audit, 'summary': {'totalSamsung':33,'oemRamReviewed':5,'oemRamEnriched':5,'newManufacturerConfirmed':0,'ssdHandedToParent':28}}, ensure_ascii=False, indent=2) + '\n')
print(f'{len(products)} exact OEM records enriched; {len(audit)} Samsung IDs accounted for.')
