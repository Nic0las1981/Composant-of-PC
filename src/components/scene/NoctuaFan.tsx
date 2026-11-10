import { Component as Boundary, Suspense, useEffect, useMemo, useRef, type ComponentProps, type ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Component } from '../../data/catalog';
import { MM } from '../../data/visualProfiles';
import { HardwareFan } from './HardwarePrimitives';
import { useSceneAnimation } from './SceneAnimation';

/** Exact supplied fan families, confirmed by each cooler's manufacturer sheet.
 * CAD is provided for visualization; Noctua modifies some impeller details.
 * Geometry dimensions never feed the compatibility/specification data model.
 */
export const noctuaFanModels: Record<string, { asset: string; black: boolean; source: string }> = {
  'cooler-nhd15': { asset:'nf-a15-chromax',black:true,source:'https://www.noctua.at/en/products/nf-a15-hs-pwm-chromax-black-swap/downloads' },
  'cooler-nhd15-g2': { asset:'nf-a14x25r-g2',black:false,source:'https://www.noctua.at/en/products/nf-a14x25r-g2-pwm/downloads' },
  'cooler-nhd12l': { asset:'nf-a12x25r',black:false,source:'https://www.noctua.at/en/products/nf-a12x25r-pwm/downloads' },
  'cooler-l9a': { asset:'nf-a9x14',black:false,source:'https://www.noctua.at/en/products/nf-a9x14-pwm/downloads' },
  'cooler-l9i-17xx': { asset:'nf-a9x14',black:true,source:'https://www.noctua.at/en/products/nf-a9x14-hs-pwm-chromax-black-swap/downloads' },
};

class FanAssetBoundary extends Boundary<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed:false };
  static getDerivedStateFromError() { return { failed:true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function ManufacturerFan({ asset, black, position, rotation }: {
  asset:string; black:boolean;
  position:ComponentProps<typeof HardwareFan>['position'];
  rotation:ComponentProps<typeof HardwareFan>['rotation'];
}) {
  const { nodes } = useGLTF(`${import.meta.env.BASE_URL}models/noctua/${asset}.glb`);
  const rotor = useRef<THREE.Group>(null);
  const animated = useSceneAnimation();
  const { gl, invalidate } = useThree();
  const materials = useMemo(() => ({
    frame:new THREE.MeshStandardMaterial({color:black?'#242629':'#d6c6ac',roughness:.62,metalness:.02}),
    rotor:new THREE.MeshStandardMaterial({color:black?'#292c2f':'#79503a',roughness:.45,metalness:.03}),
    pads:new THREE.MeshStandardMaterial({color:black?'#16181b':'#67432f',roughness:.88,metalness:0}),
    label:new THREE.MeshStandardMaterial({color:'#c6c5bf',roughness:.8,metalness:0}),
  }),[black]);
  useEffect(() => () => Object.values(materials).forEach(material => material.dispose()),[materials]);
  useEffect(() => { gl.shadowMap.needsUpdate=true;invalidate(); },[nodes,gl,invalidate]);
  useFrame((_,delta) => {
    if (rotor.current && animated) rotor.current.rotation.z=(rotor.current.rotation.z-Math.min(delta,.05)*7.2)%(Math.PI*2);
  });
  const mesh = (name:keyof typeof materials) => {
    const node=nodes[name];
    if (!(node instanceof THREE.Mesh)) throw new Error(`Missing manufacturer CAD part: ${name}`);
    return <mesh geometry={node.geometry} material={materials[name]} castShadow receiveShadow dispose={null}/>;
  };
  return <group name="hardware-fan" position={position} rotation={rotation} scale={MM} userData={{ animationKind:'fan',manufacturerCad:asset,rgb:false }}>
    {mesh('frame')}{mesh('pads')}{mesh('label')}
    <group ref={rotor} name="fan-rotor" userData={{animationKind:'fan-rotor'}}>{mesh('rotor')}</group>
  </group>;
}

export function CoolerFan({ component, ...props }: ComponentProps<typeof HardwareFan> & { component:Component }) {
  const model=component.brand==='Noctua' ? noctuaFanModels[component.id] : undefined;
  const fallback=<HardwareFan {...props}/>;
  if (!model) return fallback;
  return <FanAssetBoundary key={model.asset} fallback={fallback}><Suspense fallback={fallback}>
    <ManufacturerFan asset={model.asset} black={model.black} position={props.position} rotation={props.rotation}/>
  </Suspense></FanAssetBoundary>;
}
