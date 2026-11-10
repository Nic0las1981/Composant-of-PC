"""Transcribed manufacturer tables: each row below names its exact wattage and generation."""
from power_antec_enermax_common import *
curated=[]
def put(targets,model,src,props,mpn='',**kw):
 assert targets,model
 curated.append(dict(targets=targets,model=model,src=src,props=props,mpn=mpn,**kw))
def base(w,d,eff,mod,fan=None,atx=None,warranty=None,protections=None):
 p=dict(power=w,format='ATX',depth=d,width=150,height=86,efficiency='80 PLUS '+eff,modularity=mod)
 for k,v in [('fan',fan),('atx',atx),('warranty',warranty),('protections',protections)]:
  if v is not None:p[k]=v
 return p
SAFE='OCP, OVP, UVP, OPP, OTP, SCP, SIP'
for w,rail,pci in [(430,420,2),(530,516,2),(630,612,4),(730,720,4)]:
 p=base(w,160,'Gold','Semi-modulaire','139 mm Twister Bearing','ATX12V 2.4','5 ans','OVP, OTP, OPP, SCP, SIP');p.update(rail12v=f'{rail} W',connectors=f'1×24 broches ; 1×CPU4+4 ; {pci}×PCIe6+2 ; 8×SATA ; 4×Molex ; 1×FDD')
 put(ids('Enermax',"REVOLUTION X't",w),f"REVOLUTION X’t {w}W",'exa-archive-8',p,mpn=f'ERX{w}AWT')
for w,d,rail,pci,sata,molex,cpus in [(500,160,492,2,6,6,'1×CPU4+4'),(600,160,600,4,8,8,'1×CPU4+4'),(750,175,744,4,12,8,'1×CPU4+4'),(850,175,840,6,12,8,'1×CPU4+4 + 1×CPU8'),(1000,175,996,6,12,8,'1×CPU4+4 + 1×CPU8'),(1350,180,1350,8,14,10,'2×CPU8 + 1×CPU4/RAM'),(1500,180,1500,10,14,10,'2×CPU8 + 1×CPU4/RAM')]:
 code=f'EPM{w}'+('AWT' if w<=750 else 'EGT' if w==1500 else 'EWT')
 target=ids('Enermax','Platimax',w) or ids('Enermax',code,w)
 p=base(w,d,'Platinum','Entièrement modulaire' if w>=1350 else 'Semi-modulaire',None if w==1350 else '139 mm Twister Bearing','ATX12V 2.3','5 ans',SAFE)
 p.update(rail12v=f'{rail} W combinés',connectors=f'1×24 broches ; {cpus} ; {pci}×PCIe6+2 ; {sata}×SATA ; {molex}×Molex ; '+('2×FDD' if w>=1350 else '1×FDD'))
 put(target,f'Platimax {w}W','exa-pdf-0',p,mpn=code,notes=['Les limites des rails individuels ne sont pas additionnées : la valeur combinée du tableau est utilisée.'] if w!=1000 else ['Edition OC à un seul rail +12 V de 83 A ; les versions multi-rails de la gamme ne sont pas utilisées.'])
for w,d,rail in [(750,180,750),(800,180,798),(1050,200,1050),(1250,200,1248)]:
 code=('EMT' if w<1000 else 'EDT')+str(w)+'EWT';p=base(w,d,'Titanium','Entièrement modulaire','139 mm Twister Bearing, semi-passif','ATX12V 2.4','10 ans',SAFE)
 p.update(rail12v=f'{rail} W',connectors='1×24 broches ; 1×CPU4+4 ; 1×CPU8 ; '+('6×PCIe6+2 ; 12×SATA ; 4×Molex' if w<1000 else '8×PCIe6+2 ; 16×SATA ; 8×Molex')+' ; 1×FDD')
 put(ids('Enermax','MaxTytan',w),f'MaxTytan {w}W','exa-archive-'+('25' if w<1000 else '23'),p,mpn=code)
for w,rail,pci,cpu,sata in [(650,650,4,1,8),(750,750,4,2,8),(850,850,6,2,12)]:
 p=base(w,160,'Gold','Entièrement modulaire',protections='OCP, OVP, UVP, SCP, OPP, OTP');p.update(rail12v=f'{rail} W combinés, 4 rails',connectors=f'1×24 broches ; {cpu}×CPU4+4 ; {pci}×PCIe6+2 ; {sata}×SATA ; 4×Molex ; adaptateur FDD1')
 put(ids('Enermax','Revolution D.F.',w),f'REVOLUTION D.F. {w}W','exa-archive-16',p,mpn=f'ERF{w}'+('AWT' if w==650 else 'EWT'))
for w,rail in [(850,840),(1050,1044)]:
 p=base(w,160,'Platinum','Entièrement modulaire','139 mm Twister Bearing, semi-passif',protections=SAFE);p.update(rail12v=f'{rail} W combinés, 4 rails',connectors='1×24 broches ; 1×CPU4+4 ; 1×CPU8 ; 6×PCIe6+2 ; 12×SATA ; 4×Molex ; adaptateur FDD1')
 put(ids('Enermax','Platimax D.F.',w),f'Platimax D.F. {w}W','exa-archive-12',p,mpn=f'EPF{w}EWT')
for w,rail in [(500,456),(600,552),(700,648)]:
 p=base(w,140,'Bronze','Câbles fixes','120 mm',protections='OVP, UVP, OPP, SCP, SIP');p['rail12v']=f'{rail} W'
 put(ids('Enermax','CYBERBRON',w),f'CYBERBRON {w}W','exa-archive-33',p,mpn=f'ECB{w}'+('EWT' if w==700 else 'AWT'),notes=['Les descriptions de couleur noir et noir/argent de l’archive désignent le même code fabricant ; aucune nouvelle finition n’est inventée.'])
