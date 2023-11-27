/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * AWS subnetwork object to be used while installing a cluster
 */
export type Subnetwork = {
  /**
   * The CIDR Block of the subnet.
   */
  cidr_block?: string;
  /**
   * The availability zone to which the subnet is related.
   */
  availability_zone?: string;
  /**
   * Name of the subnet according to its `Name` tag on AWS.
   */
  name?: string;
  /**
   * Whether or not it is a public subnet.
   */
  public?: boolean;
  /**
   * If the resource is RH managed.
   */
  red_hat_managed?: boolean;
  /**
   * The subnet ID to be used while installing a cluster.
   */
  subnet_id?: string;
};
