/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type RelatedResource = (ObjectReference & {
    availability_zone_type: string;
    billing_model: string;
    byoc: string;
    cloud_provider: string;
    cost: number;
    product: string;
    product_id?: string;
    resource_name?: string;
    resource_type: string;
});

