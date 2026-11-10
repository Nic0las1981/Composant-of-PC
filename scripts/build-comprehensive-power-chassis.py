"""Publish only source-backed projections; audit every power/chassis/CPU catalog ID."""
import json,re,copy,runpy,subprocess,datetime
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];E=ROOT/'data/comprehensive-review/power-chassis-evidence'
# Export before integration or after it: this is only a base for additions, never visual profiles.
export_source="""import {catalog} from './src/data/catalog.ts';import {manuallyReviewedProducts} from './src/data/verifiedCatalog.ts';import {verifiedBulk} from './src/data/verifiedBulk.ts';import {individualPsuRecords} from './src/data/individualPsu.ts';const verified={...verifiedBulk,...manuallyReviewedProducts,...individualPsuRecords};console.log(JSON.stringify(catalog.filter(c=>['cpu','psu','cooler','case'].includes(c.category)).map(component=>({component,verified:verified[component.id]??null}))));"""
items=json.loads(subprocess.check_output(['npx','tsx','-e',export_source],cwd=ROOT,text=True))
byid={a['component']['id']:a for a in items};records={}
parse_offer=runpy.run_path(str(ROOT/'scripts/primary-review-offer.py'))['main_offer']
def group(title,rows):return {'title':title,'rows':[{'label':str(k),'value':str(v)} for k,v in rows]}
def existing(id):
 if id not in records:records[id]=copy.deepcopy(byid[id]['verified'])
 return records[id]
def record(id,mpn,evidence,name,patch,rows,notes=None):
 e=json.loads((E/(evidence+'.json')).read_text());old=byid[id]['verified'];r=copy.deepcopy(old) if old and old['mpn']==mpn else {'mpn':mpn,'identityNote':f'Référence exacte {mpn} identifiée sur la source primaire. Les autres versions, couleurs et puissances sont distinctes.','sources':[],'groups':[],'patch':{},'offers':[],'notes':[]}
 r['sources'].append({'name':name,'url':e['url'],'checkedAt':e['checkedAt'],'kind':'manufacturer'});r['patch'].update(patch);r['patch']['manufacturerPartNumber']=mpn;r['groups'].append(group('Complément vérifié — '+name,rows));r['notes']+=notes or []
 offerfile=E/('pcc-'+mpn+'.json')
 if offerfile.exists():
  p=json.loads(offerfile.read_text());assert p['product']['mpn'].upper()==mpn.upper();o=parse_offer(p['product'],p,mpn)
  if o and o['availability']=='in_stock' and o['condition']=='new':
   r['offers']=[o];r['sources'].append({'name':'PcComponentes','url':p['url'],'checkedAt':p['checkedAt'],'kind':'retailer'})
 records[id]=r;return r
