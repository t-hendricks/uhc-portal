/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PrivateLinkPrincipals } from './PrivateLinkPrincipals';

/**
 * Manages the configuration for the Private Links.
 */
export type PrivateLinkConfiguration = {
  /**
   * List of additional principals for the Private Link
   */
  principals?: PrivateLinkPrincipals;
};
