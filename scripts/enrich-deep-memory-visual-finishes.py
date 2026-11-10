"""Attach reviewed finish evidence only through retained exact-MPN image links."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/memory-storage'
def enrich(indexes):
 targets=json.loads((OUT/'visual-review-targets.json').read_text())
 reviews={}
 for path in sorted(OUT.glob('visual-finish-reviews-*.json')):
  for row in json.loads(path.read_text()):
   assert row.get('visuallyInspected') is True,(path,row.get('sha256'))
   assert row['sha256'] not in reviews,(path,row['sha256'])
   reviews[row['sha256']]=row
 bympn={(r['brand'],r['mpn'].upper()):r for r in targets['records']}
 audit=[]
 for brand,records in indexes.items():
  for rec in records:
   target=bympn.get((brand,rec['mpn'].upper()))
   if not target or rec.get('category')=='storage':continue
   proof=target.get('imageProof',{});review=reviews.get(proof.get('sha256'))
   if not review:continue
   assert proof['status']==200 and proof['url'] in target['images']
   assert rec['mpn'] in review['linkedMPNs']
   # The target links were captured from each individual published SKU card;
   # same-byte images may be reviewed once, but never inferred for another SKU.
   allowed=[sorted({c.lower() for c in combination}) for combination in review['allowedArchiveFinishes']]
   observed=sorted({c.lower() for c in review['observedBodyColors']})
   rec['allowedArchiveFinishes']=list({tuple(sorted(f)) for f in rec.get('allowedArchiveFinishes',[])}|{tuple(f) for f in allowed})
   if not rec.get('colors'):rec['colors']=observed
   source={'name':brand+' — photo officielle liée à la référence exacte, finition inspectée','url':proof['url'],'checkedAt':proof['checkedAt'],'kind':'manufacturer'}
   link={'name':brand+' — association publiée entre le MPN et sa galerie','url':target['sourceURL'],'checkedAt':target['sourceCheckedAt'],'kind':'manufacturer'}
   rec['sources']=list({s['url']:s for s in rec['sources']+[source,link]}.values())
   reason=review['notes']+' Association image/MPN publiée : '+target['sourceURL']+'. SHA-256 : '+proof['sha256']+'.'
   rec['rows'].append({'label':'Finition observée sur la photo officielle du MPN','value':', '.join(observed)+' — '+review['notes']})
   rec['fieldEvidence']['finish']={'value':', '.join(observed),'sourceURL':proof['url'],'checkedAt':proof['checkedAt'],'reason':reason}
   if review.get('rgbVisible') is True:
    rec['patch']['rgb']=True
    rec['fieldEvidence']['rgb']={'value':True,'sourceURL':proof['url'],'checkedAt':proof['checkedAt'],'reason':'Éclairage multicolore allumé visible sur la photo officielle publiée pour ce MPN.'}
   audit.append({'mpn':rec['mpn'],'brand':brand,'imageURL':proof['url'],'sourceURL':target['sourceURL'],'checkedAt':proof['checkedAt'],'sha256':proof['sha256'],'reviewedAt':review.get('checkedAt'),'observedBodyColors':observed,'allowedArchiveFinishes':allowed,'rgbVisible':review.get('rgbVisible')})
 (OUT/'visual-finish-resolutions.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
 return indexes
