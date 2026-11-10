"""Independent ASUS/Gigabyte review. Root GPU parser and registries are read-only."""
import pathlib,json,gzip,re,collections,runpy,asyncio,copy,urllib.parse
ROOT=pathlib.Path(__file__).resolve().parents[1];BASE=ROOT/'data/deep-review/gpu';D=BASE/'board-brands';D.mkdir(exist_ok=True)
E=runpy.run_path(str(ROOT/'scripts/deep-gpu-extract.py'));H=E['H'];H.D=D
INPUT=[x for x in json.load(gzip.open(BASE/'input.json.gz','rt')) if x['component']['brand'] in ['ASUS','Gigabyte']]
BASE_REVIEW={x['id']:x for x in json.load(open(BASE/'review.json'))}
def sources():
 return [json.load(open(p)) for folder in [BASE/'sources',D/'sources'] for p in folder.glob('*.json')]
def discover():
 existing={x['requestedURL'] for x in sources() if x.get('requestedURL')};tasks=[]
 index=json.load(open(BASE/'sources/fb2653ebdf334dd2d970.json'));by=collections.defaultdict(list)
 for u in index['links']:
  if '/graphics-cards/graphics-cards/' in u and u.endswith('/spec/') and re.search('/(?:us|au|uk|ca-en|in)/',u):by[u.split('/')[-3]].append(u)
 for model,urls in by.items():
  urls.sort(key=lambda u:['us','uk','au','ca-en','in'].index(u.split('/')[3]))
  if not any(u in existing for u in urls):tasks.append({'brand':'ASUS','kind':'official_regional_sitemap_model','url':urls[0]})
 H.write_json(D/'rog-regional-models.json',{'indexURL':index['url'],'indexSHA256':index['sha256'],'models':by,'tasks':tasks})
 print('Native regional ASUS pages',len(tasks),flush=True);asyncio.run(H.fetch_batch(tasks))
def memory_type(s):
 m=re.search(r'\bGDDR\s*([3-7]X?)\b',s,re.I);return 'GDDR'+m[1].upper() if m else None
def canonical(name,cap,brand):
 s=name.lower().replace('™','').replace('®','')
 s=re.sub(r'\b(?:asus|gigabyte|geforce|radeon|graphics|video|card|edition|model)\b',' ',s)
 if brand=='ASUS':s=re.sub(r'\bgaming\b',' ',s)
 s=re.sub(r'\bgddr[3-7]x?\b',' ',s);s=re.sub(r'\b(?:[\d.]+ghz|[\d.]+mhz)\b',' ',s)
 if brand=='ASUS':
  s=re.sub(r'\bph(?=[ -])','phoenix',s)
  if 'strix' in s or 'matrix' in s:s=re.sub(r'\brog\b',' ',s)
  s=re.sub(r'\b((?:rtx|gtx)\s*\d+)tis\b',r'\1 ti super',s);s=re.sub(r'\b((?:rtx|gtx)\s*\d+)s\b',r'\1 super',s)
  s=re.sub(r'\b(?:o|a|t)?'+str(int(cap))+r'\s*g(?:b|d[3-7]x?)?\b',lambda m:' oc ' if m[0].startswith('o') else ' advanced ' if m[0].startswith('a') else ' top ' if m[0].startswith('t') else ' ',s)
 else:s=re.sub(r'\b'+str(int(cap))+r'\s*g(?:b|d[3-7]x?)?\b',' ',s)
 s=s.replace('overclocked','oc');s=re.sub(r'\brev\.?\s*([\d.]+)',' ',s)
 s=re.sub(r'\bdlss\s*\d+\b',' ',s)
 return sorted(re.findall(r'[a-z]+|\d+',s))
def expected(item):
 c=item['component'];o=item.get('original') or {};cap=o.get('memory',c.get('capacityGB'));name=o.get('name',c['name'].split(' · ')[0]);chip=o.get('chipset','')
 if not re.search(r'\b(?:RTX|GTX|GT|RX|R\d|HD|Arc)\s*\d+',name,re.I):name=chip+' '+name
 if c.get('finishName','').startswith('Blanc') and not re.search(r'white|snow|luna',name,re.I):name+=' WHITE'
 return name,cap
