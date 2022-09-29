/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { memory_method } from './memory_method';

export type memory = {
  physical_bytes?: number;
  /**
   * The method by which the physical memory was set
   */
  physical_bytes_method?: memory_method;
  usable_bytes?: number;
};
