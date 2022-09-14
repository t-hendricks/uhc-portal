/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Cluster Resource which belongs to a cluster, example Cluster Deployment.
 */
export type ClusterResources = {
    /**
     * Indicates the type of this object. Will be 'ClusterResources' if this is a complete object or 'ClusterResourcesLink' if it is just a link.
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
     * Cluster ID for the fetched resources
     */
    cluster_id?: string;
    /**
     * Date and time when the resources were fetched.
     */
    creation_timestamp?: string;
    /**
     * Returned map of cluster resources fetched.
     */
    resources?: Record<string, string>;
};

