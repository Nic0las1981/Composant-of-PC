"""Reconcile exact ASUS model pages with explicit LHR and new full page reads.

Read-only inputs under gpu/: no approximate name matching, inferred GPU power,
or inferred market price. Outputs are isolated under gpu-followup/asus/.
"""
from pathlib import Path
import collections, copy, gzip, hashlib, json, re, runpy

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'data/deep-review/gpu'
OUT = ROOT / 'data/deep-review/gpu-followup/asus'
B = runpy.run_path(str(ROOT / 'scripts/deep-gpu-board-brands.py'))
E = B['E']

def write(name, data):
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

def model_key(url):
    return re.sub(r'/(?:techspec|spec)/?$', '', url.rstrip('/')).rstrip('/').split('/')[-1]

def read_exa():
    docs = []
    for path in sorted((OUT / 'sources').glob('exa-batch-*.json')):
        saved = json.loads(path.read_text())
        text = '\n'.join(c.get('text', '') for c in saved['result'].get('content', []))
        headers = list(re.finditer(r'(?m)^# ([^\n]+)\nURL: (\S+)', text))
        for pos, header in enumerate(headers):
            body = text[header.end():headers[pos+1].start() if pos+1 < len(headers) else len(text)]
            docs.append({'brand': 'ASUS', 'title': header[1], 'url': header[2], 'text': body,
                         'checkedAt': saved['checkedAt'], 'status': 200,
                         'contentFile': str(path.relative_to(ROOT)),
                         'sha256': hashlib.sha256(body.encode()).hexdigest(),
                         'digestScope': 'exa-full-document-text'})
    return docs

def parse_exa(doc):
    if not re.search(r'/(?:techspec|spec)/?$', doc['url']):
        return None
    text = doc['text']
    labels = E['LABELS']['ASUS'] + ['SFF Ready']
    values = E['labelled'](text, labels, start='Graphic Engine\n', stop=r'\n(?:Disclaimer|Products certified|Need Help\?)')
    capacity = E['num'](values.get('Video Memory', ''), r'^(\d+)\s*GB')
    if not capacity or len(values) < 8:
        return None
    # A literal code must be printed in the page body, before the GPU table.
    # A code present only in a URL is never promoted into an MPN.
    codes = re.findall(r'(?m)^((?:ROG-|TUF-|DUAL-|PRIME-|PROART-|RTX)[A-Z0-9]+(?:-[A-Z0-9]+)+)\s*$', text.split('Graphic Engine')[0])
    mpn = codes[-1] if codes else ''
    model = mpn or re.split(r'\s+-\s+(?:Tech Specs|Specifications)|[|｜]', doc['title'])[0].strip()
    patch = {'capacityGB': int(capacity)}
    dimensions = E['triples'](values.get('Dimensions', '').split('Radiator')[0], 'ASUS')
    if dimensions and dimensions[0] > dimensions[1] > dimensions[2] > 0:
        patch.update(zip(['lengthMm', 'heightMm', 'thicknessMm'], dimensions))
    psu = E['num'](values.get('Recommended PSU', ''), r'^(\d+)\s*W')
    if psu:
        patch['recommendedPsuW'] = psu
    values.pop('Note', None)
    values['Model' if mpn else 'Manufacturer model'] = model
    return {'brand': 'ASUS', 'model': model, 'mpn': mpn, 'capacityGB': int(capacity),
            'values': values, 'patch': patch, 'notes': [], 'source': doc}

def lhr_proof(fact, docs):
    key = model_key(fact['source']['url'])
    for doc in docs:
        if model_key(doc['url']) != key or doc.get('status') != 200:
            continue
        # Exact model feature page, not a mixed listing or related-products card.
        for line in doc.get('text', '').splitlines():
            if re.search(r'This GeForce RTX.*with LHR \(lite hash rate\)', line):
                return {'url': doc['url'], 'checkedAt': doc['checkedAt'], 'quote': line.strip(' -'),
                        'contentFile': doc.get('contentFile'), 'sha256': doc.get('sha256')}
    return None

