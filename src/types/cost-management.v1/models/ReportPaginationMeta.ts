/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ReportAzureFilter } from './ReportAzureFilter';
import type { ReportAzureGrouping } from './ReportAzureGrouping';
import type { ReportAzureOrdering } from './ReportAzureOrdering';
import type { ReportCostsOpenShiftOrdering } from './ReportCostsOpenShiftOrdering';
import type { ReportDelta } from './ReportDelta';
import type { ReportFilter } from './ReportFilter';
import type { ReportGrouping } from './ReportGrouping';
import type { ReportInventoryOpenShiftOrdering } from './ReportInventoryOpenShiftOrdering';
import type { ReportOpenShiftAWSFilter } from './ReportOpenShiftAWSFilter';
import type { ReportOpenShiftAWSGrouping } from './ReportOpenShiftAWSGrouping';
import type { ReportOpenShiftAWSOrdering } from './ReportOpenShiftAWSOrdering';
import type { ReportOpenShiftAzureFilter } from './ReportOpenShiftAzureFilter';
import type { ReportOpenShiftAzureGrouping } from './ReportOpenShiftAzureGrouping';
import type { ReportOpenShiftAzureOrdering } from './ReportOpenShiftAzureOrdering';
import type { ReportOpenShiftFilter } from './ReportOpenShiftFilter';
import type { ReportOpenShiftGrouping } from './ReportOpenShiftGrouping';
import type { ReportOrdering } from './ReportOrdering';

export type ReportPaginationMeta = {
  count?: number;
  delta?: ReportDelta;
  group_by?:
    | ReportGrouping
    | ReportAzureGrouping
    | ReportOpenShiftGrouping
    | ReportOpenShiftAWSGrouping
    | ReportOpenShiftAzureGrouping;
  order_by?:
    | ReportOrdering
    | ReportAzureOrdering
    | ReportCostsOpenShiftOrdering
    | ReportInventoryOpenShiftOrdering
    | ReportOpenShiftAWSOrdering
    | ReportOpenShiftAzureOrdering;
  filter?:
    | ReportFilter
    | ReportAzureFilter
    | ReportOpenShiftFilter
    | ReportOpenShiftAWSFilter
    | ReportOpenShiftAzureFilter;
  /**
   * The units for the output data.
   */
  units?: string;
};
