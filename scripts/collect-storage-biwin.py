"""Licensed Acer/Predator/HP storage pages: preserve exact capacity-column identity."""
import runpy,pathlib,json,re,gzip,collections
C=runpy.run_path(str(pathlib.Path(__file__).with_name('collect-storage-boards.py')));globals().update({k:v for k,v in C.items() if not k.startswith('__')})
ALIAS={'Max. Sequential Read Speed':'Sequential Read speed','Max. Sequential Write Speed':'Sequential Write speed','Sequential Read Speed (MB/s)':'Sequential Read up to (MB/s)','Sequential Write Speed (MB/s)':'Sequential Write up to (MB/s)','Sequential Read Speed (Up to)':'Sequential Read speed','Sequential Write Speed (Up to)':'Sequential Write speed','Warranty / Support':'Warranty','Warranty Support':'Warranty'}
def webpage_columns(body,brand):
 dom=DOM(body).root;matrix={}
 for n in dom.walk():
  if n.cls('spec-table--row'):
   key=n.find(lambda x:x.cls('spec-table--title'));val=n.find(lambda x:x.cls('spec-table--value'))
   if key and val:matrix[' '.join(key.text().split())]=[x.text() for x in val.children if isinstance(x,Node) and x.tag=='span'] or [val.text()]
  elif n.attrs.get('class')=='item clean':
   key=n.find(lambda x:x.attrs.get('class')=='l fl');val=n.find(lambda x:x.attrs.get('class')=='r fr')
   if key and val:matrix[' '.join(key.text().split())]=[val.text()]
 if 'Capacity' not in matrix:return []
 caps=matrix['Capacity'] if len(matrix['Capacity'])>1 else re.split(r'\s*/\s*',matrix['Capacity'][0]);columns=[]
 for i,cap in enumerate(caps):
  rows={};failed=False
  for key,vals in matrix.items():
   if len(vals)==len(caps):value=vals[i]
   elif len(vals)==1:
    value=vals[0]
    if brand=='Acer' and re.search(r'Speed|Warranty',key):
     comma=re.split(r',\s+',value)
     if len(comma)==len(caps):value=comma[i]
    if brand=='HP' and key not in ('Warranty / Support','Warranty'):
     split=re.split(r'\s*/\s*',value)
     if len(split)==len(caps):value=split[i]
    if key in ('Warranty / Support','Warranty') and brand=='HP':
     lines=[line.strip() for line in value.splitlines() if line.strip()]
     exact=[line for line in lines if re.search(r'\s-\s*'+re.escape(cap).replace(r'\ ',r'\s*')+r'\s*$',line,re.I)]
     if len(exact)==1:value=re.sub(r'\s-\s*[^-]+$','',exact[0]).strip()
     else:
      sequential=re.findall(r'\d+-Year\s*/\s*\d+\s*TBW',value,re.I)
      if len(sequential)==len(caps):value=sequential[i]
      else:failed=True;break
   else:failed=True;break
   rows[ALIAS.get(key,key)]=value
  if not failed:columns.append({'capacityGB':capacity(cap),'rows':rows})
 return columns
