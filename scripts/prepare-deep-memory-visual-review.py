"""Download exact-SKU manufacturer gallery evidence for independent visual review.
Only G.Skill SKU pages, Corsair per-variant API galleries and Kingston exact part
selectors qualify here. Family-only representative pictures are not reassigned.
"""
from pathlib import Path
import collections,concurrent.futures,gzip,hashlib,json,re,urllib.request,datetime
from PIL import Image,ImageOps,ImageDraw
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/memory-storage';DEST=OUT/'sku-image-proofs';DEST.mkdir(exist_ok=True);TMP=Path('/tmp/deep-memory-photo-review');TMP.mkdir(exist_ok=True)
queue=json.loads((OUT/'queue-status.json').read_text())['records'];lookups={}
for r in json.loads((OUT/'gskill-catalog.json').read_text())['records']:
 for m in r.get('mpns',[]):
  if r.get('images'):lookups[m]={'images':r['images'],'sourceURL':r['url'],'sourceCheckedAt':r['checkedAt'],'brand':'G.Skill','family':r['family']}
for r in json.loads((OUT/'corsair-catalog.json').read_text())['records']:
 if r.get('images'):lookups[r['mpn']]={'images':r['images'],'sourceURL':r['source']['url'],'sourceCheckedAt':r['source']['checkedAt'],'brand':'Corsair','family':r['name']}
for r in json.loads((OUT/'kingston-catalog.json').read_text()):
 if r.get('images'):lookups[r['mpn']]={'images':r['images'],'sourceURL':r['source']['url'],'sourceCheckedAt':r['source']['checkedAt'],'brand':'Kingston','family':r['family']}
for r in json.loads((OUT/'kingston-legacy-catalog.json').read_text()):
 if r.get('imageURL') and not r['title'].startswith('Replaced by'):lookups[r['mpn']]={'images':[r['imageURL']],'sourceURL':r['source']['url'],'sourceCheckedAt':r['source']['checkedAt'],'brand':'Kingston','family':r['title']}
targets={}
for q in queue:
 if q['state']!='finish_or_revision_ambiguous' or q['category']!='ram':continue
 for mpn in q.get('coreAttributeCandidates',[]):
  if mpn not in lookups:continue
  r=targets.setdefault(mpn,dict(mpn=mpn,**lookups[mpn],archiveCandidates=[]));r['archiveCandidates'].append({'id':q['id'],'name':q['name']})
def fetch(r):
 u=r['images'][0];key=hashlib.sha256(u.encode()).hexdigest()[:20];p=DEST/key;meta=p.with_suffix('.json');body=p.with_suffix('.html.gz')
 if meta.exists() and body.exists():d=json.loads(meta.read_text());b=gzip.decompress(body.read_bytes())
 else:
  d={'url':u,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
  try:
   with urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=35) as response:b=response.read();d.update(status=response.status,sha256=hashlib.sha256(b).hexdigest(),bytes=len(b))
   body.write_bytes(gzip.compress(b));meta.write_text(json.dumps(d,indent=2)+'\n')
  except Exception as e:return dict(r,imageProof=dict(d,error=str(e)))
 try:
  import io
  image=Image.open(io.BytesIO(b)).convert('RGBA');background=Image.new('RGBA',image.size,'#e5e7eb');background.alpha_composite(image);image=background.convert('RGB');image.thumbnail((380,190));local=TMP/(key+'.png');image.save(local)
  return dict(r,imageProof=d,thumbnail=str(local))
 except Exception as e:return dict(r,imageProof=dict(d,error=str(e)))
records=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for i,r in enumerate(pool.map(fetch,sorted(targets.values(),key=lambda x:(x['brand'],x['family'],x['mpn']))),1):
  records.append(r)
  if i%40==0:print('images',i,'/',len(targets),'errors',sum('error' in x['imageProof'] for x in records),flush=True)
groups=collections.defaultdict(list);unique={}
for r in records:
 if r.get('thumbnail'):
  key=(r['brand'],r['imageProof']['sha256'])
  group=unique.setdefault(key,dict(representative=r,linkedMPNs=[],archiveIds=[]));group['linkedMPNs'].append(r['mpn']);group['archiveIds'].extend(x['id'] for x in r['archiveCandidates'])
for (brand,sha),group in unique.items():groups[brand].append(dict(group,sha256=sha))
sheets=[]
for brand,rs in groups.items():
 for offset in range(0,len(rs),12):
  batch=rs[offset:offset+12];canvas=Image.new('RGB',(1200,1040),'white');draw=ImageDraw.Draw(canvas)
  for j,group in enumerate(batch):
   r=group['representative'];x=(j%3)*400;y=(j//3)*260;im=Image.open(r['thumbnail']);canvas.paste(im,(x+(400-im.width)//2,y+45+(190-im.height)//2));draw.text((x+10,y+4),str(offset+j+1)+'  '+r['mpn'],fill='black');draw.text((x+10,y+20),r['family'][:55],fill='black');draw.text((x+10,y+238),group['sha256'][:12]+'  '+str(len(group['linkedMPNs']))+' exact SKU associations',fill='black')
  path=TMP/(re.sub(r'\W+','-',brand.lower())+'-unique-'+str(offset//12+1).zfill(3)+'.jpg');canvas.save(path,quality=90);sheet={'brand':brand,'path':str(path),'groups':[{'sha256':x['sha256'],'representativeMPN':x['representative']['mpn'],'linkedMPNs':x['linkedMPNs']} for x in batch]};sheets.append(sheet)
(OUT/'visual-review-targets.json').write_text(json.dumps({'records':records,'uniqueImages':[{'brand':b,'sha256':sha,**group} for (b,sha),group in unique.items()],'sheets':sheets},ensure_ascii=False,indent=2)+'\n');print('finished',len(records),'sheets',len(sheets),flush=True)
