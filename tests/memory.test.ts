import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog, defaultSelection, getComponent, type Component, type Selection } from '../src/data/catalog.ts';
import { analyzeBuild, getBuildIssues, getCandidateIssues } from '../src/lib/compatibility.ts';
import { arrangeMemorySlots, getMemoryAnalysis, resetMemoryToKit, withMemoryQuantity, withMemorySlot } from '../src/lib/memory.ts';

const kit = getComponent('ram-ddr5-32')!;
const largerKit = getComponent('ram-ddr5-64')!;
const board = getComponent('mb-b650')!;
const installedLabels = (selection: Selection) => getMemoryAnalysis(selection).slots.filter(slot => slot.componentId).map(slot => slot.label);
const lookupWith = (...components: Component[]) => (id: string | null | undefined) => components.find(component => component.id === id) ?? getComponent(id);

// Synthetic metadata isolates limits that are uncommon in the current catalogue,
// without mutating product records or the global lookup map.
function fixtureAnalysis(ram: Partial<Component>, motherboard: Partial<Component> = {}, slots?: Array<string | null>) {
  const memory = { ...kit, ...ram };
  const mainboard = { ...board, ...motherboard };
  return getMemoryAnalysis({ ...defaultSelection, ...(slots ? { memory: { slots } } : {}) }, lookupWith(memory, mainboard));
}

test('legacy saved kits populate A2/B2 on four-slot boards and A1/B1 on two-slot boards', () => {
  assert.deepEqual(installedLabels(defaultSelection), ['A2', 'B2']);
  assert.deepEqual(installedLabels({ ...defaultSelection, motherboard: 'mb-a620i' }), ['A1', 'B1']);
  assert.equal(defaultSelection.memory, undefined);
});

test('one to four modules account for installed capacity and the price of whole kits', () => {
  const expectedLabels = [['A2'], ['A2', 'B2'], ['A1', 'A2', 'B2'], ['A1', 'A2', 'B1', 'B2']];
  const expectedChannels = ['single', 'dual', 'asymmetric', 'dual'];
  for (let count = 1; count <= 4; count++) {
    const selection = withMemoryQuantity(defaultSelection, count);
    const memory = getMemoryAnalysis(selection);
    assert.equal(memory.installedCount, count);
    assert.equal(memory.totalCapacityGB, count * 16);
    assert.equal(memory.totalPrice, Math.round(Math.ceil(count / 2) * kit.price * 100) / 100);
    assert.equal(memory.purchases[0].spareModules, count % 2);
    assert.equal(memory.purchases[0].kits, Math.ceil(count / 2));
    assert.equal(memory.channelMode, expectedChannels[count - 1]);
    assert.deepEqual(installedLabels(selection), expectedLabels[count - 1]);
    assert.equal(memory.aggregate?.memorySticks, count);
    assert.equal(memory.aggregate?.capacityGB, count * 16);
  }
});

test('three modules describe asymmetric dual-channel capacity without inventing triple channel', () => {
  const memory = getMemoryAnalysis(withMemoryQuantity(defaultSelection, 3));
  assert.deepEqual(memory.channelCapacitiesGB, [32, 16]);
  assert.match(memory.channelSummary, /32 Go équilibrés/);
  assert.match(memory.channelSummary, /16 Go supplémentaires/);
  assert.match(memory.channelSummary, /trois barrettes ne créent pas un troisième canal/);
  assert.ok(memory.warnings.some(warning => warning.id === 'memory-dpc'));
  assert.ok(memory.warnings.some(warning => warning.id === 'memory-separate-kits'));
});

test('changing to a two-slot motherboard preserves all four installed modules and flags overflow', () => {
  const selection = { ...withMemoryQuantity(defaultSelection, 4), motherboard: 'mb-a620i' };
  const memory = getMemoryAnalysis(selection);
  assert.equal(memory.availableSlots, 2);
  assert.equal(memory.installedCount, 4);
  assert.equal(memory.totalCapacityGB, 64);
  assert.equal(memory.slots.filter(slot => !slot.supported && slot.componentId).length, 2);
  assert.ok(memory.warnings.some(warning => warning.id === 'memory-slots' && warning.severity === 'error'));
  assert.ok(getCandidateIssues(withMemoryQuantity(defaultSelection, 4), getComponent('mb-a620i')!).some(warning => warning.id === 'memory-slots'));
});

