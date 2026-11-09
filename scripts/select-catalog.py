#!/usr/bin/env python3
"""Select real source records, retain existing IDs, and group finish variants.

No network access is performed. Source file hashes are verified before selection.
Run scripts/import-catalog.ts afterwards to regenerate the application catalogue.
"""
import json,re,hashlib,unicodedata,argparse
from pathlib import Path
from collections import defaultdict,Counter
parser=argparse.ArgumentParser(description='Expand the checked-in catalogue using immutable upstream JSON files.')
parser.add_argument('--source-dir',required=True,type=Path)
parser.add_argument('--baseline-json',type=Path,help='Original 200 reference snapshot, needed only for the first expansion.')
args=parser.parse_args()
root=args.source_dir
repository=Path(__file__).resolve().parents[1]
out=repository/'data'
previous=json.loads((out/'catalog-source.json').read_text())
base=previous['selection'].get('baselineRecords')
if base is None:
 if not args.baseline_json:raise SystemExit('--baseline-json is required for the first expansion')
 base=json.loads(args.baseline_json.read_text())
assert len(base)==previous['selection']['baselineCount']==200

def norm(s):return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower())
def full(c):return c['name'] if norm(c['name']).startswith(norm(c['brand'])) else c['brand']+' '+c['name']
def bare(s):
 s=re.sub(r'Dominator Titanium RGB','Dominator Titanium',s,flags=re.I)
 s=re.sub(r'\b(?:DDR[45](?:[- ]\d+)?|CL\d+|EXPO|XMP)\b','',s,flags=re.I)
 s=re.sub(r'\b\d+(?:[.,]\d+)?\s*(?:GB|Go|TB|To)\b','',s,flags=re.I)
 s=re.sub(r'\b(?:Blanc|Blanche|White|Noir|Black)\b','',s,flags=re.I)
 return norm(s)
def ram_key(r):return '|'.join(map(str,[bare(r['name']),*r['speed'],*r['modules'],r['cas_latency'],(r.get('color')or'').split(' / ')[0].lower()]))
def base_ram_key(c):
 specs=' '.join(c['specs']); speed=re.search(r'DDR[45][ -](\d+)',specs);cl=re.search(r'CL(\d+)',specs)
 if not speed or not cl:return None
 return '|'.join(map(str,[bare(full(c)),int(c['memoryType'][-1]),int(speed[1]),c['memorySticks'],c['capacityGB']/c['memorySticks'],int(cl[1]),'white' if re.search(r'Blanc|White',c['name'],re.I) else 'black']))
def canonical_ram_key(k):return k.replace('.0|','|') if k else None
base_ram={canonical_ram_key(base_ram_key(c)).rsplit('|',1)[0] for c in base if c['category']=='ram' and base_ram_key(c)}
def ssd_family(s):
 s=re.sub(r'Western Digital|WD_BLACK|WD Black|WD Blue|WD\b','wd',s,flags=re.I)
 s=re.sub(r'\bBLACK\b|\bBlue\b','',s,flags=re.I)
 return bare(s)
base_ssd={(ssd_family(full(c)),c['capacityGB']) for c in base if c['category']=='storage'}
chip_re=re.compile(r'(?:GeForce\s+)?(?:RTX|GTX)\s*\d{3,4}(?:\s*Ti)?(?:\s*SUPER)?|(?:Radeon\s+)?RX\s*\d{3,4}(?:\s*(?:XTX|XT|GRE))?|(?:Intel\s+)?Arc\s*[AB]\d{3}',re.I)
def gpu_chip(s):
 m=chip_re.search(s)
 return norm(re.sub(r'GeForce|Radeon|Intel','',m[0],flags=re.I)) if m else None
def gpu_family(s):
 original=s
 s=chip_re.sub('',s)
 if original.startswith('Intel ') and not s.startswith('Intel '):s='Intel '+s
 s=re.sub(r'\b(?:OC|Edition|GAMING|BLACK|WHITE|Blanc|Noir)\b|\b\d+\s*(?:GB|Go|G)\b','',s,flags=re.I)
 return norm(s)
base_gpu=set()
for c in base:
 if c['category']=='gpu':
  memory=c.get('capacityGB')
  if not memory:
   m=re.search(r'(\d+)\s*Go',' '.join(c['specs']));memory=int(m[1]) if m else None
  base_gpu.add((gpu_chip(c['name']),gpu_family(full(c)),memory))
