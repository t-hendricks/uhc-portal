/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a clusterdeployment.
 */
export type ClusterDeployment = {
  /**
   * Indicates the type of this object. Will be 'ClusterDeployment' if this is a complete object or 'ClusterDeploymentLink' if it is just a link.
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
   * Content of the clusterdeployment.
   */
  content?: any;
};
