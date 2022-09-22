/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * GCP Network configuration of a cluster.
 */
export type GCPNetwork = {
    /**
     * VPC mame used by the cluster.
     */
    vpc_name?: string;
    /**
     * Compute subnet used by the cluster.
     */
    compute_subnet?: string;
    /**
     * Control plane subnet used by the cluster.
     */
    control_plane_subnet?: string;
};

