/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OpenIDClaims } from './OpenIDClaims';

/**
 * Details for `openid` identity providers.
 */
export type OpenIDIdentityProvider = {
  /**
   * Certificate bunde to use to validate server certificates for the configured URL.
   */
  ca?: string;
  /**
   * Claims used to configure the provider.
   */
  claims?: OpenIDClaims;
  /**
   * Identifier of a client registered with the _OpenID_ provider.
   */
  client_id?: string;
  /**
   * Client secret.
   */
  client_secret?: string;
  /**
   * Optional map of extra parameters to add to the authorization token request.
   */
  extra_authorize_parameters?: Record<string, string>;
  /**
   * Optional list of scopes to request, in addition to the `openid` scope, during the
   * authorization token request.
   */
  extra_scopes?: Array<string>;
  /**
   * The URL that the OpenID Provider asserts as the Issuer Identifier
   */
  issuer?: string;
};
