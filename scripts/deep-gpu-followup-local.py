"""Follow up exact MSI identities from complete archived manufacturer documents.

The repeated/reversed label menus and Memory Size spelling are accepted. URL,
table model, capacity, OC/revision/finish, archived length and clock must agree.
Search snippets never become specifications or prices.
"""
from pathlib import Path
import collections, copy, gzip, hashlib, json, re, runpy, urllib.parse

ROOT = Path(__file__).resolve().parents[1]
D = ROOT / 'data/deep-review/gpu-followup/local'
BASE = ROOT / 'data/deep-review/gpu'
H = runpy.run_path(str(ROOT / 'scripts/deep-gpu-extract.py'))
KEYS = ['Marketing Name','Model Name','Graphics Processing Unit','Interface','Core Clocks','CUDA ® CORES','CUDA® CORES','Cores','Memory Speed','Memory','Memory Size','Memory Bus','Output','HDCP Support','Power consumption','Power consumption (W)','Power connectors','Power Connectors','Recommended PSU','Recommended PSU (W)','Card Dimension (mm)','Card Dimension(mm)','Weight (Card / Package)','DirectX Version Support','OpenGL Version Support','Multi-GPU Technology','Afterburner OC','Maximum Displays','VR Ready','G-SYNC ® technology','G-SYNC® technology','G-SYNC™ technology','Adaptive Vertical Sync','Digital Maximum Resolution','UPC']

def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

def documents():
    for path in sorted((D / 'sources').glob('direct-*.json')):
        data=json.loads(path.read_text())
        if data.get('status')==200:yield data
    for path in sorted((D / 'sources').glob('msi-batch-*.json')):
        data=json.loads(path.read_text())
        text='\n'.join(x.get('text','') for x in data['result'].get('content',[]))
        heads=list(re.finditer(r'(?m)^# ([^\n]+)\nURL: (\S+)',text))
        for i,m in enumerate(heads):
            body=text[m.end():heads[i+1].start() if i+1<len(heads) else len(text)]
            yield {'brand':'MSI','title':m[1],'url':m[2],'requestedURL':m[2], 'text':body,'checkedAt':data['checkedAt'],'status':200,'contentFile':str(path.relative_to(ROOT)), 'sha256':hashlib.sha256(body.encode()).hexdigest(),'digestScope':'exa-full-document-text'}
    for path in sorted((BASE/'sources').glob('*.json')):
        data=json.loads(path.read_text())
        if data.get('brand')=='MSI' and data.get('status')==200 and '/Graphics-Card/' in data.get('url',''):
            yield data

def parse_msi(doc):
    if '/Specification' not in doc['url']: return None
    text=re.sub(r'(?m)^\s*[-#]+\s*','',doc['text'])
    lines=[H['clean'](x) for x in text.splitlines() if H['clean'](x)]
    label='Marketing Name' if 'Marketing Name' in lines else 'Model Name'
    indexes=[i for i,x in enumerate(lines) if x==label]
    if not indexes:return None
    start=indexes[-1]
    if start+1>=len(lines):return None
    # Model is one line; an omitted GPU/interface label must not join it.
    model=lines[start+1]
    if not re.search(r'GeForce|Radeon',model) or len(model)>110:return None
    vals=H['labelled']('\n'.join(lines[start:]),KEYS,stop=r'\n(?:©|All images|This product’s packaging|The terms HDMI)')
    vals[label]=model
    memory=vals.get('Memory',vals.get('Memory Size',''))
    cap=H['num'](memory,r'^(\d+)\s*GB')
    if not cap or len(vals)<8:return None
    slug=urllib.parse.unquote(doc['url'].rstrip('/').split('/')[-2])
    if H['words'](slug,cap,'MSI')!=H['words'](model,cap,'MSI'):
        return None # stale/redirection pages must not impersonate another suffix.
    patch={'capacityGB':int(cap)}
    dims=H['triples'](vals.get('Card Dimension (mm)',vals.get('Card Dimension(mm)','')),'MSI')
    if dims and dims[0]>dims[1]>dims[2]>0:
        patch.update(zip(['lengthMm','heightMm','thicknessMm'],dims))
    for field,labels in [('powerW',['Power consumption','Power consumption (W)']),('recommendedPsuW',['Recommended PSU','Recommended PSU (W)'])]:
        value=next((vals[k] for k in labels if k in vals),'')
        match=re.fullmatch(r'(\d+(?:\.\d+)?)\s*W',value,re.I)
        if match:patch[field]=float(match[1])
    return {'brand':'MSI','model':model,'mpn':'','capacityGB':int(cap),'values':vals,'patch':patch,'notes':[],'source':{k:v for k,v in doc.items() if k not in ['text','links']}}

