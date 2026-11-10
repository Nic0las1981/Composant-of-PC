"""Reproducible GPU primary-source index and matching workflow.

Only public manufacturer documents are indexed. Source retrieval, exact identity
matching and accepted technical facts are separate records. No price, variant,
revision, material, fan size or electrical consumption is inferred from a family.
"""
import argparse, asyncio, collections, datetime, gzip, hashlib, html, json, pathlib, re, ssl, urllib.parse, runpy, subprocess
import aiohttp
ROOT=pathlib.Path(__file__).resolve().parents[1]
D=ROOT/'data/deep-review/gpu';D.mkdir(parents=True,exist_ok=True)
H=runpy.run_path(str(ROOT/'scripts/collect-catalog-review.py'))
INPUT=D/'input.json.gz'
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z')
def key(url):return hashlib.sha256(url.encode()).hexdigest()[:20]
def text(body):return H['text'](body)
def norm(s):return re.sub(r'[^a-z0-9]','',str(s).lower())
def write_json(path,obj):
 path.parent.mkdir(parents=True,exist_ok=True);temporary=path.with_suffix(path.suffix+'.tmp');temporary.write_text(json.dumps(obj,ensure_ascii=False,indent=2));temporary.replace(path)
def read_gz(path):return gzip.open(path,'rt').read()
def urls_from(body,url):
 links=re.findall(r'<loc>\s*(.*?)\s*</loc>',body,re.S|re.I)+re.findall(r'(?:href|src)=["\']([^"\']+)["\']',body,re.I)
 return sorted(set(urllib.parse.urljoin(url,html.unescape(u.strip())) for u in links if not u.startswith(('javascript:','mailto:','#'))))
async def fetch_batch(tasks,overwrite=False):
 semaphore=asyncio.Semaphore(8);hostlimits=collections.defaultdict(lambda:asyncio.Semaphore(2));result=[]
 async with aiohttp.ClientSession(trust_env=True,timeout=aiohttp.ClientTimeout(total=35),headers={'User-Agent':'Mozilla/5.0'}) as session:
  async def fetch(task):
   url=task['url'];p=D/'sources'/(key(url)+'.json');rawpath=D/'sources'/(key(url)+'.html.gz')
   if p.exists() and not overwrite:return json.loads(p.read_text())
   base={**task,'checkedAt':now(),'requestedURL':url,'contentFile':str(rawpath.relative_to(ROOT))}
   try:
    async with semaphore,hostlimits[urllib.parse.urlparse(url).netloc],session.get(url) as response:
     b=await response.read();limit=40000000 if 'sitemap' in url else 8000000;base['contentTruncated']=len(b)>limit;b=b[:limit];base.update(status=response.status,url=str(response.url),contentType=response.headers.get('Content-Type'),sha256=hashlib.sha256(b).hexdigest(),bytes=len(b))
     if response.status==200:
      if b.startswith(b'%PDF'):
       converted=subprocess.run(['pdftotext','-layout','-','-'],input=b,capture_output=True);base['text']=converted.stdout.decode(errors='replace');base['links']=[];base['documentFormat']='pdf'
      else:
       raw=b.decode(errors='replace');base['links']=urls_from(raw,str(response.url));base['text']=text(raw) if '<' in raw else raw
      with gzip.open(rawpath,'wb') as target:target.write(b)
     else:base['failure']='http_'+str(response.status)
   except Exception as e:base['failure']=type(e).__name__+': '+str(e)[:150]
   write_json(p,base);return base
  for n,coro in enumerate(asyncio.as_completed([fetch(t) for t in tasks]),1):
   result.append(await coro)
   if n%50==0 or n==len(tasks):print(json.dumps({'completed':n,'total':len(tasks),'success':sum(r.get('status')==200 for r in result)}),flush=True)
 return result
SEEDS={
 'ASUS':['https://www.asus.com/robots.txt','https://www.asus.com/sitemap.xml','https://rog.asus.com/robots.txt','https://rog.asus.com/sitemap.xml','https://www.asus.com/motherboards-components/graphics-cards/all-series/'],
 'MSI':['https://www.msi.com/robots.txt','https://www.msi.com/sitemap.xml','https://www.msi.com/Graphics-Cards/Products'],
 'Gigabyte':['https://www.gigabyte.com/robots.txt','https://www.gigabyte.com/sitemap.xml','https://www.gigabyte.com/Graphics-Card'],
 'Zotac':['https://www.zotac.com/robots.txt','https://www.zotac.com/sitemap.xml','https://www.zotac.com/graphics-cards'],
 'PNY':['https://www.pny.com/sitemap.xml','https://www.pny.com/robots.txt'],
 'Inno3D':['https://www.inno3d.com/sitemap.xml','https://www.inno3d.com/robots.txt','https://www.inno3d.com/en/products'],
 'XFX':['https://www.xfxforce.com/robots.txt','https://www.xfxforce.com/gpu/amd-radeon-rx-9060','https://www.xfxforce.com/gpu/amd-radeon-rx-9070','https://www.xfxforce.com/gpu/amd-radeon-rx-7000','https://www.xfxforce.com/gpu/amd-radeon-rx-6000','https://www.xfxforce.com/gpu/amd-radeon-rx-5000','https://www.xfxforce.com/gpu/amd-radeon-rx-500'],
 'Palit':['https://www.palit.com/robots.txt','https://www.palit.com/sitemap.xml','https://www.palit.com/palit/vga.php?lang=en'],
 'Gainward':['https://www.gainward.com/robots.txt','https://www.gainward.com/sitemap.xml','https://www.gainward.com/main/vga.php?lang=en'],
 'Sapphire':['https://www.sapphiretech.com/sitemap.xml','https://www.sapphiretech.com/en/consumer','https://www.sapphiretech.com/robots.txt'],
 'PowerColor':['https://www.powercolor.com/robots.txt','https://www.powercolor.com/sitemap.xml','https://www.powercolor.com/product'],
 'ASRock':['https://www.asrock.com/Graphics-Card/index.asp'],
 'Sparkle':['https://www.sparkle.com.tw/robots.txt','https://www.sparkle.com.tw/sitemap.xml','https://www.sparkle.com.tw/en/products'],
 'Acer':['https://store.acer.com/en-us/acer-products/graphics-cards'],
 'AMD':['https://www.amd.com/en/products/graphics/desktops/radeon.html'],
 'Intel':['https://www.intel.com/content/www/us/en/products/details/discrete-gpus/arc.html'],
 'NVIDIA':['https://www.nvidia.com/en-us/geforce/graphics-cards/']}
async def main(args):
 if args.command=='seed':
  originals={c['id']:c for c in json.load(gzip.open(ROOT/'data/full-review/input.json.gz','rt'))};current=json.load(open('/tmp/deep-gpu-current.json'))
  inp=[{**r,'original':originals.get(r['component']['id'],{}).get('originalRecord')} for r in current]
  with gzip.open(INPUT,'wt') as f:json.dump(inp,f,ensure_ascii=False)
  rows=await fetch_batch([{'brand':brand,'url':url,'kind':'index'} for brand,urls in SEEDS.items() for url in urls]);write_json(D/'indexes/seed-results.json',[{k:r.get(k) for k in ['brand','requestedURL','url','status','failure','contentFile']} for r in rows])
 elif args.command=='fetch':
  tasks=json.load(open(args.tasks));await fetch_batch(tasks,args.overwrite)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('command',choices=['seed','fetch']);p.add_argument('--tasks');p.add_argument('--overwrite',action='store_true');asyncio.run(main(p.parse_args()))
