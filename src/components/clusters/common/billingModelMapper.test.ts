/* eslint-disable camelcase */
import { RelatedResource } from '~/types/accounts_mgmt.v1';
import { BillingModel } from '~/types/clusters_mgmt.v1';

import { clusterBillingModelToRelatedResource } from './billingModelMapper';

describe('billingModelMapper', () => {
  describe('clusterBillingModelToRelatedResource', () => {
    it.each([
      [undefined, undefined],
      ['', undefined],
      [BillingModel.MARKETPLACE, RelatedResource.billing_model.MARKETPLACE],
      [BillingModel.MARKETPLACE_AWS, 'marketplace-aws'], // TODO: it should handle marketplace-* -> marketplace in future
      [BillingModel.MARKETPLACE_AZURE, RelatedResource.billing_model.MARKETPLACE_AZURE],
      [BillingModel.MARKETPLACE_GCP, RelatedResource.billing_model.MARKETPLACE_GCP],
      [BillingModel.MARKETPLACE_RHM, RelatedResource.billing_model.MARKETPLACE_RHM],
      [BillingModel.STANDARD, RelatedResource.billing_model.STANDARD],
      ['marketplace', RelatedResource.billing_model.MARKETPLACE],
      ['any', RelatedResource.billing_model.ANY],
      ['whatever', 'whatever'], // TODO: it should map to undefined in the future
    ])(
      'when -%p- then %p',
      (
        clusterBillingModel: BillingModel | string | undefined,
        expected: RelatedResource.billing_model | string | undefined,
      ) => expect(clusterBillingModelToRelatedResource(clusterBillingModel)).toBe(expected),
    );
  });
});
