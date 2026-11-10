"""Follow observed manufacturer product links, preserving index provenance."""
import concurrent.futures,hashlib,importlib.util,json,re,sys,urllib.parse
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-chassis'
spec=importlib.util.spec_from_file_location('capture',ROOT/'scripts/collect-deep-power-chassis.py');mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
brands={'deepcool.com':'DeepCool','antec.com':'Antec','fsplifestyle.com':'FSP','silverstonetek.com':'Silverstone','enermax.com':'Enermax','enermaxeu.com':'Enermax','super-flower.com.tw':'Super Flower','xpg.com':'ADATA','webapi3.adata.com':'ADATA','montechpc.com':'Montech','phanteks.com':'Phanteks','nzxt.com':'NZXT','asus.com':'ASUS','gigabyte.com':'Gigabyte'}
def brand(u):return next((b for d,b in brands.items() if urllib.parse.urlparse(u).hostname==d or (urllib.parse.urlparse(u).hostname or '').endswith('.'+d)),None)
def accept(b,u):
 if not brand(u):return False
 if '.pdf' in u.lower():return True
 return {'DeepCool':r'/PowerSupplyUnits/powersupplyunits/.+shtml','Antec':r'/product/power/','FSP':r'/en/product/','Silverstone':r'/en/product/info/power-supplies/','Enermax':r'/en/products/(?!category|compare)[\w.-]+$|Discontinued|[Pp]ower-[Ss]upplies','Super Flower':r'(?<!/tw)/products-detail/','ADATA':r'/en/xpg/pc-components-','Montech':r'century|titan|apx|beta|gamma','Phanteks':r'/product/(?:am[pd]-|revolt-)|(?:Revolt|Amp-Series)\.html','NZXT':r'/products/c\d|/articles/.+(?:Power-Supply|Power-Suppl|PSU|Gold-Downloads)','ASUS':r'/power-supply-units/(?:tuf-gaming|rog-strix|rog-thor|prime)/[^/?]+/(?:(?:techspec|spec)/)?$','Gigabyte':r'/Power-Supply/(?:GP-|AORUS-)[^/#]+(?:/sp)?$'}.get(b,'$^') and bool(re.search({'DeepCool':r'/PowerSupplyUnits/powersupplyunits/.+shtml','Antec':r'/product/power/','FSP':r'/en/product/','Silverstone':r'/en/product/info/power-supplies/','Enermax':r'/en/products/(?!category|compare)[\w.-]+$|Discontinued|[Pp]ower-[Ss]upplies','Super Flower':r'(?<!/tw)/products-detail/','ADATA':r'/en/xpg/pc-components-','Montech':r'century|titan|apx|beta|gamma','Phanteks':r'/product/(?:am[pd]-|revolt-)|(?:Revolt|Amp-Series)\.html','NZXT':r'/products/c\d|/articles/.+(?:Power-Supply|Power-Suppl|PSU|Gold-Downloads)','ASUS':r'/power-supply-units/(?:tuf-gaming|rog-strix|rog-thor|prime)/[^/?]+/(?:(?:techspec|spec)/)?$','Gigabyte':r'/Power-Supply/(?:GP-|AORUS-)[^/#]+(?:/sp)?$'}.get(b,'$^'),u))
candidates={}
for p in (D/'indexes').glob('*.json'):
 e=json.loads(p.read_text());b=e['brand']
 for a in e.get('links',[]):
  u=a['url'].split('#')[0]
  if accept(b,u):candidates[u]={'brand':b,'url':u,'label':a['text'],'indexURL':e['url']}
for e in json.loads((D/'additional-brand-searches.json').read_text()).values():
 for u in e['urls']:
  b=brand(u)
  if b and accept(b,u):candidates.setdefault(u,{'brand':b,'url':u,'label':'','indexURL':'Exa manufacturer discovery'})
for u,c in list(candidates.items()):
 if c['brand']=='Gigabyte' and not u.endswith('/sp'):
  del candidates[u];c['url']=u+'/sp';candidates[c['url']]=c
 if c['brand']=='ASUS' and not u.endswith(('/techspec/','/spec/')):
  del candidates[u];c['url']=u+('spec/' if 'rog.asus.com' in u else 'techspec/');candidates[c['url']]=c
manifest=json.loads((D/'source-manifest.json').read_text());jobs=[]
for c in candidates.values():
 key='extra-'+re.sub('[^a-z0-9]+','-',c['brand'].lower())+'-'+hashlib.sha1(c['url'].encode()).hexdigest()[:10];c['sourceKey']=key;manifest[key]=c['url']
 if (not sys.argv[1:] or c['brand'] in sys.argv[1:]) and not (D/'sources'/(key+'.json')).exists():jobs.append(c)
(D/'source-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
(D/'additional-candidate-urls.json').write_text(json.dumps(list(candidates.values()),ensure_ascii=False,indent=2))
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
 for c,r in zip(jobs,ex.map(lambda c:mod.collect(c['sourceKey'],c['url']),jobs)):print(c['brand'],*r,flush=True)
