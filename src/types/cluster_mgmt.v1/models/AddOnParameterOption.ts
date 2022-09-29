/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddOnRequirement } from './AddOnRequirement';

/**
 * Representation of an add-on parameter option.
 */
export type AddOnParameterOption = {
  /**
   * Name of the add-on parameter option.
   */
  name?: string;
  /**
   * List of add-on requirements for this parameter option.
   */
  requirements?: Array<AddOnRequirement>;
  /**
   * Value of the add-on parameter option.
   */
  value?: string;
};
