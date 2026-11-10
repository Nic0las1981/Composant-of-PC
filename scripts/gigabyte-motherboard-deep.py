#!/usr/bin/env python3
"""Official Gigabyte motherboard collection, preserving model and PCB revisions.

Uses the public sitemap and rendered specification pages, never private APIs.
Run with --fetch to refresh missing receipts, then --build for an offline rebuild.
The retained input.json is the pre-enrichment catalogue/verified-offer snapshot.
"""
import argparse, concurrent.futures, datetime, gzip, hashlib, html as html_std, json, pathlib, re, time, urllib.error, urllib.parse, urllib.request
from collections import defaultdict, Counter
from lxml import html, etree

ROOT=pathlib.Path(__file__).resolve().parents[1]
DATA=ROOT/'data/deep-review/motherboard/gigabyte'
PAGES=DATA/'pages'; RAW=DATA/'raw'; DISCOVERY=DATA/'discovery'
for d in (DATA,PAGES,RAW,DISCOVERY):d.mkdir(parents=True,exist_ok=True)
SITEMAP='https://www.gigabyte.com/sitemap/consumer-products/global/sitemap.xml'
HEADERS={'User-Agent':'Mozilla/5.0 (compatible; catalogue-reference-verification/1.0)'}
LABELS={'CPU':'Processeurs / socket','Chipset':'Chipset','Memory':'Mémoire','Onboard Graphics':'Sorties graphiques intégrées','Audio':'Audio','LAN':'Réseau filaire','Wireless Communication module':'Réseau sans fil','Wireless Communication Module':'Réseau sans fil','Expansion Slots':'Emplacements PCIe','Multi-Graphics Technology':'Multi-GPU','Storage Interface':'Stockage et restrictions','USB':'USB','Internal I/O Connectors':'Connectique interne','Back Panel Connectors':'Connectique arrière','I/O Controller':'Contrôleur entrées/sorties','H/W Monitoring':'Surveillance matérielle','BIOS':'BIOS','Unique Features':'Fonctions spécifiques','Bundled Software':'Logiciels inclus','Operating System':'Systèmes pris en charge','Form Factor':'Format et dimensions','Remark':'Restrictions constructeur'}

def clean(s):return re.sub(r'\s+',' ',s).strip()
def normalized(s):return re.sub(r'[^a-z0-9+]','',s.lower())
def model_name(s):return re.sub(r'\s*\(rev\.[^)]+\)','',s,flags=re.I).strip()
def slug_model(u):return re.sub(r'-rev-.*$','',urllib.parse.unquote(urllib.parse.urlsplit(u).path.rstrip('/').split('/')[-1]),flags=re.I)
def cache_key(url):return hashlib.sha256(url.encode()).hexdigest()[:24]
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')
def fulltext(e):return clean(' '.join(e.itertext()))
def revision(s):
 m=re.search(r'\(Rev\.\s*([^)]*)\)',s,re.I);return m.group(1).strip() if m else None
def revision_covers(wanted,published):
 if wanted is None:return True
 if published is None:return False
 wanted=[x.strip() for x in wanted.split('/')];published=[x.strip() for x in published.split('/')]
 return all(any(w.lower()==p.lower() or (p.lower().endswith('.x') and w.startswith(p[:-1])) for p in published) for w in wanted)

