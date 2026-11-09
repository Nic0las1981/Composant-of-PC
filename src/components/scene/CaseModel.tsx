import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { MM, type CaseVisualProfile } from "../../data/visualProfiles";
import { BoxInstances, HardwareFan, RGBStrip, useHardwareSurface, type BoxInstance } from "./HardwarePrimitives";

type Vec3 = [number, number, number];
const noRaycast = () => {};

function caseBrand(profile: CaseVisualProfile) {
  if (/Fractal/i.test(profile.name)) return "FRACTAL";
  if (/Lian Li/i.test(profile.name)) return "LIAN LI";
  if (/Cooler Master/i.test(profile.name)) return "COOLER MASTER";
  return profile.name.split(" ")[0].toUpperCase();
}

/** Distinct enclosures built in millimetres, without remote model dependencies.
 * These are recognisable dimensional reconstructions, not manufacturer CAD.
 * The removable +X panel intentionally does not intercept component picking.
 */
export interface CaseModelProps {
  profile: CaseVisualProfile;
  openSide?: boolean;
  exploded?: boolean;
  occupiedMount?: "top" | "front" | "side";
}

function Metal({
  size,
  position = [0, 0, 0],
  color = "#252a2d",
  roughness = 0.56,
  rotation = [0, 0, 0],
}: {
  size: Vec3;
  position?: Vec3;
  color?: string;
  roughness?: number;
  rotation?: Vec3;
}) {
  const surface = useHardwareSurface("paint");
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={0.16}
        roughness={roughness}
        bumpMap={surface?.texture}
        roughnessMap={surface?.texture}
        bumpScale={surface?.bumpScale ?? 0}
        envMapIntensity={surface?.envMapIntensity ?? 1}
      />
    </mesh>
  );
}

function Screw({
  position,
  rotation = [0, 0, 0],
}: {
  position: Vec3;
  rotation?: Vec3;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.025, 0.014, 16]} />
        <meshStandardMaterial
          color="#80898e"
          metalness={0.9}
          roughness={0.24}
        />
      </mesh>
      <Metal
        size={[0.025, 0.005, 0.006]}
        position={[0, 0, 0.009]}
        color="#131719"
      />
      <Metal size={[0.005, 0.025, 0.006]} position={[0, 0, 0.009]} color="#131719" />
    </group>
  );
}

type Perforation = "round" | "diagonal" | "triangle" | "slats";
function usePerforation(kind: Perforation) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = "#000000";
    if (kind === "slats") {
      for (let x = 8; x < 128; x += 16) ctx.fillRect(x, 5, 8, 118);
    } else {
      const gap = kind === "diagonal" ? 23 : 17;
      for (let y = 0; y <= 128; y += gap)
        for (let x = -gap; x <= 128; x += gap) {
          const shift = ((Math.floor(y / gap) % 2) * gap) / 2;
          ctx.beginPath();
          if (kind === "triangle") {
            ctx.moveTo(x + shift, y - 5.5);
            ctx.lineTo(x + shift + 5.3, y + 4.5);
            ctx.lineTo(x + shift - 5.3, y + 4.5);
            ctx.closePath();
          } else if (kind === "diagonal") {
            ctx.moveTo(x + shift, y - 6);
            ctx.lineTo(x + shift + 6, y);
            ctx.lineTo(x + shift, y + 6);
            ctx.lineTo(x + shift - 6, y);
          } else ctx.arc(x + shift, y, 4.9, 0, Math.PI * 2);
          ctx.fill();
        }
    }
    const result = new THREE.CanvasTexture(canvas);
    result.wrapS = result.wrapT = THREE.RepeatWrapping;
    result.repeat.set(kind === "slats" ? 1.5 : 2.5, kind === "slats" ? 1 : 3.5);
    result.anisotropy = 4;
    return result;
  }, [kind]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function MeshPanel({
  size,
  position,
  rotation = [0, 0, 0],
  color,
  pattern = "round",
  ghost = false,
  nonInteractive = false,
}: {
  size: [number, number];
  position: Vec3;
  rotation?: Vec3;
  color: string;
  pattern?: Perforation;
  ghost?: boolean;
  nonInteractive?: boolean;
}) {
  const alpha = usePerforation(pattern);
  const surface = useHardwareSurface("paint");
  return (
    <mesh
      position={position}
      rotation={rotation}
      raycast={nonInteractive ? noRaycast : undefined}
      receiveShadow
    >
      <planeGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={0.16}
        roughness={0.62}
        bumpMap={surface?.texture}
        bumpScale={surface?.bumpScale ?? 0}
        envMapIntensity={surface?.envMapIntensity ?? 1}
        alphaMap={alpha}
        alphaTest={ghost ? 0 : 0.5}
        side={THREE.DoubleSide}
        transparent={ghost}
        opacity={ghost ? 0.08 : 1}
        depthWrite={!ghost}
      />
    </mesh>
  );
}

/** Two shallow layers give a perforated intake depth without modelling every
 * hole. The weave is illustrative; it does not specify a filtration rating. */
