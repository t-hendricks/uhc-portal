/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ObjectReference } from './ObjectReference';

export type ConsumedQuota = ObjectReference & {
  availability_zone_type?: string;
  billing_model?: ConsumedQuota.billing_model;
  byoc: boolean;
  cloud_provider_id?: string;
  count: number;
  organization_id?: string;
  plan_id?: string;
  resource_name?: string;
  resource_type?: string;
  version?: string;
};

export namespace ConsumedQuota {
  export enum billing_model {
    STANDARD = 'standard',
    MARKETPLACE = 'marketplace',
    MARKETPLACE_AWS = 'marketplace-aws',
    MARKETPLACE_RHM = 'marketplace-rhm',
    MARKETPLACE_AZURE = 'marketplace-azure',
  }
}
