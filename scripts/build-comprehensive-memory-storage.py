"""Audit every memory/storage ID and retain only evidence-backed enrichments.

Input: a runtime catalog/verifiedProducts snapshot supplied as argv[1]. Sources:
retained primary pages in data/full-review/reviews.jsonl[.gz] and individual
manufacturer PDF extractions. Never invent an MPN or propagate between variants.
Existing offer amounts and observation times are preserved unchanged.
"""
from pathlib import Path
import collections,copy,datetime,gzip,json,re,sys,unicodedata
ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'data/comprehensive-review'; E=DEST/'memory-storage-evidence'
input_path=Path(sys.argv[1]) if len(sys.argv)>1 else E/'input.json.gz'
inputs=json.loads(gzip.decompress(input_path.read_bytes()).decode() if input_path.suffix=='.gz' else input_path.read_text())
byid={r['component']['id']:r for r in inputs}
now=datetime.datetime.now(datetime.timezone.utc)
def norm(s):return ''.join(c for c in unicodedata.normalize('NFKD',s.lower()) if not unicodedata.combining(c)).replace('’',"'").strip()
def number(s):return float(s.replace(',','.'))
def fieldnum(s):
 m=re.fullmatch(r'\s*(\d+(?:[.,]\d+)?)\s*(?:mm)?\s*',s)
 return number(m[1]) if m else None
# Explicit table labels: longest first prevents Type/Type de mémoire ambiguity.
labels={row['label'] for r in inputs if r.get('verified') for g in r['verified']['groups'] for row in g['rows']}
labels.update(['Capacité totale','Capacité mémoire','Capacité du kit','Capacité','Type de mémoire','Type','Fréquence','Fréquence mémoire','Latence CAS (CL)','Latence CAS','Format','Voltage','Tension','Profils supportés','Profil(s) supporté(s)','Profil Intel XMP','Profil AMD EXPO','Profil JEDEC par défaut','Profil EXPO #0','Profil EXPO #1','Profil XMP #1','Profil XMP #2','Organisation','On-Die ECC','Correction d\'erreurs','Refroidissement','Éclairage','Couleur','Configuration','RGB','Dissipateur thermique','Canal mémoire','Canaux','Système de refroidissement','Compatibilité','Dimensions','Dimensions du produit','Dimensions (L x l x H)','Dimensions (L × l × H)','Dimensions du module (L x l x H)','Interface','Protocole','Contrôleur','Mémoire NAND','NAND','Mémoire cache','Cache','Endurance (TBW)','Garantie','Lecture séquentielle','Écriture séquentielle','Vitesse de lecture séquentielle','Vitesse d\'écriture séquentielle','Lecture aléatoire','Écriture aléatoire','MTBF','Consommation','Température de fonctionnement'])
labels.update(['Interface interne','Interface externe','Vitesse lecture','Vitesse écriture','Dimensions (LxHxP)','Taille du disque dur','Capacité disque dur'])
labels=sorted(labels,key=len,reverse=True)
primary={}; recovered={}
sourcefile=ROOT/'data/full-review/reviews.jsonl'
openfile=open if sourcefile.exists() else gzip.open
if not sourcefile.exists():sourcefile=sourcefile.with_suffix('.jsonl.gz')
with openfile(sourcefile,'rt') as f:
 for line in f:
  record=json.loads(line);item=byid.get(record['componentId']);v=item.get('verified') if item else None
  if not v:continue
  for p in record.get('primaryPages',[]):
   product=p.get('product') or {};mpn=product.get('mpn','')
   if not p.get('match') or norm(mpn)!=norm(v['mpn']):continue
   text=product.get('technicalText','')
   # Only a retained specification table is parsed, never FAQ or marketing prose.
   marker=re.search(r'(?:Sp[eé]cifications?\s*D[eé]tails?|Caract[eé]ristiques?\s*D[eé]tails?)\n',text,re.I)
   if not marker:continue
   table=re.split(r'\n(?:FAQs?|Es para ti|Ce produit est fait|Questions? fr)',text[marker.end():],maxsplit=1,flags=re.I)[0]
   rows=[]
   for raw in table.splitlines():
    raw=raw.strip()
    for label in labels:
     if norm(raw).startswith(norm(label)) and len(raw)>len(label):
      value=raw[len(label):].strip(' :\t')
      if value and len(value)<300:rows.append({'label':label,'value':value})
      break
   if rows:
    primary[record['componentId']]={'url':p['url'],'checkedAt':p['checkedAt'],'sha256':p.get('sha256'),'mpn':mpn,'rows':rows}
    recovered[record['componentId']]=rows
