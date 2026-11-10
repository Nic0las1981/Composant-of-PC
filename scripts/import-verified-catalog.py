"""Rebuild reviewed catalogue data from retained primary-page evidence.

No network, fuzzy name match or price inferred from a search excerpt. The manifest
selects reviewed pages; MPN equality gates every offer, including colour/packing.
"""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / 'data/evidence'
manifest = json.loads((ROOT / 'data/verified-source-manifest.json').read_text())
products = {}
rejected = []

def clean(s):
    s = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', s)
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' · ', s).replace('\\', '').replace('*', '').replace('#', '')).strip()

def table(m):
    groups = []
    current = None
    for line in m.splitlines():
        if not line.startswith('|'): continue
        cells = [c.strip() for c in line.strip('|').split('|')]
        if any(c.startswith('## ') for c in cells):
            current = {'title': clean(cells[0]), 'rows': []}
            groups.append(current)
        ix = next((i for i,c in enumerate(cells) if c.startswith('### ')), None)
        if ix is not None and ix+1 < len(cells) and current:
            current['rows'].append({'label': clean(cells[ix]), 'value': clean(cells[ix+1])})
        elif current and current['rows'] and len(cells) == 1 and not cells[0].startswith('#'):
            value = clean(cells[0])
            if value and not re.fullmatch(r'[- :]+',value): current['rows'][-1]['value'] += ' · ' + value
    return [g for g in groups if g['rows'] and g['title'] not in ['Informations générales', 'Garanties', 'Information sur la sécurité']]

def ldlc(d):
    m=d['markdown']; title=re.search(r'^# (.+)',m,re.M)
    mpn=re.search(r'### Modèle \| ([^\n]+?) \|',m)
    if not title or not mpn: return None
    intro=m[title.start():].split('\n- ## Descriptif')[0].split('\nDescriptif\n')[0]
    historical='Dernier prix' in intro
    price=re.search(r'(?:Dernier prix )?(\d[\d\s\u00a0]*€\d{2})',intro)
    delivery=re.search(r'Livraison à domicile[^\n]*\n+([^\n]+)',intro)
    stock=re.sub(r'[_*]', '', clean(delivery[1])).lower() if delivery else ''
    availability='discontinued' if historical else 'in_stock' if 'en stock' in stock else 'out_of_stock' if 'rupture' in stock else 'unknown'
    return {'mpn':clean(mpn[1]),'title':clean(title[1]),'groups':table(m),
            'amount':float(re.sub(r'\s','',price[1]).replace('€','.')) if price else None,
            'availability':availability,'priceKind':'last_known' if historical else 'current',
            'condition':'new','seller':'LDLC','shipping':None,'shippingNote':'Frais de livraison non renseignés ; total livré à confirmer.'}

def pcc(d):
    m=d['markdown']; title=re.search(r'^# (.+)',m,re.M); mpn=re.search(r'P/N: ([^\\|\n]+)',m)
    if not title or not mpn:return None
    intro=m[title.start():].split('Articles complémentaires')[0].split('Articles similaires')[0]
    # Price in the product header only: no financing, carousel or other seller.
    header=intro.split('P/N:')[0]
    price=re.search(r'(\d[\d.\s]*,\d{2}|\d+)€',header)
    seller=re.search(r'Vendu et expédié par\s*([^\n]+)',intro)
    shipping=re.search(r'Expédition: ([^\n|\\]+)',intro)
    ship=clean(shipping[1]) if shipping else ''
    specs=m.split('À propos du produit')[-1].split('\n## Avis\n')[0]
    rows=[]
    for line in specs.splitlines():
        hit=re.match(r'\s*-\s+(?:\*\*)?([^:\n]{2,70}?)(?:\*\*)?\s*:\s*(.+)',line)
        if hit and not any(word in hit[1].lower() for word in ['logistique','sécurité','garantie','référence','code','origine','poids du paquet','emballage','performance']):
            label,value=clean(hit[1]),clean(hit[2])
            if label and value and len(value)<300:rows.append({'label':label,'value':value})
    return {'mpn':clean(mpn[1]),'title':clean(title[1]),'groups':[{'title':'Caractéristiques PcComponentes','rows':rows}] if rows else [],
            'amount':float(re.sub(r'[.\s]','',price[1]).replace(',','.')) if price else None,
            'availability':'out_of_stock' if 'Pas de date précise de réapprovisionnement' in intro else 'in_stock' if 'Recevez-le entre' in intro else 'unknown',
            'priceKind':'current','condition':'refurbished' if 'Reconditionné' in title[1] else 'new',
            'seller':clean(seller[1]) if seller else 'Non renseigné','shipping':0 if ship=='Gratuit' else None,
            'shippingNote':('Livraison gratuite annoncée sur la page.' if ship=='Gratuit' else 'Livraison '+ship+' ; montant final à confirmer.' if ship else 'Frais de livraison non renseignés.')}

