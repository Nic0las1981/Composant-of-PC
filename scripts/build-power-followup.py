"""Exact PSU follow-up from manufacturer manuals and individually fetched pages.

The closed mapping below is deliberate: no fuzzy model, colour, year or regional
SKU matching. All fields retain a source URL. Original snapshots are not evidence
for a neighbouring wattage. Run after collecting power-followup sources.
"""
import datetime, gzip, hashlib, json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[1]
D = ROOT / 'data/deep-review/power-followup'
BASE = json.load(gzip.open(ROOT / 'data/full-review/input.json.gz', 'rt'))
INPUT = {c['id']: c for c in BASE if c['category'] == 'psu'}
PRODUCTS = {}
PROVENANCE = []
SOURCES = {}
for p in (D / 'sources').glob('*.json'):
    s = json.loads(p.read_text())
    if s.get('status') == 200:
        s['evidenceFile'] = str(p.relative_to(ROOT))
        SOURCES[s['url'].rsplit('/', 1)[-1]] = s

def doc(name):
    assert name in SOURCES, name
    return SOURCES[name]

def add(id, model, source, rows, patch=None, notes=None, evidence=None):
    assert id in INPUT and id not in PRODUCTS, id
    rows = list(dict.fromkeys((k, str(v).strip()) for k, v in rows if str(v).strip()))
    p = {'mpn': '', 'identityKind': 'manufacturer-model', 'manufacturerModel': model,
         'identityNote': 'Modèle, puissance et génération documentés dans la source citée. Le suffixe commercial régional reste inconnu ; aucun MPN étranger n’est attribué à cette ligne.',
         'sources': [{'name': INPUT[id]['brand'] + ' — manuel ou fiche du modèle', 'url': source['url'], 'checkedAt': source['checkedAt'], 'kind': source.get('kind','manufacturer')}],
         'groups': [{'title': 'Alimentation · spécifications vérifiées', 'rows': [{'label': k, 'value': v} for k, v in rows]}],
         'patch': {'manufacturerModel': model, **(patch or {})}, 'offers': [],
         'notes': ['Aucune offre commerciale créée sans référence régionale exacte, prix EUR neuf disponible en France et date de vérification.'] + (notes or [])}
    keys={'wattage':'power','psuFormat':'format','heightMm':'height','widthMm':'width','depthMm':'depth','fanSizeMm':'fan'}
    p['fieldEvidence'] = {keys[k]: {'value': v, 'sourceURL': source['url'], 'checkedAt': source['checkedAt']} for k, v in (patch or {}).items() if k in keys}
    rowkeys={'Puissance du rail +12 V':'rail12v','Protections documentées':'protections','Garantie du manuel':'warranty','Garantie du document historique (années)':'warranty'}
    for k,v in rows:
        if k in rowkeys:p['fieldEvidence'][rowkeys[k]]={'value':v,'sourceURL':source['url'],'checkedAt':source['checkedAt']}
    cables=[(k,v) for k,v in rows if k.startswith('Câble ')]
    names=' '.join(k for k,v in cables)
    if cables and all(re.search(term,names,re.I) for term in [r'ATX|SFX',r'EPS',r'PCI.?E',r'SATA',r'Peripheral']):
        p['fieldEvidence']['connectors']={'value':' ; '.join(k+' : '+v for k,v in cables),'sourceURL':source['url'],'checkedAt':source['checkedAt']}
    p['fieldEvidence'].update(evidence or {})
    PRODUCTS[id] = p
    PROVENANCE.append({'id': id, 'manufacturerModel': model, 'sourceURL': source['url'], 'sourceFile': source.get('evidenceFile'), 'sha256': source.get('sha256'), 'facts': [{'label': k, 'value': v, 'sourceURL': source['url']} for k, v in rows]})
    return p

def dims(row, fmt='ATX'):
    return [('Largeur', f'{row[0]:g} mm'), ('Hauteur', f'{row[1]:g} mm'), ('Profondeur', f'{row[2]:g} mm'), ('Format', fmt)], dict(widthMm=row[0], heightMm=row[1], depthMm=row[2], psuFormat=fmt)

def page_for(s, model):
    matches = [p for p in s['rawTextFirst12Pages'].split('\f') if re.search(r'(?im)(?:^'+re.escape(model)+r'\nDIMENSIONS:|CORSAIR '+re.escape(model)+r' POWER TABLE)', p) and re.search(r'Dimensions: [\d.]+mm \(W\)',p,re.I)]
    assert len(matches) == 1, (model, len(matches))
    return matches[0]

