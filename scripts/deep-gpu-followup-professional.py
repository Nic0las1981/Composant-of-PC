"""Two exact archived PNY MPNs from complete manufacturer model documents.

Inch measurements keep the explicitly published H/L axes. Slot occupation does
not establish thickness and no system PSU requirement is inferred from board W.
"""
from pathlib import Path
import gzip,json,re,runpy

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'data/deep-review/gpu-followup/professional'
H=runpy.run_path(str(ROOT/'scripts/build-gpu-secondary.py'))
ASSIGNED={
 'import-gpu-72e143943502':('VCNRTX2000ADA-PB','NVIDIA RTX 2000 Ada Generation','https://www.pny.com/file%20library/company/support/product%20brochures/nvidia%20rtx/english/proviz-rtx-2000-ada-datasheet.pdf'),
 'import-gpu-f87d2f2d81ba':('VCNRTX4000ADALP-PB','NVIDIA RTX 4000 SFF Ada Generation','https://www.pny.com/nvidia-rtx-4000-sff-ada-generation'),
}
LABELS=['Product','PNY Part Number','Architecture','Process Size','Die Size','Transistors','CUDA Cores','Tensor Cores','RT Cores','FP32 Performance','Tensor Performance','RT Core Performance','GPU Memory','Memory Interface','Memory Bandwidth','Display Connectors','Form Factor','Thermal Solution','AR/MR/VR/XR Capable','NVIDIA 3D Vision and 3D Vision Pro','Frame Lock','Maximum Power Consumption','NVENC | NVDEC']

def extract(doc):
    values={}
    for line in doc['text'].splitlines():
        if line.startswith('|'):
            cells=[H['clean'](c) for c in line.strip('|').split('|')]
            if len(cells)==2 and cells[0] and not re.fullmatch(r'[- :]+',cells[0]):values[cells[0]]=cells[1]
    if not values:
        section=doc['text'].split('### Specifications',1)[-1].split('- System Requirements')[0]
        for line in section.splitlines():
            for label in sorted(LABELS,key=len,reverse=True):
                if line.startswith(label+' '):values[label]=H['clean'](line[len(label):]);break
    memory=values.get('GPU memory',values.get('GPU Memory',''))
    cap=re.search(r'(\d+)\s*GB\b',memory)
    if not cap:return None
    patch={'capacityGB':int(cap[1])}
    form=values.get('Form factor',values.get('Form Factor',''))
    dim=re.search(r'([\d.]+)[”"]\s*H\s*x\s*([\d.]+)[”"]\s*L',form)
    if dim:patch.update(heightMm=round(float(dim[1])*25.4,2),lengthMm=round(float(dim[2])*25.4,2))
    power=re.search(r'(?:Total board power:\s*)?(\d+)\s*W',values.get('Power consumption',values.get('Maximum Power Consumption','')))
    if power:patch['powerW']=int(power[1])
    return values,patch

def main():
    docs={d['url']:d for d in H['documents']()};items={x['component']['id']:x for x in json.load(gzip.open(ROOT/'data/deep-review/gpu/input.json.gz','rt'))}
    out={};proofs=[]
    for cid,(mpn,model,url) in ASSIGNED.items():
        doc=docs[url];item=items[cid];original=item['original']
        assert H['norm'](original['name'].removeprefix('PNY '))==H['norm'](mpn)
        assert re.search(r'(?<![A-Z0-9-])'+re.escape(mpn)+r'(?![A-Z0-9-])',doc['text'])
        values,patch=extract(doc)
        assert patch['capacityGB']==original['memory']
        assert abs(patch['lengthMm']-original['length'])<=2
        evidence={k:{'value':v,'sourceURL':url,'checkedAt':doc['checkedAt']} for k,v in patch.items()}
        patch.update(manufacturerPartNumber=mpn,description='Carte graphique professionnelle '+model+' ; référence commerciale '+mpn+' publiée par PNY. Les dimensions H/L sont converties depuis les pouces indiqués. Épaisseur et alimentation système recommandée non publiées dans cette source.',detailLevel='partial')
        out[cid]={'identityKind':'mpn','mpn':mpn,'identityNote':'Référence '+mpn+' présente littéralement dans l’archive et dans le document PNY du modèle exact ; capacité mémoire confirmée.','sources':[{'name':'PNY — fiche constructeur du modèle exact','url':url,'checkedAt':doc['checkedAt'],'kind':'manufacturer'}],'patch':patch,'fieldEvidence':evidence,'groups':[{'title':'Spécifications PNY du modèle exact','rows':[{'label':k,'value':v} for k,v in values.items()]}],'notes':['Dimensions converties à partir de 2,7 pouces H × 6,6 pouces L ; la précision reste celle des mesures publiées.','Dual Slot indique une occupation de slots ; aucune épaisseur en millimètres n’en est déduite.','Aucun prix commercial ni wattage système n’est déduit de la puissance de carte.'],'offers':[]}
        proofs.append({'id':cid,'mpn':mpn,'archive':original,'model':model,'source':{k:v for k,v in doc.items() if k not in ['text','rawHTML','links']},'exactMpnPrinted':True})
    OUT.mkdir(parents=True,exist_ok=True)
    for name,data in [('products.json',out),('proofs.json',proofs),('summary.json',{'newProducts':len(out),'mpnIdentities':len(out),'typedFields':sum(len(x['fieldEvidence']) for x in out.values()),'offers':0})]:(OUT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'newProducts':len(out),'typedFields':sum(len(x['fieldEvidence']) for x in out.values())}))

if __name__=='__main__':main()
