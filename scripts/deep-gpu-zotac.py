"""Conservatively extract unambiguous variant blocks from official Zotac catalogs.
Layout blocks that contain multiple memories or no directly following features
are rejected. Model identifiers remain separate from missing commercial SKUs.
"""
import json,pathlib,re,hashlib,datetime
D=pathlib.Path(__file__).resolve().parents[1]/'data/deep-review/gpu'
t=(D/'indexes/zotac-catalogs-extracted.txt').read_text();documents=[];starts=list(re.finditer(r'^URL: (https://[^\s]+)\n',t,re.M))
for i,m in enumerate(starts):documents.append((m[1],t[m.end():starts[i+1].start() if i+1<len(starts) else len(t)]))
out=[];rejected=[]
for url,txt in documents:
 heads=list(re.finditer(r'^(?:#{1,6}\s*)?(GEFORCE[^\n]+|GeForce[^\n]+)\s*$',txt,re.M))
 for i,h in enumerate(heads):
  model=re.sub(r'\bTM\b','',h[1]);model=re.sub(r'\s+',' ',model).strip();body=txt[h.end():heads[i+1].start() if i+1<len(heads) else len(txt)]
  memories=re.findall(r'(\d+)GB\s+(GDDR\dX?)\s+(\d+(?:\.\d+)?)\s*Gbps\s+(\d+)-bit',body,re.I)
  boost=re.findall(r'(\d+)\s*MHz Boost',body,re.I)
  if len(memories)!=1 or len(boost)!=1 or not re.match(r'\s*Features\b',body):rejected.append({'model':model,'reason':'catalog_layout_block_not_unambiguous','url':url});continue
  mem,typ,speed,bus=memories[0];port=re.search(r'^([^\n]*(?:DisplayPort|HDMI|DVI)[^\n]*)$',body,re.M);cores=re.search(r'\n\s*(\d{3,5})\s*\n\s*\d+\s*MHz Boost',body)
  values={'Modèle constructeur (MPN non publié dans ce document)':model,'Mémoire vidéo':mem+' Go '+typ,'Vitesse mémoire':speed+' Gbit/s','Bus mémoire':bus+' bits','Fréquence boost':boost[0]+' MHz'}
  if port:values['Sorties vidéo']=port[1].strip()
  if cores:values['Cœurs CUDA']=cores[1]
  features=body.split('Features',1)[1];features=re.sub(r'^\s*CUDA Cores Speed Memory Display Connectors\s*','',features);features=re.split(r'\n\s*\d{3,5}\s*\n',features,1)[0] if cores else ''
  if features:values['Refroidissement / équipement publié']=re.sub(r'\s+',' ',features).strip()
  # A chip-only header does not define a commercial cooler/OC variant.
  tail=re.sub(r'^(?:GEFORCE|GeForce)\s*(?:RTX|GTX)[™®]?\s*\d+(?:\s*(?:Ti|SUPER|\d+GB))*\s*','',model,flags=re.I)
  if not tail:continue
  out.append({'brand':'Zotac','model':model,'mpn':'','identityKind':'manufacturer-model','capacityGB':int(mem),'values':values,'patch':{'capacityGB':int(mem)},'notes':['Nom de modèle et variante publiés dans le catalogue Zotac. Le document ne fournit pas de référence commerciale ZT-… ni de dimensions ; aucun SKU ni prix n’est déduit.'],'source':{'brand':'Zotac','url':url,'requestedURL':url,'kind':'manufacturer-catalog','checkedAt':datetime.datetime.fromtimestamp((D/'indexes/exa-zotac-catalogs.json').stat().st_mtime,datetime.timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z'),'sha256':hashlib.sha256(txt.encode()).hexdigest(),'digestScope':'exa-extracted-catalog-text','status':200,'contentFile':'data/deep-review/gpu/indexes/exa-zotac-catalogs.json'}})
# Official product index explicitly joins a full variant name to a commercial SKU.
# Corroborate capacity and full suffixes before enriching catalog blocks.
indexfile=D/'indexes/exa-index-v2.json'
indexdoc=json.load(open(indexfile));indextext='\n'.join(c.get('text','') for c in indexdoc.get('content',[]) if c.get('type')=='text')
indextext=indextext.split('# Product∣PowerColor')[0]
indexurl='https://www.zotac.com/product/graphics_card/all'
indexdate=datetime.datetime.fromtimestamp(indexfile.stat().st_mtime,datetime.timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z')
def modelkey(name,capacity):
 name=re.sub(r'\b(?:ZOTAC|GAMING|GEFORCE|EDITION)\b',' ',name,flags=re.I)
 name=re.sub(r'\b'+str(int(capacity))+r'GB\b',' ',name,flags=re.I)
 return sorted(re.findall(r'[a-z]+|\d+',name.lower()))
starts=list(re.finditer(r'^ZOTAC GAMING ([^\n]+)\n',indextext,re.M))
for i,m in enumerate(starts):
 body=indextext[m.end():starts[i+1].start() if i+1<len(starts) else len(indextext)]
 sku=re.search(r'^ZT-[A-Z0-9-]+$',body,re.M);memory=re.search(r'(\d+)GB (GDDR\dX?) / (\d+(?:\.\d+)?) Gbps / (\d+)-bit',body);boost=re.search(r'- (\d+) MHz',body);cores=re.search(r'- (\d+) Cores',body)
 if not all([sku,memory,boost,cores]):continue
 cap=int(memory[1]);model=m[1].strip();values={'Modèle constructeur':model,'Référence fabricant':sku[0],'Mémoire vidéo':memory[1]+' Go '+memory[2],'Vitesse mémoire':memory[3]+' Gbit/s','Bus mémoire':memory[4]+' bits','Fréquence boost':boost[1]+' MHz','Cœurs CUDA':cores[1]}
 source={'brand':'Zotac','url':indexurl,'requestedURL':indexurl,'kind':'manufacturer-index','checkedAt':indexdate,'sha256':hashlib.sha256(indextext.encode()).hexdigest(),'digestScope':'exa-extracted-index-text','status':200,'contentFile':'data/deep-review/gpu/indexes/exa-index-v2.json'}
 matched=False
 for r in out:
  if r['capacityGB']==cap and modelkey(r['model'],cap)==modelkey(model,cap) and r['values']['Fréquence boost']==boost[1]+' MHz':
   r['mpn']=sku[0];r['identityKind']='mpn';r['identitySource']={'name':'Zotac — index officiel avec référence ZT explicite','url':indexurl,'checkedAt':indexdate,'kind':'manufacturer'};r['values']['Référence fabricant']=sku[0];r['notes']=['Référence commerciale ZT publiée dans l’index officiel et liée au catalogue par le modèle complet, sa capacité et sa fréquence boost. Les dimensions absentes du catalogue restent inconnues.'];matched=True
 if not matched:out.append({'brand':'Zotac','model':model,'mpn':sku[0],'identityKind':'mpn','capacityGB':cap,'values':values,'patch':{'capacityGB':cap},'notes':['Référence et caractéristiques explicitement publiées pour ce modèle dans l’index officiel Zotac ; les dimensions, la consommation et les connecteurs d’alimentation ne sont pas déduits.'],'source':source})
(D/'zotac-model-facts.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));(D/'zotac-catalog-rejected-blocks.json').write_text(json.dumps(rejected,ensure_ascii=False,indent=2));print('Unambiguous manufacturer model blocks:',len(out),'with explicit ZT SKU:',sum(bool(r['mpn']) for r in out))
