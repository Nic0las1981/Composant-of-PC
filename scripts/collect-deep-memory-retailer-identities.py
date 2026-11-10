"""Re-evaluate primary retailer pages as facts about their explicit MPN only.
A previous association to an archive ID is not reused. Family/kit/rating/finish
matching still runs independently against the manufacturer catalog afterward.
"""
from pathlib import Path
import collections,datetime,gzip,json,re
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/memory-storage';facts=collections.defaultdict(list);seen=set();conflicts=[]
colorwords={'noir':'black','black':'black','blanc':'white','white':'white','gris':'gray','grey':'gray','gray':'gray','argent':'silver','silver':'silver','rouge':'red','red':'red','bleu':'blue','blue':'blue','or':'gold','gold':'gold','jaune':'yellow','yellow':'yellow','vert':'green','green':'green'}
def parse(page):
 p=page.get('product') or {};mpn=p.get('mpn');url=page.get('url','');name=p.get('name','');text=p.get('technicalText','')
 if not mpn or page.get('httpStatus')!=200 or url in seen or not re.match(r'^(?:F[45]-|KF[45]|HX[45]|CM[KHTWDNPG]|AX[45]U|TF|TL|TT|TED|TCD|SP|PV|PVE|BL|CP)',mpn,re.I):return
 if p.get('url') and p['url'].rstrip('/')!=url.rstrip('/'):return
 seen.add(url);col=None;line=None
 for s in text.splitlines():
  m=re.fullmatch(r'(?:Couleur(?:s)? du produit|Couleur(?:s)?(?: du radiateur)?|Color)\s*:?\s*([A-Za-zÀ-ÿ, /-]+)',s.strip(),re.I)
  if m:
   words=[w.lower() for w in re.findall(r'[A-Za-zÀ-ÿ]+',m[1])]
   if words and all(w in colorwords for w in words):col=sorted({colorwords[w] for w in words});line=s;break
 if not col:
  m=re.search(r'\b(noir|blanc|rouge|gris|argent|black|white|silver|red|grey)(?:\s*/\s*(noir|blanc|rouge|gris|argent|black|white|silver|red|grey))?\s*$',name,re.I)
  if m:col=sorted({colorwords[x.lower()] for x in m.groups() if x});line=name
 if not col:return
 caps=re.findall(r'\b(\d+)\s*(?:Go|GB)\b',name,re.I);cap=int(caps[0]) if caps else None;kit=re.search(r'\b(\d+)\s*[x×]\s*(\d+)\s*(?:Go|GB)\b',name,re.I)
 if kit:cap=int(kit[1])*int(kit[2])
 facts[mpn.upper()].append({'mpn':mpn,'colors':col,'name':name,'capacityGB':cap,'memorySticks':int(kit[1]) if kit else None,'source':{'name':'PcComponentes — finition du MPN explicite','url':url,'checkedAt':page['checkedAt'],'kind':'retailer'},'sha256':page['sha256'],'literalEvidence':line})
with gzip.open(ROOT/'data/full-review/reviews.jsonl.gz','rt') as f:
 for line in f:
  d=json.loads(line)
  if d['componentId'].startswith(('import-ram','ram-')):
   for page in d.get('primaryPages',[]):parse(page)
for line in (ROOT/'data/deep-review/prices/observations.jsonl').open():
 try:d=json.loads(line)
 except json.JSONDecodeError:continue
 if d['componentId'].startswith(('import-ram','ram-')):
  for page in d.get('pages',[]):parse(page)
(OUT/'retailer-identity-facts.json').write_text(json.dumps({'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'records':dict(facts)},ensure_ascii=False,indent=2)+'\n');print({'distinctExactMPNsWithFinish':len(facts),'primaryPages':sum(len(v) for v in facts.values())})
