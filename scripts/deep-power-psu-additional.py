"""Additional manufacturer tables; imported by build-deep-power-chassis.py.
All matching is exact model/revision/finish; no inherited visual dimensions.
"""

def good_extra(prefix):
 out=[]
 for p in sorted(S.glob(prefix+'*.json')):
  e=json.loads(p.read_text())
  if e.get('statusCode')==200 and e.get('primaryText'):out.append(e)
 return out

def psu_name(c):return c['name'].split(' · ')[0]
def compact_model(s):return re.sub(r'[^A-Z0-9]','',s.upper())

# DeepCool publishes per-region EAN/P-N pairs on each individual table.
deep_sources=[]
for e in good_extra('extra-deepcool-'):
 if e.get('format')!='html' or not e.get('tables'):continue
 title=e['primaryText'].splitlines()[0].split(' - DeepCool')[0];rr=[(r[0],r[1]) for t in e['tables'] for r in t if len(r)==2];d=dict(rr)
 if 'Type' not in d:continue
 # Every EAN/P-N pair is a separate text node, avoiding concatenated table cells.
 pairs=[re.fullmatch(r'(\d{13})\s+(R-[A-Z0-9-]+-EU(?:-V\d+)?)',s.strip()) for s in e.get('textSegments',[])];pairs=[m for m in pairs if m]
 mpn=pairs[0][2] if len(pairs)==1 else d.get('P/N')
 if not mpn or 'UK' in mpn or 'US-' in mpn:continue
 deep_sources.append((e,title,rr,d,mpn,pairs[0][1] if pairs else None))
for a in items:
 c=a['component']
 if c['category']!='psu' or c['brand']!='DeepCool':continue
 name=psu_name(c);target=re.sub(r'\s+230V$','',name,flags=re.I)
 if target=='DQ-M-V2L':target='DQ'+str(c['wattage'])+'-M-V2L'
 matches=[x for x in deep_sources if compact_model(x[1])==compact_model(target)]
 # Same global source mirrored in several country hosts is one product table.
 unique={x[4]:x for x in matches}
 if len(unique)!=1:
  indexAudit.append({'id':c['id'],'brand':'DeepCool','state':'no_unique_primary_variant','candidateSources':[x[0]['url'] for x in matches],'reason':'Noir/blanc, révision et modèle exact ne donnent pas une seule référence dans l’index fabricant collecté.'});continue
 e,title,rr,d,mpn,ean=next(iter(unique.values()))
 if '-V2' in mpn and not re.search(r'V2',name,re.I) and 'V2' not in target:
  indexAudit.append({'id':c['id'],'brand':'DeepCool','state':'revision_ambiguous','candidateSources':[e['url']],'reason':'La page actuelle a un P/N suffixé V2 ; l’archive n’indique aucune révision. L’ancienne version ne reçoit pas les caractéristiques ATX3.1 du nouveau produit.'});continue
 if 'Blanc' in c['name'] and not re.search(r'\bWH\b|WHITE',title,re.I):
  indexAudit.append({'id':c['id'],'brand':'DeepCool','state':'finish_unconfirmed','candidateSources':[e['url']],'reason':'La source identifie la version noire ; la ligne d’archive indique blanc ou blanc/noir.'});continue
 if '230V' in name and not re.search(r'230V',e['primaryText'],re.I):continue
 rows=[(k,v) for k,v in rr if k not in ['EAN P/N','P/N']]+[('Référence européenne' if ean else 'Référence fabricant',mpn)]
 if ean:rows.append(('EAN Europe',ean))
 patch={};dim=re.fullmatch(r'([\d.]+)\s*[×x]\s*([\d.]+)\s*[×x]\s*([\d.]+)\s*mm\s*\(W\s*x\s*L\s*x\s*H\)',d.get('Product Dimensions',''),re.I)
 if dim:patch.update(widthMm=float(dim[1]),depthMm=float(dim[2]),heightMm=float(dim[3]))
 fan=re.match(r'(\d+)mm',d.get('Fan Size',''))
 if fan:patch.update(fanCount=1,fanSizeMm=int(fan[1]))
 if d['Type'].startswith('ATX'):patch['psuFormat']='ATX'
 # Cable blocks include both connectors-per-cable and number-of-cables.
 seg=e.get('textSegments',[]);ci=[]
 for i,s in enumerate(seg[:-1]):
  if re.fullmatch(r'X\d+',seg[i+1]) and re.search(r'Pin|SATA|PCI-E',s):ci.append((s,seg[i+1]+' câble(s)'))
 rows.extend(('Câble '+k,v) for k,v in ci)
 r=add(c['id'],e['key'],rows,patch,mpn=mpn,replace=True,notes=['Le P/N et l’EAN proviennent de la ligne Europe du fabricant quand elle est publiée. Les variantes V2 actuelles ne sont pas attribuées aux anciennes lignes sans révision. Les quantités de câble et de connecteurs par câble restent distinctes.'])
 indexAudit.append({'id':c['id'],'brand':'DeepCool','state':'exact_individual_primary_table','sourceURL':e['url'],'mpn':mpn})
 add_image(c['id'],e['key'],lambda im:compact_model(title) in compact_model(im.get('alt','')) and not any(w in im['url'].lower() for w in ['logo','award','80plus']))

