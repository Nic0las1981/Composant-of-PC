"""Project documented SSD columns into VerifiedProduct with field-level provenance."""
import runpy,pathlib,json,re,collections
C=runpy.run_path(str(pathlib.Path(__file__).with_name('collect-storage-boards.py')));globals().update({k:v for k,v in C.items() if not k.startswith('__')})
LABELS_SSD={'Model Name':'Modèle constructeur','Capacity':'Capacité constructeur','Total Capacity':'Capacité totale publiée','Controller':'Contrôleur','Flash Memory':'Type NAND','NAND':'Type NAND','Form Factor':'Format M.2','Interface':'Interface et protocole','Compatibility':'Interfaces rétrocompatibles','Dimensions':'Dimensions constructeur','Dimension':'Dimensions constructeur','External DDR Cache':'Cache DRAM','DRAM Cache':'Cache DRAM','Sequential Read up to (MB/s)':'Lecture séquentielle maximale (Mo/s)','Sequential Write up to (MB/s)':'Écriture séquentielle maximale (Mo/s)','Sequential Read speed':'Lecture séquentielle','Sequential Write speed':'Écriture séquentielle','Random Read 4KB up to (IOPS)':'Lecture aléatoire 4 Ko maximale (IOPS)','Random Write 4KB up to (IOPS)':'Écriture aléatoire 4 Ko maximale (IOPS)','Maximum Operating Power (W)':'Puissance de fonctionnement maximale (W)','Max. Operating Power':'Puissance de fonctionnement maximale','Limited Warranty':'Garantie limitée','Warranty':'Garantie limitée','Terabytes Written (TBW)':'Endurance TBW','Advanced Features':'Fonctions et sécurité','Operating Temperatures':'Température de fonctionnement','Storage Temperatures':'Température de stockage','Mean Time Between Failure (MTBF)':'MTBF'}
def pick(rows,*keys):return next((rows[k] for k in keys if rows.get(k)),None)
def dims(value):
 if not value:return None
 pattern=r'(\d+(?:\.\d+)?)\s*(?:mm)?\s*(?:\(L\))?\s*[x×*]\s*(\d+(?:\.\d+)?)\s*(?:mm)?\s*(?:\(W\))?\s*[x×*]\s*(\d+(?:\.\d+)?)\s*mm\s*(?:\(H\))?'
 matches=re.findall(pattern,value,re.I)
 return tuple(map(float,matches[0])) if len(matches)==1 else None
