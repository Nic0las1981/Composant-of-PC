import {writeFileSync,mkdirSync,readFileSync,existsSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {catalog} from '../src/data/catalog.ts';
const snapshot=JSON.parse(readFileSync(new URL('../data/catalog-source.json',import.meta.url),'utf8'));
const originals=new Map<string,unknown>(snapshot.records.map((row:{id:string;record:unknown})=>[row.id,row.record]));
const dir=new URL('../data/full-review/',import.meta.url);
mkdirSync(dir,{recursive:true});
// Preserve the pre-review identities: exporting the enriched catalogue must not
// let a previous automatic MPN assignment validate itself on a later import.
if (!process.argv.includes('--refresh')) {
  if (existsSync(new URL('input.json',dir))) process.exit(0);
  if (existsSync(new URL('input.json.gz',dir))) {
    writeFileSync(new URL('input.json',dir),gunzipSync(readFileSync(new URL('input.json.gz',dir))));
    console.log('Restored the frozen pre-review inputs');
    process.exit(0);
  }
}
writeFileSync(new URL('input.json',dir),JSON.stringify(catalog.map(c=>({...c,originalRecord:originals.get(c.id)??null})))+'\n');
console.log(`Prepared ${catalog.length} variant review inputs`);
