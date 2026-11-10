import type {Component} from './catalog';
import {memoryAppearanceAssignments, memoryAppearanceColors} from './memoryAppearanceAssignments';

export type MemoryDesign = keyof typeof memoryAppearanceAssignments;
export type MemoryPoint = readonly [number, number];
export type MemoryPanel = {points: readonly MemoryPoint[]; tone: 'dark'|'silver'|'body';};
export type MemoryShape = {
  outline: readonly MemoryPoint[];
  panels: readonly MemoryPanel[];
  diffuser: readonly (readonly MemoryPoint[])[];
  label: string;
  labelAt: MemoryPoint;
  labelWidth: number;
  ribs?: boolean;
};
const byMPN = new Map<string, MemoryDesign>();
for (const [design, mpns] of Object.entries(memoryAppearanceAssignments)) {
  for (const mpn of mpns) byMPN.set(mpn.toUpperCase(), design as MemoryDesign);
}

/** Exact commercial identity is required; a similar family name is insufficient. */
export function getMemoryAppearance(component?: Component | null): MemoryDesign | undefined {
  if (component?.category !== 'ram' || component.memoryHeatspreader === false) return undefined;
  return byMPN.get(component.manufacturerPartNumber?.trim().toUpperCase() ?? '');
}
/** Material swatch from the exact photograph review, not the first title colour. */
export function getMemoryAppearanceColor(component?: Component | null): string | undefined {
  return getMemoryAppearance(component) ? memoryAppearanceColors[component!.manufacturerPartNumber!.trim().toUpperCase()] : undefined;
}
const rect = (x:number,y:number,w:number,h:number):MemoryPoint[] => [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
const standard: MemoryPoint[] = [[.02,.13],[.07,.07],[.93,.07],[.98,.13],[.98,.86],[.02,.86]];
const continuous = [rect(.04,.025,.92,.09)];

/** Proportions traced from inspected photographs, scaled to each verified envelope.
 * Decorative grooves and lettering remain illustrative, not mechanical evidence. */
export const memoryShapes: Record<MemoryDesign, MemoryShape> = {
  'trident-z5': {
    outline:[[.02,.17],[.10,.14],[.30,.14],[.39,.18],[.46,.19],[.51,.16],[.61,.06],[.75,.015],[.98,.015],[.98,.88],[.77,.88],[.68,.84],[.54,.84],[.44,.91],[.02,.91]],
    panels:[{tone:'dark',points:[[.02,.34],[.61,.29],[.98,.27],[.98,.67],[.62,.72],[.32,.76],[.02,.76]]}],
    diffuser:[[[.035,.075],[.31,.075],[.40,.12],[.47,.13],[.56,.06],[.64,.02],[.59,.13],[.50,.22],[.41,.24],[.31,.19],[.035,.19]]],
    label:'TRIDENT Z5',labelAt:[.75,.49],labelWidth:.31,
  },
  'vengeance-lpx': {
    outline:[[.02,.14],[.05,.07],[.95,.07],[.98,.14],[.98,.87],[.03,.87]],
    panels:[{tone:'dark',points:rect(.34,.29,.32,.38)}],diffuser:[],label:'VENGEANCE',labelAt:[.50,.46],labelWidth:.28,ribs:true,
  },
  'dominator-platinum-rgb': {
    outline:[[.02,.23],[.08,.04],[.92,.04],[.98,.23],[.98,.88],[.02,.88]],
    panels:[{tone:'body',points:rect(.10,.31,.80,.49)}],
    diffuser:Array.from({length:12},(_,i)=>rect(.12+i*.064,.09,.044,.12)),
    label:'DOMINATOR',labelAt:[.5,.54],labelWidth:.35,
  },
  'vengeance-ddr5-rgb': {
    outline:[[.02,.20],[.07,.105],[.16,.075],[.84,.075],[.93,.105],[.98,.20],[.98,.88],[.02,.88]],
    panels:[{tone:'dark',points:[[.22,.24],[.78,.24],[.69,.74],[.31,.74]]}],
    diffuser:[[[.05,.035],[.15,.005],[.85,.005],[.95,.035],[.95,.11],[.85,.08],[.15,.08],[.05,.11]]],
    label:'VENGEANCE',labelAt:[.5,.47],labelWidth:.35,
  },
  'fury-beast-ddr4': {
    outline:[[.02,.22],[.045,.22],[.045,.13],[.12,.13],[.14,.07],[.40,.07],[.45,.14],[.93,.14],[.95,.22],[.98,.22],[.98,.87],[.02,.87]],
    panels:[{tone:'dark',points:[[.47,.31],[.58,.31],[.83,.70],[.72,.70]]}],
    diffuser:[],label:'FURY',labelAt:[.27,.48],labelWidth:.28,
  },
  'fury-beast-ddr5': {
    outline:[[.02,.18],[.05,.18],[.05,.10],[.27,.10],[.29,.07],[.36,.07],[.36,.15],[.40,.15],[.40,.07],[.47,.07],[.47,.15],[.50,.15],[.50,.09],[.94,.09],[.94,.18],[.98,.18],[.98,.88],[.02,.88]],
    panels:[{tone:'dark',points:[[.51,.38],[.70,.38],[.92,.67],[.73,.67]]}],
    diffuser:[],label:'FURY',labelAt:[.26,.47],labelWidth:.28,
  },
  'fury-beast-rgb': {
    outline:[[.02,.16],[.09,.09],[.91,.09],[.98,.16],[.98,.89],[.02,.89]],
    panels:[{tone:'dark',points:[[.15,.24],[.85,.24],[.70,.72],[.30,.72]]}],diffuser:continuous,label:'FURY',labelAt:[.50,.47],labelWidth:.29,
  },
  'fury-renegade-ddr4': {
    outline:standard,
    panels:[{tone:'silver',points:[[.16,.16],[.84,.16],[.72,.85],[.28,.85]]}],
    diffuser:[[[.04,.015],[.34,.015],[.37,.06],[.63,.06],[.66,.015],[.96,.015],[.96,.11],[.66,.11],[.63,.16],[.37,.16],[.34,.11],[.04,.11]]],
    label:'FURY',labelAt:[.5,.49],labelWidth:.25,
  },
  'fury-renegade-ddr5': {
    outline:[[.02,.15],[.09,.035],[.22,.14],[.40,.14],[.43,.19],[.57,.19],[.60,.14],[.78,.14],[.91,.035],[.98,.15],[.98,.88],[.60,.88],[.56,.82],[.44,.82],[.40,.88],[.02,.88]],
    panels:[{tone:'silver',points:[[.02,.24],[.12,.13],[.27,.43],[.39,.43],[.36,.26],[.64,.26],[.61,.43],[.73,.43],[.88,.13],[.98,.24],[.98,.86],[.02,.86]]},
      {tone:'dark',points:[[.38,.27],[.62,.27],[.68,.48],[.59,.64],[.41,.64],[.32,.48]]},
      ...[0,1].flatMap(side=>[0,1].map(i=>({tone:'dark' as const,points: [[.10+i*.065,.29],[.14+i*.065,.29],[.27+i*.065,.60],[.23+i*.065,.60]].map(([x,y])=>[side?1-x:x,y] as MemoryPoint)})))],
    diffuser:[[[.08,.02],[.22,.11],[.41,.11],[.44,.16],[.56,.16],[.59,.11],[.78,.11],[.92,.02],[.96,.09],[.80,.20],[.59,.20],[.56,.25],[.44,.25],[.41,.20],[.20,.20],[.04,.09]]],
    label:'FURY',labelAt:[.5,.47],labelWidth:.21,
  },
};
