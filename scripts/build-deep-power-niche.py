"""Exact model/wattage sheets for all ADATA/XPG and Montech catalogue entries.

Regional ordering codes are not selected without a retail identity. Different
ATX revisions sharing a family retain only common measurements and explicit
contradictions. Native tables and full Exa extracts are retained as evidence.
"""
from pathlib import Path
import json,re,html,gzip,hashlib,datetime
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/power-niche'
INPUT=json.loads((OUT/'input.json').read_text());SOURCES={};PRODUCTS={};AUDIT=[]
def clean(s):return html.unescape(re.sub(r'\s+',' ',re.sub(r'<[^>]*>','',s))).strip()
def norm(s):return re.sub(r'[^a-z0-9]','',s.lower())
def html_tables(body):
 tables=[]
 for table in re.findall(r'<table\b[\s\S]*?</table>',body,re.I):
  rows=[]
  for row in re.findall(r'<tr\b[^>]*>([\s\S]*?)</tr>',table,re.I):
   cells=[clean(c) for c in re.findall(r'<t[dh]\b[^>]*>([\s\S]*?)</t[dh]>',row,re.I)]
   if len(cells)>=2:rows.append(cells)
  if rows:tables.append(rows)
 return tables
def markdown_tables(text):
 tables=[];table=[]
 for line in text.splitlines()+['']:
  if line.startswith('|'):
   cells=[c.strip() for c in line.strip('|').split('|')]
   if not all(re.fullmatch(r'[-: ]*',c) for c in cells):table.append(cells)
  elif table:tables.append(table);table=[]
 return tables
for path in (OUT/'sources').glob('*.json'):
 s=json.loads(path.read_text())
 if s.get('status')!=200:continue
 raw=path.with_suffix('.html.gz')
 s['tables']=html_tables(gzip.decompress(raw.read_bytes()).decode('utf8','replace')) if raw.exists() else s.get('tables',[])
 if s['tables']:path.write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n')
 SOURCES[s['url']]=s
for path in OUT.glob('exa-fetch-*.json'):
 result=json.loads(path.read_text());text='\n'.join(c.get('text','') for c in result['content'])
 for part in re.split(r'(?m)(?=^# .+\nURL:)',text):
  match=re.search(r'(?m)^URL: (https://\S+)',part)
  if not match:continue
  # Failed URLs appended by the tool do not become part of the product source.
  part=part.split('\nError fetching https://')[0]
  url=match[1];s={'url':url,'text':part,'tables':markdown_tables(part),'checkedAt':datetime.datetime.fromtimestamp(path.stat().st_mtime,datetime.timezone.utc).isoformat(),'sha256':hashlib.sha256(part.encode()).hexdigest(),'retrieval':'Exa full-page fetch','evidenceFile':str(path.relative_to(ROOT))}
  if url not in SOURCES or len(s['text'])>len(SOURCES[url]['text']):SOURCES[url]=s
def find(fragment):
 hits=[s for u,s in SOURCES.items() if fragment in u];assert hits,fragment
 return max(hits,key=lambda s:len(s['text']))
def add(c,model,sources,rows,patch,notes=None):
 rows=[(k,str(v)) for k,v in rows if v not in (None,'')]
 unique=list(dict.fromkeys(rows));notes=notes or []
 p={'mpn':'','identityKind':'manufacturer-model','manufacturerModel':model,
 'identityNote':'Modèle constructeur, puissance et finition rapprochés des documents cités. Le suffixe régional de commande reste non confirmé.',
 'sources':[{'name':('Montech' if 'montech' in s['url'] or 'telon' in s['url'] else 'ADATA XPG')+' — spécifications et manuel','url':s['url'],'checkedAt':s['checkedAt'],'kind':'manufacturer'} for s in sources],
 'groups':[{'title':'Alimentation · spécifications du modèle','rows':[{'label':k,'value':v} for k,v in unique]}],
 'patch':{'manufacturerModel':model,'wattage':c['wattage'],'psuFormat':'ATX',**patch,'description':f"Alimentation {model}. Dimensions, ventilation, câbles et limites publiées figurent dans la fiche détaillée."},'offers':[],
 'notes':['Aucun prix ni MPN régional déduit du seul nom du modèle.']+notes}
 PRODUCTS[c['id']]=p;AUDIT.append({'id':c['id'],'name':c['name'],'state':'manufacturer_model_documented','manufacturerModel':model,'technicalRows':len(unique),'sourceURLs':[s['url'] for s in sources],'notes':notes})

