"""Extract exact PowerColor pages, including withdrawn generations, from saved Exa fetches.
Search snippets only discover URLs. A row needs its own model code and memory
specification. Board/bracket dimensions, OC/silent clocks and PSU recommendation
retain their distinct meanings. Run independently from deep-gpu-extract.py.
"""
import pathlib,json,re,hashlib,gzip,collections,unicodedata
ROOT=pathlib.Path(__file__).resolve().parents[1];D=ROOT/'data/deep-review/gpu';P=D/'powercolor-deep'
KEYS=['Graphics Engine','Model Name','Series','Video Memory','Stream Processor','Engine Clock(OC)','Engine Clock (OC)','Engine Clock(STD/Silent)','Engine Clock (STD/Silent)','Engine Clock','Memory Speed','Memory Clock','Memory Interface','Standard Display Connectors','Bus Standard','DirectX® Support','DirectX','OpenGL','AMD Eyefinity Technology','AMD Stream Technology','Board Dimensions','Card Dimension(mm)','Minimum System Power requirement (W)','Minimum System Power Requirement (W)','Extension Power Connector','Power Connector','Cooler','Slot','DisplayPort','HDMI','DVI']
STOP=['Feature Support','Maximum Resolution','Power Specs + Board Dimensions','Remark','Features','Download Area']
def clean(s):return re.sub(r'\s+',' ',unicodedata.normalize('NFKC',s)).strip()
def documents():
 out=[]
 for f in sorted(P.glob('fetch-*.json')):
  raw=json.loads(f.read_text())
  if 'result' not in raw:continue
  txt='\n'.join(z.get('text','') for z in raw['result'].get('content',[]));starts=list(re.finditer(r'^# ([^\n]+)\nURL: (https?://[^\s]+)\n',txt,re.M))
  for i,m in enumerate(starts):
   body=txt[m.end():starts[i+1].start() if i+1<len(starts) else len(txt)];body=re.split(r'\nError fetching ',body)[0]
   out.append({'title':m[1].split('∣')[0].strip(),'url':m[2],'text':body,'checkedAt':raw['capturedAt'],'sha256':hashlib.sha256(body.encode()).hexdigest(),'artifact':str(f.relative_to(ROOT))})
 return list({r['url']:r for r in out}.values())

def fans(description):
 # Parse literal fan counts, never “two-ball bearing” or generic heatpipe counts.
 paragraphs=[clean(x) for x in re.split(r'\n\s*\n',description) if re.search(r'fan|heatpipe|backplate|copper base|bios|LED|Sakura|white',x,re.I)]
 counts=set();sizes=set();proof=[]
 for para in paragraphs:
  if len(para)>1500:continue
  if re.search(r'\b(?:dual|two)[ -](?:cooling[ -])?fans?\b',para,re.I) and not re.search(r'\b(?:outer|side|outside|two of the|left|right)\b',para,re.I):counts.add(2);proof.append(para)
  if re.search(r'\b(?:triple|three)[ -](?:cooling[ -])?fans?\b',para,re.I):counts.add(3);proof.append(para)
  ns=re.findall(r'\b([123])\s*[x×]\s*(\d{2,3})\s*mm',para,re.I)
  if ns and re.search(r'fans?',para,re.I):
   # Repetition in separate prose blocks is not additional hardware.
   pairs=list(dict.fromkeys((int(n),int(mm)) for n,mm in ns));counts.add(sum(n for n,_ in pairs));sizes.update(mm for _,mm in pairs);proof.append(para)
  words={'one':1,'two':2,'three':3}
  matches=list(re.finditer(r'\b(one|two|three)\s+(\d{2,3})\s*mm\s+(?:cooling\s+)?fans?\b',para,re.I))
  if matches and not re.search(r'\b(?:outer|outside)\b',para,re.I):
   counts.add(sum(words[m[1].lower()] for m in matches));sizes.update(int(m[2]) for m in matches);proof.append(para)
 patch={}
 if len(counts)==1 and next(iter(counts))<=3:patch['fanCount']=next(iter(counts))
 if patch.get('fanCount') and len(sizes)==1:patch['fanSizeMm']=next(iter(sizes))
 return patch,list(dict.fromkeys(proof)),paragraphs

