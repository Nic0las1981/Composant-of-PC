"""Exhaustive ID ledger; candidate discovery is never technical verification.

Combines this agent's accepted records with distinct parallel PSU modules for
audit only. It does not modify those modules or their catalog integration.
"""
import collections,datetime,difflib,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-chassis';S=D/'sources'
coverage=json.loads((D/'coverage.json').read_text());own=json.loads((D/'confirmed-products.json').read_text());external={};owners={}
for p in (ROOT/'src/data').glob('deepPower*Catalog.ts'):
 if p.stem=='deepPowerChassisCatalog':continue
 try:
  raw=p.read_text();data=json.loads(raw.split(' = ',1)[1].rstrip().removesuffix(';'))
 except (ValueError,IndexError):continue
 for id,v in data.items():external[id]=v;owners[id]=str(p.relative_to(ROOT))
brands={'Seasonic':['seasonic.com'],'be quiet!':['bequiet.com','technikpr.'],'Cooler Master':['coolermaster.com','coolermaster.egnyte.com'],'Thermaltake':['thermaltake.com'],'EVGA':['evga.com'],'Corsair':['corsair.com'],'MSI':['msi.com'],'ASUS':['asus.com'],'DeepCool':['deepcool.com','gamersnetwork'],'Gigabyte':['gigabyte.com'],'NZXT':['nzxt.com'],'Phanteks':['phanteks.com'],'FSP':['fspgroup','fsplifestyle'],'Super Flower':['super-flower','superflower'],'Silverstone':['silverstonetek'],'Antec':['antec.com'],'Enermax':['enermax.'],'ADATA':['adata.com','xpg.com'],'Montech':['montechpc']}
def tokens(s):return set(re.findall(r'[A-Z]+|\d+(?:\.\d+)?',s.upper()))-{'W','POWER','SUPPLY','PSU','ATX','PC','THE','OF','PRODUCT','PRODUCTS','GLOBAL','EN','COOLER','MASTER'}
sources=collections.defaultdict(list)
for p in S.glob('*.json'):
 e=json.loads(p.read_text());url=e.get('url','');brand=next((b for b,hosts in brands.items() if any(h in url for h in hosts)),None)
 if not brand:continue
 title=e.get('productName') or e.get('sourceTitle') or (e.get('primaryText','').splitlines() or [''])[0]
 rows={r['label']:r['value'] for r in e.get('definitionPairs',[])}
 for table in e.get('tables',[]):
  for row in table:
   if len(row)>=2 and row[-2] in ['Model','Article number']:rows[row[-2]]=row[-1]
 if brand=='be quiet!' and rows.get('Model'):title=rows['Model']
 sources[brand].append({'sourceKey':p.stem,'url':url,'title':title,'manufacturerCode':rows.get('Article number',rows.get('Model')),'tokens':tokens(title),'retrieved':bool(e.get('primaryText') or e.get('tables')),'statusCode':e.get('statusCode'),'error':e.get('error'),'format':e.get('format')})
searches=collections.defaultdict(list)
for p in D.glob('search-*.json'):
 e=json.loads(p.read_text());query=e.get('query','')
 for b in brands:
  if b.lower().replace(' ','') in query.lower().replace(' ','') or (b=='be quiet!' and 'bequiet' in query.lower()):searches[b].append({'query':query,'sourceFile':str(p.relative_to(ROOT)),'returnedURLCount':len(e.get('urls',[]))})
out=[]
for x in coverage['products']:
 id=x['id'];v=own.get(id) or external.get(id);base=x['name'].split(' · ')[0];brand=x['brand'];entry={'id':id,'category':x['category'],'brand':brand,'archiveName':x['name'],'acceptedModule':'src/data/deepPowerChassisCatalog.ts' if id in own else owners.get(id),'acceptedNewManufacturerRecord':bool(v),'commercialIdentity':('model_only_regional_mpn_unknown' if v and v.get('identityKind')=='manufacturer-model' else 'manufacturer_part_number' if v else 'unresolved'),'manufacturerPartNumber':v.get('mpn') if v else None,'manufacturerModel':v.get('manufacturerModel') if v else None,'offerStatus':'no_new_offer_created_by_this_collection','ownCollectionDetails':x['indexResearch'],'missingExplicitFields':x['missingExplicitFields'] if id not in external else [],'sourceURLs':[s['url'] for s in (v or {}).get('sources',[])]}
 if v:entry.update(researchState='accepted_source_facts',reason='Les valeurs intégrées sont reliées à leurs preuves ; cette présence ne signifie ni fiche techniquement exhaustive ni prix disponible.');out.append(entry);continue
 bt=tokens(base);pool=sources[brand];ranked=sorted(pool,key=lambda e:len(bt&e['tokens'])/max(1,len(bt|e['tokens'])),reverse=True);candidates=[]
 for e in ranked:
  score=len(bt&e['tokens'])/max(1,len(bt|e['tokens']))
  if score<.25 or len(candidates)>=5:break
  candidates.append({k:v for k,v in e.items() if k!='tokens'}|{'nameSimilarityForDiscoveryOnly':round(score,3)})
 entry['candidateReferencesNotAccepted']=candidates;entry['brandSourcesExamined']=len(pool);entry['brandRetrievalFailures']=dict(collections.Counter(e['error'] for e in pool if e.get('error')))
 entry['relatedExactSearches']=[q for q in searches[brand] if len(tokens(q['query'])&bt)>=min(2,len(bt))]
 previous=x['manufacturerReference']
 if previous:state='previous_exact_evidence_only';reason='La référence '+previous+' possède déjà des preuves antérieures ; aucune nouvelle table primaire de cette révision n’a été ajoutée.'
 elif candidates:
  exact=[e for e in candidates if tokens(e['title'])==bt and e['retrieved']]
  state='individual_table_or_revision_unresolved' if exact else 'manufacturer_model_variant_not_proven'
  reason='Documents candidats examinés : '+ '; '.join(e['title'] or e['url'] for e in candidates[:3])+'. Aucun lien primaire non ambigu ne confirme la référence, la puissance, la finition et la révision de cette ligne d’archive. Les valeurs de ces candidats ne sont pas transférées.'
 else:state='not_found_in_collected_primary_indexes';reason='Aucun document concordant dans les '+str(len(pool))+' captures fabricant de '+brand+'. Les pages historiques absentes, redirigées et échecs HTTP sont conservés avec leur URL ; la désignation d’archive ne permet pas de reconstruire une référence régionale.'
 entry.update(researchState=state,reason=reason);out.append(entry)
assert len(out)==1891 and len({x['id'] for x in out})==1891
result={'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scopeCounts':coverage['scopeCounts'],'states':dict(collections.Counter(x['researchState'] for x in out)),'acceptedCountsByBrand':dict(collections.Counter(x['brand'] for x in out if x['acceptedNewManufacturerRecord'])),'limitations':['Un audit par ID ne signifie pas que la fiche est complète.','Une absence dans les index consultés ne prouve pas l’inexistence du produit.','Les candidats sont fournis pour contrôle, jamais comme identité ou caractéristiques acceptées.','Les modules parallèles peuvent encore évoluer ; relancer ce script après leur gel.'],'products':out}
(D/'exhaustive-audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in result.items() if k not in ['products','limitations']},ensure_ascii=False))
