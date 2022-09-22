/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ListPagination } from './ListPagination';
import type { UserAccessTypeOut } from './UserAccessTypeOut';

export type UserAccessListPagination = (ListPagination & {
    data: Array<UserAccessTypeOut>;
});

