/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { image_type } from './image_type';

export type image_info = {
  created_at?: string;
  download_url?: string;
  expires_at?: string;
  /**
   * Image generator version.
   */
  generator_version?: string;
  size_bytes?: number;
  /**
   * SSH public key for debugging the installation.
   */
  ssh_public_key?: string;
  /**
   * static network configuration string in the format expected by discovery ignition generation
   */
  static_network_config?: string;
  type?: image_type;
};
