/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Report } from './Report';
import type { ReportOpenShiftAzureFilter } from './ReportOpenShiftAzureFilter';
import type { ReportOpenShiftAzureGrouping } from './ReportOpenShiftAzureGrouping';
import type { ReportOpenShiftAzureOrdering } from './ReportOpenShiftAzureOrdering';

export type ReportOpenShiftAzureInstanceInventory = (Report & {
    group_by?: ReportOpenShiftAzureGrouping;
    order_by?: ReportOpenShiftAzureOrdering;
    filter?: ReportOpenShiftAzureFilter;
    data: Array<any>;
});

