"""Reproduce follow-up source extraction; search results are retained separately.

The discovery manifest comes from archived Exa searches (query + objective).
Use --compact after extraction to omit large binary PDFs while preserving their
hashes, extracted text, fetch metadata and the inspected image-only RMi pages.
"""
import argparse, gzip, json, pathlib, subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1]
D=ROOT/'data/deep-review/power-followup'
parser=argparse.ArgumentParser();parser.add_argument('--compact',action='store_true');args=parser.parse_args()
subprocess.run(['python3',str(ROOT/'scripts/deep-power-fetch.py'),'power-followup',str(D/'fetch-urls.json')],cwd=ROOT,check=True)
for path in (D/'sources').glob('*.json'):
    s=json.loads(path.read_text());raw=ROOT/s['rawFile'] if s.get('rawFile') else None
    if s.get('format')=='pdf' and raw and raw.exists():
        binary=gzip.decompress(raw.read_bytes())
        s['rawTextFirst12Pages']=subprocess.run(['pdftotext','-raw','-f','1','-l','12','-','-'],input=binary,capture_output=True,check=True).stdout.decode(errors='replace')
    if args.compact and raw and raw.exists():
        raw.unlink();s.pop('rawFile',None);s['rawRetained']=False
        s['retentionNote']='Original PDF/HTML hash, text and retrieval metadata retained; large binary omitted. Image-only RMi tables retained as inspected page images.'
    path.write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n')
