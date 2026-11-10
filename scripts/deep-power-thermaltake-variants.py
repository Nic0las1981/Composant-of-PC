"""Document common facts of explicitly compared Thermaltake regional revisions.

The archive often omits the input voltage/ATX generation. Such products get
only the intersection of actual individual tables, never a random revision.
"""
ttCandidateTables=[]
def tt_generic_family(name,w):
 s=name.upper().replace('\u00a0',' ')
 s=re.sub(r'\([^)]*(?:REGIONAL ONLY|230V|DC TO DC VERSION)[^)]*\)','',s)
 s=re.sub(r'\bATX\s*3\.[01]\b','',s);s=re.sub(r'\b'+str(w)+r'\s*W?\b','',s)
 s=s.replace('TT PREMIUM EDITION','').replace('GOLD','').replace('BRONZE','')
 return norm(s)
for p in S.glob('tt-global-*.json'):
 e=json.loads(p.read_text())
 if e.get('statusCode')!=200 or not e.get('primaryText'):continue
 rr=tt_rows(e);d=dict(rr);n=e['primaryText'].splitlines()[0];wm=re.match(r'(\d+)\s*W',d.get('Max Output Capacity',d.get('Watts','')),re.I)
 if not wm or not d.get('P/N'):continue
 w=int(wm[1]);ttCandidateTables.append({'key':p.stem,'name':n,'family':tt_generic_family(n,w),'w':w,'rows':rr,'data':d})
allowed={'SMART','SMARTBX1','TR2','TR2S','TR2RX','LITEPOWER','TOUGHPOWERGT','TOUGHPOWERGX3','TOUGHPOWERGFA3','TOUGHPOWERGFA3SNOW','TOUGHPOWERGF3SNOW'}
for a in items:
 c=a['component'];id=c['id']
 if c['category']!='psu' or c['brand']!='Thermaltake' or id in records:continue
 base=c['name'].split(' · ')[0];w=c['wattage'];fam=tt_generic_family(base,w)
 if fam not in allowed:continue
 candidates=[x for x in ttCandidateTables if x['w']==w and x['family']==fam]
 # An explicitly supplied ATX/input qualifier restricts the candidates.
 requestedATX=re.search(r'ATX\s*(3\.[01])',base,re.I)
 if requestedATX:candidates=[x for x in candidates if ('ATX '+requestedATX[1]) in x['data'].get('Type','') or ('ATX '+requestedATX[1]) in x['name']]
 if '230V' in base.upper():candidates=[x for x in candidates if re.match(r'\s*(?:200|220)\s*[-~]',x['data'].get('Input Voltage',''))]
 if not candidates:continue
 # Preserve the advertised certificate. White/snow is part of the family.
 cert=next((v for v in ['Titanium','Platinum','Gold','Silver','Bronze'] if '80 PLUS '+v in c['name']),None)
 if cert:candidates=[x for x in candidates if cert.lower() in x['data'].get('Efficiency','').lower() or cert.lower() in x['name'].lower()]
 if not candidates:continue
 first=candidates[0];common=[r for r in first['rows'] if r[0] not in ['P/N','Model','Type'] and all(r in x['rows'] for x in candidates[1:])]
 if len(common)<5:continue
 d=dict(common);patch={};out=d.get('Max Output Capacity',d.get('Watts',''))
 if re.match(str(w)+r'\s*W',out,re.I):patch['wattage']=w
 for axis,field in [('W','widthMm'),('H','heightMm'),('D','depthMm')]:
  m=re.search(r'([\d.]+)\s*mm\s*\('+axis+r'\)',d.get('Dimensions',''),re.I)
  if m:patch[field]=float(m[1])
 fan=re.search(r'([\d.]+)\s*(mm|cm)',d.get('Cooling System',''),re.I)
 if fan:patch.update(fanCount=1,fanSizeMm=float(fan[1])*(10 if fan[2].lower()=='cm' else 1))
 # Voltage and norm revisions are deliberately not claimed if the name alone
 # does not distinguish the documented regional variants.
 model=base+' '+str(w)+' W' if str(w) not in base else base
 model_record(c,first['key'],common,patch,model,['Le catalogue ne distingue pas toutes les variantes régionales/révisions de ce nom. Les '+str(len(candidates))+' tableaux constructeur ont été comparés ; seuls les champs strictement identiques sont publiés. Les codes commerciaux, norme ATX divergente et prix restent inconnus.'])
 for v in candidates[1:]:
  e=source(v['key']);src={'name':'Thermaltake — comparaison des variantes du même modèle','url':e['url'],'checkedAt':e['checkedAt'],'kind':'manufacturer'}
  if src not in records[id]['sources']:records[id]['sources'].append(src)
 indexAudit.append({'id':id,'brand':'Thermaltake','state':'common_facts_across_published_same_name_variants','sourceURLs':[source(v['key'])['url'] for v in candidates],'candidatePartPatterns':[v['data']['P/N'] for v in candidates],'commonFieldCount':len(common),'differingFields':sorted({k for v in candidates for k in v['data'] if k not in d})})
