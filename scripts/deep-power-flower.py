"""Expand manufacturer/distributor PSU tables without losing merged-cell scope.
Regional marketing codes are not made into global manufacturer part numbers.
ATX3.1 updates remain distinct from original generations and reused XG codes.
"""
import pathlib,json,re,gzip,unicodedata,collections,copy,hashlib
from lxml import html
ROOT=pathlib.Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/power-flower';INPUT=json.loads((D/'input.json').read_text())
def clean(s):return re.sub(r'\s+',' ',unicodedata.normalize('NFKC',s)).strip()
def key(s):return re.sub('[^a-z0-9]','',clean(s).lower())
def expand(table):
 grid=[];occupied={}
 for ri,tr in enumerate(table.xpath('.//tr')):
  row={c:v for (rr,c),v in occupied.items() if rr==ri};ci=0
  for cell in tr.xpath('./td|./th'):
   while ci in row:ci+=1
   text=clean(cell.text_content());cols=int(cell.get('colspan','1'));rows=int(cell.get('rowspan','1'))
   for y in range(ri,ri+rows):
    for x in range(ci,ci+cols):occupied[y,x]=text
   for x in range(ci,ci+cols):row[x]=text
   ci+=cols
  grid.append([row.get(i,'') for i in range(max(row,default=-1)+1)])
 width=max(map(len,grid),default=0);return [r+['']*(width-len(r)) for r in grid]
TRANS={'製品名':'Modèle publié','製品名 / 製品型番':'Modèle publié','製品名 / 型番':'Modèle publié','製品型番':'Référence publiée au Japon','JANコード':'Code JAN japonais','本体&ケーブルカラー':'Couleur du bloc et des câbles','最大出力':'Puissance nominale','製品寸法':'Dimensions du bloc','製品サイズ':'Dimensions du bloc','製品重量':'Masse du bloc','重量':'Masse du bloc','80PLUS認証':'Certification et rendement','Intel Power Design Guide':'Norme Intel publiée','保護機能':'Protections (libellé original)','冷却システム':'Ventilateur / commande (libellé original)','製品保証':'Garantie du distributeur japonais','入力電圧':'Tension d’entrée','+3.3V,+5Vコンバイン':'Puissance combinée +3,3 V / +5 V','+12Vコンバイン':'Puissance combinée +12 V','認証 / 効率':'Certification / rendement','パッケージサイズ':'Dimensions de l’emballage','パッケージ重量':'Masse avec emballage'}
def parse_dirac(s,raw=None):
 out=[]
 raw=raw if raw is not None else gzip.open(ROOT/s['rawFile'],'rb').read();root=html.fromstring(raw)
 for table in root.xpath('//table'):
  grid=expand(table)
  if not grid:continue
  heads=grid[0];cols=[i for i,v in enumerate(heads) if re.search(r'LEADEX.*\d+W',v,re.I)]
  if not cols:continue
  start=cols[0]
  for col in cols:
   model=heads[col];v={}
   for row in grid:
    labels=list(dict.fromkeys(x for x in row[:start] if x));label=' — '.join(labels);value=row[col]
    if label and value:v[label]=value
   power=next((value for k,value in v.items() if '最大出力' in k),'');w=re.fullmatch(r'(\d+)W',power)
   if not w:continue
   code=next((value for k,value in v.items() if k=='製品型番'),'');color=next((value for k,value in v.items() if 'カラー' in k),'');patch={'wattage':int(w[1])};dims=next((value for k,value in v.items() if k.startswith(('製品寸法','製品サイズ'))),'')
   axes=dict(re.findall(r'\(([DWLH])\)\s*(\d+(?:\.\d+)?)',dims,re.I))
   if all(k in axes for k in ['W','H']) and ('D' in axes or 'L' in axes) and not ('/leadex-platinum-se/' in s['url'] and int(w[1]) in [1000,1200]):patch.update(widthMm=float(axes['W']),heightMm=float(axes['H']),depthMm=float(axes.get('D',axes.get('L'))))
   cooling=next((value for k,value in v.items() if '冷却' in k),'');fan=re.search(r'(\d+)mm',cooling)
   if fan:patch.update(fanCount=1,fanSizeMm=int(fan[1]))
   out.append({'model':model,'code':code,'color':color,'values':v,'patch':patch,'source':s,'kind':'retailer','generation':'ATX3.1' if 'atx3-1' in s['url'] or re.search(r'ATX\s*3\.1',model,re.I) else 'original_named_edition'})
 return out

