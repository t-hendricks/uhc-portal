/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AWSNodePool } from './AWSNodePool';
import type { AzureNodePool } from './AzureNodePool';
import type { NodePoolAutoscaling } from './NodePoolAutoscaling';
import type { NodePoolManagementUpgrade } from './NodePoolManagementUpgrade';
import type { NodePoolStatus } from './NodePoolStatus';
import type { Taint } from './Taint';
import type { Value } from './Value';
import type { Version } from './Version';
/**
 * Representation of a node pool in a cluster.
 */
export type NodePool = {
  /**
   * Indicates the type of this object. Will be 'NodePool' if this is a complete object or 'NodePoolLink' if it is just a link.
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
   * AWS specific parameters (Optional).
   */
  aws_node_pool?: AWSNodePool;
  /**
   * Specifies whether health checks should be enabled for machines in the NodePool.
   */
  auto_repair?: boolean;
  /**
   * Details for auto-scaling the machine pool.
   * Replicas and autoscaling cannot be used together.
   */
  autoscaling?: NodePoolAutoscaling;
  /**
   * The availability zone upon which the node is created.
   */
  availability_zone?: string;
  /**
   * Azure specific parameters.
   */
  azure_node_pool?: AzureNodePool;
  /**
   * The names of the KubeletConfigs for this node pool.
   */
  kubelet_configs?: Array<string>;
  /**
   * The labels set on the Nodes created.
   */
  labels?: Record<string, string>;
  /**
   * Management parameters (Optional).
   */
  management_upgrade?: NodePoolManagementUpgrade;
  /**
   * Time to wait for a NodePool to drain when it is upgraded or replaced before it is forcibly removed.
   */
  node_drain_grace_period?: Value;
  /**
   * The number of Machines (and Nodes) to create.
   * Replicas and autoscaling cannot be used together.
   */
  replicas?: number;
  /**
   * NodePool status.
   */
  status?: NodePoolStatus;
  /**
   * The subnet upon which the nodes are created.
   */
  subnet?: string;
  /**
   * The taints set on the Nodes created.
   */
  taints?: Array<Taint>;
  /**
   * The names of the tuning configs for this node pool.
   */
  tuning_configs?: Array<string>;
  /**
   * Version of the node pool.
   */
  version?: Version;
};
