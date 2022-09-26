/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CapabilityReviewRequest = {
  account_username: string;
  capability: CapabilityReviewRequest.capability;
  cluster_id?: string;
  organization_id?: string;
  subscription_id?: string;
  type: CapabilityReviewRequest.type;
};

export namespace CapabilityReviewRequest {
  export enum capability {
    MANAGE_CLUSTER_ADMIN = 'manage_cluster_admin',
  }

  export enum type {
    CLUSTER = 'Cluster',
  }
}
