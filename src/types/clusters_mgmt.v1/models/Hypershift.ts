/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Hypershift configuration.
 */
export type Hypershift = {
  /**
   * Boolean flag indicating if the cluster should be creating using _Hypershift_.
   *
   * By default this is `false`.
   *
   * To enable it the cluster needs to be ROSA cluster and the organization of the user needs
   * to have the `hypershift` capability enabled.
   */
  enabled?: boolean;
};
