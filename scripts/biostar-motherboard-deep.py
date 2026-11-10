"""BIOSTAR native public catalogue and revision-specific technical tables."""
import runpy,pathlib,json,gzip,re,collections,concurrent.futures,urllib.parse,copy
C=runpy.run_path(str(pathlib.Path(__file__).with_name('deep-motherboard-core.py')));globals().update({k:v for k,v in C.items() if not k.startswith('__')})
D=DATA/'biostar';D.mkdir(parents=True,exist_ok=True);BASE='https://www.biostar.com.tw/app/en/mb/'
INPUT=[x for x in json.load(gzip.open(DATA/'input.json.gz','rt')) if x['component']['brand']=='Biostar']
def modelkey(s):return norm(re.sub(r'^RACING\s+','',s,flags=re.I))
def catalogue():
 path=D/'catalog.html.gz'
 if not path.exists():
  params={'product_name':json.dumps(['VALKYRIE','RACING','SILVER','Motherboard']),'product_group':json.dumps(['s_category']*4)};req=urllib.request.Request(BASE+'_product_list.php',data=urllib.parse.urlencode(params).encode(),headers={'User-Agent':'Mozilla/5.0'});res=urllib.request.urlopen(req,timeout=30);path.write_bytes(gzip.compress(res.read()))
 dom=DOM(gzip.decompress(path.read_bytes()).decode()).root
 return {modelkey(n.attrs['mbname']):{'sid':n.attrs['mbid'],'name':n.attrs['mbname']} for n in dom.walk() if n.attrs.get('mbname') and n.attrs.get('mbid')}
MAP=catalogue();EXTRA=D/'extra-models.json'
if EXTRA.exists():MAP.update(json.loads(EXTRA.read_text()))
ALIASES={'CPU SUPPORT':'CPU','MEMORY':'Memory','INTEGRATED VIDEO':'Graphics','STORAGE':'Storage','LAN':'LAN','AUDIO CODEC':'Audio','EXPANSION SLOT':'Expansion Slots','REAR I/O':'BACK PANEL PORTS','INTERNAL I/O':'Internal IO','DIMENSION':'Form Factor','OS SUPPORT':'Operating System'}
def page(sid,expected):
 meta,s=fetch(BASE+'introduction.php?S_ID='+str(sid),D/'pages'/('intro-'+str(sid)));dom=DOM(s).root
 route=dom.find(lambda n:n.attrs.get('data-type')=='SPECIFICATIONS' and n.attrs.get('route'))
 if not route:return None,{'sid':sid,'state':'specification_route_unavailable','source':meta}
 url=urllib.parse.urljoin(BASE,route.attrs['route']);sm,ss=fetch(url,D/'pages'/('spec-'+str(sid)));table=DOM(ss).root;rows={};model=''
 for n in table.walk():
  if n.tag=='tr':
   cells=[x for x in n.children if isinstance(x,Node) and x.tag in ('td','th')]
   if len(cells)==1 and cells[0].tag=='th':model=cells[0].text()
   elif len(cells)==2:rows[ALIASES.get(cells[0].text(),cells[0].text())]=cells[1].text()
 if modelkey(model)!=modelkey(expected):return None,{'sid':sid,'state':'model_mismatch','model':model,'expected':expected,'source':sm}
 versions=[]
 for n in dom.walk():
  if n.tag=='a' and re.fullmatch(r'\d+(?:\.\d+)+',n.text()) and (m:=re.search(r'introduction.php\?S_ID=(\d+)',n.attrs.get('href',''))):versions.append({'sid':m.group(1),'version':n.text()})
 images=[urllib.parse.urljoin(BASE,n.attrs['href']) for n in dom.walk() if n.tag=='a' and n.attrs.get('data-fancybox')=='gallery' and '/upload/Motherboard/' in n.attrs.get('href','')]
 version=re.search(r'Ver\.\s*(\d+(?:\.\d+)+)',urllib.parse.unquote(s),re.I)
 return {'model':model,'revision':version.group(1) if version else None,'rows':rows,'source':{'name':'BIOSTAR — spécifications officielles','url':sm['resolvedURL'],'checkedAt':sm['checkedAt'],'kind':'manufacturer'},'intro':meta,'photos':list(dict.fromkeys(images)),'versions':versions},{'sid':sid,'state':'exact_manufacturer_table'}
