import test from 'node:test';
import assert from 'node:assert/strict';
import { deepMotherboardProducts as products } from '../src/data/deepMotherboardCatalog.ts';

test('every motherboard field evidence points to a retained manufacturer source', () => {
  for (const [id, product] of Object.entries(products)) {
    assert.ok(product.sources.some(source => source.kind === 'manufacturer'), id);
    assert.ok(product.groups.some(group => group.rows.length > 0), id);
    for (const evidence of Object.values(product.fieldEvidence ?? {})) {
      assert.ok(product.sources.some(source => source.url === evidence.sourceURL), `${id}: ${evidence.sourceURL}`);
      assert.ok(Number.isFinite(Date.parse(evidence.checkedAt)), id);
    }
  }
});

test('manufacturer models cannot masquerade as commercial SKUs or offer prices', () => {
  for (const [id, product] of Object.entries(products)) {
    if (product.identityKind === 'manufacturer-model') {
      assert.equal(product.mpn, '', id);
      assert.ok(product.manufacturerModel?.trim(), id);
      assert.equal(product.patch.manufacturerPartNumber, undefined, id);
      assert.deepEqual(product.offers, [], id);
    }
    for (const offer of product.offers) assert.equal(offer.mpn, product.mpn, id);
  }
});

test('known technical identity distinctions remain explicit', () => {
  assert.equal(products['mb-b650-tuf'].patch.maxMemoryPerSlotGB, undefined);
  assert.equal(products['import-mb-bf441b24004c'].mpn, 'N7-Z69XT-B1');
  assert.equal(products['import-mb-7a5b3d0ce34e'].mpn, 'N7-Z69XT-W1');
  assert.equal(products['import-mb-55843e02ed1f'].patch.m2Slots, 0, 'ECS B450AM4-M has SATA SSD and WLAN sockets, no NVMe storage socket');
  assert.equal(products['import-mb-f288a865066c'].patch.m2Slots, 2, 'EVGA Key-E wireless socket is excluded');
  assert.equal(products['import-mb-f288a865066c'].mpn, '121-VR-A577-KR');
});
