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

export type cluster_create_params = {
  /**
   * A comma-separated list of NTP sources (name or IP) going to be added to all the hosts.
   */
  additional_ntp_source?: string | null;
  /**
   * The virtual IP used to reach the OpenShift cluster's API.
   */
  api_vip?: string;
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
  cluster_networks?: Array<cluster_network> | null;
  /**
   * The CPU architecture of the image (x86_64/arm64/etc).
   */
  cpu_architecture?: string;
  /**
   * Installation disks encryption mode and host roles to be applied.
   */
  disk_encryption?: disk_encryption;
  /**
   * Guaranteed availability of the installed cluster. 'Full' installs a Highly-Available cluster
   * over multiple master nodes whereas 'None' installs a full cluster over one node.
   *
   */
  high_availability_mode?: cluster_create_params.high_availability_mode;
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
  hyperthreading?: cluster_create_params.hyperthreading;
  /**
   * Explicit ignition endpoint overrides the default ignition endpoint.
   */
  ignition_endpoint?: ignition_endpoint;
  /**
   * The virtual IP used for cluster ingress traffic.
   */
  ingress_vip?: string;
  /**
   * Machine networks that are associated with this cluster.
   */
  machine_networks?: Array<machine_network> | null;
  /**
   * Name of the OpenShift cluster.
   */
  name: string;
  /**
   * The desired network type used.
   */
  network_type?: cluster_create_params.network_type;
  /**
   * An "*" or a comma-separated list of destination domain names, domains, IP addresses, or other network CIDRs to exclude from proxying.
   */
  no_proxy?: string | null;
  /**
   * OpenShift release image URI.
   */
  ocp_release_image?: string;
  /**
   * List of OLM operators to be installed.
   */
  olm_operators?: Array<operator_create_params>;
  /**
   * Version of the OpenShift cluster.
   */
  openshift_version: string;
  platform?: platform | null;
  /**
   * The pull secret obtained from Red Hat OpenShift Cluster Manager at console.redhat.com/openshift/install/pull-secret.
   */
  pull_secret: string;
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
  service_networks?: Array<service_network> | null;
  /**
   * SSH public key for debugging OpenShift nodes.
   */
  ssh_public_key?: string;
  /**
   * Indicate if the networking is managed by the user.
   */
  user_managed_networking?: boolean | null;
  /**
   * Indicate if virtual IP DHCP allocation mode is enabled.
   */
  vip_dhcp_allocation?: boolean | null;
};

export namespace cluster_create_params {
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
   * Enable/disable hyperthreading on master nodes, worker nodes, or all nodes.
   */
  export enum hyperthreading {
    MASTERS = 'masters',
    WORKERS = 'workers',
    NONE = 'none',
    ALL = 'all',
  }

  /**
   * The desired network type used.
   */
  export enum network_type {
    OPEN_SHIFT_SDN = 'OpenShiftSDN',
    OVNKUBERNETES = 'OVNKubernetes',
  }
}
