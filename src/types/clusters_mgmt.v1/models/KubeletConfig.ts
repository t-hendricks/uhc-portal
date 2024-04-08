/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * OCM representation of KubeletConfig, exposing the fields of Kubernetes
 * KubeletConfig that can be managed by users
 */
export type KubeletConfig = {
  /**
   * Indicates the type of this object. Will be 'KubeletConfig' if this is a complete object or 'KubeletConfigLink' if it is just a link.
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
   * Allows user to specify the podPidsLimit to be applied via KubeletConfig.
   * Useful if workloads have greater PIDs limit requirements than the OCP default.
   */
  pod_pids_limit?: number;
};
