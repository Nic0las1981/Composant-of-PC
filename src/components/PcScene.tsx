import {
  Component as ReactComponent,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls, RoundedBox, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

export interface PcSceneProps {
  exploded?: boolean;
  activeCategory?: string | null;
  selectedCategories?: string[];
  accent?: string;
  onSelectCategory?: (id: string) => void;
  resetKey?: number;
  className?: string;
}

const ALL_CATEGORIES = [
  "cpu",
  "motherboard",
  "gpu",
  "ram",
  "storage",
  "cooler",
  "psu",
  "case",
];
const DARK = "#121721";
const EDGE = "#2a3040";

function PrintedLabel({
  text,
  position,
  width = 0.55,
  color = "#b5bdc9",
}: {
  text: string;
  position: [number, number, number];
  width?: number;
  color?: string;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 96;
    const context = canvas.getContext("2d")!;
    context.font = "600 52px Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = color;
    context.fillText(text, 256, 48);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, [text, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={position} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[width, (width * 96) / 512]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

function Box({
  position = [0, 0, 0],
  size,
  color = DARK,
  metalness = 0.6,
  roughness = 0.32,
  glow,
  opacity = 1,
}: {
  position?: [number, number, number];
  size: [number, number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
  glow?: string;
  opacity?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        emissive={glow || "#000000"}
        emissiveIntensity={glow ? 1.6 : 0}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}

function Fan({
  position,
  rotation = [0, 0, 0],
  radius = 0.47,
  color = "#7c6cff",
  spinning = true,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  color?: string;
  spinning?: boolean;
}) {
  const blades = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (blades.current && spinning) blades.current.rotation.z += delta * 0.5;
  });
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox
        args={[radius * 2.1, radius * 2.1, 0.095]}
        radius={0.07}
        smoothness={3}
        castShadow
      >
        <meshStandardMaterial color="#141923" roughness={0.4} metalness={0.6} />
      </RoundedBox>
      <mesh position={[0, 0, 0.055]}>
        <ringGeometry args={[radius * 0.64, radius * 0.94, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, 0.065]}>
        <torusGeometry args={[radius * 0.89, 0.026, 8, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.068]}>
        <torusGeometry args={[radius * 0.68, 0.008, 6, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
        />
      </mesh>
      <group ref={blades} position={[0, 0, 0.071]}>
        {Array.from({ length: 9 }, (_, i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 9]}>
            <mesh
              position={[radius * 0.39, 0, 0]}
              rotation={[0.12, 0.1, -0.5]}
              scale={[radius * 0.39, radius * 0.14, 0.013]}
            >
              <sphereGeometry args={[1, 12, 8]} />
              <meshStandardMaterial
                color="#536078"
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
          </group>
        ))}
      </group>
      <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.22, radius * 0.22, 0.045, 32]} />
        <meshStandardMaterial
          color="#262d3b"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, 0, 0.12]}>
        <circleGeometry args={[radius * 0.08, 6]} />
        <meshStandardMaterial color="#a7b3cc" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function MovingPart({
  children,
  id,
  position = [0, 0, 0],
  explodedPosition,
  exploded,
  active,
  onSelect,
}: {
  children: ReactNode;
  id: string;
  position?: [number, number, number];
  explodedPosition?: [number, number, number];
  exploded?: boolean;
  active?: boolean;
  onSelect?: (id: string) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const target = useMemo(
    () =>
      new THREE.Vector3(
        ...(exploded && explodedPosition ? explodedPosition : position),
      ),
    [exploded, ...position, ...(explodedPosition || position)],
  );
  useFrame((_, delta) => {
    ref.current?.position.lerp(target, 1 - Math.exp(-delta * 7));
  });
  const click = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect?.(id);
  };
  return (
    <group
      ref={ref}
      position={position}
      onClick={click}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      {children}
      {active && (
        <pointLight
          position={[0.4, 0, 0.4]}
          intensity={0.6}
          distance={2}
          color="#9aa7ff"
        />
      )}
    </group>
  );
}

function PcModel({
  exploded,
  activeCategory,
  selectedCategories = ALL_CATEGORIES,
  accent = "#b3f472",
  onSelectCategory,
}: PcSceneProps) {
  const has = (id: string) => selectedCategories.includes(id);
  const part = (id: string) => ({
    id,
    active: activeCategory === id,
    onSelect: onSelectCategory,
    exploded,
  });
  const bright = (id: string) => (activeCategory === id ? "#8887bf" : EDGE);
  const pipe = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.19, 0.48, -0.23),
        new THREE.Vector3(0.14, 0.78, -0.25),
        new THREE.Vector3(0.28, 1.1, -0.35),
        new THREE.Vector3(0.13, 1.32, -0.5),
      ]),
    [],
  );
  const pipe2 = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.19, 0.38, -0.23),
        new THREE.Vector3(0.25, 0.68, -0.15),
        new THREE.Vector3(0.38, 1.05, -0.25),
        new THREE.Vector3(0.3, 1.32, -0.5),
      ]),
    [],
  );
  return (
    <group position={[0, 0.02, 0]}>
      {has("case") && (
        <MovingPart {...part("case")}>
          {/* The solid back panel and structural rails leave the glazed side readable. */}
          <Box
            position={[-0.81, 0, 0]}
            size={[0.065, 3.35, 2.45]}
            color="#10141c"
          />
          <Box
            position={[0, -1.62, 0]}
            size={[1.7, 0.15, 2.52]}
            color="#191d27"
          />
          <Box
            position={[0, 1.62, 0]}
            size={[1.7, 0.13, 2.52]}
            color="#1e2330"
          />
          <Box
            position={[0, 0, -1.22]}
            size={[1.7, 3.25, 0.06]}
            color="#121721"
          />
          {[-0.82, 0.82].map((x) =>
            [-1.2, 1.2].map((z) => (
              <Box
                key={`${x}-${z}`}
                position={[x, 0, z]}
                size={[0.07, 3.3, 0.08]}
                color="#32384a"
              />
            )),
          )}
          <Box
            position={[0.82, 1.53, 0]}
            size={[0.065, 0.1, 2.5]}
            color="#353b4d"
          />
          <Box
            position={[0.82, -1.5, 0]}
            size={[0.065, 0.12, 2.5]}
            color="#252b38"
          />
          {[-0.64, 0.64].map((x) =>
            [-0.92, 0.92].map((z) => (
              <Box
                key={`foot-${x}-${z}`}
                position={[x, -1.78, z]}
                size={[0.23, 0.19, 0.3]}
                color="#181d27"
              />
            )),
          )}
          {/* Front fascia, separate rim and translucent mesh. */}
          <Box
            position={[0, 0, 1.22]}
            size={[1.64, 3.2, 0.075]}
            color="#0d1119"
          />
          <Box
            position={[-0.76, 0, 1.3]}
            size={[0.055, 3.3, 0.08]}
            color="#434959"
          />
          <Box
            position={[0.76, 0, 1.3]}
            size={[0.055, 3.3, 0.08]}
            color="#333948"
          />
          <Box
            position={[0, 1.56, 1.31]}
            size={[1.5, 0.09, 0.08]}
            color="#353b4a"
          />
          <Box
            position={[0, -1.56, 1.31]}
            size={[1.5, 0.09, 0.08]}
            color="#252a38"
          />
          <Fan position={[0, 0.99, 1.28]} radius={0.445} color="#d1e7e6" />
          <Fan position={[0, 0, 1.28]} radius={0.445} color={accent} />
          <Fan position={[0, -0.99, 1.28]} radius={0.445} color={accent} />
          {[-0.69, 0.69].map((x) => (
            <Box
              key={x}
              position={[x, 0, 1.36]}
              size={[0.012, 3.08, 0.006]}
              color="#9197b0"
            />
          ))}
          {/* Small ports on the brushed top panel. */}
          {[0.35, 0.53].map((x) => (
            <Box
              key={x}
              position={[x, 1.693, 0.85]}
              size={[0.09, 0.005, 0.035]}
              color="#030508"
            />
          ))}
          <mesh position={[0.08, 1.695, 0.85]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.035, 0.045, 24]} />
            <meshStandardMaterial
              color="#b0bcff"
              emissive="#b0bcff"
              emissiveIntensity={0.8}
            />
          </mesh>
          {Array.from({ length: 13 }, (_, i) => (
            <Box
              key={`vent-${i}`}
              position={[-0.1, 1.695, -0.9 + i * 0.12]}
              size={[1.08, 0.005, 0.026]}
              color="#070b12"
            />
          ))}
          {/* This almost-clear sheet contributes a real reflected glass edge. */}
          {!exploded && (
            <mesh position={[0.835, 0.02, 0]}>
              <boxGeometry args={[0.012, 2.97, 2.3]} />
              <meshPhysicalMaterial
                color="#a6b5dc"
                transparent
                opacity={0.045}
                metalness={0.1}
                roughness={0.05}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </MovingPart>
      )}

      {has("motherboard") && (
        <MovingPart
          {...part("motherboard")}
          explodedPosition={[-0.45, 0, -0.12]}
        >
          <Box
            position={[-0.68, 0.2, -0.1]}
            size={[0.08, 2.35, 1.88]}
            color="#1a202c"
          />
          <Box
            position={[-0.6, 0.72, -0.8]}
            size={[0.13, 1.1, 0.31]}
            color={bright("motherboard")}
          />
          <Box
            position={[-0.59, 1.17, -0.19]}
            size={[0.14, 0.24, 0.9]}
            color="#3c4251"
          />
          {Array.from({ length: 9 }, (_, i) => (
            <Box
              key={`sink-${i}`}
              position={[-0.5, 0.31 + i * 0.09, -0.82]}
              size={[0.035, 0.018, 0.27]}
              color="#626978"
            />
          ))}
          <Box
            position={[-0.61, -0.51, -0.17]}
            size={[0.13, 0.25, 0.78]}
            color="#333a49"
          />
          {[-0.57, -0.38, -0.16].map((y) => (
            <Box
              key={y}
              position={[-0.6, y, 0.12]}
              size={[0.07, 0.035, 1.1]}
              color="#555a65"
            />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <Box
              key={`chip-${i}`}
              position={[-0.6, -0.58 + i * 0.27, 0.67]}
              size={[0.065, 0.11, 0.08]}
              color="#53596a"
            />
          ))}
          <Fan position={[-0.08, 0.84, -1.15]} radius={0.41} color="#bfdbd6" />
        </MovingPart>
      )}

      {has("cpu") && (
        <MovingPart {...part("cpu")} explodedPosition={[0.5, 0.55, 0]}>
          <Box
            position={[-0.53, 0.5, -0.16]}
            size={[0.07, 0.52, 0.52]}
            color="#b6bdc9"
            metalness={0.95}
            roughness={0.2}
          />
          <Box
            position={[-0.485, 0.5, -0.16]}
            size={[0.014, 0.32, 0.32]}
            color="#9399ac"
          />
        </MovingPart>
      )}

      {has("cooler") && (
        <MovingPart {...part("cooler")} explodedPosition={[0.65, 0.85, -0.2]}>
          <RoundedBox
            args={[0.27, 0.62, 0.62]}
            radius={0.065}
            position={[-0.35, 0.5, -0.16]}
            smoothness={3}
            castShadow
          >
            <meshStandardMaterial
              color="#272b3b"
              metalness={0.65}
              roughness={0.25}
            />
          </RoundedBox>
          <mesh position={[-0.205, 0.5, -0.16]} rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[0.19, 0.215, 48]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={2.4}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[-0.198, 0.5, -0.16]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.085, 6]} />
            <meshStandardMaterial
              color="#e7e9ff"
              emissive="#a4afff"
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh>
            <tubeGeometry args={[pipe, 24, 0.039, 8, false]} />
            <meshStandardMaterial color="#1f2531" roughness={0.8} />
          </mesh>
          <mesh>
            <tubeGeometry args={[pipe2, 24, 0.039, 8, false]} />
            <meshStandardMaterial color="#222936" roughness={0.8} />
          </mesh>
          <Box
            position={[-0.04, 1.34, -0.1]}
            size={[1.22, 0.14, 1.9]}
            color="#1d2430"
          />
          <Fan
            position={[-0.04, 1.22, -0.63]}
            rotation={[Math.PI / 2, 0, 0]}
            radius={0.4}
            color="#c4dddb"
          />
          <Fan
            position={[-0.04, 1.22, 0.34]}
            rotation={[Math.PI / 2, 0, 0]}
            radius={0.4}
            color={accent}
          />
        </MovingPart>
      )}

      {has("ram") && (
        <MovingPart {...part("ram")} explodedPosition={[0.75, 0.1, 0.4]}>
          {[0.45, 0.63].map((z, index) => (
            <group key={z}>
              <Box
                position={[-0.47, 0.6, z]}
                size={[0.21, 0.91, 0.07]}
                color="#333949"
              />
              <Box
                position={[-0.35, 0.6, z]}
                size={[0.025, 0.85, 0.055]}
                color={index ? "#d5e4df" : accent}
                glow={index ? "#d5e4df" : accent}
              />
              <Box
                position={[-0.45, 0.53, z + 0.04]}
                size={[0.13, 0.42, 0.006]}
                color="#747d91"
              />
            </group>
          ))}
        </MovingPart>
      )}

      {has("gpu") && (
        <MovingPart {...part("gpu")} explodedPosition={[1.1, -0.1, 0.1]}>
          <RoundedBox
            args={[1.16, 0.42, 1.72]}
            radius={0.045}
            position={[-0.03, -0.33, -0.18]}
            smoothness={3}
            castShadow
          >
            <meshStandardMaterial
              color={bright("gpu")}
              metalness={0.75}
              roughness={0.27}
            />
          </RoundedBox>
          <Box
            position={[-0.03, -0.09, -0.18]}
            size={[1.15, 0.035, 1.72]}
            color="#4d5567"
          />
          <Box
            position={[0.563, -0.15, -0.2]}
            size={[0.015, 0.025, 1.48]}
            color={accent}
            glow={accent}
          />
          <Box
            position={[0.566, -0.35, -0.2]}
            size={[0.012, 0.13, 0.6]}
            color="#121923"
          />
          <PrintedLabel
            text="GRAPHICS"
            position={[0.578, -0.35, -0.2]}
            width={0.54}
          />
          {Array.from({ length: 13 }, (_, i) => (
            <Box
              key={`gpu-fin-${i}`}
              position={[0.57, -0.42, -0.86 + i * 0.11]}
              size={[0.015, 0.12, 0.025]}
              color="#7a8290"
            />
          ))}
          <Fan
            position={[-0.02, -0.57, -0.61]}
            rotation={[Math.PI / 2, 0, 0]}
            radius={0.34}
            color="#65709a"
            spinning={false}
          />
          <Fan
            position={[-0.02, -0.57, 0.22]}
            rotation={[Math.PI / 2, 0, 0]}
            radius={0.34}
            color="#65709a"
            spinning={false}
          />
          <Box
            position={[-0.55, -0.35, -1.1]}
            size={[0.18, 0.47, 0.05]}
            color="#8c94a3"
          />
          <Box
            position={[0.51, -0.68, 0.59]}
            size={[0.05, 0.34, 0.05]}
            color="#4c5363"
          />
        </MovingPart>
      )}

      {has("storage") && (
        <MovingPart {...part("storage")} explodedPosition={[0.8, -0.1, -0.55]}>
          <Box
            position={[-0.535, -0.72, -0.26]}
            size={[0.065, 0.12, 0.7]}
            color="#515a6e"
          />
          <Box
            position={[-0.495, -0.72, -0.26]}
            size={[0.01, 0.07, 0.39]}
            color="#9a9fae"
          />
        </MovingPart>
      )}

      {has("psu") && (
        <MovingPart {...part("psu")} explodedPosition={[0.65, -0.25, -0.45]}>
          <Box
            position={[0, -1.22, -0.35]}
            size={[1.52, 0.58, 1.65]}
            color="#1a1f2b"
          />
          <Box
            position={[0.77, -1.21, -0.36]}
            size={[0.016, 0.21, 0.68]}
            color="#2a3141"
          />
          <PrintedLabel
            text="F O R G E"
            position={[0.782, -1.2, -0.36]}
            width={0.53}
          />
          {Array.from({ length: 8 }, (_, i) => (
            <Box
              key={`psu-vent-${i}`}
              position={[0.773, -1.35, 0.1 + i * 0.035]}
              size={[0.01, 0.085, 0.01]}
              color="#080d15"
            />
          ))}
          <Box
            position={[0.4, -0.85, 0.38]}
            size={[0.08, 0.18, 0.13]}
            color="#1c222d"
          />
        </MovingPart>
      )}
      <pointLight
        position={[0.3, 0.5, 0.75]}
        color="#c1e5dc"
        intensity={0.9}
        distance={3.6}
        decay={2}
      />
      <pointLight
        position={[0.3, -0.9, 0.3]}
        color={accent}
        intensity={0.5}
        distance={2.5}
        decay={2}
      />
    </group>
  );
}