# GIGABYTE exposes the exact model/revision in the heading and a key/value
# specification stream. A generic PG5 name does not choose rev1/rev2/V2.
giga=[]
labels=['Model','Type','PFC','Input Voltage','Input Current','Input Frequency','Output Capacity','Dimensions','Fan Type','80 PLUS','Efficiency','MTBF','Protections','Power Good Signal','Hold Up Time','Cable Type','Connectors']
for e in good_extra('extra-gigabyte-'):
 seg=e.get('textSegments',[]);starts=[i for i,s in enumerate(seg) if s=='Model'];rows=[]
 if not starts:continue
 seg=seg[starts[0]:];stop=next((i for i,s in enumerate(seg[1:],1) if s=='Model'),len(seg));seg=seg[:stop]
 for i,s in enumerate(seg):
  if s in labels:
   end=next((j for j in range(i+1,len(seg)) if seg[j] in labels),len(seg));val=' '.join(seg[i+1:end]);val=val.split('* The entire')[0].strip()
   if val:rows.append((s,val))
 d=dict(rows)
 if 'Model' not in d or 'Output Capacity' not in d:continue
 title=e['primaryText'].splitlines()[0].split(' Power Supply')[0]
 title=re.sub(r'\s+80\+ (?:GOLD|PLATINUM) (?:Modular|MODULAR)$','',title)
 giga.append((e,title,rows,d))
for a in items:
 c=a['component']
 if c['category']!='psu' or c['brand']!='Gigabyte':continue
 name=psu_name(c);target=name.removeprefix('GP-');w=c['wattage'];white='Blanc' in c['name']
 if target=='P-B':target='P'+str(w)+'B'
 if target=='AORUS P GM':target='AORUS P'+str(w)+'W'
 if target=='UD-GM PG5' and white:target='UD'+str(w)+'GM PG5W'
 matches=[x for x in giga if compact_model(x[1])==compact_model(target) and re.fullmatch(str(w)+r'\s*W',x[3]['Output Capacity'])]
 if not white:matches=[x for x in matches if not re.search(r'\bICE\b|PG5W|WHITE',x[1],re.I)]
 else:matches=[x for x in matches if re.search(r'\bICE\b|PG5W|WHITE',x[1],re.I)]
 unique={x[0]['url'].replace('/us/','/'):x for x in matches}
 if len(unique)!=1:
  indexAudit.append({'id':c['id'],'brand':'Gigabyte','state':'no_unique_primary_variant','candidateSources':[x[0]['url'] for x in matches],'reason':'La désignation exacte (révision et finition incluses) n’a pas de tableau unique dans l’index constructeur.'});continue
 e,title,rows,d=next(iter(unique.values()));patch={'wattage':w};f=re.search(r'(\d+)\s*mm',d.get('Fan Type',''))
 if f:patch.update(fanCount=1,fanSizeMm=int(f[1]))
 if 'ATX' in d['Type']:patch['psuFormat']='ATX'
 # The page gives 3 dimensions but does not label axes; retain literal table.
 r=model_record(c,e['key'],rows,patch,title,notes=['Révision et finition concordent avec le titre de la page constructeur. La dimension triple n’explicite pas l’ordre des axes ; aucune largeur/profondeur n’est déduite de l’usage ATX.'])
 indexAudit.append({'id':c['id'],'brand':'Gigabyte','state':'exact_individual_primary_table','sourceURL':e['url'],'manufacturerModel':title})

