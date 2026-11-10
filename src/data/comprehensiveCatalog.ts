import {comprehensiveBoardGpu} from './comprehensiveBoardGpu.ts';
import {comprehensiveMemoryStorage} from './comprehensiveMemoryStorage.ts';
import {comprehensivePowerChassisRecords} from './comprehensivePowerChassis.ts';
import {comprehensiveCorrections} from './comprehensiveCorrections.ts';
import {comprehensiveCpuRecords} from './comprehensiveCpu.ts';
import type {VerifiedProduct} from './verifiedTypes.ts';

export const comprehensiveProducts:Record<string,VerifiedProduct>={...comprehensiveBoardGpu,...comprehensiveMemoryStorage,...comprehensivePowerChassisRecords,...comprehensiveCorrections,...comprehensiveCpuRecords};
