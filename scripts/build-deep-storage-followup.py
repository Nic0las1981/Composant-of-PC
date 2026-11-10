"""Reconcile exact SSD capacity/heat-sink records from retained manufacturer evidence.

Never construct an MPN, import foreign prices, or copy a neighbouring capacity.
This follow-up writes its own overlay only; baseline modules are immutable inputs.
"""
from pathlib import Path
import copy, gzip, hashlib, html, json, re

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data/deep-review/storage-followup'
OLD=ROOT/'data/deep-review/memory-storage'
baseline=json.loads(gzip.decompress((OUT/'baseline.json.gz').read_bytes()))
products={}; reviews=[]; visuals=[]
def clean(t): return html.unescape(re.sub(r'\s+',' ',re.sub('<[^>]+>',' ',t))).strip()
def source(url,date,name='TEAMGROUP — fiche fabricant et tableau exact des références',kind='manufacturer'):
 return dict(name=name,url=url,checkedAt=date,kind=kind)
def evidence(value,s):return dict(value=value,sourceURL=s['url'],checkedAt=s['checkedAt'])
def rowsmap(rows):return {r['label']:r['value'] for r in rows}
def nand_type(text):
 if re.search(r'(?:3D TLC|TLC 3D NAND)',text,re.I):return '3D TLC'
 if re.search(r'(?:3D QLC|QLC 3D NAND)',text,re.I):return '3D QLC'
 if re.search(r'3D NAND',text,re.I):return '3D NAND ; cellule TLC/QLC non précisée'
def record(c,mpn,rows,patch,sources,note='',proof=None):
 p=dict(mpn=mpn,identityNote='Capacité, famille et variante rapprochées de la référence exacte publiée ; aucun MPN reconstruit.',sources=sources,groups=[dict(title='Stockage · référence et caractéristiques publiées',rows=rows)],patch=dict(manufacturerPartNumber=mpn,**patch),offers=[],notes=[note] if note else [],fieldEvidence=proof or {})
 p['patch']['description']=f"{c['brand']} {c['name']}. Référence {mpn} ; caractéristiques documentées par capacité et version."
 for k,v in p['patch'].items():
  if k!='description' and k not in p['fieldEvidence']:p['fieldEvidence'][k]=evidence(v,sources[0])
 products[c['id']]=p
 reviews.append(dict(id=c['id'],name=c['name'],mpn=mpn,state='exact_mpn_documented',sourceURLs=[s['url'] for s in sources]))
 return p

