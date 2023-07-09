/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SubnetNetworkVerification = {
  /**
   * Indicates the type of this object. Will be 'SubnetNetworkVerification' if this is a complete object or 'SubnetNetworkVerificationLink' if it is just a link.
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
   * Slice of failures that happened during a subnet network verification.
   */
  details?: Array<string>;
  /**
   * State of the subnet network verification.
   */
  state?: string;
};