# Transfer explicit primary tables into structured fields. Dates/offers are untouched.
for a in items:
 c=a['component'];v=a['verified']
 if not v or c['category'] not in ['case','cooler']:continue
 rows={r['label']:r['value'] for g in v['groups'] for r in g['rows']};p={}
 def mm(label):
  s=rows.get(label,'');m=re.fullmatch(r'([\d.,]+)\s*(mm|cm)',s.strip());return float(m[1].replace(',','.'))*(10 if m[2]=='cm' else 1) if m else None
 if c['category']=='case':
  for k,l in [('widthMm','Largeur'),('depthMm','Profondeur'),('heightMm','Hauteur')]:
   n=mm(l)
   if n:p[k]=n
  if rows.get('Ventilateur(s) inclus')=='Non':p['fanCount']=0
  else:
   qty=[int(v) for k,v in rows.items() if k.startswith('Quantité de ventilateur(s)') and k.endswith('fournie') and v.isdigit()]
   if qty:p['fanCount']=sum(qty)
  material=' '.join(v for k,v in rows.items() if 'Matériau' in k or 'Fenêtre' in k)
  if re.search('verre tremp',material,re.I):p['sidePanel']='glass'
  elif re.search('acrylique',material,re.I):p['sidePanel']='acrylic'
 elif c.get('coolingType')=='aio':
  # Reviewed IDs only: retailer labels swap axes across products. Never treat a
  # generic "Hauteur" or a pump/fan/packaging dimension as radiator thickness.
  reviewed_radiators={
   'cooler-h100i240':(277,120,27),'cooler-h150i360':(397,120,27),
   'cooler-ls520240':(282,120,27),'cooler-ls720360':(402,120,27),
   'cooler-h170i-lcd-420':(457,140,27),
  }
  if c['id'] in reviewed_radiators:
   length,width,thickness=reviewed_radiators[c['id']]
   assert {mm('Largeur (ventilateur inclus)'),mm('Profondeur (ventilateur inclus)')}=={length,width}
   assert mm('Hauteur')==thickness
   p.update({'radiatorLengthMm':length,'radiatorWidthMm':width,'radiatorThicknessMm':thickness})
  n=mm('Diamètre ventilateur')
  if n:p['fanSizeMm']=n

 else:
  for k,l in [('heightMm','Hauteur (ventilateur inclus)'),('widthMm','Largeur (ventilateur inclus)'),('depthMm','Profondeur (ventilateur inclus)'),('fanSizeMm','Diamètre ventilateur')]:
   n=mm(l)
   if n:p[k]=n
 if p:existing(c['id'])['patch'].update(p)
for id in ['import-psu-30d0c61edddd','import-psu-96f28a7f2861']:
 r=existing(id);rows={x['label']:x['value'] for g in r['groups'] for x in g['rows']}
 assert rows['Largeur']=='150 mm' and rows['Profondeur']=='150 mm' and rows['Hauteur']=='86 mm'
 r['patch'].update({'widthMm':150,'depthMm':150,'heightMm':86,'fanSizeMm':135,'fanCount':1})
# Manufacturer existing evidence: physical PSU dimensions, no package measurements.
r=existing('psu-rm750e');r['patch'].update({'widthMm':150,'depthMm':140,'heightMm':86,'fanSizeMm':120,'fanCount':1});r['groups'].append(group('Dimensions constructeur',[('Boîtier hors câbles','140 × 150 × 86 mm'),('Ventilateur','120 mm')]))
r=existing('case-h6');r['patch'].update({'heightMm':435,'widthMm':287,'depthMm':415,'fanCount':3,'fanSizeMm':120})
r=existing('cooler-phantom');r['patch']['heatpipeCount']=7
# Each Arctic SKU has its own fetched manufacturer page, not a propagated variant.
for suffix,mpn,size,L,W,count,fan,rgb in [('240','ACFRE00134A',240,277,120,2,120,False),('280','ACFRE00135A',280,317,138,2,140,False),('360','ACFRE00136A',360,398,120,3,120,False),('420','ACFRE00137A',420,458,138,3,140,False),('360-white','ACFRE00152A',360,398,120,3,120,True)]:
 id='cooler-lfiii'+('360-argb-white' if suffix=='360-white' else suffix)
 record(id,mpn,'arctic-'+suffix,'ARCTIC — fiche du modèle exact',{'supportedSockets':['AM4','AM5','LGA1700'],'coolingType':'aio','radiatorSizeMm':size,'radiatorThicknessMm':38,'radiatorLengthMm':L,'radiatorWidthMm':W,'fanCount':count,'fanSizeMm':fan,'fanRgb':rgb,'rgb':rgb,'detailLevel':'documented'},[('Radiateur',f'{L} × {W} × 38 mm'),('Ventilateurs radiateur',f'{count} × P{12 if fan==120 else 14} PWM'+(' PST A-RGB' if rgb else '')),('Pompe','800–2800 tr/min PWM'),('Ventilateur VRM','60 mm · 400–2500 tr/min PWM'),('Tuyaux','450 mm'),('Sockets natifs','Intel LGA1851/LGA1700 · AMD AM5/AM4'),('Garantie','6 ans')],['LGA1200/115X nécessite un kit séparé. La puissance thermique maximale n’est pas déduite du format radiateur. Les ventilateurs s’ajoutent à ses 38 mm d’épaisseur.'])
