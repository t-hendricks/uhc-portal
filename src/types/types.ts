import type React from 'react';
import type { Cluster as AICluster } from 'openshift-assisted-ui-lib/ocm';
import type { OneMetric, Subscription } from './accounts_mgmt.v1';
import type { Cluster, Subnetwork, VersionGateAgreement } from './cluster_mgmt.v1';

export type ViewOptions = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  filter: string | { description: string; timestampFrom: string; timestampTo: string };
  sorting: {
    sortField: string;
    isAscending: boolean;
    sortIndex?: number;
  };
  flags: {
    [flag: string]: any;
  };
};

export type FakeCluster = // AICluster &
  Pick<
    Cluster,
    | 'id'
    | 'cloud_provider'
    | 'region'
    | 'console'
    | 'creation_timestamp'
    | 'openshift_version'
    | 'managed'
    | 'ccs'
    | 'external_id'
    | 'name'
  > & {
    metrics: OneMetric;
    state?: /* ClusterState | AICluster['status'] | */ string;
    ['subscription_id']?: string;
    ['activity_timestamp']?: string;
    ['cpu_architecture']?: string;
    product?: Cluster['product'] & { type?: string };
  };

export type ClusterFromSubscription = FakeCluster & {
  subscription?: Subscription;
};

export type ClusterWithPermissions = ClusterFromSubscription & {
  canEdit?: boolean;
  canDelete?: boolean;
  partialCS?: boolean;
};

export type AugmentedCluster = ClusterWithPermissions & {
  canEditOCMRoles?: boolean;
  canViewOCMRoles?: boolean;
  upgradeGates?: VersionGateAgreement[];
  aiCluster?: AICluster;
};

export type AugmentedClusterResponse = {
  data: AugmentedCluster;
};

export type ErrorState = {
  pending: boolean;
  fulfilled: false;
  error: true;
  errorCode?: number;
  internalErrorCode?: string;
  errorMessage?: string | React.ReactNode;
  errorDetails?: string | null;
  operationID?: string;
};

export type AugmentedSubnetwork = Subnetwork & {
  ['vpc_id']: string;
  ['vpc_name']: string;
  public: boolean;
};

export type BySubnetID = { [id: string]: AugmentedSubnetwork };

export type SubnetFormProps = {
  vpcs: {
    fulfilled: boolean;
    data: {
      bySubnetID: BySubnetID;
    };
    region?: string;
  };
  vpcsValid: boolean;
};
