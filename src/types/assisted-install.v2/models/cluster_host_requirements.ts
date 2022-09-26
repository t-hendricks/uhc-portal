/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { cluster_host_requirements_details } from './cluster_host_requirements_details';
import type { operator_host_requirements } from './operator_host_requirements';

export type cluster_host_requirements = {
  /**
   * Unique identifier of the host the requirements relate to.
   */
  host_id?: string;
  /**
   * Host requirements for the OCP installation
   */
  ocp?: cluster_host_requirements_details;
  /**
   * Host requirements related to requested operators
   */
  operators?: Array<operator_host_requirements>;
  /**
   * Total host requirements for the cluster configuration
   */
  total?: cluster_host_requirements_details;
};
