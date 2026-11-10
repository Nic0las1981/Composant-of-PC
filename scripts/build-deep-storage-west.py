"""Curated manufacturer tables for exact SSD families, capacities and heatsink variants.

No price is inferred. Published model codes are asserted against the saved source;
unknown NAND, heights and commercial suffixes remain unknown.
"""
import json,re,copy,datetime
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/storage-west'
INPUT=json.loads((OUT/'input.json').read_text())
SOURCES={p.stem:json.loads(p.read_text()) for p in (OUT/'sources').glob('*.json')}
FAMILIES={}

def family(name,source,interface,nand,dimensions,rows,*,heatsink=False,warranty=5,notes=None,extra=None):
    """rows: capacity GB, published MPN, read MB/s, write MB/s, TBW; optional row overrides."""
    FAMILIES[name]={'source':source,'interface':interface,'nand':nand,'dimensions':dimensions,'heatsink':heatsink,'warranty':warranty,'notes':notes or [],'extra':extra or {},'variants':{}}
    for row in rows:
        cap,mpn,read,write,tbw,*override=row
        FAMILIES[name]['variants'][cap]={'capacity':cap,'mpn':mpn,'read':read,'write':write,'endurance':tbw,**(override[0] if override else {})}

family('SN850X','3e70a7f9fc21f87f','PCIe 4.0 x4 NVMe','SANDISK TLC 3D NAND',[80,22,2.38],[
 (1000,'WDS100T2X0E',7300,6300,600),(2000,'WDS200T2X0E',7300,6600,1200),
 (4000,'WDS400T2X0E',7300,6600,2400,{'dimensions':[80,22,3.88]}),(8000,'WDS800T2X0E',7200,6600,4800,{'dimensions':[80,22,3.88]})],extra={'Chiffrement':'TCG OPAL 2.01'})
family('SN850X heatsink','3e70a7f9fc21f87f','PCIe 4.0 x4 NVMe','SANDISK TLC 3D NAND',[80,23.4,8.9],[
 (1000,'WDS100T2XHE',7300,6300,600),(2000,'WDS200T2XHE',7300,6600,1200),
 (4000,'WDS400T2XHE',7300,6600,2400,{'dimensions':[80,24.46,10.31]}),(8000,'WDS800T2XHE',7200,6600,4800,{'dimensions':[80,24.46,10.31]})],heatsink=True,extra={'Chiffrement':'TCG OPAL 2.01'})
family('SN8100','3e283a26b9e0e75c','PCIe 5.0 x4 NVMe 2.0','TLC 3D CBA NAND',[80,22,2.38],[
 (1000,'WDS100T1X0M-00CMT0',14900,11000,600),(2000,'WDS200T1X0M-00CMT0',14900,14000,1200),(4000,'WDS400T1X0M-00CMT0',14900,14000,2400)],extra={'DRAM':'Présente','Chiffrement':'TCG OPAL 2.02'})
family('SN8100 heatsink','9ec8b69877de1517','PCIe 5.0 x4 NVMe 2.0','TLC 3D CBA NAND',[80,25,9.76],[
 (1000,'WDS100T1XHM-00CMT0',14900,11000,600),(2000,'WDS200T1XHM-00CMT0',14900,14000,1200),(4000,'WDS400T1XHM-00CMT0',14900,14000,2400)],heatsink=True,extra={'DRAM':'Présente','Chiffrement':'TCG OPAL 2.02'})
family('SN7100','a226104f857a6d2d','PCIe 4.0 x4 NVMe','Western Digital TLC 3D NAND',[80,22,2.38],[
 (500,'WDS500G4X0E-00CJA0',6800,5800,300),(1000,'WDS100T4X0E-00CJA0',7250,6900,600),(2000,'WDS200T4X0E-00CJA0',7250,6900,1200),(4000,'WDS400T4X0E-00CJA0',7000,6700,2400)])
family('SN850P','a40a9a9f0e43a113','PCIe 4.0 x4 NVMe',None,[80,24.46,9.89],[
 (1000,'WDBBYV0010BNC-WRSN',7300,6300,600),(2000,'WDBBYV0020BNC-WRSN',7300,6600,1200),(4000,'WDBBYV0040BNC-WRSN',7300,6600,2400)],heatsink=True,extra={'Licence':'PlayStation 5 officielle'})
