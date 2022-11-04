/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details for `github` identity providers.
 */
export type GithubIdentityProvider = {
  /**
   * Optional trusted certificate authority bundle to use when making requests tot he server.
   */
  ca?: string;
  /**
   * Client identifier of a registered _GitHub_ OAuth application.
   */
  client_id?: string;
  /**
   * Client secret of a registered _GitHub_ OAuth application.
   */
  client_secret?: string;
  /**
   * For _GitHub Enterprise_ you must provide the host name of your instance, such as
   * `example.com`. This value must match the _GitHub Enterprise_ host name value in the
   * `/setup/settings` file and cannot include a port number.
   *
   * For plain _GitHub_ omit this parameter.
   */
  hostname?: string;
  /**
   * Optional list of organizations. Cannot be used in combination with the Teams field.
   */
  organizations?: Array<string>;
  /**
   * Optional list of teams. Cannot be used in combination with the Organizations field.
   */
  teams?: Array<string>;
};
