"""Cache public manufacturer catalogs and exact SKU specification pages.
Only published SKU strings are collected; URLs/MPNs are never inferred from timing encodings.
Run: python scripts/collect-deep-memory-manufacturer-catalogs.py [--gskill] [--teamgroup]
"""
from pathlib import Path
import argparse,concurrent.futures,datetime,gzip,hashlib,html,json,re,time,urllib.request,urllib.parse
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/memory-storage';OUT.mkdir(parents=True,exist_ok=True)
def clean(x):return html.unescape(re.sub(r'\s+',' ',re.sub('<[^>]+>',' ',x))).strip()
def fetch(url, folder):
 key=hashlib.sha256(url.encode()).hexdigest()[:20];dest=OUT/folder;dest.mkdir(parents=True,exist_ok=True);meta=dest/(key+'.json');raw=dest/(key+'.html.gz')
 if meta.exists() and raw.exists():return json.loads(meta.read_text()),gzip.decompress(raw.read_bytes()).decode()
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0','Accept-Encoding':'gzip'})
  with urllib.request.urlopen(req,timeout=35) as r:
   b=r.read();b=gzip.decompress(b) if r.headers.get('Content-Encoding')=='gzip' else b
   doc={'url':url,'finalURL':r.url,'status':r.status,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b),'file':str(raw.relative_to(ROOT))}
  raw.write_bytes(gzip.compress(b));meta.write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n');return doc,b.decode('utf-8','replace')
 except Exception as e:
  return {'url':url,'error':str(e),'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()},''
def gskill_parse(pair):
 meta,s=pair
 if not s:return meta
 rows=[]
 for a,b in re.findall(r'<div class="list-block list-tit">(.*?)</div>\s*<div class="list-block">(.*?)</div>',s,re.S):rows.append({'label':clean(a),'value':clean(b)})
 title=clean((re.search(r'<title>(.*?)</title>',s,re.S) or ['',''])[1]).split(' - Specification')[0]
 description=html.unescape((re.search(r'<meta name="description" content="([^"]*)',s) or ['',''])[1])
 # Extract published model names in title. Multi-model pages remain explicit aliases, never generated.
 mpns=re.findall(r'F[45]-[A-Z0-9]+-[A-Z0-9]+',title)
 family=re.split(r'(?:Up to )?DDR[45]-\d+',description)[0].strip()
 images=re.findall(r'<img src="(/_upload/images/[^"]+)"',s)
 main=s[s.find('<div class="pro-detail'): ] if '<div class="pro-detail' in s else s
 heights=re.findall(r'(?:module height (?:at|of)|height (?:of|at))\s*(\d+(?:\.\d+)?)\s*mm',clean(main),re.I)
 return dict(meta,title=title,mpns=mpns,family=family,description=description,rows=rows,images=['https://www.gskill.com'+i for i in images],heightsMm=sorted(set(float(x) for x in heights)))
def run_gskill():
 meta,s=fetch('https://www.gskill.com/sitemap.xml','catalog-pages')
 urls=sorted(set(html.unescape(u) for u in re.findall(r'<loc>(.*?)</loc>',s) if u.startswith('https://www.gskill.com/specification/') and re.search(r'/F[45]-',u)))
 records=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
  for i,pair in enumerate(ex.map(lambda u:fetch(u,'gskill-pages'),urls),1):
   records.append(gskill_parse(pair))
   if i%100==0:print(json.dumps({'gskillFetched':i,'total':len(urls),'errors':sum(bool(x.get('error')) for x in records)}),flush=True)
 (OUT/'gskill-catalog.json').write_text(json.dumps({'source':meta,'records':records},ensure_ascii=False,indent=2)+'\n')
 print('G.SKILL complete',len(records),flush=True)
def team_parse(meta,s):
 records=[]
 for sec in re.findall(r'<section class="compareBox[^>]*>(.*?)</section>',s,re.S):
  links=re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>',sec,re.S)
  link=next(((u,clean(t)) for u,t in links if '/product-detail/' in u),('',''))
  title=clean((re.search(r'<h[1-6][^>]*>(.*?)</h[1-6]>',sec,re.S) or ['',''])[1]) or link[1]
  image=(re.search(r'<img[^>]+src="([^"]+)"',sec) or ['',''])[1]
  heads=[clean(x) for x in re.findall(r'<th[^>]*>(.*?)</th>',sec,re.S)]
  for tr in re.findall(r'<tr class="specTableRow specTableRowContent">(.*?)</tr>',sec,re.S):
   cells=[clean(x) for x in re.findall(r'<td[^>]*>(.*?)</td>',tr,re.S)]
   if len(cells)==4:
    records.append({'category':'storage','section':title,'familyURL':html.unescape(link[0]),'imageURL':html.unescape(image),'moduleType':cells[0],'capacity':cells[1],'mpn':cells[2],'source':meta});continue
   if len(cells)<7:continue
   records.append({'category':'ram','section':title,'familyURL':html.unescape(link[0]),'imageURL':html.unescape(image),'moduleType':cells[0],'capacity':cells[1],'frequency':cells[2],'latency':cells[3],'voltage':cells[4],'compatibility':cells[5],'mpn':cells[6],'source':meta})
 return records
def run_team():
 records=[]
 for category in ['memory','ssd']:
  url=f'https://www.teamgroupinc.com/en/product/compare/{category}/';meta,s=fetch(url,'catalog-pages')
  pages=max([int(n) for n in re.findall(r'\?page=(\d+)',s)]+[1]);pairs=[(meta,s)]
  with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:pairs.extend(ex.map(lambda n:fetch(url+f'?page={n}','catalog-pages'),range(2,pages+1)))
  for m,t in pairs:records.extend(team_parse(m,t))
  print('TEAMGROUP',category,'pages',pages,'records',len(records),flush=True)
 (OUT/'teamgroup-catalog.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--gskill',action='store_true');p.add_argument('--teamgroup',action='store_true');a=p.parse_args()
 if a.gskill:run_gskill()
 if a.teamgroup:run_team()