family('SN5000','1515e2b2d00e557c','PCIe 4.0 x4 NVMe','Western Digital 3D NAND TLC',[80,22,2.38],[
 (500,'WDS500G4B0E',5000,4000,300),(1000,'WDS100T4B0E',5150,4900,600),(2000,'WDS200T4B0E',5150,4850,900),(4000,'WDS400T4B0E',5500,5000,1200,{'nand':'Western Digital 3D NAND QLC'})])
family('SN580','123d61e10a1ca576','PCIe 4.0 NVMe 1.4b','Western Digital TLC',[80,22,2.38],[
 (250,'WDS250G3B0E',4000,2000,150),(500,'WDS500G3B0E',4000,3600,300),(1000,'WDS100T3B0E',4150,4150,600),(2000,'WDS200T3B0E',4150,4150,900)],extra={'Format détaillé':'M.2 2280-S3-M, simple face, clé M','Sécurité':'TCG Pyrite 2.01 ; ATA Security Passthrough over NVMe'})
family('SN3000','ae3593828a843cb0','PCIe 4.0 x4 NVMe','Western Digital QLC 3D NAND',[80,22,2.38],[
 (500,'WDS500G4G0E',5000,4100,100),(1000,'WDS100T4G0E',5000,4200,150),(2000,'WDS200T4G0E',5000,4200,250)],warranty=3)
family('SN850','1106cac721a01805','PCIe 4.0 x4 NVMe',None,[80,22,2.38],[
 (500,'WDS500G1X0E-00AFY0',7000,4100,300),(1000,'WDS100T1X0E-00AFY0',7000,5300,600),(2000,'WDS200T1X0E-00AFY0',7000,5100,1200)])
family('SN850 heatsink','1106cac721a01805','PCIe 4.0 x4 NVMe',None,[80,23.4,8.8],[
 (1000,'WDS100T1XHE-00AFY0',7000,5300,600),(2000,'WDS200T1XHE-00AFY0',7000,5100,1200)],heatsink=True,extra={'Éclairage':'RGB configurable sous Windows'})
family('SN750 SE','ee3072550673f36e','PCIe 4.0 NVMe',None,[80,22,2.38],[
 (250,'WDS250G1B0E-00B3V0',3200,1000,200),(500,'WDS500G1B0E-00B3V0',3600,2000,300),(1000,'WDS100T1B0E-00B3V0',3600,2830,600)])
family('SanDisk Extreme','3fb43b5537942719','PCIe 4.0 x4 NVMe',None,[80,22,2.38],[
 (500,'SDSSDX3N-500G-G26',5000,4000,300),(1000,'SDSSDX3N-1T00-G26',5150,4900,600),(2000,'SDSSDX3N-2T00-G26',5150,4850,1200)],notes=['SSD interne M.2 SDSSDX3N : les anciennes correspondances avec les SSD USB portables SanDisk Extreme sont exclues.'])
for security,prefix in [('Pyrite','SDDP'),('Opal','SDDQ')]:
    # Published OEM model stems have no ordering/firmware suffix; keep model identity.
    family('SN740 '+security,'73fd2dfd488db360','PCIe 4.0 x4 NVMe 1.4b','Western Digital TLC 3D NAND',[80,22,None],[
      (256,'',4000,2000,200),(512,'',5000,4000,300),(1024,'',5150,4900,400),(2048,'',5150,4850,500)],extra={'Sécurité':'TCG '+security+' 2.01 ; ATA Security passthrough over NVMe'},notes=['Référence de modèle M.2 2280 et protocole de sécurité identifiés. Les suffixes OEM de commande/firmware non publiés ne sont pas inventés.'])
family('Platinum P41','93c812c964d5e1dd','PCIe 4.0 x4 NVMe','SK hynix 176 couches 3D TLC NAND',[80,22,2.38],[
 (500,'',7000,4700,500),(1000,'',7000,6500,750),(2000,'',7000,6500,1200)],extra={'Construction':'M.2 2280 simple face','Chiffrement':'AES 256-bit, TCG Pyrite','MTBF':'1,5 million d’heures'})
family('P44 Pro','6be163347d3abaa6','PCIe 4.0 x4 NVMe 1.4',None,[80,22,None],[
 (512,'',7000,4700,500),(1000,'',7000,6500,750),(2000,'',7000,6500,1200)],extra={'Chiffrement':'AES 256-bit, TCG Pyrite','MTBF':'1,6 million d’heures'})

# Additional reviewed source tables are appended below before export.
family('SN770','219b632d10b8bbb4','PCIe 4.0 x4 NVMe',None,[80,22,2.38],[
 (250,'WDS250G3X0E',4000,2000,200),(500,'WDS500G3X0E',5000,4000,300),(1000,'WDS100T3X0E',5150,4900,600),(2000,'WDS200T3X0E',5150,4850,1200)])
