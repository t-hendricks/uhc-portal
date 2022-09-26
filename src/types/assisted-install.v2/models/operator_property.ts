/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type operator_property = {
  /**
   * Type of the property
   */
  data_type?: operator_property.data_type;
  /**
   * Default value for the property
   */
  default_value?: string;
  /**
   * Description of a property
   */
  description?: string;
  /**
   * Indicates whether the property is reqired
   */
  mandatory?: boolean;
  /**
   * Name of the property
   */
  name?: string;
  /**
   * Values to select from
   */
  options?: Array<string>;
};

export namespace operator_property {
  /**
   * Type of the property
   */
  export enum data_type {
    BOOLEAN = 'boolean',
    STRING = 'string',
    INTEGER = 'integer',
    FLOAT = 'float',
  }
}
