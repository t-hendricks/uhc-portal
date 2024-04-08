/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Representation of an sts role for a rosa cluster
 */
export type AWSSTSRole = {
  /**
   * Does this Role have HCP Managed Policies?
   */
  hcpManagedPolicies?: boolean;
  /**
   * Does this role have Admin permission?
   */
  isAdmin?: boolean;
  /**
   * Does this Role have Managed Policies?
   */
  managedPolicies?: boolean;
  /**
   * The AWS ARN for this Role
   */
  arn?: string;
  /**
   * The type of this Role
   */
  type?: string;
  /**
   * The Openshift Version for this Role
   */
  roleVersion?: string;
};
