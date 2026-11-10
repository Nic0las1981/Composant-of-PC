"""Public manufacturer HTML extraction. No fuzzy model or retailer-price matching."""
from html.parser import HTMLParser
from pathlib import Path
import urllib.request,urllib.parse,json,gzip,re,html,hashlib,datetime
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'data/deep-review/motherboard'
def now(): return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')
def norm(s):return re.sub(r'[^a-z0-9]','',str(s).lower())
def clean(s):return re.sub(r'[ \t\r\f]+',' ',s).strip()
class Node:
 def __init__(self,tag='',attrs=()):self.tag=tag;self.attrs=dict(attrs);self.children=[]
 def text(self):return clean(''.join(c if isinstance(c,str) else ('\n' if c.tag=='br' else c.text()+'\n' if c.tag in ('p','li','div','tr') else c.text()) for c in self.children))
 def walk(self):
  yield self
  for c in self.children:
   if isinstance(c,Node):yield from c.walk()
 def cls(self,token):return token in self.attrs.get('class','')
 def find(self,pred):return next((n for n in self.walk() if pred(n)),None)
class DOM(HTMLParser):
 def __init__(self,s):super().__init__(convert_charrefs=True);self.root=Node('root');self.stack=[self.root];self.feed(s)
 def handle_starttag(self,tag,attrs):
  n=Node(tag,attrs);n.parent=self.stack[-1];self.stack[-1].children.append(n)
  if tag not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):self.stack.append(n)
 def handle_startendtag(self,tag,attrs):self.handle_starttag(tag,attrs);self.handle_endtag(tag)
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==tag:self.stack=self.stack[:i];break
 def handle_data(self,d):self.stack[-1].children.append(d)
def fetch(url,dest):
 url=urllib.parse.quote(url,safe=':/?=&%+#')
 dest=Path(dest);dest.parent.mkdir(parents=True,exist_ok=True);meta=dest.with_suffix('.json');body=dest.with_suffix('.html.gz')
 if meta.exists():
  r=json.loads(meta.read_text())
  if r['url']!=url:return fetch(url,dest.parent/(dest.name+'-'+hashlib.sha256(url.encode()).hexdigest()[:10]))
  return r,gzip.decompress(body.read_bytes()).decode(errors='replace') if body.exists() else ''
 r={'url':url,'checkedAt':now()}
 try:
  res=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=30);b=res.read(16000000)
  r.update(httpStatus=res.status,resolvedURL=res.url,sha256=hashlib.sha256(b).hexdigest(),bytes=len(b));s=b.decode(errors='replace')
  body.write_bytes(gzip.compress(b));r['status']='fetched'
  if re.search(r'Incapsula incident ID|Access Denied|Request unsuccessful',s,re.I):r['status']='access_blocked'
 except Exception as e:r.update(status='unavailable',error=str(e));s=''
 meta.write_text(json.dumps(r,ensure_ascii=False,indent=2));return r,s

def asus_rows(s):
 dom=DOM(s).root;rows={};models=[]
 for n in dom.walk():
  if n.cls('__rowTable___'):
   key=n.find(lambda x:x.attrs.get('class')=='rowTableTitle')
   vals=[x.text() for x in n.walk() if x.cls('__rowTableItems___') and x.text()]
   if key and vals:rows[key.text()]='\n'.join(dict.fromkeys(vals))
  elif n.cls('__productSpecItemRow__'):
   key=n.find(lambda x:x.tag=='h2');vals=[x.text() for x in n.walk() if x.cls('__descriptionItemValue__') and x.text()]
   if key and vals:rows[key.text()]='\n'.join(dict.fromkeys(vals))
 if not rows.get('Model'):
  heading=dom.find(lambda n:n.tag=='h1' and n.text().strip())
  if heading and any(n.cls('__productSpecItemRow__') for n in dom.walk()):rows['Model']=heading.text()
 model=rows.get('Model','').strip();title=dom.find(lambda x:x.tag=='title');title=title.text() if title else ''
 images=[]
 for n in dom.walk():
  if n.tag=='meta' and n.attrs.get('property')=='og:image':images.append(n.attrs.get('content'))
  if n.tag=='img' and any(k in n.attrs.get('src','') for k in ('dlcdnwebimgs.asus.com','dlcdnimgs.asus.com')) and any(k in (n.attrs.get('alt') or '').lower() for k in ('motherboard',model.lower())):images.append(n.attrs['src'])
 # The SSR payload contains the exact product's skuImg, while unrelated menu images are excluded.
 m=re.search(r'<script[^>]*id="__NUXT_DATA__"[^>]*>(.*?)</script>',s,re.S)
 if m:
  try:
   payload=json.loads(m.group(1))
   for item in payload:
    if isinstance(item,dict) and 'Name' in item and 'ImageLink' in item and isinstance(item['Name'],int) and norm(payload[item['Name']])==norm(model):
     image=payload[item['ImageLink']] if isinstance(item['ImageLink'],int) else item['ImageLink']
     if isinstance(image,str):images.append(image)
    if isinstance(item,dict) and 'skuImg' in item and 'mktName' in item and isinstance(item['mktName'],int) and norm(payload[item['mktName']])==norm(model):
     image=payload[item['skuImg']] if isinstance(item['skuImg'],int) else item['skuImg']
     if isinstance(image,str):images.append(image)
  except (ValueError,IndexError,TypeError):pass
 return rows,model,title,list(dict.fromkeys(u for u in images if isinstance(u,str) and u.startswith('https://')))

