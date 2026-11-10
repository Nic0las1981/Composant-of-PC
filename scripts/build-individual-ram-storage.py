"""Rebuild individually checked RAM and SSD records from retained primary evidence."""
from pathlib import Path
import json,runpy
ROOT=Path(__file__).resolve().parents[1];E=ROOT/'data/individual-review/ram-storage'
parse_offer=runpy.run_path(str(ROOT/'scripts/primary-review-offer.py'))['main_offer']
def load(name):return json.loads((E/(name+'.json')).read_text())
def source(name,label,kind='retailer'):
 d=load(name);return {'name':label,'url':d['url'],'checkedAt':d['checkedAt'],'kind':kind}
def rows(values):return [{'label':k,'value':v} for k,v in values.items()]
def offer(name,mpn):
 d=load(name);p=d['product'];assert p['mpn']==mpn,(name,p['mpn'],mpn)
 if name.startswith('pcc'):
  o=parse_offer(p,d,mpn);assert o
  if o['shipping']==0:o['shippingNote']='Livraison à 0 € affichée pour la zone française indiquée par le marchand ; adresse finale à confirmer.'
  return o
 o=p['offers'];assert o['priceCurrency']=='EUR'
 return {'retailer':'LDLC','seller':o['seller']['name'],'url':d['url'],'productName':p['name'],'mpn':mpn,'amount':float(o['price']),'currency':'EUR','market':'FR','condition':'new' if o['itemCondition'].endswith('NewCondition') else 'unknown','availability':'in_stock' if o['availability'].endswith('/InStock') else 'out_of_stock','priceKind':'current','shipping':None,'shippingNote':'Frais de livraison à confirmer selon l’adresse et le mode choisi.','checkedAt':d['checkedAt']}
products={}
mpn='CP2K16G60C36U5W'
products['import-ram-8b162aa67690']={
 'mpn':mpn,'identityNote':'Kit blanc de deux modules de 16 Go. Le suffixe W identifie le blanc ; le kit noir, les modules unitaires et les kits 6400 MT/s sont distincts.',
 'sources':[source('crucial-manufacturer','Crucial','manufacturer'),source('ldlc-white','LDLC'),source('pcc-white','PcComponentes')],
 'groups':[{'title':'Caractéristiques de la référence Crucial','rows':rows({'Capacité du kit':'32 Go : 2 × 16 Go','Mémoire':'DDR5 UDIMM · 288 broches · non enregistrée','Débit testé':'6 000 MT/s','Timings du profil testé':'36-38-38-80 à 1,35 V','Profils mémoire':'Intel XMP 3.0 et AMD EXPO sur le même module','Correction d’erreurs':'On-die ECC interne aux puces ; aucune protection ECC au niveau système','Refroidissement':'Dissipateur aluminium blanc · sans LED/RGB','Garantie fabricant en France':'10 ans selon les conditions Crucial'})}],
 'patch':{'manufacturerPartNumber':mpn,'detailLevel':'documented','memoryType':'DDR5','capacityGB':32,'memorySticks':2,'memorySpeedMTs':6000,'casLatency':36,'memoryVoltageV':1.35,'memoryProfile':'EXPO/XMP','memoryModuleFormat':'DIMM','memoryModuleKind':'UDIMM','memoryRegistered':False,'memoryEcc':False,'memoryHeatspreader':True,'rgb':False,'color':'#f1f0ec','description':'Kit Crucial Pro Overclocking blanc CP2K16G60C36U5W de 2 × 16 Go DDR5-6000 CL36. Profils Intel XMP 3.0 et AMD EXPO à 1,35 V, dissipateurs aluminium sans RGB. Le débit effectif dépend du processeur, du BIOS et du nombre de modules installés.','specs':['32 Go · 2 × 16 Go','DDR5-6000 · 36-38-38-80','1,35 V · XMP 3.0 et AMD EXPO','UDIMM 288 broches · non-ECC système','Dissipateur blanc · sans RGB',mpn]},
 'offers':[offer('pcc-white',mpn),offer('ldlc-white',mpn)],
 'notes':['Les valeurs génériques 6400 MT/s CL40 présentes dans le texte de gamme Crucial ne remplacent pas les valeurs 6000 MT/s CL36 de cette référence.','Les profils XMP/EXPO doivent être activés dans le BIOS et ne garantissent pas le même débit avec quatre modules. La QVL de la carte mère reste à vérifier.','Hauteur exacte et organisation des puces non publiées dans les pages primaires consultées ; elles ne sont pas déduites d’un autre kit.']}
