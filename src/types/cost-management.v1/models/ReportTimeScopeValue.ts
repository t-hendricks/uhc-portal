/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The time scope to apply to the report. Default time scope is '-10', meaning the last 10 days. Last 30 days would be '-30'. '-10' and '-30' are only valid when used with 'day' time_scope_units.'-1' is used for current month, '-2' is used for last month when time_scope_units is 'month' otherwise invalid.
 */
export enum ReportTimeScopeValue {
    '_-1' = -1,
    '_-2' = -2,
    '_-10' = -10,
    '_-30' = -30,
}
