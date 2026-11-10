"""Extract explicit primary GPU specification tables; verify complete variants.

Run after deep-gpu-catalog.py and deep-gpu-match.py. Source documents remain
immutable evidence; similarity and archive dimensions never prove a SKU alone.
"""
import json,gzip,pathlib,re,collections,html,urllib.parse,copy
from functools import lru_cache
from importlib.machinery import SourceFileLoader
H=SourceFileLoader('collector',str(pathlib.Path(__file__).with_name('deep-gpu-catalog.py'))).load_module();D=H.D
SECONDARY=SourceFileLoader('gpu_secondary',str(pathlib.Path(__file__).with_name('build-gpu-secondary.py'))).load_module()
INPUT=json.load(gzip.open(D/'input.json.gz','rt')); CAND={x['id']:x for x in json.load(open(D/'indexes/candidates.json'))}
FINISH_PROOFS={x['mpn']:x for x in json.load(open(D/'inspected-finish-proofs.json'))} if (D/'inspected-finish-proofs.json').exists() else {}
def clean(s):return re.sub(r'\s+',' ',str(s).replace('\u200d','')).strip()
def num(s,pat):
 m=re.search(pat,s,re.I);return float(m[1].replace(',','.')) if m else None
@lru_cache(maxsize=30000)
def words(s,cap=None,brand=None):
 s=clean(s).lower().replace('™','').replace('®','')
 s=re.sub(r'\b(?:msi|asus|asrock|zotac|gigabyte|xfx|pny|gainward|palit|inno3d|sapphire|sparkle|nvidia|intel|powercolor|acer|amd|geforce|radeon|graphics|video|card|model|gpu|edition)\b',' ',s)
 if brand in ['ASUS','XFX','Sapphire','Zotac']:s=re.sub(r'\bgaming\b',' ',s)
 if cap:s=re.sub(r'\b'+str(int(cap))+r'goc\b',' oc ',s)
 if cap:s=re.sub(r'\b(?:o|t)?'+str(int(cap))+r'\s*g(?:b|d\d+x?)?\b',lambda m:' memvariantd6x ' if m[0].endswith('d6x') else ' oc ' if m[0].startswith('o') else ' top ' if m[0].startswith('t') else ' ',s)
 s=re.sub(r'\b(?:gddr\d+x?)\b',' ',s);s=re.sub(r'\b((?:rtx|gtx|rx)\s*\d+(?:\s*(?:ti|super|xtx|xt|gre))?)\s+\1\b',r'\1',s); s=s.replace('overclocked','oc')
 s=re.sub(r'\bdlss\s*\d+\b',' ',s)
 if brand=='ASUS':
  s=re.sub(r'((?:rtx|gtx)\s*\d+)tis\b',r'\1 ti super',s);s=re.sub(r'((?:rtx|gtx)\s*\d+)s\b',r'\1 super',s)
 if brand=='Sapphire':s=re.sub(r'\bspecial\b','se',s)
 return sorted(re.findall(r'[a-z]+|\d+',s))
def expected(item):
 c=item['component'];o=item.get('original') or {};cap=o.get('memory',c.get('capacityGB'));name=o.get('name',c['name'].split(' · ')[0]);chip=o.get('chipset','')
 if not re.search(r'\b(?:RTX|GTX|GT|RX|R\d|HD|Arc)\s*\d+',name,re.I):name=chip+' '+name
 if c.get('finishName','').startswith('Blanc') and not re.search(r'white|snow|luna',name,re.I):name+=' WHITE'
 return words(name,cap,c['brand']),cap
LABELS={
'ASUS':['Model','Graphic Engine','AI Performance','Bus Standard','OpenGL','Video Memory','Engine Clock','CUDA Core','Stream Processors','Memory Speed','Memory Interface','Resolution','Interface','Maximum Display Support','NVlink/ Crossfire Support','Accessories','Software','Dimensions','Recommended PSU','Power Connectors','Slot','AURA SYNC','Note'],
'Gigabyte':['Graphics Processing','Core Clock','CUDA® Cores','Stream Processors','Memory Clock','Memory Size','Memory Type','Memory Bus','Memory Bandwidth (GB/sec)','Card Bus','Digital max resolution','Multi-view','Card size','PCB Form','DirectX','OpenGL','NVIDIA Encoder (NVENC)','Recommended PSU','Power Connectors','Output','SLI Support','Accessories'],
'Gainward':['Product Name','Barcode','GPU','GPU Clockspeed','Memory','Memory Clockspeed','Bandwidth','Bus','Cooling','Connectivity','Product Size','Power Connector','P/N'],
'Palit':['Memory Amount','Memory Interface','DRAM Type','Graphics Clock','Boost Clock','Memory Clock','CUDA Cores','Memory Bandwidth (GB/sec)','Microsoft DirectX','OpenGL','Bus Support','Dual-Link DVI','DisplayPort','HDMI','Maximum Digital Resolution','Height','Board Size','Graphics Card Power','Minimum Recommended System Power','Recommended System Power','Supplementary Power Connectors','Accessory','Product Code'],
'Sapphire':['GPU','Engine Clock','Stream Processors','Compute Units','Infinity Cache','Ray Accelerators','AI Accelerator','Memory Size/Bus','Memory Clock','Displays','Resolution','Interface','Output','BIOS Support','External Power','Sapphire Features','SAPPHIRE Features','AMD Features','Cooling','Cooler Type','Game Index','Form Factor','Power Consumption','OS','System Requirement'],
'Inno3D':['GPU Engine Specs','CUDA Cores','Boost Clock (MHz)','Base Clock (MHz)','THERMAL AND POWER SPEC','Minimum System Power Requirement (W)','Supplementary Power Connectors','Memory Specs','Memory Clock','Standard Memory Config','Memory Interface','Memory Interface Width','Memory Bandwidth (GB/sec)','Feature Support','NVIDIA Architecture','NVIDIA DLSS','NVIDIA G-SYNC®-Ready','Microsoft DirectX','OpenGL','Bus Support','Maximum Digital Resolution','Standard Display Connectors','Multi Monitor','HDCP','Card Dimensions','Length','Height','Width','Accessories']}
def labelled(t,keys,start=None,stop=None):
 if start:
  p=t.find(start)
  if p<0:return {}
  t=t[p:]
 if stop:
  m=re.search(stop,t)
  if m:t=t[:m.start()]
 lines=[clean(x) for x in t.splitlines() if clean(x)];out={};cur=None
 for l in lines:
  if l in keys:cur=l;out[cur]=[]
  elif cur:out[cur].append(l)
 return {k:clean(' '.join(v)) for k,v in out.items() if v}
