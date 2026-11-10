import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { catalog, getComponent, defaultSelection } from '../src/data/catalog.ts';
import { verifiedProducts } from '../src/data/verifiedCatalog.ts';
import { getVerifiedOffer, getVerifiedProduct, isCurrentVerifiedOffer, VERIFIED_OFFER_MAX_AGE_MS } from '../src/lib/verifiedOffers.ts';
import { getReferencePrice, getPricingInfo } from '../src/data/pricing.ts';
import { analyzeBuild } from '../src/lib/compatibility.ts';
import { getMemoryAnalysis, resetMemoryToKit, withMemoryQuantity } from '../src/lib/memory.ts';

test('reviewed records retain stable IDs, canonical MPNs, dated primary sources and exact-variant offers', () => {
  assert.ok(Object.keys(verifiedProducts).length >= 162);
  for (const [id, product] of Object.entries(verifiedProducts)) {
    const component = getComponent(id)!;
    assert.ok(component, id);
    if(product.identityKind==='manufacturer-model') {
      assert.equal(product.mpn,'',id);
      assert.equal(component.manufacturerPartNumber,undefined,id);
      assert.equal(component.manufacturerModel,product.manufacturerModel,id);
      assert.deepEqual(product.offers,[],id);
    } else assert.equal(component.manufacturerPartNumber, product.mpn, id);
    assert.ok(product.sources.length, id);
    for (const source of product.sources) {
      const url=new URL(source.url);
      const publishedHistoricalDocument=url.protocol==='http:' && (
        source.kind==='manufacturer' && ['hkftp.zotac.com','www.technikpr.de'].includes(url.hostname) && url.pathname.endsWith('.pdf')
        || source.kind==='retailer' && url.hostname==='www.rootnet.com.ua' && url.pathname.includes('/fsp/222-blok-pitanija-fsp-everest-800-85-'));
      assert.ok(url.protocol==='https:' || publishedHistoricalDocument,source.url);
      assert.ok(Number.isFinite(Date.parse(source.checkedAt)));
    }
    for (const offer of product.offers) {
      assert.equal(new URL(offer.url).protocol,'https:');
      assert.equal(offer.mpn, product.mpn, id);
      assert.ok(offer.amount > 0 && Number.isFinite(offer.amount));
      assert.equal(offer.currency, 'EUR');
      assert.equal(offer.market, 'FR');
      assert.ok(offer.shipping === null || offer.shipping >= 0);
    }
  }
  assert.equal(getVerifiedProduct({...getComponent('cpu-7800x3d')!, manufacturerPartNumber:'100-000000910'}), undefined);
  assert.equal(getVerifiedProduct({...getComponent('cpu-7800x3d')!, id:'different-product'}), undefined);
  assert.equal(catalog.filter(c => c.id === 'cpu-7800x3d').length, 1);
});

test('price eligibility expires after 24 h and rejects future, historical, used and unavailable observations', () => {
  const offer = verifiedProducts['cpu-7800x3d'].offers.find(o => o.retailer === 'PcComponentes')!;
  const checked = Date.parse(offer.checkedAt);
  assert.equal(isCurrentVerifiedOffer(offer, checked - 1), false);
  assert.equal(isCurrentVerifiedOffer(offer, checked), true);
  assert.equal(isCurrentVerifiedOffer(offer, checked + VERIFIED_OFFER_MAX_AGE_MS), true);
  assert.equal(isCurrentVerifiedOffer(offer, checked + VERIFIED_OFFER_MAX_AGE_MS + 1), false);
  for (const change of [{amount:0},{amount:NaN},{condition:'refurbished' as const},{availability:'out_of_stock' as const},{availability:'unknown' as const},{priceKind:'last_known' as const},{checkedAt:'invalid'}]) {
    assert.equal(isCurrentVerifiedOffer({...offer,...change}, checked), false);
  }
});

