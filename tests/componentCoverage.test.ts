import test from 'node:test';
import assert from 'node:assert/strict';
import {getComponent,type Component} from '../src/data/catalog.ts';
import {getMissingCompatibilityFields,hasPartialCompatibility} from '../src/lib/componentCoverage.ts';

test('a completed imported board no longer inherits a stale partial warning',()=>{
  const board:Component={...getComponent('mb-b650')!,detailLevel:'partial',m2Slots:4};
  assert.equal(hasPartialCompatibility(board),false);
  assert.deepEqual(getMissingCompatibilityFields({...board,m2Slots:undefined}).map(f=>f.key),['m2Slots']);
  assert.equal(hasPartialCompatibility({...board,m2Slots:undefined}),true);
});

test('an explicit absence of M.2 slots is a known constraint, not missing information',()=>{
  const board={...getComponent('mb-b650')!,detailLevel:'partial' as const,m2Slots:0};
  assert.equal(hasPartialCompatibility(board),false);
});

test('unknown or invalid GPU dimensions and power stay visible after other fields are filled',()=>{
  const gpu={...getComponent('gpu-4070s')!,detailLevel:'partial' as const,heightMm:0,powerW:undefined};
  const missing=getMissingCompatibilityFields(gpu).map(f=>f.key);
  assert.ok(missing.includes('heightMm'));
  assert.ok(missing.includes('powerW'));
  assert.equal(hasPartialCompatibility(gpu),true);
});
