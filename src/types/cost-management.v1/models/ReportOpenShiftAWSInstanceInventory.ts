/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Report } from './Report';
import type { ReportOpenShiftAWSFilter } from './ReportOpenShiftAWSFilter';
import type { ReportOpenShiftAWSGrouping } from './ReportOpenShiftAWSGrouping';
import type { ReportOpenShiftAWSOrdering } from './ReportOpenShiftAWSOrdering';

export type ReportOpenShiftAWSInstanceInventory = (Report & {
    group_by?: ReportOpenShiftAWSGrouping;
    order_by?: ReportOpenShiftAWSOrdering;
    filter?: ReportOpenShiftAWSFilter;
    data: Array<any>;
});

