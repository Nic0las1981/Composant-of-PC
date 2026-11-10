"""Strict per-ID matching to retained manufacturer SKU tables.
Never constructs an MPN, chooses between indistinguishable SKUs, or copies prices.
Source variants and common family dimensions remain separately attributable.
"""
from pathlib import Path
import collections,copy,datetime,gzip,hashlib,html,json,re,unicodedata,runpy
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/memory-storage'
inputs=json.loads(gzip.decompress((OUT/'input.json.gz').read_bytes()));byid={r['component']['id']:r for r in inputs}
def norm(x):return re.sub(r'[^a-z0-9α]+',' ',unicodedata.normalize('NFKD',str(x).lower())).strip()
def clean(x):return html.unescape(re.sub(r'\s+',' ',re.sub('<[^>]+>',' ',x))).strip()
def numeric(x):
 m=re.search(r'\d+(?:\.\d+)?',str(x));return float(m[0]) if m else None
def source(meta,name):return {'name':name,'url':meta['url'],'checkedAt':meta['checkedAt'],'kind':'manufacturer'}
def fields(p,src,notapp={}):return {k:{'value':v,'sourceURL':src['url'],'checkedAt':src['checkedAt'],**({'notApplicable':True,'reason':notapp[k]} if k in notapp else {})} for k,v in p.items() if k!='description'}
def componentsku(c):return (byid[c['id']].get('verified') or {}).get('mpn') or c.get('manufacturerPartNumber')
def namedfamily(c):return re.split(r'\s+\d+(?:\.\d+)?\s*(?:Go|To|GB|TB)\b',c['name'])[0].strip()
def archivecolors(c):
 tail=c['name'].split('·')[-1] if '·' in c['name'] else ''
 table={'noir':'black','blanc':'white','rouge':'red','gris':'gray','argent':'silver','or':'gold','bleu':'blue','rose':'pink','jaune':'yellow','orange':'orange','vert':'green','violet':'purple'}
 return {table[s] for s in re.findall(r'\b(?:noir|blanc|rouge|gris|argent|or|bleu|rose|jaune|orange|vert|violet)\b',tail.lower())}
def memorykey(p):return tuple(p.get(k) for k in ['memoryType','capacityGB','memorySticks','memorySpeedMTs','casLatency'])
def parsecap(s):
 m=re.fullmatch(r'\s*(\d+)\s*[x×]\s*(\d+)\s*GB(?: memory modules)?\s*',s,re.I)
 if m:return int(m[1])*int(m[2]),int(m[1])
 m=re.search(r'(\d+)\s*GB\s*\(\s*(\d+)\s*GB\s*[x×]\s*(\d+)\)',s,re.I)
 if m:return int(m[1]),int(m[3])
 m=re.search(r'(\d+)\s*GB\s*\(\s*(\d+)\s*[x×]\s*(\d+)\s*GB\s*\)',s,re.I)
 if m:return int(m[1]),int(m[2])
 m=re.fullmatch(r'\s*(\d+)\s*GB\s*',s,re.I)
 return (int(m[1]),1) if m else (None,None)
faqmeta=json.loads((OUT/'catalog-pages/c3df68cfcef6887587b5.json').read_text());faqhtml=gzip.decompress((ROOT/faqmeta['file']).read_bytes()).decode();faqtext=clean(faqhtml)
heights={a:float(b) for a,b in re.findall(r'([A-Za-z0-9 ]+(?:RGB|Neo|Elite|Royal|S5|X5| V| 4| X|Z5|Z|DDR4|DDR5)):\s*(\d+(?:\.\d+)?)\s*mm',faqtext)}
# The manufacturer's FAQ supplies series height and nomenclature, not an invented SKU.
heightmap={'Ripjaws S5':33,'Ripjaws M5 RGB':41,'Ripjaws M5 Neo RGB':41,'Flare X5':33,'Trident Z5':44,'Trident Z5 RGB':44,'Trident Z5 Royal':44,'Trident Z5 Royal Neo':44,'Trident Z5 Neo':44,'Trident Z5 Neo RGB':44,'Ripjaws V':42,'Ripjaws 4':40,'Flare X':40,'Sniper X':43,'Trident Z':44,'Trident Z Neo':44,'Trident Z RGB':44,'Trident Z Royal':44,'Trident Z Royal Elite':44,'Aegis DDR4':31.2}
gskill=[]
for rec in json.loads((OUT/'gskill-catalog.json').read_text())['records']:
 d={r['label']:r['value'] for r in rec.get('rows',[])}
 cap,sticks=parsecap(d.get('Capacity',''));speed=next((numeric(v) for k,v in d.items() if k.startswith('Tested Speed')),None);latency=next((v for k,v in d.items() if k.startswith('Tested Latency')),None);volt=next((numeric(v) for k,v in d.items() if k.startswith('Tested Voltage')),None)
 if not all([cap,sticks,speed,latency,volt]):continue
 p={'capacityGB':cap,'memorySticks':sticks,'memoryType':d.get('Memory Type'),'memorySpeedMTs':int(speed),'casLatency':int(numeric(latency)),'memoryVoltageV':volt}
 profile=d.get('OC Profile Support','')
 if 'EXPO' in profile or 'XMP' in profile:p['memoryProfile']='EXPO/XMP' if 'EXPO' in profile and 'XMP' in profile else 'EXPO' if 'EXPO' in profile else 'XMP'
 if d.get('Registered/Unbuffered')=='Unbuffered':p['memoryRegistered']=False
 if d.get('Error Checking (ECC)')=='Non-ECC':p['memoryEcc']=False
 if rec['family'] in heightmap:p['heightMm']=heightmap[rec['family']]
 src=source(rec,'G.Skill — fiche de la référence exacte');fs=source(faqmeta,'G.Skill — FAQ dimensions et nomenclature publiées')
 for mpn in rec['mpns']:
  patch=copy.deepcopy(p);patch['manufacturerPartNumber']=mpn;colors=set()
  if mpn.startswith('F5-'):
   suffix=mpn.split('-')[-1];m=re.match(r'F5-\d+([UJCRS])',mpn)
   if m:
    kind={'U':'UDIMM','J':'UDIMM','C':'CUDIMM','R':'RDIMM','S':'SO-DIMM'}[m[1]];patch['memoryModuleKind']=kind;patch['memoryModuleFormat']='SO-DIMM' if kind=='SO-DIMM' else 'DIMM'
   if suffix[-1:] in 'KWSG' and suffix[:-1] in ['TR5','TR5N','TZ5','TZ5R','TZ5N','TZ5NR','RM5R','RM5NR','RS5','FX5','IS','TZ5C','TZ5CR','ZR5','ZR5N','T5','G5','G5N']:colors.add({'K':'black','W':'white','S':'silver','G':'gold'}[suffix[-1]])
  else:
   suffix=re.sub(r'^\d+G','',mpn.split('-')[-1]);suffix=re.sub(r'[ABC]$','',suffix) if suffix not in ['RB','VB'] else suffix
   mapped={'VR':{'red'},'VB':{'blue'},'VK':{'black'},'VS':{'silver'},'VG':{'gray'},'RR':{'red'},'RB':{'blue'},'RK':{'black'},'TRG':{'gold'},'TRS':{'silver'},'TEG':{'gold'},'TES':{'silver'},'TZ':{'black','silver','red'},'TZSW':{'silver','white'},'TZSK':{'silver','black'},'TZKW':{'black','white'},'TZKO':{'black','orange'},'TZKY':{'black','yellow'},'SXK':{'black'},'SXW':{'white'},'SXF':{'green'}}
   colors=mapped.get(suffix,set())
   patch['memoryModuleFormat']='SO-DIMM' if 'SO-DIMM' in rec['family'] else 'DIMM'
   if patch.get('memoryRegistered') is False:patch['memoryModuleKind']='SO-DIMM' if patch['memoryModuleFormat']=='SO-DIMM' else 'UDIMM'
  proof=fields(patch,src)
  for k in ['heightMm','memoryModuleKind','memoryModuleFormat']:
   if k in patch:proof[k]={'value':patch[k],'sourceURL':fs['url'],'checkedAt':fs['checkedAt']}
  allowedfinishes=[['black','silver'],['black','silver','red']] if not mpn.startswith('F5-') and suffix=='TZ' else []
  gskill.append({'allowedArchiveFinishes':allowedfinishes,'mpn':mpn,'brand':'G.Skill','family':rec['family'],'patch':patch,'colors':sorted(colors),'sources':[src,fs],'rows':rec['rows'],'fieldEvidence':proof,'images':rec['images'],'url':src['url']})
