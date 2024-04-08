/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ScheduleType } from './ScheduleType';
import type { UpgradePolicyState } from './UpgradePolicyState';
import type { UpgradeType } from './UpgradeType';
/**
 * Representation of an upgrade policy that can be set for a cluster.
 */
export type ControlPlaneUpgradePolicy = {
  /**
   * Indicates the type of this object. Will be 'ControlPlaneUpgradePolicy' if this is a complete object or 'ControlPlaneUpgradePolicyLink' if it is just a link.
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
   * Cluster ID this upgrade policy for control plane is defined for.
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
   * Schedule cron expression that defines automatic upgrade scheduling.
   */
  schedule?: string;
  /**
   * Schedule type of the control plane upgrade.
   */
  schedule_type?: ScheduleType;
  /**
   * State of the upgrade policy for the hosted control plane.
   */
  state?: UpgradePolicyState;
  /**
   * Upgrade type of the control plane.
   */
  upgrade_type?: UpgradeType;
  /**
   * Version is the desired upgrade version.
   */
  version?: string;
};
