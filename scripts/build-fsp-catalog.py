"""Publish exact FSP evidence, preserving revisions, voltage limits and table spans."""
import pathlib,runpy,json,re,collections
ROOT=pathlib.Path(__file__).resolve().parents[1];R=runpy.run_path(str(ROOT/'scripts/collect-fsp-review.py'));D=R['D'];INPUT=R['INPUT'];SOURCES=R['SOURCES'];OUT={}
LABEL={'Model':'Référence publiée par FSP','Rated Output Power':'Puissance nominale','Form Factor':'Format et norme','80 PLUS® Certification':'Certification 80 PLUS','80 PLUS Certification':'Certification 80 PLUS','Input Voltage':'Tension d’entrée','Input Current':'Courant d’entrée','Input Frequency':'Fréquence d’entrée','Efficiency':'Rendement','Fan Type':'Ventilateur','Protection':'Protections','Warranty':'Garantie','Weight':'Poids','Noise':'Bruit annoncé','Operation Temp.':'Température de fonctionnement','Safety Approval':'Certifications de sécurité'}
def build(c,m):
 if c['id']=='import-psu-f745fcb4b5a0':c={**c,'wattage':650}
 h=m['candidates'][0];key=h['sourceKey'];d=SOURCES[key];title,rows=R['source_info'](d);f=D/'tables'/(key+'.json');expanded=json.loads(f.read_text()) if f.exists() else None;source={'name':'FSP — caractéristiques de la puissance et de la révision exactes','url':d.get('resolvedURL',d['url']),'checkedAt':d['checkedAt'],'kind':'manufacturer'};sources=[source];facts={};patch={'detailLevel':'partial','wattage':c['wattage'],'manufacturerModel':title};notes=[];groups=[]
 def fact(k,v,s=source):
  if v is not None and v!='':facts[k]={'value':v,'sourceURL':s['url'],'checkedAt':s['checkedAt']}
 fact('power',c['wattage']);form=rows.get('Form Factor','');fact('format',form)
 if re.search(r'\bATX',form,re.I):patch['psuFormat']='ATX'
 elif re.search(r'\bSFX',form,re.I):patch['psuFormat']='SFX'
 text=d.get('primaryText','');start=text.find(title,text.find('Home'));body=text[start:] if start>=0 else '';intro=body.split('Other Model')[0];atxtext=form+' '+intro
 version=re.search(r'ATX\s*(?:12\s*V?)?\s*(?:V\s*)?(\d\.\d{1,2})',atxtext,re.I)
 if version:fact('atx','ATX '+version[1])
 certification=rows.get('80 PLUS® Certification',rows.get('80 PLUS Certification',''))
 if certification=='GLOD' and re.search('80PLUS Gold|80 PLUS.{0,3}Gold',body):certification='Gold';notes.append('La cellule constructeur écrit « GLOD » ; le texte produit indique explicitement 80PLUS Gold. Les deux déclarations sources sont conservées.')
 fact('efficiency',' ; '.join(x for x in [certification,rows.get('Efficiency',rows.get('Efficiency(at typical load)'))] if x))
 fan=rows.get('Fan Type','');fact('fan',fan);fanmatch=re.search(r'(\d{2,3})\s*mm',fan,re.I)
 if fanmatch:patch['fanSizeMm']=int(fanmatch[1])
 else:
  sizes=set(re.findall(r'(\d{2,3})\s*mm\s*[A-Za-z ()&-]{0,45}\bfan\b',intro,re.I))
  if len(sizes)==1:
   size=int(sizes.pop());patch['fanSizeMm']=size;fact('fan',fan+' ; '+str(size)+' mm — diamètre explicitement annoncé dans la présentation du modèle')
 fact('protections',rows.get('Protection'));fact('warranty',rows.get('Warranty'))
 if re.search(r'\bsemi[- ]modular\b',body,re.I):fact('modularity','Semi-modulaire — déclaration constructeur')
 elif re.search(r'\bfull(?:y)?[- ]modular\b',body,re.I):fact('modularity','Entièrement modulaire — déclaration constructeur')
 elif re.search(r'\bnon[- ]modular\b|\bfixed cables\b|\bfixed cabling\b',body,re.I):fact('modularity','Câbles fixes — déclaration constructeur')
 dimensions=next(((k,v) for k,v in rows.items() if re.search(r'Dimensions?\s*\(',k,re.I)),None)
 if dimensions:
  label,value=dimensions;nums=re.findall(r'\d+(?:\.\d+)?',value)
  if len(nums)==3 and re.search('mm',value,re.I):
   size=list(map(float,nums));fact('height',size[2]);patch['heightMm']=size[2]
   if re.search(r'\(\s*L\s*x\s*W\s*x\s*H\s*\)',label,re.I):
    if size[0]==150 and size[1]!=150 and patch.get('psuFormat')=='ATX':notes.append('FSP publie '+label+' = '+value+'. L’ordre longueur/largeur peut être inversé dans certaines pages de cette marque ; la profondeur et la largeur de montage restent non projetées sans autre schéma explicite.')
    else:patch.update(depthMm=size[0],widthMm=size[1]);fact('depth',size[0]);fact('width',size[1])
 # Keep every original technical row, including unnamed or inconsistent source cells.
 technical=[{'label':LABEL.get(k,k),'value':v} for k,v in rows.items() if k and v];groups.append({'title':'FSP — fiche technique exacte','rows':technical})
 # A second official language edition can explicitly disambiguate the axes;
 # this is per exact model, never a universal swap of FSP's first two numbers.
 for alt in m['candidates'][1:]:
  ad=SOURCES[alt['sourceKey']];_,ar=R['source_info'](ad);axis=next(((k,v) for k,v in ar.items() if re.search(r'\(\s*W\s*x\s*L\s*x\s*H\s*\)',k,re.I)),None)
  if not axis:continue
  nums=re.findall(r'\d+(?:\.\d+)?',axis[1])
  if len(nums)!=3 or 'mm' not in axis[1]:continue
  size=list(map(float,nums))
  if patch.get('heightMm') is not None and patch['heightMm']!=size[2]:continue
  s={'name':'FSP — même modèle, axes W × L × H explicités','url':ad.get('resolvedURL',ad['url']),'checkedAt':ad['checkedAt'],'kind':'manufacturer'};sources.append(s);patch.update(widthMm=size[0],depthMm=size[1],heightMm=size[2]);fact('width',size[0],s);fact('depth',size[1],s);fact('height',size[2],s);groups.append({'title':'Axes mécaniques explicités dans une autre édition constructeur','rows':[{'label':axis[0],'value':axis[1]}]});notes=[n for n in notes if not n.startswith('FSP publie ')];break
 if expanded:
  if expanded.get('cableCards'):
   groups.append({'title':'Câbles et prises FSP — quantités séparées publiées','rows':expanded['cableCards']});fact('connectors',' ; '.join(r['label']+' : '+r['value'] for r in expanded['cableCards']))
  for table in expanded['tables']:
   heads=next((r for r in table if r and r[0]=='DC Output'),None);combined=next((r for r in table if r and r[0]=='Max Combined Power'),None);currents=next((r for r in table if r and r[0]=='Max Output Current'),None)
   if heads:
    railrows=[]
    if currents and len(currents)==len(heads):railrows += [{'label':heads[i]+' — courant maximal','value':currents[i]} for i in range(1,len(heads))]
    if combined and len(combined)==len(heads):
     grouped={}
     for i in range(1,len(heads)):grouped.setdefault(combined[i],[]).append(heads[i])
     railrows += [{'label':' / '.join(names)+' — puissance combinée','value':v} for v,names in grouped.items()]
     rail12=[(' / '.join(names),v) for v,names in grouped.items() if any(re.match(r'\+12V',n,re.I) for n in names)]
     if rail12:fact('rail12v',' ; '.join(k+' : '+v+' combinés' for k,v in rail12))
    if railrows:groups.append({'title':'Rails de sortie FSP — cellules fusionnées respectées','rows':railrows})
   count=next((i for i,r in enumerate(table) if r and r[0]=='Connectors'),None)
   if count is not None and count>0:
    values=table[count];labels=table[count-1];labels=['']+labels if len(labels)==len(values)-1 else labels
    if len(labels)==len(values):
     connectors=[{'label':labels[i],'value':values[i]} for i in range(1,len(values)) if labels[i] and values[i]]
     if connectors:groups.append({'title':'Connecteurs FSP — nombre de prises, pas nombre de câbles','rows':connectors});fact('connectors',' ; '.join(x['label']+' : '+x['value'] for x in connectors))
 # Some product descriptions contain additional literal facts absent from tables.
 if intro and len(intro)<5000:groups.append({'title':'Caractéristiques annoncées du modèle exact','rows':[{'label':'Déclaration constructeur','value':intro}]})
 images=list(dict.fromkeys(x['url'] for x in d.get('images',[]) if '/upload/product/' in x.get('url','') and not '_240x240' in x['url']))
 if images:groups.append({'title':'Références visuelles constructeur non inspectées','rows':[{'label':'Photo produit officielle — association non inspectée','value':u} for u in images]})
 patch['description']='Alimentation FSP '+title+'. Données tirées de la fiche constructeur de cette puissance et de cette révision. Les caractéristiques absentes ou ambiguës restent indiquées comme non documentées.';patch['specs']=[str(c['wattage'])+' W',form]+([certification] if certification else [])+([fan] if fan else [])
 if c['id']=='import-psu-f745fcb4b5a0':
  patch['name']='Group HEXA 85+ · 650 W · ATX · 80 PLUS Bronze · Câbles fixes · Noir';patch['variantGroupName']='Group HEXA 85+ · 650 W · ATX · 80 PLUS Bronze · Câbles fixes';notes.append('Correction de l’archive 850→650 W : la fiche originale PCPartPicker indique Part # HEXA 85+ 650W ; le fabricant confirme HEXA 85+ 650W / HA650. La gamme PRO 850 W reste distincte.')
  old=json.loads((D/'followup-full.json').read_text());sources.append({'name':'Fiche originale — numéro de pièce HEXA 85+ 650W malgré puissance850W erronée','url':next(u for u in old['urls'] if '/BL22FT/' in u),'checkedAt':old['checkedAt'],'kind':'retailer'})
 p={'identityKind':'manufacturer-model','manufacturerModel':title,'mpn':'','identityNote':'Modèle FSP exact, puissance et finition rapprochés avec la fiche constructeur. Le code publié est affiché dans les caractéristiques ; aucun SKU régional distinct ni nouvelle offre ne sont inventés.','sources':sources,'groups':groups,'patch':patch,'offers':[],'notes':['Les tableaux de rails conservent les cellules de puissance combinée ; cette valeur n’est pas multipliée par le nombre de rails.','Les liens de photographies officielles ne constituent pas une inspection visuelle ni une validation de ressemblance 3D.']+notes,'fieldEvidence':facts}
 return p,images

