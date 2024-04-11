/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type IngressReportIn = {
  /**
   * Source uuid for reports.
   */
  source: string;
  /**
   * List of reports for ingestion.
   */
  reports_list: Array<string>;
  /**
   * Billing year for report files
   */
  billing_year: string;
  /**
   * Billing month for report files
   */
  billing_month: string;
};
