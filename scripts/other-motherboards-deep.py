"""Native official MAXSUN specification grid and Colorful public product API."""
import runpy,pathlib,json,gzip,re,collections,concurrent.futures,hashlib
C=runpy.run_path(str(pathlib.Path(__file__).with_name('deep-motherboard-core.py')));globals().update({k:v for k,v in C.items() if not k.startswith('__')})
D=DATA/'other';D.mkdir(parents=True,exist_ok=True)
INPUT=[x for x in json.load(gzip.open(DATA/'input.json.gz','rt')) if x['component']['brand'] in ('MAXSUN','Colorful')]
MAXLABEL={'CHIPSET':'Chipset','CPU (Max Support)':'CPU','CPU Support':'CPU','CPU Socket':'CPU','MEMORY':'Memory','Memory':'Memory','Memory Support':'Memory','ONBOARD GRAPHICS':'Graphics','EXPANSION SLOT':'Expansion Slots','Expansion Slots':'Expansion Slots','STORAGE':'Storage','Storage Interface':'Storage','SSD':'SSD additional statement','AUDIO':'Audio','Audio':'Audio','INTERNAL I/O':'Internal IO','BACK PANEL PORTS':'BACK PANEL PORTS','FORM FACTOR':'Form Factor','Motherboard Type':'Form Factor','Motherboard Size':'Dimensions','OPERATING SYSTEM':'Operating System','LAN':'LAN','BIOS':'BIOS'}
COLORLABEL={'芯片组':'Chipset','CPU支持':'CPU','内存支持':'Memory','扩展插槽':'Expansion Slots','存储接口':'Storage','板载网卡':'LAN','板载声卡':'Audio','系统BIOS':'BIOS','主板规格':'Form Factor','扩展接口':'I/O connections','硬件监控':'Hardware monitoring','电源管理':'Power management','主板系列':'Product family','显卡支持':'Graphics card support','全新技术':'Features','多重图形显示':'Multiple graphics','CPU':'CPU','Memory':'Memory','Storage':'Storage','On board Audio':'Audio','Onboard Audio':'Audio','Onboard LAN':'LAN','Form factor':'Form Factor','BIOS':'BIOS'}
COLORLABEL.update({'Processor':'CPU','SATA Ports':'Storage','Configuration':'Form Factor','Board I/O':'I/O connections'})
def candidates(c):
 f=DATA/'additional-searches'/(c['id']+'.json');search=json.loads(f.read_text()) if f.exists() else {};urls=re.findall(r'^URL:\s*(\S+)', '\n'.join(b.get('text','') for b in search.get('result',{}).get('content',[])),re.M)
 selected=[u for u in urls if (c['brand']=='MAXSUN' and 'www.maxsun.com/products/' in u) or (c['brand']=='Colorful' and urllib.parse.urlparse(u).hostname in ('www.colorful.cn','en.colorful.cn','test.colorful.cn','www.colorfulgroup.com'))]
 # Official global site migrated hostnames. IDs remain candidates until API Model is exact.
 for u in list(selected):
  if urllib.parse.urlparse(u).hostname=='en.colorful.cn':selected.append(u.replace('en.colorful.cn','www.colorfulgroup.com').replace('/kr/home/','/en/home/'))
 return selected
