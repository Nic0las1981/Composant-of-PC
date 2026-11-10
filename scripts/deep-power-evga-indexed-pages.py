"""Preserve manufacturer text recovered by Exa when legacy HTTP redirects.

These are dated retrievals of indexed manufacturer pages, not newly observed
offers. Refurbished -RX pages, empty cells, zero dimensions and comparison
cards are excluded. No regional MPN is invented from a model name.
"""
import hashlib
evgaIndexed=[]
for p in D.glob('search-evga-*.json'):
 search=json.loads(p.read_text());text='\n'.join(v.get('text','') for v in search.get('result',{}).get('content',[]))
 for block in re.split(r'\n---\n\n(?=Title:)',text):
  hm=re.match(r'Title: ([^\n]+)\nURL: (https?://[^\n]+)\n',block)
  if not hm or not re.match(r'https?://(?:www|jp|cn|eu|de)\.evga.com/products/(?:product|Specs/PSU).aspx',hm[2],re.I) or '-RX' in hm[1]:continue
  match=re.search(r'EVGA\s+(?:SuperNOVA\s+)?(\d{3,4})\s*(G FTW|G\+|P\+|[A-Z][A-Z0-9])\b',hm[1],re.I)
  if not match:continue
  w=int(match[1]);fam=match[2].upper();body=block.split('Highlights:',1)[-1];start=next((body.find(h) for h in ['### Cable Length','## Cable Length'] if h in body),-1)
  if start<0:continue
  body=body[start:];body=re.split(r'### Customer Reviews|## Compatibility',body)[0];rows=[];section=''
  for line in body.splitlines():
   if line.startswith('#'):section=line.lstrip('# ').strip()
   if not line.startswith('|'):continue
   cells=[v.strip() for v in line.strip('|').split('|')]
   if len(cells)<2 or not cells[0] or not any(cells[1:]) or re.fullmatch(r':?-+:?',cells[0]):continue
   label=cells[0];value=' | '.join(v for v in cells[1:] if v)
   if label in ['Gross Weight','淨重','UPC','EAN'] or (label=='Size' and re.search(r'\b0mm',value)):continue
   if label in ['Rail','Max output','Max Output','Input Voltage','AC Input','Input Frequency Range','Efficiency','Total','Operating Temperature','Japanese Capacitors','ECO Mode','MTBF','Size','Approvals','Fan Size / Bearing','風扇尺寸 / 軸承','工作溫度範圍'] or section in ['Cable Length','Connector Quantity']:rows.append((section+' — '+label,value))
  if len(rows)<5:continue
  key='evga-indexed-'+hashlib.sha1(hm[2].encode()).hexdigest()[:12];src={'key':key,'url':hm[2],'checkedAt':search.get('checkedAt'),'extractionStatus':'success','format':'manufacturer-page-indexed-text','captureMethod':'Exa search manufacturer page extract','nativeAccessNote':'Legacy product/specification endpoints now redirect to the home page or fail; indexing date is not supplied by Exa. No price is derived.','sourceTitle':hm[1],'primaryText':body,'tables':[],'images':[]}
  (S/(key+'.json')).write_text(json.dumps(src,ensure_ascii=False,indent=2));evgaIndexed.append({'key':key,'w':w,'family':fam,'title':hm[1],'body':body,'rows':rows})
