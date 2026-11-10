"""Extract explicit NVIDIA Founders Edition/reference specification columns.
HTML comments may name obsolete cards and are discarded. Each model column is
kept separate. Slots and installation clearance never become physical thickness.
"""
import json,pathlib,gzip,re,importlib.machinery
H=importlib.machinery.SourceFileLoader('collector',str(pathlib.Path(__file__).with_name('deep-gpu-catalog.py'))).load_module();D=H.D
clean=lambda s:re.sub(r'\s+',' ',H.text(s)).strip()
def extract_reference(s,raw):
 out=[];raw=re.sub(r'<!--.*?-->','',raw,flags=re.S)
 for table in re.findall(r'<table\b[^>]*>(.*?)</table>',raw,re.S|re.I):
  if 'GPU Engine Specs' not in table:continue
  heads=re.search(r'<thead[^>]*>(.*?)</thead>',table,re.S|re.I)
  names=[clean(h) for h in re.findall(r'<th\b[^>]*>(.*?)</th>',heads[1],re.S)] if heads else []
  columns=[(i,n) for i,n in enumerate(names) if re.search(r'(?:GeForce )?RTX\s*\d',n)]
  if not columns:
   m=re.search(r'/rtx-(\d+)/',s['url'])
   if not m:continue
   columns=[(2,'GeForce RTX '+m[1])]
  label_column=columns[0][0]-1
  for col,model in columns:
   values={}
   for row in re.findall(r'<tr\b[^>]*>(.*?)</tr>',table,re.S|re.I):
    cells=[clean(x) for x in re.findall(r'<td\b[^>]*>(.*?)</td>',row,re.S|re.I)]
    if len(cells)>col and cells[label_column] and cells[col]:values[cells[label_column]]=cells[col]
   memory=re.fullmatch(r'(\d+)\s*GB\s*(GDDR\dX?)',values.get('Standard Memory Config',''),re.I)
   if not memory:continue
   length=values.get('Length','');width=values.get('Width','')
   def millimetres(value):
    m=re.fullmatch(r'(?:[\d.]+["”]\s*\()?([\d.]+)\s*mm\)?',value)
    return float(m[1]) if m else None
   length_mm=millimetres(length);width_mm=millimetres(width)
   if not length_mm or not width_mm:continue
   model=model+' Founders Edition';p={'capacityGB':int(memory[1]),'lengthMm':length_mm,'heightMm':width_mm}
   for label,value in values.items():
    field='powerW' if label in ['Total Graphics Power (W)','Graphics Card Power (W)'] else 'recommendedPsuW' if re.fullmatch(r'(?:Required|Minimum) System Power \(W\)(?: \(\d+\))?',label) else None
    if field and re.fullmatch(r'\d+(?:\.\d+)?',value):p[field]=float(value)
   out.append({'brand':'NVIDIA','model':model,'mpn':'','identityKind':'manufacturer-model','capacityGB':int(memory[1]),'values':values,'patch':p,'notes':['Valeurs du tableau de spécifications NVIDIA pour son design Founders Edition/de référence. Elles ne sont pas étendues aux cartes partenaires. Le nombre de slots n’est pas converti en épaisseur millimétrique. Les dimensions de dégagement et les instructions d’installation ne sont pas des dimensions physiques de la carte.'],'source':s})
 return out
def main():
 out=[]
 for f in (D/'sources').glob('*.json'):
  s=json.load(open(f))
  if s['brand']!='NVIDIA' or s.get('status')!=200 or 'Founders Edition' not in s.get('text',''):continue
  if not s.get('contentFile') or not (H.ROOT/s['contentFile']).exists():continue
  out+=extract_reference(s,gzip.open(H.ROOT/s['contentFile'],'rt').read())
 H.write_json(D/'nvidia-model-facts.json',out);print('NVIDIA reference/FE tables:',len(out))
if __name__=='__main__':main()
