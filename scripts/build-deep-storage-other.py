"""Audited SSD capacity tables. No capacity, SKU or revision is guessed.

Input facts below are transcribed from the preserved primary documents. Missing
fields remain missing. Family maxima are never substituted for capacity ratings.
"""
import collections, copy, gzip, json, pathlib, re
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/'data/deep-review/storage-other'; PROOFS=BASE/'proofs'
BRANDS={'Lexar','Sabrent','PNY','Addlink','Klevv','Nextorage','Netac'}
inputs=[r for r in json.load(gzip.open(ROOT/'data/deep-review/memory-storage/input.json.gz','rt')) if r['component']['category']=='storage' and r['component']['brand'] in BRANDS]
facts=[]
def source(key):
 d=json.loads((PROOFS/(key+'.json')).read_text())
 assert d.get('status')==200 or d.get('retrieval')=='exa_fulltext' or d.get('localImage'),(key,d.get('status'))
 return d
def family(brand,name,key,variants,**shared):
 """variants are explicit (capacity, SKU, read, write, TBW) rows, not extrapolations."""
 d=source(key)
 for item in variants:
  cap,mpn,read,write,tbw,*extra=item
  row=dict(brand=brand,family=name,key=key,capacity=cap,mpn=mpn,read=read,write=write,endurance=tbw,**copy.deepcopy(shared))
  if extra:row.update(extra[0])
  # The SKU must actually appear in the retained document, allowing PDF whitespace.
  if mpn:
   identity_document=source(row['identitySource']) if row.get('identitySource') else d
   normalized=re.sub(r'\s','',identity_document['text'].replace('\x01',' ')).lower()
   assert re.sub(r'\s','',mpn).lower() in normalized or (row.get('wrappedSku') and all(x.lower() in normalized for x in mpn.split('-'))),(name,mpn,key)
  facts.append(row)

# Netac's 2022–2024 capacity tables were republished unchanged in March 2026.
family('Netac','NV7000','1e9f99aa63bc5cbf',[(1000,'NT01NV7000-1T0-E4X',7000,5500,640),(2000,'NT01NV7000-2T0-E4X',7000,6700,1280),(4000,'NT01NV7000-4T0-E4X',7200,6850,3000)],gen=4,nand='3D NAND',dimensions=[80,23.5,11.25],heatsink=True,warranty=5)
family('Netac','NV7000-t','a36814f1ad0e598c',[(512,'NT01NV7000t-512-E4X',7200,4400,320),(1000,'NT01NV7000t-1T0-E4X',7300,6600,640),(2000,'NT01NV7000t-2T0-E4X',7300,6700,1280)],gen=4,nand='3D NAND',dimensions=[80,22,None],heatsink=True,warranty=5,notes=['La fiche donne 80 × 22 × 2,3 mm pour le PCB seul. Un dissipateur métallique à poser est fourni ; sa hauteur montée n’est pas publiée et n’est pas assimilée à celle du PCB.'])
family('Netac','NV5000','73b8da96aa44b8ca',[(500,'NT01NV5000-500-E4X',4800,2700,320),(1000,'NT01NV5000-1T0-E4X',4800,4600,640),(2000,'',5000,4400,1400,{'notes':['La colonne 2 To de la fiche NV5000 imprime « NT01NV3000-2T0-E4X ». Cette incohérence est conservée comme limite : le modèle NV5000 2 To est documenté, mais aucun MPN NV5000 2 To n’est reconstruit.']})],gen=4,nand='3D NAND',dimensions=[80,23.5,11.25],heatsink=True,warranty=5)
family('Netac','NV5000-N','487288ad0e828396',[(500,'NT01NV5000N-500-E4X',4800,2700,320),(1000,'NT01NV5000N-1T0-E4X',4800,4600,640)],gen=4,nand='3D NAND',dimensions=[80,22,3],heatsink=False,warranty=5)
family('Netac','NV5000-t','3470a95877e2110b',[(500,'NT01NV5000t-500-E4X',4800,2700,320),(1000,'NT01NV5000t-1T0-E4X',4800,4600,640)],gen=4,nand='3D NAND',dimensions=[80,22,3],heatsink=False,warranty=5)

