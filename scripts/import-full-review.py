"""Integrate conservative primary-page matches and expose every review outcome.

An attempted lookup, a search excerpt and an unavailable page never become a
verified price. Every offer is tied to a parsed product page and an exact MPN.
"""
from collections import Counter,defaultdict
from datetime import datetime,timezone
import gzip
import json
from pathlib import Path
import re
import runpy

ROOT=Path(__file__).resolve().parents[1];DIR=ROOT/'data/full-review'
helpers=runpy.run_path(str(ROOT/'scripts/collect-catalog-review.py'))
match=helpers['variant_match'];norm=helpers['norm']
input_path=DIR/'input.json'
inputs=json.loads(input_path.read_text() if input_path.exists() else gzip.decompress((DIR/'input.json.gz').read_bytes()).decode());by_id={c['id']:c for c in inputs}
manual_ids={r['componentId'] for r in json.loads((ROOT/'data/verified-source-manifest.json').read_text())}
prior_ids_path=ROOT/'data/individual-review/existing-bulk-ids.json'
prior_ids=set(json.loads(prior_ids_path.read_text())) if prior_ids_path.exists() else None
market=json.loads((ROOT/'data/market-observations.json').read_text())
market_ids={r['component']['id'] for r in market['records']}
reviews={}
path=DIR/'reviews.jsonl'
raw=path.read_text() if path.exists() else gzip.decompress((DIR/'reviews.jsonl.gz').read_bytes()).decode()
for line in raw.splitlines():
 try:
  row=json.loads(line);reviews[row['componentId']]=row
 except ValueError:continue

main_offer=runpy.run_path(str(ROOT/'scripts/primary-review-offer.py'))['main_offer']

def spec_rows(p):
 rows=[];seen=set()
 for line in p.get('technicalText','').splitlines():
  m=re.match(r'^([^:]{2,75})\s*:\s*(.{1,350})$',line)
  if not m:continue
  label,value=m[1].strip(),m[2].strip()
  if label not in seen and value and not re.search('logistique|adresse|email|origine|emballage|securit|prix|score|fps',norm(label)):
   rows.append({'label':label,'value':value});seen.add(label)
 return rows

bulk={};outcomes={};rejections=[];pending=[];candidates={}
for c in inputs:
 id=c['id'];r=reviews.get(id)
 if not r:
  outcomes[id]={'status':'pending'};pending.append(id);continue
 accepted=[]
 for page in r.get('primaryPages',[]):
  p=page.get('product')
  if not p or page.get('httpStatus')!=200:continue
  okay,reasons=match(c,p)
  if okay:accepted.append(page)
  else:rejections.append({'componentId':id,'url':page['url'],'reasons':reasons})
 mpns={norm(str(page['product'].get('mpn') or page['product'].get('model') or '')) for page in accepted}
 status='primary_match' if len(mpns)==1 else 'ambiguous_variants' if len(mpns)>1 else r['status'] if r['status'] in ['access_failed','search_unreadable','collector_error'] else 'no_exact_match'
 outcomes[id]={'status':status,'checkedAt':r.get('searchedAt'),'candidates':r.get('candidateCount',0)}
 if status!='primary_match' or id in manual_ids or id in market_ids:continue
 candidates[id]=accepted

# The same retailer MPN cannot identify conflicting capacities, kits or finishes.
by_mpn=defaultdict(list)
for id,pages in candidates.items():
 p=pages[0]['product'];by_mpn[(norm(by_id[id]['brand']),norm(str(p.get('mpn') or p.get('model'))))].append(id)
conflicting=set()
for key,ids in by_mpn.items():
 fingerprints={tuple(str(by_id[id].get(k,'')) for k in ['category','capacityGB','memorySticks','memoryType','memorySpeedMTs','casLatency','finishName','wattage','socket']) for id in ids}
 if len(fingerprints)>1:
  conflicting.update(ids)
  for id in ids:outcomes[id]['status']='conflicting_reference';rejections.append({'componentId':id,'reason':'MPN commun à plusieurs identités différentes du catalogue','otherIds':ids})

