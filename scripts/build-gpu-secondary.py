"""Read saved individual Zotac/PNY primary pages and brochures.

Search responses discover URLs only. Facts below are extracted from complete
primary-document reads, preserving capacity/OC/LHR/finish and distinct SKUs.
This script never edits the main GPU extractor or other agents' data.
"""
from pathlib import Path
import collections, datetime, gzip, hashlib, html, json, re

ROOT=Path(__file__).resolve().parents[1]
D=ROOT/'data/deep-review/gpu'
S=D/'secondary'
def clean(s): return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',str(s)))).strip()
def norm(s): return re.sub('[^a-z0-9]','',clean(s).lower())
def write(p,v): p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def number(s):
 m=re.search(r'\d+(?:\.\d+)?',str(s));return float(m[0]) if m else None
def documents():
 result=[]
 for f in sorted((S/'sources').glob('*-batch-*.json')):
  x=json.loads(f.read_text());text='\n'.join(c.get('text','') for c in x['result'].get('content',[]))
  matches=list(re.finditer(r'(?m)^# ([^\n]+)\nURL: (\S+)',text))
  for i,m in enumerate(matches):
   body=text[m.end():matches[i+1].start() if i+1<len(matches) else len(text)]
   brand='Zotac' if 'zotac.com/' in m[2] else 'PNY' if 'pny.com/' in m[2] else None
   if not brand: continue
   result.append({'brand':brand,'title':m[1],'url':m[2],'requestedURL':m[2],'text':body,
    'checkedAt':x['checkedAt'],'status':200,'kind':'manufacturer-brochure' if '.pdf' in m[2].lower() else 'manufacturer-product',
    'sha256':hashlib.sha256(body.encode()).hexdigest(),'digestScope':'exa-full-document-text','contentFile':str(f.relative_to(ROOT))})
 for f in sorted((D/'sources').glob('*.json')):
  x=json.loads(f.read_text())
  if x.get('brand')!='PNY' or x.get('status')!=200:continue
  path=ROOT/x.get('contentFile','')
  if not path.is_file() or not str(path).endswith('.gz'): continue
  try:raw=gzip.open(path,'rt',errors='replace').read()
  except OSError:continue
  heads=re.findall(r'<h1[^>]*>(.*?)</h1>',raw,re.S)
  x['title']=clean(heads[0]) if heads else x['text'].splitlines()[0]
  x['rawHTML']=raw
  result.append(x)
 return result

ZOTAC_LABELS=['GPU','CUDA cores','Video Memory','Memory Bus','Engine Clock','Memory Clock','AI TOPS','PCI Express','Display Outputs','HDCP Support','Multi Display Capability','Recommended Power Supply','Power Consumption','Power Input','DirectX','OpenGL','Cooling','Slot Size','SLI','Supported OS','Card Length','Accessories']
def zotac(doc):
 if '.pdf' in doc['url'].lower():return zotac_pdf(doc)
 if '/product/graphics_card/' not in doc['url']:return None
 t=doc['text'];model=clean(doc['title'].split('|')[0]);m=re.search(r'\bZT-[A-Z0-9-]+',t[:12000])
 if not m:return None
 mpn=m[0];v={};cur=None
 # The download selector repeats unrelated model names; only the isolated
 # specification labels after it are used for values.
 start=t.rfind('Product Specifications')
 section=t[start:] if start>=0 else t
 for line in section.splitlines():
  line=clean(re.sub(r'^[-#]+\s*','',line))
  if line in ZOTAC_LABELS:cur=line;v[cur]=[]
  elif line in ['Related Products','Open Apps wechat and Scan the above QR code.']:break
  elif line and cur:v[cur].append(line)
 v={k:clean(' '.join(a)) for k,a in v.items() if a}
 if not v.get('GPU') or not v.get('Video Memory'):return None
 cap=number(v['Video Memory']);p={'capacityGB':cap};notes=[]
 dims=re.search(r'(\d+(?:\.\d+)?)\s*(?:mm)?\s*[x×]\s*(\d+(?:\.\d+)?)\s*(?:mm)?\s*[x×]\s*(\d+(?:\.\d+)?)\s*mm',v.get('Card Length',''),re.I)
 if dims:
  a=[float(x) for x in dims.groups()]
  if a[0]>a[1]>a[2]>0:p.update(zip(['lengthMm','heightMm','thicknessMm'],a))
 for label,key in [('Power Consumption','powerW'),('Recommended Power Supply','recommendedPsuW')]:
  m=re.fullmatch(r'(\d+(?:\.\d+)?)\s*W',v.get(label,''),re.I)
  if m:p[key]=float(m[1])
 # Fan count is admitted only when written, not guessed from the family name.
 fan={'single fan':1,'dual fan':2,'triple fan':3}.get(v.get('Cooling','').lower())
 if fan:p['fanCount']=fan
 return {'brand':'Zotac','model':model,'mpn':mpn,'capacityGB':cap,'values':v,'patch':p,'notes':notes,'source':{k:v for k,v in doc.items() if k not in ['rawHTML','text']}}

