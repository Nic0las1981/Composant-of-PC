"""Additional manufacturer indexes; executed by build-deep-power-chassis.py.

Every accepted match includes the exact family, wattage, colour and revision.
Regional identifiers and wildcard model codes never become invented EU MPNs.
"""
indexAudit=[]

def write_index_source(key,entry,rows):
 meta=entry['source'];e={'key':key,**meta,'primaryText':entry['name'],'tables':[[[k,v] for k,v in rows]],'images':[{'url':u,'alt':entry['name'],'inspection':'url_only'} for u in entry.get('images',[])],'catalogRecord':entry}
 (S/(key+'.json')).write_text(json.dumps(e,ensure_ascii=False,indent=2));return e

def model_record(c,key,rows,patch,model,notes=None):
 old=byid[c['id']]['verified'];mpn=old['mpn'] if old else model
 r=add(c['id'],key,rows,patch,mpn=mpn,replace=True,notes=notes or [])
 if not old:modelIdentities[c['id']]=model
 return r

# Corsair's own variant object, never the parent page's neighbouring SKU.
crs=json.loads((D/'corsair-psu-catalog.json').read_text())['records']+json.loads((D/'corsair-psu-legacy-catalog.json').read_text())['records'];crs={r['mpn']:r for r in crs if re.fullmatch(r'CP-\d+-(EU|WW)',r['mpn'])}
cor_exact={
 'SF850':'CP-9020256-EU','SF1000':'CP-9020257-EU','CV550':'CP-9020210-EU','CV650':'CP-9020236-EU',
 'RM650 (2023)':'CP-9020280-EU','HX1000i (2023)':'CP-9020259-EU','HX1500i (2023)':'CP-9020261-EU',
 'HX1200i (2025)':'CP-9020307-EU','HX1500i (2025)':'CP-9020309-EU','RM650e (2025)':'CP-9020302-EU',
 'CX (2023) 550':'CP-9020277-EU','CX (2023) 650':'CP-9020278-EU','CX (2023) 750':'CP-9020279-EU',
 'SF600 (2018)':'CP-9020182-EU','CV450':'CP-9020209-EU','CV750':'CP-9020237-WW',
 'RM650 (2019)':'CP-9020194-EU','CX650M (2021)':'CP-9020221-EU',
 'RM650x (2021)':'CP-9020198-EU','RM750x (2021)':'CP-9020199-EU','RM1000x (2021)':'CP-9020201-EU',
}
for a in items:
 c=a['component']
 if c['category']!='psu' or c['brand']!='Corsair':continue
 base=c['name'].split(' · ')[0];w=c.get('wattage');old=a['verified'];mpn=old['mpn'] if old else cor_exact.get(base+(' '+str(w) if base=='CX (2023)' else ''))
 if not mpn and 'SHIFT' in base:
  # Original SHIFT is explicitly 80 PLUS Gold. The later 2025 family has
  # distinct identifiers and certification; white original models are unique.
  nums={750:'0251',850:'0252',1000:'0253',1200:'0254'}
  if re.fullmatch(r'RM\d+x SHIFT',base) and w in nums and '80 PLUS Gold' in c['name']:
   num=str(int(nums[w])+22).zfill(4) if 'Blanc' in c['name'] else nums[w];mpn='CP-902'+num+'-EU'
 if mpn not in crs:continue
 e=crs[mpn];rr=[(r['label'],r['value']) for r in e['rows']];d=dict(rr)
 if int(re.search(r'\d+',d['Continuous Power W'])[0])!=w:
  indexAudit.append({'id':c['id'],'state':'manufacturer_table_conflict','mpn':mpn,'sourceURL':e['source']['url'],'reason':'SKU/title '+str(w)+' W but own technical table '+d['Continuous Power W']});continue
 key='corsair-psu-'+mpn.lower();write_index_source(key,e,rr);patch={'wattage':w,'fanCount':1}
 if d.get('Fan Size MM'):patch['fanSizeMm']=int(re.search(r'\d+',d['Fan Size MM'])[0])
 fmt=d.get('PSU Form Factor','');
 if fmt in ['ATX','SFX','SFX-L']:patch['psuFormat']=fmt
 dims=[float(x) for x in re.findall(r'[\d.]+',d.get('Dimensions',''))]
 if len(dims)==3 and dims[1:]==[150,86]:patch.update(depthMm=dims[0],widthMm=dims[1],heightMm=dims[2])
 if mpn=='CP-9020186-EU' and dims==[100,63,125]:patch.update(depthMm=100,widthMm=125,heightMm=63)
 add(c['id'],key,rr,patch,mpn=mpn,replace=True,notes=['Les caractéristiques viennent de l’objet technique propre au SKU '+mpn+' dans le catalogue public Corsair France. Les versions 2018/2021/2023/2024/2025 et ThermalProtect restent distinctes.'])
 if e.get('images'):photos.append({'id':c['id'],'mpn':mpn,'sourceURL':e['source']['url'],'checkedAt':e['source']['checkedAt'],'url':e['images'][0],'alt':e['name'],'inspection':'url_only'})

