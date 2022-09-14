/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type ResourceQuota = (ObjectReference & {
    created_at?: string;
    organization_id?: string;
    sku?: string;
    sku_count: number;
    type?: ResourceQuota.type;
    updated_at?: string;
});

export namespace ResourceQuota {

    export enum type {
        CONFIG = 'Config',
        MANUAL = 'Manual',
        SUBSCRIPTION = 'Subscription',
    }


}