function CameraRig({
  resetKey,
  exploded,
}: {
  resetKey?: number;
  exploded?: boolean;
}) {
  const { camera } = useThree();
  const controls = useRef<any>(null);
  useEffect(() => {
    camera.position.set(4.8, 2.65, 5.2);
    controls.current?.target.set(0, -0.04, 0);
    controls.current?.update();
  }, [resetKey, camera]);
  useFrame((_, delta) => {
    if ("zoom" in camera) {
      const target = exploded ? 0.82 : 1;
      camera.zoom = THREE.MathUtils.lerp(
        camera.zoom,
        target,
        1 - Math.exp(-delta * 5),
      );
      camera.updateProjectionMatrix();
    }
  });
  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 1.95}
      minAzimuthAngle={-Math.PI / 2.5}
      maxAzimuthAngle={Math.PI / 1.5}
      target={[0, -0.04, 0]}
      makeDefault
    />
  );
}

function FallbackPc() {
  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        placeItems: "center",
        minHeight: 280,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 155,
          height: 240,
          background: "linear-gradient(130deg,#282c3c,#11141e)",
          border: "1px solid #4d5067",
          borderRadius: 8,
          transform: "perspective(600px) rotateY(-25deg) rotateX(5deg)",
          boxShadow: "24px 28px 60px #080a1180",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              right: 16,
              top: 22 + i * 67,
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: "3px solid #9a8bff",
              boxShadow: "0 0 15px #9581ff66, inset 0 0 15px #9581ff55",
              background:
                "radial-gradient(circle,#39394d 20%,#191d2a 21%,#45415f 58%,#191d2a 60%)",
            }}
          />
        ))}
        <span
          style={{
            position: "absolute",
            left: 12,
            top: 22,
            width: 51,
            height: 170,
            border: "1px solid #46485a",
            background: "linear-gradient(25deg,#25273688,#3e395e55)",
          }}
        />
      </div>
      <span style={{ color: "#8d90a6", fontSize: 11, marginTop: -24 }}>
        Aperçu simplifié · WebGL indisponible
      </span>
    </div>
  );
}