function IntakeFilter({ width, height, position }: { width: number; height: number; position: Vec3 }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 64; i += 8) {
      context.fillStyle = "#b8b8b8";
      context.fillRect(i, 0, 1.2, 64);
      context.fillStyle = "#ffffff";
      context.fillRect(0, i, 64, 1.2);
    }
    const map = new THREE.CanvasTexture(canvas);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(width * 7, height * 7);
    map.anisotropy = 4;
    return map;
  }, [width, height]);
  useEffect(() => () => texture.dispose(), [texture]);
  const border = useMemo<BoxInstance[]>(() => [
    ...[-1, 1].map(side => ({ position: [side * (width / 2 - 0.015), 0, 0] as Vec3, size: [0.03, height, 0.024] as Vec3 })),
    ...[-1, 1].map(side => ({ position: [0, side * (height / 2 - 0.015), 0] as Vec3, size: [width, 0.03, 0.024] as Vec3 })),
  ], [width, height]);
  return <group position={position}>
    <mesh raycast={noRaycast} receiveShadow>
      <planeGeometry args={[width - 0.035, height - 0.035]} />
      <meshStandardMaterial color="#222a2b" roughness={0.96} metalness={0} alphaMap={texture} alphaTest={0.15} side={THREE.DoubleSide} />
    </mesh>
    <BoxInstances items={border} color="#242b2d" roughness={0.86} metalness={0.06} />
  </group>;
}

