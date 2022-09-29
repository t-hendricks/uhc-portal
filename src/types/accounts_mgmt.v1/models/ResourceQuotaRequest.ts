/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ResourceQuotaRequest = {
  sku: string;
  sku_count: number;
  type?: ResourceQuotaRequest.type;
};

export namespace ResourceQuotaRequest {
  export enum type {
    CONFIG = 'Config',
    MANUAL = 'Manual',
    SUBSCRIPTION = 'Subscription',
  }
}