def zotac_pdf(doc):
 t=doc['text'];flat=clean(t.replace('™','').replace('®',''));v={};p={}
 m=re.search(r'SKU\s*:\s*(ZT-[A-Z0-9-]+)',flat,re.I)
 if not m:return None
 mpn=m[1].upper()
 m=re.search(r'INSIDE THE BOX\s*[#\s•]*(ZOTAC[^•]+)',t,re.I)
 if not m:return None
 model=clean(re.split(r'\b(?:DIMENSIONS|POWER REQUIREMENTS|CONNECTIONS)\b',m[1])[0]).strip(' #')
 patterns={'GPU':r'NVIDIA\s+(GeForce\s+(?:RTX|GTX|GT)\s*\d+(?:\s*Ti)?(?:\s*SUPER)?)\s+GPU',
  'CUDA cores':r'(\d+)\s+CUDA cores','Video Memory':r'(\d+\s*GB\s+GDDR\dX?)\s+memory',
  'Memory Bus':r'(\d+[- ]bit)\s+memory bus','Engine Clock':r'Engine boost clock\s*:\s*([\d.]+\s*MHz)',
  'Memory Clock':r'Memory clock\s*:\s*([\d.]+\s*Gbps)','PCI Express':r'PCI Express\s+([\d.]+(?:\s*(?:x?16|16x))?)',
  'Recommended Power Supply':r'(\d+)[- ]watt power supply recommended','Power Consumption':r'(\d+)[- ]watt max power consumption'}
 for key,pattern in patterns.items():
  m=re.search(pattern,flat,re.I)
  if m:v[key]=m[1]+(' W' if key in ['Power Consumption','Recommended Power Supply'] else '')
 if not v.get('Video Memory'):return None
 cap=number(v['Video Memory']);p['capacityGB']=cap
 for label,key in [('Power Consumption','powerW'),('Recommended Power Supply','recommendedPsuW')]:
  if v.get(label):p[key]=number(v[label])
 dimensions=re.split(r'DIMENSIONS',flat,flags=re.I)
 if len(dimensions)>1:
  section=re.split(r'\bBox\b',dimensions[1],flags=re.I)[0]
  for label,key in [('Length','lengthMm'),('Height','heightMm'),('Width','thicknessMm')]:
   m=re.search(label+r'\s*:\s*[^•]*?([\d.]+)\s*mm',section,re.I)
   if m:p[key]=float(m[1]);v[label]=m[1]+' mm'
 for label,end in [('CONNECTIONS','SOFTWARE COMPATIBILITY'),('FEATURES','INSIDE THE BOX')]:
  m=re.search(r'\b'+label+r'\b(.*?)(?:\b'+end+r'\b|\bEAN\s*:|\bSKU\s*:)',flat,re.I)
  if m and len(m[1])<2000:v[label.title()]=clean(m[1]).strip(' •')
 power=re.search(r'POWER REQUIREMENTS(.*?)(?:\bCONNECTIONS\b|\bSKU\s*:|\bINSIDE THE BOX\b)',flat,re.I)
 if power and len(power[1])<800:v['Power requirements']=clean(power[1]).strip(' •')
 return {'brand':'Zotac','model':model,'mpn':mpn,'capacityGB':cap,'values':v,'patch':p,'notes':[],
  'source':{k:v for k,v in doc.items() if k not in ['rawHTML','text']}}

