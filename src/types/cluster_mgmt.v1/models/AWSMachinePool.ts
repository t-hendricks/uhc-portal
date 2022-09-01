/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AWSSpotMarketOptions } from './AWSSpotMarketOptions';

/**
 * Representation of aws machine pool specific parameters.
 */
export type AWSMachinePool = {
    /**
     * Indicates the type of this object. Will be 'AWSMachinePool' if this is a complete object or 'AWSMachinePoolLink' if it is just a link.
     */
    kind?: string;
    /**
     * Unique identifier of the object.
     */
    id?: string;
    /**
     * Self link.
     */
    href?: string;
    /**
     * Use spot instances on this machine pool to reduce cost.
     */
    spot_market_options?: AWSSpotMarketOptions;
};

