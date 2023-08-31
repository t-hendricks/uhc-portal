/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MachinePoolAutoscaling } from './MachinePoolAutoscaling';
import type { MachinePoolSecurityGroupFilter } from './MachinePoolSecurityGroupFilter';
import type { MachineType } from './MachineType';
import type { RootVolume } from './RootVolume';

/**
 * Counts of different classes of nodes inside a cluster.
 */
export type ClusterNodes = {
  /**
   * Details for auto-scaling the compute machine pool.
   * Compute and AutoscaleCompute cannot be used together.
   */
  autoscale_compute?: MachinePoolAutoscaling;
  /**
   * The availability zones upon which the nodes are created.
   */
  availability_zones?: Array<string>;
  /**
   * Number of compute nodes of the cluster.
   * Compute and AutoscaleCompute cannot be used together.
   */
  compute?: number;
  /**
   * The labels set on the "default" compute machine pool.
   */
  compute_labels?: Record<string, string>;
  /**
   * The compute machine type to use, for example `r5.xlarge`.
   */
  compute_machine_type?: MachineType;
  /**
   * The compute machine root volume capabilities.
   */
  compute_root_volume?: RootVolume;
  /**
   * Number of infrastructure nodes of the cluster.
   */
  infra?: number;
  /**
   * The infra machine type to use, for example `r5.xlarge` (Optional).
   */
  infra_machine_type?: MachineType;
  /**
   * Number of master nodes of the cluster.
   */
  master?: number;
  /**
   * The master machine type to use, for example `r5.xlarge` (Optional).
   */
  master_machine_type?: MachineType;
  /**
   * List of security groups to be applied to nodes (Optional).
   */
  security_group_filters?: Array<MachinePoolSecurityGroupFilter>;
  /**
   * Total number of nodes of the cluster.
   */
  total?: number;
};
