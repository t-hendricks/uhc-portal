/* generated using openapi-typescript-codegen -- do not edit */
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
    CLUSTER_SUBSCRIPTION = 'Cluster Subscription',
    CLUSTER_LIFECYCLE = 'Cluster Lifecycle',
    CLUSTER_UPDATES = 'Cluster Updates',
    CLUSTER_OWNERSHIP = 'Cluster Ownership',
    CLUSTER_ACCESS = 'Cluster Access',
    CLUSTER_SCALING = 'Cluster Scaling',
    CAPACITY_MANAGEMENT = 'Capacity Management',
    CLUSTER_CONFIGURATION = 'Cluster Configuration',
    CLUSTER_SECURITY = 'Cluster Security',
    CLUSTER_ADD_ONS = 'Cluster Add-ons',
    CUSTOMER_SUPPORT = 'Customer Support',
    CLUSTER_NETWORKING = 'Cluster Networking',
    GENERAL_NOTIFICATION = 'General Notification',
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
