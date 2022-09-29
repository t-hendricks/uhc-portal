/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ListPagination } from './ListPagination';
import type { MetricsOut } from './MetricsOut';

export type Metrics = ListPagination & {
  data: Array<MetricsOut>;
};
