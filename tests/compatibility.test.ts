import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog, categories, defaultSelection, getComponent } from '../src/data/catalog.ts';
import type { Selection } from '../src/data/catalog.ts';
import { analyzeBuild, getCandidateIssues } from '../src/lib/compatibility.ts';

test('default build is complete and compatible with power headroom', () => {
  const result = analyzeBuild(defaultSelection);
  assert.equal(result.status, 'compatible');
  assert.equal(result.selectedCount, 8);
  assert.equal(result.warnings.filter(w => w.severity === 'error').length, 0);
  assert.ok(result.total > 1500);
  assert.ok(result.power.capacity >= result.power.recommended);
  assert.equal(result.balance.limiter, 'balanced');
});

test('changing to AM4 CPU on AM5 board detects socket and memory failures', () => {
  const result = analyzeBuild({ ...defaultSelection, cpu: 'cpu-5600' });
  assert.equal(result.status, 'incompatible');
  assert.ok(result.warnings.some(w => w.id === 'socket'));
  assert.ok(result.warnings.some(w => w.id === 'cpu-memory'));
});

test('DDR4 cannot be installed in a DDR5 board', () => {
  const result = analyzeBuild({ ...defaultSelection, ram: 'ram-ddr4-32' });
  assert.ok(result.warnings.some(w => w.id === 'memory-type' && w.severity === 'error'));
  assert.equal(result.recommendations.find(r => r.category === 'ram')?.componentId, 'ram-ddr5-32');
});

test('small form factor build checks board, cooler, GPU and power format', () => {
  const result = analyzeBuild({ ...defaultSelection, case: 'case-terra', gpu: 'gpu-4080s' });
  for (const id of ['board-size', 'cooler-height', 'gpu-length', 'psu-format']) {
    assert.ok(result.warnings.some(w => w.id === id), `Missing ${id}`);
  }
});

test('a taller cooler fits the larger case but not the default case', () => {
  const result = analyzeBuild({ ...defaultSelection, cooler: 'cooler-nhd15', case: 'case-4000d' });
  assert.ok(!result.warnings.some(w => w.id === 'cooler-height'));
  assert.ok(analyzeBuild({ ...defaultSelection, cooler: 'cooler-nhd15' }).warnings.some(w => w.id === 'cooler-height'));
});

test('insufficient PSU is distinct from recommended headroom', () => {
  const underLoad = analyzeBuild({ ...defaultSelection, cpu: 'cpu-14600kf', gpu: 'gpu-4080s', psu: 'psu-a550' });
  assert.ok(underLoad.warnings.some(w => w.id === 'psu-insufficient' && w.severity === 'error'));
  const lowHeadroom = analyzeBuild({ ...defaultSelection, psu: 'psu-a550' });
  assert.ok(lowHeadroom.warnings.some(w => w.id === 'psu-headroom' && w.severity === 'warning'));
});

test('resolution changes potential limiter, without reporting benchmark FPS', () => {
  const selection = { ...defaultSelection, cpu: 'cpu-7600', gpu: 'gpu-4070s' };
  assert.equal(analyzeBuild(selection, '1080p').balance.limiter, 'cpu');
  assert.equal(analyzeBuild(selection, '4k').balance.limiter, 'balanced');
  assert.equal(analyzeBuild(defaultSelection, '4k').balance.limiter, 'gpu');
});

test('incomplete and invalid selections cannot appear fully compatible', () => {
  const empty = Object.fromEntries(categories.map(c => [c.id, null])) as unknown as Selection;
  const result = analyzeBuild(empty);
  assert.equal(result.status, 'incomplete');
  assert.equal(result.selectedCount, 0);
  assert.equal(result.total, 0);
  assert.equal(result.balance.limiter, 'unknown');
  assert.equal(analyzeBuild({ ...defaultSelection, cpu: 'gpu-4070s' }).selectedCount, 7);
});

test('CPU cooler socket and thermal recommendations are independent', () => {
  const wrongSocket = analyzeBuild({ ...defaultSelection, cpu: 'cpu-14600kf', cooler: 'cooler-l9a' });
  assert.ok(wrongSocket.warnings.some(w => w.id === 'cooler-socket'));
  const weakCooling = analyzeBuild({ ...defaultSelection, cooler: 'cooler-l9a' });
  assert.ok(weakCooling.warnings.some(w => w.id === 'cooler-power'));
});

test('creation use recommends additional memory and Intel BIOS needs checking', () => {
  const creation = analyzeBuild(defaultSelection, '1440p', 'creation');
  assert.equal(creation.recommendations.find(r => r.category === 'ram')?.componentId, 'ram-ddr5-64');
  const intel = analyzeBuild({ ...defaultSelection, cpu: 'cpu-14600kf', motherboard: 'mb-b760', ram: 'ram-ddr4-32' });
  assert.ok(intel.warnings.some(w => w.id === 'intel-bios'));
  assert.ok(!intel.warnings.some(w => w.id === 'socket' || w.id === 'memory-type'));
});

