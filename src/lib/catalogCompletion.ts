import type {Component,CategoryId} from '../data/catalog.ts';
import type {VerifiedProduct,VerifiedFieldEvidence} from '../data/verifiedTypes.ts';
import {catalogFieldEvidence} from '../data/catalogFieldEvidence.ts';
import {isCurrentVerifiedOffer} from './verifiedOffers.ts';

export type CompletionStatus='identity_missing'|'source_missing'|'technical_missing'|'ready';
export interface TechnicalRequirement {key:string;label:string;componentKey?:keyof Component;rowLabels:string[]}
export type FieldEvidence=VerifiedFieldEvidence;
export interface VisualCompletionInput {profileId?:string;fidelity?:string;referenceURLs?:string[];approximateFields?:string[]}
export interface FieldCompletion {key:string;label:string;state:'missing'|'present_unverified'|'documented'|'conflicting';value?:unknown;proof?:'explicit_patch'|'technical_row'|'supplied_evidence';sourceURLs:string[];sourceScope?:'field'|'record'}
export interface CompletionSourceMap {fields?:Record<string,string[]>;groups?:Record<string,string[]>}
const norm=(value:string)=>value.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const field=(key:string,label:string,componentKey?:keyof Component,rowLabels:string[]=[]):TechnicalRequirement=>({key,label,componentKey,rowLabels});
const dimensions=[field('length','Longueur','lengthMm',['Longueur','Longueur du produit','Length']),field('height','Hauteur','heightMm',['Hauteur','Height']),field('width','Largeur','widthMm',['Largeur','Width'])];

/** A finite product-sheet checklist, distinct from compatibility and visual quality.
 * Optional implementation details such as RAM die/rank can change within one MPN
 * and are deliberately not required to claim that this checklist is documented.
 */
