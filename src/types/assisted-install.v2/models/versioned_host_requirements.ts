/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { cluster_host_requirements_details } from './cluster_host_requirements_details';

export type versioned_host_requirements = {
    /**
     * Master node requirements
     */
    master?: cluster_host_requirements_details;
    /**
     * Single node OpenShift node requirements
     */
    sno?: cluster_host_requirements_details;
    /**
     * Version of the component for which requirements are defined
     */
    version?: string;
    /**
     * Worker node requirements
     */
    worker?: cluster_host_requirements_details;
};