# be quiet! publishes article numbers per regional electrical variant. Exact
# previous MPN/EU suffix wins; otherwise only facts identical in every published
# same-model variant are accepted under manufacturer-model identity.
bq=[]
for f in S.glob('bequiet-psu-*.json'):
 e=json.loads(f.read_text())
 if e.get('statusCode')!=200:continue
 rows=[r for t in e.get('tables',[]) for r in rows_from_table(t)];d=dict(rows)
 if d.get('Article number') and d.get('Model'):bq.append((f.stem,d,rows))
for a in items:
 c=a['component']
 if c['category']!='psu' or c['brand']!='be quiet!':continue
 base=c['name'].split(' · ')[0];w=c['wattage'];n=norm(re.sub(r'\b\d{3,4}\s*W?\b','',base,flags=re.I));matches=[]
 for key,d,rows in bq:
  other=norm(re.sub(r'\b\d{3,4}\s*W?\b','',d['Model'],flags=re.I))
  if n==other and d.get('Continuous power (W)')==str(w):matches.append((key,d,rows))
 if not matches:
  indexAudit.append({'id':c['id'],'brand':'be quiet!','state':'not_found_in_collected_current_and_legacy_models','reason':'Aucun modèle portant ce nom exact et cette puissance dans les tableaux actuels et anciens collectés.'});continue
 old=a['verified'];exact=[x for x in matches if old and x[1]['Article number']==old['mpn']]
 if not exact:exact=[x for x in matches if x[1]['Article number'].endswith('EU')]
 if len(exact)==1:
  key,d,rows=exact[0];mpn=d['Article number'];modelOnly=False;otherSources=[]
 else:
  key,d,rows=matches[0];d={k:v for k,v in d.items() if all(z[1].get(k)==v for z in matches)}
  rows=[(k,v) for k,v in rows if k in d and k not in ['Article number','EAN','EAN code','EAN / UPC']];mpn=base+' '+str(w)+' W';modelOnly=True;otherSources=[x[0] for x in matches[1:]]
 rows=[(k,v) for k,v in rows if not any(t in k.lower() for t in ['package','shipping','rrp','pieces per'])];patch={'wattage':w}
 dim=d.get('Dimensions without cable (L x W x H), (mm)');dims=[float(x) for x in re.findall(r'[\d.]+',dim or '')]
 if len(dims)==3:patch.update(depthMm=dims[0],widthMm=dims[1],heightMm=dims[2])
 fan=d.get('Fan size (mm)','')
 if re.fullmatch(r'\d+',fan):patch.update(fanCount=1,fanSizeMm=int(fan))
 if 'SFX L' in base.upper():patch['psuFormat']='SFX-L'
 elif 'SFX' in base.upper():patch['psuFormat']='SFX'
 elif 'TFX' in base.upper():patch['psuFormat']='TFX'
 else:patch['psuFormat']='ATX'
 notes=['Les champs proviennent du tableau individuel du modèle '+matches[0][1]['Model']+'. Les tirets ne sont pas convertis en valeurs estimées.']
 if modelOnly:notes.append('Le code régional commercial reste inconnu. Seuls les champs identiques dans les '+str(len(matches))+' variantes constructeur consultées sont retenus ; les connecteurs ou normes qui diffèrent selon révision sont omis.')
 add(c['id'],key,rows,patch,mpn=mpn,replace=True,notes=notes)
 if modelOnly:modelIdentities[c['id']]=base+(' '+str(w)+' W' if str(w) not in base else '')
 for sk in otherSources:
  e=source(sk);records[c['id']]['sources'].append({'name':'be quiet! — contrôle croisé des variantes régionales','url':e['url'],'checkedAt':e['checkedAt'],'kind':'manufacturer'})
 indexAudit.append({'id':c['id'],'brand':'be quiet!','state':'common_facts_across_regional_variants' if modelOnly else 'exact_manufacturer_article','sourceURLs':[source(x[0])['url'] for x in matches],'candidateArticles':[x[1]['Article number'] for x in matches],'differingFields':sorted({k for _,dd,_ in matches for k in dd if k not in d}) if modelOnly else []})

