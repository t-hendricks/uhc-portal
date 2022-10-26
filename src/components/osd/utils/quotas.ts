import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import { availableQuota, quotaTypes } from '~/components/clusters/common/quotaSelectors';
import { QuotaList } from '~/redux/types';

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
}

export const hasAvailableQuota = (quotaList: QuotaList, params: QuotaParams) =>
  availableQuota(quotaList, params) > 0;

export const getQuotaParams = (product: string) => ({
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
    product,
    isBYOC: true,
  },
  [QuotaType.RhInfra]: {
    resourceType: quotaTypes.CLUSTER,
    billingModel: billingModels.STANDARD,
    product,
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
});