class SceneBoundary extends ReactComponent<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <FallbackPc /> : this.props.children;
  }
}

export default function PcScene(props: PcSceneProps) {
  const [supported] = useState(() => {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2");
      if (!context) return false;
      context.getExtension("WEBGL_lose_context")?.loseContext();
      return true;
    } catch {
      return false;
    }
  });
  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );
  return (
    <div
      className={props.className}
      style={{ width: "100%", height: "100%", position: "relative" }}
      role="img"
      aria-label="Votre configuration PC en 3D. Faites glisser pour tourner et cliquez sur un composant pour le sélectionner."
    >
      {supported ? (
        <SceneBoundary>
          <Canvas
            shadows
            dpr={[1, 1.75]}
            camera={{ position: [4.8, 2.65, 5.2], fov: 32 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
          >
            <ambientLight intensity={1.15} />
            <hemisphereLight args={["#d5e3e2", "#252b2b", 1.65]} />
            <directionalLight
              position={[4, 7, 4]}
              intensity={3.8}
              color="#e8efec"
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.0005}
            />
            <directionalLight
              position={[-4, 3, 0]}
              intensity={3}
              color="#81939a"
            />
            <directionalLight
              position={[1, 0, -4]}
              intensity={2.1}
              color="#a6c7d2"
            />
            <Suspense fallback={null}>
              <PcModel {...props} />
              <ContactShadows
                key={`${props.exploded}-${props.selectedCategories?.join(",")}`}
                position={[0, -1.91, 0]}
                opacity={0.55}
                scale={12}
                blur={2.3}
                far={5}
                color="#05060c"
                resolution={256}
                frames={props.exploded ? Infinity : 30}
              />
            </Suspense>
            <CameraRig resetKey={props.resetKey} exploded={props.exploded} />
          </Canvas>
        </SceneBoundary>
      ) : (
        <FallbackPc />
      )}
    </div>
  );
}
