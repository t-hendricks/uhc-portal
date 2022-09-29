/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SupportCasesRequest = {
  account_number?: string;
  case_language?: string;
  cluster_id?: string;
  cluster_uuid?: string;
  contact_sso_name?: string;
  description: string;
  event_stream_id?: string;
  openshift_cluster_id?: string;
  product?: string;
  severity: SupportCasesRequest.severity;
  subscription_id?: string;
  summary: string;
  version?: string;
};

export namespace SupportCasesRequest {
  export enum severity {
    _1_URGENT_ = '1 (Urgent)',
    _2_HIGH_ = '2 (High)',
    _3_NORMAL_ = '3 (Normal)',
    _4_LOW_ = '4 (Low)',
  }
}
