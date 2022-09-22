/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type ReservedResource = (ObjectReference & {
    availability_zone_type?: string;
    billing_marketplace_account?: string;
    billing_model?: string;
    byoc: boolean;
    cluster?: boolean;
    count?: number;
    created_at?: string;
    resource_name?: string;
    resource_type?: string;
    subscription?: ObjectReference;
    updated_at?: string;
});

