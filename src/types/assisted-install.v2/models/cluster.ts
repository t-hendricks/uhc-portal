/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { cluster_network } from './cluster_network';
import type { cluster_progress_info } from './cluster_progress_info';
import type { disk_encryption } from './disk_encryption';
import type { host } from './host';
import type { host_network } from './host_network';
import type { ignition_endpoint } from './ignition_endpoint';
import type { image_info } from './image_info';
import type { logs_state } from './logs_state';
import type { machine_network } from './machine_network';
import type { monitored_operator } from './monitored_operator';
import type { platform } from './platform';
import type { service_network } from './service_network';

export type cluster = {
    /**
     * A comma-separated list of NTP sources (name or IP) going to be added to all the hosts.
     */
    additional_ntp_source?: string;
    /**
     * Unique identifier of the AMS subscription in OCM.
     */
    ams_subscription_id?: string;
    /**
     * The virtual IP used to reach the OpenShift cluster's API.
     */
    api_vip?: string;
    /**
     * The domain name used to reach the OpenShift cluster API.
     */
    api_vip_dns_name?: string | null;
    /**
     * Base domain of the cluster. All DNS records must be sub-domains of this base and include the cluster name.
     */
    base_dns_domain?: string;
    /**
     * IP address block from which Pod IPs are allocated. This block must not overlap with existing physical networks. These IP addresses are used for the Pod network, and if you need to access the Pods from an external network, configure load balancers and routers to manage the traffic.
     */
    cluster_network_cidr?: string;
    /**
     * The subnet prefix length to assign to each individual node. For example, if clusterNetworkHostPrefix is set to 23, then each node is assigned a /23 subnet out of the given cidr (clusterNetworkCIDR), which allows for 510 (2^(32 - 23) - 2) pod IPs addresses. If you are required to provide access to nodes from an external network, configure load balancers and routers to manage the traffic.
     */
    cluster_network_host_prefix?: number;
    /**
     * Cluster networks that are associated with this cluster.
     */
    cluster_networks?: Array<cluster_network>;
    /**
     * Json formatted string containing the majority groups for connectivity checks.
     */
    connectivity_majority_groups?: string;
    controller_logs_collected_at?: string;
    controller_logs_started_at?: string;
    /**
     * The CPU architecture of the image (x86_64/arm64/etc).
     */
    cpu_architecture?: string;
    /**
     * The time that this cluster was created.
     */
    created_at?: string;
    /**
     * swagger:ignore
     */
    deleted_at?: any;
    /**
     * Information regarding hosts' installation disks encryption.
     */
    disk_encryption?: disk_encryption;
    email_domain?: string;
    /**
     * hosts associated to this cluster that are not in 'disabled' state.
     */
    enabled_host_count?: number;
    /**
     * JSON-formatted string containing the usage information by feature name
     */
    feature_usage?: string;
    /**
     * Guaranteed availability of the installed cluster. 'Full' installs a Highly-Available cluster
     * over multiple master nodes whereas 'None' installs a full cluster over one node.
     *
     */
    high_availability_mode?: cluster.high_availability_mode;
    /**
     * List of host networks to be filled during query.
     */
    host_networks?: Array<host_network>;
    /**
     * Hosts that are associated with this cluster.
     */
    hosts?: Array<host>;
    /**
     * Self link.
     */
    href: string;
    /**
     * A proxy URL to use for creating HTTP connections outside the cluster.
     * http://\<username\>:\<pswd\>@\<ip\>:\<port\>
     *
     */
    http_proxy?: string;
    /**
     * A proxy URL to use for creating HTTPS connections outside the cluster.
     * http://\<username\>:\<pswd\>@\<ip\>:\<port\>
     *
     */
    https_proxy?: string;
    /**
     * Enable/disable hyperthreading on master nodes, worker nodes, or all nodes
     */
    hyperthreading?: cluster.hyperthreading;
    /**
     * Unique identifier of the object.
     */
    id: string;
    /**
     * Json formatted string containing the user overrides for the initial ignition config
     */
    ignition_config_overrides?: string;
    /**
     * Explicit ignition endpoint overrides the default ignition endpoint.
     */
    ignition_endpoint?: ignition_endpoint;
    image_info: image_info;
    /**
     * The virtual IP used for cluster ingress traffic.
     */
    ingress_vip?: string;
    /**
     * The time that this cluster completed installation.
     */
    install_completed_at?: string;
    /**
     * JSON-formatted string containing the user overrides for the install-config.yaml file.
     */
    install_config_overrides?: string;
    /**
     * The time that this cluster started installation.
     */
    install_started_at?: string;
    /**
     * Indicates the type of this object. Will be 'Cluster' if this is a complete object,
     * 'AddHostsCluster' for cluster that add hosts to existing OCP cluster,
     *
     */
    kind: cluster.kind;
    /**
     * The progress of log collection or empty if logs are not applicable
     */
    logs_info?: logs_state;
    /**
     * A CIDR that all hosts belonging to the cluster should have an interfaces with IP address that belongs to this CIDR. The api_vip belongs to this CIDR.
     */
    machine_network_cidr?: string;
    /**
     * Machine networks that are associated with this cluster.
     */
    machine_networks?: Array<machine_network>;
    /**
     * Operators that are associated with this cluster.
     */
    monitored_operators?: Array<monitored_operator>;
    /**
     * Name of the OpenShift cluster.
     */
    name?: string;
    /**
     * The desired network type used.
     */
    network_type?: cluster.network_type | null;
    /**
     * A comma-separated list of destination domain names, domains, IP addresses, or other network CIDRs to exclude from proxying.
     */
    no_proxy?: string;
    /**
     * OpenShift release image URI.
     */
    ocp_release_image?: string;
    /**
     * Cluster ID on OCP system.
     */
    openshift_cluster_id?: string;
    /**
     * Version of the OpenShift cluster.
     */
    openshift_version?: string;
    org_id?: string;
    platform?: platform;
    /**
     * Installation progress percentages of the cluster.
     */
    progress?: cluster_progress_info;
    /**
     * True if the pull secret has been added to the cluster.
     */
    pull_secret_set?: boolean;
    /**
     * hosts associated to this cluster that are in 'known' state.
     */
    ready_host_count?: number;
    /**
     * Schedule workloads on masters
     */
    schedulable_masters?: boolean;
    /**
     * The IP address pool to use for service IP addresses. You can enter only one IP address pool. If you need to access the services from an external network, configure load balancers and routers to manage the traffic.
     */
    service_network_cidr?: string;
    /**
     * Service networks that are associated with this cluster.
     */
    service_networks?: Array<service_network>;
    /**
     * SSH public key for debugging OpenShift nodes.
     */
    ssh_public_key?: string;
    /**
     * Status of the OpenShift cluster.
     */
    status: cluster.status;
    /**
     * Additional information pertaining to the status of the OpenShift cluster.
     */
    status_info: string;
    /**
     * The last time that the cluster status was updated.
     */
    status_updated_at?: string;
    /**
     * All hosts associated to this cluster.
     */
    total_host_count?: number;
    /**
     * The last time that this cluster was updated.
     */
    updated_at?: string;
    /**
     * Indicate if the networking is managed by the user.
     */
    user_managed_networking?: boolean | null;
    user_name?: string;
    /**
     * JSON-formatted string containing the validation results for each validation id grouped by category (network, hosts-data, etc.)
     */
    validations_info?: string;
    /**
     * Indicate if virtual IP DHCP allocation mode is enabled.
     */
    vip_dhcp_allocation?: boolean | null;
};

