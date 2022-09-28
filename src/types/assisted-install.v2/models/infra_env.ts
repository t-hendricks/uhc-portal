/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { image_type } from './image_type';
import type { proxy } from './proxy';

export type infra_env = {
  /**
   * A comma-separated list of NTP sources (name or IP) going to be added to all the hosts.
   */
  additional_ntp_sources?: string;
  /**
   * If set, all hosts that register will be associated with the specified cluster.
   */
  cluster_id?: string;
  /**
   * The CPU architecture of the image (x86_64/arm64/etc).
   */
  cpu_architecture?: string;
  created_at: string;
  download_url?: string;
  email_domain?: string;
  expires_at?: string;
  /**
   * Image generator version.
   */
  generator_version?: string;
  /**
   * Self link.
   */
  href: string;
  /**
   * Unique identifier of the object.
   */
  id: string;
  /**
   * Json formatted string containing the user overrides for the initial ignition config.
   */
  ignition_config_override?: string;
  /**
   * Indicates the type of this object.
   */
  kind: infra_env.kind;
  /**
   * Name of the infra-env.
   */
  name: string;
  /**
   * Version of the OpenShift cluster (used to infer the RHCOS version - temporary until generic logic implemented).
   */
  openshift_version?: string;
  org_id?: string;
  proxy?: proxy;
  /**
   * True if the pull secret has been added to the cluster.
   */
  pull_secret_set?: boolean;
  size_bytes?: number;
  /**
   * SSH public key for debugging the installation.
   */
  ssh_authorized_key?: string;
  /**
   * static network configuration string in the format expected by discovery ignition generation.
   */
  static_network_config?: string;
  type: image_type;
  /**
   * The last time that this infra-env was updated.
   */
  updated_at: string;
  user_name?: string;
};

export namespace infra_env {
  /**
   * Indicates the type of this object.
   */
  export enum kind {
    INFRA_ENV = 'InfraEnv',
  }
}
