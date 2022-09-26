/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ListPagination } from './ListPagination';
import type { SourceOut } from './SourceOut';

export type SourcePagination = ListPagination & {
  data: Array<SourceOut>;
};
