/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ConsumedQuota } from './ConsumedQuota';
import type { List } from './List';

export type ConsumedQuotaList = List & {
  items?: Array<ConsumedQuota>;
};