for a in items:
 c=a['component'];id=c['id']
 if c['category']!='psu' or c['brand']!='EVGA' or id in records:continue
 base=c['name'].split(' · ')[0].replace('SuperNOVA ','');m=re.fullmatch(r'(\d+)\s*(G FTW|G\+|P\+|[A-Z][A-Z0-9])',base)
 if not m or int(m[1])!=c['wattage']:continue
 hits=[x for x in evgaIndexed if x['w']==c['wattage'] and x['family']==m[2]]
 if not hits:continue
 # If several regional pages remain, retain only strictly identical rows.
 x=hits[0];rows=[r for r in x['rows'] if all(r in y['rows'] for y in hits[1:])];d=dict(rows);patch={}
 if len(rows)<5:continue
 size=d.get('Additional Details — Size','');dm=re.fullmatch(r'([\d.]+)mm \(H\) x ([\d.]+)mm \(W\) x ([\d.]+)mm \(L\)',size)
 if dm and all(float(v)>0 for v in dm.groups()):patch.update(heightMm=float(dm[1]),widthMm=float(dm[2]),depthMm=float(dm[3]))
 fan=d.get('Additional Details — Fan Size / Bearing',d.get('Additional Details — 風扇尺寸 / 軸承',''));fm=re.match(r'(\d+)mm',fan)
 if fm:patch.update(fanCount=1,fanSizeMm=int(fm[1]))
 total=d.get('Output — Total',d.get('Power Specs — Total',''))
 if re.match(str(c['wattage'])+r'\s*W\b',total):patch['wattage']=c['wattage']
 model=('SuperNOVA ' if c['name'].startswith('SuperNOVA') else '')+base
 model_record(c,x['key'],rows,patch,model,['Texte fabricant historique récupéré par indexation Exa ; les URL anciennes ne servent plus leur fiche complète en HTTP natif. Les lignes des tableaux comparatifs de produits voisins sont exclues. Les variantes reconditionnées RX, les cellules vides et les dimensions à zéro sont exclues. La région commerciale reste à confirmer.'])
 for y in hits[1:]:
  e=source(y['key']);s={'name':'EVGA — comparaison des pages régionales indexées','url':e['url'],'checkedAt':e['checkedAt'],'kind':'manufacturer'}
  if s not in records[id]['sources']:records[id]['sources'].append(s)
 indexAudit.append({'id':id,'brand':'EVGA','state':'indexed_manufacturer_own_model_table','sourceURLs':[source(y['key'])['url'] for y in hits],'commonFieldCount':len(rows),'excluded':'RX refurbished variants, zero dimensions, adjacent comparison cards, offers'})

# Full GA launch article contains four independent power matrices, despite the
# legacy native URL now returning the current home page.
e=source('evga-ga-article-exa');gaTables={}
for block in re.findall(r'\| AC Input \|[^\n]+\n(?:[^\n]*\n)*?\| Output Power \|[^\n]+',e['primaryText']):
 table={}
 for line in block.splitlines():
  if line.startswith('|'):
   cells=[v.strip() for v in line.strip('|').split('|')]
   if cells[0]:table[cells[0]]=cells[1:]
 out=table.get('Output Power',[''])[0];m=re.fullmatch(r'(\d+)W@50°C',out)
 if m:gaTables[int(m[1])]=table
for a in items:
 c=a['component'];id=c['id'];w=c.get('wattage')
 if c['category']!='psu' or c['brand']!='EVGA' or id in records or w not in gaTables or c['name'].split(' · ')[0]!='SuperNOVA '+str(w)+' GA':continue
 t=gaTables[w];rails=t['DC Output'];amps=t['MAX Output'];combined=t['Combined'];assert len(rails)==len(amps)==5 and len(combined)==5
 rows=[('Modèle du tableau','SuperNOVA '+str(w)+' GA'),('Puissance continue et température ambiante',str(w)+' W à 50 °C'),('Input Voltage',t['AC Input'][0]),('80 PLUS certification','Gold'),('Efficiency','90 % à115 VAC / 92 % à220–240 VAC sous charge typique'),('Modular','Fully Modular'),('Fan Size','135 mm'),('Fan Bearing','Double Ball Bearing'),('Commande thermique','Mode ECO : ventilateur arrêté à charge faible/moyenne selon fabricant'),('Protections','OVP, UVP, OCP, OPP, SCP, OTP'),('Warranty','10 years'),('Condensateurs','100 % japonais'),('Architecture','LLC et conversion DC–DC des rails3,3/5V'),('PFC','Actif')]
 rows.extend(('Rail '+v+' — courant maximal',amps[i]) for i,v in enumerate(rails));rows.extend([('Puissance combinée +3,3 / +5 V',combined[0]),('Puissance +12 V',combined[2]),('Puissance −12 V',combined[3]),('Puissance +5 VSB',combined[4])])
 model_record(c,'evga-ga-article-exa',rows,{'wattage':w,'fanCount':1,'fanSizeMm':135},'SuperNOVA '+str(w)+' GA',['La matrice électrique propre à cette puissance est publiée dans l’article fabricant GA. Les dimensions et le nombre de câbles, absents de l’article, ne sont pas repris d’une autre série.'])
 indexAudit.append({'id':id,'brand':'EVGA','state':'indexed_manufacturer_watt_specific_power_matrix','sourceURL':e['url'],'columnPowerW':w})
