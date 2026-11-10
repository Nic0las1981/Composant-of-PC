"""Capture public primary pages/PDFs; never derive measurements from illustrations.

Input: data/deep-review/power-chassis/source-manifest.json {key: url}.
Output: dated primary text, HTML tables, image/link inventory and SHA256.
Run: python scripts/collect-deep-power-chassis.py [key ...]
Images are URL-only until a separate visual inspection is recorded.
"""
import concurrent.futures, datetime, hashlib, json, subprocess, sys, tempfile
import urllib.request, urllib.parse
from pathlib import Path
from lxml import html

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data/deep-review/power-chassis'
def collect(key,url):
    result={'key':key,'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
        with urllib.request.urlopen(req,timeout=35) as r:
            raw=r.read();result.update(statusCode=r.status,resolvedURL=r.url,sha256=hashlib.sha256(raw).hexdigest())
        if raw.startswith(b'%PDF'):
            with tempfile.TemporaryDirectory(prefix='component-proof-') as temp:
                p=Path(temp)/'source.pdf';p.write_bytes(raw)
                result['primaryText']=subprocess.check_output(['pdftotext','-layout',str(p),'-'],text=True)
                result['primaryRawText']=subprocess.check_output(['pdftotext','-raw',str(p),'-'],text=True)
            result['format']='pdf'
        else:
            root=html.fromstring(raw,base_url=url)
            images=[]
            for el in root.xpath('//img|//meta[@property="og:image"]'):
                src=el.get('content') or el.get('src') or el.get('data-src')
                if src and not src.startswith('data:'):
                    image={'url':urllib.parse.urljoin(url,src),'alt':el.get('alt',''),'inspection':'url_only'}
                    if image not in images:images.append(image)
            result['images']=images
            result['links']=[{'text':' '.join(el.text_content().split()),'url':urllib.parse.urljoin(url,el.get('href'))} for el in root.xpath('//a[@href]') if '.pdf' in el.get('href','').lower() or any(w in el.text_content().lower() for w in ['download','specification','manual','product sheet'])]
            result['definitionPairs']=[{'label':' '.join(el.xpath('./*[contains(@class,"repeater-item__label")]')[0].text_content().split()),'value':' '.join(el.xpath('./*[contains(@class,"repeater-item__value")]')[0].text_content().split())} for el in root.xpath('//li[contains(@class,"repeater-item")]') if el.xpath('./*[contains(@class,"repeater-item__label")]') and el.xpath('./*[contains(@class,"repeater-item__value")]')]
            result['tables']=[[[' '.join(td.text_content().split()) for td in tr.xpath('./th|./td')] for tr in table.xpath('.//tr')] for table in root.xpath('//table')]
            result['msiSpecifications']=[{'label':' '.join(el.text_content().split()),'value':' '.join(el.getparent().xpath('./*[contains(@class,"cellContent")]')[0].text_content().split())[len(' '.join(el.text_content().split())):]} for el in root.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," cellTitle ")]') if el.getparent().xpath('./*[contains(@class,"cellContent")]')]
            result['variantBlocks']=[{'tag':el.tag,'attributes':dict(el.attrib),'text':'\n'.join(t.strip() for t in el.itertext() if t.strip())} for el in root.xpath('//*[@data-id]') if len(el.text_content())>150 and any(w in ' '.join(el.attrib.values()) for w in ['table','cable'])]
            for el in root.xpath('//script|//style'):el.drop_tree()
            result['primaryText']='\n'.join(line.strip() for line in root.text_content().splitlines() if line.strip())
            result['textSegments']=[t.strip() for t in root.itertext() if t.strip()]
            result['format']='html'
    except Exception as e:result['error']=str(e)
    path=OUT/'sources'/(key+'.json');path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(result,ensure_ascii=False,indent=2))
    return key,result.get('statusCode'),len(result.get('primaryText','')),result.get('error')
if __name__=='__main__':
    manifest=json.loads((OUT/'source-manifest.json').read_text())
    keys=sys.argv[1:] or manifest.keys()
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for r in pool.map(lambda k:collect(k,manifest[k]),keys):print(*r)
