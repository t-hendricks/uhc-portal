/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The grouping to apply to the report. No grouping by default. When grouping by account the account_alias will be provided if avaiable.
 */
export type ReportAzureGrouping = {
    subscription_guid?: Array<string>;
    service_name?: Array<string>;
    resource_location?: Array<string>;
    instance_type?: Array<string>;
    tag?: Array<string>;
};

