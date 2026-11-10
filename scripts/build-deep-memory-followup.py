"""Add evidence omitted by earlier parsing without broadening sales identities.

Only explicitly documented dissipators/profiles/dimensions are extracted. Generic
XMP/EXPO caution text is excluded. New Royal Neo identities require the complete
archived identity tuple; indistinguishable revisions stay model-only.
"""
from pathlib import Path
import collections, copy, datetime, gzip, hashlib, html, json, re, runpy

ROOT=Path(__file__).resolve().parents[1]
OLD=ROOT/'data/deep-review/memory-storage'
OUT=ROOT/'data/deep-review/memory-followup'
OUT.mkdir(parents=True,exist_ok=True)
ALIASES={'memoryHeatspreader':'heatspreader','memoryProfile':'profile','heightMm':'height','lengthMm':'length','capacityGB':'capacity','memorySticks':'kit','memoryType':'generation','memorySpeedMTs':'rate','casLatency':'cas','memoryVoltageV':'voltage','memoryModuleKind':'moduleType','memoryEcc':'hostEcc'}
LABELS={'memoryHeatspreader':'Dissipateur mémoire','memoryProfile':'Profils mémoire','heightMm':'Hauteur du module (mm)','lengthMm':'Longueur du module (mm)','thicknessMm':'Épaisseur du module (mm)'}

def read(path):return json.loads(path.read_text())
def clean(s):
    s=re.sub(r'<(script|style)\b[^>]*>.*?</\1>', '',s, flags=re.S|re.I)
    return html.unescape(re.sub(r'\s+',' ',re.sub('<[^>]+>',' ',s))).strip()
def source(meta,name):return {'name':name,'url':meta['url'],'checkedAt':meta['checkedAt'],'kind':'manufacturer'}
def proof(value,src,quote,scope):return {'value':value,'sourceURL':src['url'],'checkedAt':src['checkedAt'],'reason':scope+' Passage fabricant : '+quote}
def key(c):return tuple(c.get(k) for k in ['memoryType','capacityGB','memorySticks','memorySpeedMTs','casLatency'])

