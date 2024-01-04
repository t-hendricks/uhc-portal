/* eslint-disable camelcase */
import { RelatedResource } from '~/types/accounts_mgmt.v1';
import { BillingModel } from '~/types/clusters_mgmt.v1';

export const clusterBillingModelToRelatedResource = (
  clusterBillingModel?: BillingModel | string,
): RelatedResource.billing_model | undefined =>
  !['', undefined].includes(clusterBillingModel)
    ? (clusterBillingModel as unknown as RelatedResource.billing_model)
    : undefined;
