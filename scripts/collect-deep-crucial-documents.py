"""Retain official Crucial flyers and distributor-hosted copies with provenance.
HTTP 200 Request Rejected is an error, not evidence. PDF text is kept compactly.
"""
import concurrent.futures,gzip,hashlib,json,re,runpy,subprocess,tempfile
from pathlib import Path
M=runpy.run_path(str(Path(__file__).with_name('collect-deep-memory-manufacturer-catalogs.py')));OUT=M['OUT'];ROOT=M['ROOT'];urls=[]
for f in OUT.glob('crucial-pdf-*.json'):
 t='\n'.join(x.get('text','') for x in json.load(open(f))['response']['content'])
 for u in re.findall(r'URL: (\S+)',t):
  if u.lower().endswith('.pdf') and any(h in u for h in ['assets.micron.com','www.crucial.com/','www.crucial.mx/','www.simms.co.uk/','www.asipartner.com/','hypertecsp.com/']):urls.append(u)
def collect(u):
 key=hashlib.sha256(u.encode()).hexdigest()[:20];p=OUT/'crucial-pdfs'/key
 if p.with_suffix('.json').exists() and p.with_suffix('.html.gz').exists():d=json.load(open(p.with_suffix('.json')))
 else:d,_=M['fetch'](u,'crucial-pdfs')
 if 'file' not in d:return d
 b=gzip.decompress((ROOT/d['file']).read_bytes())
 if not b.startswith(b'%PDF'):return dict(d,error='Not a PDF response')
 with tempfile.TemporaryDirectory() as td:
  pdf=Path(td)/'d.pdf';txt=Path(td)/'d.txt';pdf.write_bytes(b);subprocess.run(['pdftotext','-layout',str(pdf),str(txt)],check=True,capture_output=True)
  return dict(d,text=txt.read_text(),kind='manufacturer' if any(x in u for x in ['assets.micron.com','www.crucial.com/','www.crucial.mx/']) else 'retailer')
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:r=list(ex.map(collect,sorted(set(urls))))
(OUT/'crucial-datasheets.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print({'documents':len(r),'PDFs':sum('text' in x for x in r),'errors':sum('error' in x for x in r)})
