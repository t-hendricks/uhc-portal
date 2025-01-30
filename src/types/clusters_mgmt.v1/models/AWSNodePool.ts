/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AWSVolume } from './AWSVolume';
import type { Ec2MetadataHttpTokens } from './Ec2MetadataHttpTokens';
/**
 * Representation of aws node pool specific parameters.
 */
export type AWSNodePool = {
  /**
   * Indicates the type of this object. Will be 'AWSNodePool' if this is a complete object or 'AWSNodePoolLink' if it is just a link.
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
   * Additional AWS Security Groups to be added node pool.
   */
  additional_security_group_ids?: Array<string>;
  /**
   * Associates nodepool availability zones with zone types (e.g. wavelength, local).
   */
  availability_zone_types?: Record<string, string>;
  /**
   * Which Ec2MetadataHttpTokens to use for metadata service interaction options for EC2 instances
   */
  ec2_metadata_http_tokens?: Ec2MetadataHttpTokens;
  /**
   * InstanceProfile is the AWS EC2 instance profile, which is a container for an IAM role that the EC2 instance uses.
   */
  instance_profile?: string;
  /**
   * InstanceType is an ec2 instance type for node instances (e.g. m5.large).
   */
  instance_type?: string;
  /**
   * AWS Volume specification to be used to set custom worker disk size
   */
  root_volume?: AWSVolume;
  /**
   * Associates nodepool subnets with AWS Outposts.
   */
  subnet_outposts?: Record<string, string>;
  /**
   * Optional keys and values that the installer will add as tags to all AWS resources it creates.
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
