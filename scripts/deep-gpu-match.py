"""Exact-variant candidate discovery. Candidate URLs are not verified products."""
import json,gzip,pathlib,re,urllib.parse,collections
from importlib.machinery import SourceFileLoader
H=SourceFileLoader('collector',str(pathlib.Path(__file__).with_name('deep-gpu-catalog.py'))).load_module()
D=H.D
INPUT=json.load(gzip.open(D/'input.json.gz','rt'))
def tokens(s,cap=None):
 s=s.lower().replace('™','').replace('®','')
 s=re.sub(r'\b(?:msi|asus|gigabyte|geforce|radeon|graphics|card|model|gaming)\b',' ',s)
 if cap:s=re.sub(r'\b(?:o|t)?'+str(int(cap))+r'\s*g(?:b|d\d+x?)?\b',lambda m:' oc ' if m[0].startswith('o') else ' top ' if m[0].startswith('t') else ' ',s)
 s=re.sub(r'\b(?:gddr\d+x?)\b',' ',s)
 return sorted(re.findall(r'[a-z]+|\d+',s))
def expected(item):
 c=item['component'];o=item.get('original') or {};cap=o.get('memory',c.get('capacityGB'));name=o.get('name',c['name'].split(' · ')[0]);chip=o.get('chipset','')
 if not re.search(r'\b(?:RTX|GTX|GT|RX|R\d|HD|Arc)\s*\d+',name,re.I):name=chip+' '+name
 if 'Blanc' in c.get('finishName','') and not re.search(r'white|snow',name,re.I):name+=' WHITE'
 return tokens(name,cap),cap
sources=[json.load(open(p)) for p in (D/'sources').glob('*.json')]
urls=collections.defaultdict(set)
for s in sources:
 for u in s.get('links',[]):
  b=s['brand']
  if b=='MSI' and re.fullmatch(r'https://www.msi.com/Graphics-Card/[^/#?]+(?:/Specification)?',u):urls[b].add(u.rstrip('/').removesuffix('/Specification')+'/Specification')
  if b=='ASUS':
   if re.match(r'https://rog.asus.com/(?:[a-z-]+/)?graphics-cards/graphics-cards/[^/]+/[^/]+-model/',u):
    u=re.sub(r'https://rog.asus.com/[a-z-]+/graphics-cards/', 'https://rog.asus.com/graphics-cards/',u)
    base=re.match(r'(https://rog.asus.com/graphics-cards/graphics-cards/[^/]+/[^/]+-model/)',u)
    if base:urls[b].add(base[1]+'spec/')
   if re.match(r'https://www.asus.com/motherboards-components/graphics-cards/[^/]+/[^/]+/',u) and '/all-series/' not in u:
    base=re.match(r'(https://www.asus.com/motherboards-components/graphics-cards/[^/]+/[^/]+/)',u)
    if base:urls[b].add(base[1]+'techspec/')
  if b=='Gigabyte' and re.match(r'https://www.gigabyte.com/Graphics-Card/GV-[^/]+',u):urls[b].add(re.match(r'(https://www.gigabyte.com/Graphics-Card/[^/#]+)',u)[1]+'/sp')
  if b in ['Palit','Gainward'] and 'vga.php?' in u and 'lang=en' in u:urls[b].add(u.replace('http://','https://'))
  if b=='XFX' and '/shop/' in u:urls[b].add(u.replace('https://xfxforce.com','https://www.xfxforce.com'))
  if b=='Inno3D' and re.match('https://(?:www.)?inno3d.com/product/',u):urls[b].add(u)
  if b=='Sapphire' and re.match('https://www.sapphiretech.com/en/consumer/',u):urls[b].add(u)
C=[];tasks=[]
for item in INPUT:
 c=item['component'];b=c['brand'];wanted,cap=expected(item);cand=[]
 if b in ['ASUS','MSI']:
  for u in sorted(urls[b]):
   slug=u.rstrip('/').split('/')[-2].removesuffix('-model')
   if tokens(slug,cap)==wanted:cand.append(u)
 if item.get('review'):
  cand+= [s['url'] for s in item['review']['sources'] if s['kind']=='manufacturer']
 cand=list(dict.fromkeys(cand));C.append({'id':c['id'],'brand':b,'expectedTokens':wanted,'capacityGB':cap,'candidateURLs':cand})
 tasks += [{'brand':b,'kind':'product','url':u} for u in cand]
# Pages with encoded SKU/numeric IDs require reading their official identity tables.
for b in ['Gigabyte','Palit','Gainward','XFX','Inno3D']:
 tasks += [{'brand':b,'kind':'product','url':u} for u in urls[b]]
H.write_json(D/'indexes/manufacturer-products.json',{b:sorted(u) for b,u in urls.items()});H.write_json(D/'indexes/candidates.json',C);H.write_json(D/'indexes/product-tasks.json',list({t['url']:t for t in tasks}.values()))
print(json.dumps({'indexed':{b:len(u) for b,u in urls.items()},'idsWithCandidate':sum(bool(c['candidateURLs']) for c in C),'tasks':len({t['url'] for t in tasks})}))