test('candidate stays incompatible when an existing socket conflict remains', () => {
  const selection = { ...defaultSelection, cpu: 'cpu-5600' };
  const wrongIntelCpu = getComponent('cpu-14600kf')!;
  const candidateIssues = getCandidateIssues(selection, wrongIntelCpu);
  assert.ok(candidateIssues.some(w => w.id === 'socket'));
  const correctedCpu = getComponent('cpu-7600')!;
  assert.equal(getCandidateIssues(selection, correctedCpu).length, 0);
});

test('candidate compatibility includes both sides of mechanical constraints', () => {
  const selection = { ...defaultSelection, case: 'case-terra', gpu: 'gpu-4080s' };
  assert.ok(getCandidateIssues(selection, getComponent('gpu-4080s')!).some(w => w.id === 'gpu-length'));
  assert.ok(getCandidateIssues(selection, getComponent('case-terra')!).some(w => w.id === 'gpu-length'));
  assert.ok(getCandidateIssues(selection, getComponent('cooler-phantom')!).some(w => w.id === 'cooler-height'));
});

test('unrelated existing conflicts do not reject a storage candidate', () => {
  const selection = { ...defaultSelection, cpu: 'cpu-5600', ram: 'ram-ddr4-16' };
  assert.equal(getCandidateIssues(selection, getComponent('ssd-sn850-2')!).length, 0);
});

test('power requirement is evaluated when changing a GPU candidate', () => {
  const selection = { ...defaultSelection, cpu: 'cpu-14600kf', psu: 'psu-a550' };
  assert.ok(getCandidateIssues(selection, getComponent('gpu-4080s')!).some(w => w.id === 'psu-insufficient'));
  assert.ok(!getCandidateIssues(selection, getComponent('gpu-4060')!).some(w => w.id === 'psu-insufficient'));
});

test('relative performance display indices stay in range for all profiles', () => {
  for (const resolution of ['1080p', '1440p', '4k'] as const) {
    for (const usage of ['gaming', 'creation', 'general'] as const) {
      const { balance } = analyzeBuild({ ...defaultSelection, gpu: 'gpu-4080s' }, resolution, usage);
      for (const value of [balance.cpu, balance.gpu, balance.score]) assert.ok(value >= 0 && value <= 100);
    }
  }
  assert.equal(analyzeBuild(defaultSelection, '4k').balance.limiter, 'gpu');
});

test('a 360 mm AIO fits the H6 top mount without applying ventirad height rules', () => {
  assert.equal(getComponent('cooler-h150i360')?.coolingType, 'aio');
  const result = analyzeBuild({ ...defaultSelection, cooler: 'cooler-h150i360' });
  assert.ok(!result.warnings.some(w => w.id === 'radiator-fit' || w.id === 'cooler-height'));
  assert.ok(result.warnings.some(w => w.id === 'radiator-clearance' && w.description.includes('haut')));
  assert.equal(result.warnings.filter(w => w.severity === 'error').length, 0);
});

test('240 mm AIO fits the 4000D; front-only 360 mm mounting needs GPU clearance review', () => {
  const smaller = analyzeBuild({ ...defaultSelection, case: 'case-4000d', cooler: 'cooler-h100i240' });
  assert.ok(!smaller.warnings.some(w => w.id === 'radiator-fit'));
  assert.ok(!smaller.warnings.some(w => w.id === 'radiator-gpu-clearance'));
  const larger = analyzeBuild({ ...defaultSelection, case: 'case-4000d', cooler: 'cooler-h150i360' });
  assert.ok(!larger.warnings.some(w => w.id === 'radiator-fit'));
  assert.ok(larger.warnings.some(w => w.id === 'radiator-gpu-clearance' && w.severity === 'warning'));
});

test('the Terra rejects an AIO even though its pump is lower than the air cooler limit', () => {
  assert.ok((getComponent('cooler-h100i240')?.heightMm ?? Infinity) < (getComponent('case-terra')?.maxCoolerHeightMm ?? 0));
  const selection = { ...defaultSelection, case: 'case-terra', cooler: 'cooler-h100i240' };
  const result = analyzeBuild(selection);
  assert.ok(result.warnings.some(w => w.id === 'radiator-fit' && w.severity === 'error'));
  assert.ok(!result.warnings.some(w => w.id === 'cooler-height'));
  assert.ok(getCandidateIssues(selection, getComponent('cooler-h100i240')!).some(w => w.id === 'radiator-fit'));
  assert.ok(getCandidateIssues(selection, getComponent('case-terra')!).some(w => w.id === 'radiator-fit'));
});

test('a thick Arctic radiator has an explicit dimensional uncertainty warning', () => {
  const result = analyzeBuild({ ...defaultSelection, cooler: 'cooler-lfiii360' });
  assert.ok(!result.warnings.some(w => w.id === 'radiator-fit'));
  const warning = result.warnings.find(w => w.id === 'radiator-thickness');
  assert.equal(warning?.severity, 'warning');
  assert.match(warning?.description ?? '', /38 mm/);
  assert.match(warning?.description ?? '', /RAM/);
});

