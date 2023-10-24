/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ScheduleType } from './ScheduleType';
import type { UpgradePolicyState } from './UpgradePolicyState';
import type { UpgradeType } from './UpgradeType';

/**
 * Representation of an upgrade policy that can be set for a node pool.
 */
export type NodePoolUpgradePolicy = {
  /**
   * Indicates the type of this object. Will be 'NodePoolUpgradePolicy' if this is a complete object or 'NodePoolUpgradePolicyLink' if it is just a link.
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
   * Cluster ID this upgrade policy for node pool is defined for.
   */
  cluster_id?: string;
  /**
   * Timestamp for creation of resource.
   */
  creation_timestamp?: string;
  /**
   * Indicates if minor version upgrades are allowed for automatic upgrades (for manual it's always allowed).
   */
  enable_minor_version_upgrades?: boolean;
  /**
   * Timestamp for last update that happened to resource.
   */
  last_update_timestamp?: string;
  /**
   * Next time the upgrade should run.
   */
  next_run?: string;
  /**
   * Node Pool ID this upgrade policy is defined for.
   */
  node_pool_id?: string;
  /**
   * Schedule cron expression that defines automatic upgrade scheduling.
   */
  schedule?: string;
  /**
   * Schedule type of the upgrade.
   */
  schedule_type?: ScheduleType;
  /**
   * State of the upgrade policy for the node pool.
   */
  state?: UpgradePolicyState;
  /**
   * Upgrade type of the node pool.
   */
  upgrade_type?: UpgradeType;
  /**
   * Version is the desired upgrade version.
   */
  version?: string;
};
