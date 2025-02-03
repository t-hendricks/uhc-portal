/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WifIdentityProvider } from './WifIdentityProvider';
export type WifPool = {
  /**
   * Identity provider configuration data that will be created as part of the
   * workload identity pool.
   */
  identity_provider?: WifIdentityProvider;
  /**
   * The Id of the workload identity pool.
   */
  pool_id?: string;
  /**
   * The display name of the workload identity pool.
   */
  pool_name?: string;
};