for size,mpn,L,W,count in [(240,'RL-KN240-B1',275,123,2),(360,'RL-KN360-B1',394,121,3)]:
 record('cooler-kraken'+str(size),mpn,'kraken2023','NZXT — Kraken 2023 Specifications',{'name':f'Kraken {size} (2023)','supportedSockets':['AM4','AM5','LGA1700'],'coolingType':'aio','radiatorSizeMm':size,'radiatorThicknessMm':30,'radiatorLengthMm':L,'radiatorWidthMm':W,'fanCount':count,'fanSizeMm':120,'fanRgb':False,'pumpDisplay':'lcd','heightMm':55.97,'widthMm':74.7,'depthMm':74.7,'detailLevel':'documented','description':f'NZXT Kraken {size}, modèle 2023 {mpn}, avec écran TFT LCD de 1,54 pouce. Radiateur {L} × {W} × 30 mm et {count} ventilateurs F120P de 120 × 120 × 26 mm. Tête de pompe : diamètre 74,7 mm et hauteur 55,97 mm. Les dimensions du radiateur et de la tête de pompe sont distinctes.','specs':[f'Radiateur {size} mm',f'{L} × {W} × 30 mm',f'{count} × F120P 120 mm · épaisseur 26 mm','Pompe Ø74,7 × 55,97 mm','LCD TFT 1,54 pouce · 240 × 240','AM4 / AM5 / LGA1700',mpn]},[('Radiateur',f'{L} × {W} × 30 mm'),('Ventilateurs fournis',f'{count} × F120P · 120 × 120 × 26 mm · 500–1800 tr/min ±300'),('Pompe','Asetek 7e génération · 800–2800 ±300 tr/min'),('Tête de pompe','Diamètre 74,7 mm · hauteur 55,97 mm'),('Écran','TFT LCD 1,54 pouce · 240 × 240 pixels'),('Tuyaux','400 mm'),('Sockets','LGA1851/1700/1200/115X · AM5/AM4 ; TR4/sTRX4 avec support séparé'),('Garantie','6 ans')],['La fiche support constructeur actualisée en mars 2026 indique une épaisseur de radiateur de 30 mm. Une ancienne approximation de 27 mm ne doit pas être réutilisée.'])
record('cooler-nhd15','NOCTUA NH-D15 CH.BK','noctua-nhd15-specs','Noctua — spécifications officielles',{'heightMm':168,'widthMm':150,'depthMm':161,'fanCount':2,'fanSizeMm':140,'heatpipeCount':6,'fanRgb':False,'description':'Noctua NH-D15 chromax.black, ventirad double tour à six caloducs et deux ventilateurs NF-A15. Le tableau mécanique constructeur consulté indique 168 × 150 × 161 mm (hauteur × largeur × profondeur). La documentation fabricant présente une discordance avec un texte marketing à 165 mm ; aucune révision matérielle expliquant cet écart n’est confirmée.','specs':['Double tour · 6 caloducs','2 × NF-A15 140 mm','Hauteur 168 mm — tableau fabricant actuel','Largeur 150 mm · profondeur 161 mm','Sans éclairage RGB','Garantie 6 ans']},[('Encombrement avec ventilateurs','168 mm hauteur × 150 mm largeur × 161 mm profondeur'),('Caloducs','6 × 6 mm'),('Ventilateurs','2 × NF-A15 HS-PWM chromax.black · 140 × 150 × 25 mm'),('Masse avec ventilateurs','1320 g'),('Garantie','6 ans')],['Le tableau mécanique constructeur actuel annonce 168 mm avec ventilateurs ; son texte marketing mentionne encore 165 mm et une fiche marchande 170 mm. La valeur de 168 mm du tableau constructeur est retenue. La fiche concerne bien NH-D15 chromax.black, EAN 9010018000184, six caloducs et ventilateurs NF-A15, pas NH-D15 G2. Aucune révision matérielle ou modification physique expliquant cet écart n’a été confirmée : il s’agit d’une discordance entre documents. Relever le ventilateur pour de la RAM haute augmente encore la hauteur.'])
# The ordinary AK620 SKU has no trailing -1: that suffix identifies ZERO DARK.
for id,mpn,file in [('cooler-ak620','R-AK620-BKNNMT-G','deepcool-ak620'),('cooler-ak620-zero-dark','R-AK620-BKNNMT-G-1','deepcool-zero')]:
 r=record(id,mpn,file,'DeepCool — fiche fabricant exacte',{'heightMm':160,'lengthMm':129,'widthMm':138,'depthMm':129,'fanCount':2,'fanSizeMm':120,'heatpipeCount':6,'fanRgb':False,'supportedSockets':['AM4','AM5','LGA1700'],'coolingType':'air'},[('Dimensions L × W × H','129 × 138 × 160 mm'),('Caloducs','6 × 6 mm'),('Ventilateurs','2 × 120 × 120 × 25 mm · PWM · FDB'),('Vitesse','500–1850 tr/min ±10 %'),('EAN','6933412727316' if id=='cooler-ak620' else '6933412727842')],['AK620 standard et ZERO DARK ont des références distinctes. Les offres d’une autre finition ne sont pas réutilisées.'])
 if id=='cooler-ak620':r['offers']=[]
