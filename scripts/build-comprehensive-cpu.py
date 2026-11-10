"""Compile 26 CPU sheets from exact retained pages and native manufacturer reads.
PBP/TDP and MTP/PPT are kept distinct. No prices are refreshed by this script.
"""
from pathlib import Path
import json,gzip,copy,re,datetime,collections,hashlib
R=Path(__file__).resolve().parents[1];D=R/'data/comprehensive-review';E=D/'cpu-evidence';E.mkdir(exist_ok=True)
input_path=E/'input.json.gz'
if not input_path.exists():input_path.write_bytes(gzip.compress(Path('/tmp/cpu-comprehensive-input.json').read_bytes(),mtime=0))
items=json.loads(gzip.decompress(input_path.read_bytes()));byid={x['component']['id']:x for x in items}
def normalize(s):return re.sub(r'[^a-z0-9]','',s.lower())
def getfield(text,label):
 m=re.search(r'(?:^|\n)'+re.escape(label)+r'\s*\n+([^\n]+)',text)
 return m[1].strip() if m else None
# Recover primary retailer tables that were lost because HTML cells were fused.
labels=['Architecture hybride','Nombre total de cœurs','Nombre de cœurs (P-cores)','Nombre de threads','Fréquence base P-core','Fréquence de base P-core','Fréquence turbo P-core','Fréquence turbo max P-core','Fréquence base E-core','Fréquence de base E-core','Fréquence turbo E-core','Fréquence turbo max E-core','Fréquence turbo max','Fréquence Turbo max','Fréquence de base','Cache Smart L3','Cache L3 (Smart Cache)','Cache L2 total','TDP (puissance base)','Puissance base (TDP)','Puissance de base (TDP)','Puissance turbo max','Socket','Mémoire maximale prise en charge','Types de mémoire compatibles','Canaux de mémoire','Canaux mémoire','Contrôleur mémoire','Mémoire prise en charge','PCI Express','Lignes PCI Express','Refroidisseur fourni','Refroidisseur inclus','Refrigerateur inclus','Graphiques intégrés','Adaptateur graphique intégré','Overclocking possible','Dimensions du processeur','Taille du CPU','Température maximale TJunction','Technologies avancées']
labels.sort(key=len,reverse=True);tables={}
with gzip.open(R/'data/full-review/reviews.jsonl.gz','rt') as f:
 for l in f:
  rec=json.loads(l);item=byid.get(rec['componentId'])
  if not item:continue
  for page in rec.get('primaryPages',[]):
   p=page.get('product') or {}
   if not page.get('match') or p.get('mpn')!=item['verified']['mpn']:continue
   text=p.get('technicalText','');start=re.search(r'Sp[eé]cification\s*D[eé]tail\s*\n',text,re.I);rows=[]
   if start:
    region=re.split(r'\nFAQs?',text[start.end():],maxsplit=1,flags=re.I)[0]
    for line in region.splitlines():
     for label in labels:
      if line.startswith(label) and len(line)>len(label):rows.append({'label':label,'value':line[len(label):].strip()});break
   else:
    region=re.split(r'Sp[eé]cifications?:',text,maxsplit=1,flags=re.I)[-1]
    for line in region.splitlines():
     m=re.match(r'^([^:]{2,95}):\s*(.+)$',line)
     if m and len(m[2])<250:rows.append({'label':m[1].strip(),'value':m[2].strip()})
   if rows:tables[rec['componentId']]={'url':page['url'],'checkedAt':page['checkedAt'],'sha256':page.get('sha256'),'mpn':p['mpn'],'rows':rows}
