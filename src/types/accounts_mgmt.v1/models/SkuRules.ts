/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type SkuRules = (ObjectReference & {
    allowed?: number;
    quota_id?: string;
    sku?: string;
});