def pny(doc):
 t=doc['text'];v={}
 if doc.get('rawHTML'):
  for tr in re.findall(r'<tr[^>]*>(.*?)</tr>',doc['rawHTML'],re.S):
   cells=re.findall(r'<(?:th|td)[^>]*>(.*?)</(?:th|td)>',tr,re.S)
   if len(cells)==2 and clean(cells[0]) and clean(cells[1]):v[clean(cells[0])]=clean(cells[1])
 else:
  for line in t.splitlines():
   if line.startswith('|'):
    cells=[clean(x) for x in line.strip('|').split('|')]
    if len(cells)==2 and cells[0] and not re.fullmatch(r'[- :]+',cells[0]):v[cells[0]]=cells[1]
  # Brochure tables sometimes append section names to the first label.
  for k in list(v):
   if k.endswith('PNY Part Number') and k!='PNY Part Number':v['PNY Part Number']=v.pop(k)
 mpn=v.get('PNY Part Number','')
 if not mpn:
  m=re.search(r'\bVC[GNQ][A-Z0-9-]+',t)
  if m:mpn=m[0]
 if not re.fullmatch(r'VC[GNQ][A-Z0-9-]+',mpn):return None
 model=clean(doc['title'].split('|')[0])
 if '.pdf' in doc['url'].lower():
  lines=[clean(re.sub('^[#• ]+','',line)) for line in t.splitlines() if clean(line)]
  for i,line in enumerate(lines):
   if re.match(r'PNY\s+GEFORCE',line,re.I):
    model=line
    for nxt in lines[i+1:i+4]:
     if re.match(r'(?:XLR8|VERTO|(?:ARGB\s+)?(?:Overclocked\s+)?(?:Triple|Dual|Single)|EPIC|Gaming|REVEL|UPRISING|Blower)',nxt,re.I):model+=' '+nxt
     else:break
    break
 cap=number(v.get('Memory Size',v.get('GPU Memory','')))
 if not cap:
  m=re.search(r'\b(\d+)\s*GB\s*(?:GDDR|DDR)',t,re.I)
  if m:cap=float(m[1])
 if not cap or len(v)<5:return None
 p={'capacityGB':cap};notes=[];dim=v.get('Card Dimensions',v.get('Dimensions',''))
 m=re.search(r'(\d+(?:\.\d+)?)\s*(?:mm)?\s*[x×]\s*(\d+(?:\.\d+)?)\s*(?:mm)?\s*[x×]\s*(\d+(?:\.\d+)?)\s*mm',dim,re.I)
 if m:a=[float(x) for x in m.groups()]
 else:
  m=re.search(r'(\d+(?:\.\d+)?)\s*["”]?\s*[x×]\s*(\d+(?:\.\d+)?)\s*["”]?\s*[x×]\s*(\d+(?:\.\d+)?)\s*["”]',dim)
  a=[round(float(x)*25.4,3) for x in m.groups()] if m else None
  if a:notes.append('Dimensions converties des pouces fabricant en millimètres ; la précision reste celle de la mesure publiée.')
 if a and a[0]>a[1]>a[2]>0:p.update(zip(['lengthMm','heightMm','thicknessMm'],a))
 m=re.search(r'(\d+)\s*W(?:att)?\s*(?:or greater|minimum)',t,re.I)
 if m:p['recommendedPsuW']=int(m[1])
 fan=re.search(r'\b(Single|Dual|Triple) Fan\b',model,re.I)
 if fan:p['fanCount']={'single':1,'dual':2,'triple':3}[fan[1].lower()]
 notes.append('Le TDP publié reste une donnée thermique, distincte de la consommation électrique de carte ; il n’est pas transféré dans powerW.')
 return {'brand':'PNY','model':model,'mpn':mpn,'capacityGB':cap,'values':v,'patch':p,'notes':notes,'source':{k:v for k,v in doc.items() if k not in ['rawHTML','text','links']}}

def chip(s):
 s=clean(s).lower().replace('™','').replace('®','')
 m=re.search(r'\b(rtx|gtx|gt)\s*(\d+)(?:\s*(ti))?(?:\s*(super))?',s)
 if not m:return None
 out=' '.join(x for x in m.groups() if x)
 if 'ada' in s:out+=' ada'
 if 'sff' in s:out+=' sff'
 if '2000e' in s:out+=' e'
 if 'quadro' in s:out+=' quadro'
 return out
def tokens(s):
 s=clean(s).lower().replace('™','').replace('®','').replace('overclocked','oc')
 s=re.sub(r'\b(?:pny|zotac|nvidia|geforce|graphics|cards?|edition|brochure|bundle|discover|dlss\s*\d+|gaming|black|gddr\d+x?|\d+\s*gb)\b',' ',s)
 s=re.sub(r'\b(?:rtx|gtx|gt)\s*\d+(?:\s*ti)?(?:\s*super)?',' ',s)
 return sorted(re.findall(r'[a-z]+|\d+',s))
