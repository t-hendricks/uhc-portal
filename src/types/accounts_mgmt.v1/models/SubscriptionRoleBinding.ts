/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccountReference } from './AccountReference';
import type { ObjectReference } from './ObjectReference';

export type SubscriptionRoleBinding = ObjectReference & {
  account?: AccountReference;
  account_email?: string;
  account_username?: string;
  created_at?: string;
  role?: ObjectReference;
  subscription?: ObjectReference;
  updated_at?: string;
};