# Cooler Master: title + exact power + input variant + case colour + modularity.
# The public global table often gives an incomplete region/wildcard model code.
# It is retained as a detail, while the commercial MPN remains empty.
def cm_family(s,w):
 s=s.split('|')[0].upper().replace('COOLER MASTER','').replace('COOLERMASTER','')
 s=re.sub(r'\b(?:POWER SUPPLY|ATX PSU|CERTIFIED|80 PLUS)\b.*','',s)
 s=s.replace('FULLY MODULAR','').replace('FULL-MODULAR','').replace('FULL MODULAR','').replace('NON-MODULAR','').replace('WHITE EDITION','').replace('BLACK MESH CABLE','BLACK MESH')
 s=re.sub(r'\bVER\.?\s*','V',s)
 s=s.replace('ATX3','ATX 3').replace('230V','INPUT230V')
 s=re.sub(r'\bXG\s*(\d+)\s*(PLUS)?\s*$',lambda m:'XG'+m[1]+' '+(m[2] or '')+' PLATINUM',s.strip())
 s=re.sub(r'\bV\s*(\d+)\s+V2\b',r'V\1 GOLD V2',s)
 tokens=re.findall(r'[A-Z]+|\d+(?:\.\d+)?',s)
 return tuple(sorted(t for t in tokens if t not in [str(w),'W','EDITION','FULL','RANGE','PSU']))
cm=[]
for f in [*S.glob('cm-psu-*.json'),*S.glob('cm-legacy-*.json')]:
 e=json.loads(f.read_text())
 if e.get('statusCode')!=200 or not e.get('primaryText'):continue
 rr=e.get('definitionPairs',[]);d={r['label']:r['value'] for r in rr};name=e['primaryText'].splitlines()[0].split('|')[0].strip()
 if not d.get('Model') or not (d.get('Input Voltage') or d.get('Operation Voltage')) or not d.get('Dimensions (L x W x H)'):continue
 watts=re.findall(r'(?<!\d)(\d{3,4})(?!\d)',re.sub(r'\b(?:230|240)\s*V\b','',d.get('Watts',name),flags=re.I))
 if len(set(watts))!=1:continue
 w=int(watts[0]);cm.append({'key':f.stem,'rows':rr,'data':d,'name':name,'watts':w,'white':'white-edition' in e['url'],'family':cm_family(name,w),'regionalSKUs':e.get('regionalSKUs','')})
