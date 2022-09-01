/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Subnetwork } from './Subnetwork';

/**
 * Description of a cloud provider virtual private cloud.
 */
export type CloudVPC = {
    /**
     * List of subnetworks
     */
    aws_subnets?: Array<Subnetwork>;
    /**
     * ID of virtual private cloud
     */
    id?: string;
    /**
     * Name of virtual private cloud according to its `Name` tag on AWS
     */
    name?: string;
    /**
     * List of subnets used by the virtual private cloud.
     */
    subnets?: Array<string>;
};

