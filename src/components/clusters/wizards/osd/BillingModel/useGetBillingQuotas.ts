import { useGlobalState } from '~/redux/hooks/useGlobalState';
import {
  quotaParams,
  hasAvailableQuota,
  QuotaType,
} from '~/components/clusters/wizards/common/utils';

export const useGetBillingQuotas = (product: string) => {
  const quotaList = useGlobalState((state) => state.userProfile.organization.quotaList);

  return {
    [QuotaType.OsdTrial]: hasAvailableQuota(quotaList, quotaParams[QuotaType.OsdTrial]),
    [QuotaType.StandardOsd]: hasAvailableQuota(quotaList, quotaParams[QuotaType.StandardOsd]),
    [QuotaType.Marketplace]: hasAvailableQuota(quotaList, quotaParams[QuotaType.Marketplace]),
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
