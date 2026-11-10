"""Follow up the 102 unresolved Gigabyte cards using exact manufacturer evidence.

Revision names are parsed separately from marketing names. No revision is
selected by its size/clock. Unspecified revisions publish only facts common to
every linked revision; the exact revision and commercial SKU remain unknown.
White finishes require a manually inspected image from the same product page.
"""
import argparse, collections, concurrent.futures, datetime, gzip, hashlib, importlib.util, json, pathlib, re, urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
D = ROOT / 'data/deep-review/gpu-followup/gigabyte'
spec = importlib.util.spec_from_file_location('gpu_extract', ROOT / 'scripts/deep-gpu-extract.py')
E = importlib.util.module_from_spec(spec)
spec.loader.exec_module(E)

def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

def remove_revision(name):
    return re.sub(r'\(Rev\.[^)]*\)|\bRev[. ]*[\d.]+', '', name, flags=re.I).strip()

def normalized(name, capacity):
    name = re.sub(r'\b(?:LHR|G[56])\b', '', remove_revision(name), flags=re.I)
    return E.words(name, capacity, 'Gigabyte')

def source_revisions(fact):
    title = fact['source']['text'].splitlines()[0]
    match = re.search(r'\(Rev\.\s*([^)]*)\)', title, re.I)
    return re.findall(r'\d+\.\d+', match[1]) if match else []

def load():
    facts = []
    for path in sorted((E.D / 'sources').glob('*.json')):
        source = json.loads(path.read_text())
        if source.get('brand') != 'Gigabyte':
            continue
        fact = E.parse(source)
        if fact:
            fact['sourceFile'] = str(path.relative_to(ROOT))
            facts.append(fact)
    review = {x['id']: x for x in json.loads((E.D / 'review.json').read_text())}
    todo = [x for x in E.INPUT if x['component']['brand'] == 'Gigabyte' and review[x['component']['id']]['state'] == 'exact_reference_unconfirmed']
    return facts, todo

def candidates(item, facts):
    original = item.get('original') or {}
    capacity = original.get('memory', item['component'].get('capacityGB'))
    wanted = normalized(original.get('chipset', '') + ' ' + original.get('name', item['component']['name']), capacity)
    return [f for f in facts if f['capacityGB'] == capacity and normalized(f['model'], capacity) == wanted]

def collect():
    facts, todo = load()
    urls = sorted({f['source']['url'].removesuffix('/sp') for item in todo for f in candidates(item, facts)})
    def fetch(url):
        target = D / 'sources' / (hashlib.sha256(url.encode()).hexdigest()[:20] + '.json')
        if target.exists():
            return
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30) as response:
                body = response.read()
                data = {'url': response.url, 'requestedURL': url, 'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'), 'status': response.status, 'sha256': hashlib.sha256(body).hexdigest(), 'text': E.H.text(body.decode(errors='replace')), 'contentFile': str(target.with_suffix('.html.gz').relative_to(ROOT))}
            target.parent.mkdir(parents=True, exist_ok=True)
            with gzip.open(target.with_suffix('.html.gz'), 'wb') as stream:
                stream.write(body)
        except Exception as error:
            data = {'url': url, 'failure': str(error)}
        write(target, data)
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        list(executor.map(fetch, urls))
    print(json.dumps({'featureURLs': len(urls)}))

def common_facts(facts):
    """Never turn a revision-dependent dimension into a numeric patch."""
    keys = set.intersection(*(set(f['patch']) for f in facts))
    patch = {k: facts[0]['patch'][k] for k in sorted(keys) if all(f['patch'][k] == facts[0]['patch'][k] for f in facts)}
    keys = set.intersection(*(set(f['values']) for f in facts))
    values = {k: facts[0]['values'][k] for k in sorted(keys) if all(f['values'][k] == facts[0]['values'][k] for f in facts)}
    return patch, values

