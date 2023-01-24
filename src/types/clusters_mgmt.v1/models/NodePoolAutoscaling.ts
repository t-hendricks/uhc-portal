/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a autoscaling in a node pool.
 */
export type NodePoolAutoscaling = {
  /**
   * Indicates the type of this object. Will be 'NodePoolAutoscaling' if this is a complete object or 'NodePoolAutoscalingLink' if it is just a link.
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
   * The maximum number of replicas for the node pool.
   */
  max_replica?: number;
  /**
   * The minimum number of replicas for the node pool.
   */
  min_replica?: number;
};
