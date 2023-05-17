import {
  hasManagedQuotaSelector,
  availableClustersFromQuota,
  availableNodesFromQuota,
  addOnBillingQuota,
  quotaTypes,
  getAwsBillingAccountsFromQuota,
} from './quotaSelectors';
import { normalizedProducts, billingModels } from '../../../common/subscriptionTypes';
import {
  mockQuotaList,
  emptyQuotaList,
  ROSAQuotaList,
  CCSQuotaList,
  TrialQuotaList,
  ROSACCSQuotaList,
  CCSROSAQuotaList,
  rhQuotaList,
  negativeQuotaList,
  addonsQuotaList,
} from './__test__/quota.fixtures';

const state = (quotaList) => ({ userProfile: { organization: { quotaList } } });

describe('quotaSelectors', () => {
  describe('hasManagedQuotaSelector', () => {
    it('', () => {
      expect(hasManagedQuotaSelector(state(emptyQuotaList), normalizedProducts.OSD)).toBe(false);
      expect(hasManagedQuotaSelector(state(ROSAQuotaList), normalizedProducts.OSD)).toBe(false);
      expect(hasManagedQuotaSelector(state(CCSQuotaList), normalizedProducts.OSD)).toBe(true);
      expect(hasManagedQuotaSelector(state(rhQuotaList), normalizedProducts.OSD)).toBe(true);
      expect(hasManagedQuotaSelector(state(mockQuotaList), normalizedProducts.OSD)).toBe(true);
      expect(hasManagedQuotaSelector(state(negativeQuotaList), normalizedProducts.OSD)).toBe(true);
    });
  });

  const paramsRhInfra = {
    product: normalizedProducts.OSD,
    cloudProviderID: 'aws',
    resourceName: 'standard-4',
    isMultiAz: true,
    isBYOC: false,
    billingModel: billingModels.STANDARD,
  };
  const paramsCCS = {
    product: normalizedProducts.OSD,
    cloudProviderID: 'aws',
    resourceName: 'standard-4',
    isMultiAz: true,
    isBYOC: true,
    billingModel: billingModels.STANDARD,
  };
  const paramsCCSOnDemand = {
    product: normalizedProducts.OSD,
    cloudProviderID: 'aws',
    resourceName: 'standard-4',
    isMultiAz: true,
    isBYOC: true,
    billingModel: billingModels.MARKETPLACE,
  };
  const paramsTrial = {
    product: normalizedProducts.OSDTrial,
    cloudProviderID: 'aws',
    resourceName: 'standard-4',
    isMultiAz: true,
    isBYOC: true,
    billingModel: billingModels.STANDARD,
  };
  const paramsROSA = {
    ...paramsCCS,
    product: normalizedProducts.ROSA,
  };

  describe('addOnBillingQuota', () => {
    it('returns addon billing quota information', () => {
      expect(
        addOnBillingQuota(addonsQuotaList, {
          ...paramsCCSOnDemand,
          resourceType: quotaTypes.ADD_ON,
          resourceName: 'addon-open-data-hub',
        }),
      ).toStrictEqual({
        marketplace: {
          allowed: 15,
          consumed: 0,
          cost: 1,
          cloudAccounts: {
            rhm: [
              {
                cloud_account_id: 'fakeRHMarketplaceAccount',
                cloud_provider_id: 'rhm',
              },
            ],
            aws: [
              {
                cloud_account_id: '000000000004',
                cloud_provider_id: 'aws',
              },
            ],
            azure: [
              {
                cloud_account_id: 'fakeAzureSubscriptionId',
                cloud_provider_id: 'azure',
              },
            ],
          },
        },
      });
    });
  });

  describe('availableClustersFromQuota', () => {
    it('selects OSD on rhInfra', () => {
      expect(availableClustersFromQuota(emptyQuotaList, paramsRhInfra)).toBe(0);
      expect(availableClustersFromQuota(CCSQuotaList, paramsRhInfra)).toBe(0);
      expect(availableClustersFromQuota(TrialQuotaList, paramsRhInfra)).toBe(0);
      expect(availableClustersFromQuota(ROSAQuotaList, paramsRhInfra)).toBe(0);

      expect(availableClustersFromQuota(rhQuotaList, paramsRhInfra)).toBe(17);
      expect(availableClustersFromQuota(mockQuotaList, paramsRhInfra)).toBe(17);
    });

    it('selects CCS by product', () => {
      expect(availableClustersFromQuota(emptyQuotaList, paramsCCS)).toBe(0);
      expect(availableClustersFromQuota(TrialQuotaList, paramsCCS)).toBe(0);
      expect(availableClustersFromQuota(ROSACCSQuotaList, paramsCCS)).toBe(20);
      expect(availableClustersFromQuota(CCSROSAQuotaList, paramsCCS)).toBe(20);
      expect(availableClustersFromQuota(mockQuotaList, paramsCCS)).toBe(20);

      expect(availableClustersFromQuota(TrialQuotaList, paramsTrial)).toBe(1);
      expect(availableClustersFromQuota(CCSQuotaList, paramsTrial)).toBe(0);

      expect(availableClustersFromQuota(emptyQuotaList, paramsROSA)).toBe(0);
      expect(availableClustersFromQuota(ROSACCSQuotaList, paramsROSA)).toBe(Infinity);
      expect(availableClustersFromQuota(CCSROSAQuotaList, paramsROSA)).toBe(Infinity);
      expect(availableClustersFromQuota(mockQuotaList, paramsROSA)).toBe(Infinity);
    });
  });

  describe('availableNodesFromQuota', () => {
    it('0 without quota', () => {});

    it('selects OSD on rhInfra', () => {
      expect(availableNodesFromQuota(emptyQuotaList, paramsRhInfra)).toBe(0);
      expect(availableNodesFromQuota(CCSQuotaList, paramsRhInfra)).toBe(0);
      expect(availableNodesFromQuota(TrialQuotaList, paramsRhInfra)).toBe(0);
      expect(availableNodesFromQuota(ROSAQuotaList, paramsRhInfra)).toBe(0);
      // (27 - 4) / 1 = 23
      expect(availableNodesFromQuota(rhQuotaList, paramsRhInfra)).toBe(23);
      expect(availableNodesFromQuota(mockQuotaList, paramsRhInfra)).toBe(23);
    });

    it('selects CCS by product', () => {
      expect(availableNodesFromQuota(emptyQuotaList, paramsCCS)).toBe(0);
      expect(availableNodesFromQuota(TrialQuotaList, paramsCCS)).toBe(0);
      // (520 - 0) / 4 = 130
      expect(availableNodesFromQuota(ROSACCSQuotaList, paramsCCS)).toBe(130);
      expect(availableNodesFromQuota(CCSROSAQuotaList, paramsCCS)).toBe(130);
      expect(availableNodesFromQuota(mockQuotaList, paramsCCS)).toBe(130);

      // (8 - 0) / 4 = 2
      expect(availableNodesFromQuota(TrialQuotaList, paramsTrial)).toBe(2);

      // Currently AMS only sends 0-cost for ROSA once it notices that you have a ROSA cluster.
      // Until it *always* sends 0-cost quotas, returning Infinity even on empty input is a feature.
      expect(availableNodesFromQuota(ROSACCSQuotaList, paramsROSA)).toBe(Infinity);
      expect(availableNodesFromQuota(CCSROSAQuotaList, paramsROSA)).toBe(Infinity);
      expect(availableNodesFromQuota(mockQuotaList, paramsROSA)).toBe(Infinity);
    });
  });

  describe('getAwsBillingAccountsFromQuota', () => {
    it('should find the linked aws billing accounts', () => {
      const quotaWithAccounts = {
        items: [
          ...ROSACCSQuotaList.items,
          {
            allowed: 1080,
            cloud_accounts: [
              {
                cloud_account_id: '765374464689',
                cloud_provider_id: 'aws',
              },
              {
                cloud_account_id: 'fakeRHMarketplaceAccount',
                cloud_provider_id: 'rhm',
              },
              {
                cloud_account_id: 'fakeAzureAccount',
                cloud_provider_id: 'azure',
              },
              {
                cloud_account_id: 'fakeAwsAccount',
                cloud_provider_id: 'aws',
              },
            ],
            consumed: 1,
            href: '/api/accounts_mgmt/v1/organizations/1MK6ieFXd0eu1hERdENAPvpbi7x/quota_cost',
            kind: 'QuotaCost',
            organization_id: '1MK6ieFXd0eu1hERdENAPvpbi7x',
            quota_id: 'cluster|byoc|moa|marketplace',
            version: '7891248a-fc29-4d27-b6e6-870e9465c2ae',
          },
        ],
      };
      const expected = ['765374464689', 'fakeAwsAccount'];
      expect(getAwsBillingAccountsFromQuota(quotaWithAccounts)).toEqual(expected);
    });
    it('should return an empty array if there are no accounts', () => {
      const quotaWithoutAccounts = {
        items: [
          ...ROSACCSQuotaList.items,
          {
            allowed: 1080,
            cloud_accounts: [
              {
                cloud_account_id: 'fakeRHMarketplaceAccount',
                cloud_provider_id: 'rhm',
              },
              {
                cloud_account_id: 'fakeAzureAccount',
                cloud_provider_id: 'azure',
              },
            ],
            consumed: 1,
            href: '/api/accounts_mgmt/v1/organizations/1MK6ieFXd0eu1hERdENAPvpbi7x/quota_cost',
            kind: 'QuotaCost',
            organization_id: '1MK6ieFXd0eu1hERdENAPvpbi7x',
            quota_id: 'cluster|byoc|moa|marketplace',
            version: '7891248a-fc29-4d27-b6e6-870e9465c2ae',
          },
        ],
      };
      expect(getAwsBillingAccountsFromQuota(quotaWithoutAccounts)).toEqual([]);
    });
  });
});
