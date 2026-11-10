"""Read public legacy Cooler Master product objects, not recommendation cards."""
import concurrent.futures,datetime,hashlib,json,re,urllib.request
from pathlib import Path
D=Path(__file__).resolve().parents[1]/'data/deep-review/power-chassis';S=D/'sources'
def fetch(url):
 key='cm-legacy-'+hashlib.sha1(url.encode()).hexdigest()[:12];p=S/(key+'.json')
 if p.exists():return key,'cached'
 e={'key':key,'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  r=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=35);raw=r.read();e.update(statusCode=r.status,resolvedURL=r.url,sha256=hashlib.sha256(raw).hexdigest());text=raw.decode();part=text.split('window.__remixContext = ')[1];ctx=json.JSONDecoder().raw_decode(part)[0]['state']['loaderData']['routes/$website.$'];c=ctx['story']['content'];rows=[]
  for block in c.get('specifications',[]):
   for row in block.get('specification',[]):
    rc=row.get('content',{});label=rc.get('specification_name',{}).get('content',{}).get('Label');v=rc.get('value')
    if label and v:rows.append({'label':label,'value':v})
  e.update(format='public-product-json',primaryText=c.get('name',ctx['story']['name']),productName=c.get('name',ctx['story']['name']),definitionPairs=rows,regionalSKUs=c.get('SKU',''),productSlug=ctx['slug'],tables=[],images=[{'url':x['filename'],'alt':x.get('alt',''),'inspection':'url_only'} for x in c.get('gallery',[]) if x.get('filename')],downloads=c.get('downloads',[]))
 except Exception as error:e['error']=str(error)
 p.write_text(json.dumps(e,ensure_ascii=False,indent=2));return key,len(e.get('definitionPairs',[])),e.get('error')
urls=json.loads((D/'coolermaster-legacy-candidates.json').read_text())['urls']
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 for r in pool.map(fetch,urls):print(*r,flush=True)