for w in [1000,1200]:
 p=base(w,150,'Gold','Entièrement modulaire',atx='ATX 3.0',protections='OVP, UVP, OPP, SCP, OTP');p.update(rail12v=f'{w} W',connectors='1×24 broches ; 2×CPU4+4 ; 4×PCIe6+2 ; 12×SATA ; 4×Molex ; adaptateur FDD1 ; 1 câble 12VHPWR natif + 1 câble double PCIe8 vers 12VHPWR')
 put(ids('Enermax','REVOLUTION ATX 3.0',w),f'REVOLUTION ATX 3.0 {w}W','exa-archive-28',p,mpn=f'ERA{w}EWT',notes=['La référence ATX3.0 d’origine est conservée ; la page actuelle ATX3.1 n’est pas transposée à ce modèle. Le tableau compte deux terminaisons12VHPWR : une native, l’autre alimentée par deux prisesPCIe8.'])
for w,d,rail,pci,sata,molex,cpu in [(550,160,540,2,6,6,'1×CPU4+4'),(1000,175,996,6,12,8,'1×CPU4+4 + 1×CPU8')]:
 p=base(w,d,'Gold','Semi-modulaire','139 mm Twister Bearing','ATX12V 2.3','5 ans',SAFE);p.update(rail12v=f'{rail} W combinés',connectors=f'1×24 broches ; {cpu} ; {pci}×PCIe6+2 ; {sata}×SATA ; {molex}×Molex ; 1×FDD')
 code=f'ERV{w}'+('AWT-G' if w==550 else 'EWT-G');put(ids('Enermax','REVOLUTION87+',w) or ids('Enermax',code,w),f'REVOLUTION87+ {w}W','exa-archive-29',p,mpn=code)
p=base(1350,180,'Gold','Entièrement modulaire','139 mm Twister Bearing',warranty='5 ans',protections='OCP, OVP, UVP AC/DC, OPP, OTP, SCP, SIP');p.update(rail12v='1344 W combinés (112 A), 6 rails',connectors='1×24 broches ; 2×CPU8 ; 1×CPU4/RAM ; 8×PCIe6+2 ; 14×SATA ; 10×Molex ; 2×FDD')
put(ids('Enermax','MAXREVO SLI',1350),'MAXREVO 1350W','exa-archive-32',p,mpn='EMR1350EWT')
for w,rail in [(800,792),(900,900)]:
 p=base(w,175,'Gold','Semi-modulaire','139 mm Twister Bearing','ATX12V 2.3','5 ans','OCP, OVP, UVP AC/DC, OPP, OTP, SCP, SIP');p.pop('efficiency');p['rail12v']=f'{rail} W combinés, 4 rails'
 put(ids('Enermax',f'EMG{w}EWT'),f'MODU87+ {w}W','exa-archive-27',p,mpn=f'EMG{w}EWT',notes=['Correction de l’archive : les câbles carte mère et CPU sont fixes ; le bloc est semi-modulaire. La notice ne précise pas le nombre de chaque câble optionnel, celui-ci reste non confirmé.'])
for w,rail,pci,sata in [(500,498,2,6),(700,696,4,8)]:
 p=base(w,140,'Bronze','Semi-modulaire','120 mm','ATX12V 2.4','3 ans',SAFE);p.update(rail12v=f'{rail} W combinés, 2 rails',connectors=f'1×24 broches ; 1×CPU4+4 ; {pci}×PCIe6+2 ; {sata}×SATA ; 4×Molex ; 1×FDD')
 put(ids('Enermax','RevoBron TGA',w),f'RevoBron TGA {w}W','exa-archive-18',p,mpn=f'ERB{w}AWT TR')

# Original manufacturer manuals preserved by distributors (authorship/title retained).
def partial(w,eff,mod,atx=None,fan=None,protections=None,warranty=None):
 p=dict(power=w,format='ATX',efficiency='80 PLUS '+eff,modularity=mod)
 for k,v in [('atx',atx),('fan',fan),('protections',protections),('warranty',warranty)]:
  if v is not None:p[k]=v
 return p
p=base(650,170,'Gold','Entièrement modulaire','135 mm FDB à LED blanches','ATX12V 2.4','5 ans','OCP, OVP, NLO, SCP, OPP, OTP, SIP');p.update(rail12v='648 W combinés, 2 rails',connectors='1×24 broches ; 1×CPU4+4 ; 4×PCIe6+2 ; 9×SATA ; 6×Molex ; 1×FDD')
put(ids('Antec','EDGE',650),'EDGE EDG650','exa-legacy-0',p,mpn='EDG650')
p=base(650,140,'Gold','Câbles fixes','120 mm DBB','ATX12V 2.4','5 ans',SAFE+', NLO');p.update(rail12v='648 W combinés, 2 rails',connectors='1×24 broches ; 1×CPU4+4 ; 4×PCIe6+2 ; 6×SATA ; 5×Molex ; 1×FDD')
put(ids('Antec','True Power',650,'Gold'),'TruePower Classic TP-650C','exa-legacy-8',p,mpn='TP-650C')
for w,n,pci,sata,molex in [(620,2,2,6,6),(750,3,4,9,6),(850,4,4,9,6)]:
 p=partial(w,'Bronze','Semi-modulaire','ATX12V 2.32','135 mm DBB','OCP, OVP, UVP, SCP, OPP, SIP'+(', OTP' if w>=750 else ''))
 p['connectors']=f'1×24 broches ; 1×CPU4+4 ; {pci}×PCIe6+2 ; {sata}×SATA ; {molex}×Molex ; 1×FDD'+(' ; 1×CPU8' if w==850 else '')
 put(ids('Antec','High Current Gamer',w,'Semi-modulaire'),f'High Current Gamer HCG-{w}M',f'exa-legacy-{n}',p,mpn=f'HCG-{w}M')
