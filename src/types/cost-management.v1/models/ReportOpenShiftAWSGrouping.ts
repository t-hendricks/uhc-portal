/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The grouping to apply to the report. No grouping by default. When grouping by account the account_alias will be provided if avaiable.
 */
export type ReportOpenShiftAWSGrouping = {
  account?: Array<string>;
  service?: Array<string>;
  region?: Array<string>;
  az?: Array<string>;
  instance_type?: Array<string>;
  storage_type?: Array<string>;
  tag?: Array<string>;
  cluster?: Array<string>;
  project?: Array<string>;
  node?: Array<string>;
};
