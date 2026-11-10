"""Transcribe published Kingston per-capacity columns; assert every literal MPN exists.
The archived 2022 flyer is used only for the original low-profile Renegade SKUs.
Current 2026 SFYR PDF is heatsink-only and is never applied to those older SKUs.
"""
from pathlib import Path
import json,re
OUT=Path(__file__).resolve().parents[1]/'data/deep-review/memory-storage'
docs={x['url'].split('/')[-1]:x for x in json.loads((OUT/'kingston-storage-datasheets.json').read_text())};records=[]
def add(file,family,mpn,cap,read,write,tbw=None,dims=None,heat=None,power=None,warranty=5,gen=4,extra=[]):
 d=docs[file];assert mpn in d['text'],(file,mpn)
 src={'name':'Kingston — tableau fabricant par capacité et références exactes','url':d['url'],'checkedAt':d['checkedAt'],'kind':'manufacturer'}
 p={'manufacturerPartNumber':mpn,'capacityGB':cap,'storageInterface':'M.2 NVMe'}
 if dims:p.update(lengthMm=dims[0],widthMm=dims[1],heightMm=dims[2])
 if heat is not None:p['storageHeatsink']=heat
 if power:p['powerW']=power
 facts={'read':f'{read} Mo/s','write':f'{write} Mo/s','formFactor':'M.2 2280','interfaceGeneration':f'PCIe {gen}.0 ×4','warranty':f'{warranty} ans limités'}
 if tbw:facts['endurance']=f'{tbw} TBW'
 labels={'read':'Lecture séquentielle maximale','write':'Écriture séquentielle maximale','formFactor':'Format M.2','interfaceGeneration':'Interface PCIe','warranty':'Garantie limitée / usure','endurance':'Endurance totale publiée'}
 rr=[{'label':'Référence fabricant','value':mpn},{'label':'Capacité nominale publiée','value':f'{cap} Go'}]+[{'label':labels[k],'value':v} for k,v in facts.items()]+extra
 if dims:rr.append({'label':'Dimensions L × l × H','value':' × '.join(str(x) for x in dims)+' mm'})
 if power:rr.append({'label':'Puissance maximale publiée','value':f'{power} W'})
 ev={k:{'value':v,'sourceURL':src['url'],'checkedAt':src['checkedAt']} for k,v in {**p,**facts}.items()}
 records.append({'mpn':mpn,'brand':'Kingston','category':'storage','family':family,'patch':p,'sources':[src],'rows':rr,'fieldEvidence':ev,'images':[],'url':src['url'],'formFactor':'M.2 2280'})
for mpn,cap,write,tbw,h,power in [('SKC3000S/512G',512,3900,400,2.21,4.1),('SKC3000S/1024G',1024,6000,800,2.21,6.3),('SKC3000D/2048G',2048,7000,1600,3.5,9.9),('SKC3000D/4096G',4096,7000,3200,3.5,10.2)]:
 add('KC3000_en.pdf','KC3000',mpn,cap,7000,write,tbw,[80,22,h],True,power,extra=[{'label':'Contrôleur / NAND / DRAM','value':'Phison E18 · NAND 3D TLC · cache DRAM présent'},{'label':'Refroidissement','value':'Diffuseur thermique bas profil graphène-aluminium'},{'label':'MTBF / température de fonctionnement','value':'2 000 000 heures · 0 à 70 °C'}])
for mpn,cap,read,write,tbw in [('SNV3S/500G',500,5000,3000,160),('SNV3S/1000G',1000,6000,4000,320),('SNV3S/2000G',2000,6000,5000,640),('SNV3S/4000G',4000,6000,5000,1280)]:
 add('snv3s_us.pdf','NV3',mpn,cap,read,write,tbw,[80,22,2.3],extra=[{'label':'NAND / disposition','value':'NAND 3D · circuit simple face'},{'label':'Masse / MTBF / température','value':'7 g · 2 000 000 heures · 0 à 70 °C'}])
for mpn,cap,read,write,tbw in [('SNV2S/250G',250,3000,1300,80),('SNV2S/500G',500,3500,2100,160),('SNV2S/1000G',1000,3500,2100,320),('SNV2S/2000G',2000,3500,2800,640),('SNV2S/4000G',4000,3500,2800,1280)]:
 add('SNV2S_de.pdf','NV2',mpn,cap,read,write,tbw,[80,22,2.2],warranty=3,extra=[{'label':'NAND / disposition','value':'NAND 3D · circuit simple face'},{'label':'Masse / MTBF / température','value':'7 g · 2 000 000 heures · 0 à 70 °C'}])
for mpn,cap,read,write,tbw,power in [('SFYR2S/1T0',1024,14200,11000,1000,6.6),('SFYR2S/2T0',2048,14700,14000,2000,7),('SFYR2S/4T0',4096,14800,14000,4000,9.5),('SFYR2D/8T1',8192,14800,14000,8000,9.5)]:
 add('SFYR2S_en.pdf','FURY Renegade G5',mpn,cap,read,write,tbw,[80,22,3.65 if cap==8192 else 2.3],power=power,gen=5,extra=[{'label':'Contrôleur / NAND / DRAM','value':'SM2508 · NAND 3D TLC · cache DRAM présent'},{'label':'DirectStorage','value':'Pris en charge'},{'label':'Puissance moyenne MobileMark','value':'0,27 W'},{'label':'MTBF / température de fonctionnement','value':'2 000 000 heures · 0 à 70 °C'}])
for mpn,cap,write,tbw,power in [('SFYRSK/1000G',1000,6000,1000,6.3),('SFYRDK/2000G',2000,7000,2000,9.9),('SFYRDK/4000G',4000,7000,4000,10.2)]:
 add('SFYR_en.pdf','Fury Renegade with Heat Sink',mpn,cap,7300,write,tbw,[80,23.67,10.5],True,power,extra=[{'label':'Contrôleur / NAND / DRAM','value':'Phison E18 · NAND 3D TLC · cache DRAM présent'},{'label':'MTBF / température de fonctionnement','value':'2 000 000 heures · 0 à 70 °C'}])
for mpn,cap,write in [('SFYRS/500G',500,3900),('SFYRS/1000G',1000,6000),('SFYRD/2000G',2000,7000),('SFYRD/4000G',4000,7000)]:
 add('SSDFamilyFlyer_mkf_952.pdf','Fury Renegade',mpn,cap,7300,write)
(OUT/'kingston-ssd-catalog.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n');print({'kingstonPublishedStorageSKUs':len(records)})
