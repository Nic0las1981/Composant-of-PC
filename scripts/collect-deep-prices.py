"""Refresh exact-MPN offers from French retailers, retaining every outcome.

Search pages only discover URLs. Product identity, seller, state, currency and
availability must come from the primary Product/Offer, never aggregate minima.
Run again after export-deep-price-input.ts to add newly resolved identities.
"""
import argparse
import asyncio
from collections import Counter
import hashlib
import html
import importlib.util
import json
from pathlib import Path
import re
from urllib.parse import quote, urlencode, urljoin, urlparse
import aiohttp

ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'data/deep-review/prices'
def module(name,file):
    spec=importlib.util.spec_from_file_location(name,ROOT/'scripts'/file)
    result=importlib.util.module_from_spec(spec);spec.loader.exec_module(result);return result
parser=module('review','collect-catalog-review.py')
offer_parser=module('offers','primary-review-offer.py')
HOSTS={'PcComponentes':'www.pccomponentes.fr','LDLC':'www.ldlc.com','Fnac':'www.fnac.com','Amazon':'www.amazon.fr'}

def identity(p,mpn,retailer):
    explicit=str(p.get('mpn') or p.get('model') or '').strip()
    if explicit:return parser.norm(explicit)==parser.norm(mpn),explicit
    # Fnac's primary Product description frequently publishes the MPN instead
    # of a structured mpn. Only a delimited full code, not a name fragment.
    if retailer=='Fnac' and len(mpn)>=8 and re.search(r'(?<![\w-])'+re.escape(mpn)+r'(?![\w-])',html.unescape(p.get('description','')),re.I):
        return True,mpn
    return False,explicit

def discovery(body,url,retailer):
    if retailer=='PcComponentes':return [p['url'] for p in parser.search_products(body)]
    links=[urljoin(url,html.unescape(u)) for u in re.findall(r'href=["\']([^"\']+)["\']',body,re.I)]
    patterns={'LDLC':r'^https://www\.ldlc\.com/fiche/PB\d+\.html$',
              'Fnac':r'^https://www\.fnac\.com/(?:[^?#]+/)?(?:a|mp)\d+/(?:[^?#]+/)?w-4$',
              'Amazon':r'^https://www\.amazon\.fr/[^?#]*/dp/[A-Z0-9]{10}(?:/|$)'}
    return list(dict.fromkeys(u.split('?')[0] for u in links if re.search(patterns[retailer],u.split('?')[0])))

