"""Follow manufacturer Product Sheet links to their public Egnyte PDF download."""
import hashlib,json,subprocess
from pathlib import Path
D=Path(__file__).resolve().parents[1]/'data/deep-review/power-chassis';m=json.loads((D/'source-manifest.json').read_text());mapping=[];keys=[]
for p in (D/'sources').glob('cm-legacy-*.json'):
 e=json.loads(p.read_text());rows={r['label']:r['value'] for r in e.get('definitionPairs',[])}
 if not rows.get('Model') or not rows.get('Input Voltage'):continue
 for link in e.get('downloads',[]):
  if 'product sheet' not in link.get('name','').lower():continue
  u=link.get('url',{}).get('url','')
  if u.startswith('https://coolermaster.egnyte.com/dl/'):u=u.replace('/dl/','/dd/',1)
  elif not u.lower().endswith('.pdf'):continue
  k='cm-sheet-'+hashlib.sha1(u.encode()).hexdigest()[:12];m[k]=u;mapping.append({'productSourceKey':e['key'],'productName':e.get('productName'),'manufacturerModel':rows['Model'],'pdfSourceKey':k,'url':u,'originalDownloadLink':link.get('url',{}).get('url')})
  if not (D/'sources'/(k+'.json')).exists():keys.append(k)
(D/'coolermaster-psu-sheet-index.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2));(D/'source-manifest.json').write_text(json.dumps(m,indent=2))
print('sheet links',len(mapping),'new',len(set(keys)),flush=True)
if keys:subprocess.run(['python',str(D.parents[2]/'scripts/collect-deep-power-chassis.py'),*sorted(set(keys))])
