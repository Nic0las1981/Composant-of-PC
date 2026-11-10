import test from 'node:test';
import assert from 'node:assert/strict';
import {deepPowerNicheProducts as products} from '../src/data/deepPowerNicheCatalog.ts';
import {getCatalogCompletion} from '../src/lib/catalogCompletion.ts';
import {getComponent} from '../src/data/catalog.ts';

test('all 46 Montech/XPG models retain explicit identity evidence without choosing regional ordering codes',()=>{
 assert.equal(Object.keys(products).length,46);
 for(const [id,p] of Object.entries(products)){
  assert.equal(p.identityKind,'manufacturer-model',id);assert.equal(p.mpn,'',id);
  assert.ok(p.manufacturerModel&&p.sources.every(s=>s.kind==='manufacturer'),id);
  assert.equal(p.offers.length,0,id);assert.ok(p.groups[0].rows.length>=10,id);
 }
});
test('older Gamma 650 W rail capacity and newer Century II cable counts use their own tables',()=>{
 const gamma=products['import-psu-32f8cfbc5a9a'],century=products['import-psu-88404d54d770'];
 assert.equal(gamma.patch.wattage,650);
 assert.ok(gamma.groups[0].rows.some(r=>r.label==='Rail +12 V'&&r.value==='636W'));
 assert.equal(century.patch.wattage,1050);
 assert.ok(century.groups[0].rows.some(r=>r.label==='Connecteurs'&&r.value.includes('PCIe : 3 câble(s) × 2 (6+2 Pins)')));
});
test('XPG connector generation stays unresolved when manufacturer revisions reuse a model',()=>{
 const id='import-psu-12cc854046f1',p=products[id],c=getComponent(id)!;
 const f=getCatalogCompletion(c,p).technical.fields.find(f=>f.key==='atx');
 assert.equal(f?.state,'conflicting');assert.equal(p.patch.depthMm,140);
 const original=products['import-psu-4f5f1fce3a8d'];
 assert.ok(original.sources.some(s=>s.url.includes('Core%20Reactor%20_QSG.pdf')));
 assert.ok(!original.groups[0].rows.some(r=>r.value.includes('12V-2x6')));
});
