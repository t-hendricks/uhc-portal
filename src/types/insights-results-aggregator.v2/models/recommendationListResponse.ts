/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { recommendationList } from './recommendationList';

/**
 * Response data type for GET /rule endpoint
 */
export type recommendationListResponse = {
  recommendations?: recommendationList;
  /**
   * Request response status
   */
  status?: string;
};
