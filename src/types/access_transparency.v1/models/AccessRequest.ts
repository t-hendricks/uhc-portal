/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Decision } from './Decision';
import type { ObjectReference } from './ObjectReference';
export type AccessRequest = ObjectReference & {
  /**
   * The id of the Cluster associated with this Access Request
   */
  cluster_id?: string;
  /**
   * The amount of time the customer has to respond to this Access Request
   */
  deadline?: string;
  /**
   * The timestamp of the time by which the customer must respond to this Access Request
   */
  deadline_at?: string;
  /**
   * The list of Decisions for this Access Request
   */
  decisions?: Array<Decision>;
  /**
   * The amount of time being requested for access to the customers Cluster or Cloud Provider account
   */
  duration?: string;
  /**
   * The Jira ticket associated with this Access Request in the form 'OHSS-1234'.
   */
  internal_support_case_id?: string;
  /**
   * A customer-readable explanation as to why access is required to their Cluster or Cloud Provider account
   */
  justification?: string;
  /**
   * The id of the OCM Organization associated with this Access Request
   */
  organization_id?: string;
  /**
   * The username of the individual that made this Access Request
   */
  requested_by?: string;
  /**
   * The status of this Access Request
   */
  status?: any;
  /**
   * The id of the Subscription associated with this Access Request
   */
  subscription_id?: string;
  /**
   * An optional, customer-facing support case id associated with this Access Request
   */
  support_case_id?: string;
};