SHARED_REVISIONS={'import-psu-0a718842abf5','import-psu-1ba05c1ad19d','import-psu-df20477a2b1b'}
def build_shared_revision(c,m):
 # Explicitly reviewed exception: FSP reused HPT3-xxxM,Gen5 for two ATX
 # generations. Publish only their intersection; never select a generation.
 editions={}
 for h in m['candidates']:
  p,_=build(c,{'candidates':[h]});atx=p['fieldEvidence'].get('atx',{}).get('value')
  if atx in {'ATX 3.0','ATX 3.1'}:editions.setdefault(atx,p)
 assert set(editions)=={'ATX 3.0','ATX 3.1'}
 a,b=editions['ATX 3.0'],editions['ATX 3.1'];facts={};groups=[];sources=a['sources']+b['sources']
 for k,av in a['fieldEvidence'].items():
  bv=b['fieldEvidence'].get(k)
  if bv and av['value']==bv['value']:facts[k]={**av,'reason':'Valeur identique publiée dans les deux révisions constructeur citées.'}
 # ATX is the shared form factor; ATX 3.0/3.1 is a separate disputed field.
 facts['format']={**a['fieldEvidence']['format'],'value':'ATX','reason':'Format ATX explicitement publié dans les deux révisions.'}
 for k in ['atx','connectors']:
  av=a['fieldEvidence'].get(k);bv=b['fieldEvidence'].get(k)
  if av and bv and av['value']!=bv['value']:facts[k]={**av,'value':f"ATX 3.0 : {av['value']} ; ATX 3.1 : {bv['value']}",'conflicting':True,'reason':'La référence d’archive ne distingue pas les deux révisions publiées par FSP.'}
 # Protection punctuation differs, but the five explicit abbreviations agree.
 ap=a['fieldEvidence'].get('protections');bp=b['fieldEvidence'].get('protections')
 if ap and bp and re.findall(r'OCP|OVP|OPP|SCP|OTP',ap['value'])==re.findall(r'OCP|OVP|OPP|SCP|OTP',bp['value']):facts['protections']={**ap,'value':'OCP, OVP, OPP, SCP, OTP','reason':'Les cinq protections sont explicitement nommées dans les deux éditions.'}
 common=[r for g in a['groups'] if g['title']=='FSP — fiche technique exacte' for r in g['rows'] if any(r==s for h in b['groups'] if h['title']=='FSP — fiche technique exacte' for s in h['rows'])]
 groups.append({'title':'Caractéristiques identiques dans les deux révisions FSP','rows':common})
 for edition,p in editions.items():
  rows=[{'label':'Déclarations de cette révision — non attribuées à la référence d’archive','value':' ; '.join(r['label']+' : '+r['value'] for g in p['groups'] if 'visuelles' not in g['title'] for r in g['rows'])}]
  groups.append({'title':edition+' — documentation séparée de la variante','rows':rows})
 model='Hydro PTM X PRO Gen5 '+str(c['wattage'])+'W — révision ATX non déterminée'
 patch={k:v for k,v in a['patch'].items() if k in b['patch'] and b['patch'][k]==v and k not in {'description','specs','manufacturerModel'}}
 patch.update(manufacturerModel=model,description='Alimentation FSP Hydro PTM X PRO Gen5 '+str(c['wattage'])+' W noire. Le même code fabricant est publié pour les révisions ATX 3.0 et 3.1. Seules les caractéristiques explicitement communes sont attribuées ; les connecteurs de génération et la norme restent à déterminer.',specs=[str(c['wattage'])+' W','Format ATX','80 PLUS Platinum','Révision ATX 3.0 / 3.1 non déterminée'])
 return {'identityKind':'manufacturer-model','manufacturerModel':model,'mpn':'','identityNote':'Identité de gamme, puissance et finition établie ; révision ATX non déterminée. Le code publié HPT3-xxxM,Gen5 est réutilisé par FSP et ne constitue pas un MPN commercial univoque.','sources':sources,'groups':groups,'patch':patch,'offers':[],'notes':['Les données variables entre révisions ne sont jamais attribuées à ce composant. Aucune offre ni photo exacte n’est associée tant que la révision reste inconnue.'],'fieldEvidence':facts},[]

