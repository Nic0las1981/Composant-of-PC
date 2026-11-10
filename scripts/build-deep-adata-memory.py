"""Extract complete ADATA table rows with manually reviewed merged package bands.
Suffix membership maps below transcribe explicit Single/Dual and edition blocks in
these specific documents. They do not generate or decode any unlisted part number.
Rows lacking an explicit clock/capacity/CAS remain excluded. Conflicting voltage
revisions are retained in the audit and excluded from scalar facts.
"""
from pathlib import Path
import collections,copy,json,re
OUT=Path(__file__).resolve().parents[1]/'data/deep-review/memory-storage';docs=[]
for path in sorted(OUT.glob('adata-exa-*.json'))+sorted(OUT.glob('adata-expansion-exa-*.json')):
 d=json.loads(path.read_text());text='\n'.join(x.get('text','') for x in d.get('result',d.get('response'))['content'])
 for t in re.split(r'(?=^# [^\n]+\nURL: )',text,flags=re.M):
  u=re.search(r'^URL: (\S+)',t,re.M)
  if u:docs.append((u[1],t,d['checkedAt']))
records=[];audit=[]
for url,text,date in docs:
 text=text.replace('–','-');family=None;bands={};defaultvoltage=None;defaults={}
 if 'lancer_blade_rgb_ddr5' in url:
  family='XPG Lancer Blade RGB';bands={'SLABRBK':(1,'black'),'DTLABRBK':(2,'black'),'DTABRBK':(2,'black'),'SLABRWH':(1,'white'),'DTLABRWH':(2,'white')}
 elif 'lancer_blade_ddr5' in url:
  family='XPG LANCER BLADE';bands={'SLABBK':(1,'black'),'DTLABBK':(2,'black'),'SLABWH':(1,'white'),'DTLABWH':(2,'white')}
 elif 'lancer_rgb_ddr5' in url:
  family='XPG LANCER RGB';bands={'CLARBK':(1,'black'),'DCLARBK':(2,'black'),'CLARWH':(1,'white'),'DCLARWH':(2,'white')}
 elif 'spectrix_d35g_ddr4_rgb_memory_20250926' in url:
  family='XPG SPECTRIX D35G RGB';defaultvoltage=1.35;bands={'SBKD35G':(1,'black'),'DTBKD35G':(2,'black'),'SWHD35G':(1,'white'),'DTWHD35G':(2,'white')}
 elif 'gammix_d35_ddr4_memory_20250926' in url:
  family='XPG GAMMIX D35';defaultvoltage=1.35;bands={'SBKD35':(1,'black'),'DTBKD35':(2,'black'),'SWHD35':(1,'white'),'DTWHD35':(2,'white')}
 elif 'gammix_d20_ddr4_dram_20250928' in url:
  family='XPG GAMMIX D20';defaultvoltage=1.35;defaults={'speed':3200};bands={'CBK20':(1,'black'),'DCBK20':(2,'black')}
 elif 'spectrix_d50_ddr4_rgb_dram_20211005' in url:
  family='XPG SPECTRIX D50';bands={'ST50':(1,'gray'),'DT50':(2,'gray'),'SW50':(1,'white'),'DW50':(2,'white')}
 elif 'caster_rgb_ddr5_memory_v1' in url:
  family='XPG CASTER RGB';bands={'CCARGY':(1,'gray'),'DCCARGY':(2,'gray')}
 if not family:continue
 header=text[:text.find('Model Number')] if 'Model Number' in text else text[:2500];ddr='DDR5' if 'ddr5' in url else 'DDR4'
 dim=re.search(r'Dimensions\s*\(?L\s*x\s*W\s*x\s*H\)?\s*:?\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*mm',header,re.I)
 table=text[text.find('Model Number'):].split('Package Information')[0]
 parsed=[]
 for line in table.splitlines():
  flat=re.sub(r'[|]',' ',line);flat=re.sub(r'\s+',' ',flat)
  mpns=re.findall(r'\bAX[45]U[A-Z0-9]+-[A-Z0-9]+\b',flat)
  if len(mpns)!=1:continue
  mpn=mpns[0];suffix=mpn.split('-')[-1]
  if suffix not in bands:continue
  speed=re.search(r'\b(\d{4})\s*(?:MHz|MT/s)',flat);cap=re.search(r'\b(\d+)\s*GB\b',flat);cas=re.search(r'\bCL\s*(\d+)(?:-[\d-]+)?',flat);volt=re.search(r'\b(1\.\d+)\s*V\b',flat)
  if not cap or not cas or not (speed or defaults.get('speed')):continue
  sticks,color=bands[suffix];p={'manufacturerPartNumber':mpn,'capacityGB':int(cap[1])*sticks,'memorySticks':sticks,'memoryType':ddr,'memorySpeedMTs':int(speed[1]) if speed else defaults['speed'],'casLatency':int(cas[1])}
  if volt or defaultvoltage:p['memoryVoltageV']=float(volt[1]) if volt else defaultvoltage
  if re.search(r'U-DIMM|UDIMM',text,re.I):p.update(memoryModuleKind='UDIMM',memoryModuleFormat='DIMM',memoryRegistered=False)
  if re.search(r'heatsink|heat sink|heatspreader',header,re.I):p['memoryHeatspreader']=True
  profile='EXPO/XMP' if 'EXPO' in header and 'XMP' in header else 'EXPO' if 'EXPO' in header else 'XMP' if 'XMP' in header else None
  if profile:p['memoryProfile']=profile
  if dim:
   a=list(map(float,dim.groups()));p.update(lengthMm=max(a),heightMm=sorted(a)[1],thicknessMm=min(a))
  if 'RGB' in family:p['rgb']=True
  src={'name':'ADATA XPG — tableau des références et conditionnement Single/Dual','url':url,'checkedAt':date,'kind':'manufacturer'}
  rr=[{'label':'Ligne du tableau fabricant','value':line.strip(' |')},{'label':'Conditionnement et capacité totale','value':f"{'Single' if sticks==1 else 'Dual'} : {sticks} × {cap[1]} Go = {p['capacityGB']} Go"},{'label':'Finition publiée','value':color},{'label':'Timings testés','value':cas[0]}]
  if dim:rr.append({'label':'Dimensions module L × hauteur × épaisseur','value':f'{p["lengthMm"]} × {p["heightMm"]} × {p["thicknessMm"]} mm'})
  if re.search('limited lifetime|warranty: lifetime',header,re.I):rr.append({'label':'Garantie','value':'Limitée à vie'})
  records.append({'mpn':mpn,'brand':'ADATA','category':'ram','family':family,'colors':[color],'patch':p,'sources':[src],'rows':rr,'fieldEvidence':{k:{'value':v,'sourceURL':url,'checkedAt':date} for k,v in p.items()},'images':[],'url':url})
  parsed.append(mpn)
 audit.append({'url':url,'checkedAt':date,'family':family,'packageBands':bands,'completeRows':parsed,'excludedIncompleteRows':sorted(set(re.findall(r'\bAX[45]U[A-Z0-9]+-[A-Z0-9]+\b',table))-set(parsed))})