# Explicit archive-family aliases, preserving all substantive variant words.
aliases={
 'T-Force Cardea Z540':'cardea-z540','Cardea Zero Z440 Graphene':'cardea-zero-z440',
 'T-Create Classic DL':'classic-pcie4-dl','T-Create Classic':'classic-pcie4',
 'T-Create Classic C47':'classic-c47','T-Create Classic C45':'classic-c45','T-Create Classic I45':'classic-i45',
 'T-Force Cardea A440 Pro Special Series':'cardea-a440-pss',
 'T-FORCE G70 PRO Graphene':'g70-pro','T-FORCE G70 PRO Aluminum':'g70-pro',
 'T-Force GE PRO Graphene':'ge-pro','T-Force GE PRO AirFlow':'ge-pro',
}
team=json.loads((OLD/'teamgroup-catalog.json').read_text())
for b in baseline:
 c=b['component']
 if b['product'] or c['brand']!='TeamGroup':continue
 family=re.split(r'\s+\d+(?:\.\d+)? (?:To|Go)',c['name'])[0]
 slug=aliases.get(family)
 if not slug:continue
 candidates=[r for r in team if r.get('category')=='storage' and '/'+slug+'/' in r['familyURL'] and float(re.search(r'[\d.]+',r['capacity'])[0])*(1000 if 'TB' in r['capacity'] else 1)==c['capacityGB']]
 if not candidates:continue
 url=candidates[0]['familyURL'];key=hashlib.sha256(url.encode()).hexdigest()[:20]
 raw=gzip.decompress((OLD/'teamgroup-family-pages'/f'{key}.html.gz').read_bytes()).decode()
 meta=json.loads((OLD/'teamgroup-family-pages'/f'{key}.json').read_text());s=source(url,meta['checkedAt'])
 variants={mpn:label for label,mpn in re.findall(r'"data_group_spec1":"([^"]+)"[^{}]*?"data_blink":"[^"/]*-(TM[A-Z0-9]+)"',raw)}
 if len(candidates)>1:
  want=next((v for v in ['Graphene','Aluminum','AirFlow'] if v in family),None)
  candidates=[r for r in candidates if want and want in variants.get(r['mpn'],'')]
 if len(candidates)!=1:continue
 r=candidates[0];mpn=r['mpn']
 headings=[clean(t) for t in re.findall(r'<th class="specTableColumn"[^>]*>(.*?)</th>',raw,re.S)]
 exact=[]
 for tr in re.findall(r'<tr class="specTableRow specTableRowContent">(.*?)</tr>',raw,re.S):
  cells=[clean(x) for x in re.findall(r'<td[^>]*>(.*?)</td>',tr,re.S)]
  if mpn in cells:exact=[dict(label=k,value=v) for k,v in zip(headings,cells) if k!='Compare']
 if not exact:continue
 shared=[dict(label=clean(a),value=clean(v)) for a,v in re.findall(r'<div class="leftTitle">(.*?)</div>\s*<div class="text">(.*?)</div>',raw,re.S)]
 sm=rowsmap(shared);em=rowsmap(exact)
 patch=dict(capacityGB=c['capacityGB'],storageInterface='M.2 NVMe')
 proof={k:evidence(v,s) for k,v in patch.items()}
 for label,k in [('Sequential Read','read'),('Sequential Write','write'),('Terabyte Written','endurance'),('DRAM Cache','dramCache')]:
  if em.get(label):proof[k]=evidence(em[label],s)
 interface=sm.get('Interface','').replace('Gen','').replace('x',' ×')
 if interface:proof['interfaceGeneration']=evidence(interface,s);exact.append(dict(label='Interface et protocole',value=interface))
 warranty=next((r['value'] for r in shared if 'Warranty' in r['label']),None)
 if warranty:proof['warranty']=evidence(warranty,s)
 dims=sm.get('Dimensions','')
 variant=variants.get(mpn,'')
 cooling=next((v for v in ['Graphene','Aluminum','AirFlow'] if v in variant),'')
 if not cooling and re.search(r'graphene heat',clean(raw),re.I):cooling='Graphene'
 if not cooling and re.search(r'with Aluminum heat sink',dims,re.I):cooling='Aluminum'
 if cooling:
  patch['storageHeatsink']=True;proof['heatsink']=evidence(cooling+' heat sink',s);exact.append(dict(label='Dissipateur',value=cooling+' heat sink'))
 chunks=re.findall(r'([\d.]+)\(L\)\s*x\s*([\d.]+)\(W\)\s*x\s*([\d.]+)\(H\)\s*mm([^\d]*)(?=\d|$)',dims)
 chosen=[x for x in chunks if len(chunks)==1 or cooling and cooling in x[3]]
 if len(chosen)==1:
  l,w,h=map(float,chosen[0][:3])
  if cooling=='AirFlow':
   # Published 77 mm is the cooler body; it is not the 80 mm PCB length.
   patch.update(widthMm=w,heightMm=h);exact.append(dict(label='Dimensions du refroidisseur AirFlow I',value=f'{l} × {w} × {h} mm'))
  else:patch.update(lengthMm=l,widthMm=w,heightMm=h)
  proof['formFactor']=evidence('M.2 2280',s);exact.append(dict(label='Format M.2',value='M.2 2280'))
 for k,v in patch.items():proof[k]=evidence(v,s)
 text=clean(raw)
 nand=nand_type(text)
 if nand:proof['nand']=evidence(nand,s);exact.append(dict(label='Type NAND',value=nand))
 p=record(c,mpn,exact+shared,patch,[s],proof=proof)
 if cooling=='AirFlow':p['notes'].append('La longueur de 77 mm publiée concerne le refroidisseur ; la longueur totale de l’assemblage reste à documenter.')
 visuals.append(dict(id=c['id'],mpn=mpn,scope='family',imageURL=r['imageURL'],sourceURL=url,checkedAt=s['checkedAt'],inspection='visually-inspected',eligibleForProductPhoto=cooling!='AirFlow' and slug!='g70-pro',note='Image GE PRO Graphene : refroidisseur AirFlow absent, illustration exclue pour cette variante.' if cooling=='AirFlow' else 'Composition de deux variantes G70 PRO, Graphene et Aluminum ; référence visuelle de famille uniquement.' if slug=='g70-pro' else 'Photographie de famille ; capacité commerciale exacte non revendiquée.'))

