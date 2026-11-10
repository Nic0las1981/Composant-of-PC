"""Fetch every exact ASUS catalogue model from the official public product sitemaps."""
import runpy,json,gzip,re,concurrent.futures,pathlib,collections,sys
C=runpy.run_path(str(pathlib.Path(__file__).with_name('deep-motherboard-core.py')));globals().update({k:v for k,v in C.items() if not k.startswith('__')})
D=DATA/'asus';D.mkdir(parents=True,exist_ok=True)
def maps():
 entries=json.loads((D/'sitemaps.json').read_text());urls=[u for e in entries for u in e.get('urls',[])]
 r,s=fetch('https://rog.asus.com/sitemap/product1.xml',D/'rog-products')
 urls.extend(re.findall(r'<loc>(.*?)</loc>',s))
 mapping={}
 for u in urls:
  if '/motherboards/' not in u:continue
  path=urllib.parse.urlparse(u).path.strip('/').split('/')
  if 'rog.asus.com' in u:
   i=path.index('motherboards');slug=path[i+2] if len(path)>i+2 else ''
   base='https://rog.asus.com/'+('/'.join(path[:i+3]))+'/spec/'
   name=slug.removesuffix('-model')
  else:
   i=path.index('motherboards');slug=path[i+2] if len(path)>i+2 else ''
   if not slug:continue
   base='https://www.asus.com/'+('/'.join(path[:i+3]))+'/techspec/';name=slug
  key=norm(name);mapping.setdefault(key,[])
  if base not in mapping[key]:mapping[key].append(base)
 (D/'url-index.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2));return mapping
INPUT=json.load(gzip.open(DATA/'input.json.gz','rt'));ITEMS=[x for x in INPUT if x['component']['brand']=='ASUS'];MAP=maps()
EXTRA=json.loads((D/'extra-urls.json').read_text()) if (D/'extra-urls.json').exists() else {}
def exact_model(actual,expected):
 if norm(actual)==norm(expected):return True
 if expected.lower().startswith(('crosshair','strix ')) and norm(actual)==norm('ROG '+expected):return True
 return expected=='MAXIMUS Z690 HERO EVA' and actual.upper()=='ROG MAXIMUS Z690 HERO EVA EDITION'
def collect(item):
 c=item['component'];id=c['id'];urls=list(MAP.get(norm(c['name']),[]));
 urls.extend(u for u in EXTRA.get(id,[]) if '/motherboards/' in u and ('/spec/' in u or '/techspec/' in u or '/specifications/' in u))
 if not urls and c['name'].lower().startswith('crosshair'):urls=list(MAP.get(norm('ROG '+c['name']),[]))
 if not urls and ('rog ' in c['name'].lower() or c['name'].lower().startswith('crosshair')):
  name=c['name'] if c['name'].lower().startswith('rog ') else 'ROG '+c['name'];slug=re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-');family='-'.join(slug.split('-')[:2]);urls=['https://rog.asus.com/motherboards/'+family+'/'+slug+'/spec/']
 # Current ROG pages and legacy -model URLs coexist; validate the returned Model each time.
 for u in list(urls):
  if 'rog.asus.com' in u and '-model/' in u:urls.extend([u.replace('-model/','/'),u.replace('https://rog.asus.com/','https://rog.asus.com/us/')])
  elif 'rog.asus.com' in u:urls.extend([u.replace('/spec/','-model/spec/'),u.replace('https://rog.asus.com/','https://rog.asus.com/us/')])
  elif '/us/' not in u:
   urls.append(u.replace('https://www.asus.com/','https://www.asus.com/us/'))
   if id in EXTRA:urls.extend([u.replace('https://www.asus.com/','https://www.asus.com/uk/'),u.replace('https://www.asus.com/','https://www.asus.com/ca-en/')])
 urls=list(dict.fromkeys(urls))
 attempts=[];result=None;state='no_exact_sitemap_model'
 for n,url in enumerate(urls):
  meta,s=fetch(url,D/'pages'/f'{id}-{n}');attempts.append(meta)
  if meta['status']!='fetched':state=meta['status'];continue
  rows,model,title,images=asus_rows(s)
  if not exact_model(model,c['name']):state='exact_model_not_confirmed';continue
  if not rows.get('CPU') or not rows.get('Memory'):state='technical_table_missing';continue
  primary={'name':'ASUS — fiche technique officielle','url':meta['resolvedURL'],'checkedAt':meta['checkedAt'],'kind':'manufacturer'}
  result=make_product(c,item['review'],rows,primary,images)
  result['manufacturerModel']=model
  # A different socket or DDR generation is an identity concern, not an automatic archive correction.
  if any(c.get(k) and result['patch'].get(k) and c[k]!=result['patch'][k] for k in ('socket','memoryType')):
   state='archive_socket_or_ddr_conflict';result=None;continue
  state='exact_manufacturer_table';break
 record={'id':id,'name':c['name'],'state':state,'attempts':attempts,'manufacturerModel':model if result else None,'photos':images if result else [],'sections':list(rows) if result else [],'documentedFields':list(result.get('fieldEvidence',{})) if result else []}
 (D/'records').mkdir(exist_ok=True);(D/'records'/(id+'.json')).write_text(json.dumps({'review':record,'product':result},ensure_ascii=False,indent=2));return record,result
out={};reviews=[];counts=collections.Counter()
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
 for i,(review,product) in enumerate(pool.map(collect,ITEMS),1):
  reviews.append(review);counts[review['state']]+=1
  if product:out[review['id']]=product
  if i%25==0 or i==len(ITEMS):print(i,len(ITEMS),dict(counts),flush=True)
(D/'review.json').write_text(json.dumps({'checkedAt':now(),'summary':dict(counts),'records':reviews},ensure_ascii=False,indent=2))
(ROOT/'src/data/deepAsusMotherboards.ts').write_text('// Generated by scripts/asus-motherboard-deep.py from exact official ASUS pages.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const deepAsusMotherboardProducts:Record<string,VerifiedProduct> = '+json.dumps(out,ensure_ascii=False,indent=2)+';\n')
print('CONFIRMED',len(out))
