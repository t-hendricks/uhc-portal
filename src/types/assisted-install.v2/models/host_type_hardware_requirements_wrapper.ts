/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { host_type_hardware_requirements } from './host_type_hardware_requirements';

export type host_type_hardware_requirements_wrapper = {
    /**
     * Requirements towards a master node
     */
    master?: host_type_hardware_requirements;
    /**
     * Requirements towards a worker node
     */
    worker?: host_type_hardware_requirements;
};

