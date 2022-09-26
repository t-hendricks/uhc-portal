/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SelfResourceReview = {
  action: SelfResourceReview.action;
  cluster_ids: Array<string>;
  cluster_uuids: Array<string>;
  organization_ids: Array<string>;
  resource_type: SelfResourceReview.resource_type;
  subscription_ids: Array<string>;
};

export namespace SelfResourceReview {
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
