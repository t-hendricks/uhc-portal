/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { ResourceQuota } from './ResourceQuota';

export type ResourceQuotaList = (List & {
    items?: Array<ResourceQuota>;
});

