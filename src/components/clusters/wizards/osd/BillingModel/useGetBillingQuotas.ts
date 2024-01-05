import { useGlobalState } from '~/redux/hooks/useGlobalState';
import {
  quotaParams as wizardQuotaParams,
  hasAvailableQuota,
  QuotaType,
} from '~/components/clusters/wizards/common/utils/quotas';
import { QuotaCostList } from '~/types/accounts_mgmt.v1';
import { QuotaParams } from '~/components/clusters/common/quotaModel';

export const useGetBillingQuotas = (quotaParams: QuotaParams) => {
  const quotaList = useGlobalState(
    (state) => state.userProfile.organization.quotaList,
  ) as QuotaCostList;
  const { product, billingModel, isBYOC } = quotaParams;
  return {
    [QuotaType.OsdTrial]: hasAvailableQuota(quotaList, wizardQuotaParams[QuotaType.OsdTrial]),
    [QuotaType.StandardOsd]: hasAvailableQuota(quotaList, wizardQuotaParams[QuotaType.StandardOsd]),
    [QuotaType.Marketplace]: hasAvailableQuota(quotaList, wizardQuotaParams[QuotaType.Marketplace]),
    [QuotaType.GcpResources]: hasAvailableQuota(quotaList, {
      ...wizardQuotaParams[QuotaType.GcpResources],
      product,
      billingModel,
      isBYOC,
    }),
    [QuotaType.AwsResources]: hasAvailableQuota(quotaList, {
      ...wizardQuotaParams.awsResources,
      product,
      billingModel,
      isBYOC,
    }),
    [QuotaType.Byoc]: hasAvailableQuota(quotaList, {
      ...wizardQuotaParams[QuotaType.Byoc],
      product,
    }),
    [QuotaType.RhInfra]: hasAvailableQuota(quotaList, {
      ...wizardQuotaParams[QuotaType.RhInfra],
      product,
    }),
    [QuotaType.MarketplaceByoc]: hasAvailableQuota(
      quotaList,
      wizardQuotaParams[QuotaType.MarketplaceByoc],
    ),
    [QuotaType.MarketplaceRhInfra]: hasAvailableQuota(
      quotaList,
      wizardQuotaParams[QuotaType.MarketplaceRhInfra],
    ),
  };
};
