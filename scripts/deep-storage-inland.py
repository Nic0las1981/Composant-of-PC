"""Match Inland model/capacity to explicit Micro Center manufacturer part numbers.
Only the product's technical section is parsed, never recommendations/prices.
Multiple part numbers for one archived model remain blocked, not selected by age.
"""
import pathlib,json,re,hashlib,datetime,collections
ROOT=pathlib.Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/storage-inland';D.mkdir(exist_ok=True,parents=True)
ENTRIES=json.loads((D/'input.json').read_text())
KEYS=['Mfr Part#','SKU','UPC','Capacity','Interface','Form Factor','Controller Type','Architecture','Read Speed','Write Speed','Random Write 4K','Random Read 4K','Endurance','Power Usage - Idle','Power Usage - Standby','Power Usage - Read/Write','MTBF','Shock Resistance','Box Dimensions (WxDxH)','Weight','Height','Width','Depth','Length','Color','Parts','Labor','Supported Windows Operating Systems']
LABELS={'SKU':'Référence magasin Micro Center','Mfr Part#':'Référence fabricant','UPC':'Code UPC','Capacity':'Capacité','Interface':'Interface','Form Factor':'Format','Controller Type':'Contrôleur','Architecture':'Type de NAND','Read Speed':'Lecture séquentielle maximale annoncée','Write Speed':'Écriture séquentielle maximale annoncée','Random Write 4K':'Écriture aléatoire 4K annoncée','Random Read 4K':'Lecture aléatoire 4K annoncée','Endurance':'Endurance','Parts':'Garantie pièces (marché américain)','Labor':'Garantie main-d’œuvre (marché américain)','Power Usage - Idle':'Consommation au repos publiée','Power Usage - Standby':'Consommation en veille publiée','Power Usage - Read/Write':'Consommation lecture/écriture publiée','Box Dimensions (WxDxH)':'Dimensions de la boîte (L × P × H)'}
FAMILY=r'Gaming Performance Plus|Performance Plus|Performance|TN450|TN470|QN450|TD510'
def parse_document(url,body,checked,artifact):
 model=re.search(r'\bInland\s+('+FAMILY+r')\s+(\d+(?:\.\d+)?)\s*(TB|GB)\b',body,re.I)
 if not model:return None
 start=body.find('### Product Information')
 if start<0:return None
 section=re.split(r'\n## (?:Questions|Warranty|Support)|\n### (?:Vendor Warranty|Micro Center Return Policy)',body[start:],maxsplit=1)[0]
 vals={};group='Identité';groups={};pending=None
 for line in section.splitlines():
  line=line.strip()
  if not line:continue
  if line.startswith('### '):group=line[4:];pending=None;continue
  found=next((k for k in KEYS if line==k or line.startswith(k+' ') or line.startswith(k+':')),None)
  if found:
   val=line[len(found):].lstrip(' :');pending=found
   if val:vals[found]=val;groups[found]=group;pending=None
  elif pending:vals[pending]=line;groups[pending]=group;pending=None
 if not all(k in vals for k in ['Mfr Part#','Capacity','Form Factor','Interface']):return None
 cap=re.fullmatch(r'(\d+(?:\.\d+)?)\s*(TB|GB)',vals['Capacity'],re.I)
 if not cap:return None
 capacity=int(float(cap[1])*(1000 if cap[2].upper()=='TB' else 1));title_capacity=int(float(model[2])*(1000 if model[3].upper()=='TB' else 1))
 if capacity!=title_capacity:return None
 return {'url':url,'checkedAt':checked,'artifact':artifact,'sha256':hashlib.sha256(body.encode()).hexdigest(),'digestScope':'exa-extracted-primary-document','model':model[1],'capacityGB':capacity,'mpn':vals['Mfr Part#'],'values':vals,'sections':groups,'explicitHeatsinkInTitle':bool(re.search(r'^.*Inland.*(?:Heatsink|Heat Sink).*$',body[:1500],re.I|re.M)),'technicalExcerpt':section}
