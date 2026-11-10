import {memoryShapes, type MemoryDesign, type MemoryPoint} from '../data/memoryAppearance';

/** Shared photo-based silhouette with the 3D heatspreader, seen in icon perspective. */
export default function MemoryHeatspreaderArt({design,height,body,bodyColor,ink,rgb,rainbow,brushed}:{
  design:MemoryDesign;height:number;body:string;bodyColor?:string;ink:string;rgb:boolean;rainbow:string;brushed:string;
}) {
  const shape=memoryShapes[design];
  const path=(points:readonly MemoryPoint[])=>points.map(([x,y],i)=>`${i?'L':'M'}${x*74} ${y*height}`).join(' ')+'Z';
  const pale=bodyColor&&/^#[0-9a-f]{6}$/i.test(bodyColor)
    ? [1,3,5].reduce((sum,start)=>sum+parseInt(bodyColor.slice(start,start+2),16),0)/3>205
    : false;
  const tone=(value:'dark'|'silver'|'body')=>value==='dark'?'#222529':value==='silver'?(pale?'#e1e2e0':'#bfc3c5'):body;
  const labelInk=design==='vengeance-lpx'?'#e9d449':design==='fury-renegade-ddr4'?'#6f777a'
    :design==='dominator-platinum-rgb'||design==='fury-beast-ddr4'||design==='fury-beast-ddr5'?ink:'#e3e5e4';
  return <g data-memory-design={design}>
    <path d={path(shape.outline)} transform="translate(4 -3)" fill={body} stroke="#7c8888" strokeWidth=".45"/>
    <path d={path(shape.outline)} fill={body} stroke="#9ca7a2" strokeWidth=".55"/>
    <path d={path(shape.outline)} fill={brushed} opacity=".24"/>
    {shape.ribs&&Array.from({length:28},(_,i)=>{
      const x=3+i*2.52;
      return <g key={i}><path d={`M${x} ${height*.075}v${height*.75}`} stroke="#000" strokeOpacity=".30" strokeWidth="1.2"/>
        <path d={`M${x+.48} ${height*.065}v${height*.76}`} stroke={ink} strokeOpacity=".30" strokeWidth=".45"/></g>;
    })}
    {shape.panels.map((panel,i)=><g key={i}><path d={path(panel.points)} fill={tone(panel.tone)} stroke="#7d8884" strokeWidth=".18"/>
      <path d={path(panel.points)} fill={brushed} opacity=".3"/></g>)}
    {rgb&&shape.diffuser.map((points,i)=><g key={i} data-rgb-zone="ram-diffuser">
      <path d={path(points)} transform="translate(2 -1.6)" fill={rainbow} stroke="#d6edee" strokeWidth=".3"/>
      <path d={path(points)} fill={rainbow} stroke="#f1fbff" strokeWidth=".25"/>
    </g>)}
    {design==='vengeance-ddr5-rgb'&&[0,1].map(side=><g key={side} opacity=".35">
      {Array.from({length:15},(_,i)=>{const x=(side?58:4)+(i%3)*3,y=height*(.28+Math.floor(i/3)*.10);return <path key={i} d={`M${x} ${y}l1.6 0-.8 1.3Z`} fill={ink}/>;})}
    </g>)}
    {design==='dominator-platinum-rgb'&&[4,70].flatMap(x=>[height*.31,height*.74].map(y=><g key={`${x}-${y}`}><circle cx={x} cy={y} r=".85" fill="#79858a"/><path d={`M${x-.45} ${y}h.9`} stroke="#192124" strokeWidth=".28"/></g>))}
    <text x={shape.labelAt[0]*74} y={shape.labelAt[1]*height} textAnchor="middle" dominantBaseline="middle"
      fontFamily="Arial,sans-serif" fontSize={height*(design.includes('fury')?.22:.15)} textLength={shape.labelWidth*74} lengthAdjust="spacingAndGlyphs"
      fontWeight="700" fontStyle={design.includes('fury')||design==='trident-z5'?'italic':undefined}
      fill={labelInk}>{shape.label}</text>
    {design.includes('beast')&&<text x="59" y={height*.59} textAnchor="middle" fill={ink} fontFamily="Arial" fontSize="1.8">BEAST</text>}
    {design.includes('renegade')&&<text x="37" y={height*.78} textAnchor="middle" fill={design.endsWith('ddr5')?'#333a3b':ink} fontFamily="Arial" fontSize="1.5">RENEGADE</text>}
    {design==='dominator-platinum-rgb'&&<text x="37" y={height*.66} textAnchor="middle" fill={ink} fontFamily="Arial" fontSize="1.5">CORSAIR</text>}
  </g>;
}