# Complete already identified TEAMGROUP records from their own retained family page.
# Preserve every existing source, offer, row and compatibility patch.
for b in baseline:
 c=b['component'];p=b['product']
 if not p or c['brand']!='TeamGroup':continue
 r=next((r for r in team if r.get('category')=='storage' and r['mpn']==p['mpn']),None)
 if not r:continue
 url=r['familyURL'];key=hashlib.sha256(url.encode()).hexdigest()[:20];path=OLD/'teamgroup-family-pages'/f'{key}.html.gz'
 if not path.exists():continue
 raw=gzip.decompress(path.read_bytes()).decode();meta=json.loads(path.with_suffix('').with_suffix('.json').read_text());s=source(url,meta['checkedAt'])
 text=clean(raw);missing={f['key'] for f in b['completion']['technical']['fields'] if f['state']!='documented'};updates={}
 if 'nand' in missing:
  nand=nand_type(text)
  if nand:updates['nand']=nand
 if 'heatsink' in missing:
  variants={mpn:label for label,mpn in re.findall(r'"data_group_spec1":"([^"]+)"[^{}]*?"data_blink":"[^"/]*-(TM[A-Z0-9]+)"',raw)}
  v=variants.get(p['mpn'],'');cooling=next((v2 for v2 in ['Graphene','Aluminum','AirFlow'] if v2 in v),None)
  dims=next((clean(v) for label,v in re.findall(r'<div class="leftTitle">(.*?)</div>\s*<div class="text">(.*?)</div>',raw,re.S) if clean(label)=='Dimensions'),'')
  if not cooling and not re.search('AirFlow|Aluminum',dims,re.I) and re.search(r'graphene (?:heat[ -]?(?:sink|spreader)|label)|heat.dissipating graphene label',text,re.I):cooling='Graphene'
  if cooling:updates['heatsink']=cooling+' heat sink / spreader'
 if not updates:continue
 product=copy.deepcopy(p)
 if not any(x['url']==url for x in product['sources']):product['sources'].append(s)
 product.setdefault('fieldEvidence',{}).update({k:evidence(v,s) for k,v in updates.items()})
 product['groups'].append(dict(title='Complément fabricant · NAND et refroidissement',rows=[dict(label={'nand':'Type NAND','heatsink':'Dissipateur'}[k],value=v) for k,v in updates.items()]))
 if 'heatsink' in updates:product['patch']['storageHeatsink']=True;product['fieldEvidence']['storageHeatsink']=evidence(True,s)
 products[c['id']]=product
 reviews.append(dict(id=c['id'],name=c['name'],mpn=p['mpn'],state='existing_record_enriched',fields=list(updates),sourceURLs=[url]))

