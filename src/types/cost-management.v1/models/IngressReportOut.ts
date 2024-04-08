/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type IngressReportOut = {
  uuid?: string;
  source_uuid?: string;
  reports_list?: Array<string>;
  /**
   * Billing year for files.
   */
  bill_year?: string;
  /**
   * Billing month for files.
   */
  billing_month?: string;
  /**
   * Timestamp of posted reports.
   */
  readonly created_timestamp?: any;
  /**
   * Timestamp of successfully processed reports.
   */
  readonly completed_timestamp?: any;
};