def normalized_family(s):
 s=clean(s).upper();s=re.sub(r'\b(?:\d+)W\b|\b(?:BLACK|WHITE|BK|WT)\b|ATX\s*3\.1','',s);s=re.sub(r'\s+',' ',s).strip();return s

def exa_documents():
 out=[]
 for f in sorted(D.glob('fetch-*.json')):
  raw=json.loads(f.read_text())
  if 'result' not in raw:continue
  text='\n'.join(c.get('text','') for c in raw['result'].get('content',[]) if c.get('type')=='text');starts=list(re.finditer(r'^URL: (https?://[^\s]+)',text,re.M))
  for i,m in enumerate(starts):
   body=text[m.end():starts[i+1].start() if i+1<len(starts) else len(text)];body=re.split(r'\nError fetching |\n# [^\n]+\n$',body)[0]
   out.append({'url':m[1],'text':body,'checkedAt':raw['capturedAt'],'artifact':str(f.relative_to(ROOT)),'sha256':hashlib.sha256(body.encode()).hexdigest(),'digestScope':'exa-extracted-primary-document'})
 return list({r['url']:r for r in out}.values())
def parse_hq(s,docs):
 if not s['url'].endswith('/LIII-G/'):return []
 root=html.fromstring(gzip.open(ROOT/s['rawFile']).read());tables=[expand(t) for t in root.xpath('//table')];out=[]
 for grid in tables:
  if not grid or grid[0][0]!='Model No.':continue
  for col,code in enumerate(grid[0]):
   if not code.startswith('SF-'):continue
   code=code.replace(' ','');vals={}
   for row in grid:
    if col>=len(row) or not row[col]:continue
    label=' — '.join(dict.fromkeys(x for x in row[:2] if x));vals[label]=row[col]
   # Exact alias proof is required separately for each wattage; do not extrapolate UP.
   aliases=[d for d in docs if 'super-flower.com.tw' not in d['url'] and code in d['text'][:1400] and re.search(r'GOLD UP',d['text'][:1400],re.I)]
   if not aliases:continue
   w=int(re.search(r'\d+',vals['WATTAGE'])[0]);patch={'wattage':w};dims=vals.get('Dimensions','');a={k:float(n) for n,k in re.findall(r'([\d.]+)mm\(([DWH])\)',dims)}
   if all(k in a for k in ['D','W','H']):patch.update(depthMm=a['D'],widthMm=a['W'],heightMm=a['H'])
   fan=re.search(r'(\d+)mm',vals.get('Fan Information — Fan Size',''))
   if fan:patch.update(fanCount=1,fanSizeMm=int(fan[1]))
   for table in tables:
    if not table or code not in table[0][0].replace(' ',''):continue
    rails=next((r[2:] for r in table if r[0]=='DC OUTPUT'),[])
    for row in table:
     if row[0]=='AC INPUT':vals['Entrée AC — '+str(w)+' W']=row[2]
     elif 'Max Output Current' in row:vals['Courant maximal par rail']=' ; '.join(f'{rail}: {value}' for rail,value in zip(rails,row[2:]))
     elif 'Max Combined Wattage' in row and len(set(row[2:]))>1:vals['Puissances combinées publiées']=('; '.join([f'{rails[0]} et {rails[1]} ensemble : {row[2]}']+[f'{rail}: {value}' for rail,value in zip(rails[2:],row[4:])]) if row[2]==row[3] else ' ; '.join(f'{rail}: {value}' for rail,value in zip(rails,row[2:])))
   out.append({'model':f'LEADEX III GOLD UP {w}W','code':code,'color':'ブラック','values':vals,'patch':patch,'source':s,'kind':'manufacturer','generation':'ATX3.1','aliasSource':aliases[0]})
 return out