# Phanteks AMP GH pages publish the exact colour-specific model number. Some
# current pages contain a wrong generic "Power Output" line; omit that disputed
# field instead of certifying it from the title. Other scoped facts remain usable.
phanteks=[]
phlabels=['Model No.','UPC Code','Materials','Color','Dimensions','Power Output','PCIe Gen5 Output','PCIe GEN5 OUTPUT','80 Plus','Cooling Fan','Back Plate','MTFB','Platform','Power Supply Output Connectors','Output Protection','Net Weight','Gross Weight','Warranty','Scope of Delivery','Cables','Included Cables','Accessory Box','Support']
for e in good_extra('extra-phanteks-'):
 if '/product/amp-gh-' not in e['url'] and '/product/amd-gh-' not in e['url']:continue
 seg=e.get('textSegments',[])
 if 'Model No.' not in seg:continue
 seg=seg[seg.index('Model No.'):];rows=[]
 for i,s in enumerate(seg):
  if s not in phlabels:continue
  if s=='Support':break
  end=next((j for j in range(i+1,len(seg)) if seg[j] in phlabels),len(seg));val=' '.join(seg[i+1:end]).strip()
  if s=='Output Protection':val=val.split('Output Voltage')[0].strip()
  if s=='Warranty':val=val.split('Learn more')[0].strip()
  if val:rows.append((s,val))
 d=dict(rows);mpn=d.get('Model No.','');wmatch=re.fullmatch(r'PH-P(\d+)GH_(BK|WT)01',mpn)
 if not wmatch:continue
 phanteks.append((e,rows,d,mpn,int(wmatch[1]),wmatch[2]=='WT'))
for a in items:
 c=a['component']
 if c['category']!='psu' or c['brand']!='Phanteks' or psu_name(c)!='AMP GH':continue
 matches=[x for x in phanteks if x[4]==c['wattage'] and x[5]==('Blanc' in c['name'])]
 if len(matches)!=1:continue
 e,rows,d,mpn,w,white=matches[0];conflict=not re.fullmatch(str(w)+r'\s*(?:W|Watt)',d.get('Power Output',''))
 clean=[(k,v) for k,v in rows if k not in ['Power Output','UPC Code','Scope of Delivery','Accessory Box']];patch={}
 dims=re.search(r'Length x Width x Height\s+([\d.]+) x ([\d.]+) x ([\d.]+) mm',d.get('Dimensions',''))
 if dims:patch.update(depthMm=float(dims[1]),widthMm=float(dims[2]),heightMm=float(dims[3]))
 f=re.match(r'(\d+)\s*mm',d.get('Cooling Fan',''))
 if f:patch.update(fanCount=1,fanSizeMm=int(f[1]))
 if 'ATX' in d.get('Platform',''):patch['psuFormat']='ATX'
 if not conflict:clean.append(('Puissance continue',str(w)+' W'));patch['wattage']=w
 # These rows are the individual DC-output table; they are kept verbatim. The
 # separate disputed marketing power is deliberately omitted from the patch.
 for table in e.get('tables',[]):
  if table and table[0][0]=='Output Voltage':
   cols=table[0][1:];current=next((r[1:] for r in table if r[0]=='Maximum Output'),[])
   if len(cols)==len(current):clean.extend(('Rail '+k+' — courant maximal',v) for k,v in zip(cols,current))
   cap=next((r[1:] for r in table if r[0]=='Maximum Capacity'),[])
   if len(cap)==4:clean.extend(zip(['Puissance +12 V','Puissance combinée +5 / +3,3 V','Puissance −12 V','Puissance +5 VSB'],cap))
   clean.extend((r[0],r[1]) for r in table if len(r)==2 and r[0]=='AC Input')
 notes=['Le tableau fabricant identifie la finition '+('blanche' if white else 'noire')+' avec le code '+mpn+'.']
 if conflict:notes.append('La ligne Power Output du site indique '+d.get('Power Output','non renseigné')+' alors que le modèle et son tableau DC Output indiquent '+str(w)+' W. Cette ligne contradictoire n’est pas utilisée comme preuve de puissance nominale.')
 add(c['id'],e['key'],clean,patch,mpn=mpn,replace=True,notes=notes)
 indexAudit.append({'id':c['id'],'brand':'Phanteks','state':'primary_power_line_conflict_other_facts_retained' if conflict else 'exact_individual_primary_table','sourceURL':e['url'],'mpn':mpn,'omittedFields':['Power Output'] if conflict else []})

