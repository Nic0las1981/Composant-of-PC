"""Fetch discovered manufacturer specifications and preserve PDF table layout."""
import concurrent.futures, datetime, gzip, hashlib, json, subprocess
from pathlib import Path
from urllib.request import Request, urlopen

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data/deep-review/storage-west'
SOURCES=OUT/'sources'; SOURCES.mkdir(parents=True,exist_ok=True)
urls=json.loads((OUT/'discovered-sources.json').read_text())

def fetch(item):
    url,title=item
    key=hashlib.sha256(url.encode()).hexdigest()[:16]
    target=SOURCES/(key+'.json')
    if target.exists():
        old=json.loads(target.read_text())
        if not old.get('error'):return old
    result={'url':url,'title':title,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'key':key}
    try:
        response=urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=25)
        body=response.read();result['contentType']=response.headers.get('Content-Type','');result['resolvedURL']=response.url
        if body.startswith(b'%PDF'):
            pdf=SOURCES/(key+'.pdf');pdf.write_bytes(body)
            text=SOURCES/(key+'.txt');subprocess.run(['pdftotext','-layout',str(pdf),str(text)],check=True)
            result['text']=text.read_text();result['file']=str(pdf.relative_to(ROOT))
        else:
            html=SOURCES/(key+'.html.gz');html.write_bytes(gzip.compress(body));result['file']=str(html.relative_to(ROOT))
            result['length']=len(body)
    except Exception as error: result['error']=str(error)
    target.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    records=list(pool.map(fetch,urls.items()))
(OUT/'source-status.json').write_text(json.dumps([{k:v for k,v in r.items() if k!='text'} for r in records],ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'sources':len(records),'fetched':sum('error' not in r for r in records),'pdfs':sum('text' in r for r in records),'errors':[{k:r[k] for k in ['title','url','error']} for r in records if 'error' in r]},ensure_ascii=False))
