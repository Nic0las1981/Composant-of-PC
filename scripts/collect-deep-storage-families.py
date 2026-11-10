"""Cache exact public family documents; no MPN is constructed from a capacity."""
from pathlib import Path
import concurrent.futures,gzip,hashlib,json,runpy,subprocess,tempfile
M=runpy.run_path(str(Path(__file__).with_name('collect-deep-memory-manufacturer-catalogs.py')));OUT=M['OUT'];ROOT=M['ROOT']
urls=['https://www.kingston.com/datasheets/KC3000_en.pdf','https://www.kingston.com/datasheets/snv3s_us.pdf','https://www.kingston.com/datasheets/SFYR_en.pdf','https://www.kingston.com/datasheets/SNV2S_de.pdf','https://www.kingston.com/datasheets/SFYR2S_en.pdf','https://media.kingston.com/pdfs/SSDFamilyFlyer_mkf_952.pdf']
def collect(url):
 key=hashlib.sha256(url.encode()).hexdigest()[:20];folder=OUT/'kingston-storage-pdfs';mp=folder/(key+'.json');raw=folder/(key+'.html.gz')
 if mp.exists() and raw.exists():meta=json.loads(mp.read_text())
 else:meta,_=M['fetch'](url,'kingston-storage-pdfs')
 if meta.get('error'):return meta
 b=gzip.decompress(raw.read_bytes())
 with tempfile.TemporaryDirectory() as d:
  pdf=Path(d)/'document.pdf';txt=Path(d)/'document.txt';pdf.write_bytes(b);subprocess.run(['pdftotext','-layout',str(pdf),str(txt)],check=True,capture_output=True)
  return dict(meta,text=txt.read_text())
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:records=list(ex.map(collect,urls))
(OUT/'kingston-storage-datasheets.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
print({'documents':len(records),'errors':sum(bool(x.get('error')) for x in records)})