# NZXT current pages explicitly list both colour/region MPN sets. Restrict the
# archive match to the 2024 ATX3.1 generation (and unique C1500 Platinum).
for e in good_extra('extra-nzxt-'):
 if '/products/' not in e['url'] or 'Tech Specs' not in e['primaryText']:continue
 if not re.search(r'/c(?:850|1000|1200)-gold-atx$|/c1500-platinum$',e['url']):continue
 text=e['primaryText'].split('Tech Specs',1)[1].split('Frequently Asked Questions',1)[0];lines=[s.strip() for s in text.splitlines() if s.strip()];section='';rows=[];i=0
 sections={'Dimensions','General','Cable Length & Connector Quantity','AC Input Rating','DC Output Rating','Energy Efficiency','Fan Specs','Operation','Electrical Features','Product Info'}
 while i<len(lines):
  key=lines[i];i+=1
  if key in sections:section=key;continue
  if i>=len(lines):break
  val=lines[i];i+=1;rows.append((section+' — '+key,val))
 d=dict(rows);wstr=d.get('General — Wattage','');wm=re.fullmatch(r'(\d+) W',wstr)
 if not wm:continue
 w=int(wm[1]);modelnumbers=d.get('Product Info — Model Number','')
 for a in items:
  c=a['component'];name=psu_name(c)
  if c['category']!='psu' or c['brand']!='NZXT' or c['wattage']!=w:continue
  if name not in (['C1500'] if w==1500 else ['C'+str(w)+' (2024)']):continue
  white='Blanc' in c['name'];codes=re.findall(r'PA-[A-Z0-9]+-EU',modelnumbers)
  codes=[x for x in codes if ('BW-' in x)==white] if w!=1500 else codes
  if len(codes)!=1:continue
  mpn=codes[0];clean=[r for r in rows if not any(s in r[0] for s in ['Model Number','UPC','EAN'])];clean.append(('Référence européenne '+('blanche' if white else 'noire'),mpn))
  patch={'wattage':w,'psuFormat':'ATX'}
  for f,l in [('widthMm','Width'),('heightMm','Height'),('depthMm','Depth')]:
   m=re.fullmatch(r'([\d.]+) mm',d.get('Dimensions — '+l,''))
   if m:patch[f]=float(m[1])
  m=re.fullmatch(r'(\d+) mm',d.get('Fan Specs — Size',''))
  if m:patch.update(fanSizeMm=int(m[1]),fanCount=1)
  add(c['id'],e['key'],clean,patch,mpn=mpn,replace=True,notes=['Le tableau distingue les références régionales Europe et les finitions noire/blanche. La génération Gold2024 ATX3.1 reste séparée des séries Gold2019, Gold2022 et Bronze. Les niveaux acoustiques publiés concernent le ventilateur, pas une mesure du système complet.'])
  indexAudit.append({'id':c['id'],'brand':'NZXT','state':'exact_regional_and_colour_table','sourceURL':e['url'],'mpn':mpn})

