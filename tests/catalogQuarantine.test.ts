import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,getComponent} from '../src/data/catalog.ts';
import {catalogQuarantine,isQuarantinedReference} from '../src/data/catalogQuarantine.ts';
import {verifiedProducts} from '../src/data/verifiedCatalog.ts';
import {getVerifiedProduct,getVerifiedOffer} from '../src/lib/verifiedOffers.ts';
import {getReferencePrice} from '../src/data/pricing.ts';

test('demonstrated wrong identities never supply the product sheet or a budget price',()=>{
  assert.ok(Object.keys(catalogQuarantine).length>=29);
  for(const [id,exclusion] of Object.entries(catalogQuarantine)){
    const component=getComponent(id)!;
    assert.ok(component,id);
    const product=getVerifiedProduct(component);
    assert.ok(!product||!isQuarantinedReference(id,product.mpn),id);
    assert.ok(!product?.offers.some(offer=>isQuarantinedReference(id,offer.mpn)),id);
    if(!product){
      assert.equal(component.manufacturerPartNumber,undefined,id);
      assert.equal(getVerifiedOffer(component),undefined,id);
      assert.equal(getReferencePrice(component),null,id);
    }
    assert.ok(exclusion.reason.trim()&&exclusion.sourceURLs.every(url=>url.startsWith('https://')),id);
  }
});

test('capacity and internal-drive identities survive rejection of a neighboring retail SKU',()=>{
  const wrong4tb=getComponent('import-ssd-c684100ebdf8')!;
  assert.equal(wrong4tb.capacityGB,4000);
  assert.equal(getVerifiedProduct(wrong4tb),undefined);
  const correct2tb=getComponent('ssd-990evo-2')!;
  assert.equal(correct2tb.capacityGB,2000);
  assert.equal(getVerifiedProduct(correct2tb)?.mpn,'MZ-V9S2T0BW');
  const internal=getComponent('import-ssd-01c097994185')!;
  assert.equal(internal.storageInterface,'M.2 NVMe');
  assert.equal(getVerifiedProduct(internal),undefined);
});

test('corrected references remain usable independently of their rejected predecessors',()=>{
  const cooler=getComponent('cooler-ak620')!;
  assert.equal(cooler.manufacturerPartNumber,'R-AK620-BKNNMT-G');
  assert.equal(getVerifiedProduct(cooler)?.mpn,'R-AK620-BKNNMT-G');
  assert.deepEqual(getVerifiedProduct(cooler)?.offers,[]);
  assert.equal(getReferencePrice(cooler),null,'the corrected cooler cannot reuse a price for ZERO DARK');
  const board=getComponent('import-mb-fcc33592f0ce')!;
  assert.equal(getVerifiedProduct(board)?.mpn,'A520M PRO');
  assert.deepEqual(getVerifiedProduct(board)?.offers,[]);
  assert.ok(getVerifiedProduct(board)?.sources.every(source=>!source.url.includes('a520m-a-pro')));
  for(const c of catalog){
    const product=verifiedProducts[c.id];
    if(product)assert.equal(c.manufacturerPartNumber,product.mpn,c.id);
  }
});

test('the exact manufacturer table resolves the UD85 interface and physical-height errors',()=>{
  const ssd=getComponent('import-ssd-a56f9a7de0e6')!;
  const product=getVerifiedProduct(ssd)!;
  assert.equal(product.mpn,'SP01KGBP44UD8505');
  assert.deepEqual([ssd.lengthMm,ssd.widthMm,ssd.heightMm],[80,22,3.5]);
  assert.ok(product.sources.some(source=>source.kind==='manufacturer'&&source.url.endsWith('PCIe-Gen4-x4-UD85')));
  const rows=product.groups.flatMap(group=>group.rows);
  assert.ok(rows.some(row=>row.value==='PCIe 4.0 x4 · NVMe 1.4'));
  assert.ok(!rows.some(row=>/x16|×16/.test(row.value)));
});
