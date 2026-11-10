"""Collect observed G.SKILL overview links, preserving per-response provenance."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import datetime, gzip, hashlib, html, json, re, urllib.request

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT / 'data/deep-review/memory-storage'
OUT = ROOT / 'data/deep-review/memory-followup'
OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'gskill-overviews').mkdir(exist_ok=True)

def clean(s):
    s = re.sub(r'<(script|style)\b[^>]*>.*?</\1>', '', s, flags=re.S|re.I)
    return html.unescape(re.sub(r'\s+', ' ', re.sub('<[^>]+>', ' ', s))).strip()

def collect(target):
    url = target['url']
    stem = hashlib.sha256(url.encode()).hexdigest()[:20]
    metadata = OUT / 'gskill-overviews' / (stem+'.json')
    if metadata.exists():
        return json.loads(metadata.read_text())
    result = dict(target, checkedAt=datetime.datetime.now(datetime.timezone.utc).isoformat())
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request, timeout=45) as response:
            body = response.read()
            result.update(status=response.status, finalURL=response.url)
        path = OUT / 'gskill-overviews' / (stem+'.html.gz')
        path.write_bytes(gzip.compress(body, mtime=0))
        text = clean(body.decode('utf-8', errors='replace'))
        result.update(file=str(path.relative_to(ROOT)), sha256=hashlib.sha256(body).hexdigest(), bytes=len(body),
                      title=clean(re.search(r'<title>(.*?)</title>', body.decode('utf-8', errors='replace'), re.S)[1]),
                      heatPassages=[text[max(0,m.start()-100):m.end()+250] for m in re.finditer(r'heat\s*spread|heat\s*sink', text, re.I)])
    except Exception as error:
        result['error'] = str(error)
    metadata.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
    return result

def main():
    selected = {}
    for record in json.loads((OLD/'gskill-catalog.json').read_text())['records']:
        family = record['family']
        if family in selected:
            continue
        raw = gzip.decompress((ROOT/record['file']).read_bytes()).decode()
        links = re.findall(r'href="([^"]+)"', raw)
        url = next((u for u in links if '/product/' in u and record['mpns'][0] in u), None)
        if url:
            selected[family] = {'family':family, 'mpns':record['mpns'], 'url':('https://www.gskill.com'+url if url.startswith('/') else url), 'specificationURL':record['url']}
    (OUT/'gskill-overview-targets.json').write_text(json.dumps(list(selected.values()),ensure_ascii=False,indent=2)+'\n')
    with ThreadPoolExecutor(max_workers=6) as pool:
        results=list(pool.map(collect, selected.values()))
    (OUT/'gskill-overview-audit.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'pages':len(results),'errors':sum('error' in r for r in results),'withHeatPassages':sum(bool(r.get('heatPassages')) for r in results)}))

if __name__ == '__main__':
    main()
