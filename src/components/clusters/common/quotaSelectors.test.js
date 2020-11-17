import * as quotaSelectors from './quotaSelectors';
import { dedicatedRhInfra, dedicatedCCS, unlimitedROSA } from './__test__/quota.fixtures';
import { userActions } from '../../../redux/actions/userActions';
// This is the quota we use in mockdata mode, pretty much everything is allowed.
import * as mockQuotaCost from '../../../../mockdata/api/accounts_mgmt/v1/organizations/1HAXGgCYqHpednsRDiwWsZBmDlA/quota_cost.json';

const state = quotaList => ({ userProfile: { organization: { quotaList } } });

describe('quotaSelectors', () => {
  const mockQuotaList = userActions.processQuota({ data: mockQuotaCost });
  const emptyQuotaList = userActions.processQuota({ data: { items: [] } });

  const ROSAQuotaList = userActions.processQuota({ data: { items: unlimitedROSA } });
  const CCSQuotaList = userActions.processQuota({ data: { items: dedicatedCCS } });
  const ROSACCSQuotaList = userActions.processQuota(
    { data: { items: [...unlimitedROSA, ...dedicatedCCS] } },
  );
  const CCSROSAQuotaList = userActions.processQuota(
    { data: { items: [...dedicatedCCS, ...unlimitedROSA] } },
  );

  const rhQuotaList = userActions.processQuota({ data: { items: dedicatedRhInfra } });

  describe('hasAwsQuotaSelector', () => {
    it('', () => {
      expect(quotaSelectors.hasAwsQuotaSelector(state(emptyQuotaList))).toBe(false);
      expect(quotaSelectors.hasAwsQuotaSelector(state(ROSAQuotaList))).toBe(false);
      expect(quotaSelectors.hasAwsQuotaSelector(state(CCSQuotaList))).toBe(true);
      expect(quotaSelectors.hasAwsQuotaSelector(state(rhQuotaList))).toBe(true);
      expect(quotaSelectors.hasAwsQuotaSelector(state(mockQuotaList))).toBe(true);
    });
  });

  describe('hasGcpQuotaSelector', () => {
    it('', () => {
      expect(quotaSelectors.hasGcpQuotaSelector(state(emptyQuotaList))).toBe(false);
      expect(quotaSelectors.hasGcpQuotaSelector(state(ROSAQuotaList))).toBe(false);
      expect(quotaSelectors.hasGcpQuotaSelector(state(CCSQuotaList))).toBe(true);
      expect(quotaSelectors.hasGcpQuotaSelector(state(rhQuotaList))).toBe(true);
      expect(quotaSelectors.hasGcpQuotaSelector(state(mockQuotaList))).toBe(true);
    });
  });

  describe('hasOSDQuotaSelector', () => {
    it('', () => {
      expect(quotaSelectors.hasOSDQuotaSelector(state(emptyQuotaList))).toBe(false);
      expect(quotaSelectors.hasOSDQuotaSelector(state(ROSAQuotaList))).toBe(false);
      expect(quotaSelectors.hasOSDQuotaSelector(state(CCSQuotaList))).toBe(true);
      expect(quotaSelectors.hasOSDQuotaSelector(state(rhQuotaList))).toBe(true);
      expect(quotaSelectors.hasOSDQuotaSelector(state(mockQuotaList))).toBe(true);
    });
  });

  describe('awsQuotaSelector', () => {
    it('', () => {
      expect(quotaSelectors.awsQuotaSelector(state(emptyQuotaList)).rhInfra.singleAz).toBeDefined();
      expect(quotaSelectors.awsQuotaSelector(state(mockQuotaList)).rhInfra.singleAz).toBeDefined();
    });
  });

  describe('gcpQuotaSelector', () => {
    it('', () => {
      expect(quotaSelectors.gcpQuotaSelector(state(emptyQuotaList)).rhInfra.singleAz).toBeDefined();
      expect(quotaSelectors.gcpQuotaSelector(state(mockQuotaList)).rhInfra.singleAz).toBeDefined();
    });
  });

  const paramsRhInfra = {
    product: 'OSD',
    cloudProviderID: 'aws',
    resourceName: 'gp.small',
    isMultiAz: true,
    isBYOC: false,
  };
  const paramsCCS = {
    product: 'OSD',
    cloudProviderID: 'aws',
    resourceName: 'gp.small',
    isMultiAz: true,
    isBYOC: true,
  };
  const paramsROSA = {
    ...paramsCCS,
    product: 'MOA',
  };

  describe('availableClustersFromQuota', () => {
    it('selects OSD on rhInfra', () => {
      expect(quotaSelectors.availableClustersFromQuota(emptyQuotaList, paramsRhInfra)).toBe(0);
      expect(quotaSelectors.availableClustersFromQuota(CCSQuotaList, paramsRhInfra)).toBe(0);
      expect(quotaSelectors.availableClustersFromQuota(ROSAQuotaList, paramsRhInfra)).toBe(0);

      expect(quotaSelectors.availableClustersFromQuota(rhQuotaList, paramsRhInfra)).toBe(17);
      expect(quotaSelectors.availableClustersFromQuota(mockQuotaList, paramsRhInfra)).toBe(17);
    });

    it('selects CCS by product', () => {
      expect(quotaSelectors.availableClustersFromQuota(emptyQuotaList, paramsCCS)).toBe(0);
      expect(quotaSelectors.availableClustersFromQuota(ROSACCSQuotaList, paramsCCS)).toBe(20);
      expect(quotaSelectors.availableClustersFromQuota(CCSROSAQuotaList, paramsCCS)).toBe(20);
      expect(quotaSelectors.availableClustersFromQuota(mockQuotaList, paramsCCS)).toBe(20);

      // Currently AMS only sends 0-cost for ROSA once it notices that you have a ROSA cluster.
      // Until it *always* sends 0-cost quotas, returning Infinity even on empty input is a feature.
      expect(quotaSelectors.availableClustersFromQuota(emptyQuotaList, paramsROSA)).toBe(Infinity);
      expect(quotaSelectors.availableClustersFromQuota(ROSACCSQuotaList, paramsROSA))
        .toBe(Infinity);
      expect(quotaSelectors.availableClustersFromQuota(CCSROSAQuotaList, paramsROSA))
        .toBe(Infinity);
      expect(quotaSelectors.availableClustersFromQuota(mockQuotaList, paramsROSA)).toBe(Infinity);
    });
  });

  describe('availableNodesFromQuota', () => {
    it('0 without quota', () => {
    });

    it('selects OSD on rhInfra', () => {
      expect(quotaSelectors.availableNodesFromQuota(emptyQuotaList, paramsRhInfra)).toBe(0);
      expect(quotaSelectors.availableNodesFromQuota(CCSQuotaList, paramsRhInfra)).toBe(0);
      expect(quotaSelectors.availableNodesFromQuota(ROSAQuotaList, paramsRhInfra)).toBe(0);
      // (27 - 4) / 1 = 23
      expect(quotaSelectors.availableNodesFromQuota(rhQuotaList, paramsRhInfra)).toBe(23);
      expect(quotaSelectors.availableNodesFromQuota(mockQuotaList, paramsRhInfra)).toBe(23);
    });

    it('selects CCS by product', () => {
      expect(quotaSelectors.availableNodesFromQuota(emptyQuotaList, paramsCCS)).toBe(0);
      // (520 - 0) / 4 = 130
      expect(quotaSelectors.availableNodesFromQuota(ROSACCSQuotaList, paramsCCS)).toBe(130);
      expect(quotaSelectors.availableNodesFromQuota(CCSROSAQuotaList, paramsCCS)).toBe(130);
      expect(quotaSelectors.availableNodesFromQuota(mockQuotaList, paramsCCS)).toBe(130);

      // Currently AMS only sends 0-cost for ROSA once it notices that you have a ROSA cluster.
      // Until it *always* sends 0-cost quotas, returning Infinity even on empty input is a feature.
      expect(quotaSelectors.availableNodesFromQuota(ROSACCSQuotaList, paramsROSA)).toBe(Infinity);
      expect(quotaSelectors.availableNodesFromQuota(CCSROSAQuotaList, paramsROSA)).toBe(Infinity);
      expect(quotaSelectors.availableNodesFromQuota(mockQuotaList, paramsROSA)).toBe(Infinity);
    });
  });
});
