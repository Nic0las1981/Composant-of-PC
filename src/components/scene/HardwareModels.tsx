import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { Component } from "../../data/catalog";
import {
  MM,
  type BoardVisualProfile,
  type GpuVisualProfile,
  type CoolerVisualProfile,
  type RamVisualProfile,
  type CpuVisualProfile,
  type StorageVisualProfile,
  type PsuVisualProfile,
} from "../../data/visualProfiles";
import {
  MetalBox,
  BoxInstances,
  HardwareFan,
  HardwareLabel,
  Tube,
  type BoxInstance,
} from "./HardwarePrimitives";

type Vec3 = [number, number, number];
type Props<T> = { component: Component; profile: T };

export function getBoardAnchors(profile: BoardVisualProfile): {
  cpu: Vec3;
  ram: Vec3;
  storage: Vec3;
} {
  const h = profile.heightMm * MM,
    w = profile.widthMm * MM;
  return {
    cpu: [0.045, h * 0.19, -w * 0.12],
    ram: [
      0.045,
      h * (profile.formFactor === "Mini-ITX" ? 0.07 : 0.12),
      w * 0.32,
    ],
    storage: [0.045, -h * 0.2, -w * 0.05],
  };
}

function BoardSurface({ profile }: { profile: BoardVisualProfile }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 640;
    const c = canvas.getContext("2d")!;
    c.fillStyle = profile.pcbColor;
    c.fillRect(0, 0, 512, 640);
    // Deliberately deterministic fine circuitry, with no downloadable textures.
    c.lineWidth = 1.2;
    for (let i = 0; i < 48; i++) {
      const x = 13 + ((i * 73) % 480),
        y = 18 + ((i * 117) % 600);
      c.strokeStyle = i % 4 === 0 ? "#444d46" : "#2b3732";
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + 12, y);
      c.lineTo(x + 23, y + 11);
      c.lineTo(x + 23, y + 45);
      c.lineTo(x + 52, y + 74);
      c.stroke();
      c.fillStyle = "#a4a996";
      c.fillRect(x - 1, y - 1, 2.5, 2.5);
    }
    for (let i = 0; i < 160; i++) {
      c.fillStyle = i % 5 === 0 ? "#6c7165" : "#354138";
      c.fillRect(12 + ((i * 97) % 486), 10 + ((i * 53) % 620), 3, 2);
    }
    c.strokeStyle = "#4e5a4a";
    c.lineWidth = 2;
    c.strokeRect(6, 6, 500, 628);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [profile.pcbColor]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[0.018, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[profile.widthMm * MM, profile.heightMm * MM]} />
      <meshStandardMaterial map={texture} roughness={0.8} metalness={0.15} />
    </mesh>
  );
}