# Each Montech page has one exact wattage table. Native Telon is Montech's
# published older catalogue and supplies the original Century/Gamma/G5 models.
MONTECH_IDS={'TITAN GOLD':{750:326,850:327,1000:329,1200:330},'CENTURY G5':{750:370,850:369},'CENTURY':{550:186,650:185,850:175},'GAMMA II':{550:45,650:46,750:47},'APX':{550:409,650:408,750:407}}
translations={'Model Name':'Modèle fabricant','Product Name':'Modèle fabricant','Wattage':'Puissance nominale','Form Factor':'Format','80 PLUS Efficiency':'Certification 80 PLUS','Input':'Plage d’entrée','PFC':'PFC','Input Voltage':'Tension d’entrée','Input Current':'Courant d’entrée','Input Frequency':'Fréquence secteur','Fan Size':'Ventilateur','Operating Temperature':'Température de fonctionnement','Protections':'Protections','Certification':'Homologations','Regulatory':'Homologations','EAN':'EAN publié','Warranty':'Garantie','Efficiency':'Rendement','MTBF':'MTBF','Hold Up Time':'Temps de maintien','AC Input':'Entrée secteur','AC INPUT':'Entrée secteur','DC Output':'Ordre des rails de sortie','DC OUTPUT':'Ordre des rails de sortie','Max. Output Current':'Courants des rails (ordre ci-dessus)','Max. Output Power':'Puissances des rails (3,3/5 V combinés puis 12 V, −12 V et 5 VSB)','Total Power':'Puissance totale','Total POWER':'Puissance totale','ATX Version':'Format électrique publié'}
for item in INPUT:
 c=item['component']
 if c['brand']!='Montech':continue
 watts=c['wattage'];family=re.sub(r'\s+\d+W$','',c['name'].split(' · ')[0]);notes=[]
 if family in ['TITAN PLA','CENTURY II']:
  s=find('/'+family.lower().replace(' ','-')+'-'+str(watts)+'w')
 else:
  s=find('nid='+str(MONTECH_IDS[family][watts])+'&')
 model_match=None
 for table in s['tables']:
  for row in table:
   cells=[x for x in row if x]
   if cells and cells[0] in ['Product Name','Model Name']:model_match=cells[-1];break
  if model_match:break
 assert model_match and norm(family+str(watts)) in norm(model_match),(c['id'],model_match)
 rows=[('Puissance nominale',f'{watts} W'),('Format','ATX')];patch={};connectors=[];dimensions=None
 for table in s['tables']:
  all_text=' '.join(' '.join(row) for row in table)
  if not any(k in all_text for k in ['Product Name','Model Name','DC Output','DC OUTPUT','M/B 20','Cable Type']):continue
  cables='Cable Type' in all_text
  for row in table:
   cells=[cell for cell in row if cell]
   if len(cells)<2:continue
   label=cells[0];value=' · '.join(cells[1:])
   if label in ['Cables','DC Output','DC OUTPUT'] and cables:continue
   if label=='Fan' and len(cells)==3:label='Ventilateur · '+cells[1];value=cells[2]
   if label=='Bearing':label='Ventilateur · roulement'
   if label.startswith('Dimensions'):
    values=re.findall(r'\d+(?:\.\d+)?',re.sub(r'\s+','',value));dimensions=[float(x) for x in values[:3]]
    rows.append(('Dimensions publiées',value));continue
   if label in ['Fan Size','Ventilateur · Size']:
    m=re.search(r'(\d+)\s*mm',re.sub(r'(?<=\d)\s+(?=\d)','',value))
    if m:patch['fanSizeMm']=int(m[1])
   if label in ['Motherboard','CPU','PCIe','12V-2X6','12V-2x6','SATA','SATA 3.3V','Molex','Molex / FDD'] and cables:
    value=f'{cells[1]} câble(s) × {cells[2]} connecteur(s)' if len(cells)>2 else value
    connectors.append((label,value));continue
   if label=='Connectors':label=cells[1];value=cells[2]
   if re.match(r'^(M/B|CPU|PCIE|SATA|Molex|FDD|12\+4)',label):connectors.append((label,value));continue
   if label=='Max. Output Current' and len(cells)==6:rows.append(('Courant maximal du rail +12 V',cells[3]))
   if label=='Max. Output Power' and len(cells)==5:rows.append(('Rail +12 V',cells[2]))
   rows.append((translations.get(label,label),value))
 if dimensions and 150 in dimensions and 86 in dimensions:
  depth=next(v for v in dimensions if v not in [150,86]);patch.update(widthMm=150,heightMm=86,depthMm=depth)
  rows.extend([('Largeur','150 mm'),('Hauteur','86 mm'),('Profondeur',f'{depth:g} mm')])
  if dimensions[0]==150:notes.append('Axes normalisés au format ATX : largeur arrière 150 mm, hauteur 86 mm, axe restant en profondeur ; le tableau source inverse les deux axes horizontaux.')
 else:notes.append('Les axes mécaniques publiés demandent confirmation ; aucune dimension typée n’est inventée.')
 if connectors:rows.append(('Connecteurs',' ; '.join(k+' : '+v for k,v in dict(connectors).items())))
 modular=family not in ['GAMMA II','APX'];rows.append(('Modularité','Entièrement modulaire' if modular else 'Câbles fixes'))
 if family in ['CENTURY','CENTURY G5','TITAN GOLD','CENTURY II','GAMMA II']:rows.append(('Certification 80 PLUS','Gold'))
 if family in ['TITAN PLA','CENTURY II']:rows.append(('Version ATX','3.1'));rows.append(('Connecteur GPU de nouvelle génération','12V-2x6'))
 if family in ['TITAN GOLD','CENTURY G5']:rows.append(('Version ATX','3.0'));rows.append(('Connecteur GPU de nouvelle génération','12VHPWR'))
 if not any(k=='Garantie' for k,v in rows):
  m=re.search(r'(\d+)\s*[- ]?\s*[Yy]ears?\s*(?:[Ww]arranty|[Ll]imited)',s['text'])
  if m:rows.append(('Garantie',m[1]+' ans'))
 add(c,'MONTECH '+model_match,[s],rows,patch,notes)

