"""Verify discovered PC21 pages live: exact MPN, TTC/EUR, new and in stock.

Indexed search prices are not imported. Native HTML and hashes are retained.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import datetime,gzip,hashlib,html,json,re,urllib.request

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data/deep-review/memory-followup'
PAGES=OUT/'price-pages';PAGES.mkdir(exist_ok=True)
def clean(s):return html.unescape(re.sub(r'\s+',' ',re.sub('<[^>]+>',' ',s))).strip()
def read(path):return json.loads(path.read_text())
def collect(target):
    url,mpn=target['url'],target['mpn'];stem=hashlib.sha256(url.encode()).hexdigest()[:20]
    metaPath=PAGES/(stem+'.json')
    if metaPath.exists() and 'error' not in read(metaPath):return read(metaPath)
    meta=dict(target,checkedAt=datetime.datetime.now(datetime.timezone.utc).isoformat())
    try:
        previous=metaPath if metaPath.exists() else OUT/(stem+'.json')
        if previous.exists():meta.update(read(previous));meta.pop('error',None);meta.pop('offer',None);raw=gzip.decompress((ROOT/meta['file']).read_bytes())
        else:
            with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=35) as res:
                raw=res.read();meta.update(status=res.status,finalURL=res.url)
            path=PAGES/(stem+'.html.gz');path.write_bytes(gzip.compress(raw,mtime=0));meta.update(file=str(path.relative_to(ROOT)),sha256=hashlib.sha256(raw).hexdigest())
        doc=raw.decode('utf-8',errors='replace');text=clean(doc)
        assert meta['status']==200 and meta['finalURL'].startswith('https://www.pc21.fr/fiche/')
        assert re.search(r'Référence G\.Skill\s*:\s*'+re.escape(mpn)+r'(?=\s|$)',text)
        price=re.findall(r"itemprop=['\"]price['\"] content=['\"]([\d.]+)['\"]",doc)
        currencies=re.findall(r"itemprop=['\"]priceCurrency['\"] content=['\"]([^'\"]+)['\"]",doc)
        assert len(price)==1 and currencies==['EUR'], 'Ambiguous price/currency'
        assert re.search(r"itemprop=['\"]itemCondition['\"] href=['\"]https?://schema.org/NewCondition",doc),'New condition not established'
        assert re.search(r"itemprop=['\"]availability['\"] href=['\"]https?://schema.org/InStock",doc) and 'EN STOCK' in text,'Not explicitly available'
        visible=re.findall(r"class=['\"]prix_produit_ttc['\"]>(.*?)</span>",doc,re.S)
        visiblePrice=next((clean(x)for x in visible if '€' in clean(x)),None)
        assert visiblePrice and float(re.sub(r'[^\d,]','',visiblePrice).replace(',','.'))==float(price[0]),'Visible TTC mismatch'
        update=re.search(r'Mise à jour le\s*(\d{2}/\d{2}/\d{4})\s*à\s*(\d{2}:\d{2})',text)
        assert update,'Missing merchant update date'
        title=clean(re.search(r'<h1[^>]*>(.*?)</h1>',doc,re.S)[1])
        meta['offer']={'retailer':'PC21','seller':'PC21','url':url,'productName':title,'mpn':mpn,'retailerReference':re.search(r'-i(\d+)\.html',url)[1],'amount':float(price[0]),'currency':'EUR','market':'FR','condition':'new','availability':'in_stock','priceKind':'current','shipping':None,'shippingNote':'Prix TTC hors livraison ; frais et total livré en France à confirmer.','checkedAt':meta['checkedAt']}
        stock=re.search(r'EN STOCK\s*[\d\s]+pièces?',text)
        meta['evidence']={'literalMPN':mpn,'visibleTTC':visiblePrice,'condition':'http://schema.org/NewCondition','availability':'http://schema.org/InStock','currency':'EUR','merchantUpdatedAtLocal':update[1]+' '+update[2],'stockText':stock[0] if stock else 'EN STOCK'}
    except Exception as error:meta['error']=str(error) or type(error).__name__
    metaPath.write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n');return meta
def main():
    products=read(OUT/'new-products.json');codes={v['mpn']for v in products.values()if v['mpn']};targets={}
    for path in OUT.glob('exa-*price*.json'):
        payload=read(path);response=payload.get('response',{});text='\n'.join(b.get('text','')for b in response.get('content',[]))
        for url in re.findall(r'^URL: (https://www\.pc21\.fr/fiche/\S+)',text,re.M):
            for mpn in codes:
                if '/'+mpn.lower()+'-' in url:targets[url]={'url':url,'mpn':mpn,'discoveryFile':str(path.relative_to(ROOT))}
    with ThreadPoolExecutor(max_workers=4)as pool:results=list(pool.map(collect,targets.values()))
    (OUT/'prices.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'pages':len(results),'eligible':sum('offer'in r and 'error'not in r for r in results),'errors':[{'mpn':r['mpn'],'error':r['error']}for r in results if 'error'in r]}))
if __name__=='__main__':main()