export function MotherboardModel({
  component,
  profile,
}: Props<BoardVisualProfile>) {
  const h = profile.heightMm * MM,
    w = profile.widthMm * MM;
  const anchors = getBoardAnchors(profile);
  const bits = useMemo<BoxInstance[]>(() => {
    const list: BoxInstance[] = [];
    for (let i = 0; i < 10; i++)
      list.push({
        position: [0.044, h * 0.32 - i * 0.06, -w * 0.35],
        size: [0.045, 0.035, 0.038],
      });
    for (let i = 0; i < 16; i++)
      list.push({
        position: [
          0.04,
          -h * 0.39 + (i % 4) * 0.11,
          w * 0.09 + Math.floor(i / 4) * 0.1,
        ],
        size: [0.04, 0.05, 0.065],
      });
    for (let i = 0; i < 8; i++)
      list.push({
        position: [0.04, h * 0.43, -w * 0.2 + i * 0.07],
        size: [0.05, 0.038, 0.03],
      });
    return list;
  }, [h, w]);
  const pcieCount =
    profile.formFactor === "Mini-ITX"
      ? 1
      : profile.formFactor === "Micro-ATX"
        ? 2
        : 3;
  const traces = useMemo<BoxInstance[]>(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        position: [0.126, h * 0.24 - i * 0.07, -w * 0.38],
        size: [0.008, 0.014, w * 0.2],
      })),
    [h, w],
  );
  return (
    <group>
      <MetalBox
        size={[0.033, h, w]}
        color={profile.pcbColor}
        metalness={0.1}
        roughness={0.85}
      />
      <BoardSurface profile={profile} />
      <MetalBox
        position={[0.085, h * 0.18, -w * 0.41]}
        size={[0.14, h * 0.46, w * 0.16]}
        color={profile.heatsinkColor}
      />
      <MetalBox
        position={[0.09, h * 0.41, -w * 0.02]}
        size={[0.15, h * 0.12, w * 0.55]}
        color={profile.heatsinkColor}
      />
      <BoxInstances items={traces} color="#737d82" />
      <HardwareLabel
        text={component.brand.toUpperCase()}
        position={[0.167, h * 0.33, -w * 0.4]}
        width={w * 0.12}
        height={h * 0.12}
        color="#b5bdc0"
      />
      <MetalBox
        position={[anchors.cpu[0] - 0.01, anchors.cpu[1], anchors.cpu[2]]}
        size={[0.055, 0.42, 0.42]}
        color="#747c80"
        roughness={0.23}
      />
      <MetalBox
        position={[anchors.cpu[0] + 0.019, anchors.cpu[1], anchors.cpu[2]]}
        size={[0.014, 0.35, 0.35]}
        color="#151a1d"
      />
      {Array.from({ length: profile.slots }, (_, i) => (
        <group
          key={i}
          position={[
            0.052,
            anchors.ram[1],
            anchors.ram[2] + (i - (profile.slots - 1) / 2) * 0.073,
          ]}
        >
          <MetalBox
            size={[0.07, 1.06, 0.035]}
            color={i % 2 ? "#343c40" : "#1b2225"}
            metalness={0.1}
          />
          <MetalBox
            position={[0.02, 0.55, 0]}
            size={[0.065, 0.042, 0.052]}
            color="#9da2a4"
          />
          <MetalBox
            position={[0.02, -0.55, 0]}
            size={[0.065, 0.042, 0.052]}
            color="#9da2a4"
          />
        </group>
      ))}
      {Array.from({ length: pcieCount }, (_, i) => (
        <group key={i} position={[0.047, -h * 0.16 - i * 0.27, -w * 0.1]}>
          <MetalBox
            size={[0.06, 0.055, w * 0.57]}
            color={i === 0 ? "#8a9296" : "#282e32"}
          />
          <MetalBox
            position={[0.032, 0, 0]}
            size={[0.008, 0.017, w * 0.51]}
            color="#0d1317"
          />
        </group>
      ))}
      <MetalBox
        position={[0.075, -h * 0.35, w * 0.29]}
        size={[0.12, h * 0.21, w * 0.23]}
        color={profile.heatsinkColor}
      />
      <HardwareLabel
        text={profile.formFactor === "Mini-ITX" ? "LIGHTNING" : "CHIPSET"}
        position={[0.14, -h * 0.35, w * 0.29]}
        width={w * 0.2}
        height={0.08}
        color="#99a1a5"
      />
      <MetalBox
        position={[0.075, 0, w * 0.47]}
        size={[0.12, 0.36, 0.072]}
        color="#171a1f"
      />
      <BoxInstances
        items={bits}
        color="#61696d"
        metalness={0.7}
        roughness={0.5}
      />
      {[-1, 1].flatMap((y) =>
        [-1, 1].map((z) => (
          <mesh
            key={`${y}-${z}`}
            position={[0.025, y * h * 0.46, z * w * 0.45]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <ringGeometry args={[0.012, 0.025, 12]} />
            <meshStandardMaterial
              color="#c2c2b0"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>
        )),
      )}
    </group>
  );
}