/** The rubber contact pad and painted upper shell are separate materials. */
function CaseFoot({ position, size, color }: { position: Vec3; size: Vec3; color: string }) {
  const surface = useHardwareSurface("paint");
  return <group position={position}>
    <RoundedBox args={[size[0], size[1] * 0.7, size[2]]} radius={0.018} smoothness={2} position={[0, size[1] * 0.15, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={color} metalness={0.18} roughness={0.55} bumpMap={surface?.texture} bumpScale={surface?.bumpScale ?? 0} />
    </RoundedBox>
    <RoundedBox args={[size[0] * 0.87, size[1] * 0.3, size[2] * 0.88]} radius={0.009} smoothness={2} position={[0, -size[1] * 0.35, 0]} receiveShadow>
      <meshStandardMaterial color="#121718" metalness={0} roughness={0.96} />
    </RoundedBox>
  </group>;
}

function CaseFan({
  position,
  rotation = [0, 0, 0],
  size = 120 * MM,
  light = false,
  rgb = false,
  accent,
  label,
}: {
  position: Vec3;
  rotation?: Vec3;
  size?: number;
  light?: boolean;
  rgb?: boolean;
  accent?: string;
  label?: string;
}) {
  return (
    <HardwareFan
      position={position}
      rotation={rotation}
      radius={size / 2.13}
      frame
      rgb={rgb}
      accent={accent}
      color={light ? "#e1e5e5" : "#20272a"}
      bladeColor={light ? "#c7cfd0" : rgb ? "#a6b7bf" : "#5b666c"}
      hubLabel={label}
    />
  );
}

function FrontBadge({
  text,
  position,
  rotation = [0, 0, 0],
  color = "#939c9b",
  width = 0.55,
}: {
  text: string;
  position: Vec3;
  rotation?: Vec3;
  color?: string;
  width?: number;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 96;
    const c = canvas.getContext("2d")!;
    c.font = "500 42px Arial, sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = color;
    c.fillText(text, 256, 48);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [text, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, (width * 96) / 512]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function TopIO({
  width,
  height,
  depth,
  compact = false,
  light = false,
}: {
  width: number;
  height: number;
  depth: number;
  compact?: boolean;
  light?: boolean;
}) {
  const y = height / 2 + 0.006,
    z = depth / 2 - 0.17,
    x = width / 2 - 0.2;
  return (
    <group>
      <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.044, 0.054, 28]} />
        <meshStandardMaterial color={light ? "#919b9c" : "#9faeb3"} metalness={0.7} roughness={0.36} />
      </mesh>
      <mesh position={[x, y + 0.002, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.038, 24]} />
        <meshStandardMaterial color={light ? "#c1c9ca" : "#242d30"} roughness={0.4} />
      </mesh>
      <mesh position={[x, y + 0.004, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.013, 0.016, 20, 1, 0.62, Math.PI * 2 - 1.24]} />
        <meshBasicMaterial color={light ? "#455157" : "#d6e3e6"} />
      </mesh>
      <Metal position={[x, y + 0.006, z - 0.012]} size={[0.004, 0.003, 0.02]} color={light ? "#455157" : "#d6e3e6"} />
      {[0, ...(compact ? [] : [1])].map((i) => (
        <group key={i} position={[x - 0.19 - i * 0.15, y, z]}>
          <Metal size={[0.105, 0.014, 0.044]} color={light ? "#929fa5" : "#899499"} roughness={0.34} />
          <Metal position={[0, 0.009, 0]} size={[0.087, 0.008, 0.032]} color="#0a1117" roughness={0.8} />
          <Metal position={[0, 0.014, 0.007]} size={[0.067, 0.005, 0.01]} color="#2b6091" roughness={0.6} />
        </group>
      ))}
      <mesh position={[x - (compact ? 0.33 : 0.49), y, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.016, 0.024, 20]} />
        <meshStandardMaterial color="#8f9b9d" metalness={0.75} roughness={0.4} />
      </mesh>
      <mesh position={[x - (compact ? 0.33 : 0.49), y + 0.001, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.016, 20]} />
        <meshBasicMaterial color="#080c0d" />
      </mesh>
    </group>
  );
}

/** Recessed rubber cable pass-throughs on the motherboard tray. */
function CableGrommet({ position, height = 0.32, width = 0.16 }: { position: Vec3; height?: number; width?: number }) {
  const ribs = useMemo<BoxInstance[]>(() => Array.from({ length: 4 }, (_, i) => ({
    position: [0.022, -height * 0.3 + i * height * 0.2, 0] as Vec3,
    size: [0.007, 0.009, width * 0.8] as Vec3,
  })), [height, width]);
  return <group position={position}>
    <RoundedBox args={[0.032, height, width]} radius={0.014} smoothness={2}>
      <meshStandardMaterial color="#22272a" roughness={0.93} metalness={0} />
    </RoundedBox>
    <Metal size={[0.012, height * 0.77, width * 0.68]} position={[0.019, 0, 0]} color="#080e12" roughness={1} />
    <BoxInstances items={ribs} color="#394145" metalness={0} roughness={0.95} />
  </group>;
}

/** Folded sheet-metal seams and expansion slot covers remain visible from the rear. */
function ChassisDetails({ profile, width: w, height: h, depth: d }: { profile: CaseVisualProfile; width: number; height: number; depth: number }) {
  const small = profile.kind === "compact";
  const panoramic = profile.kind === "panoramic";
  const trayX = panoramic ? -0.43 : -w / 2 + 0.07;
  const slots = small ? 4 : 7;
  const slotY = -h * 0.03;
  const vents = useMemo<BoxInstance[]>(() => Array.from({ length: slots }, (_, row) =>
    Array.from({ length: 5 }, (_, col) => ({
      position: [w * 0.1 - 0.29 + col * 0.14, slotY - row * 0.145, -d / 2 - 0.024] as Vec3,
      size: [0.08, 0.037, 0.007] as Vec3,
    }))).flat(), [slots, w, slotY, d]);
  const foldedEdges = useMemo<BoxInstance[]>(() => [
    ...[-1, 1].map(side => ({ position: [w / 2 - 0.06, side * (h / 2 - 0.12), 0] as Vec3, size: [0.012, 0.028, d - 0.25] as Vec3 })),
    ...[-1, 1].map(side => ({ position: [w / 2 - 0.06, 0, side * (d / 2 - 0.1)] as Vec3, size: [0.012, h - 0.25, 0.028] as Vec3 })),
  ], [w, h, d]);
  return <group>
    <Metal size={[0.018, h - 0.32, d * 0.7]} position={[trayX, 0.04, -d * 0.08]} color={profile.frameColor} roughness={0.72} />
    {[-0.25, 0.33, 0.91].map((y, i) => <CableGrommet key={i} position={[trayX + 0.022, h * y * 0.35, d * 0.31]} height={small ? 0.25 : 0.34} />)}
    {[0, 1].map((i) => <Metal key={i} size={[0.024, h - 0.35, 0.018]} position={[trayX + 0.018, 0.02, -d * 0.43 + i * d * 0.72]} color={profile.color} roughness={0.7} />)}
    {Array.from({ length: slots }, (_, i) => <Metal key={i} size={[0.82, 0.105, 0.012]} position={[w * 0.1, slotY - i * 0.145, -d / 2 - 0.014]} color={profile.frameColor} roughness={0.65} />)}
    <BoxInstances items={vents} color="#080d10" metalness={0.15} roughness={0.75} />
    <BoxInstances items={foldedEdges} color={isLightCase(profile) ? "#a7b0b1" : "#161d21"} metalness={0.18} roughness={0.68} />
    {[-1, 1].flatMap((y) => [-1, 1].map((z) => <Screw key={`${y}-${z}`} position={[w / 2 - 0.035, y * (h / 2 - 0.15), z * (d / 2 - 0.08)]} rotation={[0, Math.PI / 2, 0]} />))}
    {[-1, 1].map((x) => <Metal key={x} size={[0.027, 0.035, d - 0.18]} position={[x * (w / 2 - 0.08), h / 2 - 0.08, 0]} color={profile.frameColor} roughness={0.75} />)}
  </group>;
}

/** A real opening keeps the rear intake from becoming an opaque painted wall.
 * Its shape follows the illustrated fan size, not a manufacturer CAD drawing. */
function RearPanel({ profile, width: w, height: h, depth: d }: { profile: CaseVisualProfile; width: number; height: number; depth: number }) {
  const surface = useHardwareSurface("paint");
  const hasFan = (profile.rearFanCount ?? 0) > 0 || (profile.kind === "compact" && profile.fanCount > 0);
  const fanY = h / 2 - (profile.kind === "compact" ? 0.6 : profile.kind === "panoramic" ? 0.67 : 0.65);
  const radius = Math.min(profile.fanSizeMm * MM * 0.43, w * 0.37, h / 2 - 0.065 - fanY);
  const geometry = useMemo(() => {
    const panel = new THREE.Shape();
    panel.moveTo(-w / 2 + 0.06, -h / 2 + 0.095);
    panel.lineTo(w / 2 - 0.06, -h / 2 + 0.095);
    panel.lineTo(w / 2 - 0.06, h / 2 - 0.055);
    panel.lineTo(-w / 2 + 0.06, h / 2 - 0.055);
    panel.closePath();
    if (hasFan) {
      const opening = new THREE.Path();
      opening.absarc(0, fanY, radius, 0, Math.PI * 2, true);
      panel.holes.push(opening);
    }
    return new THREE.ExtrudeGeometry(panel, { depth: 0.018, bevelEnabled: false, curveSegments: 32 });
  }, [w, h, hasFan, fanY, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group position={[0, 0, -d / 2 + 0.006]}>
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={profile.color} roughness={0.6} metalness={0.16} bumpMap={surface?.texture} bumpScale={surface?.bumpScale ?? 0} />
    </mesh>
    {hasFan && <>
      <MeshPanel size={[radius * 2, radius * 2]} position={[0, fanY, 0.022]} color={profile.frameColor} />
      <mesh position={[0, fanY, -0.006]}>
        <torusGeometry args={[radius + 0.008, 0.012, 6, 48]} />
        <meshStandardMaterial color={profile.frameColor} roughness={0.5} metalness={0.25} />
      </mesh>
      {[-1, 1].flatMap(x => [-1, 1].map(y => <Screw key={`${x}-${y}`} position={[x * radius * 0.92, fanY + y * radius * 0.92, -0.016]} rotation={[0, Math.PI, 0]} />))}
    </>}
  </group>;
}

function SidePanel({
  width,
  height,
  depth,
  profile,
  openSide,
  exploded,
}: CaseModelProps & { width: number; height: number; depth: number }) {
  const ref = useRef<THREE.Group>(null);
  const start = width / 2;
  const target = start + (exploded ? 0.95 : 0);
  useFrame((_, delta) => {
    if (ref.current)
      ref.current.position.x = THREE.MathUtils.damp(
        ref.current.position.x,
        target,
        8,
        delta,
      );
  });
  const ghost = openSide && !exploded;
  return (
    <group ref={ref} position={[start, 0, 0]}>
      {profile.sidePanel === "vented" ? (
        <MeshPanel
          position={[0, 0.025, 0]}
          rotation={[0, Math.PI / 2, 0]}
          size={[depth - 0.13, height - 0.17]}
          color={profile.color}
          pattern={profile.kind === "sandwich" ? "slats" : "round"}
          ghost={ghost}
          nonInteractive
        />
      ) : (
        <mesh raycast={noRaycast} position={[-0.012, 0.025, 0]}>
          <boxGeometry args={[0.032, height - 0.17, depth - 0.13]} />
          <meshPhysicalMaterial
            color={profile.sidePanel === "acrylic" ? "#c1ccce" : "#b4c9c5"}
            metalness={0}
            roughness={profile.sidePanel === "acrylic" ? 0.14 : 0.07}
            transparent
            opacity={ghost ? 0.035 : exploded ? 0.12 : 0.18}
            depthWrite={false}
            clearcoat={1}
            clearcoatRoughness={0.06}
            ior={profile.sidePanel === "acrylic" ? 1.49 : 1.52}
            envMapIntensity={1.1}
          />
        </mesh>
      )}
      {!ghost && (
        <>
          {profile.sidePanel !== "vented" && (
            <group>
              {[-1, 1].map((edge) => <Metal key={edge} position={[-0.012, edge * (height / 2 - 0.1), 0]} size={[0.012, 0.025, depth - 0.15]} color="#111b1d" roughness={0.85} />)}
              <Metal position={[-0.012, 0.025, -depth / 2 + 0.085]} size={[0.012, height - 0.18, 0.025]} color="#111b1d" roughness={0.85} />
              {[-1, 1].map(edge => <mesh key={edge} raycast={noRaycast} position={[-0.01, 0.025, edge * (depth / 2 - 0.068)]}>
                <boxGeometry args={[0.029, height - 0.2, 0.006]} />
                <meshPhysicalMaterial color="#70938c" transparent opacity={0.42} roughness={0.12} metalness={0} clearcoat={1} depthWrite={false} />
              </mesh>)}
            </group>
          )}
          <Metal
            position={[0, height / 2 - 0.055, 0]}
            size={[0.023, 0.055, depth - 0.1]}
            color={profile.frameColor}
          />
          <Metal
            position={[0, -height / 2 + 0.1, 0]}
            size={[0.023, 0.055, depth - 0.1]}
            color={profile.frameColor}
          />
          <Metal
            position={[0, 0.02, -depth / 2 + 0.065]}
            size={[0.023, height - 0.13, 0.04]}
            color={profile.frameColor}
          />
        </>
      )}
      {!ghost &&
        profile.kind === "compact" &&
        [-1, 1].flatMap((y) =>
          [-1, 1].map((z) => (
            <Screw
              key={`${y}${z}`}
              position={[
                0.025,
                y * (height / 2 - 0.16),
                z * (depth / 2 - 0.13),
              ]}
              rotation={[0, Math.PI / 2, 0]}
            />
          )),
        )}
    </group>
  );
}

function PsuShroud({ profile }: { profile: CaseVisualProfile }) {
  const w = profile.widthMm * MM;
  const h = profile.heightMm * MM;
  const d = profile.depthMm * MM;
  const thickness = 1.5 * MM;
  const top = -h / 2 + 105 * MM;
  const bottom = -h / 2 + 15 * MM;
  const rear = -d / 2 + 8 * MM;
  const front = d / 2 - 55 * MM;
  const depth = front - rear;
  const middle = (front + rear) / 2;
  const width = w - 16 * MM;
  const ventilation = useMemo<BoxInstance[]>(() => Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 8 }, (_, column) => ({
      position: [-width * 0.3 + column * width * 0.085, top + thickness / 2 + 0.002, rear + depth * 0.13 + row * 0.07] as Vec3,
      size: [width * 0.046, 0.003, 0.024] as Vec3,
    }))).flat(), [width, top, thickness, rear, depth]);
  return (
    <group>
      <Metal
        size={[width, thickness, depth]}
        position={[0, top, middle]}
        color={profile.frameColor}
      />
      <Metal
        size={[thickness, top - bottom, depth]}
        position={[width / 2, (top + bottom) / 2, middle]}
        color={profile.frameColor}
      />
      <Metal size={[width * 0.96, 0.005, 0.012]} position={[0, top + thickness / 2 + 0.003, front - 0.13]} color={isLightCase(profile) ? "#a4afb0" : "#151d20"} roughness={0.8} />
      <BoxInstances items={ventilation} color={isLightCase(profile) ? "#7a8587" : "#101719"} metalness={0.05} roughness={0.9} />
      <group position={[-width * 0.25, top + thickness / 2 + 0.02, middle + depth * 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <CableGrommet position={[0, 0, 0]} height={0.32} width={0.16} />
      </group>
    </group>
  );
}

function TowerFrame({
  profile,
  width: w,
  height: h,
  depth: d,
}: {
  profile: CaseVisualProfile;
  width: number;
  height: number;
  depth: number;
}) {
  const f = profile.frameColor;
  return (
    <group>
      <ChassisDetails profile={profile} width={w} height={h} depth={d} />
      {/* Structural rails leave the selected hardware visible through the open side. */}
      <Metal size={[w, 0.09, d]} position={[0, -h / 2 + 0.095, 0]} color={f} />
      <Metal
        size={[w, 0.065, 0.09]}
        position={[0, h / 2 - 0.035, d / 2 - 0.045]}
        color={f}
      />
      <Metal
        size={[w, 0.065, 0.09]}
        position={[0, h / 2 - 0.035, -d / 2 + 0.045]}
        color={f}
      />
      <Metal
        size={[0.07, 0.065, d]}
        position={[w / 2 - 0.035, h / 2 - 0.035, 0]}
        color={f}
      />
      <Metal
        size={[0.07, 0.065, d]}
        position={[-w / 2 + 0.035, h / 2 - 0.035, 0]}
        color={f}
      />
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <Metal
            key={`${x}${z}`}
            size={[0.055, h - 0.1, 0.055]}
            position={[x * (w / 2 - 0.03), 0.015, z * (d / 2 - 0.03)]}
            color={f}
          />
        )),
      )}
      <Metal
        size={[0.038, h - 0.15, d - 0.07]}
        position={[-w / 2 + 0.025, 0.025, 0]}
        color={profile.color}
        roughness={0.48}
      />
      <MeshPanel
        position={[0, h / 2 - 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        size={[w - 0.14, d - 0.19]}
        color={profile.color}
        pattern={profile.kind === "compact" ? "diagonal" : "round"}
      />
      <RearPanel profile={profile} width={w} height={h} depth={d} />
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <CaseFoot
            key={`foot${x}${z}`}
            size={[0.2, 0.095, 0.25]}
            position={[x * (w / 2 - 0.22), -h / 2 + 0.0475, z * (d / 2 - 0.27)]}
            color="#252c2f"
          />
        )),
      )}
      {profile.id !== "case-q300l" && <TopIO width={w} height={h} depth={d} light={isLightCase(profile)} />}
    </group>
  );
}

