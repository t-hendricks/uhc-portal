import { SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

import { normalizedProducts } from '../../../common/subscriptionTypes';

const getBillingModelLabel = (cluster: ClusterFromSubscription): string => {
  const standardLabel = 'Standard';

  switch (cluster.subscription?.plan?.type) {
    case normalizedProducts.OSDTRIAL:
      return 'Free trial, upgradeable';
    case normalizedProducts.OSD:
      switch (cluster.subscription?.cluster_billing_model) {
        case SubscriptionCommonFields.cluster_billing_model.STANDARD:
          return 'Annual Red Hat subscriptions';
        case SubscriptionCommonFields.cluster_billing_model.MARKETPLACE:
        case SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_AWS:
          switch (cluster.ccs?.enabled) {
            case true:
              return 'On-demand via Red Hat Marketplace';
            case false:
              return standardLabel;
            default:
              // CCS is undefined for archived clusters. Showing N/A in this case
              return 'N/A';
          }
        case SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_GCP:
          switch (cluster.ccs?.enabled) {
            case true:
              return 'On-demand via Google Cloud Marketplace';
            case false:
              return standardLabel;
            default:
              // CCS is undefined for archived clusters. Showing N/A in this case
              return 'N/A';
          }
        default:
          return standardLabel;
      }
    default:
      return standardLabel;
  }
};

export default getBillingModelLabel;