def parse_legacy(d):
 if 'super-flower.com.tw/' not in d['url'] or '/products/' not in d['url']:return None
 t=d['text'];title=re.search(r'^# (.+)$',t,re.M)
 if not title:return None
 model=title[1];w=re.search(r'(\d+)W',model,re.I)
 if not w:return None
 # Separate source descriptions from related products and site footer.
 body=re.split(r'##### Related Products|CONTACT US|聯絡我們|客服專線|カートに追加済み',t)[0];vals={};patch={'wattage':int(w[1])};code='';color='ホワイト' if re.search(r'\(WH\)|WHITE',model) else 'ブラック'
 if 'LEADEX III SUPER BRONZE PRO' in model:
  if '12cm' not in body or 'v2.52' not in body:return None
  vals={'Certification / rendement':'80 PLUS Bronze ; 82 / 85 / 82 % à 20 / 50 / 100 % de charge','Modularité':'100 % modulaire ; câbles plats flexibles','Ventilation':'120 mm ; contrôle thermique Auto / ECO','Normes électriques':'ATX 12V v2.52 ; EPS 12V v2.92','Entrée AC':'100–240 V ; PFC actif','Protections':'OVP / OCP / OPP / SCP / UVP / OTP ; low voltage ; no load ; surge / inrush','Électronique':'Condensateur principal japonais 105 °C ; résonance LLC et conversion DC-DC','Connecteurs publiés':'ATX 20+4 broches ; PCIe 6+2 broches ; sockets universels 9 broches (quantités non publiées)'}
  patch.update(fanCount=1,fanSizeMm=120)
 elif model=='GOLDEN SILENT 500W' and 'SF-500P14FG' in body:
  code='SF-500P14FG';vals={'Certification / rendement':'80 PLUS Platinum ; 90 / 92 / 89 % à 20 / 50 / 100 % de charge','Entrée AC':'100–240 V ; PFC actif','Normes électriques':'ATX 12V v2.32 ; EPS 12V v2.92','Protections':'OVP / OPP / SCP / UVP','Condensateurs':'100 % japonais 105 °C','Connectique':'Easy plug-in design ; quantités non publiées'}
 elif 'LEADEX V PLATINUM PRO 850W (WH)'==model and 'SF-850F14TP(WH)' in body:
  code='SF-850F14TP(WH)';vals={'Certification / rendement':'80 PLUS Platinum ; 90 / 92 / 89 % à 20 / 50 / 100 % de charge','Modularité':'100 % modulaire ; câbles plats flexibles','Ventilation':'120 mm FDB PWM ; 11 pales ; Auto / ECO','Profondeur du bloc':'130 mm (longueur explicitement décrite ; autres axes non publiés)','Normes électriques':'ATX 12V v2.52 ; EPS 12V v2.92','Entrée AC':'100–240 V ; PFC actif','Protections':'OVP / OCP / Dual OPP / SCP / UVP / OTP / NLO / SIP','Condensateurs':'100 % japonais 105 °C (carte principale et panneau modulaire)','Connectique':'Sockets universels 9 broches ; ATX 20+4 broches (quantités non publiées)'};patch.update(depthMm=130,fanCount=1,fanSizeMm=120)
 else:return None
 vals={'Modèle publié':model,'Puissance nominale':f'{w[1]} W',**vals}
 return {'model':model.replace(' (WH)',' WHITE'),'code':code,'color':color,'values':vals,'patch':patch,'source':d,'kind':'manufacturer','generation':'original_named_edition'}

