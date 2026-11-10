"""Exact ASRock manual identity and complete published specification sections.

Discovery results are candidates only. The manual introduction must name the
exact model, including D4, WiFi and revision. PDFs remain local raw evidence.
"""
import runpy,pathlib,json,gzip,re,concurrent.futures,collections,subprocess,hashlib
C=runpy.run_path(str(pathlib.Path(__file__).with_name('deep-motherboard-core.py')));globals().update({k:v for k,v in C.items() if not k.startswith('__')})
D=DATA/'asrock';D.mkdir(parents=True,exist_ok=True);INPUT=[x for x in json.load(gzip.open(DATA/'input.json.gz','rt')) if x['component']['brand']=='ASRock']
LABEL={'Platform':'Form Factor','CPU':'CPU','Chipset':'Chipset','Memory':'Memory','Expansion':'Expansion Slots','Graphics':'Graphics','Audio':'Audio','LAN':'LAN','Wireless':'Wireless & Bluetooth','USB':'USB','Rear Panel':'BACK PANEL PORTS','Storage':'Storage','RAID':'RAID','Connector':'Internal IO','BIOS':'BIOS','Hardware':'Hardware monitoring','OS':'Operating System','Certifications':'Certifications','Unique Feature':'Unique Feature','Accessories':'Accessories'}
def modelkey(s):return norm(re.sub(r'\s+Series$','',re.sub(r'^Fatal1ty\s+','',s,flags=re.I),flags=re.I).replace('Phantom Gaming X870','X870'))
def parse_manual(t,expected):
 intro=re.search(r'(?:purchasing|choosing)\s+ASRock(?:\s+Rack)?\s+(.{1,450}?)\s*motherboard',t,re.I|re.S)
 if not intro:return None,{'state':'manual_identity_missing'}
 names=re.split(r'\s+and\s+|\s*/\s*(?=[A-Z][0-9]{3}|[A-Z][A-Z0-9-]{3,}\s)',re.sub(r'\s+',' ',intro.group(1)))
 if not any(modelkey(n)==modelkey(expected) for n in names):return None,{'state':'manual_model_mismatch','identityExcerpt':intro.group(0),'modelNames':names}
 starts=list(re.finditer(r'1\.2\s+Spec',t))
 if not starts:return None,{'state':'manual_sections_missing','identityExcerpt':intro.group(0)}
 s=t[starts[-1].start():];end=re.search(r'1\.3\s+(?:Mother|Unique)',s);s=s[:end.start()] if end else s[:22000]
 heads=list(re.finditer(r'^[ \t\f]*(Platform|CPU|Chipset|Memory|Expansion|Graphics|Audio|LAN|Wireless|USB|Rear Panel|Storage|RAID|Connector|BIOS|Hardware|OS|Certifications|Unique Feature|Accessories)\b[ \t]{2,}',s,re.M))
 heads=[h for i,h in enumerate(heads) if not(h.group(1)=='LAN' and i>0 and heads[i-1].group(1)=='Wireless')]
 rows={}
 for i,h in enumerate(heads):
  content=s[h.end():heads[i+1].start() if i+1<len(heads) else len(s)]
  lines=[line.strip() for line in content.splitlines() if line.strip() and line.strip()!='English' and not line.strip().isdigit() and modelkey(line.strip()) not in [modelkey(n) for n in names]]
  value='\n'.join(lines).strip()
  if value:rows[LABEL[h.group(1)]]=value
 if 'ASRock Rack' in intro.group(0):
  server={'Physical Status':'Form Factor','Processor System':'CPU','System Memory':'Memory','Expansion Slot':'Expansion Slots','Other PCIe Expansion Connectors':'Storage','SATA/SAS Storage':'SATA storage','Ethernet':'LAN','USB':'USB','Graphics':'Graphics','Security':'Security','Rear I/O':'BACK PANEL PORTS','Hardware Monitor':'Hardware monitoring','Server Management':'Server management','System BIOS':'BIOS','Internal Connectors/Headers':'Internal IO','Support OS':'Operating System','OS':'Operating System','Environment':'Environment'}
  hs=list(re.finditer(r'^[ \t]*(?:'+ '|'.join(re.escape(k) for k in server) +r')[ \t]*$',s,re.M));rows={}
  for i,h in enumerate(hs):
   content=s[h.end():hs[i+1].start() if i+1<len(hs) else len(s)];content='\n'.join(l.strip() for l in content.splitlines() if l.strip() and l.strip()!='English' and not l.strip().isdigit() and modelkey(l.strip()) not in [modelkey(n) for n in names]);rows[server[h.group().strip()]]=content
 if not rows.get('CPU') or not rows.get('Memory'):return None,{'state':'manual_sections_missing','identityExcerpt':intro.group(0)}
 return rows,{'state':'exact_manufacturer_manual','identityExcerpt':intro.group(0),'specificationExcerpt':s,'modelNames':names,'sharedManual':len(names)>1}