# TeamGroup comparison and product detail pages list exact rows plus explicitly shared specifications.
team=[];teamcache={};teampdfs={d['url']:d for d in json.loads((OUT/'teamgroup-datasheets.json').read_text()) if d.get('text')}
for rec in json.loads((OUT/'teamgroup-catalog.json').read_text()):
 if rec.get('category') not in ['ram','storage']:continue
 mpn=rec['mpn'];url=rec['familyURL'];key=hashlib.sha256(url.encode()).hexdigest()[:20];folder=OUT/'teamgroup-family-pages';path=folder/(key+'.html.gz');meta=folder/(key+'.json')
 if not path.exists():continue
 cached=teamcache.get(url)
 if cached is None:
  doc=gzip.decompress(path.read_bytes()).decode();shared=[{'label':clean(a),'value':clean(b)} for a,b in re.findall(r'<div class="leftTitle">(.*?)</div>\s*<div class="text">(.*?)</div>',doc,re.S)];headings=[clean(t) for t in re.findall(r'<th class="specTableColumn"[^>]*>(.*?)</th>',doc,re.S)];exactrows={}
  for tr in re.findall(r'<tr class="specTableRow specTableRowContent">(.*?)</tr>',doc,re.S):
   cells=[clean(x) for x in re.findall(r'<td[^>]*>(.*?)</td>',tr,re.S)];row=[{'label':k,'value':v} for k,v in zip(headings,cells) if k!='Compare']
   for cell in cells:
    if re.fullmatch(r'[A-Z0-9_-]{10,}',cell):exactrows[cell]=row
  pdfs=[teampdfs[u] for u in re.findall(r'https://images\.teamgroupinc\.com/[^\s\"<>]+\.pdf',doc) if u in teampdfs]
  cached=(shared,exactrows,pdfs);teamcache[url]=cached
 shared,exactrows,pdfs=cached;sharedmap={x['label']:x['value'] for x in shared};sm=json.loads(meta.read_text());src=source(rec['source'],'TEAMGROUP — tableau officiel des références');family_source=source(sm,'TEAMGROUP — caractéristiques communes de la famille et tableau par référence');exact=exactrows.get(mpn,[])
 if not exact:continue
 d={r['label']:r['value'] for r in exact};p={'manufacturerPartNumber':mpn};family='';colors=set()
 for word,color in [('BLACK','black'),('WHITE','white'),('RED','red'),('GRAY','gray'),('SILVER','silver'),('BLUE','blue'),('GOLD','gold'),('PINK','pink')]:
  if re.search(r'\b'+word+r'\b',rec['section']):colors.add(color)
 if rec['category']=='ram':
  cap,sticks=parsecap(rec['capacity']);ddr=re.search(r'DDR[45]',rec['moduleType'])
  if not cap or not ddr:continue
  p.update(capacityGB=cap,memorySticks=sticks,memoryType=ddr[0],memorySpeedMTs=int(numeric(rec['frequency'])),casLatency=int(numeric(rec['latency'])),memoryVoltageV=numeric(rec['voltage']))
  family=re.sub(r'\s+DDR[45].*','',rec['moduleType']).strip()
  if 'DESKTOP' in rec['moduleType']:p['memoryModuleFormat']='DIMM'
  elif 'LAPTOP' in rec['moduleType']:p['memoryModuleFormat']='SO-DIMM';p['memoryModuleKind']='SO-DIMM'
  # Published family URL identifies the manufacturer's module technology, not voltage or capacity.
  if '/u-dimm/' in rec['imageURL']:p['memoryModuleKind']='UDIMM';p['memoryRegistered']=False
  if '/cu-dimm/' in rec['imageURL']:p['memoryModuleKind']='CUDIMM';p['memoryRegistered']=False
  profile=sharedmap.get('Profile','')
  if 'EXPO' in profile or 'XMP' in profile:p['memoryProfile']='EXPO/XMP' if 'EXPO' in profile and 'XMP' in profile else 'EXPO' if 'EXPO' in profile else 'XMP'
  if re.search(r'heatsink|heat spreader',sharedmap.get('Heat Sink',''),re.I):p['memoryHeatspreader']=True
  if 'RGB' in family:p['rgb']=True
 else:
  cap=re.fullmatch(r'(\d+(?:\.\d+)?)\s*(GB|TB)',rec['capacity'],re.I)
  if not cap:continue
  p['capacityGB']=int(float(cap[1])*(1000 if cap[2].upper()=='TB' else 1));family=re.split(r'\s+(?:M\.2|2\.5|SATA|PCIe|USB)',rec['section'])[0].strip()
  if 'M.2' in rec['section'] and 'NVMe' in sharedmap.get('Interface',''):p['storageInterface']='M.2 NVMe'
 dimensions=sharedmap.get('Dimensions','')
 vals={k:float(v) for v,k in re.findall(r'(\d+(?:\.\d+)?)\s*\(([LWH])\)',dimensions)}
 if len(vals)==3 and len(re.findall(r'\bmm\b',dimensions))==1 and len(dimensions)<90:
  p.update(lengthMm=vals['L'],heightMm=vals['H']);p['thicknessMm' if rec['category']=='ram' else 'widthMm']=vals['W']
 proof=fields(p,src)
 for k in ['heightMm','lengthMm','widthMm','thicknessMm','memoryModuleKind','memoryRegistered','memoryProfile','memoryHeatspreader','storageInterface']:
  if k in p:proof[k]={'value':p[k],'sourceURL':family_source['url'],'checkedAt':family_source['checkedAt']}
 if rec['category']=='storage':
  for label,key in [('Sequential Read','read'),('Sequential Write','write'),('Terabyte Written','endurance'),('DRAM Cache','dramCache')]:
   if d.get(label):proof[key]={'value':d[label],'sourceURL':family_source['url'],'checkedAt':family_source['checkedAt']}
  if sharedmap.get('Warranty'):proof['warranty']={'value':sharedmap['Warranty'],'sourceURL':family_source['url'],'checkedAt':family_source['checkedAt']}
  if sharedmap.get('Interface'):proof['interfaceGeneration']={'value':sharedmap['Interface'],'sourceURL':family_source['url'],'checkedAt':family_source['checkedAt']}
  if 'M.2' in rec['section'] and p.get('lengthMm') in [30,42,60,80,110] and p.get('widthMm')==22:proof['formFactor']={'value':'M.2 22'+str(int(p['lengthMm'])),'sourceURL':family_source['url'],'checkedAt':family_source['checkedAt']}
 extra_sources=[]
 if rec['category']=='ram':
  for pdf in pdfs:
   module=re.search(r'Module Type\s+([^\n]+)',pdf['text']);ft=re.sub(r'\s+',' ',pdf['text'])
   if not module or p['memoryType'] not in module[1]:continue
   ps=source(pdf,'TEAMGROUP — fiche technique de la famille et type de module');updates={}
   if re.search(r'Non-ECC',module[1],re.I):updates['memoryEcc']=False
   if re.search(r'Unbuffered',module[1],re.I):updates['memoryRegistered']=False;updates['memoryModuleKind']='CUDIMM' if re.search(r'CUDIMM|Clocked|clock driver|\bCKD\b',ft,re.I) else 'SO-DIMM' if re.search(r'SO-DIMM|SODIMM',module[1],re.I) else 'UDIMM';updates['memoryModuleFormat']='SO-DIMM' if updates['memoryModuleKind']=='SO-DIMM' else 'DIMM'
   if re.search(r'Heat Sink\s+Aluminum heat[ -]spread',ft,re.I):updates['memoryHeatspreader']=True
   for k,v in updates.items():p[k]=v;proof[k]={'value':v,'sourceURL':ps['url'],'checkedAt':ps['checkedAt']}
   if updates:extra_sources.append(ps);shared=shared+[{'label':'Type exact de module (fiche technique)','value':module[1].strip()}]
 # Do not use a representative photo as an exact capacity image; it is retained as family visual reference only.
 team.append({'mpn':mpn,'brand':'TeamGroup','category':rec['category'],'family':family,'patch':p,'colors':sorted(colors),'sources':[src,family_source]+extra_sources,'rows':exact+shared,'fieldEvidence':proof,'images':[],'familyImage':rec['imageURL'],'url':url})
