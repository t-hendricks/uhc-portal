/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Capability } from './Capability';
import type { Label } from './Label';
import type { ObjectReference } from './ObjectReference';

export type Organization = ObjectReference & {
  capabilities?: Array<Capability>;
  created_at?: string;
  ebs_account_id?: string;
  external_id?: string;
  labels?: Array<Label>;
  name?: string;
  updated_at?: string;
};