def main():
    inputs={r['component']['id']:r for r in json.loads(gzip.decompress((OLD/'input.json.gz').read_bytes()))}
    base=read(OLD/'products.json'); indexes=read(OLD/'published-identity-index.json')
    auditById={r['id']:r for r in read(OLD/'audit.json')['records']}
    codeIndex={brand:{r['mpn']:r for r in records} for brand,records in indexes.items()}
    facts=collections.defaultdict(dict); factSources={}; factAudit=[]
    def add(brand,mpn,field,value,src,quote,scope):
        evidence=proof(value,src,quote,scope)
        facts[(brand,mpn)][field]=evidence;factSources[src['url']]=src
        factAudit.append({'brand':brand,'mpn':mpn,'field':field,**evidence})

    # Series construction is explicitly shared; no electrical or pricing fact is
    # transferred from these series announcements.
    doc=read(OUT/'exa-manufacturer-family-heatspreaders.json')
    text='\n'.join(b.get('text','') for b in doc['response']['content'])
    chunks={}
    for chunk in re.split(r'(?=^# [^\n]+\nURL: )',text,flags=re.M):
        url=re.search(r'^URL: (\S+)',chunk,re.M)
        if url:chunks[url[1]]=re.sub(r'\s+',' ',chunk)
    familyRules=[
        ('1525253594',['Trident Z'],'single-piece design that allows direct heat dissipation from heatspreader to cooling fin'),
        ('1525253594',['Ripjaws V'],'With a new generation, comes a new heat spreader design concept.'),
        ('1550825934',['Trident Z Royal'],'polished aluminum heatspreaders of gold or silver colors cools the memory modules'),
        ('1618405504',['Trident Z Royal Elite'],'polished surface of the aluminum heatspreader'),
        ('1562663999',['Trident Z Neo'],'new sleek dual-tone heatspreader design'),
        ('1524212855',['Trident Z RGB'],'Trident Z series heatspreader design'),
        ('1634179023',['Trident Z5','Trident Z5 RGB'],'iconic Trident heatspreader design'),
        ('1661142547',['Trident Z5 Neo','Trident Z5 Neo RGB'],'powder-coated matte black heatspreader'),
        ('1661142547',['Trident Z5 Royal Neo'],'electroplated aluminum heatspreaders with a mirrored finish'),
        ('1661142547',['Ripjaws M5 Neo RGB'],'comes with aluminum heatspreaders in matte black or matte white'),
    ]
    for token,families,quote in familyRules:
        url=next(u for u in chunks if '/'+token+'/' in u)
        assert quote.casefold() in chunks[url].casefold(),(token,quote)
        src=source({'url':url,'checkedAt':doc['checkedAt']},'G.Skill — construction officielle de la série')
        for r in indexes['G.Skill']:
            if r['family'] in families:
                add('G.Skill',r['mpn'],'memoryHeatspreader',True,src,quote,'Construction commune de la série '+r['family']+' ; appartenance du MPN attestée par sa fiche technique exacte.')

    # Explicit absence of any OC profile together with tested SPD parameters is
    # a JEDEC/SPD module, not an assumed XMP/EXPO profile from the series name.
    for rec in read(OLD/'gskill-catalog.json')['records']:
        rows={r['label']:r['value'] for r in rec['rows']}
        if rows.get('OC Profile Support')!='None' or 'Tested Speed (SPD)' not in rows:continue
        src=source(rec,'G.Skill — profil SPD sans profil d’overclocking du MPN exact')
        quote='OC Profile Support: None; Tested Speed (SPD): '+rows['Tested Speed (SPD)']+'; Tested Voltage (SPD): '+rows.get('Tested Voltage (SPD)','')
        for mpn in rec['mpns']:add('G.Skill',mpn,'memoryProfile','JEDEC',src,quote,'Aucun profil OC n’est publié ; paramètres testés explicitement désignés SPD (mode standard).')

    # TEAMGROUP: require the literal MPN in the same page's individual SKU rows.
    teamcache={}
    for r in indexes['TeamGroup']:
        if r.get('category')!='ram':continue
        url=r['url'];stem=hashlib.sha256(url.encode()).hexdigest()[:20]
        if url not in teamcache:
            metaPath=OLD/'teamgroup-family-pages'/(stem+'.json')
            if not metaPath.exists():continue
            meta=read(metaPath);raw=gzip.decompress((ROOT/meta['file']).read_bytes()).decode()
            shared={clean(a):clean(b) for a,b in re.findall(r'<div class="leftTitle">(.*?)</div>\s*<div class="text">(.*?)</div>',raw,re.S)}
            feature=re.search(r'<span[^>]*>FEATURE</span>(.*?)<span[^>]*>CAUTION</span>',raw,re.S)
            feature=clean(feature[1]) if feature else ''
            codes={clean(v) for v in re.findall(r'<td[^>]*>(.*?)</td>',raw,re.S)}
            introductions=[clean(x) for x in re.findall(r'<div class="prIntro">(.*?)</div>',raw,re.S)]
            teamcache[url]=(meta,shared,feature,codes,introductions)
        meta,shared,feature,codes,introductions=teamcache[url]
        if r['mpn'] not in codes:continue
        src=source(meta,'TEAMGROUP — caractéristiques communes et tableau du MPN exact')
        scope='Caractéristique commune sur la page qui liste littéralement le MPN '+r['mpn']+'.'
        heat=shared.get('Heat Spreader',shared.get('Heat Sink',''))
        heatPattern=r'heat[\s-]*spread|heat[\s-]*sink'
        heatPassage=('Heat Spreader / Heat Sink: '+heat) if re.search(heatPattern,heat,re.I) else feature if re.search(heatPattern,feature,re.I) else next((t for t in introductions if re.search(heatPattern,t,re.I)), '')
        # The CLASSIC DDR5 page mistakenly names EXPERT in its thermal paragraph.
        if r['family']=='CLASSIC' and 'EXPERT' in heatPassage:heatPassage=''
        if heatPassage:add('TeamGroup',r['mpn'],'memoryHeatspreader',True,src,heatPassage,scope)
        # Only the FEATURE block, never the generic CAUTION paragraph.
        xmp=bool(re.search(r'(?:supports?|intel)[^.]{0,55}\bXMP\s*[23]',feature,re.I))
        expo=bool(re.search(r'(?:supports?[^.]{0,40}AMD EXPO|AMD EXPO support)',feature,re.I))
        if xmp or expo:
            value='EXPO/XMP' if xmp and expo else 'XMP' if xmp else 'EXPO'
            add('TeamGroup',r['mpn'],'memoryProfile',value,src,feature,scope+' Le bloc de prudences génériques est exclu.')
        conditionalProfile=next((k for k in shared if k.startswith('Profile 8200 MHz↑:') and '8000 MHz↓:' in k),'')
        if conditionalProfile:
            speed=r['patch']['memorySpeedMTs']
            if speed>=8200 or speed<=8000:
                add('TeamGroup',r['mpn'],'memoryProfile','XMP' if speed>=8200 else 'EXPO/XMP',src,conditionalProfile.split(' Operating Temperature')[0],scope+' La tranche de débit publiée est appliquée au débit exact du MPN.')
        dims=shared.get('Dimensions',''); vals={k:float(v) for v,k in re.findall(r'(\d+(?:\.\d+)?)\s*\(([LWH])\)',dims)}
        if len(vals)==3 and len(re.findall(r'\bmm\b',dims))==1 and len(dims)<90:
            for field,axis in [('lengthMm','L'),('heightMm','H'),('thicknessMm','W')]:add('TeamGroup',r['mpn'],field,vals[axis],src,'Dimensions: '+dims,scope)

    # Silicon Power: the product-specific introduction is before the generic
    # motherboard/overclocking guidance. Its P/N table binds the exact SKU.
    spcache={}
    spRecords=read(OLD/'siliconpower-catalog.json')
    for rec in spRecords:
        mpn=rec['mpn'];r=codeIndex['Silicon Power'].get(mpn)
        if not r or r.get('category')!='ram':continue
        meta=rec['source'];url=meta['url']
        if url not in spcache:
            raw=gzip.decompress((ROOT/meta['file']).read_bytes()).decode()
            intro=re.search(r'<div class="bannerImgInfoBox">.*?<div class="intro">(.*?)</div>',raw,re.S)
            spcache[url]=(clean(intro[1]) if intro else '',raw)
        intro,raw=spcache[url]
        if not intro or mpn not in raw:continue
        src=source(meta,'Silicon Power — caractéristiques du modèle et tableau P/N')
        scope='Introduction du produit qui publie le MPN '+mpn+' dans son tableau P/N.'
        if re.search(r'heat\s*spread|heat\s*sink',intro,re.I):add('Silicon Power',mpn,'memoryHeatspreader',True,src,intro,scope)
        xmp=bool(re.search(r'\bXMP\b',intro));expo=bool(re.search(r'\bEXPO\b',intro))
        if xmp or expo:add('Silicon Power',mpn,'memoryProfile','EXPO/XMP' if xmp and expo else 'XMP' if xmp else 'EXPO',src,intro,scope+' Les notes génériques de bas de page sont exclues.')

    # The extra word RGB in the archive is established by the current official
    # product overview. It does not relax generation, kit, rate, CAS or finish.
    overviews=read(OUT/'gskill-overview-audit.json')
    overview=next(r for r in overviews if r['family']=='Trident Z5 Royal Neo')
    raw=gzip.decompress((ROOT/overview['file']).read_bytes()).decode()
    overviewText=clean(raw)
    aliasQuote='Trident Z5 Royal Neo is the luxury-class of overclock performance DDR5 memory designed for compatible AMD platforms, featuring a crown jewel designed crystalline light bar for a magnificent display of customizable RGB lighting'
    assert aliasQuote in overviewText
    aliasSource=source(overview,'G.Skill — Trident Z5 Royal Neo avec éclairage RGB explicite')
    gskillRaw={mpn:r for r in read(OLD/'gskill-catalog.json')['records'] for mpn in r['mpns']}
    faq=read(OLD/'catalog-pages/c3df68cfcef6887587b5.json')
    faqSource=source(faq,'G.Skill — FAQ dimensions et nomenclature publiées')
    additions={}; identityAudits=[];modelAudits=[]
    for id,item in inputs.items():
        c=item['component']
        if c['category']!='ram' or c['brand']!='G.Skill' or id in base or item.get('quarantine'):continue
        if not c['name'].startswith('Trident Z5 Royal Neo RGB '):continue
        tail=c['name'].split('·')[-1].strip()
        color={'Argent':'silver','Or':'gold'}.get(tail)
        if not color:continue
        candidates=[copy.deepcopy(r) for r in indexes['G.Skill'] if r['family']=='Trident Z5 Royal Neo' and key(r['patch'])==key(c) and r['colors']==[color]]
        for r in candidates:
            exact=gskillRaw[r['mpn']];src=source(exact,'G.Skill — fiche technique du MPN exact')
            r['sources']=[src,faqSource,aliasSource];r['rows']=copy.deepcopy(exact['rows'])+[{'label':'Nom fabricant et éclairage','value':aliasQuote}]
            r['patch']['rgb']=True
            r['fieldEvidence']={k:proof(v,faqSource if k in ['heightMm','memoryModuleKind','memoryModuleFormat'] else aliasSource if k=='rgb' else src,aliasQuote if k=='rgb' else 'Caractéristique de la référence '+r['mpn'],'Référence exacte.') for k,v in r['patch'].items()}
            for field,ev in facts.get(('G.Skill',r['mpn']),{}).items():
                r['patch'][field]=ev['value'];r['fieldEvidence'][field]=ev;r['sources'].append(factSources[ev['sourceURL']])
            for field,alias in ALIASES.items():
                if field in r['fieldEvidence']:r['fieldEvidence'][alias]=copy.deepcopy(r['fieldEvidence'][field])
        if len(candidates)==1:
            r=candidates[0]
            v={'mpn':r['mpn'],'identityNote':'Référence fabricant unique après concordance de génération, capacité, nombre de modules, débit, CAS et finition. Le fabricant nomme la série Trident Z5 Royal Neo et confirme explicitement son éclairage RGB.','sources':r['sources'],'groups':[{'title':'Fabricant — référence exacte et éclairage documenté','rows':r['rows']}],'patch':r['patch'],'offers':[],'notes':[],'fieldEvidence':r['fieldEvidence']}
            v['patch']['description']='G.Skill '+c['name']+'. Référence '+r['mpn']+'. Données techniques et éclairage RGB documentés par le fabricant.'
        elif len(candidates)>1:
            v,modelAudit=runpy.run_path(str(ROOT/'scripts/intersect-deep-memory-models.py'))['intersect'](c,candidates)
            if not v:continue
            modelAudits.append(modelAudit)
        else:continue
        additions[id]=v
        identityAudits.append({'id':id,'name':c['name'],'status':'exact_mpn' if v['mpn'] else 'manufacturer_model','mpn':v['mpn'],'candidateMPNs':[r['mpn']for r in candidates],'identityTuple':list(key(c)),'finish':color,'aliasEvidence':{'quote':aliasQuote,'sourceURL':aliasSource['url'],'checkedAt':aliasSource['checkedAt']}})

    deltas={};updates=[]
    for id,v in base.items():
        c=inputs[id]['component']
        if c['category']!='ram':continue
        codes=[v['mpn']] if v['mpn'] else auditById[id].get('candidateMPNs',[])
        if not codes:continue
        proofs=[facts.get((c['brand'],mpn),{}) for mpn in codes]
        shared=set.intersection(*(set(p)for p in proofs))
        patch={};evidence={};sources={};rows=[]
        for field in sorted(shared):
            if field in v['patch']:continue
            values={json.dumps(p[field]['value'])for p in proofs}
            if len(values)!=1:continue
            ev=copy.deepcopy(proofs[0][field]);patch[field]=ev['value']
            if not v['mpn']:ev['reason']='Valeur documentée identiquement pour tous les '+str(len(codes))+' MPN candidats. '+ev['reason']
            evidence[field]=ev
            if field in ALIASES:evidence[ALIASES[field]]=copy.deepcopy(ev)
            for p in proofs:sources[p[field]['sourceURL']]=factSources[p[field]['sourceURL']]
            rows.append({'label':LABELS[field],'value':('Oui' if ev['value'] else 'Non') if isinstance(ev['value'],bool) else str(ev['value'])})
            updates.append({'id':id,'brand':c['brand'],'field':field,'value':ev['value'],'candidateMPNs':codes,'proofs':[{'mpn':mpn,**p[field]}for mpn,p in zip(codes,proofs)]})
        if patch:deltas[id]={'patch':patch,'fieldEvidence':evidence,'sources':list(sources.values()),'groups':[{'title':'Compléments fabricant — construction et profils publiés','rows':rows}]}

    priceRecords=read(OUT/'prices.json') if (OUT/'prices.json').exists() else []
    for rec in priceRecords:
        if 'offer' not in rec or 'error' in rec:continue
        for v in additions.values():
            if not v['mpn'] or v['mpn']!=rec['offer']['mpn']:continue
            v['offers'].append(rec['offer'])
            v['sources'].append({'name':'PC21 — prix TTC, état neuf et disponibilité du MPN exact','url':rec['url'],'checkedAt':rec['checkedAt'],'kind':'retailer'})
            v['notes'].append('Offre PC21 vérifiée sur la page directe ; montant TTC, état neuf et stock explicites. Mise à jour marchand : '+rec['evidence']['merchantUpdatedAtLocal']+'. Le prix indexé du moteur de recherche n’est pas repris.')
    summary={'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'existingProductsEnriched':len(deltas),'newExactMPNProducts':sum(bool(v['mpn'])for v in additions.values()),'newModelProducts':sum(not v['mpn']for v in additions.values()),'newlyDocumentedFields':len(updates),'fieldCounts':dict(collections.Counter(r['field']for r in updates)),'updatedProductsByBrand':dict(collections.Counter(inputs[id]['component']['brand']for id in deltas)),'newCurrentFROffers':sum(len(v['offers'])for v in additions.values()),'newImages':0,'sourceFactCount':len(factAudit),'limitations':['Aucune tension conflictuelle ADATA ou Crucial résolue par hypothèse.','Les précautions génériques XMP/EXPO ne prouvent aucun profil produit.','Les constructions de série ne servent pas à identifier un MPN ni à transférer un prix.','Aucun alias de finition n’est ajouté. Aucun prix de comparateur ni photographie de famille ne devient une offre ou une image exacte.','Les prix français sont des offres TTC observées, sans estimation des frais de livraison.']}
    for name,payload in [('facts.json',factAudit),('deltas.json',deltas),('new-products.json',additions),('identity-audit.json',identityAudits),('model-intersections.json',modelAudits),('field-audit.json',updates),('audit.json',summary)]:
        (OUT/name).write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
    ts="import type { VerifiedProduct } from './verifiedTypes';\nimport { deepMemoryStorageProducts } from './deepMemoryStorageCatalog';\n\n/** Manufacturer evidence omitted by the initial extraction; exact identity remains required. */\nexport const deepMemoryFollowupProducts: Record<string, VerifiedProduct> = "+json.dumps(additions,ensure_ascii=False,indent=2)+";\n\nconst additions: Record<string, Pick<VerifiedProduct, 'patch' | 'fieldEvidence' | 'sources' | 'groups'>> = "+json.dumps(deltas,ensure_ascii=False,indent=2)+";\n\nfor (const [id, extra] of Object.entries(additions)) {\n  const original = deepMemoryStorageProducts[id];\n  if (!original) throw new Error(`Missing memory source record: ${id}`);\n  deepMemoryFollowupProducts[id] = {\n    ...original,\n    patch: { ...original.patch, ...extra.patch },\n    fieldEvidence: { ...original.fieldEvidence, ...extra.fieldEvidence },\n    sources: [...new Map([...original.sources, ...extra.sources].map(source => [source.url, source])).values()],\n    groups: [...original.groups, ...extra.groups],\n  };\n}\n"
    for model in modelAudits:
        ts+='deepMemoryFollowupProducts['+json.dumps(model['id'])+'].patch.manufacturerPartNumber = undefined;\n'
        for field in model['clearTypedFields']:ts+='(deepMemoryFollowupProducts['+json.dumps(model['id'])+'].patch as Record<string, unknown>)['+json.dumps(field)+'] = undefined;\n'
    (ROOT/'src/data/deepMemoryFollowupCatalog.ts').write_text(ts)
    print(json.dumps(summary,ensure_ascii=False))

if __name__=='__main__':main()