family('Klevv','CRAS C715','3f255f534594cc08',[(256,'K256GM2SP0-C7T',3000,2000,150),(512,'K512GM2SP0-C7T',3200,2000,300),(1000,'K01TBM2SP0-C7T',3200,2000,600)],gen=3,nand='3D TLC NAND',dimensions=[80,22,2.5],heatsink=False,warranty=5,notes=['Correction de l’archive : le CRAS C715 est PCIe 3.0 ×4 et non PCIe 4.0 ×4.'])
family('Klevv','CRAS C910','2cb1e4d08f1891d9',[(500,'K500GM2SP0-C91',5000,3700,350),(1000,'K01TBM2SP0-C91',5000,4800,700),(2000,'K02TBM2SP0-C91',5200,4800,1400),(4000,'K04TBM2SP0-C91',5200,4800,2800)],gen=4,nand='3D TLC NAND',dimensions=[80,22,3.4],heatsink=True,warranty=5,notes=['Dissipateur amovible fourni ; dimensions avec dissipateur. Le PCB seul mesure 80 × 22 × 2,15 mm.'])
family('Klevv','CRAS C910 Lite','1961506c4283cbd2',[(500,'K500GM2SP0-C9L',4700,1700,160),(1000,'K01TBM2SP0-C9L',5000,3200,320),(2000,'K02TBM2SP0-C9L',5000,4200,640),(4000,'K04TBM2SP0-C9L',5000,4200,1280)],gen=4,nand='3D NAND',dimensions=[80,22,2.15],heatsink=False,warranty=5)
family('Klevv','CRAS C920','cfa6429e349ff66e',[(1000,'K01TBM2SP0-C92',7000,5500,700),(2000,'K02TBM2SP0-C92',7000,6850,1400)],gen=4,nand='3D TLC NAND',dimensions=[80,22,2.15],heatsink=False,warranty=5)
family('Klevv','CRAS C925','0a67e407421ca1e1',[(500,'K500GM2SP0-C9T',7400,6200,600),(1000,'K01TBM2SP0-C9T',7400,6300,1200),(2000,'K02TBM2SP0-C9T',7400,6500,2400)],gen=4,nand='3D TLC NAND',dimensions=[80,22,3.4],heatsink=True,warranty=5,notes=['Dissipateur amovible fourni ; dimensions avec dissipateur. Le PCB seul mesure 80 × 22 × 2,15 mm.'])
family('Klevv','CRAS C930','d6eb22ebaed04736',[(1000,'K01TBM2SP0-C93',7400,6400,750),(2000,'K02TBM2SP0-C93',7400,6800,1500)],gen=4,nand='3D TLC NAND',dimensions=[80,23.6,8.7],heatsink=True,warranty=5,notes=['Dissipateur amovible fourni ; dimensions avec dissipateur. Le PCB seul mesure 80 × 22 × 3,2 mm.'])

family('PNY','CS2140','fa92e752dc62cb27',[(500,'M280CS2140-500-RB',3600,2300,None),(1000,'M280CS2140-1TB-RB',3600,3200,None),(2000,'M280CS2140-2TB-RB',3300,3000,None)],gen=4,nand='3D NAND',dimensions=[80,22,4],heatsink=False,warranty=5)
family('PNY','CS2241','e314dc134f4a2630',[(500,'M280CS2241-500-RB',4700,1700,None),(1000,'M280CS2241-1TB-RB',5100,3200,None),(2000,'M280CS2241-2TB-RB',5000,4200,None),(4000,'M280CS2241-4TB-RB',5000,4200,None)],gen=4,nand='3D NAND',dimensions=[80,22,4],heatsink=False,warranty=5)
family('PNY','CS2240','9cebbe2d7fb9e403',[(500,'M280CS2240-500-RB',4700,3400,None),(1000,'M280CS2240-1TB-RB',4700,3800,None)],gen=4,nand='3D NAND',dimensions=[80,22,4],heatsink=False,warranty=5)
family('PNY','CS2340','76cdf30c6aba187c',[(1000,'M280CS2340-1TB-TB',7400,6100,None),(2000,'M280CS2340-2TB-TB',7400,6400,None)],gen=4,nand='3D NAND',dimensions=[80,22,4],heatsink=False,warranty=5)
family('PNY','CS3040','cf937e3d305f8291',[(500,'M280CS3040-500-RB',5600,2600,850),(1000,'M280CS3040-1TB-RB',5600,4300,1800),(2000,'M280CS3040-2TB-RB',5600,4300,3600),(4000,'M280CS3040-4TB-RB',5600,3900,900)],gen=4,nand='3D NAND',dimensions=[80,22,4],heatsink=False,warranty=5)
family('PNY','CS3040 HS','cf937e3d305f8291',[(500,'M280CS3040HS-500-RB',5600,2600,850),(1000,'M280CS3040HS-1TB-RB',5600,4300,1800),(2000,'M280CS3040HS-2TB-RB',5600,4300,3600),(4000,'M280CS3040HS-4TB-RB',5600,3900,900)],gen=4,nand='3D NAND',dimensions=[80.4,22.8,20.5],heatsink=True,warranty=5)
family('PNY','CS3140','0b8900ca7b86eca5',[(1000,'M280CS3140-1TB-RB',7500,5650,None),(2000,'M280CS3140-2TB-RB',7500,6850,None),(4000,'M280CS3140-4TB-RB',7500,6850,None)],gen=4,nand='3D NAND',dimensions=[80,22,4],heatsink=False,warranty=5,notes=['La ligne marketing Gen5 du PDF contredit son tableau technique Gen4 ; le tableau et le nom officiel CS3140 PCIe4.0 font foi.'])
family('PNY','CS3150','be7bdcf6a15b962b',[(1000,'M280CS3150HS-1TB-RB',11500,8500,None),(2000,'M280CS3150HS-2TB-RB',12000,11000,None)],gen=5,nand='3D NAND',dimensions=[None,23.5,17.5],heatsink=True,warranty=5,notes=['Version noire à deux ventilateurs. Le PDF annonce 76 mm de longueur mais un circuit M.2 2280 : cette incohérence de longueur est signalée et aucune longueur hors tout n’est imposée.'])