def collect(item):
 c=item['component'];id=c['id'];candidate=MAP.get(modelkey(c['name']));variants=[];attempts=[]
 if candidate:
  first,review=page(candidate['sid'],candidate['name']);attempts.append(review)
  if first:
   variants.append(first)
   for v in first['versions']:
    if str(v['sid'])==str(candidate['sid']):continue
    record,status=page(v['sid'],candidate['name']);attempts.append(status)
    if record:variants.append(record)
 products=[]
 for v in variants:
  p=make_product(c,item['review'],v['rows'],v['source'],v['photos']);p['groups'][0]['title']='BIOSTAR '+v['model']+(' — révision '+v['revision'] if v['revision'] else ' — révision non indiquée')
  m=re.search(r'(?:Max\.?\s*Supports?\s*up\s*to|Support\s*up\s*to)\s*(\d+)\s*(?:GB|G)\b',v['rows'].get('Memory',''),re.I)
  if m:p['patch']['maxMemoryGB']=int(m.group(1));p['fieldEvidence']['memoryCapacity']={'value':int(m.group(1)),'sourceURL':v['source']['url'],'checkedAt':v['source']['checkedAt']}
  dims=v['rows'].get('Form Factor','');m=re.search(r'(\d+(?:\.\d+)?)\s*cm\s*x\s*(\d+(?:\.\d+)?)\s*cm\s*\(\s*W\s*x\s*L\s*\)',dims,re.I)
  if m:p['patch'].update(widthMm=round(float(m.group(1))*10,2),heightMm=round(float(m.group(2))*10,2))
  else:
   p['patch'].pop('heightMm',None);p['patch'].pop('widthMm',None)
  products.append(p)
 product=None;cleared=[]
 if products:
  product=copy.deepcopy(products[0]);source_by_url={x['url']:x for p in products for x in p['sources']};product['sources']=list(source_by_url.values());product['groups']=[g for p in products for g in p['groups']];product['notes'].append('L’archive ne précise pas de révision de PCB. Les versions officiellement accessibles restent identifiées séparément ; seuls les faits communs sont projetés dans les métadonnées.')
  if len(products)>1:
   for k in list(product['patch']):
    if any(p['patch'].get(k)!=product['patch'][k] for p in products[1:]):product['patch'].pop(k);cleared.append(k)
   for k in list(product['fieldEvidence']):
    if any(p['fieldEvidence'].get(k,{}).get('value')!=product['fieldEvidence'][k]['value'] for p in products[1:]):product['fieldEvidence'].pop(k)
 state='manufacturer_revision_tables' if product else 'primary_unconfirmed';record={'id':id,'name':c['name'],'state':state,'clearedAmbiguousFields':cleared,'revisions':[{'revision':v['revision'],'source':v['source'],'photos':v['photos'],'sections':list(v['rows'])} for v in variants],'attempts':attempts}
 (D/'records').mkdir(exist_ok=True);(D/'records'/(id+'.json')).write_text(json.dumps({'review':record,'product':product},ensure_ascii=False,indent=2));return record,product
out={};reviews=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for i,(r,p) in enumerate(pool.map(collect,INPUT),1):
  reviews.append(r)
  if p:out[r['id']]=p
  if i%20==0 or i==len(INPUT):print('Biostar',i,len(INPUT),'confirmed',len(out),flush=True)
(D/'review.json').write_text(json.dumps({'summary':dict(collections.Counter(x['state'] for x in reviews)),'records':reviews},ensure_ascii=False,indent=2))
(ROOT/'src/data/deepBiostarMotherboards.ts').write_text('// Generated by scripts/biostar-motherboard-deep.py.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const deepBiostarMotherboardProducts:Record<string,VerifiedProduct> = '+json.dumps(out,ensure_ascii=False,indent=2)+';\n')
with (ROOT/'src/data/deepBiostarMotherboards.ts').open('a') as target:
 for r in reviews:
  for field in r.get('clearedAmbiguousFields',[]):target.write(f'deepBiostarMotherboardProducts["{r["id"]}"].patch.{field} = undefined;\n')
