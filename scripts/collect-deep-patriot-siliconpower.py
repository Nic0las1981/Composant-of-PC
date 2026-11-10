"""Cache complete public SKU tables from Patriot and Silicon Power, preserving MPNs."""
from pathlib import Path
import concurrent.futures,gzip,html,json,re,runpy,subprocess
M=runpy.run_path(str(Path(__file__).with_name('collect-deep-memory-manufacturer-catalogs.py')));fetch=M['fetch'];OUT=M['OUT'];ROOT=M['ROOT'];clean=M['clean']
patriot=[]
for path in (OUT/'patriot-pages').glob('*.json'):
 meta=json.loads(path.read_text());s=gzip.decompress((ROOT/meta['file']).read_bytes()).decode();title=clean((re.search(r'<title>(.*?)</title>',s,re.S) or ['',''])[1]);chunks=[]
 for raw in re.findall(r'self\.__next_f\.push\((\[1,"(?:\\.|[^"\\])*"\])\)',s):
  try:chunks.append(json.loads(raw)[1])
  except Exception:pass
 t=''.join(chunks);seen=set()
 for match in re.finditer('"partNumber":',t):
  start=t.rfind('{',0,match.start())
  try:row,_=json.JSONDecoder().raw_decode(t[start:])
  except Exception:continue
  mpn=row.get('partNumber')
  if not mpn or mpn in seen:continue
  seen.add(mpn);patriot.append({'mpn':mpn,'row':row,'source':meta,'title':title})
(OUT/'patriot-catalog.json').write_text(json.dumps(patriot,ensure_ascii=False,indent=2)+'\n');print('Patriot published rows',len(patriot),flush=True)
urls=[]
for n in ['', '2','3']:
 meta,s=fetch(f'https://www.silicon-power.com/sitemap/tw_catalog_list/sitemap{n}.xml','catalog-pages')
 urls.extend(html.unescape(u) for u in re.findall(r'<loc>(.*?)</loc>',s) if u.startswith('https://www.silicon-power.com/product-detail/'))
urls=sorted(set(u for u in urls if re.search(r'DDR4|DDR5|XPOWER|UD90|UD85|US75|XD85|XS70|US70',u,re.I)))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
 pairs=list(ex.map(lambda u:fetch(u,'siliconpower-pages'),urls))
records=[]
for meta,s in pairs:
 if not s:continue
 title=clean((re.search(r'<title>(.*?)</title>',s,re.S) or ['',''])[1]);tables=[]
 for table in re.findall(r'<table\b[^>]*>(.*?)</table>',s,re.S):
  if 'P/N' not in table:continue
  heads=[clean(x) for x in re.findall(r'<th\b[^>]*>(.*?)</th>',table,re.S)];rows=[]
  for tr in re.findall(r'<tr\b[^>]*>(.*?)</tr>',table,re.S):
   vals=[clean(x) for x in re.findall(r'<td\b[^>]*>(.*?)</td>',tr,re.S)]
   if vals and vals[0].startswith('SP'):rows.append(dict(zip(heads,vals)))
  tables.extend(rows)
 spec=s[s.find('id="spec"'):s.find('id="document"')];shared=[]
 # Literal display rows are retained, not interpreted as a cross product of values.
 for block in re.findall(r'<li\b[^>]*>(.*?)</li>',spec,re.S):
  vals=re.findall(r'<div[^>]*>(.*?)</div>',block,re.S)
  if len(vals)>=2:shared.append({'label':clean(vals[0]),'value':clean(' '.join(vals[1:]))})
 for row in tables:records.append({'mpn':row['P/N'],'title':title,'row':row,'sharedRows':shared,'source':meta})
(OUT/'siliconpower-catalog.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n');print('Silicon Power pages',len(pairs),'published rows',len(records),flush=True)
# Download individual Patriot datasheets linked by the manufacturer; no guessed filename.
pdfurls=sorted({((r['row'].get('file') or {}).get('url') or r['row'].get('externalUrl')) for r in patriot if ((r['row'].get('file') or {}).get('url') or r['row'].get('externalUrl') or '').endswith('.pdf')})
def pdf(u):
 meta,s=fetch(u,'patriot-pdfs')
 if meta.get('error'):return meta
 b=gzip.decompress((ROOT/meta['file']).read_bytes())
 if not b.startswith(b'%PDF'):return dict(meta,error='Not a PDF')
 p=OUT/'patriot-pdfs'/('tmp-'+Path(meta['file']).stem+'.pdf');p.write_bytes(b);t=subprocess.run(['pdftotext','-layout',str(p),'-'],capture_output=True,text=True).stdout;p.unlink();return dict(meta,text=t)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
 docs=[]
 for i,d in enumerate(ex.map(pdf,pdfurls),1):
  docs.append(d)
  if i%100==0:print('Patriot PDF',i,'/',len(pdfurls),flush=True)
(OUT/'patriot-datasheets.json').write_text(json.dumps(docs,ensure_ascii=False,indent=2)+'\n');print('Patriot PDFs complete',len(docs),flush=True)
