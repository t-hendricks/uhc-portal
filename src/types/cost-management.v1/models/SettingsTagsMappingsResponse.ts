/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaginationLinks } from './PaginationLinks';
import type { PaginationMeta } from './PaginationMeta';

export type SettingsTagsMappingsResponse = {
  meta?: PaginationMeta;
  links?: PaginationLinks;
  data?: Array<{
    uuid?: string;
  }>;
};
