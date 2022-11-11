/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ReservedResourcePatchRequest = {
  billing_model?: ReservedResourcePatchRequest.billing_model;
};

export namespace ReservedResourcePatchRequest {
  export enum billing_model {
    STANDARD = 'standard',
    MARKETPLACE = 'marketplace',
    MARKETPLACE_AWS = 'marketplace-aws',
    MARKETPLACE_RHM = 'marketplace-rhm',
    MARKETPLACE_AZURE = 'marketplace-azure',
  }
}
