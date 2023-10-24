/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type AccountGroupAssignment = ObjectReference & {
  account_group_id: string;
  account_id: string;
  created_at?: string;
  managed_by: AccountGroupAssignment.managed_by;
  updated_at?: string;
};

export namespace AccountGroupAssignment {
  export enum managed_by {
    OCM = 'OCM',
    RBAC = 'RBAC',
  }
}