# Older NZXT manuals: the individual electrical column is readable and indexed
# by its published model number. Regional suffixes are not manufactured.
for key,generation,watts in [('extra-pdf-26a460deb578','Gold 2022',[650,750,850,1000]),('extra-pdf-871ba72bd9b7','Bronze 2021',[550,650,750])]:
 e=source(key);t=e['primaryText'];spec=t[t.index('2. SPECIFICATIONS'):] if '2. SPECIFICATIONS' in t else t[t.index('Compliance Standard'):];spec=spec.split('3. INSTALLATION',1)[0]
 model_line=next(l for l in spec.splitlines() if 'MODEL NO.' in l);models=re.findall(r'PA-[A-Z0-9]+',model_line)
 current_line=next(l for l in spec.splitlines() if 'MAX LOAD' in l);amps=re.findall(r'\d+(?:\.\d+)?A',current_line)
 combined_line=next(l for l in spec.splitlines() if len(re.findall(r'\d+(?:\.\d+)?W',l))==len(watts)*4);powers=re.findall(r'\d+(?:\.\d+)?W',combined_line)
 assert len(models)==len(watts) and len(amps)==len(watts)*5
 for a in items:
  c=a['component']
  if c['category']!='psu' or c['brand']!='NZXT' or c['wattage'] not in watts:continue
  w=c['wattage'];name=psu_name(c)
  if (generation=='Gold 2022' and name!='C'+str(w)+' (2022)') or (generation=='Bronze 2021' and (name!='C'+str(w) or 'Semi-modulaire' not in c['name'])):continue
  n=watts.index(w);rows=[('Modèle réglementaire publié',models[n]),('Génération du manuel',generation),('Puissance continue',str(w)+' W'),('Compliance Standard','ATX12V v2.52 / EPS12V v2.92')]
  rows.extend(('Rail '+v+' — courant maximal',amps[n*5+i]) for i,v in enumerate(['+3.3V','+5V','+5VSB','+12V','-12V']))
  rows.extend((v,powers[n*4+i]) for i,v in enumerate(['Puissance combinée +3,3 / +5 V','Puissance +5 VSB','Puissance +12 V','Puissance −12 V']))
  model='NZXT C'+str(w)+' '+generation
  model_record(c,key,rows,{'wattage':w,'psuFormat':'ATX'},model,notes=['Seule la colonne électrique du modèle '+models[n]+' est extraite du manuel. Aucun suffixe de référence commerciale régional, câble ou encombrement n’est déduit des autres puissances.'])
  indexAudit.append({'id':c['id'],'brand':'NZXT','state':'watt_specific_official_manual','sourceURL':e['url'],'manufacturerModel':model,'regulatoryModel':models[n]})