def download_manual(url,stem):
 stem=pathlib.Path(stem);stem.parent.mkdir(parents=True,exist_ok=True);mp=stem.with_suffix('.json');txt=stem.with_suffix('.txt.gz')
 if mp.exists():return json.loads(mp.read_text()),gzip.open(txt,'rt').read() if txt.exists() else ''
 url=urllib.parse.quote(url,safe=':/?=&%+#');m={'url':url,'checkedAt':now()};text=''
 try:
  res=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=30);b=res.read(18000000)
  m.update(resolvedURL=res.url,httpStatus=res.status,sha256=hashlib.sha256(b).hexdigest(),bytes=len(b))
  if not b.lstrip().startswith(b'%PDF'):m['status']='not_pdf'
  else:
   raw=pathlib.Path('/tmp')/('deep-asrock-'+hashlib.sha256(url.encode()).hexdigest()[:14]+'.pdf');raw.write_bytes(b);out=raw.with_suffix('.txt');p=subprocess.run(['pdftotext','-layout','-f','1','-l','32',str(raw),str(out)],capture_output=True)
   if p.returncode==0:text=out.read_text(errors='replace');txt.write_bytes(gzip.compress(text.encode()));m['status']='manual_fetched'
   else:m['status']='pdf_text_unavailable'
 except Exception as e:m.update(status='unavailable',error=str(e))
 mp.write_text(json.dumps(m,ensure_ascii=False,indent=2));return m,text
def extracted_page(id,expected):
 f=D/'primary-extracts'/(id+'.json')
 if not f.exists():return None,None,None
 x=json.loads(f.read_text());text='\n'.join(b.get('text','') for b in x['result'].get('content',[]));title=re.search(r'^# ASRock\s+(?:&gt;|>)\s*(.+)$',text,re.M)
 if not title or norm(title[1])!=norm(expected):return None,None,None
 labels={'CPU':'CPU','Chipset':'Chipset','Chipsatz':'Chipset','Memory':'Memory','Arbeitsspeicher':'Memory','BIOS':'BIOS','Graphics':'Graphics','Grafik':'Graphics','Audio':'Audio','LAN':'LAN','Wireless LAN':'Wireless & Bluetooth','Drahtloses LAN':'Wireless & Bluetooth','Slots':'Expansion Slots','Steckplätze':'Expansion Slots','Storage':'Storage','Speicherplatz':'Storage','RAID':'RAID','Connector':'Internal IO','Anschluss':'Internal IO','Rear Panel I/O':'BACK PANEL PORTS','Blende':'BACK PANEL PORTS','Software and UEFI':'Software and UEFI','Software und UEFI':'Software and UEFI','Support CD':'Support CD','Support-CD':'Support CD','Accessories':'Accessories','Produktzubehör':'Accessories','Hardware Monitor':'Hardware monitoring','Hardware überwachung':'Hardware monitoring','Form Factor':'Form Factor','Formfaktor':'Form Factor','OS':'Operating System','Betriebssystem':'Operating System','Certifications':'Certifications','Zertifizierungen':'Certifications'}
 start=text.find('\nCPU\n');s=text[start:] if start>=0 else '';end=re.search(r'^### (?:Manual|Handbuch)',s,re.M);s=s[:end.start()] if end else s;heads=list(re.finditer(r'^('+'|'.join(re.escape(k) for k in labels)+r')\s*$',s,re.M));rows={labels[h[1]]:s[h.end():heads[i+1].start() if i+1<len(heads) else len(s)].strip() for i,h in enumerate(heads)}
 if not rows.get('Memory'):return None,None,None
 url=re.search(r'^URL:\s*(\S+)',text,re.M)[1];source={'url':url,'checkedAt':x['fetchedAt'],'contentSHA256':hashlib.sha256(text.encode()).hexdigest()};proof={'state':'exact_manufacturer_web_table','identityExcerpt':title[0],'specificationExcerpt':s};return rows,proof,source
