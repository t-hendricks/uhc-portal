/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a manifestwork.
 */
export type Manifest = {
  /**
   * Indicates the type of this object. Will be 'Manifest' if this is a complete object or 'ManifestLink' if it is just a link.
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
   * List of k8s objects to deploy on a hosted cluster.
   */
  workloads?: Array<any>;
};