test('two existing modules remain at their saved positions until explicitly rearranged', () => {
  const selection = { ...withMemoryQuantity(defaultSelection, 2), motherboard: 'mb-a620i' };
  assert.ok(getMemoryAnalysis(selection).warnings.some(warning => warning.id === 'memory-slots'));
  const arranged = arrangeMemorySlots(selection);
  assert.deepEqual(installedLabels(arranged), ['A1', 'B1']);
  assert.equal(getMemoryAnalysis(arranged).warnings.some(warning => warning.id === 'memory-slots'), false);
  assert.equal(getMemoryAnalysis(arranged).installedCount, 2);
});

test('per-slot editing mixes real references and counts their individual purchased kits', () => {
  const one = withMemoryQuantity(defaultSelection, 1);
  const mixed = withMemorySlot(one, 3, largerKit.id);
  const memory = getMemoryAnalysis(mixed);
  assert.equal(memory.totalCapacityGB, 48);
  assert.equal(memory.totalPrice, Math.round((kit.price + largerKit.price) * 100) / 100);
  assert.equal(memory.purchases.length, 2);
  assert.deepEqual(memory.purchases.map(purchase => purchase.spareModules), [1, 1]);
  assert.equal(memory.channelMode, 'asymmetric');
  assert.ok(memory.warnings.some(warning => warning.id === 'memory-mixed-kits'));
  assert.equal(memory.slots[1].component, kit);
  assert.equal(memory.slots[3].component, largerKit);
  assert.equal(memory.slots[3].capacityGB, 32);
  assert.deepEqual(arrangeMemorySlots(mixed).memory?.slots?.filter(Boolean).sort(), [kit.id, largerKit.id].sort());
});

test('mixed DDR generations remain blocked for both the CPU and motherboard', () => {
  const selection = withMemorySlot(withMemoryQuantity(defaultSelection, 1), 3, 'ram-ddr4-16');
  const analysis = analyzeBuild(selection);
  for (const id of ['memory-type', 'memory-mixed-generation', 'cpu-memory']) {
    assert.ok(analysis.warnings.some(warning => warning.id === id && warning.severity === 'error'), id);
  }
  assert.equal(analysis.status, 'incompatible');
});

test('choosing a kit or inspecting a RAM candidate replaces custom slot overrides', () => {
  const custom = withMemorySlot(withMemoryQuantity(defaultSelection, 4), 0, 'ram-ddr4-16');
  assert.deepEqual(getCandidateIssues(custom, kit), []);
  const reset = resetMemoryToKit(custom, largerKit.id);
  const memory = getMemoryAnalysis(reset);
  assert.equal(memory.installedCount, 2);
  assert.equal(memory.totalCapacityGB, 64);
  assert.deepEqual(memory.purchases.map(purchase => purchase.component.id), [largerKit.id]);
  const removed = resetMemoryToKit(custom, null);
  assert.equal(getMemoryAnalysis(removed).installedCount, 0);
  assert.equal(analyzeBuild(removed).selected.ram, undefined);
});

test('DIMM/SO-DIMM mismatch and registered memory are blocked on an incompatible board', () => {
  const sodimm = fixtureAnalysis({ memoryModuleFormat: 'SO-DIMM' }, { memoryModuleFormat: 'DIMM' });
  assert.ok(sodimm.warnings.some(warning => warning.id === 'memory-module-format' && warning.severity === 'error'));
  const registered = fixtureAnalysis({ memoryRegistered: true }, { memoryRegistered: false });
  assert.ok(registered.warnings.some(warning => warning.id === 'memory-registered' && warning.severity === 'error'));
  const ecc = fixtureAnalysis({ memoryEcc: true }, { memoryEcc: undefined });
  assert.ok(ecc.warnings.some(warning => warning.id === 'memory-ecc' && warning.severity === 'warning'));
});

test('total capacity and per-module capacity limits are checked separately', () => {
  const total = fixtureAnalysis({}, { maxMemoryGB: 16 });
  assert.ok(total.warnings.some(warning => warning.id === 'memory-capacity'));
  const individual = fixtureAnalysis({}, { maxMemoryGB: 128, maxMemoryPerSlotGB: 8 });
  assert.ok(individual.warnings.some(warning => warning.id === 'memory-module-capacity'));
  assert.equal(individual.warnings.some(warning => warning.id === 'memory-capacity'), false);
});

