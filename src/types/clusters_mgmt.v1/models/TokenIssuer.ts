/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a token issuer used in an external authentication.
 */
export type TokenIssuer = {
  /**
   * Certificate bundle to use to validate server certificates for the configured URL.
   */
  ca?: string;
  /**
   * URL is the serving URL of the token issuer.
   */
  url?: string;
  /**
   * Audiences is an array of audiences that the token was issued for.
   * Valid tokens must include at least one of these values in their
   * "aud" claim.
   * Must be set to exactly one value.
   */
  audiences?: Array<string>;
};