def psu_family(s,watts):
 s=re.sub(r'\(20\d\d\)','',s)
 s=re.sub(r'\b(?:W|Watt)\b','',s,flags=re.I)
 s=s.replace(str(watts),'').replace(f'{watts:,}'.replace(',',' '),'')
 return norm(s)
base_psu={(psu_family(full(c),c['wattage']),c['wattage']) for c in base if c['category']=='psu'}
base_mb={norm(full(c)).replace('ddr4','d4').replace('ddr5','d5') for c in base if c['category']=='motherboard'}
known_ram=re.compile(r'^(Corsair (Vengeance|Dominator)|G\.Skill (Ripjaws V|Ripjaws S5|Trident Z|Trident Z5|Flare X|Flare X5|Aegis)|Kingston (FURY (Beast|Renegade)|HyperX (Fury|Predator))|TEAMGROUP (T-Force|T-Create)|Patriot Viper|Silicon Power (GAMING|XPOWER)|ADATA XPG|Crucial (Pro|Ballistix))',re.I)
known_psu=re.compile(r'^(?:Corsair|MSI|be quiet!|SeaSonic|Seasonic|Cooler Master|Thermaltake|Super Flower|FSP|Silverstone|SilverStone|Enermax|Deepcool|DeepCool|Montech|ADATA|Asus|ASUS|Gigabyte|NZXT|Phanteks|Antec|EVGA)\b',re.I)
known_gpu=re.compile(r'^(?:MSI|Asus|ASUS|Gigabyte|Sapphire|XFX|PowerColor|ASRock|Zotac|PNY|Palit|Gainward|Inno3D|NVIDIA|AMD|Intel|Sparkle|Acer)\b',re.I)

def eligible(kind,r):
 if kind=='memory':
  return isinstance(r.get('speed'),list) and r['speed'][0] in [4,5] and r['modules'][0] in [1,2,4] and r['modules'][1] in [4,8,16,24,32,48,64] and 2000<=r['speed'][1]<=7200 and isinstance(r.get('cas_latency'),(int,float)) and 8<=r['cas_latency']<=64 and known_ram.search(r['name']) and not re.search(r'SO.?DIMM|\bECC\b|Registered|RDIMM|CUDIMM|Impact|Renegade Pro|T-Create Master|T-Create Classic|Vengeance Performance|T-Force Zeus|\bCKD\b|\bCUDIMM\b|CAMM2|^Corsair Vengeance \d|^Crucial Ballistix(?: Sport(?: LT)?)? \d|^Patriot Viper (?:Steel|4) \d',r['name'],re.I) and canonical_ram_key(ram_key(r)).rsplit('|',1)[0] not in base_ram
 if kind=='internal-hard-drive':return not re.search(r'RGB|ARGB',r['name'],re.I) and brand(r) in ['Kingston','Samsung','Western Digital','Silicon Power','Klevv','Crucial','TEAMGROUP','SK','Patriot','Sabrent','Lexar','MSI','PNY','Acer','Corsair','KIOXIA','Gigabyte','Mushkin','ADATA','Intel','Inland','Seagate','SanDisk','Asus','Solidigm','Netac','GOODRAM','Addlink','HP','Apacer','Nextorage','Micron','Toshiba','Transcend','XPG','Plextor','Synology'] and r['type']=='SSD' and r['form_factor']=='M.2-2280' and re.search(r'PCIe [45]\.0',r['interface']) and 240<=r['capacity']<=8000 and (ssd_family(r['name']),r['capacity']) not in base_ssd
 if kind=='video-card':
  chip=gpu_chip(r['chipset']); family=gpu_family(r['name']);
  return bool(chip and known_gpu.search(r['name']) and re.search(r'rtx[2345]|gtx16|rx[5679]\d\d\d|arc[ab]',chip) and isinstance(r.get('length'),(int,float)) and 140<=r['length']<=420 and isinstance(r.get('memory'),(int,float)) and 4<=r['memory']<=32 and (chip,family,r['memory']) not in base_gpu and not any((chip,brand(r).lower(),r['memory'])==x for x in base_gpu))
 if kind=='motherboard':return r['socket'] in ['AM4','AM5','LGA1700'] and r['form_factor'] in ['ATX','Micro ATX','Mini ITX'] and r['memory_slots'] in [2,4] and r['max_memory'] in [32,64,96,128,192,256] and norm(r['name']).replace('ddr4','d4').replace('ddr5','d5') not in base_mb
 if kind=='power-supply':return not re.search(r'RGB|ARGB|SFX[ -]?L|SF\d+L|ROG LOKI',r['name'],re.I) and not (r['type']=='SFX' and (r['name'].startswith('Silverstone') or re.search(r'SGX|Dagger',r['name'],re.I))) and r['type'] in ['ATX','SFX'] and (r['type']=='ATX' or re.search(r'^(?:Corsair SF|Cooler Master V.*SFX|EVGA SuperNOVA \d+ GM|be quiet! SFX Power)',r['name'],re.I)) and 400<=r['wattage']<=1600 and bool(known_psu.search(r['name']) or r['name'].lower().startswith('be quiet! ')) and (psu_family(r['name'],r['wattage']),r['wattage']) not in base_psu
 return False