# A code can appear in multiple manufacturer revisions; disagreements are not hidden.
groups=collections.defaultdict(list)
for r in records:groups[r['mpn']].append(r)
out=[];conflicts=[]
for mpn,rs in groups.items():
 rec=copy.deepcopy(rs[-1]);rec['sources']=list({x['url']:x for r in rs for x in r['sources']}.values())
 for key in ['memoryVoltageV','capacityGB','memorySticks','memorySpeedMTs','casLatency']:
  values={r['patch'][key] for r in rs if key in r['patch']}
  if len(values)>1:
   conflicts.append({'mpn':mpn,'field':key,'values':sorted(values),'sourceURLs':[r['url'] for r in rs]});rec['patch'].pop(key,None);rec['fieldEvidence'].pop(key,None);rec['rows'].append({'label':'Divergence entre révisions fabricant','value':key+' : '+', '.join(str(v) for v in sorted(values))+' ; valeur unique non retenue.'})
 if all(k in rec['patch'] for k in ['capacityGB','memorySticks','memorySpeedMTs','casLatency']):out.append(rec)
(OUT/'adata-memory-catalog.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');(OUT/'adata-memory-extraction-audit.json').write_text(json.dumps({'documents':audit,'conflicts':conflicts},ensure_ascii=False,indent=2)+'\n')
print({'completePublishedMemorySKUs':len(out),'revisionConflicts':len(conflicts)})