test('larger slot counts follow declared channels instead of assuming one channel per module', () => {
  const analysis = fixtureAnalysis({ capacityGB: 128, memorySticks: 8 }, { memorySlots: 8, memoryChannels: 4, maxMemoryGB: 256 });
  assert.equal(analysis.slots.length, 8);
  assert.deepEqual(analysis.slots.map(slot => slot.label), ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']);
  assert.equal(analysis.channelCount, 4);
  assert.equal(analysis.channelMode, 'multi');
  assert.deepEqual(analysis.channelCapacitiesGB, [32, 32, 32, 32]);
  assert.match(analysis.warnings.find(warning => warning.id === 'memory-dpc')?.description ?? '', /8 barrettes et 4 canaux/);
});

test('unknown motherboard limits produce explicit warnings and provisional slots', () => {
  const analysis = fixtureAnalysis({}, { memorySlots: undefined, maxMemoryGB: undefined, memoryType: undefined });
  assert.equal(analysis.slotsKnown, false);
  assert.equal(analysis.channelMode, 'unknown');
  for (const id of ['memory-slots-unknown', 'memory-capacity-unknown', 'memory-type-unknown']) {
    assert.ok(analysis.warnings.some(warning => warning.id === id && warning.severity === 'warning'));
  }
  assert.equal(analysis.warnings.some(warning => warning.severity === 'error'), false);
});

test('missing kit composition or price does not invent capacity or a free purchase', () => {
  const unknownKit = fixtureAnalysis({ memorySticks: undefined });
  assert.equal(unknownKit.capacityKnown, false);
  assert.equal(unknownKit.priceKnown, false);
  assert.equal(unknownKit.purchases[0].price, null);
  assert.ok(unknownKit.warnings.some(warning => warning.id === 'memory-kit-data'));
  const noPrice = fixtureAnalysis({ price: 0, priceStatus: 'unknown' });
  assert.equal(noPrice.priceKnown, false);
  assert.equal(noPrice.purchases[0].price, null);
  assert.equal(noPrice.aggregate?.priceStatus, 'unknown');
});

test('the slowest advertised module sets only an upper bound, not a guaranteed clock', () => {
  const fast = { ...kit, memorySpeedMTs: 6400, memoryProfile: 'EXPO' as const };
  const slow = { ...largerKit, memorySpeedMTs: 5200 };
  const selection = withMemorySlot(withMemoryQuantity(defaultSelection, 1), 3, slow.id);
  const analysis = getMemoryAnalysis(selection, lookupWith(fast, slow));
  assert.equal(analysis.commonSpeedMTs, 5200);
  assert.match(analysis.speedSummary, /XMP\/EXPO/);
  assert.match(analysis.speedSummary, /pas une vitesse garantie/);
});

test('unknown saved references remain visible and cannot appear compatible', () => {
  const selection = { ...defaultSelection, memory: { slots: [null, 'missing-ram-id', null, kit.id] } };
  const memory = getMemoryAnalysis(selection);
  assert.equal(memory.installedCount, 2);
  assert.equal(memory.slots[1].componentId, 'missing-ram-id');
  assert.equal(memory.priceKnown, false);
  assert.equal(memory.capacityKnown, false);
  assert.ok(memory.warnings.some(warning => warning.id === 'memory-reference' && warning.severity === 'error'));
  assert.equal(analyzeBuild(selection).status, 'incompatible');
  assert.equal(analyzeBuild(selection).unpricedCount, 1);
});

test('aggregate memory and helpers never mutate the original kit or saved selection', () => {
  const originalSelection = JSON.stringify(defaultSelection);
  const originalKit = JSON.stringify(kit);
  const selection = withMemoryQuantity(defaultSelection, 3);
  const result = analyzeBuild(selection);
  assert.notEqual(result.selected.ram, kit);
  assert.equal(result.selected.ram?.capacityGB, 48);
  const expectedTotal = analyzeBuild(defaultSelection).total + kit.price;
  assert.equal(result.total, Math.round(expectedTotal * 100) / 100);
  assert.equal(result.totalKnown, result.total);
  assert.equal(result.unpricedCount, 0);
  assert.equal(JSON.stringify(defaultSelection), originalSelection);
  assert.equal(JSON.stringify(kit), originalKit);
  assert.deepEqual(getMemoryAnalysis(JSON.parse(JSON.stringify(selection))).slots, result.memory.slots);
});

test('invalid slot controls reject unsafe indices and a malformed saved layout is reported', () => {
  assert.throws(() => withMemoryQuantity(defaultSelection, -1), RangeError);
  assert.throws(() => withMemoryQuantity(defaultSelection, 1.5), RangeError);
  assert.throws(() => withMemorySlot(defaultSelection, 16, kit.id), RangeError);
  assert.throws(() => withMemorySlot(defaultSelection, 0, 'gpu-4070s'));
  const selection = { ...defaultSelection, memory: { slots: Array(17).fill(kit.id) } };
  assert.ok(getMemoryAnalysis(selection).warnings.some(warning => warning.id === 'memory-layout-invalid'));
});


test('motherboard candidates rearrange two modules but never discard an overflowing third or fourth', () => {
  const board = getComponent('mb-a620i')!;
  const two = withMemoryQuantity(defaultSelection, 2);
  assert.equal(getCandidateIssues(two, board).some(warning => warning.id === 'memory-slots'), false);
  assert.ok(getCandidateIssues(withMemoryQuantity(defaultSelection, 3), board).some(warning => warning.id === 'memory-slots'));
  assert.ok(getCandidateIssues(withMemoryQuantity(defaultSelection, 4), board).some(warning => warning.id === 'memory-slots'));
});

test('current RAM card issues preserve mixed-reference errors instead of inspecting a replacement kit', () => {
  const selection = withMemorySlot(withMemoryQuantity(defaultSelection, 1), 3, 'ram-ddr4-16');
  const analysis = analyzeBuild(selection);
  const installedIssues = getBuildIssues(analysis, 'ram');
  assert.ok(installedIssues.some(warning => warning.id === 'memory-mixed-generation'));
  assert.ok(installedIssues.some(warning => warning.id === 'memory-type'));
  assert.deepEqual(getCandidateIssues(selection, kit), []);
  assert.ok(getBuildIssues(analysis, 'motherboard').some(warning => warning.id === 'memory-type'));
});

test('imported RAM keeps whole-kit quantities without making an unknown price free', () => {
  const imported = catalog.find(component => component.source && component.category === 'ram'
    && component.memoryType === 'DDR5' && component.memorySticks === 2 && component.capacityGB === 32)!;
  assert.ok(imported, 'expected a sourced 2 × 16 GB DDR5 kit');
  const selection = withMemoryQuantity(resetMemoryToKit(defaultSelection, imported.id), 3);
  const analysis = analyzeBuild(selection);
  assert.equal(analysis.memory.totalCapacityGB, 48);
  assert.equal(analysis.memory.purchases[0].kits, 2);
  assert.equal(analysis.memory.purchases[0].spareModules, 1);
  assert.equal(analysis.memory.purchases[0].price, null);
  assert.equal(analysis.memory.priceKnown, false);
  assert.equal(analysis.unpricedCount, 1);
  assert.equal(analysis.totalKnown, Math.round((analyzeBuild(defaultSelection).totalKnown - kit.price) * 100) / 100);
  assert.equal(analysis.total, analysis.totalKnown);
});

test('mixing priced and unpriced RAM retains the known kit subtotal in the build budget', () => {
  const imported = catalog.find(component => component.source && component.category === 'ram'
    && component.memoryType === 'DDR5' && component.memorySticks === 2 && component.capacityGB === 32)!;
  assert.ok(imported);
  const selection = withMemorySlot(withMemoryQuantity(defaultSelection, 1), 3, imported.id);
  const analysis = analyzeBuild(selection);
  assert.equal(analysis.memory.priceKnown, false);
  assert.equal(analysis.selected.ram?.priceStatus, 'unknown');
  assert.equal(analysis.memory.totalPrice, kit.price);
  assert.equal(analysis.selected.ram?.id, kit.id);
  assert.equal(analysis.selected.ram?.detailLevel, 'partial');
  assert.ok(analysis.warnings.some(warning => warning.id === 'catalog-partial'));
  assert.equal(analysis.totalKnown, analyzeBuild(defaultSelection).totalKnown);
  assert.equal(analysis.unpricedCount, 1);
});
