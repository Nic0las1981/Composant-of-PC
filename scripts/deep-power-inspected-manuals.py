"""Literal transcriptions of visually inspected manufacturer PDF tables.

Inspection pages are recorded separately from automatic OCR. The model at the
top of each table, cable topology and each individual rail were read directly.
"""
inspection=[]
for family,key,watts,depth,temp,cert in [
 ('G2','evga-manual-220-g2-0850-0750',[750,850],180,50,'Gold'),
 ('P2','evga-manual-220-p2-0850-0750-0650',[650,750,850],165,50,'Platinum'),
 ('W1','evga-manual-100-w1-0600-0500-0430',[430,500,600],140,40,'80 PLUS')]:
 e=source(key)
 inspection.append({'sourceKey':key,'url':e['url'],'sourceCheckedAt':e['checkedAt'],'sourceSha256':e['sha256'],'inspection':'inspected','method':'PDF rendered to PNG; specifications and cable table visually read with view_image','pdfPages':[8,9] if family!='W1' else [8],'inspectionDate':'2026-11-10'})
 for a in items:
  c=a['component'];w=c.get('wattage');base=c['name'].split(' · ')[0]
  if c['category']!='psu' or c['brand']!='EVGA' or w not in watts or base not in [str(w)+' '+family,'SuperNOVA '+str(w)+' '+family]:continue
  v12={('G2',750):('62.4','748.8'),('G2',850):('70.8','849.6'),('P2',650):('54.1','649.2'),('P2',750):('62.4','748.8'),('P2',850):('70.8','849.6'),('W1',430):('34','408'),('W1',500):('40','480'),('W1',600):('49','588')}[(family,w)]
  a5=24 if family=='G2' else 15 if family=='W1' and w==430 else 20;a33=24 if family in ['G2','W1'] else 20;sb='2.5' if family=='P2' else '3';neg='0.3' if family=='W1' else '0.5'
  combined=100 if family=='P2' else 130 if family=='W1' and w==600 else 120
  rows=[('Modèle du tableau',base),('Puissance continue et température ambiante',f'{w} W à +{temp} °C'),('Certification 80 PLUS',cert),('Entrée secteur','100–240 VAC, '+('10/5 A, 50–60 Hz' if family=='W1' and w==600 else '8/4 A, 50–60 Hz' if family=='W1' else '10 A, 60/50 Hz')),('Dimensions hauteur × largeur × profondeur',f'85 × 150 × {depth} mm'),('Rail +5 V — courant maximal',str(a5)+' A'),('Rail +3,3 V — courant maximal',str(a33)+' A'),('Rail +12 V — courant maximal',v12[0]+' A'),('Rail −12 V — courant maximal',neg+' A'),('Rail +5 VSB — courant maximal',sb+' A'),('Puissance combinée +5 / +3,3 V',str(combined)+' W'),('Rail +12 V',v12[1]+' W'),('Puissance −12 V','3.6 W' if family=='W1' else '6 W'),('Puissance +5 VSB','12.5 W' if family=='P2' else '15 W')]
  if family!='W1':rows.append(('Protections','OVP, UVP, SCP, OPP, OCP'))
  rows.append(('ATX carte mère','1 × ATX 20+4 broches' if family=='W1' else '1 × ATX 24 broches'))
  if family=='W1':cables=[('CPU','1 × EPS/ATX12V 8 (4+4) broches'),('PCIe','1 câble à 2 connecteurs 8 (6+2) broches'),('SATA','2 câbles à 3 connecteurs chacun'),('Périphériques','1 câble à 3 Molex 4 broches + 1 Floppy')]
  elif family=='P2' and w==650:cables=[('CPU','1 × EPS/ATX12V 8 (4+4) broches + 1 adaptateur CPU 8 broches vers 8 (4+4) broches'),('PCIe','2 câbles, chacun avec 1 connecteur 6 broches et 1 connecteur 8 (6+2) broches'),('SATA','3 câbles à 3 connecteurs chacun'),('Molex','2 câbles à 3 connecteurs chacun'),('Floppy','1 adaptateur Molex vers FDD')]
  else:cables=[('CPU','2 × EPS/ATX12V 8 (4+4) broches'),('PCIe','4 × 8 (6+2) broches' if family=='G2' and w==750 else '2 câbles à 1 connecteur 8 (6+2) broches ; 2 câbles à 1 connecteur 6 broches + 1 connecteur 8 (6+2) broches'),('SATA','3 câbles à 3 connecteurs chacun' if family=='G2' and w==750 else '2 câbles à 3 connecteurs chacun ; 1 câble à 4 connecteurs'),('Molex','1 câble à 4 connecteurs'),('Floppy','1 adaptateur Molex vers FDD')]
  rows.extend(('Connectique — '+k,v) for k,v in cables)
  model_record(c,key,rows,{'wattage':w,'heightMm':85,'widthMm':150,'depthMm':depth},base,['Tableau électrique et câblage de cette puissance inspectés visuellement dans le manuel EVGA ; les codes régionaux ne sont pas déduits du nom du PDF.'])
  indexAudit.append({'id':c['id'],'brand':'EVGA','state':'visually_inspected_watt_specific_manual','sourceURL':e['url'],'pdfPages':[8,9] if family!='W1' else [8]})