def collect(item):
 c=item['component'];id=c['id'];attempts=[];product=None;photos=[];model=None
 for i,u in enumerate(candidates(c)):
  meta,s=fetch(u,D/'pages'/(id+'-'+str(i)));dom=DOM(s).root
  if meta['status']!='fetched':attempts.append(meta);continue
  rows={};photos=[];model=None
  if c['brand']=='MAXSUN':
   h=dom.find(lambda n:n.tag=='h1');model=h.text() if h else '';grid=dom.find(lambda n:n.cls('ztcanshugrid'))
   if norm(re.sub(r'^MS-','',model))!=norm(c['name']):attempts.append({'source':meta,'state':'model_or_revision_mismatch','actualModel':model});continue
   if grid:
    for n in grid.walk():
     cells=[x for x in n.children if isinstance(x,Node) and x.tag=='li']
     if n.tag=='ul' and len(cells)==2:rows[MAXLABEL.get(cells[0].text(),cells[0].text())]=cells[1].text()
   photos=[urllib.parse.urljoin(u,n.attrs['content']) for n in dom.walk() if n.tag=='meta' and n.attrs.get('property')=='og:image']
   primary={'name':'MAXSUN — spécifications officielles du modèle','url':meta['resolvedURL'],'checkedAt':meta['checkedAt'],'kind':'manufacturer'}
  else:
   pid=re.search(r"var id\s*=\s*['\"]([^'\"]+)",s);mid=re.search(r"var modelid\s*=\s*['\"]([^'\"]+)",s);route=re.search(r'url:\s*["\']([^"\']*GetAttrbuteValue\?mid=)',s,re.I)
   if not pid or not mid or not route:attempts.append({'source':meta,'state':'public_api_route_unavailable'});continue
   api=urllib.parse.urljoin(u,route[1]+mid[1]+'&id='+pid[1]);am,body=fetch(api,D/'api'/(id+'-'+str(i)))
   if am['status']=='unavailable' and '503' in am.get('error',''):am,body=fetch(api,D/'api'/(id+'-'+str(i)+'-retry'))
   attempts.append({'source':meta,'api':am})
   try:values=json.loads(body)
   except ValueError:continue
   if not isinstance(values,list):continue
   modelrows=[v for v in values if v.get('title') in ('Model','产品型号') and norm(v.get('content',''))==norm(c['name'])]
   if len(modelrows)!=1:attempts[-1]['state']='api_model_unconfirmed';attempts[-1]['models']=[v.get('content') for v in values if v.get('title') in ('Model','产品型号')];continue
   model=modelrows[0]['content'];typeid=modelrows[0].get('typeid');selected=[v for v in values if v.get('typeid')==typeid]
   for v in selected:
    k,vv=v.get('title',''),DOM(v.get('content','')).root.text()
    if k in ('Product image','产品图片'):
     photos.append(urllib.parse.urljoin(u,vv));continue
    if k not in ('Model','产品型号') and vv:rows[COLORLABEL.get(k,k)]=vv
   if rows.get('I/O connections'):
    io=rows['I/O connections'];spl=re.split(r'板载插针[：:]|板载接口[：:]|On board:',io,maxsplit=1,flags=re.I)
    if len(spl)==2:rows['BACK PANEL PORTS']=spl[0];rows['Internal IO']=spl[1]
   primary={'name':'Colorful — API publique de spécifications du modèle exact','url':api,'checkedAt':am['checkedAt'],'kind':'manufacturer'}
  if not rows.get('CPU') or not rows.get('Memory'):attempts.append({'source':meta,'state':'technical_sections_missing','sections':list(rows)});continue
  product=make_product(c,item['review'],rows,primary,photos);product['manufacturerModel']=model
  if c['brand']=='Colorful':
   product['sources'].append({'name':'Colorful — fiche produit associée à l’API','url':meta['resolvedURL'],'checkedAt':meta['checkedAt'],'kind':'manufacturer'})
   mem=rows.get('Memory','')
   for field,pattern,fk in [('memorySlots',r'(\d+)个内存条?插槽','memorySlots'),('maxMemoryGB',r'总内存容量最大支持\s*(\d+)\s*GB','memoryCapacity'),('maxMemoryPerSlotGB',r'单根内存最大支持\s*(\d+)\s*GB','memoryPerSlot')]:
    m=re.search(pattern,mem,re.I)
    if m:product['patch'][field]=int(m[1]);product['fieldEvidence'][fk]={'value':int(m[1]),'sourceURL':primary['url'],'checkedAt':primary['checkedAt']}
  product['notes'].append('Texte fabricant conservé avec ses restrictions. Les images proviennent du modèle dans le catalogue officiel ; aucune inspection photographique de fidélité n’est supposée.')
  attempts.append({'source':meta,'state':'exact_manufacturer_table','actualModel':model,'sections':list(rows)});break
 r={'id':id,'name':c['name'],'state':'exact_manufacturer_table' if product else 'primary_unconfirmed','manufacturerModel':model,'attempts':attempts,'photos':photos if product else []};(D/'records').mkdir(exist_ok=True);(D/'records'/(id+'.json')).write_text(json.dumps({'review':r,'product':product},ensure_ascii=False,indent=2));return r,product
def main():
 out={};reviews=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
  for r,p in pool.map(collect,INPUT):
   reviews.append(r)
   if p:out[r['id']]=p
   print(r['name'],r['state'],flush=True)
 (D/'review.json').write_text(json.dumps({'summary':dict(collections.Counter(x['state'] for x in reviews)),'records':reviews},ensure_ascii=False,indent=2));(ROOT/'src/data/deepOtherMotherboards.ts').write_text('// Generated from native MAXSUN/Colorful official specification sources.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const deepOtherMotherboardProducts:Record<string,VerifiedProduct> = '+json.dumps(out,ensure_ascii=False,indent=2)+';\n');print('Other',len(out))
if __name__=='__main__':main()
