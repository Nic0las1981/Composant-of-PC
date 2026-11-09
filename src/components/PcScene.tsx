import {
  Component as ReactComponent,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import {
  categories,
  getComponent,
  defaultSelection,
  type CategoryId,
  type Component,
} from "../data/catalog";
import {
  MM,
  getCaseProfile,
  getBoardProfile,
  getCpuProfile,
  getGpuProfile,
  getCoolerProfile,
  getRamProfile,
  getPsuProfile,
  getStorageProfile,
  type CaseVisualProfile,
  type BoardVisualProfile,
  type RamVisualProfile,
} from "../data/visualProfiles";
import CaseModel from "./scene/CaseModel";
import {
  MotherboardModel,
  CpuModel,
  GpuModel,
  CoolerModel,
  RamModel,
  PsuModel,
  StorageModel,
  getBoardAnchors,
  getDimmSlotPosition,
  getDimmSlotLabel,
  DIMM_SLOT_SPACING,
  AioCoolingModel,
} from "./scene/HardwareModels";
import ProductArt from "./ProductArt";
import type { MemoryAnalysis } from "../lib/memory";
import { getMemoryDetails } from "../lib/memoryDetails";
import { SceneAnimationProvider, useSceneAnimation } from "./scene/SceneAnimation";
import { HardwareSurfaceProvider } from "./scene/HardwarePrimitives";

export type CameraView = "perspective" | "side" | "front";
type V3 = [number, number, number];
type SelectedComponents = Partial<Record<CategoryId, Component | undefined>>;
export interface PcSceneProps {
  components: SelectedComponents;
  memory?: MemoryAnalysis;
  exploded?: boolean;
  paused?: boolean;
  animated?: boolean;
  openSide?: boolean;
  cameraView?: CameraView;
  activeCategory?: CategoryId | null;
  onSelectCategory?: (id: CategoryId) => void;
  resetKey?: number;
  className?: string;
}
type Hover = { category: CategoryId; x: number; y: number; slotIndex?: number; slotLabel?: string; componentId?: string; moduleCapacityGB?: number };
type SceneRamModule = { index: number; label: string; component: Component; profile: RamVisualProfile; capacityGB: number | null };

/** The drawing is bounded by real board sockets; surplus configured sticks stay in the analysis. */
function getSceneRamModules(components: SelectedComponents, board: BoardVisualProfile, memory?: MemoryAnalysis): SceneRamModule[] {
  if (memory) return memory.slots.flatMap((slot) => {
    const profile = slot.component?.category === "ram" ? getRamProfile(slot.component) : undefined;
    return slot.supported && slot.index >= 0 && slot.index < board.slots && slot.component && profile
      ? [{ index: slot.index, label: slot.label, component: slot.component, profile, capacityGB: slot.capacityGB }]
      : [];
  });
  const component = components.ram;
  const profile = getRamProfile(component);
  if (!component || !profile) return [];
  const quantity = Math.max(0, Math.min(board.slots, Math.floor(component.memorySticks ?? profile.sticks)));
  const preferred = board.slots === 4 ? [1, 3, 0, 2] : Array.from({ length: board.slots }, (_, index) => index);
  return preferred.slice(0, quantity).sort((a, b) => a - b).map((index) => ({
    index, label: getDimmSlotLabel(board.slots, index), component, profile,
    capacityGB: component.capacityGB && component.memorySticks ? component.capacityGB / component.memorySticks : null,
  }));
}
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const noRaycast = () => {};

function Highlight({ size }: { size: V3 }) {
  const box = useMemo(
    () =>
      new THREE.BoxGeometry(size[0] + 0.025, size[1] + 0.025, size[2] + 0.025),
    [size[0], size[1], size[2]],
  );
  useEffect(() => () => box.dispose(), [box]);
  return (
    <lineSegments raycast={noRaycast}>
      <edgesGeometry args={[box]} />
      <lineBasicMaterial
        color="#bef58c"
        transparent
        opacity={0.48}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function Part({
  id,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  offset = [0, 0, 0],
  exploded,
  highlight,
  highlightSlot,
  selected,
  subdued,
  modelKey,
  size,
  onHover,
  onSelect,
  children,
}: {
  id: CategoryId;
  position?: V3;
  rotation?: V3;
  offset?: V3;
  exploded?: boolean;
  highlight: boolean;
  highlightSlot?: number | null;
  selected: boolean;
  subdued: boolean;
  modelKey: string;
  size?: V3;
  onHover: (id: CategoryId | null, event?: ThreeEvent<PointerEvent>) => void;
  onSelect?: (id: CategoryId) => void;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const animated = useSceneAnimation();
  const intensity = useRef({ highlight: 0, subdued: 0 });
  const highlightedSlot = useRef(highlightSlot);
  highlightedSlot.current = highlightSlot;
  // Tint each real surface only while it is being drawn. This also works for
  // instanced fan blades and AIO tubing, and preserves animated RGB materials.
  useLayoutEffect(() => {
    if (!ref.current) return;
    const restores: Array<() => void> = [];
    const accent = new THREE.Color("#c6f8ae");
    ref.current.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const before = object.onBeforeRender;
      const after = object.onAfterRender;
      let ancestor: THREE.Object3D | null = object;
      while (ancestor && ancestor !== ref.current && ancestor.userData.memorySlotIndex === undefined) ancestor = ancestor.parent;
      const moduleIndex = ancestor?.userData.memorySlotIndex as number | undefined;
      type LitMaterial = THREE.Material & { color?: THREE.Color; emissive?: THREE.Color; emissiveIntensity?: number };
      const snapshots = new Map<THREE.Material, { color?: THREE.Color; emissive?: THREE.Color; emissiveIntensity?: number; active: boolean }>();
      object.onBeforeRender = function (...args) {
        before.apply(this, args);
        const material = args[4] as LitMaterial;
        const matchingModule = highlightedSlot.current == null || moduleIndex == null || moduleIndex === highlightedSlot.current;
        const amount = matchingModule ? intensity.current.highlight : 0;
        const dim = intensity.current.subdued + (matchingModule ? 0 : intensity.current.highlight * 0.7);
        if (amount < 0.001 && dim < 0.001) return;
        let snapshot = snapshots.get(material);
        if (!snapshot) {
          snapshot = { color: material.color?.clone(), emissive: material.emissive?.clone(), emissiveIntensity: material.emissiveIntensity, active: false };
          snapshots.set(material, snapshot);
        }
        snapshot.active = true;
        snapshot.color?.copy(material.color!);
        snapshot.emissive?.copy(material.emissive!);
        snapshot.emissiveIntensity = material.emissiveIntensity;
        if (material.color) material.color.multiplyScalar(1 - dim * 0.24).lerp(accent, amount * 0.19);
        if (material.emissive) {
          // Preserve the RGB hue underneath a modest, clearly visible hover glow.
          material.emissive.lerp(accent, amount * 0.3);
          material.emissiveIntensity = (material.emissiveIntensity ?? 0) * (1 - dim * 0.22) + amount * 0.65;
        }
      };
      object.onAfterRender = function (...args) {
        const material = args[4] as LitMaterial;
        const snapshot = snapshots.get(material);
        if (snapshot?.active) {
          if (snapshot.color) material.color?.copy(snapshot.color);
          if (snapshot.emissive) material.emissive?.copy(snapshot.emissive);
          if (snapshot.emissiveIntensity !== undefined) material.emissiveIntensity = snapshot.emissiveIntensity;
          snapshot.active = false;
        }
        after.apply(this, args);
      };
      restores.push(() => { object.onBeforeRender = before; object.onAfterRender = after; });
    });
    return () => restores.forEach((restore) => restore());
  }, [modelKey, exploded]);
  const target = useMemo(
    () => new THREE.Vector3(...(exploded ? add(position, offset) : position)),
    [...position, ...offset, exploded],
  );
  useFrame((_, dt) => {
    if (ref.current) {
      const fade = animated ? 1 - Math.exp(-Math.min(dt, 0.1) * 11) : 1;
      if (!animated) ref.current.position.copy(target);
      else ref.current.position.lerp(target, 1 - Math.exp(-Math.min(dt, 0.1) * 8));
      intensity.current.highlight = THREE.MathUtils.lerp(intensity.current.highlight, highlight ? 1 : 0, fade);
      intensity.current.subdued = THREE.MathUtils.lerp(intensity.current.subdued, subdued ? 1 : 0, fade);
      ref.current.userData.hoverStrength = intensity.current.highlight;
    }
  });
  const hover = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(id, e);
  };
  return (
    <group
      name={`component-${id}`}
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={hover}
      onPointerMove={hover}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
    >
      {children}
      {selected && !highlight && !subdued && size && <Highlight size={size} />}
    </group>
  );
}

function Cable({ from, to }: { from: V3; to: V3 }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(...from),
        new THREE.Vector3(from[0] + 0.15, from[1] - 0.14, from[2] + 0.1),
        new THREE.Vector3(to[0] + 0.2, to[1] + 0.3, to[2]),
        new THREE.Vector3(...to),
      ]),
    [...from, ...to],
  );
  return (
    <mesh raycast={noRaycast}>
      <tubeGeometry args={[curve, 24, 0.025, 7, false]} />
      <meshStandardMaterial color="#21272b" roughness={0.88} />
    </mesh>
  );
}

