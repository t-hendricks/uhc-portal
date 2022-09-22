/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { host_type_hardware_requirements_wrapper } from './host_type_hardware_requirements_wrapper';
import type { operator_hardware_requirements } from './operator_hardware_requirements';

export type preflight_hardware_requirements = {
    /**
     * Preflight OCP requirements
     */
    ocp?: host_type_hardware_requirements_wrapper;
    /**
     * Preflight operators hardware requirements
     */
    operators?: Array<operator_hardware_requirements>;
};

