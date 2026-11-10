"""Public manufacturer indexes only: no search snippets become product facts."""
import concurrent.futures,datetime,hashlib,html,json,re,urllib.parse,urllib.request
from pathlib import Path
from lxml import html as lhtml
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/power-chassis'
def get(u):
 now=datetime.datetime.now(datetime.timezone.utc).isoformat()
 try:
  with urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=35) as r:b=r.read();return {'url':u,'checkedAt':now,'statusCode':r.status,'sha256':hashlib.sha256(b).hexdigest()},b.decode('utf-8',errors='replace')
 except Exception as e:return {'url':u,'checkedAt':now,'error':str(e)},''
def shopify(domain):
 records=[];sources=[]
 for page in range(1,16):
  meta,s=get('https://'+domain+'/products.json?limit=250&page='+str(page));sources.append(meta)
  try:products=json.loads(s)['products']
  except (ValueError,KeyError):break
  for p in products:
   if p.get('product_type','').lower() not in ['power supply','power supplies'] and not re.search(r'toughpower|smart (?:bm|bx|rgb|pro|se|series)|litepower|gf[123a]',p['title'],re.I):continue
   root=lhtml.fromstring(p.get('body_html') or '<div/>')
   records.append({'name':p['title'],'handle':p['handle'],'url':'https://'+domain+'/products/'+p['handle'],'type':p.get('product_type'),'variants':[{'sku':v.get('sku'),'title':v.get('title')} for v in p['variants']],'tables':[[[' '.join(td.text_content().split()) for td in tr.xpath('./th|./td')] for tr in t.xpath('.//tr')] for t in root.xpath('//table')],'primaryText':'\n'.join(t.strip() for t in root.itertext() if t.strip()),'images':[i['src'] for i in p.get('images',[])],'source':meta})
  if len(products)<250:break
 (OUT/(domain.replace('.','-')+'-psu-index.json')).write_text(json.dumps({'sources':sources,'records':records},ensure_ascii=False,indent=2));return domain,len(records)
def cm():
 meta,s=get('https://www.coolermaster.com/en-global/sitemap_0-product.xml');urls=[html.unescape(u) for u in re.findall(r'<loc>(.*?)</loc>',s)]
 terms=r'mwe|v[56789]\d{2}|v1[0-9]{3}|v-sfx|sfx-gold|sfx-platinum|gx.*\d{2}|g[56789]\d{2}|g1\d{3}|elite.*\d{2}|silent-pro|real-power|masterwatt|thunder|b[5678]\d{2}|extreme-power|x-silent'
 matched=[u for u in urls if re.search(terms,u,re.I)]
 (OUT/'coolermaster-index.json').write_text(json.dumps({'source':meta,'totalURLs':len(urls),'candidateURLs':matched},indent=2));return 'Cooler Master',len(matched)
def bq():
 u='https://www.bequiet.com/en/powersupply';meta,s=get(u);r=lhtml.fromstring(s);pairs=[]
 for e in r.xpath('//a[@href]'):
  dest=urllib.parse.urljoin(u,e.get('href'))
  if re.fullmatch(r'https://www.bequiet.com/en/powersupply/\d+',dest):pairs.append({'url':dest,'label':' '.join(e.text_content().split())})
 (OUT/'bequiet-index.json').write_text(json.dumps({'source':meta,'products':list({a['url']:a for a in pairs}.values())},indent=2));return 'be quiet!',len({a['url'] for a in pairs})
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
 for r in ex.map(lambda f:f(),[lambda:shopify('thermaltakeusa.com'),lambda:shopify('thermaltake.com'),cm,bq]):print(*r,flush=True)
