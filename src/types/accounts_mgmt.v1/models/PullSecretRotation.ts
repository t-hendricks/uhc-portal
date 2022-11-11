/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type PullSecretRotation = ObjectReference & {
  account_id?: string;
  created_at?: string;
  status?: string;
  updated_at?: string;
};
