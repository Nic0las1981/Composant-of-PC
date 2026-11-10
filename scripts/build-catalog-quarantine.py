"""Exclude demonstrated wrong primary matches without replacing saved products."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
entries={}
for name in ['memory-storage-quarantine.json','power-chassis-quarantine.json','board-gpu-quarantine.json']:
 path=root/'data/comprehensive-review'/name
 if path.exists():
  for row in json.loads(path.read_text()):
   entries[row['id']]={'badMPN':row['badMPN'],'reason':row['reason'],'sourceURLs':row.get('sourceUrls',[])}
target=root/'src/data/catalogQuarantine.ts'
target.write_text('// Generated from demonstrated primary-reference mismatches.\nexport const catalogQuarantine:Record<string,{badMPN:string;reason:string;sourceURLs:string[]}> = '+json.dumps(entries,ensure_ascii=False,indent=2)+';\nconst normalize=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]/g,"");\nexport const isQuarantinedReference=(id:string,mpn:string)=>Boolean(catalogQuarantine[id]&&normalize(catalogQuarantine[id].badMPN)===normalize(mpn));\n')
print(f'{len(entries)} documented identity mismatches protected')
