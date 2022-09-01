/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type QuotaRules = (ObjectReference & {
    availability_zone?: string;
    billing_model?: string;
    byoc?: string;
    cloud?: string;
    cost: number;
    name?: string;
    product?: string;
    quota_id?: string;
    type?: string;
});

