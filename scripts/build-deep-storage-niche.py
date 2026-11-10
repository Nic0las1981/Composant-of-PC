"""Build individually matched small-brand SSD sheets from retained primary texts.

Search excerpts only discover URLs. Facts below require full fetched documents.
Conflicting dimensions, endurance and revision data remain explicit unknowns.
"""
from pathlib import Path
import json,re,hashlib,datetime,copy

ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/storage-niche'
INPUT=json.loads((OUT/'input.json').read_text());SOURCES={};PRODUCTS={};AUDIT=[]
for p in (OUT/'sources').glob('*.json'):
 d=json.loads(p.read_text())
 if d.get('status')==200:SOURCES[d['url']]=d
for p in [*OUT.glob('exa-fetch-*.json'),OUT/'exa-more-2.json']:
 raw=json.loads(p.read_text());text='\n'.join(c.get('text','') for c in raw['content'])
 for part in re.split(r'(?m)(?=^# .+\nURL:)',text):
  m=re.search(r'(?m)^URL: (https://\S+)',part)
  if not m:continue
  url=m[1];SOURCES[url]={'url':url,'text':part,'checkedAt':datetime.datetime.fromtimestamp(p.stat().st_mtime,datetime.timezone.utc).isoformat(),'sha256':hashlib.sha256(part.encode()).hexdigest(),'retrieval':'Exa full-page fetch','evidenceFile':str(p.relative_to(ROOT))}

def find(fragment):
 matches=[s for u,s in SOURCES.items() if fragment in u]
 assert matches,fragment
 return max(matches,key=lambda s:len(s.get('text','')))

def rows_of(text):
 return [(m[1].strip(),m[2].strip()) for m in re.finditer(r'(?m)^\|\s*([^|\n]+?)\s*\|\s*([^|\n]+?)\s*\|',text) if not m[1].strip().startswith('-')]

def record(c,mpn,source,rows,patch=None,notes=None,extra_sources=None):
 assert mpn in source['text'],(c['id'],mpn,source['url'])
 patch=patch or {};notes=notes or [];all_sources=[source]+(extra_sources or [])
 base=copy.deepcopy(next(x.get('verified') for x in INPUT if x['component']['id']==c['id']) or {})
 keep_offers=[o for o in base.get('offers',[]) if o['mpn']==mpn]
 p={'mpn':mpn,'identityNote':'Référence exacte rapprochée de la capacité et de la série dans le document cité.','sources':[{'name':('Mushkin' if 'mushkin' in s['url'] else 'GOODRAM' if 'goodram' in s['url'] else 'Apacer' if 'apacer' in s['url'] else 'Wootware' if 'wootware' in s['url'] else 'Newegg')+' — fiche technique','url':s['url'],'checkedAt':s['checkedAt'],'kind':'manufacturer' if any(h in s['url'] for h in ['mushkin.com','goodram.com','apacer.com']) else 'retailer'} for s in all_sources],
 'groups':[{'title':'Stockage · identification et performances','rows':[{'label':k,'value':str(v)} for k,v in rows if v not in (None,'','–','TBD')]}],
 'patch':{'manufacturerPartNumber':mpn,'capacityGB':c['capacityGB'],'storageInterface':'M.2 NVMe',**patch},'offers':keep_offers,'notes':notes}
 p['patch']['description']=f"{c['brand']} {p['patch'].get('name',c['name'])}. Référence {mpn} : caractéristiques et limites documentées dans la fiche détaillée."
 PRODUCTS[c['id']]=p
 AUDIT.append({'id':c['id'],'status':'documented','mpn':mpn,'sourceURLs':[s['url'] for s in all_sources],'technicalRows':len(p['groups'][0]['rows']),'notes':notes})

MUSHKIN={}
for s in SOURCES.values():
 if 'mushkin.com/product/' not in s['url']:continue
 rows=rows_of(s['text']);values=dict(rows)
 if values.get('Model','').startswith('MKNSSD'):MUSHKIN[values['Model']]=(s,rows,values)
