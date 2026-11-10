import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Component } from "../../data/catalog";
import { getMemoryDetails } from "../../lib/memoryDetails";
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
  RGBStrip,
  Tube,
  type BoxInstance,
  useHardwareSurface,
} from "./HardwarePrimitives";

import {CrucialHeatspreader, Samsung9100Surface, SteelLegendBoardDetails, SteelLegendGpuShroud, PowerZoneGrille} from "./IndividualHardwareDetails";

import {CircuitPackages, M2Board, CpuContactField, FanWireClips, VentilatedPsuShell, AxialShroud} from "./CircuitDetails";

type Vec3 = [number, number, number];
type Props<T> = { component: Component; profile: T };

/** Reconstructed fasteners share three draw calls, regardless of their count.
 * Their placement is visual assembly detail, not a manufacturer mounting map.
 */
function Fasteners({ positions, axis = "x", radius = 0.019, color = "#899294" }: {
  positions: Vec3[]; axis?: "x" | "y" | "z"; radius?: number; color?: string;
}) {
  const heads = useRef<THREE.InstancedMesh>(null);
  const washers = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const object = new THREE.Object3D();
    object.rotation.set(axis === "z" ? Math.PI / 2 : 0, 0, axis === "x" ? -Math.PI / 2 : 0);
    positions.forEach((position, index) => {
      object.position.set(...position);
      object.updateMatrix();
      heads.current?.setMatrixAt(index, object.matrix);
      washers.current?.setMatrixAt(index, object.matrix);
    });
    for (const mesh of [heads.current, washers.current]) if (mesh) {
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    }
  }, [positions, axis]);
  const slots = useMemo<BoxInstance[]>(() => positions.flatMap((position) => [0, 1].map((turn) => {
    const point = [...position] as Vec3;
    point[axis === "x" ? 0 : axis === "y" ? 1 : 2] += 0.009;
    const size: Vec3 = axis === "x" ? [0.002, radius * 1.1, radius * 0.17]
      : axis === "y" ? [radius * 1.1, 0.002, radius * 0.17] : [radius * 1.1, radius * 0.17, 0.002];
    const rotation: Vec3 = axis === "x" ? [turn * Math.PI / 2, 0, 0]
      : axis === "y" ? [0, turn * Math.PI / 2, 0] : [0, 0, turn * Math.PI / 2];
    return { position: point, size, rotation };
  })), [positions, axis, radius]);
  return <group name="reconstructed-fasteners">
    <instancedMesh ref={washers} args={[undefined, undefined, positions.length]}>
      <cylinderGeometry args={[radius * 1.42, radius * 1.42, 0.005, 16]} />
      <meshStandardMaterial color="#273036" metalness={0.45} roughness={0.55} />
    </instancedMesh>
    <instancedMesh ref={heads} args={[undefined, undefined, positions.length]} castShadow>
      <cylinderGeometry args={[radius * 0.92, radius, 0.016, 16]} />
      <meshStandardMaterial color={color} metalness={0.75} roughness={0.3} />
    </instancedMesh>
    <BoxInstances items={slots} color="#11191c" metalness={0.1} roughness={0.8} />
  </group>;
}

/** A physical DIMM slot pitch is shared by the socket and its installed module. */
export const DIMM_SLOT_SPACING = 0.073;
export function getDimmSlotLabel(slotCount: number, index: number): string {
  return slotCount <= 2
    ? `${String.fromCharCode(65 + index)}1`
    : `${String.fromCharCode(65 + Math.floor(index / 2))}${index % 2 + 1}`;
}
export function getDimmSlotPosition(profile: BoardVisualProfile, index: number): Vec3 {
  const anchor = getBoardAnchors(profile).ram;
  return [anchor[0], anchor[1], anchor[2] + (index - (profile.slots - 1) / 2) * DIMM_SLOT_SPACING];
}

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
      0.052,
      h * (profile.formFactor === "Mini-ITX" ? 0.07 : 0.12),
      w * 0.32,
    ],
    storage: profile.design === "steel-legend-b850" ? [0.08, -h * 0.04, -w * 0.12] : [0.045, -h * 0.2, -w * 0.05],
  };
}

/** Board-mounted cylinders share geometry/material to keep small details affordable. */
function BoardCapacitors({ positions }: { positions: Vec3[] }) {
  const bodies = useRef<THREE.InstancedMesh>(null);
  const tops = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const matrix = new THREE.Object3D();
    positions.forEach((position, index) => {
      matrix.position.set(...position);
      matrix.rotation.z = -Math.PI / 2;
      matrix.updateMatrix();
      bodies.current?.setMatrixAt(index, matrix.matrix);
      matrix.position.x += 0.033;
      matrix.updateMatrix();
      tops.current?.setMatrixAt(index, matrix.matrix);
    });
    for (const mesh of [bodies.current, tops.current]) if (mesh) {
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    }
  }, [positions]);
  return <group>
    <instancedMesh ref={bodies} args={[undefined, undefined, positions.length]} castShadow>
      <cylinderGeometry args={[0.024, 0.024, 0.061, 12]} />
      <meshStandardMaterial color="#2b343b" metalness={0.25} roughness={0.5} />
    </instancedMesh>
    <instancedMesh ref={tops} args={[undefined, undefined, positions.length]}>
      <cylinderGeometry args={[0.021, 0.021, 0.005, 12]} />
      <meshStandardMaterial color="#aab5b8" metalness={0.7} roughness={0.4} />
    </instancedMesh>
  </group>;
}

