/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type reportMeta = {
  /**
   * The display name of the cluster
   */
  cluster_name?: string;
  count?: number;
  gathered_at?: string;
  /**
   * [Optional] Timestamp of the last analysis
   */
  last_checked_at?: string;
  /**
   * Flag indicating if the cluster is managed or not
   */
  managed?: boolean;
};
