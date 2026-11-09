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
  AioCoolingModel,
} from "./scene/HardwareModels";
import ProductArt from "./ProductArt";

export type CameraView = "perspective" | "side" | "front";
type V3 = [number, number, number];
type SelectedComponents = Partial<Record<CategoryId, Component | undefined>>;
export interface PcSceneProps {
  components: SelectedComponents;
  exploded?: boolean;
  paused?: boolean;
  openSide?: boolean;
  cameraView?: CameraView;
  activeCategory?: CategoryId | null;
  onSelectCategory?: (id: CategoryId) => void;
  resetKey?: number;
  className?: string;
}
type Hover = { category: CategoryId; x: number; y: number };
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
  size?: V3;
  onHover: (id: CategoryId | null, event?: ThreeEvent<PointerEvent>) => void;
  onSelect?: (id: CategoryId) => void;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const target = useMemo(
    () => new THREE.Vector3(...(exploded ? add(position, offset) : position)),
    [...position, ...offset, exploded],
  );
  useFrame((_, dt) => {
    if (ref.current) {
      if (reduced) ref.current.position.copy(target);
      else ref.current.position.lerp(target, 1 - Math.exp(-dt * 8));
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
      {highlight && size && <Highlight size={size} />}
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
  onHover,
  onSelectCategory,
  caseProfile,
}: PcSceneProps & {
  caseProfile: CaseVisualProfile;
  hovered: CategoryId | null;
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
    ram = getRamProfile(components.ram),
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
  const ramPosition = add(add(boardPosition, anchors.ram), [
    ram ? (ram.heightMm * MM) / 2 : 0,
    0,
    0,
  ]);
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
    highlight: hovered === id || activeCategory === id,
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
      {components.ram && ram && (
        <Part
          {...props(
            "ram",
            ramPosition,
            [1.05, 0.1, 1.1],
            [
              ram.heightMm * MM,
              ram.lengthMm * MM,
              (ram.sticks - 1) * 0.145 + ram.thicknessMm * MM,
            ],
          )}
        >
          <RamModel component={components.ram} profile={ram} />
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

function CameraRig({
  profile,
  view = "perspective",
  resetKey,
  exploded,
  onDrag,
}: {
  profile: CaseVisualProfile;
  view?: CameraView;
  resetKey?: number;
  exploded?: boolean;
  onDrag: (active: boolean) => void;
}) {
  const { camera, size } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const destination = useRef<THREE.Vector3 | null>(null);
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
    }
  }, [profile.id, view, resetKey, exploded, size.width, size.height, camera]);
  useFrame((_, dt) => {
    if (destination.current) {
      camera.position.lerp(destination.current, 1 - Math.exp(-dt * 7));
      controls.current?.update();
      if (camera.position.distanceTo(destination.current) < 0.015)
        destination.current = null;
    }
  });
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.09}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI * 0.8}
      onStart={() => {
        destination.current = null;
        onDrag(true);
      }}
      onEnd={() => onDrag(false)}
    />
  );
}

function FallbackPc({ components }: { components: SelectedComponents }) {
  return (
    <div className="pc-fallback">
      <ProductArt category="case" brand={components.case?.brand} />
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
  useEffect(() => {
    setHover(null);
  }, [props.components]);
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
    setHover({
      category,
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
          bounds.height - 116,
        ),
      ),
    });
  };
  const hovered = hover ? props.components[hover.category] : undefined;
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
            }}
            onPointerMissed={() => setHover(null)}
          >
            <ambientLight intensity={0.7} />
            <hemisphereLight args={["#e4ebf5", "#343f35", 1.5]} />
            <directionalLight
              position={[4, 6, 5]}
              intensity={3.2}
              color="#f8f6ee"
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.0005}
            />
            <directionalLight
              position={[-3, 3, -4]}
              intensity={2.2}
              color="#b2c7e1"
            />
            <pointLight
              position={[3, -1, 4]}
              intensity={8}
              distance={12}
              color="#d2dce7"
            />
            <Suspense fallback={null}>
              <Environment resolution={128}>
                <Lightformer
                  intensity={1}
                  color="#ffffff"
                  position={[3, 4, 2]}
                  scale={[4, 6, 1]}
                  rotation={[0, -Math.PI / 4, 0]}
                />
                <Lightformer
                  intensity={0.7}
                  color="#c6d5e8"
                  position={[-3, 2, -3]}
                  scale={[3, 5, 1]}
                  rotation={[0, Math.PI / 3, 0]}
                />
              </Environment>
              <Assembly
                {...props}
                caseProfile={profile}
                hovered={hover?.category || null}
                onHover={handleHover}
              />
              <ContactShadows
                key={`${profile.id}-${props.exploded}-${props.components.cooler?.id}`}
                position={[0, (-profile.heightMm * MM) / 2 - 0.035, 0]}
                opacity={0.58}
                scale={12}
                blur={2.5}
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
              onDrag={(active) => {
                dragging.current = active;
                if (active) setHover(null);
              }}
            />
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
            {categories.find((c) => c.id === hover.category)?.label}
            <span>CLIQUER POUR SÉLECTIONNER</span>
          </span>
          <strong>
            {hovered.brand} {hovered.name}
          </strong>
          <span className="pc-hover-specs">
            {hovered.specs.slice(0, 2).join(" · ")}
          </span>
        </div>
      )}
    </div>
  );
}