def parse_markdown_primary(d):
 t=d['text'];old='super-flower1.e-goodnews.com.tw/' in d['url'];pcc='pccasegear.com/' in d['url'];wind='windnetpc.com/' in d['url'];md='mdcomputers.in/product/super-flower-leadex-platinum-' in d['url']
 if not (old or pcc or wind or md):return None
 title=re.search(r'Products Name\s*:\s*(.+)',t) if old else re.search(r'# Super Flower (LEADEX .+?) Power Supply',t,re.I)
 if wind:title=re.search(r'# Super Flower (LEGION GX PRO \d+W)',t)
 if md:title=re.search(r'# Super Flower (Leadex Platinum \d+W)',t)
 if not title:return None
 model=title[1].strip().replace('(BK)','BLACK').replace('(WH)','WHITE');w=re.search(r'(\d+)W',model,re.I)
 if not w:return None
 block=re.split(r'### Reviews & Awards|## Customer reviews|\n\| Psu \|',t)[0];rows=[];scope='';rails=[]
 for line in block.splitlines():
  if not line.startswith('|'):continue
  cells=[x.strip() for x in line.strip('|').split('|')]
  if not any(cells) or all(not x or re.fullmatch(r'[-: ]+',x) for x in cells):continue
  if 'DC OUTPUT' in cells:rails=cells[2:];continue
  if len(cells)>4 and cells[0].lower().startswith('model no'):continue
  if len(cells)>4:
   label=cells[1] if not cells[0] or cells[0].endswith('W') else cells[0]
   values=cells[2:]
   if not label:continue
   if rails and label.lower().startswith(('max','min')):
    if len(set(x for x in values if x))==1 and len([x for x in values if x])==1:continue
    value=(' ; '.join([f'{rails[0]} et {rails[1]} ensemble : {values[0]}']+[f'{a}: {b}' for a,b in zip(rails[2:],values[2:]) if b]) if 'combined' in label.lower() and values[0] and not values[1] else ' ; '.join(f'{a}: {b}' for a,b in zip(rails,values) if b))
   else:value=' ; '.join(x for x in values if x)
   if value:rows.append((('Entrée AC — ligne publiée' if label.upper()=='AC INPUT' else 'Sorties DC — '+label),value))
  else:
   label=cells[0];v=[x for x in cells[1:] if x]
   if not v:continue
   if any(x in ['Fixed Cables','Fixed','Detachable','Detachable Cables'] for x in v):scope=next(x for x in v if x in ['Fixed Cables','Fixed','Detachable','Detachable Cables'])
   if scope and any(x in label.lower() for x in ['pin','sata','molex','cpu','fdd']):label='Connectique '+scope+' — '+label;v=[x for x in v if x!=scope]
   rows.append((label,' ; '.join(v)))
 vals=dict(rows);code=next((v.replace('SF- ','SF-').strip() for k,v in rows if k.lower().startswith('model no') or k=='Part No.'),None)
 if not code and pcc:
  cm=re.search(r'\[(SF-[\dA-Z]+)\]',t);code=cm[1] if cm else None
 if not code or len(rows)<7:return None
 patch={'wattage':int(w[1])};dim=vals.get('Dimension','');axes={k:float(n) for n,k in re.findall(r'([\d.]+)(?:mm)?\(([DWLH])\)',dim,re.I)}
 if 'W' in axes and 'H' in axes and ('L' in axes or 'D' in axes):patch.update(widthMm=axes['W'],heightMm=axes['H'],depthMm=axes.get('D',axes.get('L')))
 fan=vals.get('Fan Size','');fm=re.search(r'(\d+(?:\.\d+)?)\s*(cm|mm)',fan,re.I)
 if fm:patch.update(fanCount=1,fanSizeMm=float(fm[1])*(10 if fm[2]=='cm' else 1))
 elif re.search('fanless',fan,re.I):patch['fanCount']=0
 vals={'Modèle publié':model,'Puissance nominale':f'{w[1]} W',**vals}
 return {'model':model,'code':code,'color':'ホワイト' if 'WHITE' in model else 'ブラック','values':vals,'patch':patch,'source':d,'kind':'manufacturer' if old else 'retailer','generation':'original_named_edition'}

