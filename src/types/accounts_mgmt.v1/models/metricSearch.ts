/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The `search` paramter specifies the PromQL selector. The syntax is defined by Prometheus at
 * https://prometheus.io/docs/prometheus/latest/querying/basics/#time-series-selectors.
 * It only supports simple selections as shown in https://prometheus.io/docs/prometheus/latest/querying/examples/#simple-time-series-selection.
 * For example, in order to retrieve subscription_sync_total with names starting with `managed` and with a channel = `production`:
 *
 * ```
 * name=~'managed.*',channel='production'
 * ```
 *
 * If the parameter isn't provided, or if the value is empty, then all the records will be returned.
 */
export type metricSearch = string;
