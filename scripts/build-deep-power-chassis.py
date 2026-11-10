"""Build source-specific factual additions, without prices or 3D-derived facts.

Each mapping is exact-model or an explicitly identified manufacturer's wattage
column. Existing accepted offers retain their original observation dates.
"""
import copy,datetime,gzip,json,re,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-chassis';S=D/'sources'
EXPORT="""import {catalog} from './src/data/catalog.ts';import {manuallyReviewedProducts} from './src/data/verifiedCatalog.ts';import {verifiedBulk} from './src/data/verifiedBulk.ts';import {individualProducts} from './src/data/individualCatalog.ts';import {comprehensiveProducts} from './src/data/comprehensiveCatalog.ts';import {isQuarantinedReference} from './src/data/catalogQuarantine.ts';const v={...verifiedBulk,...manuallyReviewedProducts,...individualProducts,...comprehensiveProducts};console.log(JSON.stringify(catalog.filter(c=>['cpu','psu','cooler','case'].includes(c.category)).map(component=>({component,verified:v[component.id]&&!isQuarantinedReference(component.id,v[component.id].mpn)?v[component.id]:null}))));"""
items=json.loads(subprocess.check_output(['npx','tsx','-e',EXPORT],cwd=ROOT,text=True))
# Source matching uses the frozen archive designation, not this generator's
# previous runtime patches (notably advertised peak vs continuous wattage).
frozen={c['id']:c for c in json.load(gzip.open(ROOT/'data/full-review/input.json.gz','rt'))}
for a in items:
 c=a['component']
 if c['category']=='psu' and c['id'].startswith('import-') and c['id'] in frozen:
  for f in ['name','wattage','finishName','brand']:
   if f in frozen[c['id']]:c[f]=frozen[c['id']][f]
byid={x['component']['id']:x for x in items};records={};photos=[];reviews={};modelIdentities={}
translations={'Height with fan(s)':'Hauteur avec ventilateur(s)','Height without fan(s)':'Hauteur sans ventilateur','Width with fan(s)':'Largeur avec ventilateur(s)','Width without fan(s)':'Largeur sans ventilateur','Depth with fan(s)':'Profondeur avec ventilateur(s)','Depth without fan(s)':'Profondeur sans ventilateur','Weight with fan(s)':'Masse avec ventilateur(s)','Weight without fan(s)':'Masse sans ventilateur','Socket compatibility':'Sockets compatibles','Warranty':'Garantie','Fan configuration':'Ventilateurs fournis','Number of heatpipes':'Nombre de caloducs','Heatpipe diameter':'Diamètre des caloducs','Fin count':"Nombre d’ailettes",'Size (Form factor)':'Dimensions du ventilateur','Speed range':'Plage de vitesse','Airflow (max.)':'Débit maximal','Acoustical noise (max.)':'Bruit maximal','Static pressure (max.)':'Pression statique maximale','Rated voltage':'Tension nominale','Input power (typical)':'Puissance typique','Connector':'Connecteur','Colour':'Couleur','Color':'Couleur','Fan Size':'Diamètre du ventilateur','Fan Bearing':'Roulement du ventilateur','Dimensions (DxWxH)':'Dimensions profondeur × largeur × hauteur','Protection':'Protections','Input Voltage Range':"Plage de tension d’entrée",'Input Frequency Range':"Fréquence d’entrée",'Power Watt':'Puissance nominale','PFC Type':'Correction du facteur de puissance','Modular':'Modularité','Efficiency Rating':'Certification de rendement','Operating Temperature':"Température de fonctionnement",'Fan Control':'Commande du ventilateur','Modularity':'Modularité','Cable type':'Type de câbles','Form Factor':'Format','Dimensions':'Dimensions','Product Length':'Longueur du produit (libellé fabricant)','Product Height':'Hauteur du produit (libellé fabricant)','Product Width':'Largeur du produit (libellé fabricant)','Fan Speed':'Vitesse des ventilateurs','Fan Airflow':'Débit des ventilateurs','Fan Static Pressure':'Pression statique des ventilateurs','Noise Level':'Niveau sonore','Radiator Dimensions':'Dimensions du radiateur','Pump Dimensions':'Dimensions de la pompe','Pump Speed':'Vitesse de la pompe','Pump Noise':'Bruit de la pompe','Tube length':'Longueur des tuyaux','Tubing Length':'Longueur des tuyaux','Fan Dimensions':'Dimensions des ventilateurs','Fan Air Pressure':'Pression statique des ventilateurs','Fan Noise':'Bruit des ventilateurs','Fan Connector':'Connecteur des ventilateurs','Radiator Material':'Matériau du radiateur','Bearing Type':'Roulement','Net Weight':'Masse nette','P/N':'Référence fabricant'}
def source(key):
 e=json.loads((S/(key+'.json')).read_text());assert (e.get('statusCode')==200 or e.get('extractionStatus')=='success') and (e.get('primaryText') or e.get('tables'));return e
def rows_from_table(table):
 return [(row[-2],row[-1]) for row in table if len(row)>=2 and row[-2] and row[-1] and row[-1] not in ['TBA']]
def add(id,key,rows,patch=None,mpn=None,notes=None,replace=False,title=None):
 e=source(key);old=records.get(id) or byid[id]['verified'];ref=mpn or (old and old['mpn']);assert ref
 r=copy.deepcopy(old) if old and old['mpn']==ref else {'mpn':ref,'identityNote':f'Identification fabricant : {ref}. La région commerciale et les révisions distinctes ne sont pas supposées interchangeables.','sources':[],'groups':[],'patch':{},'offers':[],'notes':[]}
 if replace:r['groups']=[]
 name=title or byid[id]['component']['brand']+' — spécifications constructeur exactes'
 src={'name':name,'url':e['url'],'checkedAt':e['checkedAt'],'kind':'manufacturer'}
 if src not in r['sources']:r['sources'].append(src)
 group={'title':name,'rows':[{'label':translations.get(str(k),str(k)),'value':str(v)} for k,v in rows if v is not None and str(v).strip()]}
 if group['rows']:r['groups'].append(group)
 r['patch'].update(patch or {});r['patch']['manufacturerPartNumber']=ref;r['notes']+=notes or []
 evidence=r.setdefault('fieldEvidence',{})
 for k,v in (patch or {}).items():evidence[k]={'value':v,'sourceURL':e['url'],'checkedAt':e['checkedAt']}
 for k,v in rows:
  if v is not None:evidence['details.'+key+'.'+str(k)]={'value':str(v),'sourceURL':e['url'],'checkedAt':e['checkedAt']}
 records[id]=r
 reviews.setdefault(id,{'sourceKeys':[],'newFactCount':0});reviews[id]['sourceKeys'].append(key);reviews[id]['newFactCount']+=len(group['rows'])
 return r
def all_tables(key):return [pair for t in source(key).get('tables',[]) for pair in rows_from_table(t)]
def clean_obsolete_rows(r,labels):
 for g in r['groups']:g['rows']=[x for x in g['rows'] if x['label'] not in labels]
