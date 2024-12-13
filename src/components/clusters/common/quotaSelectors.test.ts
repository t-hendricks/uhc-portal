import { QuotaCost, QuotaCostList } from '~/types/accounts_mgmt.v1';
import { BillingModel } from '~/types/clusters_mgmt.v1';
import { ClusterFromSubscription } from '~/types/types';

import { normalizedProducts } from '../../../common/subscriptionTypes';

import { defaultClusterFromSubscription } from './__tests__/defaultClusterFromSubscription.fixtures';
import {
  emptyQuota,
  paramsAddons,
  paramsAddonsStandard,
  paramsCCS,
  paramsGCP,
  paramsRhInfra,
  paramsROSA,
  paramsTrial,
  quotaWithAccountsExpected,
} from './__tests__/quota.fixtures';
import {
  addonsQuotaList,
  addonsQuotaListStandardBillingModel,
  CCSQuotaList,
  CCSROSAQuotaList,
  cluster,
  clusterNonExistingBillingModel,
  emptyQuotaCostList,
  expectedAddons,
  expectedAddonsBillingModel,
  expectedDefault,
  expectedNonDefault,
  expectedNonExistingBillingModel,
  mockQuotaList,
  negativeQuotaList,
  queryBillingModel,
  quota1,
  quotaBillingModel,
  quotaWithAccounts,
  quotaWithoutAccounts,
  rhQuotaList,
  ROSACCSQuotaList,
  ROSAQuotaList,
  simpleQuery,
  TrialQuotaList,
} from './__tests__/quotaSelectors.fixtures';
import { QuotaParams, QuotaQuery } from './quotaModel';
import {
  addOnBillingQuota,
  availableClustersFromQuota,
  availableFromQuotaCostItem,
  availableNodesFromQuota,
  availableQuota,
  getAwsBillingAccountsFromQuota,
  getBillingQuotaModel,
  hasManagedQuotaSelector,
  hasPotentialQuota,
  queryFromCluster,
} from './quotaSelectors';