family('SN570','b8f569ff176a5d3b','PCIe 3.0 x4 NVMe','TLC NAND',[80,22,2.38],[(1000,'WDS100T3B0C',3500,3000,600)])
family('P41 Plus','761725b88d98f82f','PCIe 4.0 x4 NVMe','3D NAND, 144 couches',[80,22,None],[
 (512,'',3500,1625,200),(1000,'',4125,2950,400),(2000,'',4125,3325,800)])
family('FireCuda 530','99d37bfce411c70f','PCIe 4.0 x4 NVMe 1.4','3D TLC NAND',[80.15,22.15,2.23],[
 (500,'ZP500GM3A013',7000,3000,640),(1000,'ZP1000GM3A013',7300,6000,1275),
 (2000,'ZP2000GM3A013',7300,6900,2550,{'dimensions':[80.15,22.15,3.58]}),(4000,'ZP4000GM3A013',7250,6900,5100,{'dimensions':[80.15,22.15,3.58]})])
family('FireCuda 530R','adf2c44bf65c4303','PCIe 4.0 x4 NVMe 1.4','3D TLC NAND',[80.15,22.15,2.23],[
 (1000,'ZP1000GM3A063',7400,7000,1100),(2000,'ZP2000GM3A063',7400,6900,2400,{'dimensions':[80.15,22.15,3.58]}),(4000,'ZP4000GM3A063',7400,6800,5050,{'dimensions':[80.15,22.15,3.58]})],
 notes=['Pour la longueur du module nu, le manuel mécanique 207963200 indique 80,15 mm ; la fiche commerciale DS7 indique 80,85 mm. Les dimensions du manuel sont retenues et la divergence est conservée.'])
FAMILIES['FireCuda 530R']['dimensionSource']='328fa7ffb25892f7'
family('FireCuda 530R heatsink','fd9518387a02fe86','PCIe 4.0 x4 NVMe 1.4','3D TLC NAND',[80.85,24.22,11.1],[
 (1000,'ZP1000GM3A073',7400,7000,1100),(2000,'ZP2000GM3A073',7400,6900,2400),(4000,'ZP4000GM3A073',7400,6800,5050)],heatsink=True)
family('FireCuda 540','3ad0589e35f4ca31','PCIe 5.0 x4 NVMe 2.0','3D TLC NAND',[80.15,22.15,3.58],[
 (1000,'ZP1000GM3A004',9500,8500,1000),(2000,'ZP2000GM3A004',10000,10000,2000)])
family('FireCuda 540 heatsink','58545a463e83eb1b','PCIe 5.0 x4 NVMe 2.0','3D TLC NAND',[80.15,24.35,20.29],[
 (1000,'ZP1000GM3A014',9500,8500,1000),(2000,'ZP2000GM3A014',10000,10000,2000)],heatsink=True,extra={'Finition':'Plaques blanche et noire interchangeables'})
family('FireCuda 520','cdb240a1741d9a84','PCIe 4.0 x4 NVMe 1.3','3D TLC NAND',[80.15,22.15,3.58],[
 (500,'ZP500GM30002',5000,2500,850),(1000,'ZP1000GM30002',5000,4400,1800),(2000,'ZP2000GM30002',5000,4400,3600)],notes=['Première génération GM30002. La version 2.0 GV30012 possède des vitesses, une endurance et une épaisseur différentes.'])
family('FireCuda 520 Rev 2.0','ab4181702374ffc7','PCIe 4.0 x4 NVMe 1.4','3D TLC NAND',[80.15,22.15,2.23],[
 (500,'ZP500GV30012',5000,3900,300),(1000,'ZP1000GV30012',5000,4850,600),(2000,'ZP2000GV30012',4850,4750,1200)],notes=['Révision 2.0 GV30012 ; les données de la première génération GM30002 ne sont pas réutilisées.'])
family('BarraCuda 520','85598163630a0a44','PCIe 4.0 x4 NVMe 1.4',None,[80.15,22.15,2.23],[
 (512,'ZP512CM3A002',5000,3800,200),(1024,'ZP1024CM3A002',5000,3200,250),(2048,'ZP2048CM3A002',5000,4200,450),(4096,'ZP4096CM3A002',5000,4200,900)],warranty=3)
