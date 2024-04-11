/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Description of an environment
 */
export type Environment = {
  /**
   * the backplane url for the environment
   */
  backplane_url?: string;
  /**
   * last time that the worker checked for limited support clusters
   */
  last_limited_support_check?: string;
  /**
   * last time that the worker checked for available upgrades
   */
  last_upgrade_available_check?: string;
  /**
   * environment name
   */
  name?: string;
};
