"""Check all 4,696 queue entries, evidence registration, and offer immutability."""
from pathlib import Path
import collections,gzip,json
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/memory-storage';inputs=json.loads(gzip.decompress((OUT/'input.json.gz').read_bytes()));old={r['component']['id']:r for r in inputs};products=json.loads((OUT/'products.json').read_text());audit=json.loads((OUT/'audit.json').read_text());errors=[]
assert len(audit['records'])==len(old)==4696
assert len({r['id'] for r in audit['records']})==4696
quarantine=json.loads((OUT/'quarantine.json').read_text());bad={(q['id'],q['badMPN']) for q in quarantine}
for id,v in products.items():
 if id not in old:errors.append({'id':id,'reason':'unknown ID'})
 if v.get('identityKind')=='manufacturer-model':
  if v['mpn'] or v.get('manufacturerModel')!=v['patch'].get('manufacturerModel') or v['offers']:errors.append({'id':id,'reason':'invalid manufacturer model identity'})
 elif v['mpn']!=v['patch'].get('manufacturerPartNumber'):errors.append({'id':id,'reason':'patch/record MPN mismatch'})
 if (id,v['mpn']) in bad:errors.append({'id':id,'reason':'quarantined match retained'})
 sources={s['url']:s for s in v['sources']}
 for key,field in v.get('fieldEvidence',{}).items():
  if field['sourceURL'] not in sources:errors.append({'id':id,'field':key,'reason':'unregistered evidence URL'})
 previous=old[id].get('verified')
 if previous and previous['mpn']==v['mpn'] and previous['offers']!=v['offers']:errors.append({'id':id,'reason':'historical offers changed'})
 if (not previous or previous['mpn']!=v['mpn']) and v['offers']:errors.append({'id':id,'reason':'new identity carries an uncollected offer'})
# Carry prior per-ID research attempts into the queue instead of presenting an
# unavailable manufacturer index as evidence that a product does not exist.
prior={};p=ROOT/'data/full-review/reviews.jsonl.gz'
with gzip.open(p,'rt') as f:
 for line in f:
  r=json.loads(line);id=r.get('componentId')
  if id not in old:continue
  prior[id]={'primaryPages':[{'url':p.get('url'),'matched':p.get('match'),'checkedAt':p.get('checkedAt'),'mpn':(p.get('product') or {}).get('mpn')} for p in r.get('primaryPages',[])],'recordRetained':bool(old[id].get('verified'))}
for row in audit['records']:
 row['priorResearch']=prior.get(row['id'],{'primaryPages':[],'recordRetained':bool(old[row['id']].get('verified'))})
 if not row.get('indexRecordsExamined') and row['status']=='blocked' and 'encore à collecter' in row.get('reason',''):
  row['reason']='Aucun catalogue constructeur exact n’a été admis pour cette marque dans cette collecte. Les recherches antérieures sont conservées ci-dessous ; l’absence de MPN ou de correspondance exacte interdit de compléter une autre variante.'
audit['qualityChecks']={'recordsChecked':len(products),'errors':errors,'offersInvariant':not any('offer' in e['reason'] for e in errors),'queueIdsUnique':True}
(OUT/'audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
summary={'records':len(products),'newIdentities':sum(not old[id].get('verified') for id in products),'previousIdentitiesEnriched':sum(bool(old[id].get('verified')) for id in products),'exactMPNRecords':sum(v.get('identityKind')!='manufacturer-model' for v in products.values()),'ambiguousManufacturerModels':sum(v.get('identityKind')=='manufacturer-model' for v in products.values()),'byCategory':dict(collections.Counter(old[id]['component']['category'] for id in products)),'byBrand':dict(collections.Counter(old[id]['component']['brand'] for id in products)),'quarantinedNewMatches':len(quarantine),'auditRows':len(audit['records']),'errors':errors}
(OUT/'validation.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False))
if errors:raise SystemExit(1)
