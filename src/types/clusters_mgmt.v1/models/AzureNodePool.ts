/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Representation of azure node pool specific parameters.
 */
export type AzureNodePool = {
  /**
   * The size in GiB to assign to the OS disks of the
   * Nodes in the Node Pool. The property
   * is the number of bytes x 1024^3.
   * If not specified, OS disk size is 30 GiB.
   */
  os_disk_size_gibibytes?: number;
  /**
   * The disk storage account type to use for the OS disks of the Nodes in the
   * Node Pool. Valid values are:
   * * Standard_LRS: HDD
   * * StandardSSD_LRS: Standard SSD
   * * Premium_LRS: Premium SDD
   * * UltraSSD_LRS: Ultra SDD
   *
   * If not specified, `Premium_LRS` is used.
   */
  os_disk_storage_account_type?: string;
  /**
   * The Azure Virtual Machine size identifier used for the
   * Nodes of the Node Pool.
   * Availability of VM sizes are dependent on the Azure Location
   * of the parent Cluster.
   * Required during creation.
   */
  vm_size?: string;
  /**
   * Enables Ephemeral OS Disks for the Nodes in the Node Pool.
   * If not specified, no Ephemeral OS Disks are used.
   */
  ephemeral_os_disk_enabled?: boolean;
  /**
   * ResourceName is the Azure Resource Name of the NodePool.
   * ResourceName must be within the Azure Resource Group Name of the parent
   * Cluster it belongs to.
   * ResourceName must be located in the same Azure Location as the parent
   * Cluster it belongs to.
   * ResourceName must be located in the same Azure Subscription as the parent
   * Cluster it belongs to.
   * ResourceName must belong to the same Microsoft Entra Tenant ID as the parent
   * Cluster it belongs to.
   * Required during creation.
   * Immutable.
   */
  resource_name?: string;
};
