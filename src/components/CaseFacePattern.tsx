import type {CaseAppearance} from '../data/hardwareAppearance';

/** Family-specific intake patterns. Openings are illustrative, not a perforation count. */
export default function CaseFacePattern({pattern,width,height}:{pattern:CaseAppearance['frontPattern'];width:number;height:number}){
 const paths:string[]=[];
 const pitch=pattern==='geometric-filter'?5:pattern==='triangles'?2.6:pattern==='hexagons'?3:2;
 for(let y=4;y<height-4;y+=pitch)for(let x=3;x<width-3;x+=pitch){
  if(pattern==='triangles')paths.push(`M${x} ${y}l1.6 0-.8 1.6Z`);
  else if(pattern==='hexagons')paths.push(`M${x} ${y}l1.1-.65 1.1.65v1.3l-1.1.65-1.1-.65Z`);
  else if(pattern==='geometric-filter')paths.push(`M${x} ${y}l2.2-2.2 2.2 2.2-2.2 2.2Z m.7 0 1.5-1.5 1.5 1.5-1.5 1.5Z`);
  else if(pattern==='square-perforation')paths.push(`M${x} ${y}h.85v.85h-.85Z`);
  else paths.push(`M${x} ${y}h.55v.65h-.55Z`);
 }
 return <g data-art-part="model-front-pattern" data-front-pattern={pattern}>
  {pattern==='faceted-mesh'&&<>
   <path d={`M2 3 ${width*.66} 3 ${width*.35} ${height*.32} ${width*.8} ${height*.58} 2 ${height*.49}Z`} fill="#819194" opacity=".22"/>
   <path d={`M${width*.66} 3 ${width-2} 3 ${width-2} ${height*.73} ${width*.8} ${height*.58} ${width*.35} ${height*.32}Z`} fill="#050b0e" opacity=".45"/>
   <path d={`M2 ${height*.49} ${width*.8} ${height*.58} ${width*.39} ${height-3} 2 ${height-3}Z`} fill="#aab9b5" opacity=".13"/>
   <path d={`M2 ${height*.49} ${width*.8} ${height*.58} ${width*.35} ${height*.32} ${width*.66} 3M${width*.8} ${height*.58} ${width-2} ${height*.73}M${width*.8} ${height*.58} ${width*.39} ${height-3}`} stroke="#879998" strokeWidth=".35" opacity=".6"/>
  </>}
  <path d={paths.join(' ')} fill={pattern==='triangles'||pattern==='square-perforation'?'#0b1519':'none'} stroke={pattern==='geometric-filter'?'#7f9091':'#71868b'} strokeWidth={pattern==='geometric-filter'?'.45':'.22'} opacity={pattern==='fine-mesh'?'.65':'.85'}/>
 </g>;
}