# Keep a compact exact-page projection to reproduce each recovered table.
(E/'recovered-retailer-tables.json').write_text(json.dumps(primary,ensure_ascii=False,indent=2)+'\n')
manufacturer={}
manual_dims={'KF560C36BBEK2-32':(133.35,34.9,6.62),'KF432C16BBK2/16':(133.35,34,7.2),'KF560C30BWEAK2-64':(133.35,42.23,7.11),'KF564C32BBEK2-32':(133.35,34.9,6.62),'KF556C40BB2-32':(133.35,34.9,6.62),'KF560C30BWE-32':(133.35,34.9,6.62)}
for path in E.glob('KF*.json'):
 d=json.loads(path.read_text());t=re.sub(r'\s+',' ',d['raw_content'].replace('**',''));mpn=path.stem.replace('_','/')
 if mpn not in t:continue
 # Datasheet paragraph links tested speed/timing/voltage to the exact module.
 tested=re.search(r'tested to run at (DDR[45])-(\d+) at a low latency timing of ([\d-]+) at ([\d.]+)V',t)
 rank=re.search(r'\b([1248])Rx(4|8|16)\b',t)
 capacity=re.search(r'Total kit capacity is (\d+)GB',t)
 single=re.search(re.escape(mpn)+r' is a .{0,70}?\((\d+)GB\)',t)
 kit=re.search(r'kit of (two|four|eight)',t)
 height=re.search(r'Height.{0,20}?\(([\d.]+)mm\)',t)
 if not tested or not (capacity or single):continue
 sticks={'two':2,'four':4,'eight':8}.get(kit[1],1) if kit else 1
 patch={'manufacturerPartNumber':mpn,'memoryType':tested[1],'capacityGB':int((capacity or single)[1]),'memorySticks':sticks,'memorySpeedMTs':int(tested[2]),'casLatency':int(tested[3].split('-')[0]),'memoryVoltageV':float(tested[4]),'memoryModuleFormat':'DIMM','memoryModuleKind':'UDIMM','memoryRegistered':False,'memoryHeatspreader':True}
 # x64 data paths with 288 pins establish non-ECC UDIMM; On-Die ECC is not system ECC.
 if re.search(r'x 64[- ]Bit',t,re.I):patch['memoryEcc']=False
 patch['memoryProfile']='EXPO/XMP' if 'EXPO' in t and 'XMP' in t else 'XMP' if 'XMP' in t else 'JEDEC'
 if rank:patch.update(memoryRankCount=int(rank[1]),memoryDeviceWidthBits=int(rank[2]))
 if height:patch['heightMm']=float(height[1])
 if mpn in manual_dims:patch.update(zip(('lengthMm','heightMm','thicknessMm'),manual_dims[mpn]))
 elif mpn=='KF560C30BBE-32' and '133.35 mm' in t:patch['lengthMm']=133.35
 rows=[{'label':'Référence fabricant','value':mpn},{'label':'Capacité du kit' if sticks>1 else 'Capacité du module','value':f"{patch['capacityGB']} Go · {sticks} × {patch['capacityGB']//sticks} Go"},{'label':'Débit et timings testés','value':f"{tested[1]}-{tested[2]} · {tested[3]} · {tested[4]} V"},{'label':'Profils mémoire','value':patch['memoryProfile']},{'label':'Format mémoire','value':'UDIMM 288 broches, non enregistrée, bus de données x64, non-ECC système'}]
 if rank:rows.append({'label':'Organisation par module','value':rank[0]})
 default=re.search(r'JEDEC standard latency (DDR[45]-\d+) timing of ([\d-]+) at ([\d.]+)V',t)
 if default:rows.append({'label':'Profil JEDEC par défaut','value':f'{default[1]} · {default[2]} · {default[3]} V'})
 if height:rows.append({'label':'Hauteur avec dissipateur','value':height[1]+' mm'})
 if mpn in manual_dims:rows.append({'label':'Dimensions avec dissipateur (L × H × épaisseur)','value':' × '.join(str(n) for n in manual_dims[mpn])+' mm'})
 manufacturer[mpn]={'patch':patch,'source':{'name':'Kingston — fiche technique de la référence','url':d['url'],'checkedAt':d['checkedAt'],'kind':'manufacturer'},'group':{'title':'Données fabricant Kingston de la référence exacte','rows':rows}}
