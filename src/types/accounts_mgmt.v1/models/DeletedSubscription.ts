/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SubscriptionCommonFields } from './SubscriptionCommonFields';

export type DeletedSubscription = SubscriptionCommonFields & {
  created_at?: string;
  id?: string;
  metrics?: string;
  query_timestamp?: string;
};
