"""Exact ECS primary extracts and EVGA official model-specific manual."""
import runpy,pathlib,json,gzip,re,collections,hashlib
C=runpy.run_path(str(pathlib.Path(__file__).with_name('asrock-motherboard-deep.py')));globals().update({k:v for k,v in C.items() if not k.startswith('__')})
D=DATA/'ecs-evga';D.mkdir(parents=True,exist_ok=True)
INPUT=[x for x in json.load(gzip.open(DATA/'input.json.gz','rt')) if x['component']['brand'] in ('ECS','EVGA')]
LABELS_ECS={'CPU':'CPU','CHIPSET':'Chipset','GRAPHICS':'Graphics','MEMORY':'Memory','EXPANSION SLOT':'Expansion Slots','Storage':'Storage','Audio':'Audio','LAN':'LAN','USB':'USB','REAR PANEL I/O':'BACK PANEL PORTS','CONNECTORS & HEADERS':'Internal IO','SYSTEM BIOS':'BIOS','FORM FACTOR':'Form Factor','OS Support':'Operating System','Certifications':'Certifications','Bundled Software':'Bundled Software','Archive Spec(for old product)':'Archive specifications'}
def ecs(item):
 c=item['component'];saved=json.load(open(DATA/'ecs/extracted.json'));text='\n'.join(b.get('text','') for b in saved['result'].get('content',[]));parts=re.split(r'(?=^# [^\n]*｜Motherboard)',text,flags=re.M);part=next((p for p in parts if re.search(r'^# '+re.escape(c['name'])+r'\s*$',p,re.M)),None)
 if not part:return None,{'state':'exact_revision_unconfirmed','reason':'The official A320AM4-M3D document identifies V1.0A; the archive omits its revision.'}
 url=re.search(r'^URL:\s*(\S+)',part,re.M)[1];heads=list(re.finditer(r'^('+'|'.join(re.escape(k) for k in LABELS_ECS)+r')\s*$',part,re.M));rows={LABELS_ECS[h[1]]:part[h.end():heads[i+1].start() if i+1<len(heads) else len(part)].strip() for i,h in enumerate(heads)};source={'name':'ECS — fiche technique officielle','url':url,'checkedAt':saved['fetchedAt'],'kind':'manufacturer'};p=make_product(c,item['review'],rows,source)
 def fact(k,v):p['fieldEvidence'][k]={'value':v,'sourceURL':url,'checkedAt':source['checkedAt']}
 mem=rows['Memory'];slots=re.search(r'(\d+)\s*X\s*288-pin\s*DDR4 DIMM socket',mem,re.I);cap=re.search(r'Support up to\s*(\d+)\s*GB',mem,re.I)
 if slots:p['patch']['memorySlots']=int(slots[1]);fact('memorySlots',int(slots[1]))
 if cap:p['patch']['maxMemoryGB']=int(cap[1]);fact('memoryCapacity',int(cap[1]))
 storage=rows['Expansion Slots'];ssd=re.search(r'(\d+)\s*X\s*M\.2 slot for SSD\s*∟\s*([^\n]+)',storage,re.I)
 if ssd and int(ssd[1])==1:
  n=1 if re.search(r'PCIE',ssd[2],re.I) else 0 if re.search(r'^For 2280 SATA SSD$',ssd[2]) else None
  if n is not None:p['patch']['m2Slots']=n;fact('m2',n)
 dims=re.search(r'(\d+)mm\(W\)\s*x\s*(\d+)mm\(H\)',rows.get('Form Factor',''))
 if dims:p['patch'].update(widthMm=int(dims[1]),heightMm=int(dims[2]));fact('boardDimensions',rows['Form Factor'])
 p['notes'].append('Le socket M.2 WLAN ne constitue pas un emplacement SSD. ECS décrit le M.2 du B450AM4-M pour SSD SATA uniquement ; il ne compte pas comme NVMe.')
 return p,{'state':'exact_manufacturer_table','source':source,'contentSHA256':hashlib.sha256(part.encode()).hexdigest(),'specificationExcerpt':part}