# Kingston PDFs are exact MPN sources. Heading and tested timing sentence both must agree.
kingston=[]
kingstondocuments=[json.loads(p.read_text()) for p in sorted(OUT.glob('kingston-exa-*.json'))]
kingstonpublished={r['mpn']:r for r in json.loads((OUT/'kingston-catalog.json').read_text())}
for native in json.loads((OUT/'kingston-datasheets.json').read_text()):
 if not native.get('error'):kingstondocuments.append({'checkedAt':native['checkedAt'],'native':True,'response':{'content':[{'text':'# '+native['mpn']+'\nURL: '+native['url']+'\n'+native['text']}]}})
for doc in kingstondocuments:
 alltext='\n'.join(x.get('text','') for x in doc['response']['content'])
 chunks=re.split(r'(?=^# [^\n]+\nURL: https://www.kingston.com/)',alltext,flags=re.M)
 for t in chunks:
  u=re.search(r'^URL: (https://www.kingston.com/datasheets/[^\s]+)',t,re.M)
  if not u:continue
  mpn=u[1].split('/')[-1][:-4].replace('_','/');flat=re.sub(r'\s+',' ',t).replace('**','');left=' '.join(re.split(r' {3,}',l.strip())[0] for l in t.splitlines()) if doc.get('native') else flat;tested=re.search(r'tested to run at (DDR[45])-(\d+) at a low latency timing of ([\d-]+) at ([\d.]+)V',left)
  if mpn not in flat or not tested:continue
  cap=re.search(r'Total kit capacity is (\d+)GB',left);single=re.search(re.escape(mpn)+r' is a .{0,70}?\((\d+)GB\)',left);kit=re.search(r'kit of (two|four|eight)',left)
  if not (cap or single):continue
  p={'manufacturerPartNumber':mpn,'memoryType':tested[1],'capacityGB':int((cap or single)[1]),'memorySticks':{'two':2,'four':4,'eight':8}.get(kit[1],1) if kit else 1,'memorySpeedMTs':int(tested[2]),'casLatency':int(tested[3].split('-')[0]),'memoryVoltageV':float(tested[4]),'memoryModuleFormat':'DIMM','memoryModuleKind':'UDIMM','memoryRegistered':False}
  if re.search(r'x 64[- ]bit',flat,re.I):p['memoryEcc']=False
  if 'EXPO' in flat or 'XMP' in flat:p['memoryProfile']='EXPO/XMP' if 'EXPO' in flat and 'XMP' in flat else 'EXPO' if 'EXPO' in flat else 'XMP'
  height=re.search(r'Height.{0,15}?\(([\d.]+)mm\)',flat)
  if height:p['heightMm']=float(height[1])
  if 'w/heatsink' in flat:p['memoryHeatspreader']=True
  rank=re.search(r'\b([1248])Rx(4|8|16)\b',flat)
  if rank:p['memoryRankCount']=int(rank[1]);p['memoryDeviceWidthBits']=int(rank[2])
  if re.search(r'\b133\.35\s*mm\b',flat):p['lengthMm']=133.35
  src={'name':'Kingston — PDF technique de la référence exacte','url':u[1],'checkedAt':doc['checkedAt'],'kind':'manufacturer'}
  rr=[{'label':'Référence fabricant','value':mpn},{'label':'Capacité et composition','value':f"{p['capacityGB']} Go · {p['memorySticks']} module(s)"},{'label':'Débit et timings testés','value':f'{tested[1]}-{tested[2]} · {tested[3]} · {tested[4]} V'},{'label':'Format et correction système','value':'UDIMM, 288 broches, non enregistrée, bus x64 non-ECC système'},{'label':'Profils mémoire','value':p.get('memoryProfile','Non publié')}]
  if rank:rr.append({'label':'Organisation par module','value':rank[0]})
  if height:rr.append({'label':'Hauteur avec dissipateur','value':height[1]+' mm'})
  factory=re.search(r'FACTORY TIMING PARAMETERS(.*?)(?:Power Supply|Document No)',flat)
  if factory:rr.append({'label':'Profils JEDEC et overclocking publiés','value':factory[1].strip(' •#')})
  published=kingstonpublished.get(mpn,{})
  if published.get('family','').endswith(' Pro'):continue
  attrs=published.get('attributes',{});color=attrs.get('Color','').lower()
  kingston.append({'mpn':mpn,'brand':'Kingston','category':'ram','family':published.get('family',''),'colors':[color] if color else [],'patch':p,'sources':[src],'rows':rr,'fieldEvidence':fields(p,src),'images':published.get('images',[]),'url':u[1]})
# Corsair's JSON contains independent tech_specs for each literal variant SKU.
corsair=[]
dimdoc=json.loads((OUT/'corsair-dimensions.json').read_text());dimtext='\n'.join(x.get('text','') for x in dimdoc['response']['content']);dims={}
for ddr,table in re.findall(r'## (DDR[45]) Memory Module Dimensions:(.*?)(?=\n##|\Z)',dimtext,re.S):
 for name,prefix,l,w,h in re.findall(r'\| ([^|]+) \| ([A-Z]+) \| ([\d.]+)mm \| ([\d.]+)mm \| ([\d.]+)mm \|',table):
  if 'Without' not in name:dims[(ddr,prefix)]=(float(l),float(w),float(h))
