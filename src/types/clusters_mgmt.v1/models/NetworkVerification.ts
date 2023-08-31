/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CloudProviderData } from './CloudProviderData';
import type { SubnetNetworkVerification } from './SubnetNetworkVerification';

export type NetworkVerification = {
  /**
   * Cloud provider data to execute the network verification.
   */
  cloud_provider_data?: CloudProviderData;
  /**
   * Details about each subnet network verification.
   */
  items?: Array<SubnetNetworkVerification>;
  /**
   * Amount of network verifier executions started.
   */
  total?: number;
};
