/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrgUnitId } from './OrgUnitId';
import type { ReportResolution } from './ReportResolution';
import type { ReportTimeScopeUnits } from './ReportTimeScopeUnits';
import type { ReportTimeScopeValue } from './ReportTimeScopeValue';

export type OrganizationFilter = {
  resolution?: ReportResolution;
  time_scope_value?: ReportTimeScopeValue;
  time_scope_units?: ReportTimeScopeUnits;
  org_unit_id?: OrgUnitId;
};