dimsrc={'name':'Corsair — dimensions officielles par série et génération','url':'https://help.corsair.com/hc/en-us/articles/34381966388881-RAM-Memory-Module-Dimensions','checkedAt':dimdoc['checkedAt'],'kind':'manufacturer'}
for rec in json.loads((OUT/'corsair-catalog.json').read_text())['records']:
 d={r['label']:r['value'] for r in rec['rows']};mpn=rec['mpn'];ddr=d.get('Memory Type');cap,sticks=parsecap(d.get('Memory Size',''));speed=numeric(d.get('Tested Speed',''));cas=numeric(d.get('Tested Latency',''));volt=numeric(d.get('Tested Voltage',''))
 if ddr not in ['DDR4','DDR5'] or not all([cap,sticks,speed,cas,volt]):continue
 p={'manufacturerPartNumber':mpn,'capacityGB':cap,'memorySticks':sticks,'memoryType':ddr,'memorySpeedMTs':int(speed),'casLatency':int(cas),'memoryVoltageV':volt};family=re.split(r'\s+\d+(?:GB|TB)',rec['name'])[0].replace('®','').replace('™','').strip();colors=set()
 family=re.sub(r'\s+DDR[45]$','',family)
 col=d.get('Memory Color','').upper()
 for a,b in [('BLACK','black'),('WHITE','white'),('GREY','gray'),('GRAY','gray'),('RED','red'),('BLUE','blue'),('SILVER','silver'),('GOLD','gold')]:
  if re.search(r'\b'+a+r'\b',col):colors.add(b)
 if 'LED' in family:
  lighting=d.get('Lighting','').lower()
  if lighting in ['white','red','blue']:colors.add(lighting)
 kind=d.get('Package Memory Format','').upper()
 if kind in ['UDIMM','RDIMM','CUDIMM']:p.update(memoryModuleKind=kind,memoryModuleFormat='DIMM',memoryRegistered=kind=='RDIMM')
 elif kind in ['SODIMM','SO-DIMM']:p.update(memoryModuleKind='SO-DIMM',memoryModuleFormat='SO-DIMM',memoryRegistered=False)
 profile=d.get('Performance Profile','')
 if 'EXPO' in profile or 'XMP' in profile:p['memoryProfile']='EXPO/XMP' if 'EXPO' in profile and 'XMP' in profile else 'EXPO' if 'EXPO' in profile else 'XMP'
 if d.get('Heat Spreader','').lower() in ['aluminum','aluminium','anodized aluminum']:p['memoryHeatspreader']=True
 if 'RGB' in family:p['rgb']=True
 elif 'VENGEANCE' in family or 'LPX' in family:p['rgb']=False
 src=source(rec['source'],'Corsair — tableau technique du SKU dans le sélecteur officiel');proof=fields(p,src);sources=[src];rows=copy.deepcopy(rec['rows']);dimension=dims.get((ddr,mpn[:3]))
 if dimension:
  for k,v in zip(['lengthMm','thicknessMm','heightMm'],dimension):p[k]=v;proof[k]={'value':v,'sourceURL':dimsrc['url'],'checkedAt':dimsrc['checkedAt']}
  sources.append(dimsrc);rows.append({'label':'Dimensions module (L × épaisseur × hauteur)','value':' × '.join(f'{v:g}' for v in dimension)+' mm'+(' (barre supérieure d’origine)' if mpn.startswith('CMP') else '')})
 corsair.append({'mpn':mpn,'brand':'Corsair','category':'ram','family':family,'patch':p,'colors':sorted(colors),'sources':sources,'rows':rows,'fieldEvidence':proof,'images':rec['images'],'url':rec['url']})

silicon=[];spcache={}
for rec in json.loads((OUT/'siliconpower-catalog.json').read_text()):
 d=rec['row'];title=rec['title'];url=rec['source']['url'];mpn=rec['mpn'];doc=spcache.get(url)
 if doc is None:doc=gzip.decompress((ROOT/rec['source']['file']).read_bytes()).decode();spcache[url]=doc
 shared=[]
 for table in re.findall(r'<table\b[^>]*>(.*?)</table>',doc,re.S):
  if 'P/N' in table:continue
  for tr in re.findall(r'<tr\b[^>]*>(.*?)</tr>',table,re.S):
   cells=[clean(x) for x in re.findall(r'<t[dh]\b[^>]*>(.*?)</t[dh]>',tr,re.S)]
   if len(cells)==2 and len(cells[0])<60 and len(cells[1])<500:shared.append({'label':cells[0],'value':cells[1]})
 sm={r['label']:r['value'] for r in shared};p={'manufacturerPartNumber':mpn};ddr=re.search(r'DDR[45]',title);colors=set();family='';category=''
 if ddr and 'Timing' in d:
  capacity=d.get('Capacity','');m=re.fullmatch(r'(\d+)GB(?:[x×](\d+))?',capacity)
  if not m:continue
  sticks=int(m[2] or 1);p.update(capacityGB=int(m[1])*sticks,memorySticks=sticks,memoryType=ddr[0],memorySpeedMTs=int(numeric(d['Speed'])),casLatency=int(numeric(d['Timing'])),memoryVoltageV=numeric(d['Voltage']))
  kind=re.search(r'\b(CUDIMM|UDIMM|SODIMM|RDIMM)\b',title)
  if kind:p.update(memoryModuleKind='SO-DIMM' if kind[0]=='SODIMM' else kind[0],memoryModuleFormat='SO-DIMM' if kind[0]=='SODIMM' else 'DIMM',memoryRegistered=kind[0]=='RDIMM')
  family=re.sub(r'-Silicon Power$','',title);family=re.sub(r'\b(?:DDR[45]|UDIMM|CUDIMM|SODIMM|RDIMM)\b','',family);family=re.sub(r'\s+',' ',family).strip();category='ram'
  color=d.get('Color','').lower();colors={color} if color in ['black','white','red','gray','silver','blue'] else {'gray'} if color=='grey' else set()
  if 'RGB' in family:p['rgb']=True
  profile=sm.get('Intel XMP','')+' '+sm.get('AMD EXPO','')+' '+sm.get('Overclocking','')
  if 'EXPO' in profile or 'XMP' in profile:p['memoryProfile']='EXPO/XMP' if 'EXPO' in profile and 'XMP' in profile else 'EXPO' if 'EXPO' in profile else 'XMP'
 else:
  if not re.search(r'NVMe|PCIe',title,re.I):continue
  m=re.fullmatch(r'(\d+(?:\.\d+)?)(GB|TB)',d.get('Capacity',''))
  if not m:continue
  p.update(capacityGB=int(float(m[1])*(1000 if m[2]=='TB' else 1)),storageInterface='M.2 NVMe');category='storage';family=re.sub('^SP ','',title).split(' ')[0]
  if 'with Heatsink' in title:family+=' w/Heatsink';p['storageHeatsink']=True
 # Dimensions are factory dimensions of the module, not a shipping box; normalize desktop DIMM axes by their non-overlapping sizes.
 dims=re.findall(r'\d+(?:\.\d+)?',sm.get('Dimensions',''))
 if len(dims)==3 and 'mm' in sm.get('Dimensions',''):
  a=list(map(float,dims))
  if category=='ram' and 120<=max(a)<=145 and 20<=sorted(a)[1]<=65 and min(a)<=15:p.update(lengthMm=max(a),heightMm=sorted(a)[1],thicknessMm=min(a))
  if category=='storage' and 20<=max(a)<=110 and 20<=sorted(a)[1]<=40 and min(a)<20:p.update(lengthMm=max(a),widthMm=sorted(a)[1],heightMm=min(a))
 src=source(rec['source'],'Silicon Power — tableau MPN et spécifications officielles');proof=fields(p,src);rows=[{'label':k,'value':v} for k,v in d.items() if k!='⇅ Compare']+shared
 form=re.search(r'\bM\.2 (\d{4})\b',title)
 if category=='storage':
  for label,key in [('Performance Read','read'),('Performance Write','write')]:
   if d.get(label):proof[key]={'value':d[label],'sourceURL':src['url'],'checkedAt':src['checkedAt']}
  if sm.get('Warranty'):proof['warranty']={'value':sm['Warranty'],'sourceURL':src['url'],'checkedAt':src['checkedAt']}
  if form:proof['formFactor']={'value':'M.2 '+form[1],'sourceURL':src['url'],'checkedAt':src['checkedAt']}
  gen=re.search(r'PCIe (\d\.\d) x(\d)',title)
  if gen:proof['interfaceGeneration']={'value':f'PCIe {gen[1]} ×{gen[2]}','sourceURL':src['url'],'checkedAt':src['checkedAt']}
 silicon.append({'mpn':mpn,'brand':'Silicon Power','category':category,'family':family,'patch':p,'colors':sorted(colors),'sources':[src],'rows':rows,'fieldEvidence':proof,'images':[],'url':url,'formFactor':('M.2 '+form[1]) if form else None})

