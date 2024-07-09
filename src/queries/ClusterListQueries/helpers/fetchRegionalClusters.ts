import { getClusterServiceForRegion } from '~/services/clusterService';
import { ClusterWithPermissions } from '~/types/types';

import { normalizeSubscription } from '../../../common/normalize';
import { accountsService } from '../../../services';
import { Region } from '../../common/useFetchRegions';
import { queryConstants } from '../../queriesConstants';

import { createResponseForFetchClusters } from './createResponseForFetchCluster';

export const fetchPageOfRegionalClusters = async (page: number, region: Region) => {
  // Get clusters for a region
  // This gets clusters for a region and then subscriptions
  const clusterService = getClusterServiceForRegion(region.url);
  // NOTE: eventually we may need to filter out the following plan types: RHACS, RHACSTrial, RHOSR, RHOSRTrial, RHOSAK
  const clusterRequestParams = {
    page,
    size: queryConstants.PAGE_SIZE,
  };

  const clusters = await clusterService.getClusters(clusterRequestParams);

  const items = clusters?.data?.items;

  if (!items || items.length === 0) {
    return {
      data: {
        items: [] as ClusterWithPermissions[],
        page: 0,
        total: 0,
        region,
      },
    };
  }

  const subscriptionMap = new Map();
  items.forEach((item) => {
    if (item.subscription?.id) {
      subscriptionMap.set(item.subscription?.id, {
        cluster: item,
      });
    }
  });

  const subscriptionsQuery = `id in (${Array.from(subscriptionMap.keys())
    .map((key) => `'${key}'`)
    .join(',')})`;

  const subscriptionResponse = await accountsService.searchSubscriptions(
    subscriptionsQuery,
    queryConstants.PAGE_SIZE,
  );
  const subscriptions = subscriptionResponse?.data?.items;
  subscriptions?.forEach((subscription) => {
    if (subscription.id) {
      const entry = subscriptionMap.get(subscription.id);
      if (entry !== undefined) {
        // store subscription into subscription map
        entry.subscription = normalizeSubscription(subscription);
      }
    }
  });
  return {
    items: createResponseForFetchClusters(subscriptionMap),
    page: clusters.data.page,
    total: clusters.data.total || 0,
    region,
  };
};