def main():
 documents=[]
 for file in list(D.glob('fetch-*.json'))+[ROOT/'data/deep-review/storage-niche/exa-fetch-1.json']:
  raw=json.load(open(file));result=raw.get('result',raw);checked=raw.get('capturedAt') or datetime.datetime.fromtimestamp(file.stat().st_mtime,datetime.timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z')
  text='\n'.join(c.get('text','') for c in result.get('content',[]) if c.get('type')=='text');starts=list(re.finditer(r'^URL: (https://www.microcenter.com/[^\s]+)',text,re.M))
  for i,m in enumerate(starts):
   body=text[m.end():starts[i+1].start() if i+1<len(starts) else len(text)];r=parse_document(m[1],body,checked,str(file.relative_to(ROOT)))
   if r:documents.append(r)
 out={};audit=[]
 for entry in ENTRIES:
  c=entry['component'];family=re.search(FAMILY,c['name'],re.I);candidates=[r for r in documents if family and r['model'].lower()==family[0].lower() and r['capacityGB']==c['capacityGB']];mpns={r['mpn'].upper() for r in candidates}
  if len(mpns)!=1:
   audit.append({'id':c['id'],'name':c['name'],'state':'blocked_multiple_manufacturer_part_numbers' if mpns else 'primary_document_missing','candidates':[{'mpn':r['mpn'],'url':r['url'],'retailerSKU':r['values']['SKU']} for r in candidates],'missingIdentityDiscriminants':['Exact manufacturer part number / original heatsink version'] if mpns else ['Exact full primary product page']});continue
  r=max(candidates,key=lambda r:(len(r['values']),r['checkedAt']));v=r['values'];notes=['Fiche technique primaire Micro Center pour la référence Inland explicitement publiée dans « Mfr Part# ». Les garanties décrivent le marché américain. Aucun prix en dollars ni frais de livraison américains ne sont proposés comme prix français.'];values=[];discarded=[]
  for k,val in v.items():
   # Do not silently repair malformed thousands separators in a primary table.
   if k in ['Read Speed','Write Speed','Random Write 4K','Random Read 4K'] and re.search(r'\d,\d+',val):
    n=re.search(r'\d[\d,]*',val)[0]
    if not re.fullmatch(r'\d{1,3}(?:,\d{3})+',n):discarded.append({'label':k,'sourceValue':val,'reason':'ambiguous_numeric_format_in_primary_source'});notes.append('La valeur « '+k+' : '+val+' » publiée comporte un séparateur numérique ambigu ; elle n’est pas présentée comme mesure validée.');continue
   values.append({'label':LABELS.get(k,k),'value':val})
  patch={'manufacturerPartNumber':r['mpn'],'capacityGB':r['capacityGB'],'storageInterface':'M.2 NVMe','detailLevel':'partial'}
  if r['explicitHeatsinkInTitle']:patch['storageHeatsink']=True
  usage=re.fullmatch(r'(\d+(?:\.\d+)?) Watts?',v.get('Power Usage - Read/Write',''))
  if usage:patch['powerW']=float(usage[1])
  # Box dimensions and the nominal 2280 outline never become the assembled SSD height.
  notes.append('Le format M.2 2280 indique la taille nominale du circuit. La hauteur réelle du SSD avec dissipateur, lorsqu’elle n’est pas publiée, reste inconnue ; les dimensions de la boîte ne sont pas celles du SSD.')
  read=v.get('Read Speed','');write=v.get('Write Speed','');architecture=v.get('Architecture','');patch['description']='SSD Inland '+r['model']+' de '+v['Capacity']+', '+architecture+', interface '+v['Interface']+'. '+('Lecture annoncée : '+read+'. ' if not any(x['label']=='Read Speed' for x in discarded) else '')+'Les spécifications détaillées sont celles de la référence fabricant '+r['mpn']+' publiée par Micro Center.'
  patch['specs']=[v['Capacity']+' · '+v['Form Factor'],v['Interface']+' · '+architecture]+([read+' en lecture'] if read and not any(x['label']=='Read Speed' for x in discarded) else [])+([v['Endurance']] if v.get('Endurance') else [])
  sources=list({x['url']:{'name':'Micro Center — fiche technique Inland','url':x['url'],'checkedAt':x['checkedAt'],'kind':'retailer'} for x in candidates}.values())
  evidence={k:{'value':value,'sourceURL':r['url'],'checkedAt':r['checkedAt']} for k,value in patch.items() if k in ['manufacturerPartNumber','capacityGB','storageInterface','powerW','storageHeatsink']}
  out[c['id']]={'mpn':r['mpn'],'identityKind':'mpn','identityNote':'Série Inland '+r['model']+', capacité '+v['Capacity']+' et Mfr Part# explicitement rapprochés. Les variantes Performance, Performance Plus et Gaming Performance Plus sont distinctes.','sources':sources,'groups':[{'title':'Spécifications Inland publiées par Micro Center','rows':values}],'patch':patch,'offers':[],'notes':notes,'fieldEvidence':evidence}
  audit.append({'id':c['id'],'name':c['name'],'state':'primary_specs_enriched','mpn':r['mpn'],'urls':[x['url'] for x in candidates],'missingFields':['assembled_ssd_height_mm','current_France_EUR_offer']+(['controller'] if 'Controller Type' not in v else []),'discardedAmbiguousValues':discarded})
 (D/'documents.json').write_text(json.dumps(documents,ensure_ascii=False,indent=2));(D/'review.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2));(D/'products.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));(ROOT/'src/data/deepStorageInlandCatalog.ts').write_text("// Generated from exact Inland manufacturer references published by Micro Center.\nimport type { VerifiedProduct } from './verifiedTypes'\n\nexport const deepStorageInlandProducts: Record<string, VerifiedProduct> = "+json.dumps(out,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'documents':len(documents),'accepted':len(out),'states':dict(collections.Counter(x['state'] for x in audit))}));print(json.dumps([x for x in audit if x['state']!='primary_specs_enriched'],ensure_ascii=False))
if __name__=='__main__':main()
