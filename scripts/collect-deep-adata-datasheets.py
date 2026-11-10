"""Retrieve only ADATA PDF URLs discovered in public manufacturer search results."""
import json,re,runpy,gzip,subprocess,concurrent.futures
from pathlib import Path
M=runpy.run_path(str(Path(__file__).with_name('collect-deep-memory-manufacturer-catalogs.py')));OUT=M['OUT'];ROOT=M['ROOT'];urls=set()
for file in list(OUT.glob('adata-discovery-*.json'))+[OUT/'brand-discovery-0.json']:
 d=json.loads(file.read_text());t='\n'.join(x.get('text','') for x in d['response']['content']);urls.update(u for u in re.findall(r'^URL: (\S+)',t,re.M) if u.startswith('https://webapi3.adata.com/') and u.endswith('.pdf'))
def one(u):
 meta,s=M['fetch'](u,'adata-pdfs')
 if meta.get('error'):return meta
 b=gzip.decompress((ROOT/meta['file']).read_bytes())
 if not b.startswith(b'%PDF'):return dict(meta,error='Not a PDF')
 p=OUT/'adata-pdfs'/('tmp-'+Path(meta['file']).stem+'.pdf');p.write_bytes(b);text=subprocess.run(['pdftotext','-layout',str(p),'-'],capture_output=True,text=True).stdout;p.unlink();return dict(meta,text=text)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:docs=list(ex.map(one,sorted(urls)))
(OUT/'adata-datasheets.json').write_text(json.dumps(docs,ensure_ascii=False,indent=2)+'\n');print('ADATA PDFs',len(docs),'errors',sum('error' in d for d in docs))
