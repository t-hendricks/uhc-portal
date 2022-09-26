/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { report } from './report';

/**
 * Response data type for GET /clusters/{clusterId}/report endpoint
 */
export type reportResponse = {
  report?: report;
  status?: string;
};
