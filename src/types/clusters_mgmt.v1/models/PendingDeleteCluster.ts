/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Cluster } from './Cluster';

/**
 * Represents a pending delete entry for a specific cluster.
 */
export type PendingDeleteCluster = {
  /**
   * Indicates the type of this object. Will be 'PendingDeleteCluster' if this is a complete object or 'PendingDeleteClusterLink' if it is just a link.
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
   * Flag indicating if the cluster deletion should be best-effort mode or not.
   */
  best_effort?: boolean;
  /**
   * Cluster is the details of the cluster that is pending deletion.
   */
  cluster?: Cluster;
  /**
   * Date and time when the cluster was initially created, using the
   * format defined in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt).
   */
  creation_timestamp?: string;
};
