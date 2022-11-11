/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Hypershift configuration.
 */
export type HypershiftConfig = {
  /**
   * Boolean flag indicating if the cluster should be creating using _Hypershift_.
   *
   * By default this is `false`.
   *
   * To enable it the cluster needs to be ROSA cluster and the organization of the user needs
   * to have the `hypershift` capability enabled.
   */
  enabled?: boolean;
  /**
   * Contains the name of the current management cluster for this Hypershift cluster.
   * Empty for non Hypershift clusters.
   */
  management_cluster?: string;
};
