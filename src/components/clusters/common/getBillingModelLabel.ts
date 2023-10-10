import { ClusterFromSubscription } from '~/types/types';
import { billingModels, normalizedProducts } from '../../../common/subscriptionTypes';

const getBillingModelLabel = (cluster: ClusterFromSubscription): string => {
  const standardLabel = 'Standard';

  switch (cluster.subscription?.plan?.type) {
    case normalizedProducts.OSDTrial:
      return 'Free trial, upgradeable';
    case normalizedProducts.OSD:
      switch (cluster.subscription?.cluster_billing_model) {
        case billingModels.STANDARD:
          return 'Annual Red Hat subscriptions';
        case billingModels.MARKETPLACE:
        case billingModels.MARKETPLACE_AWS:
          return cluster.ccs?.enabled === true
            ? 'On-demand via Red Hat Marketplace'
            : standardLabel;
        case billingModels.MARKETPLACE_GCP:
          return cluster.ccs?.enabled === true
            ? 'On-demand via Google Cloud Marketplace'
            : standardLabel;
        default:
          return standardLabel;
      }
    default:
      return standardLabel;
  }
};

export default getBillingModelLabel;
