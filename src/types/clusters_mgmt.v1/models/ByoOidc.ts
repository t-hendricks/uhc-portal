/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * ByoOidc configuration.
 */
export type ByoOidc = {
  /**
   * Boolean flag indicating if the cluster should be creating using _ByoOidc_.
   *
   * By default this is `false`.
   *
   * To enable it the cluster needs to be ROSA cluster and the organization of the user needs
   * to have the `byo-oidc` feature toggle enabled.
   */
  enabled?: boolean;
};