export const catalogTechnicalRequirements:Record<CategoryId,TechnicalRequirement[]>={
 cpu:[field('socket','Socket','socket',['Socket','Socket du processeur']),field('cores','Cœurs',undefined,['Nombre de cœurs','Nombre de coeurs','Cœurs','Core Count']),field('threads','Threads',undefined,['Nombre de threads','Threads']),field('baseClock','Fréquence de base',undefined,['Fréquence de base','Base Clock']),field('boostClock','Fréquence boost',undefined,['Fréquence boost','Fréquence Turbo','Max. Boost Clock']),field('cache','Cache',undefined,['Cache','Cache L3','Mémoire cache du processeur']),field('thermalPower','Puissance nominale (TDP/PBP)',undefined,['TDP','Enveloppe thermique (TDP, Thermal Design Power)','TDP nominal']),field('electricalPower','Puissance électrique de référence','powerW'),field('memory','Générations mémoire','supportedMemory',['Contrôleur mémoire','Types de mémoires pris en charge par le processeur']),field('memoryChannels','Canaux mémoire','memoryChannels',['Canaux mémoire']),field('graphics','Circuit graphique intégré',undefined,['Contrôleur graphique intégré','Graphiques intégrés','Integrated Graphics'])],
 motherboard:[field('socket','Socket','socket',['Socket','Socket du processeur']),field('chipset','Chipset',undefined,['Chipset','Chipset de la carte mère']),field('formFactor','Format','formFactor',['Format de carte mère']),field('memoryType','Génération mémoire','memoryType',['Type de mémoire','Types de mémoire pris en charge']),field('memoryCapacity','Capacité mémoire maximale','maxMemoryGB',['Mémoire interne maximale','Capacité maximale de RAM']),field('memorySlots','Emplacements mémoire','memorySlots',["Nombre d'emplacements mémoire"]),field('m2','Emplacements M.2','m2Slots',['Nombre de slot(s) M.2',"Nombre d'emplacements M.2 (M)"]),field('storagePorts','Ports SATA et stockage',undefined,['Stockage','Connectique stockage','Connecteurs de stockage','Nombre de connecteurs SATA III']),field('pcie','Emplacements PCIe',undefined,['Nombre et Type de slots','Slots PCIe','Emplacements PCIe','Connecteur(s) graphique']),field('rearIO','Connectique arrière',undefined,['Connectique externe','Connectique arrière','Panneau arrière']),field('internalIO','Connectique interne',undefined,['Connecteurs internes','Connectique interne']),field('network','Réseau',undefined,['Réseau','Réseau filaire','LAN','Ethernet LAN']),field('audio','Audio',undefined,['Audio','Chipset audio','Puce audio']),field('cpuSupport','Compatibilité CPU et BIOS',undefined,['Support CPU','CPU Support','BIOS et CPU','Processeurs compatibles']),field('boardDimensions','Dimensions physiques',undefined,['Dimensions','Dimensions de la carte'])],
 gpu:[field('gpuChip','Puce graphique',undefined,['Chipset graphique','Processeur graphique','GPU','Puce graphique']),field('vram','Capacité VRAM','capacityGB',['Taille mémoire vidéo','Mémoire carte graphique distincte']),field('vramType','Type de VRAM',undefined,['Type de mémoire','Type de mémoire de l’adaptateur graphique','Type de mémoire de la carte graphique']),field('memoryBus','Bus mémoire',undefined,['Interface mémoire','Mémoire Bus','Bus mémoire']),field('interface','Interface PCIe',undefined,["Type d'interface",'Interface']),field('boostClock','Fréquence boost',undefined,['Fréquence boost','Fréquence boost maximale']),field('length','Longueur','lengthMm'),field('height','Hauteur','heightMm'),field('thickness','Épaisseur','thicknessMm'),field('boardPower','Puissance carte','powerW',['Puissance carte (TBP)','Consommation']),field('psu','Alimentation recommandée','recommendedPsuW',['Alimentation recommandée','Alimentation minimale du système']),field('powerConnectors','Connecteurs alimentation',undefined,['Connecteur(s) alimentation',"Connecteurs d'alimentation supplémentaires",'Connecteur']),field('displayOutputs','Sorties vidéo',undefined,['Sorties vidéo','Sorties','Connectique vidéo']),field('fans','Ventilateurs','fanCount',['Nombre de ventilateurs'])],
 ram:[field('capacity','Capacité totale','capacityGB',['Capacité','Mémoire interne']),field('kit','Composition du kit','memorySticks',['Composition du kit','Disposition de la mémoire (modules x dimensions)']),field('generation','Génération DDR','memoryType',['Type de mémoire','Type de mémoire interne']),field('rate','Débit testé','memorySpeedMTs',['Débit testé','Fréquence de la mémoire']),field('cas','Latence CAS','casLatency',['Latence testée','Latence CAS']),field('voltage','Tension testée','memoryVoltageV',['Tension testée','Tension mémoire']),field('profile','Profils mémoire','memoryProfile',['Profils','Profils mémoire']),field('moduleType','Type de module','memoryModuleKind',['Type de module','Format']),field('hostEcc','ECC système distinct du on-die ECC','memoryEcc',['ECC système','ECC externe']),field('height','Hauteur du module','heightMm',['Hauteur']),field('heatspreader','Dissipateur','memoryHeatspreader',['Dissipateur thermique','Dissipateur'])],
 storage:[field('capacity','Capacité','capacityGB',['Capacité','Capacité du Solid State Drive (SSD)']),field('interface','Interface PCIe/SATA','storageInterface',['Interface']),field('interfaceGeneration','Génération et lignes PCIe',undefined,['Interface PCIe','Interface détaillée','Interface et protocole','Version PCI Express']),field('formFactor','Format du SSD',undefined,['Format M.2','Facteur de forme SSD','Format']),...dimensions,field('read','Lecture séquentielle',undefined,['Lecture séquentielle','Vitesse en lecture','Vitesse de lecture']),field('write','Écriture séquentielle',undefined,['Écriture séquentielle','Vitesse en écriture',"Vitesse d'écriture"]),field('nand','Type NAND',undefined,['Type de mémoire Flash','Type NAND','Type de mémoire flash']),field('endurance','Endurance TBW',undefined,['Endurance TBW','Endurance','TBW','Indice TBW']),field('warranty','Garantie',undefined,['Garantie','Garantie commerciale','Garantie fabricant']),field('heatsink','Version avec ou sans dissipateur',undefined,['Dissipateur','Type de refroidissement','Dissipateur thermique'])],
 psu:[field('power','Puissance nominale','wattage',['Puissance totale','Puissance']),field('format','Format','psuFormat',['Format Alimentation']),field('height','Hauteur','heightMm'),field('width','Largeur','widthMm'),field('depth','Profondeur','depthMm'),field('atx','Révision ATX',undefined,['Version ATX','Normes','Norme ATX']),field('efficiency','Certification et rendement',undefined,['Certification','Certification 80 PLUS','Rendement']),field('modularity','Modularité',undefined,['Câblage','Type de câblage','Modularité']),field('rail12v','Puissance du rail 12 V',undefined,['Puissance combinée (+12 V)','Rail +12 V']),field('connectors','Connecteurs alimentation',undefined,['Connecteurs','Connectique','Connecteurs PCIe','Connecteur(s) PCI-Express']),field('fan','Ventilateur','fanSizeMm',['Ventilateur','Diamètre du ventilateur']),field('protections','Protections',undefined,['Protections','Protections électriques']),field('warranty','Garantie',undefined,['Garantie','Garantie commerciale'])],
 cooler:[field('type','Type de refroidissement','coolingType',['Type de refroidissement']),field('sockets','Fixations et sockets','supportedSockets',['Sockets compatibles','Compatibilité socket']),field('dimensions','Dimensions de l’ensemble',undefined,['Dimensions de l’ensemble','Dimensions avec ventilateurs']),field('fans','Nombre de ventilateurs','fanCount',['Nombre de ventilateurs']),field('fanSize','Diamètre des ventilateurs','fanSizeMm',['Diamètre du ventilateur']),field('rpm','Vitesse des ventilateurs',undefined,['Vitesse maximale','Vitesse de rotation','Vitesse du ventilateur']),field('noise','Bruit déclaré et conditions',undefined,['Niveau sonore','Bruit annoncé','Bruit']),field('airflow','Débit d’air',undefined,['Débit maximal','Débit d’air','Airflow']),field('pressure','Pression statique',undefined,['Pression maximale','Pression statique']),field('connectors','Connecteurs',undefined,['Connecteurs','Connecteur du ventilateur'])],
 case:[field('formFactors','Formats de cartes mères','supportedFormFactors',['Format de carte mère']),field('psuFormats','Formats alimentation','supportedPsuFormats',['Format Alimentation']),field('height','Hauteur','heightMm'),field('width','Largeur','widthMm'),field('depth','Profondeur','depthMm'),field('gpuClearance','Dégagement GPU','maxGpuLengthMm',['Longueur max. carte graphique']),field('coolerClearance','Dégagement ventirad','maxCoolerHeightMm',['Hauteur max. ventilateur CPU']),field('psuClearance','Longueur maximale alimentation',undefined,['Longueur max. alimentation']),field('radiators','Emplacements radiateurs','radiatorSupport',['Radiateurs','Radiateurs compatibles']),field('fansIncluded','Ventilateurs inclus','fanCount',['Ventilateurs inclus']),field('fanMounts','Emplacements ventilateurs',undefined,['Emplacements ventilateurs','Descriptif ventilation']),field('drives','Baies de stockage',undefined,['Baies de stockage','Emplacements disques','Baies']),field('frontIO','Connectique façade',undefined,['Connectique façade','Connecteurs en façade'])],
};