function BoardSurface({ component, profile }: Props<BoardVisualProfile>) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1280;
    const c = canvas.getContext("2d")!;
    c.scale(2, 2);
    c.fillStyle = profile.pcbColor;
    c.fillRect(0, 0, 512, 640);
    // Routed traces and silk screen are reconstructed locally, never downloaded.
    c.lineWidth = 0.9;
    for (let i = 0; i < 96; i++) {
      const x = 13 + ((i * 73) % 480),
        y = 18 + ((i * 117) % 600);
      c.strokeStyle = i % 4 === 0 ? "#8d8b6a66" : "#718a7860";
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
    for (let i = 0; i < 200; i++) {
      const x = 12 + ((i * 97) % 486), y = 10 + ((i * 53) % 620);
      c.fillStyle = "#141b1d";
      c.fillRect(x, y, 5.5, 3);
      c.fillStyle = i % 5 === 0 ? "#c2b783" : "#8b9690";
      c.fillRect(x, y, 1.2, 3);
      c.fillRect(x + 4.3, y, 1.2, 3);
    }
    // Fine plated vias and parallel buses give the board its layered PCB look.
    // These routes deliberately do not claim a real electrical netlist.
    for (let i = 0; i < 190; i++) {
      const x = 16 + ((i * 61) % 478), y = 15 + ((i * 89) % 606);
      c.strokeStyle = "#9b9d797a"; c.lineWidth = 0.65;
      c.beginPath(); c.arc(x, y, 1.1, 0, Math.PI * 2); c.stroke();
      c.fillStyle = "#0b1716"; c.fillRect(x - 0.35, y - 0.35, 0.7, 0.7);
    }
    for (let lane = 0; lane < 18; lane++) {
      c.strokeStyle = lane % 3 ? "#95a58b33" : "#b0ad7b48";
      c.lineWidth = 0.6;
      c.beginPath(); c.moveTo(255 + lane * 2.4, 150);
      c.lineTo(255 + lane * 2.4, 240 + lane * 1.3);
      c.lineTo(330 + lane * 2.4, 315 + lane * 1.3);
      c.lineTo(440, 315 + lane * 1.3); c.stroke();
    }
    c.font = "500 8px monospace";
    c.fillStyle = "#c3ccc2";
    for (const [label, x, y] of [["CPU_PWR", 355, 35], ["SYS_FAN", 30, 88], ["PCI_E1", 180, 405], ["M.2", 265, 452], ["USB", 205, 602], ["AUDIO", 430, 583], ["ATX_PWR", 12, 342]] as const) {
      c.fillText(label, x, y);
    }
    c.font = "600 10px monospace";
    c.fillText(component.name.slice(0, 35), 80, 570, 340);
    c.strokeStyle = "#788b76";
    c.lineWidth = 2;
    c.strokeRect(6, 6, 500, 628);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [profile.pcbColor, component.name]);
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
  const steelLegend = profile.design === "steel-legend-b850";
  const socketHeight=component.socket === "LGA1700" ? .54 : .42;
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
  const pcieCount = steelLegend ? 2 :
    profile.formFactor === "Mini-ITX"
      ? 1
      : profile.formFactor === "Micro-ATX"
        ? 2
        : 3;
  const pcieY = (slot: number) => steelLegend ? -h * (slot === 0 ? 0.13 : 0.425) : -h * 0.16 - slot * 0.27;
  const traces = useMemo<BoxInstance[]>(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        position: [0.126, h * 0.24 - i * 0.07, -w * 0.38],
        size: [0.008, 0.014, w * 0.2],
      })),
    [h, w],
  );
  const capacitors = useMemo<Vec3[]>(() => [
    ...Array.from({ length: 9 }, (_, i) => [0.06, h * 0.31 - i * h * 0.065, -w * 0.285] as Vec3),
    ...Array.from({ length: 6 }, (_, i) => [0.06, -h * 0.41, -w * 0.34 + i * w * 0.055] as Vec3),
  ], [h, w]);
  const powerPins = useMemo<BoxInstance[]>(() => Array.from({ length: 24 }, (_, i) => ({
    position: [0.138, -0.15 + (i % 12) * 0.027, w * 0.47 + (i < 12 ? -0.018 : 0.018)] as Vec3,
    size: [0.009, 0.013, 0.009] as Vec3,
  })), [w]);
  const sinkGrooves = useMemo<BoxInstance[]>(() => Array.from({ length: 11 }, (_, i) => ({
    position: [0.17, h * 0.18 - h * 0.19 + i * h * 0.037, -w * 0.41] as Vec3,
    size: [0.008, 0.011, w * 0.145] as Vec3,
  })), [h, w]);
  const topSinkGrooves = useMemo<BoxInstance[]>(() => Array.from({ length: 18 }, (_, i) => ({
    position: [0.167, h * 0.41, -w * 0.26 + i * w * 0.028] as Vec3,
    size: [0.009, h * 0.105, 0.009] as Vec3,
  })), [h, w]);
  const slotContacts = useMemo<BoxInstance[]>(() => [
    ...Array.from({ length: profile.slots }, (_, slot) => {
      const p = getDimmSlotPosition(profile, slot);
      return Array.from({ length: 27 }, (_, pin) => ({
        position: [p[0] + 0.039, p[1] - 0.47 + pin * 0.036, p[2]] as Vec3,
        size: [0.003, 0.011, 0.012] as Vec3,
      }));
    }).flat(),
    ...Array.from({ length: pcieCount }, (_, slot) => Array.from({ length: 31 }, (_, pin) => ({
      position: [0.084, pcieY(slot), -w * 0.345 + pin * w * 0.016] as Vec3,
      size: [0.003, 0.014, 0.007] as Vec3,
    }))).flat(),
  ], [profile, pcieCount, h, w]);
  const mountingScrews = useMemo<Vec3[]>(() => [-1, 1].flatMap(y => [-1, 1].map(z =>
    [0.029, y * h * 0.46, z * w * 0.45] as Vec3)), [h, w]);
  return (
    <group>
      <MetalBox
        size={[0.033, h, w]}
        color={profile.pcbColor}
        finish="pcb"
        metalness={0.1}
        roughness={0.85}
      />
      <BoardSurface component={component} profile={profile} />
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
      <BoxInstances items={traces} color="#98a5aa" roughness={0.5} />
      <BoxInstances items={sinkGrooves} color="#171f24" metalness={0.2} roughness={0.7} />
      <BoxInstances items={topSinkGrooves} color="#1b252b" metalness={0.15} roughness={0.65} />
      <BoardCapacitors positions={capacitors} />
      <BoxInstances items={powerPins} color="#b8a36a" metalness={0.65} />
      <BoxInstances items={slotContacts} color="#bda465" metalness={0.7} roughness={0.32} />
      <Fasteners positions={mountingScrews} radius={0.018} />
      <group position={[0.11, h * 0.18, -w * 0.502]}>
        <MetalBox size={[0.19, h * 0.49, 0.045]} color="#8b969a" metalness={0.65} roughness={0.42} />
        {[0, 1, 2].map((index) => <group key={index} position={[0, h * (0.12 - index * 0.115), -0.028]}>
          <MetalBox size={[0.12, 0.12, 0.012]} color="#172126" metalness={0.1} />
          <MetalBox position={[0, 0.018, -0.009]} size={[0.085, 0.021, 0.009]} color={index === 1 ? "#286ba1" : "#242a30"} metalness={0.1} />
          <MetalBox position={[0, -0.025, -0.009]} size={[0.085, 0.021, 0.009]} color={index === 1 ? "#286ba1" : "#242a30"} metalness={0.1} />
        </group>)}
      </group>
      <HardwareLabel
        text={steelLegend ? "ASRock" : component.brand.toUpperCase()}
        position={[0.167, h * 0.33, -w * 0.4]}
        width={w * 0.12}
        height={h * 0.12}
        color="#b5bdc0"
      />
      <MetalBox
        position={[anchors.cpu[0] - 0.01, anchors.cpu[1], anchors.cpu[2]]}
        size={[0.055, socketHeight, 0.42]}
        color="#747c80"
        roughness={0.23}
      />
      <MetalBox
        position={[anchors.cpu[0] + 0.019, anchors.cpu[1], anchors.cpu[2]]}
        size={[0.014, socketHeight*.83, 0.35]}
        color="#151a1d"
      />
      <group name="socket-contact-field" position={[anchors.cpu[0]+.029,anchors.cpu[1],anchors.cpu[2]]} rotation={[0,Math.PI,0]}>
        <CpuContactField width={.32} height={socketHeight*.72} depth={.006} pins={false}/>
      </group>
      <Tube points={[
        [anchors.cpu[0] + 0.034, anchors.cpu[1] - 0.2, anchors.cpu[2] + 0.218],
        [anchors.cpu[0] + 0.041, anchors.cpu[1] + 0.18, anchors.cpu[2] + 0.218],
        [anchors.cpu[0] + 0.055, anchors.cpu[1] + 0.245, anchors.cpu[2] + 0.17],
      ]} radius={0.009} color="#b1b8b7" />
      {Array.from({ length: profile.slots }, (_, i) => (
        <group
          key={i}
          name={`dimm-slot-${i}`}
          userData={{ memorySocketIndex: i, memorySocketLabel: getDimmSlotLabel(profile.slots, i) }}
          position={getDimmSlotPosition(profile, i)}
        >
          <MetalBox
            size={[0.07, 1.06, 0.035]}
            color={i % 2 ? "#343c40" : "#1b2225"}
            metalness={0.1}
          />
          <MetalBox position={[0.036, 0, 0]} size={[0.005, 1.01, 0.014]} color="#0b1217" roughness={0.8} metalness={0} />
          <HardwareLabel text={getDimmSlotLabel(profile.slots, i)} position={[0.04, -0.608, 0]} width={0.06} height={0.034} color="#a5b6ab" />
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
        <group key={i} position={[0.047, pcieY(i), -w * 0.1]}>
          <MetalBox
            size={[0.06, 0.055, w * 0.57]}
            color={i === 0 ? "#8a9296" : "#282e32"}
          />
          <MetalBox
            position={[0.032, 0, 0]}
            size={[0.008, 0.017, w * 0.51]}
            color="#0d1317"
          />
          <MetalBox position={[0.04, 0, w * 0.305]} size={[0.07, 0.072, 0.06]} color="#667277" roughness={0.55} metalness={0.2} />
        </group>
      ))}
      <MetalBox
        position={[0.075, -h * 0.35, w * 0.29]}
        size={[0.12, h * 0.21, w * 0.23]}
        color={profile.heatsinkColor}
      />
      <HardwareLabel
        text={component.socket || "CHIPSET"}
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
      {steelLegend && <SteelLegendBoardDetails profile={profile} />}
      {profile.rgb && !steelLegend && (component.brand === "ASUS" ?
        <RGBStrip position={[0.175, h * 0.31, -w * 0.405]} size={[h * 0.2, 0.025, 0.018]} rotation={[0, 0, Math.PI / 2]} phase={0.45} /> :
        <RGBStrip position={[0.14, -h * 0.43, w * 0.29]} size={[w * 0.21, 0.022, 0.014]} rotation={[0, Math.PI / 2, 0]} phase={0.45} />)}
      <mesh position={[0.055, -h * 0.29, -w * 0.32]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.078, 0.078, 0.022, 32]} />
        <meshStandardMaterial color="#aeb6b2" metalness={0.72} roughness={0.35} />
      </mesh>
      <HardwareLabel text="+" position={[0.068, -h * 0.29, -w * 0.32]} width={0.07} height={0.05} color="#3b4848" />
      <BoxInstances
        items={bits}
        color="#61696d"
        metalness={0.7}
        roughness={0.5}
      />
    </group>
  );
}

