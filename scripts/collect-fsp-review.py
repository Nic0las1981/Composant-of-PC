"""FSP exact-name/model-code matching, with generation and white variants retained."""
import json,pathlib,re,collections
ROOT=pathlib.Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-fsp';BASE=ROOT/'data/deep-review/power-chassis';INPUT=json.loads((D/'input.json').read_text())
def norm(s):
 s=s or ''
 s=re.sub(r'(?<=\d)\s*W\b','',s,flags=re.I)
 return re.sub(r'[^a-z0-9+]','',s.lower())
def source_info(d):
 rows={r[0]:r[1] for t in d.get('tables',[]) for r in t if len(r)==2};text=d.get('primaryText','');intro=text.split('Home\nProducts')[-1].split('Other Model')[0];lines=intro.splitlines();title=next((s for s in lines if re.search(r'\b\d{3,4}\s*W',s,re.I)),lines[0] if lines else '')
 for target,labels in {'Model':['モデル番号','メーカー型番','Modèle','Modell','型號'],'Rated Output Power':['定格出力','Puissance nominale','Ausgangsleistung'],'Form Factor':['フォームファクタ','Format','Formfaktor'],'80 PLUS Certification':['80 PLUS 認証','80 PLUS Zertifizierung']}.items():
  if target not in rows:
   val=next((rows[k] for k in labels if k in rows),None)
   if val:rows[target]=val
 return title,rows
SOURCES={p.stem:json.loads(p.read_text()) for p in list((BASE/'sources').glob('extra-fsp-*.json'))+list((D/'sources').glob('*.json'))}
def candidates(c):
 if c['id']=='import-psu-f745fcb4b5a0':c={**c,'wattage':650}
 name=re.sub(r'^FSP Group\s*','',c['originalRecord']['name']);wanted=norm(name);white=c.get('finishName')=='Blanc';results=[]
 if c['id']=='import-psu-126df89952d5':name='Berserker 500';wanted=norm(name)
 if c['id']=='import-psu-3bea9f95fdf7':name='HPT2-1350M';wanted=norm(name)
 for key,d in SOURCES.items():
  if d.get('statusCode')!=200:continue
  title,rows=source_info(d);w=re.fullmatch(r'(\d+)\s*W',rows.get('Rated Output Power',rows.get('Total Power','')))
  if not w or int(w[1])!=c['wattage']:continue
  sourceWhite=bool(re.search('white',title+' '+rows.get('Model',''),re.I))
  if white!=sourceWhite:continue
  basetitle=re.sub(r'\s*White','',title,flags=re.I);code=re.sub(r'\s*\(White Edition\)','',rows.get('Model',''),flags=re.I)
  # No removal of ATX3.0, ATX3.1, Gen5, PRO or other meaningful suffixes.
  aliases=[norm(basetitle),norm(re.sub(r'\s*\d+\s*W$','',basetitle)),norm(code)]
  certification=rows.get('80 PLUS® Certification',rows.get('80 PLUS Certification',''))
  if 'Gold' in certification and name.startswith('AURUM'):
   # The original listing includes the certification in its family name.
   wanted=norm(re.sub(r'\bGOLD\b','',name,flags=re.I))
  if name.startswith('AURUM GOLD') and name in d.get('primaryText',''):
   wanted=norm(re.sub(r'\bGOLD\b','',name,flags=re.I))
  if name=='Hydro X' and code==f'HGX{c["wattage"]}' and title==f'HydroO X {c["wattage"]}W':
   # Official Hydro X launch release explicitly pairs HGX450/550/650 with
   # this family; the retained product headings contain an extra O typo.
   aliases.append(wanted)
  if ',Gen' in name or ',Gen' in name.replace(' ', ''):
   family=re.sub(r',\s*Gen\s*5','',name,flags=re.I);sourcefamily=re.sub(r'\s*\d+W(?:\s*White)?$','',basetitle,flags=re.I);sourcefamily=re.sub(r'\(?ATX\s*3\.[01]\)?\s*(?:\(?PCIe\s*5\.0\)?)?','',sourcefamily,flags=re.I).strip()
   if norm(family)==norm(sourcefamily) and re.search(r'Gen\s*5',code,re.I):aliases.append(wanted)
  if 'ATX3.0' in name:
   # PCIe 5.0 may be explicitly appended to the same ATX3.0 name.
   short=lambda s:norm(re.sub(r'\(?PCIe\s*5\.0\)?','',s,flags=re.I))
   if short(name)==short(re.sub(r'\s*\d+W$','',basetitle,flags=re.I)):aliases.append(wanted)
  if wanted in aliases:
   results.append({'sourceKey':key,'title':title,'model':rows.get('Model'),'url':d['url'],'method':'exact_model_or_published_code_and_wattage_and_finish'})
 return results
def main():
 out=[]
 for c in INPUT:
  hits=candidates(c)
  if any(h['model'] for h in hits):hits=[h for h in hits if h['model']]
  # Several language URLs can document one model; keep all evidence, select
  # a current English product page first only when the exact model agrees.
  def identity(h):
   title=re.sub(r'\s*-\s*Platinum\b','',h['title'])
   if 'ATX3.0' in c['originalRecord']['name']:title=re.sub(r'\(?PCIe5\.0\)?','',title)
   code=h['model']
   if 'Hydro X' in c['originalRecord']['name']:title=title.replace('HydroO','Hydro');code=code.split(' / ')[0]
   if c['id']=='import-psu-3bea9f95fdf7' and code=='HPT2-1350M':title='Hydro PTM PRO ATX3.1 1350W'
   return norm(title),norm(code)
  identities={identity(h) for h in hits}
  if c['id']=='import-psu-b9ea98749fba':
   # The manufacturer distinguishes fixed FLD from modular FL. Prefer the
   # explicitly named M page of the exact archived AU-500FL code.
   hits=[h for h in hits if h['title']=='AURUM Xilenser M 500W'];identities={(norm(h['title']),norm(h['model'])) for h in hits}
  unambiguous=len(identities)==1
  hits.sort(key=lambda h:(0 if '/en/product/' in h['url'] else 1 if '/us/product/' in h['url'] else 2,0 if any(r and r[0]=='Model' for t in SOURCES[h['sourceKey']].get('tables',[]) for r in t) else 1,h['url']))
  out.append({'id':c['id'],'name':c['name'],'state':'exact_primary_match' if unambiguous else 'review_required','candidates':hits})
 (D/'mapping.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(collections.Counter(x['state'] for x in out))
 groups={}
 for c,r in zip(INPUT,out):
  if r['state']!='review_required':continue
  name=re.sub(r'^FSP Group\s*','',c['originalRecord']['name']);family=re.sub(r'\b(?:[3456789]\d{2}|1\d{3})\s*W?\b','{W}',name).strip();groups.setdefault(family,[]).append(c['id'])
 (D/'queries.json').write_text(json.dumps([{'family':f,'ids':ids,'query':f'FSP {f.replace("{W}","")} official power supply specification manufacturer legacy datasheet exact generation'} for f,ids in groups.items()],ensure_ascii=False,indent=2));print(len(groups),'search families')
if __name__=='__main__':main()
