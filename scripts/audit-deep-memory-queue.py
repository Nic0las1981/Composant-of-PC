"""Classify every assigned archive ID without calling an unsearched variant absent.
Distinguishes documented commercial ambiguity, actual inaccessible exact sources,
and open research. Coverage means enriched evidence, never user-request completion.
"""
from pathlib import Path
import collections,datetime,gzip,json,re,unicodedata
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/memory-storage'
items=json.loads(gzip.decompress((OUT/'input.json.gz').read_bytes()));products=json.loads((OUT/'products.json').read_text());audit={x['id']:x for x in json.loads((OUT/'audit.json').read_text())['records']};index=json.loads((OUT/'published-identity-index.json').read_text());own={'Samsung','Crucial','Kingston','Corsair','ADATA','TeamGroup','Silicon Power','Patriot'}
failed={}
for path in [OUT/'kingston-legacy-datasheets.json',OUT/'kingston-datasheets.json']:
 for d in json.loads(path.read_text()):
  if d.get('mpn') and d.get('error'):failed[d['mpn']]=d
def norm(s):return re.sub(r'[^a-z0-9α]+',' ',unicodedata.normalize('NFKD',str(s).lower())).strip()
def fam(c):
 f=re.split(r'\s+\d+(?:\.\d+)?\s*(?:Go|To|GB|TB)\b',c['name'])[0].strip()
 if c['brand']=='TeamGroup':f=re.sub(r'^T-(?:Force|Create)\s+','',f,flags=re.I)
 if c['brand']=='Patriot' and c['category']=='storage':f=re.sub(r'^Viper(?: Gaming)?\s+','',f,flags=re.I)
 if c['brand']=='Corsair' and f=='MP600 Force Series Gen4':f='MP600'
 return f
def samefamily(c,r):
 a,b=fam(c),r['family']
 if c['brand']=='Silicon Power':a=re.sub(r'\bGaming\b','',a);b=re.sub(r'\bGaming\b','',b)
 if c['brand']=='G.Skill' and a=='Aegis' and b in ['Aegis DDR4','Aegis DDR5']:b='Aegis'
 return norm(a)==norm(b) or (c['brand']=='Crucial' and a.upper()==r['mpn'].upper())
records=[]
for item in items:
 c=item['component'];id=c['id'];v=products.get(id);a=audit[id];assigned=c['category']=='ram' or c['brand'] in own
 row={'id':id,'brand':c['brand'],'category':c['category'],'name':c['name'],'assignedToMemoryStorage':assigned,'enrichedHere':bool(v),'completeForUserRequest':False}
 if not assigned:row.update(state='assigned_to_other_agent',reason='SSD affecté à un collecteur distinct ; consulter son registre.');records.append(row);continue
 if v:
  row.update(state='commercial_variant_ambiguous' if v.get('identityKind')=='manufacturer-model' else 'exact_mpn_documented',mpn=v['mpn'],manufacturerModel=v.get('manufacturerModel'),candidateMPNs=a.get('candidateMPNs',[]),sourceURLs=[s['url'] for s in v['sources']],fieldEvidenceKeys=sorted(v.get('fieldEvidence',{})))
  row['reason']='Seule l’intersection des faits de tous les candidats est publiée ; MPN et prix restent inconnus.' if v.get('identityKind')=='manufacturer-model' else 'Le MPN est établi. Cette ligne ne déclare pas tous les champs, prix et visuels complets.'
 else:
  mpn=a.get('priorMPN');family=[r for r in index.get(c['brand'],[]) if samefamily(c,r) and (r.get('category') or 'ram')==c['category']]
  keys=['memoryType','capacityGB','memorySticks','memorySpeedMTs','casLatency'] if c['category']=='ram' else ['capacityGB','storageInterface']
  core=[r for r in family if all(c.get(k)==r['patch'].get(k) for k in keys)]
  row.update(familyRecordsExamined=len(family),coreAttributeCandidates=sorted({r['mpn'] for r in core}),sourceURLs=sorted({r['url'] for r in core}),priorMPN=mpn)
  if a.get('quarantine') or a.get('conflict') or a.get('conflicts'):row.update(state='identity_conflict',reason=a['reason'])
  elif mpn in failed:row.update(state='exact_source_inaccessible',reason=failed[mpn]['error'],failedSource=failed[mpn])
  elif core:row.update(state='finish_or_revision_ambiguous',reason='Des références correspondent aux caractéristiques principales, mais la finition, le format ou la révision de l’archive ne sont pas établis pour elles.')
  elif family:row.update(state='research_open_variant',reason='La famille est documentée ; aucun SKU admis ne prouve cette combinaison exacte de capacité, kit, génération, débit et CAS. Référence ancienne, erreur d’archive ou source complémentaire restent à départager.')
  else:row.update(state='research_open_family',reason='Aucune fiche de cette famille exacte n’est admise dans les index collectés. La recherche reste ouverte ; cela ne signifie pas que le produit n’existe pas.')
 records.append(row)
summary={}
for brand in sorted({x['brand'] for x in records if x['assignedToMemoryStorage']}):
 selected=[x for x in records if x['brand']==brand and x['assignedToMemoryStorage']];summary[brand]={'total':len(selected),'ram':sum(x['category']=='ram' for x in selected),'storage':sum(x['category']=='storage' for x in selected),'enriched':sum(x['enrichedHere'] for x in selected),'states':dict(collections.Counter(x['state'] for x in selected))}
payload={'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'totalQueue':len(records),'assignedQueue':sum(x['assignedToMemoryStorage'] for x in records),'summaryByBrand':summary,'records':records,'unavailableExactPDFs':[{'mpn':m,'url':d['url'],'error':d['error'],'checkedAt':d['checkedAt']} for m,d in failed.items()]}
(OUT/'queue-status.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n');(OUT/'brand-status.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False))