def parse_page(raw,url):
 tree=html.fromstring(raw);h1=clean(' '.join(tree.xpath('//h1//text()')));sections={};items={}
 for block in tree.xpath('//ul[contains(concat(" ",normalize-space(@class)," ")," spec-item-list ")]'):
  title=block.xpath('./li[contains(@class,"spec-title")]');desc=block.xpath('./li[contains(@class,"spec-desc")]')
  if not title or not desc:continue
  key=fulltext(title[0]);value=fulltext(desc[0])
  if key not in sections and value:
   sections[key]=value
   items[key]=[fulltext(li) for li in desc[0].xpath('.//li')]
 images=[];aliases=[]
 for image in tree.xpath('//img[@src]'):
  src=urllib.parse.urljoin(url,image.get('src'));alt=image.get('alt','')
  if 'ProductRemoveBg' in src and normalized(model_name(h1))==normalized(re.sub(r'^Motherboard\s*-\s*','',alt,flags=re.I)):
   if src not in images:images.append(src)
 # Some specification layouts expose the exact product image only in the
 # public SSR payload. Follow its modelName/image references, never menu images.
 for script in tree.xpath('//script[@id="__NUXT_DATA__"]'):
  try:
   data=json.loads(script.text or '[]')
   for entry in data:
    if isinstance(entry,dict) and all(k in entry for k in ['modelName','subTitle']):
     model=data[entry['modelName']];subtitle=data[entry['subTitle']]
     if isinstance(model,str) and normalized(model)==normalized(model_name(h1)) and isinstance(subtitle,str) and len(subtitle)<100 and re.match(r'^(?:GA-|[ABHXZ][0-9]{3})',subtitle):aliases.append(subtitle)
    if not isinstance(entry,dict) or not all(k in entry for k in ['modelName','image']):continue
    model=data[entry['modelName']];image=data[entry['image']]
    exact_model=isinstance(model,str) and normalized(model)==normalized(model_name(h1))
    # Some official pages group PCB revisions under one model URL and explicitly
    # attach the same photo to model names suffixed "1.0", "1.1", etc.
    if isinstance(model,str) and 'modelPageUrl' in entry:
     model_url=data[entry['modelPageUrl']]
     exact_model=exact_model or (isinstance(model_url,str) and normalized(slug_model(model_url))==normalized(model_name(h1)) and re.fullmatch(re.escape(model_name(h1))+r'\s+\d+\.\d+',model,re.I) is not None)
    if exact_model and isinstance(image,str) and '/ProductRemoveBg/' in image and image.startswith('https://static.gigabyte.com/'):
     if image not in images:images.append(image)
  except (ValueError,IndexError,TypeError,KeyError):pass
 links=[]
 for a in tree.xpath('//a[@href]'):
  link=urllib.parse.urljoin(url,a.get('href'));path=urllib.parse.urlsplit(link).path
  if path.startswith('/Motherboard/') and '/sp' not in path and not re.search(r'/(?:support|na|ot)$',path) and normalized(slug_model(link))==normalized(model_name(h1)):
   if link not in links:links.append(link)
 manuals=[]
 for a in tree.xpath('//a[@href]'):
  link=urllib.parse.urljoin(url,a.get('href'))
  if re.search(r'\.pdf(?:[?#]|$)',link,re.I):manuals.append(link)
 return {'title':h1,'model':model_name(h1),'manufacturerAliases':list(dict.fromkeys(aliases)),'revision':revision(h1),'sections':sections,'sectionItems':items,'imageURLs':images,'revisionURLs':links,'manualURLs':list(dict.fromkeys(manuals))}

def fetch_page(url):
 url=url.rstrip('/');url=url if url.endswith('/sp') else url+'/sp';key=cache_key(url);file=PAGES/(key+'.json')
 if file.exists():return json.loads(file.read_text())
 receipt={'requestedURL':url,'checkedAt':now(),'attempts':[]}
 for attempt in range(2):
  try:
   request=urllib.request.Request(url,headers=HEADERS)
   with urllib.request.urlopen(request,timeout=30) as response:raw=response.read(4000000);resolved=response.url;status=response.status
   receipt['attempts'].append({'url':url,'status':status,'resolvedURL':resolved,'bytes':len(raw)})
   parsed=parse_page(raw,resolved)
   if not parsed['sections'] and not urllib.parse.urlsplit(resolved).path.rstrip('/').endswith('/sp') and '/Motherboard/' in resolved:
    url=resolved.rstrip('/')+'/sp';continue
   receipt.update(url=resolved,httpStatus=status,sha256=hashlib.sha256(raw).hexdigest(),**parsed)
   receipt['status']='official_specifications' if len(parsed['sections'])>=5 and 'Memory' in parsed['sections'] else 'no_specification_table'
   with gzip.open(RAW/(key+'.html.gz'),'wb',compresslevel=6) as out:out.write(raw)
   break
  except (urllib.error.HTTPError,urllib.error.URLError,TimeoutError,ValueError) as error:
   receipt['attempts'].append({'url':url,'error':str(error)[:250]})
   receipt['status']='unavailable';break
 file.write_text(json.dumps(receipt,ensure_ascii=False,indent=2));return receipt

def official_index():
 file=DISCOVERY/'motherboard-urls.json'
 if file.exists():return json.loads(file.read_text())
 raw=urllib.request.urlopen(urllib.request.Request(SITEMAP,headers=HEADERS),timeout=45).read(40000000)
 root=etree.fromstring(raw);urls=[u for u in root.xpath('//*[local-name()="loc"]/text()') if '/Motherboard/' in u]
 with gzip.open(DISCOVERY/'global-sitemap.xml.gz','wb') as out:out.write(raw)
 file.write_text(json.dumps(urls,indent=2));return urls