(E/'retailer-tables.json').write_text(json.dumps(tables,ensure_ascii=False,indent=2)+'\n')
products={};audit=[];cleared=[]
for item in items:
 c=item['component'];id=c['id'];v=copy.deepcopy(item['verified']);patch=copy.deepcopy(v['patch']);mpn=v['mpn'];model=c['name'];brand=c['brand'];key=id.replace('cpu-','');notes=[];rows=[];provenance={};source=None
 if brand=='AMD':
  live=E/f'amd-{key}-live.json';old=R/f'data/evidence/amd-{key}.json'
  if live.exists():
   doc=json.loads(live.read_text());text=doc['text'];url=doc['url'];checked=doc['checkedAt'];status=doc['httpStatus']
  else:
   doc=json.loads(old.read_text());text=re.sub(r'\n{3,}','\n\n',doc['markdown']);url=doc['metadata']['url'];checked=doc['retrievedAt'];status=doc['metadata']['statusCode']
  name=getfield(text,'Name') or ''
  assert status==200 and normalize(model) in normalize(name),(id,'manufacturer model mismatch',name)
  source={'name':'AMD — caractéristiques du modèle exact','url':url,'checkedAt':checked,'kind':'manufacturer'}
  mapping={'# of CPU Cores':'Cœurs','# of Threads':'Threads','Base Clock':'Fréquence de base','Max. Boost Clock':'Fréquence boost','L1 Cache':'Cache L1','L2 Cache':'Cache L2','L3 Cache':'Cache L3','Default TDP':'TDP nominal','CPU Socket':'Socket','System Memory Type':'Contrôleur mémoire','Memory Channels':'Canaux mémoire','Max. Memory':'Capacité mémoire maximale','Graphics Model':'Graphiques intégrés','Graphics Core Count':'Cœurs graphiques','Graphics Frequency':'Fréquence graphique','Max. Operating Temperature (Tjmax)':'Température maximale','Processor Architecture':'Architecture CPU','PCI Express® Version':'Interface PCIe','ECC Support':'Prise en charge ECC','Unlocked for Overclocking':'Multiplicateur débloqué'}
  for label,target in mapping.items():
   value=getfield(text,label)
   if value:
    if target=='Graphiques intégrés' and value=='Discrete Graphics Card Required':value='Non — carte graphique dédiée requise'
    rows.append({'label':target,'value':value});provenance[target]={'url':url,'sourceLabel':label}
  for label in ['2x1R','2x2R','4x1R','4x2R']:
   value=getfield(text,label)
   if value and re.match('DDR[45]-',value):rows.append({'label':'Vitesse mémoire '+label,'value':value})
  for src,dst in [('CPU Socket','socket'),('Memory Channels','memoryChannels'),('Max. Memory','maxMemoryGB')]:
   value=getfield(text,src)
   if value:patch[dst]=value if dst=='socket' else int(re.search(r'\d+',value)[0])
  memory=getfield(text,'System Memory Type')
  if memory and memory in ['DDR4','DDR5']:patch['supportedMemory']=[memory]
  # A boxed cooler is not automatically included with a tray SKU, nor does
  # the new 5800X3D POF package prove the old WOF bundle contents.
  boxed=getfield(text,'Product ID Boxed')
  if boxed==mpn:
   cooler=getfield(text,'Thermal Solution (PIB)')
   if cooler:rows.append({'label':'Refroidisseur fourni avec ce conditionnement','value':cooler})
  elif id=='cpu-5800x3d':notes.append('La page AMD actuelle mentionne le conditionnement 100-100000651POF. Seules ses caractéristiques du processeur Ryzen 7 5800X3D sont reprises ; aucun accessoire de ce conditionnement n’est attribué au WOF vendu ici.')
  patch['powerW']='__UNDEFINED__';patch['detailLevel']='partial';cleared.append(id)
  notes.append('Le TDP constructeur décrit une enveloppe thermique. Aucune limite électrique PPT du modèle n’est publiée dans les sources consultées : la valeur électrique précédente est retirée et le budget reste partiel. Aucun coefficient TDP → PPT n’est appliqué.')
 else:
  doc=json.loads((E/f'intel-{key}-live.json').read_text());text=doc['text'];url=doc['url'];checked=doc['checkedAt'];assert normalize(getfield(text,'Processor Number') or '') in normalize(model) and getfield(text,'Processor Number'),id
  source={'name':'Intel — caractéristiques du modèle exact','url':url,'checkedAt':checked,'kind':'manufacturer'}
  mapping={'Total Cores':'Cœurs','# of Performance-cores':'Cœurs P','# of Efficient-cores':'Cœurs E','Total Threads':'Threads','Max Turbo Frequency':'Fréquence boost','Performance-core Max Turbo Frequency':'Fréquence boost P-core','Efficient-core Max Turbo Frequency':'Fréquence boost E-core','Performance-core Base Frequency':'Fréquence de base','Efficient-core Base Frequency':'Fréquence de base E-core','Cache':'Cache L3','Total L2 Cache':'Cache L2','Processor Base Power':'Puissance de base du processeur (PBP)','Maximum Turbo Power':'Puissance électrique maximale Turbo (MTP)','Max Memory Size (dependent on memory type)':'Capacité mémoire maximale','Max # of Memory Channels':'Canaux mémoire','Max Memory Bandwidth':'Bande passante mémoire maximale','PCI Express Revision':'Interface PCIe','Max # of PCI Express Lanes':'Lignes PCIe','Sockets Supported':'Socket','TJUNCTION':'Température maximale','Package Size':'Dimensions du boîtier CPU'}
  for label,target in mapping.items():
   value=getfield(text,label)
   if value:rows.append({'label':target,'value':value});provenance[target]={'url':url,'sourceLabel':label}
  types=re.search(r'\nMemory Types\n(.*?)\nMax # of Memory Channels',text,re.S)
  if types:
   value=' · '.join(types[1].splitlines());rows.append({'label':'Contrôleur mémoire','value':value});patch['supportedMemory']=sorted(set(re.findall('DDR[45]',value)))
  patch['socket']='LGA1700' if getfield(text,'Sockets Supported')=='FCLGA1700' else c['socket']
  for label,k in [('Max Memory Size (dependent on memory type)','maxMemoryGB'),('Max # of Memory Channels','memoryChannels'),('Maximum Turbo Power','powerW')]:
   value=getfield(text,label)
   if value:patch[k]=int(re.search(r'\d+',value)[0])
  notes.append('Puissance de base (PBP) et Maximum Turbo Power (MTP) sont publiés séparément par Intel. Le budget électrique utilise le MTP documenté, pas le PBP ; les réglages de carte mère peuvent modifier les limites.')
 # Source-backed fallback for fields omitted on a manufacturer page.
 retailer_rows=[r for g in v['groups'] for r in g['rows']]+tables.get(id,{}).get('rows',[])
 if not any(r['label']=='Canaux mémoire' for r in rows):
  found=next((r for r in retailer_rows if r['label'] in ['Type de contrôleur mémoire','Canaux de mémoire','Canaux mémoire'] and re.search('Dual|Double|double|2',r['value'])),None)
  if found:rows.append({'label':'Canaux mémoire','value':'2 (double canal)'});patch['memoryChannels']=2;provenance['Canaux mémoire']={'url':tables.get(id,{}).get('url',v['sources'][0]['url']),'sourceLabel':found['label']}
 if not any(r['label']=='Graphiques intégrés' for r in rows):
  found=next((r for r in retailer_rows if r['label'] in ['Graphiques intégrés','Adaptateur graphique intégré','Carte graphique intégrée','Contrôleur graphique intégré']),None)
  if found:rows.append({'label':'Graphiques intégrés','value':found['value']});provenance['Graphiques intégrés']={'url':tables.get(id,{}).get('url',v['sources'][0]['url']),'sourceLabel':found['label']}
 packaging=[r for r in retailer_rows if r['label'] in ['Version Boîte','Ventilateur fourni','Refroidisseur fourni','Refroidisseur inclus','Refrigerateur inclus']]
 unique={(r['label'],r['value']):r for r in packaging}
 patch['manufacturerPartNumber']=mpn
 value_by_label={r['label']:r['value'] for r in rows}
 description=[f"{brand} {model} — référence {mpn}."]
 if 'Cœurs' in value_by_label and 'Threads' in value_by_label:description.append(f"{value_by_label['Cœurs']} cœurs et {value_by_label['Threads']} threads.")
 if 'Fréquence de base' in value_by_label and 'Fréquence boost' in value_by_label:description.append(f"Fréquence de base {value_by_label['Fréquence de base']} ; boost constructeur {value_by_label['Fréquence boost']}.")
 if brand=='AMD':description.append(f"TDP {value_by_label.get('TDP nominal','à confirmer')} ; limite électrique PPT non documentée dans les sources consultées.")
 else:description.append(f"Puissance de base {value_by_label.get('Puissance de base du processeur (PBP)','à confirmer')} ; puissance maximale Turbo {value_by_label.get('Puissance électrique maximale Turbo (MTP)','à confirmer')}.")
 patch['description']=' '.join(description)
 v['sources']=[source]+[s for s in v['sources'] if s['url']!=source['url']]
 v['groups']=[{'title':'Caractéristiques du processeur — modèle exact','rows':rows}]
 if unique:v['groups'].append({'title':'Conditionnement de la référence marchande','rows':list(unique.values())})
 v['patch']=patch;v['notes']+=notes;products[id]=v
 essential=['Cœurs','Threads','Fréquence de base','Fréquence boost','Cache L3','Contrôleur mémoire','Canaux mémoire','Graphiques intégrés','Socket']
 missing=[k for k in essential if k not in value_by_label]
 if brand=='AMD':missing.append('PPT non publié')
 audit.append({'id':id,'mpn':mpn,'manufacturerSource':source,'status':'documented_except_ppt' if missing==['PPT non publié'] else 'partial' if missing else 'documented','missing':missing,'electricalBudget':{'valueW':None if brand=='AMD' else patch.get('powerW'),'kind':'unknown_ppt' if brand=='AMD' else 'manufacturer_mtp','oldValueW':c.get('powerW')},'fieldSources':provenance,'offerDatesPreserved':[o['checkedAt'] for o in v['offers']],'notes':notes})
result={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'summary':{'reviewed':len(audit),'manufacturerPages':len(audit),'amdElectricalValuesCleared':len(cleared),'intelMtpDocumented':sum(x['electricalBudget']['kind']=='manufacturer_mtp' for x in audit),'statusCounts':dict(collections.Counter(x['status'] for x in audit))},'records':audit}
(D/'cpu.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
serialized=json.dumps(products,ensure_ascii=False,indent=2).replace('"__UNDEFINED__"','undefined')
(R/'src/data/comprehensiveCpu.ts').write_text('// Generated by scripts/build-comprehensive-cpu.py. No TDP-to-PPT inference.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const comprehensiveCpuRecords: Record<string,VerifiedProduct> = '+serialized+';\n')
print(json.dumps(result['summary'],indent=2));print('Missing:',[(x['id'],x['missing']) for x in audit if x['missing']!=['PPT non publié'] and x['missing']])