// Explicit category aliases. Generic prose/marketing labels are intentionally excluded.
const aliases:Partial<Record<CategoryId,Record<string,string[]>>>={
 cpu:{socket:['CPU Socket','Processor Socket','Support du processeur'],cores:['Nombre de core','Total Cores','# of CPU Cores'],threads:['Total Threads','# of Threads'],baseClock:['Fréquence CPU','Processor Base Frequency','Base Clock'],boostClock:['Fréquence en mode Turbo','Max Turbo Frequency','Max. Boost Clock'],cache:['Total L3 Cache','L3 Cache'],thermalPower:['Default TDP','Puissance de base du processeur (PBP)'],electricalPower:['Puissance électrique maximale Turbo (MTP)'],memory:['Memory Types'],memoryChannels:['Type de contrôleur mémoire','Max # of Memory Channels'],graphics:['Processor Graphics','Graphics Model']},
 motherboard:{socket:['Support du processeur','Socket de processeur (réceptable de processeur)'],chipset:['Carte mère chipset'],formFactor:['Elément de forme de carte mère','Form Factor'],memorySlots:['Nombre de logements pour mémoire','Memory Slots'],memoryCapacity:['Maximum Memory','Maximum Memory Capacity'],m2:['M.2 Slots'],storagePorts:['Connecteurs Disques','Stockage SATA','Stockage et restrictions','Storage'],pcie:['PCIe','PCIe et partage des lignes','Slots PCIe physiques','Expansion Slots'],rearIO:['Connecteurs panneau arrière','Back Panel Ports','Rear I/O Ports'],internalIO:['Connecteurs additionnels','Internal I/O Connectors','Internal Connectors'],network:['Nombre de ports/Contrôleur Ethernet','Contrôleur de réseau local (LAN)','LAN Controller'],audio:['Audio Codec'],cpuSupport:['Processeurs / socket','Socket et processeurs','CPU'],boardDimensions:['Format et dimensions','Dimensions de la carte mère']},
 gpu:{gpuChip:['Graphics Processing Unit'],vram:['Memory Size','Taille mémoire'],vramType:['Memory Type'],memoryBus:['Memory Bus'],interface:['Interface PCIe','Bus Standard'],length:['Longueur','Length'],height:['Hauteur','Height'],thickness:['Épaisseur','Thickness'],boostClock:['Fréquences constructeur','Fréquence boost maximale déclarée','Boost Clock'],boardPower:['Consommation annoncée de la carte','Power Consumption','Total Board Power'],psu:['Alimentation système recommandée','Recommended PSU'],powerConnectors:['Connecteurs d’alimentation','Connecteur d’alimentation','Power Connectors'],displayOutputs:['Output','Display Outputs'],fans:['Number of Fans']},
 ram:{capacity:['Capacité totale','Capacité du kit','Capacité mémoire','Memory Size','Capacity'],kit:['Nombre de barrettes','Modules','Conception de la mémoire (modules x taille)','Disposition de la mémoire (modules x taille)','Memory Configuration'],generation:['Memory Type','Type'],rate:['Fréquence(s) Mémoire','Norme mémoire','Fréquence','Vitesse','Vitesse d’horloge de la mémoire','Vitesse d’horloge mémoire','Débit de transfert des données de mémoire','Tested Speed'],cas:['CAS Latency','Latence CAS (CL)','Tested Latency'],voltage:['Tension','Voltage','Mémoire de tension','Tension de la mémoire','Tested Voltage','Ces timings sont supportés avec une tension minimale de :','Ces timings sont compatibles avec une tension minimale de'],profile:['Profils supportés','Profil(s) supporté(s)','Performance Profile'],moduleType:['Format mémoire','Type de module mémoire','Module Type'],hostEcc:['ECC','Host ECC','System ECC'],height:['Hauteur avec dissipateur','Module Height'],heatspreader:['Radiateur','Refroidissement','Type de refroidissement','Système de refroidissement','Heat Spreader']},
 storage:{capacity:['SSD, capacité','SSD Capacity','Storage Capacity'],interface:['Interface avec l’ordinateur','Interface interne','SSD Interface'],interfaceGeneration:['Interface avec l’ordinateur','Interface interne','Interface'],formFactor:['Facteur de forme','Facteur de forme du disque SSD','Format de Disque','Form Factor'],read:['Sequential Read','Sequential Read Speed'],write:['Sequential Write','Sequential Write Speed'],nand:['Type de mémoire','Mémoire flash','NAND Flash'],endurance:['Endurance (TBW)','Classement TBW','Total Bytes Written'],warranty:['Limited Warranty','Warranty'],heatsink:['Heatsink']},
 psu:{power:['Puissance continue','Continuous Power','Total Power'],format:['PSU Form Factor'],height:['Hauteur','Height'],width:['Largeur','Width'],depth:['Profondeur','Depth'],atx:['Normes document V1/25','ATX Version'],efficiency:['Norme(s) 80 PLUS / Cybenetics','Efficiency Rating'],modularity:['Modulaire','Modular'],rail12v:['+12V Rail','Combined +12V'],connectors:['Connecteur(s) alimentation','Power Connectors'],fan:['Taille de ventilateur','Fan Size'],protections:['Protection Functions'],warranty:['Warranty','Garantie fabricant','Garantie constructeur']},
 cooler:{sockets:['Support du processeur','Sockets natifs','Sockets','CPU Socket Compatibility'],dimensions:['Encombrement avec ventilateurs','Dimensions L × W × H'],fans:['Ventilateurs','Ventilateurs fournis','Ventilateurs radiateur'],fanSize:['Diamètre ventilateur','Fan Diameter'],rpm:['Vitesse de rotation maxi','Vitesse','Fan Speed'],noise:['Niveau sonore maxi','Noise Level'],airflow:['Débit d’air maxi','Max. Airflow'],pressure:['Pression','Static Pressure'],connectors:['Connecteur(s)','Fan Connector']},
 case:{formFactors:['Cartes mères','Motherboard Support'],psuFormats:['PSU Support'],height:['Height'],width:['Width'],depth:['Depth'],gpuClearance:['Dégagement GPU','GPU maximal','Max GPU Length'],coolerClearance:['Dégagement ventirad','Ventirad maximal','Max CPU Cooler Height'],psuClearance:['Max PSU Length'],radiators:['Compatibilité radiateur AIO','Radiateurs haut/façade','Radiator Support'],fansIncluded:['Included Fans'],fanMounts:['Fan Support'],drives:['Descriptif baies','Drive Bays'],frontIO:['Connecteur(s) disponible(s)','Front I/O']},
};
for(const [category,keys] of Object.entries(aliases))for(const requirement of catalogTechnicalRequirements[category as CategoryId])requirement.rowLabels.push(...(keys[requirement.key]??[]));

