import React from 'react';
import isEmpty from 'lodash/isEmpty';

import type { Cluster as AICluster } from '@openshift-assisted/types/assisted-installer-service';
import { useQueries, UseQueryResult } from '@tanstack/react-query';

import { allowedProducts, subscriptionStatuses } from '~/common/subscriptionTypes';
import { queryClient } from '~/components/App/queryClient';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { ASSISTED_INSTALLER_MERGE_LISTS_FEATURE } from '~/redux/constants/featureConstants';
import { getClusterServiceForRegion } from '~/services/clusterService';
import type { Subscription } from '~/types/accounts_mgmt.v1';
import type { Cluster } from '~/types/clusters_mgmt.v1';
import { ClusterWithPermissions } from '~/types/types';

import isAssistedInstallSubscription from '../../common/isAssistedInstallerCluster';
import {
  fakeClusterFromAISubscription,
  fakeClusterFromSubscription,
  mapListResponse,
  normalizeCluster,
  normalizeMetrics,
  normalizeSubscription,
} from '../../common/normalize';
import { accountsService, assistedService, clusterService } from '../../services';
import { Region, useFetchRegions } from '../common/useFetchRegions';
import { queryConstants } from '../queriesConstants';

import { formatCluster } from './formatCluster';
import { useFetchCanEditDelete } from './useFetchCanEditDelete';

/* ************** CONFIGS **************** */
const staleTime = queryConstants.STALE_TIME;
const refetchInterval = queryConstants.REFETCH_INTERVAL;
const pageSize = queryConstants.PAGE_SIZE;

const QUERY_TYPE = { GLOBAL: 'global', REGIONAL: 'regional' };

/* ************** Types **************** */

type MapEntry = { aiCluster?: AICluster; cluster?: Cluster; subscription: Subscription };

type FetchClusterQueryResults = UseQueryResult & {
  data?: {
    items: any[];
    page: number;
    total: number;
    region: Region;
  };
  errors?: Error[];
};

/* ************** Finalize list of clusters  **************** */
// This transforms list of subscriptions to include canEdit and canDelete information
// NOTE: this is a copy from src/redux/actions
const createResponseForFetchClusters = (subscriptionMap: Map<string, MapEntry>) => {
  const result: ClusterWithPermissions[] = [];
  subscriptionMap.forEach((entry) => {
    let cluster: ClusterWithPermissions;
    if (
      entry.subscription.managed &&
      entry.subscription.status !== subscriptionStatuses.DEPROVISIONED &&
      !!entry?.cluster &&
      !isEmpty(entry?.cluster)
    ) {
      // managed cluster, with data from Clusters Service
      cluster = {
        ...normalizeCluster(entry.cluster),
        subscription: entry.subscription,
        // TODO HAC-2355: entry.subscription.metrics is an array but normalizeMetrics wants a single metric
        // @ts-ignore
        metrics: normalizeMetrics(entry.subscription.metrics),
      };
    } else {
      cluster = isAssistedInstallSubscription(entry.subscription)
        ? fakeClusterFromAISubscription(entry.subscription, entry.aiCluster)
        : fakeClusterFromSubscription(entry.subscription);
    }

    // mark this as a clusters service cluster with partial data (happens when CS is down)
    cluster.partialCS = cluster.managed && (!entry?.cluster || isEmpty(entry?.cluster));

    cluster.subscription = entry.subscription;
    result.push(cluster);
  });
  return result;
};

/* ************** Fetch a page of  global clusters *************** */
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
    page_size: pageSize,
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

