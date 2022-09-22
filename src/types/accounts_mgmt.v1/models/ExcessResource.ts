/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type ExcessResource = (ObjectReference & {
    availability_zone_type?: string;
    billing_model?: string;
    byoc: boolean;
    count?: number;
    resource_name?: string;
    resource_type?: string;
});