def manual_product(id, name, model, document, certification, fmt='ATX'):
    s = doc(document); p = page_for(s, model)
    m = re.search(r'Dimensions: ([\d.]+)mm \(W\) x ([\d.]+)\s*mm \(H\) x ([\d.]+)mm \(L\)', p, re.I)
    assert m, model
    rows, patch = dims([float(v) for v in m.groups()], fmt)
    specs = [('Modèle électrique', r'Model ([A-Z0-9-]+)'), ('Référence de base du manuel (sans région)', r'Part No\. ([^\n+]+)'), ('Tension d’entrée', r'AC input Rating (.*?) \+12V'), ('Courant d’entrée', r'Input Current (.*?) -12V'), ('Fréquence secteur', r'Frequency (.*?) \+5Vsb'), ('Puissance totale', r'Total Power: (\d+W)'), ('Courant maximal +12 V', r'\+12V ([\d.]+A)'), ('Puissance du rail +12 V', r'\+12V [\d.]+A ([\d.]+W)'), ('Rail −12 V', r'-12V ([\d.]+A [\d.]+W)'), ('Rail +5 VSB', r'\+5Vsb ([\d.]+A [\d.]+W)')]
    for label, pattern in specs:
        match = re.search(pattern, p, re.I)
        if match: rows.append((label, match[1]))
    power = re.search(r'Total Power: (\d+)W', p, re.I)
    assert power and int(power[1]) == INPUT[id]['wattage'], (id, power)
    patch['wattage'] = int(power[1])
    for rail in ['3.3', '5']:
        match = re.search(r'\+'+re.escape(rail)+r'V ([\d.]+A)', p)
        if match: rows.append(('Courant maximal +'+rail+' V', match[1]))
    comb = re.search(r'\+3\.3V [\d.]+A\n(\d+W)', p)
    if comb: rows.append(('Puissance combinée +3,3 V / +5 V', comb[1]))
    cables = []
    for match in re.finditer(r'(?mi)^(\d+)\n([^\n]+) Connectors Per Cable\n(\d+)mm\n\(± (\d+)mm\)\n(\d+)\nTotal Connectors\n(\d+)', p):
        qty, label, length, tolerance, per, total = match.groups()
        assert int(qty)*int(per) == int(total), (model, match.groups())
        cables.append((f'Câble {label}', f'{qty} câble(s), {per} prise(s) par câble, {total} au total ; {length} ± {tolerance} mm'))
    rows.extend(cables)
    rows.extend([('Certification 80 PLUS', certification), ('Modularité', 'Entièrement modulaire')])
    # Each cited manual explicitly applies these four protections to its family.
    txt = s['rawTextFirst12Pages']
    if all('('+key+')' in txt for key in ['OVP', 'OCP', 'OTP', 'SCP']): rows.append(('Protections documentées', 'OVP / OCP / OTP / SCP'))
    return add(id, name, s, rows, patch, ['Les nombres de câbles et de prises sont distincts ; seules les lignes lisibles du tableau du modèle sont intégrées.'])

# No generic SF750: 2018/2024 are different products. No white RMx inferred
# from the black-model manual. No generic HX1000i/1200i spanning generations.
for record in [
 ('import-psu-6f8ec38c2bc3', 'Corsair HX1200 Platinum', 'HX1200', 'HX_Manual.pdf', 'Platinum', 'ATX'),
 ('import-psu-e11ee9db91b6', 'Corsair HX1000 Platinum', 'HX1000', 'HX_Manual.pdf', 'Platinum', 'ATX'),
 ('import-psu-a4f544012d84', 'Corsair HX850 Platinum', 'HX850', 'HX_Manual.pdf', 'Platinum', 'ATX'),
 ('import-psu-2a2ff809de6b', 'Corsair HX750 Platinum', 'HX750', 'HX_Manual.pdf', 'Platinum', 'ATX'),
 ('import-psu-be630b23fca0', 'Corsair HX850 Platinum', 'HX850', 'HX_Manual.pdf', 'Platinum', 'ATX'),
 ('import-psu-36454540ee03', 'Corsair HX750 Platinum', 'HX750', 'HX_Manual.pdf', 'Platinum', 'ATX'),
 ('import-psu-915f16a853b2', 'Corsair AX1000 Titanium', 'AX1000', 'AX_850_1000_QSG.pdf', 'Titanium', 'ATX'),
 ('import-psu-04b783f7c97b', 'Corsair AX850 Titanium', 'AX850', 'AX_850_1000_QSG.pdf', 'Titanium', 'ATX'),
 ('import-psu-97655e646272', 'Corsair SF450 Gold (2016)', 'SF450', 'SF_Series_Manual.pdf', 'Gold', 'SFX'),
 ('import-psu-7b199188b107', 'Corsair SF600 Gold (2016)', 'SF600', 'SF_Series_Manual.pdf', 'Gold', 'SFX'),
 ('import-psu-ac9598f00ae0', 'Corsair SF450 Platinum (2018)', 'SF450', 'SF_PLATINUM_User_Manual.pdf', 'Platinum', 'SFX'),
 ('import-psu-1eda38126ca2', 'Corsair RM550x (2018)', 'RM550x', 'RMx_2018_Manual.pdf', 'Gold', 'ATX'),
]: manual_product(*record)