def add_image(id,key,predicate):
 e=source(key)
 for im in e.get('images',[]):
  if predicate(im):photos.append({'id':id,'mpn':records[id]['mpn'],'sourceURL':e['url'],'checkedAt':e['checkedAt'],**im});break

# Noctua publishes mechanical and delivered-fan tables separately. NSPR is its
# own rating; it is never converted to a maximum supported CPU wattage.
for id,key,count,size in [('cooler-l9a','noctua-l9a',1,92),('cooler-nhd15-g2','noctua-nhd15g2',2,140),('cooler-nhd12l','noctua-nhd12l',1,120),('cooler-l9i-17xx','noctua-l9i17',1,92),('cooler-nhd15','noctua-nhd15',2,140)]:
 e=source(key);rowmap=dict(all_tables(key));p={'fanCount':count,'fanSizeMm':size,'fanRgb':False}
 for f,label in [('heightMm','Height with fan(s)'),('widthMm','Width with fan(s)'),('depthMm','Depth with fan(s)'),('heatpipeCount','Number of heatpipes')]:p[f]=float(re.search(r'[\d.]+',rowmap[label])[0])
 for i,t in enumerate(e['tables'][:4]):add(id,key,rows_from_table(t),p if i==0 else None,replace=i==0,title=['Noctua — ensemble livré','Noctua — ventilateur livré','Noctua — mécanique du radiateur','Noctua — indice thermique'][i])
 add_image(id,key,lambda im:'cdn.noctua.at/media/' in im['url'] and '.jpg' in im['url'])
 records[id]['notes'].append('L’indice NSPR est un indicateur Noctua, pas un TDP maximal en watts. Les hauteurs avec ventilateur supposent sa position d’origine ; le relever pour la RAM accroît l’encombrement.')
# Exact Thermalright page tables distinguish heatsink and fan measurements.
for id,key in [('cooler-peerless','thermalright-peerless')]:
 for i,t in enumerate(source(key)['tables']):add(id,key,rows_from_table(t),{'heatpipeCount':6,'fanRgb':False} if i==0 else None,title='Thermalright — '+('dissipateur seul' if i==0 else 'ventilateur livré TL-C12C'))
 add_image(id,key,lambda im:im.get('alt')=='Peerless Assassin 120 SE')
for id,key in [('cooler-darkrockpro5','bequiet-darkrockpro5')]:
 e=source(key);assert 'BK036' in e['primaryText']
 for i,t in enumerate(e['tables']):
  rows=[r for r in rows_from_table(t) if not any(x in r[0].lower() for x in ['packag','shipping box','rrp'])]
  add(id,key,rows,{'depthMm':145,'widthMm':136,'heightMm':168,'fanCount':2,'heatpipeCount':7,'fanRgb':False} if i==0 else None,replace=i==0,title=['be quiet! — ensemble complet','be quiet! — dissipateur seul','be quiet! — ventilateurs 120 / 135 mm','be quiet! — accessoires','be quiet! — certifications','be quiet! — environnement','be quiet! — garantie','be quiet! — identité'][i])
for id,key,count,rad,mpn in [('cooler-ls520240','deepcool-ls520',2,240,'R-LS520-BKAMNT-G-1'),('cooler-ls720360','deepcool-ls720',3,360,'R-LS720-BKAMNT-G-1')]:
 rows=all_tables(key);d=dict(rows);assert d['P/N']==mpn
 dims=[int(v) for v in re.findall(r'\d+',d['Radiator Dimensions'])];pump=[int(v) for v in re.findall(r'\d+',d['Pump Dimensions'])]
 add(id,key,rows,{'radiatorLengthMm':dims[0],'radiatorWidthMm':dims[1],'radiatorThicknessMm':dims[2],'radiatorSizeMm':rad,'depthMm':pump[0],'widthMm':pump[1],'heightMm':pump[2],'fanCount':count,'fanSizeMm':120,'fanRgb':True,'pumpDisplay':'rgb-ring'},mpn=mpn,replace=True,notes=['Les FC120 livrés avec LS520/LS720 ont une plage PWM spécifique 500–2250 tr/min ; les valeurs du ventilateur FC120 vendu séparément ne sont pas substituées.'])
 add_image(id,key,lambda im:('ls520' if rad==240 else 'ls720') in im['url'].lower() and 'logo' not in im['url'].lower())
for id,key,count,size in [('cooler-h100i240','corsair-h100',2,120),('cooler-h150i360','corsair-h150',3,120),('cooler-h170i-lcd-420','corsair-h170',3,140)]:
 e=source(key);rows=[r for t in e['tables'] for r in rows_from_table(t) if r[0] not in ['120mm','140mm','Product Family','Product Height','Product Width','FAN SPEED','2100 max RPM','1700 max RPM']]
 add(id,key,rows,{'fanCount':count,'fanSizeMm':size,'fanRgb':True,'pumpDisplay':'lcd' if size==140 else 'logo'},notes=['Les champs génériques Product Height/Width du site ne sont pas utilisés pour remplacer l’épaisseur mécanique du radiateur. Les dimensions exactes du radiateur restent celles de la fiche technique déjà identifiée.'])
 add_image(id,key,lambda im:'ELITE' in im['url'] and ('H170' if size==140 else 'H100' if count==2 else 'H150') in im['url'])

for id,key in [('cooler-ak620','deepcool-ak620'),('cooler-ak620-zero-dark','deepcool-zero'),('cooler-ak620-digital','deepcool-digital')]:
 add(id,key,all_tables(key),replace=True)
 add_image(id,key,lambda im:'ak620' in im['url'].lower() and 'logo' not in im['url'].lower())
for i,t in enumerate(source('thermalright-phantom')['tables']):add('cooler-phantom','thermalright-phantom',rows_from_table(t),title='Thermalright — '+('dissipateur seul' if i==0 else 'ventilateur TL-C12B V2 livré'))
for suffix,id in [('240','cooler-lfiii240'),('280','cooler-lfiii280'),('360','cooler-lfiii360'),('420','cooler-lfiii420'),('360-white','cooler-lfiii360-argb-white')]:
 key='arctic-'+suffix;e=source(key);t=e['primaryText'];t=t[t.index('General Specifications'):t.index('Packaging',t.index('General Specifications'))]
 headings=['General Specifications','Compatibillity','Pump Specifications','Radiator Specifications','VRM Modul Specifications','Fan Specifications','RGB Specifications']
 section='';rows=[];parts=t.splitlines();i=0
 while i<len(parts):
  label=parts[i].strip();i+=1
  if label in headings:section=label;continue
  if i>=len(parts):break
  value=parts[i].strip();i+=1
  if label=='PI | NNPI':continue
  if label=='Tube Diameter' and i<len(parts) and parts[i].startswith('Inner:'):value+=' ; '+parts[i];i+=1
  # Manufacturer typo "0.40 V | 5 V DC" is not an admissible current rating.
  if section=='RGB Specifications' and label=='Current | Voltage':continue
  rows.append((section+' — '+label,value))
 add(id,key,rows,title='ARCTIC — pompe, radiateur, VRM et ventilateurs du SKU exact')
