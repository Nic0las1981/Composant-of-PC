"""Build verified PSU records from explicitly curated, model-scoped manufacturer evidence."""
import copy,datetime,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data/deep-review/power-antec-enermax'
INPUT=json.loads((OUT/'input.json').read_text())
COMPONENTS={r['component']['id']:r for r in INPUT}
TODAY=datetime.datetime.now(datetime.timezone.utc).isoformat()
FIELDS={'power':'Puissance nominale','format':'Format alimentation','height':'Hauteur','width':'Largeur','depth':'Profondeur','atx':'Révision ATX','efficiency':'Certification et rendement','modularity':'Modularité','rail12v':'Puissance combinée (+12 V)','connectors':'Connecteurs alimentation','fan':'Ventilateur','protections':'Protections électriques','warranty':'Garantie constructeur'}
PATCH={'power':'wattage','format':'psuFormat','height':'heightMm','width':'widthMm','depth':'depthMm'}
MODELS={};REVIEW={};CORRECTIONS=[]
def source(key):
 p=OUT/'sources'/(key+'.json')
 if p.exists():return json.loads(p.read_text())
 p=OUT/(key+'.json');d=json.loads(p.read_text());text='\n'.join(x.get('text','') for x in d['content'])
 u=re.search(r'^URL: (.+)',text,re.M)
 assert u, key
 return {'key':key,'url':u[1],'checkedAt':TODAY,'primaryText':text}
def rows(key):return [r for t in source(key).get('tables',[]) for r in t if len(r)==2]
def ids(brand,name,power=None,contains=None):
 return [c['id'] for r in INPUT if (c:=r['component'])['brand']==brand and c['name'].split(' · ')[0]==name and (power is None or c['wattage']==power) and (contains is None or contains in c['name'])]
def add(targets,model,src,props,mpn='',notes=None,extra=None,sourceOverrides=None):
 if isinstance(targets,str):targets=[targets]
 assert targets,model
 e=source(src);baseurl=e['url'];date=e.get('checkedAt',TODAY)
 for id in targets:
  assert id in COMPONENTS,id
  assert id not in MODELS,id
  c=COMPONENTS[id]['component'];f={};patch={};display=[];allSources={baseurl:e};props=copy.deepcopy(props)
  for key,value in props.items():
   assert key in FIELDS,key
   ev=source(sourceOverrides[key]) if sourceOverrides and key in sourceOverrides else e
   allSources[ev['url']]=ev
   f[key]={'value':value,'sourceURL':ev['url'],'checkedAt':ev.get('checkedAt',date)}
   display.append({'label':FIELDS[key],'value':str(value)+(' mm' if key in ['height','width','depth'] else ' W' if key=='power' else '')})
   if key in PATCH:patch[PATCH[key]]=value
  if 'fan' in props:
   fan=re.search(r'(\d+(?:\.\d+)?)\s*mm',str(props['fan']))
   if fan:patch.update(fanSizeMm=float(fan[1]),fanCount=1)
   if props['fan']=='Sans ventilateur (refroidissement passif)':patch['fanCount']=0
  if mpn:patch['manufacturerPartNumber']=mpn
  else:patch['manufacturerModel']=model
  patch['name']=model+' · '+str(c['wattage'])+' W'+(' · '+str(props['efficiency']) if 'efficiency' in props else '')
  patch['description']='Alimentation '+model+'. '+('Format '+str(props['format'])+'. ' if 'format' in props else '')+('Câblage '+str(props['modularity']).lower()+'. ' if 'modularity' in props else '')+'Caractéristiques ci-dessous documentées pour cette référence ; les champs non confirmés restent à vérifier.'
  patch['specs']=[str(props[k])+(' W' if k=='power' else '') for k in ['power','format','efficiency','modularity'] if k in props]
  if extra:patch.update(extra)
  offers=[copy.deepcopy(o) for o in (COMPONENTS[id].get('verified') or {}).get('offers',[]) if mpn and o.get('mpn','').upper()==mpn.upper()]
  for k,v in patch.items():
   if k in c and c[k]!=v and k not in ['name','description','specs']:
    CORRECTIONS.append({'id':id,'field':k,'previous':c[k],'corrected':v,'sourceURL':baseurl,'reason':'Valeur explicite pour le modèle exact dans la documentation constructeur.'})
  record={'identityKind':'mpn' if mpn else 'manufacturer-model','mpn':mpn,'identityNote':'Référence commerciale confirmée dans la documentation du fabricant.' if mpn else 'Modèle constructeur documenté ; aucun numéro de pièce commercial régional n’est déduit du code réglementaire ou du code-barres.','sources':[{'name':('Antec — distributeur officiel japonais Links' if 'links.co.jp/' in u else c['brand']+' — documentation constructeur'),'url':u,'checkedAt':s.get('checkedAt',date),'kind':'manufacturer'} for u,s in allSources.items()],'groups':[{'title':'Caractéristiques constructeur — '+model,'rows':display}],'patch':patch,'offers':offers,'notes':notes or [],'fieldEvidence':f}
  if not mpn:record['manufacturerModel']=model
  MODELS[id]=record
  REVIEW[id]={'id':id,'originalName':c['name'],'status':'documented','model':model,'mpn':mpn,'sourceKeys':list(dict.fromkeys([src]+list((sourceOverrides or {}).values()))),'requiredFields':len(FIELDS),'confirmedFields':len(f),'missingFields':[k for k in FIELDS if k not in f]}
