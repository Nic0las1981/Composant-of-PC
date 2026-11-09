import * as THREE from "three";

export type SurfaceFinish = "paint" | "brushed" | "plastic" | "pcb" | "smooth";
type TexturedFinish = Exclude<SurfaceFinish, "smooth">;

export interface HardwareSurface {
  texture: THREE.DataTexture;
  bumpScale: number;
  envMapIntensity: number;
}

/** Four small neutral maps are shared by a whole scene. They describe a visual
 * finish, never a measured texture, material specification or product feature.
 * Seeded, non-periodic grain and mipmaps avoid the regular patterns that shimmer
 * on small panels. No bitmap, HDR download or per-component canvas is needed.
 */
export function createHardwareSurfaces(): Record<TexturedFinish, HardwareSurface> {
  const resolution = 128;
  const finishes: TexturedFinish[] = ["paint", "brushed", "plastic", "pcb"];
  return Object.fromEntries(finishes.map((finish, finishIndex) => {
    let seed = 0x43a5b79 ^ (finishIndex * 0x19b73);
    const random = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 0x100000000;
    };
    const data = new Uint8Array(resolution * resolution * 4);
    for (let y = 0; y < resolution; y++) {
      const brushLine = (random() - 0.5) * 22;
      for (let x = 0; x < resolution; x++) {
        const amplitude = finish === "pcb" ? 5 : finish === "plastic" ? 10 : 16;
        const grain = finish === "brushed" ? brushLine + (random() - 0.5) * 4 : (random() - 0.5) * amplitude;
        const value = Math.round(238 + grain);
        const offset = (y * resolution + x) * 4;
        data[offset] = data[offset + 1] = data[offset + 2] = value;
        data[offset + 3] = 255;
      }
    }
    const texture = new THREE.DataTexture(data, resolution, resolution, THREE.RGBAFormat);
    texture.name = `forge-surface-${finish}`;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(finish === "brushed" ? 1 : 3, 3);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    return [finish, {
      texture,
      bumpScale: finish === "pcb" ? 0.001 : finish === "brushed" ? 0.0014 : 0.0022,
      envMapIntensity: finish === "brushed" ? 1.1 : finish === "paint" ? 0.85 : 0.65,
    } satisfies HardwareSurface];
  })) as Record<TexturedFinish, HardwareSurface>;
}
