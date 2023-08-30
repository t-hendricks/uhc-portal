/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AutoscalerScaleDownConfig = {
  /**
   * How long after scale up that scale down evaluation resumes.
   */
  delay_after_add?: string;
  /**
   * How long after node deletion that scale down evaluation resumes, defaults to scan-interval.
   */
  delay_after_delete?: string;
  /**
   * How long after scale down failure that scale down evaluation resumes.
   */
  delay_after_failure?: string;
  /**
   * Should cluster-autoscaler scale down the cluster.
   */
  enabled?: boolean;
  /**
   * How long a node should be unneeded before it is eligible for scale down.
   */
  unneeded_time?: string;
  /**
   * Node utilization level, defined as sum of requested resources divided by capacity, below which a node can be considered for scale down.
   */
  utilization_threshold?: string;
};