# ASUS product-model identity is independently read back from each requested
# specification endpoint. Marketing aliases never become commercial MPNs.
asusmap=json.loads((D/'asus-model-candidates.json').read_text())
asuslabels=['Model','PFC Type','80 PLUS Efficiency','Protection Features','Hazardous Materials','AC Input Range','DC Output Voltage','Maximum Load','Combined Load','Total Output','Cable Connectors','Package Contents','Dimensions','Weight','Cybenetics Noise Level Certification','AURA SYNC','MTBF','0dB Fan Button','ATX Standard','ATX Version','PCIe Version','PCIe Standard']
for hit in asusmap:
 p=S/(hit['sourceKey']+'.json')
 if not p.exists():continue
 e=json.loads(p.read_text());c=byid[hit['id']]['component'];seg=e.get('textSegments',[])
 if e.get('statusCode')!=200 or 'Model' not in seg:
  indexAudit.append({'id':c['id'],'brand':'ASUS','state':'manufacturer_endpoint_unavailable','sourceURL':e['url'],'error':e.get('error','No product Model field in returned page')});continue
 start=seg.index('Model');actual=seg[start+1]
 expected=hit['expectedManufacturerModel'];w=c['wattage'];aliases={expected}
 if expected.startswith('TUF-GAMING-'):
  suffix='Bronze' if re.search(r'\d+B(?:-|$)',expected) else 'Gold';aliases.add('TUF Gaming '+str(w)+'W '+suffix+(' White Edition' if expected.endswith('-WHITE') else ''))
 if expected.startswith('ROG-STRIX-') and 'GUNDAM' not in expected:
  suffix='Platinum' if re.search(r'\d+P-',expected) else 'Gold';aliases.add('ROG Strix '+str(w)+'W '+suffix+(' Aura Edition' if 'AURA' in expected else '')+(' White Edition' if expected.endswith('-WHITE') else ''))
 if expected.startswith('ROG-THOR-') and not any(x in expected for x in ['EVA','HATSUNE']):
  suffix='Titanium' if re.search(r'\d+T',expected) else 'Platinum';revision=' III' if re.search(r'[PT]3-',expected) else ' II' if 'P2-' in expected else '';aliases.add('ROG Thor '+str(w)+'W '+suffix+revision+(' White Edition' if expected.endswith('-WHITE') else ''))
 if compact_model(actual) not in {compact_model(v) for v in aliases}:
  indexAudit.append({'id':c['id'],'brand':'ASUS','state':'returned_model_mismatch','sourceURL':e['url'],'expected':hit['expectedManufacturerModel'],'returned':actual});continue
 seg=seg[start:];rows=[]
 for i,s in enumerate(seg):
  if s not in asuslabels:continue
  end=next((j for j in range(i+1,len(seg)) if seg[j] in asuslabels or seg[j].startswith(('ASUS Store price','ASUS estore price','Products certified','Disclaimer'))),len(seg));v=' '.join(seg[i+1:end]).strip()
  if v:rows.append((s,v))
 d=dict(rows);w=c['wattage'];out=d.get('Total Output','');patch={}
 if re.search(r'(?<!\d)'+str(w)+r'\s*W\b',out):patch['wattage']=w
 else:
  indexAudit.append({'id':c['id'],'brand':'ASUS','state':'power_value_mismatch','sourceURL':e['url'],'publishedTotalOutput':out});continue
 # The dimensions string does not label L/W/H; keep it literally as published.
 rows=[(k,v) for k,v in rows if k!='Model']+[('Modèle constructeur',actual)]
 model_record(c,e['key'],rows,patch,actual,notes=['Le champ Model de la page constructeur concorde exactement avec la famille, la puissance et la finition demandées. Les MPN commerciaux ASUS90YE et la disponibilité régionale ne sont pas déduits de ce nom. Les dimensions sans ordre des axes restent une valeur littérale.'])
 indexAudit.append({'id':c['id'],'brand':'ASUS','state':'exact_returned_manufacturer_model','sourceURL':e['url'],'manufacturerModel':actual})

# Historical Phanteks manufacturer tables prove the unique commercial code
# for these pre-GH lines. The two 1000W AMP revisions remain unresolved because
# the table lists both without explicitly naming which is marketed as "v2".
for a in items:
 c=a['component']
 if c['category']!='psu' or c['brand']!='Phanteks' or c['id'] in records:continue
 name=psu_name(c);w=c['wattage'];mpn=None;key=None
 if name=='AMP' and w in [550,650,750,850] and 'Blanc' not in c['name']:
  key='phanteks-legacy-amp-exa';mpn='PH-P'+str(w)+'G_BK';rows=[('80 PLUS certification','Gold'),('Modularity','Fully modular')]
 elif name=='Revolt X' and w in [1000,1200]:
  key='phanteks-legacy-revolt-x-exa';mpn='PH-P'+str(w)+'PS';rows=[('80 PLUS certification','Platinum'),('Modularity','Fully modular'),('Usage documenté','Deux systèmes alimentés individuellement avec la technologie Phanteks')]
 elif name=='Revolt Pro' and w in [850,1000]:
  key='phanteks-legacy-revolt-pro-exa';mpn='PH-P'+str(w)+'GC';rows=[('80 PLUS certification','Gold'),('Modularity','Fully modular'),('Usage documenté','Connexion d’une seconde alimentation pour puissance additionnelle ou redondance')]
 if not mpn:continue
 e=source(key);assert mpn in e['primaryText'];rows.append(('Référence fabricant',mpn));add(c['id'],key,rows,mpn=mpn,replace=True,notes=['Page historique du fabricant extraite via Exa après échec de l’accès HTTP natif. Le tableau identifie cette puissance ; les caractéristiques mécaniques absentes du texte ne sont pas inventées.'])
 indexAudit.append({'id':c['id'],'brand':'Phanteks','state':'exact_historical_manufacturer_code_partial_specs','sourceURL':e['url'],'mpn':mpn})

