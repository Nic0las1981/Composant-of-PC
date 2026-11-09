import test from "node:test";
import assert from "node:assert/strict";
import type { Component, Selection } from "../src/data/catalog.ts";
import { catalogOemMemory } from "../src/data/catalogOemMemory.ts";
import { getMemoryDetails, getMemoryModuleCapacity } from "../src/lib/memoryDetails.ts";
import { getMemoryAnalysis } from "../src/lib/memory.ts";

const fixture = (overrides: Partial<Component> = {}): Component => ({
  id: "test-memory", category: "ram", brand: "Test", name: "Mémoire", price: 0,
  description: "Fixture", specs: [], ...overrides,
});

test("16 Go per-module filtering includes one module and multi-module kits without confusing kit capacity", () => {
  for (const count of [1, 2, 4]) assert.equal(getMemoryModuleCapacity(fixture({ capacityGB: 16 * count, memorySticks: count })), 16);
  assert.equal(getMemoryModuleCapacity(fixture({ capacityGB: 16, memorySticks: 2 })), 8);
  assert.equal(getMemoryModuleCapacity(fixture({ capacityGB: 16 })), null);
  assert.equal(getMemoryModuleCapacity(fixture({ capacityGB: 16, memorySticks: 0 })), null);
  assert.equal(getMemoryModuleCapacity(fixture({ capacityGB: 16, memorySticks: 1, category: "gpu" })), null);
});

test("a DIMM is not automatically an unbuffered UDIMM, and a registered module is not assumed RDIMM over LRDIMM", () => {
  assert.equal(getMemoryDetails(fixture({ memoryModuleFormat: "DIMM" })).moduleKind, null);
  assert.equal(getMemoryDetails(fixture({ memoryModuleFormat: "DIMM", memoryRegistered: false })).moduleKind, "UDIMM");
  assert.equal(getMemoryDetails(fixture({ memoryModuleFormat: "DIMM", memoryRegistered: true })).moduleKind, null);
  assert.equal(getMemoryDetails(fixture({ memoryModuleFormat: "SO-DIMM", memoryRegistered: false })).moduleKind, "SO-DIMM");
  assert.equal(getMemoryDetails(fixture({ memoryModuleFormat: "DIMM", memoryModuleKind: "CUDIMM" })).moduleKind, "CUDIMM");
});

test("rank count and chip width form 2Rx8 only when both are documented", () => {
  const documented = getMemoryDetails(fixture({ memoryRankCount: 2, memoryDeviceWidthBits: 8 }));
  assert.equal(documented.organization, "2Rx8");
  assert.equal(documented.rankCount, 2);
  assert.equal(documented.deviceWidthBits, 8);
  assert.equal(getMemoryDetails(fixture({ memoryRankCount: 2 })).organization, null);
  assert.equal(getMemoryDetails(fixture({ memoryDeviceWidthBits: 8 })).organization, null);
  assert.equal(getMemoryDetails(fixture({ capacityGB: 16, memorySticks: 1 })).rankCount, null);
  assert.equal("channelCount" in documented, false);
  assert.equal("populatedSides" in documented, false);
});

test("DDR4-3200 is 3200 MT/s with a corresponding 1600 MHz clock, never an observed operating speed", () => {
  const info = getMemoryDetails(fixture({ memoryType: "DDR4", memorySpeedMTs: 3200 }));
  assert.equal(info.transferRateMTs, 3200);
  assert.equal(info.clockMHz, 1600);
  assert.equal(getMemoryDetails(fixture({ memoryType: "DDR5", memorySpeedMTs: 6000 })).clockMHz, 3000);
  assert.equal(getMemoryDetails(fixture({ specs: ["3200 MHz"] })).transferRateMTs, null);
  assert.equal(getMemoryDetails(fixture({ memorySpeedMTs: 3200 })).clockMHz, null);
});

test("electrical characteristics and OEM appearance remain unknown unless explicitly supplied", () => {
  const source = fixture({ manufacturerPartNumber: " M378TEST ", memoryVoltageV: 1.2, memoryEcc: false, memoryHeatspreader: false });
  const copy = JSON.stringify(source);
  const info = getMemoryDetails(source);
  assert.equal(info.partNumber, "M378TEST");
  assert.equal(info.voltageV, 1.2);
  assert.equal(info.ecc, false);
  assert.equal(info.heatspreader, false);
  assert.equal(getMemoryDetails(fixture()).heatspreader, null);
  assert.equal(getMemoryDetails(fixture()).voltageV, null);
  assert.equal(JSON.stringify(source), copy);
});

test("documented Samsung OEM modules keep distinct capacity and rank organizations", () => {
  const module16 = catalogOemMemory.find((component) => component.manufacturerPartNumber === "M378A2G43AB3-CWE");
  const module32 = catalogOemMemory.find((component) => component.manufacturerPartNumber === "M378A4G43AB2-CWE");
  const module16DualRank = catalogOemMemory.find((component) => component.manufacturerPartNumber === "M378A2K43EB1-CWE");
  assert.ok(module16 && module32 && module16DualRank);
  assert.equal(getMemoryModuleCapacity(module16), 16);
  assert.equal(getMemoryDetails(module16).organization, "1Rx8");
  assert.equal(getMemoryModuleCapacity(module16DualRank), 16);
  assert.equal(getMemoryDetails(module16DualRank).organization, "2Rx8");
  assert.notEqual(module16.id, module16DualRank.id);
  assert.equal(getMemoryModuleCapacity(module32), 32);
  assert.equal(getMemoryDetails(module32).organization, "2Rx8");
  for (const component of catalogOemMemory) {
    const details = getMemoryDetails(component);
    assert.equal(details.modulesPerKit, 1);
    assert.equal(details.moduleKind, "UDIMM");
    assert.equal(details.physicalFormat, "DIMM");
    assert.equal(details.registered, false);
    assert.equal(details.ecc, false);
    assert.equal(details.transferRateMTs, 3200);
    assert.equal(details.heatspreader, false);
    assert.equal(component.priceStatus, "unknown");
    assert.ok(component.source?.url.includes(component.source.snapshot));
    assert.match(component.source!.rowId, /^sha256:[0-9a-f]{64}$/);
  }
});

test("four real Samsung 16 Go 2Rx8 modules give 64 Go in four slots without implying four channels", () => {
  const module = catalogOemMemory.find((component) => component.manufacturerPartNumber === "M378A2K43EB1-CWE")!;
  const board = fixture({ id: "test-board", category: "motherboard", memoryType: "DDR4", memorySlots: 4,
    memoryChannels: 2, maxMemoryGB: 128, maxMemoryPerSlotGB: 32, memoryModuleFormat: "DIMM" });
  const selection: Selection = { cpu: null, motherboard: board.id, gpu: null, ram: module.id, storage: null,
    cooler: null, psu: null, case: null, memory: { slots: Array(4).fill(module.id) } };
  const lookup = (id: string | null | undefined) => id === board.id ? board : id === module.id ? module : undefined;
  const memory = getMemoryAnalysis(selection, lookup);
  assert.equal(memory.installedCount, 4);
  assert.equal(memory.totalCapacityGB, 64);
  assert.equal(memory.channelCount, 2);
  assert.equal(memory.channelMode, "dual");
  assert.deepEqual(memory.channelCapacitiesGB, [32, 32]);
  assert.equal(memory.commonSpeedMTs, 3200);
  assert.equal(memory.purchases[0].kits, 4);
  assert.equal(memory.purchases[0].spareModules, 0);
  assert.equal(memory.priceKnown, false);
  assert.equal(memory.warnings.some((warning) => warning.severity === "error"), false);
});
