"""Recover archived Corsair own-SKU tables from official search discoveries.
A candidate EU route must return a real EU SKU object; URL substitution alone
never validates a region or copies a neighbouring SKU's specifications.
"""
import concurrent.futures,datetime,hashlib,json,re,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-chassis';urls=set()
for p in D.glob('search-corsair-*.json'):
 for u in json.loads(p.read_text())['urls']:
  m=re.search(r'/p/psu/(cp-\d+-(?:na|ww|uk|eu|au|cn|jp))/(.+)',u,re.I)
  if not m or 'corsair.com/' not in u:continue
  urls.add(u)
  code=re.sub(r'-(?:na|ww|uk|eu|au|cn|jp)$','-eu',m[1],flags=re.I);slug=re.sub(r'cp-\d+-(?:na|ww|uk|eu|au|cn|jp)',code,m[2],flags=re.I);urls.add('https://www.corsair.com/fr/fr/p/psu/'+code+'/'+slug)
def get(u):
 src={'url':u,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()};out=[]
 try:
  with urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=35) as r:b=r.read();src.update(statusCode=r.status,resolvedURL=r.url,sha256=hashlib.sha256(b).hexdigest())
  mt=re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',b.decode(errors='replace'),re.S)
  if not mt:return src,out
  items=json.loads(mt[1])['props']['pageProps']['productData']['productDetail']['items']
  for item in items:
   for p in [item]+[v['product'] for v in item.get('variants',[]) if v.get('product')]:
    if not p.get('sku') or not p.get('tech_specs'):continue
    out.append({'mpn':p['sku'],'name':p['name'],'url':u,'rows':[{'label':r['code'],'value':str(r['value'])} for r in p['tech_specs'] if r.get('value') is not None],'images':[x['url'] for x in p.get('media_gallery',[]) if x.get('url')],'source':src,'selectedSKU':item['sku'],'skuSpecificTable':True})
 except Exception as e:src['error']=str(e)
 return src,out
records={};sources=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
 for src,rs in ex.map(get,sorted(urls)):
  sources.append(src)
  for r in rs:
   if r['mpn'] not in records or r['selectedSKU']==r['mpn']:records[r['mpn']]=r
  print(src['url'],src.get('statusCode'),len(rs),src.get('error'),flush=True)
(D/'corsair-psu-legacy-catalog.json').write_text(json.dumps({'sources':sources,'records':list(records.values())},ensure_ascii=False,indent=2))
