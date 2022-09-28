/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UpgradePolicyStateValue } from './UpgradePolicyStateValue';

/**
 * Representation of an upgrade policy state that that is set for a cluster.
 */
export type UpgradePolicyState = {
  /**
   * Indicates the type of this object. Will be 'UpgradePolicyState' if this is a complete object or 'UpgradePolicyStateLink' if it is just a link.
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
   * Description of the state.
   */
  description?: string;
  /**
   * State value can be 'pending', 'scheduled', 'cancelled', 'started', 'delayed',
   * 'failed' or 'completed'.
   */
  value?: UpgradePolicyStateValue;
};
