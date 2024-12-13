/* eslint-disable camelcase */
import { ANY } from '~/common/matchUtils';
import { RelatedResource, SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';
import { BillingModel } from '~/types/clusters_mgmt.v1';

export const clusterBillingModelToRelatedResource = (
  clusterBillingModel?: SubscriptionCommonFields.cluster_billing_model | BillingModel | string,
): RelatedResource.billing_model | undefined => {
  switch (true) {
    case clusterBillingModel?.toLowerCase().startsWith('marketplace'):
      return RelatedResource.billing_model.MARKETPLACE;
    case clusterBillingModel === SubscriptionCommonFields.cluster_billing_model.STANDARD:
      return RelatedResource.billing_model.STANDARD;
    case clusterBillingModel === ANY:
      return RelatedResource.billing_model.ANY;
    default:
      return undefined;
  }
};