def evga(item):
 c=item['component'];meta=json.load(open(DATA/'evga/manual.json'));text=gzip.open(DATA/'evga/manual.txt.gz','rt').read();pages=text.split('\f');spec='\n'.join(pages[5:7]);heads=list(re.finditer(r'\uf071\s*([^:\n]+):',spec));rows={}
 alias={'Size':'Form Factor','Microprocessor support':'CPU','Operating Systems':'Operating System','System Memory support':'Memory','SATA Ports':'Storage','Onboard LAN':'LAN','Onboard Audio':'Audio','PCI-Express Expansion Slots':'Expansion Slots'}
 for i,h in enumerate(heads):rows[alias.get(h[1].strip(),h[1].strip())]=re.sub(r'EVGA X570 FTW WIFI \(121-VR-A577\)|-\d+-','',spec[h.end():heads[i+1].start() if i+1<len(heads) else len(spec)]).strip()
 if not text.startswith('EVGA X570 FTW WIFI (121-VR-A577)'):return None,{'state':'manual_model_unconfirmed'}
 support=next((json.load(open(f)) for f in (DATA/'evga/pages').glob('*.json') if json.load(open(f))['url']=='https://www.evga.com/support/motherboard/'),None)
 supportbody=gzip.open(DATA/'evga/pages/import-mb-f288a865066c-1.html.gz','rt').read()
 if 'EVGA X570 FTW WIFI (121-VR-A577-KR)' not in DOM(supportbody).root.text():return None,{'state':'commercial_part_number_unconfirmed'}
 source={'name':'EVGA — manuel X570 FTW WIFI','url':meta['url'],'checkedAt':meta['checkedAt'],'kind':'manufacturer'};p=make_product(c,item['review'],rows,source);p.update(identityKind='mpn',manufacturerModel='X570 FTW WIFI',mpn='121-VR-A577-KR');p['patch']['manufacturerPartNumber']=p['mpn'];p['sources'].append({'name':'EVGA — liste officielle CPU et mémoire par référence','url':support['url'],'checkedAt':support['checkedAt'],'kind':'manufacturer'});p['identityNote']='Le manuel 121-VR-A577 décrit X570 FTW WIFI ; la liste officielle EVGA confirme la référence de vente 121-VR-A577-KR.'
 p['patch'].update(socket='AM4',memoryType='DDR4',maxMemoryGB=128,heightMm=305,widthMm=243.8,memorySlots=4,m2Slots=2)
 for k,v in {'socket':'AM4','memoryType':'DDR4','memoryCapacity':128,'memorySlots':4,'m2':2,'boardDimensions':rows['Form Factor'],'chipset':'AMD X570'}.items():p['fieldEvidence'][k]={'value':v,'sourceURL':source['url'],'checkedAt':source['checkedAt']}
 p['groups'].append({'title':'EVGA — installation mémoire, page 25','rows':[{'label':'Emplacements mémoire','value':pages[24].split('Use the following procedure')[0].strip()}]})
 p['groups'].append({'title':'EVGA — emplacements PCIe/M.2 et partage de lignes','rows':[{'label':'PCIe et stockage, page 22','value':pages[21]}]});p['notes'].append('Le manuel décrit deux sockets M.2 Key-M PCIe et un Key-E sans fil. Les limites de génération dépendent du CPU.')
 return p,{'state':'exact_manufacturer_sku_and_manual','source':meta,'identityExcerpt':text[:170],'specificationExcerpt':spec,'slotExcerpt':pages[21]}
out={};reviews=[]
for item in INPUT:
 p,r=ecs(item) if item['component']['brand']=='ECS' else evga(item);r.update(id=item['component']['id'],name=item['component']['name']);reviews.append(r)
 if p:out[r['id']]=p
 (D/'records').mkdir(exist_ok=True);(D/'records'/(r['id']+'.json')).write_text(json.dumps({'review':r,'product':p},ensure_ascii=False,indent=2))
(D/'review.json').write_text(json.dumps({'summary':dict(collections.Counter(x['state'] for x in reviews)),'records':reviews},ensure_ascii=False,indent=2));(ROOT/'src/data/deepEcsEvgaMotherboards.ts').write_text('// Generated from official ECS and EVGA source documents.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const deepEcsEvgaMotherboardProducts:Record<string,VerifiedProduct> = '+json.dumps(out,ensure_ascii=False,indent=2)+';\n');print('ECS/EVGA',len(out))
