import { normalizedProducts } from '~/common/subscriptionTypes';
import { SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

import {
  defaultClusterFromSubscription,
  defaultSubscription,
} from './__tests__/defaultClusterFromSubscription.fixtures';
import getBillingModelLabel from './getBillingModelLabel';

describe('getBillingModelLabel', () => {
  it.each([
    [normalizedProducts.OSDTRIAL, undefined, undefined, 'Free trial, upgradeable'],
    [normalizedProducts.OSD, undefined, undefined, 'Standard'],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFields.cluster_billing_model.STANDARD,
      undefined,
      'Annual Red Hat subscriptions',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFields.cluster_billing_model.MARKETPLACE,
      undefined,
      'N/A',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_AWS,
      undefined,
      'N/A',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_GCP,
      undefined,
      'N/A',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFields.cluster_billing_model.MARKETPLACE,
      true,
      'On-demand via Red Hat Marketplace',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_AWS,
      true,
      'On-demand via Red Hat Marketplace',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_GCP,
      true,
      'On-demand via Google Cloud Marketplace',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFields.cluster_billing_model.MARKETPLACE,
      false,
      'Standard',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_AWS,
      false,
      'Standard',
    ],
    [
      normalizedProducts.OSD,
      SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_GCP,
      false,
      'Standard',
    ],
    [normalizedProducts.ARO, undefined, undefined, 'Standard'],
    [undefined, undefined, undefined, 'Standard'],
  ])(
    'when plan type is %p, billing model %p and CCS enabled is %p should return %p',
    (
      planType: string | undefined,
      billingModel: SubscriptionCommonFields.cluster_billing_model | undefined,
      ccsEnabled: boolean | undefined,
      expectedResult: string,
    ) => {
      const cluster: ClusterFromSubscription = {
        ...defaultClusterFromSubscription,
        subscription: {
          ...defaultSubscription,
          cluster_billing_model: billingModel,
          plan: {
            type: planType,
          },
        },
        ccs: {
          enabled: ccsEnabled,
        },
      };
      expect(getBillingModelLabel(cluster)).toEqual(expectedResult);
    },
  );
});
