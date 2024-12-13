/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ObjectReference } from './ObjectReference';
export type RelatedResource = ObjectReference & {
  availability_zone_type: string;
  billing_model: RelatedResource.billing_model;
  byoc: string;
  cloud_provider: string;
  cost: number;
  product: string;
  product_id?: string;
  resource_name?: string;
  resource_type: string;
};
export namespace RelatedResource {
  export enum billing_model {
    STANDARD = 'standard',
    MARKETPLACE = 'marketplace',
    ANY = 'any',
  }
}
