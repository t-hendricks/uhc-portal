/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Specification for different classes of nodes inside a flavour.
 */
export type GCPFlavour = {
  /**
   * GCP default instance type for the worker volume.
   *
   * User can be overridden specifying in the cluster itself a type for compute node.
   */
  compute_instance_type?: string;
  /**
   * GCP default instance type for the infra volume.
   */
  infra_instance_type?: string;
  /**
   * GCP default instance type for the master volume.
   */
  master_instance_type?: string;
};
