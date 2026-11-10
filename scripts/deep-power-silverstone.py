"""Read exact SilverStone product specifications and manufacturer comparison rows.
Legacy and current product paths are discovery candidates only; a page must
publish its Product No., power and scoped technical specification block.
"""
import pathlib,json,re,hashlib,collections,copy
ROOT=pathlib.Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-silverstone'
INPUT=json.loads((D/'input.json').read_text());COMP=json.loads((D/'comparison-rows.json').read_text())
N=lambda s:re.sub('[^a-z0-9]','',s.lower())
LABELS=['Product No.','Model (safety certification)','Color','Max. DC Output','Peak DC Output','Power density','Load Range','Combined +3.3V & +5V','Combined +12V','Input Voltage','Input Frequency Range','PFC','Efficiency','MTBF','Operating temperature','Protection','Connectors','Cooling System','Noise Level','Certification','Form factor','Dimension','Weight','Other']
def documents():
 out=[]
 for f in sorted(D.glob('fetch-*.json')):
  raw=json.loads(f.read_text());text='\n'.join(c.get('text','') for c in raw['result'].get('content',[]) if c.get('type')=='text');starts=list(re.finditer(r'^URL: (https://[^\s]+)',text,re.M))
  for i,m in enumerate(starts):
   body=text[m.end():starts[i+1].start() if i+1<len(starts) else len(text)]
   out.append({'url':m[1],'text':body,'checkedAt':raw['capturedAt'],'artifact':str(f.relative_to(ROOT)),'sha256':hashlib.sha256(body.encode()).hexdigest(),'digestScope':'exa-extracted-primary-document'})
 return list({r['url']:r for r in out}.values())
def parse(doc):
 t=doc['text'];start=t.find('Product Specifications')
 if start<0 or '.pdf' in doc['url']:return None
 head=[s.strip().lstrip('# ') for s in t[:start].splitlines() if s.strip() and not s.strip().startswith('Author:')];model=re.sub(r'(?: --)+$','',head[0]).strip() if head else ''
 section=re.split(r'● Specifications|\nOther\b|\n## |\n\*?\s*Specifications presented',t[start+len('Product Specifications'):],maxsplit=1)[0];vals={};cur=None
 for line in section.splitlines():
  line=line.strip()
  if not line:continue
  key=next((k for k in LABELS if line==k or line.startswith(k+' ')),None)
  if key:cur=key;vals[cur]=line[len(key):].strip()
  elif cur:vals[cur]+=' '+line
 vals={k:v.strip() for k,v in vals.items() if v.strip()}
 codes=[x.upper() for x in re.findall(r'SST-[A-Z0-9-]+',vals.get('Product No.',''),re.I)];w=re.match(r'(\d+)\s*W',vals.get('Max. DC Output',''),re.I)
 if not codes or not w or len(vals)<6:return None
 patch={'wattage':int(w[1])}
 dims=vals.get('Dimension','');dm=re.search(r'([\d.]+)\s*mm\s*\(W\)\s*[x×]\s*([\d.]+)\s*mm\s*\(H\)\s*[x×]\s*([\d.]+)\s*mm\s*\(D\)',dims,re.I)
 if dm and not re.search(r'V[1-9]:',dims):patch.update(widthMm=float(dm[1]),heightMm=float(dm[2]),depthMm=float(dm[3]))
 fan=re.search(r'(\d+)\s*mm',vals.get('Cooling System',''),re.I)
 if fan:patch.update(fanCount=1,fanSizeMm=int(fan[1]))
 if re.search('fan.?less|passive',vals.get('Cooling System',''),re.I) and not fan:patch['fanCount']=0
 if 'ATX' in vals.get('Form factor',''):patch['psuFormat']='ATX'
 return {'model':model,'mpns':list(dict.fromkeys(codes)),'values':vals,'patch':patch,'source':doc,'section':section}
def archive_attributes(c):
 name=c['name'].split(' · ')[0];cert=re.search(r'80 PLUS(?: (Titanium|Platinum|Gold|Silver|Bronze))?',c['name']);cert=(cert[1] or 'Standard') if cert else None
 modular='Fully modular' if 'Entièrement modulaire' in c['name'] else 'semi-modular' if 'Semi-modulaire' in c['name'] else 'Fixed'
 return name,cert,modular

