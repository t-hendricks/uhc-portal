/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ListeningMethod } from './ListeningMethod';

/**
 * Information about the API of a cluster.
 */
export type ClusterAPI = {
    /**
     * The URL of the API server of the cluster.
     */
    url?: string;
    /**
     * The listening method of the API server.
     */
    listening?: ListeningMethod;
};

