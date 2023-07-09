/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UpgradePolicyState } from './UpgradePolicyState';

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
   * Schedule type can be either "manual" (single execution) or "automatic" (re-occurring).
   */
  schedule_type?: string;
  /**
   * State of the upgrade policy for the hosted control plane.
   */
  state?: UpgradePolicyState;
  /**
   * Upgrade type specify the type of the upgrade. Can only be "ControlPlane".
   */
  upgrade_type?: string;
  /**
   * Version is the desired upgrade version.
   */
  version?: string;
};
