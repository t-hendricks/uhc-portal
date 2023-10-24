/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type ClusterLog = ObjectReference & {
  cluster_id?: string;
  cluster_uuid?: string;
  created_at?: string;
  created_by?: string;
  description?: string;
  doc_references?: Array<string>;
  email?: string;
  event_stream_id?: string;
  first_name?: string;
  internal_only?: boolean;
  last_name?: string;
  log_type?: ClusterLog.log_type;
  service_name?: string;
  severity: ClusterLog.severity;
  subscription_id?: string;
  summary?: string;
  timestamp?: string;
  username?: string;
};

export namespace ClusterLog {
  export enum log_type {
    CLUSTERCREATE_HIGH_LEVEL = 'clustercreate-high-level',
    CLUSTERCREATE_DETAILS = 'clustercreate-details',
    CLUSTERREMOVE_HIGH_LEVEL = 'clusterremove-high-level',
    CLUSTERREMOVE_DETAILS = 'clusterremove-details',
    CLUSTER_STATE_UPDATES = 'cluster-state-updates',
    CUSTOMER_DATA = 'Customer data',
    CUSTOMER_APPLICATIONS = 'Customer applications',
    DEVELOPER_SERVICES = 'Developer services',
    PLATFORM_MONITORING = 'Platform monitoring',
    LOGGING = 'Logging',
    APPLICATION_NETWORKING = 'Application networking',
    CLUSTER_NETWORKING = 'Cluster networking',
    VIRTUAL_NETWORKING_MANAGEMENT = 'Virtual networking management',
    VIRTUAL_COMPUTE_MANAGEMENT = 'Virtual compute management',
    CLUSTER_VERSION = 'Cluster version',
    CAPACITY_MANAGEMENT = 'Capacity management',
    VIRTUAL_STORAGE_MANAGEMENT = 'Virtual storage management',
    AWS_SOFTWARE = 'AWS software',
    HARDWARE_AWS_GLOBAL_INFRASTRUCTURE = 'Hardware/AWS global infrastructure',
  }

  export enum severity {
    DEBUG = 'Debug',
    INFO = 'Info',
    WARNING = 'Warning',
    ERROR = 'Error',
    FATAL = 'Fatal',
    MAJOR = 'Major',
    CRITICAL = 'Critical',
  }
}
