"""Resumable, anonymous primary-page review for every catalogue variant.

Search results discover candidates only. Each accepted record must also have a
product page, exact variant evidence and explicit primary product metadata.
Run after exporting the catalogue with export-review-input.ts.
"""
import argparse
import asyncio
from collections import Counter
from datetime import datetime, timezone
import hashlib
import html
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import ssl
import time
import unicodedata
from urllib.parse import urlencode, urlparse

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'data/full-review'
CACHE = Path('/tmp/forge-catalog-review-cache-v3')
CONCURRENCY = 10
MAX_BYTES = 4 * 1024 * 1024

def now():
    return datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')

def norm(text):
    text=unicodedata.normalize('NFKD',text).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]','',text)

class Text(HTMLParser):
    def __init__(self):
        super().__init__();self.parts=[];self.skip=0
    def handle_starttag(self,tag,attrs):
        if tag in ('script','style'):self.skip+=1
        elif tag in ('li','p','tr','div','h1','h2','h3','br'):self.parts.append('\n')
    def handle_endtag(self,tag):
        if tag in ('script','style') and self.skip:self.skip-=1
        elif tag in ('li','p','tr','div','h1','h2','h3'):self.parts.append('\n')
    def handle_data(self,data):
        if not self.skip:self.parts.append(data)

def text(html_body):
    p=Text();p.feed(str(html_body or ''))
    return '\n'.join(re.sub(r'\s+',' ',line).strip() for line in ''.join(p.parts).splitlines() if line.strip())

