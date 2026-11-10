import {createHash} from 'node:crypto';
import path from 'node:path';
import type {Plugin} from 'vite';
import {packDataModule} from './catalogDataPacking.ts';

/** Production-only representation optimization. Source data and collectors stay
 * readable and untouched; development and tests retain their ordinary imports.
 */
export function catalogDataPlugin(): Plugin {
  let dataDirectory = '';
  let decoderImport = '';
  const report: Array<{file: string; sourceSHA256: string; literals: number; sourceBytes: number; packedModuleBytes: number}> = [];
  return {
    name: 'forge-compact-catalog-data',
    apply: 'build',
    enforce: 'pre',
    configResolved(config) {
      dataDirectory = path.resolve(config.root, 'src/data') + path.sep;
      decoderImport = path.resolve(config.root, 'src/lib/unpackCatalogData.ts').replaceAll(path.sep, '/');
    },
    buildStart() { report.length = 0; },
    transform(source, id) {
      if (!id.startsWith(dataDirectory) || !id.endsWith('.ts') || source.length < 20_000) return null;
      const packed = packDataModule(source, id, decoderImport);
      if (!packed) return null;
      report.push({file: `src/data/${path.basename(id)}`, sourceSHA256: createHash('sha256').update(source).digest('hex'),
        literals: packed.literalCount, sourceBytes: packed.originalBytes, packedModuleBytes: packed.packedBytes});
      return {code: packed.code, map: null};
    },
    generateBundle() {
      report.sort((a, b) => a.file.localeCompare(b.file, 'en'));
      this.emitFile({type: 'asset', fileName: 'catalog-packing-report.json', source: JSON.stringify({format: 1,
        losslessRoundTripVerified: true, modules: report}, null, 2)});
    },
  };
}
