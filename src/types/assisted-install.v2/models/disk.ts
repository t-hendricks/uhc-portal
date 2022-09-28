/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { io_perf } from './io_perf';

export type disk = {
  bootable?: boolean;
  /**
   * by-id is the World Wide Number of the device which guaranteed to be unique for every storage device
   */
  by_id?: string;
  /**
   * by-path is the shortest physical path to the device
   */
  by_path?: string;
  drive_type?: string;
  has_uuid?: boolean;
  hctl?: string;
  /**
   * Determine the disk's unique identifier which is the by-id field if it exists and fallback to the by-path field otherwise
   */
  id?: string;
  installation_eligibility?: {
    /**
     * Whether the disk is eligible for installation or not.
     */
    eligible?: boolean;
    /**
     * Reasons for why this disk is not eligible for installation.
     */
    not_eligible_reasons?: Array<string>;
  };
  io_perf?: io_perf;
  /**
   * Whether the disk appears to be an installation media or not
   */
  is_installation_media?: boolean;
  model?: string;
  name?: string;
  path?: string;
  removable?: boolean;
  serial?: string;
  size_bytes?: number;
  smart?: string;
  vendor?: string;
  wwn?: string;
};
