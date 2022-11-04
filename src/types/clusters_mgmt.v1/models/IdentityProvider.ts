/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GithubIdentityProvider } from './GithubIdentityProvider';
import type { GitlabIdentityProvider } from './GitlabIdentityProvider';
import type { GoogleIdentityProvider } from './GoogleIdentityProvider';
import type { HTPasswdIdentityProvider } from './HTPasswdIdentityProvider';
import type { IdentityProviderMappingMethod } from './IdentityProviderMappingMethod';
import type { IdentityProviderType } from './IdentityProviderType';
import type { LDAPIdentityProvider } from './LDAPIdentityProvider';
import type { OpenIDIdentityProvider } from './OpenIDIdentityProvider';

/**
 * Representation of an identity provider.
 */
export type IdentityProvider = {
  /**
   * Indicates the type of this object. Will be 'IdentityProvider' if this is a complete object or 'IdentityProviderLink' if it is just a link.
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
   * Details for `ldap` identity providers.
   */
  ldap?: LDAPIdentityProvider;
  /**
   * When `true` unauthenticated token requests from non-web clients (like the CLI) are sent a
   * `WWW-Authenticate` challenge header for this provider.
   */
  challenge?: boolean;
  /**
   * Details for `github` identity providers.
   */
  github?: GithubIdentityProvider;
  /**
   * Details for `gitlab` identity providers.
   */
  gitlab?: GitlabIdentityProvider;
  /**
   * Details for `google` identity providers.
   */
  google?: GoogleIdentityProvider;
  /**
   * Details for `htpasswd` identity providers.
   */
  htpasswd?: HTPasswdIdentityProvider;
  /**
   * When `true` unauthenticated token requests from web clients (like the web console) are
   * redirected to the authorize URL to log in.
   */
  login?: boolean;
  /**
   * Controls how mappings are established between this provider's identities and user
   * objects.
   */
  mapping_method?: IdentityProviderMappingMethod;
  /**
   * The name of the identity provider.
   */
  name?: string;
  /**
   * Details for `openid` identity providers.
   */
  open_id?: OpenIDIdentityProvider;
  /**
   * Type of identity provider. The rest of the attributes will be populated according to this
   * value. For example, if the type is `github` then only the `github` attribute will be
   * populated.
   */
  type?: IdentityProviderType;
};
