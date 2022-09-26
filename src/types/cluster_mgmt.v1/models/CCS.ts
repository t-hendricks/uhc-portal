/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CCS = {
  /**
   * Indicates the type of this object. Will be 'CCS' if this is a complete object or 'CCSLink' if it is just a link.
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
   * Indicates if cloud permissions checks are disabled,
   * when attempting installation of the cluster.
   */
  disable_scp_checks?: boolean;
  /**
   * Indicates if Customer Cloud Subscription is enabled on the cluster.
   */
  enabled?: boolean;
};
