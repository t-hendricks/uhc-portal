/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { cluster_network } from './cluster_network';
import type { disk_encryption } from './disk_encryption';
import type { ignition_endpoint } from './ignition_endpoint';
import type { machine_network } from './machine_network';
import type { operator_create_params } from './operator_create_params';
import type { platform } from './platform';
import type { service_network } from './service_network';

export type v2_cluster_update_params = {
    /**
     * A comma-separated list of NTP sources (name or IP) going to be added to all the hosts.
     */
    additional_ntp_source?: string | null;
    /**
     * The virtual IP used to reach the OpenShift cluster's API.
     */
    api_vip?: string | null;
    /**
     * The domain name used to reach the OpenShift cluster API.
     */
    api_vip_dns_name?: string | null;
    /**
     * Base domain of the cluster. All DNS records must be sub-domains of this base and include the cluster name.
     */
    base_dns_domain?: string | null;
    /**
     * IP address block from which Pod IPs are allocated. This block must not overlap with existing physical networks. These IP addresses are used for the Pod network, and if you need to access the Pods from an external network, configure load balancers and routers to manage the traffic.
     */
    cluster_network_cidr?: string | null;
    /**
     * The subnet prefix length to assign to each individual node. For example, if clusterNetworkHostPrefix is set to 23, then each node is assigned a /23 subnet out of the given cidr (clusterNetworkCIDR), which allows for 510 (2^(32 - 23) - 2) pod IPs addresses. If you are required to provide access to nodes from an external network, configure load balancers and routers to manage the traffic.
     */
    cluster_network_host_prefix?: number | null;
    /**
     * Cluster networks that are associated with this cluster.
     */
    cluster_networks?: Array<cluster_network> | null;
    /**
     * Installation disks encryption mode and host roles to be applied.
     */
    disk_encryption?: disk_encryption;
    /**
     * A proxy URL to use for creating HTTP connections outside the cluster.
     * http://\<username\>:\<pswd\>@\<ip\>:\<port\>
     *
     */
    http_proxy?: string | null;
    /**
     * A proxy URL to use for creating HTTPS connections outside the cluster.
     * http://\<username\>:\<pswd\>@\<ip\>:\<port\>
     *
     */
    https_proxy?: string | null;
    /**
     * Enable/disable hyperthreading on master nodes, worker nodes, or all nodes.
     */
    hyperthreading?: v2_cluster_update_params.hyperthreading | null;
    /**
     * Explicit ignition endpoint overrides the default ignition endpoint.
     */
    ignition_endpoint?: ignition_endpoint;
    /**
     * The virtual IP used for cluster ingress traffic.
     */
    ingress_vip?: string | null;
    /**
     * A CIDR that all hosts belonging to the cluster should have an interfaces with IP address that belongs to this CIDR. The api_vip belongs to this CIDR.
     */
    machine_network_cidr?: string | null;
    /**
     * Machine networks that are associated with this cluster.
     */
    machine_networks?: Array<machine_network> | null;
    /**
     * OpenShift cluster name.
     */
    name?: string | null;
    /**
     * The desired network type used.
     */
    network_type?: v2_cluster_update_params.network_type | null;
    /**
     * An "*" or a comma-separated list of destination domain names, domains, IP addresses, or other network CIDRs to exclude from proxying.
     */
    no_proxy?: string | null;
    /**
     * List of OLM operators to be installed.
     */
    olm_operators?: Array<operator_create_params>;
    platform?: platform;
    /**
     * The pull secret obtained from Red Hat OpenShift Cluster Manager at console.redhat.com/openshift/install/pull-secret.
     */
    pull_secret?: string | null;
    /**
     * Schedule workloads on masters
     */
    schedulable_masters?: boolean;
    /**
     * The IP address pool to use for service IP addresses. You can enter only one IP address pool. If you need to access the services from an external network, configure load balancers and routers to manage the traffic.
     */
    service_network_cidr?: string | null;
    /**
     * Service networks that are associated with this cluster.
     */
    service_networks?: Array<service_network> | null;
    /**
     * SSH public key for debugging OpenShift nodes.
     */
    ssh_public_key?: string | null;
    /**
     * Indicate if the networking is managed by the user.
     */
    user_managed_networking?: boolean | null;
    /**
     * Indicate if virtual IP DHCP allocation mode is enabled.
     */
    vip_dhcp_allocation?: boolean | null;
};

export namespace v2_cluster_update_params {

    /**
     * Enable/disable hyperthreading on master nodes, worker nodes, or all nodes.
     */
    export enum hyperthreading {
        MASTERS = 'masters',
        WORKERS = 'workers',
        ALL = 'all',
        NONE = 'none',
    }

    /**
     * The desired network type used.
     */
    export enum network_type {
        OPEN_SHIFT_SDN = 'OpenShiftSDN',
        OVNKUBERNETES = 'OVNKubernetes',
    }


}

