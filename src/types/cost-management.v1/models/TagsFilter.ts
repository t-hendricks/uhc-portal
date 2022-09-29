/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReportResolution } from './ReportResolution';
import type { ReportTimeScopeUnits } from './ReportTimeScopeUnits';
import type { ReportTimeScopeValue } from './ReportTimeScopeValue';

export type TagsFilter = {
  resolution?: ReportResolution;
  time_scope_value?: ReportTimeScopeValue;
  time_scope_units?: ReportTimeScopeUnits;
};
