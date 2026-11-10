import type {Component} from '../data/catalog.ts';

const labels: Partial<Record<keyof Component,string>> = {
  socket:'socket',supportedMemory:'générations mémoire supportées',powerW:'puissance de référence',
  memoryType:'génération mémoire',formFactor:'format',maxMemoryGB:'capacité mémoire maximale',memorySlots:'nombre de slots mémoire',m2Slots:'nombre de ports M.2',
  lengthMm:'longueur',heightMm:'hauteur',widthMm:'largeur',depthMm:'profondeur',thicknessMm:'épaisseur',recommendedPsuW:'alimentation recommandée',
  capacityGB:'capacité',memorySticks:'composition du kit',memorySpeedMTs:'débit mémoire',casLatency:'latence CAS',memoryVoltageV:'tension mémoire',memoryProfile:'profil mémoire',memoryModuleKind:'type de module',
  storageInterface:'interface de stockage',wattage:'puissance nominale',psuFormat:'format alimentation',
  supportedSockets:'sockets compatibles',coolingType:'type de refroidissement',radiatorSizeMm:'format radiateur',radiatorThicknessMm:'épaisseur radiateur',
  supportedFormFactors:'formats de cartes mères',maxGpuLengthMm:'dégagement GPU',maxCoolerHeightMm:'dégagement ventirad',supportedPsuFormats:'formats alimentation',
};
const required: Record<Component['category'],Array<keyof Component>> = {
  cpu:['socket','supportedMemory','powerW'],
  motherboard:['socket','memoryType','formFactor','maxMemoryGB','memorySlots','m2Slots'],
  gpu:['lengthMm','heightMm','thicknessMm','powerW','recommendedPsuW'],
  ram:['capacityGB','memorySticks','memoryType','memorySpeedMTs','casLatency','memoryVoltageV','memoryProfile','memoryModuleKind'],
  storage:['capacityGB','storageInterface','lengthMm','widthMm','heightMm'],
  psu:['wattage','psuFormat','heightMm','widthMm','depthMm'],
  cooler:['supportedSockets','coolingType'],
  case:['supportedFormFactors','maxGpuLengthMm','maxCoolerHeightMm','supportedPsuFormats'],
};

/** Coverage of the fields used to assess this hardware, not a certification of mounting or of every manufacturer specification. */
export function getMissingCompatibilityFields(component:Component) {
  const fields=[...required[component.category]];
  if(component.category==='cooler') fields.push(...(component.coolingType==='aio'?['radiatorSizeMm','radiatorThicknessMm'] as const:['heightMm'] as const));
  return fields.filter(key=>{
    const value=component[key];
    return value==null || (Array.isArray(value)&&!value.length) || (typeof value==='number'&&(!Number.isFinite(value)||value<0||(value===0&&key!=='m2Slots')));
  }).map(key=>({key,label:labels[key]??key}));
}

export function hasPartialCompatibility(component:Component) {
  return component.detailLevel==='partial' && getMissingCompatibilityFields(component).length>0;
}
