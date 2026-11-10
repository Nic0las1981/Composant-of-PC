"""Fetch every specification PDF linked by the retained TEAMGROUP family pages."""
from pathlib import Path
import concurrent.futures,gzip,hashlib,json,runpy,subprocess,tempfile
M=runpy.run_path(str(Path(__file__).with_name('collect-deep-memory-manufacturer-catalogs.py')));OUT=M['OUT'];ROOT=M['ROOT']
urls=json.loads((OUT/'teamgroup-pdf-urls.json').read_text())
def collect(u):
 key=hashlib.sha256(u.encode()).hexdigest()[:20];path=OUT/'teamgroup-pdfs'/key
 if path.with_suffix('.json').exists():d=json.loads(path.with_suffix('.json').read_text())
 else:d,_=M['fetch'](u,'teamgroup-pdfs')
 if 'file' not in d:return d
 b=gzip.decompress((ROOT/d['file']).read_bytes())
 if not b.startswith(b'%PDF'):return dict(d,error='Not a PDF')
 with tempfile.TemporaryDirectory() as td:
  p=Path(td)/'source.pdf';p.write_bytes(b);text=subprocess.run(['pdftotext','-layout',str(p),'-'],capture_output=True,text=True,check=True).stdout
 return dict(d,text=text)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 docs=[]
 for i,d in enumerate(pool.map(collect,urls),1):
  docs.append(d)
  if i%20==0:print('documents',i,'errors',sum('error' in x for x in docs),flush=True)
(OUT/'teamgroup-datasheets.json').write_text(json.dumps(docs,ensure_ascii=False,indent=2)+'\n');print('finished',len(docs),flush=True)
