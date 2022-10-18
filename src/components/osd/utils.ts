import React from 'react';
import { useDispatch } from 'react-redux';

import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { billingModels, normalizedProducts } from '~/common/subscriptionTypes';
import { availableQuota, quotaTypes } from '~/components/clusters/common/quotaSelectors';
import { getOrganizationAndQuota } from '~/redux/actions/userActions';

interface QuotaParams {
  resourceType: string;
  product: string;
  billingModel?: string;
  cloudProviderID?: string;
  isBYOC?: boolean;
  isMultiAz?: boolean;
  resourceName?: string;
}

export const useGetQuotas = (product: string): Record<string, boolean> => {
  const dispatch = useDispatch();
  const userProfile = useGlobalState((state) => state.userProfile);

  React.useEffect(() => {
    dispatch(getOrganizationAndQuota());
  }, []);

  const quotaQuery = (params: QuotaParams) =>
    availableQuota(userProfile.organization.quotaList, params) > 0;

  return {
    osdTrial: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      product: normalizedProducts.OSDTrial,
    }),
    standardOsd: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      product: normalizedProducts.OSD,
      billingModel: billingModels.STANDARD,
    }),
    marketplace: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      product: normalizedProducts.OSD,
      billingModel: billingModels.MARKETPLACE,
    }),
    byoc: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      billingModel: billingModels.STANDARD,
      product,
      isBYOC: true,
    }),
    rhInfra: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      billingModel: billingModels.STANDARD,
      product,
      isBYOC: false,
    }),
    marketplaceByoc: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      billingModel: billingModels.MARKETPLACE,
      product: normalizedProducts.OSD,
      isBYOC: true,
    }),
    marketplaceRhInfra: quotaQuery({
      resourceType: quotaTypes.CLUSTER,
      billingModel: billingModels.MARKETPLACE,
      product: normalizedProducts.OSD,
      isBYOC: false,
    }),
  };
};
