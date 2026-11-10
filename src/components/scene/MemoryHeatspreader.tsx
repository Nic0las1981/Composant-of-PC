import {useEffect,useMemo} from 'react';
import * as THREE from 'three';
import {memoryShapes,type MemoryDesign,type MemoryPoint} from '../../data/memoryAppearance';
import {MM,type RamVisualProfile} from '../../data/visualProfiles';
import {BoxInstances,HardwareLabel,useHardwareSurface,useRgbTexture,type BoxInstance} from './HardwarePrimitives';

function shapes(points:readonly (readonly MemoryPoint[])[],h:number,l:number) {
  return points.map(outline=>{
    const shape=new THREE.Shape();
    // Front-facing local +Z: +X is up, -Y is right. This preserves both the
    // photographed silhouette and upright lettering when the module is turned.
    outline.forEach(([x,y],i)=>i?shape.lineTo(h*(.5-y),l*(.5-x)):shape.moveTo(h*(.5-y),l*(.5-x)));
    shape.closePath();return shape;
  });
}
function Surface({points,h,l,depth,color,offset=0,roughness=.4}:{points:readonly (readonly MemoryPoint[])[];h:number;l:number;depth:number;color:string;offset?:number;roughness?:number;}) {
  const geometry=useMemo(()=>new THREE.ExtrudeGeometry(shapes(points,h,l),{depth,bevelEnabled:true,bevelSize:Math.min(depth*.15,.0015),bevelThickness:Math.min(depth*.1,.001),bevelSegments:1,steps:1}),[points,h,l,depth]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  const surface=useHardwareSurface('brushed');
  return <mesh geometry={geometry} position={[0,0,offset]} castShadow receiveShadow>
    <meshStandardMaterial color={color} metalness={.55} roughness={roughness} roughnessMap={surface?.texture}/>
  </mesh>;
}
function Diffuser({design,h,l,t,phase}:{design:MemoryDesign;h:number;l:number;t:number;phase:number;}) {
  const points=memoryShapes[design].diffuser;
  const geometry=useMemo(()=>{
    // The lit faces must remain outside both metal skins. In particular the
    // Dominator windows sit inside the silhouette, not above its top edge.
    const geometry=new THREE.ExtrudeGeometry(shapes(points,h,l),{depth:t*.98,bevelEnabled:false,steps:1});
    const uv=geometry.getAttribute('uv'),pos=geometry.getAttribute('position');
    for(let i=0;i<uv.count;i++)uv.setXY(i,.5-pos.getY(i)/l,pos.getX(i)/h+.5);
    uv.needsUpdate=true;return geometry;
  },[points,h,l,t]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  const texture=useRgbTexture(false,phase);
  return <mesh name="memory-shaped-diffuser" geometry={geometry} position={[0,0,-t*.49]}>
    <meshStandardMaterial color="#ffffff" map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={.65} roughness={.25} metalness={.05} toneMapped={false}/>
  </mesh>;
}

/** Fitted surface lettering keeps short wordmarks legible without enlarging the
 * physical marking area. It is a typographic reconstruction, not a logo asset. */
function Wordmark({text,color,width,height,position,italic}:{text:string;color:string;width:number;height:number;position:[number,number,number];italic:boolean;}) {
  const texture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;
    const context=canvas.getContext('2d')!;
    context.font=`${italic?'italic ':''}700 160px Arial,sans-serif`;
    context.fillStyle=color;context.textAlign='center';context.textBaseline='middle';
    const measured=context.measureText(text).width;
    context.translate(512,128);context.scale(950/Math.max(1,measured),1);context.fillText(text,0,0);
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;return map;
  },[text,color,italic]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <mesh name="memory-surface-wordmark" position={position} rotation={[0,0,-Math.PI/2]}>
    <planeGeometry args={[width,height]}/><meshBasicMaterial map={texture} transparent depthWrite={false} side={THREE.DoubleSide} toneMapped={false}/>
  </mesh>;
}

/** Reconstructed individual shells; internal ICs and tolerances remain schematic. */
export default function MemoryHeatspreader({profile,design,rgb,phase}:{profile:RamVisualProfile;design:MemoryDesign;rgb:boolean;phase:number;}) {
  const h=profile.heightMm*MM,l=profile.lengthMm*MM,t=profile.thicknessMm*MM;
  const shape=memoryShapes[design],body=profile.heatspreaderColor;
  const outline=useMemo(()=>[shape.outline],[shape]);
  const dark=useMemo(()=>shape.panels.filter(p=>p.tone==='dark').map(p=>p.points),[shape]);
  const silver=useMemo(()=>shape.panels.filter(p=>p.tone==='silver').map(p=>p.points),[shape]);
  const base=useMemo(()=>shape.panels.filter(p=>p.tone==='body').map(p=>p.points),[shape]);
  const ribs=useMemo<BoxInstance[]>(()=>shape.ribs?[-1,1].flatMap(side=>Array.from({length:28},(_,i)=>({
    position:[h*.07,l*(-.46+i*.92/27),side*t*.445],size:[h*.75,l*.012,t*.05],
  }))):[],[shape,h,l,t]);
  const screws=useMemo<BoxInstance[]>(()=>design==='dominator-platinum-rgb'?[-1,1].flatMap(side=>[-.43,.43].flatMap(y=>[-.24,.19].map(x=>({
    position:[h*x,l*y,side*t*.475] as [number,number,number],size:[h*.032,l*.012,t*.035] as [number,number,number],
  })))):[],[design,h,l,t]);
  const pale=new THREE.Color(body).getHSL({h:0,s:0,l:0}).l>.6;
  const labelInk=design==='vengeance-lpx'?'#e9d449':design==='fury-renegade-ddr4'?'#737b80'
    :design==='dominator-platinum-rgb'||design==='fury-beast-ddr4'||design==='fury-beast-ddr5'?(pale?'#454b4c':'#e3e5e4'):'#e3e5e4';
  return <group name={`memory-shell-${design}`} userData={{appearanceModel:design,geometryKind:'photograph-based-reconstruction'}}>
    {[-1,1].map(side=><group key={side} position={[0,0,side*t*.30]} rotation={[side<0?Math.PI:0,0,0]}>
      <Surface points={outline} h={h} l={l} depth={t*.12} color={body}/>
      {silver.length>0&&<Surface points={silver} h={h} l={l} depth={t*.016} offset={t*.13} color={pale?'#e1e2e0':'#aeb5b9'}/>}
      {base.length>0&&<Surface points={base} h={h} l={l} depth={t*.016} offset={t*.13} color={body}/>}
      {dark.length>0&&<Surface points={dark} h={h} l={l} depth={t*.016} offset={t*.16} color="#24262b" roughness={.43}/>}
      <Wordmark text={shape.label} position={[h*(.5-shape.labelAt[1]),l*(.5-shape.labelAt[0]),t*.19]}
        width={l*shape.labelWidth} height={h*(design.includes('fury')?.28:.18)} color={labelInk} italic={design.includes('fury')||design==='trident-z5'}/>
      {design.includes('beast')&&<HardwareLabel text="BEAST" position={[-h*.09,-l*.30,t*.19]} rotation={[0,0,-Math.PI/2]} width={l*.17} height={h*.07} color={pale?'#454b4c':'#a9adaf'}/>}
      {design.includes('renegade')&&<HardwareLabel text="RENEGADE" position={[-h*.28,0,t*.19]} rotation={[0,0,-Math.PI/2]} width={l*.19} height={h*.065} color={design.endsWith('ddr5')?'#444c4f':'#aeb5b9'}/>}
    </group>)}
    {ribs.length>0&&<BoxInstances items={ribs} color={body} finish="brushed" roughness={.35}/>}
    {screws.length>0&&<BoxInstances items={screws} color="#858f95" metalness={.8}/>}
    {rgb&&shape.diffuser.length>0&&<Diffuser design={design} h={h} l={l} t={t} phase={phase}/>}
  </group>;
}