# Two manufacturer specification graphics were visually read, including the
# model codes at the bottom of each column. Their W/D axes look inconsistent
# with the ATX envelope, so width/depth remain unprojected. Packaging weights
# and the misprinted 36W -12V cell on the Pro1000 are not imported.
for a in items:
 c=a['component'];name=psu_name(c);w=c.get('wattage')
 if c['category']!='psu' or c['brand']!='Phanteks' or name not in ['Revolt X','Revolt Pro']:continue
 x=name=='Revolt X';key='phanteks-revolt-'+('x' if x else 'pro')+'-inspected-specs';mpn='PH-P'+str(w)+('PS' if x else 'GC')
 if (x and w not in [1000,1200]) or (not x and w not in [850,1000]):continue
 rows=[('Puissance continue',str(w)+' W'),('80 PLUS certification','Platinum' if x else 'Gold'),('Dimensions (W × D × H), libellé fabricant','170 × 150 × 86 mm'),('Form Factor','Intel ATX12V'),('Fan Size','135 mm'),('Fan Bearing','Fluid Dynamic Bearing'),('Mode hybride','Oui'),('Durée de vie du ventilateur','50 000 h à 40 °C, humidité relative15–65%'),('Modularity','Fully Modular'),('Warranty','12 Years'),('Operating Temperature','0–50 °C'),('MTBF','>100 000 h à25 °C, ventilateur exclu'),('Protections','OPP, OVP, SCP, OCP, OTP, protection sans charge, protection de réinitialisation')]
 cables=[('ATX 24-pin','2 connecteurs' if x else '1 connecteur'),('CPU 8/4+4-pin','3 câbles, 4 connecteurs' if x else '2 connecteurs'),('PCI-E 6+2-pin','4 câbles, 8 connecteurs'),('SATA','4 câbles, 16 connecteurs' if x else '4 câbles, 14 connecteurs'),('Molex','1 câble, 3 connecteurs')];rows.extend(('Câble '+k,v) for k,v in cables)
 amps={('Revolt X',1200):['100A','25A','25A','0.3A','3A'],('Revolt X',1000):['83A','25A','25A','0.3A','3A'],('Revolt Pro',1000):['83A','20A','20A','0.3A','3A'],('Revolt Pro',850):['70A','20A','20A','0.3A','3A']}[(name,w)]
 rows.extend(('Rail '+k+' — courant maximal',v) for k,v in zip(['+12V','+5V','+3.3V','-12V','+5VSB'],amps));rows.append(('Puissance +12 V',str({1200:1200,1000:996,850:840}[w])+' W'));rows.append(('Puissance combinée +3,3 / +5 V','125 W' if x else '100 W'))
 add(c['id'],key,rows,{'wattage':w,'psuFormat':'ATX','heightMm':86,'fanCount':1,'fanSizeMm':135},mpn=mpn,notes=['Tableau fabricant graphique inspecté visuellement. Les dimensions sont affichées littéralement : l’ordre W/D publié semble inversé par rapport au format ATX et ne sert pas à calculer largeur/profondeur. Les quatre puissances/variantes utilisent leur propre colonne.'])