for id in ['cooler-kraken240','cooler-kraken360']:
 e=source('kraken2023');rows=[];section='';allowed=True
 for row in e['tables'][1]:
  if len(row)==1:section=row[0];allowed=not section.startswith('Product Info') and section!='Radiator';continue
  if allowed and len(row)==2 and row[0] not in ['Intel','LGA 1851 LGA 1700 LGA 1200 LGA 115X']:rows.append((section+' — '+row[0],row[1]))
 add(id,'kraken2023',rows,title='NZXT — pompe, écran et connexions Kraken 2023')
 fanrows=[]
 for row in e['tables'][5][1:]:
  if len(row)==1:break
  fanrows+=rows_from_table([row])
 add(id,'kraken2023',fanrows,title='NZXT — ventilateur F120P livré, version 2022')
for i,t in enumerate(source('bequiet-silentloop2-360')['tables']):
 rows=[r for r in rows_from_table(t) if not any(x in r[0].lower() for x in ['packag','shipping box','rrp'])]
 add('cooler-silentloop2-360','bequiet-silentloop2-360',rows,title='be quiet! — Silent Loop 2, tableau '+str(i+1))
# Reuse the already archived primary EK text at its original observation date.
ek=json.loads((ROOT/'data/comprehensive-review/power-chassis-evidence/ek-nucleus-cr360.json').read_text());ek['statusCode']=200
(S/'ek-nucleus-cr360.json').write_text(json.dumps(ek,ensure_ascii=False,indent=2))
add('cooler-ek-nucleus360','ek-nucleus-cr360',[('Ventilateurs fournis','3 × EK-FPT FAN 120 D-RGB · 120 × 120 × 25 mm'),('Vitesse des ventilateurs','550–2300 tr/min ±10 %'),('Débit maximal par ventilateur','72 CFM'),('Bruit maximal par ventilateur','36 dB(A)'),('Pompe','3100 tr/min ±10 %, commande PWM 20–100 %'),('Tuyaux','Caoutchouc renforcé, 400 mm'),('Garantie','5 ans')],title='EK — caractéristiques publiées du Nucleus CR360 Lux D-RGB')

# Manufacturer case tables; do not replace radiator-specific limits with overall
# case dimensions or silently turn a supported fan position into an included fan.
for id,key,count,fan in [('case-4000d','corsair-4000d-black',2,120),('case-4000d-white','corsair-4000d-white',2,120),('case-5000d','corsair-5000d',2,120),('case-3000d','corsair-3000d',2,120),('case-7000d','corsair-7000d',3,140)]:
 rows=all_tables(key);d=dict(rows);p={'fanCount':count,'fanSizeMm':fan,'fanRgb':False,'sidePanel':'glass'}
 for f,l in [('heightMm','Case Height'),('depthMm','Case Length'),('widthMm','Case Width'),('maxGpuLengthMm','Maximum GPU Length'),('maxCoolerHeightMm','Maximum CPU Cooler Height')]:p[f]=float(re.search(r'[\d.]+',d[l])[0])
 rows.append(('Ventilateurs inclus',f'{count} × {fan} mm '+('SP120 ELITE' if id=='case-3000d' else 'AirGuide')))
 add(id,key,rows,p,replace=True)
 add_image(id,key,lambda im:('4000D' if '4000d' in id else '5000D' if '5000d' in id else '3000D' if '3000d' in id else '7000D') in im['url'])
for id,key,H,W,Dm,count,gpu,cpu in [('case-h6','nzxt-h6',435,287,415,3,365,163),('case-h7','nzxt-h7',505,230,480,2,400,185),('case-h9','nzxt-h9',495,290,466,4,435,165)]:
 e=source(key);rows=[];section=''
 for row in e['tables'][1]:
  if len(row)==1:section=row[0];continue
  if len(row)!=2 or section=='Product Info' or row[0] in ['Weight','Included Controller','RGB Lighting','RGB Connection Type','Materials','Included Filters']:continue
  if '2800 mm' in row[1]:continue
  rows.append((section+' — '+row[0],row[1]))
 rows += [('Ventilateurs livrés',f'{count} × 120 mm sans RGB — version boîtier'),('Masse',{'case-h6':'9,4 kg','case-h7':'10,05 kg','case-h9':'12,1 kg'}[id])]
 add(id,key,rows,{'heightMm':H,'widthMm':W,'depthMm':Dm,'fanCount':count,'fanSizeMm':120,'fanRgb':False,'maxGpuLengthMm':gpu,'maxCoolerHeightMm':cpu,'sidePanel':'glass'},replace=True)
 if id in ['case-h7','case-h9']:
  wanted='F120Q Quiet Fan (Case Version)' if id=='case-h7' else 'F120Q Airflow Fan (Case Version)';fanrows=[];active=False
  for row in e['tables'][-1]:
   if len(row)==1:
    if active:break
    active=row[0]==wanted;continue
   if active:fanrows+=rows_from_table([row])
  add(id,key,fanrows,title='NZXT — '+wanted)
 if id=='case-h7':records[id]['notes'].append('La page NZXT support comporte « 2800 mm » dans une ligne de radiateur haut ; cette ligne erronée est exclue. Les limites de 60 mm de radiateur avant et 30 mm en haut sont données sans ventilateurs (ensemble maximal 90 et 60 mm).')

