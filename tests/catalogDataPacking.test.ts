import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile, readdir} from 'node:fs/promises';
import {runInThisContext} from 'node:vm';
import {transformSync} from 'esbuild';
import {packCatalogData, packDataModule} from '../build/catalogDataPacking.ts';
import {unpackCatalogData} from '../src/lib/unpackCatalogData.ts';

test('packing preserves undefined, negative zero, types, key order and escaped strings', () => {
  const original = [{patch: {removed: undefined, zero: -0, positive: 0, available: false, missing: null},
    keys: {'12': 'numeric key', '2': 'first numeric key', z: 'last'},
    strings: ['~0', '~~test', '', 'écriture\n"quotes"\\', '\u2028', 'https://example.com/repeated', 'https://example.com/repeated'],
    array: [undefined, [], {}, -1, -2, -3, true, 1.25]}];
  const result = unpackCatalogData(packCatalogData(original)) as typeof original;
  assert.deepEqual(result, original);
  assert.ok(Object.hasOwn(result[0].patch, 'removed'));
  assert.ok(Object.is(result[0].patch.zero, -0));
  assert.deepEqual(Object.keys(result[0].keys), Object.keys(original[0].keys));
  assert.equal(packCatalogData(original), packCatalogData(original));
});

test('equal records, patches, arrays and sources remain independently mutable', () => {
  const original = [
    {patch: {heightMm: 2.42}, sources: [{url: 'https://example.com/exact-source'}], rows: ['repeated label']},
    {patch: {heightMm: 2.42}, sources: [{url: 'https://example.com/exact-source'}], rows: ['repeated label']},
  ];
  const result = unpackCatalogData(packCatalogData(original)) as typeof original;
  result[0].patch.heightMm = 9.2;
  result[0].sources[0].url = 'changed';
  result[0].rows.push('another row');
  assert.deepEqual(result[1], original[1]);
  assert.notEqual(result[0].patch, result[1].patch);
  assert.notEqual(result[0].sources[0], result[1].sources[0]);
  assert.notEqual(result[0].rows, result[1].rows);
});

test('build transform leaves expressions, getters, spreads, prototype setters and sparse arrays as code', () => {
  const valid = `const large = ${JSON.stringify(Array.from({length: 100}, () => ({label: 'A repeated documented characteristic', source: 'https://manufacturer.example/exact-model'})))};`;
  const source = `
    const ref = {value: 1};
    const spread = {...ref};
    const getter = {get field() { return 2; }};
    const computed = {["dynamic" + "key"]: 3};
    const prototype = {__proto__: null, value: 1};
    const sparse = [1,,3];
    const reference = {ref};
    const call = Array.from([1,2]);
  `;
  const packed = packDataModule(valid + source, 'mixed.ts', 'decoder', 0)!;
  assert.ok(packed);
  assert.ok(packed.code.includes('const spread = {...ref}'));
  assert.ok(packed.code.includes('const getter = {get field()'));
  assert.ok(packed.code.includes('const prototype = {__proto__: null'));
  assert.ok(packed.code.includes('const sparse = [1,,3]'));
  assert.ok(packed.code.includes('const reference = {ref}'));
  assert.ok(packed.code.includes('const call = Array.from([1,2])'));
  assert.equal(packDataModule('const undefined = 7; const x = {a: undefined};', 'shadow.ts', 'decoder', 0), null);
  assert.equal(packDataModule('function undefined() {};' + valid, 'shadow.ts', 'decoder', 0), null);
  assert.equal(packDataModule('const {undefined} = other;' + valid, 'shadow.ts', 'decoder', 0), null);
});

test('all large catalog literals match their original JavaScript values and preserve record order', async () => {
  const directory = new URL('../src/data/', import.meta.url);
  let checkedModules = 0, checkedLiterals = 0, sourceBytes = 0, packedBytes = 0;
  for (const file of (await readdir(directory)).filter(file => file.endsWith('.ts')).sort()) {
    const source = await readFile(new URL(file, directory), 'utf8');
    if (source.length < 20_000) continue;
    const packed = packDataModule(source, file, 'decoder');
    if (!packed) continue;
    const code = transformSync(`(${`[${packed.originalLiterals.join(',\n')}]`})`, {loader: 'ts', target: 'es2022'}).code;
    const expected = runInThisContext(code, {filename: file});
    const actual = unpackCatalogData(packed.payload);
    assert.deepEqual(actual, expected, file);
    for (let index = 0; index < actual.length; index++) {
      if (actual[index] && typeof actual[index] === 'object') {
        assert.deepEqual(Object.keys(actual[index] as object), Object.keys(expected[index]), `${file}: record order`);
      }
    }
    assert.equal(packDataModule(source, file, 'decoder')!.payload, packed.payload, `${file}: deterministic encoding`);
    checkedModules++;
    checkedLiterals += packed.literalCount;
    sourceBytes += packed.originalBytes;
    packedBytes += packed.packedBytes;
  }
  assert.ok(checkedModules > 25, `${checkedModules} modules`);
  assert.ok(checkedLiterals > 120, `${checkedLiterals} literals`);
  assert.ok(packedBytes < sourceBytes * 0.5, `${packedBytes}/${sourceBytes} bytes`);
});
