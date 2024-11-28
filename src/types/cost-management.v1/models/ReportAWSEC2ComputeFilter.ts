/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReportAWSEC2ComputeFilter = {
  /**
   * The resolution to apply to the report. Default resolution is daily.
   */
  resolution?: string;
  /**
   * The time scope to apply to the report. Default time scope is '-1', which is used for current month, '-2' is used for last month, amd '-3' is used for previous month.
   */
  time_scope_value?: ReportAWSEC2ComputeFilter.time_scope_value;
  /**
   * The units to apply to the report. 'month' is the only valid value for this report.
   */
  time_scope_units?: string;
  resource_id?: Array<string>;
  instance_name?: Array<string>;
  account?: Array<string>;
  region?: Array<string>;
  operating_system?: Array<string>;
};
export namespace ReportAWSEC2ComputeFilter {
  /**
   * The time scope to apply to the report. Default time scope is '-1', which is used for current month, '-2' is used for last month, amd '-3' is used for previous month.
   */
  export enum time_scope_value {
    '_-1' = -1,
    '_-2' = -2,
    '_-3' = -3,
  }
}