def collect(item):
 c=item['component'];id=c['id'];old=item['review'];src=ROOT/'data/comprehensive-review/board-gpu-sources'/(id+'.json');prior=json.loads(src.read_text()) if src.exists() else {};raw=pathlib.Path('/tmp/board-gpu-manufacturers')/(id+'.txt');t=raw.read_text(errors='replace') if raw.exists() else prior.get('text','')
 if not t and prior.get('identityExcerpt') and prior.get('specificationExcerpt'):t=prior['identityExcerpt']+'\n'+prior['specificationExcerpt']
 attempts=[];rows=None;proof={};source=prior
 if t:rows,proof=parse_manual(t,c['name']);attempts.append({'url':prior.get('url'),**{k:v for k,v in proof.items() if k!='specificationExcerpt'}})
 if not rows:
  urls=[]
  for f in [D/'searches'/(id+'.json'),DATA/'remaining-searches'/(id+'.json')]:
   if f.exists():
    data=json.loads(f.read_text());texts='\n'.join(b.get('text','') for b in data['result'].get('content',[]));urls.extend(re.findall(r'^URL:\s*(https?://\S+)',texts,re.M))
  urls=[u for u in urls if urllib.parse.urlparse(u).hostname in ('download.asrock.com','download.asrockrack.com') and '.pdf' in u.lower()]
  for url in dict.fromkeys(urls):
   m,t=download_manual(url,D/'manuals'/(id+'-'+hashlib.sha256(url.encode()).hexdigest()[:10]));r,p=parse_manual(t,c['name']);attempts.append({'source':m,**{k:v for k,v in p.items() if k!='specificationExcerpt'}})
   if r:rows,proof,source=r,p,m;break
 if not rows:
  r,p,m=extracted_page(id,c['name'])
  if r:rows,proof,source=r,p,m;attempts.append({'source':m,'state':p['state']})
 product=None;state=proof.get('state','primary_unconfirmed')
 if rows:
  primary={'name':'ASRock — spécification officielle du modèle exact','url':source.get('resolvedURL',source['url']),'checkedAt':source['checkedAt'],'kind':'manufacturer'}
  product=make_product(c,old,rows,primary);product['manufacturerModel']=c['name'];product['groups'][0]['title']='Manuel ASRock — caractéristiques et conditions du modèle exact'
  mem=rows.get('Memory','');m=re.search(r'(\d+)\s*x\s*DDR[2345]\s*(?:DIMM|Memory)?\s*Slots',mem,re.I)
  if m:product['patch']['memorySlots']=int(m.group(1));product['fieldEvidence']['memorySlots']={'value':int(m.group(1)),'sourceURL':primary['url'],'checkedAt':primary['checkedAt']}
  product['notes'].append('Le manuel peut précéder une mise à jour BIOS. Les restrictions par processeur et modèle restent textuellement présentes ; consulter également la QVL et la liste CPU du constructeur.')
  if proof.get('sharedManual'):product['notes'].append('Manuel commun à plusieurs modèles explicitement nommés : les clauses conditionnelles identifiant chaque modèle restent présentes, sans les attribuer automatiquement aux autres variantes.')
  # This already verified current page explicitly supersedes the older manual capacity.
  if id=='import-mb-ae3fc3caaaf9' and old:
   current=ROOT/'data/comprehensive-review/b650m-pg-riptide-wifi-current.json'
   if current.exists():
    cp=json.loads(current.read_text());product['patch']['maxMemoryGB']=256;product['fieldEvidence']['memoryCapacity']={'value':256,'sourceURL':cp['url'],'checkedAt':cp['checkedAt']};product['groups'].append({'title':'Spécification web ASRock actuelle','rows':[{'label':'Mémoire maximale','value':'256 Go ; la page fabricant actuelle remplace la limite de 192 Go de l’ancien manuel.'}]})
  state=proof['state']
 record={'id':id,'name':c['name'],'state':state,'attempts':attempts,'source':{k:v for k,v in source.items() if k in ('url','resolvedURL','checkedAt','sha256','httpStatus')},'proof':proof,'documentedFields':list(product.get('fieldEvidence',{})) if product else []}
 (D/'records').mkdir(exist_ok=True);(D/'records'/(id+'.json')).write_text(json.dumps({'review':record,'product':product},ensure_ascii=False,indent=2));return record,product
def main():
 out={};reviews=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
  for i,(r,p) in enumerate(pool.map(collect,INPUT),1):
   reviews.append(r)
   if p:out[r['id']]=p
   if i%20==0 or i==len(INPUT):print('ASRock',i,len(INPUT),'confirmed',len(out),flush=True)
 (D/'review.json').write_text(json.dumps({'summary':dict(collections.Counter(x['state'] for x in reviews)),'records':reviews},ensure_ascii=False,indent=2))
 (ROOT/'src/data/deepAsrockMotherboards.ts').write_text('// Generated from exact official ASRock manuals by scripts/asrock-motherboard-deep.py.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const deepAsrockMotherboardProducts:Record<string,VerifiedProduct> = '+json.dumps(out,ensure_ascii=False,indent=2)+';\n')
 print('ASRock confirmed',len(out))
if __name__=='__main__':main()