LABELS={'CPU':'Processeurs / socket','Processor':'Processeurs / socket','Socket':'Socket','Chipset':'Chipset','Memory':'Mémoire','Graphics':'Sorties graphiques intégrées','Expansion Slots':'PCIe et restrictions','Expansion Slot':'PCIe et restrictions','Slot':'PCIe et restrictions','Slots':'PCIe et restrictions','Storage':'Stockage et restrictions','Ethernet':'Réseau filaire','LAN':'Réseau filaire','Wireless & Bluetooth':'Réseau sans fil','WiFi & Bluetooth':'Réseau sans fil','WIRELESS LAN & BLUETOOTH':'Réseau sans fil','USB':'USB','Audio':'Audio','Back Panel I/O Ports':'Connectique arrière','Back I/O Ports':'Connectique arrière','BACK PANEL PORTS':'Connectique arrière','Back Panel Ports':'Connectique arrière','Back Panel Connectors':'Connectique arrière','Rear I/O Panel':'Connectique arrière','Internal I/O Connectors':'Connectique interne','Internal I/O Ports':'Connectique interne','Internal IO':'Connectique interne','Internal Connectors':'Connectique interne','Onboard Connectors':'Connectique interne','BIOS':'BIOS','Manageability':'Administration','Accessories':'Accessoires','Operating System':'Systèmes compatibles','Form Factor':'Format et dimensions','PCB Info':'Format et dimensions','Dimensions':'Dimensions physiques','Special Features':'Fonctions particulières','Software Features':'Logiciels','RAID':'RAID'}
def pick(rows,*keys):return '\n'.join(dict.fromkeys(rows[k] for k in keys if rows.get(k)))
def nvme_count(storage):
 # Slots are counted by their own storage description, never wireless Key E.
 named={}
 for m in re.finditer(r'(M\.2[_ -]?[1-9]|M2_[1-9])(?!\d)(.*?)(?=(?:M\.2[_ -]?[1-9]|M2_[1-9])(?!\d)|$)',storage,re.S|re.I):
  if re.search(r'PCI[- ]?[Ee]|PCI Express|NVMe',m.group(2),re.I) and not re.search(r'Key\s*E|SATA[- ]only|only SATA|PCIe\s+(?:is\s+)?not\s+supported',m.group(2),re.I):named[norm(m.group(1))]=True
 if named:return len(named)
 chunks=re.findall(r'(\d+)\s*[x×]\s*M\.2\s+(?:Socket|Slot)(.*?)(?=\n[^\n]*(?:\d+\s*[x×]\s*M\.2)|$)',storage,re.S|re.I)
 if len(chunks)==1:
  counts=[int(n) for n,desc in chunks if re.search(r'PCI[- ]?[Ee]|PCI Express|NVMe',desc,re.I) and not re.search(r'Key\s*E|SATA[- ]only|only SATA',desc,re.I)]
  return sum(counts) if counts else None
 return None