# The 2021 CX-M cable table is explicitly a connector-quantity table with
# four wattage columns. The 650W catalogue entry lacks the year and is excluded.
s = doc('WW_CXM_Series_2021_QSG_AA.pdf'); t = s['rawTextFirst12Pages']
for id, w, code, rps, amps, rail, combined, sata in [
 ('import-psu-235d83e39651',450,'CP-9020219','RPS0136','37.4','448.8',110,4),
 ('import-psu-069bc31fb3e0',550,'CP-9020220','RPS0137','45.8','549.6',120,6),
 ('import-psu-624d0d558c50',750,'CP-9020222','RPS0139','62','744',130,4),
]:
    assert re.search('CORSAIR CX'+str(w)+r'M POWER TABLE[\s\S]*?'+rps+r'[\s\S]*?TOTAL POWER: '+str(w)+'W',t)
    rows, patch = dims([150,86,140]); patch['wattage'] = w
    rows += [('Référence de base (sans région)',code),('Modèle électrique',rps),('Puissance totale',f'{w} W'),('Certification 80 PLUS','Bronze'),('Modularité','Semi-modulaire'),('Tension d’entrée','100–240 V'),('Courant d’entrée','10–5 A'),('Fréquence secteur','47–63 Hz'),('Courant maximal +12 V',amps+' A'),('Puissance du rail +12 V',rail+' W'),('Courants +3,3 V / +5 V','20 A / 20 A'),('Puissance combinée +3,3 V / +5 V',f'{combined} W'),('Rail −12 V','0,3 A ; 3,6 W'),('Rail +5 VSB','3 A ; 15 W'),('Protections documentées','OVP / OCP / OTP / SCP'),('Connecteurs',f'ATX 24 : 1 ; EPS 4+4 : {2 if w==750 else 1} ; PCIe 6+2 : 2 ; SATA : {sata} ; périphériques 4 contacts : 4'),('Longueurs de câbles','ATX : 610 mm ; EPS : 650 mm ; PCIe : 750 mm ; périphériques : 750 mm (±10 mm)')]
    add(id,f'Corsair CX{w}M (2021)',s,rows,patch)

# Original AX Platinum has its own exact per-model power table.
s=doc('AX_Series_Manual.pdf');t=s['rawTextFirst12Pages']
for id,w,code,input_current,amps,rail in [('import-psu-7e42f06d2330',860,'75-001305','11–5,5','71','852'),('import-psu-680602a7977a',760,'75-001304','9,5–4,5','63','756')]:
    block=re.search(r'AX'+str(w)+r'\nMODEL '+code+r'[\s\S]*?Total Power '+str(w)+'W',t);assert block
    rows,patch=dims([150,86,160]);patch['wattage']=w
    rows += [('Modèle électrique',code),('Puissance totale',f'{w} W'),('Certification 80 PLUS','Platinum'),('Modularité','Entièrement modulaire'),('Température de puissance nominale','50 °C'),('Garantie du manuel','7 ans'),('MTBF','100 000 heures'),('Ventilation','Mode hybride sélectionnable ; roulement à billes'),('Tension d’entrée','100–240 V'),('Courant d’entrée',input_current+' A'),('Fréquence secteur','50–60 Hz'),('Courant maximal +12 V',amps+' A'),('Puissance du rail +12 V',rail+' W'),('Courants +3,3 V / +5 V','25 A / 25 A'),('Puissance combinée +3,3 V / +5 V','125 W'),('Rail −12 V','0,5 A ; 6 W'),('Rail +5 VSB','3 A ; 15 W'),('Câbles ATX et CPU','ATX 24 : 1 câble de 610 mm ; EPS 4+4 : 2 câbles de 650 mm'),('Câbles SATA','2 câbles de 700 mm + 1 câble de 850 mm, 4 prises chacun'),('Câbles PCIe','6 câbles 6+2 ; longueurs 600 et 750 mm indiquées au tableau')]
    add(id,f'Corsair AX{w} Platinum',s,rows,patch,['Le diamètre du ventilateur et les protections ne figurent pas dans le passage technique exploité ; aucune valeur du modèle AXi n’est transférée.'])

