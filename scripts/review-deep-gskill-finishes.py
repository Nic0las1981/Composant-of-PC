"""Encode the human visual review of all seven retained exact-SKU contact sheets.

The observations below were made from the actual images, not from SKU suffixes.
An identical image is reused only when independently linked by each SKU page.
"""
import datetime,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'data/deep-review/memory-storage'
targets=json.loads((OUT/'visual-review-targets.json').read_text())
groups=[g for s in targets['sheets'] if s['brand']=='G.Skill' for g in s['groups']]
assert len(groups)==77
observations={}
def setrows(numbers,colors,allowed=None,rgb=None,note=''):
 for i in numbers:
  assert i not in observations
  observations[i]=(colors,allowed or [colors],rgb,note)
setrows(range(1,6),['black','red'],[['black','red'],['black']],note='Circuit et grand décor noirs ; larges motifs rouges imprimés Aegis. Le rouge appartient au décor complet, pas seulement au logo. Aucune conclusion sur un dissipateur métallique.')
setrows([6,8,10,11,13,14,22,23,24,25,40,42,59,61,62,63],['black'])
setrows([7,9,15,16,17,20,27],['red'])
setrows([12,26],['white'])
setrows([18],['blue'])
setrows([19],['silver'])
setrows([21],['gray'])
setrows([28,29,37],['silver','red'],note='Face avant argent brossé et barre supérieure rouge. La face arrière n’est pas visible ; la nomenclature officielle indépendante décrit aussi le double corps noir/argent.')
setrows([30,36,38],['black','white'])
setrows([31,33,39],['silver','black'])
setrows([32,34,35,41],['silver','white'])
setrows(range(43,48),['black','silver'],rgb=True,note='Deux grands panneaux distincts : noir et argent métallique. L’argent n’est pas assimilé au blanc ; diffuseur multicolore allumé.')
setrows([48,49,50,51,52,64,67,68,69,71,75],['black'],rgb=True,note='Corps noir ; éclairage multicolore allumé. Les reflets et le diffuseur ne constituent pas une seconde finition de carénage.')
setrows([53,55,57,76],['gold'],rgb=True)
setrows([54,56,58,77],['silver'],rgb=True)
setrows([60],['silver','black'],[['silver','black'],['silver']],note='Grand corps argent métallique avec large bande centrale noire ; édition argent visible.')
setrows([65,66,73,74],['white','black'],[['white','black'],['white']],rgb=True,note='Grand corps blanc avec large bande centrale noire ; édition blanche et éclairage multicolore visibles.')
setrows([70,72],['silver','black'],[['silver','black'],['silver']],rgb=True,note='Grand corps argent métallique avec large bande centrale noire ; édition argent et éclairage multicolore visibles.')
assert set(observations)==set(range(1,78))
rows=[]
for i,g in enumerate(groups,1):
 colors,allowed,rgb,note=observations[i]
 rows.append({**g,'observedBodyColors':colors,'allowedArchiveFinishes':allowed,'rgbVisible':rgb,'notes':note or 'Finition du corps inspectée visuellement sur la photo fabricant liée au MPN. Logos, contacts dorés et fond exclus ; absence de lumière sur cette vue ne démontre pas l’absence de RGB.','visuallyInspected':True,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sheetIndex':i})
(OUT/'visual-finish-reviews-gskill.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'reviewedImages':len(rows),'exactSkuAssociations':sum(len(r['linkedMPNs']) for r in rows)}))
