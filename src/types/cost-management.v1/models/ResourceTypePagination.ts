/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ListPagination } from './ListPagination';
import type { ResourceTypeOut } from './ResourceTypeOut';

export type ResourceTypePagination = (ListPagination & {
    data: Array<ResourceTypeOut>;
});