function isLightCase(profile: CaseVisualProfile) {
  return (
    profile.id === "case-4000d-white" ||
    profile.id === "case-north-white" ||
    profile.id === "case-h9" ||
    profile.id === "case-ap201"
  );
}

function Panoramic({
  profile,
  openSide,
  exploded,
  occupiedMount,
}: CaseModelProps) {
  const w = profile.widthMm * MM,
    h = profile.heightMm * MM,
    d = profile.depthMm * MM;
  const isH6 = profile.id === "case-h6",
    isO11 = profile.id === "case-o11";
  const rearFans = profile.rearFanCount ?? (profile.id === "case-h9" ? 1 : 0);
  const sideFans = Math.max(0, profile.fanCount - rearFans);
  const fanSize = profile.fanSizeMm * MM;
  const light = isLightCase(profile);
  return (
    <group>
      <TowerFrame profile={profile} width={w} height={h} depth={d} />
      <Metal
        size={[w * 0.22, h - 0.14, 0.07]}
        position={[-w * 0.39, 0.025, d / 2 - 0.04]}
        color={profile.frameColor}
      />
      <mesh position={[w * 0.1, 0.025, d / 2 + 0.005]} raycast={noRaycast}>
        <boxGeometry args={[w * 0.72, h - 0.15, 0.03]} />
        <meshPhysicalMaterial
          color="#b4c9c5"
          roughness={0.08}
          metalness={0}
          transparent
          opacity={0.095}
          depthWrite={false}
          clearcoat={1}
          clearcoatRoughness={0.06}
          ior={1.52}
          envMapIntensity={1.1}
        />
      </mesh>
      <Metal position={[w * 0.1, -h / 2 + 0.09, d / 2 - 0.018]} size={[w * 0.72, 0.025, 0.018]} color={light ? "#7e8b8d" : "#11191d"} roughness={0.9} />
      {/* H6 has its characteristic angled intake. H9 has straight side intakes;
        the O11 Dynamic EVO ships without fans and stays correctly empty. */}
      {occupiedMount !== "side" && sideFans > 0 && (
        <group
          position={[
            -w * (isH6 ? 0.22 : 0.23),
            0.04,
            d / 2 - (isH6 ? 0.38 : 0.56),
          ]}
          rotation={[0, isH6 ? Math.PI / 4 : Math.PI / 2, 0]}
        >
          {Array.from({ length: sideFans }, (_, i) => (
            <CaseFan
              rgb={profile.fanRgb}
              accent={profile.accent}
              label={caseBrand(profile)}
              key={i}
              position={[0, ((sideFans - 1) / 2 - i) * (fanSize + 0.045), 0]}
              size={fanSize}
              light={light}
            />
          ))}
        </group>
      )}
      {rearFans > 0 && (
        <CaseFan
              rgb={profile.fanRgb}
              accent={profile.accent}
              label={caseBrand(profile)}
          position={[0, h / 2 - 0.67, -d / 2 + 0.2]}
          rotation={[0, Math.PI, 0]}
          size={fanSize}
          light={light}
        />
      )}
      {isO11 && (
        <>
          <Metal
            size={[0.08, h - 0.12, 0.07]}
            position={[w / 2 - 0.04, 0.01, d / 2 - 0.025]}
            color={profile.frameColor}
          />
          {profile.rgb && <RGBStrip size={[0.025, h - 0.42, 0.015]} position={[w / 2 - 0.045, 0.025, d / 2 + 0.018]} phase={0.3} />}
        </>
      )}
      <FrontBadge
        text={caseBrand(profile)}
        position={[w * 0.25, -h / 2 + 0.2, d / 2 + 0.02]}
        width={isO11 ? 0.5 : 0.36}
        color={light ? "#626c70" : "#939c9b"}
      />
      <SidePanel
        profile={profile}
        width={w}
        height={h}
        depth={d}
        openSide={openSide}
        exploded={exploded}
      />
    </group>
  );
}