def unresolved(targets,reason,sources=None):
 for id in targets:
  if id not in REVIEW:REVIEW[id]={'id':id,'originalName':COMPONENTS[id]['component']['name'],'status':'unresolved','reason':reason,'sourceKeys':sources or []}
def supplement(targets,src,props):
 assert targets,src
 e=source(src)
 for id in targets:
  r=MODELS[id]
  for k,v in props.items():
   assert k in FIELDS
   r['fieldEvidence'][k]={'value':v,'sourceURL':e['url'],'checkedAt':e.get('checkedAt',TODAY)}
   r['groups'][0]['rows']=[row for row in r['groups'][0]['rows'] if row['label']!=FIELDS[k]]
   r['groups'][0]['rows'].append({'label':FIELDS[k],'value':str(v)+(' mm' if k in ['height','width','depth'] else ' W' if k=='power' else '')})
   if k in PATCH:r['patch'][PATCH[k]]=v
  if not any(s['url']==e['url'] for s in r['sources']):r['sources'].append({'name':COMPONENTS[id]['component']['brand']+' — documentation constructeur','url':e['url'],'checkedAt':e.get('checkedAt',TODAY),'kind':'manufacturer'})
  REVIEW[id]['sourceKeys']=list(dict.fromkeys(REVIEW[id]['sourceKeys']+[src]));REVIEW[id]['confirmedFields']=len(r['fieldEvidence']);REVIEW[id]['missingFields']=[k for k in FIELDS if k not in r['fieldEvidence']]
def finish():
 overrides=OUT/'unresolved-reasons.json'
 if overrides.exists():
  for id,r in json.loads(overrides.read_text()).items():unresolved([id],r['reason'],r.get('sourceKeys'))
 for id,row in COMPONENTS.items():
  if id not in REVIEW:unresolved([id],'Les archives consultées ne permettent pas encore de rattacher cette ligne à une révision constructeur exacte ; aucune caractéristique d’une série voisine n’est transférée.')
 searches=json.loads((OUT/'per-id-search-index.json').read_text())
 for id,review in REVIEW.items():review['searches']=[{'key':s['key'],'query':s['query'],'urls':s['urls']} for s in searches if id in s['ids']]
 for brand in ['Antec','Enermax']:
  data={id:r for id,r in MODELS.items() if COMPONENTS[id]['component']['brand']==brand}
  (OUT/(brand.lower()+'-products.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2))
  (ROOT/f'src/data/deepPower{brand}Catalog.ts').write_text("import type { VerifiedProduct } from './verifiedTypes.ts';\n\n// Generated from reviewed, model-specific manufacturer documents.\nexport const deepPower"+brand+'Products: Record<string, VerifiedProduct> = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
 (OUT/'per-id-review.json').write_text(json.dumps(list(REVIEW.values()),ensure_ascii=False,indent=2))
 (OUT/'corrections.json').write_text(json.dumps(CORRECTIONS,ensure_ascii=False,indent=2))
 summary={'total':len(COMPONENTS),'documented':len(MODELS),'complete':sum(len(r['fieldEvidence'])==len(FIELDS) for r in MODELS.values()),'confirmedFields':sum(len(r['fieldEvidence']) for r in MODELS.values()),'requiredFields':len(COMPONENTS)*len(FIELDS),'unresolved':len(COMPONENTS)-len(MODELS),'retainedOffers':sum(len(r['offers']) for r in MODELS.values())}
 (OUT/'summary.json').write_text(json.dumps(summary,indent=2));print(summary)
