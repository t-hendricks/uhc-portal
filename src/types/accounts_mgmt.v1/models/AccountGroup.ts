/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ObjectReference } from './ObjectReference';
export type AccountGroup = ObjectReference & {
  created_at?: string;
  description: string;
  external_id?: string;
  managed_by: AccountGroup.managed_by;
  name: string;
  organization_id: string;
  updated_at?: string;
};
export namespace AccountGroup {
  export enum managed_by {
    SSO = 'SSO',
    OCM = 'OCM',
    RBAC = 'RBAC',
  }
}