function Assembly({
  components,
  exploded,
  openSide,
  activeCategory,
  hovered,
  hoveredSlot,
  ramModules,
  onHover,
  onSelectCategory,
  caseProfile,
}: PcSceneProps & {
  caseProfile: CaseVisualProfile;
  hovered: CategoryId | null;
  hoveredSlot: number | null;
  ramModules: SceneRamModule[];
  onHover: (id: CategoryId | null, event?: ThreeEvent<PointerEvent>) => void;
}) {
  const p = caseProfile;
  const w = p.widthMm * MM,
    h = p.heightMm * MM,
    d = p.depthMm * MM;
  const sandwich = p.kind === "sandwich",
    panoramic = p.kind === "panoramic";
  const board =
    getBoardProfile(components.motherboard) ||
    getBoardProfile(sandwich ? "mb-a620i" : "mb-b650")!;
  const cpu = getCpuProfile(components.cpu),
    gpu = getGpuProfile(components.gpu),
    cooler = getCoolerProfile(components.cooler),
    psu = getPsuProfile(components.psu),
    ssd = getStorageProfile(components.storage);
  const boardPosition: V3 = [
    sandwich ? -0.015 : panoramic ? -0.32 : -w / 2 + 0.13,
    h / 2 - (sandwich ? 0.12 : 0.27) - (board.heightMm * MM) / 2,
    -d / 2 + 0.16 + (board.widthMm * MM) / 2,
  ];
  const anchors = getBoardAnchors(board);
  const cpuPosition = add(boardPosition, anchors.cpu);
  const coolerPosition = add(cpuPosition, [
    cooler ? (cooler.heightMm * MM) / 2 : 0.5,
    0,
    0,
  ]);
  const memoryKey = ramModules.map((slot) => `${slot.index}:${slot.component.id}:${slot.capacityGB}`).join("|");
  const ramHeight = Math.max(0.25, ...ramModules.map(({ profile }) => profile.heightMm * MM));
  const ramLength = Math.max(1.06, ...ramModules.map(({ profile }) => profile.lengthMm * MM));
  const ramPosition = add(add(boardPosition, anchors.ram), [ramHeight / 2, 0, 0]);
  const gpuPosition: V3 = sandwich
    ? [
        -(((gpu?.thicknessMm || 50) * MM) / 2) - 0.08,
        0,
        -d / 2 + 0.13 + ((gpu?.lengthMm || 267) * MM) / 2,
      ]
    : [
        boardPosition[0] + ((gpu?.heightMm || 134) * MM) / 2 + 0.035,
        boardPosition[1] - board.heightMm * MM * 0.28,
        -d / 2 + 0.18 + ((gpu?.lengthMm || 267) * MM) / 2,
      ];
  const psuPosition: V3 = sandwich
    ? [0, -0.04, d / 2 - ((psu?.depthMm || 100) * MM) / 2 - 0.12]
    : panoramic
      ? [
          -w / 2 + ((psu?.heightMm || 86) * MM) / 2 + 0.06,
          -h / 2 + ((psu?.widthMm || 150) * MM) / 2 + 0.13,
          -d / 2 + ((psu?.depthMm || 140) * MM) / 2 + 0.13,
        ]
      : [
          0,
          -h / 2 + ((psu?.heightMm || 86) * MM) / 2 + 0.13,
          -d / 2 + ((psu?.depthMm || 140) * MM) / 2 + 0.12,
        ];
  const aio = cooler?.kind === "aio";
  const size =
    components.cooler?.radiatorSizeMm || cooler?.radiatorSizeMm || 240;
  const support = components.case?.radiatorSupport;
  const mount: "top" | "front" | "side" = support?.top?.includes(size)
    ? "top"
    : support?.front?.includes(size)
      ? "front"
      : support?.side?.includes(size)
        ? "side"
        : "top";
  const radiatorPosition: V3 =
    mount === "top"
      ? [panoramic ? 0.35 : 0, h / 2 - 0.23, -0.08]
      : mount === "front"
        ? [0, 0.08, d / 2 - 0.21]
        : [boardPosition[0] + 0.13, 0.08, d / 2 - 0.55];
  const props = (id: CategoryId, position: V3, offset: V3, bounds?: V3) => ({
    id,
    position,
    offset,
    size: bounds,
    exploded,
    highlight: hovered === id,
    selected: activeCategory === id,
    subdued: hovered !== null && hovered !== id,
    modelKey: `${components[id]?.id}-${components.case?.id}-${components.cooler?.id}-${openSide}`,

    onHover,
    onSelect: onSelectCategory,
  });
  return (
    <group>
      {components.case && (
        <Part {...props("case", [0, 0, 0], [0, 0, 0])}>
          <CaseModel
            profile={p}
            openSide={openSide}
            exploded={exploded}
            occupiedMount={aio ? mount : undefined}
          />
        </Part>
      )}
      {components.motherboard && (
        <Part
          {...props(
            "motherboard",
            boardPosition,
            [-0.8, 0.1, -0.2],
            [0.08, board.heightMm * MM, board.widthMm * MM],
          )}
        >
          <MotherboardModel
            component={components.motherboard}
            profile={board}
          />
        </Part>
      )}
      {components.cpu && cpu && (
        <Part
          {...props(
            "cpu",
            cpuPosition,
            [0.85, 0.45, -0.2],
            [cpu.depthMm * MM, cpu.heightMm * MM, cpu.widthMm * MM],
          )}
        >
          <CpuModel component={components.cpu} profile={cpu} />
        </Part>
      )}
      {components.gpu && gpu && (
        <Part
          {...props(
            "gpu",
            gpuPosition,
            [0.9, -0.45, 0.65],
            [gpu.heightMm * MM, gpu.thicknessMm * MM, gpu.lengthMm * MM],
          )}
          rotation={sandwich ? [0, 0, Math.PI / 2] : [0, 0, 0]}
        >
          <GpuModel component={components.gpu} profile={gpu} />
        </Part>
      )}
      {components.cooler &&
        cooler &&
        (aio ? (
          <Part {...props("cooler", [0, 0, 0], [0.7, 0.65, 0])}>
            <AioCoolingModel
              component={components.cooler}
              profile={cooler}
              pumpPosition={add(cpuPosition, [
                (cooler.heightMm * MM) / 2 + 0.025,
                0,
                0,
              ])}
              radiatorPosition={radiatorPosition}
              mount={mount}
            />
          </Part>
        ) : (
          <Part
            {...props(
              "cooler",
              coolerPosition,
              [1.35, 0.95, 0.05],
              [cooler.heightMm * MM, cooler.widthMm * MM, cooler.depthMm * MM],
            )}
          >
            <CoolerModel component={components.cooler} profile={cooler} />
          </Part>
        ))}
      {ramModules.length > 0 && (
        <Part
          {...props("ram", ramPosition, [1.05, 0.1, 1.1], [ramHeight + 0.04, ramLength, Math.max(0.07, (board.slots - 1) * DIMM_SLOT_SPACING + 0.06)])}
          modelKey={`${memoryKey}-${board.id}-${openSide}`}
          highlightSlot={hoveredSlot}
        >
          {ramModules.map((slot) => {
            const socket = getDimmSlotPosition(board, slot.index);
            return <group key={`${slot.index}-${slot.component.id}`} position={[
              socket[0] - anchors.ram[0] + (slot.profile.heightMm * MM - ramHeight) / 2,
              socket[1] - anchors.ram[1],
              socket[2] - anchors.ram[2],
            ]}>
              <RamModel component={slot.component} profile={slot.profile} singleModule moduleCapacityGB={slot.capacityGB} slotIndex={slot.index} slotLabel={slot.label} />
            </group>;
          })}
        </Part>
      )}
      {components.storage && ssd && (
        <Part
          {...props(
            "storage",
            add(boardPosition, anchors.storage),
            [1.1, -0.05, -0.7],
            [0.045, ssd.widthMm * MM, ssd.lengthMm * MM],
          )}
        >
          <StorageModel component={components.storage} profile={ssd} />
        </Part>
      )}
      {components.psu && psu && (
        <Part
          {...props(
            "psu",
            psuPosition,
            [0.3, -0.6, -0.6],
            [psu.widthMm * MM, psu.heightMm * MM, psu.depthMm * MM],
          )}
          rotation={panoramic ? [0, 0, Math.PI / 2] : [0, 0, 0]}
        >
          <PsuModel component={components.psu} profile={psu} />
        </Part>
      )}
      {!exploded && components.psu && components.gpu && (
        <Cable
          from={add(gpuPosition, [
            ((gpu?.heightMm || 134) * MM) / 2,
            0.05,
            0.25,
          ])}
          to={add(psuPosition, [0.1, 0.3, 0.35])}
        />
      )}
    </group>
  );
}

