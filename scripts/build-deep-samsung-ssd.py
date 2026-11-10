"""Map exact Samsung product-lineup tables, keeping capacity columns separate."""
from pathlib import Path
import json,re
OUT=Path(__file__).resolve().parents[1]/'data/deep-review/memory-storage';docs=json.loads((OUT/'samsung-ssd-datasheets.json').read_text());records=[]
# Values individually transcribed from the capacity columns in the retained official PDFs.
models=[
 ('samsung_nvme_ssd_990_evo_datasheet_rev.1.1.pdf','990 EVO','PCIe 4.0 ×4 / PCIe 5.0 ×2, NVMe 2.0',[80.15,22.15,2.38],False,[(1000,'MZ-V9E1T0BW',5000,4200,600,'HMB, sans DRAM dédiée',4.9,4.5),(2000,'MZ-V9E2T0BW',5000,4200,1200,'HMB, sans DRAM dédiée',5.5,4.7)]),
 ('samsung_nvme_ssd_990_evo_plus_datasheet_rev.1.0.pdf','990 EVO Plus','PCIe 4.0 ×4 / PCIe 5.0 ×2, NVMe 2.0',[80.15,22.15,2.38],False,[(1000,'MZ-V9S1T0BW',7150,6300,600,'HMB, sans DRAM dédiée',4.3,4.2),(2000,'MZ-V9S2T0BW',7250,6300,1200,'HMB, sans DRAM dédiée',4.6,4.2),(4000,'MZ-V9S4T0BW',7250,6300,2400,'HMB, sans DRAM dédiée',5.5,4.8)]),
 ('samsung_nvme_ssd_990_pro_datasheet_rev.2.0.pdf','990 PRO','PCIe 4.0 ×4, NVMe 2.0',[80,22,2.3],False,[(1000,'MZ-V9P1T0BW',7450,6900,600,'1 Go LPDDR4',5.5,5.2),(2000,'MZ-V9P2T0BW',7450,6900,1200,'2 Go LPDDR4',6.1,5.5),(4000,'MZ-V9P4T0BW',7450,6900,2400,'4 Go LPDDR4',6.5,5.7)]),
 ('Samsung-NVMe-SSD-980-PRO-Data-Sheet_Rev.2.1.pdf','980 PRO','PCIe 4.0 ×4, NVMe 1.3c',[80.15,22.15,2.38],False,[(250,'MZ-V8P250BW',6400,2700,150,'512 Mo LPDDR4',5,3.9),(500,'MZ-V8P500BW',6900,5000,300,'512 Mo LPDDR4',5.9,5.4),(1000,'MZ-V8P1T0BW',7000,5000,600,'1 Go LPDDR4',6.2,5.7),(2000,'MZ-V8P2T0BW',7000,5100,1200,'2 Go LPDDR4',6.1,5.6)]),
 ('Samsung_NVMe_SSD_980_PRO_with_Heatsink_Datasheet_Rev_2.0.pdf','980 PRO w/Heatsink','PCIe 4.0 ×4, NVMe 1.3c',[80.15,25,8.88],True,[(1000,'MZ-V8P1T0CW',7000,5000,600,'1 Go LPDDR4',6.2,5.7),(2000,'MZ-V8P2T0CW',7000,5100,1200,'2 Go LPDDR4',6.1,5.6)]),
 ('Samsung_NVMe_SSD_970_EVO_Plus_Data_Sheet_Rev.3.0.pdf','970 EVO Plus','PCIe 3.0 ×4, NVMe 1.3',[80.15,22.15,2.38],False,[(250,'MZ-V7S250BW',3500,2300,150,'512 Mo LPDDR4',5,4.2),(500,'MZ-V7S500BW',3500,3200,300,'512 Mo LPDDR4',5.5,5.8),(1000,'MZ-V7S1T0BW',3500,3300,600,'1 Go LPDDR4',5.5,6),(2000,'MZ-V7S2T0BW',3500,3300,1200,'2 Go LPDDR4',5.5,6)]),
 ('Samsung_NVMe_SSD_980_Data_Sheet_Rev.1.1.pdf','980','PCIe 3.0 ×4, NVMe 1.4',[80.15,22.15,2.38],False,[(250,'MZ-V8V250BW',2900,1300,150,'Sans DRAM dédiée',3.7,3.2),(500,'MZ-V8V500BW',3100,2600,300,'Sans DRAM dédiée',4.3,4.2),(1000,'MZ-V8V1T0BW',3500,3000,600,'Sans DRAM dédiée',4.5,4.6)]),
]
for filename,family,interface,dims,heatsink,skus in models:
 doc=next(d for d in docs if d['url'].endswith(filename));src={'name':'Samsung — datasheet et tableau PRODUCT LINEUP, capacité exacte','url':doc['url'],'checkedAt':doc['checkedAt'],'kind':'manufacturer'}
 for cap,mpn,read,write,tbw,cache,pr,pw in skus:
  assert mpn in doc['text'],mpn
  p={'manufacturerPartNumber':mpn,'capacityGB':cap,'storageInterface':'M.2 NVMe','lengthMm':dims[0],'widthMm':dims[1],'heightMm':dims[2],'storageHeatsink':heatsink}
  rows=[{'label':'Référence fabricant','value':mpn},{'label':'Capacité','value':f'{cap} Go'},{'label':'Interface et protocole','value':interface},{'label':'Format M.2','value':'M.2 2280'},{'label':'Dimensions maximales (L × l × H)','value':' × '.join(str(x) for x in dims)+' mm'},{'label':'Dissipateur','value':'Intégré' if heatsink else 'Module nu, sans dissipateur intégré'},{'label':'Lecture séquentielle','value':f'Jusqu’à {read} Mo/s'},{'label':'Écriture séquentielle','value':f'Jusqu’à {write} Mo/s'},{'label':'Type NAND','value':'Samsung V-NAND TLC (3 bits par cellule)'},{'label':'Cache','value':cache},{'label':'Endurance TBW','value':f'{tbw} To écrits (TBW)'},{'label':'Garantie','value':'5 ans limités ou seuil TBW atteint, premier terme échu'},{'label':'Consommation active moyenne lecture / écriture','value':f'{pr} / {pw} W — mesure moyenne du fabricant, pas puissance maximale'},{'label':'Température de fonctionnement','value':'0 à 70 °C'},{'label':'MTBF','value':'1,5 million d’heures'}]
  evidence={k:{'value':v,'sourceURL':src['url'],'checkedAt':src['checkedAt']} for k,v in p.items()}
  for key,value in {'interfaceGeneration':interface,'formFactor':'M.2 2280','read':f'{read} Mo/s','write':f'{write} Mo/s','nand':'V-NAND TLC','endurance':f'{tbw} TBW','warranty':'5 ans limités ou TBW atteint','heatsink':heatsink}.items():evidence[key]={'value':value,'sourceURL':src['url'],'checkedAt':src['checkedAt']}
  records.append({'mpn':mpn,'brand':'Samsung','category':'storage','family':family,'patch':p,'sources':[src],'rows':rows,'fieldEvidence':evidence,'images':[],'url':src['url']})
(OUT/'samsung-ssd-catalog.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n');print('Samsung exact SKU records',len(records))
