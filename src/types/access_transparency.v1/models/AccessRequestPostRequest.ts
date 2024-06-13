/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccessRequestPostRequest = {
  /**
   * When supplying cluster id the subscription is not required
   */
  cluster_id?: string;
  deadline?: string;
  duration?: string;
  internal_support_case_id: string;
  justification: string;
  /**
   * When supplying subscription the cluster id is not required
   */
  subscription_id?: string;
  support_case_id?: string;
};
