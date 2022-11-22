/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type ExcessResource = ObjectReference & {
  availability_zone_type?: string;
  billing_model?: ExcessResource.billing_model;
  byoc: boolean;
  count?: number;
  resource_name?: string;
  resource_type?: string;
};

export namespace ExcessResource {
  export enum billing_model {
    STANDARD = 'standard',
    MARKETPLACE = 'marketplace',
    MARKETPLACE_AWS = 'marketplace-aws',
    MARKETPLACE_RHM = 'marketplace-rhm',
    MARKETPLACE_AZURE = 'marketplace-azure',
  }
}
