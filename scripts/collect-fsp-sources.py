"""Capture discovered historical FSP sources into this task's own evidence directory."""
import pathlib,json,importlib.util,hashlib,concurrent.futures,urllib.request,urllib.parse,gzip,re
from lxml import html
ROOT=pathlib.Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-fsp';spec=importlib.util.spec_from_file_location('fsp_source_collector',ROOT/'scripts/collect-deep-power-chassis.py');C=importlib.util.module_from_spec(spec);spec.loader.exec_module(C);C.OUT=D
URLS=list(dict.fromkeys(u for arr in json.loads((D/'candidate-urls.json').read_text()).values() for u in arr))
def get(url):
 key=hashlib.sha256(url.encode()).hexdigest()[:20];p=D/'sources'/(key+'.json')
 if p.exists():return json.loads(p.read_text())
 C.collect(key,url);return json.loads(p.read_text())
def main():
 pages=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
  for d in pool.map(get,URLS):pages.append(d);print(d['url'],d.get('statusCode'),flush=True)
 # Legacy list provides links to precisely named older products not in the new menu.
 candidates=[]
 for d in pages:
  if 'LegacyProducts' not in d['url']:continue
  try:
   req=urllib.request.Request(d['url'],headers={'User-Agent':'Mozilla/5.0'})
   with urllib.request.urlopen(req,timeout=35) as response:body=response.read()
   tree=html.fromstring(body);links=[{'name':' '.join(a.text_content().split()),'url':urllib.parse.urljoin(d['url'],a.get('href'))} for a in tree.xpath('//a[@href]') if '/product/' in a.get('href','') or '/PROP' in a.get('href','')];candidates+=links
  except Exception:pass
 (D/'legacy-links.json').write_text(json.dumps(candidates,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