def parse_alza(d):
 if 'alza.de/' not in d['url']:return None
 t=d['text'];product=None
 for line in t.splitlines():
  if line.startswith('{"@context"'):
   try:j=json.loads(line)
   except ValueError:continue
   if j.get('@type')=='Product':product=j
 if not product or not product.get('mpn') or 'Golden Green HX' not in product['name']:return None
 model=clean(product['name'].replace('Super Flower ',''));w=re.search(r'(\d+) W',model);model=model.replace(' W','W');part=t[t.find('## Spezifikationen'):t.find('Mehr Informationen',t.find('## Spezifikationen'))];patch={'wattage':int(w[1])};vals={'Modèle publié':model,'Référence fabricant':product['mpn'],'Certification':'80 PLUS Gold','Format':'ATX','Fonctions':'PFC actif ; interrupteur secteur'}
 for label,field in [('Breite','widthMm'),('Höhe','heightMm'),('Tiefe','depthMm'),('Lüftergröße','fanSizeMm')]:
  match=re.search(re.escape(label)+r'\n(?:(?!\n###).)*?\n(\d+) mm',part,re.S)
  if match:patch[field]=int(match[1]);vals[{'widthMm':'Largeur du bloc','heightMm':'Hauteur du bloc','depthMm':'Profondeur du bloc','fanSizeMm':'Ventilateur'}[field]]=match[1]+' mm'
 if 'fanSizeMm' in patch:patch['fanCount']=1
 for label in ['Anzahl der PCI-Express 8-pin','Anzahl der PCI-Express 6-pin','Anzahl der Serial ATA 15-pin','Anzahl der Molex HDD 4-pin','Anzahl der Molex FDD 4-pin']:
  match=re.search(re.escape(label)+r'\n(?:(?!\nAnzahl|\n###).)*?(\d+)Stk\.',part,re.S)
  if match:vals[label.replace('Anzahl der ','Connecteurs — ')]=match[1]
 d['images']=[x['url'] for x in product.get('image',[]) if 'url' in x]
 return {'model':model,'code':product['mpn'],'color':'ブラック','values':vals,'patch':patch,'source':d,'kind':'retailer','generation':'original_named_edition'}

def parse_terabyte(d):
 if 'terabyteshop.com.br/produto/17808/' not in d['url']:return None
 t=d['text'];t=t.split('Especificações Técnicas',1)[-1].split('Avaliações dos clientes',1)[0]
 if 'SF-550P14XE' not in t:return None
 vals={};cur=''
 for line in t.splitlines():
  line=line.strip()
  if not line:continue
  if line.endswith(':'):cur=line[:-1];vals[cur]=''
  elif cur:vals[cur]=clean(vals[cur]+' '+line)
 return {'model':'LEGION GX PRO 550W','code':'SF-550P14XE','color':'ブラック','values':vals,'patch':{'wattage':550,'fanCount':1,'fanSizeMm':120},'source':d,'kind':'retailer','generation':'original_named_edition'}