def matching(item, fact, docs):
    name, capacity = B['expected'](item)
    if not capacity or capacity != fact['capacityGB']:
        return False, 'capacity_mismatch', None
    wanted = B['canonical'](name, capacity, 'ASUS')
    actual = B['canonical'](fact['model'], capacity, 'ASUS')
    proof = None
    if 'lhr' in wanted and 'lhr' not in actual:
        proof = lhr_proof(fact, docs)
        if proof:
            actual = sorted(actual + ['lhr'])
    if wanted != actual:
        return False, 'full_variant_name_or_LHR_unconfirmed', None
    original = item.get('original') or {}
    memory = re.search(r'\bG([56])\b', original.get('chipset', ''), re.I)
    if memory and not re.search(r'GDDR' + memory[1] + r'\b', fact['values'].get('Video Memory', ''), re.I):
        return False, 'explicit_memory_generation_mismatch', None
    if original.get('length') and fact['patch'].get('lengthMm') and abs(original['length'] - fact['patch']['lengthMm']) > 2:
        return False, 'archive_dimension_conflict', proof
    clocks = fact['values'].get('Engine Clock', '')
    if original.get('boost_clock') and 'MHz' in clocks and not re.search(r'(?<!\d)' + str(int(original['boost_clock'])) + r'(?!\d)', clocks):
        return False, 'archive_clock_conflict', proof
    return True, 'exact_model_capacity_variant_and_explicit_LHR' if proof else 'exact_model_capacity_variant', proof

def fan_proof(fact, docs):
    key = model_key(fact['source']['url'])
    patterns = [(3, r'\b(?:all three fans|three (?:tried-and-true )?Axial-tech fans|boasts three fans|triple-fan setup)\b'),
                (2, r'\b(?:two powerful Axial-tech fans|two (?:tried-and-true )?Axial-tech fans|twin fans|two Noctua NF-A12x25 120mm fans)\b')]
    for doc in docs:
        if model_key(doc['url']) != key or doc.get('status') != 200:
            continue
        for line in doc.get('text', '').splitlines():
            if len(line) > 1000 or re.search(r'outer|outside|side fans', line, re.I):
                continue
            for count, pattern in patterns:
                if re.search(pattern, line, re.I):
                    proof = {'url': doc['url'], 'checkedAt': doc['checkedAt'], 'quote': line.strip(' -'),
                             'contentFile': doc.get('contentFile'), 'sha256': doc.get('sha256')}
                    if re.search(r'two Noctua NF-A12x25 120mm fans', line, re.I):
                        proof['fanSizeMm'] = 120
                    return count, proof
    return None, None