record('case-meshify2','FD-C-MES2A-03','meshify2','Fractal Design — fiche PDF Meshify 2',{'supportedFormFactors':['ATX','Micro-ATX','Mini-ITX'],'supportedPsuFormats':['ATX'],'maxGpuLengthMm':467,'maxCoolerHeightMm':185,'depthMm':542,'widthMm':240,'heightMm':474,'fanCount':3,'fanSizeMm':140,'fanRgb':False,'sidePanel':'glass','radiatorSupport':{'top':[360,420],'front':[280,360]},'detailLevel':'documented'},[('Variante','Black TG Light Tint · FD-C-MES2A-03 · EAN7340172702443'),('Dimensions L × W × H','542 × 240 × 474 mm'),('GPU — disposition ouverte','467 mm avec ventilateur avant ; 491 mm sans'),('GPU — disposition stockage','315 mm'),('Ventirad maximal','185 mm'),('Alimentation','ATX · 250 mm avec cage HDD'),('Ventilateurs inclus','2 × Dynamic X2 GP-14 en façade + 1 à l’arrière'),('Radiateurs','Façade jusqu’à360/280 mm · haut360/420 mm · bas240/280 mm · arrière120 mm')],['Le dégagement GPU de 467 mm concerne la disposition ouverte avec ventilateur avant ; il descend à315 mm avec la disposition stockage. Un radiateur en façade réduit le dégagement.'])
record('case-air903-base','AIR 903 BASE Black','montech-air903-base','MONTECH — fiche AIR 903 BASE',{'supportedFormFactors':['ATX','Micro-ATX','Mini-ITX'],'supportedPsuFormats':['ATX'],'maxGpuLengthMm':400,'maxCoolerHeightMm':180,'depthMm':478,'widthMm':230,'heightMm':493,'fanCount':3,'fanSizeMm':140,'fanRgb':False,'radiatorSupport':{'top':[120,140,240,280,360],'front':[120,140,240,280,360]},'detailLevel':'documented'},[('Variante','AIR 903 BASE — Black ; fabricant liste aussi White, distinct de AIR 903 MAX'),('Dimensions L × W × H','478 × 230 × 493 mm'),('GPU maximal','400 mm longueur · 190 mm largeur'),('Ventirad maximal','180 mm'),('Alimentation','ATX · 240 mm'),('Ventilateurs inclus','2 ×140 mm PWM sans ARGB en façade +1 ×140 mm à l’arrière'),('Cartes mères','E-ATX / ATX / Micro-ATX / Mini-ITX'),('Radiateurs haut/façade','120 /140 /240 /280 /360 mm')],['Le fabricant désigne la référence par modèle et couleur, sans code MPN alphanumérique séparé. Pas de prix ajouté sans fiche marchande correspondant exactement au modèle BASE noir.'])
for id,watts,mpn,noise in [('psu-pp12-650',650,'BN342',19.9),('psu-pp12-850',850,'BN344',25.7),('psu-pp12-1000',1000,'BN345',31.7),('import-psu-9afbb4d4bfb0',750,'BN343',24),('import-psu-bd312e104b72',550,'BN341',17.1),('import-psu-2d39d86b7d23',1200,'BN346',34.3)]:
 record(id,mpn,'bequiet-pp12m','be quiet! — Pure Power 12 M PDF EU V1/25',{'manufacturerPartNumber':mpn,'wattage':watts,'psuFormat':'ATX','widthMm':150,'heightMm':86,'depthMm':160,'fanCount':1,'fanSizeMm':120,'detailLevel':'documented'},[('Puissance continue',f'{watts} W'),('Dimensions hors câbles','160 ×150 ×86 mm'),('Normes document V1/25','ATX3.1 /EPS12V2.92 · PCIe5.1'),('Certification','80 PLUS Gold'),('Modularité','Entièrement modulaire'),('Ventilateur','120 mm'),('Connecteur graphique','1 ×12VHPWR '+str(300 if watts==550 else 450 if watts==650 else 600)+' W'),('PCIe6+2 broches',str(2 if watts<=750 else 4)),('SATA /PATA',('5 /2' if watts<=750 else '6 /2')),('Bruit à100 %',f'{noise} dB(A)'),('Garantie','10 ans')],['Document constructeur V1/25 : il mentionne ATX3.1 mais appelle le câble 12VHPWR. Ce libellé est conservé au lieu de prétendre qu’il est12V-2x6. La référence régionale EU est utilisée.'])
