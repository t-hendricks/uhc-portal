/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of the status of a node pool.
 */
export type NodePoolStatus = {
  /**
   * Indicates the type of this object. Will be 'NodePoolStatus' if this is a complete object or 'NodePoolStatusLink' if it is just a link.
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
   * The current number of replicas for the node pool.
   */
  current_replicas?: number;
  /**
   * Adds additional information about the NodePool status when the node pool doesn't reach the desired replicas.
   */
  message?: string;
};
