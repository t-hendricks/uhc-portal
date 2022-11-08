/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type ReservedResource = ObjectReference & {
  availability_zone_type?: string;
  billing_marketplace_account?: string;
  billing_model?: ReservedResource.billing_model;
  byoc: boolean;
  cluster?: boolean;
  count?: number;
  created_at?: string;
  resource_name?: string;
  resource_type?: ReservedResource.resource_type;
  subscription?: ObjectReference;
  updated_at?: string;
};

export namespace ReservedResource {
  export enum billing_model {
    STANDARD = 'standard',
    MARKETPLACE = 'marketplace',
    MARKETPLACE_AWS = 'marketplace-aws',
    MARKETPLACE_RHM = 'marketplace-rhm',
    MARKETPLACE_AZURE = 'marketplace-azure',
  }

  export enum resource_type {
    COMPUTE_NODE_AWS = 'compute.node.aws',
    PV_STORAGE_AWS = 'pv.storage.aws',
    CLUSTER_AWS = 'cluster.aws',
    NETWORK_IO_AWS = 'network.io.aws',
    NETWORK_LOADBALANCER_AWS = 'network.loadbalancer.aws',
    COMPUTE_NODE_GCP = 'compute.node.gcp',
    PV_STORAGE_GCP = 'pv.storage.gcp',
    CLUSTER_GCP = 'cluster.gcp',
    NETWORK_IO_GCP = 'network.io.gcp',
    NETWORK_GCP_LOADBALANCER_GCP = 'network-gcp.loadbalancer.gcp',
    ADDON = 'addon',
    COMPUTE_NODE = 'compute.node',
    PV_STORAGE = 'pv.storage',
    CLUSTER = 'cluster',
    NETWORK_IO = 'network.io',
    NETWORK_LOADBALANCER = 'network.loadbalancer',
  }
}