def parse(doc):
 t=doc['text'];title=doc['title'];start=re.search(r'\nSPECIFICATION\s*\n',t) or re.search(r'(?=\nGraphics Engine(?:\n| ))',t)
 if not start:return None
 section=t[start.end():];end=re.search(r'\nRemark\s*\n',section)
 if end:section=section[:end.start()]
 section=re.split(r'\n¹Game Clock|\nThe entire information|\nAMD RDNA|\nPCIe®',section)[0]
 lines=[clean(re.sub(r'^[#*•]+\s*','',x)) for x in section.splitlines() if x.strip()];values={};cur=None
 for line in lines:
  inline=next((k for k in sorted(KEYS,key=len,reverse=True) if line.startswith(k+' ')),None)
  if inline:cur=inline;values[cur]=line[len(inline):].strip()
  elif line in KEYS:cur=line;values[cur]=''
  elif line in STOP:cur=None
  elif cur:values[cur]=clean(values[cur]+' '+line)
 values={k:v for k,v in values.items() if v and len(v)<1800}
 mpn=values.get('Model Name','');mem=re.search(r'^(\d+)\s*GB\s*(GDDR\dX?)',values.get('Video Memory',''),re.I) or re.search(r'(\d+)\s*GB\s*(GDDR\dX?)',title,re.I)
 if not re.match(r'(?:AXRX|RX)\s*\d',mpn) or not mem or len(values)<5:return None
 p={'capacityGB':int(mem[1])};dims=values.get('Board Dimensions',values.get('Card Dimension(mm)',''))
 dim_matches=list(re.finditer(r'([\d.]+)\s*(?:mm)?\s*[*x×]\s*([\d.]+)\s*(?:mm)?\s*[*x×]\s*([\d.]+)\s*mm',dims))
 bracket=next((d for d in dim_matches if re.match(r'\s*\(with bracket\)',dims[d.end():],re.I)),None)
 d=bracket or (dim_matches[0] if dim_matches else None)
 if d:p.update(lengthMm=float(d[1]),heightMm=float(d[2]),thicknessMm=float(d[3]))
 dimension_basis='with-bracket' if bracket else 'published-board-dimensions'
 if d:values['Dimensions retenues pour le dégagement']=f"{p['lengthMm']:g} × {p['heightMm']:g} × {p['thicknessMm']:g} mm — "+('hors-tout avec équerre ; dimensions de carte seule également conservées dans Board Dimensions' if bracket else 'Board Dimensions publié ; aucune dimension distincte avec équerre n’est fournie')
 psu=next((v for k,v in values.items() if 'System Power' in k),'');n=re.match(r'(\d+)\s*W',psu)
 if n:p['recommendedPsuW']=int(n[1])
 desc=t[:start.start()];patch,fanproof,paragraphs=fans(desc);p.update(patch)
 if fanproof:values['Ventilation — description constructeur']=' / '.join(fanproof)[:2400]
 # Keep model-specific material/control evidence; generic Radeon family boilerplate is excluded.
 physical=[v for v in paragraphs if not v.startswith('#') and re.search(r'heatpipe|backplate|copper base|dual BIOS|white-painted|all-white',v,re.I)]
 if physical:values['Refroidissement et construction — description constructeur']=' / '.join(physical)[:3500]
 values['Mémoire vidéo (fiche constructeur)']=mem[1]+' Go '+mem[2].upper()
 if not re.search(r'\d+\s*GB',title,re.I):title+=' '+mem[1]+'GB '+mem[2].upper()
 notes=[('Dimensions hors-tout avec équerre retenues pour les contrôles de place ; dimensions de carte seule également listées. Le dégagement du câblage reste à ajouter.' if bracket else 'Les dimensions Board Dimensions publiées sont retenues ; aucune mesure distincte avec équerre n’est disponible. Le dégagement réel de l’équerre et du câblage reste à vérifier.'),'La recommandation PSU concerne le système complet ; aucun TBP absent n’en est déduit. Les fréquences OC, standard et silencieuse conservent leurs libellés publiés.']
 if 'RX 6400 XT' in values.get('Graphics Engine','') and 'RX 6400 Low Profile' in title:notes.append('La ligne Graphics Engine contient RX 6400 XT, tandis que le titre et le code AXRX 6400 LP désignent RX 6400. Le libellé contradictoire est conservé comme anomalie de la source, sans renommer la puce en XT.')
 if re.search(r'5600\s*XT',values.get('Graphics Engine',''),re.I):notes.append('La série RX 5600 XT a reçu des mises à jour de BIOS affectant certaines fréquences : la table publiée et ses éventuelles révisions restent distinctes des anciennes valeurs de l’archive.')
 anomalies=[];code_memory=re.search(r'\b(\d+)G(?:BD\d|[ -])',mpn)
 if code_memory and int(code_memory[1])!=int(mem[1]):anomalies.append({'field':'Video Memory','publishedValue':values.get('Video Memory'),'modelCode':mpn,'reason':'La capacité publiée contredit la capacité explicite dans le code modèle. Aucune correction inférée depuis le seul code.'})
 return {'brand':'PowerColor','model':title,'mpn':mpn,'capacityGB':int(mem[1]),'values':values,'patch':p,'notes':notes,'source':{'brand':'PowerColor','url':doc['url'],'requestedURL':doc['url'],'checkedAt':doc['checkedAt'],'status':200,'sha256':doc['sha256'],'digestScope':'exa-extracted-product-text','contentFile':doc['artifact']},'publishedPhysicalText':paragraphs,'dimensionBasis':dimension_basis,'sourceAnomalies':anomalies}