# Older members are explicitly included in retained multiproduct PDF tables.
pdfs=json.loads((OLD/'teamgroup-datasheets.json').read_text())
pdf_specs={
 'T-FORCE G50 PRO':('g50',{'512':('TM8FFF512G0C129',5000,2500,325),'1000':('TM8FFF001T0C129',5000,4800,650),'2000':('TM8FFF002T0C129',5000,4800,1300)},True,3000000),
 'T-Create Classic C43':('c45',{'512':('TM8FFA512G0C129',3300,2400,300),'1000':('TM8FFA001T0C129',3500,2700,600)},False,1700000),
 'T-FORCE Z44A3':('z44a5',{'512':('TM8FPX512G0C129',3300,2400,300),'1000':('TM8FPX001T0C129',3500,2700,600),'2000':('TM8FPX002T0C129',3500,3200,1200)},False,1700000),
}
for b in baseline:
 c=b['component'];fam=re.split(r'\s+\d+(?:\.\d+)? (?:To|Go)',c['name'])[0]
 if b['product'] or c['brand']!='TeamGroup' or fam not in pdf_specs:continue
 slug,capacities,dram,mtbf=pdf_specs[fam];mpn,read,write,tbw=capacities[str(c['capacityGB'])]
 d=next(d for d in pdfs if '/'+slug+'/' in d['url']);assert mpn in d['text']
 s=source(d['url'],d['checkedAt'],'TEAMGROUP — PDF officiel, tableaux capacité et commande')
 vals={'Référence fabricant':mpn,'Capacité':f"{c['capacityGB']} Go",'Interface et protocole':'PCIe 4.0 ×4 NVMe','Format M.2':'M.2 2280','Lecture séquentielle':f'{read} Mo/s maximum','Écriture séquentielle':f'{write} Mo/s maximum','Endurance TBW':f'{tbw} TBW','Cache DRAM':'Oui' if dram else 'Non','Dissipateur':'Graphene ultrafin','Dimensions':'80 × 22 × 3,7 mm','Poids':'7 g','Garantie':'5 ans ou TBW, première limite atteinte','MTBF':f'{mtbf} heures','Température de fonctionnement':'0 à 70 °C','Température de stockage':'−40 à 85 °C','Alimentation':'3,3 V','Résistance aux chocs':'1 500 G / 0,5 ms'}
 proof={k:evidence(vals[label],s) for k,label in {'read':'Lecture séquentielle','write':'Écriture séquentielle','endurance':'Endurance TBW','warranty':'Garantie','heatsink':'Dissipateur','formFactor':'Format M.2','interfaceGeneration':'Interface et protocole'}.items()}
 record(c,mpn,[dict(label=k,value=v) for k,v in vals.items()],dict(capacityGB=c['capacityGB'],storageInterface='M.2 NVMe',lengthMm=80,widthMm=22,heightMm=3.7,storageHeatsink=True),[s],proof=proof)

# The unqualified Corsair MP600 500 GB archive cannot select original vs R2.
# Both published variants remain unresolved until a revision discriminant exists.

# Manually reviewed additional sources are separate immutable inputs.
extra=OUT/'manual-products.json'
if extra.exists():
 for id,p in json.loads(extra.read_text()).items():
  assert id not in products
  products[id]=p
  c=next(b['component'] for b in baseline if b['component']['id']==id)
  reviews.append(dict(id=id,name=c['name'],mpn=p['mpn'],state='exact_mpn_documented' if p['mpn'] else 'manufacturer_model_documented',sourceURLs=[s['url'] for s in p['sources']]))

unresolved=json.loads((OUT/'unresolved-evidence.json').read_text()) if (OUT/'unresolved-evidence.json').exists() else {}
for b in baseline:
 if not b['product'] and b['component']['id'] not in products:
  reviews.append(dict(id=b['component']['id'],name=b['component']['name'],state='research_open',**unresolved.get(b['component']['id'],dict(reason='Aucune preuve supplémentaire suffisamment discriminante admise dans cette passe.'))))
OUT.mkdir(exist_ok=True)
(OUT/'products.json').write_text(json.dumps(products,ensure_ascii=False,indent=2)+'\n')
(OUT/'review.json').write_text(json.dumps(reviews,ensure_ascii=False,indent=2)+'\n')
(OUT/'visual-sources.json').write_text(json.dumps(visuals,ensure_ascii=False,indent=2)+'\n')
(ROOT/'src/data/deepStorageFollowupCatalog.ts').write_text("import type {VerifiedProduct} from './verifiedTypes.ts';\n// Generated by scripts/build-deep-storage-followup.py from retained, exact sources.\nexport const deepStorageFollowupProducts:Record<string,VerifiedProduct>="+json.dumps(products,ensure_ascii=False,separators=(',',':'))+';\n')
print(json.dumps({'products':len(products),'resolvedInitialIdentities':sum(not b['product'] and b['component']['id'] in products for b in baseline),'unresolvedInitialIdentities':sum(r['state']=='research_open' for r in reviews),'visualReferences':len(visuals)}))
