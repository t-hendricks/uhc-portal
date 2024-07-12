import React from 'react';
import { useSelector } from 'react-redux';

import { useQueries, UseQueryResult } from '@tanstack/react-query';

import { subscriptionStatuses } from '~/common/subscriptionTypes';
import { queryClient } from '~/components/App/queryClient';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { ASSISTED_INSTALLER_MERGE_LISTS_FEATURE } from '~/redux/constants/featureConstants';
import { GlobalState } from '~/redux/store';
import { ClusterWithPermissions } from '~/types/types';

import { Region, useFetchRegions } from '../common/useFetchRegions';
import { queryConstants } from '../queriesConstants';

import { fetchPageOfGlobalClusters } from './helpers/fetchGlobalClusters';
import { fetchPageOfRegionalClusters } from './helpers/fetchRegionalClusters';
import { formatCluster } from './formatCluster';
import { useFetchCanEditDelete } from './useFetchCanEditDelete';

const QUERY_TYPE = { GLOBAL: 'global', REGIONAL: 'regional' };
const REFRESH_INTERVAL = 60000; // milliseconds

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
  flags?: { [flag: string]: any },
  nameFilter?: string,
  userName?: string,
) => {
  const { items, total } = region
    ? await fetchPageOfRegionalClusters(page, region, { flags, filter: nameFilter }, userName)
    : await fetchPageOfGlobalClusters(
        page,
        aiMergeListsFeatureFlag,
        { flags, filter: nameFilter },
        userName,
      );
  return {
    items: items?.map((cluster) => formatCluster(cluster)),
    page,
    total,
    region,
  };
};

const queryKey = ({
  page,
  region,
  plans,
  nameFilter,
  showMyClustersOnly,
}: {
  page: number;
  region?: Region | undefined;
  plans?: string[] | undefined;
  nameFilter?: string | undefined;
  showMyClustersOnly?: boolean;
}) => {
  const key = [
    queryConstants.FETCH_CLUSTERS_QUERY_KEY,
    region ? QUERY_TYPE.REGIONAL : QUERY_TYPE.GLOBAL,
    page,
  ];
  if (region && region.region && region.provider) {
    key.push(region.region);
    key.push(region.provider);
  }

  if (plans && plans.length > 0) {
    key.push(...plans);
  }
  if (nameFilter) {
    key.push(nameFilter);
  }
  if (showMyClustersOnly) {
    key.push('showMyClustersOnly');
  }
  return key;
};

const createQuery = ({
  page,
  aiMergeListsFeatureFlag,
  region,
  flags,
  nameFilter,
  userName,
}: {
  page: number;
  aiMergeListsFeatureFlag: boolean;
  region?: Region;
  flags?: { [flag: string]: any };
  nameFilter?: string;
  userName?: string;
}) => ({
  queryKey: queryKey({
    page,
    region,
    plans: flags?.subscriptionFilter?.plan_id,
    nameFilter,
    showMyClustersOnly: flags?.showMyClustersOnly,
  }),
  staleTime: queryConstants.STALE_TIME,
  refetchInterval: queryConstants.REFETCH_INTERVAL,
  queryFn: async () =>
    fetchPageOfClusters(page || 1, aiMergeListsFeatureFlag, region, flags, nameFilter, userName),
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
  const userName = useSelector((state: GlobalState) => state.userProfile.keycloakProfile.username);
  const flags = useSelector((state: GlobalState) => state.viewOptions.CLUSTERS_VIEW?.flags || {});
  const nameFilter = useSelector(
    (state: GlobalState) => state.viewOptions.CLUSTERS_VIEW?.filter || '',
  );

  const [refetchInterval, setRefetchInterval] = React.useState<ReturnType<typeof setInterval>>();
  const [queries, setQueries] = React.useState<CreateQuery[]>([]);

  const getNewData = () => {
    queryClient.invalidateQueries({ queryKey: [queryConstants.FETCH_CLUSTERS_QUERY_KEY] });
  };

  const setRefetch = () => {
    // @ts-ignore
    clearInterval(refetchInterval);
    const intervalId = setInterval(() => {
      getNewData();
    }, REFRESH_INTERVAL);
    setRefetchInterval(intervalId);
  };

  const refetch = () => {
    getNewData();
    setRefetch();
  };

  if (!refetchInterval) {
    setRefetch();
  }

  /* Filter */
  React.useEffect(
    () => {
      setQueries([]);
      // @ts-ignore
      clearInterval(refetchInterval);
      setRefetchInterval(undefined);
      queryClient.removeQueries({
        queryKey: [queryConstants.FETCH_CLUSTERS_QUERY_KEY, QUERY_TYPE.GLOBAL],
      });
      queryClient.removeQueries({
        queryKey: [queryConstants.FETCH_CLUSTERS_QUERY_KEY, QUERY_TYPE.REGIONAL],
      });
    },
    // We only want to run this on filter change so refetchInterval should not be dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flags, nameFilter],
  );

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

      const globalPage1Query = createQuery({
        page: 1,
        aiMergeListsFeatureFlag,
        flags,
        // @ts-ignore
        nameFilter,
        userName,
      });
      setQueries((prev) => [...prev, globalPage1Query]);
    }
    if (regions?.length > 0) {
      const initialRegionQueryList: CreateQuery[] = regions.reduce(
        (initialRegionList: CreateQuery[], region) => {
          if (!isExistingQuery(queries, 1, region)) {
            return [
              ...initialRegionList,

              createQuery({
                page: 1,
                aiMergeListsFeatureFlag,
                region,
                flags,
                // @ts-ignore
                nameFilter,
                userName,
              }),
            ];
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
      const numNextPages = Math.ceil(
        (pageFetched.total - pageFetched.page * queryConstants.PAGE_SIZE) /
          queryConstants.PAGE_SIZE,
      );

      const newQueries: CreateQuery[] = [];
      for (let i = 1; i <= numNextPages; i += 1) {
        const nextPage = pageFetched.page + i;
        const doesNextPageExist = isExistingQuery(queries, nextPage, pageFetched.region);
        if (!doesNextPageExist) {
          newQueries.push(
            createQuery({ page: nextPage, aiMergeListsFeatureFlag, region: pageFetched.region }),
          );
        }
      }
      if (newQueries.length > 0) {
        setQueries((prev) => [...prev, ...newQueries]);
      }

      // Delete query if next page is no longer needed
      const nextPageExist = isExistingQuery(queries, pageFetched.page + 1, pageFetched.region);

      if (pageFetched.total <= pageFetched.page * queryConstants.PAGE_SIZE && nextPageExist) {
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

    data: { items: data?.clusters || [] },

    isError: isError || isCanUpdateDeleteError || isRegionsError,
    errors,
    refetch,
  };
};

export default useFetchClusters;
