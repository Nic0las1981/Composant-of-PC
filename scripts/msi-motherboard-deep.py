"""Retain complete exact-model MSI technical tables, including older layout fields."""
import runpy,pathlib,json,gzip,re,collections
C=runpy.run_path(str(pathlib.Path(__file__).with_name('deep-motherboard-core.py')));globals().update({k:v for k,v in C.items() if not k.startswith('__')})
text=lambda s:DOM(s).root.text()
def msi_rows(s):
 rows={}
 for raw in re.findall(r'<tr\b[^>]*>(.*?)</tr>',s,re.S|re.I):
  key=re.search(r'<th\b[^>]*>(.*?)</th>',raw,re.S|re.I);val=re.search(r'<td\b[^>]*>(.*?)</td>',raw,re.S|re.I)
  if key and val:rows[text(key.group(1))]=text(val.group(1))
 for raw in re.findall(r'<div\s+class="tr"[^>]*>\s*<div\s+class="td"[^>]*>(.*?)</div>\s*</div>',s,re.S):
  key=re.search(r'<li[^>]*class="specName"[^>]*>(.*?)</li>',raw,re.S|re.I)
  if key:rows[text(key.group(1))]=text(re.sub(r'^.*?</ul>','',raw,flags=re.S))
 headers=list(re.finditer(r'<h2\b[^>]*>(.*?)</h2>',s,re.S|re.I))
 for i,h in enumerate(headers):
  part=s[h.end():headers[i+1].start() if i+1<len(headers) else len(s)]
  detail=re.search(r'<div[^>]*class=[\"\']col-md-8[\"\'][^>]*>(.*)',part,re.S|re.I)
  if detail and text(h.group(1)) not in ('Box content',):rows[text(h.group(1))]=text(detail.group(1))
 return rows
def canonical(rows):
 out=dict(rows)
 for target,keys in {'Memory':['Memory','DDR4 Memory','DDR5 Memory','DIMM Slots','Max Memory (GB)','Memory Channel'],'Internal IO':['Internal IO','Internal connectors','Internal Connectors','Power Connectors','Fan Connectors','System Connectors','Jumpers'],'BACK PANEL PORTS':['BACK PANEL PORTS','Back panel ports','Back Panel Ports'],'Storage':['Storage','M.2 SSD Slot','SATA Ports'],'WIRELESS LAN & BLUETOOTH':['WIRELESS LAN & BLUETOOTH','Wireless LAN & Bluetooth®','WiFi & Bluetooth']}.items():
  vals=[]
  for key in keys:
   if rows.get(key):vals.append((key+': ' if key not in ('Memory','Storage','Internal IO','BACK PANEL PORTS') else '')+rows[key])
  if vals:out[target]='\n'.join(dict.fromkeys(vals))
 return out

def main():
 D=DATA/'msi';D.mkdir(parents=True,exist_ok=True);out={};review=[]
 for item in json.load(gzip.open(DATA/'input.json.gz','rt')):
  c=item['component']
  if c['brand']!='MSI':continue
  id=c['id'];old=item['review'];p=ROOT/'data/comprehensive-review/board-gpu-sources'/(id+'.json');record=json.loads(p.read_text()) if p.exists() else {}
  cached=pathlib.Path('/tmp/board-gpu-manufacturers')/(id+'.html');saved=D/'html'/(id+'.html.gz');saved.parent.mkdir(exist_ok=True)
  if cached.exists():body=cached.read_bytes();saved.write_bytes(gzip.compress(body));s=body.decode(errors='replace')
  elif saved.exists():s=gzip.decompress(saved.read_bytes()).decode(errors='replace')
  else:
   url='https://www.msi.com/Motherboard/'+re.sub('[^A-Za-z0-9-]','-',c['name'].replace(' ','-')).strip('-')+'/Specification';record,s=fetch(url,D/'pages'/id)
  rows=msi_rows(s);title=DOM(s).root.find(lambda n:n.tag=='title');title=title.text() if title else ''
  lines=record.get('text','').splitlines();exact=any(norm(l)==norm(c['name']) or norm(l)==norm('MSI '+c['name']) for l in lines[:45]) or norm(title.split('|')[0])==norm(c['name'])
  if not exact:
   sf=DATA/'additional-searches'/(id+'.json')
   search=json.loads(sf.read_text()) if sf.exists() else {}
   urls=re.findall(r'^URL:\s*(https?://\S+)', '\n'.join(b.get('text','') for b in search.get('result',{}).get('content',[])),re.M)
   for i,u in enumerate(urls):
    if not re.search(r'https://(?:[a-z]+\.)?msi\.com/Motherboard/.*/Specification',u):continue
    record,s=fetch(u,D/'pages'/(id+'-extra-'+str(i)));rows=msi_rows(s);dom=DOM(s).root;headings=[n.text() for n in dom.walk() if n.tag in ('h1','title')];exact=any(norm(t.split('|')[0])==norm(c['name']) for t in headings)
    if exact and rows.get('Chipset'):break
  state='identity_unconfirmed';images=[];product=None
  if exact and rows.get('Chipset'):
   rows=canonical(rows);source={'name':'MSI — fiche technique officielle complète','url':record.get('resolvedURL',record.get('url')),'checkedAt':record['checkedAt'],'kind':'manufacturer'}
   images=re.findall(r'<meta[^>]*(?:property|name)=["\']og:image["\'][^>]*content=["\']([^"\']+)',s,re.I)
   product=make_product(c,old,rows,source,images)
   # Separate numeric legacy layout labels are explicit statements, not inferred division.
   for field,key in [('memorySlots','DIMM Slots'),('maxMemoryGB','Max Memory (GB)')]:
    if re.fullmatch(r'\d+',rows.get(key,'')):
     value=int(rows[key]);product['patch'][field]=value;product['fieldEvidence']['memorySlots' if field=='memorySlots' else 'memoryCapacity']={'value':value,'sourceURL':source['url'],'checkedAt':source['checkedAt']}
   if not product['fieldEvidence'].get('m2') and rows.get('M.2 SSD Slot'):
    n=nvme_count(rows['M.2 SSD Slot'])
    if n is not None:product['patch']['m2Slots']=n;product['fieldEvidence']['m2']={'value':n,'sourceURL':source['url'],'checkedAt':source['checkedAt']}
   out[id]=product;state='exact_manufacturer_table'
  row={'id':id,'name':c['name'],'state':state,'sourceURL':record.get('url'),'sections':list(rows),'photos':images,'documentedFields':list(product['fieldEvidence']) if product else []};review.append(row)
  (D/'records').mkdir(exist_ok=True);(D/'records'/(id+'.json')).write_text(json.dumps({'review':row,'product':product},ensure_ascii=False,indent=2))
 (D/'review.json').write_text(json.dumps({'summary':dict(collections.Counter(x['state'] for x in review)),'records':review},ensure_ascii=False,indent=2))
 target=ROOT/'src/data/deepMsiMotherboards.ts';target.write_text('// Generated by scripts/msi-motherboard-deep.py.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const deepMsiMotherboardProducts:Record<string,VerifiedProduct> = '+json.dumps(out,ensure_ascii=False,indent=2)+';\n')
 with target.open('a') as f:
  for id in ['mb-b650m-gaming','mb-x670e-tomahawk','mb-z790-pro','mb-b650i-edge']:
   if id in out:f.write(f'deepMsiMotherboardProducts["{id}"].patch.maxMemoryPerSlotGB = undefined;\n')
 print('MSI',len(out),'/',len(review))
if __name__=='__main__':main()
