import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import { ClusterFromSubscription } from '~/types/types';

import {
  defaultClusterFromSubscription,
  defaultSubscription,
} from './__tests__/defaultClusterFromSubscription.fixtures';
import getBillingModelLabel from './getBillingModelLabel';

describe('getBillingModelLabel', () => {
  it.each([
    [normalizedProducts.OSDTrial, undefined, undefined, 'Free trial, upgradeable'],
    [normalizedProducts.OSD, undefined, undefined, 'Standard'],
    [normalizedProducts.OSD, billingModels.STANDARD, undefined, 'Annual Red Hat subscriptions'],
    [normalizedProducts.OSD, billingModels.MARKETPLACE, undefined, 'Standard'],
    [normalizedProducts.OSD, billingModels.MARKETPLACE_AWS, undefined, 'Standard'],
    [normalizedProducts.OSD, billingModels.MARKETPLACE_GCP, undefined, 'N/A'],
    [normalizedProducts.OSD, billingModels.MARKETPLACE, true, 'On-demand via Red Hat Marketplace'],
    [
      normalizedProducts.OSD,
      billingModels.MARKETPLACE_AWS,
      true,
      'On-demand via Red Hat Marketplace',
    ],
    [
      normalizedProducts.OSD,
      billingModels.MARKETPLACE_GCP,
      true,
      'On-demand via Google Cloud Marketplace',
    ],
    [normalizedProducts.OSD, billingModels.MARKETPLACE, false, 'Standard'],
    [normalizedProducts.OSD, billingModels.MARKETPLACE_AWS, false, 'Standard'],
    [normalizedProducts.OSD, billingModels.MARKETPLACE_GCP, false, 'Standard'],
    [normalizedProducts.ARO, undefined, undefined, 'Standard'],
    [undefined, undefined, undefined, 'Standard'],
  ])(
    'when plan type is %p, billing model %p and CCS enabled is %p should return %p',
    (
      planType: string | undefined,
      billingModel: string | undefined,
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
