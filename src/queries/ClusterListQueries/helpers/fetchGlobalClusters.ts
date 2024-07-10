import { allowedProducts, subscriptionStatuses } from '~/common/subscriptionTypes';
import type { Subscription } from '~/types/accounts_mgmt.v1';

import isAssistedInstallSubscription from '../../../common/isAssistedInstallerCluster';
import { mapListResponse, normalizeSubscription } from '../../../common/normalize';
import { accountsService, assistedService, clusterService } from '../../../services';
import { queryConstants } from '../../queriesConstants';

import { createResponseForFetchClusters, MapEntry } from './createResponseForFetchCluster';

const buildSearchClusterQuery = (items: { [field: string]: unknown }[], field: string): string => {
  const IDs = new Set();
  items.forEach((item) => {
    const objectID = item[field];
    if (objectID) {
      IDs.add(`'${objectID}'`);
    }
  });
  return `id in (${Array.from(IDs).join(',')})`;
};

const fetchAIClusters = async (subscriptionIds: string[]) => {
  if (!subscriptionIds) {
    return { aiClusters: [] };
  }
  try {
    const response = await assistedService.getAIClustersBySubscription(subscriptionIds);
    return { aiClusters: response.data };
  } catch (_error) {
    return { aiClusters: [] };
  }
};

const fetchManagedClusters = async (managedSubscriptions: Subscription[] = []) => {
  if (!managedSubscriptions) {
    return { managedClusters: [] };
  }
  const clustersSearchQuery = buildSearchClusterQuery(managedSubscriptions, 'cluster_id');

  const response = await clusterService.searchClusters(clustersSearchQuery);
  return { managedClusters: response.data?.items };
};

const fetchGlobalSubscriptions = async (page: number, aiMergeListsFeatureFlag: boolean) => {
  const sqlString = (s: string) => {
    // escape ' characters by doubling
    const escaped = s.replace(/'/g, "''");
    return `'${escaped}'`;
  };

  const params = {
    filter: `(xcm_id='' OR xcm_id IS NULL) AND (cluster_id!='') AND (plan.id IN (${allowedProducts.map(sqlString).join(', ')})) AND (status NOT IN ('Deprovisioned', 'Archived'))`,
    order: 'created_at desc',
    page,
    page_size: queryConstants.PAGE_SIZE,
  };

  const response = await accountsService.getSubscriptions(params);
  const subscriptions = mapListResponse(response, normalizeSubscription);

  const items =
    subscriptions?.data?.items?.filter(
      (item: Subscription) => aiMergeListsFeatureFlag || !isAssistedInstallSubscription(item),
    ) || [];

  const subscriptionMap = new Map<string, MapEntry>();

  items.forEach((item) => {
    if (item.cluster_id) {
      subscriptionMap.set(item.cluster_id, {
        subscription: item,
      });
    }
  });

  const subscriptionIds: string[] = [];

  if (aiMergeListsFeatureFlag) {
    subscriptionMap.forEach(({ subscription }) => {
      if (isAssistedInstallSubscription(subscription) && subscription.id) {
        subscriptionIds.push(subscription.id);
      }
    });
  }

  const managedSubscriptions = items.filter(
    (s) => s.managed && s.status !== subscriptionStatuses.DEPROVISIONED,
  );

  return {
    subscriptionIds,
    subscriptionMap,
    managedSubscriptions,
    page: subscriptions?.data?.page || 0,
    total: subscriptions?.data?.total || 0,
  };
};

export const fetchPageOfGlobalClusters = async (page: number, aiMergeListsFeatureFlag: boolean) => {
  // Get global region clusters
  // This gets the subscriptions list first then clusters
  const { subscriptionIds, subscriptionMap, managedSubscriptions, total } =
    await fetchGlobalSubscriptions(page, aiMergeListsFeatureFlag);

  const [{ aiClusters }, { managedClusters }] = await Promise.all([
    fetchAIClusters(subscriptionIds),
    fetchManagedClusters(managedSubscriptions),
  ]);

  if (aiClusters) {
    aiClusters.forEach((aiCluster) => {
      const entry = subscriptionMap.get(aiCluster.id);
      if (entry) {
        entry.aiCluster = aiCluster;
      }
    });
  }

  if (managedClusters) {
    managedClusters.forEach((cluster) => {
      if (cluster.id) {
        const entry = subscriptionMap.get(cluster.id);
        if (entry !== undefined) {
          // store cluster into subscription map
          entry.cluster = cluster;
        }
      }
    });
  }

  return {
    items: createResponseForFetchClusters(subscriptionMap),
    page,
    total,
  };
};