add('case-q300l','cm-q300l',[('Référence','MCB-Q300L-KANN-S00'),('Dimensions L × l × H','387 × 230 × 381 mm'),('Carte mère','Micro-ATX / Mini-ITX'),('Alimentation','ATX PS2, montage bas, longueur 160 mm max'),('Carte graphique','360 mm max'),('Ventirad','159 mm max'),('Ventilateur fourni','1 × 120 mm arrière'),('Ventilateurs possibles','Avant 2 × 120/140 ; haut 2 × 120 ; arrière 1 × 120 ; bas 1 × 120 mm'),('Radiateurs','Avant 120/240 mm ; arrière 120 mm'),('Stockage','1 × 3,5 pouces ; 2 × 2,5 pouces ; aucun 5,25 pouces'),('Ports','2 × USB 3.0 ; audio 3,5 mm ; microphone 3,5 mm'),('Extension','4 slots'),('Panneau latéral','Acrylique transparent'),('Câbles derrière carte mère','28 mm'),('Garantie','2 ans')],{'depthMm':387,'widthMm':230,'heightMm':381,'maxCoolerHeightMm':159,'maxGpuLengthMm':360,'fanCount':1,'fanSizeMm':120,'fanRgb':False,'sidePanel':'acrylic'},replace=True)
add('case-ap201','asus-ap201',[('Carte mère','Micro-ATX / Mini-ITX'),('Stockage','3 baies combinées 2,5/3,5 pouces + 1 baie 2,5 pouces'),('Extension','4 slots'),('Ports','1 × USB 3.2 Gen2 Type-C ; 2 × USB 3.2 Gen1 ; microphone et casque'),('Radiateur haut','120 / 140 / 240 / 280 / 360 mm'),('Radiateur arrière','120 mm'),('Ventilation haut','3 × 120 ou 2 × 140 mm'),('Ventilateur livré','1 × 120 mm arrière'),('Ventirad maximal','170 mm'),('GPU maximal','338 mm'),('Alimentation','Longueur 140–180 mm selon configuration'),('Passage de câbles maximal','32 mm'),('Dimensions','205 × 350 × 460 mm'),('Masse version mesh','5,8 kg'),('Filtre amovible','Dessous')],{'widthMm':205,'heightMm':350,'depthMm':460,'fanCount':1,'fanSizeMm':120,'maxCoolerHeightMm':170,'maxGpuLengthMm':338},replace=True,notes=['La fiche ASUS regroupe versions mesh et verre ; la masse 6,3 kg de la version verre ne s’applique pas à cette référence mesh blanche.'])
add('case-terra','fractal-terra-product-sheet',[('Référence','FD-C-TER1N-01 — Graphite'),('Dimensions avec pieds','343 × 153 × 218 mm'),('Dimensions hors pieds','343 × 153 × 198 mm'),('Masse','3,1 kg'),('Carte mère','Mini-ITX'),('Alimentation','SFX / SFX-L, longueur 130 mm max'),('Carte graphique — longueur','322 mm max'),('Carte graphique — hauteur','145 mm max ; épaisseur admissible dépend de cette hauteur'),('GPU hauteur < 131 mm','Épaisseur 43–72 mm selon position de la paroi'),('GPU hauteur 131–145 mm','Épaisseur 33–62 mm selon position de la paroi'),('Ventirad — paroi position GPU maximal','48 mm max'),('Ventirad — paroi position CPU maximal','77 mm max'),('Paroi centrale','Réglable sur 30 mm ; épaisseur GPU et hauteur CPU se partagent cet espace'),('Radiateur côté','120 mm ; largeur radiateur 121 mm avec GPU 200 mm et sans SSD'),('Ventilation','1 emplacement 120 mm dessous, aucun ventilateur fourni'),('Filtres','Aucun'),('Stockage','2 emplacements SSD 2,5 pouces'),('Ports','1 × USB-C 20 Gbit/s ; 1 × USB-A 5 Gbit/s'),('Riser inclus','PCIe 4.0'),('Matériaux','Aluminium anodisé, façade aluminium 8 mm et noyer FSC')],{'fanCount':0,'widthMm':153,'depthMm':343,'heightMm':218,'maxGpuLengthMm':322,'maxCoolerHeightMm':77,'sidePanel':'vented'},replace=True,notes=['77 mm de hauteur CPU et 72 mm d’épaisseur GPU ne sont pas simultanément possibles. Le montage AIO limite également la longueur GPU. Consulter les positions de paroi du manuel.'])
for id,ref,color in [('case-north','FD-C-NOR1C-02','Charcoal Black TG Dark'),('case-north-white','FD-C-NOR1C-04','Chalk White TG Clear')]:
 add(id,'fractal-north-product-sheet',[('Référence',ref+' — '+color),('Dimensions avec pieds','447 × 215 × 469 mm'),('Dimensions hors pieds','433,5 × 215 × 450 mm'),('Masse nette','7,7 kg'),('Panneau gauche','Verre trempé 3 mm'),('Carte mère','ATX / Micro-ATX / Mini-ITX'),('Ventilateurs fournis','2 × Aspect 140 mm PWM en façade'),('Ventilation possible','Avant 3 × 120 ou 2 × 140 ; haut 2 × 120/140 ; arrière 1 × 120 mm'),('Support ventilateurs latéraux','Absent sur variante TG'),('Radiateurs','Avant jusqu’à 360 mm ; haut jusqu’à 240 mm ; arrière 120 mm'),('GPU avec ventilateur avant','355 mm max'),('GPU avec radiateur avant 360 mm','300 mm max'),('Ventirad','170 mm max'),('Alimentation avec 1 plateau HDD','255 mm max'),('Alimentation avec 2 plateaux HDD','155 mm max'),('Stockage','2 supports dédiés 2,5 pouces ; 3 positions combinées 3,5/2,5 pouces, 2 plateaux inclus'),('Ports — fiche PDF','1 × USB-C USB 3.1 Gen2 ; 2 × USB 3.0 ; audio et micro'),('Câbles','30 mm derrière carte mère'),('Filtres','Avant et alimentation'),('Extension','7 slots')],{'depthMm':447,'widthMm':215,'heightMm':469,'fanCount':2,'fanSizeMm':140,'fanRgb':False,'maxGpuLengthMm':355,'maxCoolerHeightMm':170,'sidePanel':'glass'},replace=True,notes=['La variante TG n’a pas le support de ventilateurs latéraux de la variante mesh. Les limites de PSU dépendent du nombre de plateaux HDD.'])
add('case-pop-air-rgb','fractal-pop-pdf',[('Référence exacte du modèle noir RGB','FD-C-POR1A-06 — EAN 7340172703570'),('Dimensions','473,5 × 215 × 454 mm'),('Masse nette','7,2 kg'),('Carte mère','ATX / Micro-ATX / Mini-ITX'),('Ventilateurs fournis','3 × Aspect 12 RGB 120 mm (2 avant, 1 arrière)'),('Ventilation possible','Avant 2 × 120/140 ; haut 2 × 120/140 ; arrière 1 × 120 mm'),('Radiateur avant','Jusqu’à 280 mm'),('Radiateur haut','Jusqu’à 240 mm, RAM 46 mm max'),('Radiateur arrière','120 mm'),('GPU avec ventilateurs avant','405 mm max'),('Ventirad','170 mm max'),('Alimentation','ATX, 170 mm max'),('Stockage','4 positions SSD dédiées (2 incluses) ; 3 positions combinées HDD/SSD (2 plateaux inclus) ; 2 baies 5,25 pouces'),('Ports','2 × USB 3.0 5 Gbit/s ; audio et micro ; contrôleur RGB'),('USB-C','Kit en option vendu séparément'),('Panneaux','Verre trempé à gauche, acier à droite'),('Câblage','19 mm'),('Extension','7 slots')],{'manufacturerPartNumber':'FD-C-POR1A-06','depthMm':473.5,'widthMm':215,'heightMm':454,'fanCount':3,'fanSizeMm':120,'fanRgb':True,'sidePanel':'glass','maxGpuLengthMm':405,'maxCoolerHeightMm':170},mpn='FD-C-POR1A-06',replace=True,notes=['Le précédent code FD-C-POR1A-07 ne figure pas dans le tableau officiel. Le modèle noir RGB TG est FD-C-POR1A-06 ; les offres liées au code précédent sont retirées.'])

