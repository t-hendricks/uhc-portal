/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * AWS subnetwork object to be used while installing a cluster
 */
export type Subnetwork = {
  /**
   * The availability zone to which the subnet is related
   */
  availability_zone?: string;
  /**
   * Name of the subnet according to its `Name` tag on AWS
   */
  name?: string;
  /**
   * The subnet id to be used while installing a cluster
   */
  subnet_id?: string;
};
