"""Resolve archive model names to canonical ASUS technical endpoints.
These URLs are candidates only; ingestion validates the returned Model field.
"""
import concurrent.futures,hashlib,importlib.util,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-chassis'
s=importlib.util.spec_from_file_location('capture',ROOT/'scripts/collect-deep-power-chassis.py');mod=importlib.util.module_from_spec(s);s.loader.exec_module(mod)
psus=[x for x in json.loads((D/'coverage.json').read_text())['products'] if x['category']=='psu' and x['brand']=='ASUS'];jobs=[];mapping=[];manifest=json.loads((D/'source-manifest.json').read_text())
for c in psus:
 name=c['name'].split(' · ')[0];w=int(re.search(r'· (\d+) W',c['name'])[1]);white='Blanc' in c['name'];n=name.upper();model=None;tail='';prefix='rog';group='rog-strix'
 if n.startswith('TUF'):
  model='TUF-GAMING-'+str(w)+('B' if 'Bronze' in c['name'] else 'G')+('-WHITE' if white else '');prefix='asus';group='tuf-gaming'
 elif n.startswith('PRIME'):
  model=('AP-' if 'Gold' in c['name'] else 'PRIME-')+str(w)+('G' if 'Gold' in c['name'] else 'B');prefix='asus';group='prime'
 elif 'THOR' in n:
  group='rog-thor'
  if 'HATSUNE' in n:model='ROG-THOR-'+str(w)+'P3-HATSUNE-MIKU-EDITION'
  elif 'T3' in n:model='ROG-THOR-'+str(w)+'T3-GAMING'
  elif 'P3' in n:model='ROG-THOR-'+str(w)+'P3-GAMING'+('-WHITE' if white else '')
  elif 'P2' in n:model='ROG-THOR-'+str(w)+'P2-GAMING'+('-EVA-EDITION' if 'EVA' in n else '');tail='-model'
  elif '1600T' in n:model='ROG-THOR-1600T-GAMING';tail='-model'
  else:model='ROG-THOR-'+str(w)+'P';tail='-model'
 elif 'STRIX' in n:
  if 'GUNDAM' in n:model='ROG-STRIX-'+str(w)+'G-GUNDAM-EDITION';tail='-model'
  elif 'AURA' in n:model='ROG-STRIX-'+str(w)+'G-AURA-GAMING'+('-WHITE' if white else '');tail='-model'
  elif 'Platinum' in c['name']:model='ROG-STRIX-'+str(w)+'P-GAMING'+('-WHITE' if white else '')
  else:model='ROG-STRIX-'+str(w)+'G'+('-WHITE' if white else '');tail='-model'
 if not model:continue
 u=('https://www.asus.com/motherboards-components/power-supply-units/'+group+'/'+model.lower()+'/techspec/') if prefix=='asus' else 'https://rog.asus.com/power-supply-units/'+group+'/'+model.lower()+tail+'/spec/'
 k='extra-asus-'+hashlib.sha1(u.encode()).hexdigest()[:10];manifest[k]=u;mapping.append({'id':c['id'],'expectedManufacturerModel':model,'sourceKey':k,'url':u,'derivation':'archive family/power/finish to canonical manufacturer endpoint; returned Model field must agree'})
 if not (D/'sources'/(k+'.json')).exists():jobs.append((k,u))
(D/'asus-model-candidates.json').write_text(json.dumps(mapping,indent=2));(D/'source-manifest.json').write_text(json.dumps(manifest,indent=2))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
 for r in ex.map(lambda j:mod.collect(*j),jobs):print(*r,flush=True)
