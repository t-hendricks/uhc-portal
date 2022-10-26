import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { getQuotaParams, hasAvailableQuota, QuotaType } from '../utils';

export const useGetBillingQuotas = (product: string) => {
  const quotaList = useGlobalState((state) => state.userProfile.organization.quotaList);
  const quotaParams = getQuotaParams(product);

  return {
    [QuotaType.OsdTrial]: hasAvailableQuota(quotaList, quotaParams[QuotaType.OsdTrial]),
    [QuotaType.StandardOsd]: hasAvailableQuota(quotaList, quotaParams[QuotaType.StandardOsd]),
    [QuotaType.Marketplace]: hasAvailableQuota(quotaList, quotaParams[QuotaType.Marketplace]),
    [QuotaType.Byoc]: hasAvailableQuota(quotaList, quotaParams[QuotaType.Byoc]),
    [QuotaType.RhInfra]: hasAvailableQuota(quotaList, quotaParams[QuotaType.RhInfra]),
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
