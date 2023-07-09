/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PrivateLinkPrincipal = {
  /**
   * Indicates the type of this object. Will be 'PrivateLinkPrincipal' if this is a complete object or 'PrivateLinkPrincipalLink' if it is just a link.
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
   * ARN for a principal that is allowed for this Private Link.
   */
  principal?: string;
};
