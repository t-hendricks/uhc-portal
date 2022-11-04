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
  /**
   * Volume Type
   *
   * Possible values are: 'io1', 'gp2', 'st1', 'sc1', 'standard'
   */
  type?: string;
};
