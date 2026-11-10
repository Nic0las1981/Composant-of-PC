import type {Component} from '../data/catalog.ts';
import type {VerifiedProduct} from '../data/verifiedTypes.ts';

export interface CompatibilityEvidence {field:keyof Component; value:unknown; group:string; label:string; sourceValue:string}
export interface CompatibilityExtraction {patch:Partial<Component>; evidence:CompatibilityEvidence[]; conflicts:Array<{field:keyof Component; values:unknown[]; existing?:unknown}>}
const norm=(v:string)=>v.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const number=(v:string)=>Number(v.replace(/[\s\u00a0\u202f]/g,'').replace(',','.'));
function quantity(v:string,unit:RegExp,min=0,max=Infinity):number|undefined {
  const m=v.trim().match(new RegExp('^(\\d+(?:[ .,\\u00a0\\u202f]\\d+)*)\\s*'+unit.source+'$','i'));
  if(!m)return;
  const n=number(m[1]);return Number.isFinite(n)&&n>=min&&n<=max?n:undefined;
}
const yes=(v:string)=>/^(oui|yes)$/i.test(v.trim());
const no=(v:string)=>/^(non|no)$/i.test(v.trim());
const count=(v:string,min=0,max=16)=>/^\d+$/.test(v.trim())&&Number(v)>=min&&Number(v)<=max?Number(v):undefined;

/** Fill missing metadata from labelled, already reviewed primary-page rows.
 * Never upgrade identity, overwrite existing values, infer CPU watts from TDP,
 * use packing dimensions, infer board RAM from its CPU limit, or read adverts.
 * The caller must apply the reviewed product's explicit patch before this step.
 */
