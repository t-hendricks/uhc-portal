/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { SubscriptionMetric } from './SubscriptionMetric';

export type SubscriptionMetricList = List & {
  items?: Array<SubscriptionMetric>;
};
