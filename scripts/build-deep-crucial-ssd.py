"""Exact Crucial SSD SKU tables and separately sourced family attributes.
No 2230/2280, heatsink, limited-edition or capacity substitution is permitted.
"""
from pathlib import Path
import copy,json,re
OUT=Path(__file__).resolve().parents[1]/'data/deep-review/memory-storage';docs=[];records={};issues=[]
for d in json.loads((OUT/'crucial-datasheets.json').read_text()):
 if d.get('text'):docs.append(d)
x=json.loads((OUT/'crucial-datasheets-exa.json').read_text());raw='\n'.join(c.get('text','') for c in x['response']['content'])
for t in re.split(r'(?=^# [^\n]+\nURL: )',raw,flags=re.M):
 u=re.search(r'^URL: (\S+)',t,re.M)
 if u and 'Request Rejected' not in t[:250]:docs.append({'url':u[1],'text':t,'checkedAt':x['checkedAt'],'kind':'manufacturer'})
def add(d,mpn,cap,family,read=None,write=None,tbw=None,heat=None,form=None,extra=[],dims=None):
 src={'name':'Crucial — flyer constructeur' if d['kind']=='manufacturer' else 'Flyer Crucial distribué par '+re.search(r'https://([^/]+)',d['url'])[1],'url':d['url'],'checkedAt':d['checkedAt'],'kind':d['kind']}
 p={'manufacturerPartNumber':mpn,'capacityGB':cap,'storageInterface':'M.2 NVMe'};ev={};rr=[{'label':'Référence exacte','value':mpn},{'label':'Capacité nominale','value':f'{cap} Go'}]+copy.deepcopy(extra)
 if heat is not None:p['storageHeatsink']=heat
 if dims:
  p.update(lengthMm=dims[0],widthMm=dims[1],heightMm=dims[2]);rr.append({'label':'Dimensions du SSD converties et arrondies à 0,1 mm','value':' × '.join(str(v) for v in dims)+' mm ; source exprimée en pouces'})
 gen=5 if family.split(' ')[0] in ['T700','T705','T710','P510'] else 4
 for key,val,label in [('read',f'{read} Mo/s' if read else None,'Lecture séquentielle maximale'),('write',f'{write} Mo/s' if write else None,'Écriture séquentielle maximale'),('endurance',f'{tbw} TBW' if tbw else None,'Endurance'),('formFactor',form,'Format M.2'),('interfaceGeneration',f'PCIe {gen}.0','Génération PCIe')]:
  if val:ev[key]={'value':val,'sourceURL':src['url'],'checkedAt':src['checkedAt']};rr.append({'label':label,'value':val})
 if re.search(r'5[- ]year|five years|five-year|5 years',d['text'],re.I):ev['warranty']={'value':'5 ans limités / limite TBW','sourceURL':src['url'],'checkedAt':src['checkedAt']};rr.append({'label':'Garantie','value':'5 ans limités / limite TBW'})
 ev.update({k:{'value':v,'sourceURL':src['url'],'checkedAt':src['checkedAt']} for k,v in p.items()})
 r={'mpn':mpn,'brand':'Crucial','category':'storage','family':family,'patch':p,'sources':[src],'rows':rr,'fieldEvidence':ev,'images':[],'url':src['url'],'formFactor':form}
 if mpn in records:
  prior=records[mpn]
  if prior['patch']['capacityGB']!=cap:issues.append({'mpn':mpn,'url':d['url'],'reason':'Le même MPN est imprimé sur plusieurs capacités ; ligne conflictuelle écartée.','capacityGB':cap});return
  # Prefer primary manufacturer evidence for each field but retain distributor-only dimensions.
  for k,v in prior['patch'].items():r['patch'].setdefault(k,v)
  r['fieldEvidence']={**prior['fieldEvidence'],**r['fieldEvidence']};
  if mpn not in d['text'] and 'manufacturerPartNumber' in prior['fieldEvidence']:r['fieldEvidence']['manufacturerPartNumber']=prior['fieldEvidence']['manufacturerPartNumber']
  r['sources']=list({s['url']:s for s in prior['sources']+r['sources']}.values());r['rows']=prior['rows']+r['rows']
 records[mpn]=r
