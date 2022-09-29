/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type Registry = ObjectReference & {
  cloudAlias?: boolean;
  created_at?: string;
  name?: string;
  org_name?: string;
  team_name?: string;
  type?: string;
  updated_at?: string;
  url?: string;
};
