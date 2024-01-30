/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CloudProviderData } from './CloudProviderData';
import type { Platform } from './Platform';
import type { SubnetNetworkVerification } from './SubnetNetworkVerification';

export type NetworkVerification = {
  /**
   * Cloud provider data to execute the network verification.
   */
  cloud_provider_data?: CloudProviderData;
  /**
   * Cluster ID needed to execute the network verification.
   */
  cluster_id?: string;
  /**
   * Details about each subnet network verification.
   */
  items?: Array<SubnetNetworkVerification>;
  /**
   * Platform needed to execute the network verification.
   */
  platform?: Platform;
  /**
   * Amount of network verifier executions started.
   */
  total?: number;
};
