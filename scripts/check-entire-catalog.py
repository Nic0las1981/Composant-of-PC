"""Data-integrity review of every variant; does not assert merchant verification."""
from collections import Counter,defaultdict
from datetime import datetime,timezone
import json
import gzip
import argparse
import subprocess
import math
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
input_path=ROOT/'data/full-review/input.json'
rows=json.loads(input_path.read_text() if input_path.exists() else gzip.decompress(input_path.with_suffix('.json.gz').read_bytes()).decode())
parser=argparse.ArgumentParser();parser.add_argument('--current',action='store_true');args=parser.parse_args()
if args.current:
 originals={c['id']:c.get('originalRecord') for c in rows}
 current=subprocess.check_output([str(ROOT/'node_modules/.bin/tsx'),'-e',"import {catalog} from './src/data/catalog.ts'; console.log(JSON.stringify(catalog));"],cwd=ROOT,text=True)
 rows=[{**c,'originalRecord':originals.get(c['id'])} for c in json.loads(current)]
required={
 'cpu':['socket','supportedMemory'],
 'motherboard':['socket','memoryType','formFactor','maxMemoryGB','memorySlots','m2Slots'],
 'gpu':['lengthMm','heightMm','thicknessMm','powerW','recommendedPsuW'],
 'ram':['capacityGB','memorySticks','memoryType','memorySpeedMTs','casLatency','memoryVoltageV','memoryProfile'],
 'storage':['capacityGB','storageInterface'],
 'cooler':['supportedSockets','coolingType','fanCount','fanSizeMm'],
 'psu':['wattage','psuFormat','heightMm','widthMm','depthMm'],
 'case':['supportedFormFactors','maxGpuLengthMm','maxCoolerHeightMm','heightMm','widthMm','depthMm'],
}
ids=Counter(r['id'] for r in rows)
checks=[]
for c in rows:
 errors=[];warnings=[]
 category=c['category']
 if ids[c['id']]!=1:errors.append('Identifiant dupliqué')
 if not c['name'].strip() or not c['brand'].strip():errors.append('Nom ou marque absent')
 for field in ['capacityGB','memorySticks','memorySpeedMTs','casLatency','memorySlots','maxMemoryGB','maxMemoryPerSlotGB','lengthMm','heightMm','thicknessMm','widthMm','depthMm','powerW','recommendedPsuW','wattage']:
  value=c.get(field)
  if value is not None and (not isinstance(value,(int,float)) or not math.isfinite(value) or value<=0):errors.append(field+' invalide')
 if c.get('memoryType') not in [None,'DDR4','DDR5']:errors.append('Génération mémoire inattendue')
 if c.get('socket') not in [None,'AM4','AM5','LGA1700']:errors.append('Socket inattendu')
 if c.get('capacityGB') and c.get('memorySticks') and c['capacityGB']%c['memorySticks']!=0:errors.append('Capacité non divisible par le nombre de modules')
 if c.get('maxMemoryPerSlotGB') and c.get('memorySlots') and c.get('maxMemoryGB') and c['maxMemoryPerSlotGB']*c['memorySlots']<c['maxMemoryGB']:errors.append('Limites mémoire contradictoires')
 if c.get('memoryEcc') and c.get('memoryModuleKind')=='UDIMM':warnings.append('ECC UDIMM : support CPU/carte mère à confirmer')
 if c.get('memoryRegistered') and c.get('memoryModuleKind')=='UDIMM':errors.append('UDIMM ne peut pas être enregistrée')
 if c.get('priceStatus')=='unknown' and c.get('price')!=0:errors.append('Prix brut inconnu non nul')
 if c.get('price',0)<0:errors.append('Prix brut négatif')
 if c.get('source') and not c['source']['url'].startswith('https://'):errors.append('URL source non HTTPS')
 missing=[field for field in required[category] if c.get(field) is None]
 if c.get('originalRecord'):
  original=c['originalRecord']
  if category=='ram':
   modules=original.get('modules') or []
   if len(modules)==2 and c.get('capacityGB')!=modules[0]*modules[1]:errors.append('Capacité différente de la ligne archivée')
   if len(modules)==2 and c.get('memorySticks')!=modules[0]:errors.append('Kit différent de la ligne archivée')
  if category=='storage' and c.get('capacityGB')!=original.get('capacity'):errors.append('Capacité SSD différente de la ligne archivée')
  if category=='psu' and c.get('wattage')!=original.get('wattage'):errors.append('Puissance différente de la ligne archivée')
 checks.append({'id':c['id'],'category':category,'status':'invalid' if errors else 'consistent','errors':errors,'warnings':warnings,'missingCompatibilityFields':missing,'primaryVerification':'separate_check_required'})
report={'generatedAt':datetime.now(timezone.utc).isoformat(),'scope':'data_integrity_only','inputScope':'integrated_catalog' if args.current else 'frozen_pre_review_catalog','total':len(rows),'consistent':sum(c['status']=='consistent' for c in checks),'invalid':sum(c['status']=='invalid' for c in checks),'incompleteCompatibility':sum(bool(c['missingCompatibilityFields']) for c in checks),'categories':dict(Counter(c['category'] for c in checks)),'checks':checks}
(ROOT/'data/full-review/integrity.json').write_text(json.dumps(report,ensure_ascii=False,separators=(',',':'))+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='checks'},ensure_ascii=False,indent=2))
