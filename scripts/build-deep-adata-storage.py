"""Extract published ADATA SSD ordering codes and per-capacity performance.
Family maximums, carton sizes and duplicated/contradictory ordering codes are not
used as scalar facts. Both removable-heatsink configurations remain explicit.
"""
from pathlib import Path
import collections,copy,json,re
OUT=Path(__file__).resolve().parents[1]/'data/deep-review/memory-storage';documents={}
for pattern in ['adata-exa-*.json','adata-expansion-exa-*.json','adata-storage-exa-*.json','adata-legacy-storage-exa-*.json']:
 for path in sorted(OUT.glob(pattern)):
  d=json.loads(path.read_text());t='\n'.join(x.get('text','') for x in d.get('result',d.get('response'))['content'])
  for chunk in re.split(r'(?=^# [^\n]+\nURL: )',t,flags=re.M):
   u=re.search(r'^URL: (\S+)',chunk,re.M)
   if u:documents[u[1]]=(chunk,d['checkedAt'])
records=[];audit=[]
familyDocuments=[json.loads((OUT/f).read_text()) for f in ['final-expansion-exa.json','adata-final-family-exa.json']];familyDates={u:d['checkedAt'] for d in familyDocuments for c in d['response']['content'] for u in re.findall(r'^URL: (\S+)',c.get('text',''),re.M)}
familyProofDocument=copy.deepcopy(familyDocuments[0]);familyProofDocument['response']['content']+=familyDocuments[1]['response']['content'];familyProofs={}
for chunk in re.split(r'(?=^# [^\n]+\nURL: )','\n'.join(x.get('text','') for x in familyProofDocument['response']['content']),flags=re.M):
 u=re.search(r'^URL: (\S+)',chunk,re.M)
 if not u or not re.search(r'NVMe\s+[12]\.[034]',chunk):continue
 for family,term in [('MARS 980 BLADE','MARS 980 BLADE'),('XPG MARS 980 PRO','MARS 980 PRO'),('XPG GAMMIX S70','GAMMIX S70'),('XPG MARS 980 STORM','MARS 980 STORM')]:
  if term in chunk and 'xpg.com' in u[1]:familyProofs[family]={'name':'XPG — présentation officielle du modèle et protocole NVMe','url':u[1],'checkedAt':familyDates[u[1]],'kind':'manufacturer'}

