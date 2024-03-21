/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type dvoReportMeta = {
  /**
   * Highest recommendation severity affecting this namespace + cluster
   */
  highest_severity?: number;
  /**
   * A dictionary with the number of DVO recommendation hits grouped by their severity. Always provides the severity keys even if there are no recommendations currently hitting.
   */
  hits_by_severity?: Record<string, number>;
  /**
   * Timestamp of the last analysis
   */
  last_checked_at?: string;
  /**
   * Total number of unique objects (workloads) being affected by DVO recommendations in this namespace. When a workload is being affected by several recommendations at once, it still counts as one affected object/workload in the context of a namespace.
   */
  objects?: number;
  /**
   * Total number of DVO recommendations affecting this namespace
   */
  recommendations?: number;
  /**
   * Timestamp of the first analysis
   */
  reported_at?: string;
};