family('Lexar','NM790','e681a6b3c06c972b',[(512,'LNM790X512G-RNNNG',7200,4400,500),(1000,'LNM790X001T-RNNNG',7400,6500,1000),(2000,'LNM790X002T-RNNNG',7400,6500,1500),(4000,'LNM790X004T-RNNNG',7400,6500,3000),(8000,'LNM790X008T-RNNNG',7000,6200,6000)],gen=4,dimensions=[80,22,2.45],heatsink=False,warranty=5)
family('Lexar','NM790 HS','5ec7a6e94e612986',[(1000,'LNM790X001T-RN9NG',7400,6500,1000),(2000,'LNM790X002T-RN9NG',7400,6500,1500),(4000,'LNM790X004T-RN9NG',7400,6500,3000)],gen=4,dimensions=[80,24,9.7],heatsink=True,warranty=5)
family('Lexar','NM800PRO','721b3e2dde905d2e',[(512,'LNM800P512G-RNNNG',7450,3500,500),(1000,'LNM800P001T-RNNNG',7500,6300,1000),(2000,'LNM800P002T-RNNNG',7500,6500,2000)],gen=4,nand='3D TLC NAND',dimensions=[80,22,2.45],heatsink=False,warranty=5,notes=['La page Lexar américaine documente 80 × 22 × 2,45 mm pour les SKU nus ; elle résout la largeur contradictoire de 24 mm imprimée dans le PDF.'])
family('Lexar','NM1090 PRO','06497c6cab53406f',[(1000,'LNM109P001T-RNNNG',14000,10000,700),(2000,'LNM109P002T-RNNNG',14000,13000,1400),(4000,'LNM109P004T-RNNNG',14000,13000,2800)],gen=5,nand='3D TLC NAND',dimensions=[80,22,3.8],heatsink=False,warranty=5)
family('Lexar','NM990','0c599988fa9c0f0d',[(1000,'LNM990X001T-RNNNG',14000,7500,750),(2000,'LNM990X002T-RNNNG',14000,10000,1500),(4000,'LNM990X004T-RNNNG',14000,11000,3000)],gen=5,dimensions=[80,22,2.45],heatsink=False,warranty=5)
family('Lexar','NQ790','a301306b17ebddbf',[(1000,'LNQ790X001T-RNNNG',7000,6000,600),(2000,'LNQ790X002T-RNNNG',7000,6000,1200)],gen=4,nand='3D NAND',dimensions=[80,22,2.45],heatsink=False,warranty=5)
family('Lexar','NQ710','1917ba96ad2e6b67',[(500,'LNQ710X500G-RNNNG',4400,1700,170),(1000,'LNQ710X001T-RNNNG',5000,3300,340),(2000,'LNQ710X002T-RNNNG',5000,4000,680)],gen=4,nand='3D NAND',dimensions=[80,22,2.45],heatsink=False,warranty=3,warrantySource='4bd8f6be952696df')
family('Lexar','EQ790','7234e58a7a1b8b98',[(1000,'LEQ790X001T-RNNNG',7000,5000,600),(2000,'LEQ790X002T-RNNNG',7000,5000,1200),(4000,'LEQ790X004T-RNNNG',7000,6000,2400)],gen=4,nand='3D NAND',dimensions=[80,22,2.45],heatsink=False,warranty=5,wrappedSku=True)

family('Nextorage','G-Series','cd6b4fd5361326e0',[(1000,'NE1N1TB',7300,6000,1200,{'dimensions':[80,22,2.15]}),(2000,'NE1N2TB',7300,6900,2400,{'dimensions':[80,22,3.2]}),(4000,'NE1N4TB',7300,6900,5000,{'dimensions':[80,22,3.4]}),(8000,'NE1N8TB',7300,6600,10000,{'dimensions':[80,22,3.4]})],gen=4,nand='3D TLC NAND',heatsink=False,warranty=5)
family('Nextorage','G-Series LE','a14636fdd8bdea49',[(1000,'NN4LE-1TB',7400,6100,600,{'dimensions':[80,22,2.1]}),(2000,'NN4LE-2TB',7400,6400,1200,{'dimensions':[80,22,2.3]}),(4000,'NN4LE-4TB',7200,6200,2400,{'dimensions':[80,22,2.3]})],gen=4,nand='3D TLC NAND',heatsink=False,warranty=5)
family('Nextorage','NEM-PAB','3f6f4cd121d81295',[(1000,'NEM-PAB1TB',7400,6100,None),(2000,'NEM-PAB2TB',7400,6400,None),(4000,'NEM-PAB4TB',7200,6200,None)],gen=4,nand='3D TLC NAND',dimensions=[80.4,23,11.2],heatsink=True,warranty=5)
family('Nextorage','NEM-PAC','cbc08995698e0ab2',[(4000,'NEM-PAC4TB',7400,6400,None)],gen=4,nand='3D TLC NAND',dimensions=[80.5,24.4,10.5],heatsink=True,warranty=5)
family('Nextorage','NEM-PA','10ba1901df79fafd',[(8000,'NEM-PA8TB',7300,6600,None)],gen=4,nand='3D TLC NAND',dimensions=[80.4,23,11.2],heatsink=True,warranty=5)
family('Nextorage','NN5PRO','c5aa8216514948ba',[(1000,'NN5PRO-1TB1BH',11700,9500,700),(2000,'NN5PRO-2TB1BH',12400,11800,1400)],gen=5,nand='3D TLC NAND',dimensions=[80.5,24.8,39.4],heatsink=True,warranty=5,notes=['Correction de l’archive : NN5PRO est PCIe5.0 ×4, et non PCIe4.0 ×8. Version 1BH avec radiateur à double structure.'])

