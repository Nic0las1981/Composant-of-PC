import type {CoolerAppearance} from '../data/hardwareAppearance';

/** Pump silhouettes drawn from the referenced product families. Coordinates are
 * illustration space; the assembled 3D model has its own physical envelope. */
export default function AioPumpArt({appearance,color,brand,rgb,paint}:{appearance:CoolerAppearance;color:string;brand:string;rgb:boolean;paint:(name:string)=>string}){
 const shape=appearance.pumpShape;
 const round=shape==='arctic-vrm'||shape==='kraken-round'||shape==='ek-nucleus';
 const silver=shape==='deepcool-infinity'||shape==='silent-loop';
 const outline=shape==='capellix'?'M3 0H24L29 5V24L24 29H3L-2 24V5Z':'M3 0H24Q29 0 29 5V24Q29 29 24 29H3Q-2 29-2 24V5Q-2 0 3 0Z';
 return <g data-art-part="aio-pump" data-pump-shape={shape} transform="matrix(1,-.22,.48,.65,51,56)">
  <path d="M-3 13v10q0 8 16 9t19-8v-9" fill={color} stroke="#58646a" strokeWidth=".6"/>
  {round?<><ellipse cx="13" cy="14" rx="17" ry="16" fill={paint('pump-surface')} stroke="#a2abad" strokeWidth=".55"/><ellipse cx="13" cy="14" rx="15" ry="14" fill={shape==='kraken-round'?'#101419':color} stroke="#434b51" strokeWidth=".6"/></>:<><path d={outline} fill={silver?paint('silver'):paint('pump-surface')} stroke="#b6c0c4" strokeWidth=".6"/><path d="M3 3h21q2 0 2 3v17q0 3-3 3H3q-2 0-2-3V6q0-3 2-3Z" fill="#12191e" stroke={rgb?paint('rgb-line'):'#7f898d'} strokeWidth={rgb?1.5:.45}/></>}
  {shape==='arctic-vrm'?<>
   {Array.from({length:24},(_,i)=><path key={i} transform={`rotate(${i*15} 13 14)`} d="M13 .4l2.2 5.7-1.1 1" stroke="#808a8c" strokeWidth=".65"/>)}
   {rgb&&<ellipse cx="13" cy="14" rx="13.7" ry="13" stroke={paint('rgb')} strokeWidth="1.7" data-rgb-zone="pump-vrm"/>}
   <ellipse cx="13" cy="14" rx="8.5" ry="8" fill={color} stroke="#7c898c" strokeWidth=".5"/>
   <path d="m9 13 4-7 4 7h-8Zm1.8-1.3 2.2-3.8 2.2 3.8Z" fill="none" stroke="#d0d8d9" strokeWidth=".5"/>
   <text x="13" y="17.5" textAnchor="middle" fontSize="2.1" fill="#e3e9e7" fontFamily="Arial">ARCTIC</text>
  </>:shape==='kraken-round'?<>
   <rect x="5.3" y="6.4" width="15.4" height="15.2" rx=".3" fill="#0a1119"/>
   <path d="M14 8a6 6 0 1 1-5.5 10" stroke="#6e78c1" strokeWidth="1.4"/>
   <text x="12.5" y="14" textAnchor="middle" fill="#e4e9ea" fontSize="3.4" fontFamily="Arial" fontWeight="700">NZXT</text>
   <path d="M7 3 2 17q0-10 5-14Z" fill="#b4c1cc" opacity=".17"/>
  </>:shape==='corsair-lcd'?<>
   <circle cx="13" cy="14" r="11" fill="#111a24" stroke={paint('rgb')} strokeWidth="1.2" data-rgb-zone="pump-display-ring"/>
   <circle cx="13" cy="14" r="8.2" stroke="#5b82b7" strokeWidth=".6"/>
   <text x="13" y="15" fill="#ccd8e9" textAnchor="middle" fontSize="3.8" fontFamily="Arial">CORSAIR</text>
  </>:shape==='capellix'?<>
   <path d={outline} stroke={paint('rgb')} strokeWidth="1.5" opacity=".8" data-rgb-zone="pump-capellix"/>
   {Array.from({length:19},(_,i)=><path key={i} d={`M${i%2?1:24} ${5+i%10*2}h${i%2?2:-2}`} stroke={paint('rgb-line')} strokeWidth=".7"/>)}
   <path d="M6 7h15v15H6Z" fill="#c8d5de" opacity=".8"/><path d="m9 11 3 7h-5Zm4-3 3 10h-4Zm3 2 5 8h-6Z" fill="#293344"/>
  </>:shape==='silent-loop'?<>
   <rect x="3" y="4" width="21" height="21" rx="1" fill={paint('silver')}/><rect x="3" y="4" width="21" height="21" fill={paint('brushed')} opacity=".22"/>
   <text x="13.5" y="11" textAnchor="middle" fontSize="3" fill="#40504f" fontFamily="Arial" fontWeight="700">be quiet!</text>
  </>:shape==='ek-nucleus'?<>
   {Array.from({length:5},(_,i)=><path key={i} d={`M${2+i*5} 4v19`} stroke={paint('rgb-line')} strokeWidth="1.8" opacity=".7"/>)}
   <circle cx="13" cy="14" r="7" fill="#1b2027" stroke="#c4cdd1" strokeWidth=".5"/><text x="13" y="16" textAnchor="middle" fill="#d8dfe1" fontSize="6" fontFamily="Arial">ek</text>
  </>:<>
   {[0,1,2].map(i=><rect key={i} x={4+i*1.2} y={4+i*1.2} width={19-i*2.4} height={20-i*2.4} rx="4" stroke={paint('rgb')} strokeWidth={i?'.55':'1'} opacity={1-i*.2}/>)}
   <path d="M12 11h5v6h-5v-3h8M10 9h4v5" stroke="#43c7b3" strokeWidth="1.1"/>
  </>}
  {[0,1].map(i=><g key={i}><path d={`M29 ${10+i*9}h5v5h-5Z`} fill="#151f25" stroke="#66757d" strokeWidth=".5"/><path d={`M30 ${11+i*9}v3m1-3v3m1-3v3`} stroke="#89959a" strokeWidth=".3"/></g>)}
  <title>{`${brand} — ${shape}`}</title>
 </g>;
}
