/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ResourceReview = {
    account_username: string;
    action: ResourceReview.action;
    cluster_ids: Array<string>;
    cluster_uuids: Array<string>;
    organization_ids: Array<string>;
    resource_type: ResourceReview.resource_type;
    subscription_ids: Array<string>;
};

export namespace ResourceReview {

    export enum action {
        GET = 'get',
        LIST = 'list',
        CREATE = 'create',
        DELETE = 'delete',
        UPDATE = 'update',
    }

    export enum resource_type {
        CLUSTER = 'Cluster',
        SUBSCRIPTION = 'Subscription',
    }


}

