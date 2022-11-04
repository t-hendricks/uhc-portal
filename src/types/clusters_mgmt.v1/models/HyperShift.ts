/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * HyperShift configuration.
 */
export type HyperShift = {
  /**
   * Boolean flag indicating if the cluster should be creating using _HyperShift_.
   *
   * By default this is `false`.
   *
   * To enable it the cluster needs to be ROSA cluster and the organization of the user needs
   * to have the `hypershift` capability enabled.
   */
  enabled?: boolean;
};
