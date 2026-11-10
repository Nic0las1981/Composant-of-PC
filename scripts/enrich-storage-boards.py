"""Reviewed model aliases, explicit heatsink dimensions and image-PDF transcription.
Run after both collectors. Never aliases arbitrary similar model names.
"""
import runpy,pathlib,json,gzip,re,hashlib
C=runpy.run_path(str(pathlib.Path(__file__).with_name('build-storage-boards.py')));globals().update({k:v for k,v in C.items() if not k.startswith('__')})
def source(meta,name):return {'name':name,'url':meta.get('resolvedURL',meta['url']),'checkedAt':meta['checkedAt'],'kind':'manufacturer'}
def save(r):
 for key in ('additionalSources','additionalGroups'):
  if key in r:r[key]=list({json.dumps(x,sort_keys=True,ensure_ascii=False):x for x in r[key]}.values())
 (D/'records'/(r['id']+'.json')).write_text(json.dumps(r,ensure_ascii=False,indent=2))
def main():
 # The original archived product names have independently documented exact codes.
 # AORUS 500 GB is NOT the bare GP-AG4500G; M570 FROZR has PRO in its explicit part-name.
 for id,stem,expected,code in [('import-ssd-b30110d64b26','aorus500','AORUS NVMe Gen4 SSD 500GB','GP-ASM2NE6500GTTD'),('import-ssd-8d48e621954b','m570frozr','SPATIUM M570 PRO PCIe 5.0 NVMe M.2 FROZR','SM570PN2TBF')]:
  meta=json.load(open(D/'variant-pages'/(stem+'.json')));body=gzip.open(D/'variant-pages'/(stem+'.html.gz'),'rt').read();dom=DOM(body).root;h=dom.find(lambda n:n.tag=='h1');assert h and h.text()==expected
  item=next(x for x in INPUT if x['component']['id']==id);c=item['component']
  identity=json.load(open(D/'variant-searches/identity-full.json'));identitytext='\n'.join(b.get('text','') for b in identity['result']['content']);assert code in identitytext
  if c['brand']=='Gigabyte':
   rows=gigabyte_rows(body);assert rows['Total Capacity']=='500GB';subtitle=dom.find(lambda n:n.cls('model-base-info-subtitle'));assert subtitle and subtitle.text()==code
  else:
   columns=[x for x in msi_columns(body) if capacity(x['rows']['Capacity'])==2000];assert len(columns)==1;rows=columns[0]['rows'];assert 'PRO' in rows['Model Name'];assert 'SPATIUM M570 PRO PCIe 5.0 NVMe M.2 2TB FROZR' in identitytext
  prior=json.load(open(D/'records'/(id+'.json')))
  r={'id':id,'brand':c['brand'],'manufacturerModel':expected+(' 2TB' if c['brand']=='MSI' else ''),'partNumber':code,'source':source(meta,c['brand']+' — référence exacte rapprochée par son code commercial'),'receipt':meta,'rows':rows,'images':published_images(body,expected),'state':'exact_model_and_capacity','attempts':prior.get('attempts',[]),'notes':['Le nom court de l’archive a été rapproché par la référence commerciale explicite de la fiche PCPartPicker originale, puis vérifié sur la fiche constructeur. Les variantes voisines restent distinctes.'],'identityEvidenceFile':'data/deep-review/storage-boards/variant-searches/identity-full.json'}
  if c['brand']=='MSI':r['patch']={'name':'SPATIUM M570 PRO FROZR 2 To · PCIe 5.0 ×4'}
  save(r)
 # Page 2 visually read in full. Native text extraction is empty: keep the exact
 # capacity-specific transcription and SHA256 of the original official PDF.
 pdf=json.load(open(D/'biwin-sources/gm7000-current.json'));pdfsource=source(pdf,'Predator / BIWIN — GM7000 sans radiateur, PDF mars 2026, page 2')
 transcription={'receipt':pdf,'page':2,'method':'Transcription manuelle après inspection visuelle de la page entière','shared':{'Interface':'PCIe Gen 4.0 x 4, NVMe 1.4','Weight':'9.8 g ± 1 g','MTBF':'≤ 1,500,000 hours','Operating Temperature':'0 °C to 70 °C','Non-operating Temperature':'-40 °C to 85 °C','Shock Resistance':'1500 G / 0.5 ms','Vibration Resistance':'6.0667G RMS (20–2000 Hz)','Certifications':'CE, FCC, RoHS, BSMI, KCC, VCCI, RCM'},'columns':{}}
 for cap,dram,read,write,riops,wiops,rp,wp,idle,height,tbw in [(512,1,7400,3400,540,900,4.83,4.28,.92,2.2,375),(1000,1,7400,6400,1000,1000,4.96,5.99,.99,2.2,750),(2000,2,7400,6700,1300,1100,5.09,6.27,1.09,5.9,1500),(4000,4,7400,6700,1350,1150,5.18,6.29,1.10,5.9,3000)]:
  transcription['columns'][str(cap)]={'DRAM Cache':f'{dram} GB','Sequential Read speed':f'{read} MB/s','Sequential Write speed':f'{write} MB/s','Max. Random Read Speed':f'{riops} K IOPS','Max. Random Write Speed':f'{wiops} K IOPS','Operating Power Consumption (Read)':f'{rp} W','Operating Power Consumption (Write)':f'{wp} W','Idle Power Consumption':f'{idle} W','Dimensions':f'80.00 x 22.00 x {height:.2f} mm ('+('Single side' if cap<=1000 else 'Double side')+')','Warranty':f'5-Year / {tbw} TBW'}
 (D/'biwin-sources/gm7000-current.transcription.json').write_text(json.dumps(transcription,ensure_ascii=False,indent=2))
 for item in INPUT:
  c=item['component'];p=D/'records'/(c['id']+'.json');r=json.load(open(p))
  if r['state']!='exact_model_and_capacity':continue
  if c['brand']=='MSI':
   dimensions=r['rows'].get('Dimensions','');withheat=[s.strip() for s in dimensions.splitlines() if '(w/ heatsink)' in s]
   if ' HS ' in r['manufacturerModel'] and len(withheat)==1:
    size=dims(withheat[0]);assert size
    r.setdefault('patch',{}).update(dict(zip(['lengthMm','widthMm','heightMm'],size)));r.setdefault('extraFacts',{}).update(dict(zip(['length','width','height'],size)));r['heatsinkEvidence']={'statement':withheat[0],'installed':True}
   overviewURL=r['source']['url'].removesuffix('/Specification');key='m570overview' if c['id']=='import-ssd-8d48e621954b' else hashlib.sha256(overviewURL.encode()).hexdigest()[:20];f=D/'overviews'/(key+'.json')
   if f.exists() and json.load(open(f)).get('status')=='fetched':
    m=json.load(open(f));d=DOM(gzip.open(f.with_suffix('.html.gz'),'rt').read()).root;h=d.find(lambda n:n.tag=='h1');expected=r['manufacturerModel'];quotes=[n.text() for n in d.walk() if n.tag in ('p','li') and re.search(r'heat.?sink|thermal design',n.text(),re.I)]
    if h and expected.startswith(h.text()) and quotes:
     q=quotes[0];s=source(m,'MSI — présentation officielle du dissipateur de cette variante');r.setdefault('additionalSources',[]).append(s);r['heatsinkEvidence']={'statement':q,'installed':True};r.setdefault('extraFieldEvidence',{})['heatsink']={'value':q,'sourceURL':s['url'],'checkedAt':s['checkedAt']};r.setdefault('additionalGroups',[]).append({'title':'Dissipateur de la variante exacte','rows':[{'label':'Dissipateur fourni','value':q}]})
  if c['brand']=='Acer' and family(c)=='Predator GM7000':
   col=transcription['columns'][str(c['capacityGB'])];height=2.2 if c['capacityGB']<=1000 else 5.9;r.setdefault('additionalSources',[]).append(pdfsource);r.setdefault('additionalGroups',[]).append({'title':'PDF constructeur GM7000 — capacité exacte, page 2','rows':[{'label':LABELS_SSD.get(k,k),'value':v} for k,v in {**transcription['shared'],**col}.items()]})
   r.setdefault('patch',{}).update({'lengthMm':80,'widthMm':22,'heightMm':height});r.setdefault('extraFieldEvidence',{}).update({k:{'value':v,'sourceURL':pdfsource['url'],'checkedAt':pdfsource['checkedAt']} for k,v in {'length':80,'width':22,'height':height}.items()})
  # Preserve published Gigabyte product codes separately from previous retailer
  # suffixes such as AG4731TB N. Do not rewrite a sales code on abbreviation alone.
  if c['brand']=='Gigabyte' and r.get('receipt'):
   url=r['receipt']['url'];file=D/'pages'/(hashlib.sha256(url.encode()).hexdigest()[:20]+'.html.gz')
   if file.exists():
    dom=DOM(gzip.open(file,'rt').read()).root;n=dom.find(lambda n:n.cls('model-base-info-subtitle'))
    if n and n.text():r['rows']['Published model code']=n.text()
  if c['brand'] in ('ASUS','Gigabyte'):
   url=r['source']['url'].removesuffix('/sp').removesuffix('/spec/');f=D/'overviews'/(hashlib.sha256(url.encode()).hexdigest()[:20]+'.json')
   if f.exists() and json.load(open(f)).get('status')=='fetched':
    m=json.load(open(f));dom=DOM(gzip.open(f.with_suffix('.html.gz'),'rt').read()).root;s=source(m,c['brand']+' — présentation officielle du modèle exact');facts={};quotes=[]
    if c['brand']=='ASUS':
     paragraphs=[n.text() for n in dom.walk() if n.tag in ('p','li')];speed=next((t for t in paragraphs if t.startswith('The ROG Strix SQ7 delivers up to 7000 MB/s sequential read speeds and up to 6000 MB/s sequential write speeds.')),None);form=next((t for t in paragraphs if t.startswith('The Strix SQ7 has a compact M.2 2280 form factor')),None);warranty=next((t for t in paragraphs if 'The 60-month warranty period' in t),None)
     if speed:facts.update({'read':'7000 MB/s maximum','write':'6000 MB/s maximum'});quotes.append(speed)
     if form:facts.update({'formFactor':'M.2 2280','interface':'M.2 NVMe'});r.setdefault('patch',{})['storageInterface']='M.2 NVMe';quotes.append(form)
     if warranty:facts['warranty']='60 mois — conditions publiées sur la page constructeur';quotes.append(warranty)
    else:
     # Only the exact model's named feature bullets, never navigation or a review.
     bullets=[n.text() for n in dom.walk() if n.tag=='li'];heat=next((t for t in bullets if t=='+ Offered with an optional aluminum Heat Spreaders'),None) or next((t for t in bullets if t=='High Efficient Heat Spreader with Nanocarbon Coating'),None)
     if heat:facts['heatsink']=heat;quotes.append(heat)
     if heat and 'optional' not in heat:r.setdefault('patch',{})['storageHeatsink']=True
    if facts:
     r.setdefault('additionalSources',[]).append(s);r.setdefault('extraFieldEvidence',{}).update({k:{'value':v,'sourceURL':s['url'],'checkedAt':s['checkedAt']} for k,v in facts.items()});r.setdefault('additionalGroups',[]).append({'title':'Compléments de la présentation constructeur','rows':[{'label':'Déclaration constructeur','value':q} for q in quotes]})
  save(r)
 for id,reason,files in [('import-ssd-20af8d6c3435','AI TOP UD et AI TOP 100E sont des produits distincts. La page constructeur AI TOP UD citée par la presse renvoie 404 ; aucune table 100E ne lui est attribuée.',['variant-pages/aiud-news.json','overviews/aiud.json','variant-pages/aiudbase.json','variant-searches/aiud-followup.json']),('import-ssd-f37e0ff096d2','La référence Eco-Pack/Bulk est retrouvée dans PCPartPicker. Son ancienne page MSI Store renvoie 404 et la page actuelle ne prouve pas ce conditionnement ; aucune assimilation automatique au produit boîte.',['variant-searches/ecobulk-followup.json','variant-pages/msi-ecopack.json','variant-pages/m482store.json']),('import-ssd-22e9d7d12189','PCPartPicker archive 500 Go et 8U2N1AA ; le fabricant publie 512 Go, le marchand 8U2N1AA#. Le suffixe commercial et la correction de capacité ne sont pas présumés équivalents.',['variant-searches/hp500-pcp.json','variant-searches/followup-full.json'])]:
  r=json.load(open(D/'records'/(id+'.json')));r['blocker']=reason;r['followupEvidenceFiles']=files;save(r)
if __name__=='__main__':main()