function Airflow({
  profile,
  openSide,
  exploded,
  occupiedMount,
}: CaseModelProps) {
  const w = profile.widthMm * MM,
    h = profile.heightMm * MM,
    d = profile.depthMm * MM;
  const light = isLightCase(profile);
  const trim = light ? "#cdd4d6" : profile.frameColor;
  const rearFans = profile.rearFanCount ?? 1;
  const frontFans = Math.max(0, profile.fanCount - rearFans);
  const fanSize = profile.fanSizeMm * MM;
  const nzxt = profile.id === "case-h7";
  const triangularFront = /^case-(4000d|5000d)/.test(profile.id);
  return (
    <group>
      <TowerFrame profile={profile} width={w} height={h} depth={d} />
      <PsuShroud profile={profile} />
      <Metal
        size={[0.11, h - 0.1, 0.12]}
        position={[-w / 2 + 0.065, 0.015, d / 2 - 0.025]}
        color={trim}
      />
      <Metal
        size={[0.11, h - 0.1, 0.12]}
        position={[w / 2 - 0.065, 0.015, d / 2 - 0.025]}
        color={trim}
      />
      <Metal
        size={[w - 0.15, 0.1, 0.12]}
        position={[0, h / 2 - 0.055, d / 2 - 0.025]}
        color={trim}
      />
      <Metal
        size={[w - 0.15, 0.13, 0.12]}
        position={[0, -h / 2 + 0.13, d / 2 - 0.025]}
        color={trim}
      />
      {occupiedMount !== "front" &&
        Array.from({ length: frontFans }, (_, i) => (
          <CaseFan
              rgb={profile.fanRgb}
              accent={profile.accent}
              label={caseBrand(profile)}
            key={i}
            position={[
              0,
              0.3 + ((frontFans - 1) / 2 - i) * (fanSize + 0.045),
              d / 2 - 0.2,
            ]}
            size={fanSize}
            light={light}
          />
        ))}
      {rearFans > 0 && (
        <CaseFan
              rgb={profile.fanRgb}
              accent={profile.accent}
              label={caseBrand(profile)}
          position={[0, h / 2 - 0.65, -d / 2 + 0.2]}
          rotation={[0, Math.PI, 0]}
          size={fanSize}
          light={light}
        />
      )}
      <IntakeFilter width={w - 0.28} height={h - 0.29} position={[0, 0.04, d / 2 + 0.014]} />
      <MeshPanel
        position={[0, 0.04, d / 2 + 0.042]}
        size={[w - 0.27, h - 0.28]}
        color={light ? "#d0d7d7" : "#40494b"}
        pattern={triangularFront ? "triangle" : nzxt ? "round" : "diagonal"}
      />
      <FrontBadge
        text={caseBrand(profile)}
        position={[0, -h / 2 + 0.22, d / 2 + 0.053]}
        width={nzxt ? 0.32 : 0.45}
        color={light ? "#596367" : "#939c9b"}
      />
      <SidePanel
        profile={profile}
        width={w}
        height={h}
        depth={d}
        openSide={openSide}
        exploded={exploded}
      />
    </group>
  );
}

