/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Currencies } from './Currencies';
import type { ListPagination } from './ListPagination';

export type Currency = (ListPagination & {
    data: Array<Currencies>;
});

