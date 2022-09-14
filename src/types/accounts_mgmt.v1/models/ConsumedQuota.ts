/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type ConsumedQuota = (ObjectReference & {
    availability_zone_type?: string;
    billing_model?: string;
    byoc: boolean;
    cloud_provider_id?: string;
    count: number;
    organization_id?: string;
    plan_id?: string;
    resource_name?: string;
    resource_type?: string;
    version?: string;
});

