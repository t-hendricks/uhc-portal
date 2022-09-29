/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a autoscaling in a machine pool.
 */
export type MachinePoolAutoscaling = {
  /**
   * Indicates the type of this object. Will be 'MachinePoolAutoscaling' if this is a complete object or 'MachinePoolAutoscalingLink' if it is just a link.
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
   * The maximum number of replicas for the machine pool.
   */
  max_replicas?: number;
  /**
   * The minimum number of replicas for the machine pool.
   */
  min_replicas?: number;
};