family('BarraCuda 530','51acb04f4716b17a','PCIe 4.0 x4 NVMe 2.0',None,[80.15,22.15,2.23],[
 (512,'ZP512CM3A003',7200,4300,300),(1024,'ZP1024CM3A003',7400,6100,600),(2048,'ZP2048CM3A003',7400,6400,1200)])
family('Barracuda PCIe','5f57e79fa348b2f2','PCIe 4.0 x4 NVMe 1.4',None,[80.15,22.15,2.23],[
 (250,'ZP250CV3A002',3200,1300,150),(500,'ZP500CV3A002',3600,2400,300),
 (1000,'ZP1000CV3A002',3600,2800,600,{'dimensions':[80.15,22.15,3.58]}),(2000,'ZP2000CV3A002',3600,2750,1200,{'dimensions':[80.15,22.15,3.58]})],warranty=3)
family('IronWolf 525','c114142126d8e9be','PCIe 4.0 x4 NVMe 1.3','3D TLC NAND',[80.15,22.15,3.58],[
 (500,'ZP500NM30002',5000,2500,700),(1000,'ZP1000NM30002',5000,4400,1400),(2000,'ZP2000NM30002',5000,4400,2800)],extra={'Usage':'NAS ; Seagate IronWolf Health Management','MTBF':'1,8 million d’heures'})
family('Lightsaber Collection FireCuda','51e19a6321768558','PCIe 4.0 x4 NVMe 1.4','3D TLC NAND',[80.15,25,19],[
 (1000,'ZP1000GM3A053',7300,6000,1275),(2000,'ZP2000GM3A033',7300,6900,2550)],heatsink=True,extra={'Éclairage':'RGB, câble LED fourni de 40 cm'})
family('Beskar Ingot Drive Special Edition FireCuda','491716e1b031c354','PCIe 4.0 x4 NVMe 1.4','3D TLC NAND',[80.15,24.2,9.84],[
 (500,'ZP500GM3A033',7000,3000,640),(1000,'ZP1000GM3A033',7300,6000,1275)],heatsink=True)

family('FireCuda 530 heatsink','ba7e3daeaa4b6d62','PCIe 4.0 x4 NVMe 1.4','3D TLC NAND',[80.15,24.2,9.84],[
 (500,'ZP500GM3A023',7000,3000,640),(1000,'ZP1000GM3A023',7300,6000,1275),
 (2000,'ZP2000GM3A023',7300,6900,2550,{'dimensions':[80.15,24.2,10.39]}),(4000,'ZP4000GM3A023',7250,6900,5100,{'dimensions':[80.15,24.2,11.04]})],heatsink=True)
FAMILIES['IronWolf 525']['dimensionSource']='d222bdd232c0599e'
FAMILIES['Beskar Ingot Drive Special Edition FireCuda']['fieldSources']={'length':'44c554abebbdd8e2'}
FAMILIES['Beskar Ingot Drive Special Edition FireCuda']['notes'].append('La fiche technique DS2095 donne 24,2 × 9,84 mm pour la largeur et la hauteur. Le guide d’installation générique indique 22,9 × 18,25 mm : divergence conservée ; les cotes du tableau propre aux MPN sont retenues.')
family('Game Drive','bf416be8b946d6ab','PCIe 4.0 x4 NVMe 1.4','3D TLC NAND',[None,None,None],[
 (1000,'',None,None,None),(2000,'',None,None,None),(4000,'ZP4000GP3A4001',7250,6900,5100,{'dimensions':[80.15,24.2,11.04]})],heatsink=True,
 notes=['Pour les capacités 1 et 2 To, le nom d’archive ne départage pas Game Drive M.2 GP304001 et Game Drive PS5 NVMe GP300001. Les dimensions, débits, endurance et MPN propres à une révision restent inconnus. Le 4 To est documenté dans le tableau GP304001. Les anciennes correspondances USB/HDD sont exclues.'])
FAMILIES['Game Drive']['sources']=['d07e3b64060022db']
family('SN850 Call of Duty Edition','86686909324ddb81','PCIe 4.0 x4 NVMe',None,[80,22,2.38],[(1000,'WDBB2F0010BNC-WRSN',7000,5300,600)],notes=['Édition Call of Duty: Black Ops Cold War. Aucune disponibilité actuelle du jeu ou des points promotionnels n’est garantie.'])
FAMILIES['SN850 Call of Duty Edition']['sources']=['05d8710b590ab500']
FAMILIES['SN850 Call of Duty Edition']['fieldSources']={'endurance':'05d8710b590ab500','warranty':'05d8710b590ab500'}
family('Platinum P51','bcdba6d30e5945ca','PCIe 5.0 x4 NVMe','3D TLC NAND',[None,None,2.38],[
 (1000,'',14700,12900,600),(2000,'',14700,13400,1200,{'source':'dd291410b567920e','interface':'PCIe 5.0 x4 NVMe 2.0'})],
 notes=['Fiches de revendeurs coréens correspondant à chaque capacité. Les maxima de la gamme ne sont pas appliqués au modèle 1 To. Le MPN commercial et les dimensions exactes du PCB ne sont pas établis.'])
