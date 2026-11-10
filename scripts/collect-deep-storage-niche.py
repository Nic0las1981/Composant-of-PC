"""Retain first-party pages/PDF text for each small-brand SSD reference."""
from pathlib import Path
import concurrent.futures,gzip,hashlib,html,json,re,subprocess,tempfile,urllib.request,urllib.parse
from datetime import datetime,timezone
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data/deep-review/storage-niche';CACHE=OUT/'sources';CACHE.mkdir(parents=True,exist_ok=True)
def clean(value):return html.unescape(re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',value))).strip()
def fetch(url):
    key=hashlib.sha256(url.encode()).hexdigest()[:20];meta=CACHE/(key+'.json');raw=CACHE/(key+'.html.gz')
    if meta.exists() and raw.exists():return json.loads(meta.read_text()),gzip.decompress(raw.read_bytes())
    try:
        with urllib.request.urlopen(urllib.request.Request(url,headers={'Accept':'text/html,application/pdf'}),timeout=35) as r:
            body=r.read();record={'url':url,'finalURL':r.url,'status':r.status,'checkedAt':datetime.now(timezone.utc).isoformat(),'sha256':hashlib.sha256(body).hexdigest(),'bytes':len(body),'contentType':r.headers.get('Content-Type','')}
        raw.write_bytes(gzip.compress(body))
        if body.startswith(b'%PDF'):
            with tempfile.NamedTemporaryFile(suffix='.pdf') as f:
                f.write(body);f.flush();record['text']=subprocess.check_output(['pdftotext','-layout',f.name,'-'],text=True)
        else:
            text=body.decode('utf8','replace');record['text']=clean(re.sub(r'<(script|style)[\s\S]*?</\1>','',text,flags=re.I))
            record['links']=list(dict.fromkeys(urllib.parse.urljoin(r.url,html.unescape(u)) for u in re.findall(r'(?:href|src)=["\']([^"\']+)["\']',text,re.I)))
        meta.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n');return record,body
    except Exception as e:
        record={'url':url,'checkedAt':datetime.now(timezone.utc).isoformat(),'error':str(e)};meta.write_text(json.dumps(record,indent=2));return record,b''
def run():
    seeds=[]
    for path in OUT.glob('exa-discovery-*.json'):
        for url in json.loads(path.read_text())['urls']:
            if urllib.parse.urlparse(url).hostname in ['mushkin.com','www.mushkin.com','www.goodram.com','www.apacer.com','www.microcenter.com']:seeds.append(url)
    seeds+=['https://mushkin.com/sitemap_index.xml','https://mushkin.com/product-sitemap.xml','https://mushkin.com/shop/?product-page=35','https://www.goodram.com/en/products/','https://www.apacer.com/en/product/personal-product/detail/personal_ssd/as2280q4u']
    pages=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for meta,body in pool.map(fetch,seeds):
            pages.append(meta)
            print(meta['url'],meta.get('status',meta.get('error')),flush=True)
    mushkin=set()
    for meta in pages:
        if 'mushkin.com' not in meta['url']:continue
        mushkin.update(u for u in meta.get('links',[]) if '/product/' in u and any(t in u.lower() for t in ['vortex','gamma','delta','helix','mknssded','enhanced-deluxe']))
        if 'sitemap' in meta['url']:
            _,body=fetch(meta['url']);mushkin.update(html.unescape(u) for u in re.findall(r'<loc>(.*?)</loc>',body.decode('utf8','replace')) if '/product/' in u and any(t in u.lower() for t in ['vortex','gamma','delta','helix','mknssded','enhanced-deluxe']))
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for meta,body in pool.map(fetch,sorted(mushkin)):pages.append(meta)
    (OUT/'source-index.json').write_text(json.dumps([{'url':p['url'],'sha256':p.get('sha256'),'status':p.get('status'),'error':p.get('error')} for p in pages],indent=2))
    print('Retained',len(pages),'primary pages',flush=True)
if __name__=='__main__':run()