export namespace cluster {

    /**
     * Guaranteed availability of the installed cluster. 'Full' installs a Highly-Available cluster
     * over multiple master nodes whereas 'None' installs a full cluster over one node.
     *
     */
    export enum high_availability_mode {
        FULL = 'Full',
        NONE = 'None',
    }

    /**
     * Enable/disable hyperthreading on master nodes, worker nodes, or all nodes
     */
    export enum hyperthreading {
        MASTERS = 'masters',
        WORKERS = 'workers',
        ALL = 'all',
        NONE = 'none',
    }

    /**
     * Indicates the type of this object. Will be 'Cluster' if this is a complete object,
     * 'AddHostsCluster' for cluster that add hosts to existing OCP cluster,
     *
     */
    export enum kind {
        CLUSTER = 'Cluster',
        ADD_HOSTS_CLUSTER = 'AddHostsCluster',
    }

    /**
     * The desired network type used.
     */
    export enum network_type {
        OPEN_SHIFT_SDN = 'OpenShiftSDN',
        OVNKUBERNETES = 'OVNKubernetes',
    }

    /**
     * Status of the OpenShift cluster.
     */
    export enum status {
        INSUFFICIENT = 'insufficient',
        READY = 'ready',
        ERROR = 'error',
        PREPARING_FOR_INSTALLATION = 'preparing-for-installation',
        PENDING_FOR_INPUT = 'pending-for-input',
        INSTALLING = 'installing',
        FINALIZING = 'finalizing',
        INSTALLED = 'installed',
        ADDING_HOSTS = 'adding-hosts',
        CANCELLED = 'cancelled',
        INSTALLING_PENDING_USER_ACTION = 'installing-pending-user-action',
    }


}

