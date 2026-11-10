"""Retain only facts shared by every published candidate of the exact archive model.
The candidate set already matches family, generation, capacity, kit, speed, CAS,
finish/RGB and SSD form factor. It is not a generic family-level promotion.
"""
import copy,json
ALIASES={'capacityGB':'capacity','memorySticks':'kit','memoryType':'generation','memorySpeedMTs':'rate','casLatency':'cas','memoryVoltageV':'voltage','memoryProfile':'profile','memoryModuleKind':'moduleType','memoryEcc':'hostEcc','heightMm':'height','memoryHeatspreader':'heatspreader','storageInterface':'interface','lengthMm':'length','widthMm':'width','storageHeatsink':'heatsink'}
LABELS={'capacityGB':'Capacité totale (Go)','memorySticks':'Nombre de modules','memoryType':'Génération mémoire','memorySpeedMTs':'Débit testé (MT/s)','casLatency':'Latence CAS (CL)','memoryVoltageV':'Tension du profil testé (V)','memoryProfile':'Profils mémoire','memoryModuleKind':'Type de module','memoryModuleFormat':'Format du module','memoryRegistered':'Mémoire enregistrée','memoryEcc':'ECC système','memoryRankCount':'Rangs par module','memoryDeviceWidthBits':'Largeur des puces (bits)','heightMm':'Hauteur (mm)','lengthMm':'Longueur (mm)','thicknessMm':'Épaisseur (mm)','widthMm':'Largeur (mm)','memoryHeatspreader':'Dissipateur mémoire','rgb':'Éclairage RGB','storageInterface':'Interface du SSD','storageHeatsink':'Dissipateur SSD','read':'Lecture séquentielle','write':'Écriture séquentielle','endurance':'Endurance TBW','warranty':'Garantie','formFactor':'Format M.2','interfaceGeneration':'Génération PCIe','dramCache':'Cache DRAM'}
def intersect(component,candidates):
 model=component['brand']+' '+component['name'];common={};evidence={};differences=[];rows=[];proofs={};keys={k for r in candidates for k in r['patch']}|{k for r in candidates for k in r['fieldEvidence']}
 for key in sorted(keys):
  if key in ['manufacturerPartNumber','description','manufacturerModel'] or key in ALIASES.values():continue
  available=[r['fieldEvidence'].get(key) for r in candidates]
  values={json.dumps(x['value'],sort_keys=True) for x in available if x is not None}
  if len(values)!=1 or len([x for x in available if x is not None])!=len(candidates):differences.append(key);continue
  value=available[0]['value'];evidence[key]=copy.deepcopy(available[0]);evidence[key]['reason']='Valeur identique explicitement publiée pour les '+str(len(candidates))+' références candidates listées dans la fiche.'
  if all(key in r['patch'] for r in candidates):common[key]=value
  if key in ALIASES:evidence[ALIASES[key]]=copy.deepcopy(evidence[key])
  proofs[key]=[{'mpn':r['mpn'],'sourceURL':x['sourceURL'],'checkedAt':x['checkedAt'],'value':x['value']} for r,x in zip(candidates,available)]
  rows.append({'label':LABELS.get(key,key),'value':('Oui' if value else 'Non') if isinstance(value,bool) else json.dumps(value,ensure_ascii=False) if not isinstance(value,str) else value})
 if component['category']=='ram' and not all(k in common for k in ['capacityGB','memorySticks','memoryType','memorySpeedMTs','casLatency']):return None,None
 if component['category']=='storage' and 'capacityGB' not in common:return None,None
 common.update(manufacturerModel=model,detailLevel='partial',description=model+'. Plusieurs références commerciales correspondent exactement aux attributs archivés. Seules leurs caractéristiques publiées communes sont renseignées ; la révision et le MPN restent à confirmer.')
 sources=list({s['url']:s for r in candidates for s in r['sources']}.values());codes=[r['mpn'] for r in candidates]
 result={'identityKind':'manufacturer-model','manufacturerModel':model,'mpn':'','identityNote':'Modèle documenté avec variantes commerciales non départagées. Famille, génération, capacité, composition, débit, CAS et finition correspondent aux références candidates ; aucun MPN unique n’est affirmé.','sources':sources,'groups':[{'title':'Références candidates du modèle exact','rows':[{'label':'MPN candidat','value':r['mpn']+' — '+r['url']} for r in candidates]},{'title':'Caractéristiques identiques dans toutes les références candidates','rows':rows},{'title':'Caractéristiques restant à départager','rows':[{'label':'Révision / champs variables ou non publiés partout','value':', '.join(LABELS.get(k,k) for k in differences) or 'MPN commercial uniquement'}]}],'patch':common,'offers':[],'notes':['Références candidates : '+', '.join(codes)+'.','Aucun prix n’est transféré entre ces références. Les caractéristiques variables ou absentes d’un candidat ne sont pas considérées comme confirmées.'],'fieldEvidence':evidence}
 audit={'id':component['id'],'manufacturerModel':model,'candidateMPNs':codes,'candidateProofs':proofs,'excludedFields':differences,'clearTypedFields':[k for k in differences if any(k in r['patch'] for r in candidates)]}
 return result,audit
