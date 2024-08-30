import { useQuery } from '@tanstack/react-query';

import { createViewQueryObject } from '~/common/queryHelpers';
import { queryConstants } from '~/queries/queriesConstants';
import { getSubscriptionQueryType } from '~/services/accountsService';
import { SubscriptionCommonFields } from '~/types/accounts_mgmt.v1';
import { ViewOptions } from '~/types/types';

import isAssistedInstallSubscription from '../../../common/isAssistedInstallerCluster';
import { mapListResponse, normalizeSubscription } from '../../../common/normalize';
import { accountsService } from '../../../services';

import { SubscriptionMapEntry } from './createResponseForFetchCluster';
import { createQueryKey } from './useFetchClustersHelpers';

const fetchGlobalSubscriptions = async (viewOptions: ViewOptions, userName?: string) => {
  const params = createViewQueryObject(viewOptions, userName);

  const response = await accountsService.getSubscriptions(params as getSubscriptionQueryType);
  const subscriptions = mapListResponse(response, normalizeSubscription);

  const items = subscriptions?.data?.items || [];

  const subscriptionMap = new Map<string, SubscriptionMapEntry>();

  items.forEach((item) => {
    if (item.cluster_id) {
      subscriptionMap.set(item.cluster_id, {
        subscription: item,
      });
    }
  });

  const subscriptionIds: string[] = [];

  subscriptionMap.forEach(({ subscription }) => {
    if (isAssistedInstallSubscription(subscription) && subscription.id) {
      subscriptionIds.push(subscription.id);
    }
  });

  const managedSubscriptions = items.filter(
    (subscription) =>
      subscription.managed && subscription.status !== SubscriptionCommonFields.status.DEPROVISIONED,
  );

  return {
    subscriptionIds,
    subscriptionMap,
    managedSubscriptions,
    page: subscriptions?.data?.page || 0,
    total: subscriptions?.data?.total || 0,
  };
};

export const useFetchSubscriptions = ({
  enabled = true,
  viewOptions,
  userName,
}: {
  enabled?: boolean;
  viewOptions: ViewOptions;
  userName?: string;
}) => {
  const queryKey = createQueryKey({ type: 'subscriptions', viewOptions });

  const { data, isLoading, isFetching, isFetched, isError, error } = useQuery({
    queryKey,
    enabled,
    queryFn: () => fetchGlobalSubscriptions(viewOptions, userName),
    staleTime: queryConstants.STALE_TIME,
    refetchInterval: queryConstants.REFETCH_INTERVAL,
  });

  return {
    data,
    isLoading,
    isFetching,
    isFetched,
    isError,
    error,
  };
};