def parse_all():
 out=[]
 for s in sources():
  if s.get('brand') not in ['ASUS','Gigabyte']:continue
  try:r=E['parse'](s)
  except Exception:continue
  if not r and s['brand']=='ASUS' and s.get('status')==200 and re.search(r'/(?:techspec|spec)/?$',s['url']):
   t=s.get('text','');values=E['labelled'](t,E['LABELS']['ASUS'],start='Graphic Engine\n',stop=r'\n(?:Disclaimer|Products certified|Need Help\?)');model=re.split(r'\s*-\s*Tech Specs|[|｜]',t.splitlines()[0])[0].strip();cap=E['num'](values.get('Video Memory',''),r'^(\d+)\s*GB');dims=E['triples'](values.get('Dimensions','').split('Radiator')[0],'ASUS');patch={}
   if cap and len(values)>6 and re.search(r'(?:RTX|GTX|RX|GT)\s*\d',model,re.I):
    if dims and dims[0]>dims[1]>dims[2]:patch.update(lengthMm=dims[0],heightMm=dims[1],thicknessMm=dims[2])
    psu=E['num'](values.get('Recommended PSU',''),r'^(\d+)\s*W')
    if psu:patch['recommendedPsuW']=psu
    patch['capacityGB']=int(cap);r={'brand':'ASUS','model':model,'mpn':'','capacityGB':cap,'values':values,'patch':patch,'notes':['L’ancienne fiche ASUS n’a pas de ligne Model ; son titre officiel complet identifie le modèle. Aucun code commercial n’est déduit.'],'source':s}
  if r:
   if r['brand']=='ASUS':
    modelrow=re.search(r'\nModel\n([^\n]+)',s.get('text',''))
    if modelrow:r['model']=modelrow[1].strip();r['values']['Model']=r['model']
   out.append(r)
 H.write_json(D/'parsed.json',[{**r,'source':{k:v for k,v in r['source'].items() if k not in ['text','links']}} for r in out]);return out
def match(item,r,discovery=False):
 c=item['component'];o=item.get('original') or {};name,cap=expected(item)
 if not cap or cap!=r['capacityGB'] or c['brand']!=r['brand']:return False,'brand_or_capacity'
 want=canonical(name,cap,c['brand']);got=canonical(r['model'],cap,c['brand']);mt=memory_type(' '.join(r['values'].get(k,'') for k in ['Video Memory','Memory Type']))
 explicit=re.search(r'\bG([56])\b',o.get('chipset',''),re.I)
 if explicit:
  if mt!='GDDR'+explicit[1]:return False,'explicit_memory_type_mismatch'
  # G5/G6 in archive chipset and D5/D6 in product names explicitly denote VRAM type.
  want=canonical(re.sub(r'\bG[56]\b','',name),cap,c['brand'])
  if c['brand']=='Gigabyte':want=canonical(re.sub(r'\b[GD][56]\b','',name),cap,c['brand']);got=canonical(re.sub(r'\bD[56]\b','',r['model']),cap,c['brand'])
 if discovery:
  want=[x for x in want if x!='lhr']
  if 'white' in want and 'white' not in got:want.remove('white')
 if want!=got:return False,'full_variant_name_not_equal'
 return True,'exact_name_capacity_variant'
def collect_parents():
 parsed=parse_all();existing={x.get('requestedURL',x['url']) for x in sources()};tasks={}
 for item in INPUT:
  if BASE_REVIEW[item['component']['id']]['state']!='exact_reference_unconfirmed':continue
  for r in parsed:
   if not match(item,r,True)[0]:continue
   url=re.sub(r'/(?:techspec|spec|sp)/?$','/',r['source']['url'])
   if url not in existing:tasks[url]={'brand':r['brand'],'kind':'exact_candidate_product_features','url':url}
 for f in (D/'searches').glob('*.json'):
  d=json.load(open(f));t='\n'.join(x.get('text','') for x in d['result'].get('content',[]))
  for u in re.findall(r'^URL:\s*(\S+)',t,re.M):
   if u in existing:continue
   host=urllib.parse.urlparse(u).hostname or ''
   if host.endswith('asus.com') or (host=='cdn.cs.1worldsync.com' and u.endswith('.pdf')):tasks[u]={'brand':'ASUS','kind':'individual_search_primary_candidate','url':u}
 H.write_json(D/'parent-tasks.json',list(tasks.values()));print('Parent and search sources',len(tasks),flush=True);asyncio.run(H.fetch_batch(list(tasks.values())))
def inspect():
 parsed=parse_all();review=[]
 for item in INPUT:
  c=item['component'];matches=[]
  for r in parsed:
   ok,why=match(item,r)
   if ok:matches.append({'model':r['model'],'mpn':r['mpn'],'url':r['source']['url'],'values':r['values'],'patch':r['patch']})
  review.append({'id':c['id'],'brand':c['brand'],'name':c['name'],'original':item.get('original'),'baselineState':BASE_REVIEW[c['id']]['state'],'candidateMatches':matches})
 H.write_json(D/'candidate-review.json',review)
 print({b:dict(collections.Counter(('baseline_admitted' if r['baselineState']!='exact_reference_unconfirmed' else 'candidate_found' if r['candidateMatches'] else 'unmatched') for r in review if r['brand']==b)) for b in ['ASUS','Gigabyte']})
