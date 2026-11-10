"""Exact per-capacity official SSD tables; no cross-capacity or heatsink inheritance."""
import pathlib,runpy,json,re,hashlib,collections,concurrent.futures,html
C=runpy.run_path(str(pathlib.Path(__file__).with_name('deep-motherboard-core.py')));globals().update({k:v for k,v in C.items() if not k.startswith('__')})
D=ROOT/'data/deep-review/storage-boards';INPUT=json.load(open(D/'input.json'));SEARCHES={}
for f in (D/'searches').glob('*.json'):
 x=json.load(open(f))
 for id in x['ids']:SEARCHES[id]=x
def family(c):return re.split(r'\s+\d+(?:\.\d+)?\s+(?:Go|To)',c['name'])[0]
def capacity(s):
 m=re.fullmatch(r'\s*(\d+(?:\.\d+)?)\s*(GB|TB|Go|To)\s*(?:\(\s*\d+\s*GB\s*\))?\s*',s,re.I)
 return int(float(m[1])*(1000 if m[2].lower() in ('tb','to') else 1)) if m else None
def normmodel(s,brand):
 s=s.replace('™','').replace('®','')
 if brand=='MSI':s=re.sub(r'PCIe\s*(?:Gen)?\s*[345](?:\.0)?\s*(?:x4)?\s*NVMe\s*M\.2','',s,flags=re.I)
 if brand=='Gigabyte':s=re.sub(r'^GIGABYTE\s+','',s,flags=re.I);s=re.sub(r'\bSSD\b','',s,flags=re.I);s=re.sub(r'\bPrem\.(?=\s|$)','Premium',s,flags=re.I)
 return norm(s)
def textvalue(s):return DOM(html.unescape(s)).root.text() if '<' in html.unescape(s) else s
def msi_columns(s):
 dom=DOM(s).root;matrix={};headings=[]
 for n in dom.walk():
  if n.tag!='tr':continue
  cells=[x for x in n.children if isinstance(x,Node) and x.tag in ('th','td')]
  if len(cells)>1:
   key=cells[0].text();values=[textvalue(x.text()) for x in cells[1:]]
   if key=='Differences are marked in red':headings=values
   else:matrix[key]=values
 count=len(matrix.get('Capacity',[]));columns=[]
 for i in range(count):
  if any(len(values)!=count for values in matrix.values()):return []
  columns.append({'header':headings[i] if len(headings)==count else '', 'rows':{k:v[i] for k,v in matrix.items()}})
 return columns
def gigabyte_rows(s):
 rows={};dom=DOM(s).root
 for n in dom.walk():
  if n.tag=='ul' and n.cls('spec-item-list'):
   k=n.find(lambda x:x.tag=='li' and x.cls('spec-title'));v=n.find(lambda x:x.tag=='li' and x.cls('spec-desc'))
   if k and v and v.text():rows.setdefault(k.text(),v.text())
 return rows
def published_images(s,model):
 dom=DOM(s).root;images=[]
 for n in dom.walk():
  if n.tag=='meta' and n.attrs.get('property')=='og:image' and n.attrs.get('content','').startswith('https://'):images.append(n.attrs['content'])
 m=re.search(r'<script[^>]*id="__NUXT_DATA__"[^>]*>(.*?)</script>',s,re.S)
 if m:
  try:
   data=json.loads(m[1])
   for e in data:
    if isinstance(e,dict) and 'modelName' in e and 'image' in e and isinstance(e['modelName'],int) and norm(data[e['modelName']])==norm(model):
     image=data[e['image']] if isinstance(e['image'],int) else e['image']
     if isinstance(image,str) and image.startswith('https://'):images.append(image)
  except (ValueError,IndexError,TypeError):pass
 return list(dict.fromkeys(images))
def urls_for(c):
 x=SEARCHES[c['id']];urls=re.findall(r'^URL:\s*(\S+)', '\n'.join(b.get('text','') for b in x['result'].get('content',[])),re.M);selected=[]
 for u in urls:
  if c['brand']=='MSI' and re.search(r'https://[^/]*msi.com/Storage/',u):
   u=u.split('?')[0].rstrip('/');u=u if u.endswith('/Specification') else u+'/Specification';selected.append(u)
  elif c['brand']=='Gigabyte' and re.search(r'https://www.gigabyte.com/SSD/',u):
   u=u.split('?')[0].rstrip('/');u=re.sub(r'/(support|sp)$','',u)+'/sp';selected.append(u)
  elif c['brand']=='ASUS' and 'rog.asus.com/storage/' in u:selected.append(u if u.rstrip('/').endswith('/spec') else u.rstrip('/')+'/spec/')
 return list(dict.fromkeys(selected))