PROTECTIONS='OCP, OVP, UVP, OPP, SCP, OTP, NLO, SIP'
def xpg_base(c,source,depth,fan,efficiency,warranty,modular=True):
 rows=[('Puissance nominale',f"{c['wattage']} W"),('Format','ATX'),('Certification 80 PLUS',efficiency),('Modularité','Entièrement modulaire' if modular else 'Câbles fixes'),('Garantie',f'{warranty} ans limitée'),('Ventilateur',f'{fan} mm'),('Protections',PROTECTIONS),('Largeur','150 mm'),('Hauteur','86 mm'),('Profondeur',f'{depth} mm')]
 return rows,{'widthMm':150,'heightMm':86,'depthMm':depth,'fanSizeMm':fan}
for item in INPUT:
 c=item['component']
 if c['brand'] not in ['ADATA','XPG']:continue
 w=c['wattage'];name=c['name'];notes=[];sources=[];conflicts={};model=re.sub(r'XPG\s*','',name.split(' · ')[0],flags=re.I)
 if 'PYLON' in name:
  s=find('datasheet_xpg_pylon_psu_250721_v2.pdf');sources=[s];rows,patch=xpg_base(c,s,140,120,'Bronze',5,False)
  rows += [('Version ATX','2.52'),('Tension d’entrée','100–240 V'),('Fréquence secteur','50–60 Hz'),('PFC','> 0,99'),('Température maximale de fonctionnement','50 °C'),('Roulement','FDB'),('Vitesse du ventilateur','2 000 tr/min'),('MTBF','100 000 h à pleine charge et 25 °C'),('Rail +12 V',f'{w} W, 100 % de la puissance nominale'),('Connecteurs',f"ATX 20+4 : 1 ; CPU 4+4 : {1 if w<=550 else 2} ; PCIe 6+2 : {2 if w<=550 else 4} ; SATA : {5 if w<=550 else 8} ; Molex : {2 if w<=550 else 3} ; Floppy : 1"),('Condensateur principal','Japonais, 105 °C'),('Topologie','DC-DC')]
  notes.append('Le PDF utilise visuellement la lettre O pour certains zéros (14O,12O,45O) ; les valeurs numériques sont normalisées sans modifier les colonnes par puissance.')
 elif 'CORE Reactor ' in name:
  s=find('XPG%20Core%20Reactor%20_QSG.pdf');sources=[s];rows,patch=xpg_base(c,s,140,120,'Gold',10)
  rows += [('Tension d’entrée','100–240 V'),('Fréquence secteur','47–63 Hz'),('Courant d’entrée',f'{12 if w==850 else 10} A'),('Rail +12 V',f'{w} W'),('Courant maximal du rail +12 V',{650:'54,1 A',750:'62,5 A',850:'70,8 A'}[w]),('Puissance combinée +3,3 V / +5 V',f'{110 if w==650 else 120} W'),('Condensateurs','Japonais, 105 °C'),('Câbles du manuel',f"ATX 24 : 1 ; EPS 4+4 : {1 if w==650 else 2} ; PCIe 6+2 : {2 if w==650 else 4} câbles ; SATA : 3 câbles dans le tableau"),('Longueur câble ATX/EPS/PCIe','650 mm ± 10 mm'),('Longueur câble SATA','500 mm ± 10 mm')]
  rows=[(k,'OCP, OVP, OPP, OTP, NLO, SCP' if k=='Protections' else v) for k,v in rows]
  notes.append('Le manuel distingue câbles et connecteurs ; les tableaux PCIe ne suffisent pas à multiplier les prises par câble. Les nombres de câbles sont conservés comme tels.')
 elif 'Core Reactor II VE' in name:
  s=find('xpg_core_reactor_ii_ve_datasheet.pdf');old=find('xpg%5Fcore%5Freactor%5Fii%5Fve%5Fdatasheet%5F202409.pdf');sources=[s,old];rows,patch=xpg_base(c,s,140,120,'Gold',7)
  rows += [('Tension d’entrée','100–240 V'),('PFC','0,99'),('Roulement','FDB'),('Connecteurs',f'ATX 20+4 : 1 ; CPU 4+4 : 2 ; PCIe 6+2 : {2 if w==650 else 3} ; SATA : 6 ; Molex : 2'),('Connecteur GPU 16 contacts',f'1 connecteur ; capacité publiée {450 if w==650 else 600} W')]
  notes.append('Les fiches de la famille ont été révisées de ATX 3.0/12VHPWR à ATX 3.1/12V-2x6. Sans révision du produit d’archive, ces deux champs restent indéterminés ; dimensions et câblage commun sont conservés.')
  conflicts['atx']='ATX 3.0 et ATX 3.1 publiés selon édition du document.'
 elif 'Core Reactor II' in name:
  s=find('xpg_core_reactor_ii_datasheet_202509.pdf');old=find('/datasheet.pdf');sources=[s,old];rows,patch=xpg_base(c,s,140 if w<=850 else 160,120 if w<=850 else 135,'Gold',10)
  rows += [('PFC','> 0,99'),('Courant d’entrée',f'{ {650:10,750:10,850:12,1000:13,1200:15}[w]} A'),('Fréquence secteur','47–63 Hz' if w<=850 else '50–60 Hz'),('Roulement','FDB'),('Condensateurs','Japonais, 105 °C'),('Finition confirmée','Blanc' if 'Blanc' in name else 'Noir')]
  if 'Blanc' in name:assert 'COREREACTORII850G-WHCEU' in s['text']
  notes.append('Révision de connecteur non identifiée : l’ancien document publie ATX 3.0/12VHPWR et celui de septembre 2025 ATX 3.1/12V-2x6 sous les mêmes codes régionaux. Les mesures communes sont conservées, aucune génération n’est choisie arbitrairement.')
  conflicts['atx']='ATX 3.0 / 3.1 selon édition ; connecteur 12VHPWR / 12V-2x6 non tranché.'
 elif 'KYBER' in name:
  s=find('xpg_kyber_psu_datasheet.pdf');new=find('xpg_kyber_psu_datasheet_202409.pdf');sources=[s,new];rows,patch=xpg_base(c,s,140,120,'Gold',5,False)
  rows += [('Tension d’entrée','100–240 V'),('Courant d’entrée',f'{12 if w==850 else 10} A'),('Fréquence secteur','47–63 Hz'),('PFC','> 0,99'),('Roulement','FDB'),('Connecteurs','ATX 20+4 : 1 ; CPU 4+4/8 : 2 ; PCIe 6+2 : 2 ; SATA : 6 ; Molex : 2'),('Longueur câble ATX/CPU','650 mm'),('Longueur câble PCIe','600 mm'),('Longueur câble SATA','450 + 150 + 150 mm')]
  if w==650:rows += [('Version ATX','2.52'),('Connecteur GPU 16 contacts','Aucun')]
  else:conflicts['atx']='ATX 3.0 / 12VHPWR dans le premier document, ATX 3.1 / 12V-2x6 dans la révision 202409.';notes.append(conflicts['atx'])
 elif 'CYBERCORE II' in name:
  s=find('cybercore_ii_datasheet.pdf');sources=[s];rows,patch=xpg_base(c,s,160,120,'Platinum',10)
  rows += [('Versions ATX déclarées','3.0 et 3.1 dans le même document'),('Connecteur GPU 16 contacts','12VHPWR : 1 câble de 650 mm'),('Roulement','Double roulement à billes, XPG VENTO PRO 120 PWM par Nidec'),('PFC','> 0,99'),('Tension d’entrée','110–240 V selon cette fiche'),('Courant d’entrée',f'{15 if w==1300 else 13} A'),('Fréquence secteur','50–60 Hz'),('Câbles communs','ATX 20+4 : 1 × 750 mm ; CPU 4+4 : 2 × 750 mm'),('Condensateurs','Japonais, 105 °C'),('Architecture','Contrôle numérique T.I. ; PFC entrelacé')]
  notes.append('Les cellules du tableau PCIe/SATA/Molex du PDF extrait sont incohérentes (quantités câbles/prises). Leurs totaux ne sont pas validés.')
 elif 'CYBERCORE' in name:
  s=find('xpg_cybercore_qsg.pdf');news=find('/news/963');faq=find('pc-components-CYBERCORE?tab=faq');sources=[s,news,faq]
  rows=[('Puissance nominale',f'{w} W'),('Certification 80 PLUS','Platinum'),('Modularité','Entièrement modulaire'),('Garantie','10 ans'),('Ventilateur','120 mm, XPG VENTO PRO 120 PWM par Nidec'),('Roulement','Double roulement à billes'),('Profondeur','160 mm'),('Protections',PROTECTIONS),('Courant maximal du rail +12 V','108,33 A' if w==1300 else '83,33 A'),('Câbles CPU/PCIe','Conducteurs 16 AWG'),('Condensateurs','Japonais, 105 °C'),('Ventilation semi-passive','Arrêt sous environ 30 % de charge, selon communiqué fabricant'),('Topologie','PFC entrelacé ; PMIC numérique ; DC-DC')]
  patch={'depthMm':160,'fanSizeMm':120}
  if w==1300:rows += [('Rail +12 V','1 300 W'),('Tension d’entrée','100–240 V'),('Fréquence secteur','50–60 Hz'),('Courant d’entrée','15 A'),('Puissance combinée +3,3 V / +5 V','130 W')]
  notes.append('L’extraction du manuel original ne restitue pas toutes ses pages mécaniques et de câbles. Ces valeurs ne sont pas copiées depuis le CYBERCORE II.')
 elif 'FUSION' in name:
  s=find('xpg_fusion_1600_titanium_psu_datasheet_202509.pdf');sources=[s];rows,patch=xpg_base(c,s,210,135,'Titanium',12)
  rows += [('Puissance selon tension d’entrée','1 300 W sur 100–240 V ; 1 600 W sur 115–240 V selon les deux plages du fabricant'),('Courant d’entrée','15–8 A'),('Fréquence secteur','47–63 Hz'),('PFC','> 0,99'),('Roulement','Double roulement à billes'),('Pilotage','Contrôle et surveillance numériques XPG PRIME'),('Condensateurs','Japonais, 105 °C'),('Architecture','Transformateur planaire Delta ; transistors GaN ; LLC et DC-DC'),('Port de commande','PRIME port et OC Link')]
  notes.append('La référence d’archive ne précise pas la révision. Le document 202509 décrit ATX 3.1 et 12V-2x6 ; ces détails ne sont pas appliqués à un ancien exemplaire non identifié.')
 else:AUDIT.append({'id':c['id'],'state':'source_missing','name':name});continue
 model='XPG '+model
 if str(w) not in model:model+=' '+str(w)+' W'
 if 'Blanc' in name:model+=' White'
 add(c,model,sources,rows,patch,notes)
 if conflicts:PRODUCTS[c['id']]['fieldEvidence']={key:{'value':value,'conflicting':True,'sourceURL':sources[0]['url'],'checkedAt':sources[0]['checkedAt'],'reason':'Versions fabricant distinctes non rattachables à la révision d’archive.'} for key,value in conflicts.items()}

(OUT/'products.json').write_text(json.dumps(PRODUCTS,ensure_ascii=False,indent=2)+'\n')
(OUT/'per-id-review.json').write_text(json.dumps({'total':len(INPUT),'documented':len(PRODUCTS),'records':AUDIT},ensure_ascii=False,indent=2)+'\n')
(OUT/'source-index.json').write_text(json.dumps([{k:s.get(k) for k in ['url','checkedAt','sha256','retrieval','evidenceFile']} for s in SOURCES.values()],ensure_ascii=False,indent=2)+'\n')
(ROOT/'src/data/deepPowerNicheCatalog.ts').write_text("import type {VerifiedProduct} from './verifiedTypes.ts';\n// Generated from exact model/wattage primary documents; regional SKU remains unresolved.\nexport const deepPowerNicheProducts:Record<string,VerifiedProduct>="+json.dumps(PRODUCTS,ensure_ascii=False,separators=(',',':'))+';\n')
print(json.dumps({'reviewed':len(INPUT),'documented':len(PRODUCTS),'rows':sum(len(p['groups'][0]['rows']) for p in PRODUCTS.values())}))