family('Addlink','S93','432af5e91bb08d73',[(1000,'',7200,6100,None),(2000,'',7400,6500,None),(4000,'',7400,6500,None)],gen=4,nand='3D NAND',dimensions=[80,22,2.25],heatsink=False,warranty=5)
family('Addlink','S95','bd5e1911f300cd90',[(1000,'',7200,6000,None),(2000,'',7200,6500,None),(4000,'',7200,6500,None),(8000,'',7000,6000,None)],gen=4,nand='3D NAND',dimensions=[80,22,3.5],heatsink=False,warranty=5)
family('Addlink','A95','021770f2671ab627',[(1000,'',7200,6000,None),(2000,'',7200,6500,None),(4000,'',7200,6500,None),(8000,'',7000,6000,None)],gen=4,nand='3D TLC NAND',dimensions=[80,None,9.1],heatsink=True,warranty=5,notes=['Le PDF A95 indique 20 mm de largeur pour un module 2280 ; la largeur totale contradictoire est laissée à confirmer. La hauteur de 9,1 mm inclut le dissipateur.'])
family('Addlink','D60','f5f52bd608db571b',[(480,'',6000,700,920),(960,'',6000,1400,1900),(1920,'',6000,2000,3800)],gen=4,nand='3D eTLC NAND',dimensions=[80,22,4.08],heatsink=False,warranty=5,notes=['Modèle NAS D60 : performances soutenues, endurance 1 DWPD, protection contre perte d’alimentation ; ne pas assimiler au S95 grand public.'])
family('Addlink','G55','7629d0917a01b9b9',[(1000,'',None,None,None),(2000,'',None,None,None),(4000,'',None,None,None)],gen=5,nand='3D NAND',dimensions=[80,22,2.3],nominalDimensions=True,heatsink=False,warranty=5,notes=['La fiche publie un maximum de gamme de 10300/9000 Mo/s sans tableau par capacité ; ces maxima ne sont pas attribués individuellement.'])
family('Addlink','G55H','9bafc3c81d3388d8',[(1000,'',None,None,None),(2000,'',None,None,None),(4000,'',None,None,None)],gen=5,nand='3D NAND',dimensions=[None,None,8.75],heatsink=True,warranty=5,notes=['La fiche contient des maxima de gamme contradictoires 10300/10500 Mo/s, sans tableau par capacité ; aucun débit exact n’est attribué à une capacité.'])

