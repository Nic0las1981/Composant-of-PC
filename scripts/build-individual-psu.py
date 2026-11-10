"""Rebuild individual PSU records from exact primary product-page evidence."""
import json,runpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];E=ROOT/'data/individual-review'
parse_offer=runpy.run_path(str(ROOT/'scripts/primary-review-offer.py'))['main_offer']
products={}
for watts,id,mpn,peak,rail,sata,weight,rpm,noise,eff in [
 (750,'import-psu-01e3e8ba588f','BP006EU',820,750,6,1.73,1800,15.8,94.2),
 (850,'import-psu-a92896f7672c','BP007EU',920,849.6,7,1.75,2100,24.9,94.1),
 (1000,'import-psu-3f7709be66e0','BP008EU',1070,999.6,7,1.78,2100,27.2,94.0),
]:
 manuf=json.loads((E/f'bequiet-powerzone2-{watts}.json').read_text());assert mpn in manuf['markdown']
 sources=[{'name':'be quiet! — fiche constructeur EU','url':manuf['url'],'checkedAt':manuf['checkedAt'],'kind':'manufacturer'}];offers=[]
 for retailer,prefix in [('PcComponentes','pcc'),('LDLC','ldlc')]:
  evidence=json.loads((E/f'{prefix}-{mpn}.json').read_text());p=evidence['product'];assert p['mpn']==mpn
  sources.append({'name':retailer,'url':evidence['url'],'checkedAt':evidence['checkedAt'],'kind':'retailer'})
  offer=parse_offer(p,evidence,mpn);assert offer and offer['condition']=='new' and offer['availability']=='in_stock';offer['retailer']=retailer
  if retailer=='PcComponentes':offer['shippingNote']='Livraison à 0 € indiquée pour la France, codes postaux 01000 à 95880 ; vérifier l’éligibilité de l’adresse au paiement.'
  offers.append(offer)
 def group(title,rows):return {'title':title,'rows':[{'label':label,'value':value} for label,value in rows]}
 products[id]={
  'mpn':mpn,'identityNote':f'Power Zone 2 {watts} W noire, conditionnement européen {mpn}, confirmé sur la fiche fabricant et les deux pages marchandes. Les autres puissances et les références US sont distinctes.',
  'sources':sources,
  'groups':[
   group('Alimentation — données constructeur',[
    ('Puissance continue',f'{watts} W'),('Puissance de crête déclarée',f'{peak} W'),('Normes','ATX 3.1 · EPS 12V 2.92 · PCIe 5.1'),('Certification','80 PLUS Platinum · Cybenetics Platinum'),('Câblage','Entièrement modulaire'),('Topologie','LLC + SR + DC/DC'),('Rail +12 V',f'Mono-rail · {rail:g} W combinés'),('Rails +3,3 V et +5 V','120 W combinés'),('Secteur','100–240 V AC · 50–60 Hz'),('Température maximale déclarée','40 °C'),('Rendement déclaré à 230 V et 50 % de charge',f'{eff:.1f} %'),('Protections','OTP · OCP · OPP · SCP · OVP · UVP · SIP'),('Garantie constructeur','10 ans')]),
   group('Connecteurs et câbles',[
    ('Carte mère','1 × ATX 20+4 broches'),('Processeur','1 × EPS P8 et 1 × EPS P4+4'),('Carte graphique PCIe 5.1','1 × 12V-2x6 · 600 W · connecteur coudé à 90°'),('Carte graphique PCIe classique','3 × 6+2 broches'),('Périphériques',f'{sata} × SATA · 1 × PATA/Molex'),('Longueur du câble GPU','60 cm'),('Nombre de câbles déclaré','8')]),
   group('Dimensions et refroidissement',[
    ('Dimensions hors câbles','160 mm profondeur × 150 mm largeur × 86 mm hauteur'),('Poids',f'{weight:.2f} kg'),('Couleur','Noir · sans éclairage RGB'),('Ventilateur','1 × Pure Wings 3 · 140 mm · roulement Rifle'),('Régulation','Semi-passive ; arrêt à faible charge, temporisation de refroidissement 2 à 5 min'),('Vitesse maximale déclarée',f'{rpm} tr/min'),('Bruit déclaré à pleine charge',f'{noise:g} dB(A)'),('Finition','Grille mesh et désignations des connecteurs imprimées sur le boîtier')]),
  ],
  'patch':{'manufacturerPartNumber':mpn,'detailLevel':'documented','wattage':watts,'psuFormat':'ATX','lengthMm':160,'depthMm':160,'widthMm':150,'heightMm':86,'fanCount':1,'fanSizeMm':140,'color':'#22252c','rgb':False,
   'description':f'Alimentation be quiet! Power Zone 2 {watts} W, référence européenne {mpn}. ATX 3.1 et PCIe 5.1, certifications 80 PLUS Platinum et Cybenetics Platinum. Câblage entièrement modulaire, connecteur 12V-2x6 600 W coudé et ventilateur Pure Wings 3 de 140 mm semi-passif. Dimensions hors câbles : 160 × 150 × 86 mm.',
   'specs':[f'{watts} W','80 PLUS Platinum · Cybenetics Platinum','ATX 3.1 · PCIe 5.1','Modulaire · 12V-2x6 600 W','160 × 150 × 86 mm','Pure Wings 3 · 140 mm',mpn]},
  'offers':offers,
  'notes':['Dimensions hors câbles : prévoir le dégagement nécessaire pour les connecteurs et leurs courbures. Les câbles modulaires doivent correspondre à cette alimentation.','Le paragraphe promotionnel LDLC mentionne « Gold » ; sa fiche technique et le fabricant confirment 80 PLUS Platinum. La certification fabricant est retenue.']}
