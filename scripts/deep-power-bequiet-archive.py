"""Manufacturer family datasheets hosted by be quiet!'s press distributor.

Only the explicitly headed wattage column is transcribed. System Power 10 EU
200–240V cannot enrich the separate U/universal-input archive entries.
"""
families=[
 {'key':'archive-pdf-847ca9feef2c','name':'Straight Power 11','watts':[1200,1000,850,750,650,550],'codes':['BN310','BN309','BN308','BN307','BN306','BN305'],'depth':[170,170,170,160,160,160],'fan':135,'noise':['9.4 / 11.5 / 32.9','7.8 / 8.0 / 28.1','7.7 / 7.9 / 22.0','8.6 / 9.3 / 20.8','8.9 / 9.6 / 16.8','9.0 / 9.6 / 14.9'],'atx':'ATX12V 2.51','eps':'EPS12V 2.92 (550W non certifié EPS)','lifetime':[100000]*6,'cables':[11,11,11,10,9,8],'pcie':[6,6,4,4,4,2],'sata':[11,11,11,11,9,9],'molex':[4,4,4,4,3,3],'cpu':['1 × P4+4 ; 1 × P8']*3+['2 × P4+4 ; 1 × P8']*2+['1 × P4+4'],'doc':'2019-12-16'},
 {'key':'archive-pdf-bb3aa25fb855','name':'Dark Power Pro 11','watts':[1200,1000,850,750,650,550],'codes':['BN255','BN254','BN253','BN252','BN251','BN250'],'depth':[193,193,193,180,180,180],'fan':135,'noise':['10.9 / 11.5 / 27.9','10.2 / 10.4 / 26.3','10.4 / 10.4 / 20.1','8.7 / 9.5 / 19.9','9.2 / 10 / 14.6','8.7 / 8.9 / 10.1'],'atx':'ATX12V 2.4','eps':'EPS12V 2.92','lifetime':[150000]*3+[180000]*3,'cables':[19,19,19,19,17,17],'pcie':[8,8,6,6,4,4],'sata':[10,10,8,8,8,8],'molex':[7,7,7,7,5,5],'cpu':['1 × P4+4 ; 1 × P8']*6,'doc':'08/2015'},
 {'key':'archive-pdf-4f2de0197be5','name':'System Power 10','watts':[850,750,650,550,450],'codes':['BN330','BN329','BN328','BN327','BN326'],'depth':[160,140,140,140,140],'fan':120,'noise':['10.3 / 10.4 / 30.7','8.9 / 13.3 / 34.7','8.9 / 11.2 / 30.7','8.6 / 9.4 / 25.7','8.7 / 9.8 / 19.2'],'atx':'ATX12V 2.52','eps':'EPS12V 2.92','lifetime':[100000]*5,'cables':[7,7,7,6,5],'pcie':[4,4,4,4,2],'sata':[6,6,5,5,5],'molex':[1]*5,'cpu':['1 × P4+4 ; 1 × P8']*2+['1 × P4+4 ; 1 × P4']*2+['1 × P4+4'],'doc':'V1/22'},
]
for f in families:
 e=source(f['key']);t=e['primaryText']
 for a in items:
  c=a['component'];base=c['name'].split(' · ')[0];w=c.get('wattage')
  if c['category']!='psu' or c['brand']!='be quiet!' or base!=f['name'] or w not in f['watts']:continue
  if f['name']=='Straight Power 11' and 'Platinum' not in c['name']:continue
  n=f['watts'].index(w);mpn=f['codes'][n];assert mpn in t
  cert='Gold' if f['name']=='System Power 10' and w==850 else 'Bronze' if f['name']=='System Power 10' else 'Platinum'
  rows=[('Modèle de la colonne',f['name']+' '+str(w)+' W'),('Article fabricant',mpn),('Version du document',f['doc']),('Puissance continue',str(w)+' W'),('Dimensions (L × W × H)',f"{f['depth'][n]} × 150 × 86 mm"),('ATX Version',f['atx']),('Norme EPS',f['eps'] if not (f['name']=='Straight Power 11' and w==550) else 'Non'),('Fan Size',str(f['fan'])+' mm'),('Noise Level at 20 / 50 / 100% load',f['noise'][n]+' dB(A)'),('80 PLUS certification',cert),('PFC','Actif'),('Protections','OCP, OVP, UVP, SCP, OPP, OTP'),('Durée de vie annoncée à 25 °C',('>' if f['name']=='System Power 10' else '')+str(f['lifetime'][n])+' heures'),('Warranty','5 years'),('Nombre de câbles',str(f['cables'][n])),('ATX 20+4-pin','1'),('PCI-Express 6+2-pin',str(f['pcie'][n])),('P8/P4 connector',f['cpu'][n]),('SATA connectors',str(f['sata'][n])),('Molex 4-pin',str(f['molex'][n]))]
  if f['name']=='System Power 10':
   rows.extend([('Région explicite du tableau logistique','EU'),('Input Voltage','200–240 VAC, 50 Hz'),('Modular','Non Modular'),('Power Good Signal','100–150 ms'),('Puissance en veille','<0.15 W')])
   currents={850:['22','22','40 / 36','0.3','3'],750:['20','20','62.5','0.3','3'],650:['20','20','54.17','0.3','3'],550:['20','20','45.83','0.3','3'],450:['20','20','37.5','0.3','3']}[w]
   labels=['+3.3 V','+5 V','+12 V1 / +12 V2' if w==850 else '+12 V','−12 V','+5 VSB'];rows.extend(('Rail '+l+' — courant maximal',v+' A') for l,v in zip(labels,currents));rows.extend([('Puissance combinée +3,3 / +5 V',str({850:120,750:130,650:120,550:120,450:110}[w])+' W'),('Puissance +12 V','849.6 W' if w==850 else str(w)+' W'),('Puissance −12 V','3.6 W'),('Puissance +5 VSB','15 W')])
  else:
   rows.append(('Longueur du câble ATX','60 cm'));rows.append(('Nombre de rails +12 V','4'));rows.append(('Fan model','Silent Wings 3'))
   if f['name']=='Straight Power 11':rows.extend([('Input Voltage','100–240 VAC, 50–60 Hz'),('Modular','Fully Modular'),('Longueur maximale des câbles','115 cm')])
   else:rows.extend([('Input Voltage',('110–240' if w==1200 else '100–240')+' VAC, 50–60 Hz'),('Modularité','Câblage modulaire (câble ATX fixe)'),('Longueur maximale des câbles','120 cm'),('PCI-Express 6-pin','1'),('Floppy',str(2 if w>=750 else 1)),('Overclocking Key','Commutation quatre rails / monorail +12 V')])
  add(c['id'],f['key'],rows,{'wattage':w,'psuFormat':'ATX','depthMm':f['depth'][n],'widthMm':150,'heightMm':86,'fanCount':1,'fanSizeMm':f['fan']},mpn=mpn,replace=True,notes=['Fiche de presse technique be quiet! publiée par son distributeur presse TechnikPR. La colonne propre à cette puissance fournit les caractéristiques ; les variantes U à entrée universelle restent séparées des System Power 10 EU.'])
  modelIdentities.pop(c['id'],None)
  indexAudit.append({'id':c['id'],'brand':'be quiet!','state':'exact_manufacturer_historical_datasheet_column','sourceURL':e['url'],'mpn':mpn,'columnPowerW':w,'documentVersion':f['doc']})
