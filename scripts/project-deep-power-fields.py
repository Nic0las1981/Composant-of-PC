"""Map already captured primary facts to the finite technical checklist.
This adds field-scoped provenance, not guessed values or relaxed requirements.
"""

def fact_entries(r):
 return [(k.split('.',2)[-1],v) for k,v in r.get('fieldEvidence',{}).items() if k.startswith('details.')]
def project(r,field,labels=(),prefixes=(),check=None):
 selected=[(k,v) for k,v in fact_entries(r) if (k in labels or any(k.startswith(p) for p in prefixes)) and (check is None or check(str(v['value'])))]
 if not selected:return
 # A field cites one actual source: do not imply that a combined value was
 # present on a page that documented only one part of it.
 urls={v['sourceURL'] for k,v in selected}
 if len(urls)>1:
  best=max(urls,key=lambda u:sum(v['sourceURL']==u for k,v in selected));selected=[(k,v) for k,v in selected if v['sourceURL']==best]
 evidence=copy.deepcopy(selected[0][1]);evidence['value']=str(selected[0][1]['value']) if len(selected)==1 else ' ; '.join(k+' : '+str(v['value']) for k,v in selected)
 r['fieldEvidence'][field]=evidence

def direct(r,field,value,key):
 e=source(key)
 if not any(s['url']==e['url'] for s in r['sources']):r['sources'].append({'name':'Spécification fabricant — preuve de champ','url':e['url'],'checkedAt':e['checkedAt'],'kind':'manufacturer'})
 r.setdefault('fieldEvidence',{})[field]={'value':value,'sourceURL':e['url'],'checkedAt':e['checkedAt']}

