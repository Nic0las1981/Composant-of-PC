"""Follow manufacturer sitemap/HTML redirects missed by the initial GPU index.

Redirects are discovered in saved pages, restricted to manufacturer hosts, and
never treated as specifications before parsing the destination document.
"""
import asyncio
import gzip
import importlib.machinery
import json
import pathlib
import re
import urllib.parse

H = importlib.machinery.SourceFileLoader(
    'gpu_followup_collector', str(pathlib.Path(__file__).with_name('deep-gpu-catalog.py'))
).load_module()

async def main():
    indexes = [{'brand': 'ASUS', 'kind': 'index', 'url': url} for url in (
        'https://rog.asus.com/sitemap/product1.xml',
        'https://rog.asus.com/us/sitemap/product1.xml',
    )]
    H.write_json(H.D / 'indexes/root-followup-index-tasks.json', indexes)
    documents = await H.fetch_batch(indexes)
    urls = set()
    for document in documents:
        for url in document.get('links', []):
            match = re.match(r'https://rog.asus.com/(?:[a-z-]+/)?(graphics-cards/.*?-model/)', url)
            if match:
                urls.add('https://rog.asus.com/' + match[1] + 'spec/')
    tasks = [{'brand': 'ASUS', 'kind': 'product', 'url': url} for url in sorted(urls)]
    H.write_json(H.D / 'indexes/root-rog-product-tasks.json', tasks)
    await H.fetch_batch(tasks)
    redirects = {}
    for path in (H.D / 'sources').glob('*.json'):
        source = json.loads(path.read_text())
        if source['brand'] != 'ASRock' or source.get('status') != 200 or source.get('bytes', 0) >= 1000:
            continue
        raw_path = H.ROOT / source.get('contentFile', '')
        if not raw_path.is_file():
            continue
        raw = gzip.open(raw_path, 'rt').read()
        match = re.search(r'''location.href=['"]([^'"]+)''', raw)
        if not match or urllib.parse.urlparse(match[1]).hostname not in ('pg.asrock.com', 'www.asrock.com', 'tw.asrock.com'):
            continue
        url = urllib.parse.quote(match[1], safe=':/%?&=')
        redirects[url] = {'brand': 'ASRock', 'kind': 'product', 'url': url, 'discoveredOn': source['url']}
    tasks = list(redirects.values())
    H.write_json(H.D / 'indexes/root-asrock-redirect-tasks.json', tasks)
    await H.fetch_batch(tasks)

if __name__ == '__main__':
    asyncio.run(main())