patriot=[];pd={d['url']:d for d in json.loads((OUT/'patriot-datasheets.json').read_text()) if d.get('text')};pseen=set()
for rec in json.loads((OUT/'patriot-catalog.json').read_text()):
 row=rec['row'];mpn=rec['mpn'];url=(row.get('file') or {}).get('url') or row.get('externalUrl');doc=pd.get(url)
 if not doc or mpn in pseen or mpn not in doc['text'].replace(' ',''):continue
 text=unicodedata.normalize('NFKC',doc['text']);flat=re.sub(r'\s+',' ',text);head=text[:text.find('PRODUCT INFORMATION')] if 'PRODUCT INFORMATION' in text else text[:600];first=re.sub(r'\s+',' ',head[:600]);ddr=re.search(r'\bDDR[45]\b',first)
 if not ddr:continue
 capacity=re.search(r'Capacity:\s*(\d+)\s*GB\s*\(\s*(\d+)\s*[xX×]\s*(\d+)\s*GB\)',flat)
 if not capacity:continue
 speed=re.search(r'Tested Frequency[^:]{0,40}:\s*(?:PC[45]-\d+\s*\()?\s*(\d{4,5})\s*(?:MHz|MT/s)',flat,re.I);timing=re.search(r'Tested Timings[^:]{0,20}:\s*([\d-]+)',flat);voltage=re.search(r'Tested Voltage[^:]{0,40}:\s*([\d.]+)\s*V',flat,re.I)
 if not all([speed,timing,voltage]):continue
 family=None
 for pattern,name in [(r'Viper\s+Elite\s*5\s+RGB.*TUF','Viper Elite 5 RGB TUF GAMING ALLIANCE'),(r'Viper\s+4\s+Blackout','Viper 4 Blackout'),(r'Viper\s+Elite\s*II','Viper Elite II'),(r'Viper\s+Elite\s*5','Viper Elite 5'),(r'Viper\s+Venom','Viper Venom'),(r'Viper\s+Steel','Viper Steel'),(r'Viper\s+Elite','Viper Elite'),(r'Viper\s+LED','Viper LED')]:
  if re.search(pattern,first,re.I):family=name;break
 if not family:continue
 if family=='Viper Elite 5' and re.search(r'Elite\s*5\s*Ultra',first,re.I):family+=' Ultra'
 # RGB identity comes from the SKU-specific PDF heading, not its part-number encoding.
 titlepart=re.split(r'Patriot[’\']?s|Patriot Memory|Patriot’s',first)[0]
 if re.search(r'\bRGB\b',titlepart,re.I) and 'RGB' not in family:family+=' RGB'
 p={'manufacturerPartNumber':mpn,'memoryType':ddr[0],'capacityGB':int(capacity[1]),'memorySticks':int(capacity[2]),'memorySpeedMTs':int(speed[1]),'casLatency':int(timing[1].split('-')[0]),'memoryVoltageV':float(voltage[1])}
 assert int(capacity[1])==int(capacity[2])*int(capacity[3]),mpn
 if re.search(r'NON-ECC\s+Unbuffered DIMM',flat,re.I):p.update(memoryEcc=False,memoryRegistered=False,memoryModuleKind='UDIMM',memoryModuleFormat='DIMM')
 elif row.get('grouping')=='UDIMM':p.update(memoryRegistered=False,memoryModuleKind='UDIMM',memoryModuleFormat='DIMM')
 if 'XMP' in flat or 'EXPO' in flat:p['memoryProfile']='EXPO/XMP' if 'XMP' in flat and 'EXPO' in flat else 'XMP' if 'XMP' in flat else 'EXPO'
 if re.search(r'Aluminum heat (?:spreader|shield)|aluminum heatshield',flat,re.I):p['memoryHeatspreader']=True
 p['rgb']='RGB' in family
 edition=re.search(r'Edition:\s*([^\n]+)',text);editiontext=edition[1] if edition else ''
 colors=[x.lower().replace('grey','gray') for x in re.findall(r'Black|White|Red|Blue|Grey|Gray|Silver|Gold',editiontext,re.I)];colors=list(dict.fromkeys(colors));primary=colors[0] if colors else None
 dimensions=re.search(r'(\d+(?:\.\d+)?)\s*cm\s*\(L\)\s*x\s*(\d+(?:\.\d+)?)\s*cm\s*\(W\)\s*x\s*(\d+(?:\.\d+)?)\s*cm\s*\(H\)',flat,re.I)
 if dimensions:
  a,b,h=[round(float(x)*10,3) for x in dimensions.groups()]
  if min(a,b)<15 and 120<max(a,b)<145 and 20<h<70:p.update(lengthMm=max(a,b),thicknessMm=min(a,b),heightMm=h)
 src=source(doc,'Patriot — fiche technique individuelle du SKU');catalogsource=source(rec['source'],'Patriot — association officielle du SKU à sa fiche technique')
 rr=[{'label':'Référence fabricant','value':mpn},{'label':'Capacité du kit','value':f'{capacity[1]} Go ({capacity[2]} × {capacity[3]} Go)'},{'label':'Débit et timings testés','value':f'{ddr[0]}-{speed[1]} · {timing[1]} · {voltage[1]} V'},{'label':'Profils mémoire','value':p.get('memoryProfile','Non publié')},{'label':'Finition fabricant','value':editiontext.strip()},*([{'label':'Garantie','value':'Limitée à vie'}] if re.search(r'(?:limited )?lifetime warranty',flat,re.I) else [])]
 if dimensions and 'heightMm' in p:rr.append({'label':'Dimensions du module (L × épaisseur × hauteur)','value':f"{p['lengthMm']} × {p['thicknessMm']} × {p['heightMm']} mm"})
 patriot.append({'mpn':mpn,'brand':'Patriot','category':'ram','family':family,'patch':p,'colors':[primary] if primary else [],'primaryColor':primary,'allowedColors':colors,'sources':[src,catalogsource],'rows':rr,'fieldEvidence':fields(p,src),'images':[],'url':url});pseen.add(mpn)

