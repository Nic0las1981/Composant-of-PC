import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { useSceneAnimation } from "./SceneAnimation";
import { createHardwareSurfaces, type SurfaceFinish } from "./SurfaceTextures";

const HardwareSurfaceContext = createContext<ReturnType<typeof createHardwareSurfaces> | null>(null);

export function HardwareSurfaceProvider({ children }: { children: ReactNode }) {
  const surfaces = useMemo(createHardwareSurfaces, []);
  useEffect(() => {
    Object.values(surfaces).forEach(({ texture }) => { texture.needsUpdate = true; });
    return () => Object.values(surfaces).forEach(({ texture }) => texture.dispose());
  }, [surfaces]);
  return <HardwareSurfaceContext.Provider value={surfaces}>{children}</HardwareSurfaceContext.Provider>;
}

export function useHardwareSurface(finish: SurfaceFinish) {
  const surfaces = useContext(HardwareSurfaceContext);
  return finish === "smooth" ? undefined : surfaces?.[finish];
}

const visualFinish = (finish: SurfaceFinish | undefined, metalness: number): SurfaceFinish =>
  finish ?? (metalness >= 0.75 ? "brushed" : metalness <= 0.18 ? "plastic" : "paint");

type Vector3 = [number, number, number];
export type BoxInstance = {
  position: Vector3;
  size: Vector3;
  rotation?: Vector3;
};

