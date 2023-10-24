/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type Label = ObjectReference & {
  account_id?: string;
  created_at?: string;
  internal: boolean;
  key: string;
  managed_by?: Label.managed_by;
  organization_id?: string;
  subscription_id?: string;
  type?: string;
  updated_at?: string;
  value: string;
};

export namespace Label {
  export enum managed_by {
    CONFIG = 'Config',
    USER = 'User',
  }
}