def comparison_candidates(c):
 name,cert,mod=archive_attributes(c);rows=[]
 for r in COMP:
  if r['wattage']!=str(c['wattage'])+'W' or cert and r['certification'].lower()!=cert.lower() or r['modularity'].lower()!=mod.lower():continue
  series=r['series'].replace(' Series','');model=r['model']
  if N(name)==N(model) or N(name+' '+str(c['wattage'])+' '+(cert or ''))==N(model):rows.append(r);continue
  allowed=False
  if name=='Strider Titanium':allowed=series=='Strider Titanium'
  elif name=='Strider Platinum':allowed=series=='Strider Platinum' and not model.endswith('PTS')
  elif name=='Strider Platinum S':allowed=series=='Strider Platinum' and model.endswith('PTS')
  elif name=='Strider Plus':allowed=series=='Strider Plus'
  elif name=='Strider':allowed=model.startswith('ST')
  elif name=='Essential':allowed=series=='Essential'
  elif name=='Nightjar':allowed=series=='Nightjar'
  elif name=='VIVA':allowed=series=='VIVA'
  if allowed:rows.append(r)
 return list({(r['model'],r['format'],r['fan']):r for r in rows}.values())
def main():
 docs=documents();parsed=[r for d in docs if (r:=parse(d))];out={};audit=[]
 for c in INPUT:
  name,cert,mod=archive_attributes(c);comp=comparison_candidates(c);compkeys={N(r['model']) for r in comp};eligible=[]
  # A bare series and capacity cannot pick one of several listed model/revision codes.
  ambiguous=len(compkeys)>1;legacy_alternatives=[]
  if name in ['Strider','Strider Plus']:
   for q in parsed:
    if q['patch']['wattage']!=c['wattage'] or not re.match('ST',q['model']) or 'NF' in q['model']:continue
    qc=re.search(r'80 PLUS(?: (Titanium|Platinum|Gold|Silver|Bronze))?',q['values'].get('Certification',''),re.I);qc=(qc[1] or 'Standard').lower() if qc else None
    if qc != (cert or '').lower():continue
    qfull=bool(re.search(r'(100%|full(?:y)?).{0,5}modular',q['source']['text'][:q['source']['text'].find('Product Specifications')],re.I))
    if (mod=='Fully modular')!=qfull:continue
    legacy_alternatives.append(q)
   if len({m for q in legacy_alternatives for m in q['mpns']})>1 or any(re.search(r'\bV[. ]?\d',q['model'],re.I) for q in legacy_alternatives):ambiguous=True
  for r in parsed:
   if r['patch']['wattage']!=c['wattage']:continue
   direct=N(name)==N(r['model']) or (cert and r['model'].lower().endswith(' '+cert.lower()) and N(name)==N(re.sub(r'\s+(Gold|Platinum|Titanium|Bronze|Silver)$','',r['model'],flags=re.I))) or any(N(name)==N(m.removeprefix('SST-')) for m in r['mpns'])
   if name=='Nightjar' and c['wattage']==400 and 'SST-ST40NF' in r['mpns'] and any('NIGHTJAR SERIES' in d['text'] and 'SST-ST40NF' in d['text'] for d in docs):direct=True
   if name=='Zeus' and c['wattage']==1350 and 'SST-ZM1350' in r['mpns'] and 'Zeus ZM1350' in r['source']['text']:direct=True
   in_comp=not ambiguous and len(compkeys)==1 and (N(r['model']) in compkeys or any(N(m.removeprefix('SST-')) in compkeys for m in r['mpns']))
   if not (direct or in_comp):continue
   if ambiguous and not direct:continue
   # Explicit version qualifiers in the source require the same qualifier in archive/comparison.
   rev=re.search(r'\bv[. ]?(\d+(?:\.\d+|\.x)?)',r['model'],re.I)
   if rev and not re.search(r'\bv[. -]?'+re.escape(rev[1]),name,re.I):continue
   white=c['name'].split(' · ')[-1]=='Blanc';codes=r['mpns']
   if white:
    if not re.search('white',r['values'].get('Color',''),re.I):continue
    codes=[m for m in codes if m.upper().endswith(('-WWW','-WBW'))]
   else:codes=[m for m in codes if not m.upper().endswith(('-WWW','-WBW'))]
   if len(codes)!=1:continue
   # Different depths under one comparison name signal a generation ambiguity.
   relevant=[x for x in comp if N(x['model'])==N(r['model'])]
   if len({x['format'] for x in relevant})>1:continue
   eligible.append((r,codes[0]))
  skus={N(m) for _,m in eligible}
  conflicts={k:sorted({str(r['patch'][k]) for r,_ in eligible if k in r['patch']}) for k in ['depthMm','widthMm','heightMm','fanSizeMm','fanCount']}
  conflicts={k:v for k,v in conflicts.items() if len(v)>1}
  if conflicts:ambiguous=True;skus=set()
  if len(skus)!=1:
   audit.append({'id':c['id'],'name':c['name'],'state':'ambiguous_models_or_revisions' if ambiguous or len(skus)>1 else 'no_unique_exact_primary_table','comparisonCandidates':comp,'conflictingFields':conflicts,'legacyAlternatives':[{'mpns':q['mpns'],'model':q['model'],'url':q['source']['url']} for q in legacy_alternatives],'primaryCandidates':[{'model':r['model'],'mpn':m,'url':r['source']['url']} for r,m in eligible],'requiredDiscriminants':['Exact model code','Revision','Black/white finish','Continuous wattage / certification / modularity']});continue
  r,mpn=max(eligible,key=lambda x:len(x[0]['values']));patch=copy.deepcopy(r['patch']);source=r['source'];rows=[{'label':k,'value':v} for k,v in r['values'].items() if k not in ['Product No.','Other']];rows.insert(0,{'label':'Référence fabricant exacte','value':mpn})
  patch['specs']=[str(patch['wattage'])+' W']+([r['values']['Form factor']] if 'Form factor' in r['values'] else [])+([r['values']['Certification']] if 'Certification' in r['values'] else [])+([r['values']['Cooling System']] if 'Cooling System' in r['values'] else [])
  if r['values'].get('Certification','').startswith('Cybenetics') and '80 PLUS' in c['name']:patch['name']=re.sub(r'80 PLUS (Gold|Platinum|Titanium|Bronze|Silver)',r['values']['Certification'],c['name'])
  patch.update(manufacturerPartNumber=mpn,detailLevel='partial',description='Alimentation SilverStone '+r['model']+' de '+str(c['wattage'])+' W. Caractéristiques et connectique publiées pour la référence '+mpn+' ; les valeurs non renseignées restent à confirmer.')
  notes=['La puissance continue reste distincte de la puissance de crête. Les axes de dimensions sont repris uniquement lorsqu’ils sont explicitement notés W, H et D.','Les tableaux et descriptions concernent le modèle exact publié ; les variantes, codes de certification de sécurité et révisions ne sont pas utilisés comme alias arbitraires.']
  if any(re.search(r'V[1-9]:',v) for v in r['values'].values()):notes.append('La page publie plusieurs révisions dans certaines lignes ; elles restent explicitement séparées, sans sélectionner une révision de dimensions par défaut.')
  if len(r['mpns'])>1:notes.append('La page fabricant publie côte à côte les finitions noire et blanche ; la référence suffixée WWW/WBW est conservée pour la finition blanche explicite.')
  record={'identityKind':'mpn','mpn':mpn,'identityNote':'Nom ou code de modèle exact, puissance, modularité, certification et finition rapprochés avec la page technique SilverStone et son comparatif lorsque nécessaire.','sources':[{'name':'SilverStone — fiche technique du modèle','url':source['url'],'checkedAt':source['checkedAt'],'kind':'manufacturer'}],'groups':[{'title':'Spécifications constructeur SilverStone','rows':rows}],'patch':patch,'offers':[],'notes':notes,'fieldEvidence':{k:{'value':v,'sourceURL':source['url'],'checkedAt':source['checkedAt']} for k,v in r['patch'].items()}}
  if name=='Nightjar' and c['wattage']==400:
   d=next(d for d in docs if 'NIGHTJAR SERIES' in d['text'] and 'SST-ST40NF' in d['text']);record['sources'].append({'name':'SilverStone — manuel Nightjar ST40NF','url':d['url'],'checkedAt':d['checkedAt'],'kind':'manufacturer'})
  if comp:record['sources'].append({'name':'SilverStone — comparatif des séries et révisions','url':'https://www.silverstonetek.com/en/page/PSU-comparison','checkedAt':next(d['checkedAt'] for d in docs if d['url'].endswith('/PSU-comparison')),'kind':'manufacturer'})
  out[c['id']]=record;audit.append({'id':c['id'],'name':c['name'],'state':'primary_specs_enriched','mpn':mpn,'url':source['url'],'comparisonCandidates':comp,'missingFields':[k for k in ['depthMm','widthMm','heightMm','fanSizeMm'] if k not in patch]})
 (D/'visual-references.json').write_text(json.dumps([{'id':id,'mpn':r['mpn'],'sourceURL':r['sources'][0]['url'],'visuallyInspected':False,'imageURLs':[]} for id,r in out.items()],ensure_ascii=False,indent=2))
 (D/'documents.json').write_text(json.dumps(docs,ensure_ascii=False,indent=2));(D/'parsed-products.json').write_text(json.dumps(parsed,ensure_ascii=False,indent=2));(D/'products.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));(D/'review.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2));(ROOT/'src/data/deepPowerSilverstoneCatalog.ts').write_text("// Generated from individual SilverStone primary specification tables.\nimport type { VerifiedProduct } from './verifiedTypes'\n\nexport const deepPowerSilverstoneProducts: Record<string, VerifiedProduct> = "+json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'documents':len(docs),'parsedProducts':len(parsed),'accepted':len(out),'states':dict(collections.Counter(x['state'] for x in audit))}))
if __name__=='__main__':main()