for id,key,p in [('case-o11','lianli-o11',{'depthMm':465,'widthMm':285,'heightMm':459,'maxGpuLengthMm':426,'maxCoolerHeightMm':167,'sidePanel':'glass'}),('case-lancool3','lianli-lancool3',{'depthMm':526,'widthMm':238,'heightMm':523,'maxGpuLengthMm':435,'maxCoolerHeightMm':187,'fanCount':4,'fanSizeMm':140,'fanRgb':False,'sidePanel':'glass'})]:
 rows=[]
 for t in source(key)['tables']:
  for row in t:
   if len(row)>=2 and row[0]:rows.append((row[0],row[1]))
 add(id,key,rows,p,replace=True)
 if id=='case-lancool3':records[id]['notes'].append('Le tableau technique fabricant annonce 187 mm pour le ventirad ; le texte marketing annonce 185 mm. La valeur du tableau est retenue avec cette discordance explicite. Les ventilateurs du modèle noir non RGB sont 200–1800 tr/min ; la variante RGB est distincte.')
add('case-xt-pro-ultra','phanteks-xt',[('Référence','PH-XT523P1_DBK01 — UPC 886523303138'),('Dimensions','450 × 230 × 500 mm'),('Carte mère','E-ATX jusqu’à 280 mm / ATX / Micro-ATX / Mini-ITX'),('Connecteurs arrière carte mère','MSI Project Zero / ASUS BTF / Gigabyte Project Stealth'),('Matériaux','Acier, verre trempé, plastique ABS'),('Stockage','5 × 2,5 pouces + 1 × 3,5 pouces, ou 3 × 2,5 pouces + 2 × 3,5 pouces'),('Ports','USB-C 3.2 Gen2 ; USB 3.0 ; prise combinée casque/micro'),('Extension','7 slots ; GPU vertical 3 slots avec riser vendu séparément'),('Ventilateurs livrés','4 × M25-140 D-RGB'),('Ventilation haut','3 × 120 ou 2 × 140 mm'),('Ventilation avant','3 × 120 ou 3 × 140 mm'),('Ventilation arrière','1 × 120 ou 1 × 140 mm'),('Ventilation sur cache PSU','3 × 120 mm'),('Radiateur haut','Jusqu’à 360 mm ; enveloppe 415 × 138 × 60 mm'),('Radiateur avant','Jusqu’à 240 mm selon tableau fabricant'),('GPU maximal','415 mm longueur, 184 mm largeur'),('Ventirad maximal','184 mm'),('Alimentation maximale','270 mm longueur'),('Masse nette','7,55 kg'),('Garantie','5 ans limitée')],{'depthMm':450,'widthMm':230,'heightMm':500,'maxGpuLengthMm':415,'maxCoolerHeightMm':184,'fanCount':4,'fanSizeMm':140,'fanRgb':True,'sidePanel':'glass'},replace=True,notes=['La profondeur constructeur est 450 mm ; l’ancienne valeur marchande 440 mm est remplacée. Le tableau donne simultanément 240 mm et une enveloppe incohérente de 170 mm pour le radiateur avant : cette enveloppe n’est pas utilisée pour garantir un montage.'])
add('case-p400a-digital','phanteks-p400-legacy',[(row[0],row[1]) for row in source('phanteks-p400-legacy')['tables'][0] if len(row)==2 and row[0] not in ['Specifications']],{'widthMm':210,'depthMm':470,'heightMm':465,'sidePanel':'glass'},notes=['Le site historique désigne la version Digital Black PH-EC400ATG_DBK ; la référence marchande PH-EC400ATG_DBK01 est conservée. Les autres couleurs et le modèle non Digital sont distincts.'])
add('case-p400a-digital','phanteks-p400-pdf',[('Modèles couverts','PH-EC400ATG / PH-EC400ATG_D ; sélectionner les instructions P400A_D'),('Ventirad maximal','160 mm'),('Alimentation maximale','270 mm'),('GPU maximal','420 mm'),('Carte mère E-ATX','272 mm max'),('Radiateur avant 360 — enveloppe','130 × 420 × 115 mm ; retirer le cache intermédiaire'),('Radiateur avant 280 — enveloppe','145 × 325 mm'),('Éclairage version Digital','D-RGB 3 broches ; alimentation SATA ; mode, couleur et synchronisation carte mère'),('Stockage additionnel','Jusqu’à 4 disques HDD avec supports PH-HDDKT_02 en option')],{'maxCoolerHeightMm':160,'maxGpuLengthMm':420})
for key in ['meshify2','montech-air903-base']:
 e=json.loads((ROOT/'data/comprehensive-review/power-chassis-evidence'/(key+'.json')).read_text());e['statusCode']=200;(S/(key+'.json')).write_text(json.dumps(e,ensure_ascii=False,indent=2))
add('case-meshify2','meshify2',[('Stockage combiné 3,5/2,5 pouces','6 plateaux inclus, 14 positions + 1 Multibracket'),('Stockage dédié 2,5 pouces','2 supports inclus, 4 positions'),('Baie 5,25 pouces','Aucune'),('Ports','1 × USB-C 3.1 Gen2 10 Gbit/s ; 2 × USB 3.0 ; audio et micro'),('Ventilation avant','3 × 120/140 mm, 2 × Dynamic X2 GP-14 inclus'),('Ventilation haut','3 × 120/140 mm'),('Ventilation arrière','1 × 120/140 mm, 1 × Dynamic X2 GP-14 inclus'),('Ventilation bas','2 × 120/140 mm'),('Hub ventilateurs','Nexus+ 2 : 3 ventilateurs PWM + 6 ventilateurs 3 broches'),('Filtres','Haut, avant et dessous'),('Extension','7 horizontaux + 2 verticaux'),('Riser vertical','Flex VRC-25 vendu séparément'),('Passage câbles','30 mm'),('Dimensions hors pieds','541 × 240 × 454 mm'),('Masse TG','10,5 kg')])
add('case-air903-base','montech-air903-base',[('Stockage maximal','2 disques 3,5 pouces ; 5 SSD 2,5 pouces'),('Ports','2 × USB 3.0 ; 1 × USB-C ; micro ; audio ; Reset ; LED'),('Ventilation haut','3 × 120 ou 2 × 140 mm'),('Ventilation avant','3 × 120 ou 3 × 140 mm'),('Ventilation cache PSU','2 × 120 mm'),('Ventilation arrière','1 × 120 ou 1 × 140 mm'),('Ventilateurs inclus','2 × 140 mm avant + 1 × 140 mm arrière ; PWM, non ARGB'),('Filtres','Haut et dessous'),('Passage câbles','27 mm'),('GPU largeur maximale','190 mm'),('Extension','7 slots'),('Garantie','1 an')])

