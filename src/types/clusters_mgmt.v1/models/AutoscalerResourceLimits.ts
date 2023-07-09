/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ResourceRange } from './ResourceRange';

export type AutoscalerResourceLimits = {
  /**
   * Minimum and maximum number of cores in cluster, in the format <min>:<max>.
   * Cluster autoscaler will not scale the cluster beyond these numbers.
   */
  cores?: ResourceRange;
  /**
   * Maximum number of nodes in all node groups.
   * Cluster autoscaler will not grow the cluster beyond this number.
   */
  max_nodes_total?: number;
  /**
   * Minimum and maximum number of gigabytes of memory in cluster, in the format <min>:<max>.
   * Cluster autoscaler will not scale the cluster beyond these numbers.
   */
  memory?: ResourceRange;
};
