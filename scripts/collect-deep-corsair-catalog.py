"""Read Corsair's public product sitemap and server-rendered exact variant tables.
Variant tech_specs belong to each published SKU, never copied from the selected SKU.
No price from another market is imported. Cached responses preserve retrieval times.
"""
import concurrent.futures,gzip,html,json,re,runpy
from pathlib import Path
M=runpy.run_path(str(Path(__file__).with_name('collect-deep-memory-manufacturer-catalogs.py')));fetch=M['fetch'];OUT=M['OUT']
meta,s=fetch('https://www.corsair.com/us-sitemap-products-1.xml','catalog-pages')
urls=sorted(set(html.unescape(u) for u in re.findall(r'<loc>(.*?)</loc>',s) if '/p/memory/' in u or '/p/data-storage/' in u))
inputs=json.loads(gzip.decompress((OUT/'input.json.gz').read_bytes()));known={r['verified']['mpn'].lower() for r in inputs if r['component']['brand']=='Corsair' and r.get('verified')}
urls.sort(key=lambda u: (u.split('/p/')[1].split('/')[1] not in known,u))
seen={};sources=[];attempts=[]
def parse(pair):
 meta,s=pair;out=[]
 m=re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',s,re.S)
 if not m:return meta,out
 try:products=json.loads(m[1])['props']['pageProps']['productData']['productDetail']['items']
 except (KeyError,TypeError):return meta,out
 for item in products:
  for p in [item]+[v['product'] for v in item.get('variants',[]) if v.get('product')]:
   if not p.get('sku') or not p.get('tech_specs'):continue
   out.append({'mpn':p['sku'],'name':p['name'],'url':'https://www.corsair.com/us/en/p/'+('data-storage' if p['sku'].startswith('CSSD') else 'memory')+'/'+p['sku'].lower()+'/'+p['url_key'],'rows':[{'label':r['code'],'value':str(r['value'])} for r in p['tech_specs'] if r.get('value') is not None],'images':[x['url'] for x in p.get('media_gallery',[]) if x.get('url')],'source':meta,'selectedSKU':item['sku']})
 return meta,out
remaining=urls
while remaining:
 batch=remaining[:12];remaining=remaining[12:]
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
  for source,records in ex.map(lambda u:parse(fetch(u,'corsair-pages')),batch):
   sources.append(source);attempts.append(source['url'])
   for r in records:
    # The selected product's authoritative table supersedes a variant projection.
    if r['mpn'] not in seen or r['mpn']==r['selectedSKU']:seen[r['mpn']]=r
 remaining=[u for u in remaining if u.split('/p/')[1].split('/')[1].upper() not in seen]
 (OUT/'corsair-catalog.json').write_text(json.dumps({'sitemapSource':meta,'sitemapProductURLs':len(urls),'sources':sources,'records':list(seen.values())},ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'corsairPages':len(sources),'publishedSKUs':len(seen),'remainingPages':len(remaining),'errors':sum(bool(x.get('error')) for x in sources)}),flush=True)
