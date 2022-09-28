/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { SubscriptionRoleBinding } from './SubscriptionRoleBinding';

export type SubscriptionRoleBindingList = List & {
  items?: Array<SubscriptionRoleBinding>;
};