def flat_msi(t):
 lines=[clean(x) for x in t.splitlines() if clean(x)];first='Marketing Name' if 'Marketing Name' in lines else 'Model Name'
 if first not in lines:return {}
 i=lines.index(first)
 try:j=lines.index(first,i+1)
 except ValueError:return {}
 return labelled('\n'.join(lines[j:]),lines[i:j],stop=r'\n(?:©|All images|This product’s packaging)')
def triples(s,brand):
 if brand=='Sapphire':s=re.sub(r'(?:Dimension\s*/\s*mm|\(mm\))','mm',s,flags=re.I)
 if brand=='Gigabyte':
  m=re.search(r'L\s*=\s*([\d.]+)\s*W\s*=\s*([\d.]+)\s*H\s*=\s*([\d.]+)\s*mm',s,re.I)
  return [float(x) for x in m.groups()] if m else None
 if brand=='Sapphire':
  m=re.search(r'([\d.]+)\s*\(L\)\s*[x×]\s*([\d.]+)\s*\(W\)\s*[x×]\s*([\d.]+)\s*\(H\)\s*mm',s,re.I)
  if m:return [float(x) for x in m.groups()]
 pattern=r'([\d.]+)\s*[x×*]\s*([\d.]+)\s*[x×*]\s*([\d.]+)\s*(mm|cm|Centimeter)?'
 ms=list(re.finditer(pattern,s,re.I));m=next((m for m in ms if m[4]),None)
 if not m and brand in ['MSI','XFX']:m=ms[0] if ms else None
 if not m:return None
 mul=10 if m[4] and m[4].lower() in ['cm','centimeter'] else 1
 return [round(float(m[i])*mul,3) for i in [1,2,3]]
