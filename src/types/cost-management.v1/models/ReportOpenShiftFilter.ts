/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReportResolution } from './ReportResolution';
import type { ReportResourceScope } from './ReportResourceScope';
import type { ReportTimeScopeUnits } from './ReportTimeScopeUnits';
import type { ReportTimeScopeValue } from './ReportTimeScopeValue';

export type ReportOpenShiftFilter = {
  /**
   * Limits the data points returns and aggregates remaining data.
   */
  limit?: number;
  /**
   * Offsets the data points returned when using limit.
   */
  offset?: number;
  resolution?: ReportResolution;
  time_scope_value?: ReportTimeScopeValue;
  time_scope_units?: ReportTimeScopeUnits;
  resource_scope?: Array<ReportResourceScope>;
  project?: Array<string>;
  cluster?: Array<string>;
  pod?: Array<string>;
  node?: Array<string>;
  tag?: Array<string>;
  infrastructures?: Array<string>;
};