# The family datasheet explicitly lists each EU SKU; capacities are never inferred from US references.
manuf=json.loads((E/'bequiet-purepower13m-eu.json').read_text())
for watts,id,mpn,sata,pci,eps,noise in [
 (550,'import-psu-fbc7537b3ed1','BP024EU',5,2,'1 × EPS P4+4',14),
 (650,'import-psu-a3469b3b7281','BP025EU',5,2,'1 × EPS P4+4 et 1 × P4',15.9),
 (750,'import-psu-6f42f2d8e160','BP026EU',6,4,'1 × EPS P4+4 et 1 × P8',16.5),
 (850,'import-psu-f6b165c597a9','BP027EU',6,4,'1 × EPS P4+4 et 1 × P8',17.6),
 (1000,'import-psu-bd748fa8d566','BP028EU',6,4,'1 × EPS P4+4 et 1 × P8',19.5),
]:
 assert mpn in manuf['raw_content']
 page=json.loads((E/f'pcc-{mpn}.json').read_text());assert page['product']['mpn']==mpn
 offer=parse_offer(page['product'],page,mpn);assert offer and offer['condition']=='new'
 if offer['shipping']==0:offer['shippingNote']='Livraison à 0 € affichée ; destination et conditions du vendeur à confirmer au paiement.'
 products[id]={
  'mpn':mpn,'identityNote':f'Pure Power 13 M {watts} W, référence européenne {mpn} identifiée dans le tableau logistique du fabricant et sur la page marchande. Ne pas confondre avec Pure Power 12 M ou un conditionnement US.',
  'sources':[{'name':'be quiet! — fiche technique Pure Power 13 M, références EU','url':manuf['url'],'checkedAt':manuf['checkedAt'],'kind':'manufacturer'},{'name':'PcComponentes','url':page['url'],'checkedAt':page['checkedAt'],'kind':'retailer'}],
  'groups':[
   group('Alimentation — fiche fabricant EU',[
    ('Puissance continue',f'{watts} W'),('Normes','ATX 3.1 · EPS 12V 2.92 · PCIe 5.1'),('Certification','80 PLUS Gold'),('Câblage','Entièrement modulaire'),('Topologie','LLC'),('Rail +12 V',f'Mono-rail · {watts} W combinés déclarés'),('Rails +3,3 V et +5 V','120 W combinés'),('Secteur','100–240 V AC · 50–60 Hz'),('Protections','OCP · OVP · UVP · SCP · OPP · OTP'),('Garantie constructeur','10 ans')]),
   group('Connecteurs et dimensions',[
    ('Carte mère','1 × ATX 20+4 broches'),('Processeur',eps),('Carte graphique PCIe 5.1','1 × câble 12V-2x6'),('Carte graphique PCIe classique',f'{pci} × 6+2 broches'),('Périphériques',f'{sata} × SATA · 2 × PATA/Molex'),('Longueur du câble carte mère','55 cm'),('Longueur maximale des câbles','95 cm'),('Dimensions hors câbles','160 mm profondeur × 150 mm largeur × 86 mm hauteur'),('Couleur','Noir'),('Refroidissement','Ventilateur be quiet! 120 mm thermorégulé · fonctionnement semi-passif'),('Bruit déclaré à pleine charge',f'{noise:g} dB(A)')]),
  ],
  'patch':{'manufacturerPartNumber':mpn,'detailLevel':'documented','wattage':watts,'psuFormat':'ATX','lengthMm':160,'depthMm':160,'widthMm':150,'heightMm':86,'fanCount':1,'fanSizeMm':120,'color':'#22252c','rgb':False,
   'description':f'Alimentation be quiet! Pure Power 13 M {watts} W, conditionnement européen {mpn}. ATX 3.1 et PCIe 5.1, certification 80 PLUS Gold, câble 12V-2x6 et câblage entièrement modulaire. Refroidissement semi-passif par ventilateur de 120 mm. Dimensions hors câbles : 160 × 150 × 86 mm.',
   'specs':[f'{watts} W','80 PLUS Gold','ATX 3.1 · PCIe 5.1','Modulaire · 12V-2x6','160 × 150 × 86 mm','Ventilateur 120 mm semi-passif',mpn]},
  'offers':[offer],
  'notes':['La fiche technique constructeur donne les connecteurs par puissance ; ses valeurs priment sur les résumés marchands génériques. Les références EU et US restent distinctes.','Prévoir de la place pour les câbles et respecter leur compatibilité avec cette alimentation.']}
(ROOT/'src/data/individualPsu.ts').write_text('// Individually reviewed primary manufacturer and retailer records. Rebuild with scripts/build-individual-psu.py.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const individualPsuRecords: Record<string,VerifiedProduct> = '+json.dumps(products,ensure_ascii=False,indent=2)+';\n')
print('Built',len(products),'PSU records')
