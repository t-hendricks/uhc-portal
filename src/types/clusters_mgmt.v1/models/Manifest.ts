/* generated using openapi-typescript-codegen -- do not edit */
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
   * Date and time when the manifest got created in OCM database.
   */
  creation_timestamp?: string;
  /**
   * Transient value to represent the underlying live resource.
   */
  live_resource?: Record<string, any>;
  /**
   * Spec of Manifest Work object from open cluster management
   * For more info please check https://open-cluster-management.io/concepts/manifestwork.
   */
  spec?: Record<string, any>;
  /**
   * Date and time when the manifest got updated in OCM database.
   */
  updated_timestamp?: string;
  /**
   * List of k8s objects to deploy on a hosted cluster.
   */
  workloads?: Array<Record<string, any>>;
};
