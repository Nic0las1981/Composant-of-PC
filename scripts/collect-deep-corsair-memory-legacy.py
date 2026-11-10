"""Extend the RAM index from every exact official memory URL found in saved searches.
Each variant supplies its own tech_specs; selected records supersede projections.
"""
from pathlib import Path
import concurrent.futures,gzip,html,json,re,runpy
M=runpy.run_path(str(Path(__file__).with_name('collect-deep-memory-manufacturer-catalogs.py')));OUT=M['OUT'];ROOT=M['ROOT'];urls=set()
for path in OUT.glob('*corsair*search*.json'):
 d=json.loads(path.read_text());response=d.get('response',d.get('result',{}));text='\n'.join(x.get('text','') for x in response.get('content',[]))
 for u in re.findall(r'^URL: (\S+)',text,re.M):
  if 'corsair.com/' in u and '/p/memory/' in u:urls.add(html.unescape(u))
old=json.loads((OUT/'corsair-catalog.json').read_text());records={r['mpn']:r for r in old['records']}
def get(u):
 meta,s=M['fetch'](u,'corsair-pages');out=[]
 m=re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',s,re.S)
 if not m:return meta,out
 try:items=json.loads(m[1])['props']['pageProps']['productData']['productDetail']['items']
 except (KeyError,TypeError):return meta,out
 for item in items:
  for p in [item]+[v['product'] for v in item.get('variants',[]) if v.get('product')]:
   if not p.get('sku') or not p.get('tech_specs'):continue
   out.append({'mpn':p['sku'],'name':p['name'],'url':u,'rows':[{'label':x['code'],'value':str(x['value'])} for x in p['tech_specs'] if x.get('value') is not None],'images':[x['url'] for x in p.get('media_gallery',[]) if x.get('url')],'source':meta,'selectedSKU':item['sku']})
 return meta,out
audit=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for i,(meta,rs) in enumerate(pool.map(get,sorted(urls)),1):
  audit.append(dict(meta,publishedSKUs=[x['mpn'] for x in rs]))
  for r in rs:
   if r['mpn'] not in records or r['mpn']==r['selectedSKU']:records[r['mpn']]=r
  if i%20==0:print('pages',i,'indexed SKUs',len(records),flush=True)
old['records']=list(records.values());old['legacySearchSources']=audit
(OUT/'corsair-catalog.json').write_text(json.dumps(old,ensure_ascii=False,indent=2)+'\n');(OUT/'corsair-memory-legacy-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n');print('finished',len(audit),len(records),flush=True)
