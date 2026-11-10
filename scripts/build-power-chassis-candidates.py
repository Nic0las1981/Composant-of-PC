"""Exact manufacturer-model candidates, each tied to a primary page or original PDF."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];E=ROOT/'data/comprehensive-review/power-chassis-evidence';products={}
def make(id,mpn,file,brand,watts,depth,fan,rows,notes=None):
 e=json.loads((E/(file+'.json')).read_text());p={'manufacturerPartNumber':mpn,'wattage':watts,'psuFormat':'ATX'}
 if depth:p.update({'widthMm':150,'heightMm':86,'depthMm':depth,'detailLevel':'documented'})
 if fan:p.update({'fanSizeMm':fan,'fanCount':1})
 r={'mpn':mpn,'identityNote':f'Modèle, puissance, génération et finition rapprochés individuellement de la source primaire {brand}. Aucun prix déduit du nom ou de la ligne d’archive.','sources':[{'name':brand,'url':e['url'],'checkedAt':e['checkedAt'],'kind':'manufacturer'}],'patch':p,'groups':[{'title':'Données de la référence exacte','rows':[{'label':k,'value':str(v)} for k,v in rows]}],'offers':[],'notes':notes or []};products[id]=r;return r
# Six separately fetched DeepCool manufacturer pages, including the separate white V2L.
for id,model,mpn,file,watts,depth,atx,ean in [
 ('import-psu-24420a88b286','DQ750-M-V2L','DP-GD-DQ750-M-V2L','deepcool-dq750-v2l',750,160,'2.31','6933412798927'),
 ('import-psu-37be52160373','DQ650-M-V2L','DP-GD-DQ650-M-V2L','deepcool-dq650-v2l',650,160,'2.31','6933412798910'),
 ('import-psu-0ca3daa93590','DQ750-M-V2L WH','DP-DQ750-M-V2L WH','deepcool-dq750-v2l-white',750,160,'2.4','6933412798941'),
 ('import-psu-4e0e232469e8','DQ750M-V3L','R-DQ750M-FB0B-EU','deepcool-dq750-v3l',750,140,'2.4','6933412716273'),
 ('import-psu-17cc337ee16d','DQ850M-V3L','R-DQ850M-FB0B-EU','deepcool-dq850-v3l',850,140,'2.4','6933412716419'),
 ('import-psu-d8cbb8711f70','DQ1000M-V3L','R-DQA00M-FB0B-EU','deepcool-dq1000-v3l',1000,140,'2.4','6933412716556'),
]:
 text=json.loads((E/(file+'.json')).read_text())['primaryText'];assert mpn in text and ean in text
 make(id,mpn,file,'DeepCool — fiche du modèle exact',watts,depth,120,[('Modèle',model),('P/N',mpn),('EAN',ean),('Puissance continue',f'{watts} W'),('Dimensions W × L × H',f'150 × {depth} × 86 mm'),('Norme',f'ATX12V {atx}'),('Certification','80 PLUS Gold'),('Câblage','Entièrement modulaire'),('Ventilateur','120 mm'),('Protections','OVP / UVP / OCP / SCP / OPP / OTP'),('Température de fonctionnement','0–40 °C')],['V2L et V3L ont des références et profondeurs distinctes. La version blanche WH reste séparée de la version noire. Pour les V3L, le P/N européen est celui de la table fabricant.'])
# Explicit discontinued ATX 3.0 white manufacturer page, distinct from ATX 3.1.
for id,watts,rail,pci in [('import-psu-66e10a1481ba',850,840,3),('import-psu-d9f321abf1b3',1000,996,3),('import-psu-0c79bc40d570',750,744,2)]:
 mpn=f'ATX3-FOCUS-GX-{watts}-WHITE'
 r=make(id,mpn,'seasonic-focus-gx-white-atx30','Seasonic — FOCUS GX WHITE ATX 3.0, produits arrêtés',watts,140,135,[('Modèle commercial',mpn),('Génération','FOCUS GX WHITE ATX 3.0 · distinct de ATX 3.1'),('Puissance continue',f'{watts} W'),('Rail +12 V',f'{rail} W combinés'),('Dimensions','140 mm profondeur × 150 mm largeur × 86 mm hauteur'),('Certification','80 PLUS Gold'),('Refroidissement','135 mm FDB · contrôle S3FC incluant mode sans ventilation'),('Câbles','Entièrement modulaires, individuels blancs à motif tressé'),('Connecteurs GPU',f'1 × 12VHPWR et {pci} × PCIe 6+2'),('Connecteurs CPU','2 × EPS 4+4'),('Connecteurs SATA /Molex','10 SATA / 3 Molex'),('Garantie','10 ans')],['Le code commercial présent dans l’archive est rapproché de la famille blanche ATX 3.0 et de la puissance exacte du tableau constructeur. La fiche est classée produits arrêtés. Aucune offre de la nouvelle génération ATX 3.1 ne lui est attribuée.'])
 r['patch']['color']='#f0efeb'
# Manufacturer PDF has separate columns for each model and a shared mechanical row.
for id,watts,rail,pci in [('import-psu-2892752863cd',450,408,2),('import-psu-a74fc3752b09',550,504,2),('import-psu-2f4aaf870250',650,600,4)]:
 mpn=f'ETL{watts}AWT-M';assert mpn in json.loads((E/'enermax-triathlor-eco.json').read_text())['primaryText']
 make(id,mpn,'enermax-triathlor-eco','ENERMAX — Triathlor ECO fiche fabricant, février 2016',watts,140,None,[('Modèle',mpn),('Puissance continue',f'{watts} W'),('Rail +12 V',f'{rail} W'),('Dimensions W × H × D','150 × 86 × 140 mm'),('Rendement','80 PLUS Bronze'),('Câblage','Hybride semi-modulaire'),('PCIe 6+2',str(pci)),('SATA /Molex /FDD','8 /4 /1'),('CPU','1 × 4+4 broches'),('Protections','OVP / UVP / OPP / SCP / SIP')],['Le document fabricant est historique et ne confirme aucune disponibilité actuelle. Le diamètre du ventilateur n’est pas inventé à partir de la taille du boîtier.'])
r=make('import-psu-dfda1cc04099','FSP650-80EGN','fsp650-oem-datasheet','FSP — fiche OEM 9PA6502502, hébergée par Rosch Computer',650,140,None,[('Modèle','FSP650-80EGN 90+'),('Référence OEM','9PA6502502'),('Puissance continue','650 W'),('Puissance de crête','700 W'),('Rail +12 V combiné','600 W · 4 rails'),('Dimensions profondeur × largeur × hauteur','140 × 150 × 86 mm'),('Certification','80 PLUS Gold'),('Secteur','90–264 V ·47–63 Hz'),('Connectique','4 SATA ·4 Molex ·1 Floppy ·2 PCIe 6 et 2 PCIe 6+2')],['650 W continus confirmés par la fiche FSP originale et le rapport de certification CLEAResult, test du 1 juin 2011 ; 600 W correspond au total combiné des rails 12 V, pas à la puissance nominale du bloc. Aucun prix courant ajouté.'])
r=make('import-psu-b2d35c8858bf','ERV1000EWT-G','enermax-revolution87-datasheet','ENERMAX — REVOLUTION87+ fiche fabricant, hébergée par Kabelfreak',1000,None,139,[('Modèle','REVOLUTION87+ ERV1000EWT-G'),('Puissance continue','1000 W'),('Puissance de crête','1100 W, maximum 60 secondes'),('Rails +12 V','4 rails · 996 W combinés'),('Certification','80 PLUS Gold'),('Secteur','115–240 V ·50–60 Hz'),('CPU','1 EPS 8 et 1 EPS 4+4'),('PCIe 6+2','2 fixes et 4 sur câbles modulaires'),('Câblage','Hybride semi-modulaire'),('Ventilateur','139 mm Twister Bearing, fiche Scan exacte')],['Les dimensions complètes ne figurent pas dans les sources primaires consultées et restent inconnues. Produit déclaré End of Life par Scan ; aucun prix actuel ajouté.'])
e=json.loads((E/'enermax-revolution87-scan.json').read_text());r['sources'].append({'name':'Scan — référence exacte ERV1000EWT-G arrêtée','url':e['url'],'checkedAt':e['checkedAt'],'kind':'retailer'})
silverstone=ROOT/'data/comprehensive-review/power-chassis-silverstone-confirmed.json'
if silverstone.exists():products.update(json.loads(silverstone.read_text()))
(ROOT/'data/comprehensive-review/power-chassis-candidates-confirmed.json').write_text(json.dumps(products,ensure_ascii=False,indent=2))
print('Candidate exact records',len(products))
