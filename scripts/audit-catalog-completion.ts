/** Read every current ID; never turn a naming match or shared chassis into a SKU. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {catalog} from '../src/data/catalog.ts';
import {verifiedProducts} from '../src/data/verifiedCatalog.ts';
import {getVisualProfile} from '../src/data/visualProfiles.ts';
import {getProductImage} from '../src/data/productImages.ts';
import {catalogTechnicalRequirements,getCatalogCompletion} from '../src/lib/catalogCompletion.ts';

const root=new URL('../',import.meta.url),target=new URL('data/comprehensive-review/',root);
mkdirSync(target,{recursive:true});
const visualEvidence=JSON.parse(readFileSync(new URL('data/individual-review/visual-references.json',root),'utf8')) as {profiles:Array<{ids:string[];inspectedPhoto?:string;manufacturerPhoto?:string;approximateFields?:Record<string,string>}>};
const visuals=new Map(visualEvidence.profiles.flatMap(p=>p.ids.map(id=>[id,p] as const)));
const snapshot=JSON.parse(readFileSync(new URL('data/catalog-source.json',root),'utf8')) as {records:Array<{id:string;sourceType:string;sourceIndex:number;recordHash:string;record:Record<string,unknown>}>};
const archive=new Map(snapshot.records.map(row=>[row.id,row]));
const nameReferenceCandidates=JSON.parse(readFileSync(new URL('data/comprehensive-review/name-reference-candidates.json',root),'utf8')).candidates as Array<{id:string;sourceType:string;originalName:string;candidateCodes:string[]}>;
const nameHints=new Map(nameReferenceCandidates.map(row=>[row.id,row.candidateCodes]));
// Keep changes to the retained identity discriminants visible after source patches.
const archiveComparisons=(c:typeof catalog[number])=>{
 const row=archive.get(c.id);if(!row)return [];
 const raw=row.record,checks:Array<[keyof typeof c,unknown]>=[];
 if(row.sourceType==='internal-hard-drive')checks.push(['capacityGB',raw.capacity]);
 if(row.sourceType==='video-card')checks.push(['capacityGB',raw.memory],['lengthMm',raw.length]);
 if(row.sourceType==='power-supply')checks.push(['wattage',raw.wattage]);
 if(row.sourceType==='motherboard')checks.push(['socket',raw.socket]);
 if(row.sourceType==='memory'){
  const modules=raw.modules as number[]|undefined,speed=raw.speed as number[]|undefined;
  if(modules)checks.push(['capacityGB',modules[0]*modules[1]],['memorySticks',modules[0]]);
  if(speed)checks.push(['memorySpeedMTs',speed[1]],['memoryType',`DDR${speed[0]}`]);
  checks.push(['casLatency',raw.cas_latency]);
 }
 return checks.filter(([field,value])=>value!==null&&value!==undefined&&c[field]!==undefined&&c[field]!==value).map(([field,value])=>({field,archive:value,current:c[field]}));
};
const counter=(values:string[])=>Object.fromEntries([...new Set(values)].sort().map(value=>[value,values.filter(item=>item===value).length]));
const now=Date.now();
const mpnGroups=new Map<string,typeof catalog>();
for(const c of catalog){
 if(!c.manufacturerPartNumber||!verifiedProducts[c.id])continue;
 const key=c.brand.toLowerCase().trim()+':'+c.manufacturerPartNumber.toUpperCase().trim();
 mpnGroups.set(key,[...(mpnGroups.get(key)??[]),c]);
}
const identityFields=['category','capacityGB','memorySticks','memoryType','memorySpeedMTs','casLatency','wattage','socket','finishName','lengthMm','heightMm','thicknessMm'] as const;
const conflictIds=new Set([...mpnGroups.values()].filter(parts=>identityFields.some(field=>new Set(parts.map(c=>c[field]).filter(v=>v!==undefined)).size>1)).flatMap(parts=>parts.map(c=>c.id)));
const records=catalog.map(c=>{
 const p=verifiedProducts[c.id],profile=getVisualProfile(c),evidence=visuals.get(c.id),photo=getProductImage(c);
 const completion=getCatalogCompletion(c,p,{now,identityConflict:conflictIds.has(c.id),visual:{profileId:profile.id,fidelity:profile.fidelity,inspection:evidence?.inspectedPhoto?'visually-inspected':photo?.inspection,referenceURLs:[evidence?.inspectedPhoto,evidence?.manufacturerPhoto,photo?.imageURL].filter((v):v is string=>Boolean(v)),approximateFields:Object.keys(evidence?.approximateFields??{})}});
 const fields=completion.technical.fields;
 return {id:c.id,category:c.category,brand:c.brand,name:c.name,status:completion.status,identity:completion.identity,
  technical:{required:fields.length,evidence:Object.fromEntries(fields.filter(f=>f.state==='documented'||f.state==='conflicting').map(f=>[f.key,{proof:f.proof??null,sourceScope:f.sourceScope??'record',...(f.sourceScope==='field'?{sourceURLs:f.sourceURLs}:{})}])),documented:fields.filter(f=>f.state==='documented').map(f=>f.key),presentUnverified:fields.filter(f=>f.state==='present_unverified').map(f=>f.key),missing:fields.filter(f=>f.state==='missing').map(f=>f.key),conflicting:fields.filter(f=>f.state==='conflicting').map(f=>f.key)},
  pricing:completion.pricing,visual:completion.visual,completeForUserRequest:completion.completeForUserRequest,
  sourceURLs:p?.sources.map(s=>s.url)??[],archive:archive.has(c.id)?{sourceType:archive.get(c.id)!.sourceType,sourceIndex:archive.get(c.id)!.sourceIndex,recordHash:archive.get(c.id)!.recordHash,sourceDiscriminantChanges:archiveComparisons(c),candidateCodesInOriginalName:nameHints.get(c.id)??[],hasOriginalMPN:Boolean(archive.get(c.id)!.record.mpn),hasOriginalProductURL:Boolean(archive.get(c.id)!.record.url)}:null};
});

const groups=[...mpnGroups].filter(([,parts])=>parts.length>1).map(([canonicalIdentity,parts])=>{
 const conflicts=identityFields.filter(field=>new Set(parts.map(c=>c[field]).filter(v=>v!==undefined)).size>1);
 const manufacturerProof=parts.some(c=>verifiedProducts[c.id].sources.some(s=>s.kind==='manufacturer'));
 return {canonicalIdentity,ids:parts.map(c=>c.id),conflictingFields:conflicts,hasManufacturerSource:manufacturerProof,action:conflicts.length?'keep_separate_conflict':manufacturerProof?'same_manufacturer_mpn_requires_variant_confirmation':'same_retailer_mpn_requires_manufacturer_confirmation'};
});
const rawGroups=new Map<string,string[]>();
for(const row of snapshot.records){
 const value=Object.fromEntries(Object.entries(row.record).filter(([key])=>!['price','price_per_gb'].includes(key)).sort(([a],[b])=>a.localeCompare(b)));
 const key=row.sourceType+':'+JSON.stringify(value);rawGroups.set(key,[...(rawGroups.get(key)??[]),row.id]);
}
const indistinguishableArchiveRows=[...rawGroups.values()].filter(ids=>ids.length>1).map(ids=>({ids,name:catalog.find(c=>c.id===ids[0])?.name,reason:'Same retained archive attributes do not establish the same manufacturer SKU; MPN and revisions were discarded upstream.'}));
const identityDiscriminants:Record<string,string>={motherboard:'Exact manufacturer model/part number and any relevant PCB revision have no linked identity evidence.',gpu:'The GPU chip, memory capacity and cooler family do not establish the exact board SKU, finish and OC revision.',ram:'The family, capacity, data rate and CAS do not establish the complete kit MPN, profile, module organisation and finish.',storage:'The family and capacity do not establish the exact SSD MPN, heatsink package and hardware revision.',psu:'Family and wattage do not identify the generation, electrical revision or region-specific SKU.',cooler:'The model name needs a sourced part number including colour, mounting bundle and revision.',case:'The case family needs a sourced variant identifier for panel, finish and bundled fans.'};
const blockerExamples=Object.entries(identityDiscriminants).flatMap(([category,reason])=>records.filter(r=>r.status==='identity_missing'&&r.category===category).slice(0,3).map(r=>({id:r.id,name:r.name,category,reason,sourceIndex:r.archive?.sourceIndex??null})));
const summary={generatedAt:new Date(now).toISOString(),total:records.length,statuses:counter(records.map(r=>r.status)),pricing:counter(records.map(r=>r.pricing.status)),visual:counter(records.map(r=>r.visual.status)),completeForUserRequest:records.filter(r=>r.completeForUserRequest).length,byCategory:Object.fromEntries([...new Set(records.map(r=>r.category))].map(category=>[category,counter(records.filter(r=>r.category===category).map(r=>r.status))])),provenAliasGroups:0,manufacturerAliasCandidates:groups.filter(g=>g.action==='same_manufacturer_mpn_requires_variant_confirmation').length,conflictingMPNGroups:groups.filter(g=>g.action==='keep_separate_conflict').length,indistinguishableArchiveGroups:indistinguishableArchiveRows.length};
const unresolvedByBrand=Object.entries(counter(records.filter(r=>r.status==='identity_missing').map(r=>r.brand))).sort(([,a],[,b])=>b-a).map(([brand,count])=>({brand,count}));
const resolvedNameCandidates=nameReferenceCandidates.map(candidate=>{const record=records.find(record=>record.id===candidate.id)!;return {...candidate,currentStatus:record.status,currentMPN:record.identity.mpn,matchedPrimaryRecord:record.identity.matchedPrimaryRecord,sourceURLs:record.sourceURLs};});
const report={summary,unresolvedByBrand,nameReferenceCandidates:resolvedNameCandidates,method:'Every current catalogue ID evaluated individually against a finite product-sheet checklist. Ready concerns sourced technical fields only; price and visual evidence have independent statuses. No IDs or prices are merged by this audit.',requirements:catalogTechnicalRequirements,aliasGroups:groups,indistinguishableArchiveRows,blockerExamples,records};
writeFileSync(new URL('identity-audit.json',target),JSON.stringify(report)+'\n');
writeFileSync(new URL('summary.json',target),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