/** Cut-outs are real openings, so fins and flow-through fans remain visible. */
function GpuBackplate({ component, profile }: Props<GpuVisualProfile>) {
  const geometry = useMemo(() => {
    const l = profile.lengthMm * MM, w = profile.heightMm * MM;
    const edge = Math.min(w * 0.055, 0.04);
    const shape = new THREE.Shape();
    shape.moveTo(-l / 2 + edge, -w / 2);
    shape.lineTo(l / 2 - edge, -w / 2); shape.lineTo(l / 2, -w / 2 + edge);
    shape.lineTo(l / 2, w / 2 - edge); shape.lineTo(l / 2 - edge, w / 2);
    shape.lineTo(-l / 2 + edge, w / 2); shape.lineTo(-l / 2, w / 2 - edge);
    shape.lineTo(-l / 2, -w / 2 + edge); shape.closePath();
    if (profile.design === "steel-legend-rx9060xt") {
      const openings = [
        [[-.46,-.38],[-.15,-.38],[-.29,-.08],[-.46,-.08]],
        [[-.46,-.01],[-.34,-.01],[-.20,.30],[-.46,.30]],
        [[-.30,-.01],[-.14,-.32],[-.14,.12],[-.19,.20]],
        [[-.44,.36],[-.18,.36],[-.13,.22],[-.27,.22]],
      ];
      for (const points of openings) {
        const opening = new THREE.Path();
        points.forEach(([x,y],index) => index ? opening.lineTo(x*l,y*w) : opening.moveTo(x*l,y*w));
        opening.closePath(); shape.holes.push(opening);
      }
    } else if (profile.fanLayout === "flow-through") {
      const radius = Math.min(profile.fanSizeMm * MM * 0.48, w * 0.44, l / (profile.fanCount * 2) * 0.95);
      const opening = new THREE.Path();
      opening.absarc(-(l / 2 - radius - 0.04), 0, radius * 0.93, 0, Math.PI * 2, true);
      shape.holes.push(opening);
    } else {
      for (let i = 0; i < 10; i++) {
        const x = -l * (0.19 + i * 0.023), half = Math.min(l * 0.004, 0.009);
        const slot = new THREE.Path();
        slot.moveTo(x - half, -w * 0.3); slot.lineTo(x - half, w * 0.3);
        slot.lineTo(x + half, w * 0.3); slot.lineTo(x + half, -w * 0.3); slot.closePath();
        shape.holes.push(slot);
      }
    }
    const result = new THREE.ExtrudeGeometry(shape, { depth: 0.027, bevelEnabled: false, curveSegments: 40, steps: 1 });
    const uv = result.getAttribute("uv"), position = result.getAttribute("position");
    for (let i = 0; i < uv.count; i++) uv.setXY(i, position.getX(i) / l + 0.5, position.getY(i) / w + 0.5);
    uv.needsUpdate = true;
    return result;
  }, [profile.lengthMm, profile.heightMm, profile.fanLayout, profile.fanSizeMm, profile.fanCount, profile.design]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const c = canvas.getContext("2d")!;
    c.fillStyle = profile.backplateColor;
    c.fillRect(0, 0, 1024, 512);
    for (let y = 0; y < 512; y += 3) {
      c.fillStyle = y % 9 === 0 ? "#ffffff05" : "#00000006";
      c.fillRect(0, y, 1024, 1);
    }
    if (profile.design === "steel-legend-rx9060xt") {
      c.strokeStyle="#b8bfbd"; c.lineWidth=12;
      c.beginPath(); c.moveTo(30,35);c.lineTo(475,35);c.lineTo(580,120);c.lineTo(920,120);c.lineTo(1000,50);c.stroke();
      c.beginPath();c.moveTo(25,470);c.lineTo(450,470);c.lineTo(570,390);c.lineTo(930,390);c.stroke();
      c.lineWidth=17;c.beginPath();c.moveTo(530,175);c.lineTo(610,255);c.lineTo(530,335);c.lineTo(450,255);c.closePath();c.stroke();
      c.fillStyle="#a1aaa8";c.font="700 40px Arial";c.fillText("AMD RADEON",720,260,280);
      c.font="500 24px Arial";c.fillText("ASRock",310,470,150);
    } else {
    c.strokeStyle = "#a5b2b56b";
    c.lineWidth = 3;
    c.strokeRect(16, 16, 992, 480);
    c.beginPath();
    c.moveTo(90, 450); c.lineTo(310, 450); c.lineTo(590, 70); c.lineTo(900, 70); c.stroke();
    c.fillStyle = "#c5cdd0";
    c.font = "600 50px Arial";
    c.fillText(component.brand.toUpperCase(), 100, 245, 560);
    c.fillStyle = "#9ba7ab";
    c.font = "500 21px Arial";
    c.fillText(component.name, 100, 292, 680);
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    return map;
  }, [component.name, component.brand, profile.backplateColor, profile.design]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh
      name="gpu-backplate"
      position={[0, profile.thicknessMm * MM * 0.46, 0]}
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      geometry={geometry}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial attach="material-0" map={texture} metalness={0.35} roughness={0.48} />
      <meshStandardMaterial attach="material-1" color={profile.backplateColor} metalness={0.65} roughness={0.3} />
    </mesh>
  );
}

