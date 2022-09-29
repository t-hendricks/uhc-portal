/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SelfResourceReviewRequest = {
  action?: SelfResourceReviewRequest.action;
  resource_type?: SelfResourceReviewRequest.resource_type;
};

export namespace SelfResourceReviewRequest {
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
