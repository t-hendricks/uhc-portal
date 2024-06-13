/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Decision } from './Decision';
import type { ObjectReference } from './ObjectReference';
export type AccessRequest = ObjectReference & {
  cluster_id?: string;
  /**
   * How long the Access Request can be in pending state waiting for a customer decision
   */
  deadline?: string;
  deadlineAt?: string;
  decisions?: Array<Decision>;
  /**
   * How long the access will last after it's been approved
   */
  duration?: string;
  /**
   * The Jira ticket associated with this Access Request in the form 'OHSS-1234'. The Jira issue must already exist.
   */
  internal_support_case_id?: string;
  justification?: string;
  organization_id?: string;
  requested_by?: string;
  status?: any;
  subscription_id?: string;
  support_case_id?: string;
};