p=partial(900,'Bronze','Câbles fixes','ATX12V 2.32','135 mm DBB','OCP, OVP, UVP, SCP, OPP, SIP, BOP');p['connectors']='1×24 broches ; 1×CPU4+4 ; 4×PCIe6+2 ; 9×SATA ; 6×Molex ; 1×FDD'
put(ids('Antec','High Current Gamer',900),'High Current Gamer HCG-900','exa-legacy-1',p,mpn='HCG-900')
for w,n in [(550,15),(650,14)]:
 p=partial(w,'Platinum','Câbles fixes','ATX12V 2.32','120 mm DBB','OCP, OVP, UVP, SCP, OPP, SIP, BOP','3 ans');p['connectors']='1×24 broches ; 1×CPU4+4 ; 2×PCIe6+2 ; 6×SATA ; 4×Molex ; 1×FDD'
 put(ids('Antec','EarthWatts Platinum',w),f'EarthWatts EA-{w} Platinum',f'exa-legacy-{n}',p,mpn=f'EA-{w} Platinum')
p=base(430,140,'Bronze','Câbles fixes','80 mm','ATX12V 2.3','3 ans','OCP, OVP, SCP');p.update(rail12v='384 W combinés, 2 rails',connectors='1×20+4 ; 1×CPU4+4 ; 1×PCIe6 ; 5×SATA ; 4×Molex ; 1×FDD')
put(ids('Antec','Earthwatts Green',430), 'EarthWatts EA-430D Green','exa-legacy-12',p,mpn='EA-430D Green',notes=['Certification Bronze explicite du modèle Green ; la ligne d’archive indiquant seulement 80PLUS est précisée.'])
p=base(500,140,'Bronze','Câbles fixes','80 mm','ATX12V 2.3','3 ans','OCP, OVP, SCP');p.update(rail12v='444 W combinés, 2 rails',connectors='1×20+4 ; 1×CPU4+4 ; 1×PCIe6+2 ; 1×PCIe6 ; 5×SATA ; 4×Molex ; 1×FDD')
put(ids('Antec','Earthwatts Green',500),'EarthWatts EA-500D Green','exa-legacy-11',p,mpn='EA-500D Green')
p=partial(550,'Standard','Semi-modulaire','ATX12V 2.3','120 mm','OCP, OVP, SCP','3 ans');p.pop('efficiency');p['connectors']='1×20+4 ; 1×CPU4+4 ; 1×PCIe6+2 ; 1×PCIe6 ; 6×SATA ; 6×Molex ; 1×FDD'
put(ids('Antec','Basiq',550),'Basiq BP550 PLUS','exa-legacy-16',p,mpn='BP550 PLUS')
p=partial(850,'Platinum','Entièrement modulaire','ATX12V 2.32',protections=SAFE+', NLO, BOP',warranty='7 ans');p['connectors']='1×24 broches ; 1×CPU4+4 ; 1×CPU8 ; 6×PCIe6+2 ; 9×SATA ; 6×Molex ; 1×FDD ; câble OC Link'
put(ids('Antec','High Current Pro',850,'Platinum'),'High Current Pro HCP-850 Platinum','exa-legacy-18',p,mpn='HCP-850 Platinum')
p=partial(1200,'Gold','Semi-modulaire','ATX12V 2.3',protections='OCP, OVP, SCP, OPP, OTP');p['connectors']='1×24 broches ; 1×CPU4+4 ; 1×CPU8 ; 8×PCIe6+2 ; périphériques selon tableau3 (alignement des quantitésSATA/Molex à vérifier)'
p.pop('connectors')
put(ids('Antec','High Current Pro',1200),'High Current Pro HCP-1200','exa-legacy-19',p,mpn='HCP-1200',notes=['Correction de l’archive : la notice décrit des câbles fixes et des câbles amovibles, donc un bloc semi-modulaire.'])
# DIGIFANLESS is physically fanless, unlike the semi-passive MaxTytan and Platimax families.
p=base(550,175,'Platinum','Entièrement modulaire','Sans ventilateur (refroidissement passif)','ATX12V 2.4','5 ans',SAFE);p.update(rail12v='540 W combinés (45 A) ; 2 rails commutables en rail unique via ZDPMS',connectors='1×24 broches ; 1×CPU4+4 ; 4×PCIe6+2 ; 8×SATA ; 4×Molex ; 1×FDD ; liaison ZDPMS')
put(ids('Enermax','DIGIFANLESS',550),'DIGIFANLESS 550W','exa-legacy-21',p,mpn='EDF550AWN')
p=base(600,160,'Platinum','Entièrement modulaire','139 mm Twister Bearing','ATX12V 2.4','5 ans','SCP, OVP, UVP, OCP 3.3V/5V, OPP, SIP');p.update(rail12v='600 W (50 A), rail unique',connectors='1×24 broches ; 1×CPU4+4 ; 4×PCIe6+2 ; 8×SATA ; 6×Molex ; 1×FDD')
put(ids('Enermax','Platimax D.F.',600),'Platimax D.F. 600W','exa-legacy-30',p,mpn='EPF600AWT')
for w,rail,pci,sata,molex in [(500,492,2,6,5),(600,600,4,7,6)]:
 p=base(w,160,'Gold','Câbles fixes','139 mm Twister Bearing','ATX12V 2.3','5 ans','OCP, OVP, UVP AC/DC, OPP, OTP, SCP, SIP');p.update(rail12v=f'{rail} W combinés',connectors=f'1×24 broches ; 1×CPU4+4 ; {pci}×PCIe6+2 ; {sata}×SATA ; {molex}×Molex ; 1×FDD')
 put(ids('Enermax',f'EPG{w}AWT'),f'PRO87+ {w}W','exa-legacy-25',p,mpn=f'EPG{w}AWT')

