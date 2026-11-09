import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { MM, type CaseVisualProfile } from "../../data/visualProfiles";

type Vec3 = [number, number, number];
const noRaycast = () => {};

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
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={roughness}
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
        <cylinderGeometry args={[0.023, 0.023, 0.014, 8]} />
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
    </group>
  );
}

function usePerforation(kind: "round" | "diagonal" | "slats") {
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
          if (kind === "diagonal") {
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
  pattern?: "round" | "diagonal" | "slats";
  ghost?: boolean;
  nonInteractive?: boolean;
}) {
  const alpha = usePerforation(pattern);
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
        metalness={0.3}
        roughness={0.62}
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

function CaseFan({
  position,
  rotation = [0, 0, 0],
  size = 120 * MM,
  light = false,
}: {
  position: Vec3;
  rotation?: Vec3;
  size?: number;
  light?: boolean;
}) {
  const r = size * 0.43;
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox
        args={[size, size, size * 0.16]}
        radius={0.035}
        smoothness={2}
      >
        <meshStandardMaterial
          color={light ? "#d8dcda" : "#171c1e"}
          metalness={0.25}
          roughness={0.64}
        />
      </RoundedBox>
      <mesh position={[0, 0, size * 0.09]}>
        <ringGeometry args={[r * 0.85, r * 1.06, 40]} />
        <meshStandardMaterial color="#41494c" metalness={0.4} roughness={0.5} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 7]}>
          <mesh
            position={[r * 0.42, 0, size * 0.1]}
            rotation={[0, 0, -0.42]}
            scale={[r * 0.55, r * 0.18, 0.025]}
          >
            <sphereGeometry args={[1, 10, 6]} />
            <meshStandardMaterial
              color={light ? "#b9c1c2" : "#697276"}
              metalness={0.15}
              roughness={0.62}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0, size * 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r * 0.24, r * 0.24, 0.035, 24]} />
        <meshStandardMaterial color="#252b2e" roughness={0.6} />
      </mesh>
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((y) => (
          <Screw
            key={`${x}${y}`}
            position={[x * size * 0.425, y * size * 0.425, size * 0.105]}
          />
        )),
      )}
    </group>
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
}: {
  width: number;
  height: number;
  depth: number;
  compact?: boolean;
}) {
  const y = height / 2 + 0.004,
    z = depth / 2 - 0.17,
    x = width / 2 - 0.2;
  return (
    <group>
      <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.044, 0.054, 24]} />
        <meshStandardMaterial
          color="#a3acae"
          metalness={0.9}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[x, y + 0.002, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.038, 24]} />
        <meshStandardMaterial color="#1b2123" roughness={0.4} />
      </mesh>
      <Metal
        position={[x - 0.19, y, z]}
        size={[0.09, 0.012, 0.032]}
        color="#0b0e10"
      />
      {!compact && (
        <Metal
          position={[x - 0.34, y, z]}
          size={[0.09, 0.012, 0.032]}
          color="#0b0e10"
        />
      )}
      <mesh
        position={[x - (compact ? 0.33 : 0.49), y, z]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.022, 20]} />
        <meshBasicMaterial color="#080c0d" />
      </mesh>
    </group>
  );
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
        <mesh raycast={noRaycast} position={[0, 0.025, 0]}>
          <boxGeometry args={[0.016, height - 0.17, depth - 0.13]} />
          <meshPhysicalMaterial
            color="#a8bfbe"
            metalness={0.05}
            roughness={0.08}
            transparent
            opacity={ghost ? 0.035 : exploded ? 0.11 : 0.16}
            depthWrite={false}
            clearcoat={1}
          />
        </mesh>
      )}
      {!ghost && (
        <>
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
      <Metal
        size={[w - 0.12, h - 0.15, 0.04]}
        position={[0, 0.02, -d / 2 + 0.02]}
        color={profile.color}
      />
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <Metal
            key={`foot${x}${z}`}
            size={[0.2, 0.095, 0.25]}
            position={[x * (w / 2 - 0.22), -h / 2 + 0.0475, z * (d / 2 - 0.27)]}
            color="#14181a"
            roughness={0.9}
          />
        )),
      )}
      {profile.id !== "case-q300l" && <TopIO width={w} height={h} depth={d} />}
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
        <boxGeometry args={[w * 0.72, h - 0.15, 0.015]} />
        <meshPhysicalMaterial
          color="#a5c4c2"
          roughness={0.08}
          metalness={0.02}
          transparent
          opacity={0.065}
          depthWrite={false}
          clearcoat={1}
        />
      </mesh>
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
          position={[0, h / 2 - 0.67, -d / 2 + 0.2]}
          rotation={[0, Math.PI, 0]}
          size={fanSize}
          light={light}
        />
      )}
      {isO11 && (
        <Metal
          size={[0.08, h - 0.12, 0.07]}
          position={[w / 2 - 0.04, 0.01, d / 2 - 0.025]}
          color={profile.frameColor}
        />
      )}
      <FrontBadge
        text={isO11 ? "LIAN LI" : "NZXT"}
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
          position={[0, h / 2 - 0.65, -d / 2 + 0.2]}
          rotation={[0, Math.PI, 0]}
          size={fanSize}
          light={light}
        />
      )}
      <MeshPanel
        position={[0, 0.04, d / 2 + 0.042]}
        size={[w - 0.27, h - 0.28]}
        color={light ? "#d0d7d7" : "#40494b"}
        pattern={nzxt ? "round" : "diagonal"}
      />
      <FrontBadge
        text={nzxt ? "NZXT" : "CORSAIR"}
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
    <mesh position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial map={texture} roughness={0.69} metalness={0} />
    </mesh>
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
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [walnut]);
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => {
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      matrix.makeTranslation(((i - (count - 1) / 2) * width) / count, 0, 0);
      mesh.current?.setMatrixAt(i, matrix);
    }
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
      mesh.current.computeBoundingSphere();
    }
  }, [width]);
  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      position={position}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[slatWidth, height, 0.05]} />
      <meshStandardMaterial map={texture} roughness={0.72} metalness={0} />
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
          <Metal
            key={`tf${x}${z}`}
            size={[0.14, 0.07, 0.24]}
            position={[x * (w / 2 - 0.16), -h / 2 + 0.035, z * (d / 2 - 0.22)]}
            color="#202722"
            roughness={0.9}
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
  switch (props.profile.kind) {
    case "panoramic":
      return <Panoramic {...props} />;
    case "airflow":
      return <Airflow {...props} />;
    case "compact":
      return <Compact {...props} />;
    case "sandwich":
      return <Terra {...props} />;
    case "wood-front":
      return <WoodFront {...props} />;
  }
}
