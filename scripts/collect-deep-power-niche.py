"""Collect native first-party documents; fetched extracts remain reproducible."""
import importlib.util,json,re,concurrent.futures,html
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('collector',ROOT/'scripts/collect-deep-storage-niche.py')
collector=importlib.util.module_from_spec(spec);spec.loader.exec_module(collector)
collector.OUT=ROOT/'data/deep-review/power-niche';collector.CACHE=collector.OUT/'sources';collector.CACHE.mkdir(parents=True,exist_ok=True)
urls=[]
for name in ['search-xpg-old.json','search-montech-all.json']:
 d=json.loads((ROOT/'data/deep-review/power-chassis'/name).read_text())
 urls.extend(html.unescape(u) for u in re.findall(r'^URL: (.+)',d['text'],re.M) if any(h in u for h in ['webapi3.adata.com','montechpc.com','telon.com.tw']))
for family in ['xpg_core_reactor','xpg_pylon','xpg_kyber','xpg_cybercore','xpg_fusion_1600','core_reactor','cybercore','pylon','kyber']:
 urls.append('https://webapi3.adata.com/storage/downloadfile/'+family+'_datasheet.pdf')
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(5) as pool:
  for d,_ in pool.map(collector.fetch,dict.fromkeys(urls)):print(d['url'],d.get('status',d.get('error')),flush=True)
