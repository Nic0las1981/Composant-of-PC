"""Explicit model assignments; manufacturer tables are never matched by wattage alone."""
from power_antec_enermax_common import *

def antec_table(targets,key,model=None,modularity=None,exclude=(),notes=None):
 e=source(key);table=e['tables'][0];d={r[0]:r[1] for r in table if len(r)==2}
 model=model or d.get('Product Name') or d.get('Model')
 props={'power':int(re.search(r'\d+',d['Output Capacity'])[0]),'format':'ATX'}
 mapping={'Type':'atx','Warranty':'warranty','Protection':'protections','Fan':'fan','Certifications':'efficiency','Certification':'efficiency'}
 for label,field in mapping.items():
  if label in d and not (field=='atx' and d[label]=='ATX'):props[field]=d[label]
 modularity=modularity or d.get('Modular')
 if modularity:props['modularity']={'－':'Câbles fixes','Fully':'Entièrement modulaire','Fully Modular':'Entièrement modulaire','Full-Modular':'Entièrement modulaire','Semi Modular':'Semi-modulaire','Semi-Modular':'Semi-modulaire','Non-Modular':'Câbles fixes'}.get(modularity,modularity)
 for label,value in d.items():
  if not label.startswith('Dimension'):continue
  axes={axis:float(n) for n,axis in re.findall(r'(\d+(?:\.\d+)?)\s*\(([LWDH])\)',value)}
  if axes:
   for axis,field in [('L','depth'),('D','depth'),('W','width'),('H','height')]:
    if axis in axes:props[field]=axes[axis]
  elif label=='Dimension (W x L x H)':
   n=[float(n) for n in re.findall(r'\d+(?:\.\d+)?',value)];assert len(n)==3
   props.update(width=n[0],depth=n[1],height=n[2])
  elif value.endswith('(LWH)'):
   n=[float(n) for n in re.findall(r'\d+(?:\.\d+)?',value)];props.update(depth=n[0],width=n[1],height=n[2])
 c=[];inside=False
 for row in table:
  if len(row)==2 and row[0]=='Connector':inside=True;c.append(row[1])
  elif inside and len(row)==1:c.append(row[0])
  elif inside:break
 if c:props['connectors']=' ; '.join(c)
 for field in exclude:props.pop(field,None)
 if props.get('fan','').startswith('135 x 135'):props['fan']='135 mm, FDB ; '+props['fan']
 add(targets,model,key,props,notes=notes)

for w,key in [(750,'121c51c257'),(850,'c1ba0c918b')]:
 antec_table(ids('Antec','GSK ATX3.1',w),'extra-antec-'+key,notes=['La fiche emploie à la fois 12VHPWR et 12V-2x6 pour le connecteur 16 broches ; les deux désignations sont conservées, sans assimiler leur révision.'])
for w,key in [(450,'7dfe778be6'),(550,'c4dcf29de1'),(650,'78fc647311'),(750,'b99ac04c5b')]:
 antec_table(ids('Antec','CSK',w),'extra-antec-'+key,modularity='Câbles fixes' if w<750 else None)
for w,key in [(650,'0559945568'),(750,'b502a6067c'),(850,'15d2d64104'),(1000,'d1a66d63bc')]:
 antec_table(ids('Antec','High Current Gamer Gold',w),'extra-antec-'+key)
for w,key in [(850,'0bf6244e79'),(1000,'6d18a5099f'),(1200,'fe0066db88')]:
 antec_table(ids('Antec','High Current Gamer PRO ATX3.1',w),'extra-antec-'+key)
for w,key in [(850,'6b6ff8f796'),(1000,'4025892613')]:
 antec_table(ids('Antec','High Current Gamer Extreme',w),'extra-antec-'+key)
for w,key in [(500,'ad8bb3190b'),(600,'0a28e9ecee'),(700,'ab8096f182')]:
 antec_table(ids('Antec','NeoECO Gold ZEN',w),'extra-antec-'+key)
