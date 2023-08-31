/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddOn } from './AddOn';
import type { AddOnInstallationBilling } from './AddOnInstallationBilling';
import type { AddOnInstallationParameter } from './AddOnInstallationParameter';
import type { AddOnInstallationState } from './AddOnInstallationState';
import type { AddOnVersion } from './AddOnVersion';

/**
 * Representation of an add-on installation in a cluster.
 */
export type AddOnInstallation = {
  /**
   * Indicates the type of this object. Will be 'AddOnInstallation' if this is a complete object or 'AddOnInstallationLink' if it is just a link.
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
   * Link to add-on attached to this cluster.
   */
  addon?: AddOn;
  /**
   * Link to the installed version of this add-on.
   */
  addon_version?: AddOnVersion;
  /**
   * Billing details for add-on installation resource
   */
  billing?: AddOnInstallationBilling;
  /**
   * Date and time when the add-on was initially installed in the cluster.
   */
  creation_timestamp?: string;
  /**
   * Version of the operator installed by the add-on.
   */
  operator_version?: string;
  /**
   * List of add-on parameters for this add-on installation.
   */
  parameters?: Array<AddOnInstallationParameter>;
  /**
   * Overall state of the add-on installation.
   */
  state?: AddOnInstallationState;
  /**
   * Reason for the current State.
   */
  state_description?: string;
  /**
   * Date and time when the add-on installation information was last updated.
   */
  updated_timestamp?: string;
};
