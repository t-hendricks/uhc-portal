/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type recommendationList = Array<{
  /**
   * The title of the rule, a short description.
   */
  description?: string;
  /**
   * Whether the rule has been disabled/acked for all clusters or not.
   */
  disabled?: boolean;
  /**
   * More specific, cluster-independent description of the rule
   */
  generic?: string;
  /**
   * How much of an impact this rule has on a cluster.
   */
  impact?: 0 | 1 | 2 | 3 | 4;
  /**
   * The number of clusters impacted by this rule. Disabled clusters are excluded from the count. If the rule is acked, it is just marked as disabled:true and the count is still returned.
   */
  impacted_clusters_count?: number;
  /**
   * How likely is this rule to hit.
   */
  likelihood?: 0 | 1 | 2 | 3 | 4;
  /**
   * The date the rule was published. 'Added at' field in UI
   */
  publish_date?: string;
  /**
   * Indicates the impact of the resolution steps on the cluster and other associated risks. Behaves in the same way as total_risk, 0 is returned when the rule doesn't have a resolution_risk defined.
   */
  resolution_risk?: 0 | 1 | 2 | 3 | 4;
  /**
   * The rule ID in the | format.
   */
  rule_id?: string;
  /**
   * List of tags that the rule contains
   */
  tags?: Array<string>;
  /**
   * Total risk - calculated from rule impact and likelihood.
   */
  total_risk?: 0 | 1 | 2 | 3 | 4;
}>;