export function GpuModel({ component, profile }: Props<GpuVisualProfile>) {
  const steelLegend = profile.design === "steel-legend-rx9060xt";
  const length = profile.lengthMm * MM,
    width = profile.heightMm * MM,
    height = profile.thicknessMm * MM;
  const fanRadius = Math.min(
    profile.fanSizeMm * MM * 0.48,
    width * 0.44,
    (length / (profile.fanCount * 2)) * 0.95,
  );
  const fanSpan = profile.fanCount > 1 ? length / 2 - fanRadius - 0.04 : 0;
  const fins = useMemo<BoxInstance[]>(
    () =>
      Array.from({ length: 38 }, (_, i) => ({
        position: [0, 0, -length * 0.46 + (i * length * 0.92) / 37],
        size: [width * 0.93, height * 0.7, 0.009],
      })),
    [length, width, height],
  );
  const sideRails = useMemo<BoxInstance[]>(() => [-1, 1].flatMap(side => [-1, 1].map(edge => ({
    position: [side * width * 0.49, edge * height * 0.32, 0] as Vec3,
    size: [0.035, height * 0.17, length] as Vec3,
  }))), [width, height, length]);
  const faceRails = useMemo<BoxInstance[]>(() => [
    ...[-1, 1].map(side => ({ position: [side * width * 0.46, -height * 0.43, 0] as Vec3,
      size: [width * 0.08, height * 0.17, length] as Vec3 })),
    ...Array.from({ length: Math.max(1, profile.fanCount) + 1 }, (_, i) => ({
      position: [0, -height * 0.43, -length * 0.47 + i * length * 0.94 / Math.max(1, profile.fanCount)] as Vec3,
      size: [width * 0.88, height * 0.17, Math.min(length * 0.035, 0.09)] as Vec3,
    })),
  ], [width, height, length, profile.fanCount]);
  const contacts = useMemo<BoxInstance[]>(() => Array.from({ length: 28 }, (_, i) => ({
    position: [-width * 0.4, height * 0.6, -length * 0.1 - 0.29 + i * 0.0215] as Vec3,
    size: [0.046, 0.075, 0.014] as Vec3,
  })).filter((_, i) => i !== 7), [width, height, length]);
  const screws = useMemo<Vec3[]>(() => [-1, 1].flatMap(side => [-0.43, -0.03, 0.43].map(z =>
    [side * width * 0.39, height * 0.46 + 0.03, z * length] as Vec3)), [width, height, length]);
  const bracket = useMemo<BoxInstance[]>(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        position: [-width * 0.27 + i * width * 0.12, 0, -length * 0.507],
        size: [width * 0.07, height * 0.64, 0.02],
      })),
    [width, height, length],
  );
  const metal = profile.shroudColor;
  const label = /Radeon|\bRX[\s-]*\d/i.test(component.name)
    ? "RADEON RX"
    : /Arc/i.test(component.name)
      ? "intel ARC"
      : /GeForce/i.test(component.name)
        ? (/GTX/i.test(component.name) ? "GEFORCE GTX" : "GEFORCE RTX")
        : component.brand.toUpperCase();
  return (
    <group>
      <MetalBox
        position={[0, height * 0.37, -length * (profile.fanLayout === "flow-through" ? 0.22 : 0.025)]}
        size={[width * 0.88, 0.016, length * (profile.fanLayout === "flow-through" ? 0.5 : 0.9)]}
        color="#26302b"
        finish="pcb"
        metalness={0.08}
        roughness={0.8}
      />
      <MetalBox position={[0, height * 0.26, -length * 0.08]} size={[width * 0.72, 0.035, length * 0.71]} color="#848b89" metalness={0.8} roughness={0.32} />
      <BoxInstances items={fins} color="#687075" finish="brushed" roughness={0.36} />
      <GpuBackplate component={component} profile={profile} />
      <Fasteners positions={screws} axis="y" radius={0.016} color="#818a8b" />
      <BoxInstances items={sideRails} color={metal} finish="paint" metalness={0.3} roughness={0.48} />
      {steelLegend ? <SteelLegendGpuShroud profile={profile} /> : profile.fanCount > 0
        ? <AxialShroud length={length} width={width} height={height} fans={profile.fanCount} radius={fanRadius} span={fanSpan} color={metal} reverseLast={profile.fanLayout === "flow-through"}/>
        : <BoxInstances items={faceRails} color={metal} finish="paint" metalness={0.3} roughness={0.48} />}
      <MetalBox
        position={[width * 0.49, 0, 0]}
        size={[0.035, height * 0.3, length * 0.67]}
        color={metal}
        metalness={0.3}
        roughness={0.48}
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
          bladeColor={steelLegend ? "#d5e9e3" : undefined}
          rgb={profile.rgb && profile.fanRgb === true}
          hubLabel={
            component.brand === "Sapphire"
              ? "S"
              : component.brand === "ASUS"
                ? "ASUS"
                : component.brand === "MSI"
                  ? "MSI"
                  : component.brand === "ASRock" ? "ASRock" : "G"
          }
        />
      ))}
      <HardwareLabel
        text={label}
        position={[width * 0.515, steelLegend ? height * 0.16 : 0, steelLegend ? length * 0.32 : -length * 0.04]}
        width={length * (steelLegend ? 0.25 : 0.59)}
        height={Math.min(0.14, height * 0.43)}
        color={steelLegend ? "#58676b" : profile.rgb ? profile.accent : "#d4d7d9"}
      />
      {profile.rgb && !steelLegend && (
        <RGBStrip
          position={[width * 0.512, -height * 0.31, component.brand === "ASUS" ? -length * 0.32 : -length * 0.1]}
          size={[length * (component.brand === "ASUS" ? 0.17 : 0.62), 0.022, 0.015]}
          rotation={[0, Math.PI / 2, 0]}
          phase={0.1}
        />
      )}
      {component.brand === "Sapphire" && /PULSE/i.test(component.name) && (
        <MetalBox
          position={[width * 0.515, height * 0.28, 0]}
          size={[0.012, 0.022, length * 0.82]}
          color="#b93b41"
          roughness={0.5}
        />
      )}
      <BoxInstances items={contacts} color="#c2a45e" metalness={0.7} roughness={0.32} />
      <MetalBox
        position={[0, 0, -length * 0.51]}
        size={[width * 1.02, height * 1.15, 0.023]}
        color="#8b9195"
      />
      <BoxInstances items={bracket} color="#22282b" />
      <MetalBox
        position={[width * (steelLegend ? .43 : .18), height * (steelLegend ? .35 : .55), -length * (steelLegend ? .02 : .21)]}
        size={[0.19, 0.095, 0.16]}
        color="#14191c"
        metalness={0.1}
      />
      <MetalBox position={[width * (steelLegend ? .43 : .18), height * (steelLegend ? .403 : .603), -length * (steelLegend ? .02 : .21)]} size={[0.155, 0.013, 0.125]} color="#080c0e" roughness={0.85} metalness={0.05} />
      {steelLegend && <BoxInstances items={Array.from({length:8},(_,pin)=>({position:[width*.43+(Math.floor(pin/2)-1.5)*.031,height*.414,-length*.02+(pin%2-.5)*.044] as Vec3,size:[.022,.004,.027] as Vec3}))} color="#667174" metalness={.5}/>}
      {[0, 1, 2].map((port) => <group key={port} position={[width * (0.25 - port * 0.24), -height * 0.12, -length * 0.528]}>
        <MetalBox size={[width * 0.17, height * 0.22, 0.019]} color="#202729" metalness={0.15} />
        <MetalBox position={[0, 0, -0.011]} size={[width * 0.12, height * 0.075, 0.008]} color="#b4ab80" metalness={0.75} />
      </group>)}
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
      {!low && <FanWireClips height={h} width={w} depth={d} fanCount={profile.fanCount}/>}
      <Fasteners positions={[-1,1].flatMap(y=>[-1,1].map(z=>[-h*.425,y*w*.17,z*d*.12] as Vec3))} radius={.013}/>
      {pipePoints.map((points, i) => (
        <Tube
          key={i}
          points={points}
          radius={0.019}
          color={component.id === "cooler-nhd15" ? "#464a4b" : "#b0b1ab"}
        />
      ))}
      {low ? (
        profile.fanCount > 0 && <HardwareFan
          radius={profile.fanSizeMm * MM * 0.48}
          position={[h * 0.2, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          frame
          color={profile.fanColor}
          bladeColor={component.brand === "Noctua" ? (/chromax/i.test(component.name) ? "#252b2d" : "#7d5236") : undefined}
          rgb={profile.fanRgb}
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
          {profile.fanCount > 0 && <HardwareFan
            radius={profile.fanSizeMm * MM * 0.47}
            position={[h * 0.07, 0, d * (profile.fanCount > 1 ? 0.43 : -0.055)]}
            frame
            color={profile.fanColor}
            bladeColor={component.brand === "Noctua" ? (/chromax/i.test(component.name) ? "#252b2d" : "#7d5236") : undefined}
            rgb={profile.fanRgb}
            hubLabel={
              component.brand === "Noctua"
                ? "N"
                : component.brand === "DeepCool"
                  ? "DC"
                  : "TR"
            }
          />}
          {profile.fanCount > 1 && (
            <HardwareFan
              radius={profile.fanSizeMm * MM * 0.47}
              position={[h * 0.07, 0, -d * 0.055]}
              frame
              color={profile.fanColor}
              bladeColor={component.brand === "Noctua" ? (/chromax/i.test(component.name) ? "#252b2d" : "#7d5236") : undefined}
              rgb={profile.fanRgb}
            />
          )}
          {profile.pumpDisplay === "lcd" && <PumpScreen width={Math.min(w, d) * 0.62} position={[h * 0.475, 0, 0]} brand={component.brand} rectangular />}
          {profile.rgb && !profile.fanRgb && [-1, 1].map(side => <RGBStrip key={side} position={[h * 0.469, side * w * .45, 0]} size={[d * .78, .018, .013]} rotation={[0, Math.PI / 2, 0]} phase={side > 0 ? .2 : .65} />)}
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

export function RamModel({
  component,
  profile,
  singleModule = false,
  moduleCapacityGB,
  slotIndex = 0,
  slotLabel,
}: Props<RamVisualProfile> & {
  /** Slot-aware scenes place one module at the actual socket, not a whole kit. */
  singleModule?: boolean;
  moduleCapacityGB?: number | null;
  slotIndex?: number;
  slotLabel?: string;
}) {
  const h = profile.heightMm * MM,
    l = profile.lengthMm * MM,
    t = profile.thicknessMm * MM;
  const count = singleModule ? 1 : Math.max(1, profile.sticks);
  const capacity = moduleCapacityGB ?? (component.capacityGB && component.memorySticks ? component.capacityGB / component.memorySticks : undefined);
  const crucialPro = profile.design === "crucial-pro-overclocking";
  const documentedBare = profile.hasHeatspreader === false;
  const bareModule = documentedBare || (profile.hasHeatspreader === undefined
    && !profile.rgb && /ValueRAM|ValueSelect|Signature Line|Premier|Crucial Basics/i.test(component.name));
  const rgb = profile.rgb && (!documentedBare || component.rgb === true);
  const details = getMemoryDetails(component);
  const pcbGeometry = useMemo(() => {
    const edge = Math.min(h * 0.045, l * 0.009);
    const keyY = -l * 0.43 + (component.memoryType === "DDR5" ? 18 : 16) * l * 0.86 / 35;
    const keyWidth = l * 0.012;
    const shape = new THREE.Shape();
    shape.moveTo(-h * 0.435, -l / 2 + edge);
    shape.lineTo(-h * 0.435, keyY - keyWidth); shape.lineTo(-h * 0.33, keyY - keyWidth);
    shape.lineTo(-h * 0.33, keyY + keyWidth); shape.lineTo(-h * 0.435, keyY + keyWidth);
    shape.lineTo(-h * 0.435, l / 2 - edge); shape.lineTo(-h * 0.435 + edge, l / 2);
    shape.lineTo(h * 0.435 - edge, l / 2); shape.lineTo(h * 0.435, l / 2 - edge);
    shape.lineTo(h * 0.435, -l / 2 + edge); shape.lineTo(h * 0.435 - edge, -l / 2);
    shape.lineTo(-h * 0.435 + edge, -l / 2); shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: Math.min(0.013, t * 0.3), bevelEnabled: false, steps: 1 });
    geometry.translate(0, 0, -Math.min(0.013, t * 0.3) / 2);
    return geometry;
  }, [h, l, t, component.memoryType]);
  useEffect(() => () => pcbGeometry.dispose(), [pcbGeometry]);
  // Contacts and IC packages are schematic details: package count does not
  // assert the physical ranks, die density, or revision of the sold module.
  const contacts = useMemo<BoxInstance[]>(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        position: [-h * 0.46, -l * 0.43 + (i * l * 0.86) / 35, 0] as Vec3,
        size: [0.036, 0.013, Math.min(0.016, t * 0.4)] as Vec3,
      })).filter((_, i) => i !== (component.memoryType === "DDR5" ? 18 : 16)),
    [h, l, t, component.memoryType],
  );
  const chips = useMemo<BoxInstance[]>(() => [-1, 1].flatMap((side) =>
    Array.from({ length: 8 }, (_, i) => ({
      position: [-h * 0.03, -l * 0.36 + i * l * 0.103, side * Math.min(0.012, t * 0.25)] as Vec3,
      size: [h * 0.46, l * 0.072, Math.min(0.01, t * 0.18)] as Vec3,
    }))), [h, l, t]);
  const ridges = useMemo<BoxInstance[]>(() => [-1, 1].flatMap((side) =>
    Array.from({ length: 5 }, (_, i) => ({
      position: [h * 0.08, side * l * (0.31 + i * 0.035), t * 0.505] as Vec3,
      size: [h * 0.64, l * 0.012, t * 0.035] as Vec3,
    }))), [h, l, t]);
  const surfaceParts = useMemo<BoxInstance[]>(() => [-1, 1].flatMap(side =>
    Array.from({ length: 22 }, (_, i) => ({
      position: [i % 2 ? h * 0.31 : -h * 0.34, -l * 0.4 + i * l * 0.038, side * Math.min(0.01, t * 0.19)] as Vec3,
      size: [h * 0.033, l * 0.013, 0.004] as Vec3,
    }))), [h, l, t]);
  const packageMarks = useMemo<BoxInstance[]>(() => [-1, 1].flatMap(side =>
    Array.from({ length: 8 }, (_, i) => ({
      position: [-h * 0.18, -l * 0.38 + i * l * 0.103, side * Math.min(0.019, t * 0.35)] as Vec3,
      size: [0.005, 0.005, 0.002] as Vec3,
    }))), [h, l, t]);
  const family = component.name.split(/ · | \d+\s*(?:Go|GB)/i)[0];
  const capacityText = capacity ? `${new Intl.NumberFormat("fr-FR").format(capacity)} Go` : "";
  const moduleLabel = [capacityText, component.memoryType, details.organization, details.moduleKind,
    details.voltageV ? `${new Intl.NumberFormat("fr-FR").format(details.voltageV)} V` : null].filter(Boolean).join(" · ");
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const index = singleModule ? slotIndex : i;
        const label = slotLabel ?? `DIMM ${index + 1}`;
        return <group
          key={i}
          name={`ram-module-${index}`}
          userData={{ memorySlotIndex: index, memorySlotLabel: label, memoryComponentId: component.id, memoryModuleCapacityGB: capacity,
            memoryHasHeatspreader: !bareModule, memoryPartNumber: details.partNumber, memoryOrganization: details.organization,
            memoryPackageLayout: "schematic" }}
          position={[0, 0, singleModule ? 0 : (i - (count - 1) / 2) * DIMM_SLOT_SPACING]}
        >
          <mesh name="ram-keyed-pcb" geometry={pcbGeometry} castShadow receiveShadow>
            <meshStandardMaterial color={documentedBare ? profile.pcbColor ?? "#2d684d" : bareModule ? "#244b3d" : "#23382e"} metalness={0.08} roughness={0.75} />
          </mesh>
          <BoxInstances items={chips} color="#161d21" roughness={0.76} metalness={0.08} />
          {bareModule && <><BoxInstances items={surfaceParts} color="#a89976" metalness={0.25} roughness={0.6} />
            <BoxInstances items={packageMarks} color="#68716c" metalness={0.05} roughness={0.8} /></>}
          {crucialPro && <CrucialHeatspreader profile={profile} />}
          {!bareModule && !crucialPro && [-1, 1].map((side) => <MetalBox key={side} position={[h * 0.085, 0, side * t * 0.38]} size={[h * 0.76, l * 0.97, t * 0.24]} color={profile.heatspreaderColor} roughness={0.44} bevel={.002} />)}
          <BoxInstances items={contacts} color="#c3a75f" roughness={0.36} />
          {!bareModule && !crucialPro && <BoxInstances items={ridges} color={profile.heatspreaderColor} roughness={0.24} />}
          {rgb ? <RGBStrip position={[h * 0.51, 0, 0]} size={[l * 0.91, 0.034, t * 0.98]} rotation={[0, 0, Math.PI / 2]} phase={index * 0.13} /> :
            !bareModule && !crucialPro && <MetalBox position={[h * 0.47, 0, 0]} size={[0.022, l * 0.91, t * 0.94]} color={profile.heatspreaderColor} roughness={0.45} />}
          {!bareModule && !crucialPro && <HardwareLabel
            text={component.brand.toUpperCase()}
            position={[h * (profile.rgb ? 0.534 : 0.503), 0, 0]}
            rotation={[0, Math.PI / 2, Math.PI / 2]}
            width={l * 0.55}
            height={0.075}
            color={profile.rgb ? "#334b47" : "#b6bdc0"}
          />}
          {!crucialPro && <HardwareLabel
            text={documentedBare ? [component.brand.toUpperCase(), details.partNumber].filter(Boolean).join(" ") : family.toUpperCase()}
            subtext={documentedBare ? moduleLabel : [component.memoryType, capacityText].filter(Boolean).join(" · ")}
            position={[h * 0.04, 0, bareModule ? Math.min(0.019, t * 0.4) : t * 0.527]}
            rotation={[0, 0, Math.PI / 2]}
            width={l * 0.64}
            height={h * 0.31}
            color={documentedBare ? "#263632" : bareModule ? "#d4dec9" : "#aeb9ba"}
            background={documentedBare ? "#f2f3e9" : bareModule ? "#24382a" : undefined}
          />}
        </group>;
      })}
    </group>
  );
}

