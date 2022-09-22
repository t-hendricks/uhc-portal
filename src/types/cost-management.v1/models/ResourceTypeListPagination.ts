/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ListPagination } from './ListPagination';
import type { ResourceTypeListOut } from './ResourceTypeListOut';

export type ResourceTypeListPagination = (ListPagination & {
    data: Array<ResourceTypeListOut>;
});