parsed=[]
for item in manifest:
    d=json.loads((EVIDENCE/item['evidence']).read_text())
    if d['metadata'].get('statusCode')!=200 or not d['markdown']:
        rejected.append({**item,'reason':'Page indisponible'});continue
    result=ldlc(d) if item['name']=='LDLC' else pcc(d) if item['name']=='PcComponentes' else None
    parsed.append((item,d,result))

# Canonical identity is chosen before collecting offers. BOX and tray do not mix.
preferred={'cpu-5600':'pcc-cpu-5600.json','cpu-14600kf':'pcc-cpu-14600kf.json'}
excluded={'mb-b550m-pro4':'La fiche marchand vise la révision R2.0 ; révision du catalogue non identifiée.',
          'psu-focus-gx750':'La fiche vise la révision ATX 3.0 ; révision initiale non identifiée.'}
for item,d,result in sorted(parsed,key=lambda x: x[0]['evidence']!=preferred.get(x[0]['componentId'])):
    id=item['componentId']
    if id in excluded:
        rejected.append({**item,'reason':excluded[id]});continue
    p=products.setdefault(id,{'mpn':'','identityNote':'','sources':[],'groups':[],'patch':{},'offers':[],'notes':[]})
    if result and not p['mpn']:p['mpn']=result['mpn']

for item,d,result in parsed:
    id=item['componentId']
    if id not in products:continue
    p=products[id]; m=d['markdown']; url=d['metadata'].get('url') or d['metadata']['sourceURL']
    source={'name':item['name'],'url':url,'checkedAt':d['retrievedAt'],'kind':item['kind']}
    if result:
        if result['mpn']!=p['mpn']:
            rejected.append({**item,'reason':f"MPN différent : {result['mpn']} / {p['mpn']}"});continue
        if not p['groups']:p['groups']=result['groups']
        if result['amount'] and result['amount']>0:
            p['offers'].append({'retailer':item['name'],'seller':result['seller'],'url':url,'productName':result['title'],
              'mpn':result['mpn'],'amount':result['amount'],'currency':'EUR','market':'FR',
              **{k:result[k] for k in ['condition','availability','priceKind','shipping','shippingNote']},'checkedAt':d['retrievedAt']})
    p['sources'].append(source)
    if item['kind']=='manufacturer' and item['name']=='AMD':
        normalized=re.sub(r'\n{3,}','\n\n',m)
        def field(label):
            hit=re.search(r'\n'+re.escape(label)+r'\n\n([^\n]+)',normalized)
            return clean(hit[1]) if hit else None
        labels={'# of CPU Cores':'Cœurs',' # of Threads':'Threads','Base Clock':'Fréquence de base','Max. Boost Clock':'Fréquence boost',
          'L2 Cache':'Cache L2','L3 Cache':'Cache L3','Default TDP':'TDP','CPU Socket':'Socket',
          'Max. Memory':'Mémoire maximale','Memory Channels':'Canaux mémoire','System Memory Type':'Type de mémoire',
          'Thermal Solution (PIB)':'Refroidissement fourni','Max. Operating Temperature (Tjmax)':'Température maximale'}
        labels['# of Threads']=labels.pop(' # of Threads')
        rows=[{'label':label,'value':field(key)} for key,label in labels.items() if field(key)]
        p['groups']=[g for g in p['groups'] if g['title']!='Données fabricant AMD']
        p['groups'].insert(0,{'title':'Données fabricant AMD','rows':rows})
        for label,key in [('Max. Memory','maxMemoryGB'),('Memory Channels','memoryChannels')]:
            value=field(label)
            if value and re.match(r'\d+',value):p['patch'][key]=int(re.match(r'\d+',value)[0])
        # Keep current manufacturer's memory ceiling out of older retailer rows.
        for group in p['groups'][1:]:
            group['rows']=[r for r in group['rows'] if r['label'] not in ['Capacité maximale de RAM']]
    if result and item['name']=='LDLC':
        fields={r['label']:r['value'] for g in result['groups'] for r in g['rows']}
        # Only clear, unit-bearing dimensions enter the compatibility engine.
        keys={'Longueur maximale carte graphique':'maxGpuLengthMm','Hauteur maximale ventilateur CPU':'maxCoolerHeightMm'}
        if id.startswith('mb-'):keys.update({'Capacité maximale de RAM':'maxMemoryGB','Capacité maximale de RAM par slot':'maxMemoryPerSlotGB'})
        if id.startswith('ram-'):keys.update({'Tension':'memoryVoltageV'})
        for label,key in keys.items():
            value=fields.get(label,'')
            if re.fullmatch(r'\d+(?:\.\d+)? (?:mm|Go|Volts)',value):p['patch'][key]=float(value.split()[0])

