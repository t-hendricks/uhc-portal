/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SubscriptionCreateRequest = {
  cluster_uuid: string;
  console_url?: string;
  display_name?: string;
  plan_id: SubscriptionCreateRequest.plan_id;
  status: SubscriptionCreateRequest.status;
};

export namespace SubscriptionCreateRequest {
  export enum plan_id {
    OCP = 'OCP',
  }

  export enum status {
    DISCONNECTED = 'Disconnected',
  }
}
