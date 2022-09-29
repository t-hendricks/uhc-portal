/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { cluster_host_requirements_details } from './cluster_host_requirements_details';

export type operator_host_requirements = {
  /**
   * Name of the operator
   */
  operator_name?: string;
  /**
   * Host requirements for the operator
   */
  requirements?: cluster_host_requirements_details;
};