for a in items:
 c=a['component']
 if c['category']!='psu' or c['brand']!='Cooler Master':continue
 base=c['name'].split(' · ')[0];w=c['wattage'];fam=cm_family(base,w);white='Blanc' in c.get('finishName','');matches=[]
 for m in cm:
  if m['watts']!=w or m['family']!=fam or m['white']!=white:continue
  modular=m['data'].get('Modular','')
  if modular and (('Entièrement modulaire' in c['name'] and modular!='Fully Modular') or ('Câbles fixes' in c['name'] and modular not in ['Non Modular','Non-modular'])):continue
  matches.append(m)
 indexAudit.append({'id':c['id'],'brand':c['brand'],'candidateSources':[source(m['key'])['url'] for m in matches],'state':'one_exact_model_table' if len(matches)==1 else 'ambiguous_revision_or_unmatched','criteria':'family tokens, power, white edition, modularity and explicitly stated ATX/input version'})
 # The same product is mirrored on www and legacy with an identical own
 # table. Duplicate mirrors are one source, while conflicting revisions stay
 # distinct and cannot be resolved by arbitrarily picking the first URL.
 unique={}
 for match in matches:
  signature=tuple(sorted((r['label'],r['value']) for r in match['rows']))
  if signature not in unique or match['regionalSKUs']:unique[signature]=match
 matches=list(unique.values())
 if len(matches)>1:
  old=a['verified'];exact=[x for x in matches if old and old['mpn'] in x['regionalSKUs'].splitlines()]
  if len(exact)==1:matches=exact
  else:
   common=[r for r in matches[0]['rows'] if r['label']!='Model' and all(r in x['rows'] for x in matches[1:])]
   if len(common)<5:continue
   first=copy.deepcopy(matches[0]);first['rows']=common;first['data']={r['label']:r['value'] for r in common};first['regionalSKUs']='';first['commonVariants']=matches;matches=[first]
 if len(matches)!=1:continue
 m=matches[0];d=m['data'];rr=[(r['label'],r['value']) for r in m['rows'] if r['label'] not in ['Category','Series']];dims=[float(x) for x in re.findall(r'[\d.]+',d.get('Dimensions (L x W x H)','').split('/')[0])];patch={'wattage':w}
 if len(dims)==3:patch.update(depthMm=dims[0],widthMm=dims[1],heightMm=dims[2])
 if d.get('Fan Size') and re.search(r'\d+',d['Fan Size']):patch.update(fanCount=1,fanSizeMm=int(re.search(r'\d+',d['Fan Size'])[0]))
 elif 'Fanless' in d.get('Fan Size',''):patch['fanCount']=0
 if d.get('Form Factor') in ['ATX','SFX','SFX-L']:patch['psuFormat']=d['Form Factor']
 eu=[x.strip() for x in m['regionalSKUs'].splitlines() if re.fullmatch(r'[A-Z0-9-]+-EU',x.strip())]
 if len(eu)==1:
  rr.append(('Référence commerciale Europe publiée',eu[0]));add(c['id'],m['key'],rr,patch,mpn=eu[0],replace=True,notes=['Le code Europe provient du champ SKU du produit exact dans le catalogue public fabricant. La puissance, la génération, la modularité et la finition doivent aussi concorder.']);modelIdentities.pop(c['id'],None)
 else:model_record(c,m['key'],rr,patch,m['name'],['La référence de modèle publiée par Cooler Master peut omettre le suffixe de région ou comporter des astérisques. Elle est affichée littéralement dans le tableau ; aucun suffixe commercial EU ni prix n’est inventé.'])
 if m.get('commonVariants'):
  r=records[c['id']];r['notes'].append('Plusieurs variantes constructeur portent ce nom, cette puissance et cette finition. Seuls leurs champs strictement identiques sont ajoutés ; les champs propres à une révision restent inconnus.')
  for v in m['commonVariants'][1:]:
   e=source(v['key']);src={'name':'Cooler Master — comparaison des variantes','url':e['url'],'checkedAt':e['checkedAt'],'kind':'manufacturer'}
   if src not in r['sources']:r['sources'].append(src)
  indexAudit.append({'id':c['id'],'brand':'Cooler Master','state':'common_facts_across_published_same_name_variants','sourceURLs':[source(v['key'])['url'] for v in m['commonVariants']],'candidateModelPatterns':[v['data'].get('Model') for v in m['commonVariants']],'commonFieldCount':len(rr)})

# Thermaltake's Global product specification blocks are separated from marketing
# and regional pages. Explicit PSU revision suffixes remain separate.
tt_labels={'P/N','Model','Type','Form Factor','RGB Fan','Watts','Max Output Capacity','Peak Output Capacity','Color','Dimensions','Weight','PFC (Power Factor Correction)','Power Good Signal','Hold Up Time','Input Current','Input Frequency Range','Input Voltage','Operating Temperture','Operating Humidity','Storage Temperture','Storage Humidity','Cooling System','Efficiency','MTBF','Safety Approval','PCI-E 6+2PIN','Protection','Connector','Operating Temperature','Storage Temperature'}
def tt_rows(e):
 for t in e.get('tables',[]):
  if any(r and r[0]=='P/N' for r in t):return rows_from_table(t)
 seg=e.get('textSegments',[])
 if 'Product Specifications' not in seg:return []
 seg=seg[seg.index('Product Specifications')+1:];seg=seg[:seg.index('User Manual')] if 'User Manual' in seg else seg
 rows=[];label=None;values=[]
 for x in seg:
  if x in tt_labels:
   if label and values:rows.append((label,' | '.join(values)))
   label=x;values=[]
  else:values.append(x)
 if label and values:rows.append((label,' | '.join(values)))
 return rows

