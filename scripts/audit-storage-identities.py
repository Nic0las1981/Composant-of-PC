"""Compare every storage ID against its original fields and exact-page evidence.
No product is admitted on the basis of this audit. Absent source fields stay
unverified. M.2 form codes, capacities and PCIe generations/lanes are compared
separately; retailer interface typos are distinguished from wrong-SKU matches.
"""
from pathlib import Path
import json,gzip,re,collections,datetime,argparse,subprocess
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data/comprehensive-review';E=D/'memory-storage-evidence'
items=json.loads(gzip.decompress((E/'input.json.gz').read_bytes()));original={x['id']:x for x in json.loads(gzip.decompress((ROOT/'data/full-review/input.json.gz').read_bytes()))}
recovered=json.loads((E/'recovered-retailer-tables.json').read_text());quarantine={x['id']:x for x in json.loads((D/'memory-storage-quarantine.json').read_text())}
name_references=json.loads((E/'name-reference-products.json').read_text()) if (E/'name-reference-products.json').exists() else {}
parser=argparse.ArgumentParser();parser.add_argument('--current',action='store_true');args=parser.parse_args()
runtime={}
if args.current:
 runtime=json.loads(subprocess.check_output(['node','--import','tsx','--input-type=module','-e','import {verifiedProducts} from "./src/data/verifiedCatalog.ts";console.log(JSON.stringify(verifiedProducts));'],cwd=ROOT,text=True))
def generation(s):return {int(n) for n in re.findall(r'PCI\s*(?:e|express)\s*(?:(?:gen(?:eration|ération)?|r[eé]vision)\s*)?([345])(?:[.,]0)?',s,re.I)}
def lanes(s):return {int(n) for n in re.findall(r'[x×]\s*(1|2|4|8|16)(?!\d)',s,re.I)}
def form(s):return set(re.findall(r'\b(2230|2242|2260|2280|22110)\b',s))
rows=[]
for item in items:
 c=item['component']
 if c['category']!='storage':continue
 id=c['id'];o=original[id];raw=o.get('originalRecord') or {};p=name_references.get(id) or item.get('verified');groups=[r for g in (p or {}).get('groups',[]) for r in g['rows']]+recovered.get(id,{}).get('rows',[])
 if args.current:
  p=runtime.get(id);groups=[r for g in (p or {}).get('groups',[]) for r in g['rows']]
 original_format=raw.get('form_factor') or ' '.join(o.get('specs',[]));original_interface=raw.get('interface') or o['name'];original_cap=raw.get('capacity') or o.get('capacityGB')
 formatrows=[r for r in groups if r['label'].lower() in ['format','format m.2','format et interface','format de disque','facteur de forme ssd','facteur de forme du disque ssd','taille du ssd m.2','taille du disque dur','connecteur usb','version usb']]
 interfacerows=[r for r in groups if any(t in r['label'].lower() for t in ['interface','protocole','format et interface']) and not any(t in r['label'].lower() for t in ['nvme','commande','vitesse','haute vitesse','performances'])]
 caprows=[r for r in groups if r['label'].lower() in ['capacité','capacité totale','capacité nominale','capacité du solid state drive (ssd)','ssd, capacité','capacité disque dur']]
 capacities=set()
 for r in caprows:
  m=re.fullmatch(r'\s*(\d+(?:[.,]\d+)?)\s*(Go|GB|To|TB)\s*',r['value'],re.I)
  if m:capacities.add(float(m[1].replace(',','.'))*(1000 if m[2].lower() in ['to','tb'] else 1))
 source_form=form(' '.join(r['value'] for r in formatrows));source_gen=generation(' '.join(r['value'] for r in interfacerows));source_lanes=lanes(' '.join(r['value'] for r in interfacerows))
 original_form=form(original_format);original_gen=generation(original_interface);original_lanes=lanes(original_interface) if original_gen else set()
 conflicts=[]
 if original_form and source_form and not original_form&source_form:conflicts.append({'field':'formFactor','original':sorted(original_form),'source':sorted(source_form)})
 if capacities and original_cap not in capacities and (id,original_cap,tuple(sorted(capacities))) not in [('ssd-kc3000-1',1000,(1024,)),('ssd-kc3000-2',2000,(2048,))]:conflicts.append({'field':'capacityGB','original':original_cap,'source':sorted(capacities)})
 if original_gen and source_gen and not original_gen&source_gen:conflicts.append({'field':'pcieGeneration','original':sorted(original_gen),'source':sorted(source_gen)})
 if original_lanes and source_lanes and not original_lanes&source_lanes:conflicts.append({'field':'pcieLanes','original':sorted(original_lanes),'source':sorted(source_lanes)})
 missing=[]
 if not p:missing.append('exactPrimaryIdentity')
 if not source_form:missing.append('sourceFormFactor')
 if not source_gen:missing.append('sourcePcieGeneration')
 if not source_lanes:missing.append('sourcePcieLanes')
 if not capacities:missing.append('sourceCapacity')
 status='quarantined' if id in quarantine else 'source_conflict' if conflicts else 'no_primary_reference' if not p else 'primary_fields_partial' if missing else 'compared_fields_consistent'
 rows.append({'id':id,'name':o['name'],'mpn':(p or {}).get('mpn'),'status':status,'original':{'formFactor':original_format,'interface':original_interface,'capacityGB':original_cap,'source':o.get('source')},'source':{'formFactors':sorted(source_form),'pcieGenerations':sorted(source_gen),'pcieLanes':sorted(source_lanes),'capacityGB':sorted(capacities),'rows':formatrows+interfacerows+caprows,'urls':[s['url'] for s in (p or {}).get('sources',[])]},'conflicts':conflicts,'missing':missing,'quarantine':quarantine.get(id)})
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Every one of the 832 storage catalog IDs; no identity or price inferred for missing sources. Structural consistency is not complete product verification.','summary':{'total':len(rows),'retainedCandidatePrimaryRecords':sum(bool(x['mpn']) for x in rows),'statusCounts':dict(collections.Counter(x['status'] for x in rows))},'records':rows}
report['inputScope']='integrated_catalog' if args.current else 'archived_candidate_evidence'
(D/('storage-runtime-audit.json' if args.current else 'storage-identity-audit.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report['summary'],indent=2));print(json.dumps([{'id':x['id'],'mpn':x['mpn'],'conflicts':x['conflicts']} for x in rows if x['conflicts']],ensure_ascii=False,indent=2))
