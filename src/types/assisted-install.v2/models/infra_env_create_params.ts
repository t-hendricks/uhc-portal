/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { host_static_network_config } from './host_static_network_config';
import type { image_type } from './image_type';
import type { proxy } from './proxy';

export type infra_env_create_params = {
  /**
   * A comma-separated list of NTP sources (name or IP) going to be added to all the hosts.
   */
  additional_ntp_sources?: string | null;
  /**
   * If set, all hosts that register will be associated with the specified cluster.
   */
  cluster_id?: string | null;
  /**
   * The CPU architecture of the image (x86_64/arm64/etc).
   */
  cpu_architecture?: string;
  /**
   * JSON formatted string containing the user overrides for the initial ignition config.
   */
  ignition_config_override?: string;
  image_type?: image_type;
  /**
   * Name of the infra-env.
   */
  name: string;
  /**
   * Version of the OpenShift cluster (used to infer the RHCOS version - temporary until generic logic implemented).
   */
  openshift_version?: string;
  proxy?: proxy;
  /**
   * The pull secret obtained from Red Hat OpenShift Cluster Manager at console.redhat.com/openshift/install/pull-secret.
   */
  pull_secret: string;
  /**
   * SSH public key for debugging the installation.
   */
  ssh_authorized_key?: string | null;
  static_network_config?: Array<host_static_network_config>;
};
