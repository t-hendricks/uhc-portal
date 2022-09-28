/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AWSMachinePool } from './AWSMachinePool';
import type { Cluster } from './Cluster';
import type { MachinePoolAutoscaling } from './MachinePoolAutoscaling';
import type { MachinePoolSecurityGroupFilter } from './MachinePoolSecurityGroupFilter';
import type { Taint } from './Taint';

/**
 * Representation of a machine pool in a cluster.
 */
export type MachinePool = {
  /**
   * Indicates the type of this object. Will be 'MachinePool' if this is a complete object or 'MachinePoolLink' if it is just a link.
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
  aws?: AWSMachinePool;
  /**
   * Details for auto-scaling the machine pool.
   * Replicas and autoscaling cannot be used together.
   */
  autoscaling?: MachinePoolAutoscaling;
  /**
   * The availability zones upon which the nodes are created.
   */
  availability_zones?: Array<string>;
  /**
   * ID used to identify the cluster that this machinepool is attached to.
   */
  cluster?: Cluster;
  /**
   * The instance type of Nodes to create.
   */
  instance_type?: string;
  /**
   * The labels set on the Nodes created.
   */
  labels?: Record<string, string>;
  /**
   * The number of Machines (and Nodes) to create.
   * Replicas and autoscaling cannot be used together.
   */
  replicas?: number;
  /**
   * List of security groups to be applied to MachinePool (Optional)
   */
  security_group_filters?: Array<MachinePoolSecurityGroupFilter>;
  /**
   * The taints set on the Nodes created.
   */
  taints?: Array<Taint>;
};
