"""Join exact Corsair product identities and its official SKU endurance table.
Marketing family maximum speeds are intentionally not transposed to each capacity.
"""
from pathlib import Path
import gzip,html,json,re
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/memory-storage'
def clean(x):return html.unescape(re.sub(r'\s+',' ',re.sub('<[^>]+>',' ',x))).strip()
identities={}
for f in sorted((OUT/'corsair-pages').glob('*.html.gz')):
 s=gzip.decompress(f.read_bytes()).decode();m=re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',s,re.S)
 if not m:continue
 try:page=json.loads(m[1])['props']['pageProps'];items=page['productData']['productDetail']['items']
 except (KeyError,TypeError):continue
 for item in items:
  if not item['sku'].startswith('CSSD'):continue
  for v in [item]+[v['product'] for v in item.get('variants',[]) if v.get('product')]:
   if not v.get('sku'):continue
   if v['sku'] in identities and v['sku']!=item['sku']:continue
   url='https://www.corsair.com/us/en/p/data-storage/'+v['sku'].lower()+'/'+v['url_key'];meta=json.loads(f.with_suffix('').with_suffix('.json').read_text())
   text=clean(str(v.get('description',''))+' '+str(v.get('short_description','')))
   if v['sku']==item['sku']:
    for entry in page.get('productDataContentful',{}).get('contentJson',[]):
     if entry.get('identifier')==v['sku']:
      cms=json.loads(entry['entries']);text+=' '+clean(json.dumps(cms.get('tabs',[]),ensure_ascii=False))
   identities[v['sku']]={'mpn':v['sku'],'name':v['name'],'url':url,'source':meta,'images':[x['url'] for x in v.get('media_gallery',[]) if x.get('url')],'text':text}
(OUT/'corsair-storage-identities.json').write_text(json.dumps(identities,ensure_ascii=False,indent=2)+'\n')
doc=json.loads((OUT/'corsair-ssd-endurance.json').read_text());text='\n'.join(x.get('text','') for x in doc['response']['content']);url='https://help.corsair.com/hc/en-us/articles/360060189152-SSD-What-are-the-endurance-ratings-for-Corsair-SSDs';table={}
for line in text[text.find('URL: '+url):].splitlines():
 cells=[s.strip() for s in line.strip('|').split('|')]
 if len(cells)==5 and re.fullmatch(r'CSSD-[A-Z0-9]+',cells[1]):table[cells[1]]=cells
records=[]
for mpn in sorted(set(identities)|set(table)):
 identity=identities.get(mpn);row=table.get(mpn)
 name=identity['name'] if identity else row[0]+' '+row[2]
 if not re.search(r'\bMP[67]00\b',name):continue
 cap=re.search(r'\b(\d+(?:\.\d+)?)\s*(TB|GB)\b',name)
 if not cap:continue
 capacity=int(float(cap[1])*(1000 if cap[2]=='TB' else 1))
 family=name[:cap.start()].strip().replace('®','').replace('™','')
 family=re.sub(r'^Force Series Gen\.4 PCIe MP600$','MP600',family)
 # Cooling is part of identity. The official SKU table explicitly spells out editions.
 if 'MP700 PRO SE' in family:
  family='MP700 PRO SE with Air Cooler' if 'Air Cooler' in name else 'MP700 PRO SE Hydro X Series' if 'Hydro X' in name else 'MP700 PRO SE'
 elif 'MP700 PRO' in family and 'Air Cooler' in name:family='MP700 PRO w/Heatsink'
 elif 'with Heatsink' in name and ('MP600 ELITE' in family or 'MP700 ELITE' in family):family=re.sub(r' with Heatsink','',family)+' w/Heatsink'
 if 'for PS5' in name and family=='MP600 ELITE':family='MP600 ELITE PS5'
 if mpn.endswith('CXTR2') and family=='MP600 CORE XT':family+=' R2'
 if row and row[0].startswith('MP600 PRO LPX with '):family='MP600 PRO LPX';finish='white' if 'White' in row[0] else 'black'
 else:finish=None
 # Retain original and R2 MP600 as separate candidates when the archive doesn't distinguish them.
 src={'name':'Corsair — référence produit exacte','url':identity['url'] if identity else url,'checkedAt':identity['source']['checkedAt'] if identity else doc['checkedAt'],'kind':'manufacturer'}
 ss={'name':'Corsair — tableau officiel endurance et garantie par SKU','url':url,'checkedAt':doc['checkedAt'],'kind':'manufacturer'}
 p={'manufacturerPartNumber':mpn,'capacityGB':capacity};proof={};rr=[{'label':'Nom fabricant','value':name},{'label':'Référence fabricant','value':mpn},{'label':'Capacité nominale','value':f'{capacity} Go'}]
 gen=5 if 'MP700' in family else 4
 # Generation and NVMe are explicit in product titles; old endurance-only identities do not inherit this claim.
 if identity and re.search(r'NVMe',name,re.I):
  p['storageInterface']='M.2 NVMe'
  proof['interfaceGeneration']={'value':f'PCIe {gen}.0 ×4','sourceURL':src['url'],'checkedAt':src['checkedAt']};rr.append({'label':'Interface PCIe','value':f'PCIe {gen}.0 ×4 NVMe'})
 txt=identity['text'] if identity else ''
 if re.search(r'built-in.{0,30}(?:aluminum )?heatspreader|equipped with.{0,60}heatsink|SSD with heatsink|aluminum heatspreader',txt,re.I):p['storageHeatsink']=True
 if re.search(r'without a heatsink|no heatsink included|heatsink not included',txt,re.I):p['storageHeatsink']=False
 form=re.search(r'M\.2\s*(2230|2242|2280)',name+' '+txt,re.I)
 if form:
  proof['formFactor']={'value':'M.2 '+form[1],'sourceURL':src['url'],'checkedAt':src['checkedAt']};rr.append({'label':'Format M.2','value':'M.2 '+form[1]})
 if re.search(r'heat ?sink|Air Cooler|Hydro X',name,re.I) or row and re.search(r'Heatsink',row[0]):p['storageHeatsink']=True
 if row:
  if re.fullmatch(r'[\d,]+\s*TBW',row[3]):proof['endurance']={'value':row[3],'sourceURL':ss['url'],'checkedAt':ss['checkedAt']};rr.append({'label':'Endurance TBW','value':row[3]})
  proof['warranty']={'value':row[4],'sourceURL':ss['url'],'checkedAt':ss['checkedAt']};rr.append({'label':'Garantie','value':row[4]})
 proof.update({k:{'value':v,'sourceURL':src['url'],'checkedAt':src['checkedAt']} for k,v in p.items()})
 records.append({'mpn':mpn,'brand':'Corsair','category':'storage','family':family,'patch':p,'sources':[src]+([ss] if row and src['url']!=ss['url'] else []),'rows':rr,'fieldEvidence':proof,'images':identity['images'] if identity else [],'url':src['url'],'formFactor':'M.2 '+form[1] if form else None,'finish':finish})
(OUT/'corsair-ssd-catalog.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n');print({'corsairStorageIdentities':len(identities),'officialEnduranceRows':len(table),'publishedNVMeSKUs':len(records)})
