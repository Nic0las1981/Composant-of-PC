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
target=root/'src/data/catalogQuarantine.ts'
target.write_text('// Generated from demonstrated primary-reference mismatches.\nexport const catalogQuarantine:Record<string,{badMPN:string;reason:string;sourceURLs:string[]}> = '+json.dumps(entries,ensure_ascii=False,indent=2)+';\nconst normalize=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]/g,"");\nexport const isQuarantinedReference=(id:string,mpn:string)=>Boolean(catalogQuarantine[id]&&normalize(catalogQuarantine[id].badMPN)===normalize(mpn));\n')
print(f'{len(entries)} documented identity mismatches protected')
