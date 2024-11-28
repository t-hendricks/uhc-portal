/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AzureOperatorsAuthentication } from './AzureOperatorsAuthentication';
/**
 * Microsoft Azure settings of a cluster.
 */
export type Azure = {
  /**
   * The desired name of the Azure Resource Group where the Azure Resources related
   * to the cluster are created. It must not previously exist. The Azure Resource
   * Group is created with the given value, within the Azure Subscription
   * `subscription_id` of the cluster.
   * `managed_resource_group_name` cannot be equal to the value of `managed_resource_group`.
   * `managed_resource_group_name` is located in the same Azure location as the
   * cluster's region.
   * Not to be confused with `resource_group_name`, which is the Azure Resource Group Name
   * where the own Azure Resource associated to the cluster resides.
   * Required during creation.
   * Immutable.
   */
  managed_resource_group_name?: string;
  /**
   * The Azure Resource ID of a pre-existing Azure Network Security Group.
   * The Network Security Group specified in network_security_group_resource_id
   * must already be associated to the Azure Subnet `subnet_resource_id`.
   * It is the Azure Network Security Group associated to the cluster's subnet
   * specified in `subnet_resource_id`.
   * `network_security_group_resource_id` must be located in the same Azure
   * location as the cluster's region.
   * The Azure Subscription specified as part of
   * `network_security_group_resource_id` must be located in the same Azure
   * Subscription as `subscription_id`.
   * The Azure Resource Group Name specified as part of `network_security_group_resource_id`
   * must belong to the Azure Subscription `subscription_id`, and in the same
   * Azure location as the cluster's region.
   * The Azure Resource Group Name specified as part of `network_security_group_resource_id`
   * must be a different Resource Group Name than the one specified in
   * `managed_resource_group_name`.
   * The Azure Resource Group Name specified as part of `network_security_group_resource_id`
   * can be the same, or a different one than the one specified in
   * `resource_group_name`.
   * Required during creation.
   * Immutable.
   */
  network_security_group_resource_id?: string;
  /**
   * Defines how the operators of the cluster authenticate to Azure.
   * Required during creation.
   * Immutable.
   */
  operators_authentication?: AzureOperatorsAuthentication;
  /**
   * The Azure Resource Group Name of the cluster. It must be a pre-existing
   * Azure Resource Group and it must exist within the Azure Subscription
   * `subscription_id` of the cluster.
   * `resource_group_name` is located in the same Azure location as the
   * cluster's region.
   * Required during creation.
   * Immutable.
   */
  resource_group_name?: string;
  /**
   * The Azure Resource Name of the cluster. It must be within the
   * Azure Resource Group Name `resource_group_name`.
   * `resource_name` is located in the same Azure location as the cluster's region.
   * Required during creation.
   * Immutable.
   */
  resource_name?: string;
  /**
   * The Azure Resource ID of a pre-existing Azure Subnet. It is an Azure
   * Subnet used for the Data Plane of the cluster. `subnet_resource_id`
   * must be located in the same Azure location as the cluster's region.
   * The Azure Subscription specified as part of the `subnet_resource_id`
   * must be located in the same Azure Subscription as `subscription_id`.
   * The Azure Resource Group Name specified as part of `subnet_resource_id`
   * must belong to the Azure Subscription `subscription_id`, and in the same
   * Azure location as the cluster's region.
   * The Azure Resource Group Name specified as part of `subnet_resource_id`
   * must be a different Resource Group Name than the one specified in
   * `managed_resource_group_name`.
   * The Azure Resource Group Name specified as part of the `subnet_resource_id`
   * can be the same, or a different one than the one specified in
   * `resource_group_name`.
   * Required during creation.
   * Immutable.
   */
  subnet_resource_id?: string;
  /**
   * The Azure Subscription ID associated with the cluster. It must belong to
   * the Microsoft Entra Tenant ID `tenant_id`.
   * Required during creation.
   * Immutable.
   */
  subscription_id?: string;
  /**
   * The Microsoft Entra Tenant ID where the cluster belongs.
   * Required during creation.
   * Immutable.
   */
  tenant_id?: string;
};