def cap(n,u):return int(float(n)*(1000 if u.upper()=='TB' else 1))
for url,(text,date) in documents.items():
 if 'Ordering Information' not in text or 'SSD' not in text or 'Model Number' not in text:continue
 text=text.split('\nURL: ',1)[1].split('\n',1)[1] if '\nURL: ' in text else text
 title=re.search(r'(XPG (?:GAMMIX S\d+(?: BLADE| CORE| LITE)?|MARS 980 (?:BLADE|PRO|STORM)|SX8200 PRO|SPECTRIX S\d+G|ATOM 50)|LEGEND \d+(?: PRO| GOLD| LITE| MAX)?|PREMIUM SSD FOR PS5) PCIe',text,re.I)
 if not title:continue
 family=title[1]
 if family.upper()=='XPG ATOM 50':family='ATOM 50'
 if family.upper()=='XPG MARS 980 BLADE':family='MARS 980 BLADE'
 if family.upper()=='PREMIUM SSD FOR PS5':family='Premium For PS5'
 ordering=text[text.find('Ordering Information'):];ordering=re.split(r'\n(?:#+ )?Specifications',ordering)[0];flat=re.sub(r'[|\s]+',' ',ordering)
 codes=re.findall(r'\b(\d+(?:\.\d+)?)\s*(GB|TB)\s+((?:A|SLEG|SMAR|SGAMMIX)[A-Z0-9-]+)\b',flat)
 if not codes:continue
 header=text.split('Performance')[-1] if '\nPerformance' in text else text
 specs=re.search(r'(?:\n|\|)\s*(?:#+ )?Specifications(.*?)(?:\n(?:#+ )?Performance|\n(?:#+ )?Schematics|\Z)',text,re.S)
 spec=specs[1] if specs else text
 dims=re.findall(r'\b(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*mm(?:\s*/[^\n(]+)?(?:\s*\((with(?:out)? heat\s*sink)\))?',spec,re.I)
 perfsection=re.split(r'\n(?:#+ )?Performance\s*\n',text)[-1];perf={}
 for line in perfsection.splitlines():
  line=re.sub(r'[|]',' ',line);line=re.sub(r'\s+',' ',line).strip();m=re.match(r'^(\d+(?:\.\d+)?)\s*(GB|TB)\s+([\d,]+)\s+([\d,]+)\s+(.*?)\s*$',line)
  if not m:continue
  tbw=re.search(r'([\d,]+)\s*TB\b',m[5]);perf[cap(m[1],m[2])]={'line':line,'read':int(m[3].replace(',','')),'write':int(m[4].replace(',','')),'tbw':int(tbw[1].replace(',','')) if tbw else None}
 for n,u,mpn in codes:
  capacity=cap(n,u);p={'manufacturerPartNumber':mpn,'capacityGB':capacity};src={'name':'ADATA / XPG — tableau officiel par référence et capacité','url':url,'checkedAt':date,'kind':'manufacturer' if 'webapi3.adata.com/' in url else 'retailer'};facts={};rows=[{'label':'Référence et capacité commerciale publiées','value':mpn+' · '+n+u}]
  def fact(k,v):facts[k]={'value':v,'sourceURL':url,'checkedAt':date}
  if 'NVMe' in text or family.upper() in {f.upper() for f in familyProofs}:p['storageInterface']='M.2 NVMe'
  ff=re.search(r'Form Factor:\s*M\.2\s*(\d{4,5})',spec,re.I)
  if ff:fact('formFactor','M.2 '+ff[1]);rows.append({'label':'Format','value':'M.2 '+ff[1]})
  bus=re.search(r'Interface:\s*(PCIe\s*Gen[345]\s*x4)',spec,re.I)
  if bus:fact('pcie',re.sub(r'Gen([345])\s*x4',r'Gen\1 x4',bus[1]));rows.append({'label':'Interface PCIe','value':bus[1]})
  if dims:
   unique={(float(a),float(b),float(c),suffix.lower()) for a,b,c,suffix in dims};lengths={max(a,b) for a,b,c,s in unique};widths={min(a,b) for a,b,c,s in unique};heights={c for a,b,c,s in unique}
   if len(lengths)==1:p['lengthMm']=next(iter(lengths))
   if len(widths)==1:p['widthMm']=next(iter(widths))
   if len(heights)==1:p['heightMm']=next(iter(heights))
   if len(unique)==1 and next(iter(unique))[3]=='with heatsink':p['storageHeatsink']=True
   rows.extend({'label':'Dimensions documentées'+(' · '+suffix if suffix else ''),'value':f'{a:g} × {b:g} × {c:g} mm'} for a,b,c,suffix in sorted(unique))
  performance=perf.get(capacity)
  if performance:
   rows.append({'label':'Ligne de performances pour cette capacité','value':performance['line']})
   # Older ATTO/CDM tables contain several read/write pairs. Preserve their full
   # row, but never collapse different benchmark columns into one scalar pair.
   if 'ATTO' not in perfsection:
    fact('read',str(performance['read'])+' MB/s');fact('write',str(performance['write'])+' MB/s')
   if performance['tbw'] is not None:fact('endurance',str(performance['tbw'])+' TBW')
  warranty=re.search(r'Warranty:\s*(\d+)-year limited',spec,re.I)
  if warranty:fact('warranty',warranty[1]+' ans limitée');rows.append({'label':'Garantie','value':warranty[1]+' ans limitée, sous réserve de la limite TBW'})
  for label,pattern in [('NAND',r'NAND Flash:\s*([^\n|●]+)'),('Contrôleur publié',r'Controller:\s*([^\n|●]+)'),('MTBF',r'MTBF:\s*([\d,]+) hours'),('Température de fonctionnement',r'Operating Temperature:\s*([^\n|●]+)')]:
   m=re.search(pattern,spec,re.I)
   if m:rows.append({'label':label,'value':m[1].strip()})
  for k,v in p.items():fact(k,v)
  extra=[]
  if 'NVMe' not in text:
   fs=next((v for k,v in familyProofs.items() if k.upper()==family.upper()),None)
   if fs:extra=[fs];facts['storageInterface']={'value':'M.2 NVMe','sourceURL':fs['url'],'checkedAt':fs['checkedAt']}
  records.append({'mpn':mpn,'brand':'ADATA','category':'storage','family':family,'patch':p,'sources':[src]+extra,'rows':rows,'fieldEvidence':facts,'images':[],'url':url,'formFactor':'M.2 '+ff[1] if ff else None})
 audit.append({'url':url,'family':family,'publishedOrderingRows':codes,'performanceCapacities':list(perf),'exactRecords':len(codes)})
groups=collections.defaultdict(list)
for r in records:groups[r['mpn']].append(r)
result=[];issues=[]
for mpn,rs in groups.items():
 caps={r['patch']['capacityGB'] for r in rs}
 if len(caps)>1:issues.append({'mpn':mpn,'reason':'Ordering code reused for different capacities in the published document','capacities':sorted(caps),'sourceURLs':[r['url'] for r in rs]});continue
 # Prefer the latest dated document; older documents only fill facts that do not
 # conflict. Keep every source and every disagreement visible for review.
 rs.sort(key=lambda r:(re.search(r'20\d{6}',r['url'])[0] if re.search(r'20\d{6}',r['url']) else '00000000',r['url']));r=copy.deepcopy(rs[-1]);r['sources']=list({s['url']:s for x in rs for s in x['sources']}.values())
 for key in {k for x in rs for k in x['fieldEvidence']}:
  variants={json.dumps(x['fieldEvidence'][key]['value']) for x in rs if key in x['fieldEvidence']}
  if len(variants)>1 and key not in ['manufacturerPartNumber']:
   issues.append({'mpn':mpn,'field':key,'values':[json.loads(x) for x in sorted(variants)],'sourceURLs':[x['url'] for x in rs],'action':'Conflicting scalar excluded; individual source rows retained.'});r['fieldEvidence'].pop(key,None);r['patch'].pop(key,None);r['rows'].append({'label':'Variation entre documents','value':key+' : '+', '.join(sorted(variants))})
  elif key not in r['fieldEvidence']:
   previous=next(x for x in reversed(rs) if key in x['fieldEvidence']);r['fieldEvidence'][key]=previous['fieldEvidence'][key]
   if key in previous['patch']:r['patch'][key]=previous['patch'][key]
 result.append(r)
(OUT/'adata-storage-catalog.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');(OUT/'adata-storage-extraction-audit.json').write_text(json.dumps({'documents':audit,'issues':issues},ensure_ascii=False,indent=2)+'\n');print('published SSD references',len(result),'issues',len(issues))
