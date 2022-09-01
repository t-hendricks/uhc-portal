/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { subnet } from './subnet';

/**
 * A network from which Pod IPs are allocated. This block must not overlap with existing physical networks. These IP addresses are used for the Pod network, and if you need to access the Pods from an external network, configure load balancers and routers to manage the traffic.
 */
export type cluster_network = {
    /**
     * The IP block address pool.
     */
    cidr?: subnet;
    /**
     * The cluster that this network is associated with.
     */
    cluster_id?: string;
    /**
     * The subnet prefix length to assign to each individual node. For example if is set to 23, then each node is assigned a /23 subnet out of the given CIDR, which allows for 510 (2^(32 - 23) - 2) pod IPs addresses.
     */
    host_prefix?: number;
};

