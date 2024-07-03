import React from 'react';

import { useQueries, UseQueryResult } from '@tanstack/react-query';

import { subscriptionStatuses } from '~/common/subscriptionTypes';
import { queryClient } from '~/components/App/queryClient';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { ASSISTED_INSTALLER_MERGE_LISTS_FEATURE } from '~/redux/constants/featureConstants';
import { ClusterWithPermissions } from '~/types/types';

import { Region, useFetchRegions } from '../common/useFetchRegions';
import { queryConstants } from '../queriesConstants';

import { fetchPageOfGlobalClusters } from './helpers/fetchGlobalClusters';
import { fetchPageOfRegionalClusters } from './helpers/fetchRegionalClusters';
import { formatCluster } from './formatCluster';
import { useFetchCanEditDelete } from './useFetchCanEditDelete';

const QUERY_TYPE = { GLOBAL: 'global', REGIONAL: 'regional' };

type FetchClusterQueryResults = UseQueryResult & {
  data?: {
    items: any[];
    page: number;
    total: number;
    region: Region;
  };
  errors?: Error[];
};

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
  staleTime: queryConstants.STALE_TIME,
  refetchInterval: queryConstants.REFETCH_INTERVAL,
  queryFn: async () => fetchPageOfClusters(page || 1, aiMergeListsFeatureFlag, region),
});

type CreateQuery = ReturnType<typeof createQuery>;

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

/* ****************** MAIN EXPORT ****************** */

export const useFetchClusters = () => {
  const {
    isLoading: isCanUpdateDeleteLoading,
    isFetching: isCanUpdateDeleteFetching,
    canEdit,
    canDelete,
    isError: isCanUpdateDeleteError,
  } = useFetchCanEditDelete({
    mainQueryKey: queryConstants.FETCH_CLUSTERS_QUERY_KEY,
    staleTime: queryConstants.STALE_TIME,
    refetchInterval: queryConstants.REFETCH_INTERVAL,
  });

  const aiMergeListsFeatureFlag = useFeatureGate(ASSISTED_INSTALLER_MERGE_LISTS_FEATURE);

  const {
    isLoading: isRegionsLoading,
    isFetching: isRegionsFetching,
    data: regions,
    isError: isRegionsError,
  } = useFetchRegions({
    mainQueryKey: queryConstants.FETCH_CLUSTERS_QUERY_KEY,
    staleTime: queryConstants.STALE_TIME,
    refetchInterval: queryConstants.REFETCH_INTERVAL,
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

      if (pageFetched.total > pageFetched.page * queryConstants.PAGE_SIZE && !nextPageExist) {
        // next page needs to be added
        setQueries((prev) => [
          ...prev,
          createQuery(pageFetched.page + 1, aiMergeListsFeatureFlag, pageFetched.region),
        ]);
      }
      if (pageFetched.total <= pageFetched.page * queryConstants.PAGE_SIZE && nextPageExist) {
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