for id,pages in candidates.items():
 if id in conflicting:continue
 if prior_ids is not None and id not in prior_ids:
  outcomes[id]['status']='candidate_pending_review'
  rejections.append({'componentId':id,'reason':'Nouvelle correspondance candidate : revue individuelle requise avant intégration.'})
  continue
 c=by_id[id];p=pages[0]['product'];mpn=str(p.get('mpn') or p.get('model')).strip()
 offers=[];sources=[];seen_urls=set()
 for page in pages:
  if page['url'] in seen_urls:continue
  seen_urls.add(page['url']);sources.append({'name':'PcComponentes','url':page['url'],'checkedAt':page['checkedAt'],'kind':'retailer'})
  offer=main_offer(page['product'],page,mpn)
  if offer:offers.append(offer)
 rows=spec_rows(p)
 groups=[{'title':'Caractéristiques PcComponentes','rows':rows}] if rows else []
 patch={'manufacturerPartNumber':mpn}
 # Transfer only explicit electrical data with a single unambiguous value.
 voltages=set()
 for row in rows:
  if c['category']=='ram' and norm(row['label']) in ['tensionmemoire','memoiredetension','tension']:
   value=re.fullmatch(r'(\d+(?:[.,]\d+)?)\s*V(?:olts?)?',row['value'],re.I)
   if value and .8<=float(value[1].replace(',','.'))<=2:voltages.add(float(value[1].replace(',','.')))
 if len(voltages)==1:patch['memoryVoltageV']=voltages.pop()
 bulk[id]={'mpn':mpn,'identityNote':'Correspondance marchande contrôlée par modèle, capacité, kit et finition lorsqu’ils sont renseignés. Le MPN est celui de la page produit consultée.',
  'sources':sources,'groups':groups,'patch':patch,'offers':offers,'notes':['Contrôle automatisé par caractéristiques discriminantes sur une page produit primaire. Les caractéristiques encore absentes restent à confirmer ; ce relevé ne constitue pas une validation complète de compatibilité.']}

amazon=[]
amazon_path=DIR/'amazon-pages-live.json'
if amazon_path.exists():
 for row in json.loads(amazon_path.read_text()):
  m=row.get('markdown','');table=re.findall(r'\|\s*(?:Manufacturer Part Number|Item model number|Numéro du modèle|Référence constructeur)\s*\|\s*([^|\n]+)',m,re.I)
  exact=any(norm(value.strip())==norm(row['mpn']) for value in table)
  amazon.append({'componentId':row['componentId'],'url':row.get('url'),'checkedAt':row.get('checkedAt'),'status':'mpn_observed' if row.get('status')=='page_read' and exact else 'different_or_unconfirmed_variant' if row.get('status')=='page_read' else row.get('status'),
   'expectedMPN':row.get('mpn'),'observedReferences':[value.strip() for value in table],'offerStatus':'not_confirmed_for_delivery_in_france'})

summary={'generatedAt':datetime.now(timezone.utc).isoformat(),'total':len(inputs),'searched':len(reviews),'pending':len(pending),
 'statuses':dict(Counter(row['status'] for row in outcomes.values())),'additionalPrimaryRecords':len(bulk),
 'amazon':{'searched':len(amazon),'mpnObservedPages':sum(r['status']=='mpn_observed' for r in amazon),'confirmedFrenchOffers':0},
 'methods':{'integrity':'All variants checked for data integrity separately.','primary':'Direct PcComponentes searches followed by at most two closest primary product pages; strict identity rules; ambiguous or inconsistent MPNs excluded.','amazon':'Search plus primary product-page reads for 60 MPNs. Bundles, selected variants, seller and delivery-country uncertainty prevent importing an unconfirmed price.'}}
(DIR/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
(DIR/'outcomes.json').write_text(json.dumps(outcomes,ensure_ascii=False,separators=(',',':'))+'\n')
(DIR/'rejections.json').write_text(json.dumps(rejections,ensure_ascii=False,separators=(',',':'))+'\n')
(DIR/'amazon-outcomes.json').write_text(json.dumps(amazon,ensure_ascii=False,indent=2)+'\n')
(ROOT/'src/data/verifiedBulk.ts').write_text('// Generated by scripts/import-full-review.py. Primary-page evidence in data/full-review.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const verifiedBulk: Record<string,VerifiedProduct> = '+json.dumps(bulk,ensure_ascii=False,indent=2)+';\n')
(ROOT/'src/data/catalogControl.ts').write_text('// Generated by scripts/import-full-review.py. A completed lookup is not necessarily a confirmed reference.\nexport const catalogControlSummary = '+json.dumps(summary,ensure_ascii=False,indent=2)+' as const;\nexport const catalogControlOutcomes: Record<string,{status:string;checkedAt?:string;candidates?:number}> = '+json.dumps(outcomes,ensure_ascii=False,separators=(',',':'))+';\n')
print(json.dumps(summary,ensure_ascii=False,indent=2))