def jsonld(body):
    found=[]
    for raw in re.findall(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',body,re.S|re.I):
        try:
            parsed=json.loads(raw)
            found.extend(parsed if isinstance(parsed,list) else [parsed])
        except (ValueError,TypeError):pass
    return found

def query(c):
    if c.get('manufacturerPartNumber'):return c['manufacturerPartNumber']
    r=c.get('originalRecord') or {};name=r.get('name') or c['brand']+' '+c['name']
    if c['category']=='ram':
        name=re.sub(r'\s+\d+\s+GB$','',name)
        return f"{name} DDR{c.get('memoryType','DDR')[3:]} {c.get('memorySpeedMTs','')} CL{c.get('casLatency','')} {c.get('memorySticks','')}x{int(c.get('capacityGB',0)/max(1,c.get('memorySticks',1)))} {c.get('finishName','')}".strip()
    if c['category']=='gpu':
        return f"{name} {r.get('chipset','')} {r.get('memory',c.get('capacityGB',''))} {c.get('finishName','')}".strip()
    if c['category']=='storage':return f"{name} {c.get('capacityGB','')} Go".strip()
    if c['category']=='psu':return f"{name} {c.get('wattage','')} W".strip()
    return name

def search_products(body):
    found=[]
    for entry in jsonld(body):
        if entry.get('@type','').lower()=='itemlist':
            for row in entry.get('itemListElement',[]):
                item=row.get('item',{})
                if isinstance(item,dict) and item.get('url'):
                    found.append({k:item[k] for k in ['name','url','sku','brand'] if k in item})
    return found

def product(body,url):
    for entry in jsonld(body):
        if str(entry.get('@type','')).lower()=='product':
            result={k:entry[k] for k in ['name','mpn','model','productID','sku','gtin13','gtin','brand','description','offers','itemCondition','url','additionalProperty'] if k in entry}
            section=re.search(r'<div[^>]+id=["\']description["\'][^>]*>(.*?)</div>',body,re.S|re.I)
            if section:result['technicalText']=text(section[1])
            return result
    return None

def number(text_value):
    try:return float(str(text_value).replace(',','.'))
    except (ValueError,TypeError):return None

def candidate_score(c,candidate):
    """Rank discovery only; this never establishes identity or an offer."""
    title=candidate.get('name','');normalized=norm(title)
    score=sum(token in normalized for token in re.findall(r'[a-z0-9]{2,}',query(c).lower()))
    capacity=c.get('capacityGB') or (c.get('originalRecord') or {}).get('memory')
    if capacity and c['category'] in ['storage','gpu','ram']:
        observed={float(value.replace(',','.'))*(1000 if unit.lower() in ['tb','to'] else 1) for value,unit in re.findall(r'\b(\d+(?:[.,]\d+)?)\s*(GB|Go|TB|To)\b',title,re.I)}
        kits={(int(count),int(size)) for count,size in re.findall(r'\b(\d+)\s*[x×]\s*(\d+)\s*(?:GB|Go)\b',title,re.I)}
        if c['category']=='ram':observed|={count*size for count,size in kits}
        if observed:score+=25 if capacity in observed else -25
        if c['category']=='ram' and c.get('memorySticks'):
            expected=(c['memorySticks'],capacity/c['memorySticks'])
            if kits:score+=15 if expected in kits else -15
    return score

def variant_match(c,p):
    """Conservative identity gate; a candidate is never silently substituted."""
    title=p.get('name','');description=text(p.get('description',''))
    whole=title+'\n'+description+'\n'+str(p.get('technicalText',''));flat=norm(whole);tn=norm(title)
    mpn=str(p.get('mpn') or p.get('model') or '').strip()
    if not mpn:return False,['MPN absent de la page produit']
    if c.get('manufacturerPartNumber'):
        return norm(mpn)==norm(c['manufacturerPartNumber']),['Comparaison du MPN explicite']
    r=c.get('originalRecord') or {};category=c['category']
    original=r.get('name') or c['brand']+' '+c['name']
    expected=re.sub(r'\s+\d+\s+GB$','',original)
    if category=='gpu':expected+=' '+r.get('chipset','')
    # RAM product names use both the written form and the same OC abbreviation.
    # This alias does not relax GPU factory-OC identity.
    if category=='ram':
        expected=re.sub(r'\boverclocking\b','OC',expected,flags=re.I)
        tn=norm(re.sub(r'\boverclocking\b','OC',title,flags=re.I))
    # Every significant model word must exist in the primary title, not in an ad.
    words=re.findall(r'[a-z0-9]+',unicodedata.normalize('NFKD',expected).encode('ascii','ignore').decode().lower())
    ignored={'amd','nvidia','geforce','radeon','edition','series','western','digital','g','skill','sea','sonic'}
    missing=[w for w in words if len(w)>1 and w not in ignored and w not in tn]
    if missing:return False,['Modèle différent : '+', '.join(missing)]
    brand=norm(c['brand']);actual_brand=p.get('brand',{})
    actual_brand=actual_brand.get('name','') if isinstance(actual_brand,dict) else str(actual_brand)
    if brand not in norm(title+' '+actual_brand):return False,['Marque non confirmée']
    if category=='psu':
        # Generic families (Smart, FOCUS, Toughpower, X, G...) identify several
        # generations. An anonymous archive row cannot select one by wattage.
        model_text=re.sub(r'(?<=\w)\.(?=\w)','',expected)
        title_text=re.sub(r'(?<=\w)\.(?=\w)','',title)
        # PX-450 is one model discriminator; a 450 W quote on a PX-500 page
        # cannot satisfy it. Keep letter-only suffixes such as PF3-L separate.
        model_text=re.sub(r'(?<=[A-Za-z])-(?=\d)','',model_text)
        title_text=re.sub(r'(?<=[A-Za-z])-(?=\d)','',title_text)
        model_tokens=re.findall(r'\b[a-z0-9]+\b',model_text.lower())
        title_tokens=set(re.findall(r'\b[a-z0-9]+\b',title_text.lower()))
        model_ids=[word for word in model_tokens if any(ch.isdigit() for ch in word)]
        if not model_ids:return False,['Gamme alimentation sans identifiant ou génération précise']
        for identifier in model_ids:
            alternatives={identifier,identifier+'w'} if identifier.isdigit() else {identifier}
            if not alternatives & title_tokens:return False,['Identifiant alimentation différent : '+identifier]
        if any(len(word)==1 and word.isalpha() and word not in title_tokens for word in model_tokens):return False,['Suffixe court alimentation absent du titre']
        for suffix in ['shift','pg5','sfx','ice','dark','ii','iii','iv','s']:
            if (suffix in model_tokens)!=(suffix in title_tokens):return False,['Révision alimentation différente : '+suffix]
        if r.get('type')=='ATX' and re.search(r'\bSFX(?:-L)?\b',title,re.I):return False,['Format alimentation différent']
        efficiency=str(r.get('efficiency') or '').lower()
        tiers={'gold':'gold','or':'gold','platinum':'platinum','platine':'platinum','titanium':'titanium','titane':'titanium','bronze':'bronze','silver':'silver','argent':'silver'}
        observed={tiers[tier.lower()] for tier in re.findall(r'80\s*(?:PLUS|\+)\s*(Gold|Or|Platinum|Platine|Titanium|Titane|Bronze|Silver|Argent)\b',whole,re.I)}
        if efficiency and observed and observed!={efficiency}:return False,['Certification alimentation différente']
        modular=r.get('modular')
        modular_rows='\n'.join(line for line in str(p.get('technicalText','')).splitlines() if re.match(r'^\s*(?:Type de câblage|Modularité|Modulaire)\b',line,re.I))
        cabling=title+'\n'+modular_rows
        actual_modular='Semi' if re.search(r'\bsemi[ -]?modul',cabling,re.I) else 'No' if re.search(r'\bnon[ -]?modul|\bcâbles fixes\b',cabling,re.I) else 'Full' if re.search(r'\bmodul(?:aire|ar)',cabling,re.I) else None
        if modular in ['Full','Semi','No'] and actual_modular and actual_modular!=modular:return False,['Modularité alimentation différente']
    if category=='gpu':
        chip_pattern=r'\b(RTX|GTX|GT|RX)\s*(\d{3,4})(?:\s*(Ti|Super|XTX|XT))?(?:\s*(Super))?'
        expected_chips={norm(''.join(parts)) for parts in re.findall(chip_pattern,str(r.get('chipset','')),re.I)}
        actual_chips={norm(''.join(parts)) for parts in re.findall(chip_pattern,title,re.I)}
        if expected_chips and expected_chips!=actual_chips:return False,['Puce graphique ou suffixe différent']
    if category=='motherboard':
        chipset_pattern=r'\b([ABHXZ]\d{3})(E?)(?:M|I)?(?=[\s+/-]|$)'
        expected_chipsets={norm(''.join(parts)) for parts in re.findall(chipset_pattern,expected,re.I)}
        actual_chipsets={norm(''.join(parts)) for parts in re.findall(chipset_pattern,title,re.I)}
        if expected_chipsets and expected_chipsets!=actual_chipsets:return False,['Chipset différent dans le titre']
    revision_pattern=r'\b(?:r|v|g|rev(?:ision)?\.?)\s*\d+(?:\.\d+)*\b'
    if {norm(v) for v in re.findall(revision_pattern,title,re.I)}!={norm(v) for v in re.findall(revision_pattern,expected,re.I)}:
        return False,['Révision différente ou absente de la ligne archivée']
    for token in ['evo','neo','super','xtx','xt','ti','oc','rgb','max','wifi','ax','v2','ii','iii','sl','lpx','titanium','platinum','royal','pro','plus','se','le']:
        expect=bool(re.search(r'\b'+token+r'\b',expected,re.I))
        actual=bool(re.search(r'\b'+token+r'\b',title,re.I))
        # In PSU titles, 80 PLUS/Cybenetics efficiency classes are attributes,
        # not necessarily suffixes of the commercial model name.
        if category=='psu' and not expect and actual:
            if token=='plus' and re.search(r'\b80\s*PLUS\b',title,re.I):continue
            if token in ['platinum','titanium'] and re.search(r'\b(?:80\s*(?:PLUS|\+)|Cybenetics)\s+'+token+r'\b',title,re.I):continue
        if expect!=actual and (category in ['motherboard','gpu'] or token in ['rgb','neo','sl','lpx','titanium','platinum','royal','pro','plus','se','le']):return False,['Suffixe de variante différent : '+token]
    if category=='psu' and re.search(r'\b20\d{2}\b',title) and not re.search(r'\b20\d{2}\b',expected):return False,['Révision annuelle absente de la ligne archivée']
    if category=='storage':
        gen=re.search(r'PCI(?:e| Express)\s*(\d)',str(r.get('interface','')),re.I)
        title_generations=re.findall(r'(?:PCI(?:e| Express)\s*(?:Gen\s*)?|\bGen\s*)(\d)(?:\.\d)?',title,re.I)
        if gen and title_generations and set(title_generations)!={gen[1]}:return False,['Génération PCIe différente dans le titre']
    if category=='ram':
        required=[c.get('memoryType',''),str(c.get('memorySpeedMTs',''))]
        if not all(norm(v) in flat for v in required if v):return False,['Génération ou débit mémoire non confirmé']
        title_types=re.findall(r'\bDDR\s*([45])\b',title,re.I)
        if title_types and set(title_types)!={str(c.get('memoryType',''))[-1:]}:return False,['Génération mémoire différente dans le titre']
        title_rates=re.findall(r'\b(\d{3,5})\s*(?:MHz|MT/?s)\b',title,re.I)
        if title_rates and set(title_rates)!={str(c.get('memorySpeedMTs'))}:return False,['Débit testé différent dans le titre']
        cas=c.get('casLatency')
        title_cas=re.findall(r'(?:\bCL\s*|Latence\s*CAS\s*[:：]?\s*)(\d+)\b',title,re.I)
        if cas and title_cas and set(title_cas)!={str(cas)}:return False,['Latence CAS différente dans le titre']
        cas_evidence=title if title_cas else '\n'.join(line for line in str(p.get('technicalText','')).splitlines() if re.match(r'^\s*(?:Latence\s*CAS|CAS|CL)\b',line,re.I))
        if cas and not re.search(r'(?:\bCL\s*|Latence\s*CAS\s*[:：]?\s*)'+str(cas)+r'\b',cas_evidence,re.I):return False,['Latence CAS testée non confirmée']
        sticks=c.get('memorySticks');capacity=c.get('capacityGB')
        if not sticks or not capacity:return False,['Composition du kit absente du catalogue']
        size=int(capacity/sticks)
        title_kits=re.findall(r'\b(\d+)\s*[x×]\s*(\d+)\s*(?:G[Bo]|GB)',title,re.I)
        if title_kits and set(title_kits)!={(str(sticks),str(size))}:return False,['Composition différente dans le titre']
        if not re.search(r'\b'+str(sticks)+r'\s*[x×]\s*'+str(size)+r'\s*(?:G[Bo]|GB)',whole,re.I):return False,['Composition exacte du kit non confirmée']
    if category in ['gpu','storage']:
        capacity=c.get('capacityGB') or r.get('memory')
        if capacity:
            patterns=[rf'\b{capacity}\s*G(?:B|o)\b']
            if category=='storage' and capacity>=1000:patterns.append(rf'\b{capacity/1000:g}\s*T(?:B|o)\b')
            if not any(re.search(pattern,whole,re.I) for pattern in patterns):return False,['Capacité exacte non confirmée']
    if category=='psu':
        watts=str(c.get('wattage',0))
        title_watts=re.findall(r'\b(\d+)\s*W(?:att)?',title,re.I)
        if title_watts and set(title_watts)!={watts}:return False,['Puissance contradictoire dans le titre']
        if not re.search(r'\b'+watts+r'\s*W(?:att)?',whole,re.I):return False,['Puissance non confirmée']
    finish=(c.get('finishName') or '').lower()
    if finish:
        color_words={'noir':['noir','black'],'blanc':['blanc','white'],'argent':['argent','silver'],'gris':['gris','gray','grey'],'rouge':['rouge','red'],'bleu':['bleu','blue']}
        expected_colors=set(re.split(r'\s*[/,]\s*',finish))
        if not expected_colors or not expected_colors<=color_words.keys():return False,['Finition multiple ou ambiguë à contrôler']
        title_colors={key for key,words in color_words.items() if any(re.search(r'\b'+w+r'\b',title,re.I) for w in words)}
        if title_colors-expected_colors:return False,['Finition du titre différente ou multiple']
        color_rows='\n'.join(line for line in str(p.get('technicalText','')).splitlines() if re.match(r'^\s*(?:Couleur(?:\s+du\s+(?:produit|radiateur))?|Coloris|Color)\s*:?\s*(?:noir|black|blanc|white|argent|silver|gris|gr[ae]y|rouge|red|bleu|blue)\b',line,re.I))
        row_colors={key for key,words in color_words.items() if any(re.search(r'\b'+w+r'\b',color_rows,re.I) for w in words)}
        if title_colors!=expected_colors and row_colors!=expected_colors:return False,['Finition complète non confirmée dans le titre ou la caractéristique couleur']
        if row_colors and row_colors!=expected_colors:return False,['Couleurs techniques contradictoires ou incomplètes']
    return True,['Modèle, caractéristiques discriminantes et finition concordants ; MPN relevé sur la page.']

async def main(args):
    import aiohttp
    DEST.mkdir(exist_ok=True);CACHE.mkdir(exist_ok=True)
    components=json.loads((DEST/'input.json').read_text())
    if args.limit:components=components[:args.limit]
    log=DEST/'reviews.jsonl';seen=set()
    if args.reparse and log.exists():log.rename(DEST/('reviews-before-reparse-'+str(int(time.time()))+'.jsonl'))
    if log.exists():
        for line in log.read_text().splitlines():
            try:seen.add(json.loads(line)['componentId'])
            except ValueError:pass
    pending=[c for c in components if c['id'] not in seen]
    sem=asyncio.Semaphore(CONCURRENCY);stats=Counter();started=time.monotonic()
    timeout=aiohttp.ClientTimeout(total=30)
    connector=aiohttp.TCPConnector(limit=CONCURRENCY,limit_per_host=6)
    async with aiohttp.ClientSession(trust_env=True,timeout=timeout,connector=connector,headers={'Accept':'text/html'}) as session:
        async def fetch(url):
            key=hashlib.sha256(url.encode()).hexdigest();path=CACHE/(key+'.json')
            if path.exists():return json.loads(path.read_text())
            for attempt in range(3):
                try:
                    async with sem:
                        async with session.get(url,allow_redirects=True,max_redirects=5) as response:
                            chunks=[];size=0;prefix=False
                            async for chunk in response.content.iter_chunked(65536):
                                chunks.append(chunk);size+=len(chunk)
                                if size>MAX_BYTES:break
                                partial=b''.join(chunks)
                                if '/search/' in url:
                                    if re.search(rb'<script[^>]*type="application/ld\+json"[^>]*>[^<]*"@type"\s*:\s*"ItemList"[^<]*</script>',partial,re.S):prefix=True;break
                                elif b'id="description"' in partial and re.search(rb'id="description"[^>]*>.*?</div>',partial,re.S) and re.search(rb'<script[^>]*type="application/ld\+json"[^>]*>[^<]*"@type"\s*:\s*"product"[^<]*</script>',partial,re.S|re.I):prefix=True;break
                            body=b''.join(chunks)
                            if response.status==429:
                                delay=min(180,max(1,int(response.headers.get('Retry-After','15'))));await asyncio.sleep(delay);continue
                            data={'url':str(response.url),'requestedURL':url,'httpStatus':response.status,'checkedAt':now(),'sha256':hashlib.sha256(body).hexdigest(),'digestScope':'response_prefix_through_product_data' if prefix else 'complete_response','html':body.decode('utf-8',errors='replace') if len(body)<=MAX_BYTES else '', 'error':'response_too_large' if len(body)>MAX_BYTES else None}
                    temp=path.with_suffix('.tmp-'+str(id(asyncio.current_task())));temp.write_text(json.dumps(data,ensure_ascii=False));temp.replace(path);return data
                except (aiohttp.ClientError,asyncio.TimeoutError,ValueError) as error:
                    if attempt==2:return {'url':url,'httpStatus':None,'checkedAt':now(),'error':type(error).__name__,'html':''}
                    await asyncio.sleep(attempt+1)
            return {'url':url,'httpStatus':429,'checkedAt':now(),'error':'rate_limited','html':''}

        async def review(c):
            q=query(c);search_url='https://www.pccomponentes.fr/search/?'+urlencode({'query':q})
            response=await fetch(search_url);candidates=search_products(response.get('html',''))
            result={'componentId':c['id'],'query':q,'searchedAt':response['checkedAt'],'searchURL':search_url,'httpStatus':response['httpStatus'],'searchSHA256':response.get('sha256'),'candidateCount':len(candidates),'status':'no_exact_match','primaryPages':[]}
            if response.get('error') or response['httpStatus']!=200:result['status']='access_failed';result['error']=response.get('error')
            elif not any(str(row.get('@type','')).lower()=='itemlist' for row in jsonld(response.get('html',''))):result['status']='search_unreadable'
            # Inspect a bounded set of discovery candidates; capacity and kit
            # matching affect ranking but still require the primary-page gate.
            scored=[]
            for candidate in candidates:
                score=candidate_score(c,candidate)
                scored.append((score,candidate))
            for _,candidate in sorted(scored,key=lambda row:row[0],reverse=True)[:args.candidates]:
                url=candidate['url'];host=urlparse(url).hostname
                if host!='www.pccomponentes.fr':continue
                page=await fetch(url);p=product(page.get('html',''),url)
                item={'url':page['url'],'checkedAt':page['checkedAt'],'httpStatus':page['httpStatus'],'sha256':page.get('sha256'),'digestScope':page.get('digestScope','complete_response'),'name':candidate.get('name')}
                if p and page['httpStatus']==200:
                    accepted,reasons=variant_match(c,p);item.update({'match':accepted,'reasons':reasons,'product':p})
                    if accepted:result['status']='primary_match'
                else:item.update({'match':False,'reasons':['Page produit ou données structurées inaccessibles']})
                result['primaryPages'].append(item)
            matches=[item for item in result['primaryPages'] if item.get('match')]
            if len({norm(str(item['product'].get('mpn') or item['product'].get('model') or '')) for item in matches})>1:
                result['status']='ambiguous_variants'
            with log.open('a') as f:f.write(json.dumps(result,ensure_ascii=False)+'\n')
            stats[result['status']]+=1
            if sum(stats.values())%50==0:print(json.dumps({'done':sum(stats.values()),'previous':len(seen),'remaining':len(pending)-sum(stats.values()),'seconds':round(time.monotonic()-started),'statuses':dict(stats)}),flush=True)
        # Bound task allocation as well as network concurrency for large catalogues.
        for start in range(0,len(pending),100):
            outcomes=await asyncio.gather(*(review(c) for c in pending[start:start+100]),return_exceptions=True)
            for component,outcome in zip(pending[start:start+100],outcomes):
                if isinstance(outcome,BaseException):
                    failure={'componentId':component['id'],'status':'collector_error','searchedAt':now(),'error':type(outcome).__name__+': '+str(outcome)[:160],'primaryPages':[]}
                    with log.open('a') as f:f.write(json.dumps(failure,ensure_ascii=False)+'\n')
                    stats['collector_error']+=1
    print(json.dumps({'finishedAt':now(),'new':sum(stats.values()),'previous':len(seen),'statuses':dict(stats)}),flush=True)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--limit',type=int);parser.add_argument('--candidates',type=int,default=2);parser.add_argument('--reparse',action='store_true')
    asyncio.run(main(parser.parse_args()))
