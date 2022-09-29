/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a syncset.
 */
export type Syncset = {
  /**
   * Indicates the type of this object. Will be 'Syncset' if this is a complete object or 'SyncsetLink' if it is just a link.
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
   * List of k8s objects to configure for the cluster.
   */
  resources?: Array<any>;
};
