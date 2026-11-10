"""Collect public manufacturer indexes for every PSU brand in the archive.
Index hits are discovery evidence, never accepted technical facts by themselves.
"""
import concurrent.futures,datetime,hashlib,html,json,re,urllib.parse,urllib.request
from pathlib import Path
from lxml import html as lh
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-chassis';O=D/'indexes';O.mkdir(exist_ok=True)
seeds={
'DeepCool':['https://www.deepcool.com/products/PowerSupplyUnits/index.shtml'],
'Antec':['https://www.antec.com/product/power-series'],
'FSP':['https://www.fsplifestyle.com/en/category/psu.html'],
'Silverstone':['https://www.silverstonetek.com/en/product/power-supplies/','https://www.silverstonetek.com/en/page/PSU-comparison'],
'Enermax':['https://www.enermax.com/en/products/category/power-supply','https://www.enermaxeu.com/service/discontinued/products/psu/index.html'],
'Super Flower':['https://www.super-flower.com.tw/products/Power-Supplies/','https://www.super-flower.com.tw/tw/products/Power-Supplies/LEADEX/','https://www.super-flower.com.tw/sitemap.xml'],
'ADATA':['https://www.xpg.com/us/category/list/pc-components/power-supply','https://webapi3.adata.com/storage/downloadfile/XPG_Catalog_2026_H1_compressed.pdf'],
'Montech':['https://www.montechpc.com/sitemap.xml','https://www.montechpc.com/gold-century-series'],
'Phanteks':['https://phanteks.com/power-supplies/','https://legacy.phanteks.com/PSU.html'],
'NZXT':['https://nzxt.com/collections/power-supplies','https://support.nzxt.com/hc/en-us/sections/39003454445211-Power'],
'ASUS':['https://www.asus.com/us/motherboards-components/power-supply-units/all-series/','https://rog.asus.com/power-supply-units/'],
'Gigabyte':['https://www.gigabyte.com/Power-Supply','https://www.gigabyte.com/Power-Supply/ULTRA-DURABLE'],
}
def get(t):
 brand,url=t;key=re.sub('[^a-z0-9]+','-',brand.lower())+'-'+hashlib.sha1(url.encode()).hexdigest()[:8];p=O/(key+'.json')
 if p.exists():return json.loads(p.read_text())
 r={'brand':brand,'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=30) as x:b=x.read();r.update(statusCode=x.status,resolvedURL=x.url,sha256=hashlib.sha256(b).hexdigest())
  if b.startswith(b'%PDF'):r['format']='pdf';r['links']=[]
  elif '.xml' in url:
   r['links']=[{'url':html.unescape(x),'text':''} for x in re.findall(r'<loc>(.*?)</loc>',b.decode(errors='replace'))];r['format']='xml'
  else:
   root=lh.fromstring(b);r['title']=' '.join(root.xpath('//title/text()'));r['links']=list({urllib.parse.urljoin(url,e.get('href')):{'url':urllib.parse.urljoin(url,e.get('href')),'text':' '.join(e.text_content().split())} for e in root.xpath('//a[@href]')}.values());r['text']='\n'.join(s.strip() for s in root.itertext() if s.strip())[:500000];r['format']='html'
 except Exception as e:r['error']=str(e)
 p.write_text(json.dumps(r,ensure_ascii=False,indent=2));return r
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
  for r in ex.map(get,[(b,u) for b,us in seeds.items() for u in us]):print(r['brand'],r['url'],r.get('statusCode'),len(r.get('links',[])),r.get('error'),flush=True)