for w,key in [(650,'d047b1fe41'),(750,'b7bc1383d2'),(850,'4571437b10')]:
 antec_table(ids('Antec','NeoECO Platinum',w),'extra-antec-'+key,modularity='Entièrement modulaire')
for w,key in [(550,'d9b8de87a2'),(650,'fd48bb7de9')]:
 antec_table(ids('Antec','NeoECO V2',w),'extra-antec-'+key)
for w,key in [(1000,'cf91ce5739'),(1300,'bcb4174599')]:
 antec_table(ids('Antec','Signature Platinum',w),'extra-antec-'+key)
antec_table(ids('Antec','Signature',1000),'extra-antec-fa3e08da0f')
antec_table(['import-psu-2e9be00cfedd'],'extra-antec-7c52fbf291')
# A fixed-cable HCG-750 Bronze is the older HCG-750, not the 2018 fully modular HCG750 Bronze.
for w,key in [(650,'f5a29588e8'),(750,'d5ba784432'),(850,'b06982f68c')]:
 antec_table(ids('Antec','NeoECO Gold',w),'extra-antec-'+key,exclude=('width','depth','connectors'),notes=['Le tableau web inverse les axes 150(L) et 140(W), tandis que les dessins du produit montrent 140 mm de profondeur et 150 mm de largeur. Les dimensions et le câblage sont laissés en attente de la révision exacte : la page actuelle ajoute un câble 12VHPWR absent de la notice 2021.'])
antec_table(['import-psu-048434c380c9'],'extra-antec-92b1e52c19',exclude=('width','depth','connectors'),notes=['Variante blanche confirmée. La révision exacte du câblage et les axes inversés de la fiche restent à vérifier.'])

def enermax_table(targets,key,mpn,model,atx=None,notes=None,exclude=()):
 e=source(key);tables=e['tables'];spec=next(t for t in tables if any(r[0]=='Total power (W)' for r in t));d={r[0]:r[1] for r in spec if len(r)==2}
 props={'power':int(d['Total power (W)']),'format':'ATX','efficiency':'80 PLUS '+d['80 PLUS Efficiency'],'modularity':{'Fully modular':'Entièrement modulaire','Full modular':'Entièrement modulaire','Semi modular':'Semi-modulaire','Semi-modular':'Semi-modulaire','Non modular':'Câbles fixes','Non-modular':'Câbles fixes'}.get(d['Modular'],d['Modular']),'fan':d['Fan size (mm)']+' mm','protections':d['Protection']}
 n=[float(x) for x in re.findall(r'\d+(?:\.\d+)?',d['Dimension (D x W x H), (mm)'])];assert len(n)==3
 props.update(depth=n[0],width=n[1],height=n[2])
 if atx:props['atx']=atx
 dc=next(t for t in tables if any('Combined Wattage 12V' in r[0] for r in t));dc=dict(dc)
 props['rail12v']=dc['Combined Wattage 12V (W)']+' W ; '+', '.join(k+' : '+v for k,v in dc.items() if re.match(r'\+12V\d*\(A\)',k))
 cab=next((t for t in tables if t[0]==[mpn]),None)
 if cab is None:
  assert any(mpn in r for t in tables for r in t),mpn
  cab=next(t for t in tables if t[0]==['REVOLUTION D.F. 12 Series'])
 props['connectors']=' ; '.join(r[0]+' : '+r[1] for r in cab[1:] if len(r)==2 and r[1]!='-' and 'Optional' not in r[0])
 for k in exclude:props.pop(k,None)
 add(targets,model,key,props,mpn=mpn,notes=notes)

for w,key in [(850,'6690a3205b87c363'),(1050,'728038323000dba4'),(1200,'949c52d752ea49d9')]:
 enermax_table(ids('Enermax','REVOLUTION D.F. 2',w),'fetch-'+key,f'ERS{w}EWT',f'REVOLUTION D.F. 2 {w}W',atx='ATX 3.0',notes=['Adaptateur 12VHPWR marqué optionnel par le fabricant ; il n’est pas compté parmi les câbles fournis.'])
