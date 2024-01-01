/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ObjectReference } from './ObjectReference';

export type RelatedResource = ObjectReference & {
  availability_zone_type: string;
  billing_model: RelatedResource.billing_model | string; // TODO: OCM-4620
  byoc: string;
  cloud_provider: string;
  cost: number;
  product: string;
  product_id?: string;
  resource_name?: string;
  resource_type: string;
};

// Edited because openapi was wrong TODO OCM-4620
export namespace RelatedResource {
  export enum billing_model {
    STANDARD = 'standard',
    MARKETPLACE = 'marketplace',
    MARKETPLACE_RHM = 'marketplace-rhm',
    MARKETPLACE_AZURE = 'marketplace-azure',
    MARKETPLACE_GCP = 'marketplace-gcp',
    ANY = 'any',
  }
}