# RMi: image-only official PDF. Pages 3–10 were rendered and visually checked;
# OCR was discovery only. Cable totals below follow each individual page.
s=doc('RMi_Manual.pdf')
for id,w,code,rps,depth,input_current,amps,rail,combined,eps,pcie,sata,molex in [
 ('import-psu-8a874420b80d',1000,'CP-9020084','RPS0010',180,'13–6,5','83.3','1000',150,2,8,12,11),
 ('import-psu-22714563f939',850,'CP-9020083','RPS0009',180,'12–6','70.8','850',150,2,6,10,8),
 ('import-psu-d516d688b89a',750,'CP-9020082','RPS0008',180,'10–5','62.5','750',150,1,4,8,7),
 ('import-psu-6c0d9910ad5f',650,'CP-9020081','RPS0007',160,'10–5','54','648',130,1,4,8,7),
]:
    rows,patch=dims([150,86,depth]);patch['wattage']=w
    rows += [('Modèle électrique',rps),('Référence de base (sans région)',code),('Puissance totale',f'{w} W'),('Certification 80 PLUS','Gold'),('Modularité','Entièrement modulaire'),('Tension d’entrée','100–240 V'),('Courant d’entrée',input_current+' A'),('Fréquence secteur','47–63 Hz'),('Courant maximal +12 V',amps+' A'),('Puissance du rail +12 V',rail+' W'),('Courants +3,3 V / +5 V','25 A / 25 A'),('Puissance combinée +3,3 V / +5 V',f'{combined} W'),('Rail −12 V','0,8 A ; 9,6 W'),('Rail +5 VSB','3 A ; 15 W'),('Connecteurs',f'ATX 24 : 1 ; EPS 4+4 : {eps} ; PCIe 6+2 : {pcie} ; SATA : {sata} ; périphériques : {molex} ; Floppy : 2'),('Longueurs principales','ATX : 610 mm ; EPS : 650 mm ; PCIe : 750 mm ; Floppy : 101 mm'),('Pilotage','Corsair Link ; câbles Link 4 contacts et USB 9 contacts de 800 mm'),('Protections documentées','OVP / OCP / OTP / SCP'),('Condensateurs','Japonais, 105 °C')]
    add(id,f'Corsair RM{w}i',s,rows,patch,['Tables des pages 3–10 du manuel fabricant contrôlées visuellement. Région de vente non identifiée.'])

# AXi single-model manuals explicitly separate their own cable quantities.
for id,w,document,depth in [('import-psu-9cf437156142',1600,'AX1600i_C14_Manual_Web.pdf',200),('import-psu-3ee2957a3ced',1500,'AX1500i_Manual.pdf',225)]:
    s=doc(document);t=s['rawTextFirst12Pages'];assert f'AX{w}i cable configuration' in t
    rows,patch=dims([150,86,depth]);patch.update(wattage=w,fanSizeMm=140,fanCount=1)
    rows += [('Puissance nominale du modèle',f'{w} W'),('Certification 80 PLUS','Titanium'),('Modularité','Entièrement modulaire'),('Ventilateur','140 mm'),('MTBF','100 000 heures'),('Pilotage','Corsair Link ; test intégré'),('Protections documentées','OVP / OCP / OTP / SCP'+(' / UVP / OPP' if w==1600 else ''))]
    for m in re.finditer(r'(?m)^(\d+) (\d+)mm ± (\d+)mm (\d+) (.+cable[^\n]*)',t):
        qty,length,tol,per,label=m.groups();rows.append(('Câble '+label,f'{qty} câble(s) × {per} prise(s) ; {length} ± {tol} mm'))
    add(id,f'Corsair AX{w}i',s,rows,patch,['Le manuel extrait ne fournit pas le tableau électrique des rails ni une révision ATX numérique : ces valeurs restent inconnues. La variante AX1500i 240V n’est pas assimilée à ce modèle.'])