def main():
 docs=documents();rows=[r for d in docs if (r:=parse(d))];seen={};conflicts=[]
 for r in rows:
  key=re.sub('[^a-z0-9]','',r['mpn'].lower())
  if key in seen:
   old=seen[key]
   bad={k:[old['patch'][k],r['patch'][k]] for k in old['patch'].keys()&r['patch'].keys() if old['patch'][k]!=r['patch'][k]}
   if bad:conflicts.append({'mpn':r['mpn'],'urls':[old['source']['url'],r['source']['url']],'fields':bad})
   if len(r['values'])>len(old['values']):seen[key]=r
  else:seen[key]=r
 anomalies=[{'mpn':r['mpn'],'sourceURL':r['source']['url'],'anomalies':r['sourceAnomalies']} for r in rows if r['sourceAnomalies']]
 blocked={re.sub('[^a-z0-9]','',x['mpn'].lower()) for x in conflicts+anomalies};out=[v for k,v in seen.items() if k not in blocked]
 (P/'source-anomalies.json').write_text(json.dumps(anomalies,ensure_ascii=False,indent=2))
 (P/'documents.json').write_text(json.dumps(docs,ensure_ascii=False,indent=2));(P/'parsed-pages.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));(P/'conflicts.json').write_text(json.dumps(conflicts,ensure_ascii=False,indent=2));target=D/'powercolor-model-facts.json';tmp=target.with_suffix('.json.tmp');tmp.write_text(json.dumps(out,ensure_ascii=False,indent=2));tmp.replace(target)
 (P/'visual-description-evidence.json').write_text(json.dumps([{'model':r['model'],'mpn':r['mpn'],'sourceURL':r['source']['url'],'visuallyInspected':False,'imageURLs':[],'textualEvidence':r['publishedPhysicalText'],'canonicalMeasurements':r['patch']} for r in out],ensure_ascii=False,indent=2))
 summary={'retrievedDocuments':len(docs),'parsedTechnicalPages':len(rows),'uniqueExactMPNs':len(out),'conflictingMPNs':len(blocked),'sourceAnomalies':len(anomalies),'withExplicitFanCount':sum('fanCount' in r['patch'] for r in out)};(P/'summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary))
if __name__=='__main__':main()
