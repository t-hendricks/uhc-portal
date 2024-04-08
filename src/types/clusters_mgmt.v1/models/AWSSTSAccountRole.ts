/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AWSSTSRole } from './AWSSTSRole';
/**
 * Representation of an sts account role for a rosa cluster
 */
export type AWSSTSAccountRole = {
  /**
   * The list of STS Roles for this Account Role
   */
  items?: Array<AWSSTSRole>;
  /**
   * The Prefix for this Account Role
   */
  prefix?: string;
};
