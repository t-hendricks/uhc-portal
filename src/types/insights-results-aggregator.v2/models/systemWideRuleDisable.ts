/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An information about rule that has been disabled for whole account
 */
export type systemWideRuleDisable = {
  /**
   * Timestamp when the rule has been acked/disabled
   */
  created_at?: string;
  /**
   * ID of user (account)
   */
  created_by?: string;
  /**
   * Justification (message) provided by user
   */
  justification?: string;
  /**
   * Rule selector: rule ID + error key
   */
  rule?: string;
  /**
   * Information about the operation status
   */
  status?: string;
  /**
   * Timestamp when the rule justification has been changed (can be empty)
   */
  updated_at?: string;
};