def build():
 parsed=parse_all();out=[];audit=[]
 assigned=set(json.loads((D/'assigned-integration-ids.json').read_text()))
 for item in INPUT:
  c=item['component'];o=item.get('original') or {};cid=c['id']
  if cid not in assigned:continue
  candidates=[r for r in parsed if match(item,r)[0]]
  if not candidates:continue
  # An explicit PCB revision must match the URL, never the shared title.
  rev=re.search(r'\brev\.?\s*([\d.]+)',o.get('name',''),re.I)
  if rev:
   candidates=[r for r in candidates if re.search(r'-rev-'+re.escape(rev[1].replace('.',''))+r'(?:/|$)',r['source']['url'],re.I)]
  if not candidates:continue
  codes={re.sub(r'\s+','',r['mpn']).lower() for r in candidates} if c['brand']=='Gigabyte' else {re.sub(r'/(?:us|uk|au|in|ca-en)/','/',r['source']['url']).split('/')[-3] for r in candidates}
  memory={memory_type(' '.join(r['values'].get(k,'') for k in ['Video Memory','Memory Type'])) for r in candidates}
  if len(codes)>1 or len(memory)>1:
   audit.append({'id':cid,'status':'distinct_codes_or_memory_variants','codes':sorted(codes)});continue
  if c['brand']=='Gigabyte' and not rev:
   known_urls={r['source']['url'].rstrip('/') for r in candidates}
   revision_links={u.rstrip('/') for r in candidates for u in r['source'].get('links',[]) if '/Graphics-Card/' in u and '/sp' in u and re.sub(r'-rev-\d+','',u).rstrip('/')==re.sub(r'-rev-\d+','',r['source']['url']).rstrip('/')}
   if revision_links-known_urls:
    audit.append({'id':cid,'status':'published_revision_not_fully_read','missingURLs':sorted(revision_links-known_urls)});continue
  # A corroborating archive measurement can reject identity, but cannot pick
  # a PCB revision. Common measurements are retained across all candidates.
  keys=set.intersection(*(set(r['patch']) for r in candidates))
  patch={k:candidates[0]['patch'][k] for k in keys if all(r['patch'][k]==candidates[0]['patch'][k] for r in candidates)}
  if o.get('length') and patch.get('lengthMm') and abs(o['length']-patch['lengthMm'])>2:
   audit.append({'id':cid,'status':'archive_dimension_conflict'});continue
  clock_text=' '.join(v for r in candidates for k,v in r['values'].items() if re.search('clock|boost',k,re.I))
  if o.get('boost_clock') and 'MHz' in clock_text and not re.search(r'(?<!\d)'+str(int(o['boost_clock']))+r'(?!\d)',clock_text):
   audit.append({'id':cid,'status':'archive_clock_conflict'});continue
  base=copy.deepcopy(max(candidates,key=lambda r:len(r['values'])))
  fields=set.intersection(*(set(r['values']) for r in candidates))
  base['values']={k:candidates[0]['values'][k] for k in fields if all(r['values'][k]==candidates[0]['values'][k] for r in candidates)}
  base['patch']=patch;base['source']={k:v for k,v in base['source'].items() if k not in ['text','links']}
  base['catalogIds']=[cid];base['reviewPipeline']='board-brands';base['mpn']='';base['identityKind']='manufacturer-model'
  base['imageSelectionAllowed']=c['brand']!='Gigabyte' or bool(rev)
  base['identityEvidence']={'method':'exact_model_and_documented_revision_intersection','archiveName':o.get('name'),'publishedModel':base['model'],'capacityGB':base['capacityGB'],'sourceURL':base['source']['url']}
  base['additionalSources']=[{'name':c['brand']+' — modèle et révision publiés','url':r['source']['url'],'checkedAt':r['source']['checkedAt'],'kind':'manufacturer'} for r in candidates]
  changed={k for r in candidates for k in r['patch'] if k not in patch};base['clearTypedFields']=sorted(changed)
  base['notes'].append('Identité de modèle confirmée. Seuls les champs identiques dans toutes les fiches/révisions consultées sont retenus ; aucun SKU commercial ni prix n’est attribué par déduction. Révision archivée : '+(rev[1] if rev else 'non précisée')+'.')
  if changed:base['notes'].append('Champs non uniformes entre les documents : '+', '.join(sorted(changed))+'.')
  out.append(base);audit.append({'id':cid,'status':'primary_model_intersection','sources':[s['url'] for s in base['additionalSources']],'clearTypedFields':sorted(changed)})
 H.write_json(BASE/'board-brand-model-facts.json',out);H.write_json(D/'integration-audit.json',audit)
 print({'integrated':len(out),'brands':dict(collections.Counter(r['brand'] for r in out))})
if __name__=='__main__':
 import sys
 if 'discover' in sys.argv:discover()
 if 'parents' in sys.argv:collect_parents()
 inspect()
 if 'build' in sys.argv:build()
