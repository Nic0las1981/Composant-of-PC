"""Follow observed manufacturer links; retain exact PDF/text evidence and OCR provenance."""
import os
os.environ["OMP_THREAD_LIMIT"]="1"
import concurrent.futures,datetime,hashlib,importlib.util,json,subprocess,sys,tempfile,urllib.parse,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/power-antec-enermax';S=OUT/'sources';S.mkdir(exist_ok=True)
spec=importlib.util.spec_from_file_location('capture',ROOT/'scripts/collect-deep-power-chassis.py');capture=importlib.util.module_from_spec(spec);spec.loader.exec_module(capture);capture.OUT=OUT
manifest={}
for p in (ROOT/'data/deep-review/power-chassis/sources').glob('extra-*.json'):
 if not p.name.startswith(('extra-antec-','extra-enermax-')):continue
 e=json.loads(p.read_text());(S/p.name).write_text(p.read_text()) if not (S/p.name).exists() else None
 if 'antec.com/product/power/' in e['url'] and len(e.get('primaryText',''))<1700:manifest[e['url'].removesuffix('.php')]=e['url']
 if '.pdf' in e['url'].lower() and ('power-' in e['url'] or 'enermax' in e['url']):manifest[e['url']]=e['url']
 for link in e.get('links',[]):
  u=link['url']
  if '.pdf' in u.lower() and any(h in u for h in ['antec.com','enermax.com','enermaxeu.com']):manifest[u]=e['url']
mf=OUT/'discovered-urls.json'
if mf.exists():manifest.update(json.loads(mf.read_text()))
mf.write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
def collect(rawurl):
 url=urllib.parse.quote(rawurl,safe=':/?=&%#');key='fetch-'+hashlib.sha256(url.encode()).hexdigest()[:16];p=S/(key+'.json')
 if p.exists():
  e=json.loads(p.read_text())
  if e.get('format')!='pdf' or len(e.get('primaryText','').strip())>=600 or 'ocrText' in e or 'ocrError' in e:return key,'cached'
 else:result=capture.collect(key,url)
 e=json.loads(p.read_text());e['discoveredFrom']=manifest[rawurl]
 if e.get('format')=='pdf' and len(e.get('primaryText','').strip())<600:
  try:
   raw=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read()
   if not raw.startswith(b'%PDF'):raise ValueError('not PDF')
   (S/(key+'.pdf')).write_bytes(raw)
   with tempfile.TemporaryDirectory(prefix='psu-ocr-') as td:
    pdf=Path(td)/'file.pdf';pdf.write_bytes(raw)
    subprocess.run(['pdftoppm','-scale-to','2200','-png',str(pdf),td+'/page'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    text=[]
    for image in sorted(Path(td).glob('page-*.png')):
     t=subprocess.check_output(['tesseract',str(image),'stdout','--psm','11'],text=True,stderr=subprocess.DEVNULL,timeout=60);text.append(t)
    e['ocrText']='\n\f\n'.join(text);e['ocrMethod']='tesseract psm11, full PDF pages scaled to 2200px';e['pdfFile']=str((S/(key+'.pdf')).relative_to(ROOT))
  except Exception as error:e['ocrError']=str(error)
 p.write_text(json.dumps(e,ensure_ascii=False,indent=2));return key,e.get('statusCode'),len(e.get('primaryText','')),len(e.get('ocrText',''))
if __name__=='__main__':
 jobs=list(manifest)
 if sys.argv[1:]:jobs=[u for u in jobs if any(a in u for a in sys.argv[1:])]
 with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:
  for r in ex.map(collect,jobs):print(*r,flush=True)
