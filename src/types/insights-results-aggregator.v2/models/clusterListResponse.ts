/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { clusterList } from './clusterList';

/**
 * Response data type for GET /clusters endpoint
 */
export type clusterListResponse = {
    data?: clusterList;
    meta?: {
        count?: number;
    };
    /**
     * Request response status
     */
    status?: string;
};

