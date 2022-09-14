/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClusterMetricsNodes } from './ClusterMetricsNodes';
import type { ClusterResource } from './ClusterResource';
import type { ClusterUpgrade } from './ClusterUpgrade';

export type OneMetric = {
    arch?: string;
    channel_info?: string;
    cloud_provider: string;
    cluster_type: string;
    compute_nodes_cpu: ClusterResource;
    compute_nodes_memory: ClusterResource;
    compute_nodes_sockets: ClusterResource;
    console_url: string;
    cpu: ClusterResource;
    critical_alerts_firing: number;
    health_state?: OneMetric.health_state;
    memory: ClusterResource;
    nodes: ClusterMetricsNodes;
    non_virt_nodes: number;
    openshift_version: string;
    operating_system: string;
    operators_condition_failing: number;
    query_timestamp?: string;
    region: string;
    sockets: ClusterResource;
    state: string;
    state_description: string;
    storage: ClusterResource;
    subscription_cpu_total: number;
    subscription_obligation_exists: number;
    subscription_socket_total: number;
    upgrade: ClusterUpgrade;
};

export namespace OneMetric {

    export enum health_state {
        HEALTHY = 'healthy',
        UNHEALTHY = 'unhealthy',
        UNKNOWN = 'unknown',
    }


}