def tt_key(c):
 base=c['name'].split(' · ')[0];w=c['wattage'];n=norm(base);g='tt-global-';suffix=''
 if n=='TOUGHPOWERGF12024':
  found=[p.stem for p in S.glob('tt-psu-toughpower-gf1-2024-version-'+str(w)+'w-*.json')];return found[0] if len(found)==1 else None
 if n in ['TOUGHPOWERGF1PE','TOUGHPOWERGF1TTPREMIUM']:suffix=f'toughpower-gf1-{w}w-tt-premium-edition'
 elif n=='TOUGHPOWERGF1SNOWTTPREMIUM':suffix=f'toughpower-gf1-{w}w-snow-tt-premium-edition'
 elif n=='TOUGHPOWERGF3TTPREMIUM':suffix=f'toughpower-gf3-{w}w-gold-tt-premium-edition'
 elif n=='TOUGHPOWERSFX' and w>=750:suffix=f'toughpower-sfx-{w}w-gold-tt-premium-edition'
 elif n=='TOUGHPOWERPF3':suffix=f'toughpower-pf3-{w}w-platinum-tt-premium-edition'
 elif n=='TOUGHPOWERPF3L':
  found=[p.stem for p in S.glob('tt-psu-toughpower-pf3-'+str(w)+'w-*.json')];return found[0] if len(found)==1 else None
 elif n=='TOUGHPOWERPF1TTPREMIUMEDITION':suffix=f'toughpower-pf1-{w}w-'+('platinum-' if w>=1050 else '')+'tt-premium-edition'
 elif n=='TOUGHPOWERTF1TTPREMIUM':suffix=f'toughpower-tf1-{w}w-tt-premium-edition'
 elif n=='SMARTBM2':suffix=f'smart-bm2-{w}w-tt-premium-edition'
 elif n=='SMARTBM3':suffix=f'smart-bm3-bronze-{w}w-tt-premium-edition'
 elif n=='TOUGHPOWERGX2':suffix=f'toughpower-gx2-{w}w'+('-thermaltake' if w==700 else '')
 elif re.fullmatch(r'TOUGHPOWERGX1(?:\d+)?',n):suffix=f'thermaltake-toughpower-gx1-{w}w-gold'
 elif n=='SMARTSE':suffix=f'smart-se-{w}w'+('-gold' if '80 PLUS Gold' in c['name'] else '')
 elif n=='SMARTDPSG':suffix=f'smart-dps-g-{w}w-'+('gold' if '80 PLUS Gold' in c['name'] else 'bronze')
 elif n=='TOUGHPOWERDPSG' and '80 PLUS Platinum' in c['name']:suffix=f'toughpower-dps-g-{w}w-platinum'
 elif n=='TOUGHPOWER' and '80 PLUS Gold' in c['name']:suffix=f'toughpower-{w}w-gold'+('-modular' if w<=750 else '')
 elif n=='TOUGHPOWERGRAND' and '80 PLUS Gold' in c['name'] and w in [650,750,850]:suffix=f'toughpower-grand-{w}w-fully-modular'
 elif n=='TOUGHPOWERGRAND' and '80 PLUS Platinum' in c['name'] and w==750:suffix='toughpower-grand-750w-platinum-fully-modular'
 return g+suffix if suffix else None