for id,r in records.items():
 c=byid[id]['component'];category=c['category'];evidence=r.setdefault('fieldEvidence',{})
 # Existing numeric patches created by add() already cite the exact source.
 aliases={'case':{'height':'heightMm','width':'widthMm','depth':'depthMm','gpuClearance':'maxGpuLengthMm','coolerClearance':'maxCoolerHeightMm','fansIncluded':'fanCount'},'cooler':{'fans':'fanCount','fanSize':'fanSizeMm'},'psu':{'power':'wattage','format':'psuFormat','height':'heightMm','width':'widthMm','depth':'depthMm','fan':'fanSizeMm'}}
 for target,base in aliases.get(category,{}).items():
  if base in evidence:evidence[target]=copy.deepcopy(evidence[base])
 if category=='cooler':
  mappings={
   'sockets':['Socket compatibility','Socket compatibility Intel','Socket compatibility AMD','CPU Socket','General — CPU Socket Compatibility','Compatibillity — Intel','Compatibillity — AMD'],
   'rpm':['Speed range','Rated Speed','Speed @ 100% PWM (rpm)','Fan Speed','Fan Specifications — Speed','Speed','Speed at 100% PWM (rpm)','Vitesse des ventilateurs'],
   'noise':['Acoustical noise (max.)','Noise Level','Overall noise level (dB(A)) @ 50/75/100% (rpm)','Fan Noise','Noise','Noise level (dB(A)) at 50% / 75% /100% rpm','Bruit maximal par ventilateur'],
   'airflow':['Airflow (max.)','Air Flow','Airflow at 100% PWM / 12V (CFM / m3/h)','Fan Airflow','Fan Specifications — Air Flow','Airflow','Débit maximal par ventilateur'],
   'pressure':['Static pressure (max.)','Air Pressure','Air Pressure at 100% PWM / 12V (mm H2O)','Fan Air Pressure','Fan Static Pressure','Fan Specifications — Static Pressure','Static Pressure'],
   'connectors':['Connector','Fan Connector','Pump Connector','LED Connector','Fan Specifications — Connector','General Specifications — All-In-One Connector','General Specifications — Splitt Connector','General Specifications — LED Connector','Fan Power Connector','Cap — Connectors','Pump connector','Lighting connector'],
   'dimensions':['Product Dimensions','Height with fan(s)','Width with fan(s)','Depth with fan(s)','Overall dimensions without mounting material (L x W x H), (mm)','Dimensions radiator, incl. fan (H x W x D), (mm)','Dimensions cooling block (H x W x D), (mm)'],
  }
  for field,labels in mappings.items():project(r,field,labels)
  keys=reviews[id]['sourceKeys'];key=next((k for k in keys if not k.endswith('-pdf')),keys[0]);e=source(key)
  # These exact manufacturers describe heatpipe/air heatsinks or liquid AIOs.
  direct(r,'type','Refroidissement liquide AIO' if c.get('coolingType')=='aio' else 'Ventirad à caloducs et ventilateur(s)',key)
  if key.startswith('deepcool-'):
   m=re.search(r'Application For\s*\nIntel\n([^\n]+)\nAMD\n([^\n]+)',e['primaryText'])
   if m:direct(r,'sockets','Intel '+m[1]+' ; AMD '+m[2],key)
  if c.get('coolingType')=='aio' and 'dimensions' not in evidence:
   labels=['Radiator Dimensions','Pump Dimensions','Fan Dimensions','Radiator Specifications — Dimensions','Cap — Cap Diameter','Cap — Cap Height']
   project(r,'dimensions',labels)
   # A radiator-only table is not an assembly envelope. State its scope in the
   # supplied value instead of adding a guessed fan/pump thickness.
   if 'dimensions' in evidence:evidence['dimensions']['value']='Éléments documentés séparément (pas une enveloppe assemblée) : '+str(evidence['dimensions']['value'])
 elif category=='case':
  mappings={
   'formFactors':['Case Supported','General — Motherboard Compatibility','Carte mère','MOTHERBOARD SUPPORT','MOTHERBOARD','Motherboard Support'],
   'psuFormats':['Case Power Supply','PSU SUPPORT'],
   'psuClearance':['Maximum PSU Length','Clearance — PSU Length','Clearance — PSU Clearance','PSU CLEARANCE','Alimentation maximale','Alimentation avec 1 plateau HDD','Alimentation avec 2 plateaux HDD'],
   'radiators':['Radiators','Radiateurs','Radiator Compatibility','RADIATOR SUPPORT'],
   'fanMounts':['Ventilateurs possibles','Ventilation','Ventilation possible','FAN SUPPORT'],
   'drives':['Case Drive Bays','Stockage','DRIVE SUPPORT','STORAGE','Stockage maximal','Stockage combiné 3,5/2,5 pouces','Stockage dédié 2,5 pouces','Baie 5,25 pouces'],
   'frontIO':['Case Front IO','Ports','Ports — fiche PDF','I/O PORTS','IO PORTS','Front I/O'],
  }
  prefixes={'radiators':['Radiator Support — ','Radiator Support - ','Radiateur '],'fanMounts':['Fan Support — ','Fan Support - ','Ventilation '],'drives':['Drive Bays — '],'frontIO':['Front I/O Ports — ']}
  for field,labels in mappings.items():project(r,field,labels,prefixes.get(field,[]))
  if 'psuFormats' not in evidence:project(r,'psuFormats',['Alimentation'],check=lambda x:bool(re.search(r'ATX|SFX|TFX',x)))
  if 'psuClearance' not in evidence:project(r,'psuClearance',['Alimentation','PSU SUPPORT'],check=lambda x:bool(re.search(r'\d+\s*mm',x)))
 elif category=='psu':
  mappings={
   'atx':['ATX Version','ATX12V Version','Form Factor','Form factor','Form Factor (ATX12V)','Type','Platform','Compliance Standard','Product Info — Compliance Standard'],
   'efficiency':['80 PLUS Efficiency','Efficiency Rating','80 PLUS certification','Efficiency','80 PLUS Rating','Certification 80 PLUS','80 PLUS®','80 Plus','80 PLUS','General — 80 PLUS Rating'],
   'modularity':['Modular','Modularity','Modular cables','Modularité','Back Plate','General — Modular'],
   'rail12v':['Puissance +12 V','Max. combined power 12V (W)','Rail +12 V','DC Output Rating — +12 V'],
   'protections':['Protection','Protections','Protection Features','Output Protection','Electrical Features — Protections'],
   'warranty':['Warranty','Warranty (Years)','Garantie','Product Info — Warranty'],
  }
  for field,labels in mappings.items():project(r,field,labels,check=(lambda v:bool(re.search(r'ATX.*\d|EPS.*\d|SFX12V.*\d',v))) if field=='atx' else None)
  project(r,'connectors',['Cable Connectors','Cables','Included Cables','Connectors','ATX Connector','PATA Connector','SATA Connector','Floppy Connector','ATX-Motherboard (20+4-pin)','P4+4 (CPU)','P8 (CPU)','P4 (CPU)','12V-2x6 cables','PCI-e 6+2-pin (GPU)','PCI-e 6-pin (GPU)','SATA','PATA','FDD (Floppy)','PCI-E 6+2PIN','Connector'],['Cable Length & Connector Quantity — ','Câble ','EPS ','ATX 24 Pin','PCI-e ','SATA Connectors','Peripheral 4 Pin','12VHPWR','12V-2x6','ATX (24 pin)','EPS (8 pin)','EPS (4+4 pin)','PCI-E (6+2 pin)'])
  # A GPU-only connector count is not a full connector inventory.
  cf=evidence.get('connectors')
  if cf and not re.search(r'ATX|MB|motherboard|Motherboard',str(cf['value'])):evidence.pop('connectors')

