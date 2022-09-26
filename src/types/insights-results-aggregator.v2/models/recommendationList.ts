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
   * The number of clusters impacted by this rule.
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
   * Risk of change - values paired with corresponding UI elements. 0 returned when not defined, therefore to hide the UI.
   */
  risk_of_change?: 0 | 1 | 2 | 3 | 4;
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
