/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { host_static_network_config } from './host_static_network_config';
import type { image_type } from './image_type';

export type image_create_params = {
  /**
   * Type of image that should be generated.
   */
  image_type?: image_type;
  /**
   * SSH public key for debugging the installation.
   */
  ssh_public_key?: string;
  static_network_config?: Array<host_static_network_config>;
};
