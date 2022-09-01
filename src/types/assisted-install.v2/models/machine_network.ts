/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { subnet } from './subnet';

/**
 * A network that all hosts belonging to the cluster should have an interface with IP address in. The VIPs (if exist) belong to this network.
 */
export type machine_network = {
    /**
     * The IP block address pool.
     */
    cidr?: subnet;
    /**
     * The cluster that this network is associated with.
     */
    cluster_id?: string;
};

