"""Read the actual high-resolution specification panels, not downscaled poster thumbnails."""
import os
os.environ['OMP_THREAD_LIMIT']='1'
import concurrent.futures,json,subprocess
from pathlib import Path
import fitz
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-antec-enermax/sources';P=D.parent/'spec-panels';P.mkdir(exist_ok=True)
def run(p):
 dest=P/(p.stem+'.json')
 if dest.exists():return
 doc=fitz.open(p)
 if len(doc)!=1 or doc[0].rect.height/doc[0].rect.width<2.5:return
 page=doc[0];clip=fitz.Rect(0,page.rect.height*.58,page.rect.width,page.rect.height)
 image=P/(p.stem+'.png');page.get_pixmap(matrix=fitz.Matrix(1600/page.rect.width,1600/page.rect.width),clip=clip,alpha=False).save(image)
 text=subprocess.check_output(['tesseract',str(image),'stdout','--psm','11'],text=True,stderr=subprocess.DEVNULL,timeout=80)
 src=json.loads(p.with_suffix('.json').read_text());dest.write_text(json.dumps({'sourceURL':src['url'],'checkedAt':src['checkedAt'],'method':'PDF specification panel cropped from 58% height, rendered at 1600px width; Tesseract psm11. Model and table column alignment require review.','text':text},ensure_ascii=False,indent=2));return p.stem,len(text)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
 for r in ex.map(run,D.glob('*.pdf')):
  if r:print(r,flush=True)