def compatible(item,fact):
    ok,why=H['matches'](item,fact)
    if not ok:return ok,why
    original=item.get('original') or {}
    length=original.get('length');published=fact['patch'].get('lengthMm')
    if length and published and abs(length-published)>2:return False,'archived_length_conflict'
    boost=original.get('boost_clock');clocks=fact['values'].get('Core Clocks','')
    if boost and clocks and not re.search(r'(?<!\d)'+str(int(boost))+r'\s*MHz',clocks,re.I):return False,'archived_boost_conflict'
    return True,why

def product(facts,item):
    fact=max(facts,key=lambda x:len(x['values']))
    model=fact['model'];patch=copy.deepcopy(fact['patch']);fields={};notes=[];conflicts=[]
    # Complete source documents for the same full model may disagree. Their
    # incompatible fields stay explicitly unresolved instead of picking one.
    for key in list(patch):
        values={json.dumps(f['patch'][key]) for f in facts if key in f['patch']}
        if len(values)>1:
            patch.pop(key);conflicts.append(key)
            fields[key]={'value':None,'sourceURL':fact['source']['url'],'checkedAt':fact['source']['checkedAt'],'conflicting':True,'reason':'Les documents officiels du même modèle publient des valeurs incompatibles.'}
        else:
            fields[key]={'value':patch[key],'sourceURL':fact['source']['url'],'checkedAt':fact['source']['checkedAt']}
    groups=[{'title':'Spécifications officielles MSI — contrôle individuel','rows':[{'label':k,'value':v} for k,v in fact['values'].items()]}]
    if conflicts:
        notes.append('Valeurs contradictoires dans les documents officiels : '+', '.join(conflicts)+'. Les champs de compatibilité concernés restent inconnus.')
        # Keep each conflicting statement visible with its exact source.
        groups += [{'title':'Document officiel complémentaire — '+f['source']['url'],'rows':[{'label':k,'value':v} for k,v in f['values'].items()]} for f in facts if f is not fact]
    patch.update(manufacturerModel=model,description='Carte graphique '+model+' avec '+str(fact['capacityGB'])+' Go de mémoire vidéo. Caractéristiques contrôlées dans les fiches officielles MSI ; le SKU commercial et les champs non publiés restent à confirmer.',detailLevel='documented' if all(patch.get(k) for k in ['lengthMm','heightMm','thicknessMm','powerW','recommendedPsuW']) else 'partial')
    notes.append('Nom complet, capacité, variante OC, mémoire, finition et révision comparés individuellement. Aucun prix n’est associé sans référence commerciale exacte.')
    return {'identityKind':'manufacturer-model','manufacturerModel':model,'mpn':'','identityNote':'Modèle fabricant exact '+model+' ; SKU commercial non publié dans cette source, laissé inconnu.','sources':list({f['source']['url']:{'name':'MSI — fiche officielle','url':f['source']['url'],'checkedAt':f['source']['checkedAt'],'kind':'manufacturer'} for f in facts}.values()),'groups':groups,'patch':patch,'offers':[],'notes':notes,'fieldEvidence':fields}

