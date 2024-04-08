/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * AWS security group object
 */
export type SecurityGroup = {
  /**
   * The security group ID.
   */
  id?: string;
  /**
   * Name of the security group according to its `Name` tag on AWS.
   */
  name?: string;
  /**
   * If the resource is RH managed.
   */
  red_hat_managed?: boolean;
};
