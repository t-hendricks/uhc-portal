import type React from 'react';
import type { FeaturesSupportsLevel } from '@openshift-assisted/ui-lib/ocm';
import type { Cluster as AICluster } from '@openshift-assisted/types/assisted-installer-service';
import type { List, OneMetric, Subscription } from './accounts_mgmt.v1';
import type {
  AWS,
  Cluster,
  ClusterState,
  ClusterStatus,
  LimitedSupportReason,
  Subnetwork,
  VersionGateAgreement,
} from './clusters_mgmt.v1';

export type ViewOptions = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  filter:
    | string
    | { description?: string; loggedBy?: string; timestampFrom?: string; timestampTo?: string };
  sorting: {
    sortField: string;
    isAscending: boolean;
    sortIndex?: number;
  };
  flags: {
    [flag: string]: any;
  };
};

// picking specific Cluster properties to satisfy requirements for
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
    | 'inflight_checks'
    | 'name'
    | 'version'
  > & {
    metrics: OneMetric;
    state?: string | ClusterState;
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
export type SubscriptionWithPermissions = Subscription & {
  canEdit?: boolean;
};

export type SubscriptionWithPermissionsList = List & {
  items?: Array<SubscriptionWithPermissions>;
};

export type AugmentedCluster = ClusterWithPermissions & {
  canEditOCMRoles?: boolean;
  canViewOCMRoles?: boolean;
  canEditClusterAutoscaler?: boolean;
  idpActions?: {
    [action: string]: boolean;
  };
  machinePoolsActions?: {
    [action: string]: boolean;
  };
  upgradeGates?: VersionGateAgreement[];
  aiCluster?: AICluster;
  limitedSupportReasons?: LimitedSupportReason[];
  aiSupportLevels?: FeaturesSupportsLevel;
  status?: ClusterStatus;
};

export type AugmentedClusterResponse = {
  data: AugmentedCluster;
};

export type ErrorDetail = { kind: string; items?: any };

export type ErrorState = {
  pending: boolean;
  fulfilled: false;
  error: true;
  errorCode?: number;
  internalErrorCode?: string;
  errorMessage?: string | React.ReactElement;
  errorDetails?: ErrorDetail[];
  operationID?: string;
};

export type AWSCredentials = Pick<
  AWS,
  'account_id' | 'access_key_id' | 'secret_access_key' | 'sts'
>;

/** A subnet augmented with info from its parent CloudVPC. */
export type AugmentedSubnetwork = Subnetwork & {
  ['vpc_id']: string;
  ['vpc_name']?: string; // presence depends on AWS "Name" tag, not guaranteed.
};

export type ViewSorting = {
  isAscending: boolean;
  sortField: string;
  sortIndex: number;
};

export type ViewFlags = undefined | null | boolean | string[] | { [key: string]: string[] };

export type UserInfo = {
  username: string;
};
