/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RolePolicy } from './RolePolicy';
import type { RolePolicyBindingStatus } from './RolePolicyBindingStatus';
export type RolePolicyBinding = {
  arn?: string;
  creation_timestamp?: string;
  last_update_timestamp?: string;
  name?: string;
  policies?: Array<RolePolicy>;
  status?: RolePolicyBindingStatus;
  type?: string;
};