export function extractVerifiedCompatibility(component:Component,product:VerifiedProduct|undefined):CompatibilityExtraction {
  const result:CompatibilityExtraction={patch:{},evidence:[],conflicts:[]};
  if(!product||!component.manufacturerPartNumber||norm(component.manufacturerPartNumber)!==norm(product.mpn))return result;
  const candidates=new Map<keyof Component,CompatibilityEvidence[]>();
  const add=(field:keyof Component,value:unknown,group:string,label:string,sourceValue:string)=>{
    if(value===undefined)return;
    const values=candidates.get(field)??[];values.push({field,value,group,label,sourceValue});candidates.set(field,values);
  };
  const profileEvidence:CompatibilityEvidence[]=[];
  const deniedProfiles=new Set<string>();
  for(const group of product.groups){
    const dimensionRows:CompatibilityEvidence[]=[];
    for(const row of group.rows){
      const label=norm(row.label),value=row.value;
      const put=(field:keyof Component,v:unknown)=>add(field,v,group.title,row.label,value);
      if(['gpu','psu','storage'].includes(component.category)&&['longueur','longueurduproduit','largeur','hauteur','profondeur'].includes(label)){
        const dimension=quantity(value,/(?:mm|cm)/,0.5,1000);
        if(dimension!==undefined)dimensionRows.push({field:'lengthMm',value:dimension*(/cm$/i.test(value.trim())?10:1),group:group.title,label:row.label,sourceValue:value});
      }
      if(component.category==='motherboard'){
        if(['nombredeslotsm2','nombredemplacementsm2m'].includes(label))put('m2Slots',count(value,0,12));
        if(['nombredemplacementsmemoire','nombredelogementspourmemoire'].includes(label))put('memorySlots',count(value,1,16));
        if(label==='formatdememoire'){
          const count=value.match(/^(\d+)\s*[x×]\s*DIMM\b/i);if(count)put('memorySlots',Number(count[1]));
        }
        if(['memoireinternemaximale','capacitemaximalederam'].includes(label))put('maxMemoryGB',quantity(value,/(?:Go|GB)/,1,4096));
        if(['capacitemaximalederamparslot','memoireinternemaximaleparemplacement'].includes(label))put('maxMemoryPerSlotGB',quantity(value,/(?:Go|GB)/,1,1024));
        if(['typedememoire','typesdememoireprisencharge'].includes(label)&&/^DDR[45](?:-SDRAM)?$/i.test(value))put('memoryType',value.toUpperCase().slice(0,4));
      }
      if(component.category==='ram'){
        if(['tensiontestee','tension','memoiredetension','tensiondelamemoire','tensionmemoire'].includes(label))put('memoryVoltageV',quantity(value,/(?:V|Volts?|Volt\(s\))/,0.8,2));
        if(label==='profils'){
          const profiles=[/\bXMP\b/i.test(value)&&'XMP',/\bEXPO\b/i.test(value)&&'EXPO'].filter(Boolean);
          for(const profile of profiles)profileEvidence.push({field:'memoryProfile',value:profile,group:group.title,label:row.label,sourceValue:value});
        }
        for(const [mode,labels] of Object.entries({EXPO:['compatibleamdexpo','amdexpoprofilsetenduspourloverclocking','profilsetendusdamdpourloverclockingexpo'],XMP:['modulexmpdintel','profildememoireintelextremexmp']})){
          if(!labels.includes(label))continue;
          if(yes(value))profileEvidence.push({field:'memoryProfile',value:mode,group:group.title,label:row.label,sourceValue:value});
          if(no(value))deniedProfiles.add(mode);
        }
        // On-die ECC, SPD and VPP are deliberately not treated as host ECC,
        // tested voltage, or XMP/EXPO support.
      }
      if(component.category==='gpu'){
        if(['consommation','consommationelectrique','consommationelectriquemax','consommationdenergie','puissancecartetbp'].includes(label))put('powerW',quantity(value,/W/,10,1000));
        if(['alimentationrecommandee','alimentationminimale','alimentationminimaledusysteme','alimentationminimumsupportee'].includes(label))put('recommendedPsuW',quantity(value,/W/,100,2000));
      }
      if(['gpu','psu','cooler'].includes(component.category)){
        if(label==='nombredeventilateurs'){
          const n=quantity(value,/(?:ventilateurs?|ventilateur\(s\))?/,1,12);if(n!==undefined&&Number.isInteger(n))put('fanCount',n);
        }
        if(['diametreduventilateur','diametreventilateur'].includes(label)){
          const d=quantity(value,/(?:mm|cm)/,1,300);if(d!==undefined)put('fanSizeMm',d*(/cm$/i.test(value.trim())?10:1));
        }
      }
      if(component.category==='cooler'&&component.coolingType==='air'&&label==='hauteurventilateurinclus')put('heightMm',quantity(value,/mm/,10,250));
      if(component.category==='case'){
        if(['longueurmaxcartegraphique','longueurmaximalecartegraphique'].includes(label))put('maxGpuLengthMm',quantity(value,/mm/,50,800));
        if(['hauteurmaxventilateurcpu','hauteurmaximaleventilateurcpu'].includes(label))put('maxCoolerHeightMm',quantity(value,/mm/,10,300));
        const fields:Record<string,keyof Component>={hauteur:'heightMm',largeur:'widthMm',profondeur:'depthMm'};
        if(fields[label])put(fields[label],quantity(value,/mm/,50,1500));
      }
    }
    // Retail feeds rotate the width/height/depth axes for GPUs and PSUs.
    // Require all three product dimensions within one source group, then
    // normalize axes only where an existing length or the sourced chassis
    // dimensions make the orientation unambiguous.
    const dimensions=[...new Set(dimensionRows.map(r=>r.value as number))].sort((a,b)=>a-b);
    const labels=new Set(dimensionRows.map(r=>norm(r.label)));
    if(dimensions.length===3&&labels.size>=3){
      const [small,middle,large]=dimensions;
      const evidence=dimensionRows.map(r=>`${r.label}: ${r.sourceValue}`).join(' · ');
      const derived=(field:keyof Component,value:number)=>add(field,value,group.title,'Dimensions produit — axes normalisés',evidence);
      if(component.category==='gpu'&&component.lengthMm!==undefined&&Math.abs(large-component.lengthMm)<0.2&&small>=10&&small<=100&&middle>=60&&middle<=250){derived('thicknessMm',small);derived('heightMm',middle);}
      if(component.category==='psu'){
        const height=component.psuFormat==='ATX'?dimensions.find(v=>v>=85&&v<=86):component.psuFormat==='SFX'?dimensions.find(v=>v>=63&&v<=64):undefined;
        const width=component.psuFormat==='ATX'?dimensions.find(v=>v===150):component.psuFormat==='SFX'?dimensions.find(v=>v===125):undefined;
        if(height!==undefined&&width!==undefined){const depth=dimensions.find(v=>v!==height&&v!==width);if(depth!==undefined){derived('heightMm',height);derived('widthMm',width);derived('depthMm',depth);}}
      }
      if(component.category==='storage'&&component.storageInterface==='M.2 NVMe'&&small>=0.5&&small<=30&&middle>=20&&middle<=30&&large>=30&&large<=115){derived('lengthMm',large);derived('widthMm',middle);derived('heightMm',small);}
    }
  }
  if(profileEvidence.length){
    const modes=new Set(profileEvidence.map(r=>r.value));
    if([...modes].some(mode=>deniedProfiles.has(String(mode))))result.conflicts.push({field:'memoryProfile',values:[...modes,...[...deniedProfiles].map(mode=>`explicitly_not_supported:${mode}`)]});
    else{
      const value=modes.size===2?'EXPO/XMP':profileEvidence[0].value;
      for(const evidence of profileEvidence)add('memoryProfile',value,evidence.group,evidence.label,evidence.sourceValue);
    }
  }
  for(const [field,evidence] of candidates){
    const values=[...new Set(evidence.map(item=>JSON.stringify(item.value)))].map(v=>JSON.parse(v));
    if(values.length!==1){result.conflicts.push({field,values,existing:component[field]});continue;}
    if(component[field]!==undefined){
      if(JSON.stringify(component[field])!==JSON.stringify(values[0]))result.conflicts.push({field,values,existing:component[field]});
      continue;
    }
    Object.assign(result.patch,{[field]:values[0]});result.evidence.push(...evidence);
  }
  return result;
}