def build(item,r):
 c=item['component'];old=item.get('verified') if not item.get('quarantine') else None;rows=r['rows'];source=r['source'];facts={};patch={'capacityGB':c['capacityGB'],'detailLevel':'partial'}
 def fact(k,v):
  if v is not None and str(v).strip():facts[k]={'value':v,'sourceURL':source['url'],'checkedAt':source['checkedAt']}
 fact('capacity',r.get('commercialCapacity',str(c['capacityGB'])+' GB — capacité commerciale du modèle exact'))
 interface=pick(rows,'Interface','Interface type');form=pick(rows,'Form Factor','Form factor');fact('interfaceGeneration',interface);fact('formFactor',form)
 if interface and 'NVMe' in interface and form and re.search('M.2',form,re.I):patch['storageInterface']='M.2 NVMe';fact('interface','M.2 NVMe')
 else:fact('interface',interface)
 dimension=pick(rows,'Dimensions','Dimension','Dimensions (L x W x H)');size=dims(dimension)
 if size:
  for k,f,v in zip(['lengthMm','widthMm','heightMm'],['length','width','height'],size):patch[k]=v;fact(f,v)
 for key,labels in {'read':['Sequential Read up to (MB/s)','Sequential Read speed','Sequential Read Speed (Up to)','Max. Sequential Reading Speed (MB/s)'],'write':['Sequential Write up to (MB/s)','Sequential Write speed','Sequential Write Speed (Up to)','Max. Sequential Writing Speed (MB/s)'],'nand':['Flash Memory','NAND','NAND Flash'],'warranty':['Limited Warranty','Warranty','Warranty / Support'],'endurance':['Terabytes Written (TBW)','Endurance (TBW)','TBW']}.items():
  val=pick(rows,*labels)
  if val:
   if key in ('read','write') and re.fullmatch(r'[\d,.]+',val):val+=' MB/s maximum'
   fact(key,val)
 if 'endurance' not in facts and (warranty:=pick(rows,'Warranty','Limited Warranty','Warranty / Support')):
  values=set(re.findall(r'([\d,]+)\s*TBW',warranty,re.I))
  if len(values)==1:fact('endurance',next(iter(values))+' TBW')
 power=rows.get('Maximum Operating Power (W)','')
 if re.fullmatch(r'\d+(?:\.\d+)?',power):patch['powerW']=float(power)
 if r.get('heatsinkEvidence'):
  heat=r['heatsinkEvidence'];fact('heatsink',heat['statement'])
  if isinstance(heat.get('installed'),bool):patch['storageHeatsink']=heat['installed']
 if r.get('extraFacts'):
  for k,v in r['extraFacts'].items():fact(k,v)
 if r.get('extraFieldEvidence'):facts.update(r['extraFieldEvidence'])
 for k in r.get('conflictingFields',[]):facts.pop(k,None)
 if r.get('patch'):patch.update(r['patch'])
 mpn=r.get('partNumber') or (old or {}).get('mpn','');model=r['manufacturerModel'];sources=list({s['url']:s for s in (old or {}).get('sources',[])+r.get('additionalSources',[])+[source]}.values());offers=(old or {}).get('offers',[]) if mpn==(old or {}).get('mpn') else []
 patch['manufacturerModel']=model
 if mpn:patch['manufacturerPartNumber']=mpn
 patch['description']=f'SSD {c["brand"]} {model}. Spécifications relevées pour cette capacité et cette variante précises. Les champs absents ne sont pas repris d’une autre capacité ou d’une version avec un autre dissipateur.'
 patch['specs']=[str(patch['capacityGB'])+' Go']+([form] if form else [])+([interface] if interface else [])+([str(facts['read']['value'])+' en lecture'] if facts.get('read') else [])
 groups=[{'title':'Fabricant — spécifications de la capacité exacte','rows':[{'label':LABELS_SSD.get(k,k),'value':v} for k,v in rows.items() if v]}]
 if r.get('additionalGroups'):groups+=r['additionalGroups']
 if r.get('images'):groups.append({'title':'Références visuelles constructeur — modèle ou famille de capacités','rows':[{'label':'Image officielle non inspectée','value':u} for u in r['images']]})
 p={'identityKind':'mpn' if mpn else 'manufacturer-model','manufacturerModel':model,'mpn':mpn,'identityNote':'Modèle et capacité confirmés dans la fiche constructeur exacte. Les suffixes PRO, HS, PLAY, FROZR et les conditionnements restent distincts. '+('La référence commerciale marchande antérieure est conservée avec ses preuves.' if old and mpn else 'Aucun numéro commercial distinct n’est inventé à partir du nom de modèle.'),'sources':sources,'groups':groups,'patch':patch,'offers':offers,'notes':['Chaque valeur provient de la colonne de cette capacité. Les débits maximaux ne sont pas des débits garantis dans tous les usages.','Les prix et leurs dates antérieurs restent inchangés ; cette revue technique ne crée aucune offre.','Les différentes configurations de dissipateur restent affichées séparément lorsqu’un fabricant fournit plusieurs dimensions. Aucune dimension d’un module nu n’est imposée à un modèle avec dissipateur.']+r.get('notes',[]),'fieldEvidence':facts}
 return p
def main():
 out={};review=[]
 for item in INPUT:
  c=item['component'];p=D/'records'/(c['id']+'.json');r=json.load(open(p)) if p.exists() else {'state':'source_collection_pending'};product=build(item,r) if r.get('rows') and r.get('state')=='exact_model_and_capacity' else None
  if product:out[c['id']]=product
  review.append({'id':c['id'],'brand':c['brand'],'name':c['name'],'state':r['state'],'manufacturerModel':r.get('manufacturerModel'),'documentedFields':list(product['fieldEvidence']) if product else [],'evidenceFile':str(p.relative_to(ROOT)),'attempts':r.get('attempts',[]) if not product else []})
 target=ROOT/'src/data/deepStorageBoardsCatalog.ts';target.write_text('// Generated by scripts/build-storage-boards.py from exact capacity-specific manufacturer evidence.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const deepStorageBoardsProducts:Record<string,VerifiedProduct> = '+json.dumps(out,ensure_ascii=False,indent=2)+';\n')
 with target.open('a') as f:
  for id,p in out.items():
   if p['identityKind']=='manufacturer-model':f.write(f'deepStorageBoardsProducts["{id}"].patch.manufacturerPartNumber = undefined;\n')
 (D/'review.json').write_text(json.dumps({'summary':dict(collections.Counter(r['state'] for r in review)),'records':review},ensure_ascii=False,indent=2));print('SSD admitted',len(out),'/',len(INPUT))
if __name__=='__main__':main()
