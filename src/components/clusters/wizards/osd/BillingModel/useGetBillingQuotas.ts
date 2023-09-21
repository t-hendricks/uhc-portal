import { useGlobalState } from '~/redux/hooks/useGlobalState';
import {
  quotaParams,
  hasAvailableQuota,
  QuotaType,
  QuotaParams,
} from '~/components/clusters/wizards/common/utils/quotas';

export const useGetBillingQuotas = (params: QuotaParams) => {
  const quotaList = useGlobalState((state) => state.userProfile.organization.quotaList);
  const { product, billingModel, isBYOC } = params;
  return {
    [QuotaType.OsdTrial]: hasAvailableQuota(quotaList, quotaParams[QuotaType.OsdTrial]),
    [QuotaType.StandardOsd]: hasAvailableQuota(quotaList, quotaParams[QuotaType.StandardOsd]),
    [QuotaType.Marketplace]: hasAvailableQuota(quotaList, quotaParams[QuotaType.Marketplace]),
    [QuotaType.GcpResources]: hasAvailableQuota(quotaList, {
      ...quotaParams[QuotaType.GcpResources],
      product,
      billingModel,
      isBYOC,
    }),
    [QuotaType.AwsResources]: hasAvailableQuota(quotaList, {
      ...quotaParams.awsResources,
      product,
      billingModel,
      isBYOC,
    }),
    [QuotaType.Byoc]: hasAvailableQuota(quotaList, { ...quotaParams[QuotaType.Byoc], product }),
    [QuotaType.RhInfra]: hasAvailableQuota(quotaList, {
      ...quotaParams[QuotaType.RhInfra],
      product,
    }),
    [QuotaType.MarketplaceByoc]: hasAvailableQuota(
      quotaList,
      quotaParams[QuotaType.MarketplaceByoc],
    ),
    [QuotaType.MarketplaceRhInfra]: hasAvailableQuota(
      quotaList,
      quotaParams[QuotaType.MarketplaceRhInfra],
    ),
  };
};