def main():
 receipts=[]
 for f in (D/'biwin-sources').glob('*.json'):
  if f.name.endswith('.tables.json'):continue
  m=json.load(open(f));raw=f.with_suffix('.html.gz')
  if '/products/' in m.get('url','') and m.get('status')=='fetched' and raw.exists():receipts.append((m,gzip.open(raw,'rt').read()))
 results=[]
 for item in INPUT:
  c=item['component'];id=c['id']
  if c['brand'] not in ('Acer','HP'):continue
  model=family(c);record=None;attempts=[]
  for meta,body in receipts:
   if 'heatsink' in meta['url']:continue
   dom=DOM(body).root;headings=[n.text() for n in dom.walk() if n.tag in ('h1','h2')];h1=next((n.text() for n in dom.walk() if n.tag=='h1'),'')
   def modelname(s):return norm(re.sub(r'\b(?:HP|Acer|PCIe|PCle|PCIe4\.0|Gen|[345]\.0|4x4|M\.2|SSD)\b','',s,flags=re.I))
   exact=modelname(h1)==norm(model) or (model=='FX700' and len(headings)>1 and headings[1]=='HP FX700 SSD Upgrade for PCs and Laptops')
   if not exact:continue
   columns=webpage_columns(body,c['brand']);selected=[p for p in columns if p['capacityGB']==c['capacityGB']];attempts.append({'source':meta,'title':h1,'publishedCapacities':[p['capacityGB'] for p in columns]})
   if len(selected)!=1:attempts[-1]['state']='exact_capacity_unconfirmed';continue
   rows=selected[0]['rows'];fulltext=dom.text();specstart=re.search(r'\bSpecifications\s+(?:Model Name|Interface)',fulltext);intro=fulltext[:specstart.start()] if specstart else '';images=[n.attrs['content'] for n in dom.walk() if n.tag=='meta' and n.attrs.get('property')=='og:image' and n.attrs.get('content','').startswith('https://')];heat=re.search(r'.{0,120}(?:graphene thermal pad|graphene foam|customized graphene pad).{0,200}',intro,re.I)
   nand=re.search(r'\b3D\s+(?:TLC\s+)?NAND(?:\s+Flash)?\b',intro,re.I)
   if nand:rows['NAND']=nand[0]
   record={'id':id,'brand':c['brand'],'manufacturerModel':h1+' '+rows['Capacity'],'source':{'name':c['brand']+' / BIWIN — fiche officielle, capacité exacte','url':meta['resolvedURL'],'checkedAt':meta['checkedAt'],'kind':'manufacturer'},'receipt':meta,'rows':rows,'images':images,'state':'exact_model_and_capacity','attempts':attempts}
   if heat:record['heatsinkEvidence']={'statement':heat[0].strip()}
   # Product-scoped paragraphs, including the exact graphene-laced foam wording.
   if c['brand']=='Acer':
    paragraphs=[n.text() for n in dom.walk() if n.tag=='p' and re.search(r'graphene(?:-laced)?(?: thermal)? (?:foam |)pad',n.text(),re.I)]
    if paragraphs:record['heatsinkEvidence']={'statement':paragraphs[0]}
   if model=='FX900 Pro' and c['capacityGB']==512:
    pdfmeta=next((json.load(open(f)) for f in (D/'biwin-sources').glob('*.json') if not f.name.endswith('.tables.json') and '20230822/FX900' in json.load(open(f)).get('url','')),None)
    if pdfmeta:
     record['conflictingFields']=['read'];record['additionalSources']=[{'name':'HP / BIWIN — fiche PDF août 2023, valeur différente','url':pdfmeta['url'],'checkedAt':pdfmeta['checkedAt'],'kind':'manufacturer'}];record['additionalGroups']=[{'title':'Divergence entre deux sources HP pour 512 Go','rows':[{'label':'Lecture séquentielle','value':'7 000 Mo/s maximum — page produit actuelle'},{'label':'Lecture séquentielle','value':'7 400 Mo/s maximum — PDF constructeur août 2023'}]}];record['notes']=['La page HP FX900 Pro indique 7 000 Mo/s pour 512 Go, le PDF 2023 indique 7 400 Mo/s. Cette valeur reste signalée comme contradictoire ; elle n’est pas résolue automatiquement.']
   break
  if not record:record={'id':id,'brand':c['brand'],'name':c['name'],'state':'primary_unconfirmed','attempts':attempts}
  (D/'records'/(id+'.json')).write_text(json.dumps(record,ensure_ascii=False,indent=2));results.append(record);print(c['name'],record['state'],flush=True)
 print('BIWIN',dict(collections.Counter(x['state'] for x in results)))
if __name__=='__main__':main()
