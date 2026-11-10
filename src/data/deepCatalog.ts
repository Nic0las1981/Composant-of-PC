import type {VerifiedProduct} from './verifiedTypes.ts';
import {deepMotherboardProducts} from './deepMotherboardCatalog.ts';
import {deepGpuProducts} from './deepGpuCatalog.ts';
import {deepMemoryStorageProducts} from './deepMemoryStorageCatalog.ts';
import {deepPowerChassisProducts} from './deepPowerChassisCatalog.ts';
import {deepStorageNicheProducts} from './deepStorageNicheCatalog.ts';
import {deepStorageInlandProducts} from './deepStorageInlandCatalog.ts';
import {deepStorageWestProducts} from './deepStorageWestCatalog.ts';
import {deepStorageOtherProducts} from './deepStorageOtherCatalog.ts';
import {deepStorageBoardsProducts} from './deepStorageBoardsCatalog.ts';
import {deepStorageBoardsCorrections} from './deepStorageBoardsCorrections.ts';
import {deepPowerNicheProducts} from './deepPowerNicheCatalog.ts';
import {deepPowerFlowerProducts} from './deepPowerFlowerCatalog.ts';
import {deepPowerSilverstoneProducts} from './deepPowerSilverstoneCatalog.ts';
import {deepFspProducts} from './deepFspCatalog.ts';
import {deepPowerAntecProducts} from './deepPowerAntecCatalog.ts';
import {deepPowerEnermaxProducts} from './deepPowerEnermaxCatalog.ts';

export const deepProducts:Record<string,VerifiedProduct>={
  ...deepMotherboardProducts,
  ...deepGpuProducts,
  ...deepMemoryStorageProducts,
  ...deepPowerChassisProducts,
  ...deepStorageNicheProducts,
  ...deepStorageInlandProducts,
  ...deepStorageWestProducts,
  ...deepStorageOtherProducts,
  ...deepStorageBoardsProducts,
  ...deepStorageBoardsCorrections,
  ...deepPowerNicheProducts,
  ...deepPowerFlowerProducts,
  ...deepPowerSilverstoneProducts,
  ...deepFspProducts,
  ...deepPowerAntecProducts,
  ...deepPowerEnermaxProducts,
};
