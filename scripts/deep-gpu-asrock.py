"""Retain ASRock model-specific specifications from indexed official documents."""
import datetime
import hashlib
import importlib.machinery
import json
from pathlib import Path
import re
import urllib.parse

ROOT=Path(__file__).resolve().parents[1]
M=importlib.machinery.SourceFileLoader('asrock_gpu_parser',str(ROOT/'scripts/deep-gpu-extract.py')).load_module()
D=M.D
index=json.loads((D/'indexes/asrock-models.json').read_text())
keys=['Graphics Engine','Bus Standard','DirectX','OpenGL','Memory','Engine Clock',
      'Stream Processors','Compute Units','Memory Speed','Memory Interface','Resolution',
      'Interface','HDCP','Multi-view','Recommended PSU','Power Connector','Accessories',
      'Dimensions','Net Weight']
out=[]
for file in sorted((D/'indexes').glob('exa-asrock-followup-*.json')):
    result=json.loads(file.read_text())
    text='\n'.join(x.get('text','') for x in result.get('content',[]) if x.get('type')=='text')
    starts=list(re.finditer(r'^# ([^\n]+)\nURL: (https://[^\s]+)\n',text,re.M))
    checked=datetime.datetime.fromtimestamp(file.stat().st_mtime,datetime.timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z')
    for i,match in enumerate(starts):
        url=match[2]
        body=text[match.end():starts[i+1].start() if i+1<len(starts) else len(text)]
        title=urllib.parse.unquote(urllib.parse.urlparse(url).path.split('/')[-2])
        identity=next((row for row in index if M.H.norm(row[0])==M.H.norm(title)),None)
        if not identity:continue
        lines=[re.sub(r'^\s*[-#*]+\s*','',line).strip() for line in body.splitlines()]
        clean='\n'.join(lines)
        values=M.labelled(clean,keys,start='Graphics Engine\n',stop=r'\n(?:Manual|Error fetching)')
        capacity=M.num(values.get('Memory',''),r'\b(\d+)\s*GB\b')
        if not capacity or len(values)<8:continue
        patch={'capacityGB':int(capacity)}
        dimensions=M.triples(values.get('Dimensions',''),'ASRock')
        if dimensions and dimensions[0]>dimensions[1]>dimensions[2]>0:
            patch.update(zip(['lengthMm','heightMm','thicknessMm'],dimensions))
        psu=M.num(values.get('Recommended PSU',''),r'^(\d+)\s*W')
        if psu:patch['recommendedPsuW']=psu
        fan_counts=[n for phrase,n in [('Triple Fan Design',3),('Dual Fan Design',2),('Single Fan Design',1)] if phrase in body]
        if len(set(fan_counts))==1:patch['fanCount']=fan_counts[0];values['Ventilateurs']=str(fan_counts[0])
        out.append({'brand':'ASRock','model':identity[0],'mpn':identity[2],'capacityGB':int(capacity),
                    'values':values,'patch':patch,'notes':['Tableau du modèle exact récupéré sur le site officiel Phantom Gaming. Le code court ASRock identifie le modèle, pas un SKU commercial régional 90-GA… ; aucune consommation de carte n’est déduite de l’alimentation recommandée.'],
                    'source':{'brand':'ASRock','url':url,'requestedURL':url,'status':200,'checkedAt':checked,
                              'sha256':hashlib.sha256(body.encode()).hexdigest(),'digestScope':'exa-extracted-product-text','contentFile':str(file.relative_to(ROOT))}})

# The official product index itself publishes exact models, GPU and memory.
# It can document these facts when an old detailed product page is inaccessible.
# It cannot supply dimensions, clocks, power, fan counts or a commercial SKU.
source_path=D/'sources'/(M.H.key('https://tw.asrock.com/Graphics-Card/index.asp')+'.json')
source=json.loads(source_path.read_text())
raw=''
if source.get('status')==200 and (ROOT/source.get('contentFile','')).is_file():
    import gzip
    raw=gzip.open(ROOT/source['contentFile'],'rt').read()
for row in index:
    if not raw or row[0] not in raw or row[2] not in raw:continue
    capacity=M.num(row[3],r'\b(\d+)\s*GB\b')
    if not capacity:continue
    out.append({'brand':'ASRock','model':row[0],'mpn':row[2],'capacityGB':int(capacity),
                'values':{'Modèle constructeur':row[0],'Graphics Engine':row[1],'Code de modèle constructeur':row[2],'Memory':row[3]},
                'patch':{'capacityGB':int(capacity)},'notes':['Le catalogue constructeur confirme le modèle, le GPU et la mémoire. Les caractéristiques absentes de cet index restent inconnues ; le code court n’est pas un SKU de vente.'],
                'source':source})
M.H.write_json(D/'asrock-model-facts.json',out)
print(json.dumps({'documentedModelBlocks':len(out),'withDetailedTable':sum(len(r['values'])>=8 for r in out)}))
