"""Read retained AMD reference and Intel LE primary documents, scoped per ID.
No facts from partner designs or memory/anniversary variants are borrowed.
"""
from pathlib import Path
import json,gzip,re,hashlib,datetime,copy
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/gpu'
def clean(s):return re.sub(r'\s+',' ',s).strip()
def documents():
 out=[]
 for f in (D/'indexes').glob('exa-reference-pages-*.json'):
  data=json.loads(f.read_text());t='\n'.join(c.get('text','') for c in data.get('content',[]));marks=list(re.finditer(r'^# ([^\n]+)\nURL: (\S+)',t,re.M))
  for i,m in enumerate(marks):
   body=t[m.end():marks[i+1].start() if i+1<len(marks) else len(t)]
   out.append({'title':m[1],'url':m[2],'body':body,'checkedAt':data.get('capturedAt',datetime.datetime.fromtimestamp(f.stat().st_mtime,datetime.timezone.utc).isoformat()),'contentFile':str(f.relative_to(ROOT)),'sha256':hashlib.sha256(body.encode()).hexdigest(),'digestScope':'exa-full-document-text','status':200})
 return out
AMD_KEYS=['Name','Family','Series','Board Type','Launch Date','OS Support','Additional Power Connector','Compute Units','Boost Frequency','Game Frequency','Ray Accelerators','AI Accelerators','Peak Pixel Fill-Rate','Peak Texture Fill-Rate','Peak Single Precision (FP32 Vector) Performance','Peak Half Precision (FP16 Vector) Performance','Peak Half Precision (FP16 Matrix) Performance','Peak 8-bit Precision (INT8 Matrix) Performance','Peak 4-bit Precision (INT4 Matrix) Performance','ROPs','Stream Processors','Texture Units','Transistor Count','Typical Board Power (Desktop)','Minimum PSU Recommendation','Recommended Power Supply','AMD Infinity Cache Technology','Memory Speed','Max Memory Size','Memory Type','Memory Interface','Memory Bandwidth','Effective Memory Bandwidth','HDMI™ 4K Support','4K H264 Decode','4K H264 Encode','H265/HEVC Decode','H265/HEVC Encode','AV1 Decode','AV1 Encode','DisplayPort™','HDMI™','USB Type-C','Length','Slots','Supported Technologies']
def amd(doc):
 t=doc['body'];start=re.search(r'(?m)^\s*-?\s*## General\s*$',t)
 if not start:return None
 t=t[start.end():];v={};key=None
 for line in t.splitlines():
  line=clean(line)
  if line in AMD_KEYS:key=line;v[key]=''
  elif line.startswith('#') or line.startswith('- ##'):key=None
  elif key and line:v[key]=clean(v[key]+' '+line)
 name=v.get('Name','');cap=re.fullmatch(r'(\d+) GB',v.get('Max Memory Size',''));model=re.search(r'RX\s*\d+(?:\s*(?:XTX|XT))?',name)
 if not cap or not model:return None
 p={'capacityGB':int(cap[1])}
 for label,key in [('Length','lengthMm'),('Typical Board Power (Desktop)','powerW'),('Minimum PSU Recommendation','recommendedPsuW')]:
  m=re.fullmatch(r'(\d+(?:\.\d+)?)\s*(?:mm|W)',v.get(label,''))
  if m:p[key]=float(m[1])
 return {'brand':'AMD','model':'Radeon '+model[0],'mpn':'','capacityGB':int(cap[1]),'values':v,'patch':p,'notes':['Dimensions et TBP du design AMD de référence uniquement. Le nombre de slots ne fournit pas une épaisseur millimétrique. Les codes commerciaux régionaux ne sont pas déduits du seul nom de GPU.'],'source':{k:v for k,v in doc.items() if k not in ['title','body']}}