record('cooler-ak620-digital','R-AK620-BKADMN-G','deepcool-digital','DeepCool — AK620 DIGITAL',{'heightMm':162,'lengthMm':129,'depthMm':129,'widthMm':138,'fanCount':2,'fanSizeMm':120,'heatpipeCount':6,'fanRgb':False,'rgb':True},[('Dimensions L × W × H','129 × 138 × 162 mm'),('Architecture','Double tour · 6 caloducs Ø6 mm'),('Ventilateurs','2 ×120 ×120 ×25 mm · PWM · FDB · 500–1850 tr/min ±10 %'),('Écran','Affichage numérique état CPU'),('Éclairage','Liserés ARGB sur le capot ; ventilateurs sans ARGB'),('EAN','6933412728221')])
# Manufacturer comparison PDF names every SKU in its own column. Match exact family,
# wattage and certification; no broad family substitutions or approximate title matching.
psu_rows=[
 ('Dark Power Pro 13',1600,'BN332',200,'Titanium','3.0',10,31.1),('Dark Power Pro 13',1300,'BN331',200,'Titanium','3.0',10,23.2),
 ('Dark Power 13',1000,'BN335',175,'Titanium','3.0',10,25.8),('Dark Power 13',850,'BN334',175,'Titanium','3.0',10,19.8),('Dark Power 13',750,'BN333',175,'Titanium','3.0',10,18.8),
 ('Straight Power 12',1500,'BN340',180,'Platinum','3.0',10,36.4),('Straight Power 12',1200,'BN339',180,'Platinum','3.0',10,32.2),('Straight Power 12',1000,'BN338',160,'Platinum','3.0',10,28.9),('Straight Power 12',850,'BN337',160,'Platinum','3.0',10,22.1),('Straight Power 12',750,'BN336',160,'Platinum','3.0',10,20.8),
 ('Straight Power 11',1000,'BN285',170,'Gold','2.51',5,32.1),('Straight Power 11',850,'BN284',170,'Gold','2.51',5,25),('Straight Power 11',750,'BN283',170,'Gold','2.51',5,21.2),
 ('Pure Power 12',1000,'BP005EU',160,'Gold','3.1',10,31.6),('Pure Power 12',850,'BP004EU',160,'Gold','3.1',10,25.1),('Pure Power 12',750,'BP003EU',160,'Gold','3.1',10,22.5),('Pure Power 12',650,'BP002EU',160,'Gold','3.1',10,18.2),('Pure Power 12',550,'BP001EU',160,'Gold','3.1',10,14.6),
 ('System Power 10',850,'BN330',160,'Gold','2.52',5,30.7),('System Power 10',750,'BN329',140,'Bronze','2.52',5,34.7),('System Power 10',650,'BN328',140,'Bronze','2.52',5,30.7),('System Power 10',550,'BN327',140,'Bronze','2.52',5,25.7),('System Power 10',450,'BN326',140,'Bronze','2.52',5,19.2),
 ('System Power 10 U',850,'BN989',160,'Gold','2.52',5,30.7),('System Power 10 U',750,'BN988',140,'Bronze','2.52',5,34.7),('System Power 10 U',650,'BN987',140,'Bronze','2.52',5,30.7),('System Power 10 U',550,'BN986',140,'Bronze','2.52',5,25.7),
]
comparison=json.loads((E/'bequiet-psu-catalog.json').read_text())['primaryText']
for family,watts,mpn,depth,cert,atx,warranty,noise in psu_rows:
 assert mpn in comparison
 for a in items:
  c=a['component'];prefix=c['name'].split(' · ')[0];prefix=re.sub(r' \d+W$','',prefix)
  if c['brand']!='be quiet!' or c['category']!='psu' or prefix!=family or c.get('wattage')!=watts:continue
  if c['id'].startswith('import-') and ('80 PLUS '+cert) not in c['name']:continue
  # Preserve newer individual specifications if already verified for the same SKU.
  patch={'manufacturerPartNumber':mpn,'wattage':watts,'psuFormat':'ATX','widthMm':150,'heightMm':86,'depthMm':depth,'detailLevel':'documented'}
  if family.startswith('Straight Power'):patch.update({'fanCount':1,'fanSizeMm':135})
  if family=='Pure Power 12':patch.update({'fanCount':1,'fanSizeMm':120})
  record(c['id'],mpn,'bequiet-psu-catalog','be quiet! — tableau comparatif constructeur',patch,[('Référence de la colonne fabricant',mpn),('Puissance continue',str(watts)+' W'),('Dimensions hors câbles',f'{depth} mm profondeur ×150 mm largeur ×86 mm hauteur'),('Certification','80 PLUS '+cert),('ATX — document comparatif',atx),('Câblage','Fixe' if family.startswith(('Pure Power 12','System Power')) else 'Modulaire'),('Bruit à100 %',str(noise)+' dB(A)'),('Garantie',str(warranty)+' ans')],['La ligne du tableau constructeur a été vérifiée pour cette puissance et ce SKU. Les caractéristiques de connectique non présentes ne sont pas déduites des autres modèles.']+(['Le fabricant indique explicitement que System Power 10 U n’est pas disponible en Europe ; aucune offre française n’est présumée.'] if family.endswith(' U') else []))
