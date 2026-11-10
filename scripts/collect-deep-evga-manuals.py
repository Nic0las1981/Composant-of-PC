"""Capture manufacturer manuals identified in the saved Exa discoveries."""
import json,pathlib,re,subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-chassis';m=json.loads((D/'source-manifest.json').read_text());ks=[]
for p in D.glob('search-evga-*.json'):
 for u in json.loads(p.read_text())['urls']:
  if not re.fullmatch(r'https://www.evga.com/support/manuals/files/[A-Za-z0-9_-]+.pdf',u,re.I):continue
  k='evga-manual-'+u.rsplit('/',1)[1].removesuffix('.pdf').lower();m[k]=u
  if not (D/'sources'/(k+'.json')).exists():ks.append(k)
(D/'source-manifest.json').write_text(json.dumps(m,indent=2));ks=sorted(set(ks));print(len(ks),flush=True)
if ks:subprocess.run(['python3',str(ROOT/'scripts/collect-deep-power-chassis.py'),*ks],check=True)
