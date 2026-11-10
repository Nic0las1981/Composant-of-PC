"""Read exact model endpoints omitted by current Gigabyte index; no slug is identity evidence."""
import concurrent.futures,hashlib,importlib.util,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-chassis'
s=importlib.util.spec_from_file_location('capture',ROOT/'scripts/collect-deep-power-chassis.py');mod=importlib.util.module_from_spec(s);s.loader.exec_module(mod)
psus=[x for x in json.loads((D/'coverage.json').read_text())['products'] if x['category']=='psu' and x['brand']=='Gigabyte'];jobs=[];mapping=[];m=json.loads((D/'source-manifest.json').read_text())
for c in psus:
 name=c['name'].split(' · ')[0];w=int(re.search(r'· (\d+) W',c['name'])[1]);white='Blanc' in c['name'];slug=None
 if re.fullmatch(r'(?:GP-)?(?:UD|P|B|G|PW|PB)\d+[A-Z]+(?:-A)?(?: PG5)?(?: \(US\))?',name):slug=name.removeprefix('GP-').replace(' (US)','').replace(' ','-');slug='GP-'+slug
 if name=='P-B':slug='GP-P'+str(w)+'B'
 if name=='AORUS P GM':slug='GP-AP'+str(w)+'GM'
 if name=='AORUS P1200W':slug='GP-AP1200PM'
 if name.startswith('GE-'):slug=name
 if not slug:continue
 if white and 'PG5' not in slug:slug+='-WHITE'
 u='https://www.gigabyte.com/Power-Supply/'+slug+'/sp';k='extra-gigabyte-'+hashlib.sha1(u.encode()).hexdigest()[:10];m[k]=u;mapping.append({'id':c['id'],'candidateModelURL':u,'sourceKey':k})
 if not (D/'sources'/(k+'.json')).exists():jobs.append((k,u))
(D/'gigabyte-model-candidates.json').write_text(json.dumps(mapping,indent=2));(D/'source-manifest.json').write_text(json.dumps(m,indent=2))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
 for r in ex.map(lambda j:mod.collect(*j),set(jobs)):print(*r,flush=True)
