/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Contains the necessary attributes to support role-based authentication on AWS.
 */
export type ManagedService = {
    /**
     * Indicates whether the cluster belongs to a managed service
     * This should only be set by the "Managed Service" service.
     * clusters with this set can only be modified by the "Managed Service" service.
     */
    enabled?: boolean;
};

