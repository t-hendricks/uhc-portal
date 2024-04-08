/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type NotifyDetailsRequest = {
  bcc_address?: string;
  cluster_id?: string;
  cluster_uuid?: string;
  include_red_hat_associates?: boolean;
  /**
   * The `internal_only` parameter is used for validation. Specifically to check if there is a discrepancy between the email address and the log type.
   */
  internal_only?: boolean;
  org_id?: string;
  subject?: string;
  subscription_id?: string;
};