def compatible(item,fact):
 c=item['component'];o=item.get('original') or {};name=o.get('name',c['name']);ch=o.get('chipset','');cap=o.get('memory',c.get('capacityGB'))
 if c['brand']!=fact['brand'] or cap!=fact['capacityGB'] or chip(ch or name)!=chip(fact['model']):return False,'chip_capacity'
 if norm(name.removeprefix(c['brand']+' '))==norm(fact['mpn']):return True,'exact_MPN_in_archive'
 want=tokens(name);got=tokens(fact['model']);flags=['oc','white','lhr','extreme','holo','maxx','core','airo','amp','mini','ti','super','plus']
 # The dataset writes LHR/VRAM type in chipset rather than the model name.
 if 'lhr' in ch.lower() and 'lhr' not in want:want.append('lhr')
 if c.get('finishName','').startswith('Blanc') and 'white' not in want:want.append('white')
 if 'lhr' in fact['mpn'].lower() and 'lhr' not in got:got.append('lhr')
 for flag in flags:
  if (flag in want)!=(flag in got):return False,'variant_'+flag
 for mem in ['5','6']:
  if re.search(r'\bG'+mem+r'\b',ch,re.I) and not re.search(r'GDDR'+mem+r'\b',' '.join(fact['values'].values()),re.I):return False,'memory_generation'
 # Redundant full chip names in a few archive model names are removed above.
 if sorted(want)==sorted(got):return True,'full_manufacturer_model'
 if c['brand']=='PNY':
  # Fan count descriptors do not change the named marketing edition; the
  # primary dimension and clock still independently corroborate this variant.
  a=[x for x in want if x not in ['fan','single','dual','triple']]
  b=[x for x in got if x not in ['fan','single','dual','triple']]
  boost=o.get('boost_clock');published_boost=fact['values'].get('Boost Speed','')
  if sorted(a)==sorted(b) and o.get('length') and fact['patch'].get('lengthMm') and abs(o['length']-fact['patch']['lengthMm'])<2 and boost and re.fullmatch(r'\s*'+str(int(boost))+r'\s*MHz\s*',published_boost,re.I):
   return True,'full_edition_with_explicit_fan_descriptor_clock_and_dimensions'
 return False,'full_model_not_equal'

def main():
 docs=documents();facts=[]
 for doc in docs:
  r=zotac(doc) if doc['brand']=='Zotac' else pny(doc)
  if r:facts.append(r)
 write(S/'parsed-facts.json',facts)
 inputs=json.load(gzip.open(D/'input.json.gz','rt'))
 # Freeze the assigned population, independent of concurrent main-extractor runs.
 targetfile=S/'assigned-ids.json'
 if targetfile.exists():targets=json.loads(targetfile.read_text())
 else:
  targets=[x['id'] for x in json.loads((D/'review.json').read_text()) if x['brand'] in ['Zotac','PNY'] and x['state']=='exact_reference_unconfirmed'];write(targetfile,targets)
 rows=[];out=[]
 for item in inputs:
  cid=item['component']['id']
  if cid not in targets:continue
  matched=[];near=[]
  for fact in facts:
   ok,reason=compatible(item,fact)
   if ok:matched.append((fact,reason))
   elif reason!='chip_capacity':near.append({'model':fact['model'],'mpn':fact['mpn'],'reason':reason,'url':fact['source']['url']})
  bympn=collections.defaultdict(list)
  for fact,reason in matched:bympn[fact['mpn']].append((fact,reason))
  if len(bympn)==1:
   fact,reason=max(matched,key=lambda x:len(x[0]['values']))
   fact={**fact,'catalogIds':[cid],'identityEvidence':{'method':reason,'archiveName':item.get('original',{}).get('name'),'publishedModel':fact['model'],'capacityGB':fact['capacityGB'],'sourceURL':fact['source']['url']}}
   out.append(fact);state='primary_identity_and_specs'
  else:state='multiple_SKUs_require_individual_review' if bympn else 'followup_required'
  rows.append({'id':cid,'brand':item['component']['brand'],'name':item['component']['name'],'state':state,'matchingMPNs':list(bympn),'closestCandidates':near[:15]})
 write(D/'secondary-model-facts.json',out);write(S/'review.json',rows)
 print(json.dumps({'documents':len(docs),'facts':len(facts),'matched':len(out),'states':dict(collections.Counter(x['state'] for x in rows)),'byBrand':dict(collections.Counter(x['brand'] for x in out))}))
if __name__=='__main__':main()
