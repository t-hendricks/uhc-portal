/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReservedResource } from './ReservedResource';
export type QuotaAuthorizationRequest = {
  account_username: string;
  availability_zone?: string;
  cloud_provider_id?: string;
  display_name?: string;
  product_id?: string;
  quota_version?: string;
  reserve?: boolean;
  resource_id?: string;
  resources: Array<ReservedResource>;
  subscription_id?: string;
};
