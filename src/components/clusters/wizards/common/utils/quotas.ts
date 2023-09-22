import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import { availableQuota, quotaTypes } from '~/components/clusters/common/quotaSelectors';
import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import { Quota } from '~/types/accounts_mgmt.v1';

export interface QuotaParams {
  resourceType?: string;
  product: string;
  billingModel?: string;
  cloudProviderID?: string;
  isBYOC?: boolean;
  isMultiAz?: boolean;
  resourceName?: string;
}

export enum QuotaType {
  OsdTrial = 'osdTrial',
  StandardOsd = 'standardOsd',
  Marketplace = 'marketplace',
  Byoc = 'byoc',
  RhInfra = 'rhInfra',
  MarketplaceByoc = 'marketplaceByoc',
  MarketplaceRhInfra = 'marketplaceRhInfra',
  GcpResources = 'gcpResources',
  AwsResources = 'awsResources',
  SingleAzResources = 'singleAzResources',
  MultiAzResources = 'multiAzResources',
}

export const hasAvailableQuota = (
  quotaList:
    | {
        items?: Quota[];
      }
    | undefined,
  params: QuotaParams,
) => !!quotaList && availableQuota(quotaList, params) > 0;

export const quotaParams = {
  [QuotaType.OsdTrial]: {
    resourceType: quotaTypes.CLUSTER,
    product: normalizedProducts.OSDTrial,
  },
  [QuotaType.StandardOsd]: {
    resourceType: quotaTypes.CLUSTER,
    product: normalizedProducts.OSD,
    billingModel: billingModels.STANDARD,
  },
  [QuotaType.Marketplace]: {
    resourceType: quotaTypes.CLUSTER,
    product: normalizedProducts.OSD,
    billingModel: billingModels.MARKETPLACE,
  },
  [QuotaType.Byoc]: {
    resourceType: quotaTypes.CLUSTER,
    billingModel: billingModels.STANDARD,
    isBYOC: true,
  },
  [QuotaType.RhInfra]: {
    resourceType: quotaTypes.CLUSTER,
    billingModel: billingModels.STANDARD,
    isBYOC: false,
  },
  [QuotaType.MarketplaceByoc]: {
    resourceType: quotaTypes.CLUSTER,
    billingModel: billingModels.MARKETPLACE,
    product: normalizedProducts.OSD,
    isBYOC: true,
  },
  [QuotaType.MarketplaceRhInfra]: {
    resourceType: quotaTypes.CLUSTER,
    billingModel: billingModels.MARKETPLACE,
    product: normalizedProducts.OSD,
    isBYOC: false,
  },
  [QuotaType.GcpResources]: {
    resourceType: quotaTypes.CLUSTER,
    cloudProviderID: CloudProviderType.Gcp,
  },
  [QuotaType.AwsResources]: {
    resourceType: quotaTypes.CLUSTER,
    cloudProviderID: CloudProviderType.Aws,
  },
  [QuotaType.SingleAzResources]: {
    resourceType: quotaTypes.CLUSTER,
    isMultiAz: false,
  },
  [QuotaType.MultiAzResources]: {
    resourceType: quotaTypes.CLUSTER,
    isMultiAz: true,
  },
};