# Historical tables inspected by model/wattage; capacity neighbours are not substituted.
p=base(500,140,'Standard 230V EU','Câbles fixes','120 mm Twister Bearing',protections='OCP +3.3V/+5V/+12V, OVP, OPP, SCP, SIP');p.update(rail12v='456 W (38 A)',connectors='1×24 broches ; 1×CPU4+4 ; 2×PCIe6+2 ; 5×SATA ; 4×Molex ; 1×FDD')
put(ids('Enermax','MAXPRO',500),'MAXPRO 500W','exa-extra-6',p,mpn='EMP500AGT')
for w,rail,pci in [(550,540,2),(650,636,4),(750,744,4)]:
 p=base(w,160,'Gold','Semi-modulaire','139 mm Twister Bearing','ATX12V 2.4','5 ans','OCP +3.3V/+5V, OVP, OPP, SCP, SIP');p.update(rail12v=f'{rail} W',connectors=f'1×24 broches ; 1×CPU4+4 ; {pci}×PCIe6+2 ; 8×SATA ; 4×Molex ; 1×FDD')
 put(ids('Enermax',"REVOLUTION X't II",w),f'REVOLUTION X’t II {w}W','exa-extra-14',p,mpn=f'ERX{w}AWT')
for w,rail,pci,sata in [(500,498,2,6),(600,600,2,6),(700,696,4,8)]:
 p=base(w,140,'Gold','Câbles fixes','100 mm admission + 80 mm extraction, Twister Bearing','ATX12V 2.4','3 ans','OCP +3.3V/+5V, OVP, UVP, OPP, SCP, SIP');p.update(rail12v=f'{rail} W',connectors=f'1×24 broches ; 1×CPU4+4 ; {pci}×PCIe6+2 ; {sata}×SATA ; 4×Molex ; 1×FDD')
 put(ids('Enermax','REVOLUTION DUO',w),f'REVOLUTION DUO {w}W','exa-extra-40',p,mpn=f'ERD{w}AWL-F',extra={'fanCount':2},notes=['Deux ventilateurs distincts : admission100mm et extraction80mm. Le diamètre principal100mm ne désigne pas deux ventilateurs identiques.'])
for w,rail,pci,molex in [(800,780,4,4),(1000,996,6,8)]:
 p=base(w,165,'Bronze','Semi-modulaire',atx='ATX12V 2.3',protections='OVP, OPP, SCP');p.update(rail12v=f'{rail} W',connectors=f'1×24 broches ; 1×CPU4+4 ; 1×CPU8 ; {pci}×PCIe6+2 ; 12×SATA ; {molex}×Molex ; 1×FDD')
 put(ids('Enermax','TRIATHLOR ECO',w),f'TRIATHLOR ECO {w}W','exa-extra-48',p,mpn=f'ETL{w}EWT-M',sourceOverrides={'atx':'exa-legacy-28'},notes=['La notice contient une contradiction de diamètre du ventilateur (140mm dans les spécifications, 120mm dans l’illustration) ; ce champ reste non confirmé.'])
p=base(850,140,'Bronze','Semi-modulaire','120 mm',protections='OVP, UVP, OPP, OTP, SCP');p.update(rail12v='840 W (70 A)',connectors='1×24 broches ; 2×CPU4+4 ; 4×PCIe6+2 ; 8×SATA ; 4×Molex ; 1×FDD')
put(ids('Enermax','MarbleBron',850),'MARBLEBRON 850W White','exa-extra-56',p,mpn='EMB850EWT-W-RGB')
p=base(650,140,'Bronze','Câbles fixes','120 mm DBB',warranty='3 ans',protections='SCP, OVP ; autres protections CircuitShield non détaillées');p.update(rail12v='600 W (50 A)',connectors='1×24 broches ; 1×CPU4+4 ; 4×PCIe6+2 ; 6×SATA ; 5×Molex ; 1×FDD')
put(ids('Antec','NeoECO Classic',650),'NeoECO Classic NE650C','exa-extra-9',p,mpn='NE650C')
p=base(750,170,'Gold','Entièrement modulaire','135 mm FDB à LED blanches','ATX12V 2.4','5 ans','OCP, OVP, NLO, SCP, OPP, OTP, SIP');p.update(rail12v='744 W combinés, 2 rails',connectors='1×24 broches ; 1×CPU4+4 ; 1×CPU8 ; 6×PCIe6+2 ; 9×SATA ; 6×Molex ; 1×FDD')
put(ids('Antec','EDGE',750),'EDGE EDG750','exa-extra-19',p,mpn='EDG750')
for w,rail,pci,sata,molex,n in [(450,408,1,4,2,49),(550,504,2,5,3,35)]:
 p=base(w,140,'Bronze','Semi-modulaire','120 mm','ATX12V 2.4','3 ans');p.update(rail12v=f'{rail} W',connectors=f'1×24 broches ; 1×CPU4+4 ; {pci}×PCIe6+2 ; {sata}×SATA ; {molex}×Molex')
 put(ids('Antec','NE450M') if w==450 else ids('Antec','NeoECO',550),f'NeoECO Modular NE{w}M',f'exa-extra-{n}',p,mpn=f'NE{w}M')
p=partial(520,'Bronze','Câbles fixes','ATX12V 2.32','135 mm DBB','OCP, OVP, UVP, SCP, OPP, SIP, BOP');p.update(rail12v='40 A sur le rail +12V',connectors='1×24 broches ; 1×CPU4+4 ; 2×PCIe6+2 ; 6×SATA ; 6×Molex ; 1×FDD')
put(ids('Antec','High Current Gamer',520,'Câbles fixes'),'High Current Gamer HCG-520','exa-extra-8',p,mpn='HCG-520')
p=base(750,180,'Gold','Semi-modulaire','135 mm DBB PWM','ATX12V 2.3','5 ans','OCP, OVP, SCP, OPP, OTP');p.update(rail12v='744 W combinés (62 A), 4 rails',connectors='1×24 broches ; 1×CPU4+4 ; 1×CPU8 ; 6×PCIe6+2 ; 9×SATA ; 6×Molex ; 1×FDD')
put(ids('Antec','High Current Pro',750,'Gold'),'High Current Pro HCP-750','exa-extra-22',p,mpn='HCP-750')

