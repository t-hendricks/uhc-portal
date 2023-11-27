/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ScheduleType } from './ScheduleType';
import type { UpgradeType } from './UpgradeType';

/**
 * Representation of an upgrade policy that can be set for a cluster.
 */
export type UpgradePolicy = {
  /**
   * Indicates the type of this object. Will be 'UpgradePolicy' if this is a complete object or 'UpgradePolicyLink' if it is just a link.
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
   * Cluster ID this upgrade policy is defined for.
   */
  cluster_id?: string;
  /**
   * Indicates if minor version upgrades are allowed for automatic upgrades (for manual it's always allowed).
   */
  enable_minor_version_upgrades?: boolean;
  /**
   * Next time the upgrade should run.
   */
  next_run?: string;
  /**
   * Schedule cron expression that defines automatic upgrade scheduling.
   */
  schedule?: string;
  /**
   * Schedule type of the upgrade.
   */
  schedule_type?: ScheduleType;
  /**
   * Upgrade type specify the type of the upgrade.
   */
  upgrade_type?: UpgradeType;
  /**
   * Version is the desired upgrade version.
   */
  version?: string;
};
