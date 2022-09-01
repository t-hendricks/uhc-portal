/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TagRate } from './TagRate';
import type { TieredRate } from './TieredRate';

export type CostModelResp = {
    name: string;
    description: string;
    currency?: string;
    source_type: string;
    sources?: Array<{
        uuid?: string;
        name?: string;
    }>;
    rates?: Array<(TieredRate | TagRate)>;
    distribution?: CostModelResp.distribution;
};

export namespace CostModelResp {

    export enum distribution {
        MEMORY = 'memory',
        CPU = 'cpu',
    }


}

