"""Freeze the completed source projections and original review identities."""
import gzip
import hashlib
import json
from pathlib import Path

root=Path(__file__).resolve().parents[1]/'data/full-review'
summary=json.loads((root/'summary.json').read_text())
if summary['pending'] or summary['searched']!=summary['total']:
    raise SystemExit('Review incomplete; evidence archive not created.')
checksums={}
for name in ['input.json','reviews.jsonl']:
    raw=(root/name).read_bytes()
    compressed=gzip.compress(raw,compresslevel=9,mtime=0)
    (root/(name+'.gz')).write_bytes(compressed)
    checksums[name+'.gz']={'sha256':hashlib.sha256(compressed).hexdigest(),'uncompressedSHA256':hashlib.sha256(raw).hexdigest(),'uncompressedBytes':len(raw)}
(root/'evidence-checksums.json').write_text(json.dumps(checksums,indent=2)+'\n')
print('Completed review evidence archived with SHA-256 checksums.')
