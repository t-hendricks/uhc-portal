/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Represents the information associated to an Azure User-Assigned
 * Managed Identity whose purpose is to perform service level actions.
 */
export type AzureServiceManagedIdentity = {
  /**
   * The Client ID associated to the Azure User-Assigned Managed Identity.
   * Readonly.
   */
  client_id?: string;
  /**
   * The Principal ID associated to the Azure User-Assigned Managed Identity.
   * Readonly.
   */
  principal_id?: string;
  /**
   * The Azure Resource ID of the Azure User-Assigned Managed
   * Identity. The managed identity represented must exist before
   * creating the cluster.
   * The Azure Resource Group Name specified as part of the Resource ID
   * must belong to the Azure Subscription specified in `.azure.subscription_id`,
   * and in the same Azure location as the cluster's region.
   * The Azure Resource Group Name specified as part of the Resource ID
   * must be a different Resource Group Name than the one specified in
   * `.azure.managed_resource_group_name`.
   * The Azure Resource Group Name specified as part of the Resource ID
   * can be the same, or a different one than the one specified in
   * `.azure.resource_group_name`.
   * Required during creation.
   * Immutable.
   */
  resource_id?: string;
};
