#!/usr/bin/env python3
"""Preserve public manufacturer evidence; never synthesizes hardware values."""
import concurrent.futures, gzip, hashlib, json, pathlib, re, subprocess, sys
import requests
from bs4 import BeautifulSoup

ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/'data/deep-review/storage-other'
BASE.mkdir(exist_ok=True,parents=True)
PROOFS=BASE/'proofs'
PROOFS.mkdir(exist_ok=True)

def fetch(url):
    key=hashlib.sha256(url.encode()).hexdigest()[:16]
    target=PROOFS/(key+'.json')
    if target.exists(): return json.loads(target.read_text())
    out={'url':url,'checkedAt':'2026-11-10','key':key}
    try:
        r=requests.get(url,timeout=40,headers={'User-Agent':'Mozilla/5.0'})
        out.update(status=r.status_code,finalURL=r.url,contentType=r.headers.get('Content-Type',''),sha256=hashlib.sha256(r.content).hexdigest())
        if r.content.startswith(b'%PDF'):
            pdf=PROOFS/(key+'.pdf');pdf.write_bytes(r.content)
            subprocess.run(['pdftotext','-layout',str(pdf),str(PROOFS/(key+'.txt'))],check=True)
            out['text']=(PROOFS/(key+'.txt')).read_text()
        elif 'json' in out['contentType'] or url.endswith('.json'):
            out['data']=r.json(); out['text']=r.text
        else:
            gzip.open(PROOFS/(key+'.html.gz'),'wt').write(r.text)
            soup=BeautifulSoup(r.content,'html.parser')
            out['links']=[{'text':a.get_text(' ',strip=True),'href':requests.compat.urljoin(r.url,a.get('href',''))} for a in soup.select('a[href]')]
            for x in soup.select('script,style,nav,footer,header'):x.decompose()
            out['text']=soup.get_text(' ',strip=True)
    except Exception as e: out['error']=str(e)
    target.write_text(json.dumps(out,ensure_ascii=False,indent=2))
    return out

if __name__=='__main__':
    urls=sys.argv[1:]
    if urls==['--discovery']:
        urls=[]
        for p in PROOFS.glob('exa-*-discovery.json'):
            d=json.loads(p.read_text());t=d.get('result','')+'\n'+'\n'.join(x.get('text','') for x in d.get('content',[]))
            urls.extend(re.findall(r'^URL: (.*)',t,re.M))
    elif urls and urls[0]=='--file': urls=json.loads(pathlib.Path(urls[1]).read_text())
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        for r in ex.map(fetch,dict.fromkeys(urls)):
            print(r['key'],r.get('status'),len(r.get('text','')),r['url'],flush=True)