describe('quotaSelectors', () => {
  describe('availableFromQuotaCostItem', () => {
    it.each([
      ['empty quota', emptyQuota, simpleQuery, 0],
      ['quota billing model', quotaBillingModel, queryBillingModel, 15],
      ['0 query', quota1, simpleQuery, 0],
    ])('%p', (title: string, quotaCostItem: QuotaCost, query: QuotaQuery, expected: number) =>
      expect(availableFromQuotaCostItem(quotaCostItem, query)).toBe(expected),
    );
  });

  describe('getBillingQuotaModel', () => {
    it.each([
      [BillingModel.MARKETPLACE_AWS, BillingModel.MARKETPLACE],
      [BillingModel.MARKETPLACE, BillingModel.MARKETPLACE],
      [BillingModel.MARKETPLACE_AZURE, BillingModel.MARKETPLACE_AZURE],
      [BillingModel.MARKETPLACE_GCP, BillingModel.MARKETPLACE_GCP],
      [BillingModel.MARKETPLACE_RHM, BillingModel.MARKETPLACE_RHM],
    ])('model %p is %p', (model: BillingModel, expected: string) => {
      expect(getBillingQuotaModel(model)).toBe(expected);
    });
  });

  describe('availableQuota', () => {
    it.each([
      ['RH Infra should be 0', emptyQuotaCostList, paramsRhInfra, 0],
      ['GCP should be Infinity', emptyQuotaCostList, paramsGCP as any as QuotaParams, Infinity],
    ])(
      '%p',
      (title: string, quotaList: QuotaCostList, quotaParams: QuotaParams, expected: number) => {
        expect(availableQuota(quotaList, quotaParams)).toBe(expected);
      },
    );
  });

  describe('hasManagedQuotaSelector', () => {
    it.each([
      [emptyQuotaCostList, normalizedProducts.OSD, false],
      [ROSAQuotaList, normalizedProducts.OSD, false],
      [CCSQuotaList, normalizedProducts.OSD, true],
      [rhQuotaList, normalizedProducts.OSD, true],
      [mockQuotaList, normalizedProducts.OSD, true],
      [negativeQuotaList, normalizedProducts.OSD, true],
    ])('%p', (quotaList: QuotaCostList, product: string, exptected: boolean) =>
      expect(hasManagedQuotaSelector(quotaList, product)).toBe(exptected),
    );
  });

  describe('addOnBillingQuota', () => {
    it.each([
      ['returns addon billing quota information', addonsQuotaList, paramsAddons, expectedAddons],
      [
        'returns addon billing quota information standard billing model',
        addonsQuotaListStandardBillingModel,
        paramsAddonsStandard,
        expectedAddonsBillingModel,
      ],
    ])('%p', (title: string, quotaList: QuotaCostList, params: any, expected: any) =>
      expect(addOnBillingQuota(quotaList, params)).toStrictEqual(expected),
    );
  });

  describe('availableClustersFromQuota', () => {
    it.each([
      ['empty quota with RH Infra params should be 0', emptyQuotaCostList, paramsRhInfra, 0],
      ['CCS quota with RH Infra params should be 0', CCSQuotaList, paramsRhInfra, 0],
      ['Trial quota with RH Infra params should be 0', TrialQuotaList, paramsRhInfra, 0],
      ['ROSA quota with RH Infra params should be 0', ROSAQuotaList, paramsRhInfra, 0],
      ['RH quota with RH Infra params should be 0', rhQuotaList, paramsRhInfra, 17],
      ['MOCK quota with RH Infra params should be 17', mockQuotaList, paramsRhInfra, 17],
      ['empty quota with CCS params should be 0', emptyQuotaCostList, paramsCCS, 0],
      ['Trial quota with CCS params should be 0', TrialQuotaList, paramsCCS, 0],
      ['ROSA CCS quota with CCS params should be 20', ROSACCSQuotaList, paramsCCS, 20],
      ['CCS ROSA quota with CCS params should be 20', CCSROSAQuotaList, paramsCCS, 20],
      ['MOCK quota with CCS params should be 20', mockQuotaList, paramsCCS, 20],
      ['Trial quota with Trial params should be 1', TrialQuotaList, paramsTrial, 1],
      ['CCS quota with Trial params should be 0', CCSQuotaList, paramsTrial, 0],
      ['empty quota with ROSA params should be 0', emptyQuotaCostList, paramsROSA, 0],
      [
        'ROSA CCS quota with ROSA params should be Infinity',
        ROSACCSQuotaList,
        paramsROSA,
        Infinity,
      ],
      [
        'CCS ROSA quota with ROSA params should be Infinity',
        CCSROSAQuotaList,
        paramsROSA,
        Infinity,
      ],
      ['MOCK quota with ROSA params should be Infinity', mockQuotaList, paramsROSA, Infinity],
    ])(
      '%p',
      (title: string, quotaList: QuotaCostList, quotaParams: QuotaParams, expected: number) => {
        expect(availableClustersFromQuota(quotaList, quotaParams)).toBe(expected);
      },
    );
  });

  describe('availableNodesFromQuota', () => {
    it.each([
      ['empty quota with RH Infra params should be 0', emptyQuotaCostList, paramsRhInfra, 0],
      ['CCS quota with RH Infra params should be 0', CCSQuotaList, paramsRhInfra, 0],
      ['Trial quota with RH Infra params should be 0', TrialQuotaList, paramsRhInfra, 0],
      ['ROSA quota with RH Infra params should be 0', ROSAQuotaList, paramsRhInfra, 0],
      ['RH quota with RH Infra params should be 23', rhQuotaList, paramsRhInfra, 23],
      ['MOCK quota with RH Infra params should be 23', mockQuotaList, paramsRhInfra, 23],
      ['empty quota with CCS params should be 0', emptyQuotaCostList, paramsCCS, 0],
      ['Trial quota with CCS params should be 0', TrialQuotaList, paramsCCS, 0],
      ['ROSA CCS quota with CCS params should be 130', ROSACCSQuotaList, paramsCCS, 130],
      ['CCS ROSA quota with CCS params should be 130', CCSROSAQuotaList, paramsCCS, 130],
      ['MOCK quota with CCS params should be 130', mockQuotaList, paramsCCS, 130],
      ['Trial quota with Trial params should be 1', TrialQuotaList, paramsTrial, 2],
      ['CCS quota with Trial params should be 0', CCSQuotaList, paramsTrial, 0],
      ['empty quota with ROSA params should be 0', emptyQuotaCostList, paramsROSA, 0],
      [
        'ROSA CCS quota with ROSA params should be Infinity',
        ROSACCSQuotaList,
        paramsROSA,
        Infinity,
      ],
      [
        'CCS ROSA quota with ROSA params should be Infinity',
        CCSROSAQuotaList,
        paramsROSA,
        Infinity,
      ],
      ['MOCK quota with ROSA params should be Infinity', mockQuotaList, paramsROSA, Infinity],
    ])(
      '%p',
      (title: string, quotaList: QuotaCostList, quotaParams: QuotaParams, expected: number) => {
        expect(availableNodesFromQuota(quotaList, quotaParams)).toBe(expected);
      },
    );
  });

  describe('getAwsBillingAccountsFromQuota', () => {
    it.each([
      ['undefined items', undefined, []],
      ['empty items', [], []],
      [
        'should find the linked aws billing accounts',
        quotaWithAccounts.items,
        quotaWithAccountsExpected,
      ],
      ['should return an empty array if there are no accounts', quotaWithoutAccounts.items, []],
      ['empty quota should be empty', emptyQuotaCostList.items, []],
      ['CCS quota should be empty', CCSQuotaList.items, []],
    ])('%p', (title: string, quotaCost: QuotaCost[] | undefined, expected: any[]) => {
      expect(getAwsBillingAccountsFromQuota(quotaCost)).toEqual(expected);
    });
  });

  describe('hasPotentialQuota', () => {
    it.each([
      ['addon billing quota information', addonsQuotaList, paramsAddons, true],
      [
        'addon billing quota information standard billing model',
        addonsQuotaListStandardBillingModel,
        paramsAddonsStandard,
        false,
      ],
    ])('%p', (title: string, quotaList: QuotaCostList, params: any, expected: boolean) =>
      expect(hasPotentialQuota(quotaList, params)).toBe(expected),
    );
  });

  describe('queryFromCluster', () => {
    it.each([
      ['empty cluster', defaultClusterFromSubscription, expectedDefault],
      ['non empty cluster', cluster, expectedNonDefault],
      [
        'non existing billing model',
        clusterNonExistingBillingModel,
        expectedNonExistingBillingModel,
      ],
    ])('%p', (title: string, cluster: ClusterFromSubscription, expected: QuotaParams) =>
      expect(queryFromCluster(cluster)).toStrictEqual(expected),
    );
  });
});