export function CpuModel({ component, profile }: Props<CpuVisualProfile>) {
  const w = profile.widthMm * MM,
    h = profile.heightMm * MM,
    d = profile.depthMm * MM;
  const am5 = profile.socket === "AM5";
  const nickel=useHardwareSurface("brushed");
  const heatspreader = useMemo(() => {
    const outline = new THREE.Shape();
    const points = [
      [-.28, -.43], [.28, -.43], [.28, -.34], [.43, -.34], [.43, -.18],
      [.34, -.18], [.34, .18], [.43, .18], [.43, .34], [.28, .34],
      [.28, .43], [-.28, .43], [-.28, .34], [-.43, .34], [-.43, .18],
      [-.34, .18], [-.34, -.18], [-.43, -.18], [-.43, -.34], [-.28, -.34],
    ];
    points.forEach(([x, y], index) => index ? outline.lineTo(x * w, y * h) : outline.moveTo(x * w, y * h));
    outline.closePath();
    return new THREE.ExtrudeGeometry(outline, { depth: d * .69, bevelEnabled: true, bevelSize: .002, bevelThickness: .002, bevelSegments: 1, steps: 1 });
  }, [w, h, d]);
  useEffect(() => () => heatspreader.dispose(), [heatspreader]);
  const capacitors = useMemo<BoxInstance[]>(() => [-1, 1].flatMap(side =>
    Array.from({ length: 5 }, (_, i) => ({ position: [-d * .015, side * h * .43, (i - 2) * w * .13] as Vec3, size: [d * .19, h * .025, w * .065] as Vec3 }))), [w, h, d]);
  return (
    <group>
      <CpuContactField width={w} height={h} depth={d} pins={profile.socket === "AM4"}/>
      <MetalBox
        position={[-d * 0.3, 0, 0]}
        size={[d * 0.45, h, w]}
        color={component.brand === "Intel" ? "#354b44" : "#243b2c"}
        roughness={0.72}
        metalness={0.12}
      />
      {am5 ? <mesh geometry={heatspreader} position={[-d * .23, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <meshStandardMaterial color="#bfc6c5" metalness={.82} roughness={.31} roughnessMap={nickel?.texture} bumpMap={nickel?.texture} bumpScale={.0006} envMapIntensity={1.1}/>
      </mesh> : <MetalBox position={[d * 0.12, 0, 0]} size={[d * 0.76, h * 0.84, w * 0.84]} color="#bfc4c5" roughness={0.31} metalness={0.82} finish="brushed" bevel={.004} />}
      <BoxInstances items={capacitors} color="#b5a974" metalness={0.45} roughness={0.6} />
      <HardwareLabel
        text={component.brand === "AMD" ? "AMD RYZEN" : "intel CORE"}
        subtext={component.name.replace("Ryzen ", "").replace("Core ", "")}
        position={[d * 0.52, 0, 0]}
        width={w * 0.75}
        height={h * 0.48}
        color="#343b3d"
      />
      {am5 &&
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
  const samsung9100 = profile.design === "samsung-9100-pro" && !profile.hasHeatsink;
  const w = profile.widthMm * MM,
    l = profile.lengthMm * MM,
    h = profile.heightMm * MM;
  const contactFingers = useMemo<BoxInstance[]>(() =>
    Array.from({ length: 15 }, (_, i) => ({
      position: [0.009, -w * 0.39 + i * w * 0.055, l * 0.46] as Vec3,
      size: [0.004, w * 0.035, 0.065] as Vec3,
    })).filter(finger => finger.position[1] + finger.size[1] / 2 <= -w * .34 || finger.position[1] - finger.size[1] / 2 >= -w * .2), [w, l]);
  const fins = useMemo<BoxInstance[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({
      position: [h * 0.18, -w * 0.42 + i * w * 0.14, -l * 0.04] as Vec3,
      size: [h * 0.62, w * 0.06, l * 0.86] as Vec3,
    })), [h, w, l]);
  const surfaceX = profile.hasHeatsink ? h * 0.51 : h * 0.25 + 0.013;
  return (
    <group>
      <M2Board width={w} length={l} thickness={Math.min(h*.5,.016)} color="#222f2a"/>
      {!profile.hasHeatsink && !samsung9100 && <CircuitPackages width={w} length={l}/>}
      {samsung9100 ? <Samsung9100Surface profile={profile} /> : profile.hasHeatsink ? (
        <>
          <MetalBox
            position={[-h * 0.1, 0, -l * 0.04]}
            size={[h * 0.22, w * 0.95, l * 0.86]}
            color={profile.color}
          />
          <BoxInstances items={fins} color={profile.color} roughness={0.35} />
        </>
      ) : (
        <>
          <MetalBox
            position={[h * 0.25, 0, -l * 0.14]}
            size={[0.022, w * 0.79, l * 0.67]}
            color={profile.labelColor}
            roughness={0.58}
            metalness={0.1}
          />
          <MetalBox position={[0.014, 0, l * 0.28]} size={[0.018, w * 0.64, l * 0.13]} color="#11171a" roughness={0.8} />
        </>
      )}
      <BoxInstances items={contactFingers} color="#c2a45b" roughness={0.3} />
      {!samsung9100 && <HardwareLabel
        text={component.brand.toUpperCase()}
        subtext={component.name}
        position={[surfaceX, 0, -l * 0.14]}
        width={l * 0.6}
        height={w * 0.7}
        color="#e2e4e3"
      />}
      <mesh position={[0.012, 0, -l * 0.5]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[0.0145, 0.026, 20, 1, Math.PI/2, Math.PI]} />
        <meshStandardMaterial color="#9b9990" metalness={0.7} />
      </mesh>
    </group>
  );
}

export function PsuModel({ component, profile }: Props<PsuVisualProfile>) {
  const powerZone = profile.design === "power-zone-2";
  const w = profile.widthMm * MM,
    h = profile.heightMm * MM,
    d = profile.depthMm * MM;
  const wiring = component.specs.join(" ");
  const fixedWiring = /non[\s-]*modulaire|câbles fixes/i.test(wiring);
  const semiModular = /semi[\s-]*modulaire/i.test(wiring);
  const knownModular = !fixedWiring && /modulaire/i.test(wiring);
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
      Array.from({ length: knownModular ? semiModular ? 4 : 8 : 0 }, (_, i) => ({
        position: [
          -w * 0.32 + (i % 4) * w * 0.22,
          -h * 0.19 + Math.floor(i / 4) * h * 0.39,
          d * 0.509,
        ],
        size: [w * (powerZone && i === 7 ? 0.21 : powerZone && i > 4 ? 0.12 : 0.15), h * (powerZone && i < 2 ? 0.18 : 0.24), 0.026],
      })),
    [w, h, d, knownModular, semiModular, powerZone],
  );
  const fixedBundles = useMemo<Vec3[][]>(() => Array.from({ length: 4 }, (_, i) => [
    [-w * 0.32 + i * 0.026, -h * 0.3, d * 0.51],
    [-w * 0.31 + i * 0.026, -h * 0.3, d * 0.58 + 0.06],
    [-w * 0.23 + i * 0.026, -h * 0.2, d * 0.6 + 0.13],
    [-w * 0.16 + i * 0.026, -h * 0.08, d * 0.6 + 0.15],
  ] as Vec3[]), [w, h, d]);
  return (
    <group>
      {powerZone ? <group name="power-zone-2-open-shell">
        <MetalBox position={[0,-h*.49,0]} size={[w,.02,d]} color={profile.color} roughness={.55}/>
        {[-1,1].map(side=><group key={side}>
          <MetalBox position={[side*w*.49,0,0]} size={[.02,h,d]} color={profile.color} roughness={.55}/>
          <MetalBox position={[0,0,side*d*.49]} size={[w,h,.02]} color={profile.color} roughness={.55}/>
          <MetalBox position={[side*w*.465,h*.495,0]} size={[w*.07,.015,d]} color={profile.color}/>
          <MetalBox position={[0,h*.495,side*d*.465]} size={[w,.015,d*.07]} color={profile.color}/>
        </group>)}
      </group> : <VentilatedPsuShell width={w} height={h} depth={d} color={profile.color}/>}
      {component.fanCount !== 0 && <group position={[0, h * 0.505, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 0.12]}>
        <HardwareFan
          radius={Math.min(profile.fanSizeMm * MM * 0.45, w * 0.42, d * 0.42)}
          color="#15191c"
        />
      </group>}
      {powerZone ? <PowerZoneGrille profile={profile}/> : <BoxInstances items={grille} color="#5e6368" metalness={0.7} />}
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
      {plugs.length > 0 && <BoxInstances items={plugs} color="#070b0d" finish="plastic" metalness={0.05} />}
      {powerZone && plugs.map((plug,index)=><group key={index} name="power-zone-modular-socket" position={plug.position}>
        <BoxInstances items={Array.from({length:index === 7 ? 18 : index < 2 ? 5 : 8},(_,pin)=>({position:[(Math.floor(pin/2)-(index===7?4:index<2?1:1.5))*.025,(pin%2-.5)*.026,.015] as Vec3,size:[.015,.018,.007] as Vec3}))} color="#5e6566" roughness={.55}/>
      </group>)}
      {(fixedWiring || semiModular) && <>
        <MetalBox position={[-w * 0.28, -h * 0.3, d * 0.507]} size={[w * 0.19, h * 0.16, 0.025]} color="#141a1c" finish="plastic" metalness={0.02} roughness={0.85} />
        {fixedBundles.map((points, i) => <Tube key={i} points={points} radius={0.016} color="#20282c" finish="plastic" />)}
      </>}
      <MetalBox
        position={[-w * 0.2, -h * 0.12, -d * 0.51]}
        size={[w * 0.31, h * 0.3, 0.03]}
        color="#0b0e12"
        metalness={0.1}
      />
      <BoxInstances items={[-1,0,1].map(i=>({position:[-w*.2+i*w*.07,-h*.12+(i===0?h*.06:-h*.035),-d*.53] as Vec3,size:[w*.018,h*.07,.015] as Vec3}))} color="#b8bcb5" metalness={.8}/>
      <MetalBox
        position={[w * 0.21, -h * 0.12, -d * 0.52]}
        size={[w * 0.12, h * 0.22, 0.04]}
        color="#12171b"
        metalness={0.1}
      />
    </group>
  );
}

function PumpScreen({ width, position, brand, rectangular = false }: { width: number; position: Vec3; brand: string; rectangular?: boolean }) {
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
    const screenColor = ctx.createLinearGradient(0, 0, 512, 512);
    screenColor.addColorStop(0, "#78e0ef");
    screenColor.addColorStop(0.5, "#758bff");
    screenColor.addColorStop(1, "#ca76e1");
    ctx.lineWidth = 12;
    ctx.strokeStyle = screenColor;
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
    ctx.fillText(brand.toUpperCase(), 256, 232, 370);
    ctx.fillStyle = "#88a9b4";
    ctx.font = "500 22px Arial";
    ctx.fillText(rectangular ? "D I G I T A L   C O O L I N G" : "L I Q U I D   C O O L I N G", 256, 302, 360);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    return map;
  }, [brand, rectangular]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={position} rotation={[0, Math.PI / 2, 0]}>
      {rectangular ? <planeGeometry args={[width * 1.3, width]} /> : <circleGeometry args={[width / 2, 48]} />}
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/** Ribbed collar detail stays in the material so each fitting costs one mesh. */
function HoseFitting({ position }: { position: Vec3 }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const c = canvas.getContext("2d")!;
    c.fillStyle = "#4d565a";
    c.fillRect(0, 0, 64, 64);
    for (let y = 5; y < 64; y += 12) {
      c.fillStyle = "#252d31"; c.fillRect(0, y, 64, 3);
      c.fillStyle = "#657175"; c.fillRect(0, y + 3, 64, 2);
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.058, 0.058, 0.11, 24]} />
        <meshStandardMaterial map={texture} bumpMap={texture} bumpScale={0.0015} metalness={0.6} roughness={0.4} />
      </mesh>
      {[-1, 1].map(side => <mesh key={side} position={[0, 0, side * 0.045]}>
        <torusGeometry args={[0.056, 0.005, 8, 24]} />
        <meshStandardMaterial color="#6b7376" metalness={0.75} roughness={0.32} />
      </mesh>)}
    </group>
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
    ctx.strokeStyle = new THREE.Color(color).getHSL({ h: 0, s: 0, l: 0 }).l > 0.55 ? "#a7afb4" : "#556069";
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
        64,
        0.043,
        16,
        false,
      ),
    [points],
  );
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial map={texture} bumpMap={texture} bumpScale={0.0013} roughness={0.84} metalness={0.04} />
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
      Array.from({ length: 73 }, (_, i) => ({
        position: [0, 0, -length * 0.43 + (i * length * 0.86) / 72],
        size: [width * 0.83, thickness * 0.68, 0.006],
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
  const waterways = useMemo<BoxInstance[]>(() => Array.from({ length: 9 }, (_, i) => ({
    position: [-width * 0.39 + i * width * 0.0975, 0, 0] as Vec3,
    size: [width * 0.023, thickness * 0.72, length * 0.89] as Vec3,
  })), [width, thickness, length]);
  const radiatorBolts = useMemo<Vec3[]>(() => Array.from({ length: profile.fanCount }, (_, i) =>
    [-1, 1].flatMap(x => [-1, 1].map(z => [
      x * fanDistance * 0.41, thickness * 0.51,
      (i - (profile.fanCount - 1) / 2) * fanDistance + z * fanDistance * 0.41,
    ] as Vec3))).flat(), [profile.fanCount, fanDistance, thickness]);
  const pumpBolts = useMemo<Vec3[]>(() => [-1, 1].flatMap(y => [-1, 1].map(z =>
    [-pumpDepth * 0.32, y * pumpWidth * 0.4, z * pumpHeight * 0.4] as Vec3)), [pumpDepth, pumpWidth, pumpHeight]);
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
      <group name="aio-radiator-core" position={radiatorPosition} rotation={rotation}>
        {/* An open fin core replaces the solid box, including the top face.
            Tube/fin segmentation is illustrative, never a technical tube count. */}
        <BoxInstances
          items={fins}
          color={profile.finColor}
          finish="brushed"
          metalness={0.45}
          roughness={0.49}
        />
        <BoxInstances items={waterways} color={profile.finColor} finish="brushed" metalness={0.48} roughness={0.45} />
        <BoxInstances items={rails} color={profile.color} finish="paint" metalness={0.22} roughness={0.52} />
        <Fasteners positions={radiatorBolts} axis="y" radius={0.018} color="#6c7477" />
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
            bladeColor={component.brand === "Noctua" ? (/chromax/i.test(component.name) ? "#252b2d" : "#7d5236") : undefined}
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
          <HoseFitting key={side} position={[side * width * 0.22, -thickness * 0.1, length * 0.51]} />
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
        <Fasteners positions={pumpBolts} radius={0.023} color="#aeb8bc" />
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
        {rounded && <mesh position={[face - 0.012, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[radius * 0.96, 0.008, 8, 56]} />
          <meshStandardMaterial color="#747b7d" metalness={0.72} roughness={0.28} />
        </mesh>}
        {profile.pumpDisplay === "lcd" ? (
          <PumpScreen width={radius * 1.83} position={[face + 0.005, 0, 0]} brand={component.brand} />
        ) : (
          <>
            {profile.pumpDisplay === "rgb-ring" && (
              <>
                {[-1, 1].map((side) => (
                  <group key={side}>
                    <RGBStrip position={[face, side * pumpWidth * 0.42, 0]} size={[pumpHeight * 0.86, 0.025, 0.018]} rotation={[0, Math.PI / 2, 0]} phase={side > 0 ? 0.1 : 0.6} />
                    <RGBStrip position={[face, 0, side * pumpHeight * 0.42]} size={[pumpWidth * 0.86, 0.018, 0.025]} rotation={[0, 0, Math.PI / 2]} phase={side > 0 ? 0.35 : 0.85} />
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
                            color={i === 1 ? "#80d9ed" : "#ad88ed"}
                            emissive={i === 1 ? "#4895a7" : "#6a4a96"}
                          />
                          <MetalBox
                            position={[
                              face + 0.002,
                              0,
                              side * pumpHeight * (0.35 - i * 0.07),
                            ]}
                            size={[0.008, pumpWidth * (0.7 - i * 0.14), 0.009]}
                            color={i === 1 ? "#80d9ed" : "#ad88ed"}
                            emissive={i === 1 ? "#4895a7" : "#6a4a96"}
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
          <HoseFitting key={side} position={[pumpDepth * 0.06, side * pumpWidth * 0.2, pumpHeight * 0.51]} />
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