def manufacturer(id,name,mpn,rows,patch=None,note=None):
    p=products[id];p['mpn']=mpn;p['groups']=[{'title':'Données fabricant '+name,'rows':[{'label':k,'value':v} for k,v in rows.items()]}]
    p['patch'].update(patch or {})
    if note:p['notes'].append(note)

manufacturer('gpu-4070s','ASUS','DUAL-RTX4070S-12G',{'Dimensions':'267,01 × 133,94 × 51,13 mm','Mémoire vidéo':'12 Go GDDR6X · bus 192 bits · 21 Gbit/s','Fréquence boost par défaut':'2 475 MHz','Mode OC logiciel':'2 505 MHz','Alimentation recommandée':'750 W','Connecteur':'1 × 16 broches','Occupation':'2,56 slots'},
 {'lengthMm':267.01,'heightMm':133.94,'thicknessMm':51.13,'recommendedPsuW':750},'Modèle non-OC : aucune offre OC, EVO ou blanche ne lui est attribuée.')
manufacturer('mb-b650','MSI','MAG B650 TOMAHAWK WIFI',{'Socket':'AM5','Mémoire':'4 × DDR5 · 256 Go maximum · EXPO · non-ECC UDIMM','Stockage':'3 × M.2 PCIe 4.0 · 6 × SATA 6 Gbit/s','Réseau':'2,5 GbE · Wi-Fi 6E · Bluetooth 5.3','Format':'ATX · 304,8 × 243,84 mm','Partage des lignes':'M2_3 et PCI_E2 partagent la bande passante ; chacun fonctionne en x2 si les deux sont utilisés.'},
 {'maxMemoryGB':256,'maxMemoryPerSlotGB':64,'memorySlots':4,'m2Slots':3},'La fiche MSI actuelle annonce 256 Go ; la limite mémoire dépend aussi du processeur, du BIOS et de la QVL.')
manufacturer('ram-ddr5-32','Corsair','CMH32GX5M2B6000Z30K',{'Capacité':'32 Go · 2 × 16 Go','Débit testé':'6 000 MT/s','Latence testée':'CL30','Tension testée':'1,40 V','SPD':'4 800 MT/s · CL40 · 1,10 V','Profils':'AMD EXPO et Intel XMP','Format':'UDIMM · 288 broches','Couleur fabricant':'Gris'},
 {'memoryVoltageV':1.4,'memoryProfile':'EXPO/XMP','memoryModuleFormat':'DIMM','memoryModuleKind':'UDIMM','color':'#686b70','specs':['2 × 16 Go','DDR5-6000','CL30','AMD EXPO · Intel XMP','CMH32GX5M2B6000Z30K']})
manufacturer('cooler-phantom','Thermalright','PHANTOM SPIRIT 120 SE',{'Radiateur':'110 × 125 × 154 mm · 765 g','Caloducs':'7 × 6 mm','Ventilateurs':'TL-C12B V2 · 120 × 120 × 25 mm · PWM 4 broches','Vitesse maximale':'1 500 tr/min ±10 %','Débit maximal':'66,17 CFM','Pression maximale':'1,53 mm H₂O','Bruit annoncé':'25,6 dBA'},
 {'heightMm':154,'widthMm':125,'depthMm':110,'fanCount':2,'fanSizeMm':120})
manufacturer('psu-rm750e','Corsair','CP-9020295-EU',{'Révision':'2025 · noir · câble secteur EU','Puissance':'750 W','Normes':'ATX 3.1 · PCIe 5.1','Certification':'Cybenetics Gold','Câblage':'Entièrement modulaire · câble natif 12V-2x6 600 W'},
 {'name':'RM750e (2025) · 750 W','specs':['750 W','Cybenetics Gold','ATX 3.1 · PCIe 5.1','Modulaire · 12V-2x6','CP-9020295-EU']})
