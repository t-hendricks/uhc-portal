/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SecurityGroup } from './SecurityGroup';
import type { Subnetwork } from './Subnetwork';
/**
 * Description of a cloud provider virtual private cloud.
 */
export type CloudVPC = {
  /**
   * List of AWS security groups with details.
   */
  aws_security_groups?: Array<SecurityGroup>;
  /**
   * List of AWS subnetworks with details.
   */
  aws_subnets?: Array<Subnetwork>;
  /**
   * CIDR block of the virtual private cloud.
   */
  cidr_block?: string;
  /**
   * ID of virtual private cloud.
   */
  id?: string;
  /**
   * Name of virtual private cloud according to its `Name` tag on AWS.
   */
  name?: string;
  /**
   * If the resource is RH managed.
   */
  red_hat_managed?: boolean;
  /**
   * List of subnets used by the virtual private cloud.
   */
  subnets?: Array<string>;
};