# Patriot SSD specification files carry the exact capacity and SKU on page one.
for rec in json.loads((OUT/'patriot-catalog.json').read_text()):
 row=rec['row'];mpn=rec['mpn'];url=(row.get('file') or {}).get('url') or row.get('externalUrl');doc=pd.get(url)
 if not doc or mpn in pseen or mpn not in doc['text'].replace(' ',''):continue
 text=unicodedata.normalize('NFKC',doc['text']);flat=re.sub(r'\s+',' ',text)
 if not re.search(r'NVMe',flat,re.I) or not re.search(r'M\.?2',flat,re.I):continue
 cap=re.search(r'^(\d+(?:\.\d+)?)\s*(TB|GB)$',row.get('capacity') or '',re.I)
 if not cap:continue
 capacity=int(float(cap[1])*(1000 if cap[2].upper()=='TB' else 1));family=None
 for token in ['VP4300 Lite','VP4300','PV553','P400 Lite','P400','VP4100']:
  if re.search(r'\b'+re.escape(token)+r'\b',flat,re.I):family=token;break
 if not family:continue
 form=re.search(r'\b(2230|2242|2280)\b',flat);gen=re.search(r'PCIe(?:®)?\s*(?:Gen\s*)?([345])(?:\.0)?\s*[xX×]\s*([124])',flat,re.I)
 if not form or not gen:continue
 p={'manufacturerPartNumber':mpn,'capacityGB':capacity,'storageInterface':'M.2 NVMe'}
 dim=re.search(r'(\d+(?:\.\d+)?)\s*cm\s*\(L\)\s*x\s*(\d+(?:\.\d+)?)\s*cm\s*\(W\)\s*x\s*(\d+(?:\.\d+)?)\s*cm\s*\(H\)',flat,re.I)
 if dim:
  l,w,h=[round(float(x)*10,3) for x in dim.groups()]
  if 20<l<100 and 15<w<40 and h<40:p.update(lengthMm=l,widthMm=w,heightMm=h)
 if re.search(r'graphene heatshield|aluminum heatshield|aluminum heat sink|heat sink|heatsink',flat,re.I):p['storageHeatsink']=True
 read=re.search(r'Sequential Read[^:]{0,20}:\s*(?:up to\s*)?([\d,]+)\s*MB/s',flat,re.I);write=re.search(r'Sequential Write[^:]{0,20}:\s*(?:up to\s*)?([\d,]+)\s*MB/s',flat,re.I);tbw=re.search(r'\bTBW:\s*([\d,]+)\s*TB',flat,re.I);warranty=re.search(r'(\d)\s*Year Warranty',flat,re.I)
 src=source(doc,'Patriot — fiche technique individuelle du SSD');cs=source(rec['source'],'Patriot — tableau officiel des références');proof=fields(p,src)
 rr=[{'label':'Référence fabricant','value':mpn},{'label':'Capacité','value':f'{capacity} Go'},{'label':'Format M.2','value':'M.2 '+form[1]},{'label':'Interface et protocole','value':f'PCIe {gen[1]}.0 ×{gen[2]}, NVMe'}]
 for k,val in [('read',f"{int(read[1].replace(',',''))} Mo/s" if read else None),('write',f"{int(write[1].replace(',',''))} Mo/s" if write else None),('endurance',f"{int(tbw[1].replace(',',''))} TBW" if tbw else None),('warranty',warranty[1]+' ans limités' if warranty else None),('formFactor','M.2 '+form[1]),('interfaceGeneration',f'PCIe {gen[1]}.0 ×{gen[2]}')]:
  if val:proof[k]={'value':val,'sourceURL':src['url'],'checkedAt':src['checkedAt']};rr.append({'label':{'read':'Lecture séquentielle','write':'Écriture séquentielle','endurance':'Endurance TBW','warranty':'Garantie','formFactor':'Format M.2','interfaceGeneration':'Interface PCIe'}[k],'value':val})
 if 'heightMm' in p:rr.append({'label':'Dimensions du SSD (L × l × H)','value':f"{p['lengthMm']} × {p['widthMm']} × {p['heightMm']} mm"})
 patriot.append({'mpn':mpn,'brand':'Patriot','category':'storage','family':family,'patch':p,'sources':[src,cs],'rows':rr,'fieldEvidence':proof,'images':[],'url':url,'formFactor':'M.2 '+form[1]});pseen.add(mpn)

# ADATA tables have merged package cells. Common specifications are applied only
# to an already identified literal MPN; no kit/total capacity is inferred from the code.
adata=[];adocuments=[]
for path in sorted(OUT.glob('adata-exa-*.json')):
 payload=json.loads(path.read_text());alltext='\n'.join(x.get('text','') for x in payload['result']['content'])
 for t in re.split(r'(?=^# [^\n]+\nURL: )',alltext,flags=re.M):
  u=re.search(r'^URL: (\S+)',t,re.M)
  if not u:continue
  header=t[:t.find('Model Number')] if 'Model Number' in t else t[:2500];flat=re.sub(r'\s+',' ',header);ddr=re.search(r'\bDDR[45]\b',flat)
  if not ddr:continue
  mpns=sorted(set(re.findall(r'\bAX[45]U[A-Z0-9]+-[A-Z0-9]+\b',t)))
  dim=re.search(r'Dimensions\s*\(?L\s*x\s*W\s*x\s*H\)?\s*:?\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*mm',flat,re.I)
  p={'memoryType':ddr[0]}
  if re.search(r'U-DIMM|UDIMM',t,re.I):p.update(memoryModuleFormat='DIMM',memoryModuleKind='UDIMM',memoryRegistered=False)
  if re.search(r'heat ?sink|heat spreader|aluminum exterior',flat,re.I):p['memoryHeatspreader']=True
  xmp=bool(re.search(r'XMP\s*[23]',flat,re.I));expo=bool(re.search(r'AMD EXPO',flat,re.I))
  if xmp or expo:p['memoryProfile']='EXPO/XMP' if xmp and expo else 'XMP' if xmp else 'EXPO'
  if dim:
   a=list(map(float,dim.groups()))
   if 120<max(a)<145 and 20<sorted(a)[1]<70 and min(a)<15:p.update(lengthMm=max(a),heightMm=sorted(a)[1],thicknessMm=min(a))
  src={'name':'ADATA XPG — datasheet citant littéralement le MPN','url':u[1],'checkedAt':payload['checkedAt'],'kind':'manufacturer'}
  for mpn in mpns:
   patch=dict(p,manufacturerPartNumber=mpn);rr=[{'label':'Référence figurant dans le tableau fabricant','value':mpn}]
   line=next((line for line in t.splitlines() if mpn in line),'');rr.append({'label':'Ligne du tableau de références','value':line.strip(' |')})
   if dim:rr.append({'label':'Dimensions du module (L × hauteur × épaisseur)','value':f'{max(a)} × {sorted(a)[1]} × {min(a)} mm'})
   if p.get('memoryProfile'):rr.append({'label':'Profils mémoire','value':p['memoryProfile']})
   if re.search('Limited lifetime',flat,re.I):rr.append({'label':'Garantie','value':'Limitée à vie'})
   adata.append({'mpn':mpn,'brand':'ADATA','category':'ram','family':'','patch':patch,'colors':[],'sources':[src],'rows':rr,'fieldEvidence':fields(patch,src),'images':[],'url':u[1]})
  adocuments.append({'url':u[1],'checkedAt':payload['checkedAt'],'publishedMPNs':mpns,'kitExtraction':'Merged package cells retained as evidence; no automatic package decoding.'})
(OUT/'adata-index-audit.json').write_text(json.dumps(adocuments,ensure_ascii=False,indent=2)+'\n')

# Every lookup uses complete published variant attributes, never a synthetic part number.
indexes={'G.Skill':gskill,'TeamGroup':team,'Kingston':kingston+json.loads((OUT/'kingston-legacy-index.json').read_text())+json.loads((OUT/'kingston-ssd-catalog.json').read_text()),'Corsair':corsair+json.loads((OUT/'corsair-ssd-catalog.json').read_text()),'Samsung':json.loads((OUT/'samsung-ssd-catalog.json').read_text()),'Silicon Power':silicon,'Patriot':patriot,'ADATA':adata+json.loads((OUT/'adata-memory-catalog.json').read_text())+json.loads((OUT/'adata-storage-catalog.json').read_text()),'Crucial':json.loads((OUT/'crucial-ssd-catalog.json').read_text())+json.loads((OUT/'crucial-memory-catalog.json').read_text())}
identityConflictCodes={x['mpn'] for x in json.loads((OUT/'adata-memory-extraction-audit.json').read_text())['conflicts'] if x['field'] in ['capacityGB','memorySticks','memoryType','memorySpeedMTs','casLatency']}
indexes['ADATA']=[r for r in indexes['ADATA'] if r['mpn'] not in identityConflictCodes]
(OUT/'published-identity-index.json').write_text(json.dumps({brand:[{k:r.get(k) for k in ['mpn','brand','category','family','colors','patch','url','formFactor']} for r in records] for brand,records in indexes.items()},ensure_ascii=False,separators=(',',':'))+'\n')
finishfacts=json.loads((OUT/'retailer-identity-facts.json').read_text())['records']
finishAudit=[]
for brand,records in indexes.items():
 for rec in records:
  if rec.get('colors') or rec.get('category')=='storage':continue
  matches=[x for x in finishfacts.get(rec['mpn'].upper(),[]) if (not x['capacityGB'] or x['capacityGB']==rec['patch'].get('capacityGB')) and (not x['memorySticks'] or x['memorySticks']==rec['patch'].get('memorySticks'))]
  editions={tuple(x['colors']) for x in matches}
  if len(editions)!=1:continue
  proof=matches[0];rec['colors']=list(next(iter(editions)));rec['sources'].append(proof['source']);rec['rows'].append({'label':'Finition du MPN confirmée par le revendeur','value':proof['literalEvidence']});rec['fieldEvidence']['finish']={'value':', '.join(rec['colors']),'sourceURL':proof['source']['url'],'checkedAt':proof['source']['checkedAt']}
  finishAudit.append({'mpn':rec['mpn'],'colors':rec['colors'],'sourceURL':proof['source']['url'],'sha256':proof['sha256']})