# CPU basics are linked to the same exact official page as the added details.
# Do not recreate unproven AMD PPT from the catalog's TDP or old scene profile.
cpulabels={'socket':['CPU Socket','Processor Socket'],'cores':['# of CPU Cores','Total Cores'],'threads':['# of Threads','Total Threads'],'baseClock':['Base Clock','Performance-core Base Frequency','Processor Base Frequency'],'boostClock':['Max. Boost Clock','Max Turbo Frequency'],'cache':['L3 Cache','Total L3 Cache','Cache'],'thermalPower':['Default TDP','Processor Base Power'],'memory':['System Memory Type','Memory Types'],'memoryChannels':['Memory Channels','Max # of Memory Channels'],'graphics':['Graphics Model','Processor Graphics']}
for a in items:
 c=a['component'];id=c['id']
 if c['category']!='cpu' or id not in records:continue
 r=records[id];key='cpu-'+c['brand'].lower()+'-'+id.removeprefix('cpu-');e=source(key);text=e['primaryText'];blank='reusedEvidencePath' in e and '/cpu-evidence/' not in e['reusedEvidencePath']
 for field,labels in cpulabels.items():
  for label in labels:
   m=re.search(r'(?:^|\n)'+re.escape(label)+r'\s*\n+(.*?)(?=\n{3,}|$)',text,re.S) if blank else re.search(r'(?:^|\n)'+re.escape(label)+r'\n([^\n]+)',text)
   if m:
    val=' '.join(m[1].strip().split())
    if val and len(val)<500 and not val.startswith('- ##'):direct(r,field,val,key);break
 if c['brand']=='AMD':r['fieldEvidence'].pop('electricalPower',None)
 else:
  m=re.search(r'(?:^|\n)Maximum Turbo Power\n([^\n]+)',text)
  if m:direct(r,'electricalPower',m[1],key)

# Additional literal passages present in the captured primary documents.
for id,key,field,value,needle in [
 ('case-4000d','corsair-4000d-black','drives','2 × SSD 2,5 pouces et 2 × HDD 3,5 pouces','2x 2.5in SSDs and 2x 3.5in HDDs'),
 ('case-4000d-white','corsair-4000d-white','drives','2 × SSD 2,5 pouces et 2 × HDD 3,5 pouces','2x 2.5in SSDs and 2x 3.5in HDDs'),
 ('case-5000d','corsair-5000d','drives','4 × SSD 2,5 pouces et 2 × HDD 3,5 pouces','4X 2.5IN SSDS2X 3.5IN HDDS'),
 ('case-3000d','corsair-3000d','drives','2 plateaux pour SSD 2,5 pouces ou HDD 3,5 pouces','2x 2.5in SSDs or 3.5in HDDs'),
 ('case-3000d','corsair-3000d','formFactors','ATX (les autres formats ne sont pas précisés dans ce passage)','mid-tower ATX chassis'),
 ('case-7000d','corsair-7000d','fanMounts','Jusqu’à 12 × 120 mm ou 7 × 140 mm ; combinaisons selon emplacement','12x 120mm or 7x 140mm'),
 ('case-north','fractal-north-product-sheet','psuFormats','ATX','Power supply type'),
 ('case-north-white','fractal-north-product-sheet','psuFormats','ATX','Power supply type'),
 ('case-ap201','asus-ap201-overview','psuFormats','ATX','standard ATX'),
 ('case-meshify2','meshify2','psuClearance','250 mm avec la cage HDD installée','250 mm (with HDD cage installed)'),
 ('case-air903-base','montech-air903-base','psuClearance','240 mm ; alimentation ATX','240mm ATX'),
 ('cooler-ek-nucleus360','ek-nucleus-cr360','dimensions','Radiateur 400 × 124 × 27 mm ; bloc pompe 82,3 × 69,2 × 61,6 mm (éléments séparés)','82.3 x 69.2 x 61.6'),
 ('cooler-ek-nucleus360','ek-nucleus-cr360','sockets','Intel LGA 1150, 1151, 1155, 1156, 1200, 2011, 2011-3, 2066, 1700, 1851 ; AMD AM4 / AM5','1150, 1151, 1155, 1156, 1200, 2011, 2011-3, 2066'),
 ('cooler-ek-nucleus360','ek-nucleus-cr360','connectors','4 broches PWM pour pompe et ventilateurs ; ARGB 3 broches 5 V','4-Pin PWM Header for pump and fan operation'),
]:
 e=source(key)
 if needle.lower() in e['primaryText'].lower():direct(records[id],field,value,key)

