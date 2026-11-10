"""Fill missing facts from exact-MPN retailer tables already captured by price audits.
Only matched pages, exact product.mpn equality and individual technical rows qualify.
A marketing paragraph, generic family maximum or shipment dimension never supplies a fact.
"""
from pathlib import Path
import copy,datetime,json,re
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/memory-storage'
OWN_STORAGE={'Samsung','Crucial','Kingston','Corsair','ADATA','TeamGroup','Silicon Power','Patriot'}
def number(s):return float(s.replace(' ','').replace('\u00a0','').replace(',','.'))
def enrich(products,inputs,quarantine=()):
 byid={x['component']['id']:x for x in inputs};pages={};audit=[];count=0
 conflicts={(x['mpn'],x['field']) for x in json.loads((OUT/'adata-memory-extraction-audit.json').read_text())['conflicts']} if (OUT/'adata-memory-extraction-audit.json').exists() else set()
 if (OUT/'crucial-memory-source-issues.json').exists():conflicts.update((x['mpn'],x['field']) for x in json.loads((OUT/'crucial-memory-source-issues.json').read_text()))
 for line in (ROOT/'data/deep-review/prices/observations.jsonl').open():
  try:d=json.loads(line)
  except json.JSONDecodeError:continue
  for page in d.get('pages',[]):
   p=page.get('product') or {}
   if page.get('match') is True and p.get('mpn','').upper()==d['mpn'].upper() and p.get('technicalText'):pages.setdefault(d['mpn'].upper(),[]).append((d,page))
 for id,item in byid.items():
  c=item['component'];old=item.get('verified');v=products.get(id);mpn=(v or old or {}).get('mpn')
  if mpn and any(q['id']==id and q['badMPN'].upper()==mpn.upper() for q in quarantine):continue
  if not mpn or (c['category']=='storage' and c['brand'] not in OWN_STORAGE):continue
  if not v and item.get('quarantine'):continue
  for observation,page in pages.get(mpn.upper(),[]):
   text=page['product']['technicalText'];lines=[re.sub(r'\s+',' ',l).strip() for l in text.splitlines()];patch={};facts={};rows=[]
   def match(labels,tail):
    for l in lines:
     m=re.fullmatch('(?:'+labels+r')\s*:?\s*('+tail+')',l,re.I)
     if m:return m[1],l
    return None,None
   def fact(key,labels,tail,parse=lambda x:x):
    value,line=match(labels,tail)
    if value is not None:facts[key]=parse(value);rows.append({'label':key,'value':line})
   if c['category']=='ram':
    fact('memoryVoltageV',r'Tension(?: de mémoire)?|Voltage|Tension de fonctionnement',r'[\d.,]+\s*V',lambda x:number(re.search(r'[\d.,]+',x)[0]))
    fact('heightMm',r'Hauteur(?: du module| module)?',r'[\d.,]+\s*mm',lambda x:number(re.search(r'[\d.,]+',x)[0]))
    fact('memoryEcc',r'ECC(?: système)?',r'Non|No',lambda x:False)
    fact('memoryRegistered',r'Type de (?:mémoire|buffer)|Mémoire tampon',r'Unregistered \(unbuffered\)|Unbuffered|Non tamponnée|Sans tampon',lambda x:False)
    fact('memoryHeatspreader',r'Type de refroidissement|Refroidissement|Dissipateur(?: thermique)?|Radiateur',r'Dissipateur thermique|Dissipateur|Oui',lambda x:True)
    value,line=match(r'Format(?: de mémoire| mémoire| du module)?|Facteur de forme mémoire',r'(?:288.pin )?(?:U-DIMM|UDIMM|DIMM|CUDIMM|SO-DIMM)(?:.*)')
    if value:
     if re.search(r'\bU-?DIMM\b',value,re.I):facts['memoryModuleKind']='UDIMM';facts['memoryModuleFormat']='DIMM'
     elif 'SO-DIMM' in value.upper():facts['memoryModuleKind']='SO-DIMM';facts['memoryModuleFormat']='SO-DIMM'
     elif 'CUDIMM' in value.upper():facts['memoryModuleKind']='CUDIMM';facts['memoryModuleFormat']='DIMM'
     elif 'DIMM' in value.upper():facts['memoryModuleFormat']='DIMM'
     rows.append({'label':'Format du module','value':line})
   else:
    fact('read',r'Vitesse de lecture(?: séquentielle)?|Lecture séquentielle(?: max\.?)?',r'(?:Jusqu[’\']à\s*)?[\d ,.]+\s*(?:Mo|MB)/s')
    fact('write',r'Vitesse d[’\']écriture(?: séquentielle)?|Écriture séquentielle(?: max\.?)?',r'(?:Jusqu[’\']à\s*)?[\d ,.]+\s*(?:Mo|MB)/s')
    fact('endurance',r'(?:Note )?TBW|Endurance \(TBW\)|Indice TBW',r'[\d ,.]+(?:\s*(?:TBW|TB|To))?',lambda x:x if re.search('[A-Za-z]',x) else x+' TBW')
    fact('formFactor',r'Format|Format M\.2|Facteur de forme(?: SSD| du disque SSD)?|Facteur de forme du SSD',r'M\.2\s*[- ]?\s*22(?:30|42|60|80|110)',lambda x:re.sub(r'M\.2\s*[- ]?\s*','M.2 ',x))
    fact('storageHeatsink',r'Dissipateur(?: thermique)?(?: inclus)?|Dissipateur de chaleur|Refroidisseur',r'Oui|Non',lambda x:x.lower()=='oui')
    dimensions,line=match(r'Dimensions \(L x l x H\)|Dimensions \(L × l × H\)|Dimensions \(LxlxH\)',r'[\d.,]+\s*[x×]\s*[\d.,]+\s*[x×]\s*[\d.,]+\s*mm')
    if dimensions:
     a=[number(x) for x in re.findall(r'[\d.,]+',dimensions)]
     if len(a)==3 and 20<=a[0]<=110 and 20<=a[1]<=40 and 0<a[2]<40:facts.update(lengthMm=a[0],widthMm=a[1],heightMm=a[2]);rows.append({'label':'Dimensions du SSD','value':line})
   # A dedicated physical-dimensions section, before any package dimensions.
   dim={}
   for label in ['Largeur','Profondeur','Hauteur']:
    value,line=match(label,r'[\d.,]+\s*mm')
    if value:dim[label]=number(re.search(r'[\d.,]+',value)[0])
   if len(dim)==3:
    length=max(dim['Largeur'],dim['Profondeur']);width=min(dim['Largeur'],dim['Profondeur']);height=dim['Hauteur']
    if c['category']=='ram' and 60<length<150 and width<15 and 10<height<70:facts.setdefault('lengthMm',length);facts.setdefault('thicknessMm',width);facts.setdefault('heightMm',height)
    if c['category']=='storage' and 20<=length<=110 and 20<=width<=40 and 0<height<40:facts.setdefault('lengthMm',length);facts.setdefault('widthMm',width);facts.setdefault('heightMm',height)
   if not facts:continue
   prior=v or old;newfacts={k:val for k,val in facts.items() if (mpn,k) not in conflicts and k not in prior.get('patch',{}) and k not in prior.get('fieldEvidence',{})}
   if not newfacts:continue
   if not v:v=copy.deepcopy(old);products[id]=v
   source={'name':observation['retailer']+' — tableau technique de la référence exacte','url':page['url'],'checkedAt':page['checkedAt'],'kind':'retailer'}
   if source['url'] not in {s['url'] for s in v['sources']}:v['sources'].append(source)
   v.setdefault('fieldEvidence',{});v.setdefault('groups',[]).append({'title':'Revendeur — caractéristiques techniques de la référence exacte','rows':rows})
   for k,val in newfacts.items():
    if k not in ['read','write','endurance','formFactor']:v['patch'][k]=val
    v['fieldEvidence'][k]={'value':val,'sourceURL':source['url'],'checkedAt':source['checkedAt']}
    alias={'heightMm':'height','widthMm':'width','lengthMm':'length','memoryVoltageV':'voltage','memoryModuleKind':'moduleType','memoryHeatspreader':'heatspreader','memoryEcc':'hostEcc','storageHeatsink':'heatsink'}.get(k)
    if alias:v['fieldEvidence'][alias]=copy.deepcopy(v['fieldEvidence'][k])
   audit.append({'id':id,'mpn':mpn,'url':page['url'],'checkedAt':page['checkedAt'],'sha256':page['sha256'],'fields':newfacts});count+=len(newfacts)
 (OUT/'retailer-enrichment.json').write_text(json.dumps({'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'fieldsAdded':count,'records':audit},ensure_ascii=False,indent=2)+'\n')
 return products