for w,rail,pci,sata in [(500,408,'1×PCIe6+2 ; 1×PCIe6',5),(600,480,'2×PCIe6+2',7)]:
 p=base(w,140,'Standard','Câbles fixes',atx='ATX12V 2.3',warranty='3 ans',protections='OVP, UVP, SCP, OPP, SIP');p.update(rail12v=f'{rail} W combinés, 2 rails',connectors=f'1×24 broches ; 1×CPU4+4 ; {pci} ; {sata}×SATA ; 4×Molex ; 1×FDD')
 put(ids('Enermax',f'ENP{w}AWT'),f'NAXN ENP{w}AWT','exa-extra-12',p,mpn=f'ENP{w}AWT')
p=base(550,140,'Standard','Câbles fixes',atx='ATX12V 2.3',warranty='3 ans',protections='OVP, UVP, SCP, OPP, SIP');p.pop('efficiency');p.update(rail12v='456 W combinés, 2 rails',connectors='1×24 broches ; 1×CPU4+4 ; 1×PCIe6+2 ; 1×PCIe6 ; 5×SATA ; 4×Molex ; 1×FDD')
put(ids('Enermax','ENP550AWT'),'NAXN ENP550AWT','exa-extra-12',p,mpn='ENP550AWT',notes=['Ce modèle ne porte pas le suffixe-B ; la certification des ENP550AWT-B n’est pas transposée.'])
p=base(750,160,'Bronze','Semi-modulaire',atx='ATX12V 2.3',warranty='3 ans',protections='OVP, UVP, SCP, OPP, SIP');p.update(rail12v='648 W combinés (54 A), 2 rails',connectors='1×24 broches ; 1×CPU4+4 ; 1×CPU8 ; 4×PCIe6+2 ; 10×SATA ; 5×Molex ; 1×FDD')
put(ids('Enermax','ENM750AWT'),'NAXN ENM750AWT','exa-extra-12',p,mpn='ENM750AWT')
p=base(1000,140,'Gold','Entièrement modulaire','120 mm FDB','ATX12V 3.0','10 ans (fiche technique constructeur ; offre régionale mentionne1an)','OCP, OVP, UVP, SCP, OPP, OTP, SIP, NLO');p['connectors']='1×24 broches ; 2×CPU4+4 ; 4×PCIe6+2 ; 1×12VHPWR natif ; 12×SATA ; 4×Molex'
put(ids('Antec','NE1000G M ATX3.0'),'NE1000G M ATX3.0','exa-extra-2',p,notes=['Page régionale officielle conservant la révisionATX3.0. La garantie technique annoncée10ans se distingue de la garantie1an affichée par la boutique régionale ; aucune offre commerciale n’est importée.'])
p=partial(1300,'Platinum','Entièrement modulaire','ATX12V 2.32',protections=SAFE+', NLO, BOP',warranty='7 ans');p['connectors']='1×24 broches ; 1×CPU4+4 ; 1×CPU8 ; 10×PCIe6+2 ; 9×SATA ; 6×Molex ; 1×FDD ; OC Link'
put(ids('Antec','High Current Pro',1300),'High Current Pro HCP-1300 Platinum','exa-extra-30',p,mpn='HCP-1300 Platinum')
for w,rail,pci,sata,key in [(500,498,2,6,'d134f93a5501cd15'),(600,600,4,8,'7b8c4462f199765f'),(700,696,4,8,'afc5ab11fcaf1756')]:
 p=base(w,140,'Bronze','Semi-modulaire','120 mm',protections='OCP, OVP, UVP, OPP, SCP, SIP');p.update(rail12v=f'{rail} W combinés, 2 rails',connectors=f'1×24 broches ; 1×CPU4+4 ; {pci}×PCIe6+2 ; {sata}×SATA ; 4×Molex ; 1×FDD')
 put(ids('Enermax','RevoBron',w),f'RevoBron {w}W','fetch-'+key,p,mpn=f'ERB{w}AWT',notes=['Le modèleERB700AWT est identifié par le titre et la table de sortie696W ; la ligne de puissance nominale600W de la page est une coquille non recopiée.'] if w==700 else [])

for w,rail,cpu,pci,sata,key in [(550,540,1,2,6,'4fd58b98a238defb'),(650,648,1,4,6,'54b65dfc64aa3713'),(750,744,2,4,8,'546be1b5949b8a20')]:
 p=base(w,140,'Gold','Semi-modulaire','120 mm','ATX12V 2.4','7 ans',SAFE+', NLO');p.update(rail12v=f'{rail} W',connectors=f'1×24 broches ; {cpu}×CPU4+4 ; {pci}×PCIe6+2 ; {sata}×SATA ; 3×Molex')
 put(ids('Antec',f'EARTHWATTS GOLD PRO {w}'),f'EarthWatts Gold Pro {w}W','fetch-'+key,p,notes=['Tableau de sortie et dessin coté lus directement dans le PDF constructeur ; dimensions du bloc, sans les câbles.'])
for w in [850,1300]:
 p=partial(w,'Gold','Entièrement modulaire',atx='ATX12V 3.0',warranty='10 ans');p['connectors']='1×24 broches ; 2×CPU4+4 ; 4×PCIe6+2 ; 1×12VHPWR ; 12×SATA ; 4×Molex'
 put(ids('Antec',f'NE{w}G M ATX3.0'),f'NE{w}G M ATX3.0','fetch-764091d57a56ef6e',p,notes=['Notice originaleATX3.0 du14avril2023. Les pages web actuelles renomméesATX3.1 ne servent pas à compléter les dimensions, ventilateur ou puissance+12V.'])
