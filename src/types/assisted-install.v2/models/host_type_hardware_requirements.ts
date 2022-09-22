/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { cluster_host_requirements_details } from './cluster_host_requirements_details';

export type host_type_hardware_requirements = {
    /**
     * Host requirements that cannot be quantified at the time of calculation. Descriptions or formulas of requiements
     */
    qualitative?: Array<string>;
    /**
     * Host requirements that can be quantified
     */
    quantitative?: cluster_host_requirements_details;
};