def physical_details(products,docs):
    url='https://event.msi.com/edm/Newsletter/201901.html'
    source=next((d for d in docs if d['url']==url),None)
    if not source:return
    text=source['text']
    evidence={
        'import-gpu-ae832418723f':('GeForce RTX 2060 GAMING Z 6G', {'fanCount':2,'fanSizeMm':90},'two 9 cm TORX 3.0 fans'),
        'import-gpu-271aa40537a3':('GeForce RTX 2060 VENTUS 6G OC', {'fanCount':2},'new dual-fan thermal design'),
        'import-gpu-d85ee557923d':('GeForce RTX 2060 AERO ITX 6G OC', {'fanCount':1},'single high-performance fan'),
    }
    for cid,(model,fields,quote) in evidence.items():
        record=products.get(cid)
        if not record or quote not in text or H['H'].norm(record['manufacturerModel'])!=H['H'].norm(model):continue
        for key,value in fields.items():
            record['patch'][key]=value
            record['fieldEvidence'][key]={'value':value,'sourceURL':url,'checkedAt':source['checkedAt']}
        record['sources'].append({'name':'MSI — annonce du modèle et ventilation','url':url,'checkedAt':source['checkedAt'],'kind':'manufacturer'})
        record['groups'].append({'title':'Ventilation publiée par MSI','rows':[{'label':'Déclaration constructeur pour le modèle exact','value':quote}]})

def main():
    docs=list(documents());facts=[f for d in docs if (f:=parse_msi(d))]
    write(D/'parsed-facts.json',facts)
    base_reviews=json.loads((BASE/'review.json').read_text());reviews={x['id']:x for x in base_reviews}
    inputs=json.load(gzip.open(BASE/'input.json.gz','rt'));lookup={x['component']['id']:x for x in inputs}
    quarantine={r['id'] for file in [BASE/'quarantine.json',ROOT/'data/comprehensive-review/board-gpu-quarantine.json'] for r in json.loads(file.read_text())}
    out={};review=[];proofs=[]
    for item in inputs:
        cid=item['component']['id']
        if item['component']['brand']!='MSI' or reviews[cid]['state']!='exact_reference_unconfirmed':continue
        candidates=[];rejects=[]
        for f in facts:
            ok,why=compatible(item,f)
            if ok:candidates.append(f)
            elif f['capacityGB']==item['component'].get('capacityGB') and why in ['archived_length_conflict','archived_boost_conflict']:
                rejects.append({'model':f['model'],'reason':why,'sourceURL':f['source']['url']})
        identities={H['H'].norm(f['model']) for f in candidates}
        if cid in quarantine:state='quarantined_identity_not_promoted'
        elif len(identities)==1:
            selected=list({(f['source']['url'],f['source'].get('sha256')):f for f in candidates}.values())
            out[cid]=product(selected,item);state='primary_identity_and_specs'
            proofs.append({'id':cid,'archive':item.get('original'),'manufacturerModel':out[cid]['manufacturerModel'],'capacityGB':out[cid]['patch']['capacityGB'],'matchRule':'full_manufacturer_model_capacity_variant_with_archived_clock_and_dimensions','documents':[f['source'] for f in selected]})
        else:state='multiple_models' if identities else 'followup_required'
        review.append({'id':cid,'state':state,'matchingModels':sorted(identities),'rejectedConflicts':rejects})
    # Existing finish collisions are not bypassed by another parser pass.
    all_by_model=collections.defaultdict(list)
    for cid,rec in {**json.loads((BASE/'products.json').read_text()),**out}.items():
        if lookup[cid]['component']['brand']=='MSI':all_by_model[H['H'].norm(rec.get('manufacturerModel') or rec['mpn'])].append(cid)
    for ids in all_by_model.values():
        finishes={tuple(sorted(re.findall(r'[a-zà-ÿ]+',lookup[cid]['component'].get('finishName','').lower()))) for cid in ids if lookup[cid]['component'].get('finishName')}
        if len(finishes)>1:
            for cid in ids:
                if cid in out:
                    del out[cid]
                    next(r for r in review if r['id']==cid).update(state='archive_finish_collision',collidingIDs=ids)
    physical_details(out,docs)
    proofs=[p for p in proofs if p['id'] in out]
    write(D/'products.json',out);write(D/'review.json',review);write(D/'identity-proofs.json',proofs)
    summary={'documentsExamined':len(docs),'parsedDocuments':len(facts),'newProducts':len(out),'states':dict(collections.Counter(r['state'] for r in review)),'newOffers':0}
    write(D/'summary.json',summary);print(json.dumps(summary))

if __name__=='__main__':main()
