"""Exclude demonstrated wrong primary matches without replacing saved products."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
entries={}
paths=[root/'data/comprehensive-review'/name for name in ['memory-storage-quarantine.json','power-chassis-quarantine.json','board-gpu-quarantine.json']]
paths += list((root/'data/deep-review').glob('*/quarantine.json'))
for path in paths:
 if path.exists():
  for row in json.loads(path.read_text()):
   mpn=row.get('badMPN') or row.get('badMpn')
   if not mpn:raise ValueError(f'Missing rejected MPN in {path}: {row}')
   urls=row.get('sourceURLs') or row.get('sourceUrls') or ([row['sourceURL']] if row.get('sourceURL') else [])
   entries[row['id']]={'badMPN':mpn,'reason':row['reason'],'sourceURLs':urls}
# A rejection caused by an archive error may be resolved only by an explicit
# manufacturer correction for that same ID and MPN. Retain the original file;
# validate the replacement facts before removing the active exclusion.
resolutions=[]
for path in (root/'data/deep-review').glob('*/quarantine-resolutions.json'):
 for row in json.loads(path.read_text()):
  identifier=row['id'];previous=entries[identifier]
  assert previous['badMPN']==row['mpn'],identifier
  product=json.loads((root/row['productFile']).read_text())[identifier]
  assert product['mpn']==row['mpn'] and product.get('identityKind')!='manufacturer-model',identifier
  assert any(s['kind']=='manufacturer' and s['url']==row['sourceURL'] for s in product['sources']),identifier
  assert row['sourceURL'].startswith('https://'),identifier
  for field,value in row['requiredPatch'].items():
   assert product['patch'].get(field)==value,(identifier,field)
  for field,value in row['requiredEvidence'].items():
   proof=product.get('fieldEvidence',{}).get(field,{})
   assert proof.get('value')==value and proof.get('sourceURL')==row['sourceURL'] and not proof.get('conflicting'),(identifier,field)
  resolutions.append({**row,'previousExclusion':previous})
  del entries[identifier]
(root/'data/deep-review/resolved-quarantine.json').write_text(json.dumps(resolutions,ensure_ascii=False,indent=2)+'\n')
target=root/'src/data/catalogQuarantine.ts'
target.write_text('// Generated from demonstrated primary-reference mismatches.\nexport const catalogQuarantine:Record<string,{badMPN:string;reason:string;sourceURLs:string[]}> = '+json.dumps(entries,ensure_ascii=False,indent=2)+';\nconst normalize=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]/g,"");\nexport const isQuarantinedReference=(id:string,mpn:string)=>Boolean(catalogQuarantine[id]&&normalize(catalogQuarantine[id].badMPN)===normalize(mpn));\n')
print(f'{len(entries)} documented identity mismatches protected; {len(resolutions)} manufacturer corrections reconciled')