def make_product(c,old,rows,source,images=(),identity_note=''):
 cpu=pick(rows,'CPU','Processor','Socket');mem=pick(rows,'Memory');storage=pick(rows,'Storage');form=pick(rows,'Form Factor','PCB Info','Dimensions','Dimension')
 patch={};facts={}
 def fact(key,value):
  if value is not None and str(value).strip():facts[key]={'value':value,'sourceURL':source['url'],'checkedAt':source['checkedAt']}
 socket=re.search(r'\b(AM[345]\+?|FM[12]\+?|LGA\s*\d{3,4}|sTR[45XW]+)\b',cpu,re.I)
 if socket:
  sk=socket.group(1).replace(' ','').upper();fact('socket',sk)
  if sk in ('AM4','AM5','LGA1700'):patch['socket']=sk
 generation=list(dict.fromkeys(re.findall(r'\bDDR[2345]\b',mem,re.I)))
 if len(generation)==1:
  kind=generation[0].upper();fact('memoryType',kind)
  if kind in ('DDR4','DDR5'):patch['memoryType']=kind
 slots=re.search(r'(\d+)\s*[x×*]\s*(?:(?:DDR[2345]|SO)[ -]?)?DIMM\b|(?:DIMM Slots|Memory Slots)\s*[:：]?\s*(\d+)|(?:^|\n)(\d+)\s*[x×*]\s*DDR[2345]\b|(?:^|\n)(\d+)\s+DDR[2345]\s+memory\s+sockets',mem,re.I)
 if slots:patch['memorySlots']=int(next(v for v in slots.groups() if v));fact('memorySlots',patch['memorySlots'])
 maxmem=re.search(r'(?:Max(?:imum)?\.?\s*(?:Memory Capacity|capacity of system memory)?\s*[:：,]?\s*)(\d+)\s*GB',mem,re.I)
 if maxmem:patch['maxMemoryGB']=int(maxmem.group(1));fact('memoryCapacity',patch['maxMemoryGB'])
 n=nvme_count(storage)
 if n is not None:patch['m2Slots']=n;fact('m2',n)
 if re.search(r'\bMicro[ -]?ATX|\bm[- ]?ATX\b',form,re.I):patch['formFactor']='Micro-ATX'
 elif re.search(r'\bMini[ -]?ITX\b',form,re.I):patch['formFactor']='Mini-ITX'
 elif re.search(r'\bATX\b',form,re.I) and not re.search(r'(?:E-|Extended)ATX',form,re.I):patch['formFactor']='ATX'
 if form:fact('formFactor',form)
 dimension_source=pick(rows,'Dimensions','Dimension') or form
 dims=re.search(r'(\d+(?:[.,]\d+)?)\s*(mm|cm)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*(mm|cm)',dimension_source,re.I)
 if dims:fact('boardDimensions',dimension_source)
 if dims and not (c['brand']=='MSI' and not pick(rows,'Dimensions','Dimension')):
  a,u,b,v=dims.groups();patch['heightMm']=round(float(a.replace(',','.'))*(10 if u.lower()=='cm' else 1),2);patch['widthMm']=round(float(b.replace(',','.'))*(10 if v.lower()=='cm' else 1),2);fact('boardDimensions',form)
 for key,value in {'chipset':pick(rows,'Chipset'),'storagePorts':storage,'pcie':pick(rows,'Expansion Slots','Expansion Slot','Slot','Slots'),'rearIO':pick(rows,'Back Panel I/O Ports','Back I/O Ports','BACK PANEL PORTS','Back Panel Ports','Back Panel Connectors','Rear I/O Panel'),'internalIO':pick(rows,'Internal I/O Connectors','Internal I/O Ports','Internal IO','Internal Connectors','Onboard Connectors'),'network':pick(rows,'Ethernet','LAN','Wireless & Bluetooth','WIRELESS LAN & BLUETOOTH','WiFi & Bluetooth'),'audio':pick(rows,'Audio'),'cpuSupport':cpu+('\nBIOS: '+rows['BIOS'] if rows.get('BIOS') else '')}.items():fact(key,value)
 # Existing SKU/retailer identity is preserved only for this already matched ID.
 mpn=old['mpn'] if old else c['name'];previous=old or {};patch={**previous.get('patch',{}),**patch,'manufacturerPartNumber':mpn,'detailLevel':'partial'}
 notes=list(previous.get('notes',[]))+['Sections techniques publiées pour le modèle exact. Les champs absents restent inconnus. Aucun numéro de lot/révision non publié ni prix n’est déduit du nom de modèle.','Les restrictions CPU/BIOS, partage PCIe/M.2, limites de mémoire et conditions de connectique sont conservées dans le texte officiel.','Le compteur M.2 ne retient que les sockets de stockage explicitement PCIe/NVMe ; les sockets Wi-Fi Key E et SATA seuls sont exclus.']
 product={'mpn':mpn,'identityNote':identity_note or f'Modèle {c["brand"]} {c["name"]} confirmé dans sa fiche officielle.','sources':list({s['url']:s for s in previous.get('sources',[])+[source]}.values()),'patch':patch,'groups':[{'title':'Fiche technique complète — '+c['brand'],'rows':[{'label':LABELS.get(k,k),'value':v} for k,v in rows.items() if v and k not in ('Model','News & Updates')]}],'offers':previous.get('offers',[]),'notes':list(dict.fromkeys(notes)),'fieldEvidence':{**previous.get('fieldEvidence',{}),**facts}}
 if images:product['groups'].append({'title':'Références visuelles officielles','rows':[{'label':'Photographie constructeur '+str(i+1),'value':url} for i,url in enumerate(images)]})
 return product
