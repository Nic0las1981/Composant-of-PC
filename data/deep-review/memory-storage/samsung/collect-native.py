from pathlib import Path
from urllib.request import Request,urlopen
from concurrent.futures import ThreadPoolExecutor
import json,hashlib,datetime,gzip,runpy,re,sys
R=Path(__file__).resolve().parents[4];D=Path(__file__).resolve().parent
helper=runpy.run_path(str(R/'scripts/collect-catalog-review.py'))
urls=json.loads(Path(sys.argv[1]).read_text())
def get(x):
 key,url=x
 try:
  with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=35) as response:data=response.read();status=response.status;resolved=response.url;headers=dict(response.headers)
  if data[:2]==b'\x1f\x8b':data=gzip.decompress(data)
  record={'url':url,'resolvedURL':resolved,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'httpStatus':status,'sha256':hashlib.sha256(data).hexdigest()}
  if data.startswith(b'%PDF'):
   import subprocess
   pdf=Path('/tmp/samsung-'+key+'.pdf');pdf.write_bytes(data);txt=pdf.with_suffix('.txt');subprocess.run(['pdftotext','-layout',str(pdf),str(txt)],check=True);record['text']=txt.read_text()
  else:
   html=data.decode();record['text']=helper['text'](html);record['title']=re.findall('<title[^>]*>(.*?)</title>',html,re.S|re.I);record['links']=list(dict.fromkeys(re.findall(r'(?:href|src)=[\"\']([^\"\']+)',html)));record['jsonld']=helper['jsonld'](html)
   Path('/tmp/samsung-'+key+'.html').write_text(html)
  (D/(key+'.json')).write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n');return key,status,len(record['text']),record.get('title')
 except Exception as e:
  record={'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'error':str(e)};(D/(key+'-error.json')).write_text(json.dumps(record,indent=2));return key,str(e)
with ThreadPoolExecutor(max_workers=4) as pool: print(list(pool.map(get,urls)))
