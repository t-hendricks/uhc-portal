/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AWSVolume } from './AWSVolume';
import type { GCPVolume } from './GCPVolume';

/**
 * Root volume capabilities.
 */
export type RootVolume = {
  /**
   * AWS volume specification
   */
  aws?: AWSVolume;
  /**
   * GCP Volume specification
   */
  gcp?: GCPVolume;
};
