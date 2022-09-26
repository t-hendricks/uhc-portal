/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddOn } from './AddOn';
import type { AddOnParameterOption } from './AddOnParameterOption';

/**
 * Representation of an add-on parameter.
 */
export type AddOnParameter = {
  /**
   * Indicates the type of this object. Will be 'AddOnParameter' if this is a complete object or 'AddOnParameterLink' if it is just a link.
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
   * Link to add-on.
   */
  addon?: AddOn;
  /**
   * Indicates the value default for the add-on parameter.
   */
  default_value?: string;
  /**
   * Description of the add-on parameter.
   */
  description?: string;
  /**
   * Indicates if this parameter can be edited after creation.
   */
  editable?: boolean;
  /**
   * Indicates if this parameter is enabled for the add-on.
   */
  enabled?: boolean;
  /**
   * Name of the add-on parameter.
   */
  name?: string;
  /**
   * List of options for the add-on parameter value.
   */
  options?: Array<AddOnParameterOption>;
  /**
   * Indicates if this parameter is required by the add-on.
   */
  required?: boolean;
  /**
   * Validation rule for the add-on parameter.
   */
  validation?: string;
  /**
   * Error message to return should the parameter be invalid.
   */
  validation_err_msg?: string;
  /**
   * Type of value of the add-on parameter.
   */
  value_type?: string;
};
