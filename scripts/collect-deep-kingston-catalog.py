"""Read Kingston's published part-number filters, images and exact datasheets."""
from pathlib import Path
import concurrent.futures,gzip,html,json,re,runpy,subprocess
M=runpy.run_path(str(Path(__file__).with_name('collect-deep-memory-manufacturer-catalogs.py')));fetch=M['fetch'];OUT=M['OUT'];ROOT=M['ROOT']
meta,root=fetch('https://www.kingston.com/en/memory/gaming','catalog-pages')
urls=sorted(set('https://www.kingston.com'+u if u.startswith('/') else u for u in re.findall(r'href="([^"]+)"',root) if '/en/memory/gaming/' in u and re.search('beast|renegade',u) and not any(x in u for x in ['sodimm','impact'])))
print('discovered',urls,flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:list(ex.map(lambda u:fetch(u,'kingston-family-pages'),urls))
records={}
for file in sorted((OUT/'kingston-family-pages').glob('*.json')):
 meta=json.loads(file.read_text());s=gzip.decompress((ROOT/meta['file']).read_bytes()).decode();start=s.find('{"Filters"')
 if start<0:continue
 d,end=json.JSONDecoder().raw_decode(s[start:]);filters={}
 for f in d['Filters']:
  for value in f['Items']:
   for mpn in value['PartNumbers']:filters.setdefault(mpn,{})[f['Name']]=value['Name']
 title=html.unescape(re.sub('<[^>]+>',' ',(re.search(r'<title>(.*?)</title>',s,re.S) or ['',''])[1]));family=('FURY Beast' if 'beast' in meta['url'] else 'FURY Renegade')+(' Pro' if 'pro-rdimm' in meta['url'] else '')+(' RGB' if 'rgb' in meta['url'] else '');ddr='DDR5' if 'ddr5' in meta['url'] else 'DDR4' if 'ddr4' in meta['url'] else None
 # Shared height is not selected from a range; retain complete family text for later review.
 for mpn,attrs in filters.items():
  images=[]
  for group in d.get('ProductImages',[]):
   if mpn in [x['PartNumber'] for x in group.get('PartNumbers',[])]:images.extend(x.get('ZoomURL') or x['URL'] for x in group['Images'])
  records[mpn]={'mpn':mpn,'family':family,'memoryType':ddr,'attributes':attrs,'images':images,'source':meta,'title':title}
(OUT/'kingston-catalog.json').write_text(json.dumps(list(records.values()),ensure_ascii=False,indent=2)+'\n');print('published SKUs',len(records),flush=True)
# Each requested PDF code was literally published above or was already verified before this run.
known=json.loads(gzip.decompress((OUT/'input.json.gz').read_bytes()));codes=set(records)|{r['verified']['mpn'] for r in known if r['component']['brand']=='Kingston' and r['component']['category']=='ram' and r.get('verified')}
def pdf(code):
 meta,s=fetch('https://www.kingston.com/datasheets/'+code.replace('/','_')+'.pdf','kingston-pdfs')
 if meta.get('error'):return meta
 p=ROOT/meta['file'];b=gzip.decompress(p.read_bytes())
 if not b.startswith(b'%PDF'):return dict(meta,error='Response is not PDF')
 temp=OUT/'kingston-pdfs'/(p.name.replace('.html.gz','.pdf'));temp.write_bytes(b)
 text=subprocess.run(['pdftotext','-layout',str(temp),'-'],capture_output=True,text=True,check=True).stdout;temp.unlink()
 return dict(meta,mpn=code,text=text)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
 docs=[]
 for i,d in enumerate(ex.map(pdf,sorted(codes)),1):
  docs.append(d)
  if i%50==0:print('PDFs',i,'errors',sum('error' in x for x in docs),flush=True)
(OUT/'kingston-datasheets.json').write_text(json.dumps(docs,ensure_ascii=False,indent=2)+'\n');print('complete',len(docs),flush=True)
