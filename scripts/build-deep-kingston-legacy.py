"""Historical HyperX identities from literal gallery cards and per-code PDFs."""
from pathlib import Path
import json,re
OUT=Path(__file__).resolve().parents[1]/'data/deep-review/memory-storage'
cards=json.loads((OUT/'kingston-legacy-catalog.json').read_text());docs={x['mpn']:x for x in json.loads((OUT/'kingston-legacy-datasheets.json').read_text())}
flyer=json.loads((OUT/'kingston-legacy-family-exa.json').read_text());ft='\n'.join(x.get('text','') for x in flyer['response']['content']);colors={};families={};flyers={}
for chunk in re.split(r'(?=^# [^\n]+\nURL: )',ft,flags=re.M):
 u=re.search(r'^URL: (\S+)',chunk,re.M)
 if not u:continue
 if 'Predator' in chunk and 'black aluminium' in chunk:
  for mpn in re.findall(r'\bHX4[A-Z0-9]+/\d+\b',chunk):colors[mpn]='black';families[mpn]='HyperX Predator';flyers[mpn]=u[1]
 if 'FURY' in chunk:
  for color in ['Black','White','Red']:
   part=re.search(r'\n'+color+r'\n(.*?)(?=\n(?:Black|White|Red|SPECIFICATIONS)\n|\n1 HyperX|\Z)',chunk,re.S)
   if part:
    for mpn in re.findall(r'\bHX4[A-Z0-9]+/\d+\b',part[1]):colors[mpn]=color.lower();families[mpn]='HyperX Fury';flyers[mpn]=u[1]
records=[];audit=[]
for c in cards:
 mpn=c['mpn'];d=docs[mpn];t=d.get('text','');flat=re.sub(r'\s+',' ',t);left=' '.join(re.split(r' {3,}',l.strip())[0] for l in t.splitlines());title=c['title'];family=families.get(mpn,'');color=colors.get(mpn)
 if 'Replaced by' not in title:
  fam=re.search(r'(?:HyperX )?(FURY|Predator)( RGB)?',title)
  if fam:family='HyperX '+('Fury' if fam[1]=='FURY' else fam[1])+(fam[2] or '')
  co=re.search(r'\b(Black|White|Red)\b',title)
  if co:color=co[1].lower()
 if not family or 'SO' in title or 'Custom' in title:
  audit.append({'mpn':mpn,'status':'excluded','reason':'Historical family not stated for the original revision, or out-of-scope SO-DIMM/custom model.'});continue
 p={'manufacturerPartNumber':mpn};sources=[];proof={};rows=[]
 def addsrc(url,date,label):
  src={'name':label,'url':url,'checkedAt':date,'kind':'manufacturer'}
  if src not in sources:sources.append(src)
  return src
 gallery=addsrc(c['source']['url'],c['source']['checkedAt'],'Kingston — galerie officielle historique, référence exacte')
 def add(values,src):
  for k,v in values.items():p[k]=v;proof[k]={'value':v,'sourceURL':src['url'],'checkedAt':src['checkedAt']}
 cap=re.search(r'Total Capacity: (\d+)GB \((\d+)x(\d+)GB\)',c['cardText']);timing=re.search(r'Memory Profile: (\d+)MT/s ([\d-]+) ([\d.]+)V',c['cardText'])
 if cap:add({'capacityGB':int(cap[1]),'memorySticks':int(cap[2])},gallery)
 if timing:add({'memoryType':'DDR4','memorySpeedMTs':int(timing[1]),'casLatency':int(timing[2].split('-')[0]),'memoryVoltageV':float(timing[3])},gallery)
 if t:
  src=addsrc(d['url'],d['checkedAt'],'Kingston — PDF HyperX du MPN exact')
  header=re.search(re.escape(mpn)+r'\s+(\d+)GB.*?DDR4-(\d+) CL(\d+) (\d+)-Pin (SO)?DIMM',t[:600],re.S)
  if header:
   kit=re.search(r'x (\d+) pcs',t[:600]);add({'capacityGB':int(header[1]),'memorySticks':int(kit[1]) if kit else 1,'memoryType':'DDR4','memorySpeedMTs':int(header[2]),'casLatency':int(header[3]),'memoryModuleKind':'SO-DIMM' if header[5] else 'UDIMM','memoryModuleFormat':'SO-DIMM' if header[5] else 'DIMM','memoryRegistered':False},src)
  tested=re.search(r'tested to run at DDR4-(\d+) at a low latency timing of ([\d-]+) at ([\d.]+)V',left)
  if tested:add({'memorySpeedMTs':int(tested[1]),'casLatency':int(tested[2].split('-')[0]),'memoryVoltageV':float(tested[3])},src);rows.append({'label':'Profil testé du module','value':tested[0]})
  if re.search(r'x 64[- ]bit',flat,re.I):add({'memoryEcc':False},src)
  if 'XMP' in flat:add({'memoryProfile':'XMP'},src)
  height=re.search(r'Height.{0,20}?\(([\d.]+)\s*mm\)',flat)
  if height:add({'heightMm':float(height[1])},src)
  if re.search(r'w/heatsink|WITH HEAT SPREADER',flat):add({'memoryHeatspreader':True},src)
  rank=re.search(r'\b([1248])Rx(4|8|16)\b',flat)
  if rank:add({'memoryRankCount':int(rank[1]),'memoryDeviceWidthBits':int(rank[2])},src)
  if '133.35 mm' in flat:add({'lengthMm':133.35},src)
  drawing=re.search(r'MODULE WITH HEAT SPREADER(.*?)MODULE DIMENSIONS',flat)
  if drawing:
   numbers={float(x) for x in re.findall(r'([\d.]+) mm',drawing[1])};thin={v for v in numbers if v<20}
   if len(thin)==1 and 133.35 in numbers:add({'thicknessMm':next(iter(thin))},src)
  for label,regex in [('Température de fonctionnement',r'Operating Temperature\s+([^\n]+)'),('Température de stockage',r'Storage Temperature\s+([^\n]+)')]:
   m=re.search(regex,t)
   if m:rows.append({'label':label,'value':m[1].strip()})
 if mpn in flyers:addsrc(flyers[mpn],flyer['checkedAt'],'Kingston — flyer historique listant ce MPN et sa finition')
 if not all(k in p for k in ['capacityGB','memorySticks','memorySpeedMTs','casLatency']):audit.append({'mpn':mpn,'status':'blocked','reason':'PDF unavailable or card lacks complete identity fields','pdfError':d.get('error')});continue
 rows=[{'label':'Référence exacte publiée','value':mpn},{'label':'Famille et finition','value':family+(' · '+color if color else '')},{'label':'Composition publiée','value':f"{p['capacityGB']} Go en {p['memorySticks']} module(s)"}]+rows
 records.append({'mpn':mpn,'brand':'Kingston','category':'ram','family':family,'colors':[color] if color else [],'patch':p,'sources':sources,'rows':rows,'fieldEvidence':proof,'images':[c['imageURL']] if c['imageURL'] else [],'url':d['url'] if t else c['source']['url']})
 audit.append({'mpn':mpn,'status':'indexed','pdfAvailable':bool(t),'fields':list(p),'family':family,'color':color})
(OUT/'kingston-legacy-index.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n');(OUT/'kingston-legacy-extraction-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n');print('indexed',len(records))
