/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ResourceReviewRequest = {
  account_username?: string;
  action?: ResourceReviewRequest.action;
  resource_type?: ResourceReviewRequest.resource_type;
};

export namespace ResourceReviewRequest {
  export enum action {
    GET = 'get',
    DELETE = 'delete',
    UPDATE = 'update',
  }

  export enum resource_type {
    CLUSTER = 'Cluster',
    SUBSCRIPTION = 'Subscription',
  }
}
