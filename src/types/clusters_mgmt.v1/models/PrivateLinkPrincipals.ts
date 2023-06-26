/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PrivateLinkPrincipal } from './PrivateLinkPrincipal';

/**
 * Contains a list of principals for the Private Link.
 */
export type PrivateLinkPrincipals = {
  /**
   * Indicates the type of this object. Will be 'PrivateLinkPrincipals' if this is a complete object or 'PrivateLinkPrincipalsLink' if it is just a link.
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
   * List of additional principals for the Private Link
   */
  principals?: Array<PrivateLinkPrincipal>;
};
