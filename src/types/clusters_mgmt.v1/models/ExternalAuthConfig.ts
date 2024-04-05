/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExternalAuth } from './ExternalAuth';

/**
 * ExternalAuthConfig configuration
 */
export type ExternalAuthConfig = {
  /**
   * Boolean flag indicating if the cluster should use an external authentication configuration.
   *
   * By default this is false.
   *
   * To enable it the cluster needs to be ROSA HCP cluster and the organization of the user needs
   * to have the `external-authentication` feature toggle enabled.
   */
  enabled?: boolean;
  external_auths?: Array<ExternalAuth>;
};