# Each additional module/kit has its own manufacturer page and offer gate.
for id,mpn,capacity,sticks,speed,cas,finish in [
 ('import-ram-58c3e94a3f4e','CP2K16G60C36U5B',32,2,6000,36,'Noir'),
 ('import-ram-e9b342e3f3c5','CP16G60C36U5B',16,1,6000,36,'Noir'),
 ('import-ram-7db0c2b525fd','CP16G60C36U5W',16,1,6000,36,'Blanc'),
 ('import-ram-3348a1bc60b5','CP2K32G64C40U5B',64,2,6400,40,'Noir')]:
 manufacturer='crucial-'+mpn.lower();page=load(manufacturer);assert mpn in page['markdown'].split('SinglesKits')[0]
 evidence='pcc-'+mpn.lower();sources=[source(manufacturer,'Crucial','manufacturer')];offers=[]
 if (E/(evidence+'.json')).exists():sources.append(source(evidence,'PcComponentes'));offers.append(offer(evidence,mpn))
 ldlc_evidence='ldlc-'+mpn.lower()
 if (E/(ldlc_evidence+'.json')).exists():sources.append(source(ldlc_evidence,'LDLC'));offers.append(offer(ldlc_evidence,mpn))
 voltage_confirmed=bool(offers) or mpn=='CP2K32G64C40U5B'
 specs={'Capacité':f'{capacity} Go : {sticks} × {capacity//sticks} Go','Format mémoire':'DDR5 UDIMM non enregistrée','Débit et latence du profil':f'{speed} MT/s · CL{cas}','Profils':'Intel XMP 3.0 et AMD EXPO','ECC':'On-die ECC uniquement ; non-ECC au niveau système','Finition':finish+' · dissipateur aluminium sans RGB','Garantie fabricant en France':'10 ans selon conditions Crucial'}
 if voltage_confirmed:specs['Tension du profil']='1,35 V'
 if speed==6400:specs['Timings testés']='40-40-40-80'
 patch={'manufacturerPartNumber':mpn,'detailLevel':'documented' if voltage_confirmed else 'partial','capacityGB':capacity,'memorySticks':sticks,'memoryType':'DDR5','memorySpeedMTs':speed,'casLatency':cas,'memoryModuleFormat':'DIMM','memoryModuleKind':'UDIMM','memoryRegistered':False,'memoryEcc':False,'memoryProfile':'EXPO/XMP','memoryHeatspreader':True,'rgb':False,'color':'#f1f0ec' if finish=='Blanc' else '#202124','description':f'Crucial Pro Overclocking {finish.lower()}, référence {mpn}, {sticks} module(s) de {capacity//sticks} Go DDR5-{speed} CL{cas}. Profils XMP 3.0 et EXPO, dissipateur aluminium sans RGB. Le débit dépend du processeur, du BIOS et de la population des slots.','specs':[f'{capacity} Go · {sticks} × {capacity//sticks} Go',f'DDR5-{speed} · CL{cas}','UDIMM · non-ECC système','XMP 3.0 et AMD EXPO',finish+' · sans RGB',mpn]}
 if voltage_confirmed:patch['memoryVoltageV']=1.35
 notes=['La hauteur exacte et l’organisation des puces ne sont pas déduites des photos ni d’une autre capacité.','Les profils XMP/EXPO doivent être activés ; vérifier la QVL et les limites du contrôleur mémoire, en particulier avec quatre modules.']
 if (E/(evidence+'.json')).exists():notes.append('Le champ ECC du marchand est incorrect pour la protection système : Crucial distingue explicitement l’ECC interne aux puces de l’ECC système. La fiche est corrigée selon le fabricant.')
 if not offers:notes.append('Aucune offre exacte avec vendeur et disponibilité confirmés n’a été retenue dans les pages consultées ; le prix reste inconnu.')
 if not voltage_confirmed:notes.append('La tension exacte de ce module unitaire reste à confirmer ; le texte générique de gamme ne remplace pas la fiche de ce SKU.')
 products[id]={'mpn':mpn,'identityNote':f'{mpn} : {sticks} module(s) de {capacity//sticks} Go, finition {finish.lower()}. Les autres conditionnements ont des références distinctes.','sources':sources,'groups':[{'title':'Référence Crucial contrôlée individuellement','rows':rows(specs)}],'patch':patch,'offers':offers,'notes':notes}
