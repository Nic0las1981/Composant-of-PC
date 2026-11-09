import type { Component } from "../data/catalog.ts";
import { memorySpeed } from "./memory.ts";

export interface MemoryDetails {
  totalCapacityGB: number | null;
  modulesPerKit: number | null;
  capacityPerModuleGB: number | null;
  physicalFormat: NonNullable<Component["memoryModuleFormat"]> | null;
  moduleKind: NonNullable<Component["memoryModuleKind"]> | null;
  rankCount: NonNullable<Component["memoryRankCount"]> | null;
  deviceWidthBits: NonNullable<Component["memoryDeviceWidthBits"]> | null;
  /** 2Rx8 describes ranks and chip width, never channel count or PCB sides. */
  organization: string | null;
  transferRateMTs: number | null;
  /** Theoretical clock corresponding to the advertised DDR transfer rate. */
  clockMHz: number | null;
  voltageV: number | null;
  partNumber: string | null;
  registered: boolean | null;
  ecc: boolean | null;
  heatspreader: boolean | null;
}

const positive = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

/** The capacity field describes a whole retail kit. Dividing it is safe only
 * when the kit's module count is explicitly known, including single modules.
 */
export function getMemoryModuleCapacity(component: Component): number | null {
  if (component.category !== "ram" || !positive(component.capacityGB)
    || !positive(component.memorySticks) || !Number.isInteger(component.memorySticks)) return null;
  return component.capacityGB / component.memorySticks;
}

export function getMemoryDetails(component: Component): MemoryDetails {
  const isMemory = component.category === "ram";
  const physicalFormat = isMemory ? component.memoryModuleFormat ?? null : null;
  const registered = isMemory ? component.memoryRegistered ?? null : null;
  // DIMM is a physical format; it alone does not establish UDIMM versus RDIMM.
  // Conversely, a SO-DIMM label must not silently become a desktop UDIMM.
  const moduleKind = isMemory ? component.memoryModuleKind
    ?? (physicalFormat === "SO-DIMM" ? "SO-DIMM"
      : physicalFormat === "DIMM" && registered === false ? "UDIMM" : null) : null;
  const rankCount = isMemory && [1, 2, 4, 8].includes(component.memoryRankCount ?? 0)
    ? component.memoryRankCount! : null;
  const deviceWidthBits = isMemory && [4, 8, 16].includes(component.memoryDeviceWidthBits ?? 0)
    ? component.memoryDeviceWidthBits! : null;
  const transferRateMTs = isMemory ? memorySpeed(component) : null;
  const ddr = component.memoryType === "DDR4" || component.memoryType === "DDR5";
  return {
    totalCapacityGB: isMemory && positive(component.capacityGB) ? component.capacityGB : null,
    modulesPerKit: isMemory && positive(component.memorySticks) && Number.isInteger(component.memorySticks) ? component.memorySticks : null,
    capacityPerModuleGB: getMemoryModuleCapacity(component),
    physicalFormat,
    moduleKind,
    rankCount,
    deviceWidthBits,
    organization: rankCount && deviceWidthBits ? `${rankCount}Rx${deviceWidthBits}` : null,
    transferRateMTs,
    clockMHz: ddr && transferRateMTs !== null ? transferRateMTs / 2 : null,
    voltageV: isMemory && positive(component.memoryVoltageV) ? component.memoryVoltageV : null,
    partNumber: isMemory && component.manufacturerPartNumber?.trim() ? component.manufacturerPartNumber.trim() : null,
    registered,
    ecc: isMemory ? component.memoryEcc ?? null : null,
    heatspreader: isMemory ? component.memoryHeatspreader ?? null : null,
  };
}