type MotionReport = { state: string; animated: boolean; cameraAngle: number; fanAngle?: number; rgbPhase?: number; hoverStrength: number };

function CameraRig({
  profile,
  view = "perspective",
  resetKey,
  exploded,
  hovered,
  onDrag,
  reportMotion,
}: {
  profile: CaseVisualProfile;
  view?: CameraView;
  resetKey?: number;
  exploded?: boolean;
  hovered: CategoryId | null;
  onDrag: (active: boolean) => void;
  reportMotion: (report: MotionReport) => void;
}) {
  const { camera, size, scene } = useThree();
  const animated = useSceneAnimation();
  const controls = useRef<OrbitControlsImpl>(null);
  const destination = useRef<THREE.Vector3 | null>(null);
  const dragging = useRef(false);
  const resumeAt = useRef(0);
  const lastReport = useRef(0);
  const speed = useRef(0);
  const previousAnimated = useRef(animated);
  function stopInertia() {
    const control = controls.current;
    if (!control) return;
    // OrbitControls keeps a private spherical delta when damping is enabled.
    // Consume that delta once without damping, then restore and resynchronise
    // the exact current pose: pausing must not drift or jump on a slow device.
    const position = camera.position.clone();
    const quaternion = camera.quaternion.clone();
    const target = control.target.clone();
    const damping = control.enableDamping;
    control.autoRotate = false;
    control.enableDamping = false;
    control.update();
    camera.position.copy(position);
    camera.quaternion.copy(quaternion);
    control.target.copy(target);
    control.update();
    control.enableDamping = damping;
    speed.current = 0;
  }
  useLayoutEffect(() => {
    if (!animated || hovered) {
      if ((previousAnimated.current && !animated) || hovered) destination.current = null;
      stopInertia();
    }
    previousAnimated.current = animated;
  }, [animated, hovered, camera]);
  useEffect(() => {
    const aspect = size.width / size.height;
    const dimension = Math.max(
      profile.heightMm * MM,
      ((profile.widthMm + profile.depthMm) * MM * 0.68) / Math.max(0.8, aspect),
    );
    const distance = dimension * 2.32 * (exploded ? 1.35 : 1);
    const direction =
      view === "side"
        ? new THREE.Vector3(1, 0.04, 0.01)
        : view === "front"
          ? new THREE.Vector3(0.01, 0.04, 1)
          : new THREE.Vector3(1.25, 0.65, 1.5).normalize();
    destination.current = direction.multiplyScalar(distance);
    if (controls.current) {
      controls.current.target.set(0, 0, 0);
      controls.current.minDistance = dimension * 1.2;
      controls.current.maxDistance = dimension * 4.5;
      controls.current.autoRotate = false;
    }
    speed.current = 0;
  }, [profile.id, view, resetKey, exploded, size.width, size.height, camera]);
  useEffect(() => {
    // Keep the identified part still, including for a short moment after leaving it.
    if (hovered) resumeAt.current = performance.now() + 1800;
    else resumeAt.current = Math.max(resumeAt.current, performance.now() + 1400);
  }, [hovered]);
  useFrame((_, dt) => {
    const control = controls.current;
    if (!control) return;
    const now = performance.now();
    let state = "rotating";
    if (destination.current) {
      control.autoRotate = false;
      if (animated) camera.position.lerp(destination.current, 1 - Math.exp(-Math.min(dt, 0.1) * 7));
      else camera.position.copy(destination.current);
      control.update();
      if (camera.position.distanceTo(destination.current) < 0.015) destination.current = null;
      state = "settling";
    }
    if (!animated) state = "paused";
    else if (dragging.current) state = "dragging";
    else if (hovered) state = "hover";
    else if (view !== "perspective") state = "preset";
    else if (now < resumeAt.current) state = "waiting";
    const rotate = state === "rotating";
    speed.current = rotate ? THREE.MathUtils.lerp(speed.current, 0.62, 1 - Math.exp(-Math.min(dt, 0.1) * 1.8)) : 0;
    control.autoRotate = rotate;
    control.autoRotateSpeed = speed.current;
    if (now - lastReport.current > 180) {
      const rotor = scene.getObjectByName("fan-rotor");
      const rgb = (scene.getObjectByName("rgb-diffuser-strip") || scene.getObjectByName("rgb-diffuser-ring")) as THREE.Mesh | undefined;
      const rgbMaterial = rgb && !Array.isArray(rgb.material) ? rgb.material as THREE.MeshStandardMaterial : undefined;
      const rgbPhase = rgb?.name === "rgb-diffuser-strip" ? rgbMaterial?.map?.offset.x : rgbMaterial?.map?.rotation;
      const hoverStrength = hovered
        ? Number(scene.getObjectByName(`component-${hovered}`)?.userData.hoverStrength ?? 0)
        : Math.max(0, ...categories.map(({ id }) => Number(scene.getObjectByName(`component-${id}`)?.userData.hoverStrength ?? 0)));
      reportMotion({ state, animated, cameraAngle: control.getAzimuthalAngle(), fanAngle: rotor?.rotation.z, rgbPhase, hoverStrength });
      lastReport.current = now;
    }
  });
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping={animated && !hovered}
      dampingFactor={0.09}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI * 0.8}
      onStart={() => {
        destination.current = null;
        dragging.current = true;
        stopInertia();
        onDrag(true);
      }}
      onEnd={() => {
        dragging.current = false;
        resumeAt.current = performance.now() + 6500;
        onDrag(false);
      }}
    />
  );
}