test('the cheapest exact new offer enters the budget with its date and source, excluding delivery', t => {
  const product = verifiedProducts['cpu-7800x3d'];
  const now = Math.max(...product.offers.map(o => Date.parse(o.checkedAt))) + 1000;
  t.mock.method(Date, 'now', () => now);
  const cpu = getComponent('cpu-7800x3d')!;
  assert.equal(getVerifiedOffer(cpu)?.retailer, 'PcComponentes');
  assert.equal(getReferencePrice(cpu), 316.36);
  const info = getPricingInfo(cpu);
  assert.equal(info.status, 'verified');
  assert.equal(info.source?.independentlyVerified, true);
  assert.ok(info.checkedAt);
  assert.match(info.description, /TTC.*Hors livraison/);
  const before = analyzeBuild({...defaultSelection, cpu:null});
  const after = analyzeBuild(defaultSelection);
  assert.equal(Math.round((after.totalKnown-before.totalKnown)*100), 31636);
});

test('historical prices never resurrect an initial estimate and old offers stop funding the budget', t => {
  const ram = getComponent('ram-ddr5-32')!;
  const historic=verifiedProducts[ram.id].offers.filter(offer=>offer.priceKind==='last_known');
  assert.ok(historic.length);
  const current=verifiedProducts[ram.id];
  verifiedProducts[ram.id]={...current,offers:historic};
  try { assert.equal(getReferencePrice(ram),null); }
  finally { verifiedProducts[ram.id]=current; }
  const cpu = getComponent('cpu-7800x3d')!;
  const last = Math.max(...verifiedProducts[cpu.id].offers.map(o => Date.parse(o.checkedAt)));
  t.mock.method(Date, 'now', () => last + VERIFIED_OFFER_MAX_AGE_MS + 1);
  assert.equal(getReferencePrice(cpu), null);
});

test('manufacturer corrections reach compatibility metadata without turning TDP into a power measurement', () => {
  const gpu = getComponent('gpu-4070s')!;
  assert.equal(gpu.lengthMm, 267.01);
  assert.equal(gpu.recommendedPsuW, 750);
  assert.equal(getComponent('mb-b650')!.maxMemoryGB, 256);
  assert.equal(getComponent('ram-ddr5-32')!.memoryProfile, 'EXPO/XMP');
  assert.equal(getComponent('ram-ddr5-32')!.memoryVoltageV, 1.4);
  assert.equal(getComponent('cpu-7600')!.powerW, undefined);
  assert.equal(getComponent('cpu-14600kf')!.powerW, 181);
  assert.match(verifiedProducts['cpu-7800x3d'].notes.join(' '), /AM4.*AM5/);
});

test('retailer stock belongs to the product rather than a recommendation carousel', () => {
  const intel = verifiedProducts['cpu-12600kf'].offers.find(o => o.retailer === 'LDLC')!;
  assert.equal(intel.availability, 'out_of_stock');
  const evidence = JSON.parse(readFileSync(new URL('../data/evidence/ldlc-12600kf.json', import.meta.url), 'utf8'));
  assert.match(evidence.markdown, /Rupture[\s\S]+En _stock_/);
  assert.equal(verifiedProducts['psu-rm750e'].offers[0].availability, 'in_stock');
  assert.equal(verifiedProducts['cpu-13700kf'].offers.find(o => o.retailer === 'PcComponentes')!.condition, 'refurbished');
});

test('three installed modules buy two full verified kits and display the total rather than a single-kit offer', t => {
  const ram = catalog.find(c => c.category === 'ram' && c.memorySticks === 2 && verifiedProducts[c.id]?.offers.some(o => o.condition === 'new' && o.availability === 'in_stock' && o.priceKind === 'current'))!;
  assert.ok(ram);
  const product = verifiedProducts[ram.id];
  t.mock.method(Date, 'now', () => Math.max(...product.offers.map(o => Date.parse(o.checkedAt))) + 1000);
  const unitPrice = getReferencePrice(ram)!;
  const memory = getMemoryAnalysis(withMemoryQuantity(resetMemoryToKit(defaultSelection, ram.id), 3));
  assert.equal(memory.purchases[0].kits, 2);
  assert.equal(memory.totalPrice, Math.round(unitPrice * 200) / 100);
  assert.equal(getReferencePrice(memory.aggregate!), memory.totalPrice);
  assert.equal(getVerifiedOffer(memory.aggregate!), undefined);
  assert.match(getPricingInfo(memory.aggregate!).description, /kits entiers/);
});
