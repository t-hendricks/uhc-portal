/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The ordering to apply to the report. Default is ascending order for the data.
 */
export type ReportAzureOrdering = {
    infrastructure?: ReportAzureOrdering.infrastructure;
    supplementary?: ReportAzureOrdering.supplementary;
    cost?: ReportAzureOrdering.cost;
    usage?: ReportAzureOrdering.usage;
    delta?: ReportAzureOrdering.delta;
    subscription_guid?: ReportAzureOrdering.subscription_guid;
    resource_location?: ReportAzureOrdering.resource_location;
    service_name?: ReportAzureOrdering.service_name;
    instance_type?: ReportAzureOrdering.instance_type;
};

export namespace ReportAzureOrdering {

    export enum infrastructure {
        ASC = 'asc',
        DESC = 'desc',
    }

    export enum supplementary {
        ASC = 'asc',
        DESC = 'desc',
    }

    export enum cost {
        ASC = 'asc',
        DESC = 'desc',
    }

    export enum usage {
        ASC = 'asc',
        DESC = 'desc',
    }

    export enum delta {
        ASC = 'asc',
        DESC = 'desc',
    }

    export enum subscription_guid {
        ASC = 'asc',
        DESC = 'desc',
    }

    export enum resource_location {
        ASC = 'asc',
        DESC = 'desc',
    }

    export enum service_name {
        ASC = 'asc',
        DESC = 'desc',
    }

    export enum instance_type {
        ASC = 'asc',
        DESC = 'desc',
    }


}

