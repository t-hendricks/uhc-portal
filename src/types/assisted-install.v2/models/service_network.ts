/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { subnet } from './subnet';

/**
 * IP address block for service IP blocks.
 */
export type service_network = {
  /**
   * The IP block address pool.
   */
  cidr?: subnet;
  /**
   * A network to use for service IP addresses. If you need to access the services from an external network, configure load balancers and routers to manage the traffic.
   */
  cluster_id?: string;
};
