/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of an upgrade policy that can be set for a cluster.
 */
export type AddonUpgradePolicy = {
  /**
   * Indicates the type of this object. Will be 'AddonUpgradePolicy' if this is a complete object or 'AddonUpgradePolicyLink' if it is just a link.
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
   * Addon ID this upgrade policy is defined for
   */
  addon_id?: string;
  /**
   * Cluster ID this upgrade policy is defined for.
   */
  cluster_id?: string;
  /**
   * Next time the upgrade should run.
   */
  next_run?: string;
  /**
   * Schedule cron expression that defines automatic upgrade scheduling.
   */
  schedule?: string;
  /**
   * Schedule type can be either "manual" (single execution) or "automatic" (re-occurring).
   */
  schedule_type?: string;
  /**
   * Upgrade type specify the type of the upgrade. Must be "ADDON".
   */
  upgrade_type?: string;
  /**
   * Version is the desired upgrade version.
   */
  version?: string;
};
