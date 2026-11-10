import {individualPsuRecords} from './individualPsu.ts';
import {individualBoardGpu} from './individualBoardGpu.ts';
import {individualRamStorage} from './individualRamStorage.ts';
import type {VerifiedProduct} from './verifiedTypes.ts';

export const individualProducts:Record<string,VerifiedProduct>={...individualPsuRecords,...individualBoardGpu,...individualRamStorage};
