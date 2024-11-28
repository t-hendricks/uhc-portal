/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Representation of node pool management.
 */
export type NodePoolManagementUpgrade = {
  /**
   * Indicates the type of this object. Will be 'NodePoolManagementUpgrade' if this is a complete object or 'NodePoolManagementUpgradeLink' if it is just a link.
   */
  kind?: string;
  /**
   * Unique identifier of the object.
   */
  id?: string;
  /**
   * Self link.
   */
  href?: string;
  /**
   * Maximum number of nodes in the NodePool of a ROSA HCP cluster that can be scheduled above the desired number of nodes during the upgrade.
   */
  max_surge?: string;
  /**
   * Maximum number of nodes in the NodePool of a ROSA HCP cluster that can be unavailable during the upgrade.
   */
  max_unavailable?: string;
  /**
   * Type of strategy for handling upgrades.
   */
  type?: string;
};