export function GpuModel({ component, profile }: Props<GpuVisualProfile>) {
  const length = profile.lengthMm * MM,
    width = profile.heightMm * MM,
    height = profile.thicknessMm * MM;
  const fanRadius = Math.min(
    profile.fanSizeMm * MM * 0.48,
    width * 0.44,
    (length / (profile.fanCount * 2)) * 0.95,
  );
  const fanSpan = length / 2 - fanRadius - 0.04;
  const fins = useMemo<BoxInstance[]>(
    () =>
      Array.from({ length: 38 }, (_, i) => ({
        position: [0, 0, -length * 0.46 + (i * length * 0.92) / 37],
        size: [width * 0.93, height * 0.7, 0.009],
      })),
    [length, width, height],
  );
  const backVents = useMemo<BoxInstance[]>(
    () =>
      Array.from({ length: 11 }, (_, i) => ({
        position: [0, height * 0.505, length * 0.23 + i * 0.032],
        size: [width * 0.68, 0.009, 0.012],
      })),
    [width, height, length],
  );
  const bracket = useMemo<BoxInstance[]>(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        position: [-width * 0.27 + i * width * 0.12, 0, -length * 0.507],
        size: [width * 0.07, height * 0.64, 0.02],
      })),
    [width, height, length],
  );
  const metal = profile.shroudColor;
  const label =
    component.brand === "Sapphire" ? "SAPPHIRE PULSE" : "GEFORCE RTX";
  return (
    <group>
      <MetalBox
        size={[width * 0.95, height * 0.78, length * 0.98]}
        color="#1a1d20"
      />
      <BoxInstances items={fins} color="#687075" roughness={0.36} />
      <MetalBox
        position={[0, height * 0.46, 0]}
        size={[width, 0.045, length]}
        color={profile.backplateColor}
        roughness={0.32}
      />
      <BoxInstances items={backVents} color="#111519" />
      <MetalBox
        position={[width * 0.49, 0, 0]}
        size={[0.035, height * 0.91, length]}
        color={metal}
      />
      <MetalBox
        position={[-width * 0.49, 0, 0]}
        size={[0.035, height * 0.91, length]}
        color={metal}
      />
      <MetalBox
        position={[0, -height * 0.43, 0]}
        size={[width, height * 0.17, length]}
        color={metal}
      />
      {Array.from({ length: profile.fanCount }, (_, i) => (
        <HardwareFan
          key={i}
          radius={fanRadius}
          position={[
            0,
            (profile.fanLayout === "flow-through" && i === profile.fanCount - 1
              ? 1
              : -1) *
              height *
              0.51,
            -fanSpan + i * ((fanSpan * 2) / Math.max(1, profile.fanCount - 1)),
          ]}
          rotation={[
            profile.fanLayout === "flow-through" && i === profile.fanCount - 1
              ? -Math.PI / 2
              : Math.PI / 2,
            0,
            0,
          ]}
          color={metal}
          hubLabel={
            component.brand === "Sapphire"
              ? "S"
              : component.brand === "ASUS"
                ? "ASUS"
                : component.brand === "MSI"
                  ? "MSI"
                  : "G"
          }
        />
      ))}
      <HardwareLabel
        text={label}
        position={[width * 0.515, 0, -length * 0.04]}
        width={length * 0.59}
        height={Math.min(0.14, height * 0.43)}
        color={profile.rgb ? profile.accent : "#d4d7d9"}
      />
      <HardwareLabel
        text={component.brand.toUpperCase()}
        position={[-width * 0.1, height * 0.49, -length * 0.2]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        width={length * 0.38}
        height={width * 0.23}
        color="#747d84"
      />
      {profile.rgb && (
        <MetalBox
          position={[width * 0.512, -height * 0.31, -length * 0.1]}
          size={[0.012, 0.018, length * 0.62]}
          color={profile.accent}
          emissive={profile.accent}
        />
      )}
      {component.brand === "Sapphire" && (
        <MetalBox
          position={[width * 0.515, height * 0.28, 0]}
          size={[0.012, 0.022, length * 0.82]}
          color="#b93b41"
          roughness={0.5}
        />
      )}
      <MetalBox
        position={[-width * 0.4, height * 0.6, -length * 0.1]}
        size={[0.045, 0.075, 0.63]}
        color="#b29851"
        roughness={0.4}
      />
      <MetalBox
        position={[0, 0, -length * 0.51]}
        size={[width * 1.02, height * 1.15, 0.023]}
        color="#8b9195"
      />
      <BoxInstances items={bracket} color="#22282b" />
      <MetalBox
        position={[width * 0.18, height * 0.55, -length * 0.21]}
        size={[0.19, 0.095, 0.16]}
        color="#14191c"
        metalness={0.1}
      />
    </group>
  );
}

