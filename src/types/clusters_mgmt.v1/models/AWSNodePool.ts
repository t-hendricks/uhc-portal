/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
   * InstanceProfile is the AWS EC2 instance profile, which is a container for an IAM role that the EC2 instance uses.
   */
  instance_profile?: string;
  /**
   * InstanceType is an ec2 instance type for node instances (e.g. m5.large).
   */
  instance_type?: string;
  /**
   * Associates nodepool subnets with AWS Outposts.
   */
  subnet_outposts?: Record<string, string>;
  /**
   * Optional keys and values that the installer will add as tags to all AWS resources it creates.
   */
  tags?: Record<string, string>;
};
