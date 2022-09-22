/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

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
     * Schedule type can be either "manual" (single execution) or "automatic" (re-occurring).
     */
    schedule_type?: string;
    /**
     * Upgrade type specify the type of the upgrade. Can be "OSD" or "CVE".
     */
    upgrade_type?: string;
    /**
     * Version is the desired upgrade version.
     */
    version?: string;
};