for a in items:
 c=a['component']
 if c['category']!='psu' or c['brand']!='Thermaltake':continue
 key=tt_key(c)
 if not key or not (S/(key+'.json')).exists():
  indexAudit.append({'id':c['id'],'brand':c['brand'],'state':'revision_or_regional_variant_unresolved','candidateSource':key,'reason':'Public Global/USA indexes searched; generic Smart/TR2/Litepower names and GF A3 regional revisions are not silently matched.'});continue
 e=source(key);rr=tt_rows(e);d=dict(rr);model=e['primaryText'].splitlines()[0];watts=d.get('Max Output Capacity',d.get('Watts',''))
 if not re.match(str(c['wattage'])+r'\s*W',watts,re.I) or not d.get('P/N'):continue
 # A supplied old MPN must belong to the documented regional wildcard, not an
 # unrelated US revision. Standard regional wildcards x / ** are not MPNs.
 old=a['verified'];part=d['P/N'];p={'wattage':c['wattage']}
 dims=d.get('Dimensions','')
 for axis,field in [('W','widthMm'),('H','heightMm'),('D','depthMm')]:
  m=re.search(r'([\d.]+)\s*mm\s*\('+axis+r'\)',dims,re.I)
  if m:p[field]=float(m[1])
 fan=re.search(r'([\d.]+)\s*(mm|cm)',d.get('Cooling System',''),re.I)
 if fan:p.update(fanCount=1,fanSizeMm=float(fan[1])*(10 if fan[2].lower()=='cm' else 1))
 if d.get('Form Factor') in ['ATX','SFX','SFX-L']:p['psuFormat']=d['Form Factor']
 rr=[(k,v) for k,v in rr if not (k in ['Operating Temperture','Storage Temperture'] and re.match(r'^℃',v))]
 r=model_record(c,key,rr,p,model,notes=['La fiche de cette puissance et révision est conservée séparément. Les références régionales contenant x ou ** restent des motifs constructeur, pas des MPN commerciaux. Aucune offre européenne n’est associée à une fiche USA.'])
 if '2024' in c['name'] and '2024' not in model:modelIdentities[c['id']]=model+' (2024 version)'
 if c['name'].startswith('Toughpower PF3-L'):modelIdentities[c['id']]=model+' (révision -L)'
 if c['name'].startswith('Smart BM3'):r['notes'].append('La page actuelle mêle ATX 3.0 et ATX 3.1 dans ses textes. Seul le tableau technique de la référence est ajouté ; aucune nouvelle version ATX n’est choisie à partir de ce texte contradictoire.')
 indexAudit.append({'id':c['id'],'brand':c['brand'],'state':'exact_power_and_revision_table','sourceURL':e['url'],'publishedPartPattern':part})
 for im in e.get('images',[]):
  if '/files/' in im['url'] and 'logo' not in im['url'].lower():photos.append({'id':c['id'],'mpn':r['mpn'],'sourceURL':e['url'],'checkedAt':e['checkedAt'],**im});break

