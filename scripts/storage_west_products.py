"""Build exact-capacity product records from manually reviewed source tables."""
import json,re,gzip,html
from urllib.parse import urlparse

REQUIRED=['capacity','interface','interfaceGeneration','formFactor','length','height','width','read','write','nand','endurance','warranty','heatsink']
MANUFACTURERS=['sandisk.com','westerndigital.com','seagate.com','skhynix.com','solidigm.com','kioxia.com','micron.com','transcend-info.com']

def generate(root,out,inputs,sources,families):
    # Additional corrections visible in the complete, capacity-specific primary tables.
    for security in ['Pyrite','Opal']:
        families['SN740 '+security]['dimensions']=[80,22,2.38]
    m=families['Micron 7400 PRO'];m['warranty']=5;m['variants'][480]['endurance']=800
    m['fieldSources']={};m['sources'].append('2991c1a0a02c0b88')
    m['notes']=['M.2 2280 de 480 Go. Les versions M.2 22110, U.3 et E1.S sont exclues. Endurance publiée : 800 To en écritures aléatoires 4K et 3800 To en séquentiel 128K ; la valeur 4K est retenue. Suffixe OEM, dissipateur et hauteur non établis.']
    m['extra']={'Endurance séquentielle 128K':'3800 To écrits','Protection coupure de courant':'Présente'}

    def source_text(key):
        d=sources[key]
        if d.get('text'):return d['text']
        f=out/'sources'/f'{key}.txt'
        if f.exists():return f.read_text()
        if 'data' in d:return json.dumps(d['data'],ensure_ascii=False)
        f=out/'sources'/f'{key}.html.gz'
        if f.exists():return html.unescape(re.sub('<[^>]+>',' ',gzip.open(f,'rt').read()))
        return ''

    def source_record(key):
        d=sources[key];host=urlparse(d['url']).hostname or ''
        manufacturer=any(host==h or host.endswith('.'+h) for h in MANUFACTURERS)
        return {'name':d.get('title') or ('Solidigm — catalogue officiel' if 'solidigm' in host else host),'url':d['url'],'checkedAt':d['checkedAt'],'kind':'manufacturer' if manufacturer else 'retailer'}

    def choose(component):
        name=component['name'].lower();hs=any(t in name for t in ['heatsink','dissipateur'])
        if component['id']=='import-ssd-d0d28414b576':return 'SN850 heatsink'
        if 'call of duty' in name:return 'SN850 Call of Duty Edition'
        if component['brand']=='SanDisk':return 'SanDisk Extreme'
        if component['brand']=='Micron':return 'Micron 7400 PRO' if '7400' in name else 'Micron 3400'
        if 'exceria' in name and hs:return 'EXCERIA heatsink'
        if 'sn740' in name:return 'SN740 Opal' if 'opal' in name else 'SN740 Pyrite'
        if 'bg5' in name:return 'BG5 SED' if 'sed' in name else 'BG5'
        for key in sorted(families,key=len,reverse=True):
            if key.endswith(' heatsink'):continue
            if key.lower() in name:return key+(' heatsink' if hs and key+' heatsink' in families else '')
        raise ValueError('Unmapped exact family: '+component['id']+' '+name)

    products={};reviews=[];corrections=[];identityproof=[]
    for item in inputs:
        c=item['component'];id=c['id'];key=choose(c);f=families[key];cap=c['capacityGB'];oldcap=cap
        if key=='P41 Plus' and cap==500:cap=512
        if key.startswith('SN740 ') or key.startswith('BG5') or key in ['Micron 3400','EXCERIA heatsink']:
            cap={1000:1024,2000:2048,4000:4096}.get(cap,cap)
        assert cap in f['variants'],(id,key,cap)
        v={**f,**f['variants'][cap]};main=v['source'];field_sources={**f.get('fieldSources',{}),**f['variants'][cap].get('fieldSources',{})}
        notes=list(f['notes']);mpn=v['mpn'];identity_source=v.get('identitySource',main);old=item.get('verified')
        extra_sources=[]
        # Keep the previously checked retail packaging identity, rather than silently switching the pack.
        if id=='ssd-sn570-1':
            mpn=old['mpn'];extra_sources=old['sources'];identity_source=None
            notes.append('Conditionnement commercial WDBB9E0010BNC-WRSN conservé ; tableau technique WD Blue SN570 1 To recoupé avec sa fiche LDLC exacte.')
        if mpn and identity_source:
            compact=lambda s:re.sub(r'\s+','',s).upper()
            assert compact(mpn) in compact(source_text(identity_source)),(id,mpn,identity_source,'MPN absent from saved proof')
        dims=v['dimensions'];interface=v['interface'];hs=v['heatsink'];graphene='graphène' in v.get('extra',{}).get('Dissipateur détaillé','')
        cooling='Film graphène' if graphene else 'Dissipateur fourni' if hs else 'Sans dissipateur' if hs is False else None
        values={'capacity':cap,'interface':'M.2 NVMe','formFactor':'M.2 2280','length':dims[0],'width':dims[1],'height':dims[2],
                'read':v['read'],'write':v['write'],'nand':v['nand'],'endurance':v['endurance'],'warranty':v['warranty'],'heatsink':cooling}
        # A generation without an explicit lane count does not satisfy this combined requirement.
        if re.search(r'x4',interface,re.I):values['interfaceGeneration']=interface
        field_evidence={};used=[main,*f.get('sources',[]),*v.get('sources',[])]
        if identity_source:used.append(identity_source)
        for field,value in values.items():
            if value is None:continue
            sk=field_sources.get(field,v.get('dimensionSource',main) if field in ['length','width','height'] else main)
            s=source_record(sk);used.append(sk)
            field_evidence[field]={'value':value,'sourceURL':s['url'],'checkedAt':s['checkedAt']}
        source_list=[source_record(k) for k in dict.fromkeys(used)]
        source_list.extend(s for s in extra_sources if s['url'] not in {s['url'] for s in source_list})
        label=f'{cap//1000} To' if cap%1000==0 else f'{cap} Go'
        modelname=key.replace(' heatsink',' avec dissipateur').replace('SanDisk ','').replace('Micron ','')
        # Explicit revision uncertainty remains in the displayed model.
        if key=='Game Drive' and cap<4000:modelname='Game Drive M.2 (révision à confirmer)'
        if key=='Game Drive' and cap==4000:notes=['Game Drive M.2 4 To GP304001 avec dissipateur. La fiche SC12 de la gamme PS5 NVMe plus récente ne couvre que 1 et 2 To et n’est pas utilisée pour ses caractéristiques.']
        name=f'{modelname} {label}'
        manufacturer_model=f"{c['brand']} {name} — M.2 2280"
        missing=[k for k in REQUIRED if k not in field_evidence]
        patch={'capacityGB':cap,'storageInterface':'M.2 NVMe','name':name,'manufacturerPartNumber':mpn,
               'specs':[label,'M.2 2280',interface], 'description':f"{c['brand']} {name}. {interface}."}
        if not mpn:patch['manufacturerModel']=manufacturer_model
        for prop,value in zip(['lengthMm','widthMm','heightMm'],dims):
            if value is not None:patch[prop]=value
        if hs is not None:patch['storageHeatsink']=hs
        if v['read'] is not None:
            speed=f"Lecture jusqu’à {v['read']} Mo/s"+(f" ; écriture jusqu’à {v['write']} Mo/s" if v['write'] is not None else '')
            patch['specs'].append(speed);patch['description']+=' '+speed+'.'
        if cooling:patch['specs'].append(cooling);patch['description']+=' '+cooling+'.'
        if all(d is not None for d in dims):patch['description']+=' Dimensions documentées (L × l × h) : '+' × '.join(str(d).replace('.',',') for d in dims)+' mm.'
        if missing:patch['description']+=' Les champs non documentés restent signalés dans la fiche.'
        if oldcap!=cap:
            corrections.append({'id':id,'field':'capacityGB','oldValue':oldcap,'newValue':cap,'oldName':c['name'],'newName':name,'sourceURL':sources[main]['url'],'reason':'Correspondance univoque de la capacité nominale d’archive avec la capacité publiée dans le tableau constructeur de cette gamme.'})
            notes.append(f'Capacité d’archive corrigée : {oldcap} Go → {cap} Go selon le constructeur ; les textes du produit ont été corrigés également.')
        def rows(entries):return [{'label':label,'value':str(value)} for label,value in entries if value is not None]
        identity_rows=[('Fabricant',c['brand']),('Modèle',name),('Référence constructeur',mpn or None),('Capacité',label),('Format M.2','M.2 2280'),('Interface détaillée' if 'x4' in interface else 'Protocole publié',interface)]
        perf_rows=[('Lecture séquentielle',f"Jusqu’à {v['read']} Mo/s" if v['read'] is not None else None),('Écriture séquentielle',f"Jusqu’à {v['write']} Mo/s" if v['write'] is not None else None),('Type NAND',v['nand']),('Endurance TBW',f"{v['endurance']} To écrits" if v['endurance'] is not None else None),('Garantie fabricant',f"{v['warranty']} ans, sous réserve de l’endurance et des conditions fabricant" if v['warranty'] is not None else None)]
        physical_rows=[('Longueur',f'{dims[0]} mm' if dims[0] is not None else None),('Largeur',f'{dims[1]} mm' if dims[1] is not None else None),('Hauteur',f'{dims[2]} mm' if dims[2] is not None else None),('Dissipateur',cooling)]
        groups=[{'title':'Identité et interface','rows':rows(identity_rows)},{'title':'Performances et endurance','rows':rows(perf_rows)},{'title':'Dimensions et refroidissement','rows':rows(physical_rows)}]
        if v.get('extra'):groups.append({'title':'Caractéristiques complémentaires','rows':rows(v['extra'].items())})
        # No inherited offer crosses a revision, capacity or package identity.
        offers=[o for o in (old or {}).get('offers',[]) if mpn and o['mpn'].strip().upper()==mpn.upper()]
        product={'identityKind':'mpn' if mpn else 'manufacturer-model','mpn':mpn,
          'identityNote':f'Référence documentée : {mpn}. Capacité, format et version de dissipateur contrôlés individuellement.' if mpn else 'Modèle constructeur identifié par gamme, capacité et format. Aucun code de commande commercial n’est inventé ; aucune offre tarifaire n’est associée sans MPN exact.',
          'sources':source_list,'groups':groups,'patch':patch,'offers':offers,'notes':notes,'fieldEvidence':field_evidence}
        if not mpn:product['manufacturerModel']=manufacturer_model
        products[id]=product
        reviews.append({'id':id,'brand':c['brand'],'family':key,'originalName':c['name'],'name':name,'capacityGB':cap,'identityKind':product['identityKind'],'mpn':mpn or None,'sourceKeys':list(dict.fromkeys(used)),'documented':len(field_evidence),'total':len(REQUIRED),'missing':missing,'status':'documented' if not missing else 'partial','notes':notes})
        identityproof.append({'id':id,'mpn':mpn,'sourceKey':identity_source,'priorVerifiedRetailIdentity':id=='ssd-sn570-1'})
    assert len(products)==147 and len(products)==len(inputs)
    for name,obj in [('products',products),('per-id-review',reviews),('corrections',corrections),('identity-evidence',identityproof),('curated-families',families)]:
        (out/f'{name}.json').write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
    (root/'src/data/deepStorageWestCatalog.ts').write_text("import type { VerifiedProduct } from './verifiedTypes';\n\n/** Exact SSD capacities and revisions; sources retained under data/deep-review/storage-west. */\nexport const deepStorageWestProducts: Record<string, VerifiedProduct> = "+json.dumps(products,ensure_ascii=False,indent=2)+';\n')
    summary={'products':len(products),'completeTechnicalRecords':sum(not r['missing'] for r in reviews),'mpnIdentities':sum(bool(p['mpn']) for p in products.values()),'modelIdentities':sum(not p['mpn'] for p in products.values()),'fieldEvidence':sum(len(p['fieldEvidence']) for p in products.values()),'capacityCorrections':len(corrections),'retainedOffers':sum(len(p['offers']) for p in products.values())}
    (out/'summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary))
