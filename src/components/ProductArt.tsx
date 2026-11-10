import { useId, useState } from 'react';
import IndividualProductArt from './IndividualProductArt';
import AioPumpArt from './AioPumpArt';
import CaseFacePattern from './CaseFacePattern';
import MemoryHeatspreaderArt from './MemoryHeatspreaderArt';
import {getMemoryAppearance,getMemoryAppearanceColor} from '../data/memoryAppearance';
import {coolerAppearances,caseAppearances} from '../data/hardwareAppearance';
import {getProductImage} from '../data/productImages';
import type { Component } from '../data/catalog';
import { getVisualProfile } from '../data/visualProfiles';

type ProductArtProps = {
  category: string;
  brand?: string;
  className?: string;
  component?: Component;
  /** Extra engraving and surface detail for the large product preview. */
  detailed?: boolean;
  /** Allows offline review of the reconstructed fallback independently of photos. */
  preferIllustration?: boolean;
};

/** Specification-based illustrations: appearance cues, not manufacturer CAD or photographs. */
export default function ProductArt({ category, brand, className, component, detailed = false, preferIllustration = false }: ProductArtProps) {
  const id = `hardware-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const profile = getVisualProfile(component);
  const memoryShellColor = getMemoryAppearanceColor(component);
  const productImage=preferIllustration?undefined:getProductImage(component);
  const [loadedImage,setLoadedImage]=useState<string|null>(null);
  const photoVisible=!!productImage&&loadedImage===productImage.imageURL;
  const paint = (name: string) => `url(#${id}-${name})`;
  const accent = profile?.accent || '#b3f472';
  const shell = profile?.color || '#30383a';
  const maker = component?.brand || brand || '';
  const model = (component?.name || '').replace(maker, '').trim();
  const engraving = model.replace(/AMD |Intel |Ryzen |Core |GeForce |Radeon /g, '').slice(0, 19);
  const metal = paint('silver');
  const mix = (color: string, target: number, strength: number) => {
    if (!/^#[0-9a-f]{6}$/i.test(color)) return color;
    return '#' + [1, 3, 5].map((start) => Math.round(parseInt(color.slice(start, start + 2), 16) * (1 - strength) + target * strength).toString(16).padStart(2, '0')).join('');
  };
  const surfaces = {
    shell,
    shroud: profile?.category === 'gpu' ? profile.shroudColor : shell,
    backplate: profile?.category === 'gpu' ? profile.backplateColor : shell,
    frame: profile?.category === 'case' ? profile.frameColor : shell,
    front: profile?.category === 'case' ? profile.frontColor : shell,
    heatspreader: memoryShellColor ?? (profile?.category === 'ram' ? profile.heatspreaderColor : shell),
    pump: profile?.category === 'cooler' ? profile.pumpColor || shell : shell,
    pcb: profile?.category === 'motherboard' ? profile.pcbColor : '#24342e',
    heatsink: profile?.category === 'motherboard' ? profile.heatsinkColor : profile?.category === 'cooler' ? profile.finColor : shell,
  };
  const surfaceNames = category === 'gpu' ? ['shroud', 'backplate']
    : category === 'case' ? ['shell', 'frame', 'front']
    : category === 'ram' ? ['heatspreader']
    : category === 'cooler' ? ['pump','heatsink']
    : category === 'motherboard' ? ['pcb','heatsink']
    : category === 'psu' ? ['shell'] : [];
  const rainbow = <><stop stopColor="#63e7ff"/><stop offset=".24" stopColor="#7393ff"/><stop offset=".48" stopColor="#b580ff"/><stop offset=".72" stopColor="#ff83d5"/><stop offset="1" stopColor="#83f6dd"/></>;

  const light = (color?: string) => {
    if (!color || !/^#[0-9a-f]{6}$/i.test(color)) return false;
    return parseInt(color.slice(1,3),16)*.299+parseInt(color.slice(3,5),16)*.587+parseInt(color.slice(5,7),16)*.114 > 165;
  };
  const screw = (x: number, y: number, size = .85) => <g key={`s-${x}-${y}`}>
    <circle cx={x} cy={y} r={size} fill="#9eaaad" stroke="#131b20" strokeWidth=".3" />
    <path d={`m${x-size*.5} ${y}h${size}m-${size*.5} -${size*.5}v${size}`} stroke="#303b40" strokeWidth=".35" />
  </g>;
  let fanSequence = 0;
  const fan = (x: number, y: number, r: number, glowing = false, fanColor = '#253039', square = false, detail?: {roundedFrame?:boolean;bladeCount?:number;bladeColor?:string}) => {
    const rotorId = `${id}-rotor-${fanSequence++}`;
    const blades=detail?.bladeCount??9;
    return <g data-art-part="fan" data-fan-frame={square?detail?.roundedFrame?'round':'square':'axial'} data-blade-count={blades} key={`f-${x}-${y}-${r}`} transform={`translate(${x} ${y})`} data-rgb-zone={glowing ? "fan" : undefined}>
      <defs><radialGradient id={rotorId} cx=".35" cy=".25" r=".8"><stop stopColor={mix(fanColor,255,.38)}/><stop offset=".42" stopColor={fanColor}/><stop offset=".76" stopColor={mix(fanColor,0,.38)}/><stop offset="1" stopColor={mix(fanColor,255,.09)}/></radialGradient></defs>
      {square && <>{detail?.roundedFrame?<><circle r={r+2.2} fill={fanColor} stroke="#77858b" strokeWidth=".45"/>{[-1,1].flatMap(a=>[-1,1].map(b=><rect key={`${a}-${b}`} x={a*(r*.77)-2.5} y={b*(r*.77)-2.5} width="5" height="5" rx="1.3" fill={fanColor} stroke="#77858b" strokeWidth=".35"/>))}</>:<rect x={-r-2.2} y={-r-2.2} width={r*2+4.4} height={r*2+4.4} rx="2" fill={fanColor} stroke="#77858b" strokeWidth=".45" />}{[-1,1].flatMap(a=>[-1,1].map(b=>screw(a*(detail?.roundedFrame?r*.77:r+.4),b*(detail?.roundedFrame?r*.77:r+.4),.65)))}</>}
      <circle r={r+1} fill={`url(#${rotorId})`} stroke="#6e7a7e" strokeWidth=".65" />
      {glowing && <circle r={r-.25} fill="none" stroke={paint('rgb')} strokeWidth="3.6" opacity=".19" />}
      <circle r={r-.35} fill="#10181c" stroke={glowing ? paint('rgb') : '#445159'} strokeWidth={glowing ? 1.65 : .55} />
      {glowing && <circle r={r-.35} fill="none" stroke="#d5edff" strokeWidth=".3" opacity=".8" />}
      {Array.from({ length: blades }, (_, i) => <g key={i} transform={`rotate(${i*360/blades})`}>
        <path d={`M-1 -1 C${-r*.7} ${-r*.33},${-r*.9} ${-r*.83},${-r*.30} ${-r*.92} Q${r*(blades<=5?.55:.14)} ${-r*.94},${r*(blades<=5?.66:.25)} ${-r*(blades<=5?.65:.76)} Q${-r*.34} ${-r*.48},1 1Z`} fill={glowing ? paint('rgb-blades') : detail?.bladeColor??`url(#${rotorId})`} stroke={glowing ? '#dae7f7' : '#7f9096'} strokeWidth=".22" />
        <path d={`M-1 -1Q${-r*.36} ${-r*.35},${-r*.3} ${-r*.86}`} stroke={mix(fanColor,0,.65)} strokeWidth=".75" opacity=".55"/>
        {detailed && <path d={`M-2 -3Q${-r*.48} ${-r*.55},${-r*.26} ${-r*.82}`} stroke="#bac5c8" strokeWidth=".2" opacity=".4" />}
      </g>)}
      <circle r={r*.27} fill={paint('hub')} stroke="#919b9d" strokeWidth=".4" />
      <circle r={r*.16} fill={`url(#${rotorId})`} />
      <path d={`M${-r*.72} ${-r*.72}A${r+1} ${r+1} 0 0 1 ${r*.68} ${-r*.76}`} stroke="#eef2f1" strokeWidth=".35" opacity=".55"/>
      {glowing && <circle r={r*.27} fill="none" stroke={paint('rgb')} strokeWidth=".65" opacity=".85" />}
      {detailed && <path d={`M-${r*.11} 0h${r*.22}`} stroke="#bec8c9" strokeWidth=".45" />}
    </g>;
  };
  let artwork;
  switch (category) {
    case 'cpu': {
      const intel = maker.toLowerCase().includes('intel');
      const pga = component?.socket === 'AM4';
      const am5 = component?.socket === 'AM5' || (!component && !intel);
      const cpuProfile=profile?.category==='cpu'?profile:undefined;
      const width = cpuProfile?cpuProfile.widthMm*1.275:intel ? 47.8 : 51;
      const height = cpuProfile?cpuProfile.heightMm*1.275:intel ? 57.4 : 51;
      const ihs = am5
        ? 'M10 5H20V9H30V5H41V14H46V24H42V30H46V40H37V45H27V41H21V45H11V36H6V26H10V20H6V10H10Z'
        : `M6 6H${width-6}V${height-6}H6Z`;
      artwork = <g data-package={component?.socket??(intel?'LGA1700':'AM5')} transform={`matrix(1,-.24,.56,.66,${intel?21:21},30)`}>
        <path d={`M0 ${height}v5h${width}v-5M${width} 0v${height+5}`} fill="#1b342c" stroke="#4c6859" strokeWidth="1.2" />
        <rect width={width} height={height} rx="1.4" fill="#255542" stroke="#b0b888" strokeWidth=".7" />
        <path d={`M1.2 1.2h${width-2.4}M1.2 ${height-1.2}h${width-2.4}`} stroke="#97b58b" strokeWidth=".45" />
        {intel&&<path d={`M0 ${height*.28}a1.5 1.5 0 0 1 0 3M${width} ${height*.28}a1.5 1.5 0 0 0 0 3M0 ${height*.71}a1.5 1.5 0 0 1 0 3M${width} ${height*.71}a1.5 1.5 0 0 0 0 3`} fill="#152925" stroke="#92aa90" strokeWidth=".4"/>}
        {detailed && <path d={`M4 ${height*.36}v${height*.25}h2M${width-4} ${height*.36}v${height*.25}h-2`} stroke="#c7bf7a" strokeWidth=".3" opacity=".75" />}
        {pga && Array.from({length:detailed?20:13},(_,i)=><g key={i}>
          <path d={`M${2+i*(width-4)/(detailed?20:13)} ${height+1}v2.8M${2+i*(width-4)/(detailed?20:13)} .8v1.5`} stroke="#dfbd68" strokeWidth=".7" />
        </g>)}
        {[9,15,21,27,33,39].map((y)=><g key={y}><rect x="1.8" y={y} width="2" height="1.4" fill="#b9b496"/><rect x={width-3.7} y={y} width="2" height="1.4" fill="#b9b496"/></g>)}
        <path d={ihs} transform="translate(0 2.2)" fill="#7d8987" stroke="#435653" strokeWidth=".6" />
        <path d={ihs} data-art-part="heat-spreader" fill={metal} stroke="#edf1ec" strokeWidth=".8" strokeLinejoin="round" />
        <path d={ihs} fill={paint('brushed')} opacity=".25" />
        <path d={ihs} transform="translate(.4 -.4)" fill="none" stroke="#f0f3ed" strokeWidth=".25" opacity=".5" />
        <path d={`M13 13H${width-12}M13 ${height-12}H${width-12}`} stroke="#f1f4ec" strokeWidth=".65" opacity=".7" />
        <text x={width/2} y={height*.38} textAnchor="middle" fill="#475552" fontFamily="Arial,sans-serif" fontSize={intel?7:4.7} fontWeight="700">{intel?'intel':maker.toUpperCase() || 'CPU'}</text>
        <text x={width/2} y={height*.56} textAnchor="middle" fill="#58635f" fontFamily="Arial,sans-serif" fontSize={intel?4.3:7} fontWeight={intel?'400':'700'} letterSpacing={intel?1:'.35'}>{/\bCore\b/i.test(model)?'CORE':/\bRyzen\b/i.test(model)?'RYZEN':''}</text>
        <text x={width/2} y={height*.68} textAnchor="middle" fill="#626e67" fontFamily="Arial,sans-serif" fontSize="2.9">{engraving || component?.socket || ''}</text>
        {detailed && <><text x={width/2} y={height*.77} textAnchor="middle" fill="#728079" fontFamily="monospace" fontSize="1.75">{component?.socket} · PROCESSOR</text><g transform={`translate(${width-14} ${height-16})`}>{[0,1,2].flatMap(y=>[0,1,2].map(x=><rect key={`${x}-${y}`} x={x} y={y} width=".65" height=".65" fill="#6c7972"/>))}</g></>}
        <path d={`M2 ${height-3}l3 1.3-3 1.3Z`} fill="#e1c97d" />
      </g>;
      break;
    }
    case 'gpu': {
      const p = profile?.category === 'gpu' ? profile : undefined;
      const count = p?.fanCount ?? 3;
      const width = p ? Math.min(94, Math.max(45, p.lengthMm*.27)) : 89;
      const depth = p ? Math.min(38,Math.max(17,width*p.heightMm/p.lengthMm*.88)) : 30;
      const left = (120-width-12)/2;
      const top = 30;
      const flow = p?.fanLayout === 'flow-through';
      const chipset = `${component?.name ?? ''} ${component?.specs.join(' ') ?? ''}`;
      const label = /\bRadeon\s+Pro\b/i.test(chipset) ? 'RADEON PRO'
        : /\bRX\s*\d{3,4}/i.test(chipset) ? 'RADEON RX' : /\bRadeon\b/i.test(chipset) ? 'RADEON'
        : /\bArc\b/i.test(chipset) ? 'INTEL ARC' : /\bQuadro\b/i.test(chipset) ? 'NVIDIA QUADRO'
        : /\bRTX\s*(?:PRO|[A-Z]\d|[1-6]000\b)/i.test(chipset) ? 'NVIDIA RTX'
        : /\bGTX\s*\d/i.test(chipset) ? 'GEFORCE GTX' : /\bRTX\s*\d/i.test(chipset) ? 'GEFORCE RTX' : 'GPU';
      artwork = <g transform={`translate(${left} ${top})`}>
        <path d={`M0 0 ${width} -12 ${width+12} -3 12 9Z`} fill={paint('backplate-surface')} stroke="#9aa6aa" strokeWidth=".65" />
        {Array.from({length:detailed?34:22},(_,i)=><path key={i} d={`M${12+i*(width-16)/(detailed?34:22)} 5.7l4-4`} stroke="#101a20" strokeWidth=".65"/>)}
        <path d={`M12 9 ${width+12} -3v${depth}L12 ${depth+9}Z`} fill={paint('shroud-surface')} stroke="#8c9ba1" strokeWidth=".8" />
        <path d={`M13 9 ${width+11} -2M13 ${depth+7} ${width+11} ${depth-5}`} stroke={mix(p?.shroudColor || shell, 255, .4)} strokeWidth=".45" />
        <path d={`M0 0 12 9v${depth}L0 ${depth-3}Z`} fill={paint('graphite')} stroke="#79878c" strokeWidth=".65" />
        <g transform={`translate(12 9) skewY(${-Math.atan(12/width)*180/Math.PI})`}>
          <path data-art-part="fin-stack" d={`M4 3h${width-8}v${depth-6}H4Z`} fill="#10181b" stroke="#48565d" strokeWidth=".6" />
          {Array.from({length:detailed?32:20},(_,i)=><path key={`fin-${i}`} d={`M${5+i*(width-10)/(detailed?32:20)} 4v${depth-8}`} stroke="#6b7477" strokeWidth=".35" opacity=".65"/>)}
          {flow && count>0 ? <>
            {fan(width*.26,depth/2,depth*.4,false,'#334048')}
            <path d={`M${width*.53} 2 ${width*.73} ${depth/2} ${width*.53} ${depth-2}M${width*.95} 2 ${width*.73} ${depth/2} ${width*.95} ${depth-2}`} stroke="#b6bdb9" strokeWidth="3" />
            {Array.from({length:13},(_,i)=><path key={i} d={`M${width*.59+i*2.2} 5v${depth-10}`} stroke="#74838a" strokeWidth=".55" />)}
          </> : Array.from({length:count},(_,i)=>fan((i+.5)*width/count,depth/2,Math.min(depth*.4,width/count*.4),p?.fanRgb === true,'#334048'))}
          <path d={`M2 3h6m${width-16} 0h6M2 ${depth-3}h6m${width-16} 0h6`} stroke={p?.shroudColor || '#8d9799'} strokeWidth="2" />
          {[3,width-3].flatMap(x=>[2,depth-2].map(y=>screw(x,y,.7)))}
          {p?.rgb && <g data-rgb-zone="gpu-strip"><path d={`M7 ${depth-.9}h${width-14}`} stroke={paint('rgb-line')} strokeWidth="3.3" opacity=".18" /><path d={`M7 ${depth-.9}h${width-14}`} stroke={paint('rgb-line')} strokeWidth="1.35" /></g>}
        </g>
        <path d={`M${width*.5} -6l10-1.2 3 2.2-10 1.3Z`} fill="#0c1418" stroke="#5d6b6e" strokeWidth=".5" />
        {Array.from({length:6},(_,i)=><path key={i} d={`M${width*.5+1+i*1.4} -5.7l1.3 1.1`} stroke="#a9b0a8" strokeWidth=".4"/>)}
        <text x={width*.32} y=".5" transform={`rotate(-7.5 ${width*.32} .5)`} fill={light(p?.backplateColor)?'#34443f':'#e1e7e4'} fontSize="3.4" fontFamily="Arial,sans-serif" fontWeight="700" letterSpacing=".35">{label}</text>
        {[0,1,2].map(i=><path key={i} d={`M2 ${9+i*6}l6 4v2l-6-4Z`} fill="#0d171d" stroke="#a5b0b4" strokeWidth=".5"/>)}
        <path d={`M26 ${depth+8}l22-2.8v3l-22 2.8Z`} fill={paint('gold')} />
        <path d={Array.from({length:14},(_,i)=>`M${27+i*1.5} ${depth+8-(1+i*1.5)*.127}v2.8`).join(' ')} stroke="#6e613d" strokeWidth=".45" />
        {detailed && component?.capacityGB && <text x={width*.85} y="-5.5" transform={`rotate(-7.5 ${width*.85} -5.5)`} textAnchor="end" fill={light(p?.backplateColor)?'#3c4b47':'#c4ceca'} fontSize="2.3" fontFamily="Arial,sans-serif">{component.capacityGB} GB</text>}
        {detailed && <text x="20" y={depth+5} transform="rotate(-7.5)" fill={light(p?.shroudColor)?'#42524d':'#a6b2b7'} fontSize="2.1" fontFamily="Arial,sans-serif">{maker.toUpperCase()}</text>}
      </g>;
      break;
    }
    case 'motherboard': {
      const p = profile?.category === 'motherboard' ? profile : undefined;
      const height = p ? 70*p.heightMm/305 : 70;
      const width = p ? 57*p.widthMm/244 : 57;
      const slots = p?.slots || 4;
      const socketX = width*.28, socketY = height*.19, socketW = width*.29, socketH = height*.26;
      artwork = <g transform={`matrix(.94,-.15,.3,.88,${(120-width*.94-height*.3)/2},${(90-height*.88+width*.15)/2-2})`}>
        <rect x="1" y="2" width={width} height={height} rx="1" fill="#0c151a" stroke="#52615f" />
        <rect data-art-part="pcb" width={width} height={height} rx="1" fill={paint('pcb-surface')} stroke="#87948c" strokeWidth=".65" />
        {Array.from({length:detailed?11:7},(_,i)=><path key={i} d={`M${8+i*1.9} ${height*.42}v${5+i*.8}l${6+i*.4} 7v${height*.19}h${width*.4-i*2.1}`} fill="none" stroke="#8d9774" opacity=".32" strokeWidth=".35" />)}
        <path d={`M${width*.45} 2v7h${width*.23}v${height*.38}h${width*.23}M4 ${height*.72}h8v${height*.18}`} fill="none" stroke="#97a68f" strokeWidth=".45" opacity=".4" />
        <rect x="-.8" y="2" width="8" height={height*.4} rx=".8" fill={paint('heatsink-surface')} stroke="#a6b1b0" strokeWidth=".5" />
        {[3,8,13,18].filter(y=>y<height*.4).map(y=><g key={y}><rect x="-2" y={y} width="4" height="3.5" fill="#828f91" stroke="#24313a" strokeWidth=".4"/><path d={`M-1 ${y+1.2}h2v1H-1Z`} fill={y===8?'#246d9c':y===13?'#318c83':'#152431'}/></g>)}
        <path d={`M9 1h${width*.45}v6H9ZM9 8h4v${height*.31}H9Z`} fill={paint('heatsink-surface')} stroke="#8d9a9d" strokeWidth=".5" />
        {[0,1,2,3].map(i=><path key={i} d={`M${11+i*3.6} 2v4`} stroke="#bac3c1" strokeWidth=".5" opacity=".65"/>)}
        {[0,1,2,3,4].map(i=><g key={`vrm-${i}`}><rect x={width*.25+i*3.7} y="8.5" width="2.8" height="2.4" rx=".3" fill="#2b3032" stroke="#88918e" strokeWidth=".25"/><path d={`M${width*.25+.4+i*3.7} 9h2`} stroke="#c0c6bd" strokeWidth=".25"/></g>)}
        <rect data-art-part="socket" x={socketX} y={socketY} width={socketW} height={socketH} rx=".8" fill={metal} stroke="#d3ddda" strokeWidth=".7" />
        <rect x={socketX+2} y={socketY+2} width={socketW-4} height={socketH-4} rx=".4" fill="#23302c" stroke="#8e9b90" strokeWidth=".4" />
        {detailed && Array.from({length:5},(_,i)=><path key={i} d={`M${socketX+3} ${socketY+3+i*(socketH-6)/5}h${socketW-6}`} stroke="#9c9b73" strokeWidth=".45" strokeDasharray=".5 1" />)}
        <path d={`M${socketX+socketW+1} ${socketY+1}v${socketH+1}h-3`} stroke="#bfc9c4" strokeWidth=".7" />
        {Array.from({length:slots},(_,i)=><g key={i}>
          <rect data-art-part="dimm-slot" x={width-5-i*3.1} y={height*.12} width="2.1" height={height*.43} rx=".35" fill={i%2?'#1b2328':'#6d797b'} stroke="#9ca6a1" strokeWidth=".3" />
          <path d={`M${width-4-i*3.1} ${height*.14}v${height*.39}`} stroke="#111a1e" strokeWidth=".65" />
          <path d={`M${width-5.2-i*3.1} ${height*.12}h2.5m-2.5 ${height*.43}h2.5`} stroke="#b1bab3" strokeWidth="1" />
        </g>)}
        <rect x={width-2.2} y={height*.21} width="2" height={height*.25} fill="#111b20" stroke="#84928a" strokeWidth=".45" />
        {(component?.m2Slots??1)>0 && <g data-art-part="m2-mount"><path d={`M8 ${height*.57}h${width*.52}v3.4H8Z`} fill={paint('heatsink-surface')} stroke="#91a19d" strokeWidth=".5" /><path d={`M10 ${height*.57+.8}h${width*.4}`} stroke="#eef0eb" strokeWidth=".3" opacity=".4"/><text x="11" y={height*.57+2.3} fontSize="1.8" fontFamily="Arial,sans-serif" fill={light(p?.heatsinkColor)?'#465051':'#c3cfcc'}>M.2</text></g>}
        {[.67,.84].filter((_,i)=>height>44||!i).map((ratio,i)=><g key={ratio}><rect x="8" y={height*ratio} width={width*.65} height={i?2.3:3.2} rx=".3" fill={i?'#344139':'#b6c2bc'} stroke="#1b2929" strokeWidth=".6" /><path d={`M9 ${height*ratio+1.5}h${width*.61}`} stroke="#182422" strokeWidth=".6" /></g>)}
        <path d={`M${width*.67} ${height*.65}h${width*.23}v${height*.17}l-${width*.23}-2Z`} fill={p?.heatsinkColor || '#526166'} stroke="#91a29d" strokeWidth=".55" />
        <path d={`m${width*.71} ${height*.69} 6 2m-6 1 6 2`} stroke={p?.rgb?paint('rgb-line'):'#b1bcb9'} data-rgb-zone={p?.rgb?'motherboard-chipset':undefined} strokeWidth=".65" />
        {p?.rgb && <g data-rgb-zone="motherboard-heatsink" transform="translate(1 4)"><rect width="4.5" height={height*.22} rx=".7" fill={paint('rgb')} opacity=".85"/><path d={`M.8 1v${height*.2}`} stroke="#e5f7ff" strokeWidth=".35" opacity=".75"/></g>}
        <text x={width*.7} y={height*.8} fontSize="1.9" fill={light(p?.heatsinkColor)?'#40534b':'#c0cbc7'} fontFamily="Arial,sans-serif">{maker.slice(0,7).toUpperCase()}</text>
        {[.68,.77].map(y=><rect key={y} x={width-3} y={height*y} width="3.2" height="4" fill="#111a20" stroke="#687a76" strokeWidth=".6"/>)}
        {[0,1,2,3,4].map(i=><g key={i}><rect x={2+i*3.3} y={height-3} width="2.1" height="1.4" fill="#162026"/><path d={`M${2.3+i*3.3} ${height-2.8}v1M${3.4+i*3.3} ${height-2.8}v1`} stroke="#c9af66" strokeWidth=".35"/></g>)}
        {[.33,.43,.53,.63,.73].map(y=><circle key={y} cx="4.5" cy={height*y} r="1" fill="#a4afaa" stroke="#162b26" strokeWidth=".35" />)}
        {[3,width-3].flatMap(x=>[3,height-6].map(y=>screw(x,y,.8)))}
      </g>;
      break;
    }
    case 'ram': {
      const p = profile?.category === 'ram' ? profile : undefined;
      const memoryDesign = getMemoryAppearance(component);
      const bare = p?.hasHeatspreader === false || component?.memoryHeatspreader === false;
      const rgb = p?.rgb === true && (!bare || component?.rgb === true);
      const count = Math.min(4, component?.memorySticks ?? p?.sticks ?? 2);
      const pcb = p?.pcbColor || (bare ? '#2d684d' : '#253b31');
      const ink = light(memoryShellColor ?? p?.heatspreaderColor) ? '#31433f' : '#e2e8df';
      const h = p ? Math.min(25, 10 + p.heightMm * .3) : bare ? 19.4 : 23;
      const moduleCapacity = component?.capacityGB && component.memorySticks ? component.capacityGB / component.memorySticks : null;
      const organization = component?.memoryRankCount && component.memoryDeviceWidthBits ? `${component.memoryRankCount}Rx${component.memoryDeviceWidthBits}` : '';
      const moduleKind = component?.memoryModuleKind || (component?.memoryRegistered === false && component.memoryModuleFormat === 'DIMM' ? 'UDIMM' : component?.memoryModuleFormat || '');
      const scale = count > 2 ? .83 : 1;
      const offsetX = 60 - (15 + 94 + (count - 1) * 5) * .5 * scale;
      const offsetY = 45 - ((bare ? 3.5 : .5) + 20 + (count - 1) * 14 + h + 3) * .5 * scale;
      const contacts = Array.from({ length: detailed ? 30 : 23 }, (_, index) => {
        const x = 4 + index * (detailed ? 2.2 : 2.9);
        return x < 70 && (x < 33 || x > 37) ? `M${x} ${h - 1}v4` : '';
      }).join(' ');
      artwork = <g transform={`translate(${offsetX} ${offsetY}) scale(${scale})`} data-ram-construction={bare ? 'bare' : 'heatspreader'}>
        {Array.from({ length: count }, (_, i) => <g key={i} data-memory-module={i} transform={`matrix(1,-.18,0,1,${15 + i * 5},${20 + i * 14})`}>
          {bare ? <>
            <path d={`M0 0 3-2.2h74l-3 2.2v${h}l3-2.2V-2.2`} fill={mix(pcb, 0, .22)} stroke="#8da58d" strokeWidth=".45" />
            <path d={`M0 0h74v${h + 2}H37v-3h-3v3H0Z`} fill={pcb} stroke="#88a58b" strokeWidth=".6" />
            <path d={`M1 1h72M1 ${h - 3}h31m6 0h35`} stroke="#a7c397" strokeWidth=".4" opacity=".65" />
            {Array.from({ length: 8 }, (_, chip) => <g key={chip}>
              <path d={`M${3 + chip * 8.6} 4h7.2v${h - 9}h-7.2Z`} fill="#152125" stroke="#80948b" strokeWidth=".4" />
              <path d={`M${3.7 + chip * 8.6} 4.7h5.8`} stroke="#5b706a" strokeWidth=".4" />
              {detailed && <path d={`M${4 + chip * 8.6} 7h4.8m-4.8 1.3h3.1`} stroke="#788b81" strokeWidth=".28" opacity=".8" />}
              <path d={`M${5 + chip * 8.6} ${h - 5}v1.4l1.6 1.2v1.3`} stroke="#c7ba74" strokeWidth=".3" opacity=".65" />
            </g>)}
            {[5, 16, 27, 39, 50, 62, 69].map(x => <g key={x}><rect x={x} y="1.7" width="1.4" height="1" fill="#d3caa7" /><path d={`M${x - .2} 2.2h.4m1.2 0h.4`} stroke="#b0c0b4" strokeWidth=".45" /></g>)}
            <rect x="5" y="4.2" width="33" height={h - 8.3} rx=".5" fill="#ecefe3" stroke="#b9c5b4" strokeWidth=".4" />
            <text x="7.3" y="7.7" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="2.8" fill="#293c35">{maker.toUpperCase()}</text>
            <text x="7.3" y="10.4" fontFamily="Arial,sans-serif" fontSize="2" fill="#34483e">{[moduleCapacity ? `${moduleCapacity} GB` : '', organization].filter(Boolean).join(' · ')}</text>
            <text x="7.3" y="12.7" fontFamily="Arial,sans-serif" fontSize="1.7" fill="#34483e">{component?.memoryType}{component?.memorySpeedMTs ? `-${component.memorySpeedMTs}` : ''}{moduleKind ? ` ${moduleKind}` : ''}</text>
            {detailed && component?.manufacturerPartNumber && <text x="7.3" y="14.6" fontFamily="monospace" fontSize="1.15" fill="#44574b">{component.manufacturerPartNumber}</text>}
            {rgb && <path d="M5-1h65" stroke={paint('rgb-line')} strokeWidth="1.2" data-rgb-zone="ram-diffuser" />}
          </> : memoryDesign ? <>
            <path d={`M0 ${h*.24}h74v${h*.76}H0Z`} fill={pcb}/>
            <MemoryHeatspreaderArt design={memoryDesign} height={h} body={paint('heatspreader-surface')} bodyColor={memoryShellColor ?? p?.heatspreaderColor} ink={ink} rgb={rgb} rainbow={paint('rgb')} brushed={paint('brushed')}/>
          </> : <>
            <path d="M0 0 5-5h74l-5 5Z" fill={rgb ? paint('rgb') : paint('heatspreader-surface')} stroke={rgb ? '#dbeaff' : '#84948b'} data-rgb-zone={rgb ? 'ram-diffuser' : undefined} strokeWidth=".6" />
            {rgb && <><path d="M4-1h70" stroke={paint('rgb-line')} strokeWidth="3.5" opacity=".2" /><path d="M5-3.5h69" stroke="#eef6ff" strokeWidth=".65" opacity=".85" /></>}
            <path d={`M74 0 79-5v${h}l-5 5Z`} fill={paint('graphite')} stroke="#5b6b67" strokeWidth=".5" />
            <rect y="1" width="74" height={h} fill={pcb} />
            {[7, 19, 45, 57].map(x => <rect key={x} x={x} y="5" width="10" height={h - 9} rx=".7" fill="#182126" stroke="#48574f" strokeWidth=".5" />)}
            <path d={`M0 0h74v${h - 3}H48l-5-3H32l-5 3H0Z`} fill={paint('heatspreader-surface')} stroke="#97a39b" strokeWidth=".6" />
            <path d={`M3 3h68v${h-8}H3Z`} fill={paint('brushed')} opacity=".25"/>
            <path d={`M4 3v${h-8}h20m26 0h20V3`} stroke={mix(p?.heatspreaderColor || shell,0,.3)} strokeWidth=".7"/>
            <path d="M4 2h66" stroke="#eef1ee" strokeWidth=".4" opacity=".5"/>
            {[7, 11, 15, 59, 63, 67].map(x => <path key={x} d={`M${x} 4v${h - 10}`} stroke="#b5bdb7" strokeWidth=".35" opacity=".4" />)}
            <path d={`M2 ${h - 4}h24m23 0h23`} stroke={mix(p?.heatspreaderColor || shell, 255, .35)} strokeWidth=".5" />
            <text x="37" y="9" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="3.6" fill={ink}>{maker.toUpperCase()}</text>
            <text x="37" y="14" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="2.5" fill={ink}>{component?.memoryType || 'RAM'}{moduleCapacity ? ` · ${moduleCapacity} GB` : ''}</text>
            {detailed && <text x="37" y="18" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="1.6" fill={ink}>{organization || engraving.slice(0, 23)}</text>}
          </>}
          <path d={`M3 ${h - 1}h31v4H3ZM37 ${h - 1}h34v4H37Z`} fill={paint('gold')} />
          <path d={contacts} stroke="#675d3b" strokeWidth=".55" />
          <path d={`M1.2 ${h - 6}v3m71.6-3v3`} stroke="#d2dccb" strokeWidth=".65" />
        </g>)}
      </g>;
      break;
    }
    case 'storage': {
      const p = profile?.category === 'storage' ? profile : undefined;
      const moduleFormat = component?.specs.join(' ').match(/\b22(?:30|42|60|80|110)\b/)?.[0];
      const labelInk = light(p?.labelColor)?'#293c3f':'#edf0e9';
      const lengthScale = Math.min(1.1,Math.max(.35,(p?.lengthMm??80)/80));
      const widthScale = Math.min(1.2,Math.max(.65,(p?.widthMm??22)/22));
      const depth = Math.min(6,Math.max(1,(p?.heightMm??2.4)*.55));
      artwork = <g data-art-part="storage-module" transform={`matrix(${lengthScale},${-.22*lengthScale},${.62*widthScale},${.7*widthScale},${(120-88*lengthScale-22*.62*widthScale)/2},45)`}>
        <path d={`M0 22v${depth}h84v-${depth}M84 0v${22+depth}`} stroke="#315043" strokeWidth="1.2" />
        <path d="M0 0h78v22H0v-7a4 4 0 0 0 0-8Z" fill={shell} stroke="#778e81" strokeWidth=".7" />
        <path d="M5 2h17l3 3h27l4-3h19M5 20h18l3-3h25l5 3h19" stroke="#91a780" strokeWidth=".4" opacity=".7" />
        {detailed && <path d="M17 4v2l4 4v5l4 4M41 3v3l4 4v4l5 5M66 4h8v3h3m-9 12h5v-6h4" stroke="#a9ac76" strokeWidth=".28" opacity=".75" />}
        <path d="M0 7a4 4 0 0 1 0 8" fill="none" stroke="#d0cba9" strokeWidth="1.5" />
        <path d="M78 1h8v7h-3v2h3v11h-8Z" fill={paint('gold')} />
        {Array.from({length:10},(_,i)=><path key={i} d={`M79 ${2+i*1.9}h7`} stroke="#736846" strokeWidth=".55" />)}
        {[8,27,46].map(x=><g key={x}><rect x={x} y="3" width="15" height="16" rx=".6" fill="#172126" stroke="#85968b" strokeWidth=".35"/><path d={`M${x+1} 4h13`} stroke="#465950" strokeWidth=".4"/></g>)}
        {[6,24,44,64,70,74].map(x=><g key={x}><rect x={x} y="1" width="1.2" height="1" fill="#baa77c"/><rect x={x} y="20" width="1.2" height="1" fill="#a4ada1"/></g>)}
        <rect x="24" y="2" width="47" height="18" rx=".5" fill={p?.labelColor || '#283137'} stroke="#86918e" strokeWidth=".35" />
        <text x="28" y="8" fill={labelInk} fontFamily="Arial,sans-serif" fontSize="3.5" fontWeight="700">{maker.toUpperCase()}</text>
        <text x="28" y="12.5" fill={labelInk} fontFamily="Arial,sans-serif" fontSize="2.6">{engraving.slice(0,21)}</text>
        <text x="28" y="16.5" fill={labelInk} fontFamily="Arial,sans-serif" fontSize="2.1">{component?.capacityGB ? (component.capacityGB>=1000?`${component.capacityGB/1000} TB`:`${component.capacityGB} GB`):'NVMe'} · M.2{moduleFormat ? ` ${moduleFormat}` : ''}</text>
        {detailed && Array.from({length:16},(_,i)=><path key={i} d={`M${58+i*.6} 15v3`} stroke={labelInk} strokeWidth={i%3?.25:.5} />)}
        {p?.hasHeatsink && <>
          <path data-art-part="ssd-heatsink" d="M8-4h64l3 4v17H8Z" fill="#334047" stroke="#b2bcba" strokeWidth=".65" />
          <path d="M8 17h67v4H8Z" fill="#1c282d" />
          {Array.from({length:11},(_,i)=><path key={i} d={`M${11+i*5.5} -3v18`} stroke="#121c22" strokeWidth="2.1" />)}
          <path d="M10 6h62v4H10Z" fill="#45555c" />
          <text x="41" y="9" textAnchor="middle" fontSize="2.4" fontFamily="Arial,sans-serif" fill="#e1e6df">{maker.toUpperCase()} · NVMe</text>
          {screw(10,0,.65)}{screw(71,14,.65)}
        </>}
      </g>;
      break;
    }
    case 'cooler': {
      const p = profile?.category === 'cooler' ? profile : undefined;
      const appearance=component?coolerAppearances[component.id]:undefined;
      const fanDetail=appearance?{roundedFrame:appearance.fanFrame==='round',bladeCount:appearance.bladeCount,bladeColor:maker==='Noctua'&&!/chromax/i.test(model)?'#795239':undefined}:undefined;
      if (p?.kind === 'aio') {
        const count = p.fanCount;
        const width = count===3?88:count===2?68:40;
        const left = (120-width)/2-8;
        artwork = <>
          <g data-art-part="radiator" transform={`translate(${left} 17)`}>
            <path d={`M0 0 ${width} -8 ${width+10} -2 10 6Z`} fill={p.color} stroke="#9ba7ab" strokeWidth=".6" />
            {Array.from({length:detailed?36:24},(_,i)=><path key={i} d={`M${4+i*(width-7)/(detailed?36:24)} 0l6 3.5`} stroke="#111c22" strokeWidth=".65" />)}
            <path d={`M10 6 ${width+10} -2v25L10 33Z`} fill={paint('heatsink-surface')} stroke="#a0aaac" strokeWidth=".7" />
            <path d="M0 0 10 6v27L0 26Z" fill={p.color} stroke="#7b898f" strokeWidth=".6" />
            <g transform="translate(11 8) skewY(-5.2)">
              {Array.from({length:count},(_,i)=>fan((i+.5)*(width-2)/count,11.5,Math.min(10.4,(width/count-6)/2),p.fanRgb || false,p.fanColor,true,fanDetail))}
            </g>
            <path d={`M13 31 ${width+6} 22`} stroke="#bec7c8" strokeWidth=".5" />
            {screw(3,5,.7)}{screw(3,23,.7)}
          </g>
          <path d={`M${left+5} 41C2 52 17 83 53 68M${left+10} 44C18 57 28 81 58 72`} fill="none" stroke="#10191f" strokeWidth="5.2" strokeLinecap="round" />
          <path d={`M${left+5} 41C2 52 17 83 53 68M${left+10} 44C18 57 28 81 58 72`} fill="none" stroke={p.tubeColor || '#2d393f'} strokeWidth="3.5" strokeLinecap="round" />
          <path d={`M${left+5} 41C2 52 17 83 53 68M${left+10} 44C18 57 28 81 58 72`} fill="none" stroke="#8d9da1" strokeWidth=".55" strokeDasharray={detailed?'.7 1':undefined} opacity=".65" />
          <path d={`m${left+2} 39 5 4m-1-1 5 4M50 67l5 5m1-2 5 4`} stroke="#b1bab7" strokeWidth="2.5" />
          {appearance?.pumpShape?<AioPumpArt appearance={appearance} color={p.pumpColor??p.color} brand={maker} rgb={p.rgb} paint={paint}/>:<><path d="m50 56 25-6 16 11v12l-25 8-16-13Z" fill={paint('pump-surface')} stroke="#8f9ea3" strokeWidth=".8" />
          <path d="m50 56 25-6 16 11-25 7Z" fill={paint('pump-surface')} stroke="#c4cfcc" strokeWidth=".7" />
          <path d="m54 71 12 9 21-6" stroke="#bdc3c0" strokeWidth=".6" />
          <g transform="matrix(1,-.23,.6,.66,56,57)">
            {p.pumpDisplay==='lcd' ? <><rect width="23" height="15" rx="3" fill="#091d2a" stroke="#91b1bb" strokeWidth=".8" /><path d="M4 11h2l2-4 2 3h2l2-5 3 6h3" stroke="#65bccb" strokeWidth=".45"/><text x="11.5" y="8" textAnchor="middle" fill="#b1edf0" fontSize="6" fontFamily="Arial,sans-serif">32°</text></> : <><ellipse cx="11" cy="7" rx="11" ry="8" fill="#1a252c" stroke={p.pumpDisplay==='rgb-ring'?paint('rgb'):'#8b9b9e'} data-rgb-zone={p.pumpDisplay==='rgb-ring'?'pump-ring':undefined} strokeWidth={p.pumpDisplay==='rgb-ring'?1.6:.7}/><text x="11" y="8" textAnchor="middle" fill="#d6e1dc" fontSize="3.3" fontFamily="Arial,sans-serif" fontWeight="700">{maker.slice(0,7).toUpperCase()}</text></>}
          </g></>}
          {detailed && <text x="108" y="77" textAnchor="end" fill="#92a5aa" fontFamily="Arial,sans-serif" fontSize="3.6">{p.radiatorSizeMm} mm</text>}
        </>;
      } else if (p?.kind === 'low-profile') {
        artwork = <>
          <path data-art-part="cooling-fins" d="m20 40 45-13 32 17-46 15Z" fill={paint('heatsink-surface')} stroke="#bbc4c6" strokeWidth=".7" />
          <path d="m20 40 31 19 46-15v12L51 72 20 52Z" fill={paint('heatsink-surface')} stroke="#809198" strokeWidth=".7" />
          {Array.from({length:detailed?9:6},(_,i)=><path key={i} d={`M21 ${43+i*(detailed?1.2:1.8)}l30 18 45-15`} stroke="#3e4b50" strokeWidth=".6" fill="none"/>)}
          <path d="m34 60 4 8 18 11 16-6" fill="none" stroke="#bbac87" strokeWidth="2.5" />
          <path d="m43 58 4 8 18 11 16-6" fill="none" stroke="#c9c7b1" strokeWidth="2" />
          {p.fanCount>0 && <g transform="matrix(1,-.29,.56,.65,60,42)">{fan(0,0,23,p.fanRgb || false,p.fanColor,true,fanDetail)}</g>}
          <path d="m43 74 12 6 13-4-12-7Z" fill="#aa9d80" stroke="#d8d2bb" strokeWidth=".6" />
        </>;
      } else {
        const pipeCount = p?.heatpipes || 6;
        artwork = <>
          <path data-art-part="cooling-fins" d="m40 14 31-6 24 13-31 8Z" fill={paint('heatsink-surface')} stroke="#c4cecb" strokeWidth=".6" />
          <path d="m40 14 24 15v39L40 53Z" fill={paint('heatsink-surface')} stroke="#8d9b9c" strokeWidth=".6" />
          <path d="m64 29 31-8v39l-31 8Z" fill={paint('heatsink-surface')} stroke="#a4b0ad" strokeWidth=".6" />
          {Array.from({length:detailed?24:16},(_,i)=><path key={i} d={`m41 ${17+i*(detailed?1.5:2.2)} 23 14 30-8`} fill="none" stroke="#34444b" strokeWidth=".65" />)}
          <path d="m25 23 26-7 21 13-27 8Z" fill={paint('heatsink-surface')} stroke="#c4cecb" strokeWidth=".7" />
          <path d="m25 23 20 14v38L25 62Z" fill={paint('heatsink-surface')} stroke="#78888c" strokeWidth=".6" />
          <path d="m45 37 27-8v38l-27 8Z" fill={paint('heatsink-surface')} stroke="#a0adaa" strokeWidth=".6" />
          {Array.from({length:detailed?23:15},(_,i)=><path key={i} d={`m26 ${26+i*(detailed?1.5:2.3)} 19 13 26-8`} fill="none" stroke="#33444a" strokeWidth=".65" />)}
          {Array.from({length:pipeCount},(_,i)=><g key={i}><ellipse cx={30+i*3.5} cy={24-i*.55} rx="1.4" ry=".8" fill="#aab1a2" stroke="#d6d9c8" strokeWidth=".3"/><ellipse cx={46+i*3.4} cy={16-i*.6} rx="1.4" ry=".8" fill="#b0b6a6" stroke="#d6d9c8" strokeWidth=".3"/></g>)}
          {(p?.fanCount??2)>0 && <g transform={`matrix(.65,.33,0,1,${appearance?.centralFan?55:62},47)`}>{fan(0,0,15,p?.fanRgb || false,p?.fanColor,true,fanDetail)}</g>}
          {(p?.fanCount??2)>1 && <g transform="matrix(.7,.35,0,1,33,48)">{fan(0,0,17,p?.fanRgb || false,p?.fanColor,true,fanDetail)}</g>}
          {appearance?.centralFan&&<g data-art-part="asymmetric-front-tower"><path d="m25 23 20 14v38L25 62Z" fill={paint('heatsink-surface')} stroke="#b9c3c2" strokeWidth=".6"/>{Array.from({length:24},(_,i)=><path key={i} d={`m26 ${25+i*1.5} 18 12.6`} stroke="#71808a" strokeWidth=".45"/>)}</g>}
          {appearance?.capStyle==='deepcool-grid'&&<g data-art-part="twin-grid-caps">{['m40 14 31-6 24 13-31 8Z','m25 23 26-7 21 13-27 8Z'].map(d=><path key={d} d={d} fill="#30373b" stroke="#819096" strokeWidth=".5"/>)}{[0,1,2,3].map(i=><path key={i} d={`M${28+i*4} ${23-i}l18 11M${45+i*5} ${14-i}l21 12`} stroke="#657277" strokeWidth=".45"/>)}<path d="m47 18 2 1-2 1-2-1Zm-13 8 2 1-2 1-2-1Z" fill="#48b5a9"/></g>}
          {appearance?.capStyle==='dark-rock'&&<g data-art-part="bridged-top-cover"><path d="m25 23 46-15 24 13-50 16Z" fill="#242a2e" stroke="#6a777c" strokeWidth=".7"/>{Array.from({length:10},(_,i)=><path key={i} d={`m${29+i*4} ${23-i*1.3} 18 10`} stroke="#5e6c72" strokeWidth=".4"/>)}<text x="58" y="23" transform="rotate(-18 58 23)" textAnchor="middle" fontSize="3.5" fill="#a6b0b2" fontFamily="Arial">be quiet!</text></g>}
          {/DIGITAL/i.test(model) && <>
            <path d="m25 23 26-7 21 13-27 8Z" fill="#1b252d" stroke="#647b83" strokeWidth=".6" />
            <path d="m28 24 21-6 17 11-21 6Z" fill="#0d1a24" stroke="#607c87" strokeWidth=".45" />
            <g transform="matrix(1,-.25,.62,.65,39,26)"><text textAnchor="middle" fill="#a5dce4" fontSize="5" fontFamily="monospace">32°</text><text x="9" y="1" fill="#87aebd" fontSize="1.8" fontFamily="Arial,sans-serif">CPU</text></g>
            {p?.rgb && <path d="m26 26 19 12 25-8" stroke={paint('rgb-line')} strokeWidth="1.05" data-rgb-zone="cooler-cap" />}
          </>}
          {(p?.fanCount??2)>1 && <path d="m19 36 2-1v25l-2 1m28-15 2-1v25l-2 1" fill="none" stroke="#bac5c5" strokeWidth=".6" />}
          {Array.from({length:Math.min(4,pipeCount)},(_,i)=><path key={i} d={`M${49+i*5} ${72-i*1.5}v4q0 3 4 3l5-1`} fill="none" stroke="#c1b596" strokeWidth="2" strokeLinecap="round" />)}
          <path d="m51 77 14-3 10 5-14 4Z" fill="#aca48d" stroke="#cbd1c4" strokeWidth=".6" />
        </>;
      }
      break;
    }
    case 'psu': {
      const p = profile?.category === 'psu' ? profile : undefined;
      const wiring = (component?.specs || []).join(' ');
      const modular = /semi[ -]modulaire/i.test(wiring) ? 'semi'
        : /c[âa]bles fixes|non[ -]modulaire/i.test(wiring) ? 'fixed' : /modulaire/i.test(wiring) ? 'full' : 'unknown';
      const scale = p?.format==='SFX'?.82:1;
      artwork = <g data-art-part="psu-enclosure" transform={`translate(${60*(1-scale)} ${45*(1-scale)}) scale(${scale})`}>
        <path d="m16 28 44-12 43 24-47 14Z" fill={paint('shell-surface')} stroke="#95a3a7" strokeWidth=".7" />
        <path d="m16 28 40 26v25L16 53Z" fill={paint('shell-surface')} stroke="#79878c" strokeWidth=".7" />
        <path d="m56 54 47-14v25L56 79Z" fill={paint('graphite')} stroke="#87979c" strokeWidth=".7" />
        <g transform="matrix(1,-.27,.68,.42,60,35)">
          {component?.fanCount!==0 && fan(0,0,Math.min(22,(p?.fanSizeMm??120)*.18),false,'#303a3d')}
          {[5,9,13,17,21].map(r=><circle key={r} r={r} stroke="#91a0a2" strokeWidth=".75"/>)}
          <path d="M-22 0h44M0-22v44" stroke="#939d9f" strokeWidth="1" />
          {[-1,1].flatMap(x=>[-1,1].map(y=>screw(x*22,y*22,.8)))}
        </g>
        <g transform="matrix(1,-.29,0,1,60,54)">
          <rect width="36" height="18" rx=".8" fill="#192329" stroke="#859494" strokeWidth=".45" />
          <text x="3" y="5" fill="#bac5be" fontFamily="Arial,sans-serif" fontSize="2.6" fontWeight="700">{maker.toUpperCase()}</text>
          <text x="3" y="13.2" fill="#edf0e6" fontFamily="Arial,sans-serif" fontSize="7" fontWeight="700">{component?.wattage || 'PSU'}{component?.wattage && <tspan fontSize="4"> W</tspan>}</text>
          <path d="M2 16h32" stroke={accent} strokeWidth=".6" />
          <text x="30" y="8" textAnchor="middle" fill="#adbcb5" fontFamily="Arial,sans-serif" fontSize="2.6">{p?.format || 'ATX'}</text>
          {detailed && <path d="M27 11h6m-6 1.5h6m-6 1.5h4" stroke="#a4b1ae" strokeWidth=".4" />}
        </g>
        <g transform="matrix(.8,.51,0,.9,20,33)">
          {modular === 'full' || modular === 'semi' ? (modular === 'semi' ? [0] : [0,1]).flatMap(row=>[0,1,2].map(col=><g key={`${row}-${col}`}><rect x={col*11} y={row*11} width="9" height="8" rx=".6" fill="#0c171d" stroke="#77888d" strokeWidth=".6"/>{[0,1].flatMap(y=>[0,1,2].map(x=><rect key={`${y}-${x}`} x={1.6+col*11+x*2.2} y={1.8+row*11+y*3} width="1.2" height="1.5" fill="#626e6b"/>))}</g>)) : <><rect width="34" height="19" fill="#1c282d" stroke="#7d8b8a" strokeWidth=".6"/>{[0,1,2,3,4].map(i=><path key={i} d={`M${3+i*6} 3v13`} stroke="#839392" strokeWidth=".7"/>)}</>}
        </g>
        {(modular === 'fixed' || modular === 'semi') && <g data-art-wiring={modular}><ellipse cx="29" cy="54" rx="4" ry="2.7" fill="#0c171b" stroke="#7c8e87" strokeWidth=".6" />{[0,1,2,3].map(i=><path key={i} d={`M${26+i*1.6} 54q-6 6-4 10t-9 8`} stroke={i%2?'#47575a':'#243237'} strokeWidth="1.4" strokeLinecap="round" />)}</g>}
        {screw(99,44,.75)}{screw(99,61,.75)}{screw(58,74,.75)}
      </g>;
      break;
    }
    case 'case': {
      const p = profile?.category === 'case' ? profile : undefined;
      const appearance=component?caseAppearances[component.id]:undefined;
      const short = p?.kind==='sandwich', panoramic = p?.kind==='panoramic';
      const compact = p?.kind==='compact';
      const wood = p?.woodAccent || p?.kind==='wood-front';
      const rawSide=(p?.depthMm??400)*.1,rawFront=(p?.widthMm??230)*.1,rawPanel=(p?.heightMm??460)*.13;
      const fit=Math.min(1,86/(rawSide+rawFront),74/(rawPanel+rawSide*.32+rawFront*.28));
      const frontWidth=rawFront*fit,sideWidth=rawSide*fit,panelH=rawPanel*fit;
      const height=panelH+sideWidth*.32;
      const top=(90-panelH-sideWidth*.32-frontWidth*.28)/2+frontWidth*.28,bottom=top+height;
      const left = (120-frontWidth-sideWidth)/2;
      const edge = left+sideWidth, right=edge+frontWidth;
      const sideGlass = p?.glass || p?.sidePanel==='acrylic';
      const sideMatrix = `matrix(1,.32,0,1,${left} ${top})`;
      const frontMatrix = `matrix(1,-.28,0,1,${edge} ${top+sideWidth*.32})`;
      const frontFanCount = p?.stockFanMount==='front'?Math.min(3, Math.max(0,p.fanCount-(p.rearFanCount || 0))):0;
      artwork = <>
        <path d={`M${left} ${top} ${left+frontWidth} ${top-frontWidth*.28} ${right} ${top+sideWidth*.32-frontWidth*.28} ${edge} ${top+sideWidth*.32}Z`} fill={paint('frame-surface')} stroke="#9ca9ac" strokeWidth=".65" />
        {Array.from({length:detailed?13:9},(_,i)=><path key={i} d={`M${left+4+i*(frontWidth-8)/(detailed?13:9)} ${top-.8-i*(frontWidth-8)/(detailed?13:9)*.28}l${sideWidth-8} ${((sideWidth-8)*.32)}`} stroke="#0e1b21" strokeWidth=".6" opacity=".75"/>)}
        <g transform={sideMatrix}>
          <rect data-art-part="case-panel" width={sideWidth} height={panelH} fill={paint('shell-surface')} stroke="#96a5a8" strokeWidth=".65" />
          {sideGlass ? <>
            <rect x="2.2" y="3.3" width={sideWidth-4.4} height={panelH-9} fill="#0b1c24" stroke="#526c76" strokeWidth=".5" />
            <path data-art-part="empty-motherboard-tray" d={`M5 7h${sideWidth-15}v${panelH-23}H5Z`} fill="#202a2d" stroke="#48565b" strokeWidth=".5" />
            <rect x="9" y="10" width={Math.max(5,sideWidth-25)} height={Math.max(6,panelH-36)} rx="1" fill="#10191b" stroke="#687577" strokeWidth=".4"/>
            {[7,sideWidth-13].flatMap(x=>[9,panelH-20].map(y=>screw(x,y,.4)))}
            <path d={`M8 8v${panelH-23}m8-${panelH-23}v${panelH-23}`} stroke="#334b55" strokeWidth=".5" />
            {[0,1,2,3].map(i=><path key={i} d={`M4 ${panelH-17+i*1.9}h${sideWidth-14}`} stroke="#687b80" strokeWidth=".6"/>)}
            <path d={`M3 ${panelH-10}h${sideWidth-6}v8H3Z`} fill={paint('frame-surface')} stroke="#5c727b" strokeWidth=".45" />
            {(p?.rearFanCount || 0)>0 && <g transform="translate(8 13) scale(.6)">{fan(0,0,6,p?.fanRgb,'#2d3b40')}</g>}
            {p?.stockFanMount==='side' && <g transform={`translate(${sideWidth-8} 12) scale(.57 1)`}>{Array.from({length:Math.min(3,p.fanCount-(p.rearFanCount || 0))},(_,i)=>fan(0,i*14,5.6,p.fanRgb,'#4b595d'))}</g>}
            <path d={`M3 4h${sideWidth*.63}L3 ${panelH-10}Z`} fill="#d6edf3" opacity=".085" />
            <path d={`M${sideWidth-4} 7v${panelH-18}`} stroke="#d9e5e7" strokeWidth="1" opacity=".2"/>
            <path d={`M${sideWidth-5} 5 4 ${panelH-10}`} stroke="#c6dce3" strokeWidth=".45" opacity=".25" />
          </> : <>
            {appearance?.frontPattern==='square-perforation'?<CaseFacePattern pattern="square-perforation" width={sideWidth} height={panelH}/>:Array.from({length:short?16:13},(_,i)=><path key={i} d={`M${3+i*(sideWidth-6)/(short?16:13)} 4v${panelH-9}`} stroke="#111d22" strokeWidth=".9" strokeDasharray={short?undefined:'1 1.1'}/>)}
          </>}
          {appearance?.lowerSideMesh&&<g data-art-part="lower-mesh-door"><rect x="1" y={panelH*.76} width={sideWidth-2} height={panelH*.22} fill={paint('frame-surface')}/><path d={`M2 ${panelH*.77}h${sideWidth-4}`} stroke="#9aabae" strokeWidth=".4"/>{Array.from({length:18},(_,i)=><path key={i} d={`M${3+i*(sideWidth-6)/18} ${panelH*.8}v${panelH*.15}`} stroke="#7d8e91" strokeDasharray=".4 .6" strokeWidth=".4"/>)}</g>}
          {appearance?.ioPosition==='side'&&<g data-art-part="side-io"><path d={`M${sideWidth-6} ${panelH*.3}l4-3v${panelH*.48}l-4-3Z`} fill="#404b50" stroke="#8e9ca0" strokeWidth=".4"/>{[0,1].map(i=><rect key={i} x={sideWidth-4.8} y={panelH*.36+i*5} width="1.7" height="3.2" fill="#111b22" stroke="#99a5a7" strokeWidth=".3"/>)}<circle cx={sideWidth-4} cy={panelH*.63} r="1" fill="#172128" stroke="#9bacae" strokeWidth=".4"/></g>}
          {[2.2,sideWidth-2.2].flatMap(x=>[2.2,panelH-2.2].map(y=>screw(x,y,.55)))}
        </g>
        <g transform={frontMatrix}>
          <rect width={frontWidth} height={panelH} fill={paint('front-surface')} stroke="#93a2a6" strokeWidth=".65" />
          {panoramic ? <>
            <rect x="2" y="3.3" width={frontWidth-4} height={panelH-7} fill="#14262e" stroke="#5a727c" strokeWidth=".5" />
            <path d={`M3 4h${frontWidth*.4}L3 ${panelH-7}Z`} fill="#d8edf4" opacity=".07" />
            <path d={`M3 ${panelH-10}h${frontWidth-6}`} stroke="#79929a" strokeWidth=".5" />
            <path d={`M${frontWidth-4} 6v${panelH-17}`} stroke="#cee8ee" strokeWidth=".45" opacity=".35" />
            {appearance?.frontColumn&&<rect x={frontWidth*.81} width={frontWidth*.19} height={panelH} fill={paint('frame-surface')} stroke="#6d7c80" strokeWidth=".4"/>}
            {appearance?.angledIntake&&<path d={`M1 3 5 4v${panelH-9}l-4 2Z`} fill="#667780" opacity=".2" stroke="#b1c5c8" strokeWidth=".4"/>}
          </> : wood ? <>
            <rect x="2" y={short?panelH-10:3} width={frontWidth-4} height={short?8:panelH-5} fill={paint('wood')} />
            {Array.from({length:6},(_,i)=><path key={`grain-${i}`} d={short ? `M${3+i*3.1} ${panelH-9}q.8 1.5 0 3t.15 3` : `M${3+i*3.1} 4q1 4 0 8t.2 ${panelH-18}`} fill="none" stroke="#e1b17e" strokeWidth=".32" opacity=".45"/>)}
            {!short && Array.from({length:7},(_,i)=><g key={i}><path d={`M${3+i*2.9} 4v${panelH-7}`} stroke="#382b21" strokeWidth="1.3"/><path d={`M${4.2+i*2.9} 4v${panelH-7}`} stroke="#d9b07c" strokeWidth=".45" opacity=".6"/></g>)}
            {short && <><circle cx={frontWidth/2} cy="11" r="1.5" fill="#203534" stroke="#a9bbb2" strokeWidth=".5"/><path d={`M${frontWidth/2} 9.8v1.3`} stroke="#bccac2" strokeWidth=".45"/><path d={`M${frontWidth/2-2} 17h4`} stroke="#101e24" strokeWidth="1"/></>}
          </> : <>
            <rect x="2" y="3" width={frontWidth-4} height={panelH-6} fill="#19272c" />
            <g transform={`translate(${frontWidth/2} 12)`}>{Array.from({length:frontFanCount},(_,i)=>fan(0,i*15,7,p?.fanRgb || false,'#465258'))}</g>
            <CaseFacePattern pattern={appearance?.frontPattern??'fine-mesh'} width={frontWidth} height={panelH}/>
            {appearance?.lowerFrontCover&&<g data-art-part="front-drive-cover"><rect x="1.3" y={panelH*.79} width={frontWidth-2.6} height={panelH*.19} fill={paint('front-surface')} stroke="#6b7b80" strokeWidth=".45"/><path d={`M2 ${panelH*.8}h${frontWidth-4}`} stroke="#0c161c" strokeWidth=".7"/></g>}
          </>}
          {(appearance?.ioPosition==='front-bottom'||appearance?.ioPosition==='front-top')&&!short&&<g data-art-part="front-io" transform={`translate(${frontWidth*.38} ${appearance.ioPosition==='front-bottom'?panelH-3:2})`}><circle r=".9" fill="#132027" stroke="#b3c2c4" strokeWidth=".4"/>{[3.2,6.2].map(x=><rect key={x} x={x} y="-.65" width="1.8" height="1.2" rx=".2" fill="#11212b" stroke="#93aaae" strokeWidth=".25"/>)}</g>}
          {component?.id==='case-o11' && p?.rgb && <g data-rgb-zone="case-front-strip"><rect x={frontWidth-2.6} y="3" width="2.5" height={panelH-6} rx=".6" fill={paint('rgb')} opacity=".2"/><rect x={frontWidth-1.8} y="3" width=".9" height={panelH-6} rx=".35" fill={paint('rgb')}/></g>}
          <text x={frontWidth/2} y={panelH-2} textAnchor="middle" fill={light(p?.frontColor)?'#4c5c55':'#a9b9bc'} fontSize="1.8" fontFamily="Arial,sans-serif" letterSpacing=".3">{maker.slice(0,10).toUpperCase()}</text>
        </g>
        <path d={`M${left+3} ${bottom-sideWidth*.32}v4M${edge+3} ${bottom}v4M${right-4} ${bottom-frontWidth*.28}v4`} stroke="#27373e" strokeWidth="3.5" />
        {(!appearance||appearance.ioPosition==='top')&&<g transform={`matrix(1,-.28,.7,.22,${left+frontWidth-2} ${top-4})`}>
          <circle r="1.3" fill="#15242b" stroke="#a3b5b6" strokeWidth=".5" />
          <rect x="3" y="-1" width="3.2" height="1.7" rx=".3" fill="#10212b" stroke="#879c9f" strokeWidth=".3" />
          <rect x="8" y="-1" width="3.2" height="1.7" rx=".3" fill="#10212b" stroke="#879c9f" strokeWidth=".3" />
          <circle cx="14" cy="0" r=".65" fill="#101e26" stroke="#8da0a5" strokeWidth=".3" />
        </g>}
      </>;
      break;
    }
    default:
      artwork = <rect x="35" y="20" width="50" height="50" rx="9" fill={paint('graphite')} stroke="#607056" />;
  }
  if(profile?.design && component) artwork=<IndividualProductArt component={component} profile={profile} detailed={detailed} paint={paint} fan={fan}/>;
  return <svg data-art-material="physical-v2" data-art-mode={photoVisible?'manufacturer-photo':'illustration'} data-photo-inspection={productImage?.inspection} data-photo-source={productImage?.sourceURL} data-art-family={category} data-art-fidelity={profile?.fidelity??'reconstructed'} data-model-design={profile?.design} className={className} viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-component-id={component?.id} data-visual-kind={profile && 'kind' in profile ? profile.kind : category} data-art-detail={detailed?'high':'standard'}>
    <defs>
      <filter id={`${id}-object-shadow`} x="-15%" y="-15%" width="140%" height="150%" colorInterpolationFilters="sRGB"><feDropShadow dx=".8" dy="1.6" stdDeviation=".9" floodColor="#000" floodOpacity=".48"/></filter>
      {productImage&&<clipPath id={`${id}-photo-clip`}><rect x="3" y="2" width="114" height="86" rx="3"/></clipPath>}
      <pattern id={`${id}-brushed`} width="4" height="1.3" patternUnits="userSpaceOnUse"><path d="M0 .3h4M.8 1h2.5" stroke="#f4f6f5" strokeWidth=".11"/><path d="M1 .7h3" stroke="#12191e" strokeWidth=".1"/></pattern>
      <linearGradient id={`${id}-rgb`} x1="0" y1="0" x2="1" y2=".7" gradientUnits="objectBoundingBox">{rainbow}</linearGradient>
      <linearGradient id={`${id}-rgb-line`} x1="0" y1="0" x2="90" y2="0" gradientUnits="userSpaceOnUse">{rainbow}</linearGradient>
      <linearGradient id={`${id}-rgb-blades`} x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#89dae7"/><stop offset=".33" stopColor="#b3bce9"/><stop offset=".65" stopColor="#d7a4d7"/><stop offset="1" stopColor="#a6e2d9"/></linearGradient>
      <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#f0d18a"/><stop offset=".35" stopColor="#c7a352"/><stop offset=".58" stopColor="#ead093"/><stop offset="1" stopColor="#a77b38"/></linearGradient>
      <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2=".3" gradientUnits="objectBoundingBox"><stop stopColor={/chalk|white|blanc/i.test(model)?'#ac8359':'#765137'}/><stop offset=".26" stopColor={/chalk|white|blanc/i.test(model)?'#caab7a':'#a47c51'}/><stop offset=".58" stopColor={/chalk|white|blanc/i.test(model)?'#e5c698':'#d2a26d'}/><stop offset="1" stopColor={/chalk|white|blanc/i.test(model)?'#b18b60':'#8d6542'}/></linearGradient>
      {Object.entries(surfaces).filter(([name])=>surfaceNames.includes(name)).map(([name, color])=><linearGradient key={name} id={`${id}-${name}-surface`} x1="0" y1="0" x2=".8" y2="1" gradientUnits="objectBoundingBox"><stop stopColor={mix(color,255,.28)}/><stop offset=".11" stopColor={mix(color,255,.1)}/><stop offset=".43" stopColor={color}/><stop offset=".78" stopColor={mix(color,0,.35)}/><stop offset="1" stopColor={mix(color,255,.04)}/></linearGradient>)}
      <linearGradient id={`${id}-silver`} x1="5" y1="5" x2="45" y2="55" gradientUnits="userSpaceOnUse"><stop stopColor="#edf1f3"/><stop offset=".28" stopColor="#abb5bc"/><stop offset=".47" stopColor="#fafcfc"/><stop offset=".52" stopColor="#c7d0d4"/><stop offset="1" stopColor="#78858d"/></linearGradient>
      <linearGradient id={`${id}-graphite`} x1="15" y1="15" x2="100" y2="70" gradientUnits="userSpaceOnUse"><stop stopColor={shell}/><stop offset=".45" stopColor={shell}/><stop offset="1" stopColor="#15222a"/></linearGradient>
      <radialGradient id={`${id}-hub`}><stop stopColor="#bbc4c1"/><stop offset=".4" stopColor="#75868c"/><stop offset="1" stopColor="#32434c"/></radialGradient>
      <radialGradient id={`${id}-shadow`}><stop stopColor="#000" stopOpacity=".45"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
    </defs>
    <ellipse cx="62" cy="80" rx="45" ry="7" fill={paint('shadow')} opacity={photoVisible?0:.6}/>
    <g data-art-part="hardware" opacity={photoVisible?0:1} filter={paint('object-shadow')}>{artwork}</g>
    {productImage&&<g data-art-part="manufacturer-photo" opacity={photoVisible?1:0} clipPath={paint('photo-clip')}>
      <rect x="3" y="2" width="114" height="86" rx="3" fill="#fff"/>
      <image href={productImage.imageURL} x="5" y="3" width="110" height="84" preserveAspectRatio="xMidYMid meet" onLoad={()=>setLoadedImage(productImage.imageURL)} onError={()=>setLoadedImage(null)}/>
    </g>}
  </svg>;
}