def main():
 mapping=json.loads((D/'mapping.json').read_text());review=[];photos=[];supplements=json.loads((D/'supplement-products.json').read_text()) if (D/'supplement-products.json').exists() else {};clearPower=[]
 for c,m in zip(INPUT,mapping):
  assert c['id']==m['id'];p=None;images=[]
  if m['state']=='exact_primary_match':p,images=build(c,m);OUT[c['id']]=p
  elif c['id'] in SHARED_REVISIONS:p,images=build_shared_revision(c,m);OUT[c['id']]=p;m={**m,'state':'shared_revision_intersection'}
  if c['id'] in supplements:
   p=supplements[c['id']]
   if p.pop('clearNominalPower',False):clearPower.append(c['id'])
   OUT[c['id']]=p;m={**m,'state':'primary_document_extended' if any(s['kind']=='manufacturer' for s in p['sources']) else 'retailer_evidence_only'}
  review.append({'id':c['id'],'name':c['name'],'state':m['state'],'sourceKeys':[x['sourceKey'] for x in m['candidates']],'documentedFields':list(p['fieldEvidence']) if p else [],'blocker':None if p else 'identity_ambiguous','blockerDetail':None if p else 'La seule fiche SAGA 400R retrouvée mélange SAGA400R et FSP400-60GHN85, avec rendements et certifications contradictoires. Aucun transfert de ses caractéristiques.'})
  if images:photos.append({'id':c['id'],'model':p['manufacturerModel'],'sourceURL':p['sources'][0]['url'],'images':images,'status':'manufacturer_reference_uninspected'})
 target=ROOT/'src/data/deepFspCatalog.ts';target.write_text('// Generated by scripts/build-fsp-catalog.py from exact manufacturer models and table spans.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const deepFspProducts:Record<string,VerifiedProduct> = '+json.dumps(OUT,ensure_ascii=False,indent=2)+';\n')
 with target.open('a') as f:
  for id,p in OUT.items():
   if not p['mpn']:f.write(f'deepFspProducts["{id}"].patch.manufacturerPartNumber=undefined;\n')
  for id in clearPower:f.write(f'deepFspProducts["{id}"].patch.wattage=undefined;\n')
 (D/'per-id-review.json').write_text(json.dumps(review,ensure_ascii=False,indent=2));(D/'official-photos.json').write_text(json.dumps(photos,ensure_ascii=False,indent=2));print('FSP',len(OUT),'/',len(INPUT))
 hexa=OUT['import-psu-f745fcb4b5a0'];old=json.loads((D/'followup-full.json').read_text());primary=hexa['sources'][0]
 corrections=[{'id':'import-psu-f745fcb4b5a0','field':'wattage','oldValue':850,'newValue':650,'sourceURL':primary['url'],'checkedAt':primary['checkedAt'],'sourceHash':SOURCES[next(m['candidates'][0]['sourceKey'] for m in mapping if m['id']=='import-psu-f745fcb4b5a0')]['sha256'],'reason':'La fiche d’origine PCPartPicker BL22FT possède le numéro de pièce HEXA 85+ 650W malgré son champ puissance850W. La fiche FSP de HEXA 85+ 650W publie Model HA650 et Rated Output Power650W. La gamme HEXA 85+ PRO850W est distincte.','originalSourceURL':next(u for u in old['urls'] if '/BL22FT/' in u),'originalSourceEvidenceFile':'followup-full.json','originalPartNumber':'HEXA 85+ 650W','manufacturerModel':'HEXA 85+ 650W','manufacturerPublishedCode':'HA650','commercialMPNConfirmed':False,'updatedDisplayFields':['name','description','specs','variantGroupName']}]
 (D/'corrections.json').write_text(json.dumps(corrections,ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':main()
