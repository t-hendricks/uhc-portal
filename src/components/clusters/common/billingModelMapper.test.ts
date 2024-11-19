/* eslint-disable camelcase */
import { RelatedResource, SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';
import { BillingModel } from '~/types/clusters_mgmt.v1';

import { clusterBillingModelToRelatedResource } from './billingModelMapper';

describe('billingModelMapper', () => {
  describe('clusterBillingModelToRelatedResource', () => {
    it.each([
      [undefined, undefined],
      ['', undefined],
      [
        SubscriptionCommonFields.cluster_billing_model.MARKETPLACE,
        RelatedResource.billing_model.MARKETPLACE,
      ],
      [
        SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_AWS,
        RelatedResource.billing_model.MARKETPLACE,
      ],
      [
        SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_AZURE,
        RelatedResource.billing_model.MARKETPLACE,
      ],
      [
        SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_GCP,
        RelatedResource.billing_model.MARKETPLACE,
      ],
      [
        SubscriptionCommonFields.cluster_billing_model.MARKETPLACE_RHM,
        RelatedResource.billing_model.MARKETPLACE,
      ],
      [
        SubscriptionCommonFields.cluster_billing_model.STANDARD,
        RelatedResource.billing_model.STANDARD,
      ],
      ['marketplace', RelatedResource.billing_model.MARKETPLACE],
      ['any', RelatedResource.billing_model.ANY],
      ['whatever', undefined],
    ])(
      'when -%p- then %p',
      (
        clusterBillingModel: BillingModel | string | undefined,
        expected: RelatedResource.billing_model | string | undefined,
      ) => expect(clusterBillingModelToRelatedResource(clusterBillingModel)).toBe(expected),
    );
  });
});
