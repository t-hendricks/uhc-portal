/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a trusted ip address in clusterdeployment.
 */
export type TrustedIp = {
  /**
   * Indicates the type of this object. Will be 'TrustedIp' if this is a complete object or 'TrustedIpLink' if it is just a link.
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
   * The boolean set to show if the ip is enabled.
   */
  enabled?: boolean;
};