export function CoolerModel({
  component,
  profile,
}: Props<CoolerVisualProfile>) {
  const h = profile.heightMm * MM,
    w = profile.widthMm * MM,
    d = profile.depthMm * MM;
  const low = profile.kind === "low-profile";
  const fins = useMemo<BoxInstance[]>(() => {
    if (low)
      return Array.from({ length: 22 }, (_, i) => ({
        position: [-h * 0.17, 0, -d * 0.46 + (i * d * 0.92) / 21],
        size: [h * 0.5, w * 0.94, 0.01],
      }));
    return [-1, 1].flatMap((side) =>
      Array.from({ length: 39 }, (_, i) => ({
        position: [-h * 0.35 + (i * h * 0.77) / 38, 0, side * d * 0.235],
        size: [0.009, w * 0.96, d * 0.34],
      })),
    );
  }, [h, w, d, low]);
  const pipePoints = useMemo<Vec3[][]>(
    () =>
      Array.from({ length: profile.heatpipes }, (_, i) => {
        const y = (i - (profile.heatpipes - 1) / 2) * w * 0.095;
        if (low)
          return [
            [-h * 0.37, y, -d * 0.3],
            [-h * 0.12, y, -d * 0.37],
            [h * 0.04, y, -d * 0.13],
            [h * 0.04, y, d * 0.3],
          ] as Vec3[];
        return [
          [h * 0.44, y, -d * 0.23],
          [-h * 0.33, y, -d * 0.23],
          [-h * 0.49, y, 0],
          [-h * 0.33, y, d * 0.23],
          [h * 0.44, y, d * 0.23],
        ] as Vec3[];
      }),
    [profile.heatpipes, h, w, d, low],
  );
  return (
    <group>
      <MetalBox
        position={[-h * 0.46, 0, 0]}
        size={[Math.min(0.08, h * 0.2), w * 0.44, d * 0.35]}
        color="#b3b8bb"
        roughness={0.16}
      />
      <BoxInstances
        items={fins}
        color={profile.finColor}
        metalness={0.87}
        roughness={0.3}
      />
      {pipePoints.map((points, i) => (
        <Tube
          key={i}
          points={points}
          radius={0.019}
          color={component.id === "cooler-nhd15" ? "#464a4b" : "#b0b1ab"}
        />
      ))}
      {low ? (
        <HardwareFan
          radius={profile.fanSizeMm * MM * 0.48}
          position={[h * 0.2, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          frame
          color={profile.fanColor}
          hubLabel="N"
        />
      ) : (
        <>
          {[-1, 1].map((side) => (
            <MetalBox
              key={side}
              position={[h * 0.45, 0, side * d * 0.235]}
              size={[0.018, w, d * 0.36]}
              color={profile.color}
              roughness={0.3}
            />
          ))}
          <HardwareFan
            radius={profile.fanSizeMm * MM * 0.47}
            position={[h * 0.07, 0, d * 0.43]}
            frame
            color={profile.fanColor}
            hubLabel={
              component.brand === "Noctua"
                ? "N"
                : component.brand === "DeepCool"
                  ? "DC"
                  : "TR"
            }
          />
          {profile.fanCount > 1 && (
            <HardwareFan
              radius={profile.fanSizeMm * MM * 0.47}
              position={[h * 0.07, 0, -d * 0.055]}
              frame
              color={profile.fanColor}
            />
          )}
          <HardwareLabel
            text={component.brand.toUpperCase()}
            position={[h * 0.465, 0, d * 0.23]}
            width={d * 0.29}
            height={w * 0.22}
            color={component.id === "cooler-nhd15" ? "#91999b" : "#727b7e"}
          />
        </>
      )}
    </group>
  );
}

export function RamModel({ component, profile }: Props<RamVisualProfile>) {
  const h = profile.heightMm * MM,
    l = profile.lengthMm * MM,
    t = profile.thicknessMm * MM;
  const contacts = useMemo<BoxInstance[]>(
    () =>
      Array.from({ length: 19 }, (_, i) => ({
        position: [-h * 0.51, -l * 0.43 + (i * l * 0.86) / 18, 0],
        size: [0.035, 0.024, 0.025],
      })),
    [h, l],
  );
  return (
    <group>
      {Array.from({ length: profile.sticks }, (_, i) => (
        <group
          key={i}
          position={[0, 0, (i - (profile.sticks - 1) / 2) * 0.145]}
        >
          <MetalBox size={[h * 0.83, l, t]} color="#20342b" metalness={0.1} />
          <MetalBox
            position={[h * 0.07, 0, 0]}
            size={[h * 0.89, l * 0.99, t * 1.6]}
            color={profile.heatspreaderColor}
            roughness={0.32}
          />
          <BoxInstances items={contacts} color="#ba9b4c" />
          <MetalBox
            position={[h * 0.51, 0, 0]}
            size={[0.034, l * 0.91, t * 1.52]}
            color={profile.rgb ? "#d6f5e8" : "#4b5054"}
            emissive={profile.rgb ? profile.accent : undefined}
          />
          <HardwareLabel
            text={component.brand.toUpperCase()}
            position={[h * 0.534, 0, 0]}
            rotation={[0, Math.PI / 2, Math.PI / 2]}
            width={l * 0.55}
            height={0.075}
            color={profile.rgb ? "#3b5548" : "#b6bdc0"}
          />
          <HardwareLabel
            text={
              component.name.includes("Flare")
                ? "FLARE X5"
                : component.name.includes("FURY")
                  ? "FURY"
                  : "VENGEANCE"
            }
            position={[0, 0, t * 0.81 + 0.001]}
            rotation={[0, 0, Math.PI / 2]}
            width={l * 0.65}
            height={h * 0.35}
            color="#a5aeb2"
          />
        </group>
      ))}
    </group>
  );
}

export function CpuModel({ component, profile }: Props<CpuVisualProfile>) {
  const w = profile.widthMm * MM,
    h = profile.heightMm * MM,
    d = profile.depthMm * MM;
  return (
    <group>
      <MetalBox
        position={[-d * 0.3, 0, 0]}
        size={[d * 0.45, h, w]}
        color={component.brand === "Intel" ? "#354b44" : "#243b2c"}
        roughness={0.72}
        metalness={0.12}
      />
      <MetalBox
        position={[d * 0.12, 0, 0]}
        size={[d * 0.76, h * 0.84, w * 0.84]}
        color="#bfc4c5"
        roughness={0.23}
        metalness={0.86}
      />
      <HardwareLabel
        text={component.brand === "AMD" ? "AMD RYZEN" : "intel CORE"}
        subtext={component.name.replace("Ryzen ", "").replace("Core ", "")}
        position={[d * 0.52, 0, 0]}
        width={w * 0.75}
        height={h * 0.48}
        color="#343b3d"
      />
      {component.brand === "AMD" &&
        [-1, 1].flatMap((y) =>
          [-1, 1].map((z) => (
            <MetalBox
              key={`${y}${z}`}
              position={[d * 0.43, y * h * 0.4, z * w * 0.4]}
              size={[0.018, 0.04, 0.04]}
              color="#4d5854"
            />
          )),
        )}
    </group>
  );
}

export function StorageModel({
  component,
  profile,
}: Props<StorageVisualProfile>) {
  const w = profile.widthMm * MM,
    l = profile.lengthMm * MM,
    h = profile.heightMm * MM;
  return (
    <group>
      <MetalBox
        size={[Math.max(h, 0.018), w, l]}
        color="#222a2a"
        roughness={0.7}
        metalness={0.2}
      />
      <MetalBox
        position={[h * 0.7, 0, -l * 0.14]}
        size={[0.029, w * 0.79, l * 0.67]}
        color={profile.labelColor}
        roughness={0.58}
        metalness={0.1}
      />
      <MetalBox
        position={[0, 0, l * 0.49]}
        size={[0.018, w * 0.8, 0.07]}
        color="#bfa954"
      />
      <HardwareLabel
        text={component.brand.toUpperCase()}
        subtext={component.name}
        position={[h * 0.7 + 0.018, 0, -l * 0.14]}
        width={l * 0.6}
        height={w * 0.76}
        color="#e2e4e3"
      />
      <mesh position={[0.025, 0, -l * 0.46]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.012, 0.026, 16]} />
        <meshStandardMaterial color="#9b9990" metalness={0.7} />
      </mesh>
    </group>
  );
}

export function PsuModel({ component, profile }: Props<PsuVisualProfile>) {
  const w = profile.widthMm * MM,
    h = profile.heightMm * MM,
    d = profile.depthMm * MM;
  const grille = useMemo<BoxInstance[]>(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        position: [-w * 0.4 + (i * w * 0.8) / 11, h * 0.52, 0],
        size: [0.014, 0.012, d * 0.73],
      })),
    [w, h, d],
  );
  const plugs = useMemo<BoxInstance[]>(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        position: [
          -w * 0.32 + (i % 4) * w * 0.22,
          -h * 0.19 + Math.floor(i / 4) * h * 0.39,
          d * 0.509,
        ],
        size: [w * 0.15, h * 0.24, 0.026],
      })),
    [w, h, d],
  );
  return (
    <group>
      <MetalBox size={[w, h, d]} color={profile.color} roughness={0.39} />
      <HardwareFan
        radius={Math.min(profile.fanSizeMm * MM * 0.45, w * 0.42, d * 0.42)}
        position={[0, h * 0.505, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        color="#15191c"
      />
      <BoxInstances items={grille} color="#5e6368" metalness={0.7} />
      <MetalBox
        position={[w * 0.504, 0, 0]}
        size={[0.008, h * 0.72, d * 0.77]}
        color="#252b2e"
        metalness={0.15}
        roughness={0.6}
      />
      <HardwareLabel
        text={component.name.split(" · ")[0].toUpperCase()}
        subtext={`${component.brand.toUpperCase()}  /  ${component.wattage} W`}
        position={[w * 0.511, 0, 0]}
        width={d * 0.7}
        height={h * 0.53}
        color="#c4c7c6"
      />
      <BoxInstances items={plugs} color="#070b0d" metalness={0.05} />
      <MetalBox
        position={[-w * 0.2, -h * 0.12, -d * 0.51]}
        size={[w * 0.31, h * 0.3, 0.03]}
        color="#0b0e12"
        metalness={0.1}
      />
      <MetalBox
        position={[w * 0.21, -h * 0.12, -d * 0.52]}
        size={[w * 0.12, h * 0.22, 0.04]}
        color="#12171b"
        metalness={0.1}
      />
    </group>
  );
}

function PumpScreen({ width, position }: { width: number; position: Vec3 }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#060a0f";
    ctx.fillRect(0, 0, 512, 512);
    const glow = ctx.createRadialGradient(256, 256, 50, 256, 256, 260);
    glow.addColorStop(0, "#13212b");
    glow.addColorStop(1, "#060a0f");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 512, 512);
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#7dd7df";
    ctx.beginPath();
    ctx.arc(256, 256, 215, -Math.PI * 0.8, Math.PI * 0.6);
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#233d45";
    ctx.beginPath();
    ctx.arc(256, 256, 190, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#edf9ff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 76px Arial";
    ctx.fillText("NZXT", 256, 232);
    ctx.fillStyle = "#88a9b4";
    ctx.font = "500 22px Arial";
    ctx.fillText("K R A K E N", 256, 302);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    return map;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={position} rotation={[0, Math.PI / 2, 0]}>
      <circleGeometry args={[width / 2, 48]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function BraidedHose({ points, color }: { points: Vec3[]; color: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 64, 64);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#33383b";
    for (let i = -64; i < 128; i += 12) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 64, 64);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i + 64, 0);
      ctx.lineTo(i, 64);
      ctx.stroke();
    }
    const map = new THREE.CanvasTexture(canvas);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(22, 3);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    return map;
  }, [color]);
  const geometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
        48,
        0.043,
        10,
        false,
      ),
    [points],
  );
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial map={texture} roughness={0.84} metalness={0.04} />
    </mesh>
  );
}

