import concurrent.futures,gzip,hashlib,json,pathlib,re,subprocess,os
import requests
from bs4 import BeautifulSoup
ROOT=pathlib.Path(__file__).resolve().parents[1];P=ROOT/'data/deep-review/storage-other/proofs';O=P/'image-tables';O.mkdir(exist_ok=True)
os.environ['OMP_THREAD_LIMIT']='1'
jobs={}
for p in P.glob('*.json'):
 if p.stem.startswith('exa'):continue
 d=json.loads(p.read_text());u=d.get('url','')
 if not ('sabrent.com/products/' in u and not any(x in u for x in ['pshs','htss'])):continue
 htmlfile=P/(p.stem+'.html.gz')
 if not htmlfile.exists():continue
 soup=BeautifulSoup(gzip.open(htmlfile,'rt').read(),'html.parser')
 for im in soup.select('img[src]'):
  src=im['src']
  if 'width=3840' not in src or '.svg' in src:continue
  src=('https:'+src if src.startswith('//') else src).replace('width=3840','width=1600')
  if src not in jobs:jobs[src]={'url':src,'productURLs':[]}
  jobs[src]['productURLs'].append(u)
def run(job):
 url=job['url'];key=hashlib.sha256(url.encode()).hexdigest()[:16];j=O/(key+'.json')
 if j.exists():return
 try:
  r=requests.get(url,timeout=30);r.raise_for_status();im=O/(key+'.jpg');im.write_bytes(r.content)
  subprocess.run(['tesseract',str(im),str(O/key)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,check=True,timeout=40)
  job['text']=(O/(key+'.txt')).read_text();job['checkedAt']='2026-11-10';job['localImage']=str(im.relative_to(ROOT));job['sha256']=hashlib.sha256(r.content).hexdigest()
  j.write_text(json.dumps(job,ensure_ascii=False,indent=2))
 except Exception as e:print(url,str(e),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:list(ex.map(run,jobs.values()))
print('Images',len(jobs))
