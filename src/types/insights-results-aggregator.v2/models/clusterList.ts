/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type clusterList = Array<{
    cluster_id?: string;
    /**
     * An human-readable name for the cluster
     */
    cluster_name?: string;
    /**
     * [Optional] Cluster version
     */
    cluster_version?: string;
    /**
     * Dictionary with numeric representation of total risk as keys, the number of rule hits by each total risk as values.
     */
    hits_by_total_risk?: any;
    /**
     * [Optional] Last time of analysis for given cluster.
     */
    last_checked_at?: string;
    /**
     * Total number of rules hitting for given cluster. 0 combined with an empty last_checked_at means we haven't received any archive from that cluster. 0 hits with a valid timestamp means we have an archive, but there are no rule hits.
     */
    total_hit_count?: number;
}>;