# Historical model matrix distributed through Corsair's 1WorldSync content.
# Only exact model + certification combinations whose generation is unambiguous
# are selected. Generic RM, GS and VS names remain excluded.
s=doc('original.pdf')
models=[['AX1200i','AX860i','AX760i','AX1200','AX860','AX850'],['AX760','AX750','HX1050','HX850','HX750','HX650'],['RM1000','RM850','RM750','RM650','RM550','RM450'],['TX850M','TX750M','TX650M','TX850','TX750','TX650'],['GS800','GS700','GS600','CX750M','CX600M','CX500M'],['CX430M','CX750','CX600','CX500','CX430','VS650'],['VS550','VS450','VS350']]
targets={
 'AX1200i':('import-psu-57d8fe5b5caa',0), 'AX860i':('import-psu-dc2ade159acd',0), 'AX760i':('import-psu-8e31c7e8c0d6',0),
 'AX1200':('import-psu-622b6e416594',0), 'AX850':('import-psu-0e0cba288992',0), 'AX750':('import-psu-ee53dae28991',1),
 'HX1050':('import-psu-d54670d6fafc',1),'HX850':('import-psu-5ffd511859d8',1),'HX750':('import-psu-f4c4e92a165a',1),'HX650':('import-psu-e8dbae2c2b91',1),
 'TX850M':('import-psu-1522ca456f43',3),'TX750M':('import-psu-b63b0e5b1973',3),'TX650M':('import-psu-8e32b064b257',3),
 'CX600M':('import-psu-062b3f2e719f',4),'CX500M':('import-psu-f98ca324624c',4),'CX430M':('import-psu-0c5c47a807f5',5),
}
translate={'Continuous power (W)':'Puissance continue','Peak power (W)*':'Puissance de crête (distincte du continu)','ATX12V Version':'Version ATX','EPS12V Version':'Version EPS','Modular cable management':'Modularité','MTBF (hours)':'MTBF','Operating temperature range (°C)':'Température de fonctionnement','Continuous output rated temperature (°C)':'Température de puissance nominale','Warranty (Years)':'Garantie du document historique (années)','Input Voltage (VAC)':'Tension d’entrée','Input Frequency (Hz)':'Fréquence secteur','Input current (A)':'Courant d’entrée','Power factor at 100% load':'Facteur de puissance à pleine charge','Hold-up time (ms)':'Temps de maintien (ms)','+12V (A)':'Courant maximal +12 V','+12V (W)':'Puissance du rail +12 V','+3.3V (A)':'Courant maximal +3,3 V','+5V (A)':'Courant maximal +5 V','Max. combined power 3.3V + 5V (W)':'Puissance combinée +3,3 V / +5 V','+5Vsb (A)':'Courant maximal +5 VSB','-12V (A)':'Courant maximal −12 V','Fan bearing technology':'Roulement du ventilateur','Fan size (mm)':'Diamètre du ventilateur','80 PLUS certification level':'Certification 80 PLUS','Motherboard cable (20+4 pin)':'Connecteur carte mère 20+4','Motherboard cable length (mm, +/- 10mm)':'Longueur câble ATX (±10 mm)','4+4-pin (CPU, works as either 4 or 8-pin)':'Connecteurs CPU 4+4','CPU power cable length (mm, +/- 10mm)':'Longueur câble CPU (±10 mm)','PCIe 6+2 pin (GPU)':'Connecteurs PCIe 6+2','PCIe power cable length (mm, +/- 10mm)':'Longueur câble PCIe (±10 mm)','4-pin Peripheral power connector ("Molex", HDD)':'Connecteurs périphériques 4 contacts','SATA 5-pin connector':'Connecteurs SATA','Floppy power':'Connecteurs Floppy','Color':'Finition','Material':'Matériau'}
for model,(id,page_idx) in targets.items():
    page=s['text'].split('\f')[page_idx];column=models[page_idx].index(model)+1
    values={}
    for line in page.splitlines():
        cells=re.split(r'\s{2,}',line.strip())
        if len(cells)==len(models[page_idx])+1:values[cells[0]]=cells[column]
    assert values['Continuous power (W)']==str(INPUT[id]['wattage'])+'W',(model,values.get('Continuous power (W)'))
    certification=values['80 PLUS certification level'];assert certification in INPUT[id]['name'],(id,certification)
    measurements=list(map(float,re.findall(r'\d+(?:\.\d+)?',values['Dimensions without cable (L x W x D), (mm)'])))
    assert len(measurements)==3 and measurements[1:]==[150,86]
    rows,patch=dims([150,86,measurements[0]]);patch.update(wattage=INPUT[id]['wattage'],fanSizeMm=int(values['Fan size (mm)'].removesuffix('mm')),fanCount=1)
    rows += [(translate[k],v) for k,v in values.items() if k in translate]
    connector_keys=['Motherboard cable (20+4 pin)','4+4-pin (CPU, works as either 4 or 8-pin)','PCIe 6+2 pin (GPU)','4-pin Peripheral power connector ("Molex", HDD)','SATA 5-pin connector','Floppy power']
    assert all(k in values for k in connector_keys),model
    rows.append(('Connecteurs',' ; '.join(translate[k]+' : '+values[k] for k in connector_keys)))
    protections=[key for key in ['OCP','OVP','UVP','SCP','OTP','OPP'] if any(label.startswith(key+' (') and value=='Yes' for label,value in values.items())]
    if protections:rows.append(('Protections documentées',' / '.join(protections)))
    notes=['Fiche historique Corsair diffusée par son fournisseur de contenu 1WorldSync ; extraction de la colonne individuelle, certification et modularité contrôlées. Les puissances de crête ne remplacent jamais la puissance continue.']
    conflict={}
    if model in ['AX760i','AX860i']:
        patch.pop('fanSizeMm');patch.pop('depthMm')
        rows=[(k,v) for k,v in rows if k not in ['Profondeur','Diamètre du ventilateur']]
        rows += [('Dimensions et ventilation · conflit documentaire','Fiche historique : profondeur 180 mm, ventilateur 120 mm ; page actuelle : profondeur 160 mm, ventilateur 140 mm')]
        for key in ['depth','fan','warranty']:conflict[key]={'value':'Fiche historique et page fabricant actuelle incompatibles','sourceURL':s['url'],'checkedAt':s['checkedAt'],'conflicting':True,'reason':'Profondeur 180/160 mm ; ventilateur 120/140 mm ; garantie 7/10 ans : aucune valeur retenue sans révision identifiée.'}
    p=add(id,'Corsair '+model+' '+certification,s,rows,patch,notes,conflict)
    if model in ['AX760i','AX860i']:
        filename='exa-fetch-corsair-pages-noctua.json' if model=='AX760i' else 'exa-fetch-corsair-axi.json'
        fetched=json.loads((D/filename).read_text());ft='\n'.join(c.get('text','') for c in fetched['content'])
        url=next(u for u in re.findall(r'(?m)^URL: (\S+)',ft) if model.lower() in u)
        p['sources'].append({'name':'Corsair — page actuelle en conflit avec le document historique','url':url,'kind':'manufacturer','checkedAt':fetched['retrievedAt']})

