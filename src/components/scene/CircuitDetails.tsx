import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { BoxInstances, MetalBox, Tube, type BoxInstance } from './HardwarePrimitives';
type V3 = [
    number,
    number,
    number
];
/** These small assemblies represent a kind of hardware, not an electrical
 * netlist, package count or manufacturing revision. They never feed specs. */
export function CircuitPackages({ width, length, position = [0, 0, 0] }: {
    width: number;
    length: number;
    position?: V3;
}) {
    const packages = useMemo<BoxInstance[]>(() => Array.from({ length: 8 }, (_, i) => ({ position: [.014, (i % 2 - .5) * width * .74, -length * .37 + Math.floor(i / 2) * length * .24] as V3, size: [.018, width * .12, length * .055] as V3 })), [width, length]);
    const terminals = useMemo<BoxInstance[]>(() => packages.flatMap(p => [-1, 1].map(side => ({ position: [p.position[0] + .002, p.position[1], p.position[2] + side * length * .033] as V3, size: [.022, width * .13, length * .012] as V3 }))), [packages, width, length]);
    return <group name="representative-surface-mount-packages" position={position}>
  <BoxInstances items={terminals} color="#a8afaa" metalness={.82} roughness={.36}/>
  <BoxInstances items={packages} color="#403d32" metalness={.03} roughness={.8}/>
 </group>;
}
export function M2Board({ width: w, length: l, thickness: t, color }: {
    width: number;
    length: number;
    thickness: number;
    color: string;
}) {
    const geometry = useMemo(() => {
        // The edge key and open mounting notch are actual silhouette cut-outs.
        const shape = new THREE.Shape(), key = w * .07, keyY = -w * .27, mount = Math.min(w * .09, .0145);
        shape.moveTo(-l / 2, -w / 2);
        shape.lineTo(l / 2, -w / 2);
        shape.lineTo(l / 2, -mount);
        shape.absarc(l / 2, 0, mount, -Math.PI / 2, -Math.PI * 1.5, true);
        shape.lineTo(l / 2, w / 2);
        shape.lineTo(-l / 2, w / 2);
        shape.lineTo(-l / 2, keyY + key);
        shape.lineTo(-l / 2 + l * .08, keyY + key);
        shape.lineTo(-l / 2 + l * .08, keyY - key);
        shape.lineTo(-l / 2, keyY - key);
        shape.closePath();
        return new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false, curveSegments: 16, steps: 1 });
    }, [w, l, t]);
    useEffect(() => () => geometry.dispose(), [geometry]);
    return <group name="m2-keyed-laminated-board">
  <mesh geometry={geometry} position={[-t / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
   <meshStandardMaterial color={color} roughness={.72} metalness={.12}/>
  </mesh>
  <MetalBox position={[-t * .43, -w * .498, 0]} size={[t * .2, .0015, l * .9]} color="#8b7350" roughness={.66} metalness={.18}/>
 </group>;
}
export function CpuContactField({ width: w, height: h, depth: d, pins }: {
    width: number;
    height: number;
    depth: number;
    pins: boolean;
}) {
    const contacts = useRef<THREE.InstancedMesh>(null);
    useLayoutEffect(() => {
        const transform = new THREE.Object3D();
        let index = 0;
        // A representative grid keeps the package visibly distinguishable without
        // implying a socket-specific pin map or exact electrical contact count.
        for (let row = 0; row < 15; row++)
            for (let col = 0; col < 15; col++) {
                if (row > 4 && row < 10 && col > 4 && col < 10)
                    continue;
                transform.position.set(-d * .55 - (pins ? .013 : .002), (row - 7) * h * .057, (col - 7) * w * .057);
                transform.rotation.z = Math.PI / 2;
                transform.updateMatrix();
                contacts.current?.setMatrixAt(index++, transform.matrix);
            }
        if (contacts.current) {
            contacts.current.instanceMatrix.needsUpdate = true;
            contacts.current.computeBoundingSphere();
        }
    }, [w, h, d, pins]);
    return <group name={pins ? 'cpu-representative-pga-pins' : 'cpu-representative-lga-lands'} userData={{ contactLayout: 'representative-not-pin-map' }}>
  <instancedMesh ref={contacts} args={[undefined, undefined, 200]} castShadow>
   <cylinderGeometry args={[pins ? .003 : .006, pins ? .004 : .006, pins ? .026 : .003, 8]}/>
   <meshStandardMaterial color="#bb9b55" metalness={.76} roughness={.35}/>
  </instancedMesh>
  <MetalBox position={[-d * .54, 0, 0]} size={[.002, h * .25, w * .25]} color="#223f31" roughness={.8} metalness={.08}/>
 </group>;
}
export function FanWireClips({ height: h, width: w, depth: d, fanCount }: {
    height: number;
    width: number;
    depth: number;
    fanCount: number;
}) {
    const lines = useMemo<V3[][]>(() => Array.from({ length: Math.min(fanCount, 2) }, (_, fan) => [-1, 1].map(side => [
        [h * .34, side * w * .49, d * (fan ? -.055 : fanCount > 1 ? .43 : -.055)],
        [h * .38, side * w * .53, d * (fan ? -.055 : fanCount > 1 ? .43 : -.055)],
        [h * .32, side * w * .55, d * (fan ? -.14 : fanCount > 1 ? .30 : -.14)],
        [-h * .2, side * w * .55, d * (fan ? -.14 : fanCount > 1 ? .30 : -.14)],
        [-h * .28, side * w * .53, d * (fan ? -.055 : fanCount > 1 ? .43 : -.055)],
    ] as V3[])).flat(), [h, w, d, fanCount]);
    return <group name="tower-fan-retention-clips">{lines.map((points, i) => <Tube key={i} points={points} radius={.005} color="#7e8788"/>)}</group>;
}
export function VentilatedPsuShell({ width: w, height: h, depth: d, color }: {
    width: number;
    height: number;
    depth: number;
    color: string;
}) {
    const rim = useMemo<BoxInstance[]>(() => [-1, 1].flatMap(side => [
        { position: [side * w * .47, h * .495, 0] as V3, size: [w * .06, .016, d] as V3 },
        { position: [0, h * .495, side * d * .47] as V3, size: [w, .016, d * .06] as V3 },
    ]), [w, h, d]);
    const rear = useMemo<BoxInstance[]>(() => Array.from({ length: 20 }, (_, i) => ({ position: [-w * .43 + i * w * .86 / 19, h * .28, -d * .503] as V3, size: [.012, h * .3, .012] as V3 })), [w, h, d]);
    return <group name="psu-folded-sheet-shell">
  <MetalBox position={[0, -h * .49, 0]} size={[w, .018, d]} color={color} roughness={.58}/>
  {[-1, 1].map(side => <MetalBox key={side} position={[side * w * .49, 0, 0]} size={[.018, h, d]} color={color} roughness={.58}/>)}
  <MetalBox position={[0, 0, d * .49]} size={[w, h, .018]} color={color} roughness={.58}/>
  <MetalBox position={[0, -h * .185, -d * .49]} size={[w, h * .63, .018]} color={color} roughness={.58}/>
  <MetalBox position={[0, h * .465, -d * .49]} size={[w, h * .07, .018]} color={color} roughness={.58}/>
  {[-1, 1].map(side => <MetalBox key={side} position={[side * w * .465, h * .28, -d * .49]} size={[w * .07, h * .3, .018]} color={color} roughness={.58}/>)}
  <BoxInstances items={rim} color={color} roughness={.58} metalness={.16}/>
  <BoxInstances items={rear} color="#525c5d" metalness={.3} roughness={.55}/>
  <MetalBox position={[0, h * .47, 0]} size={[w * .84, .005, d * .84]} color="#0e1416" roughness={.95} metalness={.01}/>
 </group>;
}
export function AxialShroud({ length: l, width: w, height: h, fans, radius, span, color, reverseLast = false }: {
    length: number;
    width: number;
    height: number;
    fans: number;
    radius: number;
    span: number;
    color: string;
    reverseLast?: boolean;
}) {
    const geometry = useMemo(() => {
        const shape = new THREE.Shape(), corner = Math.min(.055, w * .045);
        shape.moveTo(-l / 2 + corner, -w / 2);
        shape.lineTo(l / 2 - corner, -w / 2);
        shape.lineTo(l / 2, -w / 2 + corner);
        shape.lineTo(l / 2, w / 2 - corner);
        shape.lineTo(l / 2 - corner, w / 2);
        shape.lineTo(-l / 2 + corner, w / 2);
        shape.lineTo(-l / 2, w / 2 - corner);
        shape.lineTo(-l / 2, -w / 2 + corner);
        shape.closePath();
        for (let i = 0; i < fans; i++) {
            if (reverseLast && i === fans - 1)
                continue;
            const hole = new THREE.Path();
            hole.absarc(-span + i * span * 2 / Math.max(1, fans - 1), 0, radius * 1.025, 0, Math.PI * 2, true);
            shape.holes.push(hole);
        }
        return new THREE.ExtrudeGeometry(shape, { depth: h * .12, bevelEnabled: true, bevelSize: .004, bevelThickness: .004, bevelSegments: 1, curveSegments: 40 });
    }, [l, w, h, fans, radius, span, reverseLast]);
    useEffect(() => () => geometry.dispose(), [geometry]);
    return <mesh name="axial-gpu-aperture-shroud" geometry={geometry} position={[0, -h * .41, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} castShadow receiveShadow><meshStandardMaterial color={color} metalness={.24} roughness={.47}/></mesh>;
}
