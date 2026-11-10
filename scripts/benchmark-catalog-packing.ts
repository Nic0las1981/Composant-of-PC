/** Run with node --expose-gc --import tsx scripts/benchmark-catalog-packing.ts.
 * Both paths use the same immutable in-memory snapshot of source files. These
 * are local engine timings, not a hardware FPS or network-speed claim.
 */
import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {compileFunction} from 'node:vm';
import {gzipSync} from 'node:zlib';
import {transformSync} from 'esbuild';
import {packDataModule} from '../build/catalogDataPacking.ts';
import {unpackCatalogData} from '../src/lib/unpackCatalogData.ts';

const output = process.env.FORGE_PACKING_REPORT ?? '/tmp/forge-catalog-packing-benchmark.json';
const productionFiles = process.env.FORGE_PACKING_MANIFEST ? new Set(
  (JSON.parse(readFileSync(process.env.FORGE_PACKING_MANIFEST, 'utf8')).modules as Array<{file: string}>).map(module => module.file),
) : null;
const modules: Array<{file: string; originalBody: string; packedBody: string; literals: number; records: number}> = [];
for (const file of readdirSync('src/data').filter(file => file.endsWith('.ts')).sort()) {
  if (productionFiles && !productionFiles.has(`src/data/${file}`)) continue;
  const source = readFileSync(`src/data/${file}`, 'utf8');
  if (source.length < 20_000) continue;
  const packed = packDataModule(source, file, 'decoder');
  if (!packed) continue;
  const declaration = transformSync(`const values=[${packed.originalLiterals.join(',\n')}];`, {loader: 'ts', target: 'es2022', minify: true}).code;
  modules.push({file, originalBody: `${declaration}\nreturn values;`, packedBody: `return unpack(${JSON.stringify(packed.payload)});`,
    literals: packed.literalCount, records: packed.roots.reduce<number>((sum, value) => sum + (value && typeof value === 'object' ? Object.keys(value).length : 1), 0)});
}

function run(packed: boolean, coldTrial?: number) {
  globalThis.gc?.();
  let compileMs = 0, initializeMs = 0, records = 0;
  for (const module of modules) {
    let start = performance.now();
    // V8 caches compileFunction by source text. A unique comment gives each
    // cold trial a new cache key, while the warm series deliberately reuses it.
    const body = (coldTrial === undefined ? '' : `/* cold trial ${coldTrial} */\n`) + (packed ? module.packedBody : module.originalBody);
    const evaluate = compileFunction(body, ['unpack']);
    compileMs += performance.now() - start;
    start = performance.now();
    const roots = evaluate(unpackCatalogData) as unknown[];
    initializeMs += performance.now() - start;
    records += roots.reduce<number>((sum, value) => sum + (value && typeof value === 'object' ? Object.keys(value).length : 1), 0);
  }
  return {compileMs, initializeMs, totalMs: compileMs + initializeMs, records};
}
const trials = [];
for (let index = 0; index < 5; index++) {
  // Alternate order to reduce warm-cache and thermal bias.
  if (index % 2) { const packed = run(true, index); trials.push({original: run(false, index), packed}); }
  else { const original = run(false, index); trials.push({original, packed: run(true, index)}); }
}
run(false); run(true);
const warmTrials = Array.from({length: 3}, () => ({original: run(false), packed: run(true)}));
const median = (values: number[]) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
const totals = (kind: 'original' | 'packed', values = trials) => ({compileMs: median(values.map(trial => trial[kind].compileMs)),
  initializeMs: median(values.map(trial => trial[kind].initializeMs)), totalMs: median(values.map(trial => trial[kind].totalMs))});
const original = modules.map(module => module.originalBody).join('\n');
const packed = modules.map(module => module.packedBody).join('\n');
const result = {node: process.version, scope: 'Static data compilation + initialization, same source snapshot; excludes React/3D/network',
  moduleCount: modules.length, literalCount: modules.reduce((sum, module) => sum + module.literals, 0),
  original: {bytes: Buffer.byteLength(original), gzipBytes: gzipSync(original, {level: 9}).length, ...totals('original')},
  packed: {bytes: Buffer.byteLength(packed), gzipBytes: gzipSync(packed, {level: 9}).length, ...totals('packed')}, trials,
  warmCache: {original: totals('original', warmTrials), packed: totals('packed', warmTrials), trials: warmTrials},
  modules: modules.map(({file, originalBody, packedBody, literals, records}) => ({file, literals, records, originalBytes: Buffer.byteLength(originalBody), packedBytes: Buffer.byteLength(packedBody)}))};
writeFileSync(output, JSON.stringify(result, null, 2));
console.log(JSON.stringify({...result, modules: undefined}, null, 2));
