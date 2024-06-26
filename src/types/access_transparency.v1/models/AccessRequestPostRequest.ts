/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccessRequestPostRequest = {
  /**
   * The Cluster id associated with this Access Request. Not required when supplying the Subscription id.
   */
  cluster_id?: string;
  /**
   * The amount of time the customer has to respond to this Access Request
   */
  deadline?: string;
  /**
   * The amount of time being requested for access to the customers Cluster or Cloud Provider account
   */
  duration?: string;
  /**
   * The Jira ticket associated with this Access Request in the form 'OHSS-1234'. This must exist prior to submitting this Access Request
   */
  internal_support_case_id: string;
  /**
   * A customer-readable explanation as to why access is required to their Cluster or Cloud Provider account
   */
  justification: string;
  /**
   * The Subscription id associated with this Access Request. Not required when supplying the Cluster id.
   */
  subscription_id?: string;
  /**
   * An optional, customer-facing support case id associated with this Access Request
   */
  support_case_id?: string;
};
