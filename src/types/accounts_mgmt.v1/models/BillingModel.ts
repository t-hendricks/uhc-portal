/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ObjectReference } from './ObjectReference';
export type BillingModel = ObjectReference & {
  billing_model_type: BillingModel.billing_model_type;
  description: string;
  display_name: string;
  id: string;
  marketplace?: string;
};
export namespace BillingModel {
  export enum billing_model_type {
    STANDARD = 'standard',
    MARKETPLACE = 'marketplace',
    MARKETPLACE_AWS = 'marketplace-aws',
    MARKETPLACE_AZURE = 'marketplace-azure',
    MARKETPLACE_RHM = 'marketplace-rhm',
    MARKETPLACE_GCP = 'marketplace-gcp',
  }
}