for id,capacity,heatsink,evidence in [
 ('import-ssd-af0ab1572ccd',1,False,'ldlc-9100-1tb'),('import-ssd-8a91162ac077',2,False,'ldlc-9100-2tb'),('import-ssd-40f0be19dbba',4,False,'ldlc-9100-4tb'),('import-ssd-f649264ac77b',4,True,'ldlc-9100-4tb-heatsink'),('import-ssd-20d71b94902f',8,True,'ldlc-9100-8tb-heatsink'),('import-ssd-68a791765862',8,False,'pcc-mz-vap8t0bw'),('import-ssd-2540e1a7589f',1,True,'pcc-mz-vap1t0cw'),('import-ssd-75da0010ebfd',2,True,'pcc-mz-vap2t0cw')]:
 mpn=f'MZ-VAP{capacity}T0'+('CW' if heatsink else 'BW');read=14700 if capacity<=2 else 14800;write=13300 if capacity==1 else 13400;iops=1850000 if capacity<=2 else 2200000
 rp,wp,idle,sleep={1:(7.6,7.2,4,3.3),2:(8.1,7.9,4.8,4),4:(9,8.2,6.5,5.7),8:(10.5,8.8,9.3,8.6)}[capacity]
 width=25 if heatsink else 22.15;height=(11.25 if capacity==8 else 8.88) if heatsink else (3.88 if capacity==8 else 2.38)
 datasheet='samsung-heatsink-specs-metadata' if heatsink else 'samsung-specs-rev2-metadata';sources=[source(datasheet,'Samsung — fiche technique '+('avec dissipateur, révision 2.0' if heatsink else 'sans dissipateur, révision 2.0'),'manufacturer'),source(evidence,'PcComponentes' if evidence.startswith('pcc-') else 'LDLC')];offers=[offer(evidence,mpn)]
 if capacity==2 and not heatsink:sources+=[source('samsung-2tb','Samsung — fiche 2 To','manufacturer'),source('pcc-9100-2tb','PcComponentes')];offers.insert(0,offer('pcc-9100-2tb',mpn))
 additional='pcc-'+mpn.lower()
 if additional!=evidence and (E/(additional+'.json')).exists():sources.append(source(additional,'PcComponentes'));offers.insert(0,offer(additional,mpn))
 products[id]={'mpn':mpn,'identityNote':f'Samsung 9100 PRO {capacity} To '+('avec dissipateur monté en usine' if heatsink else 'sans dissipateur monté en usine')+'. La capacité et le suffixe du conditionnement sont contrôlés séparément.',
 'sources':sources,'groups':[{'title':'Caractéristiques fabricant Samsung','rows':rows({'Capacité nominale':f'{capacity*1000} Go (base décimale IDEMA)','Format et interface':'M.2 2280 · PCIe 5.0 ×4 · NVMe 2.0','Mémoire flash':'Samsung V-NAND TLC','Cache DRAM':f'{capacity} Go LPDDR4X','Lecture / écriture séquentielle maximale':f'{read:,} / {write:,} Mo/s'.replace(',',' '),'Lecture / écriture aléatoire maximale':f'{iops:,} / 2 600 000 IOPS'.replace(',',' '),'Dimensions maximales (L × l × h)':f'80,15 × {str(width).replace(".",",")} × {str(height).replace(".",",")} mm','Refroidissement':'Dissipateur Samsung intégré, à ne pas démonter' if heatsink else 'Module nu ; utiliser le refroidissement M.2 adapté à la carte mère','Consommation active moyenne mesurée':f'Lecture {rp:g} W · écriture {wp:g} W','Consommation au repos / veille profonde':f'{idle:g} mW / {sleep:g} mW','Endurance et garantie limitée':f'{capacity*600:,} To écrits (TBW) ou 5 ans, première limite atteinte'.replace(',',' '),'Température de fonctionnement':'0 à 70 °C (S.M.A.R.T.)','Chiffrement':'AES 256 bits · TCG/Opal 2.0 · IEEE 1667','Fonctions':'TRIM · S.M.A.R.T. · garbage collection · gestion Samsung Magician'})}],
 'patch':{'manufacturerPartNumber':mpn,'detailLevel':'documented','capacityGB':capacity*1000,'storageInterface':'M.2 NVMe','lengthMm':80.15,'widthMm':width,'heightMm':height,'thicknessMm':height,'rgb':False,'color':'#17191b','description':f'Samsung 9100 PRO {capacity} To {"avec dissipateur Samsung intégré" if heatsink else "sans dissipateur intégré"}, référence {mpn}. SSD M.2 2280 PCIe 5.0 ×4 NVMe 2.0, V-NAND TLC et {capacity} Go de cache LPDDR4X. Débits annoncés jusqu’à {read} Mo/s en lecture et {write} Mo/s en écriture.','specs':[f'{capacity} To · M.2 2280 · PCIe 5.0 ×4',f'{read:,} / {write:,} Mo/s'.replace(',',' '),f'{capacity} Go LPDDR4X · V-NAND TLC',f'{capacity*600} TBW · garantie limitée 5 ans','Dissipateur intégré' if heatsink else 'Sans dissipateur intégré',mpn]},
 'offers':offers,'notes':['Les débits et consommations sont des mesures fabricant selon une configuration et une charge définies, pas des garanties de résultat sur tout PC.','Les consommations actives publiées sont des moyennes, pas une puissance électrique maximale ; elles ne sont pas réutilisées comme plafond de dimensionnement de l’alimentation.','Rétrocompatible PCIe 4.0 ×4 et 3.0 ×4 avec débit limité par la liaison.' if not heatsink else 'Vérifier le dégagement M.2 : le dissipateur préinstallé ne doit pas être démonté ni superposé à un autre dissipateur.']}
(ROOT/'src/data/individualRamStorage.ts').write_text('// Individually reviewed primary-source records. Rebuild with scripts/build-individual-ram-storage.py.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const individualRamStorage: Record<string,VerifiedProduct> = '+json.dumps(products,ensure_ascii=False,indent=2)+';\n')
print(f'{len(products)} individually documented RAM/storage variants')