async def main(args):
    DEST.mkdir(parents=True,exist_ok=True)
    items=json.loads((DEST/'input.json').read_text())
    log=DEST/'observations.jsonl'
    seen=set()
    if log.exists():
        for line in log.read_text().splitlines():
            row=json.loads(line)
            if row['retailer']=='Fnac' and row['status']=='no_exact_match' and row.get('collectorVersion',1)<2:continue
            seen.add((row['componentId'],row['mpn'],row['retailer']))
    jobs=[(c,r) for c in items for r in args.retailers.split(',') if (c['id'],c['mpn'],r) not in seen]
    if args.limit:jobs=jobs[:args.limit]
    counters=Counter();semaphore=asyncio.Semaphore(8);cache={};failures=Counter()
    timeout=aiohttp.ClientTimeout(total=35)
    connector=aiohttp.TCPConnector(limit=8,limit_per_host=3)
    async with aiohttp.ClientSession(trust_env=True,timeout=timeout,connector=connector,headers={'Accept':'text/html'}) as session:
        async def fetch_uncached(url):
            host=urlparse(url).hostname
            if failures[host]>=5:return {'url':url,'checkedAt':parser.now(),'httpStatus':None,'error':'host_temporarily_unavailable','candidates':[],'product':None}
            try:
                async with semaphore,session.get(url,allow_redirects=True,max_redirects=5) as response:
                    chunks=[];size=0
                    async for chunk in response.content.iter_chunked(65536):
                        chunks.append(chunk);size+=len(chunk)
                        if size>4*1024*1024:break
                    raw=b''.join(chunks)
                    body=raw.decode('utf8',errors='replace') if len(raw)<=4*1024*1024 else ''
                    retailer=next((r for r,h in HOSTS.items() if h==host),None)
                    data={'url':str(response.url),'requestedURL':url,'checkedAt':parser.now(),'httpStatus':response.status,'sha256':hashlib.sha256(raw).hexdigest(),'product':parser.product(body,str(response.url)) if response.status==200 else None,'candidates':discovery(body,str(response.url),retailer) if retailer and response.status==200 else []}
                    if response.status in (403,429,503):failures[host]+=1
                    if len(raw)>4*1024*1024:data['error']='response_too_large'
                    return data
            except (aiohttp.ClientError,asyncio.TimeoutError) as e:
                return {'url':url,'checkedAt':parser.now(),'httpStatus':None,'error':type(e).__name__,'candidates':[],'product':None}
        async def fetch(url):
            if url not in cache:cache[url]=asyncio.create_task(fetch_uncached(url))
            return await cache[url]
        async def review(c,retailer):
            mpn=c['mpn'];host=HOSTS[retailer]
            urls=list(dict.fromkeys(s['url'] for s in c['sources']+c['offers'] if urlparse(s['url']).hostname==host and '/search/' not in s['url']))
            search_url={'PcComponentes':'https://www.pccomponentes.fr/search/?'+urlencode({'query':mpn}),
                        'LDLC':'https://www.ldlc.com/recherche/'+quote(mpn,safe='')+'/',
                        'Fnac':'https://www.fnac.com/SearchResult/ResultList.aspx?'+urlencode({'Search':c['brand']+' '+c['name'].split(' · ')[0],'SCat':0,'sft':1}),
                        'Amazon':'https://www.amazon.fr/s?'+urlencode({'k':mpn})}[retailer]
            search=await fetch(search_url)
            tokens=[t for t in re.findall(r'[a-z0-9]+',c['name'].lower()) if len(t)>2]
            candidates=sorted(search.get('candidates',[]),key=lambda u:sum(t in u.lower() for t in tokens),reverse=True)
            urls.extend(u for u in candidates[:3] if u not in urls)
            result={'collectorVersion':2,'componentId':c['id'],'mpn':mpn,'retailer':retailer,'searchedAt':search['checkedAt'],'searchURL':search_url,'searchStatus':search['httpStatus'],'searchSHA256':search.get('sha256'),'status':'no_exact_match','pages':[],'offers':[]}
            if search.get('error') or search['httpStatus']!=200:result.update(status='search_unavailable',error=search.get('error'))
            for url in urls:
                if urlparse(url).hostname!=host:continue
                page=await fetch(url)
                p=page.get('product') if page['httpStatus']==200 else None
                evidence={k:page[k] for k in ('url','requestedURL','checkedAt','httpStatus','sha256','error') if k in page}
                if p:
                    match,observed=identity(p,mpn,retailer)
                    final=urlparse(page['url'])
                    if final.hostname!=host or (retailer=='LDLC' and re.match(r'^/[a-z]{2}-(?!fr(?:/|$))[a-z]{2}/',final.path)):
                        match=False;evidence['rejection']='redirected_outside_confirmed_french_market'
                    metadata_url=p.get('url')
                    if isinstance(metadata_url,str) and metadata_url.startswith('http'):
                        primary=urlparse(metadata_url)
                        if primary.hostname!=final.hostname or primary.path.rstrip('/')!=final.path.rstrip('/'):
                            match=False;evidence['rejection']='structured_product_is_not_the_requested_primary_page'
                    evidence.update(product=p,match=match,observedMPN=observed)
                    if match:
                        result['status']='exact_product_without_admissible_offer'
                        offer=offer_parser.main_offer(p,page,mpn)
                        if offer:
                            offer['retailer']=retailer
                            result['offers'].append(offer);result['status']='exact_offer_observed'
                result['pages'].append(evidence)
            with log.open('a') as stream:stream.write(json.dumps(result,ensure_ascii=False)+'\n')
            counters[result['status']]+=1
            if sum(counters.values())%100==0:print(json.dumps({'done':sum(counters.values()),'jobs':len(jobs),'status':dict(counters)}),flush=True)
        for start in range(0,len(jobs),40):
            batch=jobs[start:start+40]
            outcomes=await asyncio.gather(*(review(c,r) for c,r in batch),return_exceptions=True)
            for (c,r),outcome in zip(batch,outcomes):
                if isinstance(outcome,BaseException):
                    with log.open('a') as stream:stream.write(json.dumps({'componentId':c['id'],'mpn':c['mpn'],'retailer':r,'status':'collector_error','searchedAt':parser.now(),'error':str(outcome),'pages':[],'offers':[]})+'\n')
                    counters['collector_error']+=1
    print(json.dumps({'finishedAt':parser.now(),'new':sum(counters.values()),'status':dict(counters)}),flush=True)

if __name__=='__main__':
    cli=argparse.ArgumentParser();cli.add_argument('--retailers',default=','.join(HOSTS));cli.add_argument('--limit',type=int)
    asyncio.run(main(cli.parse_args()))
