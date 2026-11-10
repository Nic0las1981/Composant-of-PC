import type {ReactNode} from 'react';
import type {Component} from '../data/catalog';
import type {VisualProfile} from '../data/visualProfiles';

type Props={component:Component;profile:VisualProfile;detailed:boolean;paint:(name:string)=>string;fan:(x:number,y:number,r:number,glowing?:boolean,color?:string,square?:boolean)=>ReactNode};
/** Drawings inspected against the model-specific source photos. Positions are
 * normalized illustration coordinates; they never become hardware dimensions. */
export default function IndividualProductArt({component,profile,detailed,paint,fan}:Props){
 const screw=(x:number,y:number)=><g key={`${x}-${y}`}><circle cx={x} cy={y} r=".8" fill="#a7afad" stroke="#394344" strokeWidth=".2"/><path d={`m${x-.35} ${y}h.7m-.35-.35v.7`} stroke="#465051" strokeWidth=".25"/></g>;
 const pins=(x:number,y:number,cols:number,rows=2)=>Array.from({length:rows},(_,row)=>Array.from({length:cols},(_,col)=><rect key={`${row}-${col}`} x={x+col*1.35} y={y+row*1.5} width=".8" height=".85" fill="#9b9f92"/>));
 if(profile.design==='crucial-pro-overclocking'){
  const count=Math.min(component.memorySticks??2,4),white=profile.color!=='#252726';
  return <g data-model-art="crucial-pro-overclocking" transform={`translate(${count>2?9:5} ${count>2?11:18}) scale(${count>2?.89:1})`}>
   {Array.from({length:count},(_,i)=><g key={i} data-memory-module={i} transform={`matrix(1,-.13,0,1,${12+i*4},${i*14})`}>
    <path d="M1 8h85v30H48v-3h-3v3H1Z" fill="#1d211f" stroke="#7d837b" strokeWidth=".4"/>
    <path d="M3 35h42v3H3Zm45 0h36v3H48Z" fill={paint('gold')}/>
    {Array.from({length:53},(_,j)=><path key={j} d={`M${4+j*1.5} 35.2v2.5`} stroke="#82703f" strokeWidth=".4"/>)}
    <path d="M2 1 5-1h81l2 2v28l-2 2H4Z" fill={white?'#ccd0cd':'#161b19'} stroke="#8f9994" strokeWidth=".4"/>
    <path d="M1 1h84v26l-3 1v5H4v-5l-3-1Z" fill={white?'#eceeea':'#343936'} stroke={white?'#fafbf8':'#78817c'} strokeWidth=".55"/>
    <path d="M2 2h81l-5 7H7Z" fill={white?'#fafbf8':'#4d5550'}/>
    <path d="M2 2 7 9 2 27Zm81 0-5 7 5 18Z" fill={white?'#d3d8d3':'#272e2b'}/>
    <path d="M4 28h78v4H4Z" fill={white?'#cdd3cd':'#252c28'}/>
    <path d="M7 9h71M5 1h78" stroke={white?'#ffffff':'#646d67'} strokeWidth=".3" opacity=".85"/>
    <text x="43" y="20.4" textAnchor="middle" fill={white?'#606662':'#e2e6df'} fontFamily="Arial,sans-serif" fontWeight="700" fontSize="8.2" letterSpacing="-.35">crucial</text>
    <path d="M30 14.2h15" stroke={white?'#606662':'#e2e6df'} strokeWidth=".8" strokeLinecap="round"/>
    {detailed&&<text x="43" y="23.6" textAnchor="middle" fill={white?'#606662':'#e2e6df'} fontFamily="Arial,sans-serif" fontSize="2.5">by Micron</text>}
    <path d="M1 27v3m84-3v3" stroke="#c2b99b" strokeWidth=".8"/>
   </g>)}
  </g>;
 }
 if(profile.design==='samsung-9100-pro')return <g data-model-art="samsung-9100-pro" transform="matrix(1.08,-.15,.25,.9,10,39)">
  <path d="M0 0h83v23H0v-6a5 5 0 0 0 0-10Z" fill="#171b1a" stroke="#7a827a" strokeWidth=".6"/>
  <path d="M0 7a5 5 0 0 1 0 10" stroke={paint('gold')} strokeWidth="1.3"/>
  <path d="M83 1h5v15h-2v2h2v4h-5Z" fill={paint('gold')}/>
  {Array.from({length:14},(_,i)=><path key={i} d={`M83.5 ${1.8+i*1.4}h4`} stroke="#776a43" strokeWidth=".35"/>)}
  {[7,28].map(x=><rect key={x} x={x} y="2" width="19" height="19" rx=".3" fill="#292d2b" stroke="#666f69" strokeWidth=".35"/>)}
  <rect x="65" y="3" width="16" height="17" rx=".5" fill="#bdc3be" stroke="#efeee2" strokeWidth=".35"/>
  <rect x="53" y="3" width="10" height="8" fill="#242a27" stroke="#535e56" strokeWidth=".3"/>
  {Array.from({length:detailed?29:16},(_,i)=><g key={i}><rect x={8+i*2.4} y={i%2?.4:21.1} width="1.1" height="1.3" fill={i%3?'#aeb6a6':'#baa77c'}/>{detailed&&<rect x={48+(i%7)*2} y={2+Math.floor(i/7)*5} width=".7" height="1" fill="#d5cfb2"/>}</g>)}
  <rect x="11" y="6" width="68" height="12" rx="1.4" fill="#111514"/>
  <text x="13" y="9" fill="#f6f6ef" fontSize="2.7" fontFamily="Arial,sans-serif" fontWeight="700">SAMSUNG</text>
  <text x="13" y="13.2" fill="#fff" fontSize="5.6" fontFamily="Arial,sans-serif" fontWeight="700" letterSpacing="-.2">9100</text>
  <text x="13" y="17.3" fill="#ed1735" fontSize="5" fontFamily="Arial,sans-serif">PRO</text>
  {[2,4].flatMap(x=>[20,22].map(y=><circle key={`${x}-${y}`} cx={x} cy={y-1} r=".45" fill="#b7a77d"/>))}
 </g>;
 if(profile.design==='steel-legend-rx9060xt')return <g data-model-art="steel-legend-rx9060xt" transform="translate(7 26)">
  <path d="M4 7 95-5l10 8-91 12Z" fill="#d5dad6" stroke="#929f9b" strokeWidth=".6"/>
  <path d="M12 9 94-2l4 4-82 11Z" fill="#222c2d"/>
  {Array.from({length:detailed?40:25},(_,i)=><path key={i} d={`M${15+i*1.95} ${8-i*.26}l2 2`} stroke="#78827e" strokeWidth=".4"/>)}
  <path d="M13 15 105 3v35L13 50Z" fill="#e7eae6" stroke="#a9b2af" strokeWidth=".65"/>
  <path d="M4 7 13 15v35L4 42Z" fill="#b7c0bb" stroke="#667570" strokeWidth=".5"/>
  <g transform="matrix(1,-.13,0,1,13,15)">
   <path d="M1 3h88v29H1Z" fill="#aab4b0"/>
   {[15,46,77].map((x,i)=><g key={x} data-model-fan="translucent-argb">{fan(x,17,13.5,true,'#b8c9c3')}<circle cx={x} cy="17" r="3.9" fill="#c4d0ca" stroke="#f7fff9" strokeWidth=".4"/>{i===1?<text x={x} y="17.8" fill="#7d8884" textAnchor="middle" fontSize="2.1" fontFamily="Arial">ASRock</text>:<path d={`M${x} 14l3 3-3 3-3-3Z m-1 1h2l-2 2h2`} stroke="#84938d" strokeWidth=".6"/>}</g>)}
   <path d="M0 1h91v4H83l-3-2H11L8 5H0Zm0 30h8l3 2h69l3-2h8v4H0Z" fill="#e1e6e0" stroke="#f4f7ef" strokeWidth=".4"/>
   <path d="m30 2 3 4-2 7m30-11-3 4 2 7M30 33l3-4-2-7m30 11-3-4 2-7" stroke="#9da8a1" strokeWidth="1.2"/>
   <path d="M2 7h5m-5 2h3M87 24h-4m4 2h-6" stroke="#95a39a" strokeWidth=".4"/>
   {[3,88].flatMap(x=>[2,33].map(y=>screw(x,y)))}
  </g>
  <path d="M24 5 65-.4l5 3-42 5.5Z" fill={paint('rgb-line')} data-rgb-zone="gpu-logo" stroke="#d4ddd4" strokeWidth=".6"/>
  <text x="45" y="4.4" transform="rotate(-7.5 45 4.4)" fill="#52645b" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="3.1" textAnchor="middle">STEEL LEGEND</text>
  <path d="M76-1l7-1 3 2-7 1Z" fill="#15211b" stroke="#687c70" strokeWidth=".5"/>
  <path d="M29 47l25-3.2v3l-25 3.2Z" fill={paint('gold')}/>
  {[0,1,2].map(i=><path key={i} d={`M5 ${16+i*7}l5 4v2l-5-4Z`} fill="#1a2922" stroke="#f1f3eb" strokeWidth=".4"/>)}
 </g>;
 if(profile.design==='steel-legend-b850')return <g data-model-art="steel-legend-b850" transform="matrix(.98,-.12,.23,.98,24,12)">
  <rect width="57" height="71" rx="1" fill="#e2e6df" stroke="#bcc5bb" strokeWidth=".65"/>
  <path d="M5 0v71M0 16h53M22 34v34M6 60h47" stroke="#a6b3a7" strokeWidth=".35" opacity=".4"/>
  {Array.from({length:detailed?38:20},(_,i)=><rect key={i} x={4+(i*7)%48} y={38+(i*9)%26} width={i%3?1.5:3} height={i%3?1:2} fill={i%4?'#565d56':'#1d2520'}/>)}
  <path d="M1 2h8l8 8v25H1Z" fill="#e9ece7" stroke="#a0aaa1" strokeWidth=".7"/>
  <path d="m2 3 6 2 7 8v19L2 21Z" fill="#d5dcd4" stroke="#f9fbf3" strokeWidth=".5"/>
  <path d="m4 8 6 6-3 4 5 5-4 6-5-5m0-13 6 6-2 2" stroke="#a6b0a7" strokeWidth=".5"/>
  <path d="m7 18 4 4-4 4-4-4Z" fill="#9caaa0" stroke="#f4f8ee" strokeWidth=".6"/>
  <rect x="18" y="1" width="24" height="7" fill="#dde3da" stroke="#a2aea1" strokeWidth=".5"/>
  {[20,25,30,35,40].map(x=><path key={x} d={`M${x} 1v6`} stroke="#929d93" strokeWidth=".5"/>)}
  {[14,22].map(x=><g key={x}><rect x={x} y="-.5" width="6.5" height="2.2" fill="#202b21"/>{pins(x+.5,0,4,1)}</g>)}
  <rect x="22" y="15" width="17" height="19" rx="1" fill={paint('silver')} stroke="#6b796c" strokeWidth=".7"/>
  <rect x="25" y="18" width="11" height="13" fill="#303930" stroke="#b7c0af" strokeWidth=".7"/>
  <path d="M39 16v18h-3" stroke="#737f72" strokeWidth=".8"/>
  {[15,33].flatMap(y=>[23,38].map(x=>screw(x,y)))}
  {[44,47,50,53].map(x=><g key={x}><rect x={x} y="9" width="2.2" height="26" fill="#252b26" stroke="#879285" strokeWidth=".25"/><path d={`M${x+1.1} 10v24`} stroke="#0c160e" strokeWidth=".65"/><path d={`M${x} 9h2m-2 26h2`} stroke="#646e61" strokeWidth=".8"/></g>)}
  <rect x="55" y="17" width="2.2" height="14" fill="#222c22"/>
  <path d="M9 37h34v5H9Z" fill="#e5e9e0" stroke="#97a694" strokeWidth=".5"/>
  <path d="M21 37v5m8-5v5" stroke="#9fac9b" strokeWidth=".5"/>
  <text x="10" y="40.5" fill="#748272" fontSize="1.3" fontFamily="Arial">BLAZING M.2</text>
  <rect x="11" y="43" width="33" height="2.2" fill="#dddcd0" stroke="#5a6959" strokeWidth=".55"/><path d="M12 44h29" stroke="#293829" strokeWidth=".7"/>
  <path d="M46 43h5l5 6v13H44V47Z" fill="#dce3d8" stroke="#99a993" strokeWidth=".6"/>
  {[0,1,2,3].map(i=><path key={i} d={`M${46+i*.9} ${46+i*1.1}l${7-i*.8} 7v${7-i*.5}h-${6-i*.5}`} stroke="#a1b09a" strokeWidth=".3"/>)}
  <circle cx="20" cy="51" r="3" fill="#bbc6b4" stroke="#495a45" strokeWidth="1"/>
  <rect x="10" y="59" width="33" height="2.2" fill="#d8dfcf" stroke="#626e58" strokeWidth=".4"/>
  <path d="M8 62h47v5H8Z" fill="#e5e9df" stroke="#9daa94" strokeWidth=".5"/>
  <path d="M27 62v5m7-5v5" stroke="#acb8a3" strokeWidth=".4"/>
  <text x="13" y="65.4" fill="#6e7d64" fontSize="1.8" fontFamily="Arial,sans-serif">M.2 ARMOR</text>
  <path d="M8 67.5h47" stroke={paint('rgb-line')} strokeWidth="1.3" data-rgb-zone="motherboard-m2"/>
  {[3,13,23,33,43].map(x=><rect key={x} x={x} y="69" width="6" height="1.4" fill="#2c3528"/>)}
  {[2,54].flatMap(x=>[3,35,68].map(y=>screw(x,y)))}
  {[47,54].map(y=><rect key={y} x="55" y={y} width="3" height="5" fill="#2a3527"/>)}
 </g>;
 if(profile.design==='power-zone-2')return <g data-model-art="power-zone-2" transform="translate(7 5)">
  <path d="M8 29 57 13l44 22-49 17Z" fill="#353b36" stroke="#7a857a" strokeWidth=".65"/>
  <g transform="matrix(1,-.326,.88,.44,12,29)">
   <path d="M3 3h39v38H3Z" fill="#111815"/>
   <circle cx="22" cy="22" r="18" fill="#19231d"/>
   {Array.from({length:14},(_,i)=><path key={i} d={`M${4+i*2.7} 4v35M4 ${4+i*2.7}h35`} stroke="#545f55" strokeWidth=".65"/>)}
   <path d="M3 3h39v38H3Z" stroke="#899184" strokeWidth=".4"/>
   <rect x="3" y="42" width="39" height="3" fill="#949d90"/>
   <text x="22" y="44.2" fill="#2b362c" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="2.4" fontWeight="700">POWER ZONE 2</text>
  </g>
  <path d="M8 29 52 52v29L8 57Z" fill="#252e27" stroke="#677464" strokeWidth=".6"/>
  <path d="M52 52 101 35v29L52 81Z" fill="#1f2822" stroke="#677464" strokeWidth=".6"/>
  <g transform="matrix(1,.52,0,1,12,34)">
   <rect width="35" height="21" fill="#171e18" stroke="#71806b" strokeWidth=".4"/>
   <text x="2" y="5" fill="#e7ede2" fontFamily="Arial,sans-serif" fontSize="3.4" fontWeight="700">be<tspan fill="#e49a56"> quiet!</tspan></text>
   <text x="2" y="9" fill="#c7d1bf" fontFamily="Arial,sans-serif" fontSize="2.3">POWER ZONE 2</text>
   <text x="2" y="16.4" fill="#d3dcce" fontFamily="Arial,sans-serif" fontSize="5.5">{component.wattage}W</text>
   {detailed&&[11,18,19].map(y=><path key={y} d={`M2 ${y}h31`} stroke="#87947e" strokeWidth=".3"/>)}
  </g>
  <g transform="matrix(1,-.347,0,1,56,54)">
   {[[0,0,8,2],[12,0,6,2],[23,0,4,2],[33,0,4,2],[0,12,6,2],[11,12,6,2],[23,12,6,2],[35,12,6,2]].map(([x,y,w,h],i)=><g key={i}><rect x={x} y={y} width={w+2} height={h*2.2+1} fill="#0d160f" stroke="#69785f" strokeWidth=".3"/>{pins(x+1,y+.8,Math.floor(w/1.35),h)}</g>)}
   <text x="2" y="10" fill="#aebaa1" fontFamily="Arial,sans-serif" fontSize="1.7">MB</text><text x="25" y="10" fill="#aebaa1" fontFamily="Arial,sans-serif" fontSize="1.7">P8</text>
   <text x="1" y="21" fill="#aebaa1" fontFamily="Arial,sans-serif" fontSize="1.7">DRIVES</text><text x="24" y="21" fill="#aebaa1" fontFamily="Arial,sans-serif" fontSize="1.7">PCIe 5.1</text>
  </g>
  {[55,98].flatMap(x=>[x===55?54:39,x===55?77:63].map(y=>screw(x,y)))}
 </g>;
 return null;
}
