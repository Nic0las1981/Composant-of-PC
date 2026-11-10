"""Recover exact-MPN FR quotes from already captured primary retailer pages.
No aggregate minimum, foreign currency, used/unknown condition or unavailable
product becomes an offered price. Capture timestamps are never refreshed here.
"""
import collections,gzip,json,pathlib,re,runpy
ROOT=pathlib.Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/gpu'
helper=runpy.run_path(str(ROOT/'scripts/primary-review-offer.py'))['main_offer']
norm=lambda v:re.sub(r'[^a-z0-9]','',str(v).lower())
products=json.load(open(D/'products.json'));inputs={x['component']['id']:x['component'] for x in json.load(gzip.open(D/'input.json.gz','rt'))}
by_mpn=collections.defaultdict(list)
for cid,rec in products.items():
 if rec['mpn'] and rec.get('identityKind')!='manufacturer-model':by_mpn[norm(rec['mpn'])].append(cid)
out=collections.defaultdict(dict);rejected=collections.Counter()
with gzip.open(ROOT/'data/full-review/reviews.jsonl.gz','rt') as f:
 for line in f:
  row=json.loads(line)
  for page in row.get('primaryPages',[]):
   p=page.get('product') or {};ids=by_mpn.get(norm(p.get('mpn','')),[])
   if not ids or page.get('httpStatus')!=200 or not page['url'].startswith('https://www.pccomponentes.fr/'):continue
   offer=helper(p,page,p['mpn'])
   if not offer or offer['condition']!='new' or offer['availability']!='in_stock':rejected['not_an_explicit_in_stock_new_eur_offer']+=1;continue
   brand=p.get('brand') or {};brand=brand.get('name','') if isinstance(brand,dict) else brand
   for cid in ids:
    c=inputs[cid]
    if norm(brand)!=norm(c['brand']):rejected['explicit_brand_disagrees']+=1;continue
    cap=re.search(r'(?<!\d)(\d+)\s*(?:GB|Go)\b',p.get('name',''),re.I)
    if cap and int(cap[1])!=products[cid]['patch'].get('capacityGB',c.get('capacityGB')):rejected['explicit_capacity_disagrees']+=1;continue
    if re.search(r'\b(?:WHITE|BLANCHE?|BLANCA|BLANCO)\b',p.get('name',''),re.I) and not c.get('finishName','').startswith('Blanc'):rejected['explicit_white_finish_disagrees']+=1;continue
    proof={'offer':{**offer,'mpn':products[cid]['mpn']},'sourceSHA256':page['sha256'],'identityRule':'Exact explicit manufacturer part number; same brand and no contradictory capacity/white finish; nested primary Offer only.'}
    previous=out[cid].get(offer['url'])
    if not previous or previous['offer']['checkedAt']<offer['checkedAt']:out[cid][offer['url']]=proof
result={cid:list(v.values()) for cid,v in out.items()}
(D/'offer-proofs.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps({'gpuWithCurrentExactOffer':len(result),'offers':sum(map(len,result.values())),'rejectionsIncludingRepeatedCaptures':rejected}))