def parse(s):
 b=s['brand'];t=s.get('text','');u=s.get('url','');v={};model='';mpn='';p={};extra=[];notes=[]
 if s.get('status')!=200 or not t:return None
 if b=='MSI':
  v=flat_msi(t);model=v.get('Marketing Name',v.get('Model Name',''));mpn=v.get('Model Name','');cap=num(v.get('Memory',''),r'^(\d+)\s*GB');dims=triples(v.get('Card Dimension (mm)',''),b);power=num(v.get('Power consumption',''),r'^(\d+(?:\.\d+)?)\s*W$');psu=num(v.get('Recommended PSU',''),r'^(\d+)\s*W$')
 elif b=='ASUS':
  v=labelled(t,LABELS[b],start='Model\n',stop=r'\n(?:Disclaimer|Products certified|Need Help\?)');raw=v.get('Model','');mpn=raw.split(' ASUS estore')[0].split(' Save')[0].strip();model=mpn;cap=num(v.get('Video Memory',''),r'^(\d+)\s*GB');dims=triples(v.get('Dimensions','').split('Radiator')[0],b);power=None;psu=num(v.get('Recommended PSU',''),r'^(\d+)\s*W')
  v['Model']=mpn
  if len(mpn)>100:return None
 elif b=='Gigabyte':
  v=labelled(t,LABELS[b],start='Specifications\nGraphics Processing\n',stop=r'\n\* The terms HDMI');title=t.splitlines()[0];model=re.split(r'\s+(?:Graphics Card Specifications|Graphics Card|Specifications)\s*-',title)[0];model=re.sub(r'\s*\(Rev\.\s*[\d.]+\)','',model,flags=re.I).strip();m=re.search(r'\n(GV-[A-Za-z0-9 -]+)\n',t);mpn=m[1] if m else '';cap=num(v.get('Memory Size',''),r'^(\d+)\s*GB');dims=triples(v.get('Card size',''),b);power=None;psu=num(v.get('Recommended PSU',''),r'^(\d+)\s*W');rev=re.search(r'\(Rev\.\s*([\d.]+)\)',title,re.I)
  if rev:notes.append('Révision de PCB explicitement décrite par la source : '+rev[1]+'. Une archive sans révision n’est pas automatiquement identifiée à celle-ci.')
 elif b=='Gainward':
  v=labelled(t,LABELS[b],start='Product Name\n');model=v.get('Product Name','');mpn=v.get('P/N','').split()[0] if v.get('P/N') else '';v['P/N']=mpn;cap=num(v.get('Memory',''),r'^(\d+)\s*GB');dims=triples(v.get('Product Size',''),b);power=None;psu=None
 elif b=='Palit':
  if 'tab=sp' not in u:return None
  raw=gzip.open(H.ROOT/s['contentFile'],'rt',errors='replace').read();table=re.search(r'<table[^>]*class=\"sptable\"[^>]*>(.*?)</table>',raw,re.S);v={}
  if table:
   for tr in re.findall(r'<tr[^>]*>(.*?)</tr>',table[1],re.S):
    cells=re.findall(r'<td[^>]*>(.*?)</td>',tr,re.S)
    if len(cells)==2 and H.text(cells[0]) and H.text(cells[1]):v[clean(H.text(cells[0]))]=clean(H.text(cells[1]))
  model=t.splitlines()[0].replace('::Palit Products - ','').replace(' ::','').strip();m=re.search(r'(?:Product Code\s*:?\s*)([A-Z0-9-]{10,})',t);mpn=m[1] if m else urllib.parse.parse_qs(urllib.parse.urlparse(u).query).get('pn',[''])[0];cap=num(v.get('Memory Amount',''),r'^(\d+)\s*(?:GB|G)');cap=cap or (num(v.get('Memory Amount',''),r'^(\d+)\s*M') or 0)/1024;dims=triples(v.get('Board Size',''),b);power=num(v.get('Graphics Card Power',''),r'^(\d+(?:\.\d+)?)\s*W');psu=num(v.get('Minimum Recommended System Power',v.get('Recommended System Power','')),r'^(\d+)\s*W')
 elif b=='Acer':
  if 'store.acer.com' not in u:return None
  raw=gzip.open(H.ROOT/s['contentFile'],'rt',errors='replace').read();allvals={}
  for tr in re.findall(r'<tr[^>]*>(.*?)</tr>',raw,re.S):
   cells=re.findall(r'<(?:th|td)[^>]*>(.*?)</(?:th|td)>',tr,re.S)
   if len(cells)==2 and H.text(cells[0]) and H.text(cells[1]):allvals[clean(H.text(cells[0]))]=clean(H.text(cells[1]))
  mpn=allvals.get('Manufacturer Part Number','')
  if not re.fullmatch(r'DP\.[A-Z0-9]+\.[A-Z0-9]+',mpn):return None
  model=t.splitlines()[0].split('|')[0].strip();v={k:val for k,val in allvals.items() if len(val)<1000 and k not in ['Additional Information','General Product Safety','Warranty','Manufacturer Information','EU Responsible person/EU Importer']};cap=num(v.get('Standard Memory',''),r'^(\d+)\s*GB') or num(model,r'(\d+)\s*GB');dims=None;power=num(v.get('Total Power consumption (W)',''),r'^(\d+)$');psu=num(v.get('Suggested Power Supply (W)',''),r'^(\d+)$')
  fan=num(v.get('Thermal Fan',''),r'^(\d+)x')
  if fan:p['fanCount']=int(fan)
 elif b=='Sparkle':
  if s.get('documentFormat')!='pdf':return None
  m=re.search(r'Part Number:\s*([A-Z0-9-]+)',t)
  if not m:return None
  mpn=m[1];m=re.search(r'SPARKLE\s+Intel[^,\n]+(?:Edition)?',t)
  if not m:return None
  model=clean(m[0]);v={}
  for bullet in re.findall(r'[⚫•]\s*([^⚫•\n]+)',t):
   if ':' in bullet:
    k,val=bullet.split(':',1);v[clean(k)]=clean(val)
  cap=num(v.get('Memory Size',''),r'^(\d+)\s*GB');dims=triples(v.get('Dimension',''),b);power=num(v.get('TBP',''),r'^(\d+)\s*W');psu=num(t,r'(\d+)\s*Watt or greater power supply')
  ports=re.findall(r'[⚫•]\s*([^⚫•\n]*(?:HDMI|DisplayPort)[^⚫•\n]*)',t)
  if ports:v['Sorties vidéo']=clean(' ; '.join(ports))
  conn=re.search(r'[⚫•]\s*([^⚫•\n]*available [^⚫•\n]*Connector)',t,re.I)
  if conn:v['Connecteurs alimentation']=clean(conn[1])
  fans=re.search(r'([123])x\s*(\d+)mm\s*(?:Double-Ball Bearing|DBB)',t,re.I)
  if fans:p.update(fanCount=int(fans[1]),fanSizeMm=int(fans[2]));v['Ventilateurs']=fans[1]+' × '+fans[2]+' mm à double roulement à billes'
 elif b=='ASRock':
  raw=gzip.open(H.ROOT/s['contentFile'],'rt',errors='replace').read();v={clean(H.text(k)):clean(H.text(val)).lstrip('- ') for k,val in re.findall(r'<li><div class="SpecItem">(.*?)</div><div class="SpecData">(.*?)</div></li>',raw,re.S)};model=urllib.parse.unquote(u.split('/')[-2]);idx=json.load(open(D/'indexes/asrock-models.json'));ent=next((x for x in idx if H.norm(x[0])==H.norm(model)),None)
  if not ent:return None
  model=ent[0];mpn=ent[2];cap=num(v.get('Memory',''),r'\b(\d+)\s*GB\b');dims=triples(v.get('Dimensions',''),b);power=None;psu=num(v.get('Recommended PSU',''),r'^(\d+)\s*W')
 elif b=='PNY':
  if 'models' in u or 'quadro' in u:return None
  raw=gzip.open(H.ROOT/s['contentFile'],'rt',errors='replace').read();v={}
  for tr in re.findall(r'<tr[^>]*>(.*?)</tr>',raw,re.S):
   cells=re.findall(r'<(?:th|td)[^>]*>(.*?)</(?:th|td)>',tr,re.S)
   if len(cells)==2 and H.text(cells[0]) and H.text(cells[1]):v[clean(H.text(cells[0]))]=clean(H.text(cells[1]))
  mpn=v.get('PNY Part Number','');model=t.splitlines()[0].split(' | ')[0];cap=num(v.get('Memory Size',''),r'^(\d+)\s*GB');dims=triples(v.get('Card Dimensions',''),b)
  if not dims:
   m=re.search(r'([\d.]+)\"\s*[x×]\s*([\d.]+)\"\s*[x×]\s*([\d.]+)\"',v.get('Card Dimensions',''))
   if m:dims=[round(float(x)*25.4,3) for x in m.groups()];notes.append('Dimensions converties en millimètres depuis les pouces publiés par PNY ; précision limitée à celle de la mesure source.')
  power=None;psu=num(t,r'(\d+)\s*W(?:att)?\s+(?:or greater|minimum|Minimum)');notes.append('Le TDP de la fiche PNY reste une valeur thermique publiée ; il n’est pas enregistré comme consommation électrique mesurée de la carte.')
 elif b=='Inno3D':
  raw=gzip.open(H.ROOT/s['contentFile'],'rt',errors='replace').read();v={clean(H.text(k)):clean(H.text(val)) for k,val in re.findall(r'<div class=\"product-specification__item--title\">(.*?)</div>\s*<div class=\"product-specification__item--value\">(.*?)</div>',raw,re.S)};idx=json.load(open(D/'indexes/inno3d-products.json'))['data']['products'];ent=next((x for x in idx if x['url'].rstrip('/')==u.rstrip('/')),None)
  if not ent:return None
  model=ent['title'];mpn=ent['part_no'];cap=num(v.get('Standard Memory Config',''),r'\b(\d+)\s*GB\b');dims=[num(v.get(k,''),r'^(\d+(?:\.\d+)?)\s*mm') for k in ['Length','Height','Width']];dims=dims if all(dims) else None;power=None;psu=num(v.get('Minimum System Power Requirement (W)',''),r'^(\d+)\s*(?:W)?$')
 elif b=='Sapphire':
  marker=re.search(r'#SKU#\s*:?\s*([^\n]+)',t)
  if not marker:return None
  m=re.match(r'([A-Z0-9-]+)\s*(.*)',marker[1]);mpn=m[1];model=re.split(r' with |,',m[2])[0];v=labelled(t[marker.end():],LABELS[b],start='GPU\n',stop=r'\nSpecifications provided');cap=num(v.get('Memory Size/Bus',''),r'^(\d+)\s*GB');dims=triples(v.get('Form Factor',''),b);power=num(v.get('Power Consumption',''),r'^(\d+(?:\.\d+)?)\s*W');psu=num(v.get('System Requirement',''),r'(?:Minimum\s*)?(\d+)\s*Watt');
  if not model or 'RX' not in model:model=t.splitlines()[0].split('|')[0].strip()
 elif b=='XFX':
  model=re.split(r' with |, AMD RDNA',t.splitlines()[0])[0];m=re.search(r'Model Number:\s*([^\n]+)',t);mpn=clean(m[1]) if m else '';start=t.find('Specifications\n');end=t.find('Technologies\n',start);st=t[start:end] if start>=0 else '';v={clean(m[1]):clean(m[2]) for m in re.finditer(r'^([^:\n]{2,70}):\s*([^\n]+)',st,re.M)};cap=num(v.get('Memory Size',''),r'^(\d+)\s*GB');m=re.search(r'Card Dimension\s*\(cm\)\s*([\d.]+\s*[x×]\s*[\d.]+\s*[x×]\s*[\d.]+)',st,re.I);dims=triples(m[1]+' cm',b) if m else None;power=None;psu=num(v.get('Minimum Power Supply Requirement',''),r'^(\d+)\s*watt');fan=num(v.get('Thermal Solution',''),r'^(\d+)\s*Fan');
  if fan:p['fanCount']=int(fan)
  if dims:v['Card Dimension (cm)']=m[1];notes.append('XFX classe les dimensions dans « Estimated Dimensions & Weights » ; elles restent des indications fabricant estimées, pas une mesure indépendante.')
 else:return None
 if not model or not mpn or not cap or len(v)<5:return None
 if dims and all(x>0 for x in dims) and dims[0]>dims[1]>dims[2]:p.update(lengthMm=dims[0],heightMm=dims[1],thicknessMm=dims[2])
 if b=='ASRock':
  explicit_fans=[n for phrase,n in [('Triple Fan Design',3),('Dual Fan Design',2),('Single Fan Design',1)] if phrase in t]
  if len(set(explicit_fans))==1:p['fanCount']=explicit_fans[0];v['Ventilateurs']=str(explicit_fans[0])+' — conception explicitement publiée par ASRock'
 if b=='Sapphire':
  fan=re.fullmatch(r'([1-4])\s+Fans?',v.get('Cooler Type',''),re.I)
  if fan:p['fanCount']=int(fan[1])
 photo_proof=FINISH_PROOFS.get(mpn,{})
 if photo_proof.get('visuallyInspected') and photo_proof.get('sourceURL')==u and photo_proof.get('fanCount') and not p.get('fanCount'):
  p['fanCount']=photo_proof['fanCount'];v['Ventilateurs']=str(photo_proof['fanCount'])+' — photo fabricant du modèle exact inspectée'
 if power:p['powerW']=power
 if psu:p['recommendedPsuW']=psu
 p['capacityGB']=int(cap)
 # Only actual specification rows, not navigation or contextual recommendation text.
 v={k:clean(x) for k,x in v.items() if x and len(x)<5500}
 return {'brand':b,'model':model,'mpn':mpn,'capacityGB':cap,'values':v,'patch':p,'notes':notes,'source':s}