# The user also requested LDLC. Reuse its exact-MPN product tables at their real
# original observation dates for remaining fields absent from primary pages.
# No catalogue-family inference and no fresh price/date are introduced here.
for id in ['case-h7','case-h9','case-lancool3','case-xt-pro-ultra','cooler-peerless','cooler-h100i240','cooler-h150i360','cooler-h170i-lcd-420']:
 r=records[id];f=ROOT/'data/evidence'/('retailer-'+id+'.json');raw=json.loads(f.read_text());text=raw['markdown'];rows={}
 for m in re.finditer(r'\| ### ([^|]+)\|\s*([^\n]+)',text):
  value=re.sub(r'\[([^\]]+)\]\([^)]*\)',r'\1',m[2]).replace('\\_','_').strip(' |');rows[m[1].strip()]=value
 def refnorm(s):return re.sub(r'[^A-Z0-9]','',s.upper())
 if refnorm(rows.get('Modèle',''))!=refnorm(r['mpn']):continue
 url=raw['metadata']['sourceURL'];date=raw['retrievedAt'];src={'name':'LDLC — tableau exact '+r['mpn'],'url':url,'checkedAt':date,'kind':'retailer'}
 if src not in r['sources']:r['sources'].append(src)
 def retailer_fact(field,value):r['fieldEvidence'][field]={'value':value,'sourceURL':url,'checkedAt':date}
 if id.startswith('case-') and rows.get('Format Alimentation') and 'psuFormats' not in r['fieldEvidence']:retailer_fact('psuFormats',rows['Format Alimentation'])
 if id.startswith('cooler-') and 'dimensions' not in r['fieldEvidence']:
  labels=['Hauteur (ventilateur inclus)','Largeur (ventilateur inclus)','Profondeur (ventilateur inclus)']
  if all(rows.get(k) for k in labels):retailer_fact('dimensions',' ; '.join(k+' : '+rows[k] for k in labels))

# Complete the NZXT distributed assembly from its own power/size variant row.
for id,size,rad in [('cooler-kraken240',240,'275 × 123 × 30'),('cooler-kraken360',360,'394 × 121 × 30')]:
 direct(records[id],'dimensions','Radiateur '+rad+' mm ; tête de pompe Ø74,7 × 55,97 mm ; ventilateurs F120P 120 × 120 × 26 mm (éléments séparés)','kraken2023')
for id,key in [('cooler-phantom','thermalright-phantom-exa'),('cooler-peerless','thermalright-peerless-exa')]:
 e=source(key);m=re.search(r'Intel：([^\n]+)\sAMD：([^\n]+)',e['primaryText'])
 if m:direct(records[id],'sockets','Intel '+m[1]+' ; AMD '+m[2],key)
peer=records['cooler-peerless'];raw=json.loads((ROOT/'data/evidence/retailer-cooler-peerless.json').read_text())
assert '2 ventilateurs 120 mm' in raw['markdown']
peer['patch']['fanCount']=2
peer['fieldEvidence']['fanCount']={'value':2,'sourceURL':raw['metadata']['sourceURL'],'checkedAt':raw['retrievedAt']}
peer['fieldEvidence']['fans']=copy.deepcopy(peer['fieldEvidence']['fanCount'])
e=source('nzxt-h6-build');assert 'compatible with most ATX style Power Supplies' in e['primaryText']
direct(records['case-h6'],'psuFormats','ATX','nzxt-h6-build')
# The H150i product page names three AF RGB ELITE 120mm fans. The exact fan
# page supplies its per-fan noise figure, explicitly not total assembly noise.
e=source('corsair-af120rgb-elite');d=dict(all_tables('corsair-af120rgb-elite'))
if d.get('Sound Level'):
 assert 'Three AF RGB ELITE Series PWM 120mm fans' in source('corsair-h150')['primaryText']
 direct(records['cooler-h150i360'],'noise',d['Sound Level']+' par ventilateur AF120 RGB ELITE ; pas le bruit cumulé de l’AIO','corsair-af120rgb-elite')
 records['cooler-h150i360']['groups'].append({'title':'Corsair — ventilateur AF120 RGB ELITE livré','rows':[{'label':'Bruit annoncé par ventilateur','value':d['Sound Level']}]})