function Compact({ profile, openSide, exploded }: CaseModelProps) {
  const w = profile.widthMm * MM,
    h = profile.heightMm * MM,
    d = profile.depthMm * MM;
  const q300 = profile.id === "case-q300l",
    light = isLightCase(profile);
  return (
    <group>
      <TowerFrame profile={profile} width={w} height={h} depth={d} />
      <MeshPanel
        position={[0, 0.025, d / 2 + 0.008]}
        size={[w - 0.1, h - 0.14]}
        color={light ? "#cfd8d7" : "#434c50"}
        pattern={q300 ? "diagonal" : "round"}
      />
      <Metal
        size={[0.07, h - 0.08, 0.05]}
        position={[-w / 2 + 0.04, 0, d / 2 + 0.018]}
        color={profile.frameColor}
      />
      <Metal
        size={[0.07, h - 0.08, 0.05]}
        position={[w / 2 - 0.04, 0, d / 2 + 0.018]}
        color={profile.frameColor}
      />
      {q300 && (
        <>
          <Metal
            size={[0.08, 0.55, 0.17]}
            position={[w / 2 + 0.015, 0, d / 2 - 0.14]}
            color="#293136"
          />
          <Metal
            size={[0.085, 0.035, 0.09]}
            position={[w / 2 + 0.02, 0.11, d / 2 - 0.14]}
            color="#090d0f"
          />
          <Metal
            size={[0.085, 0.035, 0.09]}
            position={[w / 2 + 0.02, -0.02, d / 2 - 0.14]}
            color="#090d0f"
          />
        </>
      )}
      {profile.fanCount > 0 && (
        <CaseFan
              rgb={profile.fanRgb}
              accent={profile.accent}
              label={caseBrand(profile)}
          position={[0, h / 2 - 0.6, -d / 2 + 0.21]}
          rotation={[0, Math.PI, 0]}
          size={profile.fanSizeMm * MM}
          light={light}
        />
      )}
      <FrontBadge
        text={q300 ? "COOLER MASTER" : "ASUS PRIME"}
        position={[0, -h / 2 + 0.25, d / 2 + 0.02]}
        width={q300 ? 0.75 : 0.55}
        color={light ? "#667575" : "#939c9b"}
      />
      <SidePanel
        profile={profile}
        width={w}
        height={h}
        depth={d}
        openSide={openSide}
        exploded={exploded}
      />
    </group>
  );
}