p=base(1000,140,'Gold','Entièrement modulaire','120 mm FDB',atx='ATX12V 3.0',warranty='10 ans',protections='OCP, OVP, UVP, SCP, OPP, OTP, SIP, NLO');p['connectors']='1×24 broches ; 2×CPU4+4 ; 4×PCIe6+2 ; 1×12VHPWR ; 12×SATA ; 4×Molex'
put(ids('Antec','NE1000G M White ATX 3.0'),'NE1000G M White ATX3.0','exa-extra-1',p,notes=['La présentation officielle identifie la versionGoldATX3.0 blanche ; le tableau copié mentionne à tortBronzeATX2.4. Ces deux cellules contradictoires sont remplacées par la présentation et la noticeATX3.0, pas par la révision3.1 actuelle.'],sourceOverrides={'atx':'fetch-764091d57a56ef6e','efficiency':'fetch-764091d57a56ef6e'})
p=partial(1000,'Platinum','Entièrement modulaire','ATX12V 2.32',protections=SAFE+', NLO, BOP',warranty='7 ans');p['connectors']='1×24 broches ; 1×CPU4+4 ; 1×CPU8 ; 6×PCIe6+2 ; 9×SATA ; 6×Molex ; 1×FDD ; OC Link'
put(ids('Antec','High Current Pro',1000),'High Current Pro HCP-1000 Platinum','exa-final-4',p,mpn='HCP-1000 Platinum')
p=partial(450,'Platinum','Câbles fixes','ATX12V 2.32','120 mm DBB','OCP, OVP, UVP, SCP, OPP, SIP, BOP','3 ans');p['connectors']='1×24 broches ; 1×CPU4+4 ; 2×PCIe6+2 ; 5×SATA ; 4×Molex ; 1×FDD'
put(ids('Antec','Earthwatts',450),'EarthWatts EA-450 Platinum','exa-extra-34',p,mpn='EA-450 Platinum')
p=partial(1200,'Silver','Semi-modulaire','ATX12V 2.3',protections='OCP, OVP, UVP, SCP');p.update(rail12v='1200 W combinés (100 A), 6 rails',connectors='1×24 broches ; 1×CPU4+4 ; 1×CPU8 ; 4×PCIe6+2 ; 2×PCIe6 ; 11×SATA ; 9×Molex ; 2×FDD')
put(ids('Antec','True Power',1200),'TruePower Quattro TPQ-1200','exa-legacy-9',p,mpn='TPQ-1200',notes=['Les deux lignes d’archive partagent ce modèle : la notice confirme un câblage semi-modulaire, pas entièrement modulaire.'])
p=partial(850,'Bronze','Semi-modulaire','ATX12V 2.3',protections='OCP, OVP, SCP');p['rail12v']='780 W combinés (65 A), 4 rails'
put(ids('Antec','Signature',850),'Signature SG-850','exa-legacy-17',p,mpn='SG-850',notes=['Correction du câblage : les cordons carte mère/CPU sont fixes ; les périphériques utilisent les prises modulaires. La notice ne permet pas d’identifier sûrement la répartition6/8broches desPCIe optionnels.'])
p=partial(550,'Gold','Entièrement modulaire','ATX12V 2.4',protections='OCP, OVP, SCP, OPP, OTP, SIP, NLO',warranty='5 ans');p['connectors']='1×24 broches ; 1×CPU4+4 ; 2×PCIe6+2 ; 8×SATA ; 3×Molex ; 1×FDD'
put(ids('Antec','EDGE',550),'EDGE EDG550','exa-final-5',p,mpn='EDG550')
p=base(720,140,'Standard','Semi-modulaire','120 mm','ATX12V 2.3','3 ans','OCP, OVP, UVP AC/DC, OPP, OTP, SCP, SIP');p['rail12v']='660 W combinés (55 A), 3 rails'
put(ids('Enermax','ELT720AWT-ECO_II'),'LibertyECO II 720W','exa-archive-9',p,mpn='ELT720AWT-ECO II',notes=['Les câbles24broches etCPU sont fixes : correction de la mention entièrement modulaire. Le tableau de quantités des câbles doit être relu graphiquement avant confirmation.'])
for w,rail in [(920,912),(1020,1020)]:
 p=base(w,175,'Silver','Semi-modulaire',warranty='5 ans',protections=SAFE);p.pop('efficiency');p['rail12v']=f'{rail} W combinés, 4 rails'
 put(ids('Enermax',f'ERV{w}EWT'),f'REVOLUTION85+ Compact {w}W','exa-extra-31',p,mpn=f'ERV{w}EWT',notes=['La notice confirme des câbles natifs et modulaires ; la certificationSilver, le diamètre du ventilateur et les quantités de câbles ne sont pas confirmés par ce document.'])
p=base(1200,180,'Platinum','Entièrement modulaire',warranty='5 ans',protections=SAFE);p.pop('efficiency');p['rail12v']='1200 W combinés (100 A), 6 rails'
put(ids('Enermax','EPM1200EWT'),'Platimax 1200W','exa-extra-51',p,mpn='EPM1200EWT',notes=['NoticePlatimax1200/1350W ; les caractéristiques duPlatimax1500W ne sont pas utilisées. Certification et câblage détaillé encore non établis par le texte de cette notice.'])
p=base(625,140,'Standard','Semi-modulaire','120 mm','ATX12V 2.3','3 ans','OCP, OVP, UVP AC/DC, OPP, SCP, OTP');p['efficiency']='Rendement82–85% sous115V et84–88% sous230V (notice ; niveau80PLUS non précisé)';p['rail12v']='600 W combinés (50 A), 3 rails'
put(ids('Enermax','EMD625AWT'),'MODU82+ 625W','exa-extra-37',p,mpn='EMD625AWT',notes=['Modèleoriginal2008, distinct duMODU82+II ; cordons carte mère/CPU fixes, périphériques modulaires.'])
p=base(400,140,'Standard','Câbles fixes','120 mm',warranty='3 ans',protections='OCP, OVP, UVP AC/DC, OPP, SCP, OTP');p['efficiency']='Rendement80–84% sous115V et82–86% sous230V (notice)';p['rail12v']='384 W combinés (32 A), 2 rails'
put(ids('Enermax','EES400AWT_II'),'ECO80+ II 400W','exa-extra-64',p,mpn='EES400AWT II',notes=['Le document identifie explicitement la révisionII. Les quantités de câbles et la révisionATX ne sont pas transposées depuis l’ancienneECO80+.'])
for w,rail in [(550,540),(650,648)]:
 p=base(w,140,'Bronze','Semi-modulaire','120 mm Twister Bearing',protections='OCP, OVP, UVP DC, OPP, OTP, SCP');p.pop('efficiency');p['rail12v']=f'{rail} W combinés, 2 rails'
 put(ids('Enermax','TRIATHLOR',w),f'Triathlor FC {w}W','exa-archive-3',p,mpn=f'ETA{w}AWT-M',notes=['VersionFC à câbles modulaires. La ficheTriathlor550W nonmodulaireETA550AWT et la gammeECO ne sont pas utilisées.'])

