import type { VerifiedProduct } from './verifiedTypes.ts';
import { deepAsusMotherboardProducts } from './deepAsusMotherboards.ts';
import { deepGigabyteMotherboardProducts } from './deepGigabyteMotherboards.ts';
import { deepMsiMotherboardProducts } from './deepMsiMotherboards.ts';
import { deepBiostarMotherboardProducts } from './deepBiostarMotherboards.ts';
import { deepAsrockMotherboardProducts } from './deepAsrockMotherboards.ts';
import { deepNzxtMotherboardProducts } from './deepNzxtMotherboards.ts';
import { deepOtherMotherboardProducts } from './deepOtherMotherboards.ts';
import { deepEcsEvgaMotherboardProducts } from './deepEcsEvgaMotherboards.ts';
import { deepAsusManualMotherboardProducts } from './deepAsusManualMotherboards.ts';
import { deepAsusPartialMotherboardProducts } from './deepAsusPartialMotherboards.ts';

/** Older collectors stored the documented model in `mpn`. A model is not a sales SKU. */
function preserveIdentity(product: VerifiedProduct): VerifiedProduct {
  if (product.identityKind === 'mpn' || (product.mpn && product.sources.some(source => source.kind === 'retailer'))) return product;
  const manufacturerModel = product.manufacturerModel || product.mpn;
  return {
    ...product,
    identityKind: 'manufacturer-model',
    manufacturerModel,
    mpn: '',
    offers: [],
    patch: { ...product.patch, manufacturerPartNumber: undefined, manufacturerModel },
  };
}

export const deepMotherboardProducts: Record<string, VerifiedProduct> = Object.fromEntries(
  Object.entries({
    ...deepAsusMotherboardProducts,
    ...deepGigabyteMotherboardProducts,
    ...deepMsiMotherboardProducts,
    ...deepBiostarMotherboardProducts,
    ...deepAsrockMotherboardProducts,
    ...deepNzxtMotherboardProducts,
    ...deepOtherMotherboardProducts,
    ...deepEcsEvgaMotherboardProducts,
    ...deepAsusManualMotherboardProducts,
    ...deepAsusPartialMotherboardProducts,
  }).map(([id, product]) => [id, preserveIdentity(product)]),
);

// ASUS now documents the system capacity; the older retailer per-DIMM ceiling is stale.
// A replacement per-slot maximum cannot be derived by dividing the system total.
deepMotherboardProducts['mb-b650-tuf'].patch.maxMemoryPerSlotGB = undefined;
