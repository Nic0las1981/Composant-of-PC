import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

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
}: {
  position?: Vector3;
  size: Vector3;
  color?: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
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
}: {
  items: BoxInstance[];
  color?: string;
  metalness?: number;
  roughness?: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
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
      args={[undefined, undefined, items.length]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
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

function CurvedFanBlades({ radius }: { radius: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0.17, -0.07);
    shape.bezierCurveTo(0.35, -0.09, 0.48, -0.22, 0.66, -0.26);
    shape.bezierCurveTo(0.82, -0.31, 0.9, -0.15, 0.88, 0.045);
    shape.bezierCurveTo(0.82, 0.17, 0.67, 0.23, 0.51, 0.15);
    shape.bezierCurveTo(0.35, 0.09, 0.26, 0.07, 0.17, 0.07);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.025,
      bevelEnabled: false,
      curveSegments: 6,
      steps: 1,
    });
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
        color="#41474d"
        metalness={0.12}
        roughness={0.43}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
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
}: {
  radius?: number;
  position?: Vector3;
  rotation?: Vector3;
  frame?: boolean;
  rgb?: boolean;
  accent?: string;
  hubLabel?: string;
  color?: string;
}) {
  const screws = useMemo<BoxInstance[]>(
    () =>
      [-1, 1].flatMap((x) =>
        [-1, 1].map((y) => ({
          position: [x * radius * 0.86, y * radius * 0.86, 0.025] as Vector3,
          size: [0.025, 0.025, 0.017] as Vector3,
        })),
      ),
    [radius],
  );
  return (
    <group position={position} rotation={rotation}>
      {frame && (
        <MetalBox
          size={[radius * 2.13, radius * 2.13, 0.085]}
          color={color}
          metalness={0.12}
          roughness={0.58}
        />
      )}
      <mesh position={[0, 0, 0.045]}>
        <circleGeometry args={[radius, 48]} />
        <meshStandardMaterial color="#0b0e13" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.047]}>
        <ringGeometry args={[radius * 0.86, radius, 48]} />
        <meshStandardMaterial
          color={rgb ? accent : "#343b42"}
          roughness={0.3}
          metalness={0.55}
          emissive={rgb ? accent : "#000000"}
          emissiveIntensity={rgb ? 1.5 : 0}
        />
      </mesh>
      <group position={[0, 0, 0.066]}>
        <CurvedFanBlades radius={radius} />
      </group>
      <mesh position={[0, 0, 0.084]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.24, radius * 0.24, 0.04, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.106]}>
        <circleGeometry args={[radius * 0.13, 16]} />
        <meshStandardMaterial
          color="#777f85"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
      {frame && <BoxInstances items={screws} color="#777d83" metalness={0.8} />}
      {hubLabel && (
        <HardwareLabel
          text={hubLabel}
          width={radius * 0.3}
          height={radius * 0.16}
          position={[0, 0, 0.108]}
          rotation={[0, 0, 0]}
          color="#e0e2e4"
        />
      )}
    </group>
  );
}

export function Tube({
  points,
  radius = 0.018,
  color = "#aaaeb1",
}: {
  points: Vector3[];
  radius?: number;
  color?: string;
}) {
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
      <meshStandardMaterial color={color} metalness={0.88} roughness={0.25} />
    </mesh>
  );
}
