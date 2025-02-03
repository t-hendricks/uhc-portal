/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AzureOperatorsAuthenticationManagedIdentities } from './AzureOperatorsAuthenticationManagedIdentities';
/**
 * The configuration that the operators of the
 * cluster have to authenticate to Azure.
 */
export type AzureOperatorsAuthentication = {
  /**
   * The authentication configuration to authenticate
   * to Azure using Azure User-Assigned Managed Identities.
   * Required during creation.
   */
  managed_identities?: AzureOperatorsAuthenticationManagedIdentities;
};