def collect(item):
 c=item['component'];id=c['id'];attempts=[];record=None
 for i,u in enumerate(urls_for(c)):
  key=hashlib.sha256(u.encode()).hexdigest()[:20];meta,s=fetch(u,D/'pages'/key);dom=DOM(s).root;h=dom.find(lambda n:n.tag=='h1');title=h.text() if h else '';attempt={'source':meta,'title':title};attempts.append(attempt)
  if meta['status']!='fetched':continue
  rows={};model='';partNumber=None
  if c['brand']=='MSI':
   actual=normmodel(title,'MSI');wanted=normmodel(family(c),'MSI')
   if actual!=wanted:attempt['state']='model_variant_mismatch';continue
   matches=[x for x in msi_columns(s) if capacity(x['rows'].get('Capacity',''))==c['capacityGB']]
   if len(matches)!=1:attempt['state']='exact_capacity_column_unconfirmed';continue
   rows=matches[0]['rows'];tableModel=normmodel(rows.get('Model Name',''),'MSI')
   if tableModel!=wanted and not (wanted.endswith('ecopack') and tableModel==wanted.removesuffix('ecopack')):attempt['state']='table_model_mismatch';continue
   model=title+' '+rows['Capacity'];attempt['selectedColumn']=matches[0]['header']
  elif c['brand']=='Gigabyte':
   expected=family(c)+' '+(str(c['capacityGB']//1000)+'TB' if c['capacityGB']%1000==0 else str(c['capacityGB'])+'GB')
   if family(c)=='4000E':expected='Gen4 '+expected
   if normmodel(title,'Gigabyte')!=normmodel(expected,'Gigabyte'):attempt['state']='model_variant_mismatch';continue
   rows=gigabyte_rows(s)
   published=capacity(rows.get('Total Capacity',''))
   if published!=c['capacityGB']:
    # This exact capacity's own manufacturer title says 1TB/2TB while its
    # specification says 1024GB/2048GB. Preserve both statements, not a global unit alias.
    if published==c['capacityGB']*1.024 and re.search(r'\b[12]TB$',title):attempt['capacityNomenclatureNote']='La capacité commerciale du titre et la valeur GB du tableau constructeur sont conservées séparément.'
    else:attempt['state']='exact_capacity_unconfirmed';continue
   model=title
  else:
   rows,model,_,images=asus_rows(s)
   model=model or title
   expected='ROG STRIX SQ7 GEN4 SSD 1TB'
   if norm(model)!=norm(expected) or c['capacityGB']!=1000:attempt['state']='model_variant_mismatch';continue
   # The title's exact 1TB is retained as source identity if the table's label differs.
   rows.setdefault('Capacity','1TB')
  if not rows:attempt['state']='technical_table_missing';continue
  record={'id':id,'brand':c['brand'],'manufacturerModel':model,'source':{'name':c['brand']+' — tableau technique officiel, capacité exacte','url':meta['resolvedURL'],'checkedAt':meta['checkedAt'],'kind':'manufacturer'},'receipt':meta,'rows':rows,'images':published_images(s,title),'partNumber':partNumber,'state':'exact_model_and_capacity','attempts':attempts};break
 if not record:record={'id':id,'brand':c['brand'],'name':c['name'],'state':'primary_unconfirmed','attempts':attempts}
 (D/'records').mkdir(exist_ok=True);(D/'records'/(id+'.json')).write_text(json.dumps(record,ensure_ascii=False,indent=2));return record
def main():
 targets=[x for x in INPUT if x['component']['brand'] in ('MSI','Gigabyte','ASUS')];results=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
  for i,r in enumerate(pool.map(collect,targets),1):
   results.append(r)
   if i%10==0 or i==len(targets):print(i,len(targets),dict(collections.Counter(x['state'] for x in results)),flush=True)
 (D/'native-summary.json').write_text(json.dumps({'summary':dict(collections.Counter(x['state'] for x in results)),'records':[{'id':r['id'],'state':r['state'],'model':r.get('manufacturerModel')} for r in results]},ensure_ascii=False,indent=2))
if __name__=='__main__':main()