FAMILIES['Platinum P51']['sources']=['fa88b07341102e3e']

family('EXCERIA PLUS G3','ac7db194afc44fa8','PCIe 4.0 x4 NVMe 1.4','BiCS FLASH TLC',[80.15,22.15,2.63],[(1000,'',5000,3900,600),(2000,'',5000,3900,1200)])
family('EXCERIA PLUS G4','7cccc150e0916ab0','PCIe 5.0 x4 NVMe 2.0c','BiCS FLASH TLC',[80.15,22.15,2.38],[(1000,'',10000,7900,600),(2000,'',10000,8200,1200)])
family('EXCERIA PRO','5418a50fafb853e6','PCIe 4.0 x4 NVMe 1.4','BiCS FLASH TLC',[80.15,22.15,2.23],[(1000,'',7300,6400,400),(2000,'',7300,6400,800)])
family('EXCERIA heatsink','ea26a4e18bd729a4','PCIe 4.0 x4 NVMe 1.4','BiCS FLASH TLC',[80.65,24.7,11.2],[(1024,'',6200,4900,600),(2048,'',6200,4900,1200),(4096,'',6200,4800,2400)],heatsink=True)
for sed in [False,True]:
    family('BG5'+(' SED' if sed else ''),'eccbda83984346b3','PCIe 4.0 x4 NVMe 1.4','BiCS FLASH TLC, 112 couches',[80.15,22.15,2.23],[
      (256,'KBG5'+('A' if sed else '0')+'ZNV256G',3400,1900,150),(512,'KBG5'+('A' if sed else '0')+'ZNV512G',3500,2700,300),(1024,'KBG5'+('A' if sed else '0')+'ZNV1T02',3500,2900,600)],warranty=None,
      extra={'Sécurité':'TCG Opal 2.01 (SED)' if sed else 'Modèle standard non SED','Construction':'M.2 2280-S2 simple face'},notes=['Cotes maximales : 80 ± 0,15 × 22 ± 0,15 mm et hauteur maximale 2,23 mm. La variante 2230 est exclue. La durée de garantie OEM n’est pas publiée dans cette fiche.'])
family('Micron 3400','48b12fb2a30a11c5','PCIe 4.0 NVMe 1.4','Micron 176 couches 3D TLC NAND',[80,22,None],[(1024,'',6600,5000,600)],warranty=None,heatsink=None,
 notes=['Le codage constructeur 1T0 représente 1024 Go, commercialisés comme 1 To. Version de sécurité OEM et suffixe de commande non identifiés. Hauteur, dissipateur et garantie OEM non publiés dans le document retenu.'])
family('Micron 7400 PRO','a85e89cf9992dcab','PCIe 4.0 x4 NVMe 1.4','Micron 96 couches 3D TLC NAND',[80,22,None],[(480,'',4400,530,None)],warranty=None,heatsink=None,
 notes=['Version M.2 2280 de 480 Go. Les versions M.2 22110, U.3 et E1.S sont exclues. Suffixe OEM de commande, hauteur et garantie contractuelle non établis.'])
FAMILIES['Micron 7400 PRO']['sources']=['f6420c6264068d81']
FAMILIES['Micron 7400 PRO']['fieldSources']={'read':'f6420c6264068d81','write':'f6420c6264068d81','nand':'f6420c6264068d81'}

family('MTE245S','ec4ebb7d24df56bc','PCIe 4.0 x4 NVMe 1.4','3D NAND',[80,22,2.42],[
 (250,'TS250GMTE245S',3200,1400,150),(500,'TS500GMTE245S',4800,2800,300),(1000,'TS1TMTE245S',5300,4000,600),(2000,'TS2TMTE245S',5300,4600,1200),(4000,'TS4TMTE245S',5300,4000,2400)],heatsink=True,extra={'Dissipateur détaillé':'Film graphène','Construction':'Simple face','DRAM':'Absente'})