// A combined row supplies a field only when its value explicitly identifies it.
function combinedRow(category:CategoryId,key:string,label:string,value:string):string|undefined{
 const l=norm(label);const v=value.replace(/,/g,'.');let match:RegExpMatchArray|null;
 if(category==='ram'){
  if(['capacite','capacitetotale','capacitedukit','capacitedumodule','densite'].includes(l)&&key==='kit'&&(match=v.match(/\b(\d+)\s*[x×]\s*\d+(?:\.\d+)?\s*(?:Go|GB)\b/i)))return match[1];
  if(l==='debitettimingstestes'){
   if(key==='generation'&&(match=v.match(/\bDDR[345]\b/i)))return match[0];
   if(key==='rate'&&(match=v.match(/\bDDR[345]-(\d{3,5})\b/i)))return `${match[1]} MT/s`;
   if(key==='voltage'&&(match=v.match(/\b(\d+(?:\.\d+)?)\s*V\b/i)))return `${match[1]} V`;
   if(key==='cas'&&(match=v.match(/(?:\bCL\s*|[·;]\s*)(\d{1,2})(?:-\d{1,2}){2,3}\b/i)))return `CL${match[1]}`;
  }
  if(l==='formatmemoire'&&key==='hostEcc'&&/\bnon-ECC\s+(?:systeme|système)\b/i.test(value))return 'Non';
 }
 if(category==='motherboard'){
  if(l==='memoire'){
   if(key==='memoryType'&&(match=v.match(/\bDDR[345]\b/i)))return match[0];
   if(key==='memorySlots'&&(match=v.match(/\b(\d+)\s*[x×]\s*(?:DDR[345]|DIMM)\b/i)))return match[1];
   if(key==='memoryCapacity'&&(match=v.match(/\b(\d+)\s*(?:Go|GB)\s*(?:maximum|max\b)/i)))return `${match[1]} GB`;
   if(key==='memoryCapacity'&&(match=v.match(/Maximum Memory Capacity\s*(\d+)\s*GB\b/i)))return `${match[1]} GB`;
  }
  if(['stockage','stockageetrestrictions','stockagem2'].includes(l)&&key==='m2'&&(match=v.match(/\b(\d+)\s*[x×]\s*M\.2\b/i)))return match[1];
  if(['format','formatetdimensions'].includes(l)){
   if(key==='formFactor'&&(match=v.match(/\b(?:E-ATX|Micro[ -]?ATX|Mini[ -]?ITX|ATX)\b/i)))return match[0];
   if(key==='boardDimensions'&&/\d+(?:\.\d+)?\s*(?:mm)?\s*[x×]\s*\d+(?:\.\d+)?\s*mm\b/i.test(v))return value;
  }
 }
 if(category==='storage'){
  if(l==='formatetinterface'){
   if(key==='formFactor'&&(match=v.match(/\bM\.2\s+\d{4,5}\b/i)))return match[0];
   if(key==='interfaceGeneration'&&(match=v.match(/\bPCI(?:e|\s+Express)\s*(\d(?:\.\d)?)\s*[x×]\s*(\d+)\b/i)))return `PCIe ${match[1]} x${match[2]}`;
  }
  if(l==='lectureecrituresequentiellemaximale'&&(key==='read'||key==='write')&&(match=v.match(/^([\d \u00a0\u202f]+)\s*\/\s*([\d \u00a0\u202f]+)\s*(Mo\/s|MB\/s)$/i)))return `${match[key==='read'?1:2].trim()} ${match[3]}`;
  if(l==='enduranceetgarantielimitee'){
   if(key==='endurance'&&/\d[\d \u00a0\u202f]*\s*(?:To|TB)\s+ecrits.*TBW/i.test(value.normalize('NFD').replace(/\p{Diacritic}/gu,'')))return value;
   if(key==='warranty'&&/\d+\s*(?:ans?|years?)\b/i.test(value))return value;
  }
  if(l==='refroidissement'&&key==='heatsink'&&/^module nu\b/i.test(value))return value;
 }
 if(category==='gpu'&&l==='memoirevideo'){
  if(key==='vram'&&(match=v.match(/\b(\d+)\s*(?:Go|GB)\b/i)))return `${match[1]} GB`;
  if(key==='vramType'&&(match=v.match(/\bGDDR[34567]X?\b/i)))return match[0];
  if(key==='memoryBus'&&(match=v.match(/\bbus\s*(\d+)\s*bits?\b/i)))return `${match[1]} bits`;
 }
 return undefined;
}