# The original TX650 V2 sheet explicitly distinguishes every regional SKU.
s=doc('6909591_0.pdf');s['kind']='retailer';assert '650 Watt @ 50' in s['text']
rows,patch=dims([150,86,160]);patch.update(wattage=650)
rows += [('Puissance continue','650 W à 50 °C'),('Version ATX','2.31'),('Version EPS','2.92'),('Certification 80 PLUS','Bronze'),('Modularité','Câbles fixes'),('Tension d’entrée','90–264 V'),('PFC','Actif ; facteur de puissance 0,99'),('Roulement','Double roulement à billes'),('Courant maximal +12 V','53 A'),('Puissance du rail +12 V','636 W'),('Courants +3,3 V / +5 V','30 A / 30 A'),('Puissance combinée +3,3 V / +5 V','150 W'),('Rail −12 V','0,8 A ; 9,6 W'),('Rail +5 VSB','3 A ; 15 W'),('Protections','OVP / OCP / UVP / SCP'),('Garantie','5 ans'),('MTBF','100 000 heures'),('Masse du produit déballé','2,2 kg'),('Référence Europe publiée','CMPSU-650TXV2EU'),('UPC Europe publié','843591006774')]
p=add('import-psu-62d5db17afa1','Corsair TX650 V2',s,rows,patch,['Fiche Corsair datée du 19 janvier 2011, conservée par Inet. Les suffixes Europe, US, UK, Chine, Japon, Australie et Taïwan sont distincts ; la région de la ligne d’archive n’est pas choisie.'])
txpage='https://www.corsair.com/ww/en/p/psu/cmpsu-650txv2/enthusiast-series-tx650-v2-80-plus-bronze-certified-650-watt-high-performance-power-supply-cmpsu-650txv2'
p['sources'].append({'name':'Corsair — TX650 V2, identité et spécifications','url':txpage,'checkedAt':json.loads((D/'exa-fetch-corsair-csm-tx.json').read_text())['retrievedAt'],'kind':'manufacturer'})

