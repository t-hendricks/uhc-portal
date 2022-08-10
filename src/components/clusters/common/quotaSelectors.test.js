import {
  hasManagedQuotaSelector,
  hasAwsQuotaSelector,
  hasGcpQuotaSelector,
  awsQuotaSelector,
  gcpQuotaSelector,
  availableClustersFromQuota,
  availableNodesFromQuota,
} from './quotaSelectors';
import { normalizedProducts, billingModels } from '../../../common/subscriptionTypes';
import {
  mockQuotaList, emptyQuotaList,
  ROSAQuotaList, CCSQuotaList, TrialQuotaList,
  ROSACCSQuotaList, CCSROSAQuotaList, TrialCCSQuotaList, CCSTrialQuotaList,
  rhQuotaList, negativeQuotaList,
} from './__test__/quota.fixtures';

const state = quotaList => ({ userProfile: { organization: { quotaList } } });

describe('quotaSelectors', () => {
  describe('processQuota', () => {
    it('processed result does not depend on input order', () => {
      // Resulting .items is the input, so obviously depends on input.
      // But the .clustersQuota, .nodesQuota etc. should match.
      expect({ ...ROSACCSQuotaList, items: null }).toEqual({ ...CCSROSAQuotaList, items: null });
      expect({ ...TrialCCSQuotaList, items: null }).toEqual({ ...CCSTrialQuotaList, items: null });
    });
  });

  describe('hasAwsQuotaSelector', () => {
    it('', () => {
      expect(hasAwsQuotaSelector(state(emptyQuotaList), normalizedProducts.OSD)).toBe(false);
      expect(hasAwsQuotaSelector(state(ROSAQuotaList), normalizedProducts.OSD)).toBe(false);
      expect(hasAwsQuotaSelector(state(ROSAQuotaList), normalizedProducts.ROSA)).toBe(true);
      expect(hasAwsQuotaSelector(state(CCSQuotaList), normalizedProducts.OSD)).toBe(true);
      expect(hasAwsQuotaSelector(state(rhQuotaList), normalizedProducts.OSD)).toBe(true);
      expect(hasAwsQuotaSelector(state(mockQuotaList), normalizedProducts.OSD)).toBe(true);
      expect(hasAwsQuotaSelector(state(mockQuotaList), normalizedProducts.OSDTrial)).toBe(true);
    });
  });

  describe('hasGcpQuotaSelector', () => {
    it('', () => {
      expect(hasGcpQuotaSelector(state(emptyQuotaList), normalizedProducts.OSD)).toBe(false);
      expect(hasGcpQuotaSelector(state(ROSAQuotaList), normalizedProducts.OSD)).toBe(false);
      expect(hasGcpQuotaSelector(state(CCSQuotaList), normalizedProducts.OSD)).toBe(true);
      expect(hasGcpQuotaSelector(state(rhQuotaList), normalizedProducts.OSD)).toBe(true);
      expect(hasGcpQuotaSelector(state(mockQuotaList), normalizedProducts.OSD)).toBe(true);
    });
  });

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

  describe('awsQuotaSelector', () => {
    it('handles empty quota', () => {
      const empty = awsQuotaSelector(state(emptyQuotaList), normalizedProducts.OSD);
      expect(empty.isAvailable).toBe(false);
      expect(empty.byoc.totalAvailable).toEqual(0);
      expect(empty.byoc.singleAz.available).toEqual(0);
    });

    it('handles quota for CCS', () => {
      const mock = awsQuotaSelector(state(mockQuotaList), normalizedProducts.OSD);
      expect(mock.byoc.singleAz.available).toBeGreaterThan(0);

      const aws = awsQuotaSelector(state(CCSQuotaList), normalizedProducts.OSD);
      expect(aws.isAvailable).toBe(true);
      expect(aws.byoc.totalAvailable).toEqual(20);
      expect(aws.byoc.multiAz.available).toEqual(20);
    });

    it('handles quota by product', () => {
      const productMismatch = awsQuotaSelector(state(CCSQuotaList), normalizedProducts.OSDTrial);
      expect(productMismatch.isAvailable).toBe(false);

      const trial = awsQuotaSelector(state(TrialQuotaList), normalizedProducts.OSDTrial);
      expect(trial.isAvailable).toBe(true);
    });
  });

  describe('gcpQuotaSelector', () => {
    it('handles empty quota', () => {
      const empty = gcpQuotaSelector(state(emptyQuotaList), normalizedProducts.OSD);
      expect(empty.isAvailable).toBe(false);
      expect(empty.byoc.totalAvailable).toEqual(0);
      expect(empty.byoc.singleAz.available).toEqual(0);
    });

    it('handles quota for CCS', () => {
      const mock = gcpQuotaSelector(state(mockQuotaList), normalizedProducts.OSD);
      expect(mock.byoc.singleAz.available).toBeGreaterThan(0);

      const gcp = gcpQuotaSelector(state(CCSQuotaList), normalizedProducts.OSD);
      expect(gcp.isAvailable).toBe(true);
      expect(gcp.byoc.totalAvailable).toEqual(20);
      expect(gcp.byoc.multiAz.available).toEqual(20);
    });

    it('handles quota by product', () => {
      const productMismatch = awsQuotaSelector(state(CCSQuotaList), normalizedProducts.OSDTrial);
      expect(productMismatch.isAvailable).toBe(false);

      const trial = awsQuotaSelector(state(TrialQuotaList), normalizedProducts.OSDTrial);
      expect(trial.isAvailable).toBe(true);
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
      expect(availableClustersFromQuota(ROSACCSQuotaList, paramsROSA))
        .toBe(Infinity);
      expect(availableClustersFromQuota(CCSROSAQuotaList, paramsROSA))
        .toBe(Infinity);
      expect(availableClustersFromQuota(mockQuotaList, paramsROSA)).toBe(Infinity);
    });
  });

  describe('availableNodesFromQuota', () => {
    it('0 without quota', () => {
    });

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
});
