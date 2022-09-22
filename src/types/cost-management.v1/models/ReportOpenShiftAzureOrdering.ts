/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The ordering to apply to the report. Default is ascending order for the data.
 */
export type ReportOpenShiftAzureOrdering = {
    infrastructure?: ReportOpenShiftAzureOrdering.infrastructure;
    supplementary?: ReportOpenShiftAzureOrdering.supplementary;
    cost?: ReportOpenShiftAzureOrdering.cost;
    usage?: ReportOpenShiftAzureOrdering.usage;
    delta?: ReportOpenShiftAzureOrdering.delta;
    subscription_guid?: ReportOpenShiftAzureOrdering.subscription_guid;
    resource_location?: ReportOpenShiftAzureOrdering.resource_location;
    service_name?: ReportOpenShiftAzureOrdering.service_name;
    instance_type?: ReportOpenShiftAzureOrdering.instance_type;
    cluster?: ReportOpenShiftAzureOrdering.cluster;
    project?: ReportOpenShiftAzureOrdering.project;
    node?: ReportOpenShiftAzureOrdering.node;
};

export namespace ReportOpenShiftAzureOrdering {

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

    export enum cluster {
        ASC = 'asc',
        DESC = 'desc',
    }

    export enum project {
        ASC = 'asc',
        DESC = 'desc',
    }

    export enum node {
        ASC = 'asc',
        DESC = 'desc',
    }


}