# All 26 CPUs already have manufacturer CPU tables. Add published architecture,
# I/O and package information that the compatibility summary did not expose.
amd_labels=['Former Codename','Processor Technology for CPU Cores','Processor Technology for I/O Die','CPU Compute Die (CCD) Size','I/O Die (IOD) Size','Package Die Count','AMD EXPO™ Memory Overclocking Technology','Precision Boost Overdrive','Curve Optimizer Voltage Offsets','AMD Ryzen™ Master Support','Supporting Chipsets','CPU Boost Technology','Instruction Set','Supported Extensions','Launch Date','Native USB 3.2 Gen 2 (10Gbps)','Native USB 3.2 Gen 1 (5Gbps)','Native USB 2.0 (480Mbps)','Native SATA Ports','Native PCIe® Lanes (Total/Usable)','NVMe Support','System Memory Subtype','USB Type-C® DisplayPort™ Alternate Mode','Product ID Tray']
for a in items:
 c=a['component'];v=a['verified']
 if c['category']!='cpu' or not v:continue
 id=c['id'];model=id.removeprefix('cpu-')
 if c['brand']=='AMD':
  f=ROOT/'data/evidence'/('amd-'+model+'.json');live=ROOT/'data/comprehensive-review/cpu-evidence'/('amd-'+model+'-live.json')
  raw=json.loads(f.read_text());text=raw.get('markdown','');checked=raw.get('retrievedAt');src=next(s for s in v['sources'] if s['kind']=='manufacturer');key='cpu-amd-'+model
  live_mode=live.exists()
  if live_mode:
   raw=json.loads(live.read_text());text=raw['text'];checked=raw['checkedAt'];f=live
  # Captured manufacturer markup has blank-line-delimited labels/values. The
  # extraction ends at the next field, never at arbitrary token counts.
  rows=[]
  for label in amd_labels:
   m=re.search(r'(?:^|\n)'+re.escape(label)+r'\n([^\n]+(?:,\n[^\n]+)*)',text) if live_mode else re.search(r'(?:^|\n)'+re.escape(label)+r'\s*\n+(.*?)(?=\n{3,}|$)',text,re.S)
   if m:
    value=' '.join(m[1].strip().split()).replace(' ,',',')
    if value and not value.startswith('- ##'):rows.append((label,value))
  (S/(key+'.json')).write_text(json.dumps({'url':src['url'],'checkedAt':checked or src['checkedAt'],'statusCode':200,'reusedEvidencePath':str(f.relative_to(ROOT)),'primaryText':text},ensure_ascii=False,indent=2))
  if rows:add(id,key,rows,title='AMD — architecture, liaisons et fonctionnalités publiées')
 else:
  f=ROOT/'data/comprehensive-review/cpu-evidence'/('intel-'+model+'-live.json');e=json.loads(f.read_text());key='cpu-intel-'+model
  # Existing reviewed Intel source is reused at its original observation date;
  # full technical data are copied only if their schema explicitly pairs values.
  e['statusCode']=200;e['url']=next(s['url'] for s in v['sources'] if s['kind']=='manufacturer');e['checkedAt']=next(s['checkedAt'] for s in v['sources'] if s['kind']=='manufacturer');e['primaryText']=e.get('text',e.get('primaryText',e.get('markdown','')))
  (S/(key+'.json')).write_text(json.dumps(e,ensure_ascii=False,indent=2))
  labels=['Code Name','Lithography','Launch Date','Direct Media Interface (DMI) Revision','Max # of DMI Lanes','Scalability','PCI Express Configurations ‡','Thermal Solution Specification','Intel® Gaussian & Neural Accelerator','Intel® Thread Director','Intel® Deep Learning Boost (Intel® DL Boost) on CPU','Intel® Speed Shift Technology','Intel® Turbo Boost Technology ‡','Intel® Hyper-Threading Technology ‡','Instruction Set','Instruction Set Extensions','Idle States','Enhanced Intel SpeedStep® Technology','Thermal Monitoring Technologies','Intel® Volume Management Device (VMD)','Intel® Secure Key','Intel® Control-Flow Enforcement Technology','Intel® AES New Instructions','Intel® OS Guard','Execute Disable Bit ‡','Intel® Boot Guard','Mode-based Execute Control (MBEC)','Intel® Virtualization Technology (VT-x) ‡','Intel® Virtualization Technology for Directed I/O (VT-d) ‡','Intel® VT-x with Extended Page Tables (EPT) ‡']
  rows=[]
  for label in labels:
   m=re.search(r'(?:^|\n)'+re.escape(label)+r'\n([^\n]+)',e['primaryText'])
   if m:rows.append((label,m[1].strip()))
  add(id,key,rows,title='Intel — architecture, liaisons, instructions et virtualisation')

# MSI exposes a separate, exact-model specification endpoint. New references
# use the manufacturer's model code; no regional 306-... code is fabricated.
def norm(s):return re.sub(r'[^A-Z0-9]','',s.upper())
msi_special={'import-psu-30d0c61edddd':'MPG A1000G PCIE5','import-psu-6e66df777285':'MEG Ai1600T PCIE5','import-psu-0752c68e2f92':'MAG A1000GL PCIE5 II'}
for a in items:
 c=a['component']
 if c['category']!='psu' or c['brand']!='MSI':continue
 model=msi_special.get(c['id'],c['name'].split(' · ')[0])
 if 'Blanc' in c.get('finishName','') and model=='MPG A750GF':model='MPG A750GF WHITE'
 key='msi-'+model.lower().replace(' ','-');f=S/(key+'.json')
 if not f.exists():continue
 e=source(key);rr=e.get('msiSpecifications',[])
 if not rr:continue
 d={r['label']:r['value'] for r in rr};watts=int(re.search(r'\d+',d['Power Watt'])[0]);assert watts==c.get('wattage'),(c['id'],watts)
 dims=[float(v) for v in re.findall(r'[\d.]+',d['Dimensions (DxWxH)'].split('/')[0])];assert len(dims)==3
 p={'psuFormat':'ATX','wattage':watts,'depthMm':dims[0],'widthMm':dims[1],'heightMm':dims[2],'fanCount':1,'fanSizeMm':int(re.search(r'\d+',d['Fan Size'])[0])}
 if dims[1]!=150:
  p.pop('depthMm');p.pop('widthMm') # DN/BNL page reverses the usual ATX axes; no silent guess.
 mpn=a['verified']['mpn'] if a['verified'] else model
 add(c['id'],key,[(r['label'],r['value']) for r in rr],p,mpn=mpn,replace=True,notes=['La fiche technique MSI précise ce modèle exact. En l’absence de code régional 306-… publié, le code de modèle constructeur sert de référence et aucune offre marchande n’est ajoutée.'])
 if not a['verified']:modelIdentities[c['id']]=model

