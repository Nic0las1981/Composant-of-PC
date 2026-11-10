"""Fetch public PSU manufacturer documents with compact, reproducible evidence."""
import asyncio,aiohttp,pathlib,json,sys,hashlib,datetime,gzip,re,subprocess,urllib.parse
from lxml import html
ROOT=pathlib.Path(__file__).resolve().parents[1]
async def main(folder,urls):
 D=ROOT/'data/deep-review'/folder/'sources';D.mkdir(parents=True,exist_ok=True);sem=asyncio.Semaphore(6)
 async with aiohttp.ClientSession(trust_env=True,timeout=aiohttp.ClientTimeout(total=35),headers={'User-Agent':'Mozilla/5.0'}) as session:
  async def get(url):
   key=hashlib.sha256(url.encode()).hexdigest()[:20];p=D/(key+'.json')
   if p.exists():return json.loads(p.read_text())
   r={'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
   try:
    async with sem,session.get(url) as response:
     b=await response.read();r.update(status=response.status,resolvedURL=str(response.url),sha256=hashlib.sha256(b).hexdigest(),bytes=len(b))
     if response.headers.get('Content-Type','').startswith('image/'):
      r.update(format='image',visuallyInspected=False,rawRetained=False);p.write_text(json.dumps(r,ensure_ascii=False,indent=2));return r
     raw=D/(key+'.raw.gz');gzip.open(raw,'wb').write(b);r['rawFile']=str(raw.relative_to(ROOT))
     if response.status==200:
      if b.startswith(b'%PDF'):r['format']='pdf';r['text']=subprocess.run(['pdftotext','-layout','-','-'],input=b,capture_output=True).stdout.decode(errors='replace')
      else:
       t=b.decode(errors='replace')
       try:r['json']=json.loads(t);r['format']='json'
       except json.JSONDecodeError:
        root=html.fromstring(b);r['format']='html';r['textSegments']=[s.strip() for s in root.itertext() if s.strip()];r['text']='\n'.join(r['textSegments']);r['links']=list({urllib.parse.urljoin(url,e.get('href')) for e in root.xpath('//a[@href]')});r['images']=[{'url':urllib.parse.urljoin(url,e.get('src')),'alt':e.get('alt','')} for e in root.xpath('//img[@src]')];r['tables']=[[[re.sub(r'\s+',' ',c.text_content()).strip() for c in tr.xpath('./th|./td')] for tr in tab.xpath('.//tr')] for tab in root.xpath('//table')]
   except Exception as e:r['error']=str(e)
   p.write_text(json.dumps(r,ensure_ascii=False,indent=2));return r
  for fut in asyncio.as_completed([get(u) for u in urls]):
   r=await fut;print(json.dumps({k:r.get(k) for k in ['url','status','format','bytes','error']}),flush=True)
if __name__=='__main__':asyncio.run(main(sys.argv[1],json.load(open(sys.argv[2]))))
