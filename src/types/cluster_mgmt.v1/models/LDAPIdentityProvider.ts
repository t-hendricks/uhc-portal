/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LDAPAttributes } from './LDAPAttributes';

/**
 * Details for `ldap` identity providers.
 */
export type LDAPIdentityProvider = {
  /**
   * Certificate bundle to use to validate server certificates for the configured URL.
   */
  ca?: string;
  /**
   * An https://tools.ietf.org/html/rfc2255[RFC 2255] URL which specifies the LDAP host and
   * search parameters to use.
   */
  url?: string;
  /**
   * LDAP attributes used to configure the provider.
   */
  attributes?: LDAPAttributes;
  /**
   * Optional distinguished name to use to bind during the search phase.
   */
  bind_dn?: string;
  /**
   * Optional password to use to bind during the search phase.
   */
  bind_password?: string;
  /**
   * When `true` no TLS connection is made to the server. When `false` `ldaps://...` URLs
   * connect using TLS and `ldap://...` are upgraded to TLS.
   */
  insecure?: boolean;
};