function FallbackPc({ components }: { components: SelectedComponents }) {
  return (
    <div className="pc-fallback">
      <ProductArt category="case" brand={components.case?.brand} component={components.case} detailed />
      <strong>{components.case?.name || "Votre configuration"}</strong>
      <span>Aperçu simplifié · WebGL indisponible</span>
      <p>
        Le choix des composants et les contrôles de compatibilité restent
        disponibles.
      </p>
    </div>
  );
}
class SceneBoundary extends ReactComponent<
  { children: ReactNode; components: SelectedComponents },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <FallbackPc components={this.props.components} />
    ) : (
      this.props.children
    );
  }
}

export default function PcScene(props: PcSceneProps) {
  const container = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [hover, setHover] = useState<Hover | null>(null);
  const [supported] = useState(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2");
      if (!gl) return false;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return true;
    } catch {
      return false;
    }
  });
  const profile =
    getCaseProfile(props.components.case) ||
    getCaseProfile(defaultSelection.case)!;
  const gpu = getGpuProfile(props.components.gpu),
    cooler = getCoolerProfile(props.components.cooler);
  const board = getBoardProfile(props.components.motherboard) || getBoardProfile(profile.kind === "sandwich" ? "mb-a620i" : "mb-b650")!;
  const ramModules = getSceneRamModules(props.components, board, props.memory);
  useEffect(() => {
    setHover(null);
  }, [props.components, props.memory]);
  const handleHover = (
    category: CategoryId | null,
    event?: ThreeEvent<PointerEvent>,
  ) => {
    if (!category) {
      setHover(null);
      return;
    }
    if (dragging.current || !event || !container.current) return;
    const bounds = container.current.getBoundingClientRect();
    let module: THREE.Object3D | null = category === "ram" ? event.object : null;
    while (module && module.userData.memorySlotIndex === undefined) module = module.parent;
    const memoryHover = module ? {
      slotIndex: Number(module.userData.memorySlotIndex),
      slotLabel: String(module.userData.memorySlotLabel),
      componentId: String(module.userData.memoryComponentId),
      moduleCapacityGB: typeof module.userData.memoryModuleCapacityGB === "number" ? module.userData.memoryModuleCapacityGB : undefined,
    } : {};
    setHover({
      category,
      ...memoryHover,
      x: Math.max(
        10,
        Math.min(
          event.nativeEvent.clientX - bounds.left + 17,
          bounds.width - 246,
        ),
      ),
      y: Math.max(
        10,
        Math.min(
          event.nativeEvent.clientY - bounds.top - 25,
          bounds.height - (category === "ram" ? 165 : 116),
        ),
      ),
    });
  };
  const hovered = hover?.componentId ? getComponent(hover.componentId) : hover ? props.components[hover.category] : undefined;
  const hoveredMemory = hovered?.category === "ram" ? getMemoryDetails(hovered) : undefined;
  return (
    <div
      className={`pc-scene ${props.className || ""}`}
      ref={container}
      onPointerLeave={() => setHover(null)}
      data-case-model={profile.kind}
      data-case-id={props.components.case?.id || ""}
      data-gpu-model={gpu?.id || ""}
      data-gpu-fans={gpu?.fanCount || 0}
      data-cooler-model={cooler?.kind || ""}
      data-hover-category={hover?.category || ""}
      data-hover-slot={hover?.slotLabel || ""}
      data-ram-count={ramModules.length}
      data-ram-slots={ramModules.map((slot) => slot.label).join(",")}
      data-ram-models={ramModules.map((slot) => slot.component.id).join(",")}
      data-ram-capacity={ramModules.reduce((total, slot) => total + (slot.capacityGB ?? 0), 0)}
      data-animation={props.animated === false || props.paused ? "paused" : "enabled"}
      style={{ cursor: hover ? "pointer" : "grab" }}
    >
      {supported ? (
        <SceneBoundary components={props.components}>
          <Canvas
            frameloop={props.paused ? "never" : "always"}
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [5.5, 3, 6.5], fov: 32, near: 0.05, far: 100 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.02,
            }}
            onPointerMissed={() => setHover(null)}
          >
            <SceneAnimationProvider animated={props.animated !== false && !props.paused}>
            <HardwareSurfaceProvider>
            <ambientLight intensity={0.3} />
            <hemisphereLight args={["#edf2f7", "#252a2b", 0.7]} />
            <directionalLight
              position={[4, 6, 4]}
              intensity={2.35}
              color="#fff8ee"
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.00015}
              shadow-normalBias={0.008}
              shadow-camera-near={0.1}
              shadow-camera-far={22}
            />
            <directionalLight
              position={[-3, 3, -4]}
              intensity={1.15}
              color="#d2e5f5"
            />
            <directionalLight position={[5, 1, -3]} intensity={0.65} color="#edf7ff" />
            <pointLight
              position={[3, -1, 4]}
              intensity={2.2}
              distance={12}
              color="#e2e9ef"
            />
            <Suspense fallback={null}>
              <Environment resolution={256} environmentIntensity={0.9}>
                <Lightformer
                  intensity={2.5}
                  color="#fffaf1"
                  position={[4, 3.5, 4]}
                  scale={[3, 5, 1]}
                  rotation={[0, Math.PI / 4, 0]}
                />
                <Lightformer
                  intensity={1.8}
                  color="#d8e9f5"
                  position={[-4, 2, -2]}
                  scale={[1.2, 5, 1]}
                  rotation={[0, -Math.PI / 3, 0]}
                />
                <Lightformer
                  intensity={1.6}
                  color="#ffffff"
                  position={[0, 5, 0]}
                  scale={[5, 3, 1]}
                  rotation={[Math.PI / 2, 0, 0]}
                />
              </Environment>
              <Assembly
                {...props}
                caseProfile={profile}
                hovered={hover?.category || null}
                hoveredSlot={hover?.slotIndex ?? null}
                ramModules={ramModules}
                onHover={handleHover}
              />
              <ContactShadows
                key={`${profile.id}-${props.exploded}-${props.components.cooler?.id}`}
                position={[0, (-profile.heightMm * MM) / 2 - 0.035, 0]}
                opacity={0.6}
                scale={12}
                blur={1.8}
                far={5}
                resolution={256}
                frames={80}
              />
            </Suspense>
            <CameraRig
              profile={profile}
              view={props.cameraView}
              resetKey={props.resetKey}
              exploded={props.exploded}
              hovered={hover?.category ?? null}
              reportMotion={({ state, animated, cameraAngle, fanAngle, rgbPhase, hoverStrength }) => {
                if (!container.current) return;
                const dataset = container.current.dataset;
                dataset.rotationState = state;
                dataset.cameraAngle = cameraAngle.toFixed(5);
                dataset.fanAngle = fanAngle?.toFixed(5) ?? "";
                dataset.rgbPhase = rgbPhase?.toFixed(5) ?? "";
                dataset.motionEnabled = String(animated);
                dataset.hoverStrength = hoverStrength.toFixed(3);
              }}
              onDrag={(active) => {
                dragging.current = active;
                if (active) setHover(null);
              }}
            />
            </HardwareSurfaceProvider>
            </SceneAnimationProvider>
          </Canvas>
        </SceneBoundary>
      ) : (
        <FallbackPc components={props.components} />
      )}
      {hover && hovered && (
        <div
          className="pc-hover-card"
          role="status"
          style={{ left: hover.x, top: hover.y }}
        >
          <span className="pc-hover-type">
            {categories.find((c) => c.id === hover.category)?.label}{hover.slotLabel ? ` · ${hover.slotLabel}` : ""}
            <span>CLIQUER POUR SÉLECTIONNER</span>
          </span>
          <strong>
            {hovered.brand} {hovered.name}
          </strong>
          <span className="pc-hover-specs">
            {hover.slotLabel
              ? [hover.moduleCapacityGB ? `${new Intl.NumberFormat("fr-FR").format(hover.moduleCapacityGB)} Go par barrette` : "Capacité non renseignée", hovered.memoryType, `Emplacement ${hover.slotLabel}`].filter(Boolean).join(" · ")
              : hovered.specs.slice(0, 2).join(" · ")}
          </span>
          {hoveredMemory && (hoveredMemory.organization || hoveredMemory.moduleKind || hoveredMemory.voltageV) && <span className="pc-hover-specs">
            {[hoveredMemory.organization, hoveredMemory.moduleKind,
              hoveredMemory.voltageV ? `${new Intl.NumberFormat("fr-FR").format(hoveredMemory.voltageV)} V` : null].filter(Boolean).join(" · ")}
          </span>}
          {hoveredMemory?.partNumber && !hovered.name.includes(hoveredMemory.partNumber) && <span className="pc-hover-specs">
            Réf. {hoveredMemory.partNumber}
          </span>}
        </div>
      )}
    </div>
  );
}
