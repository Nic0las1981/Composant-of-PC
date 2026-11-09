import test from 'node:test';
import assert from 'node:assert/strict';
import { categories, defaultSelection, getComponent } from '../src/data/catalog.ts';
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
  const empty = Object.fromEntries(categories.map(c => [c.id, null])) as Selection;
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