def parse_limited_retail(d):
 t=d['text']
 if 'amazon.com/Fanless-Modular-Dynamic-Bearing-SF-650R14HE/' in d['url'] and 'Model: SF-650R14HE' in t:
  return {'model':'LEADEX III SUPER BRONZE PRO 650W','code':'SF-650R14HE','color':'ブラック','values':{'Modèle publié':'LEADEX III Bronze PRO 650W — SF-650R14HE','Puissance nominale':'650 W','Certification / rendement':'80 PLUS Bronze ; 82 / 85 / 82 % à 20 / 50 / 100 % de charge','Modularité':'100 % modulaire','Ventilation':'130 mm FDB ; contrôle thermique ECO / Silent, valeur propre à cette fiche 650 W','Entrée AC':'100–240 V ; PFC actif','Protections':'OVP / OCP / OPP / SCP / UVP'},'patch':{'wattage':650,'fanCount':1,'fanSizeMm':130},'source':d,'kind':'retailer','generation':'original_named_edition'}
 if 'etechbuy.com/sf-430p14fg/' in d['url'] and 'SF-430P14FG' in t:
  return {'model':'GOLDEN SILENT 430W','code':'SF-430P14FG','color':'ブラック','values':{'Modèle publié':'Golden Silent 430W — SF-430P14FG','Puissance nominale':'430 W','Certification':'80 PLUS Gold','Modularité':'Semi-modulaire','Refroidissement':'Fanless ; aucun ventilateur','Format':'ATX'},'patch':{'wattage':430,'fanCount':0},'source':d,'kind':'retailer','generation':'original_named_edition'}
 return None