/** Only scalar, explicitly equivalent values are coalesced. No binary/decimal
 * capacity conversion, SPD/tested-rate conflation, or fuzzy semantic matching. */
function scalarKey(category:CategoryId,key:string,value:string):string{
 const v=value.trim().replace(/^[•·]\s*/, '').replace(/,/g,'.').replace(/(?<=\d)[ \u00a0\u202f](?=\d)/g,'');let m:RegExpMatchArray|null;
 if(['capacity','vram','memoryCapacity'].includes(key)&&(m=v.match(/^(\d+(?:\.\d+)?)\s*(To|TB|Go|GB)(?:\s*[·(].*)?$/i)))return `GB:${Number(m[1])*(/^(?:To|TB)$/i.test(m[2])?1000:1)}`;
 if(['length','width','height','depth','thickness'].includes(key)&&(m=v.match(/^(\d+(?:\.\d+)?)\s*(mm|cm)$/i)))return `mm:${Number(m[1])*(m[2].toLowerCase()==='cm'?10:1)}`;
 if(key==='voltage'&&(m=v.match(/^(\d+(?:\.\d+)?)\s*(?:V|Volts?|Volt\(s\))$/i)))return `V:${Number(m[1])}`;
 if(key==='cas'&&(m=v.match(/^(?:CL\s*)?(\d+)$/i)))return `CL:${Number(m[1])}`;
 if(['power','boardPower','psu','thermalPower','electricalPower'].includes(key)&&(m=v.match(/^(\d+(?:\.\d+)?)\s*W$/i)))return `W:${Number(m[1])}`;
 if(category==='cpu'&&key==='socket'&&(m=v.match(/^(?:(?:AMD|Intel)\s+)?(AM[345]|sTR[45XW]+|LGA\s?\d{3,4})$/i)))return `socket:${m[1].replace(/\s/g,'').toUpperCase()}`;
 if(category==='cpu'&&key==='cache'&&(m=v.match(/^(\d+(?:\.\d+)?)\s*(KB|Ko|MB|Mo)$/i)))return `${/^M/i.test(m[2])?'MB':'KB'}:${Number(m[1])}`;
 if(category==='cpu'&&key==='boostClock'&&(m=v.match(/^(?:up to\s+|jusqu[’']?[aà]\s+)?(\d+(?:\.\d+)?)\s*(GHz|MHz)$/i)))return `MHz:${Number(m[1])*(/^G/i.test(m[2])?1000:1)}`;
 if(category==='ram'&&key==='rate'&&(m=v.match(/^(?:DDR[345][- ]\s*)?(\d{3,5})(?:\s*(?:MHz|MT\/s))?$/i)))return `MT/s:${Number(m[1])}`;
 if(category==='ram'&&key==='hostEcc'&&/^(?:non|no|false)$/i.test(v))return 'boolean:false';
 if(category==='ram'&&key==='hostEcc'&&/^(?:oui|yes|true)$/i.test(v))return 'boolean:true';
 return v.toLowerCase().replace(/\s+/g,' ');
}
function eligibleRow(category:CategoryId,key:string,value:string):boolean{
 if(!present(value))return false;
 if(category==='ram'&&key==='hostEcc'&&/on[ -]?die|sur matrice/i.test(value))return false;
 if(category==='ram'&&key==='moduleType'&&!/\b(?:[ULRSCE]DIMM|non[- ]?enregistree?|unbuffered|unregistered|registered|buffered)\b/i.test(value))return false;
 if(category==='psu'&&key==='efficiency'&&!/(?:bronze|silver|gold|platinum|titanium|80\s*plus|cybenetics|%)/i.test(value))return false;
 if(category==='storage'&&key==='interfaceGeneration'&&!/(?:PCI[ -]?(?:e|express)\s*[345](?:\.\d+)?\s*(?:[x×]\s*[1248]|[1248]\s*x)|PCI[ -]?(?:e|express).*SATA)/i.test(value))return false;
 if(category==='cooler'&&key==='fans'&&!/\d+/.test(value))return false;
 return true;
}

const present=(value:unknown):boolean=>value!==undefined&&value!==null&&(typeof value!=='number'||Number.isFinite(value))&&(typeof value!=='string'||Boolean(value.trim())&&!/^(?:(?:[-—–?]+$|inconnu[e]?|non renseign[eé]e?s?|unknown|n\/?a|n\.c\.)(?:[ .;:]|$)|non (?:publi[eé]|confirm[eé]|document[eé]|pr[eé]cis[eé]|communiqu[eé]|indiqu[eé]|disponible)|[aà] (?:confirmer|v[eé]rifier)|not (?:published|confirmed|specified|available)|to be (?:confirmed|verified))/i.test(value.trim()))&&(!Array.isArray(value)||value.length>0);
const validSource=(url:string,date:string)=>/^https:\/\//.test(url)&&Number.isFinite(Date.parse(date));

export function getCatalogCompletion(component:Component,product?:VerifiedProduct,options:{facts?:Record<string,FieldEvidence>;visual?:VisualCompletionInput;now?:number;identityConflict?:boolean;sourceMap?:CompletionSourceMap}={}){
 const mpnKey=(value:string)=>value.trim().toUpperCase();
 const identityKnown=present(component.manufacturerPartNumber)&&!options.identityConflict;
 const identityMatches=identityKnown&&Boolean(product)&&mpnKey(component.manufacturerPartNumber!)===mpnKey(product!.mpn);
 const sources=identityMatches?product!.sources.filter(s=>validSource(s.url,s.checkedAt)):[];
 const registeredURLs=sources.map(s=>s.url);
 const scopedURLs=(urls:string[]|undefined)=>urls?.filter(url=>registeredURLs.includes(url))??[];
 const fields:FieldCompletion[]=catalogTechnicalRequirements[component.category].map(requirement=>{
  const base:FieldCompletion={key:requirement.key,label:requirement.label,state:'missing',sourceURLs:[]};
  const reviewed=catalogFieldEvidence[component.id];
  const fact=options.facts?.[requirement.key]??product?.fieldEvidence?.[requirement.key]??(reviewed&&product&&mpnKey(reviewed.mpn)===mpnKey(product.mpn)?reviewed.fields[requirement.key]:undefined);
  if(identityMatches&&fact&&sources.some(source=>source.url===fact.sourceURL)&&validSource(fact.sourceURL,fact.checkedAt)&&(present(fact.value)||(fact.notApplicable&&Boolean(fact.reason?.trim()))))return {...base,state:'documented',value:fact.notApplicable?{notApplicable:true,reason:fact.reason}:fact.value,proof:'supplied_evidence',sourceURLs:[fact.sourceURL],sourceScope:'field'};
  const value=requirement.componentKey?component[requirement.componentKey]:undefined;
  if(present(value)){base.value=value;base.state='present_unverified';}
  if(!sources.length)return base;
  if(requirement.componentKey&&present(product!.patch[requirement.componentKey])&&JSON.stringify(value)===JSON.stringify(product!.patch[requirement.componentKey])){
   const direct=scopedURLs(options.sourceMap?.fields?.[requirement.key]);
   return {...base,state:'documented',proof:'explicit_patch',sourceURLs:direct.length?direct:registeredURLs,sourceScope:direct.length?'field':'record'};
  }
  const labels=new Set(requirement.rowLabels.map(norm));
  const connectorGroups=component.category==='psu'&&requirement.key==='connectors'?product!.groups.flatMap(group=>{
   if(norm(group.title)!=='connecteursetcables')return [];
   const rows=group.rows.filter(row=>['cartemere','processeur','cartegraphique','cartegraphiquepcie51','cartegraphiquepcieclassique','peripheriques'].includes(norm(row.label))&&present(row.value));
   if(!['cartemere','processeur','peripheriques'].every(label=>rows.some(row=>norm(row.label)===label))||!rows.some(row=>norm(row.label).startsWith('cartegraphique')))return [];
   return [{value:rows.map(row=>`${row.label} : ${row.value}`).join(' ; '),group:group.title}];
  }):[];
  const matchedRows=[...connectorGroups,...product!.groups.flatMap(g=>g.rows.map(row=>({row,group:g.title}))).flatMap(({row,group})=>{
   const projected=combinedRow(component.category,requirement.key,row.label,row.value);
   const value=projected??(labels.has(norm(row.label))?row.value:undefined);
   return value!==undefined&&eligibleRow(component.category,requirement.key,value)?[{value,group}]:[];
  })];
  const values=[...new Map(matchedRows.map(({value})=>[scalarKey(component.category,requirement.key,value),value])).values()];
  const fieldURLs=scopedURLs(options.sourceMap?.fields?.[requirement.key]);
  const groupsMapped=matchedRows.length>0&&matchedRows.every(({group})=>scopedURLs(options.sourceMap?.groups?.[group]).length>0);
  const groupURLs=groupsMapped?[...new Set(matchedRows.flatMap(({group})=>scopedURLs(options.sourceMap?.groups?.[group])))]:[];
  const direct=fieldURLs.length?fieldURLs:groupURLs;
  const provenance={sourceURLs:direct.length?direct:registeredURLs,sourceScope:direct.length?'field' as const:'record' as const};
  if(values.length>1)return {...base,state:'conflicting',value:values,...provenance};
  if(values.length===1)return {...base,state:'documented',value:values[0],proof:'technical_row',...provenance};
  return base;
 });
 const status:CompletionStatus=!identityKnown?'identity_missing':!identityMatches||!sources.length?'source_missing':fields.some(f=>f.state!=='documented')?'technical_missing':'ready';
 const offers=identityMatches?product!.offers.filter(o=>mpnKey(o.mpn)===mpnKey(product!.mpn)&&isCurrentVerifiedOffer(o,options.now??Date.now())):[];
 const visual=options.visual;const references=(visual?.referenceURLs??[]).filter(url=>/^https:\/\//.test(url));
 const visualStatus=references.length&&visual?.fidelity==='reconstructed'?'reference_reviewed':references.length?'reference_only':'reference_missing';
 const pricing={status:offers.length?'current' as const:identityMatches&&product!.offers.length?'no_current_eligible_offer' as const:'offer_missing' as const,eligibleOffers:offers.length};
 return {id:component.id,status,identity:{mpn:component.manufacturerPartNumber??null,matchedPrimaryRecord:Boolean(identityMatches&&sources.length),manufacturerSource:sources.some(s=>s.kind==='manufacturer'),conflict:Boolean(options.identityConflict)},technical:{documented:fields.filter(f=>f.state==='documented').length,total:fields.length,fields},pricing,visual:{status:visualStatus,profileId:visual?.profileId??null,fidelity:visual?.fidelity??null,referenceURLs:references,approximateFields:visual?.approximateFields??[]},completeForUserRequest:status==='ready'&&pricing.status==='current'&&visualStatus==='reference_reviewed'};
}
