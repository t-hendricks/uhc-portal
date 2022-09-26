/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CostType } from './CostType';
import type { ListPagination } from './ListPagination';

export type CostTypePagination = ListPagination & {
  data: Array<CostType>;
};