def identity(kind,r):
 if kind=='memory':return canonical_ram_key(ram_key(r))
 if kind=='internal-hard-drive':return '|'.join(map(str,[ssd_family(r['name']),r['capacity']]))
 if kind=='video-card':return '|'.join(map(str,[norm(r['name']),gpu_chip(r['chipset']),r['memory'],r.get('color'),r['length']]))
 if kind=='motherboard':return norm(r['name']).replace('ddr4','d4').replace('ddr5','d5')
 if kind=='power-supply':return '|'.join(map(str,[norm(r['name']),r['wattage'],r['type'],r.get('color')]))

def brand(r):
 for b in ['be quiet!','Cooler Master','Super Flower','Silicon Power','Western Digital','G.Skill']:
  if r['name'].lower().startswith(b.lower()+' '):return b
 return r['name'].split(' ')[0]

def bucket(kind,r):
 if kind=='memory':return f"{r['speed'][0]}-{r['modules'][0]}-{brand(r)}"
 if kind=='internal-hard-drive':return f"{r['capacity']}-{brand(r)}"
 if kind=='video-card':return f"{gpu_chip(r['chipset'])}-{brand(r)}"
 if kind=='motherboard':return f"{r['socket']}-{r['memory_slots']}-{brand(r)}"
 if kind=='power-supply':return f"{r['type']}-{r['wattage']}-{brand(r)}"

# A colour word is only removed when the source itself declares that finish and
# the word is a suffix, possibly followed by OC or the RAM capacity. Brand and
# family names such as WD_BLACK, Blackout, Black Edition and Steel Legend remain.
def neutral_name(record):
 name=record['name'].strip()
 for color in (record.get('color') or '').split(' / '):
  if color not in ['Black','White','Red','Blue','Silver','Gray','Grey','Pink','Purple','Green','Orange','Yellow']:continue
  suffix=r'(?=\s*(?:(?:OC|O\.C\.)\s*)?(?:\d+(?:\.\d+)?\s*GB)?$)'
  name=re.sub(r'\s+'+re.escape(color)+suffix,'',name,flags=re.I)
  if color!='Black':
   name=re.sub(r'\s+'+re.escape(color)+r'\s+Edition'+suffix,'',name,flags=re.I)
 return re.sub(r'\s+',' ',name).strip()

def unicode_norm(value):
 # Preserve meaningful Unicode model characters (e.g. T-Force Vulcanα).
 return re.sub(r'[\W_]+','',unicodedata.normalize('NFKC',str(value)).casefold())

def canonical(value):
 return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False)

def group_identity(kind,record):
 name=neutral_name(record)
 fields={'type':kind,'model':unicode_norm(name),'rgbNamed':bool(re.search(r'RGB',name,re.I))}
 if kind=='memory':
  fields.update(speed=record['speed'],modules=record['modules'],cas=record['cas_latency'])
 elif kind=='internal-hard-drive':
  fields.update(capacity=record['capacity'],interface=record['interface'],format=record['form_factor'],storageType=record['type'])
 elif kind=='video-card':
  # Isolated clock discrepancies do not establish another manufacturer model.
  # OC/revision words in the model name remain part of the identity.
  fields.update(chipset=record['chipset'],memory=record['memory'],length=record['length'])
 elif kind=='motherboard':
  fields.update(socket=record['socket'],formFactor=record['form_factor'],maxMemory=record['max_memory'],memorySlots=record['memory_slots'])
 elif kind=='power-supply':
  fields.update(wattage=record['wattage'],format=record['type'],efficiency=record['efficiency'],modular=record['modular'])
 return canonical(fields)

source_types=['memory','internal-hard-drive','video-card','motherboard','power-supply']
prefixes={'memory':'ram','internal-hard-drive':'ssd','video-card':'gpu','motherboard':'mb','power-supply':'psu'}
manifest=previous['source']
source_rows={}
for kind in source_types:
 filename=kind+'.json'
 content=(root/filename).read_bytes()
 assert hashlib.sha256(content).hexdigest()==manifest['files'][filename]['sha256'],f'Upstream hash mismatch: {filename}'
 source_rows[kind]=json.loads(content)

