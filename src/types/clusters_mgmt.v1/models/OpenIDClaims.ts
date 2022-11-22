/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * _OpenID_ identity provider claims.
 */
export type OpenIDClaims = {
  /**
   * List of claims to use as the mail address.
   */
  email?: Array<string>;
  /**
   * List of claims to use as the group name.
   */
  groups?: Array<string>;
  /**
   * List of claims to use as the display name.
   */
  name?: Array<string>;
  /**
   * List of claims to use as the preferred user name when provisioning a user.
   */
  preferred_username?: Array<string>;
};
