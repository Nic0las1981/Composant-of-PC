"""Cross-check migrating CMS fields against the product's linked PDF sheet.

Some shared CMS enumeration values were changed globally (e.g. XG ATX 2.53
became 3.1). A watt-specific official datasheet with the same SKU resolves the
older hardware table. Unresolved multi-model tables are never projected.
"""
cmSheets=json.loads((D/'coolermaster-psu-sheet-index.json').read_text());cmConflicts=[];powerCorrections=[]
for a in items:
 c=a['component'];id=c['id']
 if c['category']!='psu' or c['brand']!='Cooler Master' or id not in records:continue
 r=records[id];urls={x['url'] for x in r['sources']};hits=[]
 for link in cmSheets:
  ep=json.loads((S/(link['productSourceKey']+'.json')).read_text());pp=S/(link['pdfSourceKey']+'.json')
  if ep['url'] not in urls or not pp.exists():continue
  e=json.loads(pp.read_text())
  if e.get('format')!='pdf' or not e.get('primaryRawText'):continue
  hits.append((link,ep,e))
 if len(hits)!=1:continue
 link,ep,e=hits[0];raw=e['primaryRawText'];rows=[];patch={};oldmap={x['label']:x['value'] for g in r['groups'] for x in g['rows']}
 # One explicitly named table, even when the PDF also has packaging columns.
 for label in ['ATX Version','PFC','Input Voltage','Input Current','Input Frequency','Fan Size','Fan Speed','Noise @ 100%','Efficiency','80 PLUS Rating','Operating Temperature','Power Good Signal','Hold Up Time','MTBF']:
  values=list(dict.fromkeys(x.strip() for x in re.findall(r'(?m)^\s*'+re.escape(label)+r'[ \t]+([^\n]+)$',raw)))
  if len(values)!=1:continue
  v=values[0]
  if label=='ATX Version' and not re.search(r'\d\.\d',v):continue
  if label=='Fan Size' and not re.fullmatch(r'\d+(?:\.\d+)?\s*mm',v):continue
  prior=oldmap.get(label)
  if prior and re.sub(r'\s+','',prior)!=re.sub(r'\s+','',v):cmConflicts.append({'id':id,'field':label,'cmsValue':prior,'pdfValue':v,'cmsURL':ep['url'],'pdfURL':e['url'],'decision':'watt-specific manufacturer PDF linked by the same product page'})
  clean_obsolete_rows(r,[label,translations.get(label,label)])
  for fk in list(r.get('fieldEvidence',{})):
   if fk.endswith('.'+label) or (label=='ATX Version' and fk in ['atxVersion','atxStandard']):r['fieldEvidence'].pop(fk,None)
  rows.append((label,v))
  if label=='Fan Size':patch.update(fanCount=1,fanSizeMm=float(re.search(r'[\d.]+',v)[0]))
 dims=list(dict.fromkeys(re.findall(r'(?m)^\s*Dimensions\s*\(L\s*[x×]\s*W\s*[x×]\s*H\)\s+([^\n]+)$',raw,re.I)))
 if len(dims)==1:
  vals=re.match(r'([\d.]+)\s*[x×]\s*([\d.]+)\s*[x×]\s*([\d.]+)\s*mm',dims[0],re.I)
  if vals:
   patch.update(depthMm=float(vals[1]),widthMm=float(vals[2]),heightMm=float(vals[3]));rows.append(('Dimensions (L × W × H) — fiche PDF',dims[0]));clean_obsolete_rows(r,['Dimensions (L x W x H)'])
   for f in ['depthMm','widthMm','heightMm']:
    if r['patch'].get(f)!=patch[f]:cmConflicts.append({'id':id,'field':f,'cmsValue':r['patch'].get(f),'pdfValue':patch[f],'pdfURL':e['url'],'decision':'explicit L×W×H axes on own manufacturer PDF'})
 eu=list(dict.fromkeys(re.findall(r'(?m)^([A-Z0-9]+(?:-[A-Z0-9]+)*EU)\s+\d{13}\s+\d{12}\b',raw)))
 if len(eu)==1:
  r['mpn']=eu[0];r['patch']['manufacturerPartNumber']=eu[0];r['identityNote']='Référence Europe imprimée dans le tableau EAN/UPC de la fiche fabricant du modèle exact : '+eu[0]+'.';r.pop('identityKind',None);r.pop('manufacturerModel',None);r['patch'].pop('manufacturerModel',None);modelIdentities.pop(id,None);rows.append(('Référence commerciale Europe — fiche PDF',eu[0]))
 if 'Peak' in link['productName']:
  pm=re.search(r'TOTAL POWER[^\n]+\n(\d+)W\nPEAK POWER\s+(\d+)\b',raw)
  if pm:
   continuous,peak=map(int,pm.groups());assert peak==c['wattage'];patch['wattage']=continuous
   duration=' pendant 20 secondes' if '20 seconds' in raw else ''
   clean_obsolete_rows(r,['Watts','Puissance continue','Puissance nominale']);rows.extend([('Puissance continue (TOTAL POWER)',str(continuous)+' W'),('Puissance de pointe (PEAK POWER)',str(peak)+' W'+duration)])
   patch['variantGroupName']=link['productName']+' '+str(continuous)+' W continus';patch.update(name=c['name'].split(' · ')[0]+' · '+str(continuous)+' W continus · '+str(peak)+' W en pointe',specs=[str(continuous)+' W continus',str(peak)+' W en pointe'+duration],description='La désignation '+link['productName']+' utilise la puissance de pointe. La puissance continue constructeur est de '+str(continuous)+' W ; la pointe de '+str(peak)+' W est limitée'+duration+'. Le dimensionnement électrique utilise la puissance continue.')
   powerCorrections.append({'id':id,'field':'wattage','oldValue':c['wattage'],'newValue':continuous,'sourceURL':e['url'],'checkedAt':e['checkedAt'],'reason':'Le tableau fabricant distingue TOTAL POWER continu et PEAK POWER ; la désignation commerciale PN'+str(peak)+' utilise la pointe'+duration+'.','manufacturerModel':link['productName']})
 if rows:add(id,link['pdfSourceKey'],rows,patch,notes=['Le PDF technique lié à la fiche constructeur est contrôlé séparément du CMS actuel. Les champs contradictoires du CMS sont remplacés par le tableau propre au modèle et à sa référence ; aucune génération voisine n’est utilisée.'])
 indexAudit.append({'id':id,'brand':'Cooler Master','state':'linked_manufacturer_pdf_crosschecked','sourceURL':e['url'],'pageURL':ep['url'],'fields':list(patch),'commercialEU':eu[0] if len(eu)==1 else None})
(D/'coolermaster-cms-pdf-conflicts.json').write_text(json.dumps(cmConflicts,ensure_ascii=False,indent=2))
(D/'corrections.json').write_text(json.dumps(powerCorrections,ensure_ascii=False,indent=2))
