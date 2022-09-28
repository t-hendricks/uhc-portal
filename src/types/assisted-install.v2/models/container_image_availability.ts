/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { container_image_availability_result } from './container_image_availability_result';

export type container_image_availability = {
  /**
   * The rate of size/time in seconds MBps.
   */
  download_rate?: number;
  /**
   * A fully qualified image name (FQIN).
   */
  name?: string;
  result?: container_image_availability_result;
  /**
   * Size of the image in bytes.
   */
  size_bytes?: number;
  /**
   * Seconds it took to pull the image.
   */
  time?: number;
};
