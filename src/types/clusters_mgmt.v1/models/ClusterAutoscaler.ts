/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AutoscalerResourceLimits } from './AutoscalerResourceLimits';
import type { AutoscalerScaleDownConfig } from './AutoscalerScaleDownConfig';

/**
 * Cluster-wide autoscaling configuration.
 */
export type ClusterAutoscaler = {
  /**
   * BalanceSimilarNodeGroups enables/disables the
   * `--balance-similar-node-groups` cluster-autocaler feature.
   * This feature will automatically identify node groups with
   * the same instance type and the same set of labels and try
   * to keep the respective sizes of those node groups balanced.
   */
  balance_similar_node_groups?: boolean;
  /**
   * Sets the autoscaler log level.
   * Default value is 1, level 4 is recommended for DEBUGGING and level 6 will enable almost everything.
   */
  log_verbosity?: number;
  /**
   * Gives pods graceful termination time before scaling down.
   */
  max_pod_grace_period?: number;
  /**
   * Constraints of autoscaling resources.
   */
  resource_limits?: AutoscalerResourceLimits;
  /**
   * Configuration of scale down operation.
   */
  scale_down?: AutoscalerScaleDownConfig;
  /**
   * Enables/Disables `--skip-nodes-with-local-storage` CA feature flag. If true cluster autoscaler will never delete nodes with pods with local storage, e.g. EmptyDir or HostPath. true by default at autoscaler.
   */
  skip_nodes_with_local_storage?: boolean;
};
