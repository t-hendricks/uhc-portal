/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WifAccessMethod } from './WifAccessMethod';
import type { WifCredentialRequest } from './WifCredentialRequest';
import type { WifRole } from './WifRole';
export type WifServiceAccount = {
  access_method?: WifAccessMethod;
  credential_request?: WifCredentialRequest;
  osd_role?: string;
  roles?: Array<WifRole>;
  service_account_id?: string;
};
