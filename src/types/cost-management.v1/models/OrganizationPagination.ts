/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ListPagination } from './ListPagination';
import type { Organization } from './Organization';

export type OrganizationPagination = (ListPagination & {
    data: Array<Organization>;
});