def build():
    facts, todo = load()
    features = {d['url']: d for p in sorted((D / 'sources').glob('*.json')) if (d := json.loads(p.read_text())).get('text')}
    photos = {d['sourceURL']: d for d in json.loads((D / 'images/inspection-index.json').read_text())}
    # Each image was visually inspected. Index 0/4/8/21/30 shows a black
    # product where the archive claims white; no ICE variant is substituted.
    black_photo_indices = {0, 4, 8, 21, 30}
    for photo in photos.values():
        photo['inspectedFinish'] = 'black' if photo['index'] in black_photo_indices else 'white/silver'
        photo['visuallyInspected'] = True
        photo['inspectionNote'] = 'Photo officielle du produit et de son emballage inspectée ; finition globale uniquement, sans inférer matériaux ni dimensions.'
    write(D / 'images/finish-proofs.json', list(photos.values()))
    archive_finishes = collections.defaultdict(set)
    for item in E.INPUT:
        original = item.get('original') or {}
        if item['component']['brand'] != 'Gigabyte':
            continue
        key = (original.get('name', '').lower(), original.get('chipset', '').lower(), original.get('memory'))
        archive_finishes[key].add((original.get('color') or '').lower())
    out, audit, proofs = {}, [], []
    for item in todo:
        component, original = item['component'], item.get('original') or {}
        cid = component['id']
        eligible = candidates(item, facts)
        result = {'id': cid, 'archive': original, 'state': 'unresolved', 'candidateURLs': [f['source']['url'] for f in eligible]}
        reason = None
        capacity = original.get('memory', component.get('capacityGB'))
        rev_match = re.search(r'\bRev[. ]*([\d.]+)', original.get('name', ''), re.I)
        revision = rev_match[1] if rev_match else None
        if revision:
            eligible = [f for f in eligible if revision in source_revisions(f)]
        if not eligible:
            reason = 'exact_name_capacity_or_named_revision_not_found'
        elif len({f['mpn'] for f in eligible}) != 1:
            reason = 'multiple_commercial_codes_for_exact_name'
        elif len(archive_finishes[(original.get('name', '').lower(), original.get('chipset', '').lower(), original.get('memory'))]) > 1:
            reason = 'archive_finish_collision_remains_unresolved'
        if not reason:
            # LHR is not dropped just because a revision is available: its
            # own product page must explicitly publish that discriminator.
            if 'LHR' in original.get('chipset', '').upper() and not all(re.search(r'\bLHR\b|Lite Hash Rate', features.get(f['source']['url'].removesuffix('/sp'), {}).get('text', ''), re.I) for f in eligible):
                reason = 'LHR_not_explicitly_confirmed_for_all_eligible_revisions'
        if not reason:
            memory = re.search(r'\bG([56])\b', original.get('chipset', ''), re.I)
            if memory and not all(f['values'].get('Memory Type') == 'GDDR' + memory[1] for f in eligible):
                reason = 'explicit_memory_type_conflict'
        white = 'white' in (original.get('color') or '').lower()
        if not reason and white and not all(photos.get(f['source']['url'], {}).get('inspectedFinish') == 'white/silver' for f in eligible):
            reason = 'white_finish_not_confirmed_by_same_page_image'
        if not reason and not white and any(photos.get(f['source']['url'], {}).get('inspectedFinish') == 'white/silver' for f in eligible):
            reason = 'archive_finish_conflicts_manufacturer_image'
        if not reason:
            length, boost = original.get('length'), original.get('boost_clock')
            if length and not any(f['patch'].get('lengthMm') and abs(length - f['patch']['lengthMm']) <= 2 for f in eligible):
                # A missing unit is not guessed; this record retains unknown dimensions.
                if any(f['patch'].get('lengthMm') for f in eligible):
                    reason = 'archive_length_conflicts_every_named_revision'
            if boost and not any(re.search(r'(?<!\d)' + str(int(boost)) + r'(?!\d)', f['values'].get('Core Clock', '')) for f in eligible):
                reason = 'archive_clock_conflicts_every_named_revision'
        # All revision links from every selected manufacturer page must have
        # been included. Otherwise an apparent common field is unproven.
        if not reason and not revision:
            available = {f['source']['url'].removesuffix('/sp') for f in eligible}
            base = re.sub(r'-rev-[\d-]+$', '', eligible[0]['source']['url'].removesuffix('/sp'))
            linked = {u for f in eligible for u in f['source'].get('links', []) if re.fullmatch(re.escape(base) + r'(?:-rev-[\d-]+)?', u)}
            if not linked.issubset(available):
                reason = 'linked_revision_document_missing'
        if reason:
            result['reason'] = reason
            audit.append(result)
            continue
        patch, values = common_facts(eligible)
        revision_unknown = not revision and any(source_revisions(f) for f in eligible)
        is_model = bool(revision or revision_unknown)
        first = eligible[0]
        model = remove_revision(first['model']) + (' (Rev. ' + revision + ')' if revision else ' — révision non confirmée' if revision_unknown else '')
        mpn = '' if is_model else first['mpn']
        sources = [{'name': 'Gigabyte — tableau officiel' + (' ; révisions comparées' if revision_unknown else ''), 'url': f['source']['url'], 'checkedAt': f['source']['checkedAt'], 'kind': 'manufacturer'} for f in eligible]
        evidence = {key: {'value': value, 'sourceURL': first['source']['url'], 'checkedAt': first['source']['checkedAt']} for key, value in patch.items()}
        notes = ['La recommandation d’alimentation système est distincte de la consommation électrique de la carte ; powerW reste inconnu.']
        if revision_unknown:
            notes.append('L’archive ne précise pas la révision de PCB. Toutes les révisions liées par le fabricant ont été comparées : seuls les champs identiques sont publiés ; aucun prix ni SKU de révision n’est attribué.')
        if revision:
            notes.append('La révision ' + revision + ' est écrite dans l’archive et dans la fiche officielle. Le code GV partagé par plusieurs révisions n’est pas traité comme un SKU de vente suffisamment discriminant.')
        if white:
            notes.append('La finition blanche/argentée est confirmée par la photo officielle du modèle exact, inspectée individuellement.')
            values['Finition — contrôle visuel'] = 'Blanc / argent, photo officielle du modèle inspectée'
        if 'LHR' in original.get('chipset', '').upper():
            values['LHR'] = 'Oui — mention explicite de la page constructeur de chaque révision retenue'
        # Preserve the complete explicit cooling sentence; mixed fan sizes
        # stay as text. A 2+1 layout is never reduced to its two outer fans.
        cooling = []
        for f in eligible:
            feature = features.get(f['source']['url'].removesuffix('/sp'), {})
            if feature:
                sources.append({'name': 'Gigabyte — présentation du modèle exact', 'url': feature['url'], 'checkedAt': feature['checkedAt'], 'kind': 'manufacturer'})
                match = re.search(r'The WINDFORCE[^.]*cooling system features[^.]*\.', E.clean(feature['text']), re.I)
                if match:
                    cooling.append(match[0])
        if cooling and len(cooling) == len(eligible) and len(set(cooling)) == 1:
            values['Refroidissement — texte constructeur'] = cooling[0]
            fan_match = re.search(r'features\s+(?:(three|two)|([23])\s*[xX])\s*(\d+)mm\s+unique blade fans', cooling[0], re.I)
            if fan_match:
                count = {'three': 3, 'two': 2}.get((fan_match[1] or '').lower(), int(fan_match[2]) if fan_match[2] else 0)
                patch['fanCount'], patch['fanSizeMm'] = count, int(fan_match[3])
                feature = features[eligible[0]['source']['url'].removesuffix('/sp')]
                for field in ['fanCount', 'fanSizeMm']:
                    evidence[field] = {'value': patch[field], 'sourceURL': feature['url'], 'checkedAt': feature['checkedAt']}
        patch['capacityGB'] = capacity
        patch['detailLevel'] = 'partial'
        patch['description'] = 'Carte graphique ' + model + ' avec ' + str(int(capacity)) + ' Go de mémoire vidéo. Caractéristiques publiées par Gigabyte ; les champs absents restent à confirmer.'
        if patch.get('lengthMm') and component.get('lengthMm') != patch['lengthMm']:
            patch['name'] = re.sub(r'\d+(?:\.\d+)? mm$', f"{patch['lengthMm']:g} mm", component['name'])
        if is_model:
            patch['manufacturerModel'] = model
        else:
            patch['manufacturerPartNumber'] = mpn
        values['Code fabricant publié'] = first['mpn']
        values['Révision'] = revision if revision else 'Non confirmée ; seuls les champs communs aux révisions documentées sont publiés' if revision_unknown else 'Aucune révision distincte nommée dans la fiche'
        out[cid] = {'identityKind': 'manufacturer-model' if is_model else 'mpn', **({'manufacturerModel': model} if is_model else {}), 'mpn': mpn, 'identityNote': 'Nom complet, capacité, OC/SUPER/Ti/V2 et finition rapprochés sans remplacer une variante. ' + ('La révision reste explicite dans le modèle constructeur ; aucun SKU de vente de révision n’est déduit.' if is_model else 'Code constructeur publié dans la fiche exacte.'), 'sources': list({s['url']: s for s in sources}.values()), 'groups': [{'title': 'Spécifications fabricant Gigabyte' + (' communes aux révisions' if revision_unknown else ''), 'rows': [{'label': k, 'value': str(v)} for k, v in values.items()]}], 'patch': patch, 'offers': [], 'notes': notes, 'fieldEvidence': evidence}
        proof = {'id': cid, 'archive': original, 'manufacturerModel': model, 'commercialCodePublished': first['mpn'], 'identityKind': out[cid]['identityKind'], 'revision': revision, 'revisionUnconfirmed': revision_unknown, 'sourceDocuments': [{'url': f['source']['url'], 'path': f['sourceFile'], 'sha256': f['source'].get('sha256'), 'revisions': source_revisions(f)} for f in eligible], 'fields': list(patch), 'withheldVaryingFields': sorted(set.union(*(set(f['patch']) for f in eligible)) - set(patch)), 'visualReferences': [photos[f['source']['url']] for f in eligible if f['source']['url'] in photos]}
        proofs.append(proof)
        result.update(state='manufacturer_specs_enriched', identityKind=out[cid]['identityKind'], revision=revision, revisionUnconfirmed=revision_unknown, fields=list(patch))
        audit.append(result)
    # A full direct LDLC read corroborates the unit missing from the official
    # 5060 ICE dimensions. Its explicitly historical price is never current.
    retail_path = D / 'sources/exa-ldlc-5060.json'
    retail = json.loads(retail_path.read_text())
    retail_text = '\n'.join(x.get('text', '') for x in retail['result'].get('content', []))
    cid = 'import-gpu-f484f7fd45ed'
    exact_code = 'GV-N5060EAGLEOC ICE-8GD'
    retail_url = 'https://www.ldlc.com/fiche/PB00684438.html'
    card = out.get(cid)
    if card and card['mpn'] == exact_code and re.search(r'### Modèle\s+' + re.escape(exact_code) + r'\s', retail_text) and 'Muséericorde' in retail_text:
        rows = []
        for label, field in [('Longueur', 'lengthMm'), ('Largeur', 'heightMm'), ('Epaisseur', 'thicknessMm')]:
            match = re.search(r'### ' + label + r'\s+(\d+) mm', retail_text)
            if match:
                value = int(match[1])
                card['patch'][field] = value
                card['fieldEvidence'][field] = {'value': value, 'sourceURL': retail_url, 'checkedAt': retail['checkedAt']}
                rows.append({'label': label, 'value': str(value) + ' mm'})
        if 'WINDFORCE à 2 ventilateurs Hawk Fan' in retail_text:
            card['patch']['fanCount'] = 2
            card['fieldEvidence']['fanCount'] = {'value': 2, 'sourceURL': retail_url, 'checkedAt': retail['checkedAt']}
            rows.append({'label': 'Ventilateurs', 'value': '2 — WINDFORCE Hawk Fan'})
        card['sources'].append({'name': 'LDLC — même MPN, dimensions en mm et dernier prix', 'url': retail_url, 'kind': 'retailer', 'checkedAt': retail['checkedAt']})
        card['groups'].append({'title': 'Complément de fiche LDLC — référence exacte', 'rows': rows})
        price = re.search(r'Dernier prix (\d+)€(\d{2})', retail_text)
        if price:
            card['offers'] = [{'retailer': 'LDLC', 'seller': 'LDLC', 'url': retail_url, 'productName': 'Gigabyte GeForce RTX 5060 EAGLE OC ICE 8G', 'mpn': exact_code, 'retailerReference': 'PB00684438', 'amount': int(price[1]) + int(price[2]) / 100, 'currency': 'EUR', 'market': 'FR', 'condition': 'new', 'availability': 'discontinued', 'priceKind': 'last_known', 'shipping': None, 'shippingNote': 'Produit archivé « Muséericorde » ; dernier prix affiché, aucun tarif de livraison actuel ni achat disponible confirmé.', 'checkedAt': retail['checkedAt']}]
        card['notes'].append('LDLC confirme les dimensions en millimètres et deux ventilateurs pour ce MPN exact. Son prix est explicitement le dernier prix d’un produit archivé ; aucune offre Amazon issue d’un extrait daté d’avril n’est utilisée.')
        proof = next(x for x in proofs if x['id'] == cid)
        proof['retailerSupplement'] = {'url': retail_url, 'path': str(retail_path.relative_to(ROOT)), 'sha256': hashlib.sha256(retail_path.read_bytes()).hexdigest(), 'mpn': exact_code, 'priceKind': 'last_known'}
        proof['fields'] = list(card['patch'])
        next(x for x in audit if x['id'] == cid)['fields'] = list(card['patch'])
    write(D / 'products.json', out)
    write(D / 'review.json', audit)
    write(D / 'proofs.json', proofs)
    summary = {'reviewed': len(todo), 'accepted': len(out), 'byIdentityKind': dict(collections.Counter(x['identityKind'] for x in out.values())), 'knownRevision': sum(bool(x['revision']) for x in proofs), 'unknownRevision': sum(x['revisionUnconfirmed'] for x in proofs), 'unresolved': dict(collections.Counter(x.get('reason') for x in audit if x['state'] == 'unresolved')), 'offers': sum(len(x['offers']) for x in out.values()), 'currentOffers': sum(o['priceKind'] == 'current' for x in out.values() for o in x['offers']), 'historicalOffers': sum(o['priceKind'] == 'last_known' for x in out.values() for o in x['offers']), 'featureDocumentsRead': len(features), 'technicalDocumentsParsed': len(facts)}
    write(D / 'summary.json', summary)
    print(json.dumps(summary, ensure_ascii=False))

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('command', choices=['collect', 'build'])
    args = parser.parse_args()
    collect() if args.command == 'collect' else build()
