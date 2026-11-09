import { useId } from 'react';
import type { Component } from '../data/catalog';
import { getVisualProfile } from '../data/visualProfiles';

type ProductArtProps = { category: string; brand?: string; className?: string; component?: Component };

/** Local, specification-based illustrations. Shapes are illustrative, not manufacturer product photos. */
export default function ProductArt({ category, brand, className, component }: ProductArtProps) {
  const id = `hardware-${useId().replace(/:/g, '')}`;
  const profile = getVisualProfile(component);
  const fill = (name: string) => `url(#${id}-${name})`;
  const accent = profile?.accent || '#b3f472';
  const shell = profile?.color || '#30383a';
  const maker = component?.brand || brand;
  const fan = (x: number, y: number, r: number, glowing = false, fanColor?: string) => (
    <g key={`${x}-${y}-${r}`} transform={`translate(${x} ${y})`}>
      <circle r={r + 2} fill={fanColor || '#151b1e'} stroke="#626c70" strokeWidth="1" />
      <circle r={r} fill="#15191b" stroke={glowing ? accent : '#6f7b80'} strokeWidth={glowing ? 1.8 : .65} />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M0 -2 C${r*.6} ${-r*.9},${r*.95} ${-r*.8},${r*.55} ${-r*.1}L2 2Z`} fill={fanColor || fill('blade')} transform={`rotate(${i*360/7})`} />)}
      <circle r={r*.25} fill="#727f85" stroke="#24282a" strokeWidth=".8" />
      <circle r={r*.1} fill="#303638" />
    </g>
  );
  let artwork;
  switch (category) {
    case 'cpu': {
      const intel = maker?.toLowerCase().includes('intel');
      artwork = <g transform={intel ? 'translate(-5 -3) scale(1.05 1.07)' : undefined}>
        <path d="M23 29 70 15 100 43 53 62Z" fill="#344a3b" stroke="#6d7c65" />
        <path d="M23 29v12l30 29 47-15V43L53 62Z" fill="#183628" stroke="#536c4b" strokeWidth=".7" />
        {Array.from({length:14},(_,i)=><path key={i} d={`m${29+i*1.9} ${45+i*1.85} 0 4`} stroke="#b29b58" strokeWidth="1.1" />)}
        <path d="M30 28 70 18 93 42 53 54Z" fill={fill('silver')} stroke="#e1e8e4" strokeWidth=".8" />
        <path d="M30 28v7l23 25 40-13v-5L53 54Z" fill={fill('edge')} />
        <path d="m35 30 34-9 18 20-34 10Z" fill="none" stroke="#f5faf6" strokeWidth=".5" opacity=".6" />
        <g transform="translate(48 32) rotate(-16) skewX(28)">
          <text fill="#4b5050" fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700">{intel ? 'intel' : 'AMD'}</text>
          <text y="9" fill="#68706f" fontFamily="Arial,sans-serif" fontSize="3.7" letterSpacing=".8">{intel ? 'CORE' : 'RYZEN'}</text>
          <text y="14" fill="#68706f" fontFamily="Arial,sans-serif" fontSize="2.8">{component?.socket || (intel ? 'LGA1700' : 'AM5')}</text>
        </g>
      </g>;
      break;
    }
    case 'gpu': {
      const p = profile?.category === 'gpu' ? profile : undefined;
      const count = p?.fanCount || 3;
      const width = p ? Math.min(91,Math.max(61,p.lengthMm*.26)) : 85;
      const left = (120-width-18)/2, right = left+width;
      const label = component?.name.includes('Radeon') ? 'RADEON RX' : component?.name.includes('Arc') ? 'INTEL ARC' : 'GEFORCE RTX';
      artwork = <>
        <path d={`M${left} 31 ${right} 20 ${right+17} 32 ${left+17} 43Z`} fill={p?.backplateColor || '#4c5254'} stroke="#899295" strokeWidth=".65" />
        <path d={`M${left+17} 43 ${right+17} 32 ${right+16} 62 ${left+17} 73Z`} fill={p?.shroudColor || fill('graphite')} stroke="#718080" strokeWidth=".8" />
        <path d={`M${left} 31 ${left+17} 43v30L${left} 58Z`} fill={shell} stroke="#5b686e" strokeWidth=".7" />
        <path d={`M${left+20} 69 ${right+12} 58v2L${left+20} 71Z`} fill={accent} opacity={p?.rgb ? .95 : .35} />
        <g transform={`translate(${left+17} 43) skewY(${-Math.atan(11/width)*180/Math.PI})`}>
          {Array.from({length:count},(_,i)=>fan((i+.5)*width/count,13,Math.min(11.5,width/count*.36),p?.rgb || false))}
        </g>
        <path d={`M${left+9} 33 ${right-2} 23 ${right+5} 28 ${left+16} 38Z`} fill="#172024" />
        <text x={left+width*.36} y="32" transform={`rotate(-8 ${left+width*.36} 32)`} fill="#d2d9d7" fontSize="3.5" fontFamily="Arial,sans-serif" letterSpacing=".4">{label}</text>
        <path d={`M${left+2} 35v19m4-15v18m5-13v16`} stroke="#90999c" strokeWidth=".8" />
      </>;
      break;
    }
    case 'motherboard': {
      const p = profile?.category === 'motherboard' ? profile : undefined;
      const height = p ? 66*p.heightMm/305 : 66;
      const width = p ? 55*p.widthMm/244 : 55;
      artwork = <g transform={`matrix(.88,-.1,.3,.83,${(120-width*.88-height*.3)/2},${(90-height*.83)/2})`}>
        <rect x="1" y="4" width={width} height={height} fill="#111a1a" stroke="#5e6c70" />
        <rect width={width} height={height} rx="1" fill={p?.pcbColor || fill('board')} stroke="#82958a" strokeWidth="1" />
        <path d={`M9 0v17h13v${height*.32}H5m17-20h${width*.45}v${height*.46}M0 35h14v${height*.28}h${width*.38}V${height*.7}h${width*.2}M28 0v9h${width*.3}`} fill="none" stroke="#91a385" opacity=".4" strokeWidth=".7" />
        <rect x={width*.24} y="11" width="19" height="21" rx="1" fill="#a7b5af" stroke="#d5ded9" strokeWidth=".7" />
        <rect x={width*.24+3} y="14" width="13" height="15" fill="#242d2d" stroke="#687b75" />
        <path d={`M1 2h9v${height*.45}H1zM13 1h${width*.44}v6H13Z`} fill={p?.heatsinkColor || '#4e5c5c'} stroke="#a9b5ad" strokeWidth=".6" />
        {Array.from({length:p?.slots || 4},(_,i)=><rect key={i} x={width-4-i*3.4} y="9" width="2.3" height={height*.42} fill={i%2 ? '#6d7e70' : '#c2ccc3'} />)}
        <rect x="8" y={height*.65} width={width*.58} height="4" fill="#a1aaa2" /><rect x="8" y={height*.79} width={width*.56} height="3" fill="#6e7b73" />
        <path d={`m${width*.79} ${height*.7} 8 3v12l-13-5Z`} fill={p?.heatsinkColor || '#53615a'} stroke="#7e8c70" />
        <path d={`m${width*.76} ${height*.8} 7 2m-7 1 7 2`} stroke={accent} strokeWidth="1" />
        {[5,10,15,20].map(x=><circle key={x} cx={x} cy={height-3} r="1.2" fill="#b4b48a" />)}
      </g>;
      break;
    }
    case 'ram': {
      const p=profile?.category==='ram'?profile:undefined;
      const rgb=p ? p.rgb : true;
      const count=Math.min(4,p?.sticks || 2);
      const barHeight=p ? Math.min(27,18+p.heightMm*.16) : 27;
      artwork=<g transform={count>2 ? 'translate(5 -7) scale(.88)' : undefined}>
        {Array.from({length:count},(_,i)=><g key={i} transform={`translate(${i*7} ${i*14})`}>
          <path d="m17 22 69-11 8 5-69 11Z" fill={rgb ? accent : shell} stroke={rgb ? '#e2ffc9' : '#7b8c8c'} strokeWidth=".5" />
          <path d={`m25 27 69-11v${barHeight}L25 ${27+barHeight}Z`} fill={p?.heatspreaderColor || fill('graphite')} stroke="#7f9184" strokeWidth=".7" />
          <path d={`m17 22 8 5v${barHeight}l-8-6Z`} fill={shell} />
          <path d="m29 32 17-3v12l-17 3Zm44-7 17-3v12l-17 3Z" fill="#202c30" stroke="#849282" strokeWidth=".5" />
          <path d={`m29 ${24+barHeight} 61-12v5L29 ${29+barHeight}Z`} fill="#b9a163" />
          {Array.from({length:17},(_,j)=><path key={j} d={`m${31+j*3.3} ${24+barHeight-j*.65} 0 4`} stroke="#4f4e32" strokeWidth=".7" />)}
          <text x="50" y="37" transform="rotate(-10 50 37)" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="4.3" fill="#d8e2d5">{component?.memoryType || 'DDR5'}</text>
        </g>)}
      </g>;
      break;
    }
    case 'storage': {
      const p=profile?.category==='storage'?profile:undefined;
      artwork=<>
        <path d="m10 45 82-17 19 14-82 18Z" fill={shell} stroke="#7e9984" />
        <path d="m10 45 19 15v4l82-18v-4L29 60Z" fill="#1b2a28" />
        <path d="m17 44 72-14 14 10-72 16Z" fill={p?.labelColor || '#24292c'} stroke="#909b97" strokeWidth=".7" />
        <path d="m22 45 13-3 8 6-13 3Zm19-4 13-3 8 6-13 3Z" fill="#4d5a5b" />
        <path d="m60 37 26-5 11 8-26 6Z" fill={accent} />
        <path d="m92 28 8-1 15 12-5 2Z" fill="#c5a95d" /><path d="m99 30 10 8m-7-9 10 8" stroke="#52533a" strokeWidth=".8" />
        <circle cx="19" cy="48" r="2.3" fill="#0b1510" stroke="#c3d1c1" />
        {p?.hasHeatsink && <g><path d="m21 36 65-13 15 12-65 14Z" fill="#3d4c50" stroke="#92a3a5" />{Array.from({length:8},(_,i)=><path key={i} d={`m${25+i*7.5} ${36-i*1.5} 10 8`} stroke="#101b20" strokeWidth="2" />)}</g>}
        <text x="68" y="39" transform="rotate(-12 68 39)" fill="#25342d" fontFamily="Arial,sans-serif" fontSize="4" fontWeight="700">NVMe</text>
      </>;
      break;
    }
    case 'cooler': {
      const p=profile?.category==='cooler'?profile:undefined;
      if(p?.kind==='aio') {
        const count=p.fanCount;
        const radiatorWidth=count===3?87:65;
        const left=(120-radiatorWidth)/2-8;
        artwork=<>
          <path d={`M${left} 14 ${left+radiatorWidth} 7l12 8-${radiatorWidth} 8Z`} fill={p.color} stroke="#9aa9ac" strokeWidth=".7" />
          <path d={`M${left+12} 23 ${left+radiatorWidth+12} 15v22l-${radiatorWidth} 8Z`} fill={p.finColor} stroke="#8b9a9e" strokeWidth=".7" />
          <path d={`M${left} 14l12 9v22l-12-8Z`} fill={p.fanColor} stroke="#7b898c" strokeWidth=".6" />
          <g transform={`translate(${left+12} 22) skewY(-5)`}>{Array.from({length:count},(_,i)=>fan((i+.5)*radiatorWidth/count,11,10,p.fanRgb || false,p.fanColor))}</g>
          <path d={`M${left+12} 40C5 55 13 75 46 65M${left+18} 42C20 55 27 81 52 69`} fill="none" stroke={p.tubeColor || '#1d292f'} strokeWidth="4.5" strokeLinecap="round" />
          <path d={`M${left+12} 40C5 55 13 75 46 65M${left+18} 42C20 55 27 81 52 69`} fill="none" stroke="#76868b" strokeWidth=".7" strokeLinecap="round" />
          <path d="m44 55 25-6 17 12-25 8Z" fill={p.pumpColor || shell} stroke="#b5c1c1" strokeWidth=".7" />
          <path d="m44 55 17 14 25-8v11l-25 8-17-15Z" fill={p.pumpColor || shell} stroke="#7a8c8d" strokeWidth=".7" />
          {p.pumpDisplay==='lcd'?<g transform="translate(58 58) rotate(-13) skewX(25)"><rect x="-6" y="-4" width="19" height="12" rx="2" fill="#121e29" stroke="#7fa8b4" strokeWidth=".7"/><text x="3" y="4" textAnchor="middle" fontSize="6" fontFamily="Arial,sans-serif" fill="#83d9eb">32°</text></g>:<ellipse cx="64" cy="59" rx="11" ry="5.5" transform="rotate(-12 64 59)" stroke={p.rgb?accent:'#a2afb2'} strokeWidth={p.rgb?1.7:1} fill="#182329"/>}
          <text x="101" y="71" textAnchor="end" fill="#b8c4c5" fontFamily="Arial,sans-serif" fontSize="5">{p.radiatorSizeMm || (count===3?360:240)} mm</text>
        </>;
      } else if(p?.kind==='low-profile') {
        artwork=<>
          <path d="m24 36 43-11 28 17-44 14Z" fill={p.finColor} stroke="#bdc6c6" />
          <path d="m24 36 27 20 44-14v12L51 69 24 49Z" fill={p.finColor} stroke="#73858c" />
          {[0,1,2,3].map(i=><path key={i} d={`m25 ${40+i*3} 26 18 43-14`} stroke="#47585f" fill="none" />)}
          <g transform="matrix(1,-.27,.5,.62,61,41)">{fan(0,0,24,p.rgb,p.fanColor)}</g>
          <path d="m47 69 0 7m16-11 0 7" stroke="#b5aa97" strokeWidth="3" />
        </>;
      } else {
        artwork=<>
          <path d="m33 20 37-8 24 12-36 9Z" fill={p?.color || '#7d8585'} stroke="#c2cdca" strokeWidth=".7" />
          <path d="m33 20 25 13v38L33 58Z" fill={p?.finColor || '#59676b'} />
          <path d="m58 33 36-9v38l-36 9Z" fill={p?.finColor || '#7f8a8c'} stroke="#aab4b3" strokeWidth=".7" />
          {Array.from({length:12},(_,i)=><path key={i} d={`m34 ${23+i*3} 24 12 35-9`} fill="none" stroke={i%2?'#a9b0ac':'#283234'} strokeWidth="1" />)}
          <path d="m28 32 29 8v34l-29-9Z" fill={p?.fanColor || '#1e2426'} stroke="#7e8d89" />
          <g transform="matrix(.88,.28,0,1,42,52)">{fan(0,0,14,p?.rgb || false,p?.fanColor)}</g>
          <path d="m63 71-2 7m11-9-2 7m10-9-2 7" stroke="#b7a68e" strokeWidth="3" strokeLinecap="round" />
          <path d="m37 23 28-6m-21 9 28-6m-21 9 28-6" stroke="#c6cdca" strokeWidth="1.5" />
        </>;
      }
      break;
    }
    case 'psu': {
      const p=profile?.category==='psu'?profile:undefined;
      artwork=<g transform={p?.format==='SFX'?'translate(12 10) scale(.8)':undefined}>
        <path d="m18 28 44-12 39 22-46 14Z" fill={shell} stroke="#8c999c" strokeWidth=".8" />
        <path d="m18 28 37 24v26L18 53Z" fill={shell} stroke="#637176" strokeWidth=".8" />
        <path d="m55 52 46-14v27L55 78Z" fill={fill('graphite')} stroke="#7c8b8d" strokeWidth=".8" />
        <g transform="matrix(1,-.29,.64,.56,60,34)">{fan(0,0,23)}</g>
        <path d="m61 55 31-9v15l-31 9Z" fill="#212a2c" stroke={accent} strokeWidth=".7" />
        <text x="65" y="62" transform="rotate(-16 65 62)" fill="#e0e8db" fontSize="7" fontFamily="Arial,sans-serif" fontWeight="700">{component?.wattage || 750}W</text>
        <path d="m25 40 12 8v9l-12-8Z" fill="#0e1315" stroke="#a2aeb0" /><path d="m42 53 6 4v7l-6-4Z" fill="#0d1213" stroke="#6b7471" />
      </g>;
      break;
    }
    case 'case': {
      const p=profile?.category==='case'?profile:undefined;
      const short=p?.kind==='sandwich', panoramic=p?.kind==='panoramic';
      const compact=p?.kind==='compact';
      const front=p?.frontColor || '#263134', frame=p?.frameColor || '#3f4849';
      const wood=p?.woodAccent || p?.kind==='wood-front';
      const count=Math.min(3,p?.fanCount ?? 3);
      const height=short?42:compact?57:66;
      const top=short?26:10, bottom=top+height;
      const frontWidth=panoramic?38:short?29:31;
      const sideWidth=short?40:23;
      const left=(120-frontWidth-sideWidth)/2;
      const edge=left+sideWidth, right=edge+frontWidth;
      artwork=<>
        <path d={`M${left} ${top} ${left+frontWidth} ${top-7} ${right} ${top+5} ${edge} ${top+12}Z`} fill={frame} stroke="#9aa7a7" strokeWidth=".6" />
        <path d={`M${left} ${top} ${edge} ${top+12}v${height-10}L${left} ${bottom-10}Z`} fill={shell} stroke="#7b8e8d" strokeWidth=".8" />
        <path d={`M${edge} ${top+12} ${right} ${top+5}v${height-10}L${edge} ${bottom+2}Z`} fill={front} stroke="#8c9d9b" strokeWidth=".8" />
        {(p?.glass || p?.sidePanel==='acrylic' || !p) ? <>
          <path d={`M${left+3} ${top+8} ${edge-3} ${top+17}v${height-25}L${left+3} ${bottom-17}Z`} fill="#13262d" fillOpacity=".8" stroke="#78959a" strokeWidth=".65" />
          <path d={`m${left+5} ${top+height*.52} ${sideWidth-10} 6v5l-${sideWidth-10}-6Z`} fill="#80988f" />
          <path d={`m${left+5} ${top+19} 4 2v9l-4-2Z`} fill="#5f7481" />
        </> : <g>{Array.from({length:short?12:6},(_,i)=><path key={i} d={`M${left+3+i*(sideWidth-6)/(short?12:6)} ${top+8+i*(9/(short?12:6))}v${height-25}`} stroke="#142020" strokeWidth="1.2" />)}</g>}
        {panoramic ? <>
          <path d={`M${edge+3} ${top+16} ${right-3} ${top+10}v${height-21}L${edge+3} ${bottom-7}Z`} fill="#20323a" fillOpacity=".75" stroke="#738d94" strokeWidth=".6" />
          <path d={`M${edge+7} ${top+22} ${right-7} ${top+18}M${edge+7} ${top+26} ${right-7} ${top+22}`} stroke="#687c83" strokeWidth="2" />
          <path d={`M${edge+7} ${top+height*.6} ${right-7} ${top+height*.6-4}v5l-${frontWidth-14} 4Z`} fill="#8d9ba2" />
        </> : wood ? <>
          <path d={`M${edge+2} ${short?bottom-10:top+15} ${right-2} ${short?bottom-16:top+9}v${short?10:height-18}L${edge+2} ${bottom}Z`} fill={short?'#a27d58':'#926f50'} />
          {!short&&Array.from({length:8},(_,i)=><path key={i} d={`M${edge+4+i*3.2} ${top+15-i*.65}v${height-18}`} stroke={i%2?'#d4aa78':'#382c24'} strokeWidth={i%2?1.5:1.8} />)}
          {short&&<circle cx={edge+frontWidth/2} cy={top+20} r="1.3" fill="#d2dfcf" />}
        </> : <>
          <g transform={`matrix(1,-.23,0,1,${edge+frontWidth/2},${top+24})`}>{Array.from({length:count},(_,i)=>fan(0,i*16,7.3,p?.fanRgb ?? true))}</g>
          {(p?.kind==='airflow'||compact)&&Array.from({length:12},(_,i)=><path key={i} d={`M${edge+3+i*2.1} ${top+16-i*.45}v${height-17}`} stroke="#8e9da1" strokeWidth=".45" opacity=".5" />)}
        </>}
        <path d={`m${edge+3} ${bottom+2}v3m${frontWidth-8}-9v4M${left+4} ${bottom-9}v4`} stroke="#263238" strokeWidth="3" />
        <path d={`m${edge+4} ${top+4} 8-2m2-1 3-.5`} stroke="#ced8d4" strokeWidth="1" />
      </>;
      break;
    }
    default:
      artwork=<rect x="35" y="20" width="50" height="50" rx="9" fill={fill('graphite')} stroke="#607056" />;
  }
  return <svg className={className} viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-component-id={component?.id} data-visual-kind={profile && 'kind' in profile ? profile.kind : category}>
    <defs>
      <linearGradient id={`${id}-silver`} x1="32" y1="20" x2="78" y2="55" gradientUnits="userSpaceOnUse"><stop stopColor="#eef1eb"/><stop offset=".45" stopColor="#adb8b5"/><stop offset=".52" stopColor="#e4e8df"/><stop offset="1" stopColor="#869492"/></linearGradient>
      <linearGradient id={`${id}-edge`} x1="30" y1="32" x2="90" y2="54" gradientUnits="userSpaceOnUse"><stop stopColor="#828e8b"/><stop offset=".4" stopColor="#c6ceca"/><stop offset="1" stopColor="#5c6a69"/></linearGradient>
      <linearGradient id={`${id}-graphite`} x1="20" y1="20" x2="90" y2="75" gradientUnits="userSpaceOnUse"><stop stopColor={shell}/><stop offset=".4" stopColor={profile ? shell : '#3b464a'}/><stop offset="1" stopColor="#18232a"/></linearGradient>
      <linearGradient id={`${id}-board`} x1="0" y1="0" x2="55" y2="66" gradientUnits="userSpaceOnUse"><stop stopColor="#37493b"/><stop offset="1" stopColor="#1e3027"/></linearGradient>
      <linearGradient id={`${id}-blade`} x1="-10" y1="-10" x2="10" y2="10" gradientUnits="userSpaceOnUse"><stop stopColor="#879798"/><stop offset=".45" stopColor="#485c63"/><stop offset="1" stopColor="#1c2b32"/></linearGradient>
      <radialGradient id={`${id}-shadow`}><stop stopColor="#000" stopOpacity=".5"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
    </defs>
    <ellipse cx="62" cy="79" rx="47" ry="8" fill={fill('shadow')}/>{artwork}
  </svg>;
}
