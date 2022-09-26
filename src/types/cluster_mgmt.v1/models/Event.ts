/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Representation of a trackable event.
 */
export type Event = {
  /**
   * Body of the event to track the details of the tracking event as Key value pair
   */
  body?: Record<string, string>;
  /**
   * Key of the event to be tracked. This key should start with an
   * uppercase letter followed by alphanumeric characters or
   * underscores. The entire key needs to be smaller than 64 characters.
   */
  key?: string;
};