# ADDITIONAL_FACTS
family('Lexar','NM760','nm760-pdf-exa',[(512,'LNM760X512G-RNNNG',5300,4000,500),(1000,'LNM760X001T-RNNNG',5300,4500,1000),(2000,'LNM760X002T-RNNNG',5300,4500,1500)],gen=4,dimensions=[80,22,2.45],heatsink=False,warranty=5,notes=['Fiche Lexar 07/2022 archivée, récupérée intégralement par Exa ; option de dissipateur distincte, cette référence RNNNG est nue.'])
family('Lexar','NQ710','nq710-4tb-pdf-exa',[(4000,'LNQ710X004T-RNNNG',4850,4000,1360)],gen=4,nand='3D NAND',dimensions=[80,22,2.45],heatsink=False,notes=['La fiche Lexar 09/2023 publiée par Data Systems documente bien le 4 To ; cette capacité n’apparaît plus dans le PDF Lexar récent à trois capacités. Garantie de cette référence ancienne non précisée dans ce document.'])
family('Lexar','NQ790','30c1959e94e7ed81',[(500,'LNQ790X500G-RNNNG',6400,2900,300)],gen=4,heatsink=False,kind='retailer',notes=['Version 500 Go originale confirmée par le marchand HSSL. Elle reste distincte de la nouvelle version 512 Go du PDF Lexar actuel ; aucune capacité ni référence n’est substituée.'])
family('Addlink','A93 PS5','7a5b7a048cebbd47',[(1000,'',7200,6100,None),(2000,'',7400,6500,None),(4000,'',7400,6500,None)],gen=4,nand='3D NAND',dimensions=[80,22,8.75],heatsink=True,warranty=5)
family('Addlink','A92','1f72fa2a3cad99bb',[(1000,'ad1TBA92M2P',4700,1850,None,{'identitySource':'692dfbb718e8c970'}),(2000,'ad2TBA92M2P',4850,3600,None,{'identitySource':'7f2d03c433bae13c'}),(4000,'ad4TBA92M2P',4900,3600,None)],gen=4,nand='3D QLC NAND',dimensions=[80,None,9.1],heatsink=True,warranty=5,kind='retailer',notes=['Tableau des trois capacités fourni par le marchand français Stealth-Gamer. La largeur de 20 mm publiée contredit le format 2280 et reste non intégrée.'])
family('Addlink','A90','6b7f7b608b7804b7',[(1000,'ad1TBA90M2P',5500,4400,None)],gen=4,nand='3D TLC NAND',dimensions=[80,None,9.1],heatsink=True,warranty=5,kind='retailer',notes=['Fiche du marchand français Stealth-Gamer pour le SKU 1 To exact. Largeur publiée 20 mm contradictoire avec 2280, laissée à confirmer.'])
family('Addlink','S90','d6ac6c74dd0b7369',[(1000,'ad1TBS90M2P',5000,4400,None),(2000,'ad2TBS90M2P',5000,4400,None)],gen=4,nand='3D TLC NAND',dimensions=[80,22,3.5],heatsink=False,warranty=5,kind='retailer',notes=['Fiche du distributeur officiel japonais Links International, modèle S90 original, distinct du S90 Lite qui occupe désormais l’URL fabricant /pcie-s90. Le tableau Gen4 prime sur la coquille Gen3 du paragraphe marketing.'])
family('PNY','CS3140','72eebbc43f532a4e',[(8000,'M280CS3140-8TB-RB',None,None,None)],gen=4,kind='retailer',notes=['L’existence du SKU 8 To est confirmée par le distributeur Win Source. Le PDF fabricant actuel ne couvre que 1/2/4 To ; aucun débit, endurance ni dimension de ces capacités n’est transféré au 8 To.'])
family('PNY','CS2150','7978338b133634df',[(1000,'M280CS2150-1TB-TB',10200,8300,None),(2000,'M280CS2150-2TB-TB',10300,8600,None)],gen=5,nand='3D NAND',dimensions=[80,22,4],heatsink=False,warranty=5)
family('PNY','CS3140 HS','cefc35e13308aa5b',[(1000,'M280CS3140HS-1TB-RB',7500,5650,None),(2000,'M280CS3140HS-2TB-RB',7500,6850,None),(4000,'M280CS3140HS-4TB-RB',7500,6850,None)],gen=4,nand='3D NAND',dimensions=[80.4,22.8,20.5],heatsink=True,warranty=5,notes=['Fiche originale PNY 2021 conservée par B&H ; les variantes HS ne sont pas assimilées aux SSD nus du PDF PNY récent.'])
family('Lexar','NM710','b354b5dc434c942d',[(500,'LNM710X500G-RNNNG',5000,2600,300),(1000,'LNM710X001T-RNNNG',5000,4500,600),(2000,'LNM710X002T-RNNNG',4850,4500,1200)],gen=4,dimensions=[80,22,2.45],heatsink=False,warranty=5,notes=['Fiche originale Lexar 03/2023 hébergée par RS, tableau des SKU Global ; performances également confirmées par la page Lexar NM710.'])
family('Lexar','NM800PRO HS','69222f0325c7ca06',[(512,'LNM800P512G-RN8NG',7450,3500,500),(1000,'LNM800P001T-RN8NG',7500,6300,1000),(2000,'LNM800P002T-RN8NG',7500,6500,2000)],gen=4,nand='3D TLC NAND',dimensions=[80,22,10],heatsink=True,warranty=5)
family('Lexar','PLAY','9b69c847e4d61d2d',[(2000,'LNMPLY8002T-RNNNG',7400,6500,1600),(4000,'LNMPLY8004T-RNNNG',7400,6500,3200),(8000,'LNMPLY8008T-RNNNG',7400,6500,6400)],gen=4,dimensions=[80,24,10],heatsink=True,warranty=5,notes=['Fiche originale Lexar 04/2024 hébergée par 1fodiscount, avec SKU Global par capacité.'])
family('Lexar','NQ780','ffc22e3b24854ac1',[(1000,'LNQ780X001T-RNNNG',6000,2500,600),(4000,'LNQ780X004T-RNNNG',7000,6000,2400)],gen=4,dimensions=[80,22,2.45],heatsink=False,warranty=5)
family('Lexar','NQ700','912e55f85055a500',[(1000,'LNQ700X001T-RNNNG',4200,2100,350),(2000,'LNQ700X002T-RNNNG',4500,3000,700)],gen=4,nand='3D NAND',dimensions=[80,22,2.45],heatsink=False,warranty=3)
family('Lexar','NM1090 HS','fc502eb621c52110',[(1000,'LNM1090001T-RNANG',11500,9000,700),(2000,'LNM1090002T-RNANG',12000,11000,1400),(4000,'LNM1090004T-RNANG',12000,11000,3000)],gen=5,dimensions=[80,24,17.35],heatsink=True,warranty=5,notes=['Fiche originale Lexar conservée par Buchmann ; version à dissipateur actif et éclairage RGB, distincte du NM1090 PRO nu.'])
family('Nextorage','NEM-PA','a1c24f31f68872d2',[(1000,'NEM-PA1TB',7300,6000,700),(2000,'NEM-PA2TB',7300,6900,1400),(4000,'NEM-PA4TB',7300,6900,3000)],gen=4,nand='3D TLC NAND',dimensions=[80.4,23,11.2],heatsink=True,warranty=5)
family('Nextorage','NE5N','fd103c1e935ebe5d',[(1000,'NE5N1TB/FHHE SYM',9500,8500,700),(2000,'NE5N2TB/FHHE SYM',10000,10000,1400)],gen=5,nand='3D TLC NAND',dimensions=[80.5,24.8,38.7],heatsink=True,warranty=5,notes=['Version NE5N originale de 2023 ; les débits et la hauteur du NN5PRO ultérieur ne sont pas repris.'])

# Remaining capacities are individually bound to their exact commercial SKU.
family('Addlink','S90 Lite','8926a88ef6dbfeff',[(512,'ad512GBS90LTM2P',5000,2500,None),(1000,'ad1TBS90LTM2P',5000,4000,None),(2000,'ad2TBS90LTM2P',5000,4000,None),(4000,'ad4TBS90LTM2P',5000,4200,None)],gen=4,nand='3D TLC NAND',dimensions=[80,22,3.5],heatsink=False,warranty=5,kind='retailer',notes=['Tableau du distributeur japonais Aiuto : quatre SKU S90 Lite distincts, hauteur maximale publiée 3,5 mm. L’endurance contractuelle est définie par le pourcentage SMART utilisé, sans TBW chiffré publié.'])
family('Addlink','S92','fd8b01d06f953b22',[(1000,'ad1TBS92M2P',4700,1850,200)],gen=4,nand='3D QLC NAND',dimensions=[80,22,3.5],heatsink=False,warranty=5,kind='retailer')
family('Addlink','S92','ef45ccb5fdd4235f',[(2000,'ad2TBS92M2P',4850,3600,None)],gen=4,nand='3D QLC NAND',dimensions=[80,22,3.5],heatsink=False,warranty=5,kind='retailer')
family('Addlink','S92','7d8ff13a6f20e51f',[(4000,'ad4TBS92M2P',4900,3600,None)],gen=4,nand='3D QLC NAND',dimensions=[80,22,3.5],heatsink=False,warranty=5,kind='retailer')
family('Addlink','A90','4e92d360148a7004',[(2000,'',5000,4400,None)],gen=4,nand='3D TLC NAND',dimensions=[None,None,9.1],heatsink=True,warranty=5,warrantySource='fa4f3bdc0be1e3e3',kind='retailer',notes=['La fiche Geekay identifie explicitement le A90 2 To et publie 5000/4400 Mo/s sur PC ; son résultat PS5 de 5600 Mo/s n’est pas utilisé comme débit nominal. Aucun MPN n’est reconstruit.'])