# Seasonic's manufacturer site associates specification and cable blocks with
# the same data-id. Pair them by that ID, not by position in a global page.
def seasonic_family(c):
 n=norm(c['name'].split(' · ')[0]);white='Blanc' in c['name'];w=c.get('wattage')
 known=(byid[c['id']]['verified'] or {}).get('mpn','').upper()
 if known=='FOCUS-GX-850-V4':return 'focus-gx-atx-3'
 if c['id']=='psu-focus-gx750' and not known:return None # Original curated name lacks its generation.
 if n=='FOCUSGXV4ATX32024':return 'focus-gx-white-atx-3' if white else 'focus-gx-atx-3'
 if n=='COREGXATX32024':return 'core-gx-white-atx-3-2024' if white else 'core-gx-atx-3'
 if re.fullmatch(r'FOCUSGX\d+ATX30',n):return 'atx3-focus-gx'
 if re.fullmatch(r'ATX3FOCUSGX\d+WHITE',n):return 'atx3-focus-gx-white'
 if re.fullmatch(r'PRIMETX\d+ATX31',n):return 'atx3-prime-tx'
 if re.fullmatch(r'FOCUSPLUS(?:\d+)?GOLD',n):return 'focus-plus-gold'
 if n=='FOCUSPLUSPLATINUM':return 'focus-plus-platinum'
 if n=='FOCUSGOLD':return 'focus-gold'
 if re.fullmatch(r'FOCUSGX(?:\d+)?',n):return 'focus-gx-white' if white else 'focus-gx'
 if n=='FOCUSPX':return 'focus-px'
 if n=='S12III':return 's12iii'
 if n=='S12II':return 's12ii'
 if n in ['M12IIEVO','M12II850EVO']:return 'm12ii-evo'
 if n=='PLATINUM':return 'platinum-series'
 if n=='PRIMESNOWSILENT':return 'prime-snow-silent'
 if n=='PRIMETITANIUM':return 'prime-titanium'
 if n=='PRIMEPLATINUM':return 'prime-platinum'
 if n=='PRIMEGOLD':return 'prime-gold'
 if re.fullmatch(r'PRIMEULTRATITANIUM(?:\d+)?',n):return 'prime-ultra-titanium'
 if re.fullmatch(r'PRIMEULTRAPLATINUM(?:\d+)?',n):return 'prime-ultra-platinum'
 if re.fullmatch(r'PRIMEULTRAGOLD(?:\d+)?',n):return 'prime-ultra-gold'
 if re.fullmatch(r'PRIMETX(?:\d+)?',n):return 'prime-tx'
 if re.fullmatch(r'PRIMEPX(?:\d+)?',n):return 'prime-px'
 if re.fullmatch(r'COREGX(?:\d+)?',n):return 'core-gx'
 if re.fullmatch(r'COREGC(?:\d+)?',n):return 'core-gc'
 if n=='COREGM':return 'core-gm'
 if n=='G12GC':return 'g12-gc'
 if n=='G12GM':return 'g12-gm'
 if n=='B12BC':return 'b12-bc'
 if n=='PRIMEFANLESS' and w==700:return 'prime-fanless-tx'
 # A wrong 500 W total is duplicated in the current PX-450 web table.
 # Do not select either row by that misleading total.
 return None
for a in items:
 c=a['component']
 if c['category']!='psu' or c['brand']!='Seasonic':continue
 fam=seasonic_family(c)
 if not fam:continue
 key='seasonic-'+fam;e=source(key);tables=e.get('tables',[]);table_blocks=[b for b in e.get('variantBlocks',[]) if b['attributes'].get('class')=='table'];pairs=[]
 for i,t in enumerate(tables):
  total=next((row[-1] for row in t if len(row)>=3 and row[-2]=='Total continuous power'),None)
  if total and re.match(str(c['wattage'])+r'\s*W\b',total):pairs.append((i,t,total))
 if len(pairs)!=1:continue
 i,power,total=pairs[0];tech=tables[i-1];d=dict(rows_from_table(tech));assert any('Technical Specifications' in r for r in tech)
 block=next((b for b in table_blocks if 'Total continuous power\n'+total in b['text']),None)
 if not block:continue
 rows=rows_from_table(tech);patch={'psuFormat':'ATX','wattage':c['wattage']}
 if 'Dimensions' in d:
  dims=[float(v) for v in re.findall(r'[\d.]+',d['Dimensions'])]
  if len(dims)==3 and dims[1]==150 and dims[2]==86:patch.update(depthMm=dims[0],widthMm=dims[1],heightMm=dims[2])
 fan=d.get('Fan Size','');f=re.search(r'\d+',fan)
 if f:patch.update(fanCount=1,fanSizeMm=int(f[0]))
 elif fan=='Fanless':patch['fanCount']=0
 for r in power:
  if len(r)==2 and r[0]=='AC Input':rows.append(('Entrée secteur',r[1]))
 cols=next((r[2:] for r in power if len(r)>2 and r[0]=='DC Output'),[])
 amps=next((r[1:] for r in power if len(r)>2 and r[0]=='Maximum Power'),[])
 if cols and len(cols)==len(amps):rows.extend(('Rail '+k+' — courant maximal',v) for k,v in zip(cols,amps))
 comb=next((r[1:] for r in power if len(r)==5 and not r[0]),[])
 if len(comb)==4:rows.extend(zip(['Puissance combinée +3,3 / +5 V','Puissance +12 V','Puissance −12 V','Puissance +5 VSB'],comb))
 rows.append(('Puissance continue',total))
 vid=block['attributes']['data-id'];cable=next((b for b in e['variantBlocks'] if b['attributes'].get('class')=='cable-in' and b['attributes']['data-id']==vid),None)
 if cable:
  for m in re.finditer(r'(\d+)\s*mm\n([^\n]+)\n(\d+)\s*connectors?\n(\d+)\s*cables?',cable['text']):rows.append(('Câble '+m[2]+' — '+m[1]+' mm',m[4]+' câble(s), '+m[3]+' connecteur(s) par câble'))
 mpn=a['verified']['mpn'] if a['verified'] else None
 if not mpn:
  base=c['name'].split(' · ')[0]
  if fam=='focus-plus-gold':mpn='SSR-'+str(c['wattage'])+'FX'
  elif fam=='focus-gold':mpn='SSR-'+str(c['wattage'])+'FM'
  elif fam=='s12iii':mpn='SSR-'+str(c['wattage'])+'GB3'
  else:mpn=base+(' '+str(c['wattage'])+' W' if str(c['wattage']) not in base else '')
 r=add(c['id'],key,rows,patch,mpn=mpn,replace=True,notes=['La puissance et la connectique proviennent du même onglet constructeur (data-id '+vid+'). Les variantes blanches, ATX 3.0, ATX 3.1 et les anciennes générations ont des pages distinctes. Aucun prix n’est déduit du catalogue constructeur.'])
 if not a['verified'] and not mpn.startswith('SSR-'):
  canonical={'focus-gx-atx-3':'FOCUS GX ATX 3.1','focus-gx-white-atx-3':'FOCUS GX White ATX 3.1','core-gx-atx-3':'CORE GX ATX 3.1','core-gx-white-atx-3-2024':'CORE GX White ATX 3.1'}.get(fam)
  modelIdentities[c['id']]=(canonical+' '+str(c['wattage'])+' W') if canonical else mpn+(' White' if 'white' in fam and 'WHITE' not in mpn.upper() else '')
 pdfkey=key+'-pdf0'
 if (S/(pdfkey+'.json')).exists():
  pdf=source(pdfkey)
  if mpn.startswith('SSR-'):assert mpn in pdf['primaryText']
  add(c['id'],pdfkey,[('Document fabricant',pdf['url'].rsplit('/',1)[-1])],title='Seasonic — fiche PDF de la famille exacte')
  if fam=='focus-gx-atx-3' and 'Compact Size (140 mm)' in pdf['primaryText']:add(c['id'],pdfkey,[('Profondeur constructeur','140 mm')],{'depthMm':140})

