/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AWSInfrastructureAccessRole } from './AWSInfrastructureAccessRole';
import type { AWSInfrastructureAccessRoleGrantState } from './AWSInfrastructureAccessRoleGrantState';

/**
 * Representation of an AWS infrastructure access role grant.
 */
export type AWSInfrastructureAccessRoleGrant = {
  /**
   * Indicates the type of this object. Will be 'AWSInfrastructureAccessRoleGrant' if this is a complete object or 'AWSInfrastructureAccessRoleGrantLink' if it is just a link.
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
   * URL to switch to the role in AWS console.
   */
  console_url?: string;
  /**
   * Link to AWS infrastructure access role.
   * Grant must use a 'valid' role.
   */
  role?: AWSInfrastructureAccessRole;
  /**
   * State of the grant.
   */
  state?: AWSInfrastructureAccessRoleGrantState;
  /**
   * Description of the state.
   * Will be empty unless state is 'Failed'.
   */
  state_description?: string;
  /**
   * The user AWS IAM ARN we want to grant the role.
   */
  user_arn?: string;
};