def intel(doc,docs):
 if '/products/sku/' not in doc['url']:return None
 model=re.search(r'Arc.*?([AB]\d{3})',doc['title'])
 if not model:return None
 v={}
 for line in doc['body'].splitlines():
  if not line.startswith('|'):continue
  cells=[clean(x) for x in line.strip('|').split('|')]
  if len(cells)==2 and not re.fullmatch(r'[- :]+',cells[0]):v[cells[0]]=cells[1].split(' Copy ')[0]
 cap=re.search(r'(\d+) GB',v.get('Memory',v.get('Memory Size','')))
 if not cap:return None
 p={'capacityGB':int(cap[1])};extras=[];field_evidence={};notes=['La fiche ARK décrit le GPU. Les dimensions et connecteurs physiques proviennent uniquement de la section Reference Card ou de l’article dédié aux cartes Limited Edition. Aucun nombre de slots n’est converti en millimètres.']
 m=re.fullmatch(r'(\d+) W',v.get('TBP TBP',''))
 if m:p['powerW']=int(m[1])
 m=re.fullmatch(r'(\d+) x (\d+) mm',v.get('Dimensions (Length x Width)',''))
 if m:p.update(lengthMm=int(m[1]),heightMm=int(m[2]))
 m=re.fullmatch(r'(\d+) W',v.get('Minimum Power Supply Unit',''))
 if m:p['recommendedPsuW']=int(m[1])
 if model[1]=='A750':
  dims=next(d for d in docs if '/000092554/' in d['url']);requirements=next(d for d in docs if '/000091128/' in d['url'])
  for label,key in [('Length with I/O Bracket','lengthMm'),('Width including PCI CON + I/O Bracket','heightMm'),('Height with Shroud + I/O bracket','thicknessMm')]:
   m=re.search(re.escape(label)+r'\s*=\s*([\d.]+)\s*mm',dims['body'],re.I);assert m,label
   p[key]=float(m[1]);v[label]=m[1]+' mm'
   field_evidence[key]={'value':p[key],'sourceURL':dims['url'],'checkedAt':dims['checkedAt']}
  assert 'Minimum 600W power supply' in requirements['body']
  p['recommendedPsuW']=600;v['Alimentation de la carte Limited Edition']='600 W minimum ; 1 × 8 broches + 1 × 6 broches'
  field_evidence['recommendedPsuW']={'value':600,'sourceURL':requirements['url'],'checkedAt':requirements['checkedAt']}
  extras=[{'name':'Intel — carte Limited Edition','url':d['url'],'checkedAt':d['checkedAt'],'kind':'manufacturer'} for d in [dims,requirements]]
  notes.append('Dimensions hors-tout avec équerre retenues. L’ancienne longueur de 250 mm est contredite par la mesure Intel : 268,6 mm sans équerre, 279,9 mm avec équerre.')
 return {'brand':'Intel','model':'Arc '+model[1]+' Limited Edition','mpn':'','capacityGB':int(cap[1]),'values':v,'patch':p,'notes':notes,'fieldEvidence':field_evidence,'additionalSources':extras,'source':{k:v for k,v in doc.items() if k not in ['title','body']}}
def main():
 docs=documents();facts=[]
 for d in docs:
  r=amd(d) if 'amd.com/' in d['url'] else intel(d,docs) if 'intel.com/' in d['url'] else None
  if r:facts.append(r)
 inputs=json.load(gzip.open(D/'input.json.gz','rt'));out=[]
 for item in inputs:
  c=item['component'];o=item.get('original') or {}
  if c['brand'] not in ['AMD','Intel']:continue
  text=o.get('chipset',c['name']);chip=re.search(r'(?:RX\s*\d+(?:\s*(?:XTX|XT))?|Arc\s*[AB]\d{3})',text,re.I)
  if not chip or 'Anniversary' in c['name']:continue
  match=[r for r in facts if r['brand']==c['brand'] and r['capacityGB']==c['capacityGB'] and chip[0].lower() in r['model'].lower()]
  # Whole chip equality (RX 6800 must never match RX 6800 XT).
  match=[r for r in match if re.search(r'(?:RX\s*\d+(?:\s*(?:XTX|XT))?|Arc\s*[AB]\d{3})',r['model'],re.I)[0].lower()==chip[0].lower()]
  if not match:continue
  r=copy.deepcopy(max(match,key=lambda r:len(r['values'])));r['source'].update(brand=r['brand'],requestedURL=r['source']['url']);r.update(catalogIds=[c['id']],reviewPipeline='reference-primary',identityKind='manufacturer-model',identityEvidence={'method':'manufacturer_reference_model_and_capacity','archiveName':o.get('name'),'publishedModel':r['model'],'capacityGB':r['capacityGB'],'sourceURL':r['source']['url']});out.append(r)
 (D/'reference-additional-model-facts.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print({'models':len(facts),'catalogueRecords':len(out),'brands':{b:sum(r['brand']==b for r in out) for b in ['AMD','Intel']}})
if __name__=='__main__':main()