selected=[]
seen_variants=set()
seen_ids=set()
legacy_ids=set(previous['selection'].get('legacyIds',[item['id'] for item in previous['records']]))
duplicates_preserved=[]
motherboard_max_memory={}
psu_known_efficiency=set()
for record in source_rows['power-supply']:
 if record.get('efficiency') is not None:
  psu_known_efficiency.add((unicode_norm(neutral_name(record)),record['wattage'],record['type'],str(record['modular'])))

def add_record(kind,index,record,legacy=None):
 if kind=='motherboard':
  model_key=(unicode_norm(neutral_name(record)),record['socket'],record['form_factor'],record['memory_slots'])
  previous_max=motherboard_max_memory.setdefault(model_key,record['max_memory'])
  if previous_max!=record['max_memory'] and legacy is None:return
 if kind=='power-supply' and record.get('efficiency') is None and legacy is None:
  model_key=(unicode_norm(neutral_name(record)),record['wattage'],record['type'],str(record['modular']))
  if model_key in psu_known_efficiency:return
 group_key=group_identity(kind,record)
 variant_key=canonical({'group':json.loads(group_key),'finish':record.get('color')})
 if variant_key in seen_variants and legacy is None:return
 if variant_key in seen_variants:duplicates_preserved.append(legacy['id'])
 seen_variants.add(variant_key)
 record_hash=hashlib.sha256(canonical(record).encode()).hexdigest()
 if legacy is not None:
  assert record_hash==legacy['recordHash'],f'Legacy row changed: {legacy["id"]}'
  item=dict(legacy)
 else:
  item={'sourceType':kind,'sourceIndex':index,'recordKey':variant_key,'record':record,'recordHash':record_hash,
        'id':'import-'+prefixes[kind]+'-'+hashlib.sha256(variant_key.encode()).hexdigest()[:12]}
 assert item['id'] not in seen_ids,f'Duplicate ID: {item["id"]}'
 seen_ids.add(item['id'])
 item['variantGroupKey']=group_key
 item['variantGroupId']='family-'+prefixes[kind]+'-'+hashlib.sha256(group_key.encode()).hexdigest()[:16]
 item['neutralName']=neutral_name(record)
 selected.append(item)

# Existing saved configurations retain every one of their original component IDs.
for item in previous['records']:
 if item['id'] not in legacy_ids:continue
 kind=item['sourceType'];index=item['sourceIndex']
 add_record(kind,index,source_rows[kind][index],legacy=item)

for kind in source_types:
 for index,record in enumerate(source_rows[kind]):
  if eligible(kind,record):add_record(kind,index,record)

assert legacy_ids <= seen_ids
counts={kind:sum(row['sourceType']==kind for row in selected) for kind in source_types}
group_counts={kind:len({row['variantGroupId'] for row in selected if row['sourceType']==kind}) for kind in source_types}
assert sum(group_counts.values())>=5000,'Count distinct families, not colour variants, towards the minimum'
selection={
 'description':'All eligible real source references; finish variants grouped; original IDs retained. No synthetic product variants.',
 'baselineCount':len(base),'baselineIds':[c['id'] for c in base],'baselineRecords':base,
 'counts':counts,'groupCounts':group_counts,'groupCount':sum(group_counts.values()),
 'legacyIds':sorted(legacy_ids),'preservedDuplicateAliases':duplicates_preserved,
 'identityVersion':2,
 'excludedAmbiguousRamFamilies':['Vengeance (plain)','Vengeance Performance','Ballistix (plain/Sport/Sport LT)','Viper Steel / Viper 4 (plain)','FURY Renegade Pro','T-Create Master / Classic','T-Force Zeus','SO-DIMM/RDIMM/CUDIMM/CAMM2 names'],
}
snapshot={'schemaVersion':2,'source':manifest,'selection':selection,'records':selected}
temporary=out/'catalog-source.json.tmp'
temporary.write_text(json.dumps(snapshot,ensure_ascii=False,separators=(',',':'))+'\n')
temporary.replace(out/'catalog-source.json')
print(json.dumps({'variants':len(selected),'groups':sum(group_counts.values()),'counts':counts,'groupCounts':group_counts,'preservedIds':len(legacy_ids),'duplicateLegacyAliases':duplicates_preserved},indent=2))

