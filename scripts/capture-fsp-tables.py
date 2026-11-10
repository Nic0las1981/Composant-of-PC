"""Retain colspan-aware output-rail tables and labeled axes for exact FSP models."""
import runpy,pathlib,json,re,hashlib,concurrent.futures
from lxml import html
ROOT=pathlib.Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-fsp';C=runpy.run_path(str(ROOT/'scripts/deep-motherboard-core.py'));R=runpy.run_path(str(ROOT/'scripts/collect-fsp-review.py'))
def get(match):
 h=match['candidates'][0];key=h['sourceKey'];meta,body=C['fetch'](h['url'],D/'raw'/key)
 if meta.get('status')!='fetched':return
 tree=html.fromstring(body);grids=[]
 for table in tree.xpath('//table'):
  grid=[]
  for tr in table.xpath('.//tr'):
   cells=[]
   for cell in tr.xpath('./td|./th'):
    text=' '.join(cell.text_content().split());cells.extend([text]*int(cell.get('colspan','1')))
   grid.append(cells)
  grids.append(grid)
 links=[{'text':' '.join(a.text_content().split()),'url':a.get('href')} for a in tree.xpath('//a[@href]')]
 cableCards=[]
 for node in tree.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," cable_tab ")]'):
  parent=node.getparent();names=parent.xpath('.//*[contains(concat(" ",normalize-space(@class)," ")," cable_name ")]')
  if len(names)==1:cableCards.append({'label':' '.join(names[0].text_content().split()),'value':' ; '.join(' '.join(e.text_content().split()) for e in node)})
 raw={'receipt':meta,'title':h['title'],'model':h['model'],'tables':grids,'cableCards':cableCards,'links':links};(D/'tables').mkdir(exist_ok=True);(D/'tables'/(key+'.json')).write_text(json.dumps(raw,ensure_ascii=False,indent=2));return key
if __name__=='__main__':
 matches=json.loads((D/'mapping.json').read_text());unique={h['sourceKey']:{'candidates':[h]} for r in matches for h in (r['candidates'][:1] if r['state']=='exact_primary_match' else r['candidates'])}
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
  for i,key in enumerate(pool.map(get,unique.values()),1):
   if i%20==0:print(i,len(unique),flush=True)
