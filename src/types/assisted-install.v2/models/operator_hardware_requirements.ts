/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { host_type_hardware_requirements_wrapper } from './host_type_hardware_requirements_wrapper';

export type operator_hardware_requirements = {
  /**
   * List of other operator unique names that are required to be installed. Corresponds to name property of the monitored-operator, i.e. "lso", "cnv", etc.
   */
  dependencies?: Array<string>;
  /**
   * Unique name of the operator. Corresponds to name property of the monitored-operator, i.e. "lso", "cnv", etc.
   */
  operator_name?: string;
  requirements?: host_type_hardware_requirements_wrapper;
};