(D/'inspected-pdf-tables.json').write_text(json.dumps(inspection,ensure_ascii=False,indent=2))

# The older NZXT English manual has explicit columns for every model. Parse
# exactly the English block; fan figures are published as fan specifications.
for key,prefix,generation in [('extra-pdf-35be845f4579','E','2018'),('extra-pdf-f81f941af3aa','C','2019')]:
 e=source(key);raw=e['primaryRawText'];eng=raw[raw.index('Compliance Standard'):].split('合規標準')[0]
 pattern=r'\+3\.3V\n(?P<a33>[\d.]+A)\n\+5V\n(?P<a5>[\d.]+A)\n(?P<combined>[\d.]+W)\n-12V\n(?P<aneg>[\d.]+A)\n(?P<pneg>[\d.]+W)\n\+12V\n(?P<a12>[\d.]+A)\n(?P<p12>[\d.]+W)\n(?P<w>\d+)W\n(?P<model>[CE]\d+)\n\+5Vsb\n(?P<asb>[\d.]+A)\n(?P<psb>[\d.]+W)\n(?P<ac>[^\n]+Hz)'
 tables={m['model']:m.groupdict() for m in re.finditer(pattern,eng)}
 for a in items:
  c=a['component'];w=c.get('wattage');base=c['name'].split(' · ')[0];model=prefix+str(w)
  if c['category']!='psu' or c['brand']!='NZXT' or model not in tables:continue
  if (prefix=='E' and base!=model) or (prefix=='C' and base!='C (2019)'):continue
  d=tables[model];assert int(d['w'])==w
  rows=[('Modèle du tableau',model+' ('+generation+')'),('Puissance continue',str(w)+' W'),('Compliance Standard','ATX12V v2.4 / EPS12V v2.92'),('PFC','Actif, 0.99'),('Entrée secteur',d['ac']),('Certification 80 PLUS','Gold'),('Rendement à 115 VAC','87 % à 20 % de charge ; 90 % à 50 % ; 87 % à 100 %'),('Fan Size','120 mm'),('Dimensions du ventilateur','120 × 120 × 25 mm'),('Fan Airflow','73.9 CFM'),('Bruit du ventilateur','32.3 dBA'),('Fan Bearing','Fluid Dynamic Bearing'),('Operating Temperature','50 °C' if prefix=='E' else '0–50 °C'),('MTBF','100 000 heures')]
  rows.extend((label,d[f]) for f,label in [('a33','Rail +3,3 V — courant maximal'),('a5','Rail +5 V — courant maximal'),('a12','Rail +12 V — courant maximal'),('aneg','Rail −12 V — courant maximal'),('asb','Rail +5 VSB — courant maximal'),('combined','Puissance combinée +3,3 / +5 V'),('p12','Rail +12 V'),('pneg','Puissance −12 V'),('psb','Puissance +5 VSB')])
  model_record(c,key,rows,{'wattage':w,'psuFormat':'ATX','fanCount':1,'fanSizeMm':120},'NZXT '+model+' ('+generation+')',['Les valeurs électriques proviennent de la colonne du modèle exact. Les 32.3 dBA caractérisent le ventilateur selon NZXT, pas le bruit mesuré de l’alimentation complète. Les générations C2019/C2022/C2024 restent séparées.'])
  indexAudit.append({'id':c['id'],'brand':'NZXT','state':'watt_specific_legacy_manufacturer_manual','sourceURL':e['url'],'manufacturerModel':model+' ('+generation+')'})