manufacturer('case-h6','NZXT','CC-H61FB-01',{'Finition':'Noir · sans RGB','Dimensions':'435 × 287 × 415 mm · 9,4 kg','Dégagement GPU':'365 mm','Dégagement ventirad':'163 mm','Ventilateurs inclus':'3 × F120Q 120 mm','Radiateurs':'Dessus jusqu’à 360 mm · arrière jusqu’à 120 mm','Épaisseur au-dessus':'Radiateur 30 mm · radiateur + ventilateurs environ 60 mm maximum'},
 {'fanCount':3,'fanSizeMm':120},'Le dégagement du radiateur et des ventilateurs dépend des composants de la carte mère.')
for id,sku,length,width,thickness,power,psu,boost in [
    ('gpu-7600','11324-01-20G',240,107.1,44.07,185,550,2755),
    ('gpu-7700xt','11335-04-20G',280,128.75,52.57,230,700,2544),
    ('gpu-7600xt-pulse','11339-04-20G',250,129.25,44.56,192,600,2810)]:
    old=products[id]['mpn']
    manufacturer(id,'Sapphire',sku,{'SKU fabricant':sku,'Dimensions':f'{length} × {width} × {thickness} mm',
      'Puissance carte (TBP)':f'{power} W','Alimentation minimale':f'{psu} W','Fréquence boost maximale':f'{boost} MHz'},
      {'lengthMm':length,'heightMm':width,'thicknessMm':thickness,'powerW':power,'recommendedPsuW':psu},
      'Le champ « Modèle » du marchand est un libellé commercial. Le SKU numérique est confirmé sur la fiche Sapphire correspondant au modèle PULSE et à sa capacité exacte.')
    for offer in products[id]['offers']:
        assert offer['mpn']==old
        offer['retailerReference']=old
        offer['mpn']=sku
    capacity={'gpu-7600':8,'gpu-7700xt':12,'gpu-7600xt-pulse':16}[id]
    products[id]['patch']['specs']=[f'{capacity} Go GDDR6',f'{power} W TBP',f'Longueur {length} mm',f'Boost déclaré : {boost} MHz',f'Alimentation conseillée {psu} W']
for id,watts,sku in [('psu-rm850e',850,'CP-9020296-EU'),('psu-rm1000e',1000,'CP-9020297-EU')]:
    products[id]['patch'].update({'name':f'RM{watts}e (2025) · {watts} W','specs':[f'{watts} W','Cybenetics Gold','ATX 3.1','Modulaire',sku]})
products['cpu-7800x3d']['notes'].append('La fiche Fnac comporte des champs contradictoires (AM4, Zen 2, Matisse) : AMD confirme AM5 et Zen 4. Ces champs Fnac sont écartés.')
# Fnac main offer is explicitly Darty, not the lowest anonymous marketplace lead.
fnac=json.loads((EVIDENCE/'fnac-7800x3d.json').read_text())
products['cpu-7800x3d']['offers'].append({'retailer':'Fnac','seller':'Darty','url':fnac['metadata']['url'],'productName':'AMD Ryzen 7 7800X3D · boîte sans ventilateur','mpn':'100-100000910WOF','amount':349.99,'currency':'EUR','market':'FR','condition':'new','availability':'in_stock','priceKind':'current','shipping':None,'shippingNote':'Frais de livraison non confirmés pour cette offre Darty.','checkedAt':fnac['retrievedAt']})
for id,p in products.items():
    if not p['mpn']:
        rejected.append({'componentId':id,'reason':'MPN non établi'});continue
    p['patch']['manufacturerPartNumber']=p['mpn']
    p['identityNote']='Référence exacte : '+p['mpn']+'. Les autres capacités, finitions et conditionnements sont exclus des offres ci-dessous.'
    p['groups']=[g for g in p['groups'] if g['rows']]
products={id:p for id,p in products.items() if p['mpn']}
target=ROOT/'src/data/verifiedCatalog.ts'
target.write_text('// Generated by scripts/import-verified-catalog.py from reviewed primary pages.\nimport type { VerifiedProduct } from "./verifiedTypes.ts";\nexport const verifiedProducts: Record<string, VerifiedProduct> = '+json.dumps(products,ensure_ascii=False,indent=2)+';\n')
(ROOT/'data/verification-rejections.json').write_text(json.dumps(rejected,ensure_ascii=False,indent=2)+'\n')
print(f'{len(products)} références, {sum(len(p["offers"]) for p in products.values())} offres/relevés, {len(rejected)} pages écartées.')
