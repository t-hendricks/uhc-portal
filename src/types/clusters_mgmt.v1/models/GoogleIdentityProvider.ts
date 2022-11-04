/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details for `google` identity providers.
 */
export type GoogleIdentityProvider = {
  /**
   * Client identifier of a registered _Google_ project.
   */
  client_id?: string;
  /**
   * Client secret issued by _Google_.
   */
  client_secret?: string;
  /**
   * Optional hosted domain to restrict sign-in accounts to.
   */
  hosted_domain?: string;
};
