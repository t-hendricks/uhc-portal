/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AWSInfrastructureAccessRoleState } from './AWSInfrastructureAccessRoleState';

/**
 * A set of acces permissions for AWS resources
 */
export type AWSInfrastructureAccessRole = {
  /**
   * Indicates the type of this object. Will be 'AWSInfrastructureAccessRole' if this is a complete object or 'AWSInfrastructureAccessRoleLink' if it is just a link.
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
   * Description of the role.
   */
  description?: string;
  /**
   * Human friendly identifier of the role, for example `Read only`.
   */
  display_name?: string;
  /**
   * State of the role.
   */
  state?: AWSInfrastructureAccessRoleState;
};
