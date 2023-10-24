/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { requestId } from './requestId';

/**
 * List of stored requests for given orgId + clusterId
 */
export type gatheringRequests = Array<{
  processed: string;
  received: string;
  requestID: requestId;
  valid: boolean;
}>;
