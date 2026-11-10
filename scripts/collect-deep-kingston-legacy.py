"""Collect every literally published HyperX DDR4 specification, retaining revisions.
The historical spec-sheet gallery is the discovery authority; no codes are generated.
"""
from pathlib import Path
import concurrent.futures,gzip,hashlib,html,json,re,runpy,subprocess,tempfile
M=runpy.run_path(str(Path(__file__).with_name('collect-deep-memory-manufacturer-catalogs.py')))
OUT=M['OUT'];ROOT=M['ROOT'];clean=M['clean']
url='https://www.kingston.com/en/gaming/memory-spec-sheets'
meta,s=M['fetch'](url,'kingston-legacy-pages');records=[]
for card in re.split(r'<li class="l-flexTiles__item [^"]*">',s)[1:]:
 h=re.search(r'<h5[^>]+data-pn="([^"]+)"[^>]*>(.*?)</h5>',card,re.S)
 if not h or not h[1].startswith('HX4'):continue
 link=re.search(r'href="(https://www.kingston.com/datasheets/[^\"]+\.pdf)"',card)
 if not link:continue
 image=re.search(r'<img[^>]+alt="([^"]*)"[^>]+src="([^"]+)"',card)
 records.append({'mpn':h[1],'title':clean(h[2]),'imageAlt':html.unescape(image[1]) if image else '',
  'imageURL':image[2] if image else None,'cardText':clean(card.split('</div>\r\n                    </li>')[0]),'url':link[1],'source':meta})
(OUT/'kingston-legacy-catalog.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
print('literal DDR4 records',len(records),flush=True)
def pdf(r):
 u=r['url'];key=hashlib.sha256(u.encode()).hexdigest()[:20];path=OUT/'kingston-pdfs'/key
 if path.with_suffix('.json').exists():d=json.loads(path.with_suffix('.json').read_text())
 else:d,_=M['fetch'](u,'kingston-pdfs')
 if 'file' not in d:return dict(d,mpn=r['mpn'])
 b=gzip.decompress((ROOT/d['file']).read_bytes())
 if not b.startswith(b'%PDF'):return dict(d,mpn=r['mpn'],error='Not a PDF')
 with tempfile.TemporaryDirectory() as td:
  p=Path(td)/'source.pdf';p.write_bytes(b)
  text=subprocess.run(['pdftotext','-layout',str(p),'-'],capture_output=True,text=True,check=True).stdout
 return dict(d,mpn=r['mpn'],text=text)
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
 docs=[]
 for i,d in enumerate(pool.map(pdf,records),1):
  docs.append(d)
  if i%40==0:print('PDFs',i,'failures',sum('error' in x for x in docs),flush=True)
(OUT/'kingston-legacy-datasheets.json').write_text(json.dumps(docs,ensure_ascii=False,indent=2)+'\n')
print('finished',len(docs),sum('text' in x for x in docs),flush=True)
