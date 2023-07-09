/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PrivateLinkPrincipal } from './PrivateLinkPrincipal';

/**
 * Manages the configuration for the Private Links.
 */
export type PrivateLinkClusterConfiguration = {
  /**
   * List of additional principals for the Private Link
   */
  principals?: Array<PrivateLinkPrincipal>;
};
