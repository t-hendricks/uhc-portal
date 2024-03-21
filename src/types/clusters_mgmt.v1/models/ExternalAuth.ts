/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExternalAuthClaim } from './ExternalAuthClaim';
import type { ExternalAuthClientConfig } from './ExternalAuthClientConfig';
import type { TokenIssuer } from './TokenIssuer';

/**
 * Representation of an external authentication provider.
 */
export type ExternalAuth = {
  /**
   * Indicates the type of this object. Will be 'ExternalAuth' if this is a complete object or 'ExternalAuthLink' if it is just a link.
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
   * The rules on how to transform information from an ID token into a cluster identity.
   */
  claim?: ExternalAuthClaim;
  /**
   * The list of the platform's clients that need to request tokens from the issuer.
   */
  clients?: Array<ExternalAuthClientConfig>;
  /**
   * The issuer describes the attributes of the OIDC token issuer.
   */
  issuer?: TokenIssuer;
};
