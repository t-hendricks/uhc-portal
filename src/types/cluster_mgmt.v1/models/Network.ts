/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Network configuration of a cluster.
 */
export type Network = {
  /**
   * Network host prefix which is defaulted to `23` if not specified.
   */
  host_prefix?: number;
  /**
   * IP address block from which to assign machine IP addresses, for example `10.0.0.0/16`.
   */
  machine_cidr?: string;
  /**
   * IP address block from which to assign pod IP addresses, for example `10.128.0.0/14`.
   */
  pod_cidr?: string;
  /**
   * IP address block from which to assign service IP addresses, for example `172.30.0.0/16`.
   */
  service_cidr?: string;
  /**
   * The main controller responsible for rendering the core networking components.
   */
  type?: string;
};