exec((ROOT/'scripts/deep-power-psu-expansion.py').read_text(),globals())
exec((ROOT/'scripts/deep-power-psu-additional.py').read_text(),globals())
exec((ROOT/'scripts/deep-power-inspected-manuals.py').read_text(),globals())
exec((ROOT/'scripts/deep-power-bequiet-archive.py').read_text(),globals())
exec((ROOT/'scripts/deep-power-coolermaster-sheets.py').read_text(),globals())
exec((ROOT/'scripts/deep-power-thermaltake-variants.py').read_text(),globals())
exec((ROOT/'scripts/deep-power-evga-indexed-pages.py').read_text(),globals())
(D/'manufacturer-index-matches.json').write_text(json.dumps(indexAudit,ensure_ascii=False,indent=2))

for id,model in modelIdentities.items():
 r=records[id];r['mpn']='';r['identityKind']='manufacturer-model';r['manufacturerModel']=model;r['offers']=[]
 r['patch'].pop('manufacturerPartNumber',None);r['patch']['manufacturerModel']=model
 r.get('fieldEvidence',{}).pop('manufacturerPartNumber',None)
 r['identityNote']='Modèle fabricant documenté : '+model+'. Le code commercial régional MPN/EAN reste à confirmer ; aucune offre n’est associée sur le seul nom de modèle.'
# JSON transport omits undefined deletion patches from the baseline registry.
# AMD TDP is not maximum electrical power/PPT; explicitly preserve the deletion.
for a in items:
 c=a['component']
 if c['category']=='cpu' and c['brand']=='AMD' and c['id'] in records:
  records[c['id']]['patch']['powerW']=None
  records[c['id']].get('fieldEvidence',{}).pop('powerW',None)

exec((ROOT/'scripts/project-deep-power-fields.py').read_text(),globals())
for im in photos:
 if im['id'] in records:
  im['mpn']=records[im['id']]['mpn']
  if records[im['id']].get('manufacturerModel'):im['manufacturerModel']=records[im['id']]['manufacturerModel']

# A row is covered by this ledger even if no primary model can be established.
# "Reviewed" is deliberately separate from "complete" and from price validity.
def usable_offers(v):return [o for o in (v or {}).get('offers',[]) if o['mpn']==v['mpn'] and o.get('market')=='FR' and o.get('currency')=='EUR' and o.get('condition')=='new' and o.get('availability')=='in_stock' and o.get('priceKind')=='current']
ledger=[]
for a in items:
 c=a['component'];id=c['id'];v=records.get(id) or a['verified'];r=reviews.get(id);p={**c,**((v or {}).get('patch',{}))};missing=[]
 dims=['widthMm','heightMm','depthMm'] if c['category']!='cpu' else []
 if c['category']=='cooler' and p.get('coolingType')=='aio':dims=['radiatorLengthMm','radiatorWidthMm','radiatorThicknessMm']
 for f in dims:
  if p.get(f) is None:missing.append(f)
 if c['category'] in ['case','cooler','psu'] and p.get('fanCount') is None:missing.append('fanCount')
 if v and v.get('identityKind')=='manufacturer-model':missing+=['commercialMPN','regionalEAN']
 if not v:missing+=['manufacturerModelCode','exactRevision','primaryTechnicalSource','manufacturerDimensions','connectorInventory','warranty']
 if c['category']=='cpu' and c['brand']=='AMD':missing+=['manufacturerPublishedPPT','packageHeight']
 price=usable_offers(v)
 state='primary_details_extended' if r else 'previous_exact_evidence_only' if v else 'exact_identity_unresolved'
 reason=(f"{r['newFactCount']} faits supplémentaires issus des sources individuelles indiquées." if r else 'Les preuves exactes précédentes sont conservées ; aucune nouvelle valeur technique n’a été validée dans cette passe.' if v else f"{c['brand']} {c['name']} : la ligne d’archive ne contient pas de MPN/révision primaire confirmés. Le nom et la puissance seuls ne permettent pas de choisir une génération, une connectique ou un code commercial régional.")
 ledger.append({'id':id,'category':c['category'],'brand':c['brand'],'name':c['name'],'state':state,'reason':reason,'manufacturerReference':v['mpn'] if v else None,'manufacturerModel':v.get('manufacturerModel') if v else None,'newSourceKeys':r['sourceKeys'] if r else [],'newFactCount':r['newFactCount'] if r else 0,'missingExplicitFields':sorted(set(missing)),'priceStatus':'verified_exact_new_stock_FR' if price else 'no_admissible_current_offer','sources':(v or {}).get('sources',[]),'researchMethod':'exact manufacturer page / power-specific table' if r else 'manufacturer product indexes searched; no unambiguous variant table accepted' if any(x['id']==id for x in indexAudit) else 'baseline evidence inventory; no individually fetched new source','indexResearch':[x for x in indexAudit if x['id']==id]})
counts={};bycat={}
for l in ledger:counts[l['state']]=counts.get(l['state'],0)+1;bycat[l['category']]=bycat.get(l['category'],0)+1
result={'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scopeCounts':bycat,'states':counts,'definition':'Détails supplémentaires vérifiés ne signifie pas fiche exhaustive ni disponibilité commerciale. Tous les IDs sont inventoriés ; les lignes sans recherche primaire individuelle nouvelle le disent explicitement. Les dimensions de rendu 3D ne sont jamais une preuve.','products':ledger}
(D/'coverage.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
(D/'manufacturer-images.json').write_text(json.dumps({'images':photos,'note':'Les images de ce manifeste sont URL-only ; les inspections visuelles sont consignées séparément par l’agent visuel.'},ensure_ascii=False,indent=2))
(D/'confirmed-products.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
(ROOT/'src/data/deepPowerChassisCatalog.ts').write_text('// Generated by scripts/build-deep-power-chassis.py from per-reference manufacturer evidence.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const deepPowerChassisProducts: Record<string, VerifiedProduct> = '+json.dumps(records,ensure_ascii=False,indent=2).replace('"powerW": null','"powerW": undefined')+';\n')
print(json.dumps({'records':len(records),'newFacts':sum(r['newFactCount'] for r in reviews.values()),'states':counts,'categories':bycat},ensure_ascii=False))
