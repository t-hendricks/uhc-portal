/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details for `gitlab` identity providers.
 */
export type GitlabIdentityProvider = {
  /**
   * Optional trusted certificate authority bundle to use when making requests tot he server.
   */
  ca?: string;
  /**
   * URL of the _GitLab_ instance.
   */
  url?: string;
  /**
   * Client identifier of a registered _GitLab_ OAuth application.
   */
  client_id?: string;
  /**
   * Client secret issued by _GitLab_.
   */
  client_secret?: string;
};