# Individual CS pages. Values are model-specific and do not transfer to CS550M.
f=D/'exa-fetch-corsair-csm-tx.json';raw=json.loads(f.read_text());ft='\n'.join(c.get('text','') for c in raw['content'])
for part in re.split(r'(?m)(?=^# .+\nURL:)',ft):
    u=re.search(r'(?m)^URL: (\S+)',part);m=re.search(r'/cs-series-modular-cs(450|650|750)m-',u[1] if u else '')
    if not m:continue
    w=int(m[1]);id={450:'import-psu-08e83f7b42e5',650:'import-psu-4165eefc4449',750:'import-psu-25381090697e'}[w]
    values=dict((k.strip(),v.strip()) for k,v in re.findall(r'(?m)^\| ([^|]+) \| ([^|]+) \|$',part) if k.strip()!='---')
    assert values['Continuous Power W']==f'{w} Watts'
    measure=list(map(float,re.findall(r'\d+',values['Dimensions'])));rows,patch=dims(measure);patch.update(wattage=w,fanSizeMm=int(values['Fan Size MM'].removesuffix('mm')),fanCount=1)
    tr={'SATA Connector':'Connecteurs SATA','Fan Bearing Technology':'Roulement du ventilateur','Cable Type':'Type de câbles','Floppy Connector':'Connecteur Floppy','Zero RPM Mode':'Mode zéro RPM','Fan Size MM':'Diamètre du ventilateur','Continuous Power W':'Puissance continue','ATX Connector':'Connecteur ATX','Continuous Output Rated Temp C':'Température nominale','ATX12V Version':'Version ATX','MTBF Hours':'MTBF','80 PLUS Efficiency':'Certification 80 PLUS','Warranty':'Garantie'}
    rows += [(tr[k],v) for k,v in values.items() if k in tr]+[('Modularité','Semi-modulaire')]
    protection=re.search(r'(?m)^\| Protections \| (.+) \|$',part)
    if protection:rows.append(('Protections',protection[1].replace(' | ',' / ')))
    s={'url':u[1],'checkedAt':raw['retrievedAt'],'sha256':hashlib.sha256(part.encode()).hexdigest(),'evidenceFile':str(f.relative_to(ROOT))}
    add(id,f'Corsair CS{w}M',s,rows,patch,['Page constructeur de la variante NA utilisée pour documenter le modèle, sans attribuer ce suffixe commercial à la ligne d’archive.'])

# Exact pages fetched by Exa include explicit per-product technical tables.
r=json.loads((D/'exa-fetch-corsair-pages-noctua.json').read_text())
text='\n'.join(c.get('text','') for c in r['content'])
for part in re.split(r'(?m)(?=^# .+\nURL:)',text):
    m=re.search(r'(?m)^URL: (https://\S+)',part)
    if not m:continue
    url=m[1];s={'url':url,'checkedAt':r['retrievedAt'],'sha256':hashlib.sha256(part.encode()).hexdigest(),'evidenceFile':str((D/'exa-fetch-corsair-pages-noctua.json').relative_to(ROOT))}
    cx=re.search(r'/cp-902012([012])-na/',url)
    if cx:
        w={0:450,1:550,2:650}[int(cx[1])];id={450:'import-psu-0ba178dea730',550:'import-psu-df55b3d86f94',650:'import-psu-7aac927c4e34'}[w]
        table=dict((k.strip(),v.strip()) for k,v in re.findall(r'(?m)^\| ([^|]+) \| ([^|]+) \|$',part) if k.strip()!='---')
        assert table['Continuous Power W']==f'{w} Watts' and table['Dimensions']=='150mm x 86mm x 140mm'
        rows,patch=dims([150,86,140]);patch['wattage']=w
        tr={'SATA Connector':'Connecteurs SATA','Fan Bearing Technology':'Roulement du ventilateur','PSU Compatibility':'Compatibilité électrique','Cable Type':'Type de câbles','Zero RPM Mode':'Mode zéro RPM','Continuous Power W':'Puissance continue','ATX Connector':'Connecteur ATX','Continuous Output Rated Temp C':'Température nominale','ATX12V Version':'Version ATX','MTBF Hours':'MTBF','80 PLUS Efficiency':'Certification 80 PLUS','Warranty':'Garantie'}
        rows += [(tr[k],v) for k,v in table.items() if k in tr]
        rows += [('Modularité','Câbles fixes'),('Ventilateur · contradiction fabricant','120 mm dans le descriptif ; 140 mm dans le tableau')]
        evidence={'fan':{'value':'120 mm / 140 mm','sourceURL':url,'checkedAt':s['checkedAt'],'conflicting':True,'reason':'Le descriptif et le tableau fabricant se contredisent.'}}
        add(id,f'Corsair CX{w} (2017)',s,rows,patch,['La page NA sert de documentation du modèle, sans rattacher ce SKU régional à la ligne d’archive. Diamètre du ventilateur non tranché.'],evidence)
    if 'noctua_edition_datasheet' in url:
        rows,patch=dims([150,86,210]);patch.update(wattage=1600,fanSizeMm=120,fanCount=1)
        rows += [('Puissance continue selon entrée','1600 W sur 115–240 V ; 1300 W sur 100–240 V'),('Plage d’entrée générale','100–240 V, 15–10 A, 50–60 Hz'),('Restriction Chine et Corée publiée','200–240 V, 10 A, 50–60 Hz'),('Certification 80 PLUS','Titanium'),('Modularité','Entièrement modulaire'),('Version ATX','3.1'),('Version PCIe','5.1'),('Ventilateur','Noctua NF-A12x25, 120 mm'),('Roulement du ventilateur','SSO2'),('Finition','Noctua brun et noir ; câbles bruns'),('Protections','OPP / OVP / UVP / SCP / OCP / OTP'),('Garantie','12 ans'),('Fonctionnement semi-passif','Jusqu’à environ 50 % de charge à température ambiante ≤25 °C, selon le fabricant'),('EAN Europe / reste du monde publié','9010018900248')]
        add('import-psu-b3055b03c103','Seasonic PRIME TX-1600 Noctua Edition',s,rows,patch,['Le lien Noctua retourne actuellement 404 en accès direct ; Exa a restitué le PDF fabricant indexé, conservé dans les preuves. Aucun inventaire de câbles n’est déduit de la version standard.'])