# Sabrent still publishes its original per-capacity performance artwork. These
# retained images were read visually in addition to OCR, with capacity labels.
SABRENT_WARRANTY_NOTE='La bannière fabricant actuelle annonce cinq ans sans inscription. Des FAQ et fiches anciennes indiquent un ou deux ans, extensibles à cinq après inscription ; vérifier les conditions attachées à la date d’achat.'
SABRENT_DIMENSION_NOTE='Les dimensions de la page fabricant sont arrondies en pouces ; elles ne sont pas converties en cotes millimétriques prétendument exactes.'
def sabrent(name,key,cap,mpn,read,write,tbw=None,**extra):
 notes=[SABRENT_WARRANTY_NOTE,SABRENT_DIMENSION_NOTE]+extra.pop('notes',[])
 family('Sabrent',name,key,[(cap,mpn,read,write,tbw)],gen=extra.pop('gen',4),heatsink=extra.pop('heatsink',False),warranty=5,notes=notes,**extra)
sabrent('Rocket 4 Plus','66ce19d44a55c7b8',1000,'SB-RKT4P-1TB',7000,5300,700,nand='3D TLC NAND',readSource='image-tables/bb5f0bb4814a6241',writeSource='image-tables/bb5f0bb4814a6241',notes=['Débits de la version illustrée sur la fiche constructeur ; les révisions de NAND ultérieures ne sont pas confondues avec cette valeur publiée.'])
sabrent('Rocket 4 Plus','df85ac5b2035f88e',2000,'SB-RKT4P-2TB',7100,6600,1400,nand='3D TLC NAND',readSource='image-tables/eb9d01cd85b531fd',writeSource='image-tables/eb9d01cd85b531fd')
sabrent('Rocket 4 Plus','43b81f5bbcffa233',4000,'SB-RKT4P-4TB',7100,6600,2800,nand='3D TLC NAND',readSource='23a543fe57ed6e52',writeSource='23a543fe57ed6e52',readSourceKind='retailer',writeSourceKind='retailer')
sabrent('Rocket 4 Plus','289c60e25e8fa969',8000,'SB-RKT4P-8TB',7100,6600,3000,nand='3D TLC NAND',readSource='image-tables/3c18379f803e177e',writeSource='image-tables/3c18379f803e177e',notes=['Les valeurs 7100/6600 Mo/s et 3000 TBW sont celles du visuel 8 To et de sa FAQ fabricant, sans leur substituer les chiffres d’agrégateurs.'])
sabrent('Rocket 4.0','1b165b5c43e21a99',500,'SB-ROCKET-NVME4-500',5000,2500,850,nand='3D TLC NAND',readSource='0c56f2967618ab36',writeSource='0c56f2967618ab36',readSourceKind='retailer',writeSourceKind='retailer')
sabrent('Rocket 4.0','733bfeb54ce0dded',1000,'SB-ROCKET-NVME4-1TB',5000,4400,1800,nand='3D TLC NAND',readSource='image-tables/28d32fb60be2eaaf',writeSource='image-tables/28d32fb60be2eaaf')
sabrent('Rocket 4.0','dfceaacde14b4527',2000,'SB-ROCKET-NVME4-2TB',5000,4400,3600,nand='3D TLC NAND',readSource='image-tables/50bcdd9e2afda728',writeSource='image-tables/50bcdd9e2afda728')
sabrent('Rocket 4.0 HTSK','46e6cfe5ce336dca',1000,'SB-ROCKET-NVME4-HTSK-1TB',5000,4400,1800,nand='3D TLC NAND',heatsink=True,readSource='image-tables/22079f0384203f7e',writeSource='image-tables/22079f0384203f7e',notes=['Kit avec dissipateur distinct du SSD nu ; la hauteur montée n’est pas publiée de manière cohérente.'])
sabrent('Rocket 4.0 HTSK','1d108f9d3dfe2875',2000,'SB-ROCKET-NVME4-HTSK-2TB',5000,4400,3600,nand='3D TLC NAND',heatsink=True,readSource='image-tables/7b56cecbe0c02134',writeSource='image-tables/7b56cecbe0c02134',notes=['Kit avec dissipateur distinct du SSD nu ; la hauteur montée n’est pas publiée de manière cohérente.'])
sabrent('Rocket Q4','720b740b6813e8dd',1000,'SB-RKTQ4-1TB',4700,1800,200,nand='3D QLC NAND',readSource='9cb46d04c65a3bcd',writeSource='9cb46d04c65a3bcd',readSourceKind='retailer',writeSourceKind='retailer')
sabrent('Rocket Q4','312476e46b908552',2000,'SB-RKTQ4-2TB',4800,3600,400,nand='3D QLC NAND',readSource='777dfa4f2649143f',writeSource='777dfa4f2649143f',readSourceKind='retailer',writeSourceKind='retailer')
sabrent('Rocket Q4','3462a1d912456554',4000,'SB-RKTQ4-4TB',4900,3500,800,nand='3D QLC NAND',readSource='image-tables/cfa9a4b8384f088b',writeSource='image-tables/cfa9a4b8384f088b')
sabrent('Rocket 4','2a69e0a3174256f0',1000,'SB-RKT4L-1TB',7400,6100,readSource='image-tables/b332febc4f86e250',writeSource='image-tables/b332febc4f86e250',notes=['Le visuel officiel portant 1 TB donne 6100 Mo/s en écriture ; le paragraphe commun à la gamme donne 6400. Le visuel de cette capacité est retenu.'])
sabrent('Rocket 4','ca933c5bc709e441',2000,'SB-RKT4L-2TB',7400,6400,readSource='image-tables/84e3b7a840ff26a0',writeSource='image-tables/84e3b7a840ff26a0')
sabrent('Rocket 4','9d3c8775732087c3',4000,'SB-RKT4L-4TB',7400,6400,readSource='image-tables/f61f0a85298f168f',writeSource='image-tables/f61f0a85298f168f')
sabrent('Rocket 5','9c3c0b3ba7660997',1000,'SB-RKT5-1TB',13000,9500,gen=5,nand='3D TLC NAND',nandSource='b0b273061841e353',nandSourceKind='retailer',readSource='db20006ca09367e7',writeSource='db20006ca09367e7',readSourceKind='retailer',writeSourceKind='retailer',notes=['Les maxima communs de 14 Go/s ne sont pas attribués au SKU 1 To ; Scan confirme 13000/9500 Mo/s pour SB-RKT5-1TB.'])
sabrent('Rocket 5','bd60cde80bc8e70e',2000,'SB-RKT5-2TB',14000,12000,1200,gen=5,nand='3D TLC NAND',dimensions=[80,22,3.5],readSource='9e231d320d5b7c7a',writeSource='9e231d320d5b7c7a',nandSource='d75e3e081484ab44',enduranceSource='d75e3e081484ab44',lengthSource='d75e3e081484ab44',widthSource='d75e3e081484ab44',heightSource='d75e3e081484ab44',nandSourceKind='retailer',enduranceSourceKind='retailer',lengthSourceKind='retailer',widthSourceKind='retailer',heightSourceKind='retailer',notes=['Dimensions et endurance explicites du SKU 2 To publiées par Wootware ; sa garantie marchande trois ans ne remplace pas la garantie fabricant actuelle.'])
sabrent('Rocket 5','83b4b389b272f983',4000,'SB-RKT5-4TB',14000,12000,gen=5,nand='3D TLC NAND',nandSource='7ec74382a959d002',nandSourceKind='retailer',readSource='9b67f1efcf6fe7b8',writeSource='9b67f1efcf6fe7b8',readSourceKind='retailer',writeSourceKind='retailer')
sabrent('Rocket 4 Plus G','1e889d6b234661b8',1000,'SB-RKTG-1TB',7300,6000,700,nand='3D TLC NAND',readSource='g1-official-legacy',writeSource='g1-official-legacy',enduranceSource='g1-official-legacy',notes=['Le tableau officiel de l’ancienne URL de collection, conservé intégralement, documente 7300/6000 Mo/s et 700 TBW.'])
sabrent('Rocket 4 Plus G','2e8790577ecc0d20',2000,'SB-RKTG-2TB',7300,6900,nand='3D TLC NAND',nandSource='f28d6542b5b4d827',readSource='f28d6542b5b4d827',writeSource='f28d6542b5b4d827',nandSourceKind='retailer',readSourceKind='retailer',writeSourceKind='retailer')
sabrent('Rocket 4 Plus G','0e6242b7bc26a3c1',4000,'SB-RKTG-4TB',7300,6900,nand='3D TLC NAND',readSource='ba610050226a5b21',writeSource='ba610050226a5b21',readSourceKind='retailer',writeSourceKind='retailer',notes=['La fiche Scan du SKU exact confirme 7300/6900 Mo/s. Un ancien message de support Sabrent donne une estimation différente et provisoire ; son TBW n’est pas assimilé à une spécification ferme.'])