def main():
 parsed=[];seen=set();docs=exa_documents()
 for p in sorted((D/'sources').glob('*.json')):
  s=json.loads(p.read_text());u=s['url'].split('#')[0]
  if u in seen or '?' in u:continue
  if 'dirac.co.jp/' in u and s.get('format')=='html' and s.get('tables') and '/wp-content/' not in u:
   s['url']=u;parsed+=parse_dirac(s);seen.add(u)
  elif 'super-flower.com.tw/products-detail/' in u and s.get('format')=='html':parsed+=parse_hq(s,docs)
 parsed += [r for d in docs for parser in [parse_legacy,parse_markdown_primary,parse_alza,parse_terabyte,parse_limited_retail] if (r:=parser(d))]
 out={};audit=[]
 for c in INPUT:
  name=c['name'].split(' · ')[0];fam=normalized_family(name);white=c['name'].split(' · ')[-1]=='Blanc' or bool(re.search(r'\bWhite\b',name,re.I));cert=re.search(r'80 PLUS (\w+)',c['name']);cert=cert[1].upper() if cert else '';eligible=[];rejected=[]
  for r in parsed:
   if r['patch']['wattage']!=c['wattage']:continue
   family=normalized_family(r['model']);target=fam
   # The archive may put its Gold/Platinum classification in the separate field.
   if target=='LEADEX V PRO':target='LEADEX V '+cert+' PRO'
   if target=='LEADEX III SUPER PRO' and cert=='BRONZE':target='LEADEX III SUPER BRONZE PRO'
   if family!=target and key(re.sub(r'\b(?:Black|White)\b','',name,flags=re.I))!=key(r['code']):continue
   if r['generation']=='ATX3.1' and 'UP' not in name:rejected.append({'model':r['model'],'code':r['code'],'reason':'explicit_ATX3_1_replacement_not_the_unqualified_original','url':r['source']['url']});continue
   if re.search(r'V\d+\.\d+',r['code'],re.I) and not re.search(r'V\d+\.\d+',name,re.I):rejected.append({'model':r['model'],'code':r['code'],'reason':'revision_not_present_in_archive','url':r['source']['url']});continue
   if family.startswith('LEADEX VII '):rejected.append({'model':r['model'],'code':r['code'],'reason':'MPN_reused_between_ATX_generations','url':r['source']['url']});continue
   iswhite=bool(re.search(r'WHITE|\bWT\b',r['model'],re.I) or r['color']=='ホワイト' or r['color'].startswith('ホワイト /'));dual='ブラック' in r['color'] and 'ホワイト' in r['color']
   if iswhite!=white and not dual:continue
   eligible.append(r)
  mpn_candidates={r['code'] for r in eligible if r['code'].startswith('SF-')}
  if len(mpn_candidates)==1:eligible=[r for r in eligible if r['code'].startswith('SF-')]
  identities={r['code'] or r['model'] for r in eligible}
  if len(identities)!=1:
   audit.append({'id':c['id'],'name':c['name'],'state':'ambiguous_candidates' if identities else 'exact_primary_variant_not_identified','candidates':[{'model':r['model'],'code':r['code'],'url':r['source']['url']} for r in eligible],'sourceFamiliesInspected':[{'model':r['model'],'code':r['code'],'generation':r['generation'],'url':r['source']['url']} for r in parsed if r['patch']['wattage']==c['wattage'] and (normalized_family(r['model'])==fam or key(name)==key(r['code']))],'rejectedCandidates':rejected,'missingIdentityDiscriminants':['Exact manufacturer part number','Original generation / ATX update','Color-specific reference']});continue
  r=max(eligible,key=lambda x:(x['kind']=='manufacturer',x['source']['url'].startswith('https:'),len(x['values'])));s=r['source'];code=r['code'];is_mpn=code.startswith('SF-');mpn=code if is_mpn else '';model=r['model'];patch=copy.deepcopy(r['patch']);patch['specs']=[str(patch['wattage'])+' W']+[v for k,v in r['values'].items() if k in ['Certification','Certification / rendement','Modularité','Format','Fan Size','Ventilation']][:4]
  patch.update(detailLevel='partial',description='Alimentation Super Flower '+model+'. Caractéristiques publiées pour cette puissance et cette finition ; les valeurs non documentées restent à confirmer.')
  if is_mpn:patch['manufacturerPartNumber']=mpn
  else:patch['manufacturerModel']=model
  rows=[]
  for k,v in r['values'].items():
   label=TRANS.get(k,k)
   if '/leadex-platinum-se/' in s['url'] and r['patch']['wattage'] in [1000,1200] and k.startswith(('製品寸法','製品サイズ')):label='Dimensions publiées — axes à confirmer'
   if 'コネクタ' in k or 'ケーブル' in k and 'カラー' not in k:label='Connectique — '+k.split(' — ')[-1]
   rows.append({'label':label,'value':v})
  record={'identityKind':'mpn' if is_mpn else 'manufacturer-model','mpn':mpn,'identityNote':'Modèle, puissance et finition explicitement isolés dans leur colonne du tableau Dirac. Les cellules fusionnées sont dépliées avant lecture des quantités de câbles.','sources':[{'name':'Super Flower — spécifications constructeur' if r['kind']=='manufacturer' else ('Dirac — distributeur japonais, spécifications Super Flower' if 'dirac.co.jp' in s['url'] else 'Marchand — fiche technique de la référence Super Flower'),'url':s['url'],'checkedAt':s['checkedAt'],'kind':r['kind']}],'groups':[{'title':'Caractéristiques Super Flower','rows':rows}],'patch':patch,'offers':[],'notes':['Les conditions de garantie et les codes JAN sont ceux du marché japonais. Aucune offre ni prix japonais n’est utilisé comme prix français.','Les valeurs entre parenthèses des lignes de connectique indiquent le nombre de câbles ; elles ne sont pas additionnées au nombre de connecteurs. Les dimensions de l’emballage restent séparées de celles du bloc.','Une nouvelle édition ATX 3.1 ou une révision V2 ne remplace pas une ancienne référence sans preuve de correspondance.'],'fieldEvidence':{k:{'value':v,'sourceURL':s['url'],'checkedAt':s['checkedAt']} for k,v in r['patch'].items()}}
  if 'e-goodnews.com.tw' in s['url']:record['notes'].append('Fiche de l’ancien catalogue Super Flower hébergé chez son prestataire e-goodnews ; elle reste distincte des éditions actuelles ATX 3.1.')
  if 'dirac.co.jp' not in s['url']:
   record['identityNote']='Modèle, puissance et référence de la fiche source rapprochés individuellement.'
   record['notes']=[n for n in record['notes'] if not n.startswith('Les conditions de garantie')]
  if r['kind']=='manufacturer':
   record['identityNote']='Modèle, puissance et finition explicitement identifiés sur la page officielle Super Flower.'
   record['notes']=[n for n in record['notes'] if not n.startswith('Les conditions de garantie')]
  if 'mdcomputers.in' in s['url']:record['notes'].append('La table détaillée des câbles et le résumé secondaire du marchand donnent des quantités différentes. Le résumé secondaire est exclu ; les quantités exactes de connecteurs restent à recouper avant achat.')
  if code in ['SF-750P14XE','SF-850P14XE','SF-500P14FG']:record['notes'].append('La fiche présente une plage d’entrée de 100–240 V dans les caractéristiques et de 115–240 V dans le tableau électrique ; cette divergence est conservée et reste à confirmer.')
  if 'SF-650R14HE'==code:record['notes'].append('La fiche Amazon de cette référence 650 W annonce un ventilateur de 130 mm ; les 120 mm publiés pour les autres puissances Bronze Pro ne lui sont pas transférés.')
  if r.get('aliasSource'):
   a=r['aliasSource'];record['sources'].append({'name':'Marchand — correspondance du nom commercial UP et du MPN','url':a['url'],'checkedAt':a['checkedAt'],'kind':'retailer'});record['identityNote']+=' Le nom commercial UP est relié au MPN exact par une fiche marchand ; aucune offre étrangère n’est importée.'
  if '/leadex-platinum-se/' in s['url'] and patch['wattage'] in [1000,1200]:record['notes'].append('La source publie W180 × D150 × H86 mm avec des axes inhabituels. Aucune largeur ni profondeur n’est injectée dans la compatibilité à partir de cette ligne ; les axes restent à confirmer.')
  if not is_mpn:record['manufacturerModel']=model;record['identityNote']+=' Le nom complet est confirmé, mais aucun MPN commercial mondial n’est affirmé à partir d’un code régional.'
  out[c['id']]=record;audit.append({'id':c['id'],'name':c['name'],'state':'primary_specs_enriched','identityKind':record['identityKind'],'mpn':mpn or None,'manufacturerModel':model,'url':s['url'],'missingFields':['current_France_EUR_offer']})
 (D/'documents.json').write_text(json.dumps(docs,ensure_ascii=False,indent=2))
 (D/'visual-references.json').write_text(json.dumps([{'id':c['id'],'identity':out[c['id']]['mpn'] or out[c['id']].get('manufacturerModel'),'sourceURL':out[c['id']]['sources'][0]['url'],'visuallyInspected':False,'imageURLs':next((r['source'].get('images',[]) for r in parsed if r['source']['url']==out[c['id']]['sources'][0]['url']),[])} for c in INPUT if c['id'] in out],ensure_ascii=False,indent=2))
 (D/'parsed-products.json').write_text(json.dumps(parsed,ensure_ascii=False,indent=2));(D/'products.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));(D/'review.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2));target=ROOT/'src/data/deepPowerFlowerCatalog.ts';target.write_text("// Generated from scoped Super Flower primary/distributor technical tables.\nimport type { VerifiedProduct } from './verifiedTypes'\n\nexport const deepPowerFlowerProducts: Record<string, VerifiedProduct> = "+json.dumps(out,ensure_ascii=False,indent=2)+"\n\nfor (const product of Object.values(deepPowerFlowerProducts)) {\n  if (product.identityKind === 'manufacturer-model') product.patch.manufacturerPartNumber = undefined\n}\n")
 print(json.dumps({'tableColumns':len(parsed),'accepted':len(out),'states':dict(collections.Counter(r['state'] for r in audit))}))
if __name__=='__main__':main()
