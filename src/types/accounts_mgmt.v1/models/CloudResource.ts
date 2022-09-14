/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type CloudResource = (ObjectReference & {
    active?: boolean;
    category?: string;
    category_pretty?: string;
    cloud_provider?: string;
    cpu_cores?: number;
    created_at?: string;
    generic_name?: string;
    memory?: number;
    memory_pretty?: string;
    name_pretty?: string;
    resource_type?: CloudResource.resource_type;
    size_pretty?: string;
    updated_at?: string;
});

export namespace CloudResource {

    export enum resource_type {
        ADDON = 'addon',
        COMPUTE_NODE = 'compute.node',
        CLUSTER = 'cluster',
        NETWORK_IO = 'network.io',
        NETWORK_LOADBALANCER = 'network.loadbalancer',
        PV_STORAGE = 'pv.storage',
    }


}