for w,key in [(850,'216b03dc549aa7f3'),(1200,'465d21668b6102f7')]:
 enermax_table(ids('Enermax','Revolution D.F. X',w),'fetch-'+key,f'ERT{w}EWT',f'REVOLUTION D.F. X {w}W',atx='ATX 3.0')
for w,key,mpn in [(750,'5fd8d48c59ddd0de','ETV750G'),(850,'8395e602effbc7b1','ETV850G')]:
 # Exact codes are checked against the dedicated connector table.
 e=source('fetch-'+key);assert any(mpn in r for t in e['tables'] for r in t)
 enermax_table(ids('Enermax','Revolution D.F. 12',w,'Noir'),'fetch-'+key,mpn,f'REVOLUTION D.F. 12 {w}W',atx='ATX 3.1')
e=source('fetch-4027098285349ef0');code='ETV850G-W';assert any(code in r for t in e['tables'] for r in t)
enermax_table(ids('Enermax','Revolution D.F. 12',850,'Blanc'),'fetch-4027098285349ef0',code,'REVOLUTION D.F. 12 850W White',atx='ATX 3.1')
for w,key,code in [(650,'e296b6d41dfd361b','EMB650AWT'),(750,'bee88fb9d739fbed','EMB750EWT')]:
 enermax_table(ids('Enermax','MarbleBron',w),'fetch-'+key,code,f'MARBLEBRON {w}W')

for w,key in [(1050,'6bb4689683630308'),(1350,'c9d36511c80326bf')]:
 enermax_table(ids('Enermax','Revolution D.F. X',w),'fetch-'+key,f'ERT{w}EWT',f'REVOLUTION D.F. X {w}W',atx='ATX 3.0')
enermax_table(ids('Enermax','PlatiGemini',1200),'extra-enermax-663d346b64','EGN1200P','PlatiGemini 1200W',atx='ATX 3.1 et ATX12VO',notes=['Bloc à double norme : connecteurs carte mère24broches et10brochesATX12VO fournis.'])

# VP PLUS manufacturer models, without a regional barcode or inferred regulatory MPN.
for w,key in [(500,'41bdcc4559'),(550,'1973f49360'),(650,'ebdf4c0dab'),(450,'9ebae7a3f2'),(600,'5130ebe9b5'),(700,'2b64766a3d')]:
 antec_table(ids('Antec','VP PLUS',w),'extra-antec-'+key,notes=['Le modèle commercialVPPLUS de cette puissance est documenté ; aucun numéro de pièce régional n’est déduit du code réglementaireX3000/V3000. Les variantesVPsansPLUS restent distinctes.'])

# Hand-reviewed historical tables are kept in a separate readable curation file.
historical=OUT/'curated-models.json'
if historical.exists():
 for r in json.loads(historical.read_text()):add(**r)
# Supplemental original PDF cells were inspected separately from the web table.
for w,rail,key in [(650,648,'ca6dd99e34172972'),(750,744,'5641ff29789bf436'),(850,840,'d06a235d9e578964'),(1000,996,'86593f1c689a2aae')]:
 supplement(ids('Antec','High Current Gamer Gold',w),'fetch-'+key,{'rail12v':f'{rail} W'})
for w,key in [(1000,'96a1da6f3d2a8685'),(1300,'a779cb2084f50db4')]:
 supplement(ids('Antec','Signature Platinum',w),'fetch-'+key,{'atx':'ATX12V 2.4'})
supplement(ids('Antec','High Current Gamer PRO ATX3.1',850),'fetch-c6af2b645dc766e4',{'rail12v':'840 W'})
supplement(ids('Antec','NeoECO Gold ZEN',700),'fetch-19188a39443495bf',{'rail12v':'696 W'})
for w in [800,900]:supplement(ids('Enermax',f'EMG{w}EWT'),'exa-late-5',{'efficiency':'80 PLUS Gold'})
finish()
