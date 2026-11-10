"""Read Corsair France's public sitemap and each PSU SKU's own technical table.
No cross-variant spec copying, region substitution or inferred offer is allowed.
"""
import concurrent.futures,datetime,hashlib,html,json,re,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/power-chassis';OUT.mkdir(parents=True,exist_ok=True)
def fetch(url):
 now=datetime.datetime.now(datetime.timezone.utc).isoformat()
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=35) as r:raw=r.read();meta={'url':url,'resolvedURL':r.url,'checkedAt':now,'statusCode':r.status,'sha256':hashlib.sha256(raw).hexdigest()}
  return meta,raw.decode('utf-8',errors='replace')
 except Exception as e:return {'url':url,'checkedAt':now,'error':str(e)},''
meta,s=fetch('https://www.corsair.com/fr-sitemap-products-1.xml')
urls=sorted(set(html.unescape(u) for u in re.findall(r'<loc>(.*?)</loc>',s) if '/p/psu/' in u));records={};sources=[]
def collect(url):
 source,s=fetch(url);out=[];m=re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',s,re.S)
 if not m:return source,out
 try:items=json.loads(m[1])['props']['pageProps']['productData']['productDetail']['items']
 except (KeyError,TypeError):return source,out
 for item in items:
  for p in [item]+[v['product'] for v in item.get('variants',[]) if v.get('product')]:
   if not p.get('sku') or not p.get('tech_specs'):continue
   out.append({'mpn':p['sku'],'name':p['name'],'url':'https://www.corsair.com/fr/fr/p/psu/'+p['sku'].lower()+'/'+p['url_key'],'rows':[{'label':r['code'],'value':str(r['value'])} for r in p['tech_specs'] if r.get('value') is not None],'images':[x['url'] for x in p.get('media_gallery',[]) if x.get('url')],'source':source,'selectedSKU':item['sku'],'skuSpecificTable':True})
 return source,out
remaining=urls
while remaining:
 batch=remaining[:12];remaining=remaining[12:]
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
  for src,result in ex.map(collect,batch):
   sources.append(src)
   for r in result:
    if r['mpn'] not in records or r['selectedSKU']==r['mpn']:records[r['mpn']]=r
 remaining=[u for u in remaining if u.split('/p/psu/')[1].split('/')[0].upper() not in records]
 (OUT/'corsair-psu-catalog.json').write_text(json.dumps({'sitemapSource':meta,'sitemapURLs':len(urls),'sources':sources,'records':list(records.values())},ensure_ascii=False,indent=2))
 print(json.dumps({'pages':len(sources),'SKUs':len(records),'remaining':len(remaining)}),flush=True)
