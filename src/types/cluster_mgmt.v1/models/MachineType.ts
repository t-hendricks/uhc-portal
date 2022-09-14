/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CloudProvider } from './CloudProvider';
import type { MachineTypeCategory } from './MachineTypeCategory';
import type { MachineTypeSize } from './MachineTypeSize';
import type { Value } from './Value';

/**
 * Machine type.
 */
export type MachineType = {
    /**
     * Indicates the type of this object. Will be 'MachineType' if this is a complete object or 'MachineTypeLink' if it is just a link.
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
     * 'true' if the instance type is supported only for CCS clusters, 'false' otherwise.
     */
    ccs_only?: boolean;
    /**
     * The amount of cpu's of the machine type.
     */
    cpu?: Value;
    /**
     * The category which the machine type is suitable for.
     */
    category?: MachineTypeCategory;
    /**
     * Link to the cloud provider that the machine type belongs to.
     */
    cloud_provider?: CloudProvider;
    /**
     * Generic name for quota purposes, for example `highmem-4`.
     * Cloud provider agnostic - many values are shared between "similar"
     * machine types on different providers.
     * Corresponds to `resource_name` values in "compute.node"  quota cost data.
     */
    generic_name?: string;
    /**
     * The amount of memory of the machine type.
     */
    memory?: Value;
    /**
     * Human friendly identifier of the machine type, for example `r5.xlarge - Memory Optimized`.
     */
    name?: string;
    /**
     * The size of the machine type.
     */
    size?: MachineTypeSize;
};

