/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of an add-on requirement status.
 */
export type AddOnRequirementStatus = {
  /**
   * Error messages detailing reasons for unfulfilled requirements.
   */
  error_msgs?: Array<string>;
  /**
   * Indicates if this requirement is fulfilled.
   */
  fulfilled?: boolean;
};
