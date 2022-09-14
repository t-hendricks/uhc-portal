/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Organization = {
    org_unit_id: string;
    org_unit_name?: string;
    org_unit_path: string;
    level: number;
    /**
     * the list of sub orgs under the org
     */
    sub_orgs: Array<string>;
    /**
     * the list of accounts under the org
     */
    accounts: Array<string>;
};

