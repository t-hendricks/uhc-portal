/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaginationLinks } from './PaginationLinks';
import type { ReportPaginationMeta } from './ReportPaginationMeta';

export type Report = {
  meta?: ReportPaginationMeta;
  links?: PaginationLinks;
};