const fetchPageOfGlobalClusters = async (page: number, aiMergeListsFeatureFlag: boolean) => {
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

/* ************** Fetch a page of  regional clusters *************** */

const fetchPageOfRegionalClusters = async (page: number, region: Region) => {
  // Get clusters for a region
  // This gets clusters for a region and then subscriptions
  const clusterService = getClusterServiceForRegion(region.url);
  // NOTE: eventually we may need to filter out the following plan types: RHACS, RHACSTrial, RHOSR, RHOSRTrial, RHOSAK
  const clusterRequestParams = {
    page,
    size: pageSize,
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

/* ************** Fetch a page of clusters *************** */

const fetchPageOfClusters = async (
  page: number,
  aiMergeListsFeatureFlag: boolean,
  region?: Region,
) => {
  const { items, total } = region
    ? await fetchPageOfRegionalClusters(page, region)
    : await fetchPageOfGlobalClusters(page, aiMergeListsFeatureFlag);

  return {
    items: items?.map((cluster) => formatCluster(cluster)),
    page,
    total,
    region,
  };
};

/* ************** Create fetchClusters query obj *************** */
const queryKey = (page: number, region: Region | undefined) => {
  if (region) {
    return [
      queryConstants.FETCH_CLUSTERS_QUERY_KEY,
      QUERY_TYPE.REGIONAL,
      page,
      region.region,
      region.provider,
    ];
  }
  return [queryConstants.FETCH_CLUSTERS_QUERY_KEY, QUERY_TYPE.GLOBAL, page];
};

const createQuery = (page: number, aiMergeListsFeatureFlag: boolean, region?: Region) => ({
  queryKey: queryKey(page, region),
  staleTime,
  refetchInterval,
  queryFn: async () => fetchPageOfClusters(page || 1, aiMergeListsFeatureFlag, region),
});

type CreateQuery = ReturnType<typeof createQuery>;

/* ****************** MAIN EXPORT ****************** */

const isExistingQuery = (queries: any[], page: number, region: Region | undefined = undefined) =>
  (queries || []).some((query: any) => {
    if (!region) {
      const [mainKey, queryType, queryPage] = query.queryKey;
      return (
        mainKey === queryConstants.FETCH_CLUSTERS_QUERY_KEY &&
        queryType === QUERY_TYPE.GLOBAL &&
        queryPage === page
      );
    }

    const [mainKey, queryType, queryPage, queryRegion, queryProvider] = query.queryKey;
    return (
      mainKey === queryConstants.FETCH_CLUSTERS_QUERY_KEY &&
      queryType === QUERY_TYPE.REGIONAL &&
      queryRegion === region.region &&
      queryProvider === region.provider &&
      queryPage === page
    );
  });

export const useFetchClusters = () => {
  const {
    isLoading: isCanUpdateDeleteLoading,
    isFetching: isCanUpdateDeleteFetching,
    canEdit,
    canDelete,
    isError: isCanUpdateDeleteError,
  } = useFetchCanEditDelete({
    mainQueryKey: queryConstants.FETCH_CLUSTERS_QUERY_KEY,
    staleTime,
    refetchInterval,
  });

  const aiMergeListsFeatureFlag = useFeatureGate(ASSISTED_INSTALLER_MERGE_LISTS_FEATURE);

  const {
    isLoading: isRegionsLoading,
    isFetching: isRegionsFetching,
    data: regions,
    isError: isRegionsError,
  } = useFetchRegions({
    mainQueryKey: queryConstants.FETCH_CLUSTERS_QUERY_KEY,
    staleTime,
    refetchInterval,
    returnAll: false,
  });

  const [queries, setQueries] = React.useState<CreateQuery[]>([]);

  // Start to get initial queries
  if (
    !isCanUpdateDeleteLoading &&
    !isCanUpdateDeleteError &&
    aiMergeListsFeatureFlag !== undefined &&
    !!canEdit &&
    !!canDelete
  ) {
    if (!isExistingQuery(queries, 1)) {
      // start to get global (non regional) clusters
      const globalPage1Query = createQuery(1, aiMergeListsFeatureFlag);
      setQueries((prev) => [...prev, globalPage1Query]);
    }
    if (regions?.length > 0) {
      const initialRegionQueryList: CreateQuery[] = regions.reduce(
        (initialRegionList: CreateQuery[], region) => {
          if (!isExistingQuery(queries, 1, region)) {
            return [...initialRegionList, createQuery(1, aiMergeListsFeatureFlag, region)];
          }
          return initialRegionList;
        },
        [],
      );

      if (initialRegionQueryList.length > 0) {
        setQueries((prev) => [...prev, ...initialRegionQueryList]);
      }
    }
  }

  const { isLoading, data, isError, errors, isFetching } = useQueries({
    queries,
    // @ts-ignore Unsure why the type is incorrect for the next line
    combine: React.useCallback(
      (results: FetchClusterQueryResults[]) => {
        const pagesFetched: { total: number; page: number; region: Region }[] = [];

        results.forEach((result) => {
          if (result.data) {
            const newPage = {
              total: result.data.total,
              page: result.data.page,
              region: result.data.region,
            };
            pagesFetched.push(newPage);
          }
        });

        let data;
        if (results.some((result) => !!result.data)) {
          data = results.reduce((dataArray, result) => {
            /* Modify the results based on other React Queries - in this case canEdit and canDelete */
            const modifiedClusters = (result.data?.items || []).map((cluster) => {
              const modifiedCluster = { ...cluster };

              modifiedCluster.canEdit =
                !cluster.partialCS &&
                (canEdit['*'] || (!!cluster.id && !!canEdit[cluster.id])) &&
                cluster.subscription.status !== subscriptionStatuses.DEPROVISIONED;

              modifiedCluster.canDelete =
                !cluster.partialCS &&
                (canDelete['*'] || (!!cluster.id && !!canDelete[cluster.id!]));
              return modifiedCluster;
            });

            return dataArray.concat(modifiedClusters);
          }, [] as ClusterWithPermissions[]);
        }

        return {
          isLoading: results.some((result) => result.isLoading),
          isFetching: results.some((result) => result.isFetching),
          isError: results.some((result) => result.isError),
          errors: results.reduce(
            (errors, result) => (result.error ? [...errors, result.error] : errors),
            [] as Error[],
          ),

          data: { pagesFetched, clusters: data },
        };
      },
      [canDelete, canEdit],
    ),
  });

  // Add queries for additional pages if they already don't exist
  if (data?.pagesFetched) {
    data.pagesFetched.forEach((pageFetched) => {
      const nextPageExist = isExistingQuery(queries, pageFetched.page + 1, pageFetched.region);

      if (pageFetched.total > pageFetched.page * pageSize && !nextPageExist) {
        // next page needs to be added
        setQueries((prev) => [
          ...prev,
          createQuery(pageFetched.page + 1, aiMergeListsFeatureFlag, pageFetched.region),
        ]);
      }
      if (pageFetched.total <= pageFetched.page * pageSize && nextPageExist) {
        // Delete query that is no longer needed
        const fetchedPageType = pageFetched.region ? QUERY_TYPE.REGIONAL : QUERY_TYPE.GLOBAL;

        setQueries((prev) =>
          prev.filter((query) => {
            const [_fetchClustersQueryKey, queryType, page, region, provider] = query.queryKey;

            if (fetchedPageType !== queryType) {
              return true;
            }
            if (pageFetched.region) {
              return (
                page !== pageFetched.page + 1 ||
                region !== pageFetched.region.region ||
                provider !== pageFetched.region.provider
              );
            }

            return page !== pageFetched.page + 1;
          }),
        );
        if (pageFetched.region) {
          queryClient.removeQueries({
            queryKey: [
              queryConstants.FETCH_CLUSTERS_QUERY_KEY,
              QUERY_TYPE.REGIONAL,
              pageFetched.page + 1,
              pageFetched.region.region,
              pageFetched.region.provider,
            ],
          });
        } else {
          queryClient.removeQueries({
            queryKey: [
              queryConstants.FETCH_CLUSTERS_QUERY_KEY,
              QUERY_TYPE.REGIONAL,
              pageFetched.page + 1,
            ],
          });
        }
      }
    });
  }

  return {
    // The logic for isLoading is neccessary because there is a gap when isCanUpdateDeleteLoading
    // goes from true to false and when isLoading turns from false to true
    // This can cause a "flash" in the UI
    isLoading:
      isLoading ||
      isCanUpdateDeleteLoading ||
      isRegionsLoading ||
      (data.clusters === undefined && !isError && !isCanUpdateDeleteError && !isRegionsError),

    isFetching:
      isFetching ||
      isCanUpdateDeleteFetching ||
      isRegionsFetching ||
      (data.clusters === undefined && !isError && !isCanUpdateDeleteError && !isRegionsError),

    // Until sorting/pagination is enabled -  sort by creation date
    data: { items: data?.clusters || [] },

    isError: isError || isCanUpdateDeleteError || isRegionsError,
    errors,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: [queryConstants.FETCH_CLUSTERS_QUERY_KEY] });
    },
  };
};

export default useFetchClusters;
