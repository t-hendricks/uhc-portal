/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrgUnitId } from './OrgUnitId';

/**
 * The grouping to apply to the report. No grouping by default. When grouping by account the account_alias will be provided if avaiable.
 */
export type ReportGrouping = {
    account?: Array<string>;
    service?: Array<string>;
    region?: Array<string>;
    az?: Array<string>;
    instance_type?: Array<string>;
    storage_type?: Array<string>;
    tag?: Array<string>;
    org_unit_id?: OrgUnitId;
};