export function MetalBox({
  position = [0, 0, 0],
  size,
  color = "#20242a",
  metalness = 0.65,
  roughness = 0.38,
  emissive,
  finish,
  bevel,
}: {
  position?: Vector3;
  size: Vector3;
  color?: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  finish?: SurfaceFinish;
  /** Small edge highlights for large solid covers; zero retains square edges. */
  bevel?: number;
}) {
  const materialFinish = visualFinish(finish, metalness);
  const surface = useHardwareSurface(materialFinish);
  const [width, height, depth] = size;
  const shortest = Math.min(width, height, depth);
  const radius = Math.max(0, Math.min(shortest * 0.2, bevel ?? (shortest >= 0.035 && Math.max(...size) >= 0.35 && materialFinish !== "pcb" ? 0.006 : 0)));
  const geometry = useMemo(() => radius
    ? new RoundedBoxGeometry(width, height, depth, 1, radius)
    : new THREE.BoxGeometry(width, height, depth), [width, height, depth, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh position={position} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        roughnessMap={surface?.texture}
        bumpMap={surface?.texture}
        bumpScale={surface?.bumpScale ?? 0}
        envMapIntensity={surface?.envMapIntensity ?? 1}
        emissive={emissive || "#000000"}
        emissiveIntensity={emissive ? 0.5 : 0}
      />
    </mesh>
  );
}

export function BoxInstances({
  items,
  color = "#3d4248",
  metalness = 0.65,
  roughness = 0.4,
  finish,
}: {
  items: BoxInstance[];
  color?: string;
  metalness?: number;
  roughness?: number;
  finish?: SurfaceFinish;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const surface = useHardwareSurface(visualFinish(finish, metalness));
  const rounded = items.length > 0 && items.every(item => Math.min(...item.size) >= .018 && Math.max(...item.size) > .08);
  const instanceGeometry=useMemo(()=>rounded ? new RoundedBoxGeometry(1,1,1,1,.025) : new THREE.BoxGeometry(1,1,1),[rounded]);
  useEffect(()=>()=>instanceGeometry.dispose(),[instanceGeometry]);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const object = new THREE.Object3D();
    items.forEach((item, index) => {
      object.position.set(...item.position);
      object.scale.set(...item.size);
      object.rotation.set(...(item.rotation || [0, 0, 0]));
      object.updateMatrix();
      ref.current!.setMatrixAt(index, object.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [items]);
  return (
    <instancedMesh
      ref={ref}
      args={[instanceGeometry, undefined, items.length]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        roughnessMap={surface?.texture}
        bumpMap={surface?.texture}
        bumpScale={surface?.bumpScale ?? 0}
        envMapIntensity={surface?.envMapIntensity ?? 1}
      />
    </instancedMesh>
  );
}

export function HardwareLabel({
  text,
  subtext,
  position = [0, 0, 0],
  rotation = [0, Math.PI / 2, 0],
  width = 0.7,
  height = 0.1,
  color = "#c5cbd0",
  background,
}: {
  text: string;
  subtext?: string;
  position?: Vector3;
  rotation?: Vector3;
  width?: number;
  height?: number;
  color?: string;
  background?: string;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const c = canvas.getContext("2d")!;
    if (background) {
      c.fillStyle = background;
      c.fillRect(0, 0, 1024, 256);
    }
    c.fillStyle = color;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "600 84px Arial, sans-serif";
    c.fillText(text, 512, subtext ? 96 : 128, 970);
    if (subtext) {
      c.fillStyle = "#8d969e";
      c.font = "500 36px Arial, sans-serif";
      c.fillText(subtext, 512, 184, 970);
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    return map;
  }, [text, subtext, color, background]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent={!background}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Texture-backed light diffusers keep the rainbow to one draw call per strip. */
function useRgbTexture(circular: boolean, phase: number) {
  const animated = useSceneAnimation();
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = circular ? 128 : 256;
    canvas.height = circular ? 128 : 8;
    const context = canvas.getContext("2d")!;
    const gradient = circular
      ? context.createConicGradient(0, 64, 64)
      : context.createLinearGradient(0, 0, 256, 0);
    ["#28dbea", "#466bff", "#a84dff", "#ff52bf", "#ff8c66", "#a8ed8b", "#28dbea"]
      .forEach((color, index, colors) => gradient.addColorStop(index / (colors.length - 1), color));
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.center.set(0.5, 0.5);
    if (circular) map.rotation = phase;
    else map.offset.x = phase;
    return map;
  }, [circular, phase]);
  useFrame((_, delta) => {
    if (!animated) return;
    const step = Math.min(delta, 0.05);
    if (circular) texture.rotation = (texture.rotation + step * 0.22) % (Math.PI * 2);
    else texture.offset.x = (texture.offset.x + step * 0.035) % 1;
  });
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/** A multicolour diffuser along the local X axis. Render only for actual RGB parts. */
export function RGBStrip({
  size,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  phase = 0,
}: {
  size: Vector3;
  position?: Vector3;
  rotation?: Vector3;
  phase?: number;
}) {
  const texture = useRgbTexture(false, phase);
  return (
    <mesh name="rgb-diffuser-strip" userData={{ animationKind: "rgb" }} position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.75}
        metalness={0.04}
        roughness={0.3}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Local +Z-facing ring. Width is the difference between its outer and inner radii. */
export function RGBRing({
  radius,
  width = radius * 0.14,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  phase = 0,
}: {
  radius: number;
  width?: number;
  position?: Vector3;
  rotation?: Vector3;
  phase?: number;
}) {
  const texture = useRgbTexture(true, phase);
  return (
    <mesh name="rgb-diffuser-ring" userData={{ animationKind: "rgb" }} position={position} rotation={rotation}>
      <ringGeometry args={[Math.max(0, radius - width), radius, 64]} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.75}
        metalness={0.04}
        roughness={0.3}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function CurvedFanBlades({ radius, color }: { radius: number; color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const surface = useHardwareSurface("plastic");
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0.17, -0.07);
    shape.bezierCurveTo(0.35, -0.09, 0.48, -0.22, 0.66, -0.26);
    shape.bezierCurveTo(0.82, -0.31, 0.9, -0.15, 0.88, 0.045);
    shape.bezierCurveTo(0.82, 0.17, 0.67, 0.23, 0.51, 0.15);
    shape.bezierCurveTo(0.35, 0.09, 0.26, 0.07, 0.17, 0.07);
    shape.closePath();
    const blade = new THREE.ExtrudeGeometry(shape, {
      depth: 0.018,
      bevelEnabled: true,
      bevelSize: .003,
      bevelThickness: .002,
      bevelSegments: 1,
      curveSegments: 10,
      steps: 1,
    });
    const vertices=blade.getAttribute("position");
    for(let i=0;i<vertices.count;i++){
      const x=vertices.getX(i),y=vertices.getY(i);
      vertices.setZ(i,vertices.getZ(i)+y*(.32+.2*x)+.035*x*x);
    }
    blade.computeVertexNormals();
    return blade;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const object = new THREE.Object3D();
    for (let i = 0; i < 9; i++) {
      object.rotation.z = (i / 9) * Math.PI * 2;
      object.scale.setScalar(radius);
      object.updateMatrix();
      ref.current.setMatrixAt(i, object.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [radius]);
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, 9]}>
      <meshStandardMaterial
        color={color}
        metalness={0.12}
        roughness={0.43}
        roughnessMap={surface?.texture}
        bumpMap={surface?.texture}
        bumpScale={surface?.bumpScale ?? 0}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

function FanHousing({ radius, color }: { radius: number; color: string }) {
  const surface = useHardwareSurface("plastic");
  const geometry = useMemo(() => {
    const extent = radius * 1.065;
    const shape = new THREE.Shape();
    shape.moveTo(-extent, -extent);
    shape.lineTo(extent, -extent);
    shape.lineTo(extent, extent);
    shape.lineTo(-extent, extent);
    shape.closePath();
    const aperture = new THREE.Path();
    aperture.absarc(0, 0, radius * 0.965, 0, Math.PI * 2, true);
    shape.holes.push(aperture);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.085,
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.004,
      bevelSegments: 1,
      curveSegments: 32,
      steps: 1,
    });
  }, [radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} position={[0, 0, -0.0425]} castShadow receiveShadow>
      <meshStandardMaterial color={color} metalness={0.08} roughness={0.58}
        roughnessMap={surface?.texture} bumpMap={surface?.texture} bumpScale={surface?.bumpScale ?? 0} />
    </mesh>
  );
}

/** A fan's axis is local Z; the visible face points toward +Z. */
export function HardwareFan({
  radius = 0.32,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  frame = false,
  rgb = false,
  accent = "#b3f472",
  hubLabel,
  color = "#171b20",
  bladeColor,
}: {
  radius?: number;
  position?: Vector3;
  rotation?: Vector3;
  frame?: boolean;
  rgb?: boolean;
  accent?: string;
  hubLabel?: string;
  color?: string;
  bladeColor?: string;
}) {
  const rotor = useRef<THREE.Group>(null);
  const animated = useSceneAnimation();
  const rgbPhase = useMemo(() => new THREE.Color(accent).getHSL({ h: 0, s: 0, l: 0 }).h * Math.PI * 2, [accent]);
  const resolvedBladeColor = useMemo(() => {
    if (bladeColor) return bladeColor;
    const surface = new THREE.Color(color);
    const hsl = { h: 0, s: 0, l: 0 };
    surface.getHSL(hsl);
    if (hsl.s > 0.2 && hsl.h < 0.18) return color; // Brown fan blades retain their finish.
    if (surface.r + surface.g + surface.b > 1.55) return "#dbe0e1";
    return rgb ? "#acb9c4" : "#39434b";
  }, [color, bladeColor, rgb]);
  useFrame((_, delta) => {
    if (!rotor.current || !animated) return;
    // Slowed illustrative motion keeps the individual blades readable, not a measured RPM.
    rotor.current.rotation.z = (rotor.current.rotation.z - Math.min(delta, 0.05) * 7.2) % (Math.PI * 2);
  });
  const screws = useMemo<BoxInstance[]>(
    () =>
      [-1, 1].flatMap((x) =>
        [-1, 1].map((y) => ({
          position: [x * radius * 0.86, y * radius * 0.86, 0.048] as Vector3,
          size: [0.025, 0.025, 0.017] as Vector3,
        })),
      ),
    [radius],
  );
  const supports = useMemo<BoxInstance[]>(() => [0.65, 0.65 + Math.PI / 2].map((angle) => ({
    position: [0, 0, -0.025] as Vector3,
    size: [radius * 1.95, radius * 0.085, 0.024] as Vector3,
    rotation: [0, 0, angle] as Vector3,
  })), [radius]);
  return (
    <group name="hardware-fan" userData={{ animationKind: "fan", rgb }} position={position} rotation={rotation}>
      {frame && <><FanHousing radius={radius} color={color} /><BoxInstances items={supports} color={color} metalness={0.1} roughness={0.6} /></>}
      {rgb ? <RGBRing radius={radius} position={[0, 0, 0.047]} phase={rgbPhase} /> : <mesh position={[0, 0, 0.047]}>
        <ringGeometry args={[radius * 0.86, radius, 48]} />
        <meshStandardMaterial
          color="#343b42"
          roughness={0.3}
          metalness={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>}
      <group ref={rotor} name="fan-rotor" userData={{ animationKind: "fan-rotor" }}>
      <group position={[0, 0, 0.005]}>
        <CurvedFanBlades radius={radius} color={resolvedBladeColor} />
      </group>
      <mesh position={[0, 0, 0.016]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.24, radius * 0.24, 0.04, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.039]}>
        <circleGeometry args={[radius * 0.13, 16]} />
        <meshStandardMaterial
          color={color}
          metalness={0.12}
          roughness={0.52}
        />
      </mesh>
      {hubLabel && (
        <HardwareLabel
          text={hubLabel}
          width={radius * 0.3}
          height={radius * 0.16}
          position={[0, 0, 0.042]}
          rotation={[0, 0, 0]}
          color="#e0e2e4"
        />
      )}
      </group>
      {frame && <BoxInstances items={screws} color="#777d83" metalness={0.8} />}
    </group>
  );
}

export function Tube({
  points,
  radius = 0.018,
  color = "#aaaeb1",
  finish = "brushed",
}: {
  points: Vector3[];
  radius?: number;
  color?: string;
  finish?: SurfaceFinish;
}) {
  const surface = useHardwareSurface(finish);
  const insulated = finish === "plastic" || finish === "pcb";
  const geometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
        24,
        radius,
        8,
        false,
      ),
    [points, radius],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial color={color} metalness={insulated ? 0.02 : finish === "paint" ? 0.16 : 0.88} roughness={insulated ? 0.67 : finish === "paint" ? 0.55 : 0.27}
        roughnessMap={surface?.texture} bumpMap={surface?.texture} bumpScale={surface?.bumpScale ?? 0}
        envMapIntensity={surface?.envMapIntensity ?? 1} />
    </mesh>
  );
}