def matches(item,r):
 c=item['component'];o=item.get('original') or {};want,cap=expected(item)
 if c['brand']!=r['brand'] or cap and cap!=r['capacityGB']:return False,'capacity_or_brand'
 if r.get('catalogIds') is not None:
  if c['id'] not in r['catalogIds']:return False,'different_individually_reviewed_id'
  proof=r.get('identityEvidence',{})
  if proof.get('sourceURL')!=r['source']['url'] or proof.get('publishedModel')!=r['model'] or proof.get('archiveName')!=o.get('name') or proof.get('capacityGB')!=cap:return False,'individual_identity_proof_mismatch'
  if r.get('reviewPipeline')=='board-brands':
   return True,'individually_reviewed_board_brand_variant'
  if r.get('reviewPipeline')=='reference-primary' and c['brand'] in ['AMD','Intel']:
   chip_pattern=r'(?:RX\s*\d+(?:\s*(?:XTX|XT))?|Arc\s*[AB]\d{3})'
   archived=re.search(chip_pattern,o.get('chipset',c['name']),re.I);published=re.search(chip_pattern,r['model'],re.I)
   if archived and published and archived[0].lower()==published[0].lower() and 'Anniversary' not in c['name']:
    return True,'individually_reviewed_manufacturer_reference_card'
   return False,'reference_gpu_variant_mismatch'
  ok,reason=SECONDARY.compatible(item,r)
  return (True,'individually_reviewed_secondary_'+reason) if ok and proof.get('method')==reason else (False,'individual_secondary_recheck_failed')
 if c['brand']=='ASRock' and r['mpn'] and item.get('review'):
  current_path=urllib.parse.unquote(urllib.parse.urlparse(r['source']['url']).path).lower()
  for src in item['review'].get('sources',[]):
   if src['kind']=='manufacturer' and urllib.parse.unquote(urllib.parse.urlparse(src['url']).path).lower()==current_path and c['brand'].lower() in urllib.parse.urlparse(src['url']).netloc.lower():return True,'previously_confirmed_same_manufacturer_model_page'
 original_name=re.sub(r'^'+re.escape(c['brand'])+r'\s+','',o.get('name',''),flags=re.I)
 if r['mpn'] and H.norm(original_name)==H.norm(r['mpn']):return True,'exact_part_number_present_in_archive'
 if r['mpn'] and item.get('review') and H.norm(item['review']['mpn'])==H.norm(r['mpn']):
  got_flags=words(r['model'],cap,c['brand'])
  if any((flag in want)!=(flag in got_flags) for flag in ['gs','oc','white','lhr','evo','plus','super','ti','memvariantd6x']):return False,'previous_mpn_conflicts_archived_variant'
  return True,'previously_confirmed_exact_mpn'
 if not item.get('review') and H.norm(c.get('manufacturerPartNumber',''))==H.norm(r['mpn']) and c.get('manufacturerPartNumber'):
  got_flags=words(r['model'],cap,c['brand'])
  if any((flag in want)!=(flag in got_flags) for flag in ['gs','oc','white','lhr','evo','plus','super','ti','memvariantd6x']):return False,'previous_mpn_conflicts_archived_variant'
  return True,'previously_confirmed_exact_mpn'
 name=r['model'];b=c['brand'];got=words(name,cap,b)
 if b=='PowerColor':
  # OC and board-family suffixes are printed in the exact manufacturer model
  # code even where the marketing heading omits them.
  if 'oc' in want and 'oc' not in got and re.search(r'/OC(?:/|$)',r['mpn']):got=sorted(got+['oc'])
  if 'e' in want and re.search(r'-E/OC(?:/|$)',r['mpn']):want=[x for x in want if x!='e']
  if '2' in want and 'dh' in want and r['mpn'].endswith('-2DH'):want=[x for x in want if x not in ['2','dh']]
  physical=' '.join(r.get('publishedPhysicalText',[]))
  if 'white' in want and 'white' not in got and re.search(r'(?:white-painted|all-white|white and pink)',physical,re.I):got=sorted(got+['white'])
 if b=='MSI':
  explicit_type=re.search(r'\bG([56])\b',o.get('chipset',''),re.I)
  if explicit_type:
   expected_type='GDDR'+explicit_type[1]
   if not re.search(r'\b'+expected_type+r'\b',r['values'].get('Memory',''),re.I):return False,'archived_vram_type_mismatch'
   # Dataset G5/G6 chipset suffixes and MSI D5/D6 names denote the explicit VRAM type.
   want=[x for x in want if x not in ['g',explicit_type[1],'d']];got=[x for x in got if x not in ['d',explicit_type[1]]]

 if b=='XFX':
  # Fan count is not always named in archive; dimensions plus clocks disambiguate after exact family match.
  name=re.sub(r'\b(?:Triple|Dual) Fan\b','',name,flags=re.I);got=words(name,cap,b)
 if b=='Sapphire':
  got=[x for x in got if x not in ['with','memory']]
  proof=FINISH_PROOFS.get(r['mpn'])
  if proof and proof['sourceURL']==r['source']['url'] and proof.get('visuallyInspected') and proof['finish']=='white':
   if c.get('finishName','').startswith('Blanc') and 'white' not in got:got=sorted(got+['white'])
   elif o and not c.get('finishName','').startswith('Blanc'):return False,'published_photo_conflicts_archive_finish'
  if 'low' in want and 'profile' in want and re.search(r'\bLow Profile\b',r['values'].get('Form Factor',''),re.I):got=sorted(got+['low','profile'])
  length=o.get('length');new_length=r['patch'].get('lengthMm');boost=o.get('boost_clock')
  independently_corroborated=length and new_length and abs(length-new_length)<=2 and boost and re.search(r'(?<!\d)'+str(int(boost))+r'\s*MHz',r['values'].get('Engine Clock',''),re.I)
  # These are literal manufacturer expansions, accepted only with independent
  # capacity, clock and dimensions. Remaining variant tokens stay mandatory.
  if independently_corroborated:
   if 'oc' not in want:got=[x for x in got if x!='oc']
   if 'vapor' not in want:got=[x for x in got if x not in ['vapor','x']]
 if b=='ASRock':
  proof=FINISH_PROOFS.get(r['mpn'])
  if proof and proof['sourceURL']==r['source']['url'] and proof.get('visuallyInspected') and proof['finish']=='white':
   if c.get('finishName','').startswith('Blanc') and 'white' not in got:got=sorted(got+['white'])
   elif o and not c.get('finishName','').startswith('Blanc'):return False,'published_photo_conflicts_archive_finish'
 # Complete name equality preserves OC, XT, SUPER, EVO, X and named finishes.
 match_rule='exact_model_capacity_finish'
 if want!=got and b=='PNY':
  # PNY adds a cooling descriptor and the VERTO brand to some full titles.
  # Permit only these literal expansions, with independent clock + size corroboration.
  short_want=[x for x in want if x!='gaming'];short_got=[x for x in got if x!='gaming']
  if 'fan' not in short_want:short_got=[x for x in short_got if x not in ['single','dual','triple','fan']]
  if 'verto' not in short_want and 'fan' in short_want:short_got=[x for x in short_got if x!='verto']
  length=o.get('length');new_length=r['patch'].get('lengthMm');boost=o.get('boost_clock');boost_text=r['values'].get('Boost Speed','')
  if short_want==short_got and length and new_length and abs(length-new_length)<=1 and boost and re.fullmatch(r'\s*'+str(int(boost))+r'\s*MHz\s*',boost_text,re.I):want=got;match_rule='exact_model_with_published_cooling_descriptor_clock_and_dimensions'
 if want!=got:return False,'exact_variant_name_not_equal'
 photo_finish=FINISH_PROOFS.get(r['mpn'],{})
 white=bool(re.search(r'white|snow|blanc|luna',name,re.I)) or (b=='PowerColor' and 'white' in got) or (photo_finish.get('visuallyInspected') and photo_finish.get('sourceURL')==r['source']['url'] and photo_finish.get('finish')=='white');expectwhite=c.get('finishName','').startswith('Blanc')
 if expectwhite and not white and b not in ['Sapphire']:return False,'white_finish_not_confirmed'
 if not expectwhite and white and o:return False,'unexpected_white_variant'
 # Gigabyte has shared marketing names across PCB revisions. An unqualified archive cannot pick one.
 if b=='Gigabyte' and re.search(r'rev[- .]?\d',r['source']['url'],re.I):
  archive_rev=re.search(r'rev[. ]*([\d.]+)',o.get('name',''),re.I);source_rev=re.search(r'rev[- .]?([\d]+)',r['source']['url'],re.I)
  if not archive_rev:return False,'pcb_revision_missing_in_archive'
  if H.norm(archive_rev[1])!=source_rev[1]:return False,'pcb_revision_mismatch'
 # Surface conflicting archive identities rather than silently choosing by similarity.
 if c['id'] in ['import-gpu-2b708ab879d6','import-gpu-e14a7b1ca7e4']:return False,'archived_finish_conflict'
 if b not in ['MSI']:
  old=o.get('length');new=r['patch'].get('lengthMm')
  if b=='PowerColor' and r.get('dimensionBasis')=='with-bracket':
   board=re.match(r'([\d.]+)\s*(?:mm)?\s*[*x×]',r['values'].get('Board Dimensions',''))
   if board and old and abs(old-float(board[1]))<=2:old=new
  if old and new and abs(old-new)>2:return False,'archived_length_conflict'
  boost=o.get('boost_clock')
  clocks=' '.join(v for k,v in r['values'].items() if re.search('clock|boost',k,re.I))
  if boost and clocks and re.search('MHz',clocks,re.I) and not re.search(r'(?<!\d)'+str(int(boost))+r'(?!\d)',clocks):return False,'archived_boost_clock_conflict'
 return True,match_rule
