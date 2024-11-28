/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AWSSpotMarketOptions } from './AWSSpotMarketOptions';
/**
 * Representation of aws machine pool specific parameters.
 */
export type AWSMachinePool = {
  /**
   * Indicates the type of this object. Will be 'AWSMachinePool' if this is a complete object or 'AWSMachinePoolLink' if it is just a link.
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
   * Additional AWS Security Groups to be added machine pool. Note that machine pools can only be worker node at the time.
   */
  additional_security_group_ids?: Array<string>;
  /**
   * Associates nodepool availability zones with zone types (e.g. wavelength, local).
   */
  availability_zone_types?: Record<string, string>;
  /**
   * Use spot instances on this machine pool to reduce cost.
   */
  spot_market_options?: AWSSpotMarketOptions;
  /**
   * Associates nodepool subnets with AWS Outposts.
   */
  subnet_outposts?: Record<string, string>;
  /**
   * Optional keys and values that the machine pool provisioner will add as AWS tags to all AWS resources it creates.
   *
   * AWS tags must conform to the following standards:
   * - Each resource may have a maximum of 25 tags
   * - Tags beginning with "aws:" are reserved for system use and may not be set
   * - Tag keys may be between 1 and 128 characters in length
   * - Tag values may be between 0 and 256 characters in length
   * - Tags may only contain letters, numbers, spaces, and the following characters: [_ . : / = + - @]
   */
  tags?: Record<string, string>;
};
