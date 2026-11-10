"""NZXT exact color SKU from native public help-center specifications."""
import runpy,pathlib,json,gzip,re,collections
C=runpy.run_path(str(pathlib.Path(__file__).with_name('deep-motherboard-core.py')));globals().update({k:v for k,v in C.items() if not k.startswith('__')})
D=DATA/'nzxt';D.mkdir(parents=True,exist_ok=True)
def articles():
 out={}
 for query in ['N7','N9','N5']:
  url='https://support.nzxt.com/api/v2/help_center/articles/search.json?query='+query+'&locale=en-us';n=0
  while url and n<5:
   meta,s=fetch(url,D/'api'/(query+'-'+str(n)));n+=1
   if meta['status']!='fetched':break
   data=json.loads(s)
   for a in data.get('results',[]):
    if a['title'].endswith(' Specs'):out[norm(a['title'].removesuffix(' Specs'))]=(a,meta)
   url=data.get('next_page')
 return out
def sections(body):
 dom=DOM(body).root;groups=[];rows={};group=None
 for n in dom.walk():
  if n.tag!='tr':continue
  cells=[x for x in n.children if isinstance(x,Node) and x.tag in ('td','th')]
  if len(cells)==1 and (cells[0].tag=='th' or cells[0].attrs.get('colspan')=='2'):group={'title':cells[0].text(),'rows':[]};groups.append(group)
  elif len(cells)==2 and group:
   label,value=[x.text() for x in cells]
   if label and value:group['rows'].append({'label':label,'value':value});rows[label]=value
 return groups,rows
def main():
 source=articles();out={};review=[]
 for item in json.load(gzip.open(DATA/'input.json.gz','rt')):
  c=item['component'];id=c['id']
  if c['brand']!='NZXT':continue
  expected='N7 Z690' if c['name'].startswith('N7-Z69XT-') else c['name'];found=source.get(norm(expected));p=None;state='primary_specs_missing';proof={}
  if found:
   a,meta=found;groups,rows=sections(a['body']);codes=rows.get('Model Number','');color='White' if c.get('finishName','').startswith('Blanc') or c['name'].endswith('-W1') or (c['name']=='N5 Z690' and c.get('finishName')=='Noir / Blanc') else 'Black'
   candidates=re.findall(r'([A-Z0-9-]+)\s*\('+color+r'\)',codes,re.I)
   proof={'title':a['title'],'sourceURL':a['html_url'],'checkedAt':meta['checkedAt'],'apiURL':meta['url'],'apiSHA256':meta.get('sha256'),'modelNumberStatement':codes,'selectedFinish':color,'articleUpdatedAt':a.get('updated_at')}
   if len(candidates)==1:
    canonical=dict(rows)
    for key,titles in {'Memory':['Memory'],'Storage':['Storage Support'],'Expansion Slots':['Expansion Support'],'LAN':['Network and Wireless Support'],'BACK PANEL PORTS':['Rear I/O'],'Internal IO':['Internal I/O']}.items():canonical[key]='\n'.join(r['label']+': '+r['value'] for g in groups if g['title'] in titles for r in g['rows'])
    canonical['CPU']='Socket: '+rows.get('Socket Type','')+'\n'+rows.get('CPU Support','');canonical['Audio']=rows.get('Audio Codec','')
    primary={'name':'NZXT — spécifications et références couleur officielles','url':a['html_url'],'checkedAt':meta['checkedAt'],'kind':'manufacturer'};p=make_product(c,item['review'],canonical,primary);p.update(identityKind='mpn',manufacturerModel=expected,mpn=candidates[0]);p['patch']['manufacturerPartNumber']=candidates[0];p['patch']['manufacturerModel']=expected;p['groups']=[{'title':'NZXT — '+g['title'],'rows':g['rows']} for g in groups];p['offers']=[]
    p['identityNote']=f"NZXT documente {expected} et la référence commerciale {candidates[0]} pour la finition {color}. Les références des autres finitions restent distinctes."
    for field,k,factkey in [('memorySlots','DIMM Slots','memorySlots'),('maxMemoryGB','Max Memory Capacity','memoryCapacity')]:
     m=re.fullmatch(r'(\d+)\s*(?:GB)?',rows.get(k,''),re.I)
     if m:p['patch'][field]=int(m[1]);p['fieldEvidence'][factkey]={'value':int(m[1]),'sourceURL':primary['url'],'checkedAt':primary['checkedAt']}
    state='exact_color_sku_and_specs'
    out[id]=p
   else:state='exact_color_sku_unconfirmed'
  r={'id':id,'name':c['name'],'state':state,**proof};review.append(r);(D/'records').mkdir(exist_ok=True);(D/'records'/(id+'.json')).write_text(json.dumps({'review':r,'product':p},ensure_ascii=False,indent=2))
 (D/'review.json').write_text(json.dumps({'summary':dict(collections.Counter(x['state'] for x in review)),'records':review},ensure_ascii=False,indent=2));(ROOT/'src/data/deepNzxtMotherboards.ts').write_text('// Generated from native NZXT public support specifications.\nimport type {VerifiedProduct} from "./verifiedTypes.ts";\nexport const deepNzxtMotherboardProducts:Record<string,VerifiedProduct> = '+json.dumps(out,ensure_ascii=False,indent=2)+';\n');print('NZXT',len(out),'/',len(review))
if __name__=='__main__':main()
