"""Read exact ASUS PDF specification tables with preserved column boundaries."""
import runpy,pathlib,json,gzip,re,concurrent.futures,collections,hashlib,pdfplumber
C=runpy.run_path(str(pathlib.Path(__file__).with_name('asrock-motherboard-deep.py')));globals().update({k:v for k,v in C.items() if not k.startswith('__')})
D=DATA/'asus-manuals';D.mkdir(parents=True,exist_ok=True)
INPUT=[x for x in json.load(gzip.open(DATA/'input.json.gz','rt')) if x['component']['brand']=='ASUS'];NEED={r['id'] for r in json.load(open(DATA/'asus/review.json'))['records'] if r['state']!='exact_manufacturer_table'}
ALIASES={'Expansion slots':'Expansion Slots','Expansion Slots':'Expansion Slots','Back Panel I/O Ports':'BACK PANEL PORTS','Rear I/O Ports':'BACK PANEL PORTS','Internal I/O connectors':'Internal IO','Internal I/O Connectors':'Internal IO','Internal I/O connectors / jumpers / buttons':'Internal IO','BIOS Features':'BIOS','Form factor':'Form Factor','OS support':'Operating System','Wireless Data Network':'Wireless & Bluetooth'}
def parse(pdf,expected):
 rows={};pages=[]
 with pdfplumber.open(pdf) as doc:
  cover=' '.join((doc.pages[0].extract_text() or '').split());coverkey=norm(cover.replace('Motherboard','').replace('draobrehtoM',''))
  if coverkey!=norm(expected):return None,{'state':'manual_cover_model_mismatch','cover':cover}
  for i,page in enumerate(doc.pages[:20]):
   text=page.extract_text() or ''
   if not re.search(r'specifications summary\s*\n',text,re.I) or 'Contents' in text[:100]:continue
   tables=page.extract_tables()
   for table in tables:
    for row in table:
     if len(row)==2 and row[0] and row[1]:
      key=' '.join(row[0].split());key=ALIASES.get(key,key);value=row[1].strip();rows[key]=(rows[key]+'\n'+value) if key in rows else value
   if tables:pages.append(i+1)
 if not rows.get('CPU') or not rows.get('Memory'):return None,{'state':'manual_specification_table_missing','cover':cover,'pages':pages}
 return rows,{'state':'exact_manufacturer_manual','cover':cover,'pages':pages}
def collect(item):
 c=item['component'];id=c['id'];f=DATA/'remaining-searches'/(id+'.json');search=json.loads(f.read_text()) if f.exists() else {};urls=re.findall(r'^URL:\s*(\S+)', '\n'.join(b.get('text','') for b in search.get('result',{}).get('content',[])),re.M);urls=[u for u in urls if urllib.parse.urlparse(u).hostname=='dlcdnets.asus.com' and '.pdf' in u.lower() and not re.search(r'QVL|Devices_report|Memory|QSG',u,re.I)];urls.sort(key=lambda u:0 if re.search(r'/E\d+',u) else 1);attempts=[];product=None
 for u in dict.fromkeys(urls):
  m,t=download_manual(u,D/'pdfs'/(id+'-'+hashlib.sha256(u.encode()).hexdigest()[:10]));pdf=pathlib.Path('/tmp')/('deep-asrock-'+hashlib.sha256(m['url'].encode()).hexdigest()[:14]+'.pdf')
  if not pdf.exists():attempts.append(m);continue
  rows,proof=parse(pdf,c['name']);attempts.append({'source':m,**proof})
  if not rows:continue
  source={'name':'ASUS — manuel officiel, tableau des spécifications','url':m['resolvedURL'],'checkedAt':m['checkedAt'],'kind':'manufacturer'};product=make_product(c,item['review'],rows,source);product['manufacturerModel']=c['name'];product['notes'].append('Le tableau complet du manuel conserve les limites et restrictions publiées à son édition ; les mises à jour BIOS/QVL peuvent modifier les listes de CPU et de mémoire compatibles.')
  # CPU-specific descriptions can repeat the same physical M.2 connector. Do not sum them.
  if not re.search(r'M\.2[_ -]?[1-9]|M2_[1-9]',rows.get('Storage',''),re.I):
   n=nvme_count(rows.get('Internal IO',''))
   if n is not None:product['patch']['m2Slots']=n;product['fieldEvidence']['m2']={'value':n,'sourceURL':source['url'],'checkedAt':source['checkedAt']}
  break
 r={'id':id,'name':c['name'],'state':'exact_manufacturer_manual' if product else 'primary_manual_unconfirmed','attempts':attempts};(D/'records').mkdir(exist_ok=True);(D/'records'/(id+'.json')).write_text(json.dumps({'review':r,'product':product},ensure_ascii=False,indent=2));return r,product
def main():
 out={};reviews=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
  for r,p in pool.map(collect,[x for x in INPUT if x['component']['id'] in NEED]):
   reviews.append(r)
   if p:out[r['id']]=p
   print(r['name'],r['state'],flush=True)
 (D/'review.json').write_text(json.dumps({'summary':dict(collections.Counter(x['state'] for x in reviews)),'records':reviews},ensure_ascii=False,indent=2));(ROOT/'src/data/deepAsusManualMotherboards.ts').write_text('// Generated from exact ASUS PDF tables.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const deepAsusManualMotherboardProducts:Record<string,VerifiedProduct> = '+json.dumps(out,ensure_ascii=False,indent=2)+';\n');print('ASUS manual',len(out))
if __name__=='__main__':main()