FAMILIES['MTE245S']['identitySource']='e10961edbb1cc1d2'
family('MTE255S','e66871cb2e6356e9','PCIe 4.0 x4 NVMe 1.4','3D NAND',[80,22,2.42],[(1000,'TS1TMTE255S',7400,5200,600),(2000,'TS2TMTE255S',7400,6500,1200)],heatsink=True,extra={'Dissipateur détaillé':'Film graphène','Construction':'Simple face','DRAM':'Absente'})
FAMILIES['MTE255S']['identitySource']='b96d8874b6ccf4f9'
family('MTE240S','affbcad9c474eb96','PCIe 4.0 x4 NVMe 1.4','3D NAND',[80,22,3.77],[(500,'TS500GMTE240S',3800,3200,850),(1000,'TS1TMTE240S',3800,3200,1700)],heatsink=True,extra={'Dissipateur détaillé':'Film graphène','Construction':'Double face','DRAM':'Présente'})
FAMILIES['MTE240S']['identitySource']='ec43175c7a2e9166'
for model,source,dims,kind in [('250S','c6b0e7f9d9ab7998',[80,22,3.77],'Film graphène'),('250H','37e45f3fdc60865a',[80,23.1,9.2],'Dissipateur à ailettes')]:
    family(model,source,'PCIe 4.0 x4 NVMe 1.4','3D NAND',dims,[(1000,'TS1TMTE'+model,7200,6200,780),(2000,'TS2TMTE'+model,7100,6500,1560),(4000,'TS4TMTE'+model,7500,6700,3120)],heatsink=True,extra={'Dissipateur détaillé':kind,'Construction':'Double face','DRAM':'Présente'})

# API ordering rows are accepted only for the exact 2280 capacity and model title.
for name,key in [('P44 Pro','solidigm-p44-api'),('P41 Plus','solidigm-p41-api')]:
    api=SOURCES[key]['data'];FAMILIES[name]['sources']=[key]
    for cap,v in FAMILIES[name]['variants'].items():
        matches=[]
        for r in api['results']:
            a=r['attributes']
            if a.get('SSDFormFactor')!='M.2 2280' or a.get('DriveCapacity')!=(f'{cap//1000} TB' if cap%1000==0 else f'{cap} GB'):continue
            matches.extend(o['orderingCode'] for o in r['orderingSpecs'] if name in o['name'] and '2280' in o['name'])
        if len(set(matches))==1:v.update(mpn=matches[0],identitySource=key)
    if name=='P44 Pro':FAMILIES[name].update(nand='3D NAND, 176 couches',fieldSources={'nand':key})

# Each retailer supplement matches its own capacity; no sibling SKU propagation.
for name,mapping in [('SN770',{250:'a4876f15dfedf9c0',500:'ae61445ea20632c0',1000:'f5ea1fb5e7e87318',2000:'1ec0e346db7a12b7'}),('SN750 SE',{250:'2535d6c96c88f20a',500:'b3cd8182f7dc7562',1000:'7ed4ac3fef19d1a1'})]:
    for cap,key in mapping.items():
        FAMILIES[name]['variants'][cap].update(nand='3D TLC NAND',fieldSources={'nand':key})
        if name=='SN750 SE':FAMILIES[name]['variants'][cap].update(interface='PCIe 4.0 x4 NVMe',fieldSources={'nand':key,'interfaceGeneration':key})

for cap,key in {250:'afd00ea3420cbfde',500:'8ff6fbde560b97ca',1000:'564f6f4cc6480773',2000:'f804893d60068caf'}.items():
    FAMILIES['SN580']['variants'][cap].update(interface='PCIe 4.0 x4 NVMe 1.4b',fieldSources={'interfaceGeneration':key})
for name,mapping in [('SN850',{500:'c77b5d88596c71cb',1000:'d13cf4b7984764d9',2000:'4604e116db9351e5'}),('SN850 heatsink',{1000:'6f4b6e828e64e1ff',2000:'4112ffb6c1c6172b'})]:
    for cap,key in mapping.items():FAMILIES[name]['variants'][cap].update(nand='3D TLC NAND',fieldSources={'nand':key})
FAMILIES['SanDisk Extreme']['variants'][1000].update(nand='3D TLC NAND',fieldSources={'nand':'f3e2c22972682edf'})

if __name__=='__main__':
    (OUT/'curated-families.json').write_text(json.dumps(FAMILIES,ensure_ascii=False,indent=2)+'\n')
    from storage_west_products import generate
    generate(ROOT,OUT,INPUT,SOURCES,FAMILIES)