/** Pump and radiator positions use assembly coordinates, with physical centers.
 * Top radiators lie in XZ; front radiators lie in XY; side radiators lie in YZ.
 */
export function AioCoolingModel({
  component,
  profile,
  pumpPosition,
  radiatorPosition,
  mount = "top",
}: Props<CoolerVisualProfile> & {
  pumpPosition: Vec3;
  radiatorPosition: Vec3;
  mount?: "top" | "front" | "side";
}) {
  const pumpDepth = profile.heightMm * MM,
    pumpWidth = profile.widthMm * MM,
    pumpHeight = profile.depthMm * MM;
  const length =
    (profile.radiatorLengthMm || (profile.radiatorSizeMm || 240) + 38) * MM;
  const width = (profile.radiatorWidthMm || profile.fanSizeMm + 5) * MM;
  const thickness = (profile.radiatorThicknessMm || 27) * MM;
  const rotation: Vec3 =
    mount === "top"
      ? [0, 0, 0]
      : mount === "front"
        ? [-Math.PI / 2, 0, 0]
        : [Math.PI / 2, 0, Math.PI / 2];
  const fanRadius = profile.fanSizeMm * MM * 0.46;
  const fanDistance = profile.fanSizeMm * MM;
  const fins = useMemo<BoxInstance[]>(
    () =>
      Array.from({ length: 53 }, (_, i) => ({
        position: [0, 0, -length * 0.43 + (i * length * 0.86) / 52],
        size: [width * 0.83, thickness * 0.68, 0.009],
      })),
    [width, length, thickness],
  );
  const rails = useMemo<BoxInstance[]>(
    () =>
      [
        {
          position: [-width * 0.48, 0, 0],
          size: [width * 0.065, thickness, length],
        },
        {
          position: [width * 0.48, 0, 0],
          size: [width * 0.065, thickness, length],
        },
        {
          position: [0, 0, -length * 0.475],
          size: [width, thickness, length * 0.05],
        },
        {
          position: [0, 0, length * 0.475],
          size: [width, thickness, length * 0.05],
        },
      ] as BoxInstance[],
    [width, thickness, length],
  );
  const hoses = useMemo(() => {
    const transform = new THREE.Euler(...rotation);
    return [-1, 1].map((side) => {
      const localEnd = new THREE.Vector3(
        side * width * 0.22,
        -thickness * 0.1,
        length * 0.495,
      )
        .applyEuler(transform)
        .add(new THREE.Vector3(...radiatorPosition));
      const localApproach = new THREE.Vector3(
        side * width * 0.22,
        -thickness * 0.1,
        length * 0.495 + 0.12,
      )
        .applyEuler(transform)
        .add(new THREE.Vector3(...radiatorPosition));
      const start = new THREE.Vector3(
        pumpPosition[0] + pumpDepth * 0.06,
        pumpPosition[1] + side * pumpWidth * 0.2,
        pumpPosition[2] + pumpHeight * 0.51,
      );
      const lead = new THREE.Vector3(
        start.x + 0.1,
        start.y - 0.05,
        start.z + 0.2,
      );
      const middle = new THREE.Vector3(
        Math.max(start.x, localEnd.x) + 0.2,
        (start.y + localEnd.y) * 0.5 - 0.13,
        (start.z + localEnd.z) * 0.5 + 0.2,
      );
      const points = [start, lead, middle, localApproach, localEnd].map(
        (p) => p.toArray() as Vec3,
      );
      return {
        points,
        start: start.toArray() as Vec3,
        end: localEnd.toArray() as Vec3,
      };
    });
  }, [
    ...pumpPosition,
    ...radiatorPosition,
    ...rotation,
    pumpDepth,
    pumpWidth,
    pumpHeight,
    width,
    thickness,
    length,
  ]);
  const pumpColor = profile.pumpColor || profile.color;
  const arctic = component.brand.toLowerCase().includes("arctic");
  const rounded = profile.pumpDisplay === "lcd" || arctic;
  const face = pumpDepth * 0.52;
  const radius = Math.min(pumpWidth, pumpHeight) * 0.46;
  return (
    <group>
      <group position={radiatorPosition} rotation={rotation}>
        <MetalBox
          size={[width, thickness * 0.77, length]}
          color="#11171b"
          roughness={0.72}
        />
        <BoxInstances
          items={fins}
          color="#687277"
          metalness={0.75}
          roughness={0.49}
        />
        <BoxInstances items={rails} color="#252c30" roughness={0.44} />
        <MetalBox
          position={[0, thickness * 0.43, 0]}
          size={[width * 0.88, 0.014, length * 0.88]}
          color="#151d20"
          metalness={0.3}
          roughness={0.65}
        />
        {Array.from({ length: profile.fanCount }, (_, i) => (
          <HardwareFan
            key={i}
            frame
            radius={fanRadius}
            position={[
              0,
              -thickness * 0.52 - 0.055,
              (i - (profile.fanCount - 1) / 2) * fanDistance,
            ]}
            rotation={[Math.PI / 2, 0, 0]}
            color={profile.fanColor}
            rgb={profile.fanRgb}
            accent={profile.accent}
            hubLabel={
              arctic
                ? "A"
                : component.brand === "NZXT"
                  ? "N"
                  : component.brand === "Corsair"
                    ? "C"
                    : "DC"
            }
          />
        ))}
        <HardwareLabel
          text={component.brand.toUpperCase()}
          position={[width * 0.515, 0, 0]}
          width={length * 0.34}
          height={thickness * 0.55}
          color="#c2c8ca"
        />
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * width * 0.22, -thickness * 0.1, length * 0.51]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.057, 0.057, 0.1, 16]} />
            <meshStandardMaterial
              color="#444d50"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>
      <group position={pumpPosition}>
        <MetalBox
          position={[-pumpDepth * 0.43, 0, 0]}
          size={[0.035, pumpWidth * 0.73, pumpHeight * 0.73]}
          color="#bb976b"
          metalness={0.8}
          roughness={0.25}
        />
        {rounded ? (
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[radius, radius, pumpDepth, 48]} />
            <meshStandardMaterial
              color={pumpColor}
              roughness={0.3}
              metalness={0.38}
            />
          </mesh>
        ) : (
          <MetalBox
            size={[pumpDepth, pumpWidth, pumpHeight]}
            color={pumpColor}
            roughness={0.3}
          />
        )}
        {profile.pumpDisplay === "lcd" ? (
          <PumpScreen width={radius * 1.83} position={[face + 0.005, 0, 0]} />
        ) : (
          <>
            {profile.pumpDisplay === "rgb-ring" && (
              <>
                {[-1, 1].map((side) => (
                  <group key={side}>
                    <MetalBox
                      position={[face, side * pumpWidth * 0.42, 0]}
                      size={[0.018, 0.025, pumpHeight * 0.86]}
                      color={profile.accent}
                      emissive={profile.accent}
                    />
                    <MetalBox
                      position={[face, 0, side * pumpHeight * 0.42]}
                      size={[0.018, pumpWidth * 0.86, 0.025]}
                      color={profile.accent}
                      emissive={profile.accent}
                    />
                  </group>
                ))}
                {component.brand === "DeepCool" &&
                  [1, 2].map((i) => (
                    <group key={i}>
                      {[-1, 1].map((side) => (
                        <group key={side}>
                          <MetalBox
                            position={[
                              face + 0.002,
                              side * pumpWidth * (0.35 - i * 0.07),
                              0,
                            ]}
                            size={[0.008, 0.009, pumpHeight * (0.7 - i * 0.14)]}
                            color={profile.accent}
                            emissive={profile.accent}
                          />
                          <MetalBox
                            position={[
                              face + 0.002,
                              0,
                              side * pumpHeight * (0.35 - i * 0.07),
                            ]}
                            size={[0.008, pumpWidth * (0.7 - i * 0.14), 0.009]}
                            color={profile.accent}
                            emissive={profile.accent}
                          />
                        </group>
                      ))}
                    </group>
                  ))}
              </>
            )}
            {arctic && (
              <HardwareFan
                radius={radius * 0.72}
                position={[face, 0, 0]}
                rotation={[0, Math.PI / 2, 0]}
                color="#1b2429"
                hubLabel="A"
              />
            )}
            {!arctic && (
              <HardwareLabel
                text={component.brand.toUpperCase()}
                position={[face + 0.006, 0, 0]}
                width={pumpHeight * 0.68}
                height={pumpWidth * 0.23}
                color="#dbe5e7"
              />
            )}
          </>
        )}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[
              pumpDepth * 0.06,
              side * pumpWidth * 0.2,
              pumpHeight * 0.51,
            ]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.058, 0.058, 0.11, 16]} />
            <meshStandardMaterial
              color="#41494e"
              metalness={0.6}
              roughness={0.35}
            />
          </mesh>
        ))}
      </group>
      {hoses.map((hose, i) => (
        <BraidedHose
          key={i}
          points={hose.points}
          color={profile.tubeColor || "#141b20"}
        />
      ))}
    </group>
  );
}