# Structured rows: capacity and code must be printed together with the capacity-specific speeds.
for d in docs:
 t=d['text'];flat=re.sub(r'\s+',' ',t.replace('|',' '));family=next((f for f in ['T700','T705','T500','P3 Plus','P310'] if f.lower() in t[:500].lower()),None)
 if not family:continue
 for m in re.finditer(r'\b(\d+(?:\.\d+)?)\s*(TB|GB)\s+(CT\d+[A-Z0-9]+)\s+([\d,]+)\s*MB/s\s+([\d,]+)\s*MB/s([^\n]*?)(?=\s+\d+(?:\.\d+)?\s*(?:TB|GB)\s+CT|$)',flat):
  cap=int(float(m[1])*(1000 if m[2]=='TB' else 1));mpn=m[3];read=int(m[4].replace(',',''));write=int(m[5].replace(',',''));tail=m[6][:130];heat=re.search(r'\b(Yes|No)\b',tail);heat=(heat[1]=='Yes') if heat else None;tbw=re.search(r'\b([\d,]+)\s*TB\b',tail);tbw=int(tbw[1].replace(',','')) if tbw else None
  if family=='P3 Plus':tbw={500:110,1000:220,2000:440,4000:800}.get(cap)
  form='M.2 2230' if family=='P310' and '2230' in t[:500] else 'M.2 2280' if '2280' in t else None
  dims=None
  if family=='T705' and heat is not None and '3.15 in' in t:dims=[80,23.4,21.1] if heat else [80,22.1,3.8]
  if family=='P310' and heat is not None and '3.15 in' in t:dims=[80,23.4,9.7] if heat else [80,21.8,2.3]
  add(d,mpn,cap,family+(' W/Heatsink' if heat else ''),read,write,tbw,heat,form,dims=dims)
# P5 Plus PDF has shared cells spanning three rows. Transcribed from that column layout.
d=next(x for x in docs if 'crucial-P5-plus-ssd-b2b-flyer.pdf' in x['url'])
for mpn,cap,write,tbw in [('CT500P5PSSD8',500,4000,300),('CT1000P5PSSD8',1000,5000,600),('CT2000P5PSSD8',2000,5000,1200)]:
 assert mpn in d['text'];add(d,mpn,cap,'P5 Plus',6600,write,tbw,extra=[{'label':'MTTF / température de fonctionnement','value':'2 millions d’heures · 0 à 70 °C'}])
# Primary product titles establish literal identities independently of the family flyer.
primary=[]
for f in OUT.glob('crucial-products-exa-*.json'):
 d=json.loads(f.read_text());text='\n'.join(x.get('text','') for x in d['response']['content'])
 for chunk in re.split(r'(?=^# [^\n]+\nURL: )',text,flags=re.M):
  title=chunk.split('\n')[0];u=re.search(r'^URL: (\S+)',chunk,re.M);m=re.search(r'Crucial (T\d+|P\d+|P5 Plus|E100)\s+(\d+(?:\.\d+)?)\s*(TB|GB).*?\|\s*(CT\d+[A-Z0-9]+)',title,re.I)
  if not u or not m or 'Request Rejected' in title:continue
  mpn=m[4].upper();cap=int(float(m[2])*(1000 if m[3].upper()=='TB' else 1));family=m[1].upper();heat=True if 'with heatsink' in title.lower() else None;family+=' W/Heatsink' if heat else '';pd={'url':u[1],'text':chunk,'checkedAt':d['checkedAt'],'kind':'manufacturer'};primary.append((pd,mpn,cap,family,heat))
  if mpn not in records:add(pd,mpn,cap,family,heat=heat)
# P510 capacity columns and cooling dimensions are common to the stated family editions.
p510=next(x for x in docs if 'Docs/147/' in x['url'])
for pd,mpn,cap,family,heat in primary:
 if family.startswith('P510'):
  read,write,tbw={1000:(11000,9500,600),2000:(10000,8700,1200)}[cap]
  # Exact title + distinct official bare/heatsink product pages, not MPN suffix inference.
  bare='with heatsink' not in pd['text'].split('\n')[0].lower();h=not bare
  add(p510,mpn,cap,family,read,write,tbw,h,'M.2 2280',dims=[80,23.4,9.7] if h else [80,21.8,2.3])
 if family.startswith('T710'):
  d=next(x for x in docs if 't710-b2c-product-flyer-en.pdf' in x['url']);heat=bool(heat)
  read,write={1000:(14900,13700),2000:(14500,13800),4000:(14500,13800)}[cap]
  add(d,mpn,cap,family,read,write,tbw={1000:600,2000:1200,4000:2400}[cap],heat=heat,form='M.2 2280',extra=[{'label':'Débits par capacité','value':'Valeurs issues des colonnes du tableau fabricant, recoupées sur les références 1 To et 2 To ; distinctes du maximum marketing de gamme.'}],dims=[80,23.4,21.1] if heat else [80,22.1,3.8])
(OUT/'crucial-ssd-catalog.json').write_text(json.dumps(list(records.values()),ensure_ascii=False,indent=2)+'\n');(OUT/'crucial-ssd-source-issues.json').write_text(json.dumps(issues,ensure_ascii=False,indent=2)+'\n');print({'publishedSSDSKUs':len(records),'sourceConflicts':len(issues)})