function WoodPanel({ position, size }: { position: Vec3; size: Vec3 }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 512;
    const c = canvas.getContext("2d")!;
    c.fillStyle = "#805535";
    c.fillRect(0, 0, 128, 512);
    for (let x = 0; x < 128; x += 2) {
      c.strokeStyle = `rgba(${x % 7 === 0 ? "37,21,10" : "166,119,76"},${0.12 + (x % 5) * 0.06})`;
      c.lineWidth = x % 3 === 0 ? 2 : 1;
      c.beginPath();
      c.moveTo(x, 0);
      for (let y = 0; y <= 512; y += 12)
        c.lineTo(x + Math.sin(y * 0.022 + x * 0.12) * 3, y);
      c.stroke();
    }
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <RoundedBox position={position} args={size} radius={0.008} smoothness={2} castShadow>
      <meshStandardMaterial map={texture} bumpMap={texture} bumpScale={0.003} roughness={0.69} metalness={0} />
    </RoundedBox>
  );
}

function WoodSlats({
  width,
  height,
  position,
  walnut,
}: {
  width: number;
  height: number;
  position: Vec3;
  walnut: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = 17;
  const slatWidth = (width / count) * 0.61;
  const geometry = useMemo(() => new RoundedBoxGeometry(slatWidth, height, 0.05, 2, 0.007), [slatWidth, height]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 512;
    const c = canvas.getContext("2d")!;
    c.fillStyle = walnut ? "#6e452c" : "#bc925b";
    c.fillRect(0, 0, 64, 512);
    for (let x = 1; x < 64; x += 2) {
      c.strokeStyle = walnut ? "rgba(31,18,8,0.28)" : "rgba(81,48,17,0.24)";
      c.beginPath();
      c.moveTo(x, 0);
      for (let y = 0; y <= 512; y += 8)
        c.lineTo(x + Math.sin(y * 0.018 + x) * 1.8, y);
      c.stroke();
    }
    c.lineWidth = 0.7;
    for (let knot = 0; knot < 3; knot++) {
      const centerX = 8 + knot * 22;
      const centerY = 90 + knot * 155;
      for (let ring = 0; ring < 4; ring++) {
        c.strokeStyle = walnut ? "rgba(54,26,9,0.12)" : "rgba(112,76,32,0.14)";
        c.beginPath();
        c.ellipse(centerX, centerY, 1.7 + ring * 1.2, 8 + ring * 11, 0, 0, Math.PI * 2);
        c.stroke();
      }
    }
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [walnut]);
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => {
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      matrix.makeTranslation(((i - (count - 1) / 2) * width) / count, 0, 0);
      mesh.current?.setMatrixAt(i, matrix);
      const variation = 0.91 + ((i * 7) % 9) * 0.02;
      mesh.current?.setColorAt(i, new THREE.Color(variation, variation, variation));
    }
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
      if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
      mesh.current.computeBoundingSphere();
    }
  }, [width]);
  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      geometry={geometry}
      position={position}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial map={texture} bumpMap={texture} bumpScale={0.004} roughness={0.72} metalness={0} />
    </instancedMesh>
  );
}

