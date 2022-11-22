/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Holds settings for an AWS storage volume.
 */
export type AWSVolume = {
  /**
   * Volume provisioned IOPS.
   */
  iops?: number;
  /**
   * Volume size in Gib.
   */
  size?: number;
};
