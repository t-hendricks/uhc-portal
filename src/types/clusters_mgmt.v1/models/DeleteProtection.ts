/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * DeleteProtection configuration.
 */
export type DeleteProtection = {
  /**
   * Boolean flag indicating if the cluster should be be using _DeleteProtection_.
   *
   * By default this is `false`.
   *
   * To enable it a SREP needs to patch the value through OCM API
   */
  enabled?: boolean;
};