# Remove the conflicting retailer dimension instead of displaying it beside the primary correction.
for g in records['cooler-nhd15']['groups']:
 if not g['title'].startswith('Complément vérifié'):
  g['rows']=[r for r in g['rows'] if r['label']!='Hauteur (ventilateur inclus)']
record('cooler-silentloop2-360','BW012','bequiet-silentloop2-360','be quiet! — Silent Loop 2 360 mm BW012',{'radiatorLengthMm':394,'radiatorWidthMm':120,'radiatorThicknessMm':27,'heightMm':54,'widthMm':80,'depthMm':94.5,'fanCount':3,'fanSizeMm':120,'fanRgb':False,'description':'Silent Loop 2 360 mm BW012 : radiateur de 394 × 120 × 27 mm, ou 52 mm avec les trois ventilateurs Silent Wings 3 de 25 mm. Bloc pompe de 94,5 × 80 × 54 mm et éclairage ARGB.','specs':['Radiateur 360 mm · 394 × 120 × 27 mm','52 mm avec ventilateurs','3 × Silent Wings 3 120 × 120 × 25 mm','Bloc pompe 94,5 × 80 × 54 mm','AM4 · AM5 · LGA1700','BW012']},[('Radiateur hors ventilateurs','394 × 120 × 27 mm'),('Radiateur avec ventilateurs','394 × 120 × 52 mm'),('Bloc pompe','94,5 × 80 × 54 mm'),('Ventilateurs','3 × Silent Wings 3 PWM high-speed ·120 ×120 ×25 mm'),('Tuyaux','400 mm')],['Le tableau marchand comporte des axes incohérents et une longueur de 390 mm. Les dimensions distinctes du radiateur et du bloc pompe proviennent ici de la fiche fabricant actuelle BW012 : 394 × 120 × 27 mm et 94,5 × 80 × 54 mm.'])
for g in records['cooler-silentloop2-360']['groups']:
 if not g['title'].startswith('Complément vérifié'):
  g['rows']=[r for r in g['rows'] if r['label'] not in ['Hauteur (ventilateur inclus)','Largeur (ventilateur inclus)','Profondeur (ventilateur inclus)','Hauteur','Largeur','Profondeur']]