translations={'Model':'Référence fabricant','Series':'Série','Form Factor':'Format M.2','Capacity':'Capacité','Interface':'Interface et protocole','Controller':'Contrôleur','Max Sequential Read':'Lecture séquentielle','Max Sequential Write':'Écriture séquentielle','Seek Time':'Temps de recherche','TBW':'Endurance TBW','MTBF':'MTBF','Operating Temperature':'Température de fonctionnement','Storage Temperature':'Température de stockage','Max Shock Resistance':'Résistance aux chocs','Weight':'Poids'}
for item in INPUT:
 c=item['component']
 if c['brand']!='Mushkin':continue
 name=c['name'];cap=c['capacityGB'];suffix=f'{cap//1000}TB' if cap>=1000 else f'{cap}GB'
 series=next((s for s in ['Gamma','Vortex Redline','Vortex-LX','Delta','Helix-L'] if name.startswith(s)),None)
 prefix={'Gamma':'GA','Vortex Redline':'VT','Vortex-LX':'VL','Delta':'DE','Helix-L':'HL'}.get(series)
 mpn=f'MKNSSD{prefix}{suffix}-D8' if prefix else name.split()[0]
 if mpn in MUSHKIN:
  s,raw,values=MUSHKIN[mpn];notes=[];rows=[]
  for label,value in raw:
   if label in translations:
    if label=='Capacity' and mpn=='MKNSSDDE4TB-D8':continue
    if label=='TBW' and (m:=re.search(r'or (\d+)TB TBW',s['text'])) and value!=m[1]:
     notes.append(f"Endurance contradictoire sur la page : tableau {value} TBW, clause de garantie {m[1]} TBW. Valeur non validée.");continue
    rows.append((translations[label],value))
  rows += [('Longueur','80 mm'),('Largeur','22 mm'),('Hauteur','3,8 mm'),('Garantie','5 ans limitée')]
  assert values['Height']=='80mm' and values['Width']=='22mm' and values['Depth']=='3.8mm'
  notes.append('Axes normalisés : la page nomme Height le côté de 80 mm et Depth l’épaisseur de 3,8 mm du module M.2 2280.')
  if series=='Delta':
   rows.append(('Type NAND · déclaration à recouper','La page indique 3D TLC, mais ses autres cellules comportent des incohérences ; type non validé.'))
  elif '3D TLC NAND' in s['text']:rows.append(('Type NAND','3D TLC NAND'))
  elif '3D NAND' in s['text']:rows.append(('Type NAND','3D NAND ; cellule TLC/QLC non précisée'))
  for tag,label in [('Power Consumption (Idle)','Consommation au repos'),('Power Consumption (Active)','Consommation active')]:
   m=re.search(re.escape(tag)+r': ([^|\n]+)',s['text'])
   if m:rows.append((label,m[1].strip()))
  for label in ['SLC caching','Host Memory Buffer','Security Erase','TRIM','S.M.A.R.T.','User-upgradeable firmware']:
   if label in s['text']:rows.append(('Fonction · '+label,'Publiée par le fabricant'))
  if mpn=='MKNSSDDE4TB-D8':notes.append('La référence et le titre indiquent 4 To, mais la cellule Capacity de la page indique 2TB : capacité historique conservée, contradiction signalée.');rows.append(('Capacité · divergence','Titre / MPN : 4 To ; cellule de spécifications : 2TB'))
  if values.get('Power Supply')=='5V DC':notes.append('La page indique 5 V pour ce module M.2 : tension non transférée en raison de cette incohérence.')
  patch={'lengthMm':80,'widthMm':22,'heightMm':3.8}
  if series is None:patch['name']=f'Endora {cap//1000} To · PCIe 4.0 ×4' if cap>=1000 else f'Endora {cap} Go · PCIe 4.0 ×4'
  record(c,mpn,s,rows,patch,notes)
  if mpn=='MKNSSDDE4TB-D8':PRODUCTS[c['id']]['fieldEvidence']={'capacity':{'value':'Titre et MPN : 4 To ; cellule de spécifications : 2TB','sourceURL':s['url'],'checkedAt':s['checkedAt'],'conflicting':True,'reason':'Contradiction interne à la page fabricant.'}}
 elif series=='Helix-L':
  s=find('wootware.co.za/mushkin-mknssdhl512gb'); rows=[('Référence fabricant',mpn),('Capacité','512 Go'),('Interface et protocole','PCIe 3.0 x4 NVMe 1.3'),('Format M.2','2280'),('Type NAND','3D TLC'),('Contrôleur','Silicon Motion SM2263XT'),('Lecture séquentielle','2 105 Mo/s maximum'),('Écriture séquentielle','1 670 Mo/s maximum'),('Lecture aléatoire','240 000 IOPS maximum'),('Écriture aléatoire','260 000 IOPS maximum'),('Endurance TBW','300 TBW'),('Garantie','3 ans ou 300 TBW'),('Longueur','80 mm'),('Largeur','22 mm'),('Hauteur','3,8 mm'),('Poids','7 g'),('MTBF','1,5 million d’heures')]
  record(c,mpn,s,rows,{'name':'Helix-L 512 Go · PCIe 3.0 ×4','lengthMm':80,'widthMm':22,'heightMm':3.8,'specs':['512 Go','M.2 2280 · PCIe 3.0 ×4 NVMe 1.3','Lecture 2 105 Mo/s · écriture 1 670 Mo/s']},['La fiche marchande identifie le MPN 512 Go exact. L’ancienne génération PCIe 4.0 de l’archive est corrigée en PCIe 3.0. Aucun prix étranger n’est importé.'])
 elif series=='Vortex Redline' and cap==4000:
  s=find('newegg.com/mushkin-enhanced-4tb');raw=rows_of(s['text']);rows=[(translations.get(k,k),v) for k,v in raw if k in translations or k in ['Part Number','Memory Components','Protocol','4KB Random Read','4KB Random Write','Terabytes Written (TBW)']]
  rows += [('Interface et protocole','PCIe 4.0 x4 NVMe 1.4'),('Type NAND','3D NAND ; cellule non précisée'),('Endurance TBW','2 000 TBW')]
  record(c,mpn,s,rows,notes=['Le catalogue officiel confirme le MPN Vortex 4 To. Les mesures proviennent de sa fiche Newegg exacte. Garantie contradictoire entre les sections 5 ans et 3 ans : non validée.'],extra_sources=[find('products2/257-vortex')])
 else:AUDIT.append({'id':c['id'],'status':'source_missing','reason':'Aucune fiche primaire exacte exploitable.'})