products={};audit=[];changes=collections.Counter();conflicts=[]
quarantine_path=DEST/'memory-storage-quarantine.json'
quarantine={x['id']:x for x in json.loads(quarantine_path.read_text())} if quarantine_path.exists() else {}
name_reference_path=E/'name-reference-products.json'
name_references=json.loads(name_reference_path.read_text()) if name_reference_path.exists() else {}
def values(rows,*wanted):return [r['value'] for r in rows if norm(r['label']) in [norm(s) for s in wanted]]
def one_number(values_,units=None):
 nums=[]
 for v in values_:
  pattern=r'\s*(\d+(?:[.,]\d+)?)\s*'+('(?:'+units+r')' if units else '')+r'\s*'
  m=re.fullmatch(pattern,v,re.I)
  if m:nums.append(number(m[1]))
 return nums[0] if nums and len(set(nums))==1 else None
for item in inputs:
 c=item['component'];id=c['id'];v=copy.deepcopy(name_references.get(id) or item.get('verified'));mpn=(v or {}).get('mpn') or c.get('manufacturerPartNumber');reasons=[];missing=[];recordconflicts=[]
 if not v:
  reason='Référence fabricant absente : capacité, fréquence, couleur et nom de gamme ne distinguent pas le SKU, le kit ou la révision.' if not mpn else 'MPN connu, mais aucune fiche primaire fabricant ou marchand vérifiée pour cette référence ; données SPD publiques distinctes des preuves commerciales.'
  audit.append({'id':id,'category':c['category'],'mpn':mpn,'status':'blocked','identityConfirmed':False,'reason':reason,'missing':['primaryExactIdentity','primarySpecificationTable','eligiblePrice'],'sources':[]});continue
 rows=[r for g in v['groups'] for r in g['rows']]
 if id in recovered:
  known={(norm(r['label']),norm(r['value'])) for r in rows};new=[r for r in recovered[id] if (norm(r['label']),norm(r['value'])) not in known]
  if new:v['groups'].append({'title':'Tableau technique PcComponentes — référence exacte','rows':new});rows+=new;changes['tablesRecovered']+=1
 patch=copy.deepcopy(v['patch']);fieldproof={k:'existing_verified_patch' for k in patch}
 def put(k,value,proof='exact_source_table'):
  if value is None:return
  if k in ['memoryType','memorySticks','memorySpeedMTs','casLatency'] and k in c and c[k]!=value and mpn not in manufacturer:
   recordconflicts.append({'field':k,'retainedCatalog':c[k],'candidate':value,'source':proof});return
  if k=='heightMm' and c['category']=='ram' and k in c and abs(c[k]-value)>1 and mpn not in manufacturer:
   recordconflicts.append({'field':k,'retainedCatalog':c[k],'candidate':value,'source':proof});return
  if k in patch and patch[k]!=value:
   recordconflicts.append({'field':k,'retained':patch[k],'candidate':value,'source':proof});return
  patch[k]=value;fieldproof[k]=proof
 if c['category']=='ram':
  for value in values(rows,'Capacité','Capacité totale','Mémoire interne','Capacité mémoire','Capacité du kit'):
   m=re.match(r'^(\d+)\s*(?:Go|GB)\b',value,re.I)
   if m:put('capacityGB',int(m[1]))
  for value in values(rows,'Disposition de la mémoire (modules x taille)','Disposition de la mémoire (modules x dimensions)','Conception de la mémoire (modules x taille)','Capacité','Capacité totale','Configuration','Capacité du kit'):
   m=re.search(r'\b(\d+)\s*[x×]\s*(\d+)\s*(?:Go|GB)\b',value,re.I)
   if m:put('memorySticks',int(m[1]));put('capacityGB',int(m[1])*int(m[2]))
  count=one_number(values(rows,'Nombre de barrettes'))
  if count and count in [1,2,4,8]:put('memorySticks',int(count))
  for value in values(rows,'Type','Type de mémoire','Type de mémoire interne','Mémoire','Format mémoire','Norme mémoire'):
   m=re.search(r'\b(DDR[45])\b',value)
   if m:put('memoryType',m[1])
  for value in values(rows,'Fréquence','Fréquence mémoire','Fréquence(s) Mémoire','Vitesse d\'horloge de la mémoire','Vitesse d\'horloge mémoire','Fréquence de la mémoire','Débit testé','Norme mémoire'):
   m=re.fullmatch(r'(?:DDR[45][ -])?(\d[\d ]*)\s*(?:MHz|MT/s)?',value,re.I)
   if m and 1600<=int(m[1].replace(' ',''))<=10000:put('memorySpeedMTs',int(m[1].replace(' ','')))
  cl=one_number(values(rows,'Latence CAS','Latence CAS (CL)','CAS Latency'))
  if cl and cl<100:put('casLatency',int(cl))
  volt=one_number(values(rows,'Voltage','Tension','Tension mémoire','Mémoire de tension','Tension de la mémoire','Ces timings sont supportés avec une tension minimale de :','Ces timings sont compatibles avec une tension minimale de'),r'V(?:olts?|olt\(s\))?')
  if volt and .9<=volt<=1.8:put('memoryVoltageV',volt)
  formats=' '.join(values(rows,'Format','Format de mémoire','Facteur de forme de la mémoire','Forme du facteur de mémoire','Format mémoire'))
  if re.search(r'SO[- ]DIMM',formats,re.I):put('memoryModuleFormat','SO-DIMM');put('memoryModuleKind','SO-DIMM')
  elif re.search(r'\bDIMM\b',formats,re.I):put('memoryModuleFormat','DIMM')
  kind=' '.join(values(rows,'Type de mémoire tampon','Type de mémoire mise en cache','Spécification mémoire','Type de mémoire','Canal mémoire','Format mémoire'))
  if re.search(r'unbuffered|unregistered|non enregistr|\bUDIMM\b',kind,re.I):put('memoryRegistered',False);put('memoryModuleKind','UDIMM')
  if re.search(r'\bCUDIMM\b',kind,re.I):put('memoryRegistered',False);put('memoryModuleKind','CUDIMM')
  ecc=' '.join(values(rows,'ECC','CCE','Type de mémoire','Correction d’erreurs','Correction d\'erreurs'))
  if re.search(r'^(?:Non|No)$|sans ECC|non-ECC|aucune protection ECC au niveau système',ecc,re.I):put('memoryEcc',False)
  # Never turn retailer 'ECC Oui' for DDR5 into system ECC support.
  profiletext=' '.join(r['label']+' '+r['value'] for r in rows if re.search(r'profil|xmp|expo',r['label'],re.I) and not re.fullmatch(r'non|no|0',r['value'],re.I))
  xmp=bool(re.search('XMP',profiletext,re.I));expo=bool(re.search('EXPO',profiletext,re.I))
  if xmp or expo:put('memoryProfile','EXPO/XMP' if xmp and expo else 'XMP' if xmp else 'EXPO')
  cooling=' '.join(values(rows,'Radiateur','Refroidissement','Type de refroidissement','Système de refroidissement','Dissipateur thermique'))
  if re.search(r'heatsink|dissipateur|radiateur|^oui',cooling,re.I):put('memoryHeatspreader',True)
  elif re.fullmatch(r'non|no',cooling,re.I):put('memoryHeatspreader',False)
  rgb=' '.join(values(rows,'LED RGB','Rétroéclairage','Éclairage','RGB'))
  if re.fullmatch(r'Non|No',rgb,re.I):put('rgb',False)
  elif re.search(r'\bRGB\b|^oui$',rgb,re.I):put('rgb',True)
  ranktext=' '.join(values(rows,'Organisation'))
  rank=re.search(r'\b([1248])Rx(4|8|16)\b',ranktext)
  if rank:put('memoryRankCount',int(rank[1]));put('memoryDeviceWidthBits',int(rank[2]))
  # Coordinate names differ by merchant. A full triple is normalized only inside
  # desktop-DIMM ranges; never import a shipping package's dimensions.
  triple=[one_number(values(rows,label),r'mm') for label in ['Largeur','Hauteur','Profondeur']]
  dimvals=values(rows,'Dimensions','Dimensions du module (L x l x H)','Dimensions (L x l x H)','Dimensions (L × l × H)')
  candidates=[]
  if all(n is not None for n in triple):candidates.append(sorted(triple,reverse=True))
  for value in dimvals:
   nums=re.findall(r'(\d+(?:[.,]\d+)?)\s*(?:mm)?\s*(?:[x×]|mm\s*$)',value)
   if len(nums)==3:candidates.append(sorted(map(number,nums),reverse=True))
  for dims in candidates:
   if 125<=dims[0]<=150 and 25<=dims[1]<=65 and 2<=dims[2]<=15:
    for k,n in zip(['lengthMm','heightMm','thicknessMm'],dims):put(k,n)
  height=one_number(values(rows,'Hauteur'),r'mm')
  if height and 25<=height<=65:put('heightMm',height)
 else:
  interface=' '.join(values(rows,'Interface','Interface avec l\'ordinateur','Type d\'interface','Format et interface','Protocole','Format de Disque','Facteur de forme SSD','Facteur de forme du disque SSD','Format','Format M.2'))
  external=bool(re.search(r'USB|2[.,]5\s*(?:pouces|\")',interface,re.I)) or bool(values(rows,'Connecteur USB','Version USB','Taille du disque dur'))
  if external:reasons.append('La fiche primaire identifie un support externe/USB ou SATA : incompatible avec un emplacement M.2 NVMe.');missing.append('validM2Identity')
  elif re.search(r'PCI[ -]?e|PCI Express|NVMe',interface,re.I) and (re.search(r'M[.]?2|2280|2230',interface,re.I) or c.get('storageInterface')=='M.2 NVMe'):put('storageInterface','M.2 NVMe')
  for value in values(rows,'Capacité','Capacité nominale','Capacité du Solid State Drive (SSD)','SSD, capacité','Capacité totale'):
   m=re.fullmatch(r'\s*(\d+(?:[.,]\d+)?)\s*(Go|GB|To|TB)\s*',value,re.I)
   if m:put('capacityGB',int(number(m[1])*(1000 if m[2].lower() in ['to','tb'] else 1)))
  cooling=' '.join(values(rows,'Dissipateur thermique','Type de refroidissement','Refroidissement'))
  if re.fullmatch(r'non|no|sans dissipateur',cooling,re.I):put('storageHeatsink',False)
  elif re.search(r'^oui$|dissipateur aluminium|dissipateur thermique',cooling,re.I) and not re.search('sans|non inclus',cooling,re.I):put('storageHeatsink',True)
  if not external:
   triple=[one_number(values(rows,label),r'mm') for label in ['Largeur','Hauteur','Profondeur']]
   dimensions=[]
   if all(n is not None for n in triple):dimensions.append(sorted(triple,reverse=True))
   for value in values(rows,'Dimensions','Dimensions du produit','Dimensions (L × l × H)','Dimensions (LxHxP)','Dimensions maximales (L × l × h)'):
    nums=re.findall(r'(\d+(?:[.,]\d+)?)\s*(?:mm)?\s*(?:\([^)]*\))?\s*(?:[x×]|mm\b)',value)
    if len(nums)>=3:dimensions.append(sorted(map(number,nums[:3]),reverse=True))
   for dims in dimensions:
    # Standard M.2 module or installed factory heatsink; exclude boxes,
    # water blocks and unrelated auxiliary accessories.
    if 29<=dims[0]<=111 and 20<=dims[1]<=30 and 0.5<=dims[2]<=25:
     for k,n in zip(['lengthMm','widthMm','heightMm'],dims):put(k,n)
 # Manufacturer data has explicit precedence over conflicting merchant values.
 if mpn in manufacturer:
  m=manufacturer[mpn];v['sources'].insert(0,m['source']);v['groups'].insert(0,m['group']);patch.update(m['patch']);fieldproof.update({k:'exact_manufacturer_pdf' for k in m['patch']});recordconflicts=[x for x in recordconflicts if x['field'] not in m['patch']]
  v['notes'].append('Données Kingston issues du PDF portant exactement ce MPN. Les tensions JEDEC et profils overclockés restent distincts ; aucune dimension de dessin illisible ou non légendée n’est extrapolée.')
  if mpn=='KF560C30BWE-32':v['notes'].append('Correction fabricant : le profil testé DDR5-6000 CL30 fonctionne à 1,4 V. Le 1,35 V du tableau marchand est contredit par le PDF KF560C30BWE-32 ; le profil JEDEC DDR5-4800 fonctionne à 1,1 V.')
 # Flag capacity mismatch without silently changing the archive's identity.
 if 'capacityGB' in patch and c.get('capacityGB') and patch['capacityGB']!=c['capacityGB'] and (mpn,patch['capacityGB'],c['capacityGB']) not in [('SKC3000D/2048G',2048,2000),('SKC3000S/1024G',1024,1000)]:
  recordconflicts.append({'field':'capacityGB','retainedCatalog':c['capacityGB'],'candidate':patch['capacityGB'],'source':'exact_source_table'})
  reasons.append('La capacité publiée diffère de celle de l’archive ; identité à réconcilier avant disponibilité.')
 if recordconflicts:
  reasons.append('Des valeurs de sources divergent ; elles restent visibles dans le rapport et ne sont pas remplacées arbitrairement.')
  for conflict in recordconflicts:
   v['notes'].append(f"Divergence à confirmer pour {conflict['field']} : valeur catalogue {conflict.get('retainedCatalog',conflict.get('retained'))}, valeur du tableau marchand {conflict['candidate']}. Le tableau marchand n’écrase pas ce champ sans confirmation du fabricant.")
 fields=['capacityGB','memorySticks','memoryType','memorySpeedMTs','casLatency','memoryVoltageV','memoryModuleFormat','memoryModuleKind','memoryRegistered','memoryEcc','memoryProfile','memoryHeatspreader','heightMm','lengthMm','thicknessMm'] if c['category']=='ram' else ['capacityGB','storageInterface','lengthMm','widthMm','heightMm','storageHeatsink']
 missing += [k for k in fields if k not in patch]
 if c['category']=='storage':
  txt=' '.join(r['label'] for r in rows)
  for key,pattern in [('sequentialRead','lecture'),('sequentialWrite','[eé]criture'),('endurance','endurance|TBW'),('flashType','flash|NAND')]:
   if not re.search(pattern,txt,re.I):missing.append(key)
 offers=[]
 for o in v['offers']:
  try:age=(now-datetime.datetime.fromisoformat(o['checkedAt'].replace('Z','+00:00'))).total_seconds()
  except Exception:age=999999
  if o['mpn']==mpn and o['currency']=='EUR' and o['market']=='FR' and o['condition']=='new' and o['availability']=='in_stock' and o['priceKind']=='current' and o['amount']>0 and 0<=age<=86400:offers.append(o)
 price_ready=bool(offers)
 if not price_ready:missing.append('eligiblePrice')
 patch['manufacturerPartNumber']=mpn
 v['patch']=patch
 newkeys=[k for k,value in patch.items() if c.get(k)!=value]
 wrongidentity=external if c['category']=='storage' else False
 wrongidentity=wrongidentity or any(x.get('retainedCatalog') is not None and x['field']=='capacityGB' for x in recordconflicts)
 if id in quarantine and norm(quarantine[id]['badMPN'])==norm(mpn):
  wrongidentity=True
  reasons.append(quarantine[id]['reason'])
  missing.append('primaryExactIdentity')
 if wrongidentity:price_ready=False
 if not wrongidentity:
  # The old archive prose claims every field is unknown. Replace it with a
  # summary of evidenced values, without borrowing dimensions from visuals.
  display_name=patch.get('name',c['name'])
  description=[f"{c['brand']} {display_name}. Référence {mpn}."]
  if c['category']=='storage':
   if all(k in patch for k in ['lengthMm','widthMm','heightMm']):description.append('Dimensions documentées (L × l × h) : '+' × '.join(str(patch[k]).replace('.',',') for k in ['lengthMm','widthMm','heightMm'])+' mm.')
   elif 'heightMm' in patch:description.append(f"Hauteur documentée : {str(patch['heightMm']).replace('.',',')} mm ; autres dimensions à confirmer.")
   else:description.append('Encombrement complet encore à confirmer.')
   if 'storageHeatsink' in patch:description.append('Dissipateur fourni.' if patch['storageHeatsink'] else 'Sans dissipateur intégré.')
   else:description.append('Présence d’un dissipateur à confirmer pour cette référence.')
   details_missing=[label for key,label in [('sequentialRead','débit de lecture'),('sequentialWrite','débit d’écriture'),('endurance','endurance'),('flashType','type NAND')] if key in missing]
   if details_missing:description.append('Données restant à confirmer : '+', '.join(details_missing)+'.')
  else:
   if 'memorySticks' in patch and 'capacityGB' in patch:description.append(f"Conditionnement documenté : {patch['memorySticks']} module(s), {patch['capacityGB']} Go au total.")
   if 'memoryVoltageV' in patch:description.append(f"Tension du profil testé : {str(patch['memoryVoltageV']).replace('.',',')} V.")
   if 'memoryProfile' in patch:description.append(f"Profil(s) mémoire : {patch['memoryProfile']}.")
   description.append(f"Hauteur documentée : {str(patch['heightMm']).replace('.',',')} mm." if 'heightMm' in patch else 'Hauteur exacte restant à confirmer.')
  if recordconflicts:description.append('Une divergence technique entre sources reste signalée dans les notes de la fiche.')
  patch['description']=' '.join(description)
  if 'description' not in newkeys:newkeys.append('description')
 if not wrongidentity and (id in recovered or mpn in manufacturer or newkeys):
  products[id]=v;changes['recordsEnriched']+=1;changes['fieldsAddedOrCorrected']+=len(newkeys)
 audit.append({'id':id,'category':c['category'],'mpn':mpn,'status':'ready' if not missing and not reasons else 'blocked','identityConfirmed':not wrongidentity,'technicalReady':not [x for x in missing if x!='eligiblePrice'] and not reasons,'priceReady':price_ready,'missing':missing,'blockers':reasons,'conflicts':recordconflicts,'confirmedFields':sorted(fieldproof),'newOrCorrectedFields':newkeys,'sources':v['sources'],'offerObservations':[{'url':o['url'],'amount':o['amount'],'checkedAt':o['checkedAt'],'availability':o['availability'],'condition':o['condition']} for o in v['offers']]})
 if recordconflicts:conflicts.append({'id':id,'mpn':mpn,'conflicts':recordconflicts})