p=partial(520,'Bronze','Semi-modulaire','ATX12V 2.32',protections='OCP, OVP, UVP, SCP, OPP, SIP');p.update(rail12v='40 A sur le rail +12V',connectors='1×24 broches ; 1×CPU4+4 ; 2×PCIe6+2 ; 5×SATA ; 4×Molex ; 1×FDD')
put(ids('Antec','High Current Gamer',520,'Semi-modulaire'),'High Current Gamer HCG-520M','exa-late-0',p,mpn='HCG-520M')
p=partial(400,'Bronze','Semi-modulaire','ATX12V 2.32','135 mm DBB','OCP, OVP, UVP, SCP, OPP, SIP')
put(ids('Antec','High Current Gamer',400,'Semi-modulaire'),'High Current Gamer HCG-400M','exa-late-1',p,mpn='HCG-400M')
p=partial(400,'Bronze','Câbles fixes','ATX12V 2.3','135 mm DBB','OVP, SCP, OPP, OCP');p.update(rail12v='30 A sur le rail +12V',connectors='1×24 broches ; 1×CPU4+4 ; 1×PCIe6 ; 5×SATA ; 4×Molex ; 1×FDD')
put(ids('Antec','High Current Gamer',400,'Câbles fixes'),'High Current Gamer HCG-400','exa-late-6',p,mpn='HCG-400')
p=base(750,140,'Gold','Câbles fixes','120 mm DBB','ATX12V 2.4','5 ans',SAFE+', NLO');p.update(rail12v='744 W combinés, 2 rails',connectors='1×24 broches ; 1×CPU4+4 ; 6×PCIe6+2 ; 9×SATA ; 6×Molex ; 1×FDD')
put(ids('Antec','True Power',750,'Gold'),'TruePower Classic TP-750C','exa-late-2',p,mpn='TP-750C')
p=base(625,140,'Bronze','Semi-modulaire','120 mm','ATX12V 2.3','3 ans',SAFE);p.update(height=85,rail12v='600 W combinés (50 A), 3 rails')
put(ids('Enermax','EMD625AWT_II'),'MODU82+ II 625W','exa-late-3',p,mpn='EMD625AWTII',notes=['La fiche constructeur indique85mm de hauteur ; la valeur86mm de la première génération n’est pas recopiée. Quantités des câbles à vérifier dans le tableau graphique.'])
p=base(700,160,'Gold','Semi-modulaire','139 mm Twister Bearing','ATX12V 2.3','5 ans','OCP, OVP, UVP AC/DC, OPP, OTP, SCP, SIP');p['rail12v']='696 W combinés (58 A), 3 rails'
put(ids('Enermax','EMG700AWT'),'MODU87+ 700W','exa-late-5',p,mpn='EMG700AWT',notes=['Câbles natifs carte mère/CPU et câbles modulaires : le bloc est semi-modulaire.'])
for w,pci,rail,key in [(550,1,540,'exa-legacy-7'),(750,2,744,'exa-legacy-6')]:
 p=partial(w,'Bronze','Semi-modulaire','ATX12V 2.3',protections='OVP, SCP, OCP');p.update(rail12v=f'{rail} W combinés, 4 rails',connectors=f'1×24 broches ; 1×CPU4 ; 1×CPU8 ; {pci}×PCIe6+2 ; {pci}×PCIe6 ; 9×SATA ; 9×Molex ; 1×FDD')
 put(ids('Antec','True Power',w,'Bronze'),f'TruePower New TP-{w}',key,p,mpn=f'TP-{w}',notes=['Correction de la modularité : la notice décrit des câbles natifs et des cordons amovibles. Le modèleGoldTP-C est une série distincte.'])
