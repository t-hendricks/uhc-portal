/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CostModelOut } from './CostModelOut';
import type { ListPagination } from './ListPagination';

export type CostModelPagination = ListPagination & {
  data: Array<CostModelOut>;
};
