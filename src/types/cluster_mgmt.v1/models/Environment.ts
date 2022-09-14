/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Description of an environment
 */
export type Environment = {
    /**
     * last time that the worker checked for limited support clusters
     */
    last_limited_support_check?: string;
    /**
     * last time that the worker checked for available upgrades
     */
    last_upgrade_available_check?: string;
    /**
     * environment name
     */
    name?: string;
};

