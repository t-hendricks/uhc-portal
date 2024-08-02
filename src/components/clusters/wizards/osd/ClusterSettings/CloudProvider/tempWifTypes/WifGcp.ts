/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WifPool } from './WifPool';
import type { WifServiceAccount } from './WifServiceAccount';
export type WifGcp = {
  /**
   * This is the service account email that OCM will use to access other SAs.
   */
  impersonator_email?: string;
  /**
   * This represents the GCP project ID in which the wif resources will be configured.
   */
  project_id?: string;
  /**
   * The list of service accounts and their associated roles that will need to be
   * configured on the user's GCP project.
   */
  service_accounts?: Array<WifServiceAccount>;
  /**
   * The workload identity configuration data that will be used to create the
   * workload identity pool on the user's account.
   */
  workload_identity_pool?: WifPool;
};