p=partial(650,'Bronze','Câbles fixes','ATX12V 2.3',protections='OCP, OVP, SCP, OPP, OTP');p.update(rail12v='650 W maximum combinés, 2 rails',connectors='1×24 broches ; 1×CPU4+4 ; 2×PCIe6+2 ; 7×SATA ; 5×Molex ; 1×FDD')
put(ids('Antec','Earthwatts',650),'EarthWatts EA-650 Green','exa-extra-5',p,mpn='EA-650 Green')
p=base(500,140,'Bronze','Câbles fixes','80 mm','ATX12V 2.3','3 ans','OCP, OVP, SCP');p.update(rail12v='444 W combinés, 2 rails',connectors='1×20+4 ; 1×CPU4+4 ; 1×PCIe6+2 ; 1×PCIe6 ; 5×SATA ; 4×Molex ; 1×FDD')
put(ids('Antec','Earthwatts',500),'EarthWatts EA-500D Green','exa-legacy-11',p,mpn='EA-500D Green',notes=['Le modèleEarthWatts500WBronze correspond à la varianteEA-500DGreen ; l’ancienEA-50080PLUSstandard est distinct.'])
p=partial(750,'Standard','Semi-modulaire','ATX12V 2.3',protections='OVP, SCP, OCP');p['connectors']='1×24 broches ; 1×CPU4 ; 1×CPU8 ; 2×PCIe6+2 ; 2×PCIe6 ; 9×SATA ; 9×Molex ; 1×FDD'
put(ids('Antec','Earthwatts',750),'EarthWatts EA-750','exa-extra-26',p,mpn='EA-750',notes=['AncienEA-75080PLUSstandard : la notice établit le câblage semi-modulaire, malgré la valeur fixe de l’archive.'])
p=partial(750,'Bronze','Câbles fixes','ATX12V 2.3',protections='OCP, OVP, SCP, OPP, OTP, SIP');p['connectors']='1×24 broches ; 1×CPU4+4 ; 4×PCIe6+2 ; 9×SATA ; 6×Molex ; 1×FDD'
put(ids('Antec','Earthwatts Green',750),'EarthWatts EA-750 Green','exa-final-10',p,mpn='EA-750 Green',notes=['La notice espagnole mentionne4rails mais ne nomme que2rails dans la limite combinée ; cette cellule contradictoire n’est pas validée.'])
for w in [550,650,750]:
 p=partial(w,'Gold','Semi-modulaire',fan='120 mm',warranty='7 ans')
 put(ids('Antec',f'NeoECO {w} Gold'),f'NeoECO Gold {w}W semi-modulaire','exa-late-8',p,notes=['Communiqué originalAntec daté31juillet2019, reproduit parHEXUS. La gamme semi-modulaire550/650/750W est explicitement identifiée ; aucun MP N ni câblage duNeoECOGoldModular2021/2024 n’est repris.'])

for w,rail,pci,sata,key in [(600,540,2,5,'9eb995d51aa188a6'),(700,636,4,6,'ee786958fc35bdee')]:
 p=base(w,140,'Standard','Câbles fixes','120 mm','ATX12V 2.4','2 ans');p.update(efficiency='Rendement annoncé jusqu’à88% ; niveau80PLUS non documenté',rail12v=f'{rail} W combinés, 2 rails',connectors=f'1×24 broches ; 1×CPU4+4 ; {pci}×PCIe6+2 ; {sata}×SATA ; 4×Molex ; 1×FDD')
 put(ids('Antec','VP',w),f'VP{w}P','fetch-'+key,p,mpn=f'VP{w}P',notes=['VersionVP2014 sansPLUS ; les caractéristiques duVPPLUS2018 ne sont pas transposées.'])
p=partial(450,'Standard','Câbles fixes','ATX12V 2.3','120 mm','OCP, OVP, SCP, OPP','2 ans');p.pop('efficiency')
put(ids('Antec','VP-P',450),'VP450P','extra-antec-1ce01deaaf',p,mpn='VP450P')
for w in [450,550,650]:
 p={'power':w,'efficiency':'80 PLUS Bronze','fan':'120 mm double roulement à billes'}
 put(ids('Enermax',f'ETL{w}AWT-M'),f'TRIATHLOR ECO {w}W','exa-extra-53',p,mpn=f'ETL{w}AWT-M',notes=['Page officiellejaponaise dédiée aux modèles450/550/650W. Les dimensions et protections de l’ECO800/1000W ne sont pas transposées ; les champs non exposés restent inconnus.'])


p=partial(620,'Bronze','Câbles fixes','ATX12V 2.32','135 mm DBB','OCP, OVP, UVP, SCP, OPP, SIP, BOP')
put(ids('Antec','High Current Gamer',620,'Câbles fixes'),'High Current Gamer HCG-620','exa-last-0',p,mpn='HCG-620')
p=partial(650,'Standard','Câbles fixes','ATX12V 2.32','120 mm','OCP, OVP, SCP, OPP, OTP','2 ans');p.pop('efficiency')
put(ids('Antec','VP650P',650),'VP650P','exa-last-4',p,mpn='VP650P')
p=base(525,140,'Bronze','Câbles fixes','120 mm double roulement à billes','ATX12V 2.3',protections='OCP, OVP, UVP AC/DC, OPP, OTP, SCP, SIP');p.update(rail12v='480 W combinés (40 A), 3 rails')
put(ids('Enermax','EPR525AWT_II'),'PRO82+ II 525W','exa-last-6',p,mpn='EPR525AWTII',sourceOverrides={'height':'pro82ii-page3','width':'pro82ii-page3','depth':'pro82ii-page3','fan':'pro82ii-page3','rail12v':'pro82ii-page4'},notes=['Fiche constructeur de 2009, révision II. Le tableau des câbles doit être relu graphiquement pour confirmer les quantités ; aucun comptage des modèles 385/425/625 W n’est repris.'])
p=base(430,140,'Standard','Câbles fixes','80 mm','ATX12V 2.2',protections='OCP, OVP, SCP');p['efficiency']='Rendement minimum 70 % à 115 V, pleine charge (fiche constructeur ; certification 80 PLUS non confirmée)'
put(ids('Antec','Basiq',430),'Basiq 430','exa-last-7',p,notes=['L’archive mentionnait 80 PLUS ; le document constructeur confirme seulement un rendement minimum de 70 % à pleine charge. Aucun niveau de certification n’est affirmé.'])
p=base(620,140,'Bronze','Câbles fixes','120 mm DBB',warranty='3 ans au Japon via le distributeur agréé Links',protections='OCP, OVP, UVP, SCP, OPP');p.update(rail12v='576 W (48 A), rail unique',connectors='1×24 broches ; 1×CPU4+4 ; 2×PCIe6+2 ; 6×SATA ; 6×Molex ; 1×FDD')
put(ids('Antec','NeoECO',620),'NeoECO 620C','exa-last-8',p,notes=['Documentation technique du distributeur officiel japonais Links, modèle arrêté. La garantie publiée concerne le Japon ; aucune garantie européenne ni référence régionale n’est déduite.'])

(OUT/'curated-models.json').write_text(json.dumps(curated,ensure_ascii=False,indent=2));print(len(curated),'curated assignments')
