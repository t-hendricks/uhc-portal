/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type Label = ObjectReference & {
  account_id?: string;
  created_at?: string;
  internal: boolean;
  key: string;
  organization_id?: string;
  subscription_id?: string;
  type?: string;
  updated_at?: string;
  value: string;
};
