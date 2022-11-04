/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AWSVolume } from './AWSVolume';

/**
 * Specification for different classes of nodes inside a flavour.
 */
export type AWSFlavour = {
  /**
   * AWS default instance type for the worker volume.
   *
   * User can be overridden specifying in the cluster itself a type for compute node.
   */
  compute_instance_type?: string;
  /**
   * AWS default instance type for the infra volume.
   */
  infra_instance_type?: string;
  /**
   * Infra volume specification.
   */
  infra_volume?: AWSVolume;
  /**
   * AWS default instance type for the master volume.
   */
  master_instance_type?: string;
  /**
   * Master volume specification.
   */
  master_volume?: AWSVolume;
  /**
   * Worker volume specification.
   */
  worker_volume?: AWSVolume;
};
