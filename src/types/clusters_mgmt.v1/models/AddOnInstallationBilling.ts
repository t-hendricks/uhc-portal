/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BillingModel } from './BillingModel';

/**
 * Representation of an add-on installation billing.
 */
export type AddOnInstallationBilling = {
  /**
   * Indicates the type of this object. Will be 'AddOnInstallationBilling' if this is a complete object or 'AddOnInstallationBillingLink' if it is just a link.
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
   * Account ID for billing market place
   */
  billing_marketplace_account?: string;
  /**
   * Billing Model for addon resources
   */
  billing_model?: BillingModel;
};