(OUT/'retailer-finish-resolutions.json').write_text(json.dumps(finishAudit,ensure_ascii=False,indent=2)+'\n')
indexes=runpy.run_path(str(ROOT/'scripts/enrich-deep-memory-visual-finishes.py'))['enrich'](indexes)
products={};audit=[];quarantine=[];visuals={};counts=collections.Counter();modelAudits=[];modelIntersection=runpy.run_path(str(ROOT/'scripts/intersect-deep-memory-models.py'))['intersect']
for item in inputs:
 c=item['component'];id=c['id'];mpn=componentsku(c);old=item.get('verified');candidates=indexes.get(c['brand'],[]);matches=[];method=''
 if mpn:
  matches=[r for r in candidates if r['mpn'].upper()==mpn.upper()];method='existing_exact_mpn'
 elif c['brand'] in ['G.Skill','TeamGroup','Corsair','Kingston','Samsung','Silicon Power','Patriot','ADATA','Crucial']:
  fam=namedfamily(c)
  if c['brand']=='Patriot' and c['category']=='storage':fam=re.sub(r'^Viper(?: Gaming)?\s+','',fam,flags=re.I)
  if c['brand']=='Corsair' and c['category']=='storage' and fam=='MP600 Force Series Gen4':fam='MP600'
  if c['brand']=='TeamGroup':fam=re.sub(r'^T-(?:Force|Create)\s+','',fam,flags=re.I)
  col=archivecolors(c)
  for r in candidates:
   familycandidate=r['family']
   if c['brand']=='G.Skill' and fam=='Aegis' and familycandidate in ['Aegis DDR4','Aegis DDR5']:familycandidate='Aegis'
   if c['brand']=='Silicon Power':fam=re.sub(r'\bGaming\b','',fam);familycandidate=re.sub(r'\bGaming\b','',familycandidate)
   if norm(fam)!=norm(familycandidate) and not (c['brand']=='Crucial' and fam.upper()==r['mpn'].upper()):continue
   if c['category']=='ram' and memorykey(c)!=memorykey(r['patch']):continue
   if c['category']=='storage' and (r.get('category')!='storage' or c.get('capacityGB')!=r['patch'].get('capacityGB') or c.get('storageInterface')!=r['patch'].get('storageInterface')):continue
   if c['category']=='storage' and r.get('formFactor'):
    archivedformat=re.search(r'M\.2[ -]?(\d{4})',c.get('description','')+' '+' '.join(c.get('specs',[])))
    if archivedformat and r['formFactor']!='M.2 '+archivedformat[1]:continue
   # Unknown, broad or conflicting finish descriptions do not select an SKU.
   if c['category']=='ram':
    if c['brand']=='Patriot':
     if not col or r.get('primaryColor') not in col or not col.issubset(set(r.get('allowedColors',[]))):continue
    elif not col or (col!=set(r.get('colors',[])) and not any(col==set(f) for f in r.get('allowedArchiveFinishes',[]))):continue
   matches.append(r)
  method='unique_published_family_capacity_kit_rate_cas_finish'
 dedup={r['mpn']:r for r in matches}
 if c['brand']=='G.Skill' and len(dedup)>1:
  aliasgroups=collections.defaultdict(list)
  for r in matches:aliasgroups[(r['url'],re.sub(r'G[AX]([1248])-',r'GX\1-',r['mpn']))].append(r)
  if len(aliasgroups)==1:matches=[next(iter(aliasgroups.values()))[0]]
  else:matches=list(dedup.values())
 else:matches=list(dedup.values())
 entry={'id':id,'brand':c['brand'],'category':c['category'],'name':c['name'],'priorMPN':mpn,'candidateCount':len(matches),'candidateMPNs':sorted(dedup),'method':method,'status':'blocked','reason':''}
 if item.get('quarantine') and (len(matches)!=1 or matches[0]['mpn']==item['quarantine'].get('badMPN')):
  entry['reason']='Ancien rattachement en quarantaine ; aucune nouvelle référence exacte distincte établie.';entry['quarantine']=item['quarantine'];audit.append(entry);continue
 if len(matches)>1 and not mpn:
  model,modelAudit=modelIntersection(c,matches)
  if model:
   products[id]=model;modelAudits.append(modelAudit);entry.update(status='enriched_model',reason='Plusieurs références correspondent au modèle exact ; seule l’intersection de leurs preuves est intégrée.',candidateMPNs=modelAudit['candidateMPNs'],patchFields=sorted(model['patch']),sourceURLs=[s['url'] for s in model['sources']]);audit.append(entry);continue
 if len(matches)!=1:
  entry['reason']='Plusieurs références exactes partagent les attributs archivés : timings secondaires, profil ou révision non identifiés.' if matches else 'Aucune référence publiée correspondant simultanément à la famille, capacité, kit, débit, latence et finition dans l’index fabricant consulté.' if c['brand'] in indexes else 'Index fabricant de cette marque encore à collecter ; aucune identité déduite du nom commercial.'
  entry['indexRecordsExamined']=len(candidates);audit.append(entry);continue
 rec=matches[0]
 if c['brand']=='Corsair' and bool(re.search(r'\bRGB\b',namedfamily(c),re.I)) and not bool(re.search(r'\bRGB\b',rec.get('family',''),re.I)):
  q={'id':id,'badMPN':rec['mpn'],'reason':'La famille RGB archivée et la famille fabricant du MPN ne correspondent pas.','sourceURL':rec['url'],'manufacturerFamily':rec.get('family'),'archiveFamily':namedfamily(c)};quarantine.append(q);entry.update(reason=q['reason'],conflict=q);audit.append(entry);continue
 patch=copy.deepcopy(rec['patch']);v=copy.deepcopy(old) if old else {'mpn':rec['mpn'],'identityNote':'Référence publiée par le fabricant, identifiée uniquement par concordance de famille, capacité, composition, génération, débit, latence et finition.','sources':[],'groups':[],'patch':{},'offers':[],'notes':[]}
 # Existing verified identity also must retain kit/type/capacity. Any disagreement is quarantined for human-readable review.
 identityconflicts=[{'field':k,'catalog':c.get(k),'manufacturer':patch[k]} for k in ['capacityGB','memorySticks','memoryType','memorySpeedMTs','casLatency'] if k in patch and c.get(k) is not None and c[k]!=patch[k]]
 if id in ['ssd-kc3000-1','ssd-kc3000-2'] and rec['mpn'] in ['SKC3000S/1024G','SKC3000D/2048G']:
  identityconflicts=[x for x in identityconflicts if x['field']!='capacityGB']
  v['notes'].append('La capacité arrondie de la fiche manuelle est remplacée par la capacité nominale exacte du fabricant : '+str(patch['capacityGB'])+' Go, sans changement de référence.')
 if identityconflicts:
  q={'id':id,'badMPN':rec['mpn'],'reason':'Conflit entre caractéristiques d’identité archivées et référence fabricant.','conflicts':identityconflicts,'sourceUrls':[rec['url']]};quarantine.append(q);entry.update(reason=q['reason'],conflicts=identityconflicts);audit.append(entry);continue
 for componentkey,factkey in {'capacityGB':'capacity','memorySticks':'kit','memoryType':'generation','memorySpeedMTs':'rate','casLatency':'cas','memoryVoltageV':'voltage','memoryProfile':'profile','memoryModuleKind':'moduleType','memoryEcc':'hostEcc','heightMm':'height','memoryHeatspreader':'heatspreader','storageInterface':'interface','lengthMm':'length','widthMm':'width','storageHeatsink':'heatsink'}.items():
  if componentkey in rec['fieldEvidence']:rec['fieldEvidence'][factkey]=copy.deepcopy(rec['fieldEvidence'][componentkey])
 v['sources']=[s for s in v['sources'] if s['url'] not in {x['url'] for x in rec['sources']}]+rec['sources'];v['groups'].append({'title':'Fabricant — référence exacte et données techniques publiées','rows':rec['rows']});v['patch'].update(patch);v['fieldEvidence']={**v.get('fieldEvidence',{}),**rec['fieldEvidence']}
 if c['category']=='ram':
  v['patch']['description']=f"{c['brand']} {c['name']}. Référence {rec['mpn']}."+(f" {patch['capacityGB']} Go en {patch['memorySticks']} module(s), {patch['memoryType']}-{patch['memorySpeedMTs']}, CL{patch['casLatency']}, {patch['memoryVoltageV']:g} V au profil testé." if all(k in patch for k in ['capacityGB','memorySticks','memoryType','memorySpeedMTs','casLatency','memoryVoltageV']) else '')+(f" Hauteur documentée : {patch['heightMm']:g} mm." if 'heightMm' in patch else '')
 else:
  v['patch']['description']=f"{c['brand']} {c['name']}. Référence {rec['mpn']}. {patch['capacityGB']} Go, interface {patch.get('storageInterface','documentée dans la fiche')} comme publiée par le fabricant."+(f" Dimensions : {patch['lengthMm']:g} × {patch['widthMm']:g} × {patch['heightMm']:g} mm." if all(k in patch for k in ['lengthMm','widthMm','heightMm']) else '')
 products[id]=v;visuals[id]={'mpn':rec['mpn'],'images':rec['images'],'familyImage':rec.get('familyImage'),'sourceURLs':[s['url'] for s in rec['sources']]};entry.update(status='enriched',reason='Identité exacte établie ; seuls les champs publiés sont intégrés.',mpn=rec['mpn'],patchFields=sorted(patch),sourceURLs=[s['url'] for s in rec['sources']]);audit.append(entry);counts[c['brand']]+=1