function WoodFront({
  profile,
  openSide,
  exploded,
  occupiedMount,
}: CaseModelProps) {
  const w = profile.widthMm * MM,
    h = profile.heightMm * MM,
    d = profile.depthMm * MM,
    light = isLightCase(profile);
  const fanSize = profile.fanSizeMm * MM;
  const rearFans = profile.rearFanCount ?? 0;
  const frontFans = Math.max(0, profile.fanCount - rearFans);
  return (
    <group>
      <TowerFrame profile={profile} width={w} height={h} depth={d} />
      <PsuShroud profile={profile} />
      <Metal
        size={[w, 0.09, 0.1]}
        position={[0, h / 2 - 0.045, d / 2 - 0.01]}
        color={profile.frameColor}
      />
      <Metal
        size={[w, 0.13, 0.1]}
        position={[0, -h / 2 + 0.11, d / 2 - 0.01]}
        color={profile.frameColor}
      />
      <IntakeFilter width={w - 0.17} height={h - 0.27} position={[0, 0.035, d / 2 - 0.012]} />
      <MeshPanel
        position={[0, 0.035, d / 2 + 0.002]}
        size={[w - 0.15, h - 0.25]}
        color={light ? "#60655e" : "#242a25"}
        pattern="round"
      />
      <WoodSlats
        position={[0, 0.035, d / 2 + 0.035]}
        width={w - 0.17}
        height={h - 0.27}
        walnut={!light}
      />
      {occupiedMount !== "front" &&
        Array.from({ length: frontFans }, (_, i) => (
          <CaseFan
              rgb={profile.fanRgb}
              accent={profile.accent}
              label={caseBrand(profile)}
            key={i}
            position={[
              0,
              0.2 + ((frontFans - 1) / 2 - i) * (fanSize + 0.045),
              d / 2 - 0.18,
            ]}
            size={fanSize}
            light={false}
          />
        ))}
      {rearFans > 0 && (
        <CaseFan
              rgb={profile.fanRgb}
              accent={profile.accent}
              label={caseBrand(profile)}
          position={[0, h / 2 - 0.65, -d / 2 + 0.2]}
          rotation={[0, Math.PI, 0]}
          size={120 * MM}
        />
      )}
      <SidePanel
        profile={profile}
        width={w}
        height={h}
        depth={d}
        openSide={openSide}
        exploded={exploded}
      />
      <FrontBadge
        text="FRACTAL"
        position={[0, -h / 2 + 0.11, d / 2 + 0.052]}
        width={0.42}
        color={light ? "#65706a" : "#a6afa2"}
      />
    </group>
  );
}

function Terra({ profile, openSide, exploded }: CaseModelProps) {
  const w = profile.widthMm * MM,
    h = profile.heightMm * MM,
    d = profile.depthMm * MM;
  return (
    <group>
      <Metal
        size={[w, 0.07, d]}
        position={[0, -h / 2 + 0.08, 0]}
        color={profile.frameColor}
      />
      <Metal
        size={[w, h - 0.07, 0.075]}
        position={[0, 0.035, d / 2 - 0.04]}
        color={profile.frontColor}
        roughness={0.43}
      />
      <Metal
        size={[w, h - 0.11, 0.04]}
        position={[0, 0.015, -d / 2 + 0.025]}
        color={profile.frameColor}
      />
      <MeshPanel
        size={[d - 0.14, h - 0.18]}
        position={[-w / 2, 0.03, 0]}
        rotation={[0, Math.PI / 2, 0]}
        color={profile.color}
        pattern="slats"
      />
      <MeshPanel
        size={[w - 0.12, d - 0.15]}
        position={[0, h / 2 - 0.012, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        color={profile.color}
        pattern="slats"
      />
      <Metal
        size={[0.055, 0.055, d]}
        position={[-w / 2 + 0.03, h / 2 - 0.025, 0]}
        color={profile.frameColor}
      />
      <Metal
        size={[0.055, 0.055, d]}
        position={[w / 2 - 0.03, h / 2 - 0.025, 0]}
        color={profile.frameColor}
      />
      {[-1, 1].map((side) => <group key={side}>
        <Metal size={[0.015, h - 0.2, 0.013]} position={[side * (w / 2 - 0.045), 0.04, d / 2 + 0.004]} color="#556450" roughness={0.7} />
        <Metal size={[0.021, 0.02, d - 0.2]} position={[side * (w / 2 - 0.065), h / 2 - 0.056, 0]} color="#a0ad98" roughness={0.52} />
        {[-1, 1].map((end) => <Screw key={end} position={[side * (w / 2 - 0.08), h / 2 + 0.004, end * (d / 2 - 0.11)]} rotation={[-Math.PI / 2, 0, 0]} />)}
      </group>)}
      <Metal size={[w - 0.03, 0.013, 0.013]} position={[0, -h / 2 + 0.355, d / 2 + 0.008]} color="#394936" roughness={0.8} />
      <WoodPanel
        position={[0, -h / 2 + 0.2, d / 2 + 0.007]}
        size={[w - 0.03, 0.3, 0.055]}
      />
      <FrontBadge
        text="FRACTAL"
        position={[0, h / 2 - 0.17, d / 2 + 0.005]}
        width={0.5}
        color="#a6beb2"
      />
      <mesh position={[0.12, -h / 2 + 0.2, d / 2 + 0.042]}>
        <circleGeometry args={[0.037, 24]} />
        <meshStandardMaterial
          color="#242e2c"
          roughness={0.32}
          metalness={0.8}
        />
      </mesh>
      <Metal
        size={[0.09, 0.031, 0.016]}
        position={[-0.1, -h / 2 + 0.2, d / 2 + 0.044]}
        color="#141d19"
      />
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <CaseFoot
            key={`tf${x}${z}`}
            size={[0.14, 0.07, 0.24]}
            position={[x * (w / 2 - 0.16), -h / 2 + 0.035, z * (d / 2 - 0.22)]}
            color="#202722"
          />
        )),
      )}
      <SidePanel
        profile={profile}
        width={w}
        height={h}
        depth={d}
        openSide={openSide}
        exploded={exploded}
      />
    </group>
  );
}

export default function CaseModel(props: CaseModelProps) {
  let model;
  switch (props.profile.kind) {
    case "panoramic":
      model = <Panoramic {...props} />; break;
    case "airflow":
      model = <Airflow {...props} />; break;
    case "compact":
      model = <Compact {...props} />; break;
    case "sandwich":
      model = <Terra {...props} />; break;
    case "wood-front":
      model = <WoodFront {...props} />; break;
  }
  return model;
}
