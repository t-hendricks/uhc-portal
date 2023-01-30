/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of an sts policies for rosa cluster
 */
export type AWSSTSPolicy = {
  /**
   * The ARN of the managed policy
   */
  arn?: string;
  /**
   * Policy ID
   */
  id?: string;
  /**
   * Policy Details
   */
  details?: string;
  /**
   * Type of policy operator/account role
   */
  type?: string;
};
