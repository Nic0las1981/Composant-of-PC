"""OCR image-only English manual pages; keep OCR separate from native PDF text.
No OCR value is automatically accepted by the product generator.
"""
import os,concurrent.futures,datetime,hashlib,json,pathlib,subprocess,sys,urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-chassis';O=D/'ocr';O.mkdir(exist_ok=True)
def run(key):
 e=json.loads((D/'sources'/(key+'.json')).read_text());tmp=pathlib.Path('/tmp/deep-psu-ocr')/key;tmp.mkdir(parents=True,exist_ok=True);pdf=tmp/'source.pdf'
 if not pdf.exists():
  with urllib.request.urlopen(e['url'],timeout=30) as r:b=r.read()
  assert hashlib.sha256(b).hexdigest()==e['sha256'];pdf.write_bytes(b)
 if not list(tmp.glob('page-*.png')):subprocess.run(['pdftoppm','-f','1','-l','9','-r','180','-png',str(pdf),str(tmp/'page')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 pages=[]
 for p in sorted(tmp.glob('page-*.png')):
  txt=subprocess.check_output(['tesseract',str(p),'stdout','-l','eng','--psm','3'],text=True,stderr=subprocess.DEVNULL,env={**os.environ,'OMP_THREAD_LIMIT':'1'})
  pages.append({'page':int(p.stem.split('-')[-1]),'text':txt,'renderPath':str(p),'inspection':'ocr_only'})
 out={'sourceKey':key,'url':e['url'],'sourceCheckedAt':e['checkedAt'],'sourceSha256':e['sha256'],'ocrAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'pdftoppm180dpi + tesseract eng psm3','pages':pages}
 (O/(key+'.json')).write_text(json.dumps(out,ensure_ascii=False,indent=2));return key,len(pages),sum(len(p['text']) for p in pages)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
 for r in ex.map(run,sys.argv[1:]):print(*r,flush=True)
