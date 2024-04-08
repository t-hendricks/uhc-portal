/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Report } from './Report';
import type { ReportOpenShiftAzureFilter } from './ReportOpenShiftAzureFilter';
import type { ReportOpenShiftAzureGrouping } from './ReportOpenShiftAzureGrouping';
import type { ReportOpenShiftAzureOrdering } from './ReportOpenShiftAzureOrdering';
export type ReportOpenShiftAzureStorageInventory = Report & {
  group_by?: ReportOpenShiftAzureGrouping;
  order_by?: ReportOpenShiftAzureOrdering;
  filter?: ReportOpenShiftAzureFilter;
  data: Array<Record<string, any>>;
};