test('replacement recommendations do not introduce known blocking conflicts', () => {
  const selections: Selection[] = [
    { ...defaultSelection, case: 'case-terra', cooler: 'cooler-h150i360' },
    { ...defaultSelection, cpu: 'cpu-14600kf', case: 'case-q300l', cooler: 'cooler-l9a', psu: 'psu-a550' },
    { ...defaultSelection, ram: 'ram-ddr4-16', gpu: 'gpu-4080s' },
  ];
  for (const selection of selections) {
    for (const recommendation of analyzeBuild(selection).recommendations) {
      if (!recommendation.componentId) continue;
      const component = getComponent(recommendation.componentId)!;
      assert.equal(getCandidateIssues(selection, component).length, 0, `Invalid recommendation: ${component.name}`);
      if (component.category === 'cooler') {
        assert.ok(!analyzeBuild({ ...selection, cooler: component.id }).warnings.some(w => w.id === 'cooler-power'));
      }
    }
  }
});

test('newer CPUs signal firmware checks on older compatible platforms', () => {
  assert.ok(getComponent('cpu-9800x3d'));
  assert.ok(analyzeBuild({ ...defaultSelection, cpu: 'cpu-9800x3d' }).warnings.some(w => w.id === 'amd-bios'));
  assert.ok(getComponent('mb-b850-tomahawk'));
  assert.ok(!analyzeBuild({ ...defaultSelection, cpu: 'cpu-9800x3d', motherboard: 'mb-b850-tomahawk' }).warnings.some(w => w.id === 'amd-bios'));
  assert.ok(getComponent('cpu-14700kf'));
  assert.ok(analyzeBuild({ ...defaultSelection, cpu: 'cpu-14700kf', motherboard: 'mb-b760', ram: 'ram-ddr4-32' }).warnings.some(w => w.id === 'intel-bios'));
});

test('catalog-wide single replacements never recommend a known incompatible alternative', () => {
  let checked = 0;
  for (const component of catalog) {
    const selection = { ...defaultSelection, [component.category]: component.id };
    for (const recommendation of analyzeBuild(selection).recommendations) {
      if (!recommendation.componentId) continue;
      const alternative = getComponent(recommendation.componentId);
      assert.ok(alternative, `Missing recommended component ${recommendation.componentId}`);
      assert.equal(getCandidateIssues(selection, alternative).length, 0,
        `Selecting ${component.id} recommends incompatible ${alternative.id}`);
      checked++;
    }
  }
  assert.ok(checked >= catalog.length, 'The complete expanded catalog must exercise recommendation validation');
});


test('imported GPUs without performance or power data produce no invented bottleneck or PSU margin', () => {
  const gpu = catalog.find(component => component.category === 'gpu' && component.source
    && component.gamingScore === undefined && component.creationScore === undefined && component.powerW === undefined)!;
  assert.ok(gpu, 'expected an imported GPU with explicitly partial specifications');
  for (const usage of ['gaming', 'creation', 'general'] as const) {
    const analysis = analyzeBuild({ ...defaultSelection, gpu: gpu.id }, '1440p', usage);
    assert.equal(analysis.balance.available, false);
    assert.equal(analysis.balance.limiter, 'unknown');
    assert.equal(analysis.power.complete, false);
    assert.equal(analysis.power.headroom, 0);
    assert.equal(analysis.power.recommended, 0);
    assert.ok(analysis.warnings.some(warning => warning.id === 'power-unknown'));
    assert.equal(analysis.recommendations.some(recommendation => ['balance-cpu', 'balance-gpu', 'more-power', 'balanced'].includes(recommendation.id)), false);
    assert.equal(analysis.unpricedCount, 1);
    assert.equal(analysis.totalKnown, Math.round((analyzeBuild(defaultSelection).totalKnown - getComponent(defaultSelection.gpu)!.price) * 100) / 100);
  }
});

test('an unknown M.2 count on an imported motherboard is a check to perform, not a missing-slot error', () => {
  const board = catalog.find(component => component.category === 'motherboard' && component.source
    && component.socket === 'AM5' && component.memoryType === 'DDR5' && component.m2Slots === undefined)!;
  assert.ok(board, 'expected an imported AM5 board with M.2 data absent');
  const analysis = analyzeBuild({ ...defaultSelection, motherboard: board.id });
  assert.ok(analysis.warnings.some(warning => warning.id === 'storage-slot-unknown' && warning.severity === 'warning'));
  assert.equal(analysis.warnings.some(warning => warning.id === 'storage-slot'), false);
  assert.equal(getCandidateIssues({ ...defaultSelection, motherboard: board.id }, getComponent('ssd-990-1')!).some(warning => warning.id === 'storage-slot'), false);
});