def photos(s):
 result=[]
 if s['brand']=='Inno3D' and (D/'indexes/inno3d-products.json').exists():
  entry=next((x for x in json.load(open(D/'indexes/inno3d-products.json'))['data']['products'] if x['url'].rstrip('/')==s['url'].rstrip('/')),None)
  if entry:return [entry['thumb']['path']]
 path=H.ROOT/s.get('contentFile','')
 if path.is_file() and str(path).endswith('.gz'):
  raw=gzip.open(path,'rt',errors='replace').read()
  for tag in re.findall(r'<meta\b[^>]*>',raw,re.I):
   if re.search(r'(?:og:image|twitter:image)',tag,re.I):
    m=re.search(r'content=["\']([^"\']+)',tag,re.I)
    if m:result.append(urllib.parse.urljoin(s['url'],html.unescape(m[1])))
 return list(dict.fromkeys(result))
def build():
 parsed=[];fail=collections.Counter()
 for file in (D/'sources').glob('*.json'):
  s=json.load(open(file))
  try:r=parse(s)
  except Exception as e:fail[s['brand']+':'+type(e).__name__]+=1;continue
  if r:parsed.append(r)
 for extra_file in ['zotac-model-facts.json','nvidia-model-facts.json','powercolor-model-facts.json','asrock-model-facts.json','secondary-model-facts.json','board-brand-model-facts.json','reference-additional-model-facts.json']:
  if (D/extra_file).exists():parsed+=json.load(open(D/extra_file))
 bybrand=collections.defaultdict(list)
 for r in parsed:bybrand[r['brand']].append(r)
 out={};audit=[];visual=[];accepted=[];cleared_fields={}
 all_sources=[json.load(open(p)) for p in (D/'sources').glob('*.json')]
 source_counts=collections.Counter(x['brand'] for x in all_sources)
 quarantine_ids={x['id'] for file in [H.ROOT/'data/comprehensive-review/board-gpu-quarantine.json',D/'quarantine.json'] if file.exists() for x in json.load(open(file))}
 for item in INPUT:
  c=item['component'];existing=item.get('review');eligible=[];blocked=collections.Counter();candidates=[];want,cap=expected(item)
  for r in bybrand[c['brand']]:
   ok,why=matches(item,r)
   if ok:eligible.append((r,why))
   elif r['source'].get('requestedURL') in CAND[c['id']]['candidateURLs']:blocked[why]+=1
   if not ok:
    got=words(r['model'],cap,c['brand']);numbers=[n for n in want if n.isdigit() and int(n)>=100]
    if cap==r['capacityGB'] and any(n in got for n in numbers):
     score=len(set(want)&set(got))/max(1,len(set(want)|set(got)))
     if score>=0.45:candidates.append({'manufacturerModel':r['model'],'mpn':r['mpn'] or None,'url':r['source']['url'],'rejection':why,'expectedTokens':want,'publishedTokens':got,'similarityForDiscoveryOnly':round(score,3)})
  # Deduplicate the same exact manufacturer SKU, never distinct SKUs/PCB revisions.
  mpns={H.norm(r['mpn'] or r['model']) for r,_ in eligible}
  if len(mpns)>1:blocked['multiple_exact_model_skus']=len(mpns);eligible=[]
  if eligible:
   r,why=max(eligible,key=lambda x:len(x[0]['values']));r=copy.deepcopy(r);s=r['source']
   if why=='previously_confirmed_same_manufacturer_model_page' and existing:
    r['values']['Code modèle fabricant']=r['mpn'];r['mpn']=existing['mpn']
   if existing and r['mpn'] and H.norm(existing['mpn'])!=H.norm(r['mpn']):existing=None
   patch={**(existing or {}).get('patch',{}),**r['patch']};notes=list(dict.fromkeys((existing or {}).get('notes',[])+r['notes']));sources=(existing or {}).get('sources',[])+[{'name':r['brand']+' — tableau officiel','url':s['url'],'checkedAt':s['checkedAt'],'kind':'manufacturer'}]
   if r.get('clearTypedFields'):
    cleared_fields[c['id']]=r['clearTypedFields']
    for key in r['clearTypedFields']:patch.pop(key,None)
   newrows=[{'label':k,'value':v} for k,v in r['values'].items()];group={'title':'Spécifications détaillées du fabricant '+r['brand'],'rows':newrows}
   description=['Carte graphique '+r['model']+' avec '+str(int(r['capacityGB']))+' Go de mémoire vidéo.']
   if patch.get('lengthMm'):description.append('Longueur publiée : '+f"{patch['lengthMm']:g}"+' mm.')
   if r['patch'].get('powerW'):description.append('Puissance de carte publiée : '+f"{r['patch']['powerW']:g}"+' W.')
   description.append('Les caractéristiques détaillées ci-dessous sont issues du tableau officiel '+r['brand']+' ; les champs non publiés restent à confirmer.')
   patch['description']=' '.join(description)
   if r.get('identitySource'):sources.append(r['identitySource'])
   sources+=r.get('additionalSources',[])
   patch['manufacturerPartNumber']=r['mpn'];patch['detailLevel']='documented' if all(patch.get(k) for k in ['lengthMm','heightMm','thicknessMm','powerW','recommendedPsuW']) else 'partial'
   if patch.get('lengthMm') and c.get('lengthMm') and abs(patch['lengthMm']-c['lengthMm'])>2:
    notes.append('Longueur corrigée d’après la référence constructeur exacte : '+str(c['lengthMm'])+' mm dans l’archive, '+str(patch['lengthMm'])+' mm dans la fiche officielle.');patch['name']=re.sub(r'\d+(?:\.\d+)? mm$',f"{patch['lengthMm']:g} mm",c['name'])
   notes.append('Les valeurs sont celles publiées pour ce modèle. La recommandation d’alimentation du système reste distincte de la consommation de la carte ; aucune valeur absente n’est déduite d’un GPU de référence.')
   offers=(existing or {}).get('offers',[]) if not existing or H.norm(existing['mpn'])==H.norm(r['mpn']) else []
   out[c['id']]={'fieldEvidence':{**{k:{'value':value,'sourceURL':s['url'],'checkedAt':s['checkedAt']} for k,value in r['patch'].items()},**r.get('fieldEvidence',{})},'mpn':r['mpn'],'identityNote':'Modèle constructeur '+r['model']+' ; capacité '+str(int(r['capacityGB']))+' Go et variante rapprochées avec les discriminants archivés. '+('Référence commerciale exacte déjà confirmée.' if why=='previously_confirmed_exact_mpn' else 'Les suffixes OC, XT, SUPER, EVO, WHITE et les révisions restent distincts.'),'sources':list({x['url']:x for x in sources}.values()),'groups':[g for g in (existing or {}).get('groups',[]) if not g['title'].startswith('Spécifications détaillées du fabricant')]+[group],'patch':patch,'offers':offers,'notes':notes}
   photo=photos(s) if r.get('imageSelectionAllowed',True) else [];visual.append({'id':c['id'],'mpn':r['mpn'],'model':r['model'],'sourceURL':s['url'],'imageURLs':photo,'visuallyInspected':False,'dimensions':{k:v for k,v in patch.items() if k in ['lengthMm','heightMm','thicknessMm','fanCount','fanSizeMm']}});accepted.append({'id':c['id'],'model':r['model'],'mpn':r['mpn'],'url':s['url'],'matchRule':why,'sourceSHA256':s.get('sha256'),'fields':list(r['values'])})
  else:
   if not blocked:blocked['manufacturer_document_not_matched']=1
  p=out.get(c['id'],existing or {});patch=p.get('patch',{});missing=[k for k in ['lengthMm','heightMm','thicknessMm','powerW','recommendedPsuW'] if not patch.get(k)]
  audit.append({'id':c['id'],'brand':c['brand'],'archive':item.get('original'),'state':'primary_specs_enriched' if c['id'] in out else 'previous_confirmed_source_retained' if existing else 'exact_reference_unconfirmed','candidateURLs':CAND[c['id']]['candidateURLs'],'primaryDocumentsExaminedForBrand':len(bybrand[c['brand']]),'sourceRetrievalAttemptsForBrand':source_counts[c['brand']],'closestRejectedCandidates':sorted(candidates,key=lambda x:x['similarityForDiscoveryOnly'],reverse=True)[:5] if c['id'] not in out else [],'mpn':p.get('mpn'),'missingCompatibilityFields':missing,'blockers':dict(blocked) if c['id'] not in out else {},'requiredIdentityDiscriminants':['manufacturer model / part number','VRAM capacity','OC / special edition suffix','finish','PCB revision where named by manufacturer']})
 sku_proofs=json.load(open(D/'indexes/msi-retailer-sku-proof.json')) if (D/'indexes/msi-retailer-sku-proof.json').exists() else {}
 for cid,record in list(out.items()):
  is_model=not record['mpn'] or (any(host in record['sources'][-1]['url'] for host in ['msi.com/','asus.com/']) and bool(re.search(r'GeForce|Radeon',record['mpn'],re.I))) or (record['sources'][-1]['name'].startswith('ASRock') and not record['mpn'].startswith('90-'))
  proof=sku_proofs.get(cid,[])
  if is_model and len({x['mpn'] for x in proof})==1:
   proof=proof[0];record['mpn']=proof['mpn'];record['patch']['manufacturerPartNumber']=proof['mpn'];record['sources'].append({'name':'PcComponentes — référence commerciale explicite','url':proof['sourceURL'],'checkedAt':proof['checkedAt'],'kind':'retailer'});record['notes'].append('Référence commerciale liée par le nom de modèle complet identique et les suffixes explicites dans la fiche marchande ; les caractéristiques restent issues du constructeur.');is_model=False
  if is_model and cid in quarantine_ids:
   del out[cid]
   for rr in audit:
    if rr['id']==cid:rr['state']='exact_reference_unconfirmed';rr['blockers']={'quarantined_identity_not_promoted_to_model_only':True}
   continue
  if is_model:
   if record['mpn']:record['groups'][-1]['rows'].append({'label':'Code de modèle constructeur (distinct du SKU commercial)','value':record['mpn']})
   manufacturer_model=next(x['model'] for x in accepted if x['id']==cid)
   record['identityKind']='manufacturer-model';record['manufacturerModel']=manufacturer_model;record['mpn']='';record['patch']['manufacturerModel']=manufacturer_model;record['patch'].pop('manufacturerPartNumber',None);record['offers']=[];record['identityNote']='Nom exact de modèle constructeur '+manufacturer_model+' ; capacité, variante et finition rapprochées. Le SKU/MPN de vente n’est pas publié dans ce document et reste inconnu.'
   for rr in audit:
    if rr['id']==cid:rr['mpn']=None;rr['manufacturerModel']=manufacturer_model;rr['identityKind']='manufacturer-model'
  else:record['identityKind']='mpn'
 by_mpn=collections.defaultdict(list)
 for cid,rec in out.items():by_mpn[H.norm(rec['mpn'] or rec.get('manufacturerModel',''))].append(cid)
 lookup={x['component']['id']:x for x in INPUT};collisions=[]
 for mpn,ids in by_mpn.items():
  finishes={tuple(sorted(re.findall(r'[a-zà-ÿ]+',lookup[i]['component'].get('finishName','').lower()))) for i in ids if lookup[i]['component'].get('finishName')}
  if len(finishes)>1:
   for cid in ids:
    if lookup[cid].get('review'):continue
    if cid in out:del out[cid]
    for rr in audit:
     if rr['id']==cid:rr['state']='exact_reference_unconfirmed';rr['mpn']=None;rr['missingCompatibilityFields']=['lengthMm','heightMm','thicknessMm','powerW','recommendedPsuW'];rr['blockers']={'manufacturer_mpn_collision_across_archive_finishes':ids}
    collisions.append({'id':cid,'mpn':mpn,'ids':ids,'reason':'Archive finishes differ; manufacturer document alone does not prove that these are aliases.'})
 accepted=[x for x in accepted if x['id'] in out];visual=[x for x in visual if x['id'] in out]
 for entry in accepted+visual:
  record=out[entry['id']];entry['mpn']=record['mpn'] or None;entry['identityKind']=record['identityKind'];entry['manufacturerModel']=record.get('manufacturerModel',entry.get('model'))
 offer_proofs=json.load(open(D/'offer-proofs.json')) if (D/'offer-proofs.json').exists() else {}
 for cid,record in out.items():
  if record['identityKind']!='mpn':continue
  for proof in offer_proofs.get(cid,[]):
   offer=proof['offer']
   if H.norm(offer['mpn'])!=H.norm(record['mpn']):continue
   record['offers']=[o for o in record['offers'] if o['url']!=offer['url']]+[offer]
   record['sources']=[src for src in record['sources'] if src['url']!=offer['url']]+[{'name':'PcComponentes — offre pour le MPN exact','url':offer['url'],'checkedAt':offer['checkedAt'],'kind':'retailer'}]
 H.write_json(D/'finish-collisions.json',collisions)
 H.write_json(D/'accepted.json',accepted);H.write_json(D/'visual-references.json',visual);H.write_json(D/'review.json',audit);H.write_json(D/'products.json',out);H.write_json(D/'parser-summary.json',{'parsedPrimaryDocuments':{b:len(v) for b,v in bybrand.items()},'parserExceptions':dict(fail),'accepted':len(out),'acceptedByBrand':dict(collections.Counter(next(x['component']['brand'] for x in INPUT if x['component']['id']==cid) for cid in out)),'states':dict(collections.Counter(x['state'] for x in audit))})
 target=H.ROOT/'src/data/deepGpuCatalog.ts';temporary=target.with_suffix('.ts.tmp');temporary.write_text("// Generated by scripts/deep-gpu-extract.py from saved manufacturer evidence.\nimport type { VerifiedProduct } from './verifiedTypes'\n\nexport const deepGpuProducts: Record<string, VerifiedProduct> = "+json.dumps(out,ensure_ascii=False,indent=2)+'\n\nfor (const record of Object.values(deepGpuProducts)) {\n  if (record.identityKind === \'manufacturer-model\') record.patch.manufacturerPartNumber = undefined\n}\n')
 if cleared_fields:
  with temporary.open('a') as stream:stream.write('\nconst varyingRevisionFields: Record<string, string[]> = '+json.dumps({k:v for k,v in cleared_fields.items() if k in out})+';\nfor (const [id, keys] of Object.entries(varyingRevisionFields)) for (const key of keys) (deepGpuProducts[id].patch as Record<string, unknown>)[key] = undefined;\n')
 temporary.replace(target)
 print(json.dumps(json.load(open(D/'parser-summary.json')),ensure_ascii=False))
if __name__=='__main__':build()
