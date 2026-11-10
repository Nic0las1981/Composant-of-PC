import {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {BoxInstances, HardwareLabel, MetalBox, RGBStrip, type BoxInstance} from './HardwarePrimitives';
import {MM, type BoardVisualProfile, type GpuVisualProfile, type RamVisualProfile, type PsuVisualProfile, type StorageVisualProfile} from '../../data/visualProfiles';

type V3=[number,number,number];
/** Product silhouettes reconstructed from the cited photographs. Fine assembly
 * features remain visual cues; these meshes are not manufacturer CAD. */
export function CrucialHeatspreader({profile}:{profile:RamVisualProfile}) {
 const h=profile.heightMm*MM,l=profile.lengthMm*MM,t=profile.thicknessMm*MM;
 const geometry=useMemo(()=>{
  const shape=new THREE.Shape();
  shape.moveTo(-h*.34,-l*.47);shape.lineTo(h*.40,-l*.47);shape.lineTo(h*.48,-l*.44);
  shape.lineTo(h*.48,l*.44);shape.lineTo(h*.40,l*.47);shape.lineTo(-h*.34,l*.47);
  shape.lineTo(-h*.40,l*.43);shape.lineTo(-h*.40,-l*.43);shape.closePath();
  return new THREE.ExtrudeGeometry(shape,{depth:t*.14,bevelEnabled:true,bevelSize:.004,bevelThickness:.003,bevelSegments:2,steps:1});
 },[h,l,t]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 const light=new THREE.Color(profile.heatspreaderColor).getHSL({h:0,s:0,l:0}).l>.5;
 return <group name="crucial-folded-heatspreaders">
  {[-1,1].map(side=><group key={side} position={[0,0,side*t*.35]} rotation={[side<0?Math.PI:0,0,0]}>
   <mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial color={profile.heatspreaderColor} metalness={.45} roughness={.48}/></mesh>
   <group position={[h*.35,0,t*.15]} rotation={[0,.10,0]}><MetalBox size={[h*.18,l*.87,.004]} color={light?'#f4f5f2':'#353a3e'} roughness={.52}/></group>
   <group position={[-h*.31,0,t*.15]} rotation={[0,-.10,0]}><MetalBox size={[h*.14,l*.86,.004]} color={light?'#c7cbca':'#171c20'} roughness={.48}/></group>
   <HardwareLabel text="crucial" subtext="by Micron" position={[h*.025,0,t*.17]} rotation={[0,0,Math.PI/2]} width={l*.35} height={h*.40} color={light?'#555d5f':'#d1d6d5'}/>
  </group>)}
 </group>;
}

export function Samsung9100Surface({profile}:{profile:StorageVisualProfile}) {
 const w=profile.widthMm*MM,l=profile.lengthMm*MM,h=profile.heightMm*MM;
 const chips=useMemo<BoxInstance[]>(()=>[-.32,-.1].map(z=>({position:[h*.3,0,l*z] as V3,size:[h*.55,w*.88,l*.2] as V3})),[h,w,l]);
 const parts=useMemo<BoxInstance[]>(()=>Array.from({length:36},(_,i)=>({position:[h*.15,w*(i%2?-.43:.43),-l*.39+(i%18)*l*.046] as V3,size:[h*.25,w*.07,l*.021] as V3})),[h,w,l]);
 return <group name="samsung-9100-pro-surface">
  <BoxInstances items={chips} color="#15181a" roughness={.83} metalness={.08}/>
  <BoxInstances items={parts} color="#b5ae91" roughness={.55} metalness={.45}/>
  <MetalBox position={[h*.3,0,l*.32]} size={[h*.57,w*.78,l*.17]} color="#a4a7a4" finish="brushed" roughness={.5}/>
  <MetalBox position={[h*.63,0,0]} size={[.002,w*.66,l*.78]} color="#111313" roughness={.85} metalness={0}/>
  <HardwareLabel text="SAMSUNG" position={[h*.68,w*.21,-l*.23]} width={l*.25} height={w*.14} color="#f2f3ed"/>
  <HardwareLabel text="9100" position={[h*.68,w*.025,-l*.23]} width={l*.27} height={w*.29} color="#f3f3ef"/>
  <HardwareLabel text="PRO" position={[h*.68,-w*.18,-l*.23]} width={l*.27} height={w*.23} color="#e31629"/>
 </group>;
}

export function SteelLegendBoardDetails({profile}:{profile:BoardVisualProfile}) {
 const h=profile.heightMm*MM,w=profile.widthMm*MM;
 const m2=[{y:-h*.04,z:-w*.12,width:w*.55,height:h*.085},{y:-h*.35,z:w*.005,width:w*.88,height:h*.095}];
 const screws=useMemo<BoxInstance[]>(()=>m2.flatMap(p=>[-.43,0,.43].map(z=>({position:[.153,p.y,p.z+z*p.width] as V3,size:[.008,.024,.024] as V3}))),[h,w]);
 const fins=useMemo<BoxInstance[]>(()=>Array.from({length:17},(_,i)=>({position:[.17,h*.412,-w*.24+i*w*.027] as V3,size:[.006,h*.11,.006] as V3})),[h,w]);
 const sata=useMemo<BoxInstance[]>(()=>Array.from({length:4},(_,i)=>({position:[.085,-h*.14-i*h*.055,w*.465] as V3,size:[.12,h*.035,w*.065] as V3})),[h,w]);
 return <group name="steel-legend-b850-details">
  {m2.map((p,i)=><group key={i}>
   <MetalBox position={[.105,p.y,p.z]} size={[.085,p.height,p.width]} color="#d8ddda" finish="brushed" roughness={.4}/>
   <HardwareLabel text={i?'M.2 ARMOR':'BLAZING M.2'} position={[.153,p.y,p.z-p.width*.26]} width={p.width*.35} height={p.height*.30} color="#343f43"/>
  </group>)}
  <BoxInstances items={screws} color="#6b7677" metalness={.7}/>
  <BoxInstances items={fins} color="#838e8e" metalness={.6}/>
  <BoxInstances items={sata} color="#192122" roughness={.75} metalness={.05}/>
  {[0,1].map(i=><group key={i} position={[.085,h*.47,-w*.25+i*.18]}>
   <MetalBox size={[.12,.07,.14]} color="#141b1d" roughness={.75}/>
   <BoxInstances items={Array.from({length:8},(_,pin)=>({position:[.063,(pin%2-.5)*.026,(Math.floor(pin/2)-1.5)*.028] as V3,size:[.004,.016,.018] as V3}))} color="#0a0f11"/>
  </group>)}
  <HardwareLabel text="STEEL LEGEND" position={[.171,h*.18,-w*.41]} width={h*.28} height={w*.075} rotation={[Math.PI/2,Math.PI/2,0]} color="#435054"/>
  <RGBStrip position={[.12,-h*.405,w*.005]} size={[w*.86,.018,.018]} rotation={[0,Math.PI/2,0]} phase={.4}/>
 </group>;
}

export function SteelLegendGpuShroud({profile}:{profile:GpuVisualProfile}) {
 const l=profile.lengthMm*MM,w=profile.heightMm*MM,h=profile.thicknessMm*MM;
 const radius=Math.min(profile.fanSizeMm*MM*.48,w*.44,l/(profile.fanCount*2)*.95),span=l/2-radius-.04;
 const geometry=useMemo(()=>{
  const shape=new THREE.Shape(),chamfer=.07;
  shape.moveTo(-l/2+chamfer,-w/2);shape.lineTo(l/2-chamfer,-w/2);shape.lineTo(l/2,-w/2+chamfer);
  shape.lineTo(l/2,w/2-chamfer);shape.lineTo(l/2-chamfer,w/2);shape.lineTo(-l/2+chamfer,w/2);shape.lineTo(-l/2,w/2-chamfer);shape.lineTo(-l/2,-w/2+chamfer);shape.closePath();
  for(let i=0;i<profile.fanCount;i++){const hole=new THREE.Path();hole.absarc(-span+i*span*2/(profile.fanCount-1),0,radius*1.02,0,Math.PI*2,true);shape.holes.push(hole);}
  return new THREE.ExtrudeGeometry(shape,{depth:h*.14,bevelEnabled:true,bevelSize:.008,bevelThickness:.006,bevelSegments:2,curveSegments:48});
 },[l,w,h,radius,span,profile.fanCount]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 const ribs=useMemo<BoxInstance[]>(()=>[-1,1].flatMap(side=>Array.from({length:17},(_,i)=>({position:[side*w*.46,-h*.505,-l*.40+i*l*.05] as V3,size:[w*.055,.007,l*.018] as V3,rotation:[0,side*.55,0] as V3}))),[l,w,h]);
 return <group name="steel-legend-rx9060xt-shroud">
  <mesh geometry={geometry} position={[0,-h*.40,0]} rotation={[Math.PI/2,0,Math.PI/2]} castShadow receiveShadow><meshStandardMaterial color={profile.shroudColor} metalness={.38} roughness={.46}/></mesh>
  <BoxInstances items={ribs} color="#abb5b7" metalness={.6} roughness={.4}/>
  <MetalBox position={[w*.51,h*.16,-l*.16]} size={[.022,h*.43,l*.4]} color="#a2abad" roughness={.45}/>
  <HardwareLabel text="STEEL LEGEND" position={[w*.525,h*.17,-l*.16]} width={l*.35} height={h*.22} color="#2b3b3b"/>
  <RGBStrip position={[w*.525,h*.02,-l*.16]} size={[l*.35,.025,.014]} rotation={[0,Math.PI/2,0]} phase={.3}/>
 </group>;
}

export function PowerZoneGrille({profile}:{profile:PsuVisualProfile}) {
 const w=profile.widthMm*MM,h=profile.heightMm*MM,d=profile.depthMm*MM;
 const mesh=useMemo<BoxInstance[]>(()=>[
  ...Array.from({length:33},(_,i)=>({position:[-w*.43+i*w*.86/32,h*.515,0] as V3,size:[.009,.007,d*.85] as V3})),
  ...Array.from({length:33},(_,i)=>({position:[0,h*.516,-d*.425+i*d*.85/32] as V3,size:[w*.86,.007,.009] as V3})),
 ],[w,h,d]);
 return <group name="power-zone-2-square-mesh">
  <BoxInstances items={mesh} color="#4d5458" finish="paint" metalness={.38} roughness={.55}/>
  <MetalBox position={[0,h*.515,d*.46]} size={[w*.65,.008,d*.055]} color="#b1b6b7" roughness={.5}/>
  <HardwareLabel text="POWER ZONE 2" position={[0,h*.524,d*.46]} rotation={[-Math.PI/2,0,0]} width={w*.56} height={d*.042} color="#303c40"/>
 </group>;
}
