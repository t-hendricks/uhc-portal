import { getClusterServiceForRegion } from '~/services/clusterService';
import { ClusterWithPermissions } from '~/types/types';

import { normalizeSubscription } from '../../../common/normalize';
import { accountsService } from '../../../services';
import { Region } from '../../common/useFetchRegions';
import { queryConstants } from '../../queriesConstants';

import { createResponseForFetchClusters } from './createResponseForFetchCluster';

type ModifiedViewOptions = {
  filter?: string;
  flags?: { [flag: string]: any };
};

export const fetchPageOfRegionalClusters = async (
  page: number,
  region: Region,
  viewOptions?: ModifiedViewOptions,
  userName?: string,
) => {
  // Get clusters for a region
  // This gets clusters for a region and then subscriptions
  const clusterService = getClusterServiceForRegion(region.url);
  const clusterRequestParams = {
    page,
    size: queryConstants.PAGE_SIZE,
    search: '',
  };
  if (viewOptions?.filter) {
    clusterRequestParams.search = `(display_name ILIKE '%${viewOptions.filter}%' OR external_id ILIKE '%${viewOptions.filter}%' OR id ILIKE '%${viewOptions.filter}%')`;
  }

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

  // Because plan is not known to the cluster service, we need to manually filter them out
  // NOTE: eventually we may need to filter out the following plan types: RHACS, RHACSTrial, RHOSR, RHOSRTrial, RHOSAK

  let returnItems = createResponseForFetchClusters(subscriptionMap);

  const filterPlanIds = viewOptions?.flags?.subscriptionFilter?.plan_id;

  if (filterPlanIds && filterPlanIds.length > 0) {
    returnItems = returnItems.filter((cluster) =>
      filterPlanIds.some((plan: string) => plan === cluster.product?.id),
    );
  }

  // Because creator is not known to the cluster service, we need to manually filter out manually
  if (viewOptions?.flags?.showMyClustersOnly && userName) {
    returnItems = returnItems.filter(
      (cluster) => cluster.subscription?.creator?.username === userName,
    );
  }

  const numberFilteredOut = subscriptionMap.size - returnItems.length;

  return {
    items: returnItems,
    page: clusters.data.page,
    total: clusters.data.total - numberFilteredOut || 0,
    region,
  };
};