def family(brand,prefix,source_fragment,entries,common,dimensions=None,notes=None,extra=None):
 s=find(source_fragment)
 for item in INPUT:
  c=item['component']
  if c['brand']!=brand or not c['name'].startswith(prefix):continue
  if prefix=='AS2280Q4' and c['name'].startswith('AS2280Q4U'):continue
  v=entries.get(c['capacityGB'])
  if not v:
   AUDIT.append({'id':c['id'],'status':'unconfirmed_variant','reason':'Cette capacité n’est pas publiée dans la gamme constructeur consultée.','sourceURL':s['url']});continue
  mpn,read,write,tbw,rr,rw=v
  rows=[('Référence fabricant',mpn),('Capacité',f"{c['capacityGB']} Go"),('Lecture séquentielle',f'{read} Mo/s maximum'),('Écriture séquentielle',f'{write} Mo/s maximum'),('Lecture aléatoire',f'{rr} IOPS maximum'),('Écriture aléatoire',f'{rw} IOPS maximum'),('Endurance TBW',f'{tbw} TBW'),*common]
  patch={}
  if dimensions:
   for label,key,value in zip(['Longueur','Largeur','Hauteur'],['lengthMm','widthMm','heightMm'],dimensions):
    if value is not None:patch[key]=value;rows.append((label,f'{value} mm'))
  record(c,mpn,s,rows,patch,notes,[find(x) for x in (extra or [])])

family('GOODRAM','PX700','datasheet-goodram-ssd-px700-eng-1.3.pdf',{
 1024:('SSDPR-PX700-01T-80',7400,6500,600,1000000,820000),2048:('SSDPR-PX700-02T-80',7400,6500,1200,1000000,820000),4096:('SSDPR-PX700-04T-80',7400,6500,2400,1000000,1000000)},
 [('Interface et protocole','PCIe 4.0 x4 NVMe'),('Format M.2','2280, clé M'),('Type NAND','3D NAND'),('Garantie','5 ans limitée par TBW'),('MTBF','1 500 000 heures'),('Température de fonctionnement','0 à 70 °C'),('Température de stockage','−40 à 85 °C'),('Dissipateur','Module avec fine étiquette thermique ; aucun dissipateur volumineux fourni'),('Poids','9 g')],[80,22,2.65],['La page produit donne explicitement 1 024 / 2 048 / 4 096 Go, alors que le PDF abrège en 1 / 2 / 4 To. Les capacités détaillées de la page sont conservées.'],['products/goodram-px700-ssd-2/'])
for prefix,fragment,part,height,reads,writes,tbws,rr,rw,controller,mtbf in [
 ('IRDM PRO GEN 5','datasheet-irdm_pro_gen-5_en.pdf','P54S',3.6,[11500,12000,12000],[9000,11000,11000],[700,1400,3000],[1300000,1400000,1400000],[1400000]*3,'Phison PS5026-E26',1600000),
 ('IRDM PRO SLIM','datasheet-irdm_pro_slim-eng-6.pdf','P44S',3.8,[7000]*3,[5500,6850,6850],[700,1400,3000],[350000,650000,650000],[700000]*3,'Phison PS5018-E18',2000000)]:
 entries={cap:(f'IRP-SSDPR-{part}-{cap//1000}K0-80',reads[i],writes[i],tbws[i],rr[i],rw[i]) for i,cap in enumerate([1000,2000,4000])}
 family('GOODRAM',prefix,fragment,entries,[('Interface et protocole','PCIe 5.0 x4 NVMe 2.0' if part=='P54S' else 'PCIe 4.0 x4 NVMe 1.4'),('Format M.2','2280, clé M'),('Type NAND','3D TLC'),('Contrôleur',controller),('Mémoire tampon','DRAM présente'),('Garantie','5 ans limitée par TBW'),('MTBF',f'{mtbf} heures'),('Dissipateur','Module nu'),('Gestion de la mémoire','ECC, wear leveling, bad block management, TRIM, SMART, over provision, firmware upgrade, thermal throttling'),('Gestion de durée de vie','Media wear indicator ; read-only mode en fin de vie'),('Sécurité','NVMe Format'),('Cache','SLC caching')],[80,22,height])