# EVGA public PDF manuals: only readable English watt-specific electrical tables
# are selected; a neighbouring wattage never supplies rails or connectors.
evga=[]
for f in S.glob('evga-*.json'):
 e=json.loads(f.read_text())
 if e.get('format')!='pdf' or not e.get('primaryRawText'):continue
 raw=e['primaryRawText'].replace('ﬁ','fi').replace('ﬂ','fl');eng=raw.split('Einführung')[0]
 stem=f.stem.upper();family=None
 for familyCode in ['G3','G5','G6','G7','B3','BQ','T2','G2','P2','P3','P5','P6','GT','GM','GQ','W1','B5','BP','G1','GP','B1','B2','BA','PQ','GE','GS','N1']:
  if re.search(r'(?:-|\b)'+familyCode+r'(?:-|\b)',stem):family='G+' if familyCode=='GP' else familyCode;break
 if not family:continue
 dims=list(set(re.findall(r'Dimensions\s*:\s*([\d.]+)\s*mm\s*\(H\)\s*x\s*([\d.]+)\s*mm\s*\(W\)\s*x\s*([\d.]+)\s*mm\s*\(L\)',eng,re.I)))
 fans=list(set(re.findall(r'\b(\d{2,3})\s*mm\s*(?:FDB\s*|Double Ball Bearing\s*|Fluid Dynamic Bearing\s*|HDB\s*|Ultra Quiet\s*|Long Life Sleeve\s*|fan\s*)?(?:fan|Fan)\b',eng)))
 for mt in re.finditer(r'(?m)^\s*(?:Pcont\s+)?(\d{3,4})W(?:\s*@\s*\+?(\d+)\s*°?C)?[ \t]*$',raw):
  w=int(mt[1]);start=raw.rfind('AC Input',max(0,mt.start()-1000),mt.start())
  if start<0:continue
  block=raw[start:mt.end()];amps=re.findall(r'(?m)^\s*(?:MAX output, A\s+)?((?:\d+(?:\.\d+)?A\s+){4}\d+(?:\.\d+)?A)\s*$',block);power=re.findall(r'(?m)^\s*(?:Combined, W\s+)?((?:\d+(?:\.\d+)?\s*W[ \t]+){1,3}\d+(?:\.\d+)?\s*W)\s*$',block);ac=re.findall(r'(?m)^\s*([^\n]*(?:100\s*[-–]\s*240|200\s*[-–]\s*240)[^\n]*(?:Hz|HZ))\s*$',block)
  if not amps or not power:continue
  rows=[('Puissance continue et température ambiante',f'{w} W à +{mt[2]} °C')] if mt[2] else [('Puissance continue',str(w)+' W')]
  if ac:rows.append(('Entrée secteur',ac[-1]))
  av=re.findall(r'[\d.]+A',amps[-1]);pv=[p.replace(' ','') for p in re.findall(r'[\d.]+\s*W',power[-1])];order=re.search(r'(\+5V\s+\+3\.3V|\+3\.3V\s+\+5V)\s+\+12V\s+-12V\s+\+5Vsb',block,re.I)
  if not order:continue
  first=['Rail +5 V — courant maximal','Rail +3,3 V — courant maximal'] if order[1].startswith('+5V') else ['Rail +3,3 V — courant maximal','Rail +5 V — courant maximal']
  rows.extend(zip(first+['Rail +12 V — courant maximal','Rail −12 V — courant maximal','Rail +5 VSB — courant maximal'],av));rows.extend(zip(['Puissance combinée +5 / +3,3 V','Rail +12 V','Puissance −12 V','Puissance +5 VSB'],pv))
  patch={'wattage':w}
  if len(dims)==1:
   h,wide,depth=map(float,dims[0]);patch.update(heightMm=h,widthMm=wide,depthMm=depth);rows.append(('Dimensions hauteur × largeur × profondeur',f'{h:g} × {wide:g} × {depth:g} mm'))
  if len(fans)==1:patch.update(fanCount=1,fanSizeMm=int(fans[0]));rows.append(('Ventilateur',fans[0]+' mm'))
  protections=[x for x in ['OVP','UVP','OPP','SCP','OCP','OTP'] if '('+x+')' in eng]
  if protections:rows.append(('Protections',', '.join(protections)))
  if re.search(r'fully modular|fully-modular',eng,re.I):rows.append(('Modularité','Entièrement modulaire'))
  cert=re.search(r'80 PLUS\s*[®]?\s*(GOLD|PLATINUM|TITANIUM|BRONZE)',eng,re.I)
  if cert:rows.append(('Certification 80 PLUS',cert[1].title()))
  warranties=list(set(re.findall(r'\b(\d+)\s*[-–]\s*(?:Year|year)\s*(?:Limited\s*)?warranty',eng,re.I)))
  if len(warranties)==1:rows.append(('Garantie',warranties[0]+' ans (conditions EVGA)'))
  if family=='GM':rows.append(('Garantie','7 ans pour 450 / 550 / 650 GM ; 10 ans pour 750 / 850 GM'));patch['psuFormat']='SFX'
  evga.append({'key':f.stem,'family':family,'w':w,'rows':rows,'patch':patch})
for a in items:
 c=a['component']
 if c['category']!='psu' or c['brand']!='EVGA':continue
 base=c['name'].split(' · ')[0].replace('SuperNOVA ','').strip();lookupbase=str(c['wattage'])+' '+base if base in ['GE','N1','W3'] else base;m=re.fullmatch(r'(\d{3,4})\s*(G\+|[A-Z][A-Z0-9])',lookupbase)
 if not m or int(m[1])!=c['wattage']:continue
 matches=[x for x in evga if x['family']==m[2] and x['w']==c['wattage']]
 # Multiple files of the same manual have identical rows; select the richest
 # only when their electrical tables agree exactly.
 if not matches:continue
 electrical=[dict(x['rows'])['Rail +12 V'] for x in matches]
 if len(set(electrical))!=1:continue
 x=max(matches,key=lambda x:len(x['rows']));model=('SuperNOVA ' if c['name'].startswith('SuperNOVA') else '')+lookupbase
 model_record(c,x['key'],x['rows'],x['patch'],model,['Le tableau électrique du manuel correspond explicitement à cette puissance et cette série. Le code régional complet et le prix restent inconnus. Les câbles non lisibles sans ambiguïté dans le PDF ne sont pas transférés depuis une puissance voisine.'])
 indexAudit.append({'id':c['id'],'brand':c['brand'],'state':'watt_specific_official_pdf','sourceURL':source(x['key'])['url'],'model':model})
(D/'manufacturer-index-matches.json').write_text(json.dumps(indexAudit,ensure_ascii=False,indent=2))