record('cooler-ek-nucleus360','3831109851685','ek-nucleus-cr360','EK — Nucleus AIO CR360 Lux D-RGB',{'radiatorLengthMm':400,'radiatorWidthMm':124,'radiatorThicknessMm':27,'heightMm':61.6,'widthMm':69.2,'depthMm':82.3,'fanCount':3,'fanSizeMm':120,'fanRgb':True,'rgb':True,'description':'EK-Nucleus AIO CR360 Lux D-RGB, EAN 3831109851685 : radiateur de 400 × 124 × 27 mm, trois ventilateurs FPT 120 D-RGB de 120 × 120 × 25 mm, bloc pompe de 82,3 × 69,2 × 61,6 mm. La version Lux D-RGB est distincte des versions Dark, Vision et Direct Die.','specs':['Radiateur 360 mm · 400 × 124 × 27 mm','3 × FPT 120 D-RGB · 120 × 120 × 25 mm','Pompe 82,3 × 69,2 × 61,6 mm','AM4 · AM5 · LGA1700','Garantie 5 ans','3831109851685']},[('Radiateur hors ventilateurs','400 ×124 ×27 mm'),('Pompe','82,3 ×69,2 ×61,6 mm ·3100 tr/min ±10 %'),('Ventilateurs fournis','3 ×EK-FPT 120 D-RGB ·120 ×120 ×25 mm'),('Tuyaux','400 mm'),('Garantie','5 ans')],['Dimensions issues de la fiche fabricant portant l’EAN 3831109851685. Aucun prix fabricant ajouté : ce modèle est indiqué hors stock et aucune offre française neuve disponible n’est supposée.'])
records['case-meshify2']['patch'].update({'description':'Meshify 2 Black TG Light Tint FD-C-MES2A-03, avec trois ventilateurs de 140 mm. Dégagement GPU de 467 mm en disposition ouverte avec ventilateur avant, 491 mm sans ce ventilateur, et 315 mm en disposition stockage. Un radiateur en façade réduit encore ce dégagement.','specs':['ATX · Micro-ATX · Mini-ITX','240 × 474 × 542 mm','GPU 467 mm avec ventilateur avant · 315 mm en mode stockage','Ventirad 185 mm','3 × 140 mm inclus','FD-C-MES2A-03']})
candidates=ROOT/'data/comprehensive-review/power-chassis-candidates-confirmed.json'
if candidates.exists():
 for id,r in json.loads(candidates.read_text()).items():
  assert id in byid and r['mpn'] and r['sources']
  records[id]=r
(ROOT/'src/data/comprehensivePowerChassis.ts').write_text('// Source-backed power, cooling and chassis projections.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const comprehensivePowerChassisRecords: Record<string, VerifiedProduct> = '+json.dumps(records,ensure_ascii=False,indent=2)+';\n')
print('Wrote',len(records),'records')