def cname(c):
 n=c['name'].split(' · ')[0]
 n=re.sub(r'\s+(?:\d+(?:[.,]\d+)?\s*(?:To|Go)).*$','',n)
 n=n.replace('Professional ','').replace('XLR8 ','').replace('w/Heatsink','HS').replace('w/ Heatsink','HS').replace('with Heatsink','HS').strip()
 n=n.replace('NM800PRO','NM800PRO')
 return n

LABELS={'capacity':'Capacité','interface':'Interface','interfaceGeneration':'Interface PCIe','formFactor':'Format M.2','length':'Longueur','width':'Largeur','height':'Hauteur','read':'Lecture séquentielle','write':'Écriture séquentielle','nand':'Type NAND','endurance':'Endurance TBW','warranty':'Garantie','heatsink':'Dissipateur'}
def build():
 products={}; coverage=[]; bykey={(f['brand'],f['family'],f['capacity']):f for f in facts}
 assert len(bykey)==len(facts),'duplicate capacity facts'
 for inp in inputs:
  c=inp['component'];k=(c['brand'],cname(c),c['capacityGB']);f=bykey.get(k)
  if not f:
   coverage.append({'id':c['id'],'brand':c['brand'],'name':c['name'],'status':'not_yet_documented','match':k});continue
  d=source(f['key']);u=d['url'];mpn=f['mpn'];model=f"{f['brand']} {f['family']} {f['capacity']} GB"
  notes=f.get('notes',[]).copy();sources=[{'name':f"{f['brand']} — {f['family']} : fiche et capacité exactes",'url':u,'kind':f.get('kind','manufacturer'),'checkedAt':'2026-11-10'}]
  if f.get('identitySource'):
   sources.append({'name':f"{f['brand']} — référence commerciale exacte",'url':source(f['identitySource'])['url'],'kind':f.get('kind','manufacturer'),'checkedAt':'2026-11-10'})
  vals={'capacity':f['capacity'],'interface':'M.2 NVMe','formFactor':'M.2 2280','interfaceGeneration':f"PCIe {f['gen']}.0 ×4"}
  for a in ['read','write','nand','endurance','warranty','heatsink']:
   if f.get(a) is not None:vals[a]=f[a]
  p={'capacityGB':f['capacity'],'storageInterface':'M.2 NVMe','manufacturerPartNumber':mpn} if mpn else {'capacityGB':f['capacity'],'storageInterface':'M.2 NVMe','manufacturerModel':model}
  if 'heatsink' in vals:p['storageHeatsink']=vals['heatsink']
  for a,v in zip(['length','width','height'],f.get('dimensions',[])):
   if v is not None:
    if f.get('nominalDimensions') and a!='height':continue
    vals[a]=v;p[a+'Mm']=v
  fields={}
  for a,v in vals.items():
   sk=f.get(a+'Source',f['key']);su=source(sk)['url']
   if su not in [s['url'] for s in sources]:sources.append({'name':f"{f['brand']} — preuve complémentaire {LABELS[a]}",'url':su,'kind':f.get(a+'SourceKind','manufacturer'),'checkedAt':'2026-11-10'})
   fields[a]={'value':v,'sourceURL':su,'checkedAt':'2026-11-10'}
  def display(a,v):
   return str(v)+({'capacity':' Go','length':' mm','width':' mm','height':' mm','read':' Mo/s max.','write':' Mo/s max.','endurance':' TBW','warranty':' ans limités (ou endurance atteinte)'}).get(a,'') if a!='heatsink' else 'Fourni' if v else 'Sans dissipateur intégré'
  rows=[{'label':LABELS[a],'value':display(a,v)} for a,v in vals.items()]
  specs=[f"{f['capacity']} Go",'M.2 2280 · NVMe',vals['interfaceGeneration']]
  if f.get('read') is not None:specs.append(f"Lecture jusqu’à {f['read']} Mo/s")
  if f.get('write') is not None:specs.append(f"Écriture jusqu’à {f['write']} Mo/s")
  if f.get('endurance') is not None:specs.append(f"{f['endurance']} TBW")
  if 'heatsink' in vals:specs.append('Dissipateur fourni' if vals['heatsink'] else 'Sans dissipateur intégré')
  p['specs']=specs;p['name']=re.sub(r'PCIe\s*\d\.\d\s*×\d',vals['interfaceGeneration'],c['name'])
  p['description']=f"SSD {f['brand']} {f['family']} de {f['capacity']} Go, M.2 2280, {vals['interfaceGeneration']}. Caractéristiques documentées pour cette capacité et cette variante ; consulter les sources et les limites indiquées."
  old=inp.get('verified');offers=[]
  if old and mpn and old.get('mpn','').upper()==mpn.upper():offers=copy.deepcopy(old.get('offers',[]))
  if c.get('manufacturerPartNumber') and c['manufacturerPartNumber'].upper()!=mpn.upper():notes.append(f"Correction de l’identifiant d’archive « {c['manufacturerPartNumber']} » ; référence constructeur retenue : {mpn or model}. Les offres d’un autre identifiant ne sont pas transférées.")
  products[c['id']]={'identityKind':'mpn' if mpn else 'manufacturer-model',**({'manufacturerModel':model} if not mpn else {}),'mpn':mpn,'identityNote':f"{f['family']} · {f['capacity']} Go : capacité et variante confrontées aux sources primaires citées. "+('MPN explicitement publié.' if mpn else 'Modèle documenté ; aucun MPN commercial n’est inventé.'),'sources':sources,'groups':[{'title':'Capacité et variante documentées','rows':rows}],'patch':p,'offers':offers,'notes':notes,'fieldEvidence':fields}
  coverage.append({'id':c['id'],'brand':c['brand'],'name':c['name'],'status':'documented','mpn':mpn,'model':model if not mpn else None,'sourceKeys':list(dict.fromkeys([f['key']]+[f[a] for a in f if a.endswith('Source')])),'documentedFields':len(fields),'missingFields':[a for a in LABELS if a not in fields],'notes':notes})
 BASE.mkdir(exist_ok=True,parents=True)
 (BASE/'products.json').write_text(json.dumps(products,ensure_ascii=False,indent=2)+'\n')
 (BASE/'coverage.json').write_text(json.dumps({'scope':len(inputs),'products':len(products),'byBrand':dict(collections.Counter(x['brand'] for x in coverage if x['status']=='documented')),'records':coverage},ensure_ascii=False,indent=2)+'\n')
 (ROOT/'src/data/deepStorageOtherCatalog.ts').write_text("import type { VerifiedProduct } from './verifiedTypes';\n\n// Generated from retained manufacturer capacity tables; scripts/build-deep-storage-other.py.\nexport const deepStorageOtherProducts: Record<string, VerifiedProduct> = "+json.dumps(products,ensure_ascii=False,separators=(',',':'))+";\n")
 print(json.dumps({'scope':len(inputs),'products':len(products),'missing':[x['match'] for x in coverage if x['status']!='documented']},ensure_ascii=False,indent=2))

if __name__=='__main__':build()
