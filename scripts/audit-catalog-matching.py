"""Offline review of candidate-matching changes; never writes runtime catalogue."""
from collections import Counter,defaultdict
import gzip
import json
from pathlib import Path
import runpy

ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data/full-review'
baseline=json.loads((ROOT/'data/individual-review/matching-baseline.json').read_text())
baseline_commit=baseline['sourceCommit']
helpers=runpy.run_path(str(ROOT/'scripts/collect-catalog-review.py'));match=helpers['variant_match'];norm=helpers['norm']
inputs=json.loads(gzip.decompress((D/'input.json.gz').read_bytes()));components={c['id']:c for c in inputs}
previous={id:{'status':baseline['statuses'].get(id,baseline['defaultStatus'])} for id in components}
manual={r['componentId'] for r in json.loads((ROOT/'data/verified-source-manifest.json').read_text())}
market={r['component']['id'] for r in json.loads((ROOT/'data/market-observations.json').read_text())['records']}
accepted={};statuses={};by_mpn=defaultdict(list);page_audits={}
previous_bulk={id:{'mpn':mpn} for id,mpn in baseline['bulkMPNs'].items()}
assert set(previous_bulk)==set(json.loads((ROOT/'data/individual-review/existing-bulk-ids.json').read_text()))
with gzip.open(D/'reviews.jsonl.gz','rt') as stream:
    for line in stream:
        r=json.loads(line);id=r['componentId'];c=components[id];pages=[];page_audits[id]=[]
        for page in r.get('primaryPages',[]):
            p=page.get('product')
            if page.get('httpStatus')==200 and p:
                okay,reasons=match(c,p)
                page_audits[id].append({'url':page['url'],'productName':p.get('name'),'mpn':p.get('mpn') or p.get('model'),'acceptedNow':okay,'reasonsNow':reasons})
                if okay:pages.append(page)
        mpns={norm(str(p['product'].get('mpn') or p['product'].get('model') or '')) for p in pages}
        statuses[id]='primary_match' if len(mpns)==1 else 'ambiguous_variants' if len(mpns)>1 else 'no_exact_match'
        if statuses[id]=='primary_match':
            accepted[id]=pages
            if id not in manual|market:by_mpn[(norm(c['brand']),next(iter(mpns)))].append(id)
for ids in by_mpn.values():
    fingerprints={tuple(str(components[id].get(k,'')) for k in ['category','capacityGB','memorySticks','memoryType','memorySpeedMTs','casLatency','finishName','wattage','socket']) for id in ids}
    if len(fingerprints)>1:
        for id in ids:statuses[id]='conflicting_reference';accepted.pop(id,None)

def describe(id):
    return {'id':id,'category':components[id]['category'],'name':components[id]['name'],'previousStatus':previous[id]['status'],'newStatus':statuses[id],
            'admission':'requires_individual_review' if previous[id]['status']!='primary_match' else 'revalidation_only',
            'previousIntegratedMPN':previous_bulk.get(id,{}).get('mpn'),
            'pages':[{'url':p['url'],'checkedAt':p['checkedAt'],'productName':p['product'].get('name'),'mpn':p['product'].get('mpn') or p['product'].get('model'),'previousPageReasons':p.get('reasons',[])} for p in accepted.get(id,[])],
            'pageAudit':page_audits[id]}
new=[describe(id) for id in accepted if previous[id]['status']!='primary_match' and id not in manual|market]
lost=[describe(id) for id in statuses if previous[id]['status']=='primary_match' and statuses[id]!='primary_match']
withdrawn=[describe(id) for id in previous_bulk if statuses.get(id)!='primary_match']
report={'scope':'Offline revalidation of the frozen primary pages only; no search or price refresh; no runtime catalogue files modified.','baselineCommit':baseline_commit,
        'changes':['RAM Overclocking/OC spelling alias only','Explicit PSU 80 PLUS/Cybenetics certification attributes','Mixed finishes require all source product colors; lighting colors excluded','Capacity-normalized discovery ranking (tested separately; cannot fetch unseen pages offline)'],
        'newUnadmittedCandidates':len(new),'newCandidatesByCategory':dict(Counter(r['category'] for r in new)),
        'newlyRejectedPreviouslyMatched':len(lost),'newCandidates':new,'rejectedPreviousMatches':lost,
        'previousBulkToWithdraw':withdrawn,'retainedPreviousBulkIds':[id for id in previous_bulk if statuses.get(id)=='primary_match'],
        'notes':['The importer must still exclude conflicting identities and preserve individual manufacturer corrections.','Existing stock/prices keep their original checkedAt; a fresh publication must not reset their 24-hour freshness.','New candidates remain retailer matches; the rules do not turn them into manufacturer-verified references.']}
target=ROOT/'data/individual-review/matching-rules-audit.json';target.parent.mkdir(exist_ok=True);target.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['newCandidates','rejectedPreviousMatches','previousBulkToWithdraw','retainedPreviousBulkIds']},ensure_ascii=False,indent=2))
