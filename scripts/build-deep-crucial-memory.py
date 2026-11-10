"""Read literal Ballistix SKU tables in retained manufacturer flyers.
Distributor-hosted copies remain retailer sources. Color bands were visually
checked on page 2; no generated MPN or guessed DDR timing is admitted.
"""
from pathlib import Path
import collections,copy,json,re
OUT=Path(__file__).resolve().parents[1]/'data/deep-review/memory-storage'
docs=json.loads((OUT/'crucial-memory-datasheets.json').read_text());records=[];issues=[]
def record(d,mpn,family,color,p,line):
 p={**p,'manufacturerPartNumber':mpn,'memoryType':'DDR4','memoryModuleFormat':'DIMM','memoryHeatspreader':True}
 t=d['text']
 if 'XMP' in t:p['memoryProfile']='XMP'
 src={'name':'Crucial / Ballistix — tableau du fabricant, copie conservée par le distributeur','url':d['url'],'checkedAt':d['checkedAt'],'kind':d['kind']}
 rows=[{'label':'Référence exacte','value':mpn},{'label':'Ligne du tableau publié','value':re.sub(r'\s+',' ',line).strip()},{'label':'Finition','value':', '.join(color)+' — photographie et bande de couleur du tableau, page 2'}]
 if re.search(r'limited lifetime|garantía limitada de por vida|制限付',t,re.I):rows.append({'label':'Garantie publiée','value':'Garantie limitée à vie ; le document précise une durée de 10 ans en Allemagne.'})
 records.append({'mpn':mpn,'brand':'Crucial','category':'ram','family':family,'colors':color,'patch':p,'sources':[src],'rows':rows,'fieldEvidence':{k:{'value':v,'sourceURL':src['url'],'checkedAt':src['checkedAt']} for k,v in p.items()},'images':[],'url':src['url']})
# English kit flyer and Spanish single/kit flyer use visually explicit black/red/white bands.
for index,spanish in [(4,False),(13,True)]:
 d=docs[index];t=d['text'];state=None;bandrow=0
 for line in t.splitlines():
  if 'Crucial Ballistix MAX' in line:state='max';continue
  if re.search(r'Crucial Ballistix \| RGB',line):state='standard';bandrow=0;continue
  if 'Crucial Ballistix SODIMM' in line:state=None
  if not state or not re.search(r'\bBL[M]?[A-Z0-9]+\b',line) or 'DDR4-' not in line:continue
  before,after=line.split('DDR4-',1);speed=re.match(r'(\d+)\s+CL(\d+)\s+([\d.,]+)\s*V',after)
  if not speed:continue
  codes=re.findall(r'\bBL[M]?[A-Z0-9]+\b',after);density=re.search(r'(\d+)\s*GB\s*\(\s*(\d+)\s*GB\s*x\s*(\d+)\)',before)
  single=re.search(r'^\s*(\d+)\s*GB\s*/',before)
  if not density:continue
  if state=='max':color='black'
  else:color=('black' if bandrow<(10 if spanish else 12) else 'red' if bandrow<(19 if spanish else 22) else 'white');bandrow+=1
  for mpn in codes:
   iskit=bool(re.match(r'BLM?2K',mpn));rgb=mpn.endswith('L');p={'capacityGB':int(density[1]) if iskit else int(single[1]) if single else None,'memorySticks':int(density[3]) if iskit else 1,'memorySpeedMTs':int(speed[1]),'casLatency':int(speed[2]),'memoryVoltageV':float(speed[3].replace(',','.')),'rgb':rgb}
   if p['capacityGB'] is None:continue
   family='Ballistix'+(' MAX' if state=='max' else '')+(' RGB' if rgb else '')
   record(d,mpn,family,[color],p,line)
# Older Elite and Sport AT flyers publish complete capacity/timing rows.
# Black Elite and silver/black Sport AT are explicitly pictured beside these tables.
for index,family,color in [(6,'Ballistix Elite',['black']),(10,'Ballistix Elite',['black']),(7,'Ballistix Sport AT',['silver','black']),(15,'Ballistix Sport AT',['silver','black'])]:
 d=docs[index]
 for line in d.get('text','').splitlines():
  m=re.search(r'\b(BL[A-Z0-9]+)\s+(.*?)\s+DDR4-(\d+)\s+(\d+-\d+-\d+)\s+([\d.,]+)\s*V',line)
  if not m:continue
  den=m[2];capacity=re.match(r'(\d+)[ -]*GB',den);kit=re.search(r'\((\d+)\s*x\s*\d+\s*GB\)',den);jp=re.search(r'（\s*\d+GBx(\d+)）',den)
  if not capacity:continue
  p={'capacityGB':int(capacity[1]),'memorySticks':int((kit or jp)[1]) if kit or jp else 1,'memorySpeedMTs':int(m[3]),'casLatency':int(m[4].split('-')[0]),'memoryVoltageV':float(m[5].replace(',','.'))}
  if ' SR' in den:p['memoryRankCount']=1
  if ' DR' in den:p['memoryRankCount']=2
  record(d,m[1],family,color,p,line)
bycode=collections.defaultdict(list)
for r in records:bycode[r['mpn']].append(r)
result=[]
for mpn,rs in bycode.items():
 r=copy.deepcopy(rs[-1]);keys={k for x in rs for k in x['patch']}
 for k in keys:
  values={json.dumps(x['patch'][k]) for x in rs if k in x['patch']}
  if len(values)>1:
   issues.append({'mpn':mpn,'field':k,'values':[json.loads(x) for x in sorted(values)],'sourceURLs':[x['url'] for x in rs],'action':'typed field excluded'})
   r['patch'].pop(k,None);r['fieldEvidence'].pop(k,None);r['rows'].append({'label':'Divergence entre documents','value':k+' : '+', '.join(sorted(values))+' ; valeur non retenue dans les caractéristiques normalisées.'})
 r['sources']=list({x['url']:x for rec in rs for x in rec['sources']}.values());result.append(r)
(OUT/'crucial-memory-catalog.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');(OUT/'crucial-memory-source-issues.json').write_text(json.dumps(issues,ensure_ascii=False,indent=2)+'\n');print('literal published SKUs',len(result),'contradictions',len(issues))
