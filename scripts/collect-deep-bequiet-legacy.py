"""Fetch official legacy PSU endpoints discovered by dated manufacturer searches."""
import json,pathlib,re,subprocess
D=pathlib.Path(__file__).resolve().parents[1]/'data/deep-review/power-chassis';m=json.loads((D/'source-manifest.json').read_text());urls=[]
for p in D.glob('search-bq-*.json'):urls.extend(json.loads(p.read_text())['urls'])
for p in json.loads((D/'coverage.json').read_text())['products']:
 if p['brand']=='be quiet!':urls.extend(s['url'] for s in p['sources'])
ks=[]
for u in urls:
 z=re.fullmatch(r'https?://(?:www\.)?bequiet.com/en/powersupply/(\d+)/?',u)
 if not z:continue
 k='bequiet-psu-'+z[1];m[k]='https://www.bequiet.com/en/powersupply/'+z[1]
 if not (D/'sources'/(k+'.json')).exists():ks.append(k)
(D/'source-manifest.json').write_text(json.dumps(m,indent=2));ks=sorted(set(ks));print('new endpoints',len(ks),flush=True)
if ks:subprocess.run(['python3',str(D.parents[2]/'scripts/collect-deep-power-chassis.py'),*ks],check=True)
