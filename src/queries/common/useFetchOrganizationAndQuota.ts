import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { accountsService } from '~/services';

import { useFetchOrganizationQuota } from '../ClusterDetailsQueries/useFetchOrganizationQuota';
import { queryConstants } from '../queriesConstants';

export type FetchQueryResults = UseQueryResult & {
  data?: {
    managedClusters?: any[];
    aiClusters?: any[];
  };
};

export const useFetchOrganizationAndQuota = () => {
  const { isLoading, isError, data, error, isFetched } = useQuery({
    queryKey: [queryConstants.FETCH_ORG_AND_QUOTA, 'getCurrentOrganizationId'],
    queryFn: () => accountsService.getCurrentAccount(),
  });

  const orgID = data?.data?.organization?.id;

  const {
    isLoading: quotaIsLoading,
    isError: quotaIsError,
    data: quotaData,
    error: quotaError,
    // @ts-ignore technically orgID cannot be undefined, but the queryFn isn't run unless orgID has a value = see enabled inside of useFetchOrganizationQuota
  } = useFetchOrganizationQuota(orgID);

  const {
    isLoading: orgIsLoading,
    isError: orgIsError,
    data: orgData,
    error: orgError,
    isFetched: orgIsFetched,
  } = useQuery({
    queryKey: [queryConstants.FETCH_ORG_AND_QUOTA, 'getOrganization'],
    // @ts-ignore technically orgID cannot be undefined, but the queryFn isn't run unless orgID has a value = see enabled
    queryFn: () => accountsService.getOrganization(orgID),
    enabled: !!orgID,
  });

  return {
    isLoading: isLoading || quotaIsLoading || orgIsLoading,
    isError: isError || quotaIsError || orgIsError,
    error: error || quotaError || orgError,
    isFetched: isFetched && !quotaIsLoading && orgIsFetched,
    id: orgID,
    quota: quotaData?.organizationQuota,
    organization: orgData,
  };
};
