/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AWSNodePool } from './AWSNodePool';
import type { Cluster } from './Cluster';
import type { NodePoolAutoscaling } from './NodePoolAutoscaling';
import type { NodePoolStatus } from './NodePoolStatus';

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
   * ID used to identify the cluster that this nodepool is attached to.
   */
  cluster?: Cluster;
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
};