# This PDF filename mentions 3.0 but its actual heading explicitly says ATX
# 3.1. Unlike the duplicated web table it gives 1296W / 108A for TX-1300.
s=doc('Prime-TX-ATX-3.0-2024-v2.pdf');t=s['text'];assert 'TX ATX 3.1' in t and '1296 W' in t
for id,w,amps,rail,minus_a,minus_w,gpu in [('import-psu-2ad0213cf3d9',1600,'133.3','1600','0.5','6.0',2),('import-psu-b86b2b01b644',1300,'108','1296','0.3','3.6',1)]:
    rows,patch=dims([150,86,210]);patch.update(wattage=w,fanSizeMm=135,fanCount=1)
    rows += [('Puissance totale',f'{w} W'),('Certification 80 PLUS','Titanium'),('Version ATX','3.1'),('Version PCIe','5.1'),('Modularité','Entièrement modulaire'),('Ventilateur','135 mm, roulement FDB'),('Ventilation','Digital Hybrid Fan Control'),('Courant maximal +12 V',amps+' A'),('Puissance du rail +12 V',rail+' W'),('Courants +3,3 V / +5 V','25 A / 25 A'),('Puissance combinée +3,3 V / +5 V','125 W'),('Rail −12 V',minus_a+' A ; '+minus_w+' W'),('Rail +5 VSB','3 A ; 15 W'),('Protections','OPP / OVP / UVP / SCP / OCP / OTP'),('Connecteurs',f'ATX 20+4 : 1 ; EPS 4+4 : 3 ; 12V-2x6 : {gpu} ; PCIe 6+2 : 6 ; SATA : 16 ; SATA 3,3 V : 2 ; périphériques : 3'),('Longueurs des câbles','ATX : 610 mm ; EPS et 12V-2x6 : 700 mm ; PCIe : 750 mm ; SATA : 950 mm ; SATA 3,3 V : 550 mm ; périphériques : 690 mm')]
    p=add(id,f'Seasonic PRIME TX-{w} ATX 3.1',s,rows,patch,['Le contenu de la fiche déclare ATX 3.1 malgré un nom de fichier historique contenant 3.0. La table web reproduit les rails 1600 W sur le 1300 W ; les rails proviennent exclusivement du PDF par modèle.'])
    webpage=json.loads((ROOT/'data/deep-review/power-chassis/sources/seasonic-atx3-prime-tx.json').read_text())
    assert '12 Years' in webpage['primaryText'] and 'ATX 3.1' in webpage['primaryText']
    p['sources'].append({'name':'Seasonic — garantie de PRIME TX ATX 3.1','url':webpage['url'],'checkedAt':webpage['checkedAt'],'kind':'manufacturer'})
    p['groups'][0]['rows'].append({'label':'Garantie','value':'12 ans'})
    p['fieldEvidence']['warranty']={'value':'12 ans','sourceURL':webpage['url'],'checkedAt':webpage['checkedAt']}
    PROVENANCE[-1]['facts'].append({'label':'Garantie','value':'12 ans','sourceURL':webpage['url'],'sourceFile':'data/deep-review/power-chassis/sources/seasonic-atx3-prime-tx.json'})

(D/'products.json').write_text(json.dumps(PRODUCTS,ensure_ascii=False,indent=2)+'\n')
(D/'fact-provenance.json').write_text(json.dumps(PROVENANCE,ensure_ascii=False,indent=2)+'\n')
(ROOT/'src/data/deepPowerFollowupCatalog.ts').write_text("import type {VerifiedProduct} from './verifiedTypes.ts';\n// Generated by scripts/build-power-followup.py. Exact models; unresolved regional SKUs remain empty.\nexport const deepPowerFollowupProducts:Record<string,VerifiedProduct>="+json.dumps(PRODUCTS,ensure_ascii=False,separators=(',',':'))+';\n')
print(json.dumps({'products':len(PRODUCTS),'technicalRows':sum(len(g['rows']) for p in PRODUCTS.values() for g in p['groups']),'sources':len({s['url'] for p in PRODUCTS.values() for s in p['sources']}),'offers':0}))