family('Apacer','AS2280Q4U','AS2280Q4U_3D%20NAND_Spec_v1.1.pdf',{
 512:('AP512GAS2280Q4U-1',7000,3000,350,450000,300000),1000:('AP1TBAS2280Q4U-1',7300,6000,750,750000,1000000),2000:('AP2TBAS2280Q4U-1',7400,7000,1500,1000000,1000000)},
 [('Interface et protocole','PCIe 4.0 x4 NVMe 1.4'),('Format M.2','2280, 75 contacts'),('Type NAND','3D NAND'),('Garantie','5 ans ou TBW, première limite atteinte'),('Dissipateur','Fourni séparément, à installer au choix'),('Dimensions du module nu','80 × 22 × 2,25 mm (simple face) ou 3,5 mm (double face)'),('Dimensions avec dissipateur','80 × 22,9 × 10,8 mm maximum'),('Consommation active','9,7 W maximum, varie selon capacité et configuration'),('Alimentation','3,3 V ± 5 %'),('MTBF','Plus de 1 600 000 heures'),('Température de fonctionnement','0 à 70 °C'),('Température de stockage','−40 à 85 °C'),('Résistance aux chocs','1 500 G'),('Gestion de la mémoire','Global wear leveling, bad block management, SMART, TRIM, over provisioning')],[80,22,None],['La fiche ne rattache pas chaque capacité au PCB simple ou double face. L’épaisseur du module nu reste non affectée ; toutes les enveloppes publiées sont détaillées.'],['Data%20Sheet_AS2280Q4U.pdf'])
family('Apacer','AS2280Q4','AS2280Q4_Spec_Sheet_rev1-1.pdf',{
 500:('AP500GAS2280Q4-1',4500,2500,400,150000,300000),1000:('AP1TBAS2280Q4-1',5000,4400,1650,750000,750000),2000:('AP2TBAS2280Q4-1',5000,4400,3350,750000,750000)},
 [('Interface et protocole','PCIe 4.0 x4 NVMe 1.3'),('Format M.2','2280'),('Type NAND','3D TLC'),('Garantie','3 ans limitée, selon la fiche commerciale'),('Dissipateur','Dissipateur dédié fourni'),('Consommation active','6,7 W maximum'),('Consommation en état d’économie','Inférieure à 21,12 mW'),('Alimentation','3,3 V ± 5 %'),('MTBF','Plus de 1 500 000 heures'),('Température de fonctionnement','0 à 70 °C'),('Température de stockage','−40 à 85 °C'),('Résistance aux chocs','1 500 G'),('Gestion de la mémoire','Bad block management, SMART, power failure management, TRIM, over provisioning'),('Dimensions · divergence','PDF technique : 3,88 mm dans le résumé et 1,20/1,35 mm dans le plan ; fiche commerciale : 2,25/3,50 mm selon PCB')],[80,22,None],['Les documents officiels divergent sur l’épaisseur. Aucune hauteur unique n’est inventée.'],['Data%20Sheet_AS2280Q4.pdf'])

OUT.mkdir(exist_ok=True)
(OUT/'products.json').write_text(json.dumps(PRODUCTS,ensure_ascii=False,indent=2)+'\n')
(OUT/'review.json').write_text(json.dumps({'total':35,'documented':len(PRODUCTS),'records':AUDIT},ensure_ascii=False,indent=2)+'\n')
(OUT/'retained-source-index.json').write_text(json.dumps([{k:s.get(k) for k in ['url','checkedAt','sha256','retrieval','evidenceFile']} for s in SOURCES.values()],ensure_ascii=False,indent=2)+'\n')
(ROOT/'src/data/deepStorageNicheCatalog.ts').write_text("import type {VerifiedProduct} from './verifiedTypes.ts';\n// Generated by scripts/build-deep-storage-niche.py from retained exact-source documents.\nexport const deepStorageNicheProducts:Record<string,VerifiedProduct>="+json.dumps(PRODUCTS,ensure_ascii=False,separators=(',',':'))+';\n')
print(json.dumps({'documented':len(PRODUCTS),'reviewed':len(AUDIT),'technicalRows':sum(len(p['groups'][0]['rows']) for p in PRODUCTS.values())}))
