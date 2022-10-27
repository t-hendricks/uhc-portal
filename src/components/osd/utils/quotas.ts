import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import { availableQuota, quotaTypes } from '~/components/clusters/common/quotaSelectors';
import { QuotaList } from '~/redux/types';
import { CloudProviderType } from '../ClusterSettings/CloudProvider/types';

interface QuotaParams {
  resourceType: string;
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
}

export const hasAvailableQuota = (quotaList: QuotaList, params: QuotaParams) =>
  availableQuota(quotaList, params) > 0;

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
};
