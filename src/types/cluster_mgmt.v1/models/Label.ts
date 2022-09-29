/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a label in clusterdeployment.
 */
export type Label = {
  /**
   * Indicates the type of this object. Will be 'Label' if this is a complete object or 'LabelLink' if it is just a link.
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
   * the key of the label
   */
  key?: string;
  /**
   * the value to set in the label
   */
  value?: string;
};