def build():
    docs = [json.loads(p.read_text()) for folder in [BASE / 'sources', BASE / 'board-brands/sources'] for p in folder.glob('*.json')]
    docs = [d for d in docs if d.get('brand') == 'ASUS'] + read_exa()
    parsed = [x for x in json.loads((BASE / 'board-brands/parsed.json').read_text()) if x['brand'] == 'ASUS']
    parsed += [x for d in read_exa() if (x := parse_exa(d))]
    baseline = {r['id']: r for r in json.loads((BASE / 'review.json').read_text())}
    items = [i for i in json.load(gzip.open(BASE / 'input.json.gz', 'rt')) if i['component']['brand'] == 'ASUS' and baseline[i['component']['id']]['state'] == 'exact_reference_unconfirmed']
    quarantine = {r['id'] for path in [ROOT / 'data/comprehensive-review/board-gpu-quarantine.json', BASE / 'quarantine.json'] if path.exists() for r in json.loads(path.read_text())}
    products, review, proofs = {}, [], []
    for item in items:
        cid = item['component']['id']; eligible = []; rejected = collections.Counter()
        for fact in parsed:
            ok, reason, proof = matching(item, fact, docs)
            if ok:
                eligible.append((fact, proof, reason))
            elif reason not in ['capacity_mismatch', 'full_variant_name_or_LHR_unconfirmed']:
                rejected[reason] += 1
        keys = {model_key(f['source']['url']) for f, _, _ in eligible}
        memory_types = {B['memory_type'](f['values'].get('Video Memory', '')) for f, _, _ in eligible}
        if len(keys) > 1 or len(memory_types) > 1:
            rejected['multiple_distinct_model_or_memory_variants'] = len(keys); eligible = []
        if cid in quarantine:
            rejected['existing_identity_quarantine_requires_separate_resolution'] = 1; eligible = []
        if not eligible:
            review.append({'id': cid, 'state': 'unresolved', 'reasons': dict(rejected) or {'no_exact_source': 1}, 'modelKeys': sorted(keys)})
            continue
        # Prefer global specification pages. Archived regional differences remain
        # visible as source evidence; the chosen source is stated per field.
        eligible.sort(key=lambda e: (-bool(re.fullmatch(r'[A-Z0-9]+(?:-[A-Z0-9]+)+', e[0]['mpn'] or '')), '/us/' in e[0]['source']['url'] or '/uk/' in e[0]['source']['url'], -len(e[0]['values'])))
        fact, lhr, method = eligible[0]; fact = copy.deepcopy(fact); source = fact['source']
        patch = copy.deepcopy(fact['patch']); values = {k: v for k, v in fact['values'].items() if k != 'Note'}
        raw_mpn = fact['mpn']; mpn = raw_mpn if re.fullmatch(r'[A-Z0-9]+(?:-[A-Z0-9]+)+', raw_mpn or '') else ''
        field_evidence = {k: {'value': v, 'sourceURL': source['url'], 'checkedAt': source['checkedAt']} for k, v in patch.items()}
        refs = [{'name': 'ASUS — spécifications du modèle exact', 'url': source['url'], 'checkedAt': source['checkedAt'], 'kind': 'manufacturer'}]
        if lhr:
            refs.append({'name': 'ASUS — LHR explicitement publié', 'url': lhr['url'], 'checkedAt': lhr['checkedAt'], 'kind': 'manufacturer'})
            values['LHR — description du fabricant'] = lhr['quote']
        fans, fan = fan_proof(fact, docs)
        if fans:
            patch['fanCount'] = fans
            field_evidence['fanCount'] = {'value': fans, 'sourceURL': fan['url'], 'checkedAt': fan['checkedAt']}
            values['Ventilateurs — description du fabricant'] = fan['quote']
            refs.append({'name': 'ASUS — refroidissement du modèle exact', 'url': fan['url'], 'checkedAt': fan['checkedAt'], 'kind': 'manufacturer'})
            if fan.get('fanSizeMm'):
                patch['fanSizeMm'] = fan['fanSizeMm']
                field_evidence['fanSizeMm'] = {'value': fan['fanSizeMm'], 'sourceURL': fan['url'], 'checkedAt': fan['checkedAt']}
        patch.update(description='Carte graphique ' + fact['model'] + ' avec ' + str(int(fact['capacityGB'])) + ' Go de mémoire vidéo. Les caractéristiques publiées sont issues des documents ASUS du modèle exact ; les champs non publiés restent à confirmer.', detailLevel='partial')
        if patch.get('lengthMm'):
            patch['name'] = re.sub(r'\d+(?:\.\d+)? mm$', f"{patch['lengthMm']:g} mm", item['component']['name'])
        if mpn:
            patch['manufacturerPartNumber'] = mpn
        else:
            patch['manufacturerModel'] = fact['model']
        record = {'identityKind': 'mpn' if mpn else 'manufacturer-model', 'mpn': mpn,
                  'identityNote': 'Nom, capacité et suffixes exacts rapprochés avec le document ASUS. ' + ('Le statut LHR est explicitement confirmé sur la page du même modèle. ' if lhr else '') + ('Code commercial imprimé dans la fiche.' if mpn else 'MPN commercial non publié ; aucun SKU ni prix attribué par déduction.'),
                  'sources': list({s['url']: s for s in refs}.values()),
                  'groups': [{'title': 'Spécifications détaillées du fabricant ASUS', 'rows': [{'label': k, 'value': v} for k, v in values.items()]}],
                  'patch': patch, 'offers': [], 'fieldEvidence': field_evidence,
                  'notes': ['La recommandation d’alimentation concerne le système complet et ne constitue pas la consommation électrique de la carte.', 'Aucun prix de l’archive importée ni d’une autre variante n’est repris.']}
        if not mpn:
            record['manufacturerModel'] = fact['model']
        products[cid] = record
        proofs.append({'id': cid, 'method': method, 'original': item.get('original'), 'modelKey': model_key(source['url']),
                       'publishedModel': fact['model'], 'source': {k: v for k, v in source.items() if k not in ['text', 'links']},
                       'lhrProof': lhr, 'fanProof': fan})
        review.append({'id': cid, 'state': 'primary_specs_enriched', 'identityKind': record['identityKind'], 'sourceURL': source['url']})
    write('products.json', products); write('review.json', review); write('proofs.json', proofs)
    write('summary.json', {'reviewed': len(items), 'newlyEnriched': len(products), 'unresolved': len(items)-len(products),
                           'mpnIdentities': sum(bool(p['mpn']) for p in products.values()), 'modelIdentities': sum(not p['mpn'] for p in products.values()),
                           'explicitLhrProofs': sum(bool(p['lhrProof']) for p in proofs), 'fanCountsAdded': sum('fanCount' in p['patch'] for p in products.values()),
                           'retailerOffers': 0, 'exaSearchCalls': 10, 'exaSourcesReviewed': 50,
                           'sourceDocumentsParsed': len(parsed), 'fullExaDocumentsRead': len(read_exa())})
    print(json.loads((OUT / 'summary.json').read_text()))

if __name__ == '__main__':
    build()
