import * as quotaSelectors from './quotaSelectors';
import { dedicatedRhInfra, dedicatedBYOC, unlimitedMOA } from './__test__/quota.fixtures';
import { userActions } from '../../../redux/actions/userActions';
// This is the quota we use in mockdata mode, pretty much everything is allowed.
import * as mockQuotaCost from '../../../../mockdata/api/accounts_mgmt/v1/organizations/1HAXGgCYqHpednsRDiwWsZBmDlA/quota_cost.json';

const state = quotaList => ({ userProfile: { organization: { quotaList } } });

describe('quotaSelectors', () => {
  const mockQuotaList = userActions.processQuota({ data: mockQuotaCost });
  const emptyQuotaList = userActions.processQuota({ data: { items: [] } });

  const MOAQuotaList = userActions.processQuota({ data: { items: unlimitedMOA } });
  const BYOCQuotaList = userActions.processQuota({ data: { items: dedicatedBYOC } });
  const MOABYOCQuotaList = userActions.processQuota(
    { data: { items: [...unlimitedMOA, ...dedicatedBYOC] } },
  );
  const BYOCMOAQuotaList = userActions.processQuota(
    { data: { items: [...dedicatedBYOC, ...unlimitedMOA] } },
  );

  const rhQuotaList = userActions.processQuota({ data: { items: dedicatedRhInfra } });

  describe('hasAwsQuotaSelector', () => {
    it('', () => {
      expect(quotaSelectors.hasAwsQuotaSelector(state(emptyQuotaList))).toBe(false);
      expect(quotaSelectors.hasAwsQuotaSelector(state(MOAQuotaList))).toBe(false);
      expect(quotaSelectors.hasAwsQuotaSelector(state(BYOCQuotaList))).toBe(true);
      expect(quotaSelectors.hasAwsQuotaSelector(state(rhQuotaList))).toBe(true);
      expect(quotaSelectors.hasAwsQuotaSelector(state(mockQuotaList))).toBe(true);
    });
  });

  describe('hasGcpQuotaSelector', () => {
    it('', () => {
      expect(quotaSelectors.hasGcpQuotaSelector(state(emptyQuotaList))).toBe(false);
      expect(quotaSelectors.hasGcpQuotaSelector(state(MOAQuotaList))).toBe(false);
      expect(quotaSelectors.hasGcpQuotaSelector(state(BYOCQuotaList))).toBe(true);
      expect(quotaSelectors.hasGcpQuotaSelector(state(rhQuotaList))).toBe(true);
      expect(quotaSelectors.hasGcpQuotaSelector(state(mockQuotaList))).toBe(true);
    });
  });

  describe('hasOSDQuotaSelector', () => {
    it('', () => {
      expect(quotaSelectors.hasOSDQuotaSelector(state(emptyQuotaList))).toBe(false);
      expect(quotaSelectors.hasOSDQuotaSelector(state(MOAQuotaList))).toBe(false);
      expect(quotaSelectors.hasOSDQuotaSelector(state(BYOCQuotaList))).toBe(true);
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
  const paramsBYOC = {
    product: 'OSD',
    cloudProviderID: 'aws',
    resourceName: 'gp.small',
    isMultiAz: true,
    isBYOC: true,
  };
  const paramsMOA = {
    ...paramsBYOC,
    product: 'MOA',
  };

  describe('availableClustersFromQuota', () => {
    it('selects OSD on rhInfra', () => {
      expect(quotaSelectors.availableClustersFromQuota(emptyQuotaList, paramsRhInfra)).toBe(0);
      expect(quotaSelectors.availableClustersFromQuota(BYOCQuotaList, paramsRhInfra)).toBe(0);
      expect(quotaSelectors.availableClustersFromQuota(MOAQuotaList, paramsRhInfra)).toBe(0);

      expect(quotaSelectors.availableClustersFromQuota(rhQuotaList, paramsRhInfra)).toBe(17);
      expect(quotaSelectors.availableClustersFromQuota(mockQuotaList, paramsRhInfra)).toBe(17);
    });

    it('selects CCS by product', () => {
      expect(quotaSelectors.availableClustersFromQuota(emptyQuotaList, paramsBYOC)).toBe(0);
      expect(quotaSelectors.availableClustersFromQuota(MOABYOCQuotaList, paramsBYOC)).toBe(20);
      expect(quotaSelectors.availableClustersFromQuota(BYOCMOAQuotaList, paramsBYOC)).toBe(20);
      expect(quotaSelectors.availableClustersFromQuota(mockQuotaList, paramsBYOC)).toBe(20);

      // Currently AMS only sends 0-cost for MOA once it notices that you have a MOA cluster.
      // Until it *always* sends 0-cost quotas, returning Infinity even on empty input is a feature.
      expect(quotaSelectors.availableClustersFromQuota(emptyQuotaList, paramsMOA)).toBe(Infinity);
      expect(quotaSelectors.availableClustersFromQuota(MOABYOCQuotaList, paramsMOA)).toBe(Infinity);
      expect(quotaSelectors.availableClustersFromQuota(BYOCMOAQuotaList, paramsMOA)).toBe(Infinity);
      expect(quotaSelectors.availableClustersFromQuota(mockQuotaList, paramsMOA)).toBe(Infinity);
    });
  });

  describe('availableNodesFromQuota', () => {
    it('0 without quota', () => {
    });

    it('selects OSD on rhInfra', () => {
      expect(quotaSelectors.availableNodesFromQuota(emptyQuotaList, paramsRhInfra)).toBe(0);
      expect(quotaSelectors.availableNodesFromQuota(BYOCQuotaList, paramsRhInfra)).toBe(0);
      expect(quotaSelectors.availableNodesFromQuota(MOAQuotaList, paramsRhInfra)).toBe(0);
      // (27 - 4) / 1 = 23
      expect(quotaSelectors.availableNodesFromQuota(rhQuotaList, paramsRhInfra)).toBe(23);
      expect(quotaSelectors.availableNodesFromQuota(mockQuotaList, paramsRhInfra)).toBe(23);
    });

    it('selects CCS by product', () => {
      expect(quotaSelectors.availableNodesFromQuota(emptyQuotaList, paramsBYOC)).toBe(0);
      // (520 - 0) / 4 = 130
      expect(quotaSelectors.availableNodesFromQuota(MOABYOCQuotaList, paramsBYOC)).toBe(130);
      expect(quotaSelectors.availableNodesFromQuota(BYOCMOAQuotaList, paramsBYOC)).toBe(130);
      expect(quotaSelectors.availableNodesFromQuota(mockQuotaList, paramsBYOC)).toBe(130);

      // Currently AMS only sends 0-cost for MOA once it notices that you have a MOA cluster.
      // Until it *always* sends 0-cost quotas, returning Infinity even on empty input is a feature.
      expect(quotaSelectors.availableNodesFromQuota(MOABYOCQuotaList, paramsMOA)).toBe(Infinity);
      expect(quotaSelectors.availableNodesFromQuota(BYOCMOAQuotaList, paramsMOA)).toBe(Infinity);
      expect(quotaSelectors.availableNodesFromQuota(mockQuotaList, paramsMOA)).toBe(Infinity);
    });
  });
});
