import reverse from 'lodash/reverse';

import * as quotaSelectors from './quotaSelectors';
import { userActions } from '../../../redux/actions/userActions';
// This is the quota we use in mockdata mode, pretty much everything is allowed.
import * as mockQuotaCost from '../../../../mockdata/api/accounts_mgmt/v1/organizations/1HAXGgCYqHpednsRDiwWsZBmDlA/quota_cost.json';

const emptyQuotaCost = { items: [] };

const state = quotaList => ({ userProfile: { organization: { quotaList } } });

describe('quotaSelectors', () => {
  const mockQuotaList = userActions.processQuota({ data: mockQuotaCost });
  const emptyQuotaList = userActions.processQuota({ data: emptyQuotaCost });

  describe('hasAwsQuotaSelector', () => {
    it('', () => {
      expect(quotaSelectors.hasAwsQuotaSelector(state(emptyQuotaList))).toBe(false);
      expect(quotaSelectors.hasAwsQuotaSelector(state(mockQuotaList))).toBe(true);
    });
  });

  describe('hasGcpQuotaSelector', () => {
    it('', () => {
      expect(quotaSelectors.hasGcpQuotaSelector(state(emptyQuotaList))).toBe(false);
      expect(quotaSelectors.hasGcpQuotaSelector(state(mockQuotaList))).toBe(true);
    });
  });

  describe('hasOSDQuotaSelector', () => {
    it('', () => {
      expect(quotaSelectors.hasOSDQuotaSelector(state(emptyQuotaList))).toBe(false);
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

  describe('availableClustersFromQuota', () => {
    it('', () => {
      const params = {
        product: 'OSD',
        cloudProviderID: 'aws',
        resourceName: 'gp.small',
        isBYOC: false,
        isMultiAz: true,
      };
      expect(quotaSelectors.availableClustersFromQuota(emptyQuotaList, params)).toBe(0);
      expect(quotaSelectors.availableClustersFromQuota(mockQuotaList, params)).toBe(17);
    });
  });

  describe('availableNodesFromQuota', () => {
    it('0 without quota', () => {
      const paramsOSD = {
        product: 'OSD',
        cloudProviderID: 'aws',
        resourceName: 'gp.small',
        isBYOC: true,
        isMultiAz: true,
      };
      expect(quotaSelectors.availableNodesFromQuota(emptyQuotaList, paramsOSD)).toBe(0);
    });

    it('TODO match by product', () => {
      // TODO match only correct 'product' (see https://issues.redhat.com/browse/SDA-3038).
      // Currently they collide and whichever we see last wins :-()
      const unlimitedMOAfirst = mockQuotaList;
      const unlimitedMOAlast = userActions.processQuota(
        { data: { items: reverse(mockQuotaCost.items) } },
      );

      const paramsOSD = {
        product: 'OSD',
        cloudProviderID: 'aws',
        resourceName: 'gp.small',
        isBYOC: true,
        isMultiAz: true,
      };
      const paramsMOA = {
        product: 'MOA',
        ...paramsOSD,
      };

      expect(quotaSelectors.availableNodesFromQuota(unlimitedMOAfirst, paramsOSD))
        .toBe((520 - 0) / 4);
      expect(quotaSelectors.availableNodesFromQuota(unlimitedMOAfirst, paramsMOA))
        .toBe((520 - 0) / 4); // TODO wrong!
      expect(quotaSelectors.availableNodesFromQuota(unlimitedMOAlast, paramsOSD))
        .toBe(Infinity);
      expect(quotaSelectors.availableNodesFromQuota(unlimitedMOAlast, paramsMOA))
        .toBe(Infinity); // TODO wrong!
    });
  });
});
