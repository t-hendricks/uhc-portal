/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Definition of a subscription.
 */
export type Subscription = {
  /**
   * Indicates the type of this object. Will be 'Subscription' if this is a complete object or 'SubscriptionLink' if it is just a link.
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
};