samsung=json.loads((OUT/'samsung/products.json').read_text())
for id,v in samsung.items():
 products[id]=v
 for row in audit:
  if row['id']==id:row.update(status='enriched',reason='Référence OEM exacte documentée par CompuRAM ; provenance revendeur explicite.',mpn=v['mpn'],sourceURLs=[s['url'] for s in v['sources']]);break
 counts['Samsung']+=1
for id,mpn in [('import-ram-775ab8743ba9','CMK16GX4M1E3200C16'),('import-ram-123f0047b70e','CMK32GX4M2D3000C16'),('import-ram-14ed8e0de533','CMK16GX4M2D3000C16'),('import-ram-9ba0b80c9ac4','CMK128GX4M4D3600C18'),('import-ram-bb0182826228','CMK64GX4M4G4000C18')]:
 rec=next(r for r in corsair if r['mpn']==mpn)
 quarantine.append({'id':id,'badMPN':mpn,'reason':'La finition fabricant est BLACK ; l’archive Noir / Jaune ne dispose pas d’un alias d’identité démontré. Le SKU noir exact reste associé à son archive Noir.','sourceUrls':[rec['url']]})
products=runpy.run_path(str(ROOT/'scripts/enrich-deep-memory-retailer.py'))['enrich'](products,inputs,quarantine)
for id,v in products.items():
 c=byid[id]['component'];p=v['patch']
 if c['category']=='storage' and v.get('identityKind')!='manufacturer-model':
  v['patch']['description']=f"{c['brand']} {c['name']}. Référence {v['mpn']}. Capacité nominale : {p.get('capacityGB',c.get('capacityGB'))} Go."+(f" Dimensions documentées : {p['lengthMm']:g} × {p['widthMm']:g} × {p['heightMm']:g} mm." if all(k in p for k in ['lengthMm','widthMm','heightMm']) else '')
 if id not in {x['id'] for x in audit if x['status'] in ['enriched','enriched_model']}:
  for row in audit:
   if row['id']==id:row.update(status='enriched',mpn=v['mpn'],reason='Référence déjà établie, complétée par une fiche marchande du même MPN exact.');break
voltageConflicts=[x for x in json.loads((OUT/'adata-memory-extraction-audit.json').read_text())['conflicts']+json.loads((OUT/'crucial-memory-source-issues.json').read_text()) if x['field']=='memoryVoltageV']
voltageConflictCodes={x['mpn'] for x in voltageConflicts};voltageClearedIds=[]
for id,v in products.items():
 if v['mpn'] not in voltageConflictCodes:continue
 v['patch'].pop('memoryVoltageV',None);v.get('fieldEvidence',{}).pop('memoryVoltageV',None);v.get('fieldEvidence',{}).pop('voltage',None)
 v.setdefault('notes',[]).append('Des documents publiés donnent des tensions différentes pour cette référence exacte. Aucune tension unique n’est retenue avant clarification de la révision.');voltageClearedIds.append(id)
(OUT/'voltage-conflicts.json').write_text(json.dumps({'records':voltageConflicts,'clearedProductIds':voltageClearedIds},ensure_ascii=False,indent=2)+'\n')
counts=collections.Counter(byid[id]['component']['brand'] for id in products)
(OUT/'model-intersections.json').write_text(json.dumps(modelAudits,ensure_ascii=False,indent=2)+'\n')
(OUT/'quarantine.json').write_text(json.dumps(quarantine,ensure_ascii=False,indent=2)+'\n')
(OUT/'products.json').write_text(json.dumps(products,ensure_ascii=False,indent=2)+'\n')
(OUT/'audit.json').write_text(json.dumps({'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'total':len(inputs),'enriched':len(products),'byBrand':dict(counts),'manufacturerIndexCounts':{b:len(r) for b,r in indexes.items()},'records':audit},ensure_ascii=False,indent=2)+'\n')
(OUT/'visual-sources.json').write_text(json.dumps(visuals,ensure_ascii=False,indent=2)+'\n')
(ROOT/'src/data/deepMemoryStorageCatalog.ts').write_text("import type { VerifiedProduct } from './verifiedTypes';\n\n/** Exact manufacturer tables and individually checked retailer references. */\nexport const deepMemoryStorageProducts: Record<string, VerifiedProduct> = "+json.dumps(products,ensure_ascii=False,indent=2)+';\n\n// Explicitly clear any older runtime voltage while source revisions disagree.\nfor (const id of '+json.dumps(voltageClearedIds)+') deepMemoryStorageProducts[id].patch.memoryVoltageV = undefined;\nfor (const product of Object.values(deepMemoryStorageProducts)) if (product.identityKind === \'manufacturer-model\') product.patch.manufacturerPartNumber = undefined;\nconst modelVariableFields: Record<string, string[]> = '+json.dumps({m['id']:m['clearTypedFields'] for m in modelAudits})+';\nfor (const [id, keys] of Object.entries(modelVariableFields)) for (const key of keys) (deepMemoryStorageProducts[id].patch as Record<string, unknown>)[key] = undefined;\n')
print(json.dumps({'enriched':len(products),'byBrand':dict(counts),'blocked':len(inputs)-len(products)},ensure_ascii=False))
