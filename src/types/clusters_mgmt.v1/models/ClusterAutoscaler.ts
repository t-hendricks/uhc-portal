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
   * Indicates the type of this object. Will be 'ClusterAutoscaler' if this is a complete object or 'ClusterAutoscalerLink' if it is just a link.
   */
  kind?: string;
  /**
   * Unique identifier of the object.
   */
  id?: string;
  /**
   * Self link.
   */
  href?: string;
  /**
   * BalanceSimilarNodeGroups enables/disables the
   * `--balance-similar-node-groups` cluster-autoscaler feature.
   * This feature will automatically identify node groups with
   * the same instance type and the same set of labels and try
   * to keep the respective sizes of those node groups balanced.
   */
  balance_similar_node_groups?: boolean;
  /**
   * This option specifies labels that cluster autoscaler should ignore when considering node group similarity.
   * For example, if you have nodes with "topology.ebs.csi.aws.com/zone" label, you can add name of this label here
   * to prevent cluster autoscaler from splitting nodes into different node groups based on its value.
   */
  balancing_ignored_labels?: Array<string>;
  /**
   * Should CA ignore DaemonSet pods when calculating resource utilization for scaling down. false by default.
   */
  ignore_daemonsets_utilization?: boolean;
  /**
   * Sets the autoscaler log level.
   * Default value is 1, level 4 is recommended for DEBUGGING and level 6 will enable almost everything.
   */
  log_verbosity?: number;
  /**
   * Maximum time CA waits for node to be provisioned.
   */
  max_node_provision_time?: string;
  /**
   * Gives pods graceful termination time before scaling down.
   */
  max_pod_grace_period?: number;
  /**
   * To allow users to schedule "best-effort" pods, which shouldn't trigger
   * Cluster Autoscaler actions, but only run when there are spare resources available,
   * More info: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-does-cluster-autoscaler-work-with-pod-priority-and-preemption.
   */
  pod_priority_threshold?: number;
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