summary={'total':len(audit),'byCategory':dict(collections.Counter(x['category'] for x in audit)),'ready':sum(x['status']=='ready' for x in audit),'blocked':sum(x['status']=='blocked' for x in audit),'identifiedPrimary':sum(bool(x['identityConfirmed']) for x in audit),'eligiblePrice':sum(bool(x.get('priceReady')) for x in audit),'manufacturerPdfs':len(manufacturer),**changes}
report={'checkedAt':now.isoformat(),'scope':'Every RAM and storage catalog ID; no equivalence inferred from a family name.','readyDefinition':'Exact primary identity; every listed essential technical and mechanical field documented; no unresolved source conflict; new, available EUR/FR offer observed within 24 hours. This does not certify a photorealistic visual model.','essentialFields':{'ram':['capacityGB','memorySticks','memoryType','memorySpeedMTs','casLatency','memoryVoltageV','memoryModuleFormat','memoryModuleKind','memoryRegistered','memoryEcc','memoryProfile','memoryHeatspreader','heightMm','lengthMm','thicknessMm'],'storage':['capacityGB','storageInterface','lengthMm','widthMm','heightMm','storageHeatsink','sequentialRead','sequentialWrite','endurance','flashType']},'summary':summary,'records':audit}
(DEST/'memory-storage.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
(ROOT/'src/data/comprehensiveMemoryStorage.ts').write_text('// Exact-reference enrichments. Generated by scripts/build-comprehensive-memory-storage.py.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const comprehensiveMemoryStorage: Record<string,VerifiedProduct> = '+json.dumps(products,ensure_ascii=False,indent=2)+';\n')
print(json.dumps(summary,ensure_ascii=False,indent=2));print('Conflicts:',json.dumps(conflicts,ensure_ascii=False))