def candidate_map(records):
 index=defaultdict(list)
 for url in official_index():index[normalized(slug_model(url))].append(url)
 result={}
 for record in records:
  c=record['component'];model=model_name(c['name']);urls=index.get(normalized(model),[])
  if not urls:
   slug=re.sub(r'\s+','-',model)
   # Old models absent from today's sitemap remain public. The response title is
   # validated; a constructed URL alone never establishes product identity.
   urls=[f'https://www.gigabyte.com/Motherboard/{slug}-rev-1x',f'https://www.gigabyte.com/Motherboard/{slug}-rev-10']
  result[c['id']]=list(dict.fromkeys(urls))
 return result

def fetch_all(records):
 candidates=candidate_map(records);all_urls=list(dict.fromkeys(url for urls in candidates.values() for url in urls));total=0
 additional=DISCOVERY/'additional-urls.json'
 if additional.exists():all_urls=list(dict.fromkeys(all_urls+[r['url'] for r in json.loads(additional.read_text())]))
 with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
  results=[]
  for receipt in pool.map(fetch_page,all_urls):
   results.append(receipt);total+=1
   if total%25==0:print(f'Gigabyte primary receipts {total}/{len(all_urls)}',flush=True)
  known=set(url.rstrip('/') for url in all_urls)
  extra=list(dict.fromkeys(link for r in results if r.get('status')=='official_specifications' for link in r.get('revisionURLs',[]) if link.rstrip('/') not in known))
  for i,receipt in enumerate(pool.map(fetch_page,extra),1):
   if i%25==0:print(f'Gigabyte discovered revision receipts {i}/{len(extra)}',flush=True)
 print(f'Fetched/reused {len(all_urls)} product endpoints and {len(extra)} linked revisions.',flush=True)

def derive(page):
 s=page['sections'];patch={};evidence={};url=page['url'];date=page['checkedAt']
 def fact(key,value):evidence[key]={'value':value,'sourceURL':url,'checkedAt':date}
 for field,key in [('cpuSupport','CPU'),('chipset','Chipset'),('storagePorts','Storage Interface'),('pcie','Expansion Slots'),('rearIO','Back Panel Connectors'),('internalIO','Internal I/O Connectors'),('network','LAN'),('audio','Audio'),('boardDimensions','Form Factor')]:
  if s.get(key):fact(field,s[key])
 cpu=s.get('CPU','');memory=s.get('Memory','');form=s.get('Form Factor','');storage=s.get('Storage Interface','')
 socket=re.search(r'\b(AM[2345])\s+Socket|\bSocket\s+(AM[2345])\b|\bLGA\s*([0-9]{3,4})\b',cpu,re.I)
 if socket:
  value=socket.group(1) or socket.group(2) or 'LGA'+socket.group(3);value=value.upper();fact('socket',value)
  if value in ['AM4','AM5','LGA1700']:patch['socket']=value
 ddrs=list(dict.fromkeys(re.findall(r'\bDDR([2345])\b',memory,re.I)))
 if len(ddrs)==1:
  value='DDR'+ddrs[0];fact('memoryType',value)
  if value in ['DDR4','DDR5']:patch['memoryType']=value
 slots=re.search(r'\b([1-8])\s*x\s*(?:DDR[2345]?\s*)?DIMM\s+(?:sockets|slots)',memory,re.I)
 if slots:patch['memorySlots']=int(slots.group(1));fact('memorySlots',patch['memorySlots'])
 capacity=re.search(r'(?:up to|maximum of|maximum|Max\.)\s*(\d+)\s*GB',memory,re.I)
 if capacity:patch['maxMemoryGB']=int(capacity.group(1));fact('memoryCapacity',patch['maxMemoryGB'])
 per_slot=re.search(r'\b(\d+)\s*GB\s+single\s+DIMM\s+capacity\b',memory,re.I)
 if per_slot:patch['maxMemoryPerSlotGB']=int(per_slot.group(1))
 if re.search(r'\bDual\s+channel\s+memory\s+architecture\b',memory,re.I):patch['memoryChannels']=2
 factor=re.search(r'\b(Micro\s*ATX|Mini[-\s]*ITX|E[-\s]*ATX|ATX|XL[-\s]*ATX)\s+Form Factor',form,re.I)
 if factor:
  f=re.sub(r'\s+','',factor.group(1)).upper();f={'MICROATX':'Micro-ATX','MINIITX':'Mini-ITX','MINI-ITX':'Mini-ITX','ATX':'ATX'}.get(f,f);fact('formFactor',f)
  if f in ['Micro-ATX','Mini-ITX','ATX']:patch['formFactor']=f
 dim=re.search(r'(\d+(?:\.\d+)?)\s*cm\s*x\s*(\d+(?:\.\d+)?)\s*cm',form,re.I)
 if dim:patch['heightMm']=round(float(dim.group(1))*10,3);patch['widthMm']=round(float(dim.group(2))*10,3)
 count=0;unknown=False;m2seen=False
 # Newer pages put connector headers outside <li>; bind each explicit count
 # to its own support paragraph, ending before the next storage connector.
 chunks=re.findall(r'\b(\d+)\s*x\s*M\.2\s+(?:connectors?|sockets?)\b(.*?)(?=\b\d+\s*x\s*(?:M\.2|SATA|U\.2|mSATA)\b|$)',storage,re.I)
 for number,details in chunks:
  m2seen=True
  if re.search(r'Wi[ -]?Fi|Key\s*E',details,re.I):continue
  if re.search(r'\b(?:PCIe|PCI Express|NVMe)\b',details,re.I):count+=int(number)
  elif not re.search(r'\bSATA\b',details,re.I):unknown=True
 if storage and not unknown and (m2seen or not re.search(r'M\.2',storage,re.I)):
  patch['m2Slots']=count;fact('m2',count)
 return patch,evidence

