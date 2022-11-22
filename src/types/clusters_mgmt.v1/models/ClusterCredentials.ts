/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AdminCredentials } from './AdminCredentials';
import type { SSHCredentials } from './SSHCredentials';

/**
 * Credentials of the a cluster.
 */
export type ClusterCredentials = {
  /**
   * Indicates the type of this object. Will be 'ClusterCredentials' if this is a complete object or 'ClusterCredentialsLink' if it is just a link.
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
   * SSH key pair of the cluster.
   */
  ssh?: SSHCredentials;
  /**
   * Temporary administrator credentials generated during the installation
   * of the cluster.
   */
  admin?: AdminCredentials;
  /**
   * Administrator _kubeconfig_ file for the cluster.
   */
  kubeconfig?: string;
};