def build(records):
 pages=[json.loads(f.read_text()) for f in PAGES.glob('*.json')];by_model=defaultdict(list)
 for page in pages:
  if page.get('status')=='official_specifications':
   for name in [page['model'],*page.get('manufacturerAliases',[])]:by_model[normalized(name)].append(page)
 products={};report=[];photos={}
 for record in records:
  c=record['component'];existing=record.get('verified');name=model_name(c['name']);wanted=revision(c['name']);matching=by_model.get(normalized(name),[])
  # Deduplicate endpoint aliases by the canonical official URL and revision.
  matching=list({(p['url'],p.get('revision')):p for p in matching}.values())
  matching=[p for p in matching if revision_covers(wanted,p.get('revision'))]
  valid=[];rejections=[]
  for page in matching:
   patch,facts=derive(page)
   if c.get('memoryType') and patch.get('memoryType') and c['memoryType']!=patch['memoryType']:
    rejections.append({'url':page['url'],'reason':'DDR generation differs from archived variant'});continue
   if c.get('socket') and patch.get('socket') and c['socket']!=patch['socket']:
    rejections.append({'url':page['url'],'reason':'CPU socket differs from archived variant'});continue
   valid.append((page,patch,facts))
  if not valid:
   report.append({'id':c['id'],'name':c['name'],'status':'primary_identity_unconfirmed','candidateURLs':candidate_map([record])[c['id']],'rejections':rejections});continue
  valid.sort(key=lambda pair:pair[0].get('revision') or '')
  common_patch={key:value for key,value in valid[0][1].items() if all(patch.get(key)==value for _,patch,_ in valid)}
  common_facts={key:value for key,value in valid[0][2].items() if all(facts.get(key,{}).get('value')==value['value'] for _,_,facts in valid)}
  varying=sorted(set().union(*(set(facts) for _,_,facts in valid))-set(common_facts))
  mpn=existing['mpn'] if existing else c.get('manufacturerPartNumber') or name
  sources=list(existing.get('sources',[])) if existing else []
  for page,_,_ in valid:
   if not any(s['url']==page['url'] for s in sources):sources.append({'name':'Gigabyte — spécifications officielles'+(' rév. '+page['revision'] if page.get('revision') else ''),'url':page['url'],'checkedAt':page['checkedAt'],'kind':'manufacturer'})
  groups=[]
  for page,_,_ in valid:
   rows=[{'label':LABELS.get(k,k),'value':v} for k,v in page['sections'].items()]
   rows.insert(0,{'label':'Modèle et révision de cette fiche','value':page['title']})
   groups.append({'title':'Gigabyte — caractéristiques officielles'+(' de la révision '+page['revision'] if page.get('revision') else ''),'rows':rows})
  notes=list(existing.get('notes',[])) if existing else []
  notes.append('Les caractéristiques et restrictions sont reproduites par révision officielle. Les emplacements M.2 Wi-Fi/Key E et SATA uniquement ne sont pas comptés comme emplacements NVMe.')
  if wanted is None:
   notes.append('L’archive ne précise pas la révision matérielle. Les fiches de révision disponibles restent distinctes ; seules les valeurs identiques entre les révisions collectées alimentent les métadonnées de compatibilité. Vérifier la révision imprimée sur le PCB avant achat.')
  else:notes.append('Révision indiquée par l’archive : '+wanted+'. La fiche constructeur doit couvrir explicitement cette révision.')
  previous_patch=dict(existing.get('patch',{})) if existing else {}
  for key in ['socket','memoryType','memorySlots','maxMemoryGB','maxMemoryPerSlotGB','memoryChannels','formFactor','heightMm','widthMm','m2Slots']:
   if key in previous_patch and key not in common_patch and len(valid)>1:previous_patch.pop(key,None)
  patch={**previous_patch,**common_patch,'manufacturerPartNumber':mpn,'detailLevel':'partial'}
  for key in set().union(*(set(patch) for _,patch,_ in valid))-set(common_patch):patch[key]='__EXPLICIT_UNDEFINED__'
  products[c['id']]={'mpn':mpn,'identityNote':'Modèle Gigabyte exact « '+name+' », confirmé dans les titres des fiches officielles. '+('Révision d’archive '+wanted+'.' if wanted else 'Aucune révision de PCB n’est déduite du nom générique.'),'sources':sources,'groups':groups,'patch':patch,'offers':existing.get('offers',[]) if existing else [],'notes':list(dict.fromkeys(notes)),'fieldEvidence':common_facts}
  photos[c['id']]=[{'url':url,'sourceURL':page['url'],'checkedAt':page['checkedAt'],'model':page['model'],'revision':page.get('revision'),'visuallyInspected':False} for page,_,_ in valid for url in page.get('imageURLs',[])]
  report.append({'id':c['id'],'name':c['name'],'status':'official_model_specifications','archiveRevision':wanted,'revisions':[p.get('revision') for p,_,_ in valid],'sourceURLs':[p['url'] for p,_,_ in valid],'sectionCounts':[len(p['sections']) for p,_,_ in valid],'commonPatchFields':list(common_patch),'commonEvidenceFields':list(common_facts),'revisionSensitiveFields':varying,'photoCount':len(photos[c['id']]),'rejections':rejections})
 out=ROOT/'src/data/deepGigabyteMotherboards.ts'
 out.write_text('// Generated by scripts/gigabyte-motherboard-deep.py from exact official model/revision pages.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const deepGigabyteMotherboardProducts:Record<string,VerifiedProduct> = '+json.dumps(products,ensure_ascii=False,indent=2).replace('"__EXPLICIT_UNDEFINED__"','undefined')+';\n')
 summary={'generatedAt':now(),'catalogueIDs':len(records),'confirmedModelIDs':len(products),'unconfirmedIDs':len(records)-len(products),'officialSpecificationPages':sum(p.get('status')=='official_specifications' for p in pages),'IDsWithPhotoURL':sum(bool(v) for v in photos.values()),'totalTechnicalSections':sum(sum(r.get('sectionCounts',[])) for r in report),'statusCounts':dict(Counter(r['status'] for r in report))}
 (DATA/'per-id.json').write_text(json.dumps({'summary':summary,'records':report},ensure_ascii=False,indent=2));(DATA/'photos.json').write_text(json.dumps(photos,ensure_ascii=False,indent=2));(DATA/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2));print(json.dumps(summary,indent=2))

def reparse_all():
 for file in PAGES.glob('*.json'):
  receipt=json.loads(file.read_text());rawfile=RAW/(file.stem+'.html.gz')
  if not rawfile.exists() or not receipt.get('url'):continue
  raw=gzip.open(rawfile,'rb').read()
  if hashlib.sha256(raw).hexdigest()!=receipt.get('sha256'):raise ValueError('Raw evidence hash mismatch: '+str(file))
  receipt.update(parse_page(raw,receipt['url']));file.write_text(json.dumps(receipt,ensure_ascii=False,indent=2))

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--fetch',action='store_true');parser.add_argument('--build',action='store_true');parser.add_argument('--reparse',action='store_true');args=parser.parse_args()
 records=json.loads((DATA/'input.json').read_text())
 if args.fetch:fetch_all(records)
 if args.reparse:reparse_all()
 if args.build or not args.fetch:build(records)
